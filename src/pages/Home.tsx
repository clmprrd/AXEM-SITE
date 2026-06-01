import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, MotionConfig, useMotionValue, useSpring,
  useInView, useReducedMotion,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — AGENCEMENT A · « VITRINE + CATALOGUE DÉPORTÉ »
// Home curée et légère (façon AI Sisters / Mister IA) — le détail se mérite.
// 1 section = 1 idée + 1 preuve · max 3 items alignés puis « Voir tout ».
// dark #0F0F0F · mint #00FA9A · Archivo. Hero (Grainient) NON TOUCHÉ.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_INLINE = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const NOTION_URL = '#'; // TODO URL Notion — « Tous les cas clients en détail »
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// =====================================================================
// BACKGROUND HERO — Grainient (OGL). NE PAS TOUCHER.
// =====================================================================
const PALETTES = {
  iris:   { color1: '#8AB4FF', color2: '#8B5CF6', color3: '#C026D3' },
  violet: { color1: '#C9A8FF', color2: '#6D4BFF', color3: '#3F2D9E' },
  sunset: { color1: '#FFD27A', color2: '#FF6B9D', color3: '#7A3DF5' },
  ocean:  { color1: '#7DE3FF', color2: '#3B82F6', color3: '#243A8E' },
  coral:  { color1: '#FFC07A', color2: '#FF5E5B', color3: '#B02A6B' },
  mint:   { color1: '#9BFFD9', color2: '#00E0A4', color3: '#0E5C57' },
} as const;
const DEFAULT_PALETTE: keyof typeof PALETTES = 'iris';
const PALETTE_META: Record<keyof typeof PALETTES, { label: string; dot: string }> = {
  iris:   { label: 'Iris',   dot: '#8B5CF6' },
  violet: { label: 'Violet', dot: '#6D4BFF' },
  sunset: { label: 'Sunset', dot: '#FF6B9D' },
  ocean:  { label: 'Ocean',  dot: '#3B82F6' },
  coral:  { label: 'Coral',  dot: '#FF5E5B' },
  mint:   { label: 'Mint',   dot: '#00E0A4' },
};
const GRAINIENT = {
  timeSpeed: 0.18, warpStrength: 1.0, warpFrequency: 5.0, warpSpeed: 2.0,
  warpAmplitude: 50.0, blendAngle: 0.0, blendSoftness: 0.05, rotationAmount: 500.0,
  noiseScale: 2.0, grainAmount: 0.12, grainScale: 1.5, grainAnimated: false,
  contrast: 1.5, gamma: 1.0, saturation: 1.05, zoom: 0.78,
} as const;

// =====================================================================
// HELPERS
// =====================================================================
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Reveal>
    <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green">
      <span className="h-1.5 w-1.5 bg-green" />{children}
    </div>
  </Reveal>
);

