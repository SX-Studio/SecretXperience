# Ifverse study 2: quality, environment, faces, and what audiences say (2026-11-02)

**Source:** "Faster Than Light, He Found What the Bermuda Triangle Took" (Ifverse, `BhBxmwIC0wE`, 8:32, 22K views, channel at 58.5K subscribers).

The user asked us to study every aspect of its scenes (shading, colours, texture, environment animation, the opening crack) and to read what audiences like and dislike on videos like it.

## Files

| File | Contents |
|---|---|
| `segments/seg0..7.md` | Frame-level breakdowns of all 8 × 64 s segments, done by Gemini at high media resolution and 3 fps |
| `QUALITY-SPEC-from-ifverse.md` | The consolidated spec: shading, colour, texture, lines, depth, motion rules, VFX recipes, faces, and the top 15 upgrades |
| `opening-crack-breakdown.md` | The opening rift: how it is built and how it closes. Used as inspiration only; we don't use the crack itself |
| `whole-video-overview.md` | Environment, VFX inventory, characters and expressions, camera, text and sound |
| `comments/` | 1,602 top comments from 14 comparable videos (6 Ifverse, 3 RicksClips3000, 2 Day One Films, 2 PsychToons, plus this one), the analysis, and the fetch script (YouTube's InnerTube `next` endpoint; `yt-dlp` is blocked by the bot check) |

## What makes their graphics feel premium

| Area | What they do |
|---|---|
| **Shadows** | Never grey or black. Shadows shift toward a saturated indigo (about `#1F1A2C`, `#131728`). |
| **Rim light** | A 2–4 px inner rim on characters: cool cyan/blue (`#88A0FF`) in void or night scenes, warm amber (`#FFAE42`) near light sources. It separates dark figures from dark backgrounds. |
| **Texture** | A fine grain at 3–5% opacity over everything, so nothing looks like flat digital vector. Paper props are off-white with soft gradients. |
| **Accent colour** | One bright accent per hero (the red hoodie). Gold is reserved for energy, UI and key props. |
| **Energy objects** | No black outlines; they get glowing edges instead. Glow is two layers: a white-hot core plus a wide soft halo. |
| **Light spill** | Light from a source (rift, lantern) falls off onto the surrounding wall as a gradient. Hairline cracks and floating shard debris add detail. |
| **Contact shadows** | A soft dark ellipse under every foot and prop. |
| **Motion** | Constant idle breathing (2–3% scale); blinks every 2.5–4 s; secondary motion lagging about 2 frames; impacts with 1-frame squash, then 2-frame overshoot; slow ambient drift of debris; UI cards pop from 95% to 100% scale over 8–10 frames. |
| **Characters** | Black stick figures with a light outline, white eyes and colourful clothes. A strong set of faces: crying streams, ring-eyed shock, crescent relief, slash-browed anger. |

## What audiences say (1,602 comments; my keyword tally, likes in brackets)

| Topic | Comments | Likes |
|---|---|---|
| "Learned something" | 79 | 13,936 |
| Funny | 69 | 25,676 |
| Story | 71 | 7,326 |
| Animation | 60 | 6,328 |
| Quality / effort | 57 | 5,600 |
| Ending | 42 | 5,244 |
| **AI accusations** | **47** | **983** |
| Too long / slow | 41 | 3,736 |
| Inaccurate | 20 | 1,271 |

**Loved:**
- feeling seen and validated;
- relatable daily struggles;
- turning science into a story;
- practical "mind hacks" over motivational speeches;
- visual storytelling (palette shifts);
- heartfelt endings;
- recurring characters, a "universe".

**Disliked:**
- "AI slop" accusations, triggered by odd narration pauses, mispronunciations, em-dashes in the scripts and generic sound effects;
- logic gaps and inaccuracies, and vague dialogue;
- pacing that drags.

Our therapeutic, validating tone is exactly what the top comments reward.

## What we changed because of this study

All of this is in `ep03-how-money-actually-works/project/assets/`.

| Upgrade | Where | What changed |
|---|---|---|
| Indigo shadows and grain | `sr3d.js` | Shadows shift toward indigo instead of grey; fine 4% grain, re-seeded slowly |
| Idle breathing and contact shadows | `sr-v3.js` | Every character breathes when still; contact shadows are stronger |
| **16 new emotions** | `sr-v3.js` | `crying`, `laughing`, `terrified`, `starstruck`, `inlove`, `determined`, `confused`, `embarrassed`, `exhausted`, `furious`, `dizzy`, `sleepy`, `hopeful`, `proud`, `disgusted`. Each carries face effects (tear streams, drops, sweat, star, heart and spiral eyes, an anger mark, a red flush, trembling, dark circles, "Zzz", "?", sparkle eyes, blush) and blends into the next mood |
| **Black stick figures** | `sr-v3.js` | `skin: "ink"` gets an Ifverse-style light outline. The cast now mixes black and light figures |
| Environment effects | `sr-fx3d.js` | Dust motes, god rays and rain. Rifts too, only if a story needs one; the lessons in this table apply everywhere |
| Words that fit the mood | `sr-type.js` | Auto-fit, never overlap, kept off faces |
| Viral foley | `foley_kit.py` | Footsteps, crunch, gulp, slurp and game-feel sounds, with automatic footstep sync |
| **3D presenter** | `sr-host.js` | A realistic satin stick figure that walks scenes, makes eye contact with the camera, is lip-synced to the narration and gestures into the examples |

## Lessons for scripts (from the comments)

- Hook with a "this is uncomfortably accurate" moment, and make viewers feel seen.
- Give one practical tool rather than a speech.
- End on a human connection.
- Avoid AI tells:
  - check pronunciations and pauses in the TTS;
  - no em-dash-heavy narration;
  - original, specific foley rather than generic stings;
  - fact-check every claim, as we already do.
- Build recurring characters (Mo, Ana, Bea, Finn, Mr. Penny, Kai), so viewers come back for the "universe".
