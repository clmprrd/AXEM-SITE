import React, { useRef } from 'react';
import {
  motion, useScroll, useSpring, useTransform, useReducedMotion, useMotionValueEvent,
} from 'framer-motion';
import { CountUp } from '../ui/motion';

// =====================================================================
// 4. LA MÉTAMORPHOSE (LE WOW) ⭐ — section PINNÉE (refonte perf).
// À gauche : un tableur chaotique se DÉSASSEMBLE et se RECOMPOSE en workflow
// n8n propre (scrub lié au scroll), pendant que « 95 000 € » et « 80 % » montent.
//
// PERF — ce qui tue l'ancien lag :
// • plus AUCUN setState au scroll. L'ancien `setM(v)` re-render­ait 30 cellules
//   + 5 nœuds À CHAQUE FRAME (réconciliation React massive). Désormais tout est
//   piloté par des motion values (transform/opacity composités) ;
// • scroll-progress SPRING-lissé → scrub fluide, pas de jitter ;
// • chaque cellule reçoit ses propres useTransform (x/y/rotate) — GPU only ;
// • les compteurs s'écrivent dans le DOM via useMotionValueEvent (textContent),
//   sans déclencher de rendu React.
// Mobile : pas de pin agressif, fondu empilé. reduced-motion → fondu simple.
// =====================================================================

