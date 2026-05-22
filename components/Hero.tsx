import React from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';
import { MagneticButton } from './ui/wow';

// Proposition X — "Editorial Pure"
// Style strict du Design System AXEM IA (Bricolage Grotesque + Playfair italic vert)
const Hero: React.FC = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(12px)' },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as any },
    }),
  };

  return (
    <section className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-24">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: '120px 120px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px]"
          style={{ background: 'radial-gradient(closest-side, #00FA9A, transparent)' }}
          animate={{ opacity: [0.08, 0.18, 0.10] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center gap-3"
        >
          <motion.span
            className="h-2 w-2 bg-[#00FA9A]"
            animate={{ boxShadow: ['0 0 0 #00FA9A', '0 0 12px #00FA9A', '0 0 0 #00FA9A'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
            <EditableText value="Présentation Commerciale · 2025 / 2026" storageKey="hero_eyebrow" />
          </span>
        </motion.div>

        <h1 className="font-display text-[clamp(48px,9vw,160px)] font-light leading-[1.02] tracking-[-0.04em] text-white">
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

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 max-w-2xl text-xl font-light leading-snug text-neutral-400 md:text-2xl"
        >
          <EditableText
            value="Votre partenaire IA, de l'audit à la montée en compétences."
            storageKey="hero_subtitle"
            isTextarea
            className="w-full"
          />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12"
        >
          {[
            { value: '10', label: 'formations' },
            { value: '3', label: 'niveaux' },
            { value: '70 %', label: 'de pratique' },
            { value: 'J+1', label: 'opérationnel' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 + i * 0.08 }}
              className="border-l-2 border-[#00FA9A]/40 pl-4"
            >
              <div className="font-display text-5xl font-light text-[#00FA9A] md:text-6xl">
                {s.value}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-16 flex flex-col items-start gap-4 sm:flex-row"
        >
          <MagneticButton
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            strength={0.4}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#00FA9A] px-8 py-4 text-sm font-semibold text-[#050505]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative">Diagnostic gratuit · 30 min</span>
            <span className="relative">→</span>
          </MagneticButton>
          <MagneticButton
            href="#dualite"
            strength={0.2}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-7 py-4 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.05]"
          >
            Voir notre méthode
            <span className="opacity-60">↓</span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
