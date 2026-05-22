import React, { useEffect } from 'react';
import EditableText from './ui/EditableText';
import { motion, useScroll, useTransform } from 'framer-motion';

// =====================================================
// CONCEPT A — "EDITORIAL PRINT MAGAZINE"
// Inspi : Drift, Are.na, Wallpaper*, The Browser Company, NYT
// Vibe : light cream, serif géant, drop cap géométrique, vertical type
// Palette HORS-DA AXEM : crème #F4EFE6, encre #0F1A2E, vermillon #C8553D
// Fonts : Fraunces (serif display contemporary) + Inter (body)
// =====================================================
const Hero: React.FC = () => {
  // Inject Fraunces font dynamically (override AXEM body)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const { scrollYProgress } = useScroll();
  const dropCapRotate = useTransform(scrollYProgress, [0, 0.3], [0, 8]);

  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col overflow-hidden"
      style={{
        background: '#F4EFE6',
        color: '#0F1A2E',
        fontFamily: 'Inter, sans-serif',
      }}
      aria-label="AXEM IA — Editorial Print"
    >
      {/* === FILLET TOP (style journal) === */}
      <div className="absolute inset-x-0 top-0 h-12 border-b" style={{ borderColor: '#0F1A2E' }}>
        <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-8 text-[10px] uppercase tracking-[0.32em]" style={{ color: '#0F1A2E' }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>axem · vol. 01</span>
          <span>Le partenaire IA · 2025 — 2026</span>
          <span>№ 01 · Paris</span>
        </div>
      </div>

      {/* === VERTICAL TYPE LEFT (magazine signature) === */}
      <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 origin-left -rotate-90 lg:block">
        <div className="text-[10px] uppercase tracking-[0.5em]" style={{ color: '#0F1A2E', opacity: 0.5 }}>
          Issue Premier · Manifeste
        </div>
      </div>

      {/* === MAIN === */}
      <div className="relative mx-auto grid w-full max-w-[1320px] flex-1 grid-cols-12 gap-6 px-8 pt-32 pb-20">
        {/* Eyebrow + meta */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="col-span-12 mb-10 flex items-baseline gap-6"
        >
          <span className="text-[11px] uppercase tracking-[0.42em]" style={{ color: '#C8553D', fontWeight: 600 }}>
            Manifeste · Édition Hiver
          </span>
          <span className="hidden flex-1 border-b md:block" style={{ borderColor: '#0F1A2E', opacity: 0.2 }} />
          <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: '#0F1A2E', opacity: 0.6 }}>
            12 min de lecture
          </span>
        </motion.div>

        {/* DROP CAP + HEADLINE editorial */}
        <div className="col-span-12 md:col-span-9">
          <h1 className="relative" style={{ fontFamily: 'Fraunces, serif' }}>
            {/* DROP CAP géant qui draws itself */}
            <motion.span
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(140px, 22vw, 320px)',
                fontWeight: 300,
                lineHeight: 0.82,
                color: '#C8553D',
                float: 'left',
                marginRight: '14px',
                marginTop: '-12px',
                fontStyle: 'italic',
                rotate: dropCapRotate as any,
                transformOrigin: '50% 50%',
              }}
              initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              L'
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="block"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(48px, 7.5vw, 120px)',
                fontWeight: 300,
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                color: '#0F1A2E',
              }}
            >
              IA n'a pas besoin{' '}
              <span style={{ fontStyle: 'italic', color: '#C8553D' }}>de plus</span>{' '}
              de promesses.
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="mt-6 block"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(48px, 7.5vw, 120px)',
                fontWeight: 300,
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                color: '#0F1A2E',
              }}
            >
              Elle a besoin{' '}
              <span style={{ fontStyle: 'italic', color: '#C8553D' }}>d'opérateurs</span>.
            </motion.span>
          </h1>
        </div>

        {/* SIDEBAR right (avec stats inline manuscrits) */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="col-span-12 mt-8 border-l pl-6 md:col-span-3 md:mt-0 md:pl-8"
          style={{ borderColor: '#C8553D' }}
        >
          <div className="text-[10px] uppercase tracking-[0.32em]" style={{ color: '#C8553D', fontWeight: 600 }}>
            En quelques chiffres
          </div>
          <dl className="mt-6 space-y-5">
            {[
              { v: '10', l: 'formations Qualiopi' },
              { v: '+55k', l: 'abonnés LinkedIn' },
              { v: '12 mois+', l: 'partenariat moyen' },
              { v: '0', l: 'PoC sans suite' },
            ].map((s) => (
              <div key={s.l}>
                <dt
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: '40px',
                    fontWeight: 400,
                    lineHeight: 0.9,
                    fontStyle: 'italic',
                    color: '#0F1A2E',
                  }}
                >
                  {s.v}
                </dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.16em]" style={{ color: '#0F1A2E', opacity: 0.6 }}>
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </motion.aside>

        {/* Bottom row : sous-titre + CTAs (style éditorial print) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="col-span-12 mt-16 flex flex-col gap-8 md:col-span-9 md:flex-row md:items-end md:justify-between"
        >
          <p
            className="max-w-xl"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              lineHeight: 1.6,
              color: '#0F1A2E',
              opacity: 0.75,
            }}
          >
            Pendant trois ans, nous avons regardé les agences IA vendre des slides. Nous, on vend
            des équipes opérationnelles, des workflows en production, et des résultats mesurés.
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
              {' '}Le reste est du marketing.
            </span>
          </p>

          <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
            <a
              href="https://calendly.com/clem-pred/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-7 py-4 text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: '#0F1A2E',
                color: '#F4EFE6',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              <span>Réserver un diagnostic</span>
              <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>→</span>
            </a>
            <a
              href="#dualite"
              className="inline-flex items-center gap-2 px-7 py-4 text-sm font-medium transition-colors hover:bg-[#0F1A2E]/5"
              style={{
                border: '1px solid #0F1A2E',
                color: '#0F1A2E',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Lire le manifeste complet
            </a>
          </div>
        </motion.div>
      </div>

      {/* === FOOTER LIGNE editoriale === */}
      <div className="absolute inset-x-0 bottom-0 border-t" style={{ borderColor: '#0F1A2E' }}>
        <div className="mx-auto flex h-12 max-w-[1320px] items-center justify-between px-8 text-[10px] uppercase tracking-[0.32em]" style={{ color: '#0F1A2E' }}>
          <span>Clément Predo · ESSEC</span>
          <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>—</span>
          <span>Alexis Zeitoun · Polytechnique</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
