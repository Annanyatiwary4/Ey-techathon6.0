import requests, xml.etree.ElementTree as ET, re
from app.agents.base_agent import BaseAgent

PUBMED_SEARCH = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
PUBMED_FETCH  = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

DISEASE_HINTS = {
    "obesity": "Obesity",
    "diabetes": "Type 2 Diabetes",
    "fatty liver": "NAFLD",
    "alzheimer": "Alzheimer’s Disease",
    "cardio": "Cardiovascular Disease"
}

class ResearchAgent(BaseAgent):
    name = "research"

    def extract_disease(self, text: str) -> str:
        t = text.lower()
        for k, v in DISEASE_HINTS.items():
            if k in t:
                return v
        return "Unknown"

    def run(self, state: dict) -> dict:
        molecule = state.get("molecule")
        if not molecule:
            return self._empty()

        try:
            res = requests.get(
                PUBMED_SEARCH,
                params={"db": "pubmed", "term": molecule, "retmax": 30, "retmode": "json"},
                timeout=15
            ).json()
            ids = res.get("esearchresult", {}).get("idlist", [])
        except Exception:
            ids = []

        positive, negative = [], []

        for pmid in ids:
            try:
                xml = requests.get(
                    PUBMED_FETCH,
                    params={"db": "pubmed", "id": pmid, "retmode": "xml"},
                    timeout=15
                ).text
                root = ET.fromstring(xml)
            except Exception:
                continue

            article = root.find(".//Article")
            if article is None:
                continue

            title = article.findtext("ArticleTitle", "")
            abstract = " ".join(
                [a.text or "" for a in article.findall(".//AbstractText")]
            )
            journal = article.findtext(".//Journal/Title", "")
            year = article.findtext(".//PubDate/Year")

            disease = self.extract_disease(title + " " + abstract)
            if disease == "Unknown":
                continue

            record = {
                "disease": disease,
                "title": title,
                "journal": journal,
                "year": int(year) if year and year.isdigit() else None,
                "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}"
            }

            if re.search(r"no significant|failed|did not improve", abstract.lower()):
                record["reason"] = "No statistically significant improvement"
                negative.append(record)
            else:
                record["evidence_type"] = "Experimental / Observational study"
                positive.append(record)

        total = len(positive) + len(negative)

        return {
            "summary": f"Literature evidence linked to {molecule}.",
            "positive_evidence": positive[:5],
            "negative_evidence": negative[:3],
            "retracted_or_low_quality": [],
            "metrics": {
                "total_papers": total,
                "positive_ratio": round(len(positive) / max(total, 1), 2)
            }
        }

    def _empty(self):
        return {
            "summary": "No molecule provided",
            "positive_evidence": [],
            "negative_evidence": [],
            "retracted_or_low_quality": [],
            "metrics": {
                "total_papers": 0,
                "positive_ratio": 0
            }
        }
