import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

// =====================================================================
// CURSEUR MAGNÉTIQUE GLOBAL (V4 kinétique).
// - Un point net qui suit le curseur + une traînée (anneau) en ressort.
// - Grossit au survol des éléments interactifs (a, button, [data-magnetic]).
// - Magnétisme léger : l'anneau est aimanté vers le centre des CTA magnétiques.
// - Désactivé au tactile (@media hover:hover, testé en JS) + prefers-reduced-motion.
// - N'anime QUE transform (x/y/scale) → pas de reflow, pas de setState par frame.
// =====================================================================
const MagneticCursor: React.FC = () => {
  const reduce = useReducedMotion();

  // Pointeur fin only (souris) — on ne monte rien sur tactile.
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [reduce]);

  // Position brute (point) + position ressort (anneau/traînée).
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  // Scale de l'anneau au survol (ressort).
  const scale = useSpring(1, { stiffness: 420, damping: 30 });
  const dotScale = useSpring(1, { stiffness: 500, damping: 34 });

  React.useEffect(() => {
    if (!enabled) return;

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [data-magnetic], [data-cursor="grow"]';

    const onMove = (e: PointerEvent) => {
      // magnétisme : si on est sur un CTA magnétique, on aimante l'anneau vers son centre.
      const magnet = (e.target as Element | null)?.closest?.('[data-magnetic]') as HTMLElement | null;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // 35 % vers le centre : traînée « collée » au bouton sans figer le point.
        x.set(e.clientX + (cx - e.clientX) * 0.35);
        y.set(e.clientY + (cy - e.clientY) * 0.35);
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
      }
    };

    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (hit) {
        scale.set(2.4);
        dotScale.set(0.4);
      }
    };
    const onOut = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (hit) {
        scale.set(1);
        dotScale.set(1);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
    };
  }, [enabled, x, y, scale, dotScale]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Anneau / traînée */}
      <motion.div
        style={{ x: ringX, y: ringY, scale }}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-cyan/70 mix-blend-difference"
      />
      {/* Point net */}
      <motion.div
        style={{ x, y, scale: dotScale }}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-cyan mix-blend-difference"
      />
    </div>
  );
};

export default MagneticCursor;
