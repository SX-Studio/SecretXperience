# Zinho Automates, Build ANY Faceless YouTube Channel with Claude

https://www.youtube.com/watch?v=EChXCPolIDQ

## Segment 00:00 to 08:00

## 1. Tools, Apps, Websites, Models, Plans, Prices, and Settings

* [00:46] **Skool Community:** "AI Launchpad" (`skool.com/ai-launchpad`), subhead: "From Zero to AI Hero – Learn, build & automate | Claude x Higgsfield (free cre... | Try Higgsfield AI", 34.1K members, 78 online, 2 admins.
* [01:15] **Higgsfield AI Website (`higgsfield.ai`):**
  * Navigation items: Explore, Image, Video, Audio, Cinema Studio 4.0, Marketing Studio, Vssf Presets, MCP & CLI, Supercomputer, Academy.
  * Badges & Features shown: "Install Ask Gemini", "Pricing", "Enterprise", "Supercomputer Free Mode (Run the Supercomputer LLW without spending credits)", "Hano Banana Pro", "Seedance 2.0", "Cinema Studio 4.0", "Flux 3.0 Video Upscale (Upscale to 4K)", "Gemini Omni 1.1 Flash", "The Trigger Powered by Seedance".
  * Promo Banner: "ALL TOP MODELS UNLIMITED ACCESS FOR 3 DAYS - $1.99 per day (orig $3.99)".
* [01:30] **Higgsfield MCP page:** `higgsfield.ai/mcp`
  * Copy URL box displaying: `https://mcp.higgsfield.ai/mcp`.
  * MCP connector supports: Claude, ChatGPT, Cursor, OpenCode, Hermes.
* [01:40] **Claude Desktop App:**
  * Left sidebar sections: `Home`, `Code`, `New session`, `Routines`, `Customize`, `More`.
  * Recents list visible: `Hydration Website`, `test-12`, `test-11`, `pinto-media-comma...`.
  * Under Settings / Customize: General, Account, Capabilities, Claude Code, Cowork, Desktop app: General, Extensions, Developer; Skills, Connectors, Plugins.
  * Connectors listed: Microsoft 365, Atlassian, Canva, GitHub Integration, Gmail, Google Calendar, Google Drive, Lovable, Notion, Slack, Supermetrics Marketing Analytics, vidIQ for Claude.
  * Add Custom Connector dialog fields: Name (`Higgsfield`), Remote MCP Server URL (`https://mcp.higgsfield.ai/mcp`), OAuth Client ID (optional), OAuth Client Secret (optional).
  * Model selector at prompt bar: `Opus 5`, reasoning effort: `High`.
  * Higgsfield Tool Permissions configuration: Tools toggle dropdown set to "Always allow" / "Needs approval" / "Blocked" / "Custom". Visible tools: `Cancel Trial Auto-renewal`, `Create Voice`, `Deploy Website`, `Dubbing`, `Explainer Video`, `Generate 3D`, `Generate Audio`, `Generate Image`, `Animation Actions`, `Describe App Action`, `Search Apps`, `Check Balance`, `Game Creation Bundle File`, `Shorts Studio Sessions`, `Credit Transactions`, `Video Analysis Job`, `Website Secrets`, `Show Characters`, `Show Generations`, etc.
* [02:07] **Higgsfield Faceless Studio:** URL: `higgsfield.ai/faceless-studio`
  * "Create Your Faceless Channel" dashboard with channel presets: "Brewed History", "Echoes of History", "Bite-Sized Tales", "The Raven Who Stole the Light", "POV: 17th Century Factory Worker", "Marie Antoinette", "Why It's So Hard to Spend Money?", "Learning Numbers: Counting to 5", "Why We Dream?", "The Golden Fish Story", "Brief History of Domestic Dogs", "The Immortal Jellyfish".
* [02:56] **YouTube Channel Analyzed:** `@AnimatedHistoryy` ("Animated History"), 67.3K subscribers, 15 videos.
* [04:16] **Higgsfield Explainer Style Presets UI:**
  * Six style cards displayed: Editorial Motion Graphics, Stickman Cartoon, Watercolor Chronicle, Fairy Tale & Myth, Paper Diorama, Faceted Flat 2D.
* [04:24] **Higgsfield Image Generation Engine:** `Hano Banana Pro 16:9`.

---

## 2. Prompts and Code

