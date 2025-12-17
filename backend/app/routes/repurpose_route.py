from datetime import datetime

from fastapi import APIRouter, HTTPException, Query, status

from app.core.decision_layer import detect_case
from app.graph.langgraph_builder import build_case1_graph
from app.schemas.request_schema import RepurposeRequest

router = APIRouter()

UNSUPPORTED_CASE_MESSAGES = {
    "CASE_2_DISEASE_ONLY": "Disease-only workflows are not supported yet.",
    "CASE_4_TRENDS": "Trend and intelligence mode is not available yet."
}


def _process_repurpose_request(payload: RepurposeRequest):
    molecule = (payload.molecule or "").strip()
    disease = (payload.disease or "").strip() or None

    if not molecule:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please provide a molecule or drug name to run the analysis."
        )

    case_probe = {
        "molecule": molecule,
        "disease": disease,
        "trend_mode": payload.trend_mode
    }

    try:
        case_type = detect_case(case_probe)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc)
        ) from exc

    if case_type in UNSUPPORTED_CASE_MESSAGES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=UNSUPPORTED_CASE_MESSAGES[case_type]
        )

    graph = build_case1_graph()

    try:
        state = graph.invoke({
            "molecule": molecule,
            "disease": disease,
            "trend_mode": payload.trend_mode
        })
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to orchestrate the agent graph."
        ) from exc

    timestamp = datetime.utcnow().isoformat() + "Z"

    return {
        "query_metadata": {
            "case_type": case_type,
            "input": case_probe,
            "generated_at": timestamp
        },
        "agents": {
            "research": state.get("research", {}),
            "clinical_trials": state.get("clinical_trials", {}),
            "patents": state.get("patents", {}),
            "market": state.get("market", {})
        },
        "scoring_engine": state.get("scoring_engine", {}),
        "final_verdict": state.get("final_verdict", {}),
        "export": {
            "pdf_available": False,
            "pdf_url": None
        }
    }


@router.post("/repurpose")
def repurpose(payload: RepurposeRequest):
    return _process_repurpose_request(payload)


@router.get("/repurpose")
def repurpose_get(
    molecule: str | None = Query(default=None, description="Molecule or drug name"),
    drug: str | None = Query(default=None, description="Alias for molecule or drug name"),
    disease: str | None = Query(default=None, description="Optional disease context"),
    trend_mode: bool = Query(default=False, description="Toggle trend intelligence mode")
):
    payload = RepurposeRequest(molecule=molecule or drug, disease=disease, trend_mode=trend_mode)
    return _process_repurpose_request(payload)
