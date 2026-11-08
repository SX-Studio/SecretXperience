"""Ep4 timing: global clock. Numbers are pads (s), strings are voice line ids.
Writes assets/t.js with window.T (line starts/ends, scene starts, D) and window.WORDS ([text, start, end, line], absolute)."""
import json, os, re, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SCENES = [
 ("s01", [0.5, "n01", 0.35, "ana_01", 0.5, "n02", 0.3, "n03", 0.3]),          # hook: Theo, Ana, the promise, the calendar
 ("s02", [2.4]),                                                                # title card
 ("s03", [0.3, "n04", 0.5]),                                                    # Nia on screen: stakes + validation
 ("s04", [0.2, "n06", 0.3, "ana_02", 0.6, "n07", 0.4, "n08", 0.3, "n09", 0.5]),  # day 1 + the guarded brain
 ("s05", [0.2, "n10", 0.5, "n11", 0.2, "mo_01", 0.2, "n12", 0.6]),              # days 2-3, Mo gag
 ("s06", [0.3, "n13", 0.3, "n14", 0.4, "n15", 0.3, "mo_02", 0.15, "ana_03", 0.4, "n16", 0.5, "theo_01", 0.8, "n17", 0.6]),  # strangers research, day 7 "hey"
 ("s07", [0.2, "n18", 0.3, "ana_04", 0.4, "n19", 0.6]),                         # doubt
 ("s08", [0.4, "n20", 0.3, "theo_02", 0.6, "n21", 0.3, "n22", 0.8]),            # midpoint twist
 ("s09", [0.6, "n23", 0.4, "ana_05", 0.4, "n24", 0.4, "n25", 0.3, "mo_03", 2.6, "theo_03", 0.3, "ana_06", 0.8]),  # rain, soup
 ("s10", [0.3, "n26", 0.4, "n27", 0.5, "n29", 0.4, "n30", 0.8]),                # montage, hours, takeaways
 ("s11", [0.6, "n31", 0.5, "n32", 0.5, "theo_04", 1.0, "n33", 1.2, "n34", 6.0]),  # day 30 payoff + breathing end
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
