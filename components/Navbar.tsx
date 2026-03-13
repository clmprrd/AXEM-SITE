
import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import AxemLogo from './AxemLogo';

interface NavbarProps {
  customLogo?: string | null;
  onUpdateLogo?: (newLogo: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ customLogo }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <nav 
        className={`
          fixed top-0 left-0 right-0 z-50 
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          border-b
          ${scrolled 
            ? 'py-3 bg-[#050505]/80 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' 
            : 'py-6 bg-transparent border-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* 1. LOGO (Larger) */}
          <div className="flex-shrink-0 relative z-10">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2"
            >
               <AxemLogo src={customLogo} className={`transition-all duration-500 ${scrolled ? 'h-12' : 'h-14 md:h-16'} w-auto`} />
            </button>
          </div>

          {/* RIGHT SIDE CONTAINER: Links + CTA */}
          <div className="flex items-center gap-6">
            
            {/* 2. LINKS (Desktop) - Moved here */}
            <div className="hidden md:flex items-center gap-1">
                <button 
                    onClick={() => scrollToSection('qui-sommes-nous')}
                    className={`
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${scrolled ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-300 hover:text-white hover:bg-white/5'}
                    `}
                >
                    Qui sommes-nous ?
                </button>
                <button 
                    onClick={() => scrollToSection('realisations')}
                    className={`
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${scrolled ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-300 hover:text-white hover:bg-white/5'}
                    `}
                >
                    Nos réalisations
                </button>
                <button 
                    onClick={() => scrollToSection('catalogue')}
                    className={`
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${scrolled ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-300 hover:text-white hover:bg-white/5'}
                    `}
                >
                    Catalogue de formation
                </button>
            </div>

            {/* 3. CTA BUTTON */}
            <div className="flex-shrink-0">
                <a 
                    href="https://calendly.com/clem-pred/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                        relative group overflow-hidden rounded-full flex items-center gap-2 font-bold tracking-tight transition-all duration-300
                        ${scrolled 
                            ? 'bg-[#00FA9A] text-black px-5 py-2.5 text-sm shadow-[0_0_20px_rgba(0,250,154,0.3)] hover:shadow-[0_0_30px_rgba(0,250,154,0.6)] hover:scale-105' 
                            : 'bg-[#00FA9A] text-black px-6 py-3 text-base shadow-[0_0_0px_rgba(0,250,154,0)] hover:shadow-[0_0_25px_rgba(0,250,154,0.5)] hover:scale-105'
                        }
                    `}
                >
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10"></div>
                    
                    <span className="relative z-20">Nous contacter</span>
                    <ArrowUpRight className="relative z-20 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
                </a>
            </div>

          </div>

        </div>
      </nav>

      {/* Mobile Floating Action Button (Only visible on mobile) */}
      <div className={`md:hidden fixed z-50 transition-all duration-500 ${scrolled ? 'bottom-6 right-6 opacity-100 translate-y-0' : 'bottom-6 right-6 opacity-0 translate-y-10 pointer-events-none'}`}>
         <a 
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            className="flex items-center justify-center w-14 h-14 bg-[#00FA9A] text-black rounded-full shadow-[0_0_20px_rgba(0,250,154,0.4)]"
         >
            <ArrowUpRight className="w-6 h-6" strokeWidth={2.5} />
         </a>
      </div>
    </>
  );
};

export default Navbar;
