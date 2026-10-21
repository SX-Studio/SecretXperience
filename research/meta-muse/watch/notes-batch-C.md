# Batch C notes: Three.js motion graphics, Claude Code token hygiene, AI clipping with Syllaby

Researched 2026-10-20. Sources: yt-dlp metadata (title, channel, duration, views, description, chapters) and English auto-captions (`en-orig`, json3), flattened to text.
Transcripts:
- `research/meta-muse/transcripts/CCUSpJkAfgU-matt-penny-claude-threejs-3d-motion.txt`
- `research/meta-muse/transcripts/kHtOSJRUkLs-sharbel-claude-code-token-audit.txt`
- `research/meta-muse/transcripts/-PgsOwD4XZ8-austin-armstrong-ai-clipping-syllaby.txt`

**Visual watch: pending for all three.** `watch_all.py --ids` only runs ids that are already in its `VIDEOS` dict. These three are not, and the instructions said not to edit the runner, so Gemini did not watch them. On-screen prompts in video 1 and the slash command in video 2 are therefore missing; each gap is marked below. When someone adds these ids to the runner, run: `python3 -I watch_all.py --ids=CCUSpJkAfgU,kHtOSJRUkLs,-PgsOwD4XZ8 --workers 1` (durations: 739, 1187, 808 s).

Caption mis-hearings, corrected here: "3.js" means Three.js. "Sonic 5.5" means Sonnet 5.5. "syllabi.io" and "Soul by" mean Syllaby. "small model like Opus 5.5" means "smart model". "chat.openai.com 6 Astra" is the ChatGPT model he names.

---

## 1. Claude + Three.js = Premium 3D Motion Graphics

- **Channel:** Matt Penny | Applied AI (27.8k subs)
- **Duration:** 12:19 (739 s)
- **Views / date:** 60,102 views, 956 likes; uploaded 2026-10-15. That is about 2.2x his subscriber count in 5 days.
- **URL:** https://youtu.be/CCUSpJkAfgU
- **Description link:** only his paid community, "Applied AI Mastermind": https://go.its-applied-ai.com/go/v0wt2cb. No tools, repos or prompt text are in the description.
- **Chapters:** 0:00 Intro, 0:47 Prompt engineering for 3D, 2:50 Demo and analysis, 3:40 How it works, 5:08 Community (ad), 5:39 Cost breakdown, 6:42 Use cases, 8:35 Advanced tips.

### What it teaches
Claude writes an HTML page that uses Three.js and shaders. A headless browser renders it and takes about 60 screenshots a second, and those frames become an MP4. He says this is the same method as HyperFrames and Remotion, but he uses neither: "this is using neither, but it's using a very, very similar process". There are no image or video models and no After Effects. He calls it "virtually free".

Five demos are shown:
1. A glassmorphic scene: frosted glass panes with particles visible behind them, and a camera that flies between elements.
2. A vertical LLM explainer: metallic spheres, reflections on the floor, 3D camera angles.
3. A RAG explainer: a 3D vector space.
4. A gradient-descent / how-LLMs-learn piece: paper texture with a dot grid, in 3D.
5. A globe showing how messages travel over the internet. Geography is correct.

He says the motion graphics in the video itself were made this way.

### Prompt recipe (spoken; the full prompts are on screen only, so visual watch is pending)
- Script each scene: what happens, when it happens, and the timings.
- Say explicitly **"use Three.js"** and **"use shaders where appropriate"**. He says shaders give reflections, glows and particles.
- Ask for a **glassmorphic style** to get the premium look.
- Ask for **3D camera movement that moves the camera through the scenes and also moves the elements within the scenes**. He calls this the biggest quality jump: "not just a slideshow".
- Say **"make it look professional and sleek"**.
- His odd role prompt, verbatim: *"Pretend like this is your application to a motion graphics job role that you really want. Create a fantastic show reel."*
- With a smart model you can stay loose: "come up with a really good idea", or "come up with three ideas just in text format… I'll tell you which one to create".
- **Verification loop:** have it check its own output for overlapping elements and text that is too small before shipping.
- **Model:** he says Opus 5.5 is the best model from any provider for this, with a "noticeable difference" over Sonnet 5.5 and the ChatGPT model he calls "Astra 6". ChatGPT works but needs more guidance.
- Any aspect ratio works: vertical, square, horizontal.

