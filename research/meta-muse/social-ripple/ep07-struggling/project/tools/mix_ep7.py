"""Ep7 mix: narrator (Kokoro) + acted character lines (Gemini TTS), real recorded footsteps (licensed), per-set ambience,
weather-reveal sounds, 4 ACE-Step cues that follow the emotional arc, voice ducking. Writes assets/mix_raw.wav; loudnorm by caller."""
import json, os, glob
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
from scipy.ndimage import uniform_filter1d
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR = 48000
SCR = "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad"
LIB, AMB, SFX = f"{SCR}/realfoley/lib", f"{SCR}/realfoley/amb", os.path.join(ROOT, "assets/sfx")
CUE = {"L": f"{SCR}/acestep/ripple4/cueL.wav", "W": f"{SCR}/acestep/ripple4/cueW.wav", "G": f"{SCR}/acestep/ripple6/cueG.wav", "O": f"{SCR}/acestep/ripple5/cueO.wav"}
db = lambda x: 10 ** (x / 20); rng = np.random.default_rng(707)
src = open(os.path.join(ROOT, "assets/t.js")).read()
DT = json.loads(src.split("window.DT = ")[1].split("; window.SC")[0]); SCN = json.loads(src.split("window.SC = ")[1].split("; window.DUR")[0]); D = float(src.split("window.DUR = ")[1].split(";")[0])
N = int(D * SR) + SR; S = lambda k: DT[k][0]; E = lambda k: DT[k][0] + DT[k][1]; W = lambda k, s: DT[k][0] + s
def load(p):
    a, sr = sf.read(p); a = np.stack([a, a], 1) if a.ndim == 1 else a[:, :2]
    return resample_poly(a, SR, sr, axis=0) if sr != SR else a
def lpf(a, f): return sosfilt(butter(2, f, "low", fs=SR, output="sos"), a, axis=0)
def norm(a, ref=-12):
    w = int(0.06 * SR); m = (a ** 2).mean(1); c = np.convolve(m, np.ones(w) / w, "same").max() ** 0.5; return a / (c + 1e-9) * db(ref)
def put(buf, x, at, g=0, p=0):
    if p: x = np.stack([x[:, 0] * np.sqrt(1 - p), x[:, 1] * np.sqrt(1 + p)], 1)
    i = int(at * SR); j = min(len(buf), i + len(x))
    if i < 0: x = x[-i:]; i = 0
    if j > i: buf[i:j] += x[: j - i] * db(g)
sfx = lambda n: load(os.path.join(SFX, n + ".wav"))
# ---------------- VO ----------------
def speech_match(a, target=-22.0):
    """acted lines: match the narrator's speech level (median of active 60 ms windows) and add a touch of presence"""
    m = a.mean(1); w = int(0.06 * SR); r = np.convolve(m ** 2, np.ones(w) / w, "same") ** 0.5; act = r[r > r.max() * 0.1]
    g = target - 20 * np.log10(np.median(act) + 1e-9); b = a * db(g)
    pres = sosfilt(butter(2, [2500, 6000], "band", fs=SR, output="sos"), b, axis=0); return b + pres * 0.25
VO = np.zeros((N, 2))
for lid, (st, d) in DT.items():
    a = load(os.path.join(ROOT, "assets/vo", lid + ".wav")); put(VO, a if lid.startswith("n") else speech_match(a), st, 0)
# ---------------- set timeline (from the shot list) ----------------
F = json.load(open(os.path.join(ROOT, "foley.json"))); shots = F["shots"]
segs = []
for i, (t0, s) in enumerate(shots):
    t1 = shots[i + 1][0] if i + 1 < len(shots) else D
    if segs and segs[-1][2] == s: segs[-1][1] = t1
    else: segs.append([t0, t1, s])
