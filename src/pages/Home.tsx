import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useInView, useReducedMotion,
} from 'framer-motion';

// =====================================================================
// AXEM IA — STYLE "SWISS MINIMAL MONO"
// Ultra-épuré · noir/blanc · monospace · lignes de grille · rigueur premium
// Accent vert AXEM (#00FA9A) RARE : un point, un soulignement, le CTA.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.2, 0.8, 0.2, 1] as const;

// ---------- helpers ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease }} className={className}>{children}</motion.div>
);

const Magnetic: React.FC<any> = ({ children, strength = 0.25, className, ...props }) => {
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

// petit label mono "index" : 01 / 07
const Index: React.FC<{ n: string; total: string; className?: string }> = ({ n, total, className = '' }) => (
  <span className={`font-mono text-[11px] tracking-[0.1em] text-ink-soft ${className}`}>{n} <span className="text-ink-soft/50">/ {total}</span></span>
);

// label section : carré vert + texte mono
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
    <span className="h-1.5 w-1.5 bg-green" />
    {children}
  </div>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${s ? 'border-black/10 bg-paper/90 py-3 backdrop-blur-xl' : 'border-transparent py-5'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-xl font-semibold tracking-tight text-ink">axem<span className="text-ink-soft"> IA</span></a>
        <div className="hidden items-center gap-9 md:flex">
          {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative font-mono text-[12px] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-ink">
              {l}<span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.2}
          className="group inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-paper transition-colors hover:bg-paper hover:text-ink">
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
    <div className="flex h-7 items-center justify-center" aria-label="Alexis + Clément = AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-soft">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 90 : 0 }} transition={{ duration: 0.5 }} className="text-green-deep">+</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease }} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-ink">
            <span className="text-ink-soft">→</span>
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="font-semibold">{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="font-semibold text-green-deep">IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- HERO ----------
const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden border-b border-black/10 px-6 pt-36 pb-20">
    {/* grille verticale de fond, subtile */}
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="mx-auto h-full max-w-6xl border-x border-black/[0.06]" />
    </div>
    <div className="mx-auto max-w-6xl">
      {/* index + fusion en haut */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex flex-col items-start gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <Fusion />
        <div className="inline-flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 bg-green" />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">Agence d'IA & organisme de formation certifié Qualiopi</span>
        </div>
      </motion.div>

      <div className="grid gap-10 pt-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease }}
            className="font-display text-[clamp(44px,8vw,108px)] font-medium leading-[0.98] tracking-[-0.05em] text-ink">
            Votre partenaire IA,<br /><span className="mark-green">de A à Z.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 max-w-xl text-xl font-medium leading-snug text-ink md:text-2xl">
            On vous forme, on vous conseille, on déploie. <span className="text-ink-soft">Et on reste.</span>
          </motion.p>
        </div>

        <div className="flex flex-col justify-end lg:col-span-4 lg:border-l lg:border-black/10 lg:pl-8">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
            className="text-[15px] leading-relaxed text-ink-soft">
            AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi.
            Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique,
            de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-9 flex flex-col items-start gap-4">
            <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
              className="group inline-flex w-full items-center justify-center gap-2.5 border border-ink bg-green px-7 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-green">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="0" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              Prendre rendez-vous
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#prestations" className="group inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-soft hover:text-ink">
              <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-ink">Découvrir nos prestations</span> ↓
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

// ---------- TRUST ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  return (
    <section id="references" className="border-b border-black/10 bg-mist">
      <div className="mx-auto max-w-6xl">
        <p className="border-b border-black/10 px-6 py-4 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-ink-soft">
          Ils nous font confiance — {logos.length} références
        </p>
        <div className="group relative overflow-hidden py-7" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div className="flex w-max gap-10 px-6 group-hover:[animation-play-state:paused]" style={{ animation: 'marquee 45s linear infinite' }}>
            {[...logos, ...logos].map((l, i) => (
              <span key={l + i} className="shrink-0 whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.06em] text-ink-soft transition-colors hover:text-ink">{l}</span>
            ))}
          </div>
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
    <section id="prestations" className="border-b border-black/10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel>Ce qu'on fait</SectionLabel></Reveal>
        <Reveal delay={0.08}>
          <div className="mt-5 flex flex-col items-start justify-between gap-3 border-b border-black/10 pb-7 md:flex-row md:items-end">
            <h2 className="max-w-2xl font-display text-[clamp(32px,5vw,64px)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">
              Sept prestations. <span className="text-ink-soft">Un seul partenaire.</span>
            </h2>
            <Index n="01" total="07" className="hidden md:block" />
          </div>
        </Reveal>

        {/* table stricte : numéro · titre+desc · prix aligné à droite */}
        <div className="border-b border-black/10">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <a href="#" onClick={(e) => e.preventDefault()}
                className="group grid grid-cols-12 items-start gap-4 border-t border-black/10 py-7 transition-colors hover:bg-mist md:gap-6">
                <div className="col-span-2 pl-0 md:pl-2">
                  <span className="font-mono text-[13px] tracking-[0.05em] text-ink-soft transition-colors group-hover:text-green-deep">{s.n}</span>
                </div>
                <div className="col-span-10 md:col-span-6">
                  <h3 className="font-display text-xl font-medium tracking-tight text-ink md:text-2xl">
                    {s.t}
                    <span className="ml-2 inline-block translate-x-0 text-ink-soft opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">{s.d}</p>
                </div>
                <div className="col-span-12 pl-[16.6%] md:col-span-4 md:pl-0 md:pr-2 md:text-right">
                  <span className="font-mono text-[13px] uppercase tracking-[0.04em] text-ink">{s.price}</span>
                </div>
              </a>
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
    <section id="duo" className="border-b border-black/10 bg-mist px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel>Les fondateurs</SectionLabel></Reveal>
        <Reveal delay={0.08}><h2 className="mt-5 max-w-2xl font-display text-[clamp(32px,5vw,64px)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">AXEM, c'est nous deux.</h2></Reveal>
        <Reveal delay={0.16}><p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft"><span className="font-semibold text-ink">A</span>lexis + Cl<span className="font-semibold text-ink">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.</p></Reveal>

        <div className="mt-12 grid border border-black/10 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.08}>
              <div className={`group flex h-full flex-col ${i === 0 ? 'border-b border-black/10 md:border-b-0 md:border-r' : ''}`}>
                {/* photo N&B encadrée par lignes de grille */}
                <div className="relative overflow-hidden border-b border-black/10 bg-paper">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                  <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.1em] text-paper mix-blend-difference">0{i + 1}</span>
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-8">
                  <div>
                    <h3 className="font-display text-3xl font-medium tracking-tight text-ink">{f.name}</h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">{f.school}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">{f.role}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-black/10 pt-5">
                    <span className="font-mono text-3xl font-semibold tracking-tight text-ink"><Counter value={f.n} prefix="+" /></span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}><p className="mt-10 text-center font-display text-2xl font-medium tracking-tight text-ink md:text-3xl">Ensemble, <span className="mark-green">AXEM</span>.</p></Reveal>
      </div>
    </section>
  );
};

