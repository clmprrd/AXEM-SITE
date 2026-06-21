import React, { useEffect, useRef } from 'react';

// =====================================================================
// CHAMP DE PARTICULES BIOLUMINESCENTES — DA AUROS.
// Canvas 2D léger, fixe plein cadre, DERRIÈRE tout le contenu. Des « étoiles
// de données » dérivent doucement dans l'abîme ; les voisines proches se
// relient d'un fil ténu (constellation). Une lueur radiale lavande/teal très
// basse opacité réagit imperceptiblement au curseur.
//
// PERF (priorité — le client déteste le lag) :
// • nombre de particules CAPPÉ selon la surface (et réduit sur petits écrans) ;
// • dpr ≤ 1.5 (moins de pixels à peindre) ;
// • PAUSE hors-vue (IntersectionObserver) ET page cachée (visibilitychange) ;
// • voisinage relié via une GRILLE spatiale → on évite le O(n²) (coût ~ O(n)) ;
// • prefers-reduced-motion → on peint UNE frame statique puis on coupe la boucle ;
// • transform/opacity/canvas only — aucun reflow, aucun setState par frame.
// =====================================================================

type P = { x: number; y: number; vx: number; vy: number; r: number; tw: number; ph: number };

const ConstellationField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    // distance de liaison (px CSS) — au-delà, pas de fil tracé
    const LINK = 118;
    const LINK2 = LINK * LINK;

    let w = 0, h = 0;
    let particles: P[] = [];
    let raf = 0;
    let t0 = performance.now();

    // — pointeur (parallaxe TRÈS douce, optionnelle) —
    const ptr = { x: -9999, y: -9999, active: false };

    // grille spatiale pour le voisinage (cellule = LINK) → O(n) au lieu de O(n²)
    let cols = 1, rows = 1;
    let grid: number[][] = [];

    const countFor = (area: number) => {
      // ~1 particule / 14000 px², capée. Réduite sur mobile.
      const base = Math.round(area / 14000);
      const cap = window.innerWidth < 640 ? 46 : window.innerWidth < 1100 ? 78 : 120;
      return Math.max(24, Math.min(base, cap));
    };

    const build = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const n = countFor(w * h);
      particles = new Array(n).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 0.6 + Math.random() * 1.6,
        tw: 0.4 + Math.random() * 0.6, // amplitude scintillement
        ph: Math.random() * Math.PI * 2, // phase scintillement
      }));

      cols = Math.max(1, Math.ceil(w / LINK));
      rows = Math.max(1, Math.ceil(h / LINK));
    };

    const rebuildGrid = () => {
      grid = new Array(cols * rows);
      for (let i = 0; i < grid.length; i++) grid[i] = [];
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.min(cols - 1, Math.max(0, (p.x / LINK) | 0));
        const cy = Math.min(rows - 1, Math.max(0, (p.y / LINK) | 0));
        grid[cy * cols + cx].push(i);
      }
    };

    const draw = (time: number) => {
      const dt = reduce ? 0 : Math.min(40, time - t0);
      t0 = time;
      ctx.clearRect(0, 0, w, h);

      // intégration position (drift très lent), wrap aux bords
      if (!reduce) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx * (dt * 0.06);
          p.y += p.vy * (dt * 0.06);
          if (p.x < -4) p.x = w + 4; else if (p.x > w + 4) p.x = -4;
          if (p.y < -4) p.y = h + 4; else if (p.y > h + 4) p.y = -4;
        }
      }

      rebuildGrid();

      // — fils de constellation (voisinage via grille) —
      ctx.lineWidth = 1;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const cell = grid[cy * cols + cx];
          // on regarde la cellule + voisines (droite/bas) pour éviter doublons
          for (let oy = 0; oy <= 1; oy++) {
            for (let ox = (oy === 0 ? 0 : -1); ox <= 1; ox++) {
              const nx = cx + ox, ny = cy + oy;
              if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
              const other = grid[ny * cols + nx];
              for (let a = 0; a < cell.length; a++) {
                const pa = particles[cell[a]];
                const bStart = (other === cell) ? a + 1 : 0;
                for (let b = bStart; b < other.length; b++) {
                  const pb = particles[other[b]];
                  const dx = pa.x - pb.x, dy = pa.y - pb.y;
                  const d2 = dx * dx + dy * dy;
                  if (d2 > LINK2) continue;
                  const alpha = (1 - d2 / LINK2) * 0.16;
                  ctx.strokeStyle = `rgba(103, 232, 223, ${alpha})`;
                  ctx.beginPath();
                  ctx.moveTo(pa.x, pa.y);
                  ctx.lineTo(pb.x, pb.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      // — particules (étoiles) avec scintillement doux —
      const tt = time * 0.001;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const tw = reduce ? 0.85 : 0.6 + 0.4 * Math.sin(tt * p.tw + p.ph);
        const r = p.r;
        // halo
        ctx.fillStyle = `rgba(103, 232, 223, ${0.05 * tw})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        // cœur
        ctx.fillStyle = `rgba(203, 255, 252, ${0.55 * tw})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // — lueur curseur (très basse opacité, lavande Auros) —
      if (!reduce && ptr.active) {
        const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 180);
        g.addColorStop(0, 'rgba(253, 233, 255, 0.05)');
        g.addColorStop(1, 'rgba(253, 233, 255, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(ptr.x - 180, ptr.y - 180, 360, 360);
      }

      if (!reduce) raf = requestAnimationFrame(draw);
      else raf = 0;
    };

    // — visibilité (pause hors-vue / page cachée) —
    let inView = true;
    let pageVisible = !document.hidden;
    const start = () => {
      if (reduce) { draw(performance.now()); return; }
      if (inView && pageVisible && raf === 0) { t0 = performance.now(); raf = requestAnimationFrame(draw); }
    };
    const stop = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(
      ([e]) => { inView = e.isIntersecting; inView ? start() : stop(); },
      { threshold: 0 },
    );
    io.observe(wrap);

    const onVis = () => { pageVisible = !document.hidden; pageVisible ? start() : stop(); };
    document.addEventListener('visibilitychange', onVis);

    const onPtr = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      ptr.x = e.clientX - rect.left;
      ptr.y = e.clientY - rect.top;
      ptr.active = true;
    };
    const onPtrLeave = () => { ptr.active = false; };
    if (!reduce) {
      window.addEventListener('pointermove', onPtr, { passive: true });
      window.addEventListener('pointerleave', onPtrLeave, { passive: true });
    }

    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => { build(); if (reduce) draw(performance.now()); });
    });
    ro.observe(wrap);

    build();
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPtr);
      window.removeEventListener('pointerleave', onPtrLeave);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className={`constellation-field ${className}`.trim()}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ConstellationField;
