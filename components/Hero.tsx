import React from 'react';
import EditableText from './ui/EditableText';
import ColorBends from './ColorBends';
import { ArrowRight, Play } from 'lucide-react';

// Direction B — "Stripe Editorial"
// Inspired by Stripe, Cursor, Supabase, Browserbase
// Cinematic aurora background, bold editorial Playfair italics, gradient signature
const Hero: React.FC = () => {
  return (
    <section
      className="relative isolate flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 pt-40 pb-32"
      aria-label="AXEM IA — Hero"
    >
      {/* === Aurora WebGL background === */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-90">
          <ColorBends
            colors={['#FF6B6B', '#F472B6', '#A78BFA']} // Aurora: coral → pink → violet
            rotation={6}
            speed={0.4}
            scale={1.4}
            frequency={0.9}
            warpStrength={1.4}
            mouseInfluence={1.2}
            parallax={1.1}
            noise={0.08}
            transparent
            autoRotate={0.05}
            color="#F472B6"
          />
        </div>
        {/* film vignette top */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#060606] to-transparent" />
        {/* film vignette bottom */}
        <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-[#060606] via-[#060606]/70 to-transparent" />
        {/* center darken to keep text legible */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_center,transparent_0%,rgba(6,6,6,0.5)_85%,#060606_100%)]" />
        {/* film grain subtle */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* === Top eyebrow with shimmer line === */}
      <div className="animate-reveal opacity-0 [animation-delay:60ms]">
        <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white/70">
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <span>Conseil · Formation · Production IA</span>
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>

      {/* === Editorial title === */}
      <h1 className="animate-reveal mt-8 max-w-6xl text-center text-[44px] leading-[0.98] text-white opacity-0 [animation-delay:140ms] sm:text-7xl md:text-[88px] lg:text-[112px]">
        <span className="font-playfair italic font-normal text-white/85">
          <EditableText value="Rendre" storageKey="hero_title_1" />
        </span>{' '}
        <span className="font-medium tracking-[-0.03em]">
          <EditableText value="l'IA" storageKey="hero_title_2" />
        </span>
        <br />
        <span className="bg-gradient-to-r from-[#FFB59E] via-[#F472B6] to-[#A78BFA] bg-clip-text font-playfair italic font-normal text-transparent">
          <EditableText value="enfin actionnable." storageKey="hero_title_3" />
        </span>
      </h1>

      {/* === Subtitle === */}
      <p className="animate-reveal mt-9 max-w-2xl text-center text-base font-light leading-relaxed text-white/70 opacity-0 [animation-delay:200ms] md:text-xl">
        <EditableText
          value="Une agence d'IA qui livre. Audit, agents intelligents, formations sur-mesure. Pour les équipes qui ne veulent plus faire des PoC sans suite."
          storageKey="hero_subtitle"
          isTextarea
          className="w-full text-center"
        />
      </p>

      {/* === CTAs === */}
      <div className="animate-reveal mt-12 flex flex-col items-center gap-4 opacity-0 [animation-delay:280ms] sm:flex-row">
        <a
          href="https://calendly.com/clem-pred/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03]"
        >
          {/* shimmer */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F472B6]/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative z-10">Parlons de votre projet</span>
          <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </a>
        <a
          href="/realisations"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/[0.08]"
        >
          <Play className="h-3.5 w-3.5 fill-white/90" strokeWidth={0} />
          Voir nos réalisations
        </a>
      </div>

      {/* === Stats row (editorial-style) === */}
      <div className="animate-reveal mt-24 grid grid-cols-3 gap-x-12 gap-y-4 opacity-0 [animation-delay:380ms] md:gap-x-20">
        {[
          { value: '30k+', label: 'Abonnés LinkedIn' },
          { value: '5 jours', label: "Délai d'audit" },
          { value: '200+', label: 'Collaborateurs formés' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-playfair text-3xl italic text-white md:text-5xl">
              {stat.value}
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50 md:text-xs">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
