import React from 'react';
import EditableText from './ui/EditableText';
import Reveal from './ui/Reveal';

const Difference: React.FC = () => {
  const cards = [
    { 
      n: '01', 
      t: 'Partenaire sur la durée', 
      d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff, on reste engagés." 
    },
    { 
      n: '02', 
      t: '70 % pratique minimum', 
      d: "Opérationnel dès J+1. Chaque formation produit un livrable réel utilisable." 
    },
    { 
      n: '03', 
      t: 'Prix accessibles PME / ETI', 
      d: "Sans les tarifs des grands cabinets. Transparence totale sur la grille." 
    },
    { 
      n: '04', 
      t: 'Toujours à jour', 
      d: "Outils et méthodes 2025 / 2026. Le champ bouge vite, nos contenus aussi." 
    },
    { 
      n: '05', 
      t: 'Un seul interlocuteur', 
      d: "Du diagnostic au déploiement. Pas de relais qui se perd entre équipes." 
    },
  ];

  return (
    <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-16">
          <Reveal>
            <span className="inline-block px-3 py-1 mb-6 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase">
              <EditableText value="La différence" storageKey="diff_badge" />
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
              Pourquoi <span className="font-playfair italic">AXEM IA</span>.
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cards.map((c, i) => {
            const isFirst = i === 0;
            return (
              <Reveal key={c.n} delay={0.1 + (i * 0.1)} className="h-full">
                <div 
                    className={`h-full bg-[#0a0a0a] border rounded-2xl p-8 flex flex-col gap-6 transition-transform hover:-translate-y-1 ${
                        isFirst ? 'border-[#00FA9A] shadow-[0_0_30px_rgba(0,250,154,0.1)]' : 'border-white/10'
                    }`}
                >
                  <div className={`font-playfair text-6xl leading-none ${isFirst ? 'text-[#00FA9A]' : 'text-white/20'}`}>
                      <EditableText value={c.n} storageKey={`diff_n_${c.n}`} />
                  </div>
                  <div className={`w-10 h-[1px] ${isFirst ? 'bg-[#00FA9A]' : 'bg-white/10'}`} />
                  <h3 className="text-2xl font-medium text-white leading-tight">
                      <EditableText value={c.t} storageKey={`diff_t_${c.n}`} />
                  </h3>
                  <p className="text-neutral-400 text-base leading-relaxed mt-auto">
                      <EditableText isTextarea value={c.d} storageKey={`diff_d_${c.n}`} />
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Difference;
