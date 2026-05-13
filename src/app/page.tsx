'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

// CENTRALIZACIÓN DE COLORES DE MARCA
export const BRAND_COLORS = {
  SOLUCIONES: '#1a5d91', // Azules - Corporativo
  INGENOVA: '#f39c12',   // Naranja - Jacuzzis y Piscinas
  PROMASCOTAS: '#f1c40f', // Amarillo - Mascotas
  CLUBHOUSE: '#82b440',   // Verde - Natación
};

const businessLines = [
  { 
    label: 'Ingenova', 
    title: 'Jacuzzis, Piscinas & Turcos',
    tag: 'Mantenimiento & Repuestos',
    color: BRAND_COLORS.INGENOVA,
    desc: 'Servicio técnico especializado y venta de repuestos para sistemas de hidromasaje, piscinas y baños turcos.',
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571155823795-467926b68e7d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=800&auto=format&fit=crop'
    ]
  },
  { 
    label: 'ClubHouse', 
    title: 'Administración & Nado',
    tag: 'Gestión & Capacitación',
    color: BRAND_COLORS.CLUBHOUSE,
    desc: 'Administración profesional de complejos acuáticos y programas certificados de capacitación en natación.',
    images: [
      'https://images.unsplash.com/photo-1530549387634-e7a5bc2a6132?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560090995-01632a28895b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=800&auto=format&fit=crop'
    ]
  },
  { 
    label: 'ProMascotas', 
    title: 'Profilaxis a Domicilio',
    tag: 'Cuidado Dental Pet',
    color: BRAND_COLORS.PROMASCOTAS,
    desc: 'Salud oral experta para tus mascotas sin salir de casa. Limpieza dental profunda con trato profesional.',
    images: [
      'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop'
    ]
  },
  { 
    label: 'Soluciones AS', 
    title: 'Servicios Integrales',
    tag: 'Respaldo Corporativo',
    color: BRAND_COLORS.SOLUCIONES,
    desc: 'La infraestructura técnica y profesional que respalda cada una de nuestras líneas de negocio especializadas.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop'
    ]
  },
];

const words = [
  { text: 'piscinas', color: BRAND_COLORS.INGENOVA },
  { text: 'capacitación', color: BRAND_COLORS.CLUBHOUSE },
  { text: 'mascotas', color: BRAND_COLORS.PROMASCOTAS },
  { text: 'bienestar', color: BRAND_COLORS.SOLUCIONES }
];

