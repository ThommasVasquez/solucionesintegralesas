import type { Metadata } from 'next';
import Image from 'next/image';
import styles from '../empresa.module.css';

export const metadata: Metadata = {
  title: 'Ingenova — Mantenimiento de Piscinas, Jacuzzis & Turcos | Soluciones Integrales AS',
  description: 'Expertos en mantenimiento preventivo y correctivo de piscinas, jacuzzis y turcos. Repuestos originales, químicos certificados y técnicos especializados en Bogotá y Sabana Norte.',
};

const COLOR = '#f39c12';
const COLOR_DARK = '#d68910';
const WA = 'https://wa.me/573001234567?text=Hola!%20Vengo%20de%20la%20web%20de%20Ingenova%20y%20quiero%20agendar%20un%20servicio';

export default function IngenovaPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className={styles.hero} style={{ background: `linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 60%, #0d1b2a 100%)`, color: '#fff' }}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.brandTag} style={{ background: `${COLOR}22`, color: COLOR }}>
              🏊 Ingeniería Acuática
            </span>
            <h1 className={styles.heroH1} style={{ color: '#fff' }}>
              Tus zonas húmedas, <span style={{ color: COLOR }}>perfectas</span> siempre.
            </h1>
            <p className={styles.heroP}>
              Somos especialistas en mantenimiento de piscinas, jacuzzis y turcos. Ofrecemos soluciones técnicas de alta calidad, repuestos originales y químicos certificados para aguas cristalinas todo el año.
            </p>
            <div className={styles.heroCta}>
              <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
                style={{ background: COLOR, color: '#fff' }}>
                📲 Agendar servicio ahora
              </a>
              <a href="#servicios" className={styles.ctaSecondary} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                Ver servicios
              </a>
            </div>
          </div>
          <div className={styles.heroImages}>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=75&w=900&auto=format&fit=crop" alt="Piscina cristalina mantenida por Ingenova" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 100vw, 50vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=75&w=500&auto=format&fit=crop" alt="Jacuzzi limpio" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=75&w=500&auto=format&fit=crop" alt="Turco premium" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsSection} style={{ background: COLOR, color: '#fff' }}>
        <div className={styles.statsGrid}>
          {[
            { num: '+800', label: 'Piscinas atendidas' },
            { num: '+200', label: 'Jacuzzis mantenidos' },
            { num: '100%', label: 'Garantía de calidad' },
            { num: '24h', label: 'Tiempo de respuesta' },
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
          <span className={styles.sectionLabel} style={{ color: COLOR }}>¿Qué hacemos?</span>
          <h2 className={styles.sectionTitle}>Nuestros servicios especializados</h2>
          <p className={styles.sectionSub}>Soluciones integrales para mantener sus espacios acuáticos en condiciones perfectas.</p>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { icon: '🔧', title: 'Mantenimiento Preventivo', desc: 'Visitas programadas para limpieza de filtros, revisión de bombas, ajuste de químicos y lectura de parámetros del agua.' },
            { icon: '⚡', title: 'Mantenimiento Correctivo', desc: 'Diagnóstico y reparación de bombas, calentadores, sistemas de filtración y equipos de automatización averiados.' },
            { icon: '🧪', title: 'Tratamiento Químico', desc: 'Suministro y aplicación de cloro, pH, algicidas y productos especializados para garantizar agua sanitariamente segura.' },
            { icon: '🚿', title: 'Mantenimiento de Jacuzzis', desc: 'Limpieza profunda de boquillas, revisión de turbinas, tratamiento de agua y desinfección de sistemas hidráulicos.' },
            { icon: '♨️', title: 'Turcos & Sauna', desc: 'Mantenimiento de generadores de vapor, limpieza de cabinas y revisión de sistemas de control de temperatura.' },
            { icon: '🛒', title: 'Venta de Repuestos', desc: 'Motobombas, filtros, válvulas, sensores y accesorios originales para todas las marcas del mercado.' },
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
          <h2 className={styles.sectionTitle}>Proceso simple y transparente</h2>
        </div>
        <div className={styles.processSteps}>
          {[
            { n: '01', title: 'Diagnóstico', desc: 'Evaluamos el estado actual de su piscina o jacuzzi sin costo adicional.' },
            { n: '02', title: 'Cotización', desc: 'Presentamos un presupuesto claro y detallado sin costos ocultos.' },
            { n: '03', title: 'Servicio', desc: 'Nuestros técnicos certificados ejecutan el servicio con equipos de última generación.' },
            { n: '04', title: 'Garantía', desc: 'Respaldamos cada intervención con garantía escrita de nuestro trabajo.' },
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
      <section className={styles.ctaFinal} style={{ background: `linear-gradient(135deg, #0d1b2a, #1a3a5c)`, color: '#fff' }}>
        <div className={styles.ctaFinalContent}>
          <span style={{ fontSize: '3rem' }}>💧</span>
          <h2 className={styles.ctaFinalTitle}>¿Su piscina necesita atención?</h2>
          <p className={styles.ctaFinalSub}>Contáctenos ahora y un técnico especializado estará en su propiedad en menos de 24 horas.</p>
          <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
            style={{ background: COLOR, color: '#fff', fontSize: '1.1rem' }}>
            📲 Hablar con un técnico ahora
          </a>
        </div>
      </section>
    </main>
  );
}
