import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useInView, useReducedMotion,
} from 'framer-motion';

// =====================================================================
// AXEM IA — STYLE "CRÉATIF PERSONAL-BRAND"
// Le duo incarné : chaleureux, humain. Photos au centre, blobs organiques,
// double accent mint (Clément) + corail (Alexis), preuve sociale en hero.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.22, 0.61, 0.36, 1] as const;

// couleurs duo
const MINT = '#00FA9A';   // Clément
const CORAL = '#FF6B4A';  // Alexis

// ---------- helpers d'interactivité ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; y?: number }> = ({ children, delay = 0, className, y = 26 }) => (
  <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease }} className={className}>{children}</motion.div>
);

const Magnetic: React.FC<any> = ({ children, strength = 0.3, className, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.5 });
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
    const tick = (t: number) => { const k = Math.min(1, (t - start) / 1400); setN(Math.round((1 - Math.pow(1 - k, 3)) * value)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const fmt = n >= 1000 ? n.toLocaleString('fr-FR') : String(n);
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

// petit sticker autocollant flottant
const Sticker: React.FC<{ children: React.ReactNode; color: string; className?: string; rotate?: number; delay?: number }> = ({ children, color, className = '', rotate = -8, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.4, rotate: rotate - 20 }}
    whileInView={{ opacity: 1, scale: 1, rotate }}
    viewport={{ once: true }}
    transition={{ type: 'spring', stiffness: 220, damping: 13, delay }}
    whileHover={{ scale: 1.12, rotate: 0 }}
    className={`select-none rounded-full px-3.5 py-1.5 text-[13px] font-extrabold text-ink shadow-[0_8px_22px_-8px_rgba(0,0,0,0.35)] ${className}`}
    style={{ background: color }}>
    {children}
  </motion.div>
);

// ---------- BACKGROUND : blobs organiques doux + grain ----------
const SoftBlobs: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <motion.div className="blob-1 absolute -left-[8%] top-[6%] h-[46vh] w-[46vw]"
      style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.55), transparent)', filter: 'blur(80px)' }}
      animate={{ x: [0, 50, 0], y: [0, 26, 0], scale: [1, 1.12, 1] }} transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.div className="blob-2 absolute right-[-6%] top-[2%] h-[42vh] w-[40vw]"
      style={{ background: 'radial-gradient(closest-side, rgba(255,107,74,0.45), transparent)', filter: 'blur(90px)' }}
      animate={{ x: [0, -44, 0], y: [0, 34, 0], scale: [1.06, 1, 1.06] }} transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.div className="blob-3 absolute left-1/2 top-[42%] h-[34vh] w-[34vw] -translate-x-1/2"
      style={{ background: 'radial-gradient(closest-side, rgba(255,206,120,0.4), transparent)', filter: 'blur(80px)' }}
      animate={{ y: [0, -26, 0], scale: [1, 1.09, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} />
    <div className="absolute inset-0 opacity-[0.45]" style={{ backgroundImage: 'radial-gradient(circle, rgba(22,22,22,0.045) 1px, transparent 1px)', backgroundSize: '26px 26px', maskImage: 'radial-gradient(ellipse 75% 55% at 50% 32%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 32%, black, transparent)' }} />
  </div>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-ink/10 bg-cream/85 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="group inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-ink">
          <span className="flex -space-x-1.5">
            <span className="h-3.5 w-3.5 rounded-full transition-transform group-hover:-translate-x-0.5" style={{ background: MINT }} />
            <span className="h-3.5 w-3.5 rounded-full transition-transform group-hover:translate-x-0.5" style={{ background: CORAL }} />
          </span>
          axem<span style={{ color: MINT }}> IA</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-sm font-semibold text-ink-soft transition-colors hover:text-ink">
              {l}<span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-full" style={{ background: MINT }} />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
          className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream">
          Prendre rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------- FUSION (Alexis + Clément = AXEM) ----------
const Fusion: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => { const a = setTimeout(() => setPhase(1), 1100); const b = setTimeout(() => setPhase(2), 2000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="flex h-8 items-center justify-center" aria-label="Alexis + Clément = AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.4em]">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }} style={{ color: CORAL }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 90 : 0, scale: phase === 1 ? 1.4 : 1 }} transition={{ duration: 0.5 }} className="text-ink-soft">+</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }} style={{ color: MINT }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-0.5">
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="font-display text-xl font-bold tracking-tight text-ink">{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1 font-display text-xl font-bold tracking-tight" style={{ color: MINT }}>IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// petit avatar rond pour le hero
const HeroAvatar: React.FC<{ img: string; ring: string; sticker: string; stickerColor: string; rotate: number; delay: number; floatDelay: number; className?: string }> =
  ({ img, ring, sticker, stickerColor, rotate, delay, floatDelay, className = '' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 15, delay }}
      whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
      style={{ rotate }}
      className={`relative ${className}`}>
      <div className="float-soft" style={{ animationDelay: `${floatDelay}s` }}>
        <div className="relative h-28 w-28 overflow-hidden rounded-[34px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.4)] sm:h-36 sm:w-36 md:h-40 md:w-40"
          style={{ border: `4px solid ${ring}` }}>
          <img src={img} alt="" loading="eager" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-extrabold text-ink shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)]"
          style={{ background: stickerColor }}>{sticker}</div>
      </div>
    </motion.div>
  );

