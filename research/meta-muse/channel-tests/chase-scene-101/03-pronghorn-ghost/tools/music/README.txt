ACE-Step 1.5 (MIT weights), CPU. Take: seed 112, 34 s, 112 BPM, D minor.
Mix: python tools/sfx.py tools/cues.json sfx.wav && python tools/mix.py take1.wav sfx.wav mix.wav -11 -4 && ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1.5 -ac 2 master.wav
