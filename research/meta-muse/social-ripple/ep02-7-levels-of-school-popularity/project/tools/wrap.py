"""Wrap compositions/src/sXX.js into compositions/sXX.html (template + svg + EP.scene call)."""
import sys, os, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for f in sorted(glob.glob(os.path.join(ROOT, "compositions/src/*.js"))):
    sid = os.path.basename(f)[:-3]; body = open(f).read()
    html = f'''<template>
  <style>
    #root {{ position: absolute; inset: 0; overflow: hidden; }}
    #{sid}-svg {{ position: absolute; inset: 0; width: 1920px; height: 1080px; }}
    #{sid}-svg text {{ font-family: "Nunito"; }}
  </style>
  <div id="root" data-composition-id="{sid}" data-width="1920" data-height="1080">
    <svg id="{sid}-svg" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" data-layout-ignore></svg>
  </div>
  <script>
    (function () {{
      const SR = window.SR, EP = window.EP; const {{ el, Set, Scene2, Character, Crowd, Camera, Bubble, Badge, FX, Life, Ripple, Butterfly, PAL, clamp, EASE, sampleTrack, mulberry32 }} = SR;
      EP.scene("{sid}", (svg, T) => {{
{body}
      }});
    }})();
  </script>
</template>
'''
    open(os.path.join(ROOT, f"compositions/{sid}.html"), "w").write(html)
print("wrapped")
