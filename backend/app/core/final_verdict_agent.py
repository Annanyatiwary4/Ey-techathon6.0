from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from app.core.llm_provider import get_llm
from app.data.showcase_cases import resolve_showcase_case

GO_THRESHOLD = 60
HIGH_CONF_THRESHOLD = 80


def generate_final_verdict(scoring: dict, diseases: List[str], molecule: Optional[str] = None) -> dict:
    score_based = _score_based_verdict(scoring, diseases)

    story_payload = None
    if molecule:
        case = resolve_showcase_case(molecule)
        if case:
            story_payload = case.get("repurposing_story")

    if story_payload:
        merged = {**score_based, **story_payload}
        return _with_legacy_fields(merged)

    llm = get_llm()
    if not llm:
        return _with_legacy_fields(score_based)

    prompt = f"""
You are a pharmaceutical strategy expert.

Scoring summary:
{json.dumps(scoring, indent=2)}

Candidate diseases:
{diseases}

Return STRICT JSON ONLY with:
- decision (GO/NO-GO)
- confidence (High/Medium/Low)
- executive_summary
- primary_opportunity
- secondary_opportunities (max 2)
- why_it_works (list)
- risk_summary (list)
- recommended_next_steps (list)
"""

    try:
        response = llm.invoke(prompt).content
        data = json.loads(response)
        sanitized = {**score_based, **data}
        return _with_legacy_fields(sanitized)
    except Exception:
        return _with_legacy_fields(score_based)


def _score_based_verdict(scoring: dict | None, diseases: List[str]) -> Dict[str, Any]:
    final_score = 0
    if scoring:
        final_score = int(scoring.get("final_repurposeability_score", 0) or 0)

    decision = "GO" if final_score >= GO_THRESHOLD else "CONSIDER" if final_score >= 50 else "NO-GO"
    confidence = "High" if final_score >= HIGH_CONF_THRESHOLD else "Medium" if final_score >= GO_THRESHOLD else "Low"
    primary = diseases[0] if diseases else "Indication under evaluation"
    secondary = diseases[1:3]

    summary = (
        f"Composite score of {final_score}/100 suggests {decision} for {primary}. "
        "Signal strength blends research, clinical, patent, and market agents."
    )

    why_it_works = [
        "Multi-agent pipeline produced converging positive signals",
        "Clinical or market metrics exceeded internal go thresholds"
    ]
    risk_summary = [
        "Need to validate durability of effect in larger cohorts",
        "Monitor patent and reimbursement headwinds"
    ]
    next_steps = [
        "Launch a focused proof-of-concept program",
        "Secure IP or partnership coverage for the top opportunity",
        "Expand real-world evidence capture"
    ]

    return {
        "decision": decision,
        "confidence": confidence,
        "executive_summary": summary,
        "primary_opportunity": primary,
        "secondary_opportunities": secondary,
        "why_it_works": why_it_works,
        "risk_summary": risk_summary,
        "recommended_next_steps": next_steps
    }


def _with_legacy_fields(payload: Dict[str, Any]) -> Dict[str, Any]:
    secondary = payload.get("secondary_opportunities") or []
    if secondary:
        payload["secondary_opportunity"] = secondary[0]
    else:
        payload.pop("secondary_opportunity", None)
    payload.setdefault("why_it_works", [])
    payload.setdefault("risk_summary", [])
    payload.setdefault("recommended_next_steps", [])
    payload.setdefault("executive_summary", payload.get("summary"))
    return payload
