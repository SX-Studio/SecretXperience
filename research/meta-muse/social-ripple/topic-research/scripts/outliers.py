import csv, glob, os, statistics, sys
D='/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/topics/data'
META={ # handle: (display name, group)
 'kurzgesagt':('Kurzgesagt','science/society explainer'),'TEDEd':('TED-Ed','animated edu'),
 'theschooloflifetv':('The School of Life','psych/relationships'),'Psych2go':('Psych2Go','animated psych'),
 'sprouts':('Sprouts','animated psych/edu'),'IfverseTales':('Ifverse','animated what-if story'),
 'dayonefilmsofficial':('Day One Films','animated short film'),'RicksClips3000':('RicksClips3000','animated history shorts'),
 'EconomicsExplained':('Economics Explained','money/econ'),'TwoCentsPBS':('Two Cents (PBS)','money/econ'),
 'HowMoneyWorks':('How Money Works','money/econ'),'Wendoverproductions':('Wendover','systems explainer'),
 'PolyMatter':('PolyMatter','systems explainer'),'johnnyharris':('Johnny Harris','geopolitics/history'),
 'PursuitofWonder':('Pursuit of Wonder','philosophy/psych'),'Einzelgänger':('Einzelgänger','philosophy/psych'),
 'BetterIdeas':('Better Ideas','self-improvement'),'Charismaoncommand':('Charisma on Command','social skills'),
 'ApertureThinking':('Aperture','philosophy/society'),'PracticalPsychologyTips':('Practical Psychology','animated psych'),
 'AfterSkool':('After Skool','animated philosophy/psych'),'AndrewKirbys':('Andrew Kirby','self-improvement'),
 'PsychToonsHQ':('PsychToons (new)','animated psych'),'PsychologyIsSimplified':('Psychology Simplified (new)','animated psych'),
 'BigBrainExplains':('Big Brain Explains (new)','animated psych'),'ApexPsychologyYT':('Apex Psychology (new)','animated psych'),
 'Brainosophic':('Brainosophy (new)','animated psych'),'EverythingProfessor':('EverythingProfessor (new)','animated explainer'),
 'Vaulten1':('Vaulten (new)','animated psych'),'Primateeconomics':('Primate Economics (new)','animated econ'),
 'Crayon_Capital':('Crayon Capital (new)','animated econ'),'StickoExplains':('Sticko Explains (new)','stick-figure psych'),
 'MonkModeFilms':('Monk Mode Films (new)','animated short film'),'HeyHistorically':('Historically (new)','animated history'),
 'Mindplicit':('Mindplicit','philosophy/psych'),'fivebynine':('Five By Nine','lifestyle neuroscience'),
}
rows=[]; summary=[]
for f in sorted(glob.glob(D+'/raw/*.tsv')):
    base=os.path.basename(f)[:-4]; h,tab=base.split('__')
    vids=[]
    for line in open(f,encoding='utf-8'):
        p=line.rstrip('\n').split('\t')
        if len(p)<5: continue
        t,v,dur,ud,vid=p[:5]
        if v in ('NA',''): continue
        vids.append((t,int(float(v)),dur,vid))
    if len(vids)<8: 
        summary.append((h,tab,len(vids),None,None,0,0)); 
        # still keep rows, no multiplier
        for t,v,dur,vid in vids: rows.append([META.get(h,(h,''))[0],META.get(h,(h,''))[1],h,tab,t,v,dur,vid,'','',''])
        continue
    med=statistics.median([v for _,v,_,_ in vids])
    n3=n5=0
    for t,v,dur,vid in vids:
        m=v/med if med else 0
        flag='STRONG(>=5x)' if m>=5 else ('OUTLIER(>=3x)' if m>=3 else '')
        n3+= m>=3; n5+= m>=5
        rows.append([META.get(h,(h,''))[0],META.get(h,(h,''))[1],h,tab,t,v,dur,vid,int(med),round(m,2),flag])
    summary.append((h,tab,len(vids),int(med),max(v for _,v,_,_ in vids),n3,n5))
hdr=['channel','group','handle','tab','title','views','duration_s','video_id','channel_median','multiplier','flag']
with open(D+'/all_videos.tsv','w',encoding='utf-8') as o:
    o.write('\t'.join(hdr)+'\n'); [o.write('\t'.join(map(str,r))+'\n') for r in rows]
out=[r for r in rows if r[10]]
out.sort(key=lambda r:-r[9])
with open(D+'/outliers.tsv','w',encoding='utf-8') as o:
    o.write('\t'.join(hdr)+'\n'); [o.write('\t'.join(map(str,r))+'\n') for r in out]
with open(D+'/channel_summary.tsv','w',encoding='utf-8') as o:
    o.write('channel\tgroup\thandle\ttab\tn_videos\tmedian_views\tmax_views\tn_outliers_3x\tn_strong_5x\n')
    for h,tab,n,med,mx,n3,n5 in summary:
        o.write(f"{META.get(h,(h,''))[0]}\t{META.get(h,(h,''))[1]}\t{h}\t{tab}\t{n}\t{med}\t{mx}\t{n3}\t{n5}\n")
print(len(rows),'videos',len(out),'outliers')
