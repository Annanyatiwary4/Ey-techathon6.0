# 🧬 PharmAI Insights — Drug & Disease Intelligence Platform

## Overview
PharmAI Insights is an **AI-driven drug repurposing and trend intelligence platform**. It allows researchers, clinicians, and analysts to:

- Discover new disease indications for existing drugs  
- Identify best candidate molecules for a given disease  
- Perform full repurposability analysis for drug-disease pairs  
- Analyze global trends and insights in drug research  

The platform leverages **multi-agent orchestration**, **semantic vector search**, and **hybrid database strategies** for fast, updated, and accurate recommendations.

---

## Features

### Case Modes
1. **Case 1 — Molecule → Discover Diseases**
   - Input: Drug only  
   - Output: Ranked diseases with supporting evidence and sources  

2. **Case 2 — Disease → Discover Molecules**
   - Input: Disease only  
   - Output: Ranked candidate drugs with clinical, patent, and market info  

3. **Case 3 — Molecule + Disease → Full Analysis**
   - Input: Drug + Disease  
   - Output: Repurposeability score, Go/No-Go recommendation, detailed report  

4. **Case 4 — Trend & Intelligence**
   - Input: Optional  
   - Output: Trend dashboards, heatmaps, co-mention analysis, emerging research  

### Additional Features
- PDF export of reports  
- Source URL tracking for every evidence item  
- Real-time update using hybrid Vector + Structured DB  
- Self-growing knowledge base with incremental API ingestion  

---

## Tech Stack

### Frontend
- React 18 + TypeScript  
- React Router v6  
- Zustand / Context API (state management)  
- TailwindCSS + ShadCN UI (UI components)  
- Recharts / Chart.js (data visualization)  
- jsPDF / React-PDF (report generation)  

### Backend
- Python 3.12  
- FastAPI (REST API)  
- LangGraph / Async Agents (Research, Clinical, Patent, Regulatory, Market)  
- Hybrid Database:  
  - **Weaviate** (vector embeddings for semantic search)  
  - **MySQL** (structured results, scoring, and report storage)  

### APIs & Data Sources
- PubMed, ClinicalTrials.gov, Google Patents  
- FDA / Regulatory CSVs  
- Market datasets  

---

## Architecture Overview
```
┌───────────────────────────────────────────────────────────────┐
│                          FRONTEND UI                          │
│  React + Chakra UI + Zustand                                   │
│  - Input Form (Drug / Disease / Both / None)                  │
│  - Case Detection Logic (1–4)                                  │
│  - Trend Mode Button                                           │
│  - Results Panel / PDF Export (with source URLs)              │
│  - Trend Dashboard (Charts, Heatmaps, Co-mentions)           │
└─────────────────────────────┬─────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│                      CASE DETECTION LOGIC                     │
│  Determines Mode: Case 1–4                                      │
│  Routes request to appropriate agent pipeline                  │
└───────────────┬───────────────────┬───────────────────────────┘
                │                   │
                ▼                   ▼
┌───────────────────────────────┐     ┌───────────────────────────┐
│     Multi-Agent Pipeline       │     │       Trend Analytics      │
│  (Cases 1,2,3)                 │     │  (Case 4, broad insights) │
│  LangGraph orchestrates agents  │     │  Real-time dashboards     │
└─────┬──────────────┬─────────┘     └─────────────┬─────────────┘
      │              │                                │
      ▼              ▼                                ▼
┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐
│ Research    ││ Clinical     ││ Patent      ││ Market      │
│ Agent       ││ Trials Agent ││ Agent       ││ Agent       │
│ PubMed,     ││ ClinicalTrials.gov │ Google Patents │ Pricing/Trends CSV │
│ ArXiv       ││ Phases, Status    │ IP Conflicts  │ Market Data        │
└─────────────┘└─────────────┘└─────────────┘└─────────────┘
      │              │              │               │
      └──────────────┬──────────────┘
                     ▼
┌───────────────────────────────────────────────────────────────┐
│                 AGENT OUTPUT POOL (JSON)                     │
│  Normalized schema: { evidence, source_url, score, trial_count, date, agent } │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│                    SEMANTIC SEARCH & VECTOR DB                │
│  - Weaviate embeddings for fast retrieval                     │
│  - Top-K + similarity thresholds                               │
│  - Clustering & trend detection                                │
│  - Incremental merge of new API results                        │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│                      STRUCTURED DB (SQL)                      │
│  - PostgreSQL stores scores, report metadata, last fetch dates│
│  - Ensures deduplication and efficient queries                │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│                      SCORING ENGINE                             │
│  Weighted multi-factor score:                                   │
│  Science / Clinical / Patent / Regulatory / Market             │
│  → Repurposeability Score (0–100)                               │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│            DECISION & RECOMMENDATION LAYER                     │
│  - Go / No-Go Verdict                                           │
│  - Top Alternatives / Substitutes                               │
│  - Confidence Summary                                           │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│                      PDF / REPORT GENERATOR                   │
│  - Downloadable Reports                                         │
│  - Score breakdown, citations, top recommendations             │
│  - Trend Graphs (if Case 4)                                     │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│                   SELF-GROWING KNOWLEDGE LOOP                 │
│  - New evidence → Vector DB & SQL DB → LangGraph → Agents     │
│  - Trends & clusters updated automatically                     │
│  - Each query improves semantic retrieval and scoring          │
│  - Continuous learning without manual intervention             │
└───────────────────────────────────────────────────────────────┘

```

---

## Advantages

1. **Multi-Mode Discovery** → Serves chemists, clinicians, analysts, and management.  
2. **Fast & Lightweight** → Vector DB + async agents ensures low latency and rapid responses.  
3. **Always Updated** → Incremental API fetch ensures the latest evidence is included.  
4. **Self-Growing Knowledge** → Vector DB + LangGraph expand automatically as new evidence is ingested.  
5. **Traceable & Credible** → All reports include URLs, sources, and agent information.  
6. **Semantic Search + Clustering** → Improves relevance, trend detection, and pattern recognition.  
7. **Modular & Extensible** → Easy to add new agents, sources, or scoring criteria.  
8. **Reduced Redundancy** → Deduplication ensures only **unique evidence contributes**, keeping the system efficient.

---

## Summary

PharmAI Insights combines **fast semantic search**, **multi-agent orchestration**, and **incremental evidence ingestion** to provide:

- Accurate, traceable drug repurposing recommendations  
- Trend analysis and emerging insight dashboards  
- PDF reports with full citation and scoring details  
- Lightweight, modular, and scalable architecture for easy extension  

---


