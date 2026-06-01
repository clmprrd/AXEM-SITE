import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, MotionConfig, useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — VARIANTE B « SCHÉMA VIVANT »
// Diagrammes animés · trait SVG qui se dessine au scroll · data-viz
// fond blueprint · dark #0F0F0F + mint #00FA9A + Archivo
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const NOTION_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const MAIL = 'contact@axem-ia.fr';
const ease = [0.16, 1, 0.3, 1] as const;

// =====================================================================
// BACKGROUND HERO — Grainient (OGL). Palette mint plus vive/lumineuse.
// =====================================================================
const PALETTES = {
  mint:   { color1: '#A8FFE0', color2: '#00FA9A', color3: '#0B6E62' }, // mint vif → émeraude → teal (marque, par défaut)
  iris:   { color1: '#8AB4FF', color2: '#8B5CF6', color3: '#C026D3' },
  ocean:  { color1: '#7DE3FF', color2: '#16C8C8', color3: '#1F5C8E' },
  sunset: { color1: '#FFD27A', color2: '#FF6B9D', color3: '#7A3DF5' },
} as const;
const DEFAULT_PALETTE: keyof typeof PALETTES = 'mint';
// hero plus vif : saturation/contraste relevés, grain léger
const GRAINIENT = {
  timeSpeed: 0.2, warpStrength: 1.0, warpFrequency: 5.0, warpSpeed: 2.0,
  warpAmplitude: 52.0, blendAngle: 0.0, blendSoftness: 0.05, rotationAmount: 500.0,
  noiseScale: 2.0, grainAmount: 0.1, grainScale: 1.5, grainAnimated: false,
  contrast: 1.55, gamma: 1.0, saturation: 1.18, zoom: 0.76,
} as const;

// ====================== HELPERS ======================
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; y?: number }> = ({ children, delay = 0, className, y = 28 }) => (
  <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
);

