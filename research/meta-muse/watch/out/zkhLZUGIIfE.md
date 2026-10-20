# The_Frizzy1, I Replaced Higgsfield Genjutsu With My RTX 3060

https://www.youtube.com/watch?v=zkhLZUGIIfE

## Segment 00:00 to 08:00

Certainly, here's a detailed report on the visual information from the video:

### 1. Tools, Apps, Websites, Repos, Models, Plans, Prices, and Settings
* [00:23] Website: **higgsfield.ai**
* [00:23] Tool: **HIGGSFIELD GENJUTSU**
* [01:42] Model Name: **MINIMAX H3 REF2VA**
* [01:43] Config Table: **MiniMax H3 - reference to video**
    * Model: **Ref2VA lora**
    * Video 1: **the moves**
    * Picture 1: **the character**
    * Sound: **kept**
* [02:04] Character Sheet Title: **QWEN IMAGE 2.1 TURBO · 8 STEPS · 19 S**
* [02:56] Character Swap Lora Name: **CHARACTER SWAP LORA · 155 MB**
* [03:41] Tool Setting: **BOX MODE**
* [03:51] Workflow Setting: **WHO-TO-REPLACE SETTING · NO MASK, NO BOX**
* [05:17] Info Bar: **RTX 3060 12 GB · COMFYUI 0.39.2 · 0.4 MP**
* [06:50] Installation Screen: **INSTALLING COMFYUI ON MY LAPTOP - COMFY.ORG**
* [06:53] Website: **comfy.org**
* [07:02] Model Name: **MINIMAX H3 - OPEN ON GITHUB**
* [07:08] Repo Path: **COMFYUI / MODELS / FILES FROM COMFY-ORG/MINIMAX-H3 + AKATZ-AI (THE SWAP LORA)**
* [07:09] File Structure:
    * **diffusion_models /**
        * **minimax_h3_ref2va_pruned_bf16_comfy.safetensors (21.0 GB)**
    * **text_encoders /**
        * **qwen2-vl_730m_minimax_h3_output_seq.safetensors (15.7 GB)**
    * **vae /**
        * **minimax_h3_video_vae_bf16_comfy.safetensors (2.8 GB)**
        * **minimax_h3_audio_vae_fp32.safetensors (0.6 GB)**
    * **loras /**
        * **Ref2VA turbo LoRA (4 steps).safetensors (2.0 GB)**
        * **h3_character_swap_v1_600.safetensors (155 MB)**
* [07:54] Repo Filename: **MY GITHUB · THE WORKFLOW FOLDER · FILES: DOWNLOADS.MD + WORKFLOW.JSON**

### 2. Prompts and Code
* [00:28] Prompt Field (Higgsfield): **A man in a black tracksuit dancing in the snow**
* [03:51] "Who-to-replace" Prompt: **"BALD MAN IN THE BLACK T-SHIRT AT THE BACK"**

### 3. UI Actions
* [00:23] Navigates to **higgsfield.ai** and clicks on the **Genjutsu** menu option.
* [00:28] Scrolls through the **Motion Library** on Higgsfield.
* [06:53] Navigates to **comfy.org** and clicks the **Get Started** button.
* [06:55] Runs the ComfyUI installation wizard.
* [07:54] Navigates to a GitHub repository to download **DOWNLOADS.MD** and **WORKFLOW.JSON**.

### 4. Generated Video, Motion Graphics, and Thumbnails
* [00:00] Side-by-side comparison layout: **THE ORIGINAL** (left) vs. **LOCAL SWAP - MY RTX 3060** (right).
* [00:58] Explainer graphics: Uses a yellow background with simple boxes and arrows to show inputs (Video 1 + Picture 1) and output (New character with same moves).
* [01:21] Information boxes (Red/Green/Grey):
    * **HOW - kept** (moves, timing, camera, sound)
    * **WHO - changed** (face, body, outfit)
    * **CLOUD VERSIONS HIDE WHO’S IN THE CLIP**
* [02:04] Character sheet thumbnails: Shows a 3-way view (front, back, face close-up) of the characters (Dog, Penguin, Raccoon, etc.) in a red-bordered box.
* [02:38] Comparison layout: **THE MEME** vs. **NO LORA - 7:31**. Failed attempt labeled with a large **TOTAL FAIL** stamp.
* [03:11] Infographics bar: Horizontal bar charts comparing video lengths (Gold Outfit Dance, Detstvo Dance, Wrestler Flip, Van Exit, Wheelbarrow, Backbend) showing full length vs. one 5.2s pass.
* [04:20] Workflow diagram: Visualizes "Pass by Pass" rendering with overlapping frames highlighted in white (**the 22 frames it continues from**).
* [05:24] Final Montage: 6 split-screen videos (original vs. swap) with top-bar info showing original clip length, number of passes, and total render time. Captions use red backgrounds (e.g., **1/6 · WHEELBARROW → PENGUIN**).
* [06:14] Title Card: **THE OPENING MEME** in bold black letters on a yellow grid background.

### 5. Numbers from Dashboards or Analytics
* [02:04] Render times for character sheets: **19 S**, **15 S**, **20 S**, **20 S**, **14 S**.
* [02:44] Total render time for failed attempt: **7:31**.
* [03:06] Render time for 5-second clip (4 turbo steps): **9:55**.
* [03:12] Render time for 5-second clip (20 steps): **35:10**.
* [03:23] Render time for Penguin clip: **8:37**.
* [03:29] VRAM Usage: **VRAM 11618 MiB (95 %)**.
* [03:29] System RAM Usage: **RAM 19.72 GB**.
* [04:02] Render time for "One Sentence" fix: **4:00**.
* [04:31] Frame Grid Logic: **124 FRAMES = 17 x 7 + 5 = 5.17 S**.
* [04:59] Render time for Wheelbarrow (6.7s, 2 passes): **11:56**.
* [05:04] Render time for Full Dance (9.8s, 3 passes): **17:27**.
* [06:21] Render time for Snowball Fight: **12:18**.
* [06:28] Render time for Detstvo Dance: **11:05**.
* [07:50] Peak System RAM: **MINE PEAKED AT 23.05 GB**.

### 6. Contradictions or Additional Visual Information
* [03:29] The presenter mentions "about 20 gigabytes of system RAM," and the dashboard shows it peaking at **19.72 GB** during that specific clip.
* [07:11] The visual file tree provides exact file sizes and names for the required models that aren't all mentioned by name in the audio.
* [07:50] The screen shows a requirement for **32 GB SYSTEM RAM** even though the actual peak shown was **23.05 GB**, suggesting a buffer is necessary.


## Segment 08:00 to 10:36

Certainly! Here is an exhaustive report of the visual details in the video clip from 08:00 to 10:36.

### 1. Tools, Apps, Models, and Settings
* **[08:00] Workflow Interface:** "CORE COMFYUI NODES ONLY - NO CUSTOM NODES" displayed at the top.
* **[08:00] Node Name:** "MiniMax H3 Character Swap".
* **[08:00] Settings in Node:**
    * model: `Ref2VA.m83`
    * LoRA: `Character Swap - 155 MB`
    * loop: `5 s passes - 33 frames overlap`
    * steps: `4 turbo`
    * sound: `the original`
* **[08:02] New Node:** "Load video" with input field "the meme clip".
* **[08:03] New Node:** "Load character" with input field "the sheet".
* **[08:04] New Node:** "Who to replace" with text input "one sentence".
* **[08:09] New Node:** "Seconds" with input field "how long".
* **[08:11] New Node:** "Save video" with description "with the original sound".
* **[08:12] Setting Overlay:** "MEGAPIXELS = THE TIME KNOB - I USED 0.4".
* **[08:16] Setting Overlay:** "SECONDS 0 = THE WHOLE CLIP".
* **[08:21] Setting Overlay:** "TURBO OFF = 20 STEPS; 35:10 FOR 5 S".
* **[08:37] ComfyUI Sidebar:** Filename `The_Fizzy...h3-character-swap-v1.1.json`.
* **[08:39] Dashboard Settings:**
    * Who to replace: `person in the red jacket getting out of the van`
    * Seconds (0 = whole clip): `5.0`
    * Megapixels: `0.4`
    * Turbo (4 steps): `true`
    * Keep the original sound: `true`
    * Seed: `42`
    * Model: `minimax_h3_ref2va_pruned_int8_convout.safetensors`
    * Text encoder: `qwen2vl_32b_minimax_h3_rvf...`
    * Video VAE: `minimax_h3_video_vae_int8_c...`
    * Audio VAE: `minimax_h3_audio_vae_fp32.s...`
* **[08:49] File Structure Note:** "MY FILES SIT IN A MINIMAX-H3 SUBFOLDER".
* **[08:52] Version Note:** "V1.0: LOADERS INSIDE, SET THEM BY HAND".
* **[08:59] Version Note:** "V1.1.0: EVERY MODEL LOADER ON THE MAIN NODE".
* **[09:08] Hardware Note:** "THIS VAN CLIP: 10:53 ON MY 3060".
* **[09:17] Constraint Overlays:** "SHORT SHOTS: 4-5 S WORK BEST", "ONE PERSON AT A TIME", "CUTS IN THE CLIP CONFUSE IT".
* **[09:32] Hardware Specs:** "RTX 3060 - 12 GB".
* **[09:42] Privacy/Cost Notes:** "NO CREDITS - NO UPLOAD", "NOTHING BLOCKED".

### 2. Prompts and Code
* **[08:04] Prompt Example:** "the big man in the gold outfit".
* **[08:39] Active Prompt:** `person in the red jacket getting out of the van`.
* **[08:39] File Paths:**
    * Video: `genjutsu_demo_van1.mp4`
    * Character: `genjutsu_demo_raccoon.png`

### 3. UI Actions
* **[08:37] Setup:** Presenter zooms into the ComfyUI workspace.
* **[08:38] Video Upload:** Clicks "Choose file to upload" in the "Load video" node.
* **[08:40] Character Upload:** Clicks "Choose file to upload" in the "Load character" node.
* **[08:42] Model Selection:** Clicks the dropdown for "Model", "Text encoder", "Video VAE", and "Audio VAE" to select the correct files from the `minimax-h3` subfolder.
* **[08:46] Execution:** Clicks "Queue" (or "Run") at the top right of the ComfyUI interface.
* **[09:07] Monitoring:** Switches between the simplified main node and the complex back-end node graph to show processing progress.

### 4. Visual Style and Motion Graphics
* **[08:00] Intro/Outro Style:** Bright yellow background with a subtle grid pattern. Bold, black sans-serif typography with red highlights ("ONE WORKFLOW, FREE"). 
* **[08:01] Animation:** Nodes slide in from the left and right, connected by smooth, colored bezier curves (noodles).
* **[08:11] In-UI Previews:** Small video windows appear next to the "Save video" node showing "before" (man in red jacket) and "after" (raccoon in red jacket) footage.
* **[09:14] Graphic Overlays:** Dark semi-transparent overlays with large white and red text appear over video clips to describe limitations.
* **[09:25] Summary Screen:** A collage of six square video clips (raccoon face swaps in various scenarios: pouring concrete, exiting a van, wrestling, dancing) appears on the yellow grid background. Text labels ("KEEP HOW IT MOVES", etc.) slide in with a typewriter-style effect.
* **[09:47] Talking Head:** High-quality, shallow depth-of-field shot of the presenter in a studio/office. He wears a beanie and glasses. Neutral color palette (beige, black, white).
* **[10:16] End Card:** Two black "TV screens" on the yellow grid background for "Watch This Next" and "Next Video". Text links at the bottom: "SUBSCRIBE", "BUY ME A COFFEE", "LINKS IN THE DESCRIPTION".

### 5. Numbers and Analytics
* **[08:21] Performance Benchmarks:** 
    * 5 seconds of video takes 35 minutes and 10 seconds with Turbo off (20 steps).
    * 5 seconds of video takes 9 minutes and 55 seconds with Turbo on (4 steps).
* **[09:08] Actual Run Time:** `10:53` (minutes:seconds) for the van clip on an RTX 3060.
* **[09:32] VRAM Usage:** `12 GB`.

### 6. Additions to Speech
* **[08:12] Clarification:** The visual text explains that "Megapixels" acts as a "time knob," which is a metaphorical explanation not fully detailed in the audio.
* **[08:48] Structural Note:** The screen highlights that the files must be in a specific `minimax-h3` subfolder for the workflow to find them automatically, providing critical setup information not explicitly spoken.
* **[09:18] Source Credit:** The visual notes that the advice on clip length and complexity comes directly "FROM THE CHARACTER SWAP LORA'S OWN MODEL CARD".
