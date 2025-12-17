from app.agents.base_agent import BaseAgent
from app.core.llm_provider import get_llm
import json


BLOCKBUSTER_DISEASES = {
    "type 2 diabetes", "obesity", "hypertension", "cardiovascular disease"
}


class MarketAgent(BaseAgent):
    name = "market"

    def run(self, payload: dict) -> dict:
        disease = payload.get("disease", "Unknown")
        molecule = payload.get("molecule")

        disease_l = disease.lower()

        # -------- BASE MARKET SIGNAL (NO LLM) --------
        if disease_l in BLOCKBUSTER_DISEASES:
            base_feasibility = 0.4
            base_summary = "Large but saturated market with intense competition."
        else:
            base_feasibility = 0.8
            base_summary = "Emerging or niche market with potential unmet need."

        # -------- IF NO LLM, RETURN HEURISTIC --------
        llm = get_llm()
        if not llm:
            return self._heuristic_response(disease, base_summary, base_feasibility)

        # -------- LLM-ENHANCED MARKET JUDGMENT --------
        prompt = f"""
You are a pharmaceutical market analyst.

Disease: {disease}
Existing molecule: {molecule}

Assess whether this molecule has meaningful incremental market opportunity
for this disease.

Return STRICT JSON ONLY:
{{
  "adoption_trend": "Low|Moderate|High",
  "commercial_feasibility": 0-1,
  "risks": ["..."]
}}
"""

        try:
            data = json.loads(llm.invoke(prompt).content)
        except Exception:
            return self._heuristic_response(disease, base_summary, base_feasibility)

        return {
            "summary": f"Market opportunity analysis for {molecule or 'therapies'} in {disease}.",
            "markets": [
                {
                    "disease": disease,
                    "adoption_trend": data["adoption_trend"]
                }
            ],
            "negative_signals": [
                {"issue": r, "impact": "Commercial risk"} for r in data.get("risks", [])
            ],
            "metrics": {
                "commercial_feasibility": round(float(data["commercial_feasibility"]), 2)
            }
        }

    def _heuristic_response(self, disease, summary, feasibility):
        return {
            "summary": summary,
            "markets": [
                {
                    "disease": disease,
                    "adoption_trend": "Moderate"
                }
            ],
            "negative_signals": [],
            "metrics": {
                "commercial_feasibility": feasibility
            }
        }
