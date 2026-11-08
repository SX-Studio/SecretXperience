"""Audio event tagging (PANNs Cnn14 sound event detection, AudioSet's 527 labels) -> JSON of top labels per 0.5 s.
Run with a Python that has torch + panns_inference. Usage: python tag_audio.py AUDIO.wav OUT.json"""
import sys, json, subprocess, numpy as np
from panns_inference import SoundEventDetection, labels
wav, out = sys.argv[1:3]
raw = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", wav, "-ac", "1", "-ar", "32000", "-f", "f32le", "-"], capture_output=True).stdout
a = np.frombuffer(raw, np.float32).copy(); sed = SoundEventDetection(checkpoint_path=None, device="cpu")
CH = 32000 * 30; frames = []
for i in range(0, len(a), CH):
    x = a[i:i + CH]
    if len(x) < 32000: x = np.pad(x, (0, 32000 - len(x)))
    fo = sed.inference(x[None, :])[0]; frames.append(fo[: int(len(a[i:i + CH]) / 320)])
F = np.concatenate(frames)            # 100 frames per second
res = []
for k in range(0, len(F), 50):
    m = F[k:k + 50].max(0); top = np.argsort(-m)[:5]
    res.append([round(k / 100, 2), [[labels[j], round(float(m[j]), 2)] for j in top if m[j] > 0.15]])
json.dump(res, open(out, "w")); print("tagged", len(res), "windows")