* [03:02] **Prompt entered into Claude Desktop (YouTube Channel Research):**
  ```text
  https://www.youtube.com/@AnimatedHistoryy
  Here's a YouTube channel. Fetch and analyze it directly. Pull every video from the last 12 months with title, views, upload date, and duration. Then give me: subscriber count, average views per video, the title patterns that repeat across their top performers and how many extra views those patterns are worth vs their baseline, upload cadence, and 10 topics in this niche that neither they nor their closest competitors have covered. If YouTube's page structure breaks your scraper, rewrite it and run it again.
  ```

* [04:00] **The "Lazy Prompt" entered into Claude:**
  ```text
  Make me a faceless video about the history of coffee
  ```

* [06:20] **Visual Style Prompt entered into Claude:**
  ```text
  Here is my visual style. One visual only. No video, no scenes, no script — just the frame.

  Style: bold flat vector illustration. Saturated, high-contrast palette — burnt orange, deep teal, hot mustard yellow, cream. No gradients, no realism, no 3D. Thick, confident black outlines. Big simple shapes, heavy negative space, everything readable at thumbnail size. Light film grain over the top. Think vintage travel poster crossed with a modern album cover.

  Subject: A 1600s Ottoman coffee house at night. Warm light pouring out the window onto a teal street, two figures inside, silhouetted, mid-argument. One steaming cup on the table in the foreground, oversized.

  Composition: cinematic wide shot, 16:9. Strong focal point in the left third, nothing cluttered.
  ```

* [07:20] **Tone of Voice Prompt referencing markdown brand document:**
  ```text
  Read BRAND.md. That file defines how the channel sounds — vocabulary, sentence length, what it never says. Write all narration in that voice from now on.
  ```

* [07:35] **The "Full Prompt" entered into Claude:**
  ```text
  Topic: How coffee was discovered — the Ethiopian goat herder Kaldi, his goats that wouldn't sleep, and the red berries nobody had thought to try.

  Title format use: the pattern The [Animal/Person] Who Accidentally [Discovered/Invented] [Everyday Thing] — give me three options in that shape.

  Visual style — every scene must match this exactly:
  Hand-inked 2D cartoon. Thick, slightly wobbly outlines with uneven weight, visibly hand-drawn, not vector-clean. Characters: big round white eyes with small dark pupils, rubbery noodle limbs, squash-and-stretch proportions, goofy exaggerated expressions, simple bodies with oversized heads. Flat colour fills on characters, minimal shading. Backgrounds painted with visible brush texture and soft edges — looser and more detailed than the characters, so the characters pop against them. Palette: highly saturated and tropical — turquoise, coral, sunny yellow, lime warm purple. High contrast, nothing muted. Not photorealistic. Original characters only, no existing show or franchise. Every frame readable at thumbnail size.

  Reference: match /Style/frame-01.png. Same linework, same palette, same character construction, same flat-characters-on-painted-backgrounds contrast. Treat it as the style bible — if a scene drifts from it, redo the scene.

  Narration: read ./BRAND.md and follow it exactly — voice, banned words, script structure, delivery notes. Write for the ear.

  Length: 1-2 minutes, 16:9.
  ```

---

## 3. Step-by-Step UI Actions

* [01:29] Navigates to `higgsfield.ai`, clicks on the **MCP & CLI** tab in the top navigation bar.
* [01:32] Clicks the copy button next to the **Higgsfield URL** (`https://mcp.higgsfield.ai/mcp`).
* [01:40] Switches to Claude desktop app, clicks **Customize** in the left sidebar, then clicks **Connectors**.
* [01:43] Clicks the **Add** dropdown in the upper right and selects **Add custom connector**.
* [01:45] Enters `Higgsfield` into the Name field and pastes `https://mcp.higgsfield.ai/mcp` into the Remote MCP Server URL field; clicks **Add**.
* [01:48] In the Connectors tool list for Higgsfield, changes permissions settings from "Needs approval" to **Always allow** across available tool functions.
* [02:56] In a web browser, navigates to YouTube channel `youtube.com/@AnimatedHistoryy`, highlights the URL in the address bar, right-clicks, and copies it.
* [03:01] Pastes the channel URL into Claude Code prompt input along with scraping instructions and executes.
* [04:09] Claude interactive questionnaire triggers inside chat:
  * "What kind of channel is this video for?" -> Selects **History (Recommended)**.
  * "How should it look on screen - moving shots, or one picture per line?" -> Selects **Animated (Recommended)**.
  * "How long should the finished video be?" -> Selects **2 minutes (Recommended)**.
  * "What frame shape do you want?" -> Selects **16:9 widescreen (Recommended)**.
