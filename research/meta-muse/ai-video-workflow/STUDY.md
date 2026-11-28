# Study: Dan Kieft, "How To Start Making AI Videos in 2026 (Beginner Guide)"

Video: https://youtu.be/iO9MiefIpVM (26:42). Studied 2026-10-22 with Gemini, which watched it in seven 4-minute segments and then re-read the on-screen UI at four timestamps at high resolution. The raw notes are in `forensics/`.

**Sponsor.** Higgsfield sponsors the video (he says so at 02:10), so the platform choice is sponsored. The workflow itself works on any platform.

## The workflow in one line

**Ideation → Assets → Video → Edit.** Images are cheap and video is expensive, so all the iteration happens on still images.

> "Generating images are cheap. Generate many of them so you get the exact result that you want. Generating videos is expensive, so you want to make sure that you have all of the right ingredients when you start making your videos."

This is the same image-first order we found in the anime study (`../anime-reimagined/STUDY.md`). Two independent sources now agree on it.

## Step 1: Pick a platform that gives you many models

His advice is not to lock into a subscription that only offers one video model, because the best model changes every few months. He recommends Higgsfield, the sponsor, which aggregates many models.

Models visible in the Higgsfield menus (read from screen at 02:16, 12:00 and 16:51):
- **Image:** Higgsfield Soul 2.0, Soul Cinema, AI Cast, Cinematic Locations, GPT Image 2.5 Sunburst / Flare, Nano Banana 2.1 / Pro, Seedream 5.0 Pro, FLUX.3 Image.
- **Video:** Seedance 2.5 (also Draft and Edit), Seedance 2.0 / Fast / Mini, Kling 4.0, MiniMax H3 / H3 Max, Gemini Omni Flash 1.1, FLUX.3 Video.
- **Motion transfer:** Higgsfield Genjutsu (motion transfer and object swap).

## Step 2: Assets (the step that decides quality)

> "Bad assets = bad videos = wasting credits."

### Character sheet

A three-panel sheet: full body front, full body back, and a chest-up face close-up, on flat 18% grey. His template, verbatim:

```
A three-panel character reference sheet composed as one horizontal image, divided into three equal vertical panels side by side with thin clean separations. The same person in the same outfit, rendered identically in all three panels. No text, no labels, no numbering anywhere in the image.

The face comes from the attached reference and must match it exactly in every panel: same face shape, bone structure, eyes, brows, nose, lips, skin tone and hair.

CHARACTER: [build and height, body type, hair color, length and styling, makeup, piercings, tattoos, nails, overall vibe]

OUTFIT: [full outfit head to toe: top, bottom, shoes, jewelry, accessories, with colors, fabrics and fit]

LEFT PANEL: -- full body front view. The figure stands squared to the camera, framed from above the head down to the shoes, arms relaxed at the sides, weight even on both feet. The full outfit is clearly readable.

CENTER PANEL: -- full body back view. The complete figure from above the head down to the shoes, seen directly from behind, standing straight. Hair, back of the outfit and shoes are clearly readable.

RIGHT PANEL: -- tight chest-up face close-up. Framed from just above the head down to the collarbones, the face filling the panel, looking straight at camera, neutral relaxed expression, lips closed. Maximum facial detail.

Skin tone is identical in every panel, never darker or tanned on the back view.

The background is one flat 18% neutral gray field, identical in all three panels, with no gradient, no floor, no wall and no vignette. Flat shadowless frontal lighting, even on both sides of the face, no cast shadow under the feet and no shadow on the background. Realistic skin with fine soft pore texture and a matte finish, real hair strands, real fabric texture, never plastic, never CGI. Even sharpness everywhere, no blur. Photographed on a 50mm prime, soft natural film grain. Photographed not generated.
```

How he fills it:
1. He pastes the template into ChatGPT.
2. He describes the character out loud, using Wispr Flow for dictation, and optionally attaches a reference photo.
3. He asks: *"Edit my prompt formula in the [CHARACTER] and [OUTFIT] with this context and return to me the full prompt."*
4. He generates the image at 16:9 and 2K, and compares Seedream 5.0 Pro, Nano Banana Pro / 2.1 and GPT Image 2.5 on the same prompt.

### Location sheet

He names the camera framing, the time of day, the props and what must be absent. Example: *"3/4 wide-angle view of an empty back alley in the morning with numerous colorful graffiti and a single bright yellow Porsche in the middle of the alleyway, no people, only a single car."* Without "3/4 wide-angle", one model chose a side view instead.

### Prop or object sheet

Two views on mid-grey: *"Two views of the same object: FRONT view on the left of the frame, and topdown view on the right. Both centered, same scale. Flat seamless mid-grey background."* GPT Image 2.5 was the model that rendered text on the prop correctly.

### Why grey and not white

> "If you do white, sometimes it tends to be overexposed when using as a reference … Grey is a neutral tone that doesn't give that overexposure."

## Step 3: Video (reference-to-video with a staged prompt)

He shows two modes: text-to-video, and reference-to-video, which "gives you the most control". In reference-to-video you attach the sheets as `@Image1…6` and the voices as `@Video1…2`.

### The prompt structure he uses (an LLM "prompter" skill fills it in)

