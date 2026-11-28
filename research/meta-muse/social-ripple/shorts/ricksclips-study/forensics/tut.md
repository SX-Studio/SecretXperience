Here is the comprehensive step-by-step breakdown of the reverse-engineering methodology and workflow presented in the video tutorial:

---

## **1. Channel Analyzed & Viral Factors**

* **Reference Channel:** RicksClips (`@RicksClips3000`)
* **Stats Noted (00:02–00:10):**
  * Top short: **29 million+ views** (*"The Ancient Jar That Warned an Empire"*).
  * Channel totals: **120k+ subscribers**, **145+ videos**, and over **200 million views** across its last ~80 shorts.
* **Why the Shorts Go Viral:**
  * **2D in 3D Contrast:** Flat 2D cartoon characters positioned within a fully lit 3D environment.
  * **Frame-by-Frame Polish:** High visual density, subtle micro-animations (slow camera drifts, lighting shifts, ground shadows, depth-of-field blur).
  * **Script Structure:** Fast-paced historical or paradoxical trivia told through a strict narrative formula.
  * **Fast Audio Delivery:** ~3.5 to 4.1 words per second (~210–245 WPM) with virtually no dead air.

---

## **2. Tools, Tech Stack, & Models**

* **LLM Engine:** Claude (Claude 3.5 Sonnet / Claude 3.5 Opus) used via automated multi-agent prompts/skills.
* **Rendering & Code Stack:**
  * **Three.js:** Renders the 3D geometry, lighting, depth-of-field, and custom GLSL post-processing shaders.
  * **Remotion (React):** Programmatically drives Three.js scenes frame-by-frame and exports the final video.
  * **Python / FFmpeg / OpenCV:** Used for automated video downloading, transcription, contact sheet generation, frame-by-frame color/motion analysis, and merging multi-agent code outputs.
  * **Blender:** Used for asset testing, line-art shader probing, and 3D modeling validation.
* **Assets:** 3D low-poly models (from Kenney asset packs) and programmatic 2D SVG/Canvas character sprite generation.

---

## **3. Step-by-Step Workflow**

### **Phase A: Deep Analysis & Extraction (00:40–03:49)**
1. **Bulk Download (00:46):** Download the last 20 viral Shorts from the target channel.
2. **Transcription (01:45–01:58):** Extract original English audio tracks and transcribe them word-for-word (using tools like WhisperX) with precise timestamp data.
3. **Contact Sheet & Frame Analysis (03:10–03:35):**
   * Slice videos into 60-frame contact sheets every 2 seconds.
   * Run sub-pixel phase-correlation scripts to measure per-frame camera movement, hard cut locations, average luminance, contrast, and color saturation statistics.
4. **Style Bible Output (01:33, 02:16):** Save all measured parameters into a markdown reference file (`STYLE_BIBLE.md`).

### **Phase B: Script Generation (03:51–04:53)**
1. **Topic Selection & Fact Checking (04:05–04:30):**
   * Filter out topics already covered by the reference channel.
   * Extract historical facts (e.g., the 1831 Broughton Suspension Bridge collapse involving 74 soldiers marching in step across an iron bridge that collapsed into 2 feet of water).
2. **Script Draft:** Write a 50–60 second script strictly conforming to the 6-part formula.

### **Phase C: 3D Scene & Character Construction (04:53–06:22)**
1. **Character Generation (05:22–06:04):** Programmatically generate 2D canvas vector graphics for characters (bean/egg-shaped heads, thin stick-like limbs, multiple facial expressions including laughing, nervous, shocked).
2. **3D Environment Assembly (05:46–05:59):** Load low-poly 3D assets into Three.js (buildings, bridges, water, foliage, market stalls) with procedural canvas textures (grass, brick, wood grain).
3. **Shading & Post-Processing (06:17–06:22):** Apply custom GLSL ink-outline passes (screen-space edge detection) and depth-of-field blur passes.

