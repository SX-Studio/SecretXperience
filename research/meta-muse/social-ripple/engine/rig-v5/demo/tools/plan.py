import subprocess, json, sys
SEQ = [("n19", .25), ("ana_01", .45), ("n20", .35), ("ana_02", .7), ("n21", .4), ("ana_03", .55), ("theo_01", .2), ("mo_01", .2), ("kai_01", .7), ("ana_04", 2.0)]
t = 0.5; T = {}
for i, g in SEQ:
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"assets/vo/{i}.wav"], capture_output=True, text=True).stdout)
    T[i] = [round(t, 3), round(d, 3)]; t += d + g
open("assets/t.js", "w").write("window.DT = " + json.dumps(T) + "; window.DUR = " + str(round(t, 2)) + ";\n"); print(T, round(t, 2))
