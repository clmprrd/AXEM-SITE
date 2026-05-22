import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowUpRight } from 'lucide-react';

// =====================================================
// CONCEPT A — EDITORIAL PRINT MAGAZINE
// Section VI — Tarification (Talk to founder hybride)
// =====================================================
const Pricing: React.FC = () => {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clementImage = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
  const alexisImage = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

  return (
    <section
      id="pricing"
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
        <div className="text-[10px] uppercase tracking-[0.5em]" style={{ color: '#0F1A2E', opacity: 0.45 }}>
          Chapitre VI · Tarification
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
            VI — Tarification
          </span>
          <span className="hidden flex-1 border-b md:block" style={{ borderColor: '#0F1A2E', opacity: 0.2 }} />
          <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: '#0F1A2E', opacity: 0.55 }}>
            Devis sous 24h
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
          Transparente. Modulaire.{' '}
          <span style={{ fontStyle: 'italic', color: '#C8553D' }}>Finançable.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 max-w-2xl"
          style={{ fontSize: '18px', lineHeight: 1.65, color: '#0F1A2E', opacity: 0.78 }}
        >
          Pas de grille SaaS rigide. Une proposition adaptée à votre projet, à votre calendrier, à
          votre budget. Devis sous 24h — accompagnement par un fondateur, de bout en bout.
        </motion.p>

        {/* === MAIN CARD : Talk to founder === */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mt-20 grid grid-cols-1 gap-0 border md:grid-cols-12"
          style={{ borderColor: '#0F1A2E', background: '#FDFBF7' }}
        >
          {/* Photo founders */}
          <div className="relative overflow-hidden md:col-span-5" style={{ background: '#EBE4D6' }}>
            <div className="grid h-full grid-cols-2 gap-px" style={{ background: '#0F1A2E' }}>
              <img
                src={clementImage}
                alt="Clément Predo"
                className="h-full min-h-[280px] w-full object-cover md:min-h-[460px]"
                style={{ filter: 'grayscale(100%) contrast(1.05) brightness(0.95)' }}
              />
              <img
                src={alexisImage}
                alt="Alexis Zeitoun"
                className="h-full min-h-[280px] w-full object-cover md:min-h-[460px]"
                style={{ filter: 'grayscale(100%) contrast(1.05) brightness(0.95)' }}
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(15,26,46,0.18) 1px, transparent 1px)',
                backgroundSize: '3px 3px',
                opacity: 0.3,
                mixBlendMode: 'multiply',
              }}
            />
            <div
              className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.32em]"
              style={{ color: '#F4EFE6' }}
            >
              Fig. III · Vos interlocuteurs
            </div>
          </div>

          {/* Right : CTA */}
          <div className="flex flex-col justify-center p-8 md:col-span-7 md:p-12">
            <div
              className="text-[10px] uppercase tracking-[0.42em]"
              style={{ color: '#C8553D', fontWeight: 600 }}
            >
              Talk to a founder
            </div>
            <h3
              className="mt-5"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                fontWeight: 300,
                lineHeight: 1.0,
                letterSpacing: '-0.025em',
                color: '#0F1A2E',
              }}
            >
              Parlons de votre projet.
            </h3>
            <p
              className="mt-6 max-w-md"
              style={{ fontSize: '16.5px', lineHeight: 1.6, color: '#0F1A2E', opacity: 0.78 }}
            >
              30 minutes avec Clément ou Alexis pour cadrer votre besoin et chiffrer une première
              étape. Pas de qualification commerciale, pas de SDR. Le fondateur, en direct.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://calendly.com/clem-pred/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-7 py-4 text-sm font-semibold transition-transform hover:scale-[1.02]"
                style={{
                  background: '#0F1A2E',
                  color: '#F4EFE6',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                <Calendar className="h-4 w-4" />
                <span>Réserver 30 min (gratuit)</span>
                <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>→</span>
              </a>
              <a
                href="mailto:contact@axem-ia.fr"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-medium transition-colors hover:bg-[#0F1A2E]/5"
                style={{
                  border: '1px solid #0F1A2E',
                  color: '#0F1A2E',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                contact@axem-ia.fr
              </a>
            </div>

            <div
              className="mt-10 flex flex-col gap-4 border-t pt-6 text-[12px] uppercase tracking-[0.18em] sm:flex-row sm:gap-8"
              style={{ borderColor: 'rgba(15,26,46,0.18)', color: '#0F1A2E', opacity: 0.7 }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5" style={{ background: '#C8553D' }} />
                Devis sous 24h
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5" style={{ background: '#C8553D' }} />
                Sans engagement
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5" style={{ background: '#C8553D' }} />
                100 % Paris
              </span>
            </div>
          </div>
        </motion.div>

        {/* === TWO COLUMNS PRICING SUMMARY === */}
        <div className="relative mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
            style={{ background: '#0F1A2E', opacity: 0.18 }}
          />

          {/* FORMATIONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="md:pr-10 lg:pr-14"
          >
            <div
              className="text-[10px] uppercase tracking-[0.42em]"
              style={{ color: '#C8553D', fontWeight: 600 }}
            >
              Formations Qualiopi
            </div>
            <h4
              className="mt-4"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(30px, 3.5vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#0F1A2E',
              }}
            >
              <span style={{ fontStyle: 'italic', color: '#C8553D' }}>200 €</span> à{' '}
              <span style={{ fontStyle: 'italic', color: '#C8553D' }}>1 250 €</span> / personne
            </h4>
            <ul className="mt-6 space-y-3 border-t pt-5" style={{ borderColor: 'rgba(15,26,46,0.18)' }}>
              {[
                'Socle (F01–F03) — 200 à 450 €',
                'Métiers (F04) — 400 €',
                'Automatisation (F05–F07) — 450 à 1 250 €',
                'Gouvernance & Veille (F08–F09) — 80 à 250 €',
                'Production (F10) — 400 €',
              ].map((l) => (
                <li key={l} className="flex items-baseline gap-3" style={{ fontSize: '15px', lineHeight: 1.5, color: '#0F1A2E' }}>
                  <span style={{ color: '#C8553D' }}>—</span>
                  <span style={{ opacity: 0.85 }}>{l}</span>
                </li>
              ))}
            </ul>
            <p
              className="mt-6 text-[12px] uppercase tracking-[0.2em]"
              style={{ color: '#0F1A2E', opacity: 0.6 }}
            >
              Finançable OPCO · IZY for pro
            </p>
          </motion.div>

          {/* CONSEIL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:pl-10 lg:pl-14"
          >
            <div
              className="text-[10px] uppercase tracking-[0.42em]"
              style={{ color: '#C8553D', fontWeight: 600 }}
            >
              Conseil & Déploiement
            </div>
            <h4
              className="mt-4"
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(30px, 3.5vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#0F1A2E',
              }}
            >
              <span style={{ fontStyle: 'italic', color: '#C8553D' }}>Sur mesure</span> · modulaire
            </h4>
            <ul className="mt-6 space-y-3 border-t pt-5" style={{ borderColor: 'rgba(15,26,46,0.18)' }}>
              {[
                'Audit IA — 1 à 4 semaines',
                'Automatisation — 1 200 à 2 000 €',
                'Abonnement partenaire — 900 € + 80 €/mois',
                'Coaching individuel — 200 € / session',
                'Production IA & Suivi long terme — sur devis',
              ].map((l) => (
                <li key={l} className="flex items-baseline gap-3" style={{ fontSize: '15px', lineHeight: 1.5, color: '#0F1A2E' }}>
                  <span style={{ color: '#C8553D' }}>—</span>
                  <span style={{ opacity: 0.85 }}>{l}</span>
                </li>
              ))}
            </ul>
            <p
              className="mt-6 text-[12px] uppercase tracking-[0.2em]"
              style={{ color: '#0F1A2E', opacity: 0.6 }}
            >
              Partenariat moyen · 12 mois et plus
            </p>
          </motion.div>
        </div>
      </div>

      {/* === STICKY CTA BAR === */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t"
            style={{
              background: '#0F1A2E',
              color: '#F4EFE6',
              borderColor: '#C8553D',
              borderTopWidth: '3px',
            }}
          >
            <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-3 px-6 py-3 md:flex-row md:px-8 md:py-4">
              <div className="flex items-baseline gap-4">
                <span
                  className="text-[10px] uppercase tracking-[0.32em]"
                  style={{ color: '#C8553D', fontWeight: 600 }}
                >
                  Disponible
                </span>
                <span
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontStyle: 'italic',
                    fontSize: '18px',
                    color: '#F4EFE6',
                  }}
                >
                  Parlons de votre projet — 30 min avec un fondateur.
                </span>
              </div>
              <a
                href="https://calendly.com/clem-pred/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
                style={{ background: '#C8553D', color: '#F4EFE6' }}
              >
                <span>Réserver maintenant</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Pricing;
