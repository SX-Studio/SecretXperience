## Segment 00:00 to 08:00

### 1. Tools, Apps, Websites, Repos, Models, Settings & File Names

* **[00:15 - 00:26] Mock Claude UI / Agent Interface:**
  * Window Title: `Edit my video (video-editor)`
  * Mentions: Premiere integration (`Your edit is ready in Premiere.`).
* **[00:53 - 00:56] Logos / Compatible Software Shown:**
  * Coding Agents: Claude Code, OpenCode / Copilot / generic agent icons.
  * Models: Claude 3.5 Sonnet / Opus, OpenAI GPT-4o.
  * Editing Software: Adobe Premiere Pro, DaVinci Resolve Studio, Apple Final Cut Pro, CapCut.
* **[01:15 - 01:25] Platforms & Communities:**
  * Platform: Skool (`AI Leverage Lab` community by Jason Cooperson).
  * Extension / Tool: vidIQ extension on YouTube.
* **[01:51 - 02:01] macOS Finder - Folder Structure (`video-editor`):**
  * Root items: `AGENTS.md`, `assets/`, `docs/`, `lanes/`, `packaging/`, `presets/`, `projects/`, `workflows/`, `archive.sh`, `check-setup.sh`, `CLAUDE.md`, `finalize.sh`, `free-starter-prompt.md`, `LANES.md`, `skills-lock.json`, `transcript-corrections.json`.
  * `workflows/` contents: `asr_cli.py`, `bake-emoji.py`, `banner-clear.sh`, `behind-text.py`, `change-events.py`, `chin-line.py`, `cut-audit.py`, `dead-air-qa.py`, `deliver.py`, `face-frame.py`, `flash-scan.py`, `fold-look.py`, `framing-continuity.py`, `glide.swift`, `graphics-qa-short.py`, `graphics-qa.py`, `graphics.py`, `hand-track.py`, `hero-frame.py`, `lip-sync.py`, `music-onset.py`, `normalize-sections.sh`, `object-track.py`, `ocr-shim.py`.
* **[02:10 - 02:25, 02:45 - 02:55] Claude Desktop / Claude Code UI:**
  * Top navigation icons: Chat bubble, Search, Code bracket icon (`Code`).
  * Features shown in sidebar: `Dispatch (Beta)`, `Routines` (`Brand deal triage (8:30am)`, `Nightly self-review (3am)`, `Daily plan (9am)`), Projects (`I Finally Solved (EDIT)`, `Triage Instagram partnerships`, `Instagram ideas list`, `DaVinci MCP version in 21.1`).
  * Right panel stats: `Sessions: 557`, `Active days: 74`.
  * Context model switcher at bottom right: `Opus 5.5`, `Extra`.
  * Controls: `Local`, `Bypass permissions`, folder picker set to `video-editor`.
* **[02:26 - 02:44] YouTube & Web Resources:**
  * Video description links:
    * `skool.com/leveragelab/about`
    * Claude Artifact link: `https://claude.ai/artifact/BYH6Mcma5to3k12KogkEZB`
    * HyperFrames repo: `github.com/heygen/hyperframes`
  * Artifact title: `Claude Video Editor: The Full Blueprint` (Build 2026.14.05 • macOS + Windows).
  * Architecture steps visible in diagram: `Raw footage`, `Intake`, `Rough cut`, `Audio polish`, `Grade`, `Plan`, `Build`, `Converge`, `SFX`, `Music bed`, `Review`, `Export`, `Final`, `Clipper`.