// Titre créatif — mask reveal mot par mot
const RiseWords: React.FC<{ text: string; className?: string; delay?: number; stagger?: number; highlight?: string }> = ({ text, className = '', delay = 0, stagger = 0.06, highlight }) => {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => {
        const hot = highlight && w.replace(/[.,]/g, '') === highlight;
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
            <motion.span className={`inline-block ${hot ? 'text-green' : ''}`}
              initial={{ y: '115%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: delay + i * stagger, ease }}>
              {w}{i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

const Magnetic: React.FC<any> = ({ children, strength = 0.32, className, ...props }) => {
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

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; className?: string; decimals?: number }> = ({ value, prefix = '', suffix = '', className, decimals = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const start = performance.now(); let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - start) / 1600); setN((1 - Math.pow(1 - k, 3)) * value); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const rounded = decimals ? n.toFixed(decimals) : Math.round(n).toString();
  const fmt = Math.round(n) >= 1000 ? Math.round(n).toLocaleString('fr-FR') : (decimals ? rounded.replace('.', ',') : rounded);
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

// Carte avec spotlight curseur + glow de bordure
const SpotCard: React.FC<{ children: React.ReactNode; className?: string; as?: any; [k: string]: any }> = ({ children, className = '', as: As = 'div', ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-200); const my = useMotionValue(-200);
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  const bg = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(420px circle at ${x}px ${y}px, rgba(0,250,154,0.14), transparent 60%)`);
  return (
    <As ref={ref}
      onMouseMove={(e: React.MouseEvent) => { if (reduce) return; const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
      onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      className={`relative overflow-hidden ${className}`} {...rest}>
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300" style={{ background: bg, opacity: on ? 1 : 0 }} />
      <span aria-hidden className={`pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-0'}`}
        style={{ boxShadow: 'inset 0 0 0 1px rgba(0,250,154,0.45)' }} />
      <div className="relative z-[1] h-full">{children}</div>
    </As>
  );
};

// Fond blueprint (grille 1px subtile) — réutilisable
const Blueprint: React.FC<{ className?: string; opacity?: number }> = ({ className = '', opacity = 0.06 }) => (
  <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`} style={{
    backgroundImage: `linear-gradient(rgba(0,250,154,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(0,250,154,${opacity}) 1px, transparent 1px)`,
    backgroundSize: '44px 44px',
    maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
    WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
  }} />
);

// Barre de progression de scroll (en haut)
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-green" style={{ scaleX: w }} />;
};

// ====================== NAV ======================
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 24); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-2xl tracking-tighter text-cream" style={{ fontWeight: 900 }}>
          AXEM<span className="text-green">.</span>
        </a>
        <div className="hidden items-center gap-9 md:flex">
          {[['Formation', '#formation'], ['Conseil', '#conseil'], ['Le duo', '#duo'], ['Méthode', '#methode'], ['Cas clients', '#cas']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href="#rdv" strength={0.3}
          className="group inline-flex items-center gap-1.5 bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] text-ink" style={{ fontWeight: 800 }}>
          Diagnostic gratuit <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ====================== 1 · HERO ======================
const Hero: React.FC = () => {
  const [pal, setPal] = useState<keyof typeof PALETTES>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('p');
      if (p && p in PALETTES) return p as keyof typeof PALETTES;
    }
    return DEFAULT_PALETTE;
  });

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-32 md:px-8">
      {/* BACKGROUND — Grainient mint vif */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0F0F0F]">
        <Grainient {...GRAINIENT} {...PALETTES[pal]} className="h-full w-full" />
      </div>
      {/* léger spot derrière le texte → lisibilité, fond reste lumineux */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(62% 46% at 50% 44%, rgba(7,10,9,0.52) 0%, rgba(7,10,9,0.2) 46%, transparent 72%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[26%]"
        style={{ background: 'linear-gradient(180deg, transparent, #0F0F0F)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24"
        style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.45), transparent)' }} />

      {/* SÉLECTEUR DE PALETTE (démo) */}
      <div className="fixed right-3 top-24 z-50 hidden flex-col gap-1 rounded-2xl border border-white/15 bg-black/45 p-2 backdrop-blur-md md:right-5 md:flex">
        <span className="px-1 pb-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-white/55">Fond hero</span>
        {(Object.keys(PALETTES) as (keyof typeof PALETTES)[]).map((k) => (
          <button key={k} type="button" onClick={() => setPal(k)}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${pal === k ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10'}`}>
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/30" style={{ background: PALETTES[k].color2 }} />
            {k}
          </button>
        ))}
      </div>

      {/* CONTENU */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/95 md:text-[11px]">On forme · on déploie · on reste</span>
          </div>
        </Reveal>

        {/* TITRE CRÉATIF — mask reveal mot-à-mot */}
        <h1 className="mt-7 font-display leading-[0.92] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.4)]"
          style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.6vw, 88px)' }}>
          <RiseWords text="L'IA, branchée" delay={0.06} />
          <br />
          <span className="relative inline-block whitespace-nowrap">
            <RiseWords text="sur vos résultats." delay={0.26} highlight="résultats" />
            <motion.span aria-hidden className="absolute -bottom-1.5 left-0 h-[0.1em] w-full origin-left rounded-full bg-green"
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.7, ease }} />
          </span>
        </h1>

        <Reveal delay={0.5}>
          <p className="mt-7 max-w-2xl font-display text-xl font-bold leading-snug text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.34)] md:text-2xl">
            On vous forme, on vous conseille, on déploie. <span className="text-green">Et on reste.</span>
          </p>
        </Reveal>

        <Reveal delay={0.58}>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.32)] md:text-base">
            Organisme de formation certifié <span className="font-semibold text-white">Qualiopi</span> et agence IA. De la montée en compétences de vos équipes à l'automatisation en production — un seul partenaire, du diagnostic à l'autonomie.
          </p>
        </Reveal>

        <Reveal delay={0.66}>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <Magnetic href="#rdv" strength={0.35}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.7)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Diagnostic gratuit</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#formation" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/15">
              Voir le catalogue <span aria-hidden>↓</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.74}>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/30 py-2 pl-2 pr-5 backdrop-blur-md">
            <div className="flex -space-x-2.5">
              <img src={CLEMENT_IMG} alt="Clément Predo" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/70" loading="lazy" />
              <img src={ALEXIS_IMG} alt="Alexis Zeitoun" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/70" loading="lazy" />
            </div>
            <span className="text-sm font-semibold text-white">
              <span className="text-green">+55 000</span> abonnés LinkedIn nous suivent
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ====================== Badge Qualiopi (SVG stylé blanc + tricolore) ======================
const QualiopiBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-3 rounded-xl border border-cream/15 bg-white px-4 py-3 shadow-sm ${className}`}>
    <svg className="h-9 w-9 shrink-0" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#0F1B3D" />
      {/* tricolore */}
      <rect x="10" y="16" width="9.3" height="16" fill="#0D2A8C" />
      <rect x="19.3" y="16" width="9.4" height="16" fill="#FFFFFF" />
      <rect x="28.7" y="16" width="9.3" height="16" fill="#E1000F" />
      <path d="M16 24l5.5 5.5L33 18" fill="none" stroke="#0F1B3D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className="leading-tight">
      <div className="font-display text-sm tracking-tight text-[#0F1B3D]" style={{ fontWeight: 900 }}>QUALIOPI</div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0F1B3D]/70">Processus certifié · République Française</div>
    </div>
  </div>
);

// ====================== 2 · TRUST (logos couleur sur cartes blanches) ======================
const LogoCard: React.FC<{ src?: string; alt: string; fallback?: boolean }> = ({ src, alt, fallback }) => (
  <div className="flex h-20 items-center justify-center rounded-xl border border-cream/10 bg-white px-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-green/40 hover:shadow-[0_10px_30px_-12px_rgba(0,250,154,0.35)]">
    {fallback || !src
      ? <span className="font-display text-base tracking-tight text-[#1A1A1A] md:text-lg" style={{ fontWeight: 800 }}>{alt}</span>
      : <img src={src} alt={alt} loading="lazy" decoding="async" className="max-h-10 w-auto max-w-[140px] object-contain" />}
  </div>
);

const Trust: React.FC = () => {
  const clients = [
    { src: '/logos/carrefour.svg', alt: 'Carrefour' },
    { src: '/logos/blackfin.png', alt: 'BlackFin Capital' },
    { src: '/logos/avantis.png', alt: 'Avantis' },
    { src: '/logos/kit.png', alt: 'KIT France' },
    { src: '/logos/espace2.png', alt: 'Espace 2' },
    { src: '/logos/socos.png', alt: 'Socos' },
    { src: '/logos/gravotech.png', alt: 'Gravotech' },
  ];
  const orgs = [
    { src: '/logos/myconnecting.png', alt: 'myconnecting' },
    { alt: 'synapse ia', fallback: true },
    { src: '/logos/asphere.png', alt: 'ASphere' },
    { src: '/logos/aisisters.svg', alt: 'AI Sisters' },
    { src: '/logos/senza.png', alt: 'SENZA Formations' },
    { src: '/logos/cegos.png', alt: 'Cegos' },
  ];
  return (
    <section id="references" className="relative border-y border-cream/10 bg-ink-2 px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green">Ils nous font confiance</p>
            <h2 className="mt-3 font-display text-3xl leading-[0.95] text-cream tight md:text-5xl" style={{ fontWeight: 900 }}>
              Des PME aux grands comptes<br />&amp; administrations.
            </h2>
          </Reveal>
          <Reveal delay={0.1}><QualiopiBadge /></Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cream-soft">
            <span className="h-px w-6 bg-green" />Clients
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {clients.map((l) => <LogoCard key={l.alt} {...l} />)}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mb-3 mt-10 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cream-soft">
            <span className="h-px w-6 bg-green" />Organismes de formation partenaires
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {orgs.map((l) => <LogoCard key={l.alt} {...l} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ====================== 3 · PROBLÈME (3 pièges) ======================
const Problem: React.FC = () => {
  const traps = [
    { n: '01', t: 'Formations théoriques', d: 'Vos équipes sont formées sur le papier… mais pas opérationnelles le lundi matin.' },
    { n: '02', t: 'Outils sans stratégie', d: 'Des licences achetées, aucune feuille de route. L’IA reste un gadget, pas un levier.' },
    { n: '03', t: 'Aucun suivi après coup', d: 'Le consultant part, les bonnes habitudes s’évaporent, les anciens réflexes reviennent.' },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Pourquoi la plupart échouent</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 110px)' }}>
            Trois pièges.<br /><span className="outline-type">Un parcours complet.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {traps.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.1}>
              <SpotCard className="group flex h-full flex-col gap-4 rounded-2xl border border-cream/12 bg-ink-2 p-8 transition-colors hover:border-green/30">
                <span className="font-display text-6xl text-cream/15 tighter md:text-7xl" style={{ fontWeight: 900 }}>{t.n}</span>
                <h3 className="font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>{t.t}</h3>
                <p className="text-base leading-relaxed text-cream-soft">{t.d}</p>
              </SpotCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-12 max-w-2xl text-lg text-cream-soft">
            Chez AXEM, l’IA n’est pas une intervention isolée. <span className="font-semibold text-cream">C’est un parcours complet</span> — de l’audit à l’autonomie.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ====================== 4 · DUO (remonté tôt) ======================
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. 3 ans de terrain IA : je traduis l'IA en résultats concrets et pilote les missions audit & stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production auprès des équipes et dirigeants. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="relative border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <Blueprint opacity={0.05} />
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Les fondateurs</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.88] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 7.6vw, 128px)' }}>
            Deux experts,<br /><span className="text-green">un seul interlocuteur.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}><p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
          Le stratège et l’ingénieur. Pas de relais qui se perd entre équipes : vous parlez directement à ceux qui livrent.
        </p></Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <SpotCard className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream/12 bg-ink transition-colors hover:border-green/40">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-lg bg-green text-ink shadow-lg transition-transform hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-7 md:p-9">
                  <div>
                    <h3 className="font-display text-3xl text-cream tighter md:text-4xl" style={{ fontWeight: 900 }}>{f.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-green">{f.school}</p>
                    <p className="text-sm text-cream-soft">{f.role}</p>
                  </div>
                  <p className="text-base leading-relaxed text-cream-soft">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-cream/12 pt-5">
                    <span className="font-display text-5xl text-cream" style={{ fontWeight: 900 }}><Counter value={f.n} prefix="+" /></span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </SpotCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-14 text-center font-display text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(36px, 6vw, 96px)' }}>
            Ensemble, <span className="text-green">+55 000</span> abonnés.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ====================== 5 · MÉTHODE (trait SVG qui se dessine au scroll) ======================
const Method: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.4'] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const steps = [
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  // nœuds s'allument à leur passage
  const nodeProgress = [0.12, 0.5, 0.88];
  return (
    <section id="methode" className="relative border-t border-cream/10 bg-ink px-5 py-28 md:px-8 md:py-36">
      <Blueprint opacity={0.05} />
      <div ref={ref} className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 7.6vw, 124px)' }}>
            En 3 étapes.<br /><span className="text-green">Pas une de plus.</span>
          </h2>
        </Reveal>

        {/* TRAIT SVG horizontal qui se dessine — desktop */}
        <div className="relative mt-20 hidden md:block">
          <svg className="absolute -top-6 left-0 h-24 w-full" viewBox="0 0 1200 80" fill="none" preserveAspectRatio="none" aria-hidden>
            <motion.path d="M40 40 H1160" stroke="rgba(250,250,247,0.12)" strokeWidth="2" />
            <motion.path d="M40 40 H1160" stroke="#00FA9A" strokeWidth="2.5" strokeLinecap="round"
              style={{ pathLength: reduce ? 1 : pathLength }} />
          </svg>
          <div className="grid grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <MethodNode key={s.n} step={s} progress={pathLength} threshold={nodeProgress[i]} reduce={!!reduce} />
            ))}
          </div>
        </div>

        {/* MOBILE — trait vertical statique lisible */}
        <div className="mt-16 grid gap-6 md:hidden">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-5 rounded-2xl border border-cream/12 bg-ink-2 p-6">
              <span className="font-display text-5xl text-green tighter" style={{ fontWeight: 900 }}>{s.n}</span>
              <div>
                <div className="mb-1 inline-block bg-green px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</div>
                <h3 className="font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-cream-soft">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MethodNode: React.FC<{ step: any; progress: any; threshold: number; reduce: boolean }> = ({ step, progress, threshold, reduce }) => {
  const [lit, setLit] = useState(reduce);
  useEffect(() => {
    if (reduce) { setLit(true); return; }
    const unsub = progress.on('change', (v: number) => { if (v >= threshold) setLit(true); });
    return () => unsub();
  }, [progress, threshold, reduce]);
  return (
    <div className="relative pt-12">
      {/* nœud sur le trait */}
      <div className="absolute -top-[2.7rem] left-1/2 -translate-x-1/2">
        <motion.span className="block h-4 w-4 rounded-full border-2 border-green"
          animate={{ backgroundColor: lit ? '#00FA9A' : 'rgba(15,15,15,1)', boxShadow: lit ? '0 0 0 6px rgba(0,250,154,0.18)' : '0 0 0 0 rgba(0,250,154,0)' }}
          transition={{ duration: 0.4 }} />
      </div>
      <motion.div animate={{ opacity: lit ? 1 : 0.45, y: lit ? 0 : 6 }} transition={{ duration: 0.5, ease }}
        className="flex h-full flex-col gap-3 rounded-2xl border border-cream/12 bg-ink-2 p-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="font-display text-6xl text-cream tighter" style={{ fontWeight: 900 }}>{step.n}</span>
          <span className="bg-green px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-ink" style={{ fontWeight: 900 }}>{step.meta}</span>
        </div>
        <h3 className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>{step.t}</h3>
        <p className="text-sm leading-relaxed text-cream-soft md:text-base">{step.d}</p>
      </motion.div>
    </div>
  );
};

// ====================== CATALOGUE FORMATION (data) ======================
type Formation = {
  code: string; title: string; level: 'SOCLE' | 'MÉTIERS' | 'AUTOMATISATION' | 'TRANSVERSAL' | 'PRODUCTION';
  duration: string; price: string; tag: string; bullets: string[]; deliverables: string[];
};
const FORMATIONS: Formation[] = [
  { code: 'F01', title: 'IA Essentielle', level: 'SOCLE', duration: '1 J', price: '300 €', tag: 'De zéro à opérationnel en 1 journée.',
    bullets: ['Matin — Comprendre l’IA : fonctionnement d’un LLM (sans jargon), RGPD, cas d’usage métier.', 'Après-midi — Pratiquer : prompt engineering RACF, 15 exercices sur cas réels, plan d’action J+1.', 'Outils : Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash · Perplexity.'],
    deliverables: ['Guide 50 Prompts par Métier', 'Charte d’usage IA', 'Fiche 3 Quick Wins J+1'] },
  { code: 'F02', title: 'Prompt Engineering Pro', level: 'SOCLE', duration: '½ J', price: '200 €', tag: 'Multiplier par 5 la qualité de ses outputs IA.',
    bullets: ['Techniques avancées : Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting.', '20 exercices chronométrés sur cas réels · bibliothèque de prompts d’équipe (Notion live).', 'Atelier final : 5 prompts signature.'],
    deliverables: ['Template Bibliothèque Prompts Notion', 'Fiche mémo Techniques Avancées'] },
  { code: 'F03', title: 'Maîtriser Claude', level: 'SOCLE', duration: '1 J', price: '450 €', tag: 'Devenir expert de l’IA qui pèse 70 % du Fortune 100.',
    bullets: ['Matin — Bases : Claude vs ChatGPT vs Gemini, modèles Sonnet 4.6 / Opus 4.6, Projects, Artifacts, Computer Use.', 'Après-midi — Expert : Claude Skills, MCP, Cowork & Sub-agents, atelier 3 Skills.', 'Outils : Claude Opus 4.6 · Sonnet 4.6 · Skills · MCP · Cowork.'],
    deliverables: ['Pack 10 Skills Axem', 'Guide Claude Power User', 'Charte d’usage Claude'] },
  { code: 'F04', title: 'IA pour tous les métiers', level: 'MÉTIERS', duration: '1 J', price: '400 €', tag: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    bullets: ['Modules : Direction & Stratégie · Marketing & Commercial · RH & Recrutement · Finance & Compta.', 'Juridique & Compliance · Service Client · Réseaux Sociaux & Brand · Créatif & Design.', 'Modules combinables, contenus 2026.'],
    deliverables: ['Playbook par module choisi', 'Prompts sectoriels validés'] },
  { code: 'F05', title: 'No-Code & Workflows', level: 'AUTOMATISATION', duration: '2 J', price: '800 €', tag: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    bullets: ['J1 — Make & n8n : 3 automatisations live (Formulaire→CRM · Email→Slack · RSS→LinkedIn), 1 workflow déployé avant 18h.', 'J2 — Intégrer Claude/GPT/Gemini, conditions/erreurs/boucles, projet final en prod.', 'Outils : Make · n8n · Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash.'],
    deliverables: ['10 templates Make & n8n prêts à cloner', 'Guide Connecter 50 outils'] },
  { code: 'F06', title: 'Agent IA sur-mesure', level: 'AUTOMATISATION', duration: '2 J', price: '1 250 €', tag: 'Un travailleur autonome qui agit seul, 24h/24.',
    bullets: ['J1 — Architecture : LLM + Mémoire + Outils + Planification, frameworks (n8n Agents, CrewAI, LangGraph), RAG, MCP.', 'J2 — Déploiement : 3 patterns business (Support 24/7 · SDR · Admin), Claude Skills, validation humaine, RGPD.', 'Prérequis : F05 ou pratique API.'],
    deliverables: ['Template Agent IA n8n/LangGraph', 'Guide 6 Architectures d’Agents', 'Checklist sécurité'] },
  { code: 'F07', title: 'Vibe Coding & Claude Code', level: 'AUTOMATISATION', duration: '1 J', price: '450 €', tag: 'Construire des outils sans coder, avec l’IA comme binôme.',
    bullets: ['Matin — Lovable / Bolt.new / v0 : app web en 1h, vibe coding structuré, atelier micro-outil métier.', 'Après-midi — Cursor IDE, Claude Code (CLI), workflows générer/tester/déployer, sécurité & gouvernance.', 'Outils : Cursor · Claude Code · Lovable · Bolt.new · v0 · GitHub Copilot.'],
    deliverables: ['Pack Prompts Vibe Coding', 'Guide Cursor & Claude Code', '3 mini-apps livrées'] },
  { code: 'F08', title: 'Gouvernance & AI Act', level: 'TRANSVERSAL', duration: '½ J', price: '250 €', tag: 'Cadrer ses usages IA en conformité.',
    bullets: ['AI Act 2026 (interdit/obligatoire), RGPD & IA (serveurs US OpenAI/Anthropic).', 'Construire sa charte IA + traçabilité, 5 cas pratiques live, matrice de risques.', 'Public : Direction, DPO, DSI, RH, Juristes.'],
    deliverables: ['Template Charte IA', 'Matrice de risques AI Act', 'Plan de conformité 90 jours'] },
  { code: 'F09', title: 'Veille IA', level: 'TRANSVERSAL', duration: '2 h', price: '80 € · 320 €/an', tag: 'Rester à jour sur un champ qui bouge tous les mois.',
    bullets: ['10 avancées IA majeures (démos live), méthode de veille perso 20 min/semaine.', 'Horizon 12-24 mois, modulable selon métier · abonnement annuel 4 sessions/an.', 'Outils : Perplexity · Claude · Veille IA Axem · Newsletters.'],
    deliverables: ['Template Notion Veille IA', 'Liste 30 sources curées', 'Replays'] },
  { code: 'F10', title: 'Création IA — Visuel · Vidéo · Voix', level: 'PRODUCTION', duration: '1 J', price: '400 €', tag: 'Produire 10× plus vite, à coût maîtrisé.',
    bullets: ['Matin (images) : Midjourney V7, DALL-E 4, Firefly 3, Nano Banana Pro · logos · infographies · sites 1h.', 'Après-midi (vidéo & voix) : Synthesia, ElevenLabs (voix clonée), Kling/Sora/Veo, repurposing 1 contenu = 8 formats.', 'Livrables créatifs prêts à l’emploi.'],
    deliverables: ['Guide 30 Outils Créatifs IA 2026', 'Pack 50 Prompts Midjourney', 'Templates Gamma'] },
];
const LEVELS = ['Tous', 'SOCLE', 'MÉTIERS', 'AUTOMATISATION', 'TRANSVERSAL', 'PRODUCTION'] as const;
const LEVEL_COLOR: Record<string, string> = {
  SOCLE: 'text-green border-green/40', MÉTIERS: 'text-sky-300 border-sky-300/40',
  AUTOMATISATION: 'text-violet-300 border-violet-300/40', TRANSVERSAL: 'text-amber-300 border-amber-300/40',
  PRODUCTION: 'text-pink-300 border-pink-300/40',
};

// ====================== 6 · BLOC 1 — FORMATION ======================
const FormationBlock: React.FC = () => {
  const [level, setLevel] = useState<typeof LEVELS[number]>('Tous');
  const [open, setOpen] = useState<string | null>(null);
  const list = level === 'Tous' ? FORMATIONS : FORMATIONS.filter((f) => f.level === level);
  return (
    <section id="formation" className="relative px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-green">
            Bloc 1 · Organisme de formation Qualiopi
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 7.6vw, 128px)' }}>
            On forme<br />vos équipes.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            10 formations · 3 niveaux · <span className="font-semibold text-cream">70 % de pratique</span>. Construites de A à Z selon vos besoins. 200 € – 1 250 € / pers. Finançables OPCO.
          </p>
        </Reveal>

        {/* Filtres par niveau */}
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button key={l} type="button" onClick={() => setLevel(l)}
                className={`rounded-full border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] transition ${level === l ? 'border-green bg-green text-ink' : 'border-cream/15 text-cream-soft hover:border-cream/40 hover:text-cream'}`}>
                {l}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Catalogue */}
        <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((f) => (
              <motion.div key={f.code} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease }}>
                <SpotCard
                  as="button"
                  onClick={() => setOpen(f.code)}
                  className="group flex h-full w-full flex-col gap-3 rounded-2xl border border-cream/12 bg-ink-2 p-6 text-left transition-colors hover:border-green/40">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm text-green" style={{ fontWeight: 900 }}>{f.code}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${LEVEL_COLOR[f.level]}`}>{f.level}</span>
                  </div>
                  <h3 className="font-display text-xl leading-tight text-cream tight md:text-2xl" style={{ fontWeight: 800 }}>{f.title}</h3>
                  <p className="text-sm leading-snug text-cream-soft">{f.tag}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-cream/12 pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft">{f.duration} · {f.price}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-green opacity-0 transition group-hover:opacity-100">Détails →</span>
                  </div>
                </SpotCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Coaching · Bootcamps · Vidéos */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { t: 'Coaching individuel', p: '200 € / session', d: 'Pour managers, dirigeants et référents IA. 1 session/semaine, par Clément ou Alexis. On ancre les compétences dans la durée.' },
            { t: 'Bootcamps immersifs', p: 'Sur devis', d: 'IA & Social Media (3 j, 90 % pratique sur vos données) + extension Performance & Scale. 20-30 posts créés, calendrier automatisé.' },
            { t: 'Formations vidéos 24/7', p: 'Sur devis', d: '40-45 vidéos HD pas-à-pas, cas d’usage métiers, templates & prompts sectoriels. Idéal onboarding nouvelle recrue.' },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <SpotCard className="flex h-full flex-col gap-2 rounded-2xl border border-cream/12 bg-ink p-6 transition-colors hover:border-green/30">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-lg text-cream tight" style={{ fontWeight: 800 }}>{c.t}</h4>
                  <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.08em] text-green">{c.p}</span>
                </div>
                <p className="text-sm leading-relaxed text-cream-soft">{c.d}</p>
              </SpotCard>
            </Reveal>
          ))}
        </div>

        {/* Financement OPCO + Qualiopi */}
        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-cream/12 bg-ink-2 p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-green">Financement</p>
                <h3 className="mt-2 font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>Formations finançables OPCO.</h3>
                <p className="mt-2 max-w-xl text-sm text-cream-soft">Organisme certifié Qualiopi. Prise en charge possible jusqu’à 100 %, un interlocuteur unique côté AXEM.</p>
              </div>
              <QualiopiBadge />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['01', 'Diagnostic gratuit', '30 min pour identifier les 3 formations les plus rentables.'],
                ['02', 'Devis & dossier OPCO', 'Proposition sous 48h, démarches simplifiées, prise en charge OPCO.'],
                ['03', 'Formation', 'Équipes opérationnelles dès J+1, livrables concrets, suivi post-formation.'],
              ].map(([n, t, d]) => (
                <div key={n} className="rounded-xl border border-cream/10 bg-ink p-5">
                  <span className="font-display text-3xl text-green tighter" style={{ fontWeight: 900 }}>{n}</span>
                  <h4 className="mt-2 font-display text-base text-cream tight" style={{ fontWeight: 800 }}>{t}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-cream-soft">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* MODALE DÉTAIL FORMATION */}
      <FormationModal formation={FORMATIONS.find((f) => f.code === open) || null} onClose={() => setOpen(null)} />
    </section>
  );
};

