---
version: alpha
name: Field Journal × Telemetry — Frame (video / frame layer)
description: >
  A naturalist's field journal brought to life for an older, curious audience: warm ivory paper,
  umber pen-and-ink illustration (public-domain plates), hand-written field notes, compass-drafted
  hairlines and rings, with a modern GPS-telemetry layer drawn over it in one signal red. Calm,
  authoritative, generous type sizes. Derived from the Cartesian preset (hairlines, rings, zero
  shadow) and re-skinned. Portrait 1080×1920.
unit: the frame — 1080×1920 portrait (9:16)
principle: atoms are sacred · composition is free · numbers come from the script · legibility first (older viewers)

colors:
  paper: "#EFE6D2"          # canvas / ground (warm ivory)
  paper-2: "#E4D7BC"        # panels, plate mats
  ink: "#2B2118"            # primary text + illustration ink (umber-black)
  ink-2: "#5C4A36"          # secondary text, field-note handwriting
  line: "#B9A98C"           # hairlines, grids, rings
  ochre: "#C9A15B"          # watercolor wash accent (savanna)
  olive: "#6E7B4E"          # watercolor wash accent (vegetation), secondary data
  telemetry: "#C2412D"      # GPS / data layer ONLY (tracks, speed needle, key numbers). Use sparingly.
  canvas: "#EFE6D2"

typography:
  # Older-audience legibility: nothing important below 34px on a 1080-wide frame.
  display:   { fontFamily: "Cormorant Garamond", px: 128, weight: 600, lineHeight: 1.0 }
  h1:        { fontFamily: "Cormorant Garamond", px: 96,  weight: 600, lineHeight: 1.05 }
  h2:        { fontFamily: "Cormorant Garamond", px: 72,  weight: 600, lineHeight: 1.1 }
  stat-figure:{ fontFamily: "Cormorant Garamond", px: 200, weight: 700, lineHeight: 0.9, color: "telemetry" }
  lead:      { fontFamily: "Source Sans 3", px: 44, weight: 600, lineHeight: 1.3 }
  body:      { fontFamily: "Source Sans 3", px: 38, weight: 400, lineHeight: 1.4 }
  label:     { fontFamily: "Source Sans 3", px: 30, weight: 700, tracking: "0.12em", upper: true, color: "ink-2" }
  note:      { fontFamily: "Caveat", px: 54, weight: 700, lineHeight: 1.1, color: "ink-2" }   # hand-written field notes
  telemetry: { fontFamily: "Courier Prime", px: 34, weight: 700, tracking: "0.04em", color: "telemetry" }  # collar readouts, coordinates, data labels

fonts:
  files: "assets/fonts/ — cormorant-garamond-{500,600,700}.woff2, source-sans-3-{400,600,700}.woff2, caveat-{500,700}.woff2, courier-prime-{400,700}.woff2"
  rule: "Declare @font-face for every family/weight you use, src url('assets/fonts/<file>') (project-root relative). No remote fonts."

spacing:
  pad-x: "72px"
  pad-y: "96px"
  gap-lg: "64px"
  gap-md: "36px"

components:
  page:
    description: "Full-bleed paper ground (its own class='clip' layer) with a very faint 40px graph grid in {colors.line} at 25% opacity and a soft warm vignette at the edges. Optional: faint paper fibre noise (seeded)."
  plate:
    description: "A public-domain illustration (PNG/JPG in public/) shown as pen-and-ink on paper: multiply blend so white paper vanishes, ink in {colors.ink}. May be revealed with a left-to-right ink wipe or a soft mask 'drawing on'. Never recolor to neon; never add drop shadows."
  wash:
    description: "Watercolor wash behind a subject: an irregular blob in {colors.ochre} or {colors.olive} at 18–30% opacity with a soft feathered edge (SVG feTurbulence displacement or radial-gradient blobs). Bleeds in slowly."
  hairline:
    rule: "2px solid {colors.line}"
    description: "Compass-drafted structure: rules, axes, leader lines to annotations, rings. No thick borders, no boxes with fills except paper-2 mats."
  geo-ring:
    description: "Compass-drafted circle in {colors.line} 2px, may self-draw. Used as gauge/turn-radius/ledger marks."
  annotation:
    description: "Hand-written {typography.note} label + a thin hand-drawn leader line (slight wobble) pointing at a feature. Writes on stroke-by-stroke or word-by-word."
  telemetry-track:
    description: "GPS path drawn in {colors.telemetry} 5px with round caps; small dots every sample; arrow heads for direction. Self-draws along its length. Data labels in {typography.telemetry}."
  specimen-label:
    description: "Museum-style label: paper-2 mat, 2px {colors.line} border, label + Latin name in italic Cormorant. e.g. 'ACINONYX JUBATUS — cheetah'."
  stamp:
    description: "Rubber-stamp text (e.g. MYTH) in {colors.telemetry} at 85% opacity, slight rotation, rough edge via SVG displacement. Lands with a short scale settle (no bounce)."
  source-chip:
    description: "Small {typography.label} citation, e.g. 'WILSON ET AL., NATURE 2013'. Bottom-left of the content area (above the caption band). Older viewers trust visible sources."

