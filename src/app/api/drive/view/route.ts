import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

const getMimeType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'png') return 'image/png';
  if (['jpg', 'jpeg'].includes(ext || '')) return 'image/jpeg';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'svg') return 'image/svg+xml';
  if (ext === 'webp') return 'image/webp';
  if (['xls', 'xlsx'].includes(ext || '')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (['doc', 'docx'].includes(ext || '')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return 'application/octet-stream';
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Falta id del archivo', { status: 400, headers: corsHeaders });
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
      return new NextResponse('Archivo no encontrado', { status: 404, headers: corsHeaders });
    }

    const file = results[0];
    const mimeType = getMimeType(file.name);

    // Decode Base64 to binary byte array
    const byteCharacters = atob(file.content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: mimeType });

    // Return the file binary content with Content-Disposition: inline
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(file.name)}"`,
        'Content-Length': byteArray.length.toString(),
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('[/api/drive/view]', error);
    return new NextResponse('Error interno al cargar el visor', { status: 500, headers: corsHeaders });
  }
}
