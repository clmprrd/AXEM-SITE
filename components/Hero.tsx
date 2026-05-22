import React, { useRef, useEffect, useState } from 'react';
import EditableText from './ui/EditableText';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// Proposition Y — "Dual Universe Magnetic"
const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const divider = useMotionValue(50);
  const dividerSpring = useSpring(divider, { stiffness: 90, damping: 22, mass: 0.6 });
  const [hovered, setHovered] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (hovered !== null) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const wave = 50 + Math.sin(t * 0.7) * 1.2;
      divider.set(wave);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered, divider]);

  const handleMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(20, Math.min(80, pct));
    const offset = clamped - 50;
    const magnetic = 50 + offset * 1.18;
    divider.set(Math.max(22, Math.min(78, magnetic)));
    setHovered(clamped < 50 ? 'left' : 'right');
  };

  const handleLeave = () => {
    setHovered(null);
    divider.set(50);
  };

  const leftWidth = useTransform(dividerSpring, (v) => `${v}%`);
  const rightWidth = useTransform(dividerSpring, (v) => `${100 - v}%`);
  const leftActive = useTransform(dividerSpring, (v) => (v - 50) / 30);
  const leftScale = useTransform(leftActive, [-1, 0, 1], [0.94, 1, 1.05]);
  const rightScale = useTransform(leftActive, [-1, 0, 1], [1.05, 1, 0.94]);
  const leftOpacity = useTransform(leftActive, [-1, 0, 1], [0.55, 1, 1]);
  const rightOpacity = useTransform(leftActive, [-1, 0, 1], [1, 1, 0.55]);
  const dividerX = useTransform(dividerSpring, (v) => `${v}%`);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative isolate flex min-h-[100vh] cursor-ew-resize overflow-hidden bg-[#050505] text-white"
      aria-label="AXEM IA — Dual Universe Hero"
    >
      {/* LEFT UNIVERSE — FORMATION */}
      <motion.div
        style={{ width: leftWidth }}
        className="relative flex flex-shrink-0 items-center justify-center overflow-hidden"
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 35% 50%, rgba(0,250,154,0.22), transparent 65%), linear-gradient(135deg, #050505 0%, #051F18 100%)',
          }}
          animate={{ opacity: [0.85, 1, 0.9] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #00FA9A 1px, transparent 1px), linear-gradient(to bottom, #00FA9A 1px, transparent 1px)",
            backgroundSize: '64px 64px',
          }}
        />

        <motion.div
          style={{ scale: leftScale, opacity: leftOpacity }}
          className="relative z-10 max-w-2xl px-8 md:px-16 lg:px-24"
        >
          <div className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
            <span className="h-2 w-2 bg-[#00FA9A]" />
            <EditableText value="Pôle 01 · Formation" storageKey="hero_left_eyebrow" />
            <span className="rounded-sm border border-[#00FA9A]/40 bg-[#00FA9A]/10 px-1.5 py-0.5 text-[8px] tracking-[0.18em]">
              Qualiopi
            </span>
          </div>
          <h1 className="font-display text-[clamp(40px,6vw,96px)] font-light leading-[1.0] tracking-[-0.035em]">
            <EditableText value="Vos équipes" storageKey="hero_left_t1" />
            <br />
            <span className="font-playfair italic font-normal text-[#00FA9A]">
              <EditableText value="opérationnelles" storageKey="hero_left_t2" />
            </span>
            <br />
            <EditableText value="dès J+1." storageKey="hero_left_t3" />
          </h1>
          <p className="mt-8 text-lg font-light leading-relaxed text-neutral-300 md:text-xl">
            10 formations · 3 niveaux · 70 % pratique. De zéro à opérationnel en 1 journée.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 border-l-2 border-[#00FA9A]/40 pl-4">
            <div>
              <div className="font-display text-4xl font-light text-[#00FA9A]">10</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                modules F01→F10
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-light text-[#00FA9A]">200–1250€</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                par pers / session
              </div>
            </div>
          </div>
          <a
            href="#formations"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#00FA9A] px-7 py-3.5 text-sm font-semibold text-[#050505] shadow-[0_0_40px_-8px_rgba(0,250,154,0.6)] transition-transform hover:scale-[1.03]"
          >
            Voir le catalogue
            <span>→</span>
          </a>
        </motion.div>

        <AnimatePresence>
          {hovered === 'left' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="absolute right-12 top-1/2 -translate-y-1/2 font-display text-[20vw] font-light leading-none tracking-[-0.05em] text-[#00FA9A]/10 select-none pointer-events-none"
            >
              F
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* MAGNETIC DIVIDER */}
      <motion.div
        style={{ left: dividerX, x: '-50%' }}
        className="absolute top-0 z-20 flex h-full flex-col items-center justify-center pointer-events-none"
      >
        <div className="h-full w-px bg-gradient-to-b from-transparent via-white/60 to-transparent" />
        <motion.div
          className="absolute top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#050505]/80 backdrop-blur-md"
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⇄
            </motion.span>
          </div>
        </motion.div>
        <div className="absolute top-[calc(50%-72px)] -translate-y-full whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.32em] text-white/60">
          ↑ Glisse pour explorer ↑
        </div>
      </motion.div>

      {/* RIGHT UNIVERSE — CONSEIL & PRODUCTION */}
      <motion.div
        style={{ width: rightWidth }}
        className="relative flex flex-shrink-0 items-center justify-center overflow-hidden"
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 65% 50%, rgba(167,139,250,0.22), transparent 65%), linear-gradient(225deg, #050505 0%, #0F0918 100%)',
          }}
          animate={{ opacity: [0.85, 1, 0.9] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(167,139,250,0.4) 0 1px, transparent 1px 14px)",
          }}
        />

        <motion.div
          style={{ scale: rightScale, opacity: rightOpacity }}
          className="relative z-10 max-w-2xl px-8 md:px-16 lg:px-24"
        >
          <div className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#A78BFA]">
            <span className="h-2 w-2 bg-[#A78BFA]" />
            <EditableText value="Pôle 02 · Conseil & Production" storageKey="hero_right_eyebrow" />
            <span className="rounded-sm border border-[#A78BFA]/40 bg-[#A78BFA]/10 px-1.5 py-0.5 text-[8px] tracking-[0.18em]">
              12 mois+
            </span>
          </div>
          <h1 className="font-display text-[clamp(40px,6vw,96px)] font-light leading-[1.0] tracking-[-0.035em]">
            <EditableText value="L'IA" storageKey="hero_right_t1" />{' '}
            <span className="font-playfair italic font-normal text-[#A78BFA]">
              <EditableText value="livrée" storageKey="hero_right_t2" />
            </span>
            <EditableText value=", pas" storageKey="hero_right_t3" />
            <br />
            <EditableText value="installée." storageKey="hero_right_t4" />
          </h1>
          <p className="mt-8 text-lg font-light leading-relaxed text-neutral-300 md:text-xl">
            Audit · Conseil · Déploiement · Coaching · Production · Suivi. Un seul interlocuteur,
            de l'audit à l'autonomie.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 border-l-2 border-[#A78BFA]/40 pl-4">
            <div>
              <div className="font-display text-4xl font-light text-[#A78BFA]">1–4 sem</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                durée audit
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-light text-[#A78BFA]">1 200€+</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                automatisation
              </div>
            </div>
          </div>
          <a
            href="#parcours"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#A78BFA] px-7 py-3.5 text-sm font-semibold text-[#050505] shadow-[0_0_40px_-8px_rgba(167,139,250,0.6)] transition-transform hover:scale-[1.03]"
          >
            Voir notre méthode
            <span>→</span>
          </a>
        </motion.div>

        <AnimatePresence>
          {hovered === 'right' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="absolute left-12 top-1/2 -translate-y-1/2 font-display text-[20vw] font-light leading-none tracking-[-0.05em] text-[#A78BFA]/10 select-none pointer-events-none"
            >
              C
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* BOTTOM TAGLINE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="pointer-events-none absolute inset-x-0 bottom-10 z-30 flex flex-col items-center text-center"
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60">
          Rendre l'IA{' '}
          <span className="font-playfair italic text-[#00FA9A]">simple</span>, rentable et{' '}
          <span className="font-playfair italic text-[#A78BFA]">actionnable</span>.
        </div>
        <div className="mt-3 text-[10px] uppercase tracking-[0.24em] text-white/30">
          Scroll ↓
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
