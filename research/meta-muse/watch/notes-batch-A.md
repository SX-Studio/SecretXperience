# Notes: Batch A (3 videos)

Date: 2026-10-20. Sources are yt-dlp metadata (title, channel, duration, views, description, chapters) and English auto-captions (json3, fetched through r.jina.ai, flattened). Transcripts are in `../transcripts/`:

- `t9MFvSJHLsI-aipreneur-claude-3d-motion-graphics.txt`
- `YLa0g-nMoWU-moe-alamawi-fal-mcp-replaces-higgsfield.txt`
- `ibr_NYgUKVY-kristian-jennings-music-techniques-ads.txt`

**Visual watch: not run, so all three are pending.** `watch_all.py --ids` only selects ids that are already in its `VIDEOS` dict, and it silently drops any others. None of these three ids is in that dict. The brief said not to edit the runner, so these notes come from captions and metadata only. The last `run.log` also shows every model at its daily free quota (429). On-screen detail is missing: the AIpreneur master prompt text, Moe's app UI, and Kristian's Premiere timeline. To watch them later, someone must add the three ids to `VIDEOS` (durations are 541 s, 453 s and 920 s) and run `--ids` again once quota resets.

**Update 2026-10-21: visual watch done** (one whole-video Gemini request each, `--segment 1200`; reports in `out/<id>.md`). What the screen adds is under "Visual watch additions" at the end of each video's section. Same trust caveats as `VISUAL-FINDINGS.md`: Gemini misreads model labels (it reports "Claude 3.5 Sonnet" here) and some names, so only details that fit the speech or are plainly on-screen text are used.

Auto-captions mangle a few names. In video 2, "VALL-E AI" and "Fal AI" are both **fal.ai** (the description links fal.ai), and "Cling" is **Kling**.

---

## 1. "I Made Insane 3D Motion Graphics With Claude (Free)" by AIpreneur

- **URL:** https://youtu.be/t9MFvSJHLsI
- **Length and reach:** 9:01 (541 s). Uploaded 2026-10-06. 50,884 views, 1,206 likes, about 400 comments. The channel has 33.2k subscribers.
- **Chapters:** 0:00 hard way vs this way · 0:47 master prompt · 1:13 pick topic · 1:52 script + beat table · 2:22 locking the style · 2:38 images in Google Flow · 3:47 images → motion · 5:18 voiceover · 6:25 CapCut edit · 8:14 result.

### What it teaches

It is a one-chat pipeline for a vertical "3D paper-collage motion graphics" explainer of about 60 seconds (11 scenes of about 6 s each). Claude plans the video, Google Flow generates images and then animates them, ElevenLabs voices it, and CapCut assembles it. You advance Claude through the stages by typing **"next"**.

