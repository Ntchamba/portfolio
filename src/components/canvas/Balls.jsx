import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Decal, Float } from "@react-three/drei";
import * as THREE from "three";

const CELL = 150; // taille d'une cellule en pixels

function makeLabelTexture(label) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#2a1f4d";
  g.font = "bold 84px Poppins, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(label, 256, 256, 460);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  return tex;
}

function Ball({ label, position }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const tex = useMemo(() => makeLabelTexture(label), [label]);

  // L'icosaèdre tourne sur lui-même au survol.
  useFrame((_, delta) => {
    if (hovered) {
      mesh.current.rotation.y += delta * 3;
      mesh.current.rotation.x += delta * 1.2;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.75} rotationIntensity={0.6} floatIntensity={0.5}>
        <mesh
          ref={mesh}
          scale={CELL * 0.4}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
          <Decal position={[0, 0, 1]} scale={1.5} map={tex} />
        </mesh>
      </Float>
    </group>
  );
}

function Grid({ labels }) {
  const width = useThree((s) => s.size.width);
  const cols = Math.max(1, Math.min(labels.length, Math.floor(width / CELL)));
  const rows = Math.ceil(labels.length / cols);

  return labels.map((label, i) => {
    const row = Math.floor(i / cols);
    const inRow = row === rows - 1 ? labels.length - row * cols : cols;
    const col = i - row * cols;
    const x = (col - (inRow - 1) / 2) * CELL;
    const y = ((rows - 1) / 2 - row) * CELL;
    return <Ball key={label} label={label} position={[x, y, 0]} />;
  });
}

// Un seul contexte WebGL pour toutes les boules (les navigateurs limitent leur nombre).
export default function BallsCanvas({ labels }) {
  return (
    <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 500], near: 0.1, far: 2000 }} dpr={[1, 2]}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[200, 200, 400]} intensity={1.2} />
      <Grid labels={labels} />
    </Canvas>
  );
}
