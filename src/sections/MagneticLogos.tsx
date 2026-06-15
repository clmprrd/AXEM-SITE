import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Eyebrow, FadeUp } from './primitives';

// =====================================================================
// §8 — MAGNETIC LOGOS. « Ils nous font confiance. »
// Logos qui suivent légèrement le curseur (aimant doux), N&B → couleur,
// hover → secteur en légende. Pas de témoignage écrit.
// Aimant désactivé en reduced-motion + tactile (no pointer).
// =====================================================================

const LOGOS: { name: string; src: string; sector: string }[] = [
  { name: 'Carrefour',  src: '/logos/carrefour.svg', sector: 'Grande distribution' },
  { name: 'Blackfin',   src: '/logos/blackfin.png',  sector: 'Capital-investissement' },
  { name: 'Avantis',    src: '/logos/avantis.png',   sector: 'Conseil' },
  { name: 'KIT France', src: '/logos/kit.png',       sector: 'Industrie' },
  { name: 'Espace 2',   src: '/logos/espace2.png',   sector: 'Services' },
  { name: 'Socos',      src: '/logos/socos.png',      sector: 'Industrie' },
  { name: 'Gravotech',  src: '/logos/gravotech.png',  sector: 'Marquage & gravure' },
];

const MagnetLogo: React.FC<{ logo: typeof LOGOS[number] }> = ({ logo }) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 15, mass: 0.4 });
  const y = useSpring(my, { stiffness: 180, damping: 15, mass: 0.4 });
  const tx = useTransform(x, (v) => `${v}px`);
  const ty = useTransform(y, (v) => `${v}px`);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      className="group relative flex aspect-[3/2] items-center justify-center rounded-2xl border border-green/10 bg-white/[0.015] p-6 transition-colors duration-300 hover:border-green/25">
      <motion.img
        src={logo.src} alt={logo.name} loading="lazy"
        style={reduce ? undefined : { x: tx, y: ty }}
        className="logo-chip-img max-h-10 w-auto max-w-[140px] object-contain" />
      {/* secteur en légende au hover */}
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10.5px] font-satoshi font-bold uppercase tracking-[0.12em] text-cream-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {logo.sector}
      </span>
    </div>
  );
};

const MagneticLogos: React.FC = () => (
  <section id="confiance" className="section-clip relative px-5 py-[clamp(110px,16vh,200px)] md:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-2xl text-center">
        <FadeUp><div className="flex justify-center"><Eyebrow>Ils nous font confiance</Eyebrow></div></FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(30px, 5vw, 60px)' }}>
            Des marques qui <span className="aurora-text italic">passent à l'action.</span>
          </h2>
        </FadeUp>
      </div>

      <FadeUp delay={0.1}>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {LOGOS.map((l) => <MagnetLogo key={l.name} logo={l} />)}
        </div>
      </FadeUp>
    </div>
  </section>
);

export default MagneticLogos;
