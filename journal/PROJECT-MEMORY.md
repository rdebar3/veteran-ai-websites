# ⚡ STANDING RULES — READ FIRST, EVERY SESSION (pinned 2026-07-24, Rich's orders)
1. Keep the memory file current — append after every meaningful step, decision, ship, or finding.
2. Protect the main chat's context — heavy tasks (curation marathons, big research, new tracks, 30+ tool calls) → TELL RICH to open a NEW chat. Say it when the task comes up.
3. Route to Grok liberally — code in repos = Grok prompts; big analysis chores can go to Grok chat. Claude = strategy, verification, prompts, DB ops, curation, memory.
4. Stay frosty — check every plan against standing decisions (Monti not public / Rebuild sites HAND-BUILT not Monti / no fabrication / no hooks in gifts). Unsure = ask, don't assume.

## Recent (since last full sync — see chat-delivered full file for detail)
- 2026-07-30: auditor **fabrication bug FIXED** (60bf2fc, deploy READY) — HIJACK_RE matched substrings, invented "taken over by spammers" findings. 12 poisoned site_reviews rows deleted.
- 2026-07-30: **wrong-recipient bug** found — scraper harvests Google Fonts *designer* emails out of <style>/@font-face headers. Prompt verified and sent to Grok. See the 07-30 section at the bottom.
- 2026-07-30 WORKFLOW: long Grok prompts get written in a **NEW Claude Fable 5 window**, not this chat. This chat = strategy, DB, verification, short handoffs.
- Call sheet pivot live (620434b) + migration applied: fb_only=33, call pool=93, 5/day sheet, radius hard max 80km.
- Town-hub rotation live (4ccdfc0) + migration applied: 20 WV town hubs, 12km each, closest-first LRU, 60-day revisit.
- Email machine complete: reply-only first touch, originals preserved, morning brief. Aug 7 check-in scheduled.
- REBUILD WV program: free HAND-BUILT sites for flood-hit businesses (cap TBD ~10, name TBD — "Back Open WV" alt), site theirs free forever, hosting free till reopen then choice ($97/mo OR free keys), status beacon + GBP tune-up (owner owns, Rich=Manager), domain in their name. Field doc delivered to Rich. Never cold-pitch rebuild leads.
- VRE Aug 6: ask-list rebuilt & permanent (equipment/supplies/licenses/training/subsistence + VBOC call this week). 21-4138 remarks drafted.

# Project Memory — Rich & Claude

*Read this FIRST at the start of any new session to get fully caught up. It's the distilled
"what we decided and why + where things stand," not a transcript. Keep it updated as we work.*

Last updated: 2026-07-20 (session: LiveKit voice rebuild COMPLETE — Monti 24/7 on LiveKit Cloud;
Work-queue integration; button/caption fixes. ⚠️ OPEN: key rotation + full cloud E2E lead test.)

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

## ⚠️ READ THIS before touching the outreach repo (hard-won gotcha)
- **Grok Build is the deploy path and it works.** It runs locally on Rich's Windows PC in
  `C:\Users\rdeba\veteran-ai-outreach` (Grok 4.5 CLI, always-approve), runs `npx tsc`, commits,
  and pushes to `main` → Vercel auto-deploys. Rich pastes in the prompts Claude writes.
- **DO NOT trust `device_bash` `npx tsc` or `git status` on the outreach repo through the bridge.**
  Claude's remote view of Rich's Windows files garbles line endings (shows ~80+ files "modified"
  when nothing changed) and mangles the em-dashes / smart-quotes that fill the source, producing
  **PHANTOM** tsc syntax errors ("unterminated string literal", "JSX has no closing tag") that are
  NOT real. On 2026-07-18 this caused Claude to falsely scream "your repo is broken / 82 files
  mangled!" — it was completely fine. Do not repeat that scare.
- **Verify build health via Vercel, never via device_bash tsc.** `list_deployments` (state
  READY vs ERROR) + `get_runtime_errors` are the source of truth. Reading code via device_bash to
  understand it is fine; running tsc/git-status there and *believing* the result is not.
- **Don't hand-edit the outreach repo via device_bash and push.** Grok Build owns that working
  tree. Write a Grok Build prompt instead and have Rich run it in the outreach tab (he juggles
  multiple project tabs, so a prompt can slip through — confirm it actually pushed).

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

## Monti (ACTIVE — in veteran-ai-websites/monti)
Voice AI concierge for veteranaiwebsites.com. Greets visitors out loud, builds a homepage live
while they answer, plants their flag on a WV county map. Named **Monti the Mountaineer**.
- **Status: DESIGN LOCKED (brief v5). Now building — templates first.** Test-first: ships on a
  hidden unlinked `/monti` page until Rich hammers it and approves.
- Stack: existing Next.js/Vercel app; Claude for conversation+site-gen; **xAI TTS** for voice
  (same `XAI_API_KEY`); existing outreach Supabase for a distinct `source=monti` / `hot_inbound`
  lead lane. Structured-fields-only JSON contract (no raw HTML). 3 templates, curated hero photos.
- **Map is DONE & verified:** `monti-wv-map.svg` / `.png` (all 55 counties from US Census data),
  first flag on Lewis County. Files saved in `veteran-ai-websites/monti/`.

### Monti — how it works (the guarantee, don't lose this)
The whole "it must be good EVERY single time" promise rests on ONE principle:
**Monti does not design — Monti FILLS.** He never emits HTML/CSS/layout/colors. Humans design 3
fixed, beautiful templates ONCE; at runtime Monti only pours *structured text + a chosen curated
photo* into pre-designed slots behind a **validation gate**. A fixed frame + valid content
physically cannot render ugly, because the ugly decisions were never his to make. Quality of Monti
= quality of the templates. So **frames first, always.**
- **Customer experience:** pre-cached greeting (zero dead air) → turn-based (visitor types/answers
  → structured JSON → xAI TTS speaks Monti's line → one template section atomically fills). Skeleton
  loaders → atomic section swaps; a visitor NEVER sees a half-broken frame. Latency hides behind the
  conversation (one section per answer, fast model, curated images). Ends on an honest counter +
  handoff to Rich as a `hot_inbound` lead (`source=monti`).
- **Data contract (memorize):** `template_id`, `palette`, `hero_image_id`, `copy_tone`, plus
  `hero{headline,subhead,cta_text}`, `about{body}`, `services[3–6]{title,description}`,
  `trust{badges[],reviews_snippet}`, `contact{cta_text,phone_prompt}`. Every field has a max length
  AND a designed fallback — empty state and longest-allowed state must BOTH look intentional. That
  fallback discipline IS the "good every time" guarantee.
- **3 verticals:** trades/services, food/hospitality, tourism/outdoors. If a business doesn't fit,
  pick the closest — never a 4th "generic" template.

### Monti — WHAT'S BUILT (all in veteran-ai-websites/monti/ + Cowork artifacts) — updated 2026-07-19
All built + rendered + saved to disk this session. Everything is a self-contained HTML with a live
harness (toggle full/sparse business + 2 palettes). Photos load from Unsplash CDN on Rich's side.
- **3 ONE-PAGE templates, contract-driven, real 4K photos:**
  - `monti-trades-template.html` (artifact `monti-trades-template`) — warm editorial, ember/timber.
  - `monti-food-template.html` (artifact `monti-food-template`) — hearth/amber, menu-forward, hours up front.
  - `monti-tourism-template.html` (artifact `monti-tourism-template`) — summit/sunrise, cinematic big-landscape.
- **Multi-page PROVEN:** `monti-trades-site.html` (artifact `monti-trades-multipage`) — clickable
  Home/Services/About/Reviews/Contact w/ working nav, contact form, service-area map. **Adaptive page
  count**: rich business → 5 pages, simple business → 3 (pagesFor() decides from content richness).
- **Photo libraries (all sources 6000px+, verified; Unsplash commercial-free, no attribution):**
  Trades = `monti-photo-library.html` (artifact `monti-photo-library`) + `photolib/library.json`
  (8 trades + WV establishing + work-truck). Food photos (diner/bbq/bakery/coffee/brewery/pizza/
  interior/plated) live in the food template's `IMG` map. Tourism photos (cabin/rafting/overlook/atv/
  camping/interior/wv-valley) in the tourism template's `IMG` map. Curated by eyeballing them in
  **Rich's Chrome** (claude-in-chrome). ENV NOTE: this cloud sandbox has NO general/image internet
  (only package registries) — headless Playwright can't fetch Unsplash. To curate/verify external
  photos, drive Rich's browser (search Unsplash, JS-extract photo IDs + naturalWidth). To preview a
  template's real photos locally, route-swap the Unsplash URLs to local placeholder JPGs. Real photos
  render fine on Rich's side. device_stage/commit/artifact tools flap in/out — reload via ToolSearch.
