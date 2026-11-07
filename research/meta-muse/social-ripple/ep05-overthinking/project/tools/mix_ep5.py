"""Ep5 mix: VO (narrator + characters), real recorded foley (licensed), ambience beds, 3 music cues with crossfades + voice ducking.
Writes assets/mix_raw.wav (float). Then loudnorm to -14 LUFS → assets/mix.wav (done by the caller)."""
import json, os, glob
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
from scipy.ndimage import uniform_filter1d
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR = 48000
SCR = "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad"
LIB, AMB, SFX = f"{SCR}/realfoley/lib", f"{SCR}/realfoley/amb", os.path.join(ROOT, "assets/sfx")
CUE = {"L": f"{SCR}/acestep/ripple4/cueL.wav", "W": f"{SCR}/acestep/ripple4/cueW.wav", "O": f"{SCR}/acestep/ripple5/cueO.wav"}
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
# ---------------- VO (narrator dry; spoken lines -3; thoughts = soft inner voice; critic = darker, longer echo) ----------------
VO = np.zeros((N, 2)); plan = json.load(open(os.path.join(ROOT, "tools/plan.json")))
for lid, st, L in plan["lines"]:
    a = load(os.path.join(ROOT, "assets/vo", lid + ".wav"))
    if lid.endswith("_t1"): a = verb(lpf(a, 5200), 0.45, 0.12, 0.35); g = -1.0
    elif lid.startswith("bea_c"): a = verb(lpf(a, 3600), 0.9, 0.25, 0.45); g = 0.0
    elif lid.startswith("n"): g = 0
    else: g = -3.0
    put(VO, a, st, g)
# ---------------- foley ----------------
FOL = np.zeros((N, 2)); F = json.load(open(os.path.join(ROOT, "foley.json")))
bank = lambda pat: [norm(load(f)) for f in sorted(glob.glob(os.path.join(LIB, pat)))]
STEP = {"stone": (bank("cobble_*.wav")[:5], -11.0), "wood": ([lpf(x, 3800) for x in bank("oga_wood_*.wav")], 3.0), "grass": ([lpf(x, 3500) for x in bank("oga_grass_*.wav")], -1.0)}
last = {}
for e in F["events"]:
    if e["kind"] == "step":
        s = e["surface"]; lib, g = STEP[s]; i = (last.get(s, -1) + 1 + rng.integers(0, 2)) % len(lib); last[s] = i; pan = e["pan"] * 0.6
        put(FOL, lib[i], e["t"], e["gain"] + g + rng.uniform(-1.2, 1.2), pan); put(FOL, lpf(lpf(lib[i], 220), 220), e["t"], e["gain"] - 2, pan)
# the crash: cold open cut dead at the freeze; full clatter when it unfreezes on day 3
CR = [norm(load(f"{AMB}/mk_{i}.wav"), -8) for i in (3158, 1812, 389, 835)]
c0, tu = F["crash"]; fz0, fz1 = F["freeze"]
pre = np.zeros((int((fz0 - c0) * SR), 2)); put(pre, CR[0], 0.0, -14); put(pre, CR[1], 0.12, -16); f = int(0.02 * SR); pre[-f:] *= np.linspace(1, 0, f)[:, None]; put(FOL, pre, c0, 0)
put(FOL, load(os.path.join(SFX, "whoosh_b.wav"))[::-1].copy(), fz0 - 0.02, -16)          # a reversed swoosh "sucks" the moment into the freeze
for k, (dt, g) in enumerate([(0.25, -13), (0.42, -15), (0.6, -15), (0.78, -17)]): put(FOL, CR[k], tu + dt, g, [-0.2, 0.25, -0.1, 0.3][k])
for k in range(7): put(FOL, CR[1][: int(0.3 * SR)], tu + 1.0 + k * 0.09 + rng.uniform(0, 0.05), -26 - k, rng.uniform(-0.5, 0.5))  # buns bouncing
# rewind whoosh, thought pops, rules ticks, the counter roll
T5 = T; put(FOL, load(os.path.join(SFX, "whoosh_b.wav")), E("n02") - 0.25, -12)
for lid, st, L in plan["lines"]:
    if lid.endswith("_t1") or lid.startswith("bea_c"): put(FOL, load(os.path.join(SFX, "pop.wav")), st - 0.05, -24)
