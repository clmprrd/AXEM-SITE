import React from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';
import { MagneticButton, AnimatedCount } from './ui/wow';

// === HERO V2 — "NUMERICAL PROMISE 30J vs 30M" ===
// Inspiration : Mercury.com (big numerical) + Slalom "AI in motion" + Section AI "30 days" type
// Pattern : titre split en 2 chiffres XL contrastés ("30 jours" vs "30 mois") + 3 piliers parcours animés
// Pourquoi ça convertit :
// - Marché FR sceptique = veut du chiffre. Le contraste "30 jours vs 30 mois" est viral (Harry Dry : falsifiable + visualisable)
// - "1 sprint, 1 ROI" rassure le CFO
// - Pattern Mercury : 1-3 chiffres XL >90px en accent color, animated count-up = autorité instantanée
const Hero: React.FC = () => {
  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-20"
      aria-label="AXEM IA — Hero Numerical Promise"
    >
      {/* Background sobre */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <motion.div
          className="absolute -left-32 top-1/3 h-[40vh] w-[40vw] rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(closest-side, #00FA9A, transparent)' }}
          animate={{ opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-20 bottom-1/4 h-[30vh] w-[30vw] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(closest-side, #FF6B6B, transparent)' }}
          animate={{ opacity: [0.05, 0.12, 0.06] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1280px]">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-center gap-3"
        >
          <motion.span
            className="h-2 w-2 bg-[#00FA9A]"
            animate={{ boxShadow: ['0 0 0 #00FA9A', '0 0 14px #00FA9A', '0 0 0 #00FA9A'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
            <EditableText value="Sprint IA · 4 semaines · ROI mesuré" storageKey="hero_eyebrow" />
          </span>
        </motion.div>

        {/* === HEADLINE SPLIT EN CHIFFRES === */}
        {/* Pattern Mercury : chiffres XL > tout le texte, contraste visuel = preuve avant promesse */}
        <h1 className="font-display text-[clamp(40px,7vw,128px)] font-light leading-[1.0] tracking-[-0.04em] text-white">
          <motion.span
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="block"
          >
            Vos équipes IA-opérationnelles en
          </motion.span>

          {/* Chiffre 30 jours en GROS vert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-3 flex flex-wrap items-baseline gap-x-6"
          >
            <span className="font-playfair italic font-normal text-[clamp(80px,14vw,220px)] leading-none text-[#00FA9A]">
              <AnimatedCount value={30} />
            </span>
            <span className="font-display text-[clamp(40px,6vw,96px)] font-light">jours.</span>
          </motion.div>

          {/* Contrast line "Pas en 30 mois." */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-4 block text-[clamp(28px,4vw,64px)] font-light text-neutral-500 line-through decoration-[#FF6B6B]/60 decoration-[3px]"
          >
            Pas en 30 mois.
          </motion.span>
        </h1>

        {/* Sous-titre opérationnel */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-12 max-w-2xl text-lg font-light leading-relaxed text-neutral-400 md:text-xl"
        >
          Formation Qualiopi <span className="text-neutral-300">+</span> déploiement réel sur vos
          outils (Claude, Gemini, n8n). 1 sprint, 1 ROI mesuré, 1 équipe autonome.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5 }}
          className="mt-12 flex flex-col items-start gap-4 sm:flex-row"
        >
          <MagneticButton
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            strength={0.4}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#00FA9A] px-8 py-4 text-sm font-semibold text-[#050505] shadow-[0_0_40px_-8px_rgba(0,250,154,0.6)]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative">Démarrer un sprint AXEM</span>
            <span className="relative">→</span>
          </MagneticButton>
          <a
            href="#dualite"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-7 py-4 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.05]"
          >
            Voir la méthode 4 étapes
            <span className="opacity-60">↓</span>
          </a>
        </motion.div>

        {/* === 3 PILIERS PARCOURS — Jour 0 / 15 / 30 === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            { jour: 'JOUR 0', t: 'Diagnostic', d: '30 min pour identifier 3 leviers IA rentables', icon: '01' },
            { jour: 'JOUR 1–15', t: 'Audit + Roadmap', d: 'Cartographie, scoring, plan d\'adoption priorisé', icon: '02' },
            { jour: 'JOUR 30', t: 'Équipes opérationnelles', d: 'Formation Qualiopi + 1 cas d\'usage en prod', icon: '03' },
          ].map((p, i) => (
            <motion.div
              key={p.jour}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -4, borderColor: 'rgba(0,250,154,0.3)' }}
              className="relative rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-6 transition-colors"
            >
              <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                {p.icon}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#00FA9A]">
                {p.jour}
              </div>
              <div className="mt-3 font-display text-2xl font-light tracking-tight text-white md:text-3xl">
                {p.t}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{p.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
