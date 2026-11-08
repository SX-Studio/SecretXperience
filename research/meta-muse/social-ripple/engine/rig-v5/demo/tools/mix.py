import json, subprocess
exec(open("assets/t.js").read().replace("window.DT = ","DT=").replace("; window.DUR = ","\nDUR="))
S="/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/acestep/ripple4/"
ins=[]; fl=[]; n=0
for i,(t,d) in DT.items():
    ins += ["-i", f"assets/vo/{i}.wav"]; ms=int(t*1000); vol = 1.0 if i.startswith("n") else 1.1
    fl.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,volume={vol},adelay={ms}|{ms}[v{n}]"); n+=1
vo="".join(f"[v{k}]" for k in range(n)); fl.append(f"{vo}amix=inputs={n}:normalize=0,asplit=2[vo1][vo2]")
tw=DT["ana_03"][0]+1.0
ins += ["-i", S+"cueL.wav", "-i", S+"cueW.wav"]
fl.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{tw+2:.2f},afade=t=in:d=1.5,afade=t=out:st={tw-1:.2f}:d=3,volume=0.16[mL]")
fl.append(f"[{n+1}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{DUR-tw+1:.2f},afade=t=in:d=2.5,afade=t=out:st={DUR-tw-2.5:.2f}:d=2.5,volume=0.2,adelay={int(tw*1000)}|{int(tw*1000)}[mW]")
fl.append("[mL][mW]amix=inputs=2:normalize=0,highpass=f=150[mus]")
fl.append("[mus][vo1]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[duck]"); fl.append(f"[duck][vo2]amix=inputs=2:normalize=0,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(["ffmpeg","-loglevel","error","-y",*ins,"-filter_complex",";".join(fl),"-map","[out]","-ar","48000","assets/mix.wav"],check=True)
s=open("index.html").read().replace("DURX",str(DUR)); open("index.html","w").write(s); print("mix ok", DUR)
