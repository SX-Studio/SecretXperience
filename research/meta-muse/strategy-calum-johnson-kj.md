## Report: "The Creator Who Mastered Claude" (KJ on The Calum Johnson Show, 2026-10-19)

Source: /tmp/claude-0/-home-user-SecretXperience/8460bcca-9a56-510a-bf0b-925d0f9090f3/scratchpad/yt2/Yt_BULiimg4.transcript.txt (chapters from the matching .info.json). The transcript is a rough machine translation, so "verbatim" quotes are reconstructed as closely as the text allows.

### 1. The biggest mistake (15:21–18:52)
- "Many people use Claude as idiots. They do a bunch of things that do nothing." Cause: AI is "code that can reason" and is tuned to keep working, not to ask whether the goal is right. "If you start a little in the wrong direction, in 20 minutes it looks completely different."
- "How you start with the prompt, and the clarity with which you formulate it, determines whether you get a diamond or [crap]."
- "AI will not make you a good YouTuber. But if you are already a good YouTuber, AI will help you create better and more videos."
- "Stop treating this as a way to work less; treat it as a way to work smarter, harder, and on more important things." Core advice: "use AI to become a valuable employee" — education first, then execution.
- "Trajectory is much more important than speed." Spend the AI's speed on deciding direction before producing.

