import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import Philosophy from '../../components/Philosophy';
import Difference from '../../components/Difference';
import Problem from '../../components/Problem';
import Expertise from '../../components/Expertise';
import ServicesCatalog from '../../components/ServicesCatalog';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';

interface HomeProps {
  customLogo: string | null;
  onUpdateLogo: (newLogoBase64: string) => void;
}

const Home: React.FC<HomeProps> = ({ customLogo, onUpdateLogo }) => {
  return (
    <>
      <Navbar customLogo={customLogo} onUpdateLogo={onUpdateLogo} />
      <main>
        <Hero />
        <Philosophy />
        <Difference />
        <Problem />
        <Expertise />
        <ServicesCatalog />
        <Pricing />
      </main>
      <Footer customLogo={customLogo} />
    </>
  );
};

export default Home;
