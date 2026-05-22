import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight, Sparkles } from 'lucide-react';

// Direction A — "Linear Sharp"
// Inspired by Linear.app, Vercel, Resend, Mintlify
// Ultra-tight typography, precision grid, single accent color, engineered feel
const Hero: React.FC = () => {
  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 pt-40 pb-32"
      aria-label="AXEM IA — Hero"
    >
      {/* === Background: grid + radial halo === */}
      <div className="absolute inset-0 -z-10">
        {/* fine grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 30%, black 50%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 30%, black 50%, transparent 100%)',
          }}
        />
        {/* accent halo */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[10%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full opacity-30 blur-[140px]"
          style={{ background: 'radial-gradient(closest-side, #00FA9A, transparent)' }}
        />
        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050505]" />
      </div>

      {/* === Eyebrow badge === */}
      <div className="animate-reveal opacity-0 [animation-delay:60ms]">
        <a
          href="#realisations"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm transition-all duration-200 hover:border-[#00FA9A]/40 hover:bg-[#00FA9A]/[0.06] hover:text-white"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#00FA9A] shadow-[0_0_8px_#00FA9A]" />
          <span>Nouveau · Audit IA en 5 jours, livrable garanti</span>
          <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* === Title === */}
      <h1 className="animate-reveal mt-8 max-w-5xl text-center text-[40px] font-medium leading-[1.02] tracking-[-0.04em] text-white opacity-0 [animation-delay:120ms] sm:text-6xl md:text-7xl lg:text-[88px]">
        <EditableText value="L'IA d'entreprise," storageKey="hero_title_2" />
        <br />
        <span className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
          <EditableText value="simple, rentable, actionnable." storageKey="hero_title_3" />
        </span>
      </h1>

      {/* === Subtitle === */}
      <p className="animate-reveal mt-7 max-w-2xl text-center text-base font-light leading-relaxed text-neutral-400 opacity-0 [animation-delay:180ms] md:text-lg">
        <EditableText
          value="Formation, conseil, audit et déploiement d'agents IA pour PME et grands groupes. Livrables mesurables, exécution en jours, pas en mois."
          storageKey="hero_subtitle"
          isTextarea
          className="w-full text-center"
        />
      </p>

      {/* === CTAs === */}
      <div className="animate-reveal mt-10 flex flex-col items-center gap-3 opacity-0 [animation-delay:240ms] sm:flex-row sm:gap-3">
        <a
          href="https://calendly.com/clem-pred/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-[#00FA9A] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(0,250,154,0.4),0_0_30px_-8px_rgba(0,250,154,0.6)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(0,250,154,0.6),0_0_40px_-4px_rgba(0,250,154,0.7)]"
        >
          Réserver un audit
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </a>
        <a
          href="/realisations"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
        >
          Voir nos réalisations
          <ArrowUpRight className="h-4 w-4 opacity-60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </a>
      </div>

      {/* === Social proof row === */}
      <div className="animate-reveal mt-20 flex flex-col items-center gap-5 opacity-0 [animation-delay:340ms]">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
          Ils nous font confiance
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4 text-[15px] font-medium text-neutral-400">
          <span className="opacity-70 transition-opacity hover:opacity-100">SNCF</span>
          <span className="opacity-70 transition-opacity hover:opacity-100">Capgemini</span>
          <span className="opacity-70 transition-opacity hover:opacity-100">EY</span>
          <span className="opacity-70 transition-opacity hover:opacity-100">BNP Paribas</span>
          <span className="opacity-70 transition-opacity hover:opacity-100">Orange</span>
          <span className="opacity-70 transition-opacity hover:opacity-100">Société Générale</span>
        </div>
      </div>

      {/* === Subtle scroll cue === */}
      <button
        type="button"
        onClick={scrollToNext}
        aria-label="Faire défiler vers la suite"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-500 transition-colors hover:text-white"
      >
        <Sparkles className="h-4 w-4 animate-pulse" />
      </button>
    </section>
  );
};

export default Hero;
