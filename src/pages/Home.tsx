import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, useReducedMotion, useMotionValue, useSpring, useTransform,
  MotionConfig, animate,
} from 'framer-motion';
import { Reveal, CountUp, EASE } from '../ui/motion';
import { useLenis } from '../ui/useLenis';

// =====================================================================
// AXEM — PAGE DE DÉMO « 4 MODULES UX/UI ».
// DA bleu nuit NEUTRE (#070B16 / #0B1020), accent UNIQUE cyan/bleu
// (#38BDF8 / #5B8CFF). Tout scopé sous `.demo` (cf. index.css) pour ne pas
// entrer en conflit avec la peau verte globale.
//
// MODULE 01 — Grille logos IA : spotlight (torche radiale lerp) + magnétique
//             (spring) + hover-reveal. Desktop only pour spotlight/magnétique.
// MODULE 02 — Node-graph workflow vivant : tracé bézier (pathLength) + point de
//             données qui circule (animateMotion). Empilé vertical en mobile.
// MODULE 03 — Before/After slider draggable (souris + tactile + clavier).
// MODULE 04 — Calculateur « vie réelle » + compteur live d'impact.
//
// PERF : transform/opacity/SVG only · spotlight via custom props lissées (lerp)
// · mousemove throttlé en rAF · count-up rAF one-shot · live counter une seule
// boucle ancrée sur le temps · prefers-reduced-motion coupe flux/spotlight.
// =====================================================================

const MODULES: [string, string][] = [
  ['01', 'Les outils'],
  ['02', 'La méthode'],
  ['03', 'La métamorphose'],
  ['04', "L'impact"],
];

// ---------------------------------------------------------------------
// hook : section active (pour surligner l'ancre courante). IntersectionObserver,
// pas de scroll-listener par frame.
// ---------------------------------------------------------------------
const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids.join(',')]);
  return active;
};

// ---------------------------------------------------------------------
// NAV — pilule + menu d'ancres 01·02·03·04.
// ---------------------------------------------------------------------
const Nav: React.FC = () => {
  const active = useActiveSection(['mod-01', 'mod-02', 'mod-03', 'mod-04']);
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6">
      <nav className="demo-nav flex w-full max-w-2xl items-center justify-between gap-3 rounded-full py-2 pl-5 pr-3">
        <a href="#top" className="d-display text-xl leading-none text-[var(--txt)]">
          AXEM<span className="d-grad-text">.</span>
          <span className="ml-2 d-eyebrow align-middle text-[var(--txt-dim)]">démo</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          {MODULES.map(([num], i) => (
            <a
              key={num}
              href={`#mod-${num}`}
              data-active={active === `mod-${num}` ? 'true' : 'false'}
              className="demo-anchor rounded-full px-2.5 py-1.5 text-[13px] font-medium text-[var(--txt-dim)] [touch-action:manipulation] sm:px-3"
              aria-label={`Module ${num}`}>
              {num}
              {i < MODULES.length - 1 && <span className="ml-2 text-[var(--line-strong)] sm:ml-3">·</span>}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

// ---------------------------------------------------------------------
// En-tête de section réutilisé.
// ---------------------------------------------------------------------
const SectionHead: React.FC<{ num: string; kicker: string; title: React.ReactNode; sub: string }> = ({
  num, kicker, title, sub,
}) => (
  <div className="mx-auto max-w-2xl text-center">
    <Reveal>
      <div className="d-eyebrow inline-flex items-center gap-2.5 text-[var(--cyan)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" />
        Module {num} · {kicker}
      </div>
    </Reveal>
    <Reveal delay={0.06} perspective>
      <h2 className="d-display mt-5 text-[var(--txt)]" style={{ fontSize: 'clamp(30px, 5vw, 56px)' }}>
        {title}
      </h2>
    </Reveal>
    <Reveal delay={0.12}>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--txt-soft)]">{sub}</p>
    </Reveal>
  </div>
);

// =====================================================================
// HERO
// =====================================================================
const Hero: React.FC = () => (
  <section id="top" className="relative flex min-h-[78svh] flex-col items-center justify-center px-5 pb-24 pt-40 text-center md:px-8">
    <Reveal>
      <div className="d-eyebrow inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-[rgba(13,19,41,0.5)] px-4 py-1.5 text-[var(--cyan)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cyan)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--cyan)]" />
        </span>
        Démo interactive · 4 modules
      </div>
    </Reveal>
    <Reveal delay={0.08} perspective>
      <h1 className="d-display mt-8 max-w-4xl text-balance text-[var(--txt)]" style={{ fontSize: 'clamp(38px, 8vw, 92px)' }}>
        L'interface, <span className="d-grad-text">jugée en vrai.</span>
      </h1>
    </Reveal>
    <Reveal delay={0.16}>
      <p className="mt-7 max-w-xl text-balance text-[16px] leading-relaxed text-[var(--txt-soft)] md:text-[18px]">
        Quatre modules d'UX/UI interactifs, isolés pour évaluation. Survolez, glissez,
        ajustez — chaque interaction est pensée pour être fluide, pas pour épater à vide.
      </p>
    </Reveal>
    <Reveal delay={0.24}>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {MODULES.map(([num, label]) => (
          <a key={num} href={`#mod-${num}`}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(13,19,41,0.4)] px-4 py-2 text-[13px] text-[var(--txt-soft)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--txt)] [touch-action:manipulation]">
            <span className="d-display text-[var(--cyan)]">{num}</span>
            {label}
          </a>
        ))}
      </div>
    </Reveal>
  </section>
);

