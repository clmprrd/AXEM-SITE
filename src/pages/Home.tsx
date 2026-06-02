import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
  useScroll, useInView, useReducedMotion, MotionConfig,
} from 'framer-motion';
// @ts-ignore — composant JS (React Bits / OGL)
import Grainient from '../components/Grainient';

// =====================================================================
// AXEM IA — PAGE PRODUCTION-READY · HERO « GRAINIENT VIF »
// Dark #0F0F0F · mint #00FA9A · Archivo · vouvoiement, punchy.
// Structure : Hero → Trust → Problème → Duo → Méthode →
//   BLOC 1 Formation → BLOC 2 Conseil → Cas clients → Pourquoi → CTA → Footer
// Effets dosés (transform/opacity/SVG only · whileInView once · reducedMotion).
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const NOTION_CASES = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const EMAIL = 'contact@axem-ia.fr';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// =====================================================================
// HERO BACKGROUND — Grainient « vif » : palette mint présente + lumineuse.
// color1 = mint clair (présent), color2 = émeraude saturée, color3 = teal profond
// (base saturée, pas quasi-noire → gradient lumineux, pas vaseux).
// =====================================================================
const HERO_PALETTE = { color1: '#7CFFD0', color2: '#00D88E', color3: '#1B5E66' } as const;
const GRAINIENT = {
  timeSpeed: 0.16, warpStrength: 1.0, warpFrequency: 5.0, warpSpeed: 1.8,
  warpAmplitude: 52.0, blendAngle: 0.0, blendSoftness: 0.06, rotationAmount: 480.0,
  noiseScale: 2.0, grainAmount: 0.1, grainScale: 1.5, grainAnimated: false,
  contrast: 1.42, gamma: 0.96, saturation: 1.18, zoom: 0.8,
} as const;

// ---------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay, ease }}
    className={className}>{children}</motion.div>
);

// Titre créatif — mask reveal mot-à-mot (le titre « se compose »)
const RiseWords: React.FC<{ text: string; className?: string; delay?: number; stagger?: number; greenLast?: boolean }> =
  ({ text, className = '', delay = 0, stagger = 0.07, greenLast = false }) => {
    const words = text.split(' ');
    return (
      <span className={className} aria-label={text}>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
            <motion.span
              className={`inline-block ${greenLast && i === words.length - 1 ? 'text-green' : ''}`}
              initial={{ y: '115%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.85, delay: delay + i * stagger, ease }}>
              {w}{i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </span>
    );
  };

// CTA magnétique (pointeur fin uniquement — désactivé en reduced motion)
const Magnetic: React.FC<any> = ({ children, strength = 0.3, className, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 14, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 14, mass: 0.5 });
  const reduce = useReducedMotion();
  const move = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.a ref={ref} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }} className={className} {...props}>{children}</motion.a>
  );
};

// Count-up — lisible même sans anim (valeur finale écrite si reducedMotion / hors-vue)
const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; className?: string }> =
  ({ value, prefix = '', suffix = '', className }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const [n, setN] = useState(0);
    const reduce = useReducedMotion();
    useEffect(() => {
      if (!inView) return;
      if (reduce) { setN(value); return; }
      const start = performance.now(); let raf = 0;
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / 1500);
        setN(Math.round((1 - Math.pow(1 - k, 3)) * value));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
    }, [inView, value, reduce]);
    const fmt = n >= 1000 ? n.toLocaleString('fr-FR') : String(n);
    return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
  };

// Carte avec spotlight curseur + glow de bordure (réutilisée prestations/formations)
const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(-200); const my = useMotionValue(-200);
  const [active, setActive] = useState(false);
  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - r.left); my.set(e.clientY - r.top);
  };
  const bg = useTransform(
    [mx, my],
    ([x, y]: number[]) => `radial-gradient(220px circle at ${x}px ${y}px, rgba(0,250,154,0.14), transparent 72%)`
  );
  return (
    <div
      ref={ref} onMouseMove={onMove}
      onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}
      className={`group relative overflow-hidden ${className}`}>
      {!reduce && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{ background: bg as any, opacity: active ? 1 : 0 }} />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// Barre de progression scroll (fine, en haut)
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  return (
    <motion.div aria-hidden style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-green" />
  );
};

