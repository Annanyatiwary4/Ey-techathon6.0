def detect_case(payload: dict) -> str:
    if payload.get("trend_mode"):
        return "CASE_4_TRENDS"
    if payload.get("molecule") and not payload.get("disease"):
        return "CASE_1_MOLECULE_ONLY"
    if payload.get("disease") and not payload.get("molecule"):
        return "CASE_2_DISEASE_ONLY"
    if payload.get("molecule") and payload.get("disease"):
        return "CASE_3_BOTH"
    raise ValueError("Invalid input")
