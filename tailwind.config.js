/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './src/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* DA AUROS — profondeur par TONS PURS (zéro ombre). Canvas teal très sombre,
           cartes plus sombres encore, surface « élevée » par teal plus clair.
           Accent teal rationné, lavande = bordure rare. */
        ink: '#012624',          /* canvas — teal très sombre */
        'ink-2': '#011d1c',      /* cartes — plus sombre que le canvas */
        'ink-3': '#011514',      /* surface la plus basse */
        'ink-4': '#003734',      /* surface ÉLEVÉE (tons, pas ombres) */
        cream: '#ffffff',        /* titres — blanc pur */
        'cream-soft': '#bbc7c6', /* corps — teal-gris désaturé */
        'cream-dim': '#7e918f',  /* texte tertiaire */
        ivory: '#edfffe',        /* highlights */
        highlight: '#edfffe',    /* highlights (alias explicite) */
        green: '#00827c',        /* accent teal signature (rationné) */
        'green-deep': '#016b66', /* teal profond (hover) */
        cyan: '#cbfffc',         /* teal clair / fin de gradient CTA */
        mint: '#7fe9e2',         /* teal clair intermédiaire */
        lavender: '#fde9ff',     /* lavande — bordure/ghost rare */
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        satoshi: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
