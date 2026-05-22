import React from 'react';
import EditableText from './ui/EditableText';

// Direction B — Stripe Cinematic Editorial
// Difference as scroll-revealed "chapters" with massive Playfair italic numbers
const Difference: React.FC = () => {
  const chapters = [
    { n: 'I', t: 'Partenaire sur la durée', d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff, on reste engagés." },
    { n: 'II', t: '70 % pratique', d: 'Opérationnel dès J+1. Chaque formation produit un livrable réel utilisable.' },
    { n: 'III', t: 'Tarifs PME / ETI', d: 'Sans les marges des grands cabinets. Grille publique et transparente.' },
    { n: 'IV', t: 'Toujours à jour', d: 'Outils et méthodes 2026. Le champ bouge vite, nos contenus aussi.' },
    { n: 'V', t: 'Un seul interlocuteur', d: 'Du diagnostic au déploiement. Pas de relais qui se perd entre équipes.' },
  ];

  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#060606] py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-0 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full opacity-30 blur-[180px]"
          style={{ background: 'radial-gradient(closest-side, #F472B6, transparent)' }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-24 text-center">
          <div className="mb-8 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white/60">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <EditableText value="La différence" storageKey="diff_badge" />
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <h2 className="text-4xl leading-[1.05] tracking-[-0.02em] text-white md:text-6xl lg:text-7xl">
            Cinq chapitres,<br />
            <span className="font-playfair italic bg-gradient-to-r from-[#FFB59E] via-[#F472B6] to-[#A78BFA] bg-clip-text text-transparent">
              une promesse tenue.
            </span>
          </h2>
        </div>

        <div className="space-y-1">
          {chapters.map((c, i) => (
            <article
              key={c.n}
              className="group grid grid-cols-12 items-center gap-6 border-t border-white/[0.06] py-12 transition-all duration-500 hover:bg-white/[0.015] md:py-16"
            >
              <div className="col-span-12 md:col-span-3">
                <div className="font-playfair text-7xl italic leading-none text-white/15 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-[#FFB59E] group-hover:via-[#F472B6] group-hover:to-[#A78BFA] group-hover:bg-clip-text group-hover:text-transparent md:text-9xl">
                  <EditableText value={c.n} storageKey={`diff_n_${c.n}`} />
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Chapitre {i + 1}
                </div>
              </div>
              <div className="col-span-12 md:col-span-5">
                <h3 className="text-3xl font-medium tracking-tight text-white md:text-4xl">
                  <EditableText value={c.t} storageKey={`diff_t_${c.n}`} />
                </h3>
              </div>
              <div className="col-span-12 md:col-span-4 text-base leading-relaxed text-white/65 md:text-lg">
                <EditableText isTextarea value={c.d} storageKey={`diff_d_${c.n}`} />
              </div>
            </article>
          ))}
          <div className="border-t border-white/[0.06]" />
        </div>
      </div>
    </section>
  );
};

export default Difference;
