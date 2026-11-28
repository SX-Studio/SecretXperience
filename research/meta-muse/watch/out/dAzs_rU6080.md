# Nick Saraev, Viral GitHub repo that reverse engineers anything

https://www.youtube.com/watch?v=dAzs_rU6080

## Segment 00:00 to 08:00

1. **Tools, apps, websites, repo, model name, plan name, price or setting shown on screen**
   - [00:03] GitHub repository page: `REA: Reverse Engineer Anything` / `npm v6.3.0`, `CI failing`, `MCP tool catalog`, `Node.js requirements`, `4 Skills`, `1.4K license MIT`, `Discord 1k` / `GITHUB TRENDING #1 Repository Of The Day` / `Website`, `Guides`, `Showcases` / `Quick start`, `How REA works`, `What you can analyze`, `Showcases`, `FAQ`, `Documentation` / command: `npx rea-agents setup`
   - [00:15] X (Twitter) post by @alexfunk (Oct 9): `github.com/a-funk/open-ap...` / Siki Remote Lab UI (byte reports: bit 0 to bit 15, byte reports (changed bytes in blue))
   - [00:22] X (Twitter) post by @JG_CSTT (Crowdsource The Truth): `REA REVERSE ENGINEER ANYTHING` / Terminal window showing `rea analyzer -sample.bin` (Decompiler / Ghidra view)
   - [00:38] Whiteboard graphic: `Software is done` / 4 tweet cards: Matthew Berman (`Reverse Engineer Anything. Software is done.` 2.0K views · Oct 8), Anjad Mased, Replit CEO (`...absolutely insane. Pretty soon all software will be de facto open-source.` 1.3K views · Oct 7), International Cyber Digest (`Software is dead, long live software!` 41K views · Oct 8), Jaden Williams (`God help us all.` 11K views · Oct 9)
   - [01:09] Whiteboard diagram: `How REA works` / Stick figure asking `How does this feature work?` pointing to `your agent` -> `REA` -> 3 tools: `Ghidra · Hopper · IDA`, `Chrome DevTools`, `app code reader`
   - [02:09] Terminal/CLI (`Claude Code v0.21.295`, model: `Opus 5.3 (3M context)` with `high effort` - Claude Max / `/business /frc`)
   - [02:45] Documentation summary table:
     - Target: Native binaries (Ghidra 11.4), Works (Ghidra installed), Native binaries (Hopper / IDA), Works (not installed, optional)
     - CLI: `/home/nombre/bin/rea`
     - Config: `~/.claude/claude_json` -> `mcpServers.reverse-engineer-anything`
     - How-to: `Ask Claude how to figure out how feature X works in /Applications/Foo.app.`
     - UNDO: `Remove the global mcp file to module node_modules/.bin/rea, backup ~/.library/Developer/CommandLineTools/usr/include/swift/, so it can be put back.`
   - [03:00] macOS dock with Preview app icon, terminal windows (`Claude Code v0.21.295`, Claude Max)
   - [03:09] Preview app window displaying "HOLY SUIT // ATTACK ON TITAN SEAS..." image (Titan attacking human)
   - [03:15] macOS inspector / file info panel (`Preview.app/Contents/version.plist`, architecture: `/real tipa thin arm64`)
   - [03:21] Preview app top menu: `File`, `Edit`, `Tools`, `Adjust Color`, `Annotate`, `Export`, `Share`, `Close`
   - [04:09] Code editor split screen showing Swift code (`Import AppKit`, `class AppDelegate: NSObject, NSApplicationDelegate`, `PDFContainerController.swift`)
   - [04:15] Generated Preview app window displaying gradient wave background (`photo.jpg`, toolbars with zoom, annotate, crop)
   - [05:33] GitHub repository page: `ghidra` (National Security Agency / ghidra) / Language stats: Java 64.9%, C++ 21.0%, Python 5.8%, C 5.6%, Shell 1.7% / Contributors 430
   - [05:43] Hopper Disassembler website (`Hopper`, `Try It Free`, `Buy Now`, `Everything You Need for Reverse Engineering`)
   - [05:50] Hex-Rays website (`IDA Pro`, `The original disassembler`, `Get started with the IDA version that fits your needs`, `Get IDA`, `Download IDA Free`)
   - [06:27] X (Twitter) post by @chasm (Sep 27): `AI HACKERS HAVE PUT SKATEBOARDING IN CALL OF DUTY MODERN WARFARE 2! THIS HAS GONE TOO FAR.` / Video of character skateboarding on airport tarmac
   - [06:36] Gameplay footage: Minecraft-style landscape with Attack on Titan characters and HUD (`NAPE CUT`, health bars, X2 CHAIN)
   - [06:50] Whiteboard graph: `How fast it grew` / New GitHub stars each day: Oct 9 (1.4K), Oct 6 (3.6K), Oct 5 (3.7K), Oct 7 (5.6K), Oct 8 (10.8K), Oct 9 (19.4K), Oct 10 (21.7K) / Total badge: `66.8K stars in total` / `top of GitHub Trending` / `first big post on X: 312K views` (@_vnbps, Oct 4) / `Most of the stars came in one week.`

