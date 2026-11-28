# Study: "anime reimagined as 80s live action" (Chapterunknown) and how to make videos like it

Studied on 2026-10-21 for a planned new channel: anime scenes reimagined as realistic films.

Sources: both videos watched end to end by Gemini in 100 s segments with a VFX-forensics prompt (`forensics/`), the videos' metadata and 590 comments (`data/`), the creator's channel, a survey of the niche's top videos and channels this month (`data/niche-*.json`), YouTube's policy pages, and pricing pages. Where a claim is Gemini's inference (for example which generator was used), it is marked as such.

## 1. The two videos

| | Escanor vs Galand | Escanor vs Estarossa |
|---|---|---|
| ID | UqRqox3Z2V8 | zyxDrErUmnI |
| Uploaded | 2026-09-28 | 2026-10-20 |
| Length | 5:32 | 8:56 |
| Views / likes | 678,540 / 8,000 | 78,213 / 2,518 (first day) |
| Channel subs at study time | 2,740 | 2,740 |
| Format | 1440×1080, i.e. **4:3** | 1440×1080, **4:3** |
| Chapters | 4 named chapters | none |

Both are by Chapterunknown (@ChapterunknownAI), who says in the description and comments: "I make every one of these videos on my own, from the visuals to the music", "This video took me around two weeks to make, working about 6–8 hours a day", music is "my arrangement / my remix" of the anime themes, and the video is "Created using AI as an unofficial fan tribute."

The telling comparison on the same channel: the creator's **Vinland Saga video (MiG0km-S6iE) has 5,900 views**; the two **Seven Deadly Sins videos have 678k and 78k**. Gemini's watch of the Vinland video (`forensics/MiG0km-S6iE.0000.md`) shows it uses the same craft and even the same look (4:3, heavy grain, golden-hour grade, consistent characters). What it lacks is the hook: it opens on wheat fields and a sleeping face, has no dialogue for 100 seconds, no "VS", no famous line, and a quieter fandom. The Escanor videos open on a confrontation, carry a meme line everyone knows ("Who decided that?"), a character fans call "the aura", and a poster-style "VS" title. **The look is table stakes; the scene choice and the first 10 seconds decide the views.** His Shorts cut from the long videos reach 75k–121k and feed the long form.

### What viewers respond to (top comments, by likes)

- The character's catchphrase and "aura": "80's live action of Escanor? Who decided that? 😂" (933 likes), "Who decided that? ... I am the one who decides" quoted repeatedly.
- The casting: "There cant be enough Cavill in the World" (342); Escanor reads as a Henry Cavill / Tom Selleck archetype. Viewers love a recognisable "actor" face.
- "I'd rather have this any day than an actual live action" (231); "This is the AI remakes we want" (68).
- "If there is slop there is also peak. And this is AI PEAK" (200 on video 2); "Absolute cinema" (104).
- "It's like I'm watching Power Rangers first season" and "AI reached early Power Rangers levels of quality": the retro look makes AI flaws read as period charm.
- Requests for the next scene (Meliodas vs Escanor, the full anime). The creator answers comments and promises the next fight. This is a series, not one-offs.

## 2. The niche right now (October 2026, videos uploaded this month, by views)

| Video | Channel | Subs | Views | Length |
|---|---|---|---|---|
| BAKI UNCHAINED Ep 1 | Baki Untold | 43k | 1.28M | 9:26 |
| Smoking Behind the Supermarket, live action Ep 1 | DrawnIRL | 9.7k | 1.21M | 9:33 |
| Machiko-sensei "looks unfairly realistic" | もし実写化されたら | 14.9k | 1.07M | 1:49 |
| NARUTO Ep 4, AI 4K live action | alter.anime7 | 90k | 1.05M | 12:44 |
| Akainu vs Ryokugyu, One Piece AI film | OPAI | 74k | 686k | 8:02 |
| Escanor vs Galand, 80s live action | Chapterunknown | 2.7k | 678k | 5:32 |
| BAKI: The Strongest on Earth | The Blue Horizon AI | — | 692k | 2:48 |
| Dragon Ball Z Saiyan Saga, AI fan film | Trilerin | 11k | 355k | 12:25 |

