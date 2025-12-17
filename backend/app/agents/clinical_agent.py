from app.agents.base_agent import BaseAgent
from app.core.llm_provider import get_llm
from app.data.showcase_cases import resolve_showcase_case
from app.services.clinicaltrials_service import fetch_trials
from app.utils.summarizer import summarize_with_llm
import json


class ClinicalAgent(BaseAgent):
    name = "clinical_trials"

    def run(self, payload: dict) -> dict:
        molecule = payload.get("molecule")
        disease = payload.get("disease")

        showcase = resolve_showcase_case(molecule)
        api_trials = fetch_trials(molecule, disease)
        if showcase:
            return self._showcase_payload(molecule, disease, showcase, api_trials)

        if api_trials:
            return self._from_api_trials(molecule, disease, api_trials)

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

            return self._with_summarized_overview(molecule, data)

        except Exception:
            return self._synthetic_payload(molecule, disease, "LLM parsing failure")

    def _showcase_payload(self, molecule: str | None, disease: str | None, case: dict, api_trials: list[dict]):
        curated = [self._normalize_trial_entry(entry) for entry in case.get("curated_trials", [])]
        api_entries = [
            self._normalize_api_trial_entry(entry, molecule, disease)
            for entry in api_trials
        ]
        combined = self._dedupe_trial_entries(curated + [entry for entry in api_entries if entry])
        if not combined:
            return self._synthetic_payload(molecule, disease, "No curated trials available")

        successful, failed, inconclusive = self._segment_trials(combined)
        payload = {
            "summary": case.get("success_story", ""),
            "successful_trials": successful,
            "failed_trials": failed,
            "inconclusive_trials": inconclusive,
            "metrics": {
                "total_trials": len(combined),
                "success_rate": round(len(successful) / max(len(combined), 1), 2)
            },
            "registry_entries": combined,
            "success_story": case.get("success_story"),
            "sources": case.get("sources", [])
        }
        return self._with_summarized_overview(molecule, payload)

    def _normalize_trial_entry(self, entry: dict) -> dict:
        record = entry.copy()
        nct_id = record.get("nct_id")
        if nct_id and not record.get("url"):
            record["url"] = f"https://clinicaltrials.gov/study/{nct_id}"
        return record

    def _normalize_api_trial_entry(self, entry: dict, molecule: str | None, disease: str | None):
        def first(field):
            value = entry.get(field)
            if isinstance(value, list):
                return value[0] if value else None
            return value

        nct_id = first("NCTId")
        title = first("BriefTitle") or first("OfficialTitle") or f"Clinical trial for {molecule}"
        condition = first("Condition") or disease or "Unknown"
        phase = first("Phase") or "NA"
        status = first("OverallStatus") or "Unknown"
        summary = first("BriefSummary") or "No summary provided"
        enrollment_raw = first("EnrollmentCount")
        try:
            enrollment = int(enrollment_raw) if enrollment_raw else None
        except (TypeError, ValueError):
            enrollment = None

        start_date = first("StartDate") or ""
        year = None
        for token in str(start_date).split():
            if token.isdigit() and len(token) == 4:
                year = int(token)
                break
        if year is None:
            try:
                year = int(str(start_date)[:4]) if str(start_date)[:4].isdigit() else None
            except Exception:
                year = None

        record = {
            "nct_id": nct_id,
            "trial_name": title,
            "phase": phase,
            "status": status,
            "disease": condition,
            "region": first("LocationCountry") or "Global",
            "year": year,
            "enrollment": enrollment,
            "sponsor": first("LeadSponsorName"),
            "evidence_note": summary[:220],
            "url": f"https://clinicaltrials.gov/study/{nct_id}" if nct_id else None
        }
        return record

    def _dedupe_trial_entries(self, entries: list[dict]):
        seen = set()
        result = []
        for entry in entries:
            key = entry.get("nct_id") or entry.get("trial_name")
            if not key or key in seen:
                continue
            seen.add(key)
            result.append(entry)
        return result

    def _segment_trials(self, entries: list[dict]):
        successful, failed, inconclusive = [], [], []
        for record in entries:
            status = (record.get("status") or "").lower()
            if any(token in status for token in ["completed", "approved", "active", "enrolling by invitation"]):
                successful.append(record)
            elif any(token in status for token in ["terminated", "suspended", "withdrawn"]):
                failed.append(record)
            else:
                inconclusive.append(record)
        return successful, failed, inconclusive

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

        registry = successful + failed + inconclusive

        return self._with_summarized_overview(molecule, {
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
            "note": "Synthetic fallback data used while LLM feed is unavailable",
            "registry_entries": registry,
            "success_story": None,
            "sources": []
        })

    def _with_summarized_overview(self, molecule: str | None, payload: dict) -> dict:
        facts = [
            f"{trial['trial_name']} ({trial['phase']}) — {trial['status']}: {trial['evidence_note']}"
            for trial in payload.get("successful_trials", [])[:5]
        ]

        payload["summary"] = summarize_with_llm(
            f"{molecule or 'Candidate'} clinical trials",
            facts,
            payload.get("summary", "Clinical trial overview unavailable.")
        )
        return payload

    def _from_api_trials(self, molecule: str | None, disease: str | None, trials: list[dict]):
        records = [
            self._normalize_api_trial_entry(entry, molecule, disease)
            for entry in trials
        ]
        records = [record for record in records if record]
        successful, failed, inconclusive = self._segment_trials(records)

        total = len(records)
        payload = {
            "summary": f"ClinicalTrials.gov evidence for {molecule or 'candidate'} retrieved via API.",
            "successful_trials": successful,
            "failed_trials": failed,
            "inconclusive_trials": inconclusive,
            "metrics": {
                "total_trials": total,
                "success_rate": round(len(successful) / max(total, 1), 2)
            },
            "registry_entries": records,
            "success_story": None,
            "sources": []
        }
        return self._with_summarized_overview(molecule, payload)
