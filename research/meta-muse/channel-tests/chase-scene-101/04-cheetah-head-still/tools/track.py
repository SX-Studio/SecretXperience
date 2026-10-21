"""Per-frame cheetah tracking by colour segmentation (source coords, 1920x1080).
Usage: python track.py SRC shots.json OUTDIR  — shots: [{"id","in","dur","mode":"side"|"front"}]
Writes OUTDIR/<id>.json {fps, frames:[{t, cx, cy, x0,y0,x1,y1, head:[x,y], hip:[x,y]}]} and OUTDIR/<id>_debug.jpg"""
import cv2, json, sys, numpy as np
src, shots, out = sys.argv[1], json.load(open(sys.argv[2])), sys.argv[3]
cap = cv2.VideoCapture(src); FPS = cap.get(cv2.CAP_PROP_FPS)

def mask_of(f):
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    m = cv2.inRange(hsv, (5, 90, 80), (26, 255, 255))           # tawny coat (excludes yellow-green grass)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))   # fill spots
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n < 2: return None
    k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    return (lab == k).astype(np.uint8)

def analyse(m, mode):
    ys, xs = np.nonzero(m); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cols = m.sum(0); w = x1 - x0 + 1
    if mode == "side":                                          # running right
        band = ys < y0 + 0.45 * (y1 - y0)                       # head rides in the upper body band, paws below
        xr = xs[band].max(); sel = band & (xs > xr - 0.07 * w)
        head = [float(np.median(xs[sel])), float(np.median(ys[sel]))]
        thick = cols[x0:x1 + 1]; body = np.nonzero(thick > 0.45 * thick.max())[0]
        hx = x0 + body.min() + int(0.06 * w)                    # rump, past the thin tail
        colmask = np.nonzero(m[:, hx])[0]
        hip = [float(hx), float(colmask.min() if len(colmask) else y0)]
    else:                                                       # coming at camera: head = top of the widest upper blob
        top = ys < y0 + 0.30 * (y1 - y0)
        head = [float(np.median(xs[top])), float(np.percentile(ys[top], 60))]
        hip = [float(np.mean(xs)), float(np.mean(ys))]
    return dict(cx=float(xs.mean()), cy=float(ys.mean()), x0=int(x0), y0=int(y0), x1=int(x1), y1=int(y1), head=head, hip=hip)

def smooth(a, k=5):
    a = np.asarray(a, float); pad = np.pad(a, (k, k), mode="edge")
    return np.convolve(pad, np.ones(2 * k + 1) / (2 * k + 1), mode="same")[k:-k]

for s in shots:
    cap.set(cv2.CAP_PROP_POS_MSEC, s["in"] * 1000)
    n = int(round(s["dur"] * FPS)) + 1; fr = []; dbg = []
    for i in range(n):
        ok, f = cap.read()
        if not ok: break
        m = mask_of(f); r = analyse(m, s["mode"]) if m is not None else (fr[-1] if fr else None)
        r = dict(r); r["t"] = round(i / FPS, 4); fr.append(r)
        if i % max(1, n // 6) == 0 and len(dbg) < 6:
            d = f.copy(); cv2.rectangle(d, (r["x0"], r["y0"]), (r["x1"], r["y1"]), (0, 255, 255), 3)
            cv2.circle(d, tuple(int(v) for v in r["head"]), 22, (0, 0, 255), 5); cv2.circle(d, tuple(int(v) for v in r["hip"]), 22, (255, 0, 0), 5)
            dbg.append(cv2.resize(d, (640, 360)))
    for key in ("cx", "cy"):                                    # smooth for reframing
        sm = smooth([r[key] for r in fr], 6)
        for r, v in zip(fr, sm): r[key + "_s"] = round(float(v), 1)
    json.dump({"fps": FPS, "src_in": s["in"], "frames": fr}, open(f"{out}/{s['id']}.json", "w"))
    while len(dbg) < 6: dbg.append(np.zeros_like(dbg[0]))
    cv2.imwrite(f"{out}/{s['id']}_debug.jpg", np.vstack([np.hstack(dbg[:3]), np.hstack(dbg[3:])]))
    hy = [r["head"][1] for r in fr]; py = [r["hip"][1] for r in fr]
    print(s["id"], "frames", len(fr), "head-y range", round(max(hy) - min(hy)), "hip-y range", round(max(py) - min(py)))
