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
