import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useScroll, useInView, useReducedMotion, MotionConfig,
} from 'framer-motion';

// =====================================================================
// AXEM IA — PAGE PRODUCTION-READY · VIBE « VIBRANT / PLAYFUL »
// Crème #FFFCF5 · texte #161616 · blocs de couleur alternés
// mint #00FA9A · corail #FF6B4A · violet #7C5CFF · jaune #FFD23F
// Hanken Grotesque · coins très arrondis, pills, stickers, rotations légères.
// Structure & contenu INCHANGÉS : Hero → Trust → Problème → Duo → Méthode →
//   BLOC 1 Formation → BLOC 2 Conseil → Cas clients → Pourquoi → CTA → Footer
// Effets springy/bouncy doux (transform/opacity only · whileInView once · reducedMotion).
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CALENDLY_EMBED = 'https://calendly.com/clem-pred/30min?hide_gdpr_banner=1';
const NOTION_CASES = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const EMAIL = 'contact@axem-ia.fr';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: 'spring' as const, stiffness: 260, damping: 18, mass: 0.7 };

// ---------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay, ease }}
    className={className}>{children}</motion.div>
);

// Titre créatif — mask reveal mot-à-mot piloté en CSS (compositor, jamais throttlé,
// fill-mode forwards → le mot finit toujours visible, même en reduced-motion).
const RiseWords: React.FC<{ text: string; className?: string; delay?: number; stagger?: number; greenLast?: boolean }> =
  ({ text, className = '', delay = 0, stagger = 0.07, greenLast = false }) => {
    const words = text.split(' ');
    return (
      <span className={className} aria-label={text}>
        {words.map((w, i) => (
          <span key={i} className={`inline-block overflow-hidden align-bottom ${i < words.length - 1 ? 'mr-[0.24em]' : ''}`} aria-hidden>
            <span
              className={`riseword ${greenLast && i === words.length - 1 ? 'text-green' : ''}`}
              style={{ animationDelay: `${delay + i * stagger}s` }}>
              {w}
            </span>
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

// Barre de progression scroll (arrondie, dégradé joyeux, en haut)
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  return (
    <motion.div aria-hidden style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[4px] origin-left rounded-full bg-gradient-to-r from-mint via-violet to-coral" />
  );
};

// Logo « confiance » : image couleur sur carte blanche arrondie, sinon fallback nom net
const TrustLogo: React.FC<{ name: string; src?: string }> = ({ name, src }) => {
  const [err, setErr] = useState(false);
  return (
    <motion.div whileHover={{ y: -4, rotate: -1.5 }} transition={spring}
      className="flex h-20 items-center justify-center rounded-3xl border-2 border-ink/5 bg-white px-5 shadow-soft">
      {src && !err ? (
        <img src={src} alt={name} loading="lazy" decoding="async" onError={() => setErr(true)}
          className="max-h-9 w-auto max-w-[150px] object-contain" />
      ) : (
        <span className="text-center font-display text-[15px] font-extrabold tracking-tight text-ink md:text-base">{name}</span>
      )}
    </motion.div>
  );
};

// Pastille « sticker » (badge ludique)
const Sticker: React.FC<{ children: React.ReactNode; color?: string; className?: string; rotate?: number }> =
  ({ children, color = 'bg-yellow', className = '', rotate = -3 }) => (
    <span style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-flex items-center gap-1.5 rounded-full ${color} px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink shadow-soft ${className}`}>
      {children}
    </span>
  );

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
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 md:px-6 ${s ? 'border-2 border-ink/8 bg-white/85 shadow-soft backdrop-blur-xl' : 'border-2 border-transparent'}`}>
        <a href="#top" className="font-display text-2xl tracking-tighter text-ink" style={{ fontWeight: 900 }}>
          AXEM<span className="text-coral">.</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-bold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-ink">
              {l}<span className="absolute -bottom-1.5 left-0 h-[3px] w-0 rounded-full bg-violet transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
          className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[13px] uppercase tracking-[0.04em] text-cream shadow-soft transition-transform hover:scale-[1.03]" style={{ fontWeight: 800 }}>
          Rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------------------------------------------------------------------
// HERO — fond crème + blobs doux colorés · titre friendly · duo en ronds
// ---------------------------------------------------------------------
const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-cream px-5 pb-24 pt-32 md:px-8">
      {/* BLOBS doux colorés */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className={`absolute -left-24 top-10 h-80 w-80 rounded-full bg-mint/45 blur-3xl ${reduce ? '' : 'floaty'}`} />
        <div className={`absolute -right-20 top-32 h-96 w-96 rounded-full bg-violet/35 blur-3xl ${reduce ? '' : 'floaty'}`} style={{ animationDelay: '1.5s' }} />
        <div className={`absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-coral/30 blur-3xl ${reduce ? '' : 'floaty'}`} style={{ animationDelay: '3s' }} />
        <div className={`absolute -bottom-10 right-1/4 h-72 w-72 rounded-full bg-yellow/40 blur-3xl ${reduce ? '' : 'floaty'}`} style={{ animationDelay: '2.2s' }} />
      </div>
      {/* léger voile crème pour garder le texte ultra lisible */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(70% 55% at 50% 46%, rgba(255,252,245,0.55) 0%, rgba(255,252,245,0.15) 50%, transparent 78%)' }} />

      {/* CONTENU */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* eyebrow façon pill colorée */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-ink/10 bg-white px-4 py-1.5 shadow-soft">
            <span className="relative flex h-2.5 w-2.5">
              {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70" />}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink md:text-[11px]">
              Agence d'IA <span className="text-violet">×</span> organisme de formation Qualiopi
            </span>
          </div>
        </motion.div>

        {/* TITRE créatif : se compose mot à mot */}
        <h1 className="mt-7 font-display leading-[0.95] tracking-tight text-ink"
          style={{ fontWeight: 900, fontSize: 'clamp(42px, 7.8vw, 92px)' }}>
          <RiseWords text="Votre partenaire IA," stagger={0.08} />
          <br />
          <span className="relative inline-block">
            <RiseWords text="de A à Z." delay={0.28} stagger={0.08} />
            <motion.span aria-hidden
              className="absolute -bottom-1 left-0 block h-[0.14em] rounded-full bg-coral"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0, width: '100%' }}
              transition={{ duration: 0.7, delay: 0.85, ease }} />
          </span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease }}
          className="mt-7 max-w-2xl font-display text-xl font-extrabold leading-snug text-ink md:text-2xl">
          On vous forme, on vous conseille, on déploie. <span className="rounded-lg bg-yellow px-1.5 text-ink">Et on reste.</span>
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.82, ease }}
          className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-base">
          Agence spécialisée en IA générative et organisme de formation certifié Qualiopi. Nous accompagnons entreprises, administrations et particuliers : formation, conseil stratégique, audit et automatisation — pour déployer des solutions IA concrètes.
        </motion.p>

        {/* double CTA */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.94, ease }}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.32}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-8 py-4 text-[15px] uppercase tracking-[0.03em] text-cream shadow-soft transition-transform hover:scale-[1.03]" style={{ fontWeight: 900 }}>
            <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <svg className="relative h-5 w-5 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
            <span className="relative">Prendre rendez-vous</span>
            <span className="relative transition-transform group-hover:translate-x-1">→</span>
          </Magnetic>
          <a href="#formation" className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white px-7 py-4 text-sm font-extrabold uppercase tracking-[0.06em] text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-ink/30">
            Voir le catalogue <span aria-hidden>↓</span>
          </a>
        </motion.div>

        {/* badge preuve sociale duo (+55 000) avec les 2 avatars en ronds avec rings colorés */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.06, ease }}
          className="mt-10 inline-flex items-center gap-3 rounded-full border-2 border-ink/10 bg-white py-2 pl-2 pr-5 shadow-soft">
          <div className="flex -space-x-2.5">
            <img src={CLEMENT_IMG} alt="Clément Predo" className="h-9 w-9 rounded-full object-cover ring-[3px] ring-mint" loading="lazy" />
            <img src={ALEXIS_IMG} alt="Alexis Zeitoun" className="h-9 w-9 rounded-full object-cover ring-[3px] ring-violet" loading="lazy" />
          </div>
          <span className="text-sm font-bold text-ink">
            <span className="text-coral">+55 000</span> abonnés LinkedIn nous suivent
          </span>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// TRUST — logos COULEUR sur cartes blanches arrondies · 2 groupes · TOUS visibles
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
    <section id="references" className="relative bg-cream-2 px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <Sticker color="bg-mint" rotate={-2}>Ils nous font confiance</Sticker>
            <p className="font-display text-2xl text-ink md:text-4xl" style={{ fontWeight: 800 }}>
              Des PME aux grands comptes <span className="text-ink-dim">&amp;</span> administrations.
            </p>
          </div>
        </Reveal>

        {/* CLIENTS */}
        <Reveal delay={0.05}>
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-soft">Clients</span>
            <span className="h-[2px] flex-1 rounded-full bg-ink/8" />
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
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-soft">Organismes de formation partenaires</span>
            <span className="h-[2px] flex-1 rounded-full bg-ink/8" />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {organismes.map((l, i) => (
            <Reveal key={l.name} delay={Math.min(i, 6) * 0.04}><TrustLogo name={l.name} src={l.src} /></Reveal>
          ))}
        </div>

        {/* QUALIOPI réel */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-4xl border-2 border-ink/8 bg-white p-6 shadow-soft sm:flex-row sm:gap-6">
            <div className="flex h-24 items-center justify-center rounded-3xl bg-cream-2 px-7 py-3">
              <img src="/logos/qualiopi.png" alt="Certification Qualiopi" className="max-h-16 w-auto object-contain" loading="lazy" />
            </div>
            <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft sm:text-left">
              <span className="font-extrabold text-ink">Organisme certifié Qualiopi.</span> Nos formations sont finançables OPCO, avec prise en charge possible jusqu'à 100 %.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// PROBLÈME — 3 pièges (bloc corail plein)
// ---------------------------------------------------------------------
const Problem: React.FC = () => {
  const traps = [
    { n: '01', t: 'Formations théoriques', d: "Vos équipes sont « sensibilisées »… mais reviennent au bureau sans rien changer. Pas opérationnelles." },
    { n: '02', t: 'Outils sans stratégie', d: "Des licences achetées, aucune feuille de route. L'IA reste un gadget que personne n'utilise vraiment." },
    { n: '03', t: 'Aucun suivi après coup', d: "Le consultant part, les anciennes habitudes reviennent. L'investissement s'évapore en quelques semaines." },
  ];
  return (
    <section className="px-3 py-10 md:px-5 md:py-14">
      <div className="mx-auto max-w-[1400px] rounded-[2.5rem] bg-coral px-5 py-20 shadow-coral md:px-12 md:py-28">
        <Reveal><div className="mb-5"><Sticker color="bg-white" rotate={-3}>Pourquoi la plupart échouent</Sticker></div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.95] text-white tighter" style={{ fontWeight: 900, fontSize: 'clamp(36px, 6.2vw, 92px)' }}>
            3 pièges qui font<br /><span className="rounded-2xl bg-ink px-3 text-coral">échouer l'IA.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {traps.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }} transition={spring}
                className="flex h-full flex-col gap-3 rounded-4xl bg-white p-7 shadow-soft md:p-8">
                <span className="font-display text-5xl text-coral/30 md:text-6xl" style={{ fontWeight: 900 }}>{p.n}</span>
                <h3 className="font-display text-xl text-ink md:text-2xl" style={{ fontWeight: 800 }}>{p.t}</h3>
                <p className="text-sm leading-relaxed text-ink-soft md:text-[15px]">{p.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-12 max-w-2xl font-display text-2xl leading-snug text-white md:text-3xl" style={{ fontWeight: 800 }}>
            La réponse d'AXEM : un parcours complet, <span className="rounded-lg bg-yellow px-1.5 text-ink">pas une intervention isolée.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// DUO (remonté tôt) — photos en ronds avec rings colorés · hover-reveal
// ---------------------------------------------------------------------
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit & stratégie. 3 ans de terrain.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/', ring: 'ring-mint', tint: 'bg-mint/15', dot: 'bg-mint' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/', ring: 'ring-violet', tint: 'bg-violet/15', dot: 'bg-violet' },
  ];
  return (
    <section id="duo" className="bg-cream-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5"><Sticker color="bg-violet text-white" rotate={-2}><span className="text-white">Les fondateurs</span></Sticker></div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.95] text-ink tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 116px)' }}>
            Deux experts,<br /><span className="text-violet">un seul interlocuteur.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl text-lg text-ink-soft md:text-xl">
            Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez directement à ceux qui livrent. Ensemble, <span className="font-extrabold text-ink">+55 000 abonnés LinkedIn</span>.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={spring}
                className={`group flex h-full flex-col gap-5 rounded-[2.25rem] border-2 border-ink/8 ${f.tint} p-7 shadow-soft md:flex-row md:items-start md:p-9`}>
                {/* photo en rond avec ring coloré */}
                <a href={f.li} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn ${f.name}`}
                  className="relative mx-auto shrink-0 md:mx-0">
                  <img src={f.img} alt={f.name} loading="lazy"
                    className={`h-32 w-32 rounded-full object-cover ring-4 ${f.ring} transition-transform duration-300 group-hover:scale-[1.04] md:h-40 md:w-40`} />
                  <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream shadow-soft transition-transform group-hover:scale-110">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </span>
                </a>
                <div className="flex flex-1 flex-col gap-3 text-center md:text-left">
                  <div>
                    <h3 className="font-display text-3xl text-ink tighter md:text-4xl" style={{ fontWeight: 900 }}>{f.name}</h3>
                    <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-violet">{f.school}</p>
                    <p className="text-sm text-ink-soft">{f.role}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{f.desc}</p>
                  <div className="mt-auto flex items-baseline justify-center gap-2 border-t-2 border-ink/8 pt-5 md:justify-start">
                    <span className="font-display text-5xl text-ink" style={{ fontWeight: 900 }}><Counter value={f.n} prefix="+" /></span>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </motion.div>
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
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN', dot: 'bg-mint' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H', dot: 'bg-violet' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1', dot: 'bg-coral' },
  ];
  return (
    <section id="methode" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display leading-[0.95] text-ink tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7.4vw, 116px)' }}>
            En 3 étapes.<br /><span className="text-mint-deep">Pas une de plus.</span>
          </h2>
        </Reveal>

        {/* trait qui se dessine (desktop) */}
        <div className="relative mt-16">
          <svg aria-hidden className="absolute left-0 top-9 hidden h-2 w-full md:block" viewBox="0 0 100 2" preserveAspectRatio="none">
            <motion.line x1="2" y1="1" x2="98" y2="1" stroke="#7C5CFF" strokeWidth="0.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, ease }} />
          </svg>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }} transition={spring}
                  className="group flex h-full flex-col gap-4 rounded-4xl border-2 border-ink/8 bg-white p-7 shadow-soft md:p-9">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-6xl text-ink tighter md:text-7xl" style={{ fontWeight: 900 }}>{s.n}</span>
                    <span className={`rounded-full ${s.dot} px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-ink`} style={{ fontWeight: 900 }}>{s.meta}</span>
                  </div>
                  <h3 className="font-display text-2xl text-ink tight md:text-3xl" style={{ fontWeight: 800 }}>{s.t}</h3>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{s.d}</p>
                </motion.div>
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
const LEVEL_DOT: Record<string, string> = { Socle: '#00C97D', Métiers: '#7C5CFF', Automatisation: '#FF6B4A', Transversal: '#F5BE00', Production: '#FF6B4A' };
const LEVEL_TINT: Record<string, string> = { Socle: 'bg-mint/12', Métiers: 'bg-violet/12', Automatisation: 'bg-coral/12', Transversal: 'bg-yellow/15', Production: 'bg-coral/12' };

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
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div role="dialog" aria-modal="true" aria-label={`${f.code} — ${f.t}`}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={spring}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border-2 border-ink/8 bg-white shadow-soft sm:rounded-[2rem]">
        <div className="flex items-start justify-between gap-4 border-b-2 border-ink/8 p-6 md:p-8">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-cream">{f.code}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: LEVEL_DOT[f.niveau] }} />{f.niveau}
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">{f.duree}</span>
            </div>
            <h3 className="font-display text-2xl text-ink tighter md:text-3xl" style={{ fontWeight: 900 }}>{f.t}</h3>
            <p className="mt-1 text-sm font-bold italic text-violet">« {f.tag} »</p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="shrink-0 rounded-full border-2 border-ink/10 p-2 text-ink-soft transition hover:bg-ink/5 hover:text-ink">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
          <p className="text-[15px] leading-relaxed text-ink-soft">{f.desc}</p>
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-mint-deep">Programme</p>
            <ul className="space-y-2">
              {f.programme.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />{p}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-mint-deep">Outils</p>
              <p className="text-sm leading-relaxed text-ink-soft">{f.outils}</p>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-mint-deep">Livrables</p>
              <p className="text-sm leading-relaxed text-ink-soft">{f.livrables}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t-2 border-ink/8 p-6 sm:flex-row md:px-8">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-ink" style={{ fontWeight: 900 }}>{f.prix}</span>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">HT / participant</span>
          </div>
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm uppercase tracking-[0.04em] text-cream shadow-soft transition-transform hover:scale-[1.03] sm:w-auto" style={{ fontWeight: 900 }}>
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
    <section id="formation" className="bg-cream-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-mint px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-ink shadow-soft" style={{ fontWeight: 900 }}>Bloc 1</span>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-soft">Organisme de formation Qualiopi</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.95] text-ink tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 112px)' }}>
            10 formations.<br /><span className="text-mint-deep">70 % de pratique.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-base">
            Construites de A à Z selon vos besoins et vos cas d'usage. Inter ou intra, modulables en parcours et bootcamps. Tarifs HT par participant : <span className="rounded-md bg-yellow px-1.5 font-extrabold text-ink">200 € – 1 250 €</span>.
          </p>
        </Reveal>

        {/* filtre par niveau */}
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-wrap gap-2">
            {LEVELS.map((lv) => (
              <button key={lv} type="button" onClick={() => setLevel(lv)}
                className={`rounded-full border-2 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.08em] transition ${level === lv ? 'border-ink bg-ink text-cream shadow-soft' : 'border-ink/12 bg-white text-ink-soft hover:-translate-y-0.5 hover:border-ink/30 hover:text-ink'}`}>
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
                transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04, ease }}
                whileHover={{ y: -6, rotate: i % 2 === 0 ? -0.8 : 0.8 }}>
                <div className={`group h-full rounded-4xl border-2 border-ink/8 ${LEVEL_TINT[f.niveau]} shadow-soft transition-colors`}>
                  <button type="button" onClick={() => setOpen(f)} className="flex h-full w-full flex-col items-start gap-3 p-6 text-left">
                    <div className="flex w-full items-center justify-between">
                      <span className="font-display text-sm text-ink-soft" style={{ fontWeight: 800 }}>{f.code}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink/10 bg-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-soft">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: LEVEL_DOT[f.niveau] }} />{f.niveau}
                      </span>
                    </div>
                    <h3 className="font-display text-xl leading-tight text-ink md:text-2xl" style={{ fontWeight: 800 }}>{f.t}</h3>
                    <p className="text-sm leading-relaxed text-ink-soft">{f.tag}</p>
                    <div className="mt-auto flex w-full items-center justify-between pt-3">
                      <span className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-ink-soft">{f.duree} · {f.prix}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-cream">Détails <span className="transition-transform group-hover:translate-x-0.5">→</span></span>
                    </div>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* formats complémentaires : Coaching · Bootcamps · Vidéos */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { t: 'Coaching individuel', d: "Pour vos profils clés — managers, dirigeants, référents IA. 1 session/semaine, avec Clément ou Alexis.", price: '200 € / session (1h)', tint: 'bg-mint/12' },
            { t: 'Bootcamps immersifs', d: "Format intensif sur-mesure (3 jours + extension). 90 % de pratique sur vos données, livrables concrets.", price: 'Sur devis', tint: 'bg-violet/12' },
            { t: 'Formations vidéos', d: "Masterclass 24/7 — 40-45 vidéos HD, templates, prompts sectoriels. Idéal onboarding nouvelle recrue.", price: 'Sur devis', tint: 'bg-coral/12' },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <motion.div whileHover={{ y: -5 }} transition={spring}
                className={`flex h-full flex-col gap-2 rounded-4xl border-2 border-ink/8 ${c.tint} p-6 shadow-soft`}>
                <h3 className="font-display text-lg text-ink md:text-xl" style={{ fontWeight: 800 }}>{c.t}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{c.d}</p>
                <span className="mt-auto pt-3 text-[12px] font-extrabold uppercase tracking-[0.1em] text-ink">{c.price}</span>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* FINANCEMENT — OPCO + Qualiopi (3 étapes) */}
        <Reveal delay={0.06}>
          <div className="mt-12 overflow-hidden rounded-[2rem] border-2 border-ink/8 bg-white shadow-soft">
            <div className="grid gap-8 p-7 md:grid-cols-[auto_1fr] md:items-center md:p-10">
              <div className="flex items-center justify-center rounded-3xl bg-cream-2 px-8 py-5">
                <img src="/logos/qualiopi-full.png" alt="Qualiopi — Actions de formation" className="h-20 w-auto max-w-[180px] object-contain md:h-24" loading="lazy" />
              </div>
              <div>
                <Sticker color="bg-yellow" rotate={-2}>Financement</Sticker>
                <h3 className="mt-3 font-display text-2xl text-ink tight md:text-3xl" style={{ fontWeight: 800 }}>Formations finançables OPCO.</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-[15px]">
                  Organisme certifié Qualiopi : prise en charge possible jusqu'à 100 %, interlocuteur unique côté AXEM, démarches simplifiées.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 formations les plus rentables.' },
                    { n: '02', t: 'Devis & dossier OPCO', d: 'Proposition sous 48h, prise en charge OPCO, démarches simplifiées.' },
                    { n: '03', t: 'Formation', d: 'Équipes opérationnelles dès J+1, livrables concrets, suivi post-formation.' },
                  ].map((s) => (
                    <div key={s.n} className="rounded-3xl border-2 border-ink/8 bg-cream-2 p-4">
                      <span className="font-display text-lg text-mint-deep" style={{ fontWeight: 900 }}>{s.n}</span>
                      <p className="mt-1 text-sm font-extrabold text-ink">{s.t}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{s.d}</p>
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
    { n: '01', t: 'Audit IA', d: "On regarde avant de déployer. Cartographie des process, scoring de maturité IA, roadmap priorisée.", price: '1 semaine', tint: 'bg-mint/12' },
    { n: '02', t: 'Conseil stratégique', d: "On décide quoi faire, dans quel ordre, avec quels budgets. Choix des outils, architecture, pilotage.", price: 'Sur devis', tint: 'bg-violet/12' },
    { n: '03', t: 'Déploiement & automatisation', d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main (A) ou suivi (B).", price: 'A · 1 200-2 000 € · B · 900 € + 80 €/mois', tint: 'bg-coral/12' },
    { n: '04', t: 'Production IA', d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite.", price: 'Sur devis', tint: 'bg-yellow/15' },
    { n: '05', t: 'Suivi', d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.", price: '80 € / mois', tint: 'bg-mint/12' },
  ];
  return (
    <section id="conseil" className="px-3 py-10 md:px-5 md:py-14">
      <div className="mx-auto max-w-[1400px] rounded-[2.5rem] bg-violet px-5 py-24 shadow-violet md:px-12 md:py-32">
        <Reveal>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-yellow px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-ink shadow-soft" style={{ fontWeight: 900 }}>Bloc 2</span>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/90">Agence · Conseil & déploiement</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.95] text-white tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 112px)' }}>
            De l'audit<br /><span className="rounded-2xl bg-ink px-3 text-yellow">à l'autonomie.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/90 md:text-base">
            Quand la formation ne suffit pas : on conçoit, on déploie et on maintient vos solutions IA. Un seul interlocuteur, du diagnostic à la production.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={Math.min(i, 5) * 0.06}>
              <motion.div whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }} transition={spring}
                className="flex h-full flex-col gap-3 rounded-4xl border-2 border-ink/8 bg-white p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-violet/35 md:text-5xl" style={{ fontWeight: 900 }}>{s.n}</span>
                </div>
                <h3 className="font-display text-xl text-ink md:text-2xl" style={{ fontWeight: 800 }}>{s.t}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{s.d}</p>
                <span className="mt-auto pt-3 text-[12px] font-extrabold uppercase tracking-[0.1em] text-violet-deep">{s.price}</span>
              </motion.div>
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
    { v: 80, s: ' %', l: 'temps de saisie économisé (BTP · chiffrage)', c: 'text-mint-deep' },
    { v: 4, p: '×', l: 'plus rapide (administration · OCR)', c: 'text-violet' },
    { v: 100, s: ' %', l: 'de fiabilité (double vérification OCR/IA)', c: 'text-coral' },
    { v: 317, s: ' h', l: 'libérées / mois (conformité ADV)', c: 'text-yellow-deep' },
  ];
  const stats2 = [
    { v: 98, p: '>', s: ' %', l: "d'anomalies détectées", c: 'text-violet' },
    { v: 95, s: ' k€', l: 'de charge annuelle neutralisée', c: 'text-mint-deep' },
  ];
  return (
    <section id="resultats" className="bg-cream-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal><div className="mb-5"><Sticker color="bg-coral text-white" rotate={-2}><span className="text-white">Cas clients</span></Sticker></div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.95] text-ink tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 116px)' }}>
            Des résultats.<br /><span className="text-coral">Pas des slides.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-base">5 missions, 5 secteurs, des résultats mesurés.</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <motion.div whileHover={{ y: -5 }} transition={spring}
                className="h-full rounded-4xl border-2 border-ink/8 bg-white p-6 shadow-soft">
                <div className={`font-display leading-[0.85] ${s.c} tighter`} style={{ fontWeight: 900, fontSize: 'clamp(44px, 6vw, 88px)' }}>
                  <Counter value={s.v} prefix={(s as any).p || ''} suffix={s.s || ''} />
                </div>
                <div className="mt-3 text-[13px] font-bold leading-snug text-ink-soft">{s.l}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
          {stats2.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <motion.div whileHover={{ y: -5 }} transition={spring}
                className="h-full rounded-4xl border-2 border-ink/8 bg-white p-6 shadow-soft">
                <div className={`font-display leading-[0.85] ${s.c} tighter`} style={{ fontWeight: 900, fontSize: 'clamp(40px, 5vw, 72px)' }}>
                  <Counter value={s.v} prefix={(s as any).p || ''} suffix={s.s || ''} />
                </div>
                <div className="mt-3 text-[13px] font-bold leading-snug text-ink-soft">{s.l}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <a href={NOTION_CASES} target="_blank" rel="noopener noreferrer"
            className="group mt-14 inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.06em] text-cream shadow-soft transition hover:scale-[1.03]">
            Voir tous les cas clients en détail
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// POURQUOI AXEM — 5 raisons (bloc jaune plein)
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
    <section className="px-3 py-10 md:px-5 md:py-14">
      <div className="mx-auto max-w-[1400px] rounded-[2.5rem] bg-yellow px-5 py-24 shadow-yellow md:px-12 md:py-32">
        <Reveal><div className="mb-5"><Sticker color="bg-white" rotate={-3}>Pourquoi AXEM</Sticker></div></Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display leading-[0.95] text-ink tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 7vw, 112px)' }}>
            5 raisons<br /><span className="rounded-2xl bg-ink px-3 text-yellow">de nous choisir.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.n} delay={Math.min(i, 5) * 0.06}>
              <motion.div whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }} transition={spring}
                className="flex h-full flex-col gap-2.5 rounded-4xl bg-white p-7 shadow-soft">
                <span className="font-display text-3xl text-coral" style={{ fontWeight: 900 }}>{r.n}</span>
                <h3 className="font-display text-lg text-ink md:text-xl" style={{ fontWeight: 800 }}>{r.t}</h3>
                <p className="text-sm leading-relaxed text-ink-soft md:text-[15px]">{r.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-10 text-sm font-semibold text-ink/70">
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
    <section id="rdv" className="bg-cream-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <Reveal><div className="mb-5"><Sticker color="bg-mint" rotate={-2}>Rendez-vous</Sticker></div></Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display leading-[0.95] text-ink tighter" style={{ fontWeight: 900, fontSize: 'clamp(40px, 6vw, 92px)' }}>
                Démarrons par un<br /><span className="text-mint-deep">diagnostic gratuit.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-7 max-w-md text-lg text-ink-soft">
                30 minutes pour identifier vos 3 leviers IA prioritaires. Pas un commercial — directement Clément ou Alexis.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a href={`mailto:${EMAIL}`} className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-ink/12 bg-white px-5 py-3 text-sm font-extrabold text-ink shadow-soft transition hover:-translate-y-0.5 hover:text-mint-deep">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {EMAIL}
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-[2rem] border-2 border-ink/8 bg-white shadow-soft">
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
  <footer className="bg-cream px-5 py-16 md:px-8">
    <div className="mx-auto max-w-[1400px]">
      <div className="font-display leading-[0.85] text-ink tighter" style={{ fontWeight: 900, fontSize: 'clamp(64px, 16vw, 260px)' }}>
        AXEM<span className="text-coral">.</span>
      </div>
      <div className="mt-12 grid gap-10 border-t-2 border-ink/8 pt-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-xs text-sm text-ink-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-dim">Navigation</div>
          <ul className="space-y-2 text-sm text-ink-soft">
            {[['Formation', '#formation'], ['Conseil', '#conseil'], ['Le duo', '#duo'], ['Résultats', '#resultats'], ['Rendez-vous', '#rdv']].map(([l, h]) => (
              <li key={l}><a href={h} className="font-semibold transition-colors hover:text-ink">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-dim">Contact</div>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="font-semibold transition-colors hover:text-ink">Prendre rendez-vous</a></li>
            <li><a href={`mailto:${EMAIL}`} className="font-semibold transition-colors hover:text-ink">{EMAIL}</a></li>
            <li>axem-ia.fr</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t-2 border-ink/8 pt-8 text-xs text-ink-dim md:flex-row">
        <span>© 2026 AXEM IA — Paris, France</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/20 px-3 py-1 font-bold text-ink">
          <svg className="h-3.5 w-3.5 text-mint-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
    <div className="min-h-screen bg-cream">
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
