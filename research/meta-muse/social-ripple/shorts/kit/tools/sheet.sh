#!/bin/bash
# usage: sheet.sh <chapter_dir> [t1 t2 ...]  -> tools/sheet.jpg (4 cols). No times = reuse the times of existing tools/s_*.png
K=$(dirname "$(readlink -f "$0")"); D="$1"; shift; bash "$K/page-long.sh" "$D"; cd "$D" || exit 1
if [ $# -eq 0 ]; then set -- $(ls tools/s_*.png | sed 's/.*s_//;s/\.png$//' | sort -n); fi
WH=1920x1080 node "$K/events.cjs" "$@" > tools/ev.log 2>&1; n=$#; rows=$(( (n + 3) / 4 ))
ins=""; for t in "$@"; do ins="$ins -i tools/s_$(node -e "console.log(Number('$t'))").png"; done
ffmpeg -v error -y $ins -filter_complex "$(for i in $(seq 0 $((n-1))); do printf "[%d]scale=480:270[v%d];" $i $i; done)$(for i in $(seq 0 $((n-1))); do printf "[v%d]" $i; done)xstack=inputs=$n:layout=$(for i in $(seq 0 $((n-1))); do printf "%d_%d" $(( (i%4)*480 )) $(( (i/4)*270 )); [ $i -lt $((n-1)) ] && printf "|"; done):fill=white" -q:v 3 tools/sheet.jpg && cat tools/ev.log | tail -3
