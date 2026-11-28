Here is the detailed breakdown of the YouTube tutorial video on creating AI-generated animated videos:

### 1. Exact Total Duration
* **0:00 – 12:51** (12 minutes, 51 seconds)

---

### 2. Chapter Outline with Timestamps
* **0:00 – 0:43** — Introduction: Faceless YouTube channels (`Ifverse` & `Last Soul`) using a new animation style.
* **0:43 – 1:52** — Overview of the AI automation workflow and showing a sample video (*“What If Your Heartbeat Was 10x Slower?”*).
* **1:52 – 5:26** — Step 1: Topic and Script Generation using Claude Code and a Master Prompt.
* **5:26 – 6:59** — Step 2: Voiceover Generation using ElevenLabs (Text-to-Speech).
* **6:59 – 12:51** — Step 3: Animation, Assembly, and Rendering using Claude Code (`make-2d-video` plugin) and final review.

---

### 3. End-Product Format
* **Art Style:** Minimalist 2D stick-figure animation with atmospheric lighting/background themes (e.g., Midnight, Dusk, Golden, Neon, Storybook).
* **Characters:** Simple stick figures with circular heads and facial expressions (e.g., Theo, Mara, Dr. Okefor, Coach Ruiz).
* **Aspect Ratio:** 16:9 widescreen (recommended for long-form YouTube) / 9:16 (shorts/reels).
* **Length:** Long-form (approx. 3–4 minutes per video).
* **Narration Voice:** Clear, narrative, smooth and relaxed (e.g., ElevenLabs voice: "Adam").
* **Captions:** On-screen text, charts, graphs, data visualization, countdown timers, and fact cards.
* **Music & SFX:** Generated background music and ambient sound effects synchronized with the story.
* **Real Channels & View Counts Shown as Examples:**
  * **Ifverse:** 50.7K subscribers, 16 videos, 7,711,931 total views.
    * *“What If Your Reaction Time Was 10x Faster?”* — 4.3M views (2 weeks ago).
    * *“What If You Had 500 IQ?”* — 1.2M views (9 days ago).
  * **Last Soul:** 8.22K subscribers, 6 videos.
    * *“1 MINUTE | An Animated Short Film”* — 544K views (12 days ago).

---

### 4. Exact Pipeline Step-by-Step (Tools, Models, Apps, Repos, Skills, Websites)

| Timestamp | Tool / Website / Model / Skill | Action / What it does |
| :--- | :--- | :--- |
| **0:47** | Claude Code | Used to automate script generation, voiceover integration, and animation. |
| **2:02** | Google Docs / Claude (claude.ai) | Pasting the Master Prompt ("Topics and Script Generator") to generate video ideas and scripts. |
| **5:37** | ElevenLabs (elevenlabs.io) | Text-to-Speech tool used to convert the script into a voiceover audio file. |
| **6:48** | Computer File System | Creating a project folder named `Slow heart beat` and placing the downloaded ElevenLabs voiceover `.mp3` inside. |
| **7:00** | Claude Code | Opening the project folder (`Slow heart beat`) to let Claude work directly with project files. |
| **7:25** | Claude Code (Skill: `/make-2d-video`) | Activating the 2D video generation plugin/skill. |
| **7:37** | Opus 5.5 (Model) | Selecting the AI model version in Claude Code. |
| **7:41** | Reasoning Effort: High / Extra High | Setting the reasoning effort for the model. |
| **7:52** | Aspect Ratio Selector | Choosing `16:9` (Recommended for long-form). |
| **8:10** | Resolution Selector | Choosing `1080p` (Recommended). |
| **8:29** | Audio Options | Choosing `Generated music + sfx` (Recommended). |
| **8:55** | Visual Themes | Choosing the visual theme (`Dusk` selected instead of recommended `Midnight`). |
| **9:15** | Claude Code Render Engine | Rendering a short preview of the animation to check style and synchronization. |
| **9:35** | Preview Player | Playing and reviewing the rendered preview. |
| **10:12** | Claude Code Full Render | Commencing the full rendering of the video (combines script, voiceover, animation, music, and SFX directly into the project folder). |

---

### 5. Prompts, Skill Files, Templates, or Code Shown (Verbatim Transcripts)

#### **Master Prompt (Topics and Script Generator)**
> **ROLE:**
> You are the Narrated Script Engine, the topic and script engine for faceless, narrated YouTube channels. Your job ends at a voiceover-ready script. Visuals, characters and rendering happen later, elsewhere.
> 
> The engine has one shared core (STATES 0-4 and the house rules) and a NICHE PACK for each channel type: What-If, History, Documentary, Geography, or Custom pack built from your reference scripts. The core says how the narrator sounds and how the story is shaped. When the core asks for pack dialogue on a number of the row, the pack writes.
> 
> You walk me through numbered STATES. One turn per state. Hit stop at the end of every state and wait for my reply. No recaps of what I just said. No recaps of what I just wrote. No recaps of what I will say next. When I say next, begin with STATE 0. When I send my next message, begin with STATE 1.

#### **Interactive Prompt Sequence (Claude Q&A)**
> Following to follow a structured prompt sequence:
> 1. Niche: What-If, History, Documentary, Geography, or Custom? [What-If]
> 2. Channel focus in one line, if narrower than the niche (for example “ancient Rome only” or “Africa-focused geography”). [None]
> 3. Episode type: standalone, or a series part? If a series part, paste the previous episode's script or its STORY LOCK card. [standalone]
> 4. Length: long-form, short, or a target in minutes? [long-form, using the pack's word range]
> 5. Do you already have a script? Paste it to skip STATE 1. [no]
> 6. Titles already published on our channel, so they're never repeated. [none]
> 7. Reference scripts or titles required for Custom (2-3 scripts or 10+ titles), optional for the others. Also optional: a model PDF or a demo-lock script. [none]
> 
> Answer or reply DEFAULTS.

#### **Claude Code Skill Command**
* `/make-2d-video` *(Description shown: "2d studio 3d studio. This tool should be used when the user wants to make 2-dimensional animated videos. The output video features stick figures with 3d lighting, simple 2d motion graphics, dynamic camera movements, visual text diagrams, scene changes, blueprint UI, character dialogue, 16:9 or 9:16 aspect ratio. When the user uses commands like 'make 2d video', 'animate this script', 'animate scene', etc., activate this skill.")*

---

### 6. Costs / Limits
* **Claude Code / Claude AI:** Requires an active subscription/API access (Opus 5.5 model).
* **ElevenLabs:** Free / Tiered plans depending on character usage.
* **Local Processing:** Video rendering times depend on computer hardware performance and chosen resolution (e.g., 1080p full render takes roughly 4 minutes for a 3-minute video).

---

### 7. Income or View Claims & Proof
* **Ifverse Channel:** 50,700+ subscribers and over 7,711,931 total views achieved with only 16 videos.
* **Viral Velocity Proof:** A video posted 2 weeks prior (*“What If Your Reaction Time Was 10x Faster?”*) reached **4.3 million views**. Another (*“What If You Had 500 IQ?”*) crossed **1 million views in 9 days**.
* **Workflow Efficiency:** Full 3-minute animated video produced and rendered directly to local storage without manual scene-by-scene animation or editing.

---

### 8. Pitches / Sponsors / Links
* None explicitly mentioned as paid sponsors; the video serves as a technical demonstration of automating the 2D video creation workflow using Claude Code and ElevenLabs.