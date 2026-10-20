#!/usr/bin/env python3
"""
Batch "watch" YouTube videos with Gemini's video understanding, to give a transcript-only
reader the VISUAL context: on-screen tools, prompts, UI steps, visual style, numbers.

Gemini takes the YouTube URL directly (file_data.file_uri), so nothing is downloaded and the
YouTube block on cloud containers does not matter.

Why segments and streaming: the cloud agent proxy drops any upstream request that sends no
bytes for 30 seconds. A whole video plus a long report takes about 60 seconds, so each video is
split into SEGMENT-second clips (video_metadata offsets), each streamed via
streamGenerateContent with low thinking so the first byte arrives quickly.

Usage:
  python3 -I watch_all.py                    # all tier-1 videos (tutorials and demos)
  python3 -I watch_all.py --ids ID1,ID2       # specific videos (any tier)
  python3 -I watch_all.py --tier 2           # the long interviews (skipped by the user's choice)

Auth: a cloud-environment network secret on generativelanguage.googleapis.com that injects the
x-goog-api-key header (key never visible to the agent), or GEMINI_API_KEY in the environment.

Output: out/<id>.md (segments merged), parts kept in out/parts/. Standard library only.
"""
import argparse, json, os, pathlib, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

SEGMENT = 480  # seconds per clip

# (id, title, duration seconds)
VIDEOS = {
    1: [
        ("W7L2rZVyYmY", "TubeLab, Exposing The New YouTube Automation Goldrush", 379),
        ("sGt1ACELN4k", "Jason Cooperson, I Finally Solved AI Video Editing", 1279),
        ("EChXCPolIDQ", "Zinho Automates, Build ANY Faceless YouTube Channel with Claude", 957),
        ("WqXULg6uR30", "Danny Why, Claude Literally Just Changed YouTube Forever", 786),
        ("oWkUwno6b0E", "Chronixel, Claude + Remotion ultimate tutorial", 1648),
        ("yptFP52LEJU", "Taro Creates, Fully Automated Editing Faceless Videos", 1021),
        ("Ge1B-Ok1Pfk", "Futurepedia, Claude Makes a New Kind of Video", 679),
        ("d6spCMcfkew", "Sirio, Dear Higgsfield I reverse engineered you", 1306),
        ("qSuCPooR3E4", "Brad Bonanno, How I Watch ANY Video with AI", 487),
        ("1TuS9ImqV4g", "Nuno Tavares, Claude Code CLI connectors", 1045),
        ("Ug3x37N6Z_E", "Dubibubi, Army of Haiku 5.5 subagents vs Opus 5.5", 916),
        ("dAzs_rU6080", "Nick Saraev, Viral GitHub repo that reverse engineers anything", 646),
        ("kqn_mSjSWMs", "The Next New Thing, GitHub top repos Oct 16", 1603),
        ("1dlC0MVqzP0", "Deeplearn HQ short, Claude runs your YouTube channel", 56),
        ("tpZOU1ugODQ", "Greg Isenberg, Meta Muse will create 1,000 millionaires", 1474),
    ],
    3: [  # added 2026-10-20
        ("-LNDXx__ZT0", "Higgsfield AI, Introducing Higgsfield Katana (Claude Motion)", 78),
        ("zkhLZUGIIfE", "The_Frizzy1, I Replaced Higgsfield Genjutsu With My RTX 3060", 636),
    ],
    2: [
        ("Yt_BULiimg4", "Calum Johnson Show, The Creator Who Mastered Claude", 5739),
        ("UVsIqkkPLYU", "Jake Trinder, Most Valuable YouTube Advice", 0),
        ("Z2uoA3bhJT0", "Open Residency, Paddy Galloway 2-hour masterclass", 0),
        ("zyWSbm7qPhI", "Cole Gordon, $150M of sales knowledge", 0),
    ],
}

PROMPT = """You are watching part of a YouTube video so that an engineer who has only read the
transcript gets the VISUAL context the transcript lacks. This clip covers {start} to {end} of the
full video. Use timestamps of the FULL video (add {start} if your clock starts at zero).
Be concrete and exhaustive. Report:

1. Every tool, app, website, repo, model name, plan name, price or setting that appears ON SCREEN
   (menus, URLs, terminal commands, config files, file trees, dashboards), even if not spoken.
2. Every prompt or code shown on screen: reproduce the visible text as exactly as you can.
3. Step-by-step UI actions the presenter performs (which menu, which button, which field).
4. For any generated video, motion graphics or thumbnails shown: describe the visual style
   precisely (camera moves, easing, typography, palette, layout, caption style, transitions,
   pacing), so a designer could brief a renderer to reproduce the look.
5. Any numbers shown on dashboards or analytics (views, retention, revenue, costs, credits).
6. Anything on screen that contradicts or adds to what the presenter says.

Format: markdown, sections numbered as above, each bullet starting with [mm:ss]. Skip a section
with "none" if nothing applies. No filler."""


