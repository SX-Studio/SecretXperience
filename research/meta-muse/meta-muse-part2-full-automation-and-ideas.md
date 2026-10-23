# Meta Muse, Part 2: Bridging to Complete Automation, and More Unconventional Ideas

Companion to the first report. Same evidence base (Meta pages, Muse Supplemental Terms, Meta Model API AUP, reviews up to 2026-10-19). Anything speculative is labeled.

---

## Part A. Closing the automation gap

### A0. Restating the gap precisely

There are exactly three places a human is currently in the loop:

| Gap | Why it exists |
|---|---|
| G1. Inbound trigger | Muse has no API. Nothing outside can start a task. |
| G2. Approval tap | Muse asks before sending, spending, publishing, or sharing data. "Always allow" removes the prompt but then prompt rules are the only guardrail, and they fail (the address-leak incident). |
| G3. Physical world | Pickups, shipping, cash. |

Each gap has a clean bridge and a grey bridge. Use the clean ones.

### A1. G1, inbound trigger: Muse already has three inboxes you can write to

Muse cannot be called, but it can be told to read. Everything below uses documented connectors and documented recurring tasks.

1. **MCP polling (primary).** Muse recurring task: "Every 15 minutes call `get_jobs` on my connector, execute each job, call `report`." You connect it once by asking Muse to connect to your hosted MCP URL. Latency is the poll interval. This is the backbone.
2. **Email as the inbound API (near real-time).** Muse's email connector plus a recurring "check inbox for messages from jobs@yourdomain and execute the instructions" task. Your server sends an email, Muse acts within its poll window. Also works for interrupts: subject line `CANCEL job-123`.
3. **Slack or Notion as a queue (Small Business tier).** Server writes to a Slack channel or Notion database. Muse's recurring task reads it. Nicer audit trail than email, and both are first-party connectors Meta lists.

Net: G1 is fully bridged today with no grey area. Muse becomes a worker that pulls from a queue you control.

### A2. G2, the approval tap: the Courier pattern

The trick is not to automate the approval. It is to **design the work so Muse never does anything that needs one**, then set the remaining low-stakes actions to "Always allow" with a deterministic guardrail that lives outside the prompt.

**Rule 1: Muse is a courier, not a decider.**
Every message Muse sends on Marketplace, Instagram, WhatsApp or email is produced by your server. Muse's standing instruction: "For every thread, call `compose_reply(thread_id, latest_messages)` and send exactly the returned text. If the tool returns `HOLD`, do nothing." Claude writes the reply on the server; a code-level policy layer checks it before it is returned (no address, no phone, price above floor, pickup only at the designated safe-exchange location, AI disclosure appended). Muse cannot be talked into lowballing because Muse is not negotiating; your server is.

Why this survives the Robb failure mode: his guardrail was a sentence in a prompt. Here the guardrail is an `if` statement. Muse's only job is transport. Even if Muse "forgets" a rule, there is no rule for it to forget; it has no text to send unless the tool gives it one.

**Rule 2: the spending cap lives in the card, not the prompt.**
Fund Muse's Link wallet from a virtual card with a hard daily and per-transaction cap (any issuer that supports merchant-locked or capped virtual cards). "Always allow" on purchases is then bounded by the issuer, not by Muse's judgment. Worst case is the cap, not the account.

**Rule 3: route every consequential action through an API that permits automation.**
Muse is only for what it uniquely reaches (Meta surfaces, partner checkouts). Everything else goes through official, automation-friendly APIs on your server, which need no approval at all:

| Action | Where it runs | Why |
|---|---|---|
| List on eBay, accept offers, send offers to watchers | eBay Sell API, your server | eBay bans bots in the UI but the API is the sanctioned automation path |
| List on your own store | Shopify Admin API | Same |
| Price research, comps | eBay Browse API + Claude web search | No Muse needed |
| Pay sellers, refund buyers | Stripe, PayPal API | Same |
| Book a runner for pickup | Marketplace delivery services or gig APIs where available | Same |
| Marketplace conversations, Instagram DMs, WhatsApp | Muse, Always allow, courier mode | Only Muse can reach these |
| Buy at Walmart, Best Buy, Wayfair, Shopify stores | Muse via Link or Shop Pay, capped card | Only Muse has the agentic checkout rails |

