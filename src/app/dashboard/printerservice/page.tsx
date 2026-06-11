'use client';

import TabbedDashboardClient, { type DriveFile } from "../components/TabbedDashboardClient";
import { BRAND_COLORS } from "@/app/page";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1dRd9YiMJpycg28KdZVvtDtNaSKb0YA6UZdibk1CQzLk/edit?usp=sharing";
const DRIVE_URL = "https://drive.google.com/drive/folders/1dRd9YiMJpycg28KdZVvtDtNaSKb0YA6UZdibk1CQzLk?usp=sharing";

const INITIAL_FILES: DriveFile[] = [
  { name: "Contrato_Leasing_Impresora_Kyocera_TaskAlfa.pdf", type: "pdf", size: "2.8 MB", date: "15/05/2026", category: "Contratos" },
  { name: "Hoja_Vida_Multifuncional_HP_LaserJet_E87650.pdf", type: "pdf", size: "1.9 MB", date: "10/05/2026", category: "Hojas de Vida" },
  { name: "Reporte_Lecturas_Contadores_Mes_Abril.xlsx", type: "xls", size: "1.2 MB", date: "30/04/2026", category: "Facturación" },
  { name: "Manual_Servicio_Tecnico_Canon_imageRUNNER.pdf", type: "pdf", size: "5.4 MB", date: "12/03/2026", category: "Manuales" },
  { name: "Guia_Configuracion_Red_Escaner_SMB.pdf", type: "pdf", size: "850 KB", date: "25/04/2026", category: "Guías" }
];

export default function PrinterServicePage() {
  return (
    <TabbedDashboardClient 
      sheetUrl={SHEET_URL}
      title="Gestión PrinterService"
      brandColor={BRAND_COLORS.PRINTERSERVICE}
      driveUrl={DRIVE_URL}
      initialFiles={INITIAL_FILES}
      hideExcelForSergio={true}
      brandId="printer_service"
    />
  );
}
