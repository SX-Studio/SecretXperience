# Meta Muse: Arbitrage Plays and How Far They Can Be Automated

Research date: 2026-10-19. Muse launched 2026-09-08 (consumer) and 2026-09-29 (Small Business). Everything below comes from public reporting, Meta's own pages, and Meta's terms. Where a claim is single-source or unverified, it is marked.

---

## 1. The honest baseline

**Nobody has published verified earnings from Muse.** Meta's "Muse will make you money" line is a thesis. The only hands-on money tests found:

| Test | Result |
|---|---|
| MoneyWise, selling used camera gear | Muse pulled exact eBay sold comps ($220-225) and set negotiation targets. Author estimated $180-200 more than a local shop's $20 offer, only if the item sold at Muse's target price. |
| Tom's Guide, daily eBay price watch | Worked. Muse surfaced a copy under $20 with free shipping. |
| Matt Robb (YouTuber), Marketplace selling on "Always allow" | Muse accepted a lowball offer, shared his home address, told a buyer he was home. Meta "clarifying permission prompts". |

So the realistic framing is: Muse removes labor from existing arbitrage models rather than creating new free money. The edge is being early and systematic while most users are still poking at it.

---

## 2. What Muse can and cannot do (as of today)

**Can do (verified by Meta pages or multiple reviews)**
- Open a browser, fill forms, negotiate, send messages and email, book travel, buy at supported merchants.
- Keep working after the app is closed. Recurring tasks run until cancelled. Internal crons run on its VM.
- Monitor things (prices, weather, inbox) and alert you.
- Native access to Meta surfaces: Instagram, Facebook Pages, Marketplace messaging, WhatsApp, Meta ad accounts (Small Business tier).
- Pay through Link by Stripe one-time cards. Shop Pay and PayPal agentic checkout live since late September.
- Connectors: 15 named for Small Business (Asana, Box, Canva, Dropbox, Figma, Granola, HighLevel, QuickBooks, Klaviyo, Lovable, Notion, Shopify, Slack, Stripe, Zoom), plus email and calendar on consumer.
- **Custom connectors**: you ask Muse in chat to connect any hosted MCP server, OpenAPI doc, or npm/pip CLI. It writes the client, tests it, and saves it as a reusable skill. Keys go through a credential prompt; the agent only sees surrogate tokens.

**Cannot do**
- **No inbound API.** Nothing outside can trigger Muse or read its state. It is reached only through the app, web, or WhatsApp.
- Cannot reach a server on your laptop. Only hosted endpoints.
- Blocked by Amazon since 2026-09-20. eBay, Craigslist and OfferUp ban automated tools in their terms. Facebook's own terms restrict automation but Muse is tolerated in practice.
- Cannot take payment as a seller.
- One account per plan. No team seats.
- US and Canada only, 18+.

**Pricing**

| Tier | Price | Tokens |
|---|---|---|
| Free | $0 | Unpublished (Zuckerberg cited 100M/week at launch) |
| Power | $20/mo | 500M/week |
| Maximum | $100/mo | 3B/week |

Meta intends to take a small transaction fee, likely from merchants, schedule unpublished.

---

## 3. The rules that shape every method

From Muse Supplemental Terms (2026-09-08) and the Meta Model API acceptable use policy:

- 4.16: do not chain automated actions across platforms where the automation is designed to hide its automated nature.
- 4.10: no bulk messages or calls without legally required consent.
- 7.6: do not direct Muse to run "highly autonomously without appropriate oversight and approvals".
- 7.2: you are responsible for every commitment Muse makes. Meta owes you no fiduciary duty.
- AUP: no presenting AI output as human where disclosure is required; no consequential or irreversible actions without human oversight; no splitting work across accounts to dodge safeguards.
- Reselling Muse access and running it for third parties are not explicitly prohibited, but credits are non-redeemable and distillation is banned.

Practical consequence: **"completely automated" is achievable for finding, research, pricing, drafting, monitoring and conversation up to the commitment point. The money and commitment step must stay a human tap.** That tap can be a 5-second WhatsApp approval, so the human cost is close to zero, but it cannot be zero and stay inside the terms. Build everything around that gate.

---

## 4. The automation architecture (Muse + Claude)

Because Muse cannot be pushed to, make it **pull**. Muse becomes the hands with privileged access to Meta surfaces, payments, and a browser; a server you control becomes the brain, ledger and queue; Claude does the thinking on the server side.

