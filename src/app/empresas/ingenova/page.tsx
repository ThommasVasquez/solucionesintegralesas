import type { Metadata } from 'next';
import IngenovaClient from './IngenovaClient';

export const metadata: Metadata = {
  title: 'Aqua Integral — Especialista en la Calidad del Agua | Bogotá',
  description: 'Aqua Integral, soluciones integrales en el tratamiento y control de la calidad del agua, garantizando el acceso confiable al agua limpia y segura.',
  keywords: 'tratamiento de agua, agua potable, agua residual, medicion y control, piscinas, bombas de agua, bogota',
  openGraph: {
    title: 'Aqua Integral — Soluciones Integrales AS',
    description: 'Soluciones integrales en el tratamiento y control de la calidad del agua',
    type: 'website',
  },
};

export default function IngenovaPage() {
  return <IngenovaClient />;
}


