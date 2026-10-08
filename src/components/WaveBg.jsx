import { useMemo } from "react";

// Lignes violettes ondulantes (motif « hero pattern »), générées en SVG.
export default function WaveBg() {
  const lines = useMemo(() => {
    const out = [];
    for (let i = 0; i < 46; i++) {
      let d = "";
      for (let x = 0; x <= 1600; x += 40) {
        const y = 360 + i * 7 + Math.sin(x / 210 + i * 0.09) * (70 + i * 1.6) + Math.cos(x / 120 - i * 0.05) * 26;
        d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
      }
      out.push(d);
    }
    return out;
  }, []);

  return (
    <svg className="wave-bg" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="waveFade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7c3aed" stopOpacity="0" />
          <stop offset=".45" stopColor="#7c3aed" stopOpacity=".5" />
          <stop offset="1" stopColor="#a855f7" stopOpacity=".95" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#waveFade)" strokeWidth="1">
        {lines.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
