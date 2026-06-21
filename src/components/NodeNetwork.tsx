import React from 'react';
import { MotionValue } from 'framer-motion';

// =====================================================================
// NODE NETWORK — réseau de nœuds (points + traits fins) qui se TRACE et se
// CONNECTE au scroll. Le « parcours » / les « cas clients » deviennent un
// réseau qui prend vie nœud par nœud.
//
// Piloté par une MotionValue `progress` (0..1) : à mesure que progress monte,
// les nœuds apparaissent (scale + glow) et les arêtes se tracent (longueur).
//
// PERF :
// • canvas 2D, abonnement direct à la MotionValue (progress.on('change')) —
//   AUCUN re-render React par frame. On ne redessine que si progress bouge
//   OU si une particule de halo respire (rAF léger, pausé hors-vue).
// • dpr cappé 1.5, pas d'allocation par frame.
// • reduced-motion → réseau dessiné à 100 % d'emblée (figé).
// =====================================================================

export type NetNode = {
  /** position relative 0..1 dans le canvas. */
  x: number;
  y: number;
  /** seuil d'apparition (0..1) le long de progress. */
  at: number;
  /** rayon visuel (px de base). */
  r?: number;
  /** label optionnel rendu en HTML par-dessus (cf. children côté parent). */
  key?: string;
};

export type NetEdge = [number, number]; // index source, index cible

type Props = {
  nodes: NetNode[];
  edges: NetEdge[];
  /** progression externe (MotionValue 0..1). Optionnelle : si absente, le
   *  composant calcule lui-même sa progression depuis sa position à l'écran
   *  (`selfScroll`) — robuste, sans dépendance au câblage scroll externe. */
  progress?: MotionValue<number>;
  /** auto-calcule la progression depuis la position viewport du canvas. */
  selfScroll?: boolean;
  className?: string;
  colorLine?: string;   // trait
  colorNode?: string;   // nœud allumé
  reduce?: boolean;
};

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [203, 255, 252];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

export const NodeNetwork: React.FC<Props> = ({
  nodes,
  edges,
  progress,
  selfScroll = false,
  className = '',
  colorLine = '#3fd8cf',
  colorNode = '#cbfffc',
  reduce = false,
}) => {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // ref stable vers les data (évite de relancer l'effet à chaque render parent).
  const dataRef = React.useRef({ nodes, edges });
  dataRef.current = { nodes, edges };

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const line = hexToRgb(colorLine);
    const node = hexToRgb(colorNode);

    let W = 0, H = 0;
    const setSize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // easing doux pour l'apparition d'un élément (0..1).
    const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));

    const draw = (pRaw: number, time: number) => {
      const p = reduce ? 1 : pRaw;
      const { nodes: ns, edges: es } = dataRef.current;
      ctx.clearRect(0, 0, W, H);

      // ARÊTES — se tracent quand les DEUX nœuds sont (presque) nés.
      ctx.lineCap = 'round';
      for (let i = 0; i < es.length; i++) {
        const [a, b] = es[i];
        const na = ns[a], nb = ns[b];
        if (!na || !nb) continue;
        // l'arête commence à se tracer juste après la naissance du nœud le plus tardif.
        const birth = Math.max(na.at, nb.at);
        const t = ease((p - birth) / 0.14);
        if (t <= 0) continue;
        const ax = na.x * W, ay = na.y * H;
        const bx = nb.x * W, by = nb.y * H;
        const cx = ax + (bx - ax) * t;
        const cy = ay + (by - ay) * t;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = `rgba(${line[0]},${line[1]},${line[2]},${(0.14 + 0.22 * t).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // tête lumineuse qui court le long du trait pendant le tracé.
        if (t < 1) {
          ctx.beginPath();
          ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${node[0]},${node[1]},${node[2]},0.8)`;
          ctx.fill();
        }
      }

      // NŒUDS — pop + halo qui pulse doucement une fois nés.
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        const t = ease((p - n.at) / 0.1);
        if (t <= 0) continue;
        const x = n.x * W, y = n.y * H;
        const baseR = (n.r ?? 3);
        // pulse subtil (respiration) seulement si pas reduced.
        const pulse = reduce ? 1 : 1 + Math.sin(time * 1.4 + i) * 0.12;
        const r = baseR * t * pulse;
        // halo
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
        g.addColorStop(0, `rgba(${node[0]},${node[1]},${node[2]},${(0.5 * t).toFixed(3)})`);
        g.addColorStop(1, `rgba(${node[0]},${node[1]},${node[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 4.5, 0, Math.PI * 2);
        ctx.fill();
        // cœur du nœud
        ctx.fillStyle = `rgba(${node[0]},${node[1]},${node[2]},${(0.95 * t).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    // progression : MotionValue externe OU auto-calcul depuis la position viewport.
    // selfScroll : 0 quand le canvas entre par le bas (90% vh), 1 quand son bas
    // remonte à ~35% vh → le réseau se trace pendant la traversée. Robuste, sans
    // dépendance au câblage scroll externe (Lenis/Framer).
    const getProgress = (): number => {
      if (progress) return progress.get();
      if (!selfScroll) return 1;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const startY = vh * 0.9;   // entrée
      const endY = vh * 0.3;     // tracé complet
      const p = (startY - r.top) / (startY - endY);
      return p < 0 ? 0 : p > 1 ? 1 : p;
    };

    const ro = new ResizeObserver(() => { setSize(); draw(getProgress(), 0); });
    ro.observe(wrap);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = (now: number) => {
      draw(getProgress(), (now - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce) { draw(1, 0); return; }
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const stop = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(
      ([e]) => { isVisible = e.isIntersecting; isVisible ? start() : stop(); },
      { threshold: 0 },
    );
    io.observe(wrap);
    const onVis = () => { isPageVisible = !document.hidden; isPageVisible ? start() : stop(); };
    document.addEventListener('visibilitychange', onVis);

    // dessin initial (figé) + démarrage si visible.
    draw(getProgress(), 0);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [progress, selfScroll, colorLine, colorNode, reduce]);

  return (
    <div ref={wrapRef} className={`pointer-events-none ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

export default NodeNetwork;
