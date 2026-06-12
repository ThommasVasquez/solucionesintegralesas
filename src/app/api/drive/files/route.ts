import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Initial files definitions for automatic seeding
const INITIAL_FILES_BY_BRAND: Record<string, Array<{ name: string; type: string; size: string; date: string; category: string }>> = {
  viva_calentadores: [
    { name: "Contrato_Mantenimiento_Conjuntos_Residenciales.pdf", type: "pdf", size: "1.8 MB", date: "12/05/2026", category: "Contratos" },
    { name: "Listado_Servicios_Calentadores_Q2.xlsx", type: "xls", size: "1.2 MB", date: "08/05/2026", category: "Registros" },
    { name: "Certificacion_Competencias_Tecnicos_Gaseodomesticos.pdf", type: "pdf", size: "1.5 MB", date: "20/04/2026", category: "Certificaciones" },
    { name: "Cronograma_Visitas_Tecnicas_Bogota.xlsx", type: "xls", size: "480 KB", date: "30/04/2026", category: "Horarios" },
    { name: "Reglamento_Tecnico_Instalacion_Gaseodomesticos_NTC.pdf", type: "pdf", size: "1.1 MB", date: "15/01/2026", category: "Normativas" }
  ],
  pro_mascotas: [
    { name: "Consentimiento_Informado_Profilaxis_General.pdf", type: "pdf", size: "1.2 MB", date: "18/05/2026", category: "Consentimientos" },
    { name: "Historial_Clinico_Mascota_Luna_Pinzon.pdf", type: "pdf", size: "1.6 MB", date: "14/05/2026", category: "Historiales" },
    { name: "Guia_Cuidado_Post_Limpieza_Dental.pdf", type: "pdf", size: "750 KB", date: "05/05/2026", category: "Guías" },
    { name: "Registro_Visitas_Veterinarias_Zona_Norte.xlsx", type: "xls", size: "920 KB", date: "29/04/2026", category: "Registros" },
    { name: "Resolucion_Sanitaria_Funcionamiento_Domicilio.pdf", type: "pdf", size: "2.5 MB", date: "10/02/2026", category: "Certificaciones" }
  ],
  ingenova: [
    { name: "Acta_Mantenimiento_Club_Campestre_Mayo_2026.pdf", type: "pdf", size: "1.8 MB", date: "22/05/2026", category: "Actas" },
    { name: "Plano_Hidraulico_Piscina_Semiolimpica.png", type: "img", size: "4.5 MB", date: "15/04/2026", category: "Planos" },
    { name: "Ficha_Tecnica_Clorador_Salino_Hayward.pdf", type: "pdf", size: "2.3 MB", date: "10/03/2026", category: "Fichas Técnicas" },
    { name: "Inventario_Quimicos_Sede_Norte_Q2.xlsx", type: "xls", size: "850 KB", date: "02/05/2026", category: "Inventarios" },
    { name: "Certificado_Calidad_Agua_SGS_Abril.pdf", type: "pdf", size: "1.2 MB", date: "28/04/2026", category: "Certificaciones" },
    { name: "Manual_Usuario_Calentador_Pentair_MasterTemp.pdf", type: "pdf", size: "3.1 MB", date: "18/02/2026", category: "Manuales" }
  ],
  printer_service: [
    { name: "Contrato_Leasing_Impresora_Kyocera_TaskAlfa.pdf", type: "pdf", size: "2.8 MB", date: "15/05/2026", category: "Contratos" },
    { name: "Hoja_Vida_Multifuncional_HP_LaserJet_E87650.pdf", type: "pdf", size: "1.9 MB", date: "10/05/2026", category: "Hojas de Vida" },
    { name: "Reporte_Lecturas_Contadores_Mes_Abril.xlsx", type: "xls", size: "1.2 MB", date: "30/04/2026", category: "Facturación" },
    { name: "Manual_Servicio_Tecnico_Canon_imageRUNNER.pdf", type: "pdf", size: "5.4 MB", date: "12/03/2026", category: "Manuales" },
    { name: "Guia_Configuracion_Red_Escaner_SMB.pdf", type: "pdf", size: "850 KB", date: "25/04/2026", category: "Guías" }
  ]
};

// Base64 text placeholder representing a dummy text file
const DUMMY_FILE_CONTENT = "U2VndXJvIGRlIEFyY2hpdm8gLSBQbGFjZWhvbGRlcg==";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json(
        { success: false, error: 'Falta brandId' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);

    // List files excluding content to keep the payload size small
    let files = await sql`
      SELECT id, "brandId", name, type, size, category, "createdAt"
      FROM stored_files
      WHERE "brandId" = ${brandId}
      ORDER BY "createdAt" DESC
    `;

    // Seed initial files if none exist for this brand
    if (files.length === 0 && INITIAL_FILES_BY_BRAND[brandId]) {
      const initialSeed = INITIAL_FILES_BY_BRAND[brandId];
      
      for (const item of initialSeed) {
        const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await sql`
          INSERT INTO stored_files (id, "brandId", name, type, size, category, content, "createdAt")
          VALUES (${fileId}, ${brandId}, ${item.name}, ${item.type}, ${item.size}, ${item.category}, ${DUMMY_FILE_CONTENT}, ${new Date()})
        `;
      }

      // Re-fetch files
      files = await sql`
        SELECT id, "brandId", name, type, size, category, "createdAt"
        FROM stored_files
        WHERE "brandId" = ${brandId}
        ORDER BY "createdAt" DESC
      `;
    }

    // Format output with readable ISO timestamps
    const plainFiles = files.map((f: any) => ({
      id: f.id,
      brandId: f.brandId,
      name: f.name,
      type: f.type,
      size: f.size,
      category: f.category,
      date: f.createdAt instanceof Date ? f.createdAt.toLocaleDateString() : String(f.createdAt)
    }));

    return NextResponse.json(
      { success: true, files: plainFiles },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[/api/drive/files]', error);
    return NextResponse.json(
      { success: false, error: 'Error interno', details: error?.message || String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
