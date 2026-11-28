"""Mix Social Ripple ep3: voice, 4 ACE-Step cues (ducked), location beds, timed effects -> assets/mix_raw.wav.
Every time comes from assets/t.js (line clock + script-aligned word clock), so it follows any re-timing."""
import os, json, re
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, fftconvolve, butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SFX = os.path.join(ROOT, "assets/sfx"); VO = os.path.join(ROOT, "assets/vo")
MUS = "/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/acestep/ripple3"
SR = 48000
tj = open(os.path.join(ROOT, "assets/t.js")).read()
T = json.loads(re.search(r"window.T=(.*?);\n", tj).group(1)); WORDS = json.loads(re.search(r"window.WORDS=(.*?);\n", tj).group(1))
plan = json.load(open(os.path.join(HERE, "plan.json"))); D = T["D"]; N = int((D + 1.0) * SR)
E_ = lambda lid: T[lid + "_e"]
def W(w, nth=0, line=None):
    k = 0; w = re.sub(r"[^a-z0-9']", "", w.lower())
    for x in WORDS:
        if (line is None or x[3] == line) and re.sub(r"[^a-z0-9']", "", x[0].lower()) == w:
            if k == nth: return x[1]
            k += 1
    print("word?", w, nth, line); return T[line] if line else 0
db = lambda x: 10 ** (x / 20)
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x, axis=0)
hp = lambda x, f: sosfilt(butter(2, f, "high", fs=SR, output="sos"), x, axis=0)
_c = {}
def load(path):
    if path in _c: return _c[path]
    a, sr = sf.read(path)
    if a.ndim == 1: a = np.stack([a, a], 1)
    if sr != SR: a = resample_poly(a, SR, sr, axis=0)
    _c[path] = a; return a
def sfx(n): return load(os.path.join(SFX, n + ".wav"))
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
ROOM = {"mo_01": ("street", -0.3), "bea_01": ("street", 0.3), "finn_01": ("street", 0.0), "ana_01": ("cafe", 0.0), "finn_02": ("cafe", -0.1), "penny_01": ("hall", 0.1), "mo_02": ("hall", -0.1),
        "penny_02": ("hall", 0.1), "ana_02": ("cafe", 0.0), "ana_03": ("cafe", 0.0), "penny_03": ("hall", 0.2)}
for lid, at, L in plan["lines"]:
    a = load(os.path.join(VO, lid + ".wav")).copy()
    if lid in ROOM:
        room, p = ROOM[lid]; m = a[:, 0]; wet = fftconvolve(m, IR[room])[: len(m)]; wet /= np.abs(wet).max() + 1e-9
        m = m + wet * np.abs(m).max() * 0.2
        if lid == "penny_03": m = lp(hp(m, 400), 3400) * 1.6     # on the phone
        put(voice, np.stack([m, m], 1), at, -3.5 if lid != "penny_03" else -1.5, p)
    else: put(voice, hp(a, 80), at, 0.0)
# ---------------- music ----------------
def cue(n):
    p = os.path.join(MUS, n + ".wav"); return load(p) if os.path.exists(p) else None
def mus(n, src0, dur, at, g, fin=0.4, fout=1.0):
    c = cue(n)
    if c is None: print("missing cue", n); return
    L = len(c) / SR; out = []; s = src0
    while dur > 0:  # loop if needed
        take = min(dur, L - s); out.append(c[int(s * SR): int((s + take) * SR)]); dur -= take; s = 4.0
    a = np.concatenate(out).copy(); fi, fo = int(fin * SR), int(fout * SR)
    if fi: a[:fi] *= np.linspace(0, 1, fi)[:, None]
    if fo: a[-fo:] *= np.linspace(1, 0, fo)[:, None]
    put(music, a, at, g)
tBroke = W("broke", 0, "n02")
mus("cueA", 0.0, tBroke - 0.2, 0.2, -7, 1.0, 0.25)                                # cold open
mus("cueA", 6.0, T["s07"] - T["s02"] + 0.6, T["s02"] - 0.05, -6, 0.05, 1.2)      # title → acts 1–3
mus("cueB", 0.0, T["s08"] - T["s07"] + 1.4, T["s07"] - 0.1, -6, 0.6, 2.4)        # the boom
mus("cueC", 0.0, T["s10"] - T["s08"] + 1.2, T["s08"] - 0.6, -6, 2.6, 1.6)        # the bust + the lens
cD = cue("cueD")
if cD is not None:   # land the final long chord on the end card
    LD = len(cD) / SR; startD = D - LD + 0.2
    mus("cueD", max(0, T["s10"] - startD), D - max(startD, T["s10"]) + 0.5, max(startD, T["s10"] - 0.4), -5, 2.0, 2.5)
