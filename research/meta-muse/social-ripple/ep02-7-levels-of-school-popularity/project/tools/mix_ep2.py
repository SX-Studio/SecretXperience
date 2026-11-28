"""Mix Social Ripple ep2: voice, 3 music cues (ducked), per-scene beds, ~150 timed effects. -> assets/mix_raw.wav
Event times come from tools/plan.json + assets/timing.js word clock, so they follow any re-timing."""
import os, json, re
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, fftconvolve, butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SFX = os.path.join(ROOT, "assets/sfx"); VO = os.path.join(ROOT, "assets/vo")
MUS = os.environ.get("MUS", "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/acestep/ripple2")
SR = 48000
plan = json.load(open(os.path.join(HERE, "plan.json")))
tj = open(os.path.join(ROOT, "assets/timing.js")).read()
TIM = json.loads(re.search(r"window.TIM = (.*?);\n", tj).group(1)); TIMW = json.loads(re.search(r"window.TIMW = (.*?);\n", tj).group(1))
TOTAL = plan["total"]; N = int((TOTAL + 1.0) * SR)
S0 = {s: st for s, st, d in plan["scenes"]}; SD = {s: d for s, st, d in plan["scenes"]}
def T(s, k): return S0[s] + TIM[s][k]
def W(s, lid, word, nth=0, frac=0.5):
    ws = TIMW.get(lid); w = word.lower(); k = 0
    if ws:
        for tx, st in ws:
            if re.sub(r"[^a-z0-9']", "", tx.lower()).startswith(w):
                if k == nth: return S0[s] + TIM[s][lid] + st
                k += 1
    return S0[s] + TIM[s][lid] + (TIM[s][lid + "_e"] - TIM[s][lid]) * frac
db = lambda x: 10 ** (x / 20)
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x, axis=0)
hp = lambda x, f: sosfilt(butter(2, f, "high", fs=SR, output="sos"), x, axis=0)
_cache = {}
def load(path):
    if path in _cache: return _cache[path]
    a, sr = sf.read(path)
    if a.ndim == 1: a = np.stack([a, a], 1)
    if sr != SR: a = resample_poly(a, SR, sr, axis=0)
    _cache[path] = a; return a
def sfx(name): return load(os.path.join(SFX, name + ".wav"))
def pan(x, p):
    if p == 0: return x
    return np.stack([x[:, 0] * np.sqrt(0.5 * (1 - p)) * 1.414, x[:, 1] * np.sqrt(0.5 * (1 + p)) * 1.414], 1)
def put(buf, x, at, g=0.0, p=0.0):
    i = int(at * SR)
    if i < 0: x = x[-i:]; i = 0
    j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += pan(x[: j - i], p) * db(g)
voice = np.zeros((N, 2)); music = np.zeros((N, 2)); beds = np.zeros((N, 2)); fx = np.zeros((N, 2))
# ---------------- voice ----------------
IR = {k: np.load(os.path.join(SFX, f"ir_{k}.npy")) for k in ("cafe", "hall", "street")}
CHAR = {"nia_hi": ("cafe", -0.1), "ms_you": ("hall", 0.3), "theo_joke": ("cafe", 0), "priya_add": ("hall", -0.3), "marcus_yo": ("cafe", 0.2), "dev_joke": ("cafe", 0.4),
        "nia_seat": ("cafe", -0.2), "jordan_free": ("cafe", -0.1), "marcus_scoot": ("cafe", 0.1)}
for lid, at, L in plan["lines"]:
    a = load(os.path.join(VO, lid + ".wav")).copy()
    if lid in CHAR:
        room, p = CHAR[lid]; m = a[:, 0]; wet = fftconvolve(m, IR[room])[: len(m)]; wet /= np.abs(wet).max() + 1e-9
        m = m + wet * np.abs(m).max() * 0.22; a = np.stack([m, m], 1); put(voice, a, at, -1.0, p)
    else:
        put(voice, hp(a, 80), at, 0.0)
# ---------------- music ----------------
def cue(name): return load(os.path.join(MUS, name + ".wav"))
def mus(name, src0, src1, at, g, fin=0.3, fout=0.8):
    a = cue(name)[int(src0 * SR): int(src1 * SR)].copy(); n = len(a)
    fi, fo = int(fin * SR), int(fout * SR)
    if fi: a[:fi] *= np.linspace(0, 1, fi)[:, None]
    if fo: a[-fo:] *= np.linspace(1, 0, fo)[:, None]
    put(music, a, at, g)
