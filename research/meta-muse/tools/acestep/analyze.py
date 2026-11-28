"""RMS-over-time + rough spectral checks for the generated takes."""
import sys
import numpy as np
import soundfile as sf

def db(x):
    return 20 * np.log10(np.maximum(x, 1e-9))

for path in sys.argv[1:]:
    x, sr = sf.read(path)
    mono = x.mean(axis=1) if x.ndim > 1 else x
    dur = len(mono) / sr
    win = sr  # 1 s windows
    n = len(mono) // win
    rms = np.array([np.sqrt(np.mean(mono[i*win:(i+1)*win] ** 2)) for i in range(n)])
    r = db(rms)
    peak = db(np.abs(mono).max())
    print(f"\n== {path}  dur={dur:.1f}s sr={sr} peak={peak:.1f} dBFS  overall_rms={db(np.sqrt(np.mean(mono**2))):.1f} dBFS")
    # per-second RMS bar chart
    lo = -70.0
    for i, v in enumerate(r):
        bar = "#" * int(max(0, (v - lo)) / 1.5)
        print(f"{i:3d}s {v:6.1f} {bar}")
    def seg(a, b):
        b = min(b, n)
        return float(np.mean(r[a:b])) if b > a else float("nan")
    print("segments (mean dB): 0-5s %.1f | 5-25s %.1f | 25-35s %.1f | 35-48s %.1f | 50-56s %.1f | 56-68s %.1f | 68-72s %.1f | 72-end %.1f" % (
        seg(0, 5), seg(5, 25), seg(25, 35), seg(35, 48), seg(50, 56), seg(56, 68), seg(68, 72), seg(72, n)))
    print("loudest second:", int(np.argmax(r)), " quietest second after 40s:", (40 + int(np.argmin(r[40:]))) if n > 41 else None)
    # Low-frequency transient check (kick/drum detector): onset strength in 40-150 Hz band
    hop = sr // 50
    frames = len(mono) // hop - 1
    spec_lo, spec_hi = [], []
    w = np.hanning(2 * hop)
    freqs = np.fft.rfftfreq(2 * hop, 1 / sr)
    for i in range(frames):
        fr = mono[i*hop:i*hop + 2*hop]
        if len(fr) < 2 * hop:
            break
        S = np.abs(np.fft.rfft(fr * w))
        spec_lo.append(S[(freqs > 40) & (freqs < 150)].sum())
        spec_hi.append(S[(freqs > 2000) & (freqs < 8000)].sum())
    lo_e = np.array(spec_lo); hi_e = np.array(spec_hi)
    def flux(e):
        d = np.diff(np.log(e + 1e-6))
        return np.mean(np.maximum(d, 0) > 1.0)  # fraction of frames with sharp (>e) energy jumps
    print(f"transient rate: low-band {flux(lo_e)*100:.2f}%  high-band {flux(hi_e)*100:.2f}% of 20ms frames (drums typically >2-3%)")
