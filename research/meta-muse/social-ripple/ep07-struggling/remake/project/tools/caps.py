"""Kinetic captions from word clocks: 1-3 word chunks, keywords yellow. Lines on the rule card are skipped (the card shows them)."""
import json, re
T = json.loads(re.search(r"window.DT = (\{.*?\});", open("assets/t.js").read()).group(1))
SKIP = {"n03", "n04", "n05"}
KEY = {"fine", "fine!", "weather", "storm", "storms", "biggest", "own", "really", "ask", "help", "yes", "alone", "underestimate", "hiding", "nobody", "hard", "saturday", "twenty", "gently", "bad", "negative", "strangers", "less", "yours", "can't", "everyone", "everyone's", "bother", "myself", "one", "more", "expect", "expect.", "rough"}
caps = []
for i, (t0, d) in sorted(T.items(), key=lambda kv: kv[1][0]):
    base = i.split("#")[0]
    if base in SKIP: continue
    if not __import__("os").path.exists(f".words/{base}.json"): print("NO WORDS", base); continue
    W = json.load(open(f".words/{base}.json"))["words"]
    FIX = {"Uops,": "Oops!"}; W = [dict(w, text=FIX.get(w["text"], w["text"])) for w in W]
    who = "n" if base.startswith("n") else "c"
    chunk = []
    def flush():
        if chunk: caps.append({"t": round(t0 + chunk[0]["start"], 3), "e": round(t0 + chunk[-1]["end"], 3), "w": [[w["text"], re.sub(r"[^a-z'!]", "", w["text"].lower()).rstrip("!") in {k.rstrip("!.") for k in KEY}] for w in chunk], "who": who}); chunk.clear()
    for k, w in enumerate(W):
        if chunk and (w["start"] - chunk[-1]["end"] > 0.25): flush()
        chunk.append(w)
        if len(chunk) == 3 or re.search(r"[.,!?—]$", w["text"]): flush()
    flush()
# close each chunk at the next one's start (no overlap), hold short ones >= 0.35 s
for a, b in zip(caps, caps[1:]): a["e"] = round(min(max(a["e"], a["t"] + 0.35), b["t"] - 0.02), 3)
open("assets/captions.js", "w").write("window.CAPS = " + json.dumps(caps) + ";\n"); print(len(caps), "chunks")
