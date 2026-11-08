"""Captions SRT from the scripted text + Parakeet word clock (phrase-split, <= 9 words per cue)."""
import os, json, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
plan = json.load(open(os.path.join(HERE, "plan.json")))
tj = open(os.path.join(ROOT, "assets/timing.js")).read(); TIMW = json.loads(re.search(r"window.TIMW = (.*?);\n", tj).group(1))
TXT = {l.split("\t")[0]: l.split("\t")[3].strip() for l in open(os.path.join(ROOT, "vo_lines.tsv")) if l.strip()}
FIX = {"N P C": "NPC", "M I T": "MIT", "nine P M": "9 PM", "Nine oh four P M": "9:04 PM", "wifi": "Wi-Fi", "fifty six": "56", "thirty percent": "30%", "a hundred and twenty six thousand": "126,000",
       "twenty two": "22", "thirteen year old": "13-year-old", "Level one": "Level 1", "Level two": "Level 2", "Level three": "Level 3", "Level four": "Level 4", "Level five": "Level 5", "Level six": "Level 6",
       "level six": "level 6", "level two": "level 2", "Level seven": "Level 7", "level seven": "level 7", "level one": "level 1", "level fives": "level 5s", "Level five, by lunch": "Level 5, by lunch", "pop QUIT": "pop QUIT"}
SPK = {"nia_hi": "NIA", "ms_you": "MS. OKAFOR", "theo_joke": "THEO", "priya_add": "PRIYA", "marcus_yo": "MARCUS", "dev_joke": "DEV", "nia_seat": "NIA", "jordan_free": "JORDAN", "marcus_scoot": "MARCUS"}
def fmt(t): h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}"
cues = []
for lid, at, L in plan["lines"]:
    text = TXT[lid].replace("...", "…")
    for a, b in FIX.items(): text = text.replace(a, b)
    toks = text.split(); ws = TIMW.get(lid) or []
    times = [at + ws[min(len(ws) - 1, int(i * len(ws) / len(toks)))][1] if ws else at + L * i / len(toks) for i in range(len(toks))]
    chunk, start = [], None
    for i, tk in enumerate(toks):
        if not chunk: start = times[i]
        chunk.append(tk)
        brk = (len(chunk) >= 9 and len(toks) - i - 1 > 2) or len(chunk) >= 11 or re.search(r"[.?!:]$", tk) or (tk.endswith("…") and len(chunk) >= 3) or (re.search(r",$", tk) and len(chunk) >= 5) or i == len(toks) - 1
        if brk:
            end = times[i + 1] - 0.05 if i + 1 < len(toks) else at + L + 0.3
            s = " ".join(chunk); s = (SPK[lid] + ": " + s) if lid in SPK and not cues or (lid in SPK and chunk is not None and start == times[0]) else s
            cues.append([start, max(end, start + 0.8), s]); chunk = []
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.02)
out = "\n".join(f"{i + 1}\n{fmt(a)} --> {fmt(b)}\n{s}\n" for i, (a, b, s) in enumerate(cues))
open(os.path.join(ROOT, "ep2-captions.srt"), "w").write(out); print(len(cues), "cues")
