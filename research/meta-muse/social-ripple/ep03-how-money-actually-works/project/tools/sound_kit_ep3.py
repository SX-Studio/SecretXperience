"""Social Ripple ep2 sound kit: school foley, phone UI sounds, comedy accents and location beds.
Everything is synthesised (or built from our own Kokoro teen walla), so nothing can be Content-ID claimed.
Usage: python -I sound_kit3.py <out_dir> <walla_dir> <react_dir>"""
import os, sys, glob
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly, fftconvolve

SR = 48000; rng = np.random.default_rng(902)
OUT = sys.argv[1]
t_ = lambda d: np.arange(int(d * SR)) / SR
noise = lambda n: rng.standard_normal(n)
lp = lambda x, f, o=2: sosfilt(butter(o, f, "low", fs=SR, output="sos"), x, axis=0)
hp = lambda x, f, o=2: sosfilt(butter(o, f, "high", fs=SR, output="sos"), x, axis=0)
bp = lambda x, lo, hi, o=2: sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)
def pink(n):
    w = noise(n); f = np.fft.rfft(w); f[1:] /= np.sqrt(np.arange(1, len(f))); return np.fft.irfft(f, n)
def reverb(x, secs=1.0, wet=0.25, damp=3000):
    n = int(secs * SR); ir = noise(n) * np.exp(-np.arange(n) / (secs * SR / 6)); ir = lp(ir, damp); ir /= np.abs(ir).sum() ** 0.5 * 4
    return x * (1 - wet) + fftconvolve(x, ir)[: len(x)] * wet * 3
def stereo(x, pan=0.0):
    return np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1)
def place(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i]
def fade(x, a=0.05, b=0.05):
    x = x.copy(); na, nb = int(a * SR), int(b * SR)
    if na: x[:na] *= np.linspace(0, 1, na)[:, None] if x.ndim > 1 else np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)[:, None] if x.ndim > 1 else np.linspace(1, 0, nb)
    return x
def save(name, x, peak=0.85):
    x = x / (np.abs(x).max() + 1e-9) * peak
    if x.ndim == 1: x = np.stack([x, x], 1)
    sf.write(os.path.join(OUT, name + ".wav"), x.astype(np.float32), SR, subtype="PCM_16")
def load_dir(d, pat="*.wav"):
    C = {}
    for f in sorted(glob.glob(os.path.join(d, pat))):
        a, sr = sf.read(f); a = a.mean(1) if a.ndim > 1 else a; C[os.path.basename(f)[:-4]] = resample_poly(a, SR, sr)
    return C

# ---------------- foley ----------------
def metal(d, freqs, decay, amp=1.0):
    t = t_(d); return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * decay * (1 + i * 0.4)) for i, f in enumerate(freqs)) * amp
# ---------------- island beds ----------------
def waves(d, g=1.0):
    n = int(d * SR); t = t_(d); out = np.zeros((n, 2))
    for ch in range(2):
        swell = 0.55 + 0.45 * np.sin(2 * np.pi * t / rng.uniform(6.5, 9.0) + rng.uniform(0, 6)) ** 2
        out[:, ch] = lp(pink(n), 900) * swell + bp(noise(n), 1500, 6000) * 0.08 * swell ** 3
    return out * g
def gull(f0=None):
    d = rng.uniform(0.35, 0.6); t = t_(d); f0 = f0 or rng.uniform(1700, 2300)
    f = f0 * (1 + 0.35 * np.sin(np.pi * t / d)) * (1 - 0.25 * t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    x = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)) * np.sin(np.pi * t / d) ** 0.6
    return hp(x, 900) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 9 * t)))
def gulls(d, n):
    out = np.zeros((int(d * SR), 2))
    for at in sorted(rng.uniform(0, d - 1, n)):
        g = rng.uniform(0.08, 0.3); pan = rng.uniform(-0.9, 0.9)
        for k in range(rng.integers(1, 4)): place(out, stereo(reverb(gull(), 1.5, 0.35) * g, pan), at + k * rng.uniform(0.35, 0.55))
    return out
def wind(d, g=0.3):
    n = int(d * SR); t = t_(d); return np.stack([bp(pink(n), 200, 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 11)) * g, bp(pink(n), 200, 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 13 + 1)) * g], 1)
