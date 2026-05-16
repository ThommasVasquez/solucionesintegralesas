import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BRAND_COLORS } from "@/app/page";
import Navbar from "@/components/Navbar";

export const runtime = 'edge';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 container">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Panel Administrativo</h1>
              <p className="text-slate-500">Bienvenido, {session.user?.name} ({session.user?.role})</p>
            </div>
            <form action={async () => {
              'use server';
              await signOut({ redirectTo: "/" });
            }}>
              <button className="px-6 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Cerrar Sesión
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.INGENOVA + '20' }}>
                <span className="text-2xl" style={{ color: BRAND_COLORS.INGENOVA }}>🏊‍♂️</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Ingenova</h3>
              <p className="text-sm text-slate-500 mb-4">Gestión de hojas de control para mantenimiento de piscinas.</p>
              <button className="text-sm font-bold" style={{ color: BRAND_COLORS.INGENOVA }}>Abrir Planillas →</button>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.CLUBHOUSE + '20' }}>
                <span className="text-2xl" style={{ color: BRAND_COLORS.CLUBHOUSE }}>🏠</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">ClubHouse</h3>
              <p className="text-sm text-slate-500 mb-4">Administración y control de capacitación.</p>
              <button className="text-sm font-bold" style={{ color: BRAND_COLORS.CLUBHOUSE }}>Ver Registros →</button>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: BRAND_COLORS.PROMASCOTAS + '20' }}>
                <span className="text-2xl" style={{ color: BRAND_COLORS.PROMASCOTAS }}>🐾</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">ProMascotas</h3>
              <p className="text-sm text-slate-500 mb-4">Control de visitas y profilaxis a domicilio.</p>
              <button className="text-sm font-bold" style={{ color: BRAND_COLORS.PROMASCOTAS }}>Gestionar Visitas →</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
