import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  useMotionTemplate,
  AnimatePresence,
  HTMLMotionProps,
} from 'framer-motion';

// =======================================================
//  WOW PRIMITIVES — reusable interactive effects
//  Used across all 4 design directions.
// =======================================================

// --- 1. MagneticButton ---------------------------------
// Button that attracts to the cursor when hovered.
// Spring physics for organic feel.
export function MagneticButton({
  children,
  strength = 0.35,
  className,
  ...props
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
} & Omit<HTMLMotionProps<'a'>, 'children'>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.5 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
}

// --- 2. AnimatedCount ----------------------------------
// Counts up from 0 to a target value when scrolled into view.
// Supports k/+ suffixes, integer formatting.
export function AnimatedCount({
  value,
  duration = 1.4,
  suffix = '',
  prefix = '',
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const formatted = display >= 1000 ? `${(display / 1000).toFixed(display < 10000 ? 1 : 0).replace(/\.0$/, '')}k` : String(display);

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

// --- 3. MarqueeLogos -----------------------------------
// Infinite horizontal scroll with edge fade mask.
export function MarqueeLogos({
  logos,
  speed = 28,
  className = '',
  itemClassName = 'text-base font-medium text-neutral-400',
}: {
  logos: string[];
  speed?: number;
  className?: string;
  itemClassName?: string;
}) {
  const duplicated = [...logos, ...logos];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <motion.div
        className="flex w-max gap-12 py-2"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {duplicated.map((logo, i) => (
          <span key={`${logo}-${i}`} className={`shrink-0 whitespace-nowrap ${itemClassName}`}>
            {logo}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// --- 4. SpotlightCard ----------------------------------
// Card with a cursor-tracking radial gradient (the "spotlight").
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(120,180,255,0.18)',
  borderColor = 'rgba(255,255,255,0.08)',
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const [active, setActive] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, ${spotlightColor}, transparent 65%)`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative overflow-hidden ${className}`}
      style={{ borderColor }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background: bg, opacity: active ? 1 : 0 }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// --- 5. TiltCard ---------------------------------------
// 3D-tilt card following the cursor.
export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * maxTilt);
    rx.set(-py * maxTilt);
  };
  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- 6. ScrollRevealWords ------------------------------
// Words light up sequentially as you scroll into view.
// Linear-style scroll-linked reveal.
export function ScrollRevealWords({
  text,
  className = '',
  brightClass = 'text-white',
  dimClass = 'text-white/15',
}: {
  text: string;
  className?: string;
  brightClass?: string;
  dimClass?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.45'],
  });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word
          key={`${w}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          brightClass={brightClass}
          dimClass={dimClass}
        >
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  brightClass,
  dimClass,
}: {
  children: React.ReactNode;
  progress: any;
  range: [number, number];
  brightClass: string;
  dimClass: string;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className={`relative mr-2 inline-block ${dimClass}`}>
      <motion.span style={{ opacity }} className={`absolute inset-0 ${brightClass}`}>
        {children}
      </motion.span>
      {children}
    </span>
  );
}

// --- 7. CustomCursor (blend) ---------------------------
// A blob cursor with mix-blend-difference for inverted color over text.
export function CustomCursor({ size = 28, color = '#FFFFFF' }: { size?: number; color?: string }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 30, mass: 0.4 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX - size / 2);
      y.set(e.clientY - size / 2);
      if (!visible) setVisible(true);
    };
    const handleLeave = () => setVisible(false);
    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [x, y, visible, size]);

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          style={{
            x: sx,
            y: sy,
            width: size,
            height: size,
            background: color,
            mixBlendMode: 'difference',
            position: 'fixed',
            top: 0,
            left: 0,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      )}
    </AnimatePresence>
  );
}

// --- 8. ParallaxY --------------------------------------
// Smooth parallax of any element based on viewport scroll.
export function ParallaxY({
  children,
  range = [-40, 40],
  className = '',
}: {
  children: React.ReactNode;
  range?: [number, number];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], range);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
