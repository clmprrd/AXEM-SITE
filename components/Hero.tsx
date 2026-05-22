import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight, Sparkles, Zap, Workflow, GraduationCap, BarChart3 } from 'lucide-react';

// Direction C — Framer Bento Interactive
// Hero as a bento grid: multi-card layout immediately visible
const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-[#0A0A0A] px-6 pt-32 pb-20">
      {/* Subtle background grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black, transparent 95%)',
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Eyebrow */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#A1FF6B] shadow-[0_0_8px_#A1FF6B]" />
            Disponibilité Q2 2026
          </div>
        </div>

        {/* Big title centered */}
        <h1 className="mx-auto max-w-5xl text-center text-[44px] font-medium leading-[1.04] tracking-[-0.035em] text-white sm:text-6xl md:text-7xl lg:text-[88px]">
          <EditableText value="L'IA d'entreprise," storageKey="hero_title_2" />
          <br />
          <span className="bg-gradient-to-r from-[#A1FF6B] via-[#5EEAD4] to-[#A78BFA] bg-clip-text text-transparent">
            <EditableText value="livrée comme un produit." storageKey="hero_title_3" />
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-center text-base font-light leading-relaxed text-neutral-400 md:text-lg">
          <EditableText
            value="Audit, agents IA, formations. Construit en jours. Mesuré en gain."
            storageKey="hero_subtitle"
            isTextarea
            className="w-full text-center"
          />
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.03] hover:bg-neutral-100"
          >
            Réserver un audit
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </a>
          <a
            href="/realisations"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-neutral-200 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.06]"
          >
            Voir nos réalisations
            <ArrowUpRight className="h-4 w-4 opacity-60" />
          </a>
        </div>

        {/* === BENTO GRID === */}
        <div className="mt-20 grid grid-cols-1 gap-3 md:grid-cols-6 md:grid-rows-2">
          {/* Big card — "What we do" */}
          <div className="group relative col-span-1 row-span-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#A1FF6B]/[0.08] via-[#0F1410] to-[#0A0A0A] p-7 transition-all duration-300 hover:border-[#A1FF6B]/30 md:col-span-3">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#A1FF6B]/15 text-[#A1FF6B]">
                  <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <h3 className="text-2xl font-medium tracking-tight text-white md:text-3xl">
                  Quatre métiers,<br /> une seule équipe.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400 md:text-base">
                  Audit, conseil, formation, production. On gère l'IA bout en bout pour PME et grands groupes.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-2">
                {[
                  { icon: BarChart3, label: 'Audit IA' },
                  { icon: Workflow, label: 'Agents' },
                  { icon: GraduationCap, label: 'Formation' },
                  { icon: Zap, label: 'Production' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                    <Icon className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-xs text-neutral-200">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stat card 1 */}
          <div className="group col-span-1 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#5EEAD4]/[0.08] via-[#0F1413] to-[#0A0A0A] p-6 transition-all duration-300 hover:border-[#5EEAD4]/30 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500" style={{ fontFamily: 'ui-monospace, monospace' }}>Délai audit</div>
            <div className="mt-3 text-6xl font-medium tracking-tight text-white">
              5<span className="text-[#5EEAD4]">j</span>
            </div>
            <div className="mt-2 text-sm text-neutral-400">Diagnostic complet livrable.</div>
          </div>

          {/* Mini card — CTA */}
          <div className="group relative col-span-1 flex items-center overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E0E0E] p-6 transition-all duration-300 hover:border-white/20">
            <a
              href="https://calendly.com/clem-pred/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
              aria-label="Réserver"
            />
            <div className="flex w-full items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500" style={{ fontFamily: 'ui-monospace, monospace' }}>Premier rdv</div>
                <div className="mt-2 text-xl font-medium tracking-tight text-white">Gratuit · 30 min</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-neutral-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
          </div>

          {/* Stat card 2 — audience */}
          <div className="group col-span-1 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#A78BFA]/[0.08] via-[#0F0F14] to-[#0A0A0A] p-6 transition-all duration-300 hover:border-[#A78BFA]/30 md:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500" style={{ fontFamily: 'ui-monospace, monospace' }}>Communauté</div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-6xl font-medium tracking-tight text-white">40<span className="text-[#A78BFA]">k</span></span>
              <span className="text-xs text-neutral-500">cumulés</span>
            </div>
            <div className="mt-2 text-sm text-neutral-400">Abonnés LinkedIn des fondateurs.</div>
          </div>

          {/* Mini card — clients */}
          <div className="col-span-1 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E0E0E] p-6">
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 mb-3" style={{ fontFamily: 'ui-monospace, monospace' }}>Clients</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm font-medium text-neutral-300">
              <span>SNCF</span>
              <span className="text-neutral-600">·</span>
              <span>Capgemini</span>
              <span className="text-neutral-600">·</span>
              <span>EY</span>
              <span className="text-neutral-600">·</span>
              <span>BNP</span>
              <span className="text-neutral-600">·</span>
              <span>Orange</span>
              <span className="text-neutral-600">·</span>
              <span>SG</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
