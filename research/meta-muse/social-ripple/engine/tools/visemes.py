"""Viseme lip-sync track: espeak phonemes + ASR word times + audio energy -> window.SR_LIPS[id] = {fps, env, vis:[[t, code], ...]}.
Usage: python visemes.py <project> <id>=<wav>:<words.json> [...]   (writes <project>/assets/lips.js, keeping other ids)
Codes: X rest, P (m b p press), A (ah, wide open), E (ee/eh, wide teeth), O (oh), U (oo/w pucker), F (f v), L (l, tongue up), T (th), C (consonants, teeth), R (r)."""
import sys, os, json, re
import numpy as np, soundfile as sf
import espeakng_loader as E
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library(E.get_library_path()); EspeakWrapper.set_data_path(E.get_data_path())
from phonemizer.backend import EspeakBackend
from phonemizer.separator import Separator
BE = EspeakBackend("en-us", with_stress=False); SEP = Separator(phone=" ", word="|", syllable="")
VOW = {"a": "A", "aɪ": "A", "aʊ": "A", "æ": "A", "ɑ": "A", "ɑː": "A", "ʌ": "A", "ɐ": "A", "ɑːɹ": "A", "aɪə": "A",
       "e": "E", "eɪ": "E", "ɛ": "E", "i": "E", "iː": "E", "ɪ": "E", "iə": "E", "ə": "E", "ɚ": "R", "ɜː": "R", "ɜ": "R", "ᵻ": "E", "ɛɹ": "E", "ɪɹ": "E",
       "oʊ": "O", "ɔ": "O", "ɔː": "O", "ɔɪ": "O", "ɔːɹ": "O", "oːɹ": "O", "uː": "U", "u": "U", "ʊ": "U", "ʊɹ": "U", "əl": "L"}
CON = {"p": "P", "b": "P", "m": "P", "f": "F", "v": "F", "θ": "T", "ð": "T", "l": "L", "w": "U", "ɹ": "R", "r": "R"}
STOP = set("ptkbdɡg")
def visemes_for(word):
    ph = BE.phonemize([word], separator=SEP, strip=True)[0].replace("|", " ").split()
    out = []
    for p in ph:
        code = VOW.get(p) or CON.get(p) or ("C" if p else "C"); w = 1.7 if p in VOW else (0.6 if p in STOP else 1.0)
        out.append((code, w))
    return out or [("C", 1.0)]
def build(wav, words_json, fps=30):
    a, sr = sf.read(wav); a = a.mean(1) if a.ndim > 1 else a
    hop = sr // fps; n = len(a) // hop; r = np.array([np.sqrt((a[i * hop:(i + 1) * hop] ** 2).mean()) for i in range(n)])
    r = r / (np.percentile(r, 95) + 1e-9); env = np.clip((r - 0.08) / 0.92, 0, 1); env = np.convolve(env, [0.25, 0.5, 0.25], "same")
    d = json.load(open(words_json)); W = d if isinstance(d, list) else d.get("words", [])
    vis = [[0.0, "X"]]
    for w in W:
        txt = re.sub(r"[^A-Za-z']", "", w.get("text", w.get("word", ""))); t0, t1 = float(w["start"]), float(w["end"])
        if not txt: continue
        # trim the word to where the audio actually has energy (ASR ends are padded)
        i0, i1 = int(t0 * fps), max(int(t0 * fps) + 1, int(t1 * fps)); seg = env[i0:i1]
        if len(seg) and seg.max() > 0.1:
            on = np.where(seg > 0.08)[0]; t0b = (i0 + on[0]) / fps; t1b = (i0 + on[-1] + 1) / fps
            if t1b - t0b > 0.06: t0, t1 = max(t0, t0b - 0.02), min(t1, t1b + 0.02)
        V = visemes_for(txt); tot = sum(x[1] for x in V); t = t0
        if vis and vis[-1][0] < t0 - 0.12: vis.append([round(t0 - 0.1, 3), "X"])  # close between phrases
        for code, wgt in V:
            vis.append([round(t, 3), code]); t += (t1 - t0) * wgt / tot
        vis.append([round(t1, 3), "X"])
    # drop X keys that are immediately overwritten (word joins)
    clean = []
    for k in vis:
        if clean and k[0] - clean[-1][0] < 0.02: clean[-1] = k
        else: clean.append(k)
    return {"fps": fps, "env": [round(float(x), 2) for x in env], "vis": clean}
if __name__ == "__main__":
    proj = sys.argv[1]; path = os.path.join(proj, "assets/lips.js"); cur = {}
    if os.path.exists(path):
        try: cur = json.loads(open(path).read().split("=", 1)[1].strip().rstrip(";"))
        except Exception: cur = {}
    for spec in sys.argv[2:]:
        cid, rest = spec.split("=", 1); wav, wj = rest.split(":"); cur[cid] = build(wav, wj); print(cid, len(cur[cid]["vis"]), "visemes:", " ".join(v[1] for v in cur[cid]["vis"][:30]))
    open(path, "w").write("window.SR_LIPS = " + json.dumps(cur, separators=(",", ":")) + ";\n")
