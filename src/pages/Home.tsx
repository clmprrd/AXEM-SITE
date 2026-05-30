import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useInView, useReducedMotion,
} from 'framer-motion';

// =====================================================================
// AXEM IA — LIGHT CORPORATE CLEAN (sobre, rassurant, B2B)
// Background #FFFFFF / sections alternées #F6F8FA · accent #0A6CFF
// Vert #00FA9A réservé aux pictos/checks. Inter only.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.2, 0.8, 0.2, 1] as const;

// ---------- fade-up sobre au scroll ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay, ease }} className={className}>{children}</motion.div>
);

// ---------- magnetic léger pour les CTA ----------
const Magnetic: React.FC<any> = ({ children, strength = 0.18, className, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.5 });
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

// ---------- picto check vert (réservé) ----------
const Check: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00B86F" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${s ? 'border-b border-line bg-white/90 py-3 backdrop-blur-xl' : 'py-5'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-2xl font-bold tracking-tight text-ink">axem<span className="text-accent"> IA</span></a>
        <div className="hidden items-center gap-8 md:flex">
          {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-ink">
              {l}<span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.18}
          className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow duration-200 hover:bg-accent-dark hover:shadow-card-hover">
          Prendre rendez-vous <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Magnetic>
      </div>
    </nav>
  );
};

// ---------- FUSION (Alexis + Clément → AXEM) ----------
const Fusion: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => { const a = setTimeout(() => setPhase(1), 1100); const b = setTimeout(() => setPhase(2), 2000); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="flex h-8 items-center justify-center" aria-label="Alexis + Clément = AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.4em] text-ink-soft">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 90 : 0, scale: phase === 1 ? 1.4 : 1 }} transition={{ duration: 0.5 }} className="text-accent">+</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="flex items-center gap-0.5">
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="font-display text-xl font-bold tracking-tight text-ink">{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1 font-display text-xl font-bold tracking-tight text-accent">IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- HERO ----------
const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden px-6 pt-36 pb-24 text-center">
    {/* fond sobre : voile bleu très léger + grille de points discrète */}
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[44vh] w-[80vw] -translate-x-1/2 rounded-full blur-[130px]" style={{ background: 'radial-gradient(closest-side, rgba(10,108,255,0.10), transparent)' }} />
      <div className="absolute inset-0 opacity-[0.6]" style={{ backgroundImage: 'radial-gradient(circle, rgba(11,18,32,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 70% 50% at 50% 28%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 28%, black, transparent)' }} />
    </div>
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 flex flex-col items-center gap-4">
        <Fusion />
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 shadow-card">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Agence d'IA & organisme de formation certifié Qualiopi</span>
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease }}
        className="font-display text-[clamp(40px,7vw,84px)] font-bold leading-[1.04] tracking-[-0.03em] text-ink">
        Votre partenaire IA,<br /><span className="text-accent">de A à Z.</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-7 text-xl font-semibold text-ink md:text-2xl">
        On vous forme, on vous conseille, on déploie. <span className="text-accent">Et on reste.</span>
      </motion.p>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
        AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi.
        Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique,
        de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }} className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.2}
          className="group inline-flex items-center gap-3 rounded-full bg-accent px-9 text-base font-semibold text-white shadow-card transition-shadow duration-200 hover:bg-accent-dark hover:shadow-card-hover" style={{ paddingTop: 18, paddingBottom: 18 }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
          <span>Prendre rendez-vous</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Magnetic>
        <a href="#prestations" className="group text-base font-medium text-ink-soft transition-colors duration-200 hover:text-ink">
          <span className="border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-ink">Découvrir nos prestations</span> ↓
        </a>
      </motion.div>
    </div>
  </section>
);

// ---------- TRUST (logos en grille grise + marquee) ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  return (
    <section id="references" className="border-y border-line bg-bg-alt py-12">
      <p className="mb-7 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft">Ils nous font confiance</p>
      <div className="group relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div className="flex w-max gap-10 px-6 group-hover:[animation-play-state:paused]" style={{ animation: 'marquee 40s linear infinite' }}>
          {[...logos, ...logos].map((l, i) => (
            <span key={l + i} className="shrink-0 whitespace-nowrap font-display text-xl font-semibold text-ink/40 transition-colors duration-200 hover:text-ink">{l}</span>
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
    <section id="prestations" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Ce qu'on fait</div></Reveal>
        <Reveal delay={0.06}><h2 className="max-w-3xl font-display text-[clamp(32px,4.5vw,56px)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">Sept prestations. <span className="text-ink-soft">Un seul partenaire.</span></h2></Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 0.06}>
              <div className="group flex h-full flex-col gap-3 rounded-xl2 border border-line bg-white p-7 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl font-bold text-accent">{s.n}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">{s.price}</span>
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{s.t}</h3>
                <p className="text-[15px] leading-relaxed text-ink-soft">{s.d}</p>
                <div className="mt-auto flex items-center gap-2 pt-3 text-sm font-semibold text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="h-px w-6 bg-accent" />En savoir plus →
                </div>
              </div>
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
    <section id="duo" className="border-y border-line bg-bg-alt px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Les fondateurs</div></Reveal>
        <Reveal delay={0.06}><h2 className="max-w-3xl font-display text-[clamp(32px,4.5vw,56px)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">AXEM, c'est nous deux.</h2></Reveal>
        <Reveal delay={0.12}><p className="mt-5 max-w-xl text-lg text-ink-soft"><span className="font-semibold text-ink">A</span>lexis + Cl<span className="font-semibold text-ink">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.</p></Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.08}>
              <div className="group flex h-full flex-col overflow-hidden rounded-xl2 border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="relative overflow-hidden">
                  <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent shadow-card transition-transform duration-200 hover:scale-110" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-8">
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{f.name}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.1em] text-accent">{f.school}</p>
                    <p className="text-sm text-ink-soft">{f.role}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-line pt-5">
                    <span className="font-display text-4xl font-bold text-ink"><Counter value={f.n} prefix="+" /></span>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}><p className="mt-10 text-center text-2xl font-semibold text-ink md:text-3xl">Ensemble, <span className="text-accent">AXEM</span>.</p></Reveal>
      </div>
    </section>
  );
};

