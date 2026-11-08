# Episode 2 project (HyperFrames)

Rebuild from scratch:
1. Voices: `bash tools/gen_vo.sh` (Kokoro, from `vo_lines.tsv`), then `bash tools/words.sh` (Parakeet word clock into `.words/`), then `python tools/plan.py` (writes `assets/timing.js` and `tools/plan.json`).
2. Lip-sync: copy the character lines into one folder, then run `python tools/lips.py <dir> assets/lips.js`.
3. Scenes: edit `compositions/src/sXX.js`, then run `python tools/wrap.py` to write `compositions/sXX.html`, then `python tools/build_index.py`.
4. Sound: run `bash tools/gen_misc.sh` (teen chatter and reactions), then `python -I tools/sound_kit3.py assets/sfx .walla .react`. Copy the episode-1 and v2 kit files the mixer names into `assets/sfx`. Generate the music cues from `tools/capA.txt`, `capB.txt` and `capC.txt` with ACE-Step 1.5 (A: 130 s at 104 BPM; B: 110 s at 90 BPM; C: 100 s at 104 BPM).
5. Mix: run `MUS=<cue dir> python -I tools/mix_ep2.py`. Then `ffmpeg … acompressor, alimiter, loudnorm I=-14 TP=-1.5` writes `assets/mix.wav`.
6. Render: `npx hyperframes render --quality looks`.

The `.wav` assets aren't committed, because they are all regenerable.