// =====================================================================
// MODULE 01 — GRILLE LOGOS IA (spotlight + magnétique + reveal)
// =====================================================================
const TOOLS: { name: string; mono: string; use: string }[] = [
  { name: 'Claude', mono: 'C', use: 'Agents & rédaction longue' },
  { name: 'Claude Code', mono: '⌘', use: 'Dev assisté & refactor' },
  { name: 'n8n', mono: 'n8', use: 'Automatisations sur-mesure' },
  { name: 'Make', mono: 'M', use: 'Connexions no-code' },
  { name: 'OpenAI', mono: 'OA', use: 'Génération & vision' },
  { name: 'Mistral', mono: 'Mi', use: 'Modèles souverains EU' },
  { name: 'Gemini', mono: 'G', use: 'Multimodal & contexte long' },
  { name: 'Perplexity', mono: 'Px', use: 'Recherche sourcée' },
];

// Chip magnétique : translation spring vers le curseur (<0.18 du delta).
// Désactivé reduced-motion + tactile (onMouseMove ne tire pas au tap).
const ToolChip: React.FC<{ tool: typeof TOOLS[number]; reduce: boolean }> = ({ tool, reduce }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });
  const [open, setOpen] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.18);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <motion.button
      ref={ref}
      type="button"
      data-open={open ? 'true' : 'false'}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => setOpen((v) => !v)}
      style={reduce ? undefined : { x, y }}
      className="tool-chip flex flex-col items-center gap-2.5 px-3 py-5 text-center outline-none [touch-action:manipulation]"
      aria-label={`${tool.name} — ${tool.use}`}>
      <span className="tool-mono" aria-hidden>{tool.mono}</span>
      <span className="d-display text-[13.5px] text-[var(--txt)]">{tool.name}</span>
      <span className="tool-reveal" role="tooltip">{tool.use}</span>
    </motion.button>
  );
};

