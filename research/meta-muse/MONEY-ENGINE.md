# Money engine: automated creative video series, fastest dollar first

Goal (user, 2026-10-21): automate creative video series in any niche, style and format (Shorts, long form, UGC-style ads, carousels), choosing durations by audience and revenue type, and start with whatever makes money soonest.

Sources: all 27 studied videos (`watch/`, `transcripts/`, `watch/notes-batch-{A,B,C}.md`), the earlier reports, and three finished demo Shorts. Earnings figures below are the creators' own claims unless marked as checked.

## The core finding

**Almost none of the creators make their money the way their titles imply.** Across the nine newest videos, nobody shows AdSense or clip-view income:
- Penny sells a mastermind.
- Armstrong sells Syllaby, the tool he co-founded, which the video doesn't disclose.
- Jack Roberts runs an $87/month Skool group (3.3k members) plus a sponsor and affiliates.
- Massimo sells his own app.
- Jad and AIpreneur give away a skill or prompt to build an audience.

The money is in **selling production** (services, tools, templates) and in **owning an audience**. Platform payouts come later.

That favours us. The hard part, producing polished video at almost no cost per piece, already works here. Demo 3 is a 72 s Short built fully locally in about an hour of compute, with no API spend.

## Three lanes, run in parallel, ranked by speed to first dollar

### Lane 1: sell the production (first dollar in days)

The production capability exists today. What's missing is samples per offer, a place to buy, and outreach.

