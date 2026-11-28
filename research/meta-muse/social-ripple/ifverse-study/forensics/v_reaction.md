### 1. Art Style & Character Construction

*   **Character Anatomy & Proportions**:
    *   **Heads**: Perfect geometric circles (`<circle>` with `r="20"`); head-to-body ratio is roughly 1:4 (stylized stick figure).
    *   **Outlines**: Clean, uniform vector strokes (approx. 3–4px width) in dark charcoal/black (`#111116`), often paired with an inner or outer soft colored rim light stroke.
    *   **Limbs**: Segmented lines with rounded stroke caps (`stroke-linecap="round"`), capable of elastic bending and arc-stretching. Hands and feet are simplified mitten/oval shapes.
    *   **Clothing (Hoodies)**: Block-colored geometric shapes (`#e53b3b` red, `#d66898` pink) featuring simple pouch pockets and thin white drawstrings (`<path>` or `<line>` with 2px stroke).
    *   **Facial Features**: Eyes are solid white circles (`#ffffff`) or simple dots; mouths are minimalist curved strokes (`<path d="M... Q...">`) transitioning between smiles, shock (open ovals), and flat lines.
    *   **Glints**: A 4-point star specular highlight (`<polygon>` or grouped triangles) overlaid on eyes or objects during peak awareness/reaction moments (e.g., 00:05, 01:21).
*   **Shading & Flatness**: Primarily flat vector illustration with subtle linear gradients on clothing and background elements. No complex 3D rendering; depth is achieved entirely through overlapping planes and drop shadows.
*   **Background Style**: Multi-plane vector composition. Buildings use flat rectangles with repeating window grids. Sky backgrounds feature smooth vertical linear gradients (sunset/dusk palette: `#231934` deep purple to `#ff7b25` warm orange). Parallax layers move at fractional speeds relative to the camera.

---

### 2. Lighting

*   **Key Light Direction**: Primarily top-down or top-right (mimicking streetlamps, room lights, or the setting sun), casting soft, angled drop shadows beneath characters and objects.
*   **Rim Lighting**: Highly stylized edge-lighting on characters (e.g., 00:42 in the lab, 01:14 outside). Implemented as a 2–3px glowing white/gold stroke (`#ffecb6`) offset or layered behind the main character path.
*   **Glows & Bloom**: Extensive use of additive blending and Gaussian blur filters (`stdDeviation="12"` to `"20"`) behind light sources, windows, computer screens, and eyes.
*   **Volumetric Haze & Light Shafts**: Semi-transparent angled polygons (`<polygon fill="white" opacity="0.1"/>`) cutting across dark indoor/outdoor scenes.
*   **Shadow & Color Palettes**:
    *   *Night/Evening*: Deep navy blues (`#151324`), purples (`#2a1b3d`), contrasting with warm yellow/orange artificial lights (`#ffae42`).
    *   *Shadows*: Semi-transparent dark purple/black (`rgba(15, 12, 25, 0.4)`) rather than pure black, maintaining saturation in dark areas.

---

### 3. Camera Mechanics

The animation relies heavily on dynamic, kinetic camera framing:

