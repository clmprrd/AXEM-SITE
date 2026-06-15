import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eyebrow, FadeUp } from './primitives';

// =====================================================================
// §5 — SCRATCH CASES. « Anonymisés mais réels. Révélez le chiffre. »
// 4 cartes (secteur + problème visibles). Au hover/drag/tap le résultat se
// dévoile — effet « gratter le ticket » : un voile glissant se rétracte et
// révèle le chiffre. Tactile (tap = toggle) + desktop (hover).
// reduced-motion → résultat affiché directement.
// =====================================================================

const CASES_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';

type ScratchCase = {
  sector: string; problem: string;
  result: string; metrics: string;
};
const CASES: ScratchCase[] = [
  { sector: 'BTP · Rénovation',
    problem: 'Chiffrage manuel chronophage, devis lents, marges grignotées par les erreurs.',
    result: '80 %', metrics: 'de temps de saisie en moins · 95 k€/an neutralisés' },
  { sector: 'Administration judiciaire',
    problem: 'Traitement documentaire massif, saisie répétitive, risque d\'erreur élevé.',
    result: '×4', metrics: 'plus rapide · +5 h/sem libérées · fiabilité 100 %' },
  { sector: 'Adhésifs aéro / ferroviaire',
    problem: 'Conformité ADV lourde, contrôles manuels, anomalies détectées trop tard.',
    result: '317 h', metrics: 'libérées / mois · anomalies détectées > 98 %' },
  { sector: 'Éditeur médico-social',
    problem: 'Support et rédaction de contenus métier saturés, délais qui s\'allongent.',
    result: '20 → 80', metrics: '20 ambassadeurs internes · 80 devs outillés' },
];

const ScratchCard: React.FC<{ c: ScratchCase; i: number }> = ({ c, i }) => {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = React.useState(!!reduce);

  return (
    <FadeUp delay={(i % 2) * 0.08}>
      <article
        tabIndex={0}
        onMouseEnter={() => !reduce && setRevealed(true)}
        onMouseLeave={() => !reduce && setRevealed(false)}
        onFocus={() => setRevealed(true)}
        onClick={() => setRevealed((v) => !v)}
        aria-label={`${c.sector} — toucher pour révéler le résultat`}
        className="group glass relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-3xl p-7 outline-none focus-visible:-translate-y-1 md:p-9 [touch-action:manipulation]">
        <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cyan">{c.sector}</span>
        <p className="text-[14.5px] leading-relaxed text-cream-soft">
          <span className="font-semibold text-cream">Problème · </span>{c.problem}
        </p>

        {/* ZONE À GRATTER */}
        <div className="relative mt-auto overflow-hidden rounded-2xl border border-green/12 bg-white/[0.02]">
          <div className="flex items-center justify-between gap-3 px-5 py-5">
            <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.12em] text-cream-dim">Résultat</span>
            <div className="text-right">
              <span className="font-serif-display leading-none text-green" style={{ fontSize: 'clamp(36px, 6vw, 56px)' }}>{c.result}</span>
              <p className="mt-1 max-w-[220px] text-[12px] leading-snug text-cream-dim">{c.metrics}</p>
            </div>
          </div>
          {/* VOILE GLISSANT — se rétracte au reveal (transform only) */}
          {!reduce && (
            <motion.div aria-hidden
              initial={false}
              animate={{ x: revealed ? '101%' : '0%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 36 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(110deg, #0e1830, #0a1224)' }}>
              <span className="flex items-center gap-2 text-[12.5px] font-satoshi font-bold uppercase tracking-[0.14em] text-cream-soft">
                <span aria-hidden className="text-cyan">✦</span> Gratter pour révéler
              </span>
              {/* texture « ticket » */}
              <span aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.5]"
                style={{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(120,160,255,0.06) 0 2px, transparent 2px 9px)' }} />
            </motion.div>
          )}
        </div>
      </article>
    </FadeUp>
  );
};

const ScratchCases: React.FC = () => (
  <section id="cas" className="section-clip relative px-5 py-[clamp(110px,16vh,220px)] md:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="max-w-3xl">
        <FadeUp><Eyebrow>Cas clients</Eyebrow></FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.6vw, 72px)' }}>
            Anonymisés mais réels.<br /><span className="aurora-text italic">Révélez le chiffre.</span>
          </h2>
        </FadeUp>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {CASES.map((c, i) => <ScratchCard key={c.sector} c={c} i={i} />)}
      </div>

      <FadeUp delay={0.1}>
        <div className="mt-12 flex justify-center">
          <a href={CASES_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <span className="btn-underline">Voir tous les cas clients</span>
            <span className="btn-arrow relative" aria-hidden>→</span>
          </a>
        </div>
      </FadeUp>
    </div>
  </section>
);

export default ScratchCases;
