"""Replace every @font-face in frame files with the full local set (all weights/italics)."""
import re, glob
FACES = [("Cormorant Garamond", "cormorant-garamond", [(500, "normal"), (600, "normal"), (700, "normal"), (500, "italic"), (600, "italic")]),
         ("Source Sans 3", "source-sans-3", [(400, "normal"), (600, "normal"), (700, "normal")]),
         ("Caveat", "caveat", [(500, "normal"), (700, "normal")]),
         ("Courier Prime", "courier-prime", [(400, "normal"), (700, "normal")])]
css = "\n".join(f'@font-face{{font-family:"{fam}";src:url("assets/fonts/{slug}-{w}{"-italic" if s == "italic" else ""}.woff2") format("woff2");font-weight:{w};font-style:{s};font-display:block;}}'
                for fam, slug, vs in FACES for w, s in vs)
css += "\n#root, #root * { font-variant-numeric: lining-nums; }\n"
for f in sorted(glob.glob("compositions/frames/*.html")):
    t = open(f).read()
    n = len(re.findall(r"@font-face\s*\{[^}]*\}", t))
    t = re.sub(r"@import[^;]*;\s*", "", t)
    t = re.sub(r"@font-face\s*\{[^}]*\}\s*", "", t)
    t = re.sub(r"(<style[^>]*>)", lambda m: m.group(1) + "\n" + css, t, count=1)
    open(f, "w").write(t); print(f, "faces replaced:", n)
