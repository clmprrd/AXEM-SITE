import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT C — "SYNTHWAVE NEURAL" — TWO NETWORKS
// =====================================================
const formations = [
  { code: 'F01', name: 'IA_ESSENTIELLE', price: '300€' },
  { code: 'F02', name: 'PROMPT_PRO', price: '200€' },
  { code: 'F03', name: 'MAITRISER_CLAUDE', price: '450€' },
  { code: 'F04', name: 'METIERS', price: '400€' },
  { code: 'F05', name: 'NO_CODE', price: '800€' },
  { code: 'F06', name: 'AGENT_IA', price: '1250€' },
  { code: 'F07', name: 'VIBE_CODING', price: '450€' },
  { code: 'F08', name: 'AI_ACT', price: '250€' },
  { code: 'F09', name: 'VEILLE', price: '80€' },
  { code: 'F10', name: 'CREATION', price: '400€' },
];

const conseilSteps = [
  { n: '01', name: 'AUDIT', desc: '1 à 4 semaines', price: 'sur devis' },
  { n: '02', name: 'CONSEIL', desc: 'Roadmap IA', price: 'sur devis' },
  { n: '03', name: 'DEPLOIEMENT', desc: 'n8n · Make · Claude', price: '1200-2000€/auto' },
  { n: '04', name: 'COACHING', desc: 'Sessions équipe', price: '200€/session' },
  { n: '05', name: 'PRODUCTION', desc: 'Agents en prod', price: 'sur devis' },
  { n: '06', name: 'SUIVI', desc: '12 mois+', price: '900€ + 80€/mois' },
  { n: '07', name: 'EVOLUTION', desc: 'Veille & MAJ', price: 'inclus' },
];

const DualityScene: React.FC = () => {
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

  // Typing animation for execute line
  const target = '=> EXECUTE: one_partner --formation --production';
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= target.length) {
        setTyped(target.slice(0, i));
        i++;
      } else {
        i = 0;
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="dualite"
      className="relative isolate overflow-hidden py-32"
      style={{
        background: 'linear-gradient(180deg, #0A001F 0%, #1A0033 50%, #0A001F 100%)',
        color: '#F5F0FF',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
      aria-label="Duality — Formation et Production"
    >
      {/* Perspective grid floor */}
      <div className="absolute inset-x-0 bottom-0 h-[40vh] overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,0,200,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.35) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: 'perspective(400px) rotateX(60deg)',
            transformOrigin: 'center bottom',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
          }}
        />
      </div>

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
            style={{ background: '#FF00C8', boxShadow: '0 0 16px #FF00C8' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              letterSpacing: '0.32em',
              color: '#FF00C8',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(255,0,200,0.5)',
            }}
          >
            // LOADING_DUAL_NETWORK...
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
            fontSize: 'clamp(48px, 7vw, 96px)',
            lineHeight: 1,
            letterSpacing: '-0.035em',
          }}
        >
          <span style={{ color: '#FF00C8', textShadow: '0 0 28px rgba(255,0,200,0.6)' }}>Formation.</span>{' '}
          <span style={{ color: '#F5F0FF', opacity: 0.4 }}>//</span>{' '}
          <span style={{ color: '#00F0FF', textShadow: '0 0 28px rgba(0,240,255,0.6)' }}>Production.</span>
        </motion.h2>

        {/* 2 split cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* COL GAUCHE - FORMATIONS */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative p-8"
            style={{
              background: 'rgba(10,0,31,0.75)',
              border: '1px solid rgba(255,0,200,0.3)',
              borderRadius: 12,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 40px -15px rgba(255,0,200,0.35)',
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.28em',
                    color: '#FF00C8',
                    textTransform: 'uppercase',
                    textShadow: '0 0 8px rgba(255,0,200,0.5)',
                  }}
                >
                  // NETWORK_A :: FORMATION
                </div>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: 28,
                    marginTop: 6,
                    letterSpacing: '-0.02em',
                  }}
                >
                  10 modules Qualiopi
                </h3>
              </div>
              <span
                className="px-3 py-1.5"
                style={{
                  border: '1px solid #00F0FF',
                  borderRadius: 999,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  color: '#00F0FF',
                  textShadow: '0 0 8px rgba(0,240,255,0.5)',
                  boxShadow: '0 0 16px -6px rgba(0,240,255,0.5)',
                }}
              >
                QUALIOPI
              </span>
            </div>

            <div className="space-y-1.5">
              {formations.map((f, i) => (
                <motion.div
                  key={f.code}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.04 }}
                  className="flex items-center justify-between py-1.5"
                  style={{
                    borderBottom: '1px solid rgba(255,0,200,0.1)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: '#F5F0FF', opacity: 0.6 }}>{f.code}</span>
                  <span style={{ color: '#FF00C8', fontWeight: 500, textShadow: '0 0 8px rgba(255,0,200,0.35)' }}>
                    {f.name}
                  </span>
                  <span style={{ color: '#F5F0FF', opacity: 0.85 }}>{f.price}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* COL DROITE - CONSEIL */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative p-8"
            style={{
              background: 'rgba(10,0,31,0.75)',
              border: '1px solid rgba(0,240,255,0.3)',
              borderRadius: 12,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 40px -15px rgba(0,240,255,0.35)',
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.28em',
                    color: '#00F0FF',
                    textTransform: 'uppercase',
                    textShadow: '0 0 8px rgba(0,240,255,0.5)',
                  }}
                >
                  // NETWORK_B :: PRODUCTION
                </div>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: 28,
                    marginTop: 6,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Conseil & déploiement
                </h3>
              </div>
              <span
                className="px-3 py-1.5"
                style={{
                  border: '1px solid #FF00C8',
                  borderRadius: 999,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  color: '#FF00C8',
                  textShadow: '0 0 8px rgba(255,0,200,0.5)',
                  boxShadow: '0 0 16px -6px rgba(255,0,200,0.5)',
                }}
              >
                7 ÉTAPES
              </span>
            </div>

            <div className="space-y-3">
              {conseilSteps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-4"
                  style={{
                    borderBottom: '1px solid rgba(0,240,255,0.1)',
                    paddingBottom: 8,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      color: '#00F0FF',
                      fontWeight: 600,
                      width: 36,
                      textShadow: '0 0 8px rgba(0,240,255,0.5)',
                    }}
                  >
                    [{s.n}]
                  </span>
                  <span
                    style={{
                      color: '#F5F0FF',
                      fontWeight: 500,
                      minWidth: 130,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {s.name}
                  </span>
                  <span style={{ color: '#F5F0FF', opacity: 0.55, flex: 1 }}>{s.desc}</span>
                  <span style={{ color: '#FF00C8', textShadow: '0 0 8px rgba(255,0,200,0.35)' }}>{s.price}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom EXECUTE line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 flex items-center justify-center"
        >
          <div
            className="px-6 py-4"
            style={{
              background: 'rgba(10,0,31,0.75)',
              border: '1px solid rgba(0,240,255,0.3)',
              borderRadius: 8,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 30px -10px rgba(0,240,255,0.4)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 14,
              color: '#00F0FF',
              textShadow: '0 0 12px rgba(0,240,255,0.6)',
              letterSpacing: '0.02em',
            }}
          >
            {typed}
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              ▌
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DualityScene;
