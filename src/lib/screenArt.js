import { profile } from "../data/constants.js";

// Dessine une fausse fenêtre « Visual Studio Code » sur un canvas 2D.
export function drawScreenCanvas() {
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

  return c;
}