1. **Master prompt** goes into a new Claude chat. Claude offers 5 viral topic ideas, or you write your own. Example topic: "Curiosity is not a hook. It's a hole in the brain."
2. **Script + beat table.** Claude writes 11 short lines grouped from hook to "closing truth". Each sentence is short on purpose because one line becomes one image and one clip. It prints **"Scene count: 11"**, so you know before generating anything that you need 11 images and 11 clips. The beat table times each line against a 6-second clip.
3. **Lock the style.** Claude offers 3 palettes that share one look and differ only in paper and accent colour: purple on off-white, teal on dark slate, or terracotta and orange on pale cream. The chosen palette is printed as a locked spec covering paper, grid, accent shapes, typography and "two background lines". Claude then embeds that spec in every image prompt, and that is how scenes keep one style without drift.
4. **Image prompts.** All 11 come out at once, each with its script line, the image prompt and "the exact words for that frame". Those words are rendered inside the image.
5. **Google Flow image batch.** Open a new project and turn on **Agent mode**. In agent settings, set images to 9:16, one per prompt, with **Nano Banana 2**, and video to 9:16, one per prompt, with **"Omni 1.1 Flash"** (the model name as heard in the captions). Then paste the batch line, quoted verbatim: *"Create an image for each of the prompts given below"*, followed by all 11 prompts. Rename the outputs S01–S11 inside Flow, because Flow returns an unlabelled grid.
6. **Motion prompts.** Type "next" in the same chat to get one video prompt per image. Each clip has **4 phases: open, kinetic build, hold, exit**, which leaves a clean cut point at both ends. Drag the images in as references (S01 onward) and paste a batch instruction that matches each video prompt to its image and animates it for 6 s. The exact wording is not in the captions. Example motion prompt as narrated: *"A floating marble brain with a glowing orange hole drifts before the bold word hole on a minimal white background. In the final second, the camera zooms into the hole transitioning to the next scene."*
7. **Free-tier limit.** Flow's free plan has a daily credit cap, so the 11 clips take 2–3 days. A paid plan does it in one sitting.
8. **Voiceover.** The master prompt has no voice stage, so a separate short prompt reformats the script into 11 lines that each fit a 6-second clip. Paste them into ElevenLabs Text to Speech and pick a "deep, raspy", "calm and clear" voice. Regenerate any rushed or flat lines and download the MP3. The video's honest note: the VO never matches the 6-second assumption, so you remeasure each line on the timeline.
9. **CapCut desktop edit.**
   - Put the VO down first as the backbone and set the ratio to 9:16.
   - Add a **solid track in the palette's paper colour under everything**, so that fades go "into paper, not into black".
   - Add clips S01–S11 and trim each to its VO line.
   - Fade each clip out with opacity keyframes: 100% about 5 frames before the end, 0% on the last frame.
   - Add an "in" animation (slide) and make a compound clip.
   - Add music low under the voice and 2 SFX: a paper snip when the hole appears and a soft tick on the last scene.
   - Export at 1080p 30 fps. The cover is the strongest single frame.

### Named tools, settings and prompts

- Claude (chat)
- Google Flow (Agent mode, Nano Banana 2 images, "Omni 1.1 Flash" video, 9:16, 6-s clips)
- ElevenLabs free tier
- CapCut desktop
- Beehiiv newsletter (aipreneurai.beehiiv.com)

**The master prompt is not public.** It is gated behind a comment funnel ("comment 'motion graphics' and I'll send it to you"). Only the two verbatim lines quoted above appear in speech.

The description says "the text goes in CapCut, not in the image generator", but the narration says the words are "generated right inside the image". The video contradicts itself here. For us, adding text at the HTML layer is better in any case.

### Monetization

- **Implied:** "People pay real money for videos like these", meaning motion graphics sold as a service or used on viral faceless pages. No numbers are given.
- **Actual business:** lead generation. A free automation checklist feeds the newsletter, and the comment-for-prompt DM funnel drives engagement.
- **Credibility:** no earnings claim, so there is nothing to verify. The workflow claims (free, about 1 hour of work, 2–3 days on free credits) are modest and believable.

### Automatable with our stack

**Almost all of it, with no paid tools.**

- **Planning.** The planning chain becomes a deterministic prompt template or skill: topic → N short lines → scene count → locked palette spec → per-scene visual spec + on-frame words → 4-phase motion spec.
- **Visuals.** The "3D paper collage" look (cream paper, grid, terracotta and orange shapes, marble brain, puzzle piece, fishing hook) fits **Three.js inside HyperFrames** (or SVG/CSS 2.5D) better than gen-video. Every scene shares one palette by construction, the text is crisp HTML, and the 4-phase motion is GSAP.
- **Voice.** Kokoro VO plus **Parakeet word timings** removes the manual "remeasure each line" step, because scene lengths come from the real VO.
- **Edit.** The paper-coloured underlay and fades-to-paper become a single background layer.
- **Audio.** ACE-Step bed, numpy SFX (paper snip, tick), and ducking via hyperframes-audio.

**Gen-image option.** For the image layer, the Gemini free tier (Nano Banana) works, but check output terms and watermarking.

**Gen-video is optional.** Flow's free credits are the bottleneck the presenter admits to.

### Red flags

