import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useMotionValue, useSpring,
  useInView, useReducedMotion, MotionConfig,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — BENTO SYSTÈME
// Grilles bento, cartes cliquables qui s'ouvrent · aplats mint + noir · dark #0F0F0F
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_INLINE = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
// TODO: URL Notion à fournir
const NOTION_URL = 'NOTION_URL';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// =====================================================================
// BACKGROUND HERO — Grainient (OGL). 6 mix de couleurs VIFS, virales SaaS.
// (color3 = base saturée, jamais quasi-noire → gradient lumineux, pas vaseux)
// =====================================================================
const PALETTES = {
  iris:   { color1: '#8AB4FF', color2: '#8B5CF6', color3: '#C026D3' }, // bleu → violet → fuchsia
  violet: { color1: '#C9A8FF', color2: '#6D4BFF', color3: '#3F2D9E' }, // lavande → violet → indigo
  sunset: { color1: '#FFD27A', color2: '#FF6B9D', color3: '#7A3DF5' }, // ambre → rose → violet
  ocean:  { color1: '#7DE3FF', color2: '#3B82F6', color3: '#243A8E' }, // cyan → bleu → navy
  coral:  { color1: '#FFC07A', color2: '#FF5E5B', color3: '#B02A6B' }, // pêche → corail → magenta
  mint:   { color1: '#9BFFD9', color2: '#00E0A4', color3: '#0E5C57' }, // mint → émeraude → teal (marque)
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

// ---------- helpers ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
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

// Icône +/× animée pour les cartes qui s'ouvrent
const PlusToggle: React.FC<{ open: boolean; className?: string }> = ({ open, className = '' }) => (
  <span className={`relative inline-flex h-6 w-6 shrink-0 items-center justify-center ${className}`} aria-hidden>
    <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
    <motion.span className="absolute h-[2px] w-3.5 rounded-full bg-current" animate={{ rotate: open ? 0 : 90 }} transition={{ duration: 0.3, ease }} />
  </span>
);

// Conteneur d'accordéon (grid-rows 0fr→1fr, opacity uniquement)
const Collapse: React.FC<{ open: boolean; children: React.ReactNode }> = ({ open, children }) => (
  <motion.div initial={false} animate={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
    transition={{ duration: 0.4, ease }} style={{ display: 'grid' }}>
    <div className="overflow-hidden">{children}</div>
  </motion.div>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 24); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-2xl tracking-tighter text-cream" style={{ fontWeight: 900 }}>
          AXEM<span className="text-green">.</span>
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {[['Prestations', '#prestations'], ['Catalogue', '#catalogue'], ['Cas clients', '#cas-clients'], ['Le duo', '#duo'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.1em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
          className="group inline-flex items-center gap-1.5 bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] text-ink" style={{ fontWeight: 800 }}>
          Rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------- HERO : premium centré · fond Grainient vif · façon AI Sisters ----------
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
      {/* BACKGROUND — Grainient vif (OGL) — z-0 dans le stacking context de la section */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0F0F0F]">
        <Grainient {...GRAINIENT} {...PALETTES[pal]} className="h-full w-full" />
      </div>
      {/* lisibilité MINIMALE — on garde le fond LUMINEUX comme la démo React Bits */}
      {/* léger spot derrière le texte seulement (le reste reste vif) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(64% 48% at 50% 42%, rgba(7,7,13,0.5) 0%, rgba(7,7,13,0.22) 44%, transparent 70%)' }} />
      {/* fondu bas vers le fond du site + voile haut discret pour la nav */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[24%]"
        style={{ background: 'linear-gradient(180deg, transparent, #0F0F0F)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24"
        style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.42), transparent)' }} />

      {/* SÉLECTEUR DE PALETTE (démo — retiré une fois la couleur choisie) */}
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

      {/* CONTENU */}
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
            <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.35}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.65)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Prendre rendez-vous</span>
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

// ---------- TRUST : 2 groupes · logos couleur sur cartes blanches (plaquette) ----------
type LogoItem = { src?: string; alt: string; fallback?: string };
const LogoCard: React.FC<{ item: LogoItem }> = ({ item }) => (
  <div className="group flex h-[78px] items-center justify-center rounded-2xl bg-white px-4 shadow-[0_2px_14px_-6px_rgba(0,0,0,0.5)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,250,154,0.4)] md:h-[92px] md:px-6">
    {item.src ? (
      <img src={item.src} alt={item.alt} loading="lazy" decoding="async"
        className="max-h-[44px] w-auto max-w-full object-contain md:max-h-[52px]" />
    ) : (
      <span className="text-center font-display text-base font-extrabold tracking-tight text-[#0F0F0F] md:text-xl">{item.fallback || item.alt}</span>
    )}
  </div>
);

const Trust: React.FC = () => {
  const clients: LogoItem[] = [
    { src: '/logos/carrefour.svg', alt: 'Carrefour' },
    { src: '/logos/blackfin.png', alt: 'BlackFin Capital Partners' },
    { src: '/logos/avantis.png', alt: 'Avantis' },
    { src: '/logos/kit.png', alt: 'KIT France' },
    { src: '/logos/espace2.png', alt: 'Espace 2' },
    { src: '/logos/socos.png', alt: 'Socos Services' },
  ];
  const partenaires: LogoItem[] = [
    { src: '/logos/myconnecting.png', alt: 'myconnecting' },
    { alt: 'synapse ia', fallback: 'synapse ia' },
    { src: '/logos/asphere.png', alt: 'ASphere' },
    { alt: 'AI sisters', fallback: 'AI sisters' },
    { src: '/logos/senza.png', alt: 'SENZA Formations' },
    { src: '/logos/cegos.png', alt: 'Cegos' },
  ];
  return (
    <section id="references" className="relative border-y border-white/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Références</div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 110px)' }}>
            Ils nous font<br /><span className="text-green">confiance.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-base text-cream-soft md:text-lg">Des grands comptes aux PME, en passant par les administrations et les organismes de formation leaders du marché.</p>
        </Reveal>

        {/* GROUPE 1 — CLIENTS */}
        <Reveal delay={0.05}>
          <div className="mt-16 flex items-center gap-3">
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-cream">Clients</span>
            <span className="h-px flex-1 bg-cream/12" />
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {clients.map((l, i) => (
            <Reveal key={l.alt} delay={(i % 6) * 0.05}><LogoCard item={l} /></Reveal>
          ))}
        </div>

        {/* GROUPE 2 — ORGANISMES PARTENAIRES */}
        <Reveal delay={0.05}>
          <div className="mt-14 flex items-center gap-3">
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-cream">Organismes de formation partenaires</span>
            <span className="h-px flex-1 bg-cream/12" />
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {partenaires.map((l, i) => (
            <Reveal key={l.alt} delay={(i % 6) * 0.05}><LogoCard item={l} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- SERVICES : 7 prestations · cartes bento cliquables → détail ----------
type ServiceDetail = { heading: string; points: string[] };
type Service = { n: string; t: string; d: string; price: string; span?: string; details: ServiceDetail[]; punch?: string };

const SERVICES: Service[] = [
  {
    n: '01', t: 'Audit IA', price: '1 semaine · sur devis', span: 'lg:col-span-2',
    d: "On regarde avant de déployer. Diagnostic, cartographie de vos process, scoring de maturité IA, roadmap priorisée.",
    details: [{
      heading: 'Process en 4 étapes',
      points: [
        '01 Analyse — cartographie des process + points de friction',
        '02 Opportunités — cas d’usage scorés par impact et faisabilité',
        '03 Roadmap — plan d’adoption séquencé sur 3 à 12 mois',
        '04 Livrable — document de synthèse + recommandations concrètes',
      ],
    }],
  },
  {
    n: '02', t: 'Conseil stratégique', price: 'Sur devis',
    d: "On décide quoi faire, dans quel ordre, avec quels budgets. Roadmap priorisée, choix des outils, architecture, pilotage.",
    details: [{
      heading: 'Ce que ça couvre',
      points: [
        'Accompagnement décisionnel — cadrage, arbitrages, priorisation par ROI',
        'Choix des outils — architecture, sélection fournisseurs, stack adaptée',
        'Pilotage du déploiement — coordination équipes, jalons, conduite du changement',
        'Missions sur mesure — ponctuelles ou continues',
      ],
    }],
  },
  {
    n: '03', t: 'Déploiement & automatisation', price: 'À partir de 1 200 €', span: 'lg:col-span-2',
    d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou suivi.",
    punch: 'Automatisation : libérez vos équipes des tâches répétitives.',
    details: [
      { heading: 'Option A — Délivrable clé en main · 1 200 € – 2 000 €', points: [
        'Automatisation construite, testée et déployée',
        'Outils n8n / Make / Claude Code',
        'Documentation + passation',
      ] },
      { heading: 'Option B — Abonnement suivi · 900 € + 80 €/mois', points: [
        'Maintenance + évolutions incluses',
        'Nouvelles automatisations au fil du temps',
        'Un référent Axem dédié',
      ] },
    ],
  },
  {
    n: '04', t: 'Formation', price: '200 € – 1 250 € / pers.',
    d: "Upskilling de vos équipes sur les cas d’usage identifiés. 70 % de pratique, certifié Qualiopi, finançable OPCO.",
    details: [{ heading: 'Notre catalogue s’active ici', points: [
      '10 formations, 3 niveaux, ciblées sur vos besoins réels',
      '70 % de pratique minimum — opérationnel dès J+1',
      'Certifié Qualiopi · finançable OPCO (jusqu’à 100 %)',
      'Voir le catalogue complet plus bas ↓',
    ] }],
  },
  {
    n: '05', t: 'Coaching individuel', price: '200 € / session (1h)',
    d: "Pour vos profils clés : managers, dirigeants, référents IA internes. On ancre les compétences dans la durée.",
    details: [{ heading: 'Format', points: [
      '1 session / semaine (1h)',
      'Réalisé directement par Clément ou Alexis',
      'Ancrage des compétences dans la durée',
    ] }],
  },
  {
    n: '06', t: 'Production IA', price: 'Sur devis (au livrable)',
    d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite, à coût maîtrisé.",
    details: [{ heading: 'Ce qu’on produit', points: [
      'Vidéos (avatar IA) · vidéos réseaux sociaux',
      'Images & visuels · voix clonée',
      'Sites web no-code · slides & présentations',
    ] }],
  },
  {
    n: '07', t: 'Suivi', price: '80 € / mois', span: 'lg:col-span-2',
    d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. La relation devient long terme.",
    punch: 'Durée moyenne d’un partenariat : 12 mois +',
    details: [{ heading: 'Ce qui change la trajectoire, c’est l’après', points: [
      'Maintenance — automatisations à jour, MAJ d’API',
      'Évolutions & améliorations continues',
      'Nouvelles opportunités — à mesure que les équipes mûrissent',
      'Production IA continue',
    ] }],
  },
];

const ServiceCard: React.FC<{ s: Service; index: number }> = ({ s, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={(index % 3) * 0.05} className={s.span}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="group flex h-full w-full flex-col border border-cream/12 bg-ink-2 p-7 text-left transition-colors hover:border-green/40 hover:bg-ink-3 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="font-display text-2xl text-green md:text-3xl" style={{ fontWeight: 900 }}>{s.n}</span>
          <PlusToggle open={open} className="text-cream-soft group-hover:text-green" />
        </div>
        <h3 className="mt-4 font-display leading-[0.98] text-cream transition-colors group-hover:text-green tight" style={{ fontWeight: 800, fontSize: 'clamp(24px, 3vw, 38px)' }}>{s.t}</h3>
        <p className="mt-3 text-sm leading-relaxed text-cream-soft md:text-base">{s.d}</p>
        <span className="mt-4 inline-flex w-fit rounded-full border border-green/30 bg-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-green">{s.price}</span>

        <Collapse open={open}>
          <div className="mt-6 space-y-5 border-t border-cream/12 pt-6">
            {s.details.map((d) => (
              <div key={d.heading}>
                <p className="mb-2 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-cream">{d.heading}</p>
                <ul className="space-y-1.5">
                  {d.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-cream-soft">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-green" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {s.punch && <p className="font-display text-base font-bold italic text-green">« {s.punch} »</p>}
          </div>
        </Collapse>
      </button>
    </Reveal>
  );
};

const Services: React.FC = () => (
  <section id="prestations" className="px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-[1400px]">
      <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Ce qu'on fait</div></Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
          Sept prestations.<br /><span className="outline-type">Un partenaire.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.14}><p className="mt-7 max-w-2xl text-base text-cream-soft md:text-lg">Un parcours complet, pas une intervention isolée. <span className="text-cream">Cliquez sur une carte</span> pour le détail.</p></Reveal>

      <div className="mt-14 grid gap-3 md:gap-4 lg:grid-cols-3">
        {SERVICES.map((s, i) => <ServiceCard key={s.n} s={s} index={i} />)}
      </div>
    </div>
  </section>
);

// ---------- CATALOGUE FORMATIONS : bento par niveau · cartes cliquables → détail ----------
type Formation = {
  code: string; t: string; level: string; duree: string; prix: string;
  tagline: string;
  programme: { title?: string; points: string[] }[];
  outils: string[];
  livrables: string[];
};

const FORMATIONS: Formation[] = [
  {
    code: 'F01', t: 'IA Essentielle', level: 'SOCLE', duree: '1 J', prix: '300 €',
    tagline: 'De zéro à opérationnel en 1 journée.',
    programme: [
      { title: 'Matin · Comprendre l’IA', points: ['Comment fonctionne un LLM (sans jargon)', 'RGPD : ce qu’on peut envoyer ou pas à une IA', 'Identifier ses cas d’usage métier'] },
      { title: 'Après-midi · Pratiquer', points: ['Prompt Engineering — structure RACF (Rôle/Action/Contexte/Format)', '15 exercices sur cas réels par métier', 'Plan d’action J+1 : 3 actions à déployer demain matin'] },
    ],
    outils: ['Claude Sonnet 4.6', 'GPT-5.2', 'Gemini 3 Flash', 'Perplexity'],
    livrables: ['Guide 50 Prompts par Métier', 'Charte d’usage IA', 'Fiche 3 Quick Wins J+1'],
  },
  {
    code: 'F02', t: 'Prompt Engineering Pro', level: 'SOCLE', duree: '½ J', prix: '200 €',
    tagline: 'Multiplier par 5 la qualité de ses outputs IA.',
    programme: [
      { points: ['Techniques avancées : Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting', '20 exercices chronométrés sur cas réels', 'Construire sa bibliothèque de prompts d’équipe (template Notion configuré en live)', 'Atelier final : 5 prompts signature'] },
    ],
    outils: ['Claude Opus 4.6', 'GPT-5.2', 'Gemini 3.1 Pro'],
    livrables: ['Template Bibliothèque Prompts Notion', 'Fiche mémo Techniques Avancées'],
  },
  {
    code: 'F03', t: 'Maîtriser Claude', level: 'SOCLE', duree: '1 J', prix: '450 €',
    tagline: 'Devenir expert de l’IA qui pèse 70 % du Fortune 100.',
    programme: [
      { title: 'Matin · bases solides', points: ['Claude vs ChatGPT vs Gemini', 'Modèles Sonnet 4.6 et Opus 4.6', 'Projects, Artifacts, Computer Use'] },
      { title: 'Après-midi · niveau expert', points: ['Claude Skills', 'MCP (Model Context Protocol)', 'Cowork & Sub-agents', 'Atelier : 3 Skills'] },
    ],
    outils: ['Claude Opus 4.6', 'Sonnet 4.6', 'Skills', 'MCP', 'Cowork'],
    livrables: ['Pack 10 Skills Axem', 'Guide Claude Power User', 'Charte d’usage Claude'],
  },
  {
    code: 'F04', t: 'IA pour tous les métiers', level: 'MÉTIERS', duree: '1 J', prix: '400 €',
    tagline: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    programme: [
      { title: '8 modules combinables (contenus 2026)', points: [
        '01 Direction & Stratégie — Roadmap IA, ROI, scénarios, AI Act',
        '02 Marketing & Commercial — 10× contenu, prospection ultra-personnalisée, +25 % leads',
        '03 RH & Recrutement — fiche poste 10 min, screening 100 CV, onboarding 30/60/90',
        '04 Finance & Compta — reporting, analyse Excel/CSV, automatisation factures',
        '05 Juridique & Compliance — analyse contrats, recherche juris, clauses risquées',
        '06 Service Client — chatbots, triage tickets, FAQ auto, escalade',
        '07 Réseaux Sociaux & Brand — 4 semaines en 1 jour, hooks LinkedIn, repurposing 8 formats',
        '08 Créatif & Design — visuels, moodboards, design system, copywriting marque',
      ] },
    ],
    outils: ['Contenus 2026', 'Modules combinables'],
    livrables: ['Supports & prompts sectoriels des modules choisis'],
  },
  {
    code: 'F05', t: 'No-Code & Workflows', level: 'AUTOMATISATION', duree: '2 J', prix: '800 €',
    tagline: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    programme: [
      { title: 'J1', points: ['Make et n8n — 3 automatisations live', 'Exemples : Formulaire→CRM · Email→Slack+tâche · RSS→LinkedIn', 'Objectif : 1 workflow déployé avant 18h'] },
      { title: 'J2', points: ['Intégrer Claude/GPT/Gemini dans Make et n8n', 'Conditions complexes, erreurs, boucles', 'Projet final déployé en prod'] },
    ],
    outils: ['Make', 'n8n', 'Claude Sonnet 4.6', 'GPT-5.2', 'Gemini 3 Flash'],
    livrables: ['10 templates Make & n8n prêts à cloner', 'Guide Connecter 50 outils'],
  },
  {
    code: 'F06', t: 'Agent IA sur-mesure', level: 'AUTOMATISATION', duree: '2 J', prix: '1 250 €',
    tagline: 'Un travailleur autonome qui agit seul, 24h/24. (Prérequis : F05 ou pratique API)',
    programme: [
      { title: 'J1 · Architecture', points: ['LLM + Mémoire + Outils + Planification (démo live)', 'Frameworks : n8n Agents, CrewAI, LangGraph', 'RAG (Pinecone, Chroma), MCP'] },
      { title: 'J2 · Déploiement', points: ['3 patterns business : Agent Support 24/7 · Agent SDR · Agent Admin', 'Claude Skills', 'Validation humaine, monitoring, RGPD', 'Projet final'] },
    ],
    outils: ['Claude Opus 4.6', 'GPT-5.2', 'n8n Agents', 'CrewAI', 'LangGraph', 'Pinecone', 'MCP'],
    livrables: ['Template Agent IA n8n/LangGraph', 'Guide 6 Architectures d’Agents', 'Checklist sécurité'],
  },
  {
    code: 'F07', t: 'Vibe Coding & Claude Code', level: 'AUTOMATISATION', duree: '1 J', prix: '450 €',
    tagline: 'Construire des outils sans coder, avec l’IA comme binôme.',
    programme: [
      { title: 'Matin', points: ['Lovable / Bolt.new / v0 — app web en 1h', 'Méthode du vibe coding structuré', 'Atelier micro-outil métier'] },
      { title: 'Après-midi', points: ['Cursor IDE', 'Claude Code (CLI)', 'Workflows générer / tester / déployer', 'Sécurité, audit, gouvernance'] },
    ],
    outils: ['Cursor', 'Claude Code', 'Lovable', 'Bolt.new', 'v0', 'GitHub Copilot'],
    livrables: ['Pack Prompts Vibe Coding', 'Guide Cursor & Claude Code', '3 mini-apps livrées'],
  },
  {
    code: 'F08', t: 'Gouvernance & AI Act', level: 'TRANSVERSAL', duree: '½ J', prix: '250 €',
    tagline: 'Cadrer ses usages IA en conformité. (Public : Direction, DPO, DSI, RH, Juristes)',
    programme: [
      { points: ['AI Act 2026 : ce qui est interdit / obligatoire', 'RGPD & IA — serveurs US (OpenAI, Anthropic)', 'Construire sa charte IA + traçabilité', '5 cas pratiques live', 'Matrice de risques AI Act'] },
    ],
    outils: ['AI Act 2026', 'CNIL', 'Frameworks RGPD'],
    livrables: ['Template Charte IA', 'Matrice de risques AI Act', 'Plan de mise en conformité 90 jours'],
  },
  {
    code: 'F09', t: 'Veille IA', level: 'TRANSVERSAL', duree: '2 h', prix: '80 € · 320 €/an',
    tagline: 'Rester à jour sur un champ qui bouge tous les mois. (Abonnement annuel 320 €/pers, 4 sessions/an)',
    programme: [
      { points: ['10 avancées IA majeures (démos live)', 'Méthode de veille perso 20 min/semaine', 'Horizon 12-24 mois', 'Modulable selon métier'] },
    ],
    outils: ['Perplexity', 'Claude', 'Veille IA Axem', 'Newsletters'],
    livrables: ['Template Notion Veille IA', 'Liste 30 sources curées', 'Replays'],
  },
  {
    code: 'F10', t: 'Création IA — Visuel · Vidéo · Voix', level: 'PRODUCTION', duree: '1 J', prix: '400 €',
    tagline: 'Produire 10× plus vite, à coût maîtrisé.',
    programme: [
      { title: 'Matin · images', points: ['Midjourney V7, DALL-E 4, Adobe Firefly 3, Nano Banana Pro', 'Logos : Looka, Brandmark, Ideogram 2', 'Infographies : Napkin AI, Gamma, NotebookLM', 'Sites en 1h : Lovable, Bolt.new, Emergent'] },
      { title: 'Après-midi · vidéo & voix', points: ['Synthesia — 140 avatars, 120 langues', 'ElevenLabs — voix clonée en 3 min', 'Vidéo : Kling 2.5, Sora 2, Veo 3.1', 'Repurposing : CapCut AI, Opus Clip → 1 contenu = 8 formats'] },
    ],
    outils: ['Midjourney V7', 'Synthesia', 'ElevenLabs', 'Kling 2.5', 'Sora 2', 'Veo 3.1'],
    livrables: ['Guide 30 Outils Créatifs IA 2026', 'Pack 50 Prompts Midjourney', 'Templates Gamma'],
  },
];

const LEVELS: { id: string; label: string }[] = [
  { id: 'SOCLE', label: 'Socle' },
  { id: 'MÉTIERS', label: 'Métiers' },
  { id: 'AUTOMATISATION', label: 'Automatisation' },
  { id: 'TRANSVERSAL', label: 'Transversal' },
  { id: 'PRODUCTION', label: 'Production' },
];

const FormationCard: React.FC<{ f: Formation }> = ({ f }) => {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
      className={`group flex w-full flex-col border border-cream/12 bg-ink p-6 text-left transition-colors hover:border-green/40 hover:bg-ink-3 md:p-7 ${open ? 'border-green/40 bg-ink-3 lg:col-span-2' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-extrabold text-green">{f.code}</span>
          <span className="rounded-full border border-cream/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-cream-soft">{f.level}</span>
        </div>
        <PlusToggle open={open} className="text-cream-soft group-hover:text-green" />
      </div>
      <h3 className="mt-3 font-display leading-[1.02] text-cream transition-colors group-hover:text-green tight" style={{ fontWeight: 800, fontSize: 'clamp(20px, 2.4vw, 30px)' }}>{f.t}</h3>
      <p className="mt-2 text-sm leading-snug text-cream-soft">{f.tagline}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-full bg-cream/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-cream">{f.duree}</span>
        <span className="rounded-full bg-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-green">{f.prix}</span>
      </div>

      <Collapse open={open}>
        <div className="mt-6 grid gap-6 border-t border-cream/12 pt-6 md:grid-cols-2">
          <div className="space-y-4 md:col-span-2">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.12em] text-green">Programme</p>
            {f.programme.map((p, i) => (
              <div key={i}>
                {p.title && <p className="mb-1.5 text-sm font-bold text-cream">{p.title}</p>}
                <ul className="space-y-1.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-sm leading-relaxed text-cream-soft"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-green" />{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <p className="mb-2 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-green">Outils</p>
            <div className="flex flex-wrap gap-1.5">
              {f.outils.map((o) => <span key={o} className="rounded-md bg-cream/8 px-2.5 py-1 text-[12px] text-cream-soft">{o}</span>)}
            </div>
          </div>
          <div>
            <p className="mb-2 font-display text-xs font-extrabold uppercase tracking-[0.12em] text-green">Livrables</p>
            <ul className="space-y-1.5">
              {f.livrables.map((l) => (
                <li key={l} className="flex gap-2.5 text-sm leading-relaxed text-cream-soft">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>{l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Collapse>
    </button>
  );
};

const Catalogue: React.FC = () => (
  <section id="catalogue" className="border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-[1400px]">
      <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Catalogue 2025-2026</div></Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.4vw, 122px)' }}>
          10 formations.<br /><span className="text-green">3 niveaux.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-7 max-w-2xl text-base text-cream-soft md:text-lg">
          Construites de A à Z selon vos besoins, vos contraintes et vos cas d’usage. <span className="text-cream">70 % de pratique, certifiées Qualiopi.</span> Tarifs HT/participant. Inter ou intra. <span className="text-cream">Cliquez une formation</span> pour le programme complet.
        </p>
      </Reveal>

      {/* Bandeau Qualiopi */}
      <Reveal delay={0.05}>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-green/30 bg-green/[0.06] px-6 py-4">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-cream">
            <svg className="h-4 w-4 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Certifié Qualiopi
          </span>
          <span className="text-sm text-cream-soft">Finançable OPCO — prise en charge jusqu’à 100 %</span>
          <span className="text-sm text-cream-soft">70 % de pratique minimum · opérationnel dès J+1</span>
        </div>
      </Reveal>

      {/* Formations groupées par niveau */}
      <div className="mt-14 space-y-12">
        {LEVELS.map((lvl) => {
          const items = FORMATIONS.filter((f) => f.level === lvl.id);
          if (!items.length) return null;
          return (
            <div key={lvl.id}>
              <Reveal>
                <div className="mb-6 flex items-center gap-3">
                  <span className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-cream">{lvl.label}</span>
                  <span className="text-xs text-cream-dim">{items.length} formation{items.length > 1 ? 's' : ''}</span>
                  <span className="h-px flex-1 bg-cream/12" />
                </div>
              </Reveal>
              <div className="grid items-start gap-3 md:gap-4 lg:grid-cols-3">
                {items.map((f, i) => (
                  <Reveal key={f.code} delay={(i % 3) * 0.05}><FormationCard f={f} /></Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bootcamps + vidéos */}
      <div className="mt-14 grid gap-3 md:gap-4 lg:grid-cols-3">
        <Reveal>
          <div className="flex h-full flex-col border border-cream/12 bg-ink p-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">B01 · Bootcamp immersif</span>
            <h4 className="mt-2 font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>IA &amp; Social Media</h4>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-cream-soft">3 jours · sur devis · le MVP</p>
            <p className="mt-3 text-sm leading-relaxed text-cream-soft">10 % théorie / 90 % pratique sur vos données. 20-30 posts créés, calendrier automatisé (Zapier/Make), playbook + 1 automatisation live.</p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="flex h-full flex-col border border-cream/12 bg-ink p-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">B02 · Bootcamp immersif</span>
            <h4 className="mt-2 font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>Performance &amp; Scale</h4>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-cream-soft">+2 jours d’extension · sur devis</p>
            <p className="mt-3 text-sm leading-relaxed text-cream-soft">Après B01. Optimisation data (A/B testing, funnels), scale vidéos courtes, autonomie 24/7 (agents IA + chatbots), système complet branché.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col border border-cream/12 bg-ink p-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Masterclass 24/7</span>
            <h4 className="mt-2 font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>Formations vidéos</h4>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-cream-soft">40-45 vidéos HD · sur devis</p>
            <p className="mt-3 text-sm leading-relaxed text-cream-soft">Apprendre à son rythme. Format screencast pas-à-pas, cas d’usage métiers, config workflows live, templates & prompts sectoriels téléchargeables, MAJ 2026. Idéal onboarding nouvelle recrue.</p>
          </div>
        </Reveal>
      </div>

      {/* Financement OPCO via portage IZY for pro */}
      <Reveal delay={0.05}>
        <div className="mt-16 rounded-3xl border border-cream/12 bg-ink p-7 md:p-12">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-green">Financement</span>
            <h3 className="font-display leading-[0.95] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 56px)' }}>
              Finançable OPCO via portage <span className="text-green">IZY for pro</span>.
            </h3>
            <p className="mt-2 max-w-2xl text-base text-cream-soft">Prise en charge possible jusqu’à 100 %, un interlocuteur unique côté Axem.</p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-cream/12 bg-cream/12 md:grid-cols-3">
            {[
              { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier les 3 formations les plus rentables pour vos équipes.', meta: '30 MIN' },
              { n: '02', t: 'Devis & dossier OPCO', d: 'Proposition sous 48h. Prise en charge OPCO via portage IZY for pro, démarches simplifiées.', meta: '48 H' },
              { n: '03', t: 'Formation', d: 'Équipes opérationnelles dès J+1. Livrables concrets, suivi post-formation.', meta: 'J+1' },
            ].map((s) => (
              <div key={s.n} className="flex flex-col gap-3 bg-ink p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl text-cream tighter" style={{ fontWeight: 900 }}>{s.n}</span>
                  <span className="bg-green px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                </div>
                <h4 className="font-display text-xl text-cream tight" style={{ fontWeight: 800 }}>{s.t}</h4>
                <p className="text-sm leading-relaxed text-cream-soft">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-cream-soft">Une question sur le financement ? <a href="mailto:contact@axem-ia.fr" className="font-semibold text-green underline-offset-4 hover:underline">contact@axem-ia.fr</a></p>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------- DUO ----------
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Les fondateurs</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.88] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 140px)' }}>
            A<span className="text-green">XE</span>M,<br />c'est nous deux.
          </h2>
        </Reveal>
        <Reveal delay={0.16}><p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
          <span className="font-bold text-cream">A</span>lexis <span className="text-green">×</span> Cl<span className="font-bold text-cream">ém</span>ent. Le stratège et l'ingénieur. Deux experts, un seul interlocuteur : vous parlez à ceux qui livrent.
        </p></Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden border border-cream/12 bg-ink transition-colors hover:border-green/40">
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
            Ensemble, <span className="text-green">+55 000</span> abonnés.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- CAS CLIENTS : data-viz bento cliquable + cas formation + Notion ----------
type CaseStat = { value: number | null; prefix?: string; suffix?: string; txt?: string; caption: string };
type ClientCase = { sector: string; title: string; context: string; stats: CaseStat[]; results: string[]; span?: string };

const CLIENT_CASES: ClientCase[] = [
  {
    sector: 'BTP · Rénovation & Structure', title: 'Chiffrage automatisé par IA', span: 'lg:col-span-2',
    context: 'PME de 40 collaborateurs, 30 débours par jour et par collaborateur.',
    stats: [{ value: 80, suffix: ' %', caption: 'temps de saisie économisé' }, { value: 95, suffix: ' k€', caption: 'charge annuelle neutralisée' }],
    results: ['Note de débours : 80 % de temps de saisie économisé', 'DPGF Excel et CSV générés automatiquement', 'Intégration ERP KALITICS', '95 k€/an neutralisés sur l’avant-vente'],
  },
  {
    sector: 'Administration judiciaire', title: 'Audit automatisé par OCR + IA',
    context: 'Liasses fiscales et documents juridiques — mission de 4 mois.',
    stats: [{ value: 4, prefix: '×', caption: 'plus rapide (3 h gagnées/dossier)' }, { value: 100, suffix: ' %', caption: 'de fiabilité (double vérif. OCR/IA)' }],
    results: ['Vitesse de traitement ×4 (3 h gagnées/dossier)', '100 % de fiabilité par double vérification OCR/IA', '+5 h/semaine/collab réaffectées à l’analyse'],
  },
  {
    sector: 'Adhésifs · Aéronautique & Ferroviaire', title: 'Conformité ADV automatisée',
    context: 'Comparaison BC vs AR, 1 900 paires de documents par mois.',
    stats: [{ value: 317, suffix: ' h', caption: 'libérées par mois' }, { value: 98, prefix: '> ', suffix: ' %', caption: 'd’anomalies détectées' }],
    results: ['Temps par dossier : 15 min → 5 min (317 h/mois libérées)', 'Détection des anomalies > 98 %', 'Hébergement Europe RGPD, intégration ERP Proginov'],
  },
  {
    sector: 'Éditeur logiciel · Médico-social', title: 'Industrialisation IA dans les équipes Dev', span: 'lg:col-span-2',
    context: 'Éditeur ~550 salariés, Claude déployé sans méthode.',
    stats: [{ value: 20, caption: 'ambassadeurs formés' }, { value: 80, caption: 'développeurs concernés' }],
    results: ['20 ambassadeurs formés sur 80 développeurs', 'Framework d’usage co-construit avec le CISO', 'Agents PO, revue de code et support feature en prod'],
  },
];

const FORMATION_CASES = [
  { name: 'ESPACE 2', sector: 'Promotion immobilière', d: 'Formation IA équipes Direction & RH — 2 journées d’upskilling, charte d’usage IA, roadmap 90 jours déployée.' },
  { name: 'AVANTIS', sector: 'Conseil & expertise', d: 'Kit Journée IA par métier — document interactif HTML, 6 prompts sectoriels validés, adoption +60 %.' },
  { name: 'GRAVOTECH', sector: 'Industrie / Manufacturing', d: 'Acculturation IA équipes opérationnelles — formation 1 journée sur outils 2025, 3 quick wins déployés en 30 jours.' },
  { name: 'CARREFOUR', sector: 'Grande distribution', d: 'Animation de formations IA — formation Gemini, 1 journée au niveau groupe.' },
];

const ClientCaseCard: React.FC<{ c: ClientCase }> = ({ c }) => {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
      className="group flex h-full w-full flex-col border border-cream/12 bg-ink-2 p-7 text-left transition-colors hover:border-green/40 hover:bg-ink-3 md:p-8">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">{c.sector}</span>
        <PlusToggle open={open} className="text-cream-soft group-hover:text-green" />
      </div>
      <h3 className="mt-3 font-display leading-[1.02] text-cream tight" style={{ fontWeight: 800, fontSize: 'clamp(22px, 2.6vw, 34px)' }}>{c.title}</h3>
      <div className="mt-6 flex flex-wrap gap-x-10 gap-y-5">
        {c.stats.map((s) => (
          <div key={s.caption}>
            <div className="font-display leading-[0.85] text-cream transition-transform duration-300 group-hover:-translate-y-0.5 tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 5vw, 76px)' }}>
              {s.value !== null ? <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} /> : s.txt}
            </div>
            <div className="mt-1.5 text-xs font-semibold text-cream-soft">{s.caption}</div>
          </div>
        ))}
      </div>
      <Collapse open={open}>
        <div className="mt-6 border-t border-cream/12 pt-6">
          <p className="text-sm italic text-cream-soft">{c.context}</p>
          <ul className="mt-4 space-y-2">
            {c.results.map((r) => (
              <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-cream-soft">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>{r}
              </li>
            ))}
          </ul>
        </div>
      </Collapse>
    </button>
  );
};

const Proof: React.FC = () => (
  <section id="cas-clients" className="px-5 py-28 md:px-8 md:py-36">
    <div className="mx-auto max-w-[1400px]">
      <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Cas clients</div></Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
          Des résultats.<br /><span className="outline-green">Pas des slides.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}><p className="mt-7 max-w-2xl text-base text-cream-soft md:text-lg">5 missions, 5 secteurs, des résultats mesurés. <span className="text-cream">Cliquez une carte</span> pour le détail.</p></Reveal>

      <div className="mt-14 grid items-start gap-3 md:gap-4 lg:grid-cols-3">
        {CLIENT_CASES.map((c) => (
          <Reveal key={c.title} className={c.span}><ClientCaseCard c={c} /></Reveal>
        ))}
      </div>

      {/* Cas clients formation */}
      <Reveal delay={0.05}>
        <div className="mt-20 mb-6 flex items-center gap-3">
          <span className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-cream">Cas clients formation</span>
          <span className="h-px flex-1 bg-cream/12" />
        </div>
      </Reveal>
      <div className="grid gap-3 md:gap-4 lg:grid-cols-4">
        {FORMATION_CASES.map((f, i) => (
          <Reveal key={f.name} delay={(i % 4) * 0.05}>
            <div className="group flex h-full flex-col border border-cream/12 bg-ink-2 p-6 transition-colors hover:border-green/40 hover:bg-ink-3">
              <h4 className="font-display text-xl text-cream tight transition-colors group-hover:text-green" style={{ fontWeight: 800 }}>{f.name}</h4>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-green">{f.sector}</p>
              <p className="mt-3 text-sm leading-relaxed text-cream-soft opacity-80 transition-opacity group-hover:opacity-100">{f.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        {/* TODO: URL Notion à fournir — voir constante NOTION_URL */}
        <a href={NOTION_URL} target="_blank" rel="noopener noreferrer"
          className="group mt-12 inline-flex items-center gap-3 border border-green/40 bg-green/[0.06] px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-green transition-colors hover:bg-green hover:text-ink">
          Voir tous les cas clients en détail
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
        <p className="mt-3 text-sm text-cream-dim">Méthodologies, livrables, retours d’expérience et résultats détaillés.</p>
      </Reveal>
    </div>
  </section>
);

// ---------- METHOD ----------
const Method: React.FC = () => {
  const steps = [{ n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' }, { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' }, { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' }];
  return (
    <section id="methode" className="border-t border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
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

// ---------- FINAL CTA : accroche + widget Calendly inline ----------
const FinalCTA: React.FC = () => {
  useEffect(() => {
    const SRC = 'https://assets.calendly.com/assets/external/widget.js';
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = SRC; s.async = true;
    document.body.appendChild(s);
  }, []);
  return (
    <section id="rdv" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Rendez-vous</div></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.4vw, 124px)' }}>
            Démarrons par un<br /><span className="text-green">diagnostic gratuit.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <a href="mailto:contact@axem-ia.fr" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green underline-offset-4 hover:underline">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            contact@axem-ia.fr
          </a>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-cream/12 bg-white">
            <div className="calendly-inline-widget" data-url={CALENDLY_INLINE} style={{ minWidth: 320, height: 700 }} />
          </div>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="mt-5 text-center text-sm text-cream-dim">
            Le créneau ne s’affiche pas ?{' '}
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="font-semibold text-green underline-offset-4 hover:underline">Ouvrir le calendrier dans un nouvel onglet →</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="border-t border-cream/10 bg-ink px-5 py-16 md:px-8">
    <div className="mx-auto max-w-[1400px]">
      <div className="font-display leading-[0.85] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(64px, 16vw, 260px)' }}>
        AXEM<span className="text-green">.</span>
      </div>
      <div className="mt-12 grid gap-10 border-t border-cream/12 pt-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-xs text-sm text-cream-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Navigation</div>
          <ul className="space-y-2 text-sm text-cream-soft">{[['Prestations', '#prestations'], ['Catalogue', '#catalogue'], ['Cas clients', '#cas-clients'], ['Le duo', '#duo'], ['Méthode', '#methode'], ['Références', '#references']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
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

const Home: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-ink">
      <Nav />
      <main><Hero /><Trust /><Services /><Catalogue /><Proof /><Duo /><Method /><FinalCTA /></main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
