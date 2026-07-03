import React from 'react';
import Home from './src/pages/Home';
import MagneticCursor from './src/ui/MagneticCursor';

// Site AXEM IA — V4 kinétique éditoriale, page unique.
// Curseur magnétique global monté au-dessus de la page (no-op tactile/reduced-motion).
const App: React.FC = () => (
  <>
    <Home />
    <MagneticCursor />
  </>
);

export default App;
