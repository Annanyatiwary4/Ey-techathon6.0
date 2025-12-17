from __future__ import annotations

from typing import Iterable

from app.core.llm_provider import get_llm


def summarize_with_llm(topic: str, facts: Iterable[str], fallback: str) -> str:
    """Use the Groq LLM to summarize structured facts.

    Returns the fallback summary when the LLM is unavailable or facts are empty.
    """

    fact_list = [f.strip() for f in facts if f and f.strip()]
    if not fact_list:
        return fallback

    llm = get_llm()
    if not llm:
        return fallback

    prompt = f"""
You are an expert pharmaceutical analyst. Summarize the findings for {topic}.
Craft 2-3 concise sentences referencing the facts below without inventing new data.
Facts:
{chr(10).join(f'- {fact}' for fact in fact_list[:8])}
"""

    try:
        response = llm.invoke(prompt)
        text = (response.content or "").strip()
        return text or fallback
    except Exception:
        return fallback
