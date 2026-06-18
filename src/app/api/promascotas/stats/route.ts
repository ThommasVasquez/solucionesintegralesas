import { NextResponse } from 'next/server';

const STATS_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1MwIVYmjvc9IPw_nWepCXlMj19XAugDc6zY37K0HvJ6Y/export?format=csv&gid=261864183";

// Fallback data in case the Google Sheet fetch fails
const FALLBACK_DATA = [
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
    resumenGeneral: {
      ingresos: 3314000,
      inversion: 1093524,
      utilidad: 2220476,
      roas: 3.03
    }
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
    resumenGeneral: {
      ingresos: 2659000,
      inversion: 933072,
      utilidad: 1725928,
      roas: 2.85
    }
  }
];

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

export async function GET() {
  try {
    const response = await fetch(STATS_SHEET_CSV_URL, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Google Sheets export returned status ${response.status}`);
    }

    const csvText = await response.text();
    
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

    const reportWeeks: any[] = [];
    let currentWeek: any = null;

    for (let i = 0; i < lines.length; i++) {
      const row = lines[i];
      if (row.length === 0 || row.every(c => c === '')) continue;

      const joined = row.join(' ').toUpperCase();
      
      if (joined.includes('ABRIL') && joined.includes('20') && joined.includes('25')) {
        currentWeek = {
          week: "20 al 25 de Abril",
          metaAds: [],
          resumenCiudad: [],
          desgloseProducto: [],
          resumenGeneral: null
        };
        reportWeeks.push(currentWeek);
        continue;
      } else if (joined.includes('REPORTE SEMANAL') && (joined.includes('27/04') || joined.includes('03/05'))) {
        currentWeek = {
          week: "27/04 - 03/05",
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

          const regionIdx = headerMap['region'] !== undefined ? headerMap['region'] : 1;
          const region = dataRow[regionIdx];

          if (region && region !== 'TOTAL' && region.toLowerCase() !== 'region') {
            currentWeek.metaAds.push({
              region: region,
              mensajes: parseNumber(dataRow[headerMap['mensajes_totales'] || headerMap['mensajes'] || 2]),
              inversion: parseCOP(dataRow[headerMap['inversion_cop'] || headerMap['inversion'] || 3]),
              costoMensaje: parseCOP(dataRow[headerMap['costo_por_mensaje_cop'] || headerMap['costo_por_mensaje'] || 4])
            });
          }
          i++;
        }
      }

      // Parse Resumen/Servicios por Ciudad Table
      if (joined.includes('SERVICIOS A REALIZAR EN SEMANA POR CIUDAD') || joined.includes('RESUMEN POR CIUDAD')) {
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
              serviciosProducto: parseNumber(dataRow[headerMap['servicios_x_producto'] || 3]),
              serviciosEfectivos: parseNumber(dataRow[headerMap['servicios_efectivos'] || 4]),
              ingresos: parseCOP(dataRow[headerMap['ingresos_cop'] || headerMap['ingresos'] || 5]),
              inversion: parseCOP(dataRow[headerMap['inversion_cop'] || headerMap['inversion'] || 6]),
              mensajes: parseNumber(dataRow[headerMap['mensajes_region'] || headerMap['mensajes'] || 7]),
              cpa: parseCOP(dataRow[headerMap['cpa_por_servicio_efectivo_cop'] || headerMap['cpa'] || 8]),
              roas: parseNumber(dataRow[headerMap['roas'] || 10]),
              bitacoraVentas: parseNumber(dataRow[headerMap['bitacora_ventas'] || headerMap['bitacora_agendamientos'] || 11]),
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
              serviciosProducto: parseNumber(dataRow[headerMap['servicios_x_producto'] || 3]),
              serviciosEfectivos: parseNumber(dataRow[headerMap['servicios_efectivos'] || 4]),
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
          
          if (firstCol.toUpperCase() === 'TOTAL' || (headerMap['ingresos'] !== undefined && firstCol.startsWith('$'))) {
            const ingKey = headerMap['ingresos_generados'] !== undefined ? 'ingresos_generados' : 'ingresos';
            const invKey = headerMap['invertido'] !== undefined ? 'invertido' : 'inversion';
            const utiKey = headerMap['utilidad'] !== undefined ? 'utilidad' : 'utilidad';

            const ingresos = parseCOP(dataRow[headerMap[ingKey] !== undefined ? headerMap[ingKey] : 1]);
            const inversion = parseCOP(dataRow[headerMap[invKey] !== undefined ? headerMap[invKey] : 2]);
            const utilidad = parseCOP(dataRow[headerMap[utiKey] !== undefined ? headerMap[utiKey] : 3]);

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

    return NextResponse.json({ success: true, data: reportWeeks });
  } catch (error: any) {
    console.error("Error fetching or parsing sheets: ", error);
    // Return fallback data so the dashboard never crashes
    return NextResponse.json({ 
      success: true, 
      data: FALLBACK_DATA, 
      warning: "Using local fallback data due to a fetch error: " + error.message 
    });
  }
}
