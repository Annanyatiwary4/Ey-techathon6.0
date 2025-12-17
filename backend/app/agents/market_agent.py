from app.agents.base_agent import BaseAgent
from app.core.llm_provider import get_llm
from app.data.showcase_cases import resolve_showcase_case
from app.utils.summarizer import summarize_with_llm
import json


BLOCKBUSTER_DISEASES = {
    "type 2 diabetes", "obesity", "hypertension", "cardiovascular disease"
}


class MarketAgent(BaseAgent):
    name = "market"

    def run(self, payload: dict) -> dict:
        disease = payload.get("disease", "Unknown")
        molecule = payload.get("molecule")
        showcase = resolve_showcase_case(molecule)

        disease_l = disease.lower()

        # -------- BASE MARKET SIGNAL (NO LLM) --------
        if disease_l in BLOCKBUSTER_DISEASES:
            base_feasibility = 0.4
            base_summary = "Large but saturated market with intense competition."
        else:
            base_feasibility = 0.8
            base_summary = "Emerging or niche market with potential unmet need."

        if showcase:
            curated = self._showcase_market_case(molecule, disease, showcase)
            if curated:
                return curated

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

        summary = summarize_with_llm(
            f"{molecule or 'Therapy'} market outlook",
            [
                f"Adoption trend: {data['adoption_trend']} with feasibility {data['commercial_feasibility']}"
            ],
            f"Market opportunity analysis for {molecule or 'therapies'} in {disease}."
        )

        return {
            "summary": summary,
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
            },
            "region_trends": [],
            "yearly_totals": [],
            "currency_unit": None,
            "success_story": None,
            "sources": []
        }

    def _heuristic_response(self, disease, summary, feasibility):
        summary_text = summarize_with_llm(
            f"{disease} market outlook",
            [f"Baseline feasibility {feasibility} for {disease}"],
            summary
        )

        return {
            "summary": summary_text,
            "markets": [
                {
                    "disease": disease,
                    "adoption_trend": "Moderate"
                }
            ],
            "negative_signals": [],
            "metrics": {
                "commercial_feasibility": feasibility
            },
            "region_trends": [],
            "yearly_totals": [],
            "currency_unit": None,
            "success_story": None,
            "sources": []
        }

    def _showcase_market_case(self, molecule: str | None, disease: str, case: dict):
        market_data = case.get("market_trends") or {}
        region_series = market_data.get("region_series", [])
        global_series = market_data.get("global_series", [])
        if not region_series and not global_series:
            return None

        unit = market_data.get("unit", "USD billions")
        facts = []
        for region in region_series:
            series = region.get("series", [])
            if not series:
                continue
            last_point = series[-1]
            facts.append(
                f"{region.get('region')} CAGR {round(region.get('cagr', 0)*100, 1)}% reaching {last_point.get('value')} {unit} by {last_point.get('year')}"
            )

        summary = summarize_with_llm(
            f"{molecule or 'Therapy'} market traction",
            facts,
            case.get("success_story", "Curated market insight")
        )

        markets = [
            {
                "disease": region.get("region"),
                "adoption_trend": self._adoption_from_cagr(region.get("cagr")),
                "note": region.get("notes")
            }
            for region in region_series
        ]

        return {
            "summary": summary,
            "markets": markets,
            "negative_signals": [
                {"issue": note, "impact": "Commercial risk"}
                for note in market_data.get("negative_signals", [])
            ],
            "metrics": {
                "commercial_feasibility": round(market_data.get("feasibility", 0.7), 2),
                "regions_tracked": len(region_series)
            },
            "region_trends": region_series,
            "yearly_totals": global_series,
            "currency_unit": unit,
            "success_story": case.get("success_story"),
            "sources": case.get("sources", [])
        }

    def _adoption_from_cagr(self, cagr: float | None) -> str:
        if cagr is None:
            return "Moderate"
        if cagr >= 0.06:
            return "High"
        if cagr >= 0.03:
            return "Moderate"
        return "Low"
