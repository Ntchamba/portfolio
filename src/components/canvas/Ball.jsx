import { useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

// Texture « badge » avec le nom de la techno écrit dessus.
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
  return tex;
}

function BallMesh({ label }) {
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
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 2, 4]} intensity={1.2} />
      <mesh
        ref={mesh}
        scale={2.4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
        <Decal position={[0, 0, 1]} rotation={[0, 0, 0]} scale={1.5} map={tex} flatShading />
      </mesh>
    </Float>
  );
}

export default function BallCanvas({ label }) {
  return (
    <Canvas frameloop="always" dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
      <OrbitControls enableZoom={false} enablePan={false} />
      <BallMesh label={label} />
      <Preload all />
    </Canvas>
  );
}
