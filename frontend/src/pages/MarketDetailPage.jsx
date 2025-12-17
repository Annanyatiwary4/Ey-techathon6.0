import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download } from 'lucide-react'
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useResultStore } from '@/states/useResultStore'

const adoptionScore = (trend = 'Moderate') => {
  const normalized = trend.toLowerCase()
  if (normalized.includes('high')) return 80
  if (normalized.includes('low')) return 35
  return 55
}

export default function MarketDetailPage() {
  const navigate = useNavigate()
  const query = useResultStore((s) => s.query) || {}
  const { drug, disease } = query
  const analysis = useResultStore((s) => s.analysis)
  const market = analysis?.agents?.market
  const metrics = market?.metrics || {}

  const chartData = (market?.markets || []).map((segment, idx) => ({
    label: segment.disease || `Segment ${idx + 1}`,
    adoption: adoptionScore(segment.adoption_trend)
  }))

  const handleExport = () => {
    if (!market) return
    const content = `MARKET ANALYSIS\nDrug: ${drug || 'N/A'}\nDisease: ${disease || 'N/A'}\nCommercial feasibility: ${metrics.commercial_feasibility || 0}\n\n${market.summary || ''}\n\nSegments:\n${(market.markets || []).map((m, idx) => `${idx + 1}. ${m.disease || 'Segment'} - ${m.adoption_trend}`).join('\n')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `market-${drug || disease || 'analysis'}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}> 
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Market Trends & Analysis</h1>
            <p className="text-sm text-gray-600">
              {drug && disease && `${drug} → ${disease}`}
              {drug && !disease && `Drug: ${drug}`}
              {!drug && disease && `Disease: ${disease}`}
            </p>
          </div>
          <Button onClick={handleExport} disabled={!market}>
            <Download size={16} className="mr-2" />
            Export Summary
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              {market?.summary || 'Run a live analysis to populate market intelligence.'}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-xs uppercase text-gray-500 mb-1">Commercial feasibility</div>
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((metrics.commercial_feasibility || 0) * 100)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-xs uppercase text-gray-500 mb-1">Segments evaluated</div>
              <div className="text-3xl font-bold text-green-600">{chartData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-xs uppercase text-gray-500 mb-1">Primary trend</div>
              <Badge variant="secondary">{market?.markets?.[0]?.adoption_trend || '—'}</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Segment Adoption Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="adoption" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">No market segments were returned for this query.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Negative Signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(market?.negative_signals || []).length > 0 ? (
              market.negative_signals.map((signal, idx) => (
                <div key={idx} className="p-3 border rounded-md bg-red-50 text-sm text-red-700">
                  {signal.issue} — {signal.impact}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No commercial risks were highlighted.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
