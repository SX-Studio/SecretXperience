---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The most famous signal ever caught from space lasted 72 seconds, and never came back."
destination: youtube-shorts
aspect: 1080x1920
language: en
audience: curious general viewers scrolling Shorts / TikTok / Reels
length: 72s
angle: narrative
voice: af_heart
style_preset: broadside
---

## Intent

A vertical Short about the 1977 "Wow!" signal whose runtime is exactly the signal's own 72 seconds; the
hook says so, and a thin 72-second "beam transit" bar runs along the frame the whole time, rising and
falling like the signal did. Tone: hushed, cinematic, awe without hype. Never claims aliens. The user
asked to be impressed, wants endings that breathe (no choppy finish), and wants every prompt and brief
reviewed before generation.

## Customizations

- Code-rendered recreation of the Big Ear printout column with the circled "6EQUJ5" (no photo of the real
  printout is used; it is labelled a recreation).
- Intensity-code data-viz: 0-9 then A-Z mapped to bar heights; U = 30.
- 72-second transit curve that rises and falls (the antenna pattern), synced to the real runtime.
- Word-timed captions from local Parakeet ASR.
- Original synthesized score: hydrogen-line drone, sparse radio static, one swell; ends on a long tail.

## Notes

- Local, quota-free, commercial-safe stack only: HyperFrames (Apache-2.0), Kokoro-82M (Apache-2.0),
  Parakeet TDT 0.6B v3 (CC-BY-4.0), numpy-synthesized audio. No MusicGen / OmniVoice (CC-BY-NC weights).
- Facts are limited to the well-documented record (see capture/extracted/visible-text.txt).
- Final card holds at least 3 s with a fade; narration must end by ~68 s so the 72 s close breathes.
