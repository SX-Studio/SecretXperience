# Meta Muse / YouTube Automation: Context Handoff

Read this first. It is the durable record of the "Meta Muse" chat (Claude Code session
`session_0191G7W6ffCUp2Jjq6gRDEYp`, 2026-10-19) and the follow-up review session. That chat's
container was reclaimed, so everything it produced was rebuilt from its transcript and saved here.

## Files in this folder

| File | What it is |
|---|---|
| `meta-muse-arbitrage-report.md` | Report 1: Muse capabilities, terms, automation architecture, ranked arbitrage plays, unconventional ideas 1 to 9, sources |
| `meta-muse-part2-full-automation-and-ideas.md` | Report 2: the "Courier" pattern for near-full automation, ideas 10 to 20 explained |
| `youtube-automation-blueprint.md` | Pipeline blueprint built from the first 13 videos: stages 0 to 7, guardrails, cost per video, stack, build order |
| `youtube-direction-addendum.md` | Direction from all 18 videos: recommended format and niche, merged rule set, keys needed |
| `strategy-paddy-galloway.md` | Rules extracted from Paddy Galloway's 2-hour masterclass (idea gate, outlier miner, packaging, panic rule) |
| `strategy-jake-trinder.md` | Rules from the Jake Trinder interview (demand floor/ceiling, 4P hook, blow-up score, post-mortems) |
| `strategy-calum-johnson-kj.md` | Tactics from KJ on the Calum Johnson Show (math-vs-art slider, level-2 workflows, tool-spec method) |
| `watch/watch_all.py` | Batch "watch" runner: Gemini video understanding over each YouTube URL, standard library only |
| `watch/VISUAL-FINDINGS.md` | **Read second.** Synthesis of what the 15 tutorial videos show on screen, trust caveats, verified repo list, and the blueprint changes (already applied) |
| `transcripts/` | Plain-text transcripts of videos added after the first chat (earlier transcripts were lost with the old container; their content lives in the reports) |
| `watch/out/*.md` | Visual-context reports, one per video (on-screen tools, verbatim prompts, UI steps, visual style, numbers) |

## The conversation, in order

1. **"Do you know about meta muse?"** Muse is Meta's personal AI agent, launched 2026-09-08 (Small Business 2026-09-29). Runs on Muse Spark, sandboxed in a per-user "Muse Secure VM", asks approval before money or messages, US/Canada only, plans Free / $20 / $100.
2. **Make money with it, arbitrage, fully automate with Claude, plus unconventional and "brilliant" ideas.** Report 1. Key finding: no verified earnings anywhere. Muse has no inbound API but can connect outbound to any hosted MCP server and run recurring tasks. Best plays: local resale arbitrage, consignment as a service, local lead arbitrage, "Muse SEO" audits for Shopify stores. Do not automate ticket resale, Upwork bidding, Amazon buying, or anything on "Always allow".
3. **"More unconventional ideas, bridge complete automation."** Report 2. The Courier pattern: Muse becomes transport only; every message comes verbatim from a `compose_reply` tool on your server where Claude drafts and code-level policy gates (no address, no phone, floor price, AI disclosure). Spending capped by a virtual card. Nightly Claude audit digest is the oversight Meta's terms require. Standout ideas: MCP storefronts for local businesses (and publish SecretXperience as an MCP server), parallel dealer bidding, claims filing, local used-goods price index, zombie-subscription audits. **User: "Good ideas, let me think about those." Parked.**
4. **Greg Isenberg, "Meta Muse Will Create 1,000 Millionaires" (tpZOU1ugODQ).** Worth watching as framing, no evidence. Keepers: build the niche Facebook group/page before you need it ("agent SEO"); Bland AI gives Muse a phone number ($29.99/mo). His plan/model names were wrong (Muse Wonder tiers belong to Muse Code).
5. **Pivot: complete YouTube automation**, research through AI generation/editing to posting. TubeLab's video is the foundation. 13 videos transcribed. Produced the blueprint.
6. **Five more videos for direction**, plus two side notes: use Reverse Engineer Anything on Adobe/Higgsfield (answer: no, Adobe terms section 17(B) forbid it and Higgsfield has nothing to decompile; rebuild the workflows from public docs instead), and watch every video for visual context (answer: Gemini batch runner, needs a key). Produced the addendum.
7. **Gemini key.** Added as a cloud-environment network secret on `generativelanguage.googleapis.com` injecting `x-goog-api-key`. Confirmed working in the review session.
8. **Review session (2026-10-19/20):** user asked to watch all videos for visuals, then **"Skip the interview videos, no need."** All 15 tutorial/demo videos were watched with Gemini; results in `watch/`. User switched this session to Opus to save Fable usage and asked to gather as much context as possible for a later Fable session.

## Decisions still open (the user's call)

- **Niche.** Recommended: "how things in your home actually work" mechanism explainers (Shorts first, over-55 long-form audience, $27 to $47 guide). Alternative: sports technique mechanics.
- **Presenter.** AI avatar, motion graphics only, or the user's own face.
- **Muse plays.** Whether to pursue any alongside YouTube.

