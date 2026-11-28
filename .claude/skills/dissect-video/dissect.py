#!/usr/bin/env python3
"""dissect.py: full LOCAL dissection of a video (personal study tool). No cloud models.
Every frame is scanned (motion, brightness, colour, cuts) -> shot list with a keyframe per shot -> on-screen text (OCR) ->
word-timed transcript (Parakeet) -> sound events per 0.5 s (PANNs, 527 AudioSet labels) -> loudness / voice pitch / silences / hits ->
picture+sound sheets for Claude to read -> report.html to browse, plus dissect.json / *.md.

Usage: python3 dissect.py VIDEO OUTDIR [--step 1] [--no-ocr] [--no-tags] [--no-transcript] [--cut 0.30]
Env (auto-detected if unset): OCR_PY (python with rapidocr_onnxruntime), TAG_PY (python with torch+panns_inference), HF_BIN (hyperframes)."""
import argparse, glob, json, os, re, shutil, subprocess, sys, time
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__)); WATCH = os.path.join(os.path.dirname(HERE), "watch-video", "watch.py")
ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("out"); ap.add_argument("--step", type=float, default=1.0); ap.add_argument("--cut", type=float, default=0.30)
ap.add_argument("--no-ocr", action="store_true"); ap.add_argument("--no-tags", action="store_true"); ap.add_argument("--no-transcript", action="store_true")
A = ap.parse_args(); OUT = os.path.abspath(A.out); os.makedirs(OUT, exist_ok=True); src = os.path.abspath(A.src)
def run(cmd, **kw): return subprocess.run(cmd, capture_output=True, text=True, **kw)
def hms(t): t = max(0, t); return f"{int(t // 60):d}:{t % 60:05.2f}"
def find(env, pattern, test):
    if os.environ.get(env): return os.environ[env]
    for p in sorted(glob.glob(pattern)):
        if run([p, "-c", test]).returncode == 0: return p
    return None
T0 = time.time(); log = lambda *a: print(f"[{time.time() - T0:6.1f}s]", *a, flush=True)

# ---------- 1. metadata ----------
pr = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", src]).stdout)
vs = next(s for s in pr["streams"] if s["codec_type"] == "video"); dur = float(pr["format"]["duration"]); W, H = int(vs["width"]), int(vs["height"])
num, den = vs.get("avg_frame_rate", "30/1").split("/"); fps = float(num) / float(den or 1); has_audio = any(s["codec_type"] == "audio" for s in pr["streams"])
log(f"{os.path.basename(src)}: {W}x{H} @ {fps:.2f} fps, {dur:.1f}s, audio={has_audio}")

# ---------- 2. scan EVERY frame (streamed, 128x72 RGB) ----------
sw, sh = 128, 72; nbytes = sw * sh * 3
p = subprocess.Popen(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", src, "-vf", f"scale={sw}:{sh}", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"], stdout=subprocess.PIPE, bufsize=nbytes * 64)
prev = None; prevh = None; motion, bright, meanrgb, hdiff = [], [], [], []
while True:
    buf = p.stdout.read(nbytes)
    if len(buf) < nbytes: break
    f = np.frombuffer(buf, np.uint8).reshape(sh, sw, 3).astype(np.float32); g = f.mean(2)
    h = np.concatenate([np.histogram(f[..., c], 16, (0, 255))[0] for c in range(3)]).astype(np.float32); h /= h.sum()
    motion.append(0.0 if prev is None else float(np.abs(g - prev).mean())); hdiff.append(0.0 if prevh is None else float(0.5 * np.abs(h - prevh).sum()))
    bright.append(float(g.mean())); meanrgb.append([float(x) for x in f.reshape(-1, 3).mean(0)]); prev, prevh = g, h
p.wait(); N = len(motion); motion, bright, hdiff = map(np.array, (motion, bright, hdiff)); meanrgb = np.array(meanrgb); log(f"scanned {N} frames")
# cuts: a big colour-histogram jump AND a big pixel change, not followed/preceded by another within 6 frames (flashes are kept as 'flash')
cuts = []
for i in range(1, N):
    base = np.median(motion[max(1, i - 10): i]) if i > 1 else 0.0
    if (hdiff[i] > A.cut) or (hdiff[i] > A.cut * 0.4 and motion[i] > 8 and motion[i] > 3.5 * base + 2):
        if cuts and i - cuts[-1] < 6: continue
        cuts.append(int(i))
