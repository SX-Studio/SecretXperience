#!/bin/bash
# film80.sh IN OUT — "1980s 35mm fantasy film, 4:3 telecine" chain, all local ffmpeg (no LUT files)
IN=$1; OUT=$2
ffmpeg -hide_banner -loglevel error -y -i "$IN" -filter_complex "
[0:v]fps=24,scale=1440:1080:force_original_aspect_ratio=increase,crop=1440:1080,setsar=1,
  eq=contrast=0.92:saturation=0.82:gamma=1.04,
  colorbalance=rs=0.06:gs=0.0:bs=-0.07:rm=0.04:bm=-0.05:rh=0.08:gh=0.03:bh=-0.12,
  curves=master='0/0.045 0.5/0.52 1/0.965',
  split[base][hl];
[hl]lutyuv=y='if(gt(val,205),val,0)',gblur=sigma=18,colorchannelmixer=rr=1.0:gg=0.55:bb=0.35,format=yuv420p[halo];
[base][halo]blend=all_mode=screen:all_opacity=0.35,
  rgbashift=rh=2:bh=-2,
  noise=alls=18:allf=t+u,
  gblur=sigma=0.6,
  unsharp=5:5:0.6,
  vignette=angle=PI/4.6:mode=forward,
  crop=1416:1062:x='12+6*sin(2*PI*t*0.7)':y='9+5*sin(2*PI*t*1.1+1)',scale=1440:1080:flags=bicubic
[v]" -map "[v]" -c:v libx264 -crf 17 -pix_fmt yuv420p -r 24 "$OUT"
