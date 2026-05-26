import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TabbedDashboardClient from "../components/TabbedDashboardClient";
import { BRAND_COLORS } from "@/app/page";

export const runtime = 'edge';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54/edit?usp=sharing";

export default async function ProMascotasPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Si el usuario es Sergio, mostrar su enlace específico, de lo contrario, el general
  const isSergio = session.user?.email === "sergio@ingenova.com.co";
  const currentSheetUrl = isSergio
    ? "https://docs.google.com/spreadsheets/d/1d0yCW0dVJjlhk4X4rQVVs_G62K8QEhEIgZQZHzltaqI/edit?usp=sharing"
    : SHEET_URL;

  return (
    <TabbedDashboardClient 
      user={{ name: session.user?.name, email: session.user?.email }}
      isSergio={isSergio}
      sheetUrl={currentSheetUrl}
      title="Gestión de Visitas ProMascotas"
      brandColor={BRAND_COLORS.PROMASCOTAS}
      hideExcelForSergio={false}
    />
  );
}
