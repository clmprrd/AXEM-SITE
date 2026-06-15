import React from 'react';

// =====================================================================
// LAZY-MOUNT — ne monte une section lourde (morph pinné, parcours scrub)
// que lorsqu'elle approche le viewport, via un IntersectionObserver à large
// rootMargin. Réduit le nombre d'anims scroll-linked actives simultanément
// (donc la charge par frame). Une fois montée, elle reste montée (le démontage
// d'une section pinnée casserait la hauteur du document).
//
// `minHeight` réserve l'espace pour éviter tout saut de layout (CLS) avant
// le montage — on passe la même hauteur que la section pinnée.
// =====================================================================

export const LazySection: React.FC<{
  children: React.ReactNode;
  minHeight: string;
  rootMargin?: string;
}> = ({ children, minHeight, rootMargin = '600px 0px' }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    // SSR / pas d'IO : montage direct
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }

    const mount = () => setShow(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          mount();
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);

    // Fallback ceinture-et-bretelles : si l'IO ne se déclenche pas (contextes
    // exotiques), un check au scroll par distance garantit le montage. Passif,
    // se retire dès que monté. Marge généreuse (1.5 écran).
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 2.5) {
        mount();
        cleanup();
      }
    };
    const cleanup = () => {
      io.disconnect();
      window.removeEventListener('scroll', check);
    };
    window.addEventListener('scroll', check, { passive: true });
    check(); // check immédiat (si déjà proche au montage)

    return cleanup;
  }, [show, rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
};
