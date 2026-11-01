"""Mouth-open envelopes (30 fps, 0..1) from voice clips -> assets/lips.js (window.SR_LIPS)."""
import sys, os, json, numpy as np, soundfile as sf
d, out = sys.argv[1], sys.argv[2]; L = {}
for f in sorted(os.listdir(d)):
    if not f.endswith(".wav"): continue
    a, sr = sf.read(os.path.join(d, f)); a = a.mean(1) if a.ndim > 1 else a
    hop = sr // 30; rms = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a), hop)])
    env = np.clip((rms / (rms.max() + 1e-9) - 0.08) / 0.62, 0, 1)
    env = np.convolve(env, [0.25, 0.5, 0.25], mode="same")
    L[f[:-4]] = {"fps": 30, "env": [round(float(x), 2) for x in env]}
open(out, "w").write("window.SR_LIPS = " + json.dumps(L, separators=(",", ":")) + ";\n"); print(len(L), "clips")
