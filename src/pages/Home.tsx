import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, MotionConfig, useMotionValue, useSpring,
  useInView, useReducedMotion,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — INDEX ÉDITORIAL
// Magazine / index : grandes listes typo, filtres par niveau,
// le détail se révèle dans un panneau latéral au hover/clic.
// Hero (Grainient + palette) intact · dark #0F0F0F + mint + Archivo.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_INLINE = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const NOTION_URL = '#'; // TODO URL Notion — page « tous les cas clients en détail »
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

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number; className?: string }> = ({ value, prefix = '', suffix = '', decimals = 0, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const start = performance.now(); let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - start) / 1600); setN((1 - Math.pow(1 - k, 3)) * value); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const rounded = decimals > 0 ? Number(n.toFixed(decimals)) : Math.round(n);
  const fmt = rounded >= 1000 ? rounded.toLocaleString('fr-FR') : rounded.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

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
        <div className="hidden items-center gap-8 lg:flex">
          {[['Prestations', '#prestations'], ['Catalogue', '#catalogue'], ['Cas clients', '#cas-clients'], ['Le duo', '#duo'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href="#rdv" strength={0.3}
          className="group inline-flex items-center gap-1.5 bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] text-ink" style={{ fontWeight: 800 }}>
          Rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------- FUSION : Alexis × Clément → AXEM ----------
const Fusion: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => { const a = setTimeout(() => setPhase(1), 1100); const b = setTimeout(() => setPhase(2), 2000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="flex h-7 items-center justify-center" aria-label="Alexis et Clément égalent AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.4em] text-cream-soft">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 90 : 0, scale: phase === 1 ? 1.5 : 1 }} transition={{ duration: 0.5 }} className="text-green">×</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-0.5">
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="font-display text-base tracking-tight text-cream" style={{ fontWeight: 900 }}>{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1 font-display text-base text-green" style={{ fontWeight: 900 }}>IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- HERO : premium centré · fond Grainient vif (INTACT) ----------
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
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(64% 48% at 50% 42%, rgba(7,7,13,0.5) 0%, rgba(7,7,13,0.22) 44%, transparent 70%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[24%]"
        style={{ background: 'linear-gradient(180deg, transparent, #0F0F0F)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24"
        style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.42), transparent)' }} />

      {/* SÉLECTEUR DE PALETTE (démo — retiré une fois la couleur choisie) */}
      <div className="fixed right-3 top-24 z-50 hidden flex-col gap-1 rounded-2xl border border-white/15 bg-black/45 p-2 backdrop-blur-md sm:flex md:right-5">
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
            <Magnetic href="#rdv" strength={0.35}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.65)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Prendre rendez-vous</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#catalogue" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/15">
              Voir le catalogue <span aria-hidden>↓</span>
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
// TRUST — « Ils nous font confiance » · PLUS GROS · EN COULEUR · 2 GROUPES
// Logos couleur sur cartes blanches · grille éditoriale soignée.
// =====================================================================
type Logo = { src?: string; alt: string; fallback?: string };
const LogoCard: React.FC<{ logo: Logo }> = ({ logo }) => (
  <div className="group flex h-20 items-center justify-center rounded-xl border border-cream/10 bg-white px-4 py-4 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-green/40 hover:shadow-[0_14px_40px_-16px_rgba(0,250,154,0.35)] md:h-24 md:px-6">
    {logo.src ? (
      <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async"
        className="max-h-10 w-auto max-w-full object-contain md:max-h-12" />
    ) : (
      <span className="text-center font-display text-base leading-tight text-ink md:text-lg" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
        {logo.fallback || logo.alt}
      </span>
    )}
  </div>
);

const Trust: React.FC = () => {
  const clients: Logo[] = [
    { src: '/logos/carrefour.svg', alt: 'Carrefour' },
    { src: '/logos/blackfin.png', alt: 'BlackFin Capital Partners' },
    { src: '/logos/avantis.png', alt: 'Avantis' },
    { src: '/logos/kit.png', alt: 'KIT France' },
    { src: '/logos/espace2.png', alt: 'Espace 2' },
    { src: '/logos/socos.png', alt: 'Socos' },
  ];
  const orgs: Logo[] = [
    { src: '/logos/myconnecting.png', alt: 'myconnecting' },
    { alt: 'synapse ia', fallback: 'synapse ia' }, // logo manquant → fallback nom stylé
    { src: '/logos/asphere.png', alt: 'ASphere' },
    { alt: 'AI sisters', fallback: 'AI sisters' }, // logo manquant → fallback nom stylé
    { src: '/logos/senza.png', alt: 'SENZA Formations' },
    { src: '/logos/cegos.png', alt: 'Cegos' },
  ];
  const Group: React.FC<{ kicker: string; title: string; logos: Logo[]; delay?: number }> = ({ kicker, title, logos, delay = 0 }) => (
    <div>
      <Reveal delay={delay}>
        <div className="mb-6 flex items-baseline gap-3">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-green">
            <span className="h-1.5 w-1.5 bg-green" />{kicker}
          </span>
          <span className="font-display text-base text-cream/80 md:text-lg" style={{ fontWeight: 700 }}>{title}</span>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {logos.map((l, i) => (
          <Reveal key={l.alt} delay={delay + i * 0.04}><LogoCard logo={l} /></Reveal>
        ))}
      </div>
    </div>
  );
  return (
    <section id="references" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Références</div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.5vw, 116px)' }}>
            Ils nous font<br /><span className="text-green">confiance.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-base text-cream-soft md:text-lg">Des PME aux grands comptes &amp; administrations — et les organismes de formation qui nous délèguent leurs missions IA.</p>
        </Reveal>

        <div className="mt-14 space-y-14">
          <Group kicker="Clients" title="Entreprises & administrations" logos={clients} delay={0.04} />
          <Group kicker="Partenaires" title="Organismes de formation" logos={orgs} delay={0.08} />
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// SERVICES — 7 prestations · liste éditoriale enrichie (détail PDF)
// Audit = « 1 semaine ». Click/hover → ouvre/ferme le détail (accordéon).
// =====================================================================
type Service = { n: string; t: string; tagline: string; price: string; duration?: string; bullets: string[] };
const Services: React.FC = () => {
  const items: Service[] = [
    {
      n: '01', t: 'Audit IA', tagline: 'On regarde avant de déployer.', price: 'Sur devis', duration: '1 semaine',
      bullets: [
        'Analyse — cartographie des process + points de friction.',
        'Opportunités — cas d’usage scorés par impact et faisabilité.',
        'Roadmap — plan d’adoption séquencé sur 3 à 12 mois.',
        'Livrable — document de synthèse + recommandations concrètes.',
      ],
    },
    {
      n: '02', t: 'Conseil stratégique', tagline: 'Quoi faire, dans quel ordre, avec quels budgets.', price: 'Sur devis',
      bullets: [
        'Accompagnement décisionnel — cadrage, arbitrages, priorisation par ROI.',
        'Choix des outils — architecture, sélection fournisseurs, stack adaptée.',
        'Pilotage du déploiement — coordination, jalons, conduite du changement.',
        'Missions sur mesure, ponctuelles ou continues.',
      ],
    },
    {
      n: '03', t: 'Déploiement & automatisation', tagline: 'Des workflows qui tournent seuls, 7j/7.', price: 'À partir de 1 200 €',
      bullets: [
        'Option A — Délivrable clé en main (1 200 € – 2 000 €) : construit, testé, déployé + passation.',
        'Option B — Abonnement suivi (900 € + 80 €/mois) : maintenance, évolutions, nouvelles automatisations.',
        'Outils : n8n · Make · Claude Code.',
        'Un référent Axem dédié. « Libérez vos équipes des tâches répétitives. »',
      ],
    },
    {
      n: '04', t: 'Formation', tagline: 'Vos équipes opérationnelles dès J+1.', price: '200 € – 1 250 € / pers.',
      bullets: [
        '10 formations, 3 niveaux, ciblées sur vos cas d’usage réels.',
        '70 % de pratique. Certifié Qualiopi.',
        'Inter ou intra — modulables en parcours et bootcamps.',
        'Finançable OPCO (via portage IZY for pro, jusqu’à 100 %).',
      ],
    },
    {
      n: '05', t: 'Coaching individuel', tagline: 'Pour vos profils clés.', price: '200 € / session',
      bullets: [
        'Managers, dirigeants, référents IA internes.',
        '1 session d’1 h par semaine — on ancre les compétences dans la durée.',
        'Réalisé par Clément ou Alexis.',
      ],
    },
    {
      n: '06', t: 'Production IA', tagline: 'Des assets produits 10× plus vite, à coût maîtrisé.', price: 'Sur devis',
      bullets: [
        'Vidéos (avatar IA) · vidéos réseaux sociaux.',
        'Images & visuels · voix clonée.',
        'Sites web no-code · slides & présentations.',
      ],
    },
    {
      n: '07', t: 'Suivi', tagline: 'Une fois déployé, on reste.', price: '80 € / mois',
      bullets: [
        'Maintenance — automatisations à jour, MAJ d’API.',
        'Évolutions & améliorations continues.',
        'Nouvelles opportunités à mesure que les équipes mûrissent.',
        'Durée moyenne d’un partenariat : 12 mois +.',
      ],
    },
  ];
  const [open, setOpen] = useState<string | null>('01');
  const reduce = useReducedMotion();
  return (
    <section id="prestations" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Ce qu'on fait</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
            Sept prestations.<br /><span className="outline-type">Un partenaire.</span>
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-cream/12">
          {items.map((s, i) => {
            const isOpen = open === s.n;
            return (
              <Reveal key={s.n} delay={(i % 3) * 0.05}>
                <div className="border-b border-cream/12">
                  <button type="button" onClick={() => setOpen(isOpen ? null : s.n)} aria-expanded={isOpen}
                    className="group block w-full py-7 text-left transition-colors hover:bg-ink-2 md:py-9">
                    <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 px-1 md:grid-cols-[110px_1fr_auto] md:gap-x-8">
                      <span className="font-display text-xl text-green transition-transform duration-300 group-hover:translate-x-1 md:text-3xl" style={{ fontWeight: 900 }}>{s.n}</span>
                      <h3 className="font-display leading-[0.95] text-cream transition-colors group-hover:text-green tight" style={{ fontWeight: 800, fontSize: 'clamp(24px, 4.2vw, 56px)' }}>{s.t}</h3>
                      <span className={`shrink-0 self-center text-cream-soft transition-transform duration-300 ${isOpen ? 'rotate-45 text-green' : ''}`} aria-hidden style={{ fontSize: '1.5rem', lineHeight: 1 }}>+</span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-1 px-1 md:ml-[142px] md:grid-cols-[1fr_auto] md:items-baseline md:gap-6">
                      <p className="max-w-2xl text-sm leading-relaxed text-cream-soft md:text-base">{s.tagline}</p>
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-green md:whitespace-nowrap">
                        {s.duration ? <>{s.duration} · </> : null}{s.price}
                      </span>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div key="d" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                        <ul className="grid gap-2.5 px-1 pb-8 md:ml-[142px] md:grid-cols-2 md:gap-x-10">
                          {s.bullets.map((b, bi) => (
                            <li key={bi} className="flex gap-3 text-sm leading-relaxed text-cream-soft md:text-[15px]">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-green" aria-hidden />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
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
// CATALOGUE — INDEX ÉDITORIAL des 10 formations · filtres par niveau
// Hover/clic d'une ligne → panneau latéral détail (programme/outils/livrables)
// + Qualiopi · bootcamps B01/B02 · formations vidéos · financement OPCO.
// =====================================================================
type Niveau = 'Socle' | 'Métiers' | 'Automatisation' | 'Transversal' | 'Production';
type Formation = {
  code: string; t: string; niveau: Niveau; duree: string; prix: string;
  tagline: string; programme: string[]; outils: string[]; livrables: string[];
};
const FORMATIONS: Formation[] = [
  {
    code: 'F01', t: 'IA Essentielle', niveau: 'Socle', duree: '1 J', prix: '300 €',
    tagline: 'De zéro à opérationnel en 1 journée.',
    programme: [
      'Matin · Comprendre l’IA : fonctionnement d’un LLM (sans jargon), RGPD (ce qu’on peut envoyer), identifier ses cas d’usage métier.',
      'Après-midi · Pratiquer : structure RACF (Rôle/Action/Contexte/Format), 15 exercices sur cas réels, plan d’action J+1.',
    ],
    outils: ['Claude Sonnet 4.6', 'GPT-5.2', 'Gemini 3 Flash', 'Perplexity'],
    livrables: ['Guide 50 Prompts par Métier', 'Charte d’usage IA', 'Fiche 3 Quick Wins J+1'],
  },
  {
    code: 'F02', t: 'Prompt Engineering Pro', niveau: 'Socle', duree: '½ J', prix: '200 €',
    tagline: 'Multiplier par 5 la qualité de ses outputs IA.',
    programme: [
      'Techniques avancées : Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting.',
      '20 exercices chronométrés sur cas réels · bibliothèque de prompts d’équipe (template Notion en live).',
      'Atelier final : 5 prompts signature.',
    ],
    outils: ['Claude Opus 4.6', 'GPT-5.2', 'Gemini 3.1 Pro'],
    livrables: ['Template Bibliothèque Prompts Notion', 'Fiche mémo Techniques Avancées'],
  },
  {
    code: 'F03', t: 'Maîtriser Claude', niveau: 'Socle', duree: '1 J', prix: '450 €',
    tagline: 'Devenir expert de l’IA qui pèse 70 % du Fortune 100.',
    programme: [
      'Matin · Bases solides : Claude vs ChatGPT vs Gemini, modèles Sonnet 4.6 & Opus 4.6, Projects, Artifacts, Computer Use.',
      'Après-midi · Expert : Claude Skills, MCP (Model Context Protocol), Cowork & Sub-agents, atelier 3 Skills.',
    ],
    outils: ['Claude Opus 4.6', 'Sonnet 4.6', 'Skills', 'MCP', 'Cowork'],
    livrables: ['Pack 10 Skills Axem', 'Guide Claude Power User', 'Charte d’usage Claude'],
  },
  {
    code: 'F04', t: 'IA pour tous les métiers', niveau: 'Métiers', duree: '1 J', prix: '400 €',
    tagline: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    programme: [
      '01 Direction & Stratégie · 02 Marketing & Commercial · 03 RH & Recrutement · 04 Finance & Compta.',
      '05 Juridique & Compliance · 06 Service Client · 07 Réseaux Sociaux & Brand · 08 Créatif & Design.',
      'Modules combinables, contenus 2026.',
    ],
    outils: ['Claude', 'GPT-5.2', 'Gemini', 'outils métiers dédiés'],
    livrables: ['Kit prompts sectoriels', 'Plan d’action par module choisi'],
  },
  {
    code: 'F05', t: 'No-Code & Workflows', niveau: 'Automatisation', duree: '2 J', prix: '800 €',
    tagline: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    programme: [
      'J1 · Make & n8n : 3 automatisations live (Formulaire→CRM, Email→Slack+tâche, RSS→LinkedIn). 1 workflow déployé avant 18 h.',
      'J2 · Intégrer Claude/GPT/Gemini dans Make & n8n, conditions/erreurs/boucles, projet final déployé en prod.',
    ],
    outils: ['Make', 'n8n', 'Claude Sonnet 4.6', 'GPT-5.2', 'Gemini 3 Flash'],
    livrables: ['10 templates Make & n8n prêts à cloner', 'Guide Connecter 50 outils'],
  },
  {
    code: 'F06', t: 'Agent IA sur-mesure', niveau: 'Automatisation', duree: '2 J', prix: '1 250 €',
    tagline: 'Un travailleur autonome qui agit seul, 24 h/24. (Prérequis : F05 ou pratique API)',
    programme: [
      'J1 · Architecture : LLM + Mémoire + Outils + Planification (démo live), frameworks (n8n Agents, CrewAI, LangGraph), RAG (Pinecone, Chroma), MCP.',
      'J2 · Déploiement : 3 patterns business (Support 24/7, SDR, Admin), Claude Skills, validation humaine / monitoring / RGPD, projet final.',
    ],
    outils: ['Claude Opus 4.6', 'GPT-5.2', 'n8n Agents', 'CrewAI', 'LangGraph', 'Pinecone', 'MCP'],
    livrables: ['Template Agent IA n8n/LangGraph', 'Guide 6 Architectures d’Agents', 'Checklist sécurité'],
  },
  {
    code: 'F07', t: 'Vibe Coding & Claude Code', niveau: 'Automatisation', duree: '1 J', prix: '450 €',
    tagline: 'Construire des outils sans coder, avec l’IA comme binôme.',
    programme: [
      'Matin · Lovable / Bolt.new / v0 : app web en 1 h, méthode du vibe coding structuré, atelier micro-outil métier.',
      'Après-midi · Cursor IDE, Claude Code (CLI), workflows générer/tester/déployer, sécurité/audit/gouvernance.',
    ],
    outils: ['Cursor', 'Claude Code', 'Lovable', 'Bolt.new', 'v0', 'GitHub Copilot'],
    livrables: ['Pack Prompts Vibe Coding', 'Guide Cursor & Claude Code', '3 mini-apps livrées'],
  },
  {
    code: 'F08', t: 'Gouvernance & AI Act', niveau: 'Transversal', duree: '½ J', prix: '250 €',
    tagline: 'Cadrer ses usages IA en conformité. (Direction, DPO, DSI, RH, Juristes)',
    programme: [
      'AI Act 2026 (interdit / obligatoire), RGPD & IA (serveurs US OpenAI/Anthropic).',
      'Construire sa charte IA + traçabilité, 5 cas pratiques live, matrice de risques AI Act.',
    ],
    outils: ['AI Act 2026', 'CNIL', 'Frameworks RGPD'],
    livrables: ['Template Charte IA', 'Matrice de risques AI Act', 'Plan de mise en conformité 90 jours'],
  },
  {
    code: 'F09', t: 'Veille IA', niveau: 'Transversal', duree: '2 h', prix: '80 € · 320 €/an',
    tagline: 'Rester à jour sur un champ qui bouge tous les mois.',
    programme: [
      '10 avancées IA majeures (démos live), méthode de veille perso 20 min/semaine.',
      'Horizon 12-24 mois, modulable selon métier. Abonnement annuel : 320 €/pers, 4 sessions/an.',
    ],
    outils: ['Perplexity', 'Claude', 'Veille IA Axem', 'Newsletters'],
    livrables: ['Template Notion Veille IA', 'Liste 30 sources curées', 'Replays'],
  },
  {
    code: 'F10', t: 'Création IA — Visuel · Vidéo · Voix', niveau: 'Production', duree: '1 J', prix: '400 €',
    tagline: 'Produire 10× plus vite, à coût maîtrisé.',
    programme: [
      'Matin · Images : Midjourney V7, DALL-E 4, Adobe Firefly 3, Nano Banana Pro · logos · infographies · sites en 1 h.',
      'Après-midi · Vidéo & voix : Synthesia (140 avatars), ElevenLabs (voix clonée 3 min), Kling 2.5 / Sora 2 / Veo 3.1, repurposing (1 contenu = 8 formats).',
    ],
    outils: ['Midjourney V7', 'Synthesia', 'ElevenLabs', 'Kling 2.5', 'Sora 2', 'CapCut AI', 'Opus Clip'],
    livrables: ['Guide 30 Outils Créatifs IA 2026', 'Pack 50 Prompts Midjourney', 'Templates Gamma'],
  },
];
const NIVEAUX: (Niveau | 'Tous')[] = ['Tous', 'Socle', 'Métiers', 'Automatisation', 'Transversal', 'Production'];

const DetailPanel: React.FC<{ f: Formation }> = ({ f }) => (
  <div className="flex h-full flex-col gap-6 p-7 md:p-9">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-display text-sm text-green" style={{ fontWeight: 900 }}>{f.code}</span>
        <span className="bg-green/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-green">{f.niveau}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft">{f.duree} · {f.prix}</span>
      </div>
      <h3 className="mt-4 font-display leading-[0.95] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(28px, 3.4vw, 48px)' }}>{f.t}</h3>
      <p className="mt-3 text-base text-green/90">{f.tagline}</p>
    </div>
    <div>
      <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Programme</div>
      <ul className="space-y-2.5">
        {f.programme.map((p, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-cream-soft md:text-[15px]">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-green" aria-hidden /><span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Outils</div>
        <div className="flex flex-wrap gap-2">
          {f.outils.map((o) => (<span key={o} className="border border-cream/15 px-2.5 py-1 text-xs text-cream-soft">{o}</span>))}
        </div>
      </div>
      <div>
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Livrables</div>
        <ul className="space-y-1.5">
          {f.livrables.map((l) => (
            <li key={l} className="flex gap-2 text-xs text-cream-soft md:text-[13px]">
              <span className="text-green" aria-hidden>✓</span><span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <a href="#rdv" className="mt-auto inline-flex w-fit items-center gap-2 bg-green px-5 py-2.5 text-[12px] uppercase tracking-[0.06em] text-ink transition hover:gap-3" style={{ fontWeight: 900 }}>
      Demander cette formation <span aria-hidden>→</span>
    </a>
  </div>
);

const Catalogue: React.FC = () => {
  const [filter, setFilter] = useState<Niveau | 'Tous'>('Tous');
  const [activeCode, setActiveCode] = useState<string>(FORMATIONS[0].code);
  const reduce = useReducedMotion();
  const list = filter === 'Tous' ? FORMATIONS : FORMATIONS.filter((f) => f.niveau === filter);
  const active = FORMATIONS.find((f) => f.code === activeCode) || list[0];

  // garantir une ligne active visible quand on filtre
  useEffect(() => { if (!list.some((f) => f.code === activeCode) && list[0]) setActiveCode(list[0].code); }, [filter]); // eslint-disable-line

  return (
    <section id="catalogue" className="border-y border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Catalogue 2025/2026 · 10 formations · 3 niveaux · 70 % pratique · Qualiopi</div></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.6vw, 124px)' }}>
            L'index des<br /><span className="text-green">formations.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-base text-cream-soft md:text-lg">Construites de A à Z selon vos besoins, vos contraintes et vos cas d'usage. Tarifs HT/participant — inter ou intra. <span className="text-cream">Survolez ou cliquez une ligne</span> pour le détail.</p>
        </Reveal>

        {/* FILTRES PAR NIVEAU */}
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par niveau">
            {NIVEAUX.map((nv) => (
              <button key={nv} type="button" role="tab" aria-selected={filter === nv} onClick={() => setFilter(nv)}
                className={`border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] transition ${filter === nv ? 'border-green bg-green text-ink' : 'border-cream/15 text-cream-soft hover:border-cream/40 hover:text-cream'}`}>
                {nv}
              </button>
            ))}
          </div>
        </Reveal>

        {/* INDEX + PANNEAU */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_minmax(380px,520px)]">
          {/* INDEX TYPO */}
          <div className="border-t border-cream/12">
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((f, i) => {
                const isActive = active?.code === f.code;
                return (
                  <motion.div key={f.code} layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, delay: (i % 6) * 0.03, ease }}>
                    <button type="button"
                      onMouseEnter={() => !reduce && setActiveCode(f.code)} onFocus={() => setActiveCode(f.code)} onClick={() => setActiveCode(f.code)}
                      aria-expanded={isActive}
                      className={`group block w-full border-b border-cream/12 py-5 text-left transition-colors md:py-6 ${isActive ? 'bg-ink-3' : 'hover:bg-ink-3/60'}`}>
                      <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 px-1 md:gap-x-6">
                        <span className={`font-display text-base transition-colors md:text-xl ${isActive ? 'text-green' : 'text-cream-dim group-hover:text-green'}`} style={{ fontWeight: 900 }}>{f.code}</span>
                        <h3 className={`font-display leading-[0.98] tight transition-colors ${isActive ? 'text-green' : 'text-cream group-hover:text-cream'}`} style={{ fontWeight: 800, fontSize: 'clamp(20px, 3vw, 40px)' }}>{f.t}</h3>
                        <span className="self-center whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft md:text-xs">{f.duree} · {f.prix}</span>
                      </div>
                      <div className="mt-1.5 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-cream-dim">{f.niveau}</span>
                      </div>
                      {/* Mobile : détail en accordéon sous la ligne (fallback tap) */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div key="m" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden lg:hidden">
                            <div className="mt-4 border border-cream/12 bg-ink"><DetailPanel f={f} /></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* PANNEAU LATÉRAL (desktop, sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 min-h-[460px] overflow-hidden border border-cream/12 bg-ink">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div key={active.code}
                    initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
                    transition={{ duration: 0.35, ease }}>
                    <DetailPanel f={active} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* BOOTCAMPS + FORMATIONS VIDÉOS */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { tag: 'Bootcamp · B01', t: 'IA & Social Media', meta: '3 jours · sur devis', d: 'Le MVP. 10 % théorie / 90 % pratique sur vos données : 20-30 posts créés, calendrier automatisé (Zapier/Make), playbook + 1 automatisation live.' },
            { tag: 'Bootcamp · B02', t: 'Performance & Scale', meta: '+2 jours · sur devis', d: 'Extension après B01. Optimisation data (A/B testing, funnels), scale vidéos courtes, autonomie 24/7 (agents IA + chatbots), système complet branché.' },
            { tag: 'Masterclass 24/7', t: 'Formations vidéos', meta: 'sur devis', d: '40-45 vidéos HD, screencast pas-à-pas, cas d’usage métiers, workflows configurés en live, MAJ 2026. Templates & bibliothèques de prompts. Idéal onboarding.' },
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 0.08}>
              <div className="group flex h-full flex-col gap-3 border border-cream/12 bg-ink p-7 transition-colors hover:border-green/40">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">{b.tag}</span>
                <h3 className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>{b.t}</h3>
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft">{b.meta}</span>
                <p className="text-sm leading-relaxed text-cream-soft">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FINANCEMENT OPCO · IZY for pro */}
        <Reveal delay={0.05}>
          <div className="mt-20 border border-cream/12 bg-ink p-8 md:p-12">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-green"><span className="h-1.5 w-1.5 bg-green" />Financement</div>
                <h3 className="font-display leading-[0.95] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 56px)' }}>
                  Finançable OPCO<br />jusqu'à <span className="text-green">100 %.</span>
                </h3>
              </div>
              <p className="max-w-md text-sm text-cream-soft md:text-base">Via portage <span className="text-cream">IZY for pro</span>. Démarches simplifiées, un interlocuteur unique côté Axem.</p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden border border-cream/12 bg-cream/12 md:grid-cols-3">
              {[
                { n: '01', t: 'Diagnostic gratuit', meta: '30 MIN', d: 'On identifie les 3 formations les plus rentables pour vos équipes.' },
                { n: '02', t: 'Devis & dossier OPCO', meta: '48 H', d: 'Proposition sous 48 h, prise en charge OPCO via portage IZY for pro.' },
                { n: '03', t: 'Formation', meta: 'J+1', d: 'Équipes opérationnelles dès J+1, livrables concrets, suivi post-formation.' },
              ].map((s) => (
                <div key={s.n} className="flex flex-col gap-3 bg-ink p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl text-cream tighter md:text-5xl" style={{ fontWeight: 900 }}>{s.n}</span>
                    <span className="bg-green px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                  </div>
                  <h4 className="font-display text-xl text-cream tight" style={{ fontWeight: 800 }}>{s.t}</h4>
                  <p className="text-sm leading-relaxed text-cream-soft">{s.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-cream-soft"><a href="mailto:contact@axem-ia.fr" className="text-green underline-offset-4 hover:underline">contact@axem-ia.fr</a> — on s'occupe du dossier.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

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
          <span className="font-bold text-cream">A</span>lexis <span className="text-green">×</span> Cl<span className="font-bold text-cream">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.
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
            Ensemble, <span className="text-green">AXEM</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// CAS CLIENTS — INDEX ÉDITORIAL · 4 cas chiffrés (count-up) + cas formation
// Chaque ligne cliquable / hover → panneau détail. + lien Notion.
// =====================================================================
type Stat = { value: number; prefix?: string; suffix?: string; decimals?: number; label: string };
type Cas = {
  id: string; sector: string; t: string; context: string;
  stats: Stat[]; results: string[];
};
const CAS: Cas[] = [
  {
    id: 'c1', sector: 'Éditeur logiciel · Médico-social', t: 'Industrialisation IA dans les équipes Dev',
    context: 'Éditeur ~550 salariés, Claude déployé sans méthode.',
    stats: [{ value: 20, label: 'ambassadeurs formés / 80 dev' }],
    results: [
      '20 ambassadeurs formés sur 80 développeurs.',
      'Framework d’usage co-construit avec le CISO.',
      'Agents PO, revue de code et support feature en production.',
    ],
  },
  {
    id: 'c2', sector: 'BTP · Rénovation & structure', t: 'Chiffrage automatisé par IA',
    context: 'PME 40 collaborateurs, 30 débours/jour/collaborateur.',
    stats: [{ value: 80, suffix: ' %', label: 'de temps de saisie économisé' }, { value: 95, suffix: ' k€', label: 'neutralisés /an sur l’avant-vente' }],
    results: [
      '80 % de temps de saisie économisé (note de débours).',
      'DPGF Excel et CSV générés automatiquement, intégration ERP KALITICS.',
      'Charge annuelle de 95 k€ neutralisée sur l’avant-vente.',
    ],
  },
  {
    id: 'c3', sector: 'Administration judiciaire', t: 'Audit automatisé par OCR + IA',
    context: 'Liasses fiscales et documents juridiques. Mission de 4 mois.',
    stats: [{ value: 4, prefix: '×', label: 'plus rapide (3 h gagnées/dossier)' }, { value: 100, suffix: ' %', label: 'de fiabilité (double vérif. OCR/IA)' }],
    results: [
      'Vitesse de traitement ×4 (3 h gagnées par dossier).',
      '100 % de fiabilité par double vérification OCR/IA.',
      '+5 h/semaine/collaborateur réaffectées à l’analyse.',
    ],
  },
  {
    id: 'c4', sector: 'Adhésifs · Aéronautique & ferroviaire', t: 'Conformité ADV automatisée',
    context: 'Comparaison BC vs AR, 1 900 paires/mois.',
    stats: [{ value: 317, suffix: ' h', label: 'libérées par mois' }, { value: 98, prefix: '> ', suffix: ' %', label: 'd’anomalies détectées' }],
    results: [
      'Temps par dossier : 15 min → 5 min (317 h/mois libérées).',
      'Détection des anomalies > 98 %.',
      'Hébergement Europe RGPD, intégration ERP Proginov.',
    ],
  },
];
const CAS_FORMATION: Cas[] = [
  {
    id: 'f-espace2', sector: 'Espace 2 · Promotion immobilière', t: 'Formation IA équipes Direction & RH',
    context: 'Upskilling des fonctions Direction & RH.', stats: [],
    results: ['2 journées d’upskilling.', 'Charte d’usage IA.', 'Roadmap 90 jours déployée.'],
  },
  {
    id: 'f-avantis', sector: 'Avantis · Conseil & expertise', t: 'Kit Journée IA par métier',
    context: 'Kit interactif par métier.', stats: [{ value: 60, prefix: '+', suffix: ' %', label: 'd’adoption' }],
    results: ['Document interactif HTML.', '6 prompts sectoriels validés.', 'Adoption +60 %.'],
  },
  {
    id: 'f-gravotech', sector: 'Gravotech · Industrie / Manufacturing', t: 'Acculturation IA équipes opérationnelles',
    context: 'Acculturation des équipes terrain.', stats: [],
    results: ['Formation 1 journée sur les outils 2025.', '3 quick wins déployés en 30 jours.'],
  },
  {
    id: 'f-carrefour', sector: 'Carrefour', t: 'Animation formations IA · Gemini',
    context: 'Formation Gemini au niveau groupe.', stats: [],
    results: ['1 journée sur Gemini, au niveau groupe.'],
  },
];

const CasPanel: React.FC<{ c: Cas }> = ({ c }) => (
  <div className="flex h-full flex-col gap-6 p-7 md:p-9">
    <div>
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">{c.sector}</span>
      <h3 className="mt-3 font-display leading-[0.97] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.2vw, 44px)' }}>{c.t}</h3>
      <p className="mt-3 text-sm text-cream-soft md:text-base">{c.context}</p>
    </div>
    {c.stats.length > 0 && (
      <div className="grid grid-cols-2 gap-4 border-y border-cream/12 py-6">
        {c.stats.map((s, i) => (
          <div key={i}>
            <div className="font-display text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(36px, 4vw, 64px)' }}>
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-cream-soft">{s.label}</div>
          </div>
        ))}
      </div>
    )}
    <div>
      <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Résultats</div>
      <ul className="space-y-2.5">
        {c.results.map((r, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-cream-soft md:text-[15px]">
            <span className="text-green" aria-hidden>✓</span><span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const CasIndex: React.FC<{ items: Cas[]; activeId: string; setActiveId: (id: string) => void }> = ({ items, activeId, setActiveId }) => {
  const reduce = useReducedMotion();
  return (
    <div className="border-t border-cream/12">
      {items.map((c, i) => {
        const isActive = activeId === c.id;
        return (
          <div key={c.id}>
            <button type="button"
              onMouseEnter={() => !reduce && setActiveId(c.id)} onFocus={() => setActiveId(c.id)} onClick={() => setActiveId(c.id)}
              aria-expanded={isActive}
              className={`group block w-full border-b border-cream/12 py-5 text-left transition-colors md:py-6 ${isActive ? 'bg-ink-2' : 'hover:bg-ink-2/60'}`}>
              <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 px-1 md:gap-x-6">
                <span className={`font-display text-base transition-colors md:text-xl ${isActive ? 'text-green' : 'text-cream-dim group-hover:text-green'}`} style={{ fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`font-display leading-[1.0] tight transition-colors ${isActive ? 'text-green' : 'text-cream'}`} style={{ fontWeight: 800, fontSize: 'clamp(18px, 2.6vw, 34px)' }}>{c.t}</h3>
              </div>
              <div className="mt-1.5 px-1"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-cream-dim">{c.sector}</span></div>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div key="m" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden lg:hidden">
                    <div className="mt-4 border border-cream/12 bg-ink-2"><CasPanel c={c} /></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        );
      })}
    </div>
  );
};

const CasClients: React.FC = () => {
  const [tab, setTab] = useState<'missions' | 'formation'>('missions');
  const items = tab === 'missions' ? CAS : CAS_FORMATION;
  const [activeId, setActiveId] = useState<string>(CAS[0].id);
  const reduce = useReducedMotion();
  const active = items.find((c) => c.id === activeId) || items[0];
  useEffect(() => { if (!items.some((c) => c.id === activeId) && items[0]) setActiveId(items[0].id); }, [tab]); // eslint-disable-line

  return (
    <section id="cas-clients" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Cas clients</div></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.6vw, 124px)' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-base text-cream-soft md:text-lg">5 missions, 5 secteurs, des résultats mesurés. <span className="text-cream">Survolez ou cliquez un cas</span> pour le détail.</p>
        </Reveal>

        {/* TABS */}
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Type de cas">
            {([['missions', 'Missions chiffrées'], ['formation', 'Cas formation']] as const).map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
                className={`border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] transition ${tab === key ? 'border-green bg-green text-ink' : 'border-cream/15 text-cream-soft hover:border-cream/40 hover:text-cream'}`}>
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_minmax(380px,520px)]">
          <CasIndex items={items} activeId={activeId} setActiveId={setActiveId} />
          <div className="hidden lg:block">
            <div className="sticky top-24 min-h-[420px] overflow-hidden border border-cream/12 bg-ink-2">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div key={active.id} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }} transition={{ duration: 0.35, ease }}>
                    <CasPanel c={active} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Reveal delay={0.05}>
          <a href={NOTION_URL} target="_blank" rel="noopener noreferrer"
            className="group mt-12 inline-flex items-center gap-3 border border-cream/20 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-cream transition hover:border-green hover:text-green">
            Voir tous les cas clients en détail
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </a>
          <p className="mt-3 text-xs text-cream-dim">Méthodologies, livrables, retours d'expérience et résultats détaillés.</p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- METHOD : « En 3 étapes. Pas une de plus. » ----------
const Method: React.FC = () => {
  const steps = [
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
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

// =====================================================================
// FINAL CTA — widget Calendly inline (script async via useEffect)
// =====================================================================
const FinalCTA: React.FC = () => {
  useEffect(() => {
    const id = 'calendly-widget-js';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);
  return (
    <section id="rdv" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Rendez-vous</div></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.4vw, 120px)' }}>
            Démarrons par un<br /><span className="text-green">diagnostic gratuit.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg text-cream-soft md:text-xl">
            30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
            {' '}<a href="mailto:contact@axem-ia.fr" className="text-green underline-offset-4 hover:underline">contact@axem-ia.fr</a>
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-12 overflow-hidden border border-cream/12 bg-ink-2">
            <div
              className="calendly-inline-widget"
              data-url={CALENDLY_INLINE}
              style={{ minWidth: 320, height: 700 }}
            />
          </div>
          {/* Fallback si le widget ne charge pas */}
          <noscript>
            <a href={CALENDLY} className="mt-4 inline-block text-green underline">Réserver un créneau sur Calendly</a>
          </noscript>
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
          <ul className="space-y-2 text-sm text-cream-soft">{[['Prestations', '#prestations'], ['Catalogue', '#catalogue'], ['Cas clients', '#cas-clients'], ['Le duo', '#duo'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
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

const Home: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-ink">
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Services />
        <Catalogue />
        <CasClients />
        <Duo />
        <Method />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
