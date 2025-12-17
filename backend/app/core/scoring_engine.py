def compute_score(research, clinical, patent, market):
    score = 0
    score += len(research["positive_evidence"]) * 3
    score -= len(research["negative_evidence"]) * 4
    score += len(clinical["successful_trials"]) * 5
    score += market["metrics"]["commercial_feasibility"] * 20

    return {
        "score_breakdown": {
            "science": min(100, score),
            "clinical": len(clinical["successful_trials"]) * 10,
            "patent": 65,
            "regulatory": 70,
            "market": int(market["metrics"]["commercial_feasibility"] * 100),
            "negative_penalty": -14
        },
        "final_repurposeability_score": min(100, score),
        "explanation": "Weighted multi-agent scoring"
    }
