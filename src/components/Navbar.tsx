'use client';
import { Link } from 'next-view-transitions';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
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
          <Link href="#servicios" className={styles.link}>Líneas de Negocio</Link>
          <Link href="#nosotros" className={styles.link}>Nosotros</Link>
          <Link href="#cobertura" className={styles.link}>Cobertura</Link>
          <Link href="#contacto" className={styles.link}>Contacto</Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/login" className={styles.loginBtn} aria-label="Ingresar a mi cuenta">
            Ingresar
          </Link>
          
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