### 2. "Master any skill" prompt (22:43–35:10)
Reconstructed macro prompt (KJ's goal: "start and grow a YouTube channel"):
> "I want to learn [goal]. 1) Interview me to better understand why I'm starting and to clarify my goal. 2) Explain all the skills I will likely need to achieve this goal, and arrange them in order of importance. 3) Help me decide what to do, make a plan, and help me implement it."

Follow-ups, in order:
- "What do I need to do tomorrow to get closer to this goal in a few years?"
- "Break these big skills down into micro-skills." (For video ideas: who am I talking to, what are people searching for; keyword research "is the million-dollar item" he ignored for 5 years.)
- "Be a very boring, underrated human. Tell me the principles underlying these skills. Then tell me how to find the best books, best YouTube videos, best podcasts."
- "Can you recommend the best tools for skill number one? Which tools do I have? Start from scratch."
- Finish: ask for a 30-day action plan ("focus on these skills, this is where your hours go, follow these three rules"). "This is your $4,000 course, free, in 5 minutes."
- Hunt principles, not tactics ("I'm not going to copy a MrBeast thumbnail; the principles will apply"). Loop: find skills → find info → master faster → get feedback → repeat.
- Demo of his "Signal" app via Claude's browser: "I have an app that gives me videos from YouTube. Explain [topic] on camera" → Claude pulls matching videos, orders and saves them. He downloads transcripts of saved videos and "talks to the video" in Claude.

### 3. Learn any new tool (35:10–43:01)
Prompt used for GitHub:
> "This is my goal: I'm building this software and using GitHub to track changes. I'm a complete newbie. Explain it step by step in very simple language. Use analogies with things I already understand (video games, sports). Give me an overview of every concept I need to learn in GitHub to achieve my goal. Then walk me through each one step by step with visual aids and step-by-step instructions. Repeat this until you think I have understood everything."
- Don't skip the questions that arise ("Ah, I get it" is the trap). "Pester the AI until it says 'dude, you still haven't understood this?'"
- Copy the confusing part of an answer back: "explain this in more detail or differently."
- Something doesn't work → screenshot → paste → "Why isn't this working?"
- "Treat Claude like an employee you need time to get to know... after a thousand hours you begin to understand Claude." Accept early failures (his first attempt: "find me 100 thumbnails on my Miro board" in 5 minutes, then got angry).

### 4. Great at / terrible at (43:01–50:14)
- Great: technical troubleshooting (replaces 15 min Reddit + outdated tutorials). Camera white balance/overexposed background fixed by pasting a photo. "Sometimes I send a screenshot without a single word." If info may be stale: "tell it to search the internet."
- The math–art slider: "The closer the task is to mathematics (one correct answer, 'click here, do this'), the better. The closer to art (no correct answer), the worse." AI "doesn't know what looks good; it shows what other people did."
- Don't ask "Does Claude do thumbnails?" Decompose: AI is bad at designing thumbnails, reading the market, spotting trends early, adding the human factor; good at finding other thumbnails, building comparison tools, generating many layouts. "Break the problem into parts and ask: math or art?" You can ask Claude to analyze your process and say which parts it is good at.
- Don't be a "process monkey": "Look at the result, not the process." He still spends 100 hours manually on a Miro board for big videos: "Why don't you automate your videos? Because they'd be terrible."

### 5. Automate anything (50:14–55:58)
- Automate small, repetitive, zero-judgement actions; the value is opportunity cost. "100 bucks: work one day, buy Claude Pro... it's like an army of a thousand virtual assistants with an IQ of 200."
- Example: a bot checks Instagram DMs daily and reports only what matters (mentoring requests, feature ideas from app users, collaboration offers), with rules like "if they don't have many subscribers and ask for an ad deal, don't tell me." Same for email. Vision: "AI as a smart junior brother... read all my messages, come tell me when something important happens."
- Host's sponsor example (useful pattern): Claude Code connected to Zapier built a Zap that auto-generates a guest brief a week before each recording and emails it to the researcher — "much cheaper than an AI agent doing it, and it always works."

### 6. The biggest time-saver: level-2 workflows (55:58–61:18)
- Level 1 = single tasks; Level 2 = "take the whole workflow in your business and unite it with Claude," then refine. His YouTube packaging-report skill, given only a video topic, runs: keyword/demand research → competition and broader-niche search → thumbnail and title inspiration pulled with screenshots → analysis of which titles/elements should work → ready-to-copy tags → production notes.
- "Probably the tenth iteration." Method: "teach Claude, give examples, test" until you "never have to do it again."

### 7. Build your first tool in 10 minutes (61:18–67:30)
Four pre-prompt questions:
1. Why am I creating this? (what annoys me)
2. If I had a magic wand, what would I want?
3. What's wrong with the current method?
4. Exactly what result, features and process capabilities do I want?
- Spend ~30 minutes writing the ideal version before prompting: "Your only bottleneck is your ideas." Cork-board brainstorm → text doc → Claude → step 3: "use it every day" so friction surfaces.
- "You don't need to tell it how to code or what font size. Just say 'make it look like YouTube.'" Always ask how Claude will get the data; research the right API in a separate chat (YouTube Data API here).

### 8. What Claude Cowork is (70:02–86:08)
- Chat app = "just a brain; the only tool it has is talking to you." Cowork = the brain with access to your computer: runs commands, reads/writes files (writes an HTML file you open in Chrome), attaches connectors. Claude Code = same idea for a codebase.
- "API is a menu; connectors are APIs for newcomers," but connectors are limited (Google Drive: search/read/load, not edit/create). "Ask Claude what a connector can do." Browser/computer use is for niche tasks with no API: "everything a person can do on a computer."
- Use the best model ("Fable 5.1 is the best I've seen"). Iteration tricks: batch all corrections into one message ("the less correspondence, the better"); dictate with SuperWhisper (paid model fixes typos that otherwise "confuse the whole prompt"); screenshot + circle the problem; show what good looks like ("AI copies very well"); "tell Claude why you're doing something"; reread generated copy before shipping paid products.
- Live tool: YouTube research page — keyword search, YouTube-style cards, sort by views/outlier multiple (views ÷ subscribers; 17x, 15x), date filter; then fixes: drop videos under 2 minutes, save/focus toggle with blue frame, hide button, purple for >5x outliers.

### 9. Tool built today: "Outlier Board" (86:08–89:05)
- Prompt: "I want to create a simple website where my team can send video links. We call it the Outlier Board." Hosting: "Use Vercel." Password-protected, note per link, saved to phone home screens; built in parallel while he researched; ~10 minutes.

### 10. Beginner advice and money (10:00, 89:05)
- Wife: three custom skills that interview her about goals/problems and "encourage her to action," tone "nice and friendly" → Instagram content plan → ~30 local banners at ~$50 each.
- Day one: "Download Claude, switch to Cowork, give it one idea — set a 30-second timer if needed — and watch." Snowball: build for yourself → friends → paid app ("makes money while you sleep," though "not easy").

### Use this: 10 tactics for an automated video pipeline
1. Decide trajectory first: run the master-skill prompt on the channel goal before building anything.
2. Write the 4-question spec (why / magic wand / what's broken / exact outputs) for 30 minutes before the first prompt.
3. Decompose every pipeline stage with the math–art slider; automate "math" (research, scraping, comparison, tagging), keep humans on "art."
4. Build a packaging-research skill: keywords → competitors → outlier thumbnails/titles with screenshots → tags; iterate ~10 times with examples.
5. Use the YouTube Data API in a tool with outlier ratio (views/subscribers) and age/length filters to pick topics.
6. Batch all corrections into one message; include screenshots with circles and reference examples of "what good looks like."
7. Judge by results only; measure the pipeline's outputs, never admire the process.
8. Route repetitive triage (DMs, email, briefs) to cheap scheduled automations (Zapier-style), not agents.
9. Tell Claude why each step exists and which model/data source to use; research APIs in a separate chat.
10. Ship small internal tools (Vercel, password) and use them daily so friction surfaces fast.
