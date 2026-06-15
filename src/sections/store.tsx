import React from 'react';

// =====================================================================
// PLAYGROUND STORE — l'épine dorsale du « terrain de jeu ».
// Garde tout ce que le visiteur fabrique (secteur, équipe, heures,
// parcours configuré) → réutilisé par le récap (§10) et pré-remplit le
// mini-form (§11). Le calculateur ROI (§3) écrit ici ; tout le reste lit.
// =====================================================================

export type SectorKey =
  | 'btp' | 'juridique' | 'industrie' | 'sante' | 'services' | 'commerce' | 'autre';

export type Sector = {
  key: SectorKey;
  label: string;
  // coût horaire chargé moyen (€) — calage business case réaliste FR
  hourlyCost: number;
  // part automatisable des heures répétitives (0–1)
  automatable: number;
  emoji: string;
};

export const SECTORS: Sector[] = [
  { key: 'btp',        label: 'BTP & Construction',     hourlyCost: 42, automatable: 0.72, emoji: '🏗️' },
  { key: 'juridique',  label: 'Juridique & Admin',      hourlyCost: 48, automatable: 0.80, emoji: '⚖️' },
  { key: 'industrie',  label: 'Industrie & Production',  hourlyCost: 45, automatable: 0.75, emoji: '🏭' },
  { key: 'sante',      label: 'Santé & Médico-social',   hourlyCost: 44, automatable: 0.68, emoji: '🩺' },
  { key: 'services',   label: 'Services & Conseil',      hourlyCost: 55, automatable: 0.78, emoji: '💼' },
  { key: 'commerce',   label: 'Commerce & Retail',       hourlyCost: 38, automatable: 0.70, emoji: '🛒' },
  { key: 'autre',      label: 'Autre secteur',           hourlyCost: 46, automatable: 0.74, emoji: '✨' },
];

export const sectorByKey = (k: SectorKey): Sector =>
  SECTORS.find((s) => s.key === k) ?? SECTORS[SECTORS.length - 1];

// parcours assemblé par le configurateur (§6)
export type PathBrick = { id: string; label: string };

export type Priority = 'former' | 'automatiser' | 'conseil' | 'produire';
export const PRIORITIES: { key: Priority; label: string }[] = [
  { key: 'former',      label: 'Former mes équipes' },
  { key: 'automatiser', label: 'Automatiser mes tâches' },
  { key: 'conseil',     label: 'Cadrer ma stratégie IA' },
  { key: 'produire',    label: 'Produire un outil IA sur-mesure' },
];

export type PlaygroundState = {
  // §3 calculateur
  sector: SectorKey;
  teamSize: number;        // personnes concernées
  hoursPerWeek: number;    // heures répétitives / sem / pers
  locked: boolean;         // a verrouillé son chiffre
  // dérivés exposés (calculés dans le provider, lus partout)
  hoursSavedMonth: number;
  euroSavedYear: number;
  roi: number;
  // §6 configurateur
  pathBricks: PathBrick[];
  priority: Priority | null;
};

type Ctx = PlaygroundState & {
  setSector: (s: SectorKey) => void;
  setTeamSize: (n: number) => void;
  setHoursPerWeek: (n: number) => void;
  lock: () => void;
  setPath: (b: PathBrick[], p: Priority | null) => void;
};

const PlaygroundContext = React.createContext<Ctx | null>(null);

// Formules du business case — calibrées CRÉDIBLES, jamais en contradiction
// avec le « 159 % de ROI médian » affiché ailleurs sur le site.
//
// 1) Heures récupérables/mois = équipe × heures/sem × 4.33 × part automatisable
//    (inchangé — cohérent avec la promesse du hero).
// 2) Valeur du temps libéré/an = heures/mois × 12 × coût horaire × COEF réaliste.
//    On ne valorise PAS 100 % des heures au taux plein toute l'année : un
//    coefficient de réalisation conservateur (0.4) évite les chiffres gonflés
//    (ex. 178 k€ → ~71 k€ pour 8 pers × 10 h). Arrondi propre au millier (k€).
// 3) ROI = ancre documentée FIXE de 159 % (médian constaté sur nos missions),
//    NON piloté par les curseurs → fini le 774 % incohérent.
export const ROI_MEDIAN = 159; // % — médian documenté, identique au reste du site
const REALIZATION_COEF = 0.4;  // part réellement convertible en valeur (conservateur)

export function computeDerived(sector: Sector, teamSize: number, hoursPerWeek: number) {
  const hoursSavedMonth = Math.round(teamSize * hoursPerWeek * 4.33 * sector.automatable);
  const euroRaw = hoursSavedMonth * 12 * sector.hourlyCost * REALIZATION_COEF;
  // arrondi propre au millier (k€) pour un chiffre lisible et crédible
  const euroSavedYear = Math.round(euroRaw / 1000) * 1000;
  // ROI = ancre médiane fixe (pas de calcul délirant piloté par les curseurs)
  const roi = ROI_MEDIAN;
  return { hoursSavedMonth, euroSavedYear, roi };
}

export const PlaygroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sector, setSector] = React.useState<SectorKey>('services');
  const [teamSize, setTeamSize] = React.useState(8);
  const [hoursPerWeek, setHoursPerWeek] = React.useState(10);
  const [locked, setLocked] = React.useState(false);
  const [pathBricks, setPathBricks] = React.useState<PathBrick[]>([]);
  const [priority, setPriority] = React.useState<Priority | null>(null);

  const derived = React.useMemo(
    () => computeDerived(sectorByKey(sector), teamSize, hoursPerWeek),
    [sector, teamSize, hoursPerWeek],
  );

  const setPath = React.useCallback((b: PathBrick[], p: Priority | null) => {
    setPathBricks(b);
    setPriority(p);
  }, []);

  const value: Ctx = {
    sector, teamSize, hoursPerWeek, locked,
    ...derived,
    pathBricks, priority,
    setSector: (s) => { setSector(s); },
    setTeamSize,
    setHoursPerWeek,
    lock: () => setLocked(true),
    setPath,
  };

  return <PlaygroundContext.Provider value={value}>{children}</PlaygroundContext.Provider>;
};

export function usePlayground(): Ctx {
  const ctx = React.useContext(PlaygroundContext);
  if (!ctx) throw new Error('usePlayground must be used within PlaygroundProvider');
  return ctx;
}

// helpers de formatage partagés
export const fmtEuro = (n: number) =>
  n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €';
export const fmtNum = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

// petit util scroll-to avec offset nav
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
