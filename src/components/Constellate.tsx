import React from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

// =====================================================================
// CONSTELLATE — reveal « constellation » : à l'entrée dans le viewport, une
// poignée de points (étoiles de données) CONVERGENT depuis des positions
// dispersées vers le centre, puis le contenu s'ALLUME (opacity + léger scale).
// L'effet matérialise un KPI / une carte « depuis les particules » du fond.
//
// PERF : transform/opacity ONLY, points CAPPÉS (8 par défaut), once:true (joue
// une seule fois), reduced-motion → contenu visible direct, pas de points.
// =====================================================================

const seeded = (i: number) => {
  // pseudo-random déterministe par index → positions stables sans Math.random
  const a = Math.sin(i * 12.9898) * 43758.5453;
  return a - Math.floor(a);
};

export const Constellate: React.FC<{
  children: React.ReactNode;
  dots?: number;
  spread?: number; // amplitude de dispersion initiale (px)
  delay?: number;
  className?: string;
}> = ({ children, dots = 8, spread = 120, delay = 0, className = '' }) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35, margin: '-8% 0px' });

  const points = React.useMemo(
    () =>
      Array.from({ length: dots }, (_, i) => {
        const ang = seeded(i) * Math.PI * 2;
        const dist = (0.45 + seeded(i + 99) * 0.55) * spread;
        return {
          // position finale (autour du contenu, en %)
          fx: 8 + seeded(i + 7) * 84,
          fy: 8 + seeded(i + 31) * 84,
          // offset de départ (dispersé)
          ox: Math.cos(ang) * dist,
          oy: Math.sin(ang) * dist,
          d: seeded(i + 3) * 0.18,
          r: 1.5 + seeded(i + 13) * 2,
        };
      }),
    [dots, spread],
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* points qui convergent — derrière le contenu, non interactifs */}
      {!reduce &&
        points.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="constellation-dot"
            style={{ left: `${p.fx}%`, top: `${p.fy}%`, width: p.r * 2, height: p.r * 2 }}
            initial={{ opacity: 0, x: p.ox, y: p.oy, scale: 0.4 }}
            animate={
              inView
                ? { opacity: [0, 0.9, 0], x: 0, y: 0, scale: [0.4, 1, 0.7] }
                : { opacity: 0, x: p.ox, y: p.oy, scale: 0.4 }
            }
            transition={{ duration: 1.1, delay: delay + p.d, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

      {/* le contenu s'allume une fois la convergence amorcée */}
      <motion.div
        className="relative z-[1]"
        initial={reduce ? { opacity: 1 } : { opacity: 0.001, scale: 0.985, filter: 'blur(2px)' }}
        animate={
          reduce
            ? { opacity: 1 }
            : inView
              ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
              : { opacity: 0.001, scale: 0.985, filter: 'blur(2px)' }
        }
        transition={{ duration: 0.7, delay: delay + 0.32, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.div>
    </div>
  );
};
