Here is the consolidated technical rendering and animation specification for your team.

---

### 1. SHADING RECIPE

#### A. Character Cel-Shading & Rim Lighting
* **Base Shading Model:** 2-step cel shading (1 Base pass + 1 Shadow pass) using custom Three.js `ShaderMaterial` or `MeshToonMaterial`.
* **Shadow Saturation & Hue Shift:**
  * **Rule:** Shadows are never greyed-out or pure black multiplies. Shift ambient shadow hues away from base color into adjacent cool tones (Indigo/Teal `#1F1A2C`).
  * **Shadow Saturation:** +15% saturation relative to the base color tone.
* **Rim Lighting:**
  * **Thickness:** Exact 2px-to-4px continuous inner rim line pass (or screen-space post-outline).
  * **Colors:**
    * *Standard/Void Environment:* Cool Cyan/Blue (`#88A0FF` or `#5080FF`).
    * *Warm Light/Rift Source:* Warm Amber/Golden Yellow (`#FFAE42` or `#D4AF37`).
  * **Application:** Applied on character silhouettes (hoodie edges, head profiles) to separate 2D black/dark fills from deep background geometries.
* **Contact Shadows:** Soft, flattened dark vector ellipses (`#1A1A1A` with low-opacity gradient decay) directly beneath feet, props, and furniture legs on floor planes.

#### B. Environment Shading
* **Cel Steps:** 2-step cel-shading with soft linear falloff between light and dark boundaries.
* **Gradients:** Continuous linear and radial background gradients (Deep Indigo `#131728` blending into Slate Blue/Teal) to prevent color banding across large background spaces.
* **Ambient Occlusion (AO):** Soft, blurred contact shadows along intersecting edges of floating 3D primitives (triangles, toruses, prisms, ship hulls).
* **Highlights / Speculars:** Hard vector specular highlights (pure white `#FFFFFF`) on glass panes, rain droplets, and metallic surfaces (wings, lantern enclosures).

---

### 2. COLOUR PALETTE & SCENE GRADING

* **Palette Strategy by Environment/Mood:**
  * **The Void / "The Still":** Dominant deep purples, indigos (`#131728`), slate grays, and dark cyan gradients.
  * **Warm Interior / Cozy Scenes:** Deep indigo ambient shadows (`#1F1A2C`) set against intense warm key-light accents (`#FFAE42`).
  * **Flashback / Historical Interior:** Warm tans, muted sepia tones, oranges, and soft golden yellows.
  * **Storm / Anomaly Scenes:** Slate blue (`#131728`), cyan/violet electric arcs (`#88A0FF`), dark volumetric storm clouds.
* **Accent Strategy:**
  * **Vibrant Red (`#E53935` / `#D32F2F`):** Dedicated exclusively to the protagonist’s hoodie to anchor visual focus across all complex low-light compositions.
  * **Golden Yellow (`#D4AF37` / `#FFAE42`):** Reserved for spatial rifts, energy arcs, active UI markers, title cards, and key narrative props (the coin, lantern flame).
* **Recurring Color Hex Codes:**
  * **Void Deep Background:** `#131728`
  * **Ambient Dark Purple:** `#1F1A2C`
  * **Gold Accent/UI Header:** `#D4AF37`
  * **Warm Lantern Key Light:** `#FFAE42`
  * **Cyan/Violet Rim & Lightning:** `#88A0FF` / `#5080FF`
  * **Dark Charcoal Text/Ink:** `#1A1A1A`

---

### 3. TEXTURE & SURFACE RENDERING

* **Grain Overlay:**
  * **Type:** Static fine-grain/noise overlay pass applied over solid color fields and paper assets.
  * **Intensity:** 3% to 5% opacity to break up pure digital vector flat surfaces without creating visual clutter.
* **Paper & Document Textures:**
  * **Base:** Off-white/sepia matte cardstock with subtle noise and soft linear ambient gradients across folds.
* **Surface Patterns & Anti-Flatness:**
  * Glass surfaces use semi-transparent white vector specular shapes, rain streaks, and reverse-written steam text using a `Screen` blend mode.
  * Metal surfaces combine flat grey shaders with high-contrast, hard-edge specular gleams.

