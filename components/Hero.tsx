import React, { useEffect } from 'react';
import EditableText from './ui/EditableText';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AnimatedCount } from './ui/wow';

// Direction D — Apple Premium Showcase (v3 WOW)
// Adds: parallax mouse-tracked light, gigantic title sequential fade-in (cinematic),
// animated counters in mockup, slow rotation in aurora reflection, smooth pan on stats.
const Hero: React.FC = () => {
  // Mouse-tracking light at top
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.2);
  const smx = useSpring(mx, { stiffness: 60, damping: 24 });
  const smy = useSpring(my, { stiffness: 60, damping: 24 });
  const lightX = useTransform(smx, [0, 1], ['20%', '80%']);
  const lightY = useTransform(smy, [0, 1], ['-10%', '20%']);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mx, my]);

  return (
    <section className="relative isolate flex min-h-[100vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pt-32 pb-24">
      {/* Cinematic mouse-tracking radial light */}
      <motion.div
        aria-hidden="true"
        className="absolute -z-10 h-[120vh] w-[140vw] -translate-x-1/2 -translate-y-1/2 opacity-60"
        style={{
          left: lightX,
          top: lightY,
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(180,200,255,0.22), transparent 70%)',
        }}
      />
      {/* Static base ambient */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 h-[80vh] w-[120vw] -translate-x-1/2 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(180,200,255,0.18), transparent 60%)',
        }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* Tiny eyebrow */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.42em' }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-12 text-[11px] font-medium uppercase text-white/40"
        >
          <EditableText value="AXEM IA · 2026" storageKey="hero_title_1" />
        </motion.div>

        {/* MASSIVE single-line title with sequential cinematic reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 }}
          className="text-center text-[56px] font-light leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl md:text-8xl lg:text-[128px] xl:text-[160px]"
        >
          <EditableText value="L'IA," storageKey="hero_title_2" />
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.65 }}
          className="mt-2 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-center text-[56px] font-light leading-[0.95] tracking-[-0.04em] text-transparent sm:text-7xl md:text-8xl lg:text-[128px] xl:text-[160px]"
        >
          <EditableText value="livrée." storageKey="hero_title_3" />
        </motion.h1>

        {/* Refined subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="mt-12 max-w-xl text-center text-lg font-light leading-relaxed text-white/60 md:text-xl"
        >
          <EditableText
            value="Une nouvelle façon de mettre l'IA au travail dans votre entreprise. Conçue par AXEM IA."
            storageKey="hero_subtitle"
            isTextarea
            className="w-full text-center"
          />
        </motion.p>

        {/* Apple-style minimal CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-4"
        >
          {[
            { label: 'Découvrir nos réalisations', href: '/realisations', target: undefined as any },
            { label: 'Réserver un appel', href: 'https://calendly.com/clem-pred/30min', target: '_blank' },
          ].map((cta) => (
            <motion.a
              key={cta.label}
              href={cta.href}
              target={cta.target}
              rel={cta.target ? 'noopener noreferrer' : undefined}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group inline-flex items-baseline gap-2 text-base font-medium text-[#86A6FF] transition-colors hover:text-white"
            >
              <span>{cta.label}</span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >→</motion.span>
            </motion.a>
          ))}
        </motion.div>

        {/* Premium product card with animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mt-24 w-full max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0F1015] via-[#0A0B0F] to-[#050507] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="relative overflow-hidden rounded-[22px] bg-[#06070A]">
              {/* Slowly rotating aurora reflection */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-32"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(120,150,255,0.32), transparent)',
                }}
                animate={{ opacity: [0.6, 1, 0.6], x: [-20, 20, -20] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative grid grid-cols-3 gap-px bg-white/[0.04] p-px">
                {[
                  { label: 'AUDIT', value: 5, suffix: 'j' },
                  { label: 'LIVRABLE', value: 100, suffix: '%' },
                  { label: 'ROI', value: 40, suffix: '%', prefix: '+' },
                ].map((c) => (
                  <div key={c.label} className="bg-[#06070A] px-6 py-12 text-center md:py-16">
                    <div className="text-[10px] uppercase tracking-[0.32em] text-white/40">{c.label}</div>
                    <div className="mt-3 text-5xl font-light tracking-[-0.03em] text-white md:text-6xl">
                      <AnimatedCount value={c.value} suffix={c.suffix} prefix={c.prefix} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-white/30">
            Conçu sur-mesure · Livré en jours
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 flex justify-center"
        >
          <motion.svg
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="text-white/30"
          >
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
