import React from 'react';
import { motion, useReducedMotion, animate, useInView } from 'framer-motion';

// =====================================================================
// PRIMITIVES DU TERRAIN DE JEU
// Briques jouables réutilisées par les sections interactives :
//  · PlaySlider — curseur tactile/clavier accessible (drag + flèches)
//  · LiveNumber — count-up live piloté par une valeur (pas seulement once)
//  · CurrentWire — fil de courant SVG qui pulse entre deux points
//  · Eyebrow — surcouche éditoriale
// transform/opacity only. reduced-motion → versions statiques/cliquables.
// =====================================================================

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="eyebrow mb-5 inline-flex items-center gap-2.5 text-[11px] text-cyan">
    <span className="h-1.5 w-1.5 rounded-full bg-green" />{children}
  </div>
);

// ---------------------------------------------------------------------
// PlaySlider — curseur jouable. Drag (pointer), clavier (←/→), tactile OK.
// Le thumb est un vrai <input range> invisible superposé (a11y native) +
// une piste custom dessinée. Valeur affichée par le parent.
// ---------------------------------------------------------------------
export const PlaySlider: React.FC<{
  value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
  label: string; ariaLabel?: string;
  format?: (v: number) => string;
  accent?: string; // couleur de la portion remplie
}> = ({ value, min, max, step = 1, onChange, label, ariaLabel, format, accent = '#5B8CFF' }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full select-none">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-cream-soft">{label}</span>
        <span className="font-serif-display text-2xl leading-none text-cream tnum">
          {format ? format(value) : value}
        </span>
      </div>
      <div className="relative h-9">
        {/* piste */}
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full rounded-full transition-[width] duration-150 [transition-timing-function:var(--ease-out)]"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, #38BDF8)` }} />
        </div>
        {/* thumb visuel */}
        <div aria-hidden
          className="pointer-events-none absolute top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 shadow-[0_4px_14px_-2px_rgba(20,40,110,0.9)] transition-[left] duration-150 [transition-timing-function:var(--ease-out)]"
          style={{ left: `${pct}%`, background: accent }}>
          <span className="absolute inset-1 rounded-full bg-white/25" />
        </div>
        {/* input natif transparent par-dessus : drag + clavier + tactile */}
        <input
          type="range" min={min} max={max} step={step} value={value}
          aria-label={ariaLabel ?? label}
          onChange={(e) => onChange(Number(e.target.value))}
          className="play-range absolute inset-0 z-20 w-full cursor-grab opacity-0 active:cursor-grabbing"
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// LiveNumber — count-up qui SUIT une valeur cible qui change (curseurs).
// ease-out-expo. reduced-motion → valeur finale directe. tabular nums.
// ---------------------------------------------------------------------
export const LiveNumber: React.FC<{
  value: number; format?: (v: number) => string; className?: string; duration?: number;
}> = ({ value, format, className, duration = 0.9 }) => {
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(value);
  const prev = React.useRef(value);
  React.useEffect(() => {
    if (reduce) { setDisplay(value); prev.current = value; return; }
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce, duration]);
  return (
    <span className={`tnum ${className ?? ''}`}>
      {format ? format(Math.round(display)) : Math.round(display)}
    </span>
  );
};

// ---------------------------------------------------------------------
// CurrentWire — fil de courant SVG horizontal qui pulse (un point lumineux
// qui circule). Relie « ce que vous donnez » → « ce qu'on récupère ».
// reduced-motion → trait statique avec dégradé (pas de point animé).
// ---------------------------------------------------------------------
export const CurrentWire: React.FC<{ active?: boolean; className?: string }> = ({ active = true, className }) => {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden
      className={className} fill="none">
      <defs>
        <linearGradient id="wireGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5B8CFF" stopOpacity="0.25" />
          <stop offset="0.5" stopColor="#38BDF8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5B8CFF" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M2 12 H198" stroke="url(#wireGrad)" strokeWidth="2" strokeLinecap="round"
        strokeDasharray="1 7" />
      {!reduce && active && (
        <motion.circle r="3.4" cy="12" fill="#38BDF8"
          animate={{ cx: [4, 196] }}
          transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.9))' }} />
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------
// SectionReveal — wrapper d'entrée léger pour les sections (opacity+y).
// ---------------------------------------------------------------------
export const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className,
}) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <motion.div ref={ref} className={className}
      initial={reduce ? { opacity: 0.001 } : { opacity: 0.001, y: 36 }}
      animate={inView ? (reduce ? { opacity: 1 } : { opacity: 1, y: 0 }) : undefined}
      transition={reduce ? { duration: 0.3, delay } : { type: 'spring', stiffness: 320, damping: 60, mass: 1, delay }}>
      {children}
    </motion.div>
  );
};
