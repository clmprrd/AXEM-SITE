import React, { useRef } from 'react';
import {
  motion, useScroll, useTransform,
  useMotionValueEvent, useReducedMotion, MotionConfig,
} from 'framer-motion';
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — POC STORYTELLING « LIMITLESS × NAVY »
// Reprend le langage visuel/animation du template Framer "Limitless"
// (limitless.framer.photos) MAIS en DA bleu nuit (navy) existante.
//   noir+violet de Limitless ⇒ navy #070B16 + bleu #5B8CFF / cyan #38BDF8
// Structure : nav pilule flottante (auto-hide) → hero serif display géant →
//   Section A full-bleed Grainient + watermark serif parallax →
//   Section B manifeste reveals + 3 cartes glass → footer minimal.
// Motion : transform/opacity only · whileInView once · MotionConfig
//   reducedMotion="user" + gardes useReducedMotion · 60fps.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const ease = [0.16, 1, 0.3, 1] as const;
// Grainient — variante navy « azur » (brief)
const AZUR = { color1: '#5B8CFF', color2: '#1E40AF', color3: '#070C1A' } as const;

// ---------------------------------------------------------------------
// HELPER — Reveal mot-à-mot (mask + y). Au mount (animate) ou au scroll
// (whileInView once). Courbe Limitless [0.16,1,0.3,1]. Gardé en reduced motion.
// ---------------------------------------------------------------------
const RiseWords: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  onScroll?: boolean;
}> = ({ text, className = '', delay = 0, stagger = 0.07, onScroll = false }) => {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const anim = { y: '0%', opacity: 1 };
  const init = reduce ? anim : { y: '110%', opacity: 0 };
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => {
        const last = i === words.length - 1;
        const t = { duration: 0.7, delay: delay + i * stagger, ease };
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.06em]" aria-hidden>
            <motion.span
              className="inline-block will-change-transform"
              initial={init}
              {...(onScroll
                ? { whileInView: anim, viewport: { once: true, margin: '-12% 0px' } }
                : { animate: anim })}
              transition={t}>
              {w}{!last ? ' ' : ''}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

// Simple reveal bloc (opacity + y), scroll once
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; y?: number; className?: string }> =
  ({ children, delay = 0, y = 24, className }) => {
    const reduce = useReducedMotion();
    return (
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay, ease }}
        className={className}>{children}</motion.div>
    );
  };

// ---------------------------------------------------------------------
// NAV — pilule flottante centrée, frosted glass, auto-hide au scroll bas /
// réapparaît au scroll haut (useScroll + useMotionValueEvent).
// ---------------------------------------------------------------------
const NAV_LINKS: [string, string][] = [
  ['Formation', '#manifeste'], ['Conseil', '#manifeste'],
  ['Le duo', '#section-a'], ['Résultats', '#manifeste'],
];
const Nav: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);
  const last = useRef(0);
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (reduce) return;
    const prev = last.current;
    if (y > prev && y > 120) setHidden(true);       // scroll bas → cache
    else if (y < prev) setHidden(false);            // scroll haut → montre
    last.current = y;
  });
  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? '-160%' : '0%' }}
      transition={{ duration: 0.45, ease }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 will-change-transform md:top-6">
      <nav className="glass flex w-full max-w-3xl items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2 backdrop-blur-xl">
        <a href="#top" className="font-serif-display text-2xl leading-none tracking-tight text-cream [touch-action:manipulation]">
          AXEM<span className="aurora-text">.</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h}
              className="group relative text-[13px] font-medium text-cream-soft transition-colors [transition-timing-function:var(--ease-out)] hover:text-cream [touch-action:manipulation]">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-0 rounded-full bg-gradient-to-r from-green to-cyan transition-[width] duration-300 [transition-timing-function:var(--ease-out)] group-hover:w-full" />
            </a>
          ))}
        </div>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green to-cyan px-5 py-2.5 text-[13px] font-semibold text-[#06101F] shadow-[0_8px_24px_-10px_rgba(91,140,255,0.8)] transition-transform [transition-timing-function:var(--ease-out)] active:scale-[0.97] [touch-action:manipulation]">
          Réserver un appel
        </a>
      </nav>
    </motion.header>
  );
};