const FormationModal: React.FC<{ formation: Formation | null; onClose: () => void }> = ({ formation, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (formation) { document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [formation, onClose]);
  return (
    <AnimatePresence>
      {formation && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div role="dialog" aria-modal="true" aria-label={formation.title}
            initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.98 }} transition={{ duration: 0.35, ease }}
            className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-cream/15 bg-ink-2 p-8 sm:rounded-3xl md:p-10">
            <button type="button" onClick={onClose} aria-label="Fermer" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream-soft transition hover:border-green/50 hover:text-green">✕</button>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm text-green" style={{ fontWeight: 900 }}>{formation.code}</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${LEVEL_COLOR[formation.level]}`}>{formation.level}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft">{formation.duration} · {formation.price}</span>
            </div>
            <h3 className="mt-4 font-display text-3xl text-cream tighter md:text-4xl" style={{ fontWeight: 900 }}>{formation.title}</h3>
            <p className="mt-2 text-lg text-green">{formation.tag}</p>
            <div className="mt-6 space-y-3">
              {formation.bullets.map((b, i) => (
                <div key={i} className="flex gap-3 text-sm leading-relaxed text-cream-soft md:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{b}
                </div>
              ))}
            </div>
            <div className="mt-7 border-t border-cream/12 pt-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-green">Livrables</p>
              <div className="flex flex-wrap gap-2">
                {formation.deliverables.map((d) => (
                  <span key={d} className="rounded-full border border-cream/15 bg-ink px-3 py-1.5 text-[12px] text-cream-soft">{d}</span>
                ))}
              </div>
            </div>
            <a href="#rdv" onClick={onClose} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-green px-6 py-3.5 text-sm uppercase tracking-[0.04em] text-ink transition hover:brightness-110 sm:w-auto" style={{ fontWeight: 900 }}>
              Demander un devis OPCO →
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ====================== ServiceDiagram (mini-diagrammes SVG par service) ======================
const ServiceDiagram: React.FC<{ kind: 'audit' | 'conseil' | 'automatisation' | 'production' | 'suivi'; play: boolean; reduce: boolean }> = ({ kind, play, reduce }) => {
  const animate = play || reduce;
  const draw = (d: number = 0) => reduce
    ? { pathLength: 1 }
    : { pathLength: animate ? 1 : 0, transition: { duration: 1, delay: d, ease } };

  const common = { width: '100%', height: '100%', viewBox: '0 0 120 120', fill: 'none' as const };
  if (kind === 'audit') {
    // radar / scan
    return (
      <svg {...common} aria-hidden>
        {[18, 32, 46].map((r) => <circle key={r} cx="60" cy="60" r={r} stroke="rgba(0,250,154,0.25)" strokeWidth="1" />)}
        <line x1="60" y1="14" x2="60" y2="106" stroke="rgba(0,250,154,0.18)" />
        <line x1="14" y1="60" x2="106" y2="60" stroke="rgba(0,250,154,0.18)" />
        <motion.line x1="60" y1="60" x2="60" y2="16" stroke="#00FA9A" strokeWidth="2" strokeLinecap="round"
          style={{ originX: '60px', originY: '60px' }} animate={animate ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 2.4, repeat: animate ? Infinity : 0, ease: 'linear' }} />
        <motion.polygon points="60,30 84,58 70,86 44,80 40,50" fill="rgba(0,250,154,0.12)" stroke="#00FA9A" strokeWidth="1.5"
          initial={{ opacity: 0 }} animate={{ opacity: animate ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.4 }} />
      </svg>
    );
  }
  if (kind === 'conseil') {
    // arbre de décision
    return (
      <svg {...common} aria-hidden>
        <motion.path d="M60 18 V40 M60 40 H30 V62 M60 40 H90 V62 M30 62 V84 M90 62 V84 M90 62 H110" stroke="#00FA9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={draw()} />
        {[[60, 16], [30, 84], [90, 84]].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="6" fill="#0F0F0F" stroke="#00FA9A" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: animate ? 1 : 0 }} transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 260, damping: 16 }} />
        ))}
      </svg>
    );
  }
  if (kind === 'automatisation') {
    // workflow de nœuds + point qui circule
    const path = 'M20 60 H46 M74 60 H100 M60 60 m0 0';
    return (
      <svg {...common} aria-hidden>
        <line x1="26" y1="60" x2="94" y2="60" stroke="rgba(0,250,154,0.25)" strokeWidth="2" />
        {[20, 60, 100].map((x) => <rect key={x} x={x - 9} y="51" width="18" height="18" rx="4" fill="#0F0F0F" stroke="#00FA9A" strokeWidth="2" />)}
        <motion.circle r="4" fill="#00FA9A"
          initial={{ cx: 20, cy: 60 }} animate={animate ? { cx: [20, 60, 100], cy: 60 } : { cx: 20, cy: 60 }}
          transition={{ duration: 2, repeat: animate ? Infinity : 0, ease: 'easeInOut' }} />
        <path d="M20 60 v-22 h40" stroke="rgba(0,250,154,0.18)" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }
  if (kind === 'production') {
    // grille d'assets qui se génèrent
    return (
      <svg {...common} aria-hidden>
        {[[24, 24], [62, 24], [24, 62], [62, 62]].map(([x, y], i) => (
          <motion.rect key={i} x={x} y={y} width="34" height="34" rx="5" fill="rgba(0,250,154,0.08)" stroke="#00FA9A" strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: animate ? 1 : 0, scale: animate ? 1 : 0.6 }} transition={{ delay: i * 0.18, duration: 0.5, ease }} />
        ))}
        <motion.path d="M30 41 l8 8 l12 -14" stroke="#00FA9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" initial={{ pathLength: 0 }} animate={draw(0.7)} />
      </svg>
    );
  }
  // suivi — dashboard / sparkline + jauge
  return (
    <svg {...common} aria-hidden>
      <motion.path d="M16 88 L36 70 L52 80 L72 48 L92 58 L104 34" stroke="#00FA9A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" initial={{ pathLength: 0 }} animate={draw()} />
      <motion.path d="M16 88 L36 70 L52 80 L72 48 L92 58 L104 34 V104 H16 Z" fill="rgba(0,250,154,0.1)" initial={{ opacity: 0 }} animate={{ opacity: animate ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.6 }} />
      {[16, 104].map((y) => <line key={y} x1="16" y1={y} x2="104" y2={y} stroke="rgba(250,250,247,0.08)" />)}
    </svg>
  );
};

// ====================== 7 · BLOC 2 — CONSEIL & DÉPLOIEMENT ======================
const ServiceRow: React.FC<{ s: any; i: number }> = ({ s, i }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  return (
    <Reveal delay={(i % 2) * 0.06}>
      <SpotCard
        ref={ref as any}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="group grid grid-cols-[88px_1fr] items-start gap-5 rounded-2xl border border-cream/12 bg-ink p-6 transition-colors hover:border-green/40 md:grid-cols-[120px_1fr_auto] md:gap-8 md:p-8">
        <div className="aspect-square w-full max-w-[88px] md:max-w-[120px]">
          <ServiceDiagram kind={s.kind} play={inView || hover} reduce={!!reduce} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-sm text-green" style={{ fontWeight: 900 }}>{s.n}</span>
            <h3 className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>{s.t}</h3>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream-soft md:text-base">{s.d}</p>
          {s.detail && <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-cream-dim">{s.detail}</p>}
        </div>
        <span className="col-span-2 mt-1 text-[12px] font-bold uppercase tracking-[0.1em] text-green md:col-span-1 md:self-center md:whitespace-nowrap">{s.price}</span>
      </SpotCard>
    </Reveal>
  );
};

const ConseilBlock: React.FC = () => {
  const services = [
    { n: '01', t: 'Audit IA', kind: 'audit', price: '1 semaine · sur devis', d: 'On regarde avant de déployer. Diagnostic, cartographie des process, scoring de maturité, roadmap priorisée.', detail: 'Analyse → Opportunités scorées → Roadmap 3-12 mois → Livrable de synthèse.' },
    { n: '02', t: 'Conseil stratégique', kind: 'conseil', price: 'Sur devis', d: 'On décide quoi faire, dans quel ordre, avec quels budgets. Cadrage, arbitrages, choix des outils, pilotage.', detail: 'Accompagnement décisionnel · architecture & stack · conduite du changement · missions sur mesure.' },
    { n: '03', t: 'Déploiement & automatisation', kind: 'automatisation', price: '1 200 € – 2 000 € · ou 900 € + 80 €/mois', d: 'Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou abonnement suivi.', detail: 'Option A — délivrable clé en main (construit, testé, déployé, documenté). Option B — abonnement suivi (maintenance + évolutions, référent dédié).' },
    { n: '04', t: 'Production IA', kind: 'production', price: 'Sur devis', d: 'Vidéos avatar IA, voix clonée, visuels, sites no-code, présentations. Des assets produits 10× plus vite.', detail: 'Au livrable, à coût maîtrisé.' },
    { n: '05', t: 'Suivi', kind: 'suivi', price: '80 € / mois', d: 'Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. La relation devient long terme.', detail: 'Durée moyenne d’un partenariat : 12 mois +. « Le déploiement n’est qu’un début. »' },
  ];
  return (
    <section id="conseil" className="relative border-t border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <Blueprint opacity={0.05} />
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cream-soft">
            Bloc 2 · Agence · Conseil & déploiement
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 7.6vw, 128px)' }}>
            On conseille,<br />on <span className="text-green">déploie</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            De l’audit à l’automatisation en production. Cinq prestations qui s’enchaînent — schématisées, pas survendues.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4">
          {services.map((s, i) => <ServiceRow key={s.n} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
};

// ====================== 8 · CAS CLIENTS (data-viz) ======================
const BarCompare: React.FC<{ before: number; after: number; play: boolean; reduce: boolean }> = ({ before, after, play, reduce }) => {
  const on = play || reduce;
  return (
    <div className="flex items-end gap-4">
      {[{ v: before, l: 'Avant', c: 'bg-cream/20' }, { v: after, l: 'Après', c: 'bg-green' }].map((b) => (
        <div key={b.l} className="flex w-full flex-col items-center gap-2">
          <div className="flex h-28 w-full items-end overflow-hidden rounded-md bg-ink">
            <motion.div className={`w-full ${b.c}`} initial={{ height: 0 }} animate={{ height: on ? `${b.v}%` : 0 }} transition={{ duration: 1, ease }} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-cream-soft">{b.l}</span>
        </div>
      ))}
    </div>
  );
};

const Ring: React.FC<{ pct: number; play: boolean; reduce: boolean; label: string }> = ({ pct, play, reduce, label }) => {
  const on = play || reduce;
  const r = 42; const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={r} stroke="rgba(250,250,247,0.1)" strokeWidth="8" fill="none" />
        <motion.circle cx="50" cy="50" r={r} stroke="#00FA9A" strokeWidth="8" strokeLinecap="round" fill="none"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: on ? c - (c * pct) / 100 : c }} transition={{ duration: 1.4, ease }} />
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-cream-soft">{label}</span>
    </div>
  );
};

const Cases: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const cases = [
    { sector: 'BTP · Chiffrage automatisé', title: 'Note de débours générée par IA', viz: 'bar' as const, before: 100, after: 20, kpi: 80, kpiSuffix: ' %', kpiLabel: 'de temps de saisie économisé', extra: '95 k€/an de charge avant-vente neutralisée · intégration ERP KALITICS.' },
    { sector: 'Administration · OCR + IA', title: 'Audit documentaire automatisé', viz: 'ring' as const, ringPct: 100, kpi: 4, kpiPrefix: '×', kpiLabel: 'plus rapide (3 h gagnées/dossier)', extra: '100 % de fiabilité par double vérification · +5 h/semaine/collab réaffectées.' },
    { sector: 'Aéronautique · Conformité ADV', title: 'Comparaison BC vs AR automatisée', viz: 'gauge' as const, gauge: 98, kpi: 317, kpiSuffix: ' h', kpiLabel: 'libérées par mois', extra: 'Anomalies détectées > 98 % · hébergement Europe RGPD, ERP Proginov.' },
  ];
  return (
    <section id="cas" className="relative px-5 py-28 md:px-8 md:py-36" ref={ref}>
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />5 missions · 5 secteurs</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.1}>
              <SpotCard className="flex h-full flex-col gap-5 rounded-2xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:border-green/40">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-green">{c.sector}</span>
                <h3 className="font-display text-xl text-cream tight" style={{ fontWeight: 800 }}>{c.title}</h3>
                <div className="py-2">
                  {c.viz === 'bar' && <BarCompare before={c.before!} after={c.after!} play={inView} reduce={!!reduce} />}
                  {c.viz === 'ring' && <Ring pct={c.ringPct!} play={inView} reduce={!!reduce} label="fiabilité" />}
                  {c.viz === 'gauge' && <Ring pct={c.gauge!} play={inView} reduce={!!reduce} label="> 98 % détection" />}
                </div>
                <div className="flex items-baseline gap-2 border-t border-cream/12 pt-4">
                  <span className="font-display text-6xl text-cream tighter" style={{ fontWeight: 900 }}>
                    <Counter value={c.kpi} prefix={(c as any).kpiPrefix || ''} suffix={(c as any).kpiSuffix || ''} />
                  </span>
                </div>
                <p className="-mt-2 text-[12px] font-bold uppercase tracking-[0.08em] text-cream-soft">{c.kpiLabel}</p>
                <p className="mt-auto text-sm leading-relaxed text-cream-soft">{c.extra}</p>
              </SpotCard>
            </Reveal>
          ))}
        </div>

        {/* Cas clients formation */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['ESPACE 2', 'Promotion immobilière', 'Upskilling Direction & RH · charte IA · roadmap 90 jours'],
            ['AVANTIS', 'Conseil & expertise', 'Kit Journée IA par métier · 6 prompts validés · +60 % adoption'],
            ['GRAVOTECH', 'Industrie', 'Acculturation IA opérationnelle · 3 quick wins en 30 jours'],
            ['CARREFOUR', 'Grand compte', 'Animation formations IA · Gemini au niveau groupe'],
          ].map(([n, s, d]) => (
            <Reveal key={n} delay={0.04}>
              <div className="flex h-full flex-col gap-1 rounded-xl border border-cream/10 bg-ink p-5">
                <span className="font-display text-lg text-cream tight" style={{ fontWeight: 800 }}>{n}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-green">{s}</span>
                <p className="mt-1 text-[13px] leading-relaxed text-cream-soft">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <a href={NOTION_URL} target="_blank" rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-3 rounded-full border border-green/40 bg-green/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-green transition hover:bg-green/10">
            Voir tous les cas clients en détail
            <span className="transition-transform group-hover:translate-x-1">↗</span>
          </a>
          <p className="mt-3 text-[13px] text-cream-dim">Méthodologies, livrables, retours d’expérience et résultats détaillés.</p>
        </Reveal>
      </div>
    </section>
  );
};

// ====================== 9 · POURQUOI AXEM ======================
const Why: React.FC = () => {
  const reasons = [
    ['01', 'Partenaire sur la durée', 'De l’audit à l’autonomie. On ne disparaît pas après le kickoff.'],
    ['02', '70 % de pratique minimum', 'Opérationnel dès J+1. Chaque formation produit un livrable réel.'],
    ['03', 'Résultats mesurés', 'ROI documenté. Des livrables concrets, pas des slides.'],
    ['04', 'Toujours à jour', 'Outils & méthodes 2025/2026. Claude, GPT, Gemini, Mistral, n8n, Make…'],
    ['05', 'Un seul interlocuteur', 'Du diagnostic au déploiement. Vous parlez à ceux qui livrent.'],
  ];
  return (
    <section className="border-t border-cream/10 bg-ink px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
            Pourquoi <span className="text-green">AXEM</span> ?
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-cream/12 bg-cream/12 md:grid-cols-3">
          {reasons.map(([n, t, d], i) => (
            <Reveal key={n} delay={(i % 3) * 0.06}>
              <SpotCard className="flex h-full flex-col gap-3 bg-ink p-8 transition-colors hover:bg-ink-2 md:p-9">
                <span className="font-display text-5xl text-green tighter" style={{ fontWeight: 900 }}>{n}</span>
                <h3 className="font-display text-xl text-cream tight md:text-2xl" style={{ fontWeight: 800 }}>{t}</h3>
                <p className="text-sm leading-relaxed text-cream-soft md:text-base">{d}</p>
              </SpotCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ====================== 10 · CTA — Calendly inline ======================
const FinalCTA: React.FC = () => {
  useEffect(() => {
    const id = 'calendly-widget-script';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id; s.src = 'https://assets.calendly.com/assets/external/widget.js'; s.async = true;
    document.body.appendChild(s);
  }, []);
  return (
    <section id="rdv" className="relative border-t border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <Blueprint opacity={0.05} />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Rendez-vous</div></Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display leading-[0.88] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 6.6vw, 96px)' }}>
                Démarrons par un<br /><span className="text-green">diagnostic gratuit.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-md text-lg text-cream-soft">30 minutes pour identifier vos <span className="font-semibold text-cream">3 leviers IA prioritaires</span>. Pas un commercial — directement Clément ou Alexis.</p>
            </Reveal>
            <Reveal delay={0.22}>
              <a href={`mailto:${MAIL}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cream transition hover:text-green">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                {MAIL}
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-2xl border border-cream/12 bg-ink">
              <div className="calendly-inline-widget" data-url={CALENDLY} style={{ minWidth: 320, height: 700 }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// ====================== FOOTER ======================
const Footer: React.FC = () => (
  <footer className="border-t border-cream/10 bg-ink px-5 py-16 md:px-8">
    <div className="mx-auto max-w-[1400px]">
      <div className="font-display leading-[0.85] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(64px, 16vw, 260px)' }}>
        AXEM<span className="text-green">.</span>
      </div>
      <div className="mt-12 grid gap-10 border-t border-cream/12 pt-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-xs text-sm text-cream-soft">L’IA, branchée sur vos résultats. Organisme de formation certifié Qualiopi & agence IA.</p>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
          <ul className="space-y-2 text-sm text-cream-soft">{[['Formation', '#formation'], ['Conseil', '#conseil'], ['Le duo', '#duo'], ['Méthode', '#methode'], ['Cas clients', '#cas']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href="#rdv" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
            <li><a href={`mailto:${MAIL}`} className="transition-colors hover:text-cream">{MAIL}</a></li>
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

const Home: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-ink">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Problem />
        <Duo />
        <Method />
        <FormationBlock />
        <ConseilBlock />
        <Cases />
        <Why />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
