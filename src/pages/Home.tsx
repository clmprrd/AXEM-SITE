import React from 'react';
import { MotionConfig } from 'framer-motion';
import { PlaygroundProvider } from '../sections/store';
import Nav from '../sections/Nav';
import HeroPlayground from '../sections/HeroPlayground';
import DuoLive from '../sections/DuoLive';
import ROICalculator from '../sections/ROICalculator';
import ParcoursRail from '../sections/ParcoursRail';
import ScratchCases from '../sections/ScratchCases';
import ParcoursConfigurator from '../sections/ParcoursConfigurator';
import FormationFlip from '../sections/FormationFlip';
import MagneticLogos from '../sections/MagneticLogos';
import ComparatorEuxNous from '../sections/ComparatorEuxNous';
import RecapCard from '../sections/RecapCard';
import MiniQualifCTA from '../sections/MiniQualifCTA';
import FooterEasterEgg from '../sections/FooterEasterEgg';

// =====================================================================
// AXEM IA — « LE TERRAIN DE JEU »
// Le visiteur manipule et FABRIQUE sa propre preuve : curseur hero →
// calculateur ROI (facture inversée) → parcours rail → cas à révéler →
// logos magnétiques → mini-form qualif pré-rempli → Calendly.
//
// STORE PARTAGÉ (PlaygroundProvider) : les saisies (secteur, équipe, heures,
// parcours configuré) vivent dans un Context unique. Le calculateur ÉCRIT ;
// le récap et le mini-form LISENT et pré-remplissent. Un seul flux de preuve.
//
// DA navy conservée (Grainient, Satoshi, Instrument Serif, boutons éditoriaux,
// spring 320/60/1). transform/opacity only · reducedMotion="user" ·
// footer-reveal rideau conservé.
// =====================================================================

const Home: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <PlaygroundProvider>
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <div className="has-footer-reveal min-h-screen text-cream">
          <Nav />
          <main id="contenu" className="reveal-main">
            {/* ÉCHELLE D'ENGAGEMENT → CONVERSION (12 sections) */}
            <HeroPlayground />     {/* 1 — curseur jouable = l'accroche */}
            <DuoLive />            {/* 2 — qui on est, odomètre */}
            <ROICalculator />      {/* 3 ⭐ — facture inversée (le wow) */}
            <ParcoursRail />       {/* 4 — rail draggable 7 étapes */}
            <ScratchCases />       {/* 5 — cas à révéler */}
            <ParcoursConfigurator />{/* 6 — assemble son parcours → store */}
            <FormationFlip />      {/* 7 — 10 tuiles flip + démo n8n */}
            <MagneticLogos />      {/* 8 — logos magnétiques */}
            <ComparatorEuxNous />  {/* 9 — séparateur draggable Eux/Nous */}
            <RecapCard />          {/* 10 — récap auto-généré (store) */}
            <MiniQualifCTA />      {/* 11 — mini-form pré-rempli → Calendly */}
          </main>
          <FooterEasterEgg />
        </div>
      </PlaygroundProvider>
    </MotionConfig>
  );
};

export default Home;
