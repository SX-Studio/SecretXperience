"""Write index.html from the scene list (id, duration). Usage: python3 build_index.py s1 s2 ... (default: all)"""
import sys, json
SCENES = [("s1", 13.8), ("s2", 4.6), ("s3", 13.5), ("s4", 31.2), ("s5", 19.4), ("s6", 17.0), ("s7", 20.0), ("s8", 21.2), ("s9", 15.5), ("s10", 17.0)]
pick = sys.argv[1:] or [s for s, _ in SCENES]
t = 0.0; hosts = []
for sid, d in SCENES:
    if sid in pick:
        hosts.append(f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{t:.2f}" data-duration="{d}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>')
        t += d
total = round(t, 2)
audio = '      <audio id="mix" class="clip" src="assets/mix.wav" data-start="0" data-duration="%s" data-track-index="2" data-volume="1"></audio>' % total if "--audio" in sys.argv or pick == [s for s, _ in SCENES] else ""
html = f'''<!doctype html>
<html lang="en" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="assets/sr-engine.js"></script>
    <script src="assets/ep1-sets.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #FBF4EA; }}
      #root {{ width: 100%; height: 100%; position: relative; }}
      #fontwarm {{ position: absolute; left: -9999px; top: 0; font-family: "Outfit"; font-weight: 900; }}
      #fontwarm b {{ font-family: "Nunito"; font-weight: 900; }}
      #fontwarm i {{ font-family: "Space Mono"; font-weight: 700; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1920" data-height="1080">
      <div id="fontwarm" data-layout-ignore>Aa <b>Aa</b> <i>7:42</i></div>
{chr(10).join(hosts)}
{audio}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''
open("index.html", "w").write(html)
print("index:", pick, "total", total)
