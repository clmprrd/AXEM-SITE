
import React from 'react';
import { Search, GraduationCap, Cpu, Rocket } from 'lucide-react';
import EditableText from './ui/EditableText';
import Reveal from './ui/Reveal';
import MagicBento from './MagicBento';

const Expertise: React.FC = () => {
  const steps = [
    {
      id: 'audit',
      icon: Search,
      title: "Diagnostic",
      subtitle: "Audit & Cartographie",
      desc: "Analyse approfondie de vos processus pour identifier les goulots d'étranglement. Nous scannons votre business pour détecter où l'IA aura le ROI le plus immédiat.",
      tags: ["Audit Data", "Roadmap", "ROI"]
    },
    {
      id: 'strategy',
      icon: Rocket,
      title: "Stratégie",
      subtitle: "Architecture Solution",
      desc: "Construction du plan de bataille. Sélection des modèles (GPT-4, Claude), sécurisation des données et design de l'infrastructure technique idéale.",
      tags: ["Architecture", "Sécurité", "Stack"]
    },
    {
      id: 'training',
      icon: GraduationCap,
      title: "Activation",
      subtitle: "Formation Équipes",
      desc: "L'outil n'est rien sans la main. Nous transformons vos collaborateurs en 'Super-Utilisateurs' capables de prompter et d'interagir avec les modèles efficacement.",
      tags: ["Workshops", "Prompting", "Culture"]
    },
    {
      id: 'scale',
      icon: Cpu,
      title: "Scaling",
      subtitle: "Automatisation",
      desc: "Déploiement d'agents autonomes et de workflows complexes (n8n, Make). Votre entreprise tourne 24/7, sans fatigue, avec une fiabilité industrielle.",
      tags: ["Agents", "n8n/Make", "Scale"]
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
                    <EditableText value="Méthodologie" storageKey="exp_badge" />
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight">
                    <EditableText value="Protocole AXEM" storageKey="exp_title" />
                </h2>
              </Reveal>
           </div>
           <Reveal delay={0.2} className="md:text-right max-w-sm">
              <p className="text-neutral-500 text-base leading-relaxed">
                <EditableText isTextarea value="Une approche structurée pour transformer le chaos en clarté, et l'intention en automatisation." storageKey="exp_subtitle" />
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
        
      </div>
    </section>
  );
};

export default Expertise;
