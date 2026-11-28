#!/bin/bash
# usage: vo.sh <short_dir>   lines.tsv = id<TAB>gap_before<TAB>text ; makes assets/vo/*.wav, .words/*.json, assets/t.js
D=$1; H=/root/.npm/_npx/f8bff2a7a94cc3a6/node_modules/.bin/hyperframes; export HYPERFRAMES_PYTHON=/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/venv/bin/python
cd $D; mkdir -p assets/vo .words
while IFS=$'\t' read -r id gap txt; do [ -z "$id" ] && continue; new=$RETX
  if [ ! -s assets/vo/$id.wav ] || [ "$(cat .words/$id.txt 2>/dev/null)" != "$txt" ]; then
    $H tts "$txt" -o assets/vo/$id.wav -s ${SPEED:-1.05} >/dev/null 2>&1; echo "$txt" > .words/$id.txt; new=1; fi
  if [ -n "$new" ] || [ ! -s .words/$id.json ]; then
    $H transcribe assets/vo/$id.wav --json 2>&1 | grep '"type":"words"' | python3 -c "import sys,json; w=[x for l in sys.stdin for x in json.loads(l)['words']]; print(json.dumps({'words':w}))" > .words/$id.json; fi
done < lines.tsv
/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/venv/bin/python - <<'PY'
import json, soundfile as sf
DT={}; W={}; t=0
for ln in open("lines.tsv"):
    if not ln.strip(): continue
    i,g,txt=ln.rstrip("\n").split("\t"); a,sr=sf.read(f"assets/vo/{i}.wav"); d=len(a)/sr
    # trim trailing silence
    import numpy as np; x=np.abs(a if a.ndim==1 else a.mean(1)); nz=np.where(x>0.01)[0]; d=(nz[-1]/sr+0.05) if len(nz) else d
    t+=float(g); DT[i]=[round(t,3),round(d,3)]; W[i]=json.load(open(f".words/{i}.json"))["words"]; t+=d
hold=float(open("hold.txt").read()) if __import__("os").path.exists("hold.txt") else 1.2
D=round(t+hold,2); open("assets/t.js","w").write(f"window.DT = {json.dumps(DT)}; window.DUR = {D}; window.WORDS = {json.dumps(W)};")
print("DUR",D); [print(k,v,' '.join(w['text'] for w in W[k])) for k,v in DT.items()]
PY
