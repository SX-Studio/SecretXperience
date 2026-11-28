import json, urllib.request, base64, wave, time, os
lines = json.load(open("script.json"))
models = ["gemini-2.5-flash-preview-tts", "gemini-3.1-flash-tts-preview", "gemini-3.8-flash-tts"]
voice = "Algenib"
dead = set()
for i, line in enumerate(lines):
    out = f"line{i:02d}.wav"
    if os.path.exists(out): continue
    for attempt in range(8):
        live = [m for m in models if m not in dead]
        if not live: raise SystemExit("all TTS models out of quota")
        m = live[0]
        ep = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent"
        body = {"contents": [{"parts": [{"text": line}]}],
                "generationConfig": {"responseModalities": ["AUDIO"],
                    "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
        try:
            r = urllib.request.urlopen(urllib.request.Request(ep, data=json.dumps(body).encode(),
                    headers={"Content-Type": "application/json"}), timeout=120)
            p = json.load(r)["candidates"][0]["content"]["parts"][0]["inlineData"]
            raw = base64.b64decode(p["data"])
            if raw[:4] == b"RIFF": open(out, "wb").write(raw)
            else:
                with wave.open(out, "wb") as w:
                    w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(raw)
            print(i, "ok", m); break
        except Exception as e:
            code = getattr(e, "code", 0); body_txt = e.read().decode()[:300] if hasattr(e, "read") else ""
            if code in (429, 404): dead.add(m); print(i, "drop", m, code); continue
            print(i, "err", m, code, body_txt[:120]); time.sleep(8 * (attempt + 1))
