import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
  useMotionTemplate, useInView, useReducedMotion,
} from 'framer-motion';

// =====================================================================
// AXEM IA — BOLD DARK EDITORIAL
// Luxe magazine · noir dramatique · typo serif géante · accent vert rare
// Inspiration : Stripe Press, a16z, Aesop, Bottega.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.2, 0.8, 0.2, 1] as const;

// ---------- helpers d'interactivité ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
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

const Spotlight: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({ children, className = '', color = 'rgba(0,250,154,0.10)' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const [on, setOn] = useState(false);
  const bg = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, ${color}, transparent 70%)`;
  return (
    <div ref={ref} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
      className={`relative overflow-hidden ${className}`}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ background: bg, opacity: on ? 1 : 0 }} />
      <div className="relative">{children}</div>
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

// petit label de numérotation de section, style éditorial
const SectionTag: React.FC<{ index: string; label: string }> = ({ index, label }) => (
  <div className="mb-7 flex items-center gap-4">
    <span className="font-serif-i text-lg italic text-green">{index}</span>
    <span className="h-px w-10 bg-bone/25" />
    <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-bone-soft">{label}</span>
  </div>
);

// ---------- HERO BACKGROUND (dark editorial) ----------
const HeroBg: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    {/* halo vert très discret en haut */}
    <motion.div className="absolute left-1/2 top-[-12%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-[150px]"
      style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.16), transparent)' }}
      animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
    {/* lueur froide à droite */}
    <motion.div className="absolute right-[-8%] top-[20%] h-[45vh] w-[40vw] rounded-full blur-[140px]"
      style={{ background: 'radial-gradient(closest-side, rgba(40,60,80,0.5), transparent)' }}
      animate={{ x: [0, -30, 0], y: [0, 30, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />
    {/* grain de points très subtil */}
    <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'radial-gradient(circle, rgba(245,243,239,0.06) 1px, transparent 1px)', backgroundSize: '30px 30px', maskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, black, transparent)' }} />
    {/* vignette bas pour fondu */}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-noir" />
  </div>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-bone/10 bg-noir/80 py-3 backdrop-blur-xl' : 'py-6'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-2xl tracking-tight text-bone">axem<span className="text-green"> IA</span></a>
        <div className="hidden items-center gap-9 md:flex">
          {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-sm font-medium text-bone-soft transition-colors hover:text-bone">
              {l}<span className="absolute -bottom-1 left-0 h-px w-0 bg-green transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
          className="group inline-flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-noir">
          Prendre rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------- FUSION ----------
const Fusion: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => { const a = setTimeout(() => setPhase(1), 1100); const b = setTimeout(() => setPhase(2), 2000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="flex h-8 items-center justify-center" aria-label="Alexis + Clément = AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.42em] text-bone-soft">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 90 : 0, scale: phase === 1 ? 1.4 : 1 }} transition={{ duration: 0.5 }} className="text-green">+</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-0.5">
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="font-display text-xl tracking-tight text-bone">{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1 font-display text-xl tracking-tight text-green">IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- HERO ----------
const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden px-6 pt-40 pb-28">
    <HeroBg />
    <div className="mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 flex flex-col items-start gap-5">
        <Fusion />
        <div className="inline-flex items-center gap-2.5 rounded-full border border-bone/15 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-bone-soft">Agence d'IA & organisme de formation certifié Qualiopi</span>
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} transition={{ duration: 1, delay: 0.25, ease }}
        className="font-display text-[clamp(52px,11vw,160px)] font-light leading-[0.94] tracking-[-0.03em] text-bone">
        Votre partenaire IA,<br /><span className="font-serif-i italic text-green">de A à Z.</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-10 max-w-2xl text-2xl font-light leading-snug text-bone md:text-3xl">
        On vous forme, on vous conseille, on déploie. <span className="font-serif-i italic text-green">Et on reste.</span>
      </motion.p>

      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }} className="mt-7 max-w-2xl text-base leading-relaxed text-bone-soft md:text-lg">
        AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi.
        Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique,
        de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }} className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-9 text-base font-bold text-noir shadow-[0_18px_60px_-18px_rgba(0,250,154,0.6)]" style={{ paddingTop: 19, paddingBottom: 19 }}>
          <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
          <span className="relative">Prendre rendez-vous</span>
          <span className="relative transition-transform group-hover:translate-x-1">→</span>
        </Magnetic>
        <a href="#prestations" className="group text-base font-medium text-bone-soft hover:text-bone">
          <span className="border-b border-bone/20 pb-0.5 transition-colors group-hover:border-bone">Découvrir nos prestations</span> ↓
        </a>
      </motion.div>
    </div>
  </section>
);

// ---------- TRUST ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  return (
    <section id="references" className="border-y border-bone/10 bg-noir-2 py-12">
      <p className="mb-7 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-bone-soft">Ils nous font confiance</p>
      <div className="group relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div className="flex w-max gap-14 px-6 [animation:marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]" style={{ animation: 'marquee 40s linear infinite' }}>
          {[...logos, ...logos].map((l, i) => (
            <span key={l + i} className="shrink-0 whitespace-nowrap font-display text-2xl font-light text-bone/45 transition-colors hover:text-green">{l}</span>
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
    <section id="prestations" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionTag index="01" label="Ce qu'on fait" /></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-4xl font-display text-[clamp(40px,7vw,96px)] font-light leading-[1.0] tracking-[-0.02em] text-bone">Sept prestations. <span className="font-serif-i italic text-bone-soft">Un seul partenaire.</span></h2></Reveal>
        <div className="mt-16 grid gap-px overflow-hidden border-t border-bone/12 md:grid-cols-2">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.08}>
              <Spotlight className="h-full border-b border-bone/12 md:[&:nth-child(odd)]:border-r">
                <div className="group flex h-full flex-col gap-5 px-2 py-10 transition-colors md:px-8">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-i text-4xl italic text-green transition-transform duration-300 group-hover:-translate-y-0.5">{s.n}</span>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-bone-soft">{s.price}</span>
                  </div>
                  <h3 className="font-display text-3xl font-light tracking-tight text-bone md:text-4xl">{s.t}</h3>
                  <p className="max-w-md text-base leading-relaxed text-bone-soft">{s.d}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-green opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="h-px w-6 bg-green" />En savoir plus →
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
    <section id="duo" className="border-y border-bone/10 bg-noir-2 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionTag index="02" label="Les fondateurs" /></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-4xl font-display text-[clamp(40px,7vw,96px)] font-light leading-[1.0] tracking-[-0.02em] text-bone">AXEM, c'est nous deux.</h2></Reveal>
        <Reveal delay={0.2}><p className="mt-7 max-w-xl text-lg leading-relaxed text-bone-soft"><span className="text-bone">A</span>lexis + Cl<span className="text-bone">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.</p></Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <Tilt max={4}>
                <div className="group flex h-full flex-col overflow-hidden rounded-sm border border-bone/12 bg-noir transition-shadow duration-300 hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
                  <div className="relative overflow-hidden">
                    <img src={f.img} alt={f.name} loading="lazy" className="aspect-[4/5] w-full object-cover grayscale brightness-90 transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:brightness-100" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
                    <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 bg-noir/60 text-bone backdrop-blur transition-all hover:scale-110 hover:border-green hover:text-green" aria-label={`LinkedIn ${f.name}`}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                    </a>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-8">
                    <div>
                      <h3 className="font-display text-4xl font-light tracking-tight text-bone">{f.name}</h3>
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-green">{f.school}</p>
                      <p className="mt-1 text-sm text-bone-soft">{f.role}</p>
                    </div>
                    <p className="text-base leading-relaxed text-bone-soft">{f.desc}</p>
                    <div className="mt-auto flex items-baseline gap-2.5 border-t border-bone/12 pt-6">
                      <span className="font-display text-5xl font-light text-bone"><Counter value={f.n} prefix="+" /></span>
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-bone-soft">abonnés LinkedIn</span>
                    </div>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}><p className="mt-14 text-center font-serif-i text-4xl italic text-bone md:text-5xl">Ensemble, <span className="text-green">AXEM</span>.</p></Reveal>
      </div>
    </section>
  );
};

// ---------- PROOF ----------
const Proof: React.FC = () => {
  const stats = [{ v: 55000, p: '+', l: 'abonnés LinkedIn' }, { v: 10, p: '', l: 'formations Qualiopi' }, { v: 70, p: '', s: ' %', l: 'de pratique' }, { v: null, l: 'opérationnel', txt: 'J+1' }];
  const cases = [{ sector: 'BTP · Chiffrage', r: '80 %', d: 'de temps de saisie économisé · 95 k€/an neutralisés' }, { sector: 'Administration · OCR', r: '×4', d: 'plus rapide · fiabilité 100 % par double vérification' }, { sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois · anomalies détectées > 98 %' }];
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 border-b border-bone/12 pb-24 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="group cursor-default">
                <div className="font-display text-[clamp(46px,6vw,88px)] font-light leading-none text-bone transition-colors group-hover:text-green">
                  {s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}
                </div>
                <div className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-bone-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><h2 className="mt-24 max-w-4xl font-display text-[clamp(34px,6vw,80px)] font-light leading-[1.02] tracking-[-0.02em] text-bone">Des résultats. <span className="font-serif-i italic text-bone-soft">Pas des slides.</span></h2></Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.1}>
              <Tilt max={4}>
                <Spotlight className="h-full rounded-sm border border-bone/12 bg-noir-2">
                  <div className="flex h-full flex-col gap-5 p-8">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-green">{c.sector}</span>
                    <span className="font-display text-7xl font-light leading-none text-bone">{c.r}</span>
                    <p className="text-base leading-relaxed text-bone-soft">{c.d}</p>
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
    <section id="methode" className="border-t border-bone/10 bg-noir-2 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionTag index="03" label="Notre méthode" /></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-4xl font-display text-[clamp(40px,7vw,96px)] font-light leading-[1.0] tracking-[-0.02em] text-bone">En 3 étapes. <span className="font-serif-i italic text-green">Pas une de plus.</span></h2></Reveal>
        <div className="mt-16 grid gap-px border-t border-bone/12 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="group flex h-full flex-col gap-5 border-b border-bone/12 py-10 md:border-b-0 md:[&:not(:last-child)]:border-r md:px-8 md:first:pl-0">
                <div className="flex items-center justify-between">
                  <span className="font-display text-7xl font-light leading-none text-bone transition-colors group-hover:text-green">{s.n}</span>
                  <span className="rounded-full border border-green/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-green">{s.meta}</span>
                </div>
                <h3 className="font-display text-3xl font-light tracking-tight text-bone">{s.t}</h3>
                <p className="max-w-xs text-base leading-relaxed text-bone-soft">{s.d}</p>
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
  <section className="px-6 py-32">
    <Spotlight className="mx-auto max-w-5xl rounded-sm border border-bone/12 bg-noir-2 px-8 py-24 text-center md:px-16" color="rgba(0,250,154,0.16)">
      <Reveal><h2 className="mx-auto max-w-3xl font-display text-[clamp(40px,7vw,104px)] font-light leading-[0.98] tracking-[-0.02em] text-bone">Parlons de votre <span className="font-serif-i italic text-green">projet IA.</span></h2></Reveal>
      <Reveal delay={0.1}><p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-bone-soft">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p></Reveal>
      <Reveal delay={0.2}>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3} className="group mt-12 inline-flex items-center gap-3 rounded-full bg-green px-10 py-5 text-base font-bold text-noir shadow-[0_18px_60px_-16px_rgba(0,250,154,0.5)]">
          Réserver un diagnostic gratuit <span className="transition-transform group-hover:translate-x-1">→</span>
        </Magnetic>
      </Reveal>
    </Spotlight>
  </section>
);

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="border-t border-bone/10 bg-noir px-6 py-20">
    <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-3xl tracking-tight text-bone">axem<span className="text-green"> IA</span></div>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
      </div>
      <div>
        <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-bone-soft">Navigation</div>
        <ul className="space-y-2.5 text-sm text-bone-soft">{[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-bone">{l}</a></li>))}</ul>
      </div>
      <div>
        <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-bone-soft">Contact</div>
        <ul className="space-y-2.5 text-sm text-bone-soft">
          <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bone">Prendre rendez-vous</a></li>
          <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-bone">contact@axem-ia.fr</a></li>
          <li>axem-ia.fr</li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-bone/12 pt-8 text-xs text-bone-soft md:flex-row">
      <span>© 2026 AXEM IA — Paris, France</span>
      <span className="inline-flex items-center gap-1.5">
        <svg className="h-3.5 w-3.5 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Qualiopi · Finançable OPCO
      </span>
    </div>
  </footer>
);

const Home: React.FC = () => (
  <div className="min-h-screen bg-noir">
    <Nav />
    <main><Hero /><Trust /><Services /><Duo /><Proof /><Method /><FinalCTA /></main>
    <Footer />
  </div>
);

export default Home;
