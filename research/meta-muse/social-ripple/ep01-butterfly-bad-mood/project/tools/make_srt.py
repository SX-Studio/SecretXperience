"""Build ep1-captions.srt from the script and the per-line word clock. Scene starts must match build_index.py."""
import json, re
S = dict(s1=0.0, s2=13.8, s3=18.4, s4=31.9, s5=63.1, s6=82.5, s7=99.5, s8=119.5, s9=140.7, s10=156.2)
lines = [("L01","s1",1.2),("L02","s1",7.2),("L03","s2",0.8),("L04","s3",0.4),("L05","s3",8.0),("L06","s4",0.5),("L07","s4",10.4),("L08","s4",14.4),("L09","s4",26.6),("L10","s5",0.4),("L11","s5",8.2),("L12","s5",12.6),("L13","s6",0.4),("L14","s6",9.0),("L15","s6",13.6),("L16","s7",0.6),("L17","s7",5.0),("L18","s7",7.0),("L19","s7",11.2),("L20","s7",16.0),("L21","s8",0.6),("L22","s8",16.2),("L21b","s9",1.0),("L23","s9",9.6),("L24","s10",0.4),("L25","s10",7.4)]
script = dict(l.rstrip("\n").split("\t") for l in open("vo_lines.tsv"))
script["L21b"] = "It's how one video by MrBeast and Mark Rober got millions of strangers to pay for twenty million trees."
W = json.load(open("assets/vo/words.json"))
def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
cues = []
for lid, sc, t0 in lines:
    words = W[lid]; text = script[lid].replace("...", "…").split(); n = len(words)
    phrases, cur = [], []
    for w in text:
        cur.append(w)
        if re.search(r"[.,?!:…]$", w): phrases.append(cur); cur = []
    if cur: phrases.append(cur)
    packed = []
    for p in phrases:
        if packed and len(packed[-1]) + len(p) <= 9: packed[-1] = packed[-1] + p
        else: packed.append(p)
    pos = 0
    for c in packed:
        a = int(round(pos / len(text) * n)); pos += len(c); b = max(a, int(round(pos / len(text) * n)) - 1)
        cues.append([S[sc] + t0 + words[min(a, n - 1)]["start"], S[sc] + t0 + words[min(b, n - 1)]["end"] + 0.25, " ".join(c)])
cues.append([S["s5"] + 6.3, S["s5"] + 7.2, "[Leo] NEXT!"])
cues.sort()
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1], cues[i + 1][0] - 0.03)
with open("ep1-captions.srt", "w") as f:
    for i, (a, b, t) in enumerate(cues, 1): f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{t}\n\n")
print(len(cues), "cues")