// fausses cellules du tableur chaotique (avant)
const CELLS = Array.from({ length: 30 }, (_, i) => ({
  v: ['REF-0' + (i + 12), '4 820', '—', 'ERR', '12,4', 'n/a', '88,0', 'TODO', '#REF!', '0,00'][i % 10],
  bad: i % 7 === 0 || i % 5 === 0,
  // signes de dispersion précalculés (pas de calcul par frame)
  dx: (i % 2 ? 1 : -1) * 58,
  dy: (i % 3 - 1) * 38,
  dr: (i % 2 ? 1 : -1) * 7,
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

// clamp01 helper
const c01 = (n: number) => Math.min(1, Math.max(0, n));

// --- une cellule : ses transforms sont des motion values dérivées du morph ---
const Cell: React.FC<{ morph: any; c: typeof CELLS[number]; reduce: boolean }> = ({ morph, c, reduce }) => {
  const x = useTransform(morph, [0.2, 1], [0, c.dx]);
  const y = useTransform(morph, [0.2, 1], [0, c.dy]);
  const rotate = useTransform(morph, [0.2, 1], [0, c.dr]);
  return (
    <motion.div
      className="sheet-cell flex items-center justify-center rounded-[3px] text-[10px] md:text-[12px]"
      style={reduce ? undefined : { x, y, rotate }}>
      <span className={c.bad ? 'text-[#ff6b7d]' : ''}>{c.v}</span>
    </motion.div>
  );
};

// --- un nœud workflow : opacité + scale dérivés du morph ---
const FlowNode: React.FC<{ morph: any; n: typeof FLOW[number]; i: number; reduce: boolean }> = ({ morph, n, i, reduce }) => {
  const start = 0.4 + i * 0.05;
  const opacity = useTransform(morph, [start, start + 0.15], [0, 1]);
  const scale = useTransform(morph, [start, start + 0.15], [0.8, 1]);
  return (
    <motion.div
      className="flow-node absolute -translate-x-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-[11px] font-semibold text-cream md:text-[13px]"
      style={{ left: `${n.x}%`, top: `${n.y}%`, ...(reduce ? {} : { opacity, scale }) }}>
      <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${n.tone === 'cyan' ? 'bg-cyan' : n.tone === 'green' ? 'bg-green' : 'bg-green-deep'}`} />
      {n.label}
    </motion.div>
  );
};

// --- un câble : pathLength dérivé du morph ---
const FlowWire: React.FC<{ morph: any; d: string; reduce: boolean }> = ({ morph, d, reduce }) => {
  const pathLength = useTransform(morph, [0.4, 0.7], [0, 1]);
  return (
    <motion.path
      d={d}
      className="flow-wire"
      vectorEffect="non-scaling-stroke"
      style={reduce ? { pathLength: 1 } : { pathLength }}
    />
  );
};

export const Metamorphose: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // scroll de la section pinnée : 0 (avant) → 1 (après recomposé)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  // SPRING-lissage du scrub → métamorphose fluide, sans à-coups.
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.5 });
  const morph = reduce ? scrollYProgress : smooth;

  // opacités de scène — composées, pas de state
  const chaosOpacity = useTransform(morph, [0, 0.45], [1, 0]);
  const flowOpacity = useTransform(morph, [0.35, 0.7], [0, 1]);
  const sceneScale = useTransform(morph, [0, 1], [reduce ? 1 : 0.98, 1]);

  // libellé avant/après — seul élément qui mérite un (rare) état booléen
  const [after, setAfter] = React.useState(reduce);
  useMotionValueEvent(morph, 'change', (v) => {
    const next = v >= 0.5;
    setAfter((prev) => (prev === next ? prev : next)); // setState seulement au franchissement
  });

  // compteurs : écrits dans le DOM via refs (zéro re-render React).
  const eurosRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(morph, 'change', (v) => {
    if (reduce) return;
    const k = c01((v - 0.2) / 0.6);
    if (eurosRef.current) eurosRef.current.textContent = `${Math.round(95000 * k).toLocaleString('fr-FR')} €`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(80 * k)} %`;
  });

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
          {/* SCÈNE morph : tableur chaos → workflow n8n — filet gunmetal, zéro carte. */}
          <motion.div
            className="morph-stage relative aspect-[4/3] w-full overflow-hidden border border-gunmetal/25"
            style={{ scale: sceneScale }}>
            {/* AVANT — grille de cellules désaturées, lourdes */}
            <motion.div
              aria-hidden
              style={{ opacity: reduce ? 0 : chaosOpacity }}
              className="absolute inset-0 grid grid-cols-6 grid-rows-5 gap-px p-3">
              {CELLS.map((c, i) => (
                <Cell key={i} morph={morph} c={c} reduce={!!reduce} />
              ))}
            </motion.div>

            {/* APRÈS — workflow n8n propre qui se compose */}
            <motion.div
              aria-hidden
              style={{ opacity: reduce ? 1 : flowOpacity }}
              className="absolute inset-0">
              <svg viewBox="0 0 96 84" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full p-4">
                <defs>
                  <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#0cc481" />
                    <stop offset="1" stopColor="#3fe0a8" />
                  </linearGradient>
                </defs>
                {WIRES.map((d, i) => (
                  <FlowWire key={i} morph={morph} d={d} reduce={!!reduce} />
                ))}
              </svg>
              {FLOW.map((n, i) => (
                <FlowNode key={n.label} morph={morph} n={n} i={i} reduce={!!reduce} />
              ))}
            </motion.div>

            {/* étiquette d'état avant/après */}
            <div className="eyebrow absolute left-4 top-4 z-10 border border-gunmetal/30 px-3 py-1.5">
              {after ? 'Après · workflow n8n' : 'Avant · saisie manuelle'}
            </div>
          </motion.div>

          {/* COPY + compteurs pilotés par le scrub */}
          <div>
            <div className="eyebrow mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-gunmetal/60" />La métamorphose
            </div>
            <h2 className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(40px, 7vw, 96px)' }}>
              Le chaos devient<br /><span className="emph">un flux qui tourne seul.</span>
            </h2>
            <p className="mt-7 max-w-md text-[17px] leading-relaxed text-offwhite/70">
              On part de vos fichiers, vos ressaisies, vos heures perdues. On en sort
              un workflow propre, en production, qui travaille pendant que vous dormez.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-8">
              <div>
                <div className="tnum font-serif-display leading-[0.82] text-offwhite" style={{ fontSize: 'clamp(44px, 8vw, 104px)' }}>
                  {reduce ? <CountUp to={95000} suffix=" €" /> : <span ref={eurosRef}>0 €</span>}
                </div>
                <div className="mt-3 text-[14px] leading-snug text-offwhite/65">économisés par an</div>
              </div>
              <div>
                <div className="tnum font-serif-display leading-[0.82] text-offwhite" style={{ fontSize: 'clamp(44px, 8vw, 104px)' }}>
                  {reduce ? <CountUp to={80} suffix=" %" /> : <span ref={pctRef}>0 %</span>}
                </div>
                <div className="mt-3 text-[14px] leading-snug text-offwhite/65">du temps de saisie en moins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
