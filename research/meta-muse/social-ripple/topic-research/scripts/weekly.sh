#!/bin/bash
# Weekly outlier sweep for the Social Ripple master sheet.
# Fetches the newest 30 uploads of each watchlist channel (flat metadata only, no downloads),
# compares views with the channel's baseline median (data/channel_summary.tsv), and writes
# data/weekly/YYYY-MM-DD.tsv with every video at >=3x. Low CPU: sequential + nice.
T=/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/topics
D=$T/data; mkdir -p $D/weekly; OUT=$D/weekly/$(date +%F).tsv
echo -e "channel\ttab\ttitle\tviews\tbaseline_median\tmultiplier\tposition_newest0\tvideo_id\tcore_word(fill)\tangle(fill)\tfit_1to5(fill)\tidea(fill)" > $OUT
WATCH="PsychToonsHQ PsychologyIsSimplified BigBrainExplains ApexPsychologyYT StickoExplains XoluMind EverythingProfessor Psych2go sprouts ApertureThinking Charismaoncommand TwoCentsPBS Primateeconomics Crayon_Capital PolyMatter EconomicsExplained HeyHistorically dayonefilmsofficial IfverseTales theschooloflifetv"
for h in $WATCH; do
  med=$(awk -F'\t' -v h="$h" '$3==h && $4=="videos"{print $6}' $D/channel_summary.tsv)
  [ -z "$med" ] || [ "$med" = "None" ] && continue
  nice -n 19 yt-dlp --flat-playlist --playlist-end 30 --print $'%(title)s\t%(view_count)s\t%(id)s' "https://www.youtube.com/@$h/videos" 2>/dev/null |
  awk -F'\t' -v h="$h" -v m="$med" '$2!="NA"{x=$2/m; if(x>=3) printf "%s\tvideos\t%s\t%s\t%s\t%.1f\t%d\t%s\t\t\t\t\n",h,$1,$2,m,x,NR-1,$3}' >> $OUT
done
m=$(awk -F'\t' '$3=="RicksClips3000" && $4=="shorts"{print $6}' $D/channel_summary.tsv)
nice -n 19 yt-dlp --flat-playlist --playlist-end 30 --print $'%(title)s\t%(view_count)s\t%(id)s' "https://www.youtube.com/@RicksClips3000/shorts" 2>/dev/null |
awk -F'\t' -v m="$m" '$2!="NA"{x=$2/m; if(x>=3) printf "RicksClips3000\tshorts\t%s\t%s\t%s\t%.1f\t%d\t%s\t\t\t\t\n",$1,$2,m,x,NR-1,$3}' >> $OUT
sort -t$'\t' -k6 -nr $OUT | head -40 | cut -f1,3,4,6
echo "Saved: $OUT"