### Numbers claimed
- One 15 s video used **37,000 tokens**. Opus 5.5 at **$20 per million output tokens** gives **$0.74** at API prices. The arithmetic is right.
- On a Claude subscription he estimates **about $0.05** per video, and **"400 of these videos every single week" on the cheapest Claude plan**. Credibility is low: plan limits are not published in tokens, and this depends on usage resets.
- For comparison, **Seedance 2.5** costs **about $0.10 per second** at the cheapest, so **$1.50 per 15 s**, and every revision costs that again. That price matches what other batches report for Seedance.

### Monetization
- **His own:** selling the "Applied AI Mastermind" (workflows and assets, with a "14-day money-back guarantee"; price not given). This is the real business behind the video.
- **Use cases he lists (services and content):**
  - Social and short-form motion graphics.
  - Overlays for podcast clips: members add 3D motion graphics to clips "so they do a little bit better".
  - A member who turns client video calls into social clips with overlays.
  - Explainers, product launches, and SaaS feature-launch videos.
- He anchors the value with "design studios used to charge thousands". There are no revenue numbers.

### Usable with our stack
**Directly usable, and the closest match to our stack in this batch.** We already have Three.js and HyperFrames, which ships a Three.js runtime adapter (`hyperframes-animation`) and a deterministic seek-safe renderer, so we do not need his ad-hoc screenshot loop. Add the five prompt rules to our motion-graphics briefs:
- Three.js plus shaders
- Glassmorphism
- Camera that moves through the scene, with elements moving too
- "Professional and sleek" plus the show-reel role line
- A verification pass for overlaps and minimum text size

`hyperframes check`/snapshot already covers the verification part. Depth Anything adds parallax from 2D images on top of this. Cost per video is only LLM tokens. No paid tools are needed.

### Red flags
- The video is a funnel for a paid community.
- "400 videos/week" and "$0.05" are his own estimates.
- The prompts are only on screen, so it is unclear how much hand-tuning went in.
- "Studios charge thousands" is an anchor, not evidence that this output sells for thousands.
- Low ToS risk: original code-generated visuals, no likeness or copyright issues.

---

## 2. Paste This Into Claude Code, Never Run Out Of Tokens Again

- **Channel:** Sharbel A. (46.1k subs)
- **Duration:** 19:47 (1187 s)
- **Views / date:** 336,920 views, 6,240 likes; uploaded 2026-08-19. That is about 7x his subscriber count.
- **URL:** https://youtu.be/kHtOSJRUkLs

### What it teaches
How Claude Code token use builds up, plus an audit prompt (given in full in the description, with no email gate). He opens with the claim that "0.01%" of his usage was what he typed and "96% of my spend was rereading history".

The fixes, in his order:
1. **`/clear` between unrelated jobs.** Run **`/rename`** first so **`/resume`** can bring the session back.
2. **Don't switch model, effort level or fast mode mid-session.** The model is part of the cache key, so a switch reprocesses the whole history at full price. His example: Opus 5 at 200k context, "a 10-cent turn into a 1-dollar turn".
   - Other things he says break the cache: connecting or disconnecting an MCP server when tools load up front, enabling a plugin that ships an MCP server, compacting, and upgrading Claude Code then resuming a long session ("the most expensive request you will send", which he attributes to Anthropic docs).
   - Things he says are safe: editing repo files, editing the memory file, changing output style or permission mode, invoking skills and commands, recaps, rewinds, spawning a subagent.
3. **Filter large tool output** with a PreToolUse hook that rewrites noisy commands. His example is an `install remotion` that dumps 800 lines. He says Anthropic ships a reference version: "from tens of thousands of tokens to hundreds".
4. **Turn off unused MCP servers.** He says the GitHub MCP costs about 26k tokens and Slack about 21k. Tool deferral cuts this about 85% and is on by default. The captions drop the slash command that opens the toggle panel (probably `/mcp`; visual watch pending). Check that `/context` shows tools as "deferred".
5. **Subagents move tokens rather than save them.**
   - His example: a subagent reads about 6k tokens of files and returns a 420-token summary, but burns about 9,800 tokens to save 5,700.
   - He cites Anthropic's multi-agent research post: agents use about 4x the tokens of chat, multi-agent systems about 15x.
   - Delegate only when the output is large, you won't need the detail again, and the session will run for many more turns.
   - Set the subagent model to **Haiku**, which he says is about 5x cheaper on the isolated work and doesn't touch the main cache.
