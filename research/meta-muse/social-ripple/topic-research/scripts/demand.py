import json, subprocess, urllib.parse, urllib.request, time, sys, ssl
D='/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/topics/data/search'
W=[('loneliness','psychology'),('dopamine','explained'),('charisma','psychology'),('narcissism','psychology'),('envy','psychology'),
('jealousy','psychology'),('status','psychology'),('respect','psychology'),('discipline','psychology'),('intelligence','psychology'),
('overthinking','psychology'),('introvert','psychology'),('silence','psychology'),('kindness','psychology'),('trust','psychology'),
('friendship','psychology'),('attachment','psychology'),('people pleasing','psychology'),('shame','psychology'),('guilt','psychology'),
('anger','psychology'),('anxiety','psychology'),('burnout','psychology'),('boredom','psychology'),('procrastination','psychology'),
('confidence','psychology'),('ego','psychology'),('nostalgia','psychology'),('gossip','psychology'),('conformity','psychology'),
('peer pressure','psychology'),('social anxiety','psychology'),('embarrassment','psychology'),('awkwardness','psychology'),
('gratitude','psychology'),('empathy','psychology'),('manipulation','psychology'),('generosity','psychology'),('regret','psychology'),
('first impressions','psychology'),('rejection','psychology'),('belonging','psychology'),('popularity','psychology'),
('inflation','explained'),('money','explained'),('debt','explained'),('tipping','explained'),('rent','explained'),
('birth rate','explained'),('work week','explained'),('bank run','explained'),('capitalism','explained'),('socialism','explained'),
('rich vs poor countries','explained'),('social media','psychology'),('gen z','psychology'),('cities','loneliness'),('cost of living','explained'),
('housing crisis','explained'),('ai jobs','explained')]
ctx=ssl.create_default_context()
def sug(q):
    u='https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q='+urllib.parse.quote(q)
    try:
        return json.loads(urllib.request.urlopen(u,timeout=15,context=ctx).read().decode('utf-8','ignore'))[1]
    except Exception as e: return ['ERR '+str(e)]
out=open(D+'/demand.tsv','w',encoding='utf-8')
out.write('word\tquery\tn_yt_suggest_word\tn_yt_suggest_psych_of\tyt_suggest_samples\tsum_top10_views_2026\tn_2026_over_1M\ttop_2026_video\n')
for w,suffix in W:
    s1=sug(w+' '); s2=sug(('psychology of ' if suffix=='psychology' else 'why ')+w)
    q=f'{w} {suffix}'
    u='https://www.youtube.com/results?search_query='+urllib.parse.quote_plus(q)+'&sp=CAMSBAgFEAE'
    r=subprocess.run(['nice','-n','19','yt-dlp','--flat-playlist','--playlist-end','10','--print','%(view_count)s\t%(channel)s\t%(title)s',u],capture_output=True,text=True,timeout=120)
    vids=[]
    for line in r.stdout.splitlines():
        p=line.split('\t')
        if len(p)>=3 and p[0].isdigit(): vids.append((int(p[0]),p[1],p[2]))
    vids.sort(reverse=True)
    tot=sum(v for v,_,_ in vids); n1=sum(1 for v,_,_ in vids if v>=1_000_000)
    top=f'{vids[0][2]} [{vids[0][1]}, {vids[0][0]:,}]' if vids else ''
    out.write(f"{w}\t{q}\t{len(s1)}\t{len(s2)}\t{' | '.join(s1[:5])}\t{tot}\t{n1}\t{top}\n"); out.flush()
    print(w, tot, n1, top[:90], file=sys.stderr)
