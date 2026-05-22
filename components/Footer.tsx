
import React from 'react';
import { Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import AxemLogo from './AxemLogo';

interface FooterProps {
  customLogo?: string | null;
}

const Footer: React.FC<FooterProps> = ({ customLogo }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="relative z-20 py-24 overflow-hidden bg-[#050505] border-t border-white/5">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute w-[150%] h-[150%] -top-[40%] -right-[30%] bg-[radial-gradient(circle_farthest-corner_at_center,_var(--tw-gradient-stops))] from-[#00FA9A]/10 via-transparent to-black blur-[120px] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6 flex-1">
            <AxemLogo src={customLogo} className="h-14 w-auto origin-left" />
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
              Propulsez votre croissance grâce à une Intelligence Artificielle simple, rentable et actionnable.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/mister.ia__/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-[#00FA9A] hover:border-[#00FA9A]/50 transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://fr.linkedin.com/in/clément-predo-426133196" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-[#00FA9A] hover:border-[#00FA9A]/50 transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Clean Navigation Grid - No Headers as requested */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-6 md:gap-x-20">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('projects')}
                className="group flex items-center gap-2 text-base font-medium text-neutral-400 hover:text-white transition-all w-fit"
              >
                Portfolio
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-[#00FA9A]" />
              </button>
              <button 
                onClick={() => scrollToSection('realisations')}
                className="group flex items-center gap-2 text-base font-medium text-neutral-400 hover:text-white transition-all w-fit"
              >
                Réalisations
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-[#00FA9A]" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('qui-sommes-nous')}
                className="group flex items-center gap-2 text-base font-medium text-neutral-400 hover:text-white transition-all w-fit"
              >
                Qui sommes-nous
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-[#00FA9A]" />
              </button>
              <button 
                onClick={() => scrollToSection('expertise')}
                className="group flex items-center gap-2 text-base font-medium text-neutral-400 hover:text-white transition-all w-fit"
              >
                Méthodologie
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-[#00FA9A]" />
              </button>
            </div>

            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <a 
                href="https://calendly.com/clem-pred/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-lg font-bold text-[#00FA9A] hover:text-white transition-all w-fit"
              >
                Contact
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-neutral-600">
          <span>© 2025 AXEM IA. Tous droits réservés.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
