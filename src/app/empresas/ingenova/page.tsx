import type { Metadata } from 'next';
import Image from 'next/image';
import s from './ingenova.module.css';

export const metadata: Metadata = {
  title: 'Ingenova — Mantenimiento Premium de Piscinas, Jacuzzis & Turcos | Bogotá',
  description: 'Empresa líder en mantenimiento especializado de zonas húmedas en Colombia. Piscinas, jacuzzis y turcos con técnicos certificados, repuestos originales y garantía escrita.',
  keywords: 'mantenimiento piscinas bogota, jacuzzi bogota, turco mantenimiento, quimicos piscina, motobomba piscina',
  openGraph: {
    title: 'Ingenova — Soluciones Integrales AS',
    description: 'Expertos en piscinas, jacuzzis y turcos en Bogotá',
    type: 'website',
  },
};

const WA = 'https://wa.me/573001234567?text=Hola!%20Vengo%20de%20ingenova.com.co%20y%20quiero%20agendar%20un%20servicio';

const SERVICES = [
  {
    icon: '🔧',
    title: 'Mantenimiento Preventivo',
    desc: 'Visitas programadas con limpieza de filtros, revisión de bombas, ajuste de químicos y análisis del agua. Su piscina, siempre en condiciones óptimas.',
  },
  {
    icon: '⚡',
    title: 'Mantenimiento Correctivo',
    desc: 'Diagnóstico preciso y reparación de bombas, calentadores, sistemas de filtración y automatización. Soluciones definitivas, no parches.',
  },
  {
    icon: '🧪',
    title: 'Tratamiento Químico',
    desc: 'Suministro y aplicación profesional de cloro, pH reguladores, algicidas y floculantes certificados para agua cristalina y sanitariamente segura.',
  },
  {
    icon: '🛁',
    title: 'Jacuzzis Residenciales',
    desc: 'Limpieza profunda de boquillas, revisión de turbinas, desinfección de sistemas hidráulicos y tratamiento de agua para su spa privado.',
  },
  {
    icon: '♨️',
    title: 'Turcos & Sauna',
    desc: 'Mantenimiento de generadores de vapor, limpieza de cabinas y revisión de sistemas de control de temperatura para experiencias de bienestar perfectas.',
  },
  {
    icon: '🛒',
    title: 'Repuestos & Químicos',
    desc: 'Distribución de motobombas, filtros, válvulas, sensores y productos químicos originales para todas las marcas del mercado colombiano.',
  },
];

const WHY_POINTS = [
  {
    icon: '🏅',
    title: 'Técnicos Certificados',
    desc: 'Todo nuestro personal cuenta con certificaciones técnicas vigentes y formación especializada en sistemas acuáticos.',
  },
  {
    icon: '📋',
    title: 'Garantía Escrita en Cada Servicio',
    desc: 'No hacemos promesas verbales. Cada intervención viene respaldada por una garantía formal y documentada.',
  },
  {
    icon: '⏱️',
    title: 'Respuesta en Menos de 24 Horas',
    desc: 'Sabemos que el tiempo es crítico. Nuestro equipo de coordinación garantiza atención ágil en todo momento.',
  },
  {
    icon: '🔍',
    title: 'Diagnóstico Transparente',
    desc: 'Le explicamos exactamente qué tiene y por qué, antes de iniciar cualquier trabajo. Sin sorpresas en la factura.',
  },
];

const PROCESS = [
  {
    n: '01',
    title: 'Diagnóstico Gratuito',
    desc: 'Evaluamos el estado de su instalación sin costo. Identificamos problemas y oportunidades de mejora.',
  },
  {
    n: '02',
    title: 'Propuesta Detallada',
    desc: 'Presentamos un presupuesto claro con alcance exacto, materiales y tiempo estimado de ejecución.',
  },
  {
    n: '03',
    title: 'Ejecución Técnica',
    desc: 'Técnicos certificados realizan el servicio con equipos profesionales y repuestos originales.',
  },
  {
    n: '04',
    title: 'Entrega & Garantía',
    desc: 'Verificamos los resultados junto a usted y entregamos garantía escrita de la intervención realizada.',
  },
];

