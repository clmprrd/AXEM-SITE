import React from 'react';
import EditableText from './ui/EditableText';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollRevealWords, AnimatedCount, SpotlightCard } from './ui/wow';

// Direction B — Stripe Cinematic (v3 WOW)
// Adds: scroll-reveal big editorial quote, spotlight founder cards, animated counters
const Philosophy: React.FC = () => {
  const clementImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg";
  const alexisImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png";

  return (
    <section id="qui-sommes-nous" className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#060606] py-32">
      {/* === Ambient gradient orbs that breathe === */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-40 top-1/4 h-[40vw] w-[40vw] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(closest-side, #F472B6, transparent)' }}
          animate={{ opacity: [0.25, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-40 bottom-1/4 h-[36vw] w-[36vw] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(closest-side, #A78BFA, transparent)' }}
          animate={{ opacity: [0.2, 0.45, 0.25], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Editorial eyebrow with sweep */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white/60"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-px w-12 origin-right bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
          <EditableText value="Qui sommes-nous" storageKey="philo_badge" />
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-px w-12 origin-left bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </motion.div>

        {/* Massive editorial quote with ScrollRevealWords */}
        <div className="mx-auto mb-24 max-w-5xl text-center">
          <ScrollRevealWords
            text="L'excellence technique rencontre la stratégie business."
            className="text-4xl leading-[1.05] tracking-[-0.02em] md:text-6xl lg:text-7xl"
            brightClass="text-white font-playfair italic"
            dimClass="text-white/15 font-playfair italic"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 mx-auto max-w-2xl text-base font-light leading-relaxed text-white/60 md:text-lg"
          >
            Plus qu'une agence : votre pont entre la complexité des machines et la réalité de votre croissance.
          </motion.p>
        </div>

        {/* Founders — Spotlight + animated counters */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {[
            {
              img: clementImage,
              name: 'Clément Predo',
              school: 'ESSEC · Stratégie',
              quote: '« Le stratège. Je traduis la technologie en rentabilité et leviers de croissance. »',
              statValue: 30000, statSuffix: '+', statLabel: 'Abonnés LinkedIn',
              linkedin: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/',
              gradient: 'from-[#FFB59E] to-[#F472B6]',
              spotColor: 'rgba(244,114,182,0.18)',
            },
            {
              img: alexisImage,
              name: 'Alexis Zeitoun',
              school: 'Télécom Paris · Tech',
              quote: "« L'ingénieur. Je forge les systèmes et automatise l'intelligence en moteur de production. »",
              statValue: 10000, statSuffix: '+', statLabel: 'Abonnés LinkedIn',
              linkedin: 'https://www.linkedin.com/in/alexiszeitoun/',
              gradient: 'from-[#A78BFA] to-[#F472B6]',
              spotColor: 'rgba(167,139,250,0.18)',
            },
          ].map((f, i) => (
            <motion.article
              key={f.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              className="group relative"
            >
              <div
                className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${f.gradient} opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-40`}
                aria-hidden="true"
              />
              <SpotlightCard
                spotlightColor={f.spotColor}
                className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md md:p-10"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-6">
                    <motion.div
                      whileHover={{ rotate: -3, scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      className={`flex-shrink-0 rounded-full bg-gradient-to-br ${f.gradient} p-[1.5px]`}
                    >
                      <img
                        src={f.img}
                        alt={f.name}
                        className="h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-medium tracking-tight text-white md:text-4xl">
                        {f.name}
                      </h3>
                      <p className="mt-1 text-sm uppercase tracking-[0.16em] text-white/50">{f.school}</p>
                    </div>
                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 transition-colors hover:text-white"
                      aria-label={`LinkedIn de ${f.name}`}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  </div>

                  <blockquote className="border-l-2 border-white/10 pl-6 font-playfair text-xl italic leading-relaxed text-white/85 md:text-2xl">
                    {f.quote}
                  </blockquote>

                  <div className="flex items-baseline gap-3 border-t border-white/[0.08] pt-6">
                    <span className={`font-playfair text-5xl italic bg-gradient-to-br ${f.gradient} bg-clip-text text-transparent md:text-6xl`}>
                      <AnimatedCount value={f.statValue} suffix={f.statSuffix} />
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-white/50">{f.statLabel}</span>
                  </div>
                </div>
              </SpotlightCard>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