- **"Free"**: it costs 2–3 days of credit waits.
- **ElevenLabs free tier** is, as far as we know, non-commercial and needs attribution. That breaks monetized use, so use Kokoro instead.
- **Google Flow output** carries SynthID. Visible watermarking on lower tiers has been reported, but we have not verified it.
- **The prompt is withheld** behind an engagement funnel.
- **Low volume.** One 60-second short per hour by hand is not a series engine unless automated.
- **AI disclosure.** YouTube and TikTok want altered or synthetic content disclosed when it looks realistic. Stylised motion graphics usually don't need the label, but the AI voice should be kept in mind.

### Visual watch additions (Gemini, 2026-10-21)

- **The master prompt's opening is legible**, which is enough to rebuild it: *"You are a short-form motion graphics production director for a premium mixed-media editorial channel. Your job is to turn a topic into a complete vertical short-form video package using photoreal 3D objects, mixed-media collage, 2.5D depth, kinetic typography, graphic accents, and premium motion design..."*, then *"STAGE 1 - TOPIC  Give me 5 strong short-form video topic ideas..."*. The rest scrolls past.
- **Each image prompt has a fixed shape:** `SCRIPT LINE: "They say curiosity is a hook that pulls you in."` then `TEXT-TO-IMAGE PROMPT: Vertical 9:16 premium mixed-media editorial poster. Pale cream paper-textured background with a thin cross-dot grid...`. The locked palette spec is repeated inside every one.
- **The batch motion instruction (the part the captions lacked):** *"generate the video prompts below, create 6 seconds video for each prompt, that first video prompt using the S-01 and the second video prompt using S-02..."*. References are named `S-01`…`S-11`.
- **The voiceover prompt:** *"Write the voiceover for this video from the Stage 2 script above. Keep the same words and the same order, one beat per line, from B01 to B11, with a blank line between lines, so each line fits inside its own 6-second clip..."*. Beats are labelled `B01`…`B11`.
- **Google Flow credits explain the "2–3 days":** the free tier shows **50 daily credits**, images cost 0 and each video **12 credits**, so about 4 clips a day. The video dropdown also lists **Veo 3.1 Fast** and **Veo 3.1 Quality** next to "Omni 1.1 Flash". Gemini read paid tiers as Google AI Plus $1.29/mo (200 credits), Pro $4.99/mo (1,000) and Ultra $99.99/mo (16,000); the low two look like regional or promo prices, so don't quote them.
- **Voice:** ElevenLabs **Eleven v3**. The screen shows the voice *"James - Husky, Engaging and Bold"*, while he says "Chuck Miller".
- **Palette picked on screen:** "Option 3: High-Contrast Academic". The look: pale cream paper with a fine grid, terracotta and orange accents, charcoal serif headlines, bold block captions, photoreal 3D objects (fishing hook, marble brain, wooden blocks, puzzle pieces), slow 2.5D parallax drift and quick fades to cream at cut points. That is a ready brief for the Three.js/HyperFrames template in takeaway 1.

---

## 2. "Claude Replaced Higgsfield with This FREE MCP" by Moe Alamawi

- **URL:** https://youtu.be/YLa0g-nMoWU
- **Length and reach:** 7:33 (453 s). Uploaded 2026-08-21. 86,291 views, 1,314 likes, about 40 comments. The channel has 8.2k subscribers.
- **Chapters:** 0:00 problem · 0:37 why creators leave Higgsfield · 1:58 the alternative: fal.ai · 3:34 costs · 4:44 workflow with Claude · 5:34 automating TikTok Shop content.

### What it teaches

Skip aggregator subscriptions (Higgsfield) and call the model APIs through **fal.ai** (pay as you go) from a Claude skill or MCP. The title says MCP; the narration says "Claude skill… a text file you give Claude Code".

- **Flow:**
  1. Tell Claude what to generate.
  2. Pick the cheapest or preferred model on fal.
  3. Claude writes the generation prompt.
  4. Claude saves the output locally or to Google Drive.
- **Demo (his own internal app, not shown as a repo).** Paste one TikTok Shop product link, or bulk links, and choose an on-screen text style. The app shows a price ("**$0.48 for one clip, $0.96 for two clips**"). It then:
  1. Isolates the product from the listing.
  2. Makes a **Nano Banana Pro** image.
  3. Animates it with **Kling 2.6**.
  4. Adds text, producing a "fully edited video, ready to post".