MOOD = {"title": ("whoosh_b", -18), "calm": ("gold_chime", -25), "sad": ("steel_down", -27), "fact": ("typing", -27), "funny": ("pop", -22), "question": ("pop", -20), "hype": ("pop", -18)}
for c in F.get("cards", []):
    if c["mood"] in MOOD and c.get("zone") != "source": n, g = MOOD[c["mood"]]; put(FOL, load(os.path.join(SFX, n + ".wav")), c["t"] - 0.03, g)
ty = load(os.path.join(SFX, "typing.wav"))
for k in range(14): put(FOL, ty[: int(0.08 * SR)], T["n25"] + 0.4 + k * 0.09, -18)
# ---------------- beds ----------------
BED = np.zeros((N, 2))
def bed(path, t0, t1, g, fade=1.2, off=0.0):
    a = load(path); L = int((t1 - t0) * SR)
    if L <= 0: return
    reps = int(np.ceil((L + int(off * SR)) / len(a))) + 1; x = np.tile(a, (reps, 1))[int(off * SR): int(off * SR) + L].copy()
    f = min(int(fade * SR), L // 2); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; put(BED, x, t0, g)
birds, sea = f"{AMB}/mk_2472.wav", f"{AMB}/mk_1185.wav"
bed(birds, 0, fz0, -30, fade=0.2); bed(birds, T["s02"], T["s08"], -31, off=20); bed(sea, T["n21"], T["s08"], -26); bed(sea, T["n27"] - 0.2, E("n27") + 0.8, -26, off=10); bed(birds, T["s09"], D, -30, off=80)
# ---------------- music ----------------
MUS = np.zeros((N, 2))
def cue(name, t0, t1, g, src0=0.0, fi=1.5, fo=1.5):
    a = load(CUE[name]); L = int((t1 - t0) * SR); s0 = int(src0 * SR); x = a[s0: s0 + L].copy()
    if len(x) < L: x = np.concatenate([x, a[: L - len(x)]])
    fi_, fo_ = min(int(fi * SR), L // 2), min(int(fo * SR), L // 2); x[:fi_] *= np.linspace(0, 1, fi_)[:, None]; x[-fo_:] *= np.linspace(1, 0, fo_)[:, None] ** 1.5; put(MUS, x, t0, g)
cue("O", E("n02") - 0.3, T["s06"] + 1.0, -17, 0, fi=0.4)         # overthinking theme: days 1-3
cue("L", T["s06"], T["n21"] + 1.0, -18, 0)                        # tender piano: mum, day 5
cue("W", T["n21"], T["s08"] + 0.8, -18, 40.0)                     # warm: the hug
cue("L", T["s08"], T["n27"] + 0.8, -21, 70.0, fo=1.0)             # day 7: sparse
cue("W", T["n27"] - 0.4, D, -17, 100.0, fi=2.0, fo=2.5)           # Nia's tip, day 8, the end
sil = F.get("silence") or [T["n18"] + 0.3, T["mum_t1"]]
MUS *= env_track([(0, 0), (sil[0] - 0.3, 0), (sil[0], -14), (T["mum_t1"] + 0.6, -14), (T["mum_t1"] + 2.0, 0), (T["bea_c2"] - 0.4, 0), (T["bea_c2"], -6), (E("bea_c4") + 0.8, -6), (E("bea_c4") + 2.0, 0), (D, 0)])
v = np.abs(VO).mean(1); e = uniform_filter1d(v, int(0.12 * SR)); e = e / (np.percentile(e[e > 1e-4], 90) + 1e-9)
duck = np.clip(e * 3, 0, 1); duck = uniform_filter1d(duck, int(0.35 * SR)); MUS *= db(-8 * duck)[:, None]; BED *= db(-4 * duck)[:, None]
out = (VO + FOL + BED + MUS)[: int(D * SR)]
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), out.astype(np.float32), SR, subtype="FLOAT"); print("ok", round(float(np.abs(out).max()), 3), "len", round(len(out) / SR, 2))
