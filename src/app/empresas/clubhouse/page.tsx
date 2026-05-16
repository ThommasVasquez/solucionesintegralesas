import type { Metadata } from 'next';
import Image from 'next/image';
import styles from '../empresa.module.css';

export const metadata: Metadata = {
  title: 'ClubHouse — Administración de Complejos Acuáticos & Escuela de Natación',
  description: 'Gestión profesional de piscinas y complejos acuáticos. Escuela de natación para todas las edades con instructores federados. Cobertura en Bogotá y Sabana Norte.',
};

const COLOR = '#82b440';
const WA = 'https://wa.me/573001234567?text=Hola!%20Vengo%20de%20la%20web%20de%20ClubHouse%20y%20quiero%20información';

export default function ClubHousePage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className={styles.hero} style={{ background: 'linear-gradient(135deg, #0f2010 0%, #1a4020 60%, #0f2010 100%)', color: '#fff' }}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.brandTag} style={{ background: `${COLOR}22`, color: COLOR }}>
              🏊‍♂️ Gestión & Capacitación
            </span>
            <h1 className={styles.heroH1} style={{ color: '#fff' }}>
              Su complejo acuático, <span style={{ color: COLOR }}>en manos expertas.</span>
            </h1>
            <p className={styles.heroP}>
              Administramos complejos acuáticos, clubes y conjuntos residenciales. Además, formamos nadadores de todas las edades con instructores certificados por la Federación Colombiana de Natación.
            </p>
            <div className={styles.heroCta}>
              <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
                style={{ background: COLOR, color: '#fff' }}>
                📲 Solicitar información
              </a>
              <a href="#servicios" className={styles.ctaSecondary} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                Ver programas
              </a>
            </div>
          </div>
          <div className={styles.heroImages}>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=75&w=900&auto=format&fit=crop" alt="Piscina profesional administrada por ClubHouse" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 100vw, 50vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1530549387634-e7a5bc2a6132?q=75&w=500&auto=format&fit=crop" alt="Natación profesional" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=75&w=500&auto=format&fit=crop" alt="Clases de natación" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsSection} style={{ background: COLOR, color: '#fff' }}>
        <div className={styles.statsGrid}>
          {[
            { num: '+15', label: 'Complejos administrados' },
            { num: '+500', label: 'Nadadores formados' },
            { num: '100%', label: 'Instructores federados' },
            { num: '10+', label: 'Años de experiencia' },
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
          <span className={styles.sectionLabel} style={{ color: COLOR }}>Nuestros programas</span>
          <h2 className={styles.sectionTitle}>Gestión integral del agua</h2>
          <p className={styles.sectionSub}>Desde la operación diaria hasta la formación deportiva, cubrimos todo el ecosistema acuático.</p>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { icon: '🏢', title: 'Administración de Complejos', desc: 'Gestión operativa completa: personal, mantenimiento, presupuesto y cumplimiento normativo de su instalación acuática.' },
            { icon: '👶', title: 'Natación Infantil', desc: 'Programa de adaptación al agua y técnica desde los 3 años. Grupos reducidos para atención personalizada.' },
            { icon: '🏅', title: 'Natación Competitiva', desc: 'Entrenamiento de alto rendimiento para deportistas con miras a competencias regionales y nacionales.' },
            { icon: '👨‍👩‍👧', title: 'Natación para Adultos', desc: 'Clases para principiantes y perfeccionamiento de técnica. Horarios flexibles adaptados a su agenda.' },
            { icon: '🧓', title: 'Hidroaeróbicos', desc: 'Ejercicio acuático de bajo impacto, ideal para adultos mayores y personas en rehabilitación.' },
            { icon: '📋', title: 'Consultoría Acuática', desc: 'Asesoría para nuevos proyectos de piscinas: diseño, normativas, equipos y protocolos de operación.' },
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
          <span className={styles.sectionLabel} style={{ color: COLOR }}>¿Cómo empezamos?</span>
          <h2 className={styles.sectionTitle}>Un proceso simple y claro</h2>
        </div>
        <div className={styles.processSteps}>
          {[
            { n: '01', title: 'Evaluación', desc: 'Visitamos su complejo o evaluamos su perfil deportivo sin costo.' },
            { n: '02', title: 'Propuesta', desc: 'Diseñamos un plan a medida con objetivos claros y un costo transparente.' },
            { n: '03', title: 'Ejecución', desc: 'Nuestro equipo certificado toma el control de la operación o inicia el entrenamiento.' },
            { n: '04', title: 'Seguimiento', desc: 'Reportes periódicos de avance y reuniones de gestión con los responsables.' },
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
      <section className={styles.ctaFinal} style={{ background: 'linear-gradient(135deg, #0f2010, #1a4020)', color: '#fff' }}>
        <div className={styles.ctaFinalContent}>
          <span style={{ fontSize: '3rem' }}>🏆</span>
          <h2 className={styles.ctaFinalTitle}>¿Listo para dar el salto?</h2>
          <p className={styles.ctaFinalSub}>Hablemos sobre cómo ClubHouse puede transformar su complejo o iniciar su formación en natación.</p>
          <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
            style={{ background: COLOR, color: '#fff', fontSize: '1.1rem' }}>
            📲 Contactar a ClubHouse
          </a>
        </div>
      </section>
    </main>
  );
}
