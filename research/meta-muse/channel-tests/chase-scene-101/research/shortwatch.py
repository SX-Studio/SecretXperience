"""Gemini watches competitor Shorts and returns a production breakdown. Usage: python -I shortwatch.py outdir ID [ID...]"""
import json, sys, time, pathlib, urllib.request
MODELS = ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3-flash-preview", "gemini-3.5-flash-lite"]
PROMPT = """You are a YouTube Shorts producer reverse-engineering this Short so we can make original videos in the same format (we will NOT copy it).
Report, concisely and concretely:
1. DURATION and LOOP: exact length; does the last frame/line loop seamlessly into the first?
2. VISUAL SOURCE: real camera footage (wildlife/documentary/phone)? AI-generated video (signs: morphing, too-smooth, impossible camera)? 3D animation? Stock? Still images? Be specific and say how confident you are.
3. SHOT LIST with timestamps: each shot, what is seen, camera move, cut speed.
4. TEXT ON SCREEN: hook text/title overlay (exact words, position, font style, colours), captions style (word-by-word? size? position?).
5. AUDIO: voiceover? (voice type: AI/human, gender, accent, pace in words/sec, tone) exact transcript of the narration; music (genre/mood); sound effects.
6. HOOK: what happens in the first 1.5 seconds that stops the scroll.
7. STRUCTURE: hook -> payoff pattern; where the 'why' answer lands; any question left open.
8. Why you think this got millions of views (retention mechanics)."""
def stream(model, vid):
    body = {"contents": [{"parts": [{"file_data": {"file_uri": f"https://www.youtube.com/watch?v={vid}"}}, {"text": PROMPT}]}],
            "generationConfig": {"thinkingConfig": {"thinkingLevel": "low"}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent?alt=sse",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}, method="POST")
    text, fin = "", None
    with urllib.request.urlopen(req, timeout=600) as r:
        for line in r:
            line = line.decode("utf-8", "replace").strip()
            if not line.startswith("data:"): continue
            d = json.loads(line[5:])
            for c in d.get("candidates", []):
                fin = c.get("finishReason") or fin
                for p in c.get("content", {}).get("parts", []):
                    if not p.get("thought"): text += p.get("text", "")
    return text, fin
out = pathlib.Path(sys.argv[1]); out.mkdir(exist_ok=True)
dead = set()
for vid in sys.argv[2:]:
    if (out / f"{vid}.md").exists(): print("skip", vid); continue
    for m in MODELS * 2:
        if m in dead: continue
        try:
            t, fin = stream(m, vid)
            if fin == "STOP" and len(t.split()) > 80:
                (out / f"{vid}.md").write_text(t); print("ok", vid, m, len(t.split())); break
            print("incomplete", vid, m, fin)
        except Exception as e:
            det = ""
            try: det = e.read().decode()[:300]
            except Exception: pass
            print("err", vid, m, getattr(e, "code", ""), det[:160])
            if "PerDay" in det or getattr(e, "code", 0) == 404: dead.add(m)
            time.sleep(3)