**Rule 4: oversight is code plus audit, not a tap.**
Muse's `report` calls land in Supabase. A nightly Claude job reads every thread and action, flags anomalies (price below floor, unusual message, new counterparty pattern), and emails you a one-page digest. You read it over coffee. That is the "appropriate oversight and approvals in place" that section 7.6 of the terms asks for: a documented policy, enforced by code, with a human reviewing an audit trail. It is not legally tested. Meta could still read "Always allow on Marketplace" as too autonomous. Keep the disclosure line in every message and keep the audit trail, because those are what you would show Meta if asked.

**What this leaves manual:** nothing on a normal day. You intervene only when the digest flags something, or when a job type you have not built a policy for shows up (the server returns `HOLD` and emails you).

### A3. G3, the physical world

- **Shipping-only flows.** Marketplace supports shipped sales with Meta checkout. eBay is shipping-native. Sell shipped, buy shipped. No meetups means no address problem.
- **Prep center.** Sellers ship to a 3PL or prep center (the kind Amazon FBA resellers use). It receives, photographs, stores, and ships out on your API instruction. Many take a per-unit fee with no minimum.
- **Runner for local-only items.** Server books a gig runner to a public safe-exchange spot. Cash handled by the runner app, not by Muse.

### A4. The grey bridge, and why not to use it

It is technically possible to automate the approval tap itself: run the Muse app on an Android device or emulator, and have an accessibility script tap "Allow" when a Claude check passes. It works. It is also the one approach that plainly breaks the terms: it chains automation specifically to defeat Muse's own oversight mechanism (section 4.16 and 7.6), and Meta's platform terms prohibit automated access to its apps. It puts the whole operation on one bannable account, and the AUP bars re-creating accounts after enforcement. The Courier pattern gets you the same outcome without it. Do not build this.

### A5. Reference build

```
Vercel (TypeScript)                      Supabase
  /mcp            hosted MCP server         jobs, threads, policies, ledger
    get_jobs()
    report(job_id, result, screenshots)
    compose_reply(thread_id, messages)   -> Claude sonnet drafts, policy.ts gates
    check_action(kind, params)           -> allow | hold
  /cron/scan      Claude: find candidates, create jobs
  /cron/price     eBay Browse comps, set floors and ceilings
  /cron/audit     Claude: nightly anomaly digest -> email
  /webhooks/ebay  offers, sales -> jobs for prep center

Muse (Power, $20)
  recurring every 15 min: poll get_jobs, run, report
  recurring every 5 min:  for each open thread, compose_reply, send
  Always allow: Marketplace messaging, Instagram DMs, email send to known domains
  Always ask:   nothing (purchases are bounded by the capped card instead)
```

Claude Code can build this in one session. The policy file is the whole product; everything else is plumbing.

---

## Part B. More unconventional ideas

Numbered to continue from the first report (which ended at 9).

**10. MCP storefronts for local businesses ("get your business into Muse").**
Muse can connect to any hosted MCP server and save it as a skill. Almost no local business has one. Build a generator: a plumber, a nail salon, a club promoter gets `theirname.com/mcp` with `get_availability`, `book`, `get_menu`, `quote`. Now any Muse user can say "connect to Joe's Plumbing and book Tuesday" and it works. This is the "get on Google Maps" moment of 2010. Charge setup plus monthly. Nobody is doing it because Meta has not announced a connector directory, which is exactly why the window is open.
*Direct application:* publish SecretXperience itself as an MCP server (`search_venues`, `tonight_events`, `book_table`). Then Muse, Claude, and ChatGPT users can all query your directory. Venues pay for featured placement in agent results, the same way they paid for featured listings on a web page.

**11. Parallel dealer bidding for cars (and anything with dealers).**
Meta's own example is "sell a car for more". The buy side is better. Email is a connector, and the known tactic for car buying is to get written out-the-door quotes from ten dealers and make them compete. Muse can run ten email threads at once; your server's policy layer keeps the counter-offers consistent. Charge a flat fee or a percentage of the discount against MSRP. Fully automatable up to the signing. Extends to solar installs, HVAC, movers, roofing: any purchase where dealers quote by email.