| Offer | Built with (all local, about $0 per piece) | Price anchors seen in the research |
|---|---|---|
| **3D / kinetic motion-graphics videos** (product launch, SaaS feature, podcast overlays, explainers) | HyperFrames + Three.js + Penny's prompt rules + critique loop | Penny compares $1.50 per 15 s of Seedance with his $0.05. Clients pay for the result, not the tokens. |
| **"Live" Instagram carousels** (every slide a looping video, cut on whole bars of a 120 BPM track) | HyperFrames + ACE-Step at 120 BPM + bar-aligned loops (Jad's rules) | New format with little competition; Jad's video drew about 13.6× his subscriber count in views |
| **Storytelling b-roll ads for e-commerce brands**, with no fake people | Kokoro VO over product shots, kinetic type, Three.js/parallax; 10 to 50 hook and angle variants from one asset bank | Human UGC creators run about $300/video (Massimo's figure). Variant volume is the selling point. |
| **Clipping for podcasters and streamers**, authorized footage only | Parakeet transcript → LLM picks the moments → ffmpeg 9:16 → HyperFrames captions and zooms → scheduling (`postiz` skill) | "$500 per 10 clips plus a views bonus" package (rZvF video); opt-in campaign platforms pay per 1k views |

How it gets sold:
- **Samples:** one per offer. Two exist already (demo 3 for motion graphics/explainers; demo 2 for cinematic history). Make the 3D showreel, a live carousel and one product ad next.
- **An offer page:** this repo is the SecretXperience site, so add a services page with the samples, packages and a contact form.
- **Outreach:** drafted by Claude, reviewed and sent by the user. Sending email or DMs goes out under the user's name, so it stays approval-gated.

### Lane 2: own the audience (first dollar in weeks, compounding)

One **series engine** feeds every platform from a single topic queue:

```
research (TubeLab or Gemini outlier mining) → topic queue → brief + ban list (reviewed)
  → script timed with Kokoro → asset bank (Three.js / code b-roll / parallax / ACE-Step)
  → format adapters:
       Short / TikTok / Reel 9:16, 45–75 s (the volume driver)
       long-form 16:9, 8–12 min (only for Shorts at 5× channel median)
       live carousel 4:5 (Instagram / LinkedIn)
  → critique loop (scores 8+) → master to −14 LUFS → publish (YouTube API / postiz) → analytics loop
```

Money before the YouTube Partner Program:
- **Lead magnet → own product.** This is the pattern every channel above uses. Examples: our HyperFrames presets, prompt packs or "make this Short yourself" kits, delivered via a keyword-in-comments funnel. It can earn in week 1 of posting.
- **Affiliate links** for the tools we demonstrate, where the programs allow it.
- **TikTok Shop affiliate product videos.** Build these from product cutouts with code-rendered motion and a Kokoro voice. Label them as AI and make each one genuinely different per product.

**Niche choice (still open).** The research now points two ways:
- **AI / dev-tools 3D explainers.** Hot right now: a Claude Code token video got 337k views on a 46k-subscriber channel, and Penny's 3D LLM explainers perform well. Strong RPM, and it doubles as a portfolio for Lane 1.
- **"How things in your home actually work" mechanism explainers.** The earlier recommendation: broad, evergreen, with an older long-form audience.

Recommendation: start with **AI/dev-tools explainers**, because every video is also a Lane 1 sales sample. Test the home-mechanism series as a second track once the engine runs unattended.

### Lane 3: platform revenue (months)

AdSense or YPP, Shorts revenue share, sponsorships and a paid community all come once there's an audience. The engine needs no changes for this; it's the same series, compounding.

## Running costs

- **Per video:** about $0 marginal. Local render, voice, captions and music all run on CPU.
- **Optional realism:** fal.ai pay-per-use for the few shots that need a real-looking person or product in motion. Kling 2.6 Pro is about $0.07/s and an image about $0.15, so roughly $0.50 per clip (checked against fal's pricing page). Generate stills first and animate only the winners.
- **Claude usage** is the main cost. Sharbel's rules apply:
  - Keep the model and effort fixed per session.
  - Use cheap models for routine subagents.
  - Schedule tasks more often than the about-1-hour cache window, or keep sessions minimal.
  - Filter noisy render logs.
  - Disable unused MCPs.

## Guardrails (non-negotiable; they protect the accounts that make the money)

- **No AI-person testimonials, staged AI "street interviews", or health claims.** These run into the FTC fake-review rule and Meta/TikTok rules.
- **No reupload or variant farms.** That means no flipping, recoloring or B-roll swapping to dodge duplicate detection, and no multi-account reposting. YouTube demonetizes "reused/inauthentic" channels.
- **Label realistic AI content** wherever a platform requires it.
- **Clip only footage we're authorized to use,** and never splice words to invent statements.
- **Commercial-safe licences only.** Check model weights, not just code. No MusicGen, OmniVoice, ElevenLabs free, Suno free, or ripped music.
- **Approval gates:** money, outreach and publishing to new platforms need the user's approval until rules are agreed.

## What the user needs to decide or provide

1. **Which Lane 1 offers to sell first**, and the price list. Suggested start: motion graphics + live carousels + b-roll ads.
2. **A payment method:** Stripe or PayPal account, or a storefront.
3. **Accounts:** a YouTube channel with Data API OAuth, plus TikTok, Instagram and LinkedIn as wanted; connect them for posting.
4. **The niche for the first owned series** (recommendation above).
5. **Whether outreach drafts may be sent automatically after a template is approved,** or each one reviewed.

## Next 7 days (what gets built without waiting)

1. **Day 1–2:** samples.
   - A 3D showreel (Three.js, glass, camera fly-through).
   - A 5-slide live carousel (120 BPM, bar-locked loops).
   - One product b-roll ad with 5 hook variants, using a made-up product to avoid trademark issues.
2. **Day 2–3:** a services page on the SecretXperience site with the samples and packages, as a draft PR for the user to review.
3. **Day 3–5:** the series engine as reusable skills/presets.
   - Steps: series spec → brief → script → render → critique → master, plus Short, long-form and carousel adapters, and a ban-list registry.
   - Proof: produce the first 5 episodes of the chosen niche.
4. **Day 5–7:** the publishing and analytics loop (YouTube API / postiz) once accounts are connected, plus a lead-magnet product (a preset pack) and its comment-keyword funnel.
