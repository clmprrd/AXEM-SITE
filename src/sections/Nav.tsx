import React from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { scrollToId } from './store';

// =====================================================================
// NAV — pilule flottante scroll-glass (réplique Limitless, pas d'auto-hide).
// Liens → sections du terrain de jeu (scroll doux avec offset).
// =====================================================================

const NAV_LINKS: [string, string][] = [
  ['Calculateur', 'calculateur'], ['Parcours', 'parcours'],
  ['Cas', 'cas'], ['Le duo', 'duo'],
];

const Nav: React.FC = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 80;
    setScrolled((prev) => (prev === next ? prev : next));
  });
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6">
      <nav data-scrolled={scrolled ? 'true' : 'false'}
        className="nav-pill flex w-full max-w-3xl items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2">
        <button onClick={() => scrollToId('top')}
          className="link-limitless font-serif-display text-2xl leading-none tracking-tight text-cream hover:text-cream [touch-action:manipulation]">
          AXEM<span className="aurora-text">.</span>
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <button key={l} onClick={() => scrollToId(h)}
              className="group link-limitless relative text-[13px] font-medium text-cream-soft hover:text-cream [touch-action:manipulation]">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-0 rounded-full bg-gradient-to-r from-green to-cyan transition-[width] duration-300 [transition-timing-function:var(--ease-limitless)] group-hover:w-full" />
            </button>
          ))}
        </div>
        <button onClick={() => scrollToId('qualif')}
          className="btn btn-secondary btn-sm !py-2.5">
          <span className="btn-underline">Réserver un appel</span>
        </button>
      </nav>
    </header>
  );
};

export default Nav;