```
[GOAL]  one-sentence story + length + the emotional shape ("build tension during his approach, then finish with a quiet, confident moment")
[CHARACTER AND REFERENCES]  each character/location/prop -> which @Image, what it wears, how it moves; "Starts inside Dan's right jacket pocket" (where props begin)
[SCENE]  place, time, light sources (blue screens + warm emergency light), haze, who is present
[STAGES]
  STAGE 1 (0-4 s) | THE APPROACH: shot size + angle + camera move; action; "Cut ... to close-up of feet"
  STAGE 2 (4-6 s) | ...
  STAGE 3 (6-8 s) | ...
  STAGE 4 (8-15 s) | ...: dialogue line in quotes, the exact action order
[VISUAL STYLE]  "Photorealistic ... realistic skin, fabric, metal ... shallow depth of field, subtle film grain, natural motion blur"
[AUDIO]  Music (when it builds / stops), SFX list, Dialogue lines per speaker + voice description
[MAINTAIN CONSISTENCY]  faces, outfits, screen direction, room layout, props; "Machine shuts down only after button press" (lock the action order)
```

He keeps this format in a `SKILL.md` ("seedance-2-5-prompter") uploaded to ChatGPT under Customize → Skills. He gives it away through his free Skool community. For a long idea he first asks the skill for **a shot list (camera angle + movement) to confirm**, and only then for the final prompt.

### Draft first, then 1080p

Prices read from the screen:

| Model and settings | Credits |
|---|---|
| Seedance 2.5 Draft, 480p, 12 s | 36 |
| Seedance 2.5 Draft, 480p, 30 s | 90 |
| Seedance 2.5, 1080p, 15 s | about 180 |
| Seedance 2.5, 1080p, 30 s | 360 |

> "1080p is the only one that's worth it if you actually want to use these videos somewhere."

His point on iterating: *"you don't just want to use the first result … this might take you like two or three tries."*

### The voice fix

On the first 30 s generation, the motion was fine but the voices were wrong: the big gangster "sounded like Vin Diesel". The fix:
1. Record the lines yourself in Audacity or a phone recorder.
2. Export each one as an **MP4 with a black screen**. He found this holds the voice more consistently than an MP3.
3. Attach the files as `@Video1` and `@Video2`.
4. Add to the prompt: "Dan: match @Video1 for every spoken line."

### Aspect ratios

The menus offer 1:1, 9:16, 16:9 and 3:4, so the same workflow can make Shorts natively.

## Step 4: Motion transfer (the advanced trick)

Higgsfield Genjutsu in motion-transfer mode, at 720p for about 119 credits:
1. **Film yourself** doing the action.
2. Attach the character sheets.
3. The model swaps you for the characters and keeps your exact motion.

He stresses filming your own footage rather than taking someone else's, both for quality and for originality.

## What it costs

These are our estimates from Higgsfield's public pricing, which secondary sources disagree on, so check the official page.
- **Plans:** reported at $19 / $47–59 / $99–129 per month for 270 / 1,200 / 3,000 credits. One credit is roughly $0.047–0.0625. Monthly credits don't roll over.
- **Per 30 s 1080p Seedance clip:** 360 credits, about $17–22. Two or three drafts add about $5–7, so a finished 30 s scene costs about **$20–30**.
- **The $59 Plus plan** covers about three finished 30 s scenes a month. That is fine for a Short series but too thin for a 6-minute anime episode, which would need about 12 scenes, roughly $250–350.

Sources:
- [Creatify, "Higgsfield pricing (2026)"](https://creatify.ai/blog/higgsfield-pricing-(2026)-plans-and-what-you-ll-actually-pay)
- [Luma Labs, "Higgsfield pricing"](https://lumalabs.ai/news/higgsfield-pricing)

A pay-per-use API such as fal.ai, with no subscription and no expiring credits, can be automated from this container. That makes it the better fit for the automation goal once volume is known.

## How this applies to our channels

1. **Use the staged prompt with Sora, which the user already has.** The structure is model-agnostic. Every Sora prompt we write follows it: GOAL, references, scene, timed stages, style, audio, consistency. `PROMPTER.md` is our version of his skill, tuned for both channels.
2. **Chase Scene 101 hybrid.** A 15–25 s Sora chase written as three or four timed stages, plus our banner, the fact narration and the loop. This needs one generation per Short. Use 9:16 natively.
3. **Anime reimagined.** This is his asset-first pipeline exactly:
   - character sheets for each live-action version of the cast;
   - a location sheet per set;
   - reference-to-video per scene;
   - our 80s film pass (`../anime-reimagined/tools/film80.sh`).

   The **black-screen MP4 voice reference** answers the open "character voice" question. The user, a friend or a commercially licensed TTS voice records the lines, and the video model performs to them.
4. **Originality.** His examples are original skits with his own face, not IP. That is also the YouTube-safe route. It strengthens the IP warning in the anime study.

## Weak points and caveats

- He never shows a failure in detail, and the sponsor shapes which tools appear.
- Gemini read some model names differently across passes; for example, the first pass said "Kling 3.0" and the high-resolution pass said "Kling 4.0". The names above are taken from the high-resolution re-read. Treat the version numbers as approximate.
- Credit costs come from the Generate buttons on screen. They are Higgsfield's prices and may change.
