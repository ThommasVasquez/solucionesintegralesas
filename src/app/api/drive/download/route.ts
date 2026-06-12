import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Falta id del archivo' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);

    const results = await sql`
      SELECT name, type, content 
      FROM stored_files
      WHERE id = ${id}
      LIMIT 1
    `;

    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Archivo no encontrado' },
        { status: 404, headers: corsHeaders }
      );
    }

    const file = results[0];

    return NextResponse.json(
      { success: true, name: file.name, type: file.type, content: file.content },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[/api/drive/download]', error);
    return NextResponse.json(
      { success: false, error: 'Error interno', details: error?.message || String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
