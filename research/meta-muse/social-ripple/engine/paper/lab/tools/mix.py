import json, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
from scipy.ndimage import uniform_filter1d
SR=48000; SC="/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad"; SFX="assets/sfx"
src=open("assets/t.js").read(); DT=json.loads(src.split("window.DT = ")[1].split("; window.DUR")[0]); D=float(src.split("window.DUR = ")[1].split(";")[0]); M=json.load(open("assets/marks.json")); mk=M["marks"]
N=int(D*SR)+SR; db=lambda x:10**(x/20)
def load(p):
    a,sr=sf.read(p); a=np.stack([a,a],1) if a.ndim==1 else a[:,:2]; return resample_poly(a,SR,sr,axis=0) if sr!=SR else a
def put(buf,x,at,g=0):
    i=int(at*SR); j=min(len(buf),i+len(x))
    if i<0: x=x[-i:]; i=0
    if j>i: buf[i:j]+=x[:j-i]*db(g)
def lpf(a,f): return sosfilt(butter(2,f,"low",fs=SR,output="sos"),a,axis=0)
VO=np.zeros((N,2))
for lid,(st,d) in DT.items(): a=load(f"assets/vo/{lid}.wav"); put(VO,a,st,0 if lid.startswith("n") else -1.5)
FX=np.zeros((N,2)); sfx=lambda n: load(f"{SFX}/{n}.wav")
pop,boom,whoosh,tick,chime,shimmer,heart=(sfx(n) for n in ["pop","boom","whoosh_c","tick","gold_chime","shimmer","heartbeat"]); popS=lpf(pop,2600)
put(FX,whoosh,0.0,-14); put(FX,popS,0.12,-16); put(FX,tick,mk["tCrowd"]+1.9,-14); put(FX,popS,mk["tStormAna"]-0.05,-14); put(FX,boom,mk["tStormAna"],-10)
for i in range(8): put(FX,popS,mk["tCrowd"]+0.5+i*0.22,-17-i*0.3)
put(FX,popS,mk["tStr"]+0.9,-15); put(FX,tick,mk["tCard"],-10); put(FX,whoosh,mk["tCard"]+0.95,-18)
put(FX,heart,mk["tCrumble"]+1.6,-16); put(FX,boom[:int(1.0*SR)],mk["tCrumble"]+2.0,-18); put(FX,chime,mk["tLift"]+0.2,-16); put(FX,shimmer,mk["tTitle"],-16); put(FX,popS,mk["tTitle"]+0.2,-18)
for c in M["cuts"][1:]: put(FX,whoosh,c-0.1,-27)
MUS=np.zeros((N,2))
def cue(path,t0,t1,g,src0=0,fi=0.6,fo=1.0):
    a=load(path); L=int((t1-t0)*SR); s0=int(src0*SR); x=a[s0:s0+L].copy()
    if len(x)<L: x=np.concatenate([x,a[:L-len(x)]])
    fi_,fo_=min(int(fi*SR),L//2),min(int(fo*SR),L//2); x[:fi_]*=np.linspace(0,1,fi_)[:,None]; x[-fo_:]*=np.linspace(1,0,fo_)[:,None]**1.5; put(MUS,x,t0,g)
cue(f"{SC}/acestep/ripple5/cueO.wav",0.1,mk["tCrumble"]+0.3,-19,12,fi=0.3,fo=0.25)
cue(f"{SC}/acestep/ripple4/cueL.wav",mk["tCrumble"],mk["tLift"]+0.8,-18,20,fi=1.2,fo=0.6)
cue(f"{SC}/acestep/ripple4/cueW.wav",mk["tLift"]+0.3,D,-18,0,fi=1.0,fo=1.5)
v=np.abs(VO).mean(1); e=uniform_filter1d(v,int(0.12*SR)); e=e/(np.percentile(e[e>1e-4],90)+1e-9); duck=uniform_filter1d(np.clip(e*3,0,1),int(0.3*SR)); MUS*=db(-8*duck)[:,None]
out=(VO+FX+MUS)[:int(D*SR)]; sf.write("assets/mix_raw.wav",out.astype(np.float32),SR,subtype="FLOAT"); print("mix",round(float(np.abs(out).max()),2))
