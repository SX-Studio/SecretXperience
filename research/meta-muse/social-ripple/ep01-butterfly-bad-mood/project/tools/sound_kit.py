"""Social Ripple sound kit: every ambience, foley hit and viral-style accent is synthesised here
(or built from our own Kokoro walla), so nothing in a film can be Content-ID claimed.
Usage: python -I sound_kit.py <walla_dir> <out_dir>"""
import os, sys, glob
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly, fftconvolve

SR = 48000
rng = np.random.default_rng(2026)
WALLA, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)


def t_(d): return np.arange(int(d * SR)) / SR
def noise(n): return rng.standard_normal(n)
def lp(x, f, o=2): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def pink(n):
    w = noise(n); b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]; a = [1, -2.494956002, 2.017265875, -0.522189400]
    from scipy.signal import lfilter
    return lfilter(b, a, w)
def env_ad(n, a, d):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-np.arange(n - na) / (d * SR)); return e
def norm(x, peak=0.9): return x / (np.abs(x).max() + 1e-9) * peak
def reverb(x, secs=1.2, wet=0.25, damp=3000):
    ir = noise(int(secs * SR)) * np.exp(-np.arange(int(secs * SR)) / (secs * SR / 5)); ir = lp(ir, damp)
    y = fftconvolve(x, ir)[: len(x)]; y = y / (np.abs(y).max() + 1e-9) * np.abs(x).max()
    return (1 - wet) * x + wet * y
def stereo(x, pan=0.0, width=0.0):
    l = x * np.sqrt(0.5 * (1 - pan)); r = x * np.sqrt(0.5 * (1 + pan))
    if width:
        d = int(width * SR / 1000); r = np.concatenate([np.zeros(d), r[:-d]]) if d else r
    return np.stack([l, r], 1)
def place(buf, x, at):
    i = max(0, int(at * SR)); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i]
def fade(x, a=0.05, b=0.05):
    n = len(x); x = x.copy(); na, nb = int(a * SR), int(b * SR)
    if na: x[:na] *= np.linspace(0, 1, na)[:, None] if x.ndim == 2 else np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)[:, None] if x.ndim == 2 else np.linspace(1, 0, nb)
    return x
def save(name, x, peak=0.9):
    if x.ndim == 1: x = stereo(x)
    sf.write(os.path.join(OUT, name + ".wav"), norm(x, peak).astype(np.float32), SR, subtype="PCM_16")
    print(name, round(len(x) / SR, 2), "s")

# ---------------- ambiences (stereo, 60 s, loop-safe fades) ----------------
def wind(d=60, cut=700):
    n = int(d * SR); x = pink(n); t = t_(d)
    gust = 0.55 + 0.45 * np.sin(2 * np.pi * t / 7.3) * np.sin(2 * np.pi * t / 3.1 + 1)
    l = lp(x, cut) * gust; r = lp(pink(n), cut * 0.93) * gust[::-1]
    return fade(np.stack([l, r], 1), 2, 2)

def car_pass(d=4.0, f0=90):
    n = int(d * SR); t = t_(d); e = np.exp(-((t - d / 2) ** 2) / (2 * (d / 6) ** 2))
    eng = lp(noise(n), 300) * 2 + np.sin(2 * np.pi * np.cumsum(f0 * (1.08 - 0.16 * (t / d))) / SR) * 0.4
    tyre = bp(noise(n), 500, 2500) * 0.5
    x = (eng + tyre) * e; pan = np.linspace(-0.9, 0.9, n)
    return np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1)

def horn(d=0.9, f1=415, f2=495, far=False):
    t = t_(d); s = np.sign(np.sin(2 * np.pi * f1 * t)) * 0.5 + np.sign(np.sin(2 * np.pi * f2 * t)) * 0.5
    s = lp(s, 2600 if not far else 1100, 4); s = np.tanh(s * 1.6)
    e = np.ones_like(t); e[: int(0.015 * SR)] = np.linspace(0, 1, int(0.015 * SR)); e[-int(0.06 * SR):] = np.linspace(1, 0, int(0.06 * SR))
    s = s * e
    return reverb(s, 1.6 if far else 0.5, 0.55 if far else 0.12, 2000)

def birds(d):
    n = int(d * SR); x = np.zeros(n)
    for _ in range(int(d * 0.6)):
        at = rng.uniform(0, d - 1); k = rng.integers(2, 5); f = rng.uniform(2800, 4800)
        for j in range(k):
            dd = rng.uniform(0.05, 0.12); tt = t_(dd); sweep = f * (1 + 0.25 * np.sin(np.pi * tt / dd))
            ch = np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.sin(np.pi * tt / dd) ** 2
            place(x, ch * rng.uniform(0.2, 0.5), at + j * rng.uniform(0.09, 0.16))
    return x

