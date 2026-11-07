# Social Ripple: channel plan (draft for the user's approval)

## What the two reference videos teach

Both references build the same thing: faceless stick-figure films made by Claude Code in code. There is no video model and no stock footage. The detailed notes are in `forensics/`.

- **Jackson's AI, "Opus 5.5 can make viral stick animations"** (12:51). The pipeline is:
  1. a "Narrated Script Engine" prompt that runs in states (niche, then 10 titles, then a script with a fact bank);
  2. an ElevenLabs voice;
  3. a `/make-2d-video` skill that asks for aspect, resolution, music and theme (Midnight / Dusk / Golden / Neon / Storybook), renders a preview, then the full video.

  A 3-minute video took about 4 minutes to render.
- **Jad M.H, "The Only Faceless Video You Will Ever Need"** (11:04). The rules are:
  1. "You don't invent the format": copy the pacing and layout, never the story or shots;
  2. a **style sheet**, one image holding the world's palette, type, characters and frame anatomy, is how people recognise a faceless channel;
  3. Claude builds every shot in code.

  His stick-figure rules: 25–32 pictures a minute, a blink every 3.5–4 s, feet never slide, the camera barely moves. He also lists three ways to earn: the YouTube Partner Program, TikTok Creator Rewards, and selling the same style to businesses.

**The format they point to**, all checked on 2026-10-31:

| Channel | Format | Evidence |
|---|---|---|
| **Ifverse** (@IfverseTales) | Narrated "What If…" films, 3–7 min, 16:9. A hero in a red hoodie; dusk palettes; numbers and HUD graphics woven into the story; a moral climax. | "What If Your Reaction Time Was 10x Faster?" has **4.6M** views; "500 IQ" has 1.45M. |
| **Last Soul** (@lastsoulorigin) | **No narrator.** Speech bubbles, title cards and piano. One named psychology idea per film ("REVENGE BEDTIME PROCRASTINATION"), ending on a mantra card. | "1 MINUTE" has **935k** views (habit building, 5:00); "Just 5 More Minutes… It's 2:14 AM" has 56k. |

Copycats are already reposting Last Soul's titles and getting about 10 views (for example "Tales Of Discipline"). Copying the look gets nothing; **a distinct concept is the only way in.**

## The concept

**Social Ripple: animated short films about how one small act travels through people you'll never meet, built on real research.**

The name gives the device. Every episode follows one act (a snap, a kindness, a rumour, a seat offered) as it passes from person to person, usually three degrees out. Then someone turns it around, and it ripples back to where it started.

