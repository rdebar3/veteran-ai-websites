# Grok Build CLI — reference (Claude's notes)

xAI's official coding-agent CLI. This is the "Grok Build" Rich runs on his Windows PC
(themoneymachine) to ship code to his repos. Launched early beta ~May 25, 2026.
*Sources contradict on a few specifics — defer to `docs.x.ai/build` and Rich's actual setup.*

## Install (Windows — Rich)
- PowerShell: `irm https://x.ai/cli/install.ps1 | iex`
- (mac/linux/WSL: `curl -fsSL https://x.ai/cli/install.sh | bash`)
- Verify: `grok --version` · `which grok` (⚠ name clash with open-source `superagent-ai/grok-cli` —
  make sure `which grok` points to the xAI binary).
- Windows stdio-hang bug in VS Code/grok-desktop was fixed in v0.2.70/0.2.71 (Jun 2026).

## Auth
- First launch opens browser sign-in (needs **SuperGrok / X Premium Plus**; some sources say
  SuperGrok Heavy ~$300/mo, $99 intro).
- Headless: env var `XAI_API_KEY="xai-..."` (one source says `GROK_CODE_XAI_API_KEY` — verify).
  Get key at console.x.ai → API Keys.

## Run
- `cd project && grok` → fullscreen interactive TUI (agent loop in the shell).
- `grok -p "prompt"` → headless one-shot (CI/scripts). `--output-format streaming-json`,
  `--json-schema <schema>` for machine output.
- `grok --always-approve` → skip approvals (headless; use with care).
- `grok inspect` → audit what it loaded: AGENTS.md, instructions, skills, plugins, hooks, MCP servers.
- `@path/to/file` in a prompt → pin/attach that file so it reads it (great for pointing at specs).

## Models
- Default `grok-4.5`. Coding model `grok-build-0.1` (256K context; ~$1/$2 per 1M in/out, $0.20 cached;
  replaced retired grok-code-fast-1). Select via `-m <name>` or `/model` in TUI.
- Custom models in `~/.grok/config.toml` (`%USERPROFILE%\.grok\config.toml`).

## Plan mode (safety gate)
- Proposes a structured multi-step plan and **blocks all write tools except the session plan file**
  until you approve. Review/edit/reject; changes come back as **diffs**. `Shift+Tab` cycles session
  modes. Best for big/multi-file jobs so it doesn't charge off on a misread.

## Permissions
- `~/.grok/config.toml` (global) or project `.grok/config.toml`:
  ```toml
  [ui]
  permission_mode = "ask"            # default: prompt per tool call (safe)
  # permission_mode = "always-approve"  # Rich's setting: skip confirmations
  ```

## Conventions it reads (Claude Code / Codex-compatible)
- **AGENTS.md** (repo instructions — veteran-ai-websites has one), plugins, hooks, skills, MCP servers.
- MCP examples: Linear, Sentry, Grafana. List with `/mcps`.

## Useful TUI slash commands
`/plan` show plan · `/context` window usage · `/compact` shrink history · `/rewind` roll back ·
`/fork` `/sessions` branch/resume · `/usage` tokens+credits · `/feedback` report beta bugs ·
`/btw` side question without derailing · `/memory` `/dream` persistent memory/consolidation ·
`/hooks` `/plugins` `/skills` `/mcps` manage extensions · `/skillify` save session as a reusable skill ·
`/model` switch model · `/goal` autonomous mode (v0.2.73+).

## Subagents
- Delegates to parallel subagents (up to ~8) for research/implementation/review, each in an
  **isolated git worktree** to avoid clobbering main. Plan mode is the gate if they misfire.

## PRO LAYER (from Rich's Grok/X mastery guide — 2026-07-19)
Treat Grok Build as an extensible platform, not just a CLI. Key pro moves:
- **Global rules** in `~/.grok/rules` (auto-discovered, apply across ALL sessions) + project rules in
  workspace. This is the #1 pro tip: encode coding standards / architecture / security once, globally.
  Maps to AGENTS.md too (Grok reads both).
- **Shell env inheritance:** Grok Build pulls the full login-shell env (PATH, aliases, functions, API
  keys) — kills "command not found" / env drift. Use scoped/read-only keys only; never commit secrets
  (git filter-repo for history cleanup).
- **`/settings`** on first run: set privacy opt-outs, folder-trust, permission modes, sandbox profiles.
- **Custom slash commands** live in `.grok/commands/` (git-checkable, autocomplete w/ params). Build a
  `/ship` = full release checklist (status→lint→test→build→commit→push→verify deploy). Power-user set:
  `/debug-error /test-gen /refactor /sec-audit /feature-plan /docs-gen`. Stack them into inner loops.
