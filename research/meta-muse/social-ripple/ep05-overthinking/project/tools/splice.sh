#!/bin/bash
# overlay the re-rendered spans onto the full render (frame-exact), fix frame 0, encode delivery
cd /tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad
R=hf/videos/sr-ep05/renders; B=ep05/ep5-full-raw.mp4
S=(62.3 81.1 111.3 119.1 151.0 156.5 174.5)
in="-i $B"; fc=""; prev="0:v"
for i in "${!S[@]}"; do s=${S[$i]}; in="$in -i $R/patch_$s.mp4"; j=$((i+1))
  fc="$fc[$j:v]setpts=PTS-STARTPTS+$s/TB[p$j];[$prev][p$j]overlay=eof_action=pass:repeatlast=0[o$j];"; prev="o$j"; done
fc="$fc[$prev]trim=start_frame=9,setpts=PTS-STARTPTS,tpad=start=9:start_mode=clone[v]"
ffmpeg -y -v error $in -filter_complex "$fc" -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -r 30 -movflags +faststart -c:a copy ep05/out/ep05-final.mp4
ffprobe -v error -show_entries format=duration,size -of compact ep05/out/ep05-final.mp4
