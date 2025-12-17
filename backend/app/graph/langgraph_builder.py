from langgraph.graph import StateGraph

from app.agents.research_agent import ResearchAgent
from app.agents.clinical_agent import ClinicalAgent
from app.agents.patent_agent import PatentAgent
from app.agents.market_agent import MarketAgent

from app.core.scoring_engine import compute_score
from app.core.final_verdict_agent import generate_final_verdict


def extract_diseases(research: dict) -> list[str]:
    """Extract unique diseases from research agent"""
    diseases = []
    for ev in research.get("positive_evidence", []):
        d = ev.get("disease")
        if d and d not in diseases:
            diseases.append(d)
    return diseases


def build_case1_graph():
    graph = StateGraph(dict)

    # ---------- RESEARCH ----------
    graph.add_node(
        "research",
        lambda s: {
            **s,
            "research": ResearchAgent().run({
                "molecule": s.get("molecule"),
                "disease": None
            })
        }
    )

    # ---------- CLINICAL ----------
    graph.add_node(
        "clinical",
        lambda s: {
            **s,
            "clinical_trials": ClinicalAgent().run({
                "molecule": s.get("molecule"),
                "disease": None  # molecule-based trials
            })
        }
    )

    # ---------- PATENT ----------
    graph.add_node(
        "patent",
        lambda s: {
            **s,
            "patents": PatentAgent().run({
                "molecule": s.get("molecule"),
                "disease": None
            })
        }
    )

    # ---------- MARKET ----------
    graph.add_node(
        "market",
        lambda s: {
            **s,
            "market": MarketAgent().run({
                "molecule": s.get("molecule"),
                "disease": (
                    extract_diseases(s["research"])[0]
                    if extract_diseases(s["research"])
                    else "Unknown"
                )
            })
        }
    )

    # ---------- SCORING ----------
    graph.add_node(
        "scoring",
        lambda s: {
            **s,
            "scoring_engine": compute_score(
                s["research"],
                s["clinical_trials"],
                s["patents"],
                s["market"]
            )
        }
    )

    # ---------- FINAL VERDICT ----------
    graph.add_node(
        "final_verdict",
        lambda s: {
            **s,
            "final_verdict": generate_final_verdict(
                s["scoring_engine"],
                extract_diseases(s["research"]),
                s.get("molecule")
            )
        }
    )

    # ---------- FLOW ----------
    graph.set_entry_point("research")
    graph.add_edge("research", "clinical")
    graph.add_edge("clinical", "patent")
    graph.add_edge("patent", "market")
    graph.add_edge("market", "scoring")
    graph.add_edge("scoring", "final_verdict")

    return graph.compile()
