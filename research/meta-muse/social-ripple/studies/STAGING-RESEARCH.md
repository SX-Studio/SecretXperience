# Staging Research: Where Characters Stand, and Why

Research for Social Ripple, 2026-11-07. The problem: past episodes staged two characters side by side, in profile, at the same depth, mid-frame. That reads flat, hides who matters and gives the eye nowhere to travel. This doc covers placement, blocking and composition only; cut rate, punch-ins, captions and camera timing are in `VISUAL-ENERGY-RESEARCH.md`.

**Labels** (as in the visual-energy doc): **[CRAFT]** established practice, sourced · **[DATA]** a measured study result · **[OBS]** our own episodes/code/studies · **[INF]** our inference or chosen number. All geometry in §9 is [INF]: starting values to test.

**Geometry conventions** (match the engine: 1920×1080 SVG, ground ≈ y 820, captions at y 1000, camera `tf(depth)` with 1 = subject plane)
- `x` = face-centre position, fraction of frame width (0 = left). `eye` = eye-line height, fraction of frame height from top.
- `h` = head-to-toe height of a full figure (fraction of H); `hd` = head height when cropped.
- Layers/parallax: **FG 1.2 · SUBJ 1.0 · MID 0.6 · BG 0.3** (visual-energy doc §5).
- **Face safe zone:** readable faces stay inside x 0.08–0.92, y 0.06–0.80. Below y 0.82 belongs to captions.

---

## 1. Staging fundamentals

