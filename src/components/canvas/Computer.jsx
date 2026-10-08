import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

// Clavier rétro-éclairé en dégradé RGB.
function makeKeyboardTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 340;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 1024, 0);
  ["#ff2d95", "#8b5cf6", "#22d3ee", "#34d399", "#facc15", "#ff2d95"].forEach((col, i, a) => grad.addColorStop(i / (a.length - 1), col));
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 340);
  g.fillStyle = "#0c0c16";
  const rows = [14, 14, 13, 12, 8];
  rows.forEach((n, r) => {
    const kw = (1000 - 8 * n) / n;
    for (let i = 0; i < n; i++) g.fillRect(12 + i * (kw + 8), 14 + r * 64, kw, 54);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Tapis de souris violet.
function makePadTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 300;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 512, 300);
  grad.addColorStop(0, "#4c1d95");
  grad.addColorStop(1, "#1e3a8a");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 300);
  g.strokeStyle = "rgba(167,139,250,.55)";
  g.lineWidth = 2;
  for (let y = 0; y < 300; y += 34) for (let x = (y / 34) % 2 ? 0 : 30; x < 512; x += 60) {
    g.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k;
      g.lineTo(x + 24 * Math.cos(a), y + 24 * Math.sin(a));
    }
    g.closePath();
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Ventilateur lumineux dont la couleur évolue doucement.
function Fan({ position, radius = 0.5, hue = 0.85 }) {
  const group = useRef();
  const mat = useRef();
  useFrame(({ clock }, delta) => {
    group.current.rotation.z -= delta * 3;
    mat.current.color.setHSL((hue + clock.elapsedTime * 0.05) % 1, 1, 0.6);
  });
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[radius * 1.15, 40]} />
        <meshBasicMaterial color="#05050a" />
      </mesh>
      <group ref={group} position={[0, 0, 0.01]}>
        <mesh>
          <torusGeometry args={[radius, 0.07, 12, 48]} />
          <meshBasicMaterial ref={mat} toneMapped={false} />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 7]} position={[0, 0, 0]}>
            <boxGeometry args={[radius * 0.9, 0.05, 0.02]} />
            <meshBasicMaterial color="#1a1a2e" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Speaker({ x }) {
  return (
    <group position={[x, -0.55, -0.7]}>
      <mesh>
        <boxGeometry args={[0.55, 1.05, 0.5]} />
        <meshStandardMaterial color="#14141f" metalness={0.5} roughness={0.5} />
      </mesh>
      <Fan position={[0, 0.25, 0.26]} radius={0.14} hue={0.5} />
      <Fan position={[0, -0.2, 0.26]} radius={0.17} hue={0.85} />
    </group>
  );
}

function Tower() {
  return (
    <group position={[4.3, -0.3, -1.1]} scale={0.85}>
      <mesh>
        <boxGeometry args={[1.7, 2.9, 2.1]} />
        <meshStandardMaterial color="#0b0b14" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* vitre latérale + carte graphique */}
      <mesh position={[0, 0, 1.06]}>
        <planeGeometry args={[1.5, 2.7]} />
        <meshBasicMaterial color="#0d0a1c" />
      </mesh>
      <Fan position={[0, 0.75, 1.08]} radius={0.5} hue={0.88} />
      <Fan position={[0, -0.35, 1.08]} radius={0.5} hue={0.55} />
      <mesh position={[0, -1.1, 1.08]}>
        <planeGeometry args={[1.2, 0.18]} />
        <meshBasicMaterial color="#ff2d55" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Computer() {
  const screenTex = useMemo(makeScreenTexture, []);
  const keyTex = useMemo(makeKeyboardTexture, []);
  const padTex = useMemo(makePadTexture, []);
  useEffect(
    () => () => {
      screenTex.dispose();
      keyTex.dispose();
      padTex.dispose();
    },
    [screenTex, keyTex, padTex]
  );

  const body = <meshStandardMaterial color="#1a1a28" metalness={0.6} roughness={0.35} />;

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.25}>
      <group position={[0, -0.9, 0]}>
        {/* bureau : grande dalle grise */}
        <mesh position={[0.4, -1.3, 0.5]}>
          <boxGeometry args={[10.4, 0.4, 4.6]} />
          <meshStandardMaterial color="#3b3b4a" metalness={0.2} roughness={0.8} />
        </mesh>
        {/* moniteur */}
        <group position={[-0.7, 0, -0.9]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[4.5, 2.6, 0.1]} />
            {body}
          </mesh>
          <mesh position={[0, 0.3, 0.056]}>
            <planeGeometry args={[4.36, 2.46]} />
            <meshBasicMaterial map={screenTex} toneMapped={false} />
          </mesh>
          {/* vitre : reçoit le reflet de la lumière ponctuelle */}
          <mesh position={[0, 0.3, 0.06]}>
            <planeGeometry args={[4.36, 2.46]} />
            <meshPhysicalMaterial transparent opacity={0.1} roughness={0.05} clearcoat={1} clearcoatRoughness={0.03} depthWrite={false} />
          </mesh>
          <mesh position={[0, -1.15, -0.15]}>
            <boxGeometry args={[0.3, 0.5, 0.15]} />
            {body}
          </mesh>
          <mesh position={[0, -1.1, 0]}>
            <boxGeometry args={[1.4, 0.05, 0.8]} />
            {body}
          </mesh>
        </group>
        <Speaker x={-3.6} />
        <Speaker x={2.3} />
        {/* clavier */}
        <mesh position={[-0.7, -1.07, 0.9]} rotation={[-0.04, 0, 0]}>
          <boxGeometry args={[3.6, 0.1, 1.2]} />
          <meshStandardMaterial color="#0c0c16" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[-0.7, -1.015, 0.9]} rotation={[-Math.PI / 2 - 0.04, 0, 0]}>
          <planeGeometry args={[3.5, 1.15]} />
          <meshBasicMaterial map={keyTex} toneMapped={false} />
        </mesh>
        {/* tapis + souris */}
        <mesh position={[2.2, -1.1, 1.0]}>
          <boxGeometry args={[2.0, 0.04, 1.2]} />
          <meshBasicMaterial map={padTex} toneMapped={false} />
        </mesh>
        <mesh position={[2.3, -1.0, 1.05]} scale={[1, 0.55, 1.5]}>
          <sphereGeometry args={[0.16, 20, 14]} />
          <meshStandardMaterial color="#e11d48" emissive="#e11d48" emissiveIntensity={0.7} />
        </mesh>
        <Tower />
      </group>
    </Float>
  );
}

// Adapte la distance de la caméra à la largeur de l'écran pour que la scène reste entière.
function Rig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.position.z = Math.max(19, 26 / aspect);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function ComputersCanvas() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 2]}
      shadows={false}
      camera={{ position: [1, 2.5, 17], fov: 30 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight intensity={0.6} groundColor="#1a0b3b" />
      <directionalLight position={[-6, 6, 6]} intensity={0.7} />
      {/* PointLight : crée le « glare » sur l'écran quand on pivote */}
      <pointLight position={[-3, 3, 4]} intensity={110} color="#c4b5fd" />
      <Rig />
      <OrbitControls
        target={[0, 0.9, 0]}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2.6}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
      />
      <Computer />
      <Preload all />
    </Canvas>
  );
}
