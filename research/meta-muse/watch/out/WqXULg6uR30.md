# Danny Why, Claude Literally Just Changed YouTube Forever

https://www.youtube.com/watch?v=WqXULg6uR30

## Segment 00:00 to 08:00

Here is the visual context and detailed technical breakdown from the video clip (00:00 - 08:00):

---

### 1. Tools, Apps, Websites, Repos, Model Names, Plans, Prices, and Settings on Screen

* **Hardware/Gear Visible**:
  * [00:00] RØDE broadcast boom arm and dynamic broadcast microphone (black).
* **Websites / Web Apps**:
  * [00:11] **YouTube Studio** (`studio.youtube.com`) Analytics dashboard.
  * [01:36] **Higgsfield AI** (`higgsfield.ai`):
    * Navigation bar tabs: *Explore, Images, Video, Audio, MCP, API, Genjutsu 3.0, Katana, AI Influencer, AI Academy, New ChatGPT Plugin, Ads Studio, Effects, Cinema, Contests*.
    * Features listed on homepage cards: *Higgsfield-Academy*, *Wan 3.0 Unlimited* ("up to 1080p, text, image, video or audio. No limits"), *Higgsfield Genjutsu*, *Seedance 2.5* ("The most advanced video model"), *Genjutsu API*, *AI Influencer*, *Cinema Studio 4.0*, *Higgsfield MCP for Claude*.
  * [02:04] **Claude Web UI** (`claude.ai/customize/connectors`):
    * Section: *Customize* -> *Connectors*.
  * [02:51] **Higgsfield Pricing Page** (`higgsfield.ai/pricing`):
    * **Yearly Billing (Save 50%)**:
      * *Basic*: $9.8/mo ($117.6 billed annually) - 9,600 credits/yr (800/mo), cost per 100 credits: $1.23.
      * *Pro*: $19.95/mo ($239.4 billed annually) - 57,600 credits/yr (4,800/mo), cost per 100 credits: $0.42.
      * *Ultra*: $99.95/mo ($1,199.4 billed annually) - 360,000 credits/yr (30,000/mo), cost per 100 credits: $0.33.
    * [02:56] **Monthly Billing**:
      * *Basic*: $19.8/month - 800 credits ($2.48 per 100 credits).
      * *Pro*: $39.9/month - 4,800 credits ($0.83 per 100 credits).
      * *Ultra*: $199.9/month - 30,000 credits ($0.67 per 100 credits).
  * [03:04] **Claude Desktop / Web App**:
    * Left sidebar options: *New chat, Projects (Beta), Artifacts, Scheduled, Customize, Settings*.
    * Switch toggle at top left: Chat mode (speech bubble) vs. **Claude Code** mode (terminal/prompt icon with `>_`).
    * Model Selector dropdown: Shows **Opus 3.5 (Max)**, Opus 3.5, Sonnet 3.5, Haiku 3.5, etc.
    * Effort setting dropdown: Options include *Low, Medium, High, Max* (Presenter selects **Max**).
  * [03:30] **Google Docs**: Document titled *"Claude Code + ChatGPT Guide (by Danny Wfs)"* hosted at `docs.google.com`.
* **Libraries / Frameworks Mentioned in Prompts/Chat**:
  * [03:35, 07:30] **Remotion** (React-based programmatic video creation framework).
  * [03:35, 07:30] **ElevenLabs** API (voiceover synthesis, specifically "David, a calm, deep male narrator voice").
  * [05:03, 06:43] **GPT-Image 2.5** / Higgsfield image generation & background removal tool (`remove_background`).
* **Environment / File Explorer Panel in Claude Code**:
  * [04:30, 07:14] Right-side panel showing:
    * *Environment*: This computer, New realizations, Remote Control.
    * *Outputs*: `script.md`.
    * *Assets / Images generated*: `brain.png`, `neuron.png`, `neuron-2.png`, `axon-end.png`, `dendrites.png`, `branching.png`.

---

### 2. Prompts and Code Shown on Screen