// Logo « confiance » : image couleur sur carte blanche, sinon fallback nom net
const TrustLogo: React.FC<{ name: string; src?: string }> = ({ name, src }) => {
  const [err, setErr] = useState(false);
  return (
    <div className="flex h-20 items-center justify-center rounded-2xl border border-black/5 bg-white px-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)]">
      {src && !err ? (
        <img src={src} alt={name} loading="lazy" decoding="async" onError={() => setErr(true)}
          className="max-h-9 w-auto max-w-[150px] object-contain" />
      ) : (
        <span className="text-center font-display text-[15px] font-extrabold tracking-tight text-ink md:text-base">{name}</span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// NAV
// ---------------------------------------------------------------------
const NAV_LINKS: [string, string][] = [
  ['Formation', '#formation'], ['Conseil', '#conseil'],
  ['Le duo', '#duo'], ['Résultats', '#resultats'],
];
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > 24);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-2xl tracking-tighter text-cream" style={{ fontWeight: 900 }}>
          AXEM<span className="text-green">.</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-semibold uppercase tracking-[0.12em] text-cream-soft transition-colors hover:text-cream">
              {l}<span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
          className="group inline-flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-[13px] uppercase tracking-[0.06em] text-ink" style={{ fontWeight: 800 }}>
          Rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------------------------------------------------------------------
// HERO — Grainient vif · titre créatif (mask reveal) · scrim derrière texte
// ---------------------------------------------------------------------
const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-28 pt-32 md:px-8">
      {/* BACKGROUND — Grainient vif (mint présent) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0F0F0F]">
        <Grainient {...GRAINIENT} {...HERO_PALETTE} className="h-full w-full" />
      </div>
      {/* SCRIM derrière le texte (lisibilité) — le fond reste vif autour */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(62% 50% at 50% 44%, rgba(7,9,9,0.62) 0%, rgba(7,9,9,0.34) 42%, transparent 72%)' }} />
      {/* fondu bas vers le site + voile haut pour la nav */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[26%]"
        style={{ background: 'linear-gradient(180deg, transparent, #0F0F0F)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28"
        style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.5), transparent)' }} />

      {/* CONTENU */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* eyebrow retravaillé */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/25 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-70" />}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white md:text-[11px]">
              Agence d'IA <span className="text-green">×</span> organisme de formation Qualiopi
            </span>
          </div>
        </motion.div>

        {/* TITRE créatif : se compose mot à mot */}
        <h1 className="mt-7 font-display leading-[0.92] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]"
          style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.6vw, 90px)' }}>
          <RiseWords text="Votre partenaire IA," stagger={0.08} />
          <br />
          <span className="relative inline-block">
            <RiseWords text="de A à Z." delay={0.28} stagger={0.08} />
            <motion.span aria-hidden
              className="absolute -bottom-1 left-0 block h-[0.1em] rounded-full bg-green"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0, width: '100%' }}
              transition={{ duration: 0.7, delay: 0.85, ease }} />
          </span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease }}
          className="mt-7 max-w-2xl font-display text-xl font-bold leading-snug text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] md:text-2xl">
          On vous forme, on vous conseille, on déploie. <span className="text-green">Et on reste.</span>
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.82, ease }}
          className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/90 [text-shadow:0_1px_14px_rgba(0,0,0,0.45)] md:text-base">
          Agence spécialisée en IA générative et organisme de formation certifié Qualiopi. Nous accompagnons entreprises, administrations et particuliers : formation, conseil stratégique, audit et automatisation — pour déployer des solutions IA concrètes.
        </motion.p>

        {/* double CTA */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.94, ease }}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.32}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-ink shadow-[0_12px_44px_-12px_rgba(0,250,154,0.7)]" style={{ fontWeight: 900 }}>
            <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
            <span className="relative">Prendre rendez-vous</span>
            <span className="relative transition-transform group-hover:translate-x-1">→</span>
          </Magnetic>
          <a href="#formation" className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition hover:bg-white/15">
            Voir le catalogue <span aria-hidden>↓</span>
          </a>
        </motion.div>

        {/* badge preuve sociale duo (+55 000) avec les 2 avatars */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.06, ease }}
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/35 py-2 pl-2 pr-5 backdrop-blur-md">
          <div className="flex -space-x-2.5">
            <img src={CLEMENT_IMG} alt="Clément Predo" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/80" loading="lazy" />
            <img src={ALEXIS_IMG} alt="Alexis Zeitoun" className="h-8 w-8 rounded-full object-cover ring-2 ring-white/80" loading="lazy" />
          </div>
          <span className="text-sm font-semibold text-white">
            <span className="text-green">+55 000</span> abonnés LinkedIn nous suivent
          </span>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// TRUST — logos COULEUR sur cartes blanches · 2 groupes · TOUS visibles
