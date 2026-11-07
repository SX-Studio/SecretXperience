# Jad M.H, How to Make Viral Motion Graphics With AI With $0 (Turned it into a Skill)

https://www.youtube.com/watch?v=zke3bTtvmLo

## Segment 00:00 to 08:00

Here is the detailed visual breakdown of the video clip:

---

### 1. Tools, Apps, Websites, Repos, Models, Prices & Settings Shown

* **00:00 – 00:09:** **Claude (Anthropic)** video reel showcasing role steps: *The Writer (1/7)*, *Art Director (2/7)*. Color palette swatches displayed (`#070816`, `#D70B16`, `#E07A55`, `#FFB547`, `#FFB5CA`, `#C8F05A`, `#9B70FF`, `#10B981`) and fonts (*Fraunces 144*, *IBM Plex Mono*).
* **00:10 – 00:16:** Crossed-out third-party tools: *After Effects*, *Suno*, *stock music sites*. Total cost shown: **$0** (on top of Claude subscription).
* **00:18 – 00:44:** Previous test video thumbnails (*Video 1: I make things*, *Video 2: SIXTY FRAMES OUT*, *Video 3: The Composer*).
* **00:41:** Skool community promo (*"Free in my Skool community – link in description"*).
* **00:48 – 00:53:** GitHub repository: **`ACE-Step 1.5`** (`ace-step/ACE-Step-1.5`) – described as *free, open source, runs locally on laptop ($0 cost)*.
* **00:54 – 01:07:** Requirement checkmarks: *No API keys*, *No credits*, *Nothing on top of Claude*, *Not sponsored*, *$0 earned*.
* **01:16 – 01:21:** Local developer setup: **VS Code** (`src/motion-reel/index.html`), **Headless Chrome** preview window, and terminal running **FFmpeg**.
* **01:37 – 01:45:** X (Twitter) launch announcement: *"Introducing Claude Opus 5.5 @claudeai – Sep 22 – 28M views"* and community posts by `@daniandrew`, `@eIevating`, `@alchen`, and `@donaldjewkes`.
* **01:46 – 02:12:** X post by **Stephan Livera** (`@stephanlivera`, Sep 25, 2026 – 2.2M views).
* **02:14 – 02:38:** X post by **Tony Dinh** (`@tdinh_me`, Sep 26, 2026 – 985 likes) featuring an ad video for **TypingMind** (`typingmind.com`).
  * *Models listed in TypingMind UI:* ChatGPT, Claude, Gemini, GPT-5.6 Sol, Claude Opus 5, Gemini 3.1 Pro, Claude Fabio 5.1, Claude Sonnet 4.6, Gemini 3.7 Flash, Grok 4.6, Meta Llama 4 Maverick, MoonshotAI Kimi k3.
* **02:40 – 05:10:** X post by **Donald** (`@donaldjewkes`, Sep 23, 2026 – 10.8K likes, 3.9M views) featuring the full anime music video *"UPPING MY P(DOOM) OFFICIAL M/V"*.
* **05:20 – 05:29:** Website dashboard: *"Discover startup launch videos from X"* and tweet by **Rexan Wong** (`@rexan_wong`, Sep 26 – 618K views).
* **05:35 – 05:45:** Tweet by Anthropic engineer **Thariq** (`@trq212`, Sep 23, 2026 – 2.2K likes).
* **05:53 – 06:05:** Article on X by **Movez** (`@alovzz`, Sep 27 – 1.7M views): *"How to build motion design studio with Opus 5.5 (Full course)"*.
* **06:39 – 06:44:** Official website: **FFmpeg** (`ffmpeg.org`).
* **06:58 – 07:03:** GitHub repository: **`HyperFrames`** (`github.com/heygen-com/hyperframes` – 56.5K stars).
* **07:16 – 07:25:** **Claude Code CLI** terminal window running Opus 5.5.

---

### 2. Code & Prompts Shown

* **[01:49] Stephan Livera's Prompt:**
  > `"make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out."`

* **[02:24] TypingMind Prompt Field:**
  > `Write a launch tagline for TypingMind`

* **[05:43] Thariq's Explanation of "One-Shot" Prompts:**
  > `the prompt: 10k characters with good takes plus skills, examples and API keys`

* **[05:46] Donald Jewkes' Expanded Prompt Length:**
  Shown as a full structured text document containing **9,608 characters**.

* **[06:23] `src/motion-reel/index.html` (JavaScript / GSAP snippet):**
  ```javascript
  var DUR = 16;
  var TITLE = "Motion";
  var MAKER = "Claude";
  var WORK = "Motion";
  // GSAP Timeline setup for frame rendering...
  ```

