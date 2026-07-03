import { useMemo } from 'react';
import { motion, type Transition } from 'framer-motion';

// =====================================================================
// Variable Font Hover By Random Letter — composant 21st.dev (danielpetho).
// Anime les `font-variation-settings` de chaque lettre au survol, dans un
// ordre ALÉATOIRE (stagger). Nécessite une POLICE VARIABLE (axe `wght`) —
// ici Inter variable, chargée en <link> Google Fonts dans index.html.
// Adapté pour AXEM : import `framer-motion` (au lieu de `motion/react`),
// `cn`/`@/lib/utils` retiré (concat de classes simple), respecte
// `prefers-reduced-motion` en amont (les titres statiques ne montent pas ce
// composant en reduced-motion — voir Home.tsx).
// =====================================================================

// Mélange un tableau d'indices en place (Fisher–Yates).
function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

interface TextProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  transition?: Transition;
  staggerDuration?: number;
  className?: string;
  onClick?: () => void;
}

const VariableFontHoverByRandomLetter = ({
  label,
  fromFontVariationSettings = "'wght' 400",
  toFontVariationSettings = "'wght' 900",
  transition = {
    type: 'spring',
    duration: 0.7,
  },
  staggerDuration = 0.03,
  className = '',
  onClick,
  ...props
}: TextProps) => {
  const shuffledIndices = useMemo(() => {
    const indices = Array.from({ length: label.length }, (_, i) => i);
    shuffleArray(indices);
    return indices;
  }, [label]);

  const letterVariants = {
    hover: (index: number) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        delay: staggerDuration * index,
      },
    }),
    initial: (index: number) => ({
      fontVariationSettings: fromFontVariationSettings,
      transition: {
        ...transition,
        delay: staggerDuration * index,
      },
    }),
  };

  return (
    <motion.span
      className={className}
      onClick={onClick}
      whileHover="hover"
      initial="initial"
      style={{ fontVariationSettings: fromFontVariationSettings }}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split('').map((letter: string, i: number) => {
        const index = shuffledIndices[i];
        return (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            aria-hidden="true"
            variants={letterVariants}
            custom={index}
          >
            {letter}
          </motion.span>
        );
      })}
    </motion.span>
  );
};

export { VariableFontHoverByRandomLetter };
