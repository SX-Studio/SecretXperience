"""Ep6 timing: global clock. Numbers are pads (s), strings are voice line ids.
Writes assets/t.js with window.T (line starts/ends, scene starts, D) and window.WORDS ([text, start, end, line], absolute)."""
import json, os, re, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SCENES = [
 ("s01", [0.9, "n01", 0.4, "n02", 0.9]),                                                     # cold open: night, threads burst out of Mo
 ("s02", [0.4, "n03", 0.4, "n04", 0.5, "n05", 0.4, "n06", 0.9]),                              # who Mo is + the rules card
 ("s03", [0.4, "n07", 0.3, "n08", 0.3, "mo_01", 0.5, "n09", 0.5, "n10", 0.4, "n11", 0.7]),     # brightest thread -> Theo (kindness study)
 ("s04", [0.3, "n12", 0.3, "n13", 0.4, "n14", 0.6, "n15", 0.7]),                              # the thread keeps going (cascade study)
 ("s05", [0.4, "n16", 0.4, "n17", 0.3, "mo_02", 0.5, "n18", 0.6, "n19", 1.9, "n20", 0.4, "mo_03", 0.4, "n21", 1.0]),  # midpoint: Kai, the pull
 ("s06", [0.4, "n22", 0.3, "n23", 0.5, "n24", 0.9]),                                          # mental subtraction study
 ("s07", [0.5, "n25", 0.7, "theo_01", 0.6, "n26", 0.6, "n27", 1.2, "n28", 0.8]),               # dawn: Theo's note + takeaway
 ("s08", [0.5, "n29", 6.0]),                                                                  # close + breathing end
]
TXT = {l.split("\t")[0]: l.split("\t")[3].strip() for l in open(os.path.join(ROOT, "vo_lines.tsv")) if l.strip()}
def dur(i): return sf.info(os.path.join(ROOT, "assets/vo", i + ".wav")).duration
T, lines, g = {}, [], 0.0
for sid, seq in SCENES:
    T[sid] = round(g, 3)
    for x in seq:
        if isinstance(x, str): L = dur(x); T[x] = round(g, 3); T[x + "_e"] = round(g + L, 3); lines.append((x, round(g, 3), round(L, 3))); g += L
        else: g += x
T["D"] = round(g, 2)
# words: transcript timings, but the TEXT comes from the script (aligned by order; falls back to transcript tokens)
WORDS = []
for lid, st, L in lines:
    f = os.path.join(ROOT, ".words", lid + ".json")
    try: tw = json.loads(open(f).read())["words"]
    except Exception: tw = []
    sw = TXT[lid].split()
    import difflib
    nz = lambda x: re.sub(r"[^a-z0-9]", "", x.lower())
    tn = [nz(w["text"]) for w in tw]; sn = [nz(w) for w in sw]
    tim = [None] * len(sw)
    for a, b, n in difflib.SequenceMatcher(None, sn, tn, autojunk=False).get_matching_blocks():
        for k in range(n): tim[a + k] = (tw[b + k]["start"], tw[b + k]["end"])
    # unmatched script words: spread across the gap between matched neighbours
    i = 0
    while i < len(sw):
        if tim[i] is None:
            j = i
            while j < len(sw) and tim[j] is None: j += 1
            t0 = tim[i - 1][1] if i > 0 else (tw[0]["start"] if tw else 0.0)
            t1 = tim[j][0] if j < len(sw) else (tw[-1]["end"] if tw else L)
            step = max(0.05, (t1 - t0) / (j - i))
            for k in range(i, j): tim[k] = (t0 + (k - i) * step, t0 + (k - i + 1) * step)
            i = j
        else: i += 1
    toks = [(sw[k], tim[k][0], tim[k][1]) for k in range(len(sw))]
    WORDS += [[a, round(st + b, 3), round(st + c, 3), lid] for a, b, c in toks]
open(os.path.join(ROOT, "assets/t.js"), "w").write("window.T=" + json.dumps(T) + ";\nwindow.WORDS=" + json.dumps(WORDS) + ";\n")
json.dump({"lines": lines, "total": T["D"]}, open(os.path.join(HERE, "plan.json"), "w"), indent=1)
print("total", T["D"], "=", int(T["D"] // 60), "min", round(T["D"] % 60, 1), "s"); print({s: T[s] for s, _ in SCENES})
