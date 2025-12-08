import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useResultStore } from '@/states/useResultStore'
import { toast } from 'sonner'

const timeRanges = ['1M', '3M', '6M', '1Y', 'All']
const regions = ['Global', 'US', 'EU', 'APAC']
const sources = ['PubMed', 'ClinicalTrials', 'Patents', 'All Sources']

export default function InputForm() {
  const setQuery = useResultStore((s) => s.setQuery)
  const setMode = useResultStore((s) => s.setMode)
  const mode = useResultStore((s) => s.mode)
  
  const [drug, setDrug] = useState('')
  const [disease, setDisease] = useState('')

  const handleSearch = () => {
    if (!drug && !disease && mode !== 4) {
      toast.error('Please enter at least a drug or disease')
      return
    }
    
    setQuery(drug || null, disease || null)
    toast.success('Analysis started!')
  }

  const caseOptions = [
    { id: 1, label: 'Molecule → Diseases', desc: 'Find new disease applications' },
    { id: 2, label: 'Disease → Molecules', desc: 'Find best drug candidates' },
    { id: 3, label: 'Full Analysis', desc: 'Complete repurposing analysis' },
    { id: 4, label: 'Trends & Intelligence', desc: 'Market and research trends' }
  ]

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSearch() }}>
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
        <Button type="submit" className="w-full py-6 text-lg font-semibold">
          Run Analysis
        </Button>
      </div>
    </form>
  )
}
