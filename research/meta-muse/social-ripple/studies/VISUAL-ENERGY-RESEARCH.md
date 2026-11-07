# Visual Energy Research: "Something Is Happening Every Second"

Research for Social Ripple, 2026-11-06. Problem: viewers leave in the first 5 seconds; average view ~30 s of a 4-minute episode. Owner's observation: viral animated story videos in this niche keep something happening every second.

**How claims are labelled**
- **[CRAFT]** established animation / film craft (Thomas & Johnston, Williams, Blair, standard cinematography).
- **[OBS]** observation of specific channels or videos, from our own studies or a cited source.
- **[DATA]** a measured or published number, with source.
- **[INF]** our inference or estimate. Every number marked "est." is an estimate, not a measurement.

Inputs from our own studies: `STUDY-NOTES-2026-11-06.md`, `railroad-short-7xS87iActkU-pass1/2.md`, `yuji-black-clover-TdV9iAe8WoU.md`, `jeremy-bearimy-study/STUDY.md`. Those timestamps came from Gemini watching the videos and are approximate.

---

## 0. Why "every second" works (the mechanism)

- **[DATA]** Cuts and movement are the formal features with "the most consistent relationships to looking" in the television-attention literature (Huston & Wright's model; summary in [PMC3305831](https://pmc.ncbi.nlm.nih.gov/articles/PMC3305831)). The model separates *salient* features (sound effects, fast movement, rapid pacing) from *informative* ones (narration, story arc); salient features win the orienting response, informative ones keep the viewer once they are looking.
- **[DATA]** Abrupt visual onsets capture attention involuntarily ([Yantis & Jonides 1984](https://researchgate.net/profile/Steven-Yantis/publication/16958392_Abrupt_visual_onsets_and_selective_attention_Evidence_from_visual_search/links/0046351b7673aea58b000000/Abrupt-visual-onsets-and-selective-attention-Evidence-from-visual-search.pdf)); *motion onset* specifically, not continuous motion, draws attention ([Abrams & Christ 2003](https://pubmed.ncbi.nlm.nih.gov/12930472/)). A thing that starts moving beats a thing that is moving. This is the scientific basis for snaps, pops and punch-ins rather than slow drifts.
- **[DATA]** Faces capture attention bottom-up even when irrelevant to the task ([Springer 2017](https://link.springer.com/article/10.3758/s13414-017-1313-x)); the evidence that emotional faces beat neutral faces is mixed, so *a face appearing/changing* matters more than *which* emotion it shows.
- **[DATA]** Curiosity is an information-gap response: it needs some knowledge and a visible hole in it; too small or too large a gap kills it (Loewenstein 1994, summarised at [journalofcognition.org](https://journalofcognition.org/articles/10.5334/joc.501)). That is why "a number you don't yet understand" and "an action you can't explain" open well.
- **[DATA]** YouTube's own retention report defines the "Intro" key moment as the share of viewers still watching at 30 s, and says to fix it by matching title/thumbnail and "trying different styles in the first 30 seconds" ([YouTube Help](https://support.google.com/youtube/answer/9314415)). Facebook's feed research (2016) found 1.7 s average dwell per mobile item and that of people who watch 3 s, 65% reach 10 s and 45% reach 30 s ([Social Media Today](https://www.socialmediatoday.com/news/facebook-releases-new-guide-to-help-advertisers-maximize-video-ad-performan/450818)). TikTok's advertiser guidance: 63%+ of highest-CTR videos show the key message in the first 3 s ([Influencer Marketing Hub](https://influencermarketinghub.com/viral-tiktok-hooks-examples/)); no methodology is published, treat as directional.
- **[INF]** Our 30 s average view on a 4-minute video means most viewers never meet the premise's first test. The fix is not "more energy everywhere" but a steep energy front-load plus a re-hook cadence.

---

## 1. Visual event density

### 1.1 What counts as a visual event
**[INF]** Anything that causes an onset the eye registers as new. For scoring purposes we count ten types, each worth one event:

| # | Event type | Smallest countable version |
|---|---|---|
| 1 | Cut | new shot or new scene |
| 2 | Camera move start | push, pan, whip, snap-zoom, shake (the *start* counts, per motion-onset research) |
| 3 | New pose | body silhouette changes (not a breathing loop) |
| 4 | Expression change | brow/eye/mouth state changes |
| 5 | Text card / caption chunk | new word group, number, label |
| 6 | FX | steam, sweat drop, speed lines, impact flash, particles |
| 7 | Prop/character reveal | something enters the frame |
| 8 | Zoom punch / scale snap | ≥8% scale step within a shot |
| 9 | Colour / light shift | grade change, flood, spotlight, vignette |
| 10 | Environment reaction | weather, room tilt, background morph |

A "moving hold" (character idles, camera drifts) is **not** an event. Two events landing on the same frame count once.

### 1.2 Rates that top channels run at
- **[DATA]** 33 long-form faceless/explainer videos, 4,412 scenes: median scene 3.62 s pooled, 3.70 s per video; 18.4% of scenes under 2 s, 62.7% between 2–6 s, only 1.3% over 12 s. Openings (first 30 s) run faster: median 3.10 s vs 3.70 s after, and 22 of 33 videos had a faster opening ([OverseerOS scene-duration analysis](https://www.overseeros.com/blog/how-often-should-visuals-change-youtube-video)). That is roughly 15–19 cuts/min, before counting in-shot events.
- **[OBS]** Railroad Short (Ricks Clips, 1:05): ~15 cuts (avg 4.3 s) **plus** continuous word-by-word captions, whip pans, push-ins and FX; effective event rate est. 1.5–2/s. Yuji/Black Clover (Red Pill POV, 19 min): ASL est. 1.4–1.8 s; setup shots 2.5–3 s; combat 0.6–1.2 s. Jeremy Bearimy crush video (3:38, 1.3M views): new shot every 1.5–3 s with a HUD counter ticking between shots (our studies).
- **[OBS]** The opposite case exists: a 26-minute "hang-out" video with 17 cuts (~90 s per cut) works because its audience wants company, not stimulation ([SozAI transcript](https://sozai.app/transcript/edit-videos-addict-viewers/index.md)). Pace must match the promise. Our promise ("What if you could…") is a stimulation promise.
- **[INF]** Working targets for Social Ripple (per minute of running time):

| Segment | Cuts/min | Total events/s | Max shot without an in-shot event | Text events |
|---|---|---|---|---|
| Hook (0–10 s) | 20–30 | ≥1.5 | 2 s | 1 card/number by 3 s |
| Setup/rules (10–45 s) | 18–24 | ≥1.0 | 3 s | every number, every rule |
| Escalation (45 s–mid) | 15–20 | ≥0.8 | 4 s | key nouns highlighted |
| Midpoint reversal | 20–30 | ≥1.2 | 2 s | 1 black card |
| Low point | 8–12 | 0.4–0.6 | 6–8 s (deliberate hold) | 1 card max |
| Payoff/callback | 12–18 | ≥0.8 | 4 s | callback card |

### 1.3 The "every second" rule and its exceptions
- **[CRAFT]** Staging: present one idea at a time so it is "unmistakably clear" (Thomas & Johnston via [Wikipedia, 12 principles](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)). Density without staging is noise.
- **[CRAFT]** A cut needs ~6–8 frames (0.25–0.33 s at 24 fps) for the audience to understand where they are; no expression change in the first or last 6–8 frames of a shot ([Animation Mentor](https://newsletters.animationmentor.com/newsletter/0206/feature_geek.html)). So the ceiling is ~3 cuts/s and in practice 1 cut per 1.5 s is the fast lane.
- **[DATA]** Deliberate holds: evidence/diagrams 5–12 s, emotional pause "as long as the moment warrants" ([OverseerOS](https://www.overseeros.com/blog/how-often-should-visuals-change-youtube-video)); the Yuji video holds longer on emotional beats with soft piano (our study).
- **[INF]** Rule: a hold is allowed only when it has been *earned* by a spike just before it (riser → silence → hold), and even then something small moves (eyes, breath, a falling leaf) so the frame never reads as frozen.

---

## 2. The first 5 seconds

### 2.1 What makes people swipe in 2 s **[INF, from the data above]**
A frame that resembles "slow content" (static wide, character standing, title card with logo), nothing moving at t=0, no face, no number, narration that starts with context ("On Crumb Island there lives…") instead of consequence. Branded intros hurt retention in the opening seconds ([ytshark](https://ytshark.com/how-to-start-a-youtube-video/), creator blog).

### 2.2 How top animated channels open (shot-by-shot)
1. **[OBS] Railroad Short (Ricks Clips)** – 0.0 s: close-up, saw grinding a rail, caption "He sawed"; 1.0 s: medium, gap finished, captions "gaps into a railroad every 39"; 2.0 s: pan down the track, train rips past; 3.0 s: aerial of two tracks on a canyon; 4–6 s: fast push down the abyss. Device: **visual contradiction** (sabotaging your own work) + **number** (39 feet) + sound on the first frame.
2. **[OBS] Yuji in Black Clover (Red Pill POV)** – 0–5 s: hypothetical posed as a question; 5–18 s: "Not the boy who believes he can save everyone… the Yuji who lost his teacher"; 18 s: split image, happy group photo vs kneeling at a grave. Device: **variant with a wound** + split-image contrast.
3. **[OBS] "What IF You Could See Who Has a Crush on You?" (Jeremy Bearimy, 1.3M)** – starts mid-action with the power visible (glowing threads between people, floating counter) within 5 s; rules by 0:40. Device: **in-medias-res + the power shown, not described**.
4. **[OBS] "The Egg" (Kurzgesagt, 8:06, ~35.6M views per [Rosetta tracker](https://rosetta.to/u/kurzgesagt/topic/philosophy/2019))** – a normal drive, then the narration tells *you* that you died in a car crash ([Laughing Squid](https://laughingsquid.com/?p=776148)). Device: **second-person shock in sentence one**, mundane image turned fatal.
5. **[OBS] Underknown "What If"** – the Shorty entry states the format: grab attention "within the first few seconds", then raise a series of questions answered later as the payoff; target is getting viewers "to the 1-minute mark" ([Shorty Awards](https://shortyawards.com/15th/what-if-what-if-the-largest-asteroid-hit-earth)). Device: **spectacle then stacked questions**.
6. **[OBS] The Infographics Show** – every video is narrated and animated, titles are pure curiosity gaps in second person ("What if you swallowed a grenade?"); their most-viewed video "What Happens When You Die?" is listed at 27.0M ([OutlierKit](https://outlierkit.com/channel/theinfographicsshow), [case study](https://becomeviral.com/blog/infographics-show-case-study)). Device: **the title's promise is restated and visualised immediately**.

**[INF] Six openings designed for Social Ripple with the same devices** (each is a 0–5 s shot list, 24 fps):
7. **Visual contradiction** – 0.0: ECU, a hand drops a perfectly good cake in the bin, SFX thud; 0.8: snap-zoom out, the baker smiling; 1.6: caption "She bins one cake a day"; 2.4: whip pan to a queue of 40 people; 3.5: black card "Why?"; 4.2: cut to the viewer stand-in blinking.
8. **Face reacting first** – 0.0: ECU eyes wide, pupils shrink (expression event); 0.5: pull-back reveals what they see (the power at work); 1.5: number card "20 strangers"; 3.0: whip to the island square; 4.0: narrator: "What if you could…".
9. **Number first** – 0.0: black card, a counter spins up "0 → 73%" with ticks; 1.2: cut, the 73% painted on a person's chest; 2.0: crowd of chests with numbers; 3.0: one chest reads "4%", colour floods cold; 4.0: push-in on that face.
10. **In-medias-res** – 0.0: mid-argument, two characters, speech bubbles slam in; 1.0: a visible thread between them snaps (FX); 1.8: the room tilts; 2.6: caption "Day 3 of the power"; 3.5: freeze frame, arrow points at the thread, "this is the problem".
11. **Question on screen** – 0.0: full-frame text "Would you want to know?"; 0.6: text shatters into particles revealing the island; 1.5: three heads with labels popping ("friend / CRUSH / friend", the Bearimy-style label over heads from our study); 3.0: the labels start swapping; 4.0: the stand-in gulps (expression + sweat drop).
12. **Rule card as hook** – 0.0: paper card slaps in "RULE 1: you can see it. RULE 2: you can't unsee it."; 1.5: card torn away by a whip pan; 2.0: first consequence already happening; 4.0: counter HUD appears.

**[INF] Common structure of all twelve**: an event on frame 0, a face or a number by 1.5 s, the premise *demonstrated* by 3 s, and the first open question by 5 s. Narration starts on the first frame with consequence, not context.

---

## 3. Character depiction

### 3.1 Readability of expressions
- **[CRAFT]** Appeal: "complicated or hard-to-read faces lack appeal"; avoid "twins" (mirrored left/right) which read as dead ([12 principles](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)). Preston Blair's *Cartoon Animation* treats expression as distortion of a solid head while "maintaining the basic volume" ([Animation Resources](https://animationresources.org/category/preston-blair/page/4/)).
- **[CRAFT]** Hold length: forum/teaching sources put the minimum read of an expression at 4–5 frames, 8+ frames for important reads ([Renderosity](https://api.renderosity.com/forums/threads/1472482/print), [Scribd timing handout](https://www.scribd.com/document/191471818/Understanding-Timing-in-Animation)); when you think it is time to move on, "add another 8–10 frames" ([Animation Apprentice](https://animationapprentice.blogspot.com/2025/08/why-animators-should-hold-their-poses.html)). Don't change expression in the first/last 6–8 frames of a shot ([Animation Mentor](https://newsletters.animationmentor.com/newsletter/0206/feature_geek.html)).
- **[INF]** Core set of eight for a cut-out rig, each with a "plus" version: neutral, happy / joy-burst, sad / devastated, surprised / shocked, afraid / panicked, angry / furious (steam), thinking / suspicious (one brow), embarrassed / mortified (blush + shrink). Each is defined by three parameters: brow angle, eye aperture (and pupil size), mouth shape. Readability rules for a flat SVG face:
  - Brows carry 50% of the read; brows alone should distinguish angry (inner ends down) from sad (inner ends up) from surprised (both up, arched).
  - Eye aperture: pupils shrink for fear/shock, dilate for love/wonder; a blink before a change hides the swap.
  - Mouth: open-wide for shock, flat line for suppressed, asymmetric for doubt.
  - A plus-version always adds a *body* change (shoulders up, squash down) and an *FX* (sweat drop, hearts, steam, cracks). The railroad boss's purple face + steam is the model (our study).
- **[CRAFT]** Transitions during a beat: anticipation (a small move in the opposite direction) → snap (2–4 frames) → overshoot → settle (6–8 frames) → moving hold. Williams' "pose-to-pose" with strong keys; the "snap" is what gives motion onset.
- **[INF]** On-screen expression change at least every 4 s while a character is in frame; during dialogue, change on every clause.

### 3.2 Poses that read instantly
- **[CRAFT]** Line of action (one curved spine through the pose), silhouette test (the pose must read as a black shape), avoid twins, exaggeration "with restraint" ([12 principles](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)). Design starts from the silhouette ([CG Wire shape language](https://blog.cg-wire.com/character-shape-language/)).
- **[INF]** For paper cut-outs, build 10–12 stock body poses per character (confident, deflated, lean-in, recoil, point, shrug, hide, run, sit-slump, celebrate, think, plead) each passing the silhouette test, and tween between them with squash/stretch on the torso group only.

### 3.3 Personality through design
- **[CRAFT]** Shape language: circles = safe/friendly, squares = stable/dependable, triangles = menace/energy ([CG Wire](https://blog.cg-wire.com/character-shape-language/), [3dsense](https://3dsense.net/blogs/shape-language-in-character-design-communicating-through-geometry)). Hats and props as instant hierarchy (railroad: engineer cap / bowler / top hat; our study). Colour scripts map emotional tone per scene abstractly before detail (Lou Romano, Pixar, [MoMA audio](https://www.moma.org/audio/playlist/192/2575)).
- **[INF]** Give each island regular one signature silhouette element and one accent colour that we can flood the frame with when that character's emotion peaks.

---

## 4. Scene depiction

- **[CRAFT]** Low angle empowers, high angle "beats them down", and they are paired to show imbalance ([StudioBinder](https://www.studiobinder.com/blog/low-angle-shot/)). Staging directs the eye with placement, light/shadow and angle ([12 principles](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)).
- **[OBS]** Scale exaggeration (canyon "so deep you can't see the bottom"), tools making invisible change visible (caliper on a gap), physicalised emotion (purple face, steam), palette per world state (grey/crimson grief → green/gold home → black/neon fights), invisible things drawn as objects (mana orbs in chests, glowing threads between people) – all from our studies. Ep7 already has rain-on-head and palette systems.
- **[INF]** Staging toolkit for Social Ripple, each a one-event trick:
  - **Isolation framing**: one character small in an empty frame, vignette; the opposite, a crowd crammed to the edges.
  - **Split screen**: what they say / what they think; before / after; you / everyone else. Hard vertical wipe, 6 frames.
  - **Mood floods**: full-frame colour wash on an emotion peak (cold blue for shame, amber for warmth), 4-frame onset, 20-frame fade.
  - **Environment reacts**: clouds gather over one head, the floor cracks under a lie, the room tilts 3° when the stand-in doubts.
  - **Props as metaphors**: a thread, a jar, a weighing scale, a sign over a head, a dial on a chest.
  - **Worm's-eye for authority/shame figures, bird's-eye for "the whole island at once" reveals.**
- **[INF]** Background detail levels: hook and climax shots get the richest backgrounds (depth, props); narration-heavy mid-shots get flat colour or a blurred plate so the character and text are the only onsets. Two-level rule: every shot has one "hero layer" and one "support layer", never three competing.
- **[INF]** Research facts inside the world, not charts: a number becomes a counter on a prop (jar fills, dial turns, rope frays); a percentage becomes a crowd (73 of 100 figures light up); a comparison becomes two characters on a seesaw; an effect size becomes a scale exaggeration (the gap you "can fit a coin in by July"). Ep7's "chart moved into a classroom" is the right direction; the next step is to remove the chart object altogether.

---

## 5. Camera language for 2D (frame counts at 24 fps)

**[DATA]** Punch-in guidance from editing sources: 8–15% scale for reactions, 100→112% over 12–18 frames for subtle emphasis, 115–135% over 6–12 frames for hard punches; 6–10-frame zooms feel like a jolt (use deliberately), 12–24 for quick emphasis, 1–3 s for slow pushes ([Pippit](https://www.pippit.ai/blog/capcut-alternative/capcut-zoom-in-effect), [Cursa](https://cursa.app/en/page/keyframes-in-capcut-smooth-zooms-reframes-and-motion-that-follows-the-subject)). Impact frames: 1–3 frames; smears 1–2 frames; speed lines 1–3 frames ([energy-edits](https://energy-edits.pages.dev/lessons/intermediate/energy-effects), secondary); impact frames as a sakuga device, Yutaka Nakamura lineage ([Know Your Meme](https://knowyourmeme.com/memes/cultures/impact-frames)).

**[INF] Table of moves for the HyperFrames camera group**

| Move | Frames | Easing | Use |
|---|---|---|---|
| Zoom punch (cut-in) | 0 (hard cut, +10–20% scale) | none | emphasis on a word |
| Snap zoom | 4–6 in, hold | expo.out | shock, a number appears |
| Slow push | 48–120 | sine.inOut | dread, intimacy |
| Whip pan | 6–8, with 2-frame directional blur | power4.inOut | change of place, "meanwhile" |
| Camera shake | 6–10 frames, decaying 12 px → 0 | rough/decay | impact, a door slams, a truth lands |
| Handheld drift | continuous ±4 px, 2–3 s period | noise | tension scenes only |
| Parallax layers | bg 0.3×, mid 0.6×, fg 1.2× of camera move | same as move | every push and pan |
| Impact frame | 2 frames inverted/high-contrast | none | reveal, a snap, the twist |
| Speed lines | 3–6 frames radial from the subject | none | lunge, run, "it hits you" |
| Match cut | shape A → shape B aligned, 0 frames | none | jar → moon, dial → clock, callback |
| Freeze + annotation | hold 24–48 frames, arrow draws in 8 | back.out | narrator pointing |

- **[CRAFT]** Slow-in/slow-out: more frames near the extremes, fewer in the middle ([12 principles](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)). For a snap zoom that means two to three frames of nearly all the travel, then a settle.
- **[INF]** Rule: no shot longer than 4 s before the midpoint without a camera move starting in it; every cut that changes location gets a whoosh; every snap zoom gets an impact or tick.

---

## 6. Text moments

- **[DATA]** BBC subtitle practice: max two lines (three only if nothing important is hidden), line length ≤68% of a 16:9 frame width, ~0.3 s per word minimum, 160–180 wpm reading speed, ≥1.5 s between subtitles ([Clevercast summary of BBC guidelines](https://clevercast.com/bbc-subtitling-guidelines)); BBC's online guidance uses an 8% line-height of active video height ([BBC CSUN talk](https://bbc.github.io/csun/how_big_should_subtitles_be/index.html)). Kinetic caption presets: text 7.2% of frame height, weight 900, all caps, stroke 9% of font size ([Burnsub preset](https://burnsub.pages.dev/styles/hormozi-bold-white)); 1–4 words at a time (railroad study; [SozAI editing transcript](https://sozai.app/transcript/edit-videos-addict-viewers/index.md) says ≤3 words).
- **[DATA]** Shorts safe zones vary by guide; a conservative central 900×1400 px zone in 1080×1920 with ~350–400 px bottom clearance and ~200 px top clearance ([Reap](https://reap.video/blog/short-form-video-safe-zones), [Vidpros](https://vidpros.com/vertical-video-safe-zone/)). For 16:9 keep text in the central 90% vertically / 75% horizontally (BBC).
- **[OBS]** Railroad: white words with yellow keywords, thick black outline + drop shadow, centred lower-third, popping per syllable. Yuji: crumpled-paper rule cards. Bearimy: labels over heads, a floating counter.
- **[INF] Norms for Social Ripple**
  - **Kinetic captions**: 1–3 words, 6–7% of frame height, white, brand yellow on the key noun/number, 3–4% stroke, 2-frame pop (scale 0.8→1.05→1), never over a face.
  - **Black word cards**: one line, ≤5 words, 9–12% of frame height, hold 0.8–1.5 s, hard cut in, SFX: music mutes. Use at: the premise question, each rule, the midpoint reversal, the research reveal, the callback. Max 6 per 4-minute episode; the railroad Short uses none and relies on captions, so cards are a spice, not a base.
  - **Narrator pointing**: freeze frame, arrow/circle draws in over 8 frames, label in the caption style, hold 1–2 s. Use when the research fact is on screen.
  - **Counters**: tick SFX per step, monospaced digits, placed on a prop, not a HUD box, to keep the calm tone (Bearimy's HUD is a what-not-to-copy per our study).
  - **Every number spoken gets a text event** on the same frame as the word.

---

## 7. Story creation for this format

- **[OBS]** Beat structure shared by the viral references (our studies): hook (contradiction/variant) → rules stated on cards and tested within seconds → escalation of wins → midpoint reversal (the cost appears) → low point → payoff that re-reads the opening → callback image. Yuji: re-hook every ~30 s, open loops ("which squad?"); Bearimy: rules by 0:40, cost → obsession → choice; railroad: misdirection (the hero looks wrong) → the science arrives as the twist.
- **[CRAFT]** But/Therefore rule (Parker & Stone): scenes must connect with "but" or "therefore", never "and then" ([Perell](https://perell.com/note/but-therefore-rule/), [Cheat Sheet](https://www.cheatsheet.com/entertainment/south-park-trey-parker-and-matt-stone-1-rule.html/)). Dan Harmon's story circle for the shape: need → go → search → find → take → return → change ([Industrial Scripts](https://industrialscripts.com/dan-harmons-story-circle/)).
- **[DATA]** Information-gap theory: pose the question at a knowable gap ([journalofcognition](https://journalofcognition.org/articles/10.5334/joc.501)). Retention guides recommend an engaging moment every 20–40 s and 30–60 s mini-arcs ([LongStories benchmarks](https://longstories.ai/blog/retention-benchmarks-animated-youtube-videos), vendor guidance).
- **[INF] Script rules for Social Ripple**
  1. Sentence one is a consequence with a number or a contradiction. Never a setting.
  2. Rules on screen by 0:30, first rule tested by 0:40.
  3. A new "but" every ~30 s; write the open loop as a literal question in the script ("but what happens when…?") and put it on a card or in the narrator's pointing beat.
  4. Specificity: "20 strangers vs 10", "a coin in May, a sheet of paper by July" (railroad). Replace every "a lot", "many", "some" with a number or an image.
  5. Misdirection: let the viewer and the stand-in believe the wrong theory for 60–90 s. The research fact is the twist that proves them wrong (Ep8 plan in our notes).
  6. Research fact → plot twist recipe: (a) show the effect before naming it; (b) the stand-in misreads it; (c) the cost arrives; (d) a prop/tool measures it (caliper moment); (e) name the study in one line, inside the world ("the island's doctor calls it the liking gap"); (f) the same prop returns transformed in the callback.
  7. Every sentence has a picture. Write the script in two columns: words | the onset the viewer sees on that line. A line with no onset gets cut or merged.
  8. The narrator voices short character lines (railroad), tone shifting per beat: deadpan → mysterious → ominous → fast.
  9. End on the opening image transformed (grave → log with a friend; umbrella alone → shared umbrella).

---

## 8. Sound as energy

- **[OBS]** Railroad: every action has a sound (saw, hiss, click-clack, groan, boom, then a hard stop at the explosion). Yuji: SFX "extremely high" in action, sub-bass drops on emotional flips, music per act, piano for the ending (our studies).
- **[DATA]** Three effects cover most story cuts: whooshes on movement/cuts, risers into reveals, impacts on emphasis; whoosh-into-impact makes a cut stand out, riser-into-silence hits harder than a sound that carries through ([SozAI, Tim Runia](https://sozai.app/transcript/three-sound-effects-tell-any-story/index.md), [Morphic whoosh notes](https://morphic.com/resources/sounds/whoosh-sound-effect)). Pause the music at key moments to create a jolt ([SozAI editing transcript](https://sozai.app/transcript/edit-videos-addict-viewers/index.md)). Narration pace: 140–160 wpm conversational, 120–140 for complex passages ([The Speaker Lab](https://thespeakerlab.com/blog/average-words-per-minute-speaking/)).
- **[INF] Rules**: one SFX per visual event type 1–4 and 6–8 (cuts, camera starts, snaps, FX, reveals, zoom punches); captions get a soft tick only on numbers; colour floods get a low swell. Silence (music mute + room tone) for 0.5–1.0 s before every reveal card. A music change at every act boundary. Voice: the narrator's pitch and pace should change at least at every "but", and character lines are performed, not read. Keep peaks calm-loud, not scream-loud (therapeutic tone), using sub-bass and silence instead of volume.

---

## 9. Viral-video anatomy table

All per-minute figures are **estimates** unless marked measured; "measured" means our Gemini pass counted them and is itself approximate.

| Video (channel) | Views / length | Cuts/min | Text events | Expression changes/min | Opening device | Structure | Confidence |
|---|---|---|---|---|---|---|---|
| Why Perfect Railroads Don't Work (Ricks Clips, Short) | views not found; 1:05 | ~14 (15 cuts, measured) | continuous 1–4-word captions, yellow keywords, ~60–80 chunks est. | ~10–14 est. | visual contradiction + number ("every 39 feet") | setup → mockery → summer twist → explosion | medium |
| What If Modulo Yuji Was in Black Clover? (Red Pill POV) | views not found; 19:10 | ~33–43 est. (ASL 1.4–1.8 s) | rule cards on paper, ~20–30 cards est. | ~8–12 est. | variant with a wound; grave vs group photo | hook → rules → exam → escalation → devil → low point → home | medium |
| What IF You Could See Who Has a Crush on You? (Jeremy Bearimy) | 1.3M in 3 days; 3:38 | ~20–40 est. (new shot every 1.5–3 s) | floating counter + head labels, ~30+ est. | ~10 est. | in-medias-res, power visible by 5 s | rules by 0:40 → wins → obsession → choice | medium |
| The Egg (Kurzgesagt) | ~35.6M per tracker; 8:06 | ~10–15 est. | few; title only est. | low (birds, abstract figures) | second-person death in sentence one | dialogue with God, ascending reveal | low–medium |
| What Happens When You Die? (The Infographics Show) | 27.0M per OutlierKit; length not confirmed | ~15–20 est. | labels and numbers, frequent est. | ~6–10 est. (simple rigs) | second-person scenario stated and drawn at once | question → stages → consequences | low |
| What If the Largest Asteroid Hit Earth (Underknown What If) | series-level: 2B+ views, 450M watched min/month; episode length not given | n/a | questions stacked early | n/a | spectacle then stacked questions, aim at the 1-minute mark | question → science → payoff | low |

**[INF] Reading the table**: the two videos we measured most closely run ~14 and ~35+ cuts/min, both with text in motion almost continuously; our episodes were at 6–12 cuts/min (5–10 s shots, per our Bearimy study) with charts instead of kinetic text. The gap is 2–3× in cut rate and ~10× in text events.

---

## 10. Checklist + scorecard (apply before publishing)

Score each item 0/1 (or the stated points). Ship threshold: **≥ 24/30** and no zero in the opening audit.

**A. Opening audit (10 points, 0–10 s)**
1. An onset on frame 0 (motion, SFX, caption) – not a fade-in.
2. A face or a number visible by 1.5 s.
3. Sentence one is a consequence/contradiction with a specific number or image.
4. The premise is *shown* working by 3 s.
5. ≥1.5 visual events/s across 0–10 s (count them).
6. No shot >2 s without an in-shot event.
7. A question (card, narrator, or label) by 5 s.
8. No logo, no "welcome", no setting description.
9. Title/thumbnail promise matched on screen within 10 s (YouTube's Intro-metric advice).
10. Sound: SFX on the first frame, music starts under the first word, first whoosh on the first cut.

**B. Body (20 points)**
11. Rules on screen by 0:30; first test by 0:40 (2 pts).
12. Average shot ≤3.5 s before the midpoint; ≤4 s after (2 pts).
13. No shot >4 s before the midpoint without a camera move starting in it (2 pts).
14. Expression change ≥ every 4 s while a character is on screen; on every clause in dialogue (2 pts).
15. Text event at every spoken number; kinetic captions on key nouns (2 pts).
16. A "but" / open loop every ≤35 s, written as a question (2 pts).
17. One physicalised emotion peak (steam, flood, tilt, weather) per act, each with a sound (2 pts).
18. Research fact delivered inside the world via a prop/tool/crowd, no chart object (2 pts).
19. Reveal rhythm: riser → 0.5–1 s silence → card/impact, at the midpoint and the twist (1 pt).
20. Deliberate holds ≤2 per episode, each earned by a spike and with a micro-motion (1 pt).
21. Palette shifts per world state at every act boundary (1 pt).
22. Callback: the final image is the opening image transformed (1 pt).

**Measurement**: export the event log from the composition (every GSAP tween start, cut, caption chunk and FX trigger with its time) and compute events/s per segment automatically; watch the first 30 s with sound off and count onsets by hand once.

---

## 11. The 20 most impactful changes, ranked, with pipeline implementation

Pipeline assumptions: SVG cut-out characters as grouped layers, HyperFrames HTML compositions on a single GSAP timeline, word timings already available for every narration line (per our notes).

1. **Rebuild the first 10 s as an onset storm (≥1.5 events/s, face or number by 1.5 s).** Implement: a dedicated `hook` sub-composition with its own faster timing table; lint rule that fails the build if the first tween starts after frame 0 or any 2 s window has <2 events.
2. **Start every episode mid-action with the power already working.** Implement: script template whose first two lines are "consequence + number"; the opening scene reuses the climax scene's assets so the callback is free.
3. **Word-by-word kinetic captions with yellow keywords (1–3 words, 6–7% frame height).** Implement: a caption layer generated from word timings; keyword list per line in the script JSON; 2-frame pop (scale 0.8→1.05→1) per chunk; stroke 3–4% of font size; never over faces (collision check against face bounding boxes).
4. **Cut rate 15–20/min in the body, 20–30 in the hook, with 6–8-frame bookends free of expression changes.** Implement: scene planner that splits long narration shots at clause boundaries and alternates shot size (wide → medium → close) automatically.
5. **Camera group on every scene: punch-ins on key words, slow push by default.** Implement: wrap each scene in a `camera` group; GSAP scale/translate keyframes from the move table in §5; default slow push 100→106% over the shot; snap zoom 4–6 frames with expo.out on every number word.
6. **Expression engine with 8 core + 8 plus states, 4-frame snaps and moving holds.** Implement: SVG `<g>` per feature (brows, eyes, pupils, mouth) with named states; a `setExpression(char, state, t)` that inserts anticipation (2 frames opposite), snap (3 frames), overshoot, settle; blink inserted before each swap; hold ≥8 frames; plus-states auto-attach FX (sweat, steam, hearts, cracks) and a body squash.
7. **Physicalised emotion peaks with sound: steam, colour flood, room tilt, weather.** Implement: a full-frame flood layer (mix-blend-mode, 4-frame in, 20-frame out), a `tilt` on the scene group (3°, 6 frames), the existing Ep7 rain system; each paired to an SFX cue by name.
8. **Replace every chart with a prop, tool or crowd.** Implement: a "counter-on-prop" component (jar fill, dial, rope fray, crowd-light-up of N/100 figures) driven by a number and a duration; rule: no `<chart>` block in episodes.
9. **Rule cards on paper by 0:30, torn away by a whip pan.** Implement: card component (paper texture, hand-set type 9–12% height), whip-pan transition 6–8 frames with 2-frame directional blur; cards also used for the midpoint reversal and the research reveal.
10. **Open loop every ≤35 s, written as an on-screen question.** Implement: script schema field `loop_question` per 30 s block; the composition renders it as a card or narrator-pointing beat; build warns if any 35 s span lacks one.
11. **Riser → silence → impact at every reveal.** Implement: audio cue macro `reveal(t)` that schedules a riser ending at t−0.6 s, mutes music t−0.6 → t, drops an impact at t, with the card/snap zoom on the same frame.
12. **Whoosh on every location cut; impact/tick on every snap zoom and number.** Implement: SFX auto-attached from the event log by event type; a per-episode budget so density stays high but not constant (no SFX on breathing loops).
13. **Misdirection structure: the stand-in believes the wrong theory for 60–90 s.** Implement: beat sheet template with "false theory" and "caliper moment" fields; storyboard review checks that the fact is never *stated* before it is *shown*.
14. **Narrator pointing: freeze frame + arrow/circle + label.** Implement: `annotate(target, text)` block: freeze (clone of the current frame), arrow path draw-in 8 frames with back.out, label in caption style, hold 1–2 s, resume with a whoosh.
15. **Parallax on every push/pan (bg 0.3×, mid 0.6×, fg 1.2×).** Implement: scenes authored in three depth groups; the camera group's transform is multiplied per layer. Cheap, and it makes every move feel like real camera motion.
16. **Isolation framing and split screens for relationship beats.** Implement: layout presets (`alone`, `crowded`, `split-v`, `split-h`) that re-stage existing scene assets; split wipe 6 frames.
17. **Impact frames and speed lines on the three biggest hits per episode.** Implement: a 2-frame inverted/high-contrast overlay of the current frame; radial speed-line SVG masked around the subject for 3–6 frames; reserve for the premise demo, the midpoint, and the twist.
18. **Palette per world state at act boundaries.** Implement: CSS variables for the five palette states (Ep7 has the grade system); switch with a 12-frame cross-fade at each act marker in the beat sheet; the flood layer reuses the same variables.
19. **Narrator performance: tone shifts at every "but", voiced character lines.** Implement: script markup for `[deadpan]`, `[ominous]`, `[fast]`, `[character:Name]`; keep narration at 140–160 wpm with 120–140 in rule passages; acted lines via the existing voice setup.
20. **Automatic energy report per build.** Implement: after render, emit events/s per 10 s window, cuts/min, text events, expression changes, longest shot, and the §10 score; block publishing below 24/30. This is what makes the other 19 stick.

---

## Sources

- YouTube Help, audience retention report: https://support.google.com/youtube/answer/9314415
- OverseerOS, scene-duration analysis (33 videos, 4,412 scenes): https://www.overseeros.com/blog/how-often-should-visuals-change-youtube-video
- LongStories, retention benchmarks for animated videos (vendor, unsourced figures): https://longstories.ai/blog/retention-benchmarks-animated-youtube-videos
- Huston & Wright formal-features model, summary: https://pmc.ncbi.nlm.nih.gov/articles/PMC3305831
- Yantis & Jonides 1984, abrupt onsets: https://researchgate.net/profile/Steven-Yantis/publication/16958392_Abrupt_visual_onsets_and_selective_attention_Evidence_from_visual_search/links/0046351b7673aea58b000000/Abrupt-visual-onsets-and-selective-attention-Evidence-from-visual-search.pdf
- Abrams & Christ 2003, motion onset captures attention: https://pubmed.ncbi.nlm.nih.gov/12930472/
- Faces capture attention (2017): https://link.springer.com/article/10.3758/s13414-017-1313-x
- Loewenstein information-gap theory, review: https://journalofcognition.org/articles/10.5334/joc.501
- Facebook/Fors Marsh feed attention (1.7 s; 3 s → 65% to 10 s): https://www.socialmediatoday.com/news/facebook-releases-new-guide-to-help-advertisers-maximize-video-ad-performan/450818
- TikTok 63% first-3-seconds claim (unverified methodology): https://influencermarketinghub.com/viral-tiktok-hooks-examples/
- Twelve basic principles of animation (Thomas & Johnston): https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation
- Animation Mentor, 6–8 frames to register a cut: https://newsletters.animationmentor.com/newsletter/0206/feature_geek.html
- Animation Apprentice, hold poses 8–10 frames longer: https://animationapprentice.blogspot.com/2025/08/why-animators-should-hold-their-poses.html
- Renderosity thread, 8+ frames to read an expression: https://api.renderosity.com/forums/threads/1472482/print
- Timing in animation handout, 4–5 frame reads: https://www.scribd.com/document/191471818/Understanding-Timing-in-Animation
- Animation Resources, Preston Blair lessons: https://animationresources.org/category/preston-blair/page/4/
- Shape language: https://blog.cg-wire.com/character-shape-language/ and https://3dsense.net/blogs/shape-language-in-character-design-communicating-through-geometry
- Lou Romano colour scripts (MoMA): https://www.moma.org/audio/playlist/192/2575
- StudioBinder low-angle shot: https://www.studiobinder.com/blog/low-angle-shot/
- Punch-in timing guides: https://www.pippit.ai/blog/capcut-alternative/capcut-zoom-in-effect and https://cursa.app/en/page/keyframes-in-capcut-smooth-zooms-reframes-and-motion-that-follows-the-subject
- Impact frames: https://knowyourmeme.com/memes/cultures/impact-frames ; frame counts (secondary): https://energy-edits.pages.dev/lessons/intermediate/energy-effects
- BBC subtitling guidelines summary: https://clevercast.com/bbc-subtitling-guidelines ; BBC 8% line height talk: https://bbc.github.io/csun/how_big_should_subtitles_be/index.html
- Kinetic caption preset (7.2% height, 9% stroke): https://burnsub.pages.dev/styles/hormozi-bold-white
- Shorts safe zones: https://reap.video/blog/short-form-video-safe-zones and https://vidpros.com/vertical-video-safe-zone/
- But/Therefore rule: https://perell.com/note/but-therefore-rule/ and https://www.cheatsheet.com/entertainment/south-park-trey-parker-and-matt-stone-1-rule.html/
- Dan Harmon story circle: https://industrialscripts.com/dan-harmons-story-circle/
- Editing pace vs audience expectation, ≤3-word captions, music pauses: https://sozai.app/transcript/edit-videos-addict-viewers/index.md
- Three sound effects (whoosh, riser, impact): https://sozai.app/transcript/three-sound-effects-tell-any-story/index.md ; whoosh timing: https://morphic.com/resources/sounds/whoosh-sound-effect
- Narration pace: https://thespeakerlab.com/blog/average-words-per-minute-speaking/
- Kurzgesagt "The Egg" opening: https://laughingsquid.com/?p=776148 ; view tracker: https://rosetta.to/u/kurzgesagt/topic/philosophy/2019
- Underknown "What If" Shorty entry: https://shortyawards.com/15th/what-if-what-if-the-largest-asteroid-hit-earth
- The Infographics Show: https://outlierkit.com/channel/theinfographicsshow and https://becomeviral.com/blog/infographics-show-case-study
- MrBeast handbook coverage (first minute "most important"): https://passionfru.it/mrbeast-leaked-document-81151/ and https://www.creatorhandbook.net/leaked-document-allegedly-reveals-mrbeasts-secrets-to-youtube-success-the-key-takeaways/
- Branded intros hurt early retention (creator blog): https://ytshark.com/how-to-start-a-youtube-video/
