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
        /* BLEU NUIT / NAVY GLASS — base plus profonde/cinématique (Limitless black space), accents bleu électrique + cyan */
        ink: '#060912',          /* fond navy de base (bleu nuit très sombre) */
        'ink-2': '#0A0F1E',      /* surface navy (cartes) */
        'ink-3': '#0C1322',      /* surface navy alternée */
        'ink-4': '#182034',      /* gris-bleu (bordures / surfaces hautes) */
        cream: '#EAF0FF',        /* texte principal (blanc cassé bleuté) */
        'cream-soft': '#9FB0CE', /* texte secondaire (gris-bleu clair) */
        'cream-dim': '#6E7FA0',  /* texte tertiaire */
        green: '#5B8CFF',        /* accent principal (bleu électrique) */
        'green-deep': '#3B6FE0', /* accent profond (bleu) */
        cyan: '#38BDF8',         /* accent secondaire (cyan) */
        mint: '#5EEAD4',         /* touche mint */
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        satoshi: ['Satoshi', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
