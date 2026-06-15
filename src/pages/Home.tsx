import React, { useRef } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValueEvent, useReducedMotion, useInView, MotionConfig,
} from 'framer-motion';
import Grainient from '../components/Grainient';
import { Reveal, CountUp, EASE } from '../ui/motion';
import { PrimaryButton, SecondaryButton } from '../ui/Button';

// =====================================================================
// AXEM IA — 🅱️ « LE MANIFESTE »
// Une REVUE éditoriale premium publiée par deux auteurs (Clément & Alexis).
// Typo serif éditoriale, mise en page de magazine, filets fins, folios.
// Micro-interactions tactiles RETENUES : le mouvement est un luxe qu'on
// dépense rarement. Le « wow » naît de la justesse typographique et de la
// retenue — PAS de l'effet. Fond navy profond conservé.
//
// LA SEULE anim riche = la couverture (hero, révélé ligne par ligne par un
// masque vertical). LE WOW = le filet vertical « A → Z » de la méthode, qui
// s'encre du haut vers le bas, piloté au scroll (réversible, synchrone).
//
// transform/opacity/clip-path/SVG only. MotionConfig reducedMotion="user".
// =====================================================================

const ease = EASE;
const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const CASES_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const LI_CLEMENT = 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/';
const LI_ALEXIS = 'https://www.linkedin.com/in/alexis-zeitoun/';

// Grainient — variante navy « azur », dépensée RAREMENT (couverture + colophon).
const AZUR = { color1: '#5B8CFF', color2: '#1E40AF', color3: '#05080F' } as const;
const NAVY = '#060912';

