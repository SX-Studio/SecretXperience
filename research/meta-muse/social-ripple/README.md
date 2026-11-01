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
