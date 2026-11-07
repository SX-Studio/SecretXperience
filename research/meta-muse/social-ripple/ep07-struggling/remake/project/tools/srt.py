"""Upload captions (.srt) from the word clocks: one cue per sentence (split if > 84 chars), speaker lines included."""
import json, re
T = json.loads(re.search(r"window.DT = (\{.*?\});", open("assets/t.js").read()).group(1))
FIX = {"Uops,": "Oops!"}; cues = []
for lid, (t0, d) in sorted(T.items(), key=lambda kv: kv[1][0]):
    W = json.load(open(f".words/{lid.split('#')[0]}.json"))["words"]; W = [dict(w, text=FIX.get(w["text"], w["text"])) for w in W]; cur = []
    for w in W:
        cur.append(w)
        if re.search(r"[.!?]$", w["text"]) or len(" ".join(x["text"] for x in cur)) > 84: cues.append([t0 + cur[0]["start"], t0 + cur[-1]["end"], " ".join(x["text"] for x in cur)]); cur = []
    if cur: cues.append([t0 + cur[0]["start"], t0 + cur[-1]["end"], " ".join(x["text"] for x in cur)])
for a, b in zip(cues, cues[1:]): a[1] = min(max(a[1] + 0.3, a[0] + 1.0), b[0] - 0.05)
f = lambda s: f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(round((s % 1) * 1000)) % 1000:03d}"
open("ep7b-captions.srt", "w").write("\n".join(f"{i + 1}\n{f(a)} --> {f(b)}\n{t}\n" for i, (a, b, t) in enumerate(cues))); print(len(cues), "cues")
