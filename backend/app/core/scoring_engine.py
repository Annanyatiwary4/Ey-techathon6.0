from __future__ import annotations

from typing import Any, Dict


def compute_score(research: Dict[str, Any], clinical: Dict[str, Any], patent: Dict[str, Any], market: Dict[str, Any]):
    positive_science = len(research.get("positive_evidence", []))
    negative_science = len(research.get("negative_evidence", []))
    successful_trials = len(clinical.get("successful_trials", []))
    commercial_feasibility = float(market.get("metrics", {}).get("commercial_feasibility", 0))

    # Baseline component weights
    science_score = min(100, positive_science * 5)
    clinical_score = min(100, successful_trials * 12)
    market_score = int(commercial_feasibility * 100)
    patent_score = 75 if patent.get("active_patents") else 55
    regulatory_score = 75

    negative_penalty = negative_science * 5

    final_score = (
        science_score * 0.25
        + clinical_score * 0.3
        + market_score * 0.25
        + patent_score * 0.1
        + regulatory_score * 0.1
        - negative_penalty
    )

    final_score = max(0, min(100, round(final_score)))

    return {
        "score_breakdown": {
            "science": science_score,
            "clinical": clinical_score,
            "patent": patent_score,
            "regulatory": regulatory_score,
            "market": market_score,
            "negative_penalty": -negative_penalty
        },
        "final_repurposeability_score": final_score,
        "explanation": "Composite of science, clinic, IP, regulatory, and market strength"
    }
