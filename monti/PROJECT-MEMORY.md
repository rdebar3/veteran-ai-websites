# Project Memory — Rich & Claude

*Read this FIRST at the start of any new session to get fully caught up. It's the distilled
"what we decided and why + where things stand," not a transcript. Keep it updated as we work.*

Last updated: 2026-07-18

---

## Who / what
- **Rich** — U.S. Army veteran, solo web-design shop in West Virginia ("Veteran AI Websites").
  Builds professional mobile-first sites for local small businesses, fast, with an AI stack.
  Bottleneck is sales conversations + his time, NOT build labor. 0 paying clients yet — proving
  the funnel.
- Two active projects: (1) the **outreach tool**, (2) **Monti** (a voice concierge — pinned).
- **Non-negotiable rule:** no bullshit / no fabrication. Everything honest. If the tool can't do
  a good job, it doesn't ship.

## How we work (conventions)
- Rich implements code changes via **Grok Build** (his agentic coder) from a prompt I write, then
  it commits + pushes. Claude explores/diagnoses and writes precise Grok Build prompts.
- Commits should touch **only the specific files** for that change (Rich's working tree often has
  many unrelated uncommitted files — never sweep those in).
- Vercel **auto-deploys on push to `main`** (both repos are GitHub → Vercel).
- Repos on Rich's machine (`C:\Users\rdeba\...`): `veteran-ai-outreach`, `veteran-ai-websites`.
- Claude's cloud sandbox can't push (no repo+network together); Rich pushes from his terminal /
  Grok Build.

## The outreach tool (veteran-ai-outreach)
Mature Next.js 15 + Supabase app. Google Places discovery → deep site audit (scores quality,
skips good sites) → email drafting (LLM) → send queue (warmup + caps + suppression) → reply
classification → focus-queue "work" page + hunt mode → bookings/clients. ~476 businesses.
- **Supabase project:** `veteran-ai-outreach` (id sqgnyrlegbjhpebtbybd).
- **LLM layer:** `src/lib/llm.ts` — provider-agnostic (Anthropic default, xAI/OpenAI-compatible
  alt). We added **two tiers** (cheap/smart) + **silent cross-provider failover** (both keys live;
  standby only fires if primary errors). Env: `ANTHROPIC_API_KEY`, `XAI_API_KEY` both in Vercel.
  Model overrides: `LLM_MODEL_SMART`, `LLM_MODEL_CHEAP`, legacy `LLM_MODEL`.
- **Current models:** cheap = `claude-haiku-4-5`. Drafting was briefly on Sonnet (`claude-sonnet-5`)
  but **reverted to the fast/cheap tier** because Sonnet made the interactive Regenerate hang.

### Strategy decisions (why)
- **"Show Rich LESS, decide MORE."** He's time-limited; the tool should surface only what needs a
  human. With ~118k WV small businesses, supply is effectively infinite — the real limits are his
  TIME and email deliverability (warmup caps him to a few dozen sends/week). So: be ruthlessly
  picky, work only the easiest wins.
- **Target = lowest-hanging fruit:** no-website (incl. social-page-as-website) businesses. Clear
  need, clean pitch, no "I already have a site" objection. Hottest of all: expired-domain hijack
  (spam on their listing), dead/broken site link, Facebook-only. Audit already detects these.
- Can auto-detect "no website" + "social-only." CANNOT detect "pays for social ads" (not in Google
  data; we don't scrape social). Possible future signal: Facebook Ad Library (public).
- **Dual-model A/B was killed** (Grok battle, see below) — pointless at low volume. One model +
  failover only.

### Shipped / in-flight changes (this session)
- ✅ SHIPPED & deployed: plain-English one-line **lead summaries** (`src/lib/leadSummary.ts`,
  pure/free, wired into Hunt cards). Model tiering + failover in `llm.ts`.
- ✅ Reverted: drafting back to fast tier (Sonnet too slow for interactive regenerate).
- ⏳ Grok Build prompts GIVEN (confirm pushed?): (a) Hunt shows ONLY no-website/social leads;
  (b) Facebook quick-link in lead header; (c) fix audit marking a **dead/unloadable site as
  "already solid"** (guard the honesty-flip with `fetchOk`); (d) **Regenerate → 3 distinct
  options** (different angle + different finding focus) with a ◀▶ picker.

### Open threads / next ideas
- Re-screen leads previously mis-skipped as "already solid" when their site was actually dead
  (they're among the hottest leads).
- Audit should hand over a WIDER, more varied finding set so regenerate options have more distinct
  material (deeper fix for "clues in on the same few things").
- Priority ordering: float hottest-problem + already-reachable (email on file) + no-website leads
  to the very top of the review queue.
- Later, non-blocking: bring Sonnet-quality drafting back via a background path (not while Rich
  waits). Voice briefing. Live enrichment. All deferred until the noise-cut is proven.

## Monti (pinned — in veteran-ai-websites/monti)
Voice AI concierge for veteranaiwebsites.com. Greets visitors out loud, builds a homepage live
while they answer, plants their flag on a WV county map. Named **Monti the Mountaineer**.
- **Status: DESIGN LOCKED (brief v5), not built yet.** Test-first: ships on a hidden unlinked
  `/monti` page until Rich hammers it and approves.
- Stack: existing Next.js/Vercel app; Claude for conversation+site-gen; **xAI TTS** for voice
  (same `XAI_API_KEY`); existing outreach Supabase for a distinct `source=monti` / `hot_inbound`
  lead lane. Structured-fields-only JSON contract (no raw HTML). 3 templates, curated hero photos.
- **Map is DONE & verified:** `monti-wv-map.svg` / `.png` (all 55 counties from US Census data),
  first flag on Lewis County. Files saved in `veteran-ai-websites/monti/`.
- Next build step when unpinned: stand up the hidden `/monti` route.

## The Grok battle (for the record)
Ran the outreach AI-upgrade plan past Grok (Heavy) for brutal critique, argued it out. Grok won
the main point (dual-model A/B is premature over-engineering at low volume); Claude won two side
points (failover ≠ A/B; internal enrichment ≠ customer-facing fabrication). Net: plan shrank to
"Phase 1 only — kill the noise." Per the bet, Claude conceded most → owed Grok "daddy." Paid up.
