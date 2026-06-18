'use client';

import TabbedDashboardClient, { type DriveFile } from "../components/TabbedDashboardClient";
import { BRAND_COLORS } from "@/app/page";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1joniM23XA3LxWo6ernD-w5bOppVsGFN38iCmhATC6Fs/edit?usp=sharing";
const DRIVE_URL = "https://drive.google.com/drive/folders/1joniM23XA3LxWo6ernD-w5bOppVsGFN38iCmhATC6Fs?usp=sharing";

const INITIAL_FILES: DriveFile[] = [
  { name: "Acta_Mantenimiento_Club_Campestre_Mayo_2026.pdf", type: "pdf", size: "1.8 MB", date: "22/05/2026", category: "Actas" },
  { name: "Plano_Hidraulico_Piscina_Semiolimpica.png", type: "img", size: "4.5 MB", date: "15/04/2026", category: "Planos" },
  { name: "Ficha_Tecnica_Clorador_Salino_Hayward.pdf", type: "pdf", size: "2.3 MB", date: "10/03/2026", category: "Fichas Técnicas" },
  { name: "Inventario_Quimicos_Sede_Norte_Q2.xlsx", type: "xls", size: "850 KB", date: "02/05/2026", category: "Inventarios" },
  { name: "Certificado_Calidad_Agua_SGS_Abril.pdf", type: "pdf", size: "1.2 MB", date: "28/04/2026", category: "Certificaciones" },
  { name: "Manual_Usuario_Calentador_Pentair_MasterTemp.pdf", type: "pdf", size: "3.1 MB", date: "18/02/2026", category: "Manuales" }
];

const STATS_SHEET_URL = "https://docs.google.com/spreadsheets/d/1ld2n0EJ59wboefiz6o9AWgdl4Ctz9V8lq5cHpvmEoR8/edit?usp=sharing";

export default function IngenovaPage() {
  return (
    <TabbedDashboardClient 
      sheetUrl={SHEET_URL}
      title="Administración Ingenova"
      brandColor={BRAND_COLORS.INGENOVA}
      driveUrl={DRIVE_URL}
      initialFiles={INITIAL_FILES}
      hideExcelForSergio={true}
      brandId="ingenova"
      statsSheetUrl={STATS_SHEET_URL}
    />
  );
}
