import React from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

// =====================================================================
// KpiConstellation — LE « moment waouh » signature, capturable en GIF.
// Séquence auto-contenue de ~4s, déclenchée à l'entrée à l'écran (once),
// REJOUABLE via un bouton « Rejouer ». Les chiffres-résultats se matérialisent
// comme des ÉTOILES qui apparaissent une à une, puis des lignes se TRACENT
// entre elles pour former une constellation. Pensée pour être enregistrée
// (cadre fixe, fond abyssal, ~4s, boucle propre).
//
// PERF : SVG (lignes = pathLength), transform/opacity only, points cappés (6).
// reduced-motion → tout visible d'emblée, aucun tracé.
// =====================================================================

type Node = {
  // position en % du cadre
  x: number;
  y: number;
  val: string;
  label: string;
  big?: boolean;
};

// 6 nœuds = les résultats verrouillés. Positions composées en constellation.
const NODES: Node[] = [
  { x: 20, y: 26, val: '80 %', label: 'saisie économisée · BTP', big: true },
  { x: 50, y: 15, val: '95 k€', label: 'coûts neutralisés / an' },
  { x: 80, y: 30, val: '×4', label: 'plus rapide · judiciaire' },
  { x: 26, y: 72, val: '317 h', label: 'libérées / mois · aéro' },
  { x: 58, y: 78, val: '> 98 %', label: "d'anomalies détectées" },
  { x: 82, y: 66, val: '159 %', label: 'ROI médian', big: true },
];

// arêtes de la constellation (indices dans NODES) — un tracé continu et lisible
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 5], [5, 4], [4, 3], [3, 0], [0, 4], [1, 5],
];

// timings de la séquence (s)
const STAR_BASE = 0.15;
const STAR_STEP = 0.22;
const EDGE_BASE = STAR_BASE + NODES.length * STAR_STEP + 0.15;
const EDGE_STEP = 0.14;

export const KpiConstellation: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // clé de replay : incrémenter remonte les motion.* → la séquence rejoue
  const [runKey, setRunKey] = React.useState(0);
  const playing = reduce ? true : inView || runKey > 0;

  const replay = () => setRunKey((k) => k + 1);

  return (
    <div ref={ref} className="kpi-constellation relative">
      {/* cadre capturable — ratio proche 16:9, fond abyssal net */}
      <div className="constellation-stage relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-3xl">
        {/* halo bioluminescent doux, statique */}
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(34,224,200,0.10), transparent 70%)' }} />

        {/* LIGNES — se tracent après l'apparition des étoiles */}
        <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full" fill="none">
          <defs>
            <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00b3a7" />
              <stop offset="1" stopColor="#22e0c8" />
            </linearGradient>
          </defs>
          {EDGES.map(([a, b], i) => {
            const A = NODES[a], B = NODES[b];
            return (
              <motion.line
                key={`${runKey}-${i}`}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="url(#edgeGrad)" strokeWidth="0.35"
                strokeLinecap="round" vectorEffect="non-scaling-stroke"
                initial={reduce ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                animate={playing
                  ? { pathLength: 1, opacity: 0.55 }
                  : { pathLength: 0, opacity: 0 }}
                transition={reduce ? { duration: 0 } : {
                  pathLength: { duration: 0.5, delay: EDGE_BASE + i * EDGE_STEP, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.3, delay: EDGE_BASE + i * EDGE_STEP },
                }}
              />
            );
          })}
        </svg>

        {/* ÉTOILES-CHIFFRES — apparaissent une à une */}
        {NODES.map((n, i) => (
          <motion.div
            key={`${runKey}-node-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            animate={playing ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
            transition={reduce ? { duration: 0 } : {
              duration: 0.6, delay: STAR_BASE + i * STAR_STEP, ease: [0.16, 1, 0.3, 1],
            }}>
            {/* le point-étoile lumineux */}
            <motion.span aria-hidden
              className="constellation-star mx-auto mb-2 block rounded-full"
              style={{ width: n.big ? 12 : 8, height: n.big ? 12 : 8 }}
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={playing ? { opacity: [0, 1, 0.85], scale: [0.4, 1.5, 1] } : { opacity: 0 }}
              transition={reduce ? { duration: 0 } : {
                duration: 0.9, delay: STAR_BASE + i * STAR_STEP, ease: 'easeOut',
              }}
            />
            <div className={`font-serif-display leading-none text-highlight ${n.big ? 'text-4xl md:text-6xl' : 'text-2xl md:text-4xl'}`}>
              {n.val}
            </div>
            <div className="mt-1.5 text-[10px] font-medium leading-tight text-cream-soft md:text-[12px]">
              {n.label}
            </div>
          </motion.div>
        ))}

        {/* signature discrète dans le cadre (pour le GIF LinkedIn) */}
        <div aria-hidden className="absolute bottom-4 left-5 flex items-center gap-2 text-[11px] text-cream-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(103,232,223,0.9)]" />
          AXEM IA — résultats documentés
        </div>
      </div>

      {/* bouton rejouer — hors cadre, ne pollue pas la capture */}
      {!reduce && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={replay}
            data-cursor
            className="group inline-flex items-center gap-2 rounded-full border border-green/25 px-4 py-2 text-[13px] font-medium text-cream-soft transition-colors hover:border-green/50 hover:text-cream [touch-action:manipulation]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden
              className="transition-transform duration-500 group-hover:rotate-[-180deg]">
              <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Rejouer la séquence
          </button>
        </div>
      )}
    </div>
  );
};
