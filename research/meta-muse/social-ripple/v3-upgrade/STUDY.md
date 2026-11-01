# Social Ripple v3: cinematic camera and lighting (2026-11-01)

## References studied

1. **IFANIME, "What If YOU Went Super Saiyan in Real Life?"** ([youtu.be/lDhzDKKWYr4](https://youtu.be/lDhzDKKWYr4), 10:24). Notes are in `forensics/ref_ifanime_super_saiyan.md`.
   - The character is almost ours: a black round head with simple white eyes and a teal hoodie, rendered in cel-shaded 3D.
   - **What works:** a shot every 1.5–3 s (about 70% camera moves, 30% character motion), real-world comparison numbers in a reused data box, the music dropping out for the climax, an A/B question at the end, and a 10-minute length (mid-roll ads need 8 minutes or more).
   - **The thumbnail:** a low camera angle, the character glowing as the brightest thing in frame, flying debris, a real lit room, and two words in white and yellow with a heavy outline.

2. **Baptiste ODonovan, "I found a way to make these AI animations for $0"** ([youtu.be/avIK9YTKpjU](https://youtu.be/avIK9YTKpjU)). Notes are in `forensics/ref_odonovan_method.md` and `forensics/ref_odonovan_visuals.md`.
   - **The method is ours:** an AI agent writes code for an SVG stick rig (Remotion instead of HyperFrames), with ElevenLabs voice, a storyboard self-check, FFmpeg loudness at −14 LUFS, and one central fact per video. It runs on a free model in OpenCode, or on Claude.
   - It confirms our approach: code-drawn characters never drift between shots, which AI-generated images can't promise.
   - **What lifts their clips** (ranked):
     1. cinematic lighting with a rim glow;
     2. many camera angles (wide, over-the-shoulder, top-down, close-up);
     3. rich environments with depth of field;
     4. on-screen interface elements;
     5. contrast accents on clothing;
     6. snappy pose-to-pose acting with expressive eyebrows;
     7. a cut every 1.5–3 s, about 27 cuts a minute;
     8. grain and vignette.

## What v3 adds (`engine/`)

- **`sr-v3.js`** is the v2 rig plus:
  - **eyebrows**, driven by mood: tilt follows the eye slant, lift follows surprise;
  - two new moods: **smug** (one brow raised) and **deadpan**.
- **`v3-fx.js`**, the finishing kit:
  - `V3.rim()`: a warm rim light hugging the silhouette, plus a soft bloom.
  - `V3.blur()`: a live-adjustable blur, used for depth of field and for whip-pan motion blur.
  - `V3.grade()`: a corner light (soft-light blend), cool shadows (multiply) and a vignette.
  - `V3.glow()`: window and lamp light pools.
  - `V3.grain()`: film grain that changes every frame.
  - `V3.Shots()`: a shot list with instant cuts between camera set-ups, focus per shot, rack focus, dutch angles and screen-space speech bubbles that stay a constant size in close-ups.

## The test (`social-ripple-style-v3-seat.mp4`, 18 s)

The test re-shoots episode 2's "Is this seat taken?" beat (3:40) with the same voices and set. It has 10 shots, where episode 2 used one long camera move:

1. a wide establishing shot;
2. over Jordan's shoulder (a defocused foreground silhouette);
3. a close-up of Nia with the background blurred;
4. a close-up of Jordan (deadpan);
5. a whip-pan along the empty chairs ("literally all free");
6. a top-down insert of the tray landing;
7. a two-shot;
8. a rack focus to Marcus as he notices;
9. a low dutch angle for "Scoot over.";
10. a wide pull-out with the gold ripple.

**Gemini's review:** 9/10. It praised the cutting rhythm, the rack focus and the rim light, and its two notes are small: an abrupt first cut, and a cramped left edge in the dutch shot.

**Cost:** the blur filters slow rendering from about 9 fps to about 1.7 fps. A 6-minute episode would take about 1.7 h. Planned speed-ups:
- blur only the background layer;
- rasterise static sets once.

## Rules for the next episodes

- A cut every 2–4 s, on a word or an action. Each beat gets a wide, a close and an insert.
- Close-ups get a blurred background and a rim light; wide shots get a light rim only.
- **Whoever is speaking (and anyone they're talking to) is never blurred.** Characters sit in their own focus layer; only the set, the far crowd and the props defocus. (User feedback, 2026-11-01: faces were blurry in the first test. Fixed in `engine/seat.html`.)
- One top-down or insert shot per scene (phones, trays, notes).
- End on an A/B question. Aim for 8–10 minutes when the topic supports it.
