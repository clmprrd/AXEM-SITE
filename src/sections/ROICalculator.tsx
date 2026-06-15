import React from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { PlaySlider, LiveNumber, Eyebrow, FadeUp } from './primitives';
import { usePlayground, SECTORS, sectorByKey, fmtEuro, fmtNum, scrollToId } from './store';

// =====================================================================
// §3 — ROI CALCULATOR ⭐ LE WOW.
// « Construisez votre business case. Maintenant. »
// Dropdown secteur + 2 curseurs (équipe, heures/sem) → une FACTURE INVERSÉE
// se remplit ligne par ligne : heures gagnées/mois → € économisés/an → ROI.
// Bouton « Verrouiller mon chiffre » → scrolle vers le mini-form en pré-
// remplissant le secteur. Message taquin aux extrêmes.
// Alimente le store partagé (sector / teamSize / hoursPerWeek / locked).
// =====================================================================

const InvoiceLine: React.FC<{
  index: number; label: string; sub?: string;
  value: React.ReactNode; emphasis?: boolean; reduce: boolean;
}> = ({ index, label, sub, value, emphasis, reduce }) => (
  <motion.div
    initial={reduce ? { opacity: 0.001 } : { opacity: 0.001, x: -18 }}
    whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.6 }}
    transition={reduce ? { duration: 0.3, delay: index * 0.12 } : { type: 'spring', stiffness: 320, damping: 60, delay: index * 0.12 }}
    className={`flex items-end justify-between gap-4 py-4 ${emphasis ? '' : 'border-b border-green/10'}`}>
    <div className="min-w-0">
      <div className={`leading-tight ${emphasis ? 'font-serif-display text-xl text-cream md:text-2xl' : 'text-[14px] font-medium text-cream-soft'}`}>
        {label}
      </div>
      {sub && <div className="mt-0.5 text-[11.5px] leading-snug text-cream-dim">{sub}</div>}
    </div>
    <div className={`shrink-0 text-right font-serif-display leading-none text-cream ${emphasis ? '' : ''}`}
      style={{ fontSize: emphasis ? 'clamp(36px, 7vw, 60px)' : 'clamp(22px, 4vw, 30px)' }}>
      {value}
    </div>
  </motion.div>
);

const ROICalculator: React.FC = () => {
  const reduce = useReducedMotion();
  const pg = usePlayground();
  const sector = sectorByKey(pg.sector);

  // message taquin aux extrêmes
  const extreme = pg.teamSize >= 45 && pg.hoursPerWeek >= 26;
  const [pulse, setPulse] = React.useState(false);
  React.useEffect(() => { setPulse(true); const t = setTimeout(() => setPulse(false), 420); return () => clearTimeout(t); }, [pg.hoursSavedMonth, pg.euroSavedYear]);

  const handleLock = () => { pg.lock(); scrollToId('qualif'); };

  return (
    <section id="calculateur" className="section-clip relative px-5 py-[clamp(110px,16vh,220px)] md:px-8">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 -z-[1] h-[55vh] w-[55vh] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.16), transparent 65%)' }} />
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <FadeUp><Eyebrow>Le calculateur</Eyebrow></FadeUp>
          <FadeUp delay={0.06}>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 78px)' }}>
              Construisez votre<br /><span className="aurora-text italic">business case. Maintenant.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              Trois réglages, un chiffre. Pas une estimation marketing : les formules sont
              calées sur un ROI médian de 159 % observé sur nos missions.
            </p>
          </FadeUp>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
          {/* PANNEAU DE RÉGLAGES */}
          <FadeUp delay={0.05}>
            <div className="glass flex h-full flex-col gap-7 rounded-3xl p-7 md:p-9">
              {/* secteur */}
              <div>
                <span className="text-[13px] font-medium text-cream-soft">Votre secteur</span>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SECTORS.map((s) => {
                    const on = s.key === pg.sector;
                    return (
                      <button key={s.key} onClick={() => pg.setSector(s.key)}
                        aria-pressed={on}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[12.5px] leading-tight transition-[transform,border-color,background-color] duration-200 [transition-timing-function:var(--ease-out)] [touch-action:manipulation] ${
                          on ? 'border-green/60 bg-green/[0.10] text-cream' : 'border-green/15 bg-white/[0.015] text-cream-soft hover:border-green/35 hover:text-cream'
                        }`}>
                        <span aria-hidden className="text-base">{s.emoji}</span>
                        <span className="min-w-0">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <PlaySlider value={pg.teamSize} min={1} max={60} step={1}
                onChange={pg.setTeamSize}
                label="Personnes concernées"
                format={(v) => `${v}`} />

              <PlaySlider value={pg.hoursPerWeek} min={2} max={30} step={1}
                onChange={pg.setHoursPerWeek}
                label="Heures répétitives / semaine / personne"
                format={(v) => `${v} h`} accent="#38BDF8" />

              <div className="rounded-2xl border border-green/12 bg-white/[0.02] px-4 py-3 text-[12.5px] leading-relaxed text-cream-dim">
                Secteur <span className="text-cream-soft">{sector.label}</span> · coût horaire chargé estimé
                <span className="text-cream-soft"> {sector.hourlyCost} €</span> · part automatisable
                <span className="text-cream-soft"> {Math.round(sector.automatable * 100)} %</span>.
              </div>
            </div>
          </FadeUp>

          {/* FACTURE INVERSÉE */}
          <FadeUp delay={0.12}>
            <div className={`glass-strong relative flex h-full flex-col rounded-3xl p-7 md:p-9 transition-shadow duration-500 ${pulse && !reduce ? 'shadow-[0_0_0_1px_rgba(56,189,248,0.4),0_30px_80px_-30px_rgba(56,189,248,0.45)]' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.16em] text-cyan">Votre facture inversée</span>
                <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cream-dim">{sector.emoji} {sector.label}</span>
              </div>

              <div className="mt-4">
                <InvoiceLine index={0} reduce={!!reduce}
                  label="Heures gagnées / mois"
                  sub="équipe × heures répétitives × part automatisable"
                  value={<><LiveNumber value={pg.hoursSavedMonth} format={fmtNum} /><span className="ml-1 text-[0.5em] text-cream-soft">h</span></>} />
                <InvoiceLine index={1} reduce={!!reduce}
                  label="Valeur du temps libéré / an"
                  sub="estimation prudente — coefficient de réalisation appliqué"
                  value={<LiveNumber value={pg.euroSavedYear} format={fmtEuro} />} />
                <InvoiceLine index={2} reduce={!!reduce} emphasis
                  label="ROI médian constaté"
                  sub="sur nos missions — chiffre documenté, pas une projection"
                  value={<span className="aurora-text"><LiveNumber value={pg.roi} format={(v) => fmtNum(v)} /> %</span>} />
              </div>

              {/* message taquin aux extrêmes */}
              <AnimatePresence>
                {extreme && (
                  <motion.div
                    initial={reduce ? { opacity: 1 } : { opacity: 0.001, y: 8 }}
                    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 rounded-2xl border border-cyan/30 bg-cyan/[0.07] px-4 py-3 text-[13px] leading-snug text-cream">
                    Là, on va devoir vraiment se parler 😏
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button onClick={handleLock} className="btn btn-primary btn-lg">
                  <span className="btn-sweep" aria-hidden />
                  <span className="relative">{pg.locked ? 'Chiffre verrouillé' : 'Verrouiller mon chiffre'}</span>
                  <span className="btn-arrow relative" aria-hidden>→</span>
                </button>
                <span className="text-[12px] leading-snug text-cream-dim">
                  On part de ce chiffre lors de l'appel, pas de zéro.
                </span>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
