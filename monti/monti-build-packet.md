# MONTI — BUILD PACKET (prototype → real)

*Self-contained spec to build the real Monti into veteran-ai-websites. Hand this to Grok Build.
Build it TEST-FIRST on a hidden, unlinked `/monti` page — nothing public until Rich approves.*

Author: Claude (command center) · For: Rich, Veteran AI Websites · 2026-07-19

---

## 0. What we're building (and what already exists)

Monti is a voice concierge on veteranaiwebsites.com. A visitor talks to him; he asks a few
questions; and **live, while they answer, a real website assembles on screen.** At the end he hands
them to Rich as a hot lead. On screen he's a **warm glow** that pulses to his voice, with a text box
the visitor types into; once he knows the business he slides to the side and the website builds
center-stage.

**This is already prototyped and proven.** Reuse these — don't start from scratch:
- `monti/monti-experience.html` — the FULL working prototype (glow face + input box + the layout
  transition + the live site assembly + the lead handoff). This is the reference for UX, timing,
  layout, and the section-by-section fill. Port its behavior into the Next app.
- `monti/monti-face.html` — the standalone glow (canvas). The exact visual to reuse.
- `monti/monti-trades-template.html`, `monti-food-template.html`, `monti-tourism-template.html` —
  the 3 locked, contract-driven templates. Monti FILLS these; he never designs.
- `monti/monti-trades-site.html` — the multi-page version + adaptive page-count logic (`pagesFor`).
- `photolib/library.json` + the `IMG` maps in each template — the curated 4K photo library
  (trade → photo id), all sources 6000px+, Unsplash commercial-free.

**The non-negotiable guarantee:** Monti does NOT design — he FILLS. He only ever emits **structured
JSON** matching the contract in §3; the locked templates render it behind a **validation gate**.
A fixed frame + valid content cannot render ugly. Every field has a max length AND a designed
fallback. Keep this sacred — it's the whole reason it "can't miss."

---

## 1. The three APIs to hook up (the heart of this packet)

All keys already live in Vercel from the outreach tool. Keys stay **server-side only** — never
shipped to the browser. All model/voice calls go through Next.js API routes.

### A. The BRAIN — Claude (primary) / Grok (failover)
Replaces the prototype's hard-coded script. Reuse the outreach tool's provider-agnostic
`src/lib/llm.ts` (Anthropic default + xAI failover, already built). The brain, each turn:
1. Reads the conversation so far + the visitor's latest message.
2. Decides Monti's next line (his persona: a warm, plain-spoken West Virginia mountaineer guide —
   friendly, confident, never salesy or corny; short sentences).
3. Extracts/updates the **structured §3 fields** from what it's learned.
4. Picks the `template_id` (trades/food/tourism) and `hero_image_id` from the library once it knows
   the business type.
5. Writes the personalized **copy** (headline, subhead, service descriptions, about) — on-brand,
   no fluff.
6. Returns a **single JSON object** (the turn contract, §2) — **never raw HTML, never markdown.**

**Primary = Claude** (strongest at controlled structured output + warm copy → protects the
guarantee). **Grok = failover** via the existing layer. Model IDs: use the tiered setup already in
`llm.ts` (a fast tier for the chatty turns is fine; the copy-generation turn can use the smart tier).

### B. The VOICE — xAI Voice API (recommended) / Pipecat (open-source alt)
Monti's spoken voice. **Use the xAI Voice API** (`XAI_API_KEY`), not raw TTS — it's speech-to-speech,
sub-second latency, with built-in reasoning AND **tool-calling mid-conversation**, 25+ voices,
barge-in/interruption handling ($0.05/min). That means Monti can talk, think, and call tools (fill a
template section, write the lead) inside one real-time loop instead of us hand-wiring TTS + STT +
turn-taking. Pick a warm voice with a little grit. Feed the output audio through a Web Audio
`AnalyserNode` so the **glow pulses to the real voice amplitude** (`getByteFrequencyData` → the glow's
`amp`, replacing the prototype's fake envelope).
- **Open-source alternative:** Pipecat (BSD, github.com/pipecat-ai/pipecat) orchestrates
  Claude-brain + xAI-voice + function-calling + turn-taking over WebRTC — more control, mix-and-match,
  if we don't want to be all-in on xAI's voice stack.
- **Phase 1 needs neither** — Phase 1 is typed (glow on a simple envelope). Voice is Phase 2; that's
  where the Voice API (or Pipecat) goes in.

### C. Speech-to-text — mostly SOLVED by the Voice API
If we use the xAI Voice API (§B), it's speech-to-speech — voice *input* is built in, so there's no
separate STT to wire. v1 (Phase 1) is still **typed** (the box is there); voice-in arrives with the
Voice API in Phase 2. Pipecat likewise bundles STT if we go that route.

### ⛔ CRITICAL — what the "engine" is NOT
**Grok Build CLI is the BUILD-TIME tool that builds Monti. It is NOT Monti's runtime engine.** Do
NOT wire a coding agent to generate a customer's site from their prompt at runtime — that reintroduces
exactly the unpredictability we designed out ("it can miss"). Monti's runtime brain (Claude/Grok via
the LLM layer) only ever **fills the locked templates with structured JSON behind the validation
gate.** The model fills; it never designs. Keep this line bright.

