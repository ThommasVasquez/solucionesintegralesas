import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'edge';

async function getNodeFs() {
  if (typeof window === 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
    try {
      const fsName = 'fs';
      const pathName = 'path';
      const fs = await import(fsName);
      const path = await import(pathName);
      return { fs: fs.default || fs, path: path.default || path };
    } catch {
      return null;
    }
  }
  return null;
}

export async function POST() {
  try {
    const session = await auth();
    if (session?.user?.email !== 'thommyenergy@superuser.com') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // 1. Vaciar JSON
    const nodeFs = await getNodeFs();
    if (nodeFs) {
      const { fs, path } = nodeFs;
      try {
        const serverCwd = path.resolve('.');
        const serverDataFile = path.join(serverCwd, 'data', 'audit-logs.json');
        fs.writeFileSync(serverDataFile, JSON.stringify([], null, 2), 'utf-8');
      } catch (e) {
        console.error('Error vaciando archivo de logs:', e);
      }
    }

    // 2. Vaciar base de datos
    try {
      if (process.env.DATABASE_URL) {
        await db.auditLog.deleteMany();
      }
    } catch (dbError) {
      console.warn('Error vaciando AuditLog en DB:', dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en POST /api/audit-log/clear:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