#### [03:30 - 03:56] STEP 1 Prompt (Script & Concept Generation):
```text
STEP 1:
You're going to help me make a short animated video, step by step. Today we only write the script. Don't make any pictures or code yet. Write a script for a vertical video (9:16), about 30 seconds long (around 70 words), making one continuous journey. How the script should sound:
- Like a real person explaining something to a friend. Short sentences, simple words.
- The first sentence names what we're looking at and makes people curious. No intro, no "Have you ever wondered...", only raw calm narrator. Read no makeup numbers. If you're not sure about a fact, leave it out. - No hype words like incredible, amazing, mind-blowing or shocking. How the video should work: - One continuous camera journey, no hard cuts: start on something recognizable, zoom into the detail that explains it, and end by pulling back (or looping to the start).
- Every sentence has something on-screen that matches it exactly.
- Few pictures (4 to 6), each a single object on its own, so the animation team can move them separately. Labels, numbers and text are added by the animation, never drawn in the pictures. - One visual style for every picture. Unless my idea says otherwise: black and white scientific illustration, fine lines and soft graphite shading, like 19th-century anatomy textbook, fine line ink draw is used only for light and movement, and the animation adds it. One accent color (a soft teal or amber) is used only for light and movement. - The camera moves through this world as the narrator speaks, it does the picture a file name and what's next reached a picture. 4. Style line, written out exactly as it should look. Save it all in script.md and show it to us. My idea: [WRITE YOUR IDEA HERE]
```
*Presenter replaces `[WRITE YOUR IDEA HERE]` with:*
```text
vertical science animation, like a mini documentary, about the brain. First just the picture of the brain, then it zooms in into a neuron...
```

#### [05:02 - 05:13] STEP 2 Prompt (Asset Generation via Higgsfield MCP):
```text
STEP 2:
Now make the pictures for script with Higgsfield. For each picture in the picture list:
- Write a prompt: what it is and from which aspect, then "lots of empty space around it, nothing touching the edges", then the style word for word, then "plain white background, no text, no labels, no numbers, no arrows, no shadows, no frame".
- Make it with GPT-Image 2.5, high quality, square, unless the object is clearly wide or tall.
- Remove the background so it's a clean cut out, and save it in an images folder with the name from the list. Then look at every picture; if it has text, a wrong color, something cut off at the edge, extra objects, or it doesn't match the style of the others, make it again (twice at most). Save all the prompts you used in images/prompts.md, tell me how many credits it used and how much it was in dollars based on how your credits you use on Higgsfield, and open the pictures so I can see them. Don't start the animation yet.
```

#### [07:29 - 07:38] STEP 3 Prompt (Animation & Voiceover generation via Remotion):
```text
STEP 3:
Now the voice and the animation:
1. The voice: use ElevenLabs. Pick a calm, deep male narrator voice from the voice library and read the narration from script.md word for word. Save it, and get the exact time of every word.
2. The animation: set up a Remotion project in its folder. Vertical 1080x1920, 60 fps, as long as the voice plus one second. White background with a very faint dot grid, so you can feel the camera move. Follow the script closely, and make every visual and exactly as words come in.
- soft glowing lights in the accent color that travel along paths on the pictures (look at each picture to find the exact path, so the light stays on it).
- labels that fade in, bold and clean, with little leader lines.
- layers at different depths, the far ones moving slower and a little blurred.
- camera moves and zoom and pull-back.
- one camera for everything: Zoom and move the whole scene together, like a real camera filming a page.
- camera moves continuously, no stops: the whole video is one continuous journey at constant speed: nothing stops abruptly, and each move flows into the next.
- How it should move (the most important part):
- Every move starts slowly, speeds up, and settles nicely. Nothing moves at one constant speed. Nothing pops in or out.
- fade-in with a little scale and blur over about half a second.
- labels draw themselves on.
- lines draw themselves on: a white line starts with a dot, moves, and a tiny burst of sparks where it arrives.
- Nothing pops in or out. Keep it clean.
- Keep the crop 8% and the frame free of anything important, and never cut a picture off at the edge. Build it with a clean folder structure: the pictures, paths, labels and timings all live in as settings file, so new video only needs a new settings file.
3. Check it: render every edit word and see if every sentence start, look at all of them, and fix anything that's off. Then render the final video with the voice to out/video.mp4 and open it.
```

