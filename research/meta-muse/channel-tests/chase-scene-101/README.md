# Channel tests: The Chase Scene 101 (@TheChaseScene101)

The user's test channel. At handover: 49 subscribers, animal-chase Shorts (mostly compilation-style), best Short about 1.8k views. Goal set by the user: **at least 50k views**. Direction set by the user (2026-10-21): **a new style of content, aimed at an older audience, educational.**

| # | Video | Style | Status | Views at 48 h | Notes |
|---|---|---|---|---|---|
| 01 | `01-cheetah-slows-down/` "Why the Fastest Animal on Earth Slows Down to Win", 78 s | "Field Journal × Telemetry": public-domain ink plates, hand-written notes, GPS data in signal red; calm British narration (Kokoro bm_george); ACE-Step score; sources on screen | Uploaded 2026-10-21 01:15 UTC (DyOpxltRKYY) | 1 (at 38 h) | Facts: Wilson et al. Nature 2013 & 2018, Hetem et al. Biology Letters 2013 |
| 02 | `02-falcon-fastest-chase/` "This Bird Dives at 242 MPH and Steers Like a Missile", 89 s | Same field journal **plus a "turbo" layer** for the younger chase-clip viewers: speed lines, stat slams, VS card, targeting reticle, a visible change every ~1.5 s, synthesized sound design (whooshes, wind, impacts); hook number lands in the first second | Uploaded 2026-10-21 09:32 UTC (tJepewhff2Q) | 0 (at 30 h) | Facts: Brighton et al. PNAS 2017; Mills et al. PLOS Comp Biol 2018; USFWS (324 pairs in 1975, delisted 1999); Guinness 242 mph |
| 03 | `03-pronghorn-ghost/` "Why Nothing in North America Can Catch This Animal", **29 s, loops** | **Rebuilt from competitor research** (`research/COMPETITOR-RESEARCH.md`): full-bleed public-domain NPS/USFWS photos, persistent top title banner, red arrow, stat slam, ghost cheetah, ~3 words/s narration, seamless loop, no end card | Not uploaded | — | Facts: NPS pronghorn pages; Guinness; Byers 1997 (debated, said as "scientists think") |
| 04 | `04-cheetah-head-still/` "At 61 MPH, a Cheetah's Head Barely Moves", **41 s** | **Voice recorded first, video cut to it; real CC BY slow-motion footage (Gregory Wilson, 1,200 fps) with OpenCV motion tracking driving every graphic** (head reticle, spine line, head-vs-hip trails, paw/tail rings, airborne freeze, inner-ear diagram); 3 s breathing ending with end title; reviewed by Gemini and every flag verified | Uploaded 2026-10-21 18:14 UTC (N6BZLG4J5uQ) | 0 (at 20 h) | Facts: Grohé et al. Sci. Rep. 2018; Cincinnati Zoo 2012 (61 mph); 11× head/hip ratio measured from the footage. Pipeline: `04-cheetah-head-still/PIPELINE.md` |

Record after upload: views at 48 h and 7 days, "stayed to watch" % (viewed vs. swiped away), average % viewed, likes and comments. These numbers decide whether the series continues in this style. Next episodes are listed in `01-cheetah-slows-down/UPLOAD.md`. Episode 2 tests whether the turbo layer keeps the younger viewers without losing the older ones: compare its "stayed to watch" % with episode 1.

## Result and diagnosis (2026-10-22)

Studio on 2026-10-22 showed 49 subscribers and 69 views in 28 days. Episodes 01, 02 and 04 had 1, 0 and 0 views. The public RSS feed agrees.

**Zero views means YouTube showed the videos to almost no one.** A Shorts view counts every time a Short starts playing in the feed, so even 20 impressions would show as about 20 views. The videos weren't served, so we haven't yet learned anything about how good they are.

The channel's history (from the RSS feed, the Shorts tab and a Gemini check):
- Before this test there were 26 Shorts, uploaded 3–18 April 2026. Most got 0.3–2.5k views each and then levelled off.
- They were **clips cut from broadcast documentaries**. The top one, "Fossa Vs Lemur AT NIGHT", is BBC *Seven Worlds, One Planet*. The titles tagged them "#original".
- The channel was **silent for six months**. Then three videos in a completely different format went up within 17 hours.

Likely causes, most likely first:
1. **Channel standing.** A channel built on reused documentary footage often has copyright claims, a reused-content flag, or low trust, which limits how far new uploads are shown.
2. **Audience mismatch.** The viewers YouTube associates with this channel watch 10 s chase clips. It tests new Shorts on them first, and educational narration doesn't fit that profile.
3. **Cold restart.** Three uploads in one burst after six months of silence.

Checks in Studio:
- Content tab → Restrictions column on each video.
- Settings → Channel → Feature eligibility, which shows copyright and Community Guidelines strikes.
- Each video's Analytics → "Shown in feed".

**Decision:** stop testing the new format on this channel. Its history works against it, and a new channel costs nothing.
- Run the content test where every new post gets an initial audience: TikTok and Facebook Reels give one to any post.
- Start a fresh YouTube channel dedicated to the format.