- He also uses direct Gemini API keys for Nano Banana.

### Named tools and prices (as claimed)

- **Higgsfield subscription:** $29/mo Pro, $79/mo Max.
  - His complaint: credits are prepaid and wasted in slow months.
  - He also says a recent terms update lets Higgsfield own or train on user inputs and outputs ("literally stolen"). That is his characterisation and we did not verify it.
- **GPT image** (said as "GPT-2 image", likely GPT Image 2): 31¢ on Higgsfield vs 5¢ on fal, "6× cheaper". 100 images would be $31 vs $5.
- **Kling (2.6):** "half the price" on fal.
- **Models named:** Kling, GPT Image, Nano Banana / Nano Banana Pro, Seedance.
- **fal.ai:** "create a free account, load a couple dollars". It is pay-per-use.
- **Personal spend:** he says he spends "hundreds, if not over a thousand dollars every month on AI credits".

### Price check (fal.ai/pricing via r.jina.ai, 2026-10-20)

| Model | fal price |
|---|---|
| Kling Video v2.6 Pro (i2v) | $0.07/s ($0.70 per 10-s video; about $0.35 per 5 s) |
| Nano Banana Pro | $0.15/image |
| Nano Banana 2 | $0.08 |
| Nano Banana | $0.0398 |
| Kling v2.5 Turbo Pro | $0.07/s |
| Kling v3 Pro/Standard | $0.14/s |
| Seedance 2.0 Fast / Mini | $1.21 / $0.756 per video |
| PixVerse V6 | $0.005/s |
| Z-Image Turbo | $0.005/MP |
| FLUX.1 schnell | $0.003/MP |
| GPT Image 2 | token-billed, "$1/unit", so the 5¢ claim can't be confirmed from the table |

His **$0.48 per clip** fits NB Pro ($0.15) plus a 5-second Kling 2.6 clip (about $0.35). The cost claims are broadly credible.

fal also runs a public docs MCP (fal.ai/docs/mcp), but it only does search and retrieval. The "MCP that replaces Higgsfield" would be fal's model API wrapped in a skill or MCP. **No repo is named.**

### Monetization

- **His model:** a **TikTok Shop affiliate** business that turns product links into AI product videos and earns commissions. No commission or GMV numbers appear in this video. The description links a "Results" playlist.
- **His real funnel:** a free TikTok Shop affiliate course video, plus a paid community "Momentum Academy" (an "inner circle" application, and an "AI TikTok Shop LIVE Training" masterclass RSVP).
- **Credibility:** the cost numbers check out. His income is unstated, and the business sells courses.

### Automatable with our stack

**Without paid gen-video**, here is a TikTok Shop product video pipeline:

- **Product cutout:** a product photo from the listing or a supplied asset, cut out with background removal (`hyperframes remove-background` / media-use, or BiRefNet).
- **Motion:** Depth Anything 2.5D parallax or Three.js turntable/hero motion instead of Kling.
- **Text and voice:** HyperFrames text overlays and captions, Kokoro VO, Parakeet captions, ACE-Step bed.
- **Cost:** $0 marginal per video.

**When realism matters**, fal is the cheapest metered fallback, at about $0.35–0.70 per clip for Kling 2.6 and $0.15 per NB Pro image. A thin fal client skill (a REST call, poll, download) is easy to write ourselves.

**TikTok Shop affiliate entry needs an account, not tools.** Eligibility rules vary by region (follower minimums have applied), so check current requirements.

### Red flags

- **The title is clickbait.** "FREE MCP" is really a pay-per-use API, and the demoed app is his private tool.
- **Not neutral.** He says "Not sponsored" but sells courses and a community.
- **TikTok AI rules.** TikTok requires AI-generated content labels. TikTok Shop prohibits misleading product depictions, so AI animation must not exaggerate what the product does.
- **Content-farm risk.** Bulk-generated near-identical product videos look like reused or low-effort content and can be suppressed.
- **Listing images.** Using seller listing images is common for affiliates, but the rights belong to the seller or brand.