// ---------------------------------------------------------------------
// HERO — fond navy, gros breathing space. Badge eyebrow live · TITRE serif
// display géant (« de A à Z. » dégradé bleu→cyan) · sous-titre · double CTA.
// ---------------------------------------------------------------------
const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-36 text-center md:px-8">
      {/* quadrillage navy subtil */}
      <div aria-hidden className="grid-overlay pointer-events-none absolute inset-0 z-0" />
      {/* halo bleu d'ambiance derrière le titre */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(91,140,255,0.28), transparent 65%)' }} />
      {/* fondu bas vers la section suivante */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[22%]"
        style={{ background: 'linear-gradient(180deg, transparent, #070B16)' }} />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        {/* BADGE eyebrow — pilule glass + point live */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-70" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream">
            Agence d'IA <span className="text-cyan">×</span> Organisme de formation
          </span>
        </motion.div>

        {/* TITRE SERIF DISPLAY GÉANT — reveal mot-à-mot au mount */}
        <h1 aria-label="Votre partenaire IA, de A à Z."
          className="font-serif-display mt-8 leading-[0.92] tracking-[-0.02em] text-cream"
          style={{ fontSize: 'clamp(48px, 11vw, 120px)' }}>
          <span aria-hidden>
            <RiseWords text="Votre partenaire IA," stagger={0.08} />
            <br />
            <span className="aurora-solid inline-block">
              <RiseWords text="de A à Z." delay={0.3} stagger={0.09} />
            </span>
          </span>
        </h1>

        {/* sous-titre sobre */}
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85, ease }}
          className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-cream-soft md:text-xl">
          On forme vos équipes, on conseille votre stratégie, on déploie vos automatisations.
          <span className="text-cream"> Et on reste.</span>
        </motion.p>

        {/* DOUBLE CTA */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0, ease }}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-green to-cyan px-8 py-4 text-[15px] font-semibold text-[#06101F] shadow-[0_14px_44px_-12px_rgba(91,140,255,0.7)] transition-transform [transition-timing-function:var(--ease-out)] active:scale-[0.97] [touch-action:manipulation]">
            <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Réserver un appel</span>
            <span className="relative transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href="#manifeste"
            className="glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold text-cream transition-[transform,box-shadow] [transition-timing-function:var(--ease-out)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(91,140,255,0.35)] active:scale-[0.97] [touch-action:manipulation]">
            Voir nos résultats
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// SECTION A — full-bleed Grainient navy (le « verre iridescent » de Limitless).
// Watermark serif géant en parallax (useScroll + useTransform) · ligne serif ·
// scrim AA. Fallback : bg navy (bg-ink) + scrim si le WebGL sort noir (headless).
// ---------------------------------------------------------------------
const SectionA: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // parallax léger du watermark (neutralisé si reduced motion)
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const y = reduce ? '0%' : yRaw;

  return (
    <section id="section-a" ref={ref}
      className="relative isolate flex min-h-[90svh] items-center justify-center overflow-hidden bg-ink">
      {/* GRAINIENT plein cadre (fallback navy = bg-ink sous le canvas) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Grainient
          className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.16} grainAmount={0.08} contrast={1.35}
          saturation={1.05} zoom={0.95} warpStrength={1.2}
        />
      </div>
      {/* quadrillage subtil */}
      <div aria-hidden className="grid-overlay pointer-events-none absolute inset-0 z-[1]" />
      {/* SCRIM lisibilité (AA) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(80% 80% at 50% 50%, rgba(7,11,22,0.35) 0%, rgba(7,11,22,0.6) 60%, rgba(7,11,22,0.85) 100%)' }} />
      {/* WATERMARK serif géant en parallax */}
      <motion.div aria-hidden style={{ y }}
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
        <span className="serif-watermark font-serif-display text-cream/[0.07]"
          style={{ fontSize: 'clamp(120px, 34vw, 520px)' }}>
          de A à Z
        </span>
      </motion.div>

      {/* CONTENU — ligne serif éditoriale */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan">Le parcours AXEM</p>
        </Reveal>
        <Reveal delay={0.08} y={28}>
          <p className="font-serif-display mt-5 leading-[0.98] tracking-[-0.01em] text-cream"
            style={{ fontSize: 'clamp(40px, 7vw, 88px)' }}>
            De l'audit à <span className="aurora-text italic">l'autonomie.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// SECTION B — manifeste storytelling. Grande phrase serif qui se compose mot
// par mot au scroll (whileInView once) + 3 mini-cartes glass en stagger.
// ---------------------------------------------------------------------
const CARDS: { k: string; t: string; d: string }[] = [
  { k: '01', t: 'Formation', d: 'On forme vos équipes — Qualiopi, finançable OPCO. Opérationnel dès J+1.' },
  { k: '02', t: 'Conseil', d: "On cadre votre stratégie IA : audit, feuille de route, cas d'usage rentables." },
  { k: '03', t: 'Déploiement', d: "On déploie vos automatisations en production. Et on reste pour les faire vivre." },
];
const SectionB: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="manifeste" className="relative overflow-hidden px-5 py-28 md:px-8 md:py-40">
      {/* halo d'ambiance */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 -z-[1] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.18), transparent 65%)' }} />
      <div className="mx-auto max-w-5xl text-center">
        {/* GRANDE PHRASE serif — se compose mot par mot au scroll */}
        <h2 aria-label="On forme. On conseille. On déploie. Et on reste."
          className="font-serif-display leading-[1.02] tracking-[-0.01em] text-cream"
          style={{ fontSize: 'clamp(40px, 8vw, 104px)' }}>
          <span aria-hidden>
            <RiseWords text="On forme." onScroll stagger={0.09} />{' '}
            <RiseWords text="On conseille." onScroll delay={0.12} stagger={0.09} />{' '}
            <RiseWords text="On déploie." onScroll delay={0.26} stagger={0.09} />
            <br />
            <span className="aurora-text italic inline-block">
              <RiseWords text="Et on reste." onScroll delay={0.42} stagger={0.09} />
            </span>
          </span>
        </h2>

        {/* 3 mini-cartes glass — montent en stagger */}
        <div className="mt-20 grid gap-5 text-left md:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.div key={c.k}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease }}
              className="glass flex h-full flex-col gap-3 rounded-3xl p-7 transition-[transform,box-shadow] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:shadow-[0_22px_50px_-20px_rgba(91,140,255,0.4)] md:p-8">
              <span className="font-serif-display text-5xl text-green/40">{c.k}</span>
              <h3 className="font-serif-display text-3xl leading-none text-cream">{c.t}</h3>
              <p className="text-[15px] leading-relaxed text-cream-soft">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// FOOTER minimal — wordmark serif « AXEM. » + une ligne.
// ---------------------------------------------------------------------
const Footer: React.FC = () => (
  <footer className="relative border-t border-green/12 px-5 py-16 md:px-8">
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
      <a href="#top" className="font-serif-display text-5xl leading-none tracking-tight text-cream md:text-6xl">
        AXEM<span className="aurora-text">.</span>
      </a>
      <p className="text-sm text-cream-soft">
        Votre partenaire IA, de A à Z. <span className="text-cream-soft/70">© 2026 — Paris, France</span>
      </p>
    </div>
  </footer>
);

// ---------------------------------------------------------------------
// PAGE — POC
// ---------------------------------------------------------------------
const Home: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden text-cream"
        style={{ background: 'linear-gradient(180deg, #070B16 0%, #0B1020 55%, #0D1526 100%)' }}>
        <Nav />
        <main id="contenu">
          <Hero />
          <SectionA />
          <SectionB />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default Home;
