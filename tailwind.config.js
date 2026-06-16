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
        /* PEAU MORNINGSIDE — near-black #080808, sections sombres dark-green #0f1c1c,
           accent vert signature #0cc481 (UNIQUE accent), ivory #edece4 pour le clair. */
        ink: '#080808',          /* fond primaire near-black */
        'ink-2': '#0f1c1c',      /* section sombre alternée (dark-green) */
        'ink-3': '#0b1413',      /* surface sombre alternée */
        'ink-4': '#222222',      /* neutre (bordures / surfaces hautes) */
        cream: '#ffffff',        /* texte principal (blanc) */
        'cream-soft': '#cccccc', /* texte secondaire */
        'cream-dim': '#888888',  /* texte tertiaire */
        ivory: '#edece4',        /* clair secondaire (sections claires) */
        green: '#0cc481',        /* accent vert signature (UNIQUE accent) */
        'green-deep': '#0aa86e', /* vert profond (hover) */
        cyan: '#0cc481',         /* alias vert (ex-cyan remappé sur l'accent unique) */
        mint: '#3fe0a8',         /* vert clair */
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
