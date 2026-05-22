import React from 'react';
import EditableText from './ui/EditableText';

// Direction D — Apple Premium Showcase
// Philosophy as massive editorial sequence: huge statement + 2 founder portraits with parallax feel
const Philosophy: React.FC = () => {
  const clementImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg";
  const alexisImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png";

  return (
    <section id="qui-sommes-nous" className="relative bg-[#050505]">
      {/* Massive editorial statement */}
      <div className="border-t border-white/[0.06] py-32 md:py-48">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-[11px] uppercase tracking-[0.42em] text-white/40">
            <EditableText value="Qui sommes-nous" storageKey="philo_badge" />
          </div>
          <h2 className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl md:text-7xl lg:text-[80px]">
            <span className="text-white/30">Deux humains.</span>
            <br />
            <span>Quatre métiers.</span>
            <br />
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Une exigence.
            </span>
          </h2>
          <p className="mt-12 max-w-2xl text-lg leading-relaxed text-white/55 md:text-xl">
            Plus qu'une agence : votre pont entre la complexité des machines et la réalité de votre croissance.
          </p>
        </div>
      </div>

      {/* Founder 1 — Clément (image left, text right) */}
      <div className="relative overflow-hidden border-t border-white/[0.06] py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <img src={clementImage} alt="Clément" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-white/60">ESSEC · Stratégie</div>
                  <div className="mt-1 text-2xl font-medium text-white">Clément Predo</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.42em] text-white/40">
              Co-fondateur · 01
            </div>
            <h3 className="mt-4 text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
              Le stratège.
            </h3>
            <p className="mt-8 text-lg leading-relaxed text-white/70 md:text-xl">
              Je traduis la technologie en rentabilité et leviers de croissance.
              3 ans de terrain IA, des formations et missions audit pour PME et grands groupes.
            </p>
            <div className="mt-12 flex items-baseline gap-3 border-t border-white/[0.08] pt-8">
              <span className="text-6xl font-light tracking-[-0.03em] text-white md:text-7xl">30k<span className="text-white/40">+</span></span>
              <span className="text-xs uppercase tracking-[0.28em] text-white/40">abonnés LinkedIn</span>
            </div>
            <a
              href="https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-baseline gap-2 text-base font-medium text-[#86A6FF] transition-colors hover:text-white"
            >
              <span>Profil LinkedIn</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Founder 2 — Alexis (text left, image right) */}
      <div className="relative overflow-hidden border-t border-white/[0.06] py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20">
          <div className="lg:order-2">
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <img src={alexisImage} alt="Alexis" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-white/60">Télécom Paris · Tech</div>
                  <div className="mt-1 text-2xl font-medium text-white">Alexis Zeitoun</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:order-1">
            <div className="text-[11px] uppercase tracking-[0.42em] text-white/40">
              Co-fondateur · 02
            </div>
            <h3 className="mt-4 text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
              L'ingénieur.
            </h3>
            <p className="mt-8 text-lg leading-relaxed text-white/70 md:text-xl">
              Je forge les systèmes et automatise l'intelligence en moteur de production.
              Expérience terrain dans le secteur financier, déploiement équipes et dirigeants.
            </p>
            <div className="mt-12 flex items-baseline gap-3 border-t border-white/[0.08] pt-8">
              <span className="text-6xl font-light tracking-[-0.03em] text-white md:text-7xl">10k<span className="text-white/40">+</span></span>
              <span className="text-xs uppercase tracking-[0.28em] text-white/40">abonnés LinkedIn</span>
            </div>
            <a
              href="https://www.linkedin.com/in/alexiszeitoun/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-baseline gap-2 text-base font-medium text-[#86A6FF] transition-colors hover:text-white"
            >
              <span>Profil LinkedIn</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
