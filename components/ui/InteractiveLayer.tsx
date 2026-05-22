import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

// =======================================================
//  INTERACTIVE LAYER — Effets globaux UX/UI
// =======================================================

// 1. Scroll progress bar en haut (vert AXEM)
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#00FA9A] via-[#00FA9A] to-[#00FA9A]/0"
      aria-hidden="true"
    />
  );
};

// 2. Custom magnetic cursor — un point qui suit avec une trail
export const SmartCursor: React.FC = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 30, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 600, damping: 30, mass: 0.3 });
  // Trail (plus lent)
  const tx = useSpring(x, { stiffness: 90, damping: 20 });
  const ty = useSpring(y, { stiffness: 90, damping: 20 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      if (target && (target.closest('a, button, [role="button"], input, textarea, [data-cursor-hover]'))) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [x, y, visible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;
  if (!visible) return null;

  return (
    <>
      {/* Inner dot — vert, ultra-rapide */}
      <motion.div
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale: hovering ? 0 : 1, opacity: hovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-[#00FA9A] shadow-[0_0_12px_#00FA9A]"
        aria-hidden="true"
      />
      {/* Outer ring — vert opacité, plus lent (trail) */}
      <motion.div
        style={{
          x: tx,
          y: ty,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 1 : 0.45 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-9 w-9 rounded-full border border-[#00FA9A]/70 mix-blend-difference"
        aria-hidden="true"
      />
    </>
  );
};

// 3. Reveal-on-scroll wrapper avec stagger automatique
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; y?: number; className?: string }> = ({
  children, delay = 0, y = 24, className,
}) => (
  <motion.div
    initial={{ opacity: 0, y, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