export default function IngenovaPage() {
  return (
    <div className={s.page}>

      {/* ══════════ HERO ══════════ */}
      <section className={s.hero}>
        {/* Background image */}
        <div className={s.heroBg}>
          <Image
            src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1800&auto=format&fit=crop"
            alt="Piscina premium mantenida por Ingenova"
            fill
            className={s.heroBgImg}
            priority
            sizes="100vw"
          />
        </div>
        <div className={s.heroGradientTop} />
        <div className={s.heroGradientBottom} />
        <div className={s.heroGlow} />

        <div className={s.heroContent}>
          <div className={s.heroLeft}>
            {/* Logo */}
            <Image
              src="/ingenova-logo.png"
              alt="Ingenova — Soluciones Integrales AS"
              width={200}
              height={80}
              className={s.heroLogo}
              priority
            />

            {/* Badge */}
            <div className={s.heroBadge}>
              <span className={s.heroBadgeDot} />
              Bogotá & Sabana Norte · Desde 2014
            </div>

            {/* Heading */}
            <h1 className={s.heroH1}>
              Zonas húmedas de
              <span className={s.heroH1Gold}>lujo, siempre perfectas.</span>
            </h1>

            <p className={s.heroP}>
              Somos el equipo técnico de mayor confianza en Bogotá para el mantenimiento de piscinas, jacuzzis y turcos. Más de 10 años, más de 2.000 clientes, un solo estándar: la excelencia.
            </p>

            <div className={s.heroCta}>
              <a href={WA} target="_blank" rel="noreferrer" className={s.btnGold}>
                📲 Agendar servicio
              </a>
              <a href="#servicios" className={s.btnOutline}>
                Ver servicios ↓
              </a>
            </div>

            {/* Trust numbers */}
            <div className={s.heroTrust}>
              <div className={s.trustItem}>
                <span className={s.trustNum}>+2k</span>
                <span className={s.trustLabel}>Clientes atendidos</span>
              </div>
              <div className={s.trustItem}>
                <span className={s.trustNum}>10+</span>
                <span className={s.trustLabel}>Años de trayectoria</span>
              </div>
              <div className={s.trustItem}>
                <span className={s.trustNum}>100%</span>
                <span className={s.trustLabel}>Garantía escrita</span>
              </div>
            </div>
          </div>

          {/* Right — gallery cards */}
          <div className={s.heroRight}>
            <div className={s.heroCardMain}>
              <Image
                src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=75&w=900&auto=format&fit=crop"
                alt="Piscina con agua cristalina"
                fill
                style={{ objectFit: 'cover' }}
                sizes="50vw"
              />
            </div>
            <div className={s.heroCardRow}>
              <div className={s.heroCardSmall}>
                <Image
                  src="https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=75&w=500&auto=format&fit=crop"
                  alt="Jacuzzi premium"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="25vw"
                />
              </div>
              <div className={s.heroCardSmall}>
                <Image
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=75&w=500&auto=format&fit=crop"
                  alt="Turco de lujo"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section className={s.statsBar}>
        <div className={s.statsGrid}>
          {[
            { num: '+800', label: 'Piscinas atendidas' },
            { num: '+300', label: 'Jacuzzis & turcos' },
            { num: '24h', label: 'Tiempo de respuesta' },
            { num: '100%', label: 'Garantía en servicios' },
          ].map((stat) => (
            <div key={stat.label} className={s.statItem}>
              <span className={s.statNum}>{stat.num}</span>
              <span className={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section id="servicios" className={s.services}>
        <div className={s.sectionHeader}>
          <span className={s.sectionEyebrow}>Nuestros servicios</span>
          <h2 className={s.sectionTitle}>Soluciones técnicas<br />para cada necesidad</h2>
          <p className={s.sectionSub}>
            Del mantenimiento preventivo a la reparación de emergencia, cubrimos cada aspecto de sus zonas húmedas con precisión profesional.
          </p>
        </div>
        <div className={s.servicesGrid}>
          {SERVICES.map((svc) => (
            <div key={svc.title} className={s.serviceCard}>
              <div className={s.serviceIconWrap}>{svc.icon}</div>
              <h3>{svc.title}</h3>
              <p>{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ WHY US ══════════ */}
      <section className={s.whyUs}>
        <div className={s.whyUsGrid}>
          <div className={s.whyUsImage}>
            <Image
              src="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=75&w=900&auto=format&fit=crop"
              alt="Técnico Ingenova trabajando"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className={s.whyUsText}>
            <span className={s.sectionEyebrow}>¿Por qué elegirnos?</span>
            <h2 className={s.sectionTitle}>El estándar técnico<br />que su propiedad merece</h2>
            <p className={s.sectionSub} style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
              No somos una empresa de mantenimiento genérico. Somos especialistas en zonas húmedas con el respaldo corporativo de Soluciones Integrales AS SAS.
            </p>
            <div className={s.whyUsPoints}>
              {WHY_POINTS.map((pt) => (
                <div key={pt.title} className={s.whyPoint}>
                  <div className={s.whyPointIcon}>{pt.icon}</div>
                  <div className={s.whyPointBody}>
                    <h4>{pt.title}</h4>
                    <p>{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PROCESS ══════════ */}
      <section className={s.process}>
        <div className={s.sectionHeader}>
          <span className={s.sectionEyebrow}>Nuestro proceso</span>
          <h2 className={s.sectionTitle}>Simple, transparente<br />y sin sorpresas</h2>
        </div>
        <div className={s.processSteps}>
          {PROCESS.map((step) => (
            <div key={step.n} className={s.processStep}>
              <div className={s.stepCircle}>{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className={s.ctaSection}>
        <div className={s.ctaBg} />
        <div className={s.ctaContent}>
          <div className={s.ctaDivider} />
          <h2 className={s.ctaTitle}>
            ¿Su piscina necesita<br />
            <span>atención experta?</span>
          </h2>
          <p className={s.ctaSub}>
            Un técnico certificado de Ingenova estará en su propiedad en menos de 24 horas. Sin compromisos, sin costos ocultos.
          </p>
          <a href={WA} target="_blank" rel="noreferrer" className={s.btnGold} style={{ fontSize: '1rem', padding: '1.2rem 3rem' }}>
            📲 Hablar con un técnico ahora
          </a>
          <div className={s.ctaDivider} />
        </div>
      </section>

    </div>
  );
}
