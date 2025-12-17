from pydantic import BaseModel, Field
from typing import Optional


class RepurposeRequest(BaseModel):
	molecule: Optional[str] = Field(
		default=None,
		min_length=1,
		description="Primary molecule or drug name",
	)
	disease: Optional[str] = Field(
		default=None,
		description="Optional disease or condition context",
	)
	trend_mode: bool = Field(
		default=False,
		description="Whether to run the trend intelligence pipeline",
	)

	class Config:
		extra = "forbid"
