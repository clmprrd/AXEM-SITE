import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Reveal, CountUp } from '../ui/motion';
import { Constellate } from './Constellate';

// =====================================================================
// LE DUO — ÉTOILES-ANCRES (personal branding riche).
// Clément ⟷ Alexis = deux étoiles bioluminescentes RELIÉES par un fil
// lumineux ; autour gravitent leurs stats (55k cumulés, 2,6 M impressions,
// écoles). Histoire, parcours, visages, chiffres : on les met en avant.
//
// Données extraites de l'Obsidian Axem-IA-Hub (07-Contexte/Clement.md,
// Alexis.md, 01-Axem-IA/Vision-et-positionnement.md).
// =====================================================================

const CLEMENT_IMG =
  'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg';
const ALEXIS_IMG =
  'https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png';

type Founder = {
  img: string;
  name: string;
  first: string;
  school: string;
  role: string;
  desc: string;
  facts: string[];
  followers: number;
  li: string;
  align: 'left' | 'right';
};

const FOUNDERS: Founder[] = [
  {
    img: CLEMENT_IMG,
    name: 'Clément Predo',
    first: 'Clément',
    school: 'ESSEC Business School',
    role: 'Stratégie & Business IA',
    desc: "Le stratège. Je traduis l'IA en rentabilité pour PME, ETI et grands comptes, et je pilote les missions d'audit, de conseil et de coaching dirigeants.",
    facts: ['3 ans de terrain IA', '5+ sessions dirigeants / semaine', 'Audit · conseil · coaching'],
    followers: 40,
    li: 'https://www.linkedin.com/in/clement-predo',
    align: 'left',
  },
  {
    img: ALEXIS_IMG,
    name: 'Alexis Zeitoun',
    first: 'Alexis',
    school: 'Polytechnique · Télécom Paris',
    role: 'Architecture IA, Tech & Déploiement',
    desc: "L'architecte. Je conçois et déploie les systèmes en production — agents, automatisations n8n / Make, intégrations — avec un terrain fort en finance et Private Equity.",
    facts: ['3 ans de terrain IA', 'n8n · Make · MCP · agents', 'Lead missions finance / PE'],
    followers: 15,
    li: 'https://www.linkedin.com/in/alexis-zeitoun',
    align: 'right',
  },
];

// — stats orbitales du duo (gravitent autour du lien) —
const ORBIT: { val: React.ReactNode; label: string }[] = [
  { val: <CountUp to={55} suffix=" k" />, label: 'abonnés cumulés' },
  { val: <CountUp to={2.6} decimals={1} suffix=" M" />, label: 'impressions / mois' },
  { val: <CountUp to={5} suffix="+" />, label: 'sessions dirigeants / sem.' },
];

