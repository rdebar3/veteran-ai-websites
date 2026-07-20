# Monti agent (LiveKit + xAI Grok realtime)

Phase A voice worker for the `/monti/live` test route. This process is **not** built or run by Vercel. It runs on your machine (or later on LiveKit Cloud) and joins rooms when the Next app mints a token that dispatches agent name `monti`.

## What it does

- Connects to your LiveKit Cloud project
- Speaks with **xAI Grok realtime** (`grok-voice-latest`, voice **`castor`**)
- Uses `instructions.md` (Monti voice arc + Phase A “no tools” note)
- Conversation only — no `fill_site` / `send_to_rich` yet

## Requirements

- Python **3.10+** (3.12 recommended)
- LiveKit Cloud project keys (same as Vercel: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`)
- `XAI_API_KEY`

## Setup and run

```bash
cd monti-agent

python -m venv .venv

# Windows (PowerShell / cmd):
.venv\Scripts\activate

# macOS / Linux:
# source .venv/bin/activate

pip install -r requirements.txt

# Windows:
copy .env.example .env

# macOS / Linux:
# cp .env.example .env

# Edit .env and fill LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, XAI_API_KEY

python main.py dev
```

Leave this terminal running. You should see the worker register with LiveKit (connected / registered).

## Test with the site

1. Agent running (`python main.py dev`)
2. Next app has the same `LIVEKIT_*` env (Vercel production or local `.env.local`)
3. Open **`/monti/live`**, click **Start talking**, allow the microphone
4. Monti should greet and you can talk back and forth over WebRTC

If the agent is **not** running, the browser still joins a room but Monti never appears.

## Deploy later (not Phase A)

When ready for always-on hosting:

```bash
# with LiveKit CLI linked to your project
lk agent create
```

See [LiveKit agent deployment](https://docs.livekit.io/agents/ops/deployment/).

## Env

| Variable | Where |
|----------|--------|
| `LIVEKIT_URL` | Agent + Vercel |
| `LIVEKIT_API_KEY` | Agent + Vercel |
| `LIVEKIT_API_SECRET` | Agent + Vercel |
| `XAI_API_KEY` | **Agent only** (never in the browser token) |

## Dispatch name

Worker `agent_name` is **`monti`**. The token route must dispatch the same name via `RoomAgentDispatch({ agentName: "monti" })`.
