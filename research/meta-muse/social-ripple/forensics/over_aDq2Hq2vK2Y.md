Here is the exhaustive, timestamped breakdown of the video:

---

### 1. Exact Total Duration
* **11:04** (11 minutes and 4 seconds)

---

### 2. Chapter Outline with Timestamps
* **00:00** – Intro: Four faceless videos made with Claude (3D explainer, true crime story, stick figure video, documentary).
* **01:24** – Step 1: You don't invent the format (studying successful formats without copying story/shots).
* **02:29** – Step 2: The style sheet (one image defining the rules of the world: fonts, colors, characters, layout, system notes).
* **03:50** – Step 3: Claude (using Claude Code with Opus 5.5 to build videos from scratch using code/three.js).
* **06:45** – Cost & Time Breakdown (how long each video took and what it cost).
* **07:29** – Setup: Installation guide (Google Drive skill pack, Claude Code setup).
* **08:21** – Money: How to actually make money with this (YouTube Partner Program, TikTok Creator Rewards, selling to business clients).

---

### 3. End-Product Format & Example Channels

#### Style 1: 3D Explainer (Zack D Films style)
* **Art style:** 3D rendered, vivid colors, dramatic lighting, clean physics simulations.
* **Characters:** Objects/nuclear missiles/volcanoes/scales.
* **Aspect ratio:** 9:16 vertical (Shorts/TikTok).
* **Length:** Short (approx. 30 seconds).
* **Narration voice:** AI voice (e.g., ElevenLabs / `am_michael`, speed 1.1).
* **Captions:** Lower-third white text with keyword highlights.
* **Music & Pacing:** Dramatic beats aligned with key moments; fast cuts.
* **Example channels & view counts:**
  * **Zack D Films** (TikTok): *“Dropping A Nuke In A Volcano?”* – **33.5M views**.

#### Style 2: True Crime Story (Enthyme style)
* **Art style:** Noir, dark surveillance/store camera footage with glowing red silhouette figures.
* **Characters:** Glowing red 3D clay/wireframe people.
* **Aspect ratio:** 9:16 vertical.
* **Length:** 65–84 seconds.
* **Narration voice:** Gritty, voice crackling through radio/tape.
* **Captions:** Red glowing/yellow captions, center-lower-third.
* **Music & Pacing:** Tense ambient music, dark/cinematic.
* **Example channels & view counts:**
  * **enthyme** (TikTok): *Based on the Blockbuster Case 1994 (Red Ghost)* – **880K views**.

#### Style 3: Stick Figure Animation (Ifverse style)
* **Art style:** 2D/3D flat stick figures in rooms (apartments, hallways, bathrooms).
* **Characters:** Black stick people (hero wears a rust-orange hoodie, blank expressive eyes).
* **Aspect ratio:** 16:9 horizontal and 9:16 vertical.
* **Length:** 73 seconds (39 shots).
* **Narration voice:** Informative tutorial/storytelling voice.
* **Captions:** Top-left headers and white centered captions.
* **Music & Pacing:** Steady, rhythmic, blink every 3.5–4s, feet planted on floor.
* **Example channels & view counts:**
  * **Ifverse** (YouTube): *“What If You Had 500 IQ?”* – **1.4M views**.

#### Style 4: Clay Atlas Documentary (Fern style)
* **Art style:** Faceless matte clay figures, warm amber backlight, red glow on targeted locations, cinematic 3D renders.
* **Characters:** Faceless clay people in beige coats/high-vis vests.
* **Aspect ratio:** 16:9 cinematic / 9:16.
* **Length:** ~1 minute.
* **Narration voice:** Investigative, calm documentary narrator.
* **Captions:** Date stamp in lower-left safe area, label box centered over subject.
* **Music & Pacing:** Drone push-ins/dollies, 3–5 second shots, measured and calm.
* **Example channels & view counts:**
  * **Fern** (YouTube): Louvre heist documentary and historical maps.

---

### 4. Step-by-Step Pipeline & Tools Used

1. **Format Selection & Study (Step 1)**
   * **Tools:** TikTok / YouTube.
   * **Action:** Find a successful faceless video format, analyze its pacing, layout, and narrator delivery without copying exact story/shots.
2. **Style Sheet Generation (Step 2)**
   * **Tools:** Higgsfield API / Image generator.
   * **Action:** Generate 1 image containing all rules of the world (fonts, hex codes, color palette, character designs, frame anatomy, system notes).
