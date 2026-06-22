import React, { useRef } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValueEvent, useReducedMotion, useInView, MotionConfig,
} from 'framer-motion';
import Grainient from '../components/Grainient';
import { RiseWords, Reveal, CountUp, EASE, reveal, revealMount } from '../ui/motion';
import { PrimaryButton, SecondaryButton, MagneticPrimary } from '../ui/Button';
import { Metamorphose } from '../components/Metamorphose';
import { Parcours } from '../components/Parcours';
import { useLenis } from '../ui/useLenis';
import { LazySection } from '../ui/LazySection';

// =====================================================================
// AXEM IA — SYSTÈME « monopo saigon » (darkroom éditorial cinématique).
// Canvas monochrome : alternance de frames NOIRES immersives (hero, duo,
// manifeste, ROI, CTA) ↔ bandes BLANCHES éditoriales (preuve, cas, formation,
// méthode, FAQ). Le contraste blanc↔noir EST le rythme. Inter weight 300.
// Grainient recoloré (mercury organique : verts/ambre/cuivre/oxblood) CONFINÉ
// aux frames noires comme « rendu 3D ». Le duo très en avant. Hero conservé.
// =====================================================================

const ease = EASE;
const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const CASES_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

// RENDU 3D ORGANIQUE — palette mercury sombre (verts / ambre / cuivre / oxblood),
// la SEULE couleur du site, confinée aux frames noires comme « liquide » 3D.
// color1 = fuite lumineuse · color2 = corps organique · color3 = noir profond.
const MERCURY = { color1: '#3a5e4a', color2: '#6b4a2a', color3: '#050403' } as const;       // hero — vert/cuivre
const MERCURY_2 = { color1: '#5a2e22', color2: '#2a3a30', color3: '#050304' } as const;     // CTA — oxblood/vert

// ---------------------------------------------------------------------
// NAV — pilule flottante transparente (sur hero noir) → blanche au scroll.
// ---------------------------------------------------------------------
const NAV_LINKS: [string, string][] = [
  ['Le duo', '#duo'], ['Parcours', '#parcours'],
  ['Cas clients', '#resultats'], ['Formation', '#formation'],
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
        className="nav-pill flex w-full max-w-3xl items-center justify-between gap-3 rounded-full py-2.5 pl-6 pr-2.5 text-white">
        <a href="#top" className="nav-ink font-serif-display text-xl font-normal leading-none tracking-tight text-white hover:opacity-80 [touch-action:manipulation]">
          AXEM
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h}
              className="nav-ink-soft link-limitless relative text-[13px] font-normal text-white/70 hover:text-white [touch-action:manipulation]">
              {l}
            </a>
          ))}
        </div>
        <SecondaryButton href={CALENDLY} external size="sm" className="!py-2.5">Réserver un appel</SecondaryButton>
      </nav>
    </header>
  );
};

// ---------------------------------------------------------------------
// EYEBROW — 10px, caps, tracking large. Monochrome (gris contextuel).
// ---------------------------------------------------------------------
const Eyebrow: React.FC<{ children: React.ReactNode; tone?: 'light' | 'dark' }> = ({ children, tone = 'light' }) => (
  <div className={`eyebrow mb-6 flex items-center gap-3 ${tone === 'dark' ? 'text-white/55' : 'text-ash'}`}>
    <span className={`h-px w-7 ${tone === 'dark' ? 'bg-white/40' : 'bg-carbon/40'}`} />{children}
  </div>
);

