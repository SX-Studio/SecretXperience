"""Social Ripple ep2 sound kit: school foley, phone UI sounds, comedy accents and location beds.
Everything is synthesised (or built from our own Kokoro teen walla), so nothing can be Content-ID claimed.
Usage: python -I sound_kit3.py <out_dir> <walla_dir> <react_dir>"""
import os, sys, glob
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly, fftconvolve

SR = 48000; rng = np.random.default_rng(902)
OUT, WALLA, REACT = sys.argv[1], sys.argv[2], sys.argv[3]
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
    t = t_(d); return sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t * decay * (1 + k * 0.3)) / (1 + k * 0.4) for k, f in enumerate(freqs)) * amp
def locker_slam():
    t = t_(0.9); hit = lp(noise(len(t)), 3000) * np.exp(-t * 40) * 1.2
    ring = metal(0.9, [212, 341, 517, 803, 1190, 1630], 7) * 0.7
    latch = np.zeros(len(t)); place(latch, bp(noise(int(0.03 * SR)), 2000, 7000) * 0.8, 0.05)
    return reverb(hit + ring + latch, 1.4, 0.3, 3500)
def school_bell(d=2.6):
    t = t_(d); clap = (np.sin(2 * np.pi * 22 * t) > 0).astype(float)
    tone = metal(d, [1046, 1312, 2093, 2780, 3510], 0.7) * (0.55 + 0.45 * lp(clap, 60))
    env = np.minimum(1, t / 0.02) * np.where(t < d - 0.4, 1, np.exp(-(t - (d - 0.4)) * 9))
    return reverb(tone * env, 1.6, 0.35, 4000)
def door_slam():
    t = t_(0.7); return reverb(lp(noise(len(t)), 500) * np.exp(-t * 18) * 1.5 + np.sin(2 * np.pi * 70 * t) * np.exp(-t * 14) + bp(noise(len(t)), 1500, 5000) * np.exp(-t * 90) * 0.4, 0.9, 0.25)
def phone_buzz(n=2):
    out = np.zeros(int((0.42 * n + 0.1) * SR))
    for k in range(n):
        t = t_(0.3); b = np.sign(np.sin(2 * np.pi * 172 * t)) * 0.5 + np.sin(2 * np.pi * 172 * t) * 0.5
        place(out, lp(b, 1200) * np.minimum(1, t / 0.01) * np.minimum(1, (0.3 - t) / 0.02) * (1 + 0.3 * np.sin(2 * np.pi * 31 * t)), k * 0.42)
    return out
def msg_pop(f1=880, f2=1320):
    out = np.zeros(int(0.32 * SR))
    for k, f in enumerate([f1, f2]): t = t_(0.16); place(out, np.sin(2 * np.pi * f * t) * np.exp(-t * 26) * np.minimum(1, t / 0.006), k * 0.08)
    return lp(out, 2500)
def swoosh_send():
    t = t_(0.35); f = 600 + 1800 * (t / 0.35) ** 2; return bp(noise(len(t)), 1500, 6000) * np.sin(np.pi * t / 0.35) * 0.5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.35) * 0.3
def tap():
    t = t_(0.05); return bp(noise(len(t)), 2000, 8000) * np.exp(-t * 200) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 150) * 0.3
def chair_scrape(d=0.6):
    t = t_(d); f = 380 + 160 * np.sin(np.pi * t / d); tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 37 * t))
    return reverb((bp(noise(len(t)), 300, 2400) * 0.8 + tone * 0.5) * np.sin(np.pi * t / d) ** 0.5, 0.9, 0.25)
def rimshot():
    out = np.zeros(int(1.6 * SR))
    def tom(f): t = t_(0.5); return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.5 * np.exp(-t * 20))) / SR) * np.exp(-t * 9) + lp(noise(len(t)), 3000) * np.exp(-t * 60) * 0.4
    place(out, tom(190), 0.0); place(out, tom(140), 0.22)
    t = t_(1.2); place(out, hp(noise(len(t)), 5000) * np.exp(-t * 4.5) * 0.7 + lp(noise(len(t)), 1800) * np.exp(-t * 40) * 0.6, 0.48)
    return reverb(out, 0.8, 0.2)
