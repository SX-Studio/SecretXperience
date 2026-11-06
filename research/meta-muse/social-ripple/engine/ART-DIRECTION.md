# Art direction: from "3D rendered" to artistic, expressive characters (2026-11-06)
Why: every top channel in our niche uses expressive cartoon/anime-style art. Our own 2D-style Episode 2 still has our best CTR (2.1%). Our characters are already vector drawings; the 3D world and camera are what read as "rendered".

## Character redesign v5 (2026-11-06): real bodies, human faces, emotional arcs
Feedback: the stick-figure bodies weren't appealing enough to carry our messages, and the faces didn't read as human expressions.

**Bodies** (`rig-v5/sr-v3.js`, opt in with `build: "v5"`; old episodes render unchanged):
- Tapered limbs with volume replace the stick lines. Each limb is two capsules and gets pants, sleeves, creases and an outline.
- Cartoon hands with a thumb and fingers, chunky sneakers with soles, and a short neck under a slightly bigger head.
- Six body types (shape language): `avg`, `round` (Mo), `broad` (Kai), `slim` (Ana, Nia), `pear` (Bea), `lanky` (Theo, Finn).
- Real skin tones per character (`cast5.js`) instead of paper-white and ink heads.
- Crouch and walk stride scale with leg length, so sitting and walking still land.

**Faces** (`rig-v5/face5rig.js`): human-like exaggerated cartoon faces built from blendable dials:
- eyes: openness, lid drop and angle, squinting lower lid, closed-eye curve, pupil size, gaze;
- independent brows (raise and angle), drawn over the hair with a skin halo;
- mouth: smile, smirk, open, round, top and bottom teeth, tongue, wobble, pucker;
- cheeks, blush, sweat, tears, head squash;
- a nose.
About 40 named moods, all mixes of the same dials: neutral, content, happy, joy, laugh, grin, sad, worried, tired, annoyed, angry, shock, surprised, smug, skeptic, cheeky, kiss, wail, forced, bliss, hopeful, embarrassed, determined, nervous, relieved, touched, crying, furious and others.

**Progressive expression:**
- Mood keys `[t, name, dur, ease]` blend every dial, so one track can drift through a story: forced → nervous → worried → crying → touched → relieved → laughing (`prog5.png`).
- Use long blends (1.5–3 s, `"inOut"`) for feelings that build, and short ones (0.2–0.4 s, `"back"`) for reactions.
- Viseme lip sync rides on top and keeps the emotion's smile.

**Tone of voice** (`rig-v5/demo/tools/gem_tts.py`):
- Character lines are acted with Gemini TTS using a direction per line, such as "voice cracking on 'by myself', holding back tears".
- Gemini's audio review scored it 9/10 for naturalness and 9/10 for acting.
- Nia keeps her Kokoro narrator voice so the channel's voice stays consistent.

**Scenes follow the feeling** (`rig-v5/demo/assets/scene.js`):
- the colour grade, window sky and inner-weather icon all follow the emotional arc;
- fast cuts every 2–4 s, with a slow push on the long emotional beat.

**References:**
- demo (Ep7 S06 "ask twice" beat): `rig-v5/demo/`, `rig-v5/social-ripple-v5-demo.mp4`
- sheets: `rig-v5/ba5.png` (before/after), `rig-v5/b5sheet.png` (cast), `rig-v5/prog5.png` (blending), `rig-v5/f5sheet.png` (face presets)

**Next:**
- Use v5 for Ep7.
- Give `W3.person` (3D world) `build: "v5"` too. Billboards already accept any rig spec.
- Write each character's emotional arc into the beat sheet next to the lines.

## Earlier plan (expression panels, still valid)
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