### **Phase D: Multi-Agent Refinement & Iteration (06:45–09:44)**
1. **Visual QA Check (06:45):** Render test still frames and perform automated side-by-side comparative analysis against the reference stills.
2. **Multi-Agent Task Allocation (07:35–08:29):** Deploy dedicated sub-agents to analyze and patch specific gaps:
   * **Agent 1 (Color/Grade):** Adjusts saturation, lifts black points, and creates warm key light vs. cool purple/blue shadow contrasts.
   * **Agent 2 (Outlines):** Fixes shader order so depth-of-field blur does not erase black ink outlines.
   * **Agent 3 (Lighting/Depth):** Configures soft background blur and directional scene lighting.
   * **Agent 4 (Textures):** Refines wood/brick canvas patterns.
   * **Agent 5 (Characters):** Scales body proportions to ~3.5 head-heights tall and rounds head contours.
   * **Agent 6 (Motion):** Replaces rigid 3-frame snaps with smooth 18–40 frame ease-in/ease-out camera glides and micro-drifts (moving across 65%+ of quiet frames).
   * **Agent 7 (Sound):** Composes marching footsteps, wood snaps, water splashes, and background tunes.
3. **Isolated File Sandboxing (08:09–08:26):** Give each agent its own isolated project clone and distinct file ownership to prevent merge conflicts before merging back into main (`bridge_merge.py`).

---

## **4. The 6-Part Script Formula**

Derived from `STYLE_BIBLE.md` (01:33, 02:16):

1. **The Hook (Sentences 1–2 / ~10–16 words):** State a paradox or absurd event as factual reality without any introductory preamble or setup.
   * *Example:* *"Seventy-four soldiers knocked down an iron bridge just by walking across it."*
2. **The Setting & Context (1–2 lines):** Establish the year, location, and concrete details in present tense.
   * *Example:* *"It's 1831, and the brand new bridge over the river is the pride of the whole town."*
3. **The Escalation (3–6 beats):** Introduce comedic overreactions, character dialogue, or exaggerated observations.
   * *Example:* *"The men are marching home... a normal person would slow down, but these guys think it's hilarious."*
4. **The Mystery / Mid-Point Beat:** Raise a question or sudden turn of events (*"Wait...?"*).
   * *Example:* *"Then a single bolt snaps, and the whole end of the bridge drops into the river."*
5. **The Pivot Word (14 of 20 reference videos):** Transition into the underlying scientific or historical mechanism using the exact phrase: **"You see, ..."** (or *"Think about the last time..."*).
   * *Example:* *"You see, every bridge has a rhythm it naturally likes to sway at..."*
6. **The Ironic Payoff (Final 1–2 sentences):** Deliver a fast-hitting punchline or rule change right before the video ends abruptly.
   * *Example:* *"Luckily, the river was only two feet deep. Unluckily, the river was only two feet deep."* / *"So now, the best drilled soldiers in the world cross every bridge like a crowd of tourists."*

---

## **5. Visual & Graphic Style Rules**

From `STYLE_BIBLE.md` and agent comparative analysis (01:33, 07:03–07:33, 08:36–09:16):

* **Resolution & Aspect Ratio:** Vertical 1080×1920 (or rendered at 1440×2560 2.5K), 30 fps.
* **Character Proportion:** 2D flat stick-character figures; adults are **~3.5 head-heights tall** with round/bean heads (slight 10% asymmetry) and thin line limbs.
* **Outlines:** Thick black ink lines (3–4 px equivalent at 1080p) applied over ~74% of 3D geometry edges using GLSL edge detection.
* **Color Palette:** High contrast, highly saturated colors. Key lights are warm/golden; ambient shadows are cool indigo/purple. Blacks are slightly warm-lifted (no pure `#000000` fill).
* **Depth of Field:** Soft background blur (focus locked on front characters) to isolate subjects.
* **Camera Movement:**
  * Avoid static cuts (hard cuts occur only 0–1 times per video in ~60% of top shorts).
  * Smooth continuous camera travel (tracking, fly-throughs, slow push-ins).
  * Active gliding camera motion across **~65% of frames** with gentle 18–40 frame easing transitions.

---

## **6. Audio & On-Screen Captions**

* **Voiceover:** Single male narrator, fast-paced, steady tone (3.5–4.1 words/sec). Zero pauses between sentences.
* **Sound Effects (SFX):** Integrated audio sync for actions (marching stomps, metal snaps, splashes, whistles).
* **Captions Rule:** **No on-screen captions or burned-in subtitles** unless explicitly requested by the prompt/viewer (01:33, 08:33). Focus relies purely on visual 3D storytelling and voiceover.
* **Ending:** Crisp cutoff on the last spoken word with no tail-off music.

