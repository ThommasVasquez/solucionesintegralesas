'use client';

import TabbedDashboardClient, { type DriveFile } from "../components/TabbedDashboardClient";
import { BRAND_COLORS } from "@/app/page";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54/edit?usp=sharing";
const DRIVE_URL = "https://drive.google.com/drive/folders/1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54?usp=sharing";

const INITIAL_FILES: DriveFile[] = [
  { name: "Consentimiento_Informado_Profilaxis_General.pdf", type: "pdf", size: "1.2 MB", date: "18/05/2026", category: "Consentimientos" },
  { name: "Historial_Clinico_Mascota_Luna_Pinzon.pdf", type: "pdf", size: "1.6 MB", date: "14/05/2026", category: "Historiales" },
  { name: "Guia_Cuidado_Post_Limpieza_Dental.pdf", type: "pdf", size: "750 KB", date: "05/05/2026", category: "Guías" },
  { name: "Registro_Visitas_Veterinarias_Zona_Norte.xlsx", type: "xls", size: "920 KB", date: "29/04/2026", category: "Registros" },
  { name: "Resolucion_Sanitaria_Funcionamiento_Domicilio.pdf", type: "pdf", size: "2.5 MB", date: "10/02/2026", category: "Certificaciones" }
];

const STATS_SHEET_URL = "https://docs.google.com/spreadsheets/d/1MwIVYmjvc9IPw_nWepCXlMj19XAugDc6zY37K0HvJ6Y/edit?gid=261864183#gid=261864183";

export default function ProMascotasPage() {
  return (
    <TabbedDashboardClient 
      sheetUrl={SHEET_URL}
      title="Gestión de Visitas ProMascotas"
      brandColor={BRAND_COLORS.PROMASCOTAS}
      driveUrl={DRIVE_URL}
      initialFiles={INITIAL_FILES}
      hideExcelForSergio={false}
      brandId="pro_mascotas"
      statsSheetUrl={STATS_SHEET_URL}
    />
  );
}
