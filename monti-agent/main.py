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
TOPIC_TYPING = "monti_typing"  # client: visitor is composing a typed reply

# --- Session cost / quality guards (tune these) ---
SESSION_MAX_SECONDS = 600  # ~10 min wall-clock hard stop
SESSION_NUDGE_SECONDS = 22  # user_away_timeout → first soft re-engage (voice)
SESSION_NUDGE_GAP_SECONDS = 25  # wait after a nudge before the next
SESSION_IDLE_SECONDS = 120  # total quiet after first "away" → polite wrap
SESSION_MAX_NUDGES = 2  # max re-engages per quiet spell
# Typing is silent by definition — extend patience once the session is typed-dominant
SESSION_NUDGE_TYPED_MULT = 2.5
# Hold all nudges while a typing signal is this fresh
TYPING_FRESH_SECONDS = 8.0

# xAI RealtimeModel server VAD (0.6–0.75 threshold; modest silence for snappier turns)
VAD_THRESHOLD = 0.65
VAD_SILENCE_MS = 450
VAD_PREFIX_PADDING_MS = 300

WRAP_UP_LINE = (
    "I'll let you go for now — start again anytime if you want to keep building. Take care."
)
NUDGE_INSTRUCTIONS = (
    "Visitor went quiet while you're waiting on something. "
    "Speak ONE short warm line only — re-ask what you still need in fewer words, "
    "or a light check-in like 'Still with me? No rush.' "
    "Never pressure, never stack questions, never mention tools or AI."
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
        # First quiet signal after SESSION_NUDGE_SECONDS → soft re-engage pipeline
        user_away_timeout=float(SESSION_NUDGE_SECONDS),
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
    silence_task: asyncio.Task[None] | None = None
    typing_recheck_task: asyncio.Task[None] | None = None
    user_is_away = False
    last_typing_at = 0.0
    typed_dominant = False

    def _now() -> float:
        return asyncio.get_event_loop().time()

    def is_typing_fresh() -> bool:
        return last_typing_at > 0 and (_now() - last_typing_at) < TYPING_FRESH_SECONDS

    async def polite_end(reason: str) -> None:
        nonlocal closing, silence_task, typing_recheck_task
        if closing:
            return
        closing = True
        if silence_task and not silence_task.done():
            silence_task.cancel()
        if typing_recheck_task and not typing_recheck_task.done():
            typing_recheck_task.cancel()
        logger.info("session ending reason=%s room=%s", reason, ctx.room.name)
        try:
            await session.say(WRAP_UP_LINE, allow_interruptions=False)
        except Exception:
            logger.exception("wrap-up say failed")
        try:
            await session.aclose()
        except Exception:
            logger.exception("session aclose failed")

    def _cancel_silence(*, keep_recheck: bool = False) -> None:
        """Stop silence pipeline. keep_recheck=True when typing is still active
        so we resume patience once typing goes stale (away may not re-fire)."""
        nonlocal silence_task, user_is_away, typing_recheck_task
        user_is_away = False
        if silence_task and not silence_task.done():
            silence_task.cancel()
        silence_task = None
        if not keep_recheck:
            if typing_recheck_task and not typing_recheck_task.done():
                typing_recheck_task.cancel()
            typing_recheck_task = None

    async def _sleep_interruptible(seconds: float) -> bool:
        """Sleep in chunks; return False if we should abort silence pipeline."""
        end = _now() + seconds
        while _now() < end:
            if closing or not user_is_away:
                return False
            if is_typing_fresh():
                return False
            await asyncio.sleep(min(1.0, end - _now()))
        return not closing and user_is_away and not is_typing_fresh()

    async def silence_pipeline() -> None:
        """Re-engage up to SESSION_MAX_NUDGES times, then wrap at SESSION_IDLE_SECONDS."""
        nonlocal user_is_away
        started = _now()
        nudges = 0
        try:
            # Typed sessions need more patience (keyboard is slow / silent)
            if typed_dominant:
                extra = float(SESSION_NUDGE_SECONDS) * (SESSION_NUDGE_TYPED_MULT - 1.0)
                logger.info(
                    "typed-dominant extra wait %.1fs room=%s",
                    extra,
                    ctx.room.name,
                )
                if not await _sleep_interruptible(extra):
                    logger.info(
                        "silence pipeline aborted during typed wait room=%s",
                        ctx.room.name,
                    )
                    return

            while not closing and user_is_away and nudges < SESSION_MAX_NUDGES:
                if is_typing_fresh():
                    logger.info(
                        "silence nudge skipped-due-to-typing room=%s",
                        ctx.room.name,
                    )
                    # Wait until typing goes stale (or user returns)
                    while is_typing_fresh() and user_is_away and not closing:
                        await asyncio.sleep(1.0)
                    if closing or not user_is_away:
                        return
                    continue

                if nudges > 0:
                    if not await _sleep_interruptible(float(SESSION_NUDGE_GAP_SECONDS)):
                        return
                logger.info(
                    "silence nudge %s room=%s typed_dominant=%s",
                    nudges + 1,
                    ctx.room.name,
                    typed_dominant,
                )
                try:
                    await session.generate_reply(instructions=NUDGE_INSTRUCTIONS)
                except Exception:
                    logger.exception("silence nudge failed")
                nudges += 1

            # Wait out remaining idle budget from first away signal
            elapsed = _now() - started
            remaining = max(0.0, float(SESSION_IDLE_SECONDS) - elapsed)
            if remaining > 0:
                if not await _sleep_interruptible(remaining):
                    return
            if not closing and user_is_away and not is_typing_fresh():
                await polite_end("idle")
        except asyncio.CancelledError:
            return

    def _start_silence_pipeline() -> None:
        nonlocal silence_task, user_is_away
        user_is_away = True
        if silence_task and not silence_task.done():
            silence_task.cancel()
        silence_task = asyncio.create_task(silence_pipeline())

    async def typing_recheck_after_away() -> None:
        """Resume silence path once typing goes stale (away may not re-fire)."""
        try:
            while not closing and is_typing_fresh():
                await asyncio.sleep(0.5)
            if closing:
                return
            # User returned to speaking/listening would have cancelled this task
            logger.info(
                "typing stale — starting silence pipeline room=%s typed_dominant=%s",
                ctx.room.name,
                typed_dominant,
            )
            _start_silence_pipeline()
        except asyncio.CancelledError:
            return

    def mark_typing(*, active: bool, text_sent: bool = False) -> None:
        nonlocal last_typing_at, typed_dominant
        last_typing_at = _now()
        if active or text_sent:
            typed_dominant = True
        if active:
            # Cancel in-flight nudges; keep a deferred-away recheck if any so
            # we resume after typing ends without needing a second "away".
            _cancel_silence(keep_recheck=True)
            logger.info(
                "typing active — silence cancelled typed_dominant=%s room=%s",
                typed_dominant,
                ctx.room.name,
            )
        elif text_sent:
            _cancel_silence(keep_recheck=False)
            logger.info(
                "text_sent — silence cancelled typed_dominant=%s room=%s",
                typed_dominant,
                ctx.room.name,
            )
        else:
            # Cleared: still "fresh" for TYPING_FRESH_SECONDS so mid-sentence
            # pause before send doesn't get a nudge.
            logger.info(
                "typing cleared (fresh for %.0fs) room=%s",
                TYPING_FRESH_SECONDS,
                ctx.room.name,
            )

    @session.on("user_state_changed")
    def _on_user_state(ev: UserStateChangedEvent) -> None:
        nonlocal silence_task, user_is_away, typing_recheck_task
        if closing:
            return
        if ev.new_state == "away":
            if is_typing_fresh():
                logger.info(
                    "silence skip away-start due-to-typing room=%s",
                    ctx.room.name,
                )
                # Defer pipeline until typing goes stale
                if typing_recheck_task and not typing_recheck_task.done():
                    typing_recheck_task.cancel()
                typing_recheck_task = asyncio.create_task(typing_recheck_after_away())
                return
            if user_is_away:
                return
            _start_silence_pipeline()
        elif ev.new_state in ("speaking", "listening"):
            _cancel_silence()

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

    @ctx.room.on("data_received")
    def _on_data(packet: rtc.DataPacket) -> None:
        if packet.topic != TOPIC_TYPING:
            return
        try:
            raw = packet.data
            if isinstance(raw, memoryview):
                raw = raw.tobytes()
            msg = json.loads(raw.decode("utf-8"))
        except Exception:
            logger.warning("monti_typing decode failed room=%s", ctx.room.name)
            return
        if not isinstance(msg, dict):
            return
        if msg.get("text_sent"):
            mark_typing(active=False, text_sent=True)
        elif msg.get("typing") is True:
            mark_typing(active=True)
        elif msg.get("typing") is False:
            mark_typing(active=False)

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
