#!/usr/bin/env python3
"""watch.py: turn a video into something Claude can actually perceive, the way a viewer would: timestamped picture
sheets (every N s plus every cut), a view of the sound (loudness curve + spectrogram per window, with cuts, hits and
silences marked), a word-timed transcript, and one timeline.md tying it all together.

Usage:
  python3 watch.py SOURCE OUTDIR [--step S] [--start A] [--end B] [--no-transcript] [--ears]
  SOURCE: a local video file, or a URL (tries yt-dlp; YouTube may need cookies, see SKILL.md).
  --step   seconds between sampled frames (default: auto by duration: 0.5 / 1 / 2 / 4)
  --start/--end  watch only a segment (use small --step, e.g. 0.1-0.2, to study motion/acting frame by frame)
  --ears   also ask Gemini to listen (voice tone, music mood, sound effects with timestamps) -> ears.md
Needs: ffmpeg/ffprobe, numpy, Pillow. Transcript uses `hyperframes transcribe` (Parakeet) if available.
"""
import argparse, json, os, re, subprocess, sys, shutil, glob, base64, time, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFont

FONT = next((f for f in ["/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"] if os.path.exists(f)), None)
def font(sz): return ImageFont.truetype(FONT, sz) if FONT else ImageFont.load_default()
def run(cmd, **kw): return subprocess.run(cmd, capture_output=True, text=True, **kw)
def hms(t): t = max(0, t); return f"{int(t // 60):d}:{t % 60:05.2f}"

ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("out"); ap.add_argument("--step", type=float); ap.add_argument("--start", type=float, default=0.0)
ap.add_argument("--end", type=float); ap.add_argument("--no-transcript", action="store_true"); ap.add_argument("--ears", action="store_true"); ap.add_argument("--cut", type=float, default=0.27)
A = ap.parse_args(); OUT = os.path.abspath(A.out); os.makedirs(OUT, exist_ok=True)

# ---------- 0. get the file ----------
src = A.src
if re.match(r"https?://", src):
    dst = os.path.join(OUT, "source.%(ext)s")
    ck = ["--cookies", os.environ["YTDLP_COOKIES"]] if os.environ.get("YTDLP_COOKIES") else []
    r = run(["yt-dlp", "-q", "-f", "best[height<=720]/best", *ck, "-o", dst, src], timeout=900)
    got = glob.glob(os.path.join(OUT, "source.*"))
    if not got:
        print("DOWNLOAD FAILED:", (r.stderr or "").strip().splitlines()[-1:] or "", "\nFallback: ask the user for the file, set YTDLP_COOKIES=cookies.txt, or use Gemini's YouTube reader (SKILL.md).")
        sys.exit(2)
    src = got[0]
pr = json.loads(run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", src]).stdout)
dur = float(pr["format"]["duration"]); vs = next((s for s in pr["streams"] if s["codec_type"] == "video"), None); has_audio = any(s["codec_type"] == "audio" for s in pr["streams"])
t0 = max(0.0, A.start); t1 = min(dur, A.end) if A.end else dur; span = t1 - t0
step = A.step or (0.5 if span <= 75 else 1.0 if span <= 400 else 2.0 if span <= 1200 else 4.0)
W, H = int(vs["width"]), int(vs["height"]); portrait = H > W
print(f"video {W}x{H} {dur:.1f}s audio={has_audio} window {t0:.1f}-{t1:.1f}s step {step}s")
seg = ["-ss", f"{t0}", "-to", f"{t1}"]

# ---------- 1. cuts (scene changes) ----------
r = run(["ffmpeg", "-hide_banner", *seg, "-i", src, "-vf", f"select='gt(scene,{A.cut})',showinfo", "-an", "-f", "null", "-"])
cuts = [t0 + float(m) for m in re.findall(r"pts_time:([\d.]+)", r.stderr)]
cuts = [c for i, c in enumerate(cuts) if i == 0 or c - cuts[i - 1] > 0.25]

# ---------- 2. frames: every `step` s, plus the first frame after every cut ----------
FR = os.path.join(OUT, "frames"); shutil.rmtree(FR, ignore_errors=True); os.makedirs(FR)
tw = 360 if portrait else 480
run(["ffmpeg", "-hide_banner", "-loglevel", "error", *seg, "-i", src, "-vf", f"fps=1/{step},scale={tw}:-2", "-q:v", "3", os.path.join(FR, "s_%05d.jpg")])
frames = [(t0 + (i) * step, f) for i, f in enumerate(sorted(glob.glob(os.path.join(FR, "s_*.jpg"))))]
for k, c in enumerate(cuts):
    f = os.path.join(FR, f"c_{k:04d}.jpg"); run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", f"{c + 0.06}", "-i", src, "-frames:v", "1", "-vf", f"scale={tw}:-2", "-q:v", "3", f])
    if os.path.exists(f): frames.append((c + 0.06, f, "CUT"))
frames = sorted([fr if len(fr) == 3 else (fr[0], fr[1], "") for fr in frames], key=lambda x: x[0])

# ---------- 3. audio: loudness, silences, hits, spectrogram ----------
lou = np.zeros(0); HOP = 0.05; hits = []; sil = []; sr = 16000
if has_audio:
    raw = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", *seg, "-i", src, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32); n = int(HOP * sr); m = len(a) // n
    if m:
        fr_ = a[: m * n].reshape(m, n); rms = np.sqrt((fr_ ** 2).mean(1) + 1e-12); lou = 20 * np.log10(rms + 1e-9)
        # hits: sudden jumps above the recent level (sound effects, impacts, music hits)
        for i in range(6, m):
            base = np.median(lou[max(0, i - 8): i]);
            if lou[i] - base > 9 and lou[i] > np.percentile(lou, 40) and (not hits or (t0 + i * HOP) - hits[-1] > 0.25): hits.append(t0 + i * HOP)
        # silences (relative to this video's level)
        thr = np.percentile(lou, 95) - 35; quiet = lou < thr; i = 0
        while i < m:
            if quiet[i]:
                j = i
                while j < m and quiet[j]: j += 1
                if (j - i) * HOP >= 0.4: sil.append((t0 + i * HOP, t0 + j * HOP))
                i = j
            else: i += 1
        wav = os.path.join(OUT, "audio.wav"); run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *seg, "-i", src, "-ac", "1", "-ar", "16000", wav])

