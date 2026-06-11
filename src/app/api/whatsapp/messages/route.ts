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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');   // filtro opcional
    const chatId  = searchParams.get('chatId');    // filtro opcional
    const limit   = parseInt(searchParams.get('limit') ?? '50');

    const messages = await prisma.whatsAppMessage.findMany({
      where: {
        ...(brandId ? { brandId } : {}),
        ...(chatId  ? { chatId }  : {}),
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    // Retorna tanto 'data' como 'messages' para ser compatible con el dashboard y nuevos consumidores
    return NextResponse.json(
      { success: true, messages, data: messages },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error en GET /api/whatsapp/messages:', error);
    return NextResponse.json(
      { success: false, error: 'Error leyendo mensajes', details: error?.message || String(error), stack: error?.stack },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');

    await prisma.whatsAppMessage.deleteMany({
      where: brandId ? { brandId } : {},
    });
    return NextResponse.json(
      { success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error en DELETE /api/whatsapp/messages:', error);
    return NextResponse.json(
      { success: false, error: 'Error vaciando mensajes' },
      { status: 500, headers: corsHeaders }
    );
  }
}
