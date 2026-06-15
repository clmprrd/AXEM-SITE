import React from 'react';
import { motion, useReducedMotion, useInView, AnimatePresence } from 'framer-motion';
import Grainient from '../components/Grainient';
import { Eyebrow } from './primitives';
import { usePlayground, sectorByKey, PRIORITIES, Priority, fmtEuro, fmtNum } from './store';

// =====================================================================
// §11 — MINI QUALIF → CALENDLY. « 30 minutes. On part de votre chiffre. »
// Micro-form 3 champs (prénom · entreprise · select priorité) PRÉ-REMPLI
// avec le secteur choisi en §3. Chaque champ valide avec un check qui pulse.
// Puis Calendly inline responsive.
// Lit le store : secteur, heures/€, parcours configuré → réassurance contextuelle.
// =====================================================================

const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const AZUR = { color1: '#5B8CFF', color2: '#1E40AF', color3: '#05080F' } as const;

const Check: React.FC<{ ok: boolean }> = ({ ok }) => {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {ok && (
        <motion.span
          initial={reduce ? { opacity: 1 } : { scale: 0.4, opacity: 0.001 }}
          animate={reduce ? { opacity: 1 } : { scale: [0.4, 1.25, 1], opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0.2 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-green"
          aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      )}
    </AnimatePresence>
  );
};

const MiniQualifCTA: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const pg = usePlayground();
  const sector = sectorByKey(pg.sector);

  const [firstName, setFirstName] = React.useState('');
  const [company, setCompany] = React.useState('');
  // priorité pré-remplie depuis le configurateur (§6) si dispo
  const [priority, setPriority] = React.useState<Priority | ''>('');
  React.useEffect(() => { if (pg.priority) setPriority(pg.priority); }, [pg.priority]);

  const okName = firstName.trim().length >= 2;
  const okCompany = company.trim().length >= 2;
  const okPriority = priority !== '';
  const allOk = okName && okCompany && okPriority;

  return (
    <section id="qualif" ref={ref}
      className="section-clip relative isolate overflow-hidden bg-ink px-5 py-[clamp(110px,16vh,220px)] md:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Grainient className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.14} grainAmount={0.08} contrast={1.3}
          saturation={1.0} zoom={1.0} warpStrength={1.1} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(92% 92% at 50% 38%, rgba(7,11,22,0.42) 0%, rgba(7,11,22,0.72) 65%, rgba(7,11,22,0.93) 100%)' }} />

      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        {/* COLONNE GAUCHE — micro-form pré-rempli */}
        <div>
          <Eyebrow>30 minutes, offert</Eyebrow>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.6vw, 72px)' }}>
            On part de votre chiffre.<br /><span className="aurora-text italic">Pas de zéro.</span>
          </h2>

          {/* rappel contextuel du business case construit */}
          {(pg.locked || pg.hoursSavedMonth > 0) && (
            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-green/25 bg-green/[0.06] px-3.5 py-1.5 text-[12.5px] text-cream">
                {sector.emoji} {sector.label}
              </span>
              <span className="rounded-full border border-green/25 bg-green/[0.06] px-3.5 py-1.5 text-[12.5px] text-cream">
                {fmtNum(pg.hoursSavedMonth)} h/mois récupérables
              </span>
              <span className="rounded-full border border-cyan/30 bg-cyan/[0.06] px-3.5 py-1.5 text-[12.5px] text-cream">
                {fmtEuro(pg.euroSavedYear)}/an libérés · ROI médian {fmtNum(pg.roi)} %
              </span>
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col gap-3" aria-label="Mini qualification">
            <label className="relative block">
              <span className="sr-only">Prénom</span>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prénom" autoComplete="given-name"
                className="w-full rounded-2xl border border-green/20 bg-white/[0.03] px-4 py-3.5 pr-11 text-[15px] text-cream placeholder:text-cream-dim outline-none transition-colors focus:border-green/55" />
              <Check ok={okName} />
            </label>
            <label className="relative block">
              <span className="sr-only">Entreprise</span>
              <input value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder="Votre entreprise" autoComplete="organization"
                className="w-full rounded-2xl border border-green/20 bg-white/[0.03] px-4 py-3.5 pr-11 text-[15px] text-cream placeholder:text-cream-dim outline-none transition-colors focus:border-green/55" />
              <Check ok={okCompany} />
            </label>
            <label className="relative block">
              <span className="sr-only">Votre priorité</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
                className={`w-full appearance-none rounded-2xl border border-green/20 bg-white/[0.03] px-4 py-3.5 pr-11 text-[15px] outline-none transition-colors focus:border-green/55 ${priority ? 'text-cream' : 'text-cream-dim'}`}>
                <option value="" disabled className="bg-ink-2 text-cream-dim">Votre priorité…</option>
                {PRIORITIES.map((p) => (
                  <option key={p.key} value={p.key} className="bg-ink-2 text-cream">{p.label}</option>
                ))}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-cream-dim">▾</span>
              <Check ok={okPriority} />
            </label>

            <div className="mt-2 flex items-center gap-3 text-[13px] leading-snug">
              {allOk ? (
                <span className="text-green">✓ Parfait — choisissez un créneau à droite.</span>
              ) : (
                <span className="text-cream-dim">Renseignez ces 3 champs, puis réservez votre créneau.</span>
              )}
            </div>
          </form>

          <p className="mt-7 max-w-md text-[13px] leading-relaxed text-cream-dim">
            <span className="text-cream-soft">ROI documenté</span> · on reste jusqu'à l'autonomie · sans engagement.
          </p>
        </div>

        {/* COLONNE DROITE — Calendly inline */}
        <div className="glass-strong overflow-hidden rounded-3xl p-1.5 md:p-2">
          {inView ? (
            <iframe
              title="Réserver un créneau de 30 minutes"
              src={CALENDLY_EMBED}
              loading="lazy"
              className="h-[620px] w-full rounded-[20px] border-0 sm:h-[700px]" />
          ) : (
            <div className="h-[620px] w-full rounded-[20px] sm:h-[700px]" />
          )}
        </div>
      </div>
    </section>
  );
};

export default MiniQualifCTA;
