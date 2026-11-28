"""Small demo mixer: python mix_small.py <project> <duration> <spec.json>. spec = {"vo":[[t,"id"]], "sfx":[[t,"name",gain,pan]], "beds":[[name,gain]], "music":[path,src0,gain]}"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
ROOT, D = sys.argv[1], float(sys.argv[2]); spec = json.load(open(sys.argv[3])); SR = 48000; N = int(D * SR); out = np.zeros((N, 2)); db = lambda x: 10 ** (x / 20)
def load(p):
    a, sr = sf.read(p); a = np.stack([a, a], 1) if a.ndim == 1 else a
    return resample_poly(a, SR, sr, axis=0) if sr != SR else a
def put(x, at, g=0, p=0):
    if p: x = np.stack([x[:, 0] * np.sqrt(0.5 * (1 - p)) * 1.414, x[:, 1] * np.sqrt(0.5 * (1 + p)) * 1.414], 1)
    i = int(at * SR); j = min(N, i + len(x))
    if j > i: out[i:j] += x[: j - i] * db(g)
voice = np.zeros((N, 2))
for t, vid in spec.get("vo", []):
    a = load(os.path.join(ROOT, "assets/vo", vid + ".wav")); i = int(t * SR); j = min(N, i + len(a)); voice[i:j] += a[: j - i]
for t, n, g, p in spec.get("sfx", []): put(load(os.path.join(ROOT, "assets/sfx", n + ".wav")), t, g, p)
bedbuf = np.zeros((N, 2))
for n, g in spec.get("beds", []): a = load(os.path.join(ROOT, "assets/sfx", n + ".wav")); a = np.concatenate([a] * (N // len(a) + 1))[:N]; bedbuf += a * db(g)
mus = np.zeros((N, 2))
if spec.get("music"):
    pth, s0, g = spec["music"]; m = load(pth)[int(s0 * SR): int(s0 * SR) + N]; m = np.pad(m, ((0, N - len(m)), (0, 0))); f = int(1.5 * SR); m[-f:] *= np.linspace(1, 0, f)[:, None]; mus = m * db(g)
env = np.abs(voice).mean(1); from scipy.ndimage import uniform_filter1d; env = uniform_filter1d(env, 2400); env = np.clip(env / (env.max() + 1e-9) * 3, 0, 1)
mix = out + voice + (bedbuf + mus) * (db(-8) ** env)[:, None]
sf.write(os.path.join(ROOT, "assets/mix_raw.wav"), mix.astype(np.float32), SR, subtype="FLOAT"); print("ok")
