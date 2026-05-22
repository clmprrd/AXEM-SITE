import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT C — "SYNTHWAVE NEURAL" — FOUNDERS NEURAL NODES
// =====================================================
const Philosophy: React.FC = () => {
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

  const clementImage =
    'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
  const alexisImage =
    'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

  return (
    <section
      id="founders"
      className="relative isolate overflow-hidden py-32"
      style={{
        background: 'linear-gradient(180deg, #0A001F 0%, #1A0033 50%, #0A001F 100%)',
        color: '#F5F0FF',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
      aria-label="Founders — Synthwave Neural"
    >
      {/* Pulsing neural nodes background */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[15%] top-[30%] h-[40vw] w-[40vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,200,0.18) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] bottom-[20%] h-[35vw] w-[35vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.05, 0.9, 1.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
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
            // FOUNDERS_NODE_01.exe
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
            fontSize: 'clamp(40px, 6vw, 80px)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: '#F5F0FF',
            maxWidth: '1000px',
          }}
        >
          <span style={{ textShadow: '0 0 24px rgba(245,240,255,0.3)' }}>Two operators. </span>
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
            One stack.
          </span>
        </motion.h2>

        {/* 2 cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {/* CLEMENT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{
              boxShadow:
                '0 0 60px -10px rgba(255,0,200,0.55), 0 0 100px -20px rgba(255,0,200,0.3)',
            }}
            className="relative p-10"
            style={{
              background: 'rgba(10,0,31,0.75)',
              border: '1px solid rgba(255,0,200,0.3)',
              borderRadius: 12,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 40px -15px rgba(255,0,200,0.35)',
            }}
          >
            <div className="flex items-start gap-6">
              <div
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full"
                style={{
                  border: '2px solid #FF00C8',
                  boxShadow:
                    '0 0 24px rgba(255,0,200,0.7), inset 0 0 16px rgba(255,0,200,0.25)',
                }}
              >
                <img src={clementImage} alt="Clément Predo" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
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
                  ESSEC :: STRATEGY
                </div>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: 36,
                    lineHeight: 1.05,
                    letterSpacing: '-0.02em',
                    color: '#F5F0FF',
                    marginTop: 6,
                    textShadow: '0 0 18px rgba(255,0,200,0.3)',
                  }}
                >
                  Clément Predo
                </h3>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: '#F5F0FF',
                    opacity: 0.6,
                    marginTop: 4,
                  }}
                >
                  Co-fondateur · Formation · Conseil
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {[
                'Stratégie, formations, conseil',
                'Pilotage missions audit & déploiement',
                '3 ans de terrain IA en production',
              ].map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <span
                    style={{
                      color: '#00F0FF',
                      fontFamily: 'JetBrains Mono, monospace',
                      textShadow: '0 0 8px rgba(0,240,255,0.5)',
                    }}
                  >
                    ▸
                  </span>
                  <span style={{ fontSize: 15, color: '#F5F0FF', opacity: 0.85 }}>{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-baseline gap-3">
              <div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 64,
                  color: '#FF00C8',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  textShadow: '0 0 28px rgba(255,0,200,0.7)',
                }}
              >
                +40K
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: '#F5F0FF',
                  opacity: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                LinkedIn followers
              </div>
            </div>
          </motion.div>

          {/* ALEXIS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.25 }}
            whileHover={{
              boxShadow:
                '0 0 60px -10px rgba(0,240,255,0.55), 0 0 100px -20px rgba(0,240,255,0.3)',
            }}
            className="relative p-10"
            style={{
              background: 'rgba(10,0,31,0.75)',
              border: '1px solid rgba(0,240,255,0.3)',
              borderRadius: 12,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 40px -15px rgba(0,240,255,0.35)',
            }}
          >
            <div className="flex items-start gap-6">
              <div
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full"
                style={{
                  border: '2px solid #00F0FF',
                  boxShadow:
                    '0 0 24px rgba(0,240,255,0.7), inset 0 0 16px rgba(0,240,255,0.25)',
                }}
              >
                <img src={alexisImage} alt="Alexis Zeitoun" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
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
                  INSTITUT POLYTECHNIQUE DE PARIS :: SYSTEMS
                </div>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: 36,
                    lineHeight: 1.05,
                    letterSpacing: '-0.02em',
                    color: '#F5F0FF',
                    marginTop: 6,
                    textShadow: '0 0 18px rgba(0,240,255,0.3)',
                  }}
                >
                  Alexis Zeitoun
                </h3>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: '#F5F0FF',
                    opacity: 0.6,
                    marginTop: 4,
                  }}
                >
                  Co-fondateur · Production · Systèmes
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {[
                'Architecture, automatisation, agents IA',
                'Production n8n · Make · Claude Code',
                'Secteur financier / Private Equity',
              ].map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <span
                    style={{
                      color: '#FF00C8',
                      fontFamily: 'JetBrains Mono, monospace',
                      textShadow: '0 0 8px rgba(255,0,200,0.5)',
                    }}
                  >
                    ▸
                  </span>
                  <span style={{ fontSize: 15, color: '#F5F0FF', opacity: 0.85 }}>{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-baseline gap-3">
              <div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 64,
                  color: '#00F0FF',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  textShadow: '0 0 28px rgba(0,240,255,0.7)',
                }}
              >
                +15K
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: '#F5F0FF',
                  opacity: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                LinkedIn followers
              </div>
            </div>
          </motion.div>
        </div>

        {/* Massive quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-28 text-center"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(40px, 7vw, 96px)',
            lineHeight: 1,
            letterSpacing: '-0.035em',
            background: 'linear-gradient(120deg, #FF00C8 0%, #F5F0FF 50%, #00F0FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 36px rgba(255,0,200,0.35))',
          }}
        >
          "We don't ship pitches.
          <br />
          We ship <span style={{ fontWeight: 700 }}>production.</span>"
        </motion.blockquote>
      </div>
    </section>
  );
};

export default Philosophy;
