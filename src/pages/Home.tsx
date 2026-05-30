import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
  useMotionTemplate, useInView, useReducedMotion, useScroll, useVelocity,
} from 'framer-motion';

// =====================================================================
// AXEM IA — "WOW" edition : effets scroll/hover avancés
// Curseur custom · split-text · parallax · scroll horizontal · split-screen
// duo réactif souris · marquee skew vélocité · stacking cards · magnetic
// Contenu verrouillé (de A à Z, fusion AXEM, 7 prestations, duo…)
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.2, 0.8, 0.2, 1] as const;

// ---------- CURSEUR CUSTOM ----------
const Cursor: React.FC = () => {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 30, mass: 0.4 });
  const tx = useSpring(x, { stiffness: 90, damping: 18 });
  const ty = useSpring(y, { stiffness: 90, damping: 18 });
  const [hover, setHover] = useState(false);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX); y.set(e.clientY); if (!vis) setVis(true);
      const t = e.target as HTMLElement;
      setHover(!!t.closest('a,button,[data-cursor]'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y, vis]);
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;
  if (!vis) return null;
  return (
    <>
      <motion.div style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }} animate={{ scale: hover ? 0 : 1 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-green" />
      <motion.div style={{ x: tx, y: ty, translateX: '-50%', translateY: '-50%' }} animate={{ scale: hover ? 1.6 : 1, opacity: hover ? 1 : 0.5 }}
        className="pointer-events-none fixed left-0 top-0 z-[99] flex h-10 w-10 items-center justify-center rounded-full border border-green mix-blend-difference">
        <AnimatePresence>{hover && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-display text-xs font-semibold text-green">→</motion.span>}</AnimatePresence>
      </motion.div>
    </>
  );
};

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

const Magnetic: React.FC<any> = ({ children, strength = 0.4, className, ...p }) => {
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
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3} className="inline-flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-ink">Prendre rendez-vous →</Magnetic>
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

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const op = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  return (
    <section id="top" ref={ref} className="relative flex min-h-[100vh] items-center justify-center overflow-hidden px-6 text-center">
      <motion.div aria-hidden style={{ y: y2 }} className="pointer-events-none absolute left-1/2 top-[15%] -z-10 h-[55vh] w-[80vw] -translate-x-1/2 rounded-full blur-[140px]">
        <motion.div className="h-full w-full rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(0,250,154,0.4), transparent)' }} animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]" style={{ backgroundImage: 'linear-gradient(rgba(245,243,239,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,243,239,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 70% 50% at 50% 35%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 35%, black, transparent)' }} />

      <motion.div style={{ opacity: op }} className="mx-auto flex max-w-3xl flex-col items-center">
        <motion.div style={{ y: y1 }}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex flex-col items-center gap-4">
            <Fusion />
            <div className="inline-flex items-center gap-2 rounded-full border border-cream/10 bg-cream/[0.04] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream-soft">Agence d'IA & organisme de formation certifié Qualiopi</span>
            </div>
          </motion.div>

          <h1 className="font-display text-[clamp(46px,9vw,128px)] font-medium leading-[0.98] tracking-[-0.04em]">
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
        </motion.div>
      </motion.div>
    </section>
  );
};

