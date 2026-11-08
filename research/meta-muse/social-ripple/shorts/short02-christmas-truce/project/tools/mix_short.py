import json, re, numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt, fftconvolve
SR = 48000; js = open("assets/t.js").read()
T = json.loads(re.search(r"window.T=(.*?);\n", js).group(1)); WD = json.loads(re.search(r"window.WORDS=(.*?);\n", js).group(1))
D = T["D"]; N = int((D + 0.2) * SR); rng = np.random.default_rng(11)
def W(w, nth=0, line=None):
    k = 0
    for x in WD:
        if (not line or x[3] == line) and re.sub(r"[^a-z0-9']", "", x[0].lower()) == w:
            if k == nth: return x[1]
            k += 1
    raise KeyError(w)
def load(p):
    a, sr = sf.read(p); a = np.stack([a, a], 1) if a.ndim == 1 else a
    return resample_poly(a, SR, sr, axis=0) if sr != SR else a
db = lambda x: 10 ** (x / 20); t_ = lambda d: np.arange(int(d * SR)) / SR
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x, axis=0)
def pan(x, p): return np.stack([x * np.sqrt(0.5 * (1 - p)), x * np.sqrt(0.5 * (1 + p))], 1)
def put(buf, x, at, g=0.0, p=0.0):
    if x.ndim == 1: x = pan(x, p)
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i] * db(g)
def env(n, a, b): e = np.ones(n); na, nb = int(a * SR), int(b * SR); e[:na] = np.linspace(0, 1, na); e[-nb:] = np.linspace(1, 0, nb); return e
def reverb(x, secs=1.6, wet=0.3):
    n = int(secs * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (secs * SR / 6)); ir = lp(ir, 3500); ir /= np.abs(ir).sum() ** 0.5 * 4
    return x * (1 - wet) + fftconvolve(x, ir)[: len(x)] * wet * 3
voice = np.zeros((N, 2)); fx = np.zeros((N, 2)); bed = np.zeros((N, 2)); mus = np.zeros((N, 2))
for k in [l.split("\t")[0] for l in open("vo_lines.tsv") if l.strip()]: put(voice, load(f"assets/vo/{k}.wav"), T[k], 0)
# ---- Silent Night (Gruber, 1818: public domain), our own synthesized rendition ----
NOTE = {"C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.0, "A4": 440.0, "B4": 493.88, "C5": 523.25, "D5": 587.33}
MEL = [("G4", 3), ("A4", 1), ("G4", 2), ("E4", 6), ("G4", 3), ("A4", 1), ("G4", 2), ("E4", 6), ("D5", 4), ("D5", 2), ("B4", 6), ("C5", 4), ("C5", 2), ("G4", 6),
       ("A4", 4), ("A4", 2), ("C5", 3), ("B4", 1), ("A4", 2), ("G4", 3), ("A4", 1), ("G4", 2), ("E4", 6)]
def musicbox(f, d):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * (3 + 2.5 * m)) / m for m in (1, 2, 3.01, 4.2)); return x * np.minimum(1, t / 0.004)
def choir(f, d):
    t = t_(d); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t); ph = 2 * np.pi * np.cumsum(f * vib) / SR
    x = sum(np.sin(ph * m) * a for m, a in ((1, 1), (2, 0.5), (3, 0.25), (4, 0.12))); x = lp(x, 1800); return x * env(len(t), 0.08, min(0.25, d / 3))
def render(fn, notes, eighth, octave=1.0):
    out = np.zeros(int(sum(n for _, n in notes) * eighth * SR + 3 * SR)); t = 0
    for nm, n in notes:
        d = n * eighth; x = fn(NOTE[nm] * octave, d + (1.0 if fn is musicbox else 0.05)); i = int(t * SR); out[i:i + len(x)] += x[: len(out) - i]; t += d
    return out / (np.abs(out).max() + 1e-9)
