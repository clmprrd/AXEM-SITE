import React from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { CountUp } from '../ui/motion';

// =====================================================================
// KPI CONSTELLATION — le « moment signature » mémorable.
// Les résultats chiffrés se matérialisent en points-étoiles reliés par des
// lignes quand la section entre à l'écran (IntersectionObserver via useInView,
// PAS de scroll-jacking : on déclenche un reveal one-shot, on ne touche jamais
// à la vitesse/direction du scroll).
//
// Déroulé au « in view » :
//   1. les cartes-chiffres montent (stagger),
//   2. un canvas trace les LIGNES de la constellation entre les nœuds,
//   3. les nœuds-étoiles s'allument un à un,
//   4. les compteurs s'incrémentent (CountUp, déjà once/in-view).
//
// PERF :
// • le tracé des lignes est une animation canvas one-shot pilotée par rAF,
//   bornée dans le temps (≈1.4 s) puis figée — aucun re-render React par frame,
//   aucune boucle permanente. Les positions des nœuds sont mesurées via refs.
// • recalcul des positions au resize (debounced par ResizeObserver).
// • reduced-motion → constellation dessinée à 100 % d'emblée, compteurs directs.
// =====================================================================

export type Kpi = { val: React.ReactNode; label: string; sub?: string };

// arêtes de la constellation (indices dans la grille KPI, 6 nœuds).
// dessin type « carte du ciel » : chemin principal + quelques diagonales.
const CONSTELLATION_EDGES: [number, number][] = [
  [0, 1], [1, 2],       // ligne haute
  [3, 4], [4, 5],       // ligne basse
  [0, 3], [1, 4], [2, 5], // montants verticaux
  [0, 4], [2, 4],       // diagonales (l'étoile centrale rayonne)
];

type Props = { kpis: Kpi[] };

export const KpiConstellation: React.FC<Props> = ({ kpis }) => {
  const reduce = useReducedMotion();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // une ref par nœud-étoile (le petit point ancré sur chaque KPI).
  const nodeRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const inView = useInView(wrapRef, { once: true, amount: 0.4 });
  const [lit, setLit] = React.useState<boolean[]>(() => kpis.map(() => !!reduce));

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0;
    // positions (centre de chaque nœud) relatives au wrap, en px CSS.
    let pts: { x: number; y: number }[] = [];

    // (re)dimensionne le canvas — seulement au mount / resize (réassigner
    // canvas.width chaque frame provoquerait un clignotement inutile).
    const setSize = () => {
      const wr = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(wr.width));
      H = Math.max(1, Math.floor(wr.height));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    // relit les positions des nœuds (centre) relatives au wrap — peu coûteux,
    // appelé chaque frame pendant le tracé pour suivre les cartes qui se posent.
    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      pts = nodeRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 };
      });
    };

    // p : 0..1 progression du tracé des lignes (globale).
    const drawLines = (p: number) => {
      ctx.clearRect(0, 0, W, H);
      if (pts.length < kpis.length) return;
      ctx.lineCap = 'round';
      const E = CONSTELLATION_EDGES.length;
      for (let i = 0; i < E; i++) {
        const [a, b] = CONSTELLATION_EDGES[i];
        const pa = pts[a], pb = pts[b];
        if (!pa || !pb) continue;
        // chaque arête a sa fenêtre de tracé (staggerée le long de p).
        const start = (i / E) * 0.55;
        const local = Math.max(0, Math.min(1, (p - start) / 0.45));
        if (local <= 0) continue;
        const cx = pa.x + (pb.x - pa.x) * local;
        const cy = pa.y + (pb.y - pa.y) * local;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = `rgba(63,216,207,${(0.10 + 0.28 * local).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // tête lumineuse qui court le long de la ligne pendant le tracé.
        if (local < 1) {
          ctx.beginPath();
          ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(203,255,252,0.85)';
          ctx.fill();
        }
      }
    };

    const ro = new ResizeObserver(() => {
      setSize();
      measure();
      // au resize, on redessine à l'état courant (fini si déjà joué).
      drawLines(reduce || inView ? 1 : 0);
    });
    ro.observe(wrap);
    setSize();
    measure();

    if (reduce) {
      drawLines(1);
      setLit(kpis.map(() => true));
      return () => ro.disconnect();
    }

    if (!inView) {
      drawLines(0);
      return () => ro.disconnect();
    }

    // ANIMATION ONE-SHOT — tracé borné (~1.4 s) puis figé. Pas de boucle permanente.
    let raf = 0;
    const dur = 1400;
    const t0 = performance.now();
    // allumage des nœuds : staggeré, via setState borné (max kpis.length fois).
    const litLocal = kpis.map(() => false);
    let litCount = 0;
    const loop = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      // re-mesure chaque frame : les cartes-chiffres arrivent en spring (translate-y)
      // pendant le tracé — les lignes suivent ainsi exactement les nœuds qui se posent.
      // coût négligeable (6 rect reads, aucune écriture DOM interleaved).
      measure();
      drawLines(p);
      // allume les nœuds au fil de la progression (0 → dernier).
      const target = Math.min(kpis.length, Math.floor(p * kpis.length + 0.5));
      if (target > litCount) {
        for (let i = litCount; i < target; i++) litLocal[i] = true;
        litCount = target;
        setLit([...litLocal]);
      }
      if (p < 1) raf = requestAnimationFrame(loop);
      else {
        // garantit tout allumé en fin de course.
        setLit(kpis.map(() => true));
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView, reduce, kpis.length]);

  return (
    <div ref={wrapRef} className="kpi-constellation relative mt-16">
      {/* canvas des lignes de la constellation — derrière les chiffres */}
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 md:gap-y-20">
        {kpis.map((k, i) => (
          <motion.div
            key={i}
            className={`kpi-star ${i % 2 === 1 ? 'md:translate-y-8' : ''}`}
            initial={reduce ? { opacity: 1 } : { opacity: 0.001, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={reduce ? { duration: 0.3 } : { type: 'spring', stiffness: 320, damping: 40, delay: i * 0.09 }}>
            {/* nœud-étoile ancré (relié par le canvas) — s'allume au tracé */}
            <span
              ref={(el) => { nodeRefs.current[i] = el; }}
              aria-hidden
              data-lit={lit[i] ? 'true' : 'false'}
              className="kpi-node absolute -top-3 left-1 h-2.5 w-2.5 rounded-full border border-mint/40 bg-ink"
            />
            <div className="font-serif-display leading-[0.85] text-cream" style={{ fontSize: 'clamp(46px, 8vw, 100px)' }}>
              {k.val}
            </div>
            <div className="mt-3 max-w-[210px] text-[13px] font-medium leading-snug text-cream-soft">{k.label}</div>
            {k.sub && (
              <div className="mt-1 text-[11px] font-satoshi font-bold uppercase tracking-[0.12em] text-cyan/70">{k.sub}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KpiConstellation;