tTurn = T("s01", "n02_e") - 0.2
mus("cueA", 18.0, 18.0 + tTurn - 0.4, 0.4, -6, 1.5, 0.15)                     # sneaky under the cold open, cut by the scratch
mus("cueA", 0.0, 126.0, S0["s02"] - 0.05, -5, 0.02, 2.5)                       # main theme from the title card
endA = T("s12", "n25_e") + 0.15
mus("cueC", 0.0, endA - S0["s11"], S0["s11"], -5, 1.0, 0.25)                   # rumour tension; drops at "everybody votes"
cueB = cue("cueB"); chord = 100.0
startB = T("s16", "n38_e") + 0.6 - chord
mus("cueB", max(0, T("s13", "n27") - startB), len(cueB) / SR, max(startB, T("s13", "n27")), -8, 2.5, 0.5)
# ---------------- beds ----------------
def bed(name, t0, t1, g, fin=0.6, fout=0.6, lpf=None):
    a = sfx(name); n = int((t1 - t0) * SR)
    if n <= 0: return
    reps = int(np.ceil(n / len(a))) + 1; off = int((t0 * 7.3 % (len(a) / SR - 1)) * SR)
    x = np.concatenate([a] * reps)[off: off + n].copy()
    if lpf: x = lp(x, lpf)
    fi, fo = int(fin * SR), int(fout * SR); x[:fi] *= np.linspace(0, 1, fi)[:, None]; x[-fo:] *= np.linspace(1, 0, fo)[:, None]
    put(beds, x, t0, g)
def caf(s, t0=None, t1=None, g=0.0):
    a, b = (S0[s] if t0 is None else t0), (S0[s] + SD[s] if t1 is None else t1)
    bed("amb_cafeteria", a, b, -7 + g); bed("steps_cafeteria", a, b, -15 + g)
def hall(s, t0=None, t1=None, g=0.0):
    a, b = (S0[s] if t0 is None else t0), (S0[s] + SD[s] if t1 is None else t1)
    bed("amb_hallway", a, b, -2 + g); bed("steps_hallway", a, b, -8 + g)
bed("amb_cafeteria", 0, tTurn + 0.05, -7, 1.2, 0.08); bed("steps_cafeteria", 0, tTurn + 0.05, -15, 1.2, 0.08)
bed("amb_cafeteria", T("s01", "n03") + 0.5, S0["s02"] + 0.3, -15, 2.0, 0.4)         # chatter slowly resumes
hall("s03"); hall("s04"); caf("s05"); hall("s06", g=-4); caf("s07"); hall("s08", g=-5)
bed("fan_hum", S0["s08"], S0["s08"] + SD["s08"], -24)
tB10 = T("s10", "n18") - 0.25
bed("amb_classroom", S0["s10"], tB10 + 0.3, -7); bed("amb_camp", tB10, S0["s11"] + 0.2, -5)
bed("amb_night", S0["s11"], T("s11", "n21") - 0.2, -8)
caf("s12", t1=T("s12", "n25") + 1.0)
bed("amb_cafeteria", T("s12", "n25") + 1.0, endA + 0.2, -16, 0.8, 1.0)            # the room hushes as the point lands
bed("amb_cafeteria", S0["s13"] - 0.2, T("s13", "n28"), -17, 1.5, 0.6); bed("steps_cafeteria", S0["s13"], T("s13", "n28"), -20, 1.5, 0.6)
bed("amb_cafeteria", T("s13", "n28") - 0.2, S0["s14"] + 0.3, -11, 1.2, 0.5)
tB15, tC15 = T("s15", "n34") - 0.2, T("s15", "n35") - 0.2
hall("s15", t1=tB15 + 0.3); hall("s15", t0=tC15 - 0.1, g=-2)
tOut = T("s16", "n38")
caf("s16", t1=tOut + 0.6); bed("amb_hallway", tOut, TOTAL, -20, 0.6, 3.0, 1200)
# ---------------- effects ----------------
E = []  # (time, name, gain, pan)
def e(t, n, g=0.0, p=0.0): E.append((t, n, g, p))
def card(s, t): e(t - 0.05, "whoosh_b", -6); e(t + 0.15, "boom", -9)
def steps(t0, t1, every=0.5, g=-16, p=0.0):
    t, k = t0, 0
    while t < t1: e(t, f"step_concrete_{k % 6}", g, p); t += every; k += 1
