@monti/monti-build-packet.md @monti/monti-brain-prompt.md @monti/monti-experience.html @monti/monti-trades-template.html @photolib/library.json @AGENTS.md

(Run this in PLAN MODE first — show me the full plan + diffs before writing anything, then execute on approval. Use high effort.)

Build Phase 1 of "Monti" in this repo (veteran-ai-websites, Next.js 15). Monti is a hidden,
test-first concierge that chats with a visitor and assembles a real website live as they answer,
then drops a hot lead into our Supabase. Phase 1 is the TYPED MVP — no voice yet (that's Phase 2).

READ THESE FIRST (they're in the repo):
- monti/monti-build-packet.md  ← the full spec. Follow it. §2 (turn contract), §3 (data contract),
  §4 (conversation), §5 (front end), §6 (lead), §7 (phases), §8 (guardrails), §9 (done).
- monti/monti-experience.html  ← the WORKING prototype. Port its UX/layout/timing/section-fills.
- monti/monti-trades-template.html + photolib/library.json  ← the locked Trades template + photo IDs.

BUILD (Phase 1 only, Trades template only):
1. Hidden route `app/monti/page.tsx` (+ components). Port monti-experience.html:
   - the warm glow canvas, the client text-input box, the chip row (for choice steps),
   - the layout transition (glow full-screen → slides to left ~37% companion, website builds in the
     right ~63% browser frame; stacks on mobile),
   - the live preview = a real Trades template React component fed the growing §3 record, rendering
     only the sections the server says are ready (skeleton → atomic fill).
   - Route MUST be hidden: `noindex` (robots meta + robots.ts), excluded from sitemap.ts, zero
     public links/nav. Reachable only by typing /monti.
2. `components/monti/TradesTemplate.tsx` — port monti-trades-template.html's fill + fallback logic
   to props of the §3 record. Reuse its IMG photo map + per-slot crop presets. Every field keeps its
   max-length + designed fallback (empty state must look intentional).
3. `app/api/monti/turn/route.ts` (server): input = conversation history + latest visitor message.
   Call Claude (Anthropic) with the system prompt in **`monti/monti-brain-prompt.md` — use it
   verbatim** (persona + the turn-contract JSON shape + §3 schema + trade keys + copy/honesty rules;
   already written, don't invent your own). VALIDATE the returned JSON against §3 (coerce/truncate to
   max lengths, drop malformed fields, fall back on missing) before returning. Add xAI/Grok as a
   failover call. Keys server-side only.
4. `app/api/monti/lead/route.ts` (server): on finish, insert ONE row into public.businesses in
   Supabase project sqgnyrlegbjhpebtbybd using the SERVICE_ROLE/secret key (RLS is on — the anon key
   can't insert). Use the EXACT insert in packet §6: columns place_id ('monti-'||uuid, since it's NOT
   NULL), name, category=trade, phone, email, formatted_address=service_area, has_website=false,
   status='new', lead_score=100, contact_bucket='monti_inbound', source='monti',
   monti_draft=<full §3 record JSON>. The `source` + `monti_draft` columns already exist (migration
   applied). Honest handoff copy only — live preview, Rich reaches out.
   Env: SUPABASE_URL (base URL, NO /rest/v1/), SUPABASE_SERVICE_ROLE_KEY.

DO NOT in Phase 1: no xAI TTS/voice (glow uses the prototype's envelope for now), no speech-to-text,
no Food/Tourism templates, no multi-page. Those are Phase 2/3.

GUARDRAILS:
- Structured JSON only from the model — never raw HTML. The validation gate + templates are the
  "good every time" guarantee. Don't bypass it.
- Keys stay server-side (ANTHROPIC_API_KEY, XAI_API_KEY). Supabase writes use a server route.
- Commit ONLY the new Monti files + minimal wiring. Typecheck. Push to main (Vercel auto-deploys).
- Keep it hidden/noindex until told otherwise.

ENV VARS I'll add to this project's Vercel (tell me if you need others): ANTHROPIC_API_KEY,
XAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

DONE = /monti loads hidden; the glow greets; a typed conversation on the real Claude brain assembles
a real Trades site live (name in the url bar, skeleton→atomic fills, no broken frames ever, all from
validated structured JSON); and on finish a source=monti hot_inbound lead with the drafted record
lands in Supabase. Nothing public points to it.