This structure is backed by research. Fowler & Christakis followed 4,739 people over 20 years ([BMJ 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2600606/)). A person was **15.3%** more likely to be happy when a direct contact was happy, **9.8%** at two steps and **5.6%** at three. Generosity in experiments was **tripled** by the people it reached, up to three degrees ([PNAS 2010](https://hcp.hms.harvard.edu/publication/cooperative-behavior-cascades-human-social-networks)). Rudeness spreads the same way: a person who received it passed it on, even a week later ([Foulk et al., J. Applied Psychology 2016](https://www.eurekalert.org/news-releases/750826)). The happiness findings have critics (Fletcher & Cohen-Cole), so scripts say "one 20-year study found", never "science proves".

**How it differs from both reference channels:**
- **Ifverse** has one hero with a superpower. Social Ripple has **a chain of ordinary people**, with a new person and a new place at each degree.
- **Last Soul** names a psychology idea. Social Ripple also **shows the mechanism** (the ripple ring, the travelling thread, the degree counter) and cites **one real study** on screen.
- **The loop ending** brings the ripple back to the first person. That drives rewatching and comments ("who's in your three degrees?").

## The format

- **Long-form:** 16:9, 3–5 min. This is where both reference channels get their views and where ad revenue is.
- **Shorts:** one 45–60 s vertical cut of each episode's turn.
- **Beats:**
  1. Cold open: a tiny act with a time stamp ("7:42 AM").
  2. Degree 1, then 2, then 3, each a new person and place, joined by a ring-wipe.
  3. A **phenomenon card** naming the effect, with the study and one number.
  4. The turn: someone breaks the chain.
  5. The return: the ripple reaches the first person.
  6. A **mantra card**.
  7. A comment question.
- **Voice:** to be decided (see `STORYLINES.md`).
  - A calm narrator: Kokoro `af_heart`, local and licensed for commercial use.
  - Or no narrator: speech bubbles and cards, the Last Soul way. This plays in every language, so it also reaches non-English viewers.
- **Sound:** an original score for each film (ACE-Step, local) and Foley on visible actions only.

## The look ("style sheet")

- **Characters:** ink-black round heads, white eyes and a white mouth. Each person wears **one garment colour that stays theirs for the whole film**: Maya teal, Leo mustard, and so on.
- **Sets:** flat cut-colour daylight worlds (street, café, office, bus, kitchen, school), with time-of-day skies: morning peach, noon blue, evening coral, night slate.
- **Ripple colours:** **red #E2412F** for anything that hurts, **gold #F2B33D** for anything that helps. These are the only saturated accents, so the viewer always knows what is spreading.
- **Type:** Outfit 800–900 for cards; Nunito Black for bubbles and signs.
- **Banned:** dark voids, glow, neon, generic purple gradients, three-card rows, corner HUDs. The ripple rings are flat ink strokes, never glowing.

## The engine (built and tested)

`engine/sr-engine.js` is the channel's reusable animation library. It is our version of the tutorials' "make-2d-video" skill, with nothing to buy.
- **A rig:** about 25 poses (walk and run driven by distance so feet don't slide, sit, phone, give, wave, startle, shout, slump, hug, drive and others).
- **Faces:** 12 moods that blend into each other through a squash "take", plus automatic blinks every 3.8 s and a 12 fps line boil.
- **Props:** phone, cup, umbrella, bag, note.
- **A set library:** sky, buildings, shopfront, street, lamp, tree, car, counter, window, table, bench, grain.
- **The ripple device:** expanding rings plus a travelling thread.

Everything is drawn from timeline time alone, so renders are deterministic. A 7 s test rendered in 14 s, which puts a 4-minute episode at about 8 minutes. `look-test.mp4` shows the look: Maya is honked at, the red ripple jumps to Leo at the café.

## First 12 episode ideas (one real study each)

1. **The Bad Mood That Reached a Stranger.** Rudeness contagion (Foulk 2016) plus three degrees of happiness (Fowler & Christakis 2008).
2. **Nobody Goes First.** Pluralistic ignorance, from Latané & Darley's smoke-filled-room study (1968).
3. **They Liked You More Than You Think.** The liking gap (Boothby et al., *Psychological Science* 2018).
4. **The Kindness You Almost Didn't Do.** People underestimate how much a small kindness means (Kumar & Epley 2022).
5. **Why Greed Gets Paid Forward.** The pay-it-forward asymmetry (Gray, Ward & Norton 2014).
6. **The Favour That Made an Enemy a Friend.** The Ben Franklin effect (Jecker & Landy 1969).
7. **Your Best Friend Lives 20 Metres Away.** Proximity and friendship (Festinger, Westgate study, 1950).
8. **The Mistake That Made Them Trust You.** The beautiful mess effect (Bruk et al. 2018).
9. **One Post Changed a Million Moods.** Emotional contagion online (Kramer et al., PNAS 2014).
10. **The Teacher Who Expected More.** The Pygmalion effect (Rosenthal & Jacobson 1968; disputed, and the film says so).
11. **The Seat on the Bus.** Social proof and one person breaking a norm.
12. **The Compliment That Lasted 10 Years.** Memory for kind words, a "3 degrees in time" variant.

Each study gets checked against its paper before scripting, as the BMJ figures above were.

## Before launch (the user's steps)

- **Create the channel.** Check that the @SocialRipple handle is free; no channel named "Social Ripple" showed up in a YouTube search on 2026-10-31.
- **Pick the pilot storyline** (`STORYLINES.md`) and the voice option.
- **Posting rhythm:** one long-form a week, with its Short 2–3 days later.
- **Disclosure:** "altered or synthetic content" is not required, because these are cartoons, not realistic people.
- **Monetization:** YPP needs 1k subscribers plus 4k watch hours, or 1k plus 10M Shorts views in 90 days. Jad's video claims these double on 2027-02-01; that is unverified, so check YouTube's page.
