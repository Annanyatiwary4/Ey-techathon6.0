import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { CheckCircle2 } from 'lucide-react'

export default function ScoreCard({ scoring }) {
  const score = Math.round(scoring?.final_repurposeability_score ?? 0)
  const breakdown = scoring?.score_breakdown ?? {}

  const getRecommendation = (value) => {
    if (value >= 80) return { text: 'HIGH POTENTIAL', color: 'text-green-600', bg: 'bg-green-50' }
    if (value >= 60) return { text: 'MODERATE POTENTIAL', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { text: 'LOW POTENTIAL', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const recommendation = getRecommendation(score)

  const factors = [
    { label: 'Scientific evidence', value: breakdown.science ?? 0 },
    { label: 'Clinical trials', value: breakdown.clinical ?? 0 },
    { label: 'Patent outlook', value: breakdown.patent ?? 0 },
    { label: 'Regulatory readiness', value: breakdown.regulatory ?? 0 },
    { label: 'Market feasibility', value: breakdown.market ?? 0 }
  ]

  return (
    <Card className={`${recommendation.bg} border-2`}>
      <CardHeader>
        <CardTitle className="text-xl">📊 REPURPOSING SCORE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-5xl font-bold mb-2">{score}</div>
          <div className="text-gray-500 text-sm">out of 100</div>
        </div>

        <Progress value={score} className="h-3 mb-4" />

        <div className={`text-center py-2 px-4 rounded-lg mb-4 ${recommendation.bg}`}>
          <div className="text-xs text-gray-600">Recommendation:</div>
          <div className={`font-bold text-lg ${recommendation.color}`}>
            {recommendation.text}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700">Score breakdown</div>
          {factors.map((f, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className={f.value >= 50 ? 'text-green-600' : 'text-gray-300'}
                />
                <span className={f.value >= 50 ? 'text-gray-700' : 'text-gray-400'}>
                  {f.label}
                </span>
              </div>
              <span className="font-semibold text-gray-800">{Math.round(f.value)}</span>
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-3">
            {scoring?.explanation || 'Weighted multi-agent scoring'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
