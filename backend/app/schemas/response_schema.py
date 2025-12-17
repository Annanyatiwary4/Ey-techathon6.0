from typing import Any, Dict
from pydantic import BaseModel


class RepurposeResponse(BaseModel):
	query_metadata: Dict[str, Any]
	agents: Dict[str, Any]
	scoring_engine: Dict[str, Any]
	final_verdict: Dict[str, Any]
	export: Dict[str, Any]
