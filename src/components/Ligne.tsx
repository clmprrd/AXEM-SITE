import React from 'react';
import {
  motion, useScroll, useSpring, useTransform,
  useReducedMotion, useMotionValue, animate,
} from 'framer-motion';

// =====================================================================
// 🅰️ LA LIGNE — la signature du site (refonte perf + goût).
// UNE ligne lumineuse SVG continue, fixée en overlay plein écran, dont la
// LONGUEUR TRACÉE = la progression du scroll global (spring-lissée).
// · Elle naît du « A » du hero puis serpente à travers TOUTE la page sans
//   jamais se rompre.
// · Sa TEINTE suit le récit : bleu lumineux → rouge tendu au « problème » →
//   retour au bleu/cyan après la métamorphose.
// · Une tête lumineuse suit la pointe du tracé.
//
// PERF — ce qui tue l'ancien lag :
// • pathLength piloté par UN spring (stiffness 120 / damping 30) → tracé fluide ;
// • la position de la tête NE recalcule PLUS la géométrie SVG par frame
//   (getPointAtLength() était le goulot). On échantillonne le path UNE fois
//   au montage dans une table {x,y}, puis on interpole par simple arithmétique
//   (lookup + lerp) — écrit sur des motion values que Framer composite ;
// • aucun re-render React au scroll (que des motion values, pas de setState) ;
// • will-change + non-scaling-stroke, transform/opacity only.
// =====================================================================

// Le tracé maître. ViewBox 100 (large) × 1000 (haut), preserveAspectRatio
// "none" pour étirer en plein écran. Un seul <path> continu, jamais coupé.
// Serpentine affinée : amplitudes retenues → trait élégant, pas « gribouillé ».
const LINE_D =
  'M50 -2 ' +
  'C 50 64, 50 96, 42 128 ' +    // descend du A, glisse doucement (preuve/duo)
  'C 32 164, 34 200, 46 236 ' +  // revient vers le centre (problème)
  'C 58 272, 64 304, 58 342 ' +  // métamorphose (le wow)
  'C 52 382, 38 408, 42 450 ' +  // parcours
  'C 46 496, 62 518, 58 562 ' +  // résultats
  'C 54 606, 40 628, 46 672 ' +  // formation
  'C 52 714, 62 738, 56 782 ' +  // méthode
  'C 51 822, 50 850, 50 878 ' +  // ROI — recentre
  'C 50 912, 50 952, 50 1002';   // CTA — file vers le Z

const COLOR_STOPS = {
  blueA: '#5b8cff',
  cyan: '#38bdf8',
  redTense: '#ff3b53',
  redDeep: '#b91c3a',
} as const;

// Nombre d'échantillons de la table de positions. 240 points = sous-pixel sur
// 1000 unités de haut, mémoire négligeable, lerp instantané.
const SAMPLES = 240;

export const Ligne: React.FC = () => {
  const reduce = useReducedMotion();

  // progression scroll GLOBALE (fenêtre entière).
  const { scrollYProgress } = useScroll();
  // SPRING amorti — le cœur du lissage : fini le jitter de la ligne.
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });
  // reduced-motion : valeur figée à 1 (ligne pleine, statique).
  const staticOne = useMotionValue(1);
  const progress = reduce ? staticOne : smooth;

  // pathLength : portion dessinée = scroll, amorcée à 0.04 (le « A » au load).
  const drawn = useTransform(progress, (p) => (reduce ? 1 : Math.max(0.04, p)));

  // TEINTE narrative : bleu → rouge (problème) → bleu/cyan (après métamorphose).
  const stroke = useTransform(
    progress,
    [0, 0.24, 0.30, 0.40, 0.48, 0.7, 1],
    [COLOR_STOPS.blueA, COLOR_STOPS.blueA, COLOR_STOPS.redTense, COLOR_STOPS.redDeep, COLOR_STOPS.blueA, COLOR_STOPS.cyan, COLOR_STOPS.cyan],
  );

  // --- TABLE de positions échantillonnée UNE fois (pas de géométrie/frame) ---
  const measureRef = React.useRef<SVGPathElement>(null);
  const lutRef = React.useRef<{ x: Float32Array; y: Float32Array } | null>(null);
  React.useEffect(() => {
    if (reduce || !measureRef.current) return;
    const path = measureRef.current;
    const total = path.getTotalLength();
    const xs = new Float32Array(SAMPLES + 1);
    const ys = new Float32Array(SAMPLES + 1);
    for (let i = 0; i <= SAMPLES; i++) {
      const pt = path.getPointAtLength((i / SAMPLES) * total);
      xs[i] = pt.x;
      ys[i] = pt.y;
    }
    lutRef.current = { x: xs, y: ys };
  }, [reduce]);

  // position de la tête : interpolation pure (lookup + lerp) sur la LUT.
  // Aucun appel SVG. Recalculée seulement quand `drawn` change (au scroll lissé).
  const headX = useTransform(drawn, (d) => {
    const lut = lutRef.current;
    if (!lut) return 50;
    const f = Math.min(Math.max(d, 0), 1) * SAMPLES;
    const i = Math.floor(f);
    const t = f - i;
    const j = Math.min(i + 1, SAMPLES);
    return lut.x[i] + (lut.x[j] - lut.x[i]) * t;
  });
  const headY = useTransform(drawn, (d) => {
    const lut = lutRef.current;
    if (!lut) return -2;
    const f = Math.min(Math.max(d, 0), 1) * SAMPLES;
    const i = Math.floor(f);
    const t = f - i;
    const j = Math.min(i + 1, SAMPLES);
    return lut.y[i] + (lut.y[j] - lut.y[i]) * t;
  });

  return (
    <svg
      className="ligne-fixed"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
      fill="none">
      <defs>
        <linearGradient id="ligneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7aa2ff" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      {/* path de mesure invisible — sert UNIQUEMENT à échantillonner la LUT */}
      <path ref={measureRef} d={LINE_D} stroke="none" fill="none" />
      {/* rail fantôme : le chemin à venir, très discret */}
      <path className="ligne-rail" d={LINE_D} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      {/* LE TRACÉ — pathLength = scroll lissé, stroke = teinte narrative */}
      <motion.path
        className="ligne-path"
        d={LINE_D}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: drawn, stroke }}
      />
      {/* la tête lumineuse à la pointe du tracé (cx/cy = motion values) */}
      {!reduce && (
        <motion.circle
          className="ligne-head"
          r="2.6"
          style={{ cx: headX, cy: headY, fill: stroke }}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------
// Hooks utilitaires partagés (inchangés côté API).
// ---------------------------------------------------------------------
export const useLineProgress = () => {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
};

export const LigneNode: React.FC<{ on: boolean; className?: string }> = ({ on, className = '' }) => (
  <span
    aria-hidden
    data-on={on ? 'true' : 'false'}
    className={`ligne-node inline-block h-3.5 w-3.5 rounded-full border border-green/40 bg-ink ${className}`}
  />
);

export { animate };
