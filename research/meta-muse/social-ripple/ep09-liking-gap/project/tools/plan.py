"""Ep7 remake timeline: (id, gap BEFORE the line). Scene starts are recorded. Gaps hold the visual beats from SCENE-CARDS.md."""
import subprocess, json
SEQ = [
 ("SC01", [("juno_c", 4.6), ("n01", 1.2), ("n02", 0.5)]),
 ("SC02", [("n03", 1.2), ("n04", 0.5), ("n05", 0.8), ("n06", 0.9)]),
 ("SC03", [("n07", 2.6), ("n08", 0.8), ("mo_e", 0.4), ("n09", 1.4), ("finn_d", 0.4), ("n10", 1.4), ("n28", 1.6), ("n11", 1.8)]),
 ("SC04", [("n12", 1.4), ("n13", 0.8)]),
 ("SC05", [("n14", 1.4), ("juno_d", 1.0), ("n15", 1.2), ("n16", 1.0), ("n17", 0.6), ("n26", 1.4)]),
 ("SC06", [("n18", 1.6), ("n19", 0.6), ("n20", 0.8)]),
 ("SC07", [("n29", 0.8), ("juno_e", 4.0), ("juno_f", 0.8), ("n21", 0.9)]),
 ("SC08", [("n22", 2.0)]),
 ("SC09", [("n30", 0.8), ("n23", 6.0)]),
]
END_HOLD = 4.5
TAIL = {"SC01": 0.6, "SC02": 2.2, "SC05": 2.0, "SC06": 1.6, "SC07": 1.0}   # post-line visual beats (Ana gone / list hover / sandwich) before the next scene
import os
TXT = {l.split("\t")[0]: l.rstrip("\n").split("\t")[-1] for l in open("tools/char_lines.tsv") if l.strip()}; pass
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
