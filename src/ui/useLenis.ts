import { useEffect } from 'react';
import Lenis from 'lenis';

// =====================================================================
// SMOOTH SCROLL — Lenis pilote le scroll natif via une boucle rAF unique
// avec un lerp doux (~0.1). C'est LE remède au « scroll qui rame » :
// • un seul rAF orchestre tout le scroll → plus de saccade entre frames natives ;
// • toutes les valeurs Framer scroll-linked (useScroll/useTransform) restent
//   valides — Lenis met à jour scrollTop, Framer lit la même source ;
// • désactivé sous prefers-reduced-motion (scroll natif instantané).
//
// On expose l'instance globalement (window.__lenis) pour debug éventuel,
// mais aucune dépendance externe n'en a besoin.
// =====================================================================

export const useLenis = () => {
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // scroll natif instantané, pas de smoothing

    const lenis = new Lenis({
      // lerp bas = inertie douce et continue (buttery), sans flottement excessif
      lerp: 0.1,
      // wheel un peu amorti, touch laissé natif (perf + ressenti mobile)
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
      // courbe de easing pour les scrolls programmés (anchors)
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    // exposé pour debug éventuel (anchors, mesures)
    (window as any).__lenis = lenis;

    // boucle rAF unique — synchronise Lenis (et donc tous les scroll-linked)
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // les ancres (#duo, #methode…) passent par Lenis pour un glissement fluide
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };
    document.addEventListener('click', onAnchorClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onAnchorClick);
      delete (window as any).__lenis;
      lenis.destroy();
    };
  }, []);
};
