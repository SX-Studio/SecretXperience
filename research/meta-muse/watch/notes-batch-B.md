# Batch B notes: three videos (2026-10-20)

Sources: yt-dlp metadata (description, chapters, view counts as of 2026-10-20) and YouTube auto-captions (`en-orig`, json3) fetched through r.jina.ai and flattened to plain text. Linked pages were checked through r.jina.ai, and repos through jsDelivr.

**Visual watch: not run for any of the three.** `watch_all.py --ids` only accepts ids already in its `VIDEOS` dict (`items = [allv[i] for i in wanted if i in allv]`), and none of these three are in it. Since we were told not to edit the runner, these notes rely on transcripts only. Anything that was on screen but not spoken is missing: Massimo's Gemini TTS settings, the full scene prompts, the editor skill's output style, and what Jad's slides actually look like. If the orchestrator adds the three ids to `VIDEOS`, `python3 -I watch_all.py --ids 8rBiTpcoTrM,hZ_w1d0uYT4,JgoPiiBhdn8 --workers 1` will fill that gap. The most useful one to watch is JgoPiiBhdn8, because the TTS settings are on screen.

Transcripts:
- `../transcripts/8rBiTpcoTrM-jack-roberts-reverse-engineering-repo-tested.txt`
- `../transcripts/hZ_w1d0uYT4-jad-mh-motion-graphics-carousels-skill.txt`
- `../transcripts/JgoPiiBhdn8-massimo-seq-ai-ugc-ads-beginners.txt`

---

## 1. "I Tested the Viral Reverse Engineering Repo (What You Need to Know)"

- **Channel:** Jack Roberts (286K subscribers)
- **Length:** 16:46 (1006 s)
- **Views and date:** 54,365 views, uploaded 2026-10-12
- **URL:** https://youtu.be/8rBiTpcoTrM
- **Sponsor:** Base44 ("Thanks to Base44 for sponsoring this video")

### What it teaches
Jack takes the hype around REA ("Reverse Engineer Anything") and uses it to clone the core features of three SaaS apps in Base44, a no-code AI app builder with the backend built in. Each app takes one screenshot and one prompt:
1. **A Calendly clone.** It has Google login, weekly availability toggles, 15-minute slots, a shareable booking link, input validation and email confirmations. A follow-up prompt adds meeting edits, emoji and required custom questions.
2. **A Typeform clone, named "Ask".** It has multiple-choice, short-text and 1-to-10 rating questions, a public share link and a results view. A follow-up prompt adds a preview mode and a yes/no question type.
3. **A Trello clone, named "Lanes".** It has boards and lanes, drag and drop, card covers, checklists and team invites by email.

His conclusions:
- One shot gets about "80%" of the features. The rest comes from "back and forth" prompts.
- Copy what the app does, never its code, images, logo or paid features.
- Building beats buying when the tool costs $200 to $1,000 a month and you can build it in a day or two. It loses when the tool is cheap and complex.

