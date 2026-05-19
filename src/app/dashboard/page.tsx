import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BRAND_COLORS } from "@/app/page";
import Navbar from "@/components/Navbar";
import styles from "./dashboard.module.css";
import { Link } from "next-view-transitions";

export const runtime = 'edge';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const isSergio = session.user?.email === "sergio@ingenova.com.co";

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.welcome}>
              <h1>Panel Administrativo</h1>
              <p>Bienvenido, {session.user?.name} ({session.user?.role})</p>
            </div>
            <form action={async () => {
              'use server';
              await signOut({ redirectTo: "/" });
            }}>
              <button className={styles.logoutBtn}>
                Cerrar Sesión
              </button>
            </form>
          </div>

          <div className={styles.grid}>
            {!isSergio && (
              <>
                <div className={styles.card}>
                  <div className={styles.iconWrapper} style={{ backgroundColor: BRAND_COLORS.INGENOVA + '20' }}>
                    <span style={{ color: BRAND_COLORS.INGENOVA }}>🏊‍♂️</span>
                  </div>
                  <h3>Ingenova</h3>
                  <p>Gestión de hojas de control para mantenimiento de piscinas.</p>
                  <Link href="/dashboard/ingenova" className={styles.cardAction} style={{ color: BRAND_COLORS.INGENOVA }}>
                    Abrir Planillas →
                  </Link>
                </div>

                <div className={styles.card}>
                  <div className={styles.iconWrapper} style={{ backgroundColor: BRAND_COLORS.CLUBHOUSE + '20' }}>
                    <span style={{ color: BRAND_COLORS.CLUBHOUSE }}>🏠</span>
                  </div>
                  <h3>ClubHouse</h3>
                  <p>Administración y control de capacitación.</p>
                  <Link href="/dashboard/clubhouse" className={styles.cardAction} style={{ color: BRAND_COLORS.CLUBHOUSE }}>
                    Ver Registros →
                  </Link>
                </div>
              </>
            )}

            <div className={styles.card}>
              <div className={styles.iconWrapper} style={{ backgroundColor: BRAND_COLORS.PROMASCOTAS + '20' }}>
                <span style={{ color: BRAND_COLORS.PROMASCOTAS }}>🐾</span>
              </div>
              <h3>ProMascotas</h3>
              <p>Control de visitas y profilaxis a domicilio.</p>
              <Link href="/dashboard/promascotas" className={styles.cardAction} style={{ color: BRAND_COLORS.PROMASCOTAS }}>
                Gestionar Visitas →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
