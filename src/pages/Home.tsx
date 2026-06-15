import React, { useRef } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValueEvent, useReducedMotion, useInView, MotionConfig,
} from 'framer-motion';
import Grainient from '../components/Grainient';
import { RiseWords, Reveal, CountUp, EASE, SPRING, reveal, revealMount, revealWatermark } from '../ui/motion';
import { PrimaryButton, SecondaryButton, MagneticPrimary } from '../ui/Button';
import { Ligne } from '../components/Ligne';
import { Metamorphose } from '../components/Metamorphose';
import { Parcours } from '../components/Parcours';

// =====================================================================
// AXEM IA — DIRECTION « 🅰️ LA LIGNE » — le parcours vivant.
// Une ligne lumineuse unique naît du « A » du hero et traverse TOUT le site
// sans jamais se rompre, reliant les étapes de l'offre. Le médium = le
// message : la continuité prouve « un seul interlocuteur, de A à Z, on reste ».
// DA navy conservée · moteur spring 320/60/1 · Grainient navy · boutons édito.
// =====================================================================

const ease = EASE;
const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const CASES_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

const AZUR = { color1: '#5B8CFF', color2: '#1E40AF', color3: '#05080F' } as const;
const NAVY = '#060912';

// ---------------------------------------------------------------------
// NAV — pilule flottante scroll-glass.
// ---------------------------------------------------------------------
const NAV_LINKS: [string, string][] = [
  ['Le duo', '#duo'], ['Métamorphose', '#metamorphose'],
  ['Parcours', '#parcours'], ['Résultats', '#resultats'], ['Méthode', '#methode'],
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

// ---------------------------------------------------------------------
// SECTION HEADER — eyebrow réutilisé.
// ---------------------------------------------------------------------
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="eyebrow mb-5 flex items-center gap-2.5 text-[11px] text-cyan">
    <span className="h-1.5 w-1.5 rounded-full bg-green" />{children}
  </div>
);

