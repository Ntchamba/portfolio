// Enregistre la pub Bonbon Pix en MP4, image par image, avec Chromium sans écran.
// Usage : node scripts/pub-bonbon-pix/rendu.mjs [sortie.mp4] [--fps 30] [--taille 1280x720] [--test 0,5,9]
// Prérequis : playwright, ffmpeg, et three (npm pack three@0.170.0) dans THREE_DIR si unpkg est inaccessible.
import { spawn, spawnSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("/opt/node-tools/node_modules/playwright")); }

const args = process.argv.slice(2);
const opt = (nom, def) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : def; };
const sortie = resolve(args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--")) ?? "pub-bonbon-pix.mp4");
const fps = Number(opt("--fps", 30));
const [L, H] = opt("--taille", "1280x720").split("x").map(Number);
const test = opt("--test");
const THREE_DIR = process.env.THREE_DIR;

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "../../public/pub-bonbon-pix");
const TYPES = { ".html": "text/html", ".json": "application/json", ".mp3": "audio/mpeg", ".js": "text/javascript" };
const serveur = createServer((req, res) => {
  const f = join(racine, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/$/, "/index.html"));
  if (!f.startsWith(racine) || !existsSync(f)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": TYPES[extname(f)] ?? "application/octet-stream" });
  createReadStream(f).pipe(res);
}).listen(0);
const port = serveur.address().port;

const navigateur = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await navigateur.newPage({ viewport: { width: L, height: H } });
page.on("pageerror", (e) => console.error("erreur page :", e.message));
if (THREE_DIR) {
  await page.route("https://unpkg.com/three@0.170.0/**", (route) => {
    const chemin = new URL(route.request().url()).pathname.replace("/three@0.170.0/", "");
    route.fulfill({ path: join(THREE_DIR, chemin), contentType: "text/javascript" });
  });
}
await page.goto(`http://localhost:${port}/?render`);
await page.waitForFunction("window.__pret === true", null, { timeout: 120000 });
const duree = await page.evaluate("window.__duree");

if (test) {
  for (const t of test.split(",").map(Number)) {
    await page.evaluate((t) => window.__image(t), t);
    await page.screenshot({ path: sortie.replace(/\.mp4$/, "") + `-${t}.png`, timeout: 0 });
    console.log("image", t);
  }
} else {
  const ffmpeg = spawn("ffmpeg", [
    "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    "-i", join(racine, "bande-son.mp3"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium",
    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", sortie,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(duree * fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => window.__image(t), i / fps);
    const png = await page.screenshot({ type: "jpeg", quality: 95, timeout: 0 });
    if (!ffmpeg.stdin.write(png)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
    if (i % fps === 0) process.stdout.write(`\r${Math.round((i / n) * 100)} %`);
  }
  ffmpeg.stdin.end();
  await new Promise((r) => ffmpeg.on("close", r));
  console.log(`\nvidéo : ${sortie}`);
}
await navigateur.close();
serveur.close();
