import React from 'react';

// =====================================================================
// PARTICLE SPHERE — élément-ancre « Auros ».
// Une sphère de particules bioluminescente teal/cyan qui flotte et tourne
// lentement sur elle-même. Centre de gravité visuel du hero ET séparateur
// de sections.
//
// PERF (irréprochable) :
// • canvas 2D pur (pas de Three/WebGL ici) — empreinte minuscule.
// • count CAPPÉ + adapté au DPR ; dpr cappé à 1.5.
// • pause hors-vue (IntersectionObserver) + onglet caché (visibilitychange).
// • reduced-motion → on rend UNE frame figée puis on coupe la boucle.
// • projection 3D→2D maison, tri par profondeur, taille/alpha selon z.
//   tout en transform/opacity de pixels (pas de DOM animé).
// =====================================================================

type Props = {
  className?: string;
  /** rayon relatif (0..1) de la sphère dans le canvas. */
  radius?: number;
  /** densité de particules — sera cappée. */
  count?: number;
  /** vitesse de rotation auto (rad/s). */
  spin?: number;
  /** teinte des particules. */
  colorCore?: string;   // cyan clair (highlights)
  colorMid?: string;    // teal
  colorDeep?: string;   // teal profond (arrière)
  /** halo radial derrière la sphère. */
  glow?: boolean;
};

type P = { x: number; y: number; z: number };

// distribution Fibonacci sur une sphère unité (régulière, sans clusters).
function fibonacciSphere(n: number): P[] {
  const pts: P[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // angle d'or
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2; // 1 → -1
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [203, 255, 252];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

export const ParticleSphere: React.FC<Props> = ({
  className = '',
  radius = 0.42,
  count = 460,
  spin = 0.12,
  colorCore = '#cbfffc',
  colorMid = '#3fd8cf',
  colorDeep = '#00827c',
  glow = true,
}) => {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    // count cappé selon la surface (mobile = moins de particules).
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    const N = Math.min(count, isSmall ? 280 : 520);

    const base = fibonacciSphere(N);
    const rgbCore = hexToRgb(colorCore);
    const rgbMid = hexToRgb(colorMid);
    const rgbDeep = hexToRgb(colorDeep);

    let W = 0, H = 0, CX = 0, CY = 0, R = 0;
    const setSize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CX = W / 2;
      CY = H / 2;
      R = Math.min(W, H) * radius;
    };

    // rotation courante (auto-spin lent + légère oscillation d'axe).
    let ay = 0; // yaw
    const ax = 0.42; // pitch fixe doux

    const lerpColor = (t: number): string => {
      // t: -1 (arrière) .. 1 (avant) → deep → mid → core
      let r: number, g: number, b: number;
      if (t < 0) {
        const k = t + 1; // 0..1
        r = rgbDeep[0] + (rgbMid[0] - rgbDeep[0]) * k;
        g = rgbDeep[1] + (rgbMid[1] - rgbDeep[1]) * k;
        b = rgbDeep[2] + (rgbMid[2] - rgbDeep[2]) * k;
      } else {
        const k = t; // 0..1
        r = rgbMid[0] + (rgbCore[0] - rgbMid[0]) * k;
        g = rgbMid[1] + (rgbCore[1] - rgbMid[1]) * k;
        b = rgbMid[2] + (rgbCore[2] - rgbMid[2]) * k;
      }
      return `${r | 0},${g | 0},${b | 0}`;
    };

    // tampon de tri (réutilisé chaque frame, pas d'alloc).
    const proj = new Array(N).fill(0).map(() => ({ sx: 0, sy: 0, depth: 0, idx: 0 }));

    const render = (yaw: number, t: number) => {
      ctx.clearRect(0, 0, W, H);

      // halo radial derrière (bioluminescence).
      if (glow) {
        const g = ctx.createRadialGradient(CX, CY, R * 0.1, CX, CY, R * 1.7);
        g.addColorStop(0, 'rgba(0,130,124,0.22)');
        g.addColorStop(0.5, 'rgba(0,130,124,0.07)');
        g.addColorStop(1, 'rgba(0,130,124,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(CX, CY, R * 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cx = Math.cos(ax), sx = Math.sin(ax);
      // respiration douce de l'échelle.
      const breathe = 1 + Math.sin(t * 0.5) * 0.015;

      for (let i = 0; i < N; i++) {
        const p = base[i];
        // rotation yaw (autour de Y) puis pitch (autour de X).
        let x = p.x * cy - p.z * sy;
        let z = p.x * sy + p.z * cy;
        let y = p.y * cx - z * sx;
        z = p.y * sx + z * cx;
        const o = proj[i];
        o.sx = CX + x * R * breathe;
        o.sy = CY + y * R * breathe;
        o.depth = z; // -1..1
        o.idx = i;
      }

      // tri arrière → avant pour un rendu propre.
      proj.sort((a, b) => a.depth - b.depth);

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < N; i++) {
        const o = proj[i];
        const d = o.depth; // -1..1
        const front = (d + 1) / 2; // 0..1
        // perspective : particules avant plus grandes + plus opaques.
        const size = (0.7 + front * 1.9) * (isSmall ? 0.85 : 1);
        const alpha = 0.12 + front * front * 0.78;
        const col = lerpColor(d);
        ctx.fillStyle = `rgba(${col},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(o.sx, o.sy, size, 0, Math.PI * 2);
        ctx.fill();
        // étincelle sur les particules les plus en avant.
        if (front > 0.88) {
          ctx.fillStyle = `rgba(${col},${(alpha * 0.5).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(o.sx, o.sy, size * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const ro = new ResizeObserver(() => { setSize(); if (reduce) render(0.6, 0); });
    ro.observe(wrap);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let last = performance.now();
    const t0 = last;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ay += spin * dt;
      render(ay, (now - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce) { render(0.6, 0); return; }
      if (isVisible && isPageVisible && raf === 0) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(
      ([e]) => { isVisible = e.isIntersecting; isVisible ? start() : stop(); },
      { threshold: 0 },
    );
    io.observe(wrap);

    const onVis = () => { isPageVisible = !document.hidden; isPageVisible ? start() : stop(); };
    document.addEventListener('visibilitychange', onVis);

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [radius, count, spin, colorCore, colorMid, colorDeep, glow]);

  return (
    <div ref={wrapRef} className={`pointer-events-none relative ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

export default ParticleSphere;
