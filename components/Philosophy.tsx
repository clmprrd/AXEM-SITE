import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// BRUTALIST SWISS — FOUNDERS data-dump
// Black + hot pink + Inter/JetBrains Mono
const Philosophy: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const clementImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg";
  const alexisImage = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png";

  const founders = [
    {
      img: clementImage,
      bracket: '[ CLEMENT_PREDO ]',
      name: 'CLEMENT',
      surname: 'PREDO',
      school: 'ESSEC // STRATEGY',
      bullets: [
        '3 YEARS OF AI FIELDWORK',
        'TRAININGS · CONSULTING · AUTOMATION',
        'AUDIT & STRATEGY MISSIONS LEAD',
      ],
      stat: '+40K',
      statLabel: 'LINKEDIN FOLLOWERS',
      linkedin: 'https://www.linkedin.com/in/cl%C3%A9ment-predo-426133196/',
    },
    {
      img: alexisImage,
      bracket: '[ ALEXIS_ZEITOUN ]',
      name: 'ALEXIS',
      surname: 'ZEITOUN',
      school: 'INSTITUT POLYTECHNIQUE DE PARIS // SYSTEMS',
      bullets: [
        '3 YEARS OF AI FIELDWORK',
        'FIELD DEPLOYMENT · TEAMS & EXECS',
        'FINANCIAL SECTOR · PRIVATE EQUITY',
      ],
      stat: '+15K',
      statLabel: 'LINKEDIN FOLLOWERS',
      linkedin: 'https://www.linkedin.com/in/alexiszeitoun/',
    },
  ];

  return (
    <section
      id="qui-sommes-nous"
      className="relative border-t border-[#F0EDE5]/[0.08] bg-black"
      style={{ fontFamily: "'Inter', sans-serif", color: '#F0EDE5' }}
    >
      {/* Subtle grid bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F0EDE5 1px, transparent 1px)',
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
            // FOUNDERS_2026.txt
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-[#F0EDE5]/50"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            [ 02 // 06 ]
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:py-32">
        {/* HUGE caps title */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="leading-[0.88] tracking-[-0.04em] uppercase"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(56px, 14vw, 220px)' }}
          >
            <span className="block text-[#F0EDE5]">TWO HUMANS.</span>
            <span className="inline-block mt-2 bg-[#FF2D5F] text-black px-4">ONE STACK.</span>
          </motion.h2>
        </div>

        {/* 2 columns w/ vertical divider */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {founders.map((f, idx) => (
            <motion.article
              key={f.surname}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.16, ease: [0.2, 0.8, 0.2, 1] }}
              className={
                idx === 0
                  ? 'pr-0 pb-12 md:pr-12 md:pb-0'
                  : 'pt-12 md:pt-0 md:pl-12 border-t md:border-t-0 md:border-l border-[#F0EDE5]/[0.08]'
              }
            >
              {/* Bracket mono pink */}
              <div
                className="text-[12px] uppercase tracking-[0.18em] text-[#FF2D5F] mb-6"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {f.bracket}
              </div>

              {/* Photo bichromie */}
              <div className="relative mb-8 w-full max-w-[280px]">
                <img
                  src={f.img}
                  alt={`${f.name} ${f.surname}`}
                  className="w-full h-auto block"
                  style={{ filter: 'grayscale(1) contrast(1.2)' }}
                />
              </div>

              {/* Name HUGE Inter 900 */}
              <h3
                className="leading-[0.9] tracking-[-0.04em] uppercase text-[#F0EDE5] mb-4"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(40px, 6vw, 64px)' }}
              >
                {f.name}<br />{f.surname}
              </h3>

              {/* School mono caps */}
              <div
                className="text-[11px] uppercase tracking-[0.18em] text-[#F0EDE5]/60 mb-8"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {f.school}
              </div>

              {/* Bullets */}
              <ul className="space-y-3 mb-10 border-t border-[#F0EDE5]/[0.08] pt-6">
                {f.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-[13px] uppercase tracking-[0.06em] text-[#F0EDE5]/80"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    <span className="text-[#FF2D5F]">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Stat HUGE */}
              <div className="border-t border-[#F0EDE5]/[0.08] pt-6 flex items-baseline gap-4">
                <span
                  className="leading-none text-[#F0EDE5]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 'clamp(56px, 8vw, 80px)' }}
                >
                  {f.stat}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.2em] text-[#F0EDE5]/50"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {f.statLabel}
                </span>
              </div>

              {/* LinkedIn square button */}
              <a
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 border border-[#F0EDE5]/[0.2] px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-[#F0EDE5] transition-colors hover:bg-[#FF2D5F] hover:text-[#F0EDE5] hover:border-[#FF2D5F]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span>LINKEDIN</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </a>
            </motion.article>
          ))}
        </div>

        {/* Quote bloc pink */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-24 bg-[#FF2D5F] px-6 py-16 md:py-24"
        >
          <div
            className="text-[10px] uppercase tracking-[0.3em] text-black/80 mb-6"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            // QUOTE.txt
          </div>
          <p
            className="leading-[0.9] tracking-[-0.04em] uppercase text-[#F0EDE5]"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(40px, 10vw, 120px)',
            }}
          >
            "WE SHIP.<br />WE DON'T PITCH."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Philosophy;
