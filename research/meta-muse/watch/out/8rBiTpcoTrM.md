# Jack Roberts, I Tested the Viral Reverse Engineering Repo

https://www.youtube.com/watch?v=8rBiTpcoTrM

## Segment 00:00 to end

Here is the visual context and detailed technical breakdown for the provided video segment:

### 1. Tools, Apps, Websites, Repos, Models, Prices & Settings Shown On Screen

*   **[00:01] Viral App Cloner Graphics:** Graphics show icons for Photoshop, Calendly, Typeform, Google, and Python/Anaconda being copied into a "Cloned" folder.
*   **[00:05] Subscription Cost Breakdown:**
    *   Calendly: **$12/mo**
    *   Typeform: **$39/mo**
    *   Trello: **$6/mo**
    *   Total Savings Graphic: **$684 saved every year**.
*   **[00:11] App Valuations Graphics:**
    *   Calendly: **$3B** (Valued 2021)
    *   Typeform: **$935M** (Valued 2022)
    *   Trello: **$425M** (Sold 2017)
    *   Combined Value: **$4B+**.
*   **[00:25] Web Page - "Reverse engineer anything":** Custom web interface by Jack Roberts showcasing reverse engineering topics and news.
*   **[00:26] Web Page - "AI is taking apart everything":** Grid view of software/apps being deconstructed (Photoshop, After Effects, Higgsfield, Halo CE, Dell Monitor, DX-Ball, Whisper Flow, Apple TV remote, Game mods).
*   **[00:41] Web Page - "How good is it, really?":** Shows Adobe Photoshop product page vs. cloned interface ("The Great Wave").
*   **[00:52] Web Page - "Your agent watches an app and explains it":** Explains REA (Reverse Engineering Agent) breakdown of UI, Logic, and Data.
*   **[01:06] Social Media Screenshots (X/Twitter):**
    *   Post by *@TalaFreako* (Oct 6, 2026, 651.8K views): *"AI game development is getting absurd."* (Terraria in 3D).
    *   Post by *@Aman* (@mdaman011, Sep 27): *"AI game modding is getting ridiculous..."* (Spider-Man in GTA/GTA-style environment using Opus 5.5).
*   **[01:15] Web Page - "You pay for software every month":** Interactive pricing comparison metric:
    *   Average software spending stats based on C+R Research (1,000 people surveyed): guessed **$86/mo**, actual average **$219/mo** ($2,628/year).
*   **[01:24] Web Page - "Three apps worth over $4 billion":** Feature showcase highlighting Calendly ($3B), Typeform ($935M), and Trello ($425M) inside Base44.
*   **[01:42] Web Page - "You don't need REA for this":**
    *   Methodology diagram (Toolbox -> Method: 1. Evidence first, 2. Then explain, 3. Then rebuild).
    *   Prompt checklist: 1. Every screen, 2. What you can do on each, 3. The rules: seen or guess, 4. The data it stores, 5. What's still unknown.
    *   Model selected on page: **Opus 5.5**, **Claude 3.5 Sonnet**, **Base44**.
*   **[01:53] Web Page - "AI doesn't need all of this":**
    *   REA size comparison: **422,000 lines of code** total vs **789 lines** of core method method in TypeScript.
*   **[02:02] Notion Document:** Title: *"Reverse engineer an app from the outside (REA method, no install)"*.
*   **[02:18] Base44 Dashboard (App Builder):**
    *   App URL: `app.base44.com`
    *   Greeting: *"Hi Jack. What will you build next?"*
    *   Model Dropdown Selected: **Opus 5.5**.

---

### 2. Visible Prompts & Code Reproductions