---

### 3. Step-by-Step UI Actions

1. **Analytics Inspection**:
   * [00:11] Lands on YouTube Studio channel analytics dashboard.
   * [00:49] Clicks top-right date range picker (defaulting to "Last 28 days") and changes it to **"Last 90 days"**.
   * [01:00] Clicks **"See live count"** link on Realtime subscriber card.
   * [01:04] Clicks time-range dropdown in the top-right of Live Count screen and selects **"Last 90 days"**.
2. **Higgsfield MCP Setup**:
   * [01:36] Navigates to `higgsfield.ai`.
   * [01:56] Clicks on **"MCP"** tab in the main top header menu.
   * [02:01] Selects **"Claude Code"** tab on the MCP integrations screen.
   * [02:03] Clicks green **"Connect Higgsfield"** button.
   * [02:05] Claude web page opens directly to modal titled *"Add custom connector"*.
   * [02:08] Modal shows connector details: Name: `Higgsfield`, URL: `https://mcp.higgsfield.ai/mcp`. Presenter clicks **"Continue"** button at bottom right.
3. **Claude Code Setup and Generation**:
   * [03:04] Switches to Claude Code interface (`>_` toggle on the top left).
   * [03:56] Switches to Google Doc, highlights STEP 1 text, right-clicks, and selects **Copy**.
   * [04:00] Pastes into Claude Code chat box.
   * [04:03] Deletes `[WRITE YOUR IDEA HERE]` and types custom brain animation topic.
   * [04:14] Clicks model selector at the bottom-right corner; selects **Opus 3.5**.
   * [04:22] Opens effort settings menu; selects **Max effort**.
   * [04:29] Clicks the send arrow button (submits prompt).
   * [05:04] Navigates back to Google Docs, highlights STEP 2 prompt, copies it, pastes it into Claude Code prompt input, and submits.
   * [07:33] Navigates to Google Docs, copies STEP 3 prompt, pastes it into Claude Code, and submits.

---

### 4. Visual Style of Assets and Motion Graphics

* **Generated Illustrations (Higgsfield outputs shown at [06:27 - 07:23])**:
  * **Theme / Medium**: 19th-century vintage medical / scientific anatomical lithograph / etching style.
  * **Palette**: Monochrome grayscale / pencil / graphite sketch on transparent cutout background (displayed against dark mode UI background).
  * **Subject Matter Generated**:
    1. Full human brain side profile with visible cerebral folds and cerebellum.
    2. Single multipolar neuron showing soma (cell body) and radiating dendrites.
    3. Synaptic terminal / bouton bulb containing spherical neurotransmitter vesicles.
    4. Axon cross-section / receptor interface.
    5. Detailed branching dendritic tree network.
  * **Composition**: Centered single botanical/anatomical specimen style, sharp high-contrast line work, no frame, no text or labels baked into the graphic.

---

### 5. Numbers on Dashboards and Analytics

* **YouTube Channel Analytics ([00:11, 00:30 - 01:06])**:
  * **Last 28 Days**:
    * Views: **18.2M** (Exact: **18,236,881**)
    * Watch time (hours): **78.5K**
    * Subscribers gained: **+10.8K**
  * **Realtime Analytics**:
    * Current subscribers: **14,364** (later updates to **14,365** and **14,391**)
    * Realtime 48-hour views: **6,428,344** (later shows **6,431,446** and **6,506,763**)
    * Top individual day spikes:
      * Oct 9, 2024: **299,056 views**
      * Oct 10, 2024: **719,294 views**
      * Oct 11, 2024: **2,298,487 views**
      * Oct 12, 2024: **3,529,647 views**
      * Oct 13, 2024: **3,590,384 views**
      * Oct 14, 2024: **2,581,217 views**
    * Realtime hourly spike shown: **181,248 views/hr** and **151,416 views/hr**.
