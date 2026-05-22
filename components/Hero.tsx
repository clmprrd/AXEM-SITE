import React, { useEffect } from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT B — "BRUTALIST SWISS"
// Inspi : Gumroad, Linear early days, Basecamp new, Swiss design 2026, Hightouch
// Vibe : anti-bullshit, grid 12-col VISIBLE, typo HUGE caps, accent unique saturé
// Palette HORS-DA AXEM : noir pur #000, blanc cassé #F0EDE5, hot pink #FF2D5F
// Fonts : Inter Display HEAVY + JetBrains Mono
// =====================================================
const Hero: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Build columns for visible grid overlay
  const cols = Array.from({ length: 12 }, (_, i) => i);

  return (
    <section
      className="relative isolate min-h-[100vh] overflow-hidden"
      style={{ background: '#000', color: '#F0EDE5', fontFamily: 'Inter, sans-serif' }}
      aria-label="AXEM IA — Brutalist Swiss"
    >
      {/* === VISIBLE 12-COL GRID OVERLAY === */}
      <div className="absolute inset-0 mx-auto max-w-[1440px] px-6 pointer-events-none" aria-hidden="true">
        <div className="grid h-full grid-cols-12 gap-4">
          {cols.map((c) => (
            <div key={c} className="border-x border-white/[0.04]" />
          ))}
        </div>
      </div>

      {/* === HORIZONTAL DIVIDERS (brutalist signature) === */}
      <div className="absolute inset-x-0 top-[12vh] h-px bg-white/[0.08]" />
      <div className="absolute inset-x-0 bottom-[12vh] h-px bg-white/[0.08]" />

      {/* === HEADER ROW : MONO badges === */}
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-8">
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em', color: '#F0EDE5', textTransform: 'uppercase' }}>
          [ AXEM_IA / Q4_2025 / PARIS ]
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em', color: '#FF2D5F', textTransform: 'uppercase' }}>
          ● LIVE — Diagnostic gratuit
        </span>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="relative mx-auto grid min-h-[88vh] max-w-[1440px] grid-cols-12 gap-4 px-6 pt-32 pb-20">
        {/* HUGE TYPO HEADLINE — 12 cols full bleed */}
        <div className="col-span-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(56px, 14vw, 220px)',
              lineHeight: 0.86,
              letterSpacing: '-0.05em',
              color: '#F0EDE5',
              textTransform: 'uppercase',
            }}
          >
            AI THAT<br />
            <span
              style={{
                background: '#FF2D5F',
                color: '#000',
                padding: '0 0.08em',
                display: 'inline-block',
              }}
            >
              SHIPS.
            </span>
          </motion.h1>
        </div>

        {/* DECK statement — col 1-7 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="col-span-12 mt-12 md:col-span-7"
        >
          <p style={{ fontSize: 22, lineHeight: 1.3, fontWeight: 500, color: '#F0EDE5', letterSpacing: '-0.01em' }}>
            <span style={{ color: '#FF2D5F', fontWeight: 800 }}>Pas de PoC.</span> Pas de slides.
            Pas de "transformation digitale". Juste du code en production, des équipes formées Qualiopi,
            des KPIs mesurés.
          </p>

          {/* CTAs brutalist square */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="https://calendly.com/clem-pred/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-7 py-5 text-sm font-bold uppercase tracking-[0.16em] transition-all hover:bg-[#F0EDE5] hover:text-black"
              style={{ background: '#FF2D5F', color: '#000', fontFamily: 'Inter, sans-serif' }}
            >
              Réserver un diagnostic
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>[ →]</span>
            </a>
            <a
              href="#dualite"
              className="group inline-flex items-center gap-3 px-7 py-5 text-sm font-bold uppercase tracking-[0.16em] transition-all hover:bg-[#F0EDE5] hover:text-black"
              style={{ border: '1px solid #F0EDE5', color: '#F0EDE5', fontFamily: 'Inter, sans-serif' }}
            >
              Voir la méthode
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>[ ↓]</span>
            </a>
          </div>
        </motion.div>

        {/* STATS RIGHT — col 8-12, brutalist data block */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="col-span-12 mt-12 md:col-span-5"
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.18em', color: '#FF2D5F', textTransform: 'uppercase', marginBottom: 24 }}>
            // DATA_DUMP_2026.txt
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/[0.08]">
            {[
              { v: '10', l: 'formations Qualiopi' },
              { v: '55K+', l: 'abonnés LinkedIn' },
              { v: '12M+', l: 'partenariat moyen' },
              { v: '0', l: 'PoC sans suite' },
            ].map((s) => (
              <div key={s.l} style={{ background: '#000', padding: '24px 20px' }}>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 56,
                    fontWeight: 800,
                    color: '#F0EDE5',
                    letterSpacing: '-0.04em',
                    lineHeight: 0.9,
                  }}
                >
                  {s.v}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#F0EDE5', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.16em', marginTop: 8 }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* === BOTTOM MARQUEE BRUTALIST — clients en CAPS HEAVY === */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/[0.08]" style={{ background: '#FF2D5F', color: '#000' }}>
        <motion.div
          className="flex w-max gap-12 py-3"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(2)].flatMap((_, k) =>
            ['CARREFOUR', 'BLACKFIN', 'AVANTIS', 'KIT FRANCE', 'ESPACE 2', 'GRAVOTECH', 'CEGOS', 'MYCONNECTING', 'SYNAPSE IA', 'SENZA'].map((c, i) => (
              <span
                key={`${k}-${i}`}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: '0.16em',
                  whiteSpace: 'nowrap',
                }}
              >
                {c} <span style={{ fontFamily: 'JetBrains Mono, monospace', marginLeft: 24 }}>✦</span>
              </span>
            )),
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