def city(d=60):
    n = int(d * SR); bed = lp(noise(n), 160, 2) * 2.2 + lp(pink(n), 900) * 0.35
    out = stereo(bed, 0, 0.6)
    t = 2.0
    while t < d - 5:
        c = car_pass(rng.uniform(3, 5), rng.uniform(70, 110)) * rng.uniform(0.25, 0.6)
        if rng.random() < 0.5: c = c[:, ::-1]
        place(out, c, t); t += rng.uniform(3, 7)
    for at in rng.uniform(5, d - 3, 4):
        h = horn(rng.uniform(0.25, 0.6), rng.uniform(380, 460), rng.uniform(470, 540), far=True) * 0.12
        place(out, stereo(h, rng.uniform(-0.7, 0.7)), at)
    out += stereo(birds(d) * 0.12, 0.3, 0.8)
    out += wind(d) * 0.35
    return fade(out, 2, 2)

def walla(d=60, n_layers=26, cut=2600, room=1.4, wet=0.35):
    files = sorted(glob.glob(os.path.join(WALLA, "w*.wav")))
    clips = []
    for f in files:
        a, sr = sf.read(f)
        if a.ndim > 1: a = a.mean(1)
        if sr != SR: a = resample_poly(a, SR, sr)
        clips.append(a)
    out = np.zeros((int(d * SR), 2))
    for i in range(n_layers * int(d / 10)):
        c = clips[rng.integers(len(clips))] * rng.uniform(0.25, 0.7)
        rate = rng.uniform(0.92, 1.08); c = resample_poly(c, 100, int(100 * rate))
        place(out, stereo(lp(c, cut), rng.uniform(-0.8, 0.8), rng.uniform(0, 1.2)), rng.uniform(0, d - 3))
    out[:, 0] = reverb(out[:, 0], room, wet, 2200); out[:, 1] = reverb(out[:, 1], room, wet, 2200)
    return fade(out, 1.5, 1.5)

def clink(d=0.35, f=None):
    f = f or rng.uniform(2200, 3600); t = t_(d)
    x = sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * (18 + 6 * m)) / m for m in (1, 2.71, 4.13))
    return x * 0.6

def cafe(d=60):
    out = walla(d) * 1.0
    room = stereo(lp(pink(int(d * SR)), 400) * 0.25, 0, 0.5); out += room
    for at in rng.uniform(1, d - 1, int(d * 0.5)): place(out, stereo(clink(), rng.uniform(-0.8, 0.8)) * rng.uniform(0.15, 0.35), at)
    for at in rng.uniform(5, d - 5, 3): place(out, stereo(espresso(rng.uniform(1.5, 2.5)) * 0.18, rng.uniform(-0.5, 0.5)), at)
    return fade(out, 2, 2)

def auditorium(d=40):
    out = walla(d, 18, 1500, 2.4, 0.55) * 0.8
    out += stereo(lp(pink(int(d * SR)), 250) * 0.3, 0, 0.6)
    return fade(out, 2, 2)

# ---------------- foley ----------------
def espresso(d=2.4):
    n = int(d * SR); t = t_(d)
    hiss = bp(noise(n), 2500, 7000) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t) ** 2)
    gurgle = lp(noise(n), 300) * (rng.random(n) < 0.002).cumsum() % 2
    e = np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.3)
    return (hiss + gurgle * 0.3) * e

def bell(d=1.6, f=1320):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * (2.5 + 1.2 * m)) * w for m, w in ((1, 1), (2.76, 0.5), (5.4, 0.3), (8.9, 0.15)))
    return x

def shop_bell():
    out = np.zeros(int(1.8 * SR))
    for at, f in ((0, 1760), (0.09, 2090), (0.2, 1760), (0.33, 2090)): place(out, bell(1.4, f) * 0.5, at)
    return reverb(out, 0.6, 0.15)

def coins():
    out = np.zeros(int(2.2 * SR)); at = 0
    for k in range(14):
        place(out, clink(0.25, rng.uniform(3200, 6200)) * (1 - k / 18), at); at += rng.uniform(0.03, 0.16) * (1 + k / 8)
    return reverb(out, 0.4, 0.1)

def thud(d=0.35, f=90):
    t = t_(d); return np.sin(2 * np.pi * f * t * (1 - 0.3 * t)) * np.exp(-t * 22) + lp(noise(len(t)), 600) * np.exp(-t * 40) * 0.6

def paper(d=0.6):
    n = int(d * SR); t = t_(d); return bp(noise(n), 900, 5000) * np.sin(np.pi * t / d) ** 1.5

