# Tools assessment: the six repos (Eric Michaud, S_W4OSuh2Aw) and the local stack

Tested hands-on in the cloud container on 2026-10-20: 4 CPU cores, no GPU, 15 GB RAM. `setup-local-stack.sh` rebuilds everything here in a fresh container.

## Verdicts

| Tool | What it is | Verdict | Why |
|---|---|---|---|
| **HyperFrames** (heygen-com/hyperframes, Apache-2.0) | HTML + GSAP compositions rendered deterministically to MP4. Agent skills, about 450 registry blocks, CLI `lint`, `check`, `snapshot`, `render`, `transcribe`, `tts`, `beats` | **Adopted as the renderer** | A 72 s 1080×1920 Short renders in about 3 min on this CPU. `check` catches layout, contrast and motion bugs before render. `snapshot` gives the contact sheets the critique loop needs. Point it at the preinstalled Chromium with `PRODUCER_HEADLESS_SHELL_PATH` (see the setup script). |
| **Kokoro-82M** (via `kokoro-onnx`, Apache-2.0) | Local text to speech, 54 voices | **Adopted as the default voice** | About 3× faster than real time on CPU, no quota, commercial-safe. HyperFrames uses it automatically with `HYPERFRAMES_PYTHON` pointing at a venv that has `kokoro-onnx`. Best-graded voice: `af_heart`. |
| **Parakeet TDT 0.6B v3** (CC-BY-4.0, via `hyperframes models install parakeet`) | Local speech recognition with word timestamps | **Adopted for caption timing** | Transcribes 10 s of audio in about 12 s and normalizes numbers ("nineteen seventy-seven" becomes "1977"). It mishears names, so correct the caption words in `audio_meta.json`; the timings stay. |
| **Hypit** (hypit-ai/hypit, modified Apache-2.0) | Skill and CLI that clone a video's production recipe into SVML compositions anchored to words | **Installed and reviewed, use for format cloning** | The licence allows use for our own channel. It forbids hosting it as a multi-tenant SaaS or reselling it. Its strong mode is generation-model-driven (HypiHub or our own provider keys); code-rendered mode works without models. Use it when the user wants a specific viral format replicated. |
| **VoiceStudio** (debpalash/VoiceStudio, AGPL-3.0) | Local ElevenLabs alternative with GUI, API and MCP. Default engine is OmniVoice | **Not for monetized work** | The OmniVoice code is Apache-2.0, but **the model weights are CC-BY-NC** (training data). It runs on CPU in a separate venv (torch 2.8): 8 s of speech takes 36 s at 16 steps, with good voice design and inline `[laughter]`/`[sigh]` tags. Fine for tests and non-monetized drafts. Clone voices only with permission. |
| **Hindsight** (vectorize-io/hindsight, MIT) | Agent memory server (Docker plus an LLM key) | **Not now** | Our durable memory is this repo (README handoff plus research files). Revisit when an always-on agent needs long-term memory. |
| **ArtCraft** | Rust desktop apps replacing Adobe tools | **Not applicable** | Desktop GUI apps; nothing to drive headless here. |
| **REA** (morluto/rea) | Reverse-engineering assistant | **Ruled out** (as before) | Adobe's terms forbid reverse engineering (section 17(B)), and Higgsfield has no client to inspect. |
| **MusicGen** (offered by `hyperframes doctor`) | Local music model | **Not for monetized work** | Weights are CC-BY-NC-4.0. Synthesized scores (numpy) are used instead. |
| **ACE-Step 1.5** (from the Jad M.H video, code and weights MIT) | Local song and score generation | **Adopted as the music option** | Tested on this CPU: turbo DiT + VAE + text encoder + 0.6B LM is 7.7 GB. With bf16 (the CPU has AMX), a 75 s instrumental takes 4 to 5 min, mostly VAE decode. Structure tags set the order of sections but not their timing, so generate 3 or more seeds and keep the nearest, then fix timing with gain automation (or try its untested repaint task). Driver and prompts: `tools/acestep/`; install with `WITH_ACESTEP=1` in the setup script. Demo 3 has an alternate mix that uses take 2. |

## The production loop that worked (demo Short 3)

1. **Brief.** HyperFrames `/hyperframes` routes the work to `/faceless-explainer`. `BRIEF.md` is reviewed before anything is generated.
2. **Design.** Choose one frame preset (here `broadside`), and keep a ban list of looks already used.
3. **Storyboard and script.** Time the script with Kokoro first, so narration fits the target length with room for pauses and a held ending.
4. **Audio.** `audio.mjs` runs Kokoro and Parakeet. Fix caption words, then sync durations and add a 0.5 s tail to every spoken frame so lines don't run back-to-back (the choppiness of demo 1).
5. **Frames.** Dispatch one agent per frame, in parallel, from `.hyperframes/frame-packets/`. Make fonts local afterwards: workers otherwise reach for Google Fonts.
6. **Assemble.** Build captions, assemble the index, then inject and verify transitions. Add a global overlay track and the host score and sound effects (`tools/score.py`, pre-ducked under the voice by `tools/duck.py`).
7. **Gates.** `lint` must show 0 errors and `check` must pass. Then run the **scored contact-sheet critique loop** from Jad M.H: score every shot 1 to 10, fix the 3 worst issues, and repeat until everything is 8 or above (at most 4 rounds).
8. **Render and master.** Run `npx hyperframes render`. Remix the stems with the score about 10 dB under the voice, convert to **stereo**, then `loudnorm` to -14 LUFS / -1.5 dBTP. A mono master reads about 3 dB quieter under EBU R128.

