import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const adoptionScore = (trend) => {
  if (trend === 'High') return 85
  if (trend === 'Moderate') return 60
  if (trend === 'Low') return 35
  return 50
}

export default function MarketChart({ market }) {
  const navigate = useNavigate()
  const feasibility = Math.round((market?.metrics?.commercial_feasibility ?? 0) * 100)
  const chartData = (market?.markets ?? []).map((entry, index) => ({
    label: entry.disease || `Segment ${index + 1}`,
    adoption: adoptionScore(entry.adoption_trend)
  }))

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>💰</span>
          <span>Market Trends</span>
          <Badge variant="secondary" className="ml-auto">Live Signal</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-gray-600">
          {market?.summary || 'Market feasibility insight appears once an analysis finishes.'}
        </p>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="adoption" stroke="#2563eb" strokeWidth={2} name="Adoption trend" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-gray-500">No market segments detected for this query.</div>
        )}

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <div>
            <div className="text-xs uppercase text-gray-500">Commercial feasibility</div>
            <div className="text-2xl font-bold text-blue-600">{feasibility}<span className="text-base font-semibold">%</span></div>
          </div>
          <Badge variant="outline">{market?.markets?.[0]?.adoption_trend || '—'}</Badge>
        </div>

        <Button className="w-full" onClick={() => navigate('/market')}>
          <ArrowRight size={16} className="mr-2" />
          View Full Market Analysis
        </Button>
      </CardContent>
    </Card>
  )
}
