"""Ep6 mix: VO (narrator + characters), real recorded foley (licensed), ambience beds, 3 music cues with crossfades + voice ducking.
Writes assets/mix_raw.wav (float). Then loudnorm to -14 LUFS → assets/mix.wav (done by the caller)."""
import json, os, glob
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
from scipy.ndimage import uniform_filter1d
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR = 48000
SCR = "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad"
LIB, AMB, SFX = f"{SCR}/realfoley/lib", f"{SCR}/realfoley/amb", os.path.join(ROOT, "assets/sfx")
CUE = {"L": f"{SCR}/acestep/ripple4/cueL.wav", "W": f"{SCR}/acestep/ripple4/cueW.wav", "G": f"{SCR}/acestep/ripple6/cueG.wav"}
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

from scipy.signal import fftconvolve
def verb(a, dur, decay, mix):
    n = int(dur * SR); t = np.arange(n) / SR; ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)], 1) * np.exp(-t / decay)[:, None]; ir /= np.abs(ir).sum(0)[None] ** 0.5 * 4
    w = np.stack([fftconvolve(a[:, c], ir[:, c])[: len(a) + n] for c in (0, 1)], 1); d = np.zeros_like(w); d[: len(a)] = a; return d * (1 - mix) + w * mix
# ---------------- VO (narrator dry; spoken lines -3) ----------------
VO = np.zeros((N, 2)); plan = json.load(open(os.path.join(ROOT, "tools/plan.json")))
for lid, st, L in plan["lines"]:
    a = load(os.path.join(ROOT, "assets/vo", lid + ".wav")); put(VO, a, st, 0 if lid.startswith("n") else -3.0)
# ---------------- foley ----------------
FOL = np.zeros((N, 2)); F = json.load(open(os.path.join(ROOT, "foley.json")))
bank = lambda pat: [norm(load(f)) for f in sorted(glob.glob(os.path.join(LIB, pat)))]
STEP = {"stone": (bank("cobble_*.wav")[:5], -11.0), "wood": ([lpf(x, 3800) for x in bank("oga_wood_*.wav")], 3.0), "grass": ([lpf(x, 3500) for x in bank("oga_grass_*.wav")], -1.0)}
last = {}
for e in F["events"]:
    if e["kind"] == "step":
        s = e["surface"]; lib, g = STEP[s]; i = (last.get(s, -1) + 1 + rng.integers(0, 2)) % len(lib); last[s] = i; pan = e["pan"] * 0.6
        put(FOL, lib[i], e["t"], e["gain"] + g + rng.uniform(-1.2, 1.2), pan); put(FOL, lpf(lpf(lib[i], 220), 220), e["t"], e["gain"] - 2, pan)
sfx = lambda n: load(os.path.join(SFX, n + ".wav"))
chime, whoosh, down, pop = sfx("gold_chime"), sfx("whoosh_b"), sfx("steel_down"), sfx("pop")
# the threads: a reversed swell into a bright shimmer (cold open, then again when he starts to glow)
for t0, g in ((F["burst"][0], 0), (F["burst"][1], -3)):
    put(FOL, whoosh[::-1].copy(), t0 - 0.55, -15 + g); put(FOL, chime, t0, -16 + g)
    for k in range(6): put(FOL, chime, t0 + 0.12 + k * 0.11, -27 + g - k, rng.uniform(-0.6, 0.6))
# the pull: a stretched downward swoop, then the houses blink out one by one; pushing it back = reversed swoop + chime
p0, p1 = F["pull"]; put(FOL, down, p0, -14); put(FOL, whoosh, p0 + 0.05, -16)
for k in range(7): put(FOL, lpf(pop, 1800), T["n20"] - 0.4 + k * 0.32, -20 - k * 0.5, [-0.5, 0.3, -0.2, 0.5, -0.4, 0.2, 0][k])
put(FOL, whoosh[::-1].copy(), p1 - 0.5, -15); put(FOL, chime, p1, -17)
# Theo walks in: the shop bell
put(FOL, sfx("ding"), T["theo_01"] - 0.35, -20)
MOOD = {"title": ("whoosh_b", -18), "calm": ("gold_chime", -25), "sad": ("steel_down", -27), "fact": ("typing", -27), "funny": ("pop", -22), "plain": ("pop", -26)}
for c in F.get("cards", []):
    if c["mood"] in MOOD and c.get("zone") != "source": n, g = MOOD[c["mood"]]; put(FOL, load(os.path.join(SFX, n + ".wav")), c["t"] - 0.03, g)
