# Futurepedia, Claude Makes a New Kind of Video

https://www.youtube.com/watch?v=Ge1B-Ok1Pfk

## Segment 00:00 to 08:00

Here is the detailed visual context breakdown for the video segment:

### 1. On-Screen Tools, Apps, Websites, Models & Settings

* **[00:03 - 00:35]** Motion Graphics Mockup/UI overlays:
  * Categories: `01 Motion graphics`, `02 Explainer videos`, `03 Doesn't look like AI`
  * Fake UI: `Video generator` modal (`A cinematic shot of...`, `Generate` button).
  * Code Overlay: `<> scene.js`, function `draw(ctx, t)` using standard HTML5 Canvas 2D Context API (`canvas.getContext('2d')`, `ctx.strokeStyle`, `ctx.strokeRect`, `ctx.arc`).
  * Database Mockup: `Free database`, `STYLES 86`, `Copy prompt` button.
  * Category Tabs: `Simple`, `Elaborate`, `Unique`, `Customizable`, `VOICEOVER` audio waveform sync bar.
* **[00:43 - 01:04]** Node / Architecture Diagram:
  * Frameworks referenced: `Remotion`, `HyperFrames`, `npm install`.
  * Technical method: `JavaScript plain, no framework` using `requestAnimationFrame(draw)`, saving as `file://my-video.html`.
* **[01:08 - 01:45]** Social Media Platform (X / Twitter):
  * Creator profile: `@kevinngo` / Kevin Ngo.
  * Post title: *"Claude 3.5 drew every frame of this animation using JavaScript. The life of a fruit fly."* (Dated Sep 15, 2024, 1.3M Views).
* **[02:12 - 03:42]** Website: Futurepedia (`futurepedia.ai`) - *"The AI Style Atlas"* / *"The AI Video Style Atlas"*:
  * Header Tabs: `AI Tools`, `AI for Business`, `AI Courses`, `Newsletter`, `Resources`.
  * Filter Tags: `Explainer`, `Style clip`, `Hand-Drawn`, `Patterns & Textures`, `Paper & Craft`, `Illustration`, `AI & Design Movements`, `Retro Digital`, `3D & Dimensional`.
  * Interactive controls inside card modal: `Explainer` vs `Style clip` toggle, `No voiceover` vs `With voiceover` toggle, `Storyboard first` checkbox (recommended), `Copy prompt` button.
* **[04:53 - 05:45]** Claude Workspace / UI (`claude.ai` or custom web runner):
  * Model selector: `Opus 3.5 Medium` / `Opus 3.5`.
  * Layout: Split screen with prompt chat history on the left and full-screen HTML Canvas animation artifact viewer on the right with play/pause/timeline controls.
* **[05:54 - 06:05]** Alternate AI Models tested:
  * `Sonnet 3.5` (Claude)
  * `ChatGPT` (GPT-4o HTML output displayed in quicktime player `GLASSMORPHISM-UI.mp4`).
* **[07:29 - 07:33]** File Tree Mockup:
  * Folder `/my-style`: Contains `SKILL.md` and `style.js`.
* **[07:49 - 08:00]** Website: **Google AI Studio** (`aistudio.google.com`):
  * Section: `Playground` -> *"Turn text into natural-sounding speech"*.
  * Model Selection Panel (Right side): Filtered by `Audio` tab -> `Gemini 1.5 Flash TTS` (shown selected: `Selected Gemini 1.5 Flash TTS`).
  * Dialogue Setup: `Speaker 1` (`Puck`), `Style` (`—`), `Expression` (`—`). Button: `+ Add speech block`.

---

### 2. Reproduce Code and Prompts Shown On Screen

* **[00:13] Canvas Code Snippet (`scene.js`):**
  ```javascript
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#d6e8ff';
  ctx.strokeRect(160, 120, 180, 240);
  ctx.arc(250, 190, 36, 0, Math.PI * 2);
  draw(ctx, t); // every frame
  ```

* **[00:58] Plain JS Frame Draw Snippet:**
  ```javascript
  function draw(t) {
    c.fillStyle = '#f5a95c';
    c.fillRect(x(t), 90, 40, 40);
    // ...
    requestAnimationFrame(draw);
  }
  ```

* **[04:23 - 04:26] Topic Input Field (Futurepedia Style Atlas):**
  * Input text entered: `how noise cancelling headphones work`

