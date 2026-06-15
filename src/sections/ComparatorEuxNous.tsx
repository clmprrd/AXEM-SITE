import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { Eyebrow, FadeUp } from './primitives';

// =====================================================================
// §9 — COMPARATOR EUX / NOUS. « D'autres sous-traitent. Chez nous, qui
// audite forme et déploie. » Séparateur DRAGGABLE « Eux / Nous » (chaîne
// fragmentée vs parcours unique), façon avant/après jouable.
// Drag pointeur + tactile + clavier (range a11y). reduced-motion → 50/50 fixe.
// =====================================================================

const EUX = [
  'Un prestataire pour l\'audit',
  'Un autre pour la formation',
  'Un freelance pour le déploiement',
  'Personne pour le suivi',
  'Vous, à recoller les morceaux',
];
const NOUS = [
  'Le même duo de l\'audit au suivi',
  'On forme ce qu\'on a déployé',
  'Un seul interlocuteur, zéro silo',
  'On reste jusqu\'à l\'autonomie',
  'Vous avancez, on porte le reste',
];

const ComparatorEuxNous: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState(reduce ? 50 : 52);
  const dragging = React.useRef(false);

  const setFromClientX = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(8, Math.min(92, p)));
  };
  const onDown = (e: React.PointerEvent) => { if (reduce) return; dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); setFromClientX(e.clientX); };
  const onMove = (e: React.PointerEvent) => { if (dragging.current) setFromClientX(e.clientX); };
  const onUp = () => { dragging.current = false; };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(8, p - 4));
    if (e.key === 'ArrowRight') setPos((p) => Math.min(92, p + 4));
  };

  return (
    <section id="comparatif" className="section-clip relative px-5 py-[clamp(110px,16vh,220px)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <FadeUp><Eyebrow>Eux / Nous</Eyebrow></FadeUp>
          <FadeUp delay={0.06}>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.6vw, 72px)' }}>
              D'autres sous-traitent.<br /><span className="aurora-text italic">Chez nous, qui audite forme et déploie.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream-soft">
              Faites glisser la poignée — d'un côté la chaîne fragmentée, de l'autre le parcours unique.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.08}>
          <div ref={ref}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
            className="relative mt-12 h-[460px] select-none overflow-hidden rounded-3xl border border-green/15 md:h-[420px]">
            {/* NOUS — fond (dessous) */}
            <div className="absolute inset-0 flex flex-col justify-center gap-3 px-7 py-8 md:px-14"
              style={{ background: 'linear-gradient(120deg, rgba(91,140,255,0.12), rgba(56,189,248,0.05))' }}>
              <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.18em] text-cyan">Avec AXEM · un seul parcours</span>
              <ul className="mt-2 space-y-2.5">
                {NOUS.map((n) => (
                  <li key={n} className="flex items-center gap-3 text-[15px] text-cream md:text-[16px]">
                    <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/90 text-[11px] font-bold text-[#06101F]">✓</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>

            {/* EUX — par-dessus, clippé par la poignée */}
            <div className="absolute inset-0 flex flex-col justify-center gap-3 bg-ink-3 px-7 py-8 md:px-14"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.18em] text-cream-dim">Ailleurs · chaîne fragmentée</span>
              <ul className="mt-2 space-y-2.5">
                {EUX.map((e) => (
                  <li key={e} className="flex items-center gap-3 text-[15px] text-cream-soft md:text-[16px]">
                    <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cream-dim/40 text-[11px] text-cream-dim">✕</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            {/* POIGNÉE */}
            <div className="absolute inset-y-0 z-10 flex w-0 items-center justify-center"
              style={{ left: `${pos}%` }}>
              <div aria-hidden className="absolute inset-y-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-green to-transparent" />
              <button
                onKeyDown={onKey}
                aria-label="Glisser pour comparer Eux et Nous"
                role="slider" aria-valuenow={Math.round(pos)} aria-valuemin={8} aria-valuemax={92}
                className="relative z-10 flex h-12 w-12 -translate-x-1/2 cursor-ew-resize items-center justify-center rounded-full border border-green/50 bg-ink-2/90 text-green shadow-[0_8px_24px_-6px_rgba(20,40,110,0.8)] backdrop-blur [touch-action:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-green"
                style={{ touchAction: 'none' }}>
                <span aria-hidden className="text-lg leading-none">⇄</span>
              </button>
            </div>

            {/* étiquettes coins */}
            <span className="pointer-events-none absolute left-5 top-4 text-[10.5px] font-satoshi font-bold uppercase tracking-[0.14em] text-cream-dim md:left-8">Eux</span>
            <span className="pointer-events-none absolute right-5 top-4 text-[10.5px] font-satoshi font-bold uppercase tracking-[0.14em] text-cyan md:right-8">Nous</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default ComparatorEuxNous;