## Gotchas

- Root background: assemble uses `frame.md`'s canvas colour. On dark-register films set it to the dark ground, or crossfades flash pale.
- The caption script holds the last caption group until the end of the video. Patch `isLast ? DURATION` so the ending is clean.
- `letterSpacing` tweens are a lint error, because they snap under frame-by-frame capture. Animate transforms instead.
- Frame ids that start with a digit trigger hundreds of cosmetic `id_requires_css_escape` warnings. Workers use `[id="…"]` selectors, so they render fine.

## Gemini watch efficiency test (2026-10-21)

The question was whether longer segments in `watch/watch_all.py` (`--segment`, default 480 s) cut free-tier requests without breaking on the agent proxy. Twelve pending videos were run with `--workers 1`, models ordered best first, from 07:22 UTC, just after the daily quota reset.

**Result: all 12 videos are complete.** Nine are whole-video single requests at `--segment 1200`. The two Dan Kieft videos ran at `--segment 600`, and kvf2lRSGixg finished at the default 480 s using its cached first segment.

| | Before (480 s segments) | Now |
|---|---|---|
| Successful requests, the 9 videos of 7.5 to 19.8 min | 19 (2.1 per video) | **9 (1 per video)** |
| Successful requests, all 12 videos | 28 | **18** |
| All HTTP requests sent, including failures | not logged | 72 (53 at 1200 s, 15 at 600 s, 4 at 480 s), plus 2 probes |
| Wall time | not comparable | 41 min for 9 videos, 7 min for 2, 1 min for 1 |

**Wall time is mostly backoff.** A successful request streamed in 16 to 45 s, even for a whole 19.8-minute video. Most of the 49 minutes was the runner's growing retry sleep (15 s × attempt) after 502s and 503s.

**Long segments survive the proxy, mostly.** No stream was truncated: there were zero "ended without STOP" lines. Every failure was one of three kinds:
- **502 Bad Gateway at exactly 30 to 31 s** (18 times). This is the proxy's 30-second no-bytes cutoff firing because Google had not sent response headers yet. It is not about segment length. A two-word text prompt to gemini-3.8-flash and gemini-3.7-flash also returned 502 after 30.4 s.
- **503 "high demand"**, either as an HTTP status or inside the stream (30 times).
- **Daily-quota 429s.**

Length still matters at the edge. The 20.5-minute video (2hJsvDSPWYM, 1227 s, run whole because it is under the segment plus 60 s) got six 502s at 1200 s. At 600 s it went through after two more, and its other segments passed first time. So 1200 s worked for videos up to 1187 s, and 600 s is the fallback.

**Models on the free tier** (key via the network secret):

| Model | Outcome |
|---|---|
| gemini-3.6-flash | **Worked**: 5 videos, then 429 |
| gemini-3.5-flash | **Worked**: 3 videos, then 429 |
| gemini-3-flash-preview | **Worked**: 1 video, mostly 503s |
| gemini-3.5-flash-lite | **Worked**: 9 segments (the Dan Kieft videos and kvf2lRSGixg) |
| gemini-3.8-flash, gemini-3.7-flash | Listed by the models endpoint, but never answered within 30 s (502s and 503s). Both then returned daily-quota 429s, so **requests that 502 at the proxy still seem to count against the quota.** |
| gemini-3.1-flash-lite | Only a 503; untested |
| gemini-2.5-flash | **404**, "no longer available to new users" |

The daily 429s arrived after only 4 to 8 non-503 requests per model, well under the "about 20 a day" noted earlier. Whole-video requests probably count against a token quota as well as a request count. This is an inference, not a published limit.

**Detail drops with segment length.** Median report length fell from **160 words per video-minute** at 480 s (19 earlier videos) to **73** at 1200 s (the 9 whole-video runs; the range was 535 to 1,730 words per video). The 600 s Flash-Lite segments ranged from 352 to 3,233 words. One long prompt screen came out nearly verbatim, while one segment degenerated into a long list of invented app names. Whole-video reports still caught the key on-screen prompts, settings and numbers. They miss more of the incidental UI.

**What to use from now on:**
- **Talking-head or demo videos up to about 19 minutes:** `--segment 1200`. It roughly halves quota use.
- **Prompt-heavy screen recordings, or anything over about 20 minutes:** `--segment 600`.
- **Order:** keep Flash models ahead of Flash-Lite, and treat Flash-Lite output as thinner and less reliable.

**Runner changes made in this test:**
- Failed attempts are now logged with model, elapsed seconds and error.
- A 503 delivered inside the stream now cools that model for 2 minutes, as an HTTP 503 already did, instead of retrying it straight away.

**Paid tier would remove the quota juggling.** At about 100 tokens per second of video at the default low media resolution, a 15-minute video is about 90k input tokens. At $0.30 per million (Flash-Lite) to $0.75 per million (Flash, prices through 2026), that is about **$0.03 to $0.07 per video** plus a few thousand output tokens. All 12 videos here (3.2 hours) would cost roughly $0.35 to $0.90. `watch_all.py` does not set `mediaResolution`; set it to low explicitly before relying on that estimate.
