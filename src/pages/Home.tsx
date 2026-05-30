import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion, useMotionTemplate, MotionConfig,
  type Variants,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — BOLD TYPOGRAPHIQUE
// Typo géante comme architecture · aplats massifs mint + noir · dark #0F0F0F
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// =====================================================================
// BACKGROUND HERO — Grainient (OGL). 6 mix de couleurs VIFS, virales SaaS.
// (color3 = base saturée, jamais quasi-noire → gradient lumineux, pas vaseux)
// =====================================================================
const PALETTES = {
  iris:   { color1: '#8AB4FF', color2: '#8B5CF6', color3: '#C026D3' }, // bleu → violet → fuchsia
  violet: { color1: '#C9A8FF', color2: '#6D4BFF', color3: '#3F2D9E' }, // lavande → violet → indigo
  sunset: { color1: '#FFD27A', color2: '#FF6B9D', color3: '#7A3DF5' }, // ambre → rose → violet
  ocean:  { color1: '#7DE3FF', color2: '#3B82F6', color3: '#243A8E' }, // cyan → bleu → navy
  coral:  { color1: '#FFC07A', color2: '#FF5E5B', color3: '#B02A6B' }, // pêche → corail → magenta
  mint:   { color1: '#9BFFD9', color2: '#00E0A4', color3: '#0E5C57' }, // mint → émeraude → teal (marque)
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

// ---------- helpers ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
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

// ---------- INTERACTIONS (Premium Retenu) ----------

// Spotlight : radial-gradient piloté par la souris via vars --mx/--my.
// Pur cosmétique (aria-hidden, pointer-events-none) → la lisibilité reste
// totale au repos et sur mobile (pas de hover → gradient invisible).
const Spotlight: React.FC<{ className?: string; color?: string; size?: number }> = ({
  className = '', color = 'rgba(0,250,154,0.10)', size = 360,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  if (reduce) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      onMouseMove={move}
      className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${className}`}
      style={{
        background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 70%)`,
      }}
    />
  );
};

// Variants de cascade (stagger) — reveal une seule fois, transform+opacity only.
const cascade: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cascadeItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

