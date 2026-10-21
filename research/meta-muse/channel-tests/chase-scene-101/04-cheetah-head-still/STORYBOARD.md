---
format: 1080x1920
duration: 40s
message: "At 61 mph a cheetah's body thrashes, but its head stays still: its inner ear keeps its eyes locked on prey."
arc: slow-motion anatomy reveal
audience: curious adults 45+ plus younger animal-chase viewers
mode: autonomous
music: none
---

## Video direction

- **Voice first:** the narration was recorded first; every beat below is timed to its word timings (PROJECT_DIR/audio_meta.json, seconds relative to each frame start).
- **Footage:** "Cheetahs on the Edge" (Gregory Wilson, 2012, Cincinnati Zoo, filmed at 1,200 fps; CC BY 3.0), pre-cut into tracked 1080x1920 composites in public/clips/.
- **Motion-graphics tracking:** every overlay that points at the animal follows the per-frame tracking data in public/clips/sN.json (composite pixel coordinates).
- **Global banner** (y 110–460) is added by the orchestrator — keep that zone empty. Captions own y ≥ 1560.
- **Ending:** frame 7 holds 3 s after the last word, with an end title and a gentle dim — the video must never feel cut off.

## Frame 1 — Hook — slowed 60×

- scene: public/clips/s1_raw.mp4 with tracked HUD overlays.
- voiceover: "This is a cheetah at sixty-one miles an hour, slowed down forty times."
- duration: 4.958s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: explanation
- persuasion: Show, don't tell (tracked evidence)
- beat: Wonder
- blueprint: camera-journey (Adapt)
- focal: the tracked feature named in the voiceover
- roles: footage public/clips/s1_raw.mp4 (window layout, footage window y 640–1248, 0–4.958 s) = background ground layer · tracked red reticle on the HEAD (s1.json head) snapping in at 0.3 s with a 'HEAD' pill that follows it · telemetry readout block over the dark zone above the window (y≈500–620): '1,200 FPS' and 'REAL TIME 0.000 S' counting up at exactly t/60 (seek-safe) · on '60' (3.52 s) a red stat slam '60× SLOWER' (Courier Prime 700, ~120px) in the lower dark zone y≈1300–1460 · thin red speed ticks streaming right-to-left along the window's top/bottom edges

Scene 1 (0–0.3 s): footage only (no blank — the clip is visible at t=0). Scene 2 (0.3–3.4 s): reticle + HEAD pill track the head; readouts type on at 0.5 s and the real-time counter ticks. Scene 3 (3.52–4.96 s): '60× SLOWER' slams (scale 1.25→1, expo.out, 1-frame red flash).

## Frame 2 — The spine is a spring

- scene: public/clips/s2_raw.mp4 with tracked HUD overlays.
- voiceover: "Watch the spine. It coils and snaps open like a spring, flinging each stride out to about seven meters."
- duration: 7.027s
- transition_in: cut
- status: outline
- src: compositions/frames/02-spine.html
- type: explanation
- persuasion: Show, don't tell (tracked evidence)
- beat: Wonder
- blueprint: camera-journey (Adapt)
- focal: the tracked feature named in the voiceover
- roles: footage public/clips/s2_raw.mp4 (window layout, y 640–1248) = background ground layer · the SPINE: s2.json spine polyline (14 points) drawn as a 6px red path that draws on at 'spine.' (0.48 s) and then follows the back every frame (rebuild the SVG path d from the data) · a 'SPINE' pill anchored to the polyline's middle point · on 'spring,' (3.2 s) pill text becomes 'SPINE = SPRING' and a small coil glyph (SVG zig-zag) pulses once beside it · on 'seven meters' (5.68 s) a horizontal dimension line with end ticks draws across the lower dark zone (y≈1320, x 90→990) labelled '≈ 7 M (23 FT) PER STRIDE' in Courier Prime

Scene 1 (0–1.2 s): footage + 'Watch the spine' — path draws on. Scene 2 (1.2–3.8 s): path flexes with the animal; SPRING label. Scene 3 (3.8–7.03 s): stride dimension line + label; hold.

## Frame 3 — Airborne twice

