# How a Social Ripple episode is made (the reusable pipeline)

Episode 1, "The Butterfly Effect of a Bad Mood", built this pipeline. Every later episode reuses it.

## Rules for every episode (from the user, 2026-10-31)

- **Long-form first:** 16:9 at 1920×1080, about 3–5 min. Shorts are cut afterwards.
- **Immersive:**
  - real camera moves: push-ins, punch-ins with shake, tracking shots, parallax, a zoom-out to the "ripple map";
  - crowds;
  - several worlds per film;
  - characters with visible acting: anticipation, squash, and moods that blend into each other.
- **Sound everywhere:**
  - an ambience bed for every location (city wind, distant traffic and horns, birds, café chatter and cups, auditorium murmur);
  - Foley on visible actions;
  - attention-grabbing comedy accents.
- **Every scene with people has a living background** (user feedback, 2026-11-01):
  - crowd footsteps on the right surface (`crowd_steps_street`, `crowd_steps_cafe`);
  - distant, unintelligible talk (`far_talk_street`) plus the location bed;
  - target level in the gaps between lines: about −26 dB RMS after loudness normalisation. Measure it; don't guess. At −34 dB nobody hears it.
- **Cinematic camera (v3, 2026-11-01).** Cut every 2–4 s on a word or an action, and mix wides, close-ups and top-down inserts. Close-ups blur the background, but **speaking characters always stay sharp**: the blur never touches the characters' layer.
- **Subtly therapeutic: the Lens** (user, 2026-11-01; see `THE-LENS.md`).
  - Every episode shows *Event → Lens → Reaction → Ripple*, with one Lens moment: a freeze, a push into the eyes, the same frame seen through a red lens and then a gold one.
  - Each episode teaches one micro-skill (name it, body check, three other reasons, talk to yourself like a friend, fuel not threat, change it or reframe it).
  - Validate first, no toxic positivity, action when the situation can be changed, honest science, never therapy or diagnosis.
- **Clarity over confusion.**
  - In stories, ambiguity is where the lens matters most: show the fog (blur, flickering "maybe" bubbles), then the focus pull.
  - In craft, every open question gets resolved, there is one core idea per episode, every new term gets a picture, and there's a short recap per act.
- **Light-skinned characters from episode 3** (user, 2026-11-01).
  - Pale cream heads and hands (`SR.SKIN = "#F1EBDD"` in `sr-v3.js`) with dark outlined features, so coloured light, tears, blush and shading read on faces.
  - Light pale faces with a **multiply falloff gradient** centred on the light source (warm near it, deep purple away from it), not a "screen" glow; screen glows only show on dark surfaces.
  - The old black heads stay available with `skin: "ink"`.
