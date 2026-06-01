import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, MotionConfig, useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — AGENCEMENT B : « STORYTELLING QUI RÉVÈLE AU SCROLL »
// La densité est gérée par la RÉVÉLATION PROGRESSIVE : on ne voit qu'un
// bloc à la fois → jamais de mur. 1 section = 1 message. Beaucoup d'air.
// Le détail s'ouvre au clic (modale). Dark #0F0F0F + mint + Archivo.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_INLINE = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const NOTION_URL = '#'; // TODO URL Notion — « Tous les cas clients en détail »
const ease = [0.16, 1, 0.3, 1] as const;

// =====================================================================
// BACKGROUND HERO — Grainient (OGL). NE PAS TOUCHER.
// =====================================================================
const PALETTES = {
  iris:   { color1: '#8AB4FF', color2: '#8B5CF6', color3: '#C026D3' },
  violet: { color1: '#C9A8FF', color2: '#6D4BFF', color3: '#3F2D9E' },
  sunset: { color1: '#FFD27A', color2: '#FF6B9D', color3: '#7A3DF5' },
  ocean:  { color1: '#7DE3FF', color2: '#3B82F6', color3: '#243A8E' },
  coral:  { color1: '#FFC07A', color2: '#FF5E5B', color3: '#B02A6B' },
  mint:   { color1: '#9BFFD9', color2: '#00E0A4', color3: '#0E5C57' },
} as const;
const DEFAULT_PALETTE: keyof typeof PALETTES = 'iris';
const PALETTE_META: Record<keyof typeof PALETTES, { label: string; dot: string }> = {
  iris:   { label: 'Iris',   dot: '#8B5CF6' },
  violet: { label: 'Violet', dot: '#6D4BFF' },
  sunset: { label: 'Sunset', dot: '#FF6B9D' },
  ocean:  { label: 'Ocean',  dot: '#3B82F6' },
  coral:  { label: 'Coral',  dot: '#FF5E5B' },
  mint:   { label: 'Mint',   dot: '#00E0A4' },
};
const GRAINIENT = {
  timeSpeed: 0.18, warpStrength: 1.0, warpFrequency: 5.0, warpSpeed: 2.0,
  warpAmplitude: 50.0, blendAngle: 0.0, blendSoftness: 0.05, rotationAmount: 500.0,
  noiseScale: 2.0, grainAmount: 0.12, grainScale: 1.5, grainAnimated: false,
  contrast: 1.5, gamma: 1.0, saturation: 1.05, zoom: 0.78,
} as const;

// =====================================================================
// HELPERS
// =====================================================================
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; y?: number }> = ({ children, delay = 0, className, y = 28 }) => (
  <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
);

// Mots qui montent (mask reveal) mot par mot
const RiseWords: React.FC<{ text: string; className?: string; delay?: number; stagger?: number }> = ({ text, className = '', delay = 0, stagger = 0.05 }) => {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span className="inline-block"
            initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.85, delay: delay + i * stagger, ease }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const Magnetic: React.FC<any> = ({ children, strength = 0.35, className, ...props }) => {
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

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number; className?: string; run?: boolean }> = ({ value, prefix = '', suffix = '', decimals = 0, className, run }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const localInView = useInView(ref, { once: true, margin: '-60px' });
  const inView = run === undefined ? localInView : run;
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const start = performance.now(); let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - start) / 1600); setN((1 - Math.pow(1 - k, 3)) * value); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const rounded = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString();
  const fmt = Math.round(n) >= 1000 ? Math.round(n).toLocaleString('fr-FR') : rounded;
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

// Chip de section (kicker)
const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />{children}</div></Reveal>
);

// =====================================================================
// NAV
// =====================================================================
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 24); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-2xl tracking-tighter text-cream" style={{ fontWeight: 900 }}>
          AXEM<span className="text-green">.</span>
        </a>
        <div className="hidden items-center gap-9 md:flex">
          {[['Problème', '#probleme'], ['Méthode', '#methode'], ['Prestations', '#prestations'], ['Formations', '#catalogue'], ['Résultats', '#cas']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href="#rdv" strength={0.3}
          className="group inline-flex items-center gap-1.5 bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] text-ink" style={{ fontWeight: 800 }}>
          Diagnostic <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// =====================================================================
// HERO — premium centré · fond Grainient vif · NE PAS TOUCHER
// =====================================================================
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
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0F0F0F]">
        <Grainient {...GRAINIENT} {...PALETTES[pal]} className="h-full w-full" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(64% 48% at 50% 42%, rgba(7,7,13,0.5) 0%, rgba(7,7,13,0.22) 44%, transparent 70%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[24%]"
        style={{ background: 'linear-gradient(180deg, transparent, #0F0F0F)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24"
        style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.42), transparent)' }} />

      {/* SÉLECTEUR DE PALETTE (démo — retiré une fois la couleur choisie) */}
      <div className="fixed right-3 top-24 z-50 flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/45 p-2 backdrop-blur-md md:right-5">
        <span className="px-1 pb-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-white/55">Fond hero</span>
        {(Object.keys(PALETTES) as (keyof typeof PALETTES)[]).map((k) => (
          <button key={k} type="button" onClick={() => setPal(k)}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${pal === k ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10'}`}>
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/30" style={{ background: PALETTE_META[k].dot }} />
            {PALETTE_META[k].label}
          </button>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 md:text-[11px]">Agence d'IA &amp; organisme de formation certifié Qualiopi</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-7 font-display leading-[0.94] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.38)]"
            style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.6vw, 88px)' }}>
            Votre partenaire IA,<br />
            <span className="relative whitespace-nowrap">de A à Z.
              <span aria-hidden className="absolute -bottom-1.5 left-0 h-[0.12em] w-full rounded-full bg-green" />
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl font-display text-xl font-bold leading-snug text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.32)] md:text-2xl">
            On vous forme, on vous conseille, on déploie. <span className="text-green">Et on reste.</span>
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.3)] md:text-base">
            AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi. Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique, de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <Magnetic href="#rdv" strength={0.35}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.65)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Diagnostic gratuit</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#probleme" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/15">
              Comment on travaille <span aria-hidden>↓</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.38}>
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

