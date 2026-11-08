# Sharbel A., Paste This Into Claude Code, Never Run Out Of Tokens Again

https://www.youtube.com/watch?v=kHtOSJRUkLs

## Segment 00:00 to end

Here is the complete visual documentation of the provided video:

### 1. Tools, Apps, Websites, Models, Settings & Prices On-Screen

*   **[00:02] Claude Usage Limit Panel:**
    *   **Session (24h):** 100% (Red bar)
    *   **Weekly (7 day):** 75%
    *   **Usage Breakdown:**
        *   56% of usage from heavy sessions
        *   34% of usage at >100K context
        *   3% Tasks, 2% Explore
*   **[00:12] "The Audit Report" (Summary Dashboard):**
    *   **Scheduled Work:** `0 crons` | `1 triggers`
    *   **Cache:** `120 assistant turns`, `3,199 max tokens`, `137,212 output tokens`
    *   **Model Rate:** `85.2%` cache hit rate
    *   **Findings Table:**
        *   *Opus Effort High:* Severity Amber, Cost ~159k output tokens per 20-turn session
        *   *159 MCP Tools:* Severity Amber, Cost 5 servers / 54k tokens (26k GitHub, 20k Files, 12k Slack)
        *   *No PreToolUse Hooks:* Severity Amber
        *   *Cache Reuse:* Severity Green (2,640 read / 412k import)
        *   *Project Memory:* Severity Green (2,610 fixed tokens)
        *   *Subagents Inherit Opus:* Severity Green
*   **[00:16] Claude Code Tools Directory (`/mcp`):**
    *   **Connectors Listed:** Gmail, Slack, Google Calendar, Wrap Flow, AWS MCP, Clipkit, Wingify, Bronto, Google Drive.
*   **[00:17] Anthropic Documentation Page:**
    *   **Title:** *Claude Code Docs - Explore the context window*
    *   **Context Window Metric:** 19.7K / 1.0M (2%)
*   **[00:19] Usage Breakdown Window:**
    *   **Usage Limits:** 5-hour limit at 14% (Resets in 2 hr 54 min), Weekly at 13%
    *   **Usage Credits:** $0.00 of $80.00
    *   **Session Cost:** $13.11 | Active 1s | Opus 100% | Cache hit 84%
    *   **Breakdown:** Input 11.1k, Output 908, Cache read 5.8M, Cache write 1.1M
*   **[01:51] Context Window Breakdown Menu:**
    *   **Context Window:** 939.7k / 1.0M (94%)
    *   **Messages:** 899.5k (90.0%)
    *   **System tools:** 13.5k (1.4%)
    *   **MCP tools:** 12.2k (1.2%)
    *   **Skills:** 7.5k (0.8%)
    *   **System prompt:** 4.6k (0.5%)
    *   **Memory files:** 1.6k (0.2%)
    *   **Custom agents:** 314 (0.0%)
    *   **Free space:** 60.7k (6.1%)
    *   **System tools (deferred):** 127.3k
    *   **MCP tools (deferred):** 15.5k
*   **[03:21] Context Window Metrics (Before and After Clear):**
    *   *Before:* Messages at 82.2k (8.1%), Total context 110.4k / 1.0M (11%)
    *   *After `/clear`:* Messages at 137 (0.0%), Free space 970.0k (97.0%)
*   **[04:42] Command & Cost Popup:**
    *   `/model sonnet`
    *   `cache_creation 198,431 tokens` | `this turn $1.02`

---

### 2. Prompts and Code Shown On Screen

*   **[00:39 / 02:20] "THE TOKEN AUDIT" Prompt (Full text):**
    ```markdown
    THE TOKEN AUDIT
    Audit this setup for token waste. Report only.

    1 MEMORY:
    Every CLAUDE.md in scope: project, parents, user level, and @imports.
    Report each file's size in tokens.
    Flag any file over 5k, any total over 10k.

    2 TOOLS:
    List connected MCP servers and how many tools each exposes. Is tool
    deferral ACTIVE or NOT? Then check for a proxy or gateway and say so loudly.

    3 MODEL:
    Report the current model and effort level and where each is set. Flag
    any mode that changes model automatically during a session.

    4 HOOKS:
    List any PreToolUse hooks that rewrite noisy commands to produce
    less output. If there are none, say so.

    5 SUBAGENTS:
    Every agent file in the project and user agent directories. For each,
    report whether it sets an explicit model or inherits the session's.

    6 SCHEDULED WORK:
    Every cron, scheduled task and background job with its interval.
    Flag any one whose interval is longer than the cache lifetime.

    7 CACHE:
    Parse the newest session log. For every assistant turn sum cache_read,
    cache_creation, input and output tokens. Report each as a percentage.
    Output one table, sorted by cost:
    FINDING | SEVERITY | EVIDENCE | COST
    ```

*   **[07:08] "ASK FOR THE HOOK" Prompt (Full text):**
    ```text
    THE JOB:
    Set up a hook that stops noisy command output from filling up my context.

    WHAT TO CATCH:
    The commands that print a lot and tell me almost nothing I need: installs,
    builds, test runs, anything with a progress bar.

    WHAT TO KEEP:
    Rewrite those before they run so only the lines that matter come back.
    Errors, failures, and the final summary.

    WHAT TO LEAVE:
    Leave everything else alone. If a command is short, I still want the whole thing.

    WHERE TO PUT IT:
    Write the file, wire it up in my settings, then run one real noisy command
    and show me the before and after so I can see it working.
    ```

