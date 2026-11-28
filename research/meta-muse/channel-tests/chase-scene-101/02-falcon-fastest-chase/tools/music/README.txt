ACE-Step 1.5 (MIT weights), CPU. Used take: seed 2024, 94 s, 96 BPM, E minor.
gen: venv/bin/python -I scripts/gen.py --root <acestep> --duration 94 --out falcon/take2.wav --seeds 2024 --caption-file caption.txt --lyrics-file lyrics.txt --bpm 96 --key "E minor"
mix: python tools/sfx.py tools/cues.json sfx.wav && python tools/mix.py take2.wav sfx.wav mix.wav -12 -4 && ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1.5 -ac 2 master.wav
