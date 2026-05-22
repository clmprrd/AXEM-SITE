import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Hammer, BarChart3, RefreshCw, User } from 'lucide-react';

// =====================================================
// CONCEPT C — "SYNTHWAVE NEURAL" — 5 REASONS .specs
// =====================================================
const reasons = [
  {
    n: '01',
    icon: Clock,
    color: '#FF00C8',
    title: 'PARTNER FOR LIFE',
    desc: "Pas un projet jetable. Un partenariat 12 mois minimum, suivi et évolutif.",
    detail: '12+ mois engagement',
  },
  {
    n: '02',
    icon: Hammer,
    color: '#00F0FF',
    title: '70% PRACTICE',
    desc: 'Nos formations sont 70% pratique. Pas de slides, du code, des workflows, du concret.',
    detail: '70/30 ratio practice/theory',
  },
  {
    n: '03',
    icon: BarChart3,
    color: '#FF00C8',
    title: 'MEASURED ROI',
    desc: 'Chaque automatisation est mesurée : heures économisées, € générés, marge dégagée.',
    detail: 'KPIs trackés en continu',
  },
  {
    n: '04',
    icon: RefreshCw,
    color: '#00F0FF',
    title: 'ALWAYS UP-TO-DATE',
    desc: 'Veille hebdo. Les outils que vous utilisez sont ceux qui sortent aujourd\'hui.',
    detail: 'Stack rotation weekly',
  },
  {
    n: '05',
    icon: User,
    color: '#FF00C8',
    title: 'ONE INTERLOCUTOR',
    desc: 'Pas 5 chefs de projet. Un fondateur sur votre dossier, du diagnostic à la livraison.',
    detail: 'Direct line founders',
  },
];

const Difference: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <section
      id="difference"
      className="relative isolate overflow-hidden py-32"
      style={{
        background: 'linear-gradient(180deg, #0A001F 0%, #1A0033 50%, #0A001F 100%)',
        color: '#F5F0FF',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
      aria-label="5 raisons — Synthwave Neural"
    >
      {/* Background grid pulse */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '60vw',
          height: '60vw',
          background:
            'radial-gradient(circle, rgba(110,0,255,0.18) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* CRT scanline */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 3px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1320px] px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center gap-3"
        >
          <motion.span
            className="h-2 w-2 rounded-full"
            style={{ background: '#00F0FF', boxShadow: '0 0 16px #00F0FF' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              letterSpacing: '0.32em',
              color: '#00F0FF',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(0,240,255,0.5)',
            }}
          >
            // AXEM.specs
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(48px, 7.5vw, 100px)',
            lineHeight: 1,
            letterSpacing: '-0.035em',
            color: '#F5F0FF',
            maxWidth: '1100px',
          }}
        >
          <span style={{ textShadow: '0 0 24px rgba(245,240,255,0.3)' }}>Five reasons. </span>
          <span
            style={{
              background: 'linear-gradient(120deg, #FF00C8 0%, #00F0FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 28px rgba(255,0,200,0.5))',
              fontStyle: 'italic',
            }}
          >
            Zero bullshit.
          </span>
        </motion.h2>

        {/* 5 cards grid 2-2-1 */}
        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            const isLast = i === reasons.length - 1;
            // Last card spans 2 cols on lg
            const lgSpan = isLast ? 'lg:col-span-6' : 'lg:col-span-3';
            return (
              <motion.div
                key={r.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                whileHover={{
                  boxShadow: `0 0 60px -10px ${r.color}88, 0 0 100px -20px ${r.color}55`,
                  y: -4,
                }}
                className={`group relative p-8 ${lgSpan}`}
                style={{
                  background: 'rgba(10,0,31,0.75)',
                  border: `1px solid ${r.color}4D`,
                  borderRadius: 12,
                  backdropFilter: 'blur(16px)',
                  boxShadow: `0 0 30px -15px ${r.color}55`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      letterSpacing: '0.28em',
                      color: '#00F0FF',
                      textShadow: '0 0 8px rgba(0,240,255,0.5)',
                    }}
                  >
                    [{r.n}]
                  </div>
                  <Icon
                    className="h-6 w-6 transition-transform group-hover:scale-110"
                    style={{ color: r.color, filter: `drop-shadow(0 0 12px ${r.color})` }}
                  />
                </div>

                <h3
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: 32,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: '#F5F0FF',
                    marginTop: 16,
                    textShadow: `0 0 18px ${r.color}55`,
                  }}
                >
                  {r.title}
                </h3>

                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: '#F5F0FF',
                    opacity: 0.78,
                    marginTop: 12,
                    maxWidth: 480,
                  }}
                >
                  {r.desc}
                </p>

                <div
                  className="mt-6 inline-flex items-center gap-2"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    color: r.color,
                    textShadow: `0 0 10px ${r.color}88`,
                    textTransform: 'uppercase',
                  }}
                >
                  <span>▸</span>
                  <span>{r.detail}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Difference;