---

## 2. The turn contract (brain ⇄ UI)

Every brain turn returns exactly this JSON. The UI never parses free text.

```json
{
  "say": "Monti's next spoken line (≤ 220 chars, one or two sentences)",
  "expect": "text" | "choice" | "done",
  "choices": ["Landscaping", "Plumbing", ...],   // only when expect === "choice"
  "input_hint": "placeholder for the text box",   // when expect === "text"
  "template_id": "trades" | "food" | "tourism" | null,
  "hero_image_id": "id from the library, or null",
  "patch": { /* partial §3 contract to MERGE into the working record (see §3) */ },
  "fill": ["hero","trust","services","about","contact"],  // sections now ready to render
  "done": false
}
```

- Server **validates** `patch` against §3 (types, max lengths, enums) before merging. Too long →
  truncate to the designed max. Missing → the template's designed fallback fires. Malformed → drop
  that field, keep going. The UI renders only sections named in `fill`, atomically (skeleton →
  content), exactly like the prototype.
- `expect:"choice"` drives the chip row (e.g. the trade pick); `expect:"text"` drives the input box;
  `expect:"done"` triggers the honest handoff + lead write.

---

## 3. The §3 DATA CONTRACT (the spine — this is what Monti fills)

This is the ONLY shape Monti produces. Locked. (Updated from the template build — note the
`business` block and `hours`/`reviews` that the first draft lacked.)

```jsonc
{
  "template_id": "trades" | "food" | "tourism",
  "palette": "<one of the template's 2 approved palettes>",
  "copy_tone": "grounded" | "warm" | "adventurous",

  "business": {
    "name": "string ≤ 40",
    "phone": "string ≤ 20",
    "service_area": "string ≤ 60",
    "established": "number | null",
    "hours": "string ≤ 40 | null"      // Food = open hours; Tourism = season window; Trades = null
  },
  "hero":   { "headline": "≤ 64", "subhead": "≤ 150", "cta_text": "≤ 22", "image_id": "<library id>" },
  "about":  { "body": "≤ 320" },
  "services": [ { "title": "≤ 30", "description": "≤ 120" } ],   // 3–6 (menu items / trips / services)
  "trust":  {
    "badges": [ "≤ 24", ... ],                                   // 0–4
    "reviews": [ { "quote": "≤ 200", "name": "≤ 28", "detail": "≤ 32" } ]  // 0–3
  },
  "contact": { "cta_text": "≤ 22", "phone_prompt": "≤ 48", "emergency": true|false }
}
```

Every field: designed slot AND designed fallback (empty state + longest-allowed state both look
intentional — proven in the templates). **Adaptive page count** (multi-page): reuse `pagesFor()` from
`monti-trades-site.html` — a rich business gets 5 pages, a simple one gets 3. v1 can ship one-page
and turn multi-page on per the same rule.

---

## 4. The conversation (what Monti asks → what it fills)

The brain runs this arc (it owns the wording; this is the intent + the field each step captures):

1. **Greet + name** → `business.name`. (Site frame hidden; glow full-screen.)
2. **What kind of business** → `template_id` + trade → **transition to build layout** (glow slides
   left, browser frame slides in, url = name-slug.com), fill `hero` (headline + photo).
3. **Service area** → `business.service_area` + fill `hero.subhead`.
4. **Services / menu / trips** → Monti proposes trade-appropriate defaults, visitor confirms/edits →
   `services[]` + fill the services section.
5. **Phone** → `business.phone` + fill contact.
6. **What makes you different** (skippable — brain writes it if skipped) → `about.body` + `trust`.
7. **Wrap + honest handoff** → `expect:"done"` → the honest counter line + lead write (§6).

Latency hides behind the conversation (one section per answer, fast model, pre-picked images). Never
show a half-broken frame — skeleton → atomic swap, per the prototype.

---

## 5. The `/monti` page (front end)

Port `monti-experience.html` into a Next route/component. Keep:
- The **glow** canvas (from `monti-face.html`) — but drive `amp` from the **real xAI audio**
  (AnalyserNode), not the fake envelope.
- The **input box** + **chip row** (for `expect:"choice"`).
- The **layout transition**: glow full-screen for hello → `.building` state → glow to a left
  companion column (~37%), website builds in the right browser frame (~63%). Mobile: stacks (site
  top, glow+input bottom bar). All already in the prototype CSS.
- The **live site preview** = the actual locked template component, fed the growing §3 record,
  rendering only `fill`ed sections with skeletons for the rest.
- **Voice on/off** toggle. Respect `prefers-reduced-motion`.

