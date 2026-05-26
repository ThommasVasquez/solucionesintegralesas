import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TabbedDashboardClient from "../components/TabbedDashboardClient";
import { BRAND_COLORS } from "@/app/page";

export const runtime = 'edge';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1joniM23XA3LxWo6ernD-w5bOppVsGFN38iCmhATC6Fs/edit?usp=sharing";

export default async function IngenovaPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const isSergio = session.user?.email === "sergio@ingenova.com.co";

  return (
    <TabbedDashboardClient 
      user={{ name: session.user?.name, email: session.user?.email }}
      isSergio={isSergio}
      sheetUrl={SHEET_URL}
      title="Administración Ingenova"
      brandColor={BRAND_COLORS.INGENOVA}
      hideExcelForSergio={true}
    />
  );
}
