<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Veteran AI Websites — public marketing site

Owner: Rich, a U.S. Army veteran running a solo web-design shop in West Virginia. This repo
(`veteran-ai-websites`) is the **public marketing site** (veteranaiwebsites.com). The cold-outreach
app + Supabase live in the separate `veteran-ai-outreach` repo.

## Standing rules (Rich's non-negotiables — follow these every session)
- **No bullshit, no fabrication.** Everything honest. If something can't be done well, say so — don't
  fake it or ship something that lets a real small-business owner down.
- **Professional, never corny.** The brand is Appalachia-meets-AI, premium-quiet. AI is the quiet
  enabler, not the headline. No cheese, no gimmicks, restrained by default.
- **Commit ONLY the files for the task at hand.** The working tree often has unrelated uncommitted
  files — never sweep them into a commit. Small, scoped commits with clear messages.
- **Typecheck before committing.** Then push to `main` — Vercel auto-deploys. After pushing, confirm
  the deploy went **READY** on Vercel (not just that local passed).
- **Never commit secrets.** Keys (`ANTHROPIC_API_KEY`, `XAI_API_KEY`, Supabase keys) live in Vercel
  env + local shell only. Server-side only; never shipped to the browser.

## Stack
Next.js 15 · React 19 · Tailwind · deployed on Vercel (auto-deploy on push to `main`). Monti's leads
write to the shared Supabase project `veteran-ai-outreach` (id `sqgnyrlegbjhpebtbybd`), tagged
`source="monti"` into the `hot_inbound` lane.

## Release checklist (treat as the /ship loop)
Before calling any change done: (1) typecheck, (2) lint, (3) build locally if the change is
non-trivial, (4) commit only the relevant files with a clear message, (5) push to main, (6) verify
the Vercel deploy reaches READY. If any step fails, stop and report — don't push broken.

## Monti (being built here — see `monti/` folder)
Monti is a hidden voice concierge that chats with a visitor and assembles a real website live, then
drops a hot lead into Supabase. Read `monti/monti-build-packet.md` (the full spec) before touching it.
Hard rules:
- **The model outputs STRUCTURED JSON ONLY** (the §3 contract) — never raw HTML/CSS/layout. A
  validation gate coerces it to the contract; the locked templates render it. This is the whole
  "good every time" guarantee — do not bypass it.
- **`/monti` stays hidden:** `noindex`, excluded from `sitemap.ts`, zero public links, not in nav.
  Reachable only by typing the URL. Keep it that way until Rich says otherwise.
- **Reuse, don't redesign:** the `monti/` folder has the working prototype (`monti-experience.html`),
  the 3 locked templates, and the curated photo library (`photolib/library.json`). Port these; the
  design decisions are locked.
- Brain = Claude primary / Grok failover (via the outreach tool's provider-agnostic pattern).
  Voice = xAI TTS (Phase 2). Keys server-side, through Next API routes only.
