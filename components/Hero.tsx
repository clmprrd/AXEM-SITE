import React, { useEffect, useRef } from 'react';
import EditableText from './ui/EditableText';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { MagneticButton, AnimatedCount, MarqueeLogos } from './ui/wow';

// === FINAL AXEM HERO ===
// DA Linear (grid + halo + magnetic + marquee) en couleurs AXEM officielles.
// Vert #00FA9A + Bricolage Grotesque + Playfair italic mots-pivots.
// + Spotlight cursor-tracked sur le grid (effet "torche").
// + Stats animés avec AnimatedCount.
// + Marquee logos clients réels du PDF.
const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  // Mouse-tracked spotlight on the grid
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const smx = useSpring(mx, { stiffness: 80, damping: 26 });
  const smy = useSpring(my, { stiffness: 80, damping: 26 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${smx}% ${smy}%, rgba(0,250,154,0.10), transparent 60%)`;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width) * 100);
      my.set(((e.clientY - r.top) / r.height) * 100);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mx, my]);

  const titleVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(12px)' },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as any },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-24"
      aria-label="AXEM IA — Hero"
    >
      {/* === BACKGROUND : grid + halo + cursor spotlight === */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* fine grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(ellipse 85% 65% at 50% 35%, black 50%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 65% at 50% 35%, black 50%, transparent 100%)',
          }}
        />
        {/* breathing accent halo */}
        <motion.div
          className="absolute left-1/2 top-[18%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(closest-side, #00FA9A, transparent)' }}
          animate={{ opacity: [0.16, 0.30, 0.18], scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* CURSOR SPOTLIGHT — illumine le grid à la position de la souris */}
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#050505]" />
      </div>

      <div className="mx-auto w-full max-w-[1280px]">
        {/* === Eyebrow vert + carré pulsant === */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <a
            href="#dualite"
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm transition-all duration-200 hover:border-[#00FA9A]/40 hover:bg-[#00FA9A]/[0.06]"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[#00FA9A]"
              animate={{ boxShadow: ['0 0 0 #00FA9A', '0 0 14px #00FA9A', '0 0 0 #00FA9A'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#00FA9A]">
              <EditableText value="Présentation Commerciale · 2025 / 2026" storageKey="hero_eyebrow" />
            </span>
            <span className="text-xs text-[#00FA9A] transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </motion.div>

        {/* === Title — Bricolage Grotesque 160px light + Playfair italic vert === */}
        <h1 className="font-display text-[clamp(48px,8.5vw,148px)] font-light leading-[1.02] tracking-[-0.04em] text-white">
          <motion.span variants={titleVariants} custom={0} initial="hidden" animate="visible" className="block">
            <EditableText value="Rendre l'IA" storageKey="hero_title_1" />{' '}
            <span className="font-playfair italic font-normal text-[#00FA9A]">
              <EditableText value="simple," storageKey="hero_title_simple" />
            </span>
          </motion.span>
          <motion.span variants={titleVariants} custom={1} initial="hidden" animate="visible" className="block">
            <EditableText value="rentable et" storageKey="hero_title_2" />{' '}
            <span className="font-playfair italic font-normal text-[#00FA9A]">
              <EditableText value="actionnable." storageKey="hero_title_actionnable" />
            </span>
          </motion.span>
        </h1>

        {/* === Subtitle === */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 max-w-2xl text-lg font-light leading-snug text-neutral-400 md:text-xl"
        >
          <EditableText
            value="Votre partenaire IA, de l'audit à la montée en compétences. Formation Qualiopi, conseil stratégique, déploiement & production."
            storageKey="hero_subtitle"
            isTextarea
            className="w-full"
          />
        </motion.p>

        {/* === Stats animés === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-14 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12"
        >
          {[
            { value: 10, suffix: '', label: 'formations' },
            { value: 3, suffix: '', label: 'niveaux' },
            { value: 70, suffix: ' %', label: 'de pratique' },
            { value: null as null | number, label: 'opérationnel' }, // J+1 static
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 + i * 0.08 }}
              whileHover={{ x: 4 }}
              className="cursor-default border-l-2 border-[#00FA9A]/40 pl-4 transition-colors hover:border-[#00FA9A]"
            >
              <div className="font-display text-5xl font-light text-[#00FA9A] md:text-6xl">
                {s.value !== null ? (
                  <>
                    <AnimatedCount value={s.value} suffix={s.suffix} />
                  </>
                ) : (
                  'J+1'
                )}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* === CTAs magnétiques === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-14 flex flex-col items-start gap-3 sm:flex-row sm:gap-4"
        >
          <MagneticButton
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            strength={0.4}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#00FA9A] px-8 py-4 text-sm font-semibold text-[#050505] shadow-[0_0_0_1px_rgba(0,250,154,0.4),0_0_40px_-8px_rgba(0,250,154,0.6)]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative">Diagnostic gratuit · 30 min</span>
            <span className="relative transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </MagneticButton>
          <MagneticButton
            href="#dualite"
            strength={0.25}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-7 py-4 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.05]"
          >
            Voir notre méthode
            <span className="opacity-60 transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
          </MagneticButton>
        </motion.div>

        {/* === Marquee logos clients (RÉELS du PDF) avec fade mask === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="mt-24 w-full"
        >
          <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            <span className="h-px w-8 bg-neutral-700" />
            Ils nous font confiance
            <span className="h-px flex-1 bg-neutral-800" />
          </div>
          <MarqueeLogos
            logos={['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos Services', 'Gravotech', 'Cegos', 'myconnecting', 'synapse ia', 'ASphere', 'SENZA Formations']}
            speed={36}
            itemClassName="font-display text-2xl font-light text-neutral-400/85 tracking-tight"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
