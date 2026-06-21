import React from 'react';

// =====================================================================
// SAFE CANVAS — error boundary léger pour isoler un composant WebGL/canvas.
// Si le contexte graphique échoue (GPU bloqué, WebGL indisponible, navigateur
// restrictif), on retombe sur un `fallback` (un dégradé CSS aux mêmes tons)
// AU LIEU de faire planter tout l'arbre React → la page reste vivante.
// =====================================================================

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { failed: boolean };

export class SafeCanvas extends React.Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch() { /* swallow — le fallback prend le relais */ }
  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default SafeCanvas;
