import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routes.repurpose_route import router

app = FastAPI(title="Drug Repurposing Platform")

raw_origins = os.getenv(
	"ALLOWED_ORIGINS",
	"http://localhost:5173,http://127.0.0.1:5173"
)
allow_all = raw_origins.strip() == "*"
origins = ["*"] if allow_all else [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins or ["*"],
	allow_credentials=not allow_all,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(router)
