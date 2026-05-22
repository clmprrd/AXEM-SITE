import React, { useEffect, useState } from 'react';
import EditableText from './ui/EditableText';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// =====================================================
// CONCEPT C — "SYNTHWAVE NEURAL"
// Inspi : The Browser Company Dia + Synthwave 80s + Anthropic Constitution
// Vibe : "AI futuriste rebelle", magenta+cyan néon, perspective grid horizon
// Palette HORS-DA AXEM : deep purple #0A001F, magenta #FF00C8, cyan #00F0FF
// Fonts : Space Grotesk Display + JetBrains Mono
// =====================================================
const Hero: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Mouse position for neon spotlight
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const smx = useSpring(mx, { stiffness: 60, damping: 24 });
  const smy = useSpring(my, { stiffness: 60, damping: 24 });
  const glowX = useTransform(smx, [0, 100], ['20%', '80%']);
  const glowY = useTransform(smy, [0, 100], ['20%', '80%']);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100);
      my.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mx, my]);

  // Terminal typing effect
  const lines = [
    '> initializing axem_ia.exe...',
    '> loading: formation Qualiopi · audit IA · agents production',
    '> status: READY ▌',
  ];
  const [typed, setTyped] = useState<string[]>(['', '', '']);
  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    const interval = setInterval(() => {
      setTyped((prev) => {
        const next = [...prev];
        if (lineIdx >= lines.length) {
          clearInterval(interval);
          return next;
        }
        if (charIdx < lines[lineIdx].length) {
          next[lineIdx] = lines[lineIdx].slice(0, charIdx + 1);
          charIdx++;
        } else {
          lineIdx++;
          charIdx = 0;
        }
        return next;
      });
    }, 28);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative isolate min-h-[100vh] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A001F 0%, #1A0033 50%, #0A001F 100%)',
        color: '#F5F0FF',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
      aria-label="AXEM IA — Synthwave Neural"
    >
      {/* === PERSPECTIVE GRID FLOOR (80s) === */}
      <div className="absolute inset-x-0 bottom-0 h-[60vh] overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,0,200,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.5) 1px, transparent 1px)",
            backgroundSize: '60px 60px',
            transform: 'perspective(400px) rotateX(60deg) translateY(0%)',
            transformOrigin: 'center bottom',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
          }}
        />
      </div>

      {/* === SUN GLOW horizon === */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[55%] -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          width: '70vw',
          height: '40vw',
          background:
            'radial-gradient(ellipse at center, rgba(255,0,200,0.55) 0%, rgba(110,0,255,0.3) 40%, transparent 75%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.7, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* === CURSOR NEON GLOW === */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-[40vh] w-[40vw] rounded-full"
        style={{
          left: glowX,
          top: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.18) 0%, transparent 70%)',
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* === SCANLINE OVERLAY (CRT) === */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-[1320px] flex-col justify-center px-8 py-32">
        {/* Eyebrow neon */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 flex items-center gap-3"
        >
          <motion.span
            className="h-2 w-2 rounded-full"
            style={{ background: '#00F0FF', boxShadow: '0 0 16px #00F0FF, 0 0 32px #00F0FF' }}
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
            // SYSTEM ONLINE · PARIS / 2026
          </span>
        </motion.div>

        {/* MASSIVE NEON TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(56px, 10vw, 168px)',
            lineHeight: 0.94,
            letterSpacing: '-0.03em',
            color: '#F5F0FF',
          }}
        >
          <span style={{ textShadow: '0 0 24px rgba(245,240,255,0.4)' }}>L'IA, mais </span>
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
            sans le bullshit.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            fontSize: 'clamp(16px, 1.6vw, 22px)',
            lineHeight: 1.5,
            color: '#F5F0FF',
            opacity: 0.85,
            maxWidth: '720px',
            marginTop: 32,
          }}
        >
          Audit, formation Qualiopi, conseil et déploiement.{' '}
          <span style={{ color: '#00F0FF', fontWeight: 500 }}>Du code en production en jours</span>,
          pas des slides en mois.
        </motion.p>

        {/* TERMINAL en bas — qui se tape live */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 max-w-2xl"
          style={{
            background: 'rgba(10,0,31,0.75)',
            border: '1px solid rgba(0,240,255,0.3)',
            borderRadius: 8,
            padding: '20px 24px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 40px -10px rgba(0,240,255,0.3)',
          }}
        >
          {/* Terminal header bar */}
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#FF5F56' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#27C93F' }} />
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                marginLeft: 12,
                color: '#F5F0FF',
                opacity: 0.6,
              }}
            >
              ~ axem_ia — bash
            </span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, lineHeight: 1.7 }}>
            {typed.map((line, i) => (
              <div key={i} style={{ color: i === 2 ? '#00F0FF' : '#F5F0FF', opacity: i === 2 ? 1 : 0.75 }}>
                {line}
                {i === typed.findIndex((l) => l && !l.includes('▌') && l !== lines[i]) && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >▌</motion.span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs neon glow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 overflow-hidden px-8 py-4 text-sm font-semibold transition-all hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(120deg, #FF00C8 0%, #6E00FF 100%)',
              color: '#F5F0FF',
              borderRadius: 999,
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 0 30px -4px rgba(255,0,200,0.6), 0 0 50px -8px rgba(110,0,255,0.4)',
            }}
          >
            <span>Réserver un diagnostic</span>
            <span>→</span>
          </a>
          <a
            href="#dualite"
            className="inline-flex items-center gap-2 px-7 py-4 text-sm font-medium transition-all hover:bg-white/[0.05]"
            style={{
              border: '1px solid #00F0FF',
              color: '#00F0FF',
              borderRadius: 999,
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 0 20px -4px rgba(0,240,255,0.4)',
            }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>./</span>
            voir-méthode
          </a>
        </motion.div>

        {/* Bottom stats — neon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8"
        >
          {[
            { v: '10', l: 'FORMATIONS', c: '#FF00C8' },
            { v: '+55K', l: 'LINKEDIN', c: '#00F0FF' },
            { v: '12M+', l: 'PARTENARIAT', c: '#FF00C8' },
            { v: '0', l: 'POC_FAIL', c: '#00F0FF' },
          ].map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 'clamp(36px, 4vw, 56px)',
                  fontWeight: 700,
                  color: s.c,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  textShadow: `0 0 22px ${s.c}80`,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  color: '#F5F0FF',
                  opacity: 0.55,
                  marginTop: 8,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
