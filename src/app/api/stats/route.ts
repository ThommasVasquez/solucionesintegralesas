import { NextResponse } from 'next/server';

export const runtime = 'edge';

const BRAND_SHEETS: Record<string, string> = {
  pro_mascotas: "https://docs.google.com/spreadsheets/d/1MwIVYmjvc9IPw_nWepCXlMj19XAugDc6zY37K0HvJ6Y/export?format=csv&gid=261864183",
  viva_calentadores: "https://docs.google.com/spreadsheets/d/1OK9fUUn-oHGgs0ZBLtc9rIQda0LEWg0PmpUHSKRsVWo/export?format=csv&gid=1433734534",
  printer_service: "https://docs.google.com/spreadsheets/d/1_RBqHwCPl-t3XZmzfj7U_Zx0cMWfD1L6RBC2ey8ituE/export?format=csv&gid=481549131",
  ingenova: "https://docs.google.com/spreadsheets/d/1ld2n0EJ59wboefiz6o9AWgdl4Ctz9V8lq5cHpvmEoR8/export?format=csv"
};

// Fallback datasets for all brands
const FALLBACKS: Record<string, any> = {
  pro_mascotas: [
    {
      week: "20 al 25 de Abril",
      metaAds: [
        { region: "Distrito Especial", mensajes: 684, inversion: 1020404, costoMensaje: 1492 },
        { region: "Cundinamarca", mensajes: 52, inversion: 73120, costoMensaje: 1406 }
      ],
      resumenCiudad: [
        {
          ciudad: "Bogotá",
          region: "Distrito Especial",
          serviciosProducto: 54,
          serviciosEfectivos: 31,
          ingresos: 3314000,
          inversion: 1020404,
          mensajes: 684,
          cpa: 32916,
          roas: 3.25,
          bitacoraVentas: 39,
          conversion: 5.30
        }
      ],
      desgloseProducto: [
        { ciudad: "Bogotá", producto: "General", serviciosProducto: 54, serviciosEfectivos: 31, ingresos: 3314000, inversion: 1020404, cpa: 32916, roas: 3.25 }
      ],
      resumenGeneral: { ingresos: 3314000, inversion: 1093524, utilidad: 2220476, roas: 3.03 }
    },
    {
      week: "27/04 - 03/05",
      metaAds: [
        { region: "Cundinamarca", mensajes: 41, inversion: 65595, costoMensaje: 1600 },
        { region: "Distrito Especial", mensajes: 603, inversion: 867477, costoMensaje: 1439 }
      ],
      resumenCiudad: [
        {
          ciudad: "Bogotá",
          region: "Distrito Especial",
          serviciosProducto: 45,
          serviciosEfectivos: 26,
          ingresos: 2659000,
          inversion: 867477,
          mensajes: 603,
          cpa: 33365,
          roas: 3.07,
          bitacoraVentas: 47,
          conversion: 7.30
        }
      ],
      desgloseProducto: [
        { ciudad: "Bogotá", producto: "Revision", serviciosProducto: 0, serviciosEfectivos: 0, ingresos: 0, inversion: 0, cpa: 0, roas: 0 },
        { ciudad: "Bogotá", producto: "Premium", serviciosProducto: 3, serviciosEfectivos: 1, ingresos: 150000, inversion: 57832, cpa: 57832, roas: 2.59 },
        { ciudad: "Bogotá", producto: "Standar", serviciosProducto: 9, serviciosEfectivos: 6, ingresos: 720000, inversion: 173495, cpa: 28916, roas: 4.15 },
        { ciudad: "Bogotá", producto: "Basico", serviciosProducto: 33, serviciosEfectivos: 19, ingresos: 1789000, inversion: 636150, cpa: 33482, roas: 2.81 },
        { ciudad: "Cundinamarca", producto: "Revision", serviciosProducto: 0, serviciosEfectivos: 0, ingresos: 0, inversion: 65595, cpa: 0, roas: 0 }
      ],
      resumenGeneral: { ingresos: 2659000, inversion: 933072, utilidad: 1725928, roas: 2.85 }
    }
  ],
  viva_calentadores: [
    {
      week: "Semana 1 (Mayo)",
      metaAds: [
        { region: "Daniela Martínez", mensajes: 221, inversion: 963871, costoMensaje: 4361 },
        { region: "CH Provider", mensajes: 349, inversion: 981034, costoMensaje: 2811 }
      ],
      resumenCiudad: [
        {
          ciudad: "Bogotá",
          region: "Distrito Especial",
          serviciosProducto: 19,
          serviciosEfectivos: 12,
          ingresos: 2991150,
          inversion: 865798,
          mensajes: 320,
          cpa: 45568,
          roas: 3.45,
          bitacoraVentas: 12,
          conversion: 5.96
        },
        {
          ciudad: "Medellín",
          region: "Antioquia",
          serviciosProducto: 8,
          serviciosEfectivos: 6,
          ingresos: 544500,
          inversion: 786254,
          mensajes: 220,
          cpa: 98282,
          roas: 0.69,
          bitacoraVentas: 6,
          conversion: 2.72
        }
      ],
      desgloseProducto: [
        { ciudad: "Bogotá", producto: "Calentador", serviciosProducto: 15, serviciosEfectivos: 11, ingresos: 2952150, inversion: 683525, cpa: 45568, roas: 4.32 },
        { ciudad: "Bogotá", producto: "Lavadora", serviciosProducto: 2, serviciosEfectivos: 0, ingresos: 0, inversion: 91137, cpa: 45569, roas: 0 },
        { ciudad: "Bogotá", producto: "Estufa", serviciosProducto: 2, serviciosEfectivos: 1, ingresos: 39000, inversion: 91137, cpa: 45569, roas: 0.43 },
        { ciudad: "Medellín", producto: "Calentador", serviciosProducto: 7, serviciosEfectivos: 5, ingresos: 512000, inversion: 687972, cpa: 98282, roas: 0.74 },
        { ciudad: "Medellín", producto: "Estufa", serviciosProducto: 1, serviciosEfectivos: 1, ingresos: 32500, inversion: 98282, cpa: 98282, roas: 0.33 }
      ],
      resumenGeneral: { ingresos: 3535650, inversion: 1944905, utilidad: 1590745, roas: 1.82 }
    },
    {
      week: "Semana 3 (Mayo)",
      metaAds: [
        { region: "Distrito Especial", mensajes: 165, inversion: 525563, costoMensaje: 3185 },
        { region: "Antioquia", mensajes: 115, inversion: 372125, costoMensaje: 3235 },
        { region: "Cundinamarca", mensajes: 33, inversion: 104847, costoMensaje: 3177 }
      ],
      resumenCiudad: [
        {
          ciudad: "Bogotá",
          region: "Distrito Especial",
          serviciosProducto: 23,
          serviciosEfectivos: 17,
          ingresos: 2579750,
          inversion: 525563,
          mensajes: 165,
          cpa: 22851,
          roas: 4.91,
          bitacoraVentas: 17,
          conversion: 10.3
        },
        {
          ciudad: "Medellín",
          region: "Antioquia",
          serviciosProducto: 5,
          serviciosEfectivos: 3,
          ingresos: 217000,
          inversion: 372125,
          mensajes: 115,
          cpa: 74425,
          roas: 0.58,
          bitacoraVentas: 3,
          conversion: 2.6
        }
      ],
      desgloseProducto: [
        { ciudad: "Bogotá", producto: "Calentador", serviciosProducto: 22, serviciosEfectivos: 17, ingresos: 2579750, inversion: 502712, cpa: 22851, roas: 5.13 },
        { ciudad: "Bogotá", producto: "Nevera", serviciosProducto: 1, serviciosEfectivos: 0, ingresos: 0, inversion: 22851, cpa: 22851, roas: 0 },
        { ciudad: "Medellín", producto: "Calentador", serviciosProducto: 3, serviciosEfectivos: 3, ingresos: 217000, inversion: 223275, cpa: 74425, roas: 0.97 },
        { ciudad: "Medellín", producto: "Nevera", serviciosProducto: 1, serviciosEfectivos: 0, ingresos: 0, inversion: 74425, cpa: 74425, roas: 0 },
        { ciudad: "Medellín", producto: "Estufa", serviciosProducto: 1, serviciosEfectivos: 0, ingresos: 0, inversion: 74425, cpa: 74425, roas: 0 }
      ],
      resumenGeneral: { ingresos: 2796750, inversion: 1059697, utilidad: 1737053, roas: 2.64 }
    }
  ],
  printer_service: {
    isB2B: true,
    resumenGeneral: { inversion: 7193271, mensajes: 5366, costoMensaje: 1341 },
    regiones: [
      { region: "Distrito Especial", inversion: 2648890, mensajes: 1964, costoMensaje: 1348 },
      { region: "Antioquia", inversion: 1838033, mensajes: 1385, costoMensaje: 1327 },
      { region: "Valle del Cauca", inversion: 1388544, mensajes: 1133, costoMensaje: 1225 },
      { region: "Atlántico", inversion: 548366, mensajes: 382, costoMensaje: 1435 },
      { region: "Cundinamarca", inversion: 366131, mensajes: 244, costoMensaje: 1500 },
      { region: "Santander", inversion: 308178, mensajes: 218, costoMensaje: 1413 }
    ]
  },
  ingenova: [] // Empty by default as it is blank
};

