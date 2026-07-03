import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Sun, Moon, ArrowRight, ArrowUpRight, Mail, Sparkles, FileText, ShieldCheck,
  Search, Compass, Workflow, GraduationCap, UserRound, Clapperboard, LifeBuoy, Check,
} from 'lucide-react';

// =====================================================================
// AXEM IA — direction « produit clean » (Linear / Vercel / Stripe / Raycast)
// Monochrome + 1 accent · Inter · hairlines · bento · micro-interactions <250ms
// Thèmes clair/sombre via [data-theme] (voir index.html + src/index.css)
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';
const ease = [0.16, 1, 0.3, 1] as const;

// ---------- helpers ----------
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
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
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1400);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * value));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  const fmt = n >= 1000 ? n.toLocaleString('fr-FR') : String(n);
  return <span ref={ref} className={className}>{prefix}{fmt}{suffix}</span>;
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
    <span className="h-1 w-1 rounded-full bg-accent" />
    {children}
  </div>
);

const Section: React.FC<{ id?: string; children: React.ReactNode; className?: string }> = ({ id, children, className = '' }) => (
  <section id={id} className={`px-6 py-20 md:py-28 ${className}`}>
    <div className="mx-auto max-w-container">{children}</div>
  </section>
);

// ---------- theme toggle ----------
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  );
  const toggle = () =>
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      (document.documentElement.style as any).colorScheme = next;
      try { localStorage.setItem('axem-theme', next); } catch { /* noop */ }
      return next;
    });
  return { theme, toggle };
}

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-muted transition-colors hover:text-ink hover:border-hairline-strong"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