- **[CRAFT] One idea, unmistakably clear.** Thomas & Johnston: staging is "the presentation of any idea so that it is completely and unmistakably clear" ([SIGGRAPH](https://education.siggraph.org/static/HyperGraph/animation/character_animation/principles/staging.htm)). Write each shot's idea as one sentence ("Ana is scared to say it"), not "Ana and YOU talk".
- **[CRAFT] Silhouette.** Stage actions so they read in silhouette ([UW handout](https://courses.cs.washington.edu/courses/cse457/03sp/lectures/animation-principles.pdf)). This applies to the *group*: two same-depth profiles facing each other merge into one blob with a gap. Offset depth and height so each has its own outline.
- **[CRAFT] One focal point.** The eye can't process competing focal points ([3dsense](https://3dsense.net/blogs/what-is-staging-in-animation-guiding-the-viewers-focus)). Make the focal character the highest-contrast, most saturated element, near a thirds point, and the only thing starting to move. **Hitchcock's rule:** a thing's size in frame should match its story importance at that moment ([Eurographics WICED](https://diglib.eg.org/bitstream/handle/10.2312/wiced20171065/005-012.pdf)).
- **[CRAFT] Leading lines.** Block ranks line intensity: diagonal > vertical > horizontal ([*The Visual Story* notes](http://filmbooknotes.blogspot.com/2013/05/the-visual-story-by-bruce-block.html)). Aim the set's strongest diagonal, or a gaze or pointing arm, at the focal face.
- **[CRAFT] Eye trace across cuts.** You may keep the focal point in the same screen area, drift it, or jump it for effect ([storyboardart.org](https://storyboardart.org/storyboard-tutorials/film-editing-for-storyboard-artists/), [Artlist](https://artlist.io/blog/eye-trace-and-rule-of-six-editing/)). On a punch-in, line up the nearer eye with its previous position ([EditShare](https://editshare.com/blog/5-fundamental-editing-techniques/)). Between two shots of one subject, change size ≥20% and angle ≥30° or it reads as a jump cut ([CG Channel](https://www.cgchannel.com/2018/10/10-essential-tips-to-improve-your-cg-layout-work/)). **[INF]** Default: new focal point within 0.15 W of the old; jump >0.4 W only for a shock.
- **[CRAFT] Air and negative space.** Ghertner: "Leave air around the character. Let the scene breathe"; too tight "feels claustrophobic" (*Layout and Composition for Animation*, ch. 3, [Routledge excerpt](https://asset.routledge.com/fp-usermedia/uploadedFiles/Layoutandcompositionforanimationch3.pdf)). Empty space beside a figure can carry isolation ([StudioBinder](https://www.studiobinder.com/blog/what-is-negative-space-definition/)); the space *between* characters is itself a storytelling element ([FilmDaft](https://filmdaft.com/the-difference-between-positive-and-negative-space-in-film-and-art/)).

## 2. Composition

- **[CRAFT] Thirds vs centre.** Ghertner puts a single character "just to the left or right of center", the frame centre near one eye; push further out and the empty side feels like something should happen there ([Routledge](https://asset.routledge.com/fp-usermedia/uploadedFiles/Layoutandcompositionforanimationch3.pdf)). Thirds suit observational, narrative shots; centring suits direct address, confrontation, symmetry, authority ([Adorama](https://www.adorama.com/alc/?p=27042)). Bordwell/Thompson tie Wes Anderson's centred planimetric frames to deadpan humour and "awkward formality" ([Bordwell](https://www.davidbordwell.net/blog/2014/03/26/the-grand-budapest-hotel-wes-anderson-takes-the-43-challenge/)). **[INF]** Centre Nia, rule moments and comedy tableaux; everyone else on thirds.
- **[CRAFT] Headroom, lead room.** Minimal headroom; nose/lead room in the direction of gaze or travel; never crop at neck, knees or elbows ([CG Channel](https://www.cgchannel.com/2018/10/10-essential-tips-to-improve-your-cg-layout-work/)). Profiles need more look room than faces turned to camera ([LibreTexts](https://human.libretexts.org/Courses/City_College_of_San_Francisco/Video_Production_Handbook_I/08%3A_Video_Aesthetics/8.05%3A_Video_Composition)). Removing look room on purpose (staring into the near edge) creates unease.
- **[CRAFT] Frame within a frame.** Doorways, windows, hallways read as isolation, confinement or watching from afar; glass as separation or longing; sometimes as status ([StudioBinder](https://www.studiobinder.com/blog/what-is-a-frame-within-a-frame-definition/)).
- **[CRAFT] Layering and depth.** DreamWorks board notes: avoid "tight rope" floors, think three-point perspective, use FG/MID/BG/far BG, and grid the ground so characters don't float ([No Film School](https://nofilmschool.com/2013/09/storyboarding-tips-dreamworks)). Block contrasts **flat space** (actors parallel to the picture plane, moving parallel, no overlap: *our past default*) with **deep space** (actors along the depth axis, moving toward/away from camera, overlap, size change; warm/bright advance, cool/dull recede) ([notes](http://filmbooknotes.blogspot.com/2013/05/the-visual-story-by-bruce-block.html)). Rule of thumb: deep space for drama, flat for comedy; "stack characters front to back rather than side to side" ([storyboardart.org](https://storyboardart.org/storyboard-tutorials/different-camera-shots-in-film/)).
- **[CRAFT] Angles.** Eye level is the honest default "where most of your panels should live"; high angles make a character "smaller or watched", low angles "bigger, stronger, sometimes threatening"; Dutch tilt = something is off (storyboardart.org, same page). Cutting high↔low shows imbalance (CG Channel).
- **[CRAFT] Horizon.** Make it clearly high or clearly low; just off-centre looks accidental. Low horizon = sky, openness or exposure; high = ground, weight, being pinned down ([Neil Oseman](https://neiloseman.com/where-to-place-your-horizon/), [Contrastly](https://contrastly.com/how-to-purposefully-choose-the-horizon-placement-in-composition)). In wides the horizon mainly sets mood (Oseman).
- **[CRAFT + INF] Perspective rule for puppets.** On flat ground with an eye-level camera, the horizon is at a standing adult's eye height, so every standing adult's eyes sit on it at any distance (linear perspective). Moving a character back shrinks scale *and* lifts the feet toward the horizon by the same factor: `feetY = hz + (feetY_ref − hz) × s/s_ref`. Scaling while leaving feet on one ground line is why our depth looked fake. Low angle = horizon below the eyes; high angle = horizon above the heads.

## 3. Blocking, relationships, emotion

- **[CRAFT] Proxemics.** Hall: intimate 0–0.46 m, personal 0.46–1.22 m, social 1.2–3.7 m, public 3.7 m+, varying by culture ([Wikipedia](https://en.wikipedia.org/wiki/Proxemics)); film analysis maps them to shot scales, intimate = close-up to public = extreme long shot ([Senses of Cinema](https://www.sensesofcinema.com/2013/feature-articles/bodies-in-filmic-space-the-mise-en-scene-of-courtship-readiness-in-the-big-sleep/)). **[INF]** In body heights at equal depth (adult ≈ 1.6 m), measured silhouette-to-silhouette: intimate <0.3 h, personal 0.3–0.75 h, social 0.75–2.3 h, public >2.3 h.
- **[CRAFT] Height = status, level = equality.** Being "on top" reads as power ([No Film School](https://nofilmschool.com/give-characters-power-through-composition)); *Parasite* uses stairs for class, *Django Unchained* raises Django from seated to standing above the others as power reverses ([No Film School](https://nofilmschool.com/film-blocking-guide)). Same level reads as equals.
- **[CRAFT] Facing, turning away, entering a frame.** In *Shōgun*'s cliff scene Mariko sits at the frame edge "with her back to him", alone in her part of the frame, John below her; he moves into her frame and ends "back-to-back" beside her, and the relationship changes without a word about it ([No Film School](https://nofilmschool.com/blocking-not-boring)). *Marriage Story*'s advancing/retreating footwork mirrors the fight ([No Film School](https://nofilmschool.com/film-blocking-guide)). **[INF]** For our rig: *open* = 3/4 toward the other or camera, arms away from torso; *closed* = profile or turned away, arms held, head down; *rejection* = full back.
- **[CRAFT] Isolation: empty vs crowded.** Emptiness around a figure (*Punch-Drunk Love*, *Her*: [StudioBinder](https://www.studiobinder.com/blog/what-is-negative-space-definition/), [Fragrant Film](https://fragrant.film/journal/2025/3/11/the-power-of-negative-space-in-cinematic-storytelling)), or a crowded frame where one person is boxed into a sub-frame or behind glass (Tati's *PlayTime*, Wong Kar-wai's reflections: [Offscreen](https://offscreen.com/view/the-cinematography-of-isolation)).
- **[CRAFT/OBS] Barriers.** Doors, windows, glass separate people sharing a frame (StudioBinder). Our Yuji study proposed a long table split by fog [OBS]; [INF] add tables, the fountain, lamp posts, a curtain of rain.
- **[CRAFT] Blocking arcs.** Decide who holds power in each frame; every move needs a motivation ([No Film School](https://nofilmschool.com/film-blocking-guide)). **[INF]** Plan 3–4 discrete blocking *states* per scene, one per beat (reconciliation: far+closed → facing → near+open → level+touching; rupture: reverse). The last state must visibly differ from the first: that difference *is* the scene.

## 4. Screen direction, continuity, and placing YOU

- **[CRAFT] 180° line.** Keep cameras on one side of the line between characters. Following it orients; breaking it disorients and signals unease; bending it signals gradual change. Legitimate crossings: a camera move across the line within a shot, a neutral shot on the line, or an orientation-free cutaway. *Requiem for a Dream* crosses as a conversation sours ([StudioBinder](https://www.studiobinder.com/blog/what-is-the-180-degree-rule/)).
- **[CRAFT] Screen direction.** A walker who goes L→R then R→L appears to have turned back; most films track L→R, possibly felt as more "natural" ([Wikipedia](https://en.wikipedia.org/wiki/Screen_direction)). Directions can be given story meanings and flipped when the plot turns ([Making Comics](https://makingcomics.com/2014/02/08/anatomy-storyboard-part-2-continuity/)).
- **[DATA] Spatial agency bias.** In left-to-right reading cultures the agent tends to be imagined on the left; a goal shown L→R was judged more powerful and faster (Maass, Pagani & Berta 2007); the bias inverts in right-to-left cultures. But Dalmaso et al. (2023) found **no** dominance difference between left- and right-facing faces, and the mechanism is debated ([PeerJ](https://pmc.ncbi.nlm.nih.gov/articles/PMC10349552), [Frontiers](https://frontiersin.org/articles/10.3389/fpsyg.2021.625554/full)). A weak nudge, not a law.
- **[CRAFT] Eyeline, shot/reverse, OTS.** Match head size and eye height on the reverse; if the near shoulder sits camera-right, the far face looks camera-right ([Melies](https://melies.co/cinematic-techniques/framing/over-the-shoulder-frame), [Neil Oseman](https://neiloseman.com/composing-a-shot-reverse/)). OTS "solves eyeline logic automatically"; a "dirty single" says someone else is close, watching ([storyboardart.org](https://storyboardart.org/storyboard-tutorials/different-camera-shots-in-film/)). Pushing the two to opposite edges of a wide frame reads as a strained relationship (Oseman).
- **[CRAFT] Establish, re-establish, cheat.** Show the geography before closer coverage and re-establish when people move ([StudioBinder](https://www.studiobinder.com/blog/what-is-an-eyeline-match/)). Cheating (shifting a person or prop between setups to improve the frame) is free in 2D: nudge x or scale on a reverse so faces don't collide, keeping side of line and eye heights.
- **[DATA] What closeness and POV do.** Closer average shot scale in animated shorts predicted more mental-state references in viewers' retellings (Bálint, Klausch & Pólya 2016, N = 52, [VU](https://research.vu.nl/en/publications/watching-closely/)); close-ups raised Theory-of-Mind tendency for *sad* faces, not neutral ones (Rooney & Bálint 2018, N = 136, [Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2017.02349/full)). More POV shots raised emotional engagement but lowered narrative understanding (Jungbauer 2018, bachelor thesis, N = 194, [Tilburg](https://arno.uvt.nl/show.cgi?fid=146343); weak). Confessions filmed facing the suspect were judged more voluntary than equal-focus versions (Lassiter et al., [EurekAlert](https://www.eurekalert.org/news-releases/671698)): the face on camera is read as acting of its own accord.
- **[INF] Rules for YOU.**
  1. YOU lives on screen left facing right all episode: one line per scene, the "agent" slot, others enter from the right toward YOU.
  2. Progress = YOU moving L→R; retreat/doubt/home = R→L. Flip sides only at the midpoint reversal, and show the crossing on screen.
  3. When someone confides: OTS from behind YOU, so the viewer sits on YOU's shoulder and reads the other face.
  4. When YOU decides: face YOU (single or reverse OTS); the face on camera owns the choice.
  5. True POV at most 1–2 per scene, for discoveries, always followed by YOU's reaction.
  6. The YOU tag sits above the head, never over another face, and drops after its first two appearances in a scene.

## 5. Shot vocabulary and coverage

**[CRAFT] Sizes** (Ghertner's standards) with **[INF]** values for our big-headed rigs: extreme long shot, body shape with little detail (h ≤0.2) · long, full body (h 0.6–0.85) · medium, waist to top of head (hd 0.18–0.25) · close-up, top of chest to top of head (hd 0.4–0.55) · extreme close-up, eyes (eye band ≈0.3 H). Also: **two-shot**; **OTS** (near shoulder/head as FG frame); **POV**; **insert** (hands, prop); **reaction** (a character looking and responding); **cutaway** (away from the main action; also resets the line).

**[CRAFT] Using them.** Build wide → medium → close; the medium "plays the beat". Most boards sit on one distance for 6–8 panels; change size *where the story turns*. Overusing the two-shot "loses the tool that isolates someone emotionally" ([storyboardart.org](https://storyboardart.org/storyboard-tutorials/different-camera-shots-in-film/)). Avoid the reflex "wide then two OTS close-ups"; decide blocking first ([No Film School](https://nofilmschool.com/blocking-not-boring)). Reaction shots carry subtext via Kuleshov ([No Film School](https://nofilmschool.com/2015/08/how-wisely-using-reaction-shots-can-take-your-visual-storytelling-game-next-level)). End pushes on the eyes ([CG Channel](https://www.cgchannel.com/2018/10/10-essential-tips-to-improve-your-cg-layout-work/)).

**[INF] Pattern A: two-person emotional conversation (≈40–70 s, YOU + Ana)**
1. P1 establish (1.5–2.5 s): place, both figures depth-staged, social-zone gap.
2. P2 depth two-shot: small talk, bodies half-closed.
3. P3 OTS behind YOU onto Ana: her lead-in (her lines play on her face).
4. P4 YOU single: reaction (Kuleshov beat).
5. Insert: Ana's hands on a cup (a breath; cutaway).
6. Tighter OTS → clean CU Ana: the confession, held 2–4 s, push ending on the eyes.
7. Reaction CU YOU: silence; YOU's reply starts here (the decision shot).
8. Release wide, P10 end state: closer, level, open. Proof the relationship changed.

Shot size tracks emotional pressure: wide → medium → close at the peak, then one cut back to wide for release.

**[INF] Pattern B: one-character discovery (YOU, 5–8 s)**, built on Hitchcock's close-up → POV → reaction ([Soundstripe](https://www.soundstripe.com/blogs/what-is-the-kuleshov-effect)): medium on YOU doing something mundane (x 0.38) → eyes shift, 4–6-frame push to the eyes → POV/insert of the thing, centred, YOU's hand in FG → snap to reaction CU, nearer eye at the previous focal point → cut wide (P5 or P7) to show what the discovery means.

**[INF] Wide vs close.** Stay wide for comedy (timing reads in full bodies and flat space), isolation, geography, scale, "the whole island" beats. Go close when a feeling must be attributed to a mind (the Bálint data), a decision, a lie. Body-language changes (turning away, stepping back) need at least a medium.

## 6. Staging 2D cut-out puppets

- **[CRAFT] 3/4 beats profile.** Front and profile are the "flat" angles; 3/4 adds volume ([Dessindigo](https://dessindigo.com/en/blog/drawing-tutorial/drawing-three-quarter-view-face), [Tom Richmond](https://tomrichmond.com/sunday-mailbag-full-profile-or-3-4/26/08/2018)). Young board artists default to near-profile mediums and close-ups; angled cameras and diagonals fix it ([storyboardart.org](https://storyboardart.org/storyboard-tutorials/different-camera-shots-in-film/)). **[OBS]** Our paper rig is side-on; PRODUCTION.md already found seated figures read only from the side or at 3/4. **[INF]** Add a `turn` dial (0 profile, 0.5 3/4, 1 front): torso/far-shoulder scaleX 1→0.85, features slide toward the facing side, far eye 15–20% smaller, far arm tucked behind. The speaker gets turn ≥0.4; pure profile only for walking, nose-to-nose confrontation, comedy.
- **[CRAFT] Overlap, scale, parallax.** Overlap, size change and nearness to the horizon are depth cues (Block). The multiplane camera faked depth by moving flat layers at different speeds, borrowing from stage flats ([Wikipedia](https://en.wikipedia.org/wiki/Multiplane_camera)). Overlap is fine; aligned edges (tangents) merge shapes and flatten depth ([3dartist](https://3dartist.substack.com/p/the-art-of-tangents-mastering-intentional), [Ctrlpaint](https://Ctrlpaint.com/videos/avoiding-visual-tangents)). **[INF]** Near figure overlaps the far figure's body by 10–20% of its width, never its face. Near/far scale ratio 1.4–2.0 = "normal lens"; ≥2.5 = wide-lens drama; ≤1.2 = long-lens compression (pressure, intimacy). Each depth step also gets a value step: far layers 10–20% lighter and less saturated.
- **[INF] Characters per frame.** 1–2 acting characters; 3 at most with one clearly dominant (nearest, biggest, brightest). Beyond that, the rest are a group shape; group and label them logically, per DreamWorks ([No Film School](https://nofilmschool.com/2013/09/storyboarding-tips-dreamworks)).
- **[CRAFT] Cheap crowds.** Grey/flat silhouettes, re-tinted repeats, loops ([CG Wire](https://blog.cg-wire.com/background-characters-animation)). **[INF]** Three rows: BG (0.3) flat silhouettes h 0.12–0.18 in 2–3 tints; MID (0.6) simplified rigs h 0.25–0.35, idle loops with random phase; FG (1.2) backs of heads/shoulders h ≥0.9, cropped by the bottom edge, 20% darker. Only the subject has a full face and full colour.
- **[INF] Face readability: hard checks** (extend `qa_consistency.cjs`):
  1. Speaking or reacting faces inside the face safe zone.
  2. Face boxes never intersect each other, hands, props, bubbles or the caption band.
  3. No cut head tops wider than a CU; in a CU cut the crown, never the chin.
  4. No crops at neck, elbow or knee; crop mid-thigh, mid-upper-arm, mid-chest.
  5. Two characters' eye lines differ ≥0.04 H unless they are meant as equals.
  6. Gesture arcs stay outside face boxes; a hand on the face only as a deliberate held pose (≥12 frames).
- **[INF] Text.** Captions own y 0.85–0.97; the day counter/HUD goes in the top corner *opposite* the focal face; speech/thought bubbles sit on the speaker's look-room side, tail to the mouth; in a CU, move the bubble off the face or let captions carry the line. Broadcast practice likewise moves subtitles off a speaker's mouth or vital action while keeping positions as consistent as possible ([Ofcom/BBC guidance](https://www.ofcom.org.uk/siteassets/resources/documents/consultations/category-2-6-weeks/178126-review-of-access-services-code/associated-documents/provision-of-tv-access-services-guideline.pdf)).

## 7. Environment as storytelling

- **[CRAFT]** "A wide only works if the background tells the audience something real about the place" ([storyboardart.org](https://storyboardart.org/storyboard-tutorials/different-camera-shots-in-film/)).- **[INF] Place in 1–2 s:** one landmark silhouette (Crumb Café awning, the fountain) on a BG third, one MID activity (vendor, birds), one sound; the focal character stands where the strongest set line points.
- **[INF] Light:** the subject stands in the brightest pool, which also reads as nearest (Block); vignette edges 10–15%. When a character's state darkens, move them *out of the light*, not just re-grade the frame.
- **[INF] Weather and props relative to people:** rain/cloud *above* the person who feels it; sun *behind* the person who brings it; a table or fountain *between* characters at odds; a doorway framing the outsider; a bench where people end up level. Reuse one set piece as the episode's blocking barometer: the fountain is a barrier in act 1 and a shared seat in act 3.

## 8. Common amateur mistakes and fixes

| Mistake ([OBS] = ours) | Why it fails | Fix |
|---|---|---|
| Two profiles side by side, mid-frame, same depth [OBS] | Block's flat space; one merged silhouette; no focal point | P2 depth two-shot or P3 OTS; profiles only for confrontation/comedy |
| Everyone the same distance [OBS] | No overlap/size cues; "tight rope" floor | ≥2 occupied depth layers; scale+feet perspective rule; ratio ≥1.4 |
| Centred and static [OBS] | Dead space both sides, no look room, no change across beats | Thirds + look room; 3–4 blocking states per scene; centre only for address/comedy |
| Heads cut by frame [OBS] | The face is the information | Safe-zone check; crop only the crown, only in CU |
| Hands over faces [OBS] | Hides the expression channel | Gesture arcs outside face boxes; QA collision |
| Unclear who speaks [OBS] | Speaker and listener equal in size, angle, light | Speaker nearer/larger, turn ≥0.4, lit, pose onset on first word; listener profile/back, darker; bubble tail at mouth |
| One shot size for long runs | Monotony | Change size at every story turn |
| Accidental line crossing | Characters seem to swap | YOU home-left; cross only on screen |
| Tangents and twins (heads level, edges touching) | Shapes merge; stiff | Eye lines offset ≥0.04 H; separate silhouettes ≥0.02 W or overlap clearly |
| Text over faces | Channels fight | Caption band; HUD opposite focal face |
| Busy background behind a face | Focal point lost | Drop BG contrast/saturation behind the focal head |
| Floating characters | Feet don't match ground plane | Contact shadows; feetY from the perspective rule |

## 9a. Staging checklist (per shot)

1. The shot's one idea fits in one sentence.
2. Exactly one focal point: highest contrast and saturation, the only onset at that moment.
3. Focal face within 0.15 W of the previous shot's, or the jump is intended.
4. ≥2 depth layers carry content; scale and foot height agree with the horizon.
5. Near/far overlap 10–20%; no tangents, no level heads.
6. Speaker identifiable with sound off (size, turn, light, onset).
7. Every readable face in the safe zone, clear of hands, bubbles, HUD, captions.
8. No crops at neck/elbow/knee; no cut head tops wider than a CU.
9. Look room points where the character looks or moves.
10. YOU left, facing right, on the established side of the line (or the crossing is shown).
11. Shot size fits the beat: wide for comedy/isolation, close for minds and decisions.
12. Blocking state changed if the relationship changed.
13. Horizon and angle match who holds power.
14. The set says where we are; one set element frames or comments on the emotion.
15. Versus the previous shot of the same subject: size change ≥20%, angle ≥30°.

## 9b. Staging presets (implement as code)

All [INF] starting values. Position = (x, eye); FG/SUBJ/MID/BG = parallax layer; turn 0 = profile, 0.5 = 3/4, 1 = front; hz = horizon (fraction of H).

| # | Preset | Geometry | Camera / lens feel | Use / emotion |
|---|---|---|---|---|
| P1 | **establish** | Landmark BG at x 0.62–0.75; YOU MID x 0.30, h 0.22; other MID x 0.58, h 0.18 (deeper, feet nearer hz); FG frame element cropped at one edge | hz 0.38, eye level, wide; push 100→106% | Place, geography and the gap, in 1.5–2.5 s |
| P2 | **depth-two** | YOU SUBJ x 0.27, eye 0.36, h 0.95 (cropped mid-thigh), turn 0.4→R; other MID x 0.68, eye 0.36, h 0.55, turn 0.5→L; gap ≥0.25 W | Eye level (both eyes on hz 0.36); ratio 1.7 | Default conversation; replaces side-by-side |
| P3 | **confession-OTS** | YOU back of head + shoulder FG x 0.00–0.30, hd 0.45, cropped by left edge, 15% darker; Ana SUBJ x 0.66, eye 0.40, hd 0.22, turn 0.6→L; shoulder overlaps Ana's torso 10–15%, never her face | hz 0.34 (camera slightly above Ana's eyes); ratio 2.0 | Someone confides in YOU; vulnerability (Ana lower = exposed) |
| P4 | **you-single** | YOU x 0.36, eye 0.36, hd 0.28, turn 0.5→R; 0.6 W look room right; optional dirty edge of the other at x 0.95–1.0, FG | Eye level, normal | YOU's reaction or decision |
| P5 | **isolation** | One figure h 0.12–0.16 at x 0.25 (YOU) or 0.75; ≥70% empty; faces the near edge (no look room) | hz 0.75 (ground dominates) or 0.25 (sky dominates); pull 106→100%; −15% saturation | Loneliness, smallness, "nobody noticed" |
| P6 | **outsider-in-crowd** | Crowd rows (§6) filling x 0.35–1.0, facing away or each other; subject MID x 0.15, h 0.30, lit, facing R | Eye level, wide; crowd −40% saturation | Exclusion, social anxiety, the liking gap |
| P7 | **crowd-reveal** | Three rows; subject MID x 0.5–0.62, the only full-colour figure, the only one facing camera (or the other way), light pool behind | Tight on subject (hd 0.3) pulling wide in 18–30 frames, or a pan across rows with parallax | "You're not alone" / "everyone does it"; statistics as people |
| P8 | **power-low** | Dominant x 0.55–0.62, h 0.85, eye 0.22 | hz 0.80 (below knees = low angle) | Authority, threat, newfound confidence |
| P9 | **power-high** | Subordinate x 0.40, h 0.45, eye 0.55, lots of floor | hz above frame top (high angle), tilt 0–3° | Smallness, being judged; pair with P8, swap roles at the reversal |
| P10 | **closing-gap** (4 states) | S1: A x 0.15, B x 0.85, turned away (turn −0.2), different depths · S2: gap 0.40 W, facing · S3: gap 0.15 W, same depth, open · S4: overlap 5–10%, same eye line | Eye level; one shot per state or a 24–36-frame move | Reconciliation; run S4→S1 for rupture |
| P11 | **barrier** | Vertical set piece (door jamb, lamp post, rain curtain, table end) at x 0.47–0.53, width 0.04–0.08 W; characters x 0.25 and 0.75, turn 0.2 (closed) | Eye level, deliberately flat | Conflict, misunderstanding; payoff = barrier removed or crossed |
| P12 | **window-watcher** | Window/door frame 0.30–0.45 W wide, centred x 0.62; subject inside h 0.25; YOU dark FG silhouette x 0.10–0.25 | Eye level; outside the inner frame 20% darker | Longing, exclusion, eavesdropping |
| P13 | **discovery** | Pattern B chain: medium x 0.38 → eyes → centred POV/insert → reaction CU (nearer eye at previous focal point) → P5 or P7 | 4–6-frame snap to the eyes; wide only after the reaction | Learning the power; the research reveal |
| P14 | **narrator-address** | Nia x 0.50, eye 0.33, hd 0.25, turn 1; symmetrical set; props at lower thirds | Centred, eye level, planimetric | Rules, the research fact, "What if you could…" |
| P15 | **shared-view** | Two figures side by side facing the *same* way, backs 3/4 to camera (turn −0.6), x 0.42 and 0.58, same eye line, gap <0.3 h or touching; a view fills the upper 60% | hz 0.40, wide | Companionship, equality, endings: the one side-by-side that works (cf. *Shōgun*'s back-to-back) |

**[INF] Sequencing defaults.** Open on P1, play in P2/P3/P4, end in a P10 state different from the opening state. No more than 2 consecutive shots from one preset. Every scene puts characters in ≥2 depth layers. Power scenes get one P8/P9 pair. End on P15 mirroring an earlier P5/P11: the callback in staging form.

---

## Sources

- Staging principle: https://education.siggraph.org/static/HyperGraph/animation/character_animation/principles/staging.htm · https://courses.cs.washington.edu/courses/cse457/03sp/lectures/animation-principles.pdf · https://3dsense.net/blogs/what-is-staging-in-animation-guiding-the-viewers-focus
- Ghertner, *Layout and Composition for Animation*, ch. 3: https://asset.routledge.com/fp-usermedia/uploadedFiles/Layoutandcompositionforanimationch3.pdf
- Block, *The Visual Story* (notes): http://filmbooknotes.blogspot.com/2013/05/the-visual-story-by-bruce-block.html
- Hitchcock's rule: https://diglib.eg.org/bitstream/handle/10.2312/wiced20171065/005-012.pdf
- Eye trace: https://storyboardart.org/storyboard-tutorials/film-editing-for-storyboard-artists/ · https://artlist.io/blog/eye-trace-and-rule-of-six-editing/ · https://editshare.com/blog/5-fundamental-editing-techniques/
- Storyboard shots/angles: https://storyboardart.org/storyboard-tutorials/different-camera-shots-in-film/ · DreamWorks tips: https://nofilmschool.com/2013/09/storyboarding-tips-dreamworks · CG layout tips: https://www.cgchannel.com/2018/10/10-essential-tips-to-improve-your-cg-layout-work/
- Framing: https://human.libretexts.org/Courses/City_College_of_San_Francisco/Video_Production_Handbook_I/08%3A_Video_Aesthetics/8.05%3A_Video_Composition · https://www.adorama.com/alc/?p=27042 · https://www.davidbordwell.net/blog/2014/03/26/the-grand-budapest-hotel-wes-anderson-takes-the-43-challenge/ · https://neiloseman.com/where-to-place-your-horizon/ · https://contrastly.com/how-to-purposefully-choose-the-horizon-placement-in-composition
- Negative space, isolation, frames: https://www.studiobinder.com/blog/what-is-negative-space-definition/ · https://filmdaft.com/the-difference-between-positive-and-negative-space-in-film-and-art/ · https://offscreen.com/view/the-cinematography-of-isolation · https://fragrant.film/journal/2025/3/11/the-power-of-negative-space-in-cinematic-storytelling · https://www.studiobinder.com/blog/what-is-a-frame-within-a-frame-definition/
- Proxemics: https://en.wikipedia.org/wiki/Proxemics · https://www.sensesofcinema.com/2013/feature-articles/bodies-in-filmic-space-the-mise-en-scene-of-courtship-readiness-in-the-big-sleep/
- Blocking and power: https://nofilmschool.com/give-characters-power-through-composition · https://nofilmschool.com/film-blocking-guide · https://nofilmschool.com/blocking-not-boring
- Continuity: https://www.studiobinder.com/blog/what-is-the-180-degree-rule/ · https://www.studiobinder.com/blog/what-is-an-eyeline-match/ · https://en.wikipedia.org/wiki/Screen_direction · https://makingcomics.com/2014/02/08/anatomy-storyboard-part-2-continuity/ · https://melies.co/cinematic-techniques/framing/over-the-shoulder-frame · https://neiloseman.com/composing-a-shot-reverse/
- Studies: https://pmc.ncbi.nlm.nih.gov/articles/PMC10349552 · https://frontiersin.org/articles/10.3389/fpsyg.2021.625554/full · https://research.vu.nl/en/publications/watching-closely/ · https://www.frontiersin.org/articles/10.3389/fpsyg.2017.02349/full · https://arno.uvt.nl/show.cgi?fid=146343 · https://www.eurekalert.org/news-releases/671698
- Reaction shots/Kuleshov: https://nofilmschool.com/2015/08/how-wisely-using-reaction-shots-can-take-your-visual-storytelling-game-next-level · https://www.soundstripe.com/blogs/what-is-the-kuleshov-effect
- Cut-out craft: https://dessindigo.com/en/blog/drawing-tutorial/drawing-three-quarter-view-face · https://tomrichmond.com/sunday-mailbag-full-profile-or-3-4/26/08/2018 · https://3dartist.substack.com/p/the-art-of-tangents-mastering-intentional · https://Ctrlpaint.com/videos/avoiding-visual-tangents · https://en.wikipedia.org/wiki/Multiplane_camera · https://blog.cg-wire.com/background-characters-animation
- Subtitle placement: https://www.ofcom.org.uk/siteassets/resources/documents/consultations/category-2-6-weeks/178126-review-of-access-services-code/associated-documents/provision-of-tv-access-services-guideline.pdf