def shutter():
    out = np.zeros(int(0.3 * SR)); place(out, bp(noise(int(0.03 * SR)), 1500, 7000), 0); place(out, bp(noise(int(0.04 * SR)), 1000, 5000) * 0.8, 0.12); return out
def rec_beep(): t = t_(0.18); return np.sin(2 * np.pi * 1600 * t) * np.minimum(1, (0.18 - t) / 0.02)
def stamp():
    t = t_(0.5); return reverb(lp(noise(len(t)), 600) * np.exp(-t * 30) * 1.4 + np.sin(2 * np.pi * 85 * t) * np.exp(-t * 20) + bp(noise(len(t)), 2000, 6000) * np.exp(-t * 80) * 0.3, 0.6, 0.2)
def lock_rattle():
    out = np.zeros(int(0.8 * SR))
    for k in range(7): place(out, metal(0.12, [2300 + rng.uniform(-300, 300), 3700, 5200], 40) * rng.uniform(0.5, 1), k * 0.1 + rng.uniform(0, 0.02))
    return out
def unlock():
    out = np.zeros(int(1.6 * SR)); place(out, metal(0.15, [2600, 4100], 50), 0); place(out, metal(0.25, [1800, 2900, 4400], 25) * 1.2, 0.12)
    t = t_(1.3); place(out, sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 3) for f in (1046, 1318, 1568, 2093)) * 0.25 * np.minimum(1, t / 0.02), 0.25)
    return reverb(out, 1.2, 0.3)
def fan_hum(d=12):
    t = t_(d); return lp(noise(len(t)), 700) * 0.5 + np.sin(2 * np.pi * 120 * t) * 0.15 + bp(noise(len(t)), 900, 2500) * 0.12 * (1 + 0.4 * np.sin(2 * np.pi * 18 * t))
def slowmo():
    t = t_(2.2); f = 60 * np.exp(-t * 0.6); return reverb(lp(noise(len(t)), 900) * np.sin(np.pi * t / 2.2) ** 2 + np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 2.2) * 0.7, 2.0, 0.4)
def marker(d=0.7):
    t = t_(d); f = 1100 + 300 * np.sin(2 * np.pi * 3 * t); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + bp(noise(len(t)), 2500, 7000) * 0.6
    return lp(x * (0.5 + 0.5 * (np.sin(2 * np.pi * 6 * t) > -0.3)) * np.sin(np.pi * t / d) ** 0.3, 2800)
def tick(): t = t_(0.03); return np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 200)
def riser(d=3.0):
    t = t_(d); f = 200 * 2 ** (3 * t / d); return reverb((np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4 + hp(noise(len(t)), 2000) * 0.5) * (t / d) ** 2, 1.2, 0.3)
def gold_chime():
    out = np.zeros(int(3.2 * SR))
    for k, f in enumerate([784, 988, 1175, 1568, 1976]):
        t = t_(2.6); place(out, (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t * 2.2) * np.minimum(1, t / 0.01), k * 0.09)
    return reverb(out, 2.0, 0.4, 5000)
def heartbeat():
    out = np.zeros(int(1.0 * SR))
    for a, g in ((0, 1), (0.22, 0.7)): t = t_(0.25); place(out, np.sin(2 * np.pi * 55 * t) * np.exp(-t * 22) * g, a)
    return out
def ballot(): t = t_(0.25); return bp(noise(len(t)), 800, 4000) * np.exp(-t * 25) + np.sin(2 * np.pi * 140 * t) * np.exp(-t * 30) * 0.6
def crack():
    out = np.zeros(int(0.9 * SR))
    for k in range(9): place(out, bp(noise(int(0.04 * SR)), 1000, 6000) * rng.uniform(0.4, 1), k * 0.05 + rng.uniform(0, 0.03))
    t = t_(0.8); place(out, lp(noise(len(t)), 300) * np.exp(-t * 8) * 0.8, 0.0); return reverb(out, 0.8, 0.2)
def sneaker_squeak():
    t = t_(0.18); f = 2400 + 900 * np.sin(np.pi * t / 0.18); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.18) * (0.6 + 0.4 * np.sin(2 * np.pi * 90 * t))
