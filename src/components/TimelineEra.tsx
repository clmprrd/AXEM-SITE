import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';

// =====================================================================
// SIGNATURE — « On était là. »
// Timeline horizontale de l'histoire de l'IA (GPT-3 → Claude Fable 5).
// Au scroll, la jauge se remplit et le swagger défile : preuve de veille,
// d'avance, d'autorité. Perf-safe : 100 % motion values (useTransform),
// zéro setState par frame. Sticky (pas de scroll-jacking).
// =====================================================================

type Era = { year: string; model: string; swagger: string };

const ERAS: Era[] = [
  { year: '2020', model: 'GPT-3', swagger: 'On était là.' },
  { year: 'nov. 2022', model: 'ChatGPT', swagger: 'Là — dès le premier jour.' },
  { year: '2023', model: 'GPT-4 · Claude', swagger: 'Encore là.' },
  { year: '2024', model: 'Claude 3 · GPT-4o', swagger: 'Là aussi.' },
  { year: '2025', model: 'Agents · o1', swagger: 'Là — à déployer en prod.' },
  { year: '2026', model: 'Claude Cowork', swagger: 'Là — et on a beaucoup publié.' },
  { year: 'aujourd’hui', model: 'Claude Fable 5', swagger: 'Là. Avant tout le monde.' },
];

const Dot: React.FC<{ p: number; progress: MotionValue<number>; era: Era; i: number }> = ({ p, progress, era, i }) => {
  const active = useTransform(progress, [p - 0.04, p], [0, 1]);
  const dotBg = useTransform(active, [0, 1], ['var(--border-strong)', 'var(--accent)']);
  const dotScale = useTransform(active, [0, 1], [0.8, 1.15]);
  const labelOpacity = useTransform(progress, [p - 0.05, p], [0.35, 1]);
  const labelY = useTransform(progress, [p - 0.05, p], [6, 0]);
  const above = i % 2 === 0;
  return (
    <div className="relative flex-1" style={{ minWidth: 0 }}>
      {/* marker on the rail */}
      <motion.span
        className="absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-bg"
        style={{ background: dotBg, scale: dotScale }}
      />
      {/* label above or below */}
      <motion.div
        className={`absolute left-1/2 w-[132px] -translate-x-1/2 text-center ${above ? 'bottom-[calc(50%+22px)]' : 'top-[calc(50%+22px)]'}`}
        style={{ opacity: labelOpacity, y: labelY }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint">{era.year}</div>
        <div className="mt-0.5 text-[13px] font-semibold tracking-tight text-ink">{era.model}</div>
      </motion.div>
    </div>
  );
};

const SwaggerLine: React.FC<{ p: number; progress: MotionValue<number>; text: string; last: boolean }> = ({ p, progress, text, last }) => {
  // chaque punchline apparaît quand la jauge passe son point, puis s'efface
  const opacity = useTransform(
    progress,
    last ? [p - 0.05, p - 0.01, 1] : [p - 0.05, p - 0.01, p + 0.05, p + 0.09],
    last ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, [p - 0.05, p - 0.01], [14, 0]);
  return (
    <motion.span className="absolute inset-x-0 top-0 block" style={{ opacity, y }} aria-hidden>
      {text}
    </motion.span>
  );
};

const TimelineEra: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const fill = useTransform(scrollYProgress, [0.02, 0.96], [0, 1]);
  const pct = useTransform(scrollYProgress, (v) => `${Math.round(Math.min(1, Math.max(0, (v - 0.02) / 0.94)) * 100)}%`);

  // Fallback reduced-motion / lisibilité : version statique empilée
  if (reduce) {
    return (
      <section className="border-t border-hairline bg-bg-subtle px-6 py-20">
        <div className="mx-auto max-w-container">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">Veille · R&amp;D permanente</div>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-semibold tracking-[-0.02em] text-ink">On était là.</h2>
          <p className="mt-3 max-w-xl text-muted">Depuis GPT-3, on suit — et on déploie — chaque modèle en avance sur le marché.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {ERAS.map((e) => (
              <li key={e.model} className="flex items-baseline gap-3 border-t border-hairline pt-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-faint">{e.year}</span>
                <span className="font-semibold text-ink">{e.model}</span>
                <span className="ml-auto text-sm text-muted">{e.swagger}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const positions = ERAS.map((_, i) => (i + 0.5) / ERAS.length);

  return (
    <section ref={ref} className="relative border-t border-hairline bg-bg-subtle" style={{ height: '340vh' }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6">
        <div className="mx-auto w-full max-w-container">
          {/* header */}
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-5 items-center justify-center rounded border border-hairline bg-surface px-1.5 font-mono text-[11px] text-accent">↑</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">Veille · R&amp;D permanente</span>
              </div>
              <h2 className="text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-ink">
                On était{' '}
                <span className="relative inline-block align-baseline" style={{ minWidth: '4.2em' }}>
                  <span className="font-serif italic text-accent">là.</span>
                  {/* swagger défilant */}
                  <span className="pointer-events-none absolute left-0 top-full mt-2 block h-8 w-full whitespace-nowrap text-[clamp(1rem,2.2vw,1.6rem)] font-normal not-italic text-muted">
                    {ERAS.map((e, i) => (
                      <SwaggerLine key={e.model} p={positions[i]} progress={scrollYProgress} text={e.swagger} last={i === ERAS.length - 1} />
                    ))}
                  </span>
                </span>
              </h2>
            </div>
            <div className="hidden text-right sm:block">
              <motion.div className="font-mono text-3xl font-semibold tracking-tight text-ink md:text-4xl">{pct}</motion.div>
              <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-faint">d'avance</div>
            </div>
          </div>

          {/* rail */}
          <div className="relative mt-28 md:mt-32">
            <div className="relative h-px w-full bg-hairline-strong">
              <motion.div className="absolute inset-y-0 left-0 h-px bg-accent" style={{ scaleX: fill, transformOrigin: 'left' }} />
            </div>
            <div className="absolute inset-x-0 top-0 flex -translate-y-1/2">
              {ERAS.map((e, i) => (
                <Dot key={e.model} p={positions[i]} progress={scrollYProgress} era={e} i={i} />
              ))}
            </div>
          </div>

          <p className="mt-24 max-w-md font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-faint md:mt-28">
            Chaque modèle majeur, testé et déployé chez nos clients — souvent avant que le marché n'en parle.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TimelineEra;
