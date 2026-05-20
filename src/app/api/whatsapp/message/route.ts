import { NextResponse } from 'next/server';
import { addStoredMessage } from '@/lib/whatsapp-store';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Manejo de CORS preflight (OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, chatId, sender, content, timestamp, direction } = body;

    // Validación de campos
    if (!id || !chatId || !sender || !content || !timestamp || !direction) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios en el mensaje' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { success, isDuplicate } = addStoredMessage({
      id,
      chatId,
      sender,
      content,
      timestamp,
      direction,
    });

    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo escribir el mensaje en el almacenamiento' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, isDuplicate },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error en POST /api/whatsapp/message:', error);
    return NextResponse.json(
      { error: 'Error interno procesando el mensaje' },
      { status: 500, headers: corsHeaders }
    );
  }
}