def crickets(d=40):
    out = np.zeros((int(d * SR), 2))
    for c in range(9):
        f = rng.uniform(3800, 5200); pan = rng.uniform(-1, 1); g = rng.uniform(0.15, 0.5); per = rng.uniform(0.7, 1.4); t = rng.uniform(0, 1)
        while t < d - 0.4:
            chirp = np.zeros(int(0.12 * SR))
            for k in range(3): tt = t_(0.025); place(chirp, np.sin(2 * np.pi * f * tt) * np.sin(np.pi * tt / 0.025), k * 0.035)
            place(out, stereo(chirp * g, pan), t); t += per * rng.uniform(0.9, 1.1)
    return out
def fire(d=40):
    out = stereo(lp(pink(int(d * SR)), 500) * 0.4, 0)
    for at in rng.uniform(0, d - 0.1, int(d * 6)): place(out, stereo(bp(noise(int(0.012 * SR)), 1500, 7000) * rng.uniform(0.1, 0.8), rng.uniform(-0.3, 0.3)), at)
    return out

# ---------------- crowds from our own teen voices ----------------
def crowd(clips, n, cut, d, wet=0.3, room=1.2, spread=0.25, gain=(0.6, 1.0)):
    out = np.zeros((int(d * SR), 2))
    for k in range(n):
        c = clips[k % len(clips)] * rng.uniform(*gain); r = rng.uniform(0.94, 1.06); c = resample_poly(c, 100, int(100 * r))
        place(out, stereo(lp(c, cut), rng.uniform(-0.8, 0.8)), rng.uniform(0, spread))
    out[:, 0] = reverb(out[:, 0], room, wet); out[:, 1] = reverb(out[:, 1], room, wet); return out
def walla_bed(W, d, layers, cut, room, wet):
    clips = list(W.values()); out = np.zeros((int(d * SR), 2))
    for k in range(int(layers * d / 10)):
        c = clips[rng.integers(len(clips))] * rng.uniform(0.25, 0.7); r = rng.uniform(0.93, 1.07); c = resample_poly(c, 100, int(100 * r))
        place(out, stereo(lp(c, cut), rng.uniform(-0.85, 0.85)), rng.uniform(0, d - 3))
    out[:, 0] = reverb(out[:, 0], room, wet, 2200); out[:, 1] = reverb(out[:, 1], room, wet, 2200); return out
def step(k, surface="lino"):
    d = 0.2; n = int(d * SR); t = t_(d)
    heel = lp(noise(n), 1100) * np.exp(-t * 70) * 1.3 + np.sin(2 * np.pi * (110 + 15 * k) * t) * np.exp(-t * 50) * 0.6
    toe = np.zeros(n); i = int(rng.uniform(0.04, 0.07) * SR); m = int(0.05 * SR); toe[i:i + m] = bp(noise(m), 1800, 6500) * np.exp(-np.arange(m) / (0.01 * SR)) * 0.5
    return heel + toe
def steps_bed(d, walkers, gain=1.0):
    out = np.zeros((int(d * SR), 2))
    for w in range(walkers):
        rate = rng.uniform(1.7, 2.2); pan = rng.uniform(-0.9, 0.9); g = rng.uniform(0.25, 0.7) * gain; t = rng.uniform(0, d); end = t + rng.uniform(4, 12)
        while t < min(d - 0.3, end): place(out, stereo(lp(step(rng.integers(0, 6)), 2600) * g * rng.uniform(0.7, 1), pan), t); t += 1 / rate * rng.uniform(0.95, 1.05)
    return out
