import React from 'react';
import EditableText from './ui/EditableText';
import Reveal from './ui/Reveal';

const Problem: React.FC = () => {
  const problems = [
    {
      id: 'p1',
      number: '01',
      title: 'Formations théoriques',
      desc: "Des contenus académiques, inapplicables au quotidien. Les équipes sortent formées, pas opérationnelles."
    },
    {
      id: 'p2',
      number: '02',
      title: 'Outils sans stratégie',
      desc: "Des licences IA achetées, des comptes ouverts, aucune feuille de route. L'adoption stagne faute d'accompagnement."
    },
    {
      id: 'p3',
      number: '03',
      title: 'Aucun suivi après coup',
      desc: "Le consultant part, les habitudes reviennent. Sans relai, l'investissement s'évapore en quelques semaines."
    }
  ];

  return (
    <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#00FA9A]/5 blur-[120px] rounded-full pointer-events-none -ml-20 -mt-40"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start justify-between">
          
          <div className="lg:w-5/12 sticky top-24">
            <Reveal>
              <span className="inline-block px-3 py-1 mb-6 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase">
                <EditableText value="Le Constat" storageKey="problem_badge" />
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-6 leading-tight">
                <EditableText 
                    isTextarea 
                    value="Pourquoi la plupart des entreprises échouent avec l'IA." 
                    storageKey="problem_title" 
                />
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-neutral-500 text-lg md:text-xl">
                <EditableText 
                    isTextarea 
                    value="Trois pièges, toujours les mêmes, observés sur le terrain depuis 3 ans." 
                    storageKey="problem_subtitle" 
                />
              </p>
            </Reveal>
          </div>

          <div className="lg:w-7/12 flex flex-col gap-6">
            {problems.map((p, index) => (
              <Reveal key={p.id} delay={0.2 + (index * 0.1)} className="w-full">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 hover:border-[#00FA9A]/30 transition-colors duration-500">
                  <span className="font-playfair text-6xl text-[#00FA9A] leading-none">
                    <EditableText value={p.number} storageKey={`problem_num_${p.id}`} />
                  </span>
                  <div>
                    <h3 className="text-2xl font-medium text-white mb-3">
                      <EditableText value={p.title} storageKey={`problem_title_${p.id}`} />
                    </h3>
                    <p className="text-neutral-400 text-lg leading-relaxed">
                      <EditableText isTextarea value={p.desc} storageKey={`problem_desc_${p.id}`} />
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Problem;
