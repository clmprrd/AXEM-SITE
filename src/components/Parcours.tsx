import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';

// =====================================================================
// 5. LE PARCOURS — 7 ÉTAPES (refonte perf).
// Pin + scrub horizontal le long de la ligne ; chaque étape s'allume quand le
// scrub l'atteint ; la 7e ne se referme pas (la ligne continue).
//
// PERF — ce qui tue l'ancien lag :
// • l'ancien `setP(v)` re-render­ait toute la section à CHAQUE FRAME. Désormais
//   le translate horizontal est une motion value spring-lissée (GPU), et
//   l'étape active n'est mise à jour qu'au FRANCHISSEMENT de seuil (rare) ;
// • la barre de progression est animée par scaleX (transform), pas par re-render.
// Mobile : pin + scrub DÉSACTIVÉS → empilé vertical.
// =====================================================================

const STEPS = [
  { n: '01', t: 'Audit IA', d: 'On cartographie vos process, vos données, vos irritants. Là où l\'IA crée vraiment de la valeur.' },
  { n: '02', t: 'Conseil', d: 'Feuille de route priorisée : quoi faire, dans quel ordre, avec quel budget.' },
  { n: '03', t: 'Déploiement & automatisation', d: 'Des workflows qui tournent seuls. n8n, Make, Claude Code. Clé en main.' },
  { n: '04', t: 'Formation', d: 'On forme vos équipes à faire sans nous. 70 % de pratique, opérationnel dès J+1.' },
  { n: '05', t: 'Coaching', d: 'On accompagne la prise en main, on lève les blocages, on ancre les réflexes.' },
  { n: '06', t: 'Production IA', d: 'Assistants, agents, générateurs sur-mesure, intégrés à vos outils.' },
  { n: '07', t: 'Suivi — on reste', d: 'Une fois déployé, on reste. Maintenance, évolutions, long terme. La ligne ne s\'arrête pas ici.' },
];

export const Parcours: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // détection mobile (pas de pin/scrub horizontal en dessous de 860px)
  const [stacked, setStacked] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const upd = () => setStacked(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  const pinDisabled = reduce || stacked;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // SPRING-lissage → glissement horizontal fluide et amorti.
  const smooth = useSpring(scrollYProgress, { stiffness: 130, damping: 32, mass: 0.5 });
  const prog = pinDisabled ? scrollYProgress : smooth;
  // translation horizontale du rail (réversible). GPU only.
  const x = useTransform(prog, [0, 1], ['0%', '-78%']);
  // barre de progression : scaleX 0→1 (transform, pas de re-render).
  const barScaleX = useTransform(prog, [0, 1], [0, 1]);

  // étape active : seulement mise à jour au FRANCHISSEMENT (pas chaque frame).
  const [activeIdx, setActiveIdx] = React.useState(pinDisabled ? STEPS.length - 1 : 0);
  useMotionValueEvent(prog, 'change', (v) => {
    if (pinDisabled) return;
    const idx = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length + 0.15));
    setActiveIdx((prev) => (prev === idx ? prev : idx));
  });
  React.useEffect(() => {
    if (pinDisabled) setActiveIdx(STEPS.length - 1);
  }, [pinDisabled]);

  return (
    <section
      id="parcours"
      ref={ref}
      className="steps-pin section-clip relative bg-ink-2/40"
      style={{ height: pinDisabled ? 'auto' : '420vh' }}>
      <div
        className="steps-sticky sticky top-0 flex min-h-[100svh] flex-col justify-center overflow-hidden py-20"
        style={pinDisabled ? { position: 'static' } : undefined}>
        <div className="mx-auto mb-12 w-full max-w-6xl px-5 md:px-8">
          <div className="eyebrow mb-5 flex items-center gap-2.5 text-[11px] text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />Le parcours
          </div>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.5vw, 72px)' }}>
            Sept étapes, <span className="aurora-text italic">une seule ligne.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-cream-soft">
            Du premier diagnostic à votre autonomie. La ligne relie chaque étape — et ne se referme jamais à la dernière.
          </p>
        </div>

        {/* RAIL horizontal — scrub au scroll (desktop) / empilé (mobile) */}
        <div className="w-full overflow-hidden px-5 md:px-8">
          <motion.div
            className="steps-track flex items-stretch gap-5"
            style={pinDisabled ? undefined : { x, width: '178%' }}>
            {STEPS.map((s, i) => (
              <article
                key={s.n}
                data-active={i <= activeIdx ? 'true' : 'false'}
                className="step-card glass relative flex w-[80vw] max-w-[420px] shrink-0 flex-col rounded-3xl p-7 md:w-[34vw] md:p-9">
                {/* nœud d'étape allumé */}
                <span
                  aria-hidden
                  data-on={i <= activeIdx ? 'true' : 'false'}
                  className="ligne-node absolute right-6 top-6 h-3 w-3 rounded-full border border-green/40 bg-ink"
                />
                <span className="font-serif-display text-5xl text-green/40">{s.n}</span>
                <h3 className="font-serif-display mt-3 text-[26px] leading-[1.05] text-cream md:text-[30px]">{s.t}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-cream-soft">{s.d}</p>
                {i === STEPS.length - 1 && (
                  <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-satoshi font-bold uppercase tracking-[0.12em] text-cyan">
                    <span className="h-px w-8 bg-gradient-to-r from-green to-cyan" />la ligne continue
                  </span>
                )}
              </article>
            ))}
          </motion.div>
        </div>

        {/* indicateur de progression du scrub (desktop) — scaleX, pas de re-render */}
        {!pinDisabled && (
          <div className="mx-auto mt-10 w-full max-w-6xl px-5 md:px-8">
            <div className="h-1 w-full overflow-hidden rounded-full bg-[rgba(120,160,255,0.14)]">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-green to-cyan"
                style={{ scaleX: barScaleX }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
