import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eyebrow, FadeUp } from './primitives';

// =====================================================================
// §7 — FORMATION FLIP. « 10 modules. 70 % les mains dans le cambouis. »
// n8n · Make · Claude Code. Grille de 10 tuiles FLIP (objectif au recto,
// outil + durée au verso). Une tuile « démo » = mini-workflow n8n animé en
// boucle (SVG). 3 niveaux. Sans Qualiopi/OPCO/OF.
// reduced-motion → pas de flip 3D (recto+verso empilés / clic révèle).
// =====================================================================

type Tile = { code: string; title: string; level: 'Découverte' | 'Intermédiaire' | 'Avancé'; tool: string; duration: string; price: string; demo?: boolean };
const TILES: Tile[] = [
  { code: 'F01', title: 'IA Essentielle', level: 'Découverte', tool: 'ChatGPT · Claude', duration: '1 j', price: '300 €' },
  { code: 'F02', title: 'Prompting Pro', level: 'Découverte', tool: 'Claude · Gemini', duration: '1 j', price: '350 €' },
  { code: 'F03', title: 'IA & Bureautique', level: 'Découverte', tool: 'Copilot · GPTs', duration: '1 j', price: '400 €' },
  { code: 'F04', title: 'Maîtriser Claude', level: 'Intermédiaire', tool: 'Projects · MCP', duration: '1 j', price: '450 €' },
  { code: 'F05', title: 'Création de contenu IA', level: 'Intermédiaire', tool: 'Claude · Midjourney', duration: '1,5 j', price: '550 €' },
  { code: 'F06', title: 'IA pour Managers', level: 'Intermédiaire', tool: 'Cas d\'usage métier', duration: '1 j', price: '600 €' },
  { code: 'F07', title: 'No-Code & Workflows', level: 'Avancé', tool: 'n8n · Make', duration: '2 j', price: '800 €', demo: true },
  { code: 'F08', title: 'Agents & MCP', level: 'Avancé', tool: 'Claude Code · MCP', duration: '2 j', price: '950 €' },
  { code: 'F09', title: 'IA & Données', level: 'Avancé', tool: 'RAG · OCR', duration: '2 j', price: '1 000 €' },
  { code: 'F10', title: 'Architecture IA sur-mesure', level: 'Avancé', tool: 'Claude Code · API', duration: '2,5 j', price: '1 250 €' },
];

const LEVEL_TINT: Record<Tile['level'], string> = {
  'Découverte': 'text-mint border-mint/30',
  'Intermédiaire': 'text-cyan border-cyan/30',
  'Avancé': 'text-green border-green/30',
};

// mini-workflow n8n animé (SVG) — pulse qui circule entre 3 nœuds
const N8nDemo: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <svg viewBox="0 0 200 70" className="h-full w-full" fill="none" aria-hidden>
    <line x1="34" y1="35" x2="100" y2="35" stroke="rgba(120,160,255,0.3)" strokeWidth="2" />
    <line x1="100" y1="35" x2="166" y2="35" stroke="rgba(120,160,255,0.3)" strokeWidth="2" />
    {[34, 100, 166].map((cx) => (
      <g key={cx}>
        <rect x={cx - 14} y={21} width="28" height="28" rx="8" fill="rgba(13,21,38,0.9)" stroke="rgba(120,160,255,0.4)" strokeWidth="1.5" />
        <circle cx={cx} cy={35} r="4" fill="#5B8CFF" />
      </g>
    ))}
    {!reduce && (
      <motion.circle r="3.5" cy="35" fill="#38BDF8"
        animate={{ cx: [34, 100, 166] }}
        transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 0 5px rgba(56,189,248,0.9))' }} />
    )}
  </svg>
);

const FlipTile: React.FC<{ t: Tile; i: number }> = ({ t, i }) => {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = React.useState(false);
  const show = reduce ? flipped : flipped; // contrôle commun
  return (
    <FadeUp delay={(i % 5) * 0.05}>
      <button
        onMouseEnter={() => !reduce && setFlipped(true)}
        onMouseLeave={() => !reduce && setFlipped(false)}
        onClick={() => setFlipped((v) => !v)}
        onFocus={() => setFlipped(true)} onBlur={() => !reduce && setFlipped(false)}
        aria-label={`${t.title} — ${t.level}, ${t.tool}, ${t.duration}, ${t.price}`}
        className="group relative block h-[180px] w-full [perspective:1200px] outline-none [touch-action:manipulation]">
        <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] [transition-timing-function:var(--ease-out)]"
          style={{ transform: !reduce && flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          {/* RECTO — objectif */}
          <div className="glass absolute inset-0 flex flex-col rounded-2xl p-5 [backface-visibility:hidden]">
            <div className="flex items-center justify-between">
              <span className="font-serif-display text-2xl text-green/50">{t.code}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[9.5px] font-satoshi font-bold uppercase tracking-[0.1em] ${LEVEL_TINT[t.level]}`}>{t.level}</span>
            </div>
            <h3 className="font-serif-display mt-auto text-[20px] leading-[1.05] text-cream">{t.title}</h3>
            {t.demo ? (
              <div className="mt-2 h-8"><N8nDemo reduce={!!reduce} /></div>
            ) : (
              <span className="mt-2 text-[11px] text-cream-dim">Survol / clic → détails</span>
            )}
          </div>
          {/* VERSO — outil + durée + prix (en reduced-motion, révélé sous le recto via opacity) */}
          <div className="glass-strong absolute inset-0 flex flex-col justify-between rounded-2xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={reduce ? { transform: 'none', opacity: flipped ? 1 : 0, pointerEvents: flipped ? 'auto' : 'none' } : undefined}>
            <div>
              <span className="text-[10px] font-satoshi font-bold uppercase tracking-[0.12em] text-cyan">Outil</span>
              <p className="font-serif-display text-[19px] leading-tight text-cream">{t.tool}</p>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[13px] font-semibold text-cream-soft">{t.duration}</span>
              <span className="font-serif-display text-2xl text-cream">{t.price}</span>
            </div>
          </div>
        </div>
      </button>
    </FadeUp>
  );
};

const FormationFlip: React.FC = () => (
  <section id="formation" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(110px,16vh,220px)] md:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="max-w-3xl">
        <FadeUp><Eyebrow>Formation</Eyebrow></FadeUp>
        <FadeUp delay={0.06}>
          <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(34px, 5.6vw, 72px)' }}>
            10 modules.<br /><span className="aurora-text italic">70 % les mains dans le cambouis.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.12}>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream-soft">
            n8n · Make · Claude Code. Retournez une tuile pour voir l'outil, la durée et le prix.
            3 niveaux · financement sur budget formation entreprise.
          </p>
        </FadeUp>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {TILES.map((t, i) => <FlipTile key={t.code} t={t} i={i} />)}
      </div>

      <FadeUp delay={0.1}>
        <p className="mt-8 text-center text-[13px] text-cream-dim">
          3 niveaux · 200 € – 1 250 € / personne · sur-mesure possible en intra-entreprise.
        </p>
      </FadeUp>
    </div>
  </section>
);

export default FormationFlip;
