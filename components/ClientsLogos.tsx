import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// BRUTALIST SWISS — RÉFÉRENCES data
const ClientsLogos: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const clients = ['CARREFOUR', 'BLACKFIN', 'AVANTIS', 'KIT FRANCE', 'ESPACE 2', 'SOCOS', 'GRAVOTECH'];

  const sectors = [
    { t: 'EDITEUR_LOGICIEL', m: '+38% PROD' },
    { t: 'BTP_RENOVATION', m: '5J → 1J' },
    { t: 'ADMIN_JUDICIAIRE', m: '70% AUTO' },
    { t: 'INDUSTRIE', m: '2.4× ROI' },
  ];

  const marqueeItems = [
    'CARREFOUR', 'BLACKFIN CAPITAL', 'AVANTIS', 'KIT FRANCE',
    'ESPACE 2', 'SOCOS SERVICES', 'GRAVOTECH',
  ];

  return (
    <section
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
            // TRUSTED_BY.list
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-[#F0EDE5]/50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            [ 05 // 06 ]
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:py-32">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="leading-[0.88] tracking-[-0.04em] uppercase mb-16 text-[#F0EDE5]"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(40px, 8vw, 100px)' }}
        >
          THEY SHIPPED<br />WITH US<span className="text-[#FF2D5F]">.</span>
        </motion.h2>

        {/* Grid 4 cols clients */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#F0EDE5]/[0.08] mb-20">
          {clients.slice(0, 8).map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group relative h-32 md:h-40 bg-black flex items-center justify-center px-4 hover:bg-[#FF2D5F] transition-colors duration-300"
            >
              <span
                className="text-[#F0EDE5] group-hover:text-black uppercase tracking-[-0.02em] text-center"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(16px, 1.8vw, 22px)' }}
              >
                {c}
              </span>
              <span
                className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.18em] text-[#FF2D5F] group-hover:text-black/70"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                [{String(i + 1).padStart(2, '0')}]
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marquee on pink */}
      <div className="relative bg-[#FF2D5F] py-6 overflow-hidden group">
        <motion.div
          className="flex w-max gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          style={{ animationPlayState: 'running' }}
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((s, i) => (
            <span
              key={`${s}-${i}`}
              className="flex items-center gap-6 text-[#F0EDE5] uppercase tracking-[-0.02em]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4vw, 56px)' }}
            >
              <span className="text-[#F0EDE5]">✦</span>
              {s}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Sectors + metrics */}
      <div className="relative mx-auto max-w-[1400px] px-6 py-20">
        <div
          className="mb-10 text-[11px] uppercase tracking-[0.18em] text-[#FF2D5F]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          // SECTORS.csv
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[#F0EDE5]/[0.08]">
          {sectors.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`p-6 md:p-8 border-b border-[#F0EDE5]/[0.08] ${
                i % 4 !== 3 ? 'md:border-r border-[#F0EDE5]/[0.08]' : ''
              } ${i % 2 !== 1 ? 'border-r md:border-r border-[#F0EDE5]/[0.08]' : ''}`}
            >
              <div
                className="text-[10px] uppercase tracking-[0.2em] text-[#F0EDE5]/50 mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                [{String(i + 1).padStart(2, '0')}]
              </div>
              <div
                className="text-[11px] uppercase tracking-[0.14em] text-[#F0EDE5]/80 mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {s.t}
              </div>
              <div
                className="leading-none text-[#FF2D5F] uppercase tracking-[-0.03em]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 3.4vw, 48px)' }}
              >
                {s.m}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Qualiopi bloc */}
      <div className="relative mx-auto max-w-[1400px] px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="border border-[#FF2D5F] bg-black p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.18em] text-[#FF2D5F] mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [ QUALIOPI_CERTIFIED ]
            </div>
            <div
              className="leading-[0.95] uppercase tracking-[-0.03em] text-[#F0EDE5]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 3.6vw, 48px)' }}
            >
              FORMATIONS FINANÇABLES
            </div>
          </div>
          <div
            className="text-[11px] uppercase tracking-[0.18em] text-[#F0EDE5]/60 md:text-right"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            OPCO // IZY FOR PRO<br />REPUBLIQUE FRANÇAISE
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsLogos;
