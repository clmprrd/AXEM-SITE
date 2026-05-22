import React, { useEffect } from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT D — "WARM MINIMAL DUOTONE"
// Inspi : Stripe Tax, Substack, Patagonia, Notion homepage, Mailbrew
// Vibe : minimaliste premium, beaucoup d'espace blanc, 1 seule couleur dominante chaude
// Palette : cream chaud #FAF7F2, noir doux #1A1A1A, terracotta #D14E1F (1 SEUL accent)
// Fonts : Inter Display + Inter (PAS de serif italic, PAS de mono)
// =====================================================
const Hero: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden px-6 pt-32 pb-24"
      style={{ background: '#FAF7F2', color: '#1A1A1A', fontFamily: 'Inter, sans-serif' }}
      aria-label="AXEM IA — Warm Minimal Duotone"
    >
      {/* Subtle texture overlay (paper-like) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="mx-auto w-full max-w-[1200px]">
        {/* Tiny eyebrow + line */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex items-center gap-4"
        >
          <span className="h-px w-12" style={{ background: '#D14E1F' }} />
          <span className="text-[12px] font-medium uppercase tracking-[0.2em]" style={{ color: '#D14E1F' }}>
            <EditableText value="AXEM IA · Agence IA française · Qualiopi" storageKey="hero_eyebrow" />
          </span>
        </motion.div>

        {/* HEADLINE — large but calm */}
        <h1
          className="max-w-5xl"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(44px, 7vw, 112px)',
            fontWeight: 600,
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            color: '#1A1A1A',
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="block"
          >
            <EditableText value="L'IA, prise au sérieux." storageKey="hero_line1" />
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="block"
            style={{ color: '#1A1A1A', opacity: 0.5 }}
          >
            <EditableText value="Et mise en production." storageKey="hero_line2" />
          </motion.span>
        </h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 max-w-xl"
          style={{ fontSize: 19, lineHeight: 1.55, fontWeight: 400, color: '#1A1A1A', opacity: 0.7 }}
        >
          AXEM IA forme vos équipes (Qualiopi) et déploie l'IA en production. Audit, conseil,
          agents intelligents — livrés en jours, pas en mois.
        </motion.p>

        {/* CTAs minimalist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-12 flex flex-col items-start gap-4 sm:flex-row"
        >
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[15px] font-semibold transition-transform hover:scale-[1.02]"
            style={{
              background: '#1A1A1A',
              color: '#FAF7F2',
              borderRadius: 999,
            }}
          >
            Réserver un diagnostic
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="#dualite"
            className="group inline-flex items-center gap-2.5 px-2 py-3.5 text-[15px] font-medium transition-colors hover:opacity-100"
            style={{ color: '#1A1A1A', opacity: 0.7 }}
          >
            <span style={{ borderBottom: '1px solid #1A1A1A', paddingBottom: 2 }}>
              Voir notre méthode
            </span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </motion.div>

        {/* MASSIVE WHITESPACE + bottom inline stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="mt-32 grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-x-12"
        >
          {[
            { v: '10', l: 'formations Qualiopi' },
            { v: '55k+', l: 'abonnés LinkedIn' },
            { v: '12 mois+', l: 'partenariat moyen' },
            { v: 'J+1', l: 'opérationnel' },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
              className="border-t pt-5"
              style={{ borderColor: 'rgba(26,26,26,0.15)' }}
            >
              <div
                style={{
                  fontSize: 'clamp(36px, 3.5vw, 56px)',
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: '#1A1A1A',
                }}
              >
                {s.v}
              </div>
              <div
                className="mt-3 text-[12px] uppercase"
                style={{ color: '#1A1A1A', opacity: 0.55, letterSpacing: '0.06em', fontWeight: 500 }}
              >
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Subtle "trusted by" line (text-only, no logos here) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.6 }}
          className="mt-20 flex flex-wrap items-baseline gap-x-8 gap-y-3"
        >
          <span className="text-[11px] uppercase font-medium tracking-[0.18em]" style={{ color: '#1A1A1A', opacity: 0.5 }}>
            En confiance avec
          </span>
          {['Carrefour', 'Blackfin', 'Avantis', 'KIT France', 'Espace 2', 'Gravotech', 'Cegos'].map((c) => (
            <span
              key={c}
              className="text-[15px] font-medium transition-colors hover:opacity-100"
              style={{ color: '#1A1A1A', opacity: 0.75 }}
            >
              {c}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
