'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import s from './productos.module.css';
import { INGENOVA_PRODUCTS_DATA, Product } from '@/lib/ingenova-products-data';

const CATEGORY_TREE = {
  'Climatización': [
    'Bombas de calor Inverter',
    'Calentadores a gas',
    'Calentadores eléctricos'
  ],
  'Filtración y Bombeo': [
    'Filtros de arena',
    'Motobombas autocebantes',
    'Medios filtrantes'
  ],
  'Accesorios de Vaso': [
    'Boquillas de retorno',
    'Skimmers y desagües',
    'Iluminación LED subacuática'
  ],
  'Seguridad y Confort': [
    'Alarmas de inmersión',
    'Escaleras y pasamanos',
    'Cubiertas de seguridad'
  ]
};

export default function ProductsCatalogClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeCategory, setActiveCategory] = useState<string>('Climatización');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync state with URL search params on load or change
  useEffect(() => {
    const cat = searchParams.get('categoria');
    const sub = searchParams.get('subcategoria');
    
    if (cat && Object.keys(CATEGORY_TREE).includes(cat)) {
      setActiveCategory(cat);
    } else if (!cat) {
      setActiveCategory('Climatización');
    }
    
    if (sub) {
      setActiveSubcategory(sub);
    } else {
      setActiveSubcategory(null);
    }
  }, [searchParams]);

  // Update URL and state when category or subcategory is selected
  const handleSelectSubcategory = (cat: string, sub: string | null) => {
    setActiveCategory(cat);
    setActiveSubcategory(sub);
    
    const params = new URLSearchParams();
    params.set('categoria', cat);
    if (sub) {
      params.set('subcategoria', sub);
    }
    
    // Replace URL state without full page reload
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  const clearFilters = () => {
    setActiveCategory('Climatización');
    setActiveSubcategory(null);
    window.history.pushState(null, '', '?categoria=Climatizaci%C3%B3n');
  };

  // Filter products based on state
  const filteredProducts = INGENOVA_PRODUCTS_DATA.filter((product) => {
    if (activeSubcategory) {
      return product.category === activeCategory && product.subcategory === activeSubcategory;
    }
    return product.category === activeCategory;
  });

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedProduct(null);
    }
  };

  const getWaLink = (product: Product) => {
    const message = `Hola Ingenova, me interesa recibir asesoría y comprar el producto "${product.name}" con precio de ${product.price} (línea: ${product.category} - ${product.subcategory}).`;
    return `https://wa.me/573123043792?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className={s.catalogPage}>
      <div className={s.catalogContainer}>
        
        {/* ── HEADER ── */}
        <div className={s.headerSection}>
          <div className={s.breadcrumbs}>
            <Link href="/" className={s.breadcrumbLink}>Inicio</Link>
            <span className={s.bullet}>/</span>
            <Link href="/empresas/ingenova" className={s.breadcrumbLink}>Ingenova</Link>
            <span className={s.bullet}>/</span>
            <span className={s.breadcrumbActive}>Catálogo</span>
          </div>
          <h1 className={s.title}>
            Línea <span className={s.titleHighlight}>Ingenova</span>
          </h1>
          <p className={s.subtitle}>
            Equipos y soluciones especializadas para climatización, filtración, iluminación y seguridad de piscinas y jacuzzis, con respaldo técnico de Aqua Integral.
          </p>
        </div>

        {/* ── LAYOUT ── */}
        <div className={s.layout}>
          
          {/* ── SIDEBAR FILTERS ── */}
          <aside className={s.sidebar}>
            <h3 className={s.sidebarTitle}>Categorías</h3>
            {Object.entries(CATEGORY_TREE).map(([cat, subs]) => (
              <div key={cat} className={s.sidebarCategory}>
                <span className={s.categoryTitle}>{cat}</span>
                <ul className={s.subcategoriesList}>
                  <li className={s.subcategoryItem}>
                    <button 
                      onClick={() => handleSelectSubcategory(cat, null)}
                      className={`${s.subcategoryBtn} ${activeCategory === cat && activeSubcategory === null ? s.subcategoryBtnActive : ''}`}
                    >
                      <span className={s.bullet}>■</span> Todo {cat}
                    </button>
                  </li>
                  {subs.map((sub) => (
                    <li key={sub} className={s.subcategoryItem}>
                      <button 
                        onClick={() => handleSelectSubcategory(cat, sub)}
                        className={`${s.subcategoryBtn} ${activeCategory === cat && activeSubcategory === sub ? s.subcategoryBtnActive : ''}`}
                      >
                        <span className={s.bullet}>○</span> {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* ── MAIN PRODUCTS ── */}
          <main className={s.mainContent}>
            
            <div className={s.gridHeader}>
              <div className={s.resultsCount}>
                Mostrando <strong>{filteredProducts.length}</strong> producto{filteredProducts.length !== 1 ? 's' : ''} en {activeSubcategory ? `${activeCategory} › ${activeSubcategory}` : activeCategory}
              </div>
              {(activeSubcategory !== null || activeCategory !== 'Climatización') && (
                <button onClick={clearFilters} className={s.clearFiltersBtn}>
                  Restablecer filtros
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className={s.noProducts}>
                <h3 className={s.noProductsTitle}>No encontramos productos</h3>
                <p className={s.subtitle}>Estamos actualizando esta categoría con nuevos equipos de Aqua Integral. Consúltenos directamente.</p>
                <button onClick={clearFilters} className={s.noProductsBtn}>
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className={s.productsGrid}>
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className={s.productCard}>
                    <div className={s.productImageWrap}>
                      <Image 
                        src={prod.image} 
                        alt={prod.name} 
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className={s.productImg}
                        priority={false}
                      />
                    </div>
                    <div className={s.productBody}>
                      <span className={s.productCategoryTag}>{prod.subcategory}</span>
                      <h3 className={s.productName}>{prod.name}</h3>
                      <p className={s.productDesc}>{prod.description}</p>
                      
                      <div className={s.productFooter}>
                        <div>
                          <span className={s.priceLabel}>Precio sugerido</span>
                          <span className={s.productPrice}>{prod.price}</span>
                        </div>
                        <button 
                          className={s.viewDetailsBtn}
                          onClick={() => setSelectedProduct(prod)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

      </div>

      {/* ── DETAIL MODAL ── */}
      {selectedProduct && (
        <div className={s.modalOverlay} onClick={handleBackdropClick}>
          <div ref={modalRef} className={s.modalContent}>
            <button 
              className={s.closeBtn} 
              onClick={() => setSelectedProduct(null)}
              aria-label="Cerrar modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={s.closeIcon}>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className={s.modalGrid}>
              <div className={s.modalImageArea}>
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className={s.modalImg}
                />
              </div>
              
              <div className={s.modalDetailsArea}>
                <span className={s.modalCategoryTag}>{selectedProduct.category} › {selectedProduct.subcategory}</span>
                <h2 className={s.modalTitle}>{selectedProduct.name}</h2>
                
                <div className={s.modalPriceBox}>
                  <span className={s.modalPriceLabel}>Precio total (IVA Incluido)</span>
                  <div className={s.modalPrice}>{selectedProduct.price}</div>
                </div>

                <p className={s.modalDesc}>{selectedProduct.description}</p>

                <h4 className={s.featuresTitle}>Características principales:</h4>
                <ul className={s.featuresList}>
                  {selectedProduct.features.map((feature, idx) => (
                    <li key={idx} className={s.featureItem}>
                      <span className={s.featureBullet}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href={getWaLink(selectedProduct)}
                  target="_blank"
                  rel="noreferrer"
                  className={s.whatsappBtn}
                >
                  <span className={s.whatsappIcon}>💬</span>
                  Solicitar Asesoría y Compra por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
