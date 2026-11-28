#!/bin/bash
# usage: build.sh <short_dir> <name>   -> events, mix, loudnorm, render renders/<name>.mp4
D=$1; N=$2; V=/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/venv/bin/python; K=$(dirname $(dirname $(readlink -f $0)))
cd $D && mkdir -p renders && node $K/tools/events.cjs && $V $K/tools/mix.py . || exit 1
J=$(ffmpeg -hide_banner -i assets/mix_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i assets/mix_raw.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" -ar 48000 -c:a pcm_s16le assets/mix.wav
export HYPERFRAMES_RENDER_DETACHED=1
/root/.npm/_npx/f8bff2a7a94cc3a6/node_modules/.bin/hyperframes render . --workers 3 -o renders/$N.mp4 > renders/render.log 2>&1; echo EXIT $? >> renders/render.log; tail -1 renders/render.log
