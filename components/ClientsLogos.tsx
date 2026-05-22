import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT A — EDITORIAL PRINT MAGAZINE
// Section V — Références · Clients & Partenaires
// =====================================================
const ClientsLogos: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const clients = ['Carrefour', 'Blackfin', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech'];
  const partners = ['myconnecting', 'synapse ia', 'ASphere', 'AI sisters', 'SENZA', 'Cegos'];
  const sectors = [
    'Éditeur logiciel',
    'BTP · Rénovation',
    'Administration judiciaire',
    'Aéronautique & Ferroviaire',
    'Promotion immobilière',
    'Industrie · Manufacturing',
    'Conseil & Expertise',
    'Grande distribution',
  ];

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        background: '#F4EFE6',
        color: '#0F1A2E',
        fontFamily: 'Inter, sans-serif',
        borderTop: '1px solid rgba(15,26,46,0.15)',
      }}
    >
      {/* === VERTICAL TYPE RIGHT === */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 origin-right rotate-90 lg:block">
        <div className="text-[10px] uppercase tracking-[0.5em]" style={{ color: '#0F1A2E', opacity: 0.45 }}>
          Chapitre V · Références
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-6 py-28 md:px-8 md:py-36">
        {/* === EYEBROW === */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-baseline gap-6"
        >
          <span
            className="text-[11px] uppercase tracking-[0.42em]"
            style={{ color: '#C8553D', fontWeight: 600 }}
          >
            V — Références
          </span>
          <span className="hidden flex-1 border-b md:block" style={{ borderColor: '#0F1A2E', opacity: 0.2 }} />
          <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: '#0F1A2E', opacity: 0.55 }}>
            Clients & Partenaires
          </span>
        </motion.div>

        {/* === TITLE === */}
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-5xl"
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 'clamp(40px, 7vw, 96px)',
            fontWeight: 300,
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            color: '#0F1A2E',
          }}
        >
          Ils nous ont{' '}
          <span style={{ fontStyle: 'italic', color: '#C8553D' }}>confié</span> leur IA.
        </motion.h2>

        {/* === TWO COLUMNS === */}
        <div className="relative mt-20 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-0">
          {/* Center fillet */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
            style={{ background: '#0F1A2E', opacity: 0.18 }}
          />

          {/* CLIENTS */}
          <div className="md:pr-12 lg:pr-16">
            <div className="mb-7 flex items-baseline justify-between border-b pb-4" style={{ borderColor: 'rgba(15,26,46,0.2)' }}>
              <div
                className="text-[10px] uppercase tracking-[0.42em]"
                style={{ color: '#C8553D', fontWeight: 600 }}
              >
                Clients
              </div>
              <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: '#0F1A2E', opacity: 0.5 }}>
                Sept missions livrées
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {clients.map((c, i) => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="flex h-20 items-center justify-center border transition-colors hover:bg-[#EBE4D6]"
                  style={{ borderColor: 'rgba(15,26,46,0.18)', background: '#FDFBF7' }}
                >
                  <span
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontSize: '20px',
                      fontWeight: 400,
                      color: '#0F1A2E',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {c}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Case study citation */}
            <motion.figure
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 border-l-2 pl-5"
              style={{ borderColor: '#C8553D' }}
            >
              <blockquote
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontStyle: 'italic',
                  fontSize: '18px',
                  lineHeight: 1.5,
                  color: '#0F1A2E',
                  fontWeight: 400,
                }}
              >
                « Audit, formations, déploiement n8n — un partenariat continu sur plus d'un an,
                avec des workflows en production. »
              </blockquote>
              <figcaption
                className="mt-3 text-[10px] uppercase tracking-[0.28em]"
                style={{ color: '#0F1A2E', opacity: 0.6 }}
              >
                — Mission Carrefour · 2025
              </figcaption>
            </motion.figure>
          </div>

          {/* PARTENAIRES */}
          <div className="md:pl-12 lg:pl-16">
            <div className="mb-7 flex items-baseline justify-between border-b pb-4" style={{ borderColor: 'rgba(15,26,46,0.2)' }}>
              <div
                className="text-[10px] uppercase tracking-[0.42em]"
                style={{ color: '#C8553D', fontWeight: 600 }}
              >
                Partenaires formation
              </div>
              <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: '#0F1A2E', opacity: 0.5 }}>
                Réseau Qualiopi
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {partners.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="flex h-20 items-center justify-center border transition-colors hover:bg-[#EBE4D6]"
                  style={{ borderColor: 'rgba(15,26,46,0.18)', background: '#FDFBF7' }}
                >
                  <span
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontSize: '20px',
                      fontWeight: 400,
                      color: '#0F1A2E',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {p}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Case study citation */}
            <motion.figure
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 border-l-2 pl-5"
              style={{ borderColor: '#C8553D' }}
            >
              <blockquote
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontStyle: 'italic',
                  fontSize: '18px',
                  lineHeight: 1.5,
                  color: '#0F1A2E',
                  fontWeight: 400,
                }}
              >
                « AXEM IA conçoit et anime nos modules Claude et n8n — interventions concrètes,
                évaluations Qualiopi sans réserve. »
              </blockquote>
              <figcaption
                className="mt-3 text-[10px] uppercase tracking-[0.28em]"
                style={{ color: '#0F1A2E', opacity: 0.6 }}
              >
                — Réseau partenaires · 2025–2026
              </figcaption>
            </motion.figure>
          </div>
        </div>

        {/* === MARQUEE SECTEURS === */}
        <div className="mt-24 border-t pt-14" style={{ borderColor: 'rgba(15,26,46,0.2)' }}>
          <div
            className="mb-7 text-center text-[10px] uppercase tracking-[0.42em]"
            style={{ color: '#C8553D', fontWeight: 600 }}
          >
            Sept secteurs · des résultats mesurés
          </div>
          <div
            className="group relative overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <motion.div
              className="flex w-max gap-12 py-3 group-hover:[animation-play-state:paused]"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 50, ease: 'linear', repeat: Infinity }}
              style={{ willChange: 'transform' }}
            >
              {[...sectors, ...sectors].map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="flex shrink-0 items-center gap-5 whitespace-nowrap"
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontStyle: 'italic',
                    fontSize: '26px',
                    fontWeight: 300,
                    color: '#0F1A2E',
                    opacity: 0.75,
                    letterSpacing: '-0.015em',
                  }}
                >
                  <span className="inline-block h-1.5 w-1.5" style={{ background: '#C8553D' }} />
                  {s}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* === QUALIOPI BADGE === */}
        <div
          className="mt-16 flex flex-col items-center justify-center gap-8 border-t pt-14 md:flex-row md:gap-12"
          style={{ borderColor: 'rgba(15,26,46,0.2)' }}
        >
          <div className="text-center md:text-right">
            <div
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.1,
                color: '#0F1A2E',
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ fontStyle: 'italic', color: '#C8553D' }}>Qualiopi</span> · processus certifié
            </div>
            <div
              className="mt-2 text-[10px] uppercase tracking-[0.28em]"
              style={{ color: '#0F1A2E', opacity: 0.6 }}
            >
              Formations finançables OPCO · IZY for pro
            </div>
          </div>
          <div className="hidden h-14 w-px md:block" style={{ background: 'rgba(15,26,46,0.2)' }} />
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-14 items-stretch overflow-hidden border"
              style={{ borderColor: 'rgba(15,26,46,0.25)' }}
              aria-hidden
            >
              <span className="flex-1" style={{ background: '#0F1A2E' }} />
              <span className="flex-1" style={{ background: '#F4EFE6' }} />
              <span className="flex-1" style={{ background: '#C8553D' }} />
            </div>
            <span
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '15px',
                color: '#0F1A2E',
                fontWeight: 400,
              }}
            >
              République Française
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsLogos;
