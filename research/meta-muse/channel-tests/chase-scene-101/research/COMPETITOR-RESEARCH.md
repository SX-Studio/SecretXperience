# What is working in animal / wildlife Shorts (researched 2026-10-21)

Method: YouTube search, Shorts filter, uploaded this month, sorted by view count, for 14 niche queries (`top-shorts-oct-2026.tsv`). Then I pulled the latest 40 Shorts of the strongest small educational channels, and had Gemini watch five winners (`gemini-breakdowns/`, made with `shortwatch.py`).

## Status at research time

Episodes 1 and 2 both showed 0 views hours after upload. Even weak Shorts usually get some views from the feed, so 0 suggests a distribution problem:
- **What to check:** visibility, restrictions, and whether "Shorts feed" appears as a traffic source.
- **Audience mismatch:** the new Shorts don't match the channel's past audience of compilation clips.

## Benchmarks

| Channel | Subs | Recent Shorts (median views) | Hits this month | Length | Format |
|---|---|---|---|---|---|
| Events Untold | 52.7k | ~106k | 17.2M, 15.9M, 11.6M, 9.0M, 6.3M | 7–21 s | real footage, black top banner with highlighted keywords, red arrow, drums + impact SFX, no VO, loops |
| Ghosts of History | 122k | ~430k | 5.6M, 5.5M | ~7 s | real footage, "A [animal] does [thing]" titles |
| トコトコちゃん | 43.9k | ~92k | 9.5M ("The Only Animal That Beats Up Orcas") | 32 s | real footage, fast AI VO (~4 w/s), bold captions, cuts every 1–3 s, loop |
| Zack D. Films | 29.3M | ~8.75M | 14.8M (eye positions) | 35 s | 3D animation, VO + captions, seamless loop |
| Beast tier | 190k | ~137k | 7.5M | 60–130 s | "5 animals that…" listicles |

## Rules taken from this (applied in episode 3)

1. **Length:** 7–35 s. Episodes 1–2 ran 78–89 s, two to ten times longer than everything winning.
2. **Banner:** state the contradiction in a persistent top banner from frame 0, with 2–3 highlighted keywords.
3. **Imagery:** real imagery wins. Use public-domain U.S. government photos and footage (NPS, USFWS, BLM, NOAA) instead of reused clips, to avoid reused-content and copyright risk.
4. **Pace:** a visible change every 1.5–3 s, and voiceover at about 3 words per second.
5. **Loop:** no end card. The last line runs into the first, and the last frame equals the first.
6. **Title formula:** "Why X does Y" or "This animal… / The only animal that…".
