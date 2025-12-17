from app.core.llm_provider import get_llm
import json

def generate_final_verdict(scoring: dict, diseases: list) -> dict:
    llm = get_llm()

    fallback = {
        "decision": "NO-GO",
        "confidence": "Medium",
        "primary_opportunity": diseases[0] if diseases else "Unknown",
        "secondary_opportunities": diseases[1:3],
        "risk_summary": [
            "Patent crowding",
            "Safety profile considerations"
        ],
        "recommended_next_steps": [
            "Collect additional evidence",
            "Conduct targeted Phase 2 trials"
        ]
    }

    if not llm:
        return fallback

    prompt = f"""
You are a pharmaceutical strategy expert.

Scoring summary:
{json.dumps(scoring, indent=2)}

Candidate diseases:
{diseases}

Return STRICT JSON ONLY with:
- decision (GO/NO-GO)
- confidence (High/Medium)
- primary_opportunity
- secondary_opportunities (max 2)
- risk_summary (list)
- recommended_next_steps (list)
"""

    try:
        response = llm.invoke(prompt).content
        return json.loads(response)
    except Exception:
        # 🚨 NEVER CRASH PIPELINE
        return fallback
