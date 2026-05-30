import React, { useEffect, useRef, useState } from 'react';
import EditableText from './ui/EditableText';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { MagneticButton } from './ui/wow';

// ============================================================
// HERO AXEM — "Votre partenaire IA, de A à Z."
// Structure AI Sisters + DA AXEM officielle (vert #00FA9A, Bricolage Grotesque)
// Signature : fusion ALEXIS + CLÉMENT → AXEM au chargement
// ============================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';

// --- Animation de fusion des prénoms ---
// "ALEXIS" + "CLÉMENT" → les lettres A·X·E·M survivent → AXEM
function FusionWordmark() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1100); // les prénoms s'effacent partiellement
    const t2 = setTimeout(() => setPhase(2), 2000); // AXEM apparaît
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="relative flex h-10 items-center justify-center md:h-12" aria-label="ALEXIS + CLÉMENT = AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div
            key="names"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.4em] md:text-base"
          >
            <motion.span
              animate={phase === 1 ? { opacity: 0.25, letterSpacing: '0.1em' } : {}}
              transition={{ duration: 0.6 }}
              className="text-white/70"
            >
              Alexis
            </motion.span>
            <motion.span
              animate={{ rotate: phase === 1 ? 90 : 0, scale: phase === 1 ? 1.3 : 1 }}
              transition={{ duration: 0.5 }}
              className="text-[#00FA9A]"
            >
              +
            </motion.span>
            <motion.span
              animate={phase === 1 ? { opacity: 0.25, letterSpacing: '0.1em' } : {}}
              transition={{ duration: 0.6 }}
              className="text-white/70"
            >
              Clément
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="axem"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-center gap-1.5"
          >
            {['A', 'X', 'E', 'M'].map((l, i) => (
              <motion.span
                key={l}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="font-display text-2xl font-medium tracking-tight text-white md:text-3xl"
              >
                {l}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="ml-1.5 font-display text-2xl font-medium tracking-tight text-[#00FA9A] md:text-3xl"
            >
              IA
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  // Mouse-tracked spotlight
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

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100vh] flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-24 text-center"
      aria-label="AXEM IA — Hero"
    >
      {/* === BACKGROUND === */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 35%, black 50%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 35%, black 50%, transparent 100%)',
          }}
        />
        <motion.div
          className="absolute left-1/2 top-[14%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(closest-side, #00FA9A, transparent)' }}
          animate={{ opacity: [0.14, 0.26, 0.16], scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#050505]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center">
        {/* === Fusion wordmark + label === */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col items-center gap-4"
        >
          <FusionWordmark />
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00FA9A]/20 bg-[#00FA9A]/[0.06] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FA9A]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00FA9A]">
              <EditableText value="Agence d'IA & organisme de formation certifié Qualiopi" storageKey="hero_label" />
            </span>
          </div>
        </motion.div>

        {/* === Titre principal === */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-[clamp(44px,8vw,128px)] font-light leading-[1.02] tracking-[-0.04em] text-white"
        >
          <EditableText value="Votre partenaire IA," storageKey="hero_title_1" />{' '}
          <span className="font-playfair italic font-normal text-[#00FA9A]">
            <EditableText value="de A à Z." storageKey="hero_title_2" />
          </span>
        </motion.h1>

        {/* === Sous-ligne === */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-7 text-xl font-light text-neutral-300 md:text-2xl"
        >
          <EditableText value="On vous forme, on vous conseille, on déploie. Et on reste." storageKey="hero_subline" />
        </motion.p>

        {/* === Description (style AI Sisters) === */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-7 max-w-2xl text-base font-light leading-relaxed text-neutral-400 md:text-lg"
        >
          <EditableText
            value="AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi. Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique, de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes."
            storageKey="hero_description"
            isTextarea
            className="w-full text-center"
          />
        </motion.p>

        {/* === GROS BOUTON RDV (Calendly) === */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            strength={0.35}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#00FA9A] px-10 py-5 text-base font-bold text-[#050505] shadow-[0_0_0_1px_rgba(0,250,154,0.4),0_0_60px_-12px_rgba(0,250,154,0.7)]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
            </svg>
            <span className="relative">Prendre rendez-vous</span>
            <span className="relative transition-transform duration-200 group-hover:translate-x-1">→</span>
          </MagneticButton>
          <a
            href="https://wa.me/33600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-7 py-5 text-base font-medium text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.05]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a3 3 0 0 0-1 2.3c0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.4-.2z" />
            </svg>
            WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
