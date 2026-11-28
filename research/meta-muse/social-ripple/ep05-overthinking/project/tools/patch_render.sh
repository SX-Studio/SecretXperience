#!/bin/bash
# re-render only the spans touched by the QA fixes (frame-aligned at 30 fps)
cd /tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/hf/videos/sr-ep05
HF=/root/.npm/_npx/702923228c2ce1e6/node_modules/.bin/hyperframes
for span in 62.3:64.7 81.1:87.0 111.3:116.3 119.1:122.5 151.0:162.2 174.5:183.3; do a=${span%:*}; b=${span#*:}
  $HF render . --workers 3 --start $a --end $b -o renders/patch_$a.mp4 > renders/patch_$a.log 2>&1 < /dev/null; echo "span $a-$b exit $? $(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 renders/patch_$a.mp4 2>/dev/null) frames"; done