* [04:22] A style gallery widget appears inside Claude with 6 style tiles; presenter selects or confirms the style.
* [07:12] In Claude prompt input, types `/` and selects file upload to attach `BRAND.md` from Desktop / Downloads directory (`/Downloads/BRAND.md`), then clicks **Open**.

---

## 4. Visual Styles of Generated Media

* [00:00–00:17] **Four Split-Screen Examples:**
  * *Top-Left (Hyper-realistic macro nature):* Slow macro forward tracking shot across dark, damp forest floor leaf litter; extreme close-up of a red ant lifting fungal spore; shallow depth of field, naturalistic moody cool lighting.
  * *Top-Right (Storybook 2D Animation):* Expressive African boy shepherd with wooden crook and cartoon sheep grazing on green hills; warm sunset/golden hour sky with pink clouds; hand-drawn linework with comic shading; snappy dynamic character animations (eyes darting, goats munching coffee cherries with wide eyes).
  * *Bottom-Left (Papercraft / Paper Diorama Stop-Motion):* Layered torn paper construction with physical paper drop shadows; color palette of terracotta, deep indigo/navy, and tan; paper silhouette figure walking past cutout blooming daffodils; stepped frame rate mimicking tactile stop-motion animation.
  * *Bottom-Right (Whiteboard / Scribble Doodle Animation):* Minimalist hand-drawn stick/doodle figures with ball-point pen black sketch lines and visible crayon/marker color scribbles; scientist character in front of a sketched laboratory brain diagram; expressive exaggerated facial lines.
* [04:33–05:32] **Generated "History of Coffee" Mixed-Media Collage Video:**
  * *Style:* Paper collage and mixed-media scrapbook animation.
  * *Elements:* Cutout black-and-white archival photographic textures pasted over textured cream parchment paper backgrounds. Key accents highlighted with hand-drawn orange marker grease-pencil lines, circles, arrows, and red pin markers.
  * *Characters:* Stylized cutout silhouettes with crisp white sticker-like borders (e.g., Kaldi the herder, black mountain goats running across stepped hillside coffee terraces).
  * *Movement:* Frame-by-frame stepped motion, sliding cutouts, rip/tear page transitions revealing new maps and settings (Red Sea map, Arabian peninsula, coffee pots, Sufi mystics).
  * *Color Palette:* Monochromatic greyscale photography base layered over ivory/cream paper with vivid accent splashes of deep coffee bean brown, crimson red berries, and vibrant fluorescent orange indicator rings.

---

## 5. Numbers Shown on Dashboards and Analytics

* [00:46] **Skool AI Launchpad:** 34.1K members, 78 online, 2 admins.
* [02:16] **Higgsfield Faceless Studio Metrics:**
  * "Hot Right Now":
    * Behind the scenes of movie magic and special effects: `+125%`, 2.1M views this week.
    * AI-Generated Moral Stories with Unexpected Endings: `+74%`, 341K views this week.
    * AI-Generated Animated Stories: Fantasy & Cultural Tales: `+59%`, 612K views this week.
* [03:01] **Claude Token Dashboard:**
  * Overview: Sessions: 73, Messages: 19,026, Total Tokens: 11.5M, Active Days: 24.
  * Models: Opus 5 (High).
  * Sub-metric: "You've used ~524x more tokens than The Little Prince."
* [03:22] **Claude Scraped Channel Teardown (`@AnimatedHistoryy`):**
  * Subscriptions: 67,300 (+48,000 in 92 days).
  * Average Views per Video: 475,985 (median: 275,695).
  * Total Lifetime Views: 7.14M (across entire catalog of 15 videos).
  * Views to Subscribers Ratio: 12.9x.
  * Growth note: Channel tripled in one quarter (subscribers jumped from 19.3K to 67.3K between 21 May and 31 Aug 2024; 66% of lifetime views arrived in this window).
  * Title Pattern 1 ("Numbered sweep of a named place"): Mean views 568,153, 1.21x vs average.
  * Title Pattern 2 ("'Why...' counterfactual"): Mean views 411,380, 0.89x vs average.
  * Title Pattern 3 ("Thematic superlative"): Mean views 111,304, 0.46x vs average.
  * Upload cadence: Uploads every 21.0 days (first half: every 30.0 days; last 90 days: every 15.0 days).

