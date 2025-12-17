from app.agents.base_agent import BaseAgent
from app.core.llm_provider import get_llm
import json


class ClinicalAgent(BaseAgent):
    name = "clinical_trials"

    def run(self, payload: dict) -> dict:
        molecule = payload.get("molecule")
        disease = payload.get("disease")

        llm = get_llm()
        if not llm:
            return self._synthetic_payload(molecule, disease, "LLM not available")

        prompt = f"""
You are a pharmaceutical clinical research expert.

Analyze the clinical trial evidence for:
Molecule: {molecule}
Disease: {disease}

Rules:
- Use REAL landmark trials (Phase 2 / Phase 3)
- If molecule is standard-of-care, say so
- If trials exist, summarize outcomes
- Do NOT invent trial IDs
- Be conservative and realistic

Return STRICT JSON ONLY in this schema:

{{
  "summary": "...",
  "successful_trials": [
    {{
      "disease": "...",
      "trial_name": "...",
      "phase": "Phase 2|Phase 3",
      "status": "Completed|Ongoing",
      "evidence_note": "Key outcome"
    }}
  ],
  "failed_trials": [],
  "inconclusive_trials": [],
  "metrics": {{
    "total_trials": <int>,
    "success_rate": <float between 0 and 1>
  }}
}}
"""

        try:
            raw = llm.invoke(prompt).content.strip()
            json_block = raw[raw.find("{"): raw.rfind("}") + 1]
            data = json.loads(json_block)

            # 🔒 safety normalization
            data.setdefault("successful_trials", [])
            data.setdefault("failed_trials", [])
            data.setdefault("inconclusive_trials", [])
            data.setdefault("metrics", {
                "total_trials": len(data.get("successful_trials", [])),
                "success_rate": (
                    len(data.get("successful_trials", [])) /
                    max(len(data.get("successful_trials", [])), 1)
                )
            })

            if not data.get("successful_trials"):
                return self._synthetic_payload(molecule, disease, "LLM returned insufficient detail")

            return data

        except Exception:
            return self._synthetic_payload(molecule, disease, "LLM parsing failure")

    def _synthetic_payload(self, molecule: str | None, disease: str | None, reason: str):
        mol = molecule or "Candidate molecule"
        target = disease or "multiple secondary indications"

        successful = [
            {
                "disease": target,
                "trial_name": f"{mol} Phase II efficacy study",
                "phase": "Phase II",
                "status": "Completed",
                "evidence_note": f"Detected clinically meaningful signal for {target.lower()}."
            },
            {
                "disease": target,
                "trial_name": f"{mol} adaptive design program",
                "phase": "Phase III",
                "status": "Ongoing",
                "evidence_note": "Enrollment on track; interim readout expected within 12 months."
            }
        ]

        failed = [
            {
                "disease": target,
                "trial_name": f"{mol} dose-ranging safety cohort",
                "phase": "Phase II",
                "status": "Terminated",
                "evidence_note": "Dose optimization needed to mitigate tolerability issues."
            }
        ]

        inconclusive = [
            {
                "disease": target,
                "trial_name": f"{mol} biomarker substudy",
                "phase": "Phase I",
                "status": "Completed",
                "evidence_note": "Signal detected but insufficient powered endpoint."
            }
        ]

        total = len(successful) + len(failed) + len(inconclusive)

        return {
            "summary": (
                f"Operational clinical intelligence synthesized locally because {reason}. "
                f"{mol} shows mixed but actionable evidence in {target}."
            ),
            "successful_trials": successful,
            "failed_trials": failed,
            "inconclusive_trials": inconclusive,
            "metrics": {
                "total_trials": total,
                "success_rate": round(len(successful) / total, 2)
            },
            "note": "Synthetic fallback data used while LLM feed is unavailable"
        }
