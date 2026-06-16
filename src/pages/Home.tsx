import React, { useRef } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValueEvent, useReducedMotion, useInView, MotionConfig,
} from 'framer-motion';
import Grainient from '../components/Grainient';
import { RiseWords, Reveal, CountUp, EASE, SPRING, reveal, revealMount } from '../ui/motion';
import { PrimaryButton, SecondaryButton, MagneticPrimary } from '../ui/Button';

// =====================================================================
// AXEM IA — SITE « STRUCTURE & SCROLL DE MORNINGSIDE, DA NAVY AXEM »
// On RÉPLIQUE les PATTERNS fonctionnels de morningside.ai :
//   1. <Reveal>          : fade-up dominant (opacity 0 / y 24 → in-view), once.
//   2. <PinnedSequence>  : ⭐ sticky-pin 450vh, 4 phrases en cross-fade pilotées
//                          par la progression du scroll (useScroll + useTransform).
//   3. <Marquee>         : boucle x:[0,-50%] linear infinite, contenu dupliqué,
//                          masques dégradés sur les bords, ralenti au hover.
//   + titres en dégradé clippé (#EAF0FF→#38BDF8), accordéon FAQ (hauteur animée
//     + icône +/−), hover boutons (flèche qui glisse), hover liens footer y:-5px.
// AUCUN texte / asset morningside : copy 100% AXEM original, DA navy AXEM,
// Instrument Serif display + sans corps, accents bleu/cyan, Grainient navy.
// MotionConfig reducedMotion="user" : pin → liste empilée, marquees figés,
// count-up direct. transform/opacity/SVG only. overflow-x clampé.
// =====================================================================

const ease = EASE;
const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const CASES_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

// PEAU MORNINGSIDE — Grainient : vert signature → dark-green → near-black.
// (remplace l'ancienne palette navy « azur »)
const AZUR = { color1: '#0cc481', color2: '#0f2a24', color3: '#050807' } as const;
const NAVY = '#080808';

// ---------------------------------------------------------------------
// PRIMITIVE 3 — <Marquee> : boucle x:[0,'-50%'] linear infinite, contenu
// DUPLIQUÉ (boucle sans couture), masques dégradés sur les bords (.ticker-mask),
// ralentit au hover. transform-only. reduced-motion → figé.
// ---------------------------------------------------------------------
const Marquee: React.FC<{
  duration?: number; reverse?: boolean; reduce: boolean;
  className?: string; gapClass?: string; children: React.ReactNode;
}> = ({ duration = 34, reverse = false, reduce, className = '', gapClass = 'gap-14 md:gap-20', children }) => {
  const [dur, setDur] = React.useState(duration);
  return (
    <div className={`ticker-mask group relative overflow-hidden ${className}`}>
      <motion.div
        className={`flex w-max items-center ${gapClass}`}
        animate={reduce ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={reduce ? undefined : { duration: dur, ease: 'linear', repeat: Infinity }}
        onMouseEnter={() => !reduce && setDur(duration * 2.6)}
        onMouseLeave={() => !reduce && setDur(duration)}>
        {children}
        {children}
      </motion.div>
    </div>
  );
};

// ---------------------------------------------------------------------
// SECTION HEADER — eyebrow réutilisé (puce + label uppercase).
// ---------------------------------------------------------------------
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="eyebrow mb-5 flex items-center gap-2.5 text-[11px] text-cyan">
    <span className="h-1.5 w-1.5 rounded-full bg-green" />{children}
  </div>
);

// =====================================================================
// 1. NAV — sticky pilule verre. Logo AXEM · Parcours · Cas clients · Formation
//    · Le duo · CTA « Réserver un appel ». Nav-glass : transparente en haut,
//    verre frosted navy au scroll (>80px). PAS d'auto-hide.
// =====================================================================
const NAV_LINKS: [string, string][] = [
  ['Parcours', '#parcours'], ['Cas clients', '#cas'],
  ['Formation', '#formation'], ['Le duo', '#duo'],
];
const Nav: React.FC = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 80;
    setScrolled((prev) => (prev === next ? prev : next));
  });
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6">
      <nav
        data-scrolled={scrolled ? 'true' : 'false'}
        className="nav-pill flex w-full max-w-3xl items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2">
        <a href="#top" className="link-limitless font-serif-display text-2xl leading-none tracking-tight text-cream hover:text-cream [touch-action:manipulation]">
          AXEM<span className="aurora-text">.</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h}
              className="group link-limitless relative text-[13px] font-medium text-cream-soft hover:text-cream [touch-action:manipulation]">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-0 rounded-full bg-gradient-to-r from-green to-cyan transition-[width] duration-300 [transition-timing-function:var(--ease-limitless)] group-hover:w-full" />
            </a>
          ))}
        </div>
        <SecondaryButton href={CALENDLY} external size="sm" className="!py-2.5">Réserver un appel</SecondaryButton>
      </nav>
    </header>
  );
};

