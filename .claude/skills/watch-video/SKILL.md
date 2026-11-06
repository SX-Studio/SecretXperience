---
name: watch-video
description: Watch and listen to a video yourself, as close to how a viewer experiences it as possible. Use when asked to study, review, QA or learn from any video (our renders, a reference YouTube video or Short, a competitor), or before judging pacing, acting, expressions, sound or editing. Produces timestamped picture sheets (every N seconds plus every cut), a picture of the sound under each sheet (spectrogram, loudness, voice pitch, hits, silences, cuts, motion), a word-timed transcript, and optionally a listening log from Gemini. Read the sheets with your own eyes; don't rely only on another model's summary.
---

# Watch a video (eyes and ears)

## What this can and can't do (be honest with the user)
- Claude takes in **text and still images**. It does not experience continuous motion and cannot hear audio directly.
- This skill closes most of the gap:
  - **Pictures:** dense timestamped frames plus the first frame of every cut, which Claude looks at directly.
  - **Motion:** a frame-difference curve, plus `--step 0.1` segments to study acting frame by frame.
  - **Sound you can see:** a spectrogram, a loudness curve, voice pitch dots (intonation, emphasis, a cracking voice), sudden hits/SFX and silences.
  - **Words:** Parakeet transcript with word times.
  - **A second pair of ears:** `--ears` has Gemini listen to the soundtrack for voice tone, music mood and sound-effect identity.
- **Gemini can be wrong.** It once called our female narrator "male". Trust measurements and your own reading of the frames first, and treat Gemini as a second opinion. When they disagree, say so.

## Run
```bash
python3 .claude/skills/watch-video/watch.py <video file or URL> <outdir> [--step S] [--start A --end B] [--ears]
```
- **Step:** auto by length (0.5 s up to 75 s, 1 s up to ~7 min, then 2 s and 4 s). Every cut is always added on top.
- **Close study:** `--start 61 --end 66 --step 0.1` gives a frame-by-frame view of a moment (acting, timing, squash/stretch).
- **Output:**
  - `timeline.md`: per window, the cuts, words, hits, silences, loudness, voice pitch range and motion;
  - `sheets/sheet_*.jpg`: what to look at;
  - `watch.json` (raw data), `audio.wav`, `ears.md`.
- **YouTube:** downloads may hit "confirm you're not a bot". Options, in order:
  1. ask the user for the file (or a screen recording);
  2. ask them for an exported `cookies.txt` and set `YTDLP_COOKIES=/path/cookies.txt`;
  3. fall back to Gemini's YouTube reader (`engine/tools`-style `ask.py` with the video ID). Use its answers as directional only, with approximate timestamps.

## How to watch (do this, in order)
1. Read `timeline.md` once for the shape: length, number of cuts, average shot, loudness range.
2. **Open every sheet in order with Read.** For each window, describe to yourself what a viewer sees and hears: shot sizes, faces, staging, text on screen, what changes between frames, where the sound peaks or goes silent, whether pitch dots rise (question or excitement) or stay flat (deadpan, sad).
3. For key moments (hook, big emotional beat, gag, twist), re-run on that segment with `--step 0.1` or `0.2` and look at the motion.
4. With `--ears`, read `ears.md` and cross-check it against the spectrogram, hits and words.
5. Report with timestamps. Separate what you **saw** (frames), **measured** (numbers) and what **Gemini heard** (ears).

## Reading the sound strip
- **Spectrogram** (low frequencies at the bottom):
  - speech = striped vertical bursts in the lower-middle;
  - music = steady horizontal bands;
  - hits/SFX = bright vertical slashes;
  - silence = dark.
- **Yellow line:** loudness.
- **Mint dots:** voice pitch, 75–400 Hz on a log scale.
- **Blue triangles:** sudden hits.
- **Red lines:** cuts.
- **Grey bars:** silences.
- **Green line below:** amount of picture motion (cuts are excluded).

## Uses in this project
- QA every render before delivery. It finds things summaries miss, e.g. a waving hand covering a face, or a prop fading out.
- Study reference videos frame by frame (see `research/meta-muse/social-ripple/studies/`).
- Compare our episode against a reference on cut rate, motion, silence and voice range.
