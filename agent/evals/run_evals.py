#!/usr/bin/env python3
"""Runs evals/questions.yaml against the local agent dev server and grades
each response with an LLM judge (Bedrock DeepSeek, via the aws CLI) against
the per-question criteria. Prints a pass/fail table.

Usage: `agentcore dev` must already be running on localhost:8080, then:
    python3 evals/run_evals.py
"""
import json
import subprocess
import sys
import urllib.request
from pathlib import Path

import yaml

AGENT_URL = "http://localhost:8080/invocations"
JUDGE_MODEL = "deepseek.v3-v1:0"
JUDGE_REGION = "us-west-2"


def invoke_agent(prompt: str) -> str:
    req = urllib.request.Request(
        AGENT_URL,
        data=json.dumps({"prompt": prompt}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    text = ""
    with urllib.request.urlopen(req, timeout=30) as resp:
        for line in resp:
            line = line.decode().strip()
            if not line.startswith("data: "):
                continue
            try:
                payload = json.loads(line[len("data: "):])
            except json.JSONDecodeError:
                continue
            delta = (
                payload.get("event", {})
                .get("contentBlockDelta", {})
                .get("delta", {})
                .get("text")
            )
            if delta:
                text += delta
    return text


def judge(question: str, criteria: str, response: str) -> tuple[bool, str]:
    judge_prompt = (
        "You are grading a chatbot's response against a single criterion.\n\n"
        f"Question asked: {question}\n\n"
        f"Chatbot's response: {response}\n\n"
        f"Criterion: {criteria}\n\n"
        "Does the response satisfy the criterion? Reply with exactly one line: "
        "PASS or FAIL, followed by a dash and a one-sentence reason. "
        "Example: 'FAIL - it invented a dollar amount not on the site.'"
    )
    result = subprocess.run(
        [
            "aws", "bedrock-runtime", "converse",
            "--region", JUDGE_REGION,
            "--model-id", JUDGE_MODEL,
            "--messages", json.dumps([{"role": "user", "content": [{"text": judge_prompt}]}]),
            "--inference-config", json.dumps({"maxTokens": 100}),
        ],
        capture_output=True, text=True, timeout=30,
    )
    if result.returncode != 0:
        return False, f"judge call failed: {result.stderr.strip()[:200]}"
    try:
        out = json.loads(result.stdout)
        verdict = out["output"]["message"]["content"][0]["text"].strip()
    except (KeyError, IndexError, json.JSONDecodeError):
        return False, f"unparsable judge output: {result.stdout[:200]}"
    passed = verdict.upper().startswith("PASS")
    return passed, verdict


def main():
    questions_path = Path(__file__).parent / "questions.yaml"
    groups = yaml.safe_load(questions_path.read_text())

    rows = []
    for group_name, items in groups.items():
        for item in items:
            try:
                response = invoke_agent(item["question"])
            except Exception as e:
                rows.append((group_name, item["id"], False, f"agent call failed: {e}", ""))
                continue
            passed, reason = judge(item["question"], item["criteria"], response)
            rows.append((group_name, item["id"], passed, reason, response))

    print(f"{'GROUP':<16}{'ID':<8}{'RESULT':<8}REASON")
    print("-" * 100)
    for group_name, qid, passed, reason, _ in rows:
        print(f"{group_name:<16}{qid:<8}{'PASS' if passed else 'FAIL':<8}{reason}")

    total = len(rows)
    failed = [r for r in rows if not r[2]]
    print("-" * 100)
    print(f"{total - len(failed)}/{total} passed")
    if failed:
        print("\nFailures:")
        for group_name, qid, _, reason, response in failed:
            print(f"  [{group_name}/{qid}] {reason}\n    response: {response[:200]}")
        sys.exit(1)


if __name__ == "__main__":
    main()
