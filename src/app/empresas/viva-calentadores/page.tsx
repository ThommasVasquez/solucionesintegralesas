import type { Metadata } from 'next';
import Image from 'next/image';
import styles from '../empresa.module.css';

export const metadata: Metadata = {
  title: 'Viva Calentadores — Mantenimiento, Reparación e Instalación de Calentadores',
  description: 'Servicio técnico especializado de calentadores de agua a gas y eléctricos. Mantenimiento preventivo y correctivo, reparación e instalación en Bogotá y Sabana Norte.',
};

const COLOR = '#e35422';
const WA = 'https://wa.me/573001234567?text=Hola!%20Vengo%20de%20la%20web%20de%20Viva%20Calentadores%20y%20quiero%20información';

export default function VivaCalentadoresPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className={styles.hero} style={{ background: 'linear-gradient(135deg, #130704 0%, #2e1008 60%, #130704 100%)', color: '#fff' }}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <Image 
                src="/viva-calentadores-logo.jpg" 
                alt="Logo Viva Calentadores" 
                width={120} 
                height={120} 
                style={{ borderRadius: '16px', objectFit: 'contain', backgroundColor: '#fff', padding: '4px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                priority
              />
            </div>
            <span className={styles.brandTag} style={{ background: `${COLOR}22`, color: COLOR }}>
              🔥 Servicio Técnico Profesional
            </span>
            <h1 className={styles.heroH1} style={{ color: '#fff' }}>
              Su calentador de agua, <span style={{ color: COLOR }}>en manos expertas.</span>
            </h1>
            <p className={styles.heroP}>
              Garantice agua caliente y el bienestar de su hogar. Realizamos mantenimiento preventivo, reparación técnica e instalación de calentadores a gas y eléctricos de todas las marcas con técnicos certificados.
            </p>
            <div className={styles.heroCta}>
              <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
                style={{ background: COLOR, color: '#fff' }}>
                📲 Solicitar Servicio
              </a>
              <a href="#servicios" className={styles.ctaSecondary} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                Ver Servicios
              </a>
            </div>
          </div>
          <div className={styles.heroImages}>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=75&w=900&auto=format&fit=crop" alt="Ducha en baño moderno" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 100vw, 50vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=75&w=500&auto=format&fit=crop" alt="Calentador de agua a gas" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://madecentro.com/cdn/shop/files/electrodomesticos-haceb-calentadores-9002240-MP-madecentro5_700x700.webp?v=1713375093" alt="Calentador de agua a gas Haceb" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsSection} style={{ background: COLOR, color: '#fff' }}>
        <div className={styles.statsGrid}>
          {[
            { num: '+5k', label: 'Calentadores reparados' },
            { num: '+3k', label: 'Hogares con agua caliente' },
            { num: '100%', label: 'Técnicos certificados' },
            { num: '10+', label: 'Años de servicio' },
          ].map((s) => (
            <div key={s.label} className={styles.statBox}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="servicios" className={styles.services}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} style={{ color: COLOR }}>Nuestros servicios</span>
          <h2 className={styles.sectionTitle}>Soluciones integrales de agua caliente</h2>
          <p className={styles.sectionSub}>Desde revisiones de seguridad hasta instalaciones completas, cubrimos todo el ecosistema de calefacción de agua.</p>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { icon: '🛠️', title: 'Mantenimiento Preventivo', desc: 'Limpieza interna de quemadores, verificación de fugas de gas/agua, calibración de sensores y reemplazo preventivo de piezas de desgaste.' },
            { icon: '🔧', title: 'Reparación Técnica', desc: 'Solución rápida a fallas de encendido, variaciones de temperatura, ruidos extraños o apagados repentinos. Usamos repuestos originales.' },
            { icon: '🏗️', title: 'Instalación Certificada', desc: 'Montaje profesional de calentadores nuevos a gas o eléctricos siguiendo rigurosamente las normas técnicas de seguridad NTC.' },
            { icon: '📋', title: 'Diagnóstico & Dictamen', desc: 'Revisión exhaustiva por técnicos expertos para identificar fallas ocultas y recomendar la mejor opción de servicio o reemplazo.' },
            { icon: '🏠', title: 'Atención a Domicilio', desc: 'Técnicos equipados que se desplazan directamente a su hogar en Bogotá y Sabana Norte con herramientas de medición avanzadas.' },
            { icon: '🛡️', title: 'Garantía por Escrito', desc: 'Cada servicio técnico que realizamos viene respaldado por una garantía formal escrita. Su tranquilidad es nuestro deber.' },
          ].map((s) => (
            <div key={s.title} className={styles.serviceCard}>
              <div className={styles.serviceIcon} style={{ background: `${COLOR}18` }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className={styles.process}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} style={{ color: COLOR }}>¿Cómo trabajamos?</span>
          <h2 className={styles.sectionTitle}>Un proceso seguro y transparente</h2>
        </div>
        <div className={styles.processSteps}>
          {[
            { n: '01', title: 'Agendamiento', desc: 'Contáctenos por WhatsApp y elija la fecha y hora que mejor se adapten a su agenda.' },
            { n: '02', title: 'Visita Técnica', desc: 'Nuestro técnico certificado inspecciona su equipo y realiza un diagnóstico preciso.' },
            { n: '03', title: 'Mantenimiento', desc: 'Realizamos la reparación o servicio preventivo utilizando repuestos originales y probando seguridad.' },
            { n: '04', title: 'Prueba & Garantía', desc: 'Verificamos el flujo de agua caliente, monóxido de carbono y le entregamos su orden con garantía escrita.' },
          ].map((p) => (
            <div key={p.n} className={styles.processStep}>
              <div className={styles.stepNumber} style={{ background: COLOR }}>{p.n}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className={styles.ctaFinal} style={{ background: 'linear-gradient(135deg, #130704, #2e1008)', color: '#fff' }}>
        <div className={styles.ctaFinalContent}>
          <span style={{ fontSize: '3rem' }}>🔥</span>
          <h2 className={styles.ctaFinalTitle}>¿Listo para disfrutar de agua caliente sin fallas?</h2>
          <p className={styles.ctaFinalSub}>No arriesgue la seguridad de su hogar. Hablemos sobre cómo Viva Calentadores puede realizar el mantenimiento preventivo de su equipo hoy.</p>
          <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
            style={{ background: COLOR, color: '#fff', fontSize: '1.1rem' }}>
            📲 Agendar Servicio de Calentador
          </a>
        </div>
      </section>
    </main>
  );
}
