import json, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
SR = 48000
tl = json.load(open('timeline.json')); T = tl['total']
N = int(T * SR) + SR
rng = np.random.default_rng(3)
def z(): return np.zeros(N, np.float32)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def env(n, a, d, sus=None):
    e = np.ones(n, np.float32); A = max(1, int(a * SR)); D = max(1, int(d * SR))
    e[:A] = np.linspace(0, 1, A); e[-D:] *= np.linspace(1, 0, D); return e
def place(buf, sig, t, g=1.0):
    i = int(t * SR); j = min(N, i + len(sig)); 
    if i < N: buf[i:j] += sig[:j - i] * g
def seg(t0, t1): return slice(int(t0 * SR), int(t1 * SR))
def fade(n, fi, fo):
    e = np.ones(n, np.float32); a = int(fi * SR); b = int(fo * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if b: e[-b:] *= np.linspace(1, 0, b)
    return e
def noise(n): return rng.standard_normal(n).astype(np.float32)
def tone(f, dur, wave='sine', det=0.0):
    t = np.arange(int(dur * SR)) / SR
    if wave == 'saw':
        out = np.zeros_like(t)
        for d in (-det, 0, det):
            ph = (t * f * (1 + d)) % 1; out += 2 * ph - 1
        return (out / 3).astype(np.float32)
    return np.sin(2 * np.pi * f * t).astype(np.float32)
def pluck(f, dur, damp=0.996):
    n = int(dur * SR); L = max(2, int(SR / f)); buf = rng.uniform(-1, 1, L).astype(np.float32); out = np.zeros(n, np.float32)
    for i in range(n):
        out[i] = buf[i % L]; buf[i % L] = damp * 0.5 * (buf[i % L] + buf[(i + 1) % L])
    return out
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)

music = z(); sfx = z()
# ---------------- score
# pads: chord sequence (A minor world), each chord with start, end, midi notes, gain
chords = [
 (0.0, 14.0, [45, 52, 57, 60], 0.05),      # Am (sparse intro)
 (14.0, 24.2, [41, 48, 53, 57], 0.06),     # F
 (24.2, 29.0, [43, 50, 55, 59], 0.06),     # G (tension rising)
 (29.0, 37.9, [44, 51, 56, 59], 0.08),     # G#dim-ish dread
 (40.0, 47.0, [33, 40, 45, 48], 0.12),     # low Am under wave
 (47.0, 59.5, [41, 48, 53, 56], 0.06),     # Fm (somber)
 (64.4, 72.6, [41, 48, 53, 57], 0.06),     # F
 (72.6, T, [45, 52, 57, 61, 64], 0.08),    # A major resolve
]
for (a, b, notes, g) in chords:
    dur = b - a + 2.0
    pad = np.zeros(int(dur * SR), np.float32)
    for m in notes:
        pad += tone(NOTE(m), dur, 'saw', 0.004) * 0.5
    pad = lp(pad, 900 if a < 40 else 600)
    pad *= fade(len(pad), 1.5, 2.0)
    place(music, pad, a, g)
# memorial: one held note
held = lp(tone(NOTE(57), 6.0, 'saw', 0.003), 700) * fade(int(6 * SR), 1.0, 2.5); place(music, held, 59.3, 0.07)
# plucked motif (A minor), sparse in intro, returns at outro in major
motif = [69, 72, 76, 74, 72, 69, 67, 69]
for i, m in enumerate(motif):
    place(music, pluck(NOTE(m), 2.5), 1.8 + i * 1.55, 0.16)
for i, m in enumerate([69, 73, 76, 81, 76, 73, 69]):
    place(music, pluck(NOTE(m), 3.0, 0.997), 73.3 + i * 1.05, 0.15)
# heartbeat pulse during dread
for k in range(40):
    t0 = 24.5 + k * (0.85 - min(0.4, k * 0.02))
    if t0 > 37.8: break
    beat = lp(noise(int(0.18 * SR)), 90, 4) * env(int(0.18 * SR), 0.005, 0.15) * 3.0
    place(music, beat, t0, 0.5); place(music, beat, t0 + 0.22, 0.35)
