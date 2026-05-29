import { NextResponse } from 'next/server';
import { logActionServer } from '@/lib/audit-server';

// El runtime por defecto es Node.js, lo cual permite acceso a 'fs'
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
