---
name: dissect-video
description: Fully dissect a video LOCALLY (no cloud models): every frame scanned, shot list with keyframes, on-screen text (OCR), word-timed transcript, sound events per half second, loudness/pitch/silence/hits, picture+sound sheets for Claude to read, and an interactive report.html. Includes a link converter (fetch.py) that turns a video link into a local file when the site allows it. Use when the user sends a video or link to study, review, compare or learn from, or asks to "dissect", "break down", "analyze in full detail" a video.
---

# Dissect a video (local, personal study use)

## Pipeline
1. **Get the file.** `python3 .claude/skills/dissect-video/fetch.py <URL>` saves to `video-inbox/<id>.mp4` and prints `FILE <path>`.
   - Works directly for most sites. **YouTube on this cloud machine usually answers "Sign in to confirm you're not a bot".** fetch.py then tries the user's own cookies (`--cookies cookies.txt` or env `YTDLP_COOKIES`) and otherwise prints the options. **Never try to evade the check** (no client spoofing, no proxies). The user can run `fetch.py` on their own computer, export cookies, or drop a file/screen recording into `video-inbox/`.
2. **Dissect.** `python3 .claude/skills/dissect-video/dissect.py <file> <outdir>` (3-minute video ≈ 3–5 min on CPU; 20-minute video ≈ 20–30 min). Options: `--step` (sheet frame interval), `--no-ocr`, `--no-tags`, `--no-transcript`.
3. **Read it yourself**, in this order:
   - `shots.md`: the shot list. One line per shot with keyframe path, length, motion, colour, loudness, voice pitch, sound labels, words spoken and on-screen text.
   - `watch/sheets/*.jpg`: open every sheet with Read. This is the closest thing to watching: frames every second plus every cut, with the sound drawn underneath.
   - `keyframes/*.jpg`: open any shot you want to inspect at 640 px.
   - `transcript.md`, `text_on_screen.md`, `sound_events.md`.
   - For a key moment, re-run the watch skill on that span frame by frame: `python3 .claude/skills/watch-video/watch.py <file> <out> --start A --end B --step 0.1`.
4. **Give the user `report.html`** (send it with SendUserFile; it's self-contained apart from the keyframes and sheets folders next to it, so send the whole outdir if they want to click around). It shows the timeline (loudness, pitch, motion of every frame, speech/music spans, cuts, hits, silences, a colour strip), the shot list with keyframes, the clickable transcript, on-screen text and the sheets.

## What each measurement means
- **Cuts:** a jump in the colour histogram and the pixels between consecutive frames. Flashes and fast fades can register as cuts; check the keyframes.
- **Motion:** mean pixel change per frame at 128×72, cuts excluded. ~0 is a held frame; >3 is big movement or a camera move.
- **Sound labels:** PANNs Cnn14 trained on AudioSet (527 classes: Speech, Music, Laughter, Thunder, Applause, Explosion, instruments...). Probabilities, not certainties; below 0.3 is weak.
- **Voice pitch:** 75–400 Hz autocorrelation on louder windows. A wide 10–90% range means an expressive delivery; a narrow one means flat.
- **OCR:** RapidOCR on a frame every 2 s plus every shot keyframe. Stylised fonts can be misread; the first/last time is the on-screen span.
- **Transcript:** Parakeet (local). Names can be misspelled (Ana → Anna).

## Honesty rules
- Claude reads frames and numbers; it does not hear audio. Say what was **seen**, what was **measured** and what was **inferred**.
- Gemini is **not** part of this pipeline. If the user explicitly asks for a cloud second opinion, `remote.py` (YouTube via Gemini) exists, but it is off by default and its timestamps are approximate.
- Study for learning only; don't copy another creator's assets.

## Environments (auto-detected; override with env vars)
- `OCR_PY`: python with `rapidocr_onnxruntime` (scratchpad `dissect-venv`).
- `TAG_PY`: python with `torch` + `panns_inference` (scratchpad `acestep/venv`). First run downloads the Cnn14 checkpoint (~300 MB) to `~/panns_data`.
- `HF_BIN`: hyperframes CLI for `transcribe`.
- Setup if missing: `python3 -m venv dissect-venv && dissect-venv/bin/pip install rapidocr-onnxruntime numpy pillow`; `pip install panns-inference torchlibrosa` into a torch env.
