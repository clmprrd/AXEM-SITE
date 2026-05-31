import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion, MotionConfig,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — CATALOGUE STORYTELLING / SCROLL
// On découvre le catalogue commercial 2026 comme un parcours au scroll.
// Hero (Grainient) intact · dark #0F0F0F + mint #00FA9A + Archivo.
// =====================================================================

const CALENDLY_URL = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const CALENDLY = 'https://calendly.com/clem-pred/30min';
const NOTION_URL = '#'; // TODO URL Notion (cas clients détaillés)
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// =====================================================================
// BACKGROUND HERO — Grainient (OGL). 6 mix de couleurs VIFS, virales SaaS.
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
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
);

const RiseWords: React.FC<{ text: string; className?: string; delay?: number; stagger?: number }> = ({ text, className = '', delay = 0, stagger = 0.05 }) => {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span className="inline-block"
            initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.85, delay: delay + i * stagger, ease }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

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

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; className?: string; decimals?: number }> = ({ value, prefix = '', suffix = '', className, decimals = 0 }) => {
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
  const rounded = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
  const fmt = Number(rounded) >= 1000 ? Number(rounded).toLocaleString('fr-FR') : rounded.replace('.', ',');
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

// =====================================================================
// MODALE GÉNÉRIQUE (panneau détail) — clavier ESC, scroll lock, focus
// =====================================================================
const DetailModal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode; eyebrow?: string }> = ({ open, onClose, children, eyebrow }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-end justify-center p-0 md:items-center md:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div role="dialog" aria-modal="true" aria-label={eyebrow}
            className="no-scrollbar relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-cream/12 bg-ink-2 shadow-2xl"
            initial={{ y: 40, opacity: 0, scale: 0.985 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.35, ease }}>
            <button onClick={onClose} aria-label="Fermer"
              className="sticky left-full top-4 z-10 mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/15 bg-ink/70 text-cream backdrop-blur transition hover:border-green/50 hover:text-green">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
            <div className="-mt-10 px-6 pb-10 pt-2 md:px-10">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-cream/15 bg-ink-3 px-3 py-1 text-[11px] font-semibold text-cream-soft">{children}</span>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 24); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  const links: [string, string][] = [['Prestations', '#prestations'], ['Catalogue', '#catalogue'], ['Cas clients', '#cas'], ['Le duo', '#duo'], ['Méthode', '#methode']];
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-2xl tracking-tighter text-cream" style={{ fontWeight: 900 }}>
          AXEM<span className="text-green">.</span>
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Magnetic href="#rendez-vous" strength={0.3}
            className="group hidden items-center gap-1.5 bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] text-ink sm:inline-flex" style={{ fontWeight: 800 }}>
            Rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Magnetic>
          <button onClick={() => setOpen(v => !v)} className="flex h-10 w-10 items-center justify-center text-cream lg:hidden" aria-label="Menu">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? 'M18 6 6 18M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-cream/10 bg-ink/95 backdrop-blur-xl lg:hidden">
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map(([l, h]) => (
                <a key={l} href={h} onClick={() => setOpen(false)} className="py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-cream-soft">{l}</a>
              ))}
              <a href="#rendez-vous" onClick={() => setOpen(false)} className="mt-2 bg-green px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.06em] text-ink">Prendre rendez-vous →</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ---------- HERO (intact) ----------
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
            <Magnetic href="#rendez-vous" strength={0.35}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.65)]" style={{ fontWeight: 900 }}>
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              <span className="relative">Prendre rendez-vous</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#catalogue" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/15">
              Découvrir le catalogue <span aria-hidden>↓</span>
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
// TRUST — « Ils nous font confiance » · PLUS GROS · COULEUR · 2 GROUPES
// Logos couleur sur cartes BLANCHES (style plaquette). Fallback texte stylé.
// =====================================================================
type LogoItem = { src?: string; alt: string; fallback?: boolean };
const LogoCard: React.FC<{ item: LogoItem; i: number }> = ({ item, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 22, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.55, delay: (i % 6) * 0.05, ease }}
    className="flex h-24 items-center justify-center rounded-2xl bg-white px-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 md:h-28 md:px-7">
    {item.fallback || !item.src ? (
      <span className="text-center font-display text-lg text-ink md:text-2xl" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{item.alt}</span>
    ) : (
      <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="max-h-12 w-auto max-w-[150px] object-contain md:max-h-14 md:max-w-[170px]" />
    )}
  </motion.div>
);

