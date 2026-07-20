# Monti agent (LiveKit + xAI Grok realtime)

Voice worker for **`/monti/live`**. Speaks via xAI Grok realtime, publishes `fill_site` / `send_to_rich` as LiveKit data messages so the browser builds the Trades site and lands leads.

**Production:** runs on **LiveKit Cloud** (always-on).  
**Local `dev`:** only for testing agent changes — do **not** run local + cloud at the same time (jobs go to whichever worker grabs them).

## What it does

- Connects to LiveKit Cloud project `monti-xbmzg07e`
- Grok realtime (`grok-voice-latest`, voice **castor**) + Krisp BVC noise cancellation
- Tools: `fill_site` → topic `monti_fill`; `send_to_rich` → topic `monti_lead`
- Instructions: `instructions.md` (must ship in the Docker image)

## Requirements

- Python **3.12** (local) · LiveKit CLI (`lk`) for cloud deploy
- Secrets: `XAI_API_KEY` (cloud + local). LiveKit Cloud injects `LIVEKIT_*` for deployed agents.

---

## Local run (testing only)

```powershell
cd monti-agent
# use the real venv python — not Store stub
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
# .env: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, XAI_API_KEY
.\.venv\Scripts\python.exe main.py dev
```

Stop local before relying on cloud traffic.

---

## LiveKit Cloud (production)

### One-time create (already done for this project)

```powershell
cd monti-agent
# Link project (interactive auth or):
#   lk project add monti --url wss://monti-xbmzg07e.livekit.cloud --api-key ... --api-secret ... --default
# Secrets file: XAI_API_KEY only, UTF-8 no BOM (never commit it)
lk agent create --secrets-file .secrets.cloud.env --region us-east --yes
```

This builds the Dockerfile, deploys, writes `livekit.toml` with agent id.

### Ship agent code updates

```powershell
cd monti-agent
lk agent deploy
```

### Rotate / update secrets

```powershell
# .secrets.cloud.env or .env with XAI_API_KEY=... (no BOM)
lk agent update-secrets --secrets-file .secrets.cloud.env
```

### Status and logs

```powershell
lk agent status
lk agent logs
lk agent logs --log-type=build
```

### Test without local agent

1. No `main.py dev` running on any machine  
2. Open https://veteranaiwebsites.com/monti/live → Start talking  
3. Monti should join from the cloud worker  

---

## Env

| Variable | Local | LiveKit Cloud |
|----------|-------|----------------|
| `LIVEKIT_URL` | required | **injected** |
| `LIVEKIT_API_KEY` | required | **injected** |
| `LIVEKIT_API_SECRET` | required | **injected** |
| `XAI_API_KEY` | required | **secret** you set |

Never commit `.env` or `.secrets.cloud.env`.

## Dispatch

Automatic dispatch (no `agent_name` on the worker). The Next token route mints rooms without named agent dispatch; the cloud worker joins new rooms in the project.

## Docs

- [Deploy agents](https://docs.livekit.io/deploy/agents/quickstart/)
- [Secrets](https://docs.livekit.io/deploy/agents/secrets/)
- [Builds / Dockerfile](https://docs.livekit.io/deploy/agents/builds/)