composition:
  portrait: "Stack vertically. Hero centred at y≈0.40H. Keep ALL content above y=1560 (captions own the bottom band). Top 120px clear of essential text."
  density: "One idea per frame; the illustration or diagram fills 45–60% of the frame. Generous margins."
  motion: "Slow, smooth, documentary: power2/power3 eases, ink wipes, self-drawing lines, gentle 2–4% push-ins. No bounce, no flashes, no fast cuts within a frame. Holds are still."

negative:
  - "No neon, no gradients except watercolor washes, no glassmorphism, no dark mode."
  - "No Playfair, no Barlow, no IBM Plex Mono (used in earlier videos)."
  - "No emojis, no meme captions, no shouting all-caps body text."
  - "No invented data: every number/curve is either from the script or labelled 'schematic' or 'redrawn from …'."

# Episode 2 addendum — "Turbo" layer (bridges the channel's younger chase-clip audience)

turbo:
  principle: "Same journal, more velocity. Calm reading pace for text; energetic motion for action beats only."
  speed-lines: "Thin ink/red streaks (2–4px) trailing anything moving fast, fading over 0.3 s; motion-blur via SVG feGaussianBlur stdDeviationX only (horizontal/vertical streak)."
  stat-slam: "Big numbers (stat-figure, 220–320px) land with a fast expo.out scale 1.25→1.0 and a 1-frame red underline flash. Allowed on cold open and key stats only."
  versus-card: "Two stacked specimen cards (top: CHEETAH, bottom: FALCON) split by a red 'VS' roundel; each card has 2 stat rows in telemetry font. Fighting-game energy, journal materials."
  reticle: "Telemetry-red targeting reticle (circle + 4 ticks + crosshair gap) that locks onto a target with a quick 2-step snap; bearing line in dashed red with a degree readout."
  impact-shake: "Max 6px, 0.25 s, seeded, only on the strike / stat slams. Never on reading frames."
  sound-design: "Orchestrator adds whooshes, wind rush, impact hits — workers mount no audio."
  pacing: "Each frame should have at least one visible change every ~1.5 s (younger retention), but text stays on screen long enough to read (older audience)."

# Episode 3 addendum — "Field Footage" (OVERRIDES the paper ground and plate rules above)

field-footage:
  why: "Competitor research: winning educational animal Shorts use real imagery, full-bleed, a persistent top title banner, 15–35 s, visual change every 1.5–3 s, seamless loop."
  ground: "Full-bleed PUBLIC-DOMAIN PHOTOGRAPH (public/ph-*.jpg) as the frame's own full-duration class='clip' background layer, object-fit: cover, continuously moving (Ken Burns push 4–10% and/or a pan in the animal's running direction). Never a static photo. No paper texture, no graph grid on photos."
  grade: "Warm documentary grade: optional subtle dark gradient at top (y 0–480, rgba(0,0,0,0.45)→0) and bottom (y 1450–1920, 0→rgba(0,0,0,0.5)) so the banner/captions read. Desaturate + darken only for the 'ghost' beat."
  banner-zone: "y 110–460 is RESERVED for the global title banner the orchestrator overlays across the whole video. Workers put NOTHING important there."
  content-zone: "y 480–1540 for overlays. Captions own y 1560+."
  overlays: "Journal pieces float over the photo: paper cards (#EFE6D2 at 92% with 2px #B9A98C border, no shadow) for stats/labels; telemetry red #C2412D for arrows, reticles, speed lines, key numbers (Courier Prime); Caveat notes in WHITE with a soft dark text-shadow when directly on a photo."
  arrow: "Events-Untold-style pointer: a bold red arrow (#C2412D, 14px stroke, rounded) that pops in (scale 0.6→1, expo.out, 0.25 s) pointing at the subject, with a Courier Prime label."
  ghost: "public/cheetah-ink.png with CSS filter invert(1) brightness(1.15) + drop-shadow(0 0 18px rgba(255,255,255,0.55)), opacity 0.35–0.6, a slight horizontal motion-blur copy behind it (feGaussianBlur stdDeviationX or a 2nd copy at 0.2 opacity offset −40px). Flip with scaleX(-1) to face the running direction."
  pacing: "Something visibly changes every 1.5–2.5 s (new overlay, photo push direction change, cut). Text overlays are short (≤5 words) — the narration carries the sentence."
  type-sizes: "Stat numbers 200–280px; labels ≥34px; Caveat notes ≥60px."
