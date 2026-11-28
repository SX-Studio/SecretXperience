#!/bin/bash
cd /tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/hf/videos/sr-ep02
export HYPERFRAMES_PYTHON=/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/venv/bin/python
gen() { while IFS=$'\t' read -r id voice pitch text; do
  [ -f $2/$id.wav ] && continue
  npx hyperframes tts "$text" --voice $voice -o $2/${id}_raw.wav >/dev/null 2>&1 </dev/null
  tempo=$(python3 -c "print(round(1/$pitch,4))" </dev/null)
  ffmpeg -nostdin -y -loglevel error -i $2/${id}_raw.wav -af "asetrate=24000*$pitch,aresample=24000,atempo=$tempo" $2/$id.wav; rm -f $2/${id}_raw.wav; echo $id
done < $1; }
gen walla_lines.tsv .walla; gen react_lines.tsv .react; echo DONE
