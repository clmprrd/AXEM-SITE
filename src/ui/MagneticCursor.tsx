import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

// =====================================================================
// CURSEUR MAGNÉTIQUE GLOBAL — « Constellation Synthèse ».
// Un petit point-étoile teal suit le pointeur avec une traînée à ressort
// (useMotionValue + useSpring, hors cycle de rendu React → zéro re-render).
// • Un anneau plus large suit avec plus d'inertie (le « halo » de la comète).
// • Grossit et s'éclaircit au survol des éléments interactifs
//   (a, button, [data-cursor], .btn, [role=button], input, etc.).
// • DÉSACTIVÉ sur tactile (@media hover:hover) et si prefers-reduced-motion.
// • pointer-events:none, aria-hidden — purement décoratif, jamais bloquant.
//
// PERF : deux springs pilotent des transforms GPU. Le hover est détecté par
// un seul listener délégué sur document (pointerover/out), pas par écoute
// par-élément. Aucune allocation par frame.
// =====================================================================

export const MagneticCursor: React.FC = () => {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const [down, setDown] = React.useState(false);

  // position brute du pointeur
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  // le point : ressort vif (colle au curseur)
  const dotX = useSpring(mx, { stiffness: 900, damping: 40, mass: 0.4 });
  const dotY = useSpring(my, { stiffness: 900, damping: 40, mass: 0.4 });
  // l'anneau : ressort plus mou (traînée de comète)
  const ringX = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.7 });
  const ringY = useSpring(my, { stiffness: 220, damping: 26, mass: 0.7 });

  React.useEffect(() => {
    if (reduce) return;
    // uniquement pointeur fin + survol réel (desktop). Pas de curseur custom au doigt.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;
    setEnabled(true);

    const INTERACTIVE =
      'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor], .btn, .step-card, .case-card, .kpi-star, .logo-chip';

    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.(INTERACTIVE)) setHovering(true);
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const related = (e.relatedTarget as HTMLElement | null) ?? null;
      // on ne quitte l'état hover que si on sort réellement d'une zone interactive
      if (t?.closest?.(INTERACTIVE) && !related?.closest?.(INTERACTIVE)) setHovering(false);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeaveWindow = () => { mx.set(-100); my.set(-100); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeaveWindow);

    // masque le curseur système sur desktop uniquement (le custom prend le relais)
    document.documentElement.classList.add('has-magnetic-cursor');

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeaveWindow);
      document.documentElement.classList.remove('has-magnetic-cursor');
    };
  }, [reduce, mx, my]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="magnetic-cursor-root pointer-events-none fixed inset-0 z-[9999]">
      {/* anneau — traînée de comète, s'ouvre au survol */}
      <motion.div
        className="magnetic-ring absolute left-0 top-0 rounded-full"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          opacity: hovering ? 1 : 0.55,
          borderColor: hovering ? 'rgba(203,255,252,0.9)' : 'rgba(63,216,207,0.55)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
      {/* point central — étoile de la constellation */}
      <motion.div
        className="magnetic-dot absolute left-0 top-0 rounded-full"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: down ? 0.6 : hovering ? 0.4 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
    </div>
  );
};

export default MagneticCursor;