*   **Commands typed during video:**
    *   [03:07] `>/clear`
    *   [03:25] `clear` -> `/clear`
    *   [04:08] `>/rename token-audit`
    *   [04:11] `>/resume`
    *   [04:40] `>/model sonnet`
    *   [06:13] `>/model haiku`
    *   [09:00] `/mcp`
    *   [09:28 / 16:43] `/context`
    *   [15:35] `>/rewind`
    *   [16:55] `/usage`

---

### 3. Step-by-Step UI Actions Performed

1.  **[03:22] Clearing Session Context:**
    *   Type `clear` in the terminal prompt line -> Select `/clear` from auto-complete menu -> Press `Enter`.
    *   Context window updates instantly, dropping Messages from 82.2k down to 137 tokens.
2.  **[09:00] Managing Connectors:**
    *   Type `/mcp` into prompt line -> Press `Enter`.
    *   Modal overlay "Directory" opens showing *Skills*, *Connectors*, and *Plugins*.
    *   Scroll through list of connected services (Gmail, Slack, Google Drive).
3.  **[09:27] Inspecting Context Breakdown:**
    *   Type `/context` into prompt line -> Press `Enter`.
    *   Wait ~3s for cloud container to resume -> Context window breakdown popover appears in the bottom right corner.
    *   Click context drop-down arrow to expand details showing system tools, deferred system tools, and memory files.
4.  **[16:55] Checking Plan Limits:**
    *   Type `/usage` into prompt line -> Press `Enter`.
    *   Side panel expands showing 5-hour and Weekly plan limits, dollar cost, cache hit percentage, and detailed breakdown of active session usage.

---

### 4. Graphic & Motion Visual Style Description

*   **Color Palette:** Dark-mode background (`#0D0D0D` to `#161616`), stark white body text, bright crimson accent colors (`#E53935`) used for callout boxes, headers, and section labels.
*   **Typography:** Bold sans-serif block headers (Uppercase, tracked out), monospaced font used inside code block popups and terminal simulations.
*   **Layout & Framing:**
    *   The presenter appears in a rounded rectangle picture-in-picture box (bottom-right or top-right corner) during screen demonstrations.
    *   Title/Fix cards use a clean two-column split: Large bold title on the left, bulleted list or terminal mockups on the right.
*   **Motion & Animations:**
    *   **Bar charts [01:21]:** Step-wise bar growth animation representing turn-by-turn context expansion.
    *   **Text Cards [00:45]:** Smooth horizontal line draw with node pop-ins representing the step-by-step roadmap ("Seven Fixes").
    *   **Card Insets:** Terminal UI elements use subtle slide-in and drop-shadow elevation.

---

### 5. Numbers & Dashboard Analytics Shown

*   **[01:13 - 01:28] Token Accumulation Simulation (Turn-by-Turn):**
    *   *Turn 1 of 20:* 100 tokens sent
    *   *Turn 2 of 20:* 3,200 tokens sent
    *   *Turn 9 of 20:* 63,700 tokens sent
    *   *Turn 13 of 20:* 235,300 tokens sent
    *   *Turn 18 of 20:* 514,900 tokens sent
    *   *Turn 20 of 20:* 572,000 tokens sent (Total cumulative input across session)
*   **[01:38] File Read Impact:**
    *   1 file read once at turn 4 (3,000 tokens) × 37 remaining turns = **111,000 total paid tokens** for that single file read.
*   **[06:36 - 06:46] Terminal Output Token Accumulation (Tool Output):**
    *   49 lines = 715 tokens
    *   131 lines = 1,913 tokens
    *   295 lines = 4,307 tokens
    *   459 lines = 6,701 tokens
    *   623 lines = 9,096 tokens
    *   800 lines = **11,680 tokens** added to context.
*   **[08:12] Tool Cost Comparisons:**
    *   GitHub tool definition: **26,000 tokens**
    *   Slack tool definition: **21,000 tokens**
*   **[11:18] Subagent Cost Breakdown:**
    *   Burned inside subagent: **9,800 tokens**
    *   Saved in main context: **5,700 tokens**
    *   *Net outcome in single-turn isolation:* **Lost 4,100 tokens** (Subagents cost 4x to 15x more tokens overall according to Anthropic research papers shown at [11:33]).
*   **[15:44 - 15:56] Vision/Image Token Costs:**
    *   1 standard screenshot on Opus 5: **2,700 tokens**
    *   1 4K screen screenshot: **~5,000 tokens**
    *   PDF input: **1,500 - 3,000 tokens/page** (Plus visual renders = 2x multiplier).

---

### 6. Contradictions & Additions to Spoken Content

*   **[00:27] Spoken vs. Screen Metric:** Presenter states that only "0.01% of the bill was because of what I typed." The screen metric overlay at [00:27] confirms this exact number (`0.01%`).
*   **[05:32 - 05:46] Comprehensive List of Cache-Breaking Actions:** While the presenter verbally emphasizes model switching, the visual graphic lists **7 distinct cache-breaking actions**:
    1. Switching models
    2. Changing effort
    3. Turning on fast mode
    4. Connecting an MCP server
    5. A plugin that ships MCP
    6. Compacting
    7. Upgrading, then resuming.
*   **[06:00 - 06:09] Safe Actions List (Does NOT break cache):** Visually shown on screen:
    *   Editing files in your repo
    *   Editing your memory file
    *   Changing output style
    *   Changing permission mode
    *   Invoking skills and commands
    *   Recap / Rewind
    *   Spawning a subagent.
