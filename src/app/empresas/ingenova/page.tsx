import type { Metadata } from 'next';
import IngenovaClient from './IngenovaClient';

export const metadata: Metadata = {
  title: 'Ingenova — Soluciones Integrales de Ingeniería y Obras Civiles | Bogotá',
  description: 'Ingenova, soluciones integrales en ingeniería, construcción de obras civiles, montajes mecánicos e infraestructura técnica en Bogotá y Sabana Norte.',
  keywords: 'ingenova, ingenieria civil, obras civiles, construccion, redes hidrosanitarias, contraincendio, sistemas de bombeo, bogota',
  openGraph: {
    title: 'Ingenova — Soluciones Integrales AS',
    description: 'Soluciones integrales en ingeniería, construcción de obras civiles e infraestructura técnica',
    type: 'website',
  },
};

export default function IngenovaPage() {
  return <IngenovaClient />;
}


