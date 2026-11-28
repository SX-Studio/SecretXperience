#!/usr/bin/env python3
"""Remote dissection of a PUBLIC YouTube video through Google's Gemini API (Gemini reads YouTube itself; nothing is downloaded).
Splits the video into chunks and asks for a detailed, timestamped dissection of each, then merges them.
Usage: python3 remote.py VIDEO_ID_OR_URL OUTDIR [--chunk 120] [--fps 2] [--dur SECONDS]"""
import argparse, json, os, re, sys, time, urllib.request
ap = argparse.ArgumentParser(); ap.add_argument("vid"); ap.add_argument("out"); ap.add_argument("--chunk", type=int, default=120); ap.add_argument("--fps", type=float, default=2.0); ap.add_argument("--dur", type=float)
A = ap.parse_args(); os.makedirs(A.out, exist_ok=True)
m = re.search(r"(?:v=|youtu\.be/|shorts/)([\w-]{11})", A.vid); vid = m.group(1) if m else A.vid
MODELS = ["gemini-3-flash-preview", "gemini-3.5-flash", "gemini-3.6-flash"]
def ask(parts, tries=6):
    body = {"contents": [{"parts": parts}], "generationConfig": {"thinkingConfig": {"thinkingLevel": "low"}, "mediaResolution": "MEDIA_RESOLUTION_MEDIUM"}}
    for k in range(tries):
        mdl = MODELS[k % len(MODELS)]
        try:
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{mdl}:generateContent", json.dumps(body).encode(), {"Content-Type": "application/json"})
            j = json.load(urllib.request.urlopen(req, timeout=900)); t = "".join(p.get("text", "") for p in j["candidates"][0]["content"]["parts"] if not p.get("thought"))
            if len(t) > 100: return t
        except Exception as e: print("retry", mdl, str(e)[:120], file=sys.stderr); time.sleep(15 + 10 * k)
    return ""
yt = {"file_data": {"file_uri": f"https://www.youtube.com/watch?v={vid}"}}
dur = A.dur
if not dur:
    t = ask([dict(yt, video_metadata={"fps": 0.2}), {"text": "Reply with ONLY the total duration of this video in seconds as a number."}])
    dur = float(re.findall(r"[\d.]+", t)[0]) if re.findall(r"[\d.]+", t) else 600
print("duration", dur)
P = """You are dissecting this video segment for a small animated story channel that wants to learn its craft. The segment is {a}-{b} s of the full video; use ABSOLUTE timestamps (mm:ss) of the full video.
Be exhaustive and literal, no generic praise. Output these sections:
1. TRANSCRIPT: verbatim narration and dialogue with a timestamp per sentence; mark speaker, and in [brackets] tone/emotion/pace changes, pauses, emphasis.
2. SHOTS: every cut. One line per shot: start-end, shot size (EWS/WS/MS/CU/ECU), camera move (static/push/pull/pan/tilt/whip/shake/zoom), transition, what is on screen, who/what is the focus.
3. ON-SCREEN TEXT & GRAPHICS: every caption, label, card, UI, symbol, with time, style and purpose.
4. CHARACTERS & ACTING: every expression change (time, from->to, how fast), poses, gestures, staging, FX on faces.
5. VISUAL STORYTELLING: every visual metaphor, symbol, motif, match cut, colour/lighting change and what it means.
6. SOUND: music (start/stop/change/mood), every sound effect with time, silences, ambience.
7. STORY: beats in this segment, open loops/questions raised or answered, re-hooks, stakes changes.
8. 3 techniques from this segment we should copy, each with timestamp."""
segs = []; a = 0
while a < dur:
    b = min(dur, a + A.chunk); out = os.path.join(A.out, f"seg_{int(a):05d}.md")
    if not (os.path.exists(out) and os.path.getsize(out) > 500):
        t = ask([dict(yt, video_metadata={"start_offset": f"{int(a)}s", "end_offset": f"{int(b)}s", "fps": A.fps}), {"text": P.format(a=int(a), b=int(b))}])
        open(out, "w").write(f"# Segment {int(a)}-{int(b)} s\n\n{t}\n"); print("segment", int(a), len(t), "chars"); time.sleep(8)
    segs.append(out); a = b
full = "\n\n".join(open(s).read() for s in segs); open(os.path.join(A.out, "dissection_full.md"), "w").write(full)
S = ask([{"text": "Below is a segment-by-segment dissection of one video. Write the overall dissection: logline; full beat sheet with timestamps; structure lengths; average shot length and pacing changes; narration techniques; the visual-storytelling system (recurring devices, colour script); character acting patterns; sound design system; retention mechanics (open loops, re-hooks with timestamps); how the ending pays off the opening; and the 15 most transferable rules for an animated psychology story channel, ranked, each with a concrete example. \n\n" + full[:900000]}])
open(os.path.join(A.out, "dissection_summary.md"), "w").write(S); print("OK", A.out)
