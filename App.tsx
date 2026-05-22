import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './src/pages/Home';
import Realisations from './src/pages/Realisations';
import defaultContent from './src/data/defaultContent';

const App: React.FC = () => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  // --- SYNC LOGIC (The Magic Part) ---
  useEffect(() => {
    const checkSync = () => {
      // 1. Get the timestamp from the code file (what you pushed to git)
      const fileTimestamp = (defaultContent as any).config_timestamp || 0;

      // 2. Get the timestamp from the browser's local memory
      const localTimestamp = Number(localStorage.getItem('config_timestamp') || 0);

      // 3. If the code file is NEWER than local memory, it means your associate
      //    pulled new changes. We must overwrite local memory with the file data.
      if (fileTimestamp > localTimestamp) {
        console.log('📥 New update found in code! Syncing...');

        Object.entries(defaultContent).forEach(([key, value]) => {
          if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
          } else {
            localStorage.setItem(key, String(value));
          }
        });

        // Reload the logo specifically
        const logo = localStorage.getItem('axem_custom_logo');
        if (logo) setCustomLogo(logo);
      } else {
        // Load Logo normally
        const savedLogo = localStorage.getItem('axem_custom_logo');
        if (savedLogo) {
          setCustomLogo(savedLogo);
        }
      }
    };

    checkSync();
  }, []);

  const handleUpdateLogo = (newLogoBase64: string) => {
    setCustomLogo(newLogoBase64);
    localStorage.setItem('axem_custom_logo', newLogoBase64);
  };

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#00FA9A]/30 text-white bg-[#050505] relative">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home customLogo={customLogo} onUpdateLogo={handleUpdateLogo} />}
          />
          <Route
            path="/realisations"
            element={<Realisations customLogo={customLogo} onUpdateLogo={handleUpdateLogo} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
