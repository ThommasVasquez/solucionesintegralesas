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

const INGENOVA_PRODUCTS = [
  { name: 'Bomba de Calor Inverter Fairland X20-22', price: '$19,620,125', link: 'https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20cotizar%20la%20Bomba%20de%20Calor%20Inverter%20Fairland%20X20-22%20por%20%2419.620.125.' },
  { name: 'Bomba de Calor Inverter 119.000 BTU', price: '$15,675,659', link: 'https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20cotizar%20la%20Bomba%20de%20Calor%20Inverter%20119.000%20BTU%20por%20%2415.675.659.' },
  { name: 'Bomba de Calor ProHeat Full Inverter 65k', price: '$9,124,920', link: 'https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20cotizar%20la%20Bomba%20de%20Calor%20ProHeat%20Full%20Inverter%2065k%20BTU%20por%20%249.124.920.' },
  { name: 'Bomba de Calor Frío/Calor 44.000 BTU', price: '$6,348,412', link: 'https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20cotizar%20la%20Bomba%20de%20Calor%20Fr%C3%ADo%20y%20Calor%2044.000%20BTU%20por%20%246.348.412.' },
  { name: 'Bomba de Calor HidroControl 14.000 BTU', price: '$2,706,774', link: 'https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20cotizar%20la%20Bomba%20de%20Calor%20HidroControl%2014.000%20BTU%20por%20%242.706.774.' },
  { name: 'Alarma de Inmersión Aqualarm', price: '$1,880,676', link: 'https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20comprar%20la%20Alarma%20de%20Inmers%C3%B3n%20Aqualarm%20por%20%241.880.676.' },
  { name: 'Modificador de Alcalinidad Alka (20 Kg)', price: '$128,520', link: 'https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20comprar%20Alka%20por%2020%20Kg%20por%20%24128.520.' },
  { name: 'Bicarbonato de Sodio (25 Kg)', price: '$76,874', link: 'https://wa.me/573123043792?text=Hola%20Ingenova%2C%20me%20interesa%20comprar%20Bicarbonato%20de%20Sodio%20por%2025%20Kg%20por%20%2476.874.' }
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
          {isHomePage ? (
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
          
          {pathname.includes('ingenova') && (
            <div 
              ref={productsDropdownRef}
              className={styles.dropdownContainer}
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
              aria-haspopup="true"
              aria-expanded={isProductsOpen}
            >
              <button 
                className={styles.ctaBtn} 
                style={{ backgroundColor: COLORS.INGENOVA, boxShadow: '0 10px 25px rgba(204, 160, 67, 0.2)' }}
                aria-label="Ver productos"
                onClick={() => setIsProductsOpen(prev => !prev)}
              >
                <span className={styles.fullText}>Productos</span>
                <span className={styles.mobileText}>Productos</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron} aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              
              <div className={`${styles.dropdownMenu} ${isProductsOpen ? styles.menuVisible : ''} ${styles.productsDropdown}`} role="menu">
                {INGENOVA_PRODUCTS.map((prod, idx) => (
                  <a 
                    key={idx} 
                    href={prod.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.menuItem} 
                    role="menuitem"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    <span className={styles.brandTitle} style={{ color: COLORS.INGENOVA }}>{prod.name}</span>
                    <span className={styles.brandDesc}>{prod.price}</span>
                  </a>
                ))}
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
