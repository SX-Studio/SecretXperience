"""Ep4 mix: VO (narrator + characters), real recorded foley (licensed), ambience beds, 3 music cues with crossfades + voice ducking.
Writes assets/mix_raw.wav (float). Then loudnorm to -14 LUFS → assets/mix.wav (done by the caller)."""
import json, os, glob
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
from scipy.ndimage import uniform_filter1d
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR = 48000
SCR = "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad"
LIB, AMB, SFX = f"{SCR}/realfoley/lib", f"{SCR}/realfoley/amb", os.path.join(ROOT, "assets/sfx")
CUE = {"L": f"{SCR}/acestep/ripple4/cueL.wav", "W": f"{SCR}/acestep/ripple4/cueW.wav", "A": f"{SCR}/acestep/ripple3/cueA.wav"}
db = lambda x: 10 ** (x / 20); rng = np.random.default_rng(404)
T = json.loads(open(os.path.join(ROOT, "assets/t.js")).read().split("window.T=")[1].split(";")[0]); D = T["D"]; N = int(D * SR) + SR
E = lambda k: T[k + "_e"]
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
def env_track(keys):  # [(t, dB)] → per-sample gain (linear interp in dB)
    t = np.arange(N) / SR; ts = [k[0] for k in keys]; gs = [k[1] for k in keys]; return db(np.interp(t, ts, gs))[:, None]

# ---------------- VO ----------------
VO = np.zeros((N, 2)); plan = json.load(open(os.path.join(ROOT, "tools/plan.json")))
for lid, st, L in plan["lines"]:
    a = load(os.path.join(ROOT, "assets/vo", lid + ".wav")); put(VO, a, st, 0 if lid.startswith("n") else -3.0)

# ---------------- foley ----------------
FOL = np.zeros((N, 2)); F = json.load(open(os.path.join(ROOT, "foley.json")))
bank = lambda pat: [norm(load(f)) for f in sorted(glob.glob(os.path.join(LIB, pat)))]
STEP = {"grass": ([lpf(x, 3500) for x in bank("oga_grass_*.wav")], -1.0), "stone": (bank("cobble_*.wav")[:5], -11.0), "wood": ([lpf(x, 3800) for x in bank("oga_wood_*.wav")], 3.0)}
last = {}
for e in F["events"]:
    if e["kind"] == "step":
        s = e["surface"]; lib, g = STEP[s]; i = (last.get(s, -1) + 1 + rng.integers(0, 2)) % len(lib); last[s] = i; pan = e["pan"] * 0.6
        put(FOL, lib[i], e["t"], e["gain"] + g + rng.uniform(-1.2, 1.2), pan); put(FOL, lpf(lpf(lib[i], 220), 220), e["t"], e["gain"] - 2, pan)
    elif e["kind"] == "knock":
        put(FOL, norm(load(f"{AMB}/mk_197.wav")), e["t"], -9, 0.1)
# card ticks: soft, not playful
MOOD = {"title": ("whoosh_b", -17), "calm": ("gold_chime", -24), "sad": ("steel_down", -26), "fact": ("typing", -26), "funny": ("pop", -21), "question": ("pop", -19), "hype": ("pop", -17), "alert": ("stamp", -21)}
for c in F.get("cards", []):
    if c["mood"] in MOOD and c.get("zone") != "source": n, g = MOOD[c["mood"]]; put(FOL, load(os.path.join(SFX, n + ".wav")), c["t"] - 0.03, g)
# day flips: a quiet paper tick (from the counter keys in the story: approximate with T anchors)
flips = [T["n06"], T["n10"], T["n11"], T["n13"], T["n15"]]
for t in flips: put(FOL, load(os.path.join(SFX, "pop.wav")), t, -28)
# flash-forward whoosh + ripple chimes at the payoff
put(FOL, load(os.path.join(SFX, "whoosh_b.wav")), T["n03"] + (E("n03") - T["n03"]) * 0.62, -15)
for t in [T["theo_04"] + 0.3, T["n34"] + 0.6, T["n34"] + 1.6, T["n34"] + 2.4, T["n34"] + 3.1, T["n34"] + 3.8, T["n34"] + 4.4]:
    put(FOL, load(os.path.join(SFX, "gold_chime.wav")), t, -21 + rng.uniform(-2, 0), rng.uniform(-0.4, 0.4))

# ---------------- ambience beds ----------------
BED = np.zeros((N, 2))
def bed(path, t0, t1, g, fade=1.2, off=0.0):
    a = load(path); L = int((t1 - t0) * SR)
    if L <= 0: return
    reps = int(np.ceil((L + int(off * SR)) / len(a))) + 1; x = np.tile(a, (reps, 1))[int(off * SR): int(off * SR) + L].copy()
    f = min(int(fade * SR), L // 2); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; put(BED, x, t0, g)
birds, sea, rain = f"{AMB}/mk_2472.wav", f"{AMB}/mk_1185.wav", f"{AMB}/mk_1247.wav"
bed(birds, 0, T["s08"], -31)                      # town mornings
bed(sea, T["n14"] - 0.3, E("n14") + 0.4, -24)     # pier
bed(sea, T["s07"] + 8, T["s08"] + 0.5, -30, off=5) # lighthouse at night
bed(rain, T["s09"], E("ana_06") + 1.0, -19, fade=0.8)
bed(birds, E("ana_06") + 0.6, D, -31, off=60)
bed(sea, T["n29"] - 0.2, E("n30") + 0.8, -25, off=12)

# ---------------- music ----------------
MUS = np.zeros((N, 2))
def cue(name, t0, t1, g, src0=0.0, fi=1.5, fo=1.5):
    a = load(CUE[name]); L = int((t1 - t0) * SR); s0 = int(src0 * SR)
    x = a[s0: s0 + L].copy()
    if len(x) < L: x = np.concatenate([x, a[: L - len(x)]])
    fi_, fo_ = min(int(fi * SR), L // 2), min(int(fo * SR), L // 2); x[:fi_] *= np.linspace(0, 1, fi_)[:, None]; x[-fo_:] *= np.linspace(1, 0, fo_)[:, None] ** 1.5; put(MUS, x, t0, g)
cue("L", 0, T["s05"] + 1.0, -17, 0, fi=0.6)                       # lonely piano: hook, title, Nia, day 1
cue("A", T["s05"], T["s07"] + 1.2, -21, 22.0)                     # playful island: Mo's window, the research, "hey"
cue("L", T["s07"], E("ana_06") + 1.5, -18, 70.0)                  # doubt, the twist, the rain
cue("W", E("ana_06") - 0.4, D, -17, 90.0, fi=2.0, fo=2.5)            # warm: montage, takeaways, day 30, the end
# title swell
sw = env_track([(0, 0), (T["s02"] - 0.2, 0), (T["s02"] + 0.4, 4), (T["s03"] - 0.2, 4), (T["s03"] + 0.5, 0), (D, 0)]); MUS *= sw
# voice ducking: music and beds dip under speech (smoothed envelope)
v = np.abs(VO).mean(1); e = uniform_filter1d(v, int(0.12 * SR)); e = e / (np.percentile(e[e > 1e-4], 90) + 1e-9)
duck = np.clip(e * 3, 0, 1); duck = uniform_filter1d(duck, int(0.35 * SR)); MUS *= db(-8 * duck)[:, None]; BED *= db(-4 * duck)[:, None]
out = VO + FOL + BED + MUS
out = out[: int(D * SR)]
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), out.astype(np.float32), SR, subtype="FLOAT"); print("ok", round(float(np.abs(out).max()), 3), "len", round(len(out) / SR, 2))
