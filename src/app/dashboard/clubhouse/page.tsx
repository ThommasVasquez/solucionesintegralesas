import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TabbedDashboardClient from "../components/TabbedDashboardClient";
import { BRAND_COLORS } from "@/app/page";

export const runtime = 'edge';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1pmNkiCfvW6KICOwHEggRfzgUyBGqU6x22WT8yDG1pKo/edit?usp=sharing";

export default async function ClubHousePage() {
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
      title="Administración ClubHouse"
      brandColor={BRAND_COLORS.CLUBHOUSE}
      hideExcelForSergio={true}
    />
  );
}
