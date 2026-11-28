"""Synthesize the falcon Short's sound design (all procedural, no samples).
Usage: python sfx.py cues.json out.wav   — cues: {"duration": s, "cues": [[kind, t, gain], ...]}"""
import json, sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(242)


def noise(n):
    return rng.standard_normal(n)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def lp(x, hi, order=2):
    return sosfilt(butter(order, hi, "low", fs=SR, output="sos"), x)


def sweep_noise(dur, f0, f1, q=0.5, shape=None):
    """Noise through a band-pass whose centre glides f0→f1 (block-wise)."""
    n = int(dur * SR); out = np.zeros(n); x = noise(n); blk = 512
    for i in range(0, n, blk):
        p = i / n; fc = f0 * (f1 / f0) ** p
        lo, hi = max(30, fc * (1 - q)), min(SR / 2 - 100, fc * (1 + q))
        out[i:i + blk] = bp(x[max(0, i - 2048):i + blk], lo, hi)[-len(x[i:i + blk]):]
    env = shape if shape is not None else np.sin(np.linspace(0, np.pi, n)) ** 2
    return out * env


def whoosh(dur=0.9, down=True):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    env = (t ** 1.5) * np.exp(-((t - 0.7) ** 2) / 0.05)
    env /= env.max()
    return sweep_noise(dur, 2500 if down else 400, 400 if down else 2500, 0.6, env)


def wind(dur=3.0):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    env = np.clip(t * 1.2, 0, 1) ** 2 * (1 - np.clip((t - 0.85) / 0.15, 0, 1))
    lfo = 1 + 0.35 * np.sin(2 * np.pi * 3.1 * t * dur) * t
    return sweep_noise(dur, 300, 1800, 0.7, env * lfo)


def impact(dur=1.4):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 55 + 70 * np.exp(-t * 18)                                   # pitch-drop boom
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    crack = bp(noise(n), 1500, 7000) * np.exp(-t * 40)
    sub = lp(noise(n), 120) * np.exp(-t * 5) * 2
    return boom * 1.0 + crack * 0.35 + sub * 0.4


def tick(f=2200, dur=0.06):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 90) + bp(noise(n), 3000, 9000) * np.exp(-t * 200) * 0.3


def lock():                                                          # reticle 2-step snap + confirm
    out = np.zeros(int(0.6 * SR))
    for at, f in ((0.0, 1800), (0.12, 2400)):
        s = tick(f); i = int(at * SR); out[i:i + len(s)] += s
    t = np.arange(int(0.35 * SR)) / SR
    beep = np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 9) * 0.5
    i = int(0.25 * SR); out[i:i + len(beep)] += beep
    return out


def thud(dur=0.5):                                                   # rubber stamp
    n = int(dur * SR); t = np.arange(n) / SR
    return lp(noise(n), 400, 4) * np.exp(-t * 22) * 3 + np.sin(2 * np.pi * 90 * t) * np.exp(-t * 25)


def crack(dur=0.7):                                                  # eggshell: sparse clicks
    n = int(dur * SR); out = np.zeros(n)
    for k in range(9):
        at = int((0.02 + 0.6 * (k / 9) ** 1.6) * SR); s = bp(noise(int(0.012 * SR)), 2000, 8000) * (1 - k / 12)
        out[at:at + len(s)] += s * np.hanning(len(s))
    return out


def riser(dur=1.2):
    return sweep_noise(dur, 300, 4000, 0.5, np.linspace(0, 1, int(dur * SR)) ** 3)


KINDS = dict(whoosh=lambda: whoosh(0.9, True), whoosh_up=lambda: whoosh(0.7, False), wind=lambda: wind(3.0),
             wind_long=lambda: wind(5.0), impact=impact, lock=lock, thud=thud, crack=crack, riser=riser,
             tick=lambda: tick(2000))


if __name__ == "__main__":
    spec = json.load(open(sys.argv[1])); N = int(spec["duration"] * SR); out = np.zeros(N)
    for kind, at, gain in spec["cues"]:
        s = KINDS[kind](); s = s / (np.abs(s).max() + 1e-9) * gain
        i = int(at * SR); j = min(N, i + len(s)); out[i:j] += s[: j - i]
    out = np.stack([out, out], 1)
    sf.write(sys.argv[2], out, SR, subtype="PCM_16"); print("sfx cues:", len(spec["cues"]))
