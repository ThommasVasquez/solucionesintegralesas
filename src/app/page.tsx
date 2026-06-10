'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';
import Footer from '@/components/Footer';
import { Link } from 'next-view-transitions';

gsap.registerPlugin(ScrollTrigger);

export const BRAND_COLORS = {
  SOLUCIONES: '#1a5d91',
  INGENOVA: '#cca043',
  PROMASCOTAS: '#f1c40f',
  VIVA_CALENTADORES: '#e35422',
  PRINTERSERVICE: '#0ea5e9',
};

const businessLines = [
  { 
    label: 'Ingenova', 
    title: 'Construcción Civil & Piscinas',
    tag: 'Obra Civil & Acabados',
    color: BRAND_COLORS.INGENOVA,
    desc: 'Diseño y ejecución de obras de construcción civil, remodelación residencial y comercial, adecuación de espacios, impermeabilización de fachadas y cubiertas, y acabados de lujo para piscinas.',
    href: '/empresas/ingenova',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=70&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=70&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=70&w=800&auto=format&fit=crop'
    ]
  },
  { 
    label: 'Viva Calentadores', 
    title: 'Calentadores de Agua',
    tag: 'Mantenimiento & Instalación',
    color: BRAND_COLORS.VIVA_CALENTADORES,
    desc: 'Especialistas en agua caliente y bienestar para su hogar. Ofrecemos mantenimiento preventivo y correctivo, reparación e instalación de calentadores a gas y eléctricos de todas las marcas con técnicos certificados.',
    href: '/empresas/viva-calentadores',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=70&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=70&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=70&w=800&auto=format&fit=crop'
    ]
  },
  { 
    label: 'ProMascotas', 
    title: 'Profilaxis a Domicilio',
    tag: 'Cuidado Dental Pet',
    color: BRAND_COLORS.PROMASCOTAS,
    desc: 'La sonrisa de su mejor amigo es nuestra prioridad. Realizamos limpieza dental profunda sin anestesia general (según evaluación), eliminando sarro y mal aliento directamente en la comodidad de su hogar.',
    href: '/empresas/promascotas',
    images: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=70&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=70&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=70&w=800&auto=format&fit=crop'
    ]
  },
  { 
    label: 'Soluciones AS', 
    title: 'Respaldo Corporativo',
    tag: 'Infraestructura Técnica',
    color: BRAND_COLORS.SOLUCIONES,
    desc: 'Más que un servicio, somos su aliado estratégico. Soluciones Integrales AS SAS centraliza la excelencia operativa para brindar confianza, garantía y profesionalismo en cada intervención técnica.',
    href: '/empresas/soluciones-as',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=70&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=70&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=70&w=800&auto=format&fit=crop'
    ]
  },
];


