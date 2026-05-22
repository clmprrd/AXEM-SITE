import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

interface FooterProps {
  customLogo?: string | null;
}

// =====================================================
// CONCEPT C — "SYNTHWAVE NEURAL" — TERMINAL EXIT
// =====================================================
const Footer: React.FC<FooterProps> = () => {
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

  // Terminal typing
  const lines = ['> shutting_down...', '> thanks for visiting.', '> status: READY ▌'];
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
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      title: 'NAVIGATION',
      links: [
        { k: 'home', v: '#home' },
        { k: 'founders', v: '#founders' },
        { k: 'pricing', v: '#pricing' },
        { k: 'trust', v: '#trust' },
      ],
    },
    {
      title: 'SERVICES',
      links: [
        { k: 'formation', v: '#dualite' },
        { k: 'conseil', v: '#dualite' },
        { k: 'audit', v: '#pricing' },
        { k: 'coaching', v: '#pricing' },
      ],
    },
    {
      title: 'CONTACT',
      links: [
        { k: 'calendly', v: 'https://calendly.com/clem-pred/30min' },
        { k: 'email', v: 'mailto:hello@axem.ia' },
        { k: 'linkedin', v: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
      ],
    },
    {
      title: 'LEGAL',
      links: [
        { k: 'mentions', v: '#' },
        { k: 'cgv', v: '#' },
        { k: 'rgpd', v: '#' },
        { k: 'qualiopi', v: '#' },
      ],
    },
  ];

  return (
    <footer
      className="relative isolate overflow-hidden border-t pt-20 pb-10"
      style={{
        background: 'linear-gradient(180deg, #0A001F 0%, #050010 100%)',
        color: '#F5F0FF',
        fontFamily: 'Space Grotesk, sans-serif',
        borderColor: 'rgba(255,0,200,0.2)',
      }}
      aria-label="Footer — Synthwave Neural"
    >
      {/* Top bandeau perspective grid */}
      <div className="absolute inset-x-0 top-0 h-32 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,0,200,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(300px) rotateX(-60deg)',
            transformOrigin: 'center top',
            maskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
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
        {/* Terminal block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
          style={{
            background: 'rgba(10,0,31,0.75)',
            border: '1px solid rgba(0,240,255,0.3)',
            borderRadius: 8,
            padding: '20px 24px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 30px -10px rgba(0,240,255,0.4)',
          }}
        >
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
              <div
                key={i}
                style={{
                  color: i === 2 ? '#00F0FF' : '#F5F0FF',
                  opacity: i === 2 ? 1 : 0.75,
                  textShadow: i === 2 ? '0 0 10px rgba(0,240,255,0.5)' : undefined,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logo + 4 cols */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          {/* Logo block */}
          <div className="md:col-span-1">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 64,
                letterSpacing: '-0.04em',
                color: '#F5F0FF',
                textShadow: '0 0 24px rgba(245,240,255,0.5)',
                lineHeight: 1,
              }}
            >
              AXEM
            </motion.h2>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                letterSpacing: '0.28em',
                color: '#00F0FF',
                marginTop: 8,
                textShadow: '0 0 8px rgba(0,240,255,0.5)',
              }}
            >
              // IA AGENCY
            </div>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 transition-all hover:scale-110"
              aria-label="LinkedIn AXEM"
              style={{
                color: '#00F0FF',
                filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))',
              }}
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          {/* 4 cols */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8 md:grid-cols-4">
            {columns.map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.28em',
                    color: '#00F0FF',
                    textTransform: 'uppercase',
                    textShadow: '0 0 8px rgba(0,240,255,0.5)',
                    marginBottom: 18,
                  }}
                >
                  // {col.title}
                </div>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.k}>
                      <a
                        href={l.v}
                        target={l.v.startsWith('http') || l.v.startsWith('mailto') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 transition-all"
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 13,
                        }}
                      >
                        <span
                          className="transition-colors"
                          style={{
                            color: '#FF00C8',
                            textShadow: '0 0 8px rgba(255,0,200,0.4)',
                          }}
                        >
                          →
                        </span>
                        <span
                          className="transition-colors group-hover:text-white"
                          style={{ color: '#F5F0FF', opacity: 0.8 }}
                        >
                          {l.k}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 flex flex-col items-start justify-between gap-4 border-t pt-8 md:flex-row md:items-center"
          style={{ borderColor: 'rgba(255,0,200,0.15)' }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              letterSpacing: '0.18em',
              color: '#00F0FF',
              textShadow: '0 0 8px rgba(0,240,255,0.4)',
            }}
          >
            © 2026 AXEM IA // PARIS · FR
          </div>

          <span
            className="inline-flex items-center gap-2 px-3 py-1.5"
            style={{
              border: '1px solid rgba(0,240,255,0.4)',
              borderRadius: 999,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              color: '#00F0FF',
              textShadow: '0 0 8px rgba(0,240,255,0.5)',
              boxShadow: '0 0 16px -6px rgba(0,240,255,0.5)',
            }}
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#00F0FF', boxShadow: '0 0 8px #00F0FF' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            QUALIOPI · CERTIFIED
          </span>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