3. **Code & Video Generation (Step 3)**
   * **Tools:** Claude Code (running Opus 5.5).
   * **Action:** Pass the style sheet and reference video link to Claude. Claude studies the transcript/frames, writes a brand new script, generates 3D scenes in code (three.js, ray-marched SDF figures), mixes audio/music locally, and renders the video automatically.

---

### 5. Prompts, Skills, Templates & Code (Verbatim Transcriptions)

#### **Style Sheet Rules (Clay Atlas Example - 02:36)**
* **Typography:** `CLAY_WHITE (#E6FDF3)`, `AMBER BACKLIGHT (#C8662A)`, `UMBER SHADOW (#2A1A10)`, `PARCHMENT (#D6C39A)`, `MAP ORANGE (#E08A3C)`, `TARGET RED (#D2382C)`, `HIGHLIGHT YELLOW (#F2E15B)`, `SLATE (#8E9A94)`.
* **System Notes:** 
  * *Every person is a faceless matte clay figure — no skin, no face, no real likeness.*
  * *3D worlds are soft cinematic renders; amber key or golden-hour sun, haze, shallow focus.*
  * *Maps are aged parchment; the subject area is orange with a red border.*
  * *Dates sit lower-left; bold date, small time | place.*
  * *Camera is slow: drone push-ins and dollies, 3-5 s shots.*
  * *Graphics build on the narrator's words.*
  * *Mood: measured, investigative, cinematic, calm.*

#### **Install Prompt for Claude Code (07:45)**
```text
INSTALL PROMPT [@paste into Claude Code]:
ctrl+g to edit in Vim

video with AI. Ask for anything that needs my password or a big download (the optional ACE-Step music is ~15 GB). Don't change anything outside ~/.claude/skills/faceless-videos, ~/.claude/skill-backups, ~/.faceless-videos and the free tools above. At the end, tell me how to start next time (just ask for a faceless video in any new Claude Code session) and remind me to start a new Claude Code session so the skill loads by itself.
```

#### **Claude Code Execution Terminal Output (02:19)**
```bash
> okay here is what i am thinking let's make a video and compare zeck d film and ours like the guy on the video he did so here is a video of zack lets build same story as this video and open models for voice
> https://www.tiktok.com/@zackdfilms92/738939089569461550 same shots and everything please cook
> I'll start by downloading and watching the Zack D clip.
> Read 1 file, ran 2 shell commands
> I found Zack's 'Dropping A Nuke In A Volcano?' (30s, 33.5M views) and mapped its shots, but I'll avoid re-voicing his script or copying shots exactly since that risks a claim/strike--instead we'll build our own fact-checked 30s 9v version with the same question and Zack-style look but original script, shots, and bomb design. Now setting up the project.
> Ran 6 shell commands
```

---

### 6. Costs and Limits
* **Claude Code / Opus 5.5:** Subscription required (Max plan ($100/mo) or Pro plan ($17-$20/mo)).
* **Video Generation (Claude + Three.js):** Cost in code/rendering = **$0** (Local execution).
* **Higgsfield (Image Generation for Style Sheets):** Uses subscription credits (e.g., 28 credits used for Louvre style). Free alternative/promos linked in resource folder.
* **Music & Voice Generation:** Fully local models run on MacBook for **$0**.
* **Storage:** Requires ~1 GB local space (optional music model requires ~15 GB).

---

### 7. Income & View Claims and Proof
* **Screenshot Claim (00:26):** YouTube post from `@Ed_FacelessYT` showing **$33,900** total revenue across 4 faceless channels in March.
  * Channel 1: **$12,518.07** (March).
  * Channel 2: **$8,112.12** (March).
* **View Records:** 
  * Zack D Films: **33.5M views**.
  * Ifverse: **1.4M views**.
  * Enthyme: **880K views**.
* **Creator Statement (00:34):** *"Those are their numbers, not a promise, but it's why I made four more."*

---

### 8. Pitches, Sponsors & Links
* **Main Resource Community:** Free Skool community **"NextPhase AI"** (First link in YouTube description).
* **Google Drive Folder:** Contains `faceless-videos-skill.zip`, style sheets, and install prompts.
* **Community Features:** Weekly live calls on Skool to help with setup and troubleshooting.