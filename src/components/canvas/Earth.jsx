import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

// Bruit de valeur simple pour générer des continents sans fichier externe.
function makePlanetTexture() {
  const w = 1024;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  const img = g.createImageData(w, h);

  const grid = 32;
  const rnd = Array.from({ length: (grid + 1) * (grid + 1) }, () => Math.random());
  const val = (x, y) => rnd[(y % (grid + 1)) * (grid + 1) + (x % (grid + 1))];
  const smooth = (t) => t * t * (3 - 2 * t);
  const noise = (u, v) => {
    const x = u * grid;
    const y = v * grid;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = smooth(x - x0);
    const ty = smooth(y - y0);
    const a = val(x0, y0) * (1 - tx) + val(x0 + 1, y0) * tx;
    const b = val(x0, y0 + 1) * (1 - tx) + val(x0 + 1, y0 + 1) * tx;
    return a * (1 - ty) + b * ty;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const v = y / h;
      const n = noise(u, v) * 0.6 + noise(u * 2.3 + 0.3, v * 2.3) * 0.3 + noise(u * 5, v * 5) * 0.1;
      const polar = Math.abs(v - 0.5) * 2;
      let r, gg, b;
      if (polar > 0.88) [r, gg, b] = [235, 235, 250];
      else if (n > 0.55) [r, gg, b] = [90 + n * 60, 70 + n * 40, 190 + n * 30];
      else [r, gg, b] = [20, 20 + n * 60, 90 + n * 120];
      const i = (y * w + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = gg;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Planet() {
  const map = useMemo(makePlanetTexture, []);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshStandardMaterial map={map} roughness={0.8} />
      </mesh>
      {/* atmosphère */}
      <mesh scale={1.06}>
        <sphereGeometry args={[2.4, 48, 48]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function EarthCanvas() {
  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 3, 5]} intensity={1.6} />
      <OrbitControls autoRotate autoRotateSpeed={1.2} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      <Planet />
      <Preload all />
    </Canvas>
  );
}
