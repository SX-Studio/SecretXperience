import sys, numpy as np
from PIL import Image, ImageFilter
from transformers import pipeline
src, dst = sys.argv[1], sys.argv[2]
pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf", device="cpu")
img = Image.open(src).convert("RGB")
d = np.asarray(pipe(img)["predicted_depth"], np.float32) if False else None
res = pipe(img)
dep = res["depth"].resize(img.size, Image.BICUBIC)
a = np.asarray(dep, np.float32); a = (a - a.min()) / (a.max() - a.min() + 1e-6)
a = np.power(a, 1.3)  # emphasise foreground separation
im = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
im.save(dst); print("depth", im.size, "mean", round(float(a.mean()), 3))
