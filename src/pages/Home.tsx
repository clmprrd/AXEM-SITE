import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
  useInView, useReducedMotion, useScroll,
} from 'framer-motion';

// =====================================================================
// AXEM IA — ÉDITION « REVUE » (éditorial sophistiqué, serif, crème)
// Magazine intelligent : Fraunces + Inter, filets fins, numérotation,
// split-text, parallaxe douce, magnetic léger.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.22, 0.61, 0.36, 1] as const;

// ---------- REVEAL ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; y?: number }> = ({ children, delay = 0, className, y = 24 }) => (
  <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease }} className={className}>{children}</motion.div>
);

// ---------- SPLIT TEXT (apparition mot par mot) ----------
const SplitText: React.FC<{ text: string; className?: string; delay?: number; stagger?: number; markWords?: number[] }> = ({ text, className = '', delay = 0, stagger = 0.06, markWords = [] }) => {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${markWords.includes(i) ? 'italic-accent text-green-deep' : ''}`}
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.85, delay: delay + i * stagger, ease }}
          >
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// ---------- MAGNETIC (léger) ----------
const Magnetic: React.FC<any> = ({ children, strength = 0.18, className, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 15, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 160, damping: 15, mass: 0.5 });
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

// ---------- PARALLAX (douce) ----------
const Parallax: React.FC<{ children: React.ReactNode; className?: string; amount?: number }> = ({ children, className, amount = 40 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>{children}</motion.div>;
};

// ---------- COUNTER ----------
const Counter: React.FC<{ value: number; prefix?: string; suffix?: string; className?: string }> = ({ value, prefix = '', suffix = '', className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const start = performance.now(); let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - start) / 1500); setN(Math.round((1 - Math.pow(1 - k, 3)) * value)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const fmt = n >= 1000 ? n.toLocaleString('fr-FR') : String(n);
  return <span ref={ref} className={`tnum ${className || ''}`}>{prefix}{fmt}{suffix}</span>;
};

// ---------- SECTION HEADER (numérotation type revue) ----------
const SectionLabel: React.FC<{ index: string; title: string }> = ({ index, title }) => (
  <Reveal>
    <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-soft">
      <span className="tnum text-ink">{index}</span>
      <span className="h-px w-8 bg-ink/30" />
      <span>{title}</span>
    </div>
  </Reveal>
);

// ---------- FILET ----------
const Rule: React.FC<{ className?: string }> = ({ className = '' }) => <div className={`h-px w-full bg-ink/15 ${className}`} />;

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 24); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${s ? 'border-b border-ink/15 bg-cream/90 py-3 backdrop-blur-md' : 'py-6'}`}>
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="font-display text-2xl font-medium tracking-tight text-ink">
          Axem<span className="italic-accent text-green-deep"> IA</span>
        </a>
        <div className="hidden items-center gap-9 md:flex">
          {[['Formation', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="group relative text-[13px] font-medium tracking-wide text-ink-soft transition-colors hover:text-ink">
              {l}<span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>
        <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.18}
          className="group inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-5 py-2.5 text-[13px] font-semibold text-cream transition-colors hover:bg-cream hover:text-ink">
          Prendre rendez-vous <span className="transition-transform group-hover:translate-x-0.5">→</span>
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
    <div className="flex h-7 items-center justify-center" aria-label="Alexis + Clément = AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}
            className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.42em] text-ink-soft">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 90 : 0 }} transition={{ duration: 0.5 }} className="italic-accent text-green-deep">+</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }} className="flex items-baseline gap-0.5">
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="font-display text-lg font-medium tracking-[0.2em] text-ink">{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1.5 italic-accent text-lg text-green-deep">IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- HERO ----------
const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden px-6 pt-40 pb-24 md:px-10 md:pt-44 md:pb-32">
    {/* filets de marge fins */}
    <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-[1180px]">
      <div className="absolute inset-y-0 left-6 w-px bg-ink/[0.06] md:left-10" />
      <div className="absolute inset-y-0 right-6 w-px bg-ink/[0.06] md:right-10" />
    </div>

    <div className="mx-auto max-w-[1180px]">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12 flex flex-col items-center gap-5">
        <Fusion />
        <div className="text-center text-[11px] font-semibold uppercase tracking-[0.26em] text-ink-soft">
          Agence d'IA &amp; organisme de formation certifié <span className="text-green-deep">Qualiopi</span>
        </div>
      </motion.div>

      <Rule className="mb-12 opacity-60" />

      <h1 className="font-display text-[clamp(48px,9vw,128px)] font-light leading-[0.98] tracking-[-0.025em] text-ink">
        <span className="block"><SplitText text="Votre partenaire IA," stagger={0.07} /></span>
        <span className="block"><SplitText text="de A à Z." delay={0.35} stagger={0.07} markWords={[1, 2, 3]} /></span>
      </h1>

      <div className="mt-14 grid gap-10 md:grid-cols-12">
        <Reveal delay={0.2} className="md:col-span-5">
          <p className="font-quote text-2xl leading-snug text-ink md:text-[28px]">
            On vous forme, on vous conseille, on déploie. <span className="italic-accent text-green-deep">Et on reste.</span>
          </p>
        </Reveal>
        <Reveal delay={0.32} className="md:col-span-6 md:col-start-7">
          <p className="text-[15px] leading-relaxed text-ink-soft md:text-base">
            AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi.
            Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique,
            de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
          </p>
          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.22}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[15px] font-semibold text-cream transition-colors hover:bg-green-deep">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
              Prendre rendez-vous
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Magnetic>
            <a href="#prestations" className="group text-[14px] font-medium text-ink-soft transition-colors hover:text-ink">
              <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-ink">Découvrir nos prestations</span>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---------- TRUST ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  return (
    <section id="references" className="border-y border-ink/15 bg-paper py-12">
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-soft">Ils nous font confiance</p>
      </div>
      <div className="group relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)' }}>
        <div className="flex w-max gap-14 px-6 group-hover:[animation-play-state:paused]" style={{ animation: 'marquee 46s linear infinite' }}>
          {[...logos, ...logos].map((l, i) => (
            <span key={l + i} className="shrink-0 whitespace-nowrap font-display text-2xl font-light italic text-ink/50 transition-colors hover:text-green-deep">{l}</span>
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
    <section id="prestations" className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="01" title="Prestations" />
        <Reveal delay={0.1}>
          <h2 className="mt-7 max-w-4xl font-display text-[clamp(36px,6vw,84px)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
            Sept prestations.<br /><span className="italic-accent text-ink-soft">Un seul partenaire.</span>
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-ink/15">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.06}>
              <a href="#methode" className="group grid grid-cols-12 items-baseline gap-4 border-b border-ink/15 py-7 transition-colors hover:bg-paper md:py-9">
                <span className="col-span-2 font-display text-lg font-light text-ink-soft tnum md:col-span-1 md:text-xl">{s.n}</span>
                <h3 className="col-span-10 font-display text-[26px] font-light leading-tight tracking-tight text-ink transition-transform duration-300 group-hover:translate-x-1 md:col-span-5 md:text-[34px]">
                  {s.t}
                </h3>
                <p className="col-span-12 mt-2 text-[15px] leading-relaxed text-ink-soft md:col-span-4 md:col-start-7 md:mt-0">{s.d}</p>
                <span className="col-span-12 mt-2 text-right text-[13px] font-semibold uppercase tracking-[0.1em] text-green-deep md:col-span-1 md:col-start-12 md:mt-0">{s.price}</span>
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
    <section id="duo" className="border-y border-ink/15 bg-paper px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="02" title="Le duo" />
        <div className="mt-7 grid gap-8 md:grid-cols-12">
          <Reveal delay={0.05} className="md:col-span-7">
            <h2 className="font-display text-[clamp(36px,6vw,84px)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
              AXEM,<br /><span className="italic-accent">c'est nous deux.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="font-quote text-xl leading-relaxed text-ink-soft">
              <span className="text-ink">A</span>lexis + Cl<span className="text-ink">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-14">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <article className="group">
                <div className="relative overflow-hidden">
                  <Parallax amount={18}>
                    <img src={f.img} alt={f.name} loading="lazy" className="aspect-[4/5] w-full scale-110 object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                  </Parallax>
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-cream/40 bg-ink/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cream backdrop-blur transition-colors hover:bg-green-deep" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                    LinkedIn
                  </a>
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[32px] font-light tracking-tight text-ink md:text-[40px]">{f.name}</h3>
                  <span className="font-display text-2xl font-light text-ink"><Counter value={f.n} prefix="+" /></span>
                </div>
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-green-deep">{f.school}</p>
                <Rule className="my-4 opacity-60" />
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[14px] text-ink-soft">{f.role}</p>
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">abonnés</span>
                </div>
                <p className="mt-4 font-quote text-lg leading-relaxed text-ink">{f.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-16 text-center font-display text-[clamp(34px,5vw,64px)] font-light italic text-ink">
            Ensemble, <span className="text-green-deep">AXEM.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- PROOF ----------
const Proof: React.FC = () => {
  const stats = [{ v: 55000, p: '+', l: 'abonnés LinkedIn' }, { v: 10, p: '', l: 'formations Qualiopi' }, { v: 70, p: '', s: ' %', l: 'de pratique' }, { v: null, l: 'opérationnel', txt: 'J+1' }];
  const cases = [
    { sector: 'BTP · Chiffrage', r: '80 %', d: 'de temps de saisie économisé · 95 k€/an neutralisés' },
    { sector: 'Administration · OCR', r: '×4', d: 'plus rapide · fiabilité 100 % par double vérification' },
    { sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois · anomalies détectées > 98 %' },
  ];
  return (
    <section className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="03" title="Chiffres" />
        <div className="mt-12 grid grid-cols-2 gap-y-12 border-y border-ink/15 py-14 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="group cursor-default border-r border-ink/10 pr-4 last:border-r-0 md:pr-8">
                <div className="font-display text-[clamp(44px,5.5vw,80px)] font-light leading-none text-ink transition-colors group-hover:text-green-deep">
                  {s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}
                </div>
                <div className="mt-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="mt-20 max-w-3xl font-display text-[clamp(32px,5vw,64px)] font-light leading-[1.04] tracking-[-0.02em] text-ink">
            Des résultats. <span className="italic-accent text-ink-soft">Pas des slides.</span>
          </h2>
        </Reveal>

        <div className="mt-14 border-t border-ink/15">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.08}>
              <div className="group grid grid-cols-12 items-baseline gap-4 border-b border-ink/15 py-9 transition-colors hover:bg-paper">
                <span className="col-span-12 text-[12px] font-semibold uppercase tracking-[0.16em] text-green-deep md:col-span-4">{c.sector}</span>
                <span className="col-span-5 font-display text-[clamp(48px,7vw,88px)] font-light leading-none text-ink md:col-span-3">{c.r}</span>
                <p className="col-span-7 self-center text-[15px] leading-relaxed text-ink-soft md:col-span-5">{c.d}</p>
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
    { n: '01', t: 'Diagnostic', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 min' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 h' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1' },
  ];
  return (
    <section id="methode" className="border-y border-ink/15 bg-paper px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1180px]">
        <SectionLabel index="04" title="Méthode" />
        <Reveal delay={0.1}>
          <h2 className="mt-7 max-w-4xl font-display text-[clamp(36px,6vw,84px)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
            En trois étapes. <span className="italic-accent text-green-deep">Pas une de plus.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="group flex h-full flex-col gap-5 bg-paper p-8 transition-colors hover:bg-cream md:p-10">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-5xl font-light text-ink transition-colors group-hover:text-green-deep tnum md:text-6xl">{s.n}</span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{s.meta}</span>
                </div>
                <h3 className="font-display text-[26px] font-light tracking-tight text-ink md:text-3xl">{s.t}</h3>
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
  <section className="px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-[1180px]">
      <div className="overflow-hidden rounded-[8px] bg-ink px-8 py-20 text-center md:px-16 md:py-28">
        <Reveal>
          <div className="mb-8 flex items-center justify-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/50">
            <span className="h-px w-8 bg-cream/30" />Prendre rendez-vous<span className="h-px w-8 bg-cream/30" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto max-w-4xl font-display text-[clamp(36px,6vw,88px)] font-light leading-[1.02] tracking-[-0.02em] text-cream">
            Parlons de votre <span className="italic-accent text-green">projet IA.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-7 max-w-xl font-quote text-xl leading-relaxed text-cream/65">
            Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <Magnetic href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.22} className="group mt-12 inline-flex items-center gap-3 rounded-full bg-green px-9 py-4.5 text-[15px] font-semibold text-ink transition-colors hover:bg-cream" style={{ paddingTop: 18, paddingBottom: 18 }}>
            Réserver un diagnostic gratuit <span className="transition-transform group-hover:translate-x-1">→</span>
          </Magnetic>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---------- FOOTER (colophon) ----------
const Footer: React.FC = () => (
  <footer className="border-t border-ink/15 bg-cream px-6 py-16 md:px-10">
    <div className="mx-auto max-w-[1180px]">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-display text-3xl font-medium tracking-tight text-ink">Axem<span className="italic-accent text-green-deep"> IA</span></div>
          <p className="mt-4 max-w-xs font-quote text-lg leading-relaxed text-ink-soft">Votre partenaire IA, de A à Z. Agence d'IA &amp; organisme de formation certifié Qualiopi.</p>
        </div>
        <div className="md:col-span-3 md:col-start-7">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">Sommaire</div>
          <ul className="space-y-2.5 text-[14px] text-ink-soft">{[['01 — Formation', '#prestations'], ['02 — Le duo', '#duo'], ['03 — Références', '#references'], ['04 — Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-ink">{l}</a></li>))}</ul>
        </div>
        <div className="md:col-span-3 md:col-start-10">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">Contact</div>
          <ul className="space-y-2.5 text-[14px] text-ink-soft">
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Prendre rendez-vous</a></li>
            <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-ink">contact@axem-ia.fr</a></li>
            <li>axem-ia.fr</li>
          </ul>
        </div>
      </div>
      <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-ink/15 pt-8 text-[12px] text-ink-faint md:flex-row">
        <span>© 2026 AXEM IA — Paris, France</span>
        <span className="inline-flex items-center gap-2 italic-accent text-ink-soft">
          <svg className="h-3.5 w-3.5 text-green-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Qualiopi · Finançable OPCO
        </span>
      </div>
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
