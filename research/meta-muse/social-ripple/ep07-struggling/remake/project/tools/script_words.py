"""Word clock with SCRIPT spelling: ASR gives the timing, the script gives the words (ASR misspells numbers and names,
e.g. "twenty" -> "2", "a van" -> "of ham"). Tokens are swapped 1:1 when the counts match; otherwise the ASR words stay."""
import json, os
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = {"ana_03": "Would anyone be able to help on Saturday?", "theo_01": "Of course.", "mo_01": "I'll bring sandwiches.", "kai_01": "I've got a van.",
          "n06": "He was not doing great.", "n22": "In one experiment, people guessed they'd have to ask about twenty strangers to get five to do a small favor. They needed about ten.",
          "n26": "A cloud. Not the biggest. Not the smallest. Just weather, like everyone's.", "n29": "Everyone's carrying some weather. You don't have to carry yours alone.",
          "str_01": "Morning! Doing great!", "bea_01": "Morning! Fresh rolls, still warm!", "ana_04": "What about you? How are you, really?"}
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