// ---------- HERO ----------
const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden px-6 pt-32 pb-24 text-center">
    <SoftBlobs />
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-7 flex flex-col items-center gap-4">
        <Fusion />
        <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 backdrop-blur">
          <span className="flex -space-x-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: MINT }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: CORAL }} />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">Agence d'IA & organisme de formation certifié Qualiopi</span>
        </div>
      </motion.div>

      {/* PHOTOS DU DUO AU CENTRE */}
      <div className="mb-9 flex items-end justify-center gap-4 sm:gap-7">
        <HeroAvatar img={ALEXIS_IMG} ring={CORAL} sticker="Alexis" stickerColor={CORAL} rotate={-6} delay={0.15} floatDelay={0} className="-mr-2 sm:mr-0" />
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.45 }}
          className="mb-6 hidden h-9 w-9 items-center justify-center rounded-full bg-ink text-base font-bold text-cream sm:flex">+</motion.div>
        <HeroAvatar img={CLEMENT_IMG} ring={MINT} sticker="Clément" stickerColor={MINT} rotate={6} delay={0.3} floatDelay={1.4} className="-ml-2 sm:ml-0" />
      </div>

      <motion.h1 initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} transition={{ duration: 0.9, delay: 0.45, ease }}
        className="font-display text-[clamp(40px,8vw,98px)] font-bold leading-[1.0] tracking-[-0.04em] text-ink">
        Votre partenaire IA,<br /><span className="mark-mint">de A à Z.</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mt-7 text-xl font-semibold text-ink md:text-2xl">
        On vous forme, on vous conseille, on déploie. <span style={{ color: CORAL }}>Et on reste.</span>
      </motion.p>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }} className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
        AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi.
        Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique,
        de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
      </motion.p>

      {/* PREUVE SOCIALE EN ÉVIDENCE */}
      <motion.div initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.85 }}
        className="mt-9 inline-flex items-center gap-3 rounded-full border-2 border-ink/10 bg-white px-5 py-2.5 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.25)]">
        <span className="flex -space-x-2.5">
          <img src={CLEMENT_IMG} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" />
          <img src={ALEXIS_IMG} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" />
        </span>
        <span className="font-display text-base font-extrabold text-ink"><Counter value={55000} prefix="+" />&nbsp;abonnés LinkedIn</span>
        <span className="hidden text-sm font-semibold text-ink-soft sm:inline">nous suivent déjà</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.95 }} className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-9 text-base font-bold text-ink shadow-[0_12px_40px_-12px_rgba(0,250,154,0.85)]" style={{ paddingTop: 18, paddingBottom: 18, background: MINT }}>
          <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
          <span className="relative">Prendre rendez-vous</span>
          <span className="relative transition-transform group-hover:translate-x-1">→</span>
        </Magnetic>
        <a href="#prestations" className="group text-base font-semibold text-ink-soft hover:text-ink">
          <span className="border-b-2 border-transparent pb-0.5 transition-colors group-hover:border-ink">Découvrir nos prestations</span> ↓
        </a>
      </motion.div>
    </div>
  </section>
);

