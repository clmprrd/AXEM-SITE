import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Reveal, CountUp } from '../ui/motion';
import { NodeNetwork, NetNode, NetEdge } from './NodeNetwork';

// =====================================================================
// LE DUO = 2 NŒUDS CENTRAUX d'un RÉSEAU VIVANT.
// Personal branding mis en avant : Clément (ESSEC · stratégie/business · 40k)
// et Alexis (Polytechnique/Télécom Paris · tech/déploiement · finance/n8n · 20k)
// au CENTRE. Tout autour, leur réseau d'expertise, leurs missions et leur
// audience = des nœuds qui s'allument et se connectent AU SCROLL.
//
// « On enseigne ce qu'on déploie » · ≈55 000 abonnés · 2,6 M impressions/mois.
//
// PERF : le réseau est un canvas piloté par une MotionValue (aucun re-render
// par frame), pausé hors-vue, figé en reduced-motion. Les 2 cartes-portraits
// sont du DOM statique posé au-dessus des 2 nœuds centraux.
// =====================================================================

const CLEMENT_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG = 'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

const FOUNDERS = [
  {
    img: CLEMENT_IMG, name: 'Clément Predo', school: 'ESSEC Business School',
    role: 'Stratégie & Business IA',
    desc: "Le stratège. Je traduis l'IA en rentabilité — audit, conseil, formation — et pilote les missions de bout en bout.",
    followers: '40 000', li: 'https://www.linkedin.com/in/clement-predo',
  },
  {
    img: ALEXIS_IMG, name: 'Alexis Zeitoun', school: 'Polytechnique · Télécom Paris',
    role: 'Architecture IA & Déploiement',
    desc: "L'architecte. Je conçois et déploie les systèmes — agents, automatisations n8n, intégrations finance & Private Equity en production.",
    followers: '20 000', li: 'https://www.linkedin.com/in/alexis-zeitoun',
  },
];

// Les nœuds périphériques = le réseau d'expertise / missions / audience du duo.
// Position relative (0..1). `at` = seuil d'apparition le long du scroll.
// idx 0 = nœud Clément (gauche-centre), idx 1 = nœud Alexis (droite-centre).
const CL = 0, AL = 1;
const NODES: NetNode[] = [
  { x: 0.36, y: 0.5, at: 0, r: 5, key: 'clement' },   // 0 — nœud central Clément
  { x: 0.64, y: 0.5, at: 0, r: 5, key: 'alexis' },    // 1 — nœud central Alexis
  // satellites Clément (haut/gauche)
  { x: 0.16, y: 0.24, at: 0.18, key: 'audit' },       // 2
  { x: 0.10, y: 0.52, at: 0.30, key: 'conseil' },     // 3
  { x: 0.20, y: 0.80, at: 0.42, key: 'formation' },   // 4
  { x: 0.40, y: 0.16, at: 0.24, key: 'li-cl' },       // 5
  // satellites Alexis (haut/droite)
  { x: 0.84, y: 0.26, at: 0.20, key: 'agents' },      // 6
  { x: 0.90, y: 0.54, at: 0.34, key: 'n8n' },         // 7
  { x: 0.80, y: 0.80, at: 0.46, key: 'finance' },     // 8
  { x: 0.60, y: 0.16, at: 0.26, key: 'li-al' },       // 9
  // nœuds partagés (audience / missions communes) au centre-bas
  { x: 0.50, y: 0.86, at: 0.54, key: 'clients' },     // 10
  { x: 0.50, y: 0.5, at: 0.12, r: 3, key: 'bridge' }, // 11 — le pont entre les deux
];
const EDGES: NetEdge[] = [
  [CL, 11], [AL, 11],         // le pont central relie les deux fondateurs
  [CL, 2], [CL, 3], [CL, 4], [CL, 5],
  [AL, 6], [AL, 7], [AL, 8], [AL, 9],
  [CL, 10], [AL, 10],         // tous deux convergent vers les clients
  [2, 3], [3, 4],             // sous-réseau Clément
  [6, 7], [7, 8],             // sous-réseau Alexis
];

// petites étiquettes posées sur les satellites (HTML, lisibles).
const SAT_LABELS: { idx: number; text: string; align: string }[] = [
  { idx: 2, text: 'Audit', align: 'left' },
  { idx: 3, text: 'Conseil', align: 'left' },
  { idx: 4, text: 'Formation', align: 'left' },
  { idx: 6, text: 'Agents & MCP', align: 'right' },
  { idx: 7, text: 'n8n · Make', align: 'right' },
  { idx: 8, text: 'Finance · PE', align: 'right' },
  { idx: 10, text: 'Cas clients', align: 'center' },
];

