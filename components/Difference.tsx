import React from 'react';
import EditableText from './ui/EditableText';
import { Check } from 'lucide-react';

// Direction A — Linear Engineered Minimal
// Difference as "02 — Why us" section: numbered list, ultra-clean, Geist Mono accents
const Difference: React.FC = () => {
  const cards = [
    { n: '01', t: 'Partenaire sur la durée', d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff." },
    { n: '02', t: '70 % pratique', d: 'Opérationnel dès J+1. Chaque formation produit un livrable utilisable.' },
    { n: '03', t: 'Tarifs PME / ETI', d: 'Sans les marges des grands cabinets. Grille publique et transparente.' },
    { n: '04', t: 'Toujours à jour', d: 'Outils et méthodes 2026. Le champ bouge vite, nos contenus aussi.' },
    { n: '05', t: 'Un seul interlocuteur', d: 'Du diagnostic au déploiement. Pas de relais qui se perd entre équipes.' },
  ];

  return (
    <section className="relative border-t border-white/[0.06] bg-[#050505] py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#00FA9A]">
              <span className="text-white/30">02 —</span>{' '}
              <EditableText value="La différence" storageKey="diff_badge" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-6xl">
              5 raisons concrètes<br />
              <span className="text-white/50">de bosser avec AXEM.</span>
            </h2>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/[0.06]">
          {cards.map((c) => (
            <div
              key={c.n}
              className="group grid grid-cols-12 gap-4 bg-[#0A0A0A] px-8 py-7 transition-colors hover:bg-[#0C0C0C] md:px-10 md:py-8"
            >
              <div className="col-span-2 md:col-span-1">
                <span className="font-mono text-sm font-medium text-[#00FA9A]">
                  <EditableText value={c.n} storageKey={`diff_n_${c.n}`} />
                </span>
              </div>
              <div className="col-span-10 md:col-span-5">
                <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight text-white md:text-2xl">
                  <span className="text-[#00FA9A] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <EditableText value={c.t} storageKey={`diff_t_${c.n}`} />
                </h3>
              </div>
              <div className="col-span-12 mt-2 text-base leading-relaxed text-neutral-400 md:col-span-6 md:mt-0">
                <EditableText isTextarea value={c.d} storageKey={`diff_d_${c.n}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Difference;