### Visual watch additions (Gemini, 2026-10-21)

- **The app is inside his course platform:** Momentum Academy dashboard → **AI Director** → **Arc Shot Agent**. Paste a TikTok Shop product link, click **Pricing**, pick clips per video and videos per product (he chose 2 clips, 1 video), then **Create**.
- **The cost table is linear at $0.48 per clip:** 1 video × 1 clip $0.48, 1 × 2 $0.96, 2 × 1 $0.96, 2 × 2 $1.92.
- **The motion prompt is one line:** *"Arc Camera Shot from left to right, while keeping the products stationary and centered."* The output is a 9:16 clip with a slow arc of about 180° around cosmetics on a marble vanity, a red top banner "CRAZY DEAL 🚨" and an animated bottom badge "MEGA DEAL 🔥". We can reproduce that move with a Three.js turntable or Depth Anything parallax on a cutout.
- **Higgsfield vs fal, as shown:** GPT Image 2 at 2K about $0.31 vs $0.05; a 5 s Kling 2.6 clip about $0.65 vs $0.35. Higgsfield's model menu lists GPT Image 2, Kling 3.0 Omni / 2.6 / 2.0 Master, Seedance 2.5 / 2.0 / 2.0 Fast / 2.0 Mini, MiniMax Hailuo, Gemini Omni Flash, Nano Banana Pro, Veo 3 and others.
- **New: an earnings dashboard appears (05:35)** that the captions never mention: all-time commission **$31,310**, 30-day earnings **$3,705** from **78** videos in 30 days (about $47 a video), conversion rate **5.40%**, and a 30-day record of $30,000. It is his own course platform's dashboard and it is not clear whose account it is, so treat it as a marketing screen, not evidence. Even so, it is the only income number in batch A, and at $0.48 a clip the 78 videos would cost about $37–75 in generation.
- **Higgsfield terms:** on-screen callouts say Higgsfield keeps perpetual training rights over user content. That matches his spoken claim; we still have not checked the terms themselves.

---

## 3. "Use these 5 music techniques in your ads to increase your ROAS" by Kristian Jennings

- **URL:** https://youtu.be/ibr_NYgUKVY
- **Length and reach:** 15:20 (920 s). Uploaded 2026-10-19. 823 views, 24 likes. The channel has 2.8k subscribers.
- **Chapters:** 0:00 intro · 1:20 music theory · 1:42 selection · 4:23 hooks · 6:06 transitions · 8:11 amplification · 8:52 extension/editing · 12:21 endings · 14:38 conclusion.

Same creator as `kvf2lRSGixg` (AI UGC) in this folder. He is a DTC agency video editor and a former Ecom Talent student.

### What it teaches

Music editing for direct-response (DTC) ads, built on the premise that "people buy from emotion, not logic".

1. **Theory.** Almost everything is in 4/4, so count 1-2-3-4 and always cut on **beat one**.
2. **Selection.**
   - Pick by intended emotion for each script section. Listen and check whether *you* feel the target emotion.
   - Examples: Artlist filter "hopeful + acoustic guitar" for the desired-reality or solution section, and "tense + strings" for the problem section.
   - Use the contrast: the low of the problem, then the high of the solution.
3. **Hooks.** Don't start the track at its first beat. Find the **beat drop and align it to the start of the "hold"** (the section right after the hook), and let the pre-drop run under the hook. Viewers don't register music until they've heard a full set of bars, so starting off the "one" is fine.
4. **Song transitions.** Cut track A on a beat one and start track B on its own beat one. Different tempos still work. "Pro mode" is an overlap with volume-keyframe **crossfades** (A out to 0, B in from 0). Under voiceover the change goes unnoticed while the emotion shifts.
5. **Amplification.** Drop the music (fade it, or cut on the one) to spotlight a key line, then bring it back, possibly from a *different* part of the song. His example: a coffee VSL ad ("Double walled insulation…"), re-entering with the hook's song section.
6. **Extension and editing.**
   - Duplicate or remove sections cut on beat one to lengthen, shorten or place a section where you want it, then crossfade the seams.
   - Premiere tip: right-click the time ruler and choose **"Show Audio Time Units"** to nudge cuts by sub-frame audio samples, then turn it off.
