import React, { useRef } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValueEvent, useReducedMotion, useInView, MotionConfig,
} from 'framer-motion';
import { Prism, PrismShard } from '../components/Prism';
import { RiseWords, Reveal, CountUp, EASE, SPRING, reveal, revealMount } from '../ui/motion';
import { PrimaryButton, SecondaryButton, MagneticPrimary } from '../ui/Button';
import { Metamorphose } from '../components/Metamorphose';
import { Parcours } from '../components/Parcours';
import { useLenis } from '../ui/useLenis';
import { LazySection } from '../ui/LazySection';

// =====================================================================
// AXEM IA — SYSTÈME « VIVID+CO » (darkroom editorial spread).
// Canvas slate #495764 UNIQUE sur toute la page. AUCUNE carte, AUCUN fond
// de panneau, AUCUNE ombre, AUCUN radius (sauf nav 5px). La typo EST le
// sujet : Inter 400, display 105–136px à même le fond. Off-white #fffdf9.
// Accent UNIQUE gunmetal #6f879c. Prismes de verre 3D avec aberration
// chromatique DERRIÈRE les gros titres. Boutons outline rectangulaires.
// Le DUO en pièce maîtresse. Hero « de A à Z » conservé.
// =====================================================================

const ease = EASE;
const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const CASES_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

// ---------------------------------------------------------------------
// NAV flottante TRANSPARENTE — wordmark + liens + bouton CONTACT outline.
// ---------------------------------------------------------------------
const NAV_LINKS: [string, string][] = [
  ['Parcours', '#parcours'], ['Cas clients', '#resultats'],
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
        className="nav-pill flex w-full max-w-5xl items-center justify-between gap-3 py-2.5 pl-4 pr-2">
        <a href="#top" className="link-limitless text-[19px] font-medium leading-none tracking-tight text-offwhite hover:text-offwhite [touch-action:manipulation]">
          AXEM<span className="prism-glyph">.</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h}
              className="link-limitless relative text-[13px] font-medium uppercase tracking-[0.08em] text-offwhite/70 hover:text-offwhite [touch-action:manipulation]">
              {l}
            </a>
          ))}
        </div>
        <SecondaryButton href={CALENDLY} external size="sm">Contact</SecondaryButton>
      </nav>
    </header>
  );
};

// ---------------------------------------------------------------------
// EYEBROW — label caps gunmetal + filet.
// ---------------------------------------------------------------------
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="eyebrow mb-7 flex items-center gap-3">
    <span className="h-px w-9 bg-gunmetal/60" />{children}
  </div>
);

