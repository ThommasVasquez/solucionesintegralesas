import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SheetViewer } from "@/components/sheets/SheetViewer";
import Navbar from "@/components/Navbar";

export const runtime = 'edge';

export default async function ProMascotasPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  return (
    <main className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="pt-24 h-[calc(100vh-2rem)] flex flex-col p-4">
        <div className="flex-grow rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl">
          <SheetViewer 
            sheetName="Visitas ProMascotas" 
            role={role} 
            apiUrl="/api/sheets/promascotas"
          />
        </div>
      </div>
    </main>
  );
}