- scene: public/clips/s3a_raw.mp4 for 0–2.0 s, then public/clips/s3b_raw.mp4 for 2.0–3.827 s with tracked HUD overlays.
- voiceover: "Twice in every stride, all four feet leave the ground."
- duration: 3.827s
- transition_in: cut
- status: outline
- src: compositions/frames/03-flight.html
- type: explanation
- persuasion: Show, don't tell (tracked evidence)
- beat: Wonder
- blueprint: camera-journey (Adapt)
- focal: the tracked feature named in the voiceover
- roles: footage public/clips/s3a_raw.mp4 for 0–2.0 s, then public/clips/s3b_raw.mp4 for 2.0–3.827 s (two <video> clips back to back, each its own class='clip' with its own data-start/data-duration; both window layout y 640–1248). Each clip has a built-in FREEZE (frames flagged frozen:true in its json: s3a ≈0.90–1.50 s, s3b ≈0.50–1.10 s of the clip) = background ground layer · during each freeze: a 0.08 s white flash over the window, a white dashed GROUND line under the lowest paw (paw y from json + 10px) spanning the window, small red vertical gap brackets between paws and line, and a stamp 'FLIGHT 1' (first freeze) / 'FLIGHT 2' (second freeze) in a red-bordered pill · after the second freeze the caption-free label 'ALL 4 FEET OFF THE GROUND' types on in the lower dark zone (y≈1320) and holds

Scene 1 (0–2.0 s): clip A, freeze 1 with FLIGHT 1. Scene 2 (2.0–3.83 s): hard cut to clip B, freeze 2 with FLIGHT 2, then the label.

## Frame 4 — Claws and tail

- scene: public/clips/s4a_raw.mp4 for 0–3.9 s, then public/clips/s4b_raw.mp4 for 3.9–6.75 s with tracked HUD overlays.
- voiceover: "Its claws never fully retract, so they grip like running spikes. And the long tail works like a rudder."
- duration: 6.750s
- transition_in: cut
- status: outline
- src: compositions/frames/04-grip-tail.html
- type: explanation
- persuasion: Show, don't tell (tracked evidence)
- beat: Wonder
- blueprint: camera-journey (Adapt)
- focal: the tracked feature named in the voiceover
- roles: footage public/clips/s4a_raw.mp4 for 0–3.9 s, then public/clips/s4b_raw.mp4 for 3.9–6.75 s (two clips back to back, window layout) = background ground layer · clip A: tracked ring on the planted PAW (s4a.json paw) with a leader line to a pill 'CLAWS · ALWAYS OUT' that appears on 'claws' (0.24 s); on 'running spikes' (2.96–3.36 s) the pill text becomes 'GRIP LIKE RUNNING SPIKES' and three tiny spike glyphs tick on beside it · clip B: tracked ring on the TAIL TIP (s4b.json tail) + a curved red arrow arcing around the tail, pill 'TAIL = RUDDER' on 'rudder' (5.76 s)

Scene 1 (0–3.9 s): paw ring + claw labels. Scene 2 (3.9–6.75 s): hard cut to the tail shot, tail ring + rudder label.

## Frame 5 — The head barely moves

