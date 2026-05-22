import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// =====================================================
// CONCEPT A — EDITORIAL PRINT MAGAZINE
// Section II — Fondateurs (Qui sommes-nous)
// Palette : crème #F4EFE6, ivoire #EBE4D6, encre #0F1A2E, vermillon #C8553D
// Fonts : Fraunces + Inter
// =====================================================
const Philosophy: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const clementImage = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
  const alexisImage = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

  const founders = [
    {
      img: clementImage,
      name: 'Clément Predo',
      school: 'ESSEC',
      bullets: [
        'Trois ans d\'IA appliquée, formations et conseil.',
        'Pilotage des missions audit et stratégie.',
        'Auteur, +40k abonnés LinkedIn — référence FR.',
      ],
      stat: '+40K',
      statLabel: 'abonnés LinkedIn',
      linkedin: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/',
    },
    {
      img: alexisImage,
      name: 'Alexis Zeitoun',
      school: 'Institut Polytechnique de Paris',
      bullets: [
        'Déploiement terrain, expertise technique.',
        'Secteur financier · fonds de Private Equity.',
        'Architecte n8n · Make · Claude Code.',
      ],
      stat: '+15K',
      statLabel: 'abonnés LinkedIn',
      linkedin: 'https://www.linkedin.com/in/alexiszeitoun/',
    },
  ];

  return (
    <section
      id="qui-sommes-nous"
      className="relative isolate overflow-hidden"
      style={{
        background: '#F4EFE6',
        color: '#0F1A2E',
        fontFamily: 'Inter, sans-serif',
        borderTop: '1px solid rgba(15,26,46,0.15)',
      }}
    >
      {/* === VERTICAL TYPE LEFT === */}
      <div className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 origin-left -rotate-90 lg:block">
        <div
          className="text-[10px] uppercase tracking-[0.5em]"
          style={{ color: '#0F1A2E', opacity: 0.45 }}
        >
          Chapitre II · Fondateurs
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-6 py-28 md:px-8 md:py-36">
        {/* === EYEBROW + TITLE === */}
        <div className="grid grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="col-span-12 mb-8 flex items-baseline gap-6"
          >
            <span
              className="text-[11px] uppercase tracking-[0.42em]"
              style={{ color: '#C8553D', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
            >
              II — Fondateurs
            </span>
            <span className="hidden flex-1 border-b md:block" style={{ borderColor: '#0F1A2E', opacity: 0.2 }} />
            <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: '#0F1A2E', opacity: 0.55 }}>
              Qui sommes-nous
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="col-span-12 md:col-span-10"
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(40px, 7vw, 96px)',
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: '#0F1A2E',
            }}
          >
            Deux experts.{' '}
            <span style={{ fontStyle: 'italic', color: '#C8553D' }}>Une exigence.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="col-span-12 mt-10 max-w-2xl md:col-span-8"
            style={{ fontSize: '18px', lineHeight: 1.65, color: '#0F1A2E', opacity: 0.75 }}
          >
            Pas une agence de plus. La rigueur d'un cabinet de conseil, l'agilité d'un studio
            indépendant. Du diagnostic au déploiement, vous parlez à un fondateur — jamais à un
            chargé de compte.
          </motion.p>
        </div>

        {/* === FOUNDERS GRID === */}
        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {founders.map((f, idx) => (
            <motion.article
              key={f.name}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative"
            >
              {/* Photo N&B grain effect */}
              <div className="relative mb-8 overflow-hidden" style={{ background: '#EBE4D6' }}>
                <img
                  src={f.img}
                  alt={f.name}
                  className="h-[440px] w-full object-cover"
                  style={{
                    filter: 'grayscale(100%) contrast(1.05) brightness(0.96)',
                    mixBlendMode: 'multiply',
                  }}
                />
                {/* Grain overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(15,26,46,0.18) 1px, transparent 1px)',
                    backgroundSize: '3px 3px',
                    opacity: 0.35,
                    mixBlendMode: 'multiply',
                  }}
                />
                {/* Caption corner */}
                <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.32em]" style={{ color: '#F4EFE6' }}>
                  Fig. {idx === 0 ? 'I' : 'II'} · {f.name.split(' ')[0]}
                </div>
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center transition-transform hover:scale-110"
                  style={{ background: '#F4EFE6', color: '#0F1A2E' }}
                  aria-label={`LinkedIn de ${f.name}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              {/* Name */}
              <h3
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 300,
                  lineHeight: 1.0,
                  letterSpacing: '-0.015em',
                  color: '#0F1A2E',
                }}
              >
                {f.name}
              </h3>

              {/* Subtitle */}
              <p
                className="mt-3 text-[11px] uppercase tracking-[0.32em]"
                style={{ color: '#0F1A2E', opacity: 0.65, fontWeight: 600 }}
              >
                Co-fondateur · {f.school}
              </p>

              {/* Bullets */}
              <ul className="mt-7 space-y-3 border-t pt-6" style={{ borderColor: 'rgba(15,26,46,0.18)' }}>
                {f.bullets.map((b, i) => (
                  <li key={b} className="flex items-baseline gap-3" style={{ fontSize: '15px', lineHeight: 1.6, color: '#0F1A2E' }}>
                    <span
                      className="flex-shrink-0 text-[11px] uppercase tracking-[0.18em]"
                      style={{ color: '#C8553D', fontWeight: 600, minWidth: '20px' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ opacity: 0.85 }}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Big number */}
              <div className="mt-10 flex items-baseline gap-5 border-t pt-8" style={{ borderColor: 'rgba(15,26,46,0.18)' }}>
                <span
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: 'clamp(72px, 9vw, 96px)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    lineHeight: 0.9,
                    color: '#C8553D',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {f.stat}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: '#0F1A2E', opacity: 0.6, fontWeight: 600 }}
                >
                  {f.statLabel}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* === PULLQUOTE pleine page === */}
        <motion.figure
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-28 border-t pt-20 md:mt-36 md:pt-24"
          style={{ borderColor: 'rgba(15,26,46,0.18)' }}
        >
          <blockquote
            className="relative mx-auto max-w-5xl"
            style={{
              fontFamily: 'Fraunces, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(40px, 8vw, 120px)',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              color: '#0F1A2E',
              fontWeight: 300,
            }}
          >
            <span
              aria-hidden
              style={{
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(200px, 28vw, 420px)',
                fontWeight: 200,
                lineHeight: 0.7,
                color: '#C8553D',
                float: 'left',
                marginRight: '0.04em',
                marginTop: '-0.18em',
              }}
            >
              «
            </span>
            <span>
              L'IA n'a pas besoin de plus de promesses. Elle a besoin{' '}
              <span style={{ color: '#C8553D' }}>d'opérateurs.</span>
            </span>
          </blockquote>
          <figcaption
            className="mt-10 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: '#0F1A2E', opacity: 0.6 }}
          >
            <span className="inline-block h-px w-12" style={{ background: '#C8553D' }} />
            <span>Clément Predo & Alexis Zeitoun — Manifeste AXEM, 2026</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

export default Philosophy;
