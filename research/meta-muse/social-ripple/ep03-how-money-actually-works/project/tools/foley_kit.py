"""Social Ripple viral foley kit: crunchy, satisfying, game-style environment sounds, all synthesised from scratch
(nothing sampled, so nothing can be Content-ID claimed). In the spirit of block-game / battle-royale foley, not copies.
Usage: python -I foley_kit.py <out_dir>
  step_{grass,stone,wood,sand,tile,water}_{0..5}, crunch_{0..3}, chew_{0..2}, gulp_{0..2}, slurp_{0,1}, sip_ahh_{0}, pickup, coin, level_up,
  chest_open, door_creak, leaves, splash_small, bite_soft_{0..2}, fizz, glass_set"""
import os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000; rng = np.random.default_rng(2611)
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
t_ = lambda d: np.arange(int(d * SR)) / SR
noise = lambda n: rng.standard_normal(n)
def filt(x, kind, f, o=2): return sosfilt(butter(o, f, kind, fs=SR, output="sos"), x)
lp = lambda x, f: filt(x, "low", f); hp = lambda x, f: filt(x, "high", f); bp = lambda x, a, b: filt(x, "band", [a, b])
def env(n, a, d, curve=1.0):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na); e[na:] = np.exp(-np.arange(n - na) / (d * SR)) ** curve; return e
def place(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i]
def save(name, x, peak=0.9):
    x = x - np.mean(x); x = x / (np.abs(x).max() + 1e-9) * peak; sf.write(os.path.join(OUT, name + ".wav"), np.stack([x, x], 1).astype(np.float32), SR, subtype="PCM_16")
def crackle(d, rate, lo, hi, decay=0.004):  # dense micro-clicks: the "crunch"
    out = np.zeros(int(d * SR))
    for at in np.sort(rng.uniform(0, d * 0.85, int(rate * d))):
        n = int(rng.uniform(0.002, 0.007) * SR); place(out, bp(noise(n), lo, hi) * np.exp(-np.arange(n) / (decay * SR)) * rng.uniform(0.3, 1.0), at)
    return out
def thump(d, f0, f1, dec):
    t = t_(d); f = f0 * (f1 / f0) ** (t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / dec)
# ---------------- footsteps ----------------
def step_grass(k):
    d = 0.22; x = crackle(d, 900, 1800, 9000, 0.003) * env(int(d * SR), 0.004, 0.06) * 0.9 + bp(noise(int(d * SR)), 300, 1600) * env(int(d * SR), 0.003, 0.03) * 0.5
    return x + thump(d, 140 + 15 * k, 90, 0.02) * 0.35
def step_stone(k):
    d = 0.2; n = int(d * SR); click = bp(noise(n), 1500, 7000) * env(n, 0.0005, 0.006) * 1.2
    knock = sum(np.sin(2 * np.pi * f * t_(d)) * np.exp(-t_(d) / dc) for f, dc in ((rng.uniform(700, 950), 0.018), (rng.uniform(1300, 1700), 0.012), (rng.uniform(2300, 2800), 0.008))) * 0.45
    grit = crackle(d, 300, 2500, 9000, 0.002) * env(n, 0.001, 0.03) * 0.4
    return click + knock + grit + thump(d, 160, 100, 0.015) * 0.4
def step_wood(k):
    d = 0.26; n = int(d * SR); body = sum(np.sin(2 * np.pi * f * t_(d)) * np.exp(-t_(d) / dc) for f, dc in ((rng.uniform(190, 240), 0.05), (rng.uniform(380, 460), 0.03), (rng.uniform(820, 980), 0.015)))
    return body * 0.7 + bp(noise(n), 800, 5000) * env(n, 0.0008, 0.008) * 0.8 + crackle(d, 60, 1500, 4000, 0.003) * env(n, 0.01, 0.05) * 0.3
def step_sand(k):
    d = 0.24; n = int(d * SR); return lp(crackle(d, 1600, 900, 6000, 0.002), 5000) * env(n, 0.015, 0.06) * 0.9 + lp(noise(n), 900) * env(n, 0.01, 0.05) * 0.4
def step_tile(k):
    d = 0.16; n = int(d * SR); return bp(noise(n), 2000, 9000) * env(n, 0.0004, 0.005) * 1.1 + np.sin(2 * np.pi * rng.uniform(1900, 2300) * t_(d)) * np.exp(-t_(d) / 0.01) * 0.4 + thump(d, 180, 110, 0.012) * 0.4
def step_water(k):
    d = 0.32; n = int(d * SR); x = np.zeros(n)
    for at in np.sort(rng.uniform(0, 0.12, 6)): bd = rng.uniform(0.03, 0.07); tt = t_(bd); f = rng.uniform(600, 1300) * (1 + 1.5 * tt / bd); place(x, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / bd) * 0.5, at)
    return x + hp(noise(n), 1500) * env(n, 0.005, 0.07) * 0.6
# ---------------- eating & drinking ----------------
def crunch(k):  # crispy bite: chomp thump + dense crackle bursts
    d = 0.55; out = np.zeros(int(d * SR)); place(out, thump(0.12, 120, 70, 0.025) * 0.8, 0.0)
    for j in range(3): b = crackle(0.11, 2600, 2000, 12000, 0.0025) * env(int(0.11 * SR), 0.002, 0.04); place(out, b * (1.0 - 0.25 * j), 0.01 + j * rng.uniform(0.07, 0.11))
    return out
def bite_soft(k):
    d = 0.3; n = int(d * SR); return thump(d, 110, 70, 0.03) * 0.6 + lp(crackle(d, 700, 600, 3500, 0.004), 3500) * env(n, 0.005, 0.05) * 0.8
