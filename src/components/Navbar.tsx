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
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const isHomePage = pathname === '/';

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
      <Link href={href} className={styles.link}>
        {children}
      </Link>
    );
  };

  return (
    <header ref={navRef} className={`${styles.navbar} glass`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} aria-label="Volver al inicio">
          <Image 
            src="/logo.png" 
            alt="Soluciones Integrales AS SAS Logo" 
            width={180} 
            height={55} 
            className={styles.logoImg}
            priority
          />
        </Link>
        
        <nav className={styles.links} aria-label="Navegación principal">
          {isHomePage ? (
            <>
              <Link href="/#servicios" className={styles.link}>Líneas de Negocio</Link>
              <Link href="/#nosotros" className={styles.link}>Nosotros</Link>
              <Link href="/#cobertura" className={styles.link}>Cobertura</Link>
              <Link href="/#contacto" className={styles.link}>Contacto</Link>
            </>
          ) : (
            <>
              <NavLink href="/">Inicio Web</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/dashboard/promascotas">ProMascotas</NavLink>
              <NavLink href="/dashboard/clubhouse">ClubHouse</NavLink>
              <NavLink href="/dashboard/ingenova">Ingenova</NavLink>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {!session ? (
            <Link href="/login" className={styles.loginBtn}>
              Ingresar
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
              
              <div className={`${styles.dropdownMenu} ${isAuthMenuOpen ? styles.menuVisible : ''}`}>
                <Link href="/dashboard" className={styles.menuItem}>
                  <span className={styles.brandTitle} style={{ color: COLORS.SOLUCIONES }}>Ir al Dashboard</span>
                  <span className={styles.brandDesc}>Panel principal</span>
                </Link>
                <div className={styles.menuItem} onClick={() => signOut({ callbackUrl: '/' })}>
                  <span className={styles.brandTitle} style={{ color: '#ff4d4d' }}>Cerrar Sesión</span>
                  <span className={styles.brandDesc}>Finalizar sesión actual</span>
                </div>
              </div>
            </div>
          )}
          
          <div 
            className={styles.dropdownContainer}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <button 
              className={styles.ctaBtn} 
              style={{ backgroundColor: COLORS.SOLUCIONES }}
              aria-label="Seleccionar marca para agendar cita"
            >
              Agendar servicio
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron} aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            
            <div className={`${styles.dropdownMenu} ${isOpen ? styles.menuVisible : ''}`} role="menu">
              <a href="https://wa.me/573001234567?text=Hola! Quiero agendar mantenimiento de piscina/jacuzzi con Ingenova" target="_blank" rel="noreferrer" className={styles.menuItem} role="menuitem">
                <span className={styles.brandTitle} style={{ color: COLORS.INGENOVA }}>Ingenova</span>
                <span className={styles.brandDesc}>Jacuzzis, Piscinas & Turcos</span>
              </a>
              <a href="https://wa.me/573001234567?text=Hola! Quiero información sobre administración de piscinas o natación con ClubHouse" target="_blank" rel="noreferrer" className={styles.menuItem} role="menuitem">
                <span className={styles.brandTitle} style={{ color: COLORS.CLUBHOUSE }}>ClubHouse</span>
                <span className={styles.brandDesc}>Administración & Capacitación</span>
              </a>
              <a href="https://wa.me/573001234567?text=Hola! Quiero agendar profilaxis dental para mi mascota con ProMascotas" target="_blank" rel="noreferrer" className={styles.menuItem} role="menuitem">
                <span className={styles.brandTitle} style={{ color: COLORS.PROMASCOTAS }}>ProMascotas</span>
                <span className={styles.brandDesc}>Profilaxis a Domicilio</span>
              </a>
              <a href="https://wa.me/573001234567?text=Hola! Quiero hablar con Soluciones Integrales AS" target="_blank" rel="noreferrer" className={styles.menuItem} role="menuitem">
                <span className={styles.brandTitle} style={{ color: COLORS.SOLUCIONES }}>Soluciones AS</span>
                <span className={styles.brandDesc}>Respaldo Corporativo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
