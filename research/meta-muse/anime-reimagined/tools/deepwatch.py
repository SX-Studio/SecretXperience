"""Segmented Gemini watch for reverse-engineering AI anime-to-live-action videos.
Usage: python -I deepwatch.py OUTDIR ID:DURATION [ID:DURATION...]"""
import json, sys, time, pathlib, urllib.request
from concurrent.futures import ThreadPoolExecutor
MODELS = ["gemini-3-flash-preview", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.7-flash", "gemini-3.5-flash-lite"]
SEG = 100
PROMPT = """You are a senior VFX supervisor and AI-video producer reverse-engineering this fan-made "anime reimagined as 80s live-action" video (segment {a}-{b}). We want to learn how it is made so we can produce ORIGINAL videos of the same quality (we will not copy this one). Watch and listen closely. Report, concretely, with timestamps:
1. SHOT LIST: every shot in this segment: timestamp, duration, shot size (ECU/CU/MCU/MS/WS), camera move (static/push/pan/handheld/dolly/orbit), subject + action, how it cuts to the next (hard cut, dissolve, match cut, whip).
2. GENERATION FORENSICS per shot: is it a still image with a camera move (Ken Burns/parallax), an AI image-to-video clip, a text-to-video clip, or a composite? Evidence: how faces/hands/cloth/hair behave, morphing, frame-rate feel, loop/boomerang, slow-motion retiming, camera physics, lip-sync quality, consistent character identity across shots. Which generator family does it look like (e.g. Kling, Veo, Seedance, Sora, Wan, Runway, Hailuo) and why.
3. LOOK: the "80s film" treatment: grain, halation/bloom, gate weave, scanlines/CRT curvature, color grade (teal/orange? faded blacks? warm highlights?), letterbox/aspect (this is 4:3 1440x1080), vignette, lens flares, chromatic aberration, dust/scratches, frame rate (24p? duplicated frames?), motion blur. Costume/makeup/prosthetic style (practical-effects look?), lighting style, set design cues.
4. CHARACTER FIDELITY: how the anime characters are translated to realistic humans (hair color, costume, physique, face), and how consistent each character stays across shots (identity drift?). Any text, logos, weapons, VFX (energy, fire, impacts) and how they look.
5. AUDIO: music (genre, instruments, synthwave? orchestral? tempo), whether it is a cover/remix of the anime theme, SFX (impacts, whooshes, ambience), dialogue (any lip-synced lines? language? voice quality, AI voice?), mix balance.
6. EDITING RHYTHM: average shot length, how action beats are built (anticipation, impact, reaction), use of speed ramps, slow-mo, freeze frames, title cards, on-screen text, chapter structure.
7. What is the single most impressive technique in this segment, and the weakest point (where the AI shows).
Be specific and dense; use timestamps throughout."""
def mmss(s): return f"{int(s)//60:02d}:{int(s)%60:02d}"
def stream(model, vid, a, b):
    part = {"file_data": {"file_uri": f"https://www.youtube.com/watch?v={vid}"}, "video_metadata": {"start_offset": f"{a}s", "end_offset": f"{b}s", "fps": 2}}
    body = {"contents": [{"parts": [part, {"text": PROMPT.format(a=mmss(a), b=mmss(b))}]}], "generationConfig": {"thinkingConfig": {"thinkingLevel": "low"}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    text, fin = "", None
    with urllib.request.urlopen(req, timeout=900) as r:
        for line in r:
            line = line.decode("utf-8", "replace").strip()
            if not line.startswith("data:"): continue
            d = json.loads(line[5:])
            for c in d.get("candidates", []):
                fin = c.get("finishReason") or fin
                for p in c.get("content", {}).get("parts", []):
                    if not p.get("thought"): text += p.get("text", "")
    return text, fin
out = pathlib.Path(sys.argv[1]); out.mkdir(exist_ok=True); dead = set()
jobs = []
for spec in sys.argv[2:]:
    vid, dur = spec.split(":"); dur = int(dur)
    for a in range(0, dur, SEG): jobs.append((vid, a, min(dur, a + SEG)))
def run(job):
    vid, a, b = job; dest = out / f"{vid}.{a:04d}.md"
    if dest.exists() and dest.stat().st_size > 1500: return f"skip {vid} {a}"
    for m in MODELS * 3:
        if m in dead: continue
        try:
            t, fin = stream(m, vid, a, b)
            if fin == "STOP" and len(t.split()) > 120:
                dest.write_text(f"## {vid} segment {mmss(a)}-{mmss(b)}\n\n{t}\n"); return f"ok {vid} {a} {m} {len(t.split())}w"
        except Exception as e:
            det = ""
            try: det = e.read().decode()[:200]
            except Exception: pass
            if "PerDay" in det or getattr(e, "code", 0) == 404: dead.add(m)
            time.sleep(4)
    return f"FAIL {vid} {a}"
with ThreadPoolExecutor(2) as ex:
    for r in ex.map(run, jobs): print(r, flush=True)
