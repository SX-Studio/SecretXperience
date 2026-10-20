# Visual Findings: What the 15 Tutorial Videos Show That Transcripts Missed

Date: 2026-10-20. Gemini watched each video (segmented, 8 minutes per request) and reported on-screen tools, prompts, UI steps, visual style and numbers. Per-video reports are in `out/<id>.md`. This file is the synthesis and the list of changes to `../youtube-automation-blueprint.md`.

The four long interviews were skipped at the user's request. Their transcripts are already distilled in `../strategy-*.md`.

## How far to trust these reports

- **Model names are unreliable.** Gemini misreads Claude model labels. It reports "Opus 3.5", "Opus 4.7" or "Sonnet 4.6" where presenters say Opus 5.5 or Sonnet 5.5. Ignore model version strings in the per-video reports unless the presenter's speech agrees.
- **"Future date" remarks are wrong.** Gemini sometimes calls 2026 dates "mockups" because of its own training cutoff. Disregard those notes.
- **Repo owner names vary across segments.** For example, Printing Press appears as three different owners. Names were spot-checked against jsDelivr's GitHub mirror on 2026-10-20 (table below).
- **Report depth varies by model.** The first nine videos used gemini-3.7-flash, gemini-3.5-flash or gemini-3-flash-preview and are detailed. Nick Saraev, The Next New Thing and Greg Isenberg used gemini-3.5-flash-lite after the free quota ran out and are thinner.

### Repos and URLs read off screen

| Name | Status |
|---|---|
| `jakeschincariol/youtube-agent-skill` | Verified. 11 YouTube skills, MIT |
| `bradautomates/claude-video` | Verified. The /watch skill |
| `mvanhorn/printing-press-library` | Verified |
| `heygen-com/hyperframes` | Verified |
| `hetpatel-11/Adobe_Premiere_Pro_MCP` | Verified |
| `KINGSTAR-OMEGA/claude-token-optimizer` | Verified. Chronixel's "antigravity" skill |
| `morluto/rea` | Verified |
| `cathrynlavery/diagram-design` | Verified |
| `elliottate/SpliceKit` (Final Cut Pro MCP) | Not found under that name |
| `sirio/pte-open-source-workflow` | Not found under that name |
| `https://agentline.cloud/skill.md` | Live (HTTP 200) |
| `https://mcp.nych.ai/mcp` | Live, needs OAuth (HTTP 401) |
| `https://mcp.higgsfield.ai/mcp` | Shown on screen in two videos |

## The ten findings that change the build

1. **Free narration is available now.** Gemini TTS works on this environment's key (`gemini-3.8-flash-tts`, tested 2026-10-20, returns WAV). Futurepedia shows AI Studio's TTS with 2,060 voices, style presets (Narration, Friendly, Promote, Whisper) and inline expression tags such as `<breath>` or `<sigh>`. Use it for drafts and Shorts, and keep ElevenLabs as the upgrade.
2. **Word timestamps come from local Whisper, not the voice vendor.** Futurepedia drops the MP3 into Claude Code and asks "give me a word-level srt transcript", and Claude runs a local MLX Whisper. Jason Cooperson uses whisper-large-v3 and WhisperX. The pipeline should always derive word timing locally, whichever TTS is used.
3. **Embedding the style's source code is the consistency trick.** Futurepedia's Style Atlas (86 styles) builds each prompt as "Make a video in this style. Its full source: [BASE CODE]". The presenter shows Sonnet and ChatGPT producing near-identical results from the same prompt. So the prompt architecture does the work, not the model. For the channel, keep a `styles/` library where each style is a working HyperFrames composition. Pass its source in the prompt and rotate styles per video, which also satisfies the inauthentic-content rule (blueprint section 4).
4. **HyperFrames headless commands, verbatim** (The Next New Thing):
   ```
   npx hyperframes doctor
   npx hyperframes init hot-repos-short --example blank --resolution portrait --non-interactive
   claude -p "Using /hyperframes, edit index.html in this folder into a 10-second vertical (1080x1920) YouTube Shorts promo ... Dark background, bold typo, GSAP animation. No external images, audio or network fonts. Do not ask clarifying questions; make reasonable choices. When done, run npx hyperframes lints and fix errors. Do NOT render; I will render."
   npx hyperframes render -o hot-repos-short.mp4
   ```
   The split matters: Claude edits and lints, and a separate deterministic step renders. That is the unattended Stage 4 of the blueprint.
