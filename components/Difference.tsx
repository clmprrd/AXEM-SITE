import React from 'react';
import EditableText from './ui/EditableText';

// Direction D — Apple Premium Showcase
// Difference as full-bleed scroll-snap "feature drops" with massive numbers
const Difference: React.FC = () => {
  const cards = [
    { n: '01', t: 'Partenaire sur la durée', d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff, on reste engagés." },
    { n: '02', t: '70 % pratique', d: 'Opérationnel dès J+1. Chaque formation produit un livrable réel utilisable.' },
    { n: '03', t: 'Tarifs PME / ETI', d: 'Sans les marges des grands cabinets. Grille publique et transparente.' },
    { n: '04', t: 'Toujours à jour', d: 'Outils et méthodes 2026. Le champ bouge vite, nos contenus aussi.' },
    { n: '05', t: 'Un seul interlocuteur', d: 'Du diagnostic au déploiement. Pas de relais qui se perd entre équipes.' },
  ];

  return (
    <section className="relative bg-[#050505]">
      {/* Header — massive */}
      <div className="border-t border-white/[0.06] py-32 md:py-48">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-[11px] uppercase tracking-[0.42em] text-white/40">
            <EditableText value="La différence" storageKey="diff_badge" />
          </div>
          <h2 className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl md:text-7xl lg:text-[80px]">
            Cinq raisons<br />
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              de choisir AXEM IA.
            </span>
          </h2>
        </div>
      </div>

      {/* Feature drops — alternating side, massive number, ample whitespace */}
      {cards.map((c, i) => {
        const isEven = i % 2 === 0;
        return (
          <div key={c.n} className="border-t border-white/[0.06] py-24 md:py-32">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-16">
              {/* Massive number */}
              <div className={`lg:col-span-5 ${isEven ? '' : 'lg:order-2'}`}>
                <div className="relative">
                  <span className="block text-[120px] font-extralight leading-[0.8] tracking-[-0.05em] text-white/[0.08] sm:text-[180px] md:text-[240px] lg:text-[280px]">
                    <EditableText value={c.n} storageKey={`diff_n_${c.n}`} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 block bg-gradient-to-br from-white/30 to-transparent bg-clip-text text-[120px] font-extralight leading-[0.8] tracking-[-0.05em] text-transparent sm:text-[180px] md:text-[240px] lg:text-[280px]"
                  >
                    {c.n}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className={`lg:col-span-7 ${isEven ? '' : 'lg:order-1 lg:pr-12'}`}>
                <h3 className="text-3xl font-light leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  <EditableText value={c.t} storageKey={`diff_t_${c.n}`} />
                </h3>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/55 md:text-xl">
                  <EditableText isTextarea value={c.d} storageKey={`diff_d_${c.n}`} />
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Difference;
