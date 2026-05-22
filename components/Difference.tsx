import React from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';
import { TiltCard, SpotlightCard, ScrollRevealWords } from './ui/wow';
import { Reveal } from './ui/InteractiveLayer';
import { Clock, Hammer, BarChart3, RefreshCw, User } from 'lucide-react';

// === FINAL AXEM — Difference ===
// 5 raisons concrètes (contenu PDF p15) en cards 3D tilt + spotlight
const Difference: React.FC = () => {
  const cards = [
    {
      n: '01',
      icon: Clock,
      t: 'Partenaire sur la durée',
      d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff, on reste engagés.",
      detail: '12 mois+ de partenariat moyen',
    },
    {
      n: '02',
      icon: Hammer,
      t: '70 % pratique minimum',
      d: 'Opérationnel dès J+1. Chaque formation produit un livrable réel utilisable.',
      detail: 'Livrables concrets, pas des slides',
    },
    {
      n: '03',
      icon: BarChart3,
      t: 'Résultats mesurés',
      d: 'ROI documenté sur chaque mission. Des livrables concrets, pas des slides.',
      detail: '5 cas clients · résultats publics',
    },
    {
      n: '04',
      icon: RefreshCw,
      t: 'Toujours à jour',
      d: 'Outils et méthodes 2025 / 2026. Le champ bouge vite, nos contenus aussi.',
      detail: 'Claude 4.6 · GPT-5.2 · Gemini 3',
    },
    {
      n: '05',
      icon: User,
      t: 'Un seul interlocuteur',
      d: 'Du diagnostic au déploiement. Pas de relais qui se perd entre équipes.',
      detail: 'Clément ou Alexis · directement',
    },
  ];

  return (
    <section className="relative border-t border-white/[0.06] bg-[#050505] py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-20 grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 md:col-span-3">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
              <span className="h-2 w-2 bg-[#00FA9A]" />
              <EditableText value="Pourquoi AXEM" storageKey="diff_badge" />
            </div>
          </Reveal>
          <div className="col-span-12 md:col-span-9">
            <ScrollRevealWords
              text="5 raisons concrètes de bosser avec nous."
              className="font-display text-4xl font-light leading-[1.05] tracking-[-0.03em] md:text-6xl lg:text-7xl"
              brightClass="text-white"
              dimClass="text-white/15"
            />
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-neutral-400 md:text-lg">
                Ce qui nous distingue de la masse des consultants IA. Aucune théorie superflue,
                que du livrable mesurable.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Cards : 5 rows avec tilt + spotlight + magnetic feel */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {cards.map((c, i) => {
            const Icon = c.icon;
            // Premier card en grande hauteur, alternance subtile
            const isPrimary = i === 0;
            return (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
                className={isPrimary ? 'md:col-span-2' : ''}
              >
                <TiltCard maxTilt={5}>
                  <SpotlightCard
                    spotlightColor="rgba(0,250,154,0.10)"
                    className={`group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-7 transition-all duration-300 hover:border-[#00FA9A]/30 ${
                      isPrimary ? 'md:p-10' : ''
                    }`}
                  >
                    <div className="flex h-full flex-col gap-5">
                      <div className="flex items-start justify-between">
                        {/* Big number Playfair italic vert */}
                        <span className="font-display text-5xl font-light leading-none text-[#00FA9A] md:text-6xl">
                          <EditableText value={c.n} storageKey={`diff_n_${c.n}`} />
                        </span>
                        {/* Icon in green pill */}
                        <motion.div
                          whileHover={{ rotate: 12, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 280, damping: 14 }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#00FA9A]/30 bg-[#00FA9A]/[0.08] text-[#00FA9A]"
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.2} />
                        </motion.div>
                      </div>

                      <div className="h-px w-10 bg-[#00FA9A]/40 transition-all duration-300 group-hover:w-20 group-hover:bg-[#00FA9A]" />

                      <h3 className={`font-display font-light tracking-[-0.03em] text-white ${isPrimary ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
                        <EditableText value={c.t} storageKey={`diff_t_${c.n}`} />
                      </h3>

                      <p className={`text-neutral-400 leading-relaxed ${isPrimary ? 'text-base md:text-lg' : 'text-sm'}`}>
                        <EditableText isTextarea value={c.d} storageKey={`diff_d_${c.n}`} />
                      </p>

                      <div className="mt-auto flex items-center gap-2 border-t border-white/[0.06] pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#00FA9A]/80">
                        <span className="font-playfair italic text-base normal-case">→</span>
                        <span>{c.detail}</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Difference;
