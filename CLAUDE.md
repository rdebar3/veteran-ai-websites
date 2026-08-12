# Rules for all agents in this repo

The standing rules, project conventions, stack facts, release checklist, and Monti guardrails for
**every agent** working in this repo — Claude Code, Grok Build, Cursor, or otherwise — live in
**`AGENTS.md`**. Read it first.

Grok Build reads `CLAUDE.md` and `AGENTS.md` automatically (zero config), so both toolchains land on
the same rules. `AGENTS.md` is the single source of truth — keep the rules there, not duplicated here.

Quick reminders (full detail in `AGENTS.md`):
- No bullshit / no fabrication. Professional, never corny.
- Commit ONLY the files for the task. Typecheck, push to `main`, verify the Vercel deploy hits READY.
- Keys server-side only; never commit secrets.
- Monti (`monti/` folder): model outputs **structured JSON only**, never HTML; `/monti` stays hidden
  (noindex, out of sitemap) until Rich approves; reuse the locked prototype + templates, don't redesign.