# rising string swell before the burst
sw = lp(tone(NOTE(56), 9.0, 'saw', 0.006) + tone(NOTE(63), 9.0, 'saw', 0.006), 1400) * np.linspace(0, 1, int(9 * SR)) ** 2
place(music, sw, 28.9, 0.10)
# wave hits (taiko-ish) under the wave
for t0 in [40.0, 41.9, 44.3, 45.8]:
    h = lp(noise(int(0.9 * SR)), 140, 4) * env(int(0.9 * SR), 0.004, 0.8) * 4
    place(music, h, t0, 0.55)
# silence the music between burst and wave reveal
music[seg(37.95, 39.4)] *= np.linspace(1, 0, len(music[seg(37.95, 39.4)])) ** 6

# ---------------- sound effects
# wind bed (outdoor scenes)
wind = bp(noise(N), 150, 900) * 0.08
wm = np.zeros(N, np.float32)
for a, b in [(13.9, 38.0), (38.6, 47.0), (46.9, 52.9)]:
    wm[seg(a, b)] = fade(len(wm[seg(a, b)]), 1.0, 0.8)
sfx += wind * wm * (0.6 + 0.4 * np.sin(np.arange(N) / SR * 0.7))
# paper rustle on fade up, and before outro
for t0 in (0.7, 72.6):
    r = hp(noise(int(0.7 * SR)), 2500) * env(int(0.7 * SR), 0.05, 0.5) * (0.4 + 0.6 * np.abs(np.sin(np.linspace(0, 18, int(0.7 * SR)))))
    place(sfx, r, t0, 0.09)
# distant harbor bell
bell = sum(tone(f, 4.0) * a for f, a in [(392, 1), (784, 0.4), (1176, 0.15), (1567, 0.1)]) * np.exp(-np.linspace(0, 6, int(4 * SR)))
place(sfx, lp(bell, 3000), 0.4, 0.05)
# headline thud
thud = lp(noise(int(0.4 * SR)), 120, 4) * env(int(0.4 * SR), 0.002, 0.35) * 5
place(sfx, thud, 4.28, 0.5)
# pen scratch (strike) and signature
def scratch(d): 
    x = bp(noise(int(d * SR)), 1800, 6000) * (0.5 + 0.5 * np.abs(np.sin(np.linspace(0, d * 30, int(d * SR)))))
    return x * env(int(d * SR), 0.01, 0.05)
place(sfx, scratch(0.4), 6.75, 0.12); place(sfx, scratch(1.0), 69.4, 0.08)
# viscous pour + glugs
pour = lp(noise(int(5.4 * SR)), 260, 3) * fade(int(5.4 * SR), 0.8, 1.0) * 1.5
place(sfx, pour, 9.0, 0.35)
for k in range(10):
    f0 = 70 + rng.random() * 60; d = 0.25
    gl = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f0 * 1.8, int(d * SR))) / SR) * env(int(d * SR), 0.01, 0.2)
    place(sfx, gl.astype(np.float32), 9.3 + k * 0.48 + rng.random() * 0.2, 0.18)
# steel creaks (resonant band noise with slow pitch)
for t0, d in [(14.6, 2.2), (17.8, 1.8), (22.0, 2.0), (30.0, 1.6), (33.6, 2.0), (35.9, 1.8)]:
    n = int(d * SR); x = noise(n)
    out = np.zeros(n, np.float32)
    for f in (180, 260, 410):
        out += bp(x, f * 0.95, f * 1.05, 2)
    out *= env(n, 0.3, 0.6) * (0.6 + 0.4 * np.sin(np.linspace(0, 9, n)))
    place(sfx, out * 3, t0, 0.22)
# drips during leaks
for k in range(14):
    d = 0.12; f0 = 1200 + rng.random() * 900
    dr = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f0 * 0.4, int(d * SR))) / SR) * np.exp(-np.linspace(0, 8, int(d * SR)))
    place(sfx, dr.astype(np.float32), 19.4 + k * 0.17 + rng.random() * 0.1, 0.07)
# brush stroke for paint
place(sfx, bp(noise(int(2.2 * SR)), 600, 3000) * fade(int(2.2 * SR), 0.3, 0.6) * (0.5 + 0.5 * np.abs(np.sin(np.linspace(0, 12, int(2.2 * SR))))), 21.4, 0.06)
# clock ticks with rising tone
for k in range(10):
    tk = hp(noise(int(0.03 * SR)), 3000) * env(int(0.03 * SR), 0.001, 0.025)
    place(sfx, tk, 24.4 + k * 0.5, 0.25)
