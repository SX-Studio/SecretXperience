# Episode 3: How Money Actually Works, Explained With One Sandwich

**Running time:** 8:35, 16:9 at 1920×1080, 30 fps. **Scale:** money (one tiny island town).

This is the first full episode built with the **3D-world method** from the tutorial the user shared: 2D characters lit inside a real 3D world built in code (three.js), with ink outlines, warm key light, violet shadows and a camera that glides. Each shot was checked as a still before rendering.

## Files

| File | What it is |
|---|---|
| `social-ripple-ep03-how-money-actually-works.mp4` | The film (repo encode if over GitHub's 100 MB limit; the full-quality render is sent in chat) |
| `thumbnail-A-they-just-type-it-1280x720.jpg` | Recommended thumbnail, Day One style: Mo's huge face lit by the bank's CRT showing "+$1,000 NEW MONEY", near-black room, marker title "THEY JUST TYPE IT?!" |
| `thumbnail-source.html` | Thumbnail source (engine still) |
| `ep3-captions.srt` | Captions, 269 cues from the script and the word clock |
| `RESEARCH-FACTS.md` | Fact sheet: every claim with its source, verdict and the phrasing we used |
| `project/` | The HyperFrames project (engine, sets, story, mixer, sound kit, timing) |

## How it was made (the method, applied)

1. **Engine (`sr3d.js`).** A three.js toon world (3-step light ramp) with a custom post pass:
   - **ink** from the depth Laplacian (1/z) and normal edges, fading with distance and depth of field;
   - a **24-tap depth-of-field** focused on the camera's look target;
   - a saturation lift, with dark tones nudged toward purple so nothing goes pure black.

   The 2D SVG rig (light skin, thin limbs) is **projected into the world**: scaled by distance, depth-sorted, clipped behind counters and desks, facing worked out from world direction, and lit with an inner rim plus a tint that matches the scene light.
2. **Many agents, split by files.** Three agents built the sets in parallel, each owning one file and testing in its own copy of the project:
   - `ep3-town.js`: the island, the square, Mo's Sandwiches, the bank, Bea's Bakery, the Crab Shack, Kai's yard, Ana's cottage, the harbour, and the boom/bust/night states;
   - `ep3-interiors.js`: the shop with OLD BETTY and the new oven, the bank with the vault and CRT, and Ana's flat;
   - `ep3-props.js`: the $10 note, the hero sandwich, coins, the money-flow arcs, the stamp, the piggy bank, and the Yap stone-money diorama.

   A fourth agent fact-checked the script. The director file (`ep3-story.js`) stages everything against the word clock.
3. **Measure, don't opine.**
   - About 90 stills were checked before rendering, which caught cameras blocked by characters, a cropped top-down shot, a bill hidden behind the fountain, and overlapping shot keys.
   - Gemini reviewed the music cues: 10/10 each, with no glitches or vocals.
   - Gemini also reviewed the full mix (8.5/10). Fixes that held up against the timeline were applied: character voice level, the boom→bust crossfade and the splash level. Claims that didn't match the timeline were ignored.
4. **Sound.**
   - Kokoro voices: a narrator plus Mo, Bea, Finn, Ana and Mr. Penny.
   - Four new ACE-Step cues: sunny island (ukulele/marimba), boom calypso, night piano, sunrise.
   - A new synthesized island kit: waves, gulls, town murmur, shop bell, typing, splash, bubbles, steel-drum stings and more.
   - Mastered to −14 LUFS.

## The story

1. **Cold open.** One $10 bill will pay for four things for four people, and nobody loses a cent. A flash-forward shows the boom, then the bust.
2. **Crumb Island.** Mo needs bread, Bea wants fish, and Finn wants a sandwich: the double coincidence of wants, labelled as a thought experiment, not history.
3. **Money is an agreement.** Yap's stone money, and the stone that sank but still counted.
4. **Spending is income.** The bill goes round: Ana → Mo → Bea → Finn → Mo. Then the aerial ripple map of money arcs.
5. **Banks create money.** Mo's $1,000 loan for a second oven. "Approved." The savings myth, then the Bank of England quote, and Mr. Penny types $1,000 into existence. Borrowing creates money; repaying deletes it. Banks are limited by profits, rules and interest rates.
6. **The boom.** Kai builds the oven, buys boots and takes his family out for crab. The Crab Shack hires a waiter, everyone borrows, a golden-hour party, and prices go $10 → $12 → $14.
7. **The bust.** Repayment day, red arcs flow back into the bank, the ripple runs backwards, the paradox of thrift, and Dalio's debt cycle.
8. **The Lens (micro-skill: *change it or reframe it*).** Ana's hours are cut and the rent is due. Money worry narrows attention (study labelled as disputed). APA 2026: 71%. Then the red lens vs the gold lens, "Money stress is real", Q1 "Can I change it?" (she calls the bank), Q2 "Can I reframe it?" (Troy 2013), and dawn.
9. **Somebody goes first.** The ripple turns forward, "all of us, rippling into each other", Ana at Mo's ("Ana! The usual?"), the A/B comment question, and the end card.

## Research (verified 2026-11-01; see `RESEARCH-FACTS.md`)

- **Bank of England Quarterly Bulletin 2014 Q1** (McLeay, Radia & Thomas):
  - "Whenever a bank makes a loan, it simultaneously creates a matching deposit…";
  - repayment destroys money;
  - 97% of UK broad money is bank deposits (Dec 2013);
  - lending is limited by profitability, regulation and monetary policy.
- **Ray Dalio, *How The Economic Machine Works* (2013):** "one person's spending is another person's income". The 5–8 year short-cycle length is his own estimate and is labelled as such.
- **Yap stone money:** Furness (1910), as retold by Friedman (1991). The narration says "a visitor was told".
- **Double coincidence of wants:** Jevons. That pure barter never existed is from Humphrey (1985) and Graeber (2011).
- **Scarcity:** Mani et al. (2013, *Science*), labelled with "later attempts to repeat it have had mixed results" (O'Donnell et al. 2021; Carvalho et al. 2016).
- **APA Stress in America 2026:** 71% of US adults say money is a significant source of stress. This was confirmed from the report text and coverage, because the PDF couldn't be opened automatically.
- **Troy, Shallcross & Mauss (2013, *Psychological Science*), n = 170:** reappraisal ability was linked with less depression when stress was uncontrollable and more when it was controllable. The narration says "linked".
- **Paradox of thrift:** Keynes, via the St. Louis Fed explainer.
