'use client';
import { Link } from 'next-view-transitions';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const COLORS = {
  SOLUCIONES: '#1a5d91',
  INGENOVA: '#cca043',
  PROMASCOTAS: '#f1c40f',
  VIVA_CALENTADORES: '#e35422',
};

const INGENOVA_CATEGORIES = [
  {
    title: 'Agua Potable',
    items: [
      { name: 'Desinfección ultravioleta' },
      { name: 'Dosificación' },
      { name: 'Filtración' },
      { name: 'Osmosis inversa' },
      { name: 'Plantas de tratamiento' },
      { name: 'Producto químico' },
      { name: 'Suavización de agua' }
    ]
  },
  {
    title: 'Tratamiento de agua residual',
    items: [
      { name: 'Equipos de agua residual' },
      { name: 'Plantas de tratamiento de agua residual' },
      { name: 'Químicos para tratamiento de aguas residuales' }
    ]
  },
  {
    title: 'Piscinas',
    items: [
      { name: 'Accesorios' },
      { name: 'Calefacción' },
      { name: 'Desinfeccion' },
      { name: 'Equipos para piscina' },
      { name: 'Filtros y bombas' },
      { name: 'Producto químico' }
    ]
  },
  {
    title: 'Análisis de agua',
    items: [
      { name: 'Comparadores visuales' },
      { name: 'Equipos para medir la calidad del agua' },
      { name: 'Reactivos, laboratorio y otros' }
    ]
  },
  {
    title: 'Bombas de agua',
    items: [
      { name: 'Accesorios de instalación' },
      { name: 'Bombas centrifugas' },
      { name: 'Bombas multietapas' },
      { name: 'Bombas Periféricas' },
      { name: 'Bombeo sumergible' },
      { name: 'Presurización' }
    ]
  }
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(e.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, []);

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const isActive = pathname === href;
    if (isActive) {
      return (
        <span className={styles.link} style={{ fontWeight: 700, color: '#111', cursor: 'default' }}>
          {children}
        </span>
      );
    }
    return (
      <Link href={href} className={styles.link} prefetch={false}>
        {children}
      </Link>
    );
  };

  const getLogoSrc = () => {
    if (pathname.includes('viva-calentadores')) {
      return {
        full: '/viva-calentadores-logo.jpg',
        icon: '/viva-calentadores-logo.jpg',
        alt: 'Viva Calentadores Logo',
        style: { width: 'auto', height: '55px', borderRadius: '8px' }
      };
    }
    if (pathname.includes('ingenova')) {
      return {
        full: '/ingenova-logo.jpg',
        icon: '/ingenova-logo.jpg',
        alt: 'Ingenova Logo',
        style: { width: 'auto', height: '55px', borderRadius: '8px' }
      };
    }
    if (pathname.includes('printerservice')) {
      return {
        full: '/printerservice-logo.png',
        icon: '/printerservice-logo.png',
        alt: 'PrinterService Logo',
        style: { width: 'auto', height: '55px' }
      };
    }
    return {
      full: '/logo.png',
      icon: '/icon.png',
      alt: 'Soluciones Integrales AS SAS Logo',
      style: { width: 'auto', height: '55px' }
    };
  };

  const currentLogo = getLogoSrc();

  return (
    <header ref={navRef} className={`${styles.navbar} glass`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} aria-label="Volver al inicio" prefetch={false}>
          <div className={styles.fullLogo}>
            <Image 
              src={currentLogo.full} 
              alt={currentLogo.alt} 
              width={180} 
              height={55} 
              className={styles.logoImg}
              style={currentLogo.style}
              priority
            />
          </div>
          <div className={styles.iconLogo}>
            <Image 
              src={currentLogo.icon} 
              alt={currentLogo.alt} 
              width={45} 
              height={45} 
              className={styles.logoImg}
              style={{ width: 'auto', height: '45px', borderRadius: currentLogo.icon.includes('logo') ? '6px' : '0px' }}
              priority
            />
          </div>
        </Link>
        
        <nav className={styles.links} aria-label="Navegación principal">
          {pathname.includes('ingenova') ? (
            <>
              <a href="#inicio" className={`${styles.link} ${styles.ingenovaLink}`}>Inicio</a>
              <a href="#soluciones" className={`${styles.link} ${styles.ingenovaLink}`}>Servicios</a>
              <div 
                ref={productsDropdownRef}
                className={styles.megaMenuContainer}
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
                aria-haspopup="true"
                aria-expanded={isProductsOpen}
                style={{ paddingBottom: '0' }}
              >
                <button 
                  className={styles.navDropdownBtn}
                  aria-label="Ver productos"
                  onClick={() => setIsProductsOpen(prev => !prev)}
                >
                  Productos
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.chevron} aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                
                <div className={`${styles.megaMenu} ${isProductsOpen ? styles.menuVisible : ''}`} role="menu">
                  {INGENOVA_CATEGORIES.map((cat, idx) => (
                    <div key={idx} className={styles.megaMenuColumn}>
                      <h4 className={styles.megaMenuColumnTitle} style={{ color: COLORS.INGENOVA }}>{cat.title}</h4>
                      <ul className={styles.megaMenuList}>
                        {cat.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <a 
                              href={`https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20recibir%20informaci%C3%B3n%20y%20precios%20sobre%20la%20categor%C3%ADa%20"${encodeURIComponent(cat.title + ' - ' + item.name)}".`}
                              target="_blank" 
                              rel="noreferrer" 
                              className={styles.megaMenuLink}
                              onClick={() => setIsProductsOpen(false)}
                            >
                              <span className={styles.bullet}>○</span> {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <a href="#contacto" className={`${styles.link} ${styles.ingenovaLink}`}>Contacto</a>
            </>
          ) : isHomePage ? (
            <>
              <Link href="/#servicios" className={styles.link} prefetch={false}>Servicios</Link>
              <Link href="/#nosotros" className={styles.link} prefetch={false}>Nosotros</Link>
              <Link href="/#contacto" className={styles.link} prefetch={false}>Contacto</Link>
            </>
          ) : (
            <>
              <NavLink href="/">Inicio</NavLink>
              <NavLink href="/dashboard">Panel</NavLink>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {!session ? (
            <Link href="/login" className={styles.loginBtn} prefetch={false}>
              <span className={styles.fullText}>Ingresar</span>
              <span className={styles.mobileText}>Login</span>
            </Link>
          ) : (
            <div 
              className={styles.dropdownContainer}
              onMouseEnter={() => setIsAuthMenuOpen(true)}
              onMouseLeave={() => setIsAuthMenuOpen(false)}
            >
              <button className={styles.loginBtn} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                {session.user?.name?.split(' ')[0]}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={styles.chevron}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              
              <div className={`${styles.dropdownMenu} ${isAuthMenuOpen ? styles.menuVisible : ''} ${styles.authDropdown}`}>
                <Link href="/dashboard" className={styles.menuItem} prefetch={false}>
                  <span className={styles.brandTitle} style={{ color: COLORS.SOLUCIONES }}>Dashboard</span>
                </Link>
                <div className={styles.menuItem} onClick={() => signOut({ callbackUrl: '/' })}>
                  <span className={styles.brandTitle} style={{ color: '#ff4d4d' }}>Cerrar Sesión</span>
                </div>
              </div>
            </div>
          )}
          
          <div 
            ref={dropdownRef}
            className={styles.dropdownContainer}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <button 
              className={styles.ctaBtn} 
              style={{ backgroundColor: COLORS.SOLUCIONES }}
              aria-label="Ver nuestras empresas"
              onClick={() => setIsOpen(prev => !prev)}
            >
              <span className={styles.fullText}>Empresas</span>
              <span className={styles.mobileText}>Empresas</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron} aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            
            <div className={`${styles.dropdownMenu} ${isOpen ? styles.menuVisible : ''}`} role="menu">
              <Link href="/empresas/ingenova" className={styles.menuItem} role="menuitem" onClick={() => setIsOpen(false)} prefetch={false}>
                <span className={styles.brandTitle} style={{ color: COLORS.INGENOVA }}>Ingenova</span>
                <span className={styles.brandDesc}>Jacuzzis, Piscinas &amp; Turcos</span>
              </Link>
              <Link href="/empresas/viva-calentadores" className={styles.menuItem} role="menuitem" onClick={() => setIsOpen(false)} prefetch={false}>
                <span className={styles.brandTitle} style={{ color: COLORS.VIVA_CALENTADORES }}>Viva Calentadores</span>
                <span className={styles.brandDesc}>Mantenimiento &amp; Reparación</span>
              </Link>
              <Link href="/empresas/promascotas" className={styles.menuItem} role="menuitem" onClick={() => setIsOpen(false)} prefetch={false}>
                <span className={styles.brandTitle} style={{ color: COLORS.PROMASCOTAS }}>ProMascotas</span>
                <span className={styles.brandDesc}>Profilaxis a Domicilio</span>
              </Link>
              <Link href="/empresas/soluciones-as" className={styles.menuItem} role="menuitem" onClick={() => setIsOpen(false)} prefetch={false}>
                <span className={styles.brandTitle} style={{ color: COLORS.SOLUCIONES }}>Soluciones AS</span>
                <span className={styles.brandDesc}>Respaldo Corporativo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
