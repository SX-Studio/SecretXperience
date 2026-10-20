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
| **ACE-Step 1.5** (from the Jad M.H video) | Local song and score generation | **Licence OK (weights MIT), CPU trial in progress** | Checkpoints are large (the tutorial's full set was 33 GB; Turbo plus the small LM is the minimum). See the results note when the trial lands. |

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
