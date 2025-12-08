import { create } from 'zustand'

function generateDummyResults(mode, drug, disease) {
  const baseScore = mode === 3 ? 88 : mode === 1 ? 75 : mode === 2 ? 68 : 62
  const score = Math.min(100, baseScore + Math.floor(Math.random() * 10))
  
  const sources = [
    'PubMed — https://pubmed.ncbi.nlm.nih.gov/XXXXX/',
    'ClinicalTrials — https://clinicaltrials.gov/ct2/show/NCT123456',
    'Google Patents — https://patents.google.com/patent/US20230123456A1',
    'Market Data — https://datahub.io/market-data/pharma-pricing'
  ]

  const evidence = [
    { title: 'Anti-inflammatory effect', summary: 'Shown in multiple preclinical studies with significant p-values.' },
    { title: 'Reduces insulin resistance', summary: 'Observed in cohort studies across multiple populations.' },
    { title: 'Neuroprotective properties', summary: 'Emerging evidence from in-vitro models and animal studies.' }
  ]

  const trials = [
    { id: 'NCT-ABC-200', phase: 'Phase II', status: 'Recruiting' },
    { id: 'NCT-XYZ-451', phase: 'Phase III', status: 'Active' },
    { id: 'NCT-DEF-789', phase: 'Phase I', status: 'Completed' }
  ]

  const patents = {
    total: 32,
    active: 28,
    holder: 'Johnson & Johnson',
    url: 'https://patents.google.com/patent/US20230123456A1'
  }

  const market = {
    chart: [
      { year: '2021', price: 8.2, volume: 1200 },
      { year: '2022', price: 14.5, volume: 1800 },
      { year: '2023', price: 11.3, volume: 2100 },
      { year: '2024', price: 16.7, volume: 2400 }
    ]
  }

  return { score, sources, evidence, trials, patents, market }
}

export const useResultStore = create((set) => ({
  drug: null,
  disease: null,
  mode: 3,
  results: generateDummyResults(3, null, null),

  setQuery(drug, disease) {
    set((state) => {
      if (state.drug === drug && state.disease === disease) return state
      const results = generateDummyResults(state.mode, drug, disease)
      return { drug, disease, results }
    })
  },

  setMode(mode) {
    set((state) => {
      if (state.mode === mode) return state
      const results = generateDummyResults(mode, state.drug, state.disease)
      return { mode, results }
    })
  },

  clear() {
    set({ drug: null, disease: null, mode: 3, results: generateDummyResults(3, null, null) })
  }
}))
