"""Génère la bande-son de la pub Bonbon Pix : voix neuronale (Piper, voix fr « siwis »),
formes de bouche (Rhubarb Lip Sync), musique pop, bruitages, et timeline.json lu par la page 3D.

Usage :
  PIPER=/chemin/piper PIPER_VOIX=/chemin/fr-siwis-medium.onnx RHUBARB=/chemin/rhubarb \
    python3 scripts/pub-bonbon-pix/bande_son.py
Sorties : public/pub-bonbon-pix/bande-son.mp3 et timeline.json

Piper : https://github.com/rhasspy/piper (voix : releases v0.0.2, voice-fr-siwis-medium)
Rhubarb : https://github.com/DanielSWolf/rhubarb-lip-sync
"""
import json
import os
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 44100
FPS = 60  # résolution de l'enveloppe de la voix
OUT = Path(__file__).resolve().parents[2] / "public" / "pub-bonbon-pix"
PIPER = os.environ.get("PIPER", "piper")
PIPER_VOIX = os.environ["PIPER_VOIX"]
RHUBARB = os.environ.get("RHUBARB", "rhubarb")

# Répliques : (texte, geste, pause avant en secondes)
REPLIQUES = [
    ("Salut ! Tu connais Bonbon Pix ?", "coucou", 0.0),
    ("Le bonbon qui pétille de mille couleurs !", "bras", 0.5),
    ("Fraise, citron, myrtille... Un goût explosif à chaque bouchée !", "montre", 0.5),
    ("Une fois que tu croques, tu ne peux plus t'arrêter !", "croque", 0.6),
    ("Bonbon Pix. Croque la couleur !", "final", 1.7),
]
DEBUT_VOIX = 2.6
FIN_APRES_DERNIERE = 3.4


def lit_wav(chemin):
    with wave.open(str(chemin)) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    t_out = np.arange(int(len(x) * SR / sr)) / SR
    return np.interp(t_out, np.arange(len(x)) / sr, x)