// ---------- PROOF (chiffres + cas clients) ----------
const Proof: React.FC = () => {
  const stats = [
    { v: 55000, p: '+', s: '', l: 'abonnés LinkedIn' },
    { v: 10, p: '', s: '', l: 'formations Qualiopi' },
    { v: 70, p: '', s: ' %', l: 'de pratique' },
    { v: null as number | null, l: 'opérationnel', txt: 'J+1' },
  ];
  const cases = [
    { n: '01', sector: 'BTP · Chiffrage', r: '80 %', d: 'de temps de saisie économisé · 95 k€/an neutralisés' },
    { n: '02', sector: 'Administration · OCR', r: '×4', d: 'plus rapide · fiabilité 100 % par double vérification' },
    { n: '03', sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois · anomalies détectées > 98 %' },
  ];
  return (
    <section className="border-b border-black/10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* chiffres en grille stricte */}
        <div className="grid grid-cols-2 border-l border-t border-black/10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06}>
              <div className="group h-full border-b border-r border-black/10 p-7">
                <div className="font-mono text-[clamp(36px,5vw,64px)] font-semibold leading-none tracking-tight text-ink transition-colors group-hover:text-green-deep">
                  {s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={s.s || ''} /> : s.txt}
                </div>
                <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal><h2 className="mt-20 max-w-2xl font-display text-[clamp(30px,4.5vw,56px)] font-medium leading-[1.04] tracking-[-0.04em] text-ink">Des résultats. <span className="text-ink-soft">Pas des slides.</span></h2></Reveal>

        <div className="mt-12 grid border-l border-t border-black/10 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.08}>
              <div className="group flex h-full flex-col gap-4 border-b border-r border-black/10 p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">{c.sector}</span>
                  <Index n={c.n} total="03" />
                </div>
                <span className="font-mono text-5xl font-semibold tracking-tight text-ink transition-colors group-hover:text-green-deep md:text-6xl">{c.r}</span>
                <p className="text-[15px] leading-relaxed text-ink-soft">{c.d}</p>
              </div>
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
    { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  return (
    <section id="methode" className="border-b border-black/10 bg-mist px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel>La méthode</SectionLabel></Reveal>
        <Reveal delay={0.08}><h2 className="mt-5 max-w-2xl font-display text-[clamp(32px,5vw,64px)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">En 3 étapes. <span className="text-ink-soft">Pas une de plus.</span></h2></Reveal>

        <div className="mt-12 grid border-l border-t border-black/10 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="group flex h-full flex-col gap-5 border-b border-r border-black/10 p-8">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-5xl font-semibold tracking-tight text-ink transition-colors group-hover:text-green-deep">{s.n}</span>
                  <span className="border border-ink px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink">{s.meta}</span>
                </div>
                <h3 className="font-display text-xl font-medium tracking-tight text-ink md:text-2xl">{s.t}</h3>
                <p className="text-[15px] leading-relaxed text-ink-soft">{s.d}</p>
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
  <section className="border-b border-black/10 bg-ink px-6 py-24 text-center">
    <div className="mx-auto max-w-3xl">
      <Reveal>
        <div className="mb-7 flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-green">
          <span className="h-1.5 w-1.5 bg-green" />Diagnostic gratuit
        </div>
      </Reveal>
      <Reveal delay={0.06}><h2 className="mx-auto max-w-2xl font-display text-[clamp(34px,5vw,72px)] font-medium leading-[1.0] tracking-[-0.04em] text-paper">Parlons de votre projet IA.</h2></Reveal>
      <Reveal delay={0.12}><p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-paper/60">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p></Reveal>
      <Reveal delay={0.18}>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.25}
          className="group mt-10 inline-flex items-center gap-2.5 border border-green bg-green px-9 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ink transition-colors hover:bg-transparent hover:text-green">
          Réserver un diagnostic gratuit <span className="transition-transform group-hover:translate-x-1">→</span>
        </Magnetic>
      </Reveal>
    </div>
  </section>
);

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="bg-paper px-6 py-16">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-10 border-b border-black/10 pb-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-semibold tracking-tight text-ink">axem<span className="text-ink-soft"> IA</span></div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
        </div>
        <div>
          <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">Navigation</div>
          <ul className="space-y-2.5 font-mono text-[13px] text-ink-soft">{[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-ink">{l}</a></li>))}</ul>
        </div>
        <div>
          <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">Contact</div>
          <ul className="space-y-2.5 font-mono text-[13px] text-ink-soft">
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Prendre rendez-vous</a></li>
            <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-ink">contact@axem-ia.fr</a></li>
            <li>axem-ia.fr</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft md:flex-row">
        <span>© 2026 AXEM IA — Paris, France</span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-green-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Qualiopi · Finançable OPCO
        </span>
      </div>
    </div>
  </footer>
);

const Home: React.FC = () => (
  <div className="min-h-screen bg-paper">
    <Nav />
    <main><Hero /><Trust /><Services /><Duo /><Proof /><Method /><FinalCTA /></main>
    <Footer />
  </div>
);

export default Home;
