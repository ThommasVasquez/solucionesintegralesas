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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');   // filtro opcional
    const chatId  = searchParams.get('chatId');    // filtro opcional
    const limit   = parseInt(searchParams.get('limit') ?? '50');

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    let messages: any[] = [];

    // Ejecutar consultas SQL directas vía HTTP para un rendimiento óptimo y libre de timeouts de WASM en Edge
    if (brandId && chatId) {
      messages = await sql`
        SELECT * FROM whatsapp_messages 
        WHERE ("brandId" = ${brandId} OR "brandId" = 'unknown') AND "chatId" = ${chatId} 
        ORDER BY timestamp DESC 
        LIMIT ${limit}
      `;
    } else if (brandId) {
      messages = await sql`
        SELECT * FROM whatsapp_messages 
        WHERE "brandId" = ${brandId} OR "brandId" = 'unknown' 
        ORDER BY timestamp DESC 
        LIMIT ${limit}
      `;
    } else if (chatId) {
      messages = await sql`
        SELECT * FROM whatsapp_messages 
        WHERE "chatId" = ${chatId} 
        ORDER BY timestamp DESC 
        LIMIT ${limit}
      `;
    } else {
      messages = await sql`
        SELECT * FROM whatsapp_messages 
        ORDER BY timestamp DESC 
        LIMIT ${limit}
      `;
    }

    // Mapear objetos a una estructura limpia con fechas serializables
    const plainMessages = messages.map((m: any) => ({
      id: m.id,
      brandId: m.brandId,
      chatId: m.chatId,
      sender: m.sender,
      content: m.content,
      direction: m.direction,
      timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : String(m.timestamp),
      createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
    }));

    // Retorna tanto 'data' como 'messages' para ser compatible con el dashboard y nuevos consumidores
    return NextResponse.json(
      { success: true, messages: plainMessages, data: plainMessages },
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

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    // Usar el cliente HTTP directo de Neon para evitar que la query de borrado (deleteMany)
    // crasheé el runtime WASM del motor de Prisma en Edge (Cloudflare Pages)
    const sql = neon(process.env.DATABASE_URL);
    if (brandId) {
      await sql`DELETE FROM whatsapp_messages WHERE "brandId" = ${brandId}`;
    } else {
      await sql`DELETE FROM whatsapp_messages`;
    }

    return NextResponse.json(
      { success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error en DELETE /api/whatsapp/messages:', error);
    return NextResponse.json(
      { success: false, error: 'Error vaciando mensajes', details: error?.message || String(error), stack: error?.stack },
      { status: 500, headers: corsHeaders }
    );
  }
}