// ---------- MARQUEE skew vélocité ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const skew = useSpring(useTransform(vel, [-2000, 0, 2000], [-6, 0, 6]), { stiffness: 100, damping: 20 });
  const x = useMotionValue(0);
  const xPct = useMotionTemplate`${x}%`;
  useEffect(() => {
    let raf = 0, last = performance.now();
    const loop = (t: number) => { const d = t - last; last = t; const cur = x.get() - (d * 0.04); x.set(cur <= -50 ? 0 : cur); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [x]);
  return (
    <section id="references" className="border-y border-cream/10 bg-ink-2 py-10">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-cream-soft">Ils nous font confiance</p>
      <motion.div style={{ skewX: skew }} className="overflow-hidden">
        <div className="relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <motion.div style={{ x: xPct }} className="flex w-max gap-12 px-6">
            {[...logos, ...logos].map((l, i) => <span key={i} className="shrink-0 whitespace-nowrap font-display text-2xl font-medium text-cream/45 transition-colors hover:text-green">{l}</span>)}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// ---------- SERVICES — scroll horizontal pinné ----------
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-72%']);
  return (
    <section id="prestations" ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-6xl px-6">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green"><span className="h-1.5 w-1.5 bg-green" />Ce qu'on fait</div>
          <h2 className="font-display text-[clamp(30px,5vw,64px)] font-medium leading-[1.05] tracking-[-0.03em]">Sept prestations. <span className="text-cream-soft">Un seul partenaire.</span></h2>
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-6">
          {items.map((s) => (
            <div key={s.n} data-cursor className="group flex h-[58vh] w-[80vw] shrink-0 flex-col justify-between rounded-3xl border border-cream/10 bg-ink-2 p-9 transition-colors hover:border-green/40 md:w-[440px]">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-5xl font-medium text-green">{s.n}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-cream-soft">{s.price}</span>
              </div>
              <div>
                <h3 className="font-display text-3xl font-medium tracking-tight md:text-4xl">{s.t}</h3>
                <p className="mt-4 text-base leading-relaxed text-cream-soft">{s.d}</p>
                <div className="mt-6 h-px w-10 bg-green/50 transition-all duration-300 group-hover:w-24" />
              </div>
            </div>
          ))}
        </motion.div>
        <p className="mx-auto mt-8 max-w-6xl px-6 text-xs uppercase tracking-[0.2em] text-cream-soft">↔ Continuez à scroller</p>
      </div>
    </section>
  );
};

// ---------- DUO — split-screen réactif souris ----------
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
    split.set(Math.max(28, Math.min(72, pct)));
  };
  return (
    <section id="duo" className="border-y border-cream/10 bg-ink py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green"><span className="h-1.5 w-1.5 bg-green" />Les fondateurs</div>
        <h2 className="font-display text-[clamp(34px,5vw,68px)] font-medium leading-[1.05] tracking-[-0.03em]">AXEM, c'est nous deux.</h2>
        <p className="mt-5 max-w-xl text-lg text-cream-soft"><span className="font-semibold text-cream">A</span>lexis + Cl<span className="font-semibold text-cream">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.</p>
      </div>
      <div ref={ref} onMouseMove={move} onMouseLeave={() => split.set(50)} className="relative mx-auto mt-12 flex h-[70vh] max-w-7xl overflow-hidden md:px-6">
        <motion.div style={{ width: leftW }} className="relative h-full shrink-0 overflow-hidden">
          <img src={CLEMENT_IMG} alt="Clément Predo" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-green">ESSEC · Stratégie · Formation · Conseil</div>
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
          <img src={ALEXIS_IMG} alt="Alexis Zeitoun" className="h-full w-full object-cover" />
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
      <p className="mt-10 text-center font-serif-i text-3xl italic md:text-4xl">Ensemble, <span className="text-green">AXEM</span>.</p>
      <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-cream-soft">↔ Bougez la souris</p>
    </section>
  );
};

// ---------- PROOF + CASES (stacking) ----------
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
            <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group cursor-default">
              <div className="font-display text-[clamp(40px,5vw,72px)] font-medium leading-none transition-colors group-hover:text-green">{s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}</div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-cream-soft">{s.l}</div>
            </motion.div>
          ))}
        </div>
        <h2 className="mt-20 font-display text-[clamp(30px,4.5vw,56px)] font-medium leading-[1.08] tracking-[-0.03em]">Des résultats. <span className="text-cream-soft">Pas des slides.</span></h2>
      </div>
      <div className="mx-auto mt-12 max-w-4xl">
        {cases.map((c, i) => (
          <div key={i} className="sticky" style={{ top: `${120 + i * 28}px` }}>
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
        <h2 className="font-display text-[clamp(34px,5vw,68px)] font-medium leading-[1.05] tracking-[-0.03em]">En 3 étapes. <span className="text-green">Pas une de plus.</span></h2>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, ease }} className="group flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-6xl font-medium transition-colors group-hover:text-green">{s.n}</span>
                <span className="rounded-full bg-green/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-green">{s.meta}</span>
              </div>
              <h3 className="font-display text-2xl font-medium tracking-tight">{s.t}</h3>
              <p className="text-base leading-relaxed text-cream-soft">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA: React.FC = () => (
  <section className="px-6 py-28">
    <div className="mx-auto max-w-5xl rounded-[40px] border border-green/20 bg-gradient-to-b from-ink-2 to-ink px-8 py-20 text-center md:px-16">
      <h2 className="mx-auto max-w-3xl font-display text-[clamp(34px,5vw,72px)] font-medium leading-[1.04] tracking-[-0.03em]">Parlons de votre <span className="font-serif-i italic text-green">projet IA.</span></h2>
      <p className="mx-auto mt-6 max-w-xl text-lg text-cream-soft">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p>
      <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" className="mt-11 inline-flex items-center gap-3 rounded-full bg-green px-10 py-5 text-base font-bold text-ink">Réserver un diagnostic gratuit →</Magnetic>
    </div>
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
  useEffect(() => { const h = () => setShow(window.scrollY > window.innerHeight * 1.2); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
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
    <Cursor />
    <Nav />
    <main><Hero /><Trust /><Services /><Duo /><Proof /><Method /><FinalCTA /></main>
    <Footer />
    <StickyCTA />
  </div>
);

export default Home;