function parseCOP(val?: string | null): number {
  if (!val) return 0;
  const clean = val.replace(/[\$\.\s]/g, '').replace(/,/g, '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function parsePercent(val?: string | null): number {
  if (!val) return 0;
  const clean = val.replace(/%/g, '').replace(/,/g, '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function parseNumber(val?: string | null): number {
  if (!val) return 0;
  const clean = val.replace(/[\$\.\s]/g, '').replace(/,/g, '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function normalizeHeader(h?: string | null): string {
  if (!h) return '';
  return h.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_%]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get('brandId') || 'pro_mascotas';

  const sheetUrl = BRAND_SHEETS[brandId];
  if (!sheetUrl) {
    return NextResponse.json({ success: false, error: `Invalid brandId: ${brandId}` }, { status: 400 });
  }

  try {
    const response = await fetch(sheetUrl, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Google Sheets export returned status ${response.status}`);
    }

    const csvText = await response.text();
    
    // Check if the CSV is completely empty (no length or only headers)
    if (!csvText.trim()) {
      return NextResponse.json({ 
        success: true, 
        brandId, 
        isEmpty: true,
        data: [], 
        message: "El archivo de estadísticas está vacío en Google Sheets." 
      });
    }

    // Manual CSV parsing to handle quotes and commas properly
    const lines: string[][] = [];
    const rawLines = csvText.split('\n');
    for (const rawLine of rawLines) {
      const row: string[] = [];
      let inQuotes = false;
      let currentCell = '';
      
      for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
        const char = rawLine[charIdx];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(currentCell.trim());
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      row.push(currentCell.trim());
      lines.push(row);
    }

    // Check if we are parsing PrinterService (monthly flat list) or weekly report brands
    if (brandId === 'printer_service') {
      const result: any = {
        isB2B: true,
        resumenGeneral: { inversion: 0, mensajes: 0, costoMensaje: 0 },
        regiones: []
      };

      let currentSection = '';

      for (let i = 0; i < lines.length; i++) {
        const row = lines[i];
        if (row.length === 0 || row.every(c => c === '')) continue;
        const joined = row.join(' ').toUpperCase();

        if (joined.includes('TOTAL INVERTIDO MES')) {
          result.resumenGeneral.inversion = parseCOP(row[2] || row[1]);
        } else if (joined.includes('TOTAL MENSAJES DEL MES')) {
          result.resumenGeneral.mensajes = parseNumber(row[2] || row[1]);
        } else if (joined.includes('COSTO POR MENSAJE TOTAL')) {
          result.resumenGeneral.costoMensaje = parseCOP(row[2] || row[1]);
        } else if (joined.includes('INVERTIDO') && joined.includes('REGION')) {
          currentSection = 'inversion';
          continue;
        } else if (joined.includes('MENSAJES') && joined.includes('REGION')) {
          currentSection = 'mensajes';
          continue;
        }

        const region = row[1] || row[0];
        if (region && region !== 'TOTAL' && region !== 'REGIÓN' && region !== 'TOTAL INVERTIDO MES' && region !== 'TOTAL MENSAJES DEL MES' && region !== 'COSTO POR MENSAJE TOTAL' && !region.startsWith('#') && !region.includes('INVERTIDO')) {
          const val = parseCOP(row[2] || row[1]);
          const existing = result.regiones.find((r: any) => r.region === region);
          
          if (currentSection === 'inversion') {
            if (existing) {
              existing.inversion = val;
            } else {
              result.regiones.push({ region, inversion: val, mensajes: 0, costoMensaje: 0 });
            }
          } else if (currentSection === 'mensajes') {
            if (existing) {
              existing.mensajes = val;
            } else {
              result.regiones.push({ region, inversion: 0, mensajes: val, costoMensaje: 0 });
            }
          }
        }
      }

      // Calculate cost per message for each region
      result.regiones.forEach((r: any) => {
        r.costoMensaje = r.mensajes > 0 ? Math.round(r.inversion / r.mensajes) : 0;
      });

      // Filter out empty regions and sort by investment
      result.regiones = result.regiones.filter((r: any) => r.inversion > 0 || r.mensajes > 0);
      result.regiones.sort((a: any, b: any) => b.inversion - a.inversion);

      return NextResponse.json({ success: true, brandId, data: result });
    }

    // Otherwise, parse standard weekly reports layout (ProMascotas, Viva Calentadores, Ingenova)
    const reportWeeks: any[] = [];
    let currentWeek: any = null;

    for (let i = 0; i < lines.length; i++) {
      const row = lines[i];
      if (row.length === 0 || row.every(c => c === '')) continue;

      const joined = row.join(' ').toUpperCase();
      
      // Detect week headers by searching for keywords
      if ((joined.includes('ABRIL') || joined.includes('MAYO') || joined.includes('SEMANAL') || joined.includes('SEMANA')) && !joined.includes('META') && !joined.includes('CIUDAD') && !joined.includes('PRODUCTO') && !joined.includes('GENERAL')) {
        let weekName = row.find(c => c !== '') || '';
        weekName = weekName.replace('PRO-MASCOTAS - REPORTE SEMANAL', '')
                           .replace('CLUB HOUSE — REPORTE SEMANAL', '')
                           .replace(/[\(\)]/g, '')
                           .trim();
        
        if (weekName.toUpperCase() === 'TOTAL' || weekName.toUpperCase() === 'RESUMEN') continue;

        currentWeek = {
          week: weekName,
          metaAds: [],
          resumenCiudad: [],
          desgloseProducto: [],
          resumenGeneral: null
        };
        reportWeeks.push(currentWeek);
        continue;
      }

      if (!currentWeek) continue;

      // Parse Meta Ads Table
      if (joined.includes('REPORTE META ADS')) {
        i++;
        while (i < lines.length && lines[i].every(c => c === '')) i++;
        
        const headerRow = lines[i];
        if (!headerRow) continue;
        
        const headerMap: Record<string, number> = {};
        headerRow.forEach((h, idx) => {
          const norm = normalizeHeader(h);
          if (norm) headerMap[norm] = idx;
        });

        i++;
        while (i < lines.length) {
          const dataRow = lines[i];
          if (!dataRow || dataRow.every(c => c === '')) break;
          
          const rowStr = dataRow.join(' ').toUpperCase();
          if (rowStr.includes('REPORTE') || rowStr.includes('RESUMEN') || rowStr.includes('DESGLOSE')) {
            i--;
            break;
          }

          const regionIdx = headerMap['region'] !== undefined ? headerMap['region'] : (headerMap['cuenta'] !== undefined ? headerMap['cuenta'] : 1);
          const region = dataRow[regionIdx];

          if (region && region !== 'TOTAL' && region !== 'TOTAL INVERSIÓN' && region !== 'TOTAL MENSAJES' && region !== 'TOTAL CONVERSACIONES' && region.toLowerCase() !== 'region' && region.toLowerCase() !== 'cuenta') {
            currentWeek.metaAds.push({
              region: region,
              mensajes: parseNumber(dataRow[headerMap['mensajes_totales'] || headerMap['mensajes'] || headerMap['conversaciones'] || 2]),
              inversion: parseCOP(dataRow[headerMap['inversion_cop'] || headerMap['inversion'] || headerMap['inversion_total'] || 3]),
              costoMensaje: parseCOP(dataRow[headerMap['costo_por_mensaje_cop'] || headerMap['costo_por_mensaje'] || headerMap['costo_por_conversacion'] || 4])
            });
          }
          i++;
        }
      }

      // Parse Resumen/Servicios por Ciudad Table
      if (joined.includes('SERVICIOS A REALIZAR') || joined.includes('RESUMEN POR CIUDAD')) {
        i++;
        while (i < lines.length && lines[i].every(c => c === '')) i++;

        const headerRow = lines[i];
        if (!headerRow) continue;

        const headerMap: Record<string, number> = {};
        headerRow.forEach((h, idx) => {
          const norm = normalizeHeader(h);
          if (norm) headerMap[norm] = idx;
        });

        i++;
        while (i < lines.length) {
          const dataRow = lines[i];
          if (!dataRow || dataRow.every(c => c === '')) break;

          const rowStr = dataRow.join(' ').toUpperCase();
          if (rowStr.includes('REPORTE') || rowStr.includes('RESUMEN') || rowStr.includes('DESGLOSE')) {
            i--;
            break;
          }

          const ciudadIdx = headerMap['ciudad'] !== undefined ? headerMap['ciudad'] : 1;
          const ciudad = dataRow[ciudadIdx];

          if (ciudad && ciudad !== 'TOTAL' && ciudad.toLowerCase() !== 'ciudad') {
            currentWeek.resumenCiudad.push({
              ciudad: ciudad,
              region: headerMap['region'] !== undefined ? dataRow[headerMap['region']] : 'Distrito Especial',
              serviciosProducto: parseNumber(dataRow[headerMap['servicios_x_producto'] || headerMap['sxp'] || 3]),
              serviciosEfectivos: parseNumber(dataRow[headerMap['servicios_efectivos'] || headerMap['efectivos'] || 4]),
              ingresos: parseCOP(dataRow[headerMap['ingresos_cop'] || headerMap['ingresos'] || 5]),
              inversion: parseCOP(dataRow[headerMap['inversion_cop'] || headerMap['inversion'] || 6]),
              mensajes: parseNumber(dataRow[headerMap['mensajes_region'] || headerMap['mensajes'] || 7]),
              cpa: parseCOP(dataRow[headerMap['cpa_por_servicio_efectivo_cop'] || headerMap['cpa'] || 8]),
              roas: parseNumber(dataRow[headerMap['roas'] || 10]),
              bitacoraVentas: parseNumber(dataRow[headerMap['bitacora_ventas'] || headerMap['bitacora_agendamientos'] || headerMap['agendamientos'] || 11]),
              conversion: parsePercent(dataRow[headerMap['%_conversion'] || headerMap['percent_conversion'] || headerMap['__conversion'] || 12])
            });
          }
          i++;
        }
      }

      // Parse Desglose Producto Table
      if (joined.includes('DESGLOSE POR CIUDAD Y PRODUCTO')) {
        i++;
        while (i < lines.length && lines[i].every(c => c === '')) i++;

        const headerRow = lines[i];
        if (!headerRow) continue;

        const headerMap: Record<string, number> = {};
        headerRow.forEach((h, idx) => {
          const norm = normalizeHeader(h);
          if (norm) headerMap[norm] = idx;
        });

        i++;
        while (i < lines.length) {
          const dataRow = lines[i];
          if (!dataRow || dataRow.every(c => c === '')) break;

          const rowStr = dataRow.join(' ').toUpperCase();
          if (rowStr.includes('REPORTE') || rowStr.includes('RESUMEN') || rowStr.includes('DESGLOSE')) {
            i--;
            break;
          }

          const ciudadIdx = headerMap['ciudad'] !== undefined ? headerMap['ciudad'] : 1;
          const ciudad = dataRow[ciudadIdx];

          if (ciudad && ciudad !== 'TOTAL' && ciudad.toLowerCase() !== 'ciudad') {
            currentWeek.desgloseProducto.push({
              ciudad: ciudad,
              producto: dataRow[headerMap['producto'] || 2],
              serviciosProducto: parseNumber(dataRow[headerMap['servicios_x_producto'] || headerMap['sxp'] || 3]),
              serviciosEfectivos: parseNumber(dataRow[headerMap['servicios_efectivos'] || headerMap['efectivos'] || 4]),
              ingresos: parseCOP(dataRow[headerMap['ingresos'] || 5]),
              inversion: parseCOP(dataRow[headerMap['inversion_asignada'] || headerMap['inversion'] || 6]),
              cpa: parseCOP(dataRow[headerMap['cpa'] || 7]),
              roas: parseNumber(dataRow[headerMap['roas'] || 8])
            });
          }
          i++;
        }
      }

      // Parse Resumen General
      if (joined.includes('RESUMEN GENERAL') || (joined.includes('RESUMEN') && !joined.includes('CIUDAD') && !joined.includes('SEMANAL'))) {
        i++;
        while (i < lines.length && lines[i].every(c => c === '')) i++;

        const headerRow = lines[i];
        if (!headerRow) continue;

        const headerMap: Record<string, number> = {};
        headerRow.forEach((h, idx) => {
          const norm = normalizeHeader(h);
          if (norm) headerMap[norm] = idx;
        });

        i++;
        while (i < lines.length) {
          const dataRow = lines[i];
          if (!dataRow || dataRow.every(c => c === '')) break;

          const rowStr = dataRow.join(' ').toUpperCase();
          if (rowStr.includes('REPORTE') || rowStr.includes('RESUMEN') || rowStr.includes('DESGLOSE')) {
            i--;
            break;
          }

          const firstCol = dataRow[0] || dataRow[1] || '';
          const isTotal = firstCol.toUpperCase() === 'TOTAL' || firstCol.toUpperCase() === 'TOTAL GENERAL' || firstCol.toUpperCase() === 'INGRESOS TOTALES' || firstCol.toUpperCase() === 'SERVICIOS TOTALES (SXP)';
          
          if (isTotal || (headerMap['ingresos'] !== undefined && firstCol.startsWith('$')) || (headerMap['valor'] !== undefined && firstCol.includes('Servicios'))) {
            let ingresos = 0;
            let inversion = 0;
            let utilidad = 0;

            if (headerMap['valor'] !== undefined) {
              // Flat B2C layout in General Summary rows
              // Read rows sequentially
              let idx = i;
              while (idx < lines.length) {
                const r = lines[idx];
                if (!r || r.every(c => c === '')) break;
                const mName = normalizeHeader(r[0] || r[1]);
                const mVal = r[headerMap['valor']];
                if (mName.includes('ingresos')) ingresos = parseCOP(mVal);
                else if (mName.includes('inversion')) inversion = parseCOP(mVal);
                else if (mName.includes('utilidad')) utilidad = parseCOP(mVal);
                idx++;
              }
              i = idx; // skip
            } else {
              const ingKey = headerMap['ingresos_generados'] !== undefined ? 'ingresos_generados' : 'ingresos';
              const invKey = headerMap['invertido'] !== undefined ? 'invertido' : 'inversion';
              const utiKey = headerMap['utilidad'] !== undefined ? 'utilidad' : 'utilidad';

              ingresos = parseCOP(dataRow[headerMap[ingKey] !== undefined ? headerMap[ingKey] : 1]);
              inversion = parseCOP(dataRow[headerMap[invKey] !== undefined ? headerMap[invKey] : 2]);
              utilidad = parseCOP(dataRow[headerMap[utiKey] !== undefined ? headerMap[utiKey] : 3]);
            }

            currentWeek.resumenGeneral = {
              ingresos,
              inversion,
              utilidad,
              roas: inversion > 0 ? parseFloat((ingresos / inversion).toFixed(2)) : 0
            };
            break;
          }
          i++;
        }
      }
    }

    if (reportWeeks.length === 0) {
      throw new Error("Parsed zero weeks from CSV");
    }

    return NextResponse.json({ success: true, brandId, data: reportWeeks });
  } catch (error: any) {
    console.error(`Error fetching or parsing stats for brand ${brandId}:`, error);
    const fb = FALLBACKS[brandId];
    if (fb) {
      return NextResponse.json({ 
        success: true, 
        brandId, 
        data: fb, 
        warning: `Using local fallback data: ${error.message}` 
      });
    }

    return NextResponse.json({ success: true, brandId, isEmpty: true, data: [], error: error.message });
  }
}
