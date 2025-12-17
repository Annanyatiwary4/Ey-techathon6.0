import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MarketChart({ market }) {
  const navigate = useNavigate()
  const feasibility = Math.round((market?.metrics?.commercial_feasibility ?? 0) * 100)
  const sparkline = (market?.yearly_totals ?? []).map((point) => ({
    year: point.year,
    value: point.value
  }))
  const fallbackSegments = (market?.markets ?? []).map((entry, index) => ({
    label: entry.disease || `Segment ${index + 1}`,
    adoption: entry.adoption_trend || 'Moderate'
  }))
  const topRegion = market?.region_trends?.[0]
  const currencyUnit = market?.currency_unit || 'USD B'
  const latestPoint = sparkline.length > 0 ? sparkline[sparkline.length - 1] : null

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

        {sparkline.length > 1 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={sparkline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `${value} ${currencyUnit}`} />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} name="Global revenue" />
            </LineChart>
          </ResponsiveContainer>
        ) : fallbackSegments.length > 0 ? (
          <div className="space-y-2">
            {fallbackSegments.slice(0, 3).map((segment, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{segment.label}</span>
                <Badge variant="outline">{segment.adoption}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No market segments detected for this query.</div>
        )}

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <div>
            <div className="text-xs uppercase text-gray-500">Commercial feasibility</div>
            <div className="text-2xl font-bold text-blue-600">{feasibility}<span className="text-base font-semibold">%</span></div>
          </div>
          {latestPoint ? (
            <div className="text-right">
              <div className="text-xs uppercase text-gray-500">Latest revenue</div>
              <div className="text-sm font-semibold text-gray-800">{latestPoint.value} {currencyUnit}</div>
              <div className="text-xs text-gray-500">{latestPoint.year}</div>
            </div>
          ) : (
            <Badge variant="outline">{market?.markets?.[0]?.adoption_trend || '—'}</Badge>
          )}
        </div>

        {topRegion && (
          <div className="p-3 border rounded bg-white">
            <div className="text-xs uppercase text-gray-500">Top growth region</div>
            <div className="text-sm font-semibold text-gray-900">{topRegion.region}</div>
            <p className="text-xs text-gray-500">{(topRegion.cagr * 100).toFixed(1)}% CAGR • {topRegion.notes}</p>
          </div>
        )}

        <Button className="w-full" onClick={() => navigate('/market')}>
          <ArrowRight size={16} className="mr-2" />
          View Full Market Analysis
        </Button>
      </CardContent>
    </Card>
  )
}
