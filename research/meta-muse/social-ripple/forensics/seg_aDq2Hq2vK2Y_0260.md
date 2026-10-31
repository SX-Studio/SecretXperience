Here is the comprehensive report detailing every step, command, visual rule, cost, and script structure shown in the video for building faceless animated videos with Claude Code.

---

### 1. Step-by-Step Pipeline, Commands & Settings

#### **Setup & Installation**
*   **Community Link:** `skool.com/nextphase-5790` (Post: *"How To Make Faceless Video $12,000/month"*).
*   **Google Drive Folder:** Download the zip file named `faceless-videos-skill.zip` (size: ~14 MB, plus preview folder ~23.5 MB).
*   **Rule:** **"Make sure to not unzip it."**
*   **Storage Requirement:** Needs about **1 GB** on your computer. The music model (optional) requires **15 gigabytes**.
*   **Terminal execution (`Claude Code` v2.1.312 / Opus 5.5 with xhigh effort - Claude Max):**
    *   Open terminal in `~/Desktop/motiongraphic`.
    *   Paste the install prompt provided in the Google Drive:
        ```text
        INSTALL PROMPT [paste into Claude Code.txt]:
        video with AI. Ask before anything that needs my password or a big download (the optional ACE-Step music is ~15 GB). Don't change anything outside ~/.claude/skills/faceless-videos, ~/.claude/skill-backups, ~/.-faceless-videos and the free tools above. At the end, tell me how to start next time (just ask for a faceless video in any new Claude Code session) and remind me to start a new Claude Code session so the skill loads by itself.
        ```
*   **Self-Test Command:**
    ```bash
    bash ~/.claude/skills/faceless-videos/scripts/selftest.sh
    ```
    *   Runs three short clips (takes 5 to 8 minutes). Once `SELFTEST PASSED`, you are ready.
*   **Model Selection:** Recommended: **Opus 5.5** (Best for everyday, complex tasks). Time taken to install/setup: **around 2 minutes**.

#### **Execution Prompt (To Make a Video)**
1. Open Claude Code (`claude`).
2. Provide two things: **Your style sheets** and the **link to the faceless video you liked** (e.g., a YouTube or TikTok reference link).
3. **Prompt Example (Volcano / True Crime / Louvre):**
   * *Volcano Example:* `"can you make me a video like this [TikTok link]... build our own fact-checked 30-sec 9:16 version with the same question and Zack-style look but original script, our own bomb-design. Now let me pull the TikTok reference so I can study it frame by frame."`
   * *True Crime Example:* `"can you make me a video like this [TikTok link]... you already have a style sheet reference"` -> Claude researches real cases first (e.g., Texas Death Row Record: *Dorsey, Leon David IV*), fact-checks the facts, builds the script, and builds the video around the camera detail.
   * *Louvre Example:* No video generation, just images. Hiksfild made 12 still images, then Claude made them move, added sparks, flying glasses, dust, map, and motion graphics.

---

### 2. Visual Grammar & Production Rules

#### **Character Design (Stick Figure / Iffverse Style)**
*   **Head:** Round, black/dark fill.
*   **Eyes:** Large white circles with black pupils (or glasses/spectacles on some variants).
*   **Mouth:** Expressive open-mouthed expressions (e.g., shocked, sad, neutral).
*   **Body & Clothes:** Coloured hoodies or sweaters (orange, blue) with black limbs.
*   **Colours:** Muted apartment/interior color palette (grey walls, brown doors, blue sofas, tiled bathrooms).

#### **Animation & Movement Rules (`stickman-motiongraphics/SKILL.md`)**
*   **Pictures:** One per clause, **~25–32 a minute**.
*   **Camera:** Barely moves. Close-ups never move. Camera moves through with real depth.
*   **Faces:** Character blinks every **3.5–4 seconds** (for 3 frames).
*   **Motion:** Planted feet never slide. When walking, **feet stay planted on the floor**.
*   **Hands:** Wide = nub, medium = mitten, close-up = five-finger geometry.
*   **Aspect Ratio / Build:** 9:16 (vertical) or 16:9 (horizontal for YouTube/Shorts). Every cam gets `px/py/pw`.

#### **Composition, Elements & Sound**
*   **Shots & Timing:** 
    *   Volcano: 4 sets in code, 15 shots.
    *   True Crime: 730 on-screen, 1,900 tapes on the shelf, 9:16 vertical.
    *   Stick Figure: 39 shots, 73 seconds (built for 16:9 horizontal and 9:16 vertical).
    *   Louvre: 12 still images animated with dynamic depth, sparks, flying glass, dust, and maps (€88,000,000 estimated value).
*   **Sound Design & Music:** 
    *   Music comes from a free music model on Mac (aligned with big hits like volcanic eruptions).
    *   *Warning/Fix during testing:* In the first mix, screams and sound effects were louder than the voice, losing the story. **Fix:** Claude wrote down every word on its own video and checked every line by itself.
    *   Voice, music, sound effects, and renders happen fully local on MacBook.

---

### 3. Script Structure & Narration

#### **Example Video Structure (True Crime / Blockbuster Murder):**
1.  **Hook:** *"In 1994, a store camera photographed a killer."*
2.  **Escalation:** *"Police let their suspect go. The man on the tape looked too tall. Four years later, the FBI measured the tapes again..."*
3.  **Payoff:** *"The height matched. Is Leon Dorsey's height."*

*Verbatim Script Excerpt (True Crime mix check):*
> *"It starts with a sound in the hallway. Someone is pounding on your neighbor's door. Then the pounding stops. And the screaming starts."*

---

### 4. Costs, Time Taken, Limits, Failure Points & Fixes

*   **Cost per video:** **$0** on top of subscription (Claude Max / Pro).
*   **Time taken per video:**
    *   *The Volcano:* About **40 minutes** (16:24 → 17:05). Cost: **$0**.
    *   *The True Crime one:* A bit over **an hour** (09:35 → 10:42). Cost: **$0**.
    *   *The Stick Figure:* About **40 minutes** (10:51 → 11:33) — *included building the whole skill, style sheets, and references*. Cost: **$0**.
    *   *The Louvre:* **40 minutes** (15:43 → 16:25) with **28 credits** used for Hiksfild image generation.
*   **Pricing Subscriptions Mentioned:**
    *   **Free:** $0
    *   **Pro:** $17/month (annual) or $20 billed monthly. *Note: Smaller plans might hit usage limits faster.*
    *   **Max:** From $100/month (for people who work with Claude all day; no API, no extra cost).
*   **Failure Points & Fixes:**
    *   *Audio Balance Issue:* Scream/SFX drowning out voiceover. **Fix:** Script-checking loops ensuring individual line verification.
    *   *Copyright/Strike Risk:* Avoid re-voicing his script or copying shots directly. **Fix:** Claude writes a brand new script, checks Texas death row records, and builds original code-based 3D sets around camera angles.

---

### 5. Key Advice, Rules & Statements

*   **Copyright & Originality:** *"I could've maybe worked more on the sound effects, but being able to do this only from one prompt is actually truly amazing... And keep in mind, I didn't tell it anything. I'm like: 'Hey, you pick a story, you decide what you think would be good' and it just did that from these style references."*
*   **Monetization / Faceless Channels:** *"How do I actually make money with this? I'm not going to promise you a number. I don't want to be those type of people to tell you this is easy money. But there are three ways people are making money with faceless content right now: 1. Your own YouTube channel (YouTube Partner Program)... 2. TikTok... 3. [Unclear/Paid Offerings]."*