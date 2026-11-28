"""Mix narration + ACE-Step score for the cheetah Short. Usage: python mix.py <score.wav> <out.wav>"""
import json, re, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly
SR = 48000; DUR = 78.0; N = int(DUR * SR)
meta = json.load(open("audio_meta.json"))
# frame starts from the assembled index (data-start of each frame's voice clip)
idx = open("index.html").read()
starts = {int(m.group(1)): float(m.group(2)) for m in re.finditer(r'id="el-(\d\d)-[^"]*-voice"\s+src="[^"]+"\s+data-start="([\d.]+)"', idx)}
vo = np.zeros(N)
for v in meta["voices"]:
    a, sr = sf.read(v["path"]); a = a.mean(1) if a.ndim > 1 else a
    if sr != SR: a = resample_poly(a, SR, sr)
    i = int(starts[v["frame"]] * SR); j = min(N, i + len(a)); vo[i:j] += a[: j - i]
m, sr = sf.read(sys.argv[1]); m = m if m.ndim > 1 else m[:, None].repeat(2, 1)
if sr != SR: m = resample_poly(m, SR, sr, axis=0)
m = m[:N]; t = np.arange(N) / SR
env = np.abs(vo); g = 0.0; out = np.zeros(N); att, rel = np.exp(-1 / (0.05 * SR)), np.exp(-1 / (0.5 * SR))
for k in range(N):
    x = env[k]; c = att if x > g else rel; g = c * g + (1 - c) * x; out[k] = g
duck = 1 - 0.45 * np.clip(out / 0.1, 0, 1)                     # up to about -5 dB under speech
fade = np.clip((DUR - 0.2 - t) / 3.8, 0, 1) ** 1.5              # fade over the end card
fadein = np.clip(t / 1.5, 0, 1)
rms = lambda x: np.sqrt(np.mean(x ** 2)) + 1e-12
vr = rms(vo[np.abs(vo) > 0.01]); mr = rms(m.mean(1)[(t > 2) & (t < 70)])   # score level before ducking
m = m * (duck * fade * fadein)[:, None]
m *= (vr * 10 ** (-12 / 20)) / mr                               # score ~12 dB under the voice
mix = m + vo[:, None]
mix /= max(1.0, np.abs(mix).max() / 0.95)
sf.write(sys.argv[2], mix, SR, subtype="PCM_16"); print("mixed", starts)
