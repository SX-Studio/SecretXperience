# Social Ripple: topic research (measured 2026-11-01)

**The short version.** In our niche, successful channels don't choose "a topic". They choose **one high-demand word** (Discipline, Intelligence, Loneliness, Gen X, Charisma) and put it inside a **frame** that promises the viewer something about themselves.

The cleanest example is "**Psychology of [Word]**". Across 72 such titles the median video got **6.0× its channel's usual views**, and **57%** were outliers. The base rate across all 4,385 videos was 17.5%.

The same word on its own does badly. Bare one- or two-word titles had **5%** outliers, below the base rate.

So the recipe is **word + frame + promise**. Our version adds a fourth part, **the ripple**: how this word passes between people.

---

## 0. Method and data quality (read this first)

| What | Detail |
|---|---|
| Channels | **37 channels**, plus 5 Shorts tabs. 4,385 videos had usable view counts. Of those, **767 are outliers (≥3×)**. |
| Source | `yt-dlp --flat-playlist` on each channel's `/videos` (and `/shorts`), newest 150 uploads. Metadata only: no downloads, run at `nice 19`. |
| Outlier rule | views ÷ channel median ≥ 3× = outlier; ≥ 5× = strong. The median is taken over the same ≤150 uploads. |
| Search demand | YouTube autocomplete (`suggestqueries…ds=yt`) for 60 words and 12 angle prefixes, each expanded A–Z (about 2,700 suggestions). Also YouTube search sorted by views and filtered to **this year (2026)**: 20 discovery queries, 60 topic-word queries and 20 phrase queries. |
| Studies | The key anchors were checked by web search today: Mastroianni & Gilbert 2023, Cohn 2019, Hall 2018, Protzko & Schooler 2019, Woolley 2010, Engert 2014, Robbins & Karan 2019, Lynn's tipping meta-analyses. Others are marked **(verify)**: they are cited from memory and must be checked before scripting, per THE-LENS rule 6. |

**Limits. These are honest caveats.**
1. **Flat-mode view counts are rounded** to two significant figures (e.g. 6.3M), except in search results, which are exact.
2. **There are no upload dates in flat mode.** So the newest few uploads per channel are under-counted, and multipliers mix old and new videos.
3. **A channel's median depends on its history.** New channels have tiny medians from their pre-breakout videos, so their hits show huge multipliers: PsychToons' median is 4,750, so a 4.5M video reads as 947×. To control for this, I report a **channel-balanced score** that counts at most the top two outliers per channel per topic, and I count how many channels have the outlier.
4. **One channel supplies most of the "Psychology of X" outliers.** PsychToons accounts for 32 of them. Without PsychToons, the formula's outlier rate is about 26%, still above the 17.5% base, and it holds at Big Brain Explains (4 of 4) and Psychology Simplified.
5. **YouTube's view-sorted search returns off-topic matches**, such as music videos for "tip". Demand sums are therefore **rough proxies**; the top relevant video titles are the real evidence.
6. **Handles that didn't resolve or were the wrong channel:**
   - "Behavior Lab" and "Jacob Morgan": the handle @JacobMorgan is a future-of-work podcast, not animation. Both were excluded.
   - Day One Films is `@dayonefilmsofficial`. Einzelgänger is `@Einzelgänger`. Andrew Kirby is `@AndrewKirbys`. Wendover is `@Wendoverproductions`. Sprouts is `@sprouts`.
   - Brainosophy has only 2 uploads (6.4M and 4.6M), which is too few for a median; it was excluded but noted.
   - **Copycat evidence:** Humanss Explained re-uses EverythingProfessor's exact titles and gets **1.6K–8K views**. Copying titles gets nothing; copying *patterns* does.

### Data files (`scratchpad/topics/data/`)

| File | Contents |
|---|---|
| `all_videos.tsv` | Every video: channel, title, views, duration, id, channel median, multiplier, flag |
| `outliers.tsv` | The 767 outliers, sorted by multiplier |
| `channel_summary.tsv` | Median, maximum and outlier counts per channel and tab |
| `topic_rank.tsv` / `angle_rank.tsv` | Ranked core-topic and angle tables: counts, lift, median multiplier, weighted and balanced scores, top examples |
| `one_word_core.tsv` | The extracted single-word cores ("Psychology of X", "X \| An Animated Short Film", "The X Effect", "Every X", "X Explained") with their multipliers |
| `shortlist_evidence.tsv` | Evidence for the 30-word shortlist |
| `search/demand.tsv` | Autocomplete counts and 2026 view sums for 60 words |
| `search/autocomplete_prefixes.tsv` | A–Z autocomplete for "psychology of", "the psychology of people who", "why do we", "why do people", "levels of", "every type of", "what if everyone", "the dark side of", "why is everyone so", "why are people so", "explained with", "the science of" |
| `search/discovery_2026.tsv`, `search/phrase_2026.tsv` | The 2026 view-sorted searches |
| `raw/` | Raw per-channel pulls |
| `weekly/` | Output of the weekly routine (first run: `2026-11-01.tsv`) |

Scripts are in `scratchpad/topics/scripts/`: `fetch.sh`, `outliers.py`, `topics.py`, `demand.py`, and `weekly.sh` (the 1-hour routine; see §9).

---

## 1. The channels measured

Medians come from the newest ≤150 uploads; "new" marks channels discovered through this year's view-sorted searches.

| Channel | Type | n | Median views | Max | ≥3× | ≥5× |
|---|---|---|---|---|---|---|
| Kurzgesagt | science/society | 150 | 10,000,000 | 89M | 3 | 1 |
| Johnny Harris | geopolitics | 146 | 3,600,000 | 17M | 4 | 0 |
| Historically (new) | animated history | 23 | 2,300,000 | 10M | 2 | 0 |
| Wendover | systems | 150 | 1,800,000 | 10M | 8 | 1 |
| PolyMatter | systems | 150 | 909,000 | 7.6M | 18 | 3 |
| How Money Works | money | 150 | 889,500 | 3.9M | 8 | 0 |
| RicksClips3000 (Shorts) | animated history Shorts | 146 | 665,500 | **30M** | 50 | 35 |
| After Skool | animated philosophy | 143 | 613,000 | 8.6M | 19 | 6 |
| Economics Explained | money | 150 | 587,500 | 3.6M | 11 | 2 |
| Charisma on Command | social skills | 149 | 542,000 | 18M | 33 | 25 |
| Better Ideas | self-improvement | 128 | 532,000 | 12M | 28 | 14 |
| Primate Economics (new) | animated econ ("with bananas") | 17 | 457,000 | 1.7M | 3 | 0 |
| Crayon Capital (new) | animated econ ("like you're 5") | 33 | 421,000 | 4.2M | 5 | 3 |
| TED-Ed | animated edu | 146 | 408,000 | 7.9M | 16 | 6 |
| Pursuit of Wonder | philosophy | 150 | 395,000 | 6.0M | 29 | 18 |
| Einzelgänger | philosophy | 150 | 314,500 | 4.8M | 33 | 16 |
| EverythingProfessor (new) | "Every X Explained" | 94 | 200,500 | 5.9M | 23 | 13 |
| The School of Life | relationships | 150 | 188,500 | 2.0M | 21 | 7 |
| Two Cents (PBS) | money | 150 | 176,500 | 3.5M | 10 | 2 |
| Ifverse | animated what-if | 15 | 170,000 | 4.6M | 4 | 2 |
| Mind. (new) | "Every Type of [Person] Explained" | 11 | 164,000 | 770K | 4 | 0 |
| Sprouts | animated psych | 150 | 158,500 | 19M | 42 | 29 |
| Aperture | philosophy/society | 150 | 120,500 | 3.4M | 34 | 23 |
| Day One Films | animated one-word short films | 17 | 92,000 | 5.6M | 3 | 3 |
| Monk Mode Films (new) | animated one-word short films | 18 | 86,500 | 2.3M | 6 | 2 |
| Practical Psychology | animated psych | 150 | 77,500 | 2.7M | 29 | 22 |
| Andrew Kirby | self-improvement | 150 | 62,000 | 4.3M | 28 | 15 |
| Psych2Go | animated psych | 136 | 59,000 | 1.4M | 20 | 12 |
| Mindplicit | philosophy/"Machiavelli" | 150 | 51,000 | 1.5M | 22 | 13 |
| Five By Nine | lifestyle neuroscience | 150 | 20,000 | 5.1M | 45 | 30 |
| Apex Psychology (new) | animated psych | 120 | 16,000 | 2.8M | 36 | 22 |
| Sticko Explains (new) | stick-figure parenting psych | 144 | 14,500 | 1.6M | 41 | 29 |
| Psychology Simplified (new) | animated psych | 143 | 14,000 | 3.4M | 48 | 33 |
| PsychToons (new) | animated psych | 140 | 4,750 | 4.5M | 55 | 49 |
| Big Brain Explains (new) | animated psych | 31 | 3,800 | 5.9M | 7 | 6 |
| Vaulten (new) | animated psych | 22 | 1,600 | 2.8M | 3 | 2 |
| Psych2Go (Shorts) | | 150 | 55,000 | 1.9M | 6 | 3 |

