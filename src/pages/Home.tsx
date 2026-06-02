import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useScroll, useInView, useReducedMotion, MotionConfig,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — V3 « DUO FONDATEURS »
// Hero 2 colonnes (texte + duo en star) · formation d'abord, conseil ensuite
// dark #0F0F0F + mint #00FA9A + Archivo · effets dosés (transform/opacity/SVG)
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_INLINE = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const NOTION_CASES = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const CONTACT_MAIL = 'contact@axem-ia.fr';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// Grainient — palette MINT lumineuse pour le hero (vif mais lisible)
const HERO_PALETTE = { color1: '#9BFFD9', color2: '#00E0A4', color3: '#0E5C57' };
const GRAINIENT = {
  timeSpeed: 0.16, warpStrength: 1.0, warpFrequency: 5.0, warpSpeed: 2.0,
  warpAmplitude: 50.0, blendAngle: 0.0, blendSoftness: 0.05, rotationAmount: 500.0,
  noiseScale: 2.0, grainAmount: 0.1, grainScale: 1.5, grainAnimated: false,
  contrast: 1.45, gamma: 1.0, saturation: 1.05, zoom: 0.8,
} as const;

// ---------- helpers ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
);

// Titre hero : mask-reveal mot à mot
const RiseWords: React.FC<{ text: string; className?: string; delay?: number; stagger?: number }> = ({ text, className = '', delay = 0, stagger = 0.08 }) => {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.06em]" aria-hidden>
          <motion.span className="inline-block"
            initial={{ y: '115%' }} animate={{ y: 0 }}
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
  const rounded = decimals > 0 ? n.toFixed(decimals) : Math.round(n);
  const fmt = Number(rounded) >= 1000 ? Number(rounded).toLocaleString('fr-FR') : String(rounded).replace('.', ',');
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

