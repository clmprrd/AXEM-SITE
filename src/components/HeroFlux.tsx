import React from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { cursor } from '../ui/cursorSignal';

// =====================================================================
// HeroFlux — fond WebGL du hero, CONFINÉ au hero (z-0, non-fixed).
// Distorsion pilotée par la VÉLOCITÉ du curseur : plus le curseur file vite,
// plus le flux se déforme (warp + turbulence + halo bioluminescent qui gonfle).
// Palette resserrée : teal abyssal #012624 → accent bioluminescent #22e0c8.
//
// GARDE-FOUS (bugs déjà vécus sur ce projet) :
//  • try/catch autour de `new Renderer` → si WebGL indispo, on rend rien et le
//    fallback CSS du parent (radial teal) transparait. JAMAIS de page blanche.
//  • IntersectionObserver + visibilitychange : rAF coupé hors-écran / onglet caché.
//  • dpr cappé ≤ 1.5.
//  • reduced-motion → UNE frame statique, aucune boucle (batterie).
// =====================================================================

const vertex = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

// Flux abyssal : fbm ondulant + veines bioluminescentes + halo réactif.
// uVelocity [0..1] pilote l'amplitude du warp et l'intensité de l'accent.
const fragment = `#version 300 es
precision highp float;
uniform vec2  iResolution;
uniform float iTime;
uniform float uVelocity;   // vélocité curseur lissée [0..1]
uniform vec2  uMouse;      // position curseur normalisée [0..1]
uniform vec3  uDeep;       // teal abyssal
uniform vec3  uMid;        // teal reef
uniform vec3  uAccent;     // bioluminescent
out vec4 fragColor;

mat2 rot(float a){ float s=sin(a),c=cos(a); return mat2(c,-s,s,c); }
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float v=0., a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p=rot(0.6)*p*2.0; a*=0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float ratio = iResolution.x / iResolution.y;
  vec2 p = uv - 0.5;
  p.x *= ratio;

  float t = iTime * 0.06;
  // la vélocité amplifie le warp : de 0.10 (calme) à ~0.60 (curseur rapide)
  float warp = 0.10 + uVelocity * 0.5;
  float spd  = 1.0 + uVelocity * 2.5;

  // domaine warpé par fbm (turbulence qui gonfle avec la vélocité)
  vec2 q = vec2(fbm(p*1.6 + t*spd), fbm(p*1.6 - t*spd + 4.7));
  vec2 r = vec2(fbm(p*1.6 + q*warp*4.0 + t), fbm(p*1.6 + q*warp*4.0 - t));
  float f = fbm(p*1.8 + r*warp*3.0);

  // base : abyssal → reef selon le flux
  vec3 col = mix(uDeep, uMid, smoothstep(0.15, 0.85, f));

  // veines bioluminescentes : crêtes fines du fbm, ravivées par la vélocité
  float vein = smoothstep(0.55, 0.72, f) * (1.0 - smoothstep(0.72, 0.9, f));
  col += uAccent * vein * (0.35 + uVelocity * 0.9);

  // halo réactif autour du curseur — gonfle avec la vélocité
  vec2 m = uMouse; m.x *= ratio; vec2 pc = uv; pc.x *= ratio;
  float d = distance(pc, m);
  float halo = smoothstep(0.55, 0.0, d) * (0.06 + uVelocity * 0.5);
  col += uAccent * halo;

  // léger grain pour matité (évite le banding)
  float g = hash(uv*iResolution.xy*0.5 + iTime);
  col += (g - 0.5) * 0.03;

  // vignette abyssale
  col *= 1.0 - dot(p,p) * 0.35;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const DEEP = [0.004, 0.149, 0.141]; // #012624
const MID = [0.0, 0.216, 0.204]; // #003734
const ACCENT = [0.133, 0.878, 0.784]; // #22e0c8 bioluminescent

export const HeroFlux: React.FC<{ reduced?: boolean; className?: string }> = ({
  reduced = false,
  className = '',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | undefined;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      return; // pas de WebGL → fallback CSS du parent, aucun crash
    }
    if (!renderer || !renderer.gl) return;

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uVelocity: { value: 0 },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uDeep: { value: new Float32Array(DEEP) },
        uMid: { value: new Float32Array(MID) },
        uAccent: { value: new Float32Array(ACCENT) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer!.setSize(w, h);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer!.render({ scene: mesh });
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    // vélocité lissée côté rendu (le smoothing du signal + celui-ci = très fluide)
    let vSmooth = 0;
    const t0 = performance.now();

    const loop = (t: number) => {
      // lit la position du curseur relative au hero → uMouse [0..1]
      const rect = container.getBoundingClientRect();
      if (cursor.moved) {
        const nx = (cursor.x - rect.left) / Math.max(1, rect.width);
        const ny = 1 - (cursor.y - rect.top) / Math.max(1, rect.height);
        const m = program.uniforms.uMouse.value as Float32Array;
        m[0] += (nx - m[0]) * 0.08;
        m[1] += (ny - m[1]) * 0.08;
      }
      vSmooth += (cursor.velocity - vSmooth) * 0.12;
      program.uniforms.uVelocity.value = vSmooth;
      program.uniforms.iTime.value = (t - t0) * 0.001;
      renderer!.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced) {
        renderer!.render({ scene: mesh });
        return;
      }
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
    };

    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; isVisible ? start() : stop(); },
      { threshold: 0 },
    );
    io.observe(container);

    const onVis = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? start() : stop();
    };
    document.addEventListener('visibilitychange', onVis);

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      try { container.removeChild(canvas); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return <div ref={containerRef} className={className} />;
};