// ---------- buttons ----------
const PrimaryBtn: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ href, children, className = '' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast transition-transform duration-150 hover:-translate-y-px ${className}`}
  >
    {children}
    <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
  </a>
);

const GhostBtn: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-hairline-strong hover:bg-surface-2"
  >
    {children}
  </a>
);

// ---------- NAV ----------
const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links: [string, string][] = [
    ['Prestations', '#prestations'],
    ['Le duo', '#duo'],
    ['Références', '#references'],
    ['Méthode', '#methode'],
  ];
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-hairline bg-bg/80 backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-6">
        <a href="#top" className="text-lg font-bold tracking-tight text-ink">
          AXEM<span className="text-accent">.</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="text-sm font-medium text-muted transition-colors hover:text-ink">
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <PrimaryBtn href={CALENDLY} className="hidden sm:inline-flex">Rendez-vous</PrimaryBtn>
        </div>
      </div>
    </nav>
  );
};

// ---------- HERO MOCK : panneau produit clean (façon capture Linear/Vercel) ----------
const HeroMock: React.FC = () => {
  const steps = [
    { icon: Mail, label: 'Email entrant', meta: 'Devis fournisseur.pdf', done: true },
    { icon: Sparkles, label: 'Extraction IA', meta: 'Claude · lecture du document', active: true },
    { icon: FileText, label: 'Chiffrage généré', meta: 'Ligne à ligne · 12 postes', done: false },
    { icon: ShieldCheck, label: 'Validation humaine', meta: 'Contrôle final · 1 clic', done: false },
  ];
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-2 shadow-sm">
      {/* window bar */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-hairline-strong" />
        <span className="ml-2 text-xs font-medium text-faint">axem · automatisation — chiffrage BTP</span>
      </div>
      {/* body */}
      <div className="rounded-xl border border-hairline bg-bg p-3">
        <div className="space-y-1.5">
          {steps.map((s, i) => (
            <div key={s.label} className="relative">
              {i < steps.length - 1 && <span aria-hidden className="absolute left-[26px] top-[42px] h-[14px] w-px bg-hairline" />}
              <div className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${s.active ? 'border-accent/40 bg-accent-soft' : 'border-hairline bg-surface'}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${s.active ? 'border-accent/40 text-accent' : 'border-hairline text-muted'}`}>
                  <s.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-ink">{s.label}</div>
                  <div className="truncate text-xs text-faint">{s.meta}</div>
                </div>
                {s.active ? (
                  <span className="axem-pulse h-2 w-2 shrink-0 rounded-full bg-accent" />
                ) : s.done ? (
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                ) : (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-hairline-strong" />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* result chips */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-hairline bg-surface px-3 py-2.5">
            <div className="text-lg font-bold tracking-tight text-ink">95 k€<span className="text-muted">/an</span></div>
            <div className="text-xs text-faint">économisés</div>
          </div>
          <div className="rounded-lg border border-hairline bg-surface px-3 py-2.5">
            <div className="text-lg font-bold tracking-tight text-ink">−80 %</div>
            <div className="text-xs text-faint">de temps de saisie</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- HERO ----------
const Hero: React.FC = () => (
  <section id="top" className="relative overflow-hidden px-6 pb-16 pt-28 md:pb-24 md:pt-36">
    {/* fond subtil : léger halo accent, pas de WebGL */}
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl" style={{ background: 'radial-gradient(circle, var(--accent), transparent 68%)' }} />
    </div>
    <div className="mx-auto grid max-w-container items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
      {/* left */}
      <div>
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Agence d'IA &amp; organisme de formation certifié Qualiopi
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-ink">
            Votre partenaire IA,<br />de A à Z.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            On vous forme, on vous conseille, on déploie. <span className="font-medium text-ink">Et on reste.</span> Audit, conseil stratégique, automatisation et formation IA — pour concevoir et livrer des solutions concrètes.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryBtn href={CALENDLY}>Prendre rendez-vous</PrimaryBtn>
            <GhostBtn href="#prestations">Découvrir nos prestations</GhostBtn>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              <img src={CLEMENT_IMG} alt="Clément Predo" className="h-8 w-8 rounded-full object-cover ring-2 ring-bg" loading="lazy" />
              <img src={ALEXIS_IMG} alt="Alexis Zeitoun" className="h-8 w-8 rounded-full object-cover ring-2 ring-bg" loading="lazy" />
            </div>
            <span className="text-sm text-muted">
              <span className="font-semibold text-ink">+55 000</span> abonnés LinkedIn nous suivent
            </span>
          </div>
        </Reveal>
      </div>
      {/* right — product mock */}
      <Reveal delay={0.12} className="lg:pl-4">
        <HeroMock />
      </Reveal>
    </div>
  </section>
);

// ---------- TRUST ----------
const Trust: React.FC = () => {
  const logos = [
    { src: '/logos/carrefour.svg', alt: 'Carrefour' },
    { src: '/logos/pennylane.svg', alt: 'Pennylane' },
    { src: '/logos/cegos.png', alt: 'Cegos' },
    { src: '/logos/blackfin.png', alt: 'BlackFin Capital' },
    { src: '/logos/gravotech.png', alt: 'Gravotech' },
    { src: '/logos/dragonllm.svg', alt: 'Dragon LLM' },
    { src: '/logos/asphere.png', alt: 'ASphere' },
    { src: '/logos/myconnecting.png', alt: 'myconnecting' },
    { src: '/logos/mammouth.svg', alt: 'Mammouth AI' },
    { src: '/logos/avantis.png', alt: 'Avantis' },
    { src: '/logos/senza.png', alt: 'SENZA' },
  ];
  return (
    <section id="references" className="border-y border-hairline bg-bg-subtle px-6 py-14">
      <div className="mx-auto max-w-container">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-faint">
          Des PME aux grands comptes &amp; administrations
        </p>
        <div className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((l) => (
            <div key={l.alt} className="flex items-center justify-center">
              <img src={l.src} alt={l.alt} loading="lazy" decoding="async" className="trust-logo h-7 w-auto max-w-[130px] object-contain md:h-8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- SERVICES ----------
const Services: React.FC = () => {
  const items = [
    { icon: Search, t: 'Audit IA', d: 'On regarde avant de déployer. Diagnostic, cartographie de vos process, scoring de maturité IA.', price: '1 à 4 semaines' },
    { icon: Compass, t: 'Conseil stratégique', d: 'On décide quoi faire, dans quel ordre, avec quels budgets. Roadmap priorisée, choix des outils.', price: 'Sur devis' },
    { icon: Workflow, t: 'Déploiement & automatisation', d: 'Des workflows qui tournent seuls, 7j/7. n8n, Make, Claude Code. Clé en main ou suivi.', price: 'Dès 1 200 €' },
    { icon: GraduationCap, t: 'Formation Qualiopi', d: 'Vos équipes opérationnelles dès J+1. 10 formations, 3 niveaux, 70 % de pratique. Finançable OPCO.', price: '200 – 1 250 € / pers.' },
    { icon: UserRound, t: 'Coaching individuel', d: 'Pour vos profils clés : managers, dirigeants, référents IA. On ancre les compétences dans la durée.', price: '200 € / session' },
    { icon: Clapperboard, t: 'Production IA', d: 'Vidéos avatar, voix clonée, visuels, sites no-code, présentations. Produits 10× plus vite.', price: 'Sur devis' },
    { icon: LifeBuoy, t: 'Suivi', d: 'Une fois déployé, on reste. Maintenance, évolutions, nouvelles automatisations. Long terme.', price: '80 € / mois' },
  ];
  return (
    <Section id="prestations">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Ce qu'on fait</Eyebrow>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-[-0.02em] text-ink">
            Sept prestations. Un partenaire.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          De l'audit au suivi long terme : un seul interlocuteur, du diagnostic à la production.
        </p>
      </div>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => (
          <Reveal key={s.t} delay={(i % 3) * 0.05}>
            <div className="group flex h-full flex-col gap-3 bg-surface p-6 transition-colors hover:bg-surface-2">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-faint">{s.price}</span>
              </div>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink">{s.t}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          </Reveal>
        ))}
        {/* CTA cell to fill the 8th slot */}
        <Reveal delay={0.1}>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col justify-between gap-6 bg-surface-2 p-6 transition-colors hover:bg-surface">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-contrast">
              <ArrowUpRight className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-ink">Un projet en tête ?</h3>
              <p className="mt-1 text-sm text-muted">30 min avec Clément ou Alexis pour cadrer vos leviers.</p>
            </div>
          </a>
        </Reveal>
      </div>
    </Section>
  );
};

// ---------- RESULTS (bento) ----------
const Results: React.FC = () => {
  const stats = [
    { v: 55000, p: '+', s: '', l: 'abonnés LinkedIn' },
    { v: 10, p: '', s: '', l: 'formations Qualiopi' },
    { v: 70, p: '', s: ' %', l: 'de pratique' },
  ];
  const cases = [
    { sector: 'BTP · Chiffrage', r: '−80 %', d: 'de temps de saisie · 95 k€/an neutralisés sur le chiffrage fournisseurs.' },
    { sector: 'Administration · OCR', r: '×4', d: 'plus rapide, fiabilité 100 % par double vérification automatisée.' },
    { sector: 'Industrie · Conformité ADV', r: '317 h', d: 'libérées par mois, anomalies détectées à plus de 98 %.' },
  ];
  return (
    <Section className="border-t border-hairline">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Résultats</Eyebrow>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-[-0.02em] text-ink">
            Des résultats. Pas des slides.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          Des cas réels, chiffrés, en production — pas des démos.
        </p>
      </div>

      {/* cases */}
      <div className="grid gap-5 md:grid-cols-3">
        {cases.map((c, i) => (
          <Reveal key={c.sector} delay={i * 0.06}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-hairline bg-surface p-6 transition-colors hover:border-hairline-strong">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">{c.sector}</span>
              <span className="text-4xl font-bold tracking-tight text-ink md:text-5xl">{c.r}</span>
              <p className="text-sm leading-relaxed text-muted">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* stats strip */}
      <Reveal delay={0.1}>
        <div className="mt-5 grid grid-cols-2 divide-hairline overflow-hidden rounded-2xl border border-hairline bg-surface md:grid-cols-4 md:divide-x">
          {stats.map((s) => (
            <div key={s.l} className="border-t border-hairline p-6 md:border-t-0">
              <div className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                <Counter value={s.v} prefix={s.p} suffix={s.s} />
              </div>
              <div className="mt-1 text-sm text-muted">{s.l}</div>
            </div>
          ))}
          <div className="border-t border-hairline p-6 md:border-l md:border-t-0">
            <div className="text-3xl font-bold tracking-tight text-accent md:text-4xl">J+1</div>
            <div className="mt-1 text-sm text-muted">opérationnel</div>
          </div>
        </div>
      </Reveal>
    </Section>
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
    <Section id="methode" className="border-t border-hairline bg-bg-subtle">
      <div className="mb-12">
        <Eyebrow>Comment on travaille</Eyebrow>
        <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-[-0.02em] text-ink">
          En 3 étapes. Pas une de plus.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <div className="flex h-full flex-col gap-4 rounded-2xl border border-hairline bg-surface p-7">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-faint">{s.n}</span>
                <span className="rounded-full border border-hairline px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">{s.meta}</span>
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-ink">{s.t}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

// ---------- DUO ----------
const Duo: React.FC = () => {
  const founders = [
    { img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC', role: 'Stratégie · Formation · Conseil', desc: 'Le stratège. Je traduis l\'IA en résultats concrets et pilote les missions audit et stratégie.', n: 40000, li: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/' },
    { img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Institut Polytechnique de Paris', role: 'Tech · Déploiement · Systèmes', desc: 'L\'ingénieur. Je conçois et déploie l\'IA en production. Expérience secteur financier & Private Equity.', n: 15000, li: 'https://www.linkedin.com/in/alexiszeitoun/' },
  ];
  return (
    <Section id="duo" className="border-t border-hairline">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Les fondateurs</Eyebrow>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold tracking-[-0.02em] text-ink">
            AXEM, c'est nous deux.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          Le stratège et l'ingénieur. Pas de relais qui se perd : vous parlez à ceux qui livrent.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {founders.map((f, i) => (
          <Reveal key={f.name} delay={i * 0.06}>
            <div className="group flex h-full gap-5 rounded-2xl border border-hairline bg-surface p-5 transition-colors hover:border-hairline-strong sm:p-6">
              <img src={f.img} alt={f.name} loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover grayscale transition-all duration-300 group-hover:grayscale-0 sm:h-28 sm:w-28" />
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="text-lg font-semibold tracking-tight text-ink">{f.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">{f.school}</p>
                <p className="mt-0.5 text-sm text-faint">{f.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.desc}</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-sm text-muted">
                    <span className="font-semibold text-ink"><Counter value={f.n} prefix="+" /></span> abonnés
                  </span>
                  <a href={f.li} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-accent" aria-label={`LinkedIn ${f.name}`}>
                    LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

// ---------- FINAL CTA (sobre) ----------
const FinalCTA: React.FC = () => (
  <Section className="border-t border-hairline">
    <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface px-6 py-16 text-center md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 opacity-[0.12] blur-2xl" style={{ background: 'radial-gradient(50% 100% at 50% 0%, var(--accent), transparent)' }} />
      <h2 className="mx-auto max-w-2xl text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-ink">
        Parlons de votre projet.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
        Pas un commercial. Directement Clément ou Alexis. 30 minutes pour identifier vos leviers les plus rentables.
      </p>
      <div className="mt-8 flex justify-center">
        <PrimaryBtn href={CALENDLY} className="px-5 py-3 text-base">Réserver un diagnostic gratuit</PrimaryBtn>
      </div>
    </div>
  </Section>
);

// ---------- FOOTER ----------
const Footer: React.FC = () => (
  <footer className="border-t border-hairline px-6 py-14">
    <div className="mx-auto max-w-container">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <a href="#top" className="text-lg font-bold tracking-tight text-ink">
            AXEM<span className="text-accent">.</span>
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Votre partenaire IA, de A à Z. Agence d'IA &amp; organisme de formation certifié Qualiopi.
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-faint">Navigation</div>
          <ul className="space-y-2 text-sm text-muted">
            {[['Prestations', '#prestations'], ['Le duo', '#duo'], ['Références', '#references'], ['Méthode', '#methode']].map(([l, h]) => (
              <li key={l}><a href={h} className="transition-colors hover:text-ink">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-faint">Contact</div>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Prendre rendez-vous</a></li>
            <li><a href="mailto:contact@axem-ia.fr" className="transition-colors hover:text-ink">contact@axem-ia.fr</a></li>
            <li>axem-ia.fr</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-8 text-xs text-faint md:flex-row">
        <span>© 2026 AXEM IA — Paris, France</span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-accent" />
          Qualiopi · Finançable OPCO
        </span>
      </div>
    </div>
  </footer>
);

const Home: React.FC = () => (
  <div className="min-h-screen bg-bg">
    <Nav />
    <main>
      <Hero />
      <Trust />
      <Services />
      <Results />
      <Method />
      <Duo />
      <FinalCTA />
    </main>
    <Footer />
  </div>
);

export default Home;
