import React from 'react';
import { motion, useReducedMotion, useInView, animate } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------
// RiseWords — reveal mot-à-mot (mask + y). Au mount ou au scroll (once).
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
  const init = reduce ? anim : { y: '110%', opacity: 0 };
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => {
        const last = i === words.length - 1;
        const t = { duration: 0.7, delay: delay + i * stagger, ease: EASE };
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.06em]" aria-hidden>
            <motion.span
              className="inline-block will-change-transform"
              initial={init}
              {...(onScroll
                ? { whileInView: anim, viewport: { once: true, margin: '-12% 0px' } }
                : { animate: anim })}
              transition={t}>
              {w}{!last ? ' ' : ''}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

// ---------------------------------------------------------------------
// Reveal — bloc opacity + y, scroll once. Visible par défaut (reduced motion).
// ---------------------------------------------------------------------
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'span';
}> = ({ children, delay = 0, y = 24, className, as = 'div' }) => {
  const reduce = useReducedMotion();
  const C: any = as === 'li' ? motion.li : as === 'span' ? motion.span : motion.div;
  return (
    <C
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
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
}> = ({ to, from = 0, duration = 1.6, decimals = 0, prefix = '', suffix = '', separator = ' ', className }) => {
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
