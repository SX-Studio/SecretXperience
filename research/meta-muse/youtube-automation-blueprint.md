# Fully Automated YouTube Pipeline: What Works, Built From 13 Videos

> **Update 2026-10-20:** the 15 tutorial videos were also watched for visuals. Read `watch/VISUAL-FINDINGS.md` first; its last section lists the changes to this blueprint, and the corrections below are already applied.

Date: 2026-10-19. All 13 videos were transcribed and read in full. Tool claims were checked against the tools' own pages where possible. "Verified" means I read it on the vendor's page today. "Claimed" means a creator said it and I could not confirm.

---

## 1. The foundation: what TubeLab's video actually says

"Exposing The New YouTube Automation Goldrush" (TubeLab, Oct 2, 2026, 6 min, 87K views) is a short, sharp thesis. Everything else in this document is built on top of it.

**The thesis in five lines**
1. Classic faceless channels were demonetized from July 2025 under the inauthentic-content rule. "Show me a face."
2. The automation industry answered with AI avatars (HeyGen-style presenters). Under-35 viewers spot them. Over-55 viewers do not, watch to the end, leave comments, and have money.
3. The ad revenue is the garnish. The real business is a product sold under every video: the "Amish Home Savings Manual" at $47, "The Honest Guardian" dog ebook. One channel reportedly did $17K in book sales in a month without being monetized.
4. The five moves: remake pre-2020 viral videos with an avatar; expand into sibling niches as an avatar network; cast the presenter the audience already trusts (an Amish man for frugality, a 50-year gardener for tomatoes); automate the whole line; run it as a testing operation, not as art.
5. The warning: YouTube will come for avatars next. What survives is real educational value. Never do health, finance, or anything sensitive with a fake expert.

**What to take from it**
- Pick the audience first (older, patient, buys books), then the presenter persona, then the niche. Most automation guides do this backwards.
- Build the product and the channel together. A $27 to $47 PDF or course behind a simple page turns a 5K-view video into revenue that AdSense never would.
- The "remake an old outlier" research step is the one that makes the content work. It is also the step that is easiest to automate (section 3).

**What to be careful about**
- It is a 6-minute ad for TubeAvatar and TubeLab. The Elias Yoder numbers ($300K in a month) are TubeLab's estimates.
- An AI presenter claiming to be a real Amish farmer with a wife named Esther is a persona fabrication. It works today. It is exactly what the inauthentic-content and disclosure rules are reaching toward. Build so the channel survives if avatars get the same treatment as faceless slideshows did: the research, scripts, product and motion graphics should still be valuable with the presenter swapped for a real person or no presenter.

---

## 2. The other twelve, ranked by how much they change the build

