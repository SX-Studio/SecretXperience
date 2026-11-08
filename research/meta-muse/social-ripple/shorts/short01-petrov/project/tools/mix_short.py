import json, re, numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt, fftconvolve
SR = 48000; js = open("assets/t.js").read()
T = json.loads(re.search(r"window.T=(.*?);\n", js).group(1)); WD = json.loads(re.search(r"window.WORDS=(.*?);\n", js).group(1))
D = T["D"]; N = int((D + 0.2) * SR); rng = np.random.default_rng(7)
def W(w, nth=0, line=None):
    k = 0
    for x in WD:
        if (not line or x[3] == line) and re.sub(r"[^a-z0-9']", "", x[0].lower()) == w:
            if k == nth: return x[1]
            k += 1
    raise KeyError(w)
def load(p):
    a, sr = sf.read(p); a = np.stack([a, a], 1) if a.ndim == 1 else a
    return resample_poly(a, SR, sr, axis=0) if sr != SR else a
db = lambda x: 10 ** (x / 20); t_ = lambda d: np.arange(int(d * SR)) / SR
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x, axis=0)
def put(buf, x, at, g=0.0):
    if x.ndim == 1: x = np.stack([x, x], 1)
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[: j - i] * db(g)
voice = np.zeros((N, 2)); fx = np.zeros((N, 2)); bed = np.zeros((N, 2)); mus = np.zeros((N, 2))
for k in [l.split("\t")[0] for l in open("vo_lines.tsv") if l.strip()]: put(voice, load(f"assets/vo/{k}.wav"), T[k], 0)
sfx = lambda n: load(f"assets/sfx/{n}.wav")
def env(n, a, b): e = np.ones(n); na, nb = int(a * SR), int(b * SR); e[:na] = np.linspace(0, 1, na); e[-nb:] = np.linspace(1, 0, nb); return e
# beds: bunker hum, space air, dawn wind
tb = t_(T["f1"] + 0.6); hum = (np.sin(2 * np.pi * 50 * tb) * 0.4 + np.sin(2 * np.pi * 100 * tb) * 0.25 + lp(rng.standard_normal(len(tb)), 300) * 0.5) * env(len(tb), 0.3, 0.5); put(bed, hum * 0.5, 0, -14)
ts = t_(T["f2"] - T["f1"]); air = lp(rng.standard_normal(len(ts)), 900) * env(len(ts), 0.6, 0.3); put(bed, air * 0.4, T["f1"], -16)
wnd = sfx("amb_wind")[: int((D - T["f3"] + 0.2) * SR)]; put(bed, wnd * env(len(wnd), 0.6, 0.15)[:, None], T["f3"], -12)
# synth sounds
def beeps(d, f=880, per=0.5, on=0.18): t = t_(d); return np.sign(np.sin(2 * np.pi * f * t)) * 0.3 * ((t % per) < on) * (0.6 + 0.4 * np.sin(2 * np.pi * f / 2 * t))
def siren(d=3.0): t = t_(d); f = 700 + 450 * (0.5 - 0.5 * np.cos(2 * np.pi * t / 1.4)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.6 + np.sin(4 * np.pi * np.cumsum(f) / SR) * 0.2; return x * env(len(t), 0.05, 0.4)
def ping(): t = t_(1.6); x = np.sin(2 * np.pi * 1350 * t) * np.exp(-t * 4); ir = rng.standard_normal(int(0.8 * SR)) * np.exp(-np.arange(int(0.8 * SR)) / (0.15 * SR)); return x * 0.7 + fftconvolve(x, ir)[: len(x)] * 0.02
put(fx, beeps(T["s1"] - 1.2), 0.9, -20)
put(fx, siren(3.2), W("siren"), -8); put(fx, sfx("boom"), W("siren") - 0.05, -9)
put(fx, beeps(W("hits") - W("siren") - 1.0, 988, 0.45, 0.16), W("siren") + 1.0, -24)
for w in ("one", "two", "five"): put(fx, sfx("boop_b"), W(w, 0, "e1") - 0.05 if w != "two" else W("two") - 0.05, -6)
put(fx, sfx("boom"), W("war") - 0.05, -12)
put(fx, sfx("heartbeat"), W("hesitates") - 0.1, -4); put(fx, sfx("heartbeat"), W("hesitates") + 0.85, -6); put(fx, sfx("heartbeat"), W("story") + 0.1, -8)
put(fx, sfx("pop"), W("fear") - 0.03, -8); put(fx, sfx("pop"), W("facts") - 0.03, -8)
put(fx, sfx("whoosh_a"), W("see") - 0.15, -8); put(fx, sfx("whoosh_c"), W("hundreds") - 0.1, -10)
put(fx, ping(), W("radar") - 0.05, -8); put(fx, ping(), W("radar") + 0.95, -12)
put(fx, sfx("tap"), W("calls") - 0.05, -6)
for k in range(10): put(fx, sfx("tick"), W("one", 0, "p2") + k * (W("hits") - W("one", 0, "p2")) / 10, -10)
put(fx, sfx("ding"), W("hits") + 0.05, -12)
put(fx, sfx("riser"), T["f1"] - 0.5, -10); put(fx, sfx("whoosh_b"), T["f1"], -6); put(fx, sfx("shimmer"), W("sunlight") - 0.05, -10)
put(fx, sfx("whoosh_c"), T["f2"] - 0.1, -10); put(fx, sfx("paper"), T["f2"] + 0.05, -10); put(fx, sfx("stamp"), W("reprimand") - 0.02, -2)
put(fx, sfx("whoosh_a"), T["f3"] - 0.1, -10); put(fx, sfx("gold_chime"), T["f3"] + 0.3, -6)
# music: tension cue under the bunker, quieter after "You see", then the warm cue to the end; hard cut on the last word
mc = load("/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/acestep/ripple2/cueC.wav")
a = mc[: int((T["f2"] + 0.1) * SR)].copy(); e = np.ones(len(a)); i0, i1 = int((W("see") - 0.1) * SR), int(T["f1"] * SR); e[i0:] = db(-5); e[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR)); put(mus, a * e[:, None], 0, -6)
mb = load("/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/acestep/ripple2/cueB.wav")
b = mb[int(84 * SR): int(84 * SR) + int((D - T["f2"] + 0.05) * SR)].copy(); eb = np.ones(len(b)); eb[: int(0.4 * SR)] = np.linspace(0, 1, int(0.4 * SR)); eb[-int(0.08 * SR):] = np.linspace(1, 0, int(0.08 * SR)); put(mus, b * eb[:, None], T["f2"], -5)
v = np.abs(voice).mean(1); w = int(0.05 * SR); en = np.clip(np.convolve(v, np.ones(w) / w, mode="same") / (np.percentile(v[v > 1e-4], 90) + 1e-9), 0, 1)
mus *= (db(-8) ** en)[:, None]; bed *= (db(-3) ** en)[:, None]
out = voice + mus + bed + fx; out = out[: int(D * SR)]
sf.write("assets/mix_raw.wav", out.astype(np.float32), SR, subtype="FLOAT"); print("ok", round(len(out) / SR, 2))
