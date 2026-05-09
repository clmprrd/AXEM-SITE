import React from 'react';
import { Search, Compass, Hammer, BookOpen, Target, Sparkles, RefreshCcw } from 'lucide-react';
import EditableText from './ui/EditableText';
import Reveal from './ui/Reveal';
import MagicBento from './MagicBento';

const Expertise: React.FC = () => {
  const steps = [
    {
      id: 'audit',
      icon: Search,
      title: "Audit",
      subtitle: "On regarde",
      desc: "Analyse de vos process actuels, cartographie des flux et points de friction. Identification des opportunités IA prioritaires.",
      tags: ["Audit Data", "Roadmap", "ROI"]
    },
    {
      id: 'conseil',
      icon: Compass,
      title: "Conseil",
      subtitle: "On décide",
      desc: "Choix des outils, architecture des solutions, sélection fournisseurs et pilotage du déploiement.",
      tags: ["Architecture", "Stratégie", "Cadrage"]
    },
    {
      id: 'deploiement',
      icon: Hammer,
      title: "Déploiement",
      subtitle: "On construit",
      desc: "Construction, test et mise en production d'automatisations. N8N, Make, Claude Code. Clé en main.",
      tags: ["N8N", "Make", "Automatisation"]
    },
    {
      id: 'formation',
      icon: BookOpen,
      title: "Formation",
      subtitle: "On forme",
      desc: "12 modules, 3 niveaux, 70% pratique. Pour acculturer vos équipes et les rendre opérationnelles dès J+1.",
      tags: ["Pratique", "Acculturation", "Workshops"]
    },
    {
      id: 'coaching',
      icon: Target,
      title: "Coaching",
      subtitle: "On ancre",
      desc: "Accompagnement individuel. Ancrer les compétences dans la durée pour managers et dirigeants.",
      tags: ["Suivi", "Personnalisé", "Managers"]
    },
    {
      id: 'production',
      icon: Sparkles,
      title: "Production",
      subtitle: "On livre",
      desc: "Livrables créés avec l'IA. Vidéos avatars, clonage vocal, sites no-code, assets visuels produits 10x plus vite.",
      tags: ["Assets", "Avatars", "No-code"]
    },
    {
      id: 'suivi',
      icon: RefreshCcw,
      title: "Suivi",
      subtitle: "On reste",
      desc: "Maintenance, évolutions continues et nouvelles automatisations. On garantit la valeur dans la durée.",
      tags: ["Maintenance", "Long Terme", "Évolutif"]
    }
  ];

  return (
    <section 
      id="expertise" 
      className="py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FA9A]/5 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
           <div className="space-y-4">
              <Reveal>
                <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FA9A] animate-pulse"></span>
                    <EditableText value="Le Parcours" storageKey="exp_badge_v2" />
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight">
                    <EditableText value="De l'audit au suivi, un seul parcours." storageKey="exp_title_v2" />
                </h2>
              </Reveal>
           </div>
           <Reveal delay={0.2} className="md:text-right max-w-sm">
              <p className="text-neutral-500 text-base leading-relaxed">
                <EditableText isTextarea value="7 étapes. Vous entrez où vous voulez, vous pouvez tout enchaîner ou piocher à la carte." storageKey="exp_subtitle_v2" />
              </p>
           </Reveal>
        </div>

        {/* Magic Bento Grid - Performance Optimized */}
        <MagicBento 
            cards={steps}
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false} 
            enableMagnetism={false} 
            clickEffect={true}
            spotlightRadius={600}
            particleCount={12}
            glowColor="0, 250, 154"
            disableAnimations={false}
        />
        
        <div className="mt-16 flex justify-center">
            <Reveal delay={0.4}>
                <div className="inline-flex items-center gap-4 px-6 py-4 bg-[#0a0a0a] border border-white/10 rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00FA9A] shadow-[0_0_12px_#00FA9A]"></span>
                    <span className="text-white text-sm md:text-base">Entrée possible à chaque étape. À la carte, ou en parcours complet.</span>
                </div>
            </Reveal>
        </div>

      </div>
    </section>
  );
};

export default Expertise;
