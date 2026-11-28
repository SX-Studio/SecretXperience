#!/bin/bash
# usage: sheet-v.sh <short_dir> t1 t2 ...  -> tools/sheet.jpg (vertical stills, 6 per row)
K=$(dirname "$(readlink -f "$0")"); D="$1"; shift; bash "$K/page.sh" "$D"; cd "$D" && mkdir -p tools || exit 1
node "$K/events.cjs" "$@" > tools/ev.log 2>&1; n=$#; ins=""; for t in "$@"; do ins="$ins -i tools/s_$(node -e "console.log(Number('$t'))").png"; done
ffmpeg -v error -y $ins -filter_complex "$(for i in $(seq 0 $((n-1))); do printf "[%d]scale=320:568[v%d];" $i $i; done)$(for i in $(seq 0 $((n-1))); do printf "[v%d]" $i; done)xstack=inputs=$n:layout=$(for i in $(seq 0 $((n-1))); do printf "%d_%d" $(( (i%6)*320 )) $(( (i/6)*568 )); [ $i -lt $((n-1)) ] && printf "|"; done):fill=white" -q:v 3 tools/sheet.jpg && tail -2 tools/ev.log
