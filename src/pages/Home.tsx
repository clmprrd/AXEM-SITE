import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useMotionTemplate, useInView, useReducedMotion,
} from 'framer-motion';

// =====================================================================
// AXEM IA — DARK PREMIUM TECH
// Vert mint sur noir, glassmorphism, glow, grille technique.
// Fonts : Space Grotesk (titres) · Inter (corps) · JetBrains Mono (chiffres)
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.2, 0.8, 0.2, 1] as const;

// glass card utility (shared)
const GLASS =
  'rounded-2xl border border-mint/[0.18] bg-white/[0.03] backdrop-blur-[12px]';

// ---------- helpers d'interactivité ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
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

const Spotlight: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({ children, className = '', color = 'rgba(0,250,154,0.14)' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const [on, setOn] = useState(false);
  const bg = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, ${color}, transparent 70%)`;
  return (
    <div ref={ref} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
      className={`relative overflow-hidden ${className}`}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ background: bg, opacity: on ? 1 : 0 }} />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

const Tilt: React.FC<{ children: React.ReactNode; className?: string; max?: number }> = ({ children, className = '', max = 6 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0); const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const reduce = useReducedMotion();
  const move = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current!.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max);
  };
  return <motion.div ref={ref} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0); }}
    style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', transformPerspective: 1000 }} className={className}>{children}</motion.div>;
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

// ---------- HERO BACKGROUND : grille technique + glow vert qui respire ----------
const HeroBg: React.FC = () => {
  const mx = useMotionValue(50); const my = useMotionValue(22);
  const smx = useSpring(mx, { stiffness: 50, damping: 24 });
  const smy = useSpring(my, { stiffness: 50, damping: 24 });
  const spot = useMotionTemplate`radial-gradient(480px circle at ${smx}% ${smy}%, rgba(0,250,154,0.10), transparent 60%)`;
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const h = (e: MouseEvent) => { mx.set((e.clientX / window.innerWidth) * 100); my.set((e.clientY / window.innerHeight) * 55); };
    window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h);
  }, [mx, my, reduce]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* grille technique masquée vers le haut */}
      <div className="absolute inset-0 tech-grid"
        style={{ maskImage: 'radial-gradient(ellipse 80% 60% at 50% 22%, black, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 22%, black, transparent 75%)' }} />
      {/* halo mint qui respire derrière le hero */}
      <motion.div className="absolute left-1/2 top-[-6%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.30), transparent)' }}
        animate={reduce ? {} : { opacity: [0.55, 0.95, 0.55], scale: [1, 1.08, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      {/* halo sky secondaire */}
      <motion.div className="absolute right-[6%] top-[8%] h-[42vh] w-[42vw] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(closest-side, rgba(14,165,233,0.22), transparent)' }}
        animate={reduce ? {} : { x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      {/* spotlight souris */}
      <motion.div className="absolute inset-0" style={{ background: spot }} />
      {/* vignette bas */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base to-transparent" />
    </div>
  );
};

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-line/80 bg-base/80 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-2xl font-bold tracking-tight text-text">axem<span className="text-mint"> IA</span></a>
        <div className="hidden items-center gap-8 md:flex">
          {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-sm font-medium text-text-soft transition-colors hover:text-text">
              {l}<span className="absolute -bottom-1 left-0 h-px w-0 bg-mint shadow-[0_0_8px_rgba(0,250,154,0.8)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
          className="group inline-flex items-center gap-1.5 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-base shadow-[0_0_24px_-4px_rgba(0,250,154,0.6)] transition-shadow hover:shadow-[0_0_32px_-2px_rgba(0,250,154,0.85)]">
          Prendre rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------- FUSION Alexis + Clément = AXEM ----------
const Fusion: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => { const a = setTimeout(() => setPhase(1), 1100); const b = setTimeout(() => setPhase(2), 2000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="flex h-8 items-center justify-center" aria-label="Alexis + Clément = AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.4em] text-text-soft">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 90 : 0, scale: phase === 1 ? 1.4 : 1 }} transition={{ duration: 0.5 }} className="text-mint">+</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-0.5">
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="font-display text-xl font-bold tracking-tight text-text">{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1 font-display text-xl font-bold tracking-tight text-mint" style={{ textShadow: '0 0 16px rgba(0,250,154,0.6)' }}>IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- HERO ----------
const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden px-6 pt-36 pb-28 text-center">
    <HeroBg />
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex flex-col items-center gap-4">
        <Fusion />
        <div className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/[0.06] px-4 py-1.5 shadow-[0_0_20px_-6px_rgba(0,250,154,0.4)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_8px_rgba(0,250,154,0.9)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-soft">Agence d'IA & organisme de formation certifié Qualiopi</span>
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} transition={{ duration: 0.9, delay: 0.25, ease }}
        className="font-display text-[clamp(42px,8vw,104px)] font-semibold leading-[1.0] tracking-[-0.03em] text-text">
        Votre partenaire IA,<br /><span className="mark-mint">de A à Z.</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-7 text-xl font-medium text-text md:text-2xl">
        On vous forme, on vous conseille, on déploie. <span className="text-mint">Et on reste.</span>
      </motion.p>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }} className="mt-6 max-w-2xl text-base leading-relaxed text-text-soft md:text-lg">
        AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi.
        Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique,
        de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }} className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-mint px-9 text-base font-bold text-base shadow-[0_0_44px_-10px_rgba(0,250,154,0.85)]" style={{ paddingTop: 18, paddingBottom: 18 }}>
          <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
          <span className="relative">Prendre rendez-vous</span>
          <span className="relative transition-transform group-hover:translate-x-1">→</span>
        </Magnetic>
        <a href="#prestations" className="group text-base font-medium text-text-soft hover:text-text">
          <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-mint">Découvrir nos prestations</span> ↓
        </a>
      </motion.div>

      {/* preuve sociale : duo + 55k LinkedIn */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0 }}
        className={`mt-12 inline-flex items-center gap-4 px-5 py-3 ${GLASS} shadow-[0_0_30px_-12px_rgba(0,250,154,0.4)]`}>
        <div className="flex -space-x-3">
          {[ALEXIS_IMG, CLEMENT_IMG].map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" className="h-10 w-10 rounded-full border-2 border-surface object-cover" />
          ))}
        </div>
        <div className="text-left leading-tight">
          <div className="font-mono text-sm font-bold text-mint">+55 000</div>
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-soft">abonnés LinkedIn · le duo fondateur</div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------- TRUST ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  return (
    <section id="references" className="border-y border-line bg-surface/40 py-10">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-text-soft">Ils nous font confiance</p>
      <div className="group relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div className="flex w-max gap-12 px-6 group-hover:[animation-play-state:paused]" style={{ animation: 'marquee 40s linear infinite' }}>
          {[...logos, ...logos].map((l, i) => (
            <span key={l + i} className="shrink-0 whitespace-nowrap font-display text-2xl font-medium text-text-soft/70 transition-colors hover:text-mint">{l}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>
  );
};

// ---------- SERVICES ----------
const Services: React.FC = () => {
  const items = [
    { n: '01', t: 'Audit IA', d: "On regarde avant de déployer. Diagnostic, cartographie de vos process, scoring de maturité IA.", price: '1 à 4 semaines' },
    { n: '02', t: 'Conseil stratégique', d: "On décide quoi faire, dans quel ordre, avec quels budgets. Roadmap priorisée, choix des outils.", price: 'Sur devis' },
    { n: '03', t: 'Déploiement & automatisation', d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou suivi.", price: 'À partir de 1 200 €' },
    { n: '04', t: 'Formation Qualiopi', d: "Vos équipes opérationnelles dès J+1. 10 formations, 3 niveaux, 70 % de pratique. Finançable OPCO.", price: '200 € – 1 250 € / pers.' },
    { n: '05', t: 'Coaching individuel', d: "Pour vos profils clés : managers, dirigeants, référents IA. On ancre les compétences dans la durée.", price: '200 € / session' },
    { n: '06', t: 'Production IA', d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite.", price: 'Sur devis' },
    { n: '07', t: 'Suivi', d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.", price: '80 € / mois' },
  ];
  return (
    <section id="prestations" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mint"><span className="h-1.5 w-1.5 bg-mint shadow-[0_0_8px_rgba(0,250,154,0.9)]" />Ce qu'on fait</div></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-3xl font-display text-[clamp(34px,5vw,68px)] font-semibold leading-[1.05] tracking-[-0.02em] text-text">Sept prestations. <span className="text-text-soft">Un seul partenaire.</span></h2></Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.08}>
              <Spotlight className={`group h-full ${GLASS} transition-all duration-300 hover:border-mint/40 hover:shadow-[0_0_40px_-16px_rgba(0,250,154,0.5)]`}>
                <div className="flex h-full flex-col gap-4 p-8 md:p-10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-3xl font-bold text-mint transition-all duration-300 group-hover:-translate-y-0.5" style={{ textShadow: '0 0 18px rgba(0,250,154,0.45)' }}>{s.n}</span>
                    <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs font-medium text-text-soft">{s.price}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-text md:text-3xl">{s.t}</h3>
                  <p className="text-base leading-relaxed text-text-soft">{s.d}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-mint opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="h-px w-6 bg-mint" />En savoir plus →
                  </div>
                </div>
              </Spotlight>
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
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <section id="duo" className="relative border-y border-line bg-surface/30 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-mint"><span className="h-1.5 w-1.5 bg-mint shadow-[0_0_8px_rgba(0,250,154,0.9)]" />Les fondateurs</div></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-3xl font-display text-[clamp(34px,5vw,68px)] font-semibold leading-[1.05] tracking-[-0.02em] text-text">AXEM, c'est nous deux.</h2></Reveal>
        <Reveal delay={0.2}><p className="mt-5 max-w-xl text-lg text-text-soft"><span className="font-semibold text-text">A</span>lexis + Cl<span className="font-semibold text-text">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.</p></Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <Tilt max={5}>
                <div className={`group flex h-full flex-col overflow-hidden ${GLASS} transition-all duration-300 hover:border-mint/40 hover:shadow-[0_0_50px_-18px_rgba(0,250,154,0.5)]`}>
                  <div className="relative overflow-hidden">
                    <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/10 to-transparent" />
                    <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-mint/30 bg-base/70 text-mint shadow-[0_0_20px_-6px_rgba(0,250,154,0.6)] backdrop-blur transition-transform hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                    </a>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-8">
                    <div>
                      <h3 className="font-display text-3xl font-semibold tracking-tight text-text">{f.name}</h3>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-mint">{f.school}</p>
                      <p className="text-sm text-text-soft">{f.role}</p>
                    </div>
                    <p className="text-base leading-relaxed text-text-soft">{f.desc}</p>
                    <div className="mt-auto flex items-baseline gap-2 border-t border-line pt-5">
                      <span className="font-mono text-4xl font-bold text-text"><Counter value={f.n} prefix="+" /></span>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-soft">abonnés LinkedIn</span>
                    </div>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}><p className="mt-10 text-center font-display text-3xl font-medium italic text-text md:text-4xl">Ensemble, <span className="text-gradient font-semibold not-italic">AXEM</span>.</p></Reveal>
      </div>
    </section>
  );
};

// ---------- PROOF ----------
const Proof: React.FC = () => {
  const stats = [{ v: 55000, p: '+', l: 'abonnés LinkedIn' }, { v: 10, p: '', l: 'formations Qualiopi' }, { v: 70, p: '', s: ' %', l: 'de pratique' }, { v: null, l: 'opérationnel', txt: 'J+1' }];
  const cases = [{ sector: 'BTP · Chiffrage', r: '80 %', d: 'de temps de saisie économisé · 95 k€/an neutralisés' }, { sector: 'Administration · OCR', r: '×4', d: 'plus rapide · fiabilité 100 % par double vérification' }, { sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois · anomalies détectées > 98 %' }];
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 border-b border-line pb-20 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="group cursor-default">
                <div className="font-mono text-[clamp(40px,5vw,72px)] font-bold leading-none text-text transition-all duration-300 group-hover:text-mint group-hover:[text-shadow:0_0_24px_rgba(0,250,154,0.5)]">
                  {s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}
                </div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-text-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><h2 className="mt-20 max-w-3xl font-display text-[clamp(30px,4.5vw,56px)] font-semibold leading-[1.08] tracking-[-0.02em] text-text">Des résultats. <span className="text-text-soft">Pas des slides.</span></h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.1}>
              <Tilt max={5}>
                <Spotlight className={`h-full ${GLASS} transition-all duration-300 hover:border-mint/40 hover:shadow-[0_0_40px_-16px_rgba(0,250,154,0.5)]`}>
                  <div className="flex h-full flex-col gap-4 p-8">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mint">{c.sector}</span>
                    <span className="font-mono text-6xl font-bold text-text" style={{ textShadow: '0 0 26px rgba(0,250,154,0.25)' }}>{c.r}</span>
                    <p className="text-base leading-relaxed text-text-soft">{c.d}</p>
                  </div>
                </Spotlight>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- METHOD ----------
const Method: React.FC = () => {
  const steps = [{ n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' }, { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' }, { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' }];
  return (
    <section id="methode" className="relative border-t border-line bg-surface/30 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><h2 className="max-w-3xl font-display text-[clamp(34px,5vw,68px)] font-semibold leading-[1.05] tracking-[-0.02em] text-text">En 3 étapes. <span className="text-mint">Pas une de plus.</span></h2></Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className={`group flex flex-col gap-4 ${GLASS} p-8 transition-all duration-300 hover:border-mint/40 hover:shadow-[0_0_40px_-18px_rgba(0,250,154,0.5)]`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-6xl font-bold text-text transition-all duration-300 group-hover:text-mint group-hover:[text-shadow:0_0_22px_rgba(0,250,154,0.5)]">{s.n}</span>
                  <span className="rounded-full border border-mint/30 bg-mint/[0.08] px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.16em] text-mint shadow-[0_0_16px_-6px_rgba(0,250,154,0.6)]">{s.meta}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-text">{s.t}</h3>
                <p className="text-base leading-relaxed text-text-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- CTA ----------
const FinalCTA: React.FC = () => (
  <section className="relative px-6 py-28">
    <Spotlight className="mx-auto max-w-5xl overflow-hidden rounded-[40px] border border-mint/[0.18] bg-surface/60 px-8 py-20 text-center backdrop-blur-[12px] md:px-16" color="rgba(0,250,154,0.20)">
      {/* halo respirant derrière le CTA */}
      <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[120%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.18), transparent)' }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="relative">
        <Reveal><h2 className="mx-auto max-w-3xl font-display text-[clamp(34px,5vw,72px)] font-semibold leading-[1.04] tracking-[-0.02em] text-text">Parlons de votre projet IA.</h2></Reveal>
        <Reveal delay={0.1}><p className="mx-auto mt-6 max-w-xl text-lg text-text-soft">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p></Reveal>
        <Reveal delay={0.2}>
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3} className="group mt-11 inline-flex items-center gap-3 rounded-full bg-mint px-10 py-5 text-base font-bold text-base shadow-[0_0_50px_-10px_rgba(0,250,154,0.8)] transition-shadow hover:shadow-[0_0_60px_-6px_rgba(0,250,154,0.95)]">
            Réserver un diagnostic gratuit <span className="transition-transform group-hover:translate-x-1">→</span>
          </Magnetic>
        </Reveal>
      </div>
    </Spotlight>
  </section>
);

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="border-t border-line bg-base px-6 py-16">
    <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-3xl font-bold tracking-tight text-text">axem<span className="text-mint"> IA</span></div>
        <p className="mt-3 max-w-xs text-sm text-text-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
      </div>
      <div>
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-text-soft">Navigation</div>
        <ul className="space-y-2 text-sm text-text-soft">{[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-mint">{l}</a></li>))}</ul>
      </div>
      <div>
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-text-soft">Contact</div>
        <ul className="space-y-2 text-sm text-text-soft">
          <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-mint">Prendre rendez-vous</a></li>
          <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-mint">contact@axem-ia.fr</a></li>
          <li>axem-ia.fr</li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line pt-8 text-xs text-text-soft md:flex-row">
      <span>© 2026 AXEM IA — Paris, France</span>
      <span className="inline-flex items-center gap-1.5">
        <svg className="h-3.5 w-3.5 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Qualiopi · Finançable OPCO
      </span>
    </div>
  </footer>
);

const Home: React.FC = () => (
  <div className="min-h-screen bg-base">
    <Nav />
    <main><Hero /><Trust /><Services /><Duo /><Proof /><Method /><FinalCTA /></main>
    <Footer />
  </div>
);

export default Home;