* **Generation Costs & Credits in Claude Code ([07:08 - 07:20])**:
  * Total images generated: **5 pictures**
  * Cost breakdown:
    * 5 pictures at 2.75 credits each + 5 background removals at 1 credit each = **18.75 credits** total.
    * Converted dollar cost: **$1.48** (billed under Team Plan rate of ~$0.08 per credit).

---

### 6. Contradictions or Additional Information on Screen

* **Channel Identity Concealment**:
  * [00:11 - 01:06, 06:12 - 06:26] The presenter verbally states he will conceal the channel name and niche. On the screen, white censorship boxes are manually overlaid across the channel avatar, channel name, video titles, and video thumbnails in YouTube Studio.
* **Opus 3.5 Model Name**:
  * [04:18] The presenter refers to selecting "Opus 5.5" verbally multiple times ("choose Opus 5.5"), but the UI clearly reads **"Opus 3.5"** and **"Opus 3.5 (Max)"**.
* **Voiceover / Animation Tools**:
  * In the spoken intro, the presenter only highlights "Claude Code and Higgsfield", but the prompts and technical execution shown on screen explicitly rely on **ElevenLabs** for TTS audio generation and **Remotion** (React code) for assembling the programmatic video layout and camera easing.


## Segment 08:00 to 13:06

Here is the detailed summary of the visual context, tools, prompts, and motion graphics shown in the video clip:

---

### 1. Tools, Apps, Websites, Repos, Models & Settings ON SCREEN

* **Claude Code / VS Code Terminal Interface:**
  * **Project Workspace:** `Brain animation script`
  * **File Tree (right sidebar):** `outputs/`, `video.mp4`, `script.json`, `voice-takes.json`, `temp/`, `dendrites.png`, `neuron.png`, `synapse.png`, `axon.png`, `brain.png`, `render.py`, `sci.py`, `sci-travel.py`.
  * **AI Model & Settings (footer):** `Claude 3.5 Sonnet` / `Opus 3.5`. Toggle note: *"Claude thinks longer with Max effort and can consume 2.5x+ more usage than Medium."*
  * **Integrated API Tool Callouts:**
    * **ElevenLabs API:** Used via `ElevenLabs.generate_speech` tool. Selected Voice: `Quentin - Narrator and Educator` (*deep, calm American documentary voice*). Credit counter: *33.2 used, 426 ElevenLabs credits (~$0)*. Saved file: `creative_transcription_audio`.
    * **Higgsfield API / Widget:** `Widget from Higgsfield` (Generates transparent/isolated assets using `remove_background`). Generated asset grid: `orig_grid.jpg`.
* **Google Docs:**
  * **Document Title:** `Claude Code + ChatGPT Guide`
  * **Section:** `STEP 4:` prompt template for long-form 10-minute animations.
* **Websites:**
  * **Skool Community:** `skool.com/@danniphy` (`Creator School`). Pricing: `$29/month` with `Start Free Trial`. Member stats: `425 members`.
* **Video Media Player:**
  * File rendered: `full-video-first-2-min.mp4` (1920x1080 resolution, 60 FPS, length 1:44).

---

### 2. Prompts & Code Shown on Screen

* **Asset Prompt & Instructions (in prompt file at [08:00]):**
  ```text
  axon.png | 2048 x 2048
  check: off the axon for the first try. They have to be vector, not real 3d objects, touch nothing. 
  Images have to be isolated, plain white background, sharp vector style.
  ```

* **Step 4 Master Prompt (copied from Google Docs at [10:17] & pasted at [10:29]):**
  ```text
  Step 4: The animation
  Plan, research facts, write script and shot list.
  Make the new pictures with Higgsfield.
  Make the voice paragraph by paragraph with ElevenLabs.
  Join the voice and time every word.
  Build the template and settings file.
  Extend the template for the long video.
  Fix anything that's off.
  Check still every second and render.
  Render out video.mp4 and write script.md
  ```

