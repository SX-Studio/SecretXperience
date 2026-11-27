"""Assemble a long-form episode from chapter projects: concat chapter videos, lay one continuous synthesized music bed
(dark lo-fi keys + pad, ducked under the voice, out for poster cards), loudnorm to -14 LUFS, mux.
usage: final.py <episode_dir> <out.mp4> ch1 ch2 ...   (each chapter has renders/<ch>.mp4, assets/mix_raw.wav, tools/events.json)"""
import json, os, sys, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
EP, OUT, CHS = sys.argv[1], sys.argv[2], sys.argv[3:]
SR = 48000; rng = np.random.default_rng(5); db = lambda x: 10 ** (x / 20)
lp = lambda x, f: sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
parts, posters, off = [], [], 0.0
for c in CHS:
    ev = json.load(open(f"{EP}/{c}/tools/events.json")); a, sr = sf.read(f"{EP}/{c}/assets/mix_raw.wav"); assert sr == SR
    a = a[: int(round(ev["D"] * SR))]; a = np.pad(a, ((0, int(round(ev["D"] * SR)) - len(a)), (0, 0)))
    parts.append(a); posters += [[off + p0, off + p1] for p0, p1 in (ev.get("posterOn") or [])]; off += ev["D"]
VO = np.concatenate(parts); N = len(VO); D = N / SR; t = np.arange(N) / SR
# ---- music: Am F C G (with a dark pad + sub), 80 bpm ----
def key(f, dur, vel):
    n = int(dur * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt * 3) + 0.1 * np.sin(6 * np.pi * f * tt) * np.exp(-tt * 5)
    e = np.exp(-tt * 1.5); e[: int(0.006 * SR)] *= np.linspace(0, 1, int(0.006 * SR)); return x * e * vel
def pad(f, dur, vel):
    n = int(dur * SR); tt = np.arange(n) / SR; x = sum(np.sin(2 * np.pi * f * (1 + d) * tt + p) for d, p in [(-0.004, 0), (0, 1), (0.004, 2)]) / 3
    e = np.minimum(1, np.minimum(tt / 0.8, (dur - tt) / 0.8)); return lp(x, 1800) * e * vel
nt = lambda m: 440 * 2 ** ((m - 69) / 12)
MUS = np.zeros((N, 2)); beat = 60 / 80; bar = 4 * beat
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; bass = [45, 41, 36, 43]
def put(x, at, pan=0.0):
    i = int(at * SR); j = min(N, i + len(x));
    if j > i: MUS[i:j, 0] += x[: j - i] * (1 - pan) * 0.7; MUS[i:j, 1] += x[: j - i] * (1 + pan) * 0.7
k, t0 = 0, 0.0
while t0 < D:
    ch = prog[k % 4]
    for b in range(4):
        for i, m in enumerate(ch): put(key(nt(m + (12 if (b % 2 and i == 2) else 0)), beat * 1.8, 0.15 if b else 0.21), t0 + b * beat + i * 0.012, (i - 1) * 0.3)
        if b in (1, 3): put(key(nt(ch[(b + k) % 3] + 12), beat * 0.9, 0.06), t0 + b * beat + beat / 2, 0.4)
    for m in ch: put(pad(nt(m - 12), bar, 0.10), t0)
    put(pad(nt(bass[k % 4] - 12), bar, 0.22), t0); t0 += bar; k += 1
crk = np.zeros(N); idx = rng.integers(0, N, int(D * 25)); crk[idx] = rng.uniform(-1, 1, len(idx)); crk = sosfilt(butter(2, [1500, 8000], "band", fs=SR, output="sos"), crk) * 0.18
MUS += crk[:, None]
g = np.clip(t / 1.5, 0, 1)
for p0, p1 in posters:
    m = (t >= p0 - 0.2) & (t < p1 + 0.2); g[m] = 0; r = (t >= p1 + 0.2) & (t < p1 + 1.2); g[r] = np.minimum(g[r], t[r] - p1 - 0.2)
g[t > D - 3] *= np.clip((D - t[t > D - 3]) / 3, 0, 1)
v = np.abs(VO).mean(1); w = int(0.12 * SR); e = np.convolve(v, np.ones(w) / w, "same"); e = e / (np.percentile(e[e > 1e-4], 90) + 1e-9)
duck = np.convolve(np.clip(e * 3, 0, 1), np.ones(int(0.35 * SR)) / int(0.35 * SR), "same")
out = VO + MUS * (g * db(-20) * db(-7 * duck))[:, None]
raw = f"{EP}/final_raw.wav"; sf.write(raw, out.astype(np.float32), SR, subtype="FLOAT")
# ---- loudnorm (two pass) ----
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
J = json.loads(r[r.rindex("{"): r.rindex("}") + 1]); fin = f"{EP}/final.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={J['input_i']}:measured_TP={J['input_tp']}:measured_LRA={J['input_lra']}:measured_thresh={J['input_thresh']}:offset={J['target_offset']}:linear=true", "-ar", "48000", fin], check=True)
# ---- concat video + mux ----
lst = f"{EP}/concat.txt"; open(lst, "w").write("".join(f"file '{EP}/{c}/renders/{c}.mp4'\n" for c in CHS))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", fin, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT], check=True)
print("ok", round(D, 2), "s ->", OUT, "posters", len(posters))
