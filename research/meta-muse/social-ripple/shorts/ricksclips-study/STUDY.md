# RicksClips3000, plus Mr omi's Claude workflow (2026-11-01)

## The channel

[Ricks Clips (@RicksClips3000)](https://www.youtube.com/@RicksClips3000) has **126k subscribers and 146 Shorts**, and over 200M views across its last ~80 Shorts. The description says *"Just a regular guy who loves doing voiceovers."*

| Short | Views |
|---|---|
| The Ancient Jar That Warned an Empire | **30M** |
| The Job Nobody Wants in Japan | 15M |
| He Was A Genius | 15M |
| The Window That Breaks Japan's Gambling Law | 12M |
| Your Brain's Secret Idea Zone | 12M |
| Levels of Pirate Cannonballs | 8.5M |
| Why Humans Can't Pick Random Numbers | 7.8M |

The topics are hidden history, "why" facts, odd laws and jobs, and brain science, each with a physical cause and effect.

## The look (measured; Mr omi's skill has the numbers)

- **2D cartoon cards in a lit 3D world:**
  - white bean heads (h/w about 0.94), plum ink about #241726;
  - coloured capsule bodies with thin stick limbs (about 0.055 of head width) and dot hands;
  - characters about 3.5 heads tall.
- **World:** about 3 px near-black ink lines on world edges. Saturated colour, warm key light, cool violet-blue shadows (never brown), and no pure black.
- **Depth of field** on about a third of the runtime (close-ups and inserts); wide shots stay sharp.
- **Camera:**
  - **almost no hard cuts** (12 of 20 Shorts have one or none);
  - smootherstep glides over 18–40 frames;
  - every hold creeps in 0.15–0.35% per frame (0.6% on punch words);
  - impact shakes flip every frame and decay over 7 frames;
  - rolls of 4–5°.
- **The light follows the story:** warm during the setup, then **deep night blue when the explanation starts**.
- **Voice:** one steady narrator at about 3.5–4.1 words per second, with no dead air. The film ends crisply on the last word.
- **Captions:** one word at a time, bold white with a black outline, about 70% of the way down the frame.

## The script formula (verified on 20 transcripts)

1. **The hook:** the paradox as plain fact, no intro.
2. **The setting:** year and place.
3. **Escalation** in three or four beats.
4. **The snap or mystery.**
5. **"You see…"** (14 of the 20 pivot on these exact words), then one everyday analogy.
6. **The consequence**, then an ironic one-line payoff. Jokes are researched real facts ("the river was only two feet deep").

## Mr omi's method

Sources: [video](https://youtu.be/OtbLL6OBNE4) and [skill (MIT)](https://github.com/mromidev/claude-animated-shorts).

- **Measure, don't opine.** A contact sheet every 2 s, phase-correlation camera tracking, luma, chroma and cut counts, saved as a style bible plus per-topic reports.
- **Build:** three.js and Remotion, low-poly Kenney models, code-painted textures, an ink pass *before* the lens blur.
- **Look-match loop:** one agent per area (colour, ink, light, textures, characters, depth, motion), each owning its own files in a sandbox, then merge and run a verifier pass scored out of 10.
- **QA every frame** for black, white, frozen and popping frames.

## Our first Short: `../short01-petrov/`

Title: "He Ignored a Nuclear Alarm", the true story of Stanislav Petrov, 26 Sep 1983.
- The formula is applied, and the "You see" pivot comes with the light shifting to night blue.
- One continuous camera journey: bunker → up through the ground into space → dawn.
- Single-word captions; light-skinned thin-limb characters.
- The Lens lesson is the payoff line: *"question the first story your fear tells you."*
- 46.5 s, −14 LUFS. Gemini scored it 9.5/10.

**Next upgrade:** a real 3D world (three.js inside HyperFrames) for the Shorts series.