const Magnetic: React.FC<any> = ({ children, strength = 0.35, className, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 13, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 13, mass: 0.5 });
  const reduce = useReducedMotion();
  const move = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return <motion.a ref={ref} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ x: sx, y: sy }} className={className} {...props}>{children}</motion.a>;
};

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; className?: string }> = ({ value, prefix = '', suffix = '', className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const start = performance.now(); let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - start) / 1600); setN(Math.round((1 - Math.pow(1 - k, 3)) * value)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const fmt = n >= 1000 ? n.toLocaleString('fr-FR') : String(n);
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

// =====================================================================
// NAV
// =====================================================================
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 24); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-2xl tracking-tighter text-cream" style={{ fontWeight: 900 }}>
          AXEM<span className="text-green">.</span>
        </a>
        <div className="hidden items-center gap-9 lg:flex">
          {[['Méthode', '#methode'], ['Prestations', '#prestations'], ['Formations', '#formations'], ['Cas clients', '#cas-clients'], ['Le duo', '#duo']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href="#rdv" strength={0.3}
          className="group inline-flex items-center gap-1.5 bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] text-ink" style={{ fontWeight: 800 }}>
          Diagnostic gratuit <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// =====================================================================
// HERO — premium centré · fond Grainient vif · NON TOUCHÉ
// =====================================================================
const Hero: React.FC = () => {
  const [pal, setPal] = useState<keyof typeof PALETTES>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('p');
      if (p && p in PALETTES) return p as keyof typeof PALETTES;
    }
    return DEFAULT_PALETTE;
  });

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-32 md:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0F0F0F]">
        <Grainient {...GRAINIENT} {...PALETTES[pal]} className="h-full w-full" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(64% 48% at 50% 42%, rgba(7,7,13,0.5) 0%, rgba(7,7,13,0.22) 44%, transparent 70%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[24%]"
        style={{ background: 'linear-gradient(180deg, transparent, #0F0F0F)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24"
        style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.42), transparent)' }} />

      {/* SÉLECTEUR DE PALETTE (démo) */}
      <div className="fixed right-3 top-24 z-50 flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/45 p-2 backdrop-blur-md md:right-5">
        <span className="px-1 pb-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-white/55">Fond hero</span>
        {(Object.keys(PALETTES) as (keyof typeof PALETTES)[]).map((k) => (
          <button key={k} type="button" onClick={() => setPal(k)}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${pal === k ? 'bg-white/20 text-white' : 'text-white/65 hover:bg-white/10'}`}>
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/30" style={{ background: PALETTE_META[k].dot }} />
            {PALETTE_META[k].label}
          </button>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 md:text-[11px]">Agence d'IA &amp; organisme de formation certifié Qualiopi</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-7 font-display leading-[0.94] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.38)]"
            style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.6vw, 88px)' }}>
            Votre partenaire IA,<br />
            <span className="relative whitespace-nowrap">de A à Z.
              <span aria-hidden className="absolute -bottom-1.5 left-0 h-[0.12em] w-full rounded-full bg-green" />
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl font-display text-xl font-bold leading-snug text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.32)] md:text-2xl">
            On vous forme, on vous conseille, on déploie. <span className="text-green">Et on reste.</span>
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.3)] md:text-base">
            AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi. Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique, de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <Magnetic href="#rdv" strength={0.35}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.65)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Diagnostic gratuit</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#prestations" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/15">
              Découvrir nos prestations <span aria-hidden>↓</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.38}>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/30 py-2 pl-2 pr-5 backdrop-blur-md">
            <div className="flex -space-x-2.5">
              <img src={CLEMENT_IMG} alt="Clément Predo" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/70" loading="lazy" />
              <img src={ALEXIS_IMG} alt="Alexis Zeitoun" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/70" loading="lazy" />
            </div>
            <span className="text-sm font-semibold text-white">
              <span className="text-green">+55 000</span> abonnés LinkedIn nous suivent
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// TRUST — 2 groupes · logos EN COULEUR sur cartes blanches · plus gros
// =====================================================================
type Logo = { src?: string; alt: string };
const CLIENTS: Logo[] = [
  { src: '/logos/carrefour.svg', alt: 'Carrefour' },
  { src: '/logos/blackfin.png', alt: 'BlackFin Capital Partners' },
  { src: '/logos/avantis.png', alt: 'Avantis' },
  { src: '/logos/kit.png', alt: 'KIT France' },
  { src: '/logos/espace2.png', alt: 'Espace 2' },
  { src: '/logos/socos.png', alt: 'Socos' },
];
const ORGANISMES: Logo[] = [
  { src: '/logos/myconnecting.png', alt: 'myconnecting' },
  { alt: 'synapse ia' }, // logo manquant → fallback nom stylé
  { src: '/logos/asphere.png', alt: 'ASphere' },
  { alt: 'AI sisters' }, // logo manquant → fallback nom stylé
  { src: '/logos/senza.png', alt: 'SENZA Formations' },
  { src: '/logos/cegos.png', alt: 'Cegos' },
];

const LogoCard: React.FC<{ logo: Logo }> = ({ logo }) => (
  <div className="flex h-20 items-center justify-center rounded-xl bg-white px-5 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.4)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-0.5 md:h-24">
    {logo.src ? (
      <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" className="max-h-12 w-auto max-w-[150px] object-contain md:max-h-14" />
    ) : (
      <span className="font-display text-lg leading-none text-ink md:text-xl" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{logo.alt}</span>
    )}
  </div>
);

const Trust: React.FC = () => (
  <section id="references" className="border-y border-cream/10 bg-ink-2 px-5 py-20 md:px-8 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <Reveal>
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-cream-dim">Ils nous font confiance</p>
        <p className="mt-2 text-center font-display text-2xl text-cream md:text-4xl" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
          Des PME aux grands comptes &amp; administrations.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mb-3 mt-14 text-[11px] font-bold uppercase tracking-[0.2em] text-green">Clients</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {CLIENTS.map((l) => <LogoCard key={l.alt} logo={l} />)}
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="mb-3 mt-12 text-[11px] font-bold uppercase tracking-[0.2em] text-green">Organismes de formation partenaires</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {ORGANISMES.map((l) => <LogoCard key={l.alt} logo={l} />)}
        </div>
      </Reveal>
    </div>
  </section>
);

// =====================================================================
// PROBLÈME — les 3 pièges (1 idée + 1 preuve)
// =====================================================================
const Problem: React.FC = () => {
  const traps = [
    { n: '01', t: 'Formations théoriques', d: "Vos équipes sont formées, mais pas opérationnelles. Du savoir, zéro réflexe." },
    { n: '02', t: 'Outils sans stratégie', d: "Des licences achetées, aucune feuille de route. L'outil dort, le budget aussi." },
    { n: '03', t: 'Aucun suivi après coup', d: "Le consultant part, les vieilles habitudes reviennent. Et tout est à refaire." },
  ];
  return (
    <section className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>Pourquoi la plupart échouent</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
            Trois pièges.<br /><span className="outline-type">On les évite tous.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            La plupart des projets IA capotent pour les mêmes raisons. Un parcours complet, pas une intervention isolée.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden border border-cream/12 bg-cream/12 md:grid-cols-3">
          {traps.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.1}>
              <div className="flex h-full flex-col gap-4 bg-ink p-8 md:p-10">
                <span className="font-display text-6xl text-cream/25 tighter md:text-7xl" style={{ fontWeight: 900 }}>{t.n}</span>
                <h3 className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>{t.t}</h3>
                <p className="text-base leading-relaxed text-cream-soft">{t.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// MÉTHODE — « En 3 étapes. Pas une de plus. »
// =====================================================================
const Method: React.FC = () => {
  const steps = [
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  return (
    <section id="methode" className="border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>Notre méthode</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
            En 3 étapes.<br /><span className="text-green">Pas une de plus.</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden border border-cream/12 bg-cream/12 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="group flex h-full flex-col gap-4 bg-ink-2 p-8 transition-colors hover:bg-ink-3 md:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-display text-7xl text-cream transition-colors group-hover:text-green tighter md:text-8xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  <span className="bg-green px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                </div>
                <h3 className="font-display text-3xl text-cream tight md:text-4xl" style={{ fontWeight: 800 }}>{s.t}</h3>
                <p className="text-base leading-relaxed text-cream-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// PRESTATIONS — les 7 en LISTE TYPO INTERACTIVE (clic → panneau détail)
// =====================================================================
type Presta = { n: string; t: string; tag: string; d: string; price: string; points: string[] };
const PRESTATIONS: Presta[] = [
  { n: '01', t: 'Audit IA', tag: '1 semaine', price: 'Sur devis', d: "On regarde avant de déployer. Diagnostic, cartographie de vos process, scoring de maturité IA, roadmap priorisée.", points: ['Analyse — cartographie des process + points de friction', 'Opportunités — cas d\'usage scorés par impact et faisabilité', 'Roadmap — plan d\'adoption séquencé 3 à 12 mois', 'Livrable — document de synthèse + recommandations concrètes'] },
  { n: '02', t: 'Conseil stratégique', tag: 'Sur devis', price: 'Sur devis', d: "On décide quoi faire, dans quel ordre, avec quels budgets. Roadmap priorisée, choix des outils, architecture, pilotage.", points: ['Accompagnement décisionnel — cadrage, arbitrages, priorisation par ROI', 'Choix des outils — architecture, fournisseurs, stack adaptée', 'Pilotage du déploiement — jalons, conduite du changement', 'Missions sur mesure — ponctuelles ou continues'] },
  { n: '03', t: 'Déploiement & automatisation', tag: 'À partir de 1 200 €', price: '1 200 € – 2 000 €', d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou abonnement suivi.", points: ['Option A — Délivrable clé en main : 1 200 € – 2 000 € (construit, testé, déployé + passation)', 'Option B — Abonnement suivi : 900 € + 80 €/mois (maintenance + évolutions)', 'Outils — n8n · Make · Claude Code', 'Un référent Axem dédié'] },
  { n: '04', t: 'Formation', tag: 'Qualiopi · OPCO', price: '200 € – 1 250 € / pers.', d: "Vos équipes opérationnelles dès J+1. Le catalogue Axem ciblé sur vos cas d'usage réels.", points: ['70 % de pratique minimum', 'Certifié Qualiopi, finançable OPCO', '10 formations · 3 niveaux', 'Inter ou intra, modulable en parcours'] },
  { n: '05', t: 'Coaching individuel', tag: '200 € / session', price: '200 € / session (1h)', d: "Pour vos profils clés : managers, dirigeants, référents IA internes. On ancre les compétences dans la durée.", points: ['1 session / semaine', 'Réalisé par Clément ou Alexis', 'Ancrage des réflexes dans la durée', 'Sur les cas d\'usage du profil'] },
  { n: '06', t: 'Production IA', tag: 'Sur devis', price: 'Sur devis (au livrable)', d: "Vidéos avatar IA, voix clonée, visuels, sites no-code, slides & présentations. Produits 10× plus vite, à coût maîtrisé.", points: ['Vidéos (avatar IA) & vidéos réseaux sociaux', 'Images & visuels · voix clonée', 'Sites web no-code', 'Slides & présentations'] },
  { n: '07', t: 'Suivi', tag: '80 € / mois', price: '80 € / mois', d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Durée moyenne d'un partenariat : 12 mois +.", points: ['Maintenance — automatisations à jour, MAJ d\'API', 'Évolutions & améliorations continues', 'Nouvelles opportunités à mesure que les équipes mûrissent', 'Production IA continue'] },
];

const Prestations: React.FC = () => {
  const [open, setOpen] = useState(0); // première ligne ouverte par défaut
  return (
    <section id="prestations" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>Ce qu'on fait</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
            Sept prestations.<br /><span className="outline-type">Un partenaire.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            De l'audit à l'autonomie. Touchez une ligne pour révéler le détail.
          </p>
        </Reveal>

        <div className="mt-16 border-t border-cream/12">
          {PRESTATIONS.map((s, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={s.n} delay={(i % 3) * 0.05}>
                <div className="border-b border-cream/12">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group block w-full py-7 text-left transition-colors hover:bg-ink-2 md:py-8"
                  >
                    <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 md:grid-cols-[110px_1fr_auto] md:gap-x-8">
                      <span className={`font-display text-xl transition-colors md:text-3xl ${isOpen ? 'text-green' : 'text-cream/30 group-hover:text-green'}`} style={{ fontWeight: 900 }}>{s.n}</span>
                      <h3 className={`font-display leading-[0.95] transition-colors tight ${isOpen ? 'text-green' : 'text-cream group-hover:text-green'}`} style={{ fontWeight: 800, fontSize: 'clamp(24px, 4vw, 54px)' }}>{s.t}</h3>
                      <span className="hidden text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft md:block md:self-center md:whitespace-nowrap">{s.tag}</span>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 pb-9 md:grid-cols-[110px_1fr_auto] md:gap-x-8 md:pb-10">
                          <div className="hidden md:block" />
                          <div className="max-w-2xl">
                            <p className="text-base leading-relaxed text-cream md:text-lg">{s.d}</p>
                            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                              {s.points.map((p) => (
                                <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-cream-soft">
                                  <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="self-start md:text-right">
                            <div className="inline-flex flex-col gap-1 border border-green/30 bg-green/5 px-5 py-3">
                              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-cream-dim">Tarif</span>
                              <span className="font-display text-lg text-green" style={{ fontWeight: 800 }}>{s.price}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// FORMATIONS (HOME) — 3 vedettes seulement + gros bouton « Voir tout »
// =====================================================================
const FORMATIONS_VEDETTES = [
  { code: 'F01', t: 'IA Essentielle', lvl: 'Socle', dur: '1 J', price: '300 €', d: 'De zéro à opérationnel en 1 journée.' },
  { code: 'F05', t: 'No-Code & Workflows', lvl: 'Automatisation', dur: '2 J', price: '800 €', d: 'Des workflows qui tournent seuls, 7j/7 — sans coder.' },
  { code: 'F06', t: 'Agent IA sur-mesure', lvl: 'Automatisation', dur: '2 J', price: '1 250 €', d: 'Un travailleur autonome qui agit seul, 24h/24.' },
];

const FormationsHome: React.FC = () => (
  <section id="formations" className="px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-[1400px]">
      <Eyebrow>Nos formations</Eyebrow>
      <Reveal delay={0.08}>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
          Trois vedettes.<br /><span className="outline-green">Dix au catalogue.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
          Les plus demandées. 70 % de pratique, un livrable réel à chaque session.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {FORMATIONS_VEDETTES.map((f, i) => (
          <Reveal key={f.code} delay={i * 0.1}>
            <a href="#catalogue" className="group flex h-full flex-col gap-4 border border-cream/12 bg-ink-2 p-8 transition-colors hover:border-green/40 hover:bg-ink-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-green" style={{ fontWeight: 900 }}>{f.code}</span>
                <span className="border border-cream/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cream-soft">{f.lvl}</span>
              </div>
              <h3 className="font-display text-2xl text-cream tight transition-colors group-hover:text-green md:text-3xl" style={{ fontWeight: 800 }}>{f.t}</h3>
              <p className="text-sm leading-relaxed text-cream-soft">{f.d}</p>
              <div className="mt-auto flex items-baseline justify-between border-t border-cream/12 pt-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-soft">{f.dur}</span>
                <span className="font-display text-2xl text-cream" style={{ fontWeight: 900 }}>{f.price}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <a href="#catalogue" className="group mt-12 flex flex-col items-center justify-between gap-4 border border-green/40 bg-green/5 px-7 py-7 text-center transition-colors hover:bg-green/10 md:flex-row md:text-left">
          <div>
            <div className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 900 }}>Voir tout le catalogue</div>
            <div className="mt-1 text-sm font-semibold uppercase tracking-[0.1em] text-green">10 formations · Qualiopi · finançable OPCO</div>
          </div>
          <span className="inline-flex items-center gap-2 bg-green px-7 py-4 text-sm uppercase tracking-[0.05em] text-ink transition-transform group-hover:translate-x-1" style={{ fontWeight: 900 }}>
            Explorer le catalogue <span aria-hidden>→</span>
          </span>
        </a>
      </Reveal>
    </div>
  </section>
);

// =====================================================================
// CAS CLIENTS (HOME) — 3 en vedette (data-viz / count-up) + lien Notion
// =====================================================================
const CasClients: React.FC = () => {
  const cases = [
    { sector: 'BTP · Chiffrage', big: <Counter value={80} suffix=" %" />, label: 'de temps de saisie économisé', sub: '95 k€/an neutralisés sur l\'avant-vente · intégration ERP KALITICS' },
    { sector: 'Administration · OCR', big: '×4', label: 'plus rapide par dossier', sub: 'fiabilité 100 % (double vérification OCR/IA) · +5 h/sem/collab' },
    { sector: 'Industrie · Conformité ADV', big: <Counter value={317} suffix=" h" />, label: 'libérées par mois', sub: 'anomalies détectées > 98 % · hébergement Europe RGPD' },
  ];
  return (
    <section id="cas-clients" className="border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>Cas clients</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            5 missions, 5 secteurs, des résultats mesurés. En voici trois.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.1}>
              <div className="group flex h-full flex-col gap-4 border border-cream/12 bg-ink p-8 transition-colors hover:border-green/40 hover:bg-ink-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">{c.sector}</span>
                <span className="font-display text-7xl text-cream transition-transform duration-300 group-hover:-translate-y-0.5 tighter md:text-8xl" style={{ fontWeight: 900 }}>{c.big}</span>
                <span className="text-base font-bold text-cream">{c.label}</span>
                <p className="text-sm leading-relaxed text-cream-soft">{c.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <a href={NOTION_URL} target="_blank" rel="noopener noreferrer" className="group mt-12 inline-flex items-center gap-3 border border-cream/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-cream transition-colors hover:border-green hover:text-green">
            Voir tous les cas clients en détail
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </a>
          <p className="mt-3 text-sm text-cream-dim">Méthodologies, livrables, retours d'expérience et résultats détaillés.</p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// RESPIRATION — « Que du livrable. »
// =====================================================================
const Breath: React.FC = () => (
  <section className="flex min-h-[60svh] items-center justify-center px-5 py-28 md:px-8">
    <Reveal>
      <p className="text-center font-display leading-[0.86] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(56px, 13vw, 240px)' }}>
        Que du <span className="text-green">livrable.</span>
      </p>
    </Reveal>
  </section>
);

// =====================================================================
// POURQUOI AXEM / DUO
// =====================================================================
const WhyDuo: React.FC = () => {
  const reasons = [
    { n: '01', t: 'Partenaire sur la durée', d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff." },
    { n: '02', t: '70 % de pratique minimum', d: 'Opérationnel dès J+1. Chaque formation produit un livrable réel.' },
    { n: '03', t: 'Résultats mesurés', d: 'ROI documenté, des livrables concrets — pas des slides.' },
    { n: '04', t: 'Toujours à jour', d: 'Outils & méthodes 2025/2026. On suit le rythme du marché.' },
    { n: '05', t: 'Un seul interlocuteur', d: 'Du diagnostic au déploiement. Vous parlez à ceux qui livrent.' },
  ];
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>Pourquoi AXEM</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.88] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 140px)' }}>
            A<span className="text-green">XE</span>M,<br />c'est nous deux.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.
          </p>
        </Reveal>

        {/* 5 raisons en liste compacte */}
        <div className="mt-14 grid gap-px overflow-hidden border border-cream/12 bg-cream/12 sm:grid-cols-2 lg:grid-cols-5">
          {reasons.map((r, i) => (
            <Reveal key={r.n} delay={(i % 5) * 0.06}>
              <div className="flex h-full flex-col gap-2 bg-ink p-6">
                <span className="font-display text-xl text-green" style={{ fontWeight: 900 }}>{r.n}</span>
                <h3 className="font-display text-lg text-cream tight" style={{ fontWeight: 800 }}>{r.t}</h3>
                <p className="text-sm leading-relaxed text-cream-soft">{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Duo fondateurs */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden border border-cream/12 bg-ink-2 transition-colors hover:border-green/40">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center bg-green text-ink shadow-lg transition-transform hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-7 md:p-9">
                  <div>
                    <h3 className="font-display text-3xl text-cream tighter md:text-4xl" style={{ fontWeight: 900 }}>{f.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-green">{f.school}</p>
                    <p className="text-sm text-cream-soft">{f.role}</p>
                  </div>
                  <p className="text-base leading-relaxed text-cream-soft">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-cream/12 pt-5">
                    <span className="font-display text-5xl text-cream" style={{ fontWeight: 900 }}><Counter value={f.n} prefix="+" /></span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-14 text-center font-display text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 110px)' }}>
            Ensemble, <span className="text-green">AXEM</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// SECTION CATALOGUE DÉDIÉE (#catalogue) — onglets par niveau + grille F01→F10
// clic carte = fiche détail · bootcamps + vidéos + OPCO ICI (pas sur la home)
// =====================================================================
type Niveau = 'Tous' | 'Socle' | 'Métiers' | 'Automatisation' | 'Transversal' | 'Production';
type Formation = {
  code: string; t: string; niveau: Exclude<Niveau, 'Tous'>; dur: string; price: string;
  pitch: string; prog: string[]; outils: string; livrables: string; prereq?: string;
};
const CATALOGUE: Formation[] = [
  { code: 'F01', t: 'IA Essentielle', niveau: 'Socle', dur: '1 J', price: '300 €', pitch: 'De zéro à opérationnel en 1 journée.',
    prog: ['Matin — Comprendre l\'IA : fonctionnement d\'un LLM (sans jargon), RGPD, identifier ses cas d\'usage métier', 'Après-midi — Pratiquer : Prompt Engineering RACF, 15 exercices sur cas réels, plan d\'action J+1'],
    outils: 'Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash · Perplexity', livrables: 'Guide 50 Prompts par Métier · Charte d\'usage IA · Fiche 3 Quick Wins J+1' },
  { code: 'F02', t: 'Prompt Engineering Pro', niveau: 'Socle', dur: '½ J', price: '200 €', pitch: 'Multiplier par 5 la qualité de ses outputs IA.',
    prog: ['Techniques avancées : Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting', '20 exercices chronométrés sur cas réels', 'Bibliothèque de prompts d\'équipe (template Notion en live) · Atelier 5 prompts signature'],
    outils: 'Claude Opus 4.6 · GPT-5.2 · Gemini 3.1 Pro', livrables: 'Template Bibliothèque Prompts Notion · Fiche mémo Techniques Avancées' },
  { code: 'F03', t: 'Maîtriser Claude', niveau: 'Socle', dur: '1 J', price: '450 €', pitch: 'Devenir expert de l\'IA qui pèse 70 % du Fortune 100.',
    prog: ['Matin — Bases : Claude vs ChatGPT vs Gemini, Sonnet 4.6 / Opus 4.6, Projects, Artifacts, Computer Use', 'Après-midi — Expert : Claude Skills, MCP, Cowork & Sub-agents, atelier 3 Skills'],
    outils: 'Claude Opus 4.6 · Sonnet 4.6 · Skills · MCP · Cowork', livrables: 'Pack 10 Skills Axem · Guide Claude Power User · Charte d\'usage Claude' },
  { code: 'F04', t: 'IA pour tous les métiers', niveau: 'Métiers', dur: '1 J', price: '400 €', pitch: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    prog: ['Modules : Direction & Stratégie · Marketing & Commercial · RH & Recrutement · Finance & Compta', 'Juridique & Compliance · Service Client · Réseaux Sociaux & Brand · Créatif & Design', 'Modules combinables, contenus 2026'],
    outils: 'Adapté au métier (Claude · GPT · Gemini)', livrables: 'Guides & prompts sectoriels selon les modules choisis' },
  { code: 'F05', t: 'No-Code & Workflows', niveau: 'Automatisation', dur: '2 J', price: '800 €', pitch: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    prog: ['J1 — Make & n8n : 3 automatisations live (Formulaire→CRM, Email→Slack, RSS→LinkedIn), 1 workflow déployé avant 18h', 'J2 — Intégrer Claude/GPT/Gemini, conditions complexes / erreurs / boucles, projet final en prod'],
    outils: 'Make · n8n · Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash', livrables: '10 templates Make & n8n prêts à cloner · Guide Connecter 50 outils' },
  { code: 'F06', t: 'Agent IA sur-mesure', niveau: 'Automatisation', dur: '2 J', price: '1 250 €', pitch: 'Un travailleur autonome qui agit seul, 24h/24.', prereq: 'F05 ou pratique API',
    prog: ['J1 — Architecture : LLM + Mémoire + Outils + Planification, frameworks (n8n Agents, CrewAI, LangGraph), RAG, MCP', 'J2 — Déploiement : 3 patterns business (Support 24/7, SDR, Admin), Claude Skills, validation humaine / RGPD, projet final'],
    outils: 'Claude Opus 4.6 · GPT-5.2 · n8n Agents · CrewAI · LangGraph · Pinecone · MCP', livrables: 'Template Agent IA n8n/LangGraph · Guide 6 Architectures d\'Agents · Checklist sécurité' },
  { code: 'F07', t: 'Vibe Coding & Claude Code', niveau: 'Automatisation', dur: '1 J', price: '450 €', pitch: 'Construire des outils sans coder, avec l\'IA comme binôme.',
    prog: ['Matin — Lovable / Bolt.new / v0 (app web en 1h), méthode du vibe coding structuré, atelier micro-outil métier', 'Après-midi — Cursor IDE, Claude Code (CLI), workflows générer/tester/déployer, sécurité & gouvernance'],
    outils: 'Cursor · Claude Code · Lovable · Bolt.new · v0 · GitHub Copilot', livrables: 'Pack Prompts Vibe Coding · Guide Cursor & Claude Code · 3 mini-apps livrées' },
  { code: 'F08', t: 'Gouvernance & AI Act', niveau: 'Transversal', dur: '½ J', price: '250 €', pitch: 'Cadrer ses usages IA en conformité.',
    prog: ['AI Act 2026 (interdit / obligatoire), RGPD & IA (serveurs US OpenAI / Anthropic)', 'Construire sa charte IA + traçabilité, 5 cas pratiques live, matrice de risques AI Act'],
    outils: 'AI Act 2026 · CNIL · Frameworks RGPD', livrables: 'Template Charte IA · Matrice de risques AI Act · Plan de mise en conformité 90 jours' },
  { code: 'F09', t: 'Veille IA', niveau: 'Transversal', dur: '2 h', price: '80 € · 320 €/an', pitch: 'Rester à jour sur un champ qui bouge tous les mois.',
    prog: ['10 avancées IA majeures (démos live), méthode de veille perso 20 min/semaine', 'Horizon 12-24 mois, modulable selon métier · abonnement annuel 320 €/pers (4 sessions/an)'],
    outils: 'Perplexity · Claude · Veille IA Axem · Newsletters', livrables: 'Template Notion Veille IA · Liste 30 sources curées · Replays' },
  { code: 'F10', t: 'Création IA — Visuel · Vidéo · Voix', niveau: 'Production', dur: '1 J', price: '400 €', pitch: 'Produire 10× plus vite, à coût maîtrisé.',
    prog: ['Matin — Images : Midjourney V7, DALL-E 4, Firefly 3, Nano Banana Pro · logos · infographies · sites 1h', 'Après-midi — Vidéo & voix : Synthesia, ElevenLabs, Kling 2.5 / Sora 2 / Veo 3.1, repurposing (1 contenu = 8 formats)'],
    outils: 'Midjourney · DALL-E · Firefly · Synthesia · ElevenLabs · CapCut AI · Opus Clip', livrables: 'Guide 30 Outils Créatifs IA 2026 · Pack 50 Prompts Midjourney · Templates Gamma' },
];
const NIVEAUX: Niveau[] = ['Tous', 'Socle', 'Métiers', 'Automatisation', 'Transversal', 'Production'];

const Catalogue: React.FC = () => {
  const [tab, setTab] = useState<Niveau>('Tous');
  const [detail, setDetail] = useState<Formation | null>(null);
  const list = tab === 'Tous' ? CATALOGUE : CATALOGUE.filter((f) => f.niveau === tab);

  return (
    <section id="catalogue" className="border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>Catalogue de formation 2025-2026</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
            10 formations.<br /><span className="outline-type">3 niveaux. 70 % pratique.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            Construites de A à Z selon vos besoins, contraintes et cas d'usage. Tarifs HT / participant. Inter ou intra. Cliquez une formation pour la fiche détaillée.
          </p>
        </Reveal>

        {/* Onglets par niveau */}
        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-wrap gap-2">
            {NIVEAUX.map((nv) => (
              <button key={nv} type="button" onClick={() => setTab(nv)}
                className={`px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${tab === nv ? 'bg-green text-ink' : 'border border-cream/15 text-cream-soft hover:border-green/50 hover:text-cream'}`}>
                {nv}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grille F01 → F10 */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f) => (
            <button key={f.code} type="button" onClick={() => setDetail(f)}
              className="group flex h-full flex-col gap-3 border border-cream/12 bg-ink p-6 text-left transition-colors hover:border-green/40 hover:bg-ink-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl text-green" style={{ fontWeight: 900 }}>{f.code}</span>
                <span className="border border-cream/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-cream-soft">{f.niveau}</span>
              </div>
              <h3 className="font-display text-xl text-cream tight transition-colors group-hover:text-green" style={{ fontWeight: 800 }}>{f.t}</h3>
              <p className="text-sm leading-relaxed text-cream-soft">{f.pitch}</p>
              <div className="mt-auto flex items-baseline justify-between border-t border-cream/12 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft">{f.dur}</span>
                <span className="font-display text-lg text-cream" style={{ fontWeight: 900 }}>{f.price}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Bootcamps + formations vidéos */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-3 border border-cream/12 bg-ink p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Bootcamps immersifs · sur devis</span>
              <h3 className="font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>Format intensif sur-mesure</h3>
              <p className="text-sm leading-relaxed text-cream-soft">
                <strong className="text-cream">B01 · IA &amp; Social Media (le MVP)</strong> — 3 jours, 90 % pratique sur vos données : 20-30 posts créés, calendrier automatisé, playbook + 1 automatisation live.
              </p>
              <p className="text-sm leading-relaxed text-cream-soft">
                <strong className="text-cream">B02 · Performance &amp; Scale</strong> — +2 jours d'extension : A/B testing, funnels, scale vidéos courtes, autonomie 24/7 (agents IA + chatbots).
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col gap-3 border border-cream/12 bg-ink p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Formations vidéos · sur devis</span>
              <h3 className="font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>Masterclass 24/7, à son rythme</h3>
              <p className="text-sm leading-relaxed text-cream-soft">
                40-45 vidéos HD au format screencast pas-à-pas, cas d'usage métiers, config de workflows en live, MAJ 2026.
              </p>
              <p className="text-sm leading-relaxed text-cream-soft">
                Plateforme dédiée, templates téléchargeables, bibliothèques de prompts sectoriels. Idéal pour l'onboarding d'une nouvelle recrue.
              </p>
            </div>
          </Reveal>
        </div>

        {/* OPCO via IZY for pro — 3 étapes */}
        <Reveal delay={0.12}>
          <div className="mt-12 border border-green/30 bg-green/5 p-8 md:p-10">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Financement</div>
            <h3 className="mt-2 font-display text-3xl text-cream tight md:text-4xl" style={{ fontWeight: 800 }}>
              Finançables OPCO via portage IZY for pro.
            </h3>
            <p className="mt-3 max-w-2xl text-cream-soft">Prise en charge possible jusqu'à 100 %. Un interlocuteur unique côté Axem.</p>
            <div className="mt-8 grid gap-px overflow-hidden border border-cream/12 bg-cream/12 md:grid-cols-3">
              {[
                { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier les 3 formations les plus rentables.' },
                { n: '02', t: 'Devis & dossier OPCO', d: 'Proposition sous 48h, prise en charge via portage IZY for pro, démarches simplifiées.' },
                { n: '03', t: 'Formation', d: 'Équipes opérationnelles dès J+1, livrables concrets, suivi post-formation.' },
              ].map((s) => (
                <div key={s.n} className="flex h-full flex-col gap-2 bg-ink p-6">
                  <span className="font-display text-4xl text-green tighter" style={{ fontWeight: 900 }}>{s.n}</span>
                  <h4 className="font-display text-lg text-cream tight" style={{ fontWeight: 800 }}>{s.t}</h4>
                  <p className="text-sm leading-relaxed text-cream-soft">{s.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-cream-dim">contact@axem-ia.fr</p>
          </div>
        </Reveal>
      </div>

      {/* MODALE FICHE DÉTAIL */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-6"
            onClick={() => setDetail(null)} role="dialog" aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90svh] w-full max-w-2xl overflow-y-auto border border-cream/15 bg-ink-2 p-8 md:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl text-green" style={{ fontWeight: 900 }}>{detail.code}</span>
                    <span className="border border-cream/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cream-soft">{detail.niveau}</span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl text-cream tight md:text-4xl" style={{ fontWeight: 900 }}>{detail.t}</h3>
                  <p className="mt-2 text-cream-soft">{detail.pitch}</p>
                </div>
                <button type="button" onClick={() => setDetail(null)} aria-label="Fermer"
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-green hover:text-green">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="border border-cream/15 px-3 py-1.5 text-sm font-bold text-cream">{detail.dur}</span>
                <span className="border border-green/40 bg-green/5 px-3 py-1.5 text-sm font-bold text-green">{detail.price}</span>
                {detail.prereq && <span className="border border-cream/15 px-3 py-1.5 text-sm text-cream-soft">Prérequis : {detail.prereq}</span>}
              </div>

              <div className="mt-7">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Programme</div>
                <ul className="mt-3 space-y-2.5">
                  {detail.prog.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-cream-soft">
                      <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Outils</div>
                  <p className="mt-2 text-sm leading-relaxed text-cream-soft">{detail.outils}</p>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Livrables</div>
                  <p className="mt-2 text-sm leading-relaxed text-cream-soft">{detail.livrables}</p>
                </div>
              </div>

              <a href="#rdv" onClick={() => setDetail(null)}
                className="mt-8 inline-flex items-center gap-2 bg-green px-6 py-3.5 text-sm uppercase tracking-[0.05em] text-ink" style={{ fontWeight: 900 }}>
                Réserver cette formation <span aria-hidden>→</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// =====================================================================
// FAQ / OPCO — questions clés (financement, format, délais)
// =====================================================================
const Faq: React.FC = () => {
  const items = [
    { q: 'Vos formations sont-elles finançables ?', a: 'Oui. Certifiées Qualiopi et finançables OPCO via portage IZY for pro — prise en charge possible jusqu\'à 100 %. On gère le dossier, vous avez un interlocuteur unique.' },
    { q: 'Combien de temps avant de démarrer ?', a: 'Diagnostic gratuit de 30 min, proposition sous 48h, exécution dès J+1. Pas de cycle de vente interminable.' },
    { q: 'Inter, intra, distanciel ?', a: 'Les trois. Inter ou intra-entreprise, en présentiel ou à distance. Tout est modulable en parcours et bootcamps sur devis.' },
    { q: 'Et après la formation ?', a: 'On reste. Maintenance, évolutions, nouvelles automatisations, coaching des profils clés. Durée moyenne d\'un partenariat : 12 mois et plus.' },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>Questions fréquentes</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 110px)' }}>
            OPCO, délais,<br /><span className="outline-type">format.</span>
          </h2>
        </Reveal>
        <div className="mt-14 border-t border-cream/12">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="border-b border-cream/12">
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left">
                  <span className="font-display text-xl text-cream tight md:text-2xl" style={{ fontWeight: 800 }}>{it.q}</span>
                  <span className={`shrink-0 text-green transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease }} className="overflow-hidden">
                      <p className="max-w-2xl pb-7 text-base leading-relaxed text-cream-soft md:text-lg">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// CTA FINAL — widget Calendly inline
// =====================================================================
const FinalCTA: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = 'calendly-widget-js';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);
  return (
    <section id="rdv" className="border-t border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>Démarrons</Eyebrow>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
            Diagnostic<br /><span className="text-green">gratuit.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
            <br /><a href="mailto:contact@axem-ia.fr" className="mt-2 inline-block font-bold text-green transition-colors hover:text-cream">contact@axem-ia.fr</a>
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-12 overflow-hidden border border-cream/12 bg-ink">
            <div ref={ref} className="calendly-inline-widget" data-url={CALENDLY_INLINE} style={{ minWidth: 320, height: 700 }} />
          </div>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-4 text-center text-sm text-cream-dim">
            Le widget ne charge pas ? <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="font-semibold text-green hover:text-cream">Réservez directement sur Calendly →</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// FOOTER
// =====================================================================
const Footer: React.FC = () => (
  <footer className="border-t border-cream/10 bg-ink px-5 py-16 md:px-8">
    <div className="mx-auto max-w-[1400px]">
      <div className="font-display leading-[0.85] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(64px, 16vw, 260px)' }}>
        AXEM<span className="text-green">.</span>
      </div>
      <div className="mt-12 grid gap-10 border-t border-cream/12 pt-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-xs text-sm text-cream-soft">Votre partenaire IA, de A à Z. Agence d'IA &amp; organisme de formation certifié Qualiopi.</p>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
          <ul className="space-y-2 text-sm text-cream-soft">{[['Méthode', '#methode'], ['Prestations', '#prestations'], ['Formations', '#formations'], ['Catalogue', '#catalogue'], ['Cas clients', '#cas-clients'], ['Le duo', '#duo']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href="#rdv" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
            <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-cream">contact@axem-ia.fr</a></li>
            <li>axem-ia.fr</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/12 pt-8 text-xs text-cream-dim md:flex-row">
        <span>© 2026 AXEM IA — Paris, France</span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Qualiopi · Finançable OPCO
        </span>
      </div>
    </div>
  </footer>
);

// =====================================================================
// PAGE — arc narratif A
// =====================================================================
const Home: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-ink">
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Problem />
        <Method />
        <Prestations />
        <FormationsHome />
        <CasClients />
        <Breath />
        <WhyDuo />
        <Catalogue />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
