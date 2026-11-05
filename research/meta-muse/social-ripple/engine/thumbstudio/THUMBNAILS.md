# Thumbnail rules (from the niche study, 2026-11-05)
Reference: `niche-board.jpg` (Stick Saga + Jeremy Bearimy hits and flops vs. our Ep4–6) and `phone-size-comparison.png`.

**Stick Saga** has only 834 subscribers but got 249K views on one video. When subscribers can't explain the reach, it's coming from the title and thumbnail. Its flops (314 and 653 views) are dark, sleepy and lack attitude.

## What the hits do (and we now do)
1. **Illustration, not a screenshot.** Crisp vector characters (our rig is already SVG). No depth-of-field blur, no film grade, no baked-in counters or captions.
2. **One hero, big, with attitude.** They fill 40–60% of the frame, and the face reads at phone size: starstruck, smug, sly, "shh", determined. Avoid neutral or worried as the main hero face.
3. **Neon colour backdrop** (purple/pink, blue/orange) with a radial glow behind the hero and a **rim light** around them (`filter: url(#rim)`).
4. **First-person text in the hero's voice**, 1–3 words, huge, white with a yellow punch word, thick black stroke and drop shadow, **no box**: "I DID THAT?", "I INVENTED LYING.", "I HEARD THAT."
5. **The premise as a game interface:** counters ("LIVES TOUCHED 347"), labels over heads ("STAYED / WELCOMED / HELPED"), rewind displays, tags.
6. **Readable at 246×138 px** (phone size). Check every thumbnail at that size before shipping.

## What we keep from our brand
- Our cast, lore and Crumb Island palette (gold threads, island light).
- No shame or fear framing. Attitude means wonder, mischief and confidence, never humiliation.

## How to make one
- Copy `ep6_A.html` and change the hero (`TS.char`), the props (`TS.thread`, `TS.label`, the counter div) and the text.
- Render with `node shot.cjs file.html` to get a 1280×720 PNG. Export JPG at `-q:v 2`.
- Make 2 variants for YouTube Test & Compare: one with a single hero and labels, one built around a prop or interface element.