def chalk(d=1.6):
    n = int(d * SR); out = np.zeros(n)
    at = 0.0
    while at < d - 0.15:
        dd = rng.uniform(0.06, 0.18); s = bp(noise(int(dd * SR)), 700, 3200) * np.sin(np.pi * t_(dd) / dd) + lp(noise(int(dd * SR)), 400) * 0.6 * np.sin(np.pi * t_(dd) / dd)
        s *= 1 + 0.25 * np.sign(np.sin(2 * np.pi * rng.uniform(25, 60) * t_(dd)))
        place(out, s * rng.uniform(0.5, 1), at); at += dd + rng.uniform(0.02, 0.09)
    return out

def scribble(d=1.4):
    n = int(d * SR); t = t_(d); return bp(noise(n), 1500, 5000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * t))) * np.minimum(1, (d - t) * 5)

def rustle(d=1.2):
    n = int(d * SR); out = np.zeros(n)
    for at in rng.uniform(0, d - 0.1, 26): place(out, bp(noise(int(0.04 * SR)), 1200, 7000) * np.hanning(int(0.04 * SR)) * rng.uniform(0.3, 1), at)
    return out

def steps(n_steps=8, rate=1.9, f=85):
    out = np.zeros(int((n_steps / rate + 0.5) * SR))
    for k in range(n_steps): place(out, thud(0.2, f * rng.uniform(0.9, 1.1)) * rng.uniform(0.6, 1), k / rate + rng.uniform(-0.01, 0.01))
    return out

def crossing_beep(d=3.0):
    out = np.zeros(int(d * SR))
    for k in range(int(d / 0.25)):
        tt = t_(0.06); place(out, np.sign(np.sin(2 * np.pi * 2200 * tt)) * 0.3 * np.hanning(len(tt)), k * 0.25)
    return lp(out, 5000)

def car_brake():
    d = 1.4; t = t_(d); sq = np.sin(2 * np.pi * (2100 + 90 * np.sin(2 * np.pi * 11 * t)) * t) * np.exp(-((t - 0.45) ** 2) / 0.03) * 0.25
    eng = lp(noise(len(t)), 200) * np.linspace(1, 0.3, len(t))
    return sq + eng

def applause(d=5.0, people=40):
    out = np.zeros(int(d * SR)); t_end = d - 0.8
    for p in range(people):
        rate = rng.uniform(3, 5.5); ph = rng.uniform(0, 1 / rate); g = rng.uniform(0.3, 1)
        k = ph
        while k < t_end:
            c = bp(noise(int(0.012 * SR)), rng.uniform(800, 1500), rng.uniform(3000, 6000)) * np.exp(-np.arange(int(0.012 * SR)) / (0.003 * SR))
            place(out, c * g * min(1, k / 0.6) * min(1, (d - k) / 1.4), k); k += 1 / rate * rng.uniform(0.9, 1.1)
    return reverb(out, 1.8, 0.3)

def sneeze():
    a, sr = sf.read(os.path.join(WALLA, "sneeze_tts.wav"))
    if a.ndim > 1: a = a.mean(1)
    a = resample_poly(a, SR, sr)
    burst = bp(noise(int(0.35 * SR)), 900, 6000) * env_ad(int(0.35 * SR), 0.005, 0.07) * 1.6
    out = np.concatenate([a, np.zeros(int(0.1 * SR))]); place(out, burst * np.abs(a).max(), len(a) / SR - 0.38)
    return out

# ---------------- viral-style accents (original synths) ----------------
def boom():  # deep cinematic "boom" hit, the meme-standard punchline
    d = 2.2; t = t_(d); f = 38 + 60 * np.exp(-t * 9)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.9)
    x = np.tanh(x * 2.4) + lp(noise(len(t)), 900) * np.exp(-t * 30) * 0.5
    return reverb(x, 1.8, 0.2, 1200)

def record_scratch():
    d = 0.75; t = t_(d); sp = np.abs(np.sin(2 * np.pi * 2.6 * t)) + 0.05
    x = bp(noise(len(t)), 300, 3000)
    ph = np.cumsum(sp) / SR * 900; tone = np.sin(2 * np.pi * ph) * 0.6
    return (x * sp + tone * sp) * np.minimum(1, (d - t) * 8)

def fail_trombone():
    notes = [(233.1, 0.42), (220.0, 0.42), (207.7, 0.42), (196.0, 1.4)]; out = []
    for i, (f, d) in enumerate(notes):
        t = t_(d); vib = 1 + (0.012 * np.sin(2 * np.pi * 5.5 * t) * (t / d) if i == 3 else 0)
        ph = np.cumsum(f * vib) / SR; s = 2 * (ph % 1) - 1
        wah = np.sin(np.pi * t / d); s = (lp(s, 500, 2) * (1 - wah) + lp(s, 1900, 2) * wah) * np.minimum(1, t / 0.04) * np.minimum(1, (d - t) / 0.08)
        out.append(s)
    return reverb(np.concatenate(out), 0.8, 0.15)

