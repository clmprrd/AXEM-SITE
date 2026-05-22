import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// BRUTALIST SWISS — TARIFICATION system specs
const Pricing: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <section
      id="pricing"
      className="relative border-t border-[#F0EDE5]/[0.08] bg-black overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", color: '#F0EDE5' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, #F0EDE5 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 12) 100%',
        }}
      />

      {/* Top mono badge */}
      <div className="relative border-b border-[#F0EDE5]/[0.08]">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-[#FF2D5F]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            // PRICING.spec
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-[#F0EDE5]/50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            [ 06 // 06 ]
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="leading-[0.88] tracking-[-0.04em] uppercase mb-20"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(48px, 10vw, 180px)' }}
        >
          <span className="block text-[#F0EDE5]">TRANSPARENT.</span>
          <span className="block text-[#F0EDE5]">MODULAR.</span>
          <span className="inline-block mt-2 bg-[#FF2D5F] text-black px-4">FUNDABLE.</span>
        </motion.h2>

        {/* 3 cols data-block divider */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 border-t border-[#F0EDE5]/[0.08]">
          {/* COL 1 FORMATIONS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0 }}
            className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#F0EDE5]/[0.08]"
          >
            <div
              className="text-[11px] uppercase tracking-[0.18em] text-[#FF2D5F] mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [01] FORMATIONS
            </div>
            <h3
              className="leading-[0.95] uppercase tracking-[-0.03em] text-[#F0EDE5] mb-8"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 3vw, 40px)' }}
            >
              200€<br />→ 1250€
            </h3>
            <div
              className="border border-[#F0EDE5]/[0.2] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#F0EDE5] inline-block mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              QUALIOPI ✓
            </div>
            <ul className="space-y-3 text-[12px] uppercase tracking-[0.06em] text-[#F0EDE5]/80" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>10 MODULES F01-F10</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>3 LEVELS · 70% PRACTICE</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>INTRA OR INTER-ENTREPRISE</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>BOOTCAMPS ON QUOTE</li>
            </ul>
            <div
              className="mt-8 pt-6 border-t border-[#F0EDE5]/[0.08] text-[10px] uppercase tracking-[0.18em] text-[#F0EDE5]/60"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // FINANCEMENT_OPCO_AVAILABLE
            </div>
          </motion.div>

          {/* COL 2 CONSEIL */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#F0EDE5]/[0.08] bg-[#0A0A0A]"
          >
            <div
              className="text-[11px] uppercase tracking-[0.18em] text-[#FF2D5F] mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [02] CONSEIL & DEPLOIEMENT
            </div>
            <h3
              className="leading-[0.95] uppercase tracking-[-0.03em] text-[#F0EDE5] mb-8"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 3vw, 40px)' }}
            >
              FROM<br />1200€
            </h3>
            <div
              className="border border-[#FF2D5F] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#FF2D5F] inline-block mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              MOST POPULAR
            </div>
            <ul className="space-y-3 text-[12px] uppercase tracking-[0.06em] text-[#F0EDE5]/80" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>AUDIT 1-4 SEMAINES</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>AUTOMATISATION 1200-2000€</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>ABO 900€ + 80€/MOIS</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>N8N · MAKE · CLAUDE CODE</li>
            </ul>
            <div
              className="mt-8 pt-6 border-t border-[#F0EDE5]/[0.08] text-[10px] uppercase tracking-[0.18em] text-[#F0EDE5]/60"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // PARTENARIAT_12_MOIS+
            </div>
          </motion.div>

          {/* COL 3 COACHING */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="p-8 md:p-10"
          >
            <div
              className="text-[11px] uppercase tracking-[0.18em] text-[#FF2D5F] mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [03] COACHING
            </div>
            <h3
              className="leading-[0.95] uppercase tracking-[-0.03em] text-[#F0EDE5] mb-8"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 3vw, 40px)' }}
            >
              200€<br />/ SESSION
            </h3>
            <div
              className="border border-[#F0EDE5]/[0.2] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#F0EDE5] inline-block mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              1-ON-1
            </div>
            <ul className="space-y-3 text-[12px] uppercase tracking-[0.06em] text-[#F0EDE5]/80" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>REFERENTS IA</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>MANAGERS</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>DIRIGEANTS</li>
              <li className="flex gap-3"><span className="text-[#FF2D5F]">▸</span>SUR MESURE · A LA DEMANDE</li>
            </ul>
            <div
              className="mt-8 pt-6 border-t border-[#F0EDE5]/[0.08] text-[10px] uppercase tracking-[0.18em] text-[#F0EDE5]/60"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // VEILLE_80€_MOIS
            </div>
          </motion.div>
        </div>
      </div>

      {/* Big CTA pink fullbleed */}
      <motion.a
        href="https://calendly.com/clem-pred/30min"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="group relative block bg-[#FF2D5F] hover:bg-[#F0EDE5] transition-colors duration-300"
      >
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.2em] text-black/70 mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              // BOOK_A_CALL.exec
            </div>
            <div
              className="leading-[0.88] tracking-[-0.04em] uppercase text-[#F0EDE5] group-hover:text-black transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(40px, 7vw, 80px)' }}
            >
              ▸ BOOK A CALL
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#F0EDE5] group-hover:text-black transition-colors">
            <span
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              30 MIN · FREE
            </span>
            <span
              className="leading-none"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(48px, 6vw, 80px)' }}
            >
              →
            </span>
          </div>
        </div>
      </motion.a>

      {/* Sticky CTA bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-[#FF2D5F]/40 md:hidden"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <a
          href="https://calendly.com/clem-pred/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-[#F0EDE5]"
        >
          <span>[ BOOK_A_CALL ]</span>
          <span className="text-[#FF2D5F]">▸ 30 MIN · FREE</span>
        </a>
      </div>
    </section>
  );
};

export default Pricing;
