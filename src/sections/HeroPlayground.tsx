import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import Grainient from '../components/Grainient';
import { RiseWords, revealMount, revealWatermark } from '../ui/motion';
import { PlaySlider, LiveNumber, CurrentWire } from './primitives';
import { usePlayground, fmtNum, scrollToId } from './store';

// =====================================================================
// §1 — HERO PLAYGROUND. L'interaction EST l'accroche.
// Fond Grainient navy + watermark « A → Z ». Sous le titre : un GRAND
// curseur jouable « heures/semaine sur des tâches répétitives ». À droite
// un compteur live « → X h/mois récupérables » + un fil de courant qui
// pulse entre les deux. Le CTA apparaît en fondu dès qu'on bouge le curseur.
// =====================================================================
const AZUR = { color1: '#5B8CFF', color2: '#1E40AF', color3: '#05080F' } as const;
const NAVY = '#060912';

const HeroPlayground: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { hoursPerWeek, setHoursPerWeek } = usePlayground();
  const [touched, setTouched] = React.useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const wmYRaw = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const y = reduce ? '0%' : yRaw;
  const wmY = reduce ? '0%' : wmYRaw;

  // hypothèse hero : ~10 personnes, 70 % automatisable → h/mois récupérables
  const recovered = Math.round(hoursPerWeek * 10 * 4.33 * 0.7);

  const onSlide = (v: number) => { setHoursPerWeek(v); if (!touched) setTouched(true); };

  return (
    <section id="top" ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-32 text-center md:px-8">
      <motion.div aria-hidden style={{ y }} className="pointer-events-none absolute inset-0 z-0">
        <Grainient className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.13} grainAmount={0.085} contrast={1.32}
          saturation={1.0} zoom={1.05} warpStrength={1.15} />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(95% 85% at 50% 42%, rgba(6,9,18,0.32) 0%, rgba(6,9,18,0.64) 58%, rgba(6,9,18,0.93) 100%)' }} />
      <div aria-hidden className="grid-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[26%]"
        style={{ background: `linear-gradient(180deg, transparent, ${NAVY})` }} />
      <motion.div aria-hidden style={{ y: wmY }}
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
        <motion.span {...revealWatermark(0.2, !!reduce)}
          className="serif-watermark font-serif-display text-cream/[0.05]"
          style={{ fontSize: 'clamp(120px, 36vw, 540px)' }}>
          A → Z
        </motion.span>
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <motion.div {...revealMount(0.1, !!reduce)}
          className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-70" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="eyebrow text-[11px] text-cream">Votre partenaire IA <span className="text-cyan">×</span> de A à Z</span>
        </motion.div>

        <h1 aria-label="Votre partenaire IA, de A à Z."
          className="font-serif-display mt-7 leading-[0.92] tracking-[-0.02em] text-cream"
          style={{ fontSize: 'clamp(44px, 10vw, 110px)', transformPerspective: 1200 }}>
          <span aria-hidden>
            <RiseWords text="Votre partenaire IA," delay={0.3} stagger={0.08} />
            <br />
            <span className="aurora-solid italic inline-block">
              <RiseWords text="de A à Z." delay={0.55} stagger={0.09} />
            </span>
          </span>
        </h1>

        <motion.p {...revealMount(0.5, !!reduce)}
          className="mt-6 max-w-xl text-balance text-base leading-relaxed text-cream-soft md:text-lg">
          Tirez le curseur — voyez ce qu'on récupère.
        </motion.p>

        {/* TERRAIN DE JEU HERO — curseur ‖ fil de courant ‖ compteur live */}
        <motion.div {...revealMount(0.75, !!reduce)}
          className="mt-10 grid w-full max-w-3xl items-center gap-5 md:grid-cols-[1fr_auto_auto] md:gap-6">
          {/* curseur */}
          <div className="glass rounded-3xl p-6 text-left md:p-7">
            <PlaySlider
              value={hoursPerWeek} min={2} max={30} step={1}
              onChange={onSlide}
              label="Heures/semaine sur des tâches répétitives"
              format={(v) => `${v} h`} />
            <p className="mt-3 text-[12px] text-cream-dim">
              Par personne · pour une équipe type de ~10
            </p>
          </div>

          {/* fil de courant (caché sur mobile, vertical impraticable) */}
          <div aria-hidden className="hidden h-6 w-20 md:block">
            <CurrentWire active={touched} className="h-full w-full" />
          </div>

          {/* compteur live */}
          <div className="glass-strong rounded-3xl px-7 py-6 text-left">
            <div className="text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cyan">
              → récupérables
            </div>
            <div className="font-serif-display mt-1 leading-[0.9] text-cream"
              style={{ fontSize: 'clamp(48px, 9vw, 76px)' }}>
              <LiveNumber value={recovered} format={fmtNum} />
              <span className="ml-1 text-[0.42em] align-baseline text-cream-soft">h/mois</span>
            </div>
          </div>
        </motion.div>

        {/* CTA en fondu — apparaît dès qu'on touche le curseur */}
        <AnimatePresence>
          {(touched || reduce) && (
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0.001, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 320, damping: 60 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <button onClick={() => scrollToId('calculateur')}
                className="btn btn-primary btn-lg">
                <span className="btn-sweep" aria-hidden />
                <span className="relative">Réserver 30 min (offert)</span>
                <span className="btn-arrow relative" aria-hidden>→</span>
              </button>
              <button onClick={() => scrollToId('calculateur')}
                className="btn btn-secondary btn-lg">
                <span className="btn-underline">Construire mon business case</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {!touched && !reduce && (
          <p className="mt-8 text-[12px] text-cream-dim animate-pulse">Bougez le curseur pour commencer ↑</p>
        )}
      </div>
    </section>
  );
};

export default HeroPlayground;