tS, tB = W("singing"), W("back")
ger = reverb(render(musicbox, MEL[:8], 0.27), 1.8, 0.35); put(fx, ger, tS - 0.2, -10, 0.45)                       # the Germans start (right)
brit = reverb(render(choir, MEL[:8], 0.27, 0.5), 2.0, 0.4); put(fx, brit, tB - 0.1, -12, -0.45)                  # the British answer (left), lower
put(fx, reverb(render(musicbox, MEL[8:], 0.3), 2.0, 0.4), T["f1"] + 0.3, -9, 0.0)                                  # the ending: the tune comes back
# ---- beds: night wind at the front; HQ room; 1915 guns ----
wind = load("assets/sfx/amb_wind.wav"); wb = np.concatenate([wind] * 3)[: N]; e = np.ones(N); i0, i1 = int((T["t1"] + 0.2) * SR), int((W("artillery") - 0.1) * SR); e[i0:i1] = 0.2; bed += wb * e[:, None] * db(-14)
tr = t_(W("artillery") - T["t1"] - 0.4); room = lp(rng.standard_normal(len(tr)), 250) * 0.4 * env(len(tr), 0.2, 0.2); put(bed, room, T["t1"] + 0.2, -16)
art = np.zeros((N, 2))
for k in range(7): put(art, load("assets/sfx/boom.wav"), W("artillery") + 0.1 + k * 0.33, -6 - (k % 3) * 2 - k, [-0.6, 0.4, -0.1][k % 3])
fe = np.ones(N); a0, a1 = int((T["f1"] - 0.6) * SR), int((T["f1"] + 0.4) * SR); fe[a0:a1] = np.linspace(1, 0.05, a1 - a0); fe[a1:] = 0.05; fx += art * fe[:, None]
# distant guns at the start (the war before the truce)
for k in range(4): put(fx, lp(load("assets/sfx/boom.wav"), 600), 1.0 + k * 2.4, -18, [-0.5, 0.5][k % 2])
# ---- effects ----
sfx = lambda n: load(f"assets/sfx/{n}.wav")
put(fx, sfx("whoosh_b"), T["s1_e"] - 0.55, -9)
for i in range(9): put(fx, sfx("tick"), W("candles") + i * 0.12, -16, 0.4)
put(fx, sfx("shimmer"), W("trees") - 0.05, -12, 0.4)
put(fx, sfx("whoosh_a"), W("back") - 0.25, -12); put(fx, sfx("pop"), W("merry") - 0.05, -9, 0.4)
for k in range(4): put(fx, sfx(f"step_concrete_{k % 2}"), W("climbs") + 0.2 + k * 0.5, -14, 0.3)
# "Nobody shoots": deliberate silence (a thud here read as a gunshot)
put(fx, sfx("whoosh_c"), T["p1"] - 0.1, -9); put(fx, sfx("riser"), W("went") - 0.4, -14)
for i in range(6): put(fx, sfx("ding"), W("went") + i * 0.42, -18 - i, 0)
put(fx, sfx("laugh_room"), T["p2"] + 0.2, -18); put(fx, sfx("pop"), W("cigarettes"), -12); put(fx, sfx("pop"), W("cigarettes") + 0.3, -12)
put(fx, sfx("rustle_1"), W("buried"), -10)
for k in range(3): put(fx, sfx("tick"), W("ball") + 0.1 + k * 0.5, -6)
put(fx, sfx("ding"), W("beef") - 0.05, -8)
put(fx, sfx("whoosh_b"), T["t1"], -8); put(fx, sfx("stamp"), W("next", 0, "t1"), -4)
put(fx, sfx("whoosh_a"), T["f1"] - 0.1, -10); put(fx, sfx("gold_chime"), W("somebody") - 0.05, -6)
for i in range(9): put(fx, sfx("tick"), T["f1"] + 1.0 + i * 0.18, -18, 0.3)
# ---- score: soft tension pad under the war, silence when nobody shoots, warm cue for the payoff ----
mc = load("/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/acestep/ripple2/cueB.wav")
a = mc[int(2 * SR): int(2 * SR) + int((W("candles") - 0.3) * SR)]; put(mus, a * env(len(a), 1.0, 1.2)[:, None], 0.2, -16)
b = mc[int(34 * SR): int(34 * SR) + int((T["t1"] - T["p1"] + 0.4) * SR)]; put(mus, b * env(len(b), 0.8, 0.5)[:, None], T["p1"], -10)
v = np.abs(voice).mean(1); w = int(0.05 * SR); en = np.clip(np.convolve(v, np.ones(w) / w, mode="same") / (np.percentile(v[v > 1e-4], 90) + 1e-9), 0, 1)
mus *= (db(-8) ** en)[:, None]; bed *= (db(-3) ** en)[:, None]; fxa = np.zeros_like(fx); fxa[:] = fx; fxm = fxa * (db(-3) ** en)[:, None]
out = (voice + mus + bed + fxm)[: int(D * SR)]; n = len(out); out[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))[:, None]
sf.write("assets/mix_raw.wav", out.astype(np.float32), SR, subtype="FLOAT"); print("ok", round(n / SR, 2))
