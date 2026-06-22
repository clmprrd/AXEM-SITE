import React from 'react';
import { useReducedMotion } from 'framer-motion';

// =====================================================================
// PRISME DE VERRE — SYSTÈME « VIVID+CO ».
// Prisme 3D photoréaliste APPROXIMÉ en SVG : base N&B (obsidian → graphite)
// + 3 copies décalées en rouge/cyan/vert (aberration chromatique) sur les
// bords, en mix-blend-mode: screen. Placé DERRIÈRE/chevauchant les gros
// titres, masqué en fondu vignette dans le slate (.prism-canvas).
//
// PERF : pur SVG + 1 keyframe CSS transform (rotate/translate lents). Aucun
// canvas, aucun rAF, aucun WebGL. La face brillante dérive en transform-only
// (GPU). `pause hors-vue` via IntersectionObserver → animation-play-state.
// reduced-motion → prisme STATIQUE (aberration conservée, pas de mouvement).
// =====================================================================

type PrismProps = {
  className?: string;
  /** échelle du prisme (1 = défaut) */
  scale?: number;
  /** intensité de l'aberration chromatique (px de décalage) */
  aberration?: number;
  /** vitesse de dérive (s par cycle). 0 = statique. */
  speed?: number;
  /** rotation de base en degrés */
  rotate?: number;
};

// un triangle-prisme : N&B + 3 fuites RGB décalées en screen.
export const Prism: React.FC<PrismProps> = ({
  className = '',
  scale = 1,
  aberration = 3.2,
  speed = 26,
  rotate = -14,
}) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  // pause hors-vue : on coupe l'animation CSS quand le prisme sort du viewport.
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0, rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = !reduce && speed > 0 && inView;
  const a = aberration;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`prism-canvas pointer-events-none ${className}`}
      style={{
        // dérive très lente du conteneur — transform only (GPU).
        animation: animate ? `prismDrift ${speed}s ease-in-out infinite` : 'none',
        willChange: animate ? 'transform' : 'auto',
      }}>
      <style>{`
        @keyframes prismDrift {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(${rotate}deg) scale(${scale}); }
          50%      { transform: translate3d(0, -2.5%, 0) rotate(${rotate + 4}deg) scale(${scale * 1.04}); }
        }
        @keyframes prismShimmer {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.85; }
        }
      `}</style>
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        style={{
          transform: animate ? undefined : `rotate(${rotate}deg) scale(${scale})`,
        }}>
        <defs>
          {/* base N&B du prisme : obsidian → graphite, facettes. */}
          <linearGradient id="prismBaseA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#000000" />
            <stop offset="0.55" stopColor="#1c1c1c" />
            <stop offset="1" stopColor="#403f3f" />
          </linearGradient>
          <linearGradient id="prismBaseB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0a0a" />
            <stop offset="1" stopColor="#2a2a2a" />
          </linearGradient>
          {/* arête brillante (spéculaire) off-white */}
          <linearGradient id="prismSpec" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fffdf9" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fffdf9" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fffdf9" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ===== ABERRATION CHROMATIQUE — 3 copies du prisme décalées ===== */}
        <g style={{ mixBlendMode: 'screen' }}>
          {/* fuite ROUGE */}
          <g transform={`translate(${-a} ${a * 0.6})`} opacity="0.5">
            <polygon points="200,40 330,300 70,300" fill="#ff2a40" />
          </g>
          {/* fuite VERTE */}
          <g transform={`translate(0 ${-a * 0.8})`} opacity="0.42">
            <polygon points="200,40 330,300 70,300" fill="#36ff96" />
          </g>
          {/* fuite BLEUE/CYAN */}
          <g transform={`translate(${a} ${a * 0.6})`} opacity="0.5">
            <polygon points="200,40 330,300 70,300" fill="#2ac6ff" />
          </g>
        </g>

        {/* ===== PRISME N&B (corps) ===== */}
        <polygon points="200,40 330,300 70,300" fill="url(#prismBaseA)" opacity="0.92" />
        {/* facette interne (réfraction) */}
        <polygon points="200,40 270,300 130,300" fill="url(#prismBaseB)" opacity="0.7" />
        {/* arête brillante gauche */}
        <path
          d="M200 40 L70 300"
          stroke="url(#prismSpec)"
          strokeWidth="2.4"
          fill="none"
          style={{
            animation: animate ? 'prismShimmer 7s ease-in-out infinite' : 'none',
          }}
        />
        {/* arête brillante droite */}
        <path
          d="M200 40 L330 300"
          stroke="url(#prismSpec)"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        {/* éclat off-white au sommet */}
        <circle cx="200" cy="48" r="3.4" fill="#fffdf9" opacity="0.85" />
      </svg>
    </div>
  );
};

// Variante « éclat » — un prisme losange plus fin (pour ponctuation/CTA).
export const PrismShard: React.FC<PrismProps> = ({
  className = '',
  scale = 1,
  aberration = 2.6,
  speed = 20,
  rotate = 18,
}) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0, rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = !reduce && speed > 0 && inView;
  const a = aberration;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`prism-canvas pointer-events-none ${className}`}
      style={{
        animation: animate ? `prismDriftShard ${speed}s ease-in-out infinite` : 'none',
        willChange: animate ? 'transform' : 'auto',
      }}>
      <style>{`
        @keyframes prismDriftShard {
          0%, 100% { transform: translate3d(0,0,0) rotate(${rotate}deg) scale(${scale}); }
          50%      { transform: translate3d(1.5%, -2%, 0) rotate(${rotate - 6}deg) scale(${scale * 1.05}); }
        }
      `}</style>
      <svg viewBox="0 0 300 300" className="h-full w-full"
        style={{ transform: animate ? undefined : `rotate(${rotate}deg) scale(${scale})` }}>
        <defs>
          <linearGradient id="shardBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#000000" />
            <stop offset="1" stopColor="#403f3f" />
          </linearGradient>
        </defs>
        <g style={{ mixBlendMode: 'screen' }}>
          <polygon points="150,30 230,150 150,270 70,150" fill="#ff2a40" transform={`translate(${-a} 0)`} opacity="0.5" />
          <polygon points="150,30 230,150 150,270 70,150" fill="#2ac6ff" transform={`translate(${a} 0)`} opacity="0.5" />
          <polygon points="150,30 230,150 150,270 70,150" fill="#36ff96" transform={`translate(0 ${-a})`} opacity="0.4" />
        </g>
        <polygon points="150,30 230,150 150,270 70,150" fill="url(#shardBase)" opacity="0.9" />
        <path d="M150 30 L70 150 L150 270" stroke="#fffdf9" strokeOpacity="0.55" strokeWidth="1.6" fill="none" />
      </svg>
    </div>
  );
};

export default Prism;
