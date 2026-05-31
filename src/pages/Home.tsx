import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, MotionConfig, useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion, type MotionValue,
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

// Titre split-text « masque » : chaque mot monte depuis un masque (clip), stagger, once.
// Lignes séparées par « | ». Sémantique conservée via aria-label.
const MaskTitle: React.FC<{
  lines: { text: string; className?: string }[];
  className?: string;
  delay?: number;
  stagger?: number;
}> = ({ lines, className = '', delay = 0, stagger = 0.07 }) => {
  let idx = 0;
  const full = lines.map((l) => l.text).join(' ');
  return (
    <span className={className} aria-label={full}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.text.split(' ').map((w, wi) => {
            const d = delay + idx * stagger;
            idx += 1;
            return (
              <span key={wi} className="inline-block overflow-hidden align-bottom pb-[0.06em]">
                <motion.span
                  className={`inline-block ${line.className ?? ''}`}
                  initial={{ y: '108%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.8, delay: d, ease }}
                >
                  {w}
                </motion.span>
                {wi < line.text.split(' ').length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

// petit hook responsive (md+) — évite sticky/hover lourds sur mobile
const useIsDesktop = () => {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setD(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return d;
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
      <div className="group relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)' }}>
        <div className="flex w-max items-center gap-16 px-8 group-hover:[animation-play-state:paused] md:gap-24" style={{ animation: 'marquee 50s linear infinite' }}>
          {[...logos, ...logos].map((l, i) => (
            <img key={l.alt + i} src={l.src} alt={l.alt} loading="lazy" decoding="async"
              className="h-9 w-auto max-w-[210px] shrink-0 object-contain opacity-70 brightness-0 invert transition duration-300 hover:opacity-100 hover:brightness-100 hover:invert-0 md:h-12" />
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- SERVICES : liste typo interactive + panneau latéral / accordéon ----------
type Service = {
  n: string; t: string; d: string; price: string;
  result: string; // phrase de résultat
  kw: string;      // mot-clé animé dans le panneau
  gauge?: number;  // mini-jauge optionnelle (0–100)
};

// Mini-jauge animée (transform scaleX, opacity) — purement décorative
const Gauge: React.FC<{ value: number; active: boolean }> = ({ value, active }) => (
  <div aria-hidden className="mt-5 h-[3px] w-full overflow-hidden bg-cream/12">
    <motion.div
      className="h-full origin-left bg-green"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: active ? value / 100 : 0 }}
      transition={{ duration: 0.5, ease }}
    />
  </div>
);

// Panneau de détail (desktop : latéral sticky ; mobile : accordéon)
const ServicePanel: React.FC<{ s: Service }> = ({ s }) => (
  <div>
    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-green">{s.kw}</div>
    <div className="mt-4 font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 4.4vw, 64px)' }}>
      {s.price}
    </div>
    <p className="mt-5 max-w-sm text-base leading-relaxed text-cream-soft">{s.d}</p>
    <div className="mt-6 flex items-start gap-2.5 border-t border-cream/12 pt-5">
      <svg aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <p className="text-[15px] font-semibold leading-snug text-cream">{s.result}</p>
    </div>
    {typeof s.gauge === 'number' && <Gauge value={s.gauge} active />}
  </div>
);

// Une ligne de la liste typo
const ServiceRow: React.FC<{
  s: Service;
  i: number;
  active: boolean;
  dim: boolean;
  desktop: boolean;
  open: boolean;
  onHover: () => void;
  onToggle: () => void;
}> = ({ s, i, active, dim, desktop, open, onHover, onToggle }) => {
  return (
    <Reveal delay={(i % 3) * 0.05}>
      <div
        onMouseEnter={desktop ? onHover : undefined}
        className="border-b border-cream/12"
      >
        {/* ligne cliquable — href réel sur desktop (CTA), toggle sur mobile */}
        {desktop ? (
          <a
            href="#methode"
            className="group block py-6 outline-none md:py-7"
            aria-label={`${s.t} — ${s.price}`}
          >
            <div className="grid grid-cols-[64px_1fr_auto] items-baseline gap-x-6">
              <span
                className="font-display text-xl transition-colors md:text-2xl"
                style={{ fontWeight: 900, color: active ? '#00FA9A' : dim ? '#6E6E68' : '#A8A8A2' }}
              >
                {s.n}
              </span>
              <motion.h3
                className="font-display leading-[0.95] tight"
                style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 60px)' }}
                animate={{
                  color: active ? '#FAFAF7' : dim ? '#3a3a36' : '#FAFAF7',
                  x: active ? 10 : 0,
                  opacity: dim ? 0.5 : 1,
                }}
                transition={{ duration: 0.28, ease }}
              >
                {s.t}
              </motion.h3>
              {/* prix TOUJOURS visible au repos */}
              <span className="self-center whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft md:text-[12px]">
                {s.price}
              </span>
            </div>
          </a>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="block w-full py-5 text-left"
          >
            <div className="grid grid-cols-[40px_1fr] items-baseline gap-x-4">
              <span className="font-display text-lg text-green" style={{ fontWeight: 900 }}>{s.n}</span>
              <div className="min-w-0">
                <h3 className="font-display leading-[0.98] text-cream tight" style={{ fontWeight: 800, fontSize: 'clamp(26px, 8vw, 40px)' }}>{s.t}</h3>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft">{s.price}</span>
                  <motion.span aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} className="text-2xl leading-none text-green">+</motion.span>
                </div>
              </div>
            </div>
            {/* accordéon mobile */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="acc"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="overflow-hidden"
                >
                  <div className="pl-[56px] pt-5">
                    <ServicePanel s={s} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>
    </Reveal>
  );
};

const Services: React.FC = () => {
  const items: Service[] = [
    { n: '01', t: 'Audit IA', d: "On regarde avant de déployer. Diagnostic, cartographie de vos process, scoring de maturité IA.", price: '1 à 4 semaines', result: 'On sait quoi automatiser — et ce qu\'il ne faut surtout pas.', kw: 'Cartographie', gauge: 65 },
    { n: '02', t: 'Conseil stratégique', d: "On décide quoi faire, dans quel ordre, avec quels budgets. Roadmap priorisée, choix des outils.", price: 'Sur devis', result: 'Une roadmap priorisée, pas une liste de bonnes intentions.', kw: 'Roadmap', gauge: 80 },
    { n: '03', t: 'Déploiement & automatisation', d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou suivi.", price: 'À partir de 1 200 €', result: 'Des workflows qui tournent seuls, 7j/7, sans vous.', kw: 'n8n · Make · Claude', gauge: 95 },
    { n: '04', t: 'Formation Qualiopi', d: "Vos équipes opérationnelles dès J+1. 10 formations, 3 niveaux, 70 % de pratique. Finançable OPCO.", price: '200 € – 1 250 € / pers.', result: 'Vos équipes opérationnelles dès la sortie de salle.', kw: '70 % de pratique', gauge: 70 },
    { n: '05', t: 'Coaching individuel', d: "Pour vos profils clés : managers, dirigeants, référents IA. On ancre les compétences dans la durée.", price: '200 € / session', result: 'Vos référents IA montent en autonomie, séance après séance.', kw: 'Sur-mesure', gauge: 60 },
    { n: '06', t: 'Production IA', d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite.", price: 'Sur devis', result: 'Du contenu produit 10× plus vite, à votre marque.', kw: '10× plus vite', gauge: 90 },
    { n: '07', t: 'Suivi', d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.", price: '80 € / mois', result: 'On reste. Maintenance, évolutions, nouvelles automatisations.', kw: 'Long terme', gauge: 50 },
  ];
  const desktop = useIsDesktop();
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(null);

  return (
    <section id="prestations" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Ce qu'on fait</div></Reveal>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
          <MaskTitle lines={[{ text: 'Sept prestations.' }, { text: 'Un partenaire.', className: 'outline-type' }]} />
        </h2>

        {/* desktop : liste + panneau latéral sticky ; mobile : accordéon */}
        <div className="mt-16 grid gap-x-14 md:grid-cols-[1fr_minmax(320px,400px)]">
          {/* colonne liste */}
          <div
            className="border-t border-cream/12"
            onMouseLeave={desktop ? () => setActive(0) : undefined}
          >
            {items.map((s, i) => (
              <ServiceRow
                key={s.n}
                s={s}
                i={i}
                desktop={desktop}
                active={desktop && active === i}
                dim={desktop && active !== i}
                open={openMobile === i}
                onHover={() => setActive(i)}
                onToggle={() => setOpenMobile((o) => (o === i ? null : i))}
              />
            ))}
          </div>

          {/* colonne panneau (desktop only) */}
          <div className="hidden md:block">
            <div className="sticky top-28 border border-cream/12 bg-ink-2 p-8">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-dim">Prestation {items[active].n}</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease }}
                  className="mt-3"
                >
                  <ServicePanel s={items[active]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
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
        <Reveal delay={0.2}>
          <p className="mt-14 text-center font-display text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 110px)' }}>
            Ensemble, <span className="text-green">AXEM</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- MANIFESTE : respiration full-typo (noir quasi pur) ----------
// Punchline réutilisée du hero (« Et on reste. ») — sens conservé.
const Manifesto: React.FC<{ id?: string; line: { text: string; className?: string }[]; kicker?: string }> = ({ id, line, kicker }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // léger parallax/scale du bloc (transform only) — désactivé en reduced-motion
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.94, 1, 1.04]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.15, 1, 1, 0.15]);
  return (
    <section ref={ref} id={id} className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#080808] px-5 py-32 md:py-44">
      <motion.div style={{ scale, opacity }} className="mx-auto max-w-[1400px] text-center">
        {kicker && <div className="mb-7 text-[11px] font-bold uppercase tracking-[0.3em] text-green">{kicker}</div>}
        <h2 className="font-display leading-[0.86] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(56px, 13vw, 220px)' }}>
          <MaskTitle lines={line} stagger={0.09} />
        </h2>
      </motion.div>
    </section>
  );
};

// ---------- PROOF : scrollytelling avant → après ----------
type CaseStudy = {
  sector: string;
  before: { label: string; value: string; note: string };
  after: { label: string; value: string; note: string };
  punch: string; // gros chiffre « qui atterrit »
};

// Un cas client : se construit au scroll (AVANT gris → bascule → APRÈS qui atterrit)
const CaseBlock: React.FC<{ c: CaseStudy; i: number }> = ({ c, i }) => {
  const [view, setView] = useState<'before' | 'after'>('before');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const reduce = useReducedMotion();

  // au scroll : on bascule automatiquement sur APRÈS quand le bloc entre en vue
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setView('after'); return; }
    const t = setTimeout(() => setView('after'), 650);
    return () => clearTimeout(t);
  }, [inView, reduce]);

  const isAfter = view === 'after';
  const data = isAfter ? c.after : c.before;

  return (
    <Reveal delay={i * 0.05}>
      <div ref={ref} className="border-t border-cream/12 py-12 md:py-16">
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,300px)_1fr]">
          {/* secteur + toggle Avant/Après */}
          <div>
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-green">
              <span className="font-display text-lg text-cream-dim" style={{ fontWeight: 900 }}>0{i + 1}</span>
              {c.sector}
            </div>
            <div role="group" aria-label="Avant ou après IA" className="mt-5 inline-flex items-center gap-1 border border-cream/15 p-1">
              {(['before', 'after'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setView(k)}
                  aria-pressed={view === k}
                  className={`relative px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${view === k ? (k === 'after' ? 'text-ink' : 'text-cream') : 'text-cream-dim hover:text-cream-soft'}`}
                >
                  {view === k && (
                    <motion.span
                      layoutId={`seg-${i}`}
                      className={`absolute inset-0 -z-0 ${k === 'after' ? 'bg-green' : 'bg-cream/12'}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{k === 'before' ? 'Manuel' : 'Avec IA'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* comparatif : 2 colonnes (gris manuel / mint avec IA), la colonne active s'illumine */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* AVANT */}
            <motion.div
              animate={{ opacity: isAfter ? 0.4 : 1 }}
              transition={{ duration: 0.3, ease }}
              className="border border-cream/12 bg-ink-2 p-6 md:p-7"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream-dim">{c.before.label}</div>
              <div className="mt-3 font-display leading-[0.85] text-cream-soft tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 6vw, 76px)' }}>{c.before.value}</div>
              <p className="mt-3 text-sm leading-relaxed text-cream-dim">{c.before.note}</p>
            </motion.div>

            {/* APRÈS — le résultat qui atterrit (count-up via AnimatePresence) */}
            <motion.div
              animate={{
                opacity: isAfter ? 1 : 0.5,
                borderColor: isAfter ? 'rgba(0,250,154,0.5)' : 'rgba(250,250,247,0.12)',
              }}
              transition={{ duration: 0.3, ease }}
              className="border bg-ink-2 p-6 md:p-7"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-green">{c.after.label}</div>
              <div className="mt-3 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isAfter ? 'on' : 'off'}
                    initial={{ y: isAfter ? '60%' : 0, opacity: isAfter ? 0 : 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.45, ease }}
                    className="font-display leading-[0.85] text-green tighter"
                    style={{ fontWeight: 900, fontSize: 'clamp(40px, 6vw, 76px)' }}
                  >
                    {c.after.value}
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream-soft">{c.after.note}</p>
            </motion.div>
          </div>
        </div>

        {/* la punchline résultat, gros, lisible sans anim */}
        <div className="mt-8 flex items-baseline gap-4 md:ml-[332px]">
          <span aria-hidden className="font-display text-green" style={{ fontWeight: 900, fontSize: 'clamp(28px, 3vw, 40px)' }}>→</span>
          <p className="font-display leading-[0.95] text-cream tight" style={{ fontWeight: 800, fontSize: 'clamp(20px, 2.4vw, 34px)' }}>{c.punch}</p>
        </div>
      </div>
    </Reveal>
  );
};

const Proof: React.FC = () => {
  const stats = [{ v: 55000, p: '+', l: 'abonnés LinkedIn' }, { v: 10, p: '', l: 'formations Qualiopi' }, { v: 70, p: '', s: ' %', l: 'de pratique' }, { v: null, l: 'opérationnel', txt: 'J+1' }];
  const cases: CaseStudy[] = [
    {
      sector: 'BTP · Chiffrage',
      before: { label: 'Saisie manuelle', value: '100 %', note: 'Chiffrage ressaisi à la main, lent et coûteux.' },
      after: { label: 'Temps économisé', value: '80 %', note: 'de temps de saisie économisé sur chaque devis.' },
      punch: '95 k€/an neutralisés.',
    },
    {
      sector: 'Administration · OCR',
      before: { label: 'Traitement manuel', value: '×1', note: 'Lecture et contrôle des documents un par un.' },
      after: { label: 'Vitesse', value: '×4', note: 'plus rapide, fiabilité 100 % par double vérification.' },
      punch: 'Zéro erreur de saisie.',
    },
    {
      sector: 'Industrie · Conformité ADV',
      before: { label: 'Contrôle manuel', value: '0 h', note: 'Vérifications de conformité chronophages.' },
      after: { label: 'Temps libéré', value: '317 h', note: 'libérées par mois, anomalies détectées > 98 %.' },
      punch: 'Plus de 98 % d\'anomalies détectées.',
    },
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

        <div className="mt-20">
          <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Avant · Après</div></Reveal>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
            <MaskTitle lines={[{ text: 'Des résultats.' }, { text: 'Pas des slides.', className: 'outline-green' }]} />
          </h2>
        </div>

        <div className="mt-14">
          {cases.map((c, i) => (
            <CaseBlock key={c.sector} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- METHOD : chapitres sticky plein écran ----------
type Chapter = { n: string; t: string; d: string; meta: string };

// Un chapitre sticky (desktop) : 100vh, chiffre géant en ancre, cross-fade via progress
const MethodChapter: React.FC<{
  s: Chapter;
  i: number;
  total: number;
  progress: MotionValue<number>;
}> = ({ s, i, total, progress }) => {
  const reduce = useReducedMotion();
  // fenêtre de ce chapitre dans la progression globale [0..1]
  const seg = 1 / total;
  const start = i * seg;
  const end = (i + 1) * seg;
  const mid = start + seg / 2;
  // transitions cinématiques : apparition / sortie (transform + opacity uniquement)
  const opacity = useTransform(
    progress,
    [start - 0.02, start + seg * 0.18, end - seg * 0.18, end + 0.02],
    i === 0 ? [1, 1, 1, 0] : i === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, mid, end], reduce ? [0, 0, 0] : [60, 0, -60]);
  // le chiffre géant glisse légèrement à contre-sens → parallax
  const numY = useTransform(progress, [start, end], reduce ? [0, 0] : [80, -80]);
  const numOpacity = useTransform(progress, [start - 0.02, mid, end + 0.02], [0.12, 1, 0.12]);

  return (
    <div className="relative sticky top-0 flex h-screen items-center overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        {/* CHIFFRE GÉANT — ancre visuelle */}
        <motion.div
          aria-hidden
          style={{ y: numY, opacity: numOpacity }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 -translate-y-1/2 text-center font-display leading-none text-cream/[0.06] tighter"
        >
          <span style={{ fontWeight: 900, fontSize: 'clamp(180px, 42vw, 540px)' }}>{s.n}</span>
        </motion.div>

        {/* CONTENU du chapitre */}
        <motion.div style={{ opacity, y }} className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-3">
            <span className="font-display text-2xl text-green" style={{ fontWeight: 900 }}>{s.n}</span>
            <span className="h-px w-12 bg-cream/20" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cream-soft">Étape {i + 1} / {total}</span>
          </div>
          <h3 className="mt-6 font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(56px, 11vw, 150px)' }}>{s.t}</h3>
          <div className="mt-6 inline-block bg-green px-6 py-2 font-display text-2xl text-ink tight md:text-4xl" style={{ fontWeight: 900 }}>{s.meta}</div>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-cream-soft md:text-xl">{s.d}</p>
        </motion.div>
      </div>
    </div>
  );
};

const Method: React.FC = () => {
  const steps: Chapter[] = [
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  const desktop = useIsDesktop();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  // index de chapitre courant pour la barre de progression
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      setCur(Math.min(steps.length - 1, Math.floor(v * steps.length + 0.0001)));
    });
    return () => unsub();
  }, [progress, steps.length]);

  return (
    <section id="methode" className="border-t border-cream/10 bg-ink-2">
      {/* En-tête de section */}
      <div className="mx-auto max-w-[1400px] px-5 pb-4 pt-28 md:px-8 md:pt-36">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />La méthode</div></Reveal>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
          <MaskTitle lines={[{ text: 'En 3 étapes.' }, { text: 'Pas une de plus.', className: 'text-green' }]} />
        </h2>
      </div>

      {desktop ? (
        // DESKTOP : chapitres sticky plein écran (hauteur = N × 100vh)
        <div ref={wrapRef} className="relative" style={{ height: `${steps.length * 100}vh` }}>
          {/* barre de progression chapitres (fixed dans la fenêtre) */}
          <div className="pointer-events-none sticky top-0 z-20 flex h-0 justify-center">
            <div className="mt-6 flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.n} className="h-1 w-10 overflow-hidden bg-cream/15">
                  <motion.div className="h-full origin-left bg-green" animate={{ scaleX: i <= cur ? 1 : 0 }} transition={{ duration: 0.3, ease }} />
                </div>
              ))}
            </div>
          </div>
          {steps.map((s, i) => (
            <MethodChapter key={s.n} s={s} i={i} total={steps.length} progress={progress} />
          ))}
        </div>
      ) : (
        // MOBILE : fallback empilé simple (pas de sticky lourd)
        <div className="mx-auto max-w-[1400px] space-y-5 px-5 pb-28 pt-10">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="relative overflow-hidden border border-cream/12 bg-ink p-7">
                <span aria-hidden className="pointer-events-none absolute -right-4 -top-8 font-display leading-none text-cream/[0.06]" style={{ fontWeight: 900, fontSize: '160px' }}>{s.n}</span>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl text-green" style={{ fontWeight: 900 }}>{s.n}</span>
                    <span className="bg-green px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                  </div>
                  <h3 className="mt-4 font-display text-4xl text-cream tight" style={{ fontWeight: 900 }}>{s.t}</h3>
                  <p className="mt-3 text-base leading-relaxed text-cream-soft">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
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
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.35}
          className="group mt-12 inline-flex items-center gap-3 bg-ink px-10 py-5 text-base uppercase tracking-[0.04em] text-green" style={{ fontWeight: 900 }}>
          Réserver un diagnostic gratuit <span className="transition-transform group-hover:translate-x-1">→</span>
        </Magnetic>
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
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Services />
        {/* respiration full-typo entre deux sections denses */}
        <Manifesto kicker="Notre promesse" line={[{ text: 'Que du' }, { text: 'livrable.', className: 'text-green' }]} />
        <Duo />
        <Proof />
        {/* seconde respiration — punchline du hero réutilisée */}
        <Manifesto line={[{ text: 'Et on' }, { text: 'reste.', className: 'text-green' }]} />
        <Method />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