6. **Pick the cheapest model that will finish the job at session start**, or set it per skill or per subagent.
7. **Scheduled-task trap:** every fire re-sends the full attached context.
   - He says the cache lasts 1 hour on a subscription. A task that fires less often than hourly misses the cache every time, at about 10x the cost.
   - So "if your task can run every 45 minutes instead of every hour or 2 hours, it is cheaper".
   - Background Claude Code is "under 4 cents a session" (attributed to Anthropic docs). Live agent teams keep using tokens until they exit.

**Myths he rejects:**
- Shorter prompts: a rounding error.
- Compacting to save tokens: backwards, because it re-sends everything and then wipes the cache. Use `/rewind` to step back a few turns.
- Screenshots instead of text: he says about 2,700 tokens per screenshot on Opus 5 and nearly 5,000 for 4K.
- PDFs: 1,500–3,000 tokens per page for the text, plus an image per page. Convert to .txt first, for about a quarter of the cost.

**Monitoring:**
- `/context`
- `/usage`, which names the skill, tool or agent that used tokens
- `/cost`
- The burn-rate meter
- Session JSONL logs, which record usage per reply

### Verbatim audit prompt (from the description)
```
Audit this setup for token waste. Do not fix anything. Report only.

Use your shell and file tools to measure each item. If you cannot invoke slash
commands yourself, ask me to run /context and /usage and paste the output, then
continue.

1. MEMORY
   Find every CLAUDE.md in scope: this project, parent directories, the user
   level one, and anything pulled in with @imports. Report each file's size in
   tokens. Flag any single file over 5k and any total over 10k.

2. TOOLS
   List connected MCP servers and how many tools each exposes. State plainly
   whether tool deferral is ACTIVE or NOT. Then check for a proxy or gateway
   (ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, any gateway variable) and say so
   loudly if you find one, because routing through a proxy silently turns
   deferral off and nothing warns you.

3. MODEL
   Report the current model and effort level and where each is set. Flag any
   mode that changes model automatically during a session, because every
   switch rebuilds the whole cache.

4. HOOKS
   List any PreToolUse hooks that rewrite noisy commands to produce less
   output. If there are none, say so, because unfiltered test and build output
   lands in context verbatim and is re-sent for the rest of the session.

5. SUBAGENTS
   List every agent file in the project and user agent directories. For each,
   report whether it sets an explicit model in frontmatter or inherits the
   main session's model.

6. SCHEDULED WORK
   List every cron, scheduled task and background job with its interval.
   Compare each interval against the prompt cache lifetime. Flag every one
   whose interval is longer, because those miss cache on every single fire.

7. CACHE
   Parse the newest session log under the projects directory. For every
   assistant turn, sum usage.cache_read_input_tokens,
   cache_creation_input_tokens, input_tokens and output_tokens. Report each as
   a percentage of the total. Also report the context size on the first turn
   and on the last turn.

Output one table, sorted by cost, highest first:

   FINDING | SEVERITY | EVIDENCE | WHAT IT IS COSTING ME

Severity is RED, AMBER or GREEN. Evidence is a number or a file path, never an
adjective.

Then one final line: the single highest-leverage change I should make. One
line, nothing else.

Rules: measure, do not estimate. Write UNKNOWN rather than guessing. Change no
file and no setting.
```

### Credibility
The mechanics are broadly right: prompt caching, cache keys tied to model and settings, cache reads at about 0.1x, tool deferral, and subagents having their own context.

Some details are loose:
- He says cache reads cost "1/10 of normal **output**". On the API it is 1/10 of base **input** price.
- The 1-hour subscription cache TTL, the 26k/21k MCP sizes, and the screenshot token counts are his figures. They may change with releases.
- The Anthropic multi-agent 4x/15x figures match Anthropic's published research-system post.

