import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
  useMotionTemplate, useInView, useReducedMotion, useScroll,
} from 'framer-motion';

// =====================================================================
// AXEM IA — version CALME + background hero premium (mesh gradient animé)
// On garde : split-text hero, fusion AXEM, split-screen duo (signature),
// stacking cards, magnetic CTA, compteurs, sticky CTA.
// On retire : curseur custom, scroll horizontal agressif, skew marquee.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.2, 0.8, 0.2, 1] as const;

// ---------- helpers ----------
const SplitText: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className, delay = 0 }) => (
  <motion.span initial="h" whileInView="v" viewport={{ once: true, margin: '-60px' }}
    variants={{ v: { transition: { staggerChildren: 0.025, delayChildren: delay } } }} className={className}>
    {text.split(' ').map((w, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom">
        <motion.span className="inline-block" variants={{ h: { y: '110%' }, v: { y: 0, transition: { duration: 0.7, ease } } }}>{w}&nbsp;</motion.span>
      </span>
    ))}
  </motion.span>
);

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease }} className={className}>{children}</motion.div>
);

const Magnetic: React.FC<any> = ({ children, strength = 0.35, className, ...p }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.5 });
  const reduce = useReducedMotion();
  return <motion.a ref={ref} onMouseMove={(e) => { if (reduce) return; const r = ref.current!.getBoundingClientRect(); x.set((e.clientX - (r.left + r.width / 2)) * strength); y.set((e.clientY - (r.top + r.height / 2)) * strength); }}
    onMouseLeave={() => { x.set(0); y.set(0); }} style={{ x: sx, y: sy }} className={className} {...p}>{children}</motion.a>;
};

const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; className?: string }> = ({ value, prefix = '', suffix = '', className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return; const s = performance.now(); let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - s) / 1500); setN(Math.round((1 - Math.pow(1 - k, 3)) * value)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref} className={className}>{prefix}{n >= 1000 ? n.toLocaleString('fr-FR') : n}{suffix}</span>;
};

