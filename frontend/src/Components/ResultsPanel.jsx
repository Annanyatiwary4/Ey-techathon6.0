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
  const { drug, disease } = useResultStore((s) => s.query)
  const analysis = useResultStore((s) => s.analysis)
  const loading = useResultStore((s) => s.loading)
  const error = useResultStore((s) => s.error)
  const hasQuery = Boolean(drug || disease)

  if (!hasQuery) return null

  const showEvidence = mode === 1 || mode === 2 || mode === 3 || mode === 4
  const showTrials = mode === 1 || mode === 2 || mode === 3
  const showPatents = true
  const showMarket = true

  const caseTitle = {
    1: 'Case 1 — Molecule → Discover New Disease Uses',
    2: 'Case 2 — Disease → Discover Best Molecules',
    3: 'Case 3 — Full Repurposeability Analysis',
    4: 'Case 4 — Trends & Intelligence Mode'
  }[mode]

  if (loading) {
    return (
      <div className="mt-8 p-6 border border-dashed rounded-lg text-center text-gray-600">
        Running live analysis for <strong>{drug}</strong>... this can take up to ~10 seconds.
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 p-6 border border-red-200 bg-red-50 rounded-lg text-red-700">
        {error}
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="mt-8 p-6 border border-blue-200 bg-blue-50 rounded-lg text-blue-700">
        Live data is available for Case 1 and Case 3 when you provide a molecule. Please run one of those modes to view the agent outputs.
      </div>
    )
  }

  const research = analysis.agents?.research
  const clinical = analysis.agents?.clinical_trials
  const patents = analysis.agents?.patents
  const market = analysis.agents?.market
  const scoring = analysis.scoring_engine
  const finalVerdict = analysis.final_verdict

  const synthesisPieces = [
    clinical?.summary && `Clinical trials: ${clinical.summary}`,
    patents?.summary && `Patent landscape: ${patents.summary}`,
    market?.summary && `Market trends: ${market.summary}`
  ].filter(Boolean)

  return (
    <div className="mt-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{caseTitle}</h2>
        <p className="text-sm text-gray-600">
          Query: <span className="font-semibold text-blue-600">{drug || '—'}</span>
          {disease && <span> / <span className="font-semibold text-blue-600">{disease}</span></span>}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Generated at {analysis.query_metadata?.generated_at}
        </p>
      </div>

      <div className="space-y-4">
        {showEvidence && <EvidenceCard research={research} />}
        {showTrials && <TrialCard clinical={clinical} />}
        {showPatents && <PatentCard patents={patents} />}
        {showMarket && <MarketChart market={market} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ScoreCard scoring={scoring} />
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Final Verdict</h3>
              <span className="text-sm font-bold text-indigo-600">{finalVerdict?.decision || 'N/A'}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Confidence: {finalVerdict?.confidence || 'Unknown'}</p>
            {finalVerdict?.primary_opportunity && (
              <p className="text-sm text-gray-700 mb-2">
                Primary opportunity: <span className="font-semibold">{finalVerdict.primary_opportunity}</span>
              </p>
            )}
            {finalVerdict?.secondary_opportunity && (
              <p className="text-sm text-gray-700 mb-2">
                Secondary opportunity: <span className="font-semibold">{finalVerdict.secondary_opportunity}</span>
              </p>
            )}
            <div className="text-sm text-gray-700 mb-3">
              <p className="font-semibold text-gray-800 mb-1">Suggested path forward</p>
              {synthesisPieces.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  {synthesisPieces.map((line, idx) => (
                    <li key={`synthesis-${idx}`}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">Run an analysis to aggregate signals from trials, patents, and market trends.</p>
              )}
            </div>
            {Array.isArray(finalVerdict?.recommended_next_steps) && finalVerdict.recommended_next_steps.length > 0 && (
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Next steps:</p>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  {finalVerdict.recommended_next_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <PDFExportPanel />
        </div>
      </div>
    </div>
  )
}