| Rank | Video | What it contributes | Verdict |
|---|---|---|---|
| 1 | Jason Cooperson, "I Finally Solved AI Video Editing" | The project-folder architecture: Claude Code runs in a folder of 20+ skills and a presets folder; presets encode editing taste; "take everything we learned this session and put it in the preset". Free starter prompt is real and specific (WhisperX transcription, Resolve/Premiere/FCP/ffmpeg paths, loudness targets). | Copy the architecture. |
| 2 | Danny Why, "Claude Literally Just Changed YouTube Forever" | The cleanest end-to-end prompt chain found: script with shot list and style line, cut-out images via Higgsfield, ElevenLabs with word timings, Remotion 1080x1920 60fps template driven by a settings file, render stills every 0.5s and self-check, 10-minute mode that "does not stop to ask". Claims 18M views in 28 days on a hidden Shorts niche. | Copy the prompt chain. Treat the numbers as unverified. |
| 3 | Chronixel, "Claude + Remotion" | Resources folder pattern (text style, scene composition, versioning rules, creative unlock), "creative direction lock" every five scenes, scene versioning instead of overwriting, green-screen trick for overlaying graphics on a talking head, images into Remotion. One hour per video claimed. | Copy the resources pattern. |
| 4 | Zinho Automates, Claude + Higgsfield | Lock the visual style on one frame before generating anything; brand voice file; competitor channel scrape to get a topic queue; regenerate one scene with a screenshot; four styles in one session; Faceless Studio as the no-code fallback. | Copy the style-lock and scene-fix steps. |
| 5 | Brad Bonanno, "Watch" skill | Claude cannot see video; the Watch skill hands a URL to Gemini, which returns timestamped analysis for free (8 hours of YouTube a day on Google's free tier). Use cases: find a moment, line up retention drops with content, take notes. Local mode with WhisperX for frame-level inspection. | Use it for research and for the retention loop. |
| 6 | Dubibubi, Haiku swarm vs Opus | Haiku teams lose on taste (the samurai film cost 80% more and was worse). They win on parallelizable reads (code review, 61% saved). | Opus for script and style decisions. Haiku only for parallel scraping. |
| 7 | Nuno Tavares, CLI connectors | CLIs beat MCPs on tokens for repetitive calls. Printing Press (github.com/mvanhorn/cli-printing-press) generates a Go CLI plus skill for any API or site. | Wrap YouTube, TubeLab and analytics calls as CLIs for the scheduled runs. |
| 8 | The Next New Thing, GitHub roundup | HyperFrames (HeyGen, Apache 2.0): write HTML, render deterministic MP4, 21 agent skills, captions, audio mixing, Lambda rendering. A branded-diagram generator. | HyperFrames is the strongest alternative to Remotion for an unattended renderer. |
| 9 | Deeplearn HQ short | "11 YouTube agent skills" is a marketing short. The repo on screen is `jakeschincariol/youtube-agent-skill` (11 skills, MIT: /yt-script with 21 hooks, /yt-package, /yt-edit, /yt-retention, /yt-viral and more; verified 2026-10-20). AgriciDaniel/claude-youtube (14 sub-skills) is an alternative. | Evaluate jakeschincariol's repo first. |
| 10 | Sirio, Higgsfield reverse-engineered | How template face-swap apps dodge IP filters: depth mask plus SAM3 cut-outs plus pitched vocals, then Seedance 2.5 in draft mode via Enhancor's API. Eleven-step agent workflow. | Technically brilliant. It is IP circumvention. Do not put it in a public channel pipeline. The draft-mode and "approve before 1080p" pattern is worth keeping. |
| 11 | Nick Saraev, REA | Reverse Engineer Anything wraps Ghidra, Hopper and IDA for agents. His own test: plain Claude Code rebuilt the Preview app about as well without it. | Not relevant to video. Useful only as a reminder that agents can rebuild any tool you depend on. |
| 12 | Cole Gordon, 82 minutes of sales | Pre-pitch framework, "sell the plan before the product", check-ins every 45 seconds, "do you agree with what I laid out", handling nerves. | Relevant only to the product behind the channel (section 1, point 3). Use it to write the sales page and any webinar script. Nothing for the pipeline. |

---

## 3. The pipeline, stage by stage

The goal is one command, or one cron tick, that goes from "nothing" to "published video plus Shorts plus a learning written back into the presets". Below, each stage lists the tools the videos used, what I verified about them, and the recommended choice.

### Stage 0. Channel design (done once, by you)

- Audience and persona first (TubeLab). Decide: presenter avatar, no presenter with motion graphics, or your own face with AI-cut editing. The pipeline supports all three, but the policy exposure is very different.
- Product behind the channel (TubeLab, Cole Gordon): a $27 to $47 guide, a community, or a service. Decide this before video one, because the script template needs the call to action.
- Style bible (Zinho, Chronixel, Danny Why): one reference frame per channel, one style line, one brand-voice file, three fonts, a scene-composition rule, a versioning rule. These live in `resources/` and are read at the start of every run.

### Stage 1. Research and topic selection

Tools, verified today:
- **TubeLab API** (`https://public-api.tubelab.net/v1`, API-key header, paid subscription with credits): outliers search, similar outliers, trending formats, channel videos and Shorts, video details, video transcript, comments, scan. Also an MCP server and an agent skill. This is the "remake an old outlier" move from the foundation video, as an API call.
- **Watch skill** (Brad Bonanno): Gemini watches the outlier and returns hook, structure, visual beats with timestamps. Free tier, no download, no blocking.
- **claude-youtube** (AgriciDaniel, MIT, 14 sub-skills): hook variants, titles, thumbnail briefs.
- **Competitor scrape** (Zinho): Claude Code pulls a channel's recent videos and derives a title pattern. TubeLab's channel-videos endpoint does this without scraping.

Automation: a nightly job runs `outliers?query=<niche>` filtered to pre-2021 uploads with high outlier ratio, dedupes against `topics.db`, asks Watch for a structural breakdown of the top three, and writes a `topic_queue.json` entry with: source video, hook pattern, structure, estimated RPM, persona fit score. Opus picks the next topic; Haiku workers do the fetching in parallel (Dubibubi).

### Stage 2. Script

- Danny Why's Step 1 prompt is the best starting template found: narration plus shot list plus picture list plus one style line, saved as `script.md`. His Step 4 adds `facts.md` with a source for every number and "cut it if you cannot source it". That sourcing step is what keeps the channel on the right side of "real educational value".
- Chronixel's scene-composition rule: translate meaning into visuals, do not illustrate words literally.
- Hooks from claude-youtube (5 variants), choose by the pattern the outlier used.
- Model: Opus 5.5 at high effort for the script and visual direction (Dubibubi, Jason). Sonnet for rewrites.

### Stage 3. Assets

Three lanes. Pick per channel, mix per video.

**Lane A, code-rendered motion graphics (the quality and consistency lever).**
- **Remotion** (Chronixel, Danny Why): React components, settings-file-driven templates, 1080x1920 at 60 fps or 1080p/4K, stills for self-check. Mature, large skill ecosystem. Check Remotion's company-license terms for your entity size.
- **HyperFrames** (HeyGen, verified Apache 2.0): HTML plus GSAP/CSS/Lottie/Three.js, deterministic MP4 via headless Chrome and FFmpeg, 21 agent skills including embedded captions, TTS and music handling, audio mixing, lint and check, cloud and Lambda render. Node 22 and FFmpeg. No license fees at any size.
- Recommendation: HyperFrames for an unattended server pipeline (Apache license, deterministic output, built-in lint and check). Remotion if you prefer React and want the larger community. Either way, the Danny Why rules are the house style: one camera, ease in and out, nothing pops, fade with scale and blur, one thing at a time, safe zones top 8% and bottom 18%.

**Lane B, generated images and clips.**
- **Higgsfield MCP** (`https://mcp.higgsfield.ai/mcp`, verified): routes to 30+ models including Nano Banana Pro, GPT Image 2.5, Seedance 2.5, Kling 3. Faceless Studio for no-code episodes. Pricing is credit-based and not on the MCP page; Danny Why paid about 11 credits per image; a reviewer put Plus at about $59 for 1,200 credits.
- **Direct APIs via fal.ai** for a server pipeline with no MCP: Veo 3.1 Fast about $0.10/s, Kling 3 Pro about $0.11/s, Nano Banana class images a few cents each (third-party price listings, confirm on fal). Sora's API is being shut down; do not build on it.
- Rules from the videos: lock style on one frame before generating anything (Zinho, Danny); cut-outs with transparent backgrounds so the renderer can animate elements separately (Danny); regenerate a single scene from a screenshot (Zinho); draft mode first, pay for 1080p once, approval gate before the paid render (Sirio).

**Lane C, AI presenter.**
- **TubeAvatar** (TubeLab, verified): free desktop app for Mac and Windows, you connect your own HeyGen, Claude or OpenRouter keys, paste a script, set a per-minute budget, it finds or generates b-roll and cuts the video. Example: a 12:48 video for $3.50. No API, no CLI, no batch mode documented, so it cannot be the unattended core. Use it to prototype the presenter format, then replicate with the HeyGen API inside your own pipeline.
- Persona rule: do not claim a fabricated biography. "AI-presented" plus a real author behind the product is the version that survives a policy change.

**Voice.** Default for drafts and Shorts: Gemini TTS (`gemini-3.8-flash-tts`, works on this environment's key, tested 2026-10-20; 2,060 voices with style presets and expression tags per Futurepedia). Premium: ElevenLabs v3 at about $0.10 per 1,000 characters (Flash at $0.05). Whichever voice is used, derive word timestamps locally with Whisper/WhisperX. Request word-level timestamps; both Danny Why and Jason sync every visual to a word. A 1,500-word script is roughly 9,000 characters, under one dollar.

### Stage 4. Assembly and edit

Two modes, both from Jason Cooperson's design:
- **App-driven** (Resolve Studio, Premiere, Final Cut): Claude drives the editor live, cut lands as real trimmable clips. His starter prompt says Resolve Studio 21.1+ ships a built-in connector for Claude Code under "File > Setup AI Assistants" and that the free Resolve lost scripting in 21.1. A Blackmagic IBC 2026 press release for Resolve 21.1's AI/MCP integration is shown on screen in his video, so the built-in connector is real; confirm the menu path when you open it. Premiere uses the hetpatel-11 Premiere MCP at a pinned commit. This mode is for your own talking-head content where you want to touch the timeline afterwards.
- **Headless** (no app): the renderer is Remotion or HyperFrames, assembly is ffmpeg, captions are burned by the renderer, music and SFX mixed by script. This is the only mode that can run unattended on a server. Jason's own "No app on request" option is this.

The presets folder is the product. Jason's loudness and export targets, verified from his page: speech at -17 LUFS into a -6 dBFS limiter, music bed at -20 dB, SFX under -1 dBTP, long-form at 3840x2160 CBR 50, vertical 1080x1920 CBR 14, AAC 320k. Put those in `presets/youtube-long.md` and `presets/shorts.md` on day one, then append every lesson each run teaches.

Shorts: Jason's "Clipper" concept and HyperFrames 9:16 compositions. Every long-form run also emits 3 to 5 vertical cuts from the strongest beats, re-hooked.

### Stage 5. Quality gates (what makes "clean and excellent" real)

- Render stills every 0.5 s and at every sentence start, have the agent inspect them and fix (Danny Why). With HyperFrames use `lint`, `check` and `snapshot`.
- Watch skill in local mode: Claude inspects actual frames of its own render against the reference frame (Brad, use case for motion graphics).
- Audio: measure LUFS with ffmpeg's loudnorm and assert against the preset.
- Word-sync check: every label and visual change must fall within 150 ms of its word timestamp (Danny Why's "land exactly on its words").
- Facts: every number in the narration must exist in `facts.md` with a source, or the run fails.
- Policy check: a Claude pass against the inauthentic-content rules (section 4) that scores originality versus the channel's last five videos and refuses templated sameness.
- Two-strike rule from Jason's prompt: "if something fails twice, stop and tell me." The run writes a `HOLD` and emails you instead of looping.

### Stage 6. Packaging and upload

Verified today on Google's own page for `videos.insert`:
- Quota cost 1 unit in a dedicated Video Uploads bucket, limit 100 calls per day.
- Uploads from unverified API projects are not restricted to private viewing.
- Scopes: `youtube.upload` or `youtube`. Max file 256 GB.
- Thumbnails go through `thumbnails.set` (requires a verified phone on the channel for custom thumbnails).
- Set the altered or synthetic content disclosure where the content looks realistic. YouTube's policy page says disclosure is not required for clearly animated or unrealistic content, so motion-graphics channels usually do not need it; avatar channels do.

Titles and thumbnails come from the claude-youtube skill with three A/B variants. Thumbnails render through the same HyperFrames or Remotion composition (a still), so they match the video. Schedule publish time from the channel's analytics (best hour by audience).

### Stage 7. The learning loop

- Pull retention curves from the YouTube Analytics API per video.
- Watch skill lines up each drop with what was on screen and what was said (Brad's use case 2).
- Claude writes one paragraph of learnings into `presets/<format>.md` and one into `topics.db` (which hook patterns and structures held). This is Jason's "put everything we learned into the preset" done automatically.

### Orchestration

- **Runner:** Claude Code headless (`claude -p` with the project folder as cwd) started by a scheduler, or the Agent SDK inside a worker. Your existing Vercel plus Supabase stack holds `topics.db`, run logs and HOLD states. The render box needs Node 22, FFmpeg, Chrome; a small Linux VM or HyperFrames' Lambda renderer.
- **Models:** Opus 5.5 for script, visual direction, final review. Sonnet 5.5 for code edits and rewrites. Haiku 5.5 only for parallel fetch and classify jobs (Dubibubi, Cintas).
- **Connectors:** CLIs for TubeLab, YouTube upload and analytics (Printing Press or hand-written Go/Python), MCP only for Higgsfield. Token spend on a 10-minute video run is dominated by the render and check loop, not by the API calls, so this matters less than Nuno suggests, but it keeps scheduled runs cheap.
- **Token discipline:** Chronixel's "anti-gravity" skill is an unverified community file; the useful part is the rule set (no preambles, strict modes, tool priority). Write your own three lines in CLAUDE.md.
- **Human touchpoints:** none on a normal run. HOLD emails on a double failure, a policy score below threshold, or a fact without a source.

---

## 4. Guardrails that decide whether the channel survives

Verified from YouTube's monetization policy page today:
- July 15, 2025: "repetitious content" became "inauthentic content", covering content that is "repetitive or mass-produced".
- Ineligible examples include "image slideshows, templated storylines, or scrolling text with minimal or no narrative, commentary, or educational value" and "AI-generated content made with generic or unoriginal templates".
- Allowed: AI as a creative tool, such as editing scripts or generating a unique background visual.
- The page does not mention a disclosure requirement; that lives in the separate synthetic-media disclosure setting.

Design consequences:
1. Vary the visual direction per video (Chronixel's creative-direction lock, Zinho's four styles) while keeping the brand voice. A fixed template across 50 videos is the definition of the violation.
2. Original research and sourced facts per video (`facts.md`). This is also what makes the product credible.
3. Commentary and narrative, not slideshows. Code-rendered motion graphics with a camera journey are far from "image slideshow".
4. No health, finance, legal or safety topics with a synthetic presenter (TubeLab's own warning).
5. No celebrity or copyrighted-template face swaps (Sirio's method), no unlicensed music. Use licensed or generated music with a stored license record per video.
6. Keep the real author visible somewhere (about page, product), so an avatar is presentation, not a fabricated identity.

---

## 5. Cost per video (estimates from the figures above)

| Item | 10-minute long-form | 30-second Short |
|---|---|---|
| Claude (Opus plan, Sonnet edits, checks) | $3 to $8 | $0.50 to $1.50 |
| Images, 8 to 12 cut-outs | $0.50 to $1.50 | $0.30 to $0.80 |
| Generated clips, optional 6 x 5 s on Kling or Veo Fast | $3 to $4 | $0 to $1 |
| Voice, ElevenLabs v3 | about $0.90 | about $0.10 |
| Render, local or Lambda | cents | cents |
| TubeLab credits, amortized | about $1 | about $0.20 |
| YouTube API | $0 | $0 |
| **Total** | **$9 to $16** | **$1 to $4** |

Jason's "about $5 per video on a $20 plan" is consistent with the Claude line here. Zinho's reviewer notes a Higgsfield subscription can be exhausted by a 10-video batch; direct APIs avoid that cliff.

---

## 6. Recommended stack and build order

**Stack**
- Research: TubeLab API plus Watch skill plus claude-youtube hooks.
- Script: Opus 5.5 with Danny Why's prompt structure and `facts.md`.
- Visuals: HyperFrames (primary) with Remotion as the alternative; images via fal.ai or Higgsfield MCP; optional Kling or Veo Fast clips.
- Voice: ElevenLabs v3 with word timestamps.
- Assembly: headless, ffmpeg, presets folder in Jason's structure.
- QA: stills inspection, LUFS assert, word-sync assert, facts assert, policy score.
- Upload: YouTube Data API via a CLI. Thumbnails from the same renderer.
- Loop: Analytics API plus Watch skill, writing back to presets.
- Orchestration: Claude Code headless on a schedule, state in Supabase, HOLD by email.

**Build order**
1. Week 1: project folder with `resources/`, `presets/`, `skills/`; style bible; Danny Why chain running end to end for one Short on HyperFrames; upload by API. One video, fully unattended.
2. Week 2: research job on TubeLab plus Watch; topic queue; long-form mode with `facts.md`; QA gates; Shorts clipper from the long-form.
3. Week 3: learning loop from analytics; policy score; second visual style; presenter lane only if the channel design calls for it.
4. Then: product page and the sales copy (Cole Gordon's pre-pitch structure), second channel from the same codebase with a new `resources/` folder.

**Decision needed from you:** the channel's audience and niche, and whether it uses a presenter. Everything in the repo is niche-agnostic until `resources/` is filled.

---

## Transcripts and extracted assets

All in the session scratchpad, folder `yt2`:
- `<videoId>.transcript.txt` for all 13 videos
- `jason_starter_prompt.md` (full free starter prompt, 1,959 words)
- `dannywhy_prompts.txt` (Steps 1 to 4)
- `<videoId>.info.json` with chapters and descriptions

Key repos and pages referenced: github.com/heygen-com/hyperframes, github.com/AgriciDaniel/claude-youtube, github.com/mvanhorn/cli-printing-press, github.com/hetpatel-11/Adobe_Premiere_Pro_MCP, tubelab.net/docs/api, mcp.higgsfield.ai/mcp, developers.google.com/youtube/v3/docs/videos/insert, support.google.com/youtube/answer/1311392.