# s01
for i in range(5): e(T("s01", "n01") + 3.6 + i * 0.18, "boop_a" if i % 2 else "boop_b", -6, -0.6 + 0.3 * i)
e(T("s01", "n02") + 0.4, "pop", -8)
steps(T("s01", "n02") + 1.3, T("s01", "n02") + 5.0, 0.42, -14, -0.4)
e(tTurn, "record_scratch", -1); [e(tTurn + 0.1 + k * 0.07, f"rustle_{k}", -10, -0.6 + 0.4 * k) for k in range(4)]
for i in range(5): e(T("s01", "n03") + 1.0 + i * 0.25, "phone_buzz", -12, [-0.7, 0.5, -0.2, 0.8, 0.1][i])
e(T("s01", "n03") + 5.6, "whoosh_a", -8)
for k in range(7): e(T("s01", "n03") + 6.2 + k * 0.34, "tick", -8)
e(S0["s02"] - 2.6, "riser", -9)
# s02 title
for k, t in enumerate([0.05, 0.45, 1.0]): e(S0["s02"] + t, "stamp", -3 if k == 0 else -6); e(S0["s02"] + 0.05, "boom", -5)
e(S0["s02"] + 1.4, "ding", -10)
# s03 level 1
for k, (dt, p) in enumerate([(0.6, -0.7), (4.2, 0.6), (9.5, -0.4)]): e(S0["s03"] + dt, "locker_slam", -15, p)
for k, (dt, p) in enumerate([(1.4, 0.7), (6.8, -0.6)]): e(S0["s04"] + dt, "locker_slam", -16, p)
card("s03", T("s03", "n04")); tDoor = W("s03", "n05", "doors"); e(tDoor - 0.1, "door_slam", -2, 0.3); e(tDoor, "boing", -12)
steps(T("s03", "n05") + 0.0, tDoor - 0.1, 0.45, -18)
e(W("s03", "n05", "teachers"), "school_bell", -20, 0.5)
e(T("s03", "ms_you_e") + 0.1, "boop_b", -8); tFile = W("s03", "n06", "everybody"); e(tFile - 0.1, "whoosh_c", -7); e(W("s03", "n06", "filed"), "stamp", -4)
# s04 level 2
card("s04", T("s04", "n07")); e(W("s04", "n07", "backpack"), "boop_a", -6); tS = W("s04", "n07", "sneezed"); e(tS - 0.45, "sneeze", -3, 0.1); e(tS + 0.05, "boop_b", -7)
tQ = W("s04", "n07", "side"); e(tQ, "ding", -5); e(tQ + 0.1, "shimmer", -14)
tb = W("s04", "n07", "you're") - 0.2
for k in range(12): e(tb + k * 0.11, "tick", -14)
# s05 level 3
card("s05", T("s05", "n08")); tG = T("s05", "theo_joke_e") + 0.05
e(tG - 0.02, "rimshot", -4); e(tG + 0.1, "groan", -6); e(tG + 0.7, "laugh_table", -4); e(tG + 0.9, "laugh_room", -12)
tC = W("s05", "n09", "currency"); [e(tC + i * 0.15 + 0.5, "coins", -10) for i in range(4)]; e(W("s05", "n09", "rich"), "ka_ching", -5)
# s06 level 4
card("s06", T("s06", "n10"))
a1, a2, a3 = W("s06", "priya_add", "adding", 0), W("s06", "priya_add", "adding", 1), W("s06", "priya_add", "not")
for t in (a1, a2, a3): e(t, "tap", -6, 0.4); e(t + 0.05, "msg_pop2", -13, 0.4)
for t in (T("s06", "n10") + 0.6, W("s06", "n10", "decides"), W("s06", "n10", "left"), W("s06", "n10", "left") + 0.7): e(t, "msg_pop", -13, 0.4)
e(W("s06", "n10", "screenshot"), "shutter", -5, 0.4); tI = W("s06", "n11", "information"); e(tI - 0.3, "msg_pop", -9, 0.4); e(tI, "phone_buzz", -8, 0.3); e(tI + 0.1, "whoosh_a", -12); e(tI + 0.8, "ding", -10)
# s07 level 5
card("s07", T("s07", "n12")); steps(T("s07", "n12") + 0.4, T("s07", "marcus_yo") - 0.3, 0.42, -15)
for k, w in enumerate(["band", "gamers", "soccer"]): e(W("s07", "n12", w), "boop_a" if k % 2 else "boop_b", -7, -0.5 + 0.5 * k)
mx0, mx1, mt0, mt1 = -500, 2350, T("s07", "n12") + 0.4, T("s07", "marcus_yo") - 0.3
for x in (-200, 700, 1600, 2500):
    tp = mt0 + (x - mx0) / (mx1 - mx0) * (mt1 - mt0)
    if tp < mt1: e(tp, "tap", -4); e(tp + 0.02, "pop", -14)
