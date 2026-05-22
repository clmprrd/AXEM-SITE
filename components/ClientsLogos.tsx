import React from 'react';
import { motion } from 'framer-motion';

// Proposition X — Clients & Partenaires (Editorial)
// Style éditorial : 2 colonnes claires (CLIENTS / PARTENAIRES FORMATION),
// avec marquee infini en bas pour les cas clients sectoriels
const ClientsLogos: React.FC = () => {
  const clients = ['Carrefour', 'Blackfin', 'Avantis', 'KIT France', 'Espace 2', 'Socos', 'Gravotech'];
  const partners = ['myconnecting', 'synapse ia', 'ASphere', 'AI sisters', 'SENZA', 'Cegos'];

  const sectors = [
    'Éditeur logiciel · Médico-social',
    'BTP · Rénovation & Structure',
    'Administration judiciaire',
    'Adhésifs · Aéronautique & Ferroviaire',
    'Promotion immobilière',
    'Industrie · Manufacturing',
    'Conseil & Expertise',
    'Grande distribution',
  ];

  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#050505] py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
              <span className="h-2 w-2 bg-[#00FA9A]" />
              Nos références
            </div>
            <h2 className="mt-4 font-display text-4xl font-light tracking-[-0.03em] text-white md:text-6xl">
              Ils nous font <span className="font-playfair italic text-[#00FA9A]">confiance</span>.
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <div className="font-display text-5xl font-light text-[#00FA9A]">5</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              missions clients · résultats mesurés
            </div>
          </div>
        </div>

        {/* Two columns : Clients / Partenaires */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          {/* Clients */}
          <div>
            <div className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
              <span className="h-px w-8 bg-[#00FA9A]" />
              Clients
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
              {clients.map((c, i) => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  whileHover={{ y: -3, borderColor: 'rgba(0,250,154,0.3)' }}
                  className="group flex h-20 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4 transition-colors"
                >
                  <span className="font-display text-xl font-light text-white/85 transition-colors group-hover:text-white md:text-2xl">
                    {c}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Partenaires */}
          <div>
            <div className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#00FA9A]">
              <span className="h-px w-8 bg-[#00FA9A]" />
              Organismes de formation partenaires
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
              {partners.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  whileHover={{ y: -3, borderColor: 'rgba(0,250,154,0.3)' }}
                  className="group flex h-20 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4 transition-colors"
                >
                  <span className="font-display text-xl font-light text-white/85 transition-colors group-hover:text-white md:text-2xl">
                    {p}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom : marquee infini des secteurs */}
        <div className="mt-20 border-t border-white/[0.06] pt-12">
          <div className="mb-6 text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-500">
            5 missions · 5 secteurs · des résultats mesurés
          </div>
          <div
            className="relative overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <motion.div
              className="flex w-max gap-10 py-3"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 38, ease: 'linear', repeat: Infinity }}
            >
              {[...sectors, ...sectors].map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="flex shrink-0 items-center gap-4 whitespace-nowrap font-playfair text-2xl italic text-neutral-400/70"
                >
                  <span className="h-1.5 w-1.5 bg-[#00FA9A]" />
                  {s}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Qualiopi badge */}
        <div className="mt-20 flex items-center justify-center gap-6 border-t border-white/[0.06] pt-12">
          <div className="text-right">
            <div className="font-display text-3xl font-light text-white md:text-4xl">
              <span className="font-playfair italic text-[#00FA9A]">Qualiopi</span> processus certifié
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
              Formations finançables OPCO · IZY for pro
            </div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇫🇷</span>
            <span className="font-display text-sm font-light text-white">République Française</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsLogos;