place(sfx, (tone(1, 1) * 0)[:1], 0)
rise = np.sin(2 * np.pi * np.cumsum(np.linspace(220, 440, int(4 * SR))) / SR).astype(np.float32) * fade(int(4 * SR), 0.5, 0.5)
place(sfx, rise, 25.0, 0.03)
# rivet pops: same schedule as the animation
pop_times = []; tp, gap = 31.15, 0.34
for i in range(40):
    pop_times.append(tp); tp += gap; gap = max(0.07, gap * 0.9)
    if tp > 37.6: break
for i, t0 in enumerate(pop_times):
    d = 0.18; n = int(d * SR); tt = np.arange(n) / SR
    ping = sum(np.sin(2 * np.pi * f * tt) * a for f, a in [(2200, 1), (3380, 0.6), (5150, 0.35)]) * np.exp(-tt * 28)
    crack = hp(noise(n), 1500) * np.exp(-tt * 60)
    place(sfx, (ping * 0.5 + crack).astype(np.float32), t0, 0.32 + 0.004 * i)
# the burst: huge boom + rumble roar, then near-silence
n = int(4.0 * SR); tt = np.arange(n) / SR
boom = lp(noise(n), 80, 4) * np.exp(-tt * 1.2) * 9 + lp(noise(n), 400, 2) * np.exp(-tt * 3) * 2
place(sfx, boom.astype(np.float32), 37.98, 0.75)
# wave roar crescendo
n = int(8.4 * SR)
roar = (lp(noise(n), 500, 3) * 1.6 + bp(noise(n), 500, 2500) * 0.5) * (np.linspace(0.05, 1, n) ** 2)
place(sfx, roar.astype(np.float32), 38.6, 0.42)
# wood crashes
for t0 in [42.2, 43.3, 44.0, 45.0, 45.6, 46.1]:
    n = int(0.6 * SR); tt = np.arange(n) / SR
    w = bp(noise(n), 300, 2500) * np.exp(-tt * 9) * (1 + np.sign(np.sin(tt * 90)) * 0.5)
    place(sfx, w.astype(np.float32), t0, 0.25)
# engulf: muffle (cut highs of everything after 46.3 handled by lowering) + low swell
place(sfx, lp(noise(int(1.2 * SR)), 120, 4) * fade(int(1.2 * SR), 0.05, 1.0) * 4, 46.25, 0.4)
# sticky stretches in the thickening scene
for k in range(7):
    n = int(1.4 * SR); tt = np.arange(n) / SR
    st = lp(noise(n), 300 + 200 * np.sin(k), 2) * (np.sin(np.pi * tt / 1.4) ** 2)
    place(sfx, st.astype(np.float32) * 2, 52.6 + k * 0.95, 0.12)
# water lapping (harbor)
n = int(3.6 * SR); tt = np.arange(n) / SR
lap = bp(noise(n), 200, 1200) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.9 * tt) ** 2) * fade(n, 0.6, 0.8)
place(sfx, lap.astype(np.float32), 64.2, 0.15)
# stamp thud
place(sfx, lp(noise(int(0.35 * SR)), 180, 4) * env(int(0.35 * SR), 0.001, 0.3) * 6, 70.62, 0.5)
# outro chime
ch = sum(tone(f, 5.0) * a for f, a in [(880, 1), (1318.5, 0.5), (1760, 0.25)]) * np.exp(-np.linspace(0, 5, int(5 * SR)))
place(sfx, ch.astype(np.float32), 77.6, 0.05)

# master: music bus + sfx bus, normalized separately for the ffmpeg mix
def norm(x, peak): return (x / (np.max(np.abs(x)) + 1e-9) * peak).astype(np.float32)
music = lp(music, 9000); music = norm(music, 0.6); sfx = norm(sfx, 0.85)
music *= fade(N, 0.1, 2.5); sfx *= fade(N, 0.1, 2.0)
wavfile.write('music.wav', SR, music[:int(T * SR)]); wavfile.write('sfx.wav', SR, sfx[:int(T * SR)])
print('ok', T, 'pops', len(pop_times))
