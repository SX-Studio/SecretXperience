# Art direction: from "3D rendered" to artistic, expressive characters (2026-11-06)
Why: every top channel in our niche uses expressive cartoon/anime-style art. Our own 2D-style Episode 2 still has our best CTR (2.1%). Our characters are already vector drawings; the 3D world and camera are what read as "rendered".

## Plan (starting Ep7)
1. **Expression panels** (prototype: `thumbstudio/expression-panels-prototype.jpg`):
   - full-frame illustrated reaction shots at every emotional beat;
   - huge face, manga focus lines, mood backgrounds (gloom rain, warm burst), emotion props;
   - they come from the thumbnail studio, so videos and thumbnails share one look;
   - they also deliver the 2–4 s fast-cut rhythm.
2. **Face upgrade on the rig:**
   - anime-style eyes (gradient irises, two highlights);
   - stronger brows and mouth shapes;
   - blush, sweat and sparkle FX at larger sizes;
   - line-weight variation.
   It applies to both the 3D-world billboards and the panels.
3. **Exaggerated expressions** (sheet: `thumbstudio/exaggerated-expressions-sheet.png`, moods in `thumbstudio/xmoods.js`):
   - `shockX`: popping eyes, shock lines, "!!", sweat;
   - `laughX`: "HA HA", tears of laughter;
   - `sobX`: tear rivers, gloom lines;
   - `loveX`: heart eyes, floating hearts;
   - `starX`: star eyes, sparkle burst;
   - `forcedX`: smile, giant sweat drop, nervous lines.
   These are the same face controls pushed past their normal range, plus anime FX drawn around the head (`TS.fx`). Use them on every emotional beat, in panels and thumbnails.
   Rig fix: brows are clamped to the forehead at large eye sizes, so normal moods are unchanged.
4. **Test a fully 2D-illustrated episode.** The 2D Scene2 engine from Ep1–2 already exists. Use illustrated backgrounds instead of the 3D island for one episode, and compare retention and CTR.
5. **Thumbnails** follow the system in `thumbstudio/SYSTEM.md`, with the size gate.
