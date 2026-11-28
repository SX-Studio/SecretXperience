#!/bin/bash
cd /tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/hf/videos/sr-ep04
export HYPERFRAMES_PYTHON=/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/venv/bin/python
while IFS=$'\t' read -r id voice pitch text; do
  [ -f assets/vo/$id.wav ] && continue
  /root/.npm/_npx/702923228c2ce1e6/node_modules/.bin/hyperframes tts "$text" --voice $voice -o assets/vo/${id}_raw.wav >/dev/null 2>&1 </dev/null
  if [ "$pitch" != "1.0" ]; then
    tempo=$(python3 -c "print(round(1/$pitch,4))" </dev/null)
    ffmpeg -nostdin -y -loglevel error -i assets/vo/${id}_raw.wav -af "asetrate=24000*$pitch,aresample=24000,atempo=$tempo" assets/vo/$id.wav
  else
    mv assets/vo/${id}_raw.wav assets/vo/$id.wav
  fi
  rm -f assets/vo/${id}_raw.wav
  echo "$id $(ffprobe -v error -show_entries format=duration -of csv=p=0 assets/vo/$id.wav </dev/null)"
done < vo_lines.tsv
echo DONE
