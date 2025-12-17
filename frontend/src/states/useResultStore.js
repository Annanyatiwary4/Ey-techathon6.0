import { create } from 'zustand'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')
const INITIAL_MODE = 1

export const useResultStore = create((set, get) => ({
  mode: INITIAL_MODE,
  query: { drug: null, disease: null },
  analysis: null,
  loading: false,
  error: null,
  lastUpdated: null,

  setMode(mode) {
    set({ mode })
  },

  clear() {
    set({
      analysis: null,
      query: { drug: null, disease: null },
      error: null,
      lastUpdated: null,
      mode: INITIAL_MODE
    })
  },

  async runAnalysis({ drug, disease }) {
    const trimmedDrug = drug?.trim() || null
    const trimmedDisease = disease?.trim() || null
    const { mode } = get()

    if (!trimmedDrug) {
      throw new Error('Please provide a molecule or drug name to run live analysis.')
    }

    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE_URL}/repurpose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          molecule: trimmedDrug,
          disease: trimmedDisease,
          trend_mode: mode === 4
        })
      })

      if (!response.ok) {
        let detail = 'Failed to run analysis.'
        try {
          const errorBody = await response.json()
          if (errorBody?.detail) {
            detail = errorBody.detail
          }
        } catch (error) {
          // ignore JSON parse errors
        }
        throw new Error(detail)
      }

      const data = await response.json()

      set({
        analysis: data,
        query: { drug: trimmedDrug, disease: trimmedDisease },
        loading: false,
        error: null,
        lastUpdated: data?.query_metadata?.generated_at || new Date().toISOString()
      })

      return data
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  }
}))
