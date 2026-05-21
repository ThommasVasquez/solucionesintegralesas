import type { Metadata } from 'next';
import IngenovaClient from './IngenovaClient';

export const metadata: Metadata = {
  title: 'Ingenova — Mantenimiento Premium de Piscinas, Jacuzzis & Turcos | Bogotá',
  description: 'Empresa líder en mantenimiento especializado de zonas húmedas en Colombia. Piscinas, jacuzzis y turcos con técnicos certificados, repuestos originales y garantía escrita.',
  keywords: 'mantenimiento piscinas bogota, jacuzzi bogota, turco mantenimiento, quimicos piscina, motobomba piscina',
  openGraph: {
    title: 'Ingenova — Soluciones Integrales AS',
    description: 'Expertos en piscinas, jacuzzis y turcos en Bogotá',
    type: 'website',
  },
};

export default function IngenovaPage() {
  return <IngenovaClient />;
}

