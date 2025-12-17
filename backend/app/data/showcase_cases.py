from __future__ import annotations
from typing import Any, Dict, Optional


SHOWCASE_CASES: Dict[str, Dict[str, Any]] = {

    # ============================================================
    # ASPIRIN
    # ============================================================
    "aspirin": {
        "aliases": ["acetylsalicylic acid", "aspirine", "asa"],

        "success_story": (
            "Low-dose aspirin evolved from a common analgesic into a cornerstone of cardiovascular "
            "and obstetric prevention. Large randomized trials such as the Physicians' Health Study, "
            "Women's Health Study, and the ASPRE trial demonstrated significant reductions in myocardial "
            "infarction, ischemic stroke, and preterm preeclampsia."
        ),

        # -------------------- EVIDENCE (PubMed only) --------------------
        "curated_evidence": [
            {
                "disease": "Cardiovascular prevention in women",
                "title": "A randomized trial of low-dose aspirin in the primary prevention of cardiovascular disease in women",
                "journal": "New England Journal of Medicine",
                "year": 2005,
                "url": "https://pubmed.ncbi.nlm.nih.gov/15753114/",
                "evidence_type": "Randomized placebo-controlled trial"
            },
            {
                "disease": "High-risk pregnancies (preeclampsia)",
                "title": "Aspirin versus Placebo in Pregnancies at High Risk for Preterm Preeclampsia",
                "journal": "New England Journal of Medicine",
                "year": 2017,
                "url": "https://pubmed.ncbi.nlm.nih.gov/28657417/",
                "evidence_type": "ASPRE Phase III trial"
            },
            {
                "disease": "Older adults primary prevention",
                "title": "Effect of Aspirin on Cardiovascular Events and Bleeding in the Healthy Elderly",
                "journal": "New England Journal of Medicine",
                "year": 2018,
                "url": "https://pubmed.ncbi.nlm.nih.gov/30221597/",
                "evidence_type": "ASPREE randomized trial"
            },
            {
                "disease": "Type 2 diabetes primary prevention",
                "title": "Effects of Aspirin for Primary Prevention in Persons with Diabetes Mellitus",
                "journal": "New England Journal of Medicine",
                "year": 2018,
                "url": "https://pubmed.ncbi.nlm.nih.gov/30146931/",
                "evidence_type": "ASCEND randomized trial"
            }
        ],

        # -------------------- CLINICAL TRIALS (ClinicalTrials.gov only) --------------------
        "curated_trials": [
            {
                "nct_id": "NCT00000543",
                "trial_name": "Women's Health Study",
                "phase": "Phase III",
                "status": "Completed",
                "disease": "Primary prevention in women",
                "region": "United States",
                "year": 2005,
                "enrollment": 39876,
                "sponsor": "Brigham and Women's Hospital / NIH",
                "evidence_note": "Reduced ischemic stroke by ~24%.",
                "url": "https://clinicaltrials.gov/study/NCT00000543"
            },
            {
                "nct_id": "NCT01124786",
                "trial_name": "ASPRE Trial",
                "phase": "Phase III",
                "status": "Completed",
                "disease": "High-risk pregnancies",
                "region": "Europe",
                "year": 2017,
                "enrollment": 1776,
                "sponsor": "Fetal Medicine Foundation",
                "evidence_note": "150 mg nightly aspirin reduced preterm preeclampsia by 62%.",
                "url": "https://clinicaltrials.gov/study/NCT01124786"
            },
            {
                "nct_id": "NCT00135226",
                "trial_name": "ASCEND Trial",
                "phase": "Phase III",
                "status": "Completed",
                "disease": "Type 2 diabetes primary prevention",
                "region": "United Kingdom",
                "year": 2018,
                "enrollment": 15480,
                "sponsor": "University of Oxford",
                "evidence_note": "Lower vascular events with increased bleeding risk.",
                "url": "https://clinicaltrials.gov/study/NCT00135226"
            },
            {
                "nct_id": "NCT00145030",
                "trial_name": "ARRIVE Trial",
                "phase": "Phase III",
                "status": "Completed",
                "disease": "Moderate cardiovascular risk adults",
                "region": "International",
                "year": 2018,
                "enrollment": 12546,
                "sponsor": "Bayer Healthcare",
                "evidence_note": "No significant CV benefit in moderate-risk adults.",
                "url": "https://clinicaltrials.gov/study/NCT00145030"
            }
        ],

        # -------------------- PATENTS (Google Patents only) --------------------
        "curated_patents": [
            {
                "number": "US20140275092A1",
                "title": "Methods for reducing the risk of preeclampsia",
                "assignee": "National Institutes of Health",
                "url": "https://patents.google.com/patent/US20140275092A1",
                "focus": "Low-dose aspirin prophylaxis in high-risk pregnancy"
            },
            {
                "number": "US20130183211A1",
                "title": "Aspirin-based regimens for colorectal cancer prevention",
                "assignee": "Brigham and Women's Hospital",
                "url": "https://patents.google.com/patent/US20130183211A1",
                "focus": "Chemoprevention using sustained low-dose aspirin"
            },
            {
                "number": "US20170258985A1",
                "title": "Dual pathway inhibition using aspirin and factor Xa inhibitors",
                "assignee": "Bayer / Janssen",
                "url": "https://patents.google.com/patent/US20170258985A1",
                "focus": "Aspirin + anticoagulant combination therapy"
            },
            {
                "number": "US4555399A",
                "title": "Enteric-coated aspirin tablet",
                "assignee": "Bayer AG",
                "url": "https://patents.google.com/patent/US4555399A",
                "focus": "Reduced gastric irritation formulation"
            },
            {
                "number": "WO2011098721A1",
                "title": "Chronotherapy dosing of aspirin",
                "assignee": "Universidad de Murcia",
                "url": "https://patents.google.com/patent/WO2011098721A1",
                "focus": "Night-time aspirin dosing optimization"
            }
        ],

        "market_trends": {
            "unit": "USD billions (antiplatelet & maternal-fetal prophylaxis)",
            "feasibility": 0.78,
            "region_series": [
                {
                    "region": "North America",
                    "cagr": 0.037,
                    "notes": "U.S. cardiology and maternal-fetal medicine clinics continue to expand aspirin prophylaxis pathways.",
                    "series": [
                        {"year": 2020, "value": 1.1},
                        {"year": 2022, "value": 1.2},
                        {"year": 2024, "value": 1.35},
                        {"year": 2026, "value": 1.45}
                    ]
                },
                {
                    "region": "Europe",
                    "cagr": 0.031,
                    "notes": "NICE and ESC guidelines continue to drive steady aspirin demand despite generic pricing pressure.",
                    "series": [
                        {"year": 2020, "value": 0.9},
                        {"year": 2022, "value": 1.0},
                        {"year": 2024, "value": 1.12},
                        {"year": 2026, "value": 1.18}
                    ]
                },
                {
                    "region": "Asia-Pacific",
                    "cagr": 0.058,
                    "notes": "Rapid adoption of hypertensive pregnancy screening programs boosts aspirin volumes across APAC.",
                    "series": [
                        {"year": 2020, "value": 0.5},
                        {"year": 2022, "value": 0.62},
                        {"year": 2024, "value": 0.75},
                        {"year": 2026, "value": 0.92}
                    ]
                }
            ],
            "global_series": [
                {"year": 2020, "value": 2.7},
                {"year": 2021, "value": 2.8},
                {"year": 2022, "value": 3.0},
                {"year": 2023, "value": 3.2},
                {"year": 2024, "value": 3.4},
                {"year": 2025, "value": 3.6},
                {"year": 2026, "value": 3.8}
            ],
            "negative_signals": [
                "ASPREE (NCT01038583) flagged elevated bleeding risk when aspirin is used for primary prevention in the very elderly.",
                "Competition from combination oral anticoagulants keeps pricing pressure on stand-alone aspirin SKUs."
            ],
            "sources": [
                "IQVIA 2024 Antiplatelet Forecast",
                "Frost & Sullivan 2023 Maternal Health Market Report"
            ]
        }
    },

    # ============================================================
    # THALIDOMIDE
    # ============================================================
    "thalidomide": {
        "aliases": ["alpha-phthalimidoglutarimide"],

        "success_story": (
            "Thalidomide was repurposed from a withdrawn sedative into a life-saving "
            "immunomodulatory drug. Controlled trials demonstrated efficacy in erythema "
            "nodosum leprosum and multiple myeloma, leading to FDA reapproval under strict "
            "risk management programs."
        ),

        # -------------------- EVIDENCE (PubMed only) --------------------
        "curated_evidence": [
            {
                "disease": "Erythema nodosum leprosum",
                "title": "Double-blind clinical trial of thalidomide in the treatment of erythema nodosum leprosum",
                "journal": "Indian Journal of Dermatology, Venereology and Leprology",
                "year": 1999,
                "url": "https://pubmed.ncbi.nlm.nih.gov/10395864/",
                "evidence_type": "Controlled clinical trial"
            },
            {
                "disease": "Multiple myeloma",
                "title": "Thalidomide plus melphalan and prednisone versus melphalan and prednisone alone",
                "journal": "The Lancet",
                "year": 2006,
                "url": "https://pubmed.ncbi.nlm.nih.gov/16551797/",
                "evidence_type": "IFM 99-06 Phase III trial"
            }
        ],

        # -------------------- CLINICAL TRIALS --------------------
        "curated_trials": [
            {
                "nct_id": "NCT00002674",
                "trial_name": "IFM 99-06: Thalidomide + Melphalan + Prednisone",
                "phase": "Phase III",
                "status": "Completed",
                "disease": "Multiple myeloma",
                "region": "France / Europe",
                "year": 2006,
                "enrollment": 447,
                "sponsor": "Intergroupe Francophone du Myélome",
                "evidence_note": "Improved progression-free survival in newly diagnosed multiple myeloma.",
                "url": "https://clinicaltrials.gov/study/NCT00002674"
            },
            {
                "nct_id": "NCT00002535",
                "trial_name": "Thalidomide for Severe ENL",
                "phase": "Phase III",
                "status": "Completed",
                "disease": "Erythema nodosum leprosum",
                "region": "Global",
                "year": 1998,
                "enrollment": 145,
                "sponsor": "National Hansen's Disease Programs",
                "evidence_note": "Rapid lesion resolution with steroid-sparing durability.",
                "url": "https://clinicaltrials.gov/study/NCT00002535"
            }
        ],

        # -------------------- PATENTS --------------------
        "curated_patents": [
            {
                "number": "US5604209A",
                "title": "Therapeutic methods using thalidomide",
                "assignee": "Celgene Corporation",
                "url": "https://patents.google.com/patent/US5604209A",
                "focus": "TNF-α mediated inflammatory diseases"
            },
            {
                "number": "US6136785A",
                "title": "Methods of inhibiting TNF-alpha using thalidomide",
                "assignee": "Celgene Corporation",
                "url": "https://patents.google.com/patent/US6136785A",
                "focus": "Immunomodulatory mechanism of action"
            },
            {
                "number": "US6569851B2",
                "title": "Use of thalidomide for angiogenesis-mediated diseases",
                "assignee": "Celgene Corporation",
                "url": "https://patents.google.com/patent/US6569851B2",
                "focus": "Anti-angiogenic oncology indications"
            },
            {
                "number": "US20070161564A1",
                "title": "Combination therapy of thalidomide with chemotherapeutic agents",
                "assignee": "Celgene Corporation",
                "url": "https://patents.google.com/patent/US20070161564A1",
                "focus": "Multiple myeloma combination regimens"
            },
            {
                "number": "US20100069347A1",
                "title": "Risk management systems for teratogenic drugs",
                "assignee": "Celgene Corporation",
                "url": "https://patents.google.com/patent/US20100069347A1",
                "focus": "Controlled distribution and REMS frameworks"
            }
        ],

        "market_trends": {
            "unit": "USD billions (IMiD / plasma cell disorder market)",
            "feasibility": 0.82,
            "region_series": [
                {
                    "region": "North America",
                    "cagr": 0.055,
                    "notes": "Front-line adoption in transplant-ineligible multiple myeloma keeps demand resilient.",
                    "series": [
                        {"year": 2020, "value": 5.2},
                        {"year": 2022, "value": 5.8},
                        {"year": 2024, "value": 6.4},
                        {"year": 2026, "value": 7.1}
                    ]
                },
                {
                    "region": "Europe",
                    "cagr": 0.043,
                    "notes": "Managed entry agreements preserve thalidomide access for newly diagnosed myeloma.",
                    "series": [
                        {"year": 2020, "value": 3.1},
                        {"year": 2022, "value": 3.4},
                        {"year": 2024, "value": 3.8},
                        {"year": 2026, "value": 4.2}
                    ]
                },
                {
                    "region": "Asia-Pacific",
                    "cagr": 0.076,
                    "notes": "Brazil, India, and China scale IMiD access programs for relapsed/refractory patients.",
                    "series": [
                        {"year": 2020, "value": 1.8},
                        {"year": 2022, "value": 2.2},
                        {"year": 2024, "value": 2.8},
                        {"year": 2026, "value": 3.3}
                    ]
                }
            ],
            "global_series": [
                {"year": 2020, "value": 10.5},
                {"year": 2021, "value": 11.2},
                {"year": 2022, "value": 12.1},
                {"year": 2023, "value": 13.0},
                {"year": 2024, "value": 13.8},
                {"year": 2025, "value": 14.6},
                {"year": 2026, "value": 15.5}
            ],
            "negative_signals": [
                "Lenalidomide and pomalidomide patent cliffs intensify competition for IMiD share.",
                "Stringent REMS controls elevate distribution costs relative to lenalidomide generics."
            ],
            "sources": [
                "Evaluate Pharma 2024 Multiple Myeloma Outlook",
                "GlobalData 2023 Immunomodulatory Drug Forecast"
            ]
        }
    }
}


def resolve_showcase_case(molecule: Optional[str]) -> Optional[Dict[str, Any]]:
    """Return curated showcase data when the molecule matches a spotlight case."""
    if not molecule:
        return None

    canonical = molecule.strip().lower()
    for name, payload in SHOWCASE_CASES.items():
        aliases = {name} | {alias.lower() for alias in payload.get("aliases", [])}
        if canonical in aliases:
            return payload
    return None
