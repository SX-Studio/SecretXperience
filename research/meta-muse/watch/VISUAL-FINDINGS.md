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

## Added 2026-10-20: two Higgsfield videos

Reports: `out/-LNDXx__ZT0.md` and `out/zkhLZUGIIfE.md`. Transcripts: `../transcripts/`.

### Higgsfield Katana launch short (78 s, Higgsfield AI, 195K views)

- **What is on screen.** In Claude Desktop the path is Settings, then Connectors, then "Higgsfield Katana" switched on. Prompts are one line, for example "Aura farming edit of my car" with a car photo, or a pasted Instagram link plus "aura farming edit of that person". Output is fast phonk-style edits with speed lines, chromatic aberration, whip pans, flash impacts and glowing all-caps kinetic type. A "Katana mode" toggle and "context-aware shot generation" are shown.
- **What Higgsfield's own article adds** ([higgsfield.ai/blog/higgsfield-katana](https://higgsfield.ai/blog/higgsfield-katana)):
  - **Function.** Katana is a Claude skill on the same connector (`https://mcp.higgsfield.ai/mcp`). It rebuilds a reference edit's shot order, pacing and cuts, using up to 5 photos of your characters or products.
  - **Invocation.** `/katana` opens the preset library, and `/katana/<preset>` runs one.
  - **Output.** An MP4 matching the reference's length, aspect ratio and frame rate. Corrections regenerate only the affected shots.
  - **Billing.** Normal Higgsfield credits, with the cost shown before each generation.
  - **Uploads.** Images attached in the Claude chat are not passed through. Use Higgsfield's upload window or a direct media link.
  - **Contradiction.** The article says profile links from Instagram or TikTok are not accepted, while the launch video pastes an Instagram link.