def voix(texte, dossier, i):
    chemin = Path(dossier) / f"replique{i}.wav"
    subprocess.run(
        [PIPER, "-m", PIPER_VOIX, "-f", str(chemin), "--length_scale", "0.92", "--noise_scale", "0.6"],
        input=texte.encode(), check=True, capture_output=True,
    )
    x = lit_wav(chemin)
    # retire les silences de début/fin
    actif = np.flatnonzero(np.abs(x) > 0.01)
    x = x[max(0, actif[0] - 400) : actif[-1] + 2000]
    with wave.open(str(chemin), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    sortie = subprocess.run(
        [RHUBARB, "-r", "phonetic", "-f", "json", "--extendedShapes", "GHX", str(chemin)],
        check=True, capture_output=True,
    )
    formes = json.loads(sortie.stdout)["mouthCues"]
    return x, formes


def pluck(freq, dur, vol=1.0, brillance=0.5):
    """Corde pincée (Karplus-Strong) : son de guitare/kalimba doux."""
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf = np.random.default_rng(int(freq * 10)).uniform(-1, 1, p)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = (buf[i % p] + brillance * buf[(i + 1) % p] + (1 - brillance) * buf[i % p]) * 0.498
    return out * vol


def sinus(freq, dur, vol=1.0, attaque=0.01, declin=3.0):
    t = np.arange(int(dur * SR)) / SR
    return np.sin(2 * np.pi * freq * t) * np.minimum(1, t / attaque) * np.exp(-t * declin) * vol


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def musique(duree):
    """Pop acoustique légère à 112 bpm : C - G - Am - F."""
    out = np.zeros(int(duree * SR) + 2 * SR)
    noire = 60 / 112
    accords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
    rng = np.random.default_rng(3)
    mesure, t = 0, 0.0
    while t < duree:
        acc = accords[mesure % 4]
        # nappe douce
        for n in acc:
            s = sinus(hz(n), noire * 4, 0.035, attaque=0.3, declin=0.4)
            out[int(t * SR) : int(t * SR) + len(s)] += s
        # arpège pincé en croches
        motif = [0, 1, 2, 1, 2, 0, 1, 2]
        for k, m in enumerate(motif):
            i = int((t + k * noire / 2) * SR)
            s = pluck(hz(acc[m] + 12), 0.9, 0.16, 0.45 if k % 2 else 0.7)
            out[i : i + len(s)] += s
        # basse
        for k in (0, 2.5):
            i = int((t + k * noire) * SR)
            s = sinus(hz(acc[0] - 24), noire * 1.4, 0.3, declin=2.2)
            out[i : i + len(s)] += s
        # batterie légère : grosse caisse 1 et 3, claquement 2 et 4, shaker en croches
        for k in range(4):
            i = int((t + k * noire) * SR)
            if k % 2 == 0:
                tk = np.arange(int(0.15 * SR)) / SR
                s = np.sin(2 * np.pi * (50 + 90 * np.exp(-tk * 35)) * tk) * np.exp(-tk * 18) * 0.4
            else:
                tk = np.arange(int(0.12 * SR)) / SR
                s = rng.uniform(-1, 1, len(tk)) * np.exp(-tk * 30) * 0.09
            out[i : i + len(s)] += s
        for k in range(8):
            i = int((t + k * noire / 2) * SR)
            s = rng.uniform(-1, 1, int(0.03 * SR)) * np.exp(-np.arange(int(0.03 * SR)) / SR * 120) * 0.025
            out[i : i + len(s)] += np.diff(s, prepend=0)
        mesure += 1
        t += noire * 4
    return out[: int(duree * SR)]


def pop(vol=0.35):
    t = np.arange(int(0.16 * SR)) / SR
    return np.sin(2 * np.pi * (250 + 700 * t / 0.16) * t) * np.exp(-t * 24) * vol


def croc(vol=0.55):
    rng = np.random.default_rng(7)
    out = np.zeros(int(0.4 * SR))
    for k in range(6):
        i = int((k * 0.045 + rng.uniform(0, 0.01)) * SR)
        n = rng.uniform(-1, 1, int(0.04 * SR))
        n = np.diff(n, prepend=0) * np.exp(-np.arange(len(n)) / SR * 80)
        out[i : i + len(n)] += n * vol * (1 - k * 0.13)
    return out


def scintille(vol=0.1):
    out = np.zeros(int(1.5 * SR))
    for k, n in enumerate([84, 88, 91, 96, 100, 103]):
        i = int(k * 0.07 * SR)
        s = sinus(hz(n), 0.8, vol, attaque=0.003, declin=4)
        out[i : i + len(s)] += s
    return out


def ajoute(piste, son, t):
    i = int(t * SR)
    piste[i : i + len(son)] += son[: max(0, len(piste) - i)]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    repliques, clips = [], []
    t = DEBUT_VOIX
    with tempfile.TemporaryDirectory() as dossier:
        for i, (texte, geste, pause) in enumerate(REPLIQUES):
            t += pause
            x, formes = voix(texte, dossier, i)
            d = len(x) / SR
            repliques.append({
                "texte": texte, "geste": geste, "debut": round(t, 3), "fin": round(t + d, 3),
                "formes": [[round(t + f["start"], 3), f["value"]] for f in formes],
            })
            clips.append((t, x))
            t += d
    duree = round(t + FIN_APRES_DERNIERE, 3)

    piste_voix = np.zeros(int(duree * SR) + SR)
    for debut, x in clips:
        ajoute(piste_voix, x, debut)
    piste_voix = piste_voix[: int(duree * SR)]

    n = int(duree * FPS)
    hop = SR // FPS
    rms = np.array([np.sqrt(np.mean(piste_voix[i * hop : (i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
    env = np.clip((rms - 0.01) / (np.percentile(rms[rms > 0.01], 90) - 0.01), 0, 1)
    env = np.convolve(env, [0.25, 0.5, 0.25], mode="same")

    m = musique(duree)
    duck = np.repeat(np.convolve(env > 0.05, np.ones(24) / 24, mode="same"), hop)[: len(m)]
    duck = np.pad(duck, (0, len(m) - len(duck)))
    m *= 1 - 0.55 * duck
    fondu = int(1.8 * SR)
    m[-fondu:] *= np.linspace(1, 0, fondu)
    m[: int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))

    mix = piste_voix * 1.25 + m * 0.9
    croque = next(r for r in repliques if r["geste"] == "croque")
    final = next(r for r in repliques if r["geste"] == "final")
    ajoute(mix, pop(), 0.5)
    ajoute(mix, pop(0.28), 1.25)
    ajoute(mix, croc(), croque["debut"] + 0.6)
    ajoute(mix, scintille(), final["debut"] - 1.3)
    mix /= max(1.0, np.max(np.abs(mix)) / 0.95)

    with tempfile.NamedTemporaryFile(suffix=".wav") as f:
        with wave.open(f.name, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((mix * 32767).astype(np.int16).tobytes())
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", f.name, "-b:a", "160k", str(OUT / "bande-son.mp3")],
            check=True,
        )

    timeline = {
        "duree": duree, "fps": FPS, "repliques": repliques,
        "croc": round(croque["debut"] + 0.6, 3),
        "packshot": round(final["debut"] - 1.5, 3),
        "voix": [round(float(v), 2) for v in env],
    }
    (OUT / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, separators=(",", ":")))
    print(f"durée {duree}s")
    for r in repliques:
        print(f'  {r["debut"]:6.2f}-{r["fin"]:6.2f}  {r["geste"]:7s} {r["texte"]}')


if __name__ == "__main__":
    main()
