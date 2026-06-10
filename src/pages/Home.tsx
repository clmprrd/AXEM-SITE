import React, { useRef } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValueEvent, useReducedMotion, useInView, MotionConfig,
} from 'framer-motion';
import Grainient from '../components/Grainient';
import { RiseWords, Reveal, CountUp, EASE } from '../ui/motion';
import { PrimaryButton, SecondaryButton, MagneticPrimary } from '../ui/Button';

// =====================================================================
// AXEM IA — SITE COMPLET « LIMITLESS × NAVY »
// Storytelling bleu nuit, langage éditorial. Une interaction intelligente
// par section. Boutons éditoriaux (Button.tsx) branchés partout.
// Motion : transform/opacity/SVG only · whileInView once ·
//   MotionConfig reducedMotion="user" + gardes useReducedMotion · 60fps.
// =====================================================================

const ease = EASE;
const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const CASES_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

// Grainient — variante navy « azur »
const AZUR = { color1: '#5B8CFF', color2: '#1E40AF', color3: '#070C1A' } as const;

// ---------------------------------------------------------------------
// NAV — pilule flottante centrée, frosted glass, auto-hide au scroll.
// ---------------------------------------------------------------------
const NAV_LINKS: [string, string][] = [
  ['Formation', '#formation'], ['Conseil', '#conseil'],
  ['Résultats', '#resultats'], ['Méthode', '#methode'], ['Le duo', '#duo'],
];
const Nav: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);
  const last = useRef(0);
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (reduce) return;
    const prev = last.current;
    if (y > prev && y > 120) setHidden(true);
    else if (y < prev) setHidden(false);
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
        <SecondaryButton href={CALENDLY} external size="sm" className="!py-2.5">Réserver un appel</SecondaryButton>
      </nav>
    </motion.header>
  );
};

// ---------------------------------------------------------------------
// HERO (gardé) — fond navy, titre serif géant, double CTA éditorial.
// ---------------------------------------------------------------------
const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-36 text-center md:px-8">
      <div aria-hidden className="grid-overlay pointer-events-none absolute inset-0 z-0" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(91,140,255,0.28), transparent 65%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[22%]"
        style={{ background: 'linear-gradient(180deg, transparent, #070B16)' }} />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-70" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream">
            Agence d'IA <span className="text-cyan">×</span> Formation
          </span>
        </motion.div>

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

        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85, ease }}
          className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-cream-soft md:text-xl">
          On forme vos équipes, on conseille votre stratégie, on déploie vos automatisations.
          <span className="text-cream"> Et on reste.</span>
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0, ease }}
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <PrimaryButton href={CALENDLY} external size="lg">Réserver un appel</PrimaryButton>
          <SecondaryButton href="#resultats" size="lg">Voir nos résultats</SecondaryButton>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// BANDE CONFIANCE — clients EN COULEUR, sobre. Marquee lent (N&B → couleur
