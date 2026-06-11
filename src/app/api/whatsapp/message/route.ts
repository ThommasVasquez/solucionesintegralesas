import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, brandId, chatId, sender, content, timestamp, direction } = body;

    if (!id || !content || !direction) {
      return NextResponse.json(
        { success: false, error: 'Payload incompleto' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Evitar duplicados (el script puede reintentar)
    const existing = await prisma.whatsAppMessage.findUnique({ where: { id } });
    if (existing) {
      return NextResponse.json(
        { success: true, duplicate: true },
        { headers: corsHeaders }
      );
    }

    await prisma.whatsAppMessage.create({
      data: {
        id,
        brandId:   brandId  ?? 'unknown',
        chatId:    chatId   ?? 'unknown',
        sender:    sender   ?? 'unknown',
        content,
        direction,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[/api/whatsapp/message]', error);
    return NextResponse.json(
      { success: false, error: 'Error interno', details: error?.message || String(error), stack: error?.stack },
      { status: 500, headers: corsHeaders }
    );
  }
}
