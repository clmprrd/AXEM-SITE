import React from 'react';
import EditableText from './ui/EditableText';
import { motion } from 'framer-motion';
import { ScrollRevealWords, ParallaxY, AnimatedCount } from './ui/wow';

// Direction D — Apple Premium Showcase (v3 WOW)
// Adds: massive scroll-reveal title, parallax founder photos, animated counters, hover-scale on photos
const Philosophy: React.FC = () => {
  const clementImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg";
  const alexisImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png";

  return (
    <section id="qui-sommes-nous" className="relative bg-[#050505]">
      {/* === Massive editorial statement with scroll-reveal === */}
      <div className="border-t border-white/[0.06] py-32 md:py-48">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.42em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="mb-10 text-[11px] uppercase text-white/40"
          >
            <EditableText value="Qui sommes-nous" storageKey="philo_badge" />
          </motion.div>
          {/* 3 lines via ScrollRevealWords combined */}
          <div className="text-[36px] font-light leading-[1.1] tracking-[-0.02em] sm:text-5xl md:text-7xl lg:text-[80px]">
            <ScrollRevealWords
              text="Deux humains."
              brightClass="text-white/30"
              dimClass="text-white/10"
              className="block"
            />
            <ScrollRevealWords
              text="Quatre métiers."
              brightClass="text-white"
              dimClass="text-white/15"
              className="block"
            />
            <ScrollRevealWords
              text="Une exigence."
              brightClass="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent"
              dimClass="text-white/15"
              className="block"
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 max-w-2xl text-lg leading-relaxed text-white/55 md:text-xl"
          >
            Plus qu'une agence : votre pont entre la complexité des machines et la réalité de votre croissance.
          </motion.p>
        </div>
      </div>

      {/* === Founder 1 — Clément with parallax photo === */}
      <div className="relative overflow-hidden border-t border-white/[0.06] py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20">
          <ParallaxY range={[40, -40]} className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative overflow-hidden rounded-[36px] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
            >
              <motion.img
                src={clementImage}
                alt="Clément"
                className="aspect-[4/5] w-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-white/60">ESSEC · Stratégie</div>
                  <div className="mt-1 text-2xl font-medium text-white">Clément Predo</div>
                </div>
              </div>
            </motion.div>
          </ParallaxY>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="text-[11px] uppercase tracking-[0.42em] text-white/40">Co-fondateur · 01</div>
            <h3 className="mt-4 text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
              Le stratège.
            </h3>
            <p className="mt-8 text-lg leading-relaxed text-white/70 md:text-xl">
              Je traduis la technologie en rentabilité et leviers de croissance.
              3 ans de terrain IA, des formations et missions audit pour PME et grands groupes.
            </p>
            <div className="mt-12 flex items-baseline gap-3 border-t border-white/[0.08] pt-8">
              <span className="text-6xl font-light tracking-[-0.03em] text-white md:text-7xl">
                <AnimatedCount value={30000} suffix="" /><span className="text-white/40">+</span>
              </span>
              <span className="text-xs uppercase tracking-[0.28em] text-white/40">abonnés LinkedIn</span>
            </div>
            <motion.a
              href="https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-8 inline-flex items-baseline gap-2 text-base font-medium text-[#86A6FF] transition-colors hover:text-white"
            >
              <span>Profil LinkedIn</span>
              <span>→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* === Founder 2 — Alexis with parallax photo === */}
      <div className="relative overflow-hidden border-t border-white/[0.06] py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20">
          <ParallaxY range={[40, -40]} className="lg:order-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative overflow-hidden rounded-[36px] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
            >
              <motion.img
                src={alexisImage}
                alt="Alexis"
                className="aspect-[4/5] w-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-white/60">Télécom Paris · Tech</div>
                  <div className="mt-1 text-2xl font-medium text-white">Alexis Zeitoun</div>
                </div>
              </div>
            </motion.div>
          </ParallaxY>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:order-1"
          >
            <div className="text-[11px] uppercase tracking-[0.42em] text-white/40">Co-fondateur · 02</div>
            <h3 className="mt-4 text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
              L'ingénieur.
            </h3>
            <p className="mt-8 text-lg leading-relaxed text-white/70 md:text-xl">
              Je forge les systèmes et automatise l'intelligence en moteur de production.
              Expérience terrain dans le secteur financier, déploiement équipes et dirigeants.
            </p>
            <div className="mt-12 flex items-baseline gap-3 border-t border-white/[0.08] pt-8">
              <span className="text-6xl font-light tracking-[-0.03em] text-white md:text-7xl">
                <AnimatedCount value={10000} suffix="" /><span className="text-white/40">+</span>
              </span>
              <span className="text-xs uppercase tracking-[0.28em] text-white/40">abonnés LinkedIn</span>
            </div>
            <motion.a
              href="https://www.linkedin.com/in/alexiszeitoun/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-8 inline-flex items-baseline gap-2 text-base font-medium text-[#86A6FF] transition-colors hover:text-white"
            >
              <span>Profil LinkedIn</span>
              <span>→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
