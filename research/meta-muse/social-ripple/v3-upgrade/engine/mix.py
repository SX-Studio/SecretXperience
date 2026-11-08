import json, re, numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
SR = 48000; T = json.loads(re.search(r"= (.*);", open("assets/t3.js").read()).group(1)); D = T["D"]; N = int((D + 0.5) * SR)
def load(p):
    a, sr = sf.read(p); a = np.stack([a, a], 1) if a.ndim == 1 else a
    return resample_poly(a, SR, sr, axis=0) if sr != SR else a
out = np.zeros((N, 2)); voice = np.zeros((N, 2))
def put(buf, x, at, g=0.0):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i] * 10 ** (g / 20)
for k in ("n26", "nia_seat", "jordan_free", "n27", "marcus_scoot", "n28"): put(voice, load(f"assets/vo/{k}.wav"), T[k], 0 if k.startswith("n2") else -1)
amb = load("assets/sfx/amb_cafeteria.wav"); a = amb[: N]; fade = np.minimum(1, np.arange(N) / (0.6 * SR))[:, None]; out += a * fade * 10 ** (-10 / 20)
st = load("assets/sfx/steps_cafeteria.wav")[: N]; out += st * 10 ** (-18 / 20)
def sfx(n, at, g): put(out, load(f"assets/sfx/{n}.wav"), at, g)
tS2 = T["n26:something"] - 0.05; tS3 = T["nia_seat"] - 0.15; tS4 = T["jordan_free"] - 0.15; tS5 = T["jordan_free"] + 0.62; tS6 = T["jordan_free_e"] + 0.05; tS8 = T["n27:but"] - 0.05; tS9 = T["marcus_scoot"] - 0.4; tS10 = T["n28"] - 0.1
for i, t in enumerate(np.arange(0.7, tS3 - 0.2, 0.42)): sfx(f"step_concrete_{i % 4}", t, -15)
sfx("whoosh_c", tS2 - 0.08, -16); sfx("whoosh_a", tS5 - 0.05, -6); sfx("boop_a", tS6 - 0.3, -40)
t = np.arange(int(0.5 * SR)) / SR; rng = np.random.default_rng(3)
clack = sosfilt(butter(2, 2500, "low", fs=SR, output="sos"), rng.standard_normal(len(t))) * np.exp(-t * 35) * 1.2 + np.sin(2 * np.pi * 140 * t) * np.exp(-t * 25) + sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 14) * 0.25 for f in (620, 930, 1370))
put(out, np.stack([clack, clack], 1) / np.abs(clack).max() * 0.6, tS6 + 0.25, -2)
sfx("chair_scrape", tS6 - 0.3, -14); sfx("heartbeat", T["n27:saw"] - 0.25, -9); sfx("whoosh_b", tS8 - 0.05, -14); sfx("whoosh_c", tS9 - 0.05, -12)
sfx("chair_scrape", T["marcus_scoot_e"], -14); sfx("gold_chime", T["n28:moves"], -5); sfx("ooh", T["n28:everybody"], -10)
cue = load("assets/cueB.wav"); t0 = T["n27"]; seg = cue[: int((D + 0.5 - t0) * SR)].copy(); n = len(seg)
env = np.minimum(1, np.arange(n) / (2.0 * SR)); env[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR)); put(out, seg * env[:, None], t0, -9)
v = np.abs(voice).mean(1); w = int(0.05 * SR); e = np.convolve(v, np.ones(w) / w, mode="same"); e = np.clip(e / (np.percentile(e[e > 1e-4], 90) + 1e-9), 0, 1)
out *= (10 ** (-4 / 20)) ** e[:, None]
sf.write("assets/mix_raw.wav", (out + voice).astype(np.float32), SR, subtype="FLOAT"); print("ok")
