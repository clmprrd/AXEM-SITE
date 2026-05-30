import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useInView, useReducedMotion,
} from 'framer-motion';

// =====================================================================
// AXEM IA — STYLE "PLAYFUL CREATOR"
// Coloré, fun, neo-brutalist soft : bordures noires épaisses,
// offset shadows dures, coins arrondis généreux, stickers & pills.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

const spring = { type: 'spring' as const, stiffness: 260, damping: 18 };

// ---------- helpers d'interactivité ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 28, rotate: -1 }}
    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ type: 'spring', stiffness: 120, damping: 16, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Magnetic: React.FC<any> = ({ children, strength = 0.3, className, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 12, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 12, mass: 0.5 });
  const reduce = useReducedMotion();
  const move = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.a
      ref={ref}
      onMouseMove={move}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }}
      className={className}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.a>
  );
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

// petit sticker pill réutilisable
const Pill: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({ children, color = 'bg-yellow', className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-ink shadow-hard-sm ${color} ${className}`}>
    {children}
  </span>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [s, setS] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${s ? 'py-3' : 'py-5'}`}>
      <div className={`mx-3 flex items-center justify-between rounded-full px-5 py-2 transition-all duration-300 md:mx-auto md:max-w-6xl ${s ? 'border-2 border-ink bg-cream/95 shadow-hard-sm backdrop-blur' : ''}`}>
        <a href="#top" className="font-display text-2xl font-extrabold tracking-tight text-ink">
          axem<span className="text-green-deep">&nbsp;IA</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
            <a key={l} href={h} className="text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 hover:text-green-deep">
              {l}
            </a>
          ))}
        </div>
        <Magnetic
          href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.2}
          className="group inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-green px-5 py-2.5 text-sm font-extrabold text-ink shadow-hard-sm transition-all hover:shadow-hard"
        >
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
    <div className="flex h-9 items-center justify-center" aria-label="Alexis + Clément = AXEM">
      <AnimatePresence mode="wait">
        {phase < 2 ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.4 }}
            className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.3em] text-ink-soft">
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Alexis</motion.span>
            <motion.span animate={{ rotate: phase === 1 ? 180 : 0, scale: phase === 1 ? 1.5 : 1 }} transition={spring} className="text-coral">+</motion.span>
            <motion.span animate={phase === 1 ? { opacity: 0.3 } : {}} transition={{ duration: 0.6 }}>Clément</motion.span>
          </motion.div>
        ) : (
          <motion.div key="a" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="flex items-center gap-0.5">
            {'AXEM'.split('').map((l, i) => (
              <motion.span key={l + i} initial={{ opacity: 0, y: 12, rotate: -8 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ ...spring, delay: i * 0.07 }} className="font-display text-xl font-extrabold tracking-tight text-ink">{l}</motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="ml-1 font-display text-xl font-extrabold tracking-tight text-green-deep">IA</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---------- HERO ----------
const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden px-6 pt-36 pb-24 text-center">
    {/* blobs colorés en fond */}
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute -left-[6%] top-[12%] h-44 w-44 rounded-full bg-lavender/60 blur-2xl"
        animate={{ y: [0, 24, 0], x: [0, 12, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute right-[4%] top-[8%] h-52 w-52 rounded-full bg-yellow/60 blur-2xl"
        animate={{ y: [0, -20, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute left-[40%] top-[44%] h-40 w-40 rounded-full bg-green/50 blur-2xl"
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'radial-gradient(circle, rgba(26,26,26,0.06) 1.4px, transparent 1.4px)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, black, transparent)' }} />
    </div>

    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex flex-col items-center gap-5">
        <Fusion />
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-1.5 shadow-hard-sm">
          <motion.span className="h-2 w-2 rounded-full bg-green-deep" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink">Agence d'IA & organisme de formation certifié Qualiopi</span>
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}
        className="font-display text-[clamp(44px,8.5vw,108px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
        Votre partenaire IA,<br />
        <motion.span
          initial={{ rotate: -2 }} whileHover={{ rotate: 2, scale: 1.03 }} transition={spring}
          className="mt-3 inline-block rounded-2xl border-[3px] border-ink bg-yellow px-3 py-0.5 shadow-hard"
        >
          de A à Z.
        </motion.span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }} className="mt-9 text-xl font-bold text-ink md:text-2xl">
        On vous forme, on vous conseille, on déploie. <span className="mark-green">Et on reste.</span>
      </motion.p>

      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-ink-soft md:text-lg">
        AXEM IA est une agence spécialisée en intelligence artificielle générative et un organisme de formation certifié Qualiopi.
        Nous accompagnons les entreprises, les administrations et les particuliers via des formations IA, du conseil stratégique,
        de l'audit et de l'automatisation — pour concevoir et déployer des solutions IA concrètes.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }} className="mt-11 flex flex-col items-center gap-5 sm:flex-row">
        <Magnetic
          href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
          className="group relative inline-flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-green px-9 py-5 text-base font-extrabold text-ink shadow-hard-lg transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-hard-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>
          Prendre rendez-vous
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Magnetic>
        <a href="#prestations" className="group inline-flex items-center gap-1 rounded-full border-2 border-ink bg-paper px-6 py-4 text-base font-extrabold text-ink shadow-hard-sm transition-all hover:bg-lavender">
          Découvrir nos prestations <span className="transition-transform group-hover:translate-y-0.5">↓</span>
        </a>
      </motion.div>
    </div>
  </section>
);

// ---------- TRUST ----------
const Trust: React.FC = () => {
  const logos = ['Carrefour', 'Blackfin Capital', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech', 'Mammouth AI', 'Pennylane', 'Dragon LLM', 'myconnecting', 'IAdescript', 'Gomable AI', 'Cegos', 'SENZA', 'ASphere'];
  const colors = ['bg-yellow', 'bg-lavender', 'bg-green', 'bg-coral'];
  return (
    <section id="references" className="border-y-[3px] border-ink bg-lavender/40 py-10">
      <p className="mb-6 text-center text-[12px] font-extrabold uppercase tracking-[0.2em] text-ink">Ils nous font confiance</p>
      <div className="marquee-wrap group relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)' }}>
        <div className="marquee-track flex w-max gap-5 px-6">
          {[...logos, ...logos].map((l, i) => (
            <span
              key={l + i}
              className={`shrink-0 whitespace-nowrap rounded-xl border-2 border-ink ${colors[i % colors.length]} px-5 py-2.5 font-display text-lg font-extrabold text-ink shadow-hard-sm transition-transform hover:-translate-y-1 hover:-rotate-2`}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } } .marquee-track { animation: marquee 42s linear infinite; } .marquee-wrap:hover .marquee-track { animation-play-state: paused; }`}</style>
    </section>
  );
};

// ---------- SERVICES ----------
const Services: React.FC = () => {
  const items = [
    { n: '01', t: 'Audit IA', d: "On regarde avant de déployer. Diagnostic, cartographie de vos process, scoring de maturité IA.", price: '1 à 4 semaines', color: 'bg-green', emoji: '🔍' },
    { n: '02', t: 'Conseil stratégique', d: "On décide quoi faire, dans quel ordre, avec quels budgets. Roadmap priorisée, choix des outils.", price: 'Sur devis', color: 'bg-yellow', emoji: '🧭' },
    { n: '03', t: 'Déploiement & automatisation', d: "Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou suivi.", price: 'À partir de 1 200 €', color: 'bg-lavender', emoji: '⚡' },
    { n: '04', t: 'Formation Qualiopi', d: "Vos équipes opérationnelles dès J+1. 10 formations, 3 niveaux, 70 % de pratique. Finançable OPCO.", price: '200 € – 1 250 € / pers.', color: 'bg-coral', emoji: '🎓' },
    { n: '05', t: 'Coaching individuel', d: "Pour vos profils clés : managers, dirigeants, référents IA. On ancre les compétences dans la durée.", price: '200 € / session', color: 'bg-yellow', emoji: '🚀' },
    { n: '06', t: 'Production IA', d: "Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite.", price: 'Sur devis', color: 'bg-green', emoji: '🎬' },
    { n: '07', t: 'Suivi', d: "Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.", price: '80 € / mois', color: 'bg-lavender', emoji: '🤝' },
  ];
  return (
    <section id="prestations" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><Pill color="bg-coral" className="mb-5">Ce qu'on fait</Pill></Reveal>
        <Reveal delay={0.1}>
          <h2 className="max-w-3xl font-display text-[clamp(36px,5.5vw,72px)] font-extrabold leading-[1.0] tracking-[-0.02em] text-ink">
            Sept prestations. <span className="mark-yellow">Un seul partenaire.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.08}>
              <motion.div
                whileHover={{ y: -6, x: -2 }}
                transition={spring}
                className={`group flex h-full flex-col gap-4 rounded-3xl border-[3px] border-ink ${s.color} p-8 shadow-hard transition-shadow hover:shadow-hard-lg md:p-10`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-paper font-display text-xl font-extrabold text-ink shadow-hard-sm">{s.n}</span>
                  <span className="rounded-full border-2 border-ink bg-paper px-3 py-1 text-xs font-extrabold text-ink">{s.price}</span>
                </div>
                <div className="text-3xl">{s.emoji}</div>
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">{s.t}</h3>
                <p className="text-base font-medium leading-relaxed text-ink/80">{s.d}</p>
                <div className="mt-2 flex items-center gap-2 text-sm font-extrabold text-ink opacity-0 transition-all duration-300 group-hover:opacity-100">
                  En savoir plus <span className="transition-transform group-hover:translate-x-1">→</span>
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
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: "Le stratège. Je traduis l'IA en résultats concrets et pilote les missions audit et stratégie.", n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/', frame: 'bg-yellow', rot: '-rotate-2' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: "L'ingénieur. Je conçois et déploie l'IA en production. Expérience secteur financier & Private Equity.", n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/', frame: 'bg-lavender', rot: 'rotate-2' },
  ];
  return (
    <section id="duo" className="border-y-[3px] border-ink bg-green/15 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><Pill color="bg-green" className="mb-5">Les fondateurs</Pill></Reveal>
        <Reveal delay={0.1}><h2 className="max-w-3xl font-display text-[clamp(36px,5.5vw,72px)] font-extrabold leading-[1.0] tracking-[-0.02em] text-ink">AXEM, c'est nous deux.</h2></Reveal>
        <Reveal delay={0.2}><p className="mt-5 max-w-xl text-lg font-medium text-ink-soft"><span className="font-extrabold text-ink">A</span>lexis + Cl<span className="font-extrabold text-ink">ém</span>ent. Le stratège et l'ingénieur. Pas de relais qui se perd entre équipes : vous parlez à ceux qui livrent.</p></Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={spring}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border-[3px] border-ink bg-paper shadow-hard transition-shadow hover:shadow-hard-lg"
              >
                <div className={`relative overflow-hidden ${f.frame} p-5`}>
                  <div className={`overflow-hidden rounded-2xl border-[3px] border-ink ${f.rot} transition-transform duration-300 group-hover:rotate-0`}>
                    <img src={f.img} alt={f.name} loading="lazy" className="aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  {/* sticker abonnés */}
                  <motion.div
                    initial={{ rotate: -8 }} whileHover={{ rotate: 8, scale: 1.08 }} transition={spring}
                    className="absolute -bottom-2 -right-1 flex items-center gap-1 rounded-full border-[3px] border-ink bg-paper px-3 py-1.5 font-display text-lg font-extrabold text-ink shadow-hard-sm"
                  >
                    +{f.n / 1000}k
                  </motion.div>
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink shadow-hard-sm transition-transform hover:scale-110 hover:-rotate-6" aria-label={`LinkedIn ${f.name}`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34V9.99H5.67v8.35h2.67zM7 8.84a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.5v-4.58c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.4 1.33v-1.14h-2.66c.04.75 0 8.35 0 8.35h2.66v-4.66c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.48h2.66z" /></svg>
                  </a>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-8">
                  <div>
                    <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink">{f.name}</h3>
                    <p className="mt-1 text-sm font-extrabold uppercase tracking-[0.1em] text-green-deep">{f.school}</p>
                    <p className="text-sm font-bold text-ink-soft">{f.role}</p>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-ink/80">{f.desc}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t-2 border-dashed border-ink/30 pt-5">
                    <span className="font-display text-4xl font-extrabold text-ink"><Counter value={f.n} prefix="+" /></span>
                    <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink-soft">abonnés LinkedIn</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}><p className="mt-12 text-center font-serif-i text-4xl italic text-ink md:text-5xl">Ensemble, <span className="mark-green">AXEM</span>.</p></Reveal>
      </div>
    </section>
  );
};

// ---------- PROOF ----------
const Proof: React.FC = () => {
  const stats = [
    { v: 55000, p: '+', l: 'abonnés LinkedIn', color: 'bg-yellow' },
    { v: 10, p: '', l: 'formations Qualiopi', color: 'bg-green' },
    { v: 70, p: '', s: ' %', l: 'de pratique', color: 'bg-lavender' },
    { v: null, l: 'opérationnel', txt: 'J+1', color: 'bg-coral' },
  ];
  const cases = [
    { sector: 'BTP · Chiffrage', r: '80 %', d: 'de temps de saisie économisé · 95 k€/an neutralisés', color: 'bg-green' },
    { sector: 'Administration · OCR', r: '×4', d: 'plus rapide · fiabilité 100 % par double vérification', color: 'bg-yellow' },
    { sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois · anomalies détectées > 98 %', color: 'bg-lavender' },
  ];
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -5, rotate: -1.5 }}
                transition={spring}
                className={`flex flex-col items-center rounded-3xl border-[3px] border-ink ${s.color} p-7 text-center shadow-hard`}
              >
                <div className="font-display text-[clamp(38px,5vw,64px)] font-extrabold leading-none text-ink">
                  {s.v !== null ? <Counter value={s.v} prefix={s.p} suffix={(s as any).s || ''} /> : (s as any).txt}
                </div>
                <div className="mt-2 text-sm font-extrabold uppercase tracking-[0.06em] text-ink/80">{s.l}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal><h2 className="mt-24 max-w-3xl font-display text-[clamp(32px,4.5vw,60px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink">Des résultats. <span className="mark-yellow">Pas des slides.</span></h2></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.sector} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, x: -2 }}
                transition={spring}
                className="flex h-full flex-col gap-4 rounded-3xl border-[3px] border-ink bg-paper p-8 shadow-hard transition-shadow hover:shadow-hard-lg"
              >
                <span className={`w-fit rounded-full border-2 border-ink ${c.color} px-3 py-1 text-xs font-extrabold uppercase tracking-[0.06em] text-ink shadow-hard-sm`}>{c.sector}</span>
                <span className="font-display text-6xl font-extrabold text-ink">{c.r}</span>
                <p className="text-base font-medium leading-relaxed text-ink/80">{c.d}</p>
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
    { n: '01', t: 'Diagnostic gratuit', d: '30 min pour identifier vos 3 leviers IA les plus rentables.', meta: '30 MIN', color: 'bg-green' },
    { n: '02', t: 'Proposition', d: 'Sous 48h. Parcours sur-mesure, dates, financement OPCO.', meta: '48 H', color: 'bg-yellow' },
    { n: '03', t: 'Exécution', d: 'Opérationnel dès J+1. Livrables concrets, suivi inclus.', meta: 'J+1', color: 'bg-coral' },
  ];
  return (
    <section id="methode" className="border-t-[3px] border-ink bg-lavender/40 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal><h2 className="max-w-3xl font-display text-[clamp(36px,5.5vw,72px)] font-extrabold leading-[1.0] tracking-[-0.02em] text-ink">En 3 étapes. <span className="mark-green">Pas une de plus.</span></h2></Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, rotate: i % 2 ? 1.5 : -1.5 }}
                transition={spring}
                className={`flex flex-col gap-4 rounded-3xl border-[3px] border-ink ${s.color} p-8 shadow-hard`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-6xl font-extrabold text-ink">{s.n}</span>
                  <span className="rounded-full border-2 border-ink bg-paper px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-ink shadow-hard-sm">{s.meta}</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">{s.t}</h3>
                <p className="text-base font-medium leading-relaxed text-ink/80">{s.d}</p>
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
    <Reveal>
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] border-[3px] border-ink bg-ink px-8 py-20 text-center shadow-hard-lg md:px-16">
        {/* stickers déco */}
        <motion.div className="absolute left-8 top-8 h-16 w-16 rounded-full bg-yellow" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-10 right-10 h-12 w-12 rounded-2xl bg-coral" animate={{ rotate: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute right-16 top-10 h-8 w-8 rounded-full bg-lavender" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} />
        <h2 className="relative mx-auto max-w-3xl font-display text-[clamp(36px,5.5vw,76px)] font-extrabold leading-[1.0] tracking-[-0.02em] text-cream">
          Parlons de votre <span className="text-green">projet IA.</span>
        </h2>
        <p className="relative mx-auto mt-6 max-w-xl text-lg font-medium text-cream/70">Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.</p>
        <Magnetic
          href={CALENDLY} target="_blank" rel="noopener noreferrer" strength={0.3}
          className="group relative mt-11 inline-flex items-center gap-3 rounded-2xl border-[3px] border-ink bg-green px-10 py-5 text-base font-extrabold text-ink shadow-[6px_6px_0_#00B86F] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#00B86F]"
        >
          Réserver un diagnostic gratuit <span className="transition-transform group-hover:translate-x-1">→</span>
        </Magnetic>
      </div>
    </Reveal>
  </section>
);

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="border-t-[3px] border-ink bg-cream px-6 py-16">
    <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-3xl font-extrabold tracking-tight text-ink">axem<span className="text-green-deep">&nbsp;IA</span></div>
        <p className="mt-3 max-w-xs text-sm font-medium text-ink-soft">Votre partenaire IA, de A à Z. Agence d'IA & organisme de formation certifié Qualiopi.</p>
      </div>
      <div>
        <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-ink">Navigation</div>
        <ul className="space-y-2 text-sm font-bold text-ink-soft">{[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (<li key={l}><a href={h} className="transition-colors hover:text-green-deep">{l}</a></li>))}</ul>
      </div>
      <div>
        <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-ink">Contact</div>
        <ul className="space-y-2 text-sm font-bold text-ink-soft">
          <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-green-deep">Prendre rendez-vous</a></li>
          <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-green-deep">contact@axem-ia.fr</a></li>
          <li>axem-ia.fr</li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t-2 border-dashed border-ink/30 pt-8 text-xs font-bold text-ink-soft md:flex-row">
      <span>© 2026 AXEM IA — Paris, France</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-green px-3 py-1 font-extrabold text-ink shadow-hard-sm">
        <svg className="h-3.5 w-3.5 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
