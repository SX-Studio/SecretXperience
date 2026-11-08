"""Word clock with SCRIPT spelling: ASR gives the timing, the script gives the words (ASR misspells numbers and names,
e.g. "twenty" -> "2", "a van" -> "of ham"). Tokens are swapped 1:1 when the counts match; otherwise the ASR words stay."""
import json, os
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = {}
for f, col in (("vo_lines.tsv", 3), ("tools/char_lines.tsv", 3)):
    for line in open(os.path.join(HERE, f)):
        p = line.rstrip("\n").split("\t")
        if len(p) > col: SCRIPT[p[0]] = p[col]
def words(lid):
    W = json.load(open(os.path.join(HERE, ".words", lid + ".json")))["words"]; s = SCRIPT.get(lid, "").split()
    if s and len(s) == len(W): return [dict(w, text=t) for w, t in zip(W, s)], True
    return W, False
if __name__ == "__main__":
    for lid in sorted(SCRIPT):
        if os.path.exists(os.path.join(HERE, ".words", lid + ".json")):
            W, ok = words(lid); print(("OK  " if ok else "ASR ") + lid, " ".join(w["text"] for w in W)[:110])
