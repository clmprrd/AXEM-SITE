import React from 'react';
import ParticleSphere from './ParticleSphere';

// =====================================================================
// SPHERE DIVIDER — la sphère de particules Auros en SÉPARATEUR de sections.
// Petite, centrée, avec une fine ligne-réseau de part et d'autre (motif
// « réseau vivant »). Élément-ancre récurrent qui rythme le scroll.
// Léger : la sphère est cappée et se met en pause hors-vue (cf. ParticleSphere).
// =====================================================================

export const SphereDivider: React.FC<{ label?: string }> = ({ label }) => (
  <div className="section-clip relative flex items-center justify-center py-16 md:py-24" aria-hidden>
    {/* ligne-réseau horizontale fine, teintée, qui « passe » à travers la sphère */}
    <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(63,216,207,0.22) 35%, rgba(63,216,207,0.22) 65%, transparent)' }} />
    <div className="relative flex flex-col items-center">
      <ParticleSphere className="h-40 w-40 md:h-52 md:w-52" radius={0.34} count={220} spin={0.16} />
      {label && (
        <span className="mt-2 text-[10px] font-satoshi font-bold uppercase tracking-[0.28em] text-cream-dim">
          {label}
        </span>
      )}
    </div>
  </div>
);

export default SphereDivider;
