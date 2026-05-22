import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// BRUTALIST SWISS — 5 RAISONS manifesto
const Difference: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const reasons = [
    {
      n: '01',
      t: 'PARTNER FOR LIFE',
      keyword: '12 MOIS+',
      d: 'FROM AUDIT TO AUTONOMY. WE DO NOT VANISH AFTER KICKOFF. WE STAY ENGAGED.',
    },
    {
      n: '02',
      t: '70% PRACTICE',
      keyword: 'DAY+1 READY',
      d: 'EVERY MODULE PRODUCES A REAL DELIVERABLE. NO THEORY, ONLY OUTPUT.',
    },
    {
      n: '03',
      t: 'MEASURED ROI',
      keyword: '5 CASE STUDIES',
      d: 'DOCUMENTED RESULTS ON EVERY MISSION. CONCRETE DELIVERABLES, NOT SLIDES.',
    },
    {
      n: '04',
      t: 'ALWAYS UP-TO-DATE',
      keyword: 'CLAUDE 4.6 // GPT-5.2 // GEMINI 3',
      d: 'TOOLS AND METHODS 2025/2026. THE FIELD MOVES FAST, SO DO WE.',
    },
    {
      n: '05',
      t: 'ONE INTERLOCUTOR',
      keyword: 'CLEMENT OR ALEXIS',
      d: 'FROM DIAGNOSIS TO DEPLOYMENT. NO HANDOFFS LOST BETWEEN TEAMS.',
    },
  ];

  return (
    <section
      className="relative border-t border-[#F0EDE5]/[0.08] bg-black"
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
            // MANIFESTO.md
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-[#F0EDE5]/50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            [ 04 // 06 ]
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-24 md:pt-32">
        {/* HUGE caps WHY AXEM */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="leading-[0.88] tracking-[-0.04em] uppercase mb-16"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(72px, 16vw, 220px)' }}
        >
          <span className="text-[#F0EDE5]">WHY AXEM</span>
          <span className="text-[#FF2D5F]">.</span>
        </motion.h2>
      </div>

      {/* 5 full-bleed blocks */}
      <div className="relative">
        {reasons.map((r, i) => (
          <motion.div
            key={r.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
            className="group relative border-t border-[#F0EDE5]/[0.08] transition-colors duration-300 hover:bg-[#FF2D5F]"
          >
            <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-20 grid grid-cols-12 gap-6 items-center">
              {/* Outline number HUGE */}
              <div className="col-span-12 md:col-span-3">
                <span
                  className="block leading-[0.8] uppercase"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(80px, 12vw, 180px)',
                    WebkitTextStroke: '2px #F0EDE5',
                    color: 'transparent',
                  }}
                >
                  {r.n}
                </span>
              </div>

              {/* Title */}
              <div className="col-span-12 md:col-span-5">
                <h3
                  className="leading-[0.95] tracking-[-0.03em] uppercase text-[#F0EDE5] group-hover:text-black transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 4vw, 48px)' }}
                >
                  {r.t}
                </h3>
                <div
                  className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#FF2D5F] group-hover:text-black/80 transition-colors"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  [ {r.keyword} ]
                </div>
              </div>

              {/* Description */}
              <div className="col-span-12 md:col-span-4">
                <p
                  className="text-[13px] uppercase tracking-[0.08em] leading-[1.6] text-[#F0EDE5]/80 group-hover:text-black transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  {r.d}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Last divider */}
        <div className="border-t border-[#F0EDE5]/[0.08]" />
      </div>
    </section>
  );
};

export default Difference;
