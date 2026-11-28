# Ep7 remake: pre-publish QA report

Two review passes: (1) per-shot contact sheets (65 shots × 2 stills, three rounds) plus automatic gates; (2) a full watch-and-listen of the render (`watch-video`, a frame a second plus every cut, with spectrogram/loudness/pitch).

## Automatic gates (every 0.25 s, all 213 s)
| Gate | Result |
|---|---|
| Joints / anatomy (hand inside head, bent limbs) | 1 single-frame blip (Ana's waving hand, 1:31.5); checked by eye, acceptable |
| Faces overlapping | 2 single-frame blips (customer walking past YOU at 1:07.5; cut boundary at 2:13.75, Ana alone on screen = false alarm) |
| Face under captions | pass |
| Head cut at the top of frame | pass |
| Scene order (no shot of scene N after scene N+1 starts) | pass (three label-only items: beats that sit in the gap before the next line, by design) |
| Loudness | −14.1 LUFS integrated (two-pass loudnorm on the final file) |

## Found by eye and fixed
**Pass 1 (contact sheets)**
- **Everyone wore the same purple costume:** a key collision in the director overwrote each actor's look. Fixed; all ten costumes now render.
- **Customer standing on open water** beside Finn's boat → she stands and walks on the jetty.
- **You and Ana sitting on air** at the café table → the director now draws a stool under every seated hip, automatically, for all future episodes.
- **"Long" hair drawn in front of the face** (rig layering bug) → back hair now sits behind the head. Nia's style also hid her eyes, so she's now in an afro.
- **Fountain covering Nia and the final group; plant covering Ana's face; van hiding YOU and Mo** → re-blocked.
- **Weather clouds sinking into heads or sitting off-frame** → the cloud sits above the hair (with headroom for buns and hats), shrinks to fit, and only then moves beside the head, away from the frame centre. Ana's storm shots were reframed for headroom.
- **Three scene overlaps** (a shot of the previous scene played after the next began) → scene tails added to the timeline.
- **Sliding instead of walking** (four moves) → walk cycles on.
- **Kai swinging with no hammer** → hammer prop.
- **Phone text overflowing** → wraps to two lines.
- **Saturday props leaking into the ending** → put away.

**Pass 2 (full watch of the render)**
- **Wrong number in the captions:** the ASR wrote "twenty" as "2" ("about 2 strangers"), and Kai's "a van" as "of ham". Captions and the .srt now use the **script spelling on the ASR timing** (`tools/script_words.py`). The one exception is Mo's opener, where the voice said "how you doing?".
- **The list ticked 19 names** → **three ticks** (Theo, Mo, Kai), seventeen untouched, as on the scene card. The tick sounds match.
- **The crowd's weather never appeared in the opening** (the SC03 town crowd re-used the same extras and overwrote their weather) → weather now comes in layers per scene.
- **Captions over the boat's painted name** → the camera rises in those shots.
- **YOU standing in the fountain** → beside it.
- **YOU crying before Ana says anything; Nia crying during the takeaway** → hopeful / determined. The tears stay only in SC11, the release.
- **Three long static shots** (lighthouse, town wide, Nia) → slow pushes.

## Research wording (locked to RESEARCH.md)
J1, J3, J4, H1, n22, J5 and n28 are verbatim from SCENE-CARDS.md / RESEARCH.md. "Ask one more time" is labelled as our suggestion in the description.

**Pass 3 (your note: "the start was a little weird")**, from a frame-by-frame look at the first 14 s (every 0.25 s):
- **"How you doing?" → "Me too!" answered nothing:** YOU's only reply was a silent thumbs-up. YOU now answers in a **"Fine!" speech bubble** (YOU never speaks aloud), which pops right after the question and before "Me too!", so Mo's "Me too!" lands, and the lie is planted in the first two seconds.
- **YOU froze in the flinch for 5 s** (one leg in the air through the next shot) → the flinch now relaxes after 0.75 s.
- **The crowd reveal opened on a stranger's half-cropped face** → it now opens on YOU's face, and the foreground extras moved in from the frame edges.
- **Ana's box stack walked through the fountain** → she crosses on the open side.
- **"Except yours." showed a tiny "?" in an empty sky** → the dashed "?" cloud over YOU's spot is 2.2× bigger.
