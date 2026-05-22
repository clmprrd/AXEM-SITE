import React, { useState } from 'react';
import EditableText from './ui/EditableText';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from './ui/wow';

type Audience = 'apprendre' | 'deployer';

// Proposition Z — "Audience Switcher Morph"
// Toggle hero : "Je veux apprendre" / "Je veux déployer"
// Tout le contenu, accent, CTA, stats, copy MORPH avec spring physics.
const Hero: React.FC = () => {
  const [audience, setAudience] = useState<Audience>('apprendre');

  // CONTENT PAR AUDIENCE
  const content = {
    apprendre: {
      accent: '#00FA9A',
      eyebrow: 'Pôle Formation · Qualiopi',
      titleStart: 'Vos équipes',
      titleAccent: 'opérationnelles',
      titleEnd: 'dès J+1.',
      subtitle: '10 formations Qualiopi · 3 niveaux · 70 % pratique. Inter ou intra. Financement OPCO via portage IZY for pro.',
      stats: [
        { v: '10', l: 'formations' },
        { v: '3', l: 'niveaux' },
        { v: '70 %', l: 'de pratique' },
        { v: 'J+1', l: 'opérationnel' },
      ],
      ctaPrimary: { label: 'Voir le catalogue', href: '#formations' },
      ctaSecondary: { label: 'Diagnostic 30 min', href: 'https://calendly.com/clem-pred/30min' },
      sidebar: [
        { code: 'F01', name: 'IA Essentielle', price: '300 €' },
        { code: 'F03', name: 'Maîtriser Claude', price: '450 €' },
        { code: 'F06', name: 'Agent IA sur-mesure', price: '1 250 €' },
      ],
    },
    deployer: {
      accent: '#A78BFA',
      eyebrow: 'Pôle Conseil & Production · 12 mois+',
      titleStart: "L'IA",
      titleAccent: 'livrée',
      titleEnd: ", pas installée.",
      subtitle: 'Audit → Conseil → Déploiement → Coaching → Production → Suivi. Un seul interlocuteur, de l\'audit à l\'autonomie.',
      stats: [
        { v: '1–4 sem', l: 'durée audit' },
        { v: '6', l: 'étapes du parcours' },
        { v: '100 %', l: 'livrable mesuré' },
        { v: '12 mois+', l: 'partenariat moyen' },
      ],
      ctaPrimary: { label: 'Réserver un audit', href: 'https://calendly.com/clem-pred/30min' },
      ctaSecondary: { label: 'Voir la méthode', href: '#parcours' },
      sidebar: [
        { code: '01', name: 'Audit IA', price: '1–4 sem.' },
        { code: '03', name: 'Déploiement & auto.', price: '1 200 €+' },
        { code: '07', name: 'Suivi long terme', price: '80 €/mois' },
      ],
    },
  };

  const c = content[audience];

  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-24"
      aria-label="AXEM IA — Audience Switcher Hero"
    >
      {/* === DYNAMIC BACKGROUND that morphs with audience === */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background:
            audience === 'apprendre'
              ? 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(0,250,154,0.22), transparent 70%), #050505'
              : 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(167,139,250,0.22), transparent 70%), #050505',
        }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />

      <div className="mx-auto w-full max-w-[1280px]">
        {/* === AUDIENCE SWITCHER TOGGLE === */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-12 inline-flex"
        >
          <div className="relative inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
            {/* sliding pill */}
            <motion.div
              layoutId="audience-pill"
              className="absolute h-[calc(100%-12px)] rounded-full shadow-[0_0_30px_-8px_currentColor]"
              style={{
                background: c.accent,
                color: c.accent,
                width: '50%',
                left: audience === 'apprendre' ? '6px' : 'calc(50% - 6px)',
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            />
            <button
              onClick={() => setAudience('apprendre')}
              className={`relative z-10 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                audience === 'apprendre' ? 'text-[#050505]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span className="text-base">🎓</span>
              Je veux apprendre
            </button>
            <button
              onClick={() => setAudience('deployer')}
              className={`relative z-10 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                audience === 'deployer' ? 'text-[#050505]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span className="text-base">🚀</span>
              Je veux déployer
            </button>
          </div>
        </motion.div>

        {/* === CONTENT MORPH (key change triggers exit/enter) === */}
        <AnimatePresence mode="wait">
          <motion.div
            key={audience}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
          >
            {/* LEFT — main content */}
            <div className="lg:col-span-8">
              {/* Eyebrow */}
              <div className="mb-8 flex items-center gap-3">
                <motion.span
                  className="h-2 w-2"
                  style={{ background: c.accent }}
                  animate={{ boxShadow: [`0 0 0 ${c.accent}`, `0 0 12px ${c.accent}`, `0 0 0 ${c.accent}`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                  style={{ color: c.accent }}
                >
                  {c.eyebrow}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-[clamp(48px,8vw,128px)] font-light leading-[1.02] tracking-[-0.04em] text-white">
                <span className="block">
                  <EditableText value={c.titleStart} storageKey={`hero_${audience}_t1`} />
                </span>
                <span className="block font-playfair italic font-normal" style={{ color: c.accent }}>
                  <EditableText value={c.titleAccent} storageKey={`hero_${audience}_t2`} />
                </span>
                <span className="block">
                  <EditableText value={c.titleEnd} storageKey={`hero_${audience}_t3`} />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-neutral-300 md:text-xl">
                <EditableText value={c.subtitle} storageKey={`hero_${audience}_subtitle`} isTextarea />
              </p>

              {/* Stats */}
              <div className="mt-12 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
                {c.stats.map((s) => (
                  <div key={s.l} className="border-l-2 pl-4" style={{ borderColor: `${c.accent}55` }}>
                    <div className="font-display text-4xl font-light md:text-5xl" style={{ color: c.accent }}>
                      {s.v}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row">
                <MagneticButton
                  href={c.ctaPrimary.href}
                  target={c.ctaPrimary.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.ctaPrimary.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  strength={0.4}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold text-[#050505]"
                  style={{ background: c.accent, boxShadow: `0 0 40px -8px ${c.accent}` } as any}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <span className="relative">{c.ctaPrimary.label}</span>
                  <span className="relative">→</span>
                </MagneticButton>
                <a
                  href={c.ctaSecondary.href}
                  target={c.ctaSecondary.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.ctaSecondary.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-7 py-4 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.05]"
                >
                  {c.ctaSecondary.label}
                  <span className="opacity-60">→</span>
                </a>
              </div>
            </div>

            {/* RIGHT — context sidebar (3 items du parcours/catalogue) */}
            <div className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-white/10">
              <div className="mb-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                {audience === 'apprendre' ? 'Aperçu catalogue' : 'Aperçu parcours'}
              </div>
              <ul className="space-y-1">
                {c.sidebar.map((item, i) => (
                  <motion.li
                    key={item.code}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                    className="group flex items-baseline justify-between border-b border-white/[0.06] py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: c.accent }}>
                        {item.code}
                      </div>
                      <div className="mt-1 text-base text-white">{item.name}</div>
                    </div>
                    <div className="font-display text-base font-light" style={{ color: c.accent }}>
                      {item.price}
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 text-xs italic text-neutral-500">
                {audience === 'apprendre'
                  ? '+ 7 autres modules · Bootcamps immersifs sur devis'
                  : '+ Coaching individuel, Production IA, Maintenance long terme'}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;
