import { NextResponse } from 'next/server';
import { logActionServer } from '@/lib/audit-server';

export const runtime = 'edge';

// El runtime es Edge para compatibilidad con Cloudflare Pages.
// logActionServer utiliza importaciones dinámicas para manejar de forma segura fs/path en Node.js.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await logActionServer(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en POST /api/audit-log:', error);
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 500 });
  }
}
