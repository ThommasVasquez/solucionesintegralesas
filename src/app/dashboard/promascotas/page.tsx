import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export const runtime = 'edge';

// El parámetro rm=minimal oculta la interfaz de Google para que parezca más integrado
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54/edit?usp=sharing&rm=minimal";

export default async function ProMascotasPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="h-screen w-full flex flex-col bg-[#0f172a] overflow-hidden">
      <Navbar />
      <div className="flex-grow pt-20 h-full w-full">
        <iframe 
          src={SHEET_URL}
          className="w-full h-full border-none bg-white"
          title="Gestión de Visitas ProMascotas"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
      
      <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