```
                 ┌─────────────────────────────────────────┐
                 │  Your server (Vercel + Supabase)         │
                 │  Hosted MCP server, built by Claude Code │
                 │                                          │
  Claude API ───►│  tools:                                  │
  (pricing,      │   get_jobs()        -> next tasks        │
   drafting,     │   report(job, data) -> results, screenshots
   triage,       │   get_offer_policy(item) -> floor/ceiling │
   comps)        │   log_conversation(thread)               │
                 └───────────────┬─────────────────────────┘
                                 │ custom connector (outbound HTTPS)
                                 ▼
                 ┌─────────────────────────────────────────┐
                 │  Muse (recurring task every N minutes)   │
                 │  "Call get_jobs, do each one on          │
                 │   Marketplace/IG/WhatsApp/web, call      │
                 │   report. Never accept, commit or pay    │
                 │   without asking me."                    │
                 └───────────────┬─────────────────────────┘
                                 │ approval ping
                                 ▼
                          You, on WhatsApp: tap Allow / Deny
```

Pieces:

1. **Hosted MCP server** (TypeScript on Vercel, state in Supabase). Claude Code can build this in a session. Expose 4 to 6 tools. Muse connects to it once via "connect to this MCP server" and saves the skill.
2. **Muse recurring task**: one standing instruction that polls the server, executes jobs, reports back. This is the only documented way to drive Muse on a schedule from logic you control.
3. **Claude on the server** (claude-sonnet-5-5 for volume, claude-opus-5-5 for valuation) does comps, scoring, message drafting, scam detection, and decides what goes into the queue. Scheduled via Vercel cron or the scheduled tasks available in this Claude Code environment.
4. **Approval gate**: Muse's own permission system. Keep Marketplace, email and payments on "Ask for some actions" or "Always ask". Never "Always allow" on anything that commits money or location.
5. **Everything off Meta surfaces** (eBay API lookups, Amazon seller work, Shopify admin, spreadsheets) runs on your server with Claude, not Muse. Muse is only for what it uniquely reaches.

Cost reality: a Power plan ($20) plus roughly $20-60/month of Claude API for a single-niche operation. Muse Spark 1.3 can also be used as a cheap Claude Code backend via Meta's Anthropic-format endpoint ($1.25/$4.25 per M tokens), useful for bulk drafting if you want to keep costs down.

---

## 5. Arbitrage methods, ranked

Ranking weighs: fit with Muse's privileged access, legality under the terms, evidence it works, and how much can be automated.

### Tier A: build these first

**A1. Local resale arbitrage, Marketplace in and eBay or Marketplace out**
- Muse: recurring scan of Marketplace and local buy/sell groups in your city for a niche (e.g. camera gear, power tools, mid-century furniture, bikes). Messages sellers with pre-approved offers. Replies to buyers on your listings.
- Claude (server): eBay sold comps, condition scoring from photos, offer floor/ceiling per item, scam pattern detection.
- Human: tap to approve each offer, do pickups. Could outsource pickups to a runner.
- Why it fits: Marketplace is Meta's own surface; Muse already pulls eBay comps well. Nobody else's agent can message Marketplace sellers natively yet.
- Watch: Matt Robb incident. Hard-code "never share address, never agree a time, never accept".

**A2. Consignment as a service ("we sell your stuff")**
- The time-arbitrage version of A1. Estate cleanouts, people moving, divorces, downsizing seniors. You take 25-40%.
- Muse: comps, drafts listings, handles every buyer conversation, schedules pickups only after your approval.
- Claude: lot valuation, which items to list where, pricing cadence (drop 5% weekly).
- Acquisition: Muse scans "moving sale", "estate", "must go" posts in local groups and offers the service (with AI disclosure).
- Why it fits: the labor that makes consignment unprofitable (photos, chats, no-shows) is exactly what Muse absorbs. Zero inventory risk.

**A3. Local lead arbitrage and matching**
- Muse: mines public Facebook Groups and Marketplace "ISO" and "looking for a ..." posts for a niche and city (plumbers, night nurses, wedding vendors, movers).
- Claude: qualifies, dedupes, enriches, drafts the intro.
- Revenue: per-lead sale to local businesses, placement fee, or subscription for verified providers.
- Rules: get consent before passing contact details, disclose sourcing, one-to-one messages only (no bulk).
- Direct tie-in to your SecretXperience directory: the same pipeline finds venues (bars, clubs, massage, events) on Instagram and Facebook, Muse DMs them, Claude writes the pitch, you sell listing placements.

