# Social Ripple v2: the study, 10 years of viral topics, and the design upgrade (2026-11-01)

## 1. The reference video

Danny Why, "Claude Code Monetized My YouTube Channel in 14 Days" ([youtu.be/QDEFSbl8BxY](https://youtu.be/QDEFSbl8BxY), 12:02). Gemini's notes are in `forensics/`.

**Results shown on screen:** a new channel of 20–30 s "random facts" Shorts in a **2D cut-out cartoon** style ("Zack D. Films, but 2D"; TheOdd1sOut-like characters).
- 30.3M views and +14.8k subscribers in 28 days.
- 3M views in the last 48 h.
- Monetized after 2 weeks: $27, then $163 on its first two paid days.

**Pipeline:**
1. Claude Code (Opus 5.5, max effort) with a Higgsfield MCP connector.
2. Prompt 1 researches viral fact topics and writes a 50–70-word script.
3. A `cutout-cartoon-shorts` skill:
   - generates around 10 PNG poses in one style and cuts them into clean sprites;
   - measures hand, foot and anchor points, and lines the poses up by head circle;
   - writes Remotion code at 60 fps;
   - uses ElevenLabs, a "normal person, not a narrator" voice, with word timings;
   - lands every visual change on a word;
   - chooses sound effects by analysing about 12 candidates per sound;
   - outputs 4K vertical.

**Style rules quoted in the video:**
- Frame 1 is the premise: centred, big-headed, and named by the first spoken line.
- The camera glides in over about 1 s.
- Characters jitter slightly, like hand-drawn line art.
- Every pose has subtle life.
- The last frame loops.

**What it means for us:**
- The look that wins right now is **cut-out cartoon**: bold ink outlines, flat fills, big expressive heads, mitten hands, and squash and stretch.
- Sound is designed per action and synced to words.

Our engine already did most of this in code with no image model (deterministic, no credits). v2 adds the missing layer: fuller characters, richer sets, and sound and lip-sync tied to the voice.

## 2. Ten years of viral topics (what to make next)

`results.tsv` holds 1,071 results: 40 searches, each sorted by view count, both all-time and this year. Music and kids' content are filtered out of the conclusions.

| What went viral | Examples (views) | What it tells us |
|---|---|---|
| **Wordless animated shorts with a moral twist** | Pip 557M · POUR 585 276M · Fugu 245M · Watermelon 217M · Mind Games 129M · Hair Love 121M · Organ Story 108M · The Spider and the Butterfly 102M · Steve Cutts "Happiness" 60M · Timber (solidarity) 80M | Emotion and a twist beat explanation. Universal stories travel across languages. Every film needs one image people remember. |
| **Kindness that comes back around** | Life Vest Inside "Kindness Boomerang – One Day" **41.5M** · Viddsee "Ripple" 12.3M · this year "Kindness always finds its way back" 27M and "Kindness changes everything" 52M (Shorts) | This is **exactly** our premise, already proven at scale, and it's trending again this year as Shorts. |
| **Collective-behaviour explainers** | CGP Grey "Traffic Has a Perfect Solution. Humans Are the Problem." **44.6M** · Vsauce "What If Everyone JUMPED At Once?" 40.4M · Veritasium six degrees 11.4M · Stanford Prison Experiment (Vsauce) 17M | "What if everyone…" and "why crowds do X" are mass-appeal formats. Episode ideas 8 (traffic jams) and 13 (thresholds) are strong. |
| **Moral-consequence stories** | Dhar Mann: "Rude Bartender Humiliates A Poor Woman, She Instantly Regrets It" 22.6M · "Girl SPREADS RUMORS In Her SCHOOL" 17.1M · free haircuts for the homeless 15.5M | Karma arcs, where the rude person learns, are huge. Our red-then-gold structure fits them, without the clickbait. |
| **Psychology made simple** | Bright Side "19 Psychological Tricks" 35M · TED-Ed depression 27M and lying 23M · Kurzgesagt "The Egg" 36M · Tim Urban procrastination 62M · "You are contagious" (TEDx) 6.6M | Personal, usable psychology wins. "You are contagious" is our thesis in one line. |
| **Stick-figure action** | Alan Becker "Animation vs." (hundreds of millions) | The stick-figure audience is enormous. It rewards physics, comedy and spectacle. |
| **History's small mistakes** | "Every Major Human Mistake That Changed History" 7.9M · "Small Mistakes With HUGE Consequences" 6.1M | Butterfly-effect history is a steady mid-size performer. |

**Avoid:** kids' habit content (huge views but "made for kids", so low earnings), and music-led searches.

**Episode 2 shortlist, ranked by proven demand plus fit:**
1. **The Traffic Jam With Nobody to Blame.** The phantom jam, from the Sugiyama 2008 experiment. CGP Grey's 44.6M proves the demand. Comedy: every driver blames everyone else.
2. **What If Everyone Was Kind for One Day?** A collective what-if (Vsauce's format) built on kindness-cascade research (Fowler & Christakis 2010: generosity tripled).
3. **Why a Lie Travels Faster Than the Truth.** Rumours (Dhar Mann's 17M) plus the Vosoughi 2018 *Science* study: false news was 70% more likely to be retweeted.
4. **The Kindness Boomerang, decoded.** The science of why kindness comes back (Kumar & Epley 2022).

## 3. The design upgrade (v2 engine)

`engine/sr-v2.js` loads after `sr-engine-v1.js`. It replaces `SR.Character` and `SR.Crowd`, and adds `SR.Scene2`, `SR.FX` and `SR.Life`. Episode 1 stays reproducible with v1. The before/after is in `before-after.jpg`, and the style test is `social-ripple-style-v2.mp4` (15 s, with sound).

### Characters: same silhouette heads, fuller bodies

- **Bodies:**
  - a bean-shaped garment torso with a bold ink outline, a clipped cel shadow and a highlight;
  - outfit details: hoodie with pocket and drawstrings, shirt with collar and buttons, jacket with zip and lapels, apron, coat, tee, dress.
- **Limbs:** outlined sleeves with cuffs, outlined trousers in their own colours, shoes with soles, mitten hands with thumbs, and a neck.
- **Heads:**
  - the channel's ink heads, now with a soft specular highlight;
  - eye glints and darting pupils;
  - rosy blush when happy, and a tongue when the mouth opens wide;
  - 8 hair styles with highlights.
- **Motion:**
  - stride now matches the leg swing exactly, so no foot sliding;
  - ponytail sway, head lag and idle breathing;
  - **lip-sync** driven by each voice clip's loudness (`tools/lips.py` writes `assets/lips.js`).

### Scenes (`SR.Scene2`)

- **Sky:** gradient skies with a soft sun halo.
- **Distance:** a hazy far layer with parallax for atmospheric depth.
- **Buildings:** facades with cornices, framed windows (some lit, some with curtains or plants, all with glass reflections and sills), rooftop units, ground shadows.
- **Streets:** tiled sidewalks, curbs, road texture.
- **Props:** hydrant, bin, planter, bike, lamp, a fuller tree, and a richer shopfront (glass reflections, glazed door, brass handle, striped awning, framed sign).
- **Interiors:** wainscoting, framed art, shelves of cups, warm pools of pendant light.
- **Finish:** a subtle vignette.

### Life and effects (`SR.Life`, `SR.FX`)

- **Life:** drifting clouds, flapping birds, falling leaves, background traffic, steam.
- **Effects:** dust puffs on every footfall, speed lines, sweat drops, anger marks, sparkles, hearts, impact bursts.

### Sound v2 (`tools/sound_kit2.py`, `tools/mix_demo.py`)

- **Footsteps:** heel and toe, 6 variants each on concrete and on wood, **placed on the walk cycle's actual footfalls**.
- **Small Foley:** cloth rustles on gestures, and a soft "boop" when a speech bubble pops.
- **Voices:** characters speak their bubbles (Kokoro voices), with short reactions ("Huh?", "Oh!", "Ha ha!", "Aww", "Yay!").
- **Room sound:** reverb per location (street, café, hall) and panning by screen position.

**Known limit:** Kokoro has no child voices. A slight pitch-up is the compromise. For child characters, keep lines short, or let a bubble carry them silently.
