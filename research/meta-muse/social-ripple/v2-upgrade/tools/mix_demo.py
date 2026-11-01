"""Mix for the v2 style test: synced footsteps, voiced lines, room reverb per location, panned SFX, ambience, music."""
import os, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly, fftconvolve
SR = 48000; P = sys.argv[1]; MUS = sys.argv[2]; OUT = sys.argv[3]; TOTAL = 15.0; N = int(TOTAL * SR)
def load(p):
    a, sr = sf.read(p, always_2d=True); a = a.astype(float)
    if a.shape[1] == 1: a = np.repeat(a, 2, 1)
    if sr != SR: a = np.stack([resample_poly(a[:, c], SR, sr) for c in range(2)], 1)
    return a
db = lambda x: 10 ** (x / 20)
def add(buf, a, at, g=1.0, pan=0.0, off=0.0, dur=None, fin=0, fout=0):
    a = a[int(off * SR):] * g
    if dur: a = a[: int(dur * SR)]
    if fin: n = int(fin * SR); a[:n] *= np.linspace(0, 1, n)[:, None]
    if fout: n = int(fout * SR); a[-n:] *= np.linspace(1, 0, n)[:, None]
    if pan: a = a * np.array([np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))]) * np.sqrt(2)
    i = int(at * SR); j = min(N, i + len(a))
    if j > i: buf[i:j] += a[: j - i]
X = lambda n: load(os.path.join(P, "assets/sfx", n + ".wav"))
V = lambda n: load(os.path.join(P, ".react", n + ".wav"))
def steps_for(x0, x1, t0, t1, stride, ease="out"):
    ts = np.linspace(t0, t1, 2000); k = (ts - t0) / (t1 - t0)
    e = 1 - (1 - k) ** 3 if ease == "out" else k
    d = np.abs(e * (x1 - x0)); half = stride / 2; out = []; nxt = half * 0.5
    for tt, dd in zip(ts, d):
        if dd >= nxt: out.append(tt); nxt += half
    return out
street, cafe = np.zeros((N, 2)), np.zeros((N, 2))
# ---- t1: street (0-8) ----
for i, st in enumerate(steps_for(120, 860, 0.0, 4.4, 193 * 1.08)): add(street, X(f"step_concrete_{i % 6}"), st, db(-12), pan=-0.4 + i * 0.05)
for i, st in enumerate(steps_for(1260, 1130, 2.6, 4.2, 193 * 1.08)): add(street, X(f"step_concrete_{(i + 3) % 6}"), st, db(-14), pan=0.35)
add(street, X("rustle_0"), 4.55, db(-14), pan=-0.1); add(street, X("rustle_1"), 6.2, db(-14), pan=0.2)
add(street, X("boop_a"), 4.8, db(-16)); add(street, V("morning_f"), 4.9, db(-1), pan=-0.15)
add(street, X("boop_b"), 6.3, db(-16)); add(street, V("usual_m"), 6.35, db(-1), pan=0.2)
add(street, X("ding"), 6.4, db(-10), pan=0.2); add(street, X("shimmer"), 6.45, db(-12)); add(street, V("haha_f"), 6.95, db(-4), pan=-0.15)
add(street, X("car_pass"), 0.2, db(-14)); add(street, X("car_pass")[:, ::-1], 3.6, db(-16)); add(street, X("whoosh_a"), 7.85, db(-14))
# ---- t2: cafe (8-15) ----
for i, st in enumerate(steps_for(420, 960, 8.0, 10.2, 193 * 0.78)): add(cafe, X(f"step_wood_{i % 6}"), st, db(-13), pan=-0.5 + i * 0.08)
add(cafe, X("espresso"), 8.3, db(-18), pan=0.6); add(cafe, X("shop_bell"), 8.05, db(-18), pan=-0.7)
add(cafe, V("hmm_m"), 8.6, db(-6), pan=0.3)
add(cafe, X("boop_a"), 9.2, db(-16)); add(cafe, V("drew_m"), 9.25, db(-1), pan=0.3)
add(cafe, X("rustle_2"), 10.4, db(-14)); add(cafe, X("boop_b"), 11.1, db(-16)); add(cafe, V("cape_kid"), 11.15, db(-1), pan=-0.1)
add(cafe, X("boop_a"), 13.1, db(-16)); add(cafe, V("best_m"), 13.15, db(-1), pan=0.25); add(cafe, X("boom"), 13.1, db(-14)); add(cafe, X("shimmer"), 13.15, db(-11)); add(cafe, V("yay_kid"), 14.1, db(-4), pan=-0.1)
# ---- room reverb per location ----
def verb(x, irname, wet):
    ir = np.load(os.path.join(P, "assets/sfx", irname + ".npy")); ir = ir / np.abs(ir).sum() * 6
    y = np.stack([fftconvolve(x[:, c], ir)[:N] for c in range(2)], 1); return x + wet * y
mix = verb(street, "ir_street", 0.4) + verb(cafe, "ir_cafe", 0.8)
# ---- ambience + music ----
add(mix, X("amb_city"), 0.0, db(-19), dur=8.3, fout=0.4); add(mix, X("amb_cafe"), 7.9, db(-19), dur=7.1, fin=0.4)
add(mix, load(MUS), 0.0, db(-21), off=18.0, dur=TOTAL, fin=0.6, fout=1.5)
pk = np.abs(mix).max(); mix *= 0.9 / pk
sf.write(OUT, mix.astype(np.float32), SR, subtype="FLOAT"); print("demo mix", OUT)