Channel medians (last 8–30 uploads): alter.anime7 551k, Baki Untold 208k, もし実写化されたら 192k, OPAI 163k, DrawnIRL 260k. These are small channels (3k–90k subs) getting hundreds of thousands to millions of views per upload. The demand is real and the supply is still thin.

Three formats are winning:
1. **Full scene or episode, 5–13 min**, English AI voices, shot-reverse-shot dialogue, big fights (Chapterunknown, Baki Untold, OPAI, alter.anime7). Highest views per upload.
2. **"Characters in real life" reveal, 1.5–3 min**, anime still → realistic still, one character after another (もし実写化されたら at 1.07M; the English copies like REALIFIED get almost nothing, so execution and taste matter).
3. **Slice-of-life live-action episode**, 5–10 min (DrawnIRL, 1.2M for a smoking-break manga).

Thumbnail pattern (`data/thumbs.jpg`): movie-poster title treatment with the franchise name big, a "VS" or episode number, and one realistic face in the 80s versions. Baki and Naruto use "4K ULTRA HD AI LIVE ACTION" badges.

## 3. How the videos are made (forensics)

From the shot-by-shot breakdowns in `forensics/` (10 segments, ~150 shots logged):

**Structure.** Average shot length about 3.5 s in action, 5–11 s in dialogue. Classic film grammar: establishing wide, then over-the-shoulder shot-reverse-shot for dialogue, escalation to extreme close-ups, then a wide for the impact, then a reaction close-up. Hard cuts almost everywhere; a cut to black before a climax; a title card about one minute in (name of the character or scene on parchment); a "Thank you for watching" card at the end. Video 1 has YouTube chapters; video 2 opens on the battlefield in the first 2.5 s.

