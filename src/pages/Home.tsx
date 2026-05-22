import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import DualityScene from '../../components/DualityScene';
import ClientsLogos from '../../components/ClientsLogos';
import Philosophy from '../../components/Philosophy';
import Difference from '../../components/Difference';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';

interface HomeProps {
  customLogo: string | null;
  onUpdateLogo: (newLogoBase64: string) => void;
}

// Proposition X — Editorial Pure
// Narration : Hero éditorial → DualityScene (Formation/Conseil) → Philosophy → Difference → Clients → Pricing
const Home: React.FC<HomeProps> = ({ customLogo, onUpdateLogo }) => {
  return (
    <>
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
