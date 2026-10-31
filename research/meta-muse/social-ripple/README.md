# Social Ripple (new channel, started 2026-10-31)

| File | What it is |
|---|---|
| `CHANNEL.md` | What the two reference tutorials teach, the format evidence (Ifverse, Last Soul), the concept, look, format, engine and 12 episode ideas |
| `STORYLINES.md` | Three pilot storylines; the user picks one |
| `engine/sr-engine.js` | The channel's stick-figure animation engine: rig, moods, props, sets and ripple device. Seek-safe, so it works in HyperFrames scenes |
| `engine/look-test-scene.html` | The 7 s look-test scene, a usage example for the engine |
| `look-test.mp4` | Rendered look test |
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