7. **Endings.**
   - Never hard-cut when the script ends ("close the loop").
   - Use a satisfying section of the song plus a fade, even if it isn't the song's real ending.
   - Example ends: "Because coffee isn't just a drink, it's a ritual… Stok…", "…get your money back in 180 days", "Thicker, healthier hair starts at just $1 a day", "One cube, 30 minutes…".

### Named tools and resources

- **Music sources:**
  - **Artlist** is used for about 90–95% of the agency's ad music. It filters by genre, mood and instrument.
  - **Suno** is used for some AI songs.
  - **Pixabay** is a fallback.
  - **YouTube** is used to grab a viral TikTok song "to hijack a viral trend".
- **Editor:** Adobe Premiere Pro.
- **Free cheat sheet:** kristianjennings.com/resources/music/. It has a direct link to music-cheat-sheet.pdf, 1 page, 785 KB. The PDF is image-only and jina extracted no text.
- **Other tools on his site:** Message Screenshot Maker, Inbox Maker, Comment Maker, ROAS Calculator, a Sound Effect Bank, plus AI UGC, Captions, Hook Text, End Card and Safe Zones resources.

### Monetization

- **Agency DTC ad editing** for brands, so ad creative as a service. The ROAS uplift is the pitch.
- **Credibility:** there are **no ROAS numbers** despite the title. The video is craft education. He is credible as a practitioner, but makes no quantified claims.
- **Funnel:** free resources build his newsletter and personal brand, and the Ecom Talent course ecosystem is referenced.

### Automatable with our stack

**Very directly. This is an algorithm spec for a "beat-aware music editor" step.**

- **Beat grid.** **ACE-Step** can generate per-section tracks by mood (e.g. "tense strings" for the problem section, "hopeful acoustic guitar" for the solution) at a **chosen BPM**, so the beat grid is known exactly. Otherwise, a numpy onset or beat tracker finds downbeats.
- **Auto rules:**
  - Align the drop to the hook→hold boundary taken from Parakeet word timings.
  - Cut and join only on downbeats.
  - Crossfade 1–2 beats at section changes.
  - Dip or mute 1 bar under the "amplified" line and re-enter on a downbeat.
  - Extend loops by repeating whole bars.
  - Always end on a bar boundary with a fade tail.
- **Mixing.** hyperframes-audio already does crossfades, ducking and envelopes.
- **Workflow.** HyperFrames `beats` (CLI) can feed beat timestamps.

This raises the quality of every ad and short we render, at zero cost.

### Red flags

