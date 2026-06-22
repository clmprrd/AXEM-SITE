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
        /* SYSTÈME « monopo saigon » — monochrome éditorial strict.
           AUCUN accent chromatique. Le contraste blanc↔noir EST le rythme.
           paper #ffffff · ink #181818 · carbon #181818 · ash #6d6d6d ·
           smoke #9a9a9a · graphite #636363 (utilitaire only). */
        paper: '#ffffff',        /* frames blanches éditoriales */
        ink: '#000000',          /* noir pur (frames noires immersives) */
        carbon: '#181818',       /* noir éditorial (texte sur blanc / surfaces) */
        ash: '#6d6d6d',          /* gris secondaire */
        smoke: '#9a9a9a',        /* gris tertiaire */
        graphite: '#636363',     /* utilitaire (boutons utilitaires only) */

        /* alias rétro-compat pour ne pas casser les classes héritées :
           tout le vocabulaire « morningside » est remappé sur le monochrome. */
        'ink-2': '#0a0a0a',
        'ink-3': '#101010',
        'ink-4': '#222222',
        cream: '#ffffff',        /* (sur noir) blanc */
        'cream-soft': '#cfcfcf',
        'cream-dim': '#9a9a9a',
        ivory: '#f4f4f4',
        green: '#ffffff',        /* ex-accent → neutralisé en blanc */
        'green-deep': '#cfcfcf',
        cyan: '#9a9a9a',         /* ex-accent → gris */
        mint: '#cfcfcf',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        satoshi: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
