"""Ink-test mix: narration + synthesized pencil/paper foley (from the page's own draw events) + a soft synthesized
lo-fi keys bed that drops out for the poster card. Writes assets/mix_raw.wav (loudnorm afterwards)."""
import json, os, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR = 48000; rng = np.random.default_rng(8)
EV = json.load(open(os.path.join(ROOT, "tools/events.json"))); D = EV["D"]; N = int(D * SR) + SR
src = open(os.path.join(ROOT, "assets/t.js")).read(); DT = json.loads(src.split("window.DT = ")[1].split("; window.DUR")[0])
db = lambda x: 10 ** (x / 20)
bp = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
def put(buf, x, at, g=0.0, pan=0.0):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j <= i or i < 0: return
    x = x[: j - i] * db(g); buf[i:j, 0] += x * np.sqrt(1 - pan) / 1.414 * 1.414; buf[i:j, 1] += x * np.sqrt(1 + pan) / 1.414 * 1.414
def env(n, a=0.01, r=0.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def scribble(dur, loud=1.0):
    n = max(int(dur * SR), 2000); x = bp(rng.standard_normal(n), 1800, 7000)
    t = np.arange(n) / SR; am = 0.55 + 0.45 * np.sin(2 * np.pi * (9 + 5 * rng.random()) * t + rng.random() * 6) ** 2
    am *= 0.7 + 0.3 * np.abs(np.sin(2 * np.pi * 3.1 * t)); return x * am * env(n, 0.015, 0.04) * 0.25 * loud
def pop():
    n = int(0.09 * SR); t = np.arange(n) / SR; f = 520 + 600 * t / t[-1]; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40) * 0.5
def swish():
    n = int(0.22 * SR); x = bp(rng.standard_normal(n), 2500, 9000); return x * np.hanning(n) * 0.35
def slap():
    n = int(0.12 * SR); x = lp(rng.standard_normal(n), 3000); t = np.arange(n) / SR; return x * np.exp(-t * 45) * 0.9
def whoosh():
    n = int(0.75 * SR); x = rng.standard_normal(n); out = np.zeros(n)
    for k in range(6): seg = slice(k * n // 6, (k + 1) * n // 6); out[seg] = bp(x, 300 + 500 * k, 1200 + 900 * k)[seg]
    return out * np.hanning(n) * 0.5
def slam(big=False):
    n = int((1.4 if big else 0.5) * SR); t = np.arange(n) / SR; f = 70 * np.exp(-t * 6) + 42
    thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (3.5 if big else 9)); clap = lp(rng.standard_normal(n), 5000) * np.exp(-t * 30) * 0.5
    return (thump * 1.1 + clap) * (1.0 if big else 0.7)
FOL = np.zeros((N, 2))
for e in EV["events"]:
    ty = e["type"]; at = e["at"]; pan = float(rng.uniform(-0.25, 0.25))
    if ty == "draw": put(FOL, scribble(e.get("dur", 0.4), e.get("loud", 1.0)), at, -20, pan)
    elif ty == "pop": put(FOL, pop(), at, -22, pan)
    elif ty == "swish": put(FOL, swish(), at, -20, pan)
    elif ty == "slap": put(FOL, slap(), at, -16, 0.2)
    elif ty == "whoosh": put(FOL, whoosh(), at, -22)
    elif ty == "slam": put(FOL, slam(), at, -10)
    elif ty == "bigslam": put(FOL, slam(True), at, -7)
# paper bed: soft room tone with faint paper rustle
room = lp(rng.standard_normal(N), 900) * 0.02; put(FOL, room, 0, -18)
# ---- music: soft lo-fi keys, Am F C G at 76 BPM ----
bpm = 76; beat = 60 / bpm; MUS = np.zeros((N, 2))
def key(f, dur, vel=0.35):
    n = int(dur * SR); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3) + 0.12 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 5)
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.5 * t); return tone * trem * np.exp(-t * 1.6) * env(n, 0.006, 0.3) * vel
nt = lambda m: 440 * 2 ** ((m - 69) / 12)
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; bass = [45, 41, 36, 43]
t0 = 0.0; bar = 4 * beat; k = 0
while t0 < D:
    ch = prog[k % 4]
    for b in range(4):
        for i, m in enumerate(ch): put(MUS, key(nt(m + (12 if b % 2 else 0) * (i == 2)), beat * 1.8, 0.16 if b else 0.22), t0 + b * beat + i * 0.012, 0, (i - 1) * 0.3)
    put(MUS, key(nt(bass[k % 4]), bar * 0.95, 0.35), t0, 0)
    t0 += bar; k += 1
crackle = np.zeros(N); idx = rng.integers(0, N, int(D * 30)); crackle[idx] = rng.uniform(-1, 1, len(idx)); crackle = bp(crackle, 1500, 8000) * 0.6
MUS[:, 0] += crackle * 0.3; MUS[:, 1] += crackle * 0.3
# arrangement: in under the open, OUT for the poster card (silence + slams), back for the brain, a final chord on the title
g = np.ones(N); p0, p1 = EV["posterOn"]; t_ = np.arange(N) / SR
g *= np.clip(t_ / 1.0, 0, 1); g[(t_ >= p0 - 0.25) & (t_ < p1 + 0.3)] = 0
ramp = (t_ >= p1 + 0.3) & (t_ < p1 + 1.3); g[ramp] = (t_[ramp] - p1 - 0.3)
g[t_ > D - 2.5] *= np.clip((D - t_[t_ > D - 2.5]) / 2.5, 0, 1)
MUS *= (g * db(-21))[:, None]
ti = EV["titleOn"][0]
for i, m in enumerate([45, 57, 60, 64, 69]): put(MUS, key(nt(m), 3.2, 0.45), ti + 0.7 + i * 0.03, -16, (i - 2) * 0.2)
# ---- narration ----
VO = np.zeros((N, 2))
for lid, (st, d) in DT.items():
    a, sr = sf.read(os.path.join(ROOT, "assets/vo", lid + ".wav")); a = a.mean(1) if a.ndim > 1 else a
    if sr != SR: a = resample_poly(a, SR, sr)
    put(VO, a, st, -1)
v = np.abs(VO).mean(1); e = np.convolve(v, np.ones(int(0.12 * SR)) / int(0.12 * SR), "same"); e = e / (np.percentile(e[e > 1e-4], 90) + 1e-9)
duck = np.convolve(np.clip(e * 3, 0, 1), np.ones(int(0.3 * SR)) / int(0.3 * SR), "same"); MUS *= db(-7 * duck)[:, None]
out = (VO + FOL + MUS)[: int(D * SR)]
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), out.astype(np.float32), SR, subtype="FLOAT"); print("ok peak", round(float(np.abs(out).max()), 3), "len", round(len(out) / SR, 2))
