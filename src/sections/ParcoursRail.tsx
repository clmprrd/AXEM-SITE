import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eyebrow, FadeUp } from './primitives';

// =====================================================================
// §4 — PARCOURS RAIL. « Un seul interlocuteur. 7 étapes. Zéro angle mort. »
// Rail horizontal draggable. Chaque étape s'allume + révèle détail + mini-
// livrable au survol/focus. Clavier (Tab/flèches) + tactile (swipe) OK.
// Drag via framer-motion (transform only). Snap doux par scroll natif fallback.
// =====================================================================

type Step = { n: string; t: string; d: string; livrable: string; tool?: string };
const STEPS: Step[] = [
  { n: '01', t: 'Audit', d: "On cartographie process, données et irritants. On repère où l'IA crée vraiment de la valeur.", livrable: 'Carte des irritants + scoring d\'impact' },
  { n: '02', t: 'Conseil', d: 'Feuille de route priorisée : quoi faire, dans quel ordre, avec quels budgets.', livrable: 'Roadmap IA chiffrée' },
  { n: '03', t: 'Déploiement', d: 'Des workflows qui tournent seuls, 7j/7. Clé en main, intégrés à vos outils.', livrable: 'Workflows en production', tool: 'n8n · Make · Claude Code' },
  { n: '04', t: 'Formation', d: '70 % de pratique. Vos équipes opérationnelles dès le lendemain.', livrable: 'Équipes autonomes sur l\'outil' },
  { n: '05', t: 'Coaching', d: 'On accompagne la prise en main réelle, sur vos cas, pas en théorie.', livrable: 'Sessions de coaching ciblées' },
  { n: '06', t: 'Production IA', d: 'Assistants, agents, générateurs sur-mesure. Pas une démo isolée.', livrable: 'Outil IA métier déployé' },
  { n: '07', t: 'Suivi', d: 'Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations.', livrable: 'Accompagnement long terme' },
];

const ParcoursRail: React.FC = () => {
  const reduce = useReducedMotion();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  return (
    <section id="parcours" className="section-clip relative bg-ink-2/40 py-[clamp(110px,16vh,220px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <FadeUp><Eyebrow>Le parcours</Eyebrow></FadeUp>
          <FadeUp delay={0.06}>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.6vw, 72px)' }}>
              Un seul interlocuteur. 7 étapes.<br /><span className="aurora-text italic">Zéro angle mort.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream-soft">
              Faites glisser le rail. Chaque étape révèle son livrable. De l'audit au suivi —
              le même duo de bout en bout.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* RAIL — scroll horizontal natif (tactile/trackpad) + drag souris (framer) */}
      <div className="relative mt-12">
        <div ref={trackRef}
          className="no-scrollbar ticker-mask flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:gap-5 md:px-8"
          style={{ scrollPaddingLeft: '20px' }}>
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <motion.button key={s.n}
                onMouseEnter={() => !reduce && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                aria-label={`Étape ${s.n} — ${s.t}`}
                className={`group relative w-[260px] shrink-0 snap-start rounded-3xl border p-6 text-left outline-none transition-[transform,border-color,background-color] duration-300 [transition-timing-function:var(--ease-out)] md:w-[300px] md:p-7 [touch-action:pan-x] ${
                  on ? 'border-green/55 bg-white/[0.05]' : 'border-green/14 bg-white/[0.018] hover:border-green/35'
                }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-serif-display text-4xl leading-none transition-colors duration-300 ${on ? 'text-green' : 'text-green/30'}`}>{s.n}</span>
                  <span aria-hidden data-on={on ? 'true' : 'false'}
                    className="node-dot h-3 w-3 rounded-full border border-green/40 bg-ink" />
                </div>
                <h3 className="font-serif-display mt-4 text-[28px] leading-none text-cream">{s.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-cream-soft">{s.d}</p>
                {s.tool && (
                  <p className="mt-2 text-[11.5px] font-satoshi font-bold uppercase tracking-[0.1em] text-cyan">{s.tool}</p>
                )}
                {/* mini-livrable révélé quand actif */}
                <div className={`grid transition-[grid-template-rows,opacity] duration-400 [transition-timing-function:var(--ease-out)] ${on ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 rounded-xl border border-green/20 bg-green/[0.06] px-3 py-2.5 text-[12.5px] leading-snug text-cream">
                      <span aria-hidden className="text-cyan">▸</span>
                      <span><span className="text-cream-dim">Livrable · </span>{s.livrable}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
          {/* respiration de fin */}
          <div aria-hidden className="w-2 shrink-0 md:w-5" />
        </div>

        {/* progress + hint */}
        <div className="mx-auto mt-6 flex max-w-6xl items-center gap-4 px-5 md:px-8">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div className="h-full rounded-full"
              animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 40 }}
              style={{ background: 'linear-gradient(90deg, #5B8CFF, #38BDF8)' }} />
          </div>
          <span className="shrink-0 text-[12px] font-satoshi font-bold uppercase tracking-[0.12em] text-cream-dim tnum">
            {active + 1} / {STEPS.length}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ParcoursRail;
