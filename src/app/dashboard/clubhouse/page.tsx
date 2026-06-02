'use client';

import TabbedDashboardClient, { type DriveFile } from "../components/TabbedDashboardClient";
import { BRAND_COLORS } from "@/app/page";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1pmNkiCfvW6KICOwHEggRfzgUyBGqU6x22WT8yDG1pKo/edit?usp=sharing";
const DRIVE_URL = "https://drive.google.com/drive/folders/1pmNkiCfvW6KICOwHEggRfzgUyBGqU6x22WT8yDG1pKo?usp=sharing";

const INITIAL_FILES: DriveFile[] = [
  { name: "Contrato_Servicios_Natacion_Liceo_Femenino.pdf", type: "pdf", size: "2.1 MB", date: "12/05/2026", category: "Contratos" },
  { name: "Listado_Inscritos_Escuela_Natacion_Q2.xlsx", type: "xls", size: "1.1 MB", date: "08/05/2026", category: "Registros" },
  { name: "Certificado_Soporte_Vital_Salvavidas_2026.pdf", type: "pdf", size: "1.4 MB", date: "20/04/2026", category: "Certificaciones" },
  { name: "Horarios_Entrenamiento_Sede_Colina.xlsx", type: "xls", size: "450 KB", date: "30/04/2026", category: "Horarios" },
  { name: "Reglamento_Uso_Piscina_Conjunto_Residencial.pdf", type: "pdf", size: "980 KB", date: "15/01/2026", category: "Reglamentos" }
];

export default function ClubHousePage() {
  return (
    <TabbedDashboardClient 
      sheetUrl={SHEET_URL}
      title="Administración ClubHouse"
      brandColor={BRAND_COLORS.CLUBHOUSE}
      driveUrl={DRIVE_URL}
      initialFiles={INITIAL_FILES}
      hideExcelForSergio={true}
    />
  );
}