cut_t = [c / fps for c in cuts]

# ---------- 3. shots + keyframes ----------
bounds = [0] + cuts + [N]; shots = []; KF = os.path.join(OUT, "keyframes"); shutil.rmtree(KF, ignore_errors=True); os.makedirs(KF)
for i in range(len(bounds) - 1):
    a, b = bounds[i], bounds[i + 1]
    if b - a < 2: continue
    mid = (a + b) // 2; t = mid / fps; kf = os.path.join(KF, f"shot_{len(shots):04d}_{int(t):05d}.jpg")
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", "-vf", "scale=640:-2", "-q:v", "4", kf])
    rgb = meanrgb[a:b].mean(0); shots.append({"i": len(shots), "start": a / fps, "end": b / fps, "dur": (b - a) / fps, "keyframe": os.path.relpath(kf, OUT), "motion": float(motion[a + 1:b].mean()) if b - a > 1 else 0.0,
        "still_pct": float((motion[a + 1:b] < 0.6).mean() * 100) if b - a > 1 else 100.0, "brightness": float(bright[a:b].mean()), "colour": "#%02x%02x%02x" % tuple(int(x) for x in rgb)})
log(f"{len(shots)} shots, average {dur / max(1, len(shots)):.2f}s")

# ---------- 4. audio measures + sheets (watch.py) ----------
WD = os.path.join(OUT, "watch"); r = run([sys.executable, WATCH, src, WD, "--step", str(A.step), "--cut", str(A.cut)] + (["--no-transcript"] if A.no_transcript else []), timeout=7200)
log("watch:", (r.stdout.strip().splitlines() or ["?"])[-1]); wj = json.load(open(os.path.join(WD, "watch.json"))) if os.path.exists(os.path.join(WD, "watch.json")) else {}
words = wj.get("words", []); loud = np.array(wj.get("loud", []), float); pitch = wj.get("pitch", []); hop = wj.get("hop", 0.05); hits = wj.get("hits", []); sil = wj.get("silences", [])

# ---------- 5. sound events (PANNs, local) ----------
tags = []
if has_audio and not A.no_tags:
    TAG_PY = find("TAG_PY", "/tmp/claude-0/*/*/scratchpad/*/venv/bin/python", "import panns_inference")
    if TAG_PY:
        r = run([TAG_PY, os.path.join(HERE, "tag_audio.py"), os.path.join(WD, "audio.wav"), os.path.join(OUT, "sound_tags.json")], timeout=7200)
        if os.path.exists(os.path.join(OUT, "sound_tags.json")): tags = json.load(open(os.path.join(OUT, "sound_tags.json"))); log(f"sound tags: {len(tags)} windows")
        else: log("sound tags failed:", r.stderr[-300:])
    else: log("sound tags: no python with panns_inference (set TAG_PY)")

# ---------- 6. on-screen text (OCR on every shot keyframe + a frame every 2 s) ----------
ocr = []
if not A.no_ocr:
    OCR_PY = find("OCR_PY", "/tmp/claude-0/*/*/scratchpad/*/bin/python", "import rapidocr_onnxruntime")
    if OCR_PY:
        FD = os.path.join(OUT, "ocr_frames"); shutil.rmtree(FD, ignore_errors=True); os.makedirs(FD)
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", src, "-vf", "fps=0.5,scale=960:-2", "-q:v", "4", os.path.join(FD, "f_%05d.jpg")])
        files = [(i * 2.0, f) for i, f in enumerate(sorted(glob.glob(os.path.join(FD, "f_*.jpg"))))] + [((s["start"] + s["end"]) / 2, os.path.join(OUT, s["keyframe"])) for s in shots]
        json.dump(files, open(os.path.join(OUT, "_ocr_in.json"), "w"))
        code = ("import json,sys\nfrom rapidocr_onnxruntime import RapidOCR\nE=RapidOCR(); F=json.load(open(sys.argv[1])); out=[]\n"
                "for t,f in F:\n  r,_=E(f)\n  for item in (r or []):\n    box=item[0]; txt=str(item[1]); sc=float(item[2])\n    if sc>0.6 and len(txt.strip())>1: out.append([t,txt.strip(),round(sc,2),[[int(x),int(y)] for x,y in box]])\n"
                "json.dump(out,open(sys.argv[2],'w'))")
        r = run([OCR_PY, "-c", code, os.path.join(OUT, "_ocr_in.json"), os.path.join(OUT, "_ocr_out.json")], timeout=7200)
        if os.path.exists(os.path.join(OUT, "_ocr_out.json")):
            raw = sorted(json.load(open(os.path.join(OUT, "_ocr_out.json"))), key=lambda x: x[0]); seen = {}
            for t, txt, sc, box in raw:   # merge the same text seen at nearby times into one span
                k = re.sub(r"\W+", "", txt.lower())
                if k in seen and t - seen[k]["last"] <= 3.0: seen[k]["last"] = t; seen[k]["n"] += 1
                else: seen[k] = {"first": t, "last": t, "text": txt, "n": 1, "y": box[0][1]}; ocr.append(seen[k])
            log(f"on-screen text: {len(ocr)} items")
        else: log("ocr failed:", r.stderr[-300:])
        shutil.rmtree(FD, ignore_errors=True)
    else: log("ocr: no python with rapidocr_onnxruntime (set OCR_PY)")
