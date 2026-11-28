"""Slice one-shots out of recorded loops: energy onsets, min gap, fixed length, short fades. Writes 48 kHz stereo wavs."""
import sys, os, subprocess, json
import numpy as np, soundfile as sf
from scipy.ndimage import uniform_filter1d
SR = 48000
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def onsets(x, gap, thr_db):
    m = np.abs(x).mean(1); e = np.sqrt(uniform_filter1d(m ** 2, int(0.008 * SR))); edb = 20 * np.log10(e + 1e-9)
    base = uniform_filter1d(edb, int(0.25 * SR)); flux = edb - base
    peak = edb.max(); out = []; i = 0; g = int(gap * SR)
    while i < len(edb):
        if flux[i] > 6 and edb[i] > peak + thr_db: out.append(i); i += g
        else: i += 32
    return out
def cut(x, i, L, pre=0.012):
    a = max(0, i - int(pre * SR)); y = x[a:a + int(L * SR)].copy(); n = len(y)
    fi = int(0.004 * SR); fo = int(min(0.08, L * 0.4) * SR); y[:fi] *= np.linspace(0, 1, fi)[:, None]; y[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2; return y
if __name__ == "__main__":
    src, out, prefix, gap, L, thr, nmax = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6]), int(sys.argv[7])
    x = load(src); os.makedirs(out, exist_ok=True); ons = onsets(x, gap, thr)
    peaks = [float(np.abs(x[i:i + int(0.1 * SR)]).max()) for i in ons]
    med = np.median(peaks) if peaks else 0; keep = [i for i, p in zip(ons, peaks) if 0.5 * med < p < 1.8 * med][:nmax]
    for k, i in enumerate(keep): sf.write(os.path.join(out, f"{prefix}_{k}.wav"), cut(x, i, L), SR, subtype="PCM_16")
    print(prefix, len(ons), "onsets ->", len(keep), [round(i / SR, 2) for i in keep])