---

## 6. Discrepancies and Additional On-Screen Details

* [03:01] Presenter describes using "Claude Code," but the UI actively demonstrated on screen is the **Claude Desktop GUI application** (showing the chat/connectors interface, not the command-line CLI terminal tool typically named "Claude Code").
* [04:09] While the presenter claims the video was generated from a "lazy one-line prompt," Claude's automated connector workflow immediately paused the prompt execution to present a structured multi-choice questionnaire (Channel type, visual motion style, duration, frame aspect ratio) which the user had to manually step through before generation began.


## Segment 08:00 to 15:57

Here is the exhaustive visual breakdown for the segment from 08:00 to 15:57:

---

### 1. Tools, Apps, Websites, Models, Plans, and Settings On Screen

* **[08:00 - 08:01, 08:58 - 09:11] Web/Desktop Application UI (Claude Code / AI Assistant Interface)**:
  * **Sidebar navigation links**: *Home*, *Code*, *Routines*, *Customize*, *More*, *How to Prompt this*, *Ottoman coffee house*, *Hydration Website*, *poker*, *test 02*, *youtube Automation*, *YouTube channel analysis*, *zinho media commercial*.
  * **Bottom status bar**: *Zinho*, *Zinho AI*, *Bypass permissions*, Model toggle selector: `Opus 5`, `High`.
  * **Tool execution line**: `Using Higgsfield: generate-image-batch`.
* **[08:58 - 09:02] Media player & status**:
  * Action pill: `Uploading the finished file. Ran a command, used 3 tools >`.
  * Output specs tag: `30s · 2560×1440 · 16:9 · narrated by Cillian, no subtitles`.
  * URL shown in response: `https://d2cl7ee51mr4q9.cloudfront.net/user_38yiaHZeLRXVIsMovyefgTk17hB/j0/83975a13-2936-46d8-8ec5-347487825440.mp4`.
  * Saved file path: `The Goats Who Accidentally Discovered Coffee.mp4`.
* **[09:29 - 09:40, 10:14 - 10:24, 10:39 - 10:56, 11:31 - 11:36] Desktop Client**:
  * Workspace: `Local / Four Style Demos`.
  * Active sub-sessions created in sidebar:
    * `Cordyceps fungus video`
    * `Costco hot dog explainer video`
    * `Persephone pomegranate video`
    * `Fun facts video body mysteries`
  * Model shown: `Opus 5`, `High`.
  * Loading state indicators: `Starting session...`, `Starting Claude Code...`, `Waiting for Claude...`.
* **[12:50 - 13:07, 13:22 - 14:38] Browser Web App - Higgsfield AI (`https://higgsfield.ai/faceless-studio`)**:
  * Top navigation bar items: *Explore*, *Image*, *Video*, *Audio*, *Edit*, *Cinema Studio 4.0*, *Marketing Studio*, *Viral Presets*, *MCP & CLI*, *Supercomputer*, *Academy*.
  * Account header: `Upgrade 50% OFF`, `Enterprise`, `Assets`.
  * UI Buttons/Badges: `+ Faceless Studio`, `Or create with HiggsfieldMCP >`, `Reference`, `Upload script`, `NEXT`.
  * Mode categories: *Education*, *History*, *Kids*, *Storytelling*.
  * Channel Creation Dashboard: `ECHOES OF OLD KINGDOMS` (`Channel about old Kingdoms`).
  * Resolution/Length options: `16:9` vs `9:16`, durations `1 min`, `3 min`, `5 min`, render type `Fully animated` (Seamless motion video) vs `Frame by Frame` (Scene by scene video).
  * Video styles presented: *Custom*, *Editorial Motion Graphics*, *Stickman Cartoon*, *Fairy Tale & Myth*, *Paper Diorama*, *Hand Drawn*, *Mannequin*, *Poster Vector*, *Colorful 3D*, *Watercolor Chronicle*, *Paper collage*, *Studio 3D*, *Pastel Flat 2D*.
  * Narrator options (preview waveform available for all):
    * Male: *Grady*, *Holden*, *Arthur*, *Archie*, *Fraser*, *Benji*, *Dylan*, *Cillian*, *Reid*, *Knox*, *Barrett*, *London*, *Callan*, *Miles*, *Ian*, *Alden*, *Evan*, *Jasper*, *Emmett*, *Remy*, *Desmond*, *Cody*.
    * Female: *Ainsley*, *Brielle*, *Faye*, *Delia*, *Céline*, *Elodie*, *Ginger*, *Giselle*, *Helena*, *Isla*, *Juno*, *Maeve*, *Nadine*, *Opal*, *Petra*, *Raina*, *Soraya*, *Talia*, *Livia*, *Daisy*, *Una*, *Evie*, *Kaia*, *Vera*, *Gracie*, *Hallie*, *Willow*, *Xenia*, *Yara*, *Annie*, *Zelda*, *Cora*, *Bella*, *Emily*.
