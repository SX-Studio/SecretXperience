Here is a precise, step-by-step production recipe extracted from the video tutorial.

---

### 1. Goal & Animation Style
* **Style:** 2D "What-if" stick-figure/minimalist animated short videos featuring custom SVG stick characters with exaggerated facial expressions, dark/sunset urban backdrops, and fast-paced narration.
* **Target Genre / Channels Mentioned:** *Ifverse* (00:00, 8M+ monthly views; 4.6M view videos), *FunNotSoFun* (954k views), *iFinity* (580k views).
* **Format:** Short vertical/horizontal animated episodes (~15–25 seconds long).

---

### 2. Tools, Models, & Setup Requirements

#### **A. AI Tools & Models**
1. **OpenCode** (00:59, 01:25, 05:02) — Free, open-source CLI-based AI agent runner/environment (runs locally on your machine, similar to Claude Code).
2. **GLM 5.3 Flash (by Z.AI)** (00:27, 01:36, 05:05) — **$0 / Free** model available inside OpenCode. Requires no account creation and no API key.
3. **Claude Opus / Claude Code** (00:29, 08:54, 13:24) — Paid option ($20–$100/mo plan) used as a benchmark or to write/build custom AI "skills".
4. **ElevenLabs** (04:32, 05:15, 08:10) — Used for AI voiceover and sound effects.
   * **Free Tier:** 10,000 free credits/month (04:45) (~40–50 short cartoons/month for $0).

#### **B. Underlying Engine & Software Stack** (05:19)
* **Node.js (LTS)** — Engine running Remotion to render videos.
* **Python (3.12)** — Runs helper scripts (fetching voices via API, lining up timing/subtitles, setting up storyboards).
* **FFmpeg** — Handles audio/video processing, volume mixing, and final file rendering.
* **Remotion** — Code-driven video creation framework (`.tsx` files using React/SVG).

---

### 3. Step-by-Step Production Setup & Workflow

#### **Step 1: Install System Dependencies (Windows / Mac)** (05:48)
Open your terminal (PowerShell on Windows) and run:
```bash
winget install OpenJS.NodeJS.LTS
winget install Python.Python.3.12
winget install Gyan.FFmpeg
pip install numpy pillow
```

#### **Step 2: Install OpenCode** (06:08)
```bash
npm install -g opencode-ai
```

#### **Step 3: Setup Project Directory & Skill** (06:17, 07:43)
1. Create a dedicated project folder on your computer (e.g., `Desktop/my-cartoons`).
2. Download the free custom **`what-if-animation` skill** repository from GitHub (07:38).
3. Place the downloaded folder inside `.claude/skills/what-if-animation` within your project folder (07:43).
4. Add the OpenCode command file (07:59):
   Copy `opencode/commands/what-if.md` into your local `.opencode/commands/` directory so you can trigger the skill directly via `/what-if`.

#### **Step 4: Set Up ElevenLabs API Key** (08:10)
1. Sign up for a free ElevenLabs account and generate an API key.
2. In your project root folder (`my-cartoons`), create a `.env` file containing:
   ```env
   ELEVENLABS_API_KEY=your_actual_api_key_here
   ```
   *Alternative:* Type into OpenCode: `"create a .env file for me, here is my ElevenLabs key: [KEY]"` (08:28).

#### **Step 5: Launch OpenCode & Configure Model** (06:45)
1. Open Terminal in your project directory:
   ```bash
   cd Desktop/my-cartoons
   opencode
   ```
2. Select the free model (06:47): Type `/models` and select **`GLM 5.3 Flash Free`**.
3. Set Reasoning Level (06:51): Press `Ctrl + T` until the status bar displays **`REASONING: HIGH`**.

#### **Step 6: Execute a One-Prompt Cartoon Generation** (08:01, 09:05)
Type the trigger command followed by your "What-If" concept:
```text
/what-if what if you could see one minute ahead?
```
Press **Enter** and leave the AI to process autonomously (takes ~28 minutes) (09:15, 09:30).

---

### 4. Automated Execution Sequence (What happens under the hood)

1. **Script Writing:** AI writes a fast-paced voiceover script based on the "What If" structure (07:31, 09:20).
2. **Voice Generation:** Triggers Python scripts to send text to ElevenLabs API for narration audio (07:32, 09:21).
3. **Shot List & Storyboard:** Generates individual SVG frame stills for all planned shots (07:33, 09:22).
4. **Self-Inspection / Self-Correction:** AI reviews its generated storyboard frames, identifies visually broken shots (e.g., character's face covered by an object, arm out of frame), and re-renders those specific stills (03:00, 07:34).
5. **Code Animation:** Converts frames into React/Remotion TypeScript code (`.tsx`) for programmatic keyframe animation (07:35, 09:25).
6. **Sound Mixing:** Uses FFmpeg to synthesize background audio/SFX and normalize LUFS loudness levels to -14 LUFS (YouTube standard) (04:18, 07:36, 09:27).
7. **Final Render:** Outputs an `.mp4` file in `src/episodes/[episode-name]/out/` (09:34).

---

### 5. Character Consistency & Custom Character Creation

#### **Character Consistency Mechanism (No Image Drift)**
* Characters are **NOT raster/AI-generated images** (11:14). 
* They are procedurally drawn via code (`rig.tsx`) using a unified vector stick-figure skeleton rig (11:11).
* Different characters are defined purely by JSON/code style properties (jacket color, hair type, accessory layer). Because character graphics are pure SVG code, rendering is 100% consistent across every shot with zero visual drift.

#### **Creating a Custom Character** (11:23)
To add a brand new character to your universe, prompt OpenCode in plain English:
> *"add a new hero to the cast: a girl with a high ponytail, a yellow raincoat and red boots"* (11:28)

* The AI updates `rig.tsx` and generates a cast sheet preview within ~6 minutes (11:31).
* To swap the main character in an existing episode, tell OpenCode: `"make her my hero for the minute ahead episode instead of Pip"` (11:51).

---

### 6. Pacing & Failure Fixes

* **Shot Pacing Benchmark:** Viral "What If" short videos cut at a rapid rate of **~27 cuts/minute** (12:59). (Note: Free models default to around 16 cuts/min if left unguided).
* **Fixing Visual Errors manually:** If a shot looks wrong after rendering, tell OpenCode in plain English:
  > *"the ball in shot 1 is covering his face"* (10:54)
  The AI will re-code, re-draw, and re-render only that specific shot (10:59).
* **Memory & Session Management:** Always start a **fresh session** (`/new`) for each new video episode (10:08). A single episode run consumes ~70% of the free model's context window (10:14).
* **Fact Verification:** "What If" videos rely on one central scientific or psychological fact (e.g., *Nijhawan Nature 1994 paper on neural latency prediction*). Always double-check the citation source generated by the AI before publishing (10:37).

---

### 7. Performance & Cost Summary

| Metric | Free Setup (GLM 5.3 Flash + OpenCode) | Paid Setup (Claude Opus) |
| :--- | :--- | :--- |
| **Model Cost** | **$0.00** (04:28) | Consumes ~8% of 5-hour quota ($20–$100/mo) |
| **Render Time** | ~28 Minutes (02:42) | ~42 Minutes (02:40) |
| **Voice / SFX Cost** | Free Tier (ElevenLabs) | Free Tier (ElevenLabs) |
| **Output Quality** | Near-identical SVG rendering quality (02:30) | Benchmark standard |