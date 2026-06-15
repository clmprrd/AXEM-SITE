import React from 'react';
import {
  motion, useScroll, useTransform, useMotionValueEvent,
  useReducedMotion, useMotionValue, useSpring, animate,
} from 'framer-motion';

// =====================================================================
// 🅰️ LA LIGNE — la signature du site.
// UNE ligne lumineuse SVG continue, fixée en overlay plein écran, dont la
// LONGUEUR TRACÉE = la progression du scroll global (useScroll fenêtre).
// · Elle naît du « A » du hero (le path se dessine au load) puis file vers
//   le bas et serpente à travers TOUTE la page sans jamais se rompre.
// · Sa TEINTE suit le récit : bleu lumineux par défaut, ROUGE tendue au
//   « problème », puis retour au BLEU après « la métamorphose ».
// · Une tête lumineuse suit la pointe du tracé.
// · reduced-motion → ligne tracée pleine, statique, pas de tête animée.
//
// Le médium = le message : la continuité prouve « un seul interlocuteur,
// de A à Z, on reste ». La ligne ne se rompt JAMAIS.
// =====================================================================

// Le tracé maître. ViewBox 100 (large) × 1000 (haut) — preserveAspectRatio
// "none" pour étirer en plein écran. Serpentine douce, ancrée vers le centre,
// qui descend en S amples — lisible comme « un seul fil » sur toute la page.
// IMPORTANT : un seul <path> continu, jamais coupé.
const LINE_D =
  'M50 -2 ' +
  'C 50 60, 50 90, 38 120 ' +    // descend du A, glisse vers la gauche (preuve/duo)
  'C 24 156, 24 196, 40 232 ' +  // revient (problème)
  'C 56 268, 70 300, 62 340 ' +  // métamorphose (le wow)
  'C 54 380, 30 408, 34 452 ' +  // parcours 7 étapes
  'C 38 500, 66 520, 60 566 ' +  // résultats
  'C 54 612, 30 632, 38 678 ' +  // formation
  'C 46 720, 64 742, 56 786 ' +  // méthode
  'C 50 824, 50 850, 50 876 ' +  // ROI — recentre pour la boucle
  'C 50 910, 50 950, 50 1002';   // CTA — file vers le Z

// Bornes [start, end] de progression scroll où la ligne vire au ROUGE,
// puis revient au bleu (la « métamorphose »). Réglées sur l'ordre des sections.
const COLOR_STOPS = {
  blueA: '#5b8cff',
  cyan: '#38bdf8',
  redTense: '#ff3b53',
  redDeep: '#b91c3a',
} as const;

export const Ligne: React.FC = () => {
  const reduce = useReducedMotion();
  // progression scroll GLOBALE (fenêtre entière)
  const { scrollYProgress } = useScroll();
  // lissée pour un tracé fluide (spring discret)
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });
  const progress = reduce ? useMotionValue(1) : smooth;

  // pathLength : la portion dessinée du tracé = le scroll. Démarre à ~0.04
  // pour que le « A » du hero soit déjà amorcé au load.
  const drawn = useTransform(progress, (p) => (reduce ? 1 : Math.max(0.035, p)));

  // TEINTE narrative : bleu → (rouge au problème ~0.28–0.40) → bleu/cyan après
  // la métamorphose (~0.46+). Interpolation sur la progression.
  const stroke = useTransform(
    progress,
    [0, 0.24, 0.30, 0.40, 0.48, 0.7, 1],
    [COLOR_STOPS.blueA, COLOR_STOPS.blueA, COLOR_STOPS.redTense, COLOR_STOPS.redDeep, COLOR_STOPS.blueA, COLOR_STOPS.cyan, COLOR_STOPS.cyan],
  );

  // glow de la tête : suit la teinte courante
  const headRef = React.useRef<SVGCircleElement>(null);
  useMotionValueEvent(stroke, 'change', (c) => {
    if (headRef.current) headRef.current.setAttribute('fill', c);
  });

  // position de la tête le long du path (offset-distance via getPointAtLength)
  const pathMeasureRef = React.useRef<SVGPathElement>(null);
  const headX = useMotionValue(50);
  const headY = useMotionValue(-2);
  const [len, setLen] = React.useState(0);
  React.useEffect(() => {
    if (pathMeasureRef.current) setLen(pathMeasureRef.current.getTotalLength());
  }, []);
  useMotionValueEvent(drawn, 'change', (d) => {
    if (!pathMeasureRef.current || !len) return;
    const pt = pathMeasureRef.current.getPointAtLength(Math.min(d, 1) * len);
    headX.set(pt.x);
    headY.set(pt.y);
  });

  // load : tracé du « A » amorcé (drawn part de 0.035) — la ligne « naît » du A.
  // Au scroll, drawn = progress prend le relais.
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
      {/* rail fantôme : tout le tracé, très faible — montre le « chemin » à venir */}
      <path className="ligne-rail" d={LINE_D} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      {/* path de mesure invisible (pour getPointAtLength) */}
      <path ref={pathMeasureRef} d={LINE_D} stroke="none" fill="none" />
      {/* LE TRACÉ — pathLength = scroll, stroke = teinte narrative */}
      <motion.path
        className="ligne-path"
        d={LINE_D}
        strokeWidth="2.4"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: drawn, stroke }}
      />
      {/* la tête lumineuse à la pointe du tracé */}
      {!reduce && (
        <motion.circle
          ref={headRef}
          className="ligne-head"
          r="3.4"
          fill={COLOR_STOPS.blueA}
          style={{ cx: headX, cy: headY }}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------
// Hook utilitaire : un nœud de section s'allume quand le scroll global
// dépasse un seuil. Partagé par toutes les sections jalonnées par la ligne.
// ---------------------------------------------------------------------
export const useLineProgress = () => {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
};

// petit nœud réutilisable, allumé via une prop booléenne
export const LigneNode: React.FC<{ on: boolean; className?: string }> = ({ on, className = '' }) => (
  <span
    aria-hidden
    data-on={on ? 'true' : 'false'}
    className={`ligne-node inline-block h-3.5 w-3.5 rounded-full border border-green/40 bg-ink ${className}`}
  />
);

export { animate };