* **[04:59] Generated Storyboard Beats Text (Left Chat Pane):**
  * Title: `Storyboard: how noise cancelling works`
  * Beat list:
    1. **Hook:** *"How noise cancelling works - AUDIO TECH, EXPLAINED"*
    2. **Outside noise:** Engine noise, outside noise 80 dB (jet engine).
    3. **The ear cup:** Cushions block hiss, low rumble leaks in.
    4. **Mic listens:** Mic listens, chip processes 1000s of reads/sec.
    5. **The flip:** Noise wave flipped upside down (anti-noise).
    6. **At your ear:** Noise + anti-noise = quiet (-30 dB).

* **[07:04 - 07:11] Code Prompt Structure (`cut-paper.js` -> PROMPT):**
  ```javascript
  // Base source snippet:
  const launch = Math.max(0, (t - 1.5) / 1.7);
  const rx = 840 + Math.sin(t * 1.2) * 6 + launch, ry = ...
  // Prompt wrapper text:
  "Make a video in this style. Its full source: [BASE CODE HERE]"
  ```

---

### 3. Step-by-Step UI Actions Performed

1. **[02:12]** Presenter scrolls through the **Futurepedia AI Style Atlas** gallery page.
2. **[02:30]** Clicks on **Manim-Style Math** card to open the preview modal and plays the 15-second video.
3. **[02:49]** Clicks and previews **16-Bit Pixel Odyssey**, **Chalkboard Lesson** [03:08], and **Cut-Paper Diorama** [03:27].
4. **[03:46]** Selects **Glassmorphism UI** style card.
5. **[04:08]** Toggles between `No voiceover` and `With voiceover` buttons.
6. **[04:22]** Types `how noise cancelling headphones work` into the topic field.
7. **[04:29]** Checks/Unchecks the `Storyboard first` option box.
8. **[04:48]** Clicks the blue `Copy prompt` button at the bottom right of the modal.
9. **[04:54]** Switches to the Claude browser window, pastes the prompt into the chat box, and clicks Send.
10. **[05:04]** Reviews the generated visual storyboard panels on the right, types `approved` into the left prompt box, and hits enter to trigger full HTML generation.
11. **[07:52]** Opens Google AI Studio, opens the right-hand `Model selection` drawer, selects `Audio` tab, clicks `Gemini 1.5 Flash TTS`, and navigates to the dialogue playground.

---

### 4. Visual & Animation Style Descriptions

* **Fruit Fly Animation (Kevin Ngo / Claude 3.5) [01:21 - 01:45]:**
  * *Style:* Vintage hand-drawn scientific illustration, textured paper canvas background, biological diagram overlays (cellular grids, neural pathways).
  * *Motion:* Smooth vector path morphing, hatching, cross-hatching detail animations, camera pan/zoom across desk surfaces, organic stop-motion-like feel.

* **Manim-Style Math [02:33 - 02:46]:**
  * *Style:* Dark mode 3Blue1Brown style (black canvas, clean white/neon vector lines, clean mathematical typography, graph plotting with curves and points).

* **16-Bit Pixel Odyssey [02:51 - 03:04]:**
  * *Style:* Retro SNES arcade video game aesthetic (pixel art font, synthwave sunset background in purple/pink, sprite animations, conveyor belts, UI dialogue boxes).

* **Chalkboard Lesson [03:08 - 03:22]:**
  * *Style:* Green slate chalkboard texture, simulated chalk stroke animations (gritty edges, line-drawing path animations, eraser wipes).

* **Cut-Paper Diorama [03:27 - 03:41]:**
  * *Style:* Multi-layered papercraft/stop-motion look (drop shadows between paper cutouts, pastel color palette, paper texture, subtle wiggle animations).

* **Glassmorphism UI [05:10 - 05:32]:**
  * *Style:* Modern web/OS design trend. Translucent frosted glass cards with rounded corners (`backdrop-filter: blur`), vibrant neon gradient background orbs (pink, purple, cyan), glowing vector sound waves, smooth linear card transitions, clean sans-serif typography (Inter-style).

---

### 5. On-Screen Numbers and Analytics

