#!/bin/bash
# usage: fetch.sh handle [videos|shorts] [n]
H=$1; TAB=${2:-videos}; N=${3:-150}
OUT=/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/topics/data/raw
nice -n 19 yt-dlp --flat-playlist --print $'%(title)s\t%(view_count)s\t%(duration)s\t%(upload_date)s\t%(id)s' "https://www.youtube.com/@$H/$TAB" --playlist-end $N > "$OUT/${H}__${TAB}.tsv" 2>"$OUT/${H}__${TAB}.err"
echo "$H $TAB $(wc -l < $OUT/${H}__${TAB}.tsv) $(tail -c 150 $OUT/${H}__${TAB}.err | tr '\n' ' ')"
