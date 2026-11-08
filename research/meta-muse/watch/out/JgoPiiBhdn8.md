# Massimo Seq, Beginners Guide to AI UGC Ads in 2026 (Realistic)

https://www.youtube.com/watch?v=JgoPiiBhdn8

## Segment 00:00 to end

Here is the structured breakdown of the tools, code, UI actions, visual style, analytics, and on-screen details from the video:

---

### 1. Tools, Apps, Websites, Repos, Models, Plans, Prices, and Settings
* **Platform:** UGC OS (web app interface)
* **AI Text/Script Models:** Gemini 3.6 Flash
* **AI Image Models:** GPT Image 2, Seedream 5.0 Pro, Nano Banana 2
* **AI Video Models & Settings:**
  * **Grok Imagine Video 1.5:** 720p / 480p, 5s–10s clips, 9:16 aspect ratio ($0.10 per clip / 22–45 credits).
  * **Seedance 2.5:** 25s full render, 9:16 aspect ratio (144–180+ credits).
  * **Gemini Omni:** Used for visual quality comparison.
* **AI Voice Model:** Gemini 2.5 Pro TTS (Voice: *Achemar*, Style: *Empathetic*, Pace: *Rapid Fire*, Expressiveness: *1.00 Creative*, Accent: *Neutral*). Cost: 5 credits.
* **Editing Automation:** Claude Code CLI using a custom skill (`/video-editor`).

---

### 2. Prompts and Code

* **[02:16] Additional Instructions Prompt (Yap Ad):**
  > `No text on screen and keep it one shot in the same location, which is the character's parked car.`

* **[03:29] Voice Profile Prompt:**
  > `VOICE - Female, early 20s with a neutral American accent. Warm, conversational, and direct, speaking with the effortless authority of someone talking to a friend from the front seat of their car...`

* **[03:52] Scene Prompt (Grok Video):**
  > `[0:00-0:04] Medium portrait shot of CHARACTER sitting in the driver's seat of a parked car, addressing the camera directly under natural daylight streaming through the windshield...`

* **[08:28] Claude Code Terminal Command (B-Roll Edit):**
  > `/video-editor please edit the B-roll clips over the voiceover for me`

* **[11:19] Additional Instructions Prompt (Street Interview):**
  > `Don't include any captions on screen.`

---

### 3. Step-by-Step UI Actions

1. **Ad Analyzer:** Upload winning UGC ad video $\rightarrow$ generate reverse-engineered scenes or transcript $\rightarrow$ click **Remix for your product**.
2. **Script Generation:** Select product from bank $\rightarrow$ enter custom parameters/duration $\rightarrow$ click **Rewrite Scene Prompts** / **Generate Script Variations**.
3. **Character Creator:** Drag and drop reference image $\rightarrow$ AI auto-fills facial & physical traits $\rightarrow$ select preset clothing/background $\rightarrow$ select **GPT Image 2** $\rightarrow$ click **Generate Character** $\rightarrow$ save to bank as **Ava**.
4. **Playground / Video Generation:** Paste master prompt and voice settings $\rightarrow$ select video generator model (Grok Video 1.5 or Seedance 2.5) $\rightarrow$ set clip duration $\rightarrow$ click **Generate Video**.
5. **B-Roll Storyboard:** Select Character, Product, and Script $\rightarrow$ click **Generate Storyboard** $\rightarrow$ generate image variations $\rightarrow$ click **Animate** on selected scenes.
6. **Automated Editing:** Drop generated raw video clips and audio into the local directory $\rightarrow$ call `/video-editor` skill inside Claude Code.

---

### 4. Visual Style of Generated Videos & Graphics
* **Format:** Vertical 9:16 format designed for TikTok/Instagram Reels.
* **Yap Ad Style:** Static single-shot handheld selfie camera inside a sunlit parked car; natural movement holding an iced drink/product; clean bottom-centered animated captions.
* **Storytelling B-Roll Style:** Dynamic multi-cut sequences (bathroom mirror check, morning routine, table setup, close-up product intake); soft natural lighting; color-synced captions.
* **Street Interview Style:** Moving tracking shot following a subject walking through a city street, casual interview framing, street ambient noise blended into audio track.

---

### 5. On-Screen Numbers, Dashboard Metrics, and Costs

* **Model Cost Comparison:**
  * **Grok Imagine Video 1.5:** ~$0.10 / 22–45 credits per clip (15x cheaper than Seedance 2.5, 3x cheaper than Gemini Omni).
  * **Seedance 2.5:** 180+ credits per render.
* **Efficiency Scaling Metric:** 100 Grok Video 1.5 clips generated for the cost of 1 Seedance 2.5 render.
* **Editing Time:** Reduced manual editing from ~6 hours down to ~5 minutes using Claude Code.

---

### 6. On-Screen Additions and Notable Details

* **[12:35] Presenter Note:** During the 480p low-cost Grok video test at 12:43, captions were accidentally baked into the video prompt text, demonstrating that prompt text controls burn-in captions if not explicitly excluded.
