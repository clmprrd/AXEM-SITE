import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCount, SpotlightCard, ScrollRevealWords } from './ui/wow';

// Direction A — Linear Engineered (v3 WOW)
// Adds: scroll-revealed words in big title, spotlight cards, animated counters on stats
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
        { label: 'Abonnés LinkedIn', value: 30000, suffix: '+' },
        { label: "Années d'XP IA", value: 3, suffix: '' },
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
        { label: 'Abonnés LinkedIn', value: 10000, suffix: '+' },
        { label: "Années d'XP IA", value: 3, suffix: '' },
      ],
      linkedin: 'https://www.linkedin.com/in/alexiszeitoun/',
    },
  ];

  return (
    <section id="qui-sommes-nous" className="relative border-t border-white/[0.06] bg-[#050505] py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#B7FF45]">
              <span className="text-white/30">01 —</span>{' '}
              <EditableText value="Fondateurs" storageKey="philo_badge" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <ScrollRevealWords
              text="Deux mondes, une seule équipe."
              className="text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl"
              brightClass="text-white"
              dimClass="text-white/20"
            />
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-neutral-400 md:text-lg">
              L'excellence technique et la stratégie business, fondues en une seule offre.
              Pas de relais, pas d'intermédiaires.
            </p>
          </div>
        </div>

        {/* Founder cards — Spotlight */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/[0.06] md:grid-cols-2">
          {founders.map((f, idx) => (
            <SpotlightCard
              key={f.name}
              className="group flex flex-col gap-6 border bg-[#0A0A0A] p-8 md:p-10"
              spotlightColor="rgba(183,255,69,0.10)"
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex flex-col gap-6"
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
                    className="h-16 w-16 rounded-full border border-white/10 object-cover transition-transform duration-500 group-hover:scale-105 md:h-20 md:w-20"
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

                <p className="text-base leading-relaxed text-neutral-300">{f.pitch}</p>

                <div className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04]">
                  {f.stats.map((s) => (
                    <div key={s.label} className="bg-[#0A0A0A] p-4">
                      <div className="font-mono text-2xl font-medium text-white md:text-3xl">
                        <AnimatedCount value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
