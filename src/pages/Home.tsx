import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useInView, useReducedMotion, MotionConfig,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — AGENCEMENT « C — SOMMAIRE MAÎTRISÉ »
// Tout est visible d'un coup d'œil mais COMPACT et RANGÉ.
// Index · compteurs · filtres. Le détail s'ouvre au clic/hover (panneau).
// dark #0F0F0F + mint #00FA9A + Archivo. transform/opacity only.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_INLINE = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const NOTION_URL = '#'; // TODO URL Notion (cas clients détaillés)
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

// ---------- helpers ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease }} className={className}>{children}</motion.div>
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
    const tick = (t: number) => { const k = Math.min(1, (t - start) / 1500); setN((1 - Math.pow(1 - k, 3)) * value); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const rounded = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
  const fmt = !decimals && Math.round(n) >= 1000 ? Math.round(n).toLocaleString('fr-FR') : rounded.replace('.', ',');
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green">
    <span className="h-1.5 w-1.5 bg-green" />{children}
  </div>
);

// ---------- NAV ----------
const NAV_LINKS: [string, string][] = [
  ['Prestations', '#prestations'],
  ['Catalogue', '#catalogue'],
  ['Cas clients', '#cas'],
  ['Le duo', '#duo'],
];
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
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream">
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

// ---------- HERO — Grainient (INCHANGÉ) ----------
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
            <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.35}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.65)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Prendre rendez-vous</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#besoin" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/15">
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

// ---------- TRUST — 2 groupes, logos couleur, cartes blanches ----------
type Logo = { name: string; src?: string };
const CLIENTS: Logo[] = [
  { name: 'Carrefour', src: '/logos/carrefour.svg' },
  { name: 'BlackFin Capital Partners', src: '/logos/blackfin.png' },
  { name: 'Avantis', src: '/logos/avantis.png' },
  { name: 'KIT France', src: '/logos/kit.png' },
  { name: 'Espace 2', src: '/logos/espace2.png' },
  { name: 'Socos', src: '/logos/socos.png' },
];
const ORGANISMES: Logo[] = [
  { name: 'myconnecting', src: '/logos/myconnecting.png' },
  { name: 'synapse ia' }, // manquant → fallback nom stylé
  { name: 'ASphere', src: '/logos/asphere.png' },
  { name: 'AI sisters' }, // manquant → fallback nom stylé
  { name: 'SENZA Formations', src: '/logos/senza.png' },
  { name: 'Cegos', src: '/logos/cegos.png' },
];

const LogoCard: React.FC<{ logo: Logo }> = ({ logo }) => {
  const [failed, setFailed] = useState(false);
  const showImg = logo.src && !failed;
  return (
    <div className="flex h-20 items-center justify-center rounded-xl border border-cream/10 bg-white px-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(0,250,154,0.4)] md:h-24">
      {showImg ? (
        <img src={logo.src} alt={logo.name} loading="lazy" decoding="async"
          onError={() => setFailed(true)}
          className="max-h-12 w-auto max-w-full object-contain md:max-h-14" />
      ) : (
        <span className="text-center font-display text-lg leading-tight text-ink md:text-xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          {logo.name}
        </span>
      )}
    </div>
  );
};

