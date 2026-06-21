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
        /* =================================================================
           DA AUROS — abîme teal bioluminescent. Profondeur par TONS (jamais
           d'ombres). Surfaces : abyss → trench → reef. Accent chaud RARE
           lavande (bordure only). Anciens noms (ink/cream/green/cyan…)
           re-mappés sur la palette Auros pour ne PAS casser les utilitaires
           existants disséminés dans le JSX.
           ================================================================= */
        /* — surfaces (profondeur par tons) — */
        abyss: '#012624',        /* canvas abyssal */
        trench: '#011d1c',       /* cartes (plus sombre) */
        reef: '#003734',         /* surface élevée */
        ink: '#012624',          /* alias canvas (compat) */
        'ink-2': '#011d1c',      /* alias cartes (compat) */
        'ink-3': '#011817',      /* surface très basse */
        'ink-4': '#003734',      /* surface haute (compat) */

        /* — texte — */
        cream: '#ffffff',        /* titres (blanc) */
        highlight: '#edfffe',    /* highlights (blanc teal) */
        'cream-soft': '#bbc7c6', /* corps */
        'cream-dim': '#7e918f',  /* tertiaire */
        ivory: '#edfffe',        /* clair secondaire */

        /* — accents bioluminescents — */
        green: '#00b3a7',        /* accent teal vif (ex-vert signature) */
        'green-deep': '#00827c', /* teal profond (CTA start) */
        cyan: '#67e8df',         /* cyan bioluminescent (eyebrows) */
        mint: '#cbfffc',         /* cyan clair (CTA end) */
        lavender: '#fde9ff',     /* accent chaud RARE — lavande (bordure only) */
        aurora: '#fad1ff',       /* aurora warm (gradient ghost) */
      },
      fontFamily: {
        /* substitut Matter = Inter (poids 400/500 only, pas de bold). */
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        satoshi: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