5. **Higgsfield's MCP is much broader than image generation.** Zinho's permission screen lists tools including `Explainer Video`, `Shorts Studio Sessions`, `Video Analysis Job`, `Generate Image`, `Generate Audio`, `Dubbing`, `Create Voice`, `Check Balance` and `Credit Transactions`. Pricing was on screen too:

   | Plan | Monthly billing | Credits per month |
   |---|---|---|
   | Basic | $19.80 | 800 |
   | Pro | $39.90 | 4,800 |
   | Ultra | $199.90 | 30,000 |

   Yearly billing halves these. In Danny Why's run, five GPT Image 2.5 images plus background removal came to 18.75 credits, or $1.48. Zinho sets every Higgsfield tool to "Always allow". Do not copy that. Put an approval gate on paid generation (Sirio's draft-mode rule).
6. **Jason Cooperson's editor is now fully mapped.** The root holds `AGENTS.md`, `CLAUDE.md`, `LANES.md`, `assets/`, `docs/`, `lanes/`, `packaging/`, `presets/`, `projects/` and `workflows/`, plus `transcript-corrections.json` and `skills-lock.json`. There are 31 skills, including `hyperframes`, `hyperframes-cli`, `hyperframes-animation`, `hyperframes-audio`, `faceless-explainer`, `motion-graphics`, `rough-cut`, `clipper`, `embedded-captions`, `talking-head-recut`, `remotion-to-hyperframes`, `premiere-pro`, `davinci-resolve` and `final-cut-pro`. Presets are organized as `presets/<platform>/<format>/`, each with `captions-style.md`, `graphics-style.md`, `music.md`, `sfx.json`, `grade.cube`, `titles/`, `text-animation/` and `README.md`. Copy this layout for `presets/`. Two facts from his screen matter for planning:
   - **Long-form editing eats context.** A full long-form edit took 2 hours 42 minutes and used 741K of a 1M context window.
   - **DaVinci Resolve 21.1 ships the AI connector.** A Blackmagic IBC 2026 press release is shown on screen. That supports his claim, which the blueprint marked unverified.
7. **Zinho's research prompt is the best Stage 1 starter found.** Verbatim:
   > Here's a YouTube channel. Fetch and analyze it directly. Pull every video from the last 12 months with title, views, upload date, and duration. Then give me: subscriber count, average views per video, the title patterns that repeat across their top performers and how many extra views those patterns are worth vs their baseline, upload cadence, and 10 topics in this niche that neither they nor their closest competitors have covered. If YouTube's page structure breaks your scraper, rewrite it and run it again.

   On screen it produced pattern-level lift numbers, for example "numbered sweep of a named place: 1.21x baseline". Combine it with TubeLab's outlier filters from the foundation video, which were "Uploaded until 2020" and "High authenticity score" for remakes. For niche hunting the filters were "Revenue (30 days) at least $1,000" and "RPM $5 to $10". Zinho also shows the full single-video prompt template (topic, title pattern, a visual style paragraph, a reference frame as the "style bible", `BRAND.md`, length). It is in `out/EChXCPolIDQ.md`.
8. **Chronixel's rule files, verbatim, belong in `resources/`.** These are `Text Style`, `Scene Composition` ("Do not display the sentence. Visualize the point."), `Scene Revision & Versioning` ("Scene X V2 - [title]", never overwrite) and `Creative Unlock` ("The script is the starting point, not the ceiling"). He also shows six "Creative direction locked" style briefs, such as Editorial Investigation and Mission Control. A chroma-green prompt makes graphics keyable over a talking head ("#00FF00 ... all UI elements fully solid and opaque"). A reflow prompt recomposes a scene into the left 35 percent of the frame for a webcam. The texts are in `out/oWkUwno6b0E.md`. Rendering was fast: 125 seconds for a 131-second video.
9. **Watch skill setup and its best prompt.** In Claude Desktop the install path is Customize, then Plugins, then Add marketplace, `bradautomates/claude-video`. Choose the Gemini engine, with the key in `~/.config/watch/.env`, and pick Efficient, Balanced or Token Burner. On Brad's chart the agentic Gemini mode used about 7x fewer tokens than 1-fps frames, with equal accuracy (44 of 50 against 43 of 50). His most useful prompt for us is: "/watch [url] recreate this motion graphic using hyperframes, pixel perfect match. use the /watch skill but local engine". That is how to turn a competitor's look into a reusable style.
10. **The Haiku-swarm question is settled with numbers.** Dubibubi's dashboards gave the solo-Opus run 10 points against 2 for the Opus-plus-Haiku team.

    | Build | Solo Opus | Opus + Haiku |
    |---|---|---|
    | Angry Birds game | $12.78 | $11.62 |
    | Samurai film | $25.04 | $44.79 |
    | Code review | $141.54, score +122 | $55.16, score +89 |

    Use the team only for wide read-only jobs, such as scraping many channels. Keep scripts, styles and edits on one strong model. Its environment variables are `CLAUDE_CODE_SUBAGENT_MODEL=haiku` and `CLAUDE_CODE_SUBAGENT_FORCE=1`.

