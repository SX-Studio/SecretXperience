import json, numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
SR = 48000
meta = json.load(open("audio_meta.json")); cues = json.load(open("tools/cues.json"))["frames"]
sr, m = wavfile.read("assets/music/score.wav"); m = m.astype(np.float32) / 32768
N = len(m); vo = np.zeros(N, np.float32)
for v in meta["voices"]:
    vsr, a = wavfile.read(v["path"]); a = a.astype(np.float32)
    if a.ndim > 1: a = a.mean(1)
    a /= (np.abs(a).max() or 1)
    if vsr != SR: a = resample_poly(a, SR, vsr)
    i = int(cues[f'{v["frame"]:02d}'] * SR); j = min(N, i + len(a)); vo[i:j] += a[: j - i]
# smoothed voice envelope (attack ~40 ms, release ~450 ms)
env = np.abs(vo); out = np.zeros_like(env); g = 0.0
att, rel = np.exp(-1 / (0.04 * SR)), np.exp(-1 / (0.45 * SR))
for k in range(N):
    x = env[k]; c = att if x > g else rel; g = c * g + (1 - c) * x; out[k] = g
duck = 1.0 - 0.5 * np.clip(out / 0.12, 0, 1)   # up to -6 dB under speech
wavfile.write("assets/music/score_ducked.wav", SR, (m * duck * 32767).astype(np.int16))
print("ducked", N / SR)
