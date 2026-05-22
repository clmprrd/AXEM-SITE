import React from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';
import { MagneticButton, AnimatedCount, TiltCard, SpotlightCard } from './ui/wow';
import { ArrowUpRight, GraduationCap, Workflow, BarChart3, Sparkles } from 'lucide-react';

// === HERO V3 — "BENTO MULTI-STAKEHOLDER" ===
// Inspiration : Vercel.com + Resend.com + Linear.app (bento hero)
// Pattern : 6 cellules — titre dominant + 5 cards (Formation/Conseil/Métriques/Clients/Diagnostic CTA)
// Pourquoi ça convertit :
// - +31% time-on-page vs sections empilées (studiomeyer.io)
// - Multi-stakeholder : la home s'adresse direct à 4-6 décideurs B2B sans navigation
// - Scan 5s du COMEX : tous les pain points en une vue
// - TiltCard + SpotlightCard = interactivité sans cliché
const Hero: React.FC = () => {
  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-20"
      aria-label="AXEM IA — Hero Bento"
    >
      {/* Background : grid + halo respirant */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent)',
          }}
        />
        <motion.div
          className="absolute left-1/2 top-[18%] h-[55vh] w-[80vw] -translate-x-1/2 rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(closest-side, #00FA9A, transparent)' }}
          animate={{ opacity: [0.16, 0.30, 0.18], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1320px]">
        {/* === HEADLINE compact au-dessus du bento === */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-3"
        >
          <motion.span
            className="h-2 w-2 bg-[#00FA9A]"
            animate={{ boxShadow: ['0 0 0 #00FA9A', '0 0 14px #00FA9A', '0 0 0 #00FA9A'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
            <EditableText value="AXEM IA · Qualiopi" storageKey="hero_eyebrow" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-[clamp(36px,5.5vw,80px)] font-light leading-[1.05] tracking-[-0.035em] text-white max-w-4xl"
        >
          <EditableText value="Apprendre l'IA." storageKey="hero_v3_t1" />{' '}
          <EditableText value="Déployer l'IA." storageKey="hero_v3_t2" />{' '}
          <span className="font-playfair italic font-normal text-[#00FA9A]">
            <EditableText value="Un seul partenaire." storageKey="hero_v3_t3" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-neutral-400"
        >
          Le seul cabinet français à offrir <span className="text-white">formation Qualiopi</span> ET{' '}
          <span className="text-white">déploiement IA en production</span> sous le même toit.
        </motion.p>

        {/* === BENTO GRID (6 cellules) === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-6 md:grid-rows-2"
        >
          {/* CELLULE 1 — FORMATION (gros, 3 cols 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:col-span-3 md:row-span-2"
          >
            <TiltCard maxTilt={5} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(0,250,154,0.14)"
                className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#00FA9A]/[0.06] via-[#0E1410] to-[#0A0A0A] p-7 md:p-9"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00FA9A]/30 bg-[#00FA9A]/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#00FA9A]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Formation Qualiopi
                </div>
                <div className="font-display text-4xl font-light tracking-[-0.03em] text-white md:text-5xl">
                  <span className="font-playfair italic text-[#00FA9A]">10 formations.</span>
                  <br />
                  3 niveaux. 70 % pratique.
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-400 md:text-base">
                  De zéro à opérationnel en 1 journée. Inter ou intra, finançables OPCO via IZY for pro.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['F01 IA Essentielle', 'F03 Maîtriser Claude', 'F06 Agent IA', 'F07 Vibe Coding'].map((f) => (
                    <span
                      key={f}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <a
                  href="#formations"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00FA9A] hover:underline"
                >
                  Voir le catalogue · 10 modules
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          {/* CELLULE 2 — CONSEIL & PRODUCTION (2 cols 1 row, en haut droite) */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.88 }}
            className="md:col-span-2"
          >
            <TiltCard maxTilt={6} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(167,139,250,0.16)"
                className="group h-full rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#A78BFA]/[0.06] via-[#0F0F14] to-[#0A0A0A] p-6"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#A78BFA]/30 bg-[#A78BFA]/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A78BFA]">
                  <Workflow className="h-3.5 w-3.5" />
                  Conseil & Déploiement
                </div>
                <div className="font-display text-2xl font-light tracking-tight text-white md:text-3xl">
                  Audit → Production
                </div>
                <p className="mt-3 text-xs leading-relaxed text-neutral-400 md:text-sm">
                  6 étapes du diagnostic à l'autonomie. n8n · Make · Claude Code.
                </p>
                <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#A78BFA]">
                  À partir de 1 200 €
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          {/* CELLULE 3 — STAT LinkedIn (1 col, en haut droite) */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.96 }}
            className="md:col-span-1"
          >
            <TiltCard maxTilt={8} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(0,250,154,0.18)"
                className="h-full rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Audience
                </div>
                <div className="mt-3 font-display text-4xl font-light leading-none text-[#00FA9A] md:text-5xl">
                  +<AnimatedCount value={55000} />
                </div>
                <div className="mt-2 text-xs leading-relaxed text-neutral-400">
                  abonnés LinkedIn cumulés des fondateurs
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          {/* CELLULE 4 — CTA Diagnostic (2 cols, bas droite) */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.04 }}
            className="md:col-span-2"
          >
            <TiltCard maxTilt={5} className="h-full">
              <a
                href="https://calendly.com/clem-pred/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full items-end overflow-hidden rounded-3xl bg-[#00FA9A] p-6 text-[#050505] shadow-[0_0_40px_-8px_rgba(0,250,154,0.4)] transition-transform hover:scale-[1.01]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <div className="relative">
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-70">
                    Premier rdv
                  </div>
                  <div className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl">
                    Diagnostic gratuit
                  </div>
                  <div className="mt-1 text-sm font-medium">30 min · sans engagement</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold">
                    Réserver
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </a>
            </TiltCard>
          </motion.div>

          {/* CELLULE 5 — STAT Délai audit (1 col, bas droite) */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.12 }}
            className="md:col-span-1"
          >
            <TiltCard maxTilt={8} className="h-full">
              <SpotlightCard
                spotlightColor="rgba(252,211,77,0.16)"
                className="h-full rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Audit
                </div>
                <div className="mt-3 font-display text-4xl font-light leading-none text-white md:text-5xl">
                  1–4<span className="ml-1 text-2xl text-[#FCD34D] md:text-3xl">sem</span>
                </div>
                <div className="mt-2 text-xs leading-relaxed text-neutral-400">
                  diagnostic + roadmap livrable
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>
        </motion.div>

        {/* === Clients row sous le bento === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
            Ils nous ont fait confiance
          </span>
          {['Carrefour', 'Blackfin', 'Avantis', 'KIT France', 'Espace 2', 'Gravotech', 'Cegos'].map(
            (c) => (
              <span
                key={c}
                className="font-display text-lg font-light text-neutral-400 transition-colors hover:text-white"
              >
                {c}
              </span>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