// ---------------------------------------------------------------------
// 0. HERO — « Votre partenaire IA, de A à Z. »
// Inter 400 ~136px, line-height 1.0, prisme de verre derrière. « de A à Z »
// en emphase. Canvas slate, AUCUN gradient, AUCUNE carte.
// ---------------------------------------------------------------------
const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const y = reduce ? '0%' : yRaw;
  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-36 md:px-8">
      {/* PRISME DE VERRE derrière le titre — plein cadre, edge-faded vignette. */}
      <motion.div aria-hidden style={{ y }} className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <Prism className="h-[125%] w-[125%] max-w-[1100px]" scale={1} aberration={3.6} speed={28} rotate={-12} />
      </motion.div>
      {/* léger voile slate pour ancrer le texte (pas de gradient coloré). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(85% 75% at 50% 46%, rgba(73,87,100,0.32) 0%, rgba(73,87,100,0.55) 60%, rgba(73,87,100,0.82) 100%)' }} />

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center text-center">
        <motion.div {...revealMount(0.1, !!reduce)}>
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-9 bg-gunmetal/60" />Agence d'IA × Formation
          </span>
        </motion.div>

        {/* H1 — Inter 400, ~136px, line-height 1.0. « de A à Z » en emphase 700. */}
        <h1 aria-label="Votre partenaire IA, de A à Z."
          className="font-serif-display mt-10 text-offwhite"
          style={{ fontSize: 'clamp(52px, 14vw, 136px)', transformPerspective: 1200 }}>
          <span aria-hidden>
            <RiseWords text="Votre partenaire IA," delay={0.3} stagger={0.07} />
            <br />
            <span className="emph">
              <RiseWords text="de A à Z." delay={0.62} stagger={0.08} />
            </span>
          </span>
        </h1>

        <motion.p {...revealMount(0.5, !!reduce)}
          className="mt-10 max-w-2xl text-balance text-[18px] leading-relaxed text-offwhite/75 md:text-[20px]">
          On forme vos équipes, on conseille votre stratégie, on déploie vos automatisations.
          <span className="text-offwhite"> Et on reste.</span>
        </motion.p>

        <motion.div {...revealMount(0.7, !!reduce)}
          className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <PrimaryButton href={CALENDLY} external size="lg">Réserver un appel</PrimaryButton>
          <SecondaryButton href="#resultats" size="lg">Voir les cas clients</SecondaryButton>
        </motion.div>

        <motion.div {...revealMount(0.9, !!reduce)} className="mt-14 flex items-center gap-4 text-offwhite/60">
          <span className="eyebrow">ROI médian</span>
          <span className="h-px w-9 bg-gunmetal/60" />
          <span className="font-serif-display text-[34px] leading-none text-offwhite"><CountUp to={159} suffix=" %" /></span>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 1. PREUVE (logos) — bande de type. « Ils nous ont confié leur IA. »
