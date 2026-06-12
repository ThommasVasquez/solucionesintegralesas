import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { auth } from '@/lib/auth';


export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

const DEFAULT_SHEETS = [
  { name: "archivo1", url: "https://docs.google.com/spreadsheets/d/1pmNkiCfvW6KICOwHEggRfzgUyBGqU6x22WT8yDG1pKo/edit?usp=sharing" },
  { name: "archivo2", url: "https://docs.google.com/spreadsheets/d/1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54/edit?usp=sharing" },
  { name: "archivo3", url: "https://docs.google.com/spreadsheets/d/1joniM23XA3LxWo6ernD-w5bOppVsGFN38iCmhATC6Fs/edit?usp=sharing" },
  { name: "archivo4", url: "https://docs.google.com/spreadsheets/d/1dRd9YiMJpycg28KdZVvtDtNaSKb0YA6UZdibk1CQzLk/edit?usp=sharing" },
];

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

    // Buscar configuraciones de hojas administrativas para esta marca
    let sheets = await sql`
      SELECT name, url, "order", "isCustom"
      FROM admin_sheet_configs
      WHERE "brandId" = ${brandId}
      ORDER BY "order" ASC
    `;

    // Si no existen registros, sembrar los valores predeterminados
    if (sheets.length === 0) {
      for (let i = 0; i < DEFAULT_SHEETS.length; i++) {
        const sheet = DEFAULT_SHEETS[i];
        const id = `config-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await sql`
          INSERT INTO admin_sheet_configs (id, "brandId", name, url, "order", "isCustom", "createdAt", "updatedAt")
          VALUES (${id}, ${brandId}, ${sheet.name}, ${sheet.url}, ${i}, false, ${new Date()}, ${new Date()})
        `;
      }

      // Volver a consultar
      sheets = await sql`
        SELECT name, url, "order", "isCustom"
        FROM admin_sheet_configs
        WHERE "brandId" = ${brandId}
        ORDER BY "order" ASC
      `;
    }

    const isCustom = sheets.some((s: any) => s.isCustom === true);

    return NextResponse.json(
      { success: true, sheets, isCustom },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[/api/admin-sheets] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno', details: error?.message || String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    const allowedAdmins = [
      "sebastian@ingenova.com.co",
      "jessyca@ingenova.com.co",
      "adrian@ingenova.com.co",
      "thommyenergy@superuser.com"
    ];

    if (!userEmail || !allowedAdmins.includes(userEmail.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'No autorizado.' },
        { status: 403, headers: corsHeaders }
      );
    }

    const isSuper = userEmail.toLowerCase() === 'thommyenergy@superuser.com';

    const body = await req.json();
    const { brandId, sheets } = body;

    if (!brandId || !Array.isArray(sheets)) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos o formato incorrecto' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);

    // Si no es superusuario, verificar si la configuración ya ha sido modificada (es custom)
    if (!isSuper) {
      const currentConfigs = await sql`
        SELECT "isCustom"
        FROM admin_sheet_configs
        WHERE "brandId" = ${brandId}
      `;
      const hasCustom = currentConfigs.some((c: any) => c.isCustom === true);
      if (hasCustom) {
        return NextResponse.json(
          { success: false, error: 'No autorizado. La configuración ya fue guardada previamente y solo el superusuario puede volver a modificarla.' },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    // Eliminar las configuraciones anteriores para esta marca
    await sql`
      DELETE FROM admin_sheet_configs
      WHERE "brandId" = ${brandId}
    `;

    // Insertar las nuevas configuraciones como personalizadas (isCustom: true)
    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];
      // Ignorar si no tiene nombre o url
      if (!sheet.name || !sheet.url) continue;

      const id = `config-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      await sql`
        INSERT INTO admin_sheet_configs (id, "brandId", name, url, "order", "isCustom", "createdAt", "updatedAt")
        VALUES (${id}, ${brandId}, ${sheet.name}, ${sheet.url}, ${i}, true, ${new Date()}, ${new Date()})
      `;
    }

    return NextResponse.json(
      { success: true, message: 'Configuración guardada exitosamente' },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[/api/admin-sheets] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al guardar', details: error?.message || String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