for f in ("_ocr_in.json", "_ocr_out.json"):
    if os.path.exists(os.path.join(OUT, f)): os.remove(os.path.join(OUT, f))

# ---------- 7. derived: speech/music timeline, per-shot words/text/sounds ----------
def lab(t):
    if not tags: return []
    i = min(len(tags) - 1, max(0, int(t / 0.5))); return tags[i][1]
for s in shots:
    s["words"] = " ".join(w["w"] for w in words if s["start"] <= w["t"] < s["end"])
    s["text"] = [o["text"] for o in ocr if o["first"] < s["end"] and o["last"] >= s["start"]]
    labs = {}
    for t in np.arange(s["start"], s["end"], 0.5):
        for l, p_ in lab(t): labs[l] = max(labs.get(l, 0), p_)
    s["sounds"] = sorted(labs.items(), key=lambda x: -x[1])[:6]
    s["hits"] = [h for h in hits if s["start"] <= h < s["end"]]
    pv = [p_ for p_ in pitch[int(s["start"] / hop): int(s["end"] / hop)] if p_] if pitch else []
    s["pitch"] = [int(np.percentile(pv, 10)), int(np.median(pv)), int(np.percentile(pv, 90))] if len(pv) > 5 else None
    lv = loud[int(s["start"] / hop): int(s["end"] / hop)] if len(loud) else []
    s["loud"] = [round(float(lv.mean()), 1), round(float(lv.max()), 1)] if len(lv) else None
music = [(t, max([p_ for l, p_ in L if l in ("Music", "Musical instrument")] + [0])) for t, L in tags] if tags else []
speech = [(t, max([p_ for l, p_ in L if l == "Speech"] + [0])) for t, L in tags] if tags else []
def spans(series, thr=0.4, gap=1.5):
    out = []
    for t, v in series:
        if v >= thr:
            if out and t - out[-1][1] <= gap: out[-1][1] = t + 0.5
            else: out.append([t, t + 0.5])
    return [o for o in out if o[1] - o[0] >= 1.0]