---

### 4. LINE WORK & OUTLINES

* **Stroke Weights:**
  * **Characters:** Uniform vector black outlines (~3px to 5px weight) with clean rounded caps and joints. Slight tapering applied only on fingertips, glasses frames, and hat straps during close-ups or extreme action poses.
  * **Props & Interactive Geometry:** Mid-weight stroke (~3px).
  * **Background Debris / Far Primitives:** Fine line weights (~1px to 2px) or pure flat vector silhouettes without strokes.
* **Line Color:**
  * **Characters & Foreground Props:** Pure Black (`#000000`) or Dark Charcoal (`#1A1A1A`).
  * **Lighting Overlays:** High-energy objects (portals, lightning, spirit remnants) discard black outlines in favor of bright additive glowing edges (`#D4AF37` or `#88A0FF`).

---

### 5. DEPTH, LIGHT & CAMERA PASSES

* **Parallax Staging (Multi-Layer Depth):**
  * **Foreground:** Large, darker, blurred geometric shapes (triangles, rings, ship hulls) with rapid camera-relative movement.
  * **Midground:** Main walking platforms, characters, interactable props, and key portals (100% velocity track).
  * **Background:** Low-opacity debris, inverted ships, planes, and floating pyramids moving at 10%–20% of midground speed with scaled-down dimensions.
* **Glow & Bloom Pass:**
  * Layered post-processing bloom applied to energy sources (coins, lantern flames, spatial rifts):
    * *Core:* Tight, high-intensity white-hot center.
    * *Outer:* Wide, low-intensity Gaussian blur with additive/screen blend mode.
* **Depth of Field (DOF):** Subtle camera DOF blur applied strictly to immediate foreground framing assets and far background layers during emotional close-ups and dramatic reveals.

---

### 6. MICRO-ANIMATION & SATISFYING MOTION RULES

1. **Impact Squash & Overshoot:** Landing and drop impacts use a **1-frame max squash**, followed by a **2-frame overshoot** before settling.
2. **Follow-Through Inertia:** Secondary cloth items (hoodie strings, coat tails) react with a strict **2-frame delay** behind primary torso movements.
3. **Pinch & Snap Freeze:** Sudden stops (e.g., coin freeze mid-air) immediately strip all rotation and motion blur on a **hard 1-frame stop**.
4. **Organic Easing Curves:**
  * Portal Shrink / Vanish: `exponential ease-out`.
  * UI Text & Card Drops: Fast `scale-up (95% to 100%)` with `easeOutExpo` over 8–10 frames.
  * Heavy Pushes (Boat/Ships): High initial anticipation crouch, followed by slow, heavy deceleration curves.
5. **Breathing Idle Cycle:** Held poses execute a continuous **1.5% to 3% vertical Y-scale pulse** (sine wave) to prevent frozen vector frames.
6. **Blink Rhythm:** 2-frame lid wipe (`^ ^`) occurring irregularly every 2.5 to 4 seconds.
7. **Background Ambient Drift:** Continuous linear translation of void debris at a slow rate of **5 to 10 pixels per second**, combined with slow 3D multi-axis rotation (~5 deg/sec).

---

### 7. VFX CATALOGUE & BUILD RECIPES

#### A. Spatial Rift / Portal Tear
* **Build Recipe:**
  1. Base inner core: White-hot vector seam line.
  2. Outer shell: Serrated, jagged-edged polygon geometry tinted `#D4AF37`.
  3. Animation: Apply a 2-frame high-frequency jitter/turbulent displacement to edge vertices.
  4. Pass: Layer a heavy additive glow pass + outward-floating geometric shard particles.

#### B. Glowing Paper Entity / Dissolution
* **Build Recipe:**
  1. Assemble entity silhouette using ~40–50 independent flat 2D polygonal planar shards.
  2. Idle: Apply a gentle low-frequency noise field to vertex positions.
  3. Trigger: On movement detection, apply high initial radial velocity to shards, bursting them outward with additive bloom before tracking toward the motion source.