* **[15:35 - 15:40] Skool Community Page**:
  * Community name: `AI Launchpad` (`skool.com/ai-launchpad`).
  * Subtitle: *From Zero to AI Hero - Learn, build & automate*.
  * External link listed: `Try Higgsfield AI`.
  * Classrooms visible: *Motion Graphics (Seedance 2.5 Builds INSANE Motion Graphics)*, *Seedance 2.5 + Claude Code = $1...*, *Hermes Agent Just Became Unsto...*, *Website Design (AuroraPrime)*, *HERMES-AGENT Start Here*, *$10K WEBSITE NO CODING*, *AI Agent Setup + Code*, *Create Motion Graphics with Clau...*, *Automate Video Editing with Clau...*.

---

### 2. Prompts and Code Transcribed Verbatim

* **[08:00 - 08:01] Full Script prompt displayed in text viewer**:
  ```markdown
  SCRIPT - (90 SECONDS)

  [HOOK]
  You drink this every morning because a goat couldn't sleep.

  [SETUP]
  The 9th century. The Ethiopian highlands, in a region called Kaffa. A herder named Kaldi is watching his goats strip red berries off a low shrub.

  He notices it first.
  By nightfall they won't lie down. Still up at midnight. Still up at dawn.
  Kaldi tries the cherries himself. Then he carries them down to the monastery.
  The monk calls them the devil's work. He throws the handful in the fire.
  And the room starts to smell incredible.
  The monk rakes the beans out of the embers. They drop them in hot water. That's the first cup of coffee anyone's ever made.

  [REVEAL]
  Kaldi never existed.
  The story first appears in print for the first time in 1671. In Rome. A scholar called Antoine Faustus Nairon wrote it down eight centuries after the date it gives. No Ethiopian source tells it before him.
  The people actually drinking coffee were Sufi monks in Yemen, using it to stay awake through night prayers.

  [LANDING]
  Nairon needed a good story. It's on the back of your coffee bag right now.

  One call made deliberately: the Kaldi story is a legend, not a documented event, and BRAND mirrors hedging - so I couldn't write "some say" or "legend has it", churned things from the reversal instead. You still get the full goat sequence, but Nairon gets pulled out early, and the whole ending is pointing at that the real story is younger than the coffee trade. It also satisfies "and at least one line that sounds wrong until you explain it": If you'brother run the pure legend with no twist, it's just someone else's animated coffee intro. Nairon's the twist. The first cup itself.

  Rendering the nine scenes now.

  Using Higgsfield: generate-image-batch >
  ```

* **[09:02 - 09:10] Modification prompt in Claude Code chat input**:
  ```text
  I dont like the opening scene, change it to something more fun, keep everything else the same
  ```

* **[09:10 - 09:11] Claude Code automated reasoning output**:
  ```text
  Fair - it opened on everyone standing still, and that shaded face close-up reads grim/serious rather than funny. Let me rebuild the beat so it opens on a gag instead of an establishing shot.

  New: block 1: A goat's face chewed straight into camera -> pull back to reveal the bush already stripped while Kaldi sleeps standing up -> goat headbutts him awake -> perk. He sits up with grass on his face -> the whole flock freezes mid-chew, cheeks bulging, staring at him.

  Rewriting blocks and re-encode manifest...
  Running a command >
  ```

* **[09:30 - 09:39] Prompt for Video 1 (Science Channel)**:
  ```text
  1-Science channel
  Make a faceless video.
  Topic: Cordyceps-the fungus that infects an ant, takes over its behaviour, and makes it climb to the exact height the fungus needs before it kills it.
  Title: "The Fungus That Hijacks Ants"
  Visual style: photorealistic and cinematic. Natural lighting only, no artificial colour. Muted palette - deep forest greens, cool blues, wet browns. Shallow depth of field, macro detail on textures. Slow push-ins and slow drifts, no fast movement. Damp rainforest floor atmosphere, soft diffused light through canopy.
  Documentary feel. No text or graphics in frame.
  Narration: calm, measured, unhurried. Nature-documentary restraint. Let the facts sit.
  Length: 5 minutes, 16:9.
  Also: generate a matching thumbnail in the same style: one macro shot, single ant, shallow focus, muted greens, no text.
  ```

