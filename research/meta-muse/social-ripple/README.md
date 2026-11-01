# Social Ripple (new channel, started 2026-10-31)

| File | What it is |
|---|---|
| `CHANNEL.md` | What the two reference tutorials teach, the format evidence (Ifverse, Last Soul), the concept, look, format, engine and 12 episode ideas |
| `STORYLINES.md` | Three pilot storylines; the user picks one |
| `engine/sr-engine.js` | The channel's stick-figure animation engine: rig, moods, props, sets and ripple device. Seek-safe, so it works in HyperFrames scenes |
| `engine/look-test-scene.html` | The 7 s look-test scene, a usage example for the engine |
| `look-test.mp4` | Rendered look test |
| `CONTENT-MAP.md` | The 9 angles, 5 series formats and 40 episode ideas, plus the channel's growth rules |
| `PRODUCTION.md` | The reusable episode pipeline and the user's standing rules for every episode |
| `branding/` | Profile picture (800×800), banner (2560×1440) and their sources |
| `ep01-butterfly-bad-mood/` | **Episode 1** (2:53): final MP4, thumbnail, upload kit, captions and the full HyperFrames project |
| `ep02-7-levels-of-school-popularity/` | **Episode 2** (5:39): status, a rumour and the seat that changed it; 16 scenes on engine v2, a new school sound kit, 3 new music cues. Film, thumbnail, captions, research notes and the project |
| `v3-upgrade/` | **Engine v3**: a shot list with cuts, rim light, depth of field, rack focus, whip-pans, grade and grain, plus eyebrows. Studies of IFANIME and the ODonovan method, and an 18 s before/after test |
| `ifverse-study/` | In-depth Ifverse study (art style, lighting, camera, branding) + our **v2 banner and profile picture** and a night style frame |
| `dayone-study/` | Day One Films studied: a wordless discipline-film formula, thumbnails, what to borrow (externalised lens, "go find out", day counters, text cards) and what not to copy (shame titles, anger, no sources) |
| `shorts/` | YouTube Shorts: the RicksClips3000 and Mr omi study (style bible, formula, method) and **Short 01, Petrov** |
| `THE-LENS.md` | **The Lens**: what shapes how we interpret experiences (8 layers, verified studies), 6 micro-skills, the Lens-moment visual device, the therapeutic guardrails, and one skill per Season 1 episode |
| `SEASON-PLAN.md` | The "everything social" umbrella, the 1,528-result second sweep, and Season 1, with each episode moving one step out in scale |
| `v2-upgrade/` | **Engine v2** (fuller characters, lit layered sets, life and effects, lip-sync, sound v2), the Danny Why study, 10-year viral-topic research (`results.tsv`), the before/after and the style-test video |
| `forensics/` | Gemini breakdowns of the two tutorials (`over_*`, `seg_*`) and of three reference films (`ref_*`) |

**References studied:**
- [Jackson's AI tutorial](https://youtu.be/KuovIUmGS_A)
- [Jad M.H tutorial](https://youtu.be/aDq2Hq2vK2Y)
- Ifverse ["What If Your Reaction Time Was 10x Faster?"](https://youtu.be/MroF1XmHOZw)
- Last Soul ["1 MINUTE"](https://youtu.be/NeWlC4bJTMs) and ["Just 5 More Minutes… It's 2:14 AM"](https://youtu.be/ymkAGznhLfc)

**Using the engine:**
1. Load it once in `index.html` with `<script src="assets/sr-engine.js">`.
2. In each scene, build sets and characters with `SR.Set.*` and `SR.Character(...)`.
3. Drive the scene with `SR.drive(tl, duration, draw)`, where `draw(t)` calls each character's `update(t)` and `Ripple.update(t, pA, pB)`.

The HyperFrames project lives in the session scratchpad at `hf/videos/social-ripple`.