// ---------- PROOF ----------
const Proof: React.FC = () => {
  const stats = [{ v: 55000, p: '+', l: 'abonnés LinkedIn' }, { v: 10, p: '', l: 'formations Qualiopi' }, { v: 70, p: '', s: ' %', l: 'de pratique' }, { v: null, l: 'opérationnel', txt: 'J+1' }];
  const cases = [{ sector: 'BTP · Chiffrage', r: '80 %', d: 'de temps de saisie économisé · 95 k€/an neutralisés' }, { sector: 'Administration · OCR', r: '×4', d: 'plus rapide · fiabilité 100 % par double vérification' }, { sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois · anomalies détectées > 98 %' }];
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 border-b border-line pb-20 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06}>
              <div className="group cursor-default">
                <div className="font-display text-[clamp(38px,5vw,64px)] font-bold leading-none text-ink transition-colors duration-200 group-hover:text-accent">
                  {s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}
                </div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-ink-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><h2 className="mt-20 max-w-3xl font-display text-[clamp(30px,4vw,52px)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">Des résultats. <span className="text-ink-soft">Pas des slides.</span></h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-4 rounded-xl2 border border-line bg-white p-8 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{c.sector}</span>
                <span className="font-display text-5xl font-bold text-ink">{c.r}</span>
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
  const steps = [{ n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN' }, { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H' }, { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' }];
  return (
    <section id="methode" className="border-t border-line bg-bg-alt px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><h2 className="max-w-3xl font-display text-[clamp(32px,4.5vw,56px)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">En 3 étapes. <span className="text-accent">Pas une de plus.</span></h2></Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="group flex h-full flex-col gap-4 rounded-xl2 border border-line bg-white p-8 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl font-bold text-ink transition-colors duration-200 group-hover:text-accent">{s.n}</span>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">{s.meta}</span>
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{s.t}</h3>
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
  <section className="px-6 py-28">
    <div className="mx-auto max-w-5xl rounded-xl2 border border-line bg-white px-8 py-20 text-center shadow-card md:px-16">
      <Reveal><h2 className="mx-auto max-w-3xl font-display text-[clamp(32px,4.5vw,56px)] font-bold leading-[1.06] tracking-[-0.03em] text-ink">Parlons de votre projet IA.</h2></Reveal>
      <Reveal delay={0.06}><p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p></Reveal>
      <Reveal delay={0.12}>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.2} className="group mt-11 inline-flex items-center gap-3 rounded-full bg-accent px-10 py-5 text-base font-semibold text-white shadow-card transition-shadow duration-200 hover:bg-accent-dark hover:shadow-card-hover">
          Réserver un diagnostic gratuit <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Magnetic>
      </Reveal>
      <Reveal delay={0.18}>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5"><Check /> Sans engagement</span>
          <span className="inline-flex items-center gap-1.5"><Check /> Réponse sous 48h</span>
          <span className="inline-flex items-center gap-1.5"><Check /> Finançable OPCO</span>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="border-t border-line bg-white px-6 py-16">
    <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-2xl font-bold tracking-tight text-ink">axem<span className="text-accent"> IA</span></div>
        <p className="mt-3 max-w-xs text-sm text-ink-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
      </div>
      <div>
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Navigation</div>
        <ul className="space-y-2 text-sm text-ink-soft">{[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors duration-200 hover:text-ink">{l}</a></li>))}</ul>
      </div>
      <div>
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Contact</div>
        <ul className="space-y-2 text-sm text-ink-soft">
          <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-ink">Prendre rendez-vous</a></li>
          <li><a href="mailto:contact@axem-ia.fr" className="transition-colors duration-200 hover:text-ink">contact@axem-ia.fr</a></li>
          <li>axem-ia.fr</li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line pt-8 text-xs text-ink-soft md:flex-row">
      <span>© 2026 AXEM IA — Paris, France</span>
      <span className="inline-flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5" />
        Qualiopi · Finançable OPCO
      </span>
    </div>
  </footer>
);

const Home: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Nav />
    <main><Hero /><Trust /><Services /><Duo /><Proof /><Method /><FinalCTA /></main>
    <Footer />
  </div>
);

export default Home;