export default function Home() {
  const cardsRef     = useRef<HTMLAnchorElement[]>([]);
  const textsRef     = useRef<HTMLDivElement[]>([]);
  const heroRef      = useRef<HTMLElement>(null);

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

        const gridPos = isDesktop
          ? [{ x: 75, y: -240 }, { x: 450, y: -240 }, { x: 75, y: 240 }, { x: 450, y: 240 }]
          // Mobile: keep all 4 cards within lower zone
          : [{ x: -100, y: -130 }, { x: 100, y: -130 }, { x: -100, y: 130 }, { x: 100, y: 130 }];

        gsap.set(cards, { opacity: 0, y: 350, scale: isDesktop ? 0.8 : 0.6, x: 0, rotation: 0 });
        gsap.set(texts, { opacity: 0, y: 30, pointerEvents: 'none' });

        const introTL = gsap.timeline({ delay: 0.2 });
        introTL
          .fromTo(texts[0], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, pointerEvents: 'auto' })
          .to(cards, {
            opacity: 1,
            scale: isDesktop ? 0.8 : 0.55,
            x: (i) => gridPos[i].x,
            y: (i) => gridPos[i].y,
            rotation: 0,
            duration: 1.2,
            stagger: 0.05,
            ease: 'power3.out',
          }, '-=0.6');

        const masterTL = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=800%',
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        masterTL.eventCallback("onUpdate", () => {
          const t = masterTL.progress();
          let nextIdx = null;
          if (t >= 0.83) nextIdx = 3;
          else if (t >= 0.58) nextIdx = 2;
          else if (t >= 0.33) nextIdx = 1;
          else if (t >= 0.083) nextIdx = 0;
          
          if (activeCardIdxRef.current !== nextIdx) {
            activeCardIdxRef.current = nextIdx;
            setActiveCardIdx(nextIdx);
          }
        });

        masterTL.set(texts[0], { opacity: 1, y: 0, pointerEvents: 'auto' }, 0); 

        cards.forEach((card, i) => {
          masterTL.fromTo(card, 
            { x: gridPos[i].x, y: gridPos[i].y, rotation: 0, scale: isDesktop ? 0.8 : 0.55, opacity: 1 },
            { x: gridPos[i].x, y: gridPos[i].y, rotation: 0, scale: isDesktop ? 0.8 : 0.55, opacity: 1, duration: 1.0 }, 0);
        }); 

        const focusX = isDesktop ? 260 : 0;
        // Mobile: CSS handles text at top, cards at bottom — GSAP y=0 keeps both in their CSS zones
        const focusY = isDesktop ? 0 : 0;
        const textYOffset = 0; // CSS positioning handles separation, no GSAP y needed

        businessLines.forEach((_, i) => {
          const startTime = 1.0 + i * 3;
          masterTL.to(texts[i], { opacity: 0, y: -20, duration: 0.8, pointerEvents: 'none' }, startTime);
          
          if (i > 0) {
            masterTL.to(cards[i-1], { x: isDesktop ? '100vw' : 0, y: isDesktop ? 0 : '100vh', opacity: 0, duration: 1 }, startTime);
          } else {
            [1, 2, 3].forEach(idx => masterTL.to(cards[idx], { opacity: 0, duration: 0.5 }, startTime));
          }

          masterTL.fromTo(texts[i+1], 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, pointerEvents: 'auto' }, startTime + 0.5);
            
          masterTL.to(cards[i], { 
            x: focusX, y: focusY, scale: isDesktop ? 1.4 : 1.1, opacity: 1, duration: 1.2, ease: 'power3.out' 
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
              <Link 
                key={`card-${i}`} 
                href={line.href}
                ref={el => { if (el) cardsRef.current[i] = el; }} 
                className={styles.card}
                style={{ '--hover-color': line.color } as React.CSSProperties}
              >
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
              </Link>
            );
          })}
        </div>
        <div className={styles.fixedTexts}>
          <div ref={el => { if (el) textsRef.current[0] = el; }} className={styles.textBlock}>
            <span className={styles.stepTag} style={{ color: BRAND_COLORS.SOLUCIONES }}>Soporte Técnico Especializado</span>
            <h2>Soluciones Integrales AS SAS</h2>
            <p>El respaldo corporativo de confianza en Colombia. Integramos tecnología, experiencia y un equipo humano altamente capacitado para cuidar lo que más le importa.</p>
          </div>
          {businessLines.map((line, i) => (
            <div key={`text-${i}`} ref={el => { if (el) textsRef.current[i+1] = el; }} className={styles.textBlock}>
              <span className={styles.stepTag} style={{ color: line.color }}>{line.tag}</span>
              <h2 style={{ borderColor: line.color }}>{line.title}</h2>
              <p>{line.desc}</p>
              <div className={styles.stepCta}>
                <a href={`https://wa.me/573001234567?text=Hola! Vengo de la web y quiero agendar con ${line.label}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ backgroundColor: line.color, borderColor: line.color }}>
                  Agendar con {line.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section ref={heroRef} className={styles.hero} />

      <section id="nosotros" className={styles.nosotros}>
        <div className="container">
          <div className={styles.nosotrosGrid}>
            <div className={styles.nosotrosText}>
              <span className={styles.sectionLabel}>Nuestra Historia</span>
              <h2>Más de 10 años brindando soluciones de confianza</h2>
              <p>En <strong>Soluciones Integrales AS SAS</strong>, nacimos con una misión clara: simplificar la vida de nuestros clientes a través de servicios técnicos de alta calidad y un respaldo corporativo inigualable.</p>
              <p>Lo que comenzó como una especialización en construcción civil y acabados de piscinas con <strong>Ingenova</strong>, ha evolucionado hasta convertirse en un ecosistema de servicios que abarca desde el servicio técnico de calentadores con <strong>Viva Calentadores</strong> hasta la salud animal con <strong>ProMascotas</strong>.</p>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>+2k</span>
                  <span className={styles.statLab}>Clientes Felices</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>100%</span>
                  <span className={styles.statLab}>Garantía Técnica</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>24/7</span>
                  <span className={styles.statLab}>Soporte Premium</span>
                </div>
              </div>
            </div>
            <div className={styles.nosotrosImage}>
              <Image 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=70&w=800&auto=format&fit=crop"
                alt="Nuestro Equipo Profesional"
                width={600}
                height={400}
                className={styles.roundedImg}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="cobertura" className={styles.cobertura}>
        <div className="container text-center">
          <span className={styles.sectionLabel}>Donde estamos</span>
          <h2>Presencia y Cobertura</h2>
          <p className={styles.coberturaP}>Actualmente brindamos cobertura total en **Bogotá y Sabana Norte**, llegando hasta la puerta de su hogar o empresa con la rapidez y eficiencia que nos caracteriza.</p>
          <div className={styles.mapMockup}>
             <div className={styles.cityBadge}>Bogotá D.C.</div>
             <div className={styles.cityBadge}>Chía</div>
             <div className={styles.cityBadge}>Cajicá</div>
             <div className={styles.cityBadge}>Cota</div>
             <div className={styles.cityBadge}>Sopó</div>
          </div>
        </div>
      </section>

      <section id="contacto" className={styles.ctaFinal}>
        <div className={styles.ctaFinalInner}>
          <h3 className={styles.ctaTitle}>¿Tiene un requerimiento especial?</h3>
          <p className={styles.ctaSub}>Estamos listos para asesorarlo. Atención inmediata y respaldo total.</p>
          <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer" className="btn-primary" style={{ backgroundColor: BRAND_COLORS.SOLUCIONES, borderColor: BRAND_COLORS.SOLUCIONES }}>
            Hablar con un asesor ahora →
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
