"""AI thumbnail review: python -I review.py PREMISE_FILE THUMB.png [THUMB2.png ...] → prints a critique per thumbnail.
The reviewer sees each thumbnail at full size and at phone size, and is told the premise only AFTER guessing it."""
import base64, json, sys, time, urllib.request, subprocess, os
prem = open(sys.argv[1]).read().strip()
def ask(parts):
    body = {"contents": [{"parts": parts}], "generationConfig": {"thinkingConfig": {"thinkingLevel": "low"}}}
    for m in ["gemini-3-flash-preview", "gemini-3.5-flash", "gemini-3.6-flash"] * 2:
        try:
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent", json.dumps(body).encode(), {"Content-Type": "application/json"})
            j = json.load(urllib.request.urlopen(req, timeout=300)); return "".join(p.get("text", "") for p in j["candidates"][0]["content"]["parts"] if not p.get("thought"))
        except Exception as e: print("retry", m, e, file=sys.stderr); time.sleep(5)
    return "FAIL"
img = lambda f: {"inline_data": {"mime_type": "image/png", "data": base64.b64encode(open(f, "rb").read()).decode()}}
for t in sys.argv[2:]:
    ph = t.replace(".png", "_phone.png")
    if not os.path.exists(ph): subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", t, "-vf", "scale=246:138", ph])
    q = f"""You are a YouTube thumbnail expert for animated 'What If...?' story channels. Image 1 is a thumbnail at full size; image 2 is the same thumbnail at phone size (as most viewers see it).
STEP 1 (before reading the premise below): in one sentence, what do you think this video is about, judging ONLY from the phone-size image?
STEP 2: The real premise is: "{prem}". Score 1-10 for each: (a) concept clarity: does it portray this premise at a glance; (b) fills the frame: no empty/dead areas; (c) phone-size readability of the text and hero face; (d) click curiosity. 
STEP 3: List the 3 most important concrete fixes (positions, sizes, what to add or remove). Under 180 words."""
    print("=====", os.path.basename(t)); print(ask([img(t), img(ph), {"text": q}]))
