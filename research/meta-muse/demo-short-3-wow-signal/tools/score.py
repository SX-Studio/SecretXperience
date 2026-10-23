"""Original score + sound design for the Wow! signal Short (numpy only, deterministic).

Usage: python score.py cues.json out_music.wav out_sfx.wav
cues.json: {"frames": {"01": start_s, ...}, "duration": 72.0}
"""
import json, sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(1977)
cues = json.load(open(sys.argv[1]))
F = {k: float(v) for k, v in cues["frames"].items()}
DUR = float(cues["duration"])
N = int(DUR * SR)
t = np.arange(N) / SR


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, hi, order=2):
    return sosfilt(butter(order, hi, btype="low", fs=SR, output="sos"), x)


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na) ** 2 if na else 1
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def place(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def note(f, dur, amp=1.0, a=0.01, r=None, harm=(1, 0.5, 0.25), detune=0.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    s = sum(h * np.sin(2 * np.pi * f * (k + 1) * (1 + detune * (k % 2)) * tt) for k, h in enumerate(harm))
    return amp * s * env_adsr(n, a, r if r is not None else dur * 0.8)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


music = np.zeros(N)
sfx = np.zeros(N)

# ---- Pad: slow chord bed, one chord per act --------------------------------------------------
# A minor add9 -> F maj7 -> C add9 -> G sus -> (drop) -> A minor -> F -> C (resolve)
acts = [
    (0.0, F["03"], [45, 57, 60, 64, 71]),            # Am(add9): A2 A3 C4 E4 B4
    (F["03"], F["06"], [41, 53, 57, 60, 64]),        # Fmaj7
    (F["06"], F["08"], [48, 55, 60, 62, 67]),        # C(add9)
    (F["08"], F["09"] + 5.6, [43, 55, 62, 60, 67]),  # Gsus
    (F["10"], F["11"], [45, 57, 60, 64, 69]),        # Am
    (F["11"], DUR, [48, 55, 60, 64, 67, 72]),        # C major, resolve
]
for (s, e, notes) in acts:
    d = e - s + 2.5  # overlap tails for legato chord changes
    for m in notes:
        f = midi(m)
        v = note(f, d, amp=0.035 if m > 50 else 0.05, a=2.2, r=2.4, harm=(1, 0.35, 0.12, 0.05), detune=0.0015)
        # slow tremolo, different phase per voice (deterministic)
        ph = (m * 0.37) % (2 * np.pi)
        v *= 0.8 + 0.2 * np.sin(2 * np.pi * 0.11 * np.arange(len(v)) / SR + ph)
        place(music, v, s)

# ---- Hydrogen shimmer: a high, quiet sine cluster that breathes across the film --------------
shim = 0.012 * (np.sin(2 * np.pi * 1420.4 / 2 * t) + 0.6 * np.sin(2 * np.pi * 710.2 * 1.5 * t))
shim *= 0.5 + 0.5 * np.sin(2 * np.pi * t / 18.0) ** 2
music += lp(shim, 3000)

# ---- Radio static: loud at the open, thins as "72" forms; low bed after -----------------------
noise = rng.standard_normal(N)
static = bp(noise, 900, 6500) * 0.06
crackle = (rng.random(N) < 0.0009) * rng.standard_normal(N) * 0.5
static += lp(crackle, 5000)
lvl = np.interp(t, [0, 0.3, 1.8, 3.8, 8.0, DUR], [0.0, 1.0, 1.0, 0.18, 0.08, 0.06])
sfx += static * lvl

# ---- Frame 3: line-printer ticks (rows of noise, then the six characters) --------------------
def tick(amp=0.25):
    n = int(0.018 * SR)
    return amp * bp(rng.standard_normal(n), 1800, 7000) * np.exp(-np.arange(n) / (0.003 * SR))

f3 = F["03"]
for row in range(14):  # noise rows during "Most of the page is noise"
    for c in range(6):
        place(sfx, tick(0.12), f3 + 0.05 + row * 0.12 + c * 0.017)
for k, at in enumerate([2.75, 3.25, 3.7, 4.15, 4.6, 5.05]):  # six characters on their cues
    place(sfx, tick(0.4), f3 + at)
    place(sfx, note(midi(76 + k), 0.6, amp=0.03, a=0.005, r=0.55, harm=(1, 0.2)), f3 + at)

# ---- Frame 4: bars rise, pitch follows the value ---------------------------------------------
f4 = F["04"]
for k, val in enumerate([6, 14, 26, 30, 19, 5]):
    m = 57 + int(round(val / 30 * 14))
    place(music, note(midi(m), 1.4, amp=0.045, a=0.03, r=1.2, harm=(1, 0.4, 0.15)), f4 + 0.15 + k * 0.22)
place(music, note(midi(81), 2.2, amp=0.05, a=0.02, r=2.0, harm=(1, 0.5, 0.2, 0.1)), f4 + 2.6)  # the "30x" ping

# ---- Frame 5: pen scratch for the circle ------------------------------------------------------
f5 = F["05"]
n = int(1.1 * SR)
scr = bp(rng.standard_normal(n), 2500, 9000) * 0.09
scr *= (0.6 + 0.4 * np.sin(2 * np.pi * 7.5 * np.arange(n) / SR)) * env_adsr(n, 0.05, 0.3)
place(sfx, scr, f5 + 2.85)

# ---- Frame 6: WOW hit (sub boom + bright bell chord), then air --------------------------------
f6 = F["06"]
n = int(2.8 * SR)
tt = np.arange(n) / SR
boom = 0.5 * np.sin(2 * np.pi * (48 * np.exp(-tt * 3) + 30) * tt) * np.exp(-tt * 2.2)
place(sfx, boom, f6)
for m in (72, 76, 79, 84):
    place(music, note(midi(m), 3.2, amp=0.05, a=0.004, r=3.0, harm=(1, 0.0, 0.3, 0.0, 0.12)), f6)

# ---- Frame 7: the signal itself, sonified: a tone that rises and falls on a bell curve --------
f7 = F["07"]
c0, c1 = f7 + 4.0, f7 + 7.4  # curve self-draws in this window
mid, sig_w = (c0 + c1) / 2, (c1 - c0) / 4.5
bell = np.exp(-0.5 * ((t - mid) / sig_w) ** 2)
beep = 0.07 * bell * (np.sin(2 * np.pi * 710.2 * t) + 0.3 * np.sin(2 * np.pi * 1420.4 * t))
sfx += lp(beep, 4000)
for k in range(6):  # six data points pop on "This did."
    place(sfx, note(midi(84), 0.25, amp=0.05, a=0.002, r=0.24, harm=(1, 0.3)), f7 + 7.5 + k * 0.12)

# ---- Frame 8: counter whirr + spike tone ------------------------------------------------------
f8 = F["08"]
n = int(1.8 * SR)
tt = np.arange(n) / SR
whirr = 0.02 * np.sin(2 * np.pi * (300 + 500 * tt / 1.8) * tt) * env_adsr(n, 0.2, 0.4)
place(sfx, whirr, f8 + 0.4)
place(music, note(midi(88), 2.6, amp=0.035, a=0.01, r=2.4, harm=(1, 0.2)), f8 + 2.2)

# ---- Frame 9: everything thins; "Nothing." lands on near-silence -----------------------------
f9 = F["09"]
nothing = f9 + 6.1
duck = np.interp(t, [nothing - 2.0, nothing, F["10"] + 0.5, F["10"] + 2.5], [1.0, 0.12, 0.12, 1.0])
music *= np.where((t > nothing - 2.0) & (t < F["10"] + 2.5), duck, 1.0)
place(music, note(midi(45), 3.0, amp=0.06, a=0.4, r=2.4, harm=(1, 0.3)), nothing)  # one low held A

# ---- Frame 10: magnetar burst — a soft whoosh + ring ping -------------------------------------
f10 = F["10"]
n = int(2.2 * SR)
tt = np.arange(n) / SR
wh = bp(rng.standard_normal(n), 300, 2400) * 0.08 * np.sin(np.pi * tt / 2.2) ** 3
place(sfx, wh, f10 + 4.3)
place(music, note(midi(91), 2.5, amp=0.04, a=0.003, r=2.4, harm=(1, 0.0, 0.25)), f10 + 4.5)

# ---- Frame 11/12: resolve — gentle arpeggio, long tail, fade to silence by DUR ---------------
f11 = F["11"]
for k, m in enumerate([60, 64, 67, 72, 76]):
    place(music, note(midi(m), 4.5, amp=0.035, a=0.02, r=4.2, harm=(1, 0.3, 0.1)), f11 + 2.6 + k * 0.38)
fade = np.interp(t, [DUR - 4.2, DUR - 0.15], [1.0, 0.0])
music *= np.where(t > DUR - 4.2, fade, 1.0)
sfx *= np.where(t > DUR - 4.2, fade, 1.0)

# gentle room: short multi-tap delay on music only
room = np.zeros_like(music)
for d, g in ((0.031, 0.25), (0.067, 0.18), (0.113, 0.12), (0.19, 0.08)):
    k = int(d * SR)
    room[k:] += g * music[:-k]
music = lp(music + room, 9000)

for name, buf in ((sys.argv[2], music), (sys.argv[3], sfx)):
    peak = np.max(np.abs(buf)) or 1
    wavfile.write(name, SR, (buf / peak * 0.85 * 32767).astype(np.int16))
print("wrote", sys.argv[2], sys.argv[3], f"{DUR:.2f}s")
