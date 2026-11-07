import cv2, sys, os, numpy as np
from PIL import Image, ImageFilter
PICKS = {"ep07-im-fine": "img4_r0c0", "ep08-37-lies": "img4_r0c1", "ep09-liking-gap": "img5_r0c0", "ep10-worries-91": "img3_r0c1", "ep11-9-out-of-10": "img4_r1c0",
         "ep12-pretending-qqq": "img3_r1c0", "ep13-reach-out-100": "img3_r1c1", "ep14-happiness-3-vs-9": "img3_r1c2", "ep15-sleep-8h-3h": "img3_r2c0",
         "ep16-copying-you": "img5_r2c1", "ep17-wallet-returns": "img3_r2c2"}
sr = cv2.dnn_superres.DnnSuperResImpl_create(); sr.readModel("EDSR_x3.pb"); sr.setModel("edsr", 3)
for name, tile in PICKS.items():
    img = cv2.imread(f"tiles/{tile}.png")
    h, w = img.shape[:2]; img = img[2:h - 2, 2:w - 2]          # trim gutter bleed
    up = sr.upsample(img)                                       # x3 with EDSR
    pil = Image.fromarray(cv2.cvtColor(up, cv2.COLOR_BGR2RGB))
    W, H = pil.size; tw = round(H * 16 / 9)                     # crop to exact 16:9, centred
    if tw <= W: pil = pil.crop(((W - tw) // 2, 0, (W - tw) // 2 + tw, H))
    else: th = round(W * 9 / 16); pil = pil.crop((0, (H - th) // 2, W, (H - th) // 2 + th))
    pil = pil.resize((1280, 720), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    pil.save(f"final/{name}-1280x720.jpg", quality=93); print(name, tile, pil.size, flush=True)
