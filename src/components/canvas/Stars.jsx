import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

// 5000 particules violettes réparties dans une sphère.
function generateSphere(count, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function StarField() {
  const ref = useRef();
  const sphere = useMemo(() => generateSphere(5000, 1.2), []);

  useFrame((_, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial transparent color="#a78bfa" size={0.003} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

export default function StarsCanvas() {
  return (
    <div className="stars-layer">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
        <StarField />
      </Canvas>
    </div>
  );
}
