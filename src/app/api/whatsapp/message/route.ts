import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

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

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);

    // Evitar duplicados usando query SQL directa vía HTTP para evitar sobrecarga de WASM
    const existing = await sql`SELECT id FROM whatsapp_messages WHERE id = ${id} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json(
        { success: true, duplicate: true },
        { headers: corsHeaders }
      );
    }

    const dbBrandId = brandId ?? 'unknown';
    
    // Deterministic short hash function for chatId anonymization
    const getShortHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return 'Cliente_' + Math.abs(hash).toString(16).toUpperCase().padStart(6, '0');
    };

    const dbChatId = chatId ? getShortHash(chatId) : 'unknown';
    const dbSender = 'Cliente';
    const dbContent = ''; // Discard the actual text content for absolute privacy
    const dbTimestamp = timestamp ? new Date(timestamp) : new Date();

    await sql`
      INSERT INTO whatsapp_messages (id, "brandId", "chatId", sender, content, direction, timestamp, "createdAt")
      VALUES (${id}, ${dbBrandId}, ${dbChatId}, ${dbSender}, ${dbContent}, ${direction}, ${dbTimestamp}, ${new Date()})
    `;

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
