import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// =====================================================
// CONCEPT C — "SYNTHWAVE NEURAL" — BILLING DASHBOARD
// =====================================================
const Pricing: React.FC = () => {
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

  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const handler = () => {
      setShowStickyCta(window.scrollY > 800);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const cards = [
    {
      key: 'formations',
      eyebrow: '// MODULE_01',
      title: 'FORMATIONS',
      priceRange: '[ 200€ — 1250€ ]',
      tag: 'Qualiopi · Finançable',
      color: '#FF00C8',
      bullets: [
        '10 modules certifiés Qualiopi',
        'Présentiel, distanciel ou hybride',
        'Finançable OPCO / CPF / FAF',
        '70% pratique · cas réels',
        'Certification de fin de parcours',
      ],
      cta: 'Voir le catalogue',
      ctaHref: '#dualite',
    },
    {
      key: 'conseil',
      eyebrow: '// MODULE_02',
      title: 'CONSEIL',
      priceRange: 'Audit 1-4 sem · Auto 1200-2000€ · Abo 900€+80€/mois',
      tag: 'Conseil + Déploiement',
      color: '#00F0FF',
      bullets: [
        'Audit IA 1 à 4 semaines',
        'Roadmap & priorisation use cases',
        'Automatisation 1200-2000€/workflow',
        'Abonnement suivi 900€ + 80€/mois',
        'Partenariat 12 mois minimum',
      ],
      cta: 'Demander un audit',
      ctaHref: 'https://calendly.com/clem-pred/30min',
    },
    {
      key: 'coaching',
      eyebrow: '// MODULE_03',
      title: 'COACHING',
      priceRange: '200€ / session',
      tag: 'Sessions équipe',
      color: '#6E00FF',
      bullets: [
        'Sessions 1h en visio',
        'Pour dirigeants ou équipes',
        'Diagnostic + plan d\'action immédiat',
        'Pack 5 sessions au tarif préférentiel',
        'Outils & prompts livrés post-session',
      ],
      cta: 'Réserver une session',
      ctaHref: 'https://calendly.com/clem-pred/30min',
    },
  ];

  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden py-32"
      style={{
        background: 'linear-gradient(180deg, #0A001F 0%, #1A0033 50%, #0A001F 100%)',
        color: '#F5F0FF',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
      aria-label="Pricing — Synthwave Neural"
    >
      {/* Perspective grid floor */}
      <div className="absolute inset-x-0 bottom-0 h-[35vh] overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,0,200,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.3) 1px, transparent 1px)',
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
            // PRICING_MODULE.run
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
            color: '#F5F0FF',
            maxWidth: '1100px',
          }}
        >
          <span style={{ textShadow: '0 0 24px rgba(245,240,255,0.3)' }}>Transparent. Modular. </span>
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
            Fundable.
          </span>
        </motion.h2>

        {/* 3 cards */}
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12 }}
              whileHover={{
                y: -6,
                boxShadow: `0 0 60px -10px ${c.color}88, 0 0 120px -20px ${c.color}55`,
              }}
              className="relative flex flex-col p-8"
              style={{
                background: 'rgba(10,0,31,0.78)',
                border: `1px solid ${c.color}4D`,
                borderRadius: 12,
                backdropFilter: 'blur(16px)',
                boxShadow: `0 0 40px -15px ${c.color}55`,
              }}
            >
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  color: c.color,
                  textTransform: 'uppercase',
                  textShadow: `0 0 8px ${c.color}aa`,
                }}
              >
                {c.eyebrow}
              </div>
              <h3
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 36,
                  letterSpacing: '-0.02em',
                  marginTop: 8,
                  color: '#F5F0FF',
                  textShadow: `0 0 18px ${c.color}55`,
                }}
              >
                {c.title}
              </h3>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 14,
                  marginTop: 18,
                  color: c.color,
                  letterSpacing: '0.02em',
                  textShadow: `0 0 12px ${c.color}88`,
                  lineHeight: 1.5,
                }}
              >
                {c.priceRange}
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  color: '#F5F0FF',
                  opacity: 0.6,
                  marginTop: 4,
                  textTransform: 'uppercase',
                }}
              >
                {c.tag}
              </div>

              <div
                className="my-6 h-px"
                style={{ background: `linear-gradient(90deg, ${c.color}55, transparent)` }}
              />

              <ul className="space-y-3 flex-1">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check
                      className="h-4 w-4 shrink-0 mt-0.5"
                      style={{
                        color: c.color,
                        filter: `drop-shadow(0 0 6px ${c.color})`,
                      }}
                    />
                    <span style={{ fontSize: 14, color: '#F5F0FF', opacity: 0.85 }}>{b}</span>
                  </li>
                ))}
              </ul>

              <a
                href={c.ctaHref}
                target={c.ctaHref.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 transition-all hover:scale-[1.02]"
                style={{
                  border: `1px solid ${c.color}`,
                  color: c.color,
                  borderRadius: 999,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  boxShadow: `0 0 18px -4px ${c.color}aa`,
                  textShadow: `0 0 8px ${c.color}aa`,
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>./</span>
                {c.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* BIG CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 flex items-center justify-center"
        >
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden px-12 py-6 transition-all hover:scale-[1.04]"
            style={{
              background: 'linear-gradient(120deg, #FF00C8 0%, #6E00FF 100%)',
              color: '#F5F0FF',
              borderRadius: 999,
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: 18,
              boxShadow:
                '0 0 50px -8px rgba(255,0,200,0.7), 0 0 100px -16px rgba(110,0,255,0.5)',
            }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', opacity: 0.85 }}>./</span>
            <span>réserver-un-call</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>

      {/* Sticky CTA bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: showStickyCta ? 0 : 100, opacity: showStickyCta ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        style={{
          pointerEvents: showStickyCta ? 'auto' : 'none',
        }}
      >
        <a
          href="https://calendly.com/clem-pred/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-3 transition-all hover:scale-[1.04]"
          style={{
            background: 'rgba(10,0,31,0.92)',
            border: '1px solid rgba(255,0,200,0.5)',
            borderRadius: 999,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 30px -8px rgba(255,0,200,0.7), 0 0 60px -12px rgba(110,0,255,0.5)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 14,
            color: '#F5F0FF',
            fontWeight: 500,
          }}
        >
          <motion.span
            className="h-2 w-2 rounded-full"
            style={{ background: '#00F0FF', boxShadow: '0 0 12px #00F0FF' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00F0FF' }}>./</span>
          Talk to a founder
          <span style={{ opacity: 0.6 }}>→</span>
        </a>
      </motion.div>
    </section>
  );
};

export default Pricing;