def clink(): f = rng.uniform(2000, 3400); t = t_(0.3); return sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * (18 + 6 * m)) / m for m in (1, 2.71, 4.13)) * 0.6
def tray(): t = t_(0.35); return metal(0.35, [480, 760, 1130], 18) * 0.5 + lp(noise(len(t)), 2500) * np.exp(-t * 40) * 0.6

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn, pk in [("locker_slam", locker_slam, 0.8), ("school_bell", school_bell, 0.7), ("door_slam", door_slam, 0.85), ("phone_buzz", phone_buzz, 0.7), ("msg_pop", lambda: msg_pop(587, 880), 0.5),
                         ("msg_pop2", lambda: msg_pop(523, 784), 0.5), ("swoosh_send", swoosh_send, 0.6), ("tap", tap, 0.5), ("chair_scrape", chair_scrape, 0.7), ("rimshot", rimshot, 0.8), ("shutter", shutter, 0.7),
                         ("rec_beep", rec_beep, 0.5), ("stamp", stamp, 0.85), ("lock_rattle", lock_rattle, 0.6), ("unlock", unlock, 0.75), ("fan_hum", fan_hum, 0.4), ("slowmo", slowmo, 0.8), ("marker", marker, 0.5),
                         ("tick", tick, 0.4), ("riser", riser, 0.6), ("gold_chime", gold_chime, 0.7), ("heartbeat", heartbeat, 0.8), ("ballot", ballot, 0.6), ("crack", crack, 0.8), ("squeak", sneaker_squeak, 0.4)]:
        save(name, fn(), pk)
    W = load_dir(WALLA, "w*.wav"); Rc = load_dir(REACT)
    L = [Rc[k] for k in sorted(Rc) if k.startswith("l")]; G = [Rc[k] for k in sorted(Rc) if k.startswith("g")]; O = [Rc[k] for k in sorted(Rc) if k.startswith("o")]; Y = [Rc[k] for k in sorted(Rc) if k.startswith("y")]
    save("laugh_table", crowd(L, 6, 5000, 3.0, 0.2, 0.8, 0.3), 0.8)
    save("laugh_room", crowd(L * 3, 16, 3500, 3.5, 0.35, 1.4, 0.6, (0.4, 0.9)), 0.75)
    save("groan", crowd(G, 5, 4000, 2.2, 0.2, 0.8, 0.2), 0.75)
    save("ooh", crowd(O * 3, 9, 4000, 2.4, 0.3, 1.2, 0.25), 0.75)
    save("cheer", crowd(Y * 4, 12, 5000, 2.4, 0.3, 1.2, 0.35), 0.8)
    d = 50
    caf = walla_bed(W, d, 28, 2600, 1.6, 0.4) + stereo(lp(pink(int(d * SR)), 300) * 0.2, 0)
    for at in rng.uniform(1, d - 1, int(d * 0.7)): place(caf, stereo(clink() * rng.uniform(0.15, 0.4), rng.uniform(-0.8, 0.8)), at)
    for at in rng.uniform(1, d - 1, int(d * 0.25)): place(caf, stereo(reverb(tray(), 1.2, 0.35) * rng.uniform(0.15, 0.35), rng.uniform(-0.8, 0.8)), at)
    save("amb_cafeteria", fade(caf, 1.5, 1.5), 0.7)
    save("steps_cafeteria", steps_bed(d, 8), 0.5)
    hall = walla_bed(W, d, 12, 1800, 2.2, 0.5) * 0.8 + stereo(lp(pink(int(d * SR)), 250) * 0.25, 0)
    for at in rng.uniform(1, d - 1, int(d * 0.12)): place(hall, stereo(locker_slam() * rng.uniform(0.05, 0.14), rng.uniform(-0.9, 0.9)), at)
    for at in rng.uniform(1, d - 1, int(d * 0.1)): place(hall, stereo(sneaker_squeak() * rng.uniform(0.05, 0.12), rng.uniform(-0.9, 0.9)), at)
    save("amb_hallway", fade(hall, 1.5, 1.5), 0.6)
    save("steps_hallway", steps_bed(d, 16), 0.6)
    night = crickets(d) + stereo(lp(pink(int(d * SR)), 200) * 0.25, 0)
    t0 = 6; tt = t_(5); car = lp(noise(len(tt)), 600) * np.sin(np.pi * tt / 5) ** 2 * 0.35; place(night, stereo(car, 0.3), t0); place(night, stereo(car, -0.4), 27)
    save("amb_night", fade(night, 1.5, 1.5), 0.5)
    save("amb_camp", fade(crickets(d) * 0.8 + fire(d), 1.5, 1.5), 0.55)
    room = stereo(lp(pink(int(d * SR)), 220) * 0.4, 0) + walla_bed(W, d, 5, 700, 2.4, 0.6) * 0.35
    save("amb_classroom", fade(room, 1.5, 1.5), 0.35)
    print("kit3 done")
