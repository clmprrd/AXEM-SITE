import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MagneticButton, MarqueeLogos } from './ui/wow';

// Direction A — "Linear Engineered" (v3, WOW edition)
// Adds: magnetic CTAs, infinite marquee logos with fade mask, animated CTA shimmer,
// shimmering accent halo with motion, mouse-tracked grid spotlight.
const Hero: React.FC = () => {
  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 pt-40 pb-32"
      aria-label="AXEM IA — Hero"
    >
      {/* === Background: grid + breathing halo === */}
      <div className="absolute inset-0 -z-10">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 30%, black 50%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 30%, black 50%, transparent 100%)',
          }}
        />
        {/* breathing accent halo */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[10%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(closest-side, #B7FF45, transparent)' }}
          animate={{ opacity: [0.18, 0.36, 0.22, 0.36, 0.18], scale: [1, 1.06, 1.0, 1.05, 1] }}
          transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
        />
        {/* secondary cool halo */}
        <motion.div
          aria-hidden="true"
          className="absolute right-[15%] top-[40%] h-[40vh] w-[40vw] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(closest-side, #6FCDFF, transparent)' }}
          animate={{ opacity: [0.05, 0.18, 0.08], x: [-20, 30, -20] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050505]" />
      </div>

      {/* === Eyebrow badge === */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <a
          href="#realisations"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm transition-all duration-200 hover:border-[#B7FF45]/40 hover:bg-[#B7FF45]/[0.06] hover:text-white"
        >
          <motion.span
            className="flex h-1.5 w-1.5 rounded-full bg-[#B7FF45]"
            animate={{ boxShadow: ['0 0 0px #B7FF45', '0 0 12px #B7FF45', '0 0 0px #B7FF45'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>Nouveau · Audit IA en 5 jours, livrable garanti</span>
          <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </motion.div>

      {/* === Title with letter stagger reveal === */}
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
        }}
        className="mt-8 max-w-5xl text-center text-[40px] font-medium leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[88px]"
      >
        {["L'IA d'entreprise,", 'simple, rentable, actionnable.'].map((line, lineIdx) => (
          <span key={lineIdx} className={`block ${lineIdx === 1 ? 'bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent' : ''}`}>
            {line.split(' ').map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                }}
                className="mr-3 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.h1>

      {/* === Subtitle === */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-7 max-w-2xl text-center text-base font-light leading-relaxed text-neutral-400 md:text-lg"
      >
        <EditableText
          value="Formation, conseil, audit et déploiement d'agents IA pour PME et grands groupes. Livrables mesurables, exécution en jours."
          storageKey="hero_subtitle"
          isTextarea
          className="w-full text-center"
        />
      </motion.p>

      {/* === Magnetic CTAs === */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.95 }}
        className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-3"
      >
        <MagneticButton
          href="https://calendly.com/clem-pred/30min"
          target="_blank"
          rel="noopener noreferrer"
          strength={0.4}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#B7FF45] px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(183,255,69,0.4),0_0_40px_-8px_rgba(183,255,69,0.6)]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
          <span className="relative">Réserver un audit</span>
          <ArrowUpRight className="relative h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </MagneticButton>

        <MagneticButton
          href="/realisations"
          strength={0.25}
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
        >
          Voir nos réalisations
          <ArrowUpRight className="h-4 w-4 opacity-60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </MagneticButton>
      </motion.div>

      {/* === Marquee logos with fade mask === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-20 w-full max-w-5xl"
      >
        <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          Ils nous font confiance
        </p>
        <MarqueeLogos
          logos={['SNCF', 'Capgemini', 'EY', 'BNP Paribas', 'Orange', 'Société Générale', 'Decathlon', 'L\'Oréal']}
          speed={30}
          itemClassName="text-[17px] font-medium text-neutral-400/80 tracking-tight"
        />
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={scrollToNext}
        aria-label="Faire défiler vers la suite"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-500 transition-colors hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </section>
  );
};

export default Hero;