const StarCard: React.FC<{ f: Founder; conv: any }> = ({ f, conv }) => (
  <motion.div style={{ x: conv }} className="relative">
    {/* halo d'étoile-ancre derrière la carte (lueur teal, par ton, pas d'ombre) */}
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-6 -z-[1] rounded-[28px] opacity-70 blur-2xl"
      style={{
        background:
          f.align === 'left'
            ? 'radial-gradient(60% 60% at 30% 30%, rgba(103,232,223,0.14), transparent 70%)'
            : 'radial-gradient(60% 60% at 70% 30%, rgba(253,233,255,0.10), transparent 70%)',
      }}
    />
    <div className="group glass relative overflow-hidden rounded-[16px]">
      <div className="relative overflow-hidden">
        <img
          src={f.img}
          alt={f.name}
          loading="lazy"
          className="aspect-[5/4] w-full object-cover grayscale transition-[filter,transform] duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 42%, rgba(1,29,28,0.92) 100%)' }}
        />
        {/* badge étoile-ancre */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cyan/30 bg-abyss/55 px-3 py-1 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(103,232,223,0.9)]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-highlight">
            Étoile-ancre · {f.first}
          </span>
        </div>
        <a
          href={f.li}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[6px] bg-gradient-to-br from-green-deep to-mint text-[#00201e] transition-transform [transition-timing-function:var(--ease-out)] hover:scale-110"
          aria-label={`LinkedIn ${f.name}`}>
          <span className="text-[15px] font-semibold">in</span>
        </a>
        {/* followers, en surimpression bas */}
        <div className="absolute bottom-4 left-5">
          <div className="font-serif-display text-[34px] leading-none text-highlight">
            <CountUp to={f.followers} suffix=" k" />
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-cream-dim">
            abonnés LinkedIn
          </div>
        </div>
      </div>
      <div className="p-7 md:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cyan">{f.school}</p>
        <h3 className="font-serif-display mt-1.5 text-[30px] leading-none text-highlight">{f.name}</h3>
        <p className="mt-1.5 text-[12.5px] font-medium uppercase tracking-[0.08em] text-cream-soft">
          {f.role}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-cream-soft">{f.desc}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {f.facts.map((fa) => (
            <li
              key={fa}
              className="rounded-[6px] border border-cyan/18 bg-reef/30 px-2.5 py-1 text-[11px] font-medium text-cream-soft">
              {fa}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);

export const DuoConstellation: React.FC = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  // convergence des 2 étoiles-ancres vers le centre (le fil se tend entre elles)
  // hooks toujours appelés (Rules of Hooks) ; on neutralise via `reduce` au rendu.
  const leftRaw = useTransform(scrollYProgress, [0, 1], ['-6%', '0%']);
  const rightRaw = useTransform(scrollYProgress, [0, 1], ['6%', '0%']);
  const linkRaw = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const linkLen = reduce ? 1 : linkRaw;
  const convL = reduce ? '0%' : leftRaw;
  const convR = reduce ? '0%' : rightRaw;

  return (
    <section id="duo" className="section-clip relative px-5 py-[clamp(120px,18vh,240px)] md:px-8">
      {/* halo atmosphérique radial lavande très basse opacité */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[28%] -z-[1] h-[60vh] w-[80vw] max-w-4xl -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(253,233,255,0.06), transparent 65%)' }}
      />

      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal>
            <div className="eyebrow mb-5 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(103,232,223,0.9)]" />
              Le duo
            </div>
          </Reveal>
          <Reveal delay={0.06} perspective>
            <h2
              className="font-serif-display leading-[0.98] text-highlight"
              style={{ fontSize: 'clamp(40px, 7vw, 92px)' }}>
              Deux étoiles.
              <br />
              <span className="aurora-text">Une seule constellation.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-cream-soft">
              On enseigne ce qu'on déploie. Clément (ESSEC) tient la stratégie, Alexis
              (Polytechnique · Télécom Paris) tient la tech — la même équipe, pas de théorie
              hors-sol. 55 000 personnes nous suivent et 2,6 M la croisent chaque mois.
            </p>
          </Reveal>
        </div>

        {/* DEUX ÉTOILES-ANCRES RELIÉES — fil lumineux qui se tend au scroll */}
        <div ref={ref} className="relative mt-16 grid gap-6 md:grid-cols-2 md:gap-10">
          {/* fil entre les deux étoiles (desktop only) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[2px] w-[18%] -translate-x-1/2 -translate-y-1/2 md:block"
            viewBox="0 0 100 2"
            preserveAspectRatio="none">
            <defs>
              <linearGradient id="duoGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#67e8df" />
                <stop offset="0.5" stopColor="#cbfffc" />
                <stop offset="1" stopColor="#fde9ff" />
              </linearGradient>
            </defs>
            <line x1="0" y1="1" x2="100" y2="1" stroke="rgba(103,232,223,0.12)" strokeWidth="2" />
            <motion.line
              x1="0" y1="1" x2="100" y2="1"
              className="star-link"
              style={{ pathLength: linkLen }}
            />
          </svg>

          {FOUNDERS.map((f, i) => (
            <StarCard key={f.name} f={f} conv={i === 0 ? convL : convR} />
          ))}
        </div>

        {/* STATS ORBITALES du duo — se matérialisent en constellation */}
        <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-6">
          {ORBIT.map((o, i) => (
            <Constellate key={i} dots={7} spread={130} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center">
                <span
                  className="font-serif-display leading-none text-highlight"
                  style={{ fontSize: 'clamp(46px, 7vw, 78px)' }}>
                  {o.val}
                </span>
                <span className="mt-2 text-[12px] font-medium uppercase tracking-[0.16em] text-cream-dim">
                  {o.label}
                </span>
              </div>
            </Constellate>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 max-w-xl text-center text-[13px] leading-relaxed text-cream-dim">
            100 % remote, micro-entrepreneurs tous les deux — un seul interlocuteur du diagnostic
            au déploiement.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
