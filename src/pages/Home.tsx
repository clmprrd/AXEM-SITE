import React from 'react';
import { MotionConfig } from 'framer-motion';
import { PlaygroundProvider } from '../sections/store';
import Nav from '../sections/Nav';
import HeroPlayground from '../sections/HeroPlayground';
import ROICalculator from '../sections/ROICalculator';
import ParcoursRail from '../sections/ParcoursRail';
import ScratchCases from '../sections/ScratchCases';
import MagneticLogos from '../sections/MagneticLogos';
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
            {/* CŒUR DE CONVERSION */}
            <HeroPlayground />
            <ROICalculator />
            <ParcoursRail />
            <ScratchCases />
            <MagneticLogos />
            <MiniQualifCTA />
          </main>
          <FooterEasterEgg />
        </div>
      </PlaygroundProvider>
    </MotionConfig>
  );
};

export default Home;