## Recommended start (from the addendum)

45 to 75 second code-rendered mechanism explainers (HyperFrames or Remotion), Shorts and TikTok first; promote any Short at 5x channel median into an 8 to 12 minute long-form. Week 1: project folder (`resources/`, `presets/`, `skills/`), style bible, Danny Why prompt chain end to end for one Short, upload by API, fully unattended. Week 2: TubeLab research job, topic queue, long-form mode with `facts.md`, QA gates. Week 3: analytics learning loop, policy score.

## Keys

| Key | Status | Unblocks |
|---|---|---|
| Gemini (network secret, `x-goog-api-key`) | **Live** | Watch runs, retention analysis, free TTS (`gemini-3.8-flash-tts` tested OK). Free tier: about 20 requests per model per day |
| TubeLab API key | Not yet | Outlier miner, niche validation |
| YouTube OAuth client | Not yet | Upload, thumbnails, analytics |
| ElevenLabs API key | Not yet | Narration with word timestamps |
| fal.ai or Higgsfield | Not yet | Images, optional clips |

## Every video link the user sent

Tier 1, watched for visuals:

| ID | Title |
|---|---|
| W7L2rZVyYmY | TubeLab, Exposing The New YouTube Automation Goldrush (the foundation) |
| sGt1ACELN4k | Jason Cooperson, I Finally Solved AI Video Editing |
| EChXCPolIDQ | Zinho Automates, Build ANY Faceless YouTube Channel with Claude |
| WqXULg6uR30 | Danny Why, Claude Literally Just Changed YouTube Forever |
| oWkUwno6b0E | Chronixel, Claude + Remotion tutorial |
| yptFP52LEJU | Taro Creates, Fully Automated Editing for Faceless Videos |
| Ge1B-Ok1Pfk | Futurepedia, Claude Makes a New Kind of Video |
| d6spCMcfkew | Sirio, Dear Higgsfield, I reverse engineered you |
| qSuCPooR3E4 | Brad Bonanno, How I Watch ANY Video with AI |
| 1TuS9ImqV4g | Nuno Tavares, Claude Code CLI connectors |
| Ug3x37N6Z_E | Dubibubi, Army of Haiku 5.5 subagents vs Opus 5.5 |
| dAzs_rU6080 | Nick Saraev, The viral GitHub repo that reverse engineers anything |
| kqn_mSjSWMs | The Next New Thing, GitHub's top repos |
| 1dlC0MVqzP0 | Deeplearn HQ short, Claude runs your YouTube channel |
| tpZOU1ugODQ | Greg Isenberg, Meta Muse will create 1,000 millionaires |

Added 2026-10-20, watched for visuals:

| ID | Title |
|---|---|
| -LNDXx__ZT0 | Higgsfield AI, Introducing Higgsfield Katana (Claude Motion), 78 s short |
| zkhLZUGIIfE | The_Frizzy1, I Replaced Higgsfield Genjutsu With My RTX 3060 (local character swap) |

Tier 2, interviews, skipped for visuals at the user's request (their transcripts were distilled into the `strategy-*.md` files, except Cole Gordon's, which only matters for the sales page):

| ID | Title |
|---|---|
| Yt_BULiimg4 | Calum Johnson Show with KJ, The Creator Who Mastered Claude |
| UVsIqkkPLYU | Jake Trinder, The Most Valuable YouTube Advice You'll Ever Hear |
| Z2uoA3bhJT0 | Open Residency, Paddy Galloway 2-hour masterclass |
| zyWSbm7qPhI | Cole Gordon, $150M of sales knowledge |

## Operational notes for the next session

- YouTube rate-limits this container's IP (HTTP 429) for yt-dlp downloads. What worked for transcripts: `yt-dlp --js-runtimes node --extractor-args "youtube:player_client=web_embedded,mweb;player_skip=webpage" --skip-download -j URL` to get caption URLs, then fetch the caption URL through `https://r.jina.ai/<url>`.
- Gemini accepts a YouTube URL directly as `file_data.file_uri`, so nothing is downloaded. Run `python3 -I research/meta-muse/watch/watch_all.py --ids <id>` to watch one more video.
- The agent proxy drops any request that sends no bytes for 30 seconds, so `watch_all.py` streams (`streamGenerateContent?alt=sse`), uses low thinking, and splits videos into 8-minute segments. It rotates models on daily-quota 429s and retries streams that end without `STOP`.
- GitHub pages outside this session's repo scope are blocked by the proxy; read public repos via `https://cdn.jsdelivr.net/gh/<owner>/<repo>/README.md`.
- Jason Cooperson's free starter prompt lives in his public artifact (claude.ai/artifact/BYH6Mcma5to3kt2KogkEzB, third-party content). Danny Why's prompt chain is a public Google Doc (id `1ggp5gSG1iKXMQqLz3OYJg7UhP2YAFiV7uGY-nwHvU7k`, export as txt). Both were sent to the user as files in the original chat.
