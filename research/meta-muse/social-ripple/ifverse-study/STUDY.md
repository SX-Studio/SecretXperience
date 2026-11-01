# Ifverse, studied for looks: art style, lighting, camera, branding (2026-11-01)

## The channel in numbers

[Ifverse (@IfverseTales)](https://www.youtube.com/@IfverseTales) has **58.1k subscribers**, 15 long videos and 13 Shorts. Its first upload was about mid-October 2026, and it now posts roughly one video a day.

| Video | Views |
|---|---|
| Reaction Time 10x | 4.6M |
| 500 IQ | 1.4M |
| One Second Felt Like Ten | 683k |
| 500 IQ to Disappear | 544k |
| Kindergarten | 413k |
| Newest uploads | 11k–73k |

Views are falling as the format repeats. Shorts get 8k–37k each. Long videos run 6–9 min, plus 20–25 min "FULL MOVIE" compilations of the multi-part stories.

Conner's video ([youtu.be/dMFbzJoSO6M](https://youtu.be/dMFbzJoSO6M)) shows that these films are written as **HTML/JS scenes by Claude Code**, rendered frame by frame, with an ElevenLabs voice. That is exactly our pipeline, so the gap between them and us is **art direction, not technology**.

Notes are in `forensics/`:
- `conner.md`: his rebuild, prompts and settings;
- `f_*.md`: story beats of three films;
- `v_*.md`: high-resolution visual breakdowns of three films.

`ifverse-thumbnails-by-views.jpg` shows all 15 thumbnails, ranked by views.

## 1. Art style

- **Characters:**
  - pure black round heads with white eyes and **white eyebrows**;
  - one bright hoodie (the hero's is red, about #D33D3D) with a **hard-edged flat cel shadow** in a darker red, no gradients;
  - mitten hands and thin dark limbs.
- **The signature: a white four-point star glint in one eye.** It appears in almost every thumbnail and on every "I know" beat.
- **Backgrounds:** flat shapes on **smooth vertical gradients**, mostly dusk and night (deep navy and purple, up to orange at the horizon). Buildings are silhouettes with warm lit windows. Layers are separated by blur, not by detail.
- **Restraint:** few objects per frame, and every frame has one bright subject.

## 2. Lighting (the biggest gap)

- **A two-colour rim light**: cyan on one side and warm amber on the other, about 2–3 px, on the hero in almost every shot.
- **Light sources glow** (bloom): eyes, screens, lamps, portals, rifts.
- **Light shafts and haze**: translucent angled shapes in dark rooms.
- **Shadows are tinted** dark purple, never pure black, so dark frames stay rich.
- **The palette changes with the mood**:
  - ordinary life is warm and brown;
  - "power on" is dark blue with neon yellow and cyan;
  - danger is deep red;
  - the payoff is warm gold.
- **A strong vignette**, with one complementary pair per frame (orange key light, blue fill).

## 3. Camera

- **About 20–30 shots per minute.**
- **Slow push-ins** (1–3 s, ease-out) while explaining; **crash zooms** (under 0.2 s) on realisations and jokes; **whip-pans** masked by motion blur between beats.
- **Top-down shots** (sometimes rotating) for table-top action.
- **Rack focus**: depth of field moves to lead the eye.
- **Parallax tracking** with the background moving slower, and slow motion for "power" moments.
- **Impact frames**: a white flash, expanding rings and a hint of colour fringing.
- **Interface overlays**: thin neon cyan and yellow lines, a bottom-left location tag ("| THE STILL"), and "RULE 1" cards.

## 4. Profile picture and banner

- **Banner:** a night sky going from navy to purple to a magenta horizon, a moon with a halo, and five glowing doors (each a different world) throwing coloured light onto dark ground. A tiny figure walks through the centre door. The wordmark is spaced-out, cream-to-orange caps, with "EVERY WHAT IF BECOMES A STORY" underneath.
- **Profile picture:** the same idea reduced to one glowing door, the moon and the figure. It reads at 40 px because it is one bright shape on dark.

## Where we stood

| | Ifverse | Social Ripple (episode 2) |
|---|---|---|
| Palette | dusk and night, saturated, changing by mood | flat daylight pastels |
| Rim light | two colours on the hero in every shot | none (v3 test: one warm colour) |
| Light sources | glow, shafts, haze | painted, no glow |
| Eyes | four-point star glint | none |
| Camera | 20–30 cuts a minute, crash zooms, rack focus | one move per scene (v3 test fixed this) |
| Branding | cinematic night, one light idea | daytime street, busy |

## What we built today

- **`style-frame-night.png`**: our characters in the Ifverse lighting language.
  - a dusk-to-night sky, a halo moon, a defocused city with warm and cyan windows;
  - a **cyan rim from the streetlamp** on the left and an **amber rim from the café window** on the right;
  - a glowing gold ripple from the hand-off, and a star glint in Nia's eye;
  - wet-street reflections, floating dust, a blurred foreground post, a grade and a vignette.
- **`new-branding/`**: the **v2 banner and profile picture**.
  - Same night-cinematic language, but our own idea: **gold ripples spreading across water** from Nia's feet at dusk, the city glowing behind, and the butterfly.
  - Wordmark "SOCIAL RIPPLE / EVERY SMALL ACT TRAVELS", kept inside YouTube's banner safe zone (centre 1546×423).
  - `branding-before-after.jpg` compares old and new.
- **`sources/`**: the code, including `cine.js` with reusable dual rim, bloom, glint, sky, pools, shafts and blur.

## Upgrades for episode 3 on

1. Use the dusk and night palettes as the default, and change them per act.
2. Give the hero two-colour rim light in every shot, with lighter rims on the background cast.
3. Make every light source glow, and add shafts or haze in interiors.
4. Use the eye glint for "I get it" moments, and as the thumbnail signature.
5. Keep v3's camera grammar (20–30 cuts a minute) and add crash zooms and impact frames.
6. Thumbnails: one hero face, dark background, one glowing prop, a 2-word caps hook in white and yellow.

Don't copy their doors, red hoodie or "What If…" title formula. We keep our own world: ripples, a recurring cast, real research.
