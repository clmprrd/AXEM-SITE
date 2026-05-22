import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT C — "SYNTHWAVE NEURAL" — TRUST NETWORK
// =====================================================
const clients = ['Carrefour', 'Blackfin', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech'];
const partners = ['myconnecting', 'synapse ia', 'ASphere', 'AI sisters', 'SENZA', 'Cegos'];

const sectors = [
  'Éditeur logiciel · Médico-social',
  'BTP · Rénovation & Structure',
  'Administration judiciaire',
  'Adhésifs · Aéronautique & Ferroviaire',
  'Promotion immobilière',
  'Industrie · Manufacturing',
  'Conseil & Expertise',
  'Grande distribution',
];

const ClientsLogos: React.FC = () => {
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

  // Doubled lists for seamless marquee
  const clientsRow = [...clients, ...clients, ...clients];
  const partnersRow = [...partners, ...partners, ...partners];

  return (
    <section
      id="trust"
      className="relative isolate overflow-hidden py-32"
      style={{
        background: 'linear-gradient(180deg, #0A001F 0%, #1A0033 50%, #0A001F 100%)',
        color: '#F5F0FF',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
      aria-label="Trust Network — Synthwave Neural"
    >
      {/* Background ambient */}
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
            // TRUST_NETWORK::ACTIVE
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
            textShadow: '0 0 28px rgba(245,240,255,0.35)',
          }}
        >
          They shipped with us.
        </motion.h2>

        {/* Clients Grid 4 cols */}
        <div className="mt-16">
          <div
            className="mb-6 flex items-center gap-3"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.28em',
              color: '#00F0FF',
              textTransform: 'uppercase',
              textShadow: '0 0 8px rgba(0,240,255,0.5)',
            }}
          >
            <span>// CLIENTS_LIVE</span>
            <span style={{ flex: 1, height: 1, background: 'rgba(0,240,255,0.2)' }} />
            <span style={{ opacity: 0.6 }}>{clients.length} entities</span>
          </div>
          <div className="grid grid-cols-2 gap-px md:grid-cols-4">
            {clients.map((c, i) => {
              const color = i % 2 === 0 ? '#FF00C8' : '#00F0FF';
              return (
                <motion.div
                  key={c}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{
                    boxShadow: `0 0 40px -8px ${color}88, inset 0 0 24px ${color}33`,
                  }}
                  className="flex items-center justify-center px-6 py-8 transition-all"
                  style={{
                    background: 'rgba(10,0,31,0.6)',
                    border: '1px solid rgba(245,240,255,0.08)',
                    borderRadius: 8,
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 500,
                    fontSize: 18,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#F5F0FF',
                  }}
                >
                  {c}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Marquee section */}
        <div className="mt-20">
          <div
            className="mb-6 flex items-center gap-3"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.28em',
              color: '#FF00C8',
              textTransform: 'uppercase',
              textShadow: '0 0 8px rgba(255,0,200,0.5)',
            }}
          >
            <span>// PARTNERS_STREAM</span>
            <span style={{ flex: 1, height: 1, background: 'rgba(255,0,200,0.2)' }} />
          </div>

          {/* Row 1 — clients marquee */}
          <div
            className="group relative overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div
              className="flex gap-12 whitespace-nowrap py-4 group-hover:[animation-play-state:paused]"
              style={{
                animation: 'marquee-left 50s linear infinite',
              }}
            >
              {clientsRow.map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: 24,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#FF00C8',
                    textShadow: '0 0 14px rgba(255,0,200,0.5)',
                  }}
                >
                  {c} <span style={{ color: '#00F0FF', opacity: 0.5, margin: '0 12px' }}>·</span>
                </span>
              ))}
            </div>
          </div>

          {/* Row 2 — partners marquee */}
          <div
            className="group relative overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div
              className="flex gap-12 whitespace-nowrap py-4 group-hover:[animation-play-state:paused]"
              style={{
                animation: 'marquee-right 70s linear infinite',
              }}
            >
              {partnersRow.map((p, i) => (
                <span
                  key={`${p}-${i}`}
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 500,
                    fontSize: 22,
                    letterSpacing: '0.04em',
                    color: '#00F0FF',
                    textShadow: '0 0 12px rgba(0,240,255,0.5)',
                  }}
                >
                  {p} <span style={{ color: '#FF00C8', opacity: 0.5, margin: '0 12px' }}>·</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sectors — node style */}
        <div className="mt-24">
          <div
            className="mb-8 flex items-center gap-3"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.28em',
              color: '#00F0FF',
              textTransform: 'uppercase',
              textShadow: '0 0 8px rgba(0,240,255,0.5)',
            }}
          >
            <span>// SECTORS_DEPLOYED</span>
            <span style={{ flex: 1, height: 1, background: 'rgba(0,240,255,0.2)' }} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sectors.map((s, i) => {
              const color = i % 2 === 0 ? '#FF00C8' : '#00F0FF';
              return (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex items-center gap-3 p-5"
                  style={{
                    background: 'rgba(10,0,31,0.55)',
                    border: `1px solid ${color}33`,
                    borderRadius: 8,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <motion.span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: color, boxShadow: `0 0 14px ${color}` }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2 + (i % 3) * 0.5, repeat: Infinity }}
                  />
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                      color: '#F5F0FF',
                      opacity: 0.85,
                    }}
                  >
                    {s}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Qualiopi badge card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex items-center justify-center"
        >
          <div
            className="flex items-center gap-4 px-6 py-4"
            style={{
              background: 'rgba(10,0,31,0.75)',
              border: '1px solid rgba(0,240,255,0.4)',
              borderRadius: 8,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 30px -10px rgba(0,240,255,0.5)',
            }}
          >
            <motion.span
              className="h-2 w-2 rounded-full"
              style={{ background: '#00F0FF', boxShadow: '0 0 14px #00F0FF' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                letterSpacing: '0.28em',
                color: '#00F0FF',
                textTransform: 'uppercase',
                textShadow: '0 0 8px rgba(0,240,255,0.5)',
              }}
            >
              CERTIFIED ::
            </span>
            <span
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                color: '#F5F0FF',
                letterSpacing: '0.04em',
              }}
            >
              Qualiopi · Formations finançables OPCO / CPF / FAF
            </span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0%); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0%); }
        }
      `}</style>
    </section>
  );
};

export default ClientsLogos;
