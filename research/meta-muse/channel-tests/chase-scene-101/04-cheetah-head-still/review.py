import json, urllib.request, sys
PROMPT = """You are a demanding YouTube Shorts editor reviewing a finished 41-second educational wildlife Short before upload. Watch and LISTEN carefully. Report concisely:
1. Audio: is any narration cut off, clipped, overlapping, or rushed? Does the final line finish completely, and does the ending feel complete or abrupt? Music/voice balance; any harsh or distracting sound effects (give timestamps).
2. Sync: do on-screen graphics (tracked reticles, labels, the spine line, airborne stamp, bars, inner-ear diagram) appear on the matching words? Any overlay that drifts off the animal or covers something important (timestamps)?
3. Captions: any caption that doesn't match the speech, or overlaps other text?
4. Visual quality: any glitches, blank frames, jarring cuts, unreadable text, layout collisions (timestamps).
5. Accuracy: anything shown or said that seems wrong or misleading?
6. Retention: rate the hook (first 2 s) and overall 1-10, and give the 3 most valuable fixes, most important first. Be specific; say 'none' where nothing is wrong."""
body = {"contents": [{"parts": [{"file_data": {"mime_type": "video/mp4", "file_uri": sys.argv[1]}}, {"text": PROMPT}]}],
        "generationConfig": {"thinkingConfig": {"thinkingLevel": "low"}}}
for model in ["gemini-3-flash-preview", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.7-flash", "gemini-3.5-flash-lite"]:
    try:
        req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
        text = ""
        with urllib.request.urlopen(req, timeout=600) as r:
            for line in r:
                line = line.decode().strip()
                if line.startswith("data:"):
                    for c in json.loads(line[5:]).get("candidates", []):
                        for p in c.get("content", {}).get("parts", []):
                            if not p.get("thought"): text += p.get("text", "")
        if len(text) > 200: print("MODEL", model); print(text); break
    except Exception as e:
        print("err", model, getattr(e, "code", ""), str(e)[:100])