export default function Home() {
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const ctaGroupRef  = useRef<HTMLDivElement>(null);
  const cardsRef     = useRef<HTMLDivElement[]>([]);
  const textsRef     = useRef<HTMLDivElement[]>([]);
  const heroRef      = useRef<HTMLElement>(null);
  const bgVideoRef   = useRef<HTMLDivElement>(null);
  const [wordIdx, setWordIdx] = useState(0);

  // Estados para el carrusel dinámico de fotos en foco
  const [activeCardIdx, setActiveCardIdx] = useState<number | null>(null);
  const activeCardIdxRef = useRef<number | null>(null);
  const [imageCycleIdx, setImageCycleIdx] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true 
    });
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setWordIdx(p => (p + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, []);

  // Timer para ciclar imágenes cada 3 segundos SOLO en la tarjeta activa
  useEffect(() => {
    if (activeCardIdx === null) {
      setImageCycleIdx(0);
      return;
    }
    const id = setInterval(() => {
      setImageCycleIdx(prev => prev + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [activeCardIdx]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      const texts = textsRef.current;
      if (!cards.length || !texts.length) return;

      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
      }, (context) => {
        const { isDesktop } = context.conditions as any;

        const fanStates = isDesktop 
          ? [ { x: -180, y: 185, rotation: -17 }, { x: -60,  y: 145, rotation: -5 }, { x: 60,   y: 145, rotation: 5 }, { x: 180,  y: 185, rotation: 17 } ]
          : [ { x: -90, y: 120, rotation: -12 }, { x: -30,  y: 90, rotation: -4 }, { x: 30,   y: 90, rotation: 4 }, { x: 90,  y: 120, rotation: 12 } ];

        gsap.set(cards, { opacity: 0, y: 350, scale: isDesktop ? 0.8 : 0.6, x: 0, rotation: 0 });
        gsap.set(texts, { opacity: 0, y: 30, pointerEvents: 'none' });

        const introTL = gsap.timeline({ delay: 0.2 });
        introTL
          .fromTo([headlineRef.current, ctaGroupRef.current], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 })
          .to(cards, {
            opacity: 1, scale: isDesktop ? 1 : 0.8,
            x: (i) => fanStates[i].x, y: (i) => fanStates[i].y, rotation: (i) => fanStates[i].rotation,
            duration: 1.2, stagger: 0.05, ease: 'elastic.out(1, 0.75)',
          }, '-=0.6');

        const masterTL = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=600%',
            pin: true, scrub: 0.5, invalidateOnRefresh: true,
          },
        });

        // Seguimiento del scroll para activar la tarjeta correspondiente
        masterTL.eventCallback("onUpdate", function() {
          const t = this.time();
          let nextIdx = null;
          // Los tiempos coinciden con el inicio del enfoque de cada tarjeta (startTime + 0.5)
          if (t >= 12.0) nextIdx = 3;
          else if (t >= 9.0) nextIdx = 2;
          else if (t >= 6.0) nextIdx = 1;
          else if (t >= 3.0) nextIdx = 0;
          
          if (activeCardIdxRef.current !== nextIdx) {
            activeCardIdxRef.current = nextIdx;
            setActiveCardIdx(nextIdx);
          }
        });

        masterTL.fromTo([headlineRef.current, ctaGroupRef.current], 
          { opacity: 1, y: 0 },
          { opacity: 0, y: -80, duration: 1 }, 0);
          
        masterTL.fromTo(bgVideoRef.current, 
          { opacity: 1 }, 
          { opacity: 0, duration: 1 }, 0);

        masterTL.fromTo(texts[0], 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, pointerEvents: 'auto' }, 0.5); 
        
        const gridPos = isDesktop
          ? [{ x: -120, y: -150 }, { x: 120, y: -150 }, { x: -120, y: 150 }, { x: 120, y: 150 }]
          : [{ x: -70, y: -100 }, { x: 70, y: -100 }, { x: -70, y: 100 }, { x: 70, y: 100 }];

        cards.forEach((card, i) => {
          masterTL.fromTo(card, 
            { x: fanStates[i].x, y: fanStates[i].y, rotation: fanStates[i].rotation, scale: isDesktop ? 1 : 0.8, opacity: 1 },
            { x: gridPos[i].x, y: gridPos[i].y, rotation: 0, scale: isDesktop ? 0.8 : 0.55, opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 0);
        });

        const focusX = isDesktop ? 260 : 0;
        const focusY = isDesktop ? 0 : -140;
        const textYOffset = isDesktop ? 0 : 120;

        businessLines.forEach((_, i) => {
          const startTime = 2.5 + i * 3;
          masterTL.to(texts[i], { opacity: 0, y: -30, duration: 0.8, pointerEvents: 'none' }, startTime);
          
          if (i > 0) {
            masterTL.to(cards[i-1], { x: isDesktop ? '100vw' : 0, y: isDesktop ? 0 : '100vh', opacity: 0, duration: 1 }, startTime);
          } else {
            [1, 2, 3].forEach(idx => masterTL.to(cards[idx], { opacity: 0, duration: 0.5 }, startTime));
          }

          masterTL.fromTo(texts[i+1], 
            { opacity: 0, y: textYOffset + 30 },
            { opacity: 1, y: textYOffset, duration: 1, pointerEvents: 'auto' }, startTime + 0.5);
            
          // Ampliación exclusiva de la tarjeta en foco
          masterTL.to(cards[i], { 
            x: focusX, y: focusY, scale: isDesktop ? 1.4 : 1.15, opacity: 1, duration: 1.2, ease: 'power3.out' 
          }, startTime + 0.5);
        });

        masterTL.to(texts[4], { opacity: 0, y: -30, duration: 1 }, '+=1');
        masterTL.to(cards[3], { x: isDesktop ? '100vw' : 0, y: isDesktop ? 0 : '100vh', opacity: 0, duration: 1 }, '-=1');
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <Navbar />
      <div className={styles.fixedLayer} aria-hidden="true">
        <div className={styles.fixedCards}>
          {businessLines.map((line, i) => {
            const isFocused = activeCardIdx === i;
            return (
              <div key={`card-${i}`} ref={el => { if (el) cardsRef.current[i] = el; }} className={styles.card}>
                {line.images.map((imgSrc, imgIdx) => (
                  <Image 
                    key={imgIdx}
                    src={imgSrc} 
                    alt={`${line.label} - Imagen ${imgIdx + 1}`} 
                    fill 
                    className={styles.cardImg}
                    style={{ 
                      opacity: (isFocused ? (imageCycleIdx % line.images.length === imgIdx) : imgIdx === 0) ? 1 : 0,
                      transition: 'opacity 1s ease',
                      objectFit: 'cover'
                    }}
                    sizes="(max-width: 768px) 180px, 350px"
                    priority={i === 0 && imgIdx === 0}
                  />
                ))}
                <div className={styles.cardOverlay} />
                <div className={styles.cardInfo}>
                  <span style={{ color: line.color }}>{line.label}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.fixedTexts}>
          <div ref={el => { if (el) textsRef.current[0] = el; }} className={styles.textBlock}>
            <span className={styles.stepTag} style={{ color: BRAND_COLORS.SOLUCIONES }}>Expertos certificados</span>
            <h2>Soluciones Integrales AS</h2>
            <p>Infraestructura técnica y profesional de vanguardia para todas nuestras marcas especializadas.</p>
          </div>
          {businessLines.map((line, i) => (
            <div key={`text-${i}`} ref={el => { if (el) textsRef.current[i+1] = el; }} className={styles.textBlock}>
              <span className={styles.stepTag} style={{ color: line.color }}>{line.tag}</span>
              <h2 style={{ borderColor: line.color }}>{line.title}</h2>
              <p>{line.desc}</p>
              <div className={styles.stepCta}>
                <button className="btn-primary" style={{ backgroundColor: line.color, borderColor: line.color }}>
                  Agendar con {line.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section ref={heroRef} className={styles.hero}>
        <div ref={bgVideoRef} className={styles.videoWrapper}>
          <video autoPlay muted loop playsInline className={styles.videoBackground}>
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className={styles.videoOverlay} />
        </div>
        <div className={styles.heroContent}>
          <h1 ref={headlineRef} className={styles.heroH1}>
            Expertos en<br />
            <span className={styles.accent} style={{ color: words[wordIdx].color }}>
              {words[wordIdx].text}
            </span>.
          </h1>
          <div ref={ctaGroupRef} className={styles.ctaGroup}>
            <button className="btn-primary" style={{ backgroundColor: BRAND_COLORS.SOLUCIONES, borderColor: BRAND_COLORS.SOLUCIONES }}>
              Nuestros servicios
            </button>
            <button className="btn-outline">Conócenos</button>
          </div>
        </div>
      </section>

      <section className={styles.ctaFinal}>
        <div className={styles.ctaFinalInner}>
          <h3 className={styles.ctaTitle}>¿Listo para empezar?</h3>
          <p className={styles.ctaSub}>Atención inmediata · Respaldo de Soluciones Integrales AS.</p>
          <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer" className="btn-primary" style={{ backgroundColor: BRAND_COLORS.SOLUCIONES, borderColor: BRAND_COLORS.SOLUCIONES }}>
            Hablar con un asesor →
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
