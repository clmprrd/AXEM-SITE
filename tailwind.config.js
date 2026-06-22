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
        /* =====================================================================
           SYSTÈME « VIVID+CO » — darkroom editorial spread.
           6 tokens, RIEN d'autre. Canvas slate UNIQUE sur toute la page.
           ===================================================================== */
        canvas: '#495764',      /* slate — canvas UNIQUE, toute la page */
        offwhite: '#fffdf9',    /* texte off-white (JAMAIS blanc pur) */
        carbon: '#101010',      /* recess rare */
        obsidian: '#000000',    /* prismes */
        graphite: '#403f3f',    /* filets rares */
        gunmetal: '#6f879c',    /* accent UNIQUE — hairlines, ghost btn, états actifs */

        /* alias rétro-compat pour les composants existants (tous remappés
           sur les 6 tokens Vivid+Co — aucune nouvelle teinte introduite) */
        ink: '#495764',
        'ink-2': '#495764',
        'ink-3': '#495764',
        'ink-4': '#403f3f',
        cream: '#fffdf9',
        'cream-soft': '#fffdf9',
        'cream-dim': '#6f879c',
        ivory: '#fffdf9',
        green: '#6f879c',
        'green-deep': '#6f879c',
        cyan: '#6f879c',
        mint: '#6f879c',
      },
      fontFamily: {
        /* Neue Montreal → Inter. Display & body partagent Inter. */
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        satoshi: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