* **Voice Command Prompt (typed/spoken into Claude Code at [11:06]):**
  ```text
  As my friend can you first send me the first two minutes because I don't want to wait
  one or two hours for you to make the full animation. I want to see how it looks in the first two minutes.
  ```

---

### 3. Step-by-Step Presenter UI Actions

1. **[08:11]** Presenter scrolls down through Claude Code terminal execution logs showing file outputs.
2. **[08:27]** Clicks the play button on the embedded ElevenLabs audio preview widget inside the terminal.
3. **[09:28]** Clicks on the generated video link in Claude Code to launch the rendered 34-second vertical video in the native player.
4. **[10:17]** Switches browser tabs to Google Docs (`Claude Code + ChatGPT Guide`), highlights the `STEP 4` text block, right-clicks, and selects **Copy**.
5. **[10:24]** Switches back to Claude Code terminal, right-clicks in the input field, pastes the prompt, and submits it.
6. **[10:42]** Navigates to `skool.com` to present his "Creator School" community page.
7. **[11:00]** Returns to Claude Code, holds the voice dictation microphone button, speaks the request for a 2-minute preview, and sends the prompt.
8. **[11:42]** Opens the resulting `full-video-first-2-min.mp4` video file directly from File Explorer into Media Player to play it back.

---

### 4. Generated Video & Motion Graphics Visual Style

* **Vertical Short Animation Preview (`34s` duration, 9:16 aspect ratio) [09:29]:**
  * **Visual Style:** High-contrast 3D medical/scientific graphic style on a deep royal blue ambient background with faint glowing dust particles.
  * **Graphics & FX:**
    * Rotating 3D blue brain model zooming in smoothly to an individual glowing white neuron cell.
    * Glowing circular callout magnifying glass tracking the synaptic junction.
    * Animated electric sparks traveling down the axon pathway.
  * **Typography:** Bold, clean sans-serif callout labels in white (`NEURON`, `DENDRITES`, `AXON`, `SYNAPSE`).
  * **Counter Effect:** Animated text counter incrementing rapidly to `= 86,000,000,000 NEURONS`.

* **Horizontal Long-Form Video Preview (`1:44` duration, 16:9 aspect ratio) [11:45]:**
  * **Visual Style:** Modular, sleek educational documentary style matching channels like Kurzgesagt or Vox.
  * **Key Sequences:**
    1. **Sodium Connection [11:53]:** 3D brain model on left connecting via glowing dotted arrow line to an isolated white salt pile labelled `TABLE SALT NaCl`.
    2. **Motion-Tracked Text [12:00]:** White uppercase words (`SEE`, `REMEMBER`, `DECIDE`) pinned to specific coordinates on the surface of the rotating brain model.
    3. **Flowchart Node Sequence [12:24]:** Horizontal process diagram linking icon nodes (`BRAIN` $\rightarrow$ `NEURON` $\rightarrow$ `SYNAPSE` $\rightarrow$ `CHEMICALS` $\rightarrow$ `ATOMS`) with a traveling light pulse.
    4. **Infographic Bar Charts [12:45]:** Dynamic bar chart comparison:
       * **Weight Bar:** `2%` (with `1.4 KG = 3 LB` brain label).
       * **Energy Bar:** Growing bar graph reaching `20%` alongside a vector lightbulb graphic displaying `≈ 20 W`.
  * **Audio-Visual Sync:** Every graphic transition, text print, and camera zoom is frame-synced to the exact word timestamps generated by ElevenLabs transcription logs.

---

### 5. Dashboard & Analytics Numbers

* **ElevenLabs API:** 33.2 credits consumed / 426 credits remaining.
* **Skool Community Stats:** 425 active members paying $29/month.
* **Render Times:**
  * 34-second vertical video rendered in ~80 seconds.
  * 1:44 preview video generated in ~30 minutes total setup/rendering time.

---

### 6. Contradictions & Additions

* **Duration Difference:** The presenter asks for "the first 2 minutes" of the long video, but the rendered MP4 preview generated by Claude Code (`full-video-first-2-min.mp4`) is actually **1 minute 44 seconds** long.
