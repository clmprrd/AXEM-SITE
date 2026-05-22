import React from 'react';
import EditableText from './ui/EditableText';
import ColorBends from './ColorBends';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomCursor, AnimatedCount } from './ui/wow';

// Direction B — Stripe Cinematic Editorial (v3 WOW)
// Adds: custom blend cursor, scroll-linked stats count-up, blur-in title stagger,
// editorial shimmer dividers animation, animated stats with Playfair counter
const Hero: React.FC = () => {
  return (
    <>
      {/* Custom cursor with mix-blend-difference for cinematic feel */}
      <CustomCursor size={32} color="#FFFFFF" />

      <section
        className="relative isolate flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6 pt-40 pb-32"
        aria-label="AXEM IA — Hero"
      >
        {/* === Aurora WebGL background === */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-90">
            <ColorBends
              colors={['#FF6B6B', '#F472B6', '#A78BFA']}
              rotation={6}
              speed={0.4}
              scale={1.4}
              frequency={0.9}
              warpStrength={1.4}
              mouseInfluence={1.4}
              parallax={1.1}
              noise={0.08}
              transparent
              autoRotate={0.05}
              color="#F472B6"
            />
          </div>
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#060606] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-[#060606] via-[#060606]/70 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_center,transparent_0%,rgba(6,6,6,0.5)_85%,#060606_100%)]" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        {/* === Top eyebrow with shimmer line (animated) === */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white/70">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-px w-12 origin-right bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
            <span>Conseil · Formation · Production IA</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-px w-12 origin-left bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </div>
        </motion.div>

        {/* === Editorial title with line-by-line blur reveal === */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
          className="mt-8 max-w-6xl text-center text-[44px] leading-[0.98] text-white sm:text-7xl md:text-[88px] lg:text-[112px]"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } },
            }}
            className="block"
          >
            <span className="font-playfair italic font-normal text-white/85">
              <EditableText value="Rendre" storageKey="hero_title_1" />
            </span>{' '}
            <span className="font-medium tracking-[-0.03em]">
              <EditableText value="l'IA" storageKey="hero_title_2" />
            </span>
          </motion.span>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } },
            }}
            className="bg-gradient-to-r from-[#FFB59E] via-[#F472B6] to-[#A78BFA] bg-clip-text font-playfair italic font-normal text-transparent block"
            style={{ backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 12, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
          >
            <EditableText value="enfin actionnable." storageKey="hero_title_3" />
          </motion.span>
        </motion.h1>

        {/* === Subtitle === */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-9 max-w-2xl text-center text-base font-light leading-relaxed text-white/70 md:text-xl"
        >
          <EditableText
            value="Une agence d'IA qui livre. Audit, agents intelligents, formations sur-mesure."
            storageKey="hero_subtitle"
            isTextarea
            className="w-full text-center"
          />
        </motion.p>

        {/* === CTAs === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="https://calendly.com/clem-pred/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03]"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F472B6]/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
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
        </motion.div>

        {/* === Stats row with animated counters === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mt-24 grid grid-cols-3 gap-x-12 gap-y-4 md:gap-x-20"
        >
          {[
            { value: 30000, suffix: '+', label: 'Abonnés LinkedIn' },
            { value: 5, suffix: 'j', label: "Délai d'audit" },
            { value: 200, suffix: '+', label: 'Collaborateurs formés' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-playfair text-3xl italic bg-gradient-to-br from-[#FFB59E] to-[#A78BFA] bg-clip-text text-transparent md:text-5xl">
                <AnimatedCount value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50 md:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