2. **Prompts or code shown on screen**
   - [02:12] Terminal prompt: `> hey go download reverse engineer anything (REA) and let me know when you're done.`
   - [02:35] Terminal shell command: `npm install --global rea-agents@0.3.6-41 --tail -5; which rea; rea --version 2>&1 | head -3`
   - [02:39] Terminal command: `rea setup-client claude-code --dry-run --json 2>&1 | head -150`
   - [02:56] Terminal prompt: `> use REA to rebuild the "Preview App" on my Mac`
   - [03:51] Terminal prompt: `> Without using REA, rebuild the Mac "Preview" App (the photo viewer) one and then serve me the result. You can do this however you see fit.`
   - [04:09] Swift code:
     ```swift
     import Appkit
     import UniformTypeIdentifiers
     // ...
     @MainActor class AppDelegate: NSObject, NSApplicationDelegate {
     ```

3. **Step-by-step UI actions the presenter performs**
   - [02:11] Types prompt into Claude Code CLI tool in terminal.
   - [02:55] Types prompt to rebuild Preview app using REA in terminal.
   - [03:00] Clicks Preview app icon in macOS dock to open it.
   - [03:14] Clicks toolbar buttons in Preview app (i button, zoom out/in, annotate tools).
   - [03:49] Types prompt to rebuild Preview app *without* using REA in Claude Code CLI.
   - [04:15] Interacts with the newly generated app window displaying the gradient wave background and drawing annotations.

4. **Generated video, motion graphics or thumbnails style**
   - [00:38] Whiteboard animation style: hand-drawn black outlines, pastel-colored rectangular cards (yellow, orange, purple, pink) with drop shadows, crisp black sans-serif typography, clean white background.
   - [01:09] Whiteboard diagram style: sketchy stick figure, purple rounded rectangle node (`REA`), black connector arrows with hand-drawn wobble, clean green background.
   - [06:50] Hand-drawn bar chart style: vertical yellow/beige rectangular bars with rounded tops, handwritten numbers above each bar (`1.4K`, `3.6K`, etc.), orange badge callouts with black drop shadows.

5. **Numbers shown on dashboards or analytics**
   - [00:03] npm v6.3.0, Skills 4, license MIT, Discord 1k
   - [00:22] 1K views, 2K Reposts, 28.5K Likes (X post)
   - [00:38] 2.0K views (Matthew Berman), 1.3K views (Anjad Mased), 41K views (International Cyber Digest), 11K views (Jaden Williams)
   - [06:27] 7.5M views, 2.4K reposts, 28.5K likes
   - [06:50] Stars per day: 1.4K, 3.6K, 3.7K, 5.6K, 10.8K, 19.4K, 21.7K. Total stars: 66.8K. First post views: 312K.

6. **Contradictions or additions**
   - [05:27] Presenter points out that REA relies on underlying tools like Ghidra (released by NSA in 2019), Hopper, and IDA Pro, which are years or decades old, demonstrating that REA is simply an agentic wrapper providing a simplified interface to existing reverse engineering tools rather than a completely novel technological breakthrough.


## Segment 08:00 to 10:46

1. Every tool, app, website, repo, model name, plan name, price or setting that appears ON SCREEN:
* [08:27] Presentation slide title: "REA: Reverse Engineer Anything"
* [08:27] Grid of 20 smaller diagram slides illustrating the reverse engineering workflow.

2. Every prompt or code shown on screen:
* [08:27] Diagram thumbnails contain text labels such as "Software & Apps", "What is REA?", "How to start", "Tools you need", "The REA loop", "UI to code", "Design to code", "Logic & APIs", "Data & storage", "AI agents", "Test your app", "Iterate fast", "Scale it up", "Common pitfalls", "Thoughts you might have", "What's next?", "Final thoughts", "Thank you".

3. Step-by-step UI actions the presenter performs:
* none

4. For any generated video, motion graphics or thumbnails shown:
* [08:27] Slide layout: A 4x5 grid of white rectangles with black handwritten-style diagrams and text on a light green background, with a webcam feed of the presenter in the bottom right corner.

5. Any numbers shown on dashboards or analytics:
* none

6. Anything on screen that contradicts or adds to what the presenter says:
* [08:27] The slide deck provides a structured 20-step visual outline of "Reverse Engineer Anything" that parallels the spoken discussion.