e(W("s07", "n12", "passes"), "shimmer", -10); e(T("s07", "marcus_yo") + 0.3, "laugh_room", -16)
# s08 level 6
card("s08", T("s08", "n13")); e(T("s08", "n13") - 0.3, "slowmo", -6)
e(W("s08", "n13", "okay"), "rec_beep", -8); e(W("s08", "n13", "okay") + 0.2, "whoosh_c", -10)
for w in ("wears", "says", "likes"): e(W("s08", "n14", w), "pop", -9)
tWa = W("s08", "n14", "watch"); e(W("s08", "n14", "status"), "whoosh_b", -7); e(W("s08", "n14", "status") + 0.15, "boom", -10)
for k in range(10): e(tWa - 0.2 + k * 0.15, "tick", -12)
steps(S0["s08"] + 0.3, S0["s08"] + SD["s08"] - 1.0, 0.8, -15)
# s09 level 7 locked
e(W("s09", "n15", "locked"), "lock_rattle", -3); e(W("s09", "n15", "locked") + 0.1, "boom", -12); e(W("s09", "n15", "hold"), "paper", -6)
# s10 research
for w, lid in [("two", "n16"), ("status", "n17"), ("likeability", "n17"), ("being", "n17"), ("powerful", "n17"), ("talked", "n17"), ("enjoying", "n17"), ("trusting", "n17"), ("included", "n17")]: e(W("s10", lid, w), "marker", -19, 0.2)
e(T("s10", "n16") + 1.0, "pop", -12); e(tB10, "whoosh_a", -7)
e(W("s10", "n18", "pecking") + 1.5, "boop_b", -8); [e(W("s10", "n18", "pecking") + 1.5 + k * 0.1, "pop", -16) for k in range(6)]
e(W("s10", "n18", "three", 0) - 0.5, "paper", -8); e(W("s10", "n18", "three", 2, 0.6), "stamp", -3); tWi = W("s10", "n18", "wifi")
for k in range(9): e(tWi + k * 0.13, "tick", -14)
e(tWi + 1.3, "fail_trombone", -14)
# s11 rumour
t2 = T("s11", "n20") - 0.3
for k in range(9): e(T("s11", "n19") + 1.0 + k * (t2 - T("s11", "n19") - 1.2) / 9, "phone_buzz", -21 - (k % 3) * 2, [-0.8, 0.6, -0.3, 0.9, 0.1, -0.6, 0.4][k % 7])
e(T("s11", "n20") + 0.05, "msg_pop", -4); e(T("s11", "n20") + 0.05, "phone_buzz", -8)
for i in range(7): e(W("s11", "n20", "nobody") - 0.6 + i * 0.42, "msg_pop2" if i % 2 else "msg_pop", -15, 0.1)
e(W("s11", "n20", "nobody", 0), "fail_trombone", -16)
e(T("s11", "n21") - 0.25, "whoosh_b", -8)
for k in range(14): e(T("s11", "n21") + 0.3 + k * 0.18, "tick", -21 + min(4, k * 0.3), -0.8 + (k % 9) * 0.2)
e(W("s11", "n21", "researchers") - 0.3, "whoosh_a", -9); e(W("s11", "n21", "new", 0, 0.85), "ding", -7)
# s12 fallout
leave = [0, 0.5, 0.95, 1.35, 1.7]
for k, d in enumerate(leave): e(T("s12", "n22") + 0.6 + d, "chair_scrape", -6 + k * -0.5, [-0.6, -0.3, 0.2, 0.4, 0.6][k])
e(W("s12", "n23", "two") - 0.4, "whoosh_c", -8); tMi = W("s12", "n23", "minus"); e(tMi - 0.1, "fail_trombone", -6); e(tMi + 1.2, "boom", -10)
e(T("s12", "dev_joke_e") + 0.05, "laugh_room", -4); e(T("s12", "dev_joke_e") + 0.2, "laugh_table", -9, 0.4)
e(W("s12", "n24", "five"), "ka_ching", -10)
e(W("s12", "n25", "priya") - 0.1, "pop", -10)
for w, n in (("forwarded", 3), ("laughed", 4), ("stood", 5)):
    for k in range(n): e(W("s12", "n25", w) + 0.1 * k, "ballot", -12, -0.6 + 0.3 * k)
