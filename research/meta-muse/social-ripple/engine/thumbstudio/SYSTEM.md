# The thumbnail system
Every episode's thumbnail must portray its concept at phone size in about one second. Five steps, same every time:

1. **BRIEF.md** (written from the script, before production). It covers:
   - the premise in one sentence;
   - the **visual device** (threads, inner weather, thought bubbles…);
   - the hero and their emotion;
   - **what the background crowd shows** (the background *is* the topic);
   - the interface element (a counter or tags);
   - 3–5 first-person text options;
   - two variant ideas;
   - a brand guard (no shame or fear).
   See `ep7/BRIEF.md`.
2. **Spec, as JSON:**
   - `bg`: a CSS gradient or a full-bleed image;
   - `crowd`: the look, position, scale, mood, pose and facing of each person, plus `over` props (heart, spark, sandwich, sun, cloud, rain, storm) and an optional `say` bubble;
   - `crowdOpacity` (translucent supporting cast);
   - `connect` (threads from a point to every crowd member);
   - `hero` (solid, rim-lit, with optional `over` props);
   - `props`, `text` lines (`punch` = yellow), `counter`.
   See `ep7/ep7_A.json`.
3. **Render:** `node make.cjs ep7/ep7_A.json ep7/ep7_B.json` produces the PNGs, phone-size copies and a `sheet.png`.
4. **AI review:** `python -I review.py ep7/premise.txt ep7/ep7_A.png ep7/ep7_B.png`.
   - The reviewer guesses the topic from the phone-size image **before** it's told the premise.
   - It then scores concept clarity, how well the frame is filled, phone readability and curiosity, and lists 3 fixes.
   - **Gate:** concept clarity ≥ 7 and frame fill ≥ 8, or iterate.
5. **Ship two variants** for Test & Compare, and record which won in the episode's UPLOAD-KIT.

Rules: see `THUMBNAILS.md`. Calibration so far:
- Ep6 v4 scored 4/10 on concept clarity, because "energy threads" read as infection or a superpower.
- Adding **hearts** where each thread meets a person fixed the meaning ("kindness").
- Lesson: every connector or prop should carry the episode's *emotion*, not just its mechanics.