- **The editable After Effects route** ([AlphaSignal](https://alphasignal.ai/news/higgsfield-lets-claude-build-fully-editable-after-effects-projects)). A separate bridge (`https://bridge.higgsfield.ai/mcp`) plus a local Adobe plugin lets Claude return a layered `.aep` file with keyframes and expressions. Skills include `/use-after-effects` and `/paper-collage`. It needs Higgsfield, Claude and After Effects subscriptions.
- **Fit for this project.** Katana is built for trend edits ("aura farming", hype reels), not for mechanism explainers. It is useful for a separate Shorts lane or product promos, and as a quick way to prototype a look before rebuilding it in HyperFrames. The article itself says to use only references you own or have permission to use. Treat cloning another creator's edit as the same risk class as Sirio's workflow.

### "I Replaced Higgsfield Genjutsu With My RTX 3060" (10.6 min, The_Frizzy1)

- **What it does.** It runs Genjutsu-style character swaps locally: one video plus one character sheet gives the same clip, same moves and original sound, with the person replaced. It needs no credits, no upload and no cloud filter.
- **Model and files.** The model is MiniMax H3 Ref2VA plus a 155 MB Character Swap LoRA (Akatz Labs, rank 16), running in ComfyUI 0.39 or newer with core nodes only. The workflow is free on [GitHub](https://github.com/Thefrizzy1/The_frizzy1-Workflows/tree/main/workflows/minimax/h3-character-swap-12gb), and the files total about 42 GB:

  | File | Size |
  |---|---|
  | Ref2VA model | 21.0 GB |
  | Qwen2-VL text encoder | 15.7 GB |
  | Video VAE | 2.8 GB |
  | Audio VAE | 0.6 GB |
  | Turbo LoRA | 2.0 GB |
  | Swap LoRA | 155 MB |

- **Hardware and real times.** It ran on an RTX 3060 with 12 GB at 0.4 megapixels, with VRAM at 95 percent and system RAM peaking at 23 GB. 32 GB of RAM is recommended.

  | Job | Time |
  |---|---|
  | 5 s clip, 4 turbo steps | 9:55 |
  | 5 s clip, 20 steps | 35:10 |
  | Typical full meme, 6.7 to 9.8 s | 12 to 17.5 min |

- **Three fixes he shows.** The H3 model alone does nothing, and the Swap LoRA fixes that. Box mode fails, and one "who to replace" sentence fixes that, for example "bald man in the black t-shirt at the back". Five-second clips cut off punchlines, so 124-frame passes are chained from the last 22 frames of the previous pass, and the original audio is restored at the end.
- **Limits from the LoRA's model card.** Shots of 4 to 5 seconds work best, with one person at a time. Cuts inside a clip confuse it.
- **Character sheets.** These are front, back and face close-up, made locally with Qwen Image 2.1 in about 15 to 20 seconds each.
- **Fit for this project.**
  - **Hardware.** This cloud container has no GPU, so this would run on the user's own PC or a rented GPU.
  - **The legitimate use is a channel mascot.** Film yourself demonstrating something, such as how to reseat a water-heater element, then swap yourself for a consistent cartoon mascot. The motion is real and the presenter is clearly animated. That avoids the fabricated-human-avatar problem in blueprint section 4. It also lowers synthetic-content disclosure exposure, though disclosure still applies if the result looks realistic.
  - **Real people and copyrighted clips stay out.** The creator himself swaps only into dogs and cartoons, "not real people. That's where it can get sketchy." Never put a real person's likeness, or a copyrighted meme clip, into a public channel this way.

## Added 2026-10-20: AI UGC realism and $0 motion graphics

Reports: `out/zke3bTtvmLo.md` is complete. `out/kvf2lRSGixg.md` is **pending**: only segment 1 of 4 (00:00 to 08:00) finished before every free-tier model hit its daily quota. That segment is cached in `out/parts/`, which is gitignored and so local to this container. Rerun `python3 -I watch_all.py --ids kvf2lRSGixg` once quota resets; it skips the finished segment. Transcripts: `../transcripts/kvf2lRSGixg-kristian-jennings-ai-ugc-real.txt` and `../transcripts/zke3bTtvmLo-jad-mh-viral-motion-graphics-skill.txt`.

**Update 2026-10-21:** `out/kvf2lRSGixg.md` is now complete (segments 2 to 4 ran on gemini-3.5-flash-lite). The new details are under "Visual watch additions" at the end of the Kristian Jennings section below.

The same trust caveats apply. Model names come from the presenters and their own pages; Gemini's spellings were only used where speech or a linked page agrees.

### "I stopped using seedance and now my AI UGC looks 100% real (Copy me)" (31.2 min, Kristian Jennings, 94K views)

Kristian is a DTC ad editor and Ecom Talent coach. The video is a three-step workflow for realistic talking-head "AI UGC" ads (hair loss, TRT, dog food). His resources page ([kristianjennings.com/resources/ai-ugc](https://kristianjennings.com/resources/ai-ugc/)) has the exact prompt and a 16.5 KB guide written for an AI assistant to follow.

- **Before generation.** The script decides whether an ad wins, so storyboard first: script lines in the left column, what is on screen in the right. Pick the avatar by logic: someone who has already solved the problem, never a real or deepfaked professional. "KISS": the best ads deliver the message clearly, not the most hyper-edited ones.
- **Step 1, the reference frame (50 percent of the effort).** Image models make faces too clean. A video model animates only what is in the still, so missing sensor noise, pores and uneven light read as "waxy" once it moves. So he starts from a still of a real phone-shot UGC video (TikTok for young avatars, Instagram for millennials, Facebook for older ones), grabbed with Shift+E in Premiere. Pinterest is now "full of AI slop". He screens for three things:
  - **Framing.** Body position, phone angle and distance, chosen on purpose.
  - **No blown highlights.** Forehead shine is fine while it still holds detail. Pure white has no data to animate.
  - **Background.** Some personality and depth, without clutter.
- **Step 2, the avatar.** With **Nano Banana Pro** (the original, not Nano Banana 2), because its older output keeps more imperfection, he edits the frame into a different person. He avoids GPT Image models as "too perfect". Four things change: the person (eye colour, nose, skin, enough that they could not be the same individual), the background (greenery), outlier accessories (one AirPod in, jewellery) and a visible reason for clean audio (a DJI mic, a headset mic, or closer to the phone). All changes go in **one prompt**, regenerated until right. Chained edits leave feathered patches that show up once animated.
- **Step 3, the video.** He uses **Gemini Omni** (not Omni Flash) through Kie's pay-as-you-go API. He calls it the best UGC model in September 2026. Flux 3 has better voice control but fewer voices. The prompt has three parts: scene (camera movement stated even when static, camera type, scene, what the avatar does, energy), the dialogue in quotes, and fixed rules stacked up while iterating. The prompt from his page, verbatim:
  > Static locked-off shot, UGC iPhone footage of a confident American man in his bedroom. He stays still, mouth moving naturally as he speaks, direct eye contact with camera, no camera movement. He has SUPER high energy as this is for a youtube video. The man says: "so weak follicles wake back up and stay in the growth phase longer instead of shedding early." Pace: SUPER High energy, confident tone. Fast pacing. Smiling at the camera, he seems very friendly. One take, no jump cuts. Same avatar, same location, same camera framing. Do not recompose the shot
- **Rules that transfer.**
  - **Lock, then swap.** Regenerate one line until energy, framing and pacing are locked. After that, change only the dialogue.
  - **The 50/25/25 split.** Half the time on the reference, a quarter on the prompt, a quarter on generating the script.
  - **Throw away a bad reference.** Roughly 1 in 10 references never animates well. Rebuild the image rather than fight the video model.
  - **Capitals move stress.** "So weak FOLLICLES wake back up" shifts the emphasis.
  - **Pad between durations.** Omni renders 4, 6, 8 or 10 s. For a 7 s line, add nonsense words, render 8 s and cut the tail.
- **Quirk.** Every Omni avatar has the same set of teeth.
- **What the screen adds (Gemini, first 8 minutes only; the rest is pending quota).**
  - **The storyboard is a Google Doc.** A "Rules" block sits on top: relaxed pacing, "Conversational AF", slower cuts (1.5 s in the hook, 2 s in the hold), the avatar present throughout, "B roll feels real but not slick movie style OR studio shots", biomedical animations cohesive with each other, "Show what he's saying, KISS". Below is a two-column table, "Script / Voiceover" against "Visual Shot / Assets", with three alternative hooks, each with its own visual plan (for example "Literal world map + literal line").
  - **The ads are 9:16 composites, not just talking heads.** The AI UGC is cut with motion graphics: a blue-grid world map with red lines and cut-out headshots, paper-cut maps, bold red and white captions with warning icons, and B-roll. A diagram reads "Avatar = Product + Angle".
- **Fit for this project.**
  - **Format.** It is a different format from ours, and most of it is off-limits for us. Fake testimonials ("my best friend told me about dutasteride") from invented people, for health products, are deceptive advertising. YouTube also requires disclosure of realistic synthetic people. Building a "new person" from a real creator's TikTok frame starts from someone else's image and likeness without consent. "Change the eye colour" is his guidance, not legal advice.
  - **The parts that transfer** are rules about generation, not people: put grain, texture and imperfection into the still before animating; never send blown highlights to a depth or video model; make all edits in one pass; lock a prompt template and vary one slot; budget effort toward the reference; test capital-letter emphasis on our TTS.

#### Visual watch additions (2026-10-21, minutes 8 to 31)

Segments 2 to 4 ran on gemini-3.5-flash-lite, which is thinner and less reliable than the Flash models. Its 16:00 segment also degenerated into a long invented list of app names, so only items that match the speech are kept here.

- **Where the reference frames come from.** The screen shows a Pinterest search for "ugc man" (the source he now rejects), then TikTok searches for "ugc" with real creators' example videos ("UGC example for a fitness product", "MOST PEOPLE HYDRATE COMPLETELY WRONG", a skincare edition). He exports a still from one in Premiere with **Shift+E** (Export Frame, PNG) and files them as `HL_Middle aged 01.png`, `HL_Middle aged 02.png` (HL = hair loss) and `Mic reference insert.png`. This confirms the likeness problem noted above: the starting point is a frame of an identifiable real creator.
- **His realism formula, as a slide:** "Avoiding the Uncanny Valley" = Real photo + Real human + Real iPhone, with close-up insets of pores, eye area and nose-and-mouth imperfections.
- **The avatar steps are numbered cards:** 1 "Change the avatar!", 2 "Background", 3 "Accessories", 4 "Logic of audio", then "ONE-SHOT the PROMPT", then PART 1 "Set the scene", PART 2 "Avatar dialogue", PART 3 "Fixed rules". The effort pie chart reads 50% reference image, 25% prompt, 25% dialogue.
- **Kie's Gemini Omni has three model types:** Omni Audio (a voice from `audio_id`, `name` and a free-text `voice_description`), Omni Character, and Omni Video (prompt, up to 5 `image_urls`, `audio_ids`, `video_list`). So the voice is designed once and reused by id across clips, which is how his avatars keep one voice. Kie's pricing table is in credits per resolution (4K 125, 2K 84, 1K 50, 480p 33 without video input, more with it); Gemini's dollar readings of it are garbled, so check Kie's page before quoting a price.
- **The emphasis test on screen** is a caption that moves the capitals: "I cannot STRESS how IMPORTANT intonation is", then "...intonation IS". He cut the intonation segment for a later video. A "PRO TIP: NONSENSE DIALOGUE" card confirms the padding trick.
- **His graphics:** a teal pie chart on a cyan glow with a dark vignette, bold white captions with yellow highlighted words, and numbered cards on green gradients.

### "How to Make Viral Motion Graphics With AI With $0 (Turned it into a Skill)" (15.8 min, Jad M.H | AI Automation, 242K views)

Jad made three Claude motion-graphics videos to test what the viral "one prompt, one shot" claims really take. The third, "One Conversation", is a short story film with 375 sound effects. He packaged the setup as a free Claude skill on his Skool community (the skill is not public on GitHub).

- **The "one prompt" myth, with numbers.** Thariq (Anthropic, Claude Code) replied to one viral claim that it took "10k characters ... plus skills, examples and API keys". Donald Jewkes' 3.9M-view "P(DOOM)" music video prompt is 9,608 characters. An X article by Movez says "the prompt is 10% of the video, the setup is the other 90%". Jad's own prompts grew with quality: 1,397, 8,137 and 9,664 characters.
- **How it renders.** Claude writes a web page that knows each frame. A headless browser screenshots every frame and FFmpeg joins them (`ffmpeg -framerate 60 -i frames/frame%04d.png -c:v libx264 ...`). That is 960 frames for 16 s at 60 fps. He uses **HyperFrames** so Claude starts from a working setup instead of building from scratch.
- **Video 1, simple.** The viral Stephan Livera showreel sentence ("make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out.") plus a few lines on the look: soft pastel daylight, film grain, Instrument Serif with IBM Plex Mono labels, one electric-violet accent. He got 16 s at 60 fps with seven labelled techniques. It is silent, and it looks like everyone else's because everyone uses the same sentence.
- **Video 2, music and sound for $0.** Claude was told it is songwriter, animator and sound designer. It wrote an original song, generated **12 versions with ACE-Step 1.5** locally (MacBook Air, 16 GB RAM; he says the model needs about 11 GB of disk), checked each, and synced each lyric to the word it is sung on. Where the transcription heard different words, it matched syllables in order. Every SFX (whooshes, impacts, a riser into the drop, sparkles) was synthesized in code; none was downloaded. **The ban list:** he told Claude every colour, font and effect it may not use, including the defaults and the looks from his earlier videos. Without a ban, it falls back to centred text with everything fading in.
- **Video 3, a crew and a story.** The prompt opens with "you're a director, writer, animator, composer, sound designer and render engineer". It gives a story instead of a task: 2 a.m., a creator with a big idea and no team. **The critique loop:** after each round Claude screenshots the middle of every shot onto one contact-sheet page. It grades each shot 1 to 10 on story, composition, motion, typography and music sync, writes down the three worst problems, fixes them, and repeats until every shot scores 8 or more. He cites Mapel Joseph's watercolour short: 163 model calls, almost 7 hours.
- **His verdict.** The videos still need a human to decide the story, the feel, and what is good versus mid. Free local voice models can add narration.
- **What the screen adds (Gemini).**
  - **The Video 2 and Video 3 prompts are legible.** Both open: "You are the director, [songwriter|writer], animator, [sound designer,] composer ... and render engineer for a [lyric music video|short story film] made entirely in code ... Work autonomously: do not ask me questions, make every decision yourself, say what you chose in one line, and keep going until a finished, verified MP4 exists." Each then has sections: "THE FILM IN ONE LINE", "THE SONG" (130 to 150 BPM, a hook repeated at least 3 times, `[intro] [verse] [chorus] [bridge] [outro]` tags) or "STORY (beat sheet - keep the arc, improve the details)", which opens "Hook (0-5 s): darkness, a single blinking cursor, '2:07 AM'".
  - **Disk and machine limits are in the prompt itself.** The music section reads "MUSIC - 100% FREE AND LOCAL", with a pinned local ACE-Step path, "Do NOT download other models (the disk has only ~10 GB free) and do not edit its code", plus a local bfloat16 patch for the Mac.
  - **The ban list, as shown:** "IT MUST LOOK DIFFERENT FROM THE OTHER VIDEOS", listing each earlier video's palette and fonts (for example cream, vermilion, cobalt and yellow with Archivo Black and JetBrains Mono, or soft pastel with Instrument Serif italic), then "DO NOT reuse any of those looks or techniques."
  - **The critique-loop line, verbatim:** "render a contact sheet at every shot's midpoint, score every shot 1-10 for story clarity, composition, motion fluidity, typography, sync with music and sound, and polish. Write down the 3 worst problems, fix them, and repeat until every score is 8+ (max 4 rounds)."
  - **The SFX are numpy, the same approach as ours.** `make_sfx.py` defines `whoosh` (an exponential sweep from 100 Hz to 5 kHz of band-passed noise through a state-variable filter), `impact` (a decaying sine sub), `riser` (a sweep from 180 Hz to 2.4 kHz) and `sparkle` (random tones between 3.2 and 9.5 kHz).
  - **Hardware and cost numbers.** The Mac is a MacBook Air M1 (2020) with 16 GB of RAM. ACE-Step made 12 takes. Its checkpoints folder was 33 GB on screen, against the 11 GB he says aloud, with the disk 99 percent full. The free voice model shown is **Kokoro-82M**. Mable Joseph's watercolour film stats were 62.7M tokens (96 percent cache reads), 163 model calls, about $34 at API list price, about 6.75 hours (1.5 hands-on) and a 12-minute laptop render.
  - **Video 3's look.** It is UI-themed: each crew role is a screen (document, palette with hex codes, easing-curve graph, piano roll, SFX grid, a 12-shot timeline of 68.5 s, a render grid). A mock "invoice" totals $11,500. Its fonts are Fraunces and IBM Plex Mono.
- **Fit for this project.** This is our stack, nearly one to one: HyperFrames, code-synthesized SFX, local everything. The new parts are a commercial-safe local music model, a ban list, the crew-plus-story framing and a scored contact-sheet critique loop.

### Repos and licences checked (jsDelivr, 2026-10-20)

| Name | Status |
|---|---|
| `ACE-Step/ACE-Step-1.5` | Verified. **MIT licence** for code. The README claims quality "between Suno v4.5 and Suno v5", under 4 GB VRAM, MPS/MLX/CPU support, LRC lyric timestamps, and LoRA training from about 8 songs. The XL (4B) variants need 12 GB or more of VRAM. Check each Hugging Face model card's licence before monetized use. |
| `heygen-com/hyperframes` | Verified (already in our stack) |
| Gemini Omni, Nano Banana Pro, Kie, Flux 3 | Hosted services named by Kristian, not repos. Not tested here. |

### What changes in our build

1. **Add ACE-Step 1.5 as the music stage, after a licence check.** The MIT code licence fits our rule against non-commercial models (unlike MusicGen). Confirm the weights' licence on the Hugging Face cards first. It needs no GPU at the 2B-turbo, LM-off tier, but CPU speed in this container is untested. Budget 11 to 33 GB of disk for checkpoints. Keep numpy synthesis for SFX and as the fallback score. Use its LRC output, or Parakeet, for lyric-to-word sync. Generate several takes and have Claude pick one, as Jad did with 12.
2. **Add a scored critique loop to the render step.** Render a mid-frame of every scene into one contact sheet (HyperFrames `snapshot` or frames from the MP4). Grade each scene 1 to 10 on story, composition, motion, typography and audio sync. Fix the three worst problems and repeat until every scene scores 8 or more, with a cap on rounds. This is the automated QA gate the blueprint was missing.
3. **Add a ban list to every style brief.** List the fonts, palettes and motions already used on the channel, plus Claude's defaults (centred text, fade-in on everything). This pairs with the `styles/` rotation and helps the inauthentic-content guardrail.
4. **Use the crew prompt for Shorts.** Open with roles (director, writer, animator, composer, sound designer, render engineer) and a story beat, not a feature list. Prompts of 8,000 to 10,000 characters are normal; keep reviewing the full brief first, as the user prefers.
5. **Test emphasis on our TTS.** Try CAPITALISED stress words on Kokoro and Gemini TTS. If capitals do nothing on Kokoro, use its own emphasis syntax or Gemini's style prompt. Add a script-linter note listing which words to stress.
6. **Prepare stills before any depth or video model.** Before Depth Anything parallax or any image-to-video step, check for blown highlights (clipped channels over N percent of the face or subject area means reject or re-grade). Add a little grain before animating, not only after. Make all edits to a still in one pass.
7. **Lock prompt templates and vary one slot.** For any generated clip, lock camera, look and rules first, then swap only the line or beat. Throw away a reference that keeps failing.
8. **No change:** no fake-person testimonials, no avatars made from scraped creator frames, and no realistic synthetic people without YouTube's altered-content disclosure.

## Added 2026-10-21: Dan Kieft's two Seedance realism guides

Reports: `out/2hJsvDSPWYM.md` and `out/Zo8KaTs0l6k.md`, both complete. Each ran as three 10-minute segments on gemini-3.5-flash-lite, after the Flash models had used up their daily free quota. Transcripts: `../transcripts/2hJsvDSPWYM-dan-kieft-seedance-full-guide.txt` and `../transcripts/Zo8KaTs0l6k-dan-kieft-seedance-ultra-realistic.txt`. Both videos are sponsored by Higgsfield and every demo runs inside it.

The same trust caveats apply. Flash-lite misspells model names ("Seedance 5.0 Pro" for Seedream 5.0 Pro, "Minimax HD Max" for MiniMax H3 Max), and its long prompt transcriptions contain small copying errors. The prompts below are its readings; Dan's free Skool community ("NextGen AI", 52.8K to 61.9K members on screen) has the originals.

### "How I Make Realistic AI Videos with Seedance 2.5 - Full Guide" (20.5 min, Dan Kieft)

From the transcript:

- **No single best image model.** He runs the same prompt through six image models and picks per shot, because "images are cheap". For realism he likes Flux 2.0 Pro (older but less plastic than Flux 3), GPT Image 2.5 Flare, Seedream 5.0 Pro and Nano Banana Pro or 2.1.
- **For video, Seedance 2.5 leads.** Flux 3 Video gets "80 or 90%" of it for much less. MiniMax H3 is weaker without references. Iterate in **Seedance 2.5 Draft at 480p** and pay once to upscale the keeper to 1080p, because low resolution can even help realism.
- **CTLT prompting:** Camera, Tone, Lighting, Texture, with an LLM template that writes the prompt from a one-line idea, plus "seven ways to capture an idea" (close skate camera, phone snapshot, intimate documentary, motion-blurred photo dump, low curbside, disposable camera, concealed observation). Imperfection on purpose: 1K resolution, compression and flash.
- **Contrast levels for viral stills:** level 0 is a subject where it belongs (a robot in a factory); level 1 puts it in an unexpected place (at a Tesla charger); level 2 adds unexpected styling (iced-out chain, middle finger); level 3 adds feeling (a dead robot in a flower field).
- **Camera techniques that read as human-filmed:** handheld shake, crash zoom, voyeuristic framing, whip pan, walking backwards, blocking the frame, exposure adjustment and focus hunting, ideally combined.

#### Visual watch additions

- **The CTLT template, as shown (11:23).** "Turn my idea into an image-generation prompt that feels like a real moment caught by a photographer. Use the CTLT structure in this exact order: Camera: photographic style, lens, shot size, viewpoint and framing. Keep the camera choices coherent. Tone: start with the mood, atmosphere and emotional energy. Then describe the subject, action and setting within the same paragraph. Lighting: light source, direction and quality, and how the light falls on the subject and surroundings. Texture: physical details, materials and surfaces, and how they interact with the environment. Include two or three visible qualities that support realism. Preserve my idea. Add only what helps the image; don't invent extra subjects, props or elaborate backstories. Use grain, flash, motion blur or imperfect framing only when they suit the scene and photographic style. Avoid generic claims like 'masterpiece' or '8K.' Don't add reference-image tags unless I supplied reference images. If I supplied references, preserve their actual @image1, @image2 labels and state what each reference contributes. Return one ready-to-paste prompt in four short paragraphs: Camera -> Tone -> Lighting -> Texture. Keep the subject, action and setting inside Tone, with no separate Scene paragraph. Do not include headings inside the prompt. Then add a brief Camera / Tone / Lighting / Texture breakdown. My idea: [PASTE YOUR IDEA]"
- **A filled example.** Camera: "Candid 35mm film photograph, 12mm fisheye lens, slightly elevated side view, full-body framing, crooked composition and slight motion blur." Tone: "Frantic, absurd and darkly comic, like an unexpected chase caught by a passerby." Lighting: "Harsh direct on-camera flash, hard shadows on the road, bright foreground and dark background." Texture: "Matte ivory bones, glossy marbled meat, visible fat, and uneven edges flapping with each stride, coarse dog fur, rough asphalt and visible film grain."
- **The seven style variants share one subject and change only the Camera and Lighting lines.** The subject is a mascot costume on a laundromat doorstep at night with fries. Examples: "close skate-camera" (knee height, 12mm fisheye, crooked horizon, harsh flash), "low curbside" (28mm, curb level, looking up), "concealed observation" (through a dirty car window, wing mirror at the frame edge) and a "low-quality camcorder" frame ("4:3 boxy aspect ratio ... poor dynamic range ... Heavy blocky MPEG compression, jagged edges, smeared green-brown colours, chroma noise and interlaced movement artifacts"). This is a style registry: one locked subject, swappable camera presets.
- **Reference prompts guard against extra limbs:** "He has exactly TWO short legs and TWO arms ... his silhouette has no spare limbs, duplicated boot or detached robot part", plus "No collage. Reference sheet panels, text overlay, date stamp".
- **The video prompt is a tagged block (18:00):** `[Generation Goal]`, `[Reference Asset Items]` (Asset 1 = identity and outfit only, Asset 2 = the robot, Asset 3 = the voice), `[Subjects and Relationships]`, `[Event Script]`, `[Camera and Sound]` and `[Maintain Consistency]`. The goal line bans fake-camera overlays: "No camcorder overlay, no metadata, timestamp, battery icon, face brackets, viewfinder grid, border or subtitles. The recording device stays outside its own field of view." The consistency line forbids a substitute move: "Never replace this ... with a stationary lens-zoom on a smooth tracking camera." The monkey-compilation prompt uses the same tags with timed shots (`[SHOT 0-1.5s]` up to `[SHOT 9-10s]`) plus `[CONTINUITY]`, `[RHYTHM]`, `[VISUAL STYLE]`, `[AUDIO]` and `[EXCLUSIONS]`.
- **Prices on screen, in Higgsfield credits:** images per 2K generation are Soul 2.0 0.125, Flux 2.0 Pro 1 (1080p), Seedream 5.0 Pro 2.5, GPT Image 2.5 Flare 2.75, Flux 3 3, Nano Banana 2.1 3 (4K). A 5 s, 16:9 Seedance 2.5 Draft at 480p costs **15 credits**, and upscaling a kept draft to 1080p costs **120**. So drafting costs about an eighth of a final render.
- **The workflow cork board:** "CTRL PROMPT", "CAMERA FIRST", "SPEAK IDEA", "SWAP LENS", "START SIMPLE", "BUILD CONTRAST".

### "How I Make Ultra Realistic AI Videos using Seedance 2.5" (22.7 min, Dan Kieft)

From the transcript:

- **Realism is imperfection.** The uncanny valley comes from images that are too polished. Higgsfield Soul (Soul Cinema) gives faces with bags, wrinkles and uneven hairlines. GPT Image 2 is now recognisably "too noisy", and quality drops a little with each image-to-video hop.
- **Make a character sheet first** (he now uses Seedream 5.0 Pro at 2K, 16:9), and remove small details such as a little hat that the video model would smear or change.
- **Then the start frame:** "image 1 is used for his identity", plus "do not recast, do not beautify, do not use as an image background", plus lens lines (35 mm, f/1.8, shallow depth of field, fine film grain, muted desaturated grade).
- **Dialogue makes or breaks it.** Prompt like a director, stage by stage: the initial state, the primary event with the exact words, pauses and tone shifts, then the end state. For an accent, name the speaker and give the region, pace, energy and emotional state, then the exact line. Performance words go beat by beat. He has a 25-emotion prompt library site and a camera-movement site.
- **Camera grammar:** be explicit about focus (a rack focus with a trigger), movement (crash zoom, handheld, tracking, orbit) and angles (an establishing shot first, tight inserts, static wides to keep action readable, then escalation).
- **Sound:** separate diegetic and non-diegetic sound with different bracket symbols. Example: "a hard non-diegetic sub-bass hit that lands on the exact frame the light goes dark". Finish in Premiere: trim the AI slow-motion, add slow zooms (scale 100 to 120), add a little noise, blur the edges slightly, and add 10 to 15% cinema bars.

#### Visual watch additions

- **The portrait prompt (03:53)** is a casting card: "Medium close-up portrait of a weathered dockworker in his late forties; broad-shouldered white man with sun-creased, wind-burned skin, salt-and-pepper stubble, short cropped hair going gray at the temples, deep-set hazel eyes, a faint scar cutting through his left eyebrow ... Natural overcast daylight, soft and flat. Color palette: desaturated navy, slate gray, faded rust. Composition: chest-up, slightly low angle, shallow depth of field, 35mm lens. Medium documentary film grain, 16mm capture, lived-in realism. Mood: stoic, quietly tired, unbreakable."
- **The character-sheet prompt (04:31):** "Use the person from image 1. Keep their identity. Do not recast. Do not beautify. One image, three equal vertical panels, same width, same height, hard even splits ... Same background in every panel. Flat seamless studio grey #8B8B8B, even light, no gradient, no floor shadow ..." Panel 1 is the body from the front with the head cropped at the neck. Panel 2 is the full body from the back at the same scale ("Feet on the same baseline. Do not scale one body up or down to fill the panel"). Panel 3 is a face close-up. "No logos, No grain overlay."
- **The start-frame prompt (05:36)** ends with "35mm lens, f1.8, shallow depth of field, visible fine film grain, muted desaturated color grade, soft overcast key from frame left with cool water highlights", and directs the gaze: "Eyes on the barge, not into the lens. Mouth closed. Jaw set."
- **The dialogue prompt structure (08:31):** `[GOAL]` ("A single continuous one-take, fully handheld, immersive drama shot ... Duration: 30 seconds"), `[CONTINUITY]` (each subject's age, hair, clothes and state, which "never change across the sequence", the house layout, and props such as "the man's coat hangs on the same coat rack ... and is the one he puts on"), then `[STAGE 1 | 0-7s | Bedroom to living room, the apology]` with Initial state / Primary event / End state, and so on through STAGE 3.
- **The accent card (10:36):** "WHO: Clement: early 70s Black Jamaican man, short grey hair, lived-in face ... He is not performing. He is talking to the younger person behind him. We never see a camera body, a lens, a strap, or hands holding a camera." "ACCENT: Clement speaks English with an unhurried Kingston accent, natural, not exaggerated, not a comedy voice. When the shock hits, the voice jumps and the words get short."
- **Settings:** Seedance 2.5 at 1080p, High bitrate, up to 14 s per clip in that panel (the model card says up to 30 s), with a banner "Change to 480p/720p for Unlimited". Emotion categories are SUBTLE, EXPLOSIVE, TRIGGERED, ACTION and VISUAL, and the library includes Joy/Laughter, Shock, Terror, Rage, Disgust, Crying, Pain/Wince, Eye Roll, Suspicion, Flirtation, Smug/Gloating and Boredom, each with a "Copy prompt" button.
- **The Premiere finish, step by step:** Scale keyframes 100 to 110 for a slow zoom-out reveal and 100 to 120 to push in on an eye; the Noise effect at a low amount, shown as a "without grain / with grain" split; a slight edge blur; and crop-based cinema bars of 10 to 15% top and bottom.

### What changes in our build

1. **Adopt CTLT as the prompt format for every still**, whether a Gemini or Nano Banana image, an image a client supplies for parallax, or a reference sheet. Keep his "preserve my idea, no 8K or masterpiece" rules. A camera preset becomes a named, swappable slot in the style registry next to the ban list (skate fisheye, curbside 28mm, concealed observation, camcorder).
2. **Use the tagged block format for every generation brief, including our own HyperFrames scene briefs:** GOAL, CONTINUITY (identities, wardrobe, props, geography that "never change"), timed STAGE or SHOT blocks with initial state, event and end state, then CAMERA AND SOUND, EXCLUSIONS and MAINTAIN CONSISTENCY. It matches how we already brief frame workers and makes continuity explicit.
3. **Apply the human-camera vocabulary to code-rendered motion.** Handheld micro-shake, a crash zoom on a reveal, a whip pan between beats, a brief focus hunt and an exposure adjustment on a cut are all GSAP or Three.js camera moves. Used sparingly, they make explainers feel less like slideshows. His "blocking the frame" idea works as a foreground element that wipes past.
4. **Add the finishing pass to our master step:** trim dead slow-motion, a 100 to 110 or 120 percent slow scale on held shots, light grain (our overlay track already does this), a slight edge softening, and optional letterbox bars for a cinematic register.
5. **If a paid generation is ever approved, draft cheap first.** Seedance Draft at 480p costs 15 credits against 120 for the 1080p upscale; generate several stills from different models first and animate only the winner. This is the same "stills first" rule as Massimo Seq's.
6. **Use the character sheet for a channel mascot only** (Frizzy's legitimate use case above). The three panels on #8B8B8B, scale-locked, are a good brief for a consistent original character, for example in Three.js or a 2D rig. **No change** to our rules on realistic synthetic people: Dan's subjects are absurd fiction (monkeys, skeletons, robots), but his realism techniques are exactly what makes synthetic people pass as real, so YouTube's altered-content disclosure still applies to anything realistic.
