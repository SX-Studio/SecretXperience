Here is the detailed extraction of all information, stats, workflows, and prompts from the video tutorial:

---

### 1. Channel Case Studies & Performance Claims

#### **Channel 1: Ifverse (`@IfverseTales`)**
* **Views:** 4.5 Million views (shown on tool overlay at 00:20).
* **First Video Upload:** 2 weeks prior to recording (00:24).
* **Subscriber Count:** ~54.7K subscribers (00:29).
* **Top Performing Video:** *"What If Your Reaction Time Was 10x Faster?"* with 4.5M views (00:22).

#### **Channel 2: Day One Films (`@dayonefilmsofficial`)**
* **Views:** 5 Million views (00:33).
* **First Video Upload:** 4 weeks prior to recording (00:35).
* **Subscriber Count:** 75K subscribers across 16 videos (00:41).

*Note/Flag:* The creator notes that these channels write and render their 2D animation videos using code (HTML/JS) via AI tools like Claude Code, without standard generative video AI models like Runway or Luma (00:08–00:17).

---

### 2. Breakdown of the "What If" Style & Animation Format

* **Visual Style:** Flat 2D vector graphic aesthetics featuring simple stickman-like characters with black round heads, colored hoodies, and distinct rim-lighting/glows (01:18, 04:30).
* **Rendering Method:** Programmatic animation constructed as HTML/CSS/JavaScript canvas scenes, rendered frame-by-frame directly to an MP4 video file (00:11, 01:38).
* **Cinematic Elements:** High-contrast backgrounds, letterboxing, selective motion blur, dramatic light glints, on-screen dynamic keyword captions, and synchronized cinematic sound effects (SFX) (04:30, 08:01).

---

### 3. Exact Rebuild Workflow & Setup

#### **Step 0: Prerequisites & Tool Setup (01:38)**
The system relies on six core software dependencies installed via Claude:
1. **Homebrew:** Package manager to install tools on macOS.
2. **FFmpeg:** Splits reference videos frame-by-frame and stitches final rendered PNG sequences into MP4.
3. **Node.js:** Executes JavaScript animation rendering scripts.
4. **Google Chrome:** Headless web browser used to render canvas scenes frame-by-frame.
5. **Puppeteer:** Programmatically controls Chrome to trigger frame capture.
6. **ElevenLabs:** Generates high-quality AI voiceover narration.
7. **UV + Faster-Whisper:** Performs local speech-to-text to automatically sync voice timing with video captions/scenes.

#### **Claude Desktop Setup:**
* App Mode: **Claude Code** (via the `</>` Code tab) (01:28).
* Directory: Dedicated local workspace folder (01:31).

#### **Step 1: Model Selection & Settings (02:49)**
* **Model Selected:** `Opus 5.5` (Recommended for balance of reasoning capability and token cost) (02:51).
* **Effort Level:** `Extra` (03:04).

---

### 4. Prompts Used (Verbatim On-Screen Text)

#### **Prompt 1: Animation Prompt (03:27)**
> *"Create a 2D animation in the exact same editing style as the referenced videos. The video is about "What if you were the best hacker alive?". Make it around 2 minutes long and turn the idea into an engaging "what if" scenario. I want you to add cinematic SFX design as well. Make it really, really high quality and act as if you were a professional SFX designer. Build it as HTML/JS scenes and render it to an MP4. Make it a 16:9 ratio and also 60 FPS."*
* **Attachments:** 2 local MOV screen recordings of sample videos + 2 YouTube URLs (03:23, 04:09).

#### **Prompt 2: ElevenLabs Voiceover Script Generation (05:40)**
> *"I want to add a voiceover, but with ElevenLabs. First, read the ElevenLabs text-to-speech best practices, and then I want you to write the voiceover for the entire video as scripts that I can paste one-to-one into ElevenLabs."*

#### **Prompt 3: Script Consolidation Prompt (06:20)**
> *"I don't want that many different snippets that I need to paste into ElevenLabs. Just make it one or two. I'm using the V4 ElevenLabs Model."*

#### **Prompt 4: Syncing Voiceover Back to Animation (07:30)**
> *"it is inside the folder"* *(Signaling Claude to detect the generated `.wav` file in `/voiceover/` to auto-retime canvas frames, update captions, and re-render the MP4).*

---

### 5. ElevenLabs Voice Setup & Settings (07:08)

* **Model:** Eleven `v4` (06:40).
* **Voice Selected:** `Flint - Deep, Raspy, and Warm` (07:00).
* **Stability:** `60% - 70%` (07:11).
* **Clarity / Similarity:** `50%` (07:15).

---

### 6. Build Statistics & Execution Details

* **Total Generation/Build Time:** 1 hour 17 minutes (04:57).
* **Rendering Time:** ~17 minutes of the total build time (04:57).
* **Output Specifications:** 1920x1080 resolution, 60 FPS, 2:02 duration, stereo audio normalized to -14.8 LUFS (05:31).

---

### 7. Rebuild Summary Flow (Recap from 10:07)

```
[SETUP PROMPT]       --> Claude installs FFmpeg, Node, Puppeteer, Whisper.
[ANIMATION PROMPT]   --> Claude reads references, builds HTML/JS scenes & SFX, renders initial MP4.
[VOICEOVER PROMPT]   --> Claude writes ElevenLabs-formatted text script.
[ELEVENLABS]         --> User generates VO .wav file and drops it into workspace.
[SYNC PROMPT]        --> Claude retimes HTML canvas animations to audio and renders final MP4.
```