import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Float } from "@react-three/drei";
import * as THREE from "three";
import { profile } from "../../data/constants.js";

// Dessine une fausse fenêtre « Visual Studio Code » sur un canvas 2D.
function makeScreenTexture() {
  const w = 1024;
  const h = 640;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");

  g.fillStyle = "#1e1e1e";
  g.fillRect(0, 0, w, h);
  // barre de titre
  g.fillStyle = "#323233";
  g.fillRect(0, 0, w, 36);
  ["#ff5f56", "#ffbd2e", "#27c93f"].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(22 + i * 22, 18, 6, 0, Math.PI * 2);
    g.fill();
  });
  g.fillStyle = "#9d9d9d";
  g.font = "14px monospace";
  g.fillText("App.jsx — portfolio — Visual Studio Code", 330, 23);
  // barre d'activité + explorateur
  g.fillStyle = "#333333";
  g.fillRect(0, 36, 48, h - 36);
  g.fillStyle = "#252526";
  g.fillRect(48, 36, 210, h - 36);
  g.fillStyle = "#bbbbbb";
  g.font = "bold 12px sans-serif";
  g.fillText("EXPLORATEUR", 62, 62);
  g.font = "14px monospace";
  ["▾ src", "   App.jsx", "   main.jsx", "   index.css", "▸ public", "  package.json"].forEach((t, i) => {
    g.fillStyle = i === 1 ? "#ffffff" : "#c5c5c5";
    g.fillText(t, 62, 94 + i * 24);
  });
  // onglet
  g.fillStyle = "#2d2d2d";
  g.fillRect(258, 36, w - 258, 34);
  g.fillStyle = "#1e1e1e";
  g.fillRect(258, 36, 130, 34);
  g.fillStyle = "#4fc1ff";
  g.font = "13px monospace";
  g.fillText("App.jsx", 280, 58);
  // code
  const lines = [
    [["import", "#c586c0"], [" React ", "#9cdcfe"], ["from", "#c586c0"], [' "react"', "#ce9178"], [";", "#d4d4d4"]],
    [],
    [["const", "#569cd6"], [" developer", "#4fc1ff"], [" = {", "#d4d4d4"]],
    [["  name", "#9cdcfe"], [": ", "#d4d4d4"], [`"${profile.name}"`, "#ce9178"], [",", "#d4d4d4"]],
    [["  stack", "#9cdcfe"], [": [", "#d4d4d4"], ['"React"', "#ce9178"], [", ", "#d4d4d4"], ['"Three.js"', "#ce9178"], ["],", "#d4d4d4"]],
    [["  passion", "#9cdcfe"], [": ", "#d4d4d4"], ['"créer"', "#ce9178"], [",", "#d4d4d4"]],
    [["};", "#d4d4d4"]],
    [],
    [["export default function", "#c586c0"], [" Portfolio", "#dcdcaa"], ["() {", "#d4d4d4"]],
    [["  return", "#c586c0"], [" <", "#808080"], ["Universe", "#4ec9b0"], [" />", "#808080"], [";", "#d4d4d4"]],
    [["}", "#d4d4d4"]],
  ];
  g.font = "17px monospace";
  lines.forEach((parts, i) => {
    const y = 100 + i * 28;
    g.fillStyle = "#6e7681";
    g.fillText(String(i + 1), 276, y);
    let x = 320;
    parts.forEach(([text, color]) => {
      g.fillStyle = color;
      g.fillText(text, x, y);
      x += g.measureText(text).width;
    });
  });
  // barre d'état
  g.fillStyle = "#007acc";
  g.fillRect(0, h - 24, w, 24);
  g.fillStyle = "#fff";
  g.font = "12px sans-serif";
  g.fillText("⎇ main    JavaScript React    UTF-8", 12, h - 8);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function Computer() {
  const screenTex = useMemo(makeScreenTexture, []);
  useEffect(() => () => screenTex.dispose(), [screenTex]);

  const body = <meshStandardMaterial color="#1b1b2b" metalness={0.6} roughness={0.35} />;

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
      <group position={[1.2, -1.1, 0]} scale={0.85}>
        {/* bureau */}
        <mesh position={[0, -1.35, 0.3]}>
          <boxGeometry args={[6.4, 0.14, 3]} />
          <meshStandardMaterial color="#2a1f4d" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* pied + socle */}
        <mesh position={[0, -1.05, -0.3]}>
          <boxGeometry args={[0.35, 0.5, 0.2]} />
          {body}
        </mesh>
        <mesh position={[0, -1.25, -0.1]}>
          <boxGeometry args={[1.6, 0.06, 1]} />
          {body}
        </mesh>
        {/* cadre de l'écran */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[4.4, 2.7, 0.18]} />
          {body}
        </mesh>
        {/* écran VS Code */}
        <mesh position={[0, 0.35, 0.1]}>
          <planeGeometry args={[4.1, 2.56]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>
        {/* vitre brillante : reçoit le reflet de la lumière ponctuelle */}
        <mesh position={[0, 0.35, 0.115]}>
          <planeGeometry args={[4.1, 2.56]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.12}
            roughness={0.05}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.03}
            color="#ffffff"
            depthWrite={false}
          />
        </mesh>
        {/* clavier */}
        <mesh position={[0, -1.25, 1.1]} rotation={[0.05, 0, 0]}>
          <boxGeometry args={[2.6, 0.08, 0.8]} />
          <meshStandardMaterial color="#262640" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* souris */}
        <mesh position={[1.9, -1.24, 1.1]}>
          <capsuleGeometry args={[0.1, 0.18, 4, 12]} />
          <meshStandardMaterial color="#262640" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ComputersCanvas() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 2]}
      shadows={false}
      camera={{ position: [6, 2.5, 13], fov: 30 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.45} />
      <hemisphereLight intensity={0.6} groundColor="#1a0b3b" />
      <directionalLight position={[-6, 6, 4]} intensity={0.8} />
      {/* PointLight : crée le « glare » sur l'écran quand on pivote */}
      <pointLight position={[-2.5, 2.5, 3.5]} intensity={90} color="#c4b5fd" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2.6}
      />
      <Computer />
      <Preload all />
    </Canvas>
  );
}
