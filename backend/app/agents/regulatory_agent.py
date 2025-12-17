from app.agents.base_agent import BaseAgent

class RegulatoryAgent(BaseAgent):
    name = "regulatory"

    def run(self, molecule: str) -> dict:
        return {
            "summary": "FDA-approved molecule with known safety profile",
            "risk_flags": ["GI side effects"],
            "metrics": {
                "regulatory_score": 0.7
            }
        }
