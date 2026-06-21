import React, { useEffect, useRef } from 'react';

// =====================================================================
// OBSERVATORY DRIFT — particules discrètes « observatoire », pas feu d'artifice.
// Canvas 2D léger, très basse densité, dérive lente, points teal/lavande.
// Pause hors-vue (IntersectionObserver) + onglet caché (visibilitychange).
// reduced-motion → désactivé (aucune boucle, aucun canvas peint).
// transform/opacity/canvas only — coût compositing négligeable.
// =====================================================================

type Props = {
  className?: string;
  /** densité ramenée à ~1 pt / DENSITY px² de viewport (haut = moins de points) */
  density?: number;
  /** plafond dur de particules (perf) */
  max?: number;
};

const TEAL = 'rgba(0, 130, 124, ';      // #00827c — accent rationné
const LAV = 'rgba(253, 233, 255, ';     // #fde9ff — lavande très rare
const HI = 'rgba(237, 255, 254, ';      // #edfffe — highlight

const ObservatoryDrift: React.FC<Props> = ({ className = '', density = 26000, max = 70 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // observatoire silencieux : rien ne tourne

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0;

    type P = { x: number; y: number; r: number; a: number; vx: number; vy: number; tw: number; ph: number; col: string };
    let parts: P[] = [];

    const pick = () => {
      const roll = Math.random();
      // teal majoritaire, highlight discret, lavande ultra-rare
      if (roll > 0.94) return LAV;
      if (roll > 0.66) return HI;
      return TEAL;
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(max, Math.max(8, Math.round((w * h) / density)));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.3,
        a: 0.12 + Math.random() * 0.28,
        vx: (Math.random() - 0.5) * 0.06,   // dérive très lente
        vy: -0.04 - Math.random() * 0.08,   // remontée douce, comme des poussières
        tw: 0.4 + Math.random() * 0.9,      // vitesse de scintillement
        ph: Math.random() * Math.PI * 2,
        col: pick(),
      }));
    };

    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    build();

    let raf = 0;
    let isVisible = true;
    let isPage = !document.hidden;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.016;
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        // wrap doux : les poussières qui sortent réapparaissent en bas
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        else if (p.x > w + 4) p.x = -4;
        const tw = 0.6 + 0.4 * Math.sin(t * p.tw + p.ph);
        ctx.beginPath();
        ctx.fillStyle = p.col + (p.a * tw).toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (isVisible && isPage && raf === 0) raf = requestAnimationFrame(loop); };
    const stop = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(
      ([e]) => { isVisible = e.isIntersecting; isVisible ? start() : stop(); },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVis = () => { isPage = !document.hidden; isPage ? start() : stop(); };
    document.addEventListener('visibilitychange', onVis);

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density, max]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
};

export default ObservatoryDrift;