### Monetization
- **His:** YouTube channel growth (AdSense in the AI/dev-tools niche) and subscribers. A free prompt in the description is the lead magnet, with no email gate, which he points out on camera.
- **Not a money method in itself.** Its value to us:
  - **Unit cost:** our engine is Claude Code plus scheduled tasks.
  - **Niche evidence:** a token-saving explainer from a 46k channel reached 337k views. Claude Code how-to content is a hot, high-RPM tech niche.

### Usable with our stack
**Fully applicable as engine hygiene, and free.** Concretely:
- **Scheduled-task cadence:** fire each producer task more often than the cache TTL, or start a fresh minimal session per fire (`create_new_session_on_fire`) so no bloated context is re-sent.
- **Haiku for grunt subagents:** captions QA, metadata, file shuffling.
- **Fixed model and effort per session.**
- **A PreToolUse filter hook** for HyperFrames render, ffmpeg and pip/npm logs, which are exactly the "800-line" output he describes.
- **Fewer MCPs:** this session loads a very large MCP and plugin roster, so disable what the money engine doesn't use.
- **PDFs to text** before reading.
- **Run his audit prompt once on our setup**, in report-only mode.

The format itself (an AI tooling explainer with a free prompt in the description) also suits a faceless 3D explainer channel. See video 1.

### Red flags
- "Never run out of tokens again" is clickbait.
- The 0.01% and 96% figures are his own logs.
- No paid funnel. Low ToS risk.

---

## 3. How to make $3,000/mo clipping with AI

- **Channel:** Austin Armstrong (641k subs)
- **Duration:** 13:28 (808 s)
- **Views / date:** 19,039 views, 584 likes; uploaded 2026-10-12. That is low for a channel this size.
- **URL:** https://youtu.be/-PgsOwD4XZ8

**Description links:**
- Skool community "AI Mavericks": https://www.skool.com/aimavericks
- https://syllaby.io ("the first tool I'm using")
- https://chatgpt.com

**Disclosure:** Austin Armstrong is **CEO and co-founder of Syllaby**. Latka's 2026 founder profile puts it at about $130K MRR and 3,400 paying customers ([Latka interview](https://www.getlatka.com/companies/syllaby-inc/interviews/syllaby-inc-austin-armstrong-2026)). **The video does not disclose this.** It presents Syllaby as "the tool I'm using".

### What it teaches
A "clipping" pipeline that runs inside ChatGPT:
1. Connect the **Syllaby MCP**: ChatGPT Settings → Plugins → Browse directory → Add custom MCP server, label "Syllaby", and paste the MCP URL from Syllaby Settings → API access. Or search "Syllaby MCP" on Google.
2. In Syllaby → Publish → Connect accounts, link **"unlimited"** YouTube, TikTok, LinkedIn, Facebook, Instagram and Threads accounts. He says scheduling is included in every plan, and plans differ only in Seedance credits.
3. Paste the skill prompt below and add "turn this into a repeatable skill file". He calls it the "Austin Clipping" skill.
4. Put a long video in **Google Drive** and paste the link. His hack: ChatGPT downloads it on its back end, which gets around ChatGPT's upload size limit.
5. Prompt: *"use the /Austin Clipping skill to take this video file and turn it into as many vertical clips as possible that are under 60 seconds long."* Result: **19 clips from one podcast**, with opening hooks, punch-in zooms, captions, and **Seedance 2.5 AI B-roll** generated through Syllaby. He says Seedance 2.5 is so good "you can't even tell that it's real".
6. *"Schedule them to all of my social media, one per day… Write unique descriptions and hashtags for each one."*
7. Then: *"Now I want you to create five variations of each one of these clips. Make micro edits to each one. Swap out the B-roll of each one. And change the subtitle color of each one. **So each video doesn't get flagged or duplicate content.** When they're completed, schedule three per day to my TikTok, YouTube, Facebook page, and Instagram."*

Earlier in the overview he also lists "horizontally flip the video… **so you never get dinged with duplicate content issues**". The stated goal is "one video into a thousand variations" posted to "dozens of Facebook pages, dozens of Instagram accounts, dozens of TikTok accounts, dozens of YouTube accounts".