// Glow doux qui pulse derrière le CTA (opacity/scale en boucle légère).
// Coupé en reduced-motion (rien rendu → aucune translation/anim).
const PulseGlow: React.FC<{ className?: string; color?: string }> = ({
  className = '', color = 'rgba(15,15,15,0.45)',
}) => {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl ${className}`}
      style={{ background: color }}
      initial={{ opacity: 0.35, scale: 0.9 }}
      animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.9, 1.08, 0.9] }}
      transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
    />
  );
};

// Barre de progression de scroll — scaleX GPU, originX:0, fixed 3px mint.
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-green"
      style={{ scaleX }}
    />
  );
};

// ---------- NAV ----------
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
          {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream">
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

// ---------- FUSION : Alexis × Clément → AXEM ----------
const Fusion: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => { const a = setTimeout(() => setPhase(1), 1100); const b = setTimeout(() => setPhase(2), 2000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="flex h-7 items-center justify-center" aria-label="Alexis et Clément égalent AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.4em] text-cream-soft">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 90 : 0, scale: phase === 1 ? 1.5 : 1 }} transition={{ duration: 0.5 }} className="text-green">×</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-0.5">
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="font-display text-base tracking-tight text-cream" style={{ fontWeight: 900 }}>{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1 font-display text-base text-green" style={{ fontWeight: 900 }}>IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- HERO : premium centré · fond Grainient vif · façon AI Sisters ----------
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
      {/* BACKGROUND — Grainient vif (OGL) — z-0 dans le stacking context de la section */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0F0F0F]">
        <Grainient {...GRAINIENT} {...PALETTES[pal]} className="h-full w-full" />
      </div>
      {/* lisibilité MINIMALE — on garde le fond LUMINEUX comme la démo React Bits */}
      {/* léger spot derrière le texte seulement (le reste reste vif) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(64% 48% at 50% 42%, rgba(7,7,13,0.5) 0%, rgba(7,7,13,0.22) 44%, transparent 70%)' }} />
      {/* fondu bas vers le fond du site + voile haut discret pour la nav */}
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

      {/* CONTENU */}
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
            <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.35}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.65)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Prendre rendez-vous</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#prestations" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/15">
              Découvrir nos prestations <span aria-hidden>↓</span>
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

// ---------- TRUST : marquee CAPS ----------
const Trust: React.FC = () => {
  // Vrais logos clients/partenaires (extraits + vérifiés). Monochrome blanc, couleur au survol.
  const logos = [
    { src: '/logos/carrefour.svg', alt: 'Carrefour' },
    { src: '/logos/pennylane.svg', alt: 'Pennylane' },
    { src: '/logos/cegos.png', alt: 'Cegos' },
    { src: '/logos/blackfin.png', alt: 'BlackFin Capital' },
    { src: '/logos/gravotech.png', alt: 'Gravotech' },
    { src: '/logos/dragonllm.svg', alt: 'Dragon LLM' },
    { src: '/logos/asphere.png', alt: 'ASphere' },
    { src: '/logos/myconnecting.png', alt: 'myconnecting' },
    { src: '/logos/mammouth.svg', alt: 'Mammouth AI' },
    { src: '/logos/avantis.png', alt: 'Avantis' },
    { src: '/logos/senza.png', alt: 'SENZA' },
  ];
  return (
    <section id="references" className="relative border-y border-white/10 bg-ink-2 py-14 md:py-16">
      <div className="mb-10 flex flex-col items-center gap-2 px-5 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cream-dim">Ils nous font confiance</p>
        <p className="font-display text-lg text-cream/90 md:text-2xl" style={{ fontWeight: 700 }}>Des PME aux grands comptes &amp; administrations.</p>
      </div>
      <motion.div
        className="group relative overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex w-max items-center gap-16 px-8 group-hover:[animation-play-state:paused] md:gap-24" style={{ animation: 'marquee 50s linear infinite' }}>
          {[...logos, ...logos].map((l, i) => (
            <img key={l.alt + i} src={l.src} alt={l.alt} loading="lazy" decoding="async"
              className="h-9 w-auto max-w-[210px] shrink-0 object-contain opacity-70 brightness-0 invert transition duration-300 hover:opacity-100 hover:brightness-100 hover:invert-0 md:h-12" />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ---------- SERVICES : liste typographique massive ----------
const Services: React.FC = () => {
  const items = [
    { n: '01', t: 'Audit IA', d: "On regarde avant de déployer. Diagnostic, cartographie de vos process, scoring de maturité IA.", price: '1 à 4 semaines' },
    { n: '02', t: 'Conseil stratégique', d: "On décide quoi faire, dans quel ordre, avec quels budgets. Roadmap priorisée, choix des outils.", price: 'Sur devis' },
    { n: '03', t: 'Déploiement & automatisation', d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou suivi.", price: 'À partir de 1 200 €' },
    { n: '04', t: 'Formation Qualiopi', d: "Vos équipes opérationnelles dès J+1. 10 formations, 3 niveaux, 70 % de pratique. Finançable OPCO.", price: '200 € – 1 250 € / pers.' },
    { n: '05', t: 'Coaching individuel', d: "Pour vos profils clés : managers, dirigeants, référents IA. On ancre les compétences dans la durée.", price: '200 € / session' },
    { n: '06', t: 'Production IA', d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite.", price: 'Sur devis' },
    { n: '07', t: 'Suivi', d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.", price: '80 € / mois' },
  ];
  return (
    <section id="prestations" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Ce qu'on fait</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
            Sept prestations.<br /><span className="outline-type">Un partenaire.</span>
          </h2>
        </Reveal>

        <motion.div
          className="mt-16 border-t border-cream/12"
          variants={cascade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {items.map((s) => (
            <motion.a
              key={s.n}
              href="#methode"
              variants={cascadeItem}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="group relative block overflow-hidden border-b border-cream/12 py-7 transition-colors hover:bg-ink-2 md:py-9"
            >
              {/* glow de bordure subtil au hover (opacity only) */}
              <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-green/30 transition-opacity duration-300 group-hover:opacity-100" />
              <Spotlight />
              <div className="relative grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 md:grid-cols-[110px_1fr_auto] md:gap-x-8">
                <span className="font-display text-xl text-green transition-transform duration-300 group-hover:translate-x-1 md:text-3xl" style={{ fontWeight: 900 }}>{s.n}</span>
                <h3 className="font-display leading-[0.95] text-cream transition-colors group-hover:text-green tight" style={{ fontWeight: 800, fontSize: 'clamp(26px, 4.2vw, 58px)' }}>{s.t}</h3>
                <span className="col-span-2 text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft md:col-span-1 md:self-center md:whitespace-nowrap">{s.price}</span>
              </div>
              <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-cream-soft md:ml-[142px] md:text-base">{s.d}</p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ---------- DUO ----------
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Les fondateurs</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.88] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 140px)' }}>
            A<span className="text-green">XE</span>M,<br />c'est nous deux.
          </h2>
        </Reveal>
        <Reveal delay={0.16}><p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
          <span className="font-bold text-cream">A</span>lexis <span className="text-green">×</span> Cl<span className="font-bold text-cream">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.
        </p></Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="group relative flex h-full flex-col overflow-hidden border border-cream/12 bg-ink transition-colors hover:border-green/40">
                <Spotlight size={420} />
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0" />
                  {/* overlay : révèle le secondaire (rôle + lien LinkedIn) — nom/rôle restent visibles AU REPOS plus bas */}
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-end bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-green">{f.role}</span>
                  </div>
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
        <Reveal delay={0.2}>
          <p className="mt-14 text-center font-display text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 110px)' }}>
            Ensemble, <span className="text-green">AXEM</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- PROOF : chiffres géants ----------
const Proof: React.FC = () => {
  const stats = [{ v: 55000, p: '+', l: 'abonnés LinkedIn' }, { v: 10, p: '', l: 'formations Qualiopi' }, { v: 70, p: '', s: ' %', l: 'de pratique' }, { v: null, l: 'opérationnel', txt: 'J+1' }];
  const cases = [
    { sector: 'BTP · Chiffrage', val: 80, pre: '', suf: ' %', d: 'de temps de saisie économisé · 95 k€/an neutralisés' },
    { sector: 'Administration · OCR', val: 4, pre: '×', suf: '', d: 'plus rapide · fiabilité 100 % par double vérification' },
    { sector: 'Industrie · Conformité ADV', val: 317, pre: '', suf: ' h', d: 'libérées par mois · anomalies détectées > 98 %' },
  ];
  return (
    <section className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-b border-cream/12 pb-20 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="group cursor-default">
                <div className="font-display leading-[0.85] text-cream transition-colors group-hover:text-green tighter" style={{ fontWeight: 900, fontSize: 'clamp(48px, 7vw, 110px)' }}>
                  {s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-cream-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.05}>
          <h2 className="mt-20 font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          variants={cascade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {cases.map((c) => (
            <motion.div
              key={c.sector}
              variants={cascadeItem}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="group relative flex h-full flex-col gap-4 overflow-hidden border border-cream/12 bg-ink-2 p-8 transition-colors hover:border-green/40 hover:bg-ink-3"
            >
              <Spotlight />
              <span className="relative text-[11px] font-bold uppercase tracking-[0.14em] text-green">{c.sector}</span>
              <span className="relative font-display text-7xl text-cream transition-transform duration-300 group-hover:-translate-y-0.5 tighter md:text-8xl" style={{ fontWeight: 900 }}>
                <Counter value={c.val} prefix={c.pre} suffix={c.suf} />
              </span>
              <p className="relative text-base leading-relaxed text-cream-soft">{c.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ---------- METHOD ----------
const Method: React.FC = () => {
  const steps = [{ n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' }, { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' }, { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' }];
  return (
    <section id="methode" className="border-t border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
            En 3 étapes.<br /><span className="text-green">Pas une de plus.</span>
          </h2>
        </Reveal>
        <div className="relative mt-16">
          {/* fine ligne connectrice (desktop) — se dessine via pathLength, une fois */}
          <svg aria-hidden className="pointer-events-none absolute left-0 right-0 top-[6px] z-10 hidden h-[2px] w-full md:block" preserveAspectRatio="none" viewBox="0 0 100 1">
            <motion.line
              x1="2" y1="0.5" x2="98" y2="0.5" stroke="#00FA9A" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.4"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease }}
            />
          </svg>
          <motion.div
            className="grid gap-px overflow-hidden border border-cream/12 bg-cream/12 md:grid-cols-3"
            variants={cascade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {steps.map((s) => (
              <motion.div
                key={s.n}
                variants={cascadeItem}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="group relative flex h-full flex-col gap-4 overflow-hidden bg-ink-2 p-8 transition-colors hover:bg-ink-3 md:p-10"
              >
                <Spotlight />
                <div className="relative flex items-center justify-between">
                  <span className="font-display text-7xl text-cream transition-colors group-hover:text-green tighter md:text-8xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  <span className="bg-green px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                </div>
                <h3 className="relative font-display text-3xl text-cream tight md:text-4xl" style={{ fontWeight: 800 }}>{s.t}</h3>
                <p className="relative text-base leading-relaxed text-cream-soft">{s.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ---------- FINAL CTA : aplat mint massif ----------
const FinalCTA: React.FC = () => (
  <section className="px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-[1400px] bg-green px-6 py-24 text-center md:px-16 md:py-32">
      <Reveal>
        <h2 className="mx-auto font-display leading-[0.86] text-ink tighter" style={{ fontWeight: 900, fontSize: 'clamp(46px, 9vw, 170px)' }}>
          Parlons<br />de votre projet.
        </h2>
      </Reveal>
      <Reveal delay={0.1}><p className="mx-auto mt-8 max-w-xl text-lg font-medium text-ink/70 md:text-xl">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p></Reveal>
      <Reveal delay={0.2}>
        <span className="relative mt-12 inline-flex">
          <PulseGlow />
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.35}
            className="group relative inline-flex items-center gap-3 bg-ink px-10 py-5 text-base uppercase tracking-[0.04em] text-green" style={{ fontWeight: 900 }}>
            Réserver un diagnostic gratuit <span className="transition-transform group-hover:translate-x-1">→</span>
          </Magnetic>
        </span>
      </Reveal>
    </div>
  </section>
);

// ---------- FOOTER ----------
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
          <ul className="space-y-2 text-sm text-cream-soft">{[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
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

const Home: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-ink">
      <ScrollProgress />
      <Nav />
      <main><Hero /><Trust /><Services /><Duo /><Proof /><Method /><FinalCTA /></main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
