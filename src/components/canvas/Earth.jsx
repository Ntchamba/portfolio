import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

// Globe sombre parsemé de lumières de villes.
function makeNightTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#050a1c";
  g.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 2600; i++) {
    const cx = Math.random() * 1024;
    const cy = 110 + Math.random() * 300;
    const n = 1 + Math.floor(Math.random() * 3);
    for (let k = 0; k < n; k++) {
      g.fillStyle = `rgba(255, ${190 + Math.random() * 50}, ${120 + Math.random() * 60}, ${0.4 + Math.random() * 0.6})`;
      g.fillRect(cx + (Math.random() - 0.5) * 14, cy + (Math.random() - 0.5) * 10, 1.6, 1.6);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Rubans roses/bleus enroulés autour de la planète.
function Ribbons() {
  const ribbons = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        radius: 2.5 + Math.random() * 0.25,
        tube: 0.07 + Math.random() * 0.1,
        arc: Math.PI * (0.9 + Math.random() * 1.0),
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        color: i % 2 ? "#6f86d6" : "#e8a8d8",
      })),
    []
  );
  return ribbons.map((r, i) => (
    <mesh key={i} rotation={r.rot} scale={[1, 1, 0.35]}>
      <torusGeometry args={[r.radius, r.tube, 8, 64, r.arc]} />
      <meshStandardMaterial color={r.color} roughness={0.5} metalness={0.15} />
    </mesh>
  ));
}

function Planet() {
  const map = useMemo(makeNightTexture, []);
  const group = useRef();
  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.25;
  });
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[2.35, 64, 64]} />
        <meshStandardMaterial map={map} emissiveMap={map} emissive="#ffffff" emissiveIntensity={0.9} roughness={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.38, 32, 32]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.08} />
      </mesh>
      <Ribbons />
    </group>
  );
}

export default function EarthCanvas() {
  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 8] }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 3, 5]} intensity={1.8} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <Planet />
      <Preload all />
    </Canvas>
  );
}