**12. Claims filing as a service.**
Class-action settlements, unclaimed property, airline delay compensation, price-protection and warranty claims. Finding them is a Claude job (public dockets, state unclaimed-property databases). Filing them is form-filling, Muse's core strength, on the client's behalf with their authorization. Fee is a percentage of recovered money. Check per-settlement rules (some bar third-party filers) and state caps on finder fees (often 10 percent). Thin per claim, enormous in aggregate, and almost nobody files.

**13. Protection arbitrage via Link.**
Muse purchases through Link get price-drop refunds, no-fee returns, and loss or damage coverage. Buy all retail-arbitrage inventory through Muse rather than directly, then have Muse run a recurring price watch on each SKU and file the price-drop claim when it triggers. The protections turn a thin-margin flip into a de-risked one. Verify the claim limits in Link's terms before scaling.

**14. The local used-goods price index.**
Every scan Muse runs for your resale operation produces structured data: item, condition, ask, sold, days on market, by city. After three months you own a dataset nobody has. Sell it: pawn shops setting loan values, insurers pricing contents claims, resellers deciding where to source, landlords furnishing units. Package as a monthly report or an API. The arbitrage business pays for the data business.

**15. Zombie-subscription audits for small businesses.**
Muse for Small Business connects to QuickBooks and Stripe. Claude reads the recurring charges, finds SaaS nobody has logged into, duplicate tools, and auto-renewed plans. Muse cancels or negotiates them. Success fee of 30 to 50 percent of first-year savings. Every business over ten people has thousands of dollars of this. Delivery is almost entirely automated once the client connects their accounts.

**16. Agent-side negotiation rooms.**
When both buyer and seller run agents, negotiation can finish in seconds, but today the two Muses talk through human-paced Marketplace chat. Host a structured negotiation endpoint (an MCP tool: `submit_bid`, `counter`, `accept`) and advertise it on your listings: "agents may negotiate at acme.com/mcp". Early, speculative, and the first mover sets the convention. Even if adoption is slow, your own buyer-side Muse can use it against your own seller-side server to settle internal transfers instantly.

**17. Monitoring-as-a-product for things people forget.**
Muse's recurring monitoring is its most reliable feature in tests. Package narrow monitors people will pay for: permit releases in a county, liquor-license applications, new-business filings (lead source for every B2B service), foreclosure notices, school-enrollment windows, concert presales. Claude writes the parsers, Muse runs the checks, the server sells alerts by email or SMS. Tiny per subscriber, zero marginal cost.

**18. Re-listing dead inventory for shops.**
Local shops have back rooms of unsold stock they will never list online. Offer to liquidate it: Muse photographs via the shop owner's phone upload, Claude writes listings, your server lists on eBay via the API, Muse handles Marketplace questions, prep center ships. You take a cut. It is consignment (first report, A2) pointed at businesses instead of households, with better volume per client.

**19. Agent-readiness audits for anything that sells.**
Generalizing the Shopify "Muse SEO" idea: restaurants (can Muse book a table?), clinics (can it request an appointment?), venues (can it buy a ticket?). Run your Muse against the client, record every failure, deliver the fix list, and optionally the MCP storefront from idea 10. The sales pitch writes itself: "here is a video of an AI trying to buy from you and giving up."

**20. Reverse arbitrage on the Muse user base.**
Muse users are early adopters with disposable income who have authorized an agent to act for them. They need: tested playbooks, safety tooling (idea 9 in the first report), skill packs (idea 2), and a community. The cheapest venture here is a newsletter plus a paid skill library. It also becomes the distribution channel for everything else on this list.

---

## Part C. Which of these to build first, given your stack

You already have Vercel, Supabase, Shopify tooling, Stripe, Twilio, and scheduled Claude Code sessions wired up in this environment. That makes the MCP server in Part A about a day of work, and ideas 10 and 17 reuse the same server.

Suggested order:
1. Part A reference build, pointed at one resale niche. This proves the Courier pattern and produces the dataset for idea 14.
2. Idea 10 for SecretXperience itself: expose the directory as an MCP server. It is a few routes over data you already have.
3. Idea 17 with one monitor that feeds your directory (new liquor licenses and event permits in your city are both a lead source and content).
4. Idea 11 or 15 as the first fee-based service, because both close with a single invoice and run almost entirely on connectors Meta already lists.
