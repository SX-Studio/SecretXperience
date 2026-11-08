import csv, re, math, statistics
D='/tmp/claude-0/-home-user-SecretXperience/d27a313c-2520-5c59-9c99-ff5820403b05/scratchpad/topics/data'
TOPICS={ # core concept : regex
 'Intelligence/IQ':r'\bIQ\b|intelligen|smart(er|est)?\b|genius|polymath|stupid|gifted',
 'Discipline':r'disciplin|willpower|monk mode|spartan',
 'Dopamine':r'dopamine',
 'Addiction':r'addict|porn|semen|drug',
 'Lust/Desire':r'\blust|seduc|horny|sexual|\bsex\b|desir',
 'Love':r'\blove\b|in love|romantic|romanticiz',
 'Dating/Attraction':r'dating|\bdate\b|attract|flirt',
 'Charisma':r'charism|charm|aura|fun to talk|funnier|jokes?\b',
 'Respect/Status':r'respect|status|admire|intimidat|popular|power\b|powerful|rank',
 'Confidence':r'confiden|self-worth|self worth|validation',
 'Loneliness':r'lonel|\balone\b|isolat|social contact|no friends|few (or no )?friends',
 'Introvert/Staying home':r'introvert|extravert|staying at home|stay home|leave home|homebody|crowded|guests',
 'Friendship':r'friend',
 'Overthinking':r'overthink|think(s|ing)? too much|fake scenarios|too aware|hyper aware|notice too much|see what others',
 'Anxiety':r'anxi|angst|worry|panic',
 'Stress/Burnout':r'stress|burnout|burn out|tired|exhaust|overstimul',
 'Anger':r'\banger|angry|offended|bothered',
 'Sadness/Depression':r'depress|sad\b|miserable|cry|not okay|hurt',
 'Trauma/Childhood':r'trauma|childhood|grew up|ignored child|black sheep|neglect',
 'Parenting/Kids':r'parent|\bkids?\b|child|teen|sibling',
 'Generations':r'gen x|gen z|millennial|boomer|xennial|generation',
 'Narcissism/Dark traits':r'narciss|sociopath|psychopath|dark triad|machiavell|dark empath|dark psychology',
 'Manipulation':r'manipulat|gaslight',
 'Personality':r'personalit|introvert|INFJ|MBTI|big (5|five)',
 'Empathy/Sensitivity':r'empath|feel everything|deeply|sensitiv',
 'Ego':r'\bego\b|self-awareness|self awareness',
 'Happiness/Meaning':r'happ(y|iness)|meaning|purpose|bliss|joy',
 'Habits/Routine':r'habit|routine|morning',
 'Procrastination/Laziness':r'procrastinat|lazy|laziness|\brut\b|productiv|consisten|focus|attention span',
 'Silence/Quiet':r'silen|quiet|go quiet',
 'Stoicism/Letting go':r'stoic|marcus aurelius|seneca|epictetus|letting|let go|stop caring|care less|reverse(d)? effort|control',
 'Consciousness/Reality':r'conscious|reality|quantum|dimension|universe',
 'Sleep/Dreams':r'sleep|dream|nightmare',
 'Social media/Internet':r'social media|internet|brain rot|post their|phone|online',
 'Money (personal)':r'\bmoney\b|rich|poor|wealth|broke|savings|financ|invest|millionaire|billionaire',
 'Poverty/Inequality':r'\bpoor\b|poverty|inequal|expensive to be',
 'Economy/Crisis':r'econom|recession|depression explained|crisis|collapse|bubble|crash|default|debt',
 'Inflation/Prices':r'inflation|expensive|prices?\b|cost of|cheap',
 'Tax/Tariffs':r'\btax|tariff',
 'Work/Jobs':r'\bjobs?\b|9-5|work\b|career|employ|nobody wants to work',
 'Home/Interior (lifestyle)':r'\bhomes?\b|room|interior|ikea|declutter|tidy|cleaning',
 'Cities/Housing market':r'city|cities|housing|\brent\b|house prices|buy a house|empty',
 'Tipping/Manners':r'\btip(s|ping)?\b|manners|etiquette|polite',
 'Capitalism/Socialism/Systems':r'capitalis|socialis|communis|democra|dictator|government|deep state',
 'Birth rate/Demographics':r'birth|fertility|demograph|one-child|population',
 'Banks/Bank run':r'\bbank|bank run',
 'Weekend/Work week':r'weekend|9-5|4-day|four-day|5 days|work week|40-hour',
 'Envy/Jealousy':r'envy|jealous',
 'Shame/Guilt':r'shame|guilt|apologi',
 'Fear':r'\bfear|afraid|scared',
 'Countries/Geopolitics':r'china|russia|japan|korea|italy|africa|new zealand|spain|uk\b|america|india|taiwan|singapore|somalia|zimbabwe',
 'History/Empires':r'history|empire|ancient|rome|civiliz|war\b|medieval|pirate|sailor',
 'Scams/Fraud':r'scam|fraud|fake guru|wolf of wall|ponzi|lottery',
 'Crowds/Mass behaviour':r'mass psychosis|crowd|collective|herd|everyone',
 'Social experiments':r'experiment|stanford prison|milgram|bobo|universe 25',
 'Effects/biases (named)':r'effect\b|bias|syndrome|dunning|pygmalion|halo',
 'Rules/Norms':r'rules?\b|laws? of|norm',
 'Lying/Trust':r'\blie(s)?\b|lying|trust|honest',
 'Conversation/Social skills':r'conversation|talk to|small talk|argue|argument|strangers|say when|what to say',
 'Kindness/Nice people':r'kind\b|kindness|nice people|good person|loveliest',
 'Death/Mortality':r'death|die(s)?\b|immortal|exist',
}
ANGLES={
 'Psychology of …':r'psychology of|psyche explained|psychology (explains|explained|behind)',
 'People who …':r'people who|those who|people that|if you (never|love|have|endured|see)',
 'Why …':r'^why\b|\bwhy (do|does|are|is|you|some|we|your|kids|teens|people|so|it)',
 'How …(mechanism)':r'^how (a|the|social|childhood|culture|power|money|eating|airlines|repressed|north|mcdonald|this|do)',
 'How to …':r'how to|how you',
 'Explained':r'explain',
 'Explained like you\'re 5 / with an object':r"like you('re| are) 5|with bananas|with one|in a nutshell",
 'Every … / Every type':r'\bevery\b',
 'Levels / stages / tiers':r'level|stage|tier|rank',
 'Number list (N things/signs/habits)':r'^\d+\s|\b\d+ (signs|things|habits|rules|ways|steps|traits|tips|lessons|jokes|sentences|lies|questions|types|tactics|laws|stages|parenting)',
 'Signs …':r'\bsigns?\b',
 'Traits / rare / superpower':r'trait|rare|superpower|unfair advantage',
 'So X it … (hyperbole)':r'so (\w+ )+it (scares|makes|feels)|almost unfair|feels illegal',
 'Mistake(s)':r'mistake|backfire|wrong',
 'Dark / danger / terrifying':r'dark|danger|terrif|scar(y|es)|killing|ruin|destroy|worst',
 'Hidden / secret / truth':r'hidden|secret|truth|nobody|no one|never learned|don\'t know|you shouldn\'t',
 'Philosopher / thinker frame':r'philosoph|stoic|jung|freud|machiavell|nietzsche|marcus|seneca|epictetus|schopenhauer|spengler|cipolla|bonhoeffer|kant|watts|orwell|dostoevsky|kierkegaard|thoreau|carl|piaget|vygotsky|kohlberg|maslow',
 'Named effect / theory / law':r'effect\b|theory|law of|laws of|paradox|syndrome|principle',
 'Experiment / study':r'experiment|study|studies|research|neuroscience|backed by',
 'Animated short film (ONE WORD)':r'animated short film|^[A-Z]{4,}( VS [A-Z]+)? \|',
 'I tried / I spent (value concentration)':r'^i (tried|spent|read|found|interviewed)',
 'What if':r'what if',
 'What happens when/to':r'what happens',
 'Entire history / everything about':r'entire|everything',
 'Paradox':r'paradox',
 'The X that Y (object story)':r'^the [\w\'’ ]+ (that|who|of) ',
 'Parenthetical promise (… And How To …)':r'\((and|why|how|without|backed|psychology|the|raised)',
 'Generational label':r'gen x|gen z|millennial|boomer|xennial',
 'Country / place':r'china|russia|japan|korea|italy|africa|new zealand|spain|\buk\b|america|india|taiwan|singapore|zimbabwe',
 'Money angle (keeps you poor / makes money)':r'keeps you poor|makes money|expensive|cost|rich|billionaire',
}
rows=list(csv.DictReader(open(D+'/all_videos.tsv',encoding='utf-8'),delimiter='\t'))
rows=[r for r in rows if r['multiplier']]
N=len(rows); NO=sum(1 for r in rows if float(r['multiplier'])>=3)
def stats(lex,name):
    out=[]
    for k,rx in lex.items():
        R=re.compile(rx,re.I if not k.startswith('Animated short') else 0)
        m=[r for r in rows if R.search(r['title'])]
        if not m: continue
        mults=[float(r['multiplier']) for r in m]
        o=[r for r in m if float(r['multiplier'])>=3]; s=[r for r in m if float(r['multiplier'])>=5]
        lift=(len(o)/NO)/(len(m)/N) if NO else 0
        w=sum(math.log2(float(r['multiplier'])) for r in o)
        chans=len(set(r['channel'] for r in o))
        top=sorted(o,key=lambda r:-float(r['multiplier']))[:3]
        bych={}
        for r in o: bych.setdefault(r['channel'],[]).append(math.log2(float(r['multiplier'])))
        bal=sum(sum(sorted(v,reverse=True)[:2]) for v in bych.values())
        ex=' ; '.join(f"{r['title'][:70]} [{r['channel']}, {int(r['views']):,}, {float(r['multiplier']):.0f}x]" for r in top)
        out.append([k,len(m),len(o),len(s),round(len(o)/len(m)*100,1),round(lift,2),round(statistics.median(mults),2),round(w,1),round(bal,1),chans,ex])
    out.sort(key=lambda x:-x[8])
    with open(D+f'/{name}.tsv','w',encoding='utf-8') as f:
        f.write('label\tn_all\tn_outliers_3x\tn_strong_5x\tpct_outlier\tlift_vs_base\tmedian_multiplier\tweighted_score_sum_log2mult\tbalanced_score_top2_per_channel\tn_channels_with_outlier\ttop_examples\n')
        for x in out: f.write('\t'.join(map(str,x))+'\n')
    print(f'== {name}: base outlier rate {NO/N*100:.1f}% of {N}')
    for x in out: print(f"{x[0][:38]:38} all={x[1]:4} out={x[2]:3} 5x={x[3]:3} rate={x[4]:5}% lift={x[5]:4} medM={x[6]:5} W={x[7]:6} BAL={x[8]:5} ch={x[9]}")
stats(TOPICS,'topic_rank'); stats(ANGLES,'angle_rank')
