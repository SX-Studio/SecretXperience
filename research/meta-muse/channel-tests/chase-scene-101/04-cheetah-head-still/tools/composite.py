"""Build 1080x1920 shot composites from the source film + per-frame overlay data in composite coords.
Layouts: "window" = blurred cover background + 4:3 (or square) window following the cheetah;
         "full"   = full-bleed 9:16 crop following the cheetah; "lock" = full-bleed crop with the HEAD locked in place.
Usage: python composite.py SRC plan.json OUTDIR"""
import cv2, json, sys, subprocess, numpy as np
src, plan, out = sys.argv[1], json.load(open(sys.argv[2])), sys.argv[3]
W, H = 1080, 1920
cap = cv2.VideoCapture(src); FPS = cap.get(cv2.CAP_PROP_FPS)

def mask_of(f):
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    m = cv2.inRange(hsv, (5, 90, 80), (26, 255, 255))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n < 2: return None
    return (lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)

def features(m):
    ys, xs = np.nonzero(m); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max(); w = x1 - x0 + 1
    band = ys < y0 + 0.45 * (y1 - y0); xr = xs[band].max(); sel = band & (xs > xr - 0.07 * w)
    head = [float(np.median(xs[sel])), float(np.median(ys[sel]))]
    cols = m.sum(0)[x0:x1 + 1]; body = np.nonzero(cols > 0.45 * cols.max())[0]
    hx = x0 + body.min() + int(0.06 * w); cm = np.nonzero(m[:, min(hx, 1919)])[0]
    hip = [float(hx), float(cm.min() if len(cm) else y0)]
    spine = []                                                  # dorsal contour from hip to just behind the head
    for x in np.linspace(hip[0], head[0] - 0.08 * w, 14):
        c = np.nonzero(m[:, int(x)])[0]
        if len(c): spine.append([float(x), float(c.min())])
    low = np.nonzero(ys > y1 - 6)[0]; paw = [float(np.median(xs[low])), float(y1)]   # lowest point = planted paw
    left = xs < x0 + 0.25 * w; tail = [float(xs[left][np.argmin(ys[left])]), float(ys[left].min())] if left.any() else [float(x0), float(y0)]
    return dict(cx=float(xs.mean()), cy=float(ys.mean()), x0=int(x0), y0=int(y0), x1=int(x1), y1=int(y1), head=head, hip=hip, spine=spine, paw=paw, tail=tail)

def smooth(a, k):
    a = np.asarray(a, float); pad = np.pad(a, (k, k), mode="edge")
    return np.convolve(pad, np.ones(2 * k + 1) / (2 * k + 1), mode="same")[k:-k]

for s in plan:
    cap.set(cv2.CAP_PROP_POS_MSEC, s["in"] * 1000); n = int(round(s["dur"] * FPS)) + 2
    frames, feats = [], []
    tracker = None
    for i in range(n):
        ok, f = cap.read()
        if not ok: break
        frames.append(f); m = mask_of(f)
        ft = features(m) if m is not None else dict(feats[-1])
        if "headbox" in s:                                      # front-on shots: CSRT on the face
            if tracker is None:
                tracker = cv2.TrackerCSRT_create(); tracker.init(f, tuple(s["headbox"]))
                bx = s["headbox"]
            else:
                ok2, bx = tracker.update(f)
            ft["head"] = [bx[0] + bx[2] / 2, bx[1] + bx[3] / 2]
        feats.append(ft)
    lay = s["layout"]
    cxs = smooth([f["cx"] for f in feats], 8); cys = smooth([f["cy"] for f in feats], 8)
    hxs = smooth([f["head"][0] for f in feats], 1); hys = smooth([f["head"][1] for f in feats], 1)
    tmp = f"{out}/{s['id']}_raw.mp4"
    enc = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                            "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", tmp], stdin=subprocess.PIPE)
    data = []
    freeze = s.get("freeze")                                    # [at_seconds, hold_seconds]
    order = list(range(len(frames)))
    if freeze:
        k = int(round(freeze[0] * FPS)); hold = int(round(freeze[1] * FPS)); order = order[:k] + [k] * hold + order[k:]
        order = order[:len(frames)]                             # keep total length = shot duration
    for oi, i in enumerate(order):
        f, ft = frames[i], feats[i]
        if lay == "window":
            cw = s.get("cw", 1440); ch = int(cw * s.get("aspect", 0.75)); ch = min(ch, 1080); sc = W / cw
            x0 = int(np.clip(cxs[i] - cw / 2 + s.get("lead", 0), 0, 1920 - cw)); y0 = int(np.clip(cys[i] - ch / 2, 0, 1080 - ch))
            wy = s.get("wy", 560); wh = int(ch * sc)
            bgs = H / 1080; bw = int(1920 * bgs); bx0 = int(np.clip(cxs[i] * bgs - W / 2, 0, bw - W))
            small = cv2.resize(f, (bw // 8, H // 8)); small = cv2.GaussianBlur(small, (0, 0), 6)
            bg = cv2.resize(small, (bw, H))[:, bx0:bx0 + W]; bg = (bg * 0.42).astype(np.uint8)
            fg = cv2.resize(f[y0:y0 + ch, x0:x0 + cw], (W, wh), interpolation=cv2.INTER_AREA if sc < 1 else cv2.INTER_CUBIC)
            comp = bg.copy(); comp[wy:wy + wh] = fg
            mp = lambda p: [round((p[0] - x0) * sc, 1), round((p[1] - y0) * sc + wy, 1)]
        else:
            cw, ch = s.get("cw", 576), s.get("ch", 1024); sc = W / cw
            if lay == "lock":
                ax, ay = s.get("anchor", [0.62, 0.36])           # where the head sits in the crop
                x0 = int(np.clip(hxs[i] - ax * cw, 0, 1920 - cw)); y0 = int(np.clip(hys[i] - ay * ch, 0, 1080 - ch))
            else:
                x0 = int(np.clip(cxs[i] - cw / 2, 0, 1920 - cw)); y0 = int(np.clip(cys[i] - ch / 2, 0, 1080 - ch))
            comp = cv2.resize(f[y0:y0 + ch, x0:x0 + cw], (W, H), interpolation=cv2.INTER_CUBIC)
            mp = lambda p: [round((p[0] - x0) * sc, 1), round((p[1] - y0) * sc, 1)]
        enc.stdin.write(comp.tobytes())
        data.append(dict(t=round(oi / FPS, 4), frozen=bool(freeze and oi != i or (freeze and order.count(i) > 1 and oi >= int(round(freeze[0] * FPS)) and oi < int(round(freeze[0] * FPS)) + int(round(freeze[1] * FPS)))),
                         head=mp(ft["head"]), hip=mp(ft["hip"]), paw=mp(ft["paw"]), tail=mp(ft["tail"]),
                         spine=[mp(p) for p in ft["spine"]], box=mp([ft["x0"], ft["y0"]]) + mp([ft["x1"], ft["y1"]])))
    enc.stdin.close(); enc.wait()
    json.dump(dict(id=s["id"], fps=FPS, src_in=s["in"], layout=lay, frames=data), open(f"{out}/{s['id']}.json", "w"))
    hy = [d["head"][1] for d in data]; py = [d["hip"][1] for d in data]
    print(s["id"], lay, len(data), "frames; head-y range", round(max(hy) - min(hy)), "hip-y range", round(max(py) - min(py)))
