'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';
import Footer from '@/components/Footer';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

export const BRAND_COLORS = {
  SOLUCIONES: '#1a5d91',
  INGENOVA: '#f39c12',
  PROMASCOTAS: '#f1c40f',
  CLUBHOUSE: '#82b440',
};

const businessLines = [
  { 
    label: 'Ingenova', 
    title: 'Jacuzzis, Piscinas & Turcos',
    tag: 'Mantenimiento & Repuestos',
    color: BRAND_COLORS.INGENOVA,
    desc: 'Somos expertos en el corazón de sus zonas húmedas. Ofrecemos mantenimiento preventivo y correctivo, venta de motobombas, filtros y químicos de alta calidad para garantizar aguas cristalinas y sistemas eficientes.',
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  { 
    label: 'ClubHouse', 
    title: 'Administración & Nado',
    tag: 'Gestión & Capacitación',
    color: BRAND_COLORS.CLUBHOUSE,
    desc: 'Llevamos la gestión de complejos acuáticos a otro nivel. Desde la administración operativa de clubes y conjuntos hasta escuelas de natación para todas las edades con instructores certificados por la federación.',
    images: [
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1530549387634-e7a5bc2a6132?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  { 
    label: 'ProMascotas', 
    title: 'Profilaxis a Domicilio',
    tag: 'Cuidado Dental Pet',
    color: BRAND_COLORS.PROMASCOTAS,
    desc: 'La sonrisa de su mejor amigo es nuestra prioridad. Realizamos limpieza dental profunda sin anestesia general (según evaluación), eliminando sarro y mal aliento directamente en la comodidad de su hogar.',
    images: [
      'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  { 
    label: 'Soluciones AS', 
    title: 'Respaldo Corporativo',
    tag: 'Infraestructura Técnica',
    color: BRAND_COLORS.SOLUCIONES,
    desc: 'Más que un servicio, somos su aliado estratégico. Soluciones Integrales AS SAS centraliza la excelencia operativa para brindar confianza, garantía y profesionalismo en cada intervención técnica.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop'
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
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [wordIdx, setWordIdx] = useState(0);

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

  // THREE.JS HYPERREALISTIC WATER EFFECT (NO PHOTO - PURE SHADER)
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(20, 20, 128, 128);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;
        uniform vec2 uMouse;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float dist = distance(uv, uMouse);
          float ripple = sin(dist * 40.0 - uTime * 5.0) * exp(-dist * 5.0) * 0.15;
          // Add subtle ambient waves
          float waves = sin(uv.x * 10.0 + uTime) * cos(uv.y * 10.0 + uTime) * 0.05;
          pos.z += ripple + waves;
          vElevation = ripple + waves;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;
        void main() {
          // Subtle blue gradient colors
          vec3 colorLow = vec3(0.96, 0.96, 0.98); // Very light grey/blue
          vec3 colorHigh = vec3(0.85, 0.92, 0.98); // Light soft blue
          vec3 finalColor = mix(colorLow, colorHigh, vElevation * 2.0 + 0.5);
          
          // Add subtle specular highlights based on elevation
          float highlight = smoothstep(0.05, 0.15, vElevation);
          finalColor += highlight * 0.1;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 4;
    scene.add(mesh);

    camera.position.z = 5;

    const handleMouseMove = (e: MouseEvent) => {
      material.uniforms.uMouse.value.x = e.clientX / window.innerWidth;
      material.uniforms.uMouse.value.y = 1.0 - (e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      material.uniforms.uTime.value += 0.03;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    const rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      if (canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

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
            end: '+=800%',
            pin: true, scrub: 0.5, invalidateOnRefresh: true,
          },
        });

        masterTL.eventCallback("onUpdate", () => {
          const t = masterTL.progress();
          let nextIdx = null;
          if (t >= 0.8) nextIdx = 3;
          else if (t >= 0.6) nextIdx = 2;
          else if (t >= 0.4) nextIdx = 1;
          else if (t >= 0.2) nextIdx = 0;
          
          if (activeCardIdxRef.current !== nextIdx) {
            activeCardIdxRef.current = nextIdx;
            setActiveCardIdx(nextIdx);
          }
        });

        masterTL.fromTo([headlineRef.current, ctaGroupRef.current], 
          { opacity: 1, y: 0 },
          { opacity: 0, y: -80, duration: 1 }, 0);
          
        if (canvasContainerRef.current) {
          masterTL.fromTo(canvasContainerRef.current, 
            { opacity: 1 }, 
            { opacity: 0, duration: 1 }, 0);
        }

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

      <section ref={heroRef} className={styles.hero}>
        <div ref={canvasContainerRef} className={styles.waterCanvas} />
        <div className={styles.heroContent}>
          <h1 ref={headlineRef} className={styles.heroH1}>
            Expertos en<br />
            <span className={styles.accent} style={{ color: words[wordIdx].color }}>
              {words[wordIdx].text}
            </span>.
          </h1>
          <div ref={ctaGroupRef} className={styles.ctaGroup}>
            <button className="btn-primary" style={{ backgroundColor: BRAND_COLORS.SOLUCIONES, borderColor: BRAND_COLORS.SOLUCIONES }} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
              Nuestros servicios
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })}>Conócenos</button>
          </div>
        </div>
      </section>

      <section id="nosotros" className={styles.nosotros}>
        <div className="container">
          <div className={styles.nosotrosGrid}>
            <div className={styles.nosotrosText}>
              <span className={styles.sectionLabel}>Nuestra Historia</span>
              <h2>Más de 10 años brindando soluciones de confianza</h2>
              <p>En **Soluciones Integrales AS SAS**, nacimos con una misión clara: simplificar la vida de nuestros clientes a través de servicios técnicos de alta calidad y un respaldo corporativo inigualable.</p>
              <p>Lo que comenzó como una especialización en zonas húmedas con **Ingenova**, ha evolucionado hasta convertirse en un ecosistema de servicios que abarca desde la administración de nado con **ClubHouse** hasta la salud animal con **ProMascotas**.</p>
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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                alt="Nuestro Equipo Profesional"
                width={600}
                height={400}
                className={styles.roundedImg}
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
