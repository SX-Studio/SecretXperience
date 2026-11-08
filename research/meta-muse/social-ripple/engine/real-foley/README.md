# Real foley library (2026-11-02)

The user's feedback on demo 1:
- the grass stomping was too loud;
- cobblestone steps should sound like real steps;
- every interactive sound (steps, eating, drinking) should be realistic, not playful.

So interactive sounds are now **real recordings**, not synthesis. Synthesised sounds stay only for UI ticks on word cards.

## Not game audio

We do not rip sounds from Fortnite, Minecraft or any other game. Epic and Mojang/Microsoft own that audio. Using it inside a monetized, non-gameplay video risks Content ID claims, strikes and demonetization.

Real recordings of real eating, drinking and steps give the same satisfying feel and are safe to use.

## Sources and licences

| Files | Source | Licence | Credit needed |
|---|---|---|---|
| `oga_grass_*`, `oga_wood_*`, `oga_boots_*` | "Footsteps on different surfaces", congusbongus, OpenGameArt; derived from freesound recordings by swuing | CC-BY 3.0 | Yes. See `LICENSE-oga-*.txt` |
| `oga_gravel_*` | Same pack; derived from Ali_6868 (freesound) | CC0 | No |
| `cobble_*` (clean single footfalls), `stoneA_*`, `stoneB_*`, `grassR_*`, `grassT_*`, `chip_*`, `crunchR_*`, `crispR_*`, `pave_*` | Mixkit (sliced from "Footsteps on stones loop", "Walking on stones loop", "Walking on grass", "Footsteps on tall grass", "Human eating a potato chip", "Eating and biting crunchy food", "Human eating delicious crispy food") | Mixkit Free SFX licence (commercial use OK; not committed, rebuild with `tools/fetch_mixkit.sh lib`) | No |
| `mk_1307` sip of water, `mk_3207` soft slurp, `mk_2832` satisfied drink voice, `mk_2828` game potion drink | Mixkit | Mixkit Free SFX licence | No |

**Description credit line** (whenever an `oga_*` file is used):

> Footstep sounds: "Footsteps on different surfaces" by congusbongus (OpenGameArt), from recordings by swuing (freesound.org), CC-BY 3.0.

## Tools

- `tools/slice.py SRC OUTDIR PREFIX GAP LEN THRDB N` cuts one-shot sounds out of recorded loops. It finds energy onsets, keeps peaks within 0.5–1.8× the median and applies short fades.
- `tools/mix_demo_real.py` is the demo 1 v2 mix. It shows the balance rules below.

## Balance rules

| Sound | Rule |
|---|---|
| Matching | Loudness-match every one-shot on its loudest 60 ms first |
| Grass | About 8 dB under stone, low-passed around 3.5 kHz |
| Every step | Gets a low-passed copy (about 220 Hz) for body weight |
| Cobbles | Real shoe-on-stone recordings |
| Eating | A bite, then soft closed-mouth chews (low-passed at 1.6 kHz) |
| Drinking | A real sip, then a short slurp (about 0.55 s). No cartoon "ahh" |
| Placement | Foley sits 6 dB back, in the camera's perspective, with a 0.3 s outdoor air tail |
| Ambience bed | Always under the foley, so no step plays in a vacuum |

## Lesson from demo 1 v2

- Spiky clips (cobbles) peak far above soft ones (grass) once loudness-matched, and the final limiter then flattens them, so they vanish.
- Balance steps on **peak**, not RMS:

  | Surface | Raw-mix peak |
  |---|---|
  | Grass | about −13 dB |
  | Cobbles | about −10 dB |
  | Wood | about −8 dB |

- Footsteps should end up 12–20 dB above the gaps between them.
- Only use slices whose first 20 ms is the loudest, with no second footfall inside them.
