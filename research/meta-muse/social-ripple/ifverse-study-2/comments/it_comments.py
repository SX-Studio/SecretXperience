"""Top comments via YouTube's InnerTube 'next' endpoint (no key needed). Usage: python3 it_comments.py VIDEO_ID [max]"""
import json, sys, urllib.request, re
vid = sys.argv[1]; MAX = int(sys.argv[2]) if len(sys.argv) > 2 else 100
CTX = {"client": {"clientName": "WEB", "clientVersion": "2.20251101.00.00", "hl": "en", "gl": "US"}}
def post(body):
    req = urllib.request.Request("https://www.youtube.com/youtubei/v1/next?prettyPrint=false", json.dumps(body).encode(), {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0", "Origin": "https://www.youtube.com"})
    return json.load(urllib.request.urlopen(req, timeout=60))
def find(o, key, out):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == key: out.append(v)
            find(v, key, out)
    elif isinstance(o, list):
        for v in o: find(v, key, out)
    return out
j = post({"context": CTX, "videoId": vid})
title = "".join(r.get("text", "") for r in (find(j, "videoPrimaryInfoRenderer", []) or [{}])[0].get("title", {}).get("runs", [])) if find(j, "videoPrimaryInfoRenderer", []) else ""
tokens = [c["continuationCommand"]["token"] for c in find(j, "continuationEndpoint", []) if "continuationCommand" in c]
# the comments section token is usually the last continuation in the engagement panel / itemSection
sec = [t for t in find(j, "token", []) if isinstance(t, str)]
comments = []
for tok in reversed(tokens or sec):
    try: r = post({"context": CTX, "continuation": tok})
    except Exception: continue
    ents = find(r, "commentEntityPayload", [])
    if not ents: continue
    # top comments sort: first page is "Top comments"
    while True:
        for e in ents:
            p = e.get("properties", {}); tb = e.get("toolbar", {})
            comments.append({"text": p.get("content", {}).get("content", ""), "likes": tb.get("likeCountNotliked", "") or tb.get("likeCountA11y", ""), "replies": tb.get("replyCount", ""), "author": e.get("author", {}).get("displayName", "")})
        if len(comments) >= MAX: break
        nxt = [c["continuationCommand"]["token"] for c in find(r, "continuationEndpoint", []) if "continuationCommand" in c]
        nxt = [t for t in nxt if t != tok]
        if not nxt: break
        tok = nxt[-1]; r = post({"context": CTX, "continuation": tok}); ents = find(r, "commentEntityPayload", [])
        if not ents: break
    break
print(json.dumps({"id": vid, "title": title, "n": len(comments), "comments": comments[:MAX]}, ensure_ascii=False))
