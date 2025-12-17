import json
from typing import List, Dict

import requests


API_URL = "https://api.patentsview.org/patents/query"


def fetch_patents(molecule: str, limit: int = 5) -> List[Dict[str, str]]:
	"""Query the PatentsView API for patents mentioning the molecule."""
	if not molecule:
		return []

	query = {
		"_text_any": {
			"patent_title": molecule
		}
	}

	try:
		response = requests.get(
			API_URL,
			params={
				"q": json.dumps(query),
				"f": json.dumps([
					"patent_number",
					"patent_title",
					"patent_date",
					"assignees"
				]),
				"o": json.dumps({"page": 1, "per_page": limit})
			},
			timeout=10
		)
		payload = response.json()
	except Exception:
		return []

	patents = payload.get("patents", [])
	results: List[Dict[str, str]] = []
	for patent in patents:
		assignees = patent.get("assignees") or []
		assignee_name = None
		if assignees:
			assignee_name = assignees[0].get("assignee_organization") or assignees[0].get("assignee_last_name")

		patent_number = patent.get("patent_number")
		results.append({
			"number": patent_number,
			"title": patent.get("patent_title"),
			"date": patent.get("patent_date"),
			"assignee": assignee_name,
			"url": f"https://patentsview.org/patent/{patent_number}" if patent_number else None
		})

	return results