// =====================================================================
// 2. HERO — plein écran. H1 dégradé « Votre partenaire IA, de A à Z. » +
//    sous-titre + marquee logos clients + double CTA. Fond Grainient navy.
// =====================================================================
const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const y = reduce ? '0%' : yRaw;
  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-36 text-center md:px-8">
      {/* Fond Grainient navy plein cadre */}
      <motion.div aria-hidden style={{ y }} className="pointer-events-none absolute inset-0 z-0">
        <Grainient
          className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.13} grainAmount={0.085} contrast={1.32}
          saturation={1.0} zoom={1.05} warpStrength={1.15}
        />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(95% 85% at 50% 42%, rgba(8,8,8,0.30) 0%, rgba(8,8,8,0.64) 58%, rgba(8,8,8,0.93) 100%)' }} />
      <div aria-hidden className="grid-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[28%]"
        style={{ background: `linear-gradient(180deg, transparent, ${NAVY})` }} />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        {/* CASCADE HERO (mount) — eyebrow .1 · H1 .3 · sous-titre .5 · boutons .7 */}
        <motion.div
          {...revealMount(0.1, !!reduce)}
          className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-70" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="eyebrow text-[11px] text-cream">
            Agence d'IA <span className="text-cyan">×</span> Formation
          </span>
        </motion.div>

        {/* H1 — caps Space Grotesk + dégradé signature morningside (blanc → vert) */}
        <h1 aria-label="Votre partenaire IA, de A à Z."
          className="font-serif-display mt-8 leading-[1.0] tracking-[0.02em] text-cream"
          style={{ fontSize: 'clamp(40px, 9.5vw, 104px)', transformPerspective: 1200 }}>
          <span aria-hidden>
            <RiseWords text="Votre partenaire IA," delay={0.3} stagger={0.08} />
            <br />
            <span className="aurora-solid inline-block">
              <RiseWords text="de A à Z." delay={0.55} stagger={0.09} />
            </span>
          </span>
        </h1>

        <motion.p
          {...revealMount(0.5, !!reduce)}
          className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-cream-soft md:text-xl">
          On forme vos équipes, on conseille votre stratégie, on déploie vos automatisations.
          <span className="text-cream"> Et on reste.</span>
        </motion.p>

        <motion.div
          {...revealMount(0.7, !!reduce)}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <PrimaryButton href={CALENDLY} external size="lg">Réserver un appel</PrimaryButton>
          <SecondaryButton href="#cas" size="lg">Voir les cas clients</SecondaryButton>
        </motion.div>
      </div>

      {/* MARQUEE LOGOS CLIENTS — bas du hero */}
      <motion.div {...revealMount(0.95, !!reduce)} className="relative z-10 mt-16 w-full max-w-5xl">
        <p className="eyebrow mb-6 text-[10px] tracking-[0.3em] text-cream-dim">Ils nous font confiance</p>
        <Marquee duration={32} reduce={!!reduce} gapClass="gap-12 md:gap-16">
          {LOGOS.map(([name, src], i) => (
            <span key={name + i} className="logo-chip shrink-0" title={name}>
              <img src={src} alt={name} loading="lazy"
                className="h-6 w-auto max-w-[130px] object-contain md:h-8" />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
};

const LOGOS: [string, string][] = [
  ['Carrefour', '/logos/carrefour.svg'],
  ['Blackfin', '/logos/blackfin.png'],
  ['Avantis', '/logos/avantis.png'],
  ['KIT France', '/logos/kit.png'],
  ['Espace 2', '/logos/espace2.png'],
  ['Socos', '/logos/socos.png'],
  ['Gravotech', '/logos/gravotech.png'],
];

// =====================================================================
// 3. WHY — ⭐ <PinnedSequence> 450vh : LE WOW de morningside, répliqué.
//    Wrapper h-[450vh] relative + enfant sticky top-0 h-screen flex items-center.
//    4 phrases superposées dont l'OPACITÉ cross-fade selon la progression du
//    scroll (useScroll sur le wrapper + useTransform par phrase : chaque phrase
//    visible sur son quart). La dernière (la chute) plus grosse.
//    MOBILE / reduced-motion : dégrade en simple liste empilée (PAS de pin).
// =====================================================================
const WHY_PHRASES: { text: React.ReactNode; big?: boolean }[] = [
  { text: <>Vos équipes sont « sensibilisées » à l'IA…<br className="hidden md:block" /> mais six mois plus tard, <span className="text-cream-dim">rien n'est en production.</span></> },
  { text: <>Des outils achetés sans stratégie.<br className="hidden md:block" /> L'IA reste un gadget que <span className="text-cream-dim">personne n'utilise vraiment.</span></> },
  { text: <>Le consultant part, les anciennes habitudes reviennent.<br className="hidden md:block" /> L'investissement <span className="text-cream-dim">s'évapore.</span></> },
  { text: <>C'est pour ça qu'on reste.<br className="hidden md:block" /> <span className="title-grad italic">De l'audit à l'autonomie.</span></>, big: true },
];

// Une phrase de la séquence pinned : son opacité (et une légère échelle/translation)
// est pilotée par la progression globale du scroll, sur son quart de fenêtre.
const PinnedPhrase: React.FC<{
  i: number; total: number; progress: any; phrase: typeof WHY_PHRASES[number];
}> = ({ i, total, progress, phrase }) => {
  // bornes du quart : [début-fade-in, plein, plein, fin-fade-out]
  const seg = 1 / total;
  const start = i * seg;
  const end = (i + 1) * seg;
  const fadeIn = start + seg * 0.18;
  const fadeOut = end - seg * 0.18;
  // dernière phrase : reste affichée jusqu'à la fin (pas de fade-out).
  const last = i === total - 1;
  const opacity = useTransform(
    progress,
    last ? [start, fadeIn, 1] : [start, fadeIn, fadeOut, end],
    last ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const yMv = useTransform(
    progress,
    last ? [start, fadeIn, 1] : [start, fadeIn, fadeOut, end],
    last ? [28, 0, 0] : [28, 0, 0, -28],
  );
  return (
    <motion.p
      style={{ opacity, y: yMv }}
      className={`font-serif-display absolute inset-x-0 mx-auto max-w-5xl px-6 text-center leading-[1.04] tracking-[0.02em] text-cream ${phrase.big ? '' : ''}`}>
      <span style={{ fontSize: phrase.big ? 'clamp(40px, 7.5vw, 96px)' : 'clamp(30px, 5vw, 64px)' }} className="block">
        {phrase.text}
      </span>
    </motion.p>
  );
};

const PinnedSequence: React.FC = () => {
  const reduce = useReducedMotion();
  const wrapper = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapper, offset: ['start start', 'end end'] });

  // reduced-motion : liste empilée verticale, pas de pin (toutes tailles).
  if (reduce) {
    return (
      <section id="why" className="section-clip relative px-5 py-[clamp(96px,16vh,200px)] md:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          <Eyebrow>Le constat</Eyebrow>
          {WHY_PHRASES.map((p, i) => (
            <p key={i} className="font-serif-display leading-[1.05] text-cream"
              style={{ fontSize: p.big ? 'clamp(34px,8vw,52px)' : 'clamp(26px,6vw,40px)' }}>
              {p.text}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* DESKTOP / motion : le PIN 450vh */}
      <section id="why" ref={wrapper} className="section-clip relative hidden h-[450vh] md:block">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          {/* lueur radiale douce derrière la séquence */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[130px]"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(12,196,129,0.18), transparent 65%)' }} />
          <div aria-hidden className="absolute left-1/2 top-10 -translate-x-1/2">
            <Eyebrow>Le constat</Eyebrow>
          </div>
          <div className="relative mx-auto flex w-full items-center justify-center">
            {WHY_PHRASES.map((p, i) => (
              <PinnedPhrase key={i} i={i} total={WHY_PHRASES.length} progress={scrollYProgress} phrase={p} />
            ))}
          </div>
          {/* indicateur de progression de la séquence (4 segments) */}
          <SequenceProgress progress={scrollYProgress} total={WHY_PHRASES.length} />
        </div>
      </section>

      {/* MOBILE : liste empilée (le pin 450vh est désactivé) */}
      <section className="section-clip relative px-5 py-[clamp(96px,16vh,200px)] md:hidden">
        <div className="mx-auto max-w-3xl space-y-12">
          <Eyebrow>Le constat</Eyebrow>
          {WHY_PHRASES.map((p, i) => (
            <p key={i} className="font-serif-display leading-[1.05] text-cream"
              style={{ fontSize: p.big ? 'clamp(34px,8vw,52px)' : 'clamp(26px,6vw,40px)' }}>
              {p.text}
            </p>
          ))}
        </div>
      </section>
    </>
  );
};

// barre de progression de la séquence pinned (4 segments qui se remplissent)
const SequenceProgress: React.FC<{ progress: any; total: number }> = ({ progress, total }) => (
  <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <SegBar key={i} i={i} total={total} progress={progress} />
    ))}
  </div>
);
const SegBar: React.FC<{ i: number; total: number; progress: any }> = ({ i, total, progress }) => {
  const seg = 1 / total;
  const scaleX = useTransform(progress, [i * seg, (i + 1) * seg], [0, 1], { clamp: true });
  return (
    <span className="relative h-[3px] w-9 overflow-hidden rounded-full bg-white/10">
      <motion.span className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-green to-cyan"
        style={{ scaleX }} />
    </span>
  );
};

// =====================================================================
// 4. PARCOURS — (ex-"process" morningside). « Un parcours complet, pas une
//    intervention isolée. » 3 cartes (icône animée + n° + titre + desc), avec
//    les 7 étapes regroupées sous chaque carte. Reveal en stagger.
// =====================================================================
const PARCOURS_CARDS = [
  {
    n: '01', t: 'Audit & Conseil',
    d: "On identifie les opportunités IA à fort ROI dans vos process, et on les priorise. Pas de gadget : seulement ce qui crée de la valeur.",
    steps: ['Cartographie des process & données', 'Identification des cas d\'usage', 'Feuille de route priorisée'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ),
  },
  {
    n: '02', t: 'Déploiement & Automatisation',
    d: "On construit et on déploie vos automatisations en production. n8n, Make, Claude Code : des workflows qui tournent seuls, 7j/7.",
    steps: ['Construction des workflows', 'Intégration à vos outils', 'Mise en production'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7"><path d="M4 7h11M4 12h16M4 17h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="19" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" /><circle cx="15" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" /></svg>
    ),
  },
  {
    n: '03', t: 'Formation & Suivi',
    d: "70 % de pratique : vos équipes opérationnelles dès J+1. Et on reste pour faire évoluer le système, mois après mois.",
    steps: ['Formation 70 % pratique', 'Suivi & maintenance', 'Évolutions long terme'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7"><path d="M12 4 3 8l9 4 9-4-9-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M6 10v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
    ),
  },
];
const Parcours: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="parcours" className="section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <Reveal><Eyebrow>Le parcours AXEM</Eyebrow></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display leading-[1.0] tracking-[0.02em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
              Un parcours complet,<br /><span className="title-grad italic">pas une intervention isolée.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              Sept étapes, regroupées en trois temps. De l'audit à l'autonomie — un seul interlocuteur du début à la fin.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PARCOURS_CARDS.map((c, i) => (
            <motion.article key={c.n}
              {...reveal(i * 0.12, !!reduce)}
              whileHover={reduce ? undefined : { y: -6, boxShadow: '0 20px 60px rgba(12,196,129,.14)' }}
              className="group glass flex h-full flex-col rounded-3xl p-7 md:p-8">
              <div className="flex items-center justify-between">
                <span className="text-green transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-110 group-hover:rotate-3">
                  {c.icon}
                </span>
                <span className="font-serif-display text-5xl text-green/30">{c.n}</span>
              </div>
              <h3 className="font-serif-display mt-6 text-[28px] leading-[1.05] text-cream">{c.t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-cream-soft">{c.d}</p>
              <ul className="mt-6 space-y-2 border-t border-green/12 pt-5">
                {c.steps.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-cream-soft">
                    <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan" />{s}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// 5. LE DUO — (ex-"testimonials" morningside, SANS citation client inventée).
//    « Deux experts, un seul interlocuteur. » Clément + Alexis + autorité.
//    Portraits tilt/parallax léger + N&B → couleur au hover.
// =====================================================================
const FOUNDERS = [
  { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC',
    role: 'Stratégie & Business IA',
    desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit, conseil et formation.",
    li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
  { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Polytechnique · Télécom Paris',
    role: 'Architecture & Déploiement',
    desc: "L'architecte. Je conçois et déploie les systèmes : agents, automatisations, intégrations en production.",
    li: 'https://www.linkedin.com/in/alexis-zeitoun/' },
];
const TiltCard: React.FC<{ f: typeof FOUNDERS[number]; i: number }> = ({ f, i }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = React.useState({ rx: 0, ry: 0 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ rx: -py * 6, ry: px * 8 });
  };
  const reset = () => setT({ rx: 0, ry: 0 });
  return (
    <motion.div {...reveal(i * 0.12, !!reduce)} style={{ perspective: 1000 }}>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
        className="group glass relative overflow-hidden rounded-3xl transition-transform duration-200 [transform-style:preserve-3d] [transition-timing-function:var(--ease-out)]"
        style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}>
        <div className="relative overflow-hidden">
          <img src={f.img} alt={f.name} loading="lazy"
            className="aspect-[5/4] w-full object-cover grayscale transition-[filter,transform] duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04] group-hover:grayscale-0" />
          <div aria-hidden className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(8,8,8,0.88) 100%)' }} />
          <a href={f.li} target="_blank" rel="noopener noreferrer"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-green/90 text-[#061a12] shadow-lg transition-transform [transition-timing-function:var(--ease-out)] hover:scale-110"
            aria-label={`LinkedIn ${f.name}`}>
            <span className="text-[15px] font-bold">in</span>
          </a>
        </div>
        <div className="p-7 md:p-8">
          <p className="text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cyan">{f.school}</p>
          <h3 className="font-serif-display mt-1 text-[30px] leading-none text-cream">{f.name}</h3>
          <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-cream-soft">{f.role}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-cream-soft">{f.desc}</p>
        </div>
      </div>
    </motion.div>
  );
};
const AUTHORITY = [
  { val: <CountUp to={55000} suffix=" +" />, label: 'abonnés LinkedIn cumulés' },
  { val: <CountUp to={2.6} decimals={1} suffix=" M" />, label: 'd\'impressions / mois' },
  { val: <>A<span className="text-green">→</span>Z</>, label: 'on enseigne ce qu\'on déploie' },
];
const Duo: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="duo" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal><Eyebrow>Le duo</Eyebrow></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display leading-[1.0] tracking-[0.02em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
              Deux experts,<br /><span className="title-grad italic">un seul interlocuteur.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              On enseigne ce qu'on déploie. Pas de théorie hors-sol : la stratégie et la technique dans la même équipe.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {FOUNDERS.map((f, i) => <TiltCard key={f.name} f={f} i={i} />)}
        </div>

        {/* AUTORITÉ chiffrée (pas de citation client) */}
        <div className="mt-14 grid grid-cols-1 gap-6 border-t border-green/12 pt-12 sm:grid-cols-3">
          {AUTHORITY.map((a, i) => (
            <motion.div key={i} {...reveal(i * 0.08, !!reduce)} className="text-center sm:text-left">
              <div className="font-serif-display leading-[0.9] text-cream" style={{ fontSize: 'clamp(40px, 6vw, 68px)' }}>{a.val}</div>
              <div className="mt-2 text-[13px] font-medium text-cream-soft">{a.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// 6. STATS — <Marquee> de chiffres clés (réplique du marquee morningside).
// =====================================================================
const STATS = [
  ['−80 %', 'temps de saisie'],
  ['95 k€/an', 'coûts neutralisés'],
  ['×4', 'vitesse de traitement'],
  ['317 h/mois', 'libérées'],
  ['> 98 %', 'anomalies détectées'],
  ['159 %', 'ROI médian'],
  ['55k', 'abonnés'],
];
const StatsMarquee: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section aria-label="Chiffres clés" className="section-clip relative overflow-hidden border-y border-green/10 py-12 md:py-16">
      <Marquee duration={38} reduce={!!reduce} gapClass="gap-10 md:gap-16">
        {STATS.map(([v, l], i) => (
          <span key={v + i} className="flex shrink-0 items-baseline gap-3 whitespace-nowrap">
            <span className="font-serif-display text-cream" style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}>{v}</span>
            <span className="text-[13px] font-medium uppercase tracking-[0.1em] text-cream-dim">{l}</span>
            <span aria-hidden className="ml-6 h-1.5 w-1.5 rounded-full bg-cyan/60" />
          </span>
        ))}
      </Marquee>
    </section>
  );
};

// =====================================================================
// 7. CAS CLIENTS — 3 cartes Problème → Solution → Résultat (résultat révélé
//    au hover). Lien « Voir tous les cas » → Notion.
// =====================================================================
const CASES = [
  { sector: 'BTP · Rénovation',
    problem: 'Chiffrage manuel chronophage, devis lents, marges grignotées par les erreurs.',
    solution: 'Assistant de chiffrage IA branché sur leurs bordereaux et historiques.',
    result: '−80 %', resultLabel: 'de temps de saisie · 95 k€/an neutralisés' },
  { sector: 'Administration judiciaire',
    problem: 'Traitement documentaire massif, saisie répétitive, risque d\'erreur élevé.',
    solution: 'Pipeline OCR + double vérification IA sur les pièces entrantes.',
    result: '×4', resultLabel: 'plus rapide · +5 h/sem · fiabilité 100 %' },
  { sector: 'Adhésifs aéro / ferroviaire',
    problem: 'Conformité ADV lourde, contrôles manuels, anomalies détectées trop tard.',
    solution: 'Automatisation des contrôles documentaires et de conformité.',
    result: '317 h', resultLabel: 'libérées / mois · anomalies détectées > 98 %' },
];
const Cas: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="cas" className="section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal><Eyebrow>Cas clients</Eyebrow></Reveal>
            <Reveal delay={0.06} perspective>
              <h2 className="font-serif-display leading-[0.98] tracking-[0.02em] text-cream" style={{ fontSize: 'clamp(38px, 7vw, 84px)' }}>
                Des résultats.<br /><span className="title-grad italic">Pas des slides.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="text-[16px] leading-relaxed text-cream-soft md:pb-3">
              Des chiffres réels, issus de missions menées de bout en bout. Anonymisés à la demande des clients.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.article key={c.sector} tabIndex={0}
              {...reveal(i * 0.1, !!reduce)}
              whileHover={reduce ? undefined : { y: -6, boxShadow: '0 20px 60px rgba(12,196,129,.14)' }}
              className="group glass relative flex flex-col gap-4 overflow-hidden rounded-3xl p-7 outline-none focus-visible:-translate-y-1 md:p-8">
              <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cyan">{c.sector}</span>
              <div className="space-y-3 text-[14.5px] leading-relaxed">
                <p className="text-cream-soft"><span className="font-semibold text-cream">Problème · </span>{c.problem}</p>
                <p className="text-cream-soft"><span className="font-semibold text-cream">Solution · </span>{c.solution}</p>
              </div>
              <div className="mt-auto flex items-end justify-between border-t border-green/12 pt-5">
                <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.12em] text-cream-dim">Résultat</span>
                <span className="font-serif-display text-cream transition-[transform,color] duration-400 [transition-timing-function:var(--ease-out)] group-hover:text-green group-focus-within:text-green md:translate-y-1 md:opacity-70 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
                  style={{ fontSize: 'clamp(40px, 6vw, 60px)' }}>
                  {c.result}
                </span>
              </div>
              <p className="text-[12.5px] leading-snug text-cream-dim">{c.resultLabel}</p>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <SecondaryButton href={CASES_URL} external arrow>Voir tous les cas</SecondaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// 8. FORMATION — « 10 formations. 70 % de pratique. » 3 phares + « Voir les 10 »
//    (accordéon catalogue). Sans Qualiopi/OPCO/OF.
// =====================================================================
const FORMATIONS_PHARES = [
  { code: 'IA Essentielle', price: '300 €', level: 'Découverte',
    pitch: "Comprendre l'IA générative et l'utiliser au quotidien.",
    detail: '1 jour · ChatGPT, Claude, Gemini · prompting, rédaction, recherche, synthèse. Repartez avec vos premiers réflexes IA.' },
  { code: 'Maîtriser Claude', price: '450 €', level: 'Intermédiaire',
    pitch: 'Exploiter Claude à fond : projets, artefacts, raisonnement.',
    detail: '1 jour · Projects, fichiers, MCP, agents · cas métiers réels. Pour un copilote sérieux, pas un gadget.' },
  { code: 'No-Code & Workflows', price: '800 €', level: 'Avancé',
    pitch: 'Construire des automatisations qui tournent seules.',
    detail: '2 jours · n8n, Make, Claude Code · vos premiers workflows en production. On part de vos process.' },
];
const CATALOGUE = [
  ['F01', 'IA Essentielle', 'Découverte', '300 €'],
  ['F02', 'Prompting Pro', 'Découverte', '350 €'],
  ['F03', 'Maîtriser Claude', 'Intermédiaire', '450 €'],
  ['F04', 'IA & Bureautique', 'Découverte', '400 €'],
  ['F05', 'IA pour Managers', 'Intermédiaire', '600 €'],
  ['F06', 'Création de contenu IA', 'Intermédiaire', '550 €'],
  ['F07', 'No-Code & Workflows', 'Avancé', '800 €'],
  ['F08', 'Agents & MCP', 'Avancé', '950 €'],
  ['F09', 'IA & Données', 'Avancé', '1 000 €'],
  ['F10', 'Architecture IA sur-mesure', 'Avancé', '1 250 €'],
] as const;
const LEVEL_TINT: Record<string, string> = {
  'Découverte': 'text-mint border-mint/30',
  'Intermédiaire': 'text-cyan border-cyan/30',
  'Avancé': 'text-green border-green/30',
};
const Formation: React.FC = () => {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  return (
    <section id="formation" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <Reveal><Eyebrow>Formation</Eyebrow></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display leading-[1.0] tracking-[0.02em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
              10 formations.<br /><span className="title-grad italic">70 % de pratique.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              On ne forme pas pour cocher une case. On forme pour que vos équipes utilisent l'IA dès le lendemain.
              Financement sur budget formation entreprise.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {FORMATIONS_PHARES.map((f, i) => (
            <motion.article key={f.code} tabIndex={0}
              {...reveal(i * 0.1, !!reduce)}
              whileHover={reduce ? undefined : { y: -6, boxShadow: '0 20px 60px rgba(12,196,129,.14)' }}
              className="group glass relative flex flex-col rounded-3xl p-7 outline-none focus-visible:-translate-y-1 md:p-8">
              <span className={`self-start rounded-full border px-2.5 py-1 text-[10px] font-satoshi font-bold uppercase tracking-[0.12em] ${LEVEL_TINT[f.level]}`}>{f.level}</span>
              <h3 className="font-serif-display mt-5 text-[28px] leading-[1.05] text-cream">{f.code}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-cream-soft">{f.pitch}</p>
              <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-400 [transition-timing-function:var(--ease-out)] group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
                <div className="overflow-hidden">
                  <p className="mt-4 border-t border-green/15 pt-4 text-[13.5px] leading-relaxed text-cream-soft">{f.detail}</p>
                </div>
              </div>
              <div className="mt-auto flex items-end justify-between pt-6">
                <span className="font-serif-display text-4xl text-cream">{f.price}</span>
                <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.1em] text-cream-dim">/ pers.</span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-8">
          <SecondaryButton onClick={() => setOpen((v) => !v)} arrow
            ariaLabel={open ? 'Replier le catalogue' : 'Voir les 10 formations'}
            className={open ? '[&_.btn-arrow]:rotate-90' : ''}>
            {open ? 'Replier le catalogue' : 'Voir les 10 formations'}
          </SecondaryButton>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="catalogue"
                initial={reduce ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease }}
                className="w-full overflow-hidden">
                <div className="glass overflow-hidden rounded-3xl">
                  <div className="hidden grid-cols-[64px_1fr_140px_100px] gap-4 border-b border-green/12 px-6 py-4 text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cream-dim md:grid">
                    <span>Réf.</span><span>Formation</span><span>Niveau</span><span className="text-right">Prix</span>
                  </div>
                  <ul>
                    {CATALOGUE.map(([code, title, level, price], i) => (
                      <motion.li key={code}
                        initial={reduce ? { opacity: 0.001 } : { opacity: 0.001, y: 12 }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        transition={reduce ? { duration: 0.3, delay: 0.04 * i } : { ...SPRING, delay: 0.04 * i }}
                        className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-green/8 px-5 py-4 transition-colors [transition-timing-function:var(--ease-limitless)] last:border-0 hover:bg-white/[0.03] md:grid-cols-[64px_1fr_140px_100px] md:gap-4 md:px-6">
                        <span className="font-serif-display text-lg text-green/60">{code}</span>
                        <span className="text-[15px] text-cream">{title}</span>
                        <span className={`hidden text-[12px] font-satoshi font-bold uppercase tracking-[0.1em] md:inline ${LEVEL_TINT[level].split(' ')[0]}`}>{level}</span>
                        <span className="text-right text-[14px] font-semibold text-cream-soft md:text-cream">{price}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-center text-[13px] text-cream-dim">
                  3 niveaux · 200 € – 1 250 € / personne · sur-mesure possible en intra-entreprise.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// 9. FAQ — accordéon (hauteur animée + icône +/−), question soulignée au hover.
// =====================================================================
const FAQ_ITEMS = [
  { q: 'Par où commencer ?', a: "Par un appel de 30 minutes, gratuit. On comprend votre contexte et on vous dit honnêtement si l'IA est pertinente — et par quoi commencer. Pas de vente forcée." },
  { q: 'Comment finance-t-on la formation ?', a: 'Sur le budget formation de votre entreprise. On cadre le programme et le devis avec vous, et le financement passe par votre poste formation interne.' },
  { q: 'Combien de temps avant des résultats ?', a: 'Diagnostic en 30 minutes, proposition sous 48 h, démarrage dès J+1. On ne fait pas traîner : la vitesse fait partie du résultat.' },
  { q: 'Qu\'est-ce que vous garantissez ?', a: "On s'engage sur des livrables concrets et mesurables, pas sur des slides. Chaque mission est cadrée avec des objectifs chiffrés — nos cas clients le montrent." },
  { q: "C'est pour qui ?", a: 'PME, ETI, administrations, indépendants. Tout métier où des tâches répétitives, documentaires ou rédactionnelles pèsent sur le temps des équipes.' },
  { q: 'Et après la livraison ?', a: "On reste. Maintenance, évolutions, nouvelles automatisations : un système IA vit et s'améliore. C'est tout l'intérêt d'un partenaire, pas d'un prestataire de passage." },
];
const FaqRow: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-green/12">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 py-6 text-left outline-none [touch-action:manipulation]">
        <span className="relative font-serif-display text-[22px] leading-tight text-cream md:text-[28px]">
          {q}
          <span aria-hidden className="absolute -bottom-1 left-0 h-px w-0 bg-green/60 transition-[width] duration-300 [transition-timing-function:var(--ease-out)] group-hover:w-full group-focus-visible:w-full" />
        </span>
        <motion.span aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }}
          className="shrink-0 text-2xl leading-none text-green">+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 1, height: 'auto' } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ type: reduce ? 'tween' : 'spring', stiffness: 220, damping: 30, opacity: { duration: 0.25 } }}
            className="overflow-hidden">
            <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-cream-soft">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const Faq: React.FC = () => (
  <section id="faq" className="section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
    <div className="mx-auto max-w-3xl">
      <Reveal><Eyebrow>Questions fréquentes</Eyebrow></Reveal>
      <Reveal delay={0.06} perspective>
        <h2 className="font-serif-display mb-10 leading-[1.0] tracking-[0.02em] text-cream" style={{ fontSize: 'clamp(34px, 5.5vw, 64px)' }}>
          Tout ce qu'on <span className="title-grad italic">nous demande.</span>
        </h2>
      </Reveal>
      <div>
        {FAQ_ITEMS.map((f) => <FaqRow key={f.q} q={f.q} a={f.a} />)}
      </div>
    </div>
  </section>
);

// =====================================================================
// 10. CTA FINAL — titre dégradé « Échangeons 30 minutes sur l'IA. » +
//     Calendly inline. Moment Grainient navy + bouton magnétique.
// =====================================================================
const CtaFinal: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  return (
    <section id="contact" ref={ref}
      className="section-clip relative isolate overflow-hidden bg-ink px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Grainient
          className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.14} grainAmount={0.08} contrast={1.3}
          saturation={1.0} zoom={1.0} warpStrength={1.1}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(90% 90% at 50% 40%, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.72) 65%, rgba(8,8,8,0.93) 100%)' }} />
      {/* PEAU MORNINGSIDE — fond en pointillés « dashed » derrière le bloc CTA */}
      <div aria-hidden className="dashed pointer-events-none absolute inset-0 z-[2]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="text-center lg:text-left">
          <Reveal><div className="flex justify-center lg:justify-start"><Eyebrow>30 minutes, gratuit</Eyebrow></div></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display leading-[1.0] tracking-[0.02em] text-cream" style={{ fontSize: 'clamp(38px, 6.5vw, 80px)' }}>
              Échangeons 30 minutes <span className="title-grad italic">sur l'IA.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-cream-soft lg:mx-0">
              Un échange, pas une démo — on vous dit franchement où l'IA a du sens chez vous. Sans engagement.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 flex justify-center lg:justify-start">
              <MagneticPrimary href={CALENDLY} external>Réserver mon créneau</MagneticPrimary>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="glass-strong overflow-hidden rounded-3xl p-1.5 md:p-2">
            {inView && (
              <iframe
                title="Réserver un créneau de 30 minutes"
                src={CALENDLY_EMBED}
                loading="lazy"
                className="h-[640px] w-full rounded-[20px] border-0 sm:h-[700px]"
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// 11. FOOTER — dispositif « footer-reveal » (rideau). Logo AXEM, © 2026,
//     liens (Parcours/Cas/Formation/Le duo), LinkedIn Clément + Alexis, email.
//     Liens : soulignement + remontée y:-5px au hover. Sans Qualiopi/OF.
// =====================================================================
const Footer: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <footer className="footer-fixed isolate border-t border-green/12 px-5 py-16 md:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Grainient
          className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.1} grainAmount={0.07} contrast={1.25}
          saturation={0.95} zoom={1.05} warpStrength={1.0}
        />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 120% at 50% 35%, rgba(8,8,8,0.35) 0%, rgba(8,8,8,0.58) 55%, rgba(8,8,8,0.85) 100%)' }} />
      </div>
      <div className="relative z-10 w-full">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-serif-display text-4xl leading-none tracking-tight text-cream md:text-5xl">
              AXEM<span className="aurora-text">.</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-soft">
              Votre partenaire IA, de A à Z. Formation, conseil, audit, déploiement &amp; automatisation IA.
            </p>
          </div>
          <div>
            <div className="mb-4 text-[11px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
            <ul className="space-y-2 text-sm text-cream-soft">
              {NAV_LINKS.map(([l, h]) => (
                <li key={l}><a href={h} className="footer-link link-limitless inline-block hover:text-cream">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 text-[11px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
            <ul className="space-y-2 text-sm text-cream-soft">
              <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="footer-link link-limitless inline-block hover:text-cream">Réserver un appel</a></li>
              <li><a href="https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/" target="_blank" rel="noopener noreferrer" className="footer-link link-limitless inline-block hover:text-cream">LinkedIn · Clément</a></li>
              <li><a href="https://www.linkedin.com/in/alexis-zeitoun/" target="_blank" rel="noopener noreferrer" className="footer-link link-limitless inline-block hover:text-cream">LinkedIn · Alexis</a></li>
              <li><a href="mailto:contact@axem-ia.fr" className="footer-link link-limitless inline-block hover:text-cream">contact@axem-ia.fr</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl border-t border-green/8 pt-6 text-center text-xs text-cream-dim">
          © 2026 AXEM IA — Paris, France.
        </div>
      </div>
    </footer>
  );
};

// =====================================================================
// PAGE — ordre identique à morningside :
// Nav · Hero · WHY(pinned 450vh) · Parcours · Le duo · Stats(marquee)
// · Cas clients · Formation · FAQ · CTA · Footer.
// =====================================================================
const Home: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <div className="has-footer-reveal min-h-screen text-cream">
        <Nav />
        <main id="contenu" className="reveal-main">
          <Hero />
          <PinnedSequence />
          <Parcours />
          <Duo />
          <StatsMarquee />
          <Cas />
          <Formation />
          <Faq />
          <CtaFinal />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default Home;
