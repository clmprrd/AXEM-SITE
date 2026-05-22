import React, { useEffect, useState } from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT F — "DATA-VISUAL FORENSIC"
// Inspi : Plaid, Datadog, Snowflake, Mixpanel, Vercel Analytics
// Vibe : "data-driven mesurément obsessionnel", dashboards, charts live
// Palette : dark forest #0B1F1A, blanc cassé #F5F5F0, electric yellow #E8FF00 + cyan secondary
// Fonts : Inter + JetBrains Mono (data tickers)
// =====================================================
const Hero: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Live "data" ticker
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(i);
  }, []);
  const liveStats = [
    { label: 'ROI documenté', v: 286 + (tick % 5), suffix: '%', trend: '+' },
    { label: 'Workflows actifs', v: 41 + (tick % 3), suffix: '', trend: '+' },
    { label: 'Équipes formées', v: 312, suffix: '', trend: '=' },
    { label: 'Heures libérées/mois', v: 4280 + (tick * 7) % 50, suffix: 'h', trend: '+' },
  ];

  // Generate sparkline points
  const generateSparkline = (seed: number) => {
    const pts = Array.from({ length: 24 }, (_, i) => {
      return Math.sin(i * 0.4 + seed) * 12 + Math.random() * 8 + 20;
    });
    return pts.map((y, i) => `${(i / 23) * 100},${40 - y}`).join(' ');
  };

  return (
    <section
      className="relative isolate min-h-[100vh] overflow-hidden"
      style={{
        background: '#0B1F1A',
        color: '#F5F5F0',
        fontFamily: 'Inter, sans-serif',
      }}
      aria-label="AXEM IA — Data-Visual Forensic"
    >
      {/* Subtle grid + glow forest */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E8FF00 1px, transparent 1px), linear-gradient(to bottom, #E8FF00 1px, transparent 1px)",
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-[50vh] w-[50vw] rounded-full"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, rgba(232,255,0,0.10) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* === TOP STATUS BAR (style Datadog dashboard) === */}
      <div className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between border-b px-8 py-4" style={{ borderColor: 'rgba(245,245,240,0.08)' }}>
        <div className="flex items-center gap-4">
          <motion.span
            className="h-2 w-2 rounded-full"
            style={{ background: '#E8FF00', boxShadow: '0 0 10px #E8FF00' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.18em', color: '#E8FF00', textTransform: 'uppercase' }}>
            // SYSTEM_LIVE · PARIS / 2026 / Q4
          </span>
        </div>
        <div className="flex items-center gap-6">
          {liveStats.slice(0, 2).map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F5F5F0', opacity: 0.6 }}>
                {s.label}
              </span>
              <motion.span
                key={`${s.label}-${tick}`}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#E8FF00',
                }}
              >
                {s.v}{s.suffix} <span style={{ color: s.trend === '+' ? '#7FFFB2' : '#F5F5F0', opacity: 0.7 }}>{s.trend}</span>
              </motion.span>
            </div>
          ))}
        </div>
      </div>

      {/* === MAIN === */}
      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col px-8 pt-20 pb-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-3"
        >
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#E8FF00', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            [ AXEM_IA / PRODUCTION_READY ]
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — title + cta */}
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(44px, 6.5vw, 104px)',
                fontWeight: 700,
                lineHeight: 0.96,
                letterSpacing: '-0.04em',
                color: '#F5F5F0',
              }}
            >
              L'IA mesurée,<br />
              <span style={{ color: '#E8FF00' }}>
                pas suggérée.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{ fontSize: 18, lineHeight: 1.55, color: '#F5F5F0', opacity: 0.7, maxWidth: 580, marginTop: 28 }}
            >
              AXEM IA déploie l'IA en production avec KPIs en temps réel.
              Audit chiffré, ROI documenté, équipes formées Qualiopi. Pas de PoC sans suite.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="https://calendly.com/clem-pred/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold transition-transform hover:scale-[1.02]"
                style={{
                  background: '#E8FF00',
                  color: '#0B1F1A',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em',
                  boxShadow: '0 0 32px -8px rgba(232,255,0,0.5)',
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>$</span>
                Réserver un diagnostic
                <span>→</span>
              </a>
              <a
                href="#dualite"
                className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium transition-colors hover:bg-white/[0.04]"
                style={{
                  border: '1px solid rgba(245,245,240,0.2)',
                  color: '#F5F5F0',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                ./voir-méthode
              </a>
            </motion.div>
          </div>

          {/* RIGHT — Live KPI Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="lg:col-span-5"
          >
            <div
              className="p-6"
              style={{
                background: 'rgba(15,30,26,0.5)',
                border: '1px solid rgba(232,255,0,0.18)',
                borderRadius: 12,
                fontFamily: 'JetBrains Mono, monospace',
                boxShadow: '0 0 60px -20px rgba(232,255,0,0.15)',
              }}
            >
              {/* dashboard header */}
              <div className="mb-5 flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(245,245,240,0.08)' }}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2" style={{ background: '#E8FF00', boxShadow: '0 0 8px #E8FF00' }} />
                  <span style={{ fontSize: 11, color: '#F5F5F0', opacity: 0.6, letterSpacing: '0.1em' }}>
                    LIVE_METRICS.json
                  </span>
                </div>
                <span style={{ fontSize: 10, color: '#E8FF00', opacity: 0.7 }}>
                  ↻ {tick}s
                </span>
              </div>

              {/* KPI rows */}
              <div className="space-y-5">
                {liveStats.map((s, i) => (
                  <div key={s.label}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <span style={{ fontSize: 11, color: '#F5F5F0', opacity: 0.6, letterSpacing: '0.06em' }}>
                        {s.label}
                      </span>
                      <motion.span
                        key={`${s.label}-${tick}`}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 24,
                          fontWeight: 700,
                          color: s.trend === '+' ? '#E8FF00' : '#F5F5F0',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {s.v.toLocaleString('fr')}{s.suffix}
                      </motion.span>
                    </div>
                    {/* sparkline */}
                    <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ display: 'block' }}>
                      <motion.polyline
                        points={generateSparkline(i + tick * 0.5)}
                        fill="none"
                        stroke="#E8FF00"
                        strokeWidth="1.2"
                        strokeOpacity="0.8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                  </div>
                ))}
              </div>

              {/* footer */}
              <div className="mt-5 border-t pt-3 text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: 'rgba(245,245,240,0.08)', color: '#F5F5F0', opacity: 0.4 }}>
                source: 47 missions axem · agrégé · anonymisé
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom — clients in mono terminal style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="mt-20 border-t pt-8"
          style={{ borderColor: 'rgba(245,245,240,0.08)' }}
        >
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F5F5F0', opacity: 0.5, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
            // clients_deployed.list
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Gravotech', 'Cegos', 'myconnecting'].map((c) => (
              <span
                key={c}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#F5F5F0',
                  opacity: 0.75,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
