"""Ep7 remake mix: narrator (Kokoro) + acted lines (Gemini TTS, level-matched), real recorded footsteps from the rig's own step
events (foley.json), per-set ambience, story SFX on the story marks, 5 ACE-Step cues following the arc (with the two scripted
music drop-outs: the storm reveal and the thumb that stops), voice ducking. Writes assets/mix_raw.wav (loudnorm afterwards)."""
import json, os, glob
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
from scipy.ndimage import uniform_filter1d
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR = 48000
SCR = "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad"
LIB, AMB, SFX = f"{SCR}/realfoley/lib", f"{SCR}/realfoley/amb", os.path.join(ROOT, "assets/sfx")
CUE = {"L": f"{SCR}/acestep/ripple4/cueL.wav", "W": f"{SCR}/acestep/ripple4/cueW.wav", "G": f"{SCR}/acestep/ripple6/cueG.wav", "O": f"{SCR}/acestep/ripple5/cueO.wav"}
db = lambda x: 10 ** (x / 20); rng = np.random.default_rng(717)
src = open(os.path.join(ROOT, "assets/t.js")).read()
DT = json.loads(src.split("window.DT = ")[1].split("; window.SC")[0]); SCN = json.loads(src.split("window.SC = ")[1].split("; window.DUR")[0]); D = float(src.split("window.DUR = ")[1].split(";")[0])
F = json.load(open(os.path.join(ROOT, "foley.json"))); MK = F["marks"]
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
    m = a.mean(1); w = int(0.06 * SR); r = np.convolve(m ** 2, np.ones(w) / w, "same") ** 0.5; act = r[r > r.max() * 0.1]
    g = target - 20 * np.log10(np.median(act) + 1e-9); b = a * db(g)
    return b + sosfilt(butter(2, [2500, 6000], "band", fs=SR, output="sos"), b, axis=0) * 0.25
VO = np.zeros((N, 2))
for lid, (st, d) in DT.items():
    base = lid.split("#")[0]; a = load(os.path.join(ROOT, "assets/vo", base + ".wav")); put(VO, a if base.startswith("n") else speech_match(a), st, 0)
# ---------------- set segments from the shot list ----------------
shots = F["shots"]; segs = []
for i, (t0, s, tag) in enumerate(shots):
    t1 = shots[i + 1][0] if i + 1 < len(shots) else D
    if segs and segs[-1][2] == s: segs[-1][1] = t1
    else: segs.append([t0, t1, s])
# ---------------- real footsteps ----------------
FOL = np.zeros((N, 2)); bank = lambda pat: [norm(load(f)) for f in sorted(glob.glob(os.path.join(LIB, pat)))]
STONE, WOOD = bank("cobble_*.wav")[:5], [lpf(x, 3800) for x in bank("oga_wood_*.wav")]
li = 0
for e in F["steps"]:
    wood = e["set"] in ("jetty", "cafe", "kitchen", "bakeryIn"); lib = WOOD if wood else STONE; g = (-15 if wood else -18) + 8 * np.log10(max(0.15, e["sc"]) / 0.6) - (5 if e["extra"] else 0)
    x = lib[li % len(lib)]; li += 1 + int(rng.integers(0, 2)); pan = float(np.clip((e["x"] - 960) / 1400, -0.6, 0.6))
    put(FOL, x, e["t"], min(g, -12) + rng.uniform(-1.2, 1.2), pan); put(FOL, lpf(lpf(x, 220), 220), e["t"], min(g, -12) - 2, pan)