- scene: public/clips/s5_raw.mp4 with tracked HUD overlays.
- voiceover: "But now, look at the head. The body is thrashing, yet the head barely moves."
- duration: 5.065s
- transition_in: cut
- status: outline
- src: compositions/frames/05-head.html
- type: explanation
- persuasion: Show, don't tell (tracked evidence)
- beat: Wonder
- blueprint: camera-journey (Adapt)
- focal: the tracked feature named in the voiceover
- roles: footage public/clips/s5_raw.mp4 (window layout y 640–1248) = background ground layer · two tracked markers: HEAD (red reticle, s5.json head) and HIPS (white ring, s5.json hip), each leaving a fading TRAIL polyline of its last ~40 positions (head trail red, hip trail white) — the head trail stays nearly flat while the hip trail waves · pills 'HEAD' and 'HIPS' · on 'thrashing' (2.16 s) the hip ring pulses; on 'barely moves' (3.6 s) a readout panel in the lower dark zone (y≈1290–1500): title 'UP-DOWN MOVEMENT · THIS CLIP', two horizontal bars HIPS (long, white) vs HEAD (short, red) at a 11:1 length ratio, and 'HIPS MOVE ~11× MORE' (measured from this footage's tracking) · source of the measurement shown as a tiny chip 'TRACKED FROM THIS FOOTAGE'

Scene 1 (0–1.0 s): 'look at the head' — head reticle snaps on at 0.5 s. Scene 2 (1.0–3.5 s): hip ring + both trails grow. Scene 3 (3.6–5.07 s): bars + ratio readout; hold.

## Frame 6 — An oversized balance organ

- scene: public/clips/s6_raw.mp4 with tracked HUD overlays.
- voiceover: "An oversized balance organ in its inner ear keeps its eyes locked on the target."
- duration: 5.705s
- transition_in: cut
- status: outline
- src: compositions/frames/06-inner-ear.html
- type: explanation
- persuasion: Show, don't tell (tracked evidence)
- beat: Wonder
- blueprint: camera-journey (Adapt)
- focal: the tracked feature named in the voiceover
- roles: footage public/clips/s6_raw.mp4 (FULL-BLEED layout: the cheetah coming at camera fills the frame) = background ground layer · tracked red reticle on the face (s6.json head) from 0.2 s · on 'balance organ' (0.96–1.44 s) a callout: a thin line from the head to an inset circle (r≈170, centre ≈ (300,1330), dark fill rgba(10,8,6,0.78), 2px red ring) in which a stylized INNER EAR draws on: three semicircular canal loops (SVG ellipses at 0°, 60°, 120°, white strokes, stroke-dashoffset draw) + a small spiral cochlea; label above the inset 'VESTIBULAR SYSTEM' and below 'UNUSUALLY LARGE IN CHEETAHS' · on 'eyes locked on the target' (3.84–4.72 s) a dashed red sight line from between the eyes toward the bottom-right edge, ending in a small 'TARGET · LOCKED' pill · source chip 'GROHÉ ET AL., SCI. REP. 2018' near the inset

Scene 1 (0–0.96 s): reticle on face. Scene 2 (0.96–3.3 s): callout + inner-ear diagram draws. Scene 3 (3.3–5.7 s): sight line + LOCKED; hold.

## Frame 7 — Its world stays still

- scene: public/clips/s7_raw.mp4 with tracked HUD overlays.
- voiceover: "So even at sixty-one miles an hour, its world stays perfectly still."
- duration: 7.608s
- transition_in: cut
- status: outline
- src: compositions/frames/07-ending.html
- type: explanation
- persuasion: Show, don't tell (tracked evidence)
- beat: Wonder
- blueprint: camera-journey (Adapt)
- focal: the tracked feature named in the voiceover
- roles: footage public/clips/s7_raw.mp4 (LOCK layout: full-bleed crop that keeps the HEAD fixed at ≈ (670, 768) while the body and ground move) = background ground layer · a fixed thin white crosshair centred on the locked head (use s7.json head — it barely moves) with readout 'HEAD · LOCKED' and a tiny live 'Δ 0' style indicator · on 'perfectly still.' (3.52–4.6 s) the crosshair ring tightens once · ENDING (the voice ends at 4.6 s; this frame lasts 7.608 s — the last 3.0 s are a deliberate breathing ending, never cut short): from 5.0 s overlays fade out over 0.6 s; from 5.6 s a centred end title fades up in the lower dark-ish area (y≈1300–1480): 'THE CHASE SCENE 101' (Source Sans 3 700, 54px, white) and below it 'Footage: Gregory Wilson, “Cheetahs on the Edge” · CC BY 3.0' (Courier Prime 26px, 75% white); the whole picture gently dims (a black overlay 0→0.45 opacity) over 6.0–7.6 s. Nothing else moves; the music resolves.

Scene 1 (0–4.6 s): locked head, body thrashing around it; crosshair + LOCKED. Scene 2 (4.6–5.6 s): hold, overlays fade. Scene 3 (5.6–7.6 s): end title + gentle dim. The video's final frame is this calm title over the dimmed cheetah.

