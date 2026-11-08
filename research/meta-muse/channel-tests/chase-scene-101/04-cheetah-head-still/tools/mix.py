"""Mix narration + ACE-Step score + SFX stem for the falcon Short. Usage: python mix.py <score.wav> <sfx.wav> <out.wav> [score_db=-12] [sfx_db=-4]"""
import json, re, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly
SR = 48000; DUR = 40.94; N = int(DUR * SR)
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
fade = np.clip((DUR - 0.02 - t) / 1.2, 0, 1)                   # final chord rings to the last frame
fadein = np.clip(t / 0.4, 0, 1)
rms = lambda x: np.sqrt(np.mean(x ** 2)) + 1e-12
vr = rms(vo[np.abs(vo) > 0.01]); mr = rms(m.mean(1)[(t > 1) & (t < 37)])   # score level before ducking
m = m * (duck * fade * fadein)[:, None]
sdb = float(sys.argv[4]) if len(sys.argv) > 4 else -12; xdb = float(sys.argv[5]) if len(sys.argv) > 5 else -4
m *= (vr * 10 ** (sdb / 20)) / mr                               # score ~12 dB under the voice
x, sr = sf.read(sys.argv[2]); x = x if x.ndim > 1 else x[:, None].repeat(2, 1); x = x[:N]
x = np.pad(x, ((0, N - len(x)), (0, 0)))
x *= (np.abs(vo).max() * 10 ** (xdb / 20)) / (np.abs(x).max() + 1e-12)   # SFX peaks relative to voice peak
x *= (1 - 0.35 * np.clip(out / 0.1, 0, 1))[:, None]             # SFX tucks slightly under speech too
mix = m + x + vo[:, None]
mix /= max(1.0, np.abs(mix).max() / 0.95)
sf.write(sys.argv[3], mix, SR, subtype="PCM_16"); print("mixed", starts)
