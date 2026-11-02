"""Demo 1 mix v2: real recorded foley (licensed), quieter grass, real cobble steps, realistic eat/drink."""
import json, os, glob
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SFX = os.path.join(ROOT, "assets/sfx"); SR = 48000; D = 20.0
LIB = "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/realfoley/lib"
MUS = "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/acestep/ripple3/cueA.wav"
rng = np.random.default_rng(11); db = lambda x: 10 ** (x / 20)
def load(p):
    a, sr = sf.read(p); a = np.stack([a, a], 1) if a.ndim == 1 else a
    return resample_poly(a, SR, sr, axis=0) if sr != SR else a
def norm(a, ref=-12):  # loudness-match one-shots on their loudest 60 ms (RMS)
    w = int(0.06 * SR); m = (a ** 2).mean(1); c = np.convolve(m, np.ones(w) / w, "same").max() ** 0.5; return a / (c + 1e-9) * db(ref)
def lpf(a, f): return sosfilt(butter(2, f, "low", fs=SR, output="sos"), a, axis=0)
def put(buf, x, at, g=0, p=0):
    if p: x = np.stack([x[:, 0] * np.sqrt(1 - p), x[:, 1] * np.sqrt(1 + p)], 1)
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i] * db(g)
bank = lambda pat: [norm(load(f)) for f in sorted(glob.glob(os.path.join(LIB, pat)))]
STEP = {"grass": ([lpf(x, 3500) for x in bank("oga_grass_*.wav")], -1.0), "stone": ([x for x in bank("cobble_*.wav")][:5], -11.0), "wood": ([lpf(x, 3800) for x in bank("oga_wood_*.wav")], 3.0)}
GRIT = bank("oga_gravel_*.wav")  # a little grit under shoe-on-stone = cobbles
BITE, CHEW = [lpf(x, 7000) for x in bank("crispR_*.wav")], [lpf(lpf(x, 1600), 1600) for x in bank("crunchR_*.wav")]
SIP, SLURP, AHH = norm(load(f"{LIB}/mk_1307.wav")), norm(load(f"{LIB}/mk_3207.wav")), norm(load(f"{LIB}/mk_2832.wav"))
N = int(D * SR); out = np.zeros((N, 2)); FOL = out; F = json.load(open(os.path.join(ROOT, "foley.json"))); last = {}
for e in F["events"]:
    k, t, pan = e["kind"], e["t"], e["pan"] * 0.5
    if k == "step":
        s = e["surface"]; lib, g = STEP[s]; i = (last.get(s, -1) + 1 + rng.integers(0, 2)) % len(lib); last[s] = i
        put(out, lib[i], t, e["gain"] + g + rng.uniform(-1.2, 1.2), pan)
        if s in ("stone", "grass", "wood"): put(out, lpf(lpf(lib[i], 220), 220), t, e["gain"] - 2, pan)  # body weight under every step
    elif k == "crunch": put(out, BITE[(e.get("var", 0) * 3) % len(BITE)], t, -14, pan)
    elif k == "chew":  # closed-mouth chewing: 3 soft crunches in rhythm
        for j in range(3): put(out, CHEW[(e.get("var", 0) * 3 + j) % len(CHEW)], t + j * 0.16, -27 - 2 * j, pan)
    elif k == "gulp": sp = SIP[: int(0.9 * SR)].copy(); sp[-int(0.2 * SR):] *= np.linspace(1, 0, int(0.2 * SR))[:, None]; put(out, sp, t - 0.1, -13, pan)
    elif k == "slurp": sl = SLURP[: int(0.55 * SR)].copy(); sl[-int(0.15 * SR):] *= np.linspace(1, 0, int(0.15 * SR))[:, None]; put(out, sl, t, -17, pan)
    elif k == "sip_ahh": pass  # no cartoon "ahh"
from scipy.signal import fftconvolve
ir_t = np.arange(int(0.3 * SR)) / SR; IR = np.stack([rng.standard_normal(len(ir_t)), rng.standard_normal(len(ir_t))], 1) * np.exp(-ir_t / 0.07)[:, None]; IR /= np.abs(IR).sum(0)[None] ** 0.5 * 6
out = out + np.stack([fftconvolve(out[:, c], IR[:, c])[:N] for c in (0, 1)], 1) * 0.35
MOOD = {"hype": ("boom", -14), "money": ("ka_ching", -15), "alert": ("stamp", -12), "calm": ("gold_chime", -16), "sad": ("steel_down", -16), "fact": ("typing", -18), "funny": ("pop", -16), "question": ("pop", -13), "title": ("whoosh_b", -14)}
for c in F.get("cards", []):
    if c["mood"] in MOOD: n, g = MOOD[c["mood"]]; put(out, load(os.path.join(SFX, n + ".wav")), c["t"] - 0.03, g)
bed = load(os.path.join(SFX, "amb_island.wav"))[: N]; put(out, bed, 0, -25)
if os.path.exists(MUS): m = load(MUS)[int(20 * SR): int(20 * SR) + N].copy(); m[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))[:, None]; put(out, m, 0, -25)
sf.write(os.path.join(ROOT, "assets/mix_raw_v2.wav"), out.astype(np.float32), SR, subtype="FLOAT"); print("ok", float(np.abs(out).max()))