# ---------------- story SFX ----------------
nm = ["pop", "tick", "whoosh_a", "whoosh_b", "whoosh_c", "gold_chime", "shimmer", "boom", "shop_bell", "gull", "sparkle", "heartbeat", "paper", "clink", "ding", "record_scratch", "riser", "msg_pop", "slowmo", "laugh_room", "boing", "fail_trombone", "groan"]
X = {n: sfx(n) for n in nm if os.path.exists(os.path.join(SFX, n + ".wav"))}; popS = lpf(X["pop"], 2600)
put(FOL, X["paper"], 0.0, -20); put(FOL, X["clink"], 0.6, -24); put(FOL, X["laugh_room"], 0.2, -30) if "laugh_room" in X else None
put(FOL, X["msg_pop"], MK["tBye"], -22)
for j in range(10): put(FOL, popS, W("n01", 1.8) + j * 0.12, -21, [-0.6, -0.4, -0.2, 0.3, 0.5, 0.6, -0.5, 0.4, -0.1, 0.2][j])
put(FOL, X["tick"], W("n02", 1.2), -16)
for k, w in enumerate((0.0, 0.85, 1.75)): put(FOL, X["msg_pop"], W("n04", w), -20); put(FOL, X["record_scratch"][: int(0.4 * SR)], W("n04", w) + 0.05, -30)
put(FOL, X["fail_trombone"] if "fail_trombone" in X else X["boom"], MK["tTwo"], -26); put(FOL, X["ding"], MK["tTwo"], -16)
put(FOL, X["sparkle"], MK["tNine"], -18); put(FOL, X["gold_chime"], MK["tNine"] + 0.1, -20)
put(FOL, X["riser"][: int(1.0 * SR)], MK["tTitle0"] - 1.0, -24) if "riser" in X else None; put(FOL, X["boom"], MK["tTitle0"], -16)
for k in ("n08", "n09", "n10", "n28"): put(FOL, X["tick"], W(k, 0.85), -17)
for k in ("mo_e", "finn_d"): put(FOL, X["ding"], E(k) + 0.1, -18)
put(FOL, X["ding"], W("n10", 1.6), -18); put(FOL, X["ding"], W("n28", 1.4), -18); put(FOL, X["shop_bell"], MK["tBea"], -24); put(FOL, X["gull"], MK["tFinn"] + 0.3, -26, 0.4)
for j in range(10): put(FOL, X["tick"], SCN["SC04"] + 0.4 + j * 0.15, -24, -0.6 + j * 0.13)
for j in range(10): put(FOL, popS, W("n12", 5.0) + j * 0.1, -20, -0.6 + j * 0.13)
put(FOL, X["gull"], SCN["SC05"] + 0.4, -28, -0.5); put(FOL, X["heartbeat"], E("juno_d") - 0.2, -22); put(FOL, X["tick"], E("juno_d") + 0.2, -16)
put(FOL, X["ding"], W("n15", 2.0), -17); put(FOL, X["slowmo"], S("n16") - 0.2, -28) if "slowmo" in X else None
put(FOL, X["whoosh_b"], S("n18") - 0.3, -22); put(FOL, X["msg_pop"], W("n18", 2.4), -22); put(FOL, X["tick"], S("n20") + 0.3, -18); put(FOL, X["tick"], W("n20", 1.4), -18)
put(FOL, X["whoosh_a"], SCN["SC07"] + 0.1, -22); put(FOL, X["msg_pop"], MK["tAsk"] + 0.9, -20); put(FOL, X["boing"], S("juno_e"), -28) if "boing" in X else None
put(FOL, X["sparkle"], MK["tTen"], -16); put(FOL, X["gold_chime"], MK["tTen"] + 0.1, -18); put(FOL, X["shimmer"], MK["tTen"] + 0.3, -22)
put(FOL, X["clink"], SCN["SC09"] + 0.4, -24); put(FOL, X["laugh_room"], SCN["SC09"] + 0.2, -28) if "laugh_room" in X else None
put(FOL, X["msg_pop"], E("n30") + 0.9, -22); put(FOL, X["msg_pop"], E("n30") + 2.2, -22); put(FOL, X["record_scratch"][: int(0.5 * SR)], E("n30") + 2.4, -24)
put(FOL, X["ding"], E("n30") + 3.9, -18); put(FOL, X["sparkle"], MK["tEnd"] + 1.0, -24)
for s_ in segs[1:]: put(FOL, X["whoosh_c"], s_[0] - 0.12, -31)
# ---------------- ambience beds per set ----------------
BED = np.zeros((N, 2))
def bed(path, t0, t1, g, fade=0.25, off=0.0):
    a = load(path); L = int((t1 - t0) * SR)
    if L <= 0: return
    reps = int(np.ceil((L + int(off * SR)) / len(a))) + 1; x = np.tile(a, (reps, 1))[int(off * SR): int(off * SR) + L].copy()
    f = min(int(fade * SR), L // 2); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; put(BED, x, t0, g)
A = lambda n: os.path.join(SFX, n + ".wav")
AMBS = {"square": (A("amb_island_busy"), -27), "jetty": (f"{AMB}/mk_1185.wav", -25), "bakeryIn": (A("amb_shop"), -29),
        "street": (A("amb_island"), -29), "cafe": (A("amb_shop"), -30), "lighthouse": (A("amb_island"), -29)}
for t0, t1, s in segs:
    if s in AMBS: p, g = AMBS[s]; bed(p, t0, t1, g, off=(t0 * 1.7) % 20)
# ---------------- music: follows the arc, with the two scripted drop-outs ----------------
MUS = np.zeros((N, 2))
def cue(name, t0, t1, g, src0=0.0, fi=1.5, fo=1.5):
    a = load(CUE[name]); L = int((t1 - t0) * SR); s0 = int(src0 * SR); x = a[s0: s0 + L].copy()
    if len(x) < L: x = np.concatenate([x, a[: L - len(x)]])
    fi_, fo_ = min(int(fi * SR), L // 2), min(int(fo * SR), L // 2); x[:fi_] *= np.linspace(0, 1, fi_)[:, None]; x[-fo_:] *= np.linspace(1, 0, fo_)[:, None] ** 1.5; put(MUS, x, t0, g)
cue("O", 0.15, MK["tTitle0"] - 0.1, -21, 4.0, fi=0.4, fo=0.3)                          # awkward/playful: the replay
cue("O", MK["tTitle1"] - 0.2, SCN["SC05"] - 0.2, -21, 40.0, fi=0.8, fo=1.0)              # curious: the tests
cue("L", SCN["SC05"], SCN["SC07"] - 0.2, -20, 20.0, fi=2.0, fo=0.6)                      # tender/lonely: Juno, the flashback
cue("W", SCN["SC07"], SCN["SC08"] + 0.3, -18, 30.0, fi=0.6, fo=1.2)                      # going back, 10/10
cue("G", SCN["SC08"], SCN["SC09"] + 0.4, -22, 40.0, fi=1.5)                              # takeaway
cue("W", SCN["SC09"] - 0.3, D, -18, 60.0, fi=1.5, fo=3.0)                                # the close
v = np.abs(VO).mean(1); e = uniform_filter1d(v, int(0.12 * SR)); e = e / (np.percentile(e[e > 1e-4], 90) + 1e-9)
duck = uniform_filter1d(np.clip(e * 3, 0, 1), int(0.35 * SR)); MUS *= db(-8 * duck)[:, None]; BED *= db(-4 * duck)[:, None]
BED = sosfilt(butter(2, 180, "high", fs=SR, output="sos"), BED, axis=0)
out = (VO + FOL + BED + MUS)[: int(D * SR)]
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), out.astype(np.float32), SR, subtype="FLOAT"); print("ok peak", round(float(np.abs(out).max()), 3), "len", round(len(out) / SR, 2), "segs", len(segs))
