// =====================================================================
// cursorSignal — bus GLOBAL, hors-React, de la VÉLOCITÉ du curseur.
// Le curseur magnétique (CursorField) écrit ici à chaque pointermove ;
// le hero WebGL (HeroFlux) lit `velocity` chaque frame pour piloter la
// distorsion du shader. Zéro state React, zéro re-render : une simple ref
// partagée mutée en place. Perf-safe.
// =====================================================================

export const cursor = {
  // position écran (px)
  x: 0,
  y: 0,
  // vélocité lissée [0..1] — 0 immobile, ~1 mouvement très rapide.
  velocity: 0,
  // position normalisée dans le hero [0..1] (mise à jour par HeroFlux).
  nx: 0.5,
  ny: 0.5,
  // le pointeur a-t-il déjà bougé (évite un flash de distorsion au load)
  moved: false,
};

let lastX = 0;
let lastY = 0;
let lastT = 0;
let raf = 0;

// décroissance de la vélocité quand le curseur s'arrête (retour au calme)
const decay = () => {
  cursor.velocity *= 0.92;
  if (cursor.velocity < 0.001) {
    cursor.velocity = 0;
    raf = 0;
    return;
  }
  raf = requestAnimationFrame(decay);
};

const onMove = (e: PointerEvent) => {
  const now = performance.now();
  const dt = Math.max(1, now - lastT);
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const dist = Math.hypot(dx, dy);
  // vitesse px/ms → normalisée (2.2 px/ms ≈ 1). Lissage exponentiel.
  const raw = Math.min(1, dist / dt / 2.2);
  cursor.velocity = cursor.velocity * 0.8 + raw * 0.2;
  cursor.x = e.clientX;
  cursor.y = e.clientY;
  cursor.moved = true;
  lastX = e.clientX;
  lastY = e.clientY;
  lastT = now;
  if (raf === 0) raf = requestAnimationFrame(decay);
};

let started = false;
export const startCursorSignal = () => {
  if (started || typeof window === 'undefined') return () => {};
  started = true;
  lastT = performance.now();
  window.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    started = false;
    window.removeEventListener('pointermove', onMove);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
};
