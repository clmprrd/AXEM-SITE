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
        /* DA AUROS — « LE RÉSEAU VIVANT ». Canvas teal profond #012624,
           cartes #011d1c, surfaces élevées #003734. Accent teal→cyan signature.
           Profondeur par TONS, jamais par ombres portées. */
        ink: '#012624',          /* canvas teal profond (fond primaire) */
        'ink-2': '#011d1c',      /* cartes (section sombre alternée) */
        'ink-3': '#022a28',      /* surface alternée */
        'ink-4': '#003734',      /* surface élevée (bordures / surfaces hautes) */
        cream: '#ffffff',        /* titres (blanc) */
        'cream-soft': '#bbc7c6', /* corps */
        'cream-dim': '#7e918f',  /* texte tertiaire */
        ivory: '#edfffe',        /* highlights */
        green: '#00827c',        /* accent teal signature (base CTA) */
        'green-deep': '#016b66', /* teal profond (hover) */
        cyan: '#cbfffc',         /* cyan clair Auros (highlight d'accent) */
        mint: '#3fd8cf',         /* teal clair médian */
        lavande: '#fde9ff',      /* lavande (bordure rare) */
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        satoshi: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