def mmss(s):
    return f"{s // 60:02d}:{s % 60:02d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tier", type=int, default=1)
    ap.add_argument("--ids", default="")
    ap.add_argument("--models", default=os.environ.get(
        "WATCH_GEMINI_MODELS",
        "gemini-3.7-flash,gemini-3.5-flash,gemini-3-flash-preview,gemini-3.6-flash,gemini-3.5-flash-lite"),
        help="comma list; free tier allows about 20 requests per model per day, so the runner "
             "moves to the next model when one returns a daily-quota 429")
    ap.add_argument("--workers", type=int, default=3)
    args = ap.parse_args()

    key = os.environ.get("GEMINI_API_KEY")
    import threading
    models = args.models.split(",")
    exhausted = set()
    lock = threading.Lock()

    cooling = {}  # model -> time it may be retried after a 503 "high demand"

    def current_model():
        while True:
            with lock:
                live = [m for m in models if m not in exhausted]
                if not live:
                    return None
                now = time.time()
                for m in live:
                    if cooling.get(m, 0) <= now:
                        return m
                wait = min(cooling[m] for m in live) - now
            time.sleep(max(1, wait))
    here = pathlib.Path(__file__).parent
    out = here / "out"
    parts_dir = out / "parts"
    parts_dir.mkdir(parents=True, exist_ok=True)

    def stream(body, model):
        endpoint = (f"https://generativelanguage.googleapis.com/v1beta/models/"
                    f"{model}:streamGenerateContent?alt=sse")
        req = urllib.request.Request(endpoint, data=json.dumps(body).encode(),
                                     headers={"Content-Type": "application/json"}, method="POST")
        if key:
            req.add_header("x-goog-api-key", key)
        text, finish, last_raw = "", None, ""
        with urllib.request.urlopen(req, timeout=900) as r:
            for line in r:
                line = line.decode("utf-8", "replace").strip()
                if line:
                    last_raw = line[:300]
                if not line.startswith("data:"):
                    continue
                d = json.loads(line[5:])
                if "error" in d:
                    raise RuntimeError(f"stream error: {d['error']}")
                for c in d.get("candidates", []):
                    finish = c.get("finishReason") or finish
                    for p in c.get("content", {}).get("parts", []):
                        if not p.get("thought"):
                            text += p.get("text", "")
        if finish != "STOP":
            print(f"  stream ended without STOP ({len(text.split())} words); last line: {last_raw}", flush=True)
        return text, finish

    def do_segment(job):
        vid, title, start, end = job
        dest = parts_dir / f"{vid}.{start:05d}.md"
        if dest.exists() and dest.stat().st_size > 2000:
            return f"skip {vid} {mmss(start)}"
        part = {"file_data": {"file_uri": f"https://www.youtube.com/watch?v={vid}"}}
        if end:
            part["video_metadata"] = {"start_offset": f"{start}s", "end_offset": f"{end}s"}
        body = {
            "contents": [{"parts": [part, {"text": PROMPT.format(start=mmss(start), end=mmss(end) if end else "the end")}]}],
            "generationConfig": {"thinkingConfig": {"thinkingLevel": "low"}},
        }
        last = None
        for attempt in range(20):
            model = current_model()
            if model is None:
                return f"error {vid} {mmss(start)}: every model is out of daily quota"
            try:
                t = time.time()
                text, finish = stream(body, model)
                if len(text.split()) < 30 or finish != "STOP":
                    raise RuntimeError(f"incomplete output ({len(text.split())} words, finish={finish})")
                dest.write_text(f"## Segment {mmss(start)} to {mmss(end) if end else 'end'}\n\n{text}\n")
                return f"wrote {vid} {mmss(start)} ({len(text.split())} words, {round(time.time() - t)} s, {finish}, {model})"
            except Exception as e:
                detail = ""
                try:
                    detail = e.read().decode()[:1500]
                except Exception:
                    pass
                last = f"{model}: {e} {detail}".strip()
                code = getattr(e, "code", 0)
                # daily quota or unknown model: drop the model for this run
                if "PerDay" in detail or "per day" in detail.lower() or code == 404:
                    with lock:
                        exhausted.add(model)
                    print(f"  dropping {model} for this run: {code} {detail[:120]!r}", flush=True)
                    continue
                # "high demand" 503: cool this model for 2 minutes, try another meanwhile
                if code == 503:
                    with lock:
                        cooling[model] = time.time() + 120
                    print(f"  {model} busy (503), cooling 2 min", flush=True)
                    continue
                # thinkingConfig rejected by an older model: drop it and retry
                if "thinking" in detail.lower():
                    body.pop("generationConfig", None)
                time.sleep(15 * (attempt + 1))
        return f"error {vid} {mmss(start)}: {last}"

    if args.ids:
        wanted = args.ids.split(",")
        allv = {v[0]: v for tier in VIDEOS.values() for v in tier}
        items = [allv[i] for i in wanted if i in allv]
    else:
        items = VIDEOS[args.tier]

    jobs = []
    for vid, title, dur in items:
        if (out / f"{vid}.md").exists():
            print(f"skip {vid} (merged file exists)", flush=True)
            continue
        if not dur or dur <= SEGMENT + 60:
            jobs.append((vid, title, 0, 0))
        else:
            for s in range(0, dur, SEGMENT):
                jobs.append((vid, title, s, min(s + SEGMENT, dur)))

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        for msg in ex.map(do_segment, jobs):
            print(msg, flush=True)

    # merge segments per video
    for vid, title, dur in items:
        segs = sorted(parts_dir.glob(f"{vid}.*.md"))
        expected = 1 if (not dur or dur <= SEGMENT + 60) else len(range(0, dur, SEGMENT))
        if len(segs) == expected and not (out / f"{vid}.md").exists():
            body = "\n\n".join(p.read_text() for p in segs)
            (out / f"{vid}.md").write_text(f"# {title}\n\nhttps://www.youtube.com/watch?v={vid}\n\n{body}")
            print(f"merged {vid}", flush=True)
        elif len(segs) != expected:
            print(f"incomplete {vid}: {len(segs)}/{expected} segments", flush=True)
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
