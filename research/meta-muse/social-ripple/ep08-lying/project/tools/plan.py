"""Ep7 remake timeline: (id, gap BEFORE the line). Scene starts are recorded. Gaps hold the visual beats from SCENE-CARDS.md."""
import subprocess, json
SEQ = [
 ("SC01", [("mo_c", 0.35), ("n01", 1.6), ("n02", 0.3), ("n03", 1.3), ("pip_a", 0.4), ("n04", 0.7), ("n05", 0.4)]),
 ("SC02", [("n06", 2.6), ("n07", 0.4), ("n08", 0.4)]),
 ("SC03", [("n09", 1.4), ("n10", 1.0), ("n11", 1.4)]),
 ("SC04", [("pip_b", 1.6), ("pip_c", 1.8), ("pip_d", 2.0), ("n12", 1.2), ("n13", 0.4)]),
 ("SC05", [("ana_f", 1.6), ("theo_c", 2.2), ("n14", 1.4), ("n15", 0.6)]),
 ("SC06", [("pip_e", 3.4), ("sur_all", 2.4), ("n16", 1.6), ("n17", 0.4), ("pip_f", 1.0), ("n18", 0.8)]),
 ("SC07", [("n19", 3.2), ("n20", 0.5), ("n21", 1.4), ("n22", 0.5)]),
 ("SC08", [("n23", 2.0)]),
 ("SC09", [("mo_d", 1.6), ("n24", 1.8)]),
]
END_HOLD = 4.0
TAIL = {"SC01": 0.8, "SC04": 0.6, "SC05": 1.6, "SC06": 1.4, "SC07": 2.6}   # post-line visual beats (Ana gone / list hover / sandwich) before the next scene
import os
TXT = {l.split("\t")[0]: l.rstrip("\n").split("\t")[-1] for l in open("tools/char_lines.tsv") if l.strip()}; TXT["sur_all"] = "Surprise!"
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
