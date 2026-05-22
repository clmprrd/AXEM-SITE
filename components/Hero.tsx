import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight, Sparkles, Workflow, BookOpen } from 'lucide-react';

// Direction C — "Attio Warm Light"
// Inspired by Attio, Cal.com, Notion
// Light surface, warm pastels (peach + violet), glassmorphism, product-feel
const Hero: React.FC = () => {
  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 pt-40 pb-40"
      aria-label="AXEM IA — Hero"
      style={{ background: 'linear-gradient(180deg, #FAFAF7 0%, #F5F1EC 100%)' }}
    >
      {/* === Warm gradient blobs === */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute -left-32 top-10 h-[40vw] w-[40vw] rounded-full opacity-60 blur-[120px]"
          style={{ background: 'radial-gradient(closest-side, #FFB59E, transparent)' }}
        />
        <div
          className="absolute -right-32 top-32 h-[36vw] w-[36vw] rounded-full opacity-50 blur-[110px]"
          style={{ background: 'radial-gradient(closest-side, #C4B5FD, transparent)' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[24vw] w-[24vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[90px]"
          style={{ background: 'radial-gradient(closest-side, #FDE68A, transparent)' }}
        />
        {/* dotted grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(15,23,42,0.07) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage:
              'radial-gradient(ellipse 70% 50% at 50% 40%, black 30%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 50% at 50% 40%, black 30%, transparent 100%)',
          }}
        />
      </div>

      {/* === Eyebrow chip === */}
      <div className="animate-reveal opacity-0 [animation-delay:60ms]">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/8 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" strokeWidth={2.5} />
          <span>Backed by ESSEC · 30k+ on LinkedIn</span>
        </div>
      </div>

      {/* === Title === */}
      <h1 className="animate-reveal mt-8 max-w-5xl text-center text-[44px] font-medium leading-[1.02] tracking-[-0.035em] text-slate-900 opacity-0 [animation-delay:120ms] sm:text-7xl md:text-[88px]">
        <EditableText value="L'IA pour" storageKey="hero_title_1" />{' '}
        <span className="relative inline-block">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(120deg, #F97362 0%, #A78BFA 100%)' }}
          >
            <EditableText value="équipes ambitieuses." storageKey="hero_title_2" />
          </span>
        </span>
        <br />
        <span className="font-playfair italic font-normal text-slate-500">
          <EditableText value="Sans le bullshit." storageKey="hero_title_3" />
        </span>
      </h1>

      {/* === Subtitle === */}
      <p className="animate-reveal mt-7 max-w-2xl text-center text-base font-normal leading-relaxed text-slate-600 opacity-0 [animation-delay:180ms] md:text-xl">
        <EditableText
          value="Audit IA, agents intelligents, formations sur-mesure. On livre des outils que vos équipes utilisent vraiment, en jours pas en mois."
          storageKey="hero_subtitle"
          isTextarea
          className="w-full text-center"
        />
      </p>

      {/* === CTAs === */}
      <div className="animate-reveal mt-10 flex flex-col items-center gap-3 opacity-0 [animation-delay:240ms] sm:flex-row">
        <a
          href="https://calendly.com/clem-pred/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_2px_4px_rgba(15,23,42,0.15),0_12px_32px_-8px_rgba(15,23,42,0.4)] transition-all duration-200 hover:bg-slate-800 hover:scale-[1.02]"
        >
          Réserver un audit
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </a>
        <a
          href="/realisations"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/60 px-6 py-3.5 text-sm font-medium text-slate-800 backdrop-blur-md transition-all duration-200 hover:border-slate-900/20 hover:bg-white/80"
        >
          Voir nos réalisations
          <ArrowUpRight className="h-4 w-4 opacity-50 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </a>
      </div>

      {/* === Feature pills (glassmorphism row) === */}
      <div className="animate-reveal mt-20 flex flex-wrap items-center justify-center gap-3 opacity-0 [animation-delay:340ms]">
        {[
          { icon: BookOpen, label: 'Formations IA', color: 'text-orange-500' },
          { icon: Workflow, label: 'Agents & Automatisations', color: 'text-violet-500' },
          { icon: Sparkles, label: 'Audit stratégique', color: 'text-amber-500' },
        ].map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-900/8 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-12px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:bg-white/90"
          >
            <Icon className={`h-4 w-4 ${color}`} strokeWidth={2.2} />
            {label}
          </div>
        ))}
      </div>

      {/* === Transition fade to dark (rest of the site stays dark) === */}
      <div className="absolute inset-x-0 -bottom-px h-32 bg-gradient-to-b from-transparent via-[#050505]/70 to-[#050505]" />
    </section>
  );
};

export default Hero;