// ---------- TRUST ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  return (
    <section id="references" className="border-y border-ink/10 bg-sand py-10">
      <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-ink-soft">Ils nous font confiance</p>
      <div className="marquee-wrap group relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div className="marquee-track flex w-max gap-12 px-6">
          {[...logos, ...logos].map((l, i) => (
            <span key={l + i} className="shrink-0 whitespace-nowrap font-display text-2xl font-semibold text-ink/55 transition-colors hover:text-ink">{l}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } } .marquee-track { animation: marquee 40s linear infinite } .marquee-wrap:hover .marquee-track { animation-play-state: paused }`}</style>
    </section>
  );
};

// ---------- SERVICES ----------
const Services: React.FC = () => {
  const items = [
    { n: '01', t: 'Audit IA', d: "On regarde avant de déployer. Diagnostic, cartographie de vos process, scoring de maturité IA.", price: '1 à 4 semaines', tint: 'rgba(0,250,154,0.10)' },
    { n: '02', t: 'Conseil stratégique', d: "On décide quoi faire, dans quel ordre, avec quels budgets. Roadmap priorisée, choix des outils.", price: 'Sur devis', tint: 'rgba(255,107,74,0.10)' },
    { n: '03', t: 'Déploiement & automatisation', d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou suivi.", price: 'À partir de 1 200 €', tint: 'rgba(255,206,120,0.16)' },
    { n: '04', t: 'Formation Qualiopi', d: "Vos équipes opérationnelles dès J+1. 10 formations, 3 niveaux, 70 % de pratique. Finançable OPCO.", price: '200 € – 1 250 € / pers.', tint: 'rgba(0,250,154,0.10)' },
    { n: '05', t: 'Coaching individuel', d: "Pour vos profils clés : managers, dirigeants, référents IA. On ancre les compétences dans la durée.", price: '200 € / session', tint: 'rgba(255,107,74,0.10)' },
    { n: '06', t: 'Production IA', d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite.", price: 'Sur devis', tint: 'rgba(255,206,120,0.16)' },
    { n: '07', t: 'Suivi', d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.", price: '80 € / mois', tint: 'rgba(0,250,154,0.10)' },
  ];
  return (
    <section id="prestations" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#00B86F' }}><span className="h-2 w-2 rounded-full" style={{ background: MINT }} />Ce qu'on fait</div></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-3xl font-display text-[clamp(34px,5vw,68px)] font-bold leading-[1.05] tracking-[-0.03em] text-ink">Sept prestations. <span className="text-ink-soft">Un seul partenaire.</span></h2></Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.08}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group flex h-full flex-col gap-4 rounded-[28px] border border-ink/10 bg-cream p-8 transition-shadow duration-300 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.28)] md:p-10"
                style={{ backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${s.tint}, transparent 55%)` }}>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-3xl font-bold transition-transform duration-300 group-hover:-translate-y-0.5" style={{ color: '#00B86F' }}>{s.n}</span>
                  <span className="rounded-full bg-ink/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">{s.price}</span>
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">{s.t}</h3>
                <p className="text-base leading-relaxed text-ink-soft">{s.d}</p>
                <div className="mt-2 flex items-center gap-2 text-sm font-bold opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ color: '#00B86F' }}>
                  <span className="h-[2px] w-6 rounded-full" style={{ background: MINT }} />En savoir plus →
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- DUO ----------
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, k: 40, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/', color: MINT, deep: '#00B86F' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, k: 15, li: 'https://www.linkedin.com/in/alexiszeitoun/', color: CORAL, deep: '#E5482A' },
  ];
  return (
    <section id="duo" className="relative overflow-hidden border-y border-ink/10 bg-sand px-6 py-28">
      <div className="pointer-events-none absolute -left-[6%] top-[12%] z-0 h-[40vh] w-[36vw] blob-1 opacity-60" style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.28), transparent)', filter: 'blur(80px)' }} />
      <div className="pointer-events-none absolute -right-[6%] bottom-[8%] z-0 h-[40vh] w-[36vw] blob-2 opacity-60" style={{ background: 'radial-gradient(closest-side, rgba(255,107,74,0.25), transparent)', filter: 'blur(80px)' }} />
      <div className="relative mx-auto max-w-6xl">
        <Reveal><div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft"><span className="flex -space-x-1"><span className="h-2 w-2 rounded-full" style={{ background: MINT }} /><span className="h-2 w-2 rounded-full" style={{ background: CORAL }} /></span>Les fondateurs</div></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-3xl font-display text-[clamp(34px,5vw,68px)] font-bold leading-[1.05] tracking-[-0.03em] text-ink">AXEM, c'est nous deux.</h2></Reveal>
        <Reveal delay={0.2}><p className="mt-5 max-w-xl text-lg text-ink-soft"><span className="font-bold" style={{ color: CORAL }}>A</span>lexis + Cl<span className="font-bold" style={{ color: MINT }}>ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.</p></Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border border-ink/10 bg-cream transition-shadow duration-300 hover:shadow-[0_36px_70px_-34px_rgba(0,0,0,0.3)]">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover transition-all duration-500 group-hover:scale-[1.04]" />
                  {/* sticker abonnés en évidence */}
                  <div className="absolute left-5 top-5">
                    <Sticker color={f.color} rotate={i === 0 ? -7 : 7}>+{f.k}k abonnés</Sticker>
                  </div>
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition-transform hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                  <span className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: f.color }} />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-8">
                  <div>
                    <h3 className="font-display text-3xl font-bold tracking-tight text-ink">{f.name}</h3>
                    <p className="mt-1 text-sm font-bold uppercase tracking-[0.12em]" style={{ color: f.deep }}>{f.school}</p>
                    <p className="text-sm text-ink-soft">{f.role}</p>
                  </div>
                  <p className="text-base leading-relaxed text-ink-soft">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-ink/10 pt-5">
                    <span className="font-display text-4xl font-bold text-ink"><Counter value={f.n} prefix="+" /></span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}><p className="mt-10 text-center font-serif-i text-3xl italic text-ink md:text-4xl">Ensemble, <span style={{ color: MINT }}>AX</span><span style={{ color: CORAL }}>EM</span>.</p></Reveal>
      </div>
    </section>
  );
};

