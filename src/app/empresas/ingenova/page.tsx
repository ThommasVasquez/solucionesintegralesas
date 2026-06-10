import type { Metadata } from 'next';
import IngenovaClient from './IngenovaClient';

export const metadata: Metadata = {
  title: 'Ingenova — Construcción Civil y Acabados de Piscinas | Bogotá',
  description: 'Ingenova, especialistas en obras de construcción civil, remodelaciones, fachadas, cubiertas y diseño, construcción y acabados de piscinas y jacuzzis en Bogotá.',
  keywords: 'ingenova, construccion civil, remodelaciones, acabados de piscinas, fachadas, cubiertas, bogota',
  openGraph: {
    title: 'Ingenova — Soluciones Integrales AS',
    description: 'Especialistas en construcción civil, remodelaciones y acabados de piscinas.',
    type: 'website',
  },
};

export default function IngenovaPage() {
  return <IngenovaClient />;
}


