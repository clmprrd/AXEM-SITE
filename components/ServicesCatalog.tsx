import React from 'react';
import EditableText from './ui/EditableText';
import Reveal from './ui/Reveal';
import { Calendar } from 'lucide-react';

const ServicesCatalog: React.FC = () => {
  const servicesOverview = [
    { n:'01', name:'Audit IA', price:'1 500€ - 2 500€', priceLabel:'selon périmètre', d:'Diagnostic, cartographie, roadmap priorisée.' },
    { n:'02', name:'Conseil stratégique', price:'Sur devis', priceLabel:'durée et périmètre', d:'Choix des outils, architecture, pilotage.' },
    { n:'03', name:'Déploiement', price:'À partir de 1 200€', priceLabel:'ou abonnement', d:'N8N, Make, Claude Code. Clé en main ou suivi.' },
    { n:'04', name:'Formation', price:'80€ - 1 100€', priceLabel:'par pers. / session', d:'12 modules, 3 niveaux, 70% pratique.' },
    { n:'05', name:'Coaching individuel', price:'200€', priceLabel:'par session d\'1 h', d:'Référents, managers, dirigeants, sur mesure.' },
    { n:'06', name:'Production IA', price:'Sur devis', priceLabel:'au livrable', d:'Vidéos, visuels, voix, sites no-code.' },
    { n:'07', name:'Suivi', price:'80€/mois', priceLabel:'après mise en place', d:'Maintenance, évolutions, long terme.' },
  ];

  const formations = [
    ['F01','IA Essentielle','1 j','250 €','Découverte'],
    ['F02','Prompt Engineering Pro','½ j','200 €','Découverte'],
    ['F03','Managers & Dirigeants','1 j','400 €','Métier'],
    ['F04','Marketing & Commercial','1 j','350 €','Métier'],
    ['F05','Ressources Humaines','½ j','250 €','Découverte'],
    ['F06','Stratégie Business','1 j','400 €','Métier'],
    ['F07','Réseaux Sociaux','1 j','250 €','Métier'],
    ['F08','Créative & Livrables','2 j','700 €','Expert'],
    ['F09','No-Code & Workflows','2 j','800 €','Expert'],
    ['F10','Agent IA','2 j','1 100 €','Expert'],
    ['F11','Gouvernance & AI Act','½ j','200 €','Découverte'],
    ['F12','Veille IA','2 h','80 € / mois','Découverte'],
  ];

  return (
    <section id="services" className="py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#00FA9A]/5 blur-[150px] rounded-full pointer-events-none -mr-40"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Vue d'ensemble */}
        <div className="mb-24">
          <Reveal>
            <span className="inline-block px-3 py-1 mb-6 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase">
              <EditableText value="Offre & Tarification" storageKey="srv_badge" />
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight mb-12">
              Ce qu'on <span className="font-playfair italic">propose</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col border border-white/10 rounded-2xl overflow-hidden bg-[#0a0a0a]">
              <div className="hidden lg:grid grid-cols-[80px_1.5fr_2fr_1fr_1.5fr] gap-6 p-6 border-b border-white/10 text-xs font-semibold tracking-widest uppercase text-neutral-500">
                <span></span>
                <span>Service</span>
                <span>Ce que ça couvre</span>
                <span>Tarif d'entrée</span>
                <span>Unité</span>
              </div>
              {servicesOverview.map((s, i) => (
                <div key={s.n} className={`flex flex-col lg:grid lg:grid-cols-[80px_1.5fr_2fr_1fr_1.5fr] gap-4 lg:gap-6 p-6 ${i !== servicesOverview.length - 1 ? 'border-b border-white/5' : ''} items-start lg:items-center`}>
                  <span className="font-mono text-sm text-[#00FA9A] tracking-widest hidden lg:block">{s.n}</span>
                  <div className="lg:hidden flex justify-between w-full mb-2">
                    <span className="font-mono text-xs text-[#00FA9A] tracking-widest">{s.n}</span>
                    <span className="text-sm font-semibold text-[#00FA9A] tracking-tight">{s.price}</span>
                  </div>
                  <span className="text-xl md:text-2xl font-medium text-white tracking-tight">{s.name}</span>
                  <span className="text-neutral-400 leading-relaxed text-sm md:text-base">{s.d}</span>
                  <span className="font-medium text-lg text-[#00FA9A] hidden lg:block whitespace-nowrap">{s.price}</span>
                  <span className="text-xs text-neutral-500 font-semibold tracking-widest uppercase">{s.priceLabel}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Détails Formations */}
        <div className="mb-24">
          <Reveal>
            <div className="mb-12">
              <span className="inline-block px-3 py-1 mb-4 text-[10px] tracking-widest text-neutral-400 border border-white/10 rounded-full bg-white/5 uppercase">
                Focus : Formations
              </span>
              <h3 className="text-3xl md:text-5xl font-medium text-white mb-4">
                Le catalogue <span className="font-playfair italic">2025 - 2026</span>.
              </h3>
              <p className="text-neutral-400 text-lg max-w-2xl">
                12 formations, 3 niveaux, 70% pratique. Pour acculturer vos équipes et les rendre opérationnelles dès J+1.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
            {[formations.slice(0, 6), formations.slice(6)].map((col, ci) => (
              <div key={ci} className="flex flex-col">
                <div className="hidden md:grid grid-cols-[60px_1fr_80px_100px] gap-4 pb-4 border-b border-white/10 text-xs font-semibold tracking-widest uppercase text-neutral-500">
                  <span>Code</span><span>Formation</span><span>Durée</span><span className="text-right">Tarif</span>
                </div>
                {col.map(r => (
                  <Reveal key={r[0]} className="w-full">
                    <div className="grid grid-cols-[1fr_auto] md:grid-cols-[60px_1fr_80px_100px] gap-2 md:gap-4 py-5 border-b border-white/5 items-center">
                      <span className="font-mono text-xs text-[#00FA9A] hidden md:block tracking-widest">{r[0]}</span>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                        <span className="text-base md:text-lg text-white font-medium">{r[1]}</span>
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm w-fit ${
                          r[4] === 'Découverte' ? 'bg-[#00FA9A]/10 text-[#00FA9A]' : 
                          r[4] === 'Métier' ? 'bg-white/10 text-white' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {r[4]}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-semibold tracking-widest uppercase hidden md:block">{r[2]}</span>
                      <span className="text-right font-semibold text-[#00FA9A] whitespace-nowrap">{r[3]}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
          
          <Reveal className="mt-12">
            <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                  <h4 className="text-white text-xl font-medium mb-2">Bootcamps immersifs et formations sur mesure</h4>
                  <p className="text-neutral-400 text-sm md:text-base max-w-2xl">
                    Formations construites de A à Z selon vos besoins, vos contraintes et vos cas d'usage. Financement OPCO possible.
                  </p>
               </div>
               <div className="whitespace-nowrap text-[#00FA9A] font-semibold tracking-wide">
                 Sur devis
               </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
};

export default ServicesCatalog;