---

## **7. Prompts & Prompts Executed (Verbatim On-Screen Quotes)**

### **Initial Video Analysis Prompt (01:18):**
```text
https://www.youtube.com/@RicksClips3000 go to this channel and watch his latest 20 videos at 30 fps. Understand how he's lighting, contrast, the shadow, the movement, the effects, the cut, everything. Understand everything about this. Transcribe how the script is written, everything. Study the last 20 videos as much as you want.
```

### **Measurement Refinement Prompt (03:41):**
```text
Don't tell me what you think of this video. Measure it: cuts, camera moves, colors. Give me numbers.
```

### **Short Test Request Prompt (04:59):**
```text
I want to make a really short video, just 5 seconds.
```

### **Switch to Three.js Architecture Prompt (05:29):**
```text
hey, i think his animation is probably on 3D, and that is what he renders. If you ask me about the language, what language he uses, it is this. Three.js
```

### **Frame-by-Frame QA & Iteration Prompt (06:45):**
```text
Hey, our lighting is bad. Everything is kind of bad. Our character is kind of bad. I don't know. It looks like he's animated, but a cheap copy of it. I don't know why.

See there: his frame and our frame. His frame is pretty colorful, pretty good, and high in contrast. His one looks premium. Our one looks like a cheap copy of his. I don't know why, but damn it. Are you going to fix it on the finishing touch, or what should the final art look like? It looks really cheap, your one, and his one looks really polished and really high in contrast.

As you can see, he uses really targeted colors, which make his video so cool. We got some shading going on, some cool lighting going on, some cool movement going on, every single thing, and cool textures. The background looks different, even better. The 3D animation, like the 3D background and stuff, has a really cool drawing-type effect, like a black outline, which we don't have. This character looks really good. His head doesn't actually circle. His shape is a little bit good. The body structure is good. The background has depth, a little blurry depth, and it is cool. Our one doesn't look like that. Our one looks kind of dull.

Just go and analyze more, frame by frame. Compare it, fix it. I don't know how many times it will need, but make it as close as you f***ing possibly can. Take your time, take your time, your thing. I would say deploy 10 agents and do it, using 10 agents, which will make the process 10 times faster. Analyze it as much as you f***ing like, and make the thing as accurate, as close, and as good as possibly could. Okay.
```

### **Final Execution Prompt (08:30):**
```text
Make it verified. See it. Make it exactly as like that. You got like 10 hour. You got 10 hour. To do whatever you want to do, figure out, make it cool and stuff like that. Make it as much accurate as you possibly can. Figure out things. After making it, analyze it frame by frame, 30 frames per second, analyze it. After rendering, analyze it, do it, everything. And after you finish, make the scale so that I can just reproduce this type of video again and again. Every time the same ultra realistic and ultra, like, you know, real quality.
```

### **One-Line Skill Command Prompt (10:13–10:16):**
```text
Install this skill: https://github.com/mromidev/claude-animated-shorts
Make a 60-second animated short about the Great Molasses Flood
```

---

## **8. Free GitHub Repository & Skill Package**

* **GitHub URL (10:07, 10:13):** `https://github.com/mromidev/claude-animated-shorts`
* **Package Contents:**
  * `SKILL.md`: Complete prompt rulebook containing all style guidelines, script logic, color targets, and edge detection settings.
  * `references/`: 5,000+ extracted reference images and contact sheets.
  * `templates/`: Pre-configured Three.js / Remotion rendering pipeline, GLSL shader passes, and canvas texture generators.
  * `SCRIPT_example.md`: Sample formatted script demonstrating the hook-to-payoff structure.

---

## **9. Preview: Realistic 3D Medical/Fact Shorts (10:28–11:38)**

* **Previewed Concept:** *"How Long Are Your Blood Vessels?"*
* **Teased Workflow for Next Video:**
  * High-fidelity 3D human character modeling and rigging in Blender.
  * Facial facial performance animation driven by open-source AI models.
  * Optimization tricks: reducing render times from **7.5 hours down to 1 hour** by rendering at lower internal resolutions and AI upscaling.