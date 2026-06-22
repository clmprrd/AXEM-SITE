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
        /* SYSTÈME « xAI » — cosmic void. UNE seule couleur de canvas (void
           near-black #0c0c0b). Monochrome blancs/gris. Bleu signal #2563eb
           UNIQUEMENT pour le focus des inputs. Lueur ambre→bleu en footer only. */
        ink: '#0c0c0b',          /* void — UNIQUE fond de canvas */
        'ink-2': '#0c0c0b',      /* alias void (pas de section alternée colorée) */
        'ink-3': '#0c0c0b',      /* alias void */
        'ink-4': '#1f2228',      /* hairline (rétro-compat) */
        hairline: '#1f2228',     /* bordures hairline */
        outline: '#474747',      /* outline boutons / cartes */
        cream: '#ffffff',        /* texte principal (blanc absolu) */
        'cream-soft': '#7d8187', /* texte muté */
        'cream-dim': '#7d8187',  /* texte muté (alias) */
        signal: '#2563eb',       /* bleu signal — focus inputs UNIQUEMENT */
        ring: '#71717a',         /* ring focus 2px */
        /* alias rétro-compat (mappés sur le monochrome void) — aucun accent chromatique */
        green: '#ffffff',
        'green-deep': '#7d8187',
        cyan: '#7d8187',
        mint: '#ffffff',
        ivory: '#ffffff',
      },
      fontFamily: {
        /* universalSans → Inter (weight 400 PARTOUT). Eyebrows = JetBrains Mono. */
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        satoshi: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        /* tracking serré universel xAI */
        xai: '-0.025em',
      },
    },
  },
  plugins: [],
};
