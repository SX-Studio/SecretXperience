import json, urllib.request, base64, wave, sys, time
lines = json.load(open("script.json"))
ep = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent"
for i, line in enumerate(lines):
    out = f"line{i}.wav"
    body = {"contents": [{"parts": [{"text": "Read this in a calm, curious documentary narrator voice, natural pace, slight intrigue: " + line}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Charon"}}}}}
    for attempt in range(5):
        try:
            r = urllib.request.urlopen(urllib.request.Request(ep, data=json.dumps(body).encode(),
                                       headers={"Content-Type": "application/json"}), timeout=120)
            d = json.load(r)
            p = d["candidates"][0]["content"]["parts"][0]["inlineData"]
            raw = base64.b64decode(p["data"])
            if raw[:4] == b"RIFF":
                open(out, "wb").write(raw)
            else:  # raw PCM 24 kHz 16-bit mono
                with wave.open(out, "wb") as w:
                    w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(raw)
            print(i, "ok", p["mimeType"], len(raw)); break
        except Exception as e:
            print(i, "err", e, getattr(e, "read", lambda: b"")()[:200]); time.sleep(10 * (attempt + 1))
