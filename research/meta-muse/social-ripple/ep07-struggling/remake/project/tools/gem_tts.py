"""Acted character lines with Gemini TTS (style direction in natural language). Usage: python -I gem_tts.py lines.tsv outdir
TSV: id <tab> voiceName <tab> direction <tab> text"""
import sys, json, base64, time, subprocess, urllib.request, os
tsv, out = sys.argv[1:3]
for line in open(tsv):
    if not line.strip(): continue
    i, voice, direc, text = line.rstrip("\n").split("\t")
    wav = os.path.join(out, i + ".wav")
    if os.path.exists(wav): continue
    body = {"contents": [{"parts": [{"text": f"{direc}: {text}"}]}], "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    for attempt in range(4):
        try:
            req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent", json.dumps(body).encode(), {"Content-Type": "application/json"})
            j = json.load(urllib.request.urlopen(req, timeout=180)); d = j["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]; break
        except Exception as e: print("retry", i, e, file=sys.stderr); time.sleep(35)
    else: print("FAIL", i); continue
    pcm = wav[:-4] + ".pcm"; open(pcm, "wb").write(base64.b64decode(d))
    # trim leading/trailing silence, 24 kHz mono
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", pcm, "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse", wav], check=True); os.remove(pcm)
    print(i, subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav], capture_output=True, text=True).stdout.strip()); time.sleep(int(os.environ.get("GEM_GAP", "7")))
