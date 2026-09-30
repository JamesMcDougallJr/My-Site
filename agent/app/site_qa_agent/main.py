from datetime import date
from pathlib import Path
from typing import Any
from strands import Agent
from strands.agent.conversation_manager.null_conversation_manager import NullConversationManager
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from model.load import load_model

app = BedrockAgentCoreApp()
log = app.logger

SYSTEM_PROMPT_PATH = Path(__file__).parent / "system-prompt.md"
SITE_CONTEXT_PATH = Path(__file__).parent / "site-context.md"
CAREER_FACTS_PATH = Path(__file__).parent / "career-facts.md"


def _read_or_placeholder(path: Path, missing_note: str) -> str:
    return path.read_text() if path.exists() else missing_note


def _build_system_prompt() -> str:
    # Rebuilt fresh on every call (not cached at import time) so {{TODAY}}
    # stays accurate for a long-running dev server, and edits to
    # site-context.md / career-facts.md take effect without a restart.
    template = SYSTEM_PROMPT_PATH.read_text()
    site_context = _read_or_placeholder(
        SITE_CONTEXT_PATH,
        "(site-context.md has not been generated yet — run `npm run build:context` in the site repo)",
    )
    career_facts = _read_or_placeholder(
        CAREER_FACTS_PATH,
        "(career-facts.md has not been written yet)",
    )
    return (
        template.replace("{{TODAY}}", date.today().isoformat())
        .replace("{{SITE_CONTEXT}}", site_context)
        .replace("{{CAREER_FACTS}}", career_facts)
    )


# No tools: the agent answers only from the content baked into the system
# prompt (see scripts/build-site-context.mjs in the site repo, and
# career-facts.md for hand-maintained resume/LinkedIn facts).
tools = []

_INLINE_FUNCTION_NAMES = set()


def new_agent() -> Agent:
    # A fresh Agent per invocation, no cross-request state: memory is
    # disabled per the project's local-dev scope, and every visitor's
    # question is answered from the provided content alone, not prior turns
    # (which also rules out one visitor's conversation leaking into another's
    # via a shared session bucket).
    return Agent(
        model=load_model(),
        system_prompt=_build_system_prompt(),
        tools=tools,
        conversation_manager=NullConversationManager(),
    )


def strip_trailing_tool_use(messages: Any) -> list[dict]:
    """Strip toolUse blocks from the tail until the last message has none."""
    if not isinstance(messages, list):
        raise ValueError("messages must be a list")

    messages = list(messages)
    while messages:
        last = messages[-1]
        if not isinstance(last, dict):
            raise ValueError("each message must be an object")
        original_content = last.get("content", [])
        if not isinstance(original_content, list) or not all(isinstance(block, dict) for block in original_content):
            raise ValueError("each message content value must be a list of content blocks")

        content = [block for block in original_content if "toolUse" not in block]
        if len(content) == len(original_content):
            break
        if content:
            messages[-1] = {**last, "content": content}
            break
        messages.pop()

    return messages


def _extract_prompt(payload: dict):
    """Accept validated harness messages, tool results, or a plain prompt string."""
    if not isinstance(payload, dict):
        raise ValueError("payload must be a JSON object")
    if "messages" in payload:
        return strip_trailing_tool_use(payload["messages"])
    if "tool_results" in payload:
        tool_results = payload["tool_results"]
        if not isinstance(tool_results, list) or not all(
            isinstance(tool_result, dict) and isinstance(tool_result.get("toolUseId"), str)
            for tool_result in tool_results
        ):
            raise ValueError("tool_results must contain objects with a toolUseId string")
        return [{"role": "user", "content": [{"toolResult": {
            "toolUseId": tr["toolUseId"],
            "status": tr.get("status", "success"),
            "content": tr.get("content", []),
        }} for tr in tool_results]}]
    prompt = payload.get("prompt", "")
    if not isinstance(prompt, str):
        raise ValueError("prompt must be a string")
    return prompt


def _has_inline_function_call(messages) -> bool:
    """Return True if messages contains an assistant toolUse for an inline function tool."""
    if not _INLINE_FUNCTION_NAMES or not isinstance(messages, list):
        return False
    for msg in messages:
        if msg.get("role") == "assistant":
            for block in msg.get("content", []):
                if isinstance(block, dict) and block.get("toolUse", {}).get("name") in _INLINE_FUNCTION_NAMES:
                    return True
    return False


def _is_inline_function_call(event: dict) -> bool:
    """Check if a contentBlockStart event is for an inline function tool."""
    if not _INLINE_FUNCTION_NAMES:
        return False
    cbs = event.get("contentBlockStart", {})
    start = cbs.get("start", {})
    tool_use = start.get("toolUse") if isinstance(start, dict) else None
    return tool_use is not None and tool_use.get("name") in _INLINE_FUNCTION_NAMES



@app.entrypoint
async def invoke(payload, context):
    log.info("Invoking Agent.....")

    agent = new_agent()

    prompt = _extract_prompt(payload)


    async for event in agent.stream_async(
        prompt,
    ):
        if not isinstance(event, dict) or "event" not in event:
            continue
        cbs = event["event"].get("contentBlockStart")
        if cbs is not None and not cbs.get("start"):
            continue
        yield event


if __name__ == "__main__":
    app.run()
