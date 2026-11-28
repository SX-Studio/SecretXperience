"""Episode 1 mix: voice-first, music ducked under the voice, ambience beds per scene, timed SFX.
Usage: python -I mix_ep1.py <project_dir> <musicA.wav> <musicB.wav|-> <out.wav>"""
import sys, os, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly

SR = 48000
P, MA, MB, OUT = sys.argv[1:5]
TOTAL = 173.2
N = int(TOTAL * SR)
def load(path):
    a, sr = sf.read(path, always_2d=True)
    a = a.astype(np.float64)
    if a.shape[1] == 1: a = np.repeat(a, 2, 1)
    if sr != SR: a = np.stack([resample_poly(a[:, c], SR, sr) for c in range(2)], 1)
    return a
def db(x): return 10 ** (x / 20)
def add(buf, a, at, gain=1.0, offset=0.0, dur=None, fin=0.0, fout=0.0):
    a = a[int(offset * SR):]
    if dur is not None: a = a[: int(dur * SR)]
    a = a * gain
    if fin: n = min(len(a), int(fin * SR)); a[:n] *= np.linspace(0, 1, n)[:, None]
    if fout: n = min(len(a), int(fout * SR)); a[-n:] *= np.linspace(1, 0, n)[:, None]
    i = int(at * SR); j = min(len(buf), i + len(a))
    if j > i: buf[i:j] += a[: j - i]
VO = os.path.join(P, "assets/vo"); SFX = os.path.join(P, "assets/sfx")
sfx = {f[:-4]: load(os.path.join(SFX, f)) for f in os.listdir(SFX) if f.endswith(".wav")}

# ---- scene starts (must match tools/build_index.py) ----
S = dict(s1=0.0, s2=13.8, s3=18.4, s4=31.9, s5=63.1, s6=82.5, s7=99.5, s8=119.5, s9=140.7, s10=156.2)
# ---- voice: (line, scene, local start) ----
lines = [("L01", "s1", 1.2), ("L02", "s1", 7.2), ("L03", "s2", 0.8), ("L04", "s3", 0.4), ("L05", "s3", 8.0),
         ("L06", "s4", 0.5), ("L07", "s4", 10.4), ("L08", "s4", 14.4), ("L09", "s4", 26.6),
         ("L10", "s5", 0.4), ("L11", "s5", 8.2), ("L12", "s5", 12.6), ("L13", "s6", 0.4), ("L14", "s6", 9.0), ("L15", "s6", 13.6),
         ("L16", "s7", 0.6), ("L17", "s7", 5.0), ("L18", "s7", 7.0), ("L19", "s7", 11.2), ("L20", "s7", 16.0),
         ("L21", "s8", 0.6), ("L22", "s8", 16.2), ("L21b", "s9", 1.0), ("L23", "s9", 9.6), ("L24", "s10", 0.4), ("L25", "s10", 7.4)]
voice = np.zeros((N, 2)); vmask = np.zeros(N)
for lid, sc, t in lines:
    a = load(os.path.join(VO, lid + ".wav")); at = S[sc] + t
    add(voice, a, at, db(-1.0))
    i = int(at * SR); vmask[i: i + len(a)] = 1
# Leo's voiced "NEXT!"
add(voice, load(os.path.join(P, ".walla/next.wav")), S["s5"] + 6.3, db(-2.0))
i = int((S["s5"] + 6.3) * SR); vmask[i: i + int(0.7 * SR)] = 1

# ---- ducking envelope: smooth the voice mask (attack 0.25 s, release 0.7 s) ----
def smooth(mask, att=0.25, rel=0.7):
    env = np.zeros_like(mask); a = 1 / (att * SR); r = 1 / (rel * SR); v = 0.0
    step = 64
    for k in range(0, len(mask), step):
        tgt = mask[k:k + step].max()
        v = min(tgt, v + a * step) if tgt > v else max(tgt, v - r * step)
        env[k:k + step] = v
    return env
duck = smooth(vmask)

# ---- music: cue A for the red half, silence at Sam's decision, cue B for the gold half ----
music = np.zeros((N, 2))
A = load(MA)
turn = S["s6"] + 4.2          # music drops out as Sam decides
add(music, A, 0.0, 1.0, dur=turn, fin=0.8, fout=1.2)
if MB != "-":
    B = load(MB)
    bstart = S["s6"] + 5.8     # gold half begins as Sam runs to the door
    blen = TOTAL - bstart
    off = max(0.0, len(B) / SR - blen)
    add(music, B, bstart, 1.0, offset=off, fin=1.6, fout=2.5)
music_gain = db(-15.5) * (1 - duck) + db(-24.5) * duck
music *= music_gain[:, None]

# ---- ambience beds (crossfaded) ----
amb = np.zeros((N, 2))
beds = [("amb_city", S["s1"], S["s4"], -21), ("amb_cafe", S["s4"], S["s6"], -20), ("amb_city", S["s6"], S["s6"] + 8.7, -17), ("amb_wind", S["s6"], S["s6"] + 8.7, -24),
        ("amb_cafe", S["s6"] + 8.7, S["s7"] + 6.8, -21), ("amb_city", S["s7"] + 6.8, S["s7"] + 15.0, -21), ("amb_auditorium", S["s7"] + 15.0, S["s9"], -22),
        ("amb_wind", S["s9"], S["s10"], -26), ("amb_city", S["s10"], S["s10"] + 6.4, -22)]
