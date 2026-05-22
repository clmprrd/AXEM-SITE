import React, { useEffect } from 'react';
import EditableText from './ui/EditableText';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// =====================================================
// CONCEPT E — "GLASSMORPHIC AURORA"
// Inspi : Apple Vision Pro, Arc Browser, Linear 2025, Notion AI homepage
// Vibe : futuriste calme, premium, glass cards qui flottent
// Palette : indigo/violet pastel base, blanc/lavande, iridescent shifting
// Fonts : Inter Tight + JetBrains Mono (rare)
// =====================================================
const Hero: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Mouse-tracked aurora
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const smx = useSpring(mx, { stiffness: 40, damping: 22 });
  const smy = useSpring(my, { stiffness: 40, damping: 22 });
  const auroraX = useTransform(smx, [0, 100], ['25%', '75%']);
  const auroraY = useTransform(smy, [0, 100], ['25%', '75%']);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100);
      my.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mx, my]);

  return (
    <section
      className="relative isolate min-h-[100vh] overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #ECE6FF 0%, #F4ECFF 35%, #FFE9F3 70%, #FFF5EC 100%)',
        color: '#1A1230',
        fontFamily: 'Inter, sans-serif',
      }}
      aria-label="AXEM IA — Glassmorphic Aurora"
    >
      {/* === AURORA BLOBS (3) — cursor-reactive === */}
      <motion.div
        aria-hidden="true"
        className="absolute h-[80vh] w-[80vw] rounded-full pointer-events-none"
        style={{
          left: auroraX,
          top: auroraY,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(167,139,250,0.55) 0%, rgba(232,121,249,0.35) 35%, transparent 70%)',
          filter: 'blur(60px)',
          mixBlendMode: 'multiply',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -left-32 top-1/3 h-[60vh] w-[55vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(96,165,250,0.40) 0%, transparent 70%)',
          filter: 'blur(70px)',
          mixBlendMode: 'multiply',
        }}
        animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -right-32 bottom-1/4 h-[55vh] w-[55vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(252,165,165,0.45) 0%, transparent 70%)',
          filter: 'blur(80px)',
          mixBlendMode: 'multiply',
        }}
        animate={{ x: [0, -60, 0], y: [0, 40, 0], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-[1280px] flex-col justify-center px-8 py-32">
        {/* Glass eyebrow chip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 inline-flex items-center gap-2.5 self-start"
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2"
            style={{
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: 999,
              boxShadow: '0 8px 24px -8px rgba(167,139,250,0.3), inset 0 1px 1px rgba(255,255,255,0.6)',
            }}
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#A855F7' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span className="text-[12px] font-medium tracking-[0.08em]" style={{ color: '#5B21B6' }}>
              <EditableText value="Nouvelle ère · L'IA opérationnelle pour PME" storageKey="hero_eyebrow" />
            </span>
          </div>
        </motion.div>

        {/* HEADLINE iridescent */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(44px, 7.5vw, 124px)',
            fontWeight: 500,
            lineHeight: 0.98,
            letterSpacing: '-0.04em',
            color: '#1A1230',
            maxWidth: '1100px',
          }}
        >
          L'IA, devenue{' '}
          <motion.span
            style={{
              background: 'linear-gradient(120deg, #A855F7 0%, #EC4899 40%, #F97316 80%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 600,
            }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
          >
            tangible
          </motion.span>
          <br />
          pour vos équipes.
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 max-w-xl"
          style={{
            fontSize: 19,
            lineHeight: 1.55,
            fontWeight: 400,
            color: '#1A1230',
            opacity: 0.7,
          }}
        >
          Audit, formation Qualiopi, conseil & déploiement IA. Une seule équipe,
          de la stratégie à la production.
        </motion.p>

        {/* === GLASS BENTO ROW (3 cards qui flottent) === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            { tag: 'FORMATION', big: '10', small: 'modules Qualiopi', tint: 'rgba(167,139,250,0.18)' },
            { tag: 'AUDIENCE', big: '55k+', small: 'abonnés LinkedIn', tint: 'rgba(236,72,153,0.18)' },
            { tag: 'PARTENARIAT', big: '12mo+', small: 'durée moyenne', tint: 'rgba(249,115,22,0.18)' },
          ].map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.7) 0%, ${c.tint} 100%)`,
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.85)',
                borderRadius: 24,
                padding: '24px 28px',
                boxShadow:
                  '0 20px 60px -20px rgba(167,139,250,0.4), inset 0 1px 1px rgba(255,255,255,0.7)',
              }}
            >
              <div
                className="text-[10px] uppercase mb-2"
                style={{ color: '#5B21B6', fontWeight: 600, letterSpacing: '0.18em' }}
              >
                {c.tag}
              </div>
              <div style={{ fontSize: 52, fontWeight: 500, color: '#1A1230', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {c.big}
              </div>
              <div style={{ fontSize: 13, color: '#1A1230', opacity: 0.6, marginTop: 6 }}>
                {c.small}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-12 flex flex-col items-start gap-3 sm:flex-row"
        >
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[15px] font-semibold transition-transform hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(120deg, #1A1230 0%, #3B0764 100%)',
              color: '#FFF',
              borderRadius: 999,
              boxShadow: '0 12px 28px -8px rgba(26,18,48,0.5)',
            }}
          >
            Réserver un diagnostic
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="#dualite"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[15px] font-medium transition-all"
            style={{
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: 999,
              color: '#1A1230',
              boxShadow: '0 4px 16px -4px rgba(167,139,250,0.2)',
            }}
          >
            Voir notre méthode
            <span className="opacity-60">↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