def hum(d, f=60, g=0.05):
    t = t_(d); x = sum(np.sin(2 * np.pi * f * k * t) / k for k in (1, 2, 3, 5)) * g + lp(pink(len(t)), 300) * 0.03; return stereo(x, 0)
def ticks(d, g=0.2):
    out = np.zeros((int(d * SR), 2)); t = 0.3
    while t < d - 0.1: tt = t_(0.03); place(out, stereo(np.sin(2 * np.pi * (2600 if int(t) % 2 else 2200) * tt) * np.exp(-tt * 200) * g, 0.4), t); t += 1.0
    return out
def crickets(d=40):
    out = np.zeros((int(d * SR), 2))
    for c in range(9):
        f = rng.uniform(3800, 5200); pan = rng.uniform(-1, 1); g = rng.uniform(0.15, 0.5); per = rng.uniform(0.7, 1.4); t = rng.uniform(0, 1)
        while t < d - 0.4:
            chirp = np.zeros(int(0.12 * SR))
            for k in range(3): tt = t_(0.025); place(chirp, np.sin(2 * np.pi * f * tt) * np.sin(np.pi * tt / 0.025), k * 0.035)
            place(out, stereo(chirp * g, pan), t); t += per * rng.uniform(0.9, 1.1)
    return out
def rain(d, g=0.25):
    n = int(d * SR); out = np.stack([hp(lp(noise(n), 6000), 800), hp(lp(noise(n), 6000), 800)], 1) * 0.15
    for at in rng.uniform(0, d - 0.05, int(d * 25)): place(out, stereo(bp(noise(int(0.008 * SR)), 2000, 8000) * rng.uniform(0.05, 0.4), rng.uniform(-0.8, 0.8)), at)
    return out * g
def clink(): f = rng.uniform(2000, 3400); t = t_(0.3); return sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * (18 + 6 * m)) / m for m in (1, 2.71, 4.13)) * 0.6
def murmur(d, g=0.25):
    # unintelligible town chatter: formant-filtered noise "syllables"
    out = np.zeros((int(d * SR), 2))
    for v in range(10):
        pan = rng.uniform(-0.9, 0.9); f0 = rng.uniform(110, 230); t = rng.uniform(0, 2)
        while t < d - 0.4:
            sd = rng.uniform(0.08, 0.2); tt = t_(sd); ph = 2 * np.pi * np.cumsum(f0 * (1 + 0.1 * np.sin(2 * np.pi * 3 * tt))) / SR
            src = np.sign(np.sin(ph)) * 0.5 + noise(len(tt)) * 0.1; fm = rng.choice([500, 700, 900, 1200]); syl = bp(src, fm * 0.7, fm * 1.6) * np.sin(np.pi * tt / sd)
            place(out, stereo(syl * rng.uniform(0.3, 1), pan), t); t += sd + (rng.uniform(0.02, 0.08) if rng.random() < 0.85 else rng.uniform(0.4, 1.4))
    out[:, 0] = reverb(lp(out[:, 0], 2200), 1.0, 0.4); out[:, 1] = reverb(lp(out[:, 1], 2200), 1.0, 0.4); return out * g
# ---------------- foley ----------------
def typing(d=1.6):
    out = np.zeros(int(d * SR)); t = 0.02
    while t < d - 0.05: n = int(0.025 * SR); place(out, bp(noise(n), 1500, 7000) * np.exp(-np.arange(n) / (0.004 * SR)) * rng.uniform(0.5, 1) + np.sin(2 * np.pi * 180 * t_(0.025)) * np.exp(-t_(0.025) * 150) * 0.3, t); t += rng.uniform(0.07, 0.14)
    return out
def shop_bell():
    a = metal(1.4, [1318, 2637, 3520], 4.0); b = np.zeros_like(a); place(b, metal(1.2, [1568, 3136, 4186], 4.5) * 0.8, 0.12); return reverb(a + b, 1.2, 0.3)
def splash():
    t = t_(1.2); return reverb(lp(noise(len(t)), 3000) * np.exp(-t * 4) * (1 - np.exp(-t * 60)) + bp(noise(len(t)), 300, 1200) * np.exp(-t * 8), 1.0, 0.3)
def bubbles(d=1.6):
    out = np.zeros(int(d * SR))
    for at in sorted(rng.uniform(0, d - 0.1, 14)): bd = rng.uniform(0.04, 0.09); tt = t_(bd); f = rng.uniform(500, 1400) * (1 + 2 * tt / bd); place(out, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / bd) * rng.uniform(0.3, 1), at)
    return out
