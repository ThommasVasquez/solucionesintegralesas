'use client';

import TabbedDashboardClient, { type DriveFile } from "../components/TabbedDashboardClient";
import { BRAND_COLORS } from "@/app/page";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1pmNkiCfvW6KICOwHEggRfzgUyBGqU6x22WT8yDG1pKo/edit?usp=sharing";
const DRIVE_URL = "https://drive.google.com/drive/folders/1pmNkiCfvW6KICOwHEggRfzgUyBGqU6x22WT8yDG1pKo?usp=sharing";

const INITIAL_FILES: DriveFile[] = [
  { name: "Contrato_Mantenimiento_Conjuntos_Residenciales.pdf", type: "pdf", size: "1.8 MB", date: "12/05/2026", category: "Contratos" },
  { name: "Listado_Servicios_Calentadores_Q2.xlsx", type: "xls", size: "1.2 MB", date: "08/05/2026", category: "Registros" },
  { name: "Certificacion_Competencias_Tecnicos_Gaseodomesticos.pdf", type: "pdf", size: "1.5 MB", date: "20/04/2026", category: "Certificaciones" },
  { name: "Cronograma_Visitas_Tecnicas_Bogota.xlsx", type: "xls", size: "480 KB", date: "30/04/2026", category: "Horarios" },
  { name: "Reglamento_Tecnico_Instalacion_Gaseodomesticos_NTC.pdf", type: "pdf", size: "1.1 MB", date: "15/01/2026", category: "Normativas" }
];

export default function VivaCalentadoresDashboardPage() {
  return (
    <TabbedDashboardClient 
      sheetUrl={SHEET_URL}
      title="Administración Viva Calentadores"
      brandColor={BRAND_COLORS.VIVA_CALENTADORES}
      driveUrl={DRIVE_URL}
      initialFiles={INITIAL_FILES}
      hideExcelForSergio={true}
      brandId="viva_calentadores"
    />
  );
}
