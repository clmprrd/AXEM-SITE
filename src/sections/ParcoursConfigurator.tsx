import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Eyebrow, FadeUp } from './primitives';
import { usePlayground, Priority, PathBrick, fmtEuro } from './store';

// =====================================================================
// §6 — PARCOURS CONFIGURATOR. « Dites-nous où vous en êtes. »
// 3 questions jouables (équipe / urgence / niveau IA) → assemble en direct
// un parcours visuel (briques qui s'empilent) + fourchette de modules
// formation 200–1250 €. Alimente le store (priority → pré-remplit §11).
// =====================================================================

type Q = { key: string; label: string; options: { id: string; label: string }[] };
const QUESTIONS: Q[] = [
  { key: 'equipe', label: 'Mon équipe est…', options: [
    { id: 'solo', label: 'Moi / très petite (1–5)' },
    { id: 'pme', label: 'Une PME (6–30)' },
    { id: 'eti', label: 'Une ETI / grand compte (30+)' },
  ]},
  { key: 'urgence', label: 'Mon urgence est…', options: [
    { id: 'former', label: 'Monter mes équipes en compétence' },
    { id: 'automatiser', label: 'Automatiser des tâches qui pèsent' },
    { id: 'produire', label: 'Lancer un outil IA sur-mesure' },
  ]},
  { key: 'niveau', label: 'Mon niveau IA est…', options: [
    { id: 'debut', label: 'Débutant — on découvre' },
    { id: 'inter', label: 'Intermédiaire — on bricole déjà' },
    { id: 'avance', label: 'Avancé — on veut industrialiser' },
  ]},
];

// mapping réponses → briques de parcours
function buildPath(eq: string, urg: string, niv: string): { bricks: PathBrick[]; priority: Priority; min: number; max: number } {
  const bricks: PathBrick[] = [{ id: 'audit', label: 'Audit & cadrage' }];
  let priority: Priority = 'conseil';

  if (urg === 'former') { bricks.push({ id: 'formation', label: 'Formation sur-mesure' }); priority = 'former'; }
  if (urg === 'automatiser') { bricks.push({ id: 'deploiement', label: 'Déploiement n8n · Make · Claude Code' }); priority = 'automatiser'; }
  if (urg === 'produire') { bricks.push({ id: 'production', label: 'Production IA sur-mesure' }); priority = 'produire'; }

  if (niv === 'debut') bricks.push({ id: 'init', label: 'Module IA Essentielle' });
  if (niv === 'inter') bricks.push({ id: 'pro', label: 'Module Maîtriser Claude / Prompting Pro' });
  if (niv === 'avance') bricks.push({ id: 'archi', label: 'Module No-Code & Workflows / Agents' });

  bricks.push({ id: 'suivi', label: 'Suivi — on reste' });

  // fourchette modules formation selon équipe + niveau
  let min = 300, max = 800;
  if (niv === 'inter') { min = 450; max = 950; }
  if (niv === 'avance') { min = 800; max = 1250; }
  if (eq === 'solo') { min = 200; }
  return { bricks, priority, min, max };
}

const ParcoursConfigurator: React.FC = () => {
  const reduce = useReducedMotion();
  const pg = usePlayground();
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const complete = QUESTIONS.every((q) => answers[q.key]);

  const result = React.useMemo(() => {
    if (!complete) return null;
    return buildPath(answers.equipe, answers.urgence, answers.niveau);
  }, [answers, complete]);

  // pousse le parcours configuré dans le store (pré-remplit §10 récap + §11 form)
  React.useEffect(() => {
    if (result) pg.setPath(result.bricks, result.priority);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <section id="configurateur" className="section-clip relative px-5 py-[clamp(110px,16vh,220px)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <FadeUp><Eyebrow>Le configurateur</Eyebrow></FadeUp>
          <FadeUp delay={0.06}>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.6vw, 72px)' }}>
              Dites-nous où vous en êtes.<br /><span className="aurora-text italic">On dessine votre chemin.</span>
            </h2>
          </FadeUp>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6">
          {/* QUESTIONS */}
          <FadeUp delay={0.05}>
            <div className="glass flex h-full flex-col gap-7 rounded-3xl p-7 md:p-9">
              {QUESTIONS.map((q) => (
                <div key={q.key}>
                  <span className="text-[13px] font-medium text-cream-soft">{q.label}</span>
                  <div className="mt-3 flex flex-col gap-2">
                    {q.options.map((o) => {
                      const on = answers[q.key] === o.id;
                      return (
                        <button key={o.id}
                          onClick={() => setAnswers((a) => ({ ...a, [q.key]: o.id }))}
                          aria-pressed={on}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14px] leading-tight transition-[border-color,background-color] duration-200 [transition-timing-function:var(--ease-out)] [touch-action:manipulation] ${
                            on ? 'border-green/55 bg-green/[0.10] text-cream' : 'border-green/15 bg-white/[0.015] text-cream-soft hover:border-green/35 hover:text-cream'
                          }`}>
                          <span aria-hidden className={`h-3.5 w-3.5 shrink-0 rounded-full border ${on ? 'border-green bg-green' : 'border-green/40'}`} />
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* PARCOURS ASSEMBLÉ — briques qui s'empilent */}
          <FadeUp delay={0.12}>
            <div className="glass-strong flex h-full flex-col rounded-3xl p-7 md:p-9">
              <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.16em] text-cyan">Votre parcours sur-mesure</span>

              {!complete && (
                <div className="mt-6 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-green/20 px-6 py-12 text-center">
                  <p className="text-[14px] leading-relaxed text-cream-dim">
                    Répondez aux 3 questions → vos briques s'empilent ici, en direct.
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2.5">
                <AnimatePresence mode="popLayout">
                  {result?.bricks.map((b, i) => (
                    <motion.div key={b.id} layout
                      initial={reduce ? { opacity: 0.001 } : { opacity: 0.001, y: 14, scale: 0.98 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                      transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 320, damping: 38, delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-2xl border border-green/22 bg-gradient-to-r from-green/[0.10] to-cyan/[0.05] px-4 py-3.5">
                      <span className="font-serif-display text-xl text-green/70 tnum">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[14.5px] text-cream">{b.label}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {result && (
                <motion.div
                  initial={reduce ? { opacity: 1 } : { opacity: 0.001, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 flex items-end justify-between gap-4 border-t border-green/12 pt-5">
                  <div>
                    <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.12em] text-cream-dim">Fourchette modules formation</span>
                    <div className="font-serif-display mt-1 text-3xl text-cream">
                      {fmtEuro(result.min)} – {fmtEuro(result.max)}
                    </div>
                    <span className="text-[12px] text-cream-dim">/ personne · 3 niveaux</span>
                  </div>
                  <span className="rounded-full border border-green/25 bg-green/[0.06] px-3 py-1.5 text-[11.5px] font-satoshi font-bold uppercase tracking-[0.1em] text-cream">Enregistré ✓</span>
                </motion.div>
              )}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default ParcoursConfigurator;
