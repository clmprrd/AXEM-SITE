import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { Eyebrow, FadeUp } from './primitives';
import { usePlayground, sectorByKey, fmtEuro, fmtNum, scrollToId, PRIORITIES } from './store';

// =====================================================================
// §10 — RECAP CARD. « Voici ce que vous avez construit. »
// Carte AUTO-GÉNÉRÉE qui agrège les manipulations du visiteur (heures, €,
// ROI, secteur, parcours configuré). Sentiment « j'ai déjà mon devis ».
// Lit le store partagé → bouton « Finaliser » scrolle vers le mini-form.
// =====================================================================

const RecapCard: React.FC = () => {
  const reduce = useReducedMotion();
  const pg = usePlayground();
  const sector = sectorByKey(pg.sector);
  const priorityLabel = pg.priority ? PRIORITIES.find((p) => p.key === pg.priority)?.label : null;

  return (
    <section id="recap" className="section-clip relative px-5 py-[clamp(110px,16vh,220px)] md:px-8">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 -z-[1] h-[50vh] w-[50vh] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(91,140,255,0.16), transparent 65%)' }} />
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp><div className="flex justify-center"><Eyebrow>Votre récap</Eyebrow></div></FadeUp>
          <FadeUp delay={0.06}>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.6vw, 72px)' }}>
              Voici ce que vous avez <span className="aurora-text italic">construit.</span>
            </h2>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <div className="glass-strong relative mt-12 overflow-hidden rounded-3xl p-7 md:p-10">
            {/* en-tête « devis » */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-green/12 pb-5">
              <div className="flex items-center gap-3">
                <span className="font-serif-display text-3xl leading-none text-cream">AXEM<span className="aurora-text">.</span></span>
                <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cream-dim">Pré-devis personnalisé</span>
              </div>
              <span className="rounded-full border border-green/25 bg-green/[0.06] px-3 py-1.5 text-[12px] text-cream">{sector.emoji} {sector.label}</span>
            </div>

            {/* chiffres clés */}
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {[
                { v: `${fmtNum(pg.hoursSavedMonth)}`, u: 'h/mois', l: 'récupérables' },
                { v: fmtEuro(pg.euroSavedYear), u: '/an', l: 'valeur du temps libéré' },
                { v: `${fmtNum(pg.roi)} %`, u: '', l: 'ROI médian constaté' },
              ].map((k) => (
                <div key={k.l} className="rounded-2xl border border-green/12 bg-white/[0.02] px-5 py-5">
                  <div className="font-serif-display leading-[0.9] text-cream" style={{ fontSize: 'clamp(30px, 5vw, 46px)' }}>
                    {k.v}<span className="ml-1 text-[0.42em] text-cream-soft">{k.u}</span>
                  </div>
                  <div className="mt-1.5 text-[12px] font-satoshi font-bold uppercase tracking-[0.1em] text-cream-dim">{k.l}</div>
                </div>
              ))}
            </div>

            {/* paramètres saisis */}
            <div className="mt-5 flex flex-wrap gap-2.5 text-[12.5px]">
              <span className="rounded-full border border-green/15 bg-white/[0.02] px-3.5 py-1.5 text-cream-soft">{pg.teamSize} personnes concernées</span>
              <span className="rounded-full border border-green/15 bg-white/[0.02] px-3.5 py-1.5 text-cream-soft">{pg.hoursPerWeek} h répétitives/sem</span>
              {priorityLabel && <span className="rounded-full border border-cyan/25 bg-cyan/[0.06] px-3.5 py-1.5 text-cream">Priorité · {priorityLabel}</span>}
            </div>

            {/* parcours configuré (si dispo) */}
            {pg.pathBricks.length > 0 && (
              <div className="mt-6 border-t border-green/12 pt-5">
                <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.12em] text-cyan">Votre parcours esquissé</span>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {pg.pathBricks.map((b, i) => (
                    <React.Fragment key={b.id}>
                      <span className="rounded-xl border border-green/20 bg-green/[0.06] px-3 py-1.5 text-[12.5px] text-cream">{b.label}</span>
                      {i < pg.pathBricks.length - 1 && <span aria-hidden className="text-green/50">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-[13px] leading-snug text-cream-dim">
                Estimation indicative, calée sur nos missions. On l'affine ensemble en 30 min.
              </p>
              <button onClick={() => scrollToId('qualif')} className="btn btn-primary">
                <span className="btn-sweep" aria-hidden />
                <span className="relative">Finaliser en 30 min</span>
                <span className="btn-arrow relative" aria-hidden>→</span>
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default RecapCard;