#### C. Lightning Arcs
* **Build Recipe:**
  1. Procedural 2px white-stroke jagged paths with a cyan/violet outer glow (`#5080FF`).
  2. Animation: Render over a 3-frame cycle (Frame 1: Strike down at 100% opacity; Frame 2: Branch out + shift position at 80% opacity; Frame 3: 0% opacity fade).

#### D. Rain & Ripples
* **Build Recipe:**
  1. Vertical/slanted 10px–30px white vector lines moving downward at high velocity across 3 distinct depth planes.
  2. Ground Impact: On collision with the water plane, spawn cone-shaped splash particles paired with concentric circular ripple rings that expand and fade via linear-out opacity.

---

### 8. CHARACTER DESIGN & FACIAL EXPRESSIONS

#### A. Base Silhouette
* Spherical black head with bright, clean white circular eye nodes.
* Saturated red hoodie with distinct white drawstring cords, black stick legs, and red sneakers with white soles.

#### B. Expression Atlas
* **Neutral / Curious:** Standard white dot eyes, subtle upward/flat mouth arc.
* **Shock / Surprise:** Wide-open circular ring eyes (or triple-ring pupil/outer layout), open "O" mouth.
* **Grief / Sadness:** Drooped semicircular eyes, downward-curved mouth arc, quivering geometry, dripping blue/white tear streams.
* **Determination / Anger:** Narrowed slit eyes with sharp inner-angled eyebrow slashes, flat or clenched mouth line.
* **Relief / Peace:** Closed crescent eyes (`^ ^`), soft upward mouth curve.

---

### 9. TOP 15 UPGRADES FOR IMMEDIATE VISUAL IMPACT

1. **Dynamic Rim Lighting Pass:** Add a 2px-to-4px continuous warm/cool rim highlight on character silhouettes to separate them from dark 3D backgrounds.
2. **Layered Additive Bloom:** Implement a dual-stage bloom pipeline (tight intense core + wide soft bloom) for all yellow/cyan light sources and UI accents.
3. **2-Frame Inertia Delay on Accessories:** Lag secondary cloth assets (hoodie strings, coat tails) exactly two frames behind body movement.
4. **Shift Shadow Hues Away From Pure Black:** Color-grade all scene shadows toward saturated cool tones (`#1F1A2C`) rather than desaturated grays.
5. **Micro-Motion Idle Breathing Pulse:** Apply a subtle, continuous 2% vertical scale oscillation to all character torsos during static poses.
6. **3-Tier Parallax Layering:** Group environment assets into distinct foreground, midground, and background depth layers moving at staggered speed ratios.
7. **Static Noise Texture Overlay:** Apply a global 3%–5% noise/grain overlay pass to eliminate modern, flat digital-vector sheen.
8. **Expressive Eyebrow & Eye Geometry Swaps:** Implement instant single-frame facial expression swaps (angled slashes, crescent curves, ring-eyes) on key emotional frames.
9. **Impact Squash-and-Stretch:** Enforce a 1-frame squash followed by a 2-frame overshoot on all physical ground contacts.
10. **Procedural Multi-Axis Background Drift:** Keep background void debris continuously drifting and rotating at slow, constant-linear speeds.
11. **High-Velocity Frame-Flicker Lightning:** Animate lightning bolts and energy flashes over tight, high-contrast 3-frame opacity cycles.
12. **Grounded Contact Shadow Ellipses:** Render soft, flattened vector drop-shadow ellipses beneath character feet and interactive objects.
13. **High-Contrast Character Accent Palette:** Use a single bright focal color (e.g., Red Hoodie `#E53935`) to retain instant readability against dark backgrounds.
14. **Paper-Cut Dimensional Edge Layers:** Frame anomaly scenes with overlapping, parallax-shifting polygonal shards to create deep dimensional framing.
15. **Snappy UI Scale and Blur Reveals:** Transition title cards and text overlays using a rapid 0.2s blur-to-sharp animation combined with a 95%-to-100% scale pop.