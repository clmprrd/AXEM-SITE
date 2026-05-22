import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight, Sparkles, Zap, Workflow, GraduationCap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { TiltCard, SpotlightCard, AnimatedCount } from './ui/wow';

// Direction C — Framer Bento Interactive (v3 WOW)
// Adds: 3D tilt on every bento card, spotlight cursor on each card, spring physics,
// stagger reveal on grid, animated counters, breathing dots.
const Hero: React.FC = () => {
  const cardEntry = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: 0.05 * i + 0.4, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
    }),
  };

  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-[#0A0A0A] px-6 pt-32 pb-20">
      {/* Subtle background grid + cursor-aware gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent 95%)',
        }}
      />
      {/* breathing color blob */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/4 -z-10 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, #5EEAD4, transparent)' }}
        animate={{ opacity: [0.08, 0.18, 0.1], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm">
            <motion.span
              className="flex h-1.5 w-1.5 rounded-full bg-[#A1FF6B]"
              animate={{ boxShadow: ['0 0 0px #A1FF6B', '0 0 12px #A1FF6B', '0 0 0px #A1FF6B'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Disponibilité Q2 2026
          </div>
        </motion.div>

        {/* Big title with stagger */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
          className="mx-auto max-w-5xl text-center text-[44px] font-medium leading-[1.04] tracking-[-0.035em] text-white sm:text-6xl md:text-7xl lg:text-[88px]"
        >
          {["L'IA d'entreprise,"].map((w) => (
            <motion.span
              key={w}
              variants={{ hidden: { opacity: 0, y: 20, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7 } } }}
              className="block"
            >
              {w}
            </motion.span>
          ))}
          <motion.span
            variants={{ hidden: { opacity: 0, y: 20, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7 } } }}
            className="block bg-gradient-to-r from-[#A1FF6B] via-[#5EEAD4] to-[#A78BFA] bg-clip-text text-transparent"
            style={{ backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            livrée comme un produit.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-7 max-w-2xl text-center text-base font-light leading-relaxed text-neutral-400 md:text-lg"
        >
          <EditableText
            value="Audit, agents IA, formations. Construit en jours. Mesuré en gain."
            storageKey="hero_subtitle"
            isTextarea
            className="w-full text-center"
          />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.03] hover:bg-neutral-100"
          >
            Réserver un audit
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </a>
          <a
            href="/realisations"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.06]"
          >
            Voir nos réalisations
            <ArrowUpRight className="h-4 w-4 opacity-60" />
          </a>
        </motion.div>

        {/* === BENTO GRID with TILT + SPOTLIGHT === */}
        <div className="mt-20 grid grid-cols-1 gap-3 md:grid-cols-6 md:grid-rows-2">
          {/* Big card */}
          <motion.div custom={0} variants={cardEntry} initial="hidden" animate="visible" className="col-span-1 row-span-2 md:col-span-3">
            <TiltCard maxTilt={6} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(161,255,107,0.18)"
                className="h-full rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#A1FF6B]/[0.08] via-[#0F1410] to-[#0A0A0A] p-7"
              >
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#A1FF6B]/15 text-[#A1FF6B]">
                      <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-2xl font-medium tracking-tight text-white md:text-3xl">
                      Quatre métiers,<br /> une seule équipe.
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-400 md:text-base">
                      Audit, conseil, formation, production. On gère l'IA bout en bout pour PME et grands groupes.
                    </p>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-2">
                    {[
                      { icon: BarChart3, label: 'Audit IA' },
                      { icon: Workflow, label: 'Agents' },
                      { icon: GraduationCap, label: 'Formation' },
                      { icon: Zap, label: 'Production' },
                    ].map(({ icon: Icon, label }, i) => (
                      <motion.div
                        key={label}
                        whileHover={{ y: -2, borderColor: 'rgba(161,255,107,0.4)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                      >
                        <Icon className="h-3.5 w-3.5 text-neutral-400" />
                        <span className="text-xs text-neutral-200">{label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          {/* Stat card 1 — audit delay */}
          <motion.div custom={1} variants={cardEntry} initial="hidden" animate="visible" className="col-span-1 md:col-span-2">
            <TiltCard maxTilt={8} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(94,234,212,0.22)"
                className="h-full rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#5EEAD4]/[0.08] via-[#0F1413] to-[#0A0A0A] p-6"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500" style={{ fontFamily: 'ui-monospace, monospace' }}>
                  Délai audit
                </div>
                <div className="mt-3 text-6xl font-medium tracking-tight text-white">
                  <AnimatedCount value={5} suffix="" />
                  <span className="text-[#5EEAD4]">j</span>
                </div>
                <div className="mt-2 text-sm text-neutral-400">Diagnostic complet livrable.</div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          {/* CTA card */}
          <motion.div custom={2} variants={cardEntry} initial="hidden" animate="visible" className="col-span-1">
            <TiltCard maxTilt={6} className="h-full">
              <SpotlightCard spotlightColor="rgba(255,255,255,0.10)" className="group relative h-full rounded-3xl border border-white/[0.08] bg-[#0E0E0E] p-6">
                <a
                  href="https://calendly.com/clem-pred/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label="Réserver"
                />
                <div className="flex h-full w-full items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500" style={{ fontFamily: 'ui-monospace, monospace' }}>Premier rdv</div>
                    <div className="mt-2 text-xl font-medium tracking-tight text-white">Gratuit · 30 min</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-neutral-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          {/* Stat card 2 */}
          <motion.div custom={3} variants={cardEntry} initial="hidden" animate="visible" className="col-span-1 md:col-span-2">
            <TiltCard maxTilt={8} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(167,139,250,0.22)"
                className="h-full rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#A78BFA]/[0.08] via-[#0F0F14] to-[#0A0A0A] p-6"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500" style={{ fontFamily: 'ui-monospace, monospace' }}>Communauté</div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-6xl font-medium tracking-tight text-white">
                    <AnimatedCount value={40000} suffix="" />
                    <span className="text-[#A78BFA]">+</span>
                  </span>
                </div>
                <div className="mt-2 text-sm text-neutral-400">Abonnés LinkedIn cumulés.</div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          {/* Clients card */}
          <motion.div custom={4} variants={cardEntry} initial="hidden" animate="visible" className="col-span-1">
            <TiltCard maxTilt={6} className="h-full">
              <SpotlightCard spotlightColor="rgba(252,211,77,0.18)" className="h-full rounded-3xl border border-white/[0.08] bg-[#0E0E0E] p-6">
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 mb-3" style={{ fontFamily: 'ui-monospace, monospace' }}>Clients</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm font-medium text-neutral-300">
                  <span>SNCF</span>
                  <span className="text-neutral-600">·</span>
                  <span>Capgemini</span>
                  <span className="text-neutral-600">·</span>
                  <span>EY</span>
                  <span className="text-neutral-600">·</span>
                  <span>BNP</span>
                  <span className="text-neutral-600">·</span>
                  <span>Orange</span>
                  <span className="text-neutral-600">·</span>
                  <span>SG</span>
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