const Trust: React.FC = () => (
  <section id="references" className="border-y border-cream/10 bg-ink-2 px-5 py-20 md:px-8 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green">Ils nous font confiance</p>
          <p className="mt-3 font-display text-2xl text-cream md:text-4xl" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Des PME aux grands comptes &amp; administrations.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        {([['Clients', CLIENTS], ['Organismes de formation partenaires', ORGANISMES]] as const).map(([title, logos], gi) => (
          <Reveal key={title} delay={gi * 0.08}>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream-soft">{title}</span>
                <span className="h-px flex-1 bg-cream/12" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {logos.map((l) => <LogoCard key={l.name} logo={l} />)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ---------- PROBLÈME — 3 pièges, format compact ----------
const Problem: React.FC = () => {
  const traps = [
    { n: '01', t: 'Formations théoriques', d: 'Équipes formées, jamais opérationnelles.' },
    { n: '02', t: 'Outils sans stratégie', d: 'Licences achetées, aucune feuille de route.' },
    { n: '03', t: 'Aucun suivi après coup', d: 'Le consultant part, les habitudes reviennent.' },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><SectionLabel>Le problème</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <h2 className="max-w-3xl font-display leading-[0.95] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(30px, 4.6vw, 56px)' }}>
            Pourquoi la plupart des projets IA <span className="outline-green">échouent</span>.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-cream/12 bg-cream/12 md:grid-cols-3">
          {traps.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.06}>
              <div className="group flex h-full flex-col gap-2 bg-ink p-7 transition-colors hover:bg-ink-2 md:p-8">
                <span className="font-display text-3xl text-cream/30 transition-colors group-hover:text-green tighter" style={{ fontWeight: 900 }}>{t.n}</span>
                <h3 className="mt-1 font-display text-xl text-cream md:text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{t.t}</h3>
                <p className="text-sm leading-relaxed text-cream-soft">{t.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-8 font-display text-lg text-cream-soft md:text-xl">
            Nous, c'est <span className="text-cream" style={{ fontWeight: 700 }}>un parcours complet</span>, pas une intervention isolée.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- ENTRÉE PAR BESOIN — 4 chemins cliquables ----------
const Needs: React.FC = () => {
  const needs = [
    { verb: 'auditer', label: 'Auditer mes process', d: 'Diagnostic, cartographie, roadmap priorisée.', href: '#prestations', meta: '1 semaine' },
    { verb: 'déployer', label: 'Déployer & automatiser', d: 'Des workflows qui tournent seuls, 7j/7.', href: '#prestations', meta: 'dès 1 200 €' },
    { verb: 'former mes équipes', label: 'Former mes équipes', d: '10 formations, 3 niveaux, 70 % de pratique.', href: '#catalogue', meta: 'Qualiopi · OPCO' },
    { verb: 'rester à jour', label: 'Rester à jour', d: "Veille, coaching, suivi sur la durée.", href: '#catalogue', meta: '12 mois +' },
  ];
  return (
    <section id="besoin" className="border-t border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><SectionLabel>Par où commencer</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.95] text-cream tight" style={{ fontWeight: 900, fontSize: 'clamp(30px, 4.8vw, 60px)' }}>
            Vous voulez <span className="text-green">auditer</span>, <span className="text-green">déployer</span>,<br className="hidden md:block" /> <span className="text-green">former vos équipes</span> ou <span className="text-green">rester à jour</span> ?
          </h2>
        </Reveal>
        <Reveal delay={0.1}><p className="mt-5 max-w-2xl text-base text-cream-soft md:text-lg">Choisissez votre point d'entrée — on vous emmène au bon endroit.</p></Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {needs.map((n, i) => (
            <Reveal key={n.label} delay={i * 0.05}>
              <a href={n.href} className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-cream/12 bg-ink p-6 transition-all hover:-translate-y-1 hover:border-green/45 hover:bg-ink-3">
                <span className="inline-flex w-fit items-center rounded-full bg-green/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-green">{n.meta}</span>
                <div>
                  <h3 className="font-display text-2xl text-cream transition-colors group-hover:text-green" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{n.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-soft">{n.d}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-cream-soft transition-colors group-hover:text-cream">
                  Y aller <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- MÉTHODE — En 3 étapes. Pas une de plus. ----------
const Method: React.FC = () => {
  const steps = [
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  return (
    <section id="methode" className="px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><SectionLabel>Notre méthode</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(36px, 6.4vw, 96px)' }}>
            En 3 étapes.<br /><span className="text-green">Pas une de plus.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-cream/12 bg-cream/12 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="group flex h-full flex-col gap-4 bg-ink p-7 transition-colors hover:bg-ink-2 md:p-9">
                <div className="flex items-center justify-between">
                  <span className="font-display text-6xl text-cream transition-colors group-hover:text-green tighter md:text-7xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  <span className="bg-green px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                </div>
                <h3 className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>{s.t}</h3>
                <p className="text-base leading-relaxed text-cream-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- PRESTATIONS — index 7 lignes, clic/hover → panneau détail ----------
type Presta = { n: string; t: string; price: string; tag: string; d: string; bullets: string[] };
const PRESTATIONS: Presta[] = [
  { n: '01', t: 'Audit IA', price: 'Sur devis', tag: '1 semaine', d: 'Diagnostic, cartographie des process, scoring de maturité IA, roadmap priorisée.',
    bullets: ['Analyse — cartographie process + points de friction', 'Opportunités — cas d\'usage scorés par impact et faisabilité', 'Roadmap — plan d\'adoption séquencé 3 à 12 mois', 'Livrable — document de synthèse + recommandations concrètes'] },
  { n: '02', t: 'Conseil stratégique', price: 'Sur devis', tag: 'durée & périmètre', d: 'Roadmap priorisée, choix des outils, architecture, pilotage.',
    bullets: ['Accompagnement décisionnel — cadrage, arbitrages, priorisation par ROI', 'Choix des outils — architecture, sélection fournisseurs, stack adaptée', 'Pilotage du déploiement — jalons, conduite du changement', 'Missions sur mesure — ponctuelles ou continues'] },
  { n: '03', t: 'Déploiement & automatisation', price: '1 200 € – 2 000 €', tag: 'clé en main ou abonnement', d: 'Construction et déploiement des automatisations. n8n, Make, Claude Code.',
    bullets: ['Option A — Délivrable clé en main : construit, testé, déployé + passation', 'Option B — Abonnement suivi : 900 € + 80 €/mois, évolutions incluses', 'Outils n8n · Make · Claude Code', 'Libérez vos équipes des tâches répétitives'] },
  { n: '04', t: 'Formation', price: '200 € – 1 250 € / pers.', tag: 'Qualiopi · OPCO', d: "Upskilling des équipes sur les cas d'usage identifiés. Le catalogue Axem s'active ici.",
    bullets: ['70 % de pratique minimum', 'Certifié Qualiopi, finançable OPCO', '10 formations · 3 niveaux', 'Ciblé sur vos besoins réels'] },
  { n: '05', t: 'Coaching individuel', price: '200 € / session', tag: '1 session/semaine', d: 'Pour profils clés : managers, dirigeants, référents IA internes.',
    bullets: ['Sessions d\'1h, 1 par semaine', 'Ancre les compétences dans la durée', 'Réalisé par Clément ou Alexis', 'Pour managers, dirigeants, référents IA'] },
  { n: '06', t: 'Production IA', price: 'Sur devis', tag: 'au livrable', d: 'Vidéos avatar IA, images & visuels, voix clonée, vidéos réseaux, sites no-code, slides.',
    bullets: ['Vidéos avatar IA · vidéos réseaux sociaux', 'Images & visuels · voix clonée', 'Sites web no-code · slides & présentations', 'Des assets produits 10× plus vite'] },
  { n: '07', t: 'Suivi', price: '80 € / mois', tag: '12 mois +', d: 'Maintenance, évolutions, nouvelles automatisations. La relation devient long terme.',
    bullets: ['Maintenance — automatisations à jour, MAJ d\'API', 'Évolutions & améliorations continues', 'Nouvelles opportunités à mesure que les équipes mûrissent', 'Production IA continue'] },
];

const Prestations: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="prestations" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><SectionLabel>Ce qu'on fait</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(36px, 6.2vw, 92px)' }}>
              Sept prestations.<br /><span className="outline-type">Un partenaire.</span>
            </h2>
            <p className="text-sm text-cream-soft md:text-base">Cliquez une ligne pour le détail.</p>
          </div>
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-2xl border border-cream/12">
          {PRESTATIONS.map((s) => {
            const isOpen = open === s.n;
            return (
              <div key={s.n} className="border-b border-cream/12 last:border-b-0">
                <button type="button" onClick={() => setOpen(isOpen ? null : s.n)} aria-expanded={isOpen}
                  className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 px-5 py-5 text-left transition-colors md:px-7 ${isOpen ? 'bg-ink-3' : 'hover:bg-ink-3'}`}>
                  <span className="font-display text-base text-green md:text-xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg text-cream md:text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{s.t}</span>
                    <span className="mt-0.5 hidden text-[11px] font-bold uppercase tracking-[0.1em] text-cream-dim sm:block">{s.tag}</span>
                  </span>
                  <span className="flex items-center gap-3 md:gap-5">
                    <span className="hidden whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft md:inline">{s.price}</span>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream transition-transform ${isOpen ? 'rotate-45 border-green text-green' : 'group-hover:border-green/60'}`}>+</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }} className="overflow-hidden">
                      <div className="grid gap-6 px-5 pb-7 pt-1 md:grid-cols-[1fr_1.1fr] md:px-7">
                        <p className="text-sm leading-relaxed text-cream-soft md:text-base">{s.d}
                          <span className="mt-3 block text-[12px] font-bold uppercase tracking-[0.1em] text-green md:hidden">{s.price} · {s.tag}</span>
                        </p>
                        <ul className="grid gap-2">
                          {s.bullets.map((b, bi) => (
                            <li key={bi} className="flex gap-2.5 text-sm text-cream-soft">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{b}
                            </li>
                          ))}
                        </ul>
                      </div>
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

// ---------- CATALOGUE — index F01→F10 filtrable + panneau détail ----------
type Formation = { code: string; name: string; level: string; duree: string; prix: string; tagline: string; programme: string[]; outils: string; livrables: string };
const NIVEAUX = ['Tous', 'Socle', 'Métiers', 'Automatisation', 'Transversal', 'Production'] as const;
const LEVEL_MAP: Record<string, typeof NIVEAUX[number]> = {
  SOCLE: 'Socle', MÉTIERS: 'Métiers', AUTOMATISATION: 'Automatisation', TRANSVERSAL: 'Transversal', PRODUCTION: 'Production',
};
const FORMATIONS: Formation[] = [
  { code: 'F01', name: 'IA Essentielle', level: 'SOCLE', duree: '1 J', prix: '300 €', tagline: 'De zéro à opérationnel en 1 journée.',
    programme: ['Matin — Comprendre l\'IA : LLM sans jargon, RGPD, identifier ses cas d\'usage', 'Après-midi — Pratiquer : Prompt Engineering RACF, 15 exercices, plan d\'action J+1'],
    outils: 'Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash · Perplexity', livrables: 'Guide 50 Prompts par Métier · Charte d\'usage IA · Fiche 3 Quick Wins J+1' },
  { code: 'F02', name: 'Prompt Engineering Pro', level: 'SOCLE', duree: '½ J', prix: '200 €', tagline: 'Multiplier par 5 la qualité de ses outputs IA.',
    programme: ['Techniques avancées : Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting', '20 exercices chronométrés · bibliothèque de prompts d\'équipe · 5 prompts signature'],
    outils: 'Claude Opus 4.6 · GPT-5.2 · Gemini 3.1 Pro', livrables: 'Template Bibliothèque Prompts Notion · Fiche mémo Techniques Avancées' },
  { code: 'F03', name: 'Maîtriser Claude', level: 'SOCLE', duree: '1 J', prix: '450 €', tagline: "Devenir expert de l'IA qui pèse 70 % du Fortune 100.",
    programme: ['Matin — Claude vs ChatGPT vs Gemini, modèles Sonnet/Opus 4.6, Projects, Artifacts, Computer Use', 'Après-midi — Claude Skills, MCP, Cowork & Sub-agents, atelier 3 Skills'],
    outils: 'Claude Opus 4.6 · Sonnet 4.6 · Skills · MCP · Cowork', livrables: 'Pack 10 Skills Axem · Guide Claude Power User · Charte d\'usage Claude' },
  { code: 'F04', name: 'IA pour tous les métiers', level: 'MÉTIERS', duree: '1 J', prix: '400 €', tagline: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    programme: ['Direction & Stratégie · Marketing & Commercial · RH & Recrutement · Finance & Compta', 'Juridique & Compliance · Service Client · Réseaux Sociaux & Brand · Créatif & Design'],
    outils: 'Modules combinables · contenus 2026', livrables: 'Supports & prompts sectoriels selon les modules choisis' },
  { code: 'F05', name: 'No-Code & Workflows', level: 'AUTOMATISATION', duree: '2 J', prix: '800 €', tagline: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    programme: ['J1 — Make & n8n : 3 automatisations live (Formulaire→CRM, Email→Slack, RSS→LinkedIn)', 'J2 — Intégrer Claude/GPT/Gemini, conditions/erreurs/boucles, projet final en prod'],
    outils: 'Make · n8n · Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash', livrables: '10 templates Make & n8n prêts à cloner · Guide Connecter 50 outils' },
  { code: 'F06', name: 'Agent IA sur-mesure', level: 'AUTOMATISATION', duree: '2 J', prix: '1 250 €', tagline: 'Un travailleur autonome qui agit seul, 24h/24. (Prérequis F05)',
    programme: ['J1 Architecture — LLM+Mémoire+Outils+Planification, frameworks, RAG, MCP', 'J2 Déploiement — Agent Support 24/7, SDR, Admin · validation humaine, monitoring, RGPD'],
    outils: 'Claude Opus 4.6 · n8n Agents · CrewAI · LangGraph · Pinecone · MCP', livrables: 'Template Agent IA · Guide 6 Architectures · Checklist sécurité' },
  { code: 'F07', name: 'Vibe Coding & Claude Code', level: 'AUTOMATISATION', duree: '1 J', prix: '450 €', tagline: "Construire des outils sans coder, avec l'IA comme binôme.",
    programme: ['Matin — Lovable/Bolt.new/v0 : app web en 1h, vibe coding structuré, micro-outil métier', 'Après-midi — Cursor IDE, Claude Code (CLI), workflows générer/tester/déployer, sécurité'],
    outils: 'Cursor · Claude Code · Lovable · Bolt.new · v0 · GitHub Copilot', livrables: 'Pack Prompts Vibe Coding · Guide Cursor & Claude Code · 3 mini-apps livrées' },
  { code: 'F08', name: 'Gouvernance & AI Act', level: 'TRANSVERSAL', duree: '½ J', prix: '250 €', tagline: 'Cadrer ses usages IA en conformité. (Direction, DPO, DSI, RH, Juristes)',
    programme: ['AI Act 2026 (interdit/obligatoire) · RGPD & IA (serveurs US OpenAI/Anthropic)', 'Construire sa charte IA + traçabilité · 5 cas pratiques · matrice de risques AI Act'],
    outils: 'AI Act 2026 · CNIL · Frameworks RGPD', livrables: 'Template Charte IA · Matrice de risques · Plan de mise en conformité 90 jours' },
  { code: 'F09', name: 'Veille IA', level: 'TRANSVERSAL', duree: '2 h', prix: '80 € · 320 €/an', tagline: 'Rester à jour sur un champ qui bouge tous les mois.',
    programme: ['10 avancées IA majeures (démos live) · méthode de veille perso 20 min/semaine', 'Horizon 12-24 mois · modulable selon métier · abonnement annuel 4 sessions/an'],
    outils: 'Perplexity · Claude · Veille IA Axem · Newsletters', livrables: 'Template Notion Veille IA · Liste 30 sources curées · Replays' },
  { code: 'F10', name: 'Création IA — Visuel · Vidéo · Voix', level: 'PRODUCTION', duree: '1 J', prix: '400 €', tagline: 'Produire 10× plus vite, à coût maîtrisé.',
    programme: ['Matin (images) — Midjourney V7, DALL-E 4, Firefly 3, Nano Banana Pro · logos · infographies · sites 1h', 'Après-midi (vidéo & voix) — Synthesia, ElevenLabs, Kling/Sora/Veo · repurposing 1 contenu = 8 formats'],
    outils: 'Midjourney · Synthesia · ElevenLabs · Kling 2.5 · Sora 2 · Veo 3.1', livrables: 'Guide 30 Outils Créatifs 2026 · Pack 50 Prompts Midjourney · Templates Gamma' },
];

const LEVEL_DOT: Record<string, string> = {
  SOCLE: '#00FA9A', MÉTIERS: '#8AB4FF', AUTOMATISATION: '#FF6B9D', TRANSVERSAL: '#FFD27A', PRODUCTION: '#C9A8FF',
};

const Catalogue: React.FC = () => {
  const [filter, setFilter] = useState<typeof NIVEAUX[number]>('Tous');
  const [open, setOpen] = useState<string | null>(null);
  const visible = FORMATIONS.filter((f) => filter === 'Tous' || LEVEL_MAP[f.level] === filter);

  return (
    <section id="catalogue" className="px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><SectionLabel>Catalogue formations 2025-2026</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 6vw, 88px)' }}>
              10 formations.<br /><span className="text-green">3 niveaux.</span>
            </h2>
            <p className="max-w-sm text-sm text-cream-soft md:text-base">70 % de pratique · certifié Qualiopi · construites de A à Z selon vos besoins. Tarifs HT/participant.</p>
          </div>
        </Reveal>

        {/* Filtres par niveau */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2">
            {NIVEAUX.map((lvl) => {
              const active = filter === lvl;
              const count = lvl === 'Tous' ? FORMATIONS.length : FORMATIONS.filter((f) => LEVEL_MAP[f.level] === lvl).length;
              return (
                <button key={lvl} type="button" onClick={() => { setFilter(lvl); setOpen(null); }}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors ${active ? 'border-green bg-green text-ink' : 'border-cream/15 text-cream-soft hover:border-cream/40 hover:text-cream'}`}>
                  {lvl}<span className={`text-[10px] ${active ? 'text-ink/70' : 'text-cream-dim'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Tableau compact : code · nom · durée · prix */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-cream/12">
          <div className="hidden grid-cols-[64px_1fr_120px_140px_44px] items-center gap-x-4 border-b border-cream/12 bg-ink-2 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-cream-dim md:grid md:px-7">
            <span>Code</span><span>Formation</span><span>Durée</span><span>Prix</span><span />
          </div>
          {visible.map((f) => {
            const isOpen = open === f.code;
            return (
              <div key={f.code} className="border-b border-cream/12 last:border-b-0">
                <button type="button" onClick={() => setOpen(isOpen ? null : f.code)} aria-expanded={isOpen}
                  className={`grid w-full grid-cols-[52px_1fr_auto] items-center gap-x-3 px-5 py-4 text-left transition-colors md:grid-cols-[64px_1fr_120px_140px_44px] md:gap-x-4 md:px-7 ${isOpen ? 'bg-ink-3' : 'hover:bg-ink-2'}`}>
                  <span className="font-display text-sm text-green md:text-base" style={{ fontWeight: 900 }}>{f.code}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: LEVEL_DOT[f.level] }} />
                      <span className="truncate font-display text-base text-cream md:text-lg" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>{f.name}</span>
                    </span>
                    <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-cream-dim md:hidden">{LEVEL_MAP[f.level]} · {f.duree} · {f.prix}</span>
                  </span>
                  <span className="hidden text-[12px] font-bold uppercase tracking-[0.06em] text-cream-soft md:block">{f.duree}</span>
                  <span className="hidden whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.06em] text-cream md:block">{f.prix}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center justify-self-end rounded-full border border-cream/20 text-cream transition-transform ${isOpen ? 'rotate-45 border-green text-green' : ''}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="d" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }} className="overflow-hidden bg-ink-2">
                      <div className="grid gap-6 px-5 py-6 md:grid-cols-3 md:px-7 md:py-7">
                        <div className="md:col-span-3">
                          <p className="font-display text-lg text-green" style={{ fontWeight: 700 }}>« {f.tagline} »</p>
                        </div>
                        <div>
                          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-cream-dim">Programme</div>
                          <ul className="grid gap-2">
                            {f.programme.map((p, pi) => (
                              <li key={pi} className="flex gap-2 text-sm text-cream-soft"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{p}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-cream-dim">Outils</div>
                          <p className="text-sm leading-relaxed text-cream-soft">{f.outils}</p>
                        </div>
                        <div>
                          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-cream-dim">Livrables</div>
                          <p className="text-sm leading-relaxed text-cream-soft">{f.livrables}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bootcamps + vidéos en 1 ligne */}
        <Reveal delay={0.08}>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-cream/12 bg-ink-2 px-5 py-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-green">Bootcamps</span>
              <span className="text-sm text-cream-soft">B01 IA & Social Media (3 j) · B02 Performance & Scale — intensifs, sur devis.</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-cream/12 bg-ink-2 px-5 py-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-green">Vidéos 24/7</span>
              <span className="text-sm text-cream-soft">Masterclass 40-45 vidéos HD, à son rythme, templates inclus — sur devis.</span>
            </div>
          </div>
        </Reveal>

        {/* OPCO IZY for pro — 3 étapes compact */}
        <Reveal delay={0.1}>
          <div className="mt-10 rounded-2xl border border-green/25 bg-green/[0.06] p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl text-cream md:text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Financez vos formations à <span className="text-green">100 %</span> via OPCO
              </h3>
              <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-green">
                Qualiopi · portage IZY for pro
              </span>
            </div>
            <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-cream/12 bg-cream/12 md:grid-cols-3">
              {[
                { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier les 3 formations les plus rentables.' },
                { n: '02', t: 'Devis & dossier OPCO', d: 'Proposition sous 48h, prise en charge via portage IZY for pro.' },
                { n: '03', t: 'Formation', d: 'Équipes opérationnelles dès J+1, livrables concrets, suivi inclus.' },
              ].map((s) => (
                <div key={s.n} className="flex flex-col gap-1.5 bg-ink p-5">
                  <span className="font-display text-2xl text-green" style={{ fontWeight: 900 }}>{s.n}</span>
                  <span className="font-display text-base text-cream" style={{ fontWeight: 700 }}>{s.t}</span>
                  <span className="text-sm leading-relaxed text-cream-soft">{s.d}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- CAS CLIENTS — compteurs + index cliquable + Notion ----------
type CaseFormation = { client: string; secteur: string; mission: string; detail: string };
const CASES_FORMATION: CaseFormation[] = [
  { client: 'ESPACE 2', secteur: 'Promotion immobilière', mission: 'Formation IA équipes Direction & RH', detail: '2 journées d\'upskilling · charte d\'usage IA · roadmap 90 jours déployée.' },
  { client: 'AVANTIS', secteur: 'Conseil & expertise', mission: 'Kit Journée IA par métier', detail: 'Document interactif HTML · 6 prompts sectoriels validés · adoption +60 %.' },
  { client: 'GRAVOTECH', secteur: 'Industrie / Manufacturing', mission: 'Acculturation IA équipes opérationnelles', detail: 'Formation 1 journée sur outils 2025 · 3 quick wins déployés en 30 jours.' },
  { client: 'CARREFOUR', secteur: 'Grande distribution', mission: 'Animation formations IA — Gemini', detail: '1 journée sur Gemini au niveau groupe.' },
];

const Cases: React.FC = () => {
  const stats = [
    { v: 80, suffix: ' %', l: 'temps de saisie économisé', sub: 'BTP · 95 k€/an neutralisés' },
    { v: 4, prefix: '×', l: 'plus rapide', sub: 'Admin · fiabilité 100 %' },
    { v: 100, suffix: ' %', l: 'de fiabilité OCR/IA', sub: 'double vérification' },
    { v: 317, suffix: ' h', l: 'libérées / mois', sub: 'Conformité ADV' },
    { v: 98, prefix: '> ', suffix: ' %', l: 'anomalies détectées', sub: 'aéronautique & ferroviaire' },
    { v: 95, suffix: ' k€', l: 'charge annuelle neutralisée', sub: 'avant-vente BTP' },
  ];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="cas" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><SectionLabel>Cas clients</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 6vw, 92px)' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}><p className="mt-5 text-base text-cream-soft md:text-lg">5 missions, 5 secteurs, des résultats mesurés.</p></Reveal>

        {/* Compteurs */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-cream/12 py-12 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={(i % 3) * 0.06}>
              <div className="group cursor-default">
                <div className="font-display leading-[0.85] text-cream transition-colors group-hover:text-green tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 4vw, 64px)' }}>
                  <Counter value={s.v} prefix={(s as any).prefix || ''} suffix={(s as any).suffix || ''} />
                </div>
                <div className="mt-2 text-[12px] font-bold uppercase tracking-[0.08em] text-cream">{s.l}</div>
                <div className="text-[11px] text-cream-dim">{s.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Index formation cliquable */}
        <Reveal delay={0.08}>
          <div className="mt-12 mb-3 flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream-soft">Cas clients formation</span>
            <span className="h-px flex-1 bg-cream/12" />
          </div>
        </Reveal>
        <div className="overflow-hidden rounded-2xl border border-cream/12">
          {CASES_FORMATION.map((c) => {
            const isOpen = open === c.client;
            return (
              <div key={c.client} className="border-b border-cream/12 last:border-b-0">
                <button type="button" onClick={() => setOpen(isOpen ? null : c.client)} aria-expanded={isOpen}
                  className={`grid w-full grid-cols-[1fr_auto] items-center gap-x-4 px-5 py-4 text-left transition-colors md:grid-cols-[200px_1fr_44px] md:px-7 ${isOpen ? 'bg-ink-3' : 'hover:bg-ink-3'}`}>
                  <span className="min-w-0">
                    <span className="block font-display text-lg text-cream md:text-xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{c.client}</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-green">{c.secteur}</span>
                  </span>
                  <span className="hidden truncate text-sm text-cream-soft md:block">{c.mission}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center justify-self-end rounded-full border border-cream/20 text-cream transition-transform ${isOpen ? 'rotate-45 border-green text-green' : ''}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="d" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease }} className="overflow-hidden">
                      <div className="px-5 pb-6 pt-1 md:px-7">
                        <p className="text-sm leading-relaxed text-cream-soft md:max-w-2xl md:text-base">
                          <span className="font-bold text-cream md:hidden">{c.mission} — </span>{c.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <a href={NOTION_URL} data-todo="URL Notion" target="_blank" rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-green transition-colors hover:text-cream">
            Voir tous les cas clients en détail <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- POURQUOI AXEM + DUO ----------
const WhyDuo: React.FC = () => {
  const reasons = [
    { n: '01', t: 'Partenaire sur la durée', d: 'De l\'audit à l\'autonomie. On ne disparaît pas après le kickoff.' },
    { n: '02', t: '70 % pratique minimum', d: 'Opérationnel dès J+1. Chaque formation produit un livrable réel.' },
    { n: '03', t: 'Résultats mesurés', d: 'ROI documenté. Des livrables concrets, pas des slides.' },
    { n: '04', t: 'Toujours à jour', d: 'Outils & méthodes 2025/2026.' },
    { n: '05', t: 'Un seul interlocuteur', d: 'Du diagnostic au déploiement.' },
  ];
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><SectionLabel>Pourquoi AXEM</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 6vw, 88px)' }}>
            A<span className="text-green">XE</span>M,<br />c'est nous deux.
          </h2>
        </Reveal>

        {/* 5 raisons en index compact */}
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-cream/12 bg-cream/12 sm:grid-cols-2 lg:grid-cols-5">
          {reasons.map((r, i) => (
            <Reveal key={r.n} delay={i * 0.04}>
              <div className="flex h-full flex-col gap-2 bg-ink p-5">
                <span className="font-display text-2xl text-green" style={{ fontWeight: 900 }}>{r.n}</span>
                <span className="font-display text-base text-cream" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>{r.t}</span>
                <span className="text-[13px] leading-relaxed text-cream-soft">{r.d}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Duo fondateurs */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.08}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream/12 bg-ink-2 transition-colors hover:border-green/40">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center bg-green text-ink shadow-lg transition-transform hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-7 md:p-8">
                  <div>
                    <h3 className="font-display text-2xl text-cream tighter md:text-3xl" style={{ fontWeight: 900 }}>{f.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-green">{f.school}</p>
                    <p className="text-sm text-cream-soft">{f.role}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-cream-soft">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-cream/12 pt-5">
                    <span className="font-display text-4xl text-cream md:text-5xl" style={{ fontWeight: 900 }}><Counter value={f.n} prefix="+" /></span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}>
          <p className="mt-10 text-center font-display text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(30px, 5vw, 72px)' }}>
            Deux experts, <span className="text-green">un seul interlocuteur.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- CTA FINAL — widget Calendly inline ----------
const FinalCTA: React.FC = () => {
  useEffect(() => {
    const src = 'https://assets.calendly.com/assets/external/widget.js';
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src; s.async = true;
    document.body.appendChild(s);
  }, []);
  return (
    <section id="rdv" className="px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-3xl border border-cream/12 bg-ink-2">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* Accroche */}
          <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
            <Reveal>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-green">
                <span className="h-1.5 w-1.5 rounded-full bg-green" />Diagnostic gratuit
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display leading-[0.92] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 5vw, 72px)' }}>
                Démarrons par un<br /><span className="text-green">diagnostic gratuit.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-md text-base text-cream-soft md:text-lg">
                30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <a href="mailto:contact@axem-ia.fr" className="inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-cream transition-colors hover:text-green">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" strokeLinecap="round" /></svg>
                contact@axem-ia.fr
              </a>
            </Reveal>
          </div>
          {/* Widget Calendly inline */}
          <div className="border-t border-cream/12 bg-ink p-3 lg:border-l lg:border-t-0 lg:p-4">
            <div className="calendly-inline-widget overflow-hidden rounded-2xl" data-url={CALENDLY_INLINE} style={{ minWidth: 320, height: 700 }} />
          </div>
        </div>
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
          <ul className="space-y-2 text-sm text-cream-soft">{[...NAV_LINKS, ['Méthode', '#methode'], ['Références', '#references']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
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
        <Problem />
        <Needs />
        <Method />
        <Prestations />
        <Catalogue />
        <Cases />
        <WhyDuo />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