**A4. Agentic-checkout readiness for Shopify merchants ("Muse SEO")**
- Muse ranks and buys from Meta catalog products flagged for agentic checkout; Shopify catalog sharing is on by default but most stores have not optimized titles, specs, policies or the direct-checkout toggle.
- Service: audit and fix a store so agents can find, compare and buy it. Use your own Muse to run test purchases and record where it fails.
- Unconventional angle: Muse is US/Canada only. Merchants in India, UK, EU, Australia have US buyers using Muse but cannot test it themselves. Sell them "Muse storefront test and audit" from a US seat. That is pure geographic arbitrage on access to the agent.

### Tier B: real but thinner

**B1. Clearance and open-box arbitrage at Muse partner retailers**
- Muse recurring watch on Walmart, Best Buy, Wayfair, Gap, Sephora clearance and open-box; buys via Link after approval.
- Claude: eBay and Amazon sold-price comparison, margin threshold, return-rate guardrail.
- Human: receiving, listing on Amazon or eBay (Amazon blocks Muse for buying, and selling there is a seller-API task for your server, not Muse).
- Margins are thin; works only with strict margin filters and volume.

**B2. "Wanted" post reverse arbitrage**
- Muse reads ISO posts ("looking for a Peloton under $800"). Claude matches against Marketplace and eBay listings cheaper than the ask. Muse brokers both sides. You earn the spread or a finder fee.
- Low capital, needs speed. Good candidate for the polling architecture.

**B3. Bill negotiation for yourself, then as a service**
- Reviewers call Muse good at negotiating bills. First use: cut your own internet, phone, insurance, SaaS. Then a success-fee service (30-50% of first-year savings, like Billshark). Running it on a client's accounts needs their explicit authorization and their own credentials through Muse's credential vault, not shared logins. Grey enough that it is Tier B.

**B4. Domain and expiring-asset monitoring**
- Muse watches auction and expired-domain pages; Claude values; you bid. Many auction sites restrict bots, so Muse only reads and alerts.

### Tier C: do not automate

- **Ticket resale.** BOTS Act plus state laws plus platform bans. Muse is a bot for this purpose.
- **Automated Upwork or Fiverr bidding.** Platform terms ban it; your account dies.
- **Reselling Muse tokens or your Muse seat.** Credits non-redeemable, splitting across accounts prohibited.
- **Any Marketplace selling on "Always allow".** See Matt Robb.
- **Amazon buying through Muse.** Blocked.

---

## 6. Unconventional and early-mover ideas

These have little or no evidence yet. That is the point: nobody is doing them.

1. **Agent-legible listings.** Other people's Muses are now buyers. Write your Marketplace, eBay and Shopify listings for an agent reader: explicit specs table, condition grades, a published "will accept X for pickup today" line, a stated negotiation floor. Measure whether agent-driven offers rise. Then sell a listing-rewriter as a service to local sellers and small shops. Claude writes them; Muse tests them.

2. **Muse skill packs.** Muse turns any custom connector into a reusable "skill" but there is no marketplace for them. Package tested connectors plus playbook prompts per niche (reseller pack, realtor pack, restaurant pack) the way people sold Notion templates in 2021. Sell for $29-99, deliver as a document the customer pastes into Muse. Zero marginal cost.

3. **Meta-surface fulfillment worker.** Your hosted MCP server accepts jobs from other companies' agents (Claude, OpenAI, n8n), your Muse executes them on Instagram, Facebook, WhatsApp and partner checkouts, results flow back. You are selling the one thing other agents lack: a seat inside Meta's walled garden. Grey under 7.2 and 4.10; keep it to non-bulk, disclosed, consented actions, with you approving commits. Start with one client.

4. **Approval-as-a-job.** Flip the constraint. The only unavoidable human step is the approval tap. Run several Muse-driven operations (A1, A2, B2) and treat yourself as the approver of a queue, 50 taps a day on WhatsApp. Claude pre-ranks approvals by expected value so you only read the top ones carefully. This is how to scale "mostly automated" without breaking 7.6.

5. **Event-triggered local inventory.** Muse monitors event announcements, permits and venue calendars (your own SX_Events data is a source). On a big announcement, Claude predicts what spikes (parking, nearby short-term rentals, party supplies, cab demand) and Muse sources or lists accordingly. Speculative, but the data edge is already in your repo.

6. **Agent citation farming.** Muse's web search returns inline citations, and Meta's shopping agent favors well-known merchants. Publish comparison and "best X in [city]" pages built to be the cited source when an agent answers a buyer. Affiliate or lead revenue. Whether Muse honors affiliate links at checkout is unknown; test it before investing.

7. **Negotiation audit service.** Muse negotiates for buyers against human sellers. Offer sellers (car dealers, used-gear shops) a "what an AI buyer will push you to" stress test using your Muse, then write their counter-playbook. Consultancy, not arbitrage, but very early.

