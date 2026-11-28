#!/bin/bash
# usage: page.sh <short_dir> : copy engine + write vertical index.html with the duration from assets/t.js
D=$1; K=$(dirname $(dirname $(readlink -f $0))); cp $K/ink.js $K/short.js $K/lib.js $K/char.js $K/cast.js $K/nshort.js $D/assets/
DUR=$(grep -o 'window.DUR = [0-9.]*' $D/assets/t.js | grep -o '[0-9.]*$')
cat > $D/index.html <<HTML
<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Patrick+Hand&family=Anton&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<script src="assets/ink.js"></script><script src="assets/t.js"></script><script src="assets/short.js"></script><script src="assets/lib.js"></script><script src="assets/char.js"></script><script src="assets/cast.js"></script><script src="assets/nshort.js"></script>
<style>* { margin: 0; padding: 0; } html, body { width: 1080px; height: 1920px; overflow: hidden; background: #F5EEDC; } #root { width: 1080px; height: 1920px; position: relative; overflow: hidden; } #ov { position: absolute; inset: 0; width: 1080px; height: 1920px; } #fw { position: absolute; left: -9999px; }</style>
</head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="$DUR" data-width="1080" data-height="1920">
<div id="fw" data-layout-ignore><span style="font-family:Caveat;font-weight:700">Aa</span><span style="font-family:'Patrick Hand'">Aa</span><span style="font-family:Anton">Aa</span></div>
<svg id="ov" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" data-layout-ignore></svg>
<audio id="mix" class="clip" src="assets/mix.wav" data-start="0" data-duration="$DUR" data-track-index="2" data-volume="1"></audio>
</div>
<script>window.__timelines = window.__timelines || {};</script>
<script src="assets/scene.js"></script>
</body></html>
HTML
echo "page DUR=$DUR"
