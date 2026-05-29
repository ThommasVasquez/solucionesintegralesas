import { db } from './db';

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  action: string;
  resource: string;
  details: any;
  timestamp: string;
}

// Obtener fs y path dinámicamente para no romper en Edge
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

export async function logActionServer(payload: {
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  action: string;
  resource: string;
  details?: any;
}) {
  try {
    const { userId, userEmail, userName, action, resource, details } = payload;

    // Ignorar ThommyEnergy
    if (userEmail === 'thommyenergy@superuser.com') {
      return;
    }

    const timestamp = new Date();
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      userId: userId || null,
      userEmail: userEmail || null,
      userName: userName || null,
      action,
      resource,
      details: details || null,
      timestamp: timestamp.toISOString(),
    };

    // 1. Guardar en archivo JSON local
    const nodeFs = await getNodeFs();
    if (nodeFs) {
      const { fs, path } = nodeFs;
      try {
        const cwd = path.resolve('.');
        const dataDir = path.join(cwd, 'data');
        const dataFile = path.join(dataDir, 'audit-logs.json');

        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        let logs: AuditLogEntry[] = [];
        if (fs.existsSync(dataFile)) {
          const raw = fs.readFileSync(dataFile, 'utf-8');
          try {
            logs = JSON.parse(raw);
            if (!Array.isArray(logs)) {
              logs = [];
            }
          } catch {
            logs = [];
          }
        }

        logs.push(logEntry);
        fs.writeFileSync(dataFile, JSON.stringify(logs, null, 2), 'utf-8');
      } catch (fsError) {
        console.error('[Audit Log Server] Error escribiendo en archivo local:', fsError);
      }
    } else {
      console.log('[Audit Log Server] Node FS no disponible (Edge runtime), se omite escritura a JSON local.');
    }

    // 2. Guardar en base de datos (con reintento silencioso)
    try {
      if (process.env.DATABASE_URL) {
        const targetUserId = userId || 'unknown';
        const targetEmail = userEmail || 'unknown@example.com';
        const targetName = userName || 'Desconocido';

        // Intentar buscar el usuario en la DB
        const dbUser = await db.user.findUnique({
          where: { id: targetUserId },
        });

        if (!dbUser) {
          // Crear usuario fantasma temporal para satisfacer la clave foránea
          await db.user.create({
            data: {
              id: targetUserId,
              email: targetEmail,
              name: targetName,
              password: 'N/A',
            },
          });
        }

        await db.auditLog.create({
          data: {
            id: logEntry.id,
            userId: targetUserId,
            action,
            resource,
            details: details ? JSON.parse(JSON.stringify(details)) : null,
            createdAt: timestamp,
          },
        });
      }
    } catch (dbError) {
      console.warn('[Audit Log Server] Falló la inserción en base de datos (se usó respaldo en archivo):', dbError);
    }
  } catch (globalError) {
    console.error('[Audit Log Server] Error general en bitácora:', globalError);
  }
}
