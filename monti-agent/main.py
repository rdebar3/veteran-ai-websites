"""
Monti LiveKit voice agent — Phase A (conversation only).

Connects to LiveKit Cloud, uses xAI Grok realtime (grok-voice-latest, voice castor).
No fill_site / send_to_rich tools yet. Run locally: python main.py dev
"""

from __future__ import annotations

import logging
from pathlib import Path

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, cli
from livekit.plugins import xai

load_dotenv(dotenv_path=Path(__file__).with_name(".env"))
load_dotenv()  # also allow process env / parent .env

logger = logging.getLogger("monti-agent")
logger.setLevel(logging.INFO)

INSTRUCTIONS_PATH = Path(__file__).with_name("instructions.md")
INSTRUCTIONS = INSTRUCTIONS_PATH.read_text(encoding="utf-8")

# Dispatch name must match RoomAgentDispatch.agentName in the token route.
AGENT_NAME = "monti"
VOICE = "castor"
MODEL = "grok-voice-latest"


class Monti(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=INSTRUCTIONS)


async def entrypoint(ctx: JobContext) -> None:
    logger.info("connecting to room %s", ctx.room.name)
    await ctx.connect()

    session = AgentSession(
        llm=xai.realtime.RealtimeModel(
            model=MODEL,
            voice=VOICE,
        ),
    )

    await session.start(
        room=ctx.room,
        agent=Monti(),
    )

    await session.generate_reply(
        instructions=(
            "Greet the visitor warmly as Monti — short, natural, Appalachian-plain. "
            "Then ask for their business name. One question only. Do not mention tools or AI."
        ),
    )
    logger.info("Monti session started in room %s", ctx.room.name)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name=AGENT_NAME,
        ),
    )
