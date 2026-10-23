# Direction Addendum: What to Start With, From 18 Videos

Companion to `youtube-automation-blueprint.md`. Adds the five videos sent on 2026-10-19 (Calum Johnson Show with KJ, Jake Trinder, Paddy Galloway at Open Residency, Taro Creates, Futurepedia) and turns the whole set into a starting direction plus the rules the pipeline should encode.

---

## 1. What the five new videos add

| Video | What it adds | Weight |
|---|---|---|
| Paddy Galloway, 2-hour masterclass (Open Residency, 301K views) | The strategy layer the tutorials lack: idea ceiling before filming, the three viewers (core, casual, new), outlier mining at 3x channel average over 365 days, 100 ideas to 10 to 1, ten titles and three thumbnails per video, the 45-second intro, "storytelling is useless without stakes", a pre-publish prediction with a panic rule, and "the only two metrics": views and the retention curve. Also his honest AI note: ideation and thumbnails yes, "writing good content" still 80% then human. | Highest. Encode nearly all of it. |
| Jake Trinder interview (guest runs 100+ channels incl. Gary Vee) | The validation layer: demand floor and ceiling per topic from existing data, stage gates with hard stops, cross-niche pattern transfer with a written "why it works", the four-P hook (promise, proof, plan, persona), time-to-value over open loops for educational audiences, blow-up signals that are not CTR, and a post-mortem per upload. The Gary Vee case: 10-20K to 300K then 700K from packaging alone. | Highest. Encode nearly all of it. |
| Calum Johnson Show with KJ | How to work with Claude so the build goes fast: the math-art slider (automate what has one right answer, keep humans on taste), the four-question spec before any prompt, level-2 workflows (one skill that runs the whole packaging research), batch corrections, show "what good looks like", judge by results not process. His own "Outlier Board" tool built on Vercel in ten minutes. | High for the build method. |
| Taro Creates, fully automated faceless editing | Live proof of the code-rendered route on TikTok: a 47-second karate explainer, fully animated with 3D camera moves, from one detailed prompt in the Claude desktop app, no image or video model, about $4 to $10 of usage per video, 45-minute render. Nych AI for transcript pull and cheap ElevenLabs voices through an MCP connector. TikTok Creator Rewards pays on videos over one minute; students report RPM of $4 to $6 in tight niches. Niches shown: boxing and karate technique, home construction logic, chess. | High. Confirms the format and the niches. |
| Futurepedia, "a new kind of video" | Plain per-frame JavaScript with no framework, 86-style atlas where each prompt embeds the code of its sample, so Sonnet matches Opus and styles stay consistent; storyboard first, then render; voice-over sync from an SRT; "turn your custom style into a skill". Gemini Flash TTS from AI Studio as a free voice option. | Medium-high. Confirms consistency comes from code in the prompt. |

What the five do not change: the headless architecture, the policy guardrails, and the cost model in the blueprint all hold.

---

## 2. The convergence across all 18 videos

Four things show up independently in enough places to treat as settled.

1. **Code-rendered motion graphics are the format to start with.** Danny Why, Chronixel, Taro, Futurepedia, Zinho's reviewer and Jason all land there. It is the cheapest per video, the most consistent, the least exposed to the inauthentic-content rule (a camera journey with narrative is not a slideshow), and it needs no presenter. Generated clips and avatars are add-ons for later.
2. **Packaging is half the game and it is mostly "math".** Paddy's 20% better thumbnail, 40x views; Trinder's Gary Vee case; KJ's slider. Titles, outlier research, thumbnail variants and A/B testing are all automatable. The one taste call left is which of three thumbnails to lead with, and native A/B testing removes even that.
3. **Validate with data before building anything.** TubeLab's Outliers Finder, Paddy's outlier mining, Trinder's floor and ceiling, KJ's outlier ratio tool. Nobody successful picks a niche by feel.
4. **Shorts first, then long-form on the proven narrative.** Taro validates on TikTok and Shorts; Trinder's rule is to mine your own off-platform outliers for the first long-form; Danny Why's Step 3 is a Short and Step 4 is the 10-minute version of the same template. Fast feedback at $1 to $4 per test.

---

## 3. Recommended starting direction