def thunk():
    t = t_(0.5); return lp(noise(len(t)), 400) * np.exp(-t * 18) + np.sin(2 * np.pi * 70 * t) * np.exp(-t * 14) * 1.2
def oven_ding(): return metal(1.6, [2093, 4186, 6279], 3.0)
def boat_horn():
    t = t_(1.6); ph = 2 * np.pi * 110 * t; x = (np.sign(np.sin(ph)) * 0.4 + np.sin(ph) + np.sin(2 * ph) * 0.4) * np.minimum(1, t / 0.08) * np.minimum(1, (1.6 - t) / 0.3); return reverb(lp(x, 1800), 2.0, 0.4)
def steel(note=72, d=1.2):
    f = 440 * 2 ** ((note - 69) / 12); t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t) + 0.25 * np.sin(2 * np.pi * 2.76 * f * t)) * np.exp(-t * 3.5) * (1 - np.exp(-t * 200))
def steel_up(): out = np.zeros(int(1.4 * SR)); [place(out, steel(n, 1.0) * 0.6, i * 0.09) for i, n in enumerate([67, 71, 74, 79])]; return out
def steel_down(): out = np.zeros(int(1.6 * SR)); [place(out, steel(n, 1.2) * 0.6, i * 0.14) for i, n in enumerate([76, 72, 69, 64])]; return out
def drawer(): t = t_(0.45); return bp(noise(len(t)), 800, 3000) * np.exp(-((t - 0.12) / 0.08) ** 2) * 0.5 + metal(0.45, [3500, 5200], 12) * (t > 0.3) * 0.5
def munch():
    out = np.zeros(int(0.6 * SR))
    for k in range(3): n = int(0.08 * SR); place(out, bp(noise(n), 900, 5000) * np.exp(-np.arange(n) / (0.02 * SR)) * rng.uniform(0.6, 1), k * 0.16 + rng.uniform(0, 0.02))
    return out
def phone_ring():
    t = t_(2.2); x = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * (np.sin(2 * np.pi * 20 * t) > 0) * ((t % 2.0) < 1.0); return x * 0.5
def vanish(): t = t_(0.9); f = 1600 * np.exp(-t * 2.2); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3) * 0.6 + hp(noise(len(t)), 5000) * np.exp(-t * 6) * 0.15
def sparkle(): out = np.zeros(int(1.0 * SR)); [place(out, metal(0.4, [f, f * 2.01], 9) * 0.4, i * 0.06) for i, f in enumerate([2093, 2637, 3136, 3951, 4186])]; return out

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    save("amb_island", waves(60) + gulls(60, 7) + wind(60, 0.25), 0.7)
    save("amb_island_busy", waves(60, 0.7) + gulls(60, 9) + murmur(60, 0.5), 0.7)
    save("amb_night", waves(60, 0.6) + crickets(60) * 0.5 + wind(60, 0.15), 0.6)
    save("amb_shop", hum(40, 60, 0.05) + murmur(40, 0.18) + waves(40, 0.12), 0.5)
    save("amb_bank", stereo(lp(pink(int(40 * SR)), 400) * 0.08, 0) + ticks(40, 0.25), 0.5)
    save("amb_flat", hum(40, 50, 0.04) + ticks(40, 0.15) + rain(40, 0.5), 0.5)
    save("amb_yap", waves(40, 1.0) + wind(40, 0.35) + gulls(40, 3), 0.7)
    for name, fn, pk in [("typing", typing, 0.6), ("shop_bell", shop_bell, 0.6), ("splash", splash, 0.8), ("bubbles", bubbles, 0.6), ("thunk", thunk, 0.85), ("oven_ding", oven_ding, 0.6),
                         ("boat_horn", boat_horn, 0.7), ("steel_up", steel_up, 0.7), ("steel_down", steel_down, 0.7), ("drawer", drawer, 0.6), ("munch", munch, 0.7), ("phone_ring", phone_ring, 0.5),
                         ("vanish", vanish, 0.6), ("sparkle", sparkle, 0.6), ("gull", lambda: reverb(gull(), 1.5, 0.3), 0.6), ("clink", clink, 0.5)]:
        save(name, fn(), pk)
    print("kit done")
