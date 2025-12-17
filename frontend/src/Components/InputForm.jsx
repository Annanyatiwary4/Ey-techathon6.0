import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useResultStore } from '@/states/useResultStore'
import { toast } from 'sonner'

const timeRanges = ['1M', '3M', '6M', '1Y', 'All']
const regions = ['Global', 'US', 'EU', 'APAC']
const sources = ['PubMed', 'ClinicalTrials', 'Patents', 'All Sources']

export default function InputForm() {
  const runAnalysis = useResultStore((s) => s.runAnalysis)
  const setMode = useResultStore((s) => s.setMode)
  const mode = useResultStore((s) => s.mode)
  const loading = useResultStore((s) => s.loading)
  const query = useResultStore((s) => s.query)

  const [drug, setDrug] = useState(query?.drug || '')
  const [disease, setDisease] = useState(query?.disease || '')

  useEffect(() => {
    setDrug(query?.drug || '')
    setDisease(query?.disease || '')
  }, [query?.drug, query?.disease])

  const supportedModes = new Set([1, 3])

  const handleSearch = async () => {
    if (!supportedModes.has(mode)) {
      toast.info('This case mode will be available soon. Please switch to Case 1 or Case 3 for live analysis.')
      return
    }

    if (!drug.trim()) {
      toast.error('Please enter a drug or molecule name')
      return
    }

    try {
      await runAnalysis({ drug, disease })
      toast.success('Live analysis complete!')
    } catch (error) {
      toast.error(error.message || 'Failed to run analysis')
    }
  }

  const caseOptions = [
    { id: 1, label: 'Molecule → Diseases', desc: 'Find new disease applications', live: true },
    { id: 2, label: 'Disease → Molecules', desc: 'Coming soon — offline preview only', live: false },
    { id: 3, label: 'Full Analysis', desc: 'Complete repurposing analysis (requires molecule)', live: true },
    { id: 4, label: 'Trends & Intelligence', desc: 'Coming soon — market & research trends', live: false }
  ]

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault()
        await handleSearch()
      }}>
      {/* Case Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Analysis Mode</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {caseOptions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setMode(c.id)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                mode === c.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              }`}>
              <div className="text-sm font-medium">{c.label}</div>
              {!c.live && (
                <div className="text-[11px] font-semibold text-amber-600 mt-1">Live data soon</div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          {caseOptions.find(c => c.id === mode)?.desc}
        </p>
      </div>

      {/* Drug and Disease Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Drug / Molecule Name</label>
          <Input
            placeholder="e.g., Metformin, Semaglutide"
            value={drug}
            onChange={(e) => setDrug(e.target.value)}
            className="w-full"
            disabled={mode === 2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Disease / Condition</label>
          <Input
            placeholder="e.g., Diabetes, Obesity"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            className="w-full"
            disabled={mode === 1}
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select className="w-full px-3 py-2 border rounded-md bg-white" defaultValue="1Y">
            {timeRanges.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
          <select className="w-full px-3 py-2 border rounded-md bg-white" defaultValue="Global">
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
          <select className="w-full px-3 py-2 border rounded-md bg-white" defaultValue="All Sources">
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          className="w-full py-6 text-lg font-semibold"
          disabled={loading}
          aria-busy={loading}>
          {loading ? 'Running analysis…' : 'Run Analysis'}
        </Button>
      </div>
    </form>
  )
}
