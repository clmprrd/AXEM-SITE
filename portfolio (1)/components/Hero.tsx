
import React from 'react';
import EditableText from './ui/EditableText';
import ColorBends from './ColorBends';

const Hero: React.FC = () => {
  const scrollToRealisations = (e: React.MouseEvent) => {
    // Check if target is not the editable span
    if ((e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        const element = document.getElementById('realisations');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <div className="flex flex-col min-h-[100vh] z-10 pt-40 pr-4 pb-32 pl-3 relative items-center justify-center overflow-hidden">
      {/* Background Effect - ColorBends with Vibrant Green Theme & Provided Settings */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute inset-0 opacity-100">
            <ColorBends 
                colors={["#00FA9A", "#00FF7F", "#39FF14"]} // AXEM Green Theme preserved
                rotation={4}
                speed={0.55}
                scale={1.1} // Updated from snippet
                frequency={1} // Updated from snippet
                warpStrength={1} // Updated from snippet
                mouseInfluence={1.7}
                parallax={1.05}
                noise={0.1}
                transparent
                autoRotate={0}
                color="#00FA9A"
            />
        </div>
        {/* Lighter gradient to let the green shine through */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505] pointer-events-none"></div>
      </div>

      <div className="animate-reveal [animation-delay:100ms] text-center mb-10 space-y-2 opacity-0 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl lg:text-[90px] leading-[1.1] tracking-tight text-white flex flex-wrap justify-center gap-x-4">
          <span className="font-playfair italic font-normal text-neutral-300">
             <EditableText value="Rendre" storageKey="hero_title_1" />
          </span>
          <span className="font-medium tracking-tighter">
             <EditableText value="l'IA simple," storageKey="hero_title_2" />
          </span>
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-[90px] leading-[1.1] tracking-tight font-medium text-white">
             <EditableText value="rentable et actionnable" storageKey="hero_title_3" />
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-[90px] leading-[1.1] tracking-tight font-medium text-neutral-500">
             <EditableText value="pour votre croissance." storageKey="hero_title_4" />
        </h1>
      </div>
      
      <div className="max-w-2xl text-center text-neutral-400 text-sm md:text-lg font-light leading-relaxed mb-12 animate-reveal [animation-delay:200ms] opacity-0 w-full px-4">
        <EditableText 
            value="Formation, Conseil, Audit, Production & Automatisation IA." 
            storageKey="hero_subtitle" 
            isTextarea={true}
            className="w-full text-center"
        />
      </div>
      
      <div className="flex flex-col animate-reveal [animation-delay:300ms] sm:flex-row gap-x-5 gap-y-5 items-center opacity-0">
        <a 
          href="#realisations"
          onClick={scrollToRealisations}
          className="px-8 py-3.5 rounded-full bg-neutral-200 text-[#050505] font-playfair italic text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_25px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer"
        >
           <EditableText value="Découvrir nos travaux" storageKey="hero_cta_1" className="bg-transparent hover:bg-transparent border-none hover:border-none hover:shadow-none" />
        </a>
        <a 
          href="https://calendly.com/clem-pred/30min" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-neutral-200 text-sm font-medium hover:border-[#00FA9A]/50 hover:bg-[#00FA9A]/10 hover:text-white hover:shadow-[0_0_20px_-5px_rgba(0,250,154,0.3)] transition-all duration-300 flex items-center justify-center"
        >
           <EditableText value="Prendre rendez-vous" storageKey="hero_cta_2" className="bg-transparent hover:bg-transparent border-none hover:border-none hover:shadow-none" />
        </a>
      </div>
    </div>
  );
};

export default Hero;
