import React from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';
import { MagneticButton, AnimatedCount, ScrollRevealWords, MarqueeLogos } from './ui/wow';

// === HERO V1 — "CONTRARIAN MANIFESTO" ===
// Inspiration : AE Studio ("We love hard problems") + Section AI ("You bought AI. That was the easy part.") + Sana Labs (text-only + logos)
// Pattern : Hero text-only sobre + logos clients RÉELS en social proof immédiat + 3 chiffres XL.
// Pourquoi ça convertit :
// - Pain reveal (les PoC qui dorment) + retournement → marqueur émotionnel #1 dans le SaaS B2B 2026
// - Le silence visuel + la phrase qui claque = signal d'élite (anti-aurora-WebGL clichée)
// - Logos AVANT le scroll = trust signal = +84-270% conv (Thunderclap)
// - 3 stats XL animés = autorité chiffrée instantanée (Mercury/Replit pattern)
const Hero: React.FC = () => {
  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-20"
      aria-label="AXEM IA — Hero Manifesto"
    >
      {/* Background ultra-sobre : juste un halo et une grid légère */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <motion.div
          className="absolute left-1/2 top-[30%] h-[55vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px]"
          style={{ background: 'radial-gradient(closest-side, #00FA9A, transparent)' }}
          animate={{ opacity: [0.08, 0.16, 0.10] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: '140px 140px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1100px]">
        {/* Eyebrow contrarian */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center gap-3"
        >
          <motion.span
            className="h-2 w-2 bg-[#00FA9A]"
            animate={{ boxShadow: ['0 0 0 #00FA9A', '0 0 14px #00FA9A', '0 0 0 #00FA9A'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
            <EditableText value="Agence IA · Qualiopi · Paris" storageKey="hero_eyebrow" />
          </span>
        </motion.div>

        {/* === LA PHRASE QUI CLAQUE === */}
        {/* Pattern : pain reveal + retournement. Pas de hook marketing, pas de "L'IA pour les entreprises". */}
        {/* Inspi Section AI verbatim : "You bought AI. That was the easy part." */}
        <h1 className="font-display text-[clamp(40px,7vw,128px)] font-light leading-[1.05] tracking-[-0.04em] text-white">
          <ScrollRevealWords
            text="La plupart des agences IA vendent des PoC."
            className="block"
            brightClass="text-white/40"
            dimClass="text-white/10"
          />
          <motion.span
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-2 block"
          >
            <EditableText value="Nous, on livre du" storageKey="hero_v1_line2_start" />{' '}
            <span className="font-playfair italic font-normal text-[#00FA9A]">
              <EditableText value="déployé." storageKey="hero_v1_line2_accent" />
            </span>
          </motion.span>
        </h1>

        {/* Sous-titre opérationnel */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-10 max-w-2xl text-xl font-light leading-snug text-neutral-400 md:text-2xl"
        >
          <EditableText
            value="Audit, formation Qualiopi, conseil et production IA — sous un seul toit. Pas de slide. Du code en production, en jours."
            storageKey="hero_v1_subtitle"
            isTextarea
            className="w-full"
          />
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
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
            <span className="relative">Réserver un diagnostic gratuit</span>
            <span className="relative">→</span>
          </MagneticButton>
          <a
            href="#realisations"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-300 underline-offset-4 hover:text-white hover:underline"
          >
            Voir nos cas clients (Carrefour · Blackfin · KIT)
            <span className="opacity-60">→</span>
          </a>
        </motion.div>

        {/* === 3 CHIFFRES XL — autorité instantanée (pattern Mercury) === */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3 }}
          className="mt-20 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-12 md:gap-12"
        >
          <div>
            <div className="font-display text-5xl font-light text-[#00FA9A] md:text-7xl">
              +<AnimatedCount value={55000} />
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              abonnés LinkedIn cumulés
            </div>
          </div>
          <div>
            <div className="font-display text-5xl font-light text-[#00FA9A] md:text-7xl">
              <AnimatedCount value={0} />
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              PoC sans suite livré
            </div>
          </div>
          <div>
            <div className="font-display text-5xl font-light text-[#00FA9A] md:text-7xl">
              <AnimatedCount value={12} />
              <span className="text-2xl md:text-3xl">mois+</span>
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              durée moyenne partenariat
            </div>
          </div>
        </motion.div>

        {/* === MARQUEE LOGOS CLIENTS — social proof juste sous l'accroche === */}
        {/* Pattern Sana Labs : le visuel hero EST les logos clients, pas une illustration. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="mt-16"
        >
          <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            <span className="h-px w-8 bg-neutral-700" />
            Ils nous ont fait confiance
            <span className="h-px flex-1 bg-neutral-800" />
          </div>
          <MarqueeLogos
            logos={['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos Services', 'Gravotech', 'Cegos', 'myconnecting', 'synapse ia', 'ASphere', 'SENZA']}
            speed={38}
            itemClassName="font-display text-2xl font-light text-neutral-400/85 tracking-tight"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
