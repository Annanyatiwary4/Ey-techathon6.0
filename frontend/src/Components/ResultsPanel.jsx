import React from 'react'
import { useResultStore } from '@/states/useResultStore'
import ScoreCard from './ScoreCard'
import EvidenceCard from './EvidenceCard'
import TrialCard from './TrialCard'
import PatentCard from './PatendCard'
import MarketChart from './MarketChart'
import PDFExportPanel from './PDFExportPanel'

export default function ResultsPanel() {
  const mode = useResultStore((s) => s.mode)
  const drug = useResultStore((s) => s.drug)
  const disease = useResultStore((s) => s.disease)
  const results = useResultStore((s) => s.results)
  const hasQuery = drug || disease

  if (!hasQuery) return null

  // Determine which cards to show based on mode
  // Case 1: Drug → Disease (Evidence + Trials)
  // Case 2: Disease → Drug (Evidence + Trials)  
  // Case 3: Full Analysis (Evidence + Trials + Patents + Market)
  // Case 4: Trends (Evidence for ongoing research + Market trends)
  const showEvidence = mode === 1 || mode === 2 || mode === 3 || mode === 4
  const showTrials = mode === 1 || mode === 2 || mode === 3
  const showPatents = mode === 3
  const showMarket = mode === 3 || mode === 4

  const caseTitle = {
    1: 'Case 1 — Molecule → Discover New Disease Uses',
    2: 'Case 2 — Disease → Discover Best Molecules',
    3: 'Case 3 — Full Repurposeability Analysis',
    4: 'Case 4 — Trends & Intelligence Mode'
  }[mode]

  return (
    <div className="mt-8 space-y-6">
      {/* Results Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{caseTitle}</h2>
        <p className="text-sm text-gray-600">
          Query: <span className="font-semibold text-blue-600">{drug || '—'}</span>
          {disease && <span> / <span className="font-semibold text-blue-600">{disease}</span></span>}
        </p>
      </div>

      {/* Full-width horizontal cards for main content */}
      <div className="space-y-4">
        {showEvidence && <EvidenceCard />}
        {showTrials && <TrialCard />}
        {showPatents && <PatentCard />}
        {showMarket && <MarketChart />}
      </div>

      {/* Score Card and PDF Export in a single row at the end */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ScoreCard score={results.score} />
        <PDFExportPanel />
      </div>
    </div>
  )
}
