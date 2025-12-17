from datetime import datetime
from fastapi import APIRouter, HTTPException, status

from app.core.decision_layer import detect_case
from app.graph.langgraph_builder import build_case1_graph
from app.schemas.request_schema import RepurposeRequest

router = APIRouter()

UNSUPPORTED_CASE_MESSAGES = {
    "CASE_2_DISEASE_ONLY": "Disease-only workflows are not supported yet.",
    "CASE_4_TRENDS": "Trend and intelligence mode is not available yet."
}


@router.post("/repurpose")
def repurpose(payload: RepurposeRequest):
    payload_dict = payload.model_dump()

    try:
        case_type = detect_case(payload_dict)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc)
        ) from exc

    molecule = (payload.molecule or "").strip()
    disease = (payload.disease or "").strip() or None

    if not molecule:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please provide a molecule or drug name to run the analysis."
        )

    if case_type in UNSUPPORTED_CASE_MESSAGES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=UNSUPPORTED_CASE_MESSAGES[case_type]
        )

    graph = build_case1_graph()

    try:
        state = graph.invoke({"molecule": molecule})
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to orchestrate the agent graph."
        ) from exc

    timestamp = datetime.utcnow().isoformat() + "Z"

    return {
        "query_metadata": {
            "case_type": case_type,
            "input": {
                "molecule": molecule,
                "disease": disease,
                "trend_mode": payload.trend_mode
            },
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