def sting():  # "dun dun DUNNN"
    out = np.zeros(int(3.0 * SR))
    for at, root, d in ((0, 98, 0.32), (0.42, 98, 0.32), (0.84, 92.5, 2.0)):
        t = t_(d); s = sum((2 * ((np.cumsum(np.full(len(t), root * m)) / SR) % 1) - 1) for m in (1, 1.5, 2, 2.0 * 1.189))
        s = lp(s, 900, 3) * env_ad(len(t), 0.01, d * 0.7)
        place(out, s, at)
    return reverb(out, 1.4, 0.25)

def ding(): return reverb(bell(1.8, 2093) + bell(1.8, 2637) * 0.5, 1.0, 0.2)

def boing():
    d = 0.7; t = t_(d); f = 180 + 520 * (1 - np.exp(-t * 6)) + 40 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 3)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4)

def ka_ching():
    out = np.zeros(int(1.6 * SR)); place(out, rustle(0.25) * 0.6, 0); place(out, thud(0.3, 140) * 0.5, 0.18)
    place(out, bell(1.3, 2637) * 0.8, 0.22); place(out, bell(1.3, 3136) * 0.6, 0.3)
    return out

def whoosh(d=0.8, up=False):
    n = int(d * SR); t = t_(d); x = noise(n); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        p = i / n; fc = (300 * (10 ** (p * 1.1))) if up else (3200 * (10 ** (-p * 1.0)))
        seg = bp(x[max(0, i - 2048): i + blk], max(60, fc * 0.6), min(20000, fc * 1.5))[-len(x[i:i + blk]):]
        out[i:i + blk] = seg
    return out * np.sin(np.pi * t / d) ** 2

def shimmer(d=3.0):
    t = t_(d); out = np.zeros(len(t))
    for k, f in enumerate((1568, 1976, 2349, 2637, 3136, 3951)):
        place(out, bell(2.2, f) * 0.3, k * 0.18)
    return reverb(out, 2.0, 0.4)

def pop(): t = t_(0.18); f = 400 + 900 * np.exp(-t * 40); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28)

def tom(f=110): return reverb(_tom(f), 1.1, 0.28, 2500)
def _tom(f=110): t = t_(0.8); return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 18))) / SR) * np.exp(-t * 6) + lp(noise(len(t)), 2000) * np.exp(-t * 60) * 0.3

if __name__ == "__main__" and not os.environ.get("ONLY"):
    save("amb_city", city(60), 0.5); save("amb_wind", wind(60, 420), 0.35)
    save("amb_cafe", cafe(120), 0.5); save("amb_auditorium", auditorium(40), 0.45)
    save("horn_close", horn(1.1)); save("horn_short", horn(0.28))
    save("car_pass", car_pass(4.0)); save("car_brake", car_brake(), 0.6)
    save("crossing_beep", crossing_beep(4.0), 0.4)
    save("espresso", espresso(), 0.6); save("shop_bell", shop_bell(), 0.6); save("coins", coins(), 0.7)
    save("cup_set", thud(0.25, 320), 0.6); save("paper", paper(), 0.5); save("chalk", chalk(), 0.5)
    save("scribble", scribble(), 0.5); save("bags", rustle(), 0.6); save("steps", steps(), 0.6)
    save("applause", applause(6.0), 0.7); save("sneeze", sneeze(), 0.9)
    save("boom", boom()); save("record_scratch", record_scratch(), 0.8); save("fail_trombone", fail_trombone(), 0.7)
    save("sting", sting(), 0.8); save("ding", ding(), 0.7); save("boing", boing(), 0.7); save("ka_ching", ka_ching(), 0.8)
    save("whoosh_a", whoosh(0.8), 0.7); save("whoosh_b", whoosh(0.6, True), 0.7); save("whoosh_c", whoosh(1.1), 0.7)
    save("shimmer", shimmer(), 0.6); save("pop", pop(), 0.6); save("tom1", tom(110)); save("tom2", tom(92)); save("tom3", tom(78))

def clock_tick(d=2.0):
    out = np.zeros(int(d * SR))
    for k in range(int(d / 0.5)):
        f = 2400 if k % 2 == 0 else 1900; t = t_(0.05)
        place(out, np.sin(2 * np.pi * f * t) * np.exp(-t * 120) + bp(noise(len(t)), 2000, 6000) * np.exp(-t * 300) * 0.4, k * 0.5)
    return out
if __name__ == "__main__" and os.environ.get("ONLY") == "tick":
    save("clock_tick", clock_tick(), 0.6)
