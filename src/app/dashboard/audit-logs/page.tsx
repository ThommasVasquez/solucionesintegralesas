import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import Link from "next/link";
import styles from "./audit-logs.module.css";
import Navbar from "@/components/Navbar";

// Forzar renderizado dinámico en servidor para leer archivos de logs
export const dynamic = 'force-dynamic';

interface AuditLogEntry {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  action: string;
  resource: string;
  details: any;
  timestamp: string;
}

export default async function AuditLogsPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Restringir a BOSS y COORDINADOR
  const userRole = session.user?.role;
  if (userRole !== 'BOSS' && userRole !== 'COORDINADOR') {
    redirect("/dashboard");
  }

  const isBoss = userRole === 'BOSS';
  const searchParams = await props.searchParams;
  const searchFilter = searchParams.search?.toLowerCase() || '';
  const actionFilter = searchParams.action || '';

  // 1. Leer los logs del archivo local
  const cwd = process.cwd();
  const dataFile = path.join(cwd, 'data', 'audit-logs.json');
  let logs: AuditLogEntry[] = [];

  if (fs.existsSync(dataFile)) {
    try {
      const raw = fs.readFileSync(dataFile, 'utf-8');
      logs = JSON.parse(raw);
      if (!Array.isArray(logs)) {
        logs = [];
      }
    } catch {
      logs = [];
    }
  }

  // Ordenar logs: más recientes primero
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // 2. Filtrar logs según parámetros de búsqueda
  const filteredLogs = logs.filter(log => {
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    
    const matchesSearchText = searchFilter ? (
      (log.userName || '').toLowerCase().includes(searchFilter) ||
      (log.userEmail || '').toLowerCase().includes(searchFilter) ||
      (log.action || '').toLowerCase().includes(searchFilter) ||
      (log.resource || '').toLowerCase().includes(searchFilter) ||
      JSON.stringify(log.details || '').toLowerCase().includes(searchFilter)
    ) : true;

    return matchesAction && matchesSearchText;
  });

  // Obtener tipos de acción únicos para el filtro
  const uniqueActions = Array.from(new Set(logs.map(log => log.action))).sort();

  // Acción de servidor para vaciar la bitácora
  async function clearLogsAction() {
    'use server';
    const authSession = await auth();
    if (authSession?.user?.role !== 'BOSS') {
      throw new Error('Solo los usuarios BOSS pueden vaciar la bitácora.');
    }

    // 1. Vaciar JSON
    try {
      const serverCwd = process.cwd();
      const serverDataFile = path.join(serverCwd, 'data', 'audit-logs.json');
      fs.writeFileSync(serverDataFile, JSON.stringify([], null, 2), 'utf-8');
    } catch (e) {
      console.error('Error vaciando archivo de logs:', e);
    }

    // 2. Vaciar base de datos
    try {
      if (process.env.DATABASE_URL) {
        await db.auditLog.deleteMany();
      }
    } catch (dbError) {
      console.warn('Error vaciando AuditLog en DB:', dbError);
    }

    redirect('/dashboard/audit-logs');
  }

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
        date: date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      };
    } catch {
      return { date: isoString, time: '' };
    }
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'LOGIN': return styles.badgeLogin;
      case 'LOGOUT': return styles.badgeLogout;
      case 'UPLOAD_FILE': return styles.badgeUpload;
      case 'DOWNLOAD_FILE': return styles.badgeDownload;
      case 'VIEW_DASHBOARD': return styles.badgeView;
      case 'SWITCH_TAB': return styles.badgeTab;
      case 'CLEAR_WHATSAPP_DATA': return styles.badgeWarning;
      case 'GENERATE_DEMO_DATA': return styles.badgeDemo;
      case 'IMPORT_WHATSAPP_CHAT': return styles.badgeImport;
      default: return styles.badgeDefault;
    }
  };

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.panel}>
          
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.welcome}>
              <div className={styles.titleRow}>
                <Link href="/dashboard" className={styles.backLink}>
                  ← Volver al Panel
                </Link>
                <h1>Bitácora de Auditoría</h1>
              </div>
              <p>Registro completo de movimientos de la plataforma (excluyendo superusuarios).</p>
            </div>
            
            {isBoss && logs.length > 0 && (
              <form action={clearLogsAction}>
                <button 
                  type="submit" 
                  className={styles.clearBtn}
                  onClick={() => {
                    // En servidor ya valida, pero añadimos confirmación visual básica
                    return confirm('¿Estás seguro de que deseas vaciar todo el registro de auditoría? Esta acción es permanente.');
                  }}
                >
                  Vaciar Bitácora 🗑️
                </button>
              </form>
            )}
          </div>

          {/* Filtros */}
          <form method="GET" className={styles.filterBar}>
            <div className={styles.searchGroup}>
              <input 
                type="text" 
                name="search" 
                placeholder="Buscar por usuario, correo, detalles..." 
                defaultValue={searchParams.search || ''}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.selectGroup}>
              <select 
                name="action" 
                defaultValue={searchParams.action || ''}
                className={styles.selectInput}
              >
                <option value="">Todos los eventos</option>
                {uniqueActions.map(act => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.filterBtn}>
              Filtrar
            </button>

            {(searchFilter || actionFilter) && (
              <Link href="/dashboard/audit-logs" className={styles.resetBtn}>
                Limpiar Filtros
              </Link>
            )}
          </form>

          {/* Resultados */}
          <div className={styles.tableWrapper}>
            {filteredLogs.length === 0 ? (
              <div className={styles.noResults}>
                <p>No se encontraron registros de auditoría que coincidan con la búsqueda.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Recurso</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => {
                    const timeInfo = formatTimestamp(log.timestamp);
                    return (
                      <tr key={log.id}>
                        <td className={styles.timeCol}>
                          <span className={styles.dateText}>{timeInfo.date}</span>
                          <span className={styles.timeText}>{timeInfo.time}</span>
                        </td>
                        <td className={styles.userCol}>
                          <strong>{log.userName || 'Sistema'}</strong>
                          <span className={styles.emailText}>{log.userEmail || 'N/A'}</span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${getActionBadgeClass(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className={styles.resourceCol}>{log.resource}</td>
                        <td className={styles.detailsCol}>
                          {log.details?.message ? (
                            <span>{log.details.message}</span>
                          ) : (
                            <pre className={styles.rawDetails}>
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
