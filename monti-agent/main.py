"""
Monti LiveKit voice agent — Phase B (voice + live site fills).

Connects to LiveKit Cloud, uses xAI Grok realtime (grok-voice-latest, voice castor).
Tools publish fill/lead events as room data messages for the browser.
Run locally: .venv\\Scripts\\python.exe main.py dev
"""

from __future__ import annotations

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
    WorkerOptions,
    cli,
    function_tool,
)
from livekit.plugins import xai

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
        "Visitor agreed to hand off to Rich. Call only when they clearly say yes."
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

    session = AgentSession(
        llm=xai.realtime.RealtimeModel(
            model=MODEL,
            voice=VOICE,
        ),
    )

    await session.start(
        room=ctx.room,
        agent=agent,
    )

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