* **[00:20 - 00:22]** Style counter on database header: Count rapidly increases from `22` -> `86`.
* **[01:16]** X/Twitter Post Engagement: `1.3M Views`, `Sep 15, 2024`.
* **[02:13]** Total Styles in AI Style Atlas: `86 visual styles`.
* **[02:35]** Data counter in Manim video: `9,760` -> `366,380` -> `1,000,000` examples; Accuracy `62%` -> `97%`.
* **[02:54]** Data counter in 16-Bit Pixel video: `709` -> `138,695` -> `575,283` examples seen.
* **[05:13]** Decibel readings in Noise Cancelling demo: `13 dB` -> `78 dB` -> `80 dB` (jet engine outside noise); cancellation result: `-19 dB` -> `-30 dB`.

---

### 6. Contradictions or Additional Visual Notes

* **[05:54 - 06:05]** *Presenter Addition:* Presenter explicitly notes that while he used Opus for the main demonstration, Sonnet 3.5 and ChatGPT (GPT-4o) produce almost identical quality results when fed the exact base code prompt, demonstrating that the prompt architecture (embedding full base source code) is doing the heavy lifting rather than model choice alone.


## Segment 08:00 to 11:19

Here is the concrete, detailed visual context breakdown for the video segment (08:00–11:19):

---

### 1. Tools, Apps, Websites, Repos, Models, Plans, Prices, Settings Shown On Screen

* **[08:00 - 08:51] Google AI Studio / Playground (Text-to-Speech / Audio Generation UI):**
  * **Header/Logo:** `Google AI Studio`, Tab: `Playground`
  * **Top Right Overlay:** `Futurepedia` logo and badge.
  * **Right Sidebar - "Speaker settings":**
    * Voice search filter: `Search 2,060 voices`
    * Category dropdowns: `Language` (selected: `English (US)`), `Gender`, `Pitch`, `Style`
    * Voice Categories & Voice Names visible:
      * **Tutor:** *Bindi* (Female, Medium-high pitch), *Lumi* (Female, Low pitch), *Sola* (Female, High pitch)
      * **Commercial Voiceover:** *Kala* (Female, Monotone, Medium pitch), *Nika* (Female, Medium pitch), *Tavi* (Female, Monotone, Medium-high pitch)
      * **Instructional:** *Kira* (Female, Energetic, Medium-high pitch), *Lulu* (Female, Medium pitch), *Mako* (Female, Energetic, Low pitch)
      * **Call Center:** *Fola* (Female, Whimsical, Medium pitch), *Hali*, *Anzo*, *Cleo*, *Finn*
      * **Tech Support:** *Enya*, *Jett*, *Knox*
  * **Main Canvas - Prompt / Audio Block Settings:**
    * **Speaker 1:** `Fola`
    * **Style dropdown options:** *Whisper*, *Whisper quietly*, *Friendly* (Warm and neutral delivery with micro-pauses), *Narration* (Commanding, rich vocal modulation, dramatic pauses), *Promote* (High energy, elongated vowels). Selected: `Narration`.
    * **Expression / Audio Tag options:** `argh`, `breath`, `cackle`, `cheer`, `chuckle`, `giggle`, `groan`, `grunt`, `gasp`, `cough`, `sigh`, `snort`, `snicker`, `pant`, `yawn`, `clear-throat`, `whisper`.
    * **Model Selection:** `Audio 1.0` (visible in bottom right).
    * **Audio Player Bar:** Play/Pause, Timeline (`0:00 / 0:14`), Volume, Download icon (`MP3`).

* **[09:06 - 09:28] Claude Code / Terminal Application (Desktop App):**
  * **App Name/Title Bar:** `Claude (Audio Transcript SRT)`
  * **Interface Elements:** Task box, Environment chooser (`This computer`), Model selector: `Opus 3.5 Medium`.
  * **File Attached:** `/Users/main/Downloads/Generated Audio October...3_22PM.mp3`
  * **Execution Output:** Running local command / checking tools: `Checking for whisper and ffmpeg tools...`, `There's a local MLX Whisper model. Let me find something that can run it.`
  * **Output Generated:** Full word-level `.srt` timestamp block output on screen.