for name, a0, a1, g in beds:
    src = sfx[name]; need = int((a1 - a0 + 0.6) * SR)
    loop = np.concatenate([src] * (need // len(src) + 2))[:need]
    add(amb, loop, max(0, a0 - 0.5), db(g), fin=1.0, fout=1.0)
amb *= (1 - 0.45 * duck)[:, None]

# ---- sound effects: (name, absolute time, gain dB, opts) ----
s1, s2, s3, s4, s5, s6, s7, s8, s9, s10 = (S[k] for k in ("s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"))
FX = [
    ("car_pass", s1 + 0.3, -12), ("crossing_beep", s1 + 1.0, -20), ("horn_close", s1 + 5.22, -9), ("boing", s1 + 5.26, -15), ("whoosh_a", s1 + 6.35, -16), ("car_pass", s1 + 11.0, -11),
    ("whoosh_c", s2 - 0.15, -12), ("tom1", s2 + 1.05, -10), ("tom2", s2 + 1.25, -9), ("tom3", s2 + 1.95, -9), ("sting", s2 + 2.5, -9), ("pop", s2 + 3.7, -16),
    ("steps", s3 + 0.2, -16), ("steps", s3 + 4.9, -16), ("steps", s3 + 9.6, -16), ("boing", s3 + 4.12, -10), ("whoosh_b", s3 + 4.0, -18), ("ka_ching", s3 + 11.25, -8),
    ("shop_bell", s4 + 0.1, -12), ("steps", s4 + 0.5, -18), ("espresso", s4 + 3.0, -16), ("pop", s4 + 5.8, -18), ("pop", s4 + 7.0, -18), ("pop", s4 + 8.1, -18),
    ("boom", s4 + 8.9, -12), ("record_scratch", s4 + 12.72, -8), ("whoosh_c", s4 + 14.2, -16),
    ("chalk", s4 + 15.5, -18), ("chalk", s4 + 16.4, -19), ("chalk", s4 + 18.5, -19), ("chalk", s4 + 21.0, -19), ("chalk", s4 + 23.4, -18), ("chalk", s4 + 24.6, -21),
    ("whoosh_a", s4 + 26.2, -16),
    ("steps", s5 + 1.0, -20), ("coins", s5 + 3.7, -14), ("coins", s5 + 6.35, -7), ("boom", s5 + 6.3, -13), ("tom1", s5 + 9.0, -8), ("tom2", s5 + 9.75, -8), ("tom3", s5 + 10.55, -7),
    ("whoosh_a", s5 + 8.3, -18), ("steps", s5 + 12.4, -18), ("horn_short", s5 + 17.3, -12),
    ("shop_bell", s6 + 0.05, -14), ("bags", s6 + 0.6, -14), ("cup_set", s6 + 2.05, -10), ("clock_tick", s6 + 4.2, -14), ("steps", s6 + 4.9, -16), ("shop_bell", s6 + 5.9, -12),
    ("ding", s6 + 7.15, -8), ("shimmer", s6 + 7.2, -12), ("whoosh_b", s6 + 8.6, -16), ("pop", s6 + 9.2, -16), ("scribble", s6 + 10.2, -12), ("shimmer", s6 + 13.65, -12),
    ("boing", s7 + 0.6, -12), ("pop", s7 + 1.2, -16), ("pop", s7 + 2.2, -18), ("ka_ching", s7 + 3.5, -10), ("ding", s7 + 4.95, -10),
    ("whoosh_c", s7 + 6.7, -14), ("car_brake", s7 + 7.9, -12), ("ding", s7 + 8.3, -14), ("pop", s7 + 12.6, -16), ("car_pass", s7 + 14.1, -10),
    ("whoosh_a", s7 + 14.9, -14), ("applause", s7 + 15.3, -9), ("applause", s7 + 18.6, -14),
    ("whoosh_b", s8 + 0.4, -16), ("pop", s8 + 1.8, -14), ("shimmer", s8 + 5.1, -13), ("pop", s8 + 7.85, -12), ("shimmer", s8 + 10.4, -14), ("pop", s8 + 12.0, -12),
    ("shimmer", s8 + 13.2, -14), ("pop", s8 + 14.7, -12), ("shimmer", s8 + 17.3, -12),
    ("whoosh_c", s9 - 0.1, -12), ("shimmer", s9 + 0.8, -13), ("pop", s9 + 6.0, -12), ("shimmer", s9 + 8.0, -15), ("shimmer", s9 + 11.6, -14),
    ("shop_bell", s10 + 1.6, -16), ("ding", s10 + 2.0, -13), ("scribble", s10 + 2.6, -16), ("ding", s10 + 2.9, -13), ("car_brake", s10 + 3.6, -15), ("ding", s10 + 4.45, -12),
    ("whoosh_c", s10 + 5.9, -13), ("tom2", s10 + 6.2, -9), ("tom3", s10 + 6.65, -8), ("pop", s10 + 7.5, -16), ("shimmer", s10 + 12.8, -11),
]
R = np.random.default_rng(7)
for k in range(10): FX.append(("pop", s9 + 3.4 + k * 0.45 + R.uniform(0, 0.2), -24))  # trees sprouting
# the sneeze: only its final "CHOO" burst lands on "cold"
fx = np.zeros((N, 2))
sn = sfx["sneeze"]; add(fx, sn, s4 + 28.3 - 0.42, db(-6), offset=len(sn) / SR - 0.55)
for name, at, g in FX:
    add(fx, sfx[name], at, db(g))
fx *= (1 - 0.25 * duck)[:, None]

mix = voice + music + amb + fx
# gentle bus limiter, then write; loudness is normalised by ffmpeg afterwards
peak = np.abs(mix).max()
if peak > 0.98: mix *= 0.98 / peak
sf.write(OUT, mix.astype(np.float32), SR, subtype="FLOAT")
print("mix written", OUT, round(len(mix) / SR, 2), "s, peak", round(float(np.abs(mix).max()), 3))