const Spotlight: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const [on, setOn] = useState(false);
  const bg = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, rgba(0,250,154,0.10), transparent 70%)`;
  return (
    <div ref={ref} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }}
      className={`relative overflow-hidden ${className}`}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ background: bg, opacity: on ? 1 : 0 }} />
      <div className="relative">{children}</div>
    </div>
  );
};

// ---------- HERO BACKGROUND PREMIUM (mesh gradient animé subtil) ----------
const HeroBackground: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    {/* mesh : 3 nappes de couleur floues qui dérivent doucement */}
    <div className="absolute left-[-15%] top-[-10%] h-[70vh] w-[60vw] rounded-full blur-[130px]"
      style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.30), transparent)', animation: 'axem-drift1 22s ease-in-out infinite' }} />
    <div className="absolute right-[-10%] top-[-5%] h-[60vh] w-[50vw] rounded-full blur-[140px]"
      style={{ background: 'radial-gradient(closest-side, rgba(22,120,90,0.45), transparent)', animation: 'axem-drift2 26s ease-in-out infinite' }} />
    <div className="absolute bottom-[-20%] left-1/3 h-[55vh] w-[45vw] rounded-full blur-[120px]"
      style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.16), transparent)', animation: 'axem-drift3 30s ease-in-out infinite' }} />
    {/* grille très fine masquée */}
    <div className="absolute inset-0 opacity-[0.55]" style={{ backgroundImage: 'linear-gradient(rgba(245,243,239,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(245,243,239,0.035) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 75% 55% at 50% 35%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 35%, black, transparent)' }} />
    {/* grain doux */}
    <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    {/* fade bas vers le noir */}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
  </div>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'border-b border-cream/10 bg-ink/70 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-2xl font-semibold tracking-tight">axem<span className="text-green"> IA</span></a>
        <div className="hidden items-center gap-8 md:flex">
          {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-sm font-medium text-cream-soft transition-colors hover:text-cream">{l}<span className="absolute -bottom-1 left-0 h-px w-0 bg-green transition-all duration-300 group-hover:w-full" /></a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25} className="inline-flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-ink">Prendre rendez-vous →</Magnetic>
      </div>
    </nav>
  );
};

// ---------- HERO ----------
const Fusion: React.FC = () => {
  const [p, setP] = useState<0 | 1 | 2>(0);
  useEffect(() => { const a = setTimeout(() => setP(1), 1000); const b = setTimeout(() => setP(2), 1900); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="flex h-8 items-center justify-center">
      <AnimatePresence mode="wait">
        {p < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }} className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.4em] text-cream-soft">
            <motion.span animate={p === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: p === 1 ? 90 : 0, scale: p === 1 ? 1.4 : 1 }} transition={{ duration: 0.5 }} className="text-green">+</motion.span>
            <motion.span animate={p === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-0.5">
            {'AXEM'.split('').map((l, i) => <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="font-display text-xl font-semibold">{l}</motion.span>)}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1 font-display text-xl font-semibold text-green">IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Hero: React.FC = () => (
  <section id="top" className="relative flex min-h-[100vh] items-center justify-center overflow-hidden px-6 text-center">
    <HeroBackground />
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex flex-col items-center gap-4">
        <Fusion />
        <div className="inline-flex items-center gap-2 rounded-full border border-cream/10 bg-cream/[0.04] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream-soft">Agence d'IA & organisme de formation certifié Qualiopi</span>
        </div>
      </motion.div>

      <h1 className="font-display text-[clamp(46px,9vw,124px)] font-medium leading-[0.98] tracking-[-0.04em]">
        <SplitText text="Votre partenaire IA," delay={0.3} /><br />
        <span className="font-serif-i italic text-green">de A à Z.</span>
      </h1>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }} className="mt-7 text-xl font-medium md:text-2xl">
        On vous forme, on vous conseille, on déploie. <span className="font-serif-i italic text-green">Et on reste.</span>
      </motion.p>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.05 }} className="mt-6 max-w-2xl text-base leading-relaxed text-cream-soft md:text-lg">
        AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi. Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique, de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.2 }} className="mt-11 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-green px-9 py-4 text-base font-bold text-ink">
          <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Prendre rendez-vous</span><span className="relative">→</span>
        </Magnetic>
        <a href="#prestations" className="text-base font-medium text-cream-soft hover:text-cream">Découvrir nos prestations ↓</a>
      </motion.div>
    </div>
  </section>
);

// ---------- TRUST (marquee propre, CSS) ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  return (
    <section id="references" className="border-y border-cream/10 bg-ink-2 py-10">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-cream-soft">Ils nous font confiance</p>
      <div className="group relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div className="flex w-max gap-12 px-6 group-hover:[animation-play-state:paused]" style={{ animation: 'axem-marquee 45s linear infinite' }}>
          {[...logos, ...logos].map((l, i) => <span key={i} className="shrink-0 whitespace-nowrap font-display text-2xl font-medium text-cream/45 transition-colors hover:text-green">{l}</span>)}
        </div>
      </div>
    </section>
  );
};

// ---------- SERVICES (grille calme + spotlight) ----------
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
    <section id="prestations" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green"><span className="h-1.5 w-1.5 bg-green" />Ce qu'on fait</div></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-3xl font-display text-[clamp(34px,5vw,68px)] font-medium leading-[1.05] tracking-[-0.03em]">Sept prestations. <span className="text-cream-soft">Un seul partenaire.</span></h2></Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 md:grid-cols-2">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.08}>
              <Spotlight className="h-full bg-ink-2 transition-colors hover:bg-[#161616]">
                <div className="group flex h-full flex-col gap-4 p-8 md:p-10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl font-medium text-green transition-transform duration-300 group-hover:-translate-y-0.5">{s.n}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-cream-soft">{s.price}</span>
                  </div>
                  <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">{s.t}</h3>
                  <p className="text-base leading-relaxed text-cream-soft">{s.d}</p>
                  <div className="mt-2 h-px w-10 bg-green/40 transition-all duration-300 group-hover:w-24" />
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- DUO — split-screen réactif souris (la signature, conservée) ----------
const Duo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const split = useMotionValue(50);
  const ss = useSpring(split, { stiffness: 90, damping: 22 });
  const leftW = useMotionTemplate`${ss}%`;
  const reduce = useReducedMotion();
  const move = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current!.getBoundingClientRect();
    const pct = ((e.clientX - r.left) / r.width) * 100;
    split.set(Math.max(32, Math.min(68, pct)));
  };
  return (
    <section id="duo" className="border-y border-cream/10 bg-ink py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal><div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green"><span className="h-1.5 w-1.5 bg-green" />Les fondateurs</div></Reveal>
        <Reveal delay={0.1}><h2 className="font-display text-[clamp(34px,5vw,68px)] font-medium leading-[1.05] tracking-[-0.03em]">AXEM, c'est nous deux.</h2></Reveal>
        <Reveal delay={0.2}><p className="mt-5 max-w-xl text-lg text-cream-soft"><span className="font-semibold text-cream">A</span>lexis + Cl<span className="font-semibold text-cream">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.</p></Reveal>
      </div>
      <div ref={ref} onMouseMove={move} onMouseLeave={() => split.set(50)} className="relative mx-auto mt-12 flex h-[68vh] max-w-7xl overflow-hidden rounded-none md:px-6">
        <motion.div style={{ width: leftW }} className="relative h-full shrink-0 overflow-hidden">
          <img src={CLEMENT_IMG} alt="Clément Predo" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-green">ESSEC · Stratégie · Conseil</div>
            <div className="mt-2 font-display text-4xl font-medium tracking-tight md:text-6xl">Clément Predo</div>
            <p className="mt-3 max-w-sm text-sm text-cream/80 md:text-base">Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="font-display text-3xl font-medium md:text-4xl"><Counter value={40000} prefix="+" /></span>
              <span className="text-xs uppercase tracking-[0.14em] text-cream-soft">abonnés LinkedIn</span>
              <a href="https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-cream/30 px-3 py-1 text-xs font-semibold hover:border-green hover:text-green">LinkedIn →</a>
            </div>
          </div>
        </motion.div>
        <div className="relative z-10 w-[3px] shrink-0 bg-green shadow-[0_0_24px_rgba(0,250,154,0.6)]" />
        <div className="relative h-full flex-1 overflow-hidden">
          <img src={ALEXIS_IMG} alt="Alexis Zeitoun" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <div className="absolute bottom-0 right-0 p-8 text-right md:p-12">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-green">Polytechnique · Tech · Déploiement</div>
            <div className="mt-2 font-display text-4xl font-medium tracking-tight md:text-6xl">Alexis Zeitoun</div>
            <p className="mt-3 ml-auto max-w-sm text-sm text-cream/80 md:text-base">L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.</p>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-4">
              <a href="https://www.linkedin.com/in/alexiszeitoun/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-cream/30 px-3 py-1 text-xs font-semibold hover:border-green hover:text-green">LinkedIn →</a>
              <span className="text-xs uppercase tracking-[0.14em] text-cream-soft">abonnés LinkedIn</span>
              <span className="font-display text-3xl font-medium md:text-4xl"><Counter value={15000} prefix="+" /></span>
            </div>
          </div>
        </div>
      </div>
      <Reveal delay={0.1}><p className="mt-10 text-center font-serif-i text-3xl italic md:text-4xl">Ensemble, <span className="text-green">AXEM</span>.</p></Reveal>
    </section>
  );
};

// ---------- PROOF + CASES (stacking calme) ----------
const Proof: React.FC = () => {
  const stats = [{ v: 55000, p: '+', l: 'abonnés LinkedIn' }, { v: 10, p: '', l: 'formations Qualiopi' }, { v: 70, p: '', s: ' %', l: 'de pratique' }, { v: null, l: 'opérationnel', txt: 'J+1' }];
  const cases = [
    { sector: 'BTP · Chiffrage', r: '80 %', d: 'de temps de saisie économisé · 95 k€/an neutralisés', bg: 'bg-ink-2' },
    { sector: 'Administration · OCR', r: '×4', d: 'plus rapide · fiabilité 100 % par double vérification', bg: 'bg-[#161616]' },
    { sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois · anomalies détectées > 98 %', bg: 'bg-[#1c1c1c]' },
  ];
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 border-b border-cream/10 pb-20 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="group cursor-default">
                <div className="font-display text-[clamp(40px,5vw,72px)] font-medium leading-none transition-colors group-hover:text-green">{s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-cream-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><h2 className="mt-20 font-display text-[clamp(30px,4.5vw,56px)] font-medium leading-[1.08] tracking-[-0.03em]">Des résultats. <span className="text-cream-soft">Pas des slides.</span></h2></Reveal>
      </div>
      <div className="mx-auto mt-12 max-w-4xl">
        {cases.map((c, i) => (
          <div key={i} className="sticky" style={{ top: `${120 + i * 26}px` }}>
            <div className={`mb-6 flex flex-col gap-4 rounded-3xl border border-cream/10 ${c.bg} p-10 md:flex-row md:items-center md:justify-between md:p-14`}>
              <div className="md:max-w-xs">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-green">{c.sector}</span>
                <p className="mt-3 text-base leading-relaxed text-cream-soft">{c.d}</p>
              </div>
              <span className="font-display text-[clamp(56px,9vw,120px)] font-medium leading-none text-cream">{c.r}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ---------- METHOD ----------
const Method: React.FC = () => {
  const steps = [{ n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' }, { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' }, { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' }];
  return (
    <section id="methode" className="border-t border-cream/10 bg-ink-2 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><h2 className="font-display text-[clamp(34px,5vw,68px)] font-medium leading-[1.05] tracking-[-0.03em]">En 3 étapes. <span className="text-green">Pas une de plus.</span></h2></Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="group flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-6xl font-medium transition-colors group-hover:text-green">{s.n}</span>
                  <span className="rounded-full bg-green/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-green">{s.meta}</span>
                </div>
                <h3 className="font-display text-2xl font-medium tracking-tight">{s.t}</h3>
                <p className="text-base leading-relaxed text-cream-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA: React.FC = () => (
  <section className="px-6 py-28">
    <Spotlight className="mx-auto max-w-5xl rounded-[40px] border border-green/20 bg-gradient-to-b from-ink-2 to-ink px-8 py-20 text-center md:px-16">
      <Reveal><h2 className="mx-auto max-w-3xl font-display text-[clamp(34px,5vw,72px)] font-medium leading-[1.04] tracking-[-0.03em]">Parlons de votre <span className="font-serif-i italic text-green">projet IA.</span></h2></Reveal>
      <Reveal delay={0.1}><p className="mx-auto mt-6 max-w-xl text-lg text-cream-soft">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p></Reveal>
      <Reveal delay={0.2}><Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" className="mt-11 inline-flex items-center gap-3 rounded-full bg-green px-10 py-5 text-base font-bold text-ink">Réserver un diagnostic gratuit →</Magnetic></Reveal>
    </Spotlight>
  </section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-cream/10 bg-ink px-6 py-16">
    <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-3xl font-semibold tracking-tight">axem<span className="text-green"> IA</span></div>
        <p className="mt-3 max-w-xs text-sm text-cream-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
      </div>
      <div>
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-soft">Navigation</div>
        <ul className="space-y-2 text-sm text-cream-soft">{[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => <li key={l}><a href={h} className="hover:text-cream">{l}</a></li>)}</ul>
      </div>
      <div>
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-soft">Contact</div>
        <ul className="space-y-2 text-sm text-cream-soft">
          <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="hover:text-cream">Prendre rendez-vous</a></li>
          <li><a href="mailto:contact@axem-ia.fr" className="hover:text-cream">contact@axem-ia.fr</a></li>
          <li>axem-ia.fr</li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-cream/10 pt-8 text-xs text-cream-soft md:flex-row">
      <span>© 2026 AXEM IA — Paris, France</span>
      <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>Qualiopi · Finançable OPCO</span>
    </div>
  </footer>
);

const StickyCTA: React.FC = () => {
  const [show, setShow] = useState(false);
  useEffect(() => { const h = () => setShow(window.scrollY > window.innerHeight * 1.3); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a href={CALENDLY} target="_blank" rel="noopener noreferrer" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-green px-6 py-3.5 text-sm font-bold text-ink shadow-[0_10px_40px_-8px_rgba(0,250,154,0.6)]">
          Prendre rendez-vous →
        </motion.a>
      )}
    </AnimatePresence>
  );
};

const Home: React.FC = () => (
  <div className="min-h-screen bg-ink">
    <Nav />
    <main><Hero /><Trust /><Services /><Duo /><Proof /><Method /><FinalCTA /></main>
    <Footer />
    <StickyCTA />
  </div>
);

export default Home;