* **[09:29 - 09:48] Futurepedia Website - "The AI Style Atlas":**
  * **URL:** `futurepedia.io` (or Futurepedia internal page)
  * **Page Title:** `The AI Style Atlas`
  * **Description:** "81 visual styles for animated videos... Copy prompt button pastes it into Claude with your custom script and rebuilds that style for you."
  * **Filter Pills:** `Explainer`, `Style Types`, `Art & Design Movements`, `Retro & Digital Art`.
  * **Card Selected:** `Flat-Vector Science`
    * **Card Metadata:** `Explainer`, `Style #01`
    * **Card Description:** "Flat vector science explainer illustration, deep navy to violet space gradient, chunky pastel-colored rounded shapes with multi-stop gradients... Big smooth camera moves through scale..."
    * **Toggles:** `With voiceover` (ON), `Storyboards first` (OFF)
    * **Input Field:** `Now stars are born`

* **[09:49 - 09:51] Claude AI Web Interface / Desktop Chat:**
  * **Header:** `Back at it, Kevin`
  * **Model Selector:** `Opus 3.5 Medium`

* **[09:52 - 10:48] HTML5 / Canvas Interactive Video Renderer & Player (Futurepedia Motion Graphics Studio):**
  * **Left Panel:** Script & Timing sync table (`Beat`, `Time`, `SRT`, `On screen` text descriptions).
  * **Right Panel:** Interactive SVG/Canvas animated video preview window (`How a star is born`).
  * **Bottom Controls:** Progress bar (`0:00 / 0:14`), Play/Pause button, Sound toggle (`Sound: on`), Loop toggle, **"Load voiceover"** button/modal.

---

### 2. Prompts and Text Shown On Screen

* **[08:21 - 08:38] Script pasted into Google AI Studio TTS:**
  ```text
  Stars begin as huge, cold clouds of gas and dust.
  Gravity slowly pulls the cloud together, and as it collapses, it spins faster and heats up.
  When the center reaches about ten million degrees, hydrogen atoms start fusing into helium, releasing enormous energy.
  That's the moment it ignites. A new star is born, and it can shine for billions of years.
  ```
  *(Note: At [08:34], the tag `<breath>` is briefly inserted between "...gas and dust." and "Gravity slowly...", then removed).*

* **[09:08 - 09:12] Prompt typed into Claude Code:**
  ```text
  give me a word-level srt transcript for this I can copy paste
  ```

* **[09:22 - 09:28] Generated SRT Text in Claude Code Window:**
  ```text
  00:00:00,000 --> 00:00:00,560
  Stars

  00:00:00,560 --> 00:00:00,880
  begin

  00:00:00,880 --> 00:00:01,000
  as

  00:00:01,000 --> 00:00:01,280
  huge

  00:00:01,280 --> 00:00:01,840
  cold

  00:00:01,840 --> 00:00:02,320
  clouds

  00:00:02,320 --> 00:00:02,480
  of

  00:00:02,480 --> 00:00:02,880
  gas
  ```

* **[09:40] Topic Input in Style Atlas:**
  ```text
  How stars are born
  ```

* **[09:44] SRT Transcript pasted into Style Atlas Prompt Builder:**
  ```text
  00:00:00,000 --> 00:00:00,560
  Stars
  00:00:00,560 --> 00:00:00,880
  begin
  ...
  ```

* **[09:52 - 10:11] Generated Code/Animation Script Data in Output Player Panel:**
  * **Beat "cloud" (0.0s):** "The title pops in and moves to the corner as a massive cloud of soft spheres fills the frame... labels appear on huge, -260°C crossout on solid, and the 'gas' and 'dust' labels on their words."
  * **Beat "gravity" (4.0s):** "A 'Gravity' label appears and dotted arrows pull inward. The cloud contracts and a dense core forms."
  * **Beat "collapse" (5.9s):** "The cloud flattens into a spinning disk around a sleeping protostar... The spin accelerates..."
  * **Beat "fusion" (11.8s):** "The camera dives into the core with a glow transition... Four hydrogen nuclei (2 protons + 2 neutrons) fuse into helium... Energy shell lands on core."
  * **Beat "ignite" (13.9s):** "The star wakes up happy! Pulses, then flashes and ignites as 'ignites'... A new star is born!"

---

### 3. Step-by-Step UI Actions Performed by Presenter