// ---------------------------------------------------------------------
const LOGOS: [string, string][] = [
  ['Carrefour', '/logos/carrefour.svg'],
  ['Blackfin', '/logos/blackfin.png'],
  ['Gravotech', '/logos/gravotech.png'],
  ['KIT France', '/logos/kit.png'],
  ['Avantis', '/logos/avantis.png'],
  ['Socos', '/logos/socos.png'],
  ['Espace 2', '/logos/espace2.png'],
];
const TrustBar: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xRaw = useTransform(scrollYProgress, [0, 1], ['2%', '-32%']);
  const x = reduce ? '0%' : xRaw;
  const row = [...LOGOS, ...LOGOS];
  return (
    <section ref={ref} aria-label="Ils nous ont confié leur IA" className="section-clip hair-t hair-b relative py-16">
      <Reveal>
        <p className="eyebrow mb-10 text-center">Ils nous ont confié leur IA</p>
      </Reveal>
      <div className="ticker-mask group relative overflow-hidden">
        <motion.div className="flex w-max items-center gap-16 md:gap-24" style={{ x }}>
          {row.map(([name, src], i) => (
            <span key={name + i} className="logo-chip shrink-0" title={name}>
              <img src={src} alt={name} loading="lazy"
                className="h-7 w-auto max-w-[150px] object-contain md:h-9" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// =====================================================================
// 2. LE DUO — PIÈCE MAÎTRESSE. Grandes compositions typo + portraits N&B +
// chiffres en display. « On enseigne ce qu'on déploie. »
// =====================================================================
const FOUNDERS = [
  { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', followers: '~40k',
    role: 'Stratégie & Business IA',
    desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit, conseil et formation.",
    li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
  { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Polytechnique · Télécom Paris', followers: '~15-20k',
    role: 'Architecture IA, Tech & Déploiement',
    desc: "L'architecte. Je conçois et déploie les systèmes : agents, automatisations, intégrations en production.",
    li: 'https://www.linkedin.com/in/alexis-zeitoun/' },
];
const DuoFigure: React.FC<{ f: typeof FOUNDERS[number]; conv: any; align: 'left' | 'right' }> = ({ f, conv, align }) => (
  <motion.div style={{ x: conv }} className="relative">
    <div className="group relative">
      {/* portrait N&B plein cadre, edge-faded, AUCUNE carte ni radius. */}
      <div className="relative overflow-hidden">
        <img src={f.img} alt={f.name} loading="lazy"
          className="aspect-[4/5] w-full object-cover grayscale transition-[filter,transform] duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.03]"
          style={{
            WebkitMaskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)',
            maskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)',
          }} />
        <a href={f.li} target="_blank" rel="noopener noreferrer"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-offwhite/60 text-offwhite transition-colors [transition-timing-function:var(--ease-out)] hover:border-gunmetal"
          aria-label={`LinkedIn ${f.name}`}>
          <span className="text-[13px] font-bold">in</span>
        </a>
      </div>
      <div className={`mt-6 ${align === 'right' ? 'md:text-right' : ''}`}>
        <p className="eyebrow mb-3">{f.school} · {f.followers}</p>
        <h3 className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(34px, 4.5vw, 56px)' }}>{f.name}</h3>
        <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.08em] text-gunmetal">{f.role}</p>
        <p className={`mt-4 max-w-md text-[16px] leading-relaxed text-offwhite/70 ${align === 'right' ? 'md:ml-auto' : ''}`}>{f.desc}</p>
      </div>
    </div>
  </motion.div>
);
const Duo: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const leftRaw = useTransform(scrollYProgress, [0, 1], ['-5%', '0%']);
  const rightRaw = useTransform(scrollYProgress, [0, 1], ['5%', '0%']);
  const convL = reduce ? '0%' : leftRaw;
  const convR = reduce ? '0%' : rightRaw;
  return (
    <section id="duo" className="section-clip relative px-5 py-[var(--gap)] md:px-8" style={{ paddingTop: 'var(--gap)', paddingBottom: 'var(--gap)' }}>
      <div className="mx-auto max-w-[1200px]">
        <Reveal><Eyebrow>Le duo</Eyebrow></Reveal>
        <Reveal delay={0.06} perspective>
          <h2 className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(48px, 11vw, 128px)' }}>
            Stratégie + Tech.<br /><span className="emph">Un seul interlocuteur.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-9 max-w-2xl text-[18px] leading-relaxed text-offwhite/70">
            On enseigne ce qu'on déploie. 55 000 personnes nous suivent — la stratégie et la
            technique dans la même équipe, pas de théorie hors-sol.
          </p>
        </Reveal>

        <div ref={ref} className="mt-[88px] grid gap-12 md:grid-cols-2 md:gap-x-16">
          {FOUNDERS.map((f, i) => (
            <motion.div key={f.name} {...reveal(i * 0.12, !!reduce)}>
              <DuoFigure f={f} conv={i === 0 ? convL : convR} align={i === 0 ? 'left' : 'right'} />
            </motion.div>
          ))}
        </div>

        {/* chiffres en display — 55k cumulés · 2,6M impressions/mois */}
        <Reveal delay={0.1}>
          <div className="mt-[88px] grid gap-y-12 border-t border-gunmetal/25 pt-12 sm:grid-cols-2">
            <div>
              <span className="font-serif-display block leading-[0.85] text-offwhite" style={{ fontSize: 'clamp(64px, 12vw, 136px)' }}>
                <CountUp to={2.6} decimals={1} suffix=" M" />
              </span>
              <span className="eyebrow mt-3 block">impressions LinkedIn / mois</span>
            </div>
            <div className="sm:text-right">
              <span className="font-serif-display block leading-[0.85] text-offwhite" style={{ fontSize: 'clamp(64px, 12vw, 136px)' }}>
                <CountUp to={55} suffix=" k" />
              </span>
              <span className="eyebrow mt-3 block">abonnés cumulés · on enseigne ce qu'on déploie</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. LE PROBLÈME — composition typo plein écran, watermark « aujourd'hui ».
// ---------------------------------------------------------------------
const Probleme: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const y = reduce ? '0%' : yRaw;
  return (
    <section id="probleme" ref={ref}
      className="section-clip relative isolate flex min-h-[80svh] items-center overflow-hidden px-5 md:px-8">
      <motion.div aria-hidden style={{ y }}
        className="pointer-events-none absolute inset-0 z-[0] flex items-center justify-center">
        <span className="serif-watermark text-offwhite/[0.05]" style={{ fontSize: 'clamp(110px, 30vw, 460px)' }}>
          aujourd'hui
        </span>
      </motion.div>
      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <Reveal><Eyebrow>Le problème</Eyebrow></Reveal>
        <Reveal delay={0.08} perspective>
          <p className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(40px, 9vw, 112px)' }}>
            La saisie manuelle. Les heures perdues.
            <br /><span className="text-offwhite/55">L'IA qu'on teste sans jamais déployer.</span>
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-9 max-w-xl text-[18px] leading-relaxed text-offwhite/70">
            Des outils empilés, des POC abandonnés, des équipes qui doutent. La promesse de
            l'IA reste une promesse. C'est là que la ligne se tend.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 6. LES RÉSULTATS — chiffres-manifestes en display, cas en bandes de type.
// ---------------------------------------------------------------------
const KPIS: { val: React.ReactNode; label: string }[] = [
  { val: <><CountUp to={80} />%</>, label: 'de temps de saisie économisé' },
  { val: <CountUp to={95} suffix=" k€" />, label: 'de coûts neutralisés / an' },
  { val: <>×<CountUp to={4} /></>, label: 'plus rapide sur le traitement' },
  { val: <CountUp to={317} suffix=" h" />, label: 'libérées par mois' },
  { val: <>&gt;<CountUp to={98} />%</>, label: 'd\'anomalies détectées' },
  { val: <CountUp to={159} suffix=" %" />, label: 'de ROI sur 12 mois' },
];
const CASES = [
  { sector: 'BTP · Rénovation',
    problem: 'Chiffrage manuel chronophage, devis lents, marges grignotées par les erreurs.',
    solution: 'Assistant de chiffrage IA branché sur leurs bordereaux et historiques.',
    result: '80 %', resultLabel: 'de temps de saisie en moins · 95 k€/an neutralisés' },
  { sector: 'Administration judiciaire',
    problem: 'Traitement documentaire massif, saisie répétitive, risque d\'erreur élevé.',
    solution: 'Pipeline OCR + double vérification IA sur les pièces entrantes.',
    result: '×4', resultLabel: 'plus rapide · +5 h/sem · fiabilité 100 % par double contrôle' },
  { sector: 'Adhésifs aéro / ferroviaire',
    problem: 'Conformité ADV lourde, contrôles manuels, anomalies détectées trop tard.',
    solution: 'Automatisation des contrôles documentaires et de conformité.',
    result: '317 h', resultLabel: 'libérées / mois · anomalies détectées > 98 %' },
  { sector: 'Éditeur médico-social',
    problem: '20 ambassadeurs à former, 80 développeurs à outiller, délais qui s\'allongent.',
    solution: 'Assistants IA spécialisés + montée en compétence des équipes internes.',
    result: '159 %', resultLabel: 'de ROI sur 12 mois · 20 ambassadeurs / 80 devs' },
];
const Resultats: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="resultats" className="section-clip relative px-5 md:px-8" style={{ paddingTop: 'var(--gap)', paddingBottom: 'var(--gap)' }}>
      <div className="mx-auto max-w-[1200px]">
        <Reveal><Eyebrow>Résultats</Eyebrow></Reveal>
        <Reveal delay={0.06} perspective>
          <h2 className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(48px, 11vw, 128px)' }}>
            Des résultats.<br /><span className="emph">Pas des slides.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-9 max-w-2xl text-[18px] leading-relaxed text-offwhite/70">
            Des chiffres réels, issus de missions menées de bout en bout. Anonymisés à la demande des clients.
          </p>
        </Reveal>

        {/* chiffres-manifestes en display */}
        <div className="mt-[88px] grid grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-3 md:gap-y-20">
          {KPIS.map((k, i) => (
            <motion.div key={i} {...reveal((i % 3) * 0.08, !!reduce)}>
              <div className="font-serif-display leading-[0.82] text-offwhite" style={{ fontSize: 'clamp(56px, 10vw, 128px)' }}>
                {k.val}
              </div>
              <div className="mt-4 max-w-[220px] text-[14px] leading-snug text-offwhite/65">{k.label}</div>
            </motion.div>
          ))}
        </div>

        {/* cas en bandes de type — filets gunmetal, zéro carte. */}
        <div className="mt-[88px] divide-y divide-gunmetal/20 border-t border-gunmetal/20">
          {CASES.map((c, i) => (
            <motion.article key={c.sector}
              {...reveal((i % 2) * 0.08, !!reduce)}
              className="case-card group grid gap-6 py-12 md:grid-cols-[0.8fr_1.6fr_auto] md:items-baseline md:gap-12">
              <span className="text-[13px] font-medium uppercase tracking-[0.1em] text-gunmetal">{c.sector}</span>
              <div className="space-y-3 text-[16px] leading-relaxed">
                <p className="text-offwhite/75"><span className="font-bold text-offwhite">Problème · </span>{c.problem}</p>
                <p className="text-offwhite/75"><span className="font-bold text-offwhite">Solution · </span>{c.solution}</p>
                <p className="text-[13px] text-offwhite/50">{c.resultLabel}</p>
              </div>
              <span className="font-serif-display leading-[0.85] text-offwhite transition-colors duration-300 group-hover:text-gunmetal"
                style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}>
                {c.result}
              </span>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16">
            <SecondaryButton href={CASES_URL} external arrow>Voir tous les cas clients</SecondaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 7. LA FORMATION — bande de type + galerie drag horizontal (10 modules).
// Sans Qualiopi/OF.
// ---------------------------------------------------------------------
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
const Formation: React.FC = () => {
  const reduce = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  const inView = useInView(barRef, { once: true, margin: '-15%' });
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = React.useRef({ down: false, startX: 0, scroll: 0 });
  const onDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    drag.current = { down: true, startX: e.clientX, scroll: trackRef.current.scrollLeft };
    trackRef.current.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.down || !trackRef.current) return;
    trackRef.current.scrollLeft = drag.current.scroll - (e.clientX - drag.current.startX);
  };
  const onUp = (e: React.PointerEvent) => {
    drag.current.down = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  };
  return (
    <section id="formation" className="section-clip relative px-0" style={{ paddingTop: 'var(--gap)', paddingBottom: 'var(--gap)' }}>
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal><Eyebrow>La formation</Eyebrow></Reveal>
        <Reveal delay={0.06} perspective>
          <h2 className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(44px, 10vw, 120px)' }}>
            On forme vos équipes<br /><span className="emph">à faire sans nous.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-9 max-w-2xl text-[18px] leading-relaxed text-offwhite/70">
            10 modules · 3 niveaux · 200 à 1 250 € par personne. On ne forme pas pour cocher
            une case : on forme pour que vos équipes utilisent l'IA dès le lendemain.
          </p>
        </Reveal>

        {/* barre 70 % pratique qui se remplit — filet gunmetal. */}
        <div ref={barRef} className="mt-12 max-w-md">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="eyebrow">Part de pratique</span>
            <span className="font-serif-display text-[40px] leading-none text-offwhite">{inView ? <CountUp to={70} suffix=" %" /> : '0 %'}</span>
          </div>
          <div className="h-px w-full overflow-hidden bg-gunmetal/20">
            <motion.div
              className="h-full bg-gunmetal"
              initial={{ width: '0%' }}
              animate={inView ? { width: '70%' } : { width: '0%' }}
              transition={reduce ? { duration: 0 } : { duration: 1.4, ease: EASE }}
            />
          </div>
        </div>
      </div>

      {/* GALERIE drag horizontal — 10 modules, bandes de type, zéro carte. */}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="drag-x mt-16 flex gap-px overflow-x-auto px-5 md:px-8">
        {CATALOGUE.map(([code, title, level, price], i) => (
          <motion.article
            key={code}
            {...reveal(Math.min(i, 4) * 0.06, !!reduce)}
            className="flex w-[72vw] max-w-[300px] shrink-0 select-none flex-col border-l border-gunmetal/25 px-7 py-2 md:w-[280px]">
            <span className="eyebrow">{level}</span>
            <span className="font-serif-display mt-6 text-[15px] text-gunmetal">{code}</span>
            <h3 className="font-serif-display mt-1 text-offwhite" style={{ fontSize: 'clamp(26px, 3vw, 34px)' }}>{title}</h3>
            <div className="mt-auto flex items-end justify-between pt-10">
              <span className="font-serif-display text-[40px] text-offwhite">{price}</span>
              <span className="eyebrow">/ pers.</span>
            </div>
          </motion.article>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-[1200px] px-5 text-[14px] text-offwhite/55 md:px-8">
        Glissez pour parcourir les 10 modules. Financement sur budget formation entreprise.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 8. LA MÉTHODE — diagramme tracé par une ligne au scroll (filet gunmetal).
// ---------------------------------------------------------------------
const STEPS = [
  { k: 'Diagnostic', meta: '30 min', d: 'On comprend votre contexte, vos irritants, vos objectifs. Gratuit, sans engagement.' },
  { k: 'Orientation', meta: '48 h', d: 'On revient avec un plan clair : périmètre, livrables, budget. Pas de jargon, pas de flou.' },
  { k: 'Déploiement', meta: 'J+1', d: 'On démarre. Formation, conseil ou automatisation — vous avancez dès le lendemain.' },
  { k: 'Optimisation', meta: 'continu', d: 'On mesure, on ajuste, on fait évoluer. La ligne reste tendue dans le temps.' },
];
const Methode: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 65%'] });
  const pathLength = reduce ? 1 : scrollYProgress;
  const [activeCount, setActiveCount] = React.useState(reduce ? STEPS.length : 0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    let n = 0;
    for (let i = 0; i < STEPS.length; i++) if (p >= (i + 0.5) / STEPS.length - 0.05) n++;
    setActiveCount((prev) => (prev === n ? prev : n));
  });

  return (
    <section id="methode" className="section-clip relative px-5 md:px-8" style={{ paddingTop: 'var(--gap)', paddingBottom: 'var(--gap)' }}>
      <div className="mx-auto max-w-[1200px]">
        <Reveal><Eyebrow>La méthode</Eyebrow></Reveal>
        <Reveal delay={0.06} perspective>
          <h2 className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(44px, 10vw, 120px)' }}>
            Quatre temps.<br /><span className="emph">Une seule ligne.</span>
          </h2>
        </Reveal>
      </div>

      <div ref={ref} className="relative mx-auto mt-[88px] max-w-3xl pl-12 md:pl-16">
        <svg aria-hidden className="pointer-events-none absolute left-[18px] top-2 h-full w-2 md:left-[26px]"
          viewBox="0 0 2 100" preserveAspectRatio="none" fill="none">
          <path d="M1 0 V100" stroke="rgba(111,135,156,0.18)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <motion.path d="M1 0 V100" stroke="#6f879c" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength }} />
        </svg>
        <ol className="space-y-16">
          {STEPS.map((s, i) => (
            <li key={s.k} className="relative">
              <span aria-hidden data-on={i < activeCount ? 'true' : 'false'}
                className="ligne-node absolute -left-[38px] top-3 h-3.5 w-3.5 border border-gunmetal/50 bg-canvas md:-left-[50px]" />
              <Reveal delay={0.05 * i}>
                <div className="flex flex-wrap items-baseline gap-4">
                  <h3 className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(34px, 5vw, 56px)' }}>{s.k}</h3>
                  <span className="eyebrow border border-gunmetal/40 px-3 py-1">{s.meta}</span>
                </div>
                <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-offwhite/70">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 9. LE ROI EN UN CHIFFRE — « 159 % » plein écran, prisme derrière.
// ---------------------------------------------------------------------
const Roi: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section id="roi" className="section-clip relative isolate flex min-h-[90svh] items-center justify-center overflow-hidden px-5 md:px-8">
      {/* prisme losange derrière le chiffre — edge-faded. */}
      <PrismShard className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] max-w-[800px] -translate-x-1/2 -translate-y-1/2"
        scale={1} aberration={3} speed={22} rotate={16} />
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(73,87,100,0.25) 0%, rgba(73,87,100,0.7) 70%)' }} />
      <div ref={ref} className="relative z-10 flex flex-col items-center text-center">
        <Reveal><Eyebrow>Le ROI en un chiffre</Eyebrow></Reveal>
        <div className="font-serif-display leading-[0.8] text-offwhite" style={{ fontSize: 'clamp(120px, 30vw, 380px)' }}>
          <CountUp to={159} suffix=" %" />
        </div>
        <Reveal delay={0.1}>
          <p className="mt-6 text-[18px] text-offwhite/70">Documenté, pas promis.</p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 10. FAQ — accordéons, filets gunmetal.
// ---------------------------------------------------------------------
const FAQ_ITEMS = [
  { q: 'Par où commencer ?', a: 'Par un appel de 30 minutes, gratuit. On comprend votre contexte et on vous dit honnêtement si l\'IA est pertinente — et par quoi commencer. Pas de vente forcée.' },
  { q: 'Quels sont les délais ?', a: 'Diagnostic en 30 minutes, proposition sous 48 h, démarrage dès J+1. On ne fait pas traîner : la vitesse fait partie du résultat.' },
  { q: 'Sans base technique, c\'est possible ?', a: 'Oui. Nos formations partent du niveau réel de vos équipes. 70 % de pratique, sur vos propres cas. On vous rend autonomes, pas dépendants.' },
  { q: 'Vous restez après le déploiement ?', a: 'Oui — c\'est le cœur de notre promesse. Une fois en production, on reste : maintenance, évolutions, nouvelles automatisations. La ligne ne s\'arrête pas à la livraison.' },
];
const FaqRow: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-gunmetal/20">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 py-8 text-left outline-none [touch-action:manipulation]">
        <span className="font-serif-display text-offwhite transition-colors duration-300 group-hover:text-gunmetal" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)' }}>
          {q}
        </span>
        <motion.span aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }}
          className="shrink-0 text-2xl leading-none text-gunmetal">+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 1, height: 'auto' } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ type: reduce ? 'tween' : 'spring', stiffness: 220, damping: 30, opacity: { duration: 0.25 } }}
            className="overflow-hidden">
            <p className="max-w-2xl pb-8 text-[17px] leading-relaxed text-offwhite/70">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const Faq: React.FC = () => (
  <section id="faq" className="section-clip relative px-5 md:px-8" style={{ paddingTop: 'var(--gap)', paddingBottom: 'var(--gap)' }}>
    <div className="mx-auto max-w-[1200px]">
      <Reveal><Eyebrow>Questions fréquentes</Eyebrow></Reveal>
      <Reveal delay={0.06} perspective>
        <h2 className="font-serif-display mb-12 text-offwhite" style={{ fontSize: 'clamp(40px, 8vw, 104px)' }}>
          Tout ce qu'on <span className="emph">nous demande.</span>
        </h2>
      </Reveal>
      <div className="border-t border-gunmetal/20">
        {FAQ_ITEMS.map((f) => <FaqRow key={f.q} q={f.q} a={f.a} />)}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------
// 11. CTA FINAL — « Le parcours commence par une conversation. »
// Prisme derrière. Calendly inline. Écho A → Z.
// ---------------------------------------------------------------------
const CtaFinal: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  return (
    <section id="contact" ref={ref}
      className="section-clip relative isolate overflow-hidden px-5 md:px-8" style={{ paddingTop: 'var(--gap)', paddingBottom: 'var(--gap)' }}>
      <Prism className="pointer-events-none absolute -left-[10%] top-1/2 h-[90vh] w-[70vh] max-w-[700px] -translate-y-1/2"
        scale={1} aberration={3.2} speed={30} rotate={-18} />
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(90% 90% at 30% 40%, rgba(73,87,100,0.2) 0%, rgba(73,87,100,0.7) 70%)' }} />

      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <Reveal><Eyebrow>30 minutes, gratuit</Eyebrow></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display text-offwhite" style={{ fontSize: 'clamp(44px, 9vw, 120px)' }}>
              Le parcours<br />commence par une <span className="emph">conversation.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-9 max-w-md text-[18px] leading-relaxed text-offwhite/70">
              On comprend votre contexte, on vous dit honnêtement où l'IA crée de la valeur chez vous.
              Sans engagement.
            </p>
          </Reveal>
          {/* écho A → Z */}
          <Reveal delay={0.16}>
            <div className="mt-9 flex items-center gap-3 font-serif-display text-offwhite/70" style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}>
              <span>De A…</span>
              <span className="text-offwhite emph">à Z<span className="prism-glyph">.</span></span>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10">
              <MagneticPrimary href={CALENDLY} external>Réserver mon créneau</MagneticPrimary>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="overflow-hidden border border-gunmetal/25">
            {inView && (
              <iframe
                title="Réserver un créneau de 30 minutes"
                src={CALENDLY_EMBED}
                loading="lazy"
                className="h-[640px] w-full border-0 sm:h-[700px]"
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 12. FOOTER — dispositif footer-reveal (rideau), canvas slate.
// ---------------------------------------------------------------------
const Footer: React.FC = () => {
  return (
    <footer className="footer-fixed isolate border-t border-gunmetal/25 px-5 py-16 md:px-8">
      <div className="relative z-10 w-full">
        <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-serif-display text-[40px] leading-none tracking-tight text-offwhite md:text-[52px]">
              AXEM<span className="prism-glyph">.</span>
            </a>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-offwhite/70">
              Votre partenaire IA, de A à Z. Audit, conseil, déploiement, formation, production &amp; suivi.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-5">Navigation</div>
            <ul className="space-y-3 text-[15px] text-offwhite/70">
              {NAV_LINKS.map(([l, h]) => (
                <li key={l}><a href={h} className="footer-link inline-block hover:text-offwhite">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-5">Contact</div>
            <ul className="space-y-3 text-[15px] text-offwhite/70">
              <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="footer-link inline-block hover:text-offwhite">Réserver un appel</a></li>
              <li><a href="mailto:contact@axem-ia.fr" className="footer-link inline-block hover:text-offwhite">contact@axem-ia.fr</a></li>
              <li><a href={CASES_URL} target="_blank" rel="noopener noreferrer" className="footer-link inline-block hover:text-offwhite">Cas clients</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-[1200px] border-t border-gunmetal/15 pt-6 text-center text-[13px] text-offwhite/50">
          © 2026 AXEM IA — Paris, France.
        </div>
      </div>
    </footer>
  );
};

// ---------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------
const Home: React.FC = () => {
  useLenis();
  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <div className="has-footer-reveal min-h-screen text-offwhite">
        <Nav />
        <main id="contenu" className="reveal-main">
          <Hero />
          <TrustBar />
          <Duo />
          <Probleme />
          <LazySection minHeight="300vh"><Metamorphose /></LazySection>
          <LazySection minHeight="420vh"><Parcours /></LazySection>
          <Resultats />
          <Formation />
          <Methode />
          <Roi />
          <Faq />
          <CtaFinal />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default Home;
