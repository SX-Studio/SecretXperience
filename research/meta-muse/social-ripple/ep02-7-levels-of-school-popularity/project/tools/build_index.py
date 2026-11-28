"""Write index.html from tools/plan.json. Usage: python3 build_index.py [s01 s05 ...] [--audio]  (subset = scenes laid back to back from 0)"""
import sys, json, os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
plan = json.load(open(os.path.join(HERE, "plan.json"))); SC = [(s, d) for s, _, d in plan["scenes"]]
args = [a for a in sys.argv[1:] if not a.startswith("--")]; pick = args or [s for s, _ in SC]
t = 0.0; hosts = []
for sid, d in SC:
    if sid in pick:
        hosts.append(f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{t:.2f}" data-duration="{d}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>')
        t += d
total = round(t, 2)
full = pick == [s for s, _ in SC]
audio = f'      <audio id="mix" class="clip" src="assets/mix.wav" data-start="0" data-duration="{total}" data-track-index="2" data-volume="1"></audio>' if ("--audio" in sys.argv or full) and os.path.exists(os.path.join(ROOT, "assets/mix.wav")) else ""
html = f'''<!doctype html>
<html lang="en" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="assets/sr-engine-v1.js"></script>
    <script src="assets/sr-v2.js"></script>
    <script src="assets/lips.js"></script>
    <script src="assets/timing.js"></script>
    <script src="assets/ep2-sets.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #FBF4EA; }}
      #root {{ width: 100%; height: 100%; position: relative; }}
      #fontwarm {{ position: absolute; left: -9999px; top: 0; font-family: "Outfit"; font-weight: 900; }}
      #fontwarm b {{ font-family: "Nunito"; font-weight: 900; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1920" data-height="1080">
      <div id="fontwarm" data-layout-ignore>Aa <b>Aa 🔒📄</b></div>
{chr(10).join(hosts)}
{audio}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''
open(os.path.join(ROOT, "index.html"), "w").write(html); print("index", total, pick if not full else "ALL")