* **[06:42] Terminal Command (FFmpeg stitching):**
  ```bash
  ffmpeg -framerate 60 -i frames/frame%04d.png -c:v libx264 url-motion-reel.mp4
  ```

* **[07:17] Video 1 Full Terminal Prompt (1,397 characters):**
  > `Make a dynamic 16-second motion graphics showreel that shows what an incredible motion designer you are, like it's your showreel for a resume. NO music... soft pastel daylight (lilac, peach, mint, butter blurs drifting over paper, light film grain). Instrument Serif display type with IBM Plex Mono for small labels, and one electric-violet accent...`

---

### 3. Step-by-Step UI Actions

* **[07:31]** In Video 1 render preview, a simulated dark-blue UI cursor moves smoothly to hover over and click a rounded pill button labeled `▶ play the reel`, triggering the transition into kinetic typography.

---

### 4. Visual Style & Motion Graphics Breakdown

* **Stephan Livera Showreel [01:58 – 02:12]:**
  * **Style:** High-tech HUD / terminal design reel with dark, black background and high-contrast neon red accents (`#FF2A2A`).
  * **Elements:** Technical gridlines, frame counters (`60 FPS`, `120 BPM`), easing curves, vector morphing polygons, 3D particle sphere, kinetic typography with bold sans-serif type (*"CLAUDE motion designer"*).
  * **Pacing:** Rapid 60 FPS cuts synchronized to upbeat electronic music beats.

* **TypingMind Product Commercial [02:24 – 02:38]:**
  * **Style:** Sleek, modern tech SaaS aesthetic set against a dark blue cosmic starry background.
  * **Elements:** 3D floating glass cards tilting, floating AI model icon badges (OpenAI, Anthropic, Gemini), animated glow effects, smooth camera depth-of-field tilts, sharp typography.

* **"UPPING MY P(DOOM)" Anime M/V [02:50 – 05:10]:**
  * **Style:** Japanese anime / Pop-art music video with vintage paper texture, halftone overlays, VHS camera HUD timestamp (`LIVE 2026.09.08`), and vibrant pastel pink, yellow, and blue colors.
  * **Elements:** Hand-drawn character illustrations, stick figures, dancing flower-head characters, animated line charts (*P(DOOM)* graph), paperclips filling a planet, giant cat (*GATO*), and Japanese text captions (*"おめでとう"*, *"ありがとう"*).
  * **Pacing:** Energetic, rhythmic cuts changing scenes on every musical beat.

* **Video 1: Simple Prompt Showreel [07:29 – 07:44]:**
  * **Style:** Minimalist studio aesthetic with soft blurred pastel gradients (lilac, peach, mint, yellow) and clean light paper textures.
  * **Elements:** Elegant serif typography (*Instrument Serif*), UI micro-interactions, spring-slot kinetic lettering, 3D rounded bar chart animations, rotating particle dot mesh sphere, and technical metadata labels in the corners.

---

### 5. Numbers, Metrics & Dashboard Analytics