- **✅ LIVE DEMO — the payoff:** `monti-demo.html` (artifact `monti-live-demo`). Clickable: visitor
  chats with Monti, a real site assembles LIVE section-by-section (skeleton→atomic fills) as they
  answer, ends with the hot lead landing in Rich's tool (`source=monti · hot_inbound`). Conversation
  is scripted here (per-trade presets = the "intelligence"); voice shown as "spoken aloud (xAI voice)"
  notes. THIS is what to test on real people. Verified end-to-end (no errors, lead lands correct).

### ⭐ KEY DECISION 2026-07-19 — freeze templates, build the engine
Rich: the one-pagers look good; don't over-build. **Decision: templates are FROZEN as v1.** Do NOT
build Food/Tourism multi-page or add variations yet — multi-page is already proven (Trades) and the
page count is adaptive, so it's a fast-follow the day real usage demands it. The real unknown isn't
page count — it's whether Monti's live build+handoff actually wows a real person. So next energy goes
to **building Monti for real**, then testing on real people. Let real runs decide per-vertical depth.

### ⚠️ CONTRACT ADDITIONS to fold into §3 (found while building)
- `business{name, phone, service_area, established?, hours?}` block — examples hardcoded these.
  `hours` = operating window (Food) / season window (Tourism, e.g. "Open Apr–Oct").
- `trust.reviews[]` (array of {quote,name,detail}) — richer than the single `reviews_snippet`.

### Monti — build roadmap
1. ✅ Templates + photo libraries — DONE.
2. ✅ **Full experience prototype BUILT** — `monti-experience.html` (artifact `monti-experience`):
   glow-Monti greets full-screen → slides to a left companion column → the website builds
   center-stage in a browser frame (skeleton→atomic fills) as the visitor answers via voice + a text
   box → hot lead lands (`source=monti`). Verified end-to-end. Also: `monti-face.html` (the glow),
   `monti-demo.html` (earlier chat-panel version), `monti-trades-site.html` (multi-page + `pagesFor`).
   Monti's on-screen look = a **soft warm glow that pulses to his voice** (Rich's call; we tried
   dotted-mountains and painted-mountains first, both rejected — the glow won). Text box is for the
   CLIENT to type; Monti's words are voice-only on screen.
3. ✅ **BUILD PACKET WRITTEN 2026-07-19** — `monti-build-packet.md` (in monti folder + sent to Rich).
   The self-contained spec to make Monti real, for Grok Build. Core = 3 APIs: **xAI TTS (voice)**,
   **Claude primary / Grok failover (the brain — via existing `llm.ts`)** outputting **structured
   JSON only** (the §3 turn contract), **STT later**. Covers the hidden/noindex `/monti` route, the
   turn contract (brain⇄UI JSON), the §3 data contract, the conversation arc, the front-end port of
   the prototype (glow driven by real xAI audio via Web Audio AnalyserNode), Supabase `hot_inbound`
   lead lane, guardrails, and a phased plan (Phase 1 typed MVP → Phase 2 voice → Phase 3 polish).
4. ✅ **BUILD-READY 2026-07-19.** Everything wired to hand Grok Build:
   - `monti/grok-build-phase1-prompt.md` — the paste-ready Phase-1 prompt (@pins the spec files, runs
     plan-mode-first, uses the brain prompt verbatim, has the exact lead insert).
   - `monti/monti-brain-prompt.md` — **Monti's system prompt** (persona + turn-contract JSON + §3 +
     trade keys + copy/honesty rules). The quality lever. Grok drops it into `/api/monti/turn`.
   - **Env vars added by Rich** to veteran-ai-websites Vercel: ANTHROPIC_API_KEY, XAI_API_KEY,
     SUPABASE_URL (base, no /rest/v1/), SUPABASE_SERVICE_ROLE_KEY (= the "secret" key).
   - **Supabase migration APPLIED** (`add_monti_lead_columns`): `public.businesses` gained
     `source text default 'outreach'` (existing 477 rows tagged outreach) + `monti_draft jsonb`.
     Monti leads insert here with source='monti', lead_score=100, synthetic place_id, monti_draft=§3
     record → surfaces hot in the SAME focus queue. Exact insert in packet §6.
   - **Voice upgraded in the packet:** use the **xAI Voice API** (speech-to-speech + tool-calling,
     $0.05/min) for Phase-2 voice, Pipecat (open-source) as alt — better than raw TTS.
   - **Guardrail added:** Grok Build = BUILD-TIME tool only, NEVER Monti's runtime engine (runtime =
     LLM fills locked templates via structured JSON).
   - Rules wired: `AGENTS.md` (full standing rules) + `CLAUDE.md` (pointer) — Grok reads both zero-config.
5. ✅ **PHASE 1 SHIPPED & VERIFIED LIVE 2026-07-19** (Grok Build commit d3f3972, Vercel READY).
   `/monti` is live, hidden, and works end-to-end on the REAL Claude brain. Claude drove a full
   fresh conversation through the deployed site (Mountain State Lawn & Landscape, Morgantown): glow
   greeted → inferred landscaping → site built live (real photo, "Yards worth coming home to.",
   Morgantown-personalized subhead, phone as hero call button, inferred "Since 2013" from "12 years")
   → honest handoff → **lead landed in Supabase with full monti_draft (6 services, all copy)**. The
   earlier "Couldn't reach Rich's inbox" bug is GONE (it resolved on its own — env vars propagating /
   redeploy; it was NOT the contact_bucket constraint, though that got widened harmlessly).
   - ⚠️ **FOUND + FIXED — lead priority.** Grok's `/api/monti/lead` route diverged from packet §6:
     it inserted `lead_score=45, status='reviewed', contact_bucket='manual_review'` (same as a COLD
     scraped lead) instead of the intended hot values. A Monti lead is Rich's HOTTEST lead — can't
     blend in with the 477 cold ones. **Fix applied (Rich chose "DB trigger now"):** migration
     `force_monti_leads_hot` adds a BEFORE-INSERT trigger `trg_enforce_monti_lead_priority` that
     forces any `source='monti'` row to `lead_score=100, status='new', contact_bucket='monti_inbound'`.
     INSERT-only (never overrides Rich working a lead later); leaves non-monti outreach rows untouched
     (verified both). Belt-and-suspenders: guarantees correct priority no matter what the route or a
     future rebuild sends. Constraint `businesses_contact_bucket_check` was widened earlier to allow
     `monti_inbound`.
   - Optional future cleanup: also fix Grok's route code to send the right values at source (trigger
     makes it non-urgent). Minor arc note observed earlier: brain auto-fills services / reorders the
     scripted confirm step — works fine, just differs from the §4 script.
6. ⚠️ **MONTI LEADS DON'T HIT THE OUTR
## Session log — 2026-07-21 (Grok-partnered polish run)
All shipped to main + Vercel READY; agent redeployed to LiveKit Cloud (CA_24EKPHpsLYfc) three times.
- 1943870: /monti/live preview scroll fixed (LiveKitRoom style prop height chain) + typed dock input polish (f77725e added the input itself: sendText topic lk.chat, mic-optional). VERIFIED live incl. typed-only session.
- 798d6d3: orb replaced with ember particle field GlowCanvas (three + @react-three/fiber, 3000-pt cloud, same handle API, SSR mount guard). Rich approved look.
- f799522 + bfb509a: layout/theme variants — 3 layouts (classic/bold/split) x 5 palettes x 2 moods, validated enums, BC fallback classic+ember. VERIFIED distinct across 4 trades.
- 90e33b5: brain+voice pass — phone REQUIRED before send_to_rich (verified), badge honesty rule, turn-detection improvements, SESSION_MAX_SECONDS=600 / SESSION_IDLE_SECONDS=120 cost guards, theme persisted in draft.
- 228c365: "Rich" said exactly once at handoff (verified).
- E2E LOOP PROVEN ON CLOUD (first time): typed build → send_to_rich → Supabase hot lead → Work queue. Test leads to clear: E2E Test Plumbing, Sam's HVAC Repair, Jess's Roofing.
- KEYS ROTATED by Rich (XAI + LiveKit) — BOM-leak security TODO CLOSED.
- OPEN: prompt #6 pending (TradesTemplate hardcoded fabricated claims L121/133/157/248 — web-only). Then: photo pipeline, richer sections, motion presets, design tokens. Grok chat "LiveKitHeightFix" holds the research.