// ---------------------------------------------------------------------
// 0. HERO — H1 serif « Votre partenaire IA, de A à Z. »
// Le « A » se trace au load via un SVG (pathLength 0→1) puis la ligne globale
// prend le relais et file vers le bas. Léger pin au tout début (parallax).
// Compteur discret « ROI médian → 159 % ».
// ---------------------------------------------------------------------
const TracedA: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  // le « A » qui se dessine — naissance de la ligne. SVG inline, glow navy.
  <svg viewBox="0 0 120 120" className="ligne-head inline-block h-[0.82em] w-[0.82em] -translate-y-[0.04em] align-baseline" aria-hidden fill="none">
    <defs>
      <linearGradient id="heroA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7aa2ff" />
        <stop offset="1" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
    <motion.path
      d="M16 108 L60 14 L104 108 M34 76 L86 76"
      stroke="url(#heroA)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
      initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 1.4, ease: EASE, delay: 0.5 }}
    />
  </svg>
);

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const wmYRaw = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const y = reduce ? '0%' : yRaw;
  const wmY = reduce ? '0%' : wmYRaw;
  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-36 text-center md:px-8">
      <motion.div aria-hidden style={{ y }} className="pointer-events-none absolute inset-0 z-0">
        <Grainient
          className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.13} grainAmount={0.085} contrast={1.32}
          saturation={1.0} zoom={1.05} warpStrength={1.15}
        />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(95% 85% at 50% 42%, rgba(6,9,18,0.30) 0%, rgba(6,9,18,0.62) 58%, rgba(6,9,18,0.92) 100%)' }} />
      <div aria-hidden className="grid-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[28%]"
        style={{ background: `linear-gradient(180deg, transparent, ${NAVY})` }} />
      <motion.div aria-hidden style={{ y: wmY }}
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
        <motion.span
          {...revealWatermark(0.2, !!reduce)}
          className="serif-watermark font-serif-display text-cream/[0.05]"
          style={{ fontSize: 'clamp(140px, 40vw, 600px)' }}>
          A → Z
        </motion.span>
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
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

        <h1 aria-label="Votre partenaire IA, de A à Z."
          className="font-serif-display mt-8 leading-[0.92] tracking-[-0.02em] text-cream"
          style={{ fontSize: 'clamp(48px, 11vw, 120px)', transformPerspective: 1200 }}>
          <span aria-hidden>
            <RiseWords text="Votre partenaire IA," delay={0.3} stagger={0.08} />
            <br />
            <span className="aurora-solid italic inline-flex items-baseline gap-[0.12em]">
              <RiseWords text="de" delay={0.55} stagger={0.09} />
              {/* le A se trace — naissance de la ligne */}
              <TracedA reduce={!!reduce} />
              <RiseWords text="à Z." delay={0.7} stagger={0.09} />
            </span>
          </span>
        </h1>

        <motion.p
          {...revealMount(0.5, !!reduce)}
          className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-cream-soft md:text-xl">
          On audite, on déploie, on forme, on reste.
          <span className="text-cream"> Un seul interlocuteur, du premier diagnostic à votre autonomie.</span>
        </motion.p>

        <motion.div
          {...revealMount(0.7, !!reduce)}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <PrimaryButton href={CALENDLY} external size="lg">Réserver un appel</PrimaryButton>
          <SecondaryButton href="#resultats" size="lg">Voir nos résultats</SecondaryButton>
        </motion.div>

        {/* compteur discret ROI médian */}
        <motion.div {...revealMount(0.9, !!reduce)} className="mt-12 flex items-center gap-3 text-[13px] text-cream-dim">
          <span className="font-satoshi font-bold uppercase tracking-[0.18em]">ROI médian</span>
          <span className="h-px w-8 bg-gradient-to-r from-green to-cyan" />
          <span className="font-serif-display text-2xl text-cream"><CountUp to={159} suffix=" %" /></span>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 1. PREUVE (logos) — « Ils nous ont confié leur IA. » Marquee scroll-piloté.
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
  // marquee PILOTÉ par le scroll : translateX lié à la progression de la section
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xRaw = useTransform(scrollYProgress, [0, 1], ['2%', '-32%']);
  const x = reduce ? '0%' : xRaw;
  const row = [...LOGOS, ...LOGOS];
  return (
    <section ref={ref} aria-label="Ils nous ont confié leur IA" className="section-clip relative border-y border-green/10 py-14">
      <Reveal>
        <p className="eyebrow mb-8 text-center text-[11px] tracking-[0.3em] text-cream-dim">
          Ils nous ont confié leur IA
        </p>
      </Reveal>
      <div className="ticker-mask group relative overflow-hidden">
        <motion.div className="flex w-max items-center gap-14 md:gap-20" style={{ x }}>
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

// ---------------------------------------------------------------------
// 2. LE DUO — « Stratégie + Tech. 55 000 personnes nous suivent. »
// Les 2 portraits CONVERGENT vers le centre au scroll, la ligne passe entre
// eux. 2,6 M impressions/mois en count-up.
// ---------------------------------------------------------------------
const FOUNDERS = [
  { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC',
    role: 'Stratégie & Business IA',
    desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit, conseil et formation.",
    li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
  { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Polytechnique · Télécom Paris',
    role: 'Architecture IA, Tech & Déploiement',
    desc: "L'architecte. Je conçois et déploie les systèmes : agents, automatisations, intégrations en production.",
    li: 'https://www.linkedin.com/in/alexis-zeitoun/' },
];
const DuoCard: React.FC<{ f: typeof FOUNDERS[number]; conv: any }> = ({ f, conv }) => (
  <motion.div style={{ x: conv }}>
    <div className="group glass relative overflow-hidden rounded-3xl">
      <div className="relative overflow-hidden">
        <img src={f.img} alt={f.name} loading="lazy"
          className="aspect-[5/4] w-full object-cover grayscale transition-[filter,transform] duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04] group-hover:grayscale-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(7,11,22,0.85) 100%)' }} />
        <a href={f.li} target="_blank" rel="noopener noreferrer"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-green/90 text-[#06101F] shadow-lg transition-transform [transition-timing-function:var(--ease-out)] hover:scale-110"
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
const Duo: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  // convergence vers le centre : les cartes partent écartées, se rapprochent
  const leftRaw = useTransform(scrollYProgress, [0, 1], ['-7%', '0%']);
  const rightRaw = useTransform(scrollYProgress, [0, 1], ['7%', '0%']);
  const convL = reduce ? '0%' : leftRaw;
  const convR = reduce ? '0%' : rightRaw;
  return (
    <section id="duo" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal><Eyebrow>Le duo</Eyebrow></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
              Stratégie + Tech.<br /><span className="aurora-text italic">Un seul interlocuteur.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              On enseigne ce qu'on déploie. 55 000 personnes nous suivent — la stratégie et la
              technique dans la même équipe, pas de théorie hors-sol.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-14 grid gap-6 md:grid-cols-2">
          {FOUNDERS.map((f, i) => (
            <motion.div key={f.name} {...reveal(i * 0.12, !!reduce)}>
              <DuoCard f={f} conv={i === 0 ? convL : convR} />
            </motion.div>
          ))}
        </div>

        {/* impressions / mois en count-up */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-1 text-center">
            <span className="font-serif-display text-cream" style={{ fontSize: 'clamp(48px, 9vw, 92px)' }}>
              <CountUp to={2.6} decimals={1} suffix=" M" />
            </span>
            <span className="text-[12px] font-satoshi font-bold uppercase tracking-[0.18em] text-cream-dim">impressions LinkedIn / mois · 55 000 abonnés</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. LE PROBLÈME (before) — scène désaturée/lourde. La ligne devient rouge
// sombre, tendue (géré globalement par <Ligne> selon la progression scroll).
// ---------------------------------------------------------------------
const Probleme: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const y = reduce ? '0%' : yRaw;
  return (
    <section id="probleme" ref={ref}
      className="section-clip relative isolate flex min-h-[80svh] items-center justify-center overflow-hidden bg-ink px-5 md:px-8">
      {/* fond désaturé, lourd — gris-bleu sourd, pas de Grainient lumineux ici */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(80% 80% at 50% 50%, #0b0e16 0%, #07090f 70%, #050709 100%)' }} />
      <motion.div aria-hidden style={{ y }}
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
        <span className="serif-watermark font-serif-display text-[#ff3b53]/[0.06]" style={{ fontSize: 'clamp(110px, 30vw, 480px)' }}>
          aujourd'hui
        </span>
      </motion.div>
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal><div className="flex justify-center"><div className="eyebrow mb-5 flex items-center gap-2.5 text-[11px] text-[#ff5c70]"><span className="h-1.5 w-1.5 rounded-full bg-[#ff3b53]" />Le problème</div></div></Reveal>
        <Reveal delay={0.08} perspective>
          <p className="font-serif-display leading-[1.05] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 6vw, 76px)' }}>
            La saisie manuelle. Les heures perdues.
            <br /><span className="italic text-[#ff8a98]">L'IA qu'on teste sans jamais déployer.</span>
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-7 max-w-xl text-[16px] leading-relaxed text-cream-soft">
            Des outils empilés, des POC abandonnés, des équipes qui doutent. La promesse de
            l'IA reste une promesse. C'est là que la ligne se tend.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 6. LES RÉSULTATS — cartes parallaxe, chiffres count-up, détail hover-reveal.
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
    <section id="resultats" className="section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal><Eyebrow>Résultats</Eyebrow></Reveal>
            <Reveal delay={0.06} perspective>
              <h2 className="font-serif-display leading-[0.98] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(38px, 7vw, 84px)' }}>
                Des résultats.<br /><span className="aurora-text italic">Pas des slides.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="text-[16px] leading-relaxed text-cream-soft md:pb-3">
              Des chiffres réels, issus de missions menées de bout en bout. Anonymisés à la demande des clients.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-y-16">
          {KPIS.map((k, i) => (
            <motion.div key={i}
              {...reveal((i % 3) * 0.08, !!reduce)}
              className={i % 2 === 1 ? 'md:translate-y-6' : ''}>
              <div className="font-serif-display leading-[0.85] text-cream" style={{ fontSize: 'clamp(48px, 8vw, 104px)' }}>
                {k.val}
              </div>
              <div className="mt-3 max-w-[200px] text-[13px] font-medium leading-snug text-cream-soft">{k.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid gap-5 md:grid-cols-2">
          {CASES.map((c, i) => (
            <motion.article key={c.sector} tabIndex={0}
              {...reveal((i % 2) * 0.1, !!reduce)}
              whileHover={reduce ? undefined : { y: -6, boxShadow: '0 20px 60px rgba(91,140,255,.12)' }}
              className="group glass relative flex flex-col gap-4 overflow-hidden rounded-3xl p-7 outline-none focus-visible:-translate-y-1 md:p-9">
              <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.14em] text-cyan">{c.sector}</span>
              <div className="space-y-3 text-[14.5px] leading-relaxed">
                <p className="text-cream-soft"><span className="font-semibold text-cream">Problème · </span>{c.problem}</p>
                <p className="text-cream-soft"><span className="font-semibold text-cream">Solution · </span>{c.solution}</p>
              </div>
              <div className="mt-auto flex items-end justify-between border-t border-green/12 pt-5">
                <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.12em] text-cream-dim">Résultat</span>
                <span className="font-serif-display text-cream transition-[transform,color] duration-400 [transition-timing-function:var(--ease-out)] group-hover:text-green group-focus-within:text-green md:translate-y-1 md:opacity-70 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
                  style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>
                  {c.result}
                </span>
              </div>
              <p className="text-[12.5px] leading-snug text-cream-dim">{c.resultLabel}</p>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <SecondaryButton href={CASES_URL} external arrow>Voir tous les cas clients</SecondaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 7. LA FORMATION — « On forme vos équipes à faire sans nous. »
// 10 modules · 3 niveaux · 200–1250 € · 70 % pratique. Galerie drag horizontal
// + barre « 70 % » qui se remplit. Sans Qualiopi/OF.
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
const LEVEL_TINT: Record<string, string> = {
  'Découverte': 'text-mint border-mint/30',
  'Intermédiaire': 'text-cyan border-cyan/30',
  'Avancé': 'text-green border-green/30',
};
const Formation: React.FC = () => {
  const reduce = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  const inView = useInView(barRef, { once: true, margin: '-15%' });
  // drag horizontal (pointer) — translate via state, pas de lib
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
    <section id="formation" className="section-clip relative px-0 py-[clamp(120px,18vh,240px)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <Reveal><Eyebrow>La formation</Eyebrow></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
              On forme vos équipes<br /><span className="aurora-text italic">à faire sans nous.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              10 modules · 3 niveaux · 200 à 1 250 € par personne. On ne forme pas pour cocher
              une case : on forme pour que vos équipes utilisent l'IA dès le lendemain.
            </p>
          </Reveal>

          {/* barre 70 % pratique qui se remplit */}
          <div ref={barRef} className="mt-8 max-w-md">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[12px] font-satoshi font-bold uppercase tracking-[0.14em] text-cream-dim">Part de pratique</span>
              <span className="font-serif-display text-3xl text-cream">{inView ? <CountUp to={70} suffix=" %" /> : '0 %'}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-green to-cyan"
                initial={{ width: '0%' }}
                animate={inView ? { width: '70%' } : { width: '0%' }}
                transition={reduce ? { duration: 0 } : { duration: 1.4, ease: EASE }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* GALERIE drag horizontal — 10 modules */}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="drag-x mt-14 flex gap-5 overflow-x-auto px-5 pb-4 md:px-8">
        {CATALOGUE.map(([code, title, level, price], i) => (
          <motion.article
            key={code}
            {...reveal(Math.min(i, 4) * 0.06, !!reduce)}
            className="glass flex w-[78vw] max-w-[320px] shrink-0 select-none flex-col rounded-3xl p-7 md:w-[300px]">
            <span className={`self-start rounded-full border px-2.5 py-1 text-[10px] font-satoshi font-bold uppercase tracking-[0.12em] ${LEVEL_TINT[level]}`}>{level}</span>
            <span className="font-serif-display mt-5 text-lg text-green/50">{code}</span>
            <h3 className="font-serif-display mt-1 text-[26px] leading-[1.05] text-cream">{title}</h3>
            <div className="mt-auto flex items-end justify-between pt-8">
              <span className="font-serif-display text-4xl text-cream">{price}</span>
              <span className="text-[11px] font-satoshi font-bold uppercase tracking-[0.1em] text-cream-dim">/ pers.</span>
            </div>
          </motion.article>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-6xl px-5 text-[13px] text-cream-dim md:px-8">
        Glissez pour parcourir les 10 modules. Financement sur budget formation entreprise.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 8. LA MÉTHODE — Diagnostic → Orientation → Déploiement → Optimisation.
// Diagramme tracé par une ligne au scroll, nœuds qui s'illuminent.
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
  const [active, setActive] = React.useState<boolean[]>(() => STEPS.map(() => !!reduce));
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    setActive(STEPS.map((_, i) => p >= (i + 0.5) / STEPS.length - 0.05));
  });

  return (
    <section id="methode" className="section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/4 -z-[1] h-[50vh] w-[50vh] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(91,140,255,0.18), transparent 65%)' }} />
      <div className="mx-auto max-w-4xl text-center">
        <Reveal><div className="flex justify-center"><Eyebrow>La méthode</Eyebrow></div></Reveal>
        <Reveal delay={0.06} perspective>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6.5vw, 80px)' }}>
            Quatre temps.<br /><span className="aurora-text italic">Une seule ligne.</span>
          </h2>
        </Reveal>
      </div>

      <div ref={ref} className="relative mx-auto mt-16 max-w-2xl pl-12 md:pl-16">
        <svg aria-hidden className="pointer-events-none absolute left-[18px] top-2 h-full w-2 md:left-[26px]"
          viewBox="0 0 2 100" preserveAspectRatio="none" fill="none">
          <path d="M1 0 V100" stroke="rgba(120,160,255,0.14)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <motion.path d="M1 0 V100" stroke="url(#methGrad)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength }} />
          <defs>
            <linearGradient id="methGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5B8CFF" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
        <ol className="space-y-12 md:space-y-16">
          {STEPS.map((s, i) => (
            <li key={s.k} className="relative">
              <span aria-hidden data-on={active[i] ? 'true' : 'false'}
                className="ligne-node absolute -left-[38px] top-2 h-4 w-4 rounded-full border border-green/40 bg-ink md:-left-[50px]" />
              <Reveal delay={0.05 * i}>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="font-serif-display text-[30px] leading-none text-cream md:text-[40px]">{s.k}</h3>
                  <span className="rounded-full border border-green/30 px-3 py-1 text-[12px] font-satoshi font-bold uppercase tracking-[0.12em] text-green">{s.meta}</span>
                </div>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-cream-soft">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 9. LE ROI EN UN CHIFFRE — « 159 % » plein écran serif. La ligne fait une
// boucle autour du chiffre. Respiration max.
// ---------------------------------------------------------------------
const Roi: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'center center'] });
  const loop = reduce ? 1 : scrollYProgress;
  return (
    <section id="roi" className="section-clip relative isolate flex min-h-[90svh] items-center justify-center overflow-hidden bg-ink px-5 md:px-8">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.18), transparent 65%)' }} />
      <div ref={ref} className="relative z-10 flex flex-col items-center text-center">
        {/* la boucle SVG autour du chiffre — se trace au scroll */}
        <svg aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 400 400" fill="none">
          <motion.ellipse cx="200" cy="200" rx="185" ry="120"
            stroke="url(#roiGrad)" strokeWidth="2" strokeLinecap="round" className="ligne-path"
            style={{ pathLength: loop, rotate: -8 }} />
          <defs>
            <linearGradient id="roiGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5b8cff" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
        <Reveal><Eyebrow>Le ROI en un chiffre</Eyebrow></Reveal>
        <div className="font-serif-display leading-[0.8] text-cream" style={{ fontSize: 'clamp(120px, 28vw, 360px)' }}>
          <CountUp to={159} suffix=" %" />
        </div>
        <Reveal delay={0.1}>
          <p className="mt-4 text-[16px] text-cream-soft">Documenté, pas promis.</p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 10. FAQ — accordéons hover-reveal.
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
        <h2 className="font-serif-display mb-10 leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.5vw, 64px)' }}>
          Tout ce qu'on <span className="aurora-text italic">nous demande.</span>
        </h2>
      </Reveal>
      <div>
        {FAQ_ITEMS.map((f) => <FaqRow key={f.q} q={f.q} a={f.a} />)}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------
// 11. CTA FINAL — « Le parcours commence par une conversation. »
// La ligne trace le « Z » (écho au A). Calendly inline. « De A… à Z. »
// ---------------------------------------------------------------------
const TracedZ: React.FC<{ reduce: boolean; inView: boolean }> = ({ reduce, inView }) => (
  <svg viewBox="0 0 120 120" className="ligne-head inline-block h-[0.82em] w-[0.82em] align-baseline" aria-hidden fill="none">
    <defs>
      <linearGradient id="ctaZ" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7aa2ff" />
        <stop offset="1" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
    <motion.path
      d="M22 18 L98 18 L22 102 L98 102"
      stroke="url(#ctaZ)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
      initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
      animate={reduce || inView ? { pathLength: 1 } : { pathLength: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 1.5, ease: EASE }}
    />
  </svg>
);
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
        style={{ background: 'radial-gradient(90% 90% at 50% 40%, rgba(7,11,22,0.4) 0%, rgba(7,11,22,0.7) 65%, rgba(7,11,22,0.92) 100%)' }} />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="text-center lg:text-left">
          <Reveal><div className="flex justify-center lg:justify-start"><Eyebrow>30 minutes, gratuit</Eyebrow></div></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(38px, 6.5vw, 80px)' }}>
              Le parcours commence<br />par une <span className="aurora-text italic">conversation.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-cream-soft lg:mx-0">
              On comprend votre contexte, on vous dit honnêtement où l'IA crée de la valeur chez vous.
              Sans engagement.
            </p>
          </Reveal>
          {/* écho A → Z : la ligne a tracé le A au début, elle trace le Z ici */}
          <Reveal delay={0.16}>
            <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
              <span className="font-serif-display text-3xl italic text-cream-soft">De A…</span>
              <span className="font-serif-display text-3xl italic text-cream">à</span>
              <TracedZ reduce={!!reduce} inView={inView} />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
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

// ---------------------------------------------------------------------
// 12. FOOTER — dispositif « footer-reveal » (rideau).
// ---------------------------------------------------------------------
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
          style={{ background: 'radial-gradient(120% 120% at 50% 35%, rgba(7,11,22,0.35) 0%, rgba(7,11,22,0.55) 55%, rgba(7,11,22,0.82) 100%)' }} />
      </div>
      <div className="relative z-10 w-full">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-serif-display text-4xl leading-none tracking-tight text-cream md:text-5xl">
              AXEM<span className="aurora-text">.</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-soft">
              Votre partenaire IA, de A à Z. Audit, conseil, déploiement, formation, production &amp; suivi.
            </p>
          </div>
          <div>
            <div className="mb-4 text-[11px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
            <ul className="space-y-2 text-sm text-cream-soft">
              {NAV_LINKS.map(([l, h]) => (
                <li key={l}><a href={h} className="link-limitless hover:text-cream">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 text-[11px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
            <ul className="space-y-2 text-sm text-cream-soft">
              <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="link-limitless hover:text-cream">Réserver un appel</a></li>
              <li><a href="mailto:contact@axem-ia.fr" className="link-limitless hover:text-cream">contact@axem-ia.fr</a></li>
              <li><a href={CASES_URL} target="_blank" rel="noopener noreferrer" className="link-limitless hover:text-cream">Cas clients</a></li>
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

// ---------------------------------------------------------------------
// PAGE — l'ordre des sections suit le récit « LA LIGNE ».
// ---------------------------------------------------------------------
const Home: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      {/* LA LIGNE — overlay global fixé, continu, scroll-linked. */}
      <Ligne />
      <div className="has-footer-reveal min-h-screen text-cream">
        <Nav />
        <main id="contenu" className="reveal-main">
          {/* 0 Hero · 1 Preuve · 2 Duo · 3 Problème · 4 Métamorphose(WOW) ·
              5 Parcours 7 étapes · 6 Résultats · 7 Formation · 8 Méthode ·
              9 ROI · 10 FAQ · 11 CTA(Z) · 12 Footer */}
          <Hero />
          <TrustBar />
          <Duo />
          <Probleme />
          <Metamorphose />
          <Parcours />
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