# ---------------- beds ----------------
def bed(n, t0, t1, g, fin=0.6, fout=0.6, lpf=None):
    a = sfx(n); m = int((t1 - t0) * SR)
    if m <= 0: return
    reps = int(np.ceil(m / len(a))) + 1; off = int((t0 * 7.3 % max(1, (len(a) / SR - 1))) * SR)
    x = np.concatenate([a] * reps)[off: off + m].copy()
    if lpf: x = lp(x, lpf)
    fi, fo = int(fin * SR), int(fout * SR); x[:fi] *= np.linspace(0, 1, fi)[:, None]; x[-fo:] *= np.linspace(1, 0, fo)[:, None]
    put(beds, x, t0, g)
# location timeline (start, end, bed, gain)
BEDS = [
 (0, T["n02"], "amb_shop", -6), (T["n02"], T["n03"] + 0.2, "amb_island", -4), (T["n03"], T["s04"] + 0.2, "amb_island_busy", -6),
 (T["s04"], W("yap", 0, "n08"), "amb_island_busy", -10), (W("yap", 0, "n08"), W("money", 0, "n09"), "amb_yap", -4), (W("money", 0, "n09"), T["n10"] + 1.0, "amb_island", -6),
 (T["n10"] + 1.0, W("bee", 0, "n11"), "amb_shop", -6), (W("bee", 0, "n11"), W("and", 0, "n11"), "amb_island_busy", -6), (W("and", 0, "n11"), T["n12"], "amb_shop", -6),
 (T["n12"], T["n14"], "amb_island", -7), (T["n14"], T["n16"], "amb_shop", -7), (T["n16"], T["penny_01"], "amb_island_busy", -7), (T["penny_01"], T["s07"], "amb_bank", -4),
 (T["s07"], W("boots", 0, "n20"), "amb_shop", -6), (W("boots", 0, "n20"), T["n24"], "amb_island_busy", -5), (T["n24"], T["s08"], "amb_shop", -7),
 (T["s08"], T["s09"], "amb_night", -4), (T["s09"], T["penny_03"], "amb_flat", -6), (T["penny_03"], E_("penny_03"), "amb_bank", -8), (E_("penny_03"), T["s10"], "amb_flat", -7),
 (T["s10"], T["n43"], "amb_island", -6), (T["n43"], D + 1, "amb_island_busy", -9),
]
for a, b, n, g in BEDS: bed(n, a, b, g, 0.5, 0.5)
# ---------------- effects ----------------
EV = []
def e(t, n, g=0.0, p=0.0): EV.append((t, n, g, p))
def card(t, g=-10): e(t - 0.04, "whoosh_b", g); e(t + 0.05, "pop", g - 2)
# s01
e(T["n01"] + 0.1, "paper", -10)
for i in range(4): e(W("four", 0, "n01") + 0.25 + i * 0.22, "pop", -9, -0.4 + 0.27 * i)
e(W("cent", 0, "n01"), "ding", -10)
e(T["n02"] - 0.1, "whoosh_a", -8); e(W("richer", 0, "n02"), "steel_up", -6); e(tBroke - 0.05, "record_scratch", -4); e(tBroke + 0.1, "steel_down", -8); e(W("same", 1, "n02"), "whoosh_c", -10)
e(T["n03"] - 0.2, "whoosh_b", -8); e(W("sandwich", 0, "n03"), "sparkle", -8)
e(T["s02"], "steel_up", -4); e(T["s02"] + 0.05, "boom", -9)
# s03
e(T["s03"], "gull", -10, 0.5); e(W("crumb", 0, "n04"), "pop", -10); e(T["n04"] + 4.2, "boat_horn", -16, -0.6)
for w, n in (("bread", "pop"), ("fish", "pop"), ("just", "pop")): e(W(w, 0, "n05") - 0.3, n, -9)
e(W("double", 0, "n06"), "boom", -10); e(W("luck", 0, "n06"), "fail_trombone", -8); card(W("historians", 0, "n06"), -12)
e(W("money", 0, "n07") - 0.3, "shimmer", -7); e(W("everyone", 1, "n07"), "boing", -12); e(W("agrees", 0, "n07"), "ding", -8)
# s04 yap
e(W("yap", 0, "n08") - 0.1, "whoosh_a", -8); e(W("sank", 0, "n08"), "splash", -11); e(W("sank", 0, "n08") + 0.4, "bubbles", -12); e(W("rich", 0, "n08"), "gold_chime", -9)
e(W("ripples", 0, "n09") - 0.2, "gold_chime", -6)
# s05 flow
e(T["n10"] + 1.0, "shop_bell", -9); e(W("ten", 1, "n10") + 0.4, "ka_ching", -6); e(W("ten", 1, "n10") + 0.6, "pop", -10); e(T["ana_01"] - 0.2, "munch", -10)
e(W("bee", 0, "n11") + 0.5, "coins", -12); e(W("finn", 0, "n11") + 0.5, "coins", -12); e(W("and", 0, "n11"), "shop_bell", -10); e(W("sandwich", 0, "n11") + 0.4, "ka_ching", -7); e(T["finn_02"] - 0.15, "munch", -9)
for i in range(4): e(T["n12"] + i * (W("forty", 0, "n12") - T["n12"]) / 4, "steel_up", -12, -0.5 + i * 0.33)
card(W("spending", 0, "n12")); card(W("one", 0, "n13"))
e(T["n14"] - 0.1, "whoosh_b", -10)
# s06 bank
e(W("sixty-two", 0, "n15"), "fail_trombone", -10); e(W("sixty-two", 0, "n15") - 0.3, "coins", -12)
e(W("approved", 0, "penny_01"), "stamp", -2); e(W("approved", 0, "penny_01") + 0.02, "boom", -9)
e(W("savings", 0, "n17") - 0.6, "thunk", -8); e(W("it's", 0, "n17") - 0.05, "record_scratch", -6)
e(W("types", 0, "n18"), "typing", -6); e(W("thousand", 1, "n18"), "sparkle", -5); e(W("thousand", 1, "n18"), "ka_ching", -9)
card(W("ninety-seven", 0, "n19")); card(W("not", 0, "n19")); card(W("banks", 0, "n19")); e(W("borrowing", 0, "n19"), "ding", -9); e(W("repaying", 0, "n19"), "vanish", -7)
# s07 boom
e(W("kai", 0, "n20") + 0.9, "thunk", -6); e(W("kai", 0, "n20") + 1.3, "oven_ding", -9); e(W("boots", 0, "n20"), "sparkle", -9); e(W("hires", 0, "n21"), "stamp", -8)
e(W("so", 0, "n22"), "steel_up", -9); e(W("booming", 0, "n23"), "cheer", -10)
e(W("twelve", 0, "n24"), "tick", -6); e(W("fourteen", 0, "n24"), "tick", -4); e(W("fourteen", 0, "n24") + 0.15, "boing", -12)
e(W("date", 0, "n25"), "stamp", -5); e(E_("n25") + 0.3, "clock_tick", -10)
# s08 bust
e(T["s08"] + 0.2, "boom", -12); e(W("disappears", 0, "n26"), "vanish", -6)
e(W("earns", 0, "n27"), "steel_down", -10); e(W("go", 0, "n27"), "door_slam", -9)
e(W("backwards", 0, "n28"), "slowmo", -8); card(W("paradox", 0, "n28") - 0.4)
# s09 lens
e(W("rent", 0, "n30"), "stamp", -8); e(W("car", 0, "n31"), "heartbeat", -10); e(W("worry", 0, "n32"), "heartbeat", -8); card(W("seventy-one", 0, "n32") - 0.2)
e(T["ana_02"] - 0.3, "slowmo", -9); e(W("through", 1, "n34") - 0.1, "gold_chime", -6)
e(W("call", 0, "n36"), "phone_ring", -14); card(W("one", 0, "n36")); card(W("two", 0, "n37")); e(W("change", 0, "n38"), "sparkle", -9)
# s10 gold
e(W("somebody", 0, "n39"), "shop_bell", -9); for_w = [("loaf", "coins"), ("fish", "coins"), ("sandwich", "ka_ching")]
for w, n in for_w: e(W(w, 0, "n40") + 0.3, n, -10)
e(W("forward", 0, "n40"), "steel_up", -7); e(W("vote", 0, "n42"), "shop_bell", -10); e(W("a", 0, "n43"), "pop", -6); e(W("b", 0, "n43"), "pop", -6)
e(W("sandwich", 0, "n44"), "munch", -9); e(E_("n44") + 0.6, "gold_chime", -8)
for t, n, g, p in EV: put(fx, sfx(n), t, g, p)
# ---------------- duck music + beds under voice ----------------
from scipy.ndimage import uniform_filter1d
from scipy.signal import lfilter
v = np.abs(voice).mean(1); win = int(0.05 * SR); env = uniform_filter1d(v, win)
env = env / (np.percentile(env[env > 1e-4], 90) + 1e-9); env = np.clip(env, 0, 1)
rel = int(0.35 * SR); a1 = np.exp(-1 / (rel / 4)); env = np.maximum(env, (lfilter([1 - a1], [1, -a1], env) * 4).clip(0, 1))
music *= (db(-9) ** env)[:, None]; beds *= (db(-4) ** env)[:, None]
mix = voice + music + beds + fx
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), mix.astype(np.float32), SR, subtype="FLOAT")
print("mix", round(len(mix) / SR, 2), "events", len(EV))