// au hover via .logo-chip). Pas d'OF partenaire, pas de Qualiopi.
// Interaction : défilement infini transform-only, se met en pause au hover.
// ---------------------------------------------------------------------
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
  return (
    <section aria-label="Ils nous font confiance" className="section-clip relative border-y border-green/10 py-14">
      <Reveal>
        <p className="mb-8 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-cream-dim">
          Ils nous font confiance
        </p>
      </Reveal>
      <div className="group relative overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)' }}>
        <div
          className="flex w-max items-center gap-14 md:gap-20"
          style={reduce ? undefined : { animation: 'marquee 34s linear infinite' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}>
          {row.map(([name, src], i) => (
            <span key={name + i} className="logo-chip shrink-0" title={name}>
              <img src={src} alt={name} loading="lazy"
                className="h-7 w-auto max-w-[150px] object-contain md:h-9" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// SECTION A (gardée) — full-bleed Grainient navy + watermark serif parallax.
// ---------------------------------------------------------------------
const SectionA: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const y = reduce ? '0%' : yRaw;

  return (
    <section id="section-a" ref={ref}
      className="section-clip relative isolate flex min-h-[90svh] items-center justify-center overflow-hidden bg-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Grainient
          className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.16} grainAmount={0.08} contrast={1.35}
          saturation={1.05} zoom={0.95} warpStrength={1.2}
        />
      </div>
      <div aria-hidden className="grid-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(80% 80% at 50% 50%, rgba(7,11,22,0.35) 0%, rgba(7,11,22,0.6) 60%, rgba(7,11,22,0.85) 100%)' }} />
      <motion.div aria-hidden style={{ y }}
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
        <span className="serif-watermark font-serif-display text-cream/[0.07]"
          style={{ fontSize: 'clamp(120px, 34vw, 520px)' }}>
          de A à Z
        </span>
      </motion.div>

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
// MANIFESTE (gardé) — grande phrase serif word-by-word + 3 cartes glass.
// (Qualiopi/OPCO retirés du copy.)
// ---------------------------------------------------------------------
const CARDS: { k: string; t: string; d: string }[] = [
  { k: '01', t: 'Formation', d: '70 % de pratique. Vos équipes opérationnelles dès J+1.' },
  { k: '02', t: 'Conseil', d: "On cadre votre stratégie IA : audit, feuille de route, cas d'usage rentables." },
  { k: '03', t: 'Déploiement', d: "On déploie vos automatisations en production. Et on reste pour les faire vivre." },
];
const Manifeste: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="manifeste" className="section-clip relative overflow-hidden px-5 py-28 md:px-8 md:py-40">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 -z-[1] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.18), transparent 65%)' }} />
      <div className="mx-auto max-w-5xl text-center">
        <h2 aria-label="On forme. On conseille. On déploie. Et on reste."
          className="font-serif-display leading-[1.02] tracking-[-0.01em] text-cream"
          style={{ fontSize: 'clamp(40px, 8vw, 104px)' }}>
          <span aria-hidden>
            <RiseWords text="On forme." onScroll stagger={0.09} />{' '}
            <RiseWords text="On conseille." onScroll delay={0.12} stagger={0.09} />{' '}
            <RiseWords text="On déploie." onScroll delay={0.26} stagger={0.09} />
            <br />
            <span className="aurora-text italic inline-block">
              <RiseWords text="Et on reste." onScroll delay={0.42} stagger={0.09} />
            </span>
          </span>
        </h2>

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
// SECTION HEADER — eyebrow + titre serif, réutilisé.
// ---------------------------------------------------------------------
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-5 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan">
    <span className="h-1.5 w-1.5 rounded-full bg-green" />{children}
  </div>
);

// ---------------------------------------------------------------------
// FORMATION — « 70 % de pratique, opérationnel dès J+1 ».
// Interaction : cartes phares qui révèlent leurs détails au hover/focus ;
// « Voir les 10 formations » déplie F01–F10 avec AnimatePresence (popLayout).
// Financement = budget entreprise (PAS Qualiopi/OPCO).
// ---------------------------------------------------------------------
const FORMATIONS_PHARES = [
  { code: 'IA Essentielle', price: '300 €', level: 'Découverte',
    pitch: "Comprendre l'IA générative et l'utiliser au quotidien.",
    detail: '1 jour · ChatGPT, Claude, Gemini · prompting, rédaction, recherche, synthèse. Reparte avec vos premiers réflexes IA.' },
  { code: 'Maîtriser Claude', price: '450 €', level: 'Intermédiaire',
    pitch: "Exploiter Claude à fond : projets, artefacts, raisonnement.",
    detail: '1 jour · Projects, fichiers, MCP, agents · cas métiers réels. Pour ceux qui veulent un copilote sérieux, pas un gadget.' },
  { code: 'No-Code & Workflows', price: '800 €', level: 'Avancé',
    pitch: 'Construire des automatisations qui tournent seules.',
    detail: '2 jours · n8n, Make, Claude Code · vos premiers workflows en production. On part de vos process, on automatise pour de vrai.' },
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
    <section id="formation" className="section-clip relative px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <Reveal><Eyebrow>Formation</Eyebrow></Reveal>
          <Reveal delay={0.06} y={28}>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
              70 % de pratique.<br /><span className="aurora-text italic">Opérationnel dès J+1.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              On ne forme pas pour cocher une case. On forme pour que vos équipes utilisent l'IA
              le lendemain. Financement sur budget formation entreprise.
            </p>
          </Reveal>
        </div>

        {/* 3 formations phares — détails révélés au hover/focus */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {FORMATIONS_PHARES.map((f, i) => (
            <motion.article key={f.code} tabIndex={0}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="group glass relative flex flex-col rounded-3xl p-7 outline-none transition-[transform,box-shadow] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:shadow-[0_24px_60px_-22px_rgba(91,140,255,0.45)] focus-visible:-translate-y-1 md:p-8">
              <span className={`self-start rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${LEVEL_TINT[f.level]}`}>{f.level}</span>
              <h3 className="font-serif-display mt-5 text-[28px] leading-[1.05] text-cream">{f.code}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-cream-soft">{f.pitch}</p>
              {/* détail révélé : grid-rows 0fr → 1fr (height anim sans saut) */}
              <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-400 [transition-timing-function:var(--ease-out)] group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
                <div className="overflow-hidden">
                  <p className="mt-4 border-t border-green/15 pt-4 text-[13.5px] leading-relaxed text-cream-soft">{f.detail}</p>
                </div>
              </div>
              <div className="mt-auto flex items-end justify-between pt-6">
                <span className="font-serif-display text-4xl text-cream">{f.price}</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cream-dim">/ pers.</span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Déplier le catalogue complet F01–F10 */}
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
                  <div className="hidden grid-cols-[64px_1fr_140px_100px] gap-4 border-b border-green/12 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.14em] text-cream-dim md:grid">
                    <span>Réf.</span><span>Formation</span><span>Niveau</span><span className="text-right">Prix</span>
                  </div>
                  <ul>
                    {CATALOGUE.map(([code, title, level, price], i) => (
                      <motion.li key={code}
                        initial={reduce ? { opacity: 1 } : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.04 * i, ease }}
                        className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-green/8 px-5 py-4 transition-colors [transition-timing-function:var(--ease-out)] last:border-0 hover:bg-white/[0.03] md:grid-cols-[64px_1fr_140px_100px] md:gap-4 md:px-6">
                        <span className="font-serif-display text-lg text-green/60">{code}</span>
                        <span className="text-[15px] text-cream">{title}</span>
                        <span className={`hidden text-[12px] font-bold uppercase tracking-[0.1em] md:inline ${LEVEL_TINT[level].split(' ')[0]}`}>{level}</span>
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

// ---------------------------------------------------------------------
// CONSEIL & AGENCE — parcours en 5 étapes.
// Interaction : ligne SVG verticale qui se TRACE au scroll (pathLength lié
// à scrollYProgress) + nœuds qui s'allument quand le tracé les dépasse.
// ---------------------------------------------------------------------
const PARCOURS = [
  { t: 'Audit IA', d: "On cartographie vos process, vos données, vos irritants. On identifie où l'IA crée vraiment de la valeur." },
  { t: 'Conseil stratégique', d: 'Feuille de route priorisée : quoi faire, dans quel ordre, avec quels budgets et quels outils.' },
  { t: 'Déploiement & automatisation', d: 'Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main.' },
  { t: 'Production IA', d: "Assistants, agents, générateurs sur-mesure. Intégrés à vos outils, pas une démo isolée." },
  { t: 'Suivi', d: 'Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.' },
];
const Conseil: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const pathLength = reduce ? 1 : scrollYProgress;
  // états on/off des nœuds suivant la progression
  const [active, setActive] = React.useState<boolean[]>(() => PARCOURS.map(() => reduce));
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    setActive(PARCOURS.map((_, i) => p >= (i + 0.5) / PARCOURS.length - 0.04));
  });

  return (
    <section id="conseil" className="section-clip relative bg-ink-2/40 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal><Eyebrow>Conseil &amp; agence</Eyebrow></Reveal>
          <Reveal delay={0.06} y={28}>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
              Un seul parcours,<br /><span className="aurora-text italic">de bout en bout.</span>
            </h2>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16 pl-10 md:pl-16">
          {/* RAIL SVG — ligne qui se trace au scroll (pathLength) */}
          <svg aria-hidden className="pointer-events-none absolute left-[14px] top-2 h-full w-2 md:left-[22px]"
            viewBox="0 0 2 100" preserveAspectRatio="none">
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(120,160,255,0.14)" strokeWidth="2" />
            <motion.line x1="1" y1="0" x2="1" y2="100"
              stroke="url(#railGrad)" strokeWidth="2" strokeLinecap="round"
              style={{ pathLength }} />
            <defs>
              <linearGradient id="railGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#5B8CFF" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </svg>

          <ol className="space-y-10 md:space-y-14">
            {PARCOURS.map((s, i) => (
              <li key={s.t} className="relative">
                {/* NŒUD qui s'allume */}
                <span aria-hidden data-on={active[i] ? 'true' : 'false'}
                  className="node-dot absolute -left-[34px] top-1.5 h-3.5 w-3.5 rounded-full border border-green/40 bg-ink md:-left-[46px]" />
                <Reveal delay={0.04 * i}>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif-display text-2xl text-green/50">0{i + 1}</span>
                      <h3 className="font-serif-display text-[26px] leading-tight text-cream md:text-[34px]">{s.t}</h3>
                    </div>
                    <p className="max-w-2xl text-[15px] leading-relaxed text-cream-soft">{s.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// RÉSULTATS — KPI count-up au scroll + cas chiffrés (chiffre révélé au hover).
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
    solution: "Assistant de chiffrage IA branché sur leurs bordereaux et historiques.",
    result: '80 %', resultLabel: 'de temps de saisie en moins · 95 k€/an neutralisés' },
  { sector: 'Administration judiciaire',
    problem: 'Traitement documentaire massif, saisie répétitive, risque d\'erreur élevé.',
    solution: 'Pipeline OCR + double vérification IA sur les pièces entrantes.',
    result: '×4', resultLabel: 'plus rapide · fiabilité 100 % par double contrôle' },
  { sector: 'Adhésifs aéro / ferroviaire',
    problem: 'Conformité ADV lourde, contrôles manuels, anomalies détectées trop tard.',
    solution: 'Automatisation des contrôles documentaires et de conformité.',
    result: '317 h', resultLabel: 'libérées / mois · anomalies détectées > 98 %' },
  { sector: 'Éditeur médico-social',
    problem: 'Support et rédaction de contenus métier saturés, délais qui s\'allongent.',
    solution: 'Assistants IA spécialisés intégrés à leurs outils internes.',
    result: '159 %', resultLabel: 'de ROI sur 12 mois' },
];
const Resultats: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="resultats" className="section-clip relative px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Reveal><Eyebrow>Résultats</Eyebrow></Reveal>
            <Reveal delay={0.06} y={28}>
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

        {/* KPI count-up — layout asymétrique, gros chiffres serif */}
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-y-16">
          {KPIS.map((k, i) => (
            <motion.div key={i}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease }}
              className={i % 2 === 1 ? 'md:translate-y-6' : ''}>
              <div className="font-serif-display leading-[0.85] text-cream" style={{ fontSize: 'clamp(48px, 8vw, 104px)' }}>
                {k.val}
              </div>
              <div className="mt-3 max-w-[200px] text-[13px] font-medium leading-snug text-cream-soft">{k.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CAS anonymisés — Problème → Solution → Résultat révélé au hover */}
        <div className="mt-24 grid gap-5 md:grid-cols-2">
          {CASES.map((c, i) => (
            <motion.article key={c.sector} tabIndex={0}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease }}
              className="group glass relative flex flex-col gap-4 overflow-hidden rounded-3xl p-7 outline-none transition-[transform,box-shadow] duration-300 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:shadow-[0_24px_60px_-22px_rgba(91,140,255,0.45)] focus-visible:-translate-y-1 md:p-9">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">{c.sector}</span>
              <div className="space-y-3 text-[14.5px] leading-relaxed">
                <p className="text-cream-soft"><span className="font-semibold text-cream">Problème · </span>{c.problem}</p>
                <p className="text-cream-soft"><span className="font-semibold text-cream">Solution · </span>{c.solution}</p>
              </div>
              {/* RÉSULTAT révélé au hover : chiffre serif qui apparaît */}
              <div className="mt-auto flex items-end justify-between border-t border-green/12 pt-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-cream-dim">Résultat</span>
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
// MÉTHODE — « En 3 étapes. Pas une de plus. »
// Interaction : timeline verticale qui se DESSINE au scroll + étapes qui
// s'allument (réutilise pathLength + node-dot).
// ---------------------------------------------------------------------
const STEPS = [
  { k: 'Diagnostic', meta: '30 min', d: "On comprend votre contexte, vos irritants, vos objectifs. Gratuit, sans engagement." },
  { k: 'Proposition', meta: '48 h', d: 'On revient avec un plan clair : périmètre, livrables, budget. Pas de jargon, pas de flou.' },
  { k: 'Exécution', meta: 'J+1', d: 'On démarre. Formation, conseil ou déploiement — vous avancez dès le lendemain.' },
];
const Methode: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 65%'] });
  const pathLength = reduce ? 1 : scrollYProgress;
  const [active, setActive] = React.useState<boolean[]>(() => STEPS.map(() => reduce));
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    setActive(STEPS.map((_, i) => p >= (i + 0.5) / STEPS.length - 0.05));
  });

  return (
    <section id="methode" className="section-clip relative px-5 py-28 md:px-8 md:py-36">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/4 -z-[1] h-[50vh] w-[50vh] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(91,140,255,0.18), transparent 65%)' }} />
      <div className="mx-auto max-w-4xl text-center">
        <Reveal><div className="flex justify-center"><Eyebrow>Méthode</Eyebrow></div></Reveal>
        <Reveal delay={0.06} y={28}>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6.5vw, 80px)' }}>
            En 3 étapes.<br /><span className="aurora-text italic">Pas une de plus.</span>
          </h2>
        </Reveal>
      </div>

      <div ref={ref} className="relative mx-auto mt-16 max-w-2xl pl-12 md:pl-16">
        <svg aria-hidden className="pointer-events-none absolute left-[18px] top-2 h-full w-2 md:left-[26px]"
          viewBox="0 0 2 100" preserveAspectRatio="none">
          <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(120,160,255,0.14)" strokeWidth="2" />
          <motion.line x1="1" y1="0" x2="1" y2="100" stroke="url(#methGrad)" strokeWidth="2" strokeLinecap="round" style={{ pathLength }} />
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
                className="node-dot absolute -left-[38px] top-2 h-4 w-4 rounded-full border border-green/40 bg-ink md:-left-[50px]" />
              <Reveal delay={0.05 * i}>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="font-serif-display text-[30px] leading-none text-cream md:text-[40px]">{s.k}</h3>
                  <span className="rounded-full border border-green/30 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-green">{s.meta}</span>
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
// LE DUO — Clément + Alexis. Interaction : portraits tilt/parallax léger au
// hover (spring) + N&B → couleur. + 55 000 abonnés count-up.
// ---------------------------------------------------------------------
const FOUNDERS = [
  { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC',
    role: 'Stratégie & Business IA',
    desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit, conseil et formation.",
    li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
  { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Télécom Paris · IP Paris',
    role: 'Architecture IA, Tech & Déploiement',
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
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: i * 0.12, ease }}
      style={{ perspective: 1000 }}>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
        className="group glass relative overflow-hidden rounded-3xl transition-transform duration-200 [transform-style:preserve-3d] [transition-timing-function:var(--ease-out)]"
        style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}>
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
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">{f.school}</p>
          <h3 className="font-serif-display mt-1 text-[30px] leading-none text-cream">{f.name}</h3>
          <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-cream-soft">{f.role}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-cream-soft">{f.desc}</p>
        </div>
      </div>
    </motion.div>
  );
};
const Duo: React.FC = () => (
  <section id="duo" className="section-clip relative bg-ink-2/40 px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-5xl">
      <div className="max-w-2xl">
        <Reveal><Eyebrow>Le duo</Eyebrow></Reveal>
        <Reveal delay={0.06} y={28}>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
            Deux experts,<br /><span className="aurora-text italic">un seul interlocuteur.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
            On enseigne ce qu'on déploie. Pas de théorie hors-sol : la stratégie et la technique
            dans la même équipe.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {FOUNDERS.map((f, i) => <TiltCard key={f.name} f={f} i={i} />)}
      </div>

      {/* 55 000 abonnés count-up */}
      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col items-center gap-1 text-center">
          <span className="font-serif-display text-cream" style={{ fontSize: 'clamp(48px, 9vw, 92px)' }}>
            <CountUp to={55000} suffix=" +" />
          </span>
          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-cream-dim">abonnés LinkedIn cumulés</span>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------------------------------------------------------------------
// FAQ — accordéon spring (hauteur animée), question soulignée au hover.
// ---------------------------------------------------------------------
const FAQ_ITEMS = [
  { q: 'Par où commencer ?', a: "Par un appel de 30 minutes, gratuit. On comprend votre contexte et on vous dit honnêtement si l'IA est pertinente — et par quoi commencer. Pas de vente forcée." },
  { q: 'Comment financer une formation ?', a: 'Sur le budget formation de votre entreprise. On vous fournit programme, devis et attestation. Le financement passe simplement par votre poste formation interne.' },
  { q: 'Quels sont les délais ?', a: 'Diagnostic en 30 minutes, proposition sous 48 h, démarrage dès J+1. On ne fait pas traîner : la vitesse fait partie du résultat.' },
  { q: 'Garantissez-vous des résultats ?', a: "On s'engage sur des livrables concrets et mesurables, pas sur des slides. Chaque mission est cadrée avec des objectifs chiffrés — nos cas clients le montrent." },
  { q: "C'est pour qui ?", a: 'PME, ETI, administrations, indépendants. Tout métier où des tâches répétitives, documentaires ou rédactionnelles pèsent sur le temps des équipes.' },
];
const FaqRow: React.FC<{ q: string; a: string; idx: number }> = ({ q, a, idx }) => {
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
  <section id="faq" className="section-clip relative px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-3xl">
      <Reveal><Eyebrow>Questions fréquentes</Eyebrow></Reveal>
      <Reveal delay={0.06} y={24}>
        <h2 className="font-serif-display mb-10 leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.5vw, 64px)' }}>
          Tout ce qu'on nous demande.
        </h2>
      </Reveal>
      <div>
        {FAQ_ITEMS.map((f, i) => <FaqRow key={f.q} q={f.q} a={f.a} idx={i} />)}
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------
// CTA FINAL — moment Grainient navy + Calendly inline + bouton magnétique.
// ---------------------------------------------------------------------
const CtaFinal: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  return (
    <section id="contact" ref={ref}
      className="section-clip relative isolate overflow-hidden bg-ink px-5 py-28 md:px-8 md:py-36">
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
          <Reveal delay={0.06} y={28}>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(38px, 6.5vw, 80px)' }}>
              Échangeons 30 minutes <span className="aurora-text italic">sur l'IA.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-cream-soft lg:mx-0">
              On comprend votre contexte, on vous dit honnêtement où l'IA crée de la valeur chez vous.
              Sans engagement.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 flex justify-center lg:justify-start">
              <MagneticPrimary href={CALENDLY} external>Réserver mon créneau</MagneticPrimary>
            </div>
          </Reveal>
        </div>

        {/* Calendly inline — conteneur responsive, pas de hauteur fixe agressive */}
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
// FOOTER — enrichi.
// ---------------------------------------------------------------------
const Footer: React.FC = () => (
  <footer className="relative border-t border-green/12 px-5 py-16 md:px-8">
    <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <a href="#top" className="font-serif-display text-4xl leading-none tracking-tight text-cream md:text-5xl">
          AXEM<span className="aurora-text">.</span>
        </a>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-soft">
          Votre partenaire IA, de A à Z. Formation, conseil, audit, production &amp; automatisation IA.
        </p>
      </div>
      <div>
        <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
        <ul className="space-y-2 text-sm text-cream-soft">
          {NAV_LINKS.map(([l, h]) => (
            <li key={l}><a href={h} className="transition-colors [transition-timing-function:var(--ease-out)] hover:text-cream">{l}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
        <ul className="space-y-2 text-sm text-cream-soft">
          <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors [transition-timing-function:var(--ease-out)] hover:text-cream">Réserver un appel</a></li>
          <li><a href="mailto:contact@axem-ia.fr" className="transition-colors [transition-timing-function:var(--ease-out)] hover:text-cream">contact@axem-ia.fr</a></li>
          <li><a href={CASES_URL} target="_blank" rel="noopener noreferrer" className="transition-colors [transition-timing-function:var(--ease-out)] hover:text-cream">Cas clients</a></li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-12 max-w-5xl border-t border-green/8 pt-6 text-center text-xs text-cream-dim">
      © 2026 AXEM IA — Paris, France.
    </div>
  </footer>
);

// ---------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------
const Home: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <div className="min-h-screen overflow-x-hidden text-cream"
        style={{ background: 'linear-gradient(180deg, #070B16 0%, #0B1020 55%, #0D1526 100%)' }}>
        <Nav />
        <main id="contenu">
          <Hero />
          <TrustBar />
          <SectionA />
          <Manifeste />
          <Formation />
          <Conseil />
          <Resultats />
          <Methode />
          <Duo />
          <Faq />
          <CtaFinal />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default Home;
