import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TrialCard({ clinical }) {
  const navigate = useNavigate()
  const successful = clinical?.successful_trials ?? []
  const failed = clinical?.failed_trials ?? []
  const inconclusive = clinical?.inconclusive_trials ?? []
  const metrics = clinical?.metrics ?? {}
  const registryEntries = clinical?.registry_entries ?? []
  const highlightTrials = (registryEntries.length > 0 ? registryEntries : successful).slice(0, 3)

  const formatEnrollment = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value.toLocaleString()
    }
    const numeric = Number(value)
    if (!Number.isNaN(numeric) && numeric > 0) {
      return numeric.toLocaleString()
    }
    return '—'
  }

  const getTrialUrl = (trial) => {
    if (trial?.url) return trial.url
    if (trial?.nct_id) {
      return `https://clinicaltrials.gov/study/${encodeURIComponent(trial.nct_id)}`
    }
    if (trial?.trial_name) {
      return `https://clinicaltrials.gov/search?term=${encodeURIComponent(trial.trial_name)}`
    }
    return null
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>🧬</span>
          <span>Clinical Trials</span>
          <Badge variant="secondary" className="ml-auto">
            {metrics.total_trials || successful.length} Trials
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          {clinical?.summary || 'Clinical trial intelligence will appear once the analysis finishes.'}
        </p>

        {highlightTrials.length > 0 ? (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Highlighted evidence</div>
            {highlightTrials.map((trial, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{trial.trial_name}</div>
                    <div className="text-xs text-gray-500">
                      {trial.nct_id && <span className="font-semibold">{trial.nct_id}</span>}
                      {trial.year && <span> • {trial.year}</span>}
                    </div>
                  </div>
                  <Badge variant="secondary">{trial.phase}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2">
                  <div>
                    <p className="font-semibold text-gray-700">Region</p>
                    <p>{trial.region || '—'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Enrollment</p>
                    <p>{formatEnrollment(trial.enrollment)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{trial.disease}</p>
                <p className="text-xs text-gray-600 mt-1">{trial.evidence_note}</p>
                {getTrialUrl(trial) && (
                  <Button variant="link" size="sm" className="px-0 mt-1" asChild>
                    <a href={getTrialUrl(trial)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                      <ExternalLink size={14} className="mr-1" />
                      View on ClinicalTrials.gov
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No completed trials returned for this molecule.</div>
        )}

        {(failed.length > 0 || inconclusive.length > 0) && (
          <div className="text-xs text-amber-600">
            ⚠️ {failed.length} failed / {inconclusive.length} inconclusive trial entries detected
          </div>
        )}
        <div className="pt-2 border-t border-gray-100">
          <Button className="w-full" onClick={() => navigate('/trials')}>
            <ArrowRight size={16} className="mr-2" />
            View All Trials & Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
