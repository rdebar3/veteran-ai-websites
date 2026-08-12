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
