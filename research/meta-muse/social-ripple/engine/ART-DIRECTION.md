# Art direction: from "3D rendered" to artistic, expressive characters (2026-11-06)
Why: every top channel in our niche uses expressive cartoon/anime-style art. Our own 2D-style Episode 2 still has our best CTR (2.1%). Our characters are already vector drawings; the 3D world and camera are what read as "rendered".

## Art direction v3 (2026-11-06, decided): paper cut-out storybook
**Why we changed course.** Ep4 analytics: half the viewers gone by 0:05, average view 30 s (12.8%) of 3:55; every upload shows the same curve. The owner also didn't find the cartoon look appealing. Four directions were prototyped on one moment (`paper/stylelab/styles_2x2.png`: painted anime, paper cut-out, bold flat, sketch + wash); **paper cut-out** was chosen, with the one hard requirement that *every feeling must read from the face at a glance*.

**The look** (`paper/paper-rig.js`, `paper/paper-sets.js`):
- Flat paper shapes, no outlines, soft drop shadows between layers (`#pshadow`, `#pshadowL`), a paper-grain overlay on the frame (`SR.paperGrain`).
- Storybook proportions: big round head (radius 92 at scale 1), short legs, chunky limbs, six body types.
- Faces: white eyes with dark irises and a glint, paper lids that drop and angle, thick paper-strip brows, a mouth that opens into a dark shape with teeth and tongue, cheeks, tears, sweat. Driven by the same blendable expression dials as before (`SR.F5`), so ~40 moods blend progressively (`paper/expression-and-pose-sheet.png`).
- Poses tuned to the proportions (`SR.PAPER_POSES`) and a **joint checker** (`c.check(ground)`) that flags hands inside heads, elbows bending backward, knees bending forward and feet off the ground. Run it over every frame before rendering (`tools/stills.cjs` prints the issues).
- Paper weather icons (sun → storm) with a pop-in, black word cards, a camera helper with snap zooms, pushes and shake.

**"Something every second."** The 19-second cold-open test (`paper/lab/`, `paper/paper-test-cold-open.mp4`) averages one visual event per second: a visual contradiction in second one (a beaming "I'm fine!" and a storm pops over her head, flash + thunder + shake), snap zoom to YOU's shock, the whole square's storms popping one by one, a black card ("THEY'RE NOT."), a stranger's "Doing great!" under rain, a punch-in on YOU's deadpan, Ana's face drifting forced → nervous → sad → crying as the colour cools, then a hand on her shoulder and the title card.

**Still to do:** remake Ep7 in this look (sets: bedroom, street, bakery, harbour, site, bench, classroom, café, reflection, host), kinetic word-by-word captions, the opening audit and scorecard from `studies/VISUAL-ENERGY-RESEARCH.md`, a Short, then measure retention.

## Character redesign v5 (superseded by v3 above, kept for reference) (2026-11-06): real bodies, human faces, emotional arcs
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
