import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { CountUp } from '../ui/motion';

// =====================================================================
// 4. LA MÉTAMORPHOSE (LE WOW) ⭐ — section PINNÉE.
// À gauche : un tableur/document chaotique. En scrollant, il se DÉSASSEMBLE
// et se RECOMPOSE en workflow n8n propre (scrub lié au scroll), pendant que
// « 95 000 € / an » et « 80 % » montent en count-up et que la ligne passe du
// rouge au bleu lumineux (géré globalement par <Ligne>).
// Réversible en remontant. reduced-motion → simple fondu avant/après.
// Mobile : pas de pin agressif, on dégrade en fondu empilé.
// =====================================================================

// fausses cellules du tableur chaotique (avant)
const CELLS = Array.from({ length: 30 }, (_, i) => ({
  v: ['REF-0' + (i + 12), '4 820', '—', 'ERR', '12,4', 'n/a', '88,0', 'TODO', '#REF!', '0,00'][i % 10],
  bad: i % 7 === 0 || i % 5 === 0,
}));

// nœuds du workflow n8n propre (après) — positions en % dans la scène
const FLOW = [
  { x: 8, y: 42, label: 'Webhook', tone: 'cyan' },
  { x: 34, y: 20, label: 'Extraction', tone: 'blue' },
  { x: 34, y: 64, label: 'Validation IA', tone: 'blue' },
  { x: 62, y: 42, label: 'Fusion', tone: 'blue' },
  { x: 88, y: 42, label: 'CRM', tone: 'green' },
];
const WIRES = [
  'M8 42 C 20 42, 22 20, 34 20',
  'M8 42 C 20 42, 22 64, 34 64',
  'M34 20 C 48 20, 50 42, 62 42',
  'M34 64 C 48 64, 50 42, 62 42',
  'M62 42 C 74 42, 76 42, 88 42',
];

export const Metamorphose: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // scroll de la section pinnée : 0 (avant) → 1 (après recomposé)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  // morph 0→1 (réversible). reduced → fondu simple sur visibilité.
  const morph = reduce ? 1 : scrollYProgress;

  const [m, setM] = React.useState(reduce ? 1 : 0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (!reduce) setM(v); });

  // mappings d'opacité : chaos s'efface, workflow se compose
  const chaosOpacity = useTransform(morph, [0, 0.45], [1, 0]);
  const flowOpacity = useTransform(morph, [0.35, 0.7], [0, 1]);
  const sceneScale = useTransform(morph, [0, 1], [reduce ? 1 : 0.98, 1]);

  // count-up piloté par le scrub (pas de useInView : suit le morph)
  const eurosVal = Math.round(95000 * Math.min(1, Math.max(0, (m - 0.2) / 0.6)));
  const pctVal = Math.round(80 * Math.min(1, Math.max(0, (m - 0.2) / 0.6)));

  return (
    <section
      id="metamorphose"
      ref={ref}
      className="section-clip relative bg-ink"
      style={{ height: reduce ? 'auto' : '300vh' }}>
      {/* sticky stage — pinné le temps du scrub */}
      <div
        className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden px-5 py-20 md:px-8"
        style={reduce ? { position: 'static' } : undefined}>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* SCÈNE morph : tableur chaos → workflow n8n */}
          <motion.div
            className="morph-stage relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-green/15 bg-ink-2/50"
            style={{ scale: sceneScale }}>
            {/* AVANT — grille de cellules désaturées, lourdes */}
            <motion.div
              aria-hidden
              style={{ opacity: reduce ? undefined : chaosOpacity }}
              className={`absolute inset-0 grid grid-cols-6 grid-rows-5 gap-px p-3 ${reduce ? 'opacity-0' : ''}`}>
              {CELLS.map((c, i) => (
                <motion.div
                  key={i}
                  className="sheet-cell flex items-center justify-center rounded-[3px] text-[10px] md:text-[12px]"
                  animate={reduce ? undefined : {
                    x: m > 0.2 ? (i % 2 ? 1 : -1) * (m - 0.2) * 60 : 0,
                    y: m > 0.2 ? (i % 3 - 1) * (m - 0.2) * 40 : 0,
                    rotate: m > 0.2 ? (i % 2 ? 1 : -1) * (m - 0.2) * 8 : 0,
                  }}
                  transition={{ type: 'tween', duration: 0.1, ease: 'linear' }}>
                  <span className={c.bad ? 'text-[#ff6b7d]' : ''}>{c.v}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* APRÈS — workflow n8n propre qui se compose */}
            <motion.div
              aria-hidden
              style={{ opacity: reduce ? undefined : flowOpacity }}
              className={`absolute inset-0 ${reduce ? 'opacity-100' : ''}`}>
              <svg viewBox="0 0 96 84" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full p-4">
                <defs>
                  <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#5b8cff" />
                    <stop offset="1" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                {WIRES.map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    className="flow-wire"
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={reduce ? { pathLength: 1 } : { pathLength: Math.min(1, Math.max(0, (m - 0.4) / 0.3)) }}
                    transition={{ duration: 0.05 }}
                  />
                ))}
              </svg>
              {FLOW.map((n, i) => (
                <motion.div
                  key={n.label}
                  className="flow-node absolute -translate-x-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-[11px] font-semibold text-cream md:text-[13px]"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  initial={false}
                  animate={reduce ? { opacity: 1, scale: 1 } : {
                    opacity: Math.min(1, Math.max(0, (m - (0.4 + i * 0.05)) / 0.15)),
                    scale: 0.8 + 0.2 * Math.min(1, Math.max(0, (m - (0.4 + i * 0.05)) / 0.15)),
                  }}
                  transition={{ duration: 0.05 }}>
                  <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${n.tone === 'cyan' ? 'bg-cyan' : n.tone === 'green' ? 'bg-green' : 'bg-green-deep'}`} />
                  {n.label}
                </motion.div>
              ))}
            </motion.div>

            {/* étiquette d'état avant/après */}
            <div className="absolute left-4 top-4 z-10 rounded-full border border-green/20 bg-ink/70 px-3 py-1 text-[10px] font-satoshi font-bold uppercase tracking-[0.14em] text-cream-soft backdrop-blur">
              {m < 0.5 ? 'Avant · saisie manuelle' : 'Après · workflow n8n'}
            </div>
          </motion.div>

          {/* COPY + count-up pilotés par le scrub */}
          <div>
            <div className="eyebrow mb-5 flex items-center gap-2.5 text-[11px] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />La métamorphose
            </div>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.5vw, 72px)' }}>
              Le chaos devient<br /><span className="aurora-text italic">un flux qui tourne seul.</span>
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-cream-soft">
              On part de vos fichiers, vos ressaisies, vos heures perdues. On en sort
              un workflow propre, en production, qui travaille pendant que vous dormez.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div>
                <div className="tnum font-serif-display leading-[0.85] text-cream" style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>
                  {reduce ? <CountUp to={95000} suffix=" €" /> : `${eurosVal.toLocaleString('fr-FR')} €`}
                </div>
                <div className="mt-2 text-[13px] font-medium leading-snug text-cream-soft">économisés par an</div>
              </div>
              <div>
                <div className="tnum font-serif-display leading-[0.85] text-cream" style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>
                  {reduce ? <CountUp to={80} suffix=" %" /> : `${pctVal} %`}
                </div>
                <div className="mt-2 text-[13px] font-medium leading-snug text-cream-soft">du temps de saisie en moins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
