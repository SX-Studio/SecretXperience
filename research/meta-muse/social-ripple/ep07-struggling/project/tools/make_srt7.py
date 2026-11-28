"""Captions from the SCRIPT text (exact wording), timed with ASR word timings: chunks of <= 42 chars, each chunk timed by its words."""
import json, re
src = open("assets/t.js").read(); DT = json.loads(src.split("window.DT = ")[1].split("; window.SC")[0])
TXT = {}
for f, col in (("vo_lines.tsv", 3), ("tools/char_lines.tsv", 3)):
    for l in open(f):
        p = l.rstrip("\n").split("\t")
        if len(p) > col: TXT[p[0]] = p[col]
TXT.update({"ana_01": "I'm fine!", "ana_02": "Honestly? I'm moving my mum's things on Saturday. By myself. I didn't want to bother anyone.", "ana_03": "Would anyone be able to help on Saturday?", "theo_01": "Of course.", "mo_01": "I'll bring sandwiches!", "kai_01": "I've got a van."})
TXT["finn_01"] = "What do you call a fish with no eyes? A fsh! Ha ha!"
WHO = {"str": "STRANGER", "bea": "BEA", "finn": "FINN", "kai": "KAI", "ana": "ANA", "theo": "THEO", "mo": "MO"}
def ts(t): h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}"
out = []; n = 1
for lid, (st, d) in sorted(DT.items(), key=lambda x: x[1][0]):
    words = TXT[lid].split(); wj = json.load(open(f".words/{lid}.json")); W = wj.get("words", wj) if isinstance(wj, dict) else wj
    # map script word i -> ASR time proportionally (counts can differ slightly)
    def wt(i, end=False):
        if not W: return st + d * (i + end) / len(words)
        j = min(len(W) - 1, int(i * len(W) / len(words))); return st + (W[j]["end"] if end else W[j]["start"])
    chunks, cur = [], []
    for i, w in enumerate(words):
        if cur and (len(" ".join([words[k] for k in cur] + [w])) > 42 or re.search(r"[.?!]$", words[cur[-1]])): chunks.append(cur); cur = []
        cur.append(i)
    if cur: chunks.append(cur)
    merged = []
    for c in chunks:
        if merged and len(c) == 1 and len(' '.join(words[k] for k in merged[-1] + c)) <= 52 and not re.search(r'[.?!]$', words[merged[-1][-1]]): merged[-1] = merged[-1] + c
        else: merged.append(c)
    chunks = merged
    tag = WHO.get(lid.split("_")[0]); 
    for ci, c in enumerate(chunks):
        a = wt(c[0]); b = min(wt(c[-1], True) + 0.15, st + d + 0.3)
        if ci + 1 < len(chunks): b = min(b, wt(chunks[ci + 1][0]) - 0.02)
        text = " ".join(words[k] for k in c)
        if tag and ci == 0: text = f"[{tag}] {text}"
        out.append(f"{n}\n{ts(a)} --> {ts(max(b, a + 0.6))}\n{text}\n"); n += 1
open("ep7-captions.srt", "w").write("\n".join(out)); print(n - 1, "captions")
