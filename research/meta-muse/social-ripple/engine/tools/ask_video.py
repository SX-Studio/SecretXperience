"""Ask Gemini about a local video (inline mp4, keep it under ~18 MB: downscale first). Usage: python -I ask_video.py VIDEO.mp4 PROMPTFILE OUT"""
import base64, json, sys, time, urllib.request
vid, pf, out = sys.argv[1:4]
body = {"contents": [{"parts": [{"inline_data": {"mime_type": "video/mp4", "data": base64.b64encode(open(vid, "rb").read()).decode()}}, {"text": open(pf).read()}]}], "generationConfig": {"thinkingConfig": {"thinkingLevel": "low"}}}
for m in ["gemini-3-flash-preview", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"] * 2:
    try:
        req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent", json.dumps(body).encode(), {"Content-Type": "application/json"})
        j = json.load(urllib.request.urlopen(req, timeout=600)); t = "".join(p.get("text", "") for p in j["candidates"][0]["content"]["parts"] if not p.get("thought"))
        if len(t) > 200: open(out, "w").write(t); print("ok", m); break
    except Exception as e: print("retry", m, e, file=sys.stderr); time.sleep(5)
else: print("FAIL")
