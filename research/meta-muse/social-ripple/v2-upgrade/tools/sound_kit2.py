"""Social Ripple sound kit v2 additions: surface-specific footsteps (heel + toe, 6 variants each), cloth
rustles, bubble pops, a soft "boop" for speech bubbles, and room impulse responses per location.
Usage: python -I sound_kit2.py <out_dir>"""
import os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR = 48000; rng = np.random.default_rng(42); OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
t_ = lambda d: np.arange(int(d * SR)) / SR
noise = lambda n: rng.standard_normal(n)
bp = lambda x, lo, hi, o=2: sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
lp = lambda x, f, o=2: sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def save(name, x, peak=0.8):
    x = x / (np.abs(x).max() + 1e-9) * peak
    if x.ndim == 1: x = np.stack([x, x], 1)
    sf.write(os.path.join(OUT, name + ".wav"), x.astype(np.float32), SR, subtype="PCM_16")
def step(surface, k):
    d = 0.22; n = int(d * SR); t = t_(d)
    if surface == "concrete":   # heel thump + gritty toe scrape
        heel = lp(noise(n), 900) * np.exp(-t * 60) * 1.6 + np.sin(2 * np.pi * (90 + 20 * k) * t) * np.exp(-t * 45) * 0.8
        toe = np.zeros(n); i = int(rng.uniform(0.045, 0.07) * SR); m = int(0.06 * SR)
        toe[i:i + m] = bp(noise(m), 1500, 6000) * np.exp(-np.arange(m) / (0.012 * SR)) * 0.6
        return heel + toe
    if surface == "wood":       # hollow knock
        heel = np.sin(2 * np.pi * (160 + 25 * k) * t) * np.exp(-t * 35) + bp(noise(n), 300, 1800) * np.exp(-t * 70) * 0.9
        toe = np.zeros(n); i = int(rng.uniform(0.05, 0.08) * SR); m = int(0.05 * SR)
        toe[i:i + m] = bp(noise(m), 800, 3000) * np.exp(-np.arange(m) / (0.01 * SR)) * 0.5
        return heel + toe
def rustle(d=0.45):
    n = int(d * SR); t = t_(d); return bp(noise(n), 1200, 7000) * np.sin(np.pi * t / d) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t))
def boop(f=520):
    t = t_(0.16); return np.sin(2 * np.pi * np.cumsum(f + 380 * np.exp(-t * 30)) / SR) * np.exp(-t * 22)
def ir(secs, bright):
    n = int(secs * SR); x = noise(n) * np.exp(-np.arange(n) / (secs * SR / 6)); x = lp(x, bright); x[: int(0.004 * SR)] = 0; x[0] = 1.0
    return x
for s in ("concrete", "wood"):
    for k in range(6): save(f"step_{s}_{k}", step(s, k), 0.7)
for k in range(4): save(f"rustle_{k}", rustle(rng.uniform(0.3, 0.55)), 0.5)
save("boop_a", boop(520), 0.5); save("boop_b", boop(660), 0.5)
np.save(os.path.join(OUT, "ir_street.npy"), ir(0.35, 4000)); np.save(os.path.join(OUT, "ir_cafe.npy"), ir(0.9, 3000)); np.save(os.path.join(OUT, "ir_hall.npy"), ir(2.2, 2500))
print("kit2 done")

# ---- crowd beds: many soft footsteps + distant conversation, stereo-spread (added after user feedback) ----
import glob
from scipy.signal import resample_poly
def crowd_steps(d=40, walkers=14, surface="concrete"):
    out = np.zeros((int(d * SR), 2))
    for w in range(walkers):
        rate = rng.uniform(1.6, 2.1); pan = rng.uniform(-0.9, 0.9); g = rng.uniform(0.25, 0.7)
        t0 = rng.uniform(0, d); dur = rng.uniform(4, 12); t = t0
        while t < min(d - 0.3, t0 + dur):
            s = step(surface, rng.integers(0, 6)) * g * rng.uniform(0.7, 1.0)
            s = lp(s, 2500)
            i = int(t * SR); j = min(len(out), i + len(s))
            out[i:j, 0] += s[: j - i] * np.sqrt(0.5 * (1 - pan)); out[i:j, 1] += s[: j - i] * np.sqrt(0.5 * (1 + pan))
            t += 1 / rate * rng.uniform(0.95, 1.05)
        if rng.random() < 0.5: t0 = rng.uniform(0, d)
    return out
def far_talk(walla_dir, d=40, layers=16, cut=1500):
    clips = []
    for f in sorted(glob.glob(os.path.join(walla_dir, "w*.wav"))):
        a, sr = sf.read(f); a = a.mean(1) if a.ndim > 1 else a; clips.append(resample_poly(a, SR, sr))
    out = np.zeros((int(d * SR), 2))
    for k in range(layers * int(d / 10)):
        c = lp(clips[rng.integers(len(clips))], cut) * rng.uniform(0.15, 0.45); pan = rng.uniform(-1, 1)
        i = int(rng.uniform(0, d - 3) * SR); j = min(len(out), i + len(c))
        out[i:j, 0] += c[: j - i] * np.sqrt(0.5 * (1 - pan)); out[i:j, 1] += c[: j - i] * np.sqrt(0.5 * (1 + pan))
    return out
if len(sys.argv) > 2:
    save("crowd_steps_street", crowd_steps(40, 16, "concrete"), 0.6)
    save("crowd_steps_cafe", crowd_steps(40, 6, "wood"), 0.5)
    save("far_talk_street", far_talk(sys.argv[2], 40, 14, 1300), 0.5)
    print("crowd beds done")