* **[10:16 - 10:23] Prompt for Video 2 (Business Explainer)**:
  ```text
  2- Business explainer
  Make a faceless video.
  Topic: The Costco hot dog. It has cost $1.50 since 1985 and loses money on every sale - and that's the point. How loss leaders work and why the price will never change.
  Title: "The $1.50 Hot Dog That Makes Billions"
  Visual style: clean corporate motion graphics. Flat design, generous white space, everything centred and balanced. Palette strictly white, light grey, and confident mid-blue with one accent. Simple geometric shapes, clean sans-serif labels, minimal line icons. Sharp hard cuts between scenes, no dissolves. No photorealism, no texture, no clutter.
  Narration: brisk, clear, confident. Explainer pace - get to the point.
  Length: 4 minutes, 16:9.
  Also: generate a matching thumbnail: same flat style, one hot dog icon, big blue number, heavy white space.
  ```

* **[10:41 - 10:55] Prompt for Video 3 (Mythology Channel)**:
  ```text
  3-Mythology channel
  Make a faceless video.
  Topic: Persephone and the six pomegranate seeds. Why eating in the underworld bound her to it, and how the Greeks used that story to explain winter.
  Title: "The Six Seeds That Created Winter"
  Visual style: layered paper-cutout illustration. Every element is a separate cut paper shape with visible torn or scissor-cut edges and a soft drop shadow onto the layer behind it. Visible paper grain and fibre texture. Flat colour, no gradients, no realism. Palette: muted terracotta, burnt sienna, deep indigo, bone white, dull gold. All motion is slow parallax - foreground layers drift faster than background layers, like a pop-up book opening. No fast cuts.
  Narration: slow, weighted, mythic. Long pauses. Almost read aloud rather than spoken.
  Length: 7 minutes, 16:9.
  Also generate a matching thumbnail in the same cutout style: a single pomegranate split open, indigo background, layered shadows.
  ```

* **[11:32 - 11:36] Prompt for Video 4 (Fun Facts Channel)**:
  ```text
  4- Fun-facts channel
  Make a faceless video.
  Topic: Seven things your body does that scientists still can't fully explain - yawning being contagious, deja vu, hiccups, why we cry, goosebumps, itching, and dreaming.
  Title: "7 Things Your Body Does That Nobody Can Explain"
  Visual style: hand-drawn marker doodles on an off-white paper background. Loose sketchy linework, visible marker texture and uneven strokes, deliberately imperfect. Stick figure-adjacent characters with dot eyes and simple squiggle limbs. Bright primary highlighter colours - red, yellow, green - scribbled in, colour going outside the lines. Doodle arrows, circles, and squiggle emphasis marks. Bouncy pop-on animation, elements drawing themselves in. As far from photorealistic as possible.
  Narration: fast, upbeat, playful. Punchy delivery, quick beats between facts.
  Length: 1 minutes, 16:9.
  Also generate a matching thumbnail: doodle style, one confused stick figure, big scribbled question mark, off-white paper background.
  ```

* **[13:30 - 13:33] Channel URL pasted into Higgsfield reference field**:
  ```text
  youtube.com/@GoodKnight...
  ```

* **[13:34 - 13:39] Channel Topic typed in Faceless Studio**:
  ```text
  Channel about old Kingdoms
  ```

---

### 3. Step-by-Step UI Actions

* **[08:58 - 09:10] Modifying a Single Scene in Claude Code**:
  1. The presenter focuses on the Claude Code prompt interface where the previous video was completed.
  2. Types prompt: *"I dont like the opening scene, change it to something more fun, keep everything else the same"*.
  3. Hits Return; Claude Code immediately interprets the request, plans the replacement scene, executes the underlying command, and recompiles the video output without altering the remaining segments.
* **[09:29 - 09:40] Running Science Faceless Video**:
  1. Opens the `Four Style Demos` session.
  2. Pastes prompt block `1 - Science channel`.
  3. Clicks Send arrow button (`Opus 5` mode enabled); waits 2 seconds as Claude Code invokes the Higgsfield API.
