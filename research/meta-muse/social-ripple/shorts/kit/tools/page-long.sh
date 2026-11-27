#!/bin/bash
# usage: page.sh <short_dir> : copy engine + write vertical index.html with the duration from assets/t.js
D=$1; K=$(dirname $(dirname $(readlink -f $0))); cp $K/ink.js $K/long.js $K/lib.js $K/char.js $D/assets/
DUR=$(grep -o 'window.DUR = [0-9.]*' $D/assets/t.js | grep -o '[0-9.]*$')
cat > $D/index.html <<HTML
<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Patrick+Hand&family=Anton&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<script src="assets/ink.js"></script><script src="assets/t.js"></script><script src="assets/long.js"></script><script src="assets/lib.js"></script><script src="assets/char.js"></script>
<style>* { margin: 0; padding: 0; } html, body { width: 1920px; height: 1080px; overflow: hidden; background: #F5EEDC; } #root { width: 1920px; height: 1080px; position: relative; overflow: hidden; } #ov { position: absolute; inset: 0; width: 1920px; height: 1080px; } #fw { position: absolute; left: -9999px; }</style>
</head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="$DUR" data-width="1920" data-height="1080">
<div id="fw" data-layout-ignore><span style="font-family:Caveat;font-weight:700">Aa</span><span style="font-family:'Patrick Hand'">Aa</span><span style="font-family:Anton">Aa</span></div>
<svg id="ov" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" data-layout-ignore></svg>
<audio id="mix" class="clip" src="assets/mix.wav" data-start="0" data-duration="$DUR" data-track-index="2" data-volume="1"></audio>
</div>
<script>window.__timelines = window.__timelines || {};</script>
<script src="assets/scene.js"></script>
</body></html>
HTML
echo "page DUR=$DUR"
