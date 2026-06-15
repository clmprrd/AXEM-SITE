import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CountUp } from '../ui/motion';
import { Eyebrow, FadeUp } from './primitives';

// =====================================================================
// §2 — DUO LIVE. « On enseigne ce qu'on déploie. »
// Clément Predo (ESSEC) ‖ Alexis Zeitoun (Polytechnique/Télécom Paris).
// 55 000 abonnés · 2,6 M impressions/mois en ODOMÈTRE qui s'incrémente au
// scroll. Portraits tilt/parallax au hover + N&B → couleur.
// =====================================================================

const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

const FOUNDERS = [
  { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC',
    role: 'Stratégie & Business IA',
    desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit, conseil et formation.",
    li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
  { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Polytechnique · Télécom Paris',
    role: 'Architecture IA, Tech & Déploiement',
    desc: "L'architecte. Je conçois et déploie les systèmes : agents, automatisations, intégrations en production.",
    li: 'https://www.linkedin.com/in/alexis-zeitoun/' },
];

const TiltCard: React.FC<{ f: typeof FOUNDERS[number]; i: number }> = ({ f, i }) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [t, setT] = React.useState({ rx: 0, ry: 0 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ rx: -py * 6, ry: px * 8 });
  };
  const reset = () => setT({ rx: 0, ry: 0 });
  return (
    <FadeUp delay={i * 0.1}>
      <div style={{ perspective: 1000 }}>
        <div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
          className="group glass relative overflow-hidden rounded-3xl transition-transform duration-200 [transform-style:preserve-3d] [transition-timing-function:var(--ease-out)]"
          style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}>
          <div className="relative overflow-hidden">
            <img src={f.img} alt={f.name} loading="lazy"
              className="aspect-[5/4] w-full object-cover grayscale transition-[filter,transform] duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04] group-hover:grayscale-0" />
            <div aria-hidden className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(7,11,22,0.85) 100%)' }} />
            <a href={f.li} target="_blank" rel="noopener noreferrer"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-green/90 text-[#06101F] shadow-lg transition-transform [transition-timing-function:var(--ease-out)] hover:scale-110"
              aria-label={`LinkedIn ${f.name}`}>
              <span className="text-[15px] font-bold">in</span>
            </a>
          </div>
          <div className="p-7 md:p-8">
            <p className="text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cyan">{f.school}</p>
            <h3 className="font-serif-display mt-1 text-[30px] leading-none text-cream">{f.name}</h3>
            <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-cream-soft">{f.role}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-cream-soft">{f.desc}</p>
          </div>
        </div>
      </div>
    </FadeUp>
  );
};

const Odo: React.FC<{ to: number; suffix?: string; decimals?: number; label: string }> = ({ to, suffix, decimals, label }) => (
  <div className="flex flex-col items-center text-center">
    <span className="font-serif-display odometer leading-[0.9] text-cream" style={{ fontSize: 'clamp(40px, 7vw, 76px)' }}>
      <CountUp to={to} suffix={suffix} decimals={decimals} />
    </span>
    <span className="mt-2 max-w-[180px] text-[12px] font-satoshi font-bold uppercase tracking-[0.14em] text-cream-dim">{label}</span>
  </div>
);

const DuoLive: React.FC = () => (
  <section id="duo" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(110px,16vh,220px)] md:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="max-w-2xl">
        <FadeUp><Eyebrow>Le duo</Eyebrow></FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.6vw, 72px)' }}>
            On enseigne <span className="aurora-text italic">ce qu'on déploie.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.12}>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
            Deux experts, un seul interlocuteur. La stratégie et la technique dans la même équipe —
            pas de théorie hors-sol.
          </p>
        </FadeUp>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {FOUNDERS.map((f, i) => <TiltCard key={f.name} f={f} i={i} />)}
      </div>

      {/* ODOMÈTRE — s'incrémente au scroll */}
      <FadeUp delay={0.08}>
        <div className="mt-14 grid grid-cols-2 items-start gap-8 rounded-3xl border border-green/12 bg-white/[0.02] px-6 py-10 md:px-12">
          <Odo to={55000} suffix=" +" label="abonnés LinkedIn cumulés" />
          <Odo to={2.6} decimals={1} suffix=" M" label="impressions / mois" />
        </div>
      </FadeUp>
    </div>
  </section>
);

export default DuoLive;