* **[10:14 - 10:24] Running Corporate Explainer Video**:
  1. Pastes prompt block `2 - Business explainer`.
  2. Presses Send button; system initializes rendering.
* **[10:39 - 10:56] Running Cut-Paper Mythology Video**:
  1. Pastes prompt block `3 - Mythology channel`.
  2. Presses Send; system begins execution.
* **[11:31 - 11:37] Running Marker Doodle Video**:
  1. Pastes prompt block `4 - Fun-facts channel`.
  2. Clicks the orange arrow icon to execute.
* **[12:50 - 13:39] Creating a Channel in Higgsfield Faceless Studio (Web)**:
  1. Opens `higgsfield.ai/faceless-studio`.
  2. Selects category pill: clicks **Storytelling**.
  3. Clicks **Reference** button to open modal dialog `Add link`.
  4. Switches to YouTube tab, copies channel URL `youtube.com/@GoodKnight...`, pastes into field, and clicks **Submit**.
  5. Clicks the input bar *"Channel about..."* and types `Channel about old Kingdoms`.
  6. Clicks green **NEXT** button.
* **[13:40 - 14:02] Episode Topic & Settings Selection**:
  1. Studio automatically generates channel name: `ECHOES OF OLD KINGDOMS`.
  2. Pre-populates 5 episode titles. Presenter selects option 1: *"The Lost Treasury of the River-Kingdom: How a Flood Changed a Dynasty"*.
  3. Clicks **Generate new** at bottom right; system re-rolls 5 new topics.
  4. Selects new first topic: *"The King Who Buried His Heir Alive: Rituals, Betrayal, and a Hidden Will"*.
  5. Leaves aspect ratio at `16:9`, duration at `1 min`, animation setting on `Fully animated`.
* **[14:03 - 14:18] Style Selection**:
  1. Proceeds to Step 2: *Select video style*.
  2. The custom reference channel is checked by default (`Custom`).
  3. Presenter scrolls across built-in presets (*Editorial Motion Graphics*, *Stickman Cartoon*, *Fairy Tale & Myth*, etc.). Selects `Fairy Tale & Myth`.
* **[14:19 - 14:38] Narrator Voice Selection & Episode Generation**:
  1. Proceeds to Step 3: *Select narrator voice*.
  2. Clicks play to preview male voice *Grady*, previews *Ainsley*, previews *Brielle*, scrolls down to *Cillian*, and selects *Cillian*.
  3. Clicks **Fraser** preview then selects **Cillian** (orange check).
  4. Clicks green button **Generate Episode** (icon with sparkles).
  5. Channel dashboard loads showing `Episode #1` card in `Generating` state with live progress spinner.

---

### 4. Visual Styles of Generated Content

* **[08:02 - 08:30] "Coffee Discovery" Initial Cut**:
  * **Style**: 2D stylized European comic / indie storybook illustration with bold ink contours, painterly grass textures, warm orange sunset gradients.
  * **Characters**: Young Ethiopian herder Kaldi (large white circular eyes, tiny pupils, linen robe) and sheep/goats (wide manic bulging eyes, green collars, brown patches).
  * **Pacing & Cuts**: Quick comedic cuts (~2-3 sec per shot).
  * **Scenes**: Goats eating coffee cherries -> jumping manic nighttime dance around campfire -> Kaldi chewing berry with bulging vibrating eyes -> Old monk brewing berries in purple pot -> monk drinking and jumping awake with vibrating pupils.
* **[09:12 - 09:16] "Coffee Discovery" Scene Replacement**:
  * **Opening replacement**: Kaldi walking across vibrant green hills with walking stick; goats follow in single file; Kaldi sniffs wild coffee bush; dramatic close-up of goat chomping straight into camera with wide crazed eyes.
* **[09:41 - 10:11] Style 1: Science / Macro Wildlife ("The Fungus That Hijacks Ants")**:
  * **Style**: Photorealistic, shallow depth of field, macro lens (mimicking 100mm macro f/2.8), wet forest floor, damp moss, dark soil, muted organic forest palette (olive greens, deep charcoal, bark brown).
  * **Camera Movement**: Subtle continuous creeping forward push-in, low ground-level tracking shots.
  * **Key Visuals**: Ant crawling along decaying branch; extreme macro shot of ant head revealing white fungal spore; spore penetrating cuticle; fungal mycelium filaments spreading inside thoracic joints; ant paralyzed atop branch with white stalk erupting from neck.
  * **Thumbnail [10:11]**: Close-up macro of ant on wet leaf with fully sprouted cordyceps fruiting body.