# ---------------- beds ----------------
BED = np.zeros((N, 2))
def bed(path, t0, t1, g, fade=1.2, off=0.0):
    a = load(path); L = int((t1 - t0) * SR)
    if L <= 0: return
    reps = int(np.ceil((L + int(off * SR)) / len(a))) + 1; x = np.tile(a, (reps, 1))[int(off * SR): int(off * SR) + L].copy()
    f = min(int(fade * SR), L // 2); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; put(BED, x, t0, g)
night, shop, birds, sea, rain = os.path.join(SFX, "amb_night.wav"), os.path.join(SFX, "amb_shop.wav"), f"{AMB}/mk_2472.wav", f"{AMB}/mk_1185.wav", f"{AMB}/mk_1247.wav"
bed(night, 0, T["s02"], -27, fade=0.3); bed(shop, T["s02"], T["n04"], -30, fade=0.3); bed(night, T["n04"], T["n08"], -27, off=10, fade=0.3)
bed(shop, T["n08"], T["n10"], -30, off=5, fade=0.3); bed(night, T["n10"], T["n17"], -27, off=30, fade=0.3); bed(sea, T["s05"], T["n17"], -27, fade=0.6)
bed(rain, T["n17"], T["n18"], -20, fade=0.3); bed(sea, T["n17"], W_ := T["n17"] + 5.0, -26, fade=0.3)
bed(shop, T["n18"], T["n19"] - 3.0, -31, off=12, fade=0.3); bed(night, T["n19"], T["s07"], -27, off=50, fade=0.4)
bed(birds, T["s07"], T["theo_01"] - 0.3, -30, fade=0.4); bed(shop, T["theo_01"] - 0.3, T["n28"], -31, off=20, fade=0.3); bed(sea, T["n28"], E("n28") + 0.8, -27, off=10); bed(birds, T["s08"], D, -30, off=40)
# ---------------- music ----------------
MUS = np.zeros((N, 2))
def cue(name, t0, t1, g, src0=0.0, fi=1.5, fo=1.5):
    a = load(CUE[name]); L = int((t1 - t0) * SR); s0 = int(src0 * SR); x = a[s0: s0 + L].copy()
    if len(x) < L: x = np.concatenate([x, a[: L - len(x)]])
    fi_, fo_ = min(int(fi * SR), L // 2), min(int(fo * SR), L // 2); x[:fi_] *= np.linspace(0, 1, fi_)[:, None]; x[-fo_:] *= np.linspace(1, 0, fo_)[:, None] ** 1.5; put(MUS, x, t0, g)
cue("G", 0.3, T["n07"] + 0.6, -17, 0, fi=0.6)                      # wonder: the threads, the rules
cue("W", T["n07"], T["s05"] + 0.8, -21, 0)                          # warm: Theo, the cascade
cue("L", T["s05"], p0 + 0.3, -19, 30.0, fo=0.25)                    # piano: the storm, Kai — cut dead at the pull
cue("G", p1 + 0.4, T["s07"] + 0.8, -21, 60.0, fi=3.5)                # wonder returns, quieter: picture it gone
cue("W", T["s07"], D, -18, 90.0, fi=2.0, fo=2.5)                    # warm: dawn, the note, the end
v = np.abs(VO).mean(1); e = uniform_filter1d(v, int(0.12 * SR)); e = e / (np.percentile(e[e > 1e-4], 90) + 1e-9)
duck = np.clip(e * 3, 0, 1); duck = uniform_filter1d(duck, int(0.35 * SR)); MUS *= db(-8 * duck)[:, None]; BED *= db(-4 * duck)[:, None]
BED = sosfilt(butter(2, 180, "high", fs=SR, output="sos"), BED, axis=0)   # keep the beds out of the narrator's low end
out = (VO + FOL + BED + MUS)[: int(D * SR)]
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), out.astype(np.float32), SR, subtype="FLOAT"); print("ok", round(float(np.abs(out).max()), 3), "len", round(len(out) / SR, 2))
