import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google-sheets';
import { auth } from '@/lib/auth';

const PROMASCOTAS_ID = '1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // Obtenemos los datos de la primera hoja
    const data = await getSheetData(PROMASCOTAS_ID, 'A1:ZZ1000'); 
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching ProMascotas sheet:', error);
    return NextResponse.json({ error: 'Error al obtener datos de la hoja' }, { status: 500 });
  }
}
