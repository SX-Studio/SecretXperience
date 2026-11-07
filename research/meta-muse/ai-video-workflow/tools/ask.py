"""Ask Gemini about a YouTube video (optionally a segment). Usage: python -I ask.py VID PROMPTFILE OUT [START END FPS]"""
import json, sys, time, urllib.request
MODELS = ["gemini-3-flash-preview", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"]
vid, pf, out = sys.argv[1:4]
part = {"file_data": {"file_uri": f"https://www.youtube.com/watch?v={vid}"}}
if len(sys.argv) > 4:
    a, b, fps = sys.argv[4:7]
    part["video_metadata"] = {"start_offset": f"{a}s", "end_offset": f"{b}s", "fps": float(fps)}
body = {"contents": [{"parts": [part, {"text": open(pf).read()}]}], "generationConfig": {"thinkingConfig": {"thinkingLevel": "low"}, "mediaResolution": "MEDIA_RESOLUTION_HIGH"}}
for m in MODELS * 3:
    try:
        req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent", json.dumps(body).encode(), {"Content-Type": "application/json"})
        j = json.load(urllib.request.urlopen(req, timeout=900))
        c = j["candidates"][0]
        t = "".join(p.get("text", "") for p in c["content"]["parts"] if not p.get("thought"))
        if c.get("finishReason") == "STOP" and len(t) > 300:
            open(out, "w").write(t); print("ok", m, len(t.split()), "words", out); break
    except Exception as e:
        det = ""
        try: det = e.read().decode()[:160]
        except Exception: pass
        print("retry", m, e, det, file=sys.stderr); time.sleep(5)
else:
    print("FAIL", out)