e(W("s12", "n25", "law"), "boom", -10); e(W("s12", "n25", "nature") + 0.25, "crack", -5); e(W("s12", "n25", "election"), "stamp", -4)
for k in range(12): e(W("s12", "n25", "everybody", 0, 0.9) + k * 0.05, "ballot", -15, -0.9 + 0.15 * k)
# s13 the turn
steps(T("s13", "n26") + 0.3, T("s13", "nia_seat") - 0.2, 0.45, -14)
tSit = T("s13", "nia_seat_e") + 0.3; e(tSit - 0.5, "chair_scrape", -12); e(tSit, "rustle_1", -10)
e(T("s13", "jordan_free") + 0.5, "boop_a", -10)
tSaw = W("s13", "n27", "saw"); e(tSaw - 0.3, "heartbeat", -10); steps(tSaw + 0.6, T("s13", "marcus_scoot") - 0.2, 0.45, -14, 0.3)
e(T("s13", "marcus_scoot") - 0.4, "chair_scrape", -12, 0.2); tNot = T("s13", "n28") + 0.4; e(tNot, "gold_chime", -5); e(tNot + 0.3, "ooh", -10)
# s14 Paluck
tF = W("s14", "n29", "fifty")
for k in range(0, 56, 4): e(tF + k * 0.03, "tick", -13)
e(W("s14", "n29", "small") - 0.3, "whoosh_a", -8); e(W("s14", "n29", "stand"), "boop_b", -6); e(T("s14", "n30"), "whoosh_b", -9)
e(T("s14", "n30") + 0.5, "riser", -16); e(W("s14", "n30", "thirty") + 0.5, "stamp", -3); e(W("s14", "n30", "strongest") - 0.3, "whoosh_c", -9)
for k in range(6): e(W("s14", "n31", "level") + k * 0.06, "pop", -13)
e(W("s14", "n31", "rumors"), "phone_buzz", -14); e(W("s14", "n31", "normal"), "gold_chime", -7)
# s15 level 7
tOpen = W("s15", "n32", "seven"); e(tOpen - 0.6, "lock_rattle", -8); e(tOpen, "unlock", -3); card("s15", tOpen + 0.5)
e(W("s15", "n33", "different"), "whoosh_a", -8); tGl = W("s15", "n33", "person"); [e(tGl + i * 0.12, "pop", -15) for i in range(6)]; e(tGl + 0.3, "shimmer", -12)
steps(S0["s15"] + 0.3, tB15, 0.45, -16)
e(tB15, "whoosh_b", -8)
for w in ("anxiety", "depression", "relationship", "better", "careers"): e(W("s15", "n34", w), "pop", -9)
e(W("s15", "n34", "one") - 0.1, "paper", -8); e(W("s15", "n34", "less"), "fail_trombone", -12)
e(tC15, "whoosh_c", -8); steps(tC15 + 0.3, S0["s15"] + SD["s15"] - 0.5, 0.45, -16)
for k in range(4): e(W("s15", "n35", "watch") + k * 0.1, "pop", -13)
e(W("s15", "n35", "glad"), "shimmer", -12); tGr = W("s15", "n35", "graduation"); e(tGr, "cheer", -5); e(tGr + 0.1, "applause", -12)
# s16 finale
e(S0["s16"] + 0.4, "laugh_table", -9); e(S0["s16"] + 0.6, "laugh_room", -14)
t1 = W("s16", "n36", "forward"); e(t1 - 0.8, "whoosh_a", -9)
for w in ("forward", "learn", "sit"): e(W("s16", "n36", w) + 0.6, "ding", -8)
e(T("s16", "n37"), "pop", -7); e(tOut - 0.1, "school_bell", -24); e(tOut, "whoosh_b", -8); e(tOut + 1.2, "shimmer", -10)
for t, n, g, p in E: put(fx, sfx(n), t, g, p)
# ---------------- duck music under voice ----------------
v = np.abs(voice).mean(1); win = int(0.05 * SR); env = np.convolve(v, np.ones(win) / win, mode="same")
env = env / (np.percentile(env[env > 1e-4], 90) + 1e-9); env = np.clip(env, 0, 1)
rel = int(0.35 * SR); k = np.exp(-np.arange(rel) / (rel / 4)); env = np.maximum(env, np.convolve(env, k / k.sum() * 4, mode="full")[: len(env)].clip(0, 1))
duck = db(-9) ** env; music *= duck[:, None]; beds *= (db(-4) ** env)[:, None]
mix = voice + music + beds + fx
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), mix.astype(np.float32), SR, subtype="FLOAT")
for nm, b in (("voice", voice), ("music", music), ("beds", beds), ("fx", fx)): sf.write(f"/tmp/ep2_{nm}.wav", b.astype(np.float32), SR, subtype="FLOAT")
print("mix", round(len(mix) / SR, 2), "events", len(E))