## 2026-07-22 — polish phase CLOSED
- 2e3c624 verified live (Walt's Landscaping test): zero unstated claims — chips only "Serving {area}" / "24/7" (if emergency); strip reworded true-by-construction. No new test lead created.
- Small polish item: typed messages sent while CONNECTING are lost — buffer or disable send until agent joins.
- NEXT PHASE: curated real-photo pipeline (biggest quality jump), richer sections, motion presets, more verticals.

## 2026-07-23 (late) — DIRECTION SET: perfect this version first
- Rich's call: Monti not public until perfected. Friendly-fire testing OK.
- FINISH-LINE CHECKLIST — MUST-FIX: (0) typed turn-taking (prompt #15 written, NOT RUN — nudge cut Rich off on service-area Q), (1) typed-while-connecting loss, (2) transient disconnects, (3) Rich phone pass on multi-page, (4) full E2E on multi-page template. MUST-HARDEN: off-trade businesses, noisy rooms, rambling/one-word owners. MUST-DECIDE: voice audition, retire old /monti, "I'd charge money" bar x3 builds.
- FLOWER SHOP INCIDENT: florist → forced landscaping key → weedeater photos. Plan: (a) generalist fallback first (~10 neutral photos Claude curates, honest line, never force wrong key), (b) tiered expansion at full quality — T2 walk-ins (florist/bakery/cafe/salon/boutique/daycare/pet), T3 offices. Outreach stays trades.
- PINNED (no build without Rich's go): autopilot vision — hosted preview URL from monti_draft → claim+pay (Stripe exists) → real-photo ingestion → Monti-as-editor → Rich approves every publish.
- Aug 6 VRE: Monti is the demo.
t; lead
   stayed source=monti/status=new/score=100/monti_inbound, untouched, still task #1 on Work with the
   readable headline. Screening trigger endpoints: `/api/admin/pipeline/process` (manual) +
   `/api/cron/tick` (cron) → both call `processPipeline()`. **PHASE 1 IS NOW FULLY CLOSED — Monti lead
   lands → pinned hot at top of Work → survives screening → stays until Rich works it.**
   Key outreach-code facts (don't re-derive): Work queue = `src/app/dashboard/work/page.tsx`
   (non-hunt else branch) + `src/components/FocusQueue.tsx` (FocusTask union, taskTitle, card comps,
   render dispatch). Mark-done = `callApi("/api/admin/leads/{id}","POST",{action})`. `log_call`
   outcomes: contact_interested→building_demo, contact_not_interested→closed_lost, no_answer/voicemail
   keep status. `Business` type had NO source/monti_draft/created_at.
7. **Monti lead-route code divergence (LEFT AS-IS on purpose):** Grok's `/api/monti/lead` (websites
   repo) inserts `lead_score=45, status='reviewed', contact_bucket='manual_review'` — the DB trigger
   `force_monti_leads_hot` overrides to 100/new/monti_inbound, VERIFIED working. Decided NOT to fix the
   route code now (don't risk the Monti build right before Phase 2; trigger fully handles it). Revisit
   only when Grok next touches that route.
8. 🎙️ **PHASE 2 (VOICE) — DESIGNED, PROMPT DELIVERED 2026-07-19. Rich chose the REAL-TIME VOICE AGENT.**
   Researched current xAI voice (July 2026): two products — (a) **Voice Agent API** = real-time
   speech-to-speech over WebSocket `wss://api.x.ai/v1/realtime?model=grok-voice-latest` (model
   `grok-voice-think-fast-1.0`), server VAD/barge-in, mid-convo tool-calling
   (`response.function_call_arguments.done` → `conversation.item.create` w/ function_call_output →
   `response.create`), ephemeral browser tokens (`xai-client-secret.`), voices eve/ara/rex/sal/leo +
   cloning; (b) standalone STT ($0.20/hr streaming, 6.9% WER) + TTS ($15/1M chars, speech tags). Rich
   picked (a) the Voice Agent (magical/natural over the safe STT→brain→TTS pipeline).
   ARCHITECTURE: voice agent runs the convo + calls a `fill_site` tool (§3 structured fields, sections[])
   → client runs each payload through the SAME validation gate → fills the locked Trades template live;
   `send_to_rich` tool → existing /api/monti/lead. VOICE-FIRST, TYPED-FALLBACK (mic denied / socket fail
   → Phase 1 typed flow intact). Glow driven by REAL output-audio amplitude (new GlowCanvasHandle
   `setAmplitude`/`setListening`). Keys server-side (ephemeral tokens); XAI_API_KEY already in Vercel.
   DELIVERED two files: `monti-voice-instructions.md` (the voice quality lever — persona/arc/copy/honesty
   adapted for spoken + fill_site/send_to_rich tool guidance; = the brain prompt for voice) and
   `grok-build-phase2-voice-prompt.md` (paste-ready, plan-mode, pins the xAI doc URLs + Phase-1 files).
   Phase-1 integration points confirmed (read the code): MontiExperience.tsx (record/fill/applyTurn
   state + callTurn→/api/monti/turn), GlowCanvas.tsx (speak/impulse handle, simulated envelope to be
   driven by real audio), validation gate lives INSIDE /api/monti/turn → extract to shared
   `lib/monti/validate.ts`. Files live in repo: app/monti/, components/monti/{MontiExperience,GlowCanvas,
   TradesTemplate,BrowserFrame,LeadCard}.tsx, lib/monti/{types,contract}. **STATUS: Rich to save
   monti-voice-instructions.md into the websites repo (monti/ folder) + run the Phase-2 Grok prompt
   (plan mode first). Then verify: spoken build end-to-end + typed fallback still works. Voice pick:
   audition leo/rex/sal, set MONTI_VOICE default.** Back-pocket: Food+Tourism multi-page, WV map
   flag-plant, HVAC hero swap, photo-upload, pre-cached greeting.
   → ✅ **SHIPPED (Grok, 2 prompts: file-create 96c2ce6 + build 144f963) + SCAFFOLDING VERIFIED LIVE
   2026-07-19.** Files: lib/monti/validate.ts (shared applyFill gate, turn route uses it),
   lib/monti/voice-instructions.ts (full instructions + MONTI_VOICE="leo"), app/api/monti/voice-token
   (server ephemeral mint), components/monti/useMontiVoice.ts (WS engine: opens
   wss://api.x.ai/v1/realtime?model=grok-voice-latest with subprotocol `xai-client-secret.<token>`,
   session.update, mic, PCM playback, fill_site+send_to_rich tools), GlowCanvas setAmplitude/setListening,
   MontiExperience voice-first+typed-fallback+captions. VERIFIED (browser, no mic): /monti loads; token
   endpoint returns {token(107ch ephemeral `xai-realtime-cli…`),expires_at,instructions(5596ch),
   voice:"leo"} + does NOT leak raw key; **realtime WS AUTHORIZED → got `session.created`** (full
   server→token→xAI handshake works); typed fallback works end-to-end (typed "Summit Auto Repair" →
   Monti replied via /api/monti/turn); no console errors. CAN'T test w/o real mic = the actual spoken
   convo (Rich's live test). ⚠️ WATCH in live test: on explicit mic-DENY, confirm Monti promptly greets
   in TEXT rather than lingering on "Connecting…" (in no-mic automation it showed "Connecting…" but the
   typed box was available + typing worked; couldn't test a clean deny).
   → 🔧 **BARGE-IN + PACE FIX SHIPPED (Grok 58faccf) + CODE-VERIFIED 2026-07-19.** First live voice test:
   Monti kept talking / backlogged replies / didn't stop on interrupt. Root cause: `playPcmChunk`
   scheduled PCM chunks into the future via nextPlayTimeRef but kept no source refs, and speech_started
   only set a flag — client never flushed its own Web Audio queue (server VAD stopping generation does
   NOT un-play browser-scheduled audio). FIX (useMontiVoice.ts): activeSourcesRef tracks every
   AudioBufferSourceNode; `flushPlayback()` stops them all + resets nextPlayTime to ctx.currentTime +
   zeroes pending/amp/speaking; called on `input_audio_buffer.speech_started` (then `response.cancel`
   if responseActiveRef) and on `response.created` (anti-overlap). Also MONTI_SPEED=1.3 (Rich: male +
   1.3), silence_duration_ms=600, and `?voice=`/`?speed=` URL overrides for live auditioning (clamped
   0.7–1.5). MONTI_VOICE still 'leo' default. Code reviewed = correct. **PENDING: Rich's live EAR test —
   (a) interrupt = instant cutoff now? (b) audition male voices leo/rex/sal via /monti?voice=NAME, pick
   the American one → hard-set MONTI_VOICE.**
   → 🎙️ **VOICE LOCKED: 'castor' (Rich picked it from xAI voice selection, 2026-07-19).** Diagnosed the
   "still the same voice" report: voice-setting via session.update WORKS (proved leo vs rex produce
   different audio bytes; captured samples). It was just that MONTI_VOICE default stayed 'leo' and Rich
   hadn't used ?voice=. NOTE: xAI realtime DEFAULT voice is 'ara' (top-level `session.voice` is the
   canonical field; audio.output has speed/format but NOT voice; ephemeral-token mint does NOT accept
   session config so voice MUST be set via session.update — which the app does correctly). Validated
   'castor' is a valid voice (produces audio, no error). One-line Grok prompt given: set MONTI_VOICE
   'leo'→'castor'. **PENDING: Rich runs it + confirms castor at 1.3 sounds right + barge-in feel.**
   → 🔧 **VOICE PIPELINE + SPEED TUNING (Grok 8476216).** Rich's live test: hard to communicate — he
   picked ALL 4 (cuts off / talks over / lag / mishears) → root cause = audio pipeline. Found bug:
   capture AudioContext never verified the browser's ACTUAL sampleRate (browsers force 44.1/48k),
   mic PCM was mislabeled → garbled. FIX: read real captureCtx.sampleRate, declare it (or resample to
   24k) so PCM matches declared rate; playback decodes 24k. Also MONTI_SPEED 1.3→1.0 (Rich: too fast).
   VAD tuned: threshold 0.9, prefix_padding 300, silence_duration 600; barge-in flush only when Monti
   actually speaking. VERIFIED (no mic): session.audio now echoes audio/pcm@24k + speed 1.0 correctly
   (the `input_audio_format:"not specified"` is a HARMLESS legacy field — ignore it; real config is in
   `session.audio`). **PENDING: Rich's mic test — does convo feel natural now? If still rough → PLAN B:
   research WebRTC transport (handles rate/echo/jitter/latency natively vs hand-rolled PCM+ScriptProcessor).**
   → 🔁 **VOICE SAGA (2026-07-20).** After the pipeline fix voice still had issues: (a) super-slow then
   silent, (b) "cutting out" constantly. Diagnosed the cutout as ECHO SELF-INTERRUPT: Monti's audio →
   speakers → mic → server VAD fires speech_started → barge-in flush+response.cancel → he cuts himself
   off (only reproduces on a REAL machine w/ speakers+mic, NOT in Claude's automation browser — that's
   why it was invisible to me). Rich chose "one more patch" over LiveKit rebuild. Shipped (Grok caf3bf1):
   HALF-DUPLEX — getUserMedia now echoCancellation/noiseSuppression/autoGainControl+mono; mic GATED
   (no input_audio_buffer.append) while `responseActive || pendingSources>0` (isMicGated() live-evaluated
   in the append path → auto re-opens when Monti finishes, verified no stuck-closed risk); echo barge-in
   retired (Pause button is now the only interrupt). Trade: no talk-over interrupt, turn-based. Also
   earlier patch (rate consistency=fixed 24k both ways + read server output rate; keep AudioContext
   resumed on visibility/focus; diagnostics logs `[monti/voice]`). **PENDING: Rich's ears test — full
   turn w/o cutout? If still cutting → get console `[monti/voice]` logs; if unfixable, LiveKit/WebRTC
   rebuild is the real answer (xAI has official LiveKit plugin; needs LiveKit Cloud + always-on agent).**
   NOTE: voice is the big fragility+cost sink; typed flow is rock-solid. MONTI_VOICE='castor', SPEED=1.0.
   → 🏗️ **LIVEKIT REBUILD (2026-07-20) — THE FIX THAT WORKED. Voice is now GOOD on /monti/live.**
   Rich chose full rebuild after patches kept failing. xAI has NO direct browser WebRTC — LiveKit is
   the official path (partnership; ref repo livekit-examples/grok-playground). ARCH: Python agent
   (`monti-agent/` in websites repo: livekit-agents[xai], grok-voice-latest, voice castor, instructions
   from monti-agent/instructions.md, Krisp BVC noise cancellation wired) + LiveKit Cloud
   (wss://monti-xbmzg07e.livekit.cloud; LIVEKIT_URL/KEY/SECRET in Vercel env + agent .env) + token route
   /api/monti/livekit-token (unique room per visitor) + /monti/live page (components/monti/
   MontiLiveClient.tsx — LiveKitRoom, useVoiceAssistant, glow from remote-track AnalyserNode).
   GOTCHAS SOLVED: (a) named-agent dispatch never routed → switched to AUTOMATIC dispatch (no
   agent_name in WorkerOptions, no RoomConfiguration in token); (b) local agent needs Python — installed
   3.12 via winget on Rich's PC, venv in monti-agent/.venv, run: `.venv\Scripts\python.exe main.py dev`
   (use full python.exe path, NOT `activate` — PowerShell blocks it); (c) agent .env needs its own copy
   of the 4 keys. PHASE B SHIPPED (ba20df7): agent tools fill_site/send_to_rich publish LiveKit data
   messages (topics monti_fill/monti_lead) → browser runs applyFill() (same §3 gate) → REUSED
   TradesTemplate/BrowserFrame/GlowCanvas/split-layout → site builds live while he talks; send_to_rich →
   POST /api/monti/lead. Name-first greeting added (bd3f568). VERIFIED WORKING by Rich: voice clean,
   site builds live. xAI plugin logs noisy "failed to insert item previous_item_id not found" warnings —
   nonblocking, watch for thread-loss, fix = bump plugin version.
   ⚠️ **OPEN BUG + FIX PROMPT DELIVERED (not yet run):** in .building layout, LONG CAPTIONS in the 37%
   pane push the End button off-screen (root overflow clips) → user can't stop Monti, must kill tab.
   Consolidated /monti/live fix prompt given to Rich: (1) fixed top-right always-visible End+Mute bar,
   (2) cap caption ~3 lines, (3) honest lead-failure caption + retry chip (currently a failed lead POST
   is SILENT while Monti says "Rich has it" — no-BS violation), (4) manual "Send it to Rich" handoff
   chip as backup if agent skips its send_to_rich tool. Browser-only, no agent restart.
   → ✅ **BUTTON FIX SHIPPED (4e136bc) + VERIFIED**: fixed top-right Mute/End bar (z300, all layouts),
   caption capped 3 lines, honest lead-failure caption + retry chip, manual "Send it to Rich" handoff
   chip. Claude clicked End live — session killed cleanly.
   → ☁️ **AGENT DEPLOYED TO LIVEKIT CLOUD + VERIFIED 2026-07-20. MONTI IS 24/7 — Rich's PC out of the
   loop.** Agent ID CA_24EKPHpsLYfc, project monti-xbmzg07e us-east, 1/1 replicas, `python main.py
   start` in image, XAI_API_KEY as agent secret (LIVEKIT_* auto-injected). Deploy files committed
   79b6ff8 (Dockerfile, .dockerignore). VERIFIED by Claude: local agent stopped → /monti/live session →
   live remote audio track from cloud agent. Ops: update = `cd monti-agent && lk agent deploy`; secrets
   = `lk agent update-secrets --secrets-file .secrets.cloud.env`; local `main.py dev` = testing only,
   DON'T run simultaneously with cloud (jobs race). CLI gotchas: `lk cloud auth` needs interactive
   terminal (Grok used `lk project add` w/ .env creds instead); PowerShell BOM breaks lk secrets files.
   ⚠️ **SECURITY TODO (open until Rich confirms): ROTATE KEYS** — the BOM error dumped secret material
   into Grok's local tool log. Rotate XAI_API_KEY (console.x.ai) → Vercel + monti-agent/.env +
   .secrets.cloud.env + `lk agent update-secrets`; rotate LiveKit key pair (dashboard) → Vercel +
   monti-agent/.env (cloud agent auto-injected); redeploy Vercel; retest /monti/live.
   PUNCH LIST: agent idle/max-session timeout (cost guard); retire old /monti in favor of live version;
   THEN the real prize = make the built sites impressive (layout variety, more verticals, polish).
   /monti/live confirmed hidden (inherits app/monti layout noindex; robots.txt Disallow /monti/).
   STRATEGY (Rich): polish what we have, THEN layer more. Next big prize after voice feels smooth =
   make what Monti BUILDS impressive (richer sections, real layout variety, motion, depth — right now
   it's a thin single-layout fill). Back-pocket: Food+Tourism
   multi-page, WV map flag-plant, HVAC hero swap, photo-upload, pre-cached greeting.

## ⏳ OPEN LOOPS — chase these down (don't let them rot)
Small stuff that's easy to forget between sessions. Confirm each, then delete the line.
- **Delete test lead** `cb87a815-010a-4c5e-9582-c2def7782113` ("TEST — Delete Me") once Rich
  confirms the heads-up→Gmail test worked. (Supabase `businesses`; use MCP `execute_sql`, not the
  bridge.)
- **Verify band copy deployed** on veteran-ai-websites: hero band should read *"I spent 15 years
  working alongside small business owners before I ever built a website. I get what you're up
  against — and I build sites that actually help."* (Grok Build prompt was given; confirm via Vercel
  `list_deployments` READY, not device_bash.)
- **notification_email decision:** currently Gmail `rdebariii@gmail.com` (moved off Yahoo because
  Yahoo silently suppresses new-domain mail). Rich to confirm keep-Gmail vs revert-Yahoo.
- **Deliverability before scaled sends:** set up **DMARC** on outreach.veteranaiwebsites.com +
  **domain warmup** before volume. "Delivered" in Resend ≠ landed in inbox (Yahoo proved this).
- **CAPABILITIES.md (todo):** a journal file tracking CURRENT Claude + Grok/xAI model IDs, prices,
  and API abilities, refreshed periodically so we stop working off stale model assumptions. Rich
  explicitly asked us to keep this current. (Verified model IDs live in the outreach-tool section.)

## The Grok battle (for the record)
Ran the outreach AI-upgrade plan past Grok (Heavy) for brutal critique, argued it out. Grok won
the main point (dual-model A/B is premature over-engineering at low volume); Claude won two side
points (failover ≠ A/B; internal enrichment ≠ customer-facing fabrication). Net: plan shrank to
"Phase 1 only — kill the noise." Per the bet, Claude conceded most → owed Grok "daddy." Paid up.

## 2026-07-30 — AUDITOR FABRICATION FIXED + WRONG-RECIPIENT BUG FOUND

### Workflow that now works (use it)
- **Three-agent chain:** this Claude chat = strategy, DB ops, verification, short HANDOFF blocks.
  **A NEW Claude Fable 5 window** = writes the long Grok Build prompt from that handoff.
  **Grok Build** (Rich's Windows PC) = writes and ships the code.
- Why: keeps the main chat from compressing. Rich's order 2026-07-30: *"i want to maximize the
  length of this thread, so anything taking up your memory should be run in another claude window."*
- Rich on the two builders: *"i think i trust claude fable more than grok sometimes, grok seems a
  little wreckless to increase speed."* Fable researches 6+ min and **catches real errors in
  Claude's own handoffs** (it caught 3 of mine on 07-30). Grok finishes in 2 min. Verify Grok.
- **Deliver prompts as fenced code blocks IN CHAT.** Not .md files, not Cursor. Rich has said
  twice: *"you keep giving me that in cursor i dont know how to use it."*

### ✅ SHIPPED — auditor fabrication fix
- Commit `60bf2fc47170722eb7e6e2e86cb0248f95324e06`, deploy `dpl_7XYkpERk92J3HKbt62vrAYZyegMD`,
  state READY, aliased to app.veteranaiwebsites.com. 6 files. Typecheck exit 0, ALL TESTS PASSED.
- **Root cause:** `HIJACK_RE` in `src/lib/audit.ts` matched substrings with no word boundaries —
  `cialis` matched inside "**Specialists**". A matched site got hardcoded fabricated findings
  ("taken over by spammers"), hardcoded `pagespeed_score: null`, and sales copy baked into the
  finding text ("Rich can fix this fast"). The auditor was inventing facts, not reporting them.
- Grok also rewrote rotted goal-loop tests in `typecheck/logic-tests.ts`. Looked like
  "edit the test till it's green" — **investigated it against `src/lib/loop.ts` and it was
  honest**; the OLD tests asserted a `decideTactic` signature that no longer existed.

### ✅ CLEANUP EXECUTED (Rich: "go ahead and delete and lets get back to building")
- `delete from site_reviews where findings::text ilike '%taken over by spammers%'` → **12 rows**.
- Skipped the 1 armed draft citing it (Williams & Associates `02299502-...`).
- Post-check: fabrication_rows_left 0, armed_drafts_left 0, sales_copy_rows_left 0.
- ⚠️ **Wild N' Wonderful Contracting was already SENT** a false "Your website got taken over"
  email on 07-27. Left untouched — Rich's call whether to write and correct it.
- 🔑 **`ensureAuditedFindings` (pipeline.ts:51) CACHES.** It returns the newest existing
  `site_reviews` row and only re-audits when NO row exists. **Skipping a draft does not disarm a
  poisoned review row** — the poison lives in `site_reviews`, so that's what has to be deleted.

### 🐛 NEXT BUG — the scraper harvests Google Fonts designers (prompt sent to Grok 07-30)
- `extractEmails()` (audit.ts:83) runs `EMAIL_RE` over **RAW page HTML**, including `<style>`
  blocks and webfont license headers. Google Fonts license headers carry the **type designer's**
  contact address. `htmlToText()` exists at audit.ts:9 and strips script/style — but
  `extractEmails` doesn't use it. That gap is the whole bug.
- 11 bad `email_source='site_scan'` addresses confirmed. Designers: `info@indiantypefoundry.com`
  (**SENT** to Premier Heating and Air), `luciano@latinotype.com`, `astigma@astigmatic.com`,
  `impallari@gmail.com`. Placeholders: `info@mysite.com`, `mymail@mailservice.com`,
  `ex@mple.com` (slips the deny-list — `example\.` needs the literal dot). Malformed:
  `/teterexcavatingllc@hotmail.com` (**BOUNCED**). ROT13-obfuscated: `vasb@pcnji.pbz`.
- 🔑 **`impallari@gmail.com` is free-mail** → no deny-list or domain list can ever catch it.
  **Stripping the CSS/font/comment markup is the PRIMARY fix; the deny-list is only a backstop.**
  `micahrich` already sitting in `JUNK_EMAIL` is evidence they'd been patching designers one at a
  time instead of fixing the cause.

### Verified facts (checked against the live DB / code 07-30 — don't re-guess these)
- `work_checks` has **ZERO check constraints**; artifact types in use = `draft, review`. A new
  `business` artifact type needs **no migration**.
- `settings.autopilot_enabled` = **false**. So auto-approve risk is latent, not active.
- `sendQueue.ts` has **no recipient-address validation** at send time (only bounce + suppression).
  `autopilotApprove` promotes on **confidence alone**. Hence the send-time recipient guard.
- `businesses.status = 'queued'` is **NOT** the send queue. The send queue reads only
  `email_drafts.status = 'approved'` (sendQueue.ts:171). *Claude got this wrong once and told Rich
  something was urgent when it wasn't — read the actual query, not the status field.*
- **STALE in docs/DECISIONS.md:** the bullet claiming `pickBestEmail` returns `pool[0]`. It
  already returns `preferred || null`. Rules **R1–R7** live in `docs/DECISIONS.md`.
- `typecheck/logic-tests.ts` is **NOT** in `tsconfig.check.json` scope (`src/**` only) → it rots
  silently. It ends in an **async IIFE** that prints the summary and `process.exit(1)`s —
  synchronous tests added AFTER it are never counted. Add tests INSIDE it.
- **Inverted Tailwind palette:** `globals.css` remaps the scale inside `@theme`
  (`--color-slate-900: #f6f9fe`, near white). **Never `bg-slate-700/800/900` as a button bg.**

### Device-bridge limits (confirmed, stop rediscovering these)
- `device_bash` has **NO network** — `git push` dies with `403 from proxy after CONNECT`. All
  pushes happen on Rich's Windows host via Grok.
- `device_stage_files` FAILS on these repo paths; use `device_bash`. The container's `Read` tool
  CANNOT read `/sessions/.../mnt/...`. `device_bash` cannot `rm` (move to `_to_delete/` instead).
  Anything touching `.venv` blows the 45s timeout.

### Business numbers as of 07-30
107 sent / 100 delivered / 9 bounced / 2 failed / **21 distinct drafts opened (19 businesses) = ~20% open rate** /
**0 replies, 0 bookings, 0 inquiries.**
⚠️ **"39 opens" was WRONG and Claude repeated it.** 39 is the raw *event* count in
`email_events` (people re-opening). The real figure is `count(distinct draft_id)` = **21**.
The dashboard was right; Claude was quoting a stale number without checking events vs people.
**Always use count(distinct draft_id) for opens, never count(*).**
27 drafts pending review. Inbound mail is confirmed working, so **the 0 replies is real** — the
message or the targeting is the problem, not the plumbing.

### 🔴 STANDING ORDERS ADDED (violating these annoys Rich)
- **STOP telling Rich to call people.** *"quit pushing me to call people."* Don't raise it unless
  he does.
- **Don't tell him to stop working.** *"dont tell me to not work bud."*
- **Plain, short, phone-friendly sentences.** *"your starting to talk way above my level bud"* /
  *"just make the best decisions for us."* Decide and act; skip technical detail he didn't ask for.
- **Research before asserting.** *"you could take a second and research this stuff before you
  speak... your just not seeking the correct information."*
- Rebuild WV sites are **HAND-BUILT, not Monti**. Monti stays PAUSED; outreach tool is the priority.

### Open decisions parked for Rich (surfaced, not decided)
- Write to Wild N' Wonderful and correct the false 07-27 email? (yes/no)
- Change the loop goal from `drafts_ready` (inventory) to something that counts **sends or replies**?
- Turn `autopilot_enabled` on, or keep hand-approving the 27 waiting drafts?
- Run `scripts/reaudit-hijacked.ts --apply` after reading its dry-run table? (never run yet)
- `loop_state` RLS is off (Supabase advisor flags it) — his call, don't change it unilaterally.

### 2026-07-30 (later) — WRONG-RECIPIENT BUG CLOSED
- ✅ SHIPPED commit `48a94f8882a29e64f9ee26f91ef433188df307d5`, deploy
  `dpl_FBdWXeiQo3KWyeSwG81CVSqrrKCR`, READY, production. 7 files, verified line by line.
  extractEmails now runs on stripped HTML (style/script/comments/link/@font-face removed,
  `ld+json` preserved); shared `emailValidationFailure`/`isPlausibleEmail`; send-time recipient
  guard in `processSendQueue`; admin PATCH + intake validated; business-scoped
  `business_email_valid` supervisor check kept OUT of the draft/review denominators (R3).
- ✅ CLEANUP APPLIED by Claude via MCP (no keys needed — the bundled
  `scripts/cleanup-bad-emails.ts` was never run): **22 businesses cleared**
  (email → null, email_source → 'none', email_hunted_at → null so they re-hunt),
  **7 armed drafts skipped**. Post-check `bad_emails_left = 0`, 158 businesses still have an
  email, 20 drafts pending review, 0 approved waiting to send.
- 6 of the 22 had ALREADY been mailed: Premier Heating and Air, TKS Contracting, Kingdom
  Cleaning, The Monarch Hair Salon, Orangetheory Fitness, Teter Excavating (bounced).
- ⚠️ TWO KNOWN SMALL HOLES (not worth stopping for, patch when convenient):
  1. `johndoe@mail.com` still passes — deny-list has johnsmith/janedoe but not johndoe.
  2. `ALLOWED_MULTI_TLDS` in audit.ts is a fixed list. Blocks nothing real today (all 179
     addresses checked) but will silently drop a future `.plumbing` / `.law` / `.realty` lead.
- ⚠️ BEHAVIOUR LOOSENED: `pickBestEmail` now accepts a **non-role free-mail** address when no
  on-domain address exists (before it returned null). Finds more real gmail-using WV businesses,
  but could grab a web designer's gmail from a footer credit. Watch it.
- 🔴 QUALITY BAR MOVED: two straight bug classes were **fabrication / wrong-target**, not crashes.
  The tool's failure mode is confidently doing the wrong thing. Grade outputs, not exit codes.

## 📌 PINNED IDEA — MONTI BECOMES A PHONE ANSWERING SERVICE (Rich, 2026-07-30)
**Status: PINNED. Do NOT start. Begins only after outreach tool Phase 2 is finished and
self-running.** Rich: *"lets pin this idea... i think this is a priority and something additional
we could offer on our website that would sell itself."*

### The strategy shift behind it
Rich wants to stop being "a guy who sells websites" and become the local person who closes the
**AI gap** for WV small businesses. Websites are the DOOR; AI work is the ROOM.
- **Keep the website as the cold opener.** "Your site is broken" is a problem the owner already
  feels and can see in 5 seconds. "Let's explore where AI could help you" is abstract and gets
  ignored — going more abstract would make the 0-reply problem WORSE, not better. Rich already
  had this right: *"the website thing is just a start."*
- **Cap at 5 AI pilot businesses**, websites for everyone else. Rich's own number. Hold the cap —
  custom apps are a forever support burden for a solo operator. Five deep = a business.
  Twenty shallow = a trap.
- **What sells is not "AI" — it's a specific hour handed back.** Not "AI strategy"; "this answers
  the calls you're missing after 5pm." Small WV owners buy back their evenings, not concepts.
- **The five pilots buy the thing he's missing most: PROOF.** 108 sent / 0 replies is partly
  "stranger asking you to go first." Real before/after numbers from 5 WV businesses fixes that.

### Feasibility — VERIFIED by reading monti-agent/main.py + instructions.md on 2026-07-30
**~2/3 of it already exists.** Do not re-litigate this.
- ✅ ALREADY BUILT: real-time voice brain on **LiveKit Cloud** + **xAI Grok realtime**
  (`MODEL = "grok-voice-latest"`, `VOICE = "castor"`), barge-in/interruption, noise cancellation,
  24/7 cloud worker, tool-calling mid-conversation, `Dockerfile` + `livekit.toml` deploy path.
- ✅ REUSABLE AS-IS: the hard-won conversational discipline in `instructions.md` (21KB) —
  "1–2 short sentences MAX then listen", "never recap", "never list what you're about to do",
  "at most one reaction beat per turn". That's what keeps him from sounding like a robot and it
  transfers to phone answering perfectly.
- 🔧 SWAP (easy — it's a text file + 3 tools): `instructions.md` is loaded at startup, and the only
  website-specific parts are the tools `fill_site` (main.py:354), `restyle_site` (445),
  `send_to_rich` (478). Replace with `take_message` / `book_appointment` / `text_the_owner`.
  `send_to_rich` already proves the outbound-notify pattern.
- ❌ MISSING #1 — **NO TELEPHONY.** Zero SIP/PSTN in main.py (grepped: the only "phone" hits are
  the *business's* phone as a site field). Monti talks through a **browser**, publishing room data
  messages. Real calls need **LiveKit SIP** + numbers from a provider (Twilio/Telnyx). Well-worn
  path, but real work — not a config change.
- ❌ MISSING #2 — **single-tenant.** One Monti for one job. Five businesses need a per-number
  config layer (greeting, hours, services, owner to text). Doesn't exist.

### Honest risks to keep in front of Rich
- **Stakes jump.** A website builder that stumbles is embarrassing. An answering service that
  mis-hears a callback number or books the wrong day costs the owner a real customer — and if it
  dies at 2am, calls just drop. Solo operator on call for 5 businesses' phone lines.
- **Economics look GOOD:** voice runs a few $/hr of actual talk time (memory: 0.08/min tier ≈
  $4.80/hr). A trades business with a few after-hours calls a night ≈ ~$20/mo cost. **$97/mo works
  with room** — and unlike a website it's a reason to pay every month forever.

### Next step when unpaused
Sketch the 5-business pilot end to end (what they get, what Rich owes them, what he measures).
Not started. Do not start it before the outreach tool is done.

## 🚫 STANDING RULE — NO DECEPTION IN OUTREACH (Rich, 2026-07-30)

Rich: *"no dont use anything like that unless its actually piggy backing off the first
message, we cant do anything to deceive people"*

- A subject line may carry a `Re:` prefix ONLY when the email is a genuine reply in an
  existing thread with that business (i.e. a real follow-up to a message we already sent,
  threaded properly). Never on a first touch.
- This generalises: no fake-thread tricks, no invented prior contact, no "as we discussed",
  no manufactured urgency, no implying a relationship that doesn't exist. Open-rate lift is
  not a reason. Rich sells to people in his own county as a veteran — trust is the product.
- Applies to every message template, every playbook, and anything Grok generates.

## 2026-07-30 — OPEN-AWARE CLOSING + FASTER FOLLOW-UPS + MESSAGE REWRITE (SHIPPED)

Three Grok builds, each independently verified by a Claude subagent. Verification caught real
defects every single round — keep doing it.

**Shipped commits (all on main, all Vercel READY):**
- `8c1c029` + `098e985` — feature build (engagement.ts, open-aware autoClose, engaged-first
  follow-up pool, reopen backfill, lead-panel engagement + confirmClose, message rewrite).
  Deploy `dpl_HxapFsdcentBYqEwuiTWypbPWyPs`.
- `4277485` + `6216e41` — defect fixes 1-3. Deploy `dpl_84rpsqwkBhj3E4RtPQUyB7HJ9cdB`.
- `1bc285f` — step-1 REPLY_NUDGE reply-path fix + step-2 band 22-75 → 30-90.
  Deploy `dpl_9nrjsuN5zvX2YjkPmC3BYTHettUc`.

**CORRECTIONS TO EARLIER BELIEFS — I had these WRONG:**
1. `autoCloseUnresponsive()` did NOT close the five leads. It has NEVER fired (0
   `closed_no_response` rows). **Rich closed them himself from the lead panel**, in two batches
   (3 on 7/28 13:56 UTC, 2 on 7/29 01:13 UTC). Root cause was that the lead-detail GET never
   queried `email_events`, so the panel could not show that a lead had opened. Now fixed:
   GET returns engagement, and closing a human-engaged lead requires `confirmClose`.
2. Follow-up timing did NOT ignore opens — followups.ts already had engagement timing. The real
   bug was the **candidate window**: only the 15 OLDEST `sent` leads were considered, so A1
   General Contracting (5 human opens) had 39 older leads ahead of it and was never seen.
   Pool is now 80 with engaged-due-first, still ≤5 drafts/tick.
3. **No first-touch email has ever carried "Re:"** — 0 of 93. It only ever appeared on genuine
   step-2 follow-ups. Nothing deceptive has gone out.

**Facts established:**
- HUMAN OPEN = an `opened` event ≥60s after that draft's `delivered` (fall back to `sent`;
  neither → machine). Implemented in `src/lib/engagement.ts`.
- **There are NO `clicked` events in production.** Event types are only sent/delivered/opened/
  bounced/failed. All click logic in engagement.ts is dead code today. Opens are the only signal.
- `closed_no_response` status does not exist in the DB either (autoClose never fired).
- Magic string `'lead closed before sending'` is written only by
  `api/admin/leads/[id]/route.ts` and read by `step2RowBlocksNewFollowUp` in drafting.ts.
  Duplicated literal, no test on the coupling — editing either silently breaks the reopen path.

**R4 DECISION — NUMERIC CONFIDENCE IS RETIRED AS A QUALITY SIGNAL.**
Two rebalance attempts failed in opposite directions: first version made step-2 max out at 0.80
(could never clear the 0.9 threshold), second made a generic template draft score 0.95. Honest
measured ranges: **both steps floor at 0.15 and max at ~0.96.** The score separates garbage from
well-formed; it does NOT separate good from mediocre, and step-2 discriminates on little beyond
word count. It stays as a well-formedness check only. **Do not enable autopilot on the strength
of this number.** Recorded in docs/DECISIONS.md under R4.
Reason it can't work: the same model that writes the email writes the score, in the same
generation. It can judge shape, not quality.

**AUTOPILOT GATE IS NOW EVIDENCE, NOT A SCORE.** Do not flip `autopilot_enabled` until the new
message has produced actual replies from hand-approved sends. 107 sends / 0 replies means
autopilot today would only automate failure.

**KNOWN LEFTOVERS — logged, deliberately NOT fixed (not worth another build on a retired score):**
- Word-band vs gate mismatch, both steps: `generateWithLengthCheck` measures `gen.body`, the
  scorer measures the ASSEMBLED body (REPLY_NUDGE ≈9-15 extra words, or the CTA). So a
  gate-legal long draft is scored as over-length and loses 0.12. drafting.ts:108-109 (step-1),
  drafting.ts:123 (step-2).
- Step-1 `hasReplyPathText` is now always true (the assembler appends REPLY_NUDGE to every
  step-1 body lacking a "?"), so that term is dead weight — the −0.1 branch is unreachable.
- Unspecified scope creep in `1bc285f`: step-2 penalty floor moved `wc < 18` → `wc < 22`.
- Test fragility: `withBtn` exemplar sits exactly on the 30-word boundary; logic-tests.ts:403
  asserts a property of a string the test itself built (tautology); tests hand-build bodies
  instead of calling `assembleDraftBody` (unexported), so they won't catch assembler changes.

**REOPEN LIST — 7 leads closed after a HUMAN open (verified against live DB, awaiting Rich):**
Fish Hawk Acres (3 opens, last Jul 14) · ReNewU Beauty & Wellness (3, Jul 15) ·
Sweet-A-Licious (2, Jul 16) · Upshur Veterinary Hospital (2, Jul 17) ·
Weston Veterinary Hospital (2, Jul 14) · Dr. Sonya James Family Dentistry (1, Jul 16) ·
Weston Storage Inc (1, Jul 16).
The last two were NOT in the original five — found by running the classifier over the whole DB.
Script exists (`scripts/reopen-opened-closes.ts`, dry-run default) but Grok cannot run it —
empty local Supabase secrets. **Claude runs it via Supabase MCP, same as the 7/30 email cleanup.**

**PROCESS NOTE THAT IS WORKING — keep it:** Fable 5 writes/verifies the long Grok prompt in a
separate window; Claude verifies Grok's shipped work in a SUBAGENT (not in the main window, to
stop this chat compressing). Fable caught 3 of my errors; subagents caught 3 defects in Grok's
first build, 3 more in the second, 2 in the third. Nobody in this loop ships clean first time.

## 2026-07-31 — PHASE 2: THE QUALITY GATE (SHIPPED + VERIFIED)

The supervisor is no longer a rear-view mirror. A pure function gateDraft()
(src/lib/draftGate.ts, helpers in src/lib/draftText.ts, labels in
src/lib/checkLabels.ts) is now enforced at FOUR points: draft creation (one
in-memory retry, exactly one row inserted), the approve/send_now route
(refuses with plain-English reasons before any status change), autopilotApprove
(skips blocked, no writes), and processSendQueue (bounces blocked approved
drafts back to pending_review + notifyRich). R1 intact everywhere: supervisor
still writes only supervisor_runs/work_checks; the gate stores nothing, reads
nothing, computed live on the artifact at every decision point.

Hard blocks: placeholder junk, invalid/junk recipient, suppressed topic,
missing business name (fail only — unknown never blocks), fake "Re:" on step-1
(no-deception rule). Warnings only: word count (chrome-stripped, 35-80/30-90),
domain mismatch. Not gated: draft_cites_finding (cite-nothing is a designed
option), all review_* checks.

Commits: 2af5984 (Phase 2, 13 files, deploy dpl_BJkfQqTv46itG7ZP5koxQtSEgiSH),
dcd5616 (over-block fixes, 6 files, deploy dpl_3bZTex4EVQbiieZhLGkHeryUphAL).
RULES_REVISION now 10. Supervisor word-count chrome bug fixed (K&M / Weston
Storage false fails cleared). New observe-only check draft_first_touch_no_fake_re.
Dashboard shows humanizeCheck() sentences instead of raw snake_case.

The 4 approved drafts with suppressed-topic fails (Ringer's "pric", Weston
Veterinary "cost", Smitty's HVAC "pric", J.F. Allen Company - Buckhannon Plant
"hours") will be BOUNCED at the next weekday 9-11 ET send window — back to
review with red banners, not mailed. Rich gets a notification.

Verification (3 adversarial rounds, defects found and fixed each round):
round 1 found D1 short-name false block ("KFC LLC" style), D2 UI dead end
(no Save path when blocked), D3 \bfee matching "feel", D4 autopilot
head-of-queue starvation, D5 business stranded at "queued" after bounce.
All five fixed in dcd5616 and confirmed BY EXECUTION, not just reading.

Known leftovers (logged, low priority): pricing regex matches bare
"rate"/"charge" (over-block: "first-rate work") and misses "pricey"/"costly"
(one-line fix prompt delivered to Rich for Grok); multi-word pure-filler names
("The Company LLC") still hard-block; multi-word name candidates use substring
includes (false-pass on "a 1-page refresh" for "A-1 Towing"); bounce restore
update is fire-and-forget (silent failure re-strands business); >100
all-blocked drafts would re-starve autopilot; bounced drafts consume send-cap
slots (caps under-fill); typecheck/logic-tests.ts still not enforced by any
automated build step (excluded from both tsconfigs, no test script, tsx not in
devDependencies).

ALSO SHIPPED EARLIER TODAY (same session): rebuild-pending-drafts safety
chain — 54ffacc/7c6318d (feature+hardening), a910806 (orphan fix), e60d7dd
(quarantine loop fix: clears businesses.email, suppress(email,"manual"),
discovery checks isSuppressed; loop provably dead), a785d72 (playbook stamps
on 4 early-return audit paths so rebuild counter can reach zero). Rebuild
button clicked by Rich: zero work to do (he had approved all pending drafts).
Quarantine "manual" suppression reason still unverified against a live row —
nothing has been quarantined yet.

STATUS AFTER PHASE 2: the tool now refuses to send bad email on its own.
Remaining before autopilot: evidence of replies (107 sent, 0 replies).
Next build agreed with Rich: deepen the email hunter (contact/about pages,
Facebook page emails, structured data) to reach the 553 businesses without
addresses. Monti outbound cold-calling REJECTED (FCC treats AI voices as
robocalls; trust is the product) — Monti stays inbound-answering, pinned
until outreach runs itself.

## 2026-07-31 (LATER) — DELIVERY-CLAIM GUARD, HUNTER V2, MONTI PIVOTS TO RECEPTIONIST

OUTREACH — shipped and verified today, all on main, all Vercel READY:
- d17059d: no-false-delivery-claim guard. A live follow-up (Design Roofing)
  claimed "did that sample homepage land okay?" when no sample was ever sent.
  Root cause: followUpPrompt had zero offered-not-sent guards (first-touch had
  three) and its own askRule example presupposed the sample existed. Fixed
  prompt + new hard-block check draft_no_false_delivery_claim (shared regex in
  draftText.ts, gate + supervisor, RULES_REVISION 11). Rich SKIPPED the Design
  Roofing draft — nothing deceptive ever sent. The check found one more real
  offender in the approved queue: K&F Construction "I sent over" (2a13bebf) —
  will bounce at Monday's send window.
- 742b264: pricing regex precision (no bare rate/charge; pricey/costly added)
  + LEGACY_CHROME so the old nudge still strips from existing drafts.
- 810a044: EMAIL HUNTER V2. JSON-LD extraction, cross-page candidate pooling
  (free-mail no longer beats on-domain), one honest Facebook attempt per
  business (historical yield 0/111 — expectation set), one-time re-hunt of
  ~240 businesses via HUNT_EPOCH "2026-07-31T17:10:00Z" (single DNF .or()
  filter, proven 235=235 vs raw SQL on live data), countHuntBacklog liveness
  fix, 210s tick-elapsed guard so the supervisor always runs. Verified live:
  backlog draining (30 re-hunted in first hour), 0 new emails so far — the
  240 are v1's hardest cases; final verdict when the pile clears (~2-4 days).
  Fable 5 CAUGHT MY BIG ERROR in the handoff: the deep crawl already existed
  (a8ac221, 07-24); "homepage only, 5,000 chars" describes the content
  REVIEWER, not the hunter. Retire that premise from future handoffs.
  Minor leftovers for next Grok batch: budget-exhausted FB rows burn their
  re-open without an attempt; fbAttempted overcounts shape-gate refusals;
  markNeedsManual swallows update errors; applyFoundEmail lacks .is(email,null)
  race guard.

GATE'S FIRST LIVE CATCH (07-31 13:00 window): Weston Veterinary "costs" draft
bounced to review, notify email sent to rdebariii@gmail.com, Rich skipped it.
15 follow-ups sent same window including all 7 reopened leads. Ringer's /
Smitty's / J.F. Allen didn't fit the 15-cap batch — gate catches them Monday.

MONTI — STRATEGIC PIVOT (Rich's call, 07-31): converting Monti from website
builder to SMALL-BUSINESS PHONE RECEPTIONIST product. Reasons: recurring
revenue vs one-time builds, sharper pain (missed calls), narrower perfectable
scope. Website-builder Monti agent (monti-agent/) stays LOCKED and untouched.
Inventory verified: agent is 2 files; ~2/3 reusable voice plumbing, website
weight cleanly separable (instructions.md + 3 tools + browser handshake).
KEY DISCOVERY: xAI Voice Agents console (beta) includes free phone number,
SIP, browser testing, call recording+transcription, doc-upload knowledge,
$0.05/min + $0.01/min telephony, no platform fee. DECISION: prototype on the
xAI Agent Builder FIRST (Rich built one in the console with my Hollow Creek
Plumbing receptionist brain — "works pretty damn good" in preview). Custom
LiveKit build deferred until the builder version earns it. The monti-receptionist
Fable handoff was written but is ON HOLD — do not run it. Rich's free tries =
audition tests: price-fishing, interruptions, wrong-digit read-back,
telemarketer, noise. Not yet published (preview only). Next: publish → real
phone number → find where messages land (email/text to owner closes the loop).
Grok Voice Think Fast 2.0: $0.08/min, default Aug 5, Rich has early access;
Monti voice pin prompt still pending in backlog.

VR&E: Rich's eligibility appointment with the VRC is THURSDAY AUG 6, 10:30 AM.
Prep-session reminder set for Tue Aug 4 (trig_013JuUVzMeBrQRtH4EE73bzu).
Monday outreach check-in set (trig_01F8BLqxs1J2c51QUNEXLink): gate bounces +
hunter drain report.

NEW STANDING RULE (Rich, 07-31): "explain to me only high level details and
things that need my human decisions, keep anything to do with coding or
security your decisions." High-level to Rich; technical decisions are Claude's.

STRATEGIC FRAME AGREED: the project is an agentic loop system with a human
checkpoint (sense→decide→act→check→adjust; gate at four points; supervisor
grading; loop tactics). Reproducing for other businesses: door 1 run-it-for-
them service (soonest), door 2 copy-per-customer, door 3 true SaaS (much
later). Prerequisite for all: first customer signed from a tool-sent email.
Broader arc: AI employees for small businesses (sites, phones, outreach).

## 2026-07-31 (EVENING) — NOTIFICATION FLOOD INCIDENT + WEBHOOK FINDINGS

INCIDENT: The tool has been emailing Rich ~140x/day since Jul 27 (commit
d0940fa). Cause: followups.ts:184 shortfall condition counts due leads that
ALREADY have a parked step-2 draft as "0 created" failures, and the notify at
:214 has no dedupe — fires every 10-min tick forever. Amplifier: tick.ts:558
shouldBrief includes the standing shortfall. Resend dashboard showed the truth
(677 emails Jul 17-31, ~125-150/day delivered since Jul 28 vs 7-15 real
outreach sends/day). I initially told Rich 125 was a lifetime number — WRONG,
his screenshot proved daily. Fix prompt delivered to Grok (actionable-due
guard + once-per-day dedupe copying maybeNotifyTickErrors pattern + brief
de-amplifier). Notifications send FROM the cold-outreach domain
(rich@outreach.veteranaiwebsites.com) TO rdebariii@gmail.com — flood is a
sender-reputation risk on the domain outreach depends on.

📌 PINNED (Rich approved, 07-31): MOVE NOTIFICATIONS OFF THE OUTREACH DOMAIN.
The tool talking to Rich must never share sending reputation with the tool
talking to customers. Separate subdomain or provider for operational mail.
Small dedicated build after the flood fix is verified.

WEBHOOK (same evening, from Resend's failing-webhook email): the app is
healthy — root cause is almost certainly a STALE SECOND Resend webhook
endpoint pointed at veteran-ai-outreach.vercel.app, which Vercel Deployment
Protection now 401s at the edge (ssoProtection all_except_custom_domains).
The working endpoint via app.veteranaiwebsites.com delivers fine (all 15 of
today's sends tracked; 30 days of continuous events; no duplicates). RICH'S
ACTION (his account, not automatable): in Resend > Webhooks, edit/delete the
vercel.app endpoint — but first confirm the surviving endpoint subscribes to
bounced + complained (they feed suppression; losing them silently blinds
bounce protection). Also: RESEND_WEBHOOK_SECRET is unset, so the webhook
accepts unsigned POSTs — anyone with the URL could forge bounce events and
suppress arbitrary addresses. Walk Rich through setting it when he's in both
dashboards. DEPLOY.md:51 + README.md:47 still document the vercel.app URL —
fix in a future docs commit. Also noted: pg_cron stores x-cron-secret
plaintext in cron.job.

HUNTER V2 MINOR LEFTOVERS (next Grok batch, from verification of 810a044):
budget-exhausted FB rows burn their one epoch re-open without an attempt;
fbAttempted counter overcounts shape-gate refusals; markNeedsManual swallows
update errors; applyFoundEmail lacks .is(email,null) race guard.

## 2026-08-04 — THE BIG TUESDAY: OPUS VOICE, REPLY DESK, BATCH 2, VA MOVED UP

VA: appointment MOVED UP to WEDNESDAY AUG 5, 10:00 AM (was Thursday). Prep
done Tue morning; three FINAL docs delivered (Business Summary one-pager with
legal name Richard E. Debar III, Equipment List, Sourcing Sheet — reconciled,
totals match: roughly $10,000-$14,000). 8 AM Wed send-off scheduled
(trig_01UB8kv6Sv2epZEN7eJ3bcQB). C&W nudge fires Wed 9 AM
(trig_01St5egHRViNk49KtNqY2dMP) — Rich to ignore until after appointment.

SHIPPED TODAY (all verified, all on main):
- 8cd24a8 bounce-time auto-rewrite (blocked cold drafts arrive in review
  pre-fixed, one attempt ever, cap 3/run) + learning v0 residue cleanup.
- b59f3da BATCH 2: zombie revive rule (explicit-no leads NEVER auto-revive;
  one auto-revival ever via client_notes marker), keyed notify dedupe (map
  {sig:day} cap 20, legacy string handled — verified against live value),
  supervisor false grades fixed (cite-nothing→unknown, isNonOwnedWebsiteUrl,
  case stamps; R12), chain filter (+Ace/True Value/Do it Best/Harbor
  Freight/Menards; carecenter@/customercare@/corporate@/headquarters@
  junked), 7 small S5 fixes. Test suite had a dup-import defect (fixed in
  d4ee026). Chain sweep: only Ace Hardware (Salem, pending_review) — Rich to
  decide skip.
- d7ba8f7 LANGUAGE + OPUS: "shops" wording fixed (TRADE_WORDING_RULE: crew/
  outfit for trades, never call a contractor a shop), smart tier = 
  claude-opus-5 for ALL outreach copy (first-touch, options, follow-ups,
  bounce-rewrites; ~$8-30/mo extra), asphalt/concrete/sealcoat/grading/
  demolition added to TRADES. Zero defects in verification.
- 4250894 THE REPLY DESK: genuine human reply → cold sequence cancelled →
  Opus drafts response in Rich's voice (sequence_step 0, reply_to_reply_id
  set, NEVER status approved) → top of Work queue → approve = immediate
  threaded send (no caps/window; kill_switch/suppression still block).
  Opt-out text → suppress, no draft. Webhook idempotent via
  replies.message_id dedupe. Verified: NO path sends without Rich's click;
  cold machinery can never touch reply drafts (filters everywhere, R13).
  Waits silently until the first real reply — that's the point.
- Also fixed in prod (hand-applied, records committed): 'sending' status
  constraint (Mon's claim-first fix had failed every send Tue morning — 14
  drafts wrongly failed, restored, zero sends lost except the day);
  email_events now allows 'clicked' (CLICKS WERE SILENTLY DROPPED SINCE
  LAUNCH — constraint rejected them, error swallowed; engagement logic
  always wanted them); loop_state RLS enabled; unique partial index on
  replies.message_id (concurrency hardening).

FABLE ERRORS-CAUGHT LOG: reply-desk handoff had 5 errors Fable caught (no
notifyRich dedupe to bypass, no unsubscribe classification exists, angle-null
insufficient for learning exclusion, webhook already non-2xx on inbound,
LeadPanel + transactional-send precedent unlisted). My verification then
caught the webhook race Fable missed. The chain holds both directions.

MISC: Asphalt Kings "1,000+ customers" claim traced GROUNDED (their own
homepage text via audit finding — chain of custody works). Rich's standing
rules added this week: action items at START of messages; high-level only,
coding/security decisions are Claude's. Two time flubs Tue (said VA was
"tomorrow" when Thursday, then confused evening) — check the clock before
calendar statements. Learning loop live: 137 sent / 26 human opens / 0
replies baseline; guidance empty (correct); angles recording on new drafts.
