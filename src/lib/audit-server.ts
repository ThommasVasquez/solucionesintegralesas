import { neon } from '@neondatabase/serverless';

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

        const sql = neon(process.env.DATABASE_URL);

        // Intentar buscar el usuario en la DB
        const users = await sql`
          SELECT id FROM users WHERE id = ${targetUserId} LIMIT 1
        `;

        if (users.length === 0) {
          // Crear usuario fantasma temporal para satisfacer la clave foránea
          await sql`
            INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt")
            VALUES (${targetUserId}, ${targetName}, ${targetEmail}, 'N/A', 'AGENDADOR', ${new Date()}, ${new Date()})
          `;
        }

        await sql`
          INSERT INTO audit_logs (id, "userId", action, resource, details, "createdAt")
          VALUES (${logEntry.id}, ${targetUserId}, ${action}, ${resource}, ${details ? JSON.stringify(details) : null}, ${timestamp})
        `;
      }
    } catch (dbError) {
      console.warn('[Audit Log Server] Falló la inserción en base de datos (se usó respaldo en archivo):', dbError);
    }
  } catch (globalError) {
    console.error('[Audit Log Server] Error general en bitácora:', globalError);
  }
}