// =====================================================================
// TRUST — 2 groupes, logos EN COULEUR, plus gros, sur cartes blanches
// =====================================================================
type Logo = { src?: string; alt: string };
const CLIENTS: Logo[] = [
  { src: '/logos/carrefour.svg', alt: 'Carrefour' },
  { src: '/logos/blackfin.png', alt: 'BlackFin Capital Partners' },
  { src: '/logos/avantis.png', alt: 'Avantis' },
  { src: '/logos/kit.png', alt: 'KIT France' },
  { src: '/logos/espace2.png', alt: 'Espace 2' },
  { src: '/logos/socos.png', alt: 'Socos' },
  { src: '/logos/gravotech.png', alt: 'Gravotech' },
];
const OF: Logo[] = [
  { src: '/logos/myconnecting.png', alt: 'myconnecting' },
  { alt: 'synapse ia' }, // fallback nom stylé
  { src: '/logos/asphere.png', alt: 'ASphere' },
  { alt: 'AI sisters' }, // fallback nom stylé
  { src: '/logos/senza.png', alt: 'SENZA Formations' },
  { src: '/logos/cegos.png', alt: 'Cegos' },
];

const LogoCard: React.FC<{ logo: Logo; i: number }> = ({ logo, i }) => (
  <Reveal delay={(i % 4) * 0.05} y={18}>
    <div className="flex h-20 items-center justify-center rounded-2xl border border-cream/10 bg-white px-5 shadow-[0_2px_18px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-1 md:h-24 md:px-7">
      {logo.src ? (
        <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async"
          className="max-h-9 w-auto max-w-[150px] object-contain md:max-h-12 md:max-w-[180px]" />
      ) : (
        <span className="font-display text-lg tracking-tight text-ink md:text-2xl" style={{ fontWeight: 900 }}>{logo.alt}</span>
      )}
    </div>
  </Reveal>
);

const Trust: React.FC = () => (
  <section id="references" className="relative border-b border-white/10 bg-ink px-5 py-20 md:px-8 md:py-28">
    <div className="mx-auto max-w-[1400px]">
      <Kicker>Ils nous font confiance</Kicker>
      <Reveal delay={0.06}>
        <h2 className="font-display leading-[0.92] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(30px, 5vw, 64px)' }}>
          Des PME aux grands comptes<br /><span className="text-green">&amp; aux administrations.</span>
        </h2>
      </Reveal>

      <div className="mt-14">
        <Reveal y={14}><p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-cream-dim">Clients</p></Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map((l, i) => <LogoCard key={l.alt} logo={l} i={i} />)}
        </div>
      </div>

      <div className="mt-12">
        <Reveal y={14}><p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-cream-dim">Organismes de formation partenaires</p></Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {OF.map((l, i) => <LogoCard key={l.alt} logo={l} i={i} />)}
        </div>
      </div>
    </div>
  </section>
);

// =====================================================================
// PROBLÈME — les 3 pièges en CHAPITRES qui se succèdent au scroll
// Chaque chapitre = pin sticky + numéro géant + 1 idée. Jamais de mur.
// =====================================================================
const TRAPS = [
  { n: '01', t: 'Formations théoriques', d: "Vos équipes ressortent « sensibilisées »… mais pas opérationnelles. Le lundi suivant, rien n'a changé dans leur quotidien." },
  { n: '02', t: 'Outils sans stratégie', d: "Des licences achetées, des comptes ouverts — et aucune feuille de route. L'outil dort, le budget brûle, le ROI n'arrive jamais." },
  { n: '03', t: 'Aucun suivi après coup', d: "Le consultant part, les habitudes reviennent. Sans accompagnement dans la durée, l'élan retombe et tout est à refaire." },
];

const TrapChapter: React.FC<{ trap: typeof TRAPS[number]; index: number }> = ({ trap, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Le bloc apparaît, tient au centre, puis s'efface — révélation 1 à la fois.
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.5, 0.78, 1], [0, 1, 1, 1, 0.15]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -50]);
  const num = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 1, 0.4]);

  return (
    <div ref={ref} className="relative flex min-h-[78vh] items-center md:min-h-screen">
      <motion.div style={reduce ? undefined : { opacity, y }} className="sticky top-0 flex min-h-[78vh] w-full items-center md:min-h-screen">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-6 px-5 md:grid-cols-[auto_1fr] md:gap-16 md:px-8">
          <motion.span style={reduce ? undefined : { opacity: num }} className="block">
            <span className="block font-display leading-none text-green tighter" style={{ fontWeight: 900, fontSize: 'clamp(96px, 26vw, 340px)' }}>{trap.n}</span>
          </motion.span>
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-cream-dim">Piège n°{index + 1} sur 3</p>
            <h3 className="font-display leading-[0.95] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(34px, 6vw, 84px)' }}>{trap.t}</h3>
            <p className="mt-6 text-lg leading-relaxed text-cream-soft md:text-2xl">{trap.d}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Problem: React.FC = () => (
  <section id="probleme" className="relative bg-ink-2 px-0 py-28 md:py-36">
    <div className="mx-auto mb-8 max-w-[1400px] px-5 md:mb-0 md:px-8">
      <Kicker>Pourquoi la plupart échouent</Kicker>
      <Reveal delay={0.06}>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.4vw, 124px)' }}>
          L'IA échoue<br />pour <span className="outline-green">3 raisons.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}><p className="mt-7 max-w-xl text-lg text-cream-soft md:text-xl">Et aucune n'est technique. On les a vues partout. Les voici, une par une.</p></Reveal>
    </div>

    <div className="mt-4 md:mt-0">
      {TRAPS.map((t, i) => <TrapChapter key={t.n} trap={t} index={i} />)}
    </div>

    <div className="mx-auto mt-10 max-w-[1400px] px-5 md:px-8">
      <Reveal>
        <p className="font-display leading-[1.05] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(28px, 4.4vw, 64px)' }}>
          Notre réponse : <span className="text-green">un parcours complet,</span><br />pas une intervention isolée.
        </p>
      </Reveal>
    </div>
  </section>
);