### Verbatim skill prompt (from the description)
```
Create a reusable skill called "Video Clipping and Editing" that uses the Syllaby MCP for AI B-roll and ChatGPT's available editing tools to create finished social videos.

1. Analyze the footage
Review the full uploaded video and transcribe it with timestamps. Identify strong hooks, useful moments, natural clipping points, and calls to action.

2. Plan clips and variations
 Create the requested number of standalone clips or variations. Make each meaningfully different through hook selection, pacing, natural trims, captions, zooms, and B-roll. Preserve the speaker's meaning and important context. Never cut off sentences or splice words to invent statements.

3. Generate B-roll with Syllaby.io MCP
Prefer Seedance 2.5, checking current settings and credit costs first. Generate one or two relevant vertical inserts per clip, then trim them to approximately 2–3 seconds. Use different footage across variations and mute generated audio beneath the original narration.

4. Edit using ChatGPT
 Use available video editing tools, such as FFmpeg, for clipping, assembly, jump cuts, purposeful zooms, synchronized captions, and B-roll placement. Preserve the original voice, music, and sound effects unless instructed otherwise. Handle existing burned-in captions cleanly.

5. Check quality
 Export vertical MP4 files unless another format is requested. Review every finished clip for intact speech, smooth cuts, readable captions, synchronized audio, and clean openings and endings.

6. Deliver finished files
 Share playable videos with a brief description of each variation. Include editable assets when practical and report generation credits when known.

Follow the user's instructions over defaults. Explain any unavailable tools or connections. Do not guarantee that variations will bypass duplicate detection. Schedule or publish only when requested.
```
His own prompt says "Do not guarantee that variations will bypass duplicate detection", which contradicts what he says on camera.

### Prices (syllaby.io/pricing, fetched 2026-10-20)
| Plan | Price | Credits/month | Notes |
|---|---|---|---|
| Starter | $9/mo | 100 | about 7 faceless videos; monthly only |
| Basic | $29/mo ($24.67 billed yearly) | 500 (1,000 yearly) | 1 voice clone |
| Standard | $78/mo ($66.33 billed yearly) | 1,500 (2,000 yearly) | 3 voice clones |
| Premium | $153/mo ($130.08 billed yearly) | 5,000 | 5 voice clones |
| Done For You | $699/mo | 5,000 | expert-run |

- Every plan includes bulk, unlimited scheduling.
- Credit costs: faceless video 13 per minute, avatar video 30–50 per minute, trending idea 15, AI script 1 per minute, 3 thumbnails per credit.
- "Text to Scene" (Seedance, Veo, Kling, Grok Imagine, MiniMax) is priced per second by model.
- Syllaby also runs an affiliate program (syllaby.firstpromoter.com).

### Numbers claimed
- **"$3,000/mo" appears only in the title.** The transcript never mentions income, a CPM, a campaign payout, or $3,000.
- Spoken figures are about volume and claims, not money:
  - His calendar shows 17, 10 and 19 posts per day, "about 150 original pieces of content every single week".
  - 19 clips from one podcast.
  - "analytics are blowing up. My leads are blowing up". Leads come through **ManyChat** auto-replies with a lead magnet on Instagram and Facebook.
- The anchor: entrepreneurs (Hormozi, Bartlett, Cody Sanchez, Gary V, Tate) "pay tens of thousands to hundreds of thousands" for clipping.
- **Credibility: low for income** (none shown). Volume is plausible.

### Monetization models present
1. **Your own brand → lead gen → your offer.** He uses ManyChat and sells his Skool community. This is the only model he actually demonstrates.
2. **Selling Syllaby.** He is its CEO. This is the real economics of the video.
3. The description says "Grow your own brand online, or clip others!", which implies **clipping campaigns** (creators paying per view) or clipping-as-a-service. Neither is explained in the video.

### Usable with our stack
The *legitimate* core is fully automatable without Syllaby or ChatGPT:
1. **Parakeet** word timings give the transcript.
2. An LLM picks hooks and clean sentence-bounded cuts. His rule "never cut off sentences or splice words to invent statements" is a good guardrail to copy.
3. **ffmpeg** handles the 9:16 cut and reframe.
4. **HyperFrames** adds captions, punch-in zooms and the hook title card.
5. B-roll comes from **HyperFrames/Three.js motion graphics** (video 1) instead of Seedance credits, at about $0 versus about $0.10/s.
6. Scheduling: the **`postiz` skill** in this session covers multi-platform scheduling, or we use the platform APIs.

