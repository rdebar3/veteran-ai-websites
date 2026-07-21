"""
Monti LiveKit voice agent — Phase B (voice + live site fills).

Connects to LiveKit Cloud, uses xAI Grok realtime (grok-voice-latest, voice castor).
Tools publish fill/lead events as room data messages for the browser.
Run locally: .venv\\Scripts\\python.exe main.py dev
"""

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    RunContext,
    UserStateChangedEvent,
    WorkerOptions,
    cli,
    function_tool,
    room_io,
)
from livekit.plugins import noise_cancellation, xai

load_dotenv(dotenv_path=Path(__file__).with_name(".env"))
load_dotenv()

logger = logging.getLogger("monti-agent")
logger.setLevel(logging.INFO)

INSTRUCTIONS_PATH = Path(__file__).with_name("instructions.md")
INSTRUCTIONS = INSTRUCTIONS_PATH.read_text(encoding="utf-8")

VOICE = "castor"
MODEL = "grok-voice-latest"

TOPIC_FILL = "monti_fill"
TOPIC_LEAD = "monti_lead"

# --- Session cost / quality guards (tune these) ---
SESSION_MAX_SECONDS = 600  # ~10 min wall-clock hard stop
SESSION_IDLE_SECONDS = 120  # ~2 min user-away → polite wrap + close

# xAI RealtimeModel server VAD (0.6–0.75 threshold; modest silence for snappier turns)
VAD_THRESHOLD = 0.65
VAD_SILENCE_MS = 450
VAD_PREFIX_PADDING_MS = 300

WRAP_UP_LINE = (
    "I'll let you go for now — start again anytime if you want to keep building. Take care."
)

FILL_SITE_SCHEMA: dict[str, Any] = {
    "type": "function",
    "name": "fill_site",
    "description": (
        "Push homepage section fields so the live site fills in. "
        "Call once per step when content is ready. Structured fields only — never HTML."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "template_id": {"type": "string", "enum": ["trades"]},
            "hero_image_id": {
                "type": "string",
                "description": "Trade key for hero photo",
            },
            "layout": {
                "type": "string",
                "enum": ["classic", "bold", "split"],
                "description": "Structural homepage layout (safe set only)",
            },
            "theme": {
                "type": "object",
                "description": "Named color + mood presets only — never hex or CSS",
                "properties": {
                    "palette": {
                        "type": "string",
                        "enum": ["ember", "slate", "pine", "river", "sand"],
                    },
                    "mood": {
                        "type": "string",
                        "enum": ["clean", "rugged"],
                    },
                },
            },
            "palette": {
                "type": "string",
                "enum": ["ember", "slate", "pine", "river", "sand", "timber"],
                "description": "Legacy top-level palette; timber aliases to pine",
            },
            "business": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "phone": {"type": "string"},
                    "service_area": {"type": "string"},
                    "established": {"type": ["number", "null"]},
                },
            },
            "hero": {
                "type": "object",
                "properties": {
                    "headline": {"type": "string"},
                    "subhead": {"type": "string"},
                    "cta_text": {"type": "string"},
                    "image_id": {"type": "string"},
                },
            },
            "about": {
                "type": "object",
                "properties": {"body": {"type": "string"}},
            },
            "services": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                    },
                },
            },
            "trust": {
                "type": "object",
                "properties": {
                    "badges": {"type": "array", "items": {"type": "string"}},
                    "reviews": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "quote": {"type": "string"},
                                "name": {"type": "string"},
                                "detail": {"type": "string"},
                            },
                        },
                    },
                },
            },
            "contact": {
                "type": "object",
                "properties": {
                    "cta_text": {"type": "string"},
                    "phone_prompt": {"type": "string"},
                    "emergency": {"type": "boolean"},
                },
            },
            "sections": {
                "type": "array",
                "items": {
                    "type": "string",
                    "enum": ["hero", "trust", "services", "about", "contact"],
                },
                "description": "Sections now ready to show",
            },
        },
    },
}

SEND_TO_RICH_SCHEMA: dict[str, Any] = {
    "type": "function",
    "name": "send_to_rich",
    "description": (
        "Visitor agreed to hand off to Rich. Call ONLY when they clearly say yes "
        "AND business.phone was already filled via fill_site. Never call without a phone."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "confirm": {"type": "boolean"},
        },
    },
}


async def _publish_json(room: rtc.Room, topic: str, payload: dict[str, Any]) -> None:
    data = json.dumps(payload, default=str)
    await room.local_participant.publish_data(
        data,
        reliable=True,
        topic=topic,
    )


