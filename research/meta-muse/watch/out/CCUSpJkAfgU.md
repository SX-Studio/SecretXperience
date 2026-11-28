# Matt Penny, Claude + Three.js = Premium 3D Motion Graphics

https://www.youtube.com/watch?v=CCUSpJkAfgU

## Segment 00:00 to end

Here is the summary of the visual details, prompts, code, and pricing shown in the video:

### 1. Tools, Apps, Websites, Models, and Pricing
* **Core Frameworks & Tools:** Claude (LLM), Three.js, Playwright, ffmpeg.
* **Excluded/Crossed-Out Tools:** Adobe After Effects, HyperFrames, Remotion.
* **LLM / Video Models Mentioned:** Claude Opus 5.5 (recommended), Sonnet 5.5, Astra 6, Seedance 2.5.
* **Pricing & Token Metrics (15-Second Video):**
  * Token consumption: ~37,000 tokens (36,108 exact).
  * Opus 5.5 API Rate: $20 per 1 million output tokens ($0.74 API cost per clip).
  * Claude Subscription Cost: ~$0.05 per clip (~30× cheaper than standalone video AI models).
  * Seedance 2.5 Rate: $0.10/sec ($1.50 per 15s video; edits multiply cost: $3.00, $4.50+).
  * Output capacity on entry-level plan: ~400 videos/week.
* **Community:** Applied AI Mastermind (14-day money-back guarantee).

---

### 2. Prompts and Code Text

#### Code Snippets
* **[00:25]**
  ```javascript
  const mesh = new Mesh(
    new IcosahedronGeometry(1, 0),
    glassMaterial
  );
  scene.add(mesh);
  ```
* **[03:53]**
  ```javascript
  const scene = new THREE.Scene();
  scene.add(geometry, material);
  renderer.render(scene, camera);
  ```

#### Prompts Shown On Screen
* **[01:04] Prompt 1 (Idea to App / Glassmorphic 3D):**
  > *"Make a 15-second, 1920x1080, 60fps motion-graphics explainer in Three.js, glassmorphism style, titled 'From idea to app with Claude Code'. Render it frame by frame to MP4 (Playwright plus ffmpeg)..."*
  * **Scenes:** 1. Describe it (0–3s), 2. Plan it (3–6s), 3. Build it (6–9s), 4. Ship it (9–12s), 5. Reveal (12–15s).
  * **Style:** Dark space background, glowing dome, frosted glass panels (`MeshPhysicalMaterial`), particle effects, SF Pro font, accent `#ff8a4c`.

* **[05:58] Prompt 2 (How RAG Works):**
  > *"Make a 15-second, 1920x1080, 60fps explainer video in Three.js titled 'How RAG works'..."*
  * **Scenes:** 1. Embed (floating card arc to 3D point clusters), 2. Search (nearest neighbor search around prompt node), 3. Generate (language model orb creating answer card), 4. Result ("Answers grounded in your own documents").

* **[09:44] Prompt 3 (Networking 101 / Globe Demo):**
  > *"Make a 15-second, 1920x1080, 60fps explainer video in Three.js titled 'How the internet sends a message'..."*
  * **Scenes:** 1. Split, 2. Route, 3. Reassemble, 4. Close shot.
  * **Style:** 30,000 point dot-matrix globe, glowing light arcs connecting cities (NY, London, Tokyo, Singapore), floating 3D glass cards.

---

### 3. UI Actions
* No live UI execution performed. The presenter uses animated overlays and pre-rendered 3D graphic scenes alongside prompt cards and checklist slides.

---

### 4. Visual Style & Motion Graphics Demos
* **Glassmorphic 3D (00:47):** Dark cosmic background with glowing particles. Frosted glass cards tilt in 3D space with smooth camera pan transitions between steps.
* **Liquid Metal (02:51):** Vertical 9:16 layout featuring reflective chrome spheres, liquid metal physics, dark metallic floor reflections, and terminal text overlays.
* **Neural Network / Gradient Descent (07:52):** Paper-textured background with 3D connected network nodes morphing into a 3D topographical contour map showing loss minimisation.
* **3D Globe Network (09:28):** Rotating wireframe globe, curved laser arcs routing packet numbers between continents, floating glass UI dialogs.

---

### 5. Dashboard Numbers & Financial Analytics
* **Token Cost Comparison:**
  * **Claude + Three.js:** $0.05 per 15-second clip.
  * **Seedance 2.5:** $0.10/sec = $1.50 per clip.
  * **Cost Advantage:** 30× cost reduction per render; edits cost pennies vs $1.50+ per regeneration on video AI platforms.

---

### 6. On-Screen Prompt Checklist & Additions
* **[10:28] On-Screen Prompt Checklist:**
  1. Use `Three.js + shaders`.
  2. Prompt phrasing: `"Make it professional and sleek"`.
  3. Persona/Context: `"Your showreel for a dream job"`.
  4. Motion direction: `3D camera moves + moving elements`.
  5. Execution: `Run a verification loop` (checks for overlapping elements, text scaling, and frame errors).
