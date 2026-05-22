import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCount, SpotlightCard, ScrollRevealWords } from './ui/wow';

// Proposition X — Editorial Pure
// Founders avec VRAIES données du PDF
const Philosophy: React.FC = () => {
  const clementImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg";
  const alexisImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png";

  const founders = [
    {
      img: clementImage,
      tag: 'Stratégie · Formations',
      name: 'Clément Predo',
      school: 'ESSEC',
      role: 'Co-fondateur',
      pitch: 'Stratégie, formations, conseil et automatisation. Pilotage des missions audit et stratégie.',
      bullets: [
        '3 ans de terrain IA',
        'Formations, conseil, automatisation',
        'Pilotage missions audit & stratégie',
      ],
      stats: { value: 40000, label: 'abonnés LinkedIn' },
      linkedin: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/',
    },
    {
      img: alexisImage,
      tag: 'Tech · Déploiement',
      name: 'Alexis Zeitoun',
      school: 'Institut Polytechnique de Paris',
      role: 'Co-fondateur',
      pitch: "Déploiement terrain, expertise tech. Expérience secteur financier et fonds de Private Equity.",
      bullets: [
        '3 ans de terrain IA',
        'Déploiement terrain, équipes & dirigeants',
        'Secteur financier · fonds Private Equity',
      ],
      stats: { value: 15000, label: 'abonnés LinkedIn' },
      linkedin: 'https://www.linkedin.com/in/alexiszeitoun/',
    },
  ];

  return (
    <section id="qui-sommes-nous" className="relative border-t border-white/[0.06] bg-[#050505] py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
              <span className="h-2 w-2 bg-[#00FA9A]" />
              <EditableText value="Fondateurs" storageKey="philo_badge" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <ScrollRevealWords
              text="Deux experts, un seul interlocuteur."
              className="font-display text-4xl font-light leading-[1.05] tracking-[-0.03em] md:text-6xl lg:text-7xl"
              brightClass="text-white"
              dimClass="text-white/15"
            />
            <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-neutral-400">
              Pas une agence de plus, pas deux consultants génériques. L'excellence technique et la
              stratégie business, fondues en une seule offre. Du diagnostic au déploiement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/[0.06] md:grid-cols-2">
          {founders.map((f, idx) => (
            <SpotlightCard
              key={f.name}
              className="group flex flex-col gap-6 border bg-[#0A0A0A] p-8 md:p-10"
              spotlightColor="rgba(0,250,154,0.10)"
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex h-full flex-col gap-6"
              >
                <div className="flex items-start justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                    {f.tag}
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 transition-colors hover:text-[#00FA9A]"
                    aria-label={`LinkedIn de ${f.name}`}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </motion.a>
                </div>

                <div className="flex items-center gap-5">
                  <motion.img
                    whileHover={{ scale: 1.05, rotate: idx === 0 ? -2 : 2 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    src={f.img}
                    alt={f.name}
                    className="h-20 w-20 rounded-full border border-white/10 object-cover md:h-24 md:w-24"
                  />
                  <div>
                    <h3 className="font-display text-3xl font-light tracking-tight text-white md:text-4xl">
                      {f.name}
                    </h3>
                    <p className="mt-1 font-playfair text-base italic text-[#00FA9A]">
                      {f.role}
                    </p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {f.school}
                    </p>
                  </div>
                </div>

                <p className="text-base leading-relaxed text-neutral-300">{f.pitch}</p>

                <ul className="space-y-2.5 border-t border-white/[0.06] pt-5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-neutral-400">
                      <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 bg-[#00FA9A]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-baseline gap-3 border-t border-white/[0.06] pt-6">
                  <span className="font-display text-5xl font-light text-[#00FA9A] md:text-6xl">
                    +<AnimatedCount value={f.stats.value} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    {f.stats.label}
                  </span>
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