1. **[08:01 - 08:19]** Scrolls through the voice options list in Google AI Studio, clicking the preview audio icon for "Bindi", "Lumi", "Kala", and "Fola".
2. **[08:21]** Pastes the text script into the main text box.
3. **[08:23 - 08:27]** Clicks the `Style` dropdown menu and selects `Narration`.
4. **[08:29 - 08:36]** Clicks `+ Expression` dropdown, selects `breath`, inserting `<breath>` into the text canvas, then highlights and deletes it manually.
5. **[08:41]** Clicks the `Run` button in the bottom right corner.
6. **[08:50]** Clicks the `Download MP3` icon on the generated audio player toolbar.
7. **[09:06]** Switches to Claude Code desktop app; drags and drops the downloaded `Generated Audio...3_22PM.mp3` file into the input prompt bar.
8. **[09:08 - 09:12]** Types request for word-level SRT transcript and presses Enter.
9. **[09:42]** Copies the resulting word-level SRT timestamp code block from Claude Code.
10. **[09:30 - 09:33]** Navigates to Futurepedia "AI Style Atlas" page and selects the card `Flat-Vector Science`.
11. **[09:37]** Toggles the switch to `With voiceover` (Blue state).
12. **[09:39]** Types `How stars are born` into the topic field.
13. **[09:44]** Pastes the SRT transcript text into the transcript field.
14. **[09:45]** Unchecks `Storyboard first`.
15. **[09:47]** Clicks blue `Copy prompt` button.
16. **[09:49 - 09:51]** Opens Claude chat interface, pastes the prompt, and clicks Send.
17. **[09:54 - 09:59]** In the rendered video output interface, clicks the `Load voiceover` button on the bottom right controls, opens system file explorer, and selects/drags the voiceover `.mp3` file into the drop zone labeled "Drop the voiceover audio".
18. **[10:13]** Hits Play to preview the full synchronized animation with voiceover audio.

---

### 4. Visual Style & Motion Graphics Breakdown (Generated Video: "How a star is born")

* **Visual Style / Aesthetic:** Flat Vector Motion Graphic / Modern Tech Explainer.
* **Palette:** Deep indigo/violet space background (`#1A103C`), soft pastel pink, purple, and blue overlapping 3D-shaded spheres with soft drop shadows and multi-stop gradient shading. Accents in bright golden yellow, white, and cyan.
* **Typography:** Bold round sans-serif font (`Fredoka` or similar rounded geometric sans) in solid white and yellow with smooth springy scale-in animations.
* **Camera / Transitions:**
  * **00:00 - 00:04:** Static centered wide shot showing a giant cluster of colorful spheres forming a cosmic dust cloud. Scale-in text title: *"How a star is born"*, top right temperature badge (*"-260 °C temperature"*), and bottom light-year scale arrows (*"dozens of light-years"*).
  * **00:04 - 00:06:** Dotted blue arrows pop in around the periphery pointing inward toward a label *"Gravity"*. Spheres compress inward smoothly.
  * **00:06 - 00:08:** The cloud flattens into an elliptical rotating disk with dashed orbit lines around a sleeping yellow protostar center face. Temperature ticks up to *"570 °C"*.
  * **00:09 - 00:10:** Fast zoom/white flash transition into the core. Background shifts to radiant orange/pink radial gradient.
  * **00:10 - 00:11:** Core temperature reads `"≈ 10,000,000 °C"`. Four pink sphere atoms labeled `"H"` (Hydrogen) slide together, collide with a shockwave pop, and fuse into a combined nucleus labeled `"Helium"` with wiggly orange energy rays radiating outward.
  * **00:12 - 00:15:** Flash cut back to the disk view: the center protostar opens eyes, smiles brightly, and emits a bright yellow shockwave burst. Text pops up: *"New star!"* and *"Billions of years"*.
* **Pacing & Easing:** Snappy spring easing on pop-in labels, fluid linear rotation on the orbital disk, precise audio-visual synchronization to word timestamps.

---

### 5. Dashboard Numbers / Analytics Shown

* **[09:48] Futurepedia Style Atlas:**
  * Style Examples counter: `11,383 examples` shown on the modal badge.

---

### 6. Video Annotations & Screen Captions (Overlay Additions)

* **[09:03 - 09:05] Text Caption Overlay:** On-screen text correction added at the bottom center: `*claude code` (correcting the speaker saying "Claude").
* **[11:12 - 11:18] Call to Action Overlays:**
  * QR Code graphic displayed on screen.
  * Animated red button graphic pointing down: `Click the link below`.