* **[10:25 - 10:38] Style 2: Business Explainer ("Costco Hot Dog")**:
  * **Style**: Minimalist vector corporate motion graphics; pure white background, flat geometric shading, restricted palette (Costco blue, ketchup red, grey `#E0E0E0`, mustard yellow).
  * **Motion**: Smooth transform easing, snapping drop-down elements, pop-in bar charts, moving upward trend arrows, zero texture, clean sans-serif typography on screen.
  * **Captions**: Centered bold black sans-serif subtitles (`A HOT DOG THAT LOSES MONEY EVERY SALE.`).
* **[10:57 - 11:30] Style 3: Mythology Paper-Cutout ("The Six Seeds That Created Winter")**:
  * **Style**: Multi-layered textured cardstock cutout; rough torn paper edges, visible paper grain, soft directional drop shadows between depth layers. Palette: Terracotta, burnt sienna, deep indigo night sky, bone white, gold foil.
  * **Animation**: Layered multiplane parallax sliding; sliding paper fissures cracking across ground; cut paper silhouette of Persephone and Demeter walking across paper stalks.
  * **Thumbnail [10:57]**: Two halves of a paper-cut pomegranate with seed recesses against torn dark indigo paper strips.
* **[11:37 - 12:07] Style 4: Marker Doodles ("7 Things Your Body Does")**:
  * **Style**: Whiteboard / marker sketch aesthetic; black felt-pen outline on textured ivory paper; primary color marker fill (scribbled outside lines in yellow, blue, red highlighter marker).
  * **Motion**: Stop-motion sketch reveal, bounce pop-ins, vibrating wiggle lines, cartoon stick figure with scribbled messy hair, doodle question marks and arrows.
* **[14:39 - 14:58] Style 5: "Fairy Tale & Myth" (Generated in Faceless Studio)**:
  * **Style**: Dark fantasy digital painting / anime cinematic illustration; volumetric god-rays through gothic cathedral window, glowing golden dust motes, deep navy and crimson palette.
  * **Visuals**: Goth-styled princess/queen in crimson gown standing beside ornate golden hourglass with flowing black sand; ancient rune stone glowing with magical yellow glyphs in dark forest; golden crown materializing as glowing particles above her head.

---

### 5. Numbers and Dashboard Metrics

* **[09:29] Top Dashboard Stats (Zinho Overview)**:
  * Metric 1: `19,527`
  * Metric 2: `13.1M`
  * Metric 3: `74`
* **[13:30] Reference Channel Stats (`@GoodKnight...` / The Dreamer)**:
  * *You're Falling Asleep in a Jurassic Park Nightshift Hotline*: `51K views · 1 month ago`
  * *Fall Asleep in the History of Whale Hunting*: `8.2K views · 1 month ago`
  * *The Longest Journey in Greek Mythology (The Odyssey)*: `15K views · 2 weeks ago`
  * *The Rise and Fall of the Roman Empire*: `10K views · 9 days ago`
  * *The Rise of the Inca Empire*: `8.2K views · 8 days ago`
  * *The ENTIRE Story of Greek Mythology for Sleep*: `14K views · 5 days ago`
* **[15:35] Skool Community Metrics (`AI Launchpad`)**:
  * Members: `34.1K Members`
  * Online count: `78 Online`
  * Admins: `2 Admins`

---

### 6. Discrepancies and Additions to Spoken Audio

* **[08:58] Voiceover metadata**: The presenter does not speak about the voice engine, but the interface explicitly outputs: `narrated by Cillian, no subtitles`, resolution `2560×1440` (1440p QHD), rendering time ~30 seconds.
* **[13:22 - 13:31] Reference Link**: The presenter mentions pasting a channel reference link; on screen, the exact YouTube channel used as the visual anchor is `@GoodKnight...` featuring dark history/sleep mythology documentary covers.
* **[13:41 - 13:56] Topic Generation**: The presenter clicks the **Generate new** button at [13:53] to demonstrate rerolling; the original batch generated history dynastic flood topics, but he rerolls to pick a dramatic royal treason topic (*The King Who Buried His Heir Alive*).
* **[14:28 - 14:35] Narrator Selection**: While browsing through narrator options, the interface exposes over 30 distinct synthetic voice actors categorized by gender with full waveform samples. He previews *Grady* and *Ainsley*, before finalizing on *Cillian*.
