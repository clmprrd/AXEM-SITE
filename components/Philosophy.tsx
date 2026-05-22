import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight, Briefcase, Cpu, Linkedin } from 'lucide-react';

// Direction C — Framer Bento Interactive
// Philosophy as asymmetric bento with founder cards
const Philosophy: React.FC = () => {
  const clementImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg";
  const alexisImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png";

  return (
    <section id="qui-sommes-nous" className="relative border-t border-white/[0.06] bg-[#0A0A0A] py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-neutral-300">
              <span className="text-[#5EEAD4]">●</span>
              <EditableText value="Qui sommes-nous" storageKey="philo_badge" />
            </div>
            <h2 className="max-w-2xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-5xl lg:text-6xl">
              Deux mondes,<br />
              <span className="bg-gradient-to-r from-[#5EEAD4] to-[#A78BFA] bg-clip-text text-transparent">une seule équipe.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-neutral-400">
            L'excellence technique et la stratégie business, fondues en une seule offre.
            Pas de relais, pas d'intermédiaires.
          </p>
        </div>

        {/* === BENTO LAYOUT === */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:grid-rows-2">
          {/* Card Clément — big left */}
          <div className="group relative col-span-1 row-span-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#5EEAD4]/[0.06] via-[#0E1413] to-[#0A0A0A] p-7 transition-all hover:border-[#5EEAD4]/30 md:col-span-7">
            <a
              href="https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-neutral-400 transition-all hover:scale-110 hover:border-[#5EEAD4]/40 hover:text-[#5EEAD4]"
              aria-label="LinkedIn Clément"
            >
              <Linkedin className="h-4 w-4" />
            </a>

            <div className="flex flex-col gap-5">
              <img
                src={clementImage}
                alt="Clément"
                className="h-32 w-32 rounded-2xl border border-white/10 object-cover"
              />
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#5EEAD4]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#5EEAD4]">
                  <Briefcase className="h-3 w-3" />
                  Stratégie · Business
                </div>
                <h3 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-5xl">
                  Clément Predo
                </h3>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-neutral-500">ESSEC</p>
              </div>
              <p className="max-w-lg text-base leading-relaxed text-neutral-300">
                Le stratège. Traduit la technologie en rentabilité et leviers de croissance.
                3 ans de terrain IA · Formations, conseil, automatisation.
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-5xl font-medium tracking-tight text-white">30k<span className="text-[#5EEAD4]">+</span></span>
                <span className="text-xs uppercase tracking-[0.16em] text-neutral-500">abonnés LinkedIn</span>
              </div>
            </div>
          </div>

          {/* Card Alexis — top right */}
          <div className="group relative col-span-1 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#A78BFA]/[0.06] via-[#0F0F14] to-[#0A0A0A] p-6 transition-all hover:border-[#A78BFA]/30 md:col-span-5">
            <a
              href="https://www.linkedin.com/in/alexiszeitoun/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-neutral-400 transition-all hover:scale-110 hover:border-[#A78BFA]/40 hover:text-[#A78BFA]"
              aria-label="LinkedIn Alexis"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>

            <div className="flex items-start gap-4">
              <img
                src={alexisImage}
                alt="Alexis"
                className="h-20 w-20 rounded-xl border border-white/10 object-cover"
              />
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#A78BFA]/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#A78BFA]">
                  <Cpu className="h-3 w-3" />
                  Tech · Système
                </div>
                <h3 className="mt-2 text-3xl font-medium tracking-tight text-white">Alexis Zeitoun</h3>
                <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-neutral-500">Télécom Paris</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-300">
              L'ingénieur. Forge les systèmes et automatise l'intelligence en moteur de production.
            </p>
            <div className="mt-4 flex items-baseline gap-2 border-t border-white/[0.06] pt-4">
              <span className="text-3xl font-medium tracking-tight text-white">10k<span className="text-[#A78BFA]">+</span></span>
              <span className="text-xs uppercase tracking-[0.16em] text-neutral-500">LinkedIn</span>
            </div>
          </div>

          {/* Card Manifesto — bottom right */}
          <div className="col-span-1 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E0E0E] p-6 md:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Manifeste</div>
            <p className="font-playfair text-2xl italic leading-snug text-white/85 md:text-3xl">
              « Plus qu'une agence : votre pont entre la complexité des machines et la réalité de votre croissance. »
            </p>
            <a
              href="https://calendly.com/clem-pred/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-[#5EEAD4]"
            >
              Discutons-en
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