def chew(k):
    d = 1.1; out = np.zeros(int(d * SR))
    for j in range(4): n = int(0.16 * SR); place(out, (lp(noise(n), 1400) * np.sin(np.pi * np.arange(n) / n) ** 2 * 0.6 + crackle(0.16, 400, 900, 4000, 0.003) * 0.4) * rng.uniform(0.6, 1), j * 0.26 + rng.uniform(0, 0.03))
    return out
def gulp(k):  # throat "glug": formant bloop + thump
    d = 0.32; t = t_(d); f = 420 * (0.55 + 0.45 * np.exp(-t / 0.05)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.06) * 0.8
    return bp(x, 150, 2500) + thump(d, 95, 60, 0.04) * 0.6 + bp(noise(len(t)), 300, 900) * env(len(t), 0.002, 0.02) * 0.3
def glugs(n=3):
    out = np.zeros(int((0.4 * n + 0.3) * SR)); [place(out, gulp(i) * (1 - 0.12 * i), i * rng.uniform(0.34, 0.42)) for i in range(n)]; return out
def slurp(k):  # straw slurp: modulated airy noise sweeping up
    d = 0.9; t = t_(d); n = len(t); f = 900 + 2500 * (t / d) ** 1.5; x = noise(n); y = np.zeros(n)
    for i in range(0, n, 480): y[i:i + 480] = bp(x[i:i + 480], max(300, f[i] * 0.7), min(15000, f[i] * 1.5))
    am = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * (14 + 10 * t / d) * t)); return y * am * env(n, 0.05, 0.5)
def sip_ahh(k):  # glass "tink" + satisfied exhale (breathy, no voice)
    d = 1.2; t = t_(d); n = len(t); tink = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / 0.08) for f in (3200, 5100)) * 0.25
    exhale = bp(noise(n), 500, 3500) * np.clip((t - 0.35) / 0.08, 0, 1) * np.exp(-np.clip(t - 0.43, 0, None) / 0.3) * 0.6
    return tink + exhale
def fizz():
    d = 1.5; n = int(d * SR); return hp(crackle(d, 3000, 4000, 14000, 0.0015), 3500) * env(n, 0.02, 0.8) * 0.8
# ---------------- game-style UI / world ----------------
def pickup():
    t = t_(0.18); f = 700 * (2.2 ** (t / 0.18)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.08) * 0.8 + hp(noise(len(t)), 6000) * np.exp(-t / 0.01) * 0.2
def coin():
    out = np.zeros(int(0.5 * SR))
    for at, f in ((0, 1568), (0.07, 2093)): t = t_(0.4); place(out, (np.sign(np.sin(2 * np.pi * f * t)) * 0.3 + np.sin(2 * np.pi * f * t)) * np.exp(-t / 0.12) * 0.6, at)
    return lp(out, 9000)
def level_up():
    out = np.zeros(int(1.4 * SR))
    for i, m in enumerate([60, 64, 67, 72, 76, 79]): f = 440 * 2 ** ((m - 69) / 12); t = t_(0.7); place(out, (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.25) * 0.5, i * 0.07)
    return out
def chest_open():
    d = 0.9; t = t_(d); n = len(t); creak = np.zeros(n); f = 180 + 120 * np.sin(np.pi * t / d)
    for i, at in enumerate(np.arange(0, 0.55, 0.012)): place(creak, bp(noise(int(0.008 * SR)), 600, 3000) * (0.4 + 0.6 * np.sin(np.pi * at / 0.55)), at)
    latch = np.zeros(n); place(latch, sum(np.sin(2 * np.pi * fr * t_(0.2)) * np.exp(-t_(0.2) / 0.02) for fr in (900, 2100)) * 0.6, 0.0)
    return creak * 0.7 + latch + thump(d, 140, 80, 0.06) * 0.3
def door_creak():
    d = 1.3; t = t_(d); n = len(t); f = 220 + 160 * np.sin(np.pi * t / d) ** 2; saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return bp(saw * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 30 * t))), 400, 3500) * np.sin(np.pi * t / d) * 0.7
def leaves():
    d = 1.6; n = int(d * SR); return hp(crackle(d, 1200, 1500, 9000, 0.004), 1200) * np.sin(np.pi * np.arange(n) / n) * 0.8
def splash_small():
    d = 0.7; n = int(d * SR); x = lp(noise(n), 4000) * env(n, 0.004, 0.12); place(x, step_water(0) * 0.6, 0.02); return x
def glass_set():
    t = t_(0.5); return sum(np.sin(2 * np.pi * f * t) * np.exp(-t / dc) for f, dc in ((2650, 0.12), (4100, 0.08), (6900, 0.04))) * 0.4 + thump(0.5, 200, 120, 0.02) * 0.4

if __name__ == "__main__":
    for kind, fn in (("grass", step_grass), ("stone", step_stone), ("wood", step_wood), ("sand", step_sand), ("tile", step_tile), ("water", step_water)):
        for k in range(6): save(f"step_{kind}_{k}", fn(k), 0.85)
    for k in range(4): save(f"crunch_{k}", crunch(k), 0.9)
    for k in range(3): save(f"bite_soft_{k}", bite_soft(k), 0.8); save(f"chew_{k}", chew(k), 0.7); save(f"gulp_{k}", glugs(2 + k % 2), 0.85)
    for k in range(2): save(f"slurp_{k}", slurp(k), 0.8)
    save("sip_ahh_0", sip_ahh(0), 0.7); save("fizz", fizz(), 0.6); save("pickup", pickup(), 0.7); save("coin", coin(), 0.7); save("level_up", level_up(), 0.7)
    save("chest_open", chest_open(), 0.8); save("door_creak", door_creak(), 0.7); save("leaves", leaves(), 0.7); save("splash_small", splash_small(), 0.8); save("glass_set", glass_set(), 0.7)
    print("foley kit done")