8. **Cross-agent arbitrage.** Muse's prices from Link, Shop Pay and PayPal checkouts can differ from the same merchant's site price, and partner promos exist. Run Claude to compare agent-checkout prices with web prices on the same SKUs and capture the gap. Thin and short-lived, fits the "fleeting arbitrage" warning.

9. **Permission-boundary products for Muse users.** The two things that went wrong in every bad story were address leakage and lowball acceptance. A tiny hosted MCP tool that Muse must call before any commitment ("check_offer_policy") lets a non-technical seller set floors and no-go rules once. Sell it to Muse users as a safety layer. Trivial to build; aligns with Meta's own direction.

---

## 7. Recommended first build (two weeks)

1. **Week 1**: Hosted MCP server on Vercel and Supabase with `get_jobs`, `report`, `get_offer_policy`, `log_thread`. Connect Muse to it. One recurring Muse task every 30 minutes. Niche: one category of used goods in one city (A1). Claude does comps via eBay Browse API and web search.
2. **Week 2**: Add the ISO and consignment scanners (A2, B2) as new job types. Measure: offers made, accepted, margin per flip, taps per day.
3. **Then**: productize what worked as A4 or idea 2. Those scale without inventory.

What stays manual: one tap per commitment, pickups, shipping. Everything else runs.

---

## Sources

- Meta newsroom, Introducing Muse: https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/
- Muse Supplemental Terms: https://muse.ai/terms
- Meta help, how Muse works with your approval: https://www.meta.com/help/artificial-intelligence/1385290430137537/
- Meta Model API acceptable use policy: https://dev.meta.ai/legal/acceptable-use-policy
- Meta dev blog, build with Muse Spark: https://dev.meta.ai/resources/blog/build-with-muse-spark/
- Axios launch report: https://axios.com/2026/09/08/meta-debuts-muse-personal-ai-agent
- Zuckerberg on transaction fees: https://finance.yahoo.com/technology/article/metas-zuckerberg-says-muse-ai-agent-will-take-a-small-fee-from-transactions-234639802.html
- Layer3 Labs review (Amazon block, tiers): https://www.layer3labs.io/guides/meta-muse-review
- MoneyWise money-chores test: https://moneywise.com/managing-money/budgeting/meta-muse-ai-agent-money-tasks
- MoneyWise, Matt Robb incident: https://moneywise.com/news/top-stories/matt-robb-meta-muse-facebook-marketplace-deal
- Malwarebytes on the incident: https://www.malwarebytes.com/blog/news/2026/09/metas-muse-sent-a-facebook-marketplace-buyer-to-a-sellers-home
- Marketplace selling guide: https://top5apps.ai/news/how-to-sell-and-negotiate-with-meta-muse-facebook-marketplace-guide/
- Stork lead-gen analysis: https://www.stork.ai/blog/meta-muses-quiet-gold-rush
- Business-model analysis: https://www.ai.joaoqueiros.com/blog/meta-muse-business-model-personal-agent-money-privacy
- Parallel, custom integrations: https://parallel.ai/articles/meta-muse-custom-integrations
- Developers Digest, Claude Code and Muse setups: https://www.developersdigest.tech/blog/meta-muse-claude-code-codex-setup-guide-2026
- Composio, Muse Code vs Claude Code: https://composio.dev/content/muse-code-vs-claude-code
- Tom's Guide, 10 automated tasks: https://www.tomsguide.com/ai/i-used-meta-muse-to-automate-10-tasks-from-reminders-to-trip-alerts-and-i-cant-believe-how-well-metas-ai-handled-everything
- eesel, Muse for Small Business: https://www.eesel.ai/blog/meta-muse-small-business
- Parix, Muse for Small Business: https://parix.ai/blog/meta-muse-for-small-business/
- Stellagent, Shop Pay and PayPal checkout: https://stellagent.ai/insights/meta-muse-shop-pay-paypal-agentic-checkout
- PPC Land, well-known merchants first: https://ppc.land/metas-shopping-agent-must-fill-its-top-5-picks-with-well-known-merchants/
- Yahoo Finance, Amazon not playing along: https://finance.yahoo.com/technology/ai/articles/meta-muse-taking-aim-e-142000400.html
- OpenRouter, Muse Spark 1.3 pricing: https://openrouter.ai/meta/muse-spark-1.3
- YouTube, "5 Insane Ways to Make Money with Meta Muse" (promotional, unverified): https://www.youtube.com/watch?v=zD_UxnfVV14
- Muse Code launch (CNBC): https://www.cnbc.com/2026/08/05/meta-debuts-muse-code-to-take-on-anthropic-and-openai-.html
