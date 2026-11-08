"""Captions from the script words + word clock: phrase-split, max 9 words per cue, break on punctuation."""
import json, re, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(ROOT, "assets/t.js")).read(); WORDS = json.loads(re.search(r"window.WORDS=(.*?);\n", s).group(1))
SPK = {"mo": "MO", "bea": "BEE", "finn": "FINN", "ana": "ANA", "penny": "MR. PENNY"}
def ts(t): h = int(t // 3600); m = int(t % 3600 // 60); sec = t % 60; return f"{h:02d}:{m:02d}:{int(sec):02d},{int(round((sec - int(sec)) * 1000)):03d}"
cues, cur = [], []
for i, w in enumerate(WORDS):
    if cur and (w[3] != cur[-1][3] or len(cur) >= 9 or re.search(r"[.?!]$", cur[-1][0]) or (re.search(r"[,:;]$", cur[-1][0]) and len(cur) >= 4)): cues.append(cur); cur = []
    cur.append(w)
if cur: cues.append(cur)
out = []
for n, c in enumerate(cues):
    st, en = c[0][1], max(c[-1][2], c[0][1] + 0.6)
    if n + 1 < len(cues): en = min(en + 0.25, cues[n + 1][0][1] - 0.02)
    lid = c[0][3]; who = SPK.get(lid.split("_")[0]) if not lid.startswith("n") else None
    text = " ".join(w[0] for w in c); text = (f"{who}: " if who and c is cues[[k for k, cc in enumerate(cues) if cc[0][3] == lid][0]] else "") + text
    text = re.sub(r"\bBee\b", "Bea", text); text = re.sub(r"\bKai\b", "Kai", text)
    out.append(f"{n + 1}\n{ts(st)} --> {ts(en)}\n{text}\n")
open(os.path.join(ROOT, "ep3-captions.srt"), "w").write("\n".join(out)); print(len(out), "cues")
