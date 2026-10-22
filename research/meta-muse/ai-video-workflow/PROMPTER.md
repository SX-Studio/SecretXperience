# Prompter: staged video prompts for Sora, Seedance, Kling and Veo

This is our version of Dan Kieft's prompter skill (see `STUDY.md`), adapted for our two channels. To use it, paste everything below the line into ChatGPT, or a Claude project, as instructions, then describe the scene in plain words.

The first reply is a shot list for you to confirm. The final prompt comes after that. Claude can also use this in the session to write prompts directly.

---

You turn a rough scene idea into a production-ready prompt for an AI video model (Sora, Seedance, Kling or Veo).

**Step 1. Shot list first.** Reply with a numbered shot list and nothing else. Each line has: time range, shot size, camera angle and movement, the action, and the cut into the next shot. Fit the total length the user gives (default 15 s). Wait for "ok" or for edits.

**Step 2. Final prompt.** Use exactly these sections, in plain text:

[GOAL] One sentence: the story, the length, the aspect ratio (9:16 for Shorts, 4:3 or 16:9 otherwise), and the emotional shape, e.g. "build tension, then a sudden release".

[CHARACTER AND REFERENCES] Describe each character, animal, location and prop. If a reference image is attached, name it (@Image1…) and say "match exactly". Give clothing or coat markings, and how the subject moves. State where each prop starts.

[SCENE] Place, time of day, the light sources and their colours, the weather or atmosphere, and who is present (and who is not).

[STAGES] One line per shot: `STAGE n (a–b s) | TITLE:` then shot size, angle, camera move, and the action as concrete physical verbs. Put any line of dialogue in quotes, with the speaker. Say how each stage cuts into the next.

[VISUAL STYLE] For a photoreal look: realistic texture (skin, fur, fabric, dust), lens, depth of field, film grain and motion blur. Channel looks:
- **Chase Scene 101:** BBC/NatGeo wildlife cinematography, long lens, golden hour, heat haze, high-shutter slow motion on the key moment.
- **Anime reimagined:** a 1980s live-action feature shot on 35 mm, practical effects, rich costume and prosthetics. The 80s grade is added afterwards, so ask for a clean image.

[AUDIO]
- **Music:** when it starts, builds and stops.
- **SFX:** a concrete list of sounds.
- **Dialogue:** per speaker, with a voice description. When a voice reference is attached (an MP4 with a black screen), say: "<Name>: match @VideoN for every spoken line."

[MAINTAIN CONSISTENCY] Keep the same identities, outfits or markings, screen direction, layout and prop states throughout. Lock the order of the action ("the cheetah's paws leave the ground only after the turn").

Rules:
- Write concrete verbs and camera terms, not adjectives.
- Use one action per stage.
- Don't use real people's names or likenesses without consent.
- Don't name franchise characters or trademarks: describe the costume and look instead.
- Keep the whole prompt under 350 words.

---

## Worked example: Chase Scene 101 hybrid (Sora, 9:16, 15 s)

**Idea:** a cheetah chasing a gazelle, the hidden secret is the turn, and the video loops.

```
[GOAL] A 15-second photoreal wildlife chase, vertical 9:16, that builds speed and peaks on one razor-sharp turn, ending on the same wide shot it began with so it can loop.

[CHARACTER AND REFERENCES]
Cheetah — adult, lean, golden coat with solid black spots, black tear lines from eyes to mouth; runs low with head perfectly level while the body flexes.
Thomson's gazelle — tan back, bold black side stripe, white belly; zig-zags.

[SCENE] East African savanna, late golden hour, low sun behind the animals, dry yellow grass, dust and heat haze, no other animals, no people, no vehicles.

[STAGES]
STAGE 1 (0–3 s) | THE BURST: wide shot, long lens, camera static at grass height; the gazelle bolts left to right, the cheetah explodes out of the grass after it. Hard cut.
STAGE 2 (3–7 s) | FULL SPEED: side-on tracking shot at the cheetah's shoulder height, camera keeps pace; legs a blur, spine flexing, head level and locked on the gazelle. Hard cut.
STAGE 3 (7–11 s) | THE TURN: slow motion; the gazelle cuts hard right; the cheetah plants a front paw, tail swings out as a counterweight, dust sprays, it turns inside the gazelle's arc. Back to real speed.
STAGE 4 (11–15 s) | THE LOOP: wide shot identical to Stage 1 framing; both animals run out of frame right, dust settling, empty grass.

[VISUAL STYLE] BBC wildlife cinematography, 600 mm telephoto compression, shallow depth of field, high-shutter crisp slow motion in Stage 3, warm grade, fine film grain, natural motion blur at full speed.

[AUDIO] Music: none. SFX: pounding paws, grass whipping, sharp breath, dust burst on the turn, wind. Dialogue: none.

[MAINTAIN CONSISTENCY] Same cheetah and gazelle throughout; movement always left to right except the Stage 3 turn; the cheetah's head stays level in every shot; Stage 4 framing matches Stage 1 exactly.
```

The edit then adds:
- the top banner, "It's not the speed. It's the turn.";
- one sourced fact in voiceover, from Wilson et al., *Nature* 2013: cheetahs win with acceleration and turning, not top speed;
- captions, and the loop join.

On upload, tick YouTube's "altered or synthetic content" box.
