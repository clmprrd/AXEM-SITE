import React from 'react';
import { motion, useReducedMotion, useInView, animate, MotionProps } from 'framer-motion';

// =====================================================================
// DNA D'ANIMATION RÉPLIQUÉE DU TEMPLATE FRAMER « LIMITLESS »
// Une seule courbe pour TOUTES les entrées : spring 320/60/1.
// Toutes les révélations : opacity 0.001→1 + y 40→0. Watermark : y -150→0.
// Cascade hero stagger 0.2s. reduced-motion → opacity only (pas de y/spring).
// =====================================================================

// Spring unique — toutes les entrées du site s'y calent.
export const SPRING = { type: 'spring', stiffness: 320, damping: 60, mass: 1 } as const;

// Conservé pour les easings CSS résiduels (transitions hover, etc.).
export const EASE = [0.16, 1, 0.3, 1] as const;

// Helper « reveal » — la signature exacte de Limitless. À spread sur un motion.*.
// delay : décale l'entrée (cascade). reduce : apparition directe opacity-only.
export const reveal = (delay = 0, reduce = false): MotionProps =>
  reduce
    ? {
        initial: { opacity: 0.001 },
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.3, delay },
      }
    : {
        initial: { opacity: 0.001, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { ...SPRING, delay },
      };

// Variante « au mount » (cascade hero) — joue immédiatement, pas au scroll.
export const revealMount = (delay = 0, reduce = false): MotionProps =>
  reduce
    ? { initial: { opacity: 0.001 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
    : {
        initial: { opacity: 0.001, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { ...SPRING, delay },
      };

// Variante watermark — descend depuis le haut (y -150 → 0).
export const revealWatermark = (delay = 0, reduce = false): MotionProps =>
  reduce
    ? { initial: { opacity: 0.001 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
    : {
        initial: { opacity: 0.001, y: -150 },
        animate: { opacity: 1, y: 0 },
        transition: { ...SPRING, delay },
      };

// ---------------------------------------------------------------------
// RiseWords — reveal mot-à-mot calé sur le SPRING (mask + y).
// Au mount (cascade hero) ou au scroll (once). reduced-motion → opacity only.
// ---------------------------------------------------------------------
export const RiseWords: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  onScroll?: boolean;
}> = ({ text, className = '', delay = 0, stagger = 0.07, onScroll = false }) => {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const anim = { y: '0%', opacity: 1 };
  const init = reduce ? { opacity: 0.001 } : { y: '110%', opacity: 0.001 };
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => {
        const last = i === words.length - 1;
        const t = reduce
          ? { duration: 0.3, delay: delay + i * stagger }
          : { ...SPRING, delay: delay + i * stagger };
        return (
          // L'espace inter-mots vit HORS du wrapper overflow-hidden (sinon il est
          // rogné par le masque inline-block → mots collés). Fragment + ' '.
          <React.Fragment key={i}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em]" aria-hidden>
              <motion.span
                className="inline-block will-change-transform"
                style={{ transformPerspective: 1200 }}
                initial={init}
                {...(onScroll
                  ? { whileInView: anim, viewport: { once: true, amount: 0.3 } }
                  : { animate: anim })}
                transition={t}>
                {w}
              </motion.span>
            </span>
            {!last ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
};

// ---------------------------------------------------------------------
// Reveal — bloc opacity + y, scroll once, calé sur le SPRING.
// Visible direct en reduced motion (opacity only, pas de y).
// `perspective` ajoute transformPerspective:1200 (titres).
// ---------------------------------------------------------------------
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'span';
  perspective?: boolean;
}> = ({ children, delay = 0, className, as = 'div', perspective = false }) => {
  const reduce = useReducedMotion();
  const C: any = as === 'li' ? motion.li : as === 'span' ? motion.span : motion.div;
  return (
    <C
      {...reveal(delay, !!reduce)}
      style={perspective ? { transformPerspective: 1200 } : undefined}
      className={className}>
      {children}
    </C>
  );
};

// ---------------------------------------------------------------------
// CountUp — incrémente une valeur numérique quand visible (once).
// Préserve prefix/suffix/décimales. Respecte reduced motion (valeur finale directe).
// ---------------------------------------------------------------------
export const CountUp: React.FC<{
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}> = ({ to, from = 0, duration = 1.6, decimals = 0, prefix = '', suffix = '', separator = ' ', className }) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [val, setVal] = React.useState(reduce ? to : from);

  const format = React.useCallback(
    (n: number) => {
      const fixed = n.toFixed(decimals);
      const [int, dec] = fixed.split('.');
      const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return `${prefix}${grouped}${dec ? ',' + dec : ''}${suffix}`;
    },
    [decimals, prefix, suffix, separator],
  );

  React.useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    const controls = animate(from, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration]);

  return (
    <span ref={ref} className={`tnum ${className ?? ''}`}>
      {format(val)}
    </span>
  );
};