- **Thumbnails in the Day One style:** one huge emotional face, a near-black scene, one glowing object that lights the face, and a 1–3 word scrawled title (Permanent Marker). No shame or fear titles.
- **Viral-style sounds, but original.** The kit has a bass boom, record scratch, fail trombone, ka-ching, "dun dun dunnn" sting, boing, dings and whooshes. All are synthesized in `tools/sound_kit.py`, so nothing can be Content-ID claimed. Trending audio clips can't be used, because a copyright claim takes the ad revenue.
- **Light comedy, never stressful.** Each heavy beat gets a gag: the hair going grey, the "FREE" price tag on the bad mood, the sneeze, Dev still honking outside the window.
- **Current keywords, used honestly:**
  - in titles: "butterfly effect", "ripple effect", "emotional contagion", "bad mood", "kindness";
  - creators named only when the story genuinely involves them (MrBeast and Mark Rober's #TeamTrees in episode 1). Naming creators in tags or titles when they're not in the video counts as misleading metadata on YouTube.
- **Gives back:** every film ends on a gold half and a small, doable act ("hold a door, draw a terrible picture, let someone cross").
- **Real research:** one study, one number on screen, with the source named. Disputed findings are labelled as disputed.

## Pipeline (all local, about $0 per episode)

1. **Script, voice first.** Write lines in `vo_lines.tsv` (id, then text, tab-separated). Generate each line with Kokoro `af_heart` via `npx hyperframes tts` (set `HYPERFRAMES_PYTHON` to the venv that has kokoro-onnx). Then transcribe each line with Parakeet (`npx hyperframes transcribe`) to get word timings. Check names: "Rober" needed the spelling "Rohber" to be pronounced right.
2. **Plan the scenes against the voice.** Give each scene a duration of voice plus action pads. The final frame holds at least 3 s after the last word. The table lives in `tools/build_index.py`, `tools/mix_ep1.py` and the SRT script: keep all three in sync.
3. **Build the scenes.** Each scene is one HyperFrames sub-composition with one SVG world, drawn every frame from timeline time by `SR.drive(tl, D, draw)`. Build with:
   - `SR.Character` for the rig: poses, moods, props, `wings`, walking driven by distance;
   - `SR.Set.*` for sets: street, crosswalk, traffic light, clock sign, café interior, chalkboard, espresso machine, stage, audience, door, car with see-through glass;
   - `SR.Camera` for keyed `{x, y, z, r}` moves plus shake;
   - `SR.Ripple` for rings and threads, `SR.Bubble` for speech bubbles, `SR.Badge` for degree badges;
   - `SR.Crowd` for crowds;
   - `SR.Butterfly` for the channel mark, hidden in every film.

   Episode-specific sets go in `assets/ep1-sets.js`.
4. **Check every scene.** Run `npx hyperframes snapshot --at …` per scene and look at the frames. Then run `npx hyperframes check` on the whole film; it must have no runtime errors.
5. **Sound kit.** `tools/sound_kit.py` regenerates everything in `assets/sfx/`. The café and auditorium chatter is built from about 20 Kokoro lines in 8 voices, low-passed and with reverb added.
6. **Music.** Two ACE-Step cues per film:
   - red half: playful and tense, about 108 BPM;
   - gold half: warm and hopeful, about 92 BPM, ending on a long major chord.

   Run them in the background with `ACESTEP_GENERATION_TIMEOUT=7200`; 100 s takes about 15 min on 3 CPU threads. The music drops out at the moment of the turn.
7. **Mix.** `tools/mix_ep1.py`:
   - voice;
   - music, ducked about 9 dB under the voice;
   - ambience beds per scene, crossfaded and ducked;
   - about 90 timed sound effects.

   Then `loudnorm` to about −14 LUFS with a −1.5 dBTP ceiling.
8. **Render:** `npx hyperframes render --quality looks`.
9. **Captions:** an SRT built from the scripted text and the word clock (phrase-split, at most 9 words per cue). Upload it to YouTube instead of burning captions in.
10. **Thumbnail:** a 1280×720 still from the engine: one big face looking at the viewer, a short hook of 6 words or fewer with a number, and the red/gold device. The project is `hf/videos/sr-thumb`.

## The 3D-world pipeline (episode 3 onwards, 2026-11-01)

This is the method from the tutorial the user shared: 2D characters lit inside a real 3D world built in code, with ink, warm key light and violet shadows, a gliding camera, measuring instead of guessing, and many agents split by files.

**Engine.** `ep03-how-money-actually-works/project/assets/sr3d.js`:
- a three.js r158 toon world with a 3-step ramp;
- ink lines from a depth-Laplacian (1/z) and normal-edge pass;
- depth of field focused on the camera target;
- SVG rig characters projected into the world as depth-sorted billboards, clipped behind counters and desks, with an inner-rim "lit" filter per scene light.

**Camera.** `W3.keys([{t, p, l, f, dof, fn, ff, e}])` interpolates yaw and pitch, so 180° turns are safe. `shot(t0, t1, A, B, {in})` gives a creeping hold, entered by a cut or a glide.

**Sets by agents, one file each.** For example `ep3-town.js`, `ep3-interiors.js` and `ep3-props.js`. Each agent tests in its own copy of the project, following `BRIEF-SETS.md` (the API contract, palette, budget and test loop).

**Timing.**
- `tools/plan.py` aligns the script words to the Parakeet transcript with difflib, so numbers like "1,000" or "97%" still get exact times.
- `K.W(word, nth, line)` normalizes punctuation. Validate every lookup with the node check before rendering.

**Rendering on this box (4 CPU cores, software WebGL):**
- Use `--workers 3` and a **full streamed render, detached with `setsid nohup`**, so the 2-hour limit on background tasks can't kill it.
- Speed is about 0.8 frames/s at 1080p (about 5.5 h for 8.5 min at 30 fps), so budget the render first.
- `--start/--end` span renders store every frame as a JPEG of about 1 MB on disk, which is far too much for our space.
- Never run two renders at once.
- Use `samples: 2`, `dofTaps: 14`. Keep `ndScale` at 1, because 0.75 makes the ink jagged.

**Mixing.** Never use `np.convolve` for envelopes on whole-film buffers: it takes about 50 minutes. Use `uniform_filter1d` and a one-pole `lfilter`, which take 20 seconds.

**Never `pkill -f` a pattern that also matches the calling shell.** Kill by PID instead, with bracketed patterns.

## Words, foley and beds (user feedback on episode 3, 2026-11-02)

**On-screen words: `sr-type.js`.**
- Every card sizes itself to its text, measured with the real font after it loads. Long text wraps onto 2 balanced lines before it shrinks.
- A layout pass gives each card a zone slot, so cards that are on screen at the same time never overlap. They stack instead.
- Cards are kept off faces. `avoid: (t) => W3.faceRects(t, camAt)` moves a card to the opposite zone (top ↔ lower) if it would cover a face.
- **Each card has a mood that matches what is being said.** Every mood has its own colours, per-letter entrance, idle motion, exit and suggested sound:

  | Mood | Look | Sound |
  |---|---|---|
  | `hype` | gold punch-in, shake, starburst | boom |
  | `money` | green coin-flip letters, sparkles | ka-ching |
  | `alert` | red stamp slam, tilted | stamp |
  | `calm` | soft warm rise with glow (the Lens / therapy moments) | chime |
  | `sad` | blue; letters drop in and fall off on exit | steel down |
  | `fact` | typewriter with a caret, taped paper | typing |
  | `funny` | rainbow jelly wobble | boing |
  | `question` | letters pop in, the "?" wiggles | pop |
  | `title` | letter cascade | — |
  | `source` | bottom-left citation tag | — |
- **Readability:** minimum about 44 px at 1080p, thick border, high contrast, at most about 8 words per card. Sources go in the bottom-left tag.

**Viral environment foley: `tools/foley_kit.py`.**
- Synthesized from scratch in the spirit of block-game and battle-royale foley. Never use rips from Minecraft, Fortnite or anywhere else, because Content ID would take the revenue.
- **Footsteps:** `step_{grass,stone,wood,sand,tile,water}_{0..5}`.
- **Eating and drinking:** `crunch_*`, `bite_soft_*`, `chew_*`, `gulp_*` (glugs), `slurp_*` (straw), `sip_ahh_0`, `fizz`, `glass_set`.
- **Game-feel:** `pickup`, `coin`, `level_up`, `chest_open`, `door_creak`, `leaves`, `splash_small`.
- **Footsteps are automatic.** `W3.foleyScan({camAt, D, surfaceAt, extra})` walks the timeline without rendering and finds every footfall of every visible character from the rig's stride. It assigns a surface (`surfaceAt` maps world position to grass, stone, wood and so on), a pan from screen x, and a gain from camera distance.
- **Eating and drinking events** go in `extra`.
- Run `node tools/foley_scan.cjs <project>` (Playwright) to get `foley.json`; the mixer then places the sounds.
- Any time characters walk, eat, drink, open doors or pick things up, they get this foley.

**Crowd murmur.**
- Only use it when a crowd is actually on screen, and keep it well under the other beds: about −30 dB RMS, not −26.
- Episode 3's island murmur bed was too loud and too constant (user feedback).
- Steps and ambience carry "living town" better than chatter.

## Visual quality bar (Ifverse study 2, 2026-11-02; see `ifverse-study-2/`)

- **Shading:**
  - shadows go indigo, never grey (`shadowTint` in `sr3d.js`);
  - an inner rim on every character (cool at night, warm near light);
  - a contact shadow under every foot and prop.
- **Texture:** fine grain at about 4%, built into `sr3d.js`. Paper props get gradients.
- **Colour:** one accent colour per hero. Gold is reserved for energy, key props and UI.
- **Energy and light:** glowing objects get glowing edges, not ink outlines (put them on layer 1). Glow is two layers: a core plus a halo. Light spills onto nearby surfaces.
- **Motion:**
  - nothing is ever frozen: idle breathing is on by default;
  - blinks every 2.5–4 s;
  - slow ambient drift (dust, debris, `sr-fx3d.js`);
  - impacts get a 1-frame squash and a 2-frame overshoot.
- **Cast:** mix black stick figures (`skin: "ink"`, with a light outline) and light ones. Use the 16 new emotions (crying, laughing, terrified, starstruck, inlove, determined, confused, embarrassed, exhausted, furious, dizzy, sleepy, hopeful, proud, disgusted) in addition to the existing set.
- **Environment effects** (rifts, cracks and the like) appear only when the story calls for them. The craft lessons apply everywhere.
- **Presenter (optional):** the `sr-host.js` 3D stick figure can walk into scenes, address the camera, lip-sync the narration and gesture at examples. It's still being trialled with the user.

## Goldfish gate before every final render (2026-11-02)

This is the method from Google's Elephant-Goldfish Model (`github.com/google/elephant-goldfish-model`), done with plain fresh subagents. The director is the "elephant": it knows what every shot means, so it can't see what a stranger would miss.

**Before any final render:**
1. Export storyboard stills, about one every 3–4 s, with the script and captions on them.
2. Give the stills and the script **only**, with no other context, to three fresh reviewers in parallel:
   1. **First-time viewer:** confusing moments, unclear jumps, slow stretches, and moments where they'd scroll away.
   2. **Visual critic:** overlapping or overflowing words, faces covered or blocked, readability, framing and the quality bar in this file.
   3. **Claims checker:** anything stated without backing, and wording that overstates a study.
3. Fix everything that holds up, re-check those stills, and only then render.

Rendering costs about 5 hours. Reviewing costs minutes.

## Automatic text audit, a required step (user request, 2026-11-02)

Every on-screen word goes through `sr-type.js`, and the page exposes `window.__TY`. Before the goldfish gate and again before the final render, run:

`node tools/text_audit.cjs <project> <duration>`

It steps through the whole video every 0.1 s using the card layout itself, without rendering, and lists:
- cards that overlap;
- text that overflows its card;
- fonts that are too small;
- cards outside the safe area;
- cards that cover a character's face (from `W3.faceRects`).

Exit code 0 means clean. **A video doesn't render until the audit is clean.**

## Interactive sounds are real recordings (user feedback on demo 1, 2026-11-02)

- Steps, eating, drinking and handling sounds use **real licensed recordings** from `engine/real-foley/`.
- They should sound realistic and not playful. Grass steps stay quiet, cobblestones sound like real shoes on stone, and there is no cartoon "ahh".
- Synthesised sounds are allowed only for UI ticks on word cards, kept low.
- **Never rip game audio** (Fortnite, Minecraft and the like): it risks copyright claims and strikes on a monetized channel.
- When an `oga_*` file is used, add the CC-BY credit line from `engine/real-foley/README.md` to the video description.

## The host is a regular cast character (user decision, 2026-11-02)

- The narrator-host is a normal rig character, not the 3D satin stick figure: **Nia**, a black stick figure in a coral jacket (`skin: "ink"`).
- She walks into scenes, addresses the viewer, lip-syncs the narration (`lips: [[t, id]]` + `SR_LIPS`) and presents the examples.
- The 3D stick-figure host (`sr-host.js`) is shelved.

## Lip-sync with real mouth shapes (user request, 2026-11-02)

- Talking characters use **visemes**, not a single open/close oval.
- `engine/tools/visemes.py` turns each line's word times (Parakeet) and phonemes (espeak-ng through `phonemizer`, using `espeakng-loader`) into a track `[[t, code]]` in `SR_LIPS[id].vis`. The audio energy envelope scales how wide the mouth opens.
- Codes: X rest, P (m b p, lips pressed), A (ah), E (ee/eh, teeth), O (oh), U (oo/w, pucker), F (f v, teeth on lip), L (tongue up), T (th, tongue tip), C (other consonants), R.
- The rig (`sr-v3.js`) draws colored lips, a dark mouth, upper and lower teeth and a tongue, and eases into the next shape about 75 ms early.
- Lines without `vis` fall back to the old mouth.
- Usage: `python visemes.py <project> h1=assets/vo/h1.wav:.words/h1.json ...`, after `hyperframes transcribe <wav> --json` (copy `assets/vo/transcript.json` per line).

## Game-feel eating and drinking (2026-11-02)

- Default: real recordings arranged in the fast rhythm of game consumables. That means a crisp bite about every 0.17–0.23 s with slight pitch variation, and quick double gulps about every 0.32 s.
- Run `GAMEFEEL=1 python mix_demo_real.py` to get this mix.
- Game files the user supplies are used **unchanged** or not at all. We don't slightly alter them to make them harder to recognize.

## MrBeast concept DNA, Social Ripple pacing (2026-11-02; see `mrbeast-editor-study/`)

- Borrow the *concept* DNA:
  - a one-breath, visual title promise proven in 30 s;
  - an on-screen counter;
  - escalation every 60–90 s;
  - a midpoint twist;
  - a payoff that keeps the promise.
- Do **not** borrow hyper-cut editing. MrBeast's own former lead editor says it is fading in favour of atmosphere, character and TV-friendly pacing.
- Targets: at least 70% still watching at 30 s, with a retention review after every upload.
- Recurring cast and running gags build lore.

## Seated characters: shoot benches from the side (user feedback on ep4, 2026-11-02)

The rig characters are drawn side-on, so a seated figure only reads as sitting when the camera sees the seat from the side or at three-quarters.

- **Face out of the seat.** Seat the figure about 4 cm forward of the bench centre, facing out of the seat (the bench's "out" direction).
- **Camera angle.** Put the camera along the bench axis, with a little "out" offset: `cp(a, y, f)` = (along, height, out). Never film a seated figure from straight in front or behind.
- **Two sitters.** Place them side by side along the bench, both facing out, and shoot at about 3/4 (a ≈ 0.6 × f).
- **Clipping.** Seated figures skip the occluder clip (`b.noClip`), so the seat never cuts them.
- **Check angles.** Use `engine/tools/test_cam.cjs` to try camera angles on a single frame before re-rendering.

## Episode length: 3–6 minutes is the default (user's channel data, 2026-11-04)

The user reports that videos between 3 and 6 minutes get the most views on the channel. From Episode 5 on:

- **Target 4–5 minutes**, with a hard ceiling of 6. Episode 4 (3:55) is the model.
- **Budget:** about 550–750 words of voice-over, one story arc, 3–4 research beats, 1 midpoint twist, and the payoff last.
- **Cut, don't compress:** if a script runs long, drop a whole beat rather than speeding up pacing or narration.
- **Trade-off:** mid-roll ads need 8+ minutes, so revenue per view is lower. Volume makes up for it: a 4-minute episode renders in about 3 hours, so we can ship more often.
- **Re-check after every upload:** views, average view duration % and CTR in YouTube Studio. An occasional longer flagship episode stays an option to A/B test.


## QA before the full render (added after Ep5)
The full render costs about 4 hours on this machine, so problems must be found before it, not after.
- **Motion check:** run `engine/tools/qa_consistency.cjs <project> <outdir> 99999 0 999 1` with `NOHUD=1`. It is pure math, takes about 1 minute, and flags slides and teleports (any character moving over 6 m/s within a continuous shot).
- **Preview spans:** render a 2–3 s span (`hyperframes render --start a --end b`) at every bubble, card, reveal and emotional beat. That's about 10 minutes in total. Check each one for:
  - overlapping text or bubbles, and text covering the day counter;
  - text overflowing its box or running off-screen;
  - **who a bubble belongs to:** it sits by the thinker, and its dots lead to them. Watch over-the-shoulder shots, where the thinker's head is off-frame;
  - faces covered at reaction beats (the counter steps aside for big close-ups);
  - **moods that read wrong:** for example, laughing while thinking something sympathetic reads as mockery.
- **Fix-ups after a render:** re-render only the affected spans and overlay them frame-exactly (`tools/splice.sh`, which keeps the audio). That's 5–10 minutes per span instead of a 4-hour full render.
- **Disk:** keep finished renders out of the project folder. Span renders copy the whole project, and start only with more than 1.3 GB free.
- **Thought bubbles:**
  - Several bubbles in one shot show one at a time, unless they are pinned with `place`.
  - Bubbles that pile up while the camera pushes in get fixed `place` spots, so they don't jump.
