#!/usr/bin/env bash
# Rebuild the Mixkit part of the library (Mixkit's licence allows use in videos, not redistributing the raw files, so they are not committed).
# Usage: tools/fetch_mixkit.sh <lib_dir>   (needs ffmpeg + python with numpy/scipy/soundfile)
set -euo pipefail
LIB=${1:-lib}; HERE=$(cd "$(dirname "$0")" && pwd); RAW=$(mktemp -d)
for i in 1270 1269 1921 532 542 131 118 115 1307 3207 2832 2828; do curl -s -A 'Mozilla/5.0' -o "$RAW/mk_$i.mp3" "https://assets.mixkit.co/active_storage/sfx/$i/$i-preview.mp3"; done
for i in 1307 3207 2832 2828; do ffmpeg -v error -y -i "$RAW/mk_$i.mp3" -ac 2 -ar 48000 "$LIB/mk_$i.wav"; done
py() { python3 "$HERE/slice.py" "$@"; }
py "$RAW/mk_1270.mp3" "$LIB" stoneA 0.3 0.38 -30 8;  py "$RAW/mk_1269.mp3" "$LIB" stoneB 0.3 0.38 -30 8
py "$RAW/mk_1921.mp3" "$LIB" grassR 0.35 0.42 -30 8; py "$RAW/mk_532.mp3"  "$LIB" grassT 0.35 0.42 -30 8
py "$RAW/mk_542.mp3"  "$LIB" pave 0.25 0.35 -30 8;   py "$RAW/mk_131.mp3"  "$LIB" chip 0.18 0.32 -30 10
py "$RAW/mk_118.mp3"  "$LIB" crunchR 0.18 0.32 -30 10; py "$RAW/mk_115.mp3" "$LIB" crispR 0.18 0.32 -30 10