*   **[02:03] Full REA System Prompt (from Notion):**
```text
Reverse engineer an app from the outside (REA method, no install)

Inputs:
- The app's name, and screenshots or screen recordings of a fresh account from your own account for its public pages.
- No screenshots? Ask for them when needed or rebuild an interface/app.

Rules:
- Only study seats you have access to. Never get around a paywall, a paid feature...
- Guess what the app does. How it's written in code: UI, logic, data, missing...
- Guess what you see: separates logic from guesses.

Steps (in this order):
1. Checklist first. Turn the screenshots/recordings into a list of questions, and the evidence each answer comes from.
2. Feature by feature. Rebuild UI, logic, and data.
3. Check the list again. Make sure all steps work.
4. The build spec. Write a prompt for an app builder from the specs. Never say "this app", write "build this".

Output:
- The checklist with its status
- A findings table: Feature | UI | Logic | Data | Notes
- The build spec, ready to paste into an app builder under a header "Build Spec"

One-paste prompt (any chat that takes images):
Reverse engineer an app from the outside. You're analyzing screenshots and video to rebuild it.
1. First, write a checklist of what I need to know to rebuild it: every screen, every action on each, the rules, data stored, and what's still unknown.
2. Walk through every screen you see and answer the list. Mark what's visible vs guessed.
3. List the data the app stores: objects, fields, and relationships.
4. Check the list again. Ask about missing screens/features if needed.
5. Then write the build spec: screen by screen, step by step. Write it for an app builder like Base44. Not for decompiling app files for that, see REA (github.com/mott/rea). Never say "this app", write "build this".
```

*   **[02:44] Calendly Rebuild Prompt in Base44:**
```text
I want to go ahead and recreate Calendly for me, the booking system, based on the screenshot. I'll give it a different name, but I want to have all of the core functionality. Thank you.
```

*   **[05:26] Edit Meeting Feature Prompt in Base44:**
```text
I would really like the ability to edit the information on my own individual meetings and edit that so it had like emojis and basically dictate questions as and when they set those up please.
```

*   **[07:43] Typeform Rebuild Prompt in Base44:**
```text
Hey I want you to go ahead and build for me, please, this version of Typeform. I'm going to attach a screenshot, see if you can recreate the functionality, give me the ability to create forms so I can cancel my subscription and no longer have to pay for it.
```

*   **[11:08] Typeform Enhancement Prompt in Base44:**
```text
Hey there, go ahead and add for me a preview mode and add me one further question type.
```

---

### 3. Step-by-Step UI Actions

*   **[02:18]** Navigates to `app.base44.com`.
*   **[02:27]** Pastes the REA prompt method into the prompt text area.
*   **[02:31]** Takes a screenshot of a live Calendly booking page (*"A Very Good Dog Grooming - Dog Nail Trim & Wash"*).
*   **[02:40]** Pastes the Calendly screenshot into Base44 along with the recreation prompt and clicks **Build**.
*   **[03:14]** Clicks **Publish** on top right of Base44 editor, sets visibility to **Public**, and clicks **View app**.
*   **[03:26]** On the generated app home page ("Slot"), clicks **Check your dashboard**, leading to the login/auth page.
*   **[03:33]** Clicks **Continue with Google** to authenticate.
*   **[03:48]** In the generated app's dashboard, toggles weekly availability switches (disabling Tuesdays, Thursdays, Fridays, etc.), sets time slot duration to **15 min**, and clicks **Save hours**.
*   **[04:10]** Clicks **Copy link** next to "15-minute meeting" and opens it in a new browser tab.
*   **[04:28]** Selects a date (**October 15**) and a time slot (**9:30 AM**), clicks **Next**, enters test details (`wmpgmzg` / `wmpgmzg@FOO.COM`), and clicks **Confirm booking**.
*   **[04:50]** Opens Gmail inbox showing the real-time automated email confirmation: *"New booking: You have a new booking - Thursday, October 15, 2026 at 10:30 AM"*.
*   **[05:37]** Returns to Base44 editor, enters the edit meeting feature prompt in the chat panel, and clicks send.
*   **[06:06]** Refreshes/views updated app dashboard, clicks the newly added **Edit** button on a meeting card.
*   **[06:09]** Modifies meeting description (`HEY THERE!`), adds custom guest question (`Is your annual revenue?`), checks **Required**, and clicks **Save meeting**.
*   **[07:27]** Copies the REA system prompt again from Notion.
*   **[07:41]** Enters prompt in Base44 to clone Typeform, attaches a screenshot of Typeform's template page, and clicks **Build**.
*   **[08:25]** Clicks **Publish** in Base44, sets visibility to **Private**, then clicks **View app**.
*   **[08:48]** Logs into the generated "Ask" app via Google OAuth.
*   **[08:58]** Clicks **+ New Form**, types title *"The Giant coffee questionnaire"*, adds a **Multiple choice** question (*"How many coffees do you drink every day?"*), a **Short text** question, and a **Rating 1-10** question (*"how cool is coffee?"*), then clicks **Save**.
*   **[09:47]** Clicks **Share** -> **Public link copied**, opens link in a new tab, submits answers to the form, and returns to dashboard.
*   **[10:07]** Clicks **Results** tab in "Ask" dashboard to review live response analytics and bar charts.
*   **[11:08]** Sends follow-up prompt in Base44 to add preview mode and a yes/no question type.
*   **[12:34]** Reviews cloned Trello app ("Lanes") generated in Base44, logs in via Google, opens "Demo board - Spring launch", creates a new card *"heyyy pet dexter"*, adds a cover image, sets a due date, and adds a checklist item.
*   **[13:37]** Clicks **Invite** on "Lanes" board, enters email address, and receives an instant email invite in Gmail to join the board.