// ---------------------------------------------------------------------
const Trust: React.FC = () => {
  const clients = [
    { name: 'Carrefour', src: '/logos/carrefour.svg' },
    { name: 'BlackFin Capital', src: '/logos/blackfin.png' },
    { name: 'Avantis', src: '/logos/avantis.png' },
    { name: 'KIT France', src: '/logos/kit.png' },
    { name: 'Espace 2', src: '/logos/espace2.png' },
    { name: 'Socos', src: '/logos/socos.png' },
    { name: 'Gravotech', src: '/logos/gravotech.png' },
  ];
  const organismes = [
    { name: 'myconnecting', src: '/logos/myconnecting.png' },
    { name: 'synapse ia' }, // fallback nom net (logo introuvable)
    { name: 'ASphere', src: '/logos/asphere.png' },
    { name: 'AI Sisters', src: '/logos/aisisters.svg' },
    { name: 'SENZA Formations', src: '/logos/senza.png' },
    { name: 'Cegos', src: '/logos/cegos.png' },
  ];
  return (
    <section id="references" className="relative border-y border-cream/10 bg-ink-2 px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-12 flex flex-col items-center gap-2 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-green">Ils nous font confiance</p>
            <p className="font-display text-2xl text-cream md:text-4xl" style={{ fontWeight: 800 }}>
              Des PME aux grands comptes <span className="text-cream-soft">&amp;</span> administrations.
            </p>
          </div>
        </Reveal>

        {/* CLIENTS */}
        <Reveal delay={0.05}>
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream-soft">Clients</span>
            <span className="h-px flex-1 bg-cream/12" />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {clients.map((l, i) => (
            <Reveal key={l.name} delay={Math.min(i, 6) * 0.04}><TrustLogo name={l.name} src={l.src} /></Reveal>
          ))}
        </div>

        {/* ORGANISMES */}
        <Reveal delay={0.05}>
          <div className="mb-3 mt-12 flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream-soft">Organismes de formation partenaires</span>
            <span className="h-px flex-1 bg-cream/12" />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {organismes.map((l, i) => (
            <Reveal key={l.name} delay={Math.min(i, 6) * 0.04}><TrustLogo name={l.name} src={l.src} /></Reveal>
          ))}
        </div>

        {/* QUALIOPI réel */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-2xl border border-cream/10 bg-ink p-6 sm:flex-row sm:gap-6">
            <div className="flex h-24 items-center justify-center rounded-xl bg-white px-7 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <img src="/logos/qualiopi.png" alt="Certification Qualiopi" className="max-h-16 w-auto object-contain" loading="lazy" />
            </div>
            <p className="max-w-md text-center text-sm leading-relaxed text-cream-soft sm:text-left">
              <span className="font-bold text-cream">Organisme certifié Qualiopi.</span> Nos formations sont finançables OPCO, avec prise en charge possible jusqu'à 100 %.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// PROBLÈME — 3 pièges
// ---------------------------------------------------------------------
const Problem: React.FC = () => {
  const traps = [
    { n: '01', t: 'Formations théoriques', d: "Vos équipes sont « sensibilisées »… mais reviennent au bureau sans rien changer. Pas opérationnelles." },
    { n: '02', t: 'Outils sans stratégie', d: "Des licences achetées, aucune feuille de route. L'IA reste un gadget que personne n'utilise vraiment." },
    { n: '03', t: 'Aucun suivi après coup', d: "Le consultant part, les anciennes habitudes reviennent. L'investissement s'évapore en quelques semaines." },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Pourquoi la plupart échouent</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.92] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(36px, 6.2vw, 96px)' }}>
            3 pièges qui font<br /><span className="outline-type">échouer l'IA.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {traps.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-cream/12 bg-ink-2 p-7 md:p-8">
                <span className="font-display text-5xl text-cream/20 md:text-6xl" style={{ fontWeight: 900 }}>{p.n}</span>
                <h3 className="font-display text-xl text-cream md:text-2xl" style={{ fontWeight: 800 }}>{p.t}</h3>
                <p className="text-sm leading-relaxed text-cream-soft md:text-[15px]">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-12 max-w-2xl font-display text-2xl leading-snug text-cream md:text-3xl" style={{ fontWeight: 700 }}>
            La réponse d'AXEM : un parcours complet, <span className="text-green">pas une intervention isolée.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// DUO (remonté tôt) — hover-reveal
// ---------------------------------------------------------------------
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit & stratégie. 3 ans de terrain.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Les fondateurs</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 120px)' }}>
            Deux experts,<br /><span className="text-green">un seul interlocuteur.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl text-lg text-cream-soft md:text-xl">
            Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez directement à ceux qui livrent. Ensemble, <span className="font-bold text-cream">+55 000 abonnés LinkedIn</span>.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-cream/12 bg-ink transition-colors hover:border-green/40">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  {/* hover-reveal : voile + LinkedIn qui apparaît */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <a href={f.li} target="_blank" rel="noopener noreferrer"
                    className="absolute right-5 top-5 flex h-11 w-11 translate-y-1 items-center justify-center rounded-xl bg-green text-ink opacity-0 shadow-lg transition-all duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
                    aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-7 md:p-9">
                  <div>
                    <h3 className="font-display text-3xl text-cream tighter md:text-4xl" style={{ fontWeight: 900 }}>{f.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-green">{f.school}</p>
                    <p className="text-sm text-cream-soft">{f.role}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-cream-soft">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-cream/12 pt-5">
                    <span className="font-display text-5xl text-cream" style={{ fontWeight: 900 }}><Counter value={f.n} prefix="+" /></span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// MÉTHODE — « En 3 étapes. Pas une de plus. » · trait qui se dessine
// ---------------------------------------------------------------------
const Method: React.FC = () => {
  const steps = [
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  return (
    <section id="methode" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.4vw, 120px)' }}>
            En 3 étapes.<br /><span className="text-green">Pas une de plus.</span>
          </h2>
        </Reveal>

        {/* trait qui se dessine (desktop) */}
        <div className="relative mt-16">
          <svg aria-hidden className="absolute left-0 top-9 hidden h-2 w-full md:block" viewBox="0 0 100 2" preserveAspectRatio="none">
            <motion.line x1="2" y1="1" x2="98" y2="1" stroke="#00FA9A" strokeWidth="0.4" strokeLinecap="round"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, ease }} />
          </svg>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div className="group flex h-full flex-col gap-4 rounded-2xl border border-cream/12 bg-ink-2 p-7 transition-colors hover:bg-ink-3 md:p-9">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-6xl text-cream transition-colors group-hover:text-green tighter md:text-7xl" style={{ fontWeight: 900 }}>{s.n}</span>
                    <span className="rounded-full bg-green px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink" style={{ fontWeight: 900 }}>{s.meta}</span>
                  </div>
                  <h3 className="font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>{s.t}</h3>
                  <p className="text-[15px] leading-relaxed text-cream-soft">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// BLOC 1 — FORMATION : catalogue 10 formations filtrable + fiche détail
// ---------------------------------------------------------------------
type Formation = {
  code: string; t: string; niveau: string; duree: string; prix: string;
  tag: string; desc: string;
  programme: string[]; outils: string; livrables: string;
};
const LEVELS = ['Tous', 'Socle', 'Métiers', 'Automatisation', 'Transversal', 'Production'] as const;
const FORMATIONS: Formation[] = [
  { code: 'F01', t: 'IA Essentielle', niveau: 'Socle', duree: '1 J', prix: '300 €', tag: 'De zéro à opérationnel en 1 journée.',
    desc: "Comprendre l'IA sans jargon et repartir avec un plan d'action concret dès le lendemain.",
    programme: ['Matin · Comment fonctionne un LLM (sans jargon), RGPD, identifier ses cas d\'usage métier', 'Après-midi · Prompt Engineering (structure RACF), 15 exercices sur cas réels, plan d\'action J+1'],
    outils: 'Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash · Perplexity', livrables: 'Guide 50 Prompts par Métier · Charte d\'usage IA · Fiche 3 Quick Wins J+1' },
  { code: 'F02', t: 'Prompt Engineering Pro', niveau: 'Socle', duree: '½ J', prix: '200 €', tag: 'Multiplier par 5 la qualité de ses outputs IA.',
    desc: "Techniques avancées et bibliothèque de prompts d'équipe construite en live.",
    programme: ['Few-shot, Chain-of-Thought, Tree-of-Thought, Meta-prompting', '20 exercices chronométrés sur cas réels · bibliothèque Notion en live · 5 prompts signature'],
    outils: 'Claude Opus 4.6 · GPT-5.2 · Gemini 3.1 Pro', livrables: 'Template Bibliothèque Prompts Notion · Fiche mémo Techniques Avancées' },
  { code: 'F03', t: 'Maîtriser Claude', niveau: 'Socle', duree: '1 J', prix: '450 €', tag: "Devenir expert de l'IA qui pèse 70 % du Fortune 100.",
    desc: "Des bases solides au niveau expert : Skills, MCP, Cowork & Sub-agents.",
    programme: ['Matin · Claude vs ChatGPT vs Gemini, modèles Sonnet/Opus 4.6, Projects, Artifacts, Computer Use', 'Après-midi · Claude Skills, MCP, Cowork & Sub-agents, atelier 3 Skills'],
    outils: 'Claude Opus 4.6 · Sonnet 4.6 · Skills · MCP · Cowork', livrables: 'Pack 10 Skills Axem · Guide Claude Power User · Charte d\'usage Claude' },
  { code: 'F04', t: 'IA pour tous les métiers', niveau: 'Métiers', duree: '1 J', prix: '400 €', tag: '1 journée, 8 modules au choix (vous en choisissez 2-3).',
    desc: "Modules combinables : Direction, Marketing, RH, Finance, Juridique, Service Client, Social, Créatif.",
    programme: ['8 modules : Direction & Stratégie · Marketing & Commercial · RH & Recrutement · Finance & Compta', 'Juridique & Compliance · Service Client · Réseaux Sociaux & Brand · Créatif & Design'],
    outils: 'Contenus 2026, modules combinables selon vos métiers', livrables: 'Kit par métier · prompts sectoriels validés' },
  { code: 'F05', t: 'No-Code & Workflows', niveau: 'Automatisation', duree: '2 J', prix: '800 €', tag: 'Des workflows qui tournent seuls, 7j/7 — sans coder.',
    desc: "Make & n8n de A à Z, avec un workflow déployé en production dès le 2e jour.",
    programme: ['J1 · Make & n8n (3 automatisations live), 1 workflow déployé avant 18h', 'J2 · Intégrer Claude/GPT/Gemini, conditions/erreurs/boucles, projet final en prod'],
    outils: 'Make · n8n · Claude Sonnet 4.6 · GPT-5.2 · Gemini 3 Flash', livrables: '10 templates Make & n8n prêts à cloner · Guide Connecter 50 outils' },
  { code: 'F06', t: 'Agent IA sur-mesure', niveau: 'Automatisation', duree: '2 J', prix: '1 250 €', tag: 'Un travailleur autonome qui agit seul, 24h/24.',
    desc: "Architecture & déploiement d'agents IA (prérequis : F05 ou pratique API).",
    programme: ['J1 · Architecture LLM + Mémoire + Outils + Planification, frameworks, RAG, MCP', 'J2 · 3 patterns business (Support 24/7, SDR, Admin), Skills, validation/monitoring/RGPD'],
    outils: 'Claude Opus 4.6 · GPT-5.2 · n8n Agents · CrewAI · LangGraph · Pinecone · MCP', livrables: 'Template Agent IA · Guide 6 Architectures d\'Agents · Checklist sécurité' },
  { code: 'F07', t: 'Vibe Coding & Claude Code', niveau: 'Automatisation', duree: '1 J', prix: '450 €', tag: "Construire des outils sans coder, avec l'IA comme binôme.",
    desc: "De l'app web en 1h à Cursor & Claude Code : générer, tester, déployer.",
    programme: ['Matin · Lovable/Bolt.new/v0 (app web en 1h), vibe coding structuré, micro-outil métier', 'Après-midi · Cursor IDE, Claude Code (CLI), workflows, sécurité & gouvernance'],
    outils: 'Cursor · Claude Code · Lovable · Bolt.new · v0 · GitHub Copilot', livrables: 'Pack Prompts Vibe Coding · Guide Cursor & Claude Code · 3 mini-apps livrées' },
  { code: 'F08', t: 'Gouvernance & AI Act', niveau: 'Transversal', duree: '½ J', prix: '250 €', tag: 'Cadrer ses usages IA en conformité.',
    desc: "Pour Direction, DPO, DSI, RH, Juristes : AI Act 2026, RGPD, charte & traçabilité.",
    programme: ['AI Act 2026 (interdit/obligatoire), RGPD & IA (serveurs US OpenAI/Anthropic)', 'Construire sa charte IA + traçabilité, 5 cas pratiques live, matrice de risques'],
    outils: 'AI Act 2026 · CNIL · Frameworks RGPD', livrables: 'Template Charte IA · Matrice de risques · Plan de conformité 90 jours' },
  { code: 'F09', t: 'Veille IA', niveau: 'Transversal', duree: '2 h', prix: '80 € · 320 €/an', tag: 'Rester à jour sur un champ qui bouge tous les mois.',
    desc: "2h pour les 10 avancées majeures + une méthode de veille perso 20 min/semaine.",
    programme: ['10 avancées IA majeures (démos live), méthode de veille perso 20 min/semaine', 'Horizon 12-24 mois, modulable selon métier · abonnement annuel : 4 sessions/an'],
    outils: 'Perplexity · Claude · Veille IA Axem · Newsletters', livrables: 'Template Notion Veille IA · 30 sources curées · Replays' },
  { code: 'F10', t: 'Création IA — Visuel · Vidéo · Voix', niveau: 'Production', duree: '1 J', prix: '400 €', tag: 'Produire 10× plus vite, à coût maîtrisé.',
    desc: "Images, vidéos et voix : de Midjourney à Synthesia, ElevenLabs et le repurposing.",
    programme: ['Matin · Images (Midjourney V7, DALL-E 4, Firefly 3, Nano Banana Pro), logos, infographies, sites 1h', 'Après-midi · Vidéo & voix (Synthesia, ElevenLabs, Kling/Sora/Veo), repurposing 1 contenu = 8 formats'],
    outils: 'Midjourney · Synthesia · ElevenLabs · Kling · Sora · Veo · CapCut', livrables: 'Guide 30 Outils Créatifs IA 2026 · Pack 50 Prompts Midjourney · Templates Gamma' },
];
const LEVEL_DOT: Record<string, string> = { Socle: '#00FA9A', Métiers: '#7DE3FF', Automatisation: '#FFD27A', Transversal: '#C9A8FF', Production: '#FF8FB0' };

const FormationDetail: React.FC<{ f: Formation; onClose: () => void }> = ({ f, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div role="dialog" aria-modal="true" aria-label={`${f.code} — ${f.t}`}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.3, ease }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-cream/12 bg-ink-2 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-cream/10 p-6 md:p-8">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-ink">{f.code}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-cream-soft">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: LEVEL_DOT[f.niveau] }} />{f.niveau}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cream-soft">{f.duree}</span>
            </div>
            <h3 className="font-display text-2xl text-cream tighter md:text-3xl" style={{ fontWeight: 900 }}>{f.t}</h3>
            <p className="mt-1 text-sm italic text-green">« {f.tag} »</p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="shrink-0 rounded-full border border-cream/15 p-2 text-cream-soft transition hover:bg-cream/10 hover:text-cream">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
          <p className="text-[15px] leading-relaxed text-cream-soft">{f.desc}</p>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-green">Programme</p>
            <ul className="space-y-2">
              {f.programme.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-cream-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />{p}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-green">Outils</p>
              <p className="text-sm leading-relaxed text-cream-soft">{f.outils}</p>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-green">Livrables</p>
              <p className="text-sm leading-relaxed text-cream-soft">{f.livrables}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream/10 p-6 sm:flex-row md:px-8">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-cream" style={{ fontWeight: 900 }}>{f.prix}</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-cream-soft">HT / participant</span>
          </div>
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green px-6 py-3 text-sm uppercase tracking-[0.04em] text-ink sm:w-auto" style={{ fontWeight: 900 }}>
            Réserver cette formation →
          </Magnetic>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FormationBlock: React.FC = () => {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('Tous');
  const [open, setOpen] = useState<Formation | null>(null);
  const filtered = level === 'Tous' ? FORMATIONS : FORMATIONS.filter((f) => f.niveau === level);
  return (
    <section id="formation" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green">
            <span className="rounded bg-green px-2 py-0.5 text-ink" style={{ fontWeight: 900 }}>Bloc 1</span> Organisme de formation Qualiopi
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 116px)' }}>
            10 formations.<br /><span className="text-green">70 % de pratique.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-cream-soft md:text-base">
            Construites de A à Z selon vos besoins et vos cas d'usage. Inter ou intra, modulables en parcours et bootcamps. Tarifs HT par participant : <span className="font-bold text-cream">200 € – 1 250 €</span>.
          </p>
        </Reveal>

        {/* filtre par niveau */}
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-wrap gap-2">
            {LEVELS.map((lv) => (
              <button key={lv} type="button" onClick={() => setLevel(lv)}
                className={`rounded-full border px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition ${level === lv ? 'border-green bg-green text-ink' : 'border-cream/15 text-cream-soft hover:border-cream/35 hover:text-cream'}`}>
                {lv}
              </button>
            ))}
          </div>
        </Reveal>

        {/* grille catalogue */}
        <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((f, i) => (
              <motion.div key={f.code} layout
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04, ease }}>
                <SpotlightCard className="h-full rounded-2xl border border-cream/12 bg-ink transition-colors hover:border-green/40">
                  <button type="button" onClick={() => setOpen(f)} className="flex h-full w-full flex-col items-start gap-3 p-6 text-left">
                    <div className="flex w-full items-center justify-between">
                      <span className="font-display text-sm text-cream-soft" style={{ fontWeight: 800 }}>{f.code}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-cream-soft">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: LEVEL_DOT[f.niveau] }} />{f.niveau}
                      </span>
                    </div>
                    <h3 className="font-display text-xl leading-tight text-cream transition-colors group-hover:text-green md:text-2xl" style={{ fontWeight: 800 }}>{f.t}</h3>
                    <p className="text-sm leading-relaxed text-cream-soft">{f.tag}</p>
                    <div className="mt-auto flex w-full items-center justify-between pt-3">
                      <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-cream-soft">{f.duree} · {f.prix}</span>
                      <span className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.08em] text-green">Détails <span className="transition-transform group-hover:translate-x-0.5">→</span></span>
                    </div>
                  </button>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* formats complémentaires : Coaching · Bootcamps · Vidéos */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { t: 'Coaching individuel', d: "Pour vos profils clés — managers, dirigeants, référents IA. 1 session/semaine, avec Clément ou Alexis.", price: '200 € / session (1h)' },
            { t: 'Bootcamps immersifs', d: "Format intensif sur-mesure (3 jours + extension). 90 % de pratique sur vos données, livrables concrets.", price: 'Sur devis' },
            { t: 'Formations vidéos', d: "Masterclass 24/7 — 40-45 vidéos HD, templates, prompts sectoriels. Idéal onboarding nouvelle recrue.", price: 'Sur devis' },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-2 rounded-2xl border border-cream/12 bg-ink p-6">
                <h3 className="font-display text-lg text-cream md:text-xl" style={{ fontWeight: 800 }}>{c.t}</h3>
                <p className="text-sm leading-relaxed text-cream-soft">{c.d}</p>
                <span className="mt-auto pt-3 text-[12px] font-bold uppercase tracking-[0.1em] text-green">{c.price}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FINANCEMENT — OPCO + Qualiopi (3 étapes) */}
        <Reveal delay={0.06}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-cream/12 bg-ink">
            <div className="grid gap-8 p-7 md:grid-cols-[auto_1fr] md:items-center md:p-10">
              <div className="flex items-center justify-center rounded-2xl bg-white px-8 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <img src="/logos/qualiopi-full.png" alt="Qualiopi — Actions de formation" className="h-20 w-auto max-w-[180px] object-contain md:h-24" loading="lazy" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-green">Financement</p>
                <h3 className="mt-1 font-display text-2xl text-cream tight md:text-3xl" style={{ fontWeight: 800 }}>Formations finançables OPCO.</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-soft md:text-[15px]">
                  Organisme certifié Qualiopi : prise en charge possible jusqu'à 100 %, interlocuteur unique côté AXEM, démarches simplifiées.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 formations les plus rentables.' },
                    { n: '02', t: 'Devis & dossier OPCO', d: 'Proposition sous 48h, prise en charge OPCO, démarches simplifiées.' },
                    { n: '03', t: 'Formation', d: 'Équipes opérationnelles dès J+1, livrables concrets, suivi post-formation.' },
                  ].map((s) => (
                    <div key={s.n} className="rounded-xl border border-cream/10 bg-ink-2 p-4">
                      <span className="font-display text-lg text-green" style={{ fontWeight: 900 }}>{s.n}</span>
                      <p className="mt-1 text-sm font-bold text-cream">{s.t}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-cream-soft">{s.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>{open && <FormationDetail f={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
};

// ---------------------------------------------------------------------
// BLOC 2 — CONSEIL & DÉPLOIEMENT (séparé)
// ---------------------------------------------------------------------
const ConseilBlock: React.FC = () => {
  const items = [
    { n: '01', t: 'Audit IA', d: "On regarde avant de déployer. Cartographie des process, scoring de maturité IA, roadmap priorisée.", price: '1 semaine' },
    { n: '02', t: 'Conseil stratégique', d: "On décide quoi faire, dans quel ordre, avec quels budgets. Choix des outils, architecture, pilotage.", price: 'Sur devis' },
    { n: '03', t: 'Déploiement & automatisation', d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main (A) ou suivi (B).", price: 'A · 1 200-2 000 € · B · 900 € + 80 €/mois' },
    { n: '04', t: 'Production IA', d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite.", price: 'Sur devis' },
    { n: '05', t: 'Suivi', d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.", price: '80 € / mois' },
  ];
  return (
    <section id="conseil" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green">
            <span className="rounded bg-green px-2 py-0.5 text-ink" style={{ fontWeight: 900 }}>Bloc 2</span> Agence · Conseil & déploiement
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 116px)' }}>
            De l'audit<br /><span className="outline-green">à l'autonomie.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-cream-soft md:text-base">
            Quand la formation ne suffit pas : on conçoit, on déploie et on maintient vos solutions IA. Un seul interlocuteur, du diagnostic à la production.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={Math.min(i, 5) * 0.06}>
              <SpotlightCard className="h-full rounded-2xl border border-cream/12 bg-ink-2 transition-colors hover:border-green/40">
                <div className="flex h-full flex-col gap-3 p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl text-cream/20 md:text-5xl" style={{ fontWeight: 900 }}>{s.n}</span>
                  </div>
                  <h3 className="font-display text-xl text-cream transition-colors group-hover:text-green md:text-2xl" style={{ fontWeight: 800 }}>{s.t}</h3>
                  <p className="text-sm leading-relaxed text-cream-soft">{s.d}</p>
                  <span className="mt-auto pt-3 text-[12px] font-bold uppercase tracking-[0.1em] text-green">{s.price}</span>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// CAS CLIENTS — count-up · lien Notion réel
// ---------------------------------------------------------------------
const Cases: React.FC = () => {
  const stats = [
    { v: 80, s: ' %', l: 'temps de saisie économisé (BTP · chiffrage)' },
    { v: 4, p: '×', l: 'plus rapide (administration · OCR)' },
    { v: 100, s: ' %', l: 'de fiabilité (double vérification OCR/IA)' },
    { v: 317, s: ' h', l: 'libérées / mois (conformité ADV)' },
  ];
  const stats2 = [
    { v: 98, p: '>', s: ' %', l: "d'anomalies détectées" },
    { v: 95, s: ' k€', l: 'de charge annuelle neutralisée' },
  ];
  return (
    <section id="resultats" className="border-y border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Cas clients</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 120px)' }}>
            Des résultats.<br /><span className="outline-green">Pas des slides.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-cream-soft md:text-base">5 missions, 5 secteurs, des résultats mesurés.</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="group cursor-default">
                <div className="font-display leading-[0.85] text-cream transition-colors group-hover:text-green tighter" style={{ fontWeight: 900, fontSize: 'clamp(44px, 6vw, 96px)' }}>
                  <Counter value={s.v} prefix={(s as any).p || ''} suffix={s.s || ''} />
                </div>
                <div className="mt-3 text-[13px] font-semibold leading-snug text-cream-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-cream/12 pt-10 sm:max-w-md">
          {stats2.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="group cursor-default">
                <div className="font-display leading-[0.85] text-cream transition-colors group-hover:text-green tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 5vw, 80px)' }}>
                  <Counter value={s.v} prefix={(s as any).p || ''} suffix={s.s || ''} />
                </div>
                <div className="mt-3 text-[13px] font-semibold leading-snug text-cream-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <a href={NOTION_CASES} target="_blank" rel="noopener noreferrer"
            className="group mt-14 inline-flex items-center gap-2.5 rounded-full border border-green/40 bg-green/10 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-green transition hover:bg-green hover:text-ink">
            Voir tous les cas clients en détail
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// POURQUOI AXEM — 5 raisons
// ---------------------------------------------------------------------
const Why: React.FC = () => {
  const reasons = [
    { n: '01', t: 'Partenaire sur la durée', d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff." },
    { n: '02', t: '70 % de pratique minimum', d: "Opérationnel dès J+1. Chaque formation produit un livrable réel." },
    { n: '03', t: 'Résultats mesurés', d: "ROI documenté. Des livrables concrets, pas des slides." },
    { n: '04', t: 'Toujours à jour', d: "Outils & méthodes 2025/2026. Un champ qui bouge tous les mois." },
    { n: '05', t: 'Un seul interlocuteur', d: "Du diagnostic au déploiement. Vous parlez à ceux qui livrent." },
  ];
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Pourquoi AXEM</div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 116px)' }}>
            5 raisons<br /><span className="text-green">de nous choisir.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.n} delay={Math.min(i, 5) * 0.06}>
              <div className="flex h-full flex-col gap-2.5 rounded-2xl border border-cream/12 bg-ink-2 p-7">
                <span className="font-display text-3xl text-green" style={{ fontWeight: 900 }}>{r.n}</span>
                <h3 className="font-display text-lg text-cream md:text-xl" style={{ fontWeight: 800 }}>{r.t}</h3>
                <p className="text-sm leading-relaxed text-cream-soft md:text-[15px]">{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-10 text-sm text-cream-dim">
            Outils maîtrisés : OpenAI · Claude / Anthropic · Gemini · Mistral · Meta · DeepSeek · n8n · Make.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// CTA FINALE — widget Calendly inline
// ---------------------------------------------------------------------
const FinalCTA: React.FC = () => {
  useEffect(() => {
    const id = 'calendly-widget-js';
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id; s.src = 'https://assets.calendly.com/assets/external/widget.js'; s.async = true;
    document.body.appendChild(s);
    // on ne retire pas le script au démontage : la page est mono-route
  }, []);
  return (
    <section id="rdv" className="border-t border-cream/10 bg-ink-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <Reveal><div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-green"><span className="h-1.5 w-1.5 bg-green" />Rendez-vous</div></Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display leading-[0.9] text-cream tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 6vw, 96px)' }}>
                Démarrons par un<br /><span className="text-green">diagnostic gratuit.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-7 max-w-md text-lg text-cream-soft">
                30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a href={`mailto:${EMAIL}`} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-cream transition hover:text-green">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {EMAIL}
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-2xl border border-cream/12 bg-ink">
              <div className="calendly-inline-widget" data-url={CALENDLY_EMBED} style={{ minWidth: 320, height: 700 }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------
const Footer: React.FC = () => (
  <footer className="bg-ink px-5 py-16 md:px-8">
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
          <ul className="space-y-2 text-sm text-cream-soft">
            {[['Formation', '#formation'], ['Conseil', '#conseil'], ['Le duo', '#duo'], ['Résultats', '#resultats'], ['Rendez-vous', '#rdv']].map(([l, h]) => (
              <li key={l}><a href={h} className="transition-colors hover:text-cream">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
          <ul className="space-y-2 text-sm text-cream-soft">
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">Prendre rendez-vous</a></li>
            <li><a href={`mailto:${EMAIL}`} className="transition-colors hover:text-cream">{EMAIL}</a></li>
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

// ---------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------
const Home: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-ink">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Problem />
        <Duo />
        <Method />
        <FormationBlock />
        <ConseilBlock />
        <Cases />
        <Why />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);

export default Home;
