#!/bin/bash
cd /tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/hf/videos/sr-ep03
HF=/root/.npm/_npx/702923228c2ce1e6/node_modules/.bin/hyperframes
B=(0 86 172 258 344 430 515.33)
for i in 0 1 2 3 4 5; do
  out=renders/part$i.mp4; [ -s $out ] && continue
  echo "chunk $i ${B[$i]}-${B[$((i+1))]} start $(date +%T)"
  $HF render -o $out --quality looks --fps 30 --start ${B[$i]} --end ${B[$((i+1))]} </dev/null > renders/part$i.log 2>&1 || { echo "chunk $i FAILED"; tail -5 renders/part$i.log; exit 1; }
  echo "chunk $i done $(date +%T)"
done
echo ALL CHUNKS DONE