* **[04:05 - 04:15] Skills Folder List (`.claude/skills/` and `.agents/skills/`):**
  * Subfolders/skills: `background-music`, `broll-gen`, `capcut`, `clipper`, `davinci-resolve`, `edit-review`, `edit-video`, `embedded-captions`, `faceless-explainer`, `final-cut-pro`, `general-video`, `graphics-build`, `graphics-plan`, `hyperframes`, `hyperframes-animation`, `hyperframes-audio`, `hyperframes-cli`, `hyperframes-core`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-registry`, `hyperframes-studio`, `media-use`, `motion-graphics`, `pr-to-video`, `premiere-pro`, `product-launch-video`, `remotion-to-hyperframes`, `rough-cut`, `slideshow`, `talking-head-recut`.
* **[04:53 - 05:12] Integrations & Repositories:**
  * Press release shown: Blackmagic Design announcement at IBC 2026 for DaVinci Resolve 21.1 featuring MCP / AI Assistant integration.
  * Final Cut Pro MCP repo: `elliottate/SpliceKit` ("Final Cut Pro, unlocked. A Command Palette, MCP server, and an open plugin framework...").
  * Premiere MCP repo: `hetpatel-11/Adobe_Premiere_Pro_MCP` ("Tools for AI-driven video editing via MCP for Codex, Claude, and other MCP clients").
* **[06:24 - 06:30] Premiere Pro workspace:**
  * Sequence: `Fully automated video editing test 2`.
  * Video tracks: `V1` to `V6` (colored clips, subtitles, graphic overlays).
  * Audio tracks: `A1` to `A4` (voice, SFX, background music).

---

### 2. Prompts and Code Shown

* **[00:16] Mock Prompt to Claude:**
  ```text
  edit this video
  raw-footage.mp4 (2.1GB)
  ```
* **[00:23] Mock Revision Prompt:**
  ```text
  tighten the intro
  bigger title card
  ```
* **[02:46] Prompt entered into Claude Code:**
  ```text
  https://claude.ai/artifact/BYH6Mcma5to3k12KogkEZB set this up for me
  ```
* **[06:14] Command line prompt example:**
  ```text
  Edit this video right here in chat and send me back the finished file
  ```
* **[07:44] Chat adjustment example:**
  ```text
  Change this graphic so it rises up and then slides out
  ```

---

### 3. Step-by-Step UI Actions

* **[01:51 - 02:02]** Opens macOS Finder, navigates through the root folder `video-editor`, expands the `workflows/` dropdown showing individual Python and shell scripts.
* **[02:04 - 02:09]** Right-clicks in Finder inside a `Video Projects` directory, selects `New Folder`, and renames it to `video-editor`.
* **[02:10 - 02:24]** Switches to the Claude desktop application. Clicks the Code icon (`</>`) on the top toolbar to switch from standard chat to Claude Code. Clicks the folder dropdown (`No folder` -> `Open folder...`), browses file manager, and selects `Video Projects/video-editor`.
* **[02:26 - 02:31]** In a web browser under the YouTube video, right-clicks the link to the blueprint artifact in the description, selects `Copy Link Address`, opens a new tab, and loads the Claude Artifact page.
* **[02:46 - 02:50]** Pastes the copied artifact URL into the Claude Code input prompt with the text `set this up for me` and hits Enter/Submit.
* **[03:42 - 04:16]** In Finder, toggles hidden files visibility (revealing `.agents` and `.claude`), expands `.claude/skills` to show all 20+ installed automation skill directories.
* **[04:17 - 04:20]** Shows an anti-pattern demonstration screen: dragging and dropping a raw `SKILL.md` file directly into a chat prompt window with a large red "X" and label "Don't Do This".
* **[06:37 - 07:05, 07:55 - 08:00]** Expands `presets/` -> `youtube/` -> `default/` in Finder to inspect files: `backgrounds/`, `highlight/`, `reference/`, `text-animation/`, `titles/`, `animations.md`, `creative-moves.md`, `default-overlay-style.md`, `README.md`, `sfx.json`, `sfx.md`, `vox-collage/`.

---

### 4. Visual Styles & Motion Graphics

* **[00:15 - 00:26] Floating Terminal/Agent Card:**
  * Dark charcoal rounded window (`#18181b`) with macOS window controls (red/yellow/green dots).
  * Monospace typography for command inputs and system status logs. Smooth vertical expand transition as steps execute.
* **[00:32 - 00:39] Vector Activity Icons:**
  * Minimalist outline/flat style on solid dark background.
  * Colors: Amber/yellow laptop with code lines (`Work`), Lavender crescent moon with "Zzz" (`Sleep`), Pastel gamepad (`Play Games`).
* **[00:39 - 00:40] Timeline Graphic:**
  * Sleek UI mockup representing an NLE timeline labeled "Claude Is Editing" with an orange spark icon.
  * Layered rounded pill clips: Pink (graphics), Green (voice/audio waveform), Teal (SFX), Blue (music).
* **[00:53 - 00:57] Frosted Glass HUD Elements:**
  * Translucent glassmorphism panels with 1px border highlights, blur backdrop, rounded corners (16px radius).
  * Clean white sans-serif typography with aligned app badges.
* **[01:27 - 01:33] GitHub-Style Contribution Heatmap:**
  * Dark slate card showing matrix of activity squares across months (Jul, Aug, Sep).
  * Color ramp: deep dark grey to neon lime green (`#22c55e`).
  * Dynamic counter on the left incrementing to `+86,000 Lines of Code` and `323 Commits`.

---

### 5. Numbers & Dashboard Metrics

* **[01:15 - 01:20] Cyril Sudepally Post (Skool/YouTube Analytics):**
  * Outlier score: `11.5x outlier score` highlighted.
  * vidIQ Outlier badge: `47.3x`.
  * Views: `95.2K Views over time` (1st 28 days).
  * Engagement: `1.1%`.
  * VPH (Views Per Hour): `62.6`.
* **[01:21 - 01:26] Andrew Fox Post:**
  * Metric: `Over 7K views in 3 days` on video titled "Your First $100K is the Hardest. Here's How I Did It."
  * VPH: `44.8x` outlier multiplier, `1 VPH`.
* **[01:31 - 01:33] Codebase Stats:**
  * `+86,000 Lines of Code`
  * `323 Commits` (later referenced as 335 in speech)
* **[02:12] Claude App Usage Panel:**
  * `Sessions: 557`
  * `Active days: 74`
* **[03:19, 05:59] Skool & Channel Metrics:**
  * Skool Community Members: `470 members` (grows to `479 members` by 03:26).
  * YouTube Subscribers: `16.6K subscribers` (Channel: `Jason Cooperson`).

---

### 6. Contradictions & Supplementary Screen Details

* **[01:31 vs Spoken 01:33]:** The on-screen graphic displays `323 Commits`, but the audio voiceover states "335 commits".
* **[04:53 - 05:01, 05:31]:** The mock press release for DaVinci Resolve 21.1 and the CapCut note contain a future date marker (`September 8, 2026` / `as of oct 7 2026`), indicating speculative mockups or future-dated concept slides used in the presentation.
* **[04:16 - 04:20]:** Clarification not clear from audio alone: the presenter stresses not to upload raw `.md` skill files into regular conversational chat; the tools must remain on local disk inside the designated folder for the CLI/Agent environment to access them natively.