// ---------- PROOF ----------
const Proof: React.FC = () => {
  const stats = [{ v: 55000, p: '+', l: 'abonnés LinkedIn' }, { v: 10, p: '', l: 'formations Qualiopi' }, { v: 70, p: '', s: ' %', l: 'de pratique' }, { v: null, l: 'opérationnel', txt: 'J+1' }];
  const cases = [
    { sector: 'BTP · Chiffrage', r: '80 %', d: 'de temps de saisie économisé · 95 k€/an neutralisés', color: MINT },
    { sector: 'Administration · OCR', r: '×4', d: 'plus rapide · fiabilité 100 % par double vérification', color: CORAL },
    { sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois · anomalies détectées > 98 %', color: '#FFCE78' },
  ];
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 border-b border-ink/10 pb-20 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="group cursor-default">
                <div className="font-display text-[clamp(40px,5vw,72px)] font-bold leading-none text-ink transition-colors group-hover:text-[var(--hc)]" style={{ ['--hc' as any]: i % 2 === 0 ? '#00B86F' : CORAL }}>
                  {s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}
                </div>
                <div className="mt-2 text-sm font-bold uppercase tracking-[0.1em] text-ink-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><h2 className="mt-20 max-w-3xl font-display text-[clamp(30px,4.5vw,56px)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">Des résultats. <span className="text-ink-soft">Pas des slides.</span></h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative flex h-full flex-col gap-4 overflow-hidden rounded-[28px] border border-ink/10 bg-sand p-8 transition-shadow hover:shadow-[0_28px_56px_-30px_rgba(0,0,0,0.28)]">
                <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: c.color }} />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">{c.sector}</span>
                <span className="font-display text-6xl font-bold text-ink">{c.r}</span>
                <p className="text-base leading-relaxed text-ink-soft">{c.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- METHOD ----------
const Method: React.FC = () => {
  const steps = [
    { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN', color: MINT },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H', color: CORAL },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1', color: '#FFCE78' },
  ];
  return (
    <section id="methode" className="border-t border-ink/10 bg-sand px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><h2 className="max-w-3xl font-display text-[clamp(34px,5vw,68px)] font-bold leading-[1.05] tracking-[-0.03em] text-ink">En 3 étapes. <span style={{ color: CORAL }}>Pas une de plus.</span></h2></Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group flex flex-col gap-4 rounded-[28px] border border-ink/10 bg-cream p-8">
                <div className="flex items-center justify-between">
                  <span className="font-display text-6xl font-bold text-ink">{s.n}</span>
                  <span className="rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-ink" style={{ background: s.color }}>{s.meta}</span>
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{s.t}</h3>
                <p className="text-base leading-relaxed text-ink-soft">{s.d}</p>
                <span className="mt-1 h-[3px] w-10 rounded-full transition-all duration-300 group-hover:w-20" style={{ background: s.color }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- CTA ----------
const FinalCTA: React.FC = () => (
  <section className="px-6 py-28">
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-ink px-8 py-20 text-center md:px-16">
      <motion.div aria-hidden className="pointer-events-none absolute -left-[10%] top-[-20%] h-[50%] w-[40%] blob-1" style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.4), transparent)', filter: 'blur(70px)' }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div aria-hidden className="pointer-events-none absolute right-[-8%] bottom-[-20%] h-[50%] w-[38%] blob-2" style={{ background: 'radial-gradient(closest-side, rgba(255,107,74,0.4), transparent)', filter: 'blur(70px)' }}
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="relative">
        {/* photos du duo, ton chaleureux */}
        <Reveal y={18}>
          <span className="mx-auto mb-7 flex w-fit -space-x-3">
            <img src={ALEXIS_IMG} alt="" className="h-14 w-14 rounded-full border-2 object-cover" style={{ borderColor: CORAL }} />
            <img src={CLEMENT_IMG} alt="" className="h-14 w-14 rounded-full border-2 object-cover" style={{ borderColor: MINT }} />
          </span>
        </Reveal>
        <Reveal><h2 className="mx-auto max-w-3xl font-display text-[clamp(34px,5vw,72px)] font-bold leading-[1.04] tracking-[-0.03em] text-cream">Parlons de votre projet IA.</h2></Reveal>
        <Reveal delay={0.1}><p className="mx-auto mt-6 max-w-xl text-lg text-cream/65">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p></Reveal>
        <Reveal delay={0.2}>
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3} className="group mt-11 inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-bold text-ink shadow-[0_12px_50px_-10px_rgba(0,250,154,0.6)]" style={{ background: MINT }}>
            Réserver un diagnostic gratuit <span className="transition-transform group-hover:translate-x-1">→</span>
          </Magnetic>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="border-t border-ink/10 bg-cream px-6 py-16">
    <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="inline-flex items-center gap-2 font-display text-3xl font-bold tracking-tight text-ink">
          <span className="flex -space-x-1.5"><span className="h-3.5 w-3.5 rounded-full" style={{ background: MINT }} /><span className="h-3.5 w-3.5 rounded-full" style={{ background: CORAL }} /></span>
          axem<span style={{ color: MINT }}> IA</span>
        </div>
        <p className="mt-3 max-w-xs text-sm text-ink-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
      </div>
      <div>
        <div className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">Navigation</div>
        <ul className="space-y-2 text-sm text-ink-soft">{[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-ink">{l}</a></li>))}</ul>
      </div>
      <div>
        <div className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">Contact</div>
        <ul className="space-y-2 text-sm text-ink-soft">
          <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Prendre rendez-vous</a></li>
          <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-ink">contact@axem-ia.fr</a></li>
          <li>axem-ia.fr</li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-ink/10 pt-8 text-xs text-ink-soft md:flex-row">
      <span>© 2026 AXEM IA — Paris, France</span>
      <span className="inline-flex items-center gap-1.5">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="#00B86F" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Qualiopi · Finançable OPCO
      </span>
    </div>
  </footer>
);

const Home: React.FC = () => (
  <div className="min-h-screen bg-cream">
    <Nav />
    <main><Hero /><Trust /><Services /><Duo /><Proof /><Method /><FinalCTA /></main>
    <Footer />
  </div>
);

export default Home;
