---
format: 1080x1920
duration: 72s
message: "The most famous signal ever caught from space lasted 72 seconds, and never came back."
arc: story-explainer with process
audience: curious general viewers scrolling Shorts / TikTok / Reels
mode: autonomous
music: none
---

## Video direction

- **Register:** dark register throughout (ground ink-black #111111, text cream #F0ECE5, accent fire-orange #E85D26). One exception: Frame 6 ("WOW") flips to the orange register for its whole duration — the only orange-ground frame, so it lands as the film's single shout.
- **Type:** Barlow 900 lowercase for hero words and numbers (display / fadelist-title / stat-value ramp); IBM Plex Mono uppercase 0.14em for every label, timestamp, kicker and the printout characters. The printout recreation uses IBM Plex Mono in cream-muted, with only "6EQUJ5" lifted to cream and later to fire-orange.
- **Recurring motifs (the film's spine):** (1) a mono timestamp chip top-left `T+ 00.0 s / 72.0` and (2) a 1px hairline "transit curve" across the top band are added globally by the orchestrator on an overlay track — workers must keep the top 9% of the frame clear of hero content (kickers may sit just below it). (3) A sparse deterministic starfield may sit at 20–35% opacity behind dark frames as the "sky" (frames 1, 7, 9, 10, 11, 12).
- **Motion grammar:** long-tail power3 settles, never bouncy. Reveal every piece on its spoken cue; nothing front-loaded. Holds are still; only subtle jitter allowed (the printout characters may flicker very slightly like a phosphor/print head — low amplitude, seeded). No slow push/pan in back halves. Seams inside frames are velocity-matched cuts.
- **Held / breather frames:** Frame 6 (WOW — a 2.5 s silent slam then stillness), Frame 9's back half ("Nothing." holds on near-empty dark), Frame 12 (end card, long stillness then fade to black).
- **Negative list:** no purple/blue AI gradients, no bokeh, no fake real-photo of the printout or telescope (all drawings are flat, hairline, Broadside style), no alien imagery or "aliens?" text, no bouncy overshoot, no screensaver floating, no slideshow front-load-then-freeze, no lowercase in mono labels, nothing important in the bottom 17% caption band.
- **Truth rules:** every number on screen comes from SCRIPT.md / visible-text.txt. Printout is labelled `RECREATION` in a mono kicker.

## Frame 1 — Seventy-two seconds

- scene: Static noise field resolves into a single hero number "72" and the word "seconds"; a second line promises this video lasts exactly that long.
- voiceover: "In 1977, something in deep space broke through the static for seventy-two seconds. This video lasts exactly that long."
- duration: 8.457s
- transition_in: cut
- status: animated
- src: compositions/frames/01-seventy-two-seconds.html
- type: hook
- persuasion: Shocking statistic + self-referential frame (the runtime is the proof)
- beat: Intrigue + surprise
- blueprint: kinetic-type-beats (Adapt)
- focal: the hero number "72"
- roles: deterministic static-noise dot field = background (dim ~35%, thins out as the number arrives) · "72" = foreground subject · "seconds" + mono kicker "AUG 15 1977 · BIG EAR" = supporting · line "this video lasts exactly that long." = supporting
- sfx: none (score carries it)

narrativeRole: Opens the curiosity gap and makes the video's own length the hook.
keyMessage: A signal from space lasted 72 seconds — and you're about to live through all of them.

Adapt: keep kinetic-type-beats' statement-builds-to-payoff signature; the payoff word is a number that emerges FROM noise.
Scene 1 (0.0–1.6s): full-bleed field of tiny cream dots flickering like radio static (seeded, deterministic), centered upper-middle; mono kicker "1977" types on at the upper third as the VO says "In 1977".
Scene 2 (1.6–4.2s): on "broke through the static" the dot field collapses inward (cluster→outward expansion, reversed: dots converge) toward y≈0.42H and resolves into a massive Barlow 900 "72" in cream (display ramp, ~60% frame width); dots outside thin to near-nothing.
Scene 3 (4.2–5.0s): "seconds" lands beneath in h2 lowercase on its cue; the "72" turns fire-orange with a soft ambient glow bloom.
Scene 4 (5.0–8.4s): on "This video lasts exactly that long." a mono line types on beneath: "THIS VIDEO: 72.0 S"; hold still (subtle jitter on static remnants only).

## Frame 2 — Big Ear is listening

- scene: A flat hairline drawing of the Big Ear telescope (a long flat reflector and a tilted flat reflector with the receiver between) under the sky; a print head starts printing characters.
- voiceover: "August fifteenth. Ohio State's Big Ear telescope listens to the sky, and a computer prints what it hears."
- duration: 6.879s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-big-ear-listening.html
- type: product_intro
- persuasion: Concretization (abstract "radio telescope" → a drawn machine and a printer)
- beat: Orientation + anticipation
- blueprint: compose
- focal: the hairline Big Ear drawing
- roles: Big Ear line drawing = foreground subject (fills ~55% width, centered y≈0.40H) · faint concentric "radio" arcs descending from sky = supporting · mono kicker "OHIO STATE UNIVERSITY · DELAWARE, OHIO" = supporting · strip of printer paper with tractor-feed holes = supporting (enters last)
- sfx: none

narrativeRole: Introduces the protagonist machine and the printout that will hold the evidence.
keyMessage: A fixed radio telescope in Ohio turned what it heard into printed characters.

Scene 1 (0.0–1.4s): mono date chip "AUG 15 1977" types on below the top band; dark ground.
Scene 2 (1.4–3.6s): on "Big Ear telescope" the telescope draws itself (SVG self-draw) left to right: a long flat ground plane, a tilted flat reflector at left, a curved standing reflector at right; label "BIG EAR" in mono.
Scene 3 (3.6–4.8s): on "listens to the sky" three thin cream arcs descend from the top toward the reflector, one after another (sequential reveal), very slow.
Scene 4 (4.8–6.8s): on "a computer prints what it hears" a narrow strip of printer paper with tractor-feed holes slides up from the lower edge (stops above the caption band) with the first row of mono characters printing; hold.

## Frame 3 — Six characters

- scene: The recreated printout scrolls: columns of 1s, 2s, 3s and blanks; then six characters arrive vertically in one column — 6 E Q U J 5.
- voiceover: "Most of the page is noise. Then, six characters. Six. E. Q. U. J. Five."
- duration: 5.876s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-six-characters.html
- type: feature_showcase
- persuasion: Progressive disclosure + demonstration (the printout itself)
- beat: Tension → recognition
- blueprint: compose
- focal: the vertical column "6 E Q U J 5"
- roles: printout recreation (mono grid, ~10 columns × ~14 rows, cream-muted on ink-black-alt paper panel filling ~70% width) = background/stage · the six characters = foreground subject (cream, larger, one per row in one column) · kicker "RECREATION · IBM 1130 PRINTOUT" = supporting
- sfx: none

narrativeRole: Shows the raw evidence and how it hid in noise.
keyMessage: Out of a page of noise came one column: 6EQUJ5.

Scene 1 (0.0–1.8s): the paper panel fills center (top 10%–80% of frame); rows of mostly "1", "2", "3", spaces print row-by-row from the top (discrete text sequence, like a line printer) as the VO says "Most of the page is noise"; values deterministic (seeded), low digits only.
Scene 2 (1.8–2.6s): "Then, six characters." — printing pauses; all other characters dim to cream-hint (depth-of-field blur on the noise).
Scene 3 (2.6–6.0s): each of 6, E, Q, U, J, 5 prints in ONE column (column 2 of the grid), one per spoken cue, cream and slightly larger than the noise digits; after the "5" the six hold; subtle print-head flicker only.

## Frame 4 — Every letter means louder

- scene: The six characters peel off the printout and become a bar chart: blank/1-9/A-Z intensity scale, U's bar towering at 30.
- voiceover: "Every letter means louder. U means thirty times louder than the background."
- duration: 4.489s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/04-every-letter-louder.html
- type: social_proof
- persuasion: Data-viz translation (code → magnitude) + anchoring on "background = 1"
- beat: "Aha" + fascination
- blueprint: dataviz-countup (Adapt)
- focal: the six-bar chart with U at 30
- roles: six vertical bars labelled 6 E Q U J 5 (values 6, 14, 26, 30, 19, 5) = foreground subject, filling ~75% width, baseline at y≈0.66H · a hairline at value 1 labelled "BACKGROUND" = supporting · count-up "30×" hero number above U = foreground payoff
- sfx: none

narrativeRole: Turns letters into loudness so the viewer feels the spike.
keyMessage: U = 30 times the background noise.

Adapt: keep dataviz-countup's land-on-one-hero-metric signature; the hero metric is U's bar, the chart is the printout decoded.
Scene 1 (0.0–1.6s): six mono labels sit on a baseline; on "Every letter means louder" the bars grow in sequence left to right (bars-and-fills stagger), cream, heights proportional to 6/14/26/30/19/5; a tiny scale legend "0–9 · A=10 … Z=35" in mono under the baseline.
Scene 2 (1.6–2.6s): on "U" its bar turns fire-orange, others dim to cream-hint.
Scene 3 (2.6–4.5s): "thirty times" — a count-up 1→30 lands as "30×" in stat-value Barlow 900 above the U bar; on "the background" a dashed hairline appears at height 1 labelled "BACKGROUND"; hold.

## Frame 5 — Circled in red

- scene: Back to the printout; a hand-drawn fire-orange circle draws around 6EQUJ5 and a margin note begins to write.
- voiceover: "Days later, volunteer Jerry Ehman circled it in red, and wrote one word."
- duration: 4.916s
- transition_in: crossfade
- status: animated
- src: compositions/frames/05-circled-in-red.html
- type: feature_showcase
- persuasion: Human anchor (a named person's reaction carries the meaning)
- beat: Recognition + anticipation
- blueprint: compose (registry component marker-highlight for the circle)
- focal: the hand-drawn circle around the column
- roles: printout recreation (same stage as Frame 3, zoomed so the six characters are large, ~45% height) = background · hand-drawn fire-orange circle = foreground subject · mono caption "JERRY R. EHMAN · VOLUNTEER" = supporting
- sfx: none

narrativeRole: The human moment — someone noticed.
keyMessage: A volunteer found it days later and marked it.

Scene 1 (0.0–1.6s): printout stage, six characters cream, the rest dim; mono kicker "DAYS LATER" types on.
Scene 2 (1.6–2.8s): on "Jerry Ehman" his name label types on in mono at upper right.
Scene 3 (2.8–4.0s): on "circled it in red" a wobbly hand-drawn fire-orange ellipse draws around the six-character column (SVG self-draw, one stroke, slight overshoot of the start point like a real pen).
Scene 4 (4.0–4.8s): on "wrote one word" the pen tip (a small orange dot) moves to the right margin and hesitates; hold — the word itself is withheld for Frame 6.

## Frame 6 — Wow!

- scene: Full orange register; the handwritten "Wow!" fills the frame.
- voiceover: ""
- duration: 2.5s
- transition_in: cut
- status: animated
- src: compositions/frames/06-wow.html
- type: benefit_highlight
- persuasion: Withheld payoff (the word lands without narration)
- beat: Delight + awe
- blueprint: kinetic-type-beats (Adapt)
- focal: the word "Wow!"
- roles: orange ground = background · "Wow!" = foreground subject (hand-lettered feel: Barlow 900 lowercase-styled "wow!" in ink-black, slightly rotated −4°, ~80% width, centered y≈0.42H) · mono label "MARGIN NOTE, AUG 1977" = supporting
- sfx: none

narrativeRole: The emotional peak — the famous word.
keyMessage: "Wow!"

Adapt: one hard-cut slam, spring-free power3 settle, then stillness — the frame is a silent beat.
Scene 1 (0.0–0.6s): hard cut to orange; "wow!" scales from 1.08 to 1.0 with a fast expo settle and a brief ink-on-orange underline stroke drawing under it.
Scene 2 (0.6–2.5s): mono label types on underneath; absolute stillness otherwise.

## Frame 7 — Why 72 seconds

- scene: The Earth turns; Big Ear's narrow beam sweeps across a star point; the intensity draws a rising-and-falling curve over a 0–72 s axis; the real six points land on the curve.
- voiceover: "Big Ear couldn't move. Earth's spin swept the sky past it, so anything out in space would rise and fall over seventy-two seconds. This did."
- duration: 9.289s
- transition_in: crossfade
- status: animated
- src: compositions/frames/07-why-72-seconds.html
- type: feature_showcase
- persuasion: Causal chain (fixed dish → Earth's spin → 72 s sweep → matching curve) + demonstration
- beat: Comprehension + conviction
- blueprint: compose
- focal: the 72-second transit curve with the six data points
- roles: upper half = a small Earth disc (hairline circle, slow rotation via longitude lines) with a fixed beam wedge pointing up into a starfield = supporting diagram · lower half = chart axis 0–72 s with a bell-shaped curve = foreground subject · six orange dots (6,14,26,30,19,5 at ~12 s spacing) = foreground payoff · kickers "FIXED DISH" / "EARTH'S SPIN" = supporting
- sfx: none

narrativeRole: The proof that it came from the sky, not from Earth.
keyMessage: A source in space would rise and fall over 72 seconds — and the signal did exactly that.

Scene 1 (0.0–1.8s): "Big Ear couldn't move." — upper diagram: Earth disc with the dish marker on its rim and a fixed beam wedge; kicker "FIXED DISH" types on.
Scene 2 (1.8–4.0s): "Earth's spin swept the sky past it" — the Earth's longitude lines rotate (live SVG internals), starfield drifts across the beam right-to-left; kicker "EARTH'S SPIN".
Scene 3 (4.0–7.4s): "rise and fall over seventy-two seconds" — lower chart: axis 0 → 72 S draws, then the bell curve self-draws left to right in cream as one bright star crosses the beam above (the two are synchronized).
Scene 4 (7.4–9.4s): "This did." — six fire-orange dots pop onto the curve (smooth settle, staggered) and the label "6EQUJ5" in mono sits beside the peak; hold.

## Frame 8 — The hydrogen line

- scene: A frequency dial / spectrum strip; a single sharp spike stands at 1420 MHz with an "H" hydrogen atom glyph.
- voiceover: "It sat near fourteen twenty megahertz, the natural frequency of hydrogen."
- duration: 4.831s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/08-hydrogen-line.html
- type: social_proof
- persuasion: Anchoring on a familiar referent (hydrogen, the simplest atom) + count-up
- beat: Fascination
- blueprint: dataviz-countup (Adapt)
- focal: the counter "1420 MHz"
- roles: horizontal spectrum strip with tick marks (1400–1440 MHz) = background stage across the middle · a single narrow spike at 1420 = foreground · count-up number "1420" + "MHZ" = foreground hero (stat-value, fire-orange) · hydrogen atom glyph (one nucleus dot + one orbit ring) and label "HYDROGEN" = supporting
- sfx: none

narrativeRole: Adds the eerie detail — it sat on nature's own channel.
keyMessage: It was at 1420 MHz, the frequency hydrogen naturally emits.

Scene 1 (0.0–2.4s): spectrum strip draws across mid-frame; a counter ticks 1400 → 1420 in Barlow 900 above it as the VO says "fourteen twenty megahertz"; a cursor line slides along the strip with the count; at 1420 a sharp spike shoots up.
Scene 2 (2.4–4.8s): on "hydrogen" the atom glyph self-draws beside the spike and "HYDROGEN · 1420.4 MHZ" mono label types on; hold.

## Frame 9 — Heard once

- scene: Two receiver channels as two horizontal lanes; lane A shows the curve; lane B, where it should repeat minutes later, stays flat; then decades of search years tick past and "nothing."
- voiceover: "Big Ear had two receivers. It should have heard the signal twice. It heard it once. Decades of searching since. Nothing."
- duration: 7.241s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-heard-once.html
- type: pain_point
- persuasion: Expectation vs reality (the empty second lane) + held silence
- beat: Unease
- blueprint: compose
- focal: the empty second lane
- roles: two stacked lanes (stacked vertically, upper-middle) labelled "HORN 1" / "HORN 2" = foreground subject · the bump in lane 1 = supporting · a ghost dashed bump outline in lane 2 where it should be = foreground (the absence) · year ticker "1977 → 2024+" = supporting · word "nothing." = final hero
- sfx: none

narrativeRole: The mystery's tension — it never repeated.
keyMessage: It should have appeared twice; it appeared once, and never again.

Scene 1 (0.0–1.6s): "two receivers" — two stacked lanes draw (hairlines) with mono labels HORN 1 / HORN 2.
Scene 2 (1.6–3.4s): "should have heard the signal twice" — a dashed ghost bump draws in each lane, offset in time (lane 2 a few minutes later on a shared time axis labelled "~3 MIN").
Scene 3 (3.4–4.6s): "It heard it once." — lane 1's ghost fills solid cream; lane 2's ghost stays dashed and fades to cream-hint.
Scene 4 (4.6–6.2s): "Decades of searching since." — lanes recede (fade + slight scale down), a mono year ticker counts 1977 → 2024 quickly.
Scene 5 (6.2–7.4s): "Nothing." — lowercase "nothing." in h1 cream-muted at y≈0.42H; everything else gone; held stillness.

## Frame 10 — A natural cause?

- scene: A diffuse hydrogen cloud (soft dot cloud) sits in the dark; a magnetar (small bright point) flashes; the cloud briefly brightens along a narrow line; a question-mark-weight "maybe."
- voiceover: "In 2024, researchers proposed a natural cause. A hydrogen cloud, briefly lit by a burst from a magnetar. Maybe."
- duration: 8.671s
- transition_in: crossfade
- status: animated
- src: compositions/frames/10-natural-cause.html
- type: benefit_highlight
- persuasion: Counter-hypothesis (natural explanation) + honest hedge
- beat: Clarity tinged with doubt
- blueprint: compose
- focal: the hydrogen cloud brightening
- roles: starfield background (dim) · hydrogen cloud = foreground subject (soft cream dot cloud, seeded, ~60% width at y≈0.38H) · magnetar = small orange point with a ring pulse at the left edge = supporting · mono kicker "2024 · MÉNDEZ ET AL. · PROPOSED" = supporting · "maybe." = final word
- sfx: none

narrativeRole: Offers the leading scientific explanation without overselling it.
keyMessage: A 2024 study suggests a hydrogen cloud lit by a magnetar burst — but it's unproven.

Scene 1 (0.0–2.6s): "In 2024, researchers proposed a natural cause." — kicker types on; the hydrogen cloud fades up dim (cluster→outward expansion of dots from center).
Scene 2 (2.6–4.4s): "A hydrogen cloud" — label "COLD HYDROGEN CLOUD" in mono beside it.
Scene 3 (4.4–6.6s): "briefly lit by a burst from a magnetar" — the magnetar point flashes at left; a single expanding ring travels across to the cloud (one finite ring); where it touches, a narrow band of the cloud brightens to cream then decays; label "MAGNETAR".
Scene 4 (6.6–8.6s): "Maybe." — "maybe." in h2 lowercase cream-muted lands below the cloud; hold.

## Frame 11 — We only heard it once

- scene: The hero "72" returns small and calm in fire-orange beneath the sky; the closing line lands in two parts.
- voiceover: "But for seventy-two seconds, the sky got loud. And we only heard it once."
- duration: 4.767s
- transition_in: blur-crossfade
- status: animated
- src: compositions/frames/11-heard-it-once.html
- type: branding
- persuasion: Callback (returns to the hook's "72") + distillation
- beat: Awe + resolve
- blueprint: kinetic-type-beats (Adapt)
- focal: the line "we only heard it once."
- roles: starfield (35%) = background · small "72 S" orange chip = supporting callback · two-part line in h1 lowercase cream = foreground subject
- sfx: none

narrativeRole: Lands the thesis as an image the viewer keeps.
keyMessage: It was real, it was loud, and it happened once.

Scene 1 (0.0–2.4s): "But for seventy-two seconds, the sky got loud." — "72 s" chip fades up at the upper third; line 1 "the sky got loud." per-word reveal at y≈0.40H.
Scene 2 (2.4–5.0s): "And we only heard it once." — line 2 per-word reveal under it; "once." in fire-orange; hold.

## Frame 12 — End card

- scene: The printout column "6EQUJ5" stands alone, the circle redraws once in orange; title and date sit beneath; slow fade to black.
- voiceover: ""
- duration: 4.084s
- transition_in: crossfade
- status: animated
- src: compositions/frames/12-end-card.html
- type: cta
- persuasion: Callback + memorable mark
- beat: Inevitability + quiet
- blueprint: titlecard-reveal (Adapt)
- focal: the circled "6EQUJ5"
- roles: starfield (20%) = background · circled vertical "6EQUJ5" in mono cream with orange circle = foreground subject · "the wow! signal" h2 lowercase + mono "AUG 15 1977 · 72 S · NEVER REPEATED" = supporting
- sfx: none

narrativeRole: Leaves a single emblem on screen and lets the film breathe out.
keyMessage: 6EQUJ5 — the Wow! signal.

Adapt: titlecard-reveal's one restrained move + still hold; the move is the circle drawing.
Scene 1 (0.0–1.2s): the vertical "6EQUJ5" fades up at center (y≈0.36H) and the orange circle self-draws around it.
Scene 2 (1.2–2.2s): title "the wow! signal" and the mono line fade up below.
Scene 3 (2.2–end): absolute stillness, then the whole frame fades to black over the last 1.2 s (this is the film's only real exit).
