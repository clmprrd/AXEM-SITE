import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// BRUTALIST SWISS — DUALITÉ data-sheet
const DualityScene: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const formations = [
    { code: 'F01', name: 'IA_ESSENTIELLE', price: '300€', dur: '1J' },
    { code: 'F02', name: 'PROMPT_PRO', price: '200€', dur: '½J' },
    { code: 'F03', name: 'MAITRISER_CLAUDE', price: '450€', dur: '1J' },
    { code: 'F04', name: 'METIERS', price: '400€', dur: '1J' },
    { code: 'F05', name: 'NO_CODE', price: '800€', dur: '2J' },
    { code: 'F06', name: 'AGENT_IA', price: '1250€', dur: '2J' },
    { code: 'F07', name: 'VIBE_CODING', price: '450€', dur: '1J' },
    { code: 'F08', name: 'AI_ACT', price: '250€', dur: '½J' },
    { code: 'F09', name: 'VEILLE', price: '80€', dur: '2H' },
    { code: 'F10', name: 'CREATION', price: '400€', dur: '1J' },
  ];

  const conseil = [
    { n: '01', name: 'AUDIT', desc: 'DIAGNOSTIC // CARTOGRAPHIE // MATURITY' },
    { n: '02', name: 'CONSEIL', desc: 'ROADMAP // OUTILS // ADOPTION' },
    { n: '03', name: 'DEPLOIEMENT', desc: 'N8N // MAKE // CLAUDE CODE' },
    { n: '04', name: 'COACHING', desc: 'REFERENTS // MANAGERS // EXECS' },
    { n: '05', name: 'PRODUCTION', desc: 'VIDEO // VOIX // VISUEL' },
    { n: '06', name: 'SUIVI', desc: 'MAINTENANCE // EVOLUTIONS' },
    { n: '07', name: 'AUTONOMIE', desc: '12 MOIS+ // KNOWLEDGE TRANSFER' },
  ];

  return (
    <section
      id="dualite"
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
            // AXEM_OFFER.json
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-[#F0EDE5]/50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            [ 03 // 06 ]
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:py-32">
        {/* HUGE caps title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="leading-[0.88] tracking-[-0.04em] uppercase mb-20"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(56px, 13vw, 200px)' }}
        >
          <span className="block text-[#F0EDE5]">TWO POLES.</span>
          <span className="inline-block mt-2 bg-[#FF2D5F] text-black px-4">ONE PARTNER.</span>
        </motion.h2>

        {/* 2 columns + central divider pink */}
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Central pink divider */}
          <div
            aria-hidden
            className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 bg-[#FF2D5F]"
            style={{ width: '3px' }}
          />

          {/* COL 1 FORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="pr-0 pb-16 md:pr-12 md:pb-0"
          >
            <div className="flex items-start justify-between mb-8 border-b border-[#F0EDE5]/[0.08] pb-6">
              <span
                className="text-[12px] uppercase tracking-[0.18em] text-[#FF2D5F]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                [01] FORMATION
              </span>
              <span
                className="border border-[#F0EDE5]/[0.2] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#F0EDE5]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                QUALIOPI ✓
              </span>
            </div>

            <h3
              className="leading-[0.9] tracking-[-0.04em] uppercase text-[#F0EDE5] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(32px, 4vw, 56px)' }}
            >
              10 MODULES.<br />3 LEVELS.<br />70% PRACTICE.
            </h3>

            <p
              className="text-[13px] uppercase tracking-[0.06em] text-[#F0EDE5]/60 mb-10"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              YOUR TEAMS OPERATIONAL FROM DAY+1.
            </p>

            <ul className="space-y-0 border-t border-[#F0EDE5]/[0.08]">
              {formations.map((f, i) => (
                <motion.li
                  key={f.code}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="grid grid-cols-12 items-center gap-3 border-b border-[#F0EDE5]/[0.06] py-4 group hover:bg-[#FF2D5F] hover:text-black transition-colors"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span className="col-span-2 text-[11px] uppercase tracking-[0.12em] text-[#FF2D5F] group-hover:text-black">
                    {f.code}
                  </span>
                  <span className="col-span-6 text-[12px] uppercase tracking-[0.08em]">
                    :: {f.name}
                  </span>
                  <span className="col-span-2 text-right text-[10px] uppercase tracking-[0.12em] opacity-60">
                    {f.dur}
                  </span>
                  <span className="col-span-2 text-right text-[12px] uppercase tracking-[0.08em]" style={{ fontWeight: 600 }}>
                    {f.price}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* COL 2 CONSEIL & PRODUCTION */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
            className="pt-16 md:pt-0 md:pl-12 border-t md:border-t-0 border-[#F0EDE5]/[0.08]"
          >
            <div className="flex items-start justify-between mb-8 border-b border-[#F0EDE5]/[0.08] pb-6">
              <span
                className="text-[12px] uppercase tracking-[0.18em] text-[#FF2D5F]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                [02] CONSEIL & PRODUCTION
              </span>
              <span
                className="border border-[#F0EDE5]/[0.2] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#F0EDE5]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                12 MOIS+
              </span>
            </div>

            <h3
              className="leading-[0.9] tracking-[-0.04em] uppercase text-[#F0EDE5] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(32px, 4vw, 56px)' }}
            >
              AUDIT.<br />DEPLOY.<br />OPERATE.
            </h3>

            <p
              className="text-[13px] uppercase tracking-[0.06em] text-[#F0EDE5]/60 mb-10"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              ONE INTERLOCUTEUR. END-TO-END.
            </p>

            <ul className="space-y-0 border-t border-[#F0EDE5]/[0.08]">
              {conseil.map((c, i) => (
                <motion.li
                  key={c.n}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="relative border-b border-[#F0EDE5]/[0.06] py-6 group overflow-hidden"
                >
                  {/* Big watermark number */}
                  <span
                    aria-hidden
                    className="absolute right-0 top-1/2 -translate-y-1/2 leading-none text-[#F0EDE5]/[0.04] pointer-events-none select-none"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 900,
                      fontSize: 'clamp(80px, 12vw, 200px)',
                    }}
                  >
                    {c.n}
                  </span>

                  <div className="relative flex items-baseline gap-4">
                    <span
                      className="text-[11px] uppercase tracking-[0.18em] text-[#FF2D5F]"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      [{c.n}]
                    </span>
                    <span
                      className="text-[#F0EDE5] uppercase tracking-[-0.02em]"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(20px, 2.4vw, 32px)' }}
                    >
                      {c.name}
                    </span>
                  </div>
                  <div
                    className="relative mt-2 text-[11px] uppercase tracking-[0.14em] text-[#F0EDE5]/60"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {c.desc}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom convergence */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mt-24 text-center"
        >
          <div
            className="text-[#FF2D5F] uppercase tracking-[0.2em]"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(16px, 2.4vw, 28px)', fontWeight: 600 }}
          >
            ===&gt; ONE INTERLOCUTOR &lt;===
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DualityScene;
