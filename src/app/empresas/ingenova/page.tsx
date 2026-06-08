import type { Metadata } from 'next';
import IngenovaClient from './IngenovaClient';

export const metadata: Metadata = {
  title: 'Ingenova — Construcción, Fachadas, Cubiertas y Piscinas | Bogotá',
  description: 'Ingenova, especialistas en construcción de piscinas y jacuzzis, impermeabilización de fachadas, cubiertas y suministro de maquinaria para piscinas en Bogotá y Sabana Norte.',
  keywords: 'ingenova, construccion de piscinas, impermeabilizacion de fachadas, cubiertas, techos, bombas de calor, bogota',
  openGraph: {
    title: 'Ingenova — Soluciones Integrales AS',
    description: 'Especialistas en construcción de piscinas, fachadas, cubiertas y equipos de climatización.',
    type: 'website',
  },
};

export default function IngenovaPage() {
  return <IngenovaClient />;
}