**Shots are image-first.** Nearly every shot looks like a still frame animated with image-to-video (Gemini's read: Midjourney-style stills animated with Kling or Runway Gen-3; this is an inference, the creator does not say). Signs: very strong first-frame composition, subtle breathing and hair and cloth motion, 2–4 s of motion, small morphing of hands and teeth, backgrounds that "boil" slightly, camera moves that are pushes and slow tilts rather than complex tracking. Establishing shots (an axe against a wall, a map title card) are plain stills with a Ken Burns move. A few heavy-action shots are text-to-video (explosions, the flight after the sun hit) and those are the weakest: floaty physics, debris that pops out of existence.

**Character consistency is the core skill.** Escanor keeps the same mustache, hair, scar makeup, back tattoo and axe across dozens of generations and angles. That means a locked character sheet (face, costume, prop) used as a reference image for every shot, not fresh prompting. Where consistency slips (Meliodas between the throne room and the battlefield) Gemini flagged identity drift immediately. Composites are used for scale shots (giant Escanor over tiny Galand).

**Hands are hidden.** Tight framing, shallow depth of field and props keep hands out of frame or static. Fast contact (a throat grab) is cut away from within a second.

**The look (the real differentiator).**
- 4:3 at 1440×1080, sometimes with a soft rounded CRT mask.
- Heavy 35 mm grain, halation/bloom around the sun, fire and gold armor, mild chromatic aberration, gate weave, occasional scratches and dust, vignette.
- Grade: teal shadows, warm copper skin, blown warm highlights, slightly lifted "milky" blacks, overall 1980s Kodak feel ("Conan the Barbarian", "Excalibur", "Krull", "Legend").
- Costume and creature design prompted as **practical effects**: foam-latex and fiberglass demon suits, LED-style glowing eyes, hammered-steel pauldrons, oiled bodybuilder skin, greasepaint. This is why AI flaws read as "Power Rangers charm".
- Dialogue shots held long (up to 10 s), the 80s pacing, which also hides that each AI clip is short.
- One archival "16 mm sepia" shift at a climax for variety.

**Audio.**
- Music: an 80s synth-orchestral remix of the anime's own themes (Sawano-style brass and choir plus analog synth bass). The creator makes it himself. Video 1's description credits a cover of the Escanor theme.
- Voices: English AI voices in a theatrical dub style, with "vintage" EQ (rolled-off highs, boosted low-mids) and reverb to blend. Lip-sync is loose and clearly generated; the retro treatment hides it.
- SFX: sub-bass impacts, whooshes on every camera move, metal clanks, fire, wind.
- Subtitles: lowercase yellow fansub-style captions on some lines.

**Weakest points Gemini kept flagging:** lip-sync and mouth warping on long dialogue close-ups; physics on contact and on flying bodies; CG monster not matching the plate's lighting; small-object physics in debris shots. Every one of these is avoidable with shot design (cut on the hit, show reactions not contact, keep monsters in their own shots).

## 4. The recipe we would use

1. **Script and voice first** (our rule from episode 4). Pick the scene, write the dialogue (adapted, not copied line-for-line), record the voices (Kokoro for narration quality; for character voices we would need a multi-voice TTS such as the commercial ones or a licensed open model), and time every shot to the words.
2. **Casting sheet.** One reference image per character (face, hair, costume, prop) made with an image model and locked. Choose an "80s actor archetype" per character; viewers love it.
3. **Shot list from the storyboard**, about 60–100 shots for 5–8 minutes, 60 % dialogue close-ups and reactions, 25 % wides and establishing stills, 15 % action. Shot-reverse-shot for dialogue.
4. **Stills first, then motion.** Generate each shot's first frame with the character references (Nano Banana Pro takes up to 14 reference images), check identity, then animate 3–8 s with an image-to-video model (Veo 3.1 with reference images, or Kling 3.0 / Seedance 2.x via a provider). Action: Kling 3.0 or Seedance for motion control; or Seedance's video reference, which copies the motion of a clip (whether it accepts an anime clip is untested). Keep hands out of frame.
5. **Assemble in HyperFrames** at 1440×1080: hard cuts timed to the words, title cards, fansub captions, cut to black before climaxes, end card.
6. **The 80s pass, locally** (`tools/film80.sh`, prototyped on our cheetah footage, `tools/before_after.jpg`): 24p, 4:3 crop, lowered contrast and saturation, warm highlights and teal shadows, lifted blacks, halation from a blurred highlight pass, red/blue fringing, animated grain, slight soften and re-sharpen, vignette, gate weave. No LUT files needed. This step is free and ours.
7. **Music and sound locally.** ACE-Step original 80s synth-orchestral score (no remix of the anime theme, which is what gets Content ID claims), numpy SFX, voice ducking, −14 LUFS. 
8. **Review loop.** Contact sheets, then a Gemini pass on the final MP4, each flag verified against the file (as done for episode 4).
9. **Shorts.** Cut the three best 15–60 s beats; the creator's top Short (oghV9Bv4vi8, 121k views) is a 15 s music-driven trailer cut: no dialogue, hard cuts on the downbeats of an 80s-anime-opening-style synth track, the two heroes' power moves and one explosion, ending on the impact. Posted as a 4:3 frame inside the vertical canvas. These feed the long video.

### Tools and cost

What this environment can do today:
- Gemini video understanding: works (free tier, limited quota). Used for all the forensics above.
- **Image and video generation need billing.** On this key, Nano Banana Pro, Nano Banana 2 and Veo all return "free tier limit: 0". Prices on the official page (2026-10-21): Nano Banana Pro $0.134 per image at 1K/2K; Nano Banana 2 $0.067 per 1K image; Veo 3.1 $0.40 per second standard, $0.10–0.12 per second Fast (720p/1080p), $0.05–0.08 per second Lite. The page says Veo 3.1 models are retired on 2026-10-22, so the successor model's price applies from tomorrow. Kling 3.0 runs about $0.11–0.28 per second and Seedance 2.0 about $0.09 per second through providers such as fal.ai (secondary sources; verify on the provider page).
- Local: voices (Kokoro), music (ACE-Step), SFX, assembly (HyperFrames), the 80s pass (ffmpeg), tracking (OpenCV). No GPU here, so open video models (Wan 2.x) are not practical locally.

Per-video estimate for a 6-minute episode of about 80 shots: 80–120 stills at $0.07–0.13 ($8–16), plus about 400 s of generated video at $0.10–0.28 per second ($40–110), plus retakes (plan ×2): **roughly $100–250 per episode** at today's prices, and about 2–3 days of work with our pipeline instead of the creator's two weeks.

## 5. Legal and monetization (read before choosing the franchise)

- **It is fan work on someone else's IP.** The Seven Deadly Sins is Kodansha's; Baki, Naruto, One Piece, Dragon Ball likewise belong to Japanese publishers. In October 2025, 18 Japanese companies including Kodansha, Shueisha, Kadokawa and Square Enix, with CODA (which includes Toei), publicly objected to Sora 2 outputs resembling their works and said they would take legal action as necessary; Japan's government also pressed OpenAI. Studios are known to issue takedowns on YouTube. Every channel in section 2 is taking this risk; none has been visibly shut down yet, and the rights holders may prefer to claim ad revenue over removing videos (as film studios did with AI fake trailers). Treat it as a real, unquantified risk: a strike-prone channel should not also be your main business.
- **Music.** Remixing the anime theme (what the creator does) invites Content ID claims that redirect revenue. Use original score.
- **YouTube Partner Program.** The inauthentic-content policy allows AI when "the creator's vision is evident" (visualising an original character, generating backgrounds) and bans "AI-generated content made with generic or unoriginal templates giving the impression of mass production". Reused content is allowed "if viewers can tell that there's a meaningful difference". A full reimagining with new visuals, new voices and an edit is far from reused content; a "characters in real life" slideshow is closer to the line.
- **AI disclosure.** YouTube requires disclosure for realistic AI content ("creates a realistic scene that never happened"). Tick "Yes" on upload; the label does not affect monetization. Keep "unofficial fan tribute, made with AI" in the description.
- **Safer variants that keep the format:** (a) public-domain source material reimagined as 80s film (Journey to the West, Norse sagas, Greek myth, Arthurian legend, Beowulf; Vinland Saga is itself based on sagas), (b) an original dark-fantasy series in the same 80s look (lower initial demand, fully ours), (c) fan work on IP whose owners tolerate fan films. The views today are clearly in (c)-style fan work; the durable asset is the look and the pipeline, which carry over to (a) and (b).

## 6. Plan for the new channel

- **Identity:** one look (the 80s dark-fantasy film), one series voice, numbered episodes, named chapters, a "next scene" vote in the pinned comment. The look is the brand; franchises can rotate.
- **Hook:** the first 3 s must show the realistic character in the 80s treatment; the title card comes later. Titles follow the winners: "[Character] vs [Character] — 80s Live Action | [Franchise]". Thumbnail: poster title, one face, "80s STYLE".
- **Cadence:** one 5–8 minute episode every 1–2 weeks plus 3 Shorts cut from each. The creator posts every two weeks.
- **First episode choice.** Pick a scene with (1) a famous quotable line, (2) two characters who map onto 80s actor archetypes, (3) a fight with clear beats and few hand-to-hand contacts (energy, weapons, scale are easier than grabs), (4) a franchise not already saturated this month (Baki, Naruto, One Piece, Dragon Ball and Seven Deadly Sins are taken; Berserk, Vinland Saga, Hunter x Hunter, Jujutsu Kaisen are lighter).
- **Before production (decisions needed):**
  1. Enable billing on the Gemini key, or a fal.ai key, for stills and video (about $100–250 per episode).
  2. Franchise and scene, with the IP risk above accepted, or a public-domain source.
  3. Character voices: a multi-voice TTS with a commercial licence (a paid service or a licensed open model), since Kokoro's voices are limited.

## 7. Files

- `forensics/`: Gemini's shot-by-shot breakdowns (10 segments) and the comparison watch of the creator's 4K video and top Short.
- `data/`: metadata and comments for both videos, channel listings, this month's niche survey, thumbnails sheet.
- `tools/film80.sh`: the local 80s film pass; `tools/before_after.jpg` and `tools/film80.mp4`: the prototype.
- `tools/deepwatch.py`: the segmented forensic watcher used here (needs the Gemini key).
