import React from 'react';
import { useReducedMotion } from 'framer-motion';
import Grainient from '../components/Grainient';
import { PlaySlider } from './primitives';
import { scrollToId } from './store';

// =====================================================================
// §12 — FOOTER EASTER EGG. « AXEM IA — de A à Z. »
// Garde le footer-reveal rideau (.footer-fixed). Petit curseur easter-egg :
// poussé à fond → clin d'œil console + micro-message à l'écran.
// =====================================================================

const CALENDLY = 'https://calendly.com/clem-pred/30min';
const CASES_URL = 'https://rigorous-ketch-1a4.notion.site/Cas-clients-anonymis-s-axem-IA-3255b500d85980858518f49e36968c32';
const AZUR = { color1: '#5B8CFF', color2: '#1E40AF', color3: '#05080F' } as const;

const NAV_LINKS: [string, string][] = [
  ['Calculateur', 'calculateur'], ['Le parcours', 'parcours'],
  ['Cas clients', 'cas'], ['Le duo', 'duo'],
];

const FooterEasterEgg: React.FC = () => {
  const reduce = useReducedMotion();
  const [egg, setEgg] = React.useState(0);
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (egg >= 100 && !fired.current) {
      fired.current = true;
      // clin d'œil console
      // eslint-disable-next-line no-console
      console.log('%c AXEM IA — de A à Z. ', 'background:#5B8CFF;color:#060912;font-weight:800;padding:6px 12px;border-radius:8px;font-size:14px;');
      // eslint-disable-next-line no-console
      console.log('%cVous êtes du genre à pousser les curseurs à fond. On adore. → clem.pred@gmail.com', 'color:#38BDF8;font-size:12px;');
    }
    if (egg < 100) fired.current = false;
  }, [egg]);

  return (
    <footer className="footer-fixed isolate border-t border-green/12 px-5 py-14 md:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Grainient className="h-full w-full"
          color1={AZUR.color1} color2={AZUR.color2} color3={AZUR.color3}
          timeSpeed={reduce ? 0 : 0.1} grainAmount={0.07} contrast={1.25}
          saturation={0.95} zoom={1.05} warpStrength={1.0} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 120% at 50% 35%, rgba(7,11,22,0.35) 0%, rgba(7,11,22,0.55) 55%, rgba(7,11,22,0.82) 100%)' }} />
      </div>

      <div className="relative z-10 w-full">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <button onClick={() => scrollToId('top')} className="font-serif-display text-4xl leading-none tracking-tight text-cream md:text-5xl">
              AXEM<span className="aurora-text">.</span>
            </button>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-soft">
              AXEM IA — de A à Z. Audit, conseil, déploiement, formation, production &amp; suivi IA.
            </p>

            {/* curseur easter-egg */}
            <div className="mt-7 max-w-[260px]">
              <PlaySlider value={egg} min={0} max={100} step={1}
                onChange={setEgg} label="Encore un curseur ?" format={(v) => `${v} %`} accent="#5EEAD4" />
              <p className="mt-2 h-4 text-[11.5px] text-cyan transition-opacity duration-300"
                style={{ opacity: egg >= 100 ? 1 : 0 }}>
                On savait que vous iriez au bout. (Regardez la console 👀)
              </p>
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim">Le terrain de jeu</div>
            <ul className="space-y-2 text-sm text-cream-soft">
              {NAV_LINKS.map(([l, h]) => (
                <li key={l}>
                  <button onClick={() => scrollToId(h)} className="link-limitless hover:text-cream">{l}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-satoshi font-bold uppercase tracking-[0.16em] text-cream-dim">Contact</div>
            <ul className="space-y-2 text-sm text-cream-soft">
              <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="link-limitless hover:text-cream">Réserver un appel</a></li>
              <li><a href="mailto:contact@axem-ia.fr" className="link-limitless hover:text-cream">contact@axem-ia.fr</a></li>
              <li><a href={CASES_URL} target="_blank" rel="noopener noreferrer" className="link-limitless hover:text-cream">Cas clients</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl border-t border-green/8 pt-6 text-center text-xs text-cream-dim">
          © 2026 AXEM IA — Paris, France.
        </div>
      </div>
    </footer>
  );
};

export default FooterEasterEgg;