// =====================================================================
// NAV — masthead réduit. Filet inférieur au scroll, pas de pilule, pas de
// glow. Le minimum : wordmark serif + ancres en petites capitales + rendez-vous.
// =====================================================================
const NAV_LINKS: [string, string][] = [
  ['Les auteurs', '#auteurs'],
  ['Au sommaire', '#sommaire'],
  ['Les cas', '#feature-1'],
  ['La méthode', '#methode'],
];
const Nav: React.FC = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 60;
    setScrolled((prev) => (prev === next ? prev : next));
  });
  return (
    <header
      data-scrolled={scrolled ? 'true' : 'false'}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500 [transition-timing-function:var(--ease-out)]"
      style={{
        backgroundColor: scrolled ? 'rgba(6,9,18,0.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--rule)' : 'transparent'}`,
      }}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="#top" className="font-serif-display text-2xl leading-none tracking-tight text-cream [touch-action:manipulation] md:text-[26px]">
          AXEM
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h}
              className="link-rule text-[12px] font-satoshi font-bold uppercase tracking-[0.18em] text-cream-soft hover:text-cream [touch-action:manipulation]">
              {l}
            </a>
          ))}
        </div>
        <SecondaryButton href={CALENDLY} external size="sm">Le rendez-vous</SecondaryButton>
      </nav>
    </header>
  );
};

// =====================================================================
// HERO « LA COUVERTURE » — masthead + H1 serif fer à gauche révélé ligne par
// ligne par un MASQUE VERTICAL (clip-path qui remonte, ~420ms, stagger 70ms).
// Grainient navy dépensé ICI (le seul moment riche). Filet inférieur + 3 folios.
// =====================================================================
const CoverLine: React.FC<{ children: React.ReactNode; delay: number; reduce: boolean }> = ({ children, delay, reduce }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (reduce) { setShown(true); return; }
    const id = window.setTimeout(() => setShown(true), delay * 1000);
    return () => window.clearTimeout(id);
  }, [delay, reduce]);
  return (
    <span ref={ref} className={`cover-line ${shown ? 'is-in' : ''}`} style={{ transitionDelay: '0ms' }}>
      <span>{children}</span>
    </span>
  );
};

const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const y = reduce ? '0%' : yRaw;
  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-12 pt-28 md:px-8 md:pb-16">
      {/* Grainient navy plein cadre — dépensé une seule fois, ici. */}
      <motion.div aria-hidden style={{ y }} className="pointer-events-none absolute inset-0 z-0">
        <Grainient
          className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.11} grainAmount={0.085} contrast={1.34}
          saturation={0.96} zoom={1.08} warpStrength={1.1}
        />
      </motion.div>
      {/* fondu profond : la couverture reste lisible, le bas vire au navy plein. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: `linear-gradient(180deg, rgba(6,9,18,0.55) 0%, rgba(6,9,18,0.40) 28%, rgba(6,9,18,0.72) 72%, ${NAVY} 100%)` }} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* MASTHEAD : AXEM serif large + édition à droite, petites capitales fines. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <span className="font-serif-display text-[44px] leading-[0.85] tracking-[-0.02em] text-cream md:text-[64px]">AXEM</span>
          <span className="kicker max-w-[15rem] text-cream-soft sm:text-right">
            La revue de l'IA appliquée<br className="hidden sm:block" /> — Édition 01 · 2026
          </span>
        </div>
        <hr className="rule mt-5" />

        {/* H1 serif FER À GAUCHE, révélé ligne par ligne (masque vertical). */}
        <h1 aria-label="Votre partenaire IA, de A à Z."
          className="font-serif-display mt-10 max-w-4xl leading-[0.92] tracking-[-0.02em] text-cream md:mt-14"
          style={{ fontSize: 'clamp(52px, 10vw, 132px)' }}>
          <span aria-hidden>
            <CoverLine delay={0.15} reduce={!!reduce}>Votre partenaire IA,</CoverLine>
            <CoverLine delay={0.22} reduce={!!reduce}>
              <span className="aurora-solid italic">de A à Z.</span>
            </CoverLine>
          </span>
        </h1>

        <p className="serif-body mt-8 max-w-2xl text-cream-soft" style={{ fontSize: 'clamp(18px, 2.2vw, 23px)', lineHeight: 1.5 }}>
          Nous enseignons ce que nous déployons. De l'audit à l'autonomie — un seul
          interlocuteur, du premier diagnostic au jour où vous n'avez plus besoin de nous.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <PrimaryButton href={CALENDLY} external>Prendre rendez-vous</PrimaryButton>
          <a href="#edito" className="breathe inline-flex items-center gap-2 text-[13px] font-satoshi font-bold uppercase tracking-[0.18em] text-cream-soft hover:text-cream [touch-action:manipulation]">
            <span aria-hidden>↓</span> Lire l'édito
          </a>
        </div>

        {/* Filet inférieur pleine largeur + 3 folios. */}
        <hr className="rule mt-12" />
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[['I', 'Les auteurs'], ['II', 'Les cas'], ['III', 'La méthode']].map(([n, l]) => (
            <div key={n} className="flex items-baseline gap-2.5">
              <span className="folio">{n}</span>
              <span className="text-[12px] font-satoshi font-medium text-cream-soft sm:text-[13px]">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// RUBRIQUE — en-tête de section réutilisé : folio « 0X » + titre serif fer
// à gauche + filet. Fondu doux à l'entrée (retenu).
// =====================================================================
const Rubrique: React.FC<{ folio: string; title: React.ReactNode; size?: string }> = ({ folio, title, size = 'clamp(34px, 5vw, 62px)' }) => (
  <div>
    <Reveal>
      <div className="flex items-center gap-4">
        <span className="folio">{folio}</span>
        <hr className="rule flex-1" />
      </div>
    </Reveal>
    <Reveal delay={0.06}>
      <h2 className="rubrique mt-5" style={{ fontSize: size }}>{title}</h2>
    </Reveal>
  </div>
);

// =====================================================================
// 01 — L'ÉDITO. Paragraphe serif, signé en italique. Fondu doux au scroll.
// =====================================================================
const Edito: React.FC = () => (
  <section id="edito" className="section-clip relative px-5 py-[clamp(96px,15vh,200px)] md:px-8">
    <div className="mx-auto max-w-4xl">
      <Rubrique folio="01" title="L'édito" />
      <Reveal delay={0.1}>
        <p className="serif-body mt-12 text-cream" style={{ fontSize: 'clamp(26px, 4vw, 46px)', lineHeight: 1.32, letterSpacing: '-0.005em' }}>
          L'IA déçoit quand elle reste une démo. Nous la déployons jusqu'à ce qu'elle tienne.
          Audit, conseil, automatisation, formation, suivi — un seul interlocuteur,
          <span className="italic text-cream"> de A à Z.</span>
        </p>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="serif-body mt-10 text-[20px] italic text-cream-soft md:text-[22px]">— C.P. &amp; A.Z.</p>
      </Reveal>
    </div>
  </section>
);

// =====================================================================
// 02 — LES AUTEURS. 2 colonnes. Hover : filet sous le nom s'étend (200ms),
// bio gris → encre. Count-up des chiffres (une fois).
// =====================================================================
const AUTHORS = [
  { name: 'Clément Predo', school: 'ESSEC', li: LI_CLEMENT,
    bio: "Le stratège. Il traduit l'IA en résultats concrets et pilote les missions d'audit, de conseil et de formation." },
  { name: 'Alexis Zeitoun', school: 'Polytechnique · Télécom Paris', li: LI_ALEXIS,
    bio: "L'architecte. Il conçoit et déploie les systèmes : agents, automatisations, intégrations en production." },
];
const Auteurs: React.FC = () => (
  <section id="auteurs" className="section-clip relative px-5 py-[clamp(96px,15vh,200px)] md:px-8">
    <div className="mx-auto max-w-5xl">
      <Rubrique folio="02" title="Les auteurs" />
      <div className="mt-14 grid gap-px overflow-hidden md:grid-cols-2" style={{ background: 'var(--rule)' }}>
        {AUTHORS.map((a, i) => (
          <Reveal key={a.name} delay={i * 0.08}>
            <a href={a.li} target="_blank" rel="noopener noreferrer"
              className="author-block group flex h-full flex-col bg-ink p-7 outline-none md:p-10">
              <span className="kicker text-cyan">{a.school}</span>
              <h3 className="font-serif-display mt-3 text-[34px] leading-none text-cream md:text-[42px]">
                <span className="author-name-rule">{a.name}</span>
              </h3>
              <p className="author-bio serif-body mt-5 text-[19px] leading-snug md:text-[21px]">{a.bio}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim transition-colors group-hover:text-cream">
                LinkedIn <span aria-hidden>↗</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      {/* Ligne de chiffres — count-up une fois. */}
      <Reveal delay={0.12}>
        <p className="mt-10 text-[15px] leading-relaxed text-cream-soft md:text-[17px]">
          <span className="font-serif-display text-cream"><CountUp to={55000} suffix=" " /></span>abonnés
          <span className="mx-2 text-cream-dim">·</span>
          <span className="font-serif-display text-cream"><CountUp to={2.6} decimals={1} suffix=" M" /></span> d'impressions / mois
          <span className="mx-2 text-cream-dim">·</span>
          on enseigne ce qu'on déploie.
        </p>
      </Reveal>
    </div>
  </section>
);

// =====================================================================
// 03 — LE SOMMAIRE. Liste numérotée romaine. Type table des matières :
// titre à gauche, p.0X à droite, points de conduite. Hover : leader se
// densifie, ligne décale 6px. VII en italique.
// =====================================================================
const SOMMAIRE: [string, string, string, boolean][] = [
  ['I', 'Audit', '01', false],
  ['II', 'Conseil', '02', false],
  ['III', 'Déploiement & automatisation', '03', false],
  ['IV', 'Formation', '04', false],
  ['V', 'Coaching', '05', false],
  ['VI', 'Production IA', '06', false],
  ['VII', 'Suivi — on reste', '07', true],
];
const Sommaire: React.FC = () => (
  <section id="sommaire" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(96px,15vh,200px)] md:px-8">
    <div className="mx-auto max-w-4xl">
      <Rubrique folio="03" title="Au sommaire de cette édition" size="clamp(30px, 4.4vw, 56px)" />
      <ol className="mt-12">
        {SOMMAIRE.map(([roman, label, page, italic], i) => (
          <Reveal key={roman} delay={i * 0.04}>
            <li className="toc-row">
              <span className="flex items-baseline gap-4">
                <span className="folio w-10 shrink-0">{roman}</span>
                <span className={`font-serif-display text-[26px] leading-none text-cream md:text-[34px] ${italic ? 'italic' : ''}`}>
                  {label}
                </span>
              </span>
              <span className="toc-leader" aria-hidden />
              <span className="folio whitespace-nowrap">p. {page}</span>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

// =====================================================================
// FEATURE — gabarit de presse réutilisable. Surtitre, titre serif, chapô,
// chiffres-héros en colonne serif géante (count-up court au scroll). Filet de
// marge qui se TRACE (jauge de lecture, scaleY lié au scroll de la section).
// `mirror` : chiffre à droite. `wide` : pleine page, chiffre sticky léger.
// =====================================================================
const Feature: React.FC<{
  id: string;
  kicker: string;
  title: React.ReactNode;
  chapo: React.ReactNode;
  stats: { val: React.ReactNode; label: string }[];
  mirror?: boolean;
  wide?: boolean;
}> = ({ id, kicker, title, chapo, stats, mirror, wide }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 75%'] });
  const gauge = reduce ? 1 : scrollYProgress;

  const Numbers = (
    <div className={`flex flex-col gap-8 ${wide ? 'lg:sticky lg:top-28 lg:self-start' : ''}`}>
      {stats.map((s, i) => (
        <Reveal key={i} delay={i * 0.08}>
          <div>
            <div className="font-serif-display leading-[0.82] tracking-[-0.01em] text-cream"
              style={{ fontSize: wide ? 'clamp(88px, 16vw, 220px)' : 'clamp(64px, 11vw, 140px)' }}>
              {s.val}
            </div>
            <div className="mt-3 max-w-[15rem] text-[13.5px] font-medium leading-snug text-cream-soft">{s.label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );

  const Body = (
    <div className="max-w-xl">
      <Reveal><span className="kicker text-cyan">{kicker}</span></Reveal>
      <Reveal delay={0.06}>
        <h3 className="font-serif-display mt-5 leading-[1.02] tracking-[-0.01em] text-cream"
          style={{ fontSize: 'clamp(30px, 4.4vw, 54px)' }}>{title}</h3>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="serif-body mt-6 text-[20px] leading-snug text-cream-soft md:text-[22px]">{chapo}</p>
      </Reveal>
    </div>
  );

  return (
    <section id={id} ref={ref} className="section-clip relative px-5 py-[clamp(100px,16vh,220px)] md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* en-tête de feature : filet plein largeur (séparation de rubrique). */}
        <hr className="rule-strong mb-12" />
        <div className="relative grid gap-12 lg:gap-16">
          {/* JAUGE DE LECTURE — filet de marge qui se trace, à gauche (caché < lg). */}
          <div aria-hidden className="absolute -left-8 top-0 hidden h-full w-px lg:block" style={{ background: 'var(--rule)' }}>
            <motion.div className="feature-gauge h-full w-full" style={{ scaleY: gauge }} />
          </div>
          <div className={`grid items-start gap-10 lg:gap-16 ${wide ? 'lg:grid-cols-[1fr_1.1fr]' : mirror ? 'lg:grid-cols-[1fr_1fr]' : 'lg:grid-cols-[1fr_1fr]'}`}>
            {mirror ? <>{Body}{Numbers}</> : <>{Numbers}{Body}</>}
          </div>
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// 07 — L'INDEX. Grille sobre de données. Stagger 60ms par cellule, filets
// fins, AUCUN hover (c'est de la donnée).
// =====================================================================
const INDEX_CELLS: { val: React.ReactNode; label: string }[] = [
  { val: <CountUp to={159} suffix=" %" />, label: 'ROI médian sur 12 mois' },
  { val: <CountUp to={4} />, label: 'secteurs adressés' },
  { val: <>20/<span className="text-cream-soft">80</span></>, label: 'Éditeur médico-social — règle de Pareto appliquée' },
  { val: <CountUp to={1} prefix="" suffix="" />, label: 'seul interlocuteur, de A à Z' },
];
const IndexSection: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="index" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(96px,15vh,200px)] md:px-8">
      <div className="mx-auto max-w-5xl">
        <Rubrique folio="07" title="L'index" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4">
          {INDEX_CELLS.map((c, i) => (
            <motion.div key={i}
              initial={reduce ? { opacity: 0.001 } : { opacity: 0.001, y: 18 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={reduce ? { duration: 0.3, delay: i * 0.06 } : { duration: 0.5, ease, delay: i * 0.06 }}
              className="index-cell px-1 py-8 md:px-5">
              <div className="font-serif-display leading-[0.85] text-cream" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
                {c.val}
              </div>
              <div className="mt-4 max-w-[12rem] text-[12.5px] font-medium leading-snug text-cream-soft">{c.label}</div>
            </motion.div>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-12">
            <SecondaryButton href={CASES_URL} external arrow>Consulter tous les cas</SecondaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// 08 — ILS NOUS FONT CONFIANCE. Logos en niveaux de gris, marquee TRÈS LENT
// (60s). Hover → pleine encre + pause. Pas de témoignage écrit.
// =====================================================================
const LOGOS: [string, string][] = [
  ['Carrefour', '/logos/carrefour.svg'],
  ['Blackfin', '/logos/blackfin.png'],
  ['Avantis', '/logos/avantis.png'],
  ['KIT France', '/logos/kit.png'],
  ['Espace 2', '/logos/espace2.png'],
  ['Socos', '/logos/socos.png'],
  ['Gravotech', '/logos/gravotech.png'],
];
const TrustBar: React.FC = () => {
  const reduce = useReducedMotion();
  const row = [...LOGOS, ...LOGOS];
  const [dur, setDur] = React.useState(60); // marquee très lent
  return (
    <section aria-label="Ils nous font confiance" className="section-clip relative px-5 py-[clamp(72px,11vh,140px)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="folio">08</span>
            <span className="kicker text-cream-dim">Ils nous font confiance</span>
            <hr className="rule flex-1" />
          </div>
        </Reveal>
      </div>
      <div className="ticker-mask group relative mt-12 overflow-hidden">
        <motion.div
          className="flex w-max items-center gap-16 md:gap-24"
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={reduce ? undefined : { duration: dur, ease: 'linear', repeat: Infinity }}
          onMouseEnter={() => !reduce && setDur(100000)}
          onMouseLeave={() => !reduce && setDur(60)}>
          {row.map(([name, src], i) => (
            <span key={name + i} className="logo-chip shrink-0" title={name}>
              <img src={src} alt={name} loading="lazy" className="h-7 w-auto max-w-[150px] object-contain md:h-9" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// =====================================================================
// ⭐ 09 — LA MÉTHODE (LE WOW). Étapes en folios 01→07. Filet vertical à
// gauche marqué « A » en haut et « Z » en bas qui S'ENCRE du haut vers le bas,
// piloté au scroll (scaleY lié à scrollYProgress, réversible, synchrone au
// geste). Chaque étape passe de gris à l'encre quand le trait l'atteint.
// Au « Z », « Et puis on reste. » se révèle. reduced → trait plein, tout encré.
// =====================================================================
const METHODE = [
  { k: 'Audit', d: "On cartographie process, données, irritants. On identifie où l'IA crée vraiment de la valeur — et où elle n'en a pas." },
  { k: 'Conseil', d: 'Feuille de route priorisée : quoi faire, dans quel ordre, avec quels budgets et quels outils.' },
  { k: 'Déploiement & automatisation', d: 'Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main.' },
  { k: 'Formation', d: '10 modules · 200 – 1 250 € · 70 % de pratique. Vos équipes opérationnelles dès le lendemain.' },
  { k: 'Coaching', d: "On accompagne dans la durée : montée en compétence, nouveaux cas d'usage, ajustements." },
  { k: 'Production IA', d: 'Assistants, agents, générateurs sur-mesure, intégrés à vos outils. Pas une démo isolée.' },
  { k: 'Suivi', d: 'Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations.' },
];
const Methode: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // synchrone au geste : scaleY lié directement au scroll (réversible).
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 70%'] });
  const inkScale = reduce ? 1 : scrollYProgress;

  const [active, setActive] = React.useState<boolean[]>(() => METHODE.map(() => !!reduce));
  const [atZ, setAtZ] = React.useState<boolean>(!!reduce);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    // une étape s'encre quand le trait l'atteint (son centre relatif).
    setActive(METHODE.map((_, i) => p >= (i + 0.5) / METHODE.length - 0.02));
    setAtZ(p >= 0.985);
  });

  return (
    <section id="methode" className="section-clip relative px-5 py-[clamp(100px,16vh,220px)] md:px-8">
      <div className="mx-auto max-w-4xl">
        <Rubrique folio="09" title="La méthode, page par page" size="clamp(30px, 4.6vw, 58px)" />

        <div ref={ref} className="relative mt-16 pl-12 md:pl-20">
          {/* FILET A → Z. « A » en haut, « Z » en bas. Le trait gris est plein,
              l'encre (gradient) se révèle par scaleY lié au scroll. */}
          <div aria-hidden className="absolute left-[6px] top-0 flex h-full flex-col items-center md:left-[14px]">
            <span className="folio mb-3 leading-none">A</span>
            <div className="relative w-px flex-1 overflow-hidden">
              <div className="az-rail absolute inset-0 w-px" />
              <motion.div className="az-ink absolute inset-0 w-px" style={{ scaleY: inkScale }} />
            </div>
            <span className="folio mt-3 leading-none">Z</span>
          </div>

          <ol className="space-y-12 md:space-y-16">
            {METHODE.map((s, i) => (
              <li key={s.k} className="az-step" data-on={active[i] ? 'true' : 'false'}>
                <div className="flex items-baseline gap-4">
                  <span className="az-step-meta folio">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-serif-display text-[28px] leading-tight md:text-[38px]" style={{ color: 'inherit' }}>{s.k}</h3>
                </div>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-cream-soft md:text-[16px]">{s.d}</p>
              </li>
            ))}
          </ol>

          {/* Au « Z » : « Et puis on reste. » se révèle (fondu retenu). */}
          <motion.p
            initial={reduce ? { opacity: 1 } : { opacity: 0.001, y: 14 }}
            animate={atZ ? { opacity: 1, y: 0 } : reduce ? { opacity: 1 } : { opacity: 0.001, y: 14 }}
            transition={{ duration: 0.6, ease }}
            className="font-serif-display mt-16 text-[34px] italic leading-tight text-cream md:text-[52px]">
            Et puis on reste.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// 10 — LA COLONNE DES AUTEURS. « Chaque semaine, dans nos colonnes. »
// 3 extraits de colonne en cartes sobres (filet, titre serif, date).
// Hover : filet du cadre +1px (pas d'ombre).
// =====================================================================
const COLUMNS = [
  { title: 'Pourquoi vos automatisations cassent au bout de trois mois', date: '12 juin 2026', tag: 'Terrain' },
  { title: "L'audit IA : ce qu'on regarde vraiment avant de proposer quoi que ce soit", date: '5 juin 2026', tag: 'Méthode' },
  { title: 'Former, ce n\'est pas montrer ChatGPT. C\'est changer un réflexe.', date: '29 mai 2026', tag: 'Formation' },
];
const Colonne: React.FC = () => (
  <section id="colonne" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(96px,15vh,200px)] md:px-8">
    <div className="mx-auto max-w-6xl">
      <Rubrique folio="10" title="Chaque semaine, dans nos colonnes" size="clamp(28px, 4.2vw, 52px)" />
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-cream-soft md:text-[18px]">
          55 000 lecteurs nous suivent sur LinkedIn. 2,6 M d'impressions par mois.
          On y publie ce qu'on apprend en mission.
        </p>
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {COLUMNS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <a href={LI_CLEMENT} target="_blank" rel="noopener noreferrer"
              className="column-card flex h-full flex-col p-7 outline-none md:p-8">
              <span className="kicker text-cyan">{c.tag}</span>
              <h3 className="font-serif-display mt-4 text-[24px] leading-[1.08] text-cream md:text-[28px]">{c.title}</h3>
              <span className="mt-auto pt-8 text-[12px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim">{c.date}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// =====================================================================
// 11 — LE RENDEZ-VOUS (CTA). « Prenons 30 minutes. » Calendly inline. Bouton
// :active scale(0.98). Marges très généreuses (le vide = le luxe).
// =====================================================================
const Rendezvous: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  return (
    <section id="rendezvous" ref={ref} className="section-clip relative px-5 py-[clamp(120px,20vh,280px)] md:px-8">
      <div className="mx-auto max-w-5xl">
        <Rubrique folio="11" title="Prenons 30 minutes." size="clamp(38px, 6vw, 84px)" />
        <Reveal delay={0.1}>
          <p className="serif-body mt-8 max-w-2xl text-cream-soft" style={{ fontSize: 'clamp(20px, 2.6vw, 26px)', lineHeight: 1.42 }}>
            Un échange, pas une démo. On regarde vos process, on vous dit franchement
            où l'IA a du sens — et où elle n'en a pas.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-14 overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--rule)' }}>
            {inView && (
              <iframe
                title="Réserver un créneau de 30 minutes"
                src={CALENDLY_EMBED}
                loading="lazy"
                className="h-[640px] w-full border-0 sm:h-[700px]"
              />
            )}
            {!inView && <div className="h-[640px] w-full sm:h-[700px]" aria-hidden />}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// 12 — LE COLOPHON (footer). Quasi statique. Grainient navy très subtil
// (le second et dernier moment riche). Nav + email + LinkedIn des 2. Phrase
// finale serif. Liens : soulignement qui se dessine au hover.
// =====================================================================
const Colophon: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <footer className="relative isolate overflow-hidden border-t px-5 py-20 md:px-8" style={{ borderColor: 'var(--rule)' }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Grainient
          className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.08} grainAmount={0.07} contrast={1.22}
          saturation={0.9} zoom={1.1} warpStrength={0.95}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(6,9,18,0.82) 0%, rgba(6,9,18,0.88) 60%, rgba(6,9,18,0.95) 100%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="kicker text-cream-soft">
          AXEM IA · Agence IA &amp; formation · Édition 01 · 2026
        </p>
        <p className="font-serif-display mt-6 leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.5vw, 72px)' }}>
          On enseigne ce qu'on déploie.
        </p>
        <hr className="rule my-12" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="folio">Navigation</span>
            <ul className="mt-4 space-y-2 text-[15px] text-cream-soft">
              {NAV_LINKS.map(([l, h]) => (
                <li key={l}><a href={h} className="link-rule hover:text-cream">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <span className="folio">Contact</span>
            <ul className="mt-4 space-y-2 text-[15px] text-cream-soft">
              <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="link-rule hover:text-cream">Le rendez-vous</a></li>
              <li><a href="mailto:contact@axem-ia.fr" className="link-rule hover:text-cream">contact@axem-ia.fr</a></li>
              <li><a href={CASES_URL} target="_blank" rel="noopener noreferrer" className="link-rule hover:text-cream">Les cas</a></li>
            </ul>
          </div>
          <div>
            <span className="folio">Les auteurs</span>
            <ul className="mt-4 space-y-2 text-[15px] text-cream-soft">
              <li><a href={LI_CLEMENT} target="_blank" rel="noopener noreferrer" className="link-rule hover:text-cream">Clément Predo ↗</a></li>
              <li><a href={LI_ALEXIS} target="_blank" rel="noopener noreferrer" className="link-rule hover:text-cream">Alexis Zeitoun ↗</a></li>
            </ul>
          </div>
        </div>
        <hr className="rule mt-12" />
        <p className="mt-6 text-[12px] text-cream-dim">© 2026 AXEM IA — Paris, France.</p>
      </div>
    </footer>
  );
};

// =====================================================================
// PAGE — la revue, dans l'ordre des rubriques.
// =====================================================================
const Home: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <div className="min-h-screen bg-ink text-cream" style={{ overflowX: 'hidden' }}>
        <Nav />
        <main id="contenu">
          <Hero />
          <Edito />
          <Auteurs />
          <Sommaire />

          {/* 04 — FEATURE I — BTP */}
          <Feature
            id="feature-1"
            kicker="Feature — Industrie"
            title={<>Comment un acteur du BTP a rendu 80 % d'un process — et 95 000 € par an.</>}
            chapo={<>Chiffrage manuel chronophage, devis lents, marges grignotées par les erreurs. Un assistant de chiffrage IA branché sur leurs bordereaux et leurs historiques a tout changé.</>}
            stats={[
              { val: <><CountUp to={80} />%</>, label: 'de temps de saisie en moins' },
              { val: <CountUp to={95} suffix=" k€" />, label: 'neutralisés chaque année' },
            ]}
          />

          {/* 05 — FEATURE II — ADMIN JUDICIAIRE (miroir) */}
          <Feature
            id="feature-2"
            kicker="Feature — Secteur public"
            title={<>×4 sur le traitement, 100 % de fiabilité, +5 h par semaine rendues.</>}
            chapo={<>Traitement documentaire massif, saisie répétitive, risque d'erreur élevé. Un pipeline OCR doublé d'une vérification IA sur chaque pièce entrante a absorbé la charge.</>}
            stats={[
              { val: <>×<CountUp to={4} /></>, label: 'plus rapide sur le traitement' },
              { val: <><CountUp to={100} />%</>, label: 'de fiabilité par double contrôle' },
            ]}
            mirror
          />

          {/* 06 — FEATURE III — ADHÉSIFS AÉRO/FERRO (pleine page, chiffre sticky) */}
          <Feature
            id="feature-3"
            kicker="Feature — Production"
            title={<>317 heures rendues chaque mois, plus de 98 % de fiabilité.</>}
            chapo={<>Conformité ADV lourde, contrôles manuels, anomalies détectées trop tard. L'automatisation des contrôles documentaires et de conformité a libéré des journées entières.</>}
            stats={[
              { val: <CountUp to={317} suffix=" h" />, label: 'libérées chaque mois' },
              { val: <>&gt;<CountUp to={98} />%</>, label: "d'anomalies détectées" },
            ]}
            wide
          />

          <IndexSection />
          <TrustBar />
          <Methode />
          <Colonne />
          <Rendezvous />
        </main>
        <Colophon />
      </div>
    </MotionConfig>
  );
};

export default Home;
