import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// =====================================================
// CONCEPT A — EDITORIAL PRINT MAGAZINE
// Section IV — Pourquoi nous · Cinq raisons
// =====================================================
const Difference: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const reasons = [
    {
      n: '01',
      title: 'Partenaire sur la durée',
      desc: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff. Nous restons engagés sur la durée, parce qu'un workflow IA déployé sans suivi finit toujours par mourir.",
      tagline: '12 mois et plus, en moyenne.',
    },
    {
      n: '02',
      title: '70 % de pratique',
      desc: 'Chaque formation produit un livrable réel, utilisable dès J+1. Aucune théorie superflue. Vos équipes repartent avec des prompts, des workflows, des agents — pas avec des slides.',
      tagline: 'Livrables concrets, pas des slides.',
    },
    {
      n: '03',
      title: 'Résultats mesurés',
      desc: "ROI documenté sur chaque mission. On chiffre l'avant, on chiffre l'après. Cas clients publics : Carrefour, Blackfin Capital, Gravotech, KIT France, Espace 2.",
      tagline: 'ROI documenté, missions publiques.',
    },
    {
      n: '04',
      title: 'Toujours à jour',
      desc: 'Le champ bouge vite, nos contenus aussi. Modèles, agents, infrastructures — nous suivons les frontières dès qu\'elles bougent et adaptons formations et déploiements en continu.',
      tagline: 'Claude 4.6 · GPT-5.2 · Gemini 3.',
    },
    {
      n: '05',
      title: 'Un seul interlocuteur',
      desc: 'Du diagnostic au déploiement, pas de relais qui se perd entre équipes. Vous parlez à Clément ou à Alexis — directement, sans intermédiaire.',
      tagline: 'Clément ou Alexis, directement.',
    },
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
      {/* === VERTICAL TYPE LEFT === */}
      <div className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 origin-left -rotate-90 lg:block">
        <div className="text-[10px] uppercase tracking-[0.5em]" style={{ color: '#0F1A2E', opacity: 0.45 }}>
          Chapitre IV · Pourquoi nous
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
            IV — Pourquoi nous
          </span>
          <span className="hidden flex-1 border-b md:block" style={{ borderColor: '#0F1A2E', opacity: 0.2 }} />
          <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: '#0F1A2E', opacity: 0.55 }}>
            Cinq différences
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
            fontStyle: 'italic',
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            color: '#C8553D',
          }}
        >
          Cinq raisons.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 max-w-2xl"
          style={{ fontSize: '18px', lineHeight: 1.65, color: '#0F1A2E', opacity: 0.75 }}
        >
          Ce qui nous distingue de la masse des consultants IA. Aucune théorie superflue.
          Que du livrable mesurable.
        </motion.p>

        {/* === LIST STACKED === */}
        <div className="mt-20 border-t" style={{ borderColor: 'rgba(15,26,46,0.2)' }}>
          {reasons.map((r, i) => (
            <motion.article
              key={r.n}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative grid grid-cols-12 gap-6 border-b py-14 md:py-20"
              style={{ borderColor: 'rgba(15,26,46,0.2)' }}
            >
              {/* Watermark number gauche */}
              <div className="col-span-12 md:col-span-3 lg:col-span-4">
                <div
                  aria-hidden
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(120px, 18vw, 220px)',
                    fontWeight: 200,
                    lineHeight: 0.85,
                    color: '#C8553D',
                    opacity: 0.18,
                    letterSpacing: '-0.04em',
                    marginLeft: '-0.04em',
                  }}
                >
                  {r.n}
                </div>
              </div>

              {/* Titre + description droite */}
              <div className="col-span-12 md:col-span-9 lg:col-span-8">
                <div
                  className="mb-3 text-[10px] uppercase tracking-[0.32em]"
                  style={{ color: '#C8553D', fontWeight: 600 }}
                >
                  {r.n} —
                </div>
                <h3
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: 'clamp(28px, 3.2vw, 44px)',
                    fontWeight: 300,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: '#0F1A2E',
                  }}
                >
                  {r.title}
                </h3>
                <p
                  className="mt-5 max-w-2xl"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '17px',
                    lineHeight: 1.65,
                    color: '#0F1A2E',
                    opacity: 0.78,
                  }}
                >
                  {r.desc}
                </p>
                <div className="mt-7 flex items-baseline gap-3">
                  <span className="inline-block h-px w-10" style={{ background: '#C8553D' }} />
                  <span
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontStyle: 'italic',
                      fontSize: '20px',
                      color: '#C8553D',
                      fontWeight: 400,
                    }}
                  >
                    {r.tagline}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Difference;
