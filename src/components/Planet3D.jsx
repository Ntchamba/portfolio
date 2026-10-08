import { useMemo } from "react";

// Texture « nuit » : continents sombres et lumières de villes (canvas 2D, pas de WebGL).
function makeNightTexture() {
  const w = 1024;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  const grid = 24;
  const rnd = Array.from({ length: (grid + 1) * (grid + 1) }, () => Math.random());
  const val = (x, y) => rnd[(((y % grid) + grid) % grid) * (grid + 1) + (((x % grid) + grid) % grid)];
  const sm = (t) => t * t * (3 - 2 * t);
  const noise = (u, v) => {
    const x = u * grid;
    const y = v * grid;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = sm(x - x0);
    const ty = sm(y - y0);
    return (val(x0, y0) * (1 - tx) + val(x0 + 1, y0) * tx) * (1 - ty) + (val(x0, y0 + 1) * (1 - tx) + val(x0 + 1, y0 + 1) * tx) * ty;
  };
  const land = new Uint8Array(w * h);
  const img = g.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n = noise(x / w, y / h) * 0.65 + noise((x / w) * 2.7, (y / h) * 2.7) * 0.35;
      const isLand = n > 0.52 && y > 60 && y < 450;
      land[y * w + x] = isLand ? 1 : 0;
      const i = (y * w + x) * 4;
      img.data[i] = isLand ? 10 : 4;
      img.data[i + 1] = isLand ? 26 : 10;
      img.data[i + 2] = isLand ? 34 : 28;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  for (let i = 0; i < 9000; i++) {
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    if (!land[y * w + x]) continue;
    g.fillStyle = `rgba(255, ${180 + Math.random() * 60}, ${90 + Math.random() * 70}, ${0.45 + Math.random() * 0.55})`;
    const s = Math.random() < 0.25 ? 3 : 1.8;
    g.fillRect(x, y, s, s);
  }
  return c.toDataURL("image/png");
}

// Rubans autour de la planète : [taille, roulis, inclinaison, arc°, épaisseur, couleurs, durée s, sens]
const RINGS = [
  [1.3, 18, 66, 210, 0.06, ["#f3b9e4", "#c58ad9"], 16, 1],
  [1.22, -32, 72, 150, 0.075, ["#8da2ec", "#5568c4"], 20, -1],
  [1.36, 55, 60, 260, 0.04, ["#e9a6d6", "#b97bd0"], 24, 1],
  [1.16, -70, 76, 190, 0.09, ["#7f94e6", "#4c60bd"], 18, 1],
  [1.28, 100, 64, 120, 0.05, ["#f6c4ea", "#d49be0"], 14, -1],
  [1.2, 140, 70, 230, 0.06, ["#9db0f2", "#6377d0"], 22, -1],
  [1.4, -10, 58, 170, 0.035, ["#f0b0df", "#c283d6"], 28, 1],
  [1.12, 75, 78, 140, 0.08, ["#a3b4f4", "#5d71cc"], 17, 1],
  [1.33, -55, 68, 200, 0.05, ["#f7c9ec", "#cf94dd"], 21, -1],
  [1.25, 120, 62, 90, 0.07, ["#7b90e4", "#4a5eb8"], 13, 1],
];

function Ribbon({ cfg, half }) {
  const [s, roll, tilt, arc, t, [c1, c2], dur, dir] = cfg;
  return (
    <div
      className={`rb rb--${half}`}
      style={{ "--s": s, "--roll": `${roll}deg`, "--tilt": `${tilt}deg`, "--t": t }}
    >
      <div
        className="rb__arc"
        style={{
          background: `conic-gradient(from 0deg, ${c2}, ${c1} ${arc}deg, transparent ${arc}deg)`,
          animationDuration: `${dur}s`,
          animationDirection: dir > 0 ? "normal" : "reverse",
        }}
      />
    </div>
  );
}

// Planète « rubans » en CSS : texture qui défile + anneaux inclinés avec occlusion avant/arrière.
export default function Planet3D() {
  const tex = useMemo(makeNightTexture, []);
  return (
    <div className="planet">
      <div className="planet__layer">
        {RINGS.map((r, i) => (
          <Ribbon key={`b${i}`} cfg={r} half="back" />
        ))}
      </div>
      <div className="globe" style={{ backgroundImage: `url(${tex})` }} />
      <div className="planet__layer">
        {RINGS.map((r, i) => (
          <Ribbon key={`f${i}`} cfg={r} half="front" />
        ))}
      </div>
    </div>
  );
}