const Trust: React.FC = () => {
  const clients: LogoItem[] = [
    { src: '/logos/carrefour.svg', alt: 'Carrefour' },
    { src: '/logos/blackfin.png', alt: 'BlackFin Capital Partners' },
    { src: '/logos/avantis.png', alt: 'Avantis' },
    { src: '/logos/kit.png', alt: 'KIT France' },
    { src: '/logos/espace2.png', alt: 'Espace 2' },
    { src: '/logos/socos.png', alt: 'Socos' },
  ];
  const orga: LogoItem[] = [
    { src: '/logos/myconnecting.png', alt: 'myconnecting' },
    { src: '/logos/synapseia.png', alt: 'Synapse IA' },
    { src: '/logos/asphere.png', alt: 'ASphere' },
    { alt: 'AI Sisters', fallback: true },
    { src: '/logos/senza.png', alt: 'SENZA Formations' },
    { src: '/logos/cegos.png', alt: 'Cegos' },
  ];
  return (
    <section id="references" className="relative border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Références</div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 116px)' }}>
            Ils nous font<br /><span className="text-green">confiance.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-base text-cream-soft md:text-lg">Des PME aux grands comptes &amp; administrations — et les organismes de formation qui nous confient leurs équipes.</p>
        </Reveal>

        {/* GROUPE 1 — CLIENTS */}
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cream">Clients</span>
            <span className="h-px flex-1 bg-cream/12" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {clients.map((l, i) => <LogoCard key={l.alt} item={l} i={i} />)}
          </div>
        </div>

        {/* GROUPE 2 — ORGANISMES DE FORMATION */}
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cream">Organismes de formation partenaires</span>
            <span className="h-px flex-1 bg-cream/12" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {orga.map((l, i) => <LogoCard key={l.alt} item={l} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

// =====================================================================
// SERVICES — 7 prestations enrichies (détail PDF) · clic → modale
// =====================================================================
type Service = { n: string; t: string; tagline: string; price: string; meta?: string; intro: string; points: string[] };
const SERVICES: Service[] = [
  {
    n: '01', t: 'Audit IA', tagline: 'On regarde avant de déployer.', price: 'Sur devis', meta: '1 semaine',
    intro: "Diagnostic, cartographie de vos process, scoring de maturité IA, roadmap priorisée. Réalisé en 1 semaine.",
    points: [
      '01 Analyse — cartographie des process + points de friction',
      '02 Opportunités — cas d\'usage scorés par impact et faisabilité',
      '03 Roadmap — plan d\'adoption séquencé sur 3 à 12 mois',
      '04 Livrable — document de synthèse + recommandations concrètes',
    ],
  },
  {
    n: '02', t: 'Conseil stratégique', tagline: 'Quoi faire, dans quel ordre, avec quel budget.', price: 'Sur devis',
    intro: 'Roadmap priorisée, choix des outils, architecture, pilotage du déploiement.',
    points: [
      'Accompagnement décisionnel — cadrage projets, arbitrages, priorisation par ROI',
      'Choix des outils — architecture, sélection fournisseurs, stack adaptée',
      'Pilotage du déploiement — coordination équipes, jalons, conduite du changement',
      'Missions sur mesure — ponctuelles ou continues',
    ],
  },
  {
    n: '03', t: 'Déploiement & automatisation', tagline: 'Libérez vos équipes des tâches répétitives.', price: 'À partir de 1 200 €',
    intro: 'Des workflows qui tournent seuls, 7j/7. Construits, testés et déployés. n8n · Make · Claude Code.',
    points: [
      'Option A — Clé en main · 1 200 € à 2 000 € (selon complexité) : automatisation construite, testée, déployée + documentation et passation',
      'Option B — Abonnement suivi · 900 € puis 80 €/mois : maintenance, évolutions et nouvelles automatisations, un référent Axem dédié',
    ],
  },
  {
    n: '04', t: 'Formation', tagline: 'Vos équipes opérationnelles dès J+1.', price: '200 € – 1 250 € / pers.',
    intro: 'Upskilling des équipes sur les cas d\'usage identifiés. Le catalogue Axem s\'active ici, ciblé sur vos besoins réels.',
    points: [
      '70 % de pratique minimum',
      'Certifié Qualiopi · finançable OPCO',
      '10 formations, 3 niveaux — voir le catalogue complet ci-dessous',
    ],
  },
  {
    n: '05', t: 'Coaching individuel', tagline: 'Pour vos profils clés.', price: '200 € / session (1h)',
    intro: 'Managers, dirigeants, référents IA internes. On ancre les compétences dans la durée.',
    points: [
      '1 session par semaine',
      'Réalisé par Clément ou Alexis',
      'Idéal pour transformer un référent IA interne en relais autonome',
    ],
  },
  {
    n: '06', t: 'Production IA', tagline: 'Des assets produits 10× plus vite, à coût maîtrisé.', price: 'Sur devis',
    intro: 'On produit pour vous, à la demande, au livrable.',
    points: [
      'Vidéos avatar IA · voix clonée · vidéos réseaux sociaux',
      'Images & visuels · slides & présentations',
      'Sites web no-code',
    ],
  },
  {
    n: '07', t: 'Suivi', tagline: 'Une fois déployé, on reste.', price: '80 € / mois', meta: '12 mois +',
    intro: '« Le déploiement n\'est qu\'un début. Ce qui change la trajectoire, c\'est ce qui se passe ensuite. » Durée moyenne d\'un partenariat : 12 mois et plus.',
    points: [
      'Maintenance — automatisations à jour, MAJ d\'API',
      'Évolutions & améliorations continues',
      'Nouvelles opportunités — nouveaux cas d\'usage à mesure que les équipes mûrissent',
      'Production IA continue',
    ],
  },
];

const Services: React.FC = () => {
  const [active, setActive] = useState<Service | null>(null);
  return (
    <section id="prestations" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Ce qu'on fait</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
            Sept prestations.<br /><span className="outline-type">Un partenaire.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}><p className="mt-6 max-w-xl text-base text-cream-soft md:text-lg">Un parcours complet, pas une intervention isolée. Cliquez sur une prestation pour le détail.</p></Reveal>

        <div className="mt-14 border-t border-cream/12">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 0.05}>
              <button onClick={() => setActive(s)} className="group block w-full border-b border-cream/12 py-7 text-left transition-colors hover:bg-ink-2 md:py-9">
                <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 md:grid-cols-[110px_1fr_auto] md:gap-x-8">
                  <span className="font-display text-xl text-green transition-transform duration-300 group-hover:translate-x-1 md:text-3xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  <h3 className="flex flex-wrap items-baseline gap-x-3 font-display leading-[0.95] text-cream transition-colors group-hover:text-green tight" style={{ fontWeight: 800, fontSize: 'clamp(26px, 4.2vw, 58px)' }}>
                    {s.t}
                    {s.meta && <span className="rounded-full bg-green px-2.5 py-0.5 align-middle text-[11px] font-bold uppercase tracking-[0.1em] text-ink md:text-xs">{s.meta}</span>}
                  </h3>
                  <span className="col-span-2 text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft md:col-span-1 md:self-center md:whitespace-nowrap">{s.price}</span>
                </div>
                <p className="mt-3 flex max-w-2xl items-center gap-2 text-sm leading-relaxed text-cream-soft md:ml-[142px] md:text-base">
                  {s.tagline}
                  <span className="inline-flex items-center gap-1 text-green opacity-0 transition-opacity group-hover:opacity-100">détail <span aria-hidden>→</span></span>
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <DetailModal open={!!active} onClose={() => setActive(null)} eyebrow={active?.t}>
        {active && (
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl text-green" style={{ fontWeight: 900 }}>{active.n}</span>
              {active.meta && <span className="rounded-full bg-green px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-ink">{active.meta}</span>}
              <span className="ml-auto text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft">{active.price}</span>
            </div>
            <h3 className="mt-4 font-display text-4xl text-cream tighter md:text-5xl" style={{ fontWeight: 900 }}>{active.t}</h3>
            <p className="mt-2 text-lg font-semibold text-green">{active.tagline}</p>
            <p className="mt-5 text-base leading-relaxed text-cream-soft">{active.intro}</p>
            <ul className="mt-7 space-y-3">
              {active.points.map((p, i) => (
                <li key={i} className="flex gap-3 border-l-2 border-green/40 bg-ink-3/40 py-3 pl-4 pr-3 text-sm leading-relaxed text-cream/90 md:text-base">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{p}
                </li>
              ))}
            </ul>
            <a href="#rendez-vous" onClick={() => setActive(null)} className="mt-8 inline-flex items-center gap-2 bg-green px-6 py-3 text-sm font-bold uppercase tracking-[0.04em] text-ink transition hover:bg-green-deep">En parler en 30 min <span aria-hidden>→</span></a>
          </div>
        )}
      </DetailModal>
    </section>
  );
};

// =====================================================================
// CATALOGUE — parcours STORYTELLING par niveau · 10 formations
// Sticky intro de niveau (useScroll, pas de scroll-jacking) + reveal cartes
// clic → modale détail (programme, outils, livrables)
// =====================================================================
type Formation = {
  code: string; name: string; level: string; duration: string; price: string;
  tagline: string; sections: { title: string; items: string }[]; tools: string; deliverables: string;
};
const LEVELS: { key: string; title: string; sub: string }[] = [
  { key: 'SOCLE', title: 'Socle', sub: 'Les fondations. Comprendre, prompter, maîtriser Claude.' },
  { key: 'MÉTIERS', title: 'Métiers', sub: 'L\'IA branchée sur le quotidien de chaque équipe.' },
  { key: 'AUTOMATISATION', title: 'Automatisation', sub: 'Des workflows et des agents qui travaillent seuls.' },
  { key: 'TRANSVERSAL', title: 'Transversal', sub: 'Gouvernance, conformité et veille — rester maître du sujet.' },
  { key: 'PRODUCTION', title: 'Production', sub: 'Produire visuel, vidéo et voix 10× plus vite.' },
];
const FORMATIONS: Formation[] = [
  {
    code: 'F01', name: 'IA Essentielle', level: 'SOCLE', duration: '1 J', price: '300 €',
    tagline: 'De zéro à opérationnel en 1 journée.',
    sections: [
      { title: 'Matin · Comprendre l\'IA', items: 'Comment fonctionne un LLM (sans jargon) · RGPD (ce qu\'on peut envoyer ou pas à une IA) · Identifier ses cas d\'usage métier.' },
      { title: 'Après-midi · Pratiquer', items: 'Prompt Engineering structure RACF (Rôle/Action/Contexte/Format) · 15 exercices sur cas réels par métier · Plan d\'action J+1 (3 actions à déployer demain matin).' },
    ],
    tools: 'Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash · Perplexity',
    deliverables: 'Guide 50 Prompts par Métier · Charte d\'usage IA · Fiche 3 Quick Wins J+1',
  },
  {
    code: 'F02', name: 'Prompt Engineering Pro', level: 'SOCLE', duration: '½ J', price: '200 €',
    tagline: 'Multiplier par 5 la qualité de ses outputs IA.',
    sections: [
      { title: 'Programme', items: 'Techniques avancées (Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting) · 20 exercices chronométrés sur cas réels · Construire sa bibliothèque de prompts d\'équipe (template Notion configuré en live) · Atelier final : 5 prompts signature.' },
    ],
    tools: 'Claude Opus 4.6 · GPT-5.2 · Gemini 3.1 Pro',
    deliverables: 'Template Bibliothèque Prompts Notion · Fiche mémo Techniques Avancées',
  },
  {
    code: 'F03', name: 'Maîtriser Claude', level: 'SOCLE', duration: '1 J', price: '450 €',
    tagline: 'Devenir expert de l\'IA qui pèse 70 % du Fortune 100.',
    sections: [
      { title: 'Matin · Bases solides', items: 'Claude vs ChatGPT vs Gemini · Modèles Sonnet 4.6 et Opus 4.6 · Projects, Artifacts, Computer Use.' },
      { title: 'Après-midi · Niveau expert', items: 'Claude Skills · MCP (Model Context Protocol) · Cowork & Sub-agents · Atelier 3 Skills.' },
    ],
    tools: 'Claude Opus 4.6 · Sonnet 4.6 · Skills · MCP · Cowork',
    deliverables: 'Pack 10 Skills Axem · Guide Claude Power User · Charte d\'usage Claude',
  },
  {
    code: 'F04', name: 'IA pour tous les métiers', level: 'MÉTIERS', duration: '1 J', price: '400 €',
    tagline: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    sections: [
      { title: 'Modules combinables (contenus 2026)', items: '01 Direction & Stratégie (Roadmap IA, ROI, scénarios, AI Act) · 02 Marketing & Commercial (10× contenu, prospection ultra-personnalisée, +25 % leads) · 03 RH & Recrutement (fiche poste 10 min, screening 100 CV, onboarding 30/60/90) · 04 Finance & Compta (reporting, analyse Excel/CSV, automatisation factures) · 05 Juridique & Compliance (analyse contrats, recherche juris, détection clauses risquées) · 06 Service Client (chatbots, triage tickets, FAQ auto, escalade) · 07 Réseaux Sociaux & Brand (4 semaines en 1 jour, hooks LinkedIn, repurposing 8 formats) · 08 Créatif & Design (visuels, moodboards, design system, copywriting marque).' },
    ],
    tools: 'Stack adaptée à chaque module choisi',
    deliverables: 'Livrables sectoriels selon les modules sélectionnés',
  },
  {
    code: 'F05', name: 'No-Code & Workflows', level: 'AUTOMATISATION', duration: '2 J', price: '800 €',
    tagline: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    sections: [
      { title: 'J1', items: 'Make et n8n (3 automatisations live), exemples (Formulaire→CRM · Email→Slack+tâche · RSS→LinkedIn), objectif 1 workflow déployé avant 18h.' },
      { title: 'J2', items: 'Intégrer Claude/GPT/Gemini dans Make et n8n, conditions complexes / erreurs / boucles, projet final déployé en prod.' },
    ],
    tools: 'Make · n8n · Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash',
    deliverables: '10 templates Make & n8n prêts à cloner · Guide Connecter 50 outils',
  },
  {
    code: 'F06', name: 'Agent IA sur-mesure', level: 'AUTOMATISATION', duration: '2 J', price: '1 250 €',
    tagline: 'Un travailleur autonome qui agit seul, 24h/24. (Prérequis : F05 ou pratique API)',
    sections: [
      { title: 'J1 · Architecture', items: 'LLM + Mémoire + Outils + Planification (démo live), frameworks (n8n Agents, CrewAI, LangGraph), RAG (Pinecone, Chroma), MCP.' },
      { title: 'J2 · Déploiement', items: '3 patterns business (Agent Support 24/7 · Agent SDR · Agent Admin), Claude Skills, validation humaine / monitoring / RGPD, projet final.' },
    ],
    tools: 'Claude Opus 4.6 · GPT-5.2 · n8n Agents · CrewAI · LangGraph · Pinecone · MCP',
    deliverables: 'Template Agent IA n8n/LangGraph · Guide 6 Architectures d\'Agents · Checklist sécurité',
  },
  {
    code: 'F07', name: 'Vibe Coding & Claude Code', level: 'AUTOMATISATION', duration: '1 J', price: '450 €',
    tagline: 'Construire des outils sans coder, avec l\'IA comme binôme.',
    sections: [
      { title: 'Matin', items: 'Lovable / Bolt.new / v0 (app web en 1h), méthode du vibe coding structuré, atelier micro-outil métier.' },
      { title: 'Après-midi', items: 'Cursor IDE, Claude Code (CLI), workflows générer / tester / déployer, sécurité / audit / gouvernance.' },
    ],
    tools: 'Cursor · Claude Code · Lovable · Bolt.new · v0 · GitHub Copilot',
    deliverables: 'Pack Prompts Vibe Coding · Guide Cursor & Claude Code · 3 mini-apps livrées',
  },
  {
    code: 'F08', name: 'Gouvernance & AI Act', level: 'TRANSVERSAL', duration: '½ J', price: '250 €',
    tagline: 'Cadrer ses usages IA en conformité. (Public : Direction, DPO, DSI, RH, Juristes)',
    sections: [
      { title: 'Programme', items: 'AI Act 2026 (interdit / obligatoire), RGPD & IA (serveurs US OpenAI/Anthropic), construire sa charte IA + traçabilité, 5 cas pratiques live, matrice de risques AI Act.' },
    ],
    tools: 'AI Act 2026 · CNIL · Frameworks RGPD',
    deliverables: 'Template Charte IA · Matrice de risques AI Act · Plan de mise en conformité 90 jours',
  },
  {
    code: 'F09', name: 'Veille IA', level: 'TRANSVERSAL', duration: '2 h', price: '80 € · 320 €/an',
    tagline: 'Rester à jour sur un champ qui bouge tous les mois.',
    sections: [
      { title: 'Programme', items: '10 avancées IA majeures (démos live), méthode de veille perso 20 min/semaine, horizon 12-24 mois, modulable selon métier. Abonnement annuel : 320 €/pers, 4 sessions/an.' },
    ],
    tools: 'Perplexity · Claude · Veille IA Axem · Newsletters',
    deliverables: 'Template Notion Veille IA · Liste 30 sources curées · Replays',
  },
  {
    code: 'F10', name: 'Création IA — Visuel · Vidéo · Voix', level: 'PRODUCTION', duration: '1 J', price: '400 €',
    tagline: 'Produire 10× plus vite, à coût maîtrisé.',
    sections: [
      { title: 'Matin · Images', items: 'Midjourney V7, DALL-E 4, Adobe Firefly 3, Nano Banana Pro · Logos (Looka, Brandmark, Ideogram 2) · Infographies (Napkin AI, Gamma, NotebookLM) · Sites 1h (Lovable, Bolt.new, Emergent).' },
      { title: 'Après-midi · Vidéo & Voix', items: 'Synthesia (140 avatars, 120 langues) · ElevenLabs voix clonée 3 min · Génération vidéo (Kling 2.5, Sora 2, Veo 3.1) · Repurposing (CapCut AI, Opus Clip → 1 contenu = 8 formats).' },
    ],
    tools: 'Midjourney · Synthesia · ElevenLabs · Kling · Sora · Veo · Gamma',
    deliverables: 'Guide 30 Outils Créatifs IA 2026 · Pack 50 Prompts Midjourney · Templates Gamma',
  },
];

const FormationRow: React.FC<{ f: Formation; onClick: () => void; i: number }> = ({ f, onClick, i }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  return (
    <motion.button ref={ref} onClick={onClick}
      initial={reduce ? false : { opacity: 0, x: -24, clipPath: 'inset(0 100% 0 0)' }}
      animate={inView ? { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)' } : {}}
      transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease }}
      className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-cream/12 py-5 text-left transition-colors hover:bg-ink-3/50 md:gap-x-8 md:py-7">
      <span className="font-display text-base text-green md:text-xl" style={{ fontWeight: 900 }}>{f.code}</span>
      <div className="min-w-0">
        <h4 className="truncate font-display text-xl text-cream transition-colors group-hover:text-green tight md:text-3xl" style={{ fontWeight: 800 }}>{f.name}</h4>
        <p className="mt-0.5 hidden truncate text-sm text-cream-soft sm:block">{f.tagline}</p>
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        <span className="inline-flex items-center gap-2">
          <span className="rounded-full border border-cream/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-cream-soft md:text-[11px]">{f.duration}</span>
          <span className="font-display text-base text-cream md:text-2xl" style={{ fontWeight: 900 }}>{f.price}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-green opacity-0 transition-opacity group-hover:opacity-100">Programme <span aria-hidden>→</span></span>
      </div>
    </motion.button>
  );
};

const LevelBlock: React.FC<{ level: typeof LEVELS[number]; index: number; formations: Formation[]; onSelect: (f: Formation) => void }> = ({ level, index, formations, onSelect }) => {
  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr] md:gap-12">
      {/* Intertitre de niveau — sticky (pas de scroll-jacking) */}
      <div className="md:sticky md:top-28 md:h-fit md:py-4">
        <Reveal>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-sm text-green" style={{ fontWeight: 900 }}>{String(index + 1).padStart(2, '0')}</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cream-dim">Niveau</span>
          </div>
          <h3 className="mt-2 font-display leading-[0.92] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 5vw, 72px)' }}>{level.title}</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-soft md:text-base">{level.sub}</p>
        </Reveal>
      </div>
      <div className="border-t border-cream/12">
        {formations.map((f, i) => <FormationRow key={f.code} f={f} i={i} onClick={() => onSelect(f)} />)}
      </div>
    </div>
  );
};