---

### 4. Visual Style & Motion Graphics Details

*   **[00:00 - 00:24] Intro Graphics & Visuals:**
    *   **Style:** Dark mode UI vector graphics with glowing blue/neon accents. Soft spring-physics movement for floating app icons.
    *   **Layout:** Central glowing folder icon receiving floating inputs from popular SaaS icons.
    *   **Typography:** Bold serif/sans-serif mix for financial figures ($684, $4B+).
    *   **Color Palette:** Charcoal black (`#0B0C10`), electric blue, white, and neon green accents.
*   **[01:15 - 01:40] Interactive Spending & Comparison Widgets:**
    *   Horizontal bar charts comparing user guesses vs real spending values with smooth numeric counter animations ($4 -> $88 -> $201 -> $219).
*   **[04:44 - 05:05] Transition Animations:**
    *   Fast screen cuts between browser tabs with custom sound effects on button clicks. Screen-recorded UI overlays feature clean pop-ups and dark/light mode switches.

---

### 5. Numbers Shown on Dashboards & Analytics

*   **[00:05]** Subscription savings: **$684 saved every year**.
*   **[00:11]** Company valuations: Calendly **$3B**, Typeform **$935M**, Trello **$425M** -> Combined: **$4B+**.
*   **[01:16 - 01:21]** Monthly software cost stats:
    *   Guessed average: **$86/mo**
    *   Actual average: **$219/mo** (**$2,628/a year**).
*   **[01:55]** Lines of code comparison: REA total repository = **422,000 lines of TypeScript**; REA core method = **789 lines**.
*   **[06:32]** Agentic OS Dashboard metrics shown:
    *   Cash on hand: **$1,000,000**
    *   Monthly Income: **$400,000**
    *   Revenue Target: **80% ($1,200,000)**
    *   Audience stats: YouTube **284,600**, Instagram **192,400**, TikTok **163,400**, LinkedIn **8,420**.
*   **[10:08]** Form Results Analytics Dashboard:
    *   Views: **1**, Starts: **1**, Submissions: **1**, Completion Rate: **100%**.

---

### 6. Contradictions & Additional Visual Details

*   **[01:06]** The X/Twitter post screenshot dated *"Oct 6, 2026"* is a mocked or futuristic placeholder date used in the presenter's presentation deck.
*   **[03:23]** The generated app "Slot" automatically includes full OAuth (Google, Microsoft, Facebook, Apple) and full database schema generation out of the box, even though the user only provided a single visual screenshot and a 2-sentence prompt.