// Carte avec spotlight curseur (transform/opacity only — fallback mobile : pas de hover)
const Spotlight: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -200, y: -200, on: false });
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => setPos((p) => ({ ...p, on: false }))} className={`group relative overflow-hidden ${className}`}>
      <div aria-hidden className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, rgba(0,250,154,0.14), transparent 60%)`, opacity: pos.on ? 1 : 0 }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// ---------- BARRE DE PROGRESSION SCROLL ----------
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-green" style={{ scaleX: sx }} />;
};

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 24); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  const links = [['Formation', '#formation'], ['Conseil', '#conseil'], ['Le duo', '#duo'], ['Cas clients', '#cas'], ['Méthode', '#methode']] as const;
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-2xl tracking-tighter text-cream" style={{ fontWeight: 900 }}>
          AXEM<span className="text-green">.</span>
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.1em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href="#rdv" strength={0.3}
          className="group inline-flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.04em] text-ink" style={{ fontWeight: 800 }}>
          Diagnostic gratuit <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------- HERO « DUO FONDATEURS » : 2 colonnes ----------
const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-20 pt-28 md:px-8 md:pt-32">
      {/* BACKGROUND — Grainient mint lumineux */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0F0F0F]">
        <Grainient {...GRAINIENT} {...HERO_PALETTE} className="h-full w-full" />
      </div>
      {/* lisibilité : voile sombre gauche (sous le texte) + halo bas/haut */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(100deg, rgba(8,10,9,0.82) 0%, rgba(8,10,9,0.55) 38%, rgba(8,10,9,0.12) 64%, transparent 100%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[26%]"
        style={{ background: 'linear-gradient(180deg, transparent, #0F0F0F)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24"
        style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.5), transparent)' }} />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* COLONNE GAUCHE — texte */}
        <div className="flex flex-col items-start text-left">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-green/40 bg-green/10 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white md:text-[11px]">Deux fondateurs · un seul interlocuteur</span>
          </motion.div>

          <h1 className="mt-6 font-display leading-[0.92] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]"
            style={{ fontWeight: 900, fontSize: 'clamp(40px, 6.4vw, 92px)' }}>
            <RiseWords text="Votre partenaire IA," delay={0.1} />
            <br />
            <span className="relative inline-block">
              <RiseWords text="de A à Z." delay={0.34} />
              <motion.span aria-hidden initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.85, ease }}
                className="absolute -bottom-1 left-0 h-[0.1em] w-full origin-left rounded-full bg-green" />
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6, ease }}
            className="mt-7 max-w-xl font-display text-xl font-bold leading-snug text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] md:text-2xl">
            On vous forme, on vous conseille, on déploie. <span className="text-green">Et on reste.</span>
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.72, ease }}
            className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)] md:text-base">
            Agence d'IA générative &amp; organisme de formation certifié <span className="font-semibold text-white">Qualiopi</span>. De l'audit à la montée en compétences de vos équipes.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.84, ease }}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Magnetic href="#rdv" strength={0.3}
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-green px-7 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.7)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Diagnostic gratuit</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#formation" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-4 text-sm font-bold uppercase tracking-[0.05em] text-white backdrop-blur-sm transition hover:bg-white/15">
              Voir les formations <span aria-hidden>↓</span>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 1, ease }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/70">
            <span className="inline-flex items-center gap-1.5"><Check /> 70 % de pratique</span>
            <span className="inline-flex items-center gap-1.5"><Check /> Finançable OPCO</span>
            <span className="inline-flex items-center gap-1.5"><Check /> Opérationnel dès J+1</span>
          </motion.div>
        </div>

        {/* COLONNE DROITE — le DUO en grand */}
        <div className="relative">
          {/* halo mint derrière les cartes */}
          <div aria-hidden className="pointer-events-none absolute -inset-6 -z-0 rounded-[40px] opacity-70 blur-2xl"
            style={{ background: 'radial-gradient(60% 60% at 50% 40%, rgba(0,250,154,0.28), transparent 70%)' }} />
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { img: CLEMENT_IMG, name: 'Clément', school: 'ESSEC', n: '+40 000', delay: 0.45 },
              { img: ALEXIS_IMG, name: 'Alexis', school: 'Polytechnique', n: '+15 000', delay: 0.58 },
            ].map((f) => (
              <motion.figure key={f.name}
                initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: reduce ? 0 : f.delay, ease }}
                className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] ring-1 ring-green/20 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={`${f.name}, co-fondateur d'AXEM IA`} loading="eager"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  {/* sticker abonnés */}
                  <div className="absolute right-2.5 top-2.5 rounded-full bg-green px-2.5 py-1 text-[11px] font-black text-ink shadow-lg">
                    {f.n}
                  </div>
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                  <div className="font-display text-xl text-white sm:text-2xl" style={{ fontWeight: 900 }}>{f.name}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-green sm:text-[11px]">{f.school}</div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
          {/* bandeau cumul */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: reduce ? 0 : 0.8, ease }}
            className="mt-3 flex items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-center backdrop-blur-md sm:mt-4">
            <svg className="h-4 w-4 shrink-0 text-green" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
            <span className="text-[13px] font-semibold text-white sm:text-sm">
              Ensemble, AXEM · <span className="text-green">+55 000</span> abonnés LinkedIn
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Check: React.FC = () => (
  <svg className="h-3.5 w-3.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// ---------- LOGO TILE : carte blanche, logo couleur, fallback nom stylé ----------
type LogoDef = { src?: string; alt: string; fallbackText?: boolean };
const LogoTile: React.FC<{ logo: LogoDef }> = ({ logo }) => {
  const [errored, setErrored] = useState(false);
  const showText = logo.fallbackText || errored || !logo.src;
  return (
    <Spotlight className="flex h-20 items-center justify-center rounded-2xl border border-black/5 bg-white px-5 shadow-[0_6px_22px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-14px_rgba(0,250,154,0.45)] md:h-24 md:px-6">
      {showText ? (
        <span className="text-center font-display text-lg tracking-tight text-ink md:text-xl" style={{ fontWeight: 800 }}>{logo.alt}</span>
      ) : (
        <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" onError={() => setErrored(true)}
          className="max-h-12 w-auto max-w-[150px] object-contain md:max-h-14" />
      )}
    </Spotlight>
  );
};

// ---------- TRUST : 2 groupes, logos couleur sur cartes blanches + Qualiopi ----------
const Trust: React.FC = () => {
  // logos visibles sur fond blanc. socos = texte blanc → fallback. avantis = texte blanc → fallback. synapse ia = introuvable → fallback.
  const clients: LogoDef[] = [
    { src: '/logos/carrefour.svg', alt: 'Carrefour' },
    { src: '/logos/blackfin.png', alt: 'BlackFin Capital Partners' },
    { src: '/logos/avantis.png', alt: 'Avantis', fallbackText: true },
    { src: '/logos/kit.png', alt: 'KIT France' },
    { src: '/logos/espace2.png', alt: 'Espace 2' },
    { src: '/logos/socos.png', alt: 'Socos', fallbackText: true },
  ];
  const orgs: LogoDef[] = [
    { src: '/logos/myconnecting.png', alt: 'myconnecting' },
    { alt: 'synapse ia', fallbackText: true },
    { src: '/logos/asphere.png', alt: 'ASphere' },
    { src: '/logos/aisisters.svg', alt: 'AI Sisters' },
    { src: '/logos/senza.png', alt: 'SENZA Formations' },
    { src: '/logos/cegos.png', alt: 'Cegos' },
  ];
  return (
    <section id="references" className="relative border-y border-cream/10 bg-ink-2 px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-12 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green">Ils nous font confiance</p>
          <h2 className="mt-3 font-display text-3xl text-cream md:text-5xl" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
            Des PME aux grands comptes.
          </h2>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-10">
          {/* CLIENTS */}
          <div>
            <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-cream-dim lg:text-left">Clients</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {clients.map((l, i) => <Reveal key={l.alt} delay={(i % 3) * 0.05}><LogoTile logo={l} /></Reveal>)}
            </div>
          </div>

          {/* séparateur vertical (desktop) */}
          <div aria-hidden className="hidden w-px self-stretch bg-cream/10 lg:block" />

          {/* ORGANISMES */}
          <div>
            <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-cream-dim lg:text-left">Organismes de formation partenaires</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {orgs.map((l, i) => <Reveal key={l.alt} delay={(i % 3) * 0.05}><LogoTile logo={l} /></Reveal>)}
            </div>
          </div>
        </div>

        {/* QUALIOPI — vrai logo officiel */}
        <Reveal delay={0.1} className="mt-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-5 rounded-3xl border border-green/25 bg-ink px-6 py-6 text-center sm:flex-row sm:gap-7 sm:text-left">
            <div className="flex h-24 items-center justify-center rounded-2xl bg-white px-6 py-3 shadow-lg">
              <img src="/logos/qualiopi.png" alt="Qualiopi — processus certifié — République Française" className="h-16 w-auto object-contain" loading="lazy" />
            </div>
            <div>
              <p className="font-display text-lg text-cream md:text-xl" style={{ fontWeight: 800 }}>Organisme de formation certifié Qualiopi.</p>
              <p className="mt-1 text-sm leading-relaxed text-cream-soft">Nos formations sont finançables OPCO — prise en charge possible jusqu'à 100 %.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- PROBLÈME : 3 pièges ----------
const Problem: React.FC = () => {
  const traps = [
    { n: '01', t: 'Formations théoriques', d: 'Vos équipes sortent « sensibilisées » mais pas opérationnelles. Le lundi, rien ne change.' },
    { n: '02', t: 'Outils sans stratégie', d: 'Des licences achetées, aucune feuille de route. L’IA reste un gadget, jamais un levier.' },
    { n: '03', t: 'Aucun suivi après coup', d: 'Le consultant part, les bonnes habitudes s’effacent, et tout revient comme avant.' },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Pourquoi la plupart échouent</div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-4xl font-display leading-[0.92] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(36px, 6vw, 92px)', letterSpacing: '-0.04em' }}>
            Trois pièges.<br /><span className="outline-type">On les évite tous.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
          {traps.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08}>
              <Spotlight className="flex h-full flex-col gap-4 rounded-3xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:border-green/30 md:p-8">
                <span className="font-display text-5xl text-cream/15 md:text-6xl" style={{ fontWeight: 900 }}>{p.n}</span>
                <h3 className="font-display text-2xl text-cream md:text-3xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{p.t}</h3>
                <p className="text-[15px] leading-relaxed text-cream-soft">{p.d}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-lg text-cream-soft md:text-xl">
            Chez AXEM, vous obtenez un <span className="font-bold text-cream">parcours complet</span>, pas une intervention isolée. <span className="text-green">De l'audit à l'autonomie.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- MÉTHODE ----------
const Method: React.FC = () => {
  const steps = [
    { n: '01', t: 'Diagnostic gratuit', d: '30 minutes pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48 h. Parcours sur-mesure, dates, devis et dossier OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  return (
    <section id="methode" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.9] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 116px)', letterSpacing: '-0.05em' }}>
            En 3 étapes.<br /><span className="text-green">Pas une de plus.</span>
          </h2>
        </Reveal>
        <div className="relative mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
          {/* ligne qui se dessine (desktop) */}
          <svg aria-hidden className="pointer-events-none absolute inset-x-[16%] top-12 hidden h-px w-[68%] md:block" viewBox="0 0 100 1" preserveAspectRatio="none">
            <motion.line x1="0" y1="0.5" x2="100" y2="0.5" stroke="#00FA9A" strokeWidth="1" strokeDasharray="2 2"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.1, ease }} />
          </svg>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <Spotlight className="flex h-full flex-col gap-4 rounded-3xl border border-cream/12 bg-ink p-7 transition-colors hover:border-green/30 md:p-9">
                <div className="flex items-center justify-between">
                  <span className="font-display text-6xl text-cream md:text-7xl" style={{ fontWeight: 900, letterSpacing: '-0.05em' }}>{s.n}</span>
                  <span className="rounded-full bg-green px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                </div>
                <h3 className="font-display text-2xl text-cream md:text-3xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{s.t}</h3>
                <p className="text-[15px] leading-relaxed text-cream-soft">{s.d}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===================== BLOC 1 — FORMATION =====================
type Formation = {
  code: string; title: string; level: 'SOCLE' | 'MÉTIERS' | 'AUTOMATISATION' | 'TRANSVERSAL' | 'PRODUCTION';
  duration: string; price: string; pitch: string; program: string[]; tools: string; deliverables: string;
};
const LEVELS = ['Toutes', 'SOCLE', 'MÉTIERS', 'AUTOMATISATION', 'TRANSVERSAL', 'PRODUCTION'] as const;

const FORMATIONS: Formation[] = [
  { code: 'F01', title: 'IA Essentielle', level: 'SOCLE', duration: '1 J', price: '300 €', pitch: 'De zéro à opérationnel en 1 journée.',
    program: ['Matin · comprendre l’IA : fonctionnement d’un LLM (sans jargon), RGPD, identifier ses cas d’usage métier', 'Après-midi · pratiquer : Prompt Engineering RACF, 15 exercices sur cas réels, plan d’action J+1'],
    tools: 'Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash · Perplexity', deliverables: 'Guide 50 Prompts par Métier · Charte d’usage IA · Fiche 3 Quick Wins J+1' },
  { code: 'F02', title: 'Prompt Engineering Pro', level: 'SOCLE', duration: '½ J', price: '200 €', pitch: 'Multiplier par 5 la qualité de ses outputs IA.',
    program: ['Techniques avancées : Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting', '20 exercices chronométrés sur cas réels', 'Construire sa bibliothèque de prompts d’équipe (template Notion en live) · 5 prompts signature'],
    tools: 'Claude Opus 4.6 · GPT-5.2 · Gemini 3.1 Pro', deliverables: 'Template Bibliothèque Prompts Notion · Fiche mémo Techniques Avancées' },
  { code: 'F03', title: 'Maîtriser Claude', level: 'SOCLE', duration: '1 J', price: '450 €', pitch: 'Devenir expert de l’IA qui pèse 70 % du Fortune 100.',
    program: ['Matin : Claude vs ChatGPT vs Gemini, modèles Sonnet 4.6 & Opus 4.6, Projects, Artifacts, Computer Use', 'Après-midi : Claude Skills, MCP, Cowork & Sub-agents, atelier 3 Skills'],
    tools: 'Claude Opus 4.6 · Sonnet 4.6 · Skills · MCP · Cowork', deliverables: 'Pack 10 Skills Axem · Guide Claude Power User · Charte d’usage Claude' },
  { code: 'F04', title: 'IA pour tous les métiers', level: 'MÉTIERS', duration: '1 J', price: '400 €', pitch: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    program: ['Direction & Stratégie · Marketing & Commercial · RH & Recrutement · Finance & Compta', 'Juridique & Compliance · Service Client · Réseaux Sociaux & Brand · Créatif & Design', 'Modules combinables, contenus 2026'],
    tools: 'Suite IA générative adaptée à chaque métier', deliverables: 'Kit prompts sectoriels · cas d’usage par module' },
  { code: 'F05', title: 'No-Code & Workflows', level: 'AUTOMATISATION', duration: '2 J', price: '800 €', pitch: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    program: ['J1 : Make et n8n (3 automatisations live), Formulaire→CRM · Email→Slack · RSS→LinkedIn — 1 workflow déployé avant 18h', 'J2 : intégrer Claude/GPT/Gemini, conditions complexes, erreurs, boucles, projet final en prod'],
    tools: 'Make · n8n · Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash', deliverables: '10 templates Make & n8n prêts à cloner · Guide Connecter 50 outils' },
  { code: 'F06', title: 'Agent IA sur-mesure', level: 'AUTOMATISATION', duration: '2 J', price: '1 250 €', pitch: 'Un travailleur autonome qui agit seul, 24h/24. (Prérequis : F05 ou pratique API)',
    program: ['J1 Architecture : LLM + Mémoire + Outils + Planification, frameworks (n8n Agents, CrewAI, LangGraph), RAG, MCP', 'J2 Déploiement : 3 patterns business (Support 24/7 · SDR · Admin), validation humaine, monitoring, RGPD'],
    tools: 'Claude Opus 4.6 · GPT-5.2 · n8n Agents · CrewAI · LangGraph · Pinecone · MCP', deliverables: 'Template Agent IA n8n/LangGraph · Guide 6 Architectures d’Agents · Checklist sécurité' },
  { code: 'F07', title: 'Vibe Coding & Claude Code', level: 'AUTOMATISATION', duration: '1 J', price: '450 €', pitch: 'Construire des outils sans coder, avec l’IA comme binôme.',
    program: ['Matin : Lovable / Bolt.new / v0 (app web en 1h), méthode du vibe coding structuré', 'Après-midi : Cursor IDE, Claude Code (CLI), workflows générer/tester/déployer, sécurité & gouvernance'],
    tools: 'Cursor · Claude Code · Lovable · Bolt.new · v0 · GitHub Copilot', deliverables: 'Pack Prompts Vibe Coding · Guide Cursor & Claude Code · 3 mini-apps livrées' },
  { code: 'F08', title: 'Gouvernance & AI Act', level: 'TRANSVERSAL', duration: '½ J', price: '250 €', pitch: 'Cadrer ses usages IA en conformité. (Direction, DPO, DSI, RH, Juristes)',
    program: ['AI Act 2026 (interdit / obligatoire), RGPD & IA (serveurs US OpenAI / Anthropic)', 'Construire sa charte IA + traçabilité, 5 cas pratiques live, matrice de risques AI Act'],
    tools: 'AI Act 2026 · CNIL · Frameworks RGPD', deliverables: 'Template Charte IA · Matrice de risques AI Act · Plan de mise en conformité 90 jours' },
  { code: 'F09', title: 'Veille IA', level: 'TRANSVERSAL', duration: '2 h', price: '80 € · 320 €/an', pitch: 'Rester à jour sur un champ qui bouge tous les mois.',
    program: ['10 avancées IA majeures (démos live), méthode de veille perso 20 min/semaine', 'Horizon 12-24 mois, modulable selon métier — abonnement annuel : 4 sessions/an'],
    tools: 'Perplexity · Claude · Veille IA Axem · Newsletters', deliverables: 'Template Notion Veille IA · Liste 30 sources curées · Replays' },
  { code: 'F10', title: 'Création IA — Visuel · Vidéo · Voix', level: 'PRODUCTION', duration: '1 J', price: '400 €', pitch: 'Produire 10× plus vite, à coût maîtrisé.',
    program: ['Matin (images) : Midjourney V7, DALL-E 4, Firefly 3, Nano Banana Pro, logos, infographies, sites en 1h', 'Après-midi (vidéo & voix) : Synthesia, ElevenLabs (voix clonée), Kling / Sora / Veo, repurposing 1 contenu = 8 formats'],
    tools: 'Midjourney · Synthesia · ElevenLabs · Kling · Sora · Veo · CapCut · Opus Clip', deliverables: 'Guide 30 Outils Créatifs IA 2026 · Pack 50 Prompts Midjourney · Templates Gamma' },
];

const LEVEL_COLORS: Record<string, string> = {
  SOCLE: 'text-sky-300', 'MÉTIERS': 'text-amber-300', AUTOMATISATION: 'text-green',
  TRANSVERSAL: 'text-violet-300', PRODUCTION: 'text-pink-300',
};

const FormationDetail: React.FC<{ f: Formation; onClose: () => void }> = ({ f, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={f.title} onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.35, ease }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-cream/15 bg-ink-2 p-7 no-scrollbar sm:rounded-3xl md:p-10">
        <button onClick={onClose} aria-label="Fermer" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream transition hover:bg-cream/10">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-sm text-green" style={{ fontWeight: 900 }}>{f.code}</span>
          <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${LEVEL_COLORS[f.level]}`}>{f.level}</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-dim">{f.duration}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl text-cream md:text-4xl" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>{f.title}</h3>
        <p className="mt-2 text-lg italic text-cream-soft">« {f.pitch} »</p>
        <div className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-green px-4 py-1.5 text-ink">
          <span className="font-display text-xl" style={{ fontWeight: 900 }}>{f.price}</span>
          <span className="text-[11px] font-bold uppercase tracking-wide">/ pers. · HT</span>
        </div>
        <div className="mt-7">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-green">Programme</p>
          <ul className="space-y-2.5">
            {f.program.map((p, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-cream-soft">
                <Check /><span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 grid gap-5 border-t border-cream/12 pt-6 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Outils</p>
            <p className="text-sm text-cream-soft">{f.tools}</p>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Livrables</p>
            <p className="text-sm text-cream-soft">{f.deliverables}</p>
          </div>
        </div>
        <a href="#rdv" onClick={onClose} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-green px-6 py-4 text-sm uppercase tracking-[0.04em] text-ink transition hover:brightness-95 sm:w-auto" style={{ fontWeight: 900 }}>
          Demander cette formation <span aria-hidden>→</span>
        </a>
      </motion.div>
    </motion.div>
  );
};

const FormationBlock: React.FC = () => {
  const [filter, setFilter] = useState<(typeof LEVELS)[number]>('Toutes');
  const [active, setActive] = useState<Formation | null>(null);
  const list = filter === 'Toutes' ? FORMATIONS : FORMATIONS.filter((f) => f.level === filter);
  return (
    <section id="formation" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-ink">
            Bloc 1 · Formation
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-4xl font-display leading-[0.9] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(38px, 6.4vw, 104px)', letterSpacing: '-0.05em' }}>
            10 formations.<br /><span className="text-green">3 niveaux. 70 % de pratique.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg text-cream-soft">
            Organisme certifié <span className="font-semibold text-cream">Qualiopi</span>, finançable <span className="font-semibold text-cream">OPCO</span>. Construites de A à Z selon vos besoins. <span className="text-cream">200 € – 1 250 €</span> / pers. · inter ou intra.
          </p>
        </Reveal>

        {/* filtres */}
        <Reveal delay={0.16}>
          <div className="mt-9 flex flex-wrap gap-2">
            {LEVELS.map((lv) => (
              <button key={lv} type="button" onClick={() => setFilter(lv)}
                className={`rounded-full border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition ${filter === lv ? 'border-green bg-green text-ink' : 'border-cream/15 text-cream-soft hover:border-green/40 hover:text-cream'}`}>
                {lv}
              </button>
            ))}
          </div>
        </Reveal>

        {/* grille catalogue */}
        <motion.div layout className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((f) => (
              <motion.button key={f.code} layout type="button" onClick={() => setActive(f)}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease }}
                className="group text-left">
                <Spotlight className="flex h-full flex-col gap-3 rounded-2xl border border-cream/12 bg-ink-2 p-6 transition-colors hover:border-green/40">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm text-green" style={{ fontWeight: 900 }}>{f.code}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${LEVEL_COLORS[f.level]}`}>{f.level}</span>
                  </div>
                  <h3 className="font-display text-xl text-cream transition-colors group-hover:text-green md:text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{f.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-cream-soft">{f.pitch}</p>
                  <div className="mt-1 flex items-center justify-between border-t border-cream/10 pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cream-dim">{f.duration} · {f.price}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-green opacity-0 transition-opacity group-hover:opacity-100">
                      Détails <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </Spotlight>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* offres complémentaires formation : coaching, bootcamps, vidéos */}
        <div className="mt-5 grid gap-3.5 md:grid-cols-3">
          {[
            { t: 'Coaching individuel', p: '200 € / session (1h)', d: 'Pour vos profils clés : managers, dirigeants, référents IA. 1 session/semaine, avec Clément ou Alexis.' },
            { t: 'Bootcamps immersifs', p: 'Sur devis · 3 jours +', d: 'IA & Social Media (90 % pratique sur vos données) puis Performance & Scale. Format intensif sur-mesure.' },
            { t: 'Formations vidéos 24/7', p: 'Sur devis', d: '40-45 vidéos HD pas-à-pas, templates téléchargeables, bibliothèques de prompts. Idéal onboarding.' },
          ].map((o, i) => (
            <Reveal key={o.t} delay={i * 0.06}>
              <Spotlight className="flex h-full flex-col gap-2 rounded-2xl border border-cream/12 bg-ink p-6 transition-colors hover:border-green/30">
                <h3 className="font-display text-lg text-cream md:text-xl" style={{ fontWeight: 800 }}>{o.t}</h3>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-green">{o.p}</span>
                <p className="mt-1 text-sm leading-relaxed text-cream-soft">{o.d}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        {/* FINANCEMENT OPCO / QUALIOPI */}
        <Reveal delay={0.06}>
          <div className="mt-8 overflow-hidden rounded-3xl border border-green/25 bg-ink-2">
            <div className="grid gap-8 p-7 md:grid-cols-[auto_1fr] md:items-center md:gap-10 md:p-10">
              <div className="flex h-28 items-center justify-center rounded-2xl bg-white px-7 py-4 shadow-lg">
                <img src="/logos/qualiopi-full.png" alt="Qualiopi — Actions de formation — République Française" className="h-20 w-auto object-contain" loading="lazy" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-cream md:text-3xl" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>Financez vos formations via votre OPCO.</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cream-soft">Organisme certifié Qualiopi : prise en charge possible <span className="font-semibold text-cream">jusqu'à 100 %</span>, un interlocuteur unique côté Axem.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 formations les plus rentables.' },
                    { n: '02', t: 'Devis & dossier OPCO', d: 'Proposition sous 48h, démarches simplifiées.' },
                    { n: '03', t: 'Formation', d: 'Équipes opérationnelles dès J+1, suivi post-formation.' },
                  ].map((s) => (
                    <div key={s.n} className="rounded-2xl border border-cream/10 bg-ink p-4">
                      <span className="font-display text-2xl text-green" style={{ fontWeight: 900 }}>{s.n}</span>
                      <p className="mt-1 text-sm font-bold text-cream">{s.t}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-cream-soft">{s.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>{active && <FormationDetail f={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
};

// ===================== BLOC 2 — CONSEIL & DÉPLOIEMENT =====================
const ConseilBlock: React.FC = () => {
  const services = [
    { n: '01', t: 'Audit IA', price: '1 semaine · sur devis', d: 'Diagnostic, cartographie de vos process, scoring de maturité IA, roadmap priorisée. On regarde avant de déployer.' },
    { n: '02', t: 'Conseil stratégique', price: 'Sur devis', d: 'Roadmap priorisée par ROI, choix des outils, architecture, pilotage du déploiement et conduite du changement.' },
    { n: '03', t: 'Déploiement & automatisation', price: 'A : 1 200 – 2 000 € · B : 900 € + 80 €/mois', d: 'Workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main (A) ou abonnement suivi (B).' },
    { n: '04', t: 'Production IA', price: 'Sur devis (au livrable)', d: 'Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Des assets produits 10× plus vite.' },
    { n: '05', t: 'Suivi', price: '80 € / mois', d: 'Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Partenariat 12 mois +.' },
  ];
  return (
    <section id="conseil" className="border-t border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green/40 bg-green/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-green">
            Bloc 2 · Conseil & déploiement
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-4xl font-display leading-[0.9] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(38px, 6.4vw, 104px)', letterSpacing: '-0.05em' }}>
            On conçoit.<br /><span className="outline-green">On déploie. On reste.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg text-cream-soft">De l'audit à l'autonomie. L'agence prend le relais quand la formation ne suffit plus — pour des solutions IA en production.</p>
        </Reveal>

        <div className="mt-12 border-t border-cream/12">
          {services.map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 0.05}>
              <div className="group block border-b border-cream/12 py-7 transition-colors hover:bg-ink md:py-8">
                <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 md:grid-cols-[80px_1fr_auto] md:gap-x-8">
                  <span className="font-display text-xl text-green transition-transform duration-300 group-hover:translate-x-1 md:text-2xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  <h3 className="font-display leading-[0.98] text-cream transition-colors group-hover:text-green" style={{ fontWeight: 800, fontSize: 'clamp(24px, 3.6vw, 46px)', letterSpacing: '-0.03em' }}>{s.t}</h3>
                  <span className="col-span-2 text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft md:col-span-1 md:self-center md:text-right">{s.price}</span>
                </div>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream-soft md:ml-[112px]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- CAS CLIENTS ----------
const Cases: React.FC = () => {
  const stats = [
    { v: 80, suffix: ' %', l: 'de temps de saisie économisé', sub: 'BTP · Chiffrage automatisé · 95 k€/an neutralisés' },
    { v: 4, prefix: '×', l: 'plus rapide sur le traitement', sub: 'Administration · OCR + IA · fiabilité 100 %' },
    { v: 317, suffix: ' h', l: 'libérées par mois', sub: 'Aéronautique · Conformité ADV · anomalies > 98 %' },
    { v: 20, l: 'ambassadeurs IA formés', sub: 'Éditeur logiciel médico-social · agents en prod' },
  ];
  const formation = [
    { c: 'ESPACE 2', s: 'Promotion immobilière', d: 'Formation IA Direction & RH · charte d’usage · roadmap 90 jours.' },
    { c: 'AVANTIS', s: 'Conseil & expertise', d: 'Kit Journée IA par métier · 6 prompts sectoriels · adoption +60 %.' },
    { c: 'GRAVOTECH', s: 'Industrie', d: 'Acculturation IA équipes opérationnelles · 3 quick wins en 30 jours.' },
    { c: 'CARREFOUR', s: 'Distribution', d: 'Animation formations IA · formation Gemini au niveau groupe.' },
  ];
  return (
    <section id="cas" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Cas clients</div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(38px, 6.4vw, 110px)', letterSpacing: '-0.05em' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((c, i) => (
            <Reveal key={c.l} delay={i * 0.08}>
              <Spotlight className="flex h-full flex-col gap-3 rounded-3xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:border-green/40">
                <span className="font-display text-cream" style={{ fontWeight: 900, fontSize: 'clamp(48px, 6vw, 76px)', letterSpacing: '-0.05em', lineHeight: 0.9 }}>
                  <Counter value={c.v} prefix={c.prefix || ''} suffix={c.suffix || ''} />
                </span>
                <p className="text-sm font-bold text-cream">{c.l}</p>
                <p className="mt-auto text-[13px] leading-relaxed text-cream-soft">{c.sub}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.06}>
          <p className="mt-16 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-cream-dim">Cas clients formation</p>
        </Reveal>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {formation.map((f, i) => (
            <Reveal key={f.c} delay={i * 0.06}>
              <Spotlight className="flex h-full flex-col gap-2 rounded-2xl border border-cream/12 bg-ink-2 p-6 transition-colors hover:border-green/30">
                <span className="font-display text-xl text-cream md:text-2xl" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{f.c}</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-green">{f.s}</span>
                <p className="mt-1 text-[13px] leading-relaxed text-cream-soft">{f.d}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <a href={NOTION_CASES} target="_blank" rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-green/40 bg-green/10 px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-green/20">
            Voir tous les cas clients en détail
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- DUO (bande légère — le duo est déjà star dans le hero) ----------
const DuoStrip: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Les fondateurs</div>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display leading-[0.9] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(36px, 5.6vw, 84px)', letterSpacing: '-0.04em' }}>
              Deux experts,<br /><span className="text-green">un seul interlocuteur.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-lg text-lg text-cream-soft">
              Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez directement à ceux qui livrent. <span className="text-cream">Ensemble, +55 000 abonnés LinkedIn.</span>
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-cream/12 bg-ink transition-colors hover:border-green/40">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[4/3] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0" />
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-green text-ink shadow-lg transition-transform hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-5">
                  <h3 className="font-display text-xl text-cream md:text-2xl" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{f.name}</h3>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-green">{f.school}</p>
                  <p className="text-sm text-cream-soft">{f.role}</p>
                  <div className="mt-auto flex items-baseline gap-1.5 border-t border-cream/12 pt-4">
                    <span className="font-display text-3xl text-cream" style={{ fontWeight: 900 }}><Counter value={f.n} prefix="+" /></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-cream-soft">abonnés</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- POURQUOI AXEM ----------
const Why: React.FC = () => {
  const reasons = [
    { n: '01', t: 'Partenaire sur la durée', d: 'De l’audit à l’autonomie. On ne disparaît pas après le kickoff.' },
    { n: '02', t: '70 % de pratique minimum', d: 'Opérationnel dès J+1. Chaque formation produit un livrable réel.' },
    { n: '03', t: 'Résultats mesurés', d: 'ROI documenté. Des livrables concrets, pas des slides.' },
    { n: '04', t: 'Toujours à jour', d: 'Outils & méthodes 2025/2026. On suit un champ qui bouge chaque mois.' },
    { n: '05', t: 'Un seul interlocuteur', d: 'Du diagnostic au déploiement. Vous parlez à un fondateur.' },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.9] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(38px, 6.4vw, 110px)', letterSpacing: '-0.05em' }}>
            Pourquoi <span className="text-green">AXEM</span>.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.n} delay={(i % 3) * 0.06}>
              <Spotlight className="flex h-full flex-col gap-3 rounded-3xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:border-green/30 md:p-8">
                <span className="font-display text-4xl text-green md:text-5xl" style={{ fontWeight: 900 }}>{r.n}</span>
                <h3 className="font-display text-xl text-cream md:text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{r.t}</h3>
                <p className="text-[15px] leading-relaxed text-cream-soft">{r.d}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- CTA + CALENDLY INLINE ----------
const CalendlyInline: React.FC = () => {
  useEffect(() => {
    const id = 'calendly-widget-script';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id; s.src = 'https://assets.calendly.com/assets/external/widget.js'; s.async = true;
    document.body.appendChild(s);
  }, []);
  return (
    <div className="overflow-hidden rounded-3xl border border-cream/12 bg-white"
      style={{ colorScheme: 'light' }}>
      <div className="calendly-inline-widget" data-url={CALENDLY_INLINE} style={{ minWidth: 320, height: 700 }} />
    </div>
  );
};

const FinalCTA: React.FC = () => (
  <section id="rdv" className="border-t border-cream/10 px-5 py-24 md:px-8 md:py-32">
    <div className="mx-auto max-w-[1400px]">
      <Reveal>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Prendre rendez-vous</div>
      </Reveal>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Reveal delay={0.06}>
            <h2 className="font-display leading-[0.88] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(40px, 6.4vw, 100px)', letterSpacing: '-0.05em' }}>
              Démarrons par un diagnostic <span className="text-green">gratuit.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-lg text-cream-soft">30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col gap-3">
              <a href={`mailto:${CONTACT_MAIL}`} className="inline-flex items-center gap-2.5 text-cream transition hover:text-green">
                <svg className="h-5 w-5 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
                <span className="text-base font-semibold">{CONTACT_MAIL}</span>
              </a>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-cream-soft">
                <span className="inline-flex items-center gap-1.5"><Check /> Réponse sous 48 h</span>
                <span className="inline-flex items-center gap-1.5"><Check /> Sans engagement</span>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <CalendlyInline />
        </Reveal>
      </div>
    </div>
  </section>
);

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="border-t border-cream/10 bg-ink px-5 py-16 md:px-8">
    <div className="mx-auto max-w-[1400px]">
      <div className="font-display leading-[0.85] text-cream" style={{ fontWeight: 900, fontSize: 'clamp(64px, 16vw, 240px)', letterSpacing: '-0.06em' }}>
        AXEM<span className="text-green">.</span>
      </div>
      <div className="mt-12 grid gap-10 border-t border-cream/12 pt-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-xs text-sm text-cream-soft">Votre partenaire IA, de A à Z. Agence d'IA générative &amp; organisme de formation certifié Qualiopi.</p>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
          <ul className="space-y-2 text-sm text-cream-soft">{[['Formation', '#formation'], ['Conseil', '#conseil'], ['Le duo', '#duo'], ['Cas clients', '#cas'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href="#rdv" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
            <li><a href={`mailto:${CONTACT_MAIL}`} className="transition-colors hover:text-cream">{CONTACT_MAIL}</a></li>
            <li>axem-ia.fr</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/12 pt-8 text-xs text-cream-dim md:flex-row">
        <span>© 2026 AXEM IA — Paris, France</span>
        <span className="inline-flex items-center gap-1.5">
          <Check /> Qualiopi · Finançable OPCO
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
        <Method />
        <FormationBlock />
        <ConseilBlock />
        <Cases />
        <DuoStrip />
        <Why />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
