import type { Metadata } from 'next';
import Image from 'next/image';
import styles from '../empresa.module.css';

export const metadata: Metadata = {
  title: 'Soluciones Integrales AS SAS — Respaldo Corporativo Técnico en Colombia',
  description: 'La empresa matriz detrás de Ingenova, Viva Calentadores y ProMascotas. Soluciones técnicas integrales con respaldo corporativo, garantía y profesionalismo en Bogotá.',
};

const COLOR = '#1a5d91';
const COLOR_LIGHT = '#2e86c1';
const WA = 'https://wa.me/573001234567?text=Hola!%20Vengo%20de%20la%20web%20de%20Soluciones%20Integrales%20AS%20y%20quiero%20información';

export default function SolucionesASPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className={styles.hero} style={{ background: 'linear-gradient(135deg, #050e18 0%, #0a1f33 60%, #050e18 100%)', color: '#fff' }}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.brandTag} style={{ background: `${COLOR}33`, color: '#5dade2' }}>
              🏛️ Respaldo Corporativo
            </span>
            <h1 className={styles.heroH1} style={{ color: '#fff' }}>
              Soluciones técnicas con <span style={{ color: '#5dade2' }}>respaldo corporativo.</span>
            </h1>
            <p className={styles.heroP}>
              Somos la empresa matriz que centraliza la excelencia operativa de Ingenova, Viva Calentadores y ProMascotas. Más de 10 años garantizando profesionalismo, confianza y calidad en cada intervención técnica en Colombia.
            </p>
            <div className={styles.heroCta}>
              <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
                style={{ background: COLOR, color: '#fff' }}>
                📲 Hablar con un asesor
              </a>
              <a href="#empresas" className={styles.ctaSecondary} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                Nuestras empresas
              </a>
            </div>
          </div>
          <div className={styles.heroImages}>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=75&w=900&auto=format&fit=crop" alt="Oficinas corporativas Soluciones AS" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 100vw, 50vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=75&w=500&auto=format&fit=crop" alt="Equipo técnico especializado" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=75&w=500&auto=format&fit=crop" alt="Trabajo en equipo" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsSection} style={{ background: COLOR, color: '#fff' }}>
        <div className={styles.statsGrid}>
          {[
            { num: '+2k', label: 'Clientes satisfechos' },
            { num: '3', label: 'Líneas de negocio' },
            { num: '10+', label: 'Años en el mercado' },
            { num: '100%', label: 'Garantía en servicios' },
          ].map((s) => (
            <div key={s.label} className={styles.statBox}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── NUESTRAS EMPRESAS ── */}
      <section id="empresas" className={styles.services}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} style={{ color: COLOR }}>Ecosistema de servicios</span>
          <h2 className={styles.sectionTitle}>Nuestras líneas de negocio</h2>
          <p className={styles.sectionSub}>Un grupo empresarial diseñado para cubrir las necesidades técnicas de hogares, empresas y comunidades.</p>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { icon: '🏊', title: 'Ingenova', color: '#cca043', href: '/empresas/ingenova', desc: 'Mantenimiento especializado de piscinas, jacuzzis y turcos. Repuestos originales y químicos certificados para aguas perfectas todo el año.' },
            { icon: '🔥', title: 'Viva Calentadores', color: '#e35422', href: '/empresas/viva-calentadores', desc: 'Servicios de instalación, mantenimiento y reparación de calentadores de agua a gas y eléctricos con técnicos expertos.' },
            { icon: '🐾', title: 'ProMascotas', color: '#e6a817', href: '/empresas/promascotas', desc: 'Profilaxis dental a domicilio para mascotas sin anestesia general. Servicio profesional con la comodidad que tu mascota merece.' },
          ].map((s) => (
            <a key={s.title} href={s.href} className={styles.serviceCard} style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className={styles.serviceIcon} style={{ background: `${s.color}20`, fontSize: '2rem' }}>{s.icon}</div>
              <h3 style={{ color: s.color }}>{s.title}</h3>
              <p>{s.desc}</p>
              <span style={{ color: s.color, fontWeight: 700, fontSize: '0.9rem', marginTop: '0.5rem' }}>Conocer más →</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── VALORES ── */}
      <section className={styles.services} style={{ background: '#f8f9fa' }}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} style={{ color: COLOR }}>¿Por qué elegirnos?</span>
          <h2 className={styles.sectionTitle}>Nuestros valores corporativos</h2>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { icon: '🛡️', title: 'Garantía escrita', desc: 'Cada servicio que realizamos viene respaldado por una garantía formal por escrito. Su tranquilidad es nuestra prioridad.' },
            { icon: '⏱️', title: 'Puntualidad garantizada', desc: 'Respetamos su tiempo. Llegamos en el horario acordado o le avisamos con suficiente anticipación.' },
            { icon: '🎓', title: 'Personal certificado', desc: 'Todos nuestros técnicos cuentan con certificaciones vigentes en sus áreas de especialización.' },
            { icon: '💬', title: 'Transparencia total', desc: 'Presupuestos claros, sin costos ocultos. Le explicamos cada paso antes y después de realizarlo.' },
            { icon: '🔄', title: 'Servicio continuo', desc: 'Ofrecemos contratos de mantenimiento periódico para garantizar el óptimo estado de sus instalaciones.' },
            { icon: '📍', title: 'Cobertura local', desc: 'Operamos en Bogotá y Sabana Norte con tiempos de respuesta óptimos para toda nuestra área de cobertura.' },
          ].map((s) => (
            <div key={s.title} className={styles.serviceCard}>
              <div className={styles.serviceIcon} style={{ background: `${COLOR}15` }}>{s.icon}</div>
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
          <h2 className={styles.sectionTitle}>Proceso corporativo de excelencia</h2>
        </div>
        <div className={styles.processSteps}>
          {[
            { n: '01', title: 'Contacto inicial', desc: 'Nos comunica su necesidad por WhatsApp, teléfono o correo electrónico.' },
            { n: '02', title: 'Diagnóstico', desc: 'Evaluamos su requerimiento y asignamos el equipo especializado más adecuado.' },
            { n: '03', title: 'Propuesta formal', desc: 'Recibe una propuesta detallada con alcance, cronograma y costo total sin sorpresas.' },
            { n: '04', title: 'Ejecución & garantía', desc: 'Ejecutamos con los más altos estándares y entregamos garantía formal por escrito.' },
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
      <section className={styles.ctaFinal} style={{ background: 'linear-gradient(135deg, #050e18, #0a1f33)', color: '#fff' }}>
        <div className={styles.ctaFinalContent}>
          <span style={{ fontSize: '3rem' }}>🤝</span>
          <h2 className={styles.ctaFinalTitle}>¿Tiene un requerimiento corporativo?</h2>
          <p className={styles.ctaFinalSub}>Estamos listos para brindarle atención personalizada con el respaldo de más de una década de experiencia técnica en Colombia.</p>
          <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
            style={{ background: COLOR, color: '#fff', fontSize: '1.1rem' }}>
            📲 Hablar con un asesor ahora
          </a>
        </div>
      </section>
    </main>
  );
}
