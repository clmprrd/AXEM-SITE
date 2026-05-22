import React, { useEffect } from 'react';

interface FooterProps {
  customLogo?: string | null;
}

// BRUTALIST SWISS — system footer
const Footer: React.FC<FooterProps> = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="footer"
      className="relative bg-black border-t border-[#F0EDE5]/[0.08] overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", color: '#F0EDE5' }}
    >
      {/* Top pink bandeau */}
      <div className="relative bg-[#FF2D5F]">
        <div className="mx-auto max-w-[1400px] px-6 py-3 flex items-center justify-between">
          <span
            className="text-[11px] uppercase tracking-[0.2em] text-[#F0EDE5]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            // END_OF_TRANSMISSION
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.2em] text-[#F0EDE5]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            STATUS: OPERATIONAL
          </span>
        </div>
      </div>

      {/* Grid bg subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, #F0EDE5 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-20">
        {/* AXEM HUGE caps */}
        <div
          className="leading-[0.88] tracking-[-0.04em] uppercase text-[#F0EDE5] mb-16"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(64px, 16vw, 220px)' }}
        >
          AXEM<span className="text-[#FF2D5F]">.</span>
        </div>

        {/* 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-[#F0EDE5]/[0.08] pt-12">
          {/* COL 1 NAV */}
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] text-[#FF2D5F] mb-5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // NAVIGATE
            </div>
            <ul className="space-y-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <li>
                <button
                  onClick={() => scrollToSection('qui-sommes-nous')}
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ FOUNDERS
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('dualite')}
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ OFFER
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ PRICING
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('realisations')}
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ CASE STUDIES
                </button>
              </li>
            </ul>
          </div>

          {/* COL 2 SERVICES */}
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] text-[#FF2D5F] mb-5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // SERVICES
            </div>
            <ul className="space-y-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <li className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80">
                ▸ FORMATION
              </li>
              <li className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80">
                ▸ AUDIT IA
              </li>
              <li className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80">
                ▸ DEPLOIEMENT
              </li>
              <li className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80">
                ▸ COACHING
              </li>
              <li className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80">
                ▸ PRODUCTION
              </li>
            </ul>
          </div>

          {/* COL 3 CONTACT */}
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] text-[#FF2D5F] mb-5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // CONTACT
            </div>
            <ul className="space-y-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <li>
                <a
                  href="https://axem-ia.fr"
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ AXEM-IA.FR
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@axem-ia.fr"
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors break-all"
                >
                  ▸ CONTACT@AXEM-IA.FR
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/clem-pred/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ CALENDLY
                </a>
              </li>
            </ul>
          </div>

          {/* COL 4 SOCIAL */}
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.2em] text-[#FF2D5F] mb-5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // SOCIAL
            </div>
            <ul className="space-y-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <li>
                <a
                  href="https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ LINKEDIN CLEMENT
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/alexiszeitoun/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ LINKEDIN ALEXIS
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mister.ia__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 hover:text-[#FF2D5F] transition-colors"
                >
                  ▸ INSTAGRAM
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Big CTA square button */}
        <div className="mt-16 pt-12 border-t border-[#F0EDE5]/[0.08]">
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 border-2 border-[#F0EDE5] px-6 py-4 text-[#F0EDE5] hover:bg-[#FF2D5F] hover:border-[#FF2D5F] transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="text-[12px] uppercase tracking-[0.2em]">[ START A PROJECT ]</span>
            <span className="text-[16px] group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#F0EDE5]/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span
            className="text-[10px] uppercase tracking-[0.2em] text-[#FF2D5F]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            © 2026 AXEM IA // PARIS · FR
          </span>
          <div
            className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-[#F0EDE5]/50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <a href="#" className="hover:text-[#F0EDE5] transition-colors">MENTIONS LEGALES</a>
            <a href="#" className="hover:text-[#F0EDE5] transition-colors">CONFIDENTIALITE</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