// =====================================================================
// MÉTHODE — « En 3 étapes. Pas une de plus. »
// Trait SVG qui se dessine au scroll + 3 jalons révélés (Diagnostic 30 MIN
// → Proposition 48 H → Exécution J+1)
// =====================================================================
const METHOD_STEPS = [
  { n: '01', t: 'Diagnostic', meta: '30 MIN', d: '30 minutes pour identifier vos 3 leviers IA les plus rentables. Gratuit, sans engagement.' },
  { n: '02', t: 'Proposition', meta: '48 H', d: 'Sous 48h : parcours sur-mesure, dates, financement OPCO. Vous savez exactement où vous allez.' },
  { n: '03', t: 'Exécution', meta: 'J+1', d: 'Opérationnel dès le lendemain. Livrables concrets, suivi inclus. Pas de slides — du livrable.' },
];

const Method: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const dash = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section id="methode" className="border-y border-cream/10 bg-ink px-5 py-28 md:px-8 md:py-36">
      <div ref={ref} className="mx-auto max-w-[1400px]">
        <Kicker>Notre méthode</Kicker>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 8vw, 132px)' }}>
            En 3 étapes.<br /><span className="text-green">Pas une de plus.</span>
          </h2>
        </Reveal>

        <div className="relative mt-20">
          {/* Trait SVG qui se dessine — vertical mobile / horizontal desktop */}
          <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" preserveAspectRatio="none" viewBox="0 0 1000 10">
            <motion.line x1="60" y1="5" x2="940" y2="5" stroke="#00FA9A" strokeWidth="2" strokeDasharray="1" pathLength={1}
              style={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: dash }} />
          </svg>

          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {METHOD_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="group relative">
                  <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-green bg-ink text-green" >
                    <span className="font-display text-xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-3xl text-cream tight md:text-4xl" style={{ fontWeight: 800 }}>{s.t}</h3>
                    <span className="bg-green px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                  </div>
                  <p className="mt-4 max-w-sm text-base leading-relaxed text-cream-soft">{s.d}</p>
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
// PRESTATIONS — révélées UNE PAR UNE au scroll. Sticky visuel + détail.
// L'audit affiche « 1 semaine » (pas « 1 à 4 sem »).
// =====================================================================
const SERVICES = [
  { n: '01', t: 'Audit IA', tag: 'On regarde avant de déployer', d: "Diagnostic, cartographie de vos process, scoring de maturité IA, roadmap priorisée sur 3 à 12 mois.", bullets: ['Analyse des process & points de friction', 'Cas d\'usage scorés par impact', 'Roadmap d\'adoption séquencée', 'Livrable de synthèse actionnable'], price: 'Sur devis', meta: '1 semaine' },
  { n: '02', t: 'Conseil stratégique', tag: 'On décide quoi faire, et dans quel ordre', d: "Cadrage projets, arbitrages par ROI, choix des outils et architecture, pilotage du déploiement.", bullets: ['Accompagnement décisionnel', 'Choix des outils & stack', 'Pilotage & conduite du changement', 'Missions ponctuelles ou continues'], price: 'Sur devis', meta: 'Sur-mesure' },
  { n: '03', t: 'Déploiement & automatisation', tag: 'Des workflows qui tournent seuls, 7j/7', d: "On construit, on teste, on déploie. n8n, Make, Claude Code. Clé en main ou abonnement suivi.", bullets: ['Clé en main : 1 200 € – 2 000 €', 'Abonnement : 900 € + 80 €/mois', 'Documentation + passation', 'Un référent Axem dédié'], price: 'Dès 1 200 €', meta: 'Clé en main' },
  { n: '04', t: 'Formation', tag: 'Vos équipes opérationnelles dès J+1', d: "Upskilling ciblé sur vos cas d'usage réels. 10 formations, 3 niveaux, 70 % de pratique. Certifié Qualiopi, finançable OPCO.", bullets: ['10 formations · 3 niveaux', '70 % de pratique minimum', 'Certifié Qualiopi', 'Finançable OPCO jusqu\'à 100 %'], price: '200 € – 1 250 € / pers.', meta: 'Qualiopi' },
  { n: '05', t: 'Coaching individuel', tag: 'Pour vos profils clés', d: "Managers, dirigeants, référents IA internes. On ancre les compétences dans la durée, 1 session par semaine.", bullets: ['1h par session, 1×/semaine', 'Réalisé par Clément ou Alexis', 'Sur-mesure selon le profil', 'Ancrage long terme'], price: '200 € / session', meta: '1h hebdo' },
  { n: '06', t: 'Production IA', tag: 'Des assets produits 10× plus vite', d: "Vidéos avatar IA, images & visuels, voix clonée, vidéos réseaux sociaux, sites no-code, slides & présentations.", bullets: ['Vidéos avatar & voix clonée', 'Visuels & infographies', 'Sites web no-code', 'Slides & présentations'], price: 'Sur devis', meta: 'Au livrable' },
  { n: '07', t: 'Suivi', tag: 'Une fois déployé, on reste', d: "Maintenance, évolutions, nouvelles automatisations. La relation devient long terme — durée moyenne : 12 mois +.", bullets: ['Maintenance & MAJ d\'API', 'Améliorations continues', 'Nouveaux cas d\'usage', 'Production IA continue'], price: '80 € / mois', meta: '12 mois +' },
];

const ServiceRow: React.FC<{ s: typeof SERVICES[number]; index: number }> = ({ s, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30% 0px -30% 0px' });
  return (
    <Reveal>
      <div ref={ref} className={`group grid gap-6 border-b border-cream/12 py-10 transition-colors md:grid-cols-[120px_1fr_auto] md:items-start md:gap-12 md:py-14 ${inView ? '' : ''}`}>
        <div className="flex items-baseline gap-3 md:block">
          <span className={`font-display leading-none tighter transition-colors duration-500 ${inView ? 'text-green' : 'text-cream/25'}`} style={{ fontWeight: 900, fontSize: 'clamp(40px, 5vw, 80px)' }}>{s.n}</span>
        </div>
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-green">{s.tag}</p>
          <h3 className="font-display leading-[0.95] text-cream tight" style={{ fontWeight: 800, fontSize: 'clamp(28px, 4.4vw, 62px)' }}>{s.t}</h3>
          <p className="mt-4 text-base leading-relaxed text-cream-soft md:text-lg">{s.d}</p>
          <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {s.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-cream-soft">
                <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row items-center gap-3 md:flex-col md:items-end md:gap-2 md:text-right">
          <span className="bg-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-green">{s.meta}</span>
          <span className="text-sm font-bold text-cream md:whitespace-nowrap">{s.price}</span>
        </div>
      </div>
    </Reveal>
  );
};

const Services: React.FC = () => (
  <section id="prestations" className="bg-ink-2 px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-[1400px]">
      <Kicker>Ce qu'on fait</Kicker>
      <Reveal delay={0.06}>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 8vw, 132px)' }}>
          Sept prestations.<br /><span className="outline-type">Un partenaire.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}><p className="mt-7 max-w-xl text-lg text-cream-soft md:text-xl">De l'audit à l'autonomie. On les déroule une par une — celle dont vous avez besoin est là.</p></Reveal>

      <div className="mt-16 border-t border-cream/12">
        {SERVICES.map((s, i) => <ServiceRow key={s.n} s={s} index={i} />)}
      </div>
    </div>
  </section>
);

// =====================================================================
// MANIFESTE plein écran — respiration : « Que du livrable. »
// =====================================================================
const Manifesto: React.FC<{ id?: string; pre: string; big: React.ReactNode; post: string }> = ({ id, pre, big, post }) => (
  <section id={id} className="flex min-h-[70vh] items-center bg-ink px-5 py-28 md:px-8 md:py-40">
    <div className="mx-auto max-w-[1400px]">
      <Reveal><p className="mb-6 text-[11px] font-bold uppercase tracking-[0.24em] text-cream-dim">{pre}</p></Reveal>
      <h2 className="font-display leading-[0.86] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(56px, 13vw, 220px)' }}>
        <RiseWords text={typeof big === 'string' ? big : ''} />
        {typeof big !== 'string' ? big : null}
      </h2>
      <Reveal delay={0.2}><p className="mt-8 max-w-xl text-lg text-cream-soft md:text-xl">{post}</p></Reveal>
    </div>
  </section>
);

// =====================================================================
// MOMENT CATALOGUE — les formations DÉFILENT par niveau.
// Aperçu (code · nom · durée · prix) ; CLIC = modale détail.
// + Qualiopi / bootcamps / vidéos / OPCO glissés légèrement après.
// =====================================================================
type Formation = {
  code: string; name: string; level: string; duree: string; prix: string;
  punch: string; programme: string[]; outils: string; livrables: string;
};
const FORMATIONS: Formation[] = [
  { code: 'F01', name: 'IA Essentielle', level: 'SOCLE', duree: '1 J', prix: '300 €', punch: 'De zéro à opérationnel en 1 journée.',
    programme: ['Matin — Comprendre l\'IA : fonctionnement d\'un LLM (sans jargon), RGPD, identifier ses cas d\'usage métier.', 'Après-midi — Pratiquer : Prompt Engineering RACF, 15 exercices sur cas réels, plan d\'action J+1.'],
    outils: 'Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash · Perplexity', livrables: 'Guide 50 Prompts par Métier · Charte d\'usage IA · Fiche 3 Quick Wins J+1' },
  { code: 'F02', name: 'Prompt Engineering Pro', level: 'SOCLE', duree: '½ J', prix: '200 €', punch: 'Multiplier par 5 la qualité de ses outputs IA.',
    programme: ['Techniques avancées : Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting.', '20 exercices chronométrés sur cas réels · bibliothèque de prompts d\'équipe (Notion en live) · atelier 5 prompts signature.'],
    outils: 'Claude Opus 4.6 · GPT-5.2 · Gemini 3.1 Pro', livrables: 'Template Bibliothèque Prompts Notion · Fiche mémo Techniques Avancées' },
  { code: 'F03', name: 'Maîtriser Claude', level: 'SOCLE', duree: '1 J', prix: '450 €', punch: 'Devenir expert de l\'IA qui pèse 70 % du Fortune 100.',
    programme: ['Matin — Claude vs ChatGPT vs Gemini · modèles Sonnet 4.6 & Opus 4.6 · Projects, Artifacts, Computer Use.', 'Après-midi — Claude Skills · MCP · Cowork & Sub-agents · atelier 3 Skills.'],
    outils: 'Claude Opus 4.6 · Sonnet 4.6 · Skills · MCP · Cowork', livrables: 'Pack 10 Skills Axem · Guide Claude Power User · Charte d\'usage Claude' },
  { code: 'F04', name: 'IA pour tous les métiers', level: 'MÉTIERS', duree: '1 J', prix: '400 €', punch: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    programme: ['Modules : Direction & Stratégie · Marketing & Commercial · RH & Recrutement · Finance & Compta.', 'Juridique & Compliance · Service Client · Réseaux Sociaux & Brand · Créatif & Design. Combinables, contenus 2026.'],
    outils: 'Stack IA générative adaptée à chaque métier', livrables: 'Playbooks & prompts sectoriels par module choisi' },
  { code: 'F05', name: 'No-Code & Workflows', level: 'AUTOMATISATION', duree: '2 J', prix: '800 €', punch: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    programme: ['J1 — Make & n8n : 3 automatisations live (Formulaire→CRM · Email→Slack · RSS→LinkedIn), 1 workflow déployé avant 18h.', 'J2 — Intégrer Claude/GPT/Gemini, conditions complexes, erreurs, boucles, projet final en prod.'],
    outils: 'Make · n8n · Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash', livrables: '10 templates Make & n8n prêts à cloner · Guide Connecter 50 outils' },
  { code: 'F06', name: 'Agent IA sur-mesure', level: 'AUTOMATISATION', duree: '2 J', prix: '1 250 €', punch: 'Un travailleur autonome qui agit seul, 24h/24.',
    programme: ['J1 Architecture — LLM + Mémoire + Outils + Planification · frameworks (n8n Agents, CrewAI, LangGraph) · RAG · MCP.', 'J2 Déploiement — 3 patterns business (Support 24/7 · SDR · Admin) · Skills · monitoring/RGPD · projet final. (Prérequis : F05 ou pratique API)'],
    outils: 'Claude Opus 4.6 · GPT-5.2 · n8n Agents · CrewAI · LangGraph · Pinecone · MCP', livrables: 'Template Agent IA n8n/LangGraph · Guide 6 Architectures · Checklist sécurité' },
  { code: 'F07', name: 'Vibe Coding & Claude Code', level: 'AUTOMATISATION', duree: '1 J', prix: '450 €', punch: 'Construire des outils sans coder, avec l\'IA comme binôme.',
    programme: ['Matin — Lovable / Bolt.new / v0 : app web en 1h · méthode du vibe coding structuré · atelier micro-outil métier.', 'Après-midi — Cursor IDE, Claude Code (CLI), workflows générer/tester/déployer, sécurité & gouvernance.'],
    outils: 'Cursor · Claude Code · Lovable · Bolt.new · v0 · GitHub Copilot', livrables: 'Pack Prompts Vibe Coding · Guide Cursor & Claude Code · 3 mini-apps livrées' },
  { code: 'F08', name: 'Gouvernance & AI Act', level: 'TRANSVERSAL', duree: '½ J', prix: '250 €', punch: 'Cadrer ses usages IA en conformité.',
    programme: ['AI Act 2026 (interdit / obligatoire) · RGPD & IA (serveurs US OpenAI/Anthropic).', 'Construire sa charte IA + traçabilité · 5 cas pratiques live · matrice de risques. (Public : Direction, DPO, DSI, RH, Juristes)'],
    outils: 'AI Act 2026 · CNIL · Frameworks RGPD', livrables: 'Template Charte IA · Matrice de risques AI Act · Plan de conformité 90 jours' },
  { code: 'F09', name: 'Veille IA', level: 'TRANSVERSAL', duree: '2 h', prix: '80 € · 320 €/an', punch: 'Rester à jour sur un champ qui bouge tous les mois.',
    programme: ['10 avancées IA majeures (démos live) · méthode de veille perso 20 min/semaine.', 'Horizon 12-24 mois · modulable selon métier · abonnement annuel 320 €/pers (4 sessions/an).'],
    outils: 'Perplexity · Claude · Veille IA Axem · Newsletters', livrables: 'Template Notion Veille IA · Liste 30 sources curées · Replays' },
  { code: 'F10', name: 'Création IA — Visuel · Vidéo · Voix', level: 'PRODUCTION', duree: '1 J', prix: '400 €', punch: 'Produire 10× plus vite, à coût maîtrisé.',
    programme: ['Matin (images) — Midjourney V7, DALL-E 4, Firefly 3, Nano Banana Pro · logos · infographies · sites en 1h.', 'Après-midi (vidéo & voix) — Synthesia (140 avatars) · ElevenLabs voix clonée · Kling/Sora/Veo · repurposing 1 contenu = 8 formats.'],
    outils: 'Midjourney · DALL-E · Firefly · Synthesia · ElevenLabs · Kling · Sora · Veo', livrables: 'Guide 30 Outils Créatifs IA 2026 · Pack 50 Prompts Midjourney · Templates Gamma' },
];
const LEVELS = ['SOCLE', 'MÉTIERS', 'AUTOMATISATION', 'TRANSVERSAL', 'PRODUCTION'] as const;
const LEVEL_NOTE: Record<string, string> = {
  SOCLE: 'Les fondations. On part de zéro.',
  MÉTIERS: 'Du concret, métier par métier.',
  AUTOMATISATION: 'Quand l\'IA travaille à votre place.',
  TRANSVERSAL: 'Cadrer & rester à jour.',
  PRODUCTION: 'Créer 10× plus vite.',
};

const FormationCard: React.FC<{ f: Formation; onOpen: () => void; i: number }> = ({ f, onOpen, i }) => (
  <Reveal delay={(i % 3) * 0.05} y={20}>
    <button type="button" onClick={onOpen}
      className="group flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-cream/12 bg-ink p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-green/45 hover:bg-ink-3 md:p-7">
      <div className="flex w-full items-center justify-between">
        <span className="font-display text-sm tracking-widest text-green" style={{ fontWeight: 900 }}>{f.code}</span>
        <span className="rounded-full border border-cream/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-cream-dim">{f.duree}</span>
      </div>
      <h4 className="font-display text-2xl leading-[1.05] text-cream tight md:text-[28px]" style={{ fontWeight: 800 }}>{f.name}</h4>
      <p className="text-sm leading-relaxed text-cream-soft">{f.punch}</p>
      <div className="mt-auto flex w-full items-center justify-between pt-3">
        <span className="font-display text-xl text-cream" style={{ fontWeight: 900 }}>{f.prix}</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-green opacity-0 transition-opacity group-hover:opacity-100">
          Détail <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </button>
  </Reveal>
);

const FormationModal: React.FC<{ f: Formation | null; onClose: () => void }> = ({ f, onClose }) => {
  useEffect(() => {
    if (!f) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [f, onClose]);
  return (
    <AnimatePresence>
      {f && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center p-0 md:items-center md:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <div aria-hidden className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div role="dialog" aria-modal="true" aria-label={`${f.code} ${f.name}`}
            initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease }} onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-cream/12 bg-ink-2 p-7 no-scrollbar md:rounded-3xl md:p-10">
            <button type="button" onClick={onClose} aria-label="Fermer"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream-soft transition hover:bg-cream/10 hover:text-cream">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-display text-sm tracking-widest text-green" style={{ fontWeight: 900 }}>{f.code}</span>
              <span className="rounded-full bg-green/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-green">{f.level}</span>
              <span className="rounded-full border border-cream/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-cream-dim">{f.duree} · {f.prix}</span>
            </div>
            <h3 className="mt-4 font-display text-3xl text-cream tight md:text-4xl" style={{ fontWeight: 900 }}>{f.name}</h3>
            <p className="mt-2 text-base text-green/90">{f.punch}</p>

            <div className="mt-7">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Programme</p>
              <ul className="space-y-3">
                {f.programme.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-cream-soft">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 grid gap-5 border-t border-cream/12 pt-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Outils</p>
                <p className="text-sm text-cream-soft">{f.outils}</p>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Livrables</p>
                <p className="text-sm text-cream-soft">{f.livrables}</p>
              </div>
            </div>
            <a href="#rdv" onClick={onClose}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 text-sm uppercase tracking-[0.04em] text-ink transition hover:brightness-110" style={{ fontWeight: 900 }}>
              Demander cette formation <span>→</span>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Catalogue: React.FC = () => {
  const [open, setOpen] = useState<Formation | null>(null);
  return (
    <section id="catalogue" className="bg-ink px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Kicker>Catalogue de formation 2025 / 2026</Kicker>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 8vw, 132px)' }}>
            10 formations.<br /><span className="text-green">3 niveaux.</span> 70 % de pratique.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            Construites de A à Z selon vos besoins. Certifiées Qualiopi, finançables OPCO. Cliquez sur une formation pour le programme complet, les outils et les livrables.
          </p>
        </Reveal>

        {/* Défilé PAR NIVEAU — révélation progressive, jamais le mur des 10 d'un coup */}
        <div className="mt-16 space-y-16">
          {LEVELS.map((lvl) => {
            const list = FORMATIONS.filter((f) => f.level === lvl);
            return (
              <div key={lvl}>
                <Reveal y={16}>
                  <div className="mb-7 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-cream/12 pb-4">
                    <h3 className="font-display text-2xl text-cream tight md:text-4xl" style={{ fontWeight: 900 }}>{lvl}</h3>
                    <p className="text-sm text-cream-soft">{LEVEL_NOTE[lvl]}</p>
                    <span className="ml-auto text-[11px] font-bold uppercase tracking-[0.14em] text-green">{list.length} formation{list.length > 1 ? 's' : ''}</span>
                  </div>
                </Reveal>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((f, i) => <FormationCard key={f.code} f={f} i={i} onOpen={() => setOpen(f)} />)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bootcamps + formations vidéos — glissés légèrement */}
        <div className="mt-20 grid gap-5 md:grid-cols-2">
          <Reveal y={20}>
            <div className="h-full rounded-2xl border border-cream/12 bg-ink-2 p-7 md:p-9">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-green">Bootcamps immersifs</p>
              <h4 className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>Format intensif, 90 % pratique</h4>
              <p className="mt-3 text-sm leading-relaxed text-cream-soft"><strong className="text-cream">IA &amp; Social Media</strong> (3 j) : 20-30 posts créés, calendrier automatisé, playbook. <strong className="text-cream">Performance &amp; Scale</strong> (+2 j) : A/B testing, agents IA, autonomie 24/7. Sur devis.</p>
            </div>
          </Reveal>
          <Reveal y={20} delay={0.05}>
            <div className="h-full rounded-2xl border border-cream/12 bg-ink-2 p-7 md:p-9">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-green">Formations vidéos · 24/7</p>
              <h4 className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>Apprendre à son rythme</h4>
              <p className="mt-3 text-sm leading-relaxed text-cream-soft">40-45 vidéos HD en screencast pas-à-pas, cas d'usage métiers, config workflows live, templates téléchargeables, bibliothèques de prompts sectoriels. Idéal onboarding. Tarification sur devis.</p>
            </div>
          </Reveal>
        </div>

        {/* OPCO via IZY for pro — 3 étapes, légèrement */}
        <Reveal y={24}>
          <div className="mt-12 rounded-3xl border border-green/25 bg-gradient-to-br from-green/10 to-transparent p-8 md:p-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">Financement</p>
            <h3 className="mt-2 font-display text-2xl text-cream tight md:text-4xl" style={{ fontWeight: 900 }}>Finançable OPCO jusqu'à 100 %, via portage IZY for pro.</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier les 3 formations les plus rentables.' },
                { n: '02', t: 'Devis & dossier OPCO', d: 'Proposition sous 48h, prise en charge via portage IZY for pro, démarches simplifiées.' },
                { n: '03', t: 'Formation', d: 'Équipes opérationnelles dès J+1, livrables concrets, suivi post-formation.' },
              ].map((s) => (
                <div key={s.n} className="flex flex-col gap-2">
                  <span className="font-display text-3xl text-green" style={{ fontWeight: 900 }}>{s.n}</span>
                  <h4 className="font-display text-lg text-cream tight" style={{ fontWeight: 800 }}>{s.t}</h4>
                  <p className="text-sm leading-relaxed text-cream-soft">{s.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-7 text-sm text-cream-dim">Interlocuteur unique côté Axem · <a href="mailto:contact@axem-ia.fr" className="text-green underline-offset-4 hover:underline">contact@axem-ia.fr</a></p>
          </div>
        </Reveal>
      </div>

      <FormationModal f={open} onClose={() => setOpen(null)} />
    </section>
  );
};

// =====================================================================
// CAS CLIENTS — scrollytelling avant → après.
// Toggle Manuel / Avec IA · count-up (80% / ×4 / 100% / 317h / >98% / 95k€)
// + cas formation au clic · lien Notion.
// =====================================================================
type Stat = { value: number; prefix?: string; suffix?: string; decimals?: number; label: string };
type ClientCase = {
  sector: string; title: string; context: string;
  manual: string; withAI: string; stats: Stat[];
};
const CLIENT_CASES: ClientCase[] = [
  { sector: 'BTP · Rénovation & Structure', title: 'Chiffrage automatisé par IA', context: 'PME 40 collaborateurs · 30 débours / jour / collaborateur.',
    manual: 'Saisie manuelle des notes de débours, DPGF Excel ressaisis à la main — des heures perdues chaque jour sur l\'avant-vente.',
    withAI: 'DPGF Excel & CSV générés automatiquement, intégrés à l\'ERP KALITICS. Les équipes se concentrent sur le chiffrage à valeur ajoutée.',
    stats: [{ value: 80, suffix: ' %', label: 'de temps de saisie économisé' }, { value: 95, suffix: ' k€', label: 'de charge annuelle neutralisée' }] },
  { sector: 'Administration judiciaire', title: 'Audit automatisé par OCR + IA', context: 'Liasses fiscales & documents juridiques · mission 4 mois.',
    manual: 'Lecture et vérification manuelle de chaque dossier — 3h par dossier, risque d\'erreur élevé sur des centaines de pages.',
    withAI: 'OCR + IA avec double vérification automatique. Les collaborateurs réaffectent leur temps à l\'analyse à forte valeur.',
    stats: [{ value: 4, prefix: '×', label: 'plus rapide (3h gagnées / dossier)' }, { value: 100, suffix: ' %', label: 'de fiabilité (double vérif OCR/IA)' }] },
  { sector: 'Adhésifs · Aéronautique & Ferroviaire', title: 'Conformité ADV automatisée', context: 'Comparaison BC vs AR · 1 900 paires / mois.',
    manual: 'Vérification manuelle ligne à ligne — 15 min par dossier, anomalies parfois ratées sous le volume.',
    withAI: 'Comparaison automatique, détection des anomalies, hébergement Europe RGPD, intégration ERP Proginov. 5 min par dossier.',
    stats: [{ value: 317, suffix: ' h', label: 'libérées par mois' }, { value: 98, prefix: '>', suffix: ' %', label: 'd\'anomalies détectées' }] },
];

const CaseChapter: React.FC<{ c: ClientCase }> = ({ c }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-25% 0px -25% 0px' });
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  // Au scroll-in, bascule automatiquement vers « Avec IA » (le récit avant→après)
  useEffect(() => {
    if (inView && !reduce) { const t = setTimeout(() => setMode('ai'), 900); return () => clearTimeout(t); }
    if (inView && reduce) setMode('ai');
  }, [inView, reduce]);

  return (
    <div ref={ref} className="border-t border-cream/12 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
        {/* Narratif avant → après */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">{c.sector}</p>
          <h3 className="mt-2 font-display leading-[0.98] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 56px)' }}>{c.title}</h3>
          <p className="mt-3 text-sm text-cream-dim">{c.context}</p>

          {/* Toggle Manuel / Avec IA */}
          <div className="mt-7 inline-flex rounded-full border border-cream/15 bg-ink p-1">
            {(['manual', 'ai'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`relative rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition ${mode === m ? 'text-ink' : 'text-cream-soft hover:text-cream'}`}>
                {mode === m && <motion.span layoutId={`pill-${c.title}`} className="absolute inset-0 rounded-full bg-green" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">{m === 'manual' ? 'Manuel' : 'Avec IA'}</span>
              </button>
            ))}
          </div>

          <div className="relative mt-6 min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.p key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}
                className={`text-lg leading-relaxed ${mode === 'ai' ? 'text-cream' : 'text-cream-soft'}`}>
                {mode === 'manual' ? c.manual : c.withAI}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Chiffres qui se construisent au scroll */}
        <div className="grid grid-cols-1 gap-6 self-center sm:grid-cols-2">
          {c.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-cream/12 bg-ink-2 p-7">
              <div className="font-display leading-[0.85] text-green tighter" style={{ fontWeight: 900, fontSize: 'clamp(48px, 6vw, 92px)' }}>
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} run={inView} />
              </div>
              <p className="mt-3 text-sm leading-snug text-cream-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FORMATION_CASES = [
  { client: 'ESPACE 2', sector: 'Promotion immobilière', d: 'Formation IA équipes Direction & RH · 2 journées d\'upskilling · charte d\'usage IA · roadmap 90 jours déployée.' },
  { client: 'AVANTIS', sector: 'Conseil & expertise', d: 'Kit Journée IA par métier · document interactif HTML · 6 prompts sectoriels validés · adoption +60 %.' },
  { client: 'GRAVOTECH', sector: 'Industrie / Manufacturing', d: 'Acculturation IA équipes opérationnelles · formation 1 journée outils 2025 · 3 quick wins déployés en 30 jours.' },
  { client: 'CARREFOUR', sector: 'Grande distribution', d: 'Animation formations IA · formation Gemini · 1 journée au niveau groupe.' },
];

const Cases: React.FC = () => (
  <section id="cas" className="bg-ink px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-[1400px]">
      <Kicker>Cas clients</Kicker>
      <Reveal delay={0.06}>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(42px, 8vw, 132px)' }}>
          Des résultats.<br /><span className="outline-green">Pas des slides.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}><p className="mt-7 max-w-xl text-lg text-cream-soft md:text-xl">5 missions, 5 secteurs, des résultats mesurés. Avant → après, en chiffres.</p></Reveal>

      <div className="mt-12">
        {CLIENT_CASES.map((c) => <CaseChapter key={c.title} c={c} />)}
      </div>

      {/* Cas clients formation */}
      <div className="mt-20">
        <Reveal y={16}><h3 className="font-display text-2xl text-cream tight md:text-4xl" style={{ fontWeight: 900 }}>Et côté formation.</h3></Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {FORMATION_CASES.map((c, i) => (
            <Reveal key={c.client} delay={(i % 2) * 0.06} y={20}>
              <div className="group h-full rounded-2xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:border-green/40">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-2xl text-cream tight" style={{ fontWeight: 900 }}>{c.client}</h4>
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-green">{c.sector}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-cream-soft">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal y={16}>
          <a href={NOTION_URL} target="_blank" rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-cream/20 px-6 py-3 text-sm font-bold uppercase tracking-[0.06em] text-cream transition hover:border-green hover:text-green">
            Voir tous les cas clients en détail
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <p className="mt-3 text-xs text-cream-dim">Méthodologies, livrables, retours d'expérience et résultats détaillés.</p>
        </Reveal>
      </div>
    </div>
  </section>
);

// =====================================================================
// DUO
// =====================================================================
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Kicker>Les fondateurs</Kicker>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.88] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 140px)' }}>
            A<span className="text-green">XE</span>M,<br />c'est nous deux.
          </h2>
        </Reveal>
        <Reveal delay={0.12}><p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
          <span className="font-bold text-cream">A</span>lexis <span className="text-green">×</span> Cl<span className="font-bold text-cream">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd : vous parlez à ceux qui livrent.
        </p></Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden border border-cream/12 bg-ink transition-colors hover:border-green/40">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center bg-green text-ink shadow-lg transition-transform hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
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
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.16}>
          <p className="mt-14 text-center font-display text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 110px)' }}>
            Ensemble, <span className="text-green">AXEM</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// CTA FINAL — widget Calendly inline (script async via useEffect)
// =====================================================================
const FinalCTA: React.FC = () => {
  useEffect(() => {
    const SRC = 'https://assets.calendly.com/assets/external/widget.js';
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = SRC; s.async = true;
    document.body.appendChild(s);
    // on ne retire pas le script : il peut servir à d'autres montages
  }, []);
  return (
    <section id="rdv" className="bg-ink px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <Kicker>Premier pas</Kicker>
          <Reveal delay={0.06}>
            <h2 className="font-display leading-[0.88] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 7vw, 110px)' }}>
              Démarrons par un <span className="text-green">diagnostic gratuit.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-md text-lg text-cream-soft md:text-xl">
              30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 space-y-3">
              {['Sans engagement, sans CB', 'Vos 3 quick wins repartis le jour même', 'Réponse & proposition sous 48h'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-sm text-cream-soft">
                  <svg className="h-4 w-4 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>{t}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <a href="mailto:contact@axem-ia.fr" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-cream transition hover:text-green">
              <svg className="h-4 w-4 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
              contact@axem-ia.fr
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-cream/12 bg-white">
            <div className="calendly-inline-widget" data-url={CALENDLY_INLINE} style={{ minWidth: 320, height: 700 }} />
            <noscript>
              <a href={CALENDLY} className="block bg-green px-6 py-4 text-center text-ink" style={{ fontWeight: 900 }}>Réserver un créneau →</a>
            </noscript>
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
      <div className="font-display leading-[0.85] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(64px, 16vw, 260px)' }}>
        AXEM<span className="text-green">.</span>
      </div>
      <div className="mt-12 grid gap-10 border-t border-cream/12 pt-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-xs text-sm text-cream-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
          <ul className="space-y-2 text-sm text-cream-soft">{[['Problème', '#probleme'], ['Méthode', '#methode'], ['Prestations', '#prestations'], ['Formations', '#catalogue'], ['Résultats', '#cas'], ['Le duo', '#duo']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href="#rdv" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
            <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-cream">contact@axem-ia.fr</a></li>
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
// PAGE — arc narratif B : storytelling qui révèle au scroll
// =====================================================================
const Home: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-ink">
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Problem />
        <Method />
        <Services />
        <Manifesto id="manifeste" pre="Notre engagement" big="Que du livrable." post="Chaque mission produit un résultat concret. Pas des slides, pas de la théorie — de l'opérationnel dès J+1." />
        <Catalogue />
        <Cases />
        <Duo />
        <Manifesto pre="Après le déploiement" big="Et on reste." post="Durée moyenne d'un partenariat : 12 mois et plus. Le déploiement n'est qu'un début — ce qui change la trajectoire, c'est ce qui se passe ensuite." />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
