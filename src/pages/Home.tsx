import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useScroll,
  useInView, useReducedMotion, MotionConfig,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — V3 « WORKFLOW / NODE-GRAPH »
// Hero = schéma d'automatisation animé en SVG (Audit → Automatisation
// → Déploiement → Suivi). Formation d'abord, conseil ensuite. Dark
// #0F0F0F + mint #00FA9A + Archivo. Production-ready, responsive.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_INLINE = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const NOTION_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const EMAIL = 'contact@axem-ia.fr';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// Grainient — halo mint lumineux mais maîtrisé (texte reste lisible)
const GRAINIENT = {
  timeSpeed: 0.16, warpStrength: 1.0, warpFrequency: 5.0, warpSpeed: 2.0,
  warpAmplitude: 50.0, blendAngle: 0.0, blendSoftness: 0.05, rotationAmount: 500.0,
  noiseScale: 2.0, grainAmount: 0.12, grainScale: 1.5, grainAnimated: false,
  contrast: 1.45, gamma: 1.0, saturation: 1.05, zoom: 0.8,
  color1: '#9BFFD9', color2: '#00E0A4', color3: '#0E5C57',
} as const;

// =====================================================================
// HELPERS
// =====================================================================
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
);

// Mots qui montent (mask reveal) mot par mot — utilisé pour le titre hero
const RiseWords: React.FC<{ text: string; className?: string; delay?: number; stagger?: number }> = ({ text, className = '', delay = 0, stagger = 0.08 }) => {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span className="inline-block"
            initial={{ y: '110%' }} animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const Magnetic: React.FC<any> = ({ children, strength = 0.3, className, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 13, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 13, mass: 0.5 });
  const reduce = useReducedMotion();
  const move = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return <motion.a ref={ref} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ x: sx, y: sy }} className={className} {...props}>{children}</motion.a>;
};

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; className?: string }> = ({ value, prefix = '', suffix = '', className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const start = performance.now(); let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - start) / 1600); setN(Math.round((1 - Math.pow(1 - k, 3)) * value)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const fmt = n >= 1000 ? n.toLocaleString('fr-FR') : String(n);
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

// Carte avec spotlight curseur + glow de bordure
const Spotlight: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  const move = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  return (
    <div ref={ref} onMouseMove={move} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      className={`group relative overflow-hidden ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{ opacity: on ? 1 : 0, background: `radial-gradient(340px circle at ${pos.x}px ${pos.y}px, rgba(0,250,154,0.14), transparent 70%)` }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// =====================================================================
// NAV
// =====================================================================
const NAV_LINKS = [
  ['Le duo', '#duo'],
  ['Méthode', '#methode'],
  ['Formation', '#formation'],
  ['Conseil', '#conseil'],
  ['Cas clients', '#cas-clients'],
] as const;

const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 24); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-2xl tracking-tighter text-cream" style={{ fontWeight: 900 }}>
          AXEM<span className="text-green">.</span>
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.1em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
          className="group inline-flex items-center gap-1.5 bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] text-ink" style={{ fontWeight: 800 }}>
          Rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// =====================================================================
// HERO — WORKFLOW NODE-GRAPH (le visuel = le métier)
// =====================================================================
const WORKFLOW_NODES = [
  { id: 'audit', label: 'Audit', icon: 'search' },
  { id: 'auto', label: 'Automatisation', icon: 'cog' },
  { id: 'deploy', label: 'Déploiement', icon: 'rocket' },
  { id: 'suivi', label: 'Suivi', icon: 'pulse' },
] as const;

// Petites icônes inline (24x24 viewBox)
const NodeIcon: React.FC<{ type: string }> = ({ type }) => {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (type === 'search') return <svg viewBox="0 0 24 24" {...common}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
  if (type === 'cog') return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="12" r="3.2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></svg>;
  if (type === 'rocket') return <svg viewBox="0 0 24 24" {...common}><path d="M5 13c-1.5 1.3-2 5-2 5s3.7-.5 5-2M14.5 4.5C12 7 8 11 7 16l1 1c5-1 9-5 11.5-7.5C21 8 21 4 21 3c-1 0-5 0-6.5 1.5Z" /><circle cx="15" cy="9" r="1.4" /></svg>;
  return <svg viewBox="0 0 24 24" {...common}><path d="M2 12h4l2-7 4 14 2-7h6" /></svg>;
};

// Schéma de workflow — SVG en viewBox, ne déborde jamais.
// Desktop = horizontal ; mobile = on garde le même SVG (responsive via viewBox).
const WorkflowGraph: React.FC = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? 4 : 0);

  // Allumage séquentiel des nœuds une fois le tracé lancé
  useEffect(() => {
    if (reduce) return;
    const timers = WORKFLOW_NODES.map((_, i) =>
      setTimeout(() => setActive((a) => Math.max(a, i + 1)), 700 + i * 650));
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  // 4 nœuds, layout horizontal. viewBox 1000x320.
  // Positions x des nœuds (centres)
  const xs = [120, 393, 666, 880];
  const cy = 150;
  const nodeR = 30;

  // Connecteurs bézier entre nœuds successifs
  const connectors = xs.slice(0, -1).map((x, i) => {
    const x1 = x + nodeR + 10;
    const x2 = xs[i + 1] - nodeR - 10;
    const mid = (x1 + x2) / 2;
    // courbe douce (légère ondulation pour le côté "flow")
    const curve = i % 2 === 0 ? -26 : 26;
    return { d: `M ${x1} ${cy} C ${mid} ${cy + curve}, ${mid} ${cy - curve}, ${x2} ${cy}`, key: i };
  });

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 1000 320" className="w-full" preserveAspectRatio="xMidYMid meet" role="img"
        aria-label="Schéma du workflow AXEM : Audit, Automatisation, Déploiement, Suivi reliés par un flux de données.">
        <defs>
          <linearGradient id="wf-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00FA9A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00FA9A" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="wf-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FA9A" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00FA9A" stopOpacity="0" />
          </radialGradient>
          <filter id="wf-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* CONNECTEURS qui se tracent */}
        {connectors.map((c, i) => (
          <g key={c.key}>
            {/* trace de fond discrète */}
            <path d={c.d} fill="none" stroke="rgba(250,250,247,0.1)" strokeWidth="2" />
            {/* tracé animé */}
            <motion.path d={c.d} fill="none" stroke="url(#wf-line)" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: reduce ? 0 : 0.5 + i * 0.65, ease }} />
            {/* point de données qui circule le long du connecteur */}
            {!reduce && (
              <motion.circle r="5" fill="#00FA9A"
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.6, delay: 1.4 + i * 0.65, repeat: Infinity, repeatDelay: 2.4 + (connectors.length - 1) * 0.65, ease: 'easeInOut' }}>
                <animateMotion dur="1.6s" begin={`${1.4 + i * 0.65}s`} repeatCount="indefinite" rotate="auto" path={c.d}
                  keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
              </motion.circle>
            )}
          </g>
        ))}

        {/* NŒUDS */}
        {WORKFLOW_NODES.map((node, i) => {
          const x = xs[i];
          const isOn = i < active;
          return (
            <g key={node.id}>
              {/* halo quand allumé */}
              <motion.circle cx={x} cy={cy} r={nodeR + 22} fill="url(#wf-glow)"
                animate={{ opacity: isOn ? 1 : 0, scale: isOn ? 1 : 0.6 }} transition={{ duration: 0.6, ease }} />
              {/* anneau */}
              <motion.circle cx={x} cy={cy} r={nodeR} fill="#0F0F0F"
                stroke={isOn ? '#00FA9A' : 'rgba(250,250,247,0.22)'} strokeWidth="2"
                animate={{ scale: isOn ? 1 : 0.92 }} transition={{ duration: 0.5, ease, delay: 0.1 }} />
              {/* icône */}
              <foreignObject x={x - 14} y={cy - 14} width="28" height="28" style={{ overflow: 'visible' }}>
                <div className="flex h-7 w-7 items-center justify-center transition-colors duration-500"
                  style={{ color: isOn ? '#00FA9A' : 'rgba(250,250,247,0.5)' }}>
                  <NodeIcon type={node.icon} />
                </div>
              </foreignObject>
              {/* numéro + label */}
              <text x={x} y={cy + nodeR + 32} textAnchor="middle"
                fill={isOn ? '#FAFAF7' : 'rgba(250,250,247,0.55)'}
                style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em' }}>
                {node.label}
              </text>
              <text x={x} y={cy - nodeR - 16} textAnchor="middle"
                fill={isOn ? '#00FA9A' : 'rgba(0,250,154,0.4)'}
                style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '0.1em' }}>
                {`0${i + 1}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 md:px-8 md:pt-32">
      {/* BACKGROUND — grille blueprint + halo mint Grainient */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-[#0F0F0F]">
        {/* halo Grainient, atténué pour rester en fond */}
        <div className="absolute inset-0 opacity-55">
          <Grainient {...GRAINIENT} className="h-full w-full" />
        </div>
        {/* grille blueprint subtile */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,250,154,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,250,154,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(120% 100% at 50% 0%, black 35%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(120% 100% at 50% 0%, black 35%, transparent 80%)',
        }} />
        {/* voiles lisibilité */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 55% at 50% 38%, rgba(7,9,12,0.62) 0%, rgba(7,9,12,0.32) 45%, transparent 72%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-[28%]" style={{ background: 'linear-gradient(180deg, transparent, #0F0F0F)' }} />
        <div className="absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.5), transparent)' }} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* EYEBROW retravaillé */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}
          className="inline-flex items-center gap-2.5 rounded-full border border-green/30 bg-green/10 px-4 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-cream md:text-[11px]">De l'audit au déploiement — un seul partenaire IA</span>
        </motion.div>

        {/* TITRE créatif — mask reveal mot à mot */}
        <h1 className="mt-7 font-display leading-[0.92] tracking-tight text-cream [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]"
          style={{ fontWeight: 900, fontSize: 'clamp(38px, 7.4vw, 92px)' }}>
          <RiseWords text="On automatise" delay={0.15} />
          <br />
          <span className="relative inline-block">
            <RiseWords text="votre travail." delay={0.4} className="text-green" />
            <motion.span aria-hidden className="absolute -bottom-2 left-0 h-[0.1em] rounded-full bg-green"
              initial={{ width: reduce ? '100%' : 0 }} animate={{ width: '100%' }} transition={{ duration: 0.7, delay: 0.95, ease }} />
          </span>
        </h1>

        {/* SOUS-LIGNE */}
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease }}
          className="mt-7 max-w-2xl font-display text-lg font-bold leading-snug text-cream [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] md:text-2xl">
          Agence d'IA &amp; organisme de formation certifié Qualiopi. <span className="text-green">On forme, on conseille, on déploie. Et on reste.</span>
        </motion.p>

        {/* SCHÉMA WORKFLOW — le visuel raconte le métier */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.85, ease }}
          className="mt-10 w-full max-w-3xl rounded-2xl border border-cream/10 bg-ink/40 p-5 backdrop-blur-sm md:mt-12 md:p-7">
          <WorkflowGraph />
        </motion.div>

        {/* DOUBLE CTA */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.05, ease }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.35}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.65)]" style={{ fontWeight: 900 }}>
            <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
            <span className="relative">Diagnostic gratuit</span>
            <span className="relative transition-transform group-hover:translate-x-1">→</span>
          </Magnetic>
          <a href="#formation" className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-cream/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-cream backdrop-blur-sm transition hover:bg-cream/15">
            Voir le catalogue <span aria-hidden>↓</span>
          </a>
        </motion.div>

        {/* MINI PREUVE SOCIALE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 1.25 }}
          className="mt-9 inline-flex items-center gap-3 rounded-full border border-cream/15 bg-ink/40 py-2 pl-2 pr-5 backdrop-blur-md">
          <div className="flex -space-x-2.5">
            <img src={CLEMENT_IMG} alt="Clément Predo" className="h-8 w-8 rounded-full object-cover ring-2 ring-ink" loading="lazy" />
            <img src={ALEXIS_IMG} alt="Alexis Zeitoun" className="h-8 w-8 rounded-full object-cover ring-2 ring-ink" loading="lazy" />
          </div>
          <span className="text-sm font-semibold text-cream">
            <span className="text-green">+55 000</span> abonnés LinkedIn nous suivent
          </span>
        </motion.div>
      </div>
    </section>
  );
};

// =====================================================================
// TRUST — logos COULEUR sur cartes blanches, 2 groupes + Qualiopi réel
// =====================================================================
type Logo = { src?: string; alt: string; fallback?: boolean };
const CLIENTS: Logo[] = [
  { src: '/logos/carrefour.svg', alt: 'Carrefour' },
  { src: '/logos/blackfin.png', alt: 'BlackFin Capital Partners' },
  { src: '/logos/avantis.png', alt: 'Avantis' },
  { src: '/logos/kit.png', alt: 'KIT France' },
  { src: '/logos/espace2.png', alt: 'Espace 2' },
  { src: '/logos/socos.png', alt: 'Socos' },
  { src: '/logos/gravotech.png', alt: 'Gravotech' },
];
const ORGANISMES: Logo[] = [
  { src: '/logos/myconnecting.png', alt: 'myconnecting' },
  { alt: 'synapse ia', fallback: true },
  { src: '/logos/asphere.png', alt: 'ASphere' },
  { src: '/logos/aisisters.svg', alt: 'AI Sisters' },
  { src: '/logos/senza.png', alt: 'SENZA Formations' },
  { src: '/logos/cegos.png', alt: 'Cegos' },
];

const LogoCard: React.FC<{ logo: Logo }> = ({ logo }) => (
  <div className="flex h-20 items-center justify-center rounded-xl border border-cream/10 bg-white px-5 py-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] md:h-24">
    {logo.fallback || !logo.src ? (
      <span className="font-display text-lg text-[#1a1a1a] md:text-xl" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
        {logo.alt}
      </span>
    ) : (
      <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async"
        className="max-h-12 w-auto max-w-[150px] object-contain md:max-h-14" />
    )}
  </div>
);

const Trust: React.FC = () => (
  <section id="references" className="relative border-y border-cream/10 bg-ink-2 px-5 py-16 md:px-8 md:py-20">
    <div className="mx-auto max-w-[1400px]">
      <Reveal>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green">Ils nous font confiance</p>
          <p className="font-display text-2xl text-cream md:text-4xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Des PME aux grands comptes &amp; administrations.</p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_auto_1fr]">
        {/* CLIENTS */}
        <div>
          <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-cream-dim">Clients</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3">
            {CLIENTS.map((l, i) => (
              <Reveal key={l.alt} delay={(i % 4) * 0.04}><LogoCard logo={l} /></Reveal>
            ))}
          </div>
        </div>

        {/* séparateur vertical sur desktop */}
        <div aria-hidden className="hidden w-px bg-cream/10 lg:block" />

        {/* ORGANISMES */}
        <div>
          <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-cream-dim">Organismes de formation partenaires</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3">
            {ORGANISMES.map((l, i) => (
              <Reveal key={l.alt} delay={(i % 4) * 0.04}><LogoCard logo={l} /></Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Bandeau Qualiopi réel */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-green/20 bg-white px-6 py-5 text-center sm:flex-row sm:text-left">
          <img src="/logos/qualiopi.png" alt="Certification Qualiopi" className="h-16 w-auto shrink-0 object-contain" loading="lazy" />
          <div>
            <p className="font-display text-base text-[#111]" style={{ fontWeight: 800 }}>Organisme de formation certifié Qualiopi</p>
            <p className="mt-0.5 text-sm text-[#444]">Nos formations sont finançables par votre OPCO — prise en charge possible jusqu'à 100 %.</p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// =====================================================================
// PROBLÈME — 3 pièges
// =====================================================================
const Problem: React.FC = () => {
  const traps = [
    { n: '01', t: 'Formations théoriques', d: "Les équipes sont « formées » mais pas opérationnelles. Aucun livrable, aucune mise en pratique. Le lundi, rien n'a changé." },
    { n: '02', t: 'Outils sans stratégie', d: "Des licences achetées, aucune feuille de route. On empile les outils sans jamais cartographier les vrais cas d'usage." },
    { n: '03', t: 'Aucun suivi après coup', d: "Le consultant part, les habitudes reviennent. Sans accompagnement dans la durée, l'adoption s'effondre en quelques semaines." },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Pourquoi la plupart échouent</div></Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-4xl font-display leading-[0.95] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 6vw, 84px)' }}>
            3 pièges qui font <span className="outline-green">capoter</span> 90 % des projets IA.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {traps.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.08}>
              <Spotlight className="flex h-full flex-col gap-4 rounded-2xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:border-green/40 md:p-8">
                <span className="font-display text-5xl text-cream/15 tighter" style={{ fontWeight: 900 }}>{t.n}</span>
                <h3 className="font-display text-xl text-cream md:text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{t.t}</h3>
                <p className="text-sm leading-relaxed text-cream-soft md:text-[15px]">{t.d}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-12 max-w-2xl text-lg text-cream-soft md:text-xl">
            Notre réponse : <span className="font-bold text-cream">un parcours complet, pas une intervention isolée.</span> De l'audit à l'autonomie de vos équipes.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// DUO — remonté tôt
// =====================================================================
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. 3 ans de terrain IA. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Les fondateurs</div></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 110px)' }}>
            Deux experts,<br /><span className="text-green">un seul interlocuteur.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}><p className="mt-6 max-w-2xl text-lg text-cream-soft md:text-xl">
          Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez directement à ceux qui livrent.
        </p></Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream/12 bg-ink transition-colors hover:border-green/40">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-lg bg-green text-ink shadow-lg transition-transform hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-7 md:p-9">
                  <div>
                    <h3 className="font-display text-2xl text-cream tighter md:text-4xl" style={{ fontWeight: 900 }}>{f.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-green">{f.school}</p>
                    <p className="text-sm text-cream-soft">{f.role}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-cream-soft md:text-base">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-cream/12 pt-5">
                    <span className="font-display text-4xl text-cream md:text-5xl" style={{ fontWeight: 900 }}><Counter value={f.n} prefix="+" /></span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.18}>
          <p className="mt-12 text-center font-display text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(32px, 6vw, 90px)' }}>
            Ensemble, <span className="text-green">+55 000</span> abonnés nous suivent.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// MÉTHODE — « En 3 étapes. Pas une de plus. » (ligne qui se dessine)
// =====================================================================
const Method: React.FC = () => {
  const reduce = useReducedMotion();
  const steps = [
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48 h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  return (
    <section id="methode" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.5vw, 120px)' }}>
            En 3 étapes.<br /><span className="text-green">Pas une de plus.</span>
          </h2>
        </Reveal>

        {/* ligne de progression qui se dessine */}
        <div className="relative mt-16">
          <div aria-hidden className="absolute left-0 top-7 hidden h-px w-full bg-cream/12 md:block">
            <motion.div className="h-full bg-green" initial={{ scaleX: reduce ? 1 : 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 1.2, ease }} style={{ transformOrigin: 'left' }} />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="relative">
                  <div className="mb-6 hidden h-3.5 w-3.5 rounded-full border-2 border-green bg-ink md:block" style={{ marginLeft: '0.05rem' }} />
                  <Spotlight className="flex h-full flex-col gap-4 rounded-2xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:border-green/40 md:p-9">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-6xl text-cream tighter md:text-7xl" style={{ fontWeight: 900 }}>{s.n}</span>
                      <span className="rounded-md bg-green px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                    </div>
                    <h3 className="font-display text-2xl text-cream md:text-3xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{s.t}</h3>
                    <p className="text-[15px] leading-relaxed text-cream-soft md:text-base">{s.d}</p>
                  </Spotlight>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// BLOC 1 — FORMATION (catalogue F01→F10 filtrable, clic = détail)
// =====================================================================
type Formation = {
  code: string; title: string; level: 'SOCLE' | 'MÉTIERS' | 'AUTOMATISATION' | 'TRANSVERSAL' | 'PRODUCTION';
  duration: string; price: string; tagline: string;
  program: string[]; tools: string; deliverables: string[];
};
const FORMATIONS: Formation[] = [
  { code: 'F01', title: 'IA Essentielle', level: 'SOCLE', duration: '1 J', price: '300 €', tagline: 'De zéro à opérationnel en 1 journée.',
    program: ['Matin · Comprendre l\'IA : fonctionnement d\'un LLM (sans jargon), RGPD, identifier ses cas d\'usage métier.', 'Après-midi · Pratiquer : Prompt Engineering RACF, 15 exercices sur cas réels, plan d\'action J+1 (3 actions à déployer demain matin).'],
    tools: 'Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash · Perplexity', deliverables: ['Guide 50 Prompts par Métier', 'Charte d\'usage IA', 'Fiche 3 Quick Wins J+1'] },
  { code: 'F02', title: 'Prompt Engineering Pro', level: 'SOCLE', duration: '½ J', price: '200 €', tagline: 'Multiplier par 5 la qualité de ses outputs IA.',
    program: ['Techniques avancées : Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting.', '20 exercices chronométrés sur cas réels.', 'Construire sa bibliothèque de prompts d\'équipe (template Notion en live).', 'Atelier final : 5 prompts signature.'],
    tools: 'Claude Opus 4.6 · GPT-5.2 · Gemini 3.1 Pro', deliverables: ['Template Bibliothèque Prompts Notion', 'Fiche mémo Techniques Avancées'] },
  { code: 'F03', title: 'Maîtriser Claude', level: 'SOCLE', duration: '1 J', price: '450 €', tagline: 'Devenir expert de l\'IA qui pèse 70 % du Fortune 100.',
    program: ['Matin · Bases solides : Claude vs ChatGPT vs Gemini, modèles Sonnet 4.6 & Opus 4.6, Projects, Artifacts, Computer Use.', 'Après-midi · Niveau expert : Claude Skills, MCP, Cowork & Sub-agents, atelier 3 Skills.'],
    tools: 'Claude Opus 4.6 · Sonnet 4.6 · Skills · MCP · Cowork', deliverables: ['Pack 10 Skills Axem', 'Guide Claude Power User', 'Charte d\'usage Claude'] },
  { code: 'F04', title: 'IA pour tous les métiers', level: 'MÉTIERS', duration: '1 J', price: '400 €', tagline: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    program: ['Modules : Direction & Stratégie · Marketing & Commercial · RH & Recrutement · Finance & Compta · Juridique & Compliance · Service Client · Réseaux Sociaux & Brand · Créatif & Design.', 'Modules combinables, contenus 2026.'],
    tools: 'Suite IA générative 2026 (multi-modèles)', deliverables: ['Kit de prompts sectoriels', 'Plan d\'adoption par métier'] },
  { code: 'F05', title: 'No-Code & Workflows', level: 'AUTOMATISATION', duration: '2 J', price: '800 €', tagline: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    program: ['J1 · Make & n8n : 3 automatisations live (Formulaire→CRM, Email→Slack+tâche, RSS→LinkedIn). 1 workflow déployé avant 18 h.', 'J2 · Intégrer Claude/GPT/Gemini, conditions complexes, erreurs, boucles. Projet final déployé en prod.'],
    tools: 'Make · n8n · Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash', deliverables: ['10 templates Make & n8n prêts à cloner', 'Guide Connecter 50 outils'] },
  { code: 'F06', title: 'Agent IA sur-mesure', level: 'AUTOMATISATION', duration: '2 J', price: '1 250 €', tagline: 'Un travailleur autonome qui agit seul, 24 h/24. (Prérequis : F05 ou pratique API)',
    program: ['J1 · Architecture : LLM + Mémoire + Outils + Planification (démo live), frameworks (n8n Agents, CrewAI, LangGraph), RAG (Pinecone, Chroma), MCP.', 'J2 · Déploiement : 3 patterns business (Support 24/7, SDR, Admin), Claude Skills, validation humaine, monitoring, RGPD, projet final.'],
    tools: 'Claude Opus 4.6 · GPT-5.2 · n8n Agents · CrewAI · LangGraph · Pinecone · MCP', deliverables: ['Template Agent IA n8n/LangGraph', 'Guide 6 Architectures d\'Agents', 'Checklist sécurité'] },
  { code: 'F07', title: 'Vibe Coding & Claude Code', level: 'AUTOMATISATION', duration: '1 J', price: '450 €', tagline: 'Construire des outils sans coder, avec l\'IA comme binôme.',
    program: ['Matin · Lovable/Bolt.new/v0 (app web en 1 h), méthode du vibe coding structuré, atelier micro-outil métier.', 'Après-midi · Cursor IDE, Claude Code (CLI), workflows générer/tester/déployer, sécurité & gouvernance.'],
    tools: 'Cursor · Claude Code · Lovable · Bolt.new · v0 · GitHub Copilot', deliverables: ['Pack Prompts Vibe Coding', 'Guide Cursor & Claude Code', '3 mini-apps livrées'] },
  { code: 'F08', title: 'Gouvernance & AI Act', level: 'TRANSVERSAL', duration: '½ J', price: '250 €', tagline: 'Cadrer ses usages IA en conformité. (Direction, DPO, DSI, RH, Juristes)',
    program: ['AI Act 2026 (interdit/obligatoire), RGPD & IA (serveurs US OpenAI/Anthropic).', 'Construire sa charte IA + traçabilité, 5 cas pratiques live, matrice de risques AI Act.'],
    tools: 'AI Act 2026 · CNIL · Frameworks RGPD', deliverables: ['Template Charte IA', 'Matrice de risques AI Act', 'Plan de mise en conformité 90 jours'] },
  { code: 'F09', title: 'Veille IA', level: 'TRANSVERSAL', duration: '2 h', price: '80 € · 320 €/an', tagline: 'Rester à jour sur un champ qui bouge tous les mois.',
    program: ['10 avancées IA majeures (démos live).', 'Méthode de veille perso 20 min/semaine, horizon 12-24 mois, modulable selon métier.', 'Abonnement annuel : 4 sessions/an.'],
    tools: 'Perplexity · Claude · Veille IA Axem · Newsletters', deliverables: ['Template Notion Veille IA', 'Liste 30 sources curées', 'Replays'] },
  { code: 'F10', title: 'Création IA — Visuel · Vidéo · Voix', level: 'PRODUCTION', duration: '1 J', price: '400 €', tagline: 'Produire 10× plus vite, à coût maîtrisé.',
    program: ['Matin · Images : Midjourney V7, DALL-E 4, Firefly 3, Nano Banana Pro · logos · infographies · sites en 1 h.', 'Après-midi · Vidéo & voix : Synthesia (140 avatars), ElevenLabs (voix clonée 3 min), Kling/Sora/Veo, repurposing (1 contenu = 8 formats).'],
    tools: 'Midjourney · Synthesia · ElevenLabs · Kling · Sora · Veo · CapCut AI', deliverables: ['Guide 30 Outils Créatifs IA 2026', 'Pack 50 Prompts Midjourney', 'Templates Gamma'] },
];
const LEVELS = ['Tous', 'SOCLE', 'MÉTIERS', 'AUTOMATISATION', 'TRANSVERSAL', 'PRODUCTION'] as const;

const FormationDetail: React.FC<{ f: Formation; onClose: () => void }> = ({ f, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${f.code} ${f.title}`}
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-cream/15 bg-ink-2 p-6 no-scrollbar sm:rounded-3xl md:p-9"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.35, ease }}>
        <button onClick={onClose} aria-label="Fermer" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream-soft transition hover:bg-cream/10 hover:text-cream">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-green px-2.5 py-1 font-display text-xs text-ink" style={{ fontWeight: 900 }}>{f.code}</span>
          <span className="rounded-md border border-green/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-green">{f.level}</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft">{f.duration} · {f.price}</span>
        </div>
        <h3 className="mt-4 font-display text-3xl text-cream tighter md:text-4xl" style={{ fontWeight: 900 }}>{f.title}</h3>
        <p className="mt-2 text-base text-green">{f.tagline}</p>

        <div className="mt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Programme</p>
          <ul className="space-y-2.5">
            {f.program.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-cream-soft md:text-[15px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Outils</p>
            <p className="text-sm text-cream-soft">{f.tools}</p>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Livrables</p>
            <ul className="space-y-1.5">
              {f.deliverables.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-cream-soft">
                  <svg className="h-3.5 w-3.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>{d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-cream/12 pt-6 sm:flex-row">
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green px-6 py-3 text-sm uppercase tracking-[0.04em] text-ink" style={{ fontWeight: 900 }}>
            Demander un devis OPCO →
          </Magnetic>
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.04em] text-cream transition hover:bg-cream/10">
            Nous écrire
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Formations: React.FC = () => {
  const [filter, setFilter] = useState<(typeof LEVELS)[number]>('Tous');
  const [open, setOpen] = useState<Formation | null>(null);
  const list = filter === 'Tous' ? FORMATIONS : FORMATIONS.filter((f) => f.level === filter);

  return (
    <section id="formation" className="border-t border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-green px-3 py-1 font-display text-sm text-ink" style={{ fontWeight: 900 }}>BLOC 1</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-green">Organisme de formation · Qualiopi</span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-5 font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.2vw, 116px)' }}>
            Le catalogue.<br /><span className="text-green">10 formations.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg text-cream-soft md:text-xl">
            3 niveaux · 70 % de pratique · certifiées Qualiopi · finançables OPCO. Inter ou intra, modulables en parcours sur-mesure.
            <span className="block mt-2 font-bold text-cream">200 € – 1 250 € HT / participant.</span>
          </p>
        </Reveal>

        {/* Filtres par niveau */}
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap gap-2">
            {LEVELS.map((lvl) => (
              <button key={lvl} type="button" onClick={() => setFilter(lvl)}
                className={`rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition ${filter === lvl ? 'border-green bg-green text-ink' : 'border-cream/20 text-cream-soft hover:border-cream/40 hover:text-cream'}`}>
                {lvl}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grille des formations */}
        <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((f, i) => (
              <motion.button key={f.code} layout type="button" onClick={() => setOpen(f)}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.2), ease }}
                className="group">
                <Spotlight className="flex h-full flex-col gap-3 rounded-2xl border border-cream/12 bg-ink p-6 text-left transition-colors hover:border-green/45">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl text-green tighter" style={{ fontWeight: 900 }}>{f.code}</span>
                    <span className="rounded border border-cream/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-cream-dim">{f.level}</span>
                  </div>
                  <h3 className="font-display text-xl text-cream md:text-[22px]" style={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05 }}>{f.title}</h3>
                  <p className="text-[13px] leading-snug text-cream-soft">{f.tagline}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-cream/10 pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft">{f.duration} · {f.price}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-green transition-transform group-hover:translate-x-0.5">Détail →</span>
                  </div>
                </Spotlight>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Coaching + Bootcamps + Vidéos */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col gap-2 rounded-2xl border border-cream/12 bg-ink p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Coaching individuel</span>
              <p className="font-display text-2xl text-cream" style={{ fontWeight: 800 }}>200 € / session</p>
              <p className="text-sm text-cream-soft">Pour vos profils clés — managers, dirigeants, référents IA. 1 session/semaine (1 h), réalisée par Clément ou Alexis.</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex h-full flex-col gap-2 rounded-2xl border border-cream/12 bg-ink p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Bootcamps immersifs</span>
              <p className="font-display text-2xl text-cream" style={{ fontWeight: 800 }}>Sur devis</p>
              <p className="text-sm text-cream-soft">Format intensif sur-mesure. B01 · IA & Social Media (3 j, 90 % pratique). B02 · Performance & Scale (+2 j d'extension).</p>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="flex h-full flex-col gap-2 rounded-2xl border border-cream/12 bg-ink p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Formations vidéos 24/7</span>
              <p className="font-display text-2xl text-cream" style={{ fontWeight: 800 }}>Sur devis</p>
              <p className="text-sm text-cream-soft">Masterclass complète accessible 24/7 — 40 à 45 vidéos HD, templates téléchargeables, idéale pour l'onboarding.</p>
            </div>
          </Reveal>
        </div>

        {/* FINANCEMENT OPCO + QUALIOPI */}
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-3xl border border-green/20 bg-gradient-to-br from-ink to-ink-3 p-7 md:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:gap-10">
              <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white p-5 lg:w-56">
                <img src="/logos/qualiopi-full.png" alt="Certification Qualiopi — Actions de formation" className="h-24 w-auto max-w-full object-contain" loading="lazy" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl text-cream md:text-3xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Vos formations financées par l'OPCO.</h3>
                <p className="mt-2 text-[15px] text-cream-soft md:text-base">Organisme certifié Qualiopi — prise en charge possible jusqu'à 100 %, interlocuteur unique côté Axem.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier les 3 formations les plus rentables.' },
                    { n: '02', t: 'Devis & dossier OPCO', d: 'Proposition sous 48 h, démarches simplifiées.' },
                    { n: '03', t: 'Formation', d: 'Équipes opérationnelles dès J+1, suivi post-formation.' },
                  ].map((s) => (
                    <div key={s.n} className="rounded-xl border border-cream/10 bg-ink-2 p-4">
                      <span className="font-display text-xl text-green" style={{ fontWeight: 900 }}>{s.n}</span>
                      <p className="mt-1 font-display text-sm text-cream" style={{ fontWeight: 700 }}>{s.t}</p>
                      <p className="mt-1 text-xs leading-relaxed text-cream-soft">{s.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>{open && <FormationDetail f={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
};

// =====================================================================
// BLOC 2 — CONSEIL & DÉPLOIEMENT (agence)
// =====================================================================
const Conseil: React.FC = () => {
  const services = [
    { n: '01', t: 'Audit IA', meta: '1 semaine', d: "Diagnostic, cartographie de vos process, scoring de maturité IA, roadmap priorisée. Un livrable de synthèse + recommandations concrètes." },
    { n: '02', t: 'Conseil stratégique', meta: 'Sur devis', d: "Roadmap priorisée par ROI, choix des outils & architecture, pilotage du déploiement. Ponctuel ou continu." },
    { n: '03', t: 'Automatisation', meta: '900 € – 2 000 €', d: "Des workflows qui tournent seuls. Option A clé en main (1 200-2 000 €) ou Option B abonnement suivi (900 € + 80 €/mois). n8n, Make, Claude Code." },
    { n: '04', t: 'Production IA', meta: 'Sur devis', d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Des assets produits 10× plus vite, à coût maîtrisé." },
    { n: '05', t: 'Suivi', meta: '80 € / mois', d: "Le déploiement n'est qu'un début. Maintenance, évolutions, nouvelles automatisations. Partenariat moyen : 12 mois +." },
  ];
  return (
    <section id="conseil" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-green/40 px-3 py-1 font-display text-sm text-green" style={{ fontWeight: 900 }}>BLOC 2</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-green">Agence · Conseil &amp; déploiement</span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-5 max-w-4xl font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.2vw, 116px)' }}>
            On ne forme pas que.<br /><span className="outline-green">On déploie.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg text-cream-soft md:text-xl">De l'audit à la production, on construit les solutions IA qui libèrent vos équipes des tâches répétitives — et on reste après.</p>
        </Reveal>

        <div className="mt-14 border-t border-cream/12">
          {services.map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 0.05}>
              <a href="#rdv" className="group block border-b border-cream/12 transition-colors hover:bg-ink-2">
                <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-7 md:grid-cols-[90px_1fr_auto] md:gap-x-8 md:py-9">
                  <span className="font-display text-xl text-green transition-transform duration-300 group-hover:translate-x-1 md:text-3xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  <h3 className="font-display leading-[0.98] text-cream transition-colors group-hover:text-green" style={{ fontWeight: 800, fontSize: 'clamp(24px, 3.8vw, 52px)', letterSpacing: '-0.03em' }}>{s.t}</h3>
                  <span className="col-span-2 text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft md:col-span-1 md:self-center md:whitespace-nowrap md:text-right">{s.meta}</span>
                  <p className="col-span-2 mt-1 max-w-2xl text-sm leading-relaxed text-cream-soft md:col-start-2 md:text-[15px]">{s.d}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// CAS CLIENTS — count-up + lien Notion
// =====================================================================
const Cases: React.FC = () => {
  const cases = [
    { sector: 'BTP · Chiffrage', value: 80, suffix: ' %', label: 'de temps de saisie économisé', detail: '95 k€/an de charge neutralisés sur l\'avant-vente · DPGF générés automatiquement (ERP Kalitics).' },
    { sector: 'Administration · OCR', value: 4, prefix: '×', label: 'plus rapide', detail: '3 h gagnées par dossier · 100 % de fiabilité par double vérification OCR/IA · +5 h/sem réaffectées.' },
    { sector: 'Industrie · Conformité ADV', value: 317, suffix: ' h', label: 'libérées par mois', detail: 'Dossier 15 min → 5 min · anomalies détectées > 98 % · hébergement Europe RGPD (ERP Proginov).' },
  ];
  const formations = [
    { name: 'ESPACE 2', tag: 'Promotion immobilière', d: 'Formation IA Direction & RH · charte d\'usage · roadmap 90 jours.' },
    { name: 'AVANTIS', tag: 'Conseil & expertise', d: 'Kit Journée IA par métier · 6 prompts sectoriels · adoption +60 %.' },
    { name: 'GRAVOTECH', tag: 'Industrie', d: 'Acculturation IA opérationnelle · 3 quick wins déployés en 30 jours.' },
    { name: 'CARREFOUR', tag: 'Distribution', d: 'Animation de formations IA · 1 journée Gemini au niveau groupe.' },
  ];
  return (
    <section id="cas-clients" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />5 missions · 5 secteurs</div></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.2vw, 118px)' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>

        {/* Chiffres avec count-up */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.1}>
              <Spotlight className="flex h-full flex-col gap-3 rounded-2xl border border-cream/12 bg-ink p-7 transition-colors hover:border-green/40 md:p-8">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">{c.sector}</span>
                <span className="font-display text-6xl text-cream tighter md:text-7xl" style={{ fontWeight: 900 }}>
                  <Counter value={c.value} prefix={c.prefix || ''} suffix={c.suffix || ''} />
                </span>
                <span className="text-sm font-bold text-cream">{c.label}</span>
                <p className="mt-1 text-sm leading-relaxed text-cream-soft">{c.detail}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        {/* Cas formation */}
        <Reveal delay={0.05}>
          <p className="mt-16 mb-6 text-[11px] font-bold uppercase tracking-[0.18em] text-cream-dim">Ils nous ont fait confiance en formation</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formations.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-2 rounded-xl border border-cream/12 bg-ink p-6">
                <span className="font-display text-lg text-cream" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{f.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-green">{f.tag}</span>
                <p className="mt-1 text-[13px] leading-relaxed text-cream-soft">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <a href={NOTION_URL} target="_blank" rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-green/40 bg-green/10 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-green transition hover:bg-green hover:text-ink">
            Voir tous les cas clients en détail
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// POURQUOI AXEM — 5 raisons
// =====================================================================
const Why: React.FC = () => {
  const reasons = [
    { n: '01', t: 'Partenaire sur la durée', d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff." },
    { n: '02', t: '70 % de pratique minimum', d: "Opérationnel dès J+1. Chaque formation produit un livrable réel." },
    { n: '03', t: 'Résultats mesurés', d: "ROI documenté, des livrables concrets — pas des slides." },
    { n: '04', t: 'Toujours à jour', d: "Outils & méthodes 2025/2026. On suit le rythme de l'IA, vous aussi." },
    { n: '05', t: 'Un seul interlocuteur', d: "Du diagnostic au déploiement, vous parlez toujours à Clément ou Alexis." },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.2vw, 116px)' }}>
            Pourquoi <span className="text-green">AXEM</span>.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.n} delay={(i % 3) * 0.06}>
              <Spotlight className="flex h-full flex-col gap-3 rounded-2xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:border-green/40 md:p-8">
                <span className="font-display text-4xl text-green tighter" style={{ fontWeight: 900 }}>{r.n}</span>
                <h3 className="font-display text-xl text-cream md:text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{r.t}</h3>
                <p className="text-sm leading-relaxed text-cream-soft md:text-[15px]">{r.d}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-10 text-sm text-cream-dim">Outils maîtrisés : OpenAI · Claude / Anthropic · Gemini · Mistral · Meta · DeepSeek · n8n · Make.</p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// CTA — Calendly inline
// =====================================================================
const FinalCTA: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '200px' });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!inView || loaded) return;
    const existing = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (existing) { setLoaded(true); return; }
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
  }, [inView, loaded]);

  return (
    <section id="rdv" ref={ref} className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Prochaine étape</div>
            <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.5vw, 120px)' }}>
              Démarrons par un<br /><span className="text-green">diagnostic gratuit.</span>
            </h2>
            <p className="mt-7 max-w-xl text-lg text-cream-soft md:text-xl">
              30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
            </p>
            <a href={`mailto:${EMAIL}`} className="mt-4 text-sm font-semibold text-green transition hover:text-cream">{EMAIL}</a>
          </div>
        </Reveal>

        {/* Widget Calendly inline */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-cream/12 bg-white">
            {loaded ? (
              <div className="calendly-inline-widget" data-url={CALENDLY_INLINE} style={{ minWidth: 320, height: 700 }} />
            ) : (
              <div className="flex h-[700px] flex-col items-center justify-center gap-5 bg-ink-2 p-8 text-center">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-cream/20 border-t-green" />
                <p className="text-sm text-cream-soft">Chargement du calendrier…</p>
                <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
                  className="inline-flex items-center gap-2 rounded-full bg-green px-7 py-3.5 text-sm uppercase tracking-[0.04em] text-ink" style={{ fontWeight: 900 }}>
                  Réserver un créneau →
                </Magnetic>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// FOOTER
// =====================================================================
const Footer: React.FC = () => (
  <footer className="border-t border-cream/10 bg-ink px-5 py-16 md:px-8">
    <div className="mx-auto max-w-[1400px]">
      <div className="font-display leading-[0.85] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(56px, 15vw, 240px)' }}>
        AXEM<span className="text-green">.</span>
      </div>
      <div className="mt-12 grid gap-10 border-t border-cream/12 pt-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-xs text-sm text-cream-soft">Votre partenaire IA, de A à Z. Agence d'IA &amp; organisme de formation certifié Qualiopi.</p>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
          <ul className="space-y-2 text-sm text-cream-soft">{NAV_LINKS.map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
            <li><a href={`mailto:${EMAIL}`} className="transition-colors hover:text-cream">{EMAIL}</a></li>
            <li>axem-ia.fr</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/12 pt-8 text-xs text-cream-dim md:flex-row">
        <span>© 2026 AXEM IA — Paris, France</span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Qualiopi · Finançable OPCO
        </span>
      </div>
    </div>
  </footer>
);

// =====================================================================
// BARRE DE PROGRESSION SCROLL
// =====================================================================
const ScrollBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return <motion.div className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-green" style={{ scaleX: sx }} aria-hidden />;
};

// =====================================================================
// PAGE
// =====================================================================
const Home: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-ink">
      <ScrollBar />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Problem />
        <Duo />
        <Method />
        <Formations />
        <Conseil />
        <Cases />
        <Why />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
