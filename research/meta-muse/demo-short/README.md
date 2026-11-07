# Demo Short: "This rod keeps your water heater alive"

A 30-second vertical Short made end to end in a Claude Code cloud session on 2026-10-20, as a proof of the pipeline in `../youtube-automation-blueprint.md`. Nothing was edited by hand.

| Spec | Value |
|---|---|
| Length | 30.0 s |
| Format | 1080x1920, 30 fps, H.264, AAC 192k |
| Loudness | -15.3 LUFS integrated, -3.8 dBTP |
| Cost | Free: Gemini free tier for voice, everything else local |

## How it was made

1. **Script** (`script.json`): eight lines in the recommended niche, a mechanism explainer with a hook, the mechanism, the stakes and a call to action.
2. **Voice** (`tts.py`): Gemini TTS, `gemini-3.8-flash-tts` with the voice "Charon", one request per line. Lesson learned: a style instruction in the prompt gets read aloud, so send the bare line only. The clips were trimmed, sped up 1.12x, and joined with 0.18 s gaps into a 30.0 s track.
3. **Timing** (`timeline.json`): line spans come from the actual clip lengths. Word timing for captions is spread within each line by word length. Gemini transcription was used to verify the words, but its timestamps drifted by up to 0.5 s.
4. **Visuals** (`scene.html`): one HTML canvas page with a deterministic `render(t)` function. It has a continuous eased camera, a cutaway tank, the rod dissolving over a five-year counter, rust and a leak, price cards, an end card, word-by-word captions, safe zones, and fade, scale and blur on every entrance.
5. **Render** (`render.js`): Playwright plus Chromium draw every frame, which is piped into ffmpeg. 901 frames took about 2 minutes on 4 CPUs.
6. **QA**: stills were rendered at eight key moments (`qa-stills.png`) and checked before the full render. Fixes made from them were a clipped label, caption spacing, and the counter overlapping the pipes.
7. **Audio**: a synthesized ambient pad and synthesized sound effects (whooshes on camera moves, ticks on the year counter, drips on the leak, pops on cards), mixed under the voice with loudness normalization.

## Re-run

```
python3 -I tts.py                  # voice, one request per line
NODE_PATH=$(npm root -g) node render.js stills 1.5 6.5 11.5   # QA stills
NODE_PATH=$(npm root -g) node render.js video                 # frames to video_noaudio.mp4
```
The trimming, timeline and mix steps were inline shell and Python in the session; their parameters are listed above.

## Facts check

- The anode rod is a sacrificial anode, usually magnesium or aluminum, which corrodes in place of the steel tank.
- Typical life is 3 to 5 years, depending on water.
- A replacement rod costs about $20 to $50.
- A replaced water heater usually costs over $1,000 installed.
