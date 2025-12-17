import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download } from 'lucide-react'
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { useResultStore } from '@/states/useResultStore'

export default function MarketDetailPage() {
  const navigate = useNavigate()
  const query = useResultStore((s) => s.query) || {}
  const { drug, disease } = query
  const analysis = useResultStore((s) => s.analysis)
  const market = analysis?.agents?.market
  const metrics = market?.metrics || {}
  const regionTrends = market?.region_trends || []
  const yearlyTotals = market?.yearly_totals || []
  const currencyUnit = market?.currency_unit || 'USD billions'
  const successStory = market?.success_story
  const sources = market?.sources || []

  const regionYears = Array.from(
    new Set(
      regionTrends.flatMap(region => (region.series || []).map(point => point.year))
    )
  ).sort((a, b) => a - b)

  const regionChartData = regionYears.map((year) => {
    const row = { year }
    regionTrends.forEach((region) => {
      const point = (region.series || []).find((p) => p.year === year)
      row[region.region] = point?.value ?? null
    })
    return row
  })

  const latestTotal = yearlyTotals.length > 0 ? yearlyTotals[yearlyTotals.length - 1] : null

  const handleExport = () => {
    if (!market) return
    const regionLines = regionTrends.map((region) => {
      const lastPoint = region.series?.[region.series.length - 1]
      return `${region.region}: CAGR ${(region.cagr * 100).toFixed(1)}% → ${lastPoint?.value ?? 'N/A'} ${currencyUnit} in ${lastPoint?.year ?? 'n.d.'}`
    }).join('\n')
    const yearlyLines = yearlyTotals.map((point) => `${point.year}: ${point.value} ${currencyUnit}`).join('\n')
    const content = `MARKET ANALYSIS\nDrug: ${drug || 'N/A'}\nDisease: ${disease || 'N/A'}\nCommercial feasibility: ${metrics.commercial_feasibility || 0}\n\nSUMMARY\n${market.summary || ''}\n\nREGION TRENDS\n${regionLines}\n\nGLOBAL REVENUE\n${yearlyLines}`
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
              <div className="text-xs uppercase text-gray-500 mb-1">Regions tracked</div>
              <div className="text-3xl font-bold text-green-600">{regionTrends.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-xs uppercase text-gray-500 mb-1">Latest global revenue</div>
              <div className="text-3xl font-bold text-indigo-600">
                {latestTotal ? `${latestTotal.value} ${currencyUnit}` : '—'}
              </div>
              {latestTotal && <p className="text-xs text-gray-500 mt-1">{latestTotal.year}</p>}
            </CardContent>
          </Card>
        </div>

        {successStory && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <h3 className="text-xs uppercase text-blue-900 tracking-wide mb-2">Repurposing success</h3>
              <p className="text-sm text-gray-700">{successStory}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Regional Adoption Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {regionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={regionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: currencyUnit, angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip formatter={(value) => `${value} ${currencyUnit}`} />
                  <Legend />
                  {regionTrends.map((region, idx) => (
                    <Line
                      key={region.region}
                      type="monotone"
                      dataKey={region.region}
                      stroke={['#2563eb', '#f97316', '#10b981', '#a855f7'][idx % 4]}
                      strokeWidth={2}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">No region-level data was returned for this query.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Global Revenue Trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            {yearlyTotals.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={yearlyTotals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: currencyUnit, angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip formatter={(value) => `${value} ${currencyUnit}`} />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">Global revenue timeline unavailable.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Commentary</CardTitle>
          </CardHeader>
          <CardContent>
            {regionTrends.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2">Region</th>
                      <th className="py-2">CAGR</th>
                      <th className="py-2">Latest value</th>
                      <th className="py-2">Narrative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionTrends.map((region, idx) => {
                      const lastPoint = region.series?.[region.series.length - 1]
                      return (
                        <tr key={`region-row-${idx}`} className="border-t">
                          <td className="py-2 font-medium text-gray-900">{region.region}</td>
                          <td className="py-2">{(region.cagr * 100).toFixed(1)}%</td>
                          <td className="py-2">{lastPoint ? `${lastPoint.value} ${currencyUnit} (${lastPoint.year})` : '—'}</td>
                          <td className="py-2 text-gray-600">{region.notes}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No regional commentary available.</p>
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

        {sources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {sources.map((item, idx) => (
                  <li key={`market-source-${idx}`}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