**Route rules:** unlinked, `noindex`, excluded from `sitemap.ts`, no nav/footer link, not referenced
anywhere public. Reachable only by typing `/monti`. Stays that way until Rich flips it on.

---

## 6. The lead handoff (Supabase) — EXACT SCHEMA (verified + migrated 2026-07-19)

Write to the existing outreach Supabase (`veteran-ai-outreach`, project `sqgnyrlegbjhpebtbybd`) — the
SAME `public.businesses` table the focus queue reads, so Monti leads surface in the tool Rich already
uses. Server route only, using the **secret / service_role key** (RLS is on; the client key can't
insert). Env in the veteran-ai-websites Vercel project: `SUPABASE_URL` (base URL, no `/rest/v1/`),
`SUPABASE_SERVICE_ROLE_KEY`.

Two columns were ADDED to `businesses` for Monti (migration `add_monti_lead_columns`, applied):
- `source text not null default 'outreach'` — existing 477 rows are `'outreach'`; Monti leads set `'monti'`.
- `monti_draft jsonb` — holds the full §3 record Monti drafted.

On `expect:"done"` → visitor opts in → `POST /api/monti/lead` inserts one row:
```sql
insert into public.businesses
  (place_id, name, category, phone, email, formatted_address,
   has_website, status, lead_score, contact_bucket, source, monti_draft)
values
  ('monti-' || gen_random_uuid(),   -- place_id is NOT NULL (Google id); synthesize one
   :business_name,                  -- business.name
   :trade,                          -- category = the trade (e.g. 'Landscaping')
   :phone,                          -- business.phone
   :email,                          -- if collected, else null
   :service_area,                   -- formatted_address = service area
   false,                           -- has_website (they have none — that's the pitch)
   'new',                           -- status: enters the review flow (refine the value once we see
                                    --   how the focus queue sorts; high lead_score already floats it)
   100,                             -- lead_score HIGH → sorts to the top (hot inbound)
   'monti_inbound',                 -- contact_bucket: distinct from cold buckets
   'monti',                         -- source
   :draft_json);                    -- monti_draft = the full §3 record (so Rich opens it & sees the site)
```
- Honest handoff copy: it's a live preview; Rich (a WV veteran) will reach out personally. No fake
  "your site is live" claims. On-screen confirmation: "Rich has it — expect a call/text at <phone>."
- NOTE: the focus-queue UI lives in the separate `veteran-ai-outreach` repo. If Monti's leads should
  render with a special "Monti" badge or lane there, that's a small follow-up in that repo (filter/
  label on `source='monti'`) — not required for Phase 1; the lead lands and surfaces via lead_score.

---

## 7. Phased build (ship + test each phase hidden on /monti)

**Phase 1 — Typed MVP (the proof).** `/monti` page (glow + typed conversation + chips) → brain
(Claude via `llm.ts`, structured turns) → live site assembly in the locked **Trades** template →
lead into Supabase `hot_inbound`. **No voice yet** (glow pulses on a simple envelope for now).
Goal: a real person can type through it and get a real drafted site + Rich gets the lead.

**Phase 2 — Voice.** Add xAI TTS: server route returns audio, client plays it, glow pulses to the
real amplitude. This is the "wow." Add Food + Tourism templates to the brain's template choices.

**Phase 3 — Polish / later.** Voice input (STT), the WV county map flag-plant on completion,
multi-page output via `pagesFor()`, live photo-upload option, pre-cached greeting for zero dead-air.

Test-first the whole way: hammer `/monti` privately (as a plumber, a diner, a cabin), try to break
it, watch latency, confirm the lead lands right — before any public reveal.

---

## 8. Guardrails (do not violate)

- **Structured JSON only** from the brain — never raw HTML/CSS/layout. The validation gate coerces
  to the contract; templates render it. This IS the "good every time" guarantee.
- **Keys server-side only** (`XAI_API_KEY`, `ANTHROPIC_API_KEY`) — never in client code.
- **Hidden + noindex** until Rich approves. Not in sitemap, no public links.
- **No fabrication** — Monti uses curated representative photos (honest), writes real copy from real
  answers, and never claims the preview is a live published site.
- **Grok Build owns the working tree** — commit only the Monti files for each phase; typecheck;
  push to main; Vercel auto-deploys. Verify build health via Vercel (READY), not local tsc.
- **Reuse the prototype + templates + photo library** — the design decisions are locked; don't
  redesign, port.

---

## 9. Definition of done (Phase 1)

- `/monti` loads hidden; glow greets; a typed conversation runs on the real Claude brain.
- The visitor's answers assemble a real Trades site live (skeleton → atomic fills), business name in
  the url bar, all from validated structured JSON — no broken frames, ever.
- On finish, a `source=monti` `hot_inbound` lead with the drafted §3 record lands in Rich's tool.
- Nothing public points to it. Rich can hammer it and approve.

*Then Phase 2 (voice) makes it sing. Frames are locked, the prototype is the map — this packet is
the wiring. Build it hidden, break it privately, reveal it when Rich says so.*
