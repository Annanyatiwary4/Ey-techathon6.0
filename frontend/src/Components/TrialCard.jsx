import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TrialCard({ clinical }) {
  const navigate = useNavigate()
  const successful = clinical?.successful_trials ?? []
  const failed = clinical?.failed_trials ?? []
  const inconclusive = clinical?.inconclusive_trials ?? []
  const metrics = clinical?.metrics ?? {}

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
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-gray-600">
          {clinical?.summary || 'Clinical trial intelligence will appear once the analysis finishes.'}
        </p>

        {successful.length > 0 ? (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Key successful trials</div>
            {successful.slice(0, 3).map((trial, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{trial.trial_name}</span>
                  <Badge variant="secondary">{trial.phase}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{trial.disease}</p>
                <p className="text-xs text-gray-600 mt-1">{trial.evidence_note}</p>
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

        <Button className="w-full" onClick={() => navigate('/trials')}>
          <ArrowRight size={16} className="mr-2" />
          View All Trials & Details
        </Button>
      </CardContent>
    </Card>
  )
}