* **Stephan Livera Tweet:** 2.2M views, 17K likes (Sep 25, 2026).
* **Tony Dinh Tweet:** 985 likes (Sep 26, 2026). Mentioned cost: *$1,000+ saved*, build time *<30 minutes* (presenter's took *7 minutes*).
* **Donald Jewkes Tweet:** 3.9M views, 10.8K likes (Sep 23, 2026). Execution time: *5 mins voice prompt, 12 hours processing*.
* **Rexan Wong Tweet:** 618K views (Sep 26).
* **Movez Tweet:** 1.7M views, 1.5K likes (Sep 27).
* **HyperFrames Repo:** 56.5K stars.
* **Video 1 Frame Calculation:** 16 seconds × 60 fps = **960 individual screenshot frames** glued together.
* **Prompt Length Comparison (in characters):**
  * Video 1: **1,397** characters
  * Video 2: **8,137** characters
  * Video 3: **9,664** characters

---

### 6. Additional Visual Details & Context

* The presenter clarifies a common misconception: **Claude cannot directly generate MP4 video files.** Instead, Claude outputs code (HTML/JS/GSAP/Canvas) that renders animations in a headless Chrome browser. FFmpeg then captures screenshots frame-by-frame (960 frames for 16s at 60fps) and compiles them into an MP4 video.
* The "one-shot" viral videos on social media were actually powered by massive (~10,000-character) prompts containing full design frameworks, API specifications, and detailed rendering harnesses.


## Segment 08:00 to 15:47

Absolutely. Here's a detailed report on the visual information from the video clip, from 08:00 to 15:47.

### 1. Tools, Apps, Websites, Repos, Models, and Pricing

*   **[08:00]** Instagram handles: `@stephanlivera`, `mine, video 1`.
*   **[08:12]** `Video 2: Sixty Frames Out`, an original song, as a lyric video.
*   **[08:28]** **Suno - music**: pricing page showing `Free`, `Pro` ($8/mo), and `Premier` ($24/mo) plans.
*   **[08:29]** **ElevenLabs - voice**: pricing page showing `Free`, `Starter` ($5/mo), `Creator` ($22/mo), `Pro` ($99/mo), and `Scale` ($330/mo) plans.
*   **[08:31]** **Stock site for sound effects**: pricing page showing `Monthly` ($14.99/mo) and `Yearly` ($9.99/mo) plans.
*   **[08:42]** **ACE-Step 1.5** GitHub repository by `ACE-Step`. URL: `github.com/ACE-Step/ACE-Step-1.5`.
*   **[08:50]** **MacBook Air (M1, 2020)** specifications: Chip: `Apple M1`, Memory: `16 GB`, Storage: `450 GB`.
*   **[08:56]** **Claude Code** terminal interface. Model: `Opus 5.5`.
*   **[09:18]** **ACE-Step 1.5** running locally on the MacBook Air M1, showing 12 takes (takes 1-12).
*   **[10:18]** Python script `make_sfx.py` in the `tools/ACE-Step-1.5/checkpoints` directory.
*   **[10:41]** Twitter/X post from `Rexan Wong (@rexan_wong)` on Sep 28.
*   **[10:50]** Cost comparison: `$0` (music, voice, sound effects) vs. `Claude subscription`.
*   **[11:01]** **Video 3: One Conversation**, a story in 68 seconds.
*   **[13:11]** Twitter/X post from `Mable Joseph (@mablejoseph)` on Sep 25, 2026.
*   **[13:17]** Mable Joseph's project numbers: `62.7M tokens (96% cache reads)`, `163 model calls`, `~$34 at API list price`, `~6¾ hrs start to finish`, `~1½ hrs of it hands-on`, `12-minute render on a laptop`.
*   **[14:34]** **Kokoro-82M** model on Hugging Face.
*   **[14:49]** Terminal window showing disk space usage of `ACE-Step-1.5/checkpoints` (33 GB) and total system storage (99% capacity, 4.7 GB available).
*   **[15:13]** Twitter/X post from `Tony Dinh (@tdinh_me)` on Sep 26, 2026.
*   **[15:36]** Carousel slides in progress: `slide 1: STATIC.`, `slide 2: LINEAR.`, `slide 3: WEIGHT.`.
*   **[15:40]** YouTube comment interface.

### 2. Prompts and Code Reproductions

*   **[08:56] Claude Prompt (Video 2):**
    > - You are the director, songwriter, animator, sound designer and render engineer for a lyric music video made entirely in code. This is USE CASE 2 of a 3-part Motion Series where Claude Opus 5.5 vs motion graphics. Work autonomously: do not ask me questions, make every decision yourself, say what you chose in one line, and keep going until a finished, verified MP4 exists.
    >
    > THE FILM IN ONE LINE
    > A 30-45 second, high-energy kinetic lyric video for an original song, where every word, cut and hit is locked to the sound. No social: it should feel like the best motion designer on the internet went completely crazy, while staying clean, readable and intentional.
    >
    > THE SONG
    > Write an original, catchy song about making motion graphics with AI ("one sentence in, sixty frames a second out"). Short punchy lines, a chantable hook repeated at least 3 times, one big chorus/drop. Hyperpop / electro-pop / drum-and-bass energy, 130-150 BPM, bright confident vocal, fun and clean lyrics. Structure it with [intro] [verse] [chorus] [bridge] [outro] tags.
    >
    > MUSIC - 100% FREE AND LOCAL (ACE-Step 1.5 is already installed on this Mac)
    > - Model folder: /Users/jadmeddah/Desktop/motiongraphics/tools/ACE-Step-1.5 (Turbo 01T + 0.4B L6 already downloaded, plus a local patch so it runs in bfloat16 on this Mac). Do NOT download other models (the disk has only ~10 GB free) and do not edit its code.
    > - Copy these working scripts into your project's audio/ folder, read them, and adapt...

*   **[10:18] Python Sound Effects Code (`make_sfx.py`):**
    ```python
    def whoosh(dur, f0=100, f1=5000, rise=2.2):
        f = f0 * (f1 / f0) ** (uv**1.5)
        x = svf_band(rng.standard_normal(N), f, q=1.6)

    def impact(size=1.0, dur=1.1):
        sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (3.2 / size))

    def riser(dur, top=2400):
        f = 180 * (top / 180) ** (u**1.3)

    def sparkle(dur=0.5, count=7):
        f = rng.uniform(3200, 9500)
    ```

*   **[10:30] Claude Prompt Exclusion (Video 2):**
    > IT MUST LOOK DIFFERENT FROM THE OTHER VIDEOS
    > - bright-motion-demo already used: a cream / vermilion / cobalt / yellow print palette, Archivo Black + JetBrains Mono, ...
    > - Use case 1 is soft pastel, Instrument Serif italic, one shape morphing continuously, no music.
    > - DO NOT reuse any of those looks or techniques.

*   **[11:09] Claude Prompt (Video 3):**
    > - You are the director, writer, animator, composer, sound designer and render engineer for a short story film made entirely in code. This is USE CASE 3, the finale of a 3-part motion series showing what Claude Opus 5.5 can do with motion graphics. It must be the most impressive of the three: real storytelling, a great score, full sound design, and fluid animation from start to finish. Work autonomously: do not ask me questions, make every decision yourself, say what you chose in one line, and keep going until a finished, verified MP4 exists.
    >
    > THE FILM IN ONE LINE
    > "One Conversation": at 2:07 AM a solo creator with a big idea and no team types one sentence, and an entire film studio wakes up inside the conversation. Everything can be done with Claude. 60-75 seconds.
    >
    > STORY (beat sheet - keep the arc, improve the details)
    > 1. Hook (0-5 s): darkness, a single blinking cursor, "2:07 AM". On screen: "I have an idea. I don't have a team."

*   **[12:49] Claude Prompt Critique Loop:**
    > - Critique loop: render a contact sheet at every shot's midpoint, score every shot 1-10 for story clarity, composition, motion fluidity, typography, sync with music and sound, and polish. Write down the 3 worst problems, fix them, and repeat until every score is 8+ (max 4 rounds).

### 3. Step-by-Step UI Actions

*   **[08:56]** The presenter uses the `Claude Code` terminal interface to initiate the video generation process with a lengthy prompt.
*   **[09:13]** Claude automatically starts generating the lyrics, hook, and music using the local ACE-Step 1.5 model.
*   **[09:18]** The screen shows ACE-Step 1.5 generating 12 takes of the song on the MacBook.
*   **[11:09]** A second extensive prompt is entered into the `Claude Code` terminal for the final video, "One Conversation."
*   **[11:29]** Claude begins the autonomous creation of Video 3, moving through stages like writing the script, building the look, animating, composing the score, and designing sound.
*   **[15:40]** The presenter scrolls to the YouTube comments section to post a comment.

### 4. Video, Motion Graphics, and Thumbnail Descriptions

*   **[08:12] Video 2 Style:** A high-energy "Hyperpop" lyric video. It features bold, metallic 3D typography (e.g., "WATCH THE LETTERS COME ALIVE") with reflective textures, liquid-like background effects in neon greens and purples, and fast-paced transitions synced to the beat. Layouts vary between centered text and dynamic, moving perspectives.
*   **[11:30] Video 3 Style ("One Conversation"):** A narrative short film with a "UI-inspired" aesthetic. It begins with a dark screen and a blinking cursor. As the "studio wakes up," the style shifts through various "roles":
    *   **The Writer:** Text on a document background.
    *   **The Art Director:** A color palette with hex codes and font selections.
    *   **The Animator:** A keyframe graph with easing curves.
    *   **The Composer:** A DAW-like interface showing a piano roll and waveforms.
    *   **The Sound Designer:** A grid of sound effect samples (whoosh, impact, etc.).
    *   **The Editor:** A multi-track timeline showing 12 shots over 68.5 seconds.
    *   **The Render:** A grid of frames showing the rendering progress percentage.
*   **[13:21] Mable Joseph's Video Style:** A hand-painted, watercolor-style animation. It features a character at a computer, a floating lantern character, and soft, textured backgrounds. The animation has a charming, hand-drawn feel with gentle movements and transitions.

### 5. Numbers on Dashboards and Analytics

*   **[13:17] Mable Joseph's Stats:**
    *   `62.7M tokens` (96% cache reads)
    *   `163 model calls`
    *   `~$34 API cost`
    *   `6¾ hours total time`
    *   `12-minute render time`
*   **[11:40] Video 3 "Invoice" numbers:**
    *   `Composer - $2,500`
    *   `Motion designer - $4,800`
    *   `Editor - $3,000`
    *   `Sound mix - $1,200`
    *   `TOTAL $11,500`

### 6. Contradictions or Additions to Spoken Content

*   **[10:06]** A visual note "SUNG HEAVILY PROCESSED" appears during Video 2, which isn't explicitly mentioned by the presenter.
*   **[14:49]** The terminal shows that the music model takes up `33 GB`, and the system is at `99%` storage capacity with only `4.7 GB` left, emphasizing the presenter's warning about disk space.
*   **[15:13]** The Twitter/X post from Tony Dinh adds the specific historical cost context of `$1,000+` for a video like this a year ago.
