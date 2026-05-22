import React from 'react';
import EditableText from './ui/EditableText';
import { Clock, Hammer, Wallet, RefreshCw, User } from 'lucide-react';

// Direction C — Framer Bento Interactive
// Difference as asymmetric bento (1 big + 4 small with icons)
const Difference: React.FC = () => {
  const cards = [
    { n: '01', t: 'Partenaire sur la durée', d: "De l'audit à l'autonomie. On ne disparaît pas après le kickoff, on reste engagés.", icon: Clock, accent: '#A1FF6B' },
    { n: '02', t: '70 % pratique', d: 'Opérationnel dès J+1. Chaque formation produit un livrable réel utilisable.', icon: Hammer, accent: '#5EEAD4' },
    { n: '03', t: 'Tarifs PME / ETI', d: 'Sans les marges des grands cabinets. Transparence totale sur la grille.', icon: Wallet, accent: '#FCD34D' },
    { n: '04', t: 'Toujours à jour', d: 'Outils et méthodes 2026. Le champ bouge vite, nos contenus aussi.', icon: RefreshCw, accent: '#A78BFA' },
    { n: '05', t: 'Un seul interlocuteur', d: 'Du diagnostic au déploiement. Pas de relais qui se perd entre équipes.', icon: User, accent: '#F472B6' },
  ];

  return (
    <section className="relative border-t border-white/[0.06] bg-[#0A0A0A] py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-neutral-300">
            <span className="text-[#FCD34D]">●</span>
            <EditableText value="La différence" storageKey="diff_badge" />
          </div>
          <h2 className="max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-5xl lg:text-6xl">
            Pourquoi <span className="bg-gradient-to-r from-[#A1FF6B] via-[#5EEAD4] to-[#A78BFA] bg-clip-text text-transparent">AXEM IA</span>,
            <br />et pas un autre.
          </h2>
        </div>

        {/* Bento grid 1 big + 4 small */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:grid-rows-2">
          {cards.map((c, i) => {
            const isFirst = i === 0;
            const Icon = c.icon;
            return (
              <div
                key={c.n}
                className={`
                  group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E0E0E] p-7
                  transition-all duration-300 hover:scale-[1.01]
                  ${isFirst ? 'md:col-span-3 md:row-span-2 md:p-9' : 'md:col-span-3 lg:col-span-3'}
                `}
                style={isFirst ? { background: `linear-gradient(135deg, ${c.accent}10, #0E1410 50%, #0A0A0A)` } : {}}
              >
                {/* Decorative number */}
                <div
                  className={`absolute right-6 top-6 font-playfair leading-none ${isFirst ? 'text-7xl' : 'text-5xl'} text-white/[0.06] transition-all duration-300 group-hover:text-white/10`}
                >
                  <EditableText value={c.n} storageKey={`diff_n_${c.n}`} />
                </div>

                <div className="relative flex h-full flex-col">
                  <div
                    className={`mb-5 inline-flex items-center justify-center rounded-xl border ${isFirst ? 'h-12 w-12' : 'h-10 w-10'}`}
                    style={{ borderColor: `${c.accent}30`, background: `${c.accent}12`, color: c.accent }}
                  >
                    <Icon className={`${isFirst ? 'h-5 w-5' : 'h-4 w-4'}`} strokeWidth={2.2} />
                  </div>
                  <h3 className={`font-medium tracking-tight text-white ${isFirst ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                    <EditableText value={c.t} storageKey={`diff_t_${c.n}`} />
                  </h3>
                  <p className={`mt-2 leading-relaxed text-neutral-400 ${isFirst ? 'text-base md:text-lg' : 'text-sm'}`}>
                    <EditableText isTextarea value={c.d} storageKey={`diff_d_${c.n}`} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Difference;