class Monti(Agent):
    def __init__(self, room: rtc.Room) -> None:
        super().__init__(
            instructions=INSTRUCTIONS,
            tools=[
                self._make_fill_site_tool(),
                self._make_send_to_rich_tool(),
            ],
        )
        self._room = room

    def _make_fill_site_tool(self):
        agent = self

        @function_tool(raw_schema=FILL_SITE_SCHEMA)
        async def fill_site(
            raw_arguments: dict[str, Any],
            context: RunContext,
        ) -> dict[str, Any]:
            """Publish site fill args to the browser (no server-side validation)."""
            try:
                args = raw_arguments if isinstance(raw_arguments, dict) else {}
                await _publish_json(agent._room, TOPIC_FILL, args)
                logger.info(
                    "fill_site published sections=%s keys=%s",
                    args.get("sections"),
                    list(args.keys()),
                )
                return {"ok": True}
            except Exception as e:
                logger.exception("fill_site publish failed")
                return {"ok": False, "error": str(e)}

        return fill_site

    def _make_send_to_rich_tool(self):
        agent = self

        @function_tool(raw_schema=SEND_TO_RICH_SCHEMA)
        async def send_to_rich(
            raw_arguments: dict[str, Any],
            context: RunContext,
        ) -> dict[str, Any]:
            """Signal the browser to POST the lead to Rich."""
            try:
                await _publish_json(
                    agent._room,
                    TOPIC_LEAD,
                    {"type": "send_to_rich"},
                )
                logger.info("send_to_rich published")
                return {"ok": True}
            except Exception as e:
                logger.exception("send_to_rich publish failed")
                return {"ok": False, "error": str(e)}

        return send_to_rich


async def entrypoint(ctx: JobContext) -> None:
    logger.info("connecting to room %s", ctx.room.name)
    await ctx.connect()

    agent = Monti(room=ctx.room)

    # Prefer realtime model server VAD; threshold/silence tuned for snappier turns.
    session = AgentSession(
        llm=xai.realtime.RealtimeModel(
            model=MODEL,
            voice=VOICE,
            turn_detection={
                "type": "server_vad",
                "threshold": VAD_THRESHOLD,
                "silence_duration_ms": VAD_SILENCE_MS,
                "prefix_padding_ms": VAD_PREFIX_PADDING_MS,
            },
        ),
        turn_handling={
            "turn_detection": "realtime_llm",
            "interruption": {
                "enabled": True,
                # With realtime server TD, many interruption knobs are ignored by the
                # framework; resume_false still set for best-effort false-positive recovery.
                "mode": "adaptive",
                "resume_false_interruption": True,
                "false_interruption_timeout": 1.5,
                "min_duration": 0.35,
            },
            "endpointing": {
                "min_delay": 0.35,
                "max_delay": 2.5,
            },
        },
        user_away_timeout=float(SESSION_IDLE_SECONDS),
    )

    # Krisp BVC: isolate primary speaker, strip background noise + echoed/secondary voices.
    # Falls back to NC (noise only) if BVC is unavailable in this plugin build.
    try:
        nc_filter = noise_cancellation.BVC()
        logger.info("noise cancellation: Krisp BVC")
    except AttributeError:
        nc_filter = noise_cancellation.NC()
        logger.info("noise cancellation: Krisp NC (BVC not available)")

    closing = False

    async def polite_end(reason: str) -> None:
        nonlocal closing
        if closing:
            return
        closing = True
        logger.info("session ending reason=%s room=%s", reason, ctx.room.name)
        try:
            await session.say(WRAP_UP_LINE, allow_interruptions=False)
        except Exception:
            logger.exception("wrap-up say failed")
        try:
            await session.aclose()
        except Exception:
            logger.exception("session aclose failed")

    @session.on("user_state_changed")
    def _on_user_state(ev: UserStateChangedEvent) -> None:
        if ev.new_state == "away":
            asyncio.create_task(polite_end("idle"))

    # text_input defaults on; set explicitly so typed lk.chat turns join the
    # same conversation as speech (https://docs.livekit.io/agents/build/text/).
    await session.start(
        room=ctx.room,
        agent=agent,
        room_options=room_io.RoomOptions(
            text_input=True,
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=nc_filter,
            ),
        ),
    )

    async def _max_timer() -> None:
        try:
            await asyncio.sleep(SESSION_MAX_SECONDS)
            await polite_end("max_duration")
        except asyncio.CancelledError:
            return

    # Keep task referenced so GC doesn't drop the max-duration guard.
    session._monti_max_task = asyncio.create_task(_max_timer())  # type: ignore[attr-defined]

    await session.generate_reply(
        instructions=(
            "Greet the visitor warmly as Monti — short, natural, Appalachian-plain. "
            "Ask for their name first (who you're talking to). One short question only. "
            "Do not mention tools or AI. Do not ask for the business name yet."
        ),
    )
    logger.info("Monti session started in room %s", ctx.room.name)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        ),
    )