const Module01: React.FC = () => {
  const reduce = !!useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  // spotlight : --mx/--my lissés en lerp, mousemove throttlé en rAF.
  const target = useRef({ x: 0.5, y: 0.5 });
  const cur = useRef({ x: 0.5, y: 0.5 });
  const raf = useRef(0);

  const tick = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    cur.current.x += (target.current.x - cur.current.x) * 0.16;
    cur.current.y += (target.current.y - cur.current.y) * 0.16;
    el.style.setProperty('--mx', `${cur.current.x * 100}%`);
    el.style.setProperty('--my', `${cur.current.y * 100}%`);
    const dx = Math.abs(target.current.x - cur.current.x);
    const dy = Math.abs(target.current.y - cur.current.y);
    if (dx > 0.001 || dy > 0.001) {
      raf.current = requestAnimationFrame(tick);
    } else {
      raf.current = 0;
    }
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = gridRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    target.current.x = (e.clientX - r.left) / r.width;
    target.current.y = (e.clientY - r.top) / r.height;
    el.dataset.lit = 'true';
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };
  const onLeave = () => {
    const el = gridRef.current;
    if (el) el.dataset.lit = 'false';
  };
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  return (
    <section id="mod-01" className="section-clip px-5 py-[clamp(96px,14vh,180px)] md:px-8">
      <SectionHead
        num="01" kicker="Les outils qu'on maîtrise"
        title={<>Une stack, <span className="d-grad-text">éclairée au curseur.</span></>}
        sub="Passez la torche sur la grille : chaque outil s'illumine et révèle ce qu'on en fait. Sur mobile, touchez un outil pour afficher son usage."
      />
      <div className="mx-auto mt-14 max-w-4xl">
        <div
          ref={gridRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          data-lit="false"
          className="tool-grid p-4 sm:p-6">
          <div className="tool-grid-torch" aria-hidden />
          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {TOOLS.map((t, i) => (
              <motion.div key={t.name}
                initial={reduce ? { opacity: 1 } : { opacity: 0.001, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={reduce ? { duration: 0.3 } : { type: 'spring', stiffness: 320, damping: 60, delay: (i % 4) * 0.05 }}>
                <ToolChip tool={t} reduce={reduce} />
              </motion.div>
            ))}
          </div>
        </div>
        <p className="mt-5 text-center text-[13px] text-[var(--txt-dim)]">
          Spotlight + magnétisme actifs au pointeur · grille statique &amp; tap-reveal au tactile.
        </p>
      </div>
    </section>
  );
};

// =====================================================================
// MODULE 02 — NODE-GRAPH WORKFLOW VIVANT
// =====================================================================
const FLOW_NODES = [
  { id: 'audit', label: 'Audit', x: 70, tip: 'On cartographie vos tâches répétitives.' },
  { id: 'n8n', label: 'n8n', x: 250, tip: 'Orchestration & automatisations sur-mesure.' },
  { id: 'claude', label: 'Claude', x: 430, tip: 'Raisonnement, rédaction, décisions.' },
  { id: 'make', label: 'Make', x: 610, tip: 'Connexions no-code vers vos outils.' },
  { id: 'liv', label: 'Livrable', x: 790, tip: 'Résultat livré, mesuré, maintenu.' },
];
const NODE_Y = 90;
const NODE_W = 110;
const NODE_H = 48;

// chemin bézier reliant les centres des nœuds (un seul path continu pour le dot).
const flowPath = (() => {
  const cx = FLOW_NODES.map((n) => n.x + NODE_W / 2);
  let d = `M ${cx[0]} ${NODE_Y + NODE_H / 2}`;
  for (let i = 1; i < cx.length; i++) {
    const x0 = cx[i - 1];
    const x1 = cx[i];
    const mid = (x0 + x1) / 2;
    d += ` C ${mid} ${NODE_Y + NODE_H / 2}, ${mid} ${NODE_Y + NODE_H / 2}, ${x1} ${NODE_Y + NODE_H / 2}`;
  }
  return d;
})();

const Module02: React.FC = () => {
  const reduce = !!useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  // séquence d'allumage des nœuds : un seul timer one-shot quand visible.
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(reduce ? FLOW_NODES.length : 0);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    let timers: number[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        FLOW_NODES.forEach((_, i) => {
          timers.push(window.setTimeout(() => setLit(i + 1), 350 + i * 320));
        });
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [reduce]);

  return (
    <section id="mod-02" className="section-clip px-5 py-[clamp(96px,14vh,180px)] md:px-8">
      <SectionHead
        num="02" kicker="Notre méthode"
        title={<>Un workflow <span className="d-grad-text">qui s'anime.</span></>}
        sub="La ligne se trace, les nœuds s'allument en séquence et un point de donnée circule en continu. Survolez un nœud pour savoir ce qu'il fait."
      />

      {/* DESKTOP / TABLETTE — graphe horizontal SVG */}
      <div ref={ref} className="relative mx-auto mt-14 hidden max-w-4xl md:block">
        <svg viewBox="0 0 900 180" className="flow-svg" role="img"
          aria-label="Workflow : Audit, n8n, Claude, Make, Livrable">
          <defs>
            <linearGradient id="demoFlowGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#5b8cff" />
            </linearGradient>
          </defs>

          {/* edge de fond + edge tracé (pathLength) */}
          <path className="flow-edge-bg" d={flowPath} />
          <motion.path className="flow-edge" d={flowPath}
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={reduce ? { duration: 0 } : { duration: 1.8, ease: EASE }} />

          {/* point de données qui circule — animateMotion (pas de dasharray en boucle) */}
          {!reduce && (
            <circle className="flow-dot" r="4.5">
              <animateMotion dur="4.5s" repeatCount="indefinite" path={flowPath} />
            </circle>
          )}

          {/* nœuds */}
          {FLOW_NODES.map((n, i) => (
            <g key={n.id} className="flow-node" data-on={i < lit ? 'true' : 'false'}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              tabIndex={0} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
              <rect className="flow-node-halo" x={n.x - 5} y={NODE_Y - 5} width={NODE_W + 10} height={NODE_H + 10}
                rx="16" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0"
                style={{ filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.6))' }} />
              <rect className="flow-node-box" x={n.x} y={NODE_Y} width={NODE_W} height={NODE_H} rx="14" />
              <text className="flow-node-label" x={n.x + NODE_W / 2} y={NODE_Y + NODE_H / 2 + 5}
                textAnchor="middle">{n.label}</text>
              <text x={n.x + NODE_W / 2} y={NODE_Y - 14} textAnchor="middle"
                className="d-eyebrow" fill="#6b76a0" style={{ fontSize: 9, letterSpacing: '0.18em' }}>
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          ))}
        </svg>

        {/* tooltips HTML positionnés en % au-dessus du nœud survolé */}
        {FLOW_NODES.map((n, i) => (
          <div key={n.id} className="flow-tip" data-show={hover === i ? 'true' : 'false'}
            style={{ left: `${((n.x + NODE_W / 2) / 900) * 100}%`, top: `${(NODE_Y / 180) * 100 - 4}%` }}>
            {n.tip}
          </div>
        ))}
      </div>

      {/* MOBILE — version empilée verticale simplifiée (zéro débordement) */}
      <div className="mx-auto mt-12 max-w-sm md:hidden">
        <ol className="relative space-y-3">
          {FLOW_NODES.map((n, i) => (
            <li key={n.id} className="relative">
              <motion.div
                initial={reduce ? { opacity: 1 } : { opacity: 0.001, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={reduce ? { duration: 0.3 } : { type: 'spring', stiffness: 320, damping: 60, delay: i * 0.08 }}
                className="flow-stack-step flex items-center gap-4 p-4">
                <span className="flow-stack-dot shrink-0" aria-hidden />
                <div>
                  <div className="d-display text-[15px] text-[var(--txt)]">
                    <span className="text-[var(--cyan)]">{String(i + 1).padStart(2, '0')}</span> · {n.label}
                  </div>
                  <p className="mt-0.5 text-[13px] leading-snug text-[var(--txt-soft)]">{n.tip}</p>
                </div>
              </motion.div>
              {i < FLOW_NODES.length - 1 && (
                <span className="flow-stack-line absolute left-[31px] top-[100%] h-3" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

// =====================================================================
// MODULE 03 — BEFORE/AFTER SLIDER DRAGGABLE
// =====================================================================
const BEFORE_TEXT = `objet: rdv

slt, donc voilà faudrait qu'on
se voie pour parler du projet
truc dont on avait parlé la
dernière fois jsais plus quand
exactement... t'es dispo quand ?
genre cette semaine ou la
prochaine ? bon a+`;

const AFTER_TEXT = `Objet : Point projet — créneau cette semaine ?

Bonjour Camille,

Je reviens vers vous concernant le projet
évoqué récemment. Seriez-vous disponible
pour un échange de 30 minutes ?

Je vous propose jeudi 14 h ou vendredi 10 h —
dites-moi ce qui vous arrange.

Bien à vous,
Léa`;

const Module03: React.FC = () => {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50); // % (0 = tout AFTER, 100 = tout BEFORE)
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => { if (dragging.current) setFromClientX(e.clientX); };
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [setFromClientX]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { setPos((p) => Math.max(2, p - 4)); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPos((p) => Math.min(98, p + 4)); e.preventDefault(); }
    if (e.key === 'Home') { setPos(2); e.preventDefault(); }
    if (e.key === 'End') { setPos(98); e.preventDefault(); }
  };

  return (
    <section id="mod-03" className="section-clip px-5 py-[clamp(96px,14vh,180px)] md:px-8">
      <SectionHead
        num="03" kicker="La métamorphose"
        title={<>Du brouillon <span className="d-grad-text">au livrable.</span></>}
        sub="Glissez le séparateur (souris, doigt ou flèches du clavier) pour révéler ce que l'IA fait d'un email jeté en vrac : un message pro, prêt à envoyer."
      />
      <div className="mx-auto mt-14 max-w-3xl">
        <div
          ref={wrapRef}
          className="ba-wrap aspect-[4/3] sm:aspect-[16/9]"
          style={{ ['--pos' as any]: `${pos}%` }}
          onPointerDown={(e) => { dragging.current = true; setFromClientX(e.clientX); }}>
          {/* BEFORE — input brut */}
          <div className="ba-panel ba-before flex flex-col p-5 sm:p-7">
            <span className="ba-tag ba-tag-before">Avant · brut</span>
            <pre className="ba-mono mt-10 text-[var(--txt-dim)]">{BEFORE_TEXT}</pre>
          </div>
          {/* AFTER — résultat IA (clip-path piloté par --pos) */}
          <div className="ba-panel ba-after flex flex-col p-5 sm:p-7">
            <span className="ba-tag ba-tag-after">Après · IA</span>
            <pre className="ba-mono mt-10 text-[var(--txt)]">{AFTER_TEXT}</pre>
          </div>
          {/* séparateur + knob accessible */}
          <div className="ba-handle" aria-hidden />
          <div
            role="slider"
            tabIndex={0}
            aria-label="Curseur avant / après"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(100 - pos)}
            aria-valuetext={`${Math.round(100 - pos)} % de résultat IA révélé`}
            onKeyDown={onKey}
            className="ba-knob"
            style={{ left: `${pos}%` }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M7 4 L3 9 L7 14 M11 4 L15 9 L11 14" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <p className="mt-5 text-center text-[13px] text-[var(--txt-dim)]">
          Glissez → ou utilisez ← / → au clavier. {reduce ? '' : 'Même mock, deux états — aucune image lourde.'}
        </p>
      </div>
    </section>
  );
};

// =====================================================================
// MODULE 04 — CALCULATEUR « VIE RÉELLE » + COMPTEUR LIVE
// =====================================================================
// Compteur live ancré sur le temps : base + taux × secondes écoulées.
// Une seule boucle rAF, largeur fixe (tabular-nums) → anti-CLS.
const LIVE_BASE = 128_400;      // heures déjà économisées (point d'ancrage)
const LIVE_RATE = 0.42;         // heures / seconde (incrément réaliste)
const LIVE_EPOCH = Date.UTC(2026, 0, 1) / 1000; // ancrage temporel fixe

const LiveCounter: React.FC = () => {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const compute = () => LIVE_BASE + LIVE_RATE * (Date.now() / 1000 - LIVE_EPOCH);
    const fmt = (n: number) =>
      Math.floor(n).toLocaleString('fr-FR').replace(/ | /g, ' ');
    if (reduce) {
      if (ref.current) ref.current.textContent = fmt(compute());
      return;
    }
    let raf = 0;
    const loop = () => {
      if (ref.current) ref.current.textContent = fmt(compute());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  // largeur réservée par un placeholder invisible (anti-CLS)
  return (
    <span className="live-counter relative inline-block text-right">
      <span aria-hidden className="invisible">000 000</span>
      <span ref={ref} className="absolute inset-0 text-[var(--txt)]">{LIVE_BASE.toLocaleString('fr-FR')}</span>
    </span>
  );
};

const Module04: React.FC = () => {
  const reduce = !!useReducedMotion();
  const [team, setTeam] = useState(8);     // taille d'équipe
  const [hours, setHours] = useState(6);   // heures répétitives / sem / personne

  // formules cohérentes, coef réaliste ~0.4 (part automatisable).
  const COEF = 0.4;
  const hoursPerMonth = Math.round(team * hours * 4.33 * COEF);   // heures récupérables / mois
  const weeks = +(hoursPerMonth / 35).toFixed(1);                 // semaines de travail (35 h)
  const etp = +((hoursPerMonth * 12) / (35 * 47)).toFixed(1);     // ETP libéré (47 sem actives/an)

  // count-up rAF one-shot à chaque changement de valeur cible (pas par frame de scroll).
  const useAnimatedNumber = (value: number, decimals = 0) => {
    const [shown, setShown] = useState(value);
    const prev = useRef(value);
    useEffect(() => {
      if (reduce) { setShown(value); prev.current = value; return; }
      const controls = animate(prev.current, value, {
        duration: 0.6, ease: EASE,
        onUpdate: (v) => setShown(+v.toFixed(decimals)),
        onComplete: () => { prev.current = value; },
      });
      return () => controls.stop();
    }, [value, decimals]);
    return shown;
  };
  const aHours = useAnimatedNumber(hoursPerMonth);
  const aWeeks = useAnimatedNumber(weeks, 1);
  const aEtp = useAnimatedNumber(etp, 1);

  const fmtInt = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ');
  const fmtDec = (n: number) => n.toFixed(1).replace('.', ',');

  return (
    <section id="mod-04" className="section-clip px-5 py-[clamp(96px,14vh,180px)] md:px-8">
      <SectionHead
        num="04" kicker="Combien vous récupérez"
        title={<>Le temps rendu, <span className="d-grad-text">en clair.</span></>}
        sub="Ajustez votre équipe et les heures répétitives par personne. On traduit le gain en heures, en semaines de travail et en équivalent temps plein libéré."
      />

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* curseurs */}
        <Reveal>
          <div className="d-card flex flex-col gap-8 rounded-3xl p-7 md:p-8">
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <label htmlFor="team" className="d-eyebrow text-[var(--txt-soft)]">Taille d'équipe</label>
                <span className="d-display text-2xl text-[var(--txt)] calc-out">{team}</span>
              </div>
              <input id="team" type="range" min={1} max={50} value={team}
                onChange={(e) => setTeam(+e.target.value)} className="calc-range"
                aria-valuetext={`${team} personnes`} />
              <div className="mt-1.5 flex justify-between text-[11px] text-[var(--txt-dim)]"><span>1</span><span>50</span></div>
            </div>
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <label htmlFor="hours" className="d-eyebrow text-[var(--txt-soft)]">Heures répétitives / sem / pers.</label>
                <span className="d-display text-2xl text-[var(--txt)] calc-out">{hours} h</span>
              </div>
              <input id="hours" type="range" min={1} max={20} value={hours}
                onChange={(e) => setHours(+e.target.value)} className="calc-range"
                aria-valuetext={`${hours} heures`} />
              <div className="mt-1.5 flex justify-between text-[11px] text-[var(--txt-dim)]"><span>1 h</span><span>20 h</span></div>
            </div>
            <p className="text-[12.5px] leading-relaxed text-[var(--txt-dim)]">
              Hypothèse : ~40 % des tâches répétitives sont automatisables. Estimation indicative,
              affinée lors de l'audit.
            </p>
          </div>
        </Reveal>

        {/* sorties */}
        <Reveal delay={0.08}>
          <div className="d-card flex flex-col justify-center rounded-3xl p-7 md:p-9">
            <div>
              <div className="d-eyebrow text-[var(--cyan)]">Heures récupérables / mois</div>
              <div className="d-display mt-1 leading-none text-[var(--txt)]" style={{ fontSize: 'clamp(56px, 12vw, 104px)' }}>
                <span className="calc-out">{fmtInt(aHours)}</span>
                <span className="ml-2 align-baseline text-[0.35em] text-[var(--txt-soft)]">h</span>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[var(--line)] bg-[rgba(9,14,28,0.5)] p-5">
                <div className="d-display text-[var(--txt)]" style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}>
                  <span className="calc-out">{fmtDec(aWeeks)}</span>
                </div>
                <div className="mt-1 text-[13px] leading-snug text-[var(--txt-soft)]">semaines de travail récupérées / mois</div>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-[rgba(9,14,28,0.5)] p-5">
                <div className="d-display text-[var(--txt)]" style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}>
                  ≈ <span className="calc-out">{fmtDec(aEtp)}</span>
                </div>
                <div className="mt-1 text-[13px] leading-snug text-[var(--txt-soft)]">ETP libéré sur l'année</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* COMPTEUR LIVE d'impact */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-center gap-3 rounded-3xl border border-[var(--line)] bg-[rgba(13,19,41,0.45)] px-6 py-7 text-center sm:flex-row sm:gap-5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cyan)] opacity-60" />}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--cyan)]" />
          </span>
          <span className="d-display text-[var(--txt)]" style={{ fontSize: 'clamp(26px, 5vw, 44px)' }}>
            <LiveCounter />
            <span className="ml-2 text-[0.5em] text-[var(--txt-soft)]">heures</span>
          </span>
          <span className="text-[14px] text-[var(--txt-soft)]">déjà économisées pour nos clients</span>
        </div>
      </Reveal>
    </section>
  );
};

// =====================================================================
// FOOTER léger
// =====================================================================
const Footer: React.FC = () => (
  <footer className="border-t border-[var(--line)] px-5 py-14 text-center md:px-8">
    <a href="#top" className="d-display text-3xl text-[var(--txt)]">AXEM<span className="d-grad-text">.</span></a>
    <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-[var(--txt-soft)]">
      Page de démo — 4 modules d'UX/UI interactifs pour évaluation. Une fois validés, on les
      généralise au site.
    </p>
    <p className="mt-6 text-[12px] text-[var(--txt-dim)]">© 2026 AXEM IA — démo interne.</p>
  </footer>
);

// =====================================================================
// PAGE
// =====================================================================
const Home: React.FC = () => {
  useLenis();
  return (
    <MotionConfig reducedMotion="user">
      <a href="#mod-01" className="skip-link">Aller aux modules</a>
      <div className="demo min-h-screen">
        <div className="demo-bg" aria-hidden />
        <div className="demo-grid" aria-hidden />
        <Nav />
        <main>
          <Hero />
          <Module01 />
          <Module02 />
          <Module03 />
          <Module04 />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default Home;