*   **Slow Push-In / Pull-Out**: Used during establishing shots and dramatic explanations (e.g., 00:39 lab intro). Easing is smooth (`cubic-bezier(0.25, 1, 0.5, 1)`), lasting 1–3 seconds.
*   **Snap / Crash Zooms**: Instantaneous scale changes (e.g., zooming from wide to extreme close-up on a character's face in < 0.2s) to emphasize comedic timing or sudden realization (00:05, 01:21).
*   **Top-Down Orthographic Rotation**: Overhead 90-degree rotating views used for spatial clarity during table-top actions or intersection crossings (00:19, 01:50).
*   **Rack Focus / DOF Blur**: Background or foreground elements blur dynamically using CSS/SVG filter transitions (`filter: blur(8px)` transitioning to `0px`) to guide viewer attention (00:12, 02:23).
*   **Whip Pans & Match Cuts**: Fast horizontal panning transitions between scenes, masked by motion blur or sudden flashes.

---

### 4. FX & HUD Elements

*   **Particles**: Floating dust motes, falling leaves (`00:00`), and debris rendered as small semi-transparent vector circles and leaf paths drifting downward with sine-wave horizontal oscillation.
*   **Speed Lines**: Concentric or linear dashed white vector lines (`stroke-dasharray`) zipping across the screen during high-speed actions (01:23, 02:43).
*   **Impact Frames**: Concentric expanding rings (`<circle fill="none" stroke="#fff" stroke-width="2"/>`) paired with white screen flashes and subtle chromatic aberration on impact beats (00:05, 02:55).
*   **HUD Style**: Tech overlays (timers, reaction counters, target reticles) rendered in crisp geometric sans-serif typography with neon cyan (`#00ffff`) and yellow (`#ffcc00`) strokes, accompanied by crosshair vector paths.

---

### 5. Typography on Screen

*   **Font Family**: Geometric, bold sans-serif (e.g., Montserrat, Futura, or Helvetica Black), uppercase only, with wide tracking (letter-spacing).
*   **Color**: High-contrast white (`#ffffff`) or accent yellow (`#ffcc00`), often with a subtle drop shadow filter.
*   **Animation**: Text elements pop in via scale-up and fade-in (`opacity: 0 -> 1`, `transform: scale(0.8) -> scale(1)`) with a snappy overshoot bounce. Example: *"WHAT IF YOUR REACTION TIME WAS 10X FASTER?"* at 00:34.

---

### 6. Top 10 Techniques & SVG Recipes

1.  **Character Rim Lighting**
    *   *Recipe*: Duplicate the character `<path>`, apply `stroke="#ffecb6"`, `stroke-width="3"`, `fill="none"`, and place it directly behind the main filled path with a slight positional offset (`transform="translate(-1, -1)"`).
2.  **Glow / Bloom Effect**
    *   *Recipe*: Use `<filter id="glow"> <feGaussianBlur stdDeviation="15" result="coloredBlur"/> <feMerge> <feMergeNode in="coloredBlur"/> <feMergeNode in="SourceGraphic"/> </feMerge> </filter>`.
3.  **Parallax Scrolling Background**
    *   *Recipe*: Nest background layers in separate `<g>` groups and apply differential CSS `transform: translateX()` multipliers driven by viewport scroll or timeline progress.
4.  **Impact Shockwave Rings**
    *   *Recipe*: `<circle cx="x" cy="y" r="10" fill="none" stroke="#ffffff" stroke-width="3"> <animate attributeName="r" values="10;80" dur="0.3s" fill="freeze"/> <animate attributeName="opacity" values="1;0" dur="0.3s" fill="freeze"/> </circle>`.
5.  **Dynamic Depth-of-Field (Rack Focus)**
    *   *Recipe*: Apply a CSS transition on an SVG filter: `.blurred { filter: blur(10px); transition: filter 0.4s ease; }` toggled via class on background/foreground `<g>` elements.
6.  **Speed Lines / Motion Trails**
    *   *Recipe*: Create repeating dashed lines: `<line x1="0" y1="y" x2="1920" y2="y" stroke="white" stroke-width="2" stroke-dasharray="20 40" opacity="0.6"/>`.
7.  **HUD Reticles & Targeting Reticles**
    *   *Recipe*: `<circle cx="100" cy="100" r="30" fill="none" stroke="#00ffff" stroke-width="2" stroke-dasharray="10 5" transform="rotate(0 100 100)"> <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="4s" repeatCount="indefinite"/> </circle>`.
8.  **Cel-Shaded Gradient Skies**
    *   *Recipe*: Define `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stop-color="#231934"/> <stop offset="100%" stop-color="#ff7b25"/> </linearGradient>` applied to a full-screen `<rect>`.
9.  **Squash & Stretch Transforms**
    *   *Recipe*: Animate scale dynamically with a fixed transform origin at the base: `transform-origin: bottom center; transform: scale(1.2, 0.8);` transitioning back to `scale(1, 1)` with elastic easing.
10. **Chromatic Aberration / Glitch**
    *   *Recipe*: Layer three copies of an element with `mix-blend-mode: screen`, tinting them Red, Green, and Blue respectively, and offsetting their coordinates slightly via `<feOffset>` filters.