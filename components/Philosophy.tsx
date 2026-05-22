import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight } from 'lucide-react';

// Direction A — Linear Engineered Minimal
// Philosophy as "01 — Founders" section: sticky label, clean H2, 2 founder cards
const Philosophy: React.FC = () => {
  const clementImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg";
  const alexisImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png";

  const founders = [
    {
      img: clementImage,
      tag: 'Stratégie · Business',
      name: 'Clément Predo',
      school: 'ESSEC',
      pitch: 'Le stratège. Traduit la technologie en rentabilité et leviers de croissance.',
      stats: [
        { label: 'Abonnés LinkedIn', value: '30k+' },
        { label: "Années d'XP IA", value: '3' },
      ],
      linkedin: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/',
    },
    {
      img: alexisImage,
      tag: 'Tech · Système',
      name: 'Alexis Zeitoun',
      school: 'Télécom Paris',
      pitch: "L'ingénieur. Forge les systèmes et automatise l'intelligence en moteur de production.",
      stats: [
        { label: 'Abonnés LinkedIn', value: '10k+' },
        { label: "Années d'XP IA", value: '3' },
      ],
      linkedin: 'https://www.linkedin.com/in/alexiszeitoun/',
    },
  ];

  return (
    <section id="qui-sommes-nous" className="relative border-t border-white/[0.06] bg-[#050505] py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section label */}
        <div className="mb-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#B7FF45]">
              <span className="text-white/30">01 —</span>{' '}
              <EditableText value="Fondateurs" storageKey="philo_badge" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-6xl">
              Deux mondes,<br />
              <span className="text-white/50">une seule équipe.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-neutral-400 md:text-lg">
              L'excellence technique et la stratégie business, fondues en une seule offre.
              Pas de relais, pas d'intermédiaires.
            </p>
          </div>
        </div>

        {/* Founder cards */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/[0.06] md:grid-cols-2">
          {founders.map((f) => (
            <article
              key={f.name}
              className="group relative flex flex-col gap-6 bg-[#0A0A0A] p-8 transition-colors hover:bg-[#0C0C0C] md:p-10"
            >
              <div className="flex items-start justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  {f.tag}
                </div>
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 transition-colors hover:text-[#B7FF45]"
                  aria-label={`LinkedIn de ${f.name}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center gap-5">
                <img
                  src={f.img}
                  alt={f.name}
                  className="h-16 w-16 rounded-full border border-white/10 object-cover md:h-20 md:w-20"
                />
                <div>
                  <h3 className="text-2xl font-medium tracking-tight text-white md:text-3xl">
                    {f.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.18em] text-[#B7FF45]">
                    {f.school}
                  </p>
                </div>
              </div>

              <p className="text-base leading-relaxed text-neutral-300">
                {f.pitch}
              </p>

              <div className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04]">
                {f.stats.map((s) => (
                  <div key={s.label} className="bg-[#0A0A0A] p-4">
                    <div className="font-mono text-2xl font-medium text-white md:text-3xl">{s.value}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
