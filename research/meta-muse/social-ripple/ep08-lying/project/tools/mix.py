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
nm = ["pop", "tick", "whoosh_a", "whoosh_b", "whoosh_c", "gold_chime", "shimmer", "boom", "shop_bell", "gull", "scribble", "swoosh_send", "tap", "sparkle", "heartbeat", "paper", "stamp", "typing", "door_slam", "thunk", "clink", "ding", "boat_horn", "applause", "cheer", "record_scratch", "rimshot", "riser", "phone_ring", "msg_pop", "clock_tick", "slowmo", "laugh_room"]
X = {n: sfx(n) for n in nm if os.path.exists(os.path.join(SFX, n + ".wav"))}; popS = lpf(X["pop"], 2600)
put(FOL, X["paper"], 0.0, -20); put(FOL, X["clink"], W("mo_c", 1.6), -22)
put(FOL, X["tick"], MK["tMo1"], -14, 0.4)                                            # Mo's first "1"
for j in range(10): put(FOL, popS, MK["tWide1"] + 0.9 + j * 0.16, -21, [-0.6, -0.4, -0.2, 0.3, 0.5, 0.6, -0.5, 0.4, -0.1, 0.2][j])
put(FOL, X["ding"], MK["tSlam"] - 0.02, -14, 0.3); put(FOL, X["boom"][: int(1.2 * SR)], MK["tSlam"], -20)   # 37 slams down
put(FOL, X["record_scratch"], MK["tSlam"] + 0.05, -22)
put(FOL, X["riser"][: int(1.2 * SR)], MK["tTitle0"] - 1.2, -24) if "riser" in X else None; put(FOL, X["boom"], MK["tTitle0"], -16)   # title hit
for k in ("n06", "n07", "n08"): put(FOL, X["stamp"], S(k) - 0.12, -18)
for k, z in enumerate((MK["tZ1"], MK["tZ2"], MK["tZ3"])): put(FOL, X["tick"], z, -18)
put(FOL, X["tick"], SCN["SC03"] + 0.3, -18); put(FOL, X["gull"], SCN["SC03"] + 0.2, -26, 0.5)
put(FOL, X["typing"][: int(1.0 * SR)], MK["tText"] + 0.1, -22); put(FOL, X["swoosh_send"], MK["tText"] + 1.2, -22)
put(FOL, X["shop_bell"], SCN["SC04"] + 0.1, -24)
for k in ("pip_b", "pip_c", "pip_d"): put(FOL, X["tick"], E(k) + 0.1, -15, 0.4)            # Pip's counter climbs
put(FOL, X["gull"], MK["tFish"] + 0.3, -26, -0.4)
put(FOL, X["clink"], SCN["SC05"] + 0.3, -24); [put(FOL, X["tick"], SCN["SC05"] + d, -18) for d in (0.7, 1.2)]
put(FOL, X["tick"], E("ana_f") + 0.1, -16); put(FOL, X["tick"], E("theo_c") + 0.1, -16)
for d in (1.0, 1.6, 2.2, 2.8, 3.4): put(FOL, X["tick"], MK["tMont"] + d, -18, (d - 2.2) / 2)
put(FOL, X["heartbeat"], MK["tMont"] + 2.0, -22)
put(FOL, X["whoosh_a"], MK["tCoin"], -20); [put(FOL, X["tap"], MK["tCoin"] + 0.15 + i * 0.1, -26) for i in range(9)]; put(FOL, X["ding"], MK["tCoin"] + 1.25, -18)
put(FOL, X["door_slam"][: int(0.4 * SR)], E("pip_e") + 0.35, -24)
put(FOL, X["heartbeat"], MK["tLights"] - 1.3, -20)
put(FOL, X["sparkle"], MK["tLights"], -18); put(FOL, X["cheer"], MK["tLights"] + 0.05, -16) if "cheer" in X else None; put(FOL, X["applause"], MK["tLights"] + 0.6, -22) if "applause" in X else None
put(FOL, X["gold_chime"], S("n17") + 0.4, -22); put(FOL, X["tick"], E("pip_f") + 0.15, -17); put(FOL, X["laugh_room"], E("pip_f") + 0.3, -26) if "laugh_room" in X else None
put(FOL, X["clock_tick"] if "clock_tick" in X else X["tick"], SCN["SC07"] + 0.2, -26)
put(FOL, X["ding"], MK["tTwelve"], -18); put(FOL, X["boom"][: int(0.9 * SR)], MK["tTwelve"] + 0.02, -24)
for i, w in enumerate((0.0, 0.62, 1.26)): put(FOL, X["msg_pop"] if "msg_pop" in X else popS, S("n20") + w, -22)
put(FOL, X["shimmer"], MK["tReset"], -18); put(FOL, X["gold_chime"], MK["tReset"] + 0.3, -22)
put(FOL, X["clink"], W("mo_d", 2.0), -22); put(FOL, X["sparkle"], MK["tEnd"] + 1.0, -24)
for s_ in segs[1:]: put(FOL, X["whoosh_c"], s_[0] - 0.12, -31)
# ---------------- ambience beds per set ----------------
BED = np.zeros((N, 2))
def bed(path, t0, t1, g, fade=0.25, off=0.0):
    a = load(path); L = int((t1 - t0) * SR)
    if L <= 0: return
    reps = int(np.ceil((L + int(off * SR)) / len(a))) + 1; x = np.tile(a, (reps, 1))[int(off * SR): int(off * SR) + L].copy()
    f = min(int(fade * SR), L // 2); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; put(BED, x, t0, g)
A = lambda n: os.path.join(SFX, n + ".wav")
AMBS = {"square": (A("amb_island_busy"), -27), "bakeryFront": (A("amb_island"), -28), "jetty": (f"{AMB}/mk_1185.wav", -25), "bakeryIn": (A("amb_shop"), -29),
        "street": (A("amb_island"), -29), "cafeParty": (A("amb_shop"), -31), "windowNight": (A("amb_night"), -30)}
for t0, t1, s in segs:
    if s in AMBS: p, g = AMBS[s]; bed(p, t0, t1, g, off=(t0 * 1.7) % 20)
# ---------------- music: follows the arc, with the two scripted drop-outs ----------------
MUS = np.zeros((N, 2))
def cue(name, t0, t1, g, src0=0.0, fi=1.5, fo=1.5):
    a = load(CUE[name]); L = int((t1 - t0) * SR); s0 = int(src0 * SR); x = a[s0: s0 + L].copy()
    if len(x) < L: x = np.concatenate([x, a[: L - len(x)]])
    fi_, fo_ = min(int(fi * SR), L // 2), min(int(fo * SR), L // 2); x[:fi_] *= np.linspace(0, 1, fi_)[:, None]; x[-fo_:] *= np.linspace(1, 0, fo_)[:, None] ** 1.5; put(MUS, x, t0, g)
cue("O", 0.15, MK["tTitle0"] - 0.1, -20, 4.0, fi=0.4, fo=0.3)                          # playful: the power, the 37
cue("G", MK["tTitle1"] - 0.2, SCN["SC04"] + 0.5, -21, 10.0, fi=0.8)                      # wonder: the rules, an honest island
cue("O", SCN["SC04"], MK["tMont"] + 0.5, -20, 40.0, fi=1.0, fo=1.0)                       # detective: following Pip
cue("L", MK["tMont"] + 0.2, MK["tCoin"] + 1.8, -20, 20.0, fi=1.5, fo=0.8)                # hurt: everyone's lying to you
cue("O", E("n15") + 0.4, MK["tLights"] - 1.4, -22, 70.0, fi=1.0, fo=0.4)                 # the confrontation -> drops out before the lights
cue("W", MK["tLights"], SCN["SC07"] - 0.3, -18, 30.0, fi=0.2, fo=1.2)                     # SURPRISE
cue("L", SCN["SC07"] + 0.4, SCN["SC08"] + 0.3, -21, 70.0, fi=2.0)                          # the mirror
cue("G", SCN["SC08"], SCN["SC09"] + 0.4, -22, 40.0, fi=1.5)                                # Nia's takeaway
cue("W", SCN["SC09"] - 0.3, D, -18, 60.0, fi=1.5, fo=3.0)                                 # the close
v = np.abs(VO).mean(1); e = uniform_filter1d(v, int(0.12 * SR)); e = e / (np.percentile(e[e > 1e-4], 90) + 1e-9)
duck = uniform_filter1d(np.clip(e * 3, 0, 1), int(0.35 * SR)); MUS *= db(-8 * duck)[:, None]; BED *= db(-4 * duck)[:, None]
BED = sosfilt(butter(2, 180, "high", fs=SR, output="sos"), BED, axis=0)
out = (VO + FOL + BED + MUS)[: int(D * SR)]
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), out.astype(np.float32), SR, subtype="FLOAT"); print("ok peak", round(float(np.abs(out).max()), 3), "len", round(len(out) / SR, 2), "segs", len(segs))