### Every tool, site, repo, model, price and prompt named
- **REA, Reverse Engineer Anything:** https://github.com/morluto/rea, MIT licence, verified on jsDelivr. Install with `npx rea-agents setup`. Site: rea.tools. Jack says REA is "420,000 lines of TypeScript" and only "789" lines of it are the reverse-engineering skill. His Notion page gives about 422,000 lines and cites skill v38 plus 6 guides. His point is that pasting the method into Claude, ChatGPT or Base44 is faster than installing the repo. We had already ruled REA out for Adobe and Higgsfield (`tools/TOOLS-ASSESSMENT.md`). The outside-only method below is a different thing and is fine to use.
- **"Reverse Engineer Prompt" Notion page** (https://www.notion.so/Reverse-engineer-Apps-no-install-3f6e8d6bd13781f9b411da0ce0bcbbee, via bit.ly/4i0wNCh). Its rules: only study apps you are allowed to use, never get around a login or paywall, copy what an app does and never how it is made (no code, images, logo, wording, colours or name), and keep what you saw separate from what you guess. The prompt, verbatim:
  > Reverse engineer this app from the outside only. I'm attaching screenshots and screen recordings of [APP] from my own account. 1. First, write a checklist of what I need to know to rebuild it: every screen, every action, every rule, and the data it stores. 2. Go feature by feature: where the user starts, what they do, what changes, and what they end up with. 3. Mark every finding OBSERVED (I can see it), INFERRED (it must work this way) or UNKNOWN. Never guess from labels alone. 4. List the data the app must store: each table and its fields. 5. End with the checklist again: answered, partly answered or open. For each open item, tell me exactly what to click or record next. 6. Then write a build spec. Keep what you observed separate from new design choices. Never copy its wording, logo, colours or name.

  The page also attaches `REA-original-789-lines.txt`, which is REA's skill v38 verbatim with its MIT licence.
- **The in-video build prompts** (spoken, so approximate wording):
  - "Hey there, I want you to go ahead for me and recreate Calendly for me, the booking system, based on the screenshot. Give it a different name, but I want to have all of the core functionality."
  - "...build for me, please, this version of Typeform. I'm going to attach a screenshot. See if you can recreate the functionality. Give me the ability to create forms so I can cancel my subscription... give it a different name other than Typeform and make it a little bit different."
  - Follow-up: "Hey there, go ahead and add for me a preview mode. And add me one further question type."
- **Base44:** an affiliate link (bit.ly/3TBxolz redirects to `base44.pxf.io/c/7646057/...`, an Impact affiliate link). It has a plan mode, one-click publish, private apps, a mobile-app option and custom domains.
- **Glaido:** a dictation app. Affiliate link (`get.glaido.com/jack`, "1 FREE month").
- **"AI Automations by Jack" on Skool:** the paid community (bit.ly/4kol0y5). The about page shows **$87/month, 3.3k members, 5.0 stars from 105 reviews**, and "PRICE INCREASE 31 OCT, rising to $97". It claims "the exact AI systems behind my $400K/m business", "Sell AI services & products ($0 → $10K/m)" and "200+ battle-tested blueprints".
- **Other figures he cites:** "the average person is spending around $219" on subscriptions, "save $10 to $20 instantaneously", "you can spend $400 easily on form things".

### Monetization models
- **His own business is the template, not the apps.** It stacks a brand sponsorship (Base44), affiliate links (Base44 through Impact, plus Glaido) and a paid Skool upsell (3.3k × $87 ≈ $287K/month gross if every member paid list price; he claims $400K/month in total). The membership count is shown on Skool, so it is fairly credible. The $400K/month figure is unverified.
- The video never says how anyone else makes money from the cloned apps. Its pitch is about saving subscription money. "Sell AI services" exists only as the Skool upsell.

### What our stack can do with this
- **The OBSERVED / INFERRED / UNKNOWN method is directly usable for format cloning.** Feed Gemini watch reports or screenshots of a winning video or ad format into this checklist discipline. That gives Hypit a format spec we can audit and that separates facts from guesses. It also makes "copy what it does, never its wording or look" an explicit rule. This fits Hypit well.
- **Build internal tools instead of buying them.** We can build an ad analyzer, a script remixer and a b-roll prompt bank in plain code or HTML, and skip $69 to $87/month tools.
- Base44 itself is a paid SaaS we don't need. Claude Code already covers app building.

### Red flags
- Hype framing: "build three apps worth billions of dollars in minutes", "IP as a moat no longer exists", jokes about tissues being sent to Adobe HQ.
- The video is sponsored by the tool it praises. The disclosure is in the description and spoken.
- The $400K/month business claim is unverified.
- **IP and ToS risk.** His own clones are named generically ("Ask", "Lanes"), but the Trello clone copied the green-leaves background. That is the "don't copy their images" line he warns about himself. Cloning SaaS features is legal. Cloning the look is not safe.
- **Relevance to the money engine is low.** This is an app-building video. It is useful for its method prompt and as a picture of the YouTube-to-paid-community business model.

---

## 2. "New VIRAL Carousels With Motion Graphics 0$ Turned It Into a Skill (COPY ME)"

- **Channel:** Jad M.H | AI Automation (7,170 subscribers)
- **Length:** 10:51 (651 s)
- **Views and date:** 97,471 views, uploaded 2026-10-04. That is about 13.6 times his subscriber count, a clear outlier.
- **URL:** https://youtu.be/hZ_w1d0uYT4
- **Sponsorship:** he says it is not sponsored.

### What it teaches
A "live carousel" is an Instagram carousel where every slide is a short looping video at 1080x1350 with its own sound. The music carries on from slide to slide, so the whole carousel plays like one song. Claude writes the HTML, HyperFrames renders it, and FFmpeg builds one MP4 per slide. Nothing comes from a video model. This is the follow-up to his earlier "viral motion graphics" video (zke3bTtvmLo, already in `VISUAL-FINDINGS.md`).

- **Why carousels:** swipes keep people on the post longer and drive saves and shares, which the algorithm rewards. In a feed full of Reels, a static carousel is easy to scroll past.
- **Why not image-to-video AI:** you pay credits per clip, you can't control what moves or when, text "melts", faces drift, and the model knows nothing about music. With code, the text stays sharp, every move lands on a beat, and a fix is a one-line edit followed by a re-render.
- **The three rules:** easing, weight and rhythm.
- **Rhythm:** everything runs at **120 BPM**, one beat every 0.5 s. Every hit, flip and bounce lands on a beat, and **each slide is a whole number of bars (3 or 4 bars).** Instagram loops video slides, so a slide that isn't bar-aligned produces an audible jump at the loop point. Rule: "Make every slide a whole number of bars or the loop jumps."
- **Example 1, "Motion Design 101":** pure design with no image model and $0 cost. It has 4 slides, a cobalt-blue background, cream text and one orange ball that travels across all the slides and leaves each one at its edge. A timeline ruler at the bottom runs across all four slides like one long animation timeline. The hook slide reads "this post [is] aesthetic" and looks it.
- **Example 2:** a carousel his earlier carousel-generator skill made from one prompt, "viral motion carousel for Instagram" (video UpX_HfNieJs; that skill is "connected to Higgsfield" for images). Claude rebuilds each flat slide **in layers**: background, his cut-out photo, text, title and floating cards, "like a stage", so each layer can move on its own. The music is an ACE-Step 1.5 instrumental made on a base MacBook Air, and each slide picks up the next bars of the same song. The SFX (shutter, whooshes and so on) are generated in code.
- **What the skill does:** you give it a topic or your own images. It plans each slide (hook, rules, CTA), decides what moves when and on which beat, makes the music and SFX locally, renders one MP4 per slide at Instagram size, and builds a preview page so you can ask for quick changes. You then upload the clips in order as a carousel. He also advises giving it a list of don'ts so the output avoids the default AI look.

### Every tool, site, repo, model, price and setting named
- **HyperFrames:** https://github.com/heygen-com/hyperframes, verified on jsDelivr. This is our renderer.
- **FFmpeg:** https://ffmpeg.org
- **ACE-Step 1.5:** https://github.com/ACE-Step/ACE-Step-1.5, verified. The README says "licensed under MIT". It also asks users to "clearly disclose AI involvement" and to check that generated music is original. The skill makes its own music and SFX in code, so ACE-Step is optional.
- **Higgsfield:** used only by his older carousel-generator skill, for images. Paid.
- **Hardware:** a base MacBook Air.
- **Specs:** 1080x1350 (4:5), 120 BPM, slides of 3 to 4 bars (6 to 8 s at 120 BPM), one MP4 per slide.
- **Skill location:** his Skool, https://www.skool.com/nextphase-5790. He describes the install prompt as setting everything up "in about 2 minutes", and the skill is not public on GitHub. He says the community is free. The Skool about page, read through r.jina.ai, is titled "NextPhase AI". It lists "Claude Video Editor project files", "Viral Carousels" and "2× Weekly Group Calls w/ Jason", and has a refund policy for "annual/monthly members". So paid tiers may exist even if the carousel skill is free to grab. That is unconfirmed, and the about page may be a template.

### Monetization models
- **For Jad:** none directly, by his own account ("I'm not making any revenue... not sponsored... Skool community is completely free"). He grows an audience with free skills, which is a lead-magnet funnel. The about page hints at a paid tier.
- **For us (inferred, not claimed in the video):**
  - Live carousels as a **service to brands and creators**. Hardly anyone is doing them yet, it costs $0 per unit, and it is easy to show off.
  - Using them as **organic growth for our own Instagram pages**, which then feed affiliate offers or digital products.
  - The same engine renders 9:16 Reels and Shorts.
  - Instagram carousels earn no ad revenue on their own. The money comes from reach, then a funnel or a client.
- **No earnings numbers are given.** The 97K views on a 7K-subscriber channel is a credible sign of demand for "Claude motion design" teaching content, which is itself a niche.

### What our stack can do with this
**Almost all of it.** We already run HyperFrames, ACE-Step 1.5 and numpy SFX synthesis. What's missing is a "live carousel" preset:
- A 1080x1350 canvas with N slides rendered as separate MP4s from one master timeline. That gives continuity, with the ball crossing slide edges and one shared ruler.
- One music track at a fixed BPM, cut at bar boundaries, so each slide's audio is the next bars and **every slide loops cleanly**. Check the loop seam, for example with a crossfade-free bar cut on a zero crossing.
- A layered rebuild of an existing image: background, a subject cut out with remove-background (in the HyperFrames CLI), then text and cards.
- A preview page, plus the scored critique loop from Jad's first video.

Only the image-based variant needs paid image generation, and only when there are no photos of the brand or person. Pure motion design costs $0.

### Red flags
- Low risk. Original code-made motion design is about the safest format we have for AI-content rules.
- The claim of "no other resource so far" is self-serving.
- The Skool page wording doesn't match his "completely free" line, as noted above.
- **Platform risk:**
  - Carousels of looping videos need each clip to meet Instagram's current carousel limits (item count and per-clip length). Check those before building.
  - Music made with ACE-Step should be checked for originality, per its own README.
  - Label the content as AI-generated where Meta's rules require it. Code-generated motion design is generally not "realistic AI" content, but our policy is to disclose when in doubt.

---

## 3. "Beginners Guide to AI UGC Ads in 2026 (Realistic)"

- **Channel:** Massimo Seq (785 subscribers)
- **Length:** 13:16 (796 s)
- **Views and date:** 5,217 views, uploaded 2026-09-05
- **URL:** https://youtu.be/JgoPiiBhdn8
- **Product:** the video is a walkthrough of the presenter's own paid app ("UGC OS").

### What it teaches
Three AI UGC ad formats that Massimo says the winning ads use. He claims he studied "thousands of UGC ads". Each format is broken into "LEGO bricks" and built inside UGC OS. All three use one workflow: find a winning ad, run it through the **Ad Analyzer**, click "remix for your product", hand-edit the scripts, generate the clips, then let a Claude Code "/video-editor" skill do the edit.

1. **"Yap ad"** (0:20). One character talks to camera in a casual spot about a product, and it feels like a friend's recommendation. The bricks are the character, the product and the script. The reference ad is an oat-and-honey acne mask.
   - Steps: analyze the reference, then remix it with two instructions, "No text on screen" and "Keep it one shot in the same location, which is the character's parked car". Then "generate scene prompts" and hand-edit them for pain points and natural wording.
   - **Character:** made in a Characters tab by dropping in "a reference image of a real model I want my character to look like". The fields auto-fill. He picks wardrobe, accessories and an "in a car" background preset, then generates with **"GPT image two"** and saves it to the character "bank".
   - **Consistency:** he copies a **voice profile** from the scripts page into each clip's voice-profile box, so the voice stays the same across clips.
   - **Video model:** "Grok Imagine Video 1.5" (the captions say "Grok image in video 1.5"). He calls it "15 times cheaper than Seedance 2.5 and three times cheaper than Gemini Omni... each clip only comes down to a couple cents" and says it was more realistic and consistent than Gemini Omni for this ad.
   - **Edit:** "used to take me 6 hours per ad". Now he drags the clips into Claude Code, runs `/video-editor`, says "edit this video for me", and has a finished ad in about 5 minutes. The skill was "bought".
   - **Output script:** a skin-clearing gut supplement ("UGC OS Skin Clear") with "two capsules every morning... I literally went to the grocery store today without a drop of concealer on."
2. **"Storytelling b-roll ad"** (4:51). A voiceover story plays over b-roll of the character and product, one shot per line. The reference is a Skin Laundry acne-laser testimonial. **This format scales:** build one bank of b-roll, write 2 or 3 scripts for different angles, and the editor makes "hundreds of variations". He claims "50 of these a day on autopilot".
   - Steps: remix the transcript into 3 script variants, then turn them into voiceovers with **Gemini 2.5 Pro Text to Speech**. "These are the settings I use... feel free to copy them". The settings are on screen only and not in the transcript, so visual watch is pending.
   - **B-roll:** the tab outputs a storyboard with **3 variations per line**. He makes **still images first**, then animates only the ones he likes, which saves credits and locks character and product consistency.
   - **Cost:** Grok Imagine Video 1.5 costs "5 seconds... 22 credits a clip, which equals 11 cents". That implies 2 credits per cent, or $0.005 per credit. He says "100 of these b-roll clips for the same cost of generating one video with Seedance 2.5", which puts one Seedance 2.5 video at about $11 in his app.
   - The edit is again `/video-editor`.
3. **"Street interview"** (9:04). A conversational Q&A in which the interviewee visibly has the result the product promises. Clear skin sells skincare, a healthy look sells supplements, and "an attractive character of the opposite gender" sells clothing and fragrance. The reference is a real British street interview ("I've seen you on TikTok").
   - Steps: remix with the instruction "don't include any captions on screen" and a 30 s length. Then paste the whole prompt plus the "master visual style" into the Playground and generate one take with **Seedance 2.5** at 25 s, with the character attached.
   - **Cheaper test:** the same prompt on a cheaper model at 480p and 15 s. He thinks it came out better, even with captions left on by mistake.

### Every tool, site, model, price and setting named
- **UGC OS** (https://www.skool.com/ugcos), his product.
  - Features: an app with Ad Spy + Analyzer, Characters, Scripts, Voiceover & B-Roll, and an AI video editing skill. It also does Claymation, 3D animated and podcast formats.
  - Price: **$69/month**, "goes up to $99/month at 50 members".
  - Pitch: "No paying creators $300/video", "replaces $4,500/mo in creator & editor fees", "Test 10x more angles", "best AI models up to 70% cheaper", and "For Ecom Brands Looking to Scale 25+ Winning AI Ads a Week".
- **Models:** GPT Image 2 (characters and stills), Grok Imagine Video 1.5 ($0.11 per 5 s clip in his app), Seedance 2.5 (about $11 per video by his ratio), Gemini Omni (the comparison point), Gemini 2.5 Pro TTS (voiceover).
- **Claude Code `/video-editor` skill:** bought, origin not named. It does captions, cuts and b-roll.
- **The instructions he types,** verbatim as spoken: "No text on screen. Keep it one shot in the same location, which is the character's parked car." / "don't include any captions on screen" / "edit this video for me" / "please edit this video for me".

### Monetization models
- **For brands:** AI UGC ad creative replaces human UGC creators, at the quoted $300 per video. The selling points are volume (25+ ads a week, "50 a day") and angle testing, and the money comes from ad-driven sales. The service angle is implied: make these for e-commerce brands.
- **For Massimo:** a SaaS plus community subscription at $69 to $99/month. The YouTube channel works as a product demo.
- **Credibility of the numbers:**
  - "Millions of views and sales" belongs to the reference ads, which are real creator ads, not his AI ones. He shows no results for any AI ad he made.
  - The per-clip prices are app-internal credits and are plausible.
  - "6 hours to 5 minutes" is anecdotal.
  - With 785 subscribers and 5.2K views, he has no proven reach.

### What our stack can do with this
- **We can automate this:**
  - The **ad-analyzer, then remix, then scene-prompt pipeline**. Gemini video understanding can break a reference ad into scenes, hook, script and "bricks". Claude rewrites the script for a new product, and the OBSERVED/INFERRED method from video 1 keeps the analysis honest.
  - **Scripts** with N angle variants.
  - **Voiceover** with Kokoro (commercial-safe) or Gemini TTS on the free tier.
  - **Captions and timing** with Parakeet.
  - **Editing and assembly** with HyperFrames, which replaces the bought `/video-editor` skill: cuts, captions, b-roll timing and music ducking.
  - The **storytelling b-roll format** with **product-only b-roll**: hands, packshots, motion graphics, kinetic type, 3D product turntables in Three.js, or the brand's own footage. This needs no AI person at all.
- **Needs paid tools:** realistic talking humans and street interviews (Seedance, Grok Imagine, Gemini Omni, GPT Image), and realistic b-roll of people. No local, commercial-safe model in our stack does photoreal talking UGC.

### Red flags (serious)
- **These are fake testimonials.** Each generated ad has an AI person claiming a personal result: "I literally went to the grocery store... without concealer", "this is my skin now". The FTC's 2024 rule on fake reviews and testimonials bans testimonials from people who don't exist or who misrepresent their experience, and that includes AI-generated ones. Meta and TikTok also require AI labels on realistic synthetic people. This is on our banned list and needs no further judgement.
- **Health claims.** "Zinc and turmeric calm gut inflammation... acne stops flaring up before they even start" is an unsubstantiated health claim. Ad platforms reject these and the FTC enforces against them.
- **Street interviews faked with AI** present a staged scene as a real encounter, which is deception.
- **Likeness risk:** he builds the character from "a reference image of a real model I want my character to look like".
- **Remixing a winning ad's script.** Close paraphrases of a competitor's script and scenes are a copyright and trade-dress risk. Keep to structure, never wording.
- **Mixed incentives.** The video sells the app it demonstrates, the product in the demo ads is fictional ("UGC OS Skin Clear"), and he shows no results for his own AI ads.
- **The only safe parts are the format thinking** (yap, b-roll story, interview), the "bank once, remix many" economics, and stills-first animation to save credits. If we ever use AI people, the brand has to be the advertiser, label the content AI, and the person must make no personal-experience claims ("AI presenter explains", not "I tried it").

---

## Batch B takeaways for the money engine
Ranked by speed to first dollar.

1. **Build a "live carousel" preset in HyperFrames now, and use it as a demo and a service.** It needs 1080x1350, one MP4 per slide, a 120 BPM master track (ACE-Step or numpy) cut at whole bars so every slide loops seamlessly, and an element such as Jad's ball that crosses slide edges for continuity. It costs $0 per unit, carries no AI-disclosure or authenticity risk, and almost nobody is doing it (Jad's 97K views on 7K subscribers show the demand). Two ways to make money from it:
   - Offer it to brands and creators as a done-for-you animated carousel. A small flat fee per carousel gets the first dollar fastest.
   - Post it on our own Instagram pages to grow toward an affiliate or product funnel.
2. **Sell "storytelling b-roll ads" to e-commerce brands with no fake people.** Use the structure from Massimo's format 2: one script becomes a Kokoro voiceover over a bank of b-roll, rendered by HyperFrames into 10 to 50 angle variants. Use the brand's own footage, product packshots, kinetic type and Three.js product shots. Human UGC creators cost about $300 a video (his figure), and brands need volume for testing, so a cheap batch of variants is an easy sell. It is fully automatable with our stack.
3. **Build our own "ad analyzer" instead of paying $69 to $87/month for tools.** Gemini watches a winning ad. Then Claude writes a report that splits OBSERVED, INFERRED and UNKNOWN (Jack's REA-derived prompt, verbatim above), lists the bricks (hook, scene list, script beats, b-roll needs, CTA), and remixes it into new scripts that copy structure, never wording. This becomes the front end of Hypit format cloning and of item 2.
4. **Copy the "bank once, remix many" economics in every pipeline.** Build reusable stills and b-roll once, write 2 or 3 scripts per angle, and get N variants out of the editor. Make still images first and animate only the winners, so paid credits go only to shots already chosen. This is how we can afford occasional paid shots (for example a $0.11 Grok Imagine clip) without paying Seedance prices (about $11).
5. **Copy the creator business model these channels run: free skill or lead magnet, then a paid community, plus sponsors and affiliates.** Jack has 3.3k members at $87/month and a Base44 sponsor plus Impact affiliate links. Massimo charges $69/month. Jad gives a free skill to grow. We could turn our own pipeline into a skill or template pack and sell it, or give it away for reach, once we have outputs worth showing. This is slower to a first dollar, because it needs an audience, but it compounds. The meta-niche "Claude makes motion graphics" is pulling outsized views right now.
6. **Hard line: no AI-person testimonials, staged AI street interviews or health claims,** however well they convert. The FTC fake-testimonial rule, Meta and TikTok AI labels, and platform health-claim policies all apply. If a client wants AI presenters, they must be clearly labelled and make no personal-experience claims. Keep this in the client agreement.
7. **Low priority: cloning apps with Base44 or REA.** Save it for building internal tools such as a client order form or a booking page for the services in items 1 and 2. Claude Code already covers that, so no Base44 subscription is needed.
