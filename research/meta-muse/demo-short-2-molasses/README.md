# Demo Short 2: "The Great Molasses Flood"

A cinematic vertical Short made end to end in one Claude Code cloud session on 2026-10-20. It is deliberately different in every way from the first demo. Read `BRIEF.md` first. It is the reviewed creative brief, scene by scene, written and corrected before any generation.

| Spec | Value |
|---|---|
| Length | 81.5 s |
| Format | 1080x1920, 30 fps |
| Loudness | about -15 LUFS |
| Cost | $0: free tiers plus local compute |

## Tools used, and what each did

| Tool | Role |
|---|---|
| Gemini TTS (`gemini-2.5-flash-preview-tts`, `gemini-3.1-flash-tts-preview`, voice "Algenib") | Narration, one request per line. Send the bare line only, because style instructions get read aloud. The free tier allows 3 requests per minute and about 10 a day per model, so rotate models. |
| Library of Congress API | The real 1919 aftermath photo: "Boston, Mass. Boston molasses explosion", American National Red Cross collection, "No known restrictions on publication". |
| Depth Anything V2 Small (Hugging Face Transformers, CPU) | A depth map of the photo (`depth.py`), driving a displaced 3D plane for real 2.5D parallax |
| Pillow and NumPy | The aged newsprint texture (mottling, fibers, foxing, edge burn), the cleaned photo crop, a sepia grade, and a 45° halftone screen |
| Three.js 0.169 (WebGL via SwiftShader in headless Chromium) | The riveted steel tank (paint revealed with a clipping plane, leak streaks, 40 rivets popping on a schedule, sparks, the crack and gush), the street wave (a custom shader with analytic normals, gloss, fresnel and fog), debris, spray, cobblestones, and the depth-mapped photo |
| Canvas 2D | The living front page, the molasses pour, counters, thermometer, harbor map, blueprint and stamp, memorial card, captions, and film emulation (grain, flicker, dust, scratches, gate weave, vignette) |
| Google Fonts (downloaded locally) | UnifrakturMaguntia, Playfair Display, Oswald, Special Elite and Old Standard TT |
| NumPy and SciPy | A fully synthesized score (pads, Karplus-Strong plucks, heartbeat, swell, taiko hits, a major-key resolve) and more than 20 synced sound effects (`sound.py`) |
| ffmpeg | Trimming, timeline assembly, sidechain ducking, loudness normalization, and encode and mux |
| Playwright and Chromium | A frame-exact deterministic render (`render2.js`), split into three parallel chunks |

## What was tried and rejected

- **Gemini image generation.** It has no free-tier quota on this key.
- **Wikimedia Commons.** The shared IP was rate-limited, with HTTP 429.
- **Boston City Archives photos.** These are marked "Copyright not evaluated", and unpublished 1919 corporate photos can still be in copyright, so they were not used.
- **The Boston Molasses Co. trademark label.** It is in the public domain, but it was dropped. It is a different company from the tank owner, Purity Distilling, and using it would imply a false link.

## Re-run

```
python3 -m http.server 8765 --bind 127.0.0.1 &       # serve this folder (WebGL textures need http)
npm install                                           # three@0.169.0
NODE_PATH=$(npm root -g) node render2.js stills 5 16 44 51   # QA stills
NODE_PATH=$(npm root -g) node render2.js video 0 2446 video_noaudio.mp4
python sound.py                                       # music.wav and sfx.wav (needs numpy and scipy)
```
The narration track (`narration.wav`) comes from `tts.py` plus the trimming and timeline step recorded in `timeline.json`. The final mix is in the session notes in `../README.md`.
