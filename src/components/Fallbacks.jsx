import { useMemo } from "react";
import { drawScreenCanvas } from "../lib/screenArt.js";

// Versions 2D des scènes 3D, affichées quand WebGL n'est pas disponible.

export function HeroFallback() {
  const src = useMemo(() => drawScreenCanvas().toDataURL("image/png"), []);
  return (
    <div className="fb-hero">
      <div className="fb-monitor">
        <img src={src} alt="Éditeur de code" />
      </div>
      <div className="fb-stand" />
      <div className="fb-desk" />
      <p className="fb-note">Mode simplifié : la 3D nécessite WebGL (accélération matérielle du navigateur).</p>
    </div>
  );
}

export function BallsFallback({ labels }) {
  return (
    <div className="fb-balls">
      {labels.map((l) => (
        <span key={l}>{l.replace("\n", " ")}</span>
      ))}
    </div>
  );
}

export function EarthFallback() {
  return (
    <div className="fb-earth">
      <div className="fb-planet" />
    </div>
  );
}