music_spans, speech_spans = spans(music), spans(speech)
sl = sorted(s["dur"] for s in shots); stats = {"shots": len(shots), "avg_shot": dur / max(1, len(shots)), "median_shot": sl[len(sl) // 2] if sl else 0, "shortest": sl[0] if sl else 0, "longest": sl[-1] if sl else 0,
    "words": len(words), "wpm": len(words) / (dur / 60) if dur else 0, "cuts_per_min": len(shots) / (dur / 60) if dur else 0, "silence_total": sum(e - a for a, e in sil), "music_pct": 100 * sum(e - a for a, e in music_spans) / dur if dur else 0,
    "speech_pct": 100 * sum(e - a for a, e in speech_spans) / dur if dur else 0, "motion_avg": float(motion.mean()), "still_pct": float((motion < 0.6).mean() * 100)}

# ---------- 8. write: dissect.json + markdown + report.html ----------
D = {"src": src, "w": W, "h": H, "fps": fps, "dur": dur, "stats": stats, "shots": shots, "words": words, "text": ocr, "tags": tags, "hits": hits, "silences": sil, "music": music_spans, "speech": speech_spans,
     "frame_motion": [round(float(x), 2) for x in motion], "frame_bright": [round(float(x), 1) for x in bright], "sheets": [os.path.relpath(x, OUT) for x in wj.get("sheets", [])]}
json.dump(D, open(os.path.join(OUT, "dissect.json"), "w"))
M = [f"# Dissection: {os.path.basename(src)}", f"{W}x{H} @ {fps:.2f} fps, {hms(dur)} long. {stats['shots']} shots (avg {stats['avg_shot']:.2f}s, median {stats['median_shot']:.2f}s, shortest {stats['shortest']:.2f}s, longest {stats['longest']:.1f}s), {stats['cuts_per_min']:.1f} cuts/min.",
     f"{stats['words']} words ({stats['wpm']:.0f} wpm). Speech {stats['speech_pct']:.0f}% of the time, music {stats['music_pct']:.0f}%, total silence {stats['silence_total']:.1f}s. Picture still {stats['still_pct']:.0f}% of frames, avg motion {stats['motion_avg']:.2f}.", "",
     "## Shot list (one line per shot: time, length, keyframe, motion, colour, sound, words, on-screen text)"]
for s in shots:
    M.append(f"- **{hms(s['start'])}-{hms(s['end'])}** ({s['dur']:.2f}s) `{s['keyframe']}` motion {s['motion']:.1f} ({s['still_pct']:.0f}% still), colour {s['colour']}, bright {s['brightness']:.0f}"
             + (f", loud {s['loud'][0]}/{s['loud'][1]} dB" if s['loud'] else "") + (f", pitch {s['pitch'][0]}-{s['pitch'][2]} Hz" if s['pitch'] else "") + (f", hits {len(s['hits'])}" if s['hits'] else "")
             + (f"\n  - sounds: {', '.join(f'{l} {p_:.2f}' for l, p_ in s['sounds'])}" if s['sounds'] else "") + (f"\n  - words: {s['words']}" if s['words'] else "") + (f"\n  - text: {' | '.join(s['text'])}" if s['text'] else ""))
open(os.path.join(OUT, "shots.md"), "w").write("\n".join(M))
TR = ["# Transcript (word-timed, Parakeet)", ""]; line, last = [], None
for w in words:
    if last is not None and w["t"] - last > 0.7: TR.append(f"[{hms(line[0]['t'])}] " + " ".join(x["w"] for x in line)); line = []
    line.append(w); last = w["e"]
if line: TR.append(f"[{hms(line[0]['t'])}] " + " ".join(x["w"] for x in line))
open(os.path.join(OUT, "transcript.md"), "w").write("\n".join(TR))
open(os.path.join(OUT, "text_on_screen.md"), "w").write("# On-screen text (OCR)\n\n" + "\n".join(f"- [{hms(o['first'])}-{hms(o['last'])}] {o['text']}" for o in ocr))
SE = ["# Sound events (PANNs AudioSet labels, per 0.5 s; only changes listed)", ""]; prevset = set()
for t, L in tags:
    cur = set(l for l, p_ in L[:3])
    if cur != prevset: SE.append(f"[{hms(t)}] " + ", ".join(f"{l} {p_:.2f}" for l, p_ in L[:4])); prevset = cur
SE += ["", "## Music spans"] + [f"- {hms(a)}-{hms(b)}" for a, b in music_spans] + ["", "## Speech spans"] + [f"- {hms(a)}-{hms(b)}" for a, b in speech_spans] + ["", "## Sudden hits"] + [f"- {hms(h)}" for h in hits] + ["", "## Silences"] + [f"- {hms(a)}-{hms(b)}" for a, b in sil]
open(os.path.join(OUT, "sound_events.md"), "w").write("\n".join(SE))
D.update({"loud_series": [round(float(x), 1) for x in loud], "pitch_series": pitch, "hop": hop})
open(os.path.join(OUT, "report.html"), "w").write(open(os.path.join(HERE, "report.html")).read().replace("__DATA__", json.dumps(D).replace("</", "<\\/")))
log(f"OK -> {OUT}/report.html, shots.md, transcript.md, text_on_screen.md, sound_events.md, dissect.json, keyframes/, watch/sheets/")
