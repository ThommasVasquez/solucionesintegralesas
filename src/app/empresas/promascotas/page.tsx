import type { Metadata } from 'next';
import Image from 'next/image';
import styles from '../empresa.module.css';

export const metadata: Metadata = {
  title: 'ProMascotas — Profilaxis Dental a Domicilio | Soluciones Integrales AS',
  description: 'Limpieza dental profesional para mascotas sin anestesia general. Servicio a domicilio en Bogotá y Sabana Norte. Elimina el sarro y el mal aliento de tu mejor amigo.',
};

const COLOR = '#e6a817';
const WA = 'https://wa.me/573001234567?text=Hola!%20Vengo%20de%20la%20web%20de%20ProMascotas%20y%20quiero%20agendar%20una%20profilaxis%20dental';

export default function ProMascotasPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className={styles.hero} style={{ background: 'linear-gradient(135deg, #1a1200 0%, #3d2b00 60%, #1a1200 100%)', color: '#fff' }}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.brandTag} style={{ background: `${COLOR}22`, color: COLOR }}>
              🐾 Salud Dental Pet
            </span>
            <h1 className={styles.heroH1} style={{ color: '#fff' }}>
              La sonrisa de tu mascota, <span style={{ color: COLOR }}>brillante y sana.</span>
            </h1>
            <p className={styles.heroP}>
              Realizamos profilaxis dental profesional sin anestesia general directamente en tu hogar. Eliminamos el sarro, prevenimos enfermedades y dejamos a tu mascota feliz, cómoda y con aliento fresco.
            </p>
            <div className={styles.heroCta}>
              <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
                style={{ background: COLOR, color: '#fff' }}>
                📲 Agendar profilaxis
              </a>
              <a href="#servicios" className={styles.ctaSecondary} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                ¿Cómo funciona?
              </a>
            </div>
          </div>
          <div className={styles.heroImages}>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=75&w=900&auto=format&fit=crop" alt="Mascota feliz con dientes limpios" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 100vw, 50vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=75&w=500&auto=format&fit=crop" alt="Perro saludable" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
            <div className={styles.heroImg}>
              <Image src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=75&w=500&auto=format&fit=crop" alt="Gato saludable" fill style={{ objectFit: 'cover' }} sizes="(max-width:900px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsSection} style={{ background: COLOR, color: '#fff' }}>
        <div className={styles.statsGrid}>
          {[
            { num: '+1k', label: 'Mascotas atendidas' },
            { num: '0', label: 'Anestesia general' },
            { num: '100%', label: 'Servicio a domicilio' },
            { num: '≤24h', label: 'Tiempo de respuesta' },
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
          <h2 className={styles.sectionTitle}>Cuidado dental integral para tu mascota</h2>
          <p className={styles.sectionSub}>Sin estrés, sin traslados y sin riesgos de anestesia. Todo en la comodidad de tu hogar.</p>
        </div>
        <div className={styles.servicesGrid}>
          {[
            { icon: '🦷', title: 'Profilaxis Dental', desc: 'Remoción profesional de sarro y placa bacteriana con ultrasonido de alta frecuencia, totalmente seguro y sin dolor.' },
            { icon: '🔍', title: 'Evaluación Bucal', desc: 'Revisión completa de encías, dientes y mucosa oral para detectar problemas a tiempo y prevenir enfermedades sistémicas.' },
            { icon: '✨', title: 'Pulido Dental', desc: 'Pulido coronario post-profilaxis para alisar la superficie del diente y retardar la acumulación de nuevos depósitos.' },
            { icon: '💧', title: 'Irrigación Subgingival', desc: 'Limpieza bajo la línea de encía para eliminar bacterias profundas que causan periodontitis y halitosis crónica.' },
            { icon: '💊', title: 'Aplicación de Flúor', desc: 'Tratamiento fluorado para fortalecer el esmalte dental y proteger contra la caries en las mascotas más vulnerables.' },
            { icon: '📋', title: 'Plan de Salud Oral', desc: 'Diseñamos un protocolo personalizado de mantenimiento dental para tu mascota con frecuencias y productos recomendados.' },
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
          <span className={styles.sectionLabel} style={{ color: COLOR }}>¿Cómo funciona?</span>
          <h2 className={styles.sectionTitle}>Proceso seguro y sin estrés</h2>
        </div>
        <div className={styles.processSteps}>
          {[
            { n: '01', title: 'Reserva tu cita', desc: 'Escríbenos por WhatsApp y agendamos una visita en el horario que más te convenga.' },
            { n: '02', title: 'Llegamos a tu hogar', desc: 'Nuestro veterinario llega puntual con todo el equipo necesario para el procedimiento.' },
            { n: '03', title: 'Evaluación previa', desc: 'Revisamos el estado dental de tu mascota y te explicamos el procedimiento antes de iniciar.' },
            { n: '04', title: 'Profilaxis completa', desc: 'Realizamos la limpieza y te entregamos recomendaciones para mantener la salud oral en casa.' },
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
      <section className={styles.ctaFinal} style={{ background: 'linear-gradient(135deg, #1a1200, #3d2b00)', color: '#fff' }}>
        <div className={styles.ctaFinalContent}>
          <span style={{ fontSize: '3rem' }}>🐶</span>
          <h2 className={styles.ctaFinalTitle}>¿Cuándo fue la última limpieza dental de tu mascota?</h2>
          <p className={styles.ctaFinalSub}>El sarro causa dolor, pérdida de dientes y enfermedades del corazón. Agenda hoy y protege a tu mejor amigo.</p>
          <a href={WA} target="_blank" rel="noreferrer" className={styles.ctaPrimary}
            style={{ background: COLOR, color: '#fff', fontSize: '1.1rem' }}>
            📲 Agendar profilaxis ahora
          </a>
        </div>
      </section>
    </main>
  );
}