// ---------------------------------------------------------------------
// 0. HERO — frame NOIRE. « Votre partenaire IA, de A à Z. » Inter weight 300,
// échelle extrême (clamp jusqu'à ~200px), line-height 0.76, blanc, centré sur
// le Grainient mercury (rendu 3D organique). Indicateur SCROLL bas-gauche.
// ---------------------------------------------------------------------
// le « A » du « de A à Z. » — glyphe monochrome (trait blanc fin), pas de glow.
const AccentA: React.FC = () => (
  <svg viewBox="0 0 120 120" className="accent-glyph inline-block h-[0.78em] w-[0.78em] -translate-y-[0.03em] align-baseline" aria-hidden fill="none">
    <path
      d="M16 108 L60 14 L104 108 M34 76 L86 76"
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

// indicateur SCROLL TO EXPLORE — cercle bas-gauche, texte circulaire + flèche.
const ScrollIndicator: React.FC = () => (
  <div className="pointer-events-none absolute bottom-8 left-5 z-20 hidden h-[92px] w-[92px] md:left-8 md:flex md:items-center md:justify-center">
    <svg viewBox="0 0 100 100" className="scroll-ring absolute h-full w-full text-white/55" aria-hidden>
      <defs>
        <path id="scrollCircle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
      </defs>
      <text className="font-serif-display" fontSize="9.5" letterSpacing="3.4" fill="currentColor">
        <textPath href="#scrollCircle" startOffset="0%">SCROLL · TO · EXPLORE · </textPath>
      </text>
    </svg>
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/70" fill="none" aria-hidden>
      <path d="M12 5 V19 M6 13 L12 19 L18 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const y = reduce ? '0%' : yRaw;
  return (
    <section id="top" ref={ref} className="frame-dark relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-28 pt-36 text-center md:px-8">
      {/* RENDU 3D ORGANIQUE — Grainient mercury plein cadre, CONFINÉ au hero noir */}
      <motion.div aria-hidden style={{ y }} className="pointer-events-none absolute inset-0 z-0">
        <Grainient
          className="h-full w-full"
          color1={MERCURY.color1} color2={MERCURY.color2} color3={MERCURY.color3}
          timeSpeed={reduce ? 0 : 0.11} grainAmount={0.10} contrast={1.42}
          saturation={0.92} zoom={1.08} warpStrength={1.2}
        />
      </motion.div>
      {/* vignette noire — masque le rendu en bords, le confine en « liquide » central */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(95% 88% at 50% 44%, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.72) 56%, #000 100%)' }} />
      <div aria-hidden className="grid-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[26%]"
        style={{ background: 'linear-gradient(180deg, transparent, #000)' }} />

      <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center">
        {/* CASCADE — eyebrow .1 · H1 .3 · sous-titre .5 · boutons .7 */}
        <motion.div {...revealMount(0.1, !!reduce)}
          className="eyebrow flex items-center gap-3 text-white/55">
          <span className="h-px w-7 bg-white/40" />
          Agence d'IA · Formation
        </motion.div>

        {/* H1 — Inter weight 300, échelle EXTRÊME, line-height 0.76, blanc.
            Le « A » du « de A à Z. » = glyphe monochrome. */}
        <h1 aria-label="Votre partenaire IA, de A à Z."
          className="font-serif-display mt-10 text-white"
          style={{ fontSize: 'clamp(56px, 14vw, 200px)', lineHeight: 0.78, letterSpacing: '-0.035em', transformPerspective: 1200 }}>
          <span aria-hidden>
            <RiseWords text="Votre partenaire IA," delay={0.3} stagger={0.08} />
            <br />
            <span className="aurora-solid inline-flex items-baseline gap-[0.1em]">
              <RiseWords text="de" delay={0.55} stagger={0.09} />
              <AccentA />
              <RiseWords text="à Z." delay={0.7} stagger={0.09} />
            </span>
          </span>
        </h1>

        <motion.p {...revealMount(0.5, !!reduce)}
          className="mt-10 max-w-2xl text-balance text-lg font-light leading-[1.5] text-white/72 md:text-xl">
          On forme vos équipes, on conseille votre stratégie, on déploie vos automatisations.
          <span className="font-semibold text-white"> Et on reste.</span>
        </motion.p>

        <motion.div {...revealMount(0.7, !!reduce)}
          className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <PrimaryButton href={CALENDLY} external size="lg">Réserver un appel</PrimaryButton>
          <SecondaryButton href="#resultats" size="lg">Voir les cas clients</SecondaryButton>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

// ---------------------------------------------------------------------
// 1. PREUVE (logos) — bande BLANCHE éditoriale. Marquee scroll-piloté, N&B.
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
    <section ref={ref} aria-label="Ils nous ont confié leur IA" className="frame-light section-clip relative border-b border-carbon/10 py-16">
      <Reveal>
        <p className="eyebrow mb-10 text-center text-ash">
          Ils nous ont confié leur IA
        </p>
      </Reveal>
      <div className="ticker-mask group relative overflow-hidden">
        <motion.div className="flex w-max items-center gap-16 md:gap-24" style={{ x }}>
          {row.map(([name, src], i) => (
            <span key={name + i} className="logo-chip shrink-0" title={name}>
              <img src={src} alt={name} loading="lazy"
                className="h-7 w-auto max-w-[150px] object-contain md:h-8" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 2. LE DUO — TRÈS EN AVANT. Frame NOIRE éditoriale. Gros noms weight 300,
// portraits N&B. « On enseigne ce qu'on déploie. » Les portraits convergent.
// ---------------------------------------------------------------------
const FOUNDERS = [
  { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', followers: '~40 000 abonnés',
    role: 'Stratégie & Business IA',
    desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit, conseil et formation.",
    li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
  { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Polytechnique · Télécom Paris', followers: '~15–20 000 abonnés',
    role: 'Architecture IA, Tech & Déploiement',
    desc: "L'architecte. Je conçois et déploie les systèmes : agents, automatisations, intégrations en production.",
    li: 'https://www.linkedin.com/in/alexis-zeitoun/' },
];
const DuoCard: React.FC<{ f: typeof FOUNDERS[number]; conv: any }> = ({ f, conv }) => (
  <motion.div style={{ x: conv }}>
    <div className="group relative">
      <div className="relative overflow-hidden">
        <img src={f.img} alt={f.name} loading="lazy"
          className="aspect-[5/6] w-full object-cover grayscale contrast-[1.05] transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.03]" />
        <a href={f.li} target="_blank" rel="noopener noreferrer"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-transform [transition-timing-function:var(--ease-out)] hover:scale-110"
          aria-label={`LinkedIn ${f.name}`}>
          <span className="text-[14px] font-medium">in</span>
        </a>
      </div>
      <div className="pt-7">
        <p className="eyebrow text-white/45">{f.school} · {f.followers}</p>
        <h3 className="font-serif-display mt-3 text-white" style={{ fontSize: 'clamp(40px, 5.5vw, 78px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}>{f.name}</h3>
        <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.12em] text-white/60">{f.role}</p>
        <p className="mt-5 max-w-md text-[16px] font-light leading-[1.5] text-white/70">{f.desc}</p>
      </div>
    </div>
  </motion.div>
);
const Duo: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const leftRaw = useTransform(scrollYProgress, [0, 1], ['-6%', '0%']);
  const rightRaw = useTransform(scrollYProgress, [0, 1], ['6%', '0%']);
  const convL = reduce ? '0%' : leftRaw;
  const convR = reduce ? '0%' : rightRaw;
  return (
    <section id="duo" className="frame-dark section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-3xl">
          <Reveal><Eyebrow tone="dark">Le duo · Personal branding</Eyebrow></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display text-white" style={{ fontSize: 'clamp(44px, 8vw, 110px)', lineHeight: 0.88, letterSpacing: '-0.035em' }}>
              Stratégie + Tech.<br /><span className="italic font-light">Un seul interlocuteur.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-xl text-[18px] font-light leading-[1.55] text-white/72">
              On enseigne ce qu'on déploie. <span className="font-semibold text-white">55 000 personnes</span> nous suivent —
              la stratégie et la technique dans la même équipe, pas de théorie hors-sol.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-20 grid gap-12 md:grid-cols-2 md:gap-16">
          {FOUNDERS.map((f, i) => (
            <motion.div key={f.name} {...reveal(i * 0.12, !!reduce)}>
              <DuoCard f={f} conv={i === 0 ? convL : convR} />
            </motion.div>
          ))}
        </div>

        {/* preuve sociale — gros chiffre weight 300, monochrome */}
        <Reveal delay={0.1}>
          <div className="mt-24 grid gap-px border-t border-white/14 sm:grid-cols-3">
            {[
              { v: <CountUp to={55} suffix=" k" />, l: 'abonnés cumulés LinkedIn' },
              { v: <CountUp to={2.6} decimals={1} suffix=" M" />, l: "impressions / mois" },
              { v: <span className="italic">de A&nbsp;à&nbsp;Z</span>, l: 'on enseigne ce qu\'on déploie' },
            ].map((s, i) => (
              <div key={i} className="pt-10 text-center sm:px-6">
                <div className="font-serif-display text-white" style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.85, letterSpacing: '-0.03em' }}>{s.v}</div>
                <div className="mt-4 text-[12px] uppercase tracking-[0.16em] text-white/50">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. LE MANIFESTE / PROBLÈME — frame NOIRE. Watermark « aujourd'hui »
// monochrome très faible. Tension narrative avant la métamorphose.
// ---------------------------------------------------------------------
const Probleme: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const y = reduce ? '0%' : yRaw;
  return (
    <section id="probleme" ref={ref}
      className="frame-dark section-clip relative isolate flex min-h-[82svh] items-center justify-center overflow-hidden px-5 md:px-8">
      <motion.div aria-hidden style={{ y }}
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
        <span className="serif-watermark text-white/[0.045]" style={{ fontSize: 'clamp(110px, 30vw, 480px)' }}>
          aujourd'hui
        </span>
      </motion.div>
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Reveal><div className="flex justify-center"><Eyebrow tone="dark">Le problème</Eyebrow></div></Reveal>
        <Reveal delay={0.08} perspective>
          <p className="font-serif-display text-white" style={{ fontSize: 'clamp(36px, 6.5vw, 92px)', lineHeight: 0.96, letterSpacing: '-0.03em' }}>
            La saisie manuelle. Les heures perdues.
            <br /><span className="italic font-light text-white/65">L'IA qu'on teste sans jamais déployer.</span>
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-9 max-w-xl text-[18px] font-light leading-[1.55] text-white/68">
            Des outils empilés, des POC abandonnés, des équipes qui doutent. La promesse de
            l'IA reste une promesse. C'est là que tout commence.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 6. LES RÉSULTATS — bande BLANCHE éditoriale 3-col. Chiffres count-up
// weight 300, cas en hairlines (cartes invisibles).
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
    <section id="resultats" className="frame-light section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-end gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal><Eyebrow>Résultats</Eyebrow></Reveal>
            <Reveal delay={0.06} perspective>
              <h2 className="font-serif-display text-carbon" style={{ fontSize: 'clamp(44px, 8vw, 100px)', lineHeight: 0.9, letterSpacing: '-0.035em' }}>
                Des résultats.<br /><span className="italic font-light text-ash">Pas des slides.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="text-[18px] font-light leading-[1.55] text-ash md:pb-3">
              Des chiffres réels, issus de missions menées de bout en bout. Anonymisés à la demande des clients.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3 md:gap-y-16">
          {KPIS.map((k, i) => (
            <motion.div key={i} {...reveal((i % 3) * 0.08, !!reduce)}>
              <div className="font-serif-display text-carbon" style={{ fontSize: 'clamp(52px, 9vw, 116px)', lineHeight: 0.82, letterSpacing: '-0.04em' }}>
                {k.val}
              </div>
              <div className="mt-4 max-w-[220px] text-[14px] font-light leading-snug text-ash">{k.label}</div>
            </motion.div>
          ))}
        </div>

        {/* cas — cartes INVISIBLES, séparées par hairlines */}
        <div className="mt-28 grid gap-x-12 md:grid-cols-2">
          {CASES.map((c, i) => (
            <motion.article key={c.sector} tabIndex={0}
              {...reveal((i % 2) * 0.1, !!reduce)}
              className="case-card group relative flex flex-col gap-5 py-9 outline-none">
              <div className="flex items-baseline justify-between gap-4">
                <span className="eyebrow text-ash">{c.sector}</span>
                <span className="font-serif-display text-carbon transition-opacity duration-500 md:opacity-60 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                  style={{ fontSize: 'clamp(40px, 6vw, 68px)', lineHeight: 0.85, letterSpacing: '-0.03em' }}>
                  {c.result}
                </span>
              </div>
              <div className="space-y-3 text-[15px] font-light leading-[1.55]">
                <p className="text-ash"><span className="font-semibold text-carbon">Problème · </span>{c.problem}</p>
                <p className="text-ash"><span className="font-semibold text-carbon">Solution · </span>{c.solution}</p>
              </div>
              <p className="text-[13px] leading-snug text-smoke">{c.resultLabel}</p>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 flex justify-center">
            <SecondaryButton href={CASES_URL} external arrow>Voir tous les cas clients</SecondaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 7. LA FORMATION — bande BLANCHE éditoriale. 10 modules · 200–1250 €
// · 70 % pratique. Galerie drag horizontal + barre « 70 % ». Sans Qualiopi/OF.
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
    <section id="formation" className="frame-light section-clip relative px-0 py-[clamp(120px,18vh,240px)]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="max-w-3xl">
          <Reveal><Eyebrow>La formation</Eyebrow></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display text-carbon" style={{ fontSize: 'clamp(40px, 7vw, 92px)', lineHeight: 0.9, letterSpacing: '-0.035em' }}>
              On forme vos équipes<br /><span className="italic font-light text-ash">à faire sans nous.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-xl text-[18px] font-light leading-[1.55] text-ash">
              10 modules · 3 niveaux · 200 à 1 250 € par personne. On ne forme pas pour cocher
              une case : on forme pour que vos équipes utilisent l'IA dès le lendemain.
            </p>
          </Reveal>

          {/* barre 70 % pratique — fill monochrome (encre) */}
          <div ref={barRef} className="mt-10 max-w-md">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="eyebrow text-ash">Part de pratique</span>
              <span className="font-serif-display text-3xl text-carbon">{inView ? <CountUp to={70} suffix=" %" /> : '0 %'}</span>
            </div>
            <div className="h-px w-full bg-carbon/12">
              <motion.div
                className="h-px bg-carbon"
                initial={{ width: '0%' }}
                animate={inView ? { width: '70%' } : { width: '0%' }}
                transition={reduce ? { duration: 0 } : { duration: 1.4, ease: EASE }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* GALERIE drag horizontal — 10 modules, cartes invisibles (hairline top) */}
      <div ref={trackRef}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        className="drag-x mt-16 flex gap-px overflow-x-auto px-5 md:px-8">
        {CATALOGUE.map(([code, title, level, price]) => (
          <motion.article key={code}
            className="flex w-[72vw] max-w-[300px] shrink-0 select-none flex-col border-t border-carbon/14 pt-6 pr-8 md:w-[280px]">
            <div className="flex items-center justify-between">
              <span className="font-serif-display text-sm text-smoke">{code}</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-smoke">{level}</span>
            </div>
            <h3 className="font-serif-display mt-6 text-carbon" style={{ fontSize: 'clamp(22px, 3vw, 28px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>{title}</h3>
            <div className="mt-auto flex items-end justify-between pt-10">
              <span className="font-serif-display text-3xl text-carbon">{price}</span>
              <span className="text-[11px] uppercase tracking-[0.1em] text-smoke">/ pers.</span>
            </div>
          </motion.article>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-[1280px] px-5 text-[14px] font-light text-smoke md:px-8">
        Glissez pour parcourir les 10 modules. Financement sur budget formation entreprise.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 8. LA MÉTHODE — bande BLANCHE éditoriale. Diagramme tracé par une ligne
// au scroll, nœuds qui s'illuminent (monochrome).
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
    <section id="methode" className="frame-light section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal><div className="flex justify-center"><Eyebrow>La méthode</Eyebrow></div></Reveal>
        <Reveal delay={0.06} perspective>
          <h2 className="font-serif-display text-carbon" style={{ fontSize: 'clamp(40px, 7vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.035em' }}>
            Quatre temps.<br /><span className="italic font-light text-ash">Une seule ligne.</span>
          </h2>
        </Reveal>
      </div>

      <div ref={ref} className="relative mx-auto mt-20 max-w-2xl pl-12 md:pl-16">
        <svg aria-hidden className="pointer-events-none absolute left-[18px] top-2 h-full w-2 md:left-[26px]"
          viewBox="0 0 2 100" preserveAspectRatio="none" fill="none">
          <path d="M1 0 V100" stroke="rgba(24,24,24,0.12)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <motion.path d="M1 0 V100" stroke="#181818" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength }} />
        </svg>
        <ol className="space-y-14 md:space-y-16">
          {STEPS.map((s, i) => (
            <li key={s.k} className="relative">
              <span aria-hidden data-on={i < activeCount ? 'true' : 'false'}
                className="ligne-node absolute -left-[38px] top-2 h-4 w-4 rounded-full border border-carbon/35 bg-white md:-left-[50px]" />
              <Reveal delay={0.05 * i}>
                <div className="flex flex-wrap items-baseline gap-4">
                  <h3 className="font-serif-display text-carbon" style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1, letterSpacing: '-0.025em' }}>{s.k}</h3>
                  <span className="rounded-full border border-carbon/25 px-3.5 py-1 text-[12px] uppercase tracking-[0.12em] text-ash">{s.meta}</span>
                </div>
                <p className="mt-4 max-w-xl text-[16px] font-light leading-[1.55] text-ash">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 9. LE ROI EN UN CHIFFRE — frame NOIRE immersive. « 159 % » plein écran,
// weight 300. Une boucle hairline blanche se trace autour au scroll.
// ---------------------------------------------------------------------
const Roi: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'center center'] });
  const loop = reduce ? 1 : scrollYProgress;
  return (
    <section id="roi" className="frame-dark section-clip relative isolate flex min-h-[92svh] items-center justify-center overflow-hidden px-5 md:px-8">
      <div ref={ref} className="relative z-10 flex flex-col items-center text-center">
        <svg aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[155%] w-[150%] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 400 400" fill="none">
          <motion.ellipse cx="200" cy="200" rx="185" ry="120"
            stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" className="accent-stroke"
            style={{ pathLength: loop, rotate: -8 }} />
        </svg>
        <Reveal><Eyebrow tone="dark">Le ROI en un chiffre</Eyebrow></Reveal>
        <div className="font-serif-display text-white" style={{ fontSize: 'clamp(120px, 30vw, 380px)', lineHeight: 0.8, letterSpacing: '-0.05em' }}>
          <CountUp to={159} suffix=" %" />
        </div>
        <Reveal delay={0.1}>
          <p className="mt-6 text-[18px] font-light text-white/65">Documenté, pas promis.</p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 10. FAQ — bande BLANCHE éditoriale. Accordéons hairline.
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
    <div className="border-b border-carbon/14">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 py-7 text-left outline-none [touch-action:manipulation]">
        <span className="relative font-serif-display text-carbon" style={{ fontSize: 'clamp(22px, 3.2vw, 32px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {q}
          <span aria-hidden className="absolute -bottom-1 left-0 h-px w-0 bg-carbon/60 transition-[width] duration-300 [transition-timing-function:var(--ease-out)] group-hover:w-full group-focus-visible:w-full" />
        </span>
        <motion.span aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }}
          className="shrink-0 text-2xl font-light leading-none text-carbon">+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 1, height: 'auto' } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ type: reduce ? 'tween' : 'spring', stiffness: 220, damping: 30, opacity: { duration: 0.25 } }}
            className="overflow-hidden">
            <p className="max-w-2xl pb-7 text-[16px] font-light leading-[1.55] text-ash">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const Faq: React.FC = () => (
  <section id="faq" className="frame-light section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
    <div className="mx-auto max-w-3xl">
      <Reveal><Eyebrow>Questions fréquentes</Eyebrow></Reveal>
      <Reveal delay={0.06} perspective>
        <h2 className="font-serif-display mb-12 text-carbon" style={{ fontSize: 'clamp(34px, 5.5vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
          Tout ce qu'on <span className="italic font-light text-ash">nous demande.</span>
        </h2>
      </Reveal>
      <div>
        {FAQ_ITEMS.map((f) => <FaqRow key={f.q} q={f.q} a={f.a} />)}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------
// 11. CTA FINAL — frame NOIRE immersive (Grainient mercury #2). Le « Z »
// fait écho au « A » du hero (glyphe monochrome). Calendly inline.
// ---------------------------------------------------------------------
const AccentZ: React.FC = () => (
  <svg viewBox="0 0 120 120" className="accent-glyph inline-block h-[0.78em] w-[0.78em] align-baseline" aria-hidden fill="none">
    <path
      d="M22 18 L98 18 L22 102 L98 102"
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);
const CtaFinal: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  return (
    <section id="contact" ref={ref}
      className="frame-dark section-clip relative isolate overflow-hidden px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      {/* RENDU 3D ORGANIQUE — Grainient mercury #2 confiné à cette frame noire */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Grainient
          className="h-full w-full"
          color1={MERCURY_2.color1} color2={MERCURY_2.color2} color3={MERCURY_2.color3}
          timeSpeed={reduce ? 0 : 0.12} grainAmount={0.10} contrast={1.4}
          saturation={0.9} zoom={1.02} warpStrength={1.12}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(92% 92% at 50% 42%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.78) 62%, #000 100%)' }} />

      <div className="relative z-10 mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div className="text-center lg:text-left">
          <Reveal><div className="flex justify-center lg:justify-start"><Eyebrow tone="dark">30 minutes, gratuit</Eyebrow></div></Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display text-white" style={{ fontSize: 'clamp(42px, 7vw, 96px)', lineHeight: 0.9, letterSpacing: '-0.035em' }}>
              Le parcours commence<br />par une <span className="italic font-light text-white/70">conversation.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-8 max-w-md text-[18px] font-light leading-[1.55] text-white/70 lg:mx-0">
              On comprend votre contexte, on vous dit honnêtement où l'IA crée de la valeur chez vous.
              Sans engagement.
            </p>
          </Reveal>
          {/* écho A → Z : glyphes monochromes, du A du hero au Z ici */}
          <Reveal delay={0.16}>
            <div className="mt-10 flex items-center justify-center gap-3 text-white/80 lg:justify-start">
              <span className="font-serif-display text-3xl font-light italic text-white/55">De A…</span>
              <span className="font-serif-display text-3xl font-light italic">à</span>
              <AccentZ />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex justify-center lg:justify-start">
              <MagneticPrimary href={CALENDLY} external>Réserver mon créneau</MagneticPrimary>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="overflow-hidden border border-white/14 bg-white">
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
// 12. FOOTER — frame CARBON #181818, dispositif « footer-reveal » (rideau).
// ---------------------------------------------------------------------
const Footer: React.FC = () => {
  return (
    <footer className="frame-carbon footer-fixed isolate px-5 py-16 md:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: '#181818' }} />
      <div className="relative z-10 w-full">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="font-serif-display text-5xl font-light leading-none tracking-tight text-white">
              AXEM
            </a>
            <p className="mt-5 max-w-xs text-[15px] font-light leading-[1.55] text-white/60">
              Votre partenaire IA, de A à Z. Audit, conseil, déploiement, formation, production &amp; suivi.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-5 text-white/45">Navigation</div>
            <ul className="space-y-3 text-[15px] font-light text-white/65">
              {NAV_LINKS.map(([l, h]) => (
                <li key={l}><a href={h} className="footer-link link-limitless inline-block hover:text-white">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-5 text-white/45">Contact</div>
            <ul className="space-y-3 text-[15px] font-light text-white/65">
              <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="footer-link link-limitless inline-block hover:text-white">Réserver un appel</a></li>
              <li><a href="mailto:contact@axem-ia.fr" className="footer-link link-limitless inline-block hover:text-white">contact@axem-ia.fr</a></li>
              <li><a href={CASES_URL} target="_blank" rel="noopener noreferrer" className="footer-link link-limitless inline-block hover:text-white">Cas clients</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-5xl border-t border-white/10 pt-7 text-center text-[13px] text-white/40">
          © 2026 AXEM IA — Paris, France.
        </div>
      </div>
    </footer>
  );
};

// ---------------------------------------------------------------------
// PAGE — rythme : frame NOIRE immersive ↔ bande BLANCHE éditoriale.
// hero(noir) · preuve(blanc) · DUO(noir) · manifeste(noir) · métamorphose ·
// parcours · résultats(blanc) · formation(blanc) · méthode(blanc) ·
// ROI(noir) · FAQ(blanc) · CTA(noir) · footer(carbon).
// ---------------------------------------------------------------------
const Home: React.FC = () => {
  useLenis();
  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <div className="has-footer-reveal min-h-screen">
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