**What this table says about the "new channel" thesis in the transcript.** At least six young animated psychology channels went from a few thousand views per upload to 1–6M **on one video each**:
- PsychToons;
- Psychology Simplified;
- Big Brain Explains;
- Apex Psychology;
- Vaulten;
- Sticko.

In each case the breakout title was a **core word in a "psychology of" frame**. That is the "topical preferences" mechanism the transcript describes, visible in the data.

---

## 2. How successful channels use one core word

### 2a. The anatomy: word + frame + promise

| Pattern | n | Median multiplier | % outliers (base 17.5%) | Best examples |
|---|---|---|---|---|
| **Psychology of [Word]** (e.g. "Psychology of Discipline") | 72 | **5.97×** | **57%** (26% without PsychToons) | "The Psychology Of Gen X (Raised Without Applause)" 5.9M, 1,553× · "Psychology of Discipline (And How to Trick Your Brain Into Craving It)" 4.5M, 947× · "Psychology of Intelligence: Learn Anything So Fast It's Almost Unfair" 3.3M, 695× · "Psychology of Gen X" (another channel) 3.4M, 243× · "Psychology of Charisma: How To Actually Make People Like You" 760K, 160× |
| **[WORD] \| An Animated Short Film** | 17 | 0.55× | 24% | DISCIPLINE (Day One) 5.6M, 61× · LUST VS LOVE (Monk Mode) 2.3M, 27× · DOPAMINE 552K, 6×. **High variance:** PERFECTIONISM got 3.4K; MOTIVATION, RAT RACE and TOMORROW were all under 0.2×. |
| **The [Name] Effect** | 13 | 1.16× | 23% | "The Pygmalion Effect" (Sprouts) **19M, 120×** · Dunning-Kruger 3.4M, 21× · Halo 973K, 6× |
| **Every [type of] [Word] (Explained)** | 52 | 1.02× | 27% | "Every Mental Disorder & Their Effects Explained" 5.9M, 29× · "Every Level of Consciousness" 3.4M, 28× · "Every Manipulation Technique…" 2.9M, 14× · Mind.'s "Every Type of Parent/Friend/Couple Explained" 0.6–0.8M, 4–5× |
| **[Word] Explained (with an object / like you're 5)** | 65 | 0.99× | 20% | "Inflation Explained with Bananas" 1.7M · "The Wolf of Wall Street Scam Explained Like You're 5" 4.2M, 10× · "The Great Depression Explained Like You're 5" 2.9M, 7× |
| **Bare one- or two-word title** ("Grooming", "OCD") | 19 | 0.93× | **5%** | Only "Lima Syndrome" (7.6×) worked |

**What to take from this table.**
1. **The core word is the matching key; the frame tells the viewer what they get.** "Psychology of" promises *understanding of yourself or others*. Most of the best titles add a **parenthetical promise**: "(And How to Trick Your Brain Into Craving It)", "(Raised Without Applause)". Parenthetical promises have a lift of 1.5 across 12 channels.
2. **The one-word short film (Day One style) is a lottery ticket.** Its median is 0.55×. It works when the word is a big, searched, emotional noun (Discipline, Lust, Dopamine), and dies when it's abstract (Perfectionism, Tomorrow, Rat Race). That's a good argument for Day One-style *thumbnails* on a *framed* title, not for bare one-word titles.
3. **The words that win are about the viewer's own self or status:** intelligence, discipline, generation, charisma, being alone. Our mission adds the **between-people** half. That combination is still rare in this niche, so it's an open gap.

### 2b. Ranked core topics (all videos vs outliers)

The balanced score counts the top two outliers per channel. "ch" is the number of channels with an outlier on that topic. The full table, with 60 topics, is in `topic_rank.tsv`.

| Rank | Core topic (lexicon) | Titles | Outliers ≥3× | ≥5× | Lift vs base | Balanced score | ch |
|---|---|---|---|---|---|---|---|
| 1 | Intelligence / IQ / stupidity | 124 | 39 | 27 | 1.79 | 92.6 | **15** |
| 2 | Parenting / kids / teens | 189 | 65 | 48 | 1.96 | 72.8 | 14 |
| 3 | Love | 87 | 23 | 17 | 1.51 | 54.5 | 9 |
| 4 | Rules / norms ("unspoken rules", "laws of") | 54 | 17 | 13 | 1.80 | 54.1 | 11 |
| 5 | Money (personal) | 189 | 23 | 12 | 0.70 | 45.1 | 12 |
| 6 | History / empires | 119 | 19 | 9 | 0.91 | 42.6 | 11 |
| 7 | Crowds / mass behaviour / "everyone" | 52 | 15 | 11 | 1.65 | 42.1 | 8 |
| 8 | Respect / status / admiration | 89 | 17 | 12 | 1.09 | 39.8 | 7 |
| 9 | **Loneliness / alone / no friends** | 40 | 12 | 7 | 1.72 | 39.0 | 8 |
| 10 | Personality | 55 | 19 | 17 | 1.98 | 38.8 | 6 |
| 11 | Sadness / hurt | 72 | 12 | 7 | 0.95 | 36.2 | 8 |
| 12 | Habits / routine | 78 | 18 | 12 | 1.32 | 35.7 | 8 |
| 13 | Sleep / dreams | 50 | 14 | 11 | 1.60 | 35.1 | 6 |
| 14 | Discipline | 19 | 7 | 4 | 2.11 | 32.2 | 5 |
| 15 | Addiction | 34 | 9 | 7 | 1.51 | 32.1 | 6 |
| 16 | Silence / quiet | 36 | 8 | 6 | 1.27 | 32.1 | 7 |
| 17 | Generations (Gen X, Millennials, Boomers) | 37 | 10 | 9 | 1.55 | 31.7 | 3 |
| 18 | Inflation / prices / "expensive" | 45 | 11 | 5 | 1.40 | 31.6 | 8 |
| 19 | Trauma / childhood | 40 | 13 | 10 | 1.86 | 31.5 | 5 |
| 20 | Lust / desire | 39 | 16 | 9 | 2.35 | 31.3 | 7 |
| 21 | Social media / internet | 54 | 12 | 5 | 1.27 | 29.2 | 7 |
| 22 | Introverts / staying home / crowds | 27 | 8 | 7 | 1.69 | 28.5 | 5 |
| 23 | Named effects / biases | 34 | 9 | 7 | 1.51 | 28.3 | 6 |
| 24 | Narcissism / dark traits | 83 | 20 | 13 | 1.38 | 25.2 | 4 |
| 25 | **Kindness / "nice people" / good person** | 17 | 9 | 7 | **3.03** | 23.9 | 5 |
| 26 | Overthinking / "too aware" / fake scenarios | 25 | 11 | 10 | **2.52** | 22.8 | 3 |
| 27 | Charisma | 29 | 10 | 9 | 1.97 | 19.3 | 3 |
| 28 | Dopamine | 19 | 7 | 6 | 2.11 | 18.8 | 4 |
| 29 | Ego / offended | 6 | 3 | 3 | 2.86 | 11.6 | 3 |
| 30 | Birth rate / demographics | 19 | 4 | 3 | 1.20 | 10.4 | 3 |

**Topics that underperform in our sample** (lift below 1):
- Economy/crisis 0.51;
- Work/jobs 0.59;
- Money (generic) 0.70;
- Countries 0.83;
- Tipping 0.86;
- Fear 0.34.

Big-system money topics get steady views on big money channels, but rarely break out. Personal-scale money ("How Eating Out Keeps You Poor!" 3.5M, 20×; "Why It's More Expensive To Be Poor" 2.5M, 14×) does break out.

### 2c. Ranked angles and formats

The full table is in `angle_rank.tsv`.

| Angle / format | Titles | Outliers | Lift | Balanced score | ch | Note |
|---|---|---|---|---|---|---|
| "The X that/who Y" (object or person story) | 382 | 78 | 1.16 | **141.9** | **24** | The most widely shared pattern; Rick's Shorts live on it |
| Number list ("7 Signs", "10 Things") | 347 | 93 | 1.53 | 113.5 | 16 | |
| **Psychology of …** | 305 | 107 | **2.00** | 99.0 | 12 | Highest raw weight (456) |
| Why … | 534 | 67 | **0.72** | 115.3 | 21 | **The most common angle and below-base on its own.** "Why" wins only with a surprising or personal subject ("Why you're always tired" 9.7M, 18×) |
| Explained | 177 | 54 | 1.74 | 89.1 | 16 | |
| Parenthetical promise "(And How To…)" | 137 | 36 | 1.50 | 84.2 | 12 | |
| People who … / those who … | 189 | 55 | 1.66 | 72.4 | 8 | Identity mirror: "People Who Love Staying At Home" 3.1M |
| Traits / rare / superpower | 53 | 21 | **2.26** | 57.4 | 10 | **Validation beats fear** |
| Experiment / study / "backed by" | 53 | 17 | 1.83 | 55.4 | 9 | Fits our "real research" promise |
| Named effect / theory / paradox | 131 | 44 | 1.92 | 50.6 | 7 | |
| Every … / Every type | 117 | 29 | 1.41 | 51.2 | 10 | |
| Levels / stages / tiers | 43 | 11 | 1.46 | 29.8 | 6 | |
| Dark / danger / terrifying | 190 | 37 | **1.11** | 66.3 | 14 | **Fear framing gives almost no lift** |
| Mistake(s) | 58 | 11 | 1.08 | 20.6 | 6 | Weaker here than in the transcript's niche |
| "So [X] it scares people" hyperbole | 15 | 8 | 3.04 | 25.5 | 2 | Power fantasy, mostly one channel. **Not for us.** |
| I tried / I spent (value concentration) | 7 | 4 | 3.27 | 12.6 | 2 | Small sample, but it works ("I Tried Jeff Bezos' Morning Routine For 28 Days" 1.3M, 21×; "I Spent $50,000 On Fake Gurus" 6.7×) |
| What if | 28 | 5 | 1.02 | 11.2 | 2 | Ifverse's 4.6M is the exception, not the rule |

**This is good news for our tone.** **Validation framings** ("traits", "people who", "rare", "superpower") outperform **fear framings** ("dark", "terrifying", "killing you"): lift 2.26 and 1.66 against 1.11. We can be subtly therapeutic and still follow the data.

---

## 3. Search demand (light validation)

### 3a. What viewers actually type (YouTube autocomplete, A–Z)

The full lists are in `search/autocomplete_prefixes.tsv`.

**"psychology of …"**
- **money** (the first suggestion), human behavior, deep thinkers, people who grew up in the 1970s, attraction, addiction, being alone, bullying, breakups, baby boomers, body language, cults, confidence, crushes, discipline, dreams, depression, envy, ego, empathy, every generation, fear, first impressions, friendship, falling in love, gen x, gen z, ghosting, greed, grief, gratitude, having no friends, introverts, intelligence, isolation, insecurity, jealousy, love…

**"the psychology of people who …"**
- love staying at home, don't post on social media, feel behind in life, prefer being alone, can't say no, never ask for help, never text first, struggle to make friends, hate small talk, go quiet when they're hurt, overthink every conversation, cut off their family, grew up in the 70s/80s/90s, are always calm, feel everything deeply.

**"why do we …" / "why do people …"**
- judge others, ignore red flags, lose control of our emotions, have rules, keep on hurting each other, fall in love;
- cheat, lie, gossip, ghost, gaslight, follow the crowd, believe in conspiracy theories, join cults, isolate themselves, envy me, bully, avoid eye contact, judge others, do bad things.

**"why is everyone so …" / "why are people so …"**
- This is our mission phrased as a question: rude **nowadays**, mean nowadays, sensitive these days, angry these days, depressed nowadays, **disconnected**, entitled nowadays, unfriendly now, fake, judgemental, jealous, lonely, miserable;
- "confident when they are wrong", "why are we so lonely", "why are young people so lonely", "why are we so hard on ourselves", "why are japanese people so polite/kind", "why are finnish people so happy".

**"levels of …"**
- **wealth** (first), consciousness, intelligence, thinking, awareness, civilizations, happiness, income, friendship, love, leadership, evil.

**"every type of …"**
- person during christmas, friend, introvert explained, government explained, communism, intelligence explained, job explained, humor, love explained.

**"the dark side of …"**
- being social, **kindness**, **empathy**, chasing love, frugal living, fame, introverts.

**"the science of …"**
- getting rich, building extreme discipline, gratitude, happiness, love, attraction, **awkwardness**, anger, being funny, kindness, laughter, jealousy, empathy, emotional regulation.

**"explained with …"**
- bananas (Primate Economics), food, cats, ducks, monkeys, lego bricks, memes. "Explained with [object]" is a recognised search shape, so **our sandwich episode fits it.**

### 3b. 2026 view evidence per word (view-sorted, this-year search)

These are sums of the top-10 videos returned. The sums are noisy, so the named relevant videos matter more.

| Word | Top-10 views 2026 | 2026 videos >1M | Relevant 2026 example |
|---|---|---|---|
| discipline | 48.2M | 10 | (podcast-heavy results) |
| confidence | 49.1M | 10 | |
| manipulation | 45.6M | 10 | |
| narcissism | 32.9M | 10 | |
| overthinking | 30.1M | 10 | |
| anxiety / social anxiety | 29.2M / 33.8M | 10 / 10 | "Every Mental Disorder & Their Effects Explained" 5.9M |
| money | 30.1M | 10 | "The Psychology of Making Money" 4.9M; "psychology of money" phrase search 32.0M |
| trust | 27.2M | 10 | |
| gen z / generations | 26.8M | 10 | **"The Psychology Of Gen X (Raised Without Applause)" 5.9M** |
| charisma | 26.3M | 7 | |
| birth rate | 24.9M | 9 | **"How Japan Finally Made It Impossible to Make Babies" 6.65M · Kurzgesagt "GERMANY IS OVER" 5.2M · two Korea videos at 2.7M each** |
| dopamine | 19.4M | 10 | "WORST vs BEST Dopamine Habits" 4.7M |
| friendship | 19.2M | 9 | |
| status | 18.3M | 8 | "The Psychology of People Who Don't Post Their Photos on Social Media" 5.0M and 1.8M |
| introvert | 16.3M | 8 | "The Psychology of People Who Love Staying At Home" 3.2M |
| levels of wealth | 16.0M | – | "5 Stages to Getting Rich in 2026: Which One Are You?" 2.6M |
| loneliness | 15.1M | 4 | "Every Feeling You Can't Name Explained" 4.6M |
| inflation | 14.0M | 4 | "Once You Understand Economics, You Can't Be MANIPULATED Anymore" 4.0M |
| capitalism vs socialism | 9.2M | 3 | "The Simple Question Socialism Couldn't Answer" 3.1M (one-sided) |
| kindness | 6.0M | 2 | |
| why do we work 5 days a week | ~0 relevant | 0 | Top results were gym plans |
| why do we tip | ~0 relevant | 0 | Top results were songs. **I couldn't reproduce v2's "why do we tip 7.4M this year".** It may be from 2025 or a different filter. |
| bank run | 2.6M | 0 | "It Started: The AI Bank Run" 592K (doom framing) |
| why some countries are rich and others poor | **138K** | 0 | Very weak in 2026 |
| why is everyone so rude now | 138K | 0 | **Gap:** strong autocomplete, almost no good videos |
| envy / jealousy | 2.4M / 8.1M | 0 / 3 | Thin |
| third places / loneliness | 0.86M | 0 | DW "What are third places" 347K |

**Clearly trending in 2026**, based on what was measured:
- **generational psychology** (Gen X, Xennials, Millennials as "the burnout generation");
- the **quiet-withdrawal identity** cluster: people who stay home, don't post, cut people off, go quiet when hurt;
- **every feeling you can't name**;
- **birth-rate decline**;
- **"why are we so tired"**: Dhruv Rathee 24M; Better Ideas "Why you're always tired" 9.7M;
- **discipline/dopamine**;
- **AI and jobs** anxiety: How Money Works "If AI Takes All Of Our Jobs… Who's Going To Buy Everything?" 3.2M; the "AI bank run" videos.

---

## 4. One-word topic shortlist: the top 30 for Social Ripple

**Filter used:**
1. there is outlier evidence across at least 2 channels;
2. it fits "how we shape each other";
3. it's animatable with stick-figure characters;
4. it can carry the Lens without shame or fear.

The ripple twist is what makes each one *ours*. Evidence shows the views and the multiplier against the channel median.

| # | Word | Outlier evidence | Demand | Our ripple twist | Lens skill |
|---|---|---|---|---|---|
| 1 | **Generations** | "The Psychology Of Gen X (Raised Without Applause)" 5.9M, 1,553× · "Psychology of Gen X" 3.4M, 243× · "Psychology of Xennials" 2.0M, 143× · "Millennials – The Burnout Generation" 19× | Autocomplete: gen x, gen z, every generation, grew up in the 70s/80s/90s; 2026: 10 videos >1M | Every generation thinks the next is worse: the "kids these days" effect | Ask, don't assume |
| 2 | **Intelligence** | 39 outliers across **15 channels**: "Psychology of Intelligence" 3.3M, 695× · "How Intelligent People Deal with Stupid People" 1.5M, 29× · Sprouts "Bonhoeffer's Theory of Stupidity" 4.6M, 29× · "The Dunning Kruger Effect" 3.4M, 21× | "levels of intelligence" is autocomplete #4 | A group's intelligence depends on how its members treat each other (collective intelligence) | Ask the quiet one |
| 3 | **Loneliness** | TED-Ed "What happens to your brain without any social contact?" 7.9M, 19× · "Why Some People Are Meant to Walk Alone" 922K, 194× · "People Who Like To Be Alone…" 40× · "If You Have Few or No Friends…" 676K, 13× · Kurzgesagt "Loneliness" 28M all-time | "psychology of loneliness / being alone / having no friends / isolation"; "why are we so lonely" | Loneliness spreads through networks, and so does reconnection | Body check; say the second hello |
| 4 | **Silence** | "Psychology of People Who Go Quiet When They're Hurt" 2.3M, 484× **and** 640K, 40× (same title, two channels) · "Why Silence is Power" 3.3M, 10× | "people who go quiet when hurt", "never text first", "don't talk much" | Silence is ambiguous, so the other person's brain fills it with the worst story | Name the not-knowing |
| 5 | **Overthinking** | "The Psychology of People Who Are Too Aware" 2.8M, 175× · "…Imagine Fake Scenarios Before Sleep" 946K, 59× · "People Who Think Too Much" 515K, 32× | 2026: 10 videos >1M | One short text, five imagined endings | Ask, don't assume |
| 6 | **Discipline** | "Psychology of Discipline" 4.5M, 947× · Day One "DISCIPLINE" 5.6M, 61× · "Discipline Breakthrough: …Spartans" 10× | "psychology of discipline", "science of building extreme discipline"; 2026: 10 >1M | Self-control is contagious: you borrow it from the people near you | Change it or reframe it |
| 7 | **Dopamine** | "DOPAMINE DETOX: Trick Your Brain…" 4.3M, 69× · "…Reset Your Mind in 1 Day" 1.6M, 26× · Day One "DOPAMINE" 552K, 6× | 2026: 10 >1M | Every like you give trains what your friends post | Name it |
| 8 | **Charisma** | "Psychology of Charisma: How To Actually Make People Like You" 760K, 160× · "How To Be Instantly More Fun to Talk To" 6.2M, 11× · "How Tom Hardy Turns Social Anxiety Into Charisma" 4.8M, 9× (pattern only, no names for us) | 2026: 7 >1M | Charisma lives in the *other* person: they feel heard | One follow-up question |
| 9 | **Status / respect** | "8 Habits…That Make People Respect You" 18M, 33× · "Simple Ways To Earn Respect From Almost Anyone" 6.3M, 12× · "When You Look Poor, Everything Works Against You" 7× | "psychology of status", "levels of wealth" | Status is local: respect from your own circle beats money | Three other reasons |
| 10 | **Money** | "How Eating Out Keeps You Poor!" 3.5M, 20× · "Why It's More Expensive To Be Poor" 2.5M, 14× · "Explaining Basic Financial Concepts" 2.6M, 13× · "Every Way To Get Rich" 1.2M, 6× | **"psychology of money" is autocomplete #1**; "levels of wealth" #1 | Expenditure cascades: your neighbour's kitchen raises your spending | Change it or reframe it |
| 11 | **Trust** | "Why Teens Stop Trusting Their Parents" 1.6M, 110× · "The Sword of Lies" (Rick) 9.6M, 14× | 2026: 10 >1M; "trust issues" | The lost-wallet experiment: we underestimate strangers' honesty | Extend small trust first |
| 12 | **Kindness** | "The Paradox of Being a Good Person" 5.1M, 13× · "The Problem with Nice People" 3.4M, 9× · "How to Spot the Loveliest People in the World" 1.6M, 8.5× · lift **3.03**, the highest of any topic | "dark side of kindness", "science of kindness" | Kindness cascades three degrees out; we underestimate its impact | Send it now |
| 13 | **Childhood** | Sprouts "The Attachment Theory: How Childhood Affects Life" 11M, 69× · "Psychology of A Child Who Grew Up Too Fast" 698K, 50× · "Why Teens Stop Trusting…" 110× | "psychology of the ignored child"; attachment styles | How adults' moods become children's lenses | Validate first |
| 14 | **Inflation / "expensive"** | "Inflation Explained with Bananas" 1.7M · "Why It's More Expensive To Be Poor" 14× | "explained with bananas/food"; 2026 inflation 14M | Expectations: prices rise because everyone expects them to | Change it or reframe it |
| 15 | **Burnout / tired** | "Why you're always tired" 9.7M, 18× · "Millennials – The Burnout Generation" 19× · "How overstimulation is ruining your life" 4.0M, 7.5× | "why are we so tired" (Dhruv Rathee 24M in 2026) | Stress is contagious (empathic cortisol) | Body check |
| 16 | **Anger** | "What To Say When Someone Disrespects You" 6.1M, 11× · "How To Never Get Angry Or Bothered By Anyone" 21× · "If A Rude Person Disrespects You…" 4.3M, 8× | "why is everyone so angry/rude nowadays" | Rudeness spreads (Foulk 2016), and so does calm | Three other reasons |
| 17 | **Introverts / home** | "The Psychology of People Who Love Staying At Home" 3.1M, 221× · "Hate Crowded Places?" 627K, 45× · Sprouts introverts 2.9M, 18× | "psychology of introverts", "every type of introvert" | Quiet people shape rooms too | Talk to yourself like a friend |
| 18 | **Social media** | "People Who Don't Use Social Media" 433K, 31× · "…Don't Post Their Photos on Social Media" 1.8M, 15× (plus 5.0M in 2026 on another channel) · "How Social Media Changes Your Brain" 11× | "social media vs reality" | Highlight reels and the envy loop | Name it |
| 19 | **Envy / jealousy** | Thin in outliers (1 channel); "psychology of people who feel behind in life" is in autocomplete | "psychology of envy/jealousy", "why do people envy me" | Comparison is a ripple: one post moves a whole feed's mood | Turn envy into a question |
| 20 | **Narcissism** | Sprouts "Dark Triad" 2.4M, 15× · "5 Things Sociopaths Do" 9.2M, 17× | 2026: 10 >1M | Careful: **only as "Is everyone a narcissist now?"** (the measured trend is flat or down), no labelling people | Common humanity |
| 21 | **Manipulation** | "11 Manipulation Tactics" 2.0M, 26× · "Every Manipulation Technique & How To Combat It" 2.9M, 14× · "How To Argue Against Someone Who Twists Your Words" 6.9M, 13× | 2026: 10 >1M | How influence travels, and how to see it without paranoia | Ask, don't assume |
| 22 | **Love** | "6 Signs You Were Never in Love" 1.9M, 35× · "LUST VS LOVE" 2.3M, 27× · "'I Love You But I Don't Think We Should Be Together'" 1.7M, 9× | "psychology of falling in love" | Couples' moods converge (emotional contagion in pairs) | Validate first |
| 23 | **Friendship** | "If You Have Few or No Friends…" 13× and 8× · "How I learned to make more friends" 2.7M, 5× · Mind. "Every Type of Friend Explained" 708K | "every type of friend", "why nobody makes friends anymore" | 50 / 90 / 200 hours | Say the second hello |
| 24 | **Habits** | "8 Habits…Respect You" 18M, 33× · "Weird Habits That Actually Reveal High Intelligence" 1.4M, 24× | | Habits spread through households | Make it easy |
| 25 | **Ego / offence** | "Psychology of EGO: Why We Get Offended So Easily?" 19× · "Paradox of Self-Awareness" 6.0M, 15× and 1.3M, 11× | "psychology of ego"; "why is everyone so offended/sensitive" | Offence is a reading, not a fact | Three other reasons |
| 26 | **Crowds / mass psychology** | "MASS PSYCHOSIS" 8.6M, 14× · "Hate Crowded Places?" 45× · "Rise Of Collective Stupidity" 7× | "why do people follow the crowd", "join cults" | Panic, applause, stadium waves | Social referencing |
| 27 | **Unspoken rules / norms** | "12 Rules for Life (Animated)" 1.4M, 18× · "Law of Reversed Effort" 4.4M, 14× · "The Unspoken Rules of Dating…" 7× | "why do we have rules", "japanese apology" | Who wrote the rules nobody wrote down? | Ask, don't assume |
| 28 | **Experiments** (as a core) | Sprouts "Universe 25" 1.1M, 7× · "Stanford Prison Experiment" 858K, 11× · "Milgram" 6.5× · experiment angle lift 1.83 | "conformity experiment" | Classic studies retold with a ripple, with honest replication notes | Honest science |
| 29 | **Birth rates** | PolyMatter "Why China Ended its One-Child Policy" 5.2M, 6× · "Demographic Collapse" 3.2× | 2026 strong: 6.65M, 5.2M, 2.7M × 2 | Fewer kids → quieter towns: a ripple across time | Distanced self-talk about the future |
| 30 | **Pygmalion / expectations** | Sprouts "The Pygmalion Effect" **19M, 120×**, the biggest named-effect hit · "Halo Effect [Pretty Privilege]" 6× | | Other people's expectations become us (label it disputed) | Talk to yourself like a friend |

**Words with demand but not enough outlier evidence**, best tested as Shorts:
- gossip (52 minutes a day);
- rudeness ("why is everyone so rude nowadays": a supply gap);
- awkwardness ("science of awkwardness");
- tipping;
- conformity;
- nostalgia ("why are people so nostalgic for the 1990s").

---

## 5. Title and angle formulas that work here (with real numbers)

Each formula below is a *pattern*. Our titles use our own words, no creator names, and no fear or shame.

| # | Formula | Proven examples (views, multiplier) | Social Ripple version |
|---|---|---|---|
| 1 | **Psychology of [Word] (+ promise)** | "Psychology of Discipline (And How to Trick Your Brain Into Craving It)" 4.5M, 947× · "The Psychology Of Gen X (Raised Without Applause)" 5.9M, 1,553× | "Psychology of Loneliness (And Why It Spreads)" |
| 2 | **The Psychology of People Who [relatable quirk]** | "…Love Staying At Home" 3.1M, 221× · "…Go Quiet When They're Hurt" 2.3M, 484× · "…Don't Post Their Photos on Social Media" 1.8M, 15× | "The Psychology of People Who Go Quiet (and What It Does to Everyone Else)" |
| 3 | **Why [we / everyone] [surprising everyday behaviour]** (needs a twist, because plain "Why" has lift 0.72) | "Why you're always tired" 9.7M, 18× · "Why It's More Expensive To Be Poor" 2.5M, 14× · Rick "Why Cashiers Keep Winning The Lottery" 6.4M, 10× | "Why Does Everyone Seem So Rude Now?" |
| 4 | **The [Name] Effect** | "The Pygmalion Effect" 19M, 120× · "The Dunning Kruger Effect" 3.4M, 21× | "The Liking Gap: They Liked You More Than You Think" |
| 5 | **Every type of [person] explained** | "Every Type of Parent Explained" 770K · "Every Type of Friend Explained" 708K (new channel, 11 videos) · "Every Mental Disorder…" 5.9M, 29× | "Every Type of Person in a Group Chat, Explained" |
| 6 | **[Big system] Explained With [one small object]** | "Inflation Explained with Bananas" 1.7M · "The Great Depression Explained Like You're 5" 2.9M, 7× | "Inflation Explained With One Sandwich Shop" (a sequel to ep. 3) |
| 7 | **Levels / tiers of [Word]** | "Every Level of Consciousness" 3.4M, 28× · "Every Level of Thinking: Most People Never Reach Level 4" 1.1M, 9× · Rick "Levels of Pirate Cannonballs" 8.6M, 13× · "levels of wealth" is autocomplete #1 | "The 5 Levels of Trust (and How Strangers Climb Them)" |
| 8 | **The [object/person] that [changed a group]** (Shorts) | "The Ancient Jar That Warned an Empire" 30M, 45× · "The Window That Breaks Japan's Gambling Law" 13M, 20× · "The Burglar Who Only Moved Furniture" 7.5M, 11× | "The Wallet Nobody Kept" |
| 9 | **[N] signs / traits (validation)** | "6 Signs You Were Never in Love" 1.9M, 35× · "10 Signs You Have Survivor's Intelligence" 66× · traits/rare lift 2.26 | "7 Signs You Make People Feel Safe" |
| 10 | **Value concentration / "I tried"** | "I Tried Jeff Bezos' Morning Routine For 28 Days" 1.3M, 21× · "I Spent $50,000 On 'Fake Gurus'" 6.7× · the transcript's "I interviewed 500 millionaire founders" | "We Read 100 Studies on Loneliness. Here's What Actually Helps" (only if we really do) |
| 11 | **Mirror question about the viewer** | "Why Do Humans Have to Pretend to Sleep to Fall Asleep?" 584K, 37× · "Why Can't You Remember Falling Asleep?" 16× | "Why Do We Rehearse Conversations That Never Happen?" |
| 12 | **[WORD] (all caps) as a one-word thumbnail/short-film title** | DISCIPLINE 5.6M, 61×; but median 0.55× | Use the caps word **on the thumbnail**, with a framed title |

**Formulas to avoid**, even though some of them work elsewhere:
- "…So Confident It Scares People" (power fantasy);
- "…Is Killing You", "Terrifying…", "Something Darker" (fear);
- "Signs You're Not Okay" (diagnosis);
- naming celebrities or fictional characters we don't actually feature.

---

## 6. Fifteen "combine two proven topics" episode ideas

Each idea is built as **core word + proven angle + ripple twist**.

**Thumbnails follow the Day One style:** a near-black scene, one huge emotional stick-figure face, one glowing object, 1–3 words of marker text.

> Note: `CHANNEL.md` bans "dark voids, glow, neon" *inside* the films. A dark, glowing thumbnail over a daylight film is a deliberate packaging choice. Confirm that this exception is intended.

Studies marked (✔) were checked today. Those marked (verify) are cited from memory.

### ★1. Generations
- **Formula:** Psychology of [Generation] + "every generation" + the kids-these-days ripple.
- **Title:** *Why Every Generation Thinks the Next One Is Worse (Psychology Explains)*
- **Alternative title:** *The Psychology of Every Generation, From Boomers to Gen Z*
- **Thumbnail:** an old stick-figure face with one eyebrow raised and gentle side-eye. A glowing phone is held by a small kid silhouette. Text: "KIDS THESE DAYS?"
- **Lens skill:** ask, don't assume. A grandparent and a teen each list "three other reasons" for the other's behaviour.
- **Studies:**
  - ✔ Protzko & Schooler 2019, *Science Advances*: 3,458 US adults saw youth as declining most on traits where they themselves excel.
  - ✔ Mastroianni & Gilbert 2023, *Nature*: perceived moral decline across 60 countries, not matched by the data.
  - Ripple: each generation's lens is shaped by the one before it.
- **Evidence:**
  - "Psychology of Gen X" titles: 5.9M (1,553×), 3.4M (243×), 2.0M Xennials (143×), plus a Millennials title at 19×, across 3 channels;
  - autocomplete "psychology of every generation / people who grew up in the 70s / 80s / 90s";
  - generations is a 2026 trend (10 videos >1M).

### ★2. Silence and overthinking
- **Formula:** "The Psychology of People Who…" + the Lens doc's clarity-vs-confusion idea.
- **Title:** *The Psychology of People Who Go Quiet (and What Your Brain Does With the Silence)*
- **Thumbnail:** a wide-eyed face lit by a glowing phone showing "Seen 11:42". Text: "…SILENCE".
- **Lens skill:** name the not-knowing, then ask, don't assume. The red imagined endings play out, then the real answer arrives: "my phone died lol".
- **Studies:**
  - de Berker et al. 2016, *Nature Communications* (in THE-LENS): uncertainty is more stressful than certain bad news.
  - Kruger, Epley et al. 2005, *JPSP*: tone gets lost in text.
- **Evidence:**
  - the same title on two channels: 2.3M (484×) and 640K (40×);
  - "Too Aware" 2.8M (175×); "Fake Scenarios" 59× and 28×;
  - overthinking: 10 videos >1M in 2026.

### ★3. Loneliness (replaces season ep. 6)
- **Formula:** Psychology of [Word] + the cities setting + network contagion.
- **Title:** *Psychology of Loneliness: Why It Spreads (and the 50-Hour Fix)*
- **Thumbnail:** one face at a lit window in a dark apartment block. One other window glows across the street. Text: "50 HOURS".
- **Lens skill:** a body check ("lonely" on the battery meter), then *say the second hello*.
- **Studies:**
  - Cacioppo, Fowler & Christakis 2009, *JPSP*, "Alone in the crowd": loneliness spreads up to three degrees in the Framingham network (verify).
  - ✔ Hall 2018, *J. Social & Personal Relationships*: about 50 h from acquaintance to casual friend, about 90 h to friend, 200+ h to close friend.
  - Holt-Lunstad 2010 meta-analysis: 148 studies, social ties and survival (verify).
- **Evidence:**
  - TED-Ed 7.9M (19×); 194×, 40× and 13× on newer channels;
  - Kurzgesagt "Loneliness" 28M all-time;
  - loneliness outliers on 9 channels; strong autocomplete.

### ★4. Intelligence
- **Formula:** Psychology of Intelligence + "smart people, dumb decisions" + a group ripple.
- **Title:** *Why a Room Full of Smart People Makes Dumb Decisions*
- **Alternative title:** *Psychology of Intelligence: The Kind Only Groups Have*
- **Thumbnail:** a thinking face whose glowing lightbulb is passed between hands. Text: "GROUP IQ".
- **Lens skill:** *ask the quiet one*. One turn-taking move changes the room.
- **Studies:**
  - ✔ Woolley et al. 2010, *Science*: 699 people in groups of 2–5. A "collective intelligence" factor predicted performance. It was not strongly tied to members' IQ; it was tied to social sensitivity and equal turn-taking.
  - The Dunning-Kruger effect as a secondary beat, with its critiques noted.
- **Evidence:** intelligence is the **#1 topic** (39 outliers on 15 channels; "Psychology of Intelligence" 3.3M, 695×; "Bonhoeffer's Theory of Stupidity" 4.6M, 29×).

### ★5. Money
- **Formula:** Psychology of Money (autocomplete #1) + "why it keeps you poor" + expenditure cascades.
- **Title:** *The Psychology of Money: Why Your Neighbour's Kitchen Costs You Money*
- **Thumbnail:** a stunned face, one glowing kitchen (or sneaker) across a dark street. Text: "NOT YOUR MONEY".
- **Lens skill:** change it or reframe it. One small action: notice "who am I buying this for?"
- **Studies:**
  - Frank, Levine & Dijk 2014, "Expenditure cascades" (verify): spending at the top pushes up everyone's "normal".
  - Gilovich et al. 2000, the spotlight effect (verify): people overestimate how much others notice.
  - Dunn et al. 2008, *Science*: spending on others raises happiness (verify).
- **Evidence:**
  - "How Eating Out Keeps You Poor!" 3.5M (20×); "Why It's More Expensive To Be Poor" 2.5M (14×);
  - "psychology of money" phrase search 32M of 2026 views; "levels of wealth" is autocomplete #1.

### 6. Rudeness: the demand gap bet
- **Formula:** "Why is everyone so ___ nowadays" (autocomplete) + rudeness contagion.
- **Title:** *Why Does Everyone Seem So Rude Now?*
- **Thumbnail:** a shocked face with a glowing horn or phone in the dark. Text: "SO RUDE?"
- **Lens skill:** three other reasons. This is the bigger-scale sequel to ep. 1.
- **Studies:** ✔ Mastroianni & Gilbert 2023 (the illusion of decline); Foulk et al. 2016 (rudeness contagion, in CHANNEL.md).
- **Evidence:**
  - autocomplete: rude, mean, angry, sensitive, entitled, unfriendly "nowadays";
  - 2026 supply is tiny (the top relevant video has 35K);
  - outlier support comes from the disrespect titles (6.1M, 11×; 4.3M, 8×).
- **Risk:** it overlaps with ep. 1. Scale it to society, not to three strangers.

### 7. Discipline
- **Formula:** Psychology of Discipline + "it's contagious".
- **Title:** *Psychology of Discipline: Why It's Contagious*
- **Thumbnail:** a determined face, with a glowing running shoe beside a friend's. Text: "BORROWED".
- **Lens skill:** make it easy. Change the room, not your willpower.
- **Studies:**
  - vanDellen & Hoyle 2010, *PSPB* (verify): merely seeing others exert self-control shifts your own.
  - Galla & Duckworth 2015 (verify): people high in self-control lean on habits.
- **Evidence:** "Psychology of Discipline" 4.5M (947×); Day One "DISCIPLINE" 5.6M (61×); 10 videos >1M in 2026.

### 8. Dopamine
- **Formula:** Psychology of Dopamine + "likes".
- **Title:** *Psychology of Dopamine: Why a Like Feels Like Love*
- **Thumbnail:** a face lit from below by a glowing heart icon. Text: "+1".
- **Lens skill:** name it ("that's a want, not a need"). Then one real reply instead of ten likes.
- **Studies:**
  - Sherman et al. 2016, *Psychological Science* (verify): teens' brains responded to likes, and teens liked photos that already had more likes.
  - Schultz 1997, reward prediction error (verify).
- **Evidence:** "DOPAMINE DETOX" 4.3M (69×) and 1.6M (26×); Day One "DOPAMINE" 6×; dopamine has 10 videos >1M in 2026.

### 9. Charisma
- **Formula:** Psychology of Charisma + "how to actually make people like you" + the liking gap.
- **Title:** *Psychology of Charisma: It's Not What You Say*
- **Thumbnail:** a warm, delighted face. A glowing question mark floats between two people. Text: "ASK ONE MORE".
- **Lens skill:** one follow-up question.
- **Studies:**
  - Huang et al. 2017, *JPSP* (verify): asking follow-up questions increased liking.
  - Boothby et al. 2018, the liking gap (verify).
- **Evidence:** "Psychology of Charisma" 760K (160×); "How To Be Instantly More Fun to Talk To" 6.2M (11×).

### 10. Trust
- **Formula:** an experiment angle + "the X that Y" + strangers.
- **Title:** *The Lost Wallet Experiment: How Honest Are Strangers, Really?*
- **Thumbnail:** a surprised face holding a glowing wallet in a dark lobby. Text: "72%".
- **Lens skill:** extend small trust first. Our predictions about strangers are too dark.
- **Studies:** ✔ Cohn et al. 2019, *Science*: about 17,000 wallets in 355 cities in 40 countries. Return rates were 40% with no cash, 51% with about $13 and 72% with about $94. Experts predicted the opposite.
- **Evidence:** trust has 10 videos >1M in 2026; "Why Teens Stop Trusting Their Parents" 1.6M (110×); the experiment angle has lift 1.83.

### 11. Kindness
- **Formula:** "The problem with nice people" + kindness cascades.
- **Title:** *Nice vs Kind: The Difference That Ripples*
- **Thumbnail:** a soft, teary-smiling face, holding a small glowing note. Text: "SEND IT".
- **Lens skill:** send the compliment now.
- **Studies:**
  - Fowler & Christakis 2010, *PNAS*: cooperation cascades (in CHANNEL.md).
  - Kumar & Epley 2022, underestimating kindness, and Kumar & Epley 2018, gratitude letters (verify).
- **Evidence:** kindness has the **highest topic lift (3.03)**: "Paradox of Being a Good Person" 5.1M (13×); "The Problem with Nice People" 3.4M (9×); "Loveliest People" 1.6M (8.5×); autocomplete "dark side of kindness".

### 12. Burnout (replaces or retitles season ep. 4)
- **Formula:** "Why are we so tired" + history of the 5-day week + stress contagion.
- **Title:** *Why Is Everyone So Tired? (The Strange History of the 5-Day Week)*
- **Thumbnail:** a drooping face, a glowing office window at night. Text: "SO TIRED".
- **Lens skill:** a body check, then fuel, not threat (Crum 2013).
- **Studies:**
  - ✔ Engert et al. 2014, *Psychoneuroendocrinology*: about 26% of observers had a significant cortisol rise just watching someone stressed. The figure was about 40% when it was their partner and about 10% with strangers; check the paper.
  - Ford 1926; the UK 4-day-week trial (both in SEASON-PLAN).
  - Bakker et al. 2005, burnout contagion among nurses (verify).
- **Evidence:** "Why you're always tired" 9.7M (18×); "Millennials – The Burnout Generation" 19×; "why are we so tired" got 24M in 2026 (Dhruv Rathee). By contrast, "why do we work 5 days a week" returned **no relevant 2026 hits**.

### 13. Envy
- **Formula:** "Psychology of people who don't post" + envy.
- **Title:** *The Psychology of People Who Stopped Posting (and the Envy Loop)*
- **Thumbnail:** a face half-lit by a glowing feed of perfect lives. Text: "BEHIND?"
- **Lens skill:** turn envy into a question: "What does this tell me I want?"
- **Studies:**
  - Verduyn et al. 2015, *JEP: General*: passive Facebook use → envy → lower well-being (verify).
  - van de Ven et al. 2009, *Emotion*: benign vs malicious envy (verify).
- **Evidence:** "Don't Post Their Photos" 1.8M (15×), plus 5.0M in 2026 on another channel; "People Who Don't Use Social Media" 31×; autocomplete "psychology of envy", "people who feel behind in life".
- **Caveat:** "envy" itself has thin outlier evidence. The frame carries it.

### 14. Inflation (a sequel to ep. 3)
- **Formula:** "[System] Explained With [object]" + "why is everything so expensive".
- **Title:** *Why Is Everything So Expensive? Inflation Explained With One Sandwich Shop*
- **Thumbnail:** a shocked face, one glowing price tag in the dark. Text: "$14?!"
- **Lens skill:** change it or reframe it. This respects that real money stress needs action (Lens rule 8).
- **Studies:**
  - Shafir, Diamond & Tversky 1997, *QJE*, money illusion (verify).
  - Shiller 1997, "Why do people dislike inflation?" (verify).
- **Evidence:** "Inflation Explained with Bananas" 1.7M (3.7×); the ELI5 cluster at 4.2M, 2.9M and 2.3M; "explained with bananas/food" in autocomplete; "Why is everything so expensive" 10.7M this year (from the v2 data); inflation 14M in 2026.

### 15. Childhood
- **Formula:** "How kids learn…" + attachment + intergenerational ripple.
- **Title:** *How Kids Learn to Read a Room (and Why We Never Stop)*
- **Thumbnail:** a small child's wide eyes looking up at a glowing adult face in a dark kitchen. Text: "WATCHING".
- **Lens skill:** validate first. This is social referencing, the channel's thesis in a lab.
- **Studies:** Sorce et al. 1985, the visual cliff (in THE-LENS); Bowlby, attachment.
- **Evidence:**
  - Sprouts "Attachment Theory" 11M (69×);
  - Sticko "This Is How Kids Learn…" titles at 53×, 30× and 12×;
  - "Psychology of A Child Who Grew Up Too Fast" 50×;
  - parenting is the #2 topic by count (65 outliers, 14 channels).
- **Tone note:** avoid Sticko-style blame ("That's When You Lost Them").

---

## 7. Fifteen Shorts ideas (under 3 minutes, Rick-style)

**The Rick formula:** hook → setting → escalation → snap → "You see…" → ironic payoff. Titles follow the measured patterns:
- "The [object] that [changed a group]": "The Ancient Jar That Warned an Empire" 30M, 45×;
- "Why [group] [odd behaviour]": "Why Cashiers Keep Winning The Lottery" 6.4M, 10×.

Every Short shows *people changing each other*, not trivia.

| # | Title | Hook → escalation → snap | "You see…" → ironic payoff | Anchor |
|---|---|---|---|---|
| ★1 | **The Wallet Nobody Kept** | A researcher hands a "lost" wallet to a hotel clerk. Then one with cash. Then one with *a lot* of cash. | "You see… everyone, even the economists, bet the cash would vanish." → The more money inside, the more often it came back (40% → 51% → 72%). | ✔ Cohn 2019 |
| ★2 | **The T-Shirt Nobody Noticed** | A student walks into class wearing an embarrassing shirt and is sure everyone is staring. | "You see… he guessed half the room noticed." → About a quarter did. Everyone else was busy worrying about their own shirt. | Gilovich 2000 (verify) |
| ★3 | **The Room That Filled With Smoke** | Smoke seeps into a waiting room. Alone, people report it fast. Then two calm strangers sit and keep filling out forms. | "You see… nobody wanted to be the one who overreacted." → The calm strangers kept everyone sitting in smoke. | Latané & Darley 1968 (verify the figures) |
| ★4 | **Why Drivers Stop After Someone Else Stops** | A car with a flat tyre; nobody stops. One person stops to help. A quarter of a mile later, a second flat tyre. | "You see… one helper is a sign that says 'people here help'." → Drivers who'd just passed a helper were more likely to stop. | Bryan & Test 1967 (verify) |
| ★5 | **The Quote About Lazy Kids That Nobody Said** | "The children now love luxury… they have bad manners" (supposedly Socrates). Every generation shares it. | "You see… the line was written in 1907 by a student summarising, not by Socrates." → We've been faking ancient proof that kids are getting worse. | Freeman 1907 misattribution (verify); Protzko & Schooler 2019 ✔ |
| 6 | **The Towel Card That Beat Every Sign** | A hotel tries "save the planet" cards. Then: "most guests *in this room* reused their towels." | "You see… we copy strangers who slept in our bed." → The more specific card won. | Goldstein, Cialdini & Griskevicius 2008 (verify) |
| 7 | **The Graffiti That Made People Litter** | Clean alley: flyers on bikes, most people keep them. Same alley with graffiti… | "You see… one broken rule tells everyone the rules are off." → Littering roughly doubled. | Keizer et al. 2008, *Science* (verify) |
| 8 | **The Traffic Jam Nobody Caused** | 22 cars drive in a circle at a steady speed. No accident, no lights. | "You see… one tiny brake ripples backwards." → A jam appears from nothing and travels the wrong way. | Sugiyama et al. 2008 (verify) |
| 9 | **The Coffee Line That Paid Forward Greed** | A café "pay it forward" chain: someone pays for the next person's order. Then someone receives *less*… | "You see… people pass on what they got." → Greed was paid forward more reliably than generosity. | Gray, Ward & Norton 2014 (verify) |
| 10 | **The Ball Game That Hurt** | Three players toss a virtual ball. Then two stop throwing to you. | "You see… it hurt even when people knew the others were computers." → Rejection by a program still stings. | Williams' Cyberball; Zadro et al. 2004 (verify) |
| 11 | **The Teacher Who Was Lied To** | Researchers tell teachers some random kids are "about to bloom". | "You see… expectations leak into tone, attention, smiles." → Some "bloomers" did. *Then the twist:* later replications found smaller effects, so we say so. | Rosenthal & Jacobson 1968 (disputed). Sprouts' "Pygmalion Effect" got 19M, 120× |
| 12 | **The Whisper That Emptied a Bank** | A group chat says "move your money". By lunch, a line out the door. | "You see… the bank was fine, until everyone believed it wasn't." → $42B left in one day. *(This replaces bank-run long-form.)* | SVB 2023; Diamond–Dybvig (in SEASON-PLAN) |
| 13 | **Why Waiting for a Text Hurts More Than Bad News** | A character waits for "can we talk?". Heartbeat rising. | "You see… a 50/50 maybe stresses us more than certain bad news." → The text was "can we talk… about pizza?" | de Berker 2016 (in THE-LENS) |
| 14 | **The Stadium Wave Started by 25 People** | A bored stadium. One section stands. Nothing. Then 25 together… | "You see… a crowd only needs a small push in the same direction." → 50,000 people, one wave, started by about 25. | Farkas, Helbing & Vicsek 2002, *Nature* (verify) |
| 15 | **Why We Tip People We'll Never See Again** | A diner. Bad service. Still a 20% tip. | "You see… the tip mostly tracks the bill, not the service." → Service explains only a sliver of the tip. We're paying to not feel judged. *(This turns ep. 5 into a Short test.)* | ✔ Lynn's meta-analyses (r ≈ 0.13 between service and tip) |

---

## 8. Our Season plan, revisited honestly

| Planned | What the evidence says | Recommendation |
|---|---|---|
| **4. Why Do We Work 5 Days a Week?** | **Weak.** The 2026 view-sorted search found no relevant hits. Work/jobs titles underperform (lift 0.59). The CGP Grey 14M is all-time and old. **Strong** core word next door: *tired / burnout* ("Why you're always tired" 9.7M, 18×; 24M in 2026). | **Retitle and refocus:** *Why Is Everyone So Tired? (The Strange History of the 5-Day Week).* Keep the Ford 1926 ripple and the 4-day trial; add stress contagion (Engert 2014 ✔). |
| **5. Why Do We Tip?** | **Mixed.** Autocomplete is strong (why do we tip in America, barbers, baristas, Uber; "tipping culture"). But tipping titles underperform (lift 0.86), 2026 relevant results are thin, and I **could not reproduce** v2's "7.4M this year". It's also US-centric. | **Make it a Short first** (#15 above). Promote it to long-form only if the Short hits ≥3× our median. |
| **6. Lonely Cities** | **The strongest planned topic.** Loneliness outliers on 9 channels; TED-Ed 7.9M (19×); Kurzgesagt 28M; strong autocomplete; perfect mission fit. | **Keep and move up to next.** Retitle around the core word: *Psychology of Loneliness: Why It Spreads (and the 50-Hour Fix)*, with the city at night as the setting. |
| **7. Capitalism vs Socialism** | Demand is real (10 of 10 autocomplete; about 9M in 2026), but system titles break out rarely (3 outliers; lift about 1.0). The top results are one-sided, so an even-handed version is a gap. The comments will be a war zone, and a new channel has no trust yet. | **Keep, but schedule after episodes 10–12.** Use the proven object format: *Capitalism vs Socialism, Explained With One Bakery.* |
| **8. Rich vs Poor Countries** | **The weakest.** The 2026 phrase search totals only 138K. Country/economy titles underperform (lifts 0.83 and 0.51). The personal-scale version wins: "Why It's More Expensive To Be Poor" 2.5M (14×); "How Eating Out Keeps You Poor!" 3.5M (20×). | **Replace** with *The Psychology of Money: Why Your Neighbour's Kitchen Costs You Money* (idea ★5). Keep the Nogales border scene as a 2-minute segment inside ep. 7. |
| **9. One Rumour, One Bank Run** | **Weak as long-form.** 2026 has 2.6M in total, mostly "AI bank run" doom content. **Strong as a story:** it's a perfect Rick-style Short. | **Turn it into a Short** (#12). For long-form, replace it with *The Lost Wallet Experiment* (Trust, idea 10): same theme, collective belief, but hopeful. |
| **10. Why Birth Rates Are Falling** | **Strong and trending** in 2026: 6.65M, 5.2M and 2.7M × 2. Autocomplete: decline, crisis, collapse. But the niche frames it with fear ("X IS OVER"). | **Keep, and move earlier.** Retitle: *Why Is Everyone Having Fewer Kids?* Calm, no doom, with the ripple across time. |
| **New** | Generations, Silence/Overthinking and Intelligence have the biggest outliers of any topic that fits our mission. | **Add them.** |

**Proposed order after episode 3:**
1. **Ep 4:** Psychology of Loneliness (was ep. 6).
2. **Ep 5:** Why Every Generation Thinks the Next One Is Worse (new).
3. **Ep 6:** The Psychology of People Who Go Quiet (new).
4. **Ep 7:** Why Is Everyone So Tired? The 5-Day Week (was ep. 4).
5. **Ep 8:** Why Is Everyone Having Fewer Kids? (was ep. 10).
6. **Ep 9:** Why a Room Full of Smart People Makes Dumb Decisions (new).
7. **Ep 10:** The Psychology of Money: Your Neighbour's Kitchen (replaces ep. 8).
8. **Ep 11:** The Lost Wallet Experiment (replaces ep. 9).
9. **Ep 12:** Capitalism vs Socialism, Explained With One Bakery (was ep. 7).

Shorts carry tipping and the bank run.

The "scale grows every episode" device (person → world → future) still works loosely. It just isn't the order we lead with: **demand comes first, then scale.**

**One honest flag on episode 2.** "The 7 Levels of School Popularity" exactly matches an existing 2.4M video by another creator (Tyler Vitelli; it's in v2's results and this year's search). Our version adds "(and Who Really Decides Them)". That's legal and common, but it's the opposite of "patterns, not copies", and it can make us look like a re-upload. If it isn't published yet, consider *Who Really Decides Who's Popular? (The 7 Levels)*.

---

## 9. The weekly 1-hour "master sheet" routine

**Run:** `scratchpad/topics/scripts/weekly.sh`
- It pulls the newest 30 uploads from 20 watchlist channels plus Rick's Shorts.
- It compares each video with the stored baseline medians.
- It writes `data/weekly/YYYY-MM-DD.tsv` with every video at ≥3×.
- It is metadata only, low CPU, and takes about 2 minutes. The first run is already saved.

**Watchlist.** These are the channels whose *breakouts* teach the most; re-check the list every quarter.
- **Fast-growing animated psychology:** PsychToons, Psychology Simplified, Big Brain Explains, Apex Psychology, Sticko Explains, Mind. (@XoluMind), EverythingProfessor, Psych2Go, Sprouts, Aperture.
- **Social skills:** Charisma on Command.
- **Money:** Two Cents, Primate Economics, Crayon Capital, PolyMatter, Economics Explained.
- **History:** Historically.
- **Animated film and story:** Day One Films, Ifverse, The School of Life, RicksClips3000 (Shorts).

**The hour:**

| Minutes | Do |
|---|---|
| 0–5 | Run `weekly.sh`. Open the TSV. Ignore videos that appear only because of an old upload. Focus on positions 0–10 (the newest uploads). |
| 5–25 | For each new outlier, fill in four columns: **core_word** (1–2 words), **angle** (from the §2c list), **fit 1–5**, and a one-line **idea** in our voice. Score fit on four points: mission, animatable, Lens-friendly, no shame. Paste good ones into the master sheet. |
| 25–35 | **Demand check.** For the 3 most promising core words, run autocomplete for "psychology of X", "why do we X", "why is everyone so X" and "X explained". Note the completions; new long-tail phrases are gold. Optionally, run one view-sorted this-year search per word. |
| 35–50 | **Combine.** Take two proven items (a hot word plus a proven angle, or two hot words) and write 3 titles with our ripple twist. Add a thumbnail line (face + glowing object + 1–3 words) and the Lens skill. |
| 50–60 | **Update the leaderboard** and choose next week's script. |

**Leaderboard columns:** word · times seen as an outlier (rolling 8 weeks) · best multiplier · channels · demand hits · fit · last used by us.

**Scoring** (one number per idea):

```
Idea score = Outlier × Demand × Fit × Freshness
  Outlier   = log2(best multiplier)       + 1 for each extra channel showing it (cap +3)
  Demand    = autocomplete hits (0-10)/10 + 0.5 if a 2026 video on it has >1M
  Fit       = 1-5 (mission, animatable, Lens-friendly, no shame/fear)
  Freshness = 1.0 normally · 1.3 if a demand gap ("why is everyone so rude" style) · 0.5 if we covered it in the last 8 weeks
```

Recompute baselines (`outliers.py`) monthly, because channel medians drift.

**Rules for the sheet:**
- Log **patterns only**. Never copy a title word-for-word, a character, a script or a shot.
- No creator or celebrity names in our titles or tags unless they genuinely appear in the video.
- When an outlier depends on fear or shame, log the *core word*, not the framing, and write our validating version.

---

## 10. Sources checked today

- [Mastroianni & Gilbert 2023, *The illusion of moral decline*, Nature (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10284688) · [Axios summary](https://www.axios.com/2023/06/10/morality-illusion-science-beliefs)
- [Cohn et al. 2019, civic honesty and lost wallets (U. Michigan)](https://news.umich.edu/moral-concerns-override-desire-to-profit-from-finding-a-lost-wallet) · [Sci.News](https://www.sci.news/othersciences/psychology/civic-honesty-07337.html)
- [Hall 2018, hours to make a friend (KU News)](https://news.ku.edu/news/article/2018/03/06/study-reveals-number-hours-it-takes-make-friend)
- [Protzko & Schooler 2019, *Kids these days*, Science Advances (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6795513)
- [Woolley et al. 2010, collective intelligence factor (PubMed)](https://pubmed.ncbi.nlm.nih.gov/20929725/)
- [Engert et al. 2014, empathic stress (Neuroscience News)](https://neurosciencenews.com/cortisol-hpa-axis-stress-psychology-1007) · [Time](https://time.com/84080/stress-contagious/)
- [Robbins & Karan 2019, gossip 52 minutes a day (ScienceDaily)](https://www.sciencedaily.com/releases/2019/05/190503100814.htm)
- [Lynn, tipping and service quality (Cornell eCommons)](https://ecommons.cornell.edu/entities/publication/042e8740-5c44-486e-ab28-00f05781d153) · [Cornell Chronicle](https://news.cornell.edu/node/294601)

The following are cited from memory and marked "verify" above: Cacioppo/Fowler/Christakis 2009; Holt-Lunstad 2010; vanDellen & Hoyle 2010; Galla & Duckworth 2015; Sherman 2016; Schultz 1997; Huang 2017; Boothby 2018; Frank, Levine & Dijk 2014; Gilovich 2000; Dunn 2008; Verduyn 2015; van de Ven 2009; Shafir, Diamond & Tversky 1997; Shiller 1997; Bakker 2005; Latané & Darley 1968; Bryan & Test 1967; Goldstein et al. 2008; Keizer 2008; Sugiyama 2008; Gray, Ward & Norton 2014; Zadro 2004; Farkas 2002; Rosenthal & Jacobson 1968; Wetzel 2017.