- **The title promises ROAS gains with no data.**
- **"Grab a viral TikTok song from YouTube"** is a copyright and ToS problem for paid ads. Commercial ads need licensed music (TikTok's Commercial Music Library, Artlist, or our own ACE-Step output).
- **Suno.** The free tier is non-commercial. Paid tiers grant commercial rights, but copyright status is unsettled.
- **Fake-social-proof tools.** "Message Screenshot Maker / Inbox Maker / Comment Maker" are tools for fabricating social proof, which collides with our no-fake-testimonials rule. The FTC and platform ad policies prohibit fake reviews and testimonials. **Do not adopt them.**
- **Unverified ad claims.** Example ad copy ("$1 a day", "money back in 180 days", hair-growth results) is client-specific. Health-adjacent claims in ads need substantiation.

### Visual watch additions (Gemini, 2026-10-21)

- **Selection starts from a flowchart, not a genre:** `Angle + Product + Message + Customer` → "How they should feel" → emotions (Calm, Hopeful, Elevated). A line graph shows "the low of the problem" against "the high of solving the problem". That gives our beat-aware music step its input: one target emotion per script section, set before choosing a mood prompt for ACE-Step.
- **The hook rule on screen:** *"Well, shouldn't the song start at the 1 of the 4/4?"* → *"No"*. In Premiere he finds the drop's waveform spike, razors there, snaps the drop to the start of the hold, and drags the pre-drop back under the hook.
- **Crossfade as shown:** track B sits on A2 under A1 with beat 1 aligned to beat 1, and the volume rubber bands form a diagonal X. Cards read "The beat 1 of the second track matches the beat 1 of the first track" and "Crossfade".
- **Artlist filters used:** Instrument → Acoustic Guitar plus Mood → Hopeful, and Strings plus Tense or Cinematic. Gemini read track names such as "Into the Woods" (Super Neato), "One Sunny Day" (Amos Ever Hadani) and "Flame" (Ardie Son); unverified.
- **Endings:** cards say "Close that loop", "POINT 1: Add an ending" and "POINT 2: You don't have to use the song's ending".
- **A disclaimer slide** lists "Only sell what you believe in", "Nothing grey hat or black hat" and "Make sure it's ethical and moral". That sits oddly next to his Comment/Inbox Maker tools; our rule stands.
- **The example ads are animated, not AI people:** the coffee tumbler (read as "STOKE") uses product pours and white lower thirds; the hair supplement uses a 3D cartoon superhero with newspaper headlines and yellow callouts; "Spicy Cubes" uses a 3D animated couple and a "Do Not Disturb" CTA. His own graphics are dark teal glassmorphism cards with cyan highlights and spring easing. No dashboards or ROAS numbers appear on screen either.

---

## Batch A takeaways for the money engine

Ranked by speed to first dollar:

1. **Build a "paper-collage 3D explainer" Shorts template in HyperFrames now.**
   - Clone AIpreneur's structure (11 lines → 11 scenes, locked palette, on-frame keyword, 4-phase motion, fade-to-paper) with Three.js/SVG, Kokoro and Parakeet.
   - $0 per video, and the scene length comes from the real VO.
   - Sell it on Fiverr/Upwork and to creators ("viral motion-graphic explainers"), and run one faceless series with it.
   - We can ship a demo reel within days.
2. **Write the master prompt ourselves as a skill.** The pattern is: 5 topic ideas → short-line script + scene count → 3 palettes → locked spec injected into every scene → per-scene visual + words → 4-phase motion. We don't need his comment-gated prompt; the structure above is enough. It drives a whole series with consistent style, which also reads as an original, consistent format rather than "repetitious content".
3. **Add a beat-aware music step to every render.** Use Kristian's rules: drop at the hook→hold boundary, cut on beat one, crossfades, a one-bar dip for the key line, bar-loop extension, and a proper fade-out ending. Use ACE-Step at a known BPM, with mood per script section (tense for the problem, hopeful for the solution). It is cheap to build, lifts every UGC or DTC ad we deliver to brands, and is a sellable differentiator for "ad editing as a service".
4. **TikTok Shop affiliate product videos without gen-video costs.**
   - Product link or photo → cutout → Depth Anything parallax / Three.js hero → HyperFrames text and captions → Kokoro VO → ACE-Step bed.
   - Earns commissions on our own account. Bottlenecks are account eligibility and region, not tooling.
   - Label it as AI content, keep product depiction truthful, and vary scripts and visuals per product to avoid looking like a content farm.
5. **Metered fallback only when realism sells.** Wrap fal.ai (Kling 2.6 at about $0.07/s, NB Pro $0.15, PixVerse V6 $0.005/s, Z-Image Turbo $0.005/MP) in a tiny skill. That is about $0.50 per realistic product clip, with no Higgsfield-style subscription. Spend money only on formats that already show traction.
6. **Copy the creators' funnel, not their claims.** All three monetize with a free resource (prompt, cheat sheet or course) that feeds a newsletter or community. A "comment X for the prompt/template" DM funnel can sit on our explainer channel later. It is secondary to direct service and affiliate revenue.
7. **Swap out the non-commercial-risk pieces** in any copied workflow:
   - ElevenLabs free → Kokoro.
   - Viral songs ripped from YouTube or Suno free → ACE-Step or licensed tracks.
   - Flow free tier (credit cap, watermarking) → HyperFrames-native visuals.
   - Never adopt fake comment, inbox or screenshot makers.
