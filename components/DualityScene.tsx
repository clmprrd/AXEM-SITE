import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Proposition X — DUALITY SCENE
// Magazine spread éditoriale : Formation (gauche) vs Conseil & Production (droite)
// Pli central, scroll-locked, les deux pôles se rejoignent dans "AXEM IA" en bas
const DualityScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Subtle parallax on left/right columns (opposite directions)
  const yLeft = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const yRight = useTransform(scrollYProgress, [0, 1], [40, -40]);
  // Center fold grows as you scroll
  const foldScale = useTransform(scrollYProgress, [0.1, 0.55, 0.9], [0, 1, 0.95]);
  // Convergence indicator
  const convergeOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);

  return (
    <section id="dualite" ref={ref} className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#050505]">
      {/* Vertical fold line — animated grow */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY: foldScale, transformOrigin: 'top' }}
        className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#00FA9A]/40 to-transparent md:block"
      />

      <div className="mx-auto max-w-[1320px] px-6 py-24 md:py-40">
        {/* Section eyebrow */}
        <div className="mb-16 flex items-center justify-center gap-3">
          <span className="h-2 w-2 bg-[#00FA9A]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
            Notre offre · Deux mondes, un partenaire
          </span>
          <span className="h-2 w-2 bg-[#00FA9A]" />
        </div>

        {/* Massive editorial title */}
        <h2 className="mx-auto mb-20 max-w-5xl text-center font-display text-[clamp(40px,7vw,112px)] font-light leading-[1.02] tracking-[-0.035em] text-white">
          De l'<span className="font-playfair italic font-normal text-[#00FA9A]">audit</span> à la
          <br />
          <span className="font-playfair italic font-normal text-[#00FA9A]">montée en compétences</span>.
        </h2>

        {/* === TWO COLUMNS MAGAZINE SPREAD === */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
          {/* LEFT COLUMN — FORMATION */}
          <motion.article style={{ y: yLeft }} className="md:pr-12 lg:pr-20">
            <div className="mb-8 flex items-baseline justify-between border-b border-white/10 pb-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#00FA9A]">
                  Pôle 01
                </div>
                <div className="mt-3 font-display text-5xl font-light tracking-[-0.03em] text-white md:text-6xl">
                  <span className="font-playfair italic text-[#00FA9A]">Formation</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  Qualiopi
                </div>
                <div className="mt-1 font-mono text-xs text-[#00FA9A]">certifié</div>
              </div>
            </div>

            <p className="mb-10 max-w-md text-lg font-light leading-relaxed text-neutral-300">
              <span className="font-playfair italic text-[#00FA9A]">10 formations</span>,{' '}
              <span className="font-playfair italic text-[#00FA9A]">3 niveaux</span>,{' '}
              <span className="font-playfair italic text-[#00FA9A]">70 % de pratique</span>. Vos
              équipes opérationnelles dès J+1.
            </p>

            {/* Programme list */}
            <ul className="space-y-3">
              {[
                { code: 'F01', name: 'IA Essentielle', level: 'Socle', price: '300 €', duration: '1 j' },
                { code: 'F02', name: 'Prompt Engineering Pro', level: 'Socle', price: '200 €', duration: '½ j' },
                { code: 'F03', name: 'Maîtriser Claude', level: 'Socle', price: '450 €', duration: '1 j' },
                { code: 'F04', name: 'IA pour tous les métiers', level: 'Métiers', price: '400 €', duration: '1 j' },
                { code: 'F05', name: 'No-Code & Workflows', level: 'Automatisation', price: '800 €', duration: '2 j' },
                { code: 'F06', name: 'Agent IA sur-mesure', level: 'Automatisation', price: '1 250 €', duration: '2 j' },
                { code: 'F07', name: 'Vibe Coding & Claude Code', level: 'Automatisation', price: '450 €', duration: '1 j' },
                { code: 'F08', name: 'Gouvernance & AI Act', level: 'Transversal', price: '250 €', duration: '½ j' },
                { code: 'F09', name: 'Veille IA', level: 'Transversal', price: '80 €', duration: '2 h' },
                { code: 'F10', name: 'Création IA · Visuel · Vidéo · Voix', level: 'Production', price: '400 €', duration: '1 j' },
              ].map((f, i) => (
                <motion.li
                  key={f.code}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: [0.2, 0.8, 0.2, 1] }}
                  className="group grid grid-cols-12 items-baseline gap-3 border-b border-white/[0.04] py-3 transition-colors hover:bg-white/[0.015]"
                >
                  <span className="col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#00FA9A]">
                    {f.code}
                  </span>
                  <span className="col-span-6 text-[15px] text-white">{f.name}</span>
                  <span className="col-span-2 text-right text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    {f.duration}
                  </span>
                  <span className="col-span-2 text-right font-display text-base font-light text-[#00FA9A]">
                    {f.price}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
              <span className="h-px w-8 bg-[#00FA9A]/40" />
              <span>+ Bootcamps immersifs sur devis · Formations vidéo 24/7</span>
            </div>
          </motion.article>

          {/* RIGHT COLUMN — CONSEIL & PRODUCTION */}
          <motion.article style={{ y: yRight }} className="md:pl-12 lg:pl-20 md:border-l md:border-white/[0.06]">
            <div className="mb-8 flex items-baseline justify-between border-b border-white/10 pb-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#00FA9A]">
                  Pôle 02
                </div>
                <div className="mt-3 font-display text-5xl font-light tracking-[-0.03em] text-white md:text-6xl">
                  <span className="font-playfair italic text-[#00FA9A]">Conseil</span> &{' '}
                  <span className="font-playfair italic text-[#00FA9A]">Production</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  Partenariat
                </div>
                <div className="mt-1 font-mono text-xs text-[#00FA9A]">12 mois+</div>
              </div>
            </div>

            <p className="mb-10 max-w-md text-lg font-light leading-relaxed text-neutral-300">
              De l'<span className="font-playfair italic text-[#00FA9A]">audit</span> au{' '}
              <span className="font-playfair italic text-[#00FA9A]">déploiement</span>. Un seul
              interlocuteur, du diagnostic à l'autonomie.
            </p>

            {/* Process list */}
            <ul className="space-y-3">
              {[
                { n: '01', name: 'Audit IA', desc: 'Diagnostic, cartographie, scoring de maturité', price: '1 à 4 sem.' },
                { n: '02', name: 'Conseil stratégique', desc: 'Roadmap priorisée, choix outils, plan d\'adoption', price: 'Sur devis' },
                { n: '03', name: 'Déploiement & automatisation', desc: 'n8n, Make, Claude Code — clé en main', price: 'À partir de 1 200 €' },
                { n: '04', name: 'Coaching individuel', desc: 'Référents, managers, dirigeants — sur mesure', price: '200 € / session' },
                { n: '05', name: 'Production IA', desc: 'Vidéos, voix, visuels, sites no-code, decks', price: 'Sur devis' },
                { n: '06', name: 'Suivi long terme', desc: 'Maintenance, évolutions, nouvelles opportunités', price: '80 € / mois' },
              ].map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                  className="group grid grid-cols-12 items-start gap-3 border-b border-white/[0.04] py-4 transition-colors hover:bg-white/[0.015]"
                >
                  <span className="col-span-2 font-display text-3xl font-light text-[#00FA9A]">
                    {s.n}
                  </span>
                  <div className="col-span-7">
                    <div className="text-[15px] text-white">{s.name}</div>
                    <div className="mt-1 text-xs leading-relaxed text-neutral-500">{s.desc}</div>
                  </div>
                  <span className="col-span-3 text-right text-[11px] uppercase tracking-[0.14em] text-[#00FA9A]/80">
                    {s.price}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
              <span className="h-px w-8 bg-[#00FA9A]/40" />
              <span>Automatisation : 1 200–2 000 € · Abonnement 900 € + 80 €/mois</span>
            </div>
          </motion.article>
        </div>

        {/* === CONVERGENCE — Les deux pôles se rejoignent === */}
        <motion.div
          style={{ opacity: convergeOpacity }}
          className="mt-32 text-center"
        >
          <div className="mx-auto mb-8 h-12 w-px bg-gradient-to-b from-[#00FA9A] to-transparent" />
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-neutral-500 mb-6">
            Convergence
          </div>
          <h3 className="font-display text-5xl font-light tracking-[-0.03em] text-white md:text-7xl">
            Deux experts,{' '}
            <span className="font-playfair italic text-[#00FA9A]">un seul</span>{' '}
            interlocuteur.
          </h3>
          <p className="mx-auto mt-6 max-w-xl text-base font-light text-neutral-400 md:text-lg">
            Pas de relais qui se perd entre équipes. Vous parlez à ceux qui livrent.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DualityScene;
