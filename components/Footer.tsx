import React, { useEffect } from 'react';
import { Linkedin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  customLogo?: string | null;
}

// =====================================================
// CONCEPT A — EDITORIAL PRINT MAGAZINE
// Footer · Colophon éditorial
// =====================================================
const Footer: React.FC<FooterProps> = ({ customLogo: _customLogo }) => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap';
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
      className="relative isolate overflow-hidden"
      style={{
        background: '#F4EFE6',
        color: '#0F1A2E',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* === FILLET VERMILLON ÉPAIS === */}
      <div className="h-2 w-full" style={{ background: '#C8553D' }} />

      <div className="mx-auto w-full max-w-[1320px] px-6 py-20 md:px-8 md:py-28">
        {/* === HEADER colophon === */}
        <div className="mb-14 flex flex-col items-baseline justify-between gap-3 border-b pb-6 md:flex-row" style={{ borderColor: 'rgba(15,26,46,0.2)' }}>
          <div
            className="text-[10px] uppercase tracking-[0.42em]"
            style={{ color: '#C8553D', fontWeight: 600 }}
          >
            Colophon · Édition 2026
          </div>
          <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: '#0F1A2E', opacity: 0.6 }}>
            Issue Premier · Manifeste AXEM
          </div>
        </div>

        {/* === 4 COLUMNS === */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 md:gap-x-12">
          {/* Logo AXEM gros */}
          <div className="col-span-12 md:col-span-4">
            <div
              style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(56px, 7vw, 96px)',
                fontWeight: 300,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: '#0F1A2E',
              }}
            >
              AXEM
              <span style={{ fontStyle: 'italic', color: '#C8553D' }}>.</span>
            </div>
            <p
              className="mt-6 max-w-xs"
              style={{ fontSize: '15px', lineHeight: 1.6, color: '#0F1A2E', opacity: 0.7 }}
            >
              Le partenaire IA des équipes qui veulent passer des slides à la production.
            </p>
          </div>

          {/* Liens */}
          <div className="col-span-6 md:col-span-2">
            <div
              className="mb-5 text-[10px] uppercase tracking-[0.32em]"
              style={{ color: '#C8553D', fontWeight: 600 }}
            >
              Sommaire
            </div>
            <ul className="space-y-3">
              {[
                { id: 'qui-sommes-nous', label: 'Fondateurs' },
                { id: 'dualite', label: 'L\'offre' },
                { id: 'pricing', label: 'Tarification' },
              ].map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollToSection(l.id)}
                    className="group inline-flex items-center gap-2 transition-colors hover:opacity-100"
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontSize: '17px',
                      fontWeight: 400,
                      color: '#0F1A2E',
                      opacity: 0.85,
                    }}
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: '#C8553D' }} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordonnées */}
          <div className="col-span-6 md:col-span-3">
            <div
              className="mb-5 text-[10px] uppercase tracking-[0.32em]"
              style={{ color: '#C8553D', fontWeight: 600 }}
            >
              Coordonnées
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://axem-ia.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', color: '#0F1A2E', opacity: 0.85 }}
                  className="transition-colors hover:underline"
                >
                  axem-ia.fr
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@axem-ia.fr"
                  style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', color: '#0F1A2E', opacity: 0.85 }}
                  className="transition-colors hover:underline"
                >
                  contact@axem-ia.fr
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/clem-pred/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontStyle: 'italic',
                    fontSize: '17px',
                    color: '#C8553D',
                    fontWeight: 500,
                  }}
                  className="inline-flex items-center gap-1.5 transition-transform hover:translate-x-0.5"
                >
                  Calendly →
                </a>
              </li>
              <li
                className="pt-2 text-[12px] uppercase tracking-[0.18em]"
                style={{ color: '#0F1A2E', opacity: 0.55 }}
              >
                Paris · France
              </li>
            </ul>
          </div>

          {/* Réseaux LinkedIn */}
          <div className="col-span-12 md:col-span-3">
            <div
              className="mb-5 text-[10px] uppercase tracking-[0.32em]"
              style={{ color: '#C8553D', fontWeight: 600 }}
            >
              Réseaux
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3"
                  style={{ color: '#0F1A2E' }}
                >
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center border transition-colors group-hover:bg-[#0F1A2E] group-hover:text-[#F4EFE6]"
                    style={{ borderColor: 'rgba(15,26,46,0.3)' }}
                  >
                    <Linkedin className="h-4 w-4" />
                  </span>
                  <span>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', display: 'block', lineHeight: 1.1 }}>
                      Clément Predo
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em]" style={{ opacity: 0.6 }}>
                      +40k abonnés
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/alexiszeitoun/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3"
                  style={{ color: '#0F1A2E' }}
                >
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center border transition-colors group-hover:bg-[#0F1A2E] group-hover:text-[#F4EFE6]"
                    style={{ borderColor: 'rgba(15,26,46,0.3)' }}
                  >
                    <Linkedin className="h-4 w-4" />
                  </span>
                  <span>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', display: 'block', lineHeight: 1.1 }}>
                      Alexis Zeitoun
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em]" style={{ opacity: 0.6 }}>
                      +15k abonnés
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* === BOTTOM colophon === */}
        <div
          className="mt-20 flex flex-col items-center justify-between gap-6 border-t pt-10 md:flex-row"
          style={{ borderColor: 'rgba(15,26,46,0.2)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] uppercase tracking-[0.24em]"
              style={{ borderColor: 'rgba(15,26,46,0.3)', color: '#0F1A2E' }}
            >
              <span className="inline-block h-1.5 w-1.5" style={{ background: '#C8553D' }} />
              Qualiopi · processus certifié
            </div>
            <div
              className="hidden h-5 w-12 items-stretch overflow-hidden border sm:flex"
              style={{ borderColor: 'rgba(15,26,46,0.25)' }}
              aria-hidden
            >
              <span className="flex-1" style={{ background: '#0F1A2E' }} />
              <span className="flex-1" style={{ background: '#F4EFE6' }} />
              <span className="flex-1" style={{ background: '#C8553D' }} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
            <span
              style={{
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontSize: '14px',
                color: '#C8553D',
              }}
            >
              © 2026 AXEM IA — Imprimé en France.
            </span>
            <div className="flex gap-6 text-[10px] uppercase tracking-[0.24em]" style={{ color: '#0F1A2E', opacity: 0.55 }}>
              <a href="#" className="transition-colors hover:opacity-100">Mentions légales</a>
              <a href="#" className="transition-colors hover:opacity-100">Confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
