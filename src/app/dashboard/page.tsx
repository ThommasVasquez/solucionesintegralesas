'use client';

import { useSession, signOut } from "next-auth/react";
import { BRAND_COLORS } from "@/app/page";
import Navbar from "@/components/Navbar";
import styles from "./dashboard.module.css";
import { Link } from "next-view-transitions";
import { logAction } from "@/lib/audit-client";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className={styles.main}>
        <Navbar />
        <div className={styles.content} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          <p>Cargando panel administrativo...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return null; // El middleware se encarga de redireccionar si no está autenticado
  }

  const isSergio = session.user?.email === "sergio@ingenova.com.co";

  const handleLogout = async () => {
    if (session.user) {
      try {
        await logAction({
          userEmail: session.user.email,
          userName: session.user.name,
          action: 'LOGOUT',
          resource: 'SESSION',
          details: { message: `Usuario ${session.user.name} cerró sesión.` }
        });
      } catch (e) {
        console.error("Error logging logout:", e);
      }
    }
    await signOut({ callbackUrl: "/" });
  };

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.welcome}>
              <h1>Panel Administrativo</h1>
              <p>Bienvenido, {session.user?.name} ({(session.user as any)?.role || 'Usuario'})</p>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Cerrar Sesión
            </button>
          </div>

          <div className={styles.grid}>
            {!isSergio && (
              <>
                <div className={styles.card}>
                  <div className={styles.iconWrapper} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px' }}>
                    <img 
                      src="/ingenova-logo.jpg" 
                      alt="Ingenova Logo" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <h3>Ingenova</h3>
                  <p>Gestión de hojas de control para mantenimiento de piscinas.</p>
                  <Link href="/dashboard/ingenova" className={styles.cardAction} style={{ color: BRAND_COLORS.INGENOVA }} prefetch={false}>
                    Abrir Planillas →
                  </Link>
                </div>

                <div className={styles.card}>
                  <div className={styles.iconWrapper} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px' }}>
                    <img 
                      src="/viva-calentadores-logo.jpg" 
                      alt="Viva Calentadores Logo" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <h3>Viva Calentadores</h3>
                  <p>Administración y control de servicios de calentadores.</p>
                  <Link href="/dashboard/viva-calentadores" className={styles.cardAction} style={{ color: BRAND_COLORS.VIVA_CALENTADORES }} prefetch={false}>
                    Ver Registros →
                  </Link>
                </div>
              </>
            )}

            <div className={styles.card}>
              <div className={styles.iconWrapper} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px' }}>
                <img 
                  src="/printerservice-logo.png" 
                  alt="PrinterService Logo" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <h3>PrinterService</h3>
              <p>Control de servicios de impresión e informes de WhatsApp.</p>
              <Link href="/dashboard/printerservice" className={styles.cardAction} style={{ color: BRAND_COLORS.PRINTERSERVICE }} prefetch={false}>
                Ver Panel →
              </Link>
            </div>

            <div className={styles.card}>
              <div className={styles.iconWrapper} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2px' }}>
                <img 
                  src="/promascotas-logo.png" 
                  alt="ProMascotas Logo" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <h3>ProMascotas</h3>
              <p>Control de visitas y profilaxis a domicilio.</p>
              <Link href="/dashboard/promascotas" className={styles.cardAction} style={{ color: BRAND_COLORS.PROMASCOTAS }} prefetch={false}>
                Gestionar Visitas →
              </Link>
            </div>

            {session.user?.email === 'thommyenergy@superuser.com' && (
              <div className={styles.card} style={{ border: '1px dashed #6b7280' }}>
                <div className={styles.iconWrapper} style={{ backgroundColor: '#6b728020' }}>
                  <span style={{ color: '#6b7280' }}>📋</span>
                </div>
                <h3>Bitácora de Auditoría</h3>
                <p>Historial y registro de movimientos de usuarios de la plataforma.</p>
                <Link href="/dashboard/audit-logs" className={styles.cardAction} style={{ color: '#6b7280' }} prefetch={false}>
                  Ver Bitácora →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
