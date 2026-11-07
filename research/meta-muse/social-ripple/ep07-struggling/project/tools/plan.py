import subprocess, json
SEQ = [("S01", [("n01", .3), ("n02", .5)]), ("S02", [("n03", .35), ("n04", .4), ("n05", .6), ("str_01", .25), ("n06", .5)]),
       ("S03", [("n07", .3), ("bea_01", .2), ("n08", .4), ("finn_01", .2), ("n09", .4), ("kai_02", .2), ("n10", .5), ("n11", .6), ("n12", .7)]),
       ("S04", [("n13", .3), ("n14", .5), ("n15", .9)]), ("S05", [("n16", .6), ("n17", .7), ("n18", 2.2)]),
       ("S06", [("n19", .25), ("ana_01", .45), ("n20", .35), ("ana_02", .7), ("n21", .4), ("ana_03", .55), ("theo_01", .2), ("mo_01", .2), ("kai_01", .6), ("n22", .4), ("n23", .8)]),
       ("S07", [("n24", .3), ("ana_04", .8), ("n25", .5), ("n26", .6), ("n27", 1.5)]), ("S08", [("n28", .8), ("n29", 8.0)])]
t = 0.4; T = {}; SC = {}
dur = lambda i: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"assets/vo/{i}.wav"], capture_output=True, text=True).stdout)
for sc, lines in SEQ:
    SC[sc] = round(t - (0.2 if sc != "S01" else 0.4), 3)
    for i, g in lines: d = dur(i); T[i] = [round(t, 3), round(d, 3)]; t += d + g
D = round(t, 2); open("assets/t.js", "w").write(f"window.DT = {json.dumps(T)}; window.SC = {json.dumps(SC)}; window.DUR = {D};\n"); print(SC, D)