## Per-video notes not covered above

- **TubeLab (foundation).** On-screen demographics for the Amish channel: 81.8 percent of viewers are 55 or older, and 46.3 percent are 65 or older. The sales page uses a $47 core offer with $19, $19 and $24 add-ons, framed as "$109 value". TubeAvatar is from $0.20 a minute. Its storyboard mixes "AI picture", "real picture" and stock clips per scene, each with Animate, Replace and Approved controls. One render showed $2.69 for 13 minutes 26 seconds across 91 scenes. The revenue claims, such as "$50,499 in 33 days", come from screenshots of X posts and are unverified.
- **Danny Why.** His YouTube Studio is real and on screen: 18.2M views and 78.5K watch hours in 28 days. His Step 1 to Step 3 prompts are legible on screen and match the Google Doc.
- **Taro Creates.** The Nych MCP (`https://mcp.nych.ai/mcp`) pulled a TikTok transcript. Taro then denied Nych's own generation and had Opus 5.5 do all editing in code. His specified look was black and light blue, word-by-word captions, 3D camera angles and non-linear easing, "as if it was edited inside of After Effects". Claude estimated $4.20 to $10.50 of usage per video. TikTok Creator Rewards screenshots show RPMs of $2.01 to $6.64. Videos must run over one minute to earn.
- **Futurepedia.** Kevin Ngo's fruit-fly film, drawn frame by frame in plain JavaScript canvas, is the origin of the "code is the renderer" idea. The Style Atlas prompt builder takes a topic, a voiceover toggle, a "storyboard first" checkbox and a pasted word-level SRT.
- **Sirio.** On screen: an 11-step workflow of Demucs, Rubber Band, Depth Anything, SAM 3, Composite, Seedance and audio restore, sold as "Seedance 2.5 Unrestricted" through an Enhancor API. Depth Anything on fal costs $0.04 per second. The verdict stands: this is IP-filter circumvention and stays out of the pipeline. The reusable part is the draft rule: "Set up the draft mode... 480p first. Then I need to approve."
- **Nuno Tavares.** The Printing Press library is browsable at `printingpress.dev`. His Skool CLI took about an hour of back and forth that the video cuts. The "MCP uses 35x more tokens" chart is the presenter's own benchmark.
- **Nick Saraev.** Setup is `npx rea-agents setup`. His control test, Claude Code rebuilding macOS Preview without REA, worked about as well.
- **The Next New Thing.** Other repos shown include `mattpocock/skills` (a TDD skill run via `claude -p`), `earthtojake/text-to-cad`, `cathrynlavery/diagram-design` (45 diagram types, useful for explainer diagrams) and `NationalSecurityAgency/ghidra`.
- **Deeplearn HQ short.** This corrects the blueprint. The repo shown is `jakeschincariol/youtube-agent-skill`, with 11 skills: `/yt-script` (21 hooks), `/yt-package`, `/yt-edit`, `/yt-audit`, `/yt-comment`, `/yt-chapters`, `/yt-plan`, `/yt-seo`, `/yt-shorts`, `/yt-retention` and `/yt-viral`. The earlier guess was `AgriciDaniel/claude-youtube`. Both exist. Evaluate the 11-skill one first.
- **Greg Isenberg (Muse).** The phone bridge is a Bland "Agent Phone Plan" at $14.99 for the first month, then $29, wired with `AGENTLINE_API_KEY` and `https://agentline.cloud/skill.md`. His whiteboard shows "Level 4: Build technology", on top of his three levels. The demo query was "a list of night nurses who are $30/hr in Montreal", and a follow-up asked Muse to search FB groups, "quality there is highest".

## Blueprint changes, in order of impact

1. Stage 3, voice: add Gemini TTS as the default for drafts and Shorts (free on the current key), and keep ElevenLabs as the premium option. Always compute word timing with local Whisper.
2. Stage 3, Lane A: add a `styles/` library of working HyperFrames compositions, passed as full source in each prompt (Futurepedia), and rotated per video for the inauthentic-content guardrail.
3. Stage 4: adopt the `claude -p` edit-and-lint, then `npx hyperframes render`, split as the unattended path.
4. Stage 0, folders: copy Jason's `presets/<platform>/<format>/` layout and Chronixel's four rule files into `resources/`.
5. Stage 1: add Zinho's channel-teardown prompt and TubeLab's outlier and niche filters to the research job.
6. Section 2: replace the Deeplearn row's repo with `jakeschincariol/youtube-agent-skill`, and upgrade the Resolve 21.1 connector from "claimed" to "shown on screen".
7. Keys: the Gemini key now covers Watch runs, TTS and retention analysis. Free-tier limits are about 20 requests per model per day, so a scheduled pipeline needs either the paid tier or the model rotation in `watch_all.py`.
