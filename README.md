# 🧬 PharmAI Insights — Drug & Disease Intelligence Platform

This repository hosts a FastAPI + LangGraph backend and a React + Vite frontend. Case 1 (molecule → diseases) and Case 3 (full drug/disease analysis) are wired end-to-end; remaining modes fall back to UI messaging until their agent workflows are ready.

---

## Requirements

- Python 3.11+ (project tested with 3.12)
- Node.js 20+
- pnpm/npm/yarn (examples below use npm)
- GROQ API key for the LLM-powered LangGraph agents

---

## Environment Variables

Create the following files before running anything:

**backend/.env**

```
GROQ_API_KEY=your_groq_key
ALLOWED_ORIGINS=http://localhost:5173
```

**frontend/.env.local**

```
VITE_API_BASE_URL=http://localhost:8000
```

`ALLOWED_ORIGINS=*` is supported but restrict it to trusted origins in production.

---

## Backend Setup (FastAPI)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The server exposes `POST /repurpose`. Example payload:

```http
POST /repurpose HTTP/1.1
Content-Type: application/json

{
   "molecule": "Semaglutide",
   "disease": "NASH",
   "trend_mode": false
}
```

Successful responses include `analysis.agents` (research, clinical_trials, patents, market), `analysis.scoring_engine`, and `analysis.final_verdict`. Errors return a FastAPI JSON problem response with `detail`.

---

## Frontend Setup (React + Vite)

```powershell
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

The UI uses Zustand for state. When a user runs Case 1 or Case 3, `useResultStore.runAnalysis` posts to `/repurpose`, persists the latest query, and hydrates every detail page (Evidence, Trials, Patents, Market) along with export utilities.

---

## Development Workflow

1. Start the backend (see above) and ensure the terminal prints `Uvicorn running on http://127.0.0.1:8000`.
2. Start the frontend dev server and open http://localhost:5173.
3. Choose Case 1 or Case 3, enter a molecule (and optional disease), and click **Run Analysis**.
4. Explore the Results panel, drill into the detail pages, or download the TXT source summary.

If the backend is unreachable you’ll see a toast error and an inline alert inside the Results panel.

---

## Project Structure

```
backend/
   app/
      routes/repurpose_route.py   # POST /repurpose endpoint
      core/llm_provider.py        # ChatGroq client helper
      core/decision_layer.py      # Verdict generator
      ...
frontend/
   src/
      states/useResultStore.js    # API client + Zustand store
      Components/                 # Cards, charts, export widgets
      pages/                      # Evidence/Trials/Patents/Market detail screens
```

---

## Tips & Next Steps

- Case 2 and Case 4 buttons remain visible but intentionally show “Live data soon” messaging until their agent pipelines are implemented.
- `PDFExportPanel` currently downloads a TXT-based source list; switch the FastAPI export hook on once PDF generation is deployed.
- When deploying, update `ALLOWED_ORIGINS` and `VITE_API_BASE_URL` to the hosted URLs and supply a production-ready GROQ key via your secret manager.

Happy researching! 🧪

---