**Format:** 45 to 75 second "mechanism explainers" rendered from code (HyperFrames or Remotion, Danny Why's camera rules, Futurepedia-style embedded-code prompts), posted to YouTube Shorts and TikTok. One narrator, one locked visual style, one accent color. When a Short reaches roughly 5x the channel median, the same template produces the 8 to 12 minute long-form with `facts.md` sourcing, per Danny Why's Step 4.

**Why this format:** it is the intersection of everything above. It is "math" for the AI (facts, mechanisms, diagrams), it passes the educational-value bar, it costs almost nothing to test, and three of the creators show it working on screen.

**Niche candidates, with the evidence behind each:**

| Candidate | Evidence from the videos | Older-audience product fit | Risk |
|---|---|---|---|
| A. How things in your home actually work (plumbing, electrical, heating, why a water heater fails, outhouse to toilet logic) | Taro shows a construction-logic page monetized on >1 min videos; TubeLab's over-55 audience and its $47 "home savings" product thesis; Paddy: "teach someone how to unclog a drain and you'll be fine" | Strong: a $27 to $47 home-maintenance guide | Crowded in how-to; the mechanism angle, not the tutorial angle, is the gap |
| B. Sports technique mechanics (why a jab lands first, why karate turns the hip) | Taro's live demo and his students' pages at $4 to $6 RPM; low competition at this editing quality | Weak for 55+; strong for TikTok rewards | Audience skews young, lower long-form RPM |
| C. Body and brain science (what a thought is made of, why you yawn) | Danny Why's demo and his claimed 18M views in 28 days on a hidden Shorts niche; Zinho's science style | Moderate: supplements and courses are YMYL-adjacent, avoid | Health adjacency; keep strictly mechanistic, never advice |

**Recommendation:** start with A. It is the only candidate that spans fast Shorts validation and the over-55 long-form audience with a product behind it, and it is the lowest policy risk. Run B in parallel only if you want a pure Creator-Rewards play.

**Validation before committing (one day of pipeline work, once TubeLab and YouTube API keys exist):**
1. Pull every outlier at 3x or more over 365 days in the candidate niche and two comparable-intent niches (Paddy, Trinder).
2. Compute floor and ceiling per topic cluster; drop clusters whose floor is under the view target (Trinder).
3. Score each surviving idea with the gate: one-sentence log line, thumbnail concept, CCN fit, outlier evidence (Paddy).
4. Ship ten Shorts over two weeks, three thumbnails each, log predictions, apply the panic rule, post-mortem each (Paddy, Trinder).
5. The first Short at 5x median becomes the first long-form.

---

## 4. Rules to encode (merged from the three strategy reports)

**Research and idea selection**
- Outlier miner: videos at 3x or more their channel's average (5x, 10x, 20x bands), niche plus comparable-intent niches, 365 days (two years when cold-starting). Diff each outlier against that channel's median video to isolate the packaging delta. Verify organic traffic: comments proportional to views, graph shape.
- Demand gate: log floor (median views of good videos on the topic) and ceiling (best push). Reject if the floor misses the target.
- Idea gate: must state as a one-sentence log line and a thumbnail concept; pass 3 of 5 (feasible, packageable, CCN fit, meets view target, outlier evidence).
- Funnel: 100 ideas per published video to about 10 one-page idea slides to 1. Auto-flag criteria as too loose if more than 30 survive, too strict if fewer than 3.
- Topic mix: 80% of videos share roughly 80% audience overlap with the throughline, at most 20% experiments, at most 20% "innovation" combos.
- Cross-niche transfer requires a written "why the psychology transfers" note stored with the pattern. Keep the swipe file (outlier, title, thumbnail, intro, retention) as a database the research job appends to.

**Packaging**
- Order: 10 titles first, then a thumbnail brief of 5 concepts, then at least 3 differentiated thumbnails. Budget 10 to 20% of pipeline effort here.
- Title linter: under 60 characters soft limit, Title Case, no jargon or regional terms, complements rather than repeats thumbnail text, scored on the ladder (story, superlative, contradiction), never optimized for SEO.
- Thumbnail constraints: fewest elements, one asset that visualizes the viewer's desired outcome, "pause and action" look, curiosity gap that forces reading the title, change at most 20% of a recognizable style at a time.
- Proven shift-format families to test early: "The new rules of X in [year]", "X is about to change forever", "Give me N minutes and I'll make you Y", "Learn 97% of X".

**Script**
- Intro at most 45 seconds (Shorts: 3 seconds): reaffirm the promise visually in the first 10 seconds, open at least two curiosity hooks with minimal context, end with a connecting sentence into beat one. Ban closure phrases like "at the end of the day" anywhere in the script.
- Four-P hook check for educational long-form: promise, proof, plan, persona present in the first 60 seconds.
- Time-to-value: first concrete value immediately after the hook; no open-loop teases for educational audiences; value density maintained; animate only when a graphic beats text.
- Stakes check: every script declares one stake type (enemy, time, reward, punishment, cost of ignorance) matched to the content type.
- `facts.md` with a source per number, or the run holds.

**Publish and learn**
- Pre-publish prediction: expected views at 1 hour, 1 day, 1 week and an expected rank among the last 10 uploads. Publish with the single strongest title and 3 thumbnails in native A/B.
- Panic rule: judge against expectation, not the channel average. Three or more places below expectation after the first window: stop the test, swap all thumbnails, then titles. At or above expectation: do not touch.
- Blow-up score: views versus the channel's push curve, view-graph shape (steady climb or ladder is good, spike then flatline is bad), positive comments and likes per 1,000 views versus channel norm. Never CTR or retention alone.
- Change triggers: thumbnail swap only on below-average views and low browse CTR together; post-publish trim only on a sharp mid-video retention cliff.
- Post-mortem record per upload: bottleneck label (topic, title format, content), drivers kept, one new test. For winners, an automatic "what held it back" sequel with the same psychology reframed.
- Analytics loop reads only views and retention drop points. Drop-point locations are stable across audiences, so fix moments, not levels.

**Build method (KJ)**
- Write the four-question spec (why, magic wand, what is broken, exact outputs) before the first prompt.
- Split every stage on the math-art slider; automate math, keep a human sign-off only where taste is the deliverable, and let A/B tests replace the sign-off where possible.
- Build the packaging research as one level-2 skill and iterate it about ten times with examples.
- Batch corrections into one message, show reference examples, tell Claude why each step exists.
- Ship the internal tools (Outlier Board on Vercel) and use them daily so friction surfaces.

---

## 5. Side notes answered

**Reverse Engineer Anything on Adobe and Higgsfield.** REA (github.com/morluto/rea, MIT) covers websites through a browser and binaries through Ghidra, Hopper or IDA. Adobe's General Terms section 17(B) prohibit reverse engineering "including monitoring or tracking the inputs and outputs flowing through a system", and 6.18 bans scraping, so using it on Creative Cloud risks the account. Higgsfield is a web wrapper around third-party models with nothing to decompile; Sirio reconstructed its workflow by reasoning, and Nick Saraev found plain Claude Code matched REA on a desktop app. Recommendation: do not use REA on either. Have Claude Code rebuild the specific workflow (scene router, easing library, After Effects-style presets) from public docs and observed output.

**Watching every linked video for visual context.** The Watch skill in Gemini mode sends YouTube URLs straight to Google, so nothing is downloaded. It needs a Google AI Studio key, absent here. A batch runner for all 19 links is at `/tmp/claude-0/-home-user-SecretXperience/8460bcca-9a56-510a-bf0b-925d0f9090f3/scratchpad/watch/watch_all.py`, split into two tiers because the free tier allows 8 hours of video a day. Add a `GEMINI_API_KEY` environment secret and I run both tiers and fold the on-screen details (prompts shown, UI steps, visual styles) back into the blueprint.

---

## 6. Keys the pipeline needs, in order of when they unblock work

| Key | Unblocks | Tier |
|---|---|---|
| GEMINI_API_KEY (AI Studio, free) | Watch runs over all 19 videos; retention-drop analysis; free TTS option | Now |
| TUBELAB_API_KEY (paid plan) | Outlier miner, niche validation, transcripts | Validation day |
| YouTube OAuth client (Data API, free) | Upload, thumbnails, analytics loop | First publish |
| ELEVENLABS_API_KEY | Narration with word timestamps | First render |
| FAL_KEY or Higgsfield | Cut-out images, optional clips | First render |