Paid parts we would skip: Syllaby credits for Seedance B-roll, and the ChatGPT plan.

### Red flags (serious)
- **Undisclosed self-promotion:** the CEO presents his own product as a neutral tool.
- **Clickbait title income** ($3,000/mo) with no support at all in the content.
- **Explicit duplicate-detection evasion:** horizontal flips, swapped B-roll, subtitle color changes "so each video doesn't get flagged".
  - This is exactly what YouTube calls *reused / inauthentic / repetitious content*, which gets channels demonetized or removed from YPP.
  - TikTok and Meta likewise demote or penalize unoriginal reposts. Meta ran a 2025 crackdown on accounts that repost unoriginal content.
  - Running dozens of near-identical accounts also risks spam and fake-engagement enforcement and account linking.
- **Realistic AI B-roll** ("can't even tell that it's real") spliced into talking-head clips may need AI labels: YouTube's altered/synthetic disclosure, TikTok's AI-generated label, Meta's "AI info".
- Clipping *other people's* content needs their permission, through an official clipping campaign or a contract. The video does not address this.

---

## Batch C takeaways for the money engine (ranked by speed to first dollar)

1. **Sell premium 3D motion graphics as a service (days).** Make a 30–60 s showreel today with HyperFrames and Three.js using Penny's prompt rules: Three.js plus shaders, glassmorphism, a camera that moves through the scene with elements moving too, "professional and sleek", the "job application show reel" line, and an overlap/text-size check. Offer podcast-clip overlays, SaaS feature-launch videos and concept explainers to podcasters and startups. Marginal cost is LLM tokens only, against his Seedance comparison of $1.50 per 15 s.
2. **Clipping as a legitimate service or official campaigns (days to weeks).** Build the Austin-style pipeline locally: Parakeet → LLM hook and cut selection with the "never splice words to invent statements" rule → ffmpeg 9:16 → HyperFrames captions, zooms and motion-graphic B-roll → Postiz scheduling. Sell it to creators, or enter opt-in clipping campaigns. Use only content we are authorized to clip, one account per platform, and real edits rather than flip/recolor variants.
3. **Code-generated B-roll beats paid AI video for explainers.** Wherever a clip needs an insert, use HyperFrames, Three.js or Depth Anything parallax instead of Seedance credits. It costs about $0, revisions are free, and it carries no realistic-AI-disclosure ambiguity.
4. **Faceless 3D-explainer channel in the AI/dev-tools niche (weeks to months).** Sharbel's Claude Code token explainer reached 337k views on a 46k channel, and Penny's 3D explainers of LLMs, RAG and gradient descent are the visual style. Tech niches carry high RPM. Pair each video with a free paste-ready prompt in the description (no email gate) to grow subscribers, and keep a paid pack or community for later.
5. **Lead magnet → own offer is the shared real business model in this batch.** None of the three shows AdSense or clip income. Penny sells a mastermind, Armstrong sells Syllaby and a Skool group, and Sharbel grows his audience with a free prompt. Plan a digital product (prompt or skill packs, HyperFrames templates) plus a ManyChat-style DM keyword funnel early, because it monetizes before YPP.
6. **Cut engine unit cost now (free; it protects margin on every run):**
   - Scheduled producer tasks should fire more often than the cache TTL, or start fresh minimal sessions.
   - Haiku for grunt subagents.
   - Fix model and effort per session.
   - Add a PreToolUse hook that filters render, ffmpeg and npm logs.
   - Disable unused MCPs and plugins.
   - Convert PDFs to text.
   - Run Sharbel's audit prompt once, report-only.
7. **Do NOT copy the variant farm.** The flip, B-roll-swap and subtitle-recolor variants "so it doesn't get flagged", spread across dozens of accounts, are the fastest route to YPP rejection, demonetization and bans. Label realistic AI inserts where platforms require it.

Sources: [Latka founder interview (Syllaby / Austin Armstrong)](https://www.getlatka.com/companies/syllaby-inc/interviews/syllaby-inc-austin-armstrong-2026), [syllaby.io/pricing](https://syllaby.io/pricing), [syllaby.io/mcp](https://syllaby.io/mcp/).
