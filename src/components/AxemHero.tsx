import React, { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
// @ts-ignore — composant JS (OGL / WebGL, fallback SafeCanvas intégré)
import Grainient from './Grainient';

// =====================================================================
// AXEM — STUDIO HERO
// Le NOM en héros : « AXEM » géant, chaque lettre magnétique au curseur.
// WebGL discret derrière (Grainient recoloré). Duo Alexis × Clément devant.
// Dark cinématique. Perf-safe : 100% motion values, 0 setState par frame.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// palette Grainient dark cinématique (near-black → vert profond → menthe)
const GRAINIENT_DARK = {
  color1: '#0a1712', color2: '#0e3b2b', color3: '#050605',
  timeSpeed: 0.1, warpStrength: 1.0, warpFrequency: 4.0, warpSpeed: 1.4,
  warpAmplitude: 46.0, blendSoftness: 0.06, noiseScale: 2.0,
  grainAmount: 0.16, grainScale: 1.4, contrast: 1.35, saturation: 1.0, zoom: 0.9,
} as const;

const Letter: React.FC<{ ch: string; px: MotionValue<number>; py: MotionValue<number>; i: number; accent?: boolean }> = ({ ch, px, py, i, accent }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const c = useRef({ x: 0, y: 0 });
  const measure = () => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    c.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => { window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure); };
  }, []);
  const R = 300; // rayon d'influence
  const f = useTransform([px, py], ([x, y]: number[]) => {
    const d = Math.hypot(x - c.current.x, y - c.current.y);
    return Math.max(0, 1 - d / R);
  });
  const tx = useSpring(useTransform([px, f], ([x, ff]: number[]) => (x - c.current.x) * 0.16 * ff), { stiffness: 220, damping: 22, mass: 0.6 });
  const ty = useSpring(useTransform([py, f], ([y, ff]: number[]) => (y - c.current.y) * 0.16 * ff), { stiffness: 220, damping: 22, mass: 0.6 });
  const scale = useSpring(useTransform(f, [0, 1], [1, 1.14]), { stiffness: 220, damping: 20 });
  return (
    <motion.span
      className="inline-block overflow-hidden"
      initial={{ opacity: 0, y: '55%' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.95, delay: 0.15 + i * 0.07, ease }}
    >
      <motion.span
        ref={ref}
        className="inline-block"
        style={{ x: tx, y: ty, scale, color: accent ? 'var(--accent)' : undefined, willChange: 'transform' }}
      >
        {ch}
      </motion.span>
    </motion.span>
  );
};

const AxemName: React.FC = () => {
  const reduce = useReducedMotion();
  const px = useMotionValue(-99999);
  const py = useMotionValue(-99999);
  const onMove = (e: React.PointerEvent) => { if (reduce) return; px.set(e.clientX); py.set(e.clientY); };
  const onLeave = () => { px.set(-99999); py.set(-99999); };
  const letters = 'AXEM'.split('');
  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex select-none items-start justify-center leading-[0.82]"
      aria-label="AXEM"
    >
      <h1 className="flex font-semibold tracking-[-0.05em] text-ink" style={{ fontSize: 'clamp(4rem, 20vw, 15rem)', fontWeight: 700 }}>
        {letters.map((ch, i) => (
          <Letter key={i} ch={ch} px={px} py={py} i={i} />
        ))}
      </h1>
      <span
        className="mt-[0.4em] ml-[0.12em] font-mono font-medium text-accent"
        style={{ fontSize: 'clamp(1rem, 3vw, 2.4rem)', letterSpacing: '0.02em' }}
      >
        IA
      </span>
    </div>
  );
};

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
};

const AxemHero: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24">
      {/* WebGL discret derrière */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {!reduce && (
          <div className="absolute inset-0 opacity-[0.55]">
            <Grainient {...GRAINIENT_DARK} className="h-full w-full" />
          </div>
        )}
        {/* voile pour lisibilité + vignette cinématique */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 30%, transparent 30%, rgba(5,6,5,0.55) 72%, rgba(5,6,5,0.9) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(180deg, transparent, var(--bg))' }} />
      </div>

      {/* eyebrow */}
      <Reveal delay={0.05}>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/60 px-3 py-1 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Studio IA · Alexis&nbsp;×&nbsp;Clément</span>
        </div>
      </Reveal>

      {/* LE NOM */}
      <AxemName />

      {/* baseline serif */}
      <Reveal delay={0.5}>
        <p className="mt-6 max-w-2xl text-center text-[clamp(1.15rem,2.4vw,1.7rem)] leading-snug text-ink">
          Votre partenaire IA, <span className="font-serif italic text-accent">de A à Z.</span>
        </p>
      </Reveal>
      <Reveal delay={0.58}>
        <p className="mt-3 max-w-xl text-center text-[15px] leading-relaxed text-muted">
          On forme, on conseille, on déploie — et on reste à la pointe pour que vous ne soyez <span className="text-ink">jamais dépassés</span>.
        </p>
      </Reveal>

      {/* CTA */}
      <Reveal delay={0.66}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast">
            Prendre rendez-vous <span aria-hidden>→</span>
          </a>
          <a href="#prestations" className="btn inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface/60 px-5 py-2.5 text-sm font-semibold text-ink backdrop-blur hover:border-hairline-strong">
            Découvrir le studio
          </a>
        </div>
      </Reveal>

      {/* DUO — mis en avant */}
      <Reveal delay={0.74}>
        <div className="mt-10 flex items-center gap-3 rounded-full border border-hairline bg-surface/50 py-2 pl-2 pr-5 backdrop-blur">
          <div className="flex -space-x-2.5">
            <img src={CLEMENT_IMG} alt="Clément Predo" className="h-9 w-9 rounded-full object-cover ring-2 ring-bg" loading="lazy" />
            <img src={ALEXIS_IMG} alt="Alexis Zeitoun" className="h-9 w-9 rounded-full object-cover ring-2 ring-bg" loading="lazy" />
          </div>
          <div className="text-left">
            <div className="text-[13px] font-semibold text-ink">Clément Predo &amp; Alexis Zeitoun</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-faint">55 000 abonnés · 2,6 M vues/mois</div>
          </div>
        </div>
      </Reveal>

      {/* scroll cue */}
      <div aria-hidden className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        ↓ scroll
      </div>
    </section>
  );
};

export default AxemHero;
