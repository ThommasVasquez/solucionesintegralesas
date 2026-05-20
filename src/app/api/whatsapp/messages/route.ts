import { NextResponse } from 'next/server';
import { getStoredMessages, clearStoredMessages } from '@/lib/whatsapp-store';

export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const messages = await getStoredMessages();
    return NextResponse.json(
      { messages },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error en GET /api/whatsapp/messages:', error);
    return NextResponse.json(
      { error: 'Error leyendo mensajes' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE() {
  try {
    const success = await clearStoredMessages();
    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo vaciar el almacenamiento' },
        { status: 500, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error en DELETE /api/whatsapp/messages:', error);
    return NextResponse.json(
      { error: 'Error vaciando mensajes' },
      { status: 500, headers: corsHeaders }
    );
  }
}

