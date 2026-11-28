# Demo Short 3: "The Wow! Signal", 72 seconds

`wow-signal-72-seconds.mp4` is a 1080×1920 Short that lasts exactly 72.0 s, the duration of the 1977 Wow! signal's beam transit. The hook says so, and a running `T+ 00.0 S / 72.0` clock and transit curve sit across the top for the whole film. Mastered to -14.4 LUFS / -1.5 dBTP, stereo.

Built entirely on the local, quota-free stack from `../tools/TOOLS-ASSESSMENT.md`:

| Layer | Tool |
|---|---|
| Composition and render | HyperFrames `faceless-explainer` workflow, `broadside` preset (ink-black and fire-orange, Barlow plus IBM Plex Mono) |
| Frames | 12 HTML/GSAP sub-compositions, one parallel agent per frame from `.hyperframes/frame-packets/` |
| Voice | Kokoro-82M `af_heart`, speed 1.04 (Apache-2.0) |
| Captions | Parakeet TDT 0.6B v3 word timings, with misheard words corrected (e.g. "Amon" to "Ehman") |
| Score and sound design | `tools/score.py`, original numpy synthesis keyed to the frame starts in `tools/cues.json` (pad chords, radio static, line-printer ticks, value-pitched bars, pen scratch, the WOW hit, the signal sonified as a bell-curve tone, magnetar ping, warm resolve). `tools/duck.py` ducks the score under the voice. |
| Overlay | `compositions/overlay-transit.html`, the global 72 s clock and Gaussian transit curve |

## Brief and review

The reviewed brief is `BRIEF.md`, with the source facts in `capture/extracted/visible-text.txt`. The plan is `STORYBOARD.md`, the locked narration `SCRIPT.md`. The 1977 printout is redrawn in code and labelled "RECREATION"; no third-party photo is used. The script never claims aliens and presents the 2024 magnetar/hydrogen-cloud explanation as "proposed... maybe".

Critique loop (scored contact sheets), round 1 fixes:
- A `letterSpacing` tween (lint error) was removed.
- Frame 9's labels were lifted to the contrast threshold.
- The orange "T+" was invisible on the orange WOW frame.
- The last caption lingered over the end card.
- The overlay fade was synced with the final fade to black.

`qa-final-frames.jpg` holds 16 stills from the delivered MP4.

## Re-render

From a fresh container, run `bash research/meta-muse/tools/setup-local-stack.sh`, copy this folder somewhere writable, then:

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
python -I tools/score.py tools/cues.json assets/music/score.wav assets/music/sfx.wav   # music stems are not committed
python -I tools/duck.py
npx hyperframes lint && npx hyperframes check && npx hyperframes render --quality high --output renders/video.mp4
```

Then master: remix the voice (`assets/voice/*.wav` at the frame starts), the score at 0.30 and the sound effects at 0.45 into stereo, then run `loudnorm=I=-14:TP=-1.5`. `CLAUDE.md` and `AGENTS.md` here are HyperFrames' own project guidance, written by `hyperframes init`.

## Alternate score

`wow-signal-72-seconds-acestep-score.mp4` has the same picture, voice and sound effects. The score is a local ACE-Step 1.5 take (seed 815, no LM, generated in about 4 min on CPU; prompts in `../tools/acestep/`). It swells near 30 s, close to the WOW beat, and fades to silence at 72 s. It is ducked under the voice, dipped under "Nothing.", sat 11 dB below the narration, and mastered to -14.4 LUFS.