# ---------- 3b. motion (how much the picture moves, 10x per second) + voice pitch (intonation) ----------
MH = 0.1; raw = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", *seg, "-i", src, "-vf", f"fps={1 / MH},scale=96:54,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
g = np.frombuffer(raw, np.uint8).reshape(-1, 54, 96).astype(np.float32) if raw else np.zeros((0, 54, 96))
motion = np.concatenate([[0], np.abs(np.diff(g, axis=0)).mean((1, 2))]) if len(g) > 1 else np.zeros(len(g))
cutset = [int((c - t0) / MH) for c in cuts]; motion = motion.copy()
for ci in cutset:
    for k in (ci, ci + 1):
        if 0 <= k < len(motion): motion[k] = 0          # a cut is not motion
pitch = np.full(len(lou), np.nan)
if has_audio and len(lou):
    n = int(HOP * sr)
    for i in range(len(lou)):
        if lou[i] < np.percentile(lou, 55): continue
        x = a[i * n: i * n + n]; x = x - x.mean(); c = np.correlate(x, x, "full")[len(x) - 1:]
        lo_, hi_ = int(sr / 400), int(sr / 75)               # 75-400 Hz: human voice range
        if hi_ >= len(c) or c[0] <= 0: continue
        k = lo_ + int(np.argmax(c[lo_:hi_])); 
        if c[k] / c[0] > 0.45: pitch[i] = sr / k
# ---------- 4. transcript (word timings) ----------
words = []
if has_audio and not A.no_transcript:
    hf = os.environ.get("HF_BIN") or shutil.which("hyperframes") or next(iter(glob.glob("/root/.npm/_npx/*/node_modules/.bin/hyperframes")), None)
    if hf:
        env = dict(os.environ); env.setdefault("HYPERFRAMES_PYTHON", next(iter(glob.glob("/tmp/claude-0/*/*/scratchpad/venv/bin/python")), ""))
        r = run([hf, "transcribe", os.path.join(OUT, "audio.wav"), "--json"], env=env, timeout=1800)
        for line in (r.stdout + "\n" + r.stderr).splitlines():
            if '"type":"words"' in line:
                try: d = json.loads(line[line.index("{"):]); words += [{"t": t0 + w["start"], "e": t0 + w["end"], "w": w["text"]} for w in d.get("words", [])]
                except Exception as e: print("transcript parse:", e)
        words.sort(key=lambda w: w["t"])
        if not words: print(f"transcript: none (rc {r.returncode}, out {len(r.stdout)} chars, err tail: {(r.stderr or '')[-300:]})")
    else: print("transcript: hyperframes not found (set HF_BIN)")

# ---------- 5. sheets: each window = 4x4 frames + its sound strip (loudness + spectrogram) ----------
SH = os.path.join(OUT, "sheets"); shutil.rmtree(SH, ignore_errors=True); os.makedirs(SH)
cols, rows = (6, 2) if portrait else (4, 4); per = cols * rows
fw = tw; fh = int(round(tw * H / W / 2) * 2); pad = 4
windows = [frames[i: i + per] for i in range(0, len(frames), per)]
def spectro(a_, b_, wpx, hpx):
    if not has_audio: return None
    p = os.path.join(OUT, "_spec.png")
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{a_}", "-to", f"{max(b_, a_ + 0.2)}", "-i", src, "-lavfi", f"showspectrumpic=s={wpx}x{hpx}:legend=0:scale=log:fscale=log:color=intensity", p])
    return Image.open(p).convert("RGB").resize((wpx, hpx)) if os.path.exists(p) else None
