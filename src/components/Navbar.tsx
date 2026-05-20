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
  INGENOVA: '#f39c12',
  PROMASCOTAS: '#f1c40f',
  CLUBHOUSE: '#82b440',
};

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <header ref={navRef} className={`${styles.navbar} glass`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} aria-label="Volver al inicio" prefetch={false}>
          <div className={styles.fullLogo}>
            <Image 
              src="/logo.png" 
              alt="Soluciones Integrales AS SAS Logo" 
              width={180} 
              height={55} 
              className={styles.logoImg}
              style={{ width: 'auto', height: '55px' }}
              priority
            />
          </div>
          <div className={styles.iconLogo}>
            <Image 
              src="/icon.png" 
              alt="Soluciones Integrales Icon" 
              width={45} 
              height={45} 
              className={styles.logoImg}
              style={{ width: 'auto', height: '45px' }}
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
              <Link href="/empresas/clubhouse" className={styles.menuItem} role="menuitem" onClick={() => setIsOpen(false)} prefetch={false}>
                <span className={styles.brandTitle} style={{ color: COLORS.CLUBHOUSE }}>ClubHouse</span>
                <span className={styles.brandDesc}>Administración &amp; Capacitación</span>
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
