#!/usr/bin/env python3
"""fetch.py: the link converter. Turns a video link into a local file the dissector can use (personal study use only).
Usage: python3 fetch.py URL [OUTDIR] [--cookies cookies.txt] [--max-height 720]
Order of attempts:
  1. plain download (works for most sites, and for YouTube when it isn't asking for a sign-in);
  2. with your own browser cookies (--cookies or env YTDLP_COOKIES; export with a "Get cookies.txt" browser extension while logged into YouTube);
  3. if YouTube still refuses: it prints what to do (run this on your own computer, or drop the file in the inbox folder).
It never tries to spoof clients or evade checks. If YouTube says no, it says no.
Prints the final path on the last line (FILE <path>)."""
import argparse, glob, os, re, subprocess, sys
ap = argparse.ArgumentParser(); ap.add_argument("url"); ap.add_argument("out", nargs="?", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "video-inbox"))
ap.add_argument("--cookies", default=os.environ.get("YTDLP_COOKIES")); ap.add_argument("--max-height", type=int, default=720)
A = ap.parse_args(); OUT = os.path.abspath(A.out); os.makedirs(OUT, exist_ok=True)
m = re.search(r"(?:v=|youtu\.be/|shorts/|/video/)([\w-]{11})", A.url); vid = m.group(1) if m else re.sub(r"\W+", "_", A.url)[-40:]
existing = [f for f in glob.glob(os.path.join(OUT, f"{vid}.*")) if not f.endswith((".part", ".json"))]
if existing: print("already here"); print("FILE", existing[0]); sys.exit(0)
base = ["yt-dlp", "--no-playlist", "-f", f"bv*[height<={A.max_height}][ext=mp4]+ba[ext=m4a]/b[height<={A.max_height}][ext=mp4]/b[height<={A.max_height}]/b", "--merge-output-format", "mp4", "--write-info-json", "-o", os.path.join(OUT, f"{vid}.%(ext)s")]
attempts = [("plain", base)]
if A.cookies and os.path.exists(A.cookies): attempts.append(("cookies", base + ["--cookies", A.cookies]))
err = ""
for name, cmd in attempts:
    r = subprocess.run(cmd + [A.url], capture_output=True, text=True, timeout=1800); err = r.stderr.strip().splitlines()[-1] if r.stderr.strip() else ""
    got = [f for f in glob.glob(os.path.join(OUT, f"{vid}.*")) if f.endswith((".mp4", ".mkv", ".webm", ".mov"))]
    if got: print(f"downloaded ({name})"); print("FILE", got[0]); sys.exit(0)
    print(f"{name}: {err[:160]}")
print("\nCould not fetch this link from here." + ("\nYouTube asked for a sign-in (bot check on cloud machines)." if "Sign in" in err or "bot" in err else ""))
print("Options:\n  a) export your own YouTube cookies (browser extension 'Get cookies.txt LOCALLY'), save as cookies.txt in the repo, and re-run: fetch.py URL --cookies cookies.txt"
      "\n  b) run this same command on your own computer (no bot check there), then put the file in video-inbox/"
      "\n  c) drop any screen recording or downloaded file into video-inbox/ and run dissect.py on it")
sys.exit(2)