# ---------------- foley: steps ----------------
FOL = np.zeros((N, 2)); bank = lambda pat: [norm(load(f)) for f in sorted(glob.glob(os.path.join(LIB, pat)))]
STONE, WOOD = bank("cobble_*.wav")[:5], [lpf(x, 3800) for x in bank("oga_wood_*.wav")] if glob.glob(os.path.join(LIB, "oga_wood_*.wav")) else bank("cobble_*.wav")
li = 0
for e in F["steps"]:
    lib, g = (WOOD, -14) if e["set"] in ("cafe", "bakery") else (STONE, -17)
    x = lib[li % len(lib)]; li += 1 + int(rng.integers(0, 2)); pan = float(np.clip((e["x"] - 960) / 1400, -0.6, 0.6))
    put(FOL, x, e["t"], g + rng.uniform(-1.2, 1.2), pan); put(FOL, lpf(lpf(x, 220), 220), e["t"], g - 2, pan)
# ---------------- sfx ----------------
pop, tick, whoosh, whooshC, chime, shimmer, boom, bell, gull, scrib, sw, tap, sparkle, heart = (sfx(n) for n in ["pop", "tick", "whoosh_a", "whoosh_c", "gold_chime", "shimmer", "boom", "shop_bell", "gull", "scribble", "swoosh_send", "tap", "sparkle", "heartbeat"])
popS = lpf(pop, 2600)
# cold open: storms pop over half the square
for k in range(7): put(FOL, popS, W("n02", 1.15) + k * 0.14, -19 - k * 0.4, [-0.5, -0.3, 0.1, 0.4, -0.2, 0.5, 0][k])
put(FOL, boom[: int(1.2 * SR)], W("n02", 1.2), -26)
# bedroom wake + street weather row
put(FOL, chime, W("n03", 0.9), -22); [put(FOL, popS, W("n03", 3.0) + i * 0.15, -21, [-0.5, -0.2, 0.2, 0.5][i]) for i in range(4)]
for w in (0, 1.84, 2.48, 2.88): put(FOL, whoosh, W("n04", w) - 0.08, -27)
for w in (1.0, 3.3, 4.6): put(FOL, tick, W("n05", w), -16)
put(FOL, popS, S("str_01") - 0.1, -21)
# montage: each new cloud ticks the counter
for w in (W("n07", 0.7), W("n07", 1.4), W("n08", 3.05), W("n09", 3.0), W("n10", 2.7)): put(FOL, popS, w - 0.05, -20); put(FOL, tick, w + 0.05, -20)
put(FOL, bell, S("bea_01") - 0.4, -22); put(FOL, gull, S("finn_01") + 0.3, -26, 0.4); put(FOL, gull, W("n09", 1.0), -29, -0.4)
put(FOL, scrib, W("n12", 1.5), -22); put(FOL, scrib, W("n12", 4.2), -22); put(FOL, tick, W("n12", 5.6), -18)
put(FOL, sparkle, W("n14", 1.0), -22); put(FOL, sw, W("n14", 2.65), -22); put(FOL, sw, W("n14", 5.2), -24)
for k in range(6): put(FOL, tap, S("n15") + k * 0.2, -24)
put(FOL, popS, W("n15", 1.35), -22)
# the midpoint: Ana's storm (silence first, a heartbeat, then thunder)
put(FOL, heart, W("n18", -0.1), -20); put(FOL, boom, W("n18", 0.62), -13); put(FOL, whoosh[::-1].copy(), W("n18", 0.1), -20)
put(FOL, bell, S("theo_01") - 1.0, -22)
for i in range(20): put(FOL, tick, W("n22", 2.9) + i * 0.04, -28)
for i in range(10): put(FOL, tick, W("n22", 6.3) + i * 0.05, -26)
put(FOL, chime, W("n23", 1.5), -24); put(FOL, shimmer, W("n25", 1.35), -20); put(FOL, chime, S("n27"), -24)
put(FOL, sparkle, W("n29", 0.3), -24)
for s in segs[1:]: put(FOL, whooshC, s[0] - 0.12, -30)
# ---------------- ambience beds per set ----------------
BED = np.zeros((N, 2))
def bed(path, t0, t1, g, fade=0.25, off=0.0):
    a = load(path); L = int((t1 - t0) * SR)
    if L <= 0: return
    reps = int(np.ceil((L + int(off * SR)) / len(a))) + 1; x = np.tile(a, (reps, 1))[int(off * SR): int(off * SR) + L].copy()
    f = min(int(fade * SR), L // 2); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; put(BED, x, t0, g)
AMBS = {"square": (os.path.join(SFX, "amb_island_busy.wav"), -27), "street": (os.path.join(SFX, "amb_island.wav"), -27), "bakery": (os.path.join(SFX, "amb_shop.wav"), -29), "cafe": (os.path.join(SFX, "amb_shop.wav"), -31),
        "harbour": (f"{AMB}/mk_1185.wav", -25), "site": (os.path.join(SFX, "amb_island.wav"), -28), "bench": (f"{AMB}/mk_2472.wav", -29), "bedroom": (f"{AMB}/mk_2472.wav", -31), "host": (f"{AMB}/mk_1185.wav", -31), "reflect": (os.path.join(SFX, "amb_shop.wav"), -34)}
for t0, t1, s in segs:
    if s in AMBS: p, g = AMBS[s]; bed(p, t0, t1, g, off=(t0 * 1.7) % 20)
    if s == "harbour": bed(f"{AMB}/mk_1247.wav", t0, t1, -33)
# ---------------- music: follows the emotional arc ----------------
MUS = np.zeros((N, 2))
def cue(name, t0, t1, g, src0=0.0, fi=1.5, fo=1.5):
    a = load(CUE[name]); L = int((t1 - t0) * SR); s0 = int(src0 * SR); x = a[s0: s0 + L].copy()
    if len(x) < L: x = np.concatenate([x, a[: L - len(x)]])
    fi_, fo_ = min(int(fi * SR), L // 2), min(int(fo * SR), L // 2); x[:fi_] *= np.linspace(0, 1, fi_)[:, None]; x[-fo_:] *= np.linspace(1, 0, fo_)[:, None] ** 1.5; put(MUS, x, t0, g)
cue("G", 0.2, SCN["S03"] + 0.8, -19, 0, fi=0.5)                         # wonder: seeing weather, the rules
cue("O", SCN["S03"], S("n18") + 0.2, -21, 10.0, fi=1.0, fo=0.3)         # busy/curious: the montage, the research — cut at the storm
cue("L", W("n18", 1.8), S("ana_03") + 1.5, -19, 20.0, fi=2.5)           # lonely piano: Ana's storm, "by myself"
cue("W", S("ana_03"), SCN["S08"] + 0.6, -20, 0, fi=2.5)                 # warm: asking, yeses, the reflection
cue("G", SCN["S08"], W("n29", 0) + 0.8, -22, 40.0, fi=1.5)              # Nia's takeaway
cue("W", S("n29") - 0.4, D, -17, 60.0, fi=1.5, fo=3.0)                  # the close
v = np.abs(VO).mean(1); e = uniform_filter1d(v, int(0.12 * SR)); e = e / (np.percentile(e[e > 1e-4], 90) + 1e-9)
duck = np.clip(e * 3, 0, 1); duck = uniform_filter1d(duck, int(0.35 * SR)); MUS *= db(-8 * duck)[:, None]; BED *= db(-4 * duck)[:, None]
BED = sosfilt(butter(2, 180, "high", fs=SR, output="sos"), BED, axis=0)
out = (VO + FOL + BED + MUS)[: int(D * SR)]
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), out.astype(np.float32), SR, subtype="FLOAT"); print("ok", round(float(np.abs(out).max()), 3), "len", round(len(out) / SR, 2), "segs", len(segs))
