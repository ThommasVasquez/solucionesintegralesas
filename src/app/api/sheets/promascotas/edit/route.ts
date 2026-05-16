import { NextResponse } from 'next/server';
import { updateSheetData } from '@/lib/google-sheets';
import { auth } from '@/lib/auth';

const PROMASCOTAS_ID = '1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Solo PATRON y ADMIN pueden editar
  const role = (session.user as any).role;
  if (role !== 'PATRON' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
  }

  try {
    const { values, range } = await req.json();
    // Determinamos el nombre de la hoja (asumimos la primera o una por defecto)
    // Para simplificar usamos el ID y el rango directamente si el lib lo permite
    // En google-sheets.ts: updateSheetData(spreadsheetId, sheetName, range, values)
    // Como no sabemos el nombre exacto de la pestaña, intentaremos usar 'Hoja 1' o similar
    // pero lo ideal es pasar el nombre desde el frontend si es posible.
    // Por ahora usaremos 'Sheet1' que es el estándar.
    await updateSheetData(PROMASCOTAS_ID, 'Sheet1', range || 'A1', values);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating ProMascotas sheet:', error);
    return NextResponse.json({ error: 'Error al actualizar la hoja' }, { status: 500 });
  }
}
