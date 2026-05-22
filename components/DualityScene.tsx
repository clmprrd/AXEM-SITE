import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT A — EDITORIAL PRINT MAGAZINE
// Section III — L'offre · Dualité (Formation + Conseil & Production)
// =====================================================
const DualityScene: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const formations = [
    { code: 'F01', name: 'IA Essentielle', level: 'Socle', price: '300 €', duration: '1 j' },
    { code: 'F02', name: 'Prompt Engineering Pro', level: 'Socle', price: '200 €', duration: '½ j' },
    { code: 'F03', name: 'Maîtriser Claude', level: 'Socle', price: '450 €', duration: '1 j' },
    { code: 'F04', name: 'IA pour tous les métiers', level: 'Métiers', price: '400 €', duration: '1 j' },
    { code: 'F05', name: 'No-Code & Workflows', level: 'Automat.', price: '800 €', duration: '2 j' },
    { code: 'F06', name: 'Agent IA sur-mesure', level: 'Automat.', price: '1 250 €', duration: '2 j' },
    { code: 'F07', name: 'Vibe Coding & Claude Code', level: 'Automat.', price: '450 €', duration: '1 j' },
    { code: 'F08', name: 'Gouvernance & AI Act', level: 'Transv.', price: '250 €', duration: '½ j' },
    { code: 'F09', name: 'Veille IA', level: 'Transv.', price: '80 €', duration: '2 h' },
    { code: 'F10', name: 'Création IA · Visuel · Vidéo', level: 'Production', price: '400 €', duration: '1 j' },
  ];

  const services = [
    { n: 'I', name: 'Audit IA', desc: 'Diagnostic, cartographie, scoring de maturité.', price: '1 à 4 sem.' },
    { n: 'II', name: 'Conseil stratégique', desc: 'Roadmap priorisée, choix outils, plan d\'adoption.', price: 'Sur devis' },
    { n: 'III', name: 'Déploiement & automatisation', desc: 'n8n · Make · Claude Code — clé en main.', price: 'dès 1 200 €' },
    { n: 'IV', name: 'Coaching individuel', desc: 'Référents, managers, dirigeants — sur mesure.', price: '200 € / sess.' },
    { n: 'V', name: 'Production IA', desc: 'Vidéos, voix, visuels, sites no-code, decks.', price: 'Sur devis' },
    { n: 'VI', name: 'Suivi long terme', desc: 'Maintenance, évolutions, opportunités.', price: '80 € / mois' },
    { n: 'VII', name: 'Abonnement partenaire', desc: 'Accès continu · 12 mois minimum.', price: '900 € + 80 €/m' },
  ];

  return (
    <section
      id="dualite"
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
          Chapitre III · L'offre
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
            III — L'offre
          </span>
          <span className="hidden flex-1 border-b md:block" style={{ borderColor: '#0F1A2E', opacity: 0.2 }} />
          <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: '#0F1A2E', opacity: 0.55 }}>
            Deux mondes · Un partenaire
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
            fontSize: 'clamp(40px, 7vw, 104px)',
            fontWeight: 300,
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            color: '#0F1A2E',
          }}
        >
          De l'audit à la{' '}
          <span style={{ fontStyle: 'italic', color: '#C8553D' }}>montée en compétences.</span>
        </motion.h2>

        {/* === TWO COLUMNS === */}
        <div className="relative mt-20 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-0">
          {/* Center vertical fillet */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
            style={{ background: '#C8553D', opacity: 0.4 }}
          />

          {/* GAUCHE — FORMATION */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="md:pr-12 lg:pr-16"
          >
            <div className="mb-8 flex items-baseline justify-between border-b pb-6" style={{ borderColor: 'rgba(15,26,46,0.2)' }}>
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.32em]"
                  style={{ color: '#C8553D', fontWeight: 600 }}
                >
                  Pôle Premier
                </div>
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: 'clamp(36px, 4.5vw, 56px)',
                    fontWeight: 300,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: '#0F1A2E',
                  }}
                >
                  <span style={{ fontStyle: 'italic', color: '#C8553D' }}>Formation</span>
                </h3>
              </div>
              <div
                className="inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] uppercase tracking-[0.24em]"
                style={{ borderColor: '#0F1A2E', color: '#0F1A2E' }}
              >
                <span className="inline-block h-1.5 w-1.5" style={{ background: '#C8553D' }} />
                Qualiopi
              </div>
            </div>

            <p
              className="mb-10 max-w-md"
              style={{ fontSize: '17px', lineHeight: 1.6, color: '#0F1A2E', opacity: 0.78 }}
            >
              <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C8553D' }}>10 formations</span>,{' '}
              <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C8553D' }}>3 niveaux</span>,{' '}
              <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C8553D' }}>70 % de pratique</span>. Vos équipes opérationnelles dès J+1. Financement OPCO.
            </p>

            <ul>
              {formations.map((f, i) => (
                <motion.li
                  key={f.code}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.03, ease: [0.2, 0.8, 0.2, 1] }}
                  className="group grid grid-cols-12 items-baseline gap-3 border-b py-3 transition-colors hover:bg-[#EBE4D6]/60"
                  style={{ borderColor: 'rgba(15,26,46,0.1)' }}
                >
                  <span
                    className="col-span-2 text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: '#C8553D', fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                  >
                    {f.code}
                  </span>
                  <span
                    className="col-span-6"
                    style={{ fontSize: '15px', color: '#0F1A2E', lineHeight: 1.4 }}
                  >
                    {f.name}
                  </span>
                  <span
                    className="col-span-2 text-right text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: '#0F1A2E', opacity: 0.55 }}
                  >
                    {f.duration}
                  </span>
                  <span
                    className="col-span-2 text-right"
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontStyle: 'italic',
                      fontSize: '17px',
                      fontWeight: 400,
                      color: '#C8553D',
                    }}
                  >
                    {f.price}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: '#0F1A2E', opacity: 0.55 }}>
              <span className="inline-block h-px w-8" style={{ background: '#C8553D' }} />
              <span>Bootcamps sur devis · Vidéo 24/7</span>
            </div>
          </motion.article>

          {/* DROITE — CONSEIL & PRODUCTION */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:pl-12 lg:pl-16"
          >
            <div className="mb-8 flex items-baseline justify-between border-b pb-6" style={{ borderColor: 'rgba(15,26,46,0.2)' }}>
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.32em]"
                  style={{ color: '#C8553D', fontWeight: 600 }}
                >
                  Pôle Second
                </div>
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: 'clamp(36px, 4.5vw, 56px)',
                    fontWeight: 300,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: '#0F1A2E',
                  }}
                >
                  <span style={{ fontStyle: 'italic', color: '#C8553D' }}>Conseil</span> &{' '}
                  <span style={{ fontStyle: 'italic', color: '#C8553D' }}>Production</span>
                </h3>
              </div>
              <div
                className="inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] uppercase tracking-[0.24em]"
                style={{ borderColor: '#0F1A2E', color: '#0F1A2E' }}
              >
                <span className="inline-block h-1.5 w-1.5" style={{ background: '#C8553D' }} />
                12 mois+
              </div>
            </div>

            <p
              className="mb-10 max-w-md"
              style={{ fontSize: '17px', lineHeight: 1.6, color: '#0F1A2E', opacity: 0.78 }}
            >
              De l'<span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C8553D' }}>audit</span> au{' '}
              <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C8553D' }}>déploiement</span>. Un seul interlocuteur, du diagnostic à l'autonomie.
            </p>

            <ul>
              {services.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                  className="group grid grid-cols-12 items-start gap-3 border-b py-4 transition-colors hover:bg-[#EBE4D6]/60"
                  style={{ borderColor: 'rgba(15,26,46,0.1)' }}
                >
                  <span
                    className="col-span-2"
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontStyle: 'italic',
                      fontSize: '28px',
                      fontWeight: 300,
                      color: '#C8553D',
                      lineHeight: 1,
                    }}
                  >
                    {s.n}
                  </span>
                  <div className="col-span-7">
                    <div style={{ fontSize: '15px', color: '#0F1A2E', lineHeight: 1.4, fontWeight: 500 }}>
                      {s.name}
                    </div>
                    <div
                      className="mt-1"
                      style={{ fontSize: '12.5px', lineHeight: 1.55, color: '#0F1A2E', opacity: 0.65 }}
                    >
                      {s.desc}
                    </div>
                  </div>
                  <span
                    className="col-span-3 text-right"
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontStyle: 'italic',
                      fontSize: '14px',
                      color: '#C8553D',
                      lineHeight: 1.3,
                    }}
                  >
                    {s.price}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: '#0F1A2E', opacity: 0.55 }}>
              <span className="inline-block h-px w-8" style={{ background: '#C8553D' }} />
              <span>Auto. 1 200–2 000 € · Abo 900 € + 80 €/mois</span>
            </div>
          </motion.article>
        </div>

        {/* === CONVERGENCE === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-28 border-t pt-20 text-center md:mt-36 md:pt-24"
          style={{ borderColor: 'rgba(15,26,46,0.2)' }}
        >
          <div className="mx-auto mb-6 h-10 w-px" style={{ background: '#C8553D' }} />
          <div
            className="mb-5 text-[10px] uppercase tracking-[0.42em]"
            style={{ color: '#C8553D', fontWeight: 600 }}
          >
            Convergence
          </div>
          <h3
            className="mx-auto max-w-4xl"
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 'clamp(36px, 5.5vw, 80px)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.0,
              letterSpacing: '-0.025em',
              color: '#0F1A2E',
            }}
          >
            Un seul interlocuteur.
          </h3>
          <p
            className="mx-auto mt-7 max-w-xl"
            style={{ fontSize: '17px', lineHeight: 1.6, color: '#0F1A2E', opacity: 0.7 }}
          >
            Pas de relais qui se perd entre équipes. Vous parlez à ceux qui livrent — un fondateur,
            de bout en bout.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DualityScene;