- **Memory layers:** `/memory` (global/workspace/session — inspect & EDIT wrong memories),
  `/flush` (save session before compaction), `/dream` (background dedup/consolidation). Run /dream +
  /memory regularly to keep it sharp.
- **Effort modes:** Grok 4.5 default — set **high/medium/low** effort explicitly (high for big
  refactors/architecture, low for mechanical edits).
- **Sessions/scale:** `--minimal --resume`, fleet dashboard, background tasks, `grok wrap ssh <host>`
  (clipboard/terminal restore). "Lanes"/snapshots/branching for parallel feature work w/o polluting
  main (prompt Grok to build a lane system).
- **Plugins:** `grok plugin install` + marketplace. **Official Claude Code plugin** for delegation:
  `/grok-build:review :critique :delegate :import` — i.e. Claude ↔ Grok can hand work to each other
  (directly relevant to Rich's "command center": Claude plans, Grok builds).
- **Multimedia:** Grok Imagine for images/video inline in build flows.
- Note: parts of the guide are aspirational ("prompt Grok to build lanes", exact `.grok/commands/`
  format "or similar") — verify exact paths/formats via `grok inspect` + `docs.x.ai/build` before relying.
- **Pro-tip startup ritual:** new project → `/settings` review + custom global rules + a stack-tailored
  `/ship`. Then `/dream` + `/memory` regularly.

## HYBRID Claude + Grok (VERIFIED 2026-07-19 — this is our command-center model, made official)
The "Claude orchestrates + Grok executes" meta-workflow is real and has official plumbing.
- **Official plugin: `xai-org/grok-build-plugin-cc`** — a **Claude Code (CLI) plugin** that delegates
  to Grok Build. Install (needs the Claude Code CLI + Grok CLI on PATH, Node ≥18.18, `grok models`
  authed): `claude plugin marketplace add "$(pwd)"` (from the plugin repo) then
  `claude plugin install grok-build@xai-grok-build` (or `/plugin` in Claude Code).
  Commands: `/grok-build:check` (verify setup) · `:review` (read-only git review, plan mode) ·
  `:critique` (design/risk, JSON) · `:delegate` (investigate/implement; `--write` to edit,
  `--resume`, `--model`, `--effort low|med|high`; default read-only) · `:import` (push current Claude
  transcript into Grok) · `:runs` `:show` `:stop` (manage runs).
  ⚠ NUANCE: this plugin lives inside the **Claude Code CLI**, not the Cowork app. So it connects
  *Claude Code ↔ Grok*. If Rich runs Claude Code locally he gets the seamless delegate/review loop;
  if his "Claude" is just the Cowork app (me), the handoff stays manual (I write specs → he runs Grok)
  — but the rules-compatibility win below still applies.
- **Zero-config compatibility (official docs):** Grok Build automatically reads Claude Code
  marketplaces, plugins, skills, MCPs, agents, hooks, and instruction files — `CLAUDE.md`, `Claude.md`,
  `CLAUDE.local.md`, `.claude/rules/` — alongside `.grok/`. So the `AGENTS.md`/`CLAUDE.md` rules we
  write are honored by Grok with no setup.
- **Resume across tools:** Grok added `/resume-claude` `/resume-codex` `/resume-cursor` (per xAI's X
  announcement) to pick up a recent Claude Code/Codex/Cursor session inside Grok 4.5.
- **Grok Imagine** can generate images/video inline in build flows (relevant to the marketing-site
  cinematic; NOT for Monti — Monti uses curated real photos by decision).
- **Why it wins (matches how we already work):** Claude for planning/critique/refusing low-quality
  output; Grok for raw speed + execution + frontier access. We've been running this all session —
  Claude writes packets/prompts/rules, Grok Build executes.

## How this applies to our Monti build
- Run the Phase-1 prompt in `veteran-ai-websites` with the CLI. **Pin the spec files** so it reads
  them: start the prompt with `@monti/monti-build-packet.md @monti/monti-experience.html
  @monti/monti-trades-template.html`.
- For a big multi-file build like Monti, consider **plan mode first** (review the plan/diffs) even if
  Rich normally runs always-approve — safer for the first pass, then let it execute.
- `grok inspect` first to confirm it sees the repo's AGENTS.md + any conventions.
- Its worktree subagents suit the multi-file scaffold (route + template component + 2 API routes).
