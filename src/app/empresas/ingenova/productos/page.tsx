import { Suspense } from 'react';
import ProductsCatalogClient from './ProductsCatalogClient';

export const metadata = {
  title: 'Catálogo de Equipos y Productos — Ingenova',
  description: 'Consulte el catálogo completo de equipos de filtración, suavización de agua, bombas de calor para piscinas y químicos de desinfección de Ingenova y Aqua Integral.',
};

export default function ProductosPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#666' }}>Cargando catálogo de productos...</div>}>
      <ProductsCatalogClient />
    </Suspense>
  );
}
