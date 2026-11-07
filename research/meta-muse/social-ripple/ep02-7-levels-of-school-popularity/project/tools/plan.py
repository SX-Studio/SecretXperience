"""Scene plan: numbers are pads (s), strings are voice line ids. Writes assets/timing.js and tools/plan.json."""
import json, os, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SCENES = [
 ("s01", [0.8, "n01", 0.5, "n02", 0.5, "nia_hi", 0.7, "n03", 0.6]),
 ("s02", [3.4]),
 ("s03", [0.4, "n04", 0.3, "n05", 0.15, "ms_you", 0.5, "n06", 0.6]),
 ("s04", [0.3, "n07", 0.7]),
 ("s05", [0.3, "n08", 0.3, "theo_joke", 1.9, "n09", 0.6]),
 ("s06", [0.3, "n10", 0.2, "priya_add", 0.4, "n11", 0.6]),
 ("s07", [0.3, "n12", 0.2, "marcus_yo", 0.7]),
 ("s08", [0.5, "n13", 0.4, "n14", 0.6]),
 ("s09", [0.3, "n15", 0.8]),
 ("s10", [0.4, "n16", 0.4, "n17", 0.5, "n18", 0.8]),
 ("s11", [0.7, "n19", 0.6, "n20", 0.5, "n21", 0.8]),
 ("s12", [0.4, "n22", 2.2, "n23", 0.3, "dev_joke", 1.1, "n24", 0.6, "n25", 1.4]),
 ("s13", [1.6, "n26", 1.0, "nia_seat", 0.9, "jordan_free", 1.1, "n27", 0.5, "marcus_scoot", 0.7, "n28", 1.4]),
 ("s14", [0.5, "n29", 0.4, "n30", 0.5, "n31", 0.8]),
 ("s15", [0.5, "n32", 0.9, "n33", 0.5, "n34", 0.5, "n35", 1.0]),
 ("s16", [0.7, "n36", 0.7, "n37", 0.7, "n38", 6.5]),
]
def dur(i): return sf.info(os.path.join(ROOT, "assets/vo", i + ".wav")).duration
out, lines, g = {}, [], 0.0
for sid, seq in SCENES:
    t, d = 0.0, {}
    for x in seq:
        if isinstance(x, str): L = dur(x); d[x] = round(t, 3); d[x + "_e"] = round(t + L, 3); lines.append((x, round(g + t, 3), L)); t += L
        else: t += x
    d["D"] = round(t, 2); d["start"] = round(g, 3); out[sid] = d; g += round(t, 2)
W = {}
for f in os.listdir(os.path.join(ROOT, ".words")):
    try: W[f[:-5]] = [[w["text"], w["start"]] for w in json.loads(open(os.path.join(ROOT, ".words", f)).read())["words"]]
    except Exception: pass
open(os.path.join(ROOT, "assets/timing.js"), "w").write("window.TIM = " + json.dumps(out) + ";\nwindow.TIMW = " + json.dumps(W) + ";\n")
json.dump({"scenes": [(s, out[s]["start"], out[s]["D"]) for s, _ in SCENES], "lines": lines, "total": round(g, 2)}, open(os.path.join(HERE, "plan.json"), "w"), indent=1)
print("total", round(g, 2)); [print(s, out[s]["start"], out[s]["D"]) for s, _ in SCENES]
