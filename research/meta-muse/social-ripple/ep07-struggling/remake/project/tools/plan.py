"""Ep7 remake timeline: (id, gap BEFORE the line). Scene starts are recorded. Gaps hold the visual beats from SCENE-CARDS.md."""
import subprocess, json
SEQ = [
 ("SC01", [("mo_a", 0.25), ("mo_b", 0.55), ("n01", 1.6), ("n02", 0.45)]),
 ("SC02", [("n03", 0.9), ("str_01", 0.3), ("n06", 0.25), ("n04", 0.4), ("theo_a", 0.25), ("n05", 0.35), ("n07", 3.6)]),
 ("SC03", [("n08", 1.4), ("n09", 4.4), ("n10", 0.35), ("n11", 0.5)]),
 ("SC04", [("finn_a", 2.6), ("bea_01", 1.0), ("n12", 2.4), ("n13", 0.45)]),
 ("SC05", [("n14", 0.9), ("bea_b", 1.6), ("ana_a", 1.1)]),
 ("SC06", [("ana_b", 5.4), ("n16", 0.5)]),
 ("SC07", [("theo_b", 1.6), ("n17", 0.4)]),
 ("SC08", [("ana_c", 2.2), ("n18", 0.4), ("ana_d", 0.9), ("n19", 0.6), ("ana_e", 1.4)]),
 ("SC09", [("ana_03", 2.8), ("theo_01", 0.35), ("mo_01", 0.2), ("kai_01", 0.2), ("n22", 1.6), ("n20", 0.4)]),
 ("SC10", [("ana_04", 1.4)]),
 ("SC11", [("n26", 4.6), ("n23", 0.6), ("n24", 0.8)]),
 ("SC12", [("n25", 2.2)]),
 ("SC13", [("mo_a#2", 3.4), ("n28", 2.6), ("n29", 2.2)]),
]
END_HOLD = 5.0
TAIL = {"SC05": 1.3, "SC08": 1.7, "SC11": 2.2}   # post-line visual beats (Ana gone / list hover / sandwich) before the next scene
import os
TXT = {l.split("\t")[0]: l.rstrip("\n").split("\t")[-1] for l in open("tools/char_lines.tsv") if l.strip()}
def dur(i):
    i = i.split("#")[0]
    if not os.path.exists(f"assets/vo/{i}.wav"): print("ESTIMATE", i); return round(0.4 + len(TXT[i].split()) / 2.6, 2)
    return _dur(i)
_dur = lambda i: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"assets/vo/{i.split('#')[0]}.wav"], capture_output=True, text=True).stdout)
t = 0.0; T = {}; SC = {}
for sc, lines in SEQ:
    SC[sc] = round(t, 3)
    for i, g in lines: t += g; d = dur(i); T[i] = [round(t, 3), round(d, 3)]; t += d
    t += TAIL.get(sc, 0)
D = round(t + END_HOLD, 2); SC["END"] = D
open("assets/t.js", "w").write(f"window.DT = {json.dumps(T)}; window.SC = {json.dumps(SC)}; window.DUR = {D};\n")
for k, v in SC.items(): print(k, v)
print("DUR", D)
