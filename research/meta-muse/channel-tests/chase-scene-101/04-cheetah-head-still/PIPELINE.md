# Episode 4 pipeline (voice first, real footage, motion-tracked graphics)

1. **Script, then voiceover first.** Write `SCRIPT.md` and record it with Kokoro `bm_george` at speed 1.05 (`audio.mjs`). The word timings in `audio_meta.json` drive every cut and every graphic beat. The last frame holds 3 s after the final word, so the ending is never cut.
2. **Footage.** "Cheetahs on the Edge — Director's Cut", by Gregory Wilson (2012), filmed at 1,200 fps at the Cincinnati Zoo for National Geographic. Licence CC BY 3.0, via Wikimedia Commons; the Commons copy is a 1080p transcode. The film's own real-time counter shows the playback is about 60× slower than real time.
3. **Tracking.** `tools/composite.py` (OpenCV) segments the cheetah's coat colour in every frame. From that it gets the head, hips, the spine as a dorsal polyline, the lowest paw, and the tail tip. The face in the head-on shot uses CSRT tracking instead.
4. **Composites.** The same script writes 1080×1920 composites to `public/clips/sN_raw.mp4`, using one of three layouts:
   - a blurred backdrop with a footage window that follows the animal;
   - a full-bleed crop;
   - a head-locked crop.

   It also writes per-frame overlay coordinates to `public/clips/sN.json`, so the HyperFrames graphics follow the animal. Freeze frames are built into the clip at the airborne moment.
5. **Frames.** Seven HyperFrames frames draw the tracked HUD: the head reticle, the spine line, head and hip trails with the measured 11× ratio, the paw and tail rings, and the inner-ear diagram. A global top banner and captions sit over them.
6. **Audio.** ACE-Step score, slowed by 3.5% so the final chord rings out to the last frame, plus synthesized sound effects (`tools/sfx.py`, `tools/cues.json`). The voice is ducked against the music, and the mix is mastered to -14 LUFS.
7. **Review.** Contact sheets go through a critique round, then Gemini reviews the final MP4. Each flagged claim is checked against the data before acting:
   - audio tail energy of the last word;
   - caption JSON;
   - per-frame luminance, looking for black frames.
