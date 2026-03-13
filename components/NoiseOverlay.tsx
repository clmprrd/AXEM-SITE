import React from 'react';

const NoiseOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="noise-overlay absolute inset-0 z-20 mix-blend-overlay"></div>
      <div className="absolute -top-[10%] -left-[10%] w-[140%] h-[80%] bg-gradient-to-r from-neutral-800 via-neutral-900 to-[#050505] blur-[60px] rounded-[100%] rotate-12 opacity-80 z-0 transform-gpu"></div>
      <div className="blur-[80px] z-1 bg-white opacity-5 w-[80%] h-[40%] absolute top-[10%] left-[10%] transform-gpu"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#00FA9A]/10 blur-[80px] rounded-full z-0 transform-gpu"></div>
    </div>
  );
};

export default NoiseOverlay;