const Portrait: React.FC<{ f: typeof FOUNDERS[number]; side: 'left' | 'right' }> = ({ f, side }) => (
  <div className={`group glass relative w-[min(86vw,340px)] overflow-hidden rounded-2xl ${side === 'left' ? 'md:mr-auto' : 'md:ml-auto'}`}>
    {/* portrait DUOTONE teal — traitement « page auteurs éditoriale ». Le duotone
        s'atténue au survol (l'image reprend ses couleurs). Cf. .duotone dans index.css. */}
    <div className="duotone relative overflow-hidden">
      <img src={f.img} alt={f.name} loading="lazy"
        className="aspect-[5/4] w-full object-cover" />
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 42%, rgba(1,29,28,0.92) 100%)' }} />
      <a href={f.li} target="_blank" rel="noopener noreferrer"
        className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-green text-[#eafffe] transition-transform [transition-timing-function:var(--ease-out)] hover:scale-110"
        aria-label={`LinkedIn ${f.name}`}>
        <span className="text-[14px] font-bold">in</span>
      </a>
      {/* badge nœud central : le portrait EST un nœud du réseau */}
      <span aria-hidden className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-cyan/70 bg-green"
        style={{ boxShadow: '0 0 0 4px rgba(63,216,207,0.16), 0 0 18px rgba(63,216,207,0.6)' }} />
    </div>
    <div className="p-6">
      <p className="text-[10.5px] font-satoshi font-bold uppercase tracking-[0.16em] text-cyan">{f.school}</p>
      <h3 className="font-serif-display mt-1 text-[26px] leading-none text-cream">{f.name}</h3>
      <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-cream-soft">{f.role}</p>
      <p className="mt-3.5 text-[14px] leading-relaxed text-cream-soft">{f.desc}</p>
      <div className="mt-4 flex items-center gap-2 border-t border-[rgba(63,216,207,0.14)] pt-3.5">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
        <span className="text-[12px] text-cream-soft"><span className="font-bold text-cream">{f.followers}</span> abonnés LinkedIn</span>
      </div>
    </div>
  </div>
);

export const DuoReseau: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section id="duo" className="section-clip relative bg-ink-2/40 px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      {/* atmosphère radial lavande basse opacité (rationné, signature Auros) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] h-[60%] opacity-[0.5]"
        style={{ background: 'radial-gradient(70% 100% at 50% 100%, rgba(253,233,255,0.05), transparent 70%)' }} />

      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal>
            <div className="eyebrow mb-5 flex items-center gap-2.5 text-[11px] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />Le duo · au centre du réseau
            </div>
          </Reveal>
          <Reveal delay={0.06} perspective>
            <h2 className="font-serif-display leading-[1.0] tracking-[-0.01em] text-cream" style={{ fontSize: 'clamp(36px, 6vw, 76px)' }}>
              Deux fondateurs.<br /><span className="aurora-text italic">Un seul réseau.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              La stratégie et la technique dans la même équipe — et autour de nous, tout un
              réseau d'expertise, de missions et d'audience qui prend vie.
            </p>
          </Reveal>
          {/* baseline éditoriale signature — la promesse du duo, en gros. */}
          <Reveal delay={0.16} perspective>
            <p className="font-serif-display mt-8 text-cream" style={{ fontSize: 'clamp(24px, 3.4vw, 40px)', lineHeight: 1.1 }}>
              « On enseigne <span className="aurora-text italic">ce qu'on déploie.</span> »
            </p>
          </Reveal>
        </div>

        {/* LE RÉSEAU VIVANT — 2 portraits = 2 nœuds centraux, satellites au scroll */}
        <div className="relative mt-16 aspect-[16/11] w-full md:aspect-[16/9]">
          {/* canvas réseau en fond (traits + nœuds satellites) — se trace au scroll
              via selfScroll (progression auto depuis la position viewport). */}
          <NodeNetwork
            nodes={NODES} edges={EDGES} selfScroll
            className="absolute inset-0 h-full w-full"
            reduce={!!reduce}
          />
          {/* étiquettes des satellites, posées en pourcentage */}
          {SAT_LABELS.map(({ idx, text, align }) => {
            const n = NODES[idx];
            return (
              <span key={text}
                className="pointer-events-none absolute -translate-y-1/2 text-[11px] font-satoshi font-bold uppercase tracking-[0.12em] text-cream-soft"
                style={{
                  left: `${n.x * 100}%`, top: `${n.y * 100}%`,
                  transform: `translate(${align === 'left' ? '-110%' : align === 'right' ? '14px' : '-50%'}, ${align === 'center' ? '14px' : '-50%'})`,
                }}>
                {text}
              </span>
            );
          })}

          {/* 2 PORTRAITS = nœuds centraux. Posés sur (0.36,0.5) et (0.64,0.5). */}
          <div className="absolute inset-0 grid grid-cols-1 items-center gap-8 px-2 sm:grid-cols-2 md:gap-0">
            {FOUNDERS.map((f, i) => (
              <motion.div key={f.name}
                initial={reduce ? { opacity: 1 } : { opacity: 0.001, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: 'spring', stiffness: 320, damping: 60, delay: i * 0.12 }}
                className="flex justify-center">
                <Portrait f={f} side={i === 0 ? 'left' : 'right'} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* PORTÉE DU RÉSEAU — gros chiffres éditoriaux (page auteurs). Bandeau
            cadré par une hairline, chiffres XXL en count-up. */}
        <Reveal delay={0.1}>
          <div className="mt-20 border-t border-[rgba(63,216,207,0.16)] pt-12">
            <div className="grid gap-10 sm:grid-cols-3">
              {[
                { v: <CountUp to={2.6} decimals={1} suffix=" M" />, l: 'impressions LinkedIn / mois' },
                { v: <CountUp to={55} suffix=" k" />, l: 'abonnés cumulés' },
                { v: <><CountUp to={5} />+</>, l: 'sessions dirigeants / semaine' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-serif-display leading-[0.88] text-cream" style={{ fontSize: 'clamp(48px, 8.5vw, 88px)' }}>{s.v}</div>
                  <div className="mt-3 text-[12px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default DuoReseau;
