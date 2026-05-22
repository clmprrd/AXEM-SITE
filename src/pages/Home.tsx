import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import DualityScene from '../../components/DualityScene';
import ClientsLogos from '../../components/ClientsLogos';
import Philosophy from '../../components/Philosophy';
import Difference from '../../components/Difference';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import { ScrollProgress, SmartCursor } from '../../components/ui/InteractiveLayer';

interface HomeProps {
  customLogo: string | null;
  onUpdateLogo: (newLogoBase64: string) => void;
}

// === FINAL AXEM HOME ===
// DA Linear (grid/halo/magnetic/marquee) en couleurs AXEM officielles + dualité scénarisée
// + ScrollProgress vert globale + SmartCursor avec trail
const Home: React.FC<HomeProps> = ({ customLogo, onUpdateLogo }) => {
  return (
    <>
      <SmartCursor />
      <ScrollProgress />
      <Navbar customLogo={customLogo} onUpdateLogo={onUpdateLogo} />
      <main>
        <Hero />
        <DualityScene />
        <Philosophy />
        <Difference />
        <ClientsLogos />
        <Pricing />
      </main>
      <Footer customLogo={customLogo} />
    </>
  );
};

export default Home;
