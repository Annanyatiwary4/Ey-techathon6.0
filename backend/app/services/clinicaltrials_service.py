import requests
from datetime import datetime

API_URL = "https://clinicaltrials.gov/api/query/study_fields"

def fetch_trials(molecule: str, disease: str | None = None, limit: int = 15):
	if not molecule:
		return []

	current_year = datetime.utcnow().year
	from_year = current_year - 50

	expr = molecule
	if disease:
		expr = f"{molecule} {disease}"

	expr = f"({expr}) AND (FIRSTPOSTEDDATE:[{from_year}-01-01 TO {current_year}-12-31])"

	params = {
		"expr": expr,
		"fields": ",".join([
			"NCTId",
			"BriefTitle",
			"Condition",
			"Phase",
			"OverallStatus",
			"BriefSummary",
			"EnrollmentCount",
			"StartDate",
			"LocationCountry",
			"LeadSponsorName"
		]),
		"min_rnk": 1,
		"max_rnk": limit,
		"fmt": "json"
	}

	try:
		response = requests.get(API_URL, params=params, timeout=10)
		data = response.json()
		return data.get("StudyFieldsResponse", {}).get("StudyFields", [])
	except Exception:
		return []
