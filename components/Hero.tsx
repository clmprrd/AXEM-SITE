import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowDown } from 'lucide-react';

// Direction D — Apple Premium Showcase
// Massive single-line manifesto, deep whitespace, refined gradient mockup card
const Hero: React.FC = () => {
  return (
    <section className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-24">
      {/* Cinematic radial light from above */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 h-[80vh] w-[120vw] -translate-x-1/2 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(180,200,255,0.18), transparent 60%)',
        }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* Tiny eyebrow */}
        <div className="mb-12 text-[11px] font-medium uppercase tracking-[0.42em] text-white/40">
          <EditableText value="AXEM IA · 2026" storageKey="hero_title_1" />
        </div>

        {/* MASSIVE single-line title */}
        <h1 className="text-center text-[56px] font-light leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl md:text-8xl lg:text-[128px] xl:text-[160px]">
          <EditableText value="L'IA," storageKey="hero_title_2" />
        </h1>
        <h1 className="mt-2 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-center text-[56px] font-light leading-[0.95] tracking-[-0.04em] text-transparent sm:text-7xl md:text-8xl lg:text-[128px] xl:text-[160px]">
          <EditableText value="livrée." storageKey="hero_title_3" />
        </h1>

        {/* Refined subtitle */}
        <p className="mt-12 max-w-xl text-center text-lg font-light leading-relaxed text-white/60 md:text-xl">
          <EditableText
            value="Une nouvelle façon de mettre l'IA au travail dans votre entreprise. Conçue par AXEM IA."
            storageKey="hero_subtitle"
            isTextarea
            className="w-full text-center"
          />
        </p>

        {/* Apple-style minimal CTAs (text-only with arrows) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          <a
            href="/realisations"
            className="group inline-flex items-baseline gap-2 text-base font-medium text-[#86A6FF] transition-colors hover:text-white"
          >
            <span>Découvrir nos réalisations</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-baseline gap-2 text-base font-medium text-[#86A6FF] transition-colors hover:text-white"
          >
            <span>Réserver un appel</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Premium product card — fake mockup */}
        <div className="relative mt-24 w-full max-w-5xl">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0F1015] via-[#0A0B0F] to-[#050507] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="relative overflow-hidden rounded-[22px] bg-[#06070A]">
              {/* aurora reflection top */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-32"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(120,150,255,0.25), transparent)',
                }}
              />
              <div className="relative grid grid-cols-3 gap-px bg-white/[0.04] p-px">
                {[
                  { label: 'AUDIT', value: '5j' },
                  { label: 'LIVRABLE', value: '100%' },
                  { label: 'ROI', value: '+40%' },
                ].map((c) => (
                  <div key={c.label} className="bg-[#06070A] px-6 py-12 text-center md:py-16">
                    <div className="text-[10px] uppercase tracking-[0.32em] text-white/40">{c.label}</div>
                    <div className="mt-3 text-5xl font-light tracking-[-0.03em] text-white md:text-6xl">
                      {c.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Tiny caption beneath */}
          <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-white/30">
            Conçu sur-mesure · Livré en jours
          </p>
        </div>

        {/* Scroll cue */}
        <div className="mt-16 flex justify-center">
          <ArrowDown className="h-4 w-4 animate-bounce text-white/30" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