const Catalogue: React.FC = () => {
  const [active, setActive] = useState<Formation | null>(null);
  return (
    <section id="catalogue" className="border-t border-cream/10 bg-ink-2 px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Catalogue de formation 2025-2026</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 8vw, 132px)' }}>
            10 formations.<br /><span className="text-green">Un parcours.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-cream-soft md:text-lg">
            « Formations construites de A à Z selon vos besoins, vos contraintes et vos cas d'usage. » 3 niveaux, 70 % de pratique, certifié Qualiopi. Tarifs HT par participant, inter ou intra. Modulables en parcours et bootcamps sur devis. <span className="text-cream">Cliquez sur une formation pour son programme complet.</span>
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-7 flex flex-wrap gap-2">
            <Pill>70 % pratique</Pill><Pill>Certifié Qualiopi</Pill><Pill>Finançable OPCO</Pill><Pill>Inter ou intra</Pill><Pill>Outils 2026</Pill>
          </div>
        </Reveal>

        {/* PARCOURS PAR NIVEAU */}
        <div className="mt-20 space-y-20 md:space-y-28">
          {LEVELS.map((lvl, idx) => (
            <LevelBlock key={lvl.key} level={lvl} index={idx} formations={FORMATIONS.filter(f => f.level === lvl.key)} onSelect={setActive} />
          ))}
        </div>

        {/* BOOTCAMPS + VIDÉOS */}
        <div className="mt-24 grid gap-6 md:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col gap-3 border border-green/30 bg-ink-3/40 p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">B01 · Le MVP</span>
              <h4 className="font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>IA & Social Media</h4>
              <p className="text-sm text-cream-soft">3 jours · sur devis — dirigeants / TPE / PME / commerces. 10 % théorie, 90 % pratique sur vos données : 20-30 posts créés, calendrier automatisé (Zapier/Make), playbook + 1 automatisation live.</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col gap-3 border border-cream/12 bg-ink-3/40 p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">B02 · Extension</span>
              <h4 className="font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>Performance & Scale</h4>
              <p className="text-sm text-cream-soft">+2 jours après B01 · sur devis. Optimisation data (A/B testing, funnels), scale vidéos courtes, autonomie 24/7 (agents IA + chatbots), système complet branché.</p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="flex h-full flex-col gap-3 border border-cream/12 bg-ink-3/40 p-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Masterclass 24/7</span>
              <h4 className="font-display text-2xl text-cream tight" style={{ fontWeight: 800 }}>Formations vidéos</h4>
              <p className="text-sm text-cream-soft">Apprendre à son rythme. 40-45 vidéos HD, format screencast pas-à-pas, cas d'usage métiers, config workflows live, MAJ 2026, templates et bibliothèques de prompts sectoriels. Idéal onboarding nouvelle recrue. Sur devis.</p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* MODALE FORMATION */}
      <DetailModal open={!!active} onClose={() => setActive(null)} eyebrow={active?.name}>
        {active && (
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl text-green" style={{ fontWeight: 900 }}>{active.code}</span>
              <span className="rounded-full border border-cream/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft">{active.level}</span>
              <span className="rounded-full border border-cream/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft">{active.duration}</span>
              <span className="ml-auto font-display text-2xl text-cream" style={{ fontWeight: 900 }}>{active.price}</span>
            </div>
            <h3 className="mt-4 font-display text-3xl text-cream tighter md:text-5xl" style={{ fontWeight: 900 }}>{active.name}</h3>
            <p className="mt-2 text-lg font-semibold text-green">{active.tagline}</p>
            <div className="mt-6 space-y-4">
              {active.sections.map((sec, i) => (
                <div key={i} className="border-l-2 border-green/40 bg-ink-3/40 py-4 pl-4 pr-3">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-cream">{sec.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream-soft md:text-base">{sec.items}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-cream/12 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Outils</p>
                <p className="mt-1.5 text-sm leading-relaxed text-cream-soft">{active.tools}</p>
              </div>
              <div className="rounded-xl border border-cream/12 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-green">Livrables</p>
                <p className="mt-1.5 text-sm leading-relaxed text-cream-soft">{active.deliverables}</p>
              </div>
            </div>
            <a href="#rendez-vous" onClick={() => setActive(null)} className="mt-8 inline-flex items-center gap-2 bg-green px-6 py-3 text-sm font-bold uppercase tracking-[0.04em] text-ink transition hover:bg-green-deep">Réserver cette formation <span aria-hidden>→</span></a>
          </div>
        )}
      </DetailModal>
    </section>
  );
};

// =====================================================================
// FINANCEMENT — OPCO via portage IZY for pro · 3 étapes · jusqu'à 100 %
// =====================================================================
const Financement: React.FC = () => {
  const steps = [
    { n: '01', t: 'Diagnostic gratuit', meta: '30 min', d: 'On identifie ensemble les 3 formations les plus rentables pour vos équipes.' },
    { n: '02', t: 'Devis & dossier OPCO', meta: '48 h', d: 'Proposition sous 48h. On monte la prise en charge OPCO via portage IZY for pro — démarches simplifiées, interlocuteur unique côté Axem.' },
    { n: '03', t: 'Formation', meta: 'J+1', d: 'Équipes opérationnelles dès J+1, livrables concrets, suivi post-formation.' },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px] border border-green/25 bg-ink-2 p-7 md:p-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <Reveal><div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Financement</div></Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display leading-[0.92] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(34px, 5vw, 76px)' }}>
                Jusqu'à <span className="text-green">100 %</span> financé.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-cream-soft">
                Nos formations sont finançables OPCO via portage <span className="font-semibold text-cream">IZY for pro</span>. On s'occupe du dossier, vous vous concentrez sur vos équipes. Un seul interlocuteur, du diagnostic à la prise en charge.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a href="mailto:contact@axem-ia.fr" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-green transition hover:gap-3">contact@axem-ia.fr <span aria-hidden>→</span></a>
            </Reveal>
          </div>
          <div className="relative">
            <span aria-hidden className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px bg-cream/12 md:block" />
            <div className="space-y-6">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.1}>
                  <div className="relative flex gap-5 md:pl-0">
                    <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green font-display text-sm text-ink" style={{ fontWeight: 900 }}>{i + 1}</span>
                    <div className="flex-1 border border-cream/12 bg-ink-3/40 p-5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-xl text-cream tight md:text-2xl" style={{ fontWeight: 800 }}>{s.t}</h4>
                        <span className="bg-green px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink">{s.meta}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-cream-soft md:text-base">{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------- DUO (gardé) ----------
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
            Ensemble, <span className="text-green">+55 000</span> abonnés.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// =====================================================================
// CAS CLIENTS — scrollytelling · 4 cas chiffrés (count-up) + cas formation
// clic → modale détail · lien « Voir tous les cas clients » → Notion
// =====================================================================
type Stat = { value: number; prefix?: string; suffix?: string; decimals?: number; label: string };
type CaseStudy = {
  sector: string; title: string; context: string; stats: Stat[]; before?: string; after?: string; results: string[];
};
const CASES: CaseStudy[] = [
  {
    sector: 'Éditeur logiciel · Médico-social',
    title: 'Industrialisation IA dans les équipes Dev',
    context: 'Éditeur ~550 salariés, Claude déployé sans méthode.',
    stats: [{ value: 20, label: 'ambassadeurs formés / 80 devs' }],
    after: 'Framework d\'usage co-construit avec le CISO',
    results: [
      '20 ambassadeurs formés sur 80 développeurs',
      'Framework d\'usage IA co-construit avec le CISO',
      'Agents PO, revue de code et support feature déployés en production',
    ],
  },
  {
    sector: 'BTP · Rénovation & Structure',
    title: 'Chiffrage automatisé par IA',
    context: 'PME 40 collaborateurs, 30 débours/jour/collaborateur.',
    stats: [{ value: 80, suffix: ' %', label: 'de temps de saisie économisé' }, { value: 95, prefix: '', suffix: ' k€', label: 'de charge annuelle neutralisée' }],
    before: '30 notes de débours saisies à la main chaque jour',
    after: 'DPGF Excel & CSV générés automatiquement, intégrés à l\'ERP KALITICS',
    results: [
      '80 % de temps de saisie économisé sur la note de débours',
      'DPGF Excel et CSV générés automatiquement, intégration ERP KALITICS',
      '95 k€ de charge annuelle neutralisée sur l\'avant-vente',
    ],
  },
  {
    sector: 'Administration judiciaire',
    title: 'Audit automatisé par OCR + IA',
    context: 'Liasses fiscales et documents juridiques. Mission 4 mois.',
    stats: [{ value: 4, prefix: '×', label: 'plus rapide (3 h gagnées/dossier)' }, { value: 100, suffix: ' %', label: 'de fiabilité (double vérif OCR/IA)' }],
    before: 'Traitement manuel des liasses, dossier par dossier',
    after: '+5 h/semaine/collaborateur réaffectées à l\'analyse',
    results: [
      'Vitesse de traitement ×4 (3 h gagnées par dossier)',
      '100 % de fiabilité par double vérification OCR/IA',
      '+5 h/semaine/collaborateur réaffectées à l\'analyse à forte valeur',
    ],
  },
  {
    sector: 'Adhésifs · Aéronautique & Ferroviaire',
    title: 'Conformité ADV automatisée',
    context: 'Comparaison BC vs AR, 1 900 paires/mois.',
    stats: [{ value: 317, suffix: ' h', label: 'libérées par mois' }, { value: 98, prefix: '> ', suffix: ' %', label: 'd\'anomalies détectées' }],
    before: '15 min par dossier de conformité',
    after: '5 min par dossier — hébergement Europe RGPD, intégration ERP Proginov',
    results: [
      'Temps par dossier 15 min → 5 min (317 h/mois libérées)',
      'Détection des anomalies > 98 %',
      'Hébergement Europe conforme RGPD, intégration ERP Proginov',
    ],
  },
];

type FormationCase = { client: string; sector: string; title: string; details: string[] };
const FORMATION_CASES: FormationCase[] = [
  { client: 'Espace 2', sector: 'Promotion immobilière', title: 'Formation IA — Direction & RH', details: ['2 journées d\'upskilling', 'Charte d\'usage IA', 'Roadmap 90 jours déployée'] },
  { client: 'Avantis', sector: 'Conseil & expertise', title: 'Kit Journée IA par métier', details: ['Document interactif HTML', '6 prompts sectoriels validés', 'Adoption +60 %'] },
  { client: 'Gravotech', sector: 'Industrie / Manufacturing', title: 'Acculturation IA équipes opérationnelles', details: ['Formation 1 journée sur outils 2025', '3 quick wins déployés en 30 jours'] },
  { client: 'Carrefour', sector: 'Grande distribution', title: 'Animation formations IA — Gemini', details: ['1 journée sur Gemini', 'Au niveau groupe'] },
];

const CaseCard: React.FC<{ c: CaseStudy; i: number; onClick: () => void }> = ({ c, i, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.45'] });
  const reduce = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div ref={ref} style={{ y, opacity }} className="grid gap-6 md:grid-cols-[1fr_1fr] md:gap-12">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">{String(i + 1).padStart(2, '0')} · {c.sector}</span>
        <h3 className="mt-3 font-display leading-[0.95] text-cream tight" style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 56px)' }}>{c.title}</h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-cream-soft">{c.context}</p>
        {(c.before || c.after) && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            {c.before && <span className="rounded-full border border-cream/15 px-3 py-1 text-cream-soft line-through decoration-cream/30">{c.before}</span>}
            {c.before && c.after && <span className="text-green" aria-hidden>→</span>}
            {c.after && <span className="rounded-full border border-green/40 bg-green/5 px-3 py-1 font-medium text-cream">{c.after}</span>}
          </div>
        )}
        <button onClick={onClick} className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-green transition hover:gap-3">Voir le détail <span aria-hidden>→</span></button>
      </div>
      <div className="flex flex-col justify-center gap-6 border-t border-cream/12 pt-6 md:border-l md:border-t-0 md:pl-12 md:pt-0">
        {c.stats.map((s, j) => (
          <div key={j}>
            <div className="font-display leading-[0.85] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(56px, 8vw, 120px)' }}>
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <div className="mt-1 text-sm font-semibold text-cream-soft md:text-base">{s.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Cases: React.FC = () => {
  const [active, setActive] = useState<CaseStudy | null>(null);
  const [activeFC, setActiveFC] = useState<FormationCase | null>(null);
  return (
    <section id="cas" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Cas clients</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 118px)' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}><p className="mt-6 max-w-2xl text-base text-cream-soft md:text-lg">5 missions, 5 secteurs, des résultats mesurés. Cliquez sur un cas pour la méthodologie complète.</p></Reveal>

        {/* SCROLLYTELLING — cas chiffrés */}
        <div className="mt-20 space-y-24 md:space-y-32">
          {CASES.map((c, i) => (
            <CaseCard key={c.title} c={c} i={i} onClick={() => setActive(c)} />
          ))}
        </div>

        {/* CAS FORMATION */}
        <div className="mt-28">
          <Reveal>
            <h3 className="font-display leading-[0.95] text-cream tight" style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 56px)' }}>
              Ils ont formé leurs équipes <span className="text-green">avec nous.</span>
            </h3>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FORMATION_CASES.map((fc, i) => (
              <Reveal key={fc.client} delay={(i % 4) * 0.06}>
                <button onClick={() => setActiveFC(fc)} className="group flex h-full w-full flex-col gap-2 border border-cream/12 bg-ink-2 p-6 text-left transition-colors hover:border-green/40 hover:bg-ink-3">
                  <span className="font-display text-2xl text-cream transition-colors group-hover:text-green tight" style={{ fontWeight: 800 }}>{fc.client}</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-green">{fc.sector}</span>
                  <span className="mt-1 text-sm text-cream-soft">{fc.title}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-cream-soft transition-colors group-hover:text-green">Détail <span aria-hidden>→</span></span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        {/* LIEN NOTION */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col items-start gap-4 border-t border-cream/12 pt-12 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md text-base text-cream-soft">Méthodologies, livrables, retours d'expérience et résultats détaillés.</p>
            <a href={NOTION_URL} data-todo="URL Notion à fournir" target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-green/40 bg-green/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-green transition hover:bg-green hover:text-ink">
              Voir tous les cas clients en détail <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </div>

      {/* MODALE cas chiffré */}
      <DetailModal open={!!active} onClose={() => setActive(null)} eyebrow={active?.title}>
        {active && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">{active.sector}</span>
            <h3 className="mt-3 font-display text-3xl text-cream tighter md:text-4xl" style={{ fontWeight: 900 }}>{active.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-cream-soft">{active.context}</p>
            <div className="mt-6 flex flex-wrap gap-6">
              {active.stats.map((s, j) => (
                <div key={j}>
                  <div className="font-display text-5xl text-green tighter md:text-6xl" style={{ fontWeight: 900 }}>{s.prefix || ''}{s.value}{s.suffix || ''}</div>
                  <div className="mt-1 text-xs font-semibold text-cream-soft">{s.label}</div>
                </div>
              ))}
            </div>
            {(active.before || active.after) && (
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                {active.before && <span className="rounded-full border border-cream/15 px-3 py-1 text-cream-soft line-through decoration-cream/30">{active.before}</span>}
                {active.before && active.after && <span className="text-green" aria-hidden>→</span>}
                {active.after && <span className="rounded-full border border-green/40 bg-green/5 px-3 py-1 font-medium text-cream">{active.after}</span>}
              </div>
            )}
            <ul className="mt-7 space-y-3">
              {active.results.map((r, i) => (
                <li key={i} className="flex gap-3 border-l-2 border-green/40 bg-ink-3/40 py-3 pl-4 pr-3 text-sm leading-relaxed text-cream/90 md:text-base">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{r}
                </li>
              ))}
            </ul>
            <a href={NOTION_URL} data-todo="URL Notion à fournir" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 border border-green/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.04em] text-green transition hover:bg-green hover:text-ink">Méthodologie complète <span aria-hidden>→</span></a>
          </div>
        )}
      </DetailModal>

      {/* MODALE cas formation */}
      <DetailModal open={!!activeFC} onClose={() => setActiveFC(null)} eyebrow={activeFC?.client}>
        {activeFC && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-green">{activeFC.sector}</span>
            <h3 className="mt-3 font-display text-3xl text-cream tighter md:text-4xl" style={{ fontWeight: 900 }}>{activeFC.client}</h3>
            <p className="mt-2 text-lg font-semibold text-green">{activeFC.title}</p>
            <ul className="mt-6 space-y-3">
              {activeFC.details.map((d, i) => (
                <li key={i} className="flex gap-3 border-l-2 border-green/40 bg-ink-3/40 py-3 pl-4 pr-3 text-sm leading-relaxed text-cream/90 md:text-base">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{d}
                </li>
              ))}
            </ul>
            <a href={NOTION_URL} data-todo="URL Notion à fournir" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 border border-green/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.04em] text-green transition hover:bg-green hover:text-ink">Voir le détail complet <span aria-hidden>→</span></a>
          </div>
        )}
      </DetailModal>
    </section>
  );
};

// ---------- METHOD ----------
const Method: React.FC = () => {
  const steps = [{ n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' }, { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' }, { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' }];
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
    const id = 'calendly-widget-script';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.body.appendChild(s);
    // on laisse le script en place (réutilisable) — pas de cleanup destructif
  }, []);
  return (
    <section id="rendez-vous" className="px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:py-6">
            <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Rendez-vous</div></Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display leading-[0.88] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 6vw, 100px)' }}>
                Démarrons par un <span className="text-green">diagnostic gratuit.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-cream-soft">
                30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a href="mailto:contact@axem-ia.fr" className="mt-7 inline-flex items-center gap-2 text-base font-bold text-green transition hover:gap-3">contact@axem-ia.fr <span aria-hidden>→</span></a>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-wrap gap-2">
                <Pill>Certifié Qualiopi</Pill><Pill>Finançable OPCO</Pill><Pill>Sans engagement</Pill>
              </div>
            </Reveal>
          </div>

          {/* WIDGET CALENDLY INLINE */}
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-cream/12 bg-white">
              <div
                className="calendly-inline-widget"
                data-url={CALENDLY_URL}
                style={{ minWidth: 320, height: 700 }}
              />
              <noscript>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="block p-6 text-center text-ink">Réserver un créneau sur Calendly →</a>
              </noscript>
            </div>
          </Reveal>
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
          <ul className="space-y-2 text-sm text-cream-soft">{[['Prestations', '#prestations'], ['Catalogue', '#catalogue'], ['Cas clients', '#cas'], ['Le duo', '#duo'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href="#rendez-vous" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
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
        <Financement />
        <Cases />
        <Duo />
        <Method />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
