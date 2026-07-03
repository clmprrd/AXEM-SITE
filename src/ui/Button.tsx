import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

// =====================================================================
// BOUTONS ÉDITORIAUX — anti « vibe-codé »
// Primaire : bleu profond plein, fill-sweep discret + flèche qui glisse.
// Secondaire : ghost glass, bordure qui s'éclaircit + soulignement révélé.
// Pas de dégradé néon, pas d'outer-glow. Voir .btn-* dans index.css.
// =====================================================================

type Common = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  arrow?: boolean;
  external?: boolean;
  ariaLabel?: string;
};

const sizeCls = (s?: Common['size']) => (s === 'lg' ? 'btn-lg' : s === 'sm' ? 'btn-sm' : '');

const Inner: React.FC<{ children: React.ReactNode; arrow?: boolean; sweep?: boolean; underline?: boolean }> = ({
  children, arrow, sweep, underline,
}) => (
  <>
    {sweep && <span className="btn-sweep" aria-hidden />}
    {underline ? <span className="btn-underline">{children}</span> : <span className="relative">{children}</span>}
    {arrow && (
      <span className="btn-arrow relative" aria-hidden>
        →
      </span>
    )}
  </>
);

const baseProps = (href?: string, external?: boolean) =>
  href
    ? { href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : {};

export const PrimaryButton: React.FC<Common> = ({
  children, href, onClick, className = '', size, arrow = true, external, ariaLabel,
}) => {
  const Tag: any = href ? 'a' : 'button';
  return (
    <Tag
      {...baseProps(href, external)}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`btn btn-primary ${sizeCls(size)} ${className}`}>
      <Inner arrow={arrow} sweep>{children}</Inner>
    </Tag>
  );
};

export const SecondaryButton: React.FC<Common> = ({
  children, href, onClick, className = '', size, arrow = false, external, ariaLabel,
}) => {
  const Tag: any = href ? 'a' : 'button';
  return (
    <Tag
      {...baseProps(href, external)}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`btn btn-secondary ${sizeCls(size)} ${className}`}>
      <Inner arrow={arrow} underline>{children}</Inner>
    </Tag>
  );
};

// CTA principal MAGNÉTIQUE — translation subtile vers le curseur (<0.25 du delta).
// useMotionValue/useSpring hors cycle de rendu React (perf). Désactivé reduced motion + tactile.
export const MagneticPrimary: React.FC<Common & { strength?: number }> = ({
  children, href, onClick, className = '', size = 'lg', arrow = true, external, ariaLabel, strength = 0.22,
}) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 16, mass: 0.4 });
  const y = useSpring(my, { stiffness: 180, damping: 16, mass: 0.4 });
  const tx = useTransform(x, (v) => `${v}px`);
  const ty = useTransform(y, (v) => `${v}px`);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { mx.set(0); my.set(0); };

  const Tag: any = href ? motion.a : motion.button;
  return (
    <Tag
      ref={ref}
      {...baseProps(href, external)}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      aria-label={ariaLabel}
      data-magnetic
      style={reduce ? undefined : { x: tx, y: ty }}
      className={`btn btn-primary ${sizeCls(size)} ${className}`}>
      <Inner arrow={arrow} sweep>{children}</Inner>
    </Tag>
  );
};
