import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { startCursorSignal, cursor } from './cursorSignal';

// =====================================================================
// CursorField — curseur magnétique GLOBAL.
// • point suiveur net (instantané) + anneau-traînée (spring, retard doux)
// • grossit sur les éléments interactifs (a, button, [data-cursor])
// • magnétisme sur les CTA (data-magnetic) : l'anneau se colle au centre
// • désactivé en tactile (@media hover:none) + prefers-reduced-motion
// Alimente aussi cursorSignal (vélocité) que le hero WebGL lit chaque frame.
// Rendu hors-flux : useMotionValue/useSpring, aucun setState par frame.
// =====================================================================

export const CursorField: React.FC = () => {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);

  // point net = position brute ; anneau = spring (traînée)
  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  const rx = useSpring(px, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(py, { stiffness: 380, damping: 32, mass: 0.6 });
  const scale = useMotionValue(1);
  const ringScale = useSpring(scale, { stiffness: 260, damping: 22 });

  React.useEffect(() => {
    if (reduce) return;
    // tactile / pas de vrai pointeur → on ne monte rien
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);
    const stop = startCursorSignal();

    let magnetEl: HTMLElement | null = null;
    let magnetRect: DOMRect | null = null;

    const move = (e: PointerEvent) => {
      if (magnetEl && magnetRect) {
        // magnétisme : l'anneau est attiré vers le centre du CTA
        const cx = magnetRect.left + magnetRect.width / 2;
        const cy = magnetRect.top + magnetRect.height / 2;
        px.set(cx + (e.clientX - cx) * 0.35);
        py.set(cy + (e.clientY - cy) * 0.35);
      } else {
        px.set(e.clientX);
        py.set(e.clientY);
      }
    };

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.(
        'a, button, [data-cursor], input, textarea, select, [role="button"]',
      ) as HTMLElement | null;
      if (t) {
        const mag = t.closest('[data-magnetic]') as HTMLElement | null;
        if (mag) {
          magnetEl = mag;
          magnetRect = mag.getBoundingClientRect();
          scale.set(2.4);
        } else {
          magnetEl = null;
          magnetRect = null;
          scale.set(1.9);
        }
      } else {
        magnetEl = null;
        magnetRect = null;
        scale.set(1);
      }
    };

    const down = () => scale.set((scale.get() || 1) * 0.8);
    const up = () => over(new PointerEvent('pointerover'));

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });

    return () => {
      stop();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="cursor-field pointer-events-none fixed inset-0 z-[9999]">
      {/* anneau-traînée */}
      <motion.div
        className="cursor-ring"
        style={{ x: rx, y: ry, scale: ringScale }}
      />
      {/* point net */}
      <motion.div className="cursor-dot" style={{ x: px, y: py }} />
    </div>
  );
};
