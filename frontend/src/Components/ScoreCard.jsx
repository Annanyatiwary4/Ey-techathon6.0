import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { CheckCircle2 } from 'lucide-react'

export default function ScoreCard({ score = 72 }) {
  const getRecommendation = (score) => {
    if (score >= 80) return { text: 'HIGH POTENTIAL', color: 'text-green-600', bg: 'bg-green-50' }
    if (score >= 60) return { text: 'MODERATE POTENTIAL', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { text: 'LOW POTENTIAL', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const recommendation = getRecommendation(score)

  const factors = [
    { label: 'Scientific evidence', checked: score > 60 },
    { label: 'Clinical trials', checked: score > 55 },
    { label: 'Patent risk', checked: score > 50 },
    { label: 'Market viability', checked: score > 65 }
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
          <div className="text-sm font-semibold text-gray-700">Factors considered:</div>
          {factors.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 
                size={16} 
                className={f.checked ? 'text-green-600' : 'text-gray-300'} 
              />
              <span className={f.checked ? 'text-gray-700' : 'text-gray-400'}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
