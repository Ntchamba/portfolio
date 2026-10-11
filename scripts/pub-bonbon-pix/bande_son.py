"""Génère la bande-son de la pub Bonbon Pix : voix (espeak-ng + mbrola fr1),
jingle chiptune, bruitages, et le fichier timeline.json lu par la page 3D.

Usage : python3 scripts/pub-bonbon-pix/bande_son.py
Sortie : public/pub-bonbon-pix/bande-son.mp3 et timeline.json
"""
import json
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 44100
FPS = 60  # résolution de l'enveloppe de la bouche
OUT = Path(__file__).resolve().parents[2] / "public" / "pub-bonbon-pix"

# Répliques : (texte, geste, pause avant en secondes)
REPLIQUES = [
    ("Salut ! Tu connais Bonbon Pix ?", "coucou", 0.0),
    ("Le bonbon qui pétille de mille couleurs !", "bras", 0.45),
    ("Fraise, citron, myrtille : un goût explosif dans chaque pixel !", "montre", 0.45),
    ("Une fois que tu croques, tu ne peux plus t'arrêter !", "croque", 0.45),
    ("Bonbon Pix. Croque la couleur !", "final", 1.6),
]
DEBUT_VOIX = 2.8
FIN_APRES_DERNIERE = 3.2


def voix(texte):
    with tempfile.NamedTemporaryFile(suffix=".wav") as f:
        subprocess.run(
            ["espeak-ng", "-v", "mb-fr1", "-s", "150", "-p", "62", "-w", f.name, texte],
            check=True,
            capture_output=True,
        )
        with wave.open(f.name) as w:
            sr = w.getframerate()
            data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    x = data.astype(np.float32) / 32768.0
    t_out = np.arange(int(len(x) * SR / sr)) / SR
    return np.interp(t_out, np.arange(len(x)) / sr, x)


def note(freq, dur, forme="carre", vol=1.0):
    t = np.arange(int(dur * SR)) / SR
    phase = (t * freq) % 1.0
    if forme == "carre":
        s = np.where(phase < 0.25, 1.0, -1.0) * 0.6
    elif forme == "triangle":
        s = 4 * np.abs(phase - 0.5) - 1
    else:
        s = np.sin(2 * np.pi * phase)
    env = np.minimum(1, t / 0.005) * np.exp(-t * 6)
    return s * env * vol


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def jingle(duree):
    """Boucle chiptune joyeuse à 128 bpm (do majeur : C-Am-F-G)."""
    out = np.zeros(int(duree * SR) + SR)
    croche = 60 / 128 / 2
    accords = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
    pas = 0
    t = 0.0
    while t < duree:
        acc = accords[(pas // 8) % 4]
        i = int(t * SR)
        arp = note(hz(acc[pas % 3] + 12), croche * 0.9, "carre", 0.10)
        out[i : i + len(arp)] += arp
        if pas % 2 == 0:
            b = note(hz(acc[0] - 12), croche * 1.8, "triangle", 0.22)
            out[i : i + len(b)] += b
        if pas % 4 == 0:  # grosse caisse
            tk = np.arange(int(0.12 * SR)) / SR
            k = np.sin(2 * np.pi * (60 + 120 * np.exp(-tk * 40)) * tk) * np.exp(-tk * 25) * 0.35
            out[i : i + len(k)] += k
        if pas % 4 == 2:  # charleston
            h = np.random.default_rng(pas).uniform(-1, 1, int(0.04 * SR))
            h *= np.exp(-np.arange(len(h)) / SR * 90) * 0.06
            out[i : i + len(h)] += h
        pas += 1
        t += croche
    return out[: int(duree * SR)]


def pop(vol=0.4):
    t = np.arange(int(0.18 * SR)) / SR
    return np.sin(2 * np.pi * (300 + 900 * t / 0.18) * t) * np.exp(-t * 22) * vol


def croc(vol=0.5):
    rng = np.random.default_rng(7)
    out = np.zeros(int(0.35 * SR))
    for k in range(5):
        i = int(k * 0.055 * SR)
        n = rng.uniform(-1, 1, int(0.05 * SR)) * np.exp(-np.arange(int(0.05 * SR)) / SR * 70)
        out[i : i + len(n)] += n * vol * (1 - k * 0.15)
    return out


def scintille(vol=0.12):
    out = np.zeros(int(1.2 * SR))
    for k, n in enumerate([84, 88, 91, 96, 100]):
        i = int(k * 0.08 * SR)
        s = note(hz(n), 0.5, "sinus", vol)
        out[i : i + len(s)] += s
    return out


def ajoute(piste, son, t):
    i = int(t * SR)
    piste[i : i + len(son)] += son[: max(0, len(piste) - i)]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    repliques = []
    t = DEBUT_VOIX
    clips = []
    for texte, geste, pause in REPLIQUES:
        t += pause
        x = voix(texte)
        d = len(x) / SR
        repliques.append({"texte": texte, "geste": geste, "debut": round(t, 3), "fin": round(t + d, 3)})
        clips.append((t, x))
        t += d
    duree = round(t + FIN_APRES_DERNIERE, 3)

    piste_voix = np.zeros(int(duree * SR) + SR)
    for debut, x in clips:
        ajoute(piste_voix, x, debut)
    piste_voix = piste_voix[: int(duree * SR)]

    # Enveloppe d'ouverture de la bouche, normalisée 0..1
    n = int(duree * FPS)
    hop = SR // FPS
    rms = np.array([np.sqrt(np.mean(piste_voix[i * hop : (i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
    env = np.clip((rms - 0.01) / (np.percentile(rms[rms > 0.01], 90) - 0.01), 0, 1)
    env = np.convolve(env, [0.25, 0.5, 0.25], mode="same")

    # Musique avec ducking sous la voix
    musique = jingle(duree)
    duck = np.repeat(np.convolve(env > 0.05, np.ones(20) / 20, mode="same"), hop)[: len(musique)]
    duck = np.pad(duck, (0, len(musique) - len(duck)))
    musique *= 1 - 0.6 * duck
    fondu = int(1.5 * SR)
    musique[-fondu:] *= np.linspace(1, 0, fondu)

    mix = piste_voix * 1.1 + musique
    croque = next(r for r in repliques if r["geste"] == "croque")
    final = next(r for r in repliques if r["geste"] == "final")
    ajoute(mix, pop(), 0.55)
    ajoute(mix, pop(0.3), 1.35)
    ajoute(mix, croc(), croque["debut"] + 0.55)
    ajoute(mix, scintille(), final["debut"] - 1.2)
    mix /= max(1.0, np.max(np.abs(mix)) / 0.95)

    with tempfile.NamedTemporaryFile(suffix=".wav") as f:
        with wave.open(f.name, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((mix * 32767).astype(np.int16).tobytes())
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", f.name, "-b:a", "128k", str(OUT / "bande-son.mp3")],
            check=True,
        )

    timeline = {
        "duree": duree,
        "fps": FPS,
        "repliques": repliques,
        "packshot": round(final["debut"] - 1.4, 3),
        "bouche": [round(float(v), 2) for v in env],
    }
    (OUT / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, separators=(",", ":")))
    print(f"durée {duree}s")
    for r in repliques:
        print(f'  {r["debut"]:6.2f}-{r["fin"]:6.2f}  {r["geste"]:7s} {r["texte"]}')


if __name__ == "__main__":
    main()
