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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandId, name, type, size, category, content } = body;

    if (!brandId || !name || !type || !size || !category || !content) {
      return NextResponse.json(
        { success: false, error: 'Payload incompleto para subir archivo' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    await sql`
      INSERT INTO stored_files (id, "brandId", name, type, size, category, content, "createdAt")
      VALUES (${fileId}, ${brandId}, ${name}, ${type}, ${size}, ${category}, ${content}, ${new Date()})
    `;

    return NextResponse.json(
      { success: true, fileId },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[/api/drive/upload]', error);
    return NextResponse.json(
      { success: false, error: 'Error interno', details: error?.message || String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