sheet_info = []
for wi, win in enumerate(windows):
    a_, b_ = win[0][0], (windows[wi + 1][0][0] if wi + 1 < len(windows) else t1)
    SW, gridH = cols * (fw + pad) + pad, rows * (fh + 24 + pad) + pad; stripH = 150; img_extra = 26
    img = Image.new("RGB", (SW, gridH + stripH + 30 + 26), (18, 16, 24)); d = ImageDraw.Draw(img)
    for k, (t, f, tag) in enumerate(win):
        x, y = pad + (k % cols) * (fw + pad), pad + (k // cols) * (fh + 24 + pad)
        try: im = Image.open(f).convert("RGB").resize((fw, fh)); img.paste(im, (x, y + 24))
        except Exception: pass
        d.rectangle([x, y, x + fw, y + 22], fill=(200, 60, 60) if tag else (40, 36, 52)); d.text((x + 6, y + 2), f"{hms(t)} {tag}", fill=(255, 255, 255), font=font(16))
    # sound strip: spectrogram + loudness line + markers
    y0 = gridH + 26; sp = spectro(a_, b_, SW - 2 * pad, stripH - 4)
    if sp: img.paste(sp, (pad, y0))
    if len(lou):
        i0, i1 = int((a_ - t0) / HOP), int((b_ - t0) / HOP); seg_l = lou[i0:i1]
        if len(seg_l) > 1:
            lo, hi = np.percentile(lou, 2), lou.max() + 1; pts = [(pad + (SW - 2 * pad) * k / (len(seg_l) - 1), y0 + stripH - 4 - (stripH - 8) * (v - lo) / (hi - lo)) for k, v in enumerate(seg_l)]
            d.line(pts, fill=(255, 230, 120), width=2)
        # voice pitch dots (higher = higher voice): shows emphasis, rising questions, a cracking or flat delivery
        ps = pitch[i0:i1]
        for k, v in enumerate(ps):
            if not np.isnan(v): yy = y0 + stripH - 6 - (stripH - 12) * (np.log(v) - np.log(75)) / (np.log(400) - np.log(75)); xx = pad + (SW - 2 * pad) * k / max(1, len(ps) - 1); d.ellipse([xx - 2, yy - 2, xx + 2, yy + 2], fill=(90, 255, 200))
    if len(motion):
        j0, j1 = int((a_ - t0) / MH), int((b_ - t0) / MH); mv = motion[j0:j1]
        if len(mv) > 1:
            mx = max(1.5, np.percentile(motion, 99)); pts = [(pad + (SW - 2 * pad) * k / (len(mv) - 1), y0 + stripH + 22 - 18 * min(1, v / mx)) for k, v in enumerate(mv)]
            d.line(pts, fill=(120, 255, 120), width=2)
    X = lambda t: pad + (SW - 2 * pad) * (t - a_) / max(1e-6, b_ - a_)
    for c in cuts:
        if a_ <= c < b_: d.line([X(c), y0, X(c), y0 + stripH], fill=(255, 80, 80), width=2)
    for h in hits:
        if a_ <= h < b_: d.polygon([(X(h) - 6, y0), (X(h) + 6, y0), (X(h), y0 + 10)], fill=(120, 220, 255))
    for s_, e_ in sil:
        if e_ > a_ and s_ < b_: d.rectangle([X(max(s_, a_)), y0 + stripH - 10, X(min(e_, b_)), y0 + stripH - 4], fill=(150, 150, 150))
    d.text((pad, gridH + 4), f"SOUND {hms(a_)}-{hms(b_)}   yellow=loudness  mint dots=voice pitch  red=cut  blue=hit  grey=silence | green line below=MOTION", fill=(220, 220, 220), font=font(15))
    p = os.path.join(SH, f"sheet_{wi:03d}_{int(a_):04d}s.jpg"); img.save(p, quality=85); sheet_info.append((a_, b_, p))
if os.path.exists(os.path.join(OUT, "_spec.png")): os.remove(os.path.join(OUT, "_spec.png"))

# ---------- 6. optional: Gemini listens (it hears audio natively) ----------
ears = ""
if A.ears and has_audio:
    mp3 = os.path.join(OUT, "audio.mp3"); run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", os.path.join(OUT, "audio.wav"), "-b:a", "64k", mp3])
    prompt = ("Listen to this whole soundtrack like an attentive viewer. Give a timestamped log (mm:ss) of: every voice (who/what kind, emotion, pace, emphasis, pauses), "
              "music (genre, mood, instruments, when it starts/stops/swells/drops), every sound effect (what it is), ambience, silences, and the mix balance. Then 5 observations about how the sound tells the story.")
    body = {"contents": [{"parts": [{"inline_data": {"mime_type": "audio/mpeg", "data": base64.b64encode(open(mp3, "rb").read()).decode()}}, {"text": prompt}]}]}
    for mdl in ["gemini-3-flash-preview", "gemini-3.5-flash", "gemini-3.6-flash"] * 2:
        try:
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{mdl}:generateContent", json.dumps(body).encode(), {"Content-Type": "application/json"})
            j = json.load(urllib.request.urlopen(req, timeout=600)); ears = "".join(p.get("text", "") for p in j["candidates"][0]["content"]["parts"] if not p.get("thought"))
            if len(ears) > 200: open(os.path.join(OUT, "ears.md"), "w").write(ears); break
        except Exception as e: print("ears retry", mdl, e); time.sleep(5)

# ---------- 7. timeline.md ----------
L = [f"# Watch report: {os.path.basename(A.src)}", f"{W}x{H}, {dur:.1f}s total, watched {hms(t0)}-{hms(t1)}, a frame every {step}s plus every cut.",
     f"Cuts: {len(cuts)} (average shot {span / max(1, len(cuts) + 1):.1f}s). Hits/SFX onsets: {len(hits)}. Silences >=0.4s: {len(sil)}." + (f" Loudness range {np.percentile(lou, 5):.0f}..{lou.max():.0f} dBFS." if len(lou) else ""),
     "", "How to watch: open each sheet in order (Read the image), then read its window below. Frames are what a viewer sees; the strip under them is the sound.", ""]
for a_, b_, p in sheet_info:
    L.append(f"## {hms(a_)} - {hms(b_)}   ->  {os.path.relpath(p, OUT)}")
    cs = [hms(c) for c in cuts if a_ <= c < b_]; hs = [hms(h) for h in hits if a_ <= h < b_]; ss = [f"{hms(s_)}-{hms(e_)}" for s_, e_ in sil if e_ > a_ and s_ < b_]
    if cs: L.append(f"- cuts: {', '.join(cs)}")
    if hs: L.append(f"- sound hits: {', '.join(hs)}")
    if ss: L.append(f"- silence: {', '.join(ss)}")
    if len(lou):
        segl = lou[int((a_ - t0) / HOP): int((b_ - t0) / HOP)]
        if len(segl): L.append(f"- loudness: avg {segl.mean():.0f} dB, peak {segl.max():.0f} dB")
        pv = pitch[int((a_ - t0) / HOP): int((b_ - t0) / HOP)]; pv = pv[~np.isnan(pv)]
        if len(pv) > 5: L.append(f"- voice pitch: median {np.median(pv):.0f} Hz, range {np.percentile(pv, 10):.0f}-{np.percentile(pv, 90):.0f} Hz (wider = more expressive)")
    if len(motion):
        mv = motion[int((a_ - t0) / MH): int((b_ - t0) / MH)]
        if len(mv): busiest = a_ + MH * int(np.argmax(mv)); L.append(f"- motion: avg {mv.mean():.1f}, still {100 * (mv < 0.6).mean():.0f}% of the time, most movement at {hms(busiest)}")
    ws = [w for w in words if a_ <= w["t"] < b_]
    if ws:
        line, out_, last = [], [], None
        for w in ws:
            if last is not None and w["t"] - last > 0.6: out_.append(f"[{hms(line[0]['t'])}] " + " ".join(x["w"] for x in line)); line = []
            line.append(w); last = w["e"]
        if line: out_.append(f"[{hms(line[0]['t'])}] " + " ".join(x["w"] for x in line))
        L += ["- words:"] + [f"  - {o}" for o in out_]
    L.append("")
if ears: L += ["## What Gemini heard (ears.md)", "See ears.md for the full listening log."]
open(os.path.join(OUT, "timeline.md"), "w").write("\n".join(L)); json.dump({"t0": t0, "t1": t1, "dur": dur, "w": W, "h": H, "src": os.path.abspath(src), "cuts": cuts, "hits": hits, "silences": sil, "words": words, "sheets": [p for _, _, p in sheet_info], "hop": HOP, "loud": [round(float(x), 1) for x in lou], "pitch": [None if np.isnan(x) else round(float(x)) for x in pitch], "mhop": MH, "motion": [round(float(x), 2) for x in motion]}, open(os.path.join(OUT, "watch.json"), "w"))
print(f"OK {len(sheet_info)} sheets, {len(frames)} frames, {len(cuts)} cuts, {len(words)} words -> {OUT}/timeline.md")
