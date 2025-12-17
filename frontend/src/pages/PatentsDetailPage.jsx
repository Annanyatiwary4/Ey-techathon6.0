import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, ExternalLink, AlertTriangle } from 'lucide-react'
import { useResultStore } from '@/states/useResultStore'

export default function PatentsDetailPage() {
  const navigate = useNavigate()
  const { drug, disease } = useResultStore((s) => s.query)
  const analysis = useResultStore((s) => s.analysis)
  const patents = analysis?.agents?.patents
  const metrics = patents?.metrics || {}
  const active = patents?.active_patents || []
  const expired = patents?.expired_patents || []
  const conflicts = patents?.ip_conflicts || []

  const handleExport = () => {
    if (!patents) return

    const content = `PATENT LANDSCAPE SUMMARY\nDrug: ${drug || 'N/A'}\nDisease: ${disease || 'N/A'}\nRisk Level: ${metrics.ip_risk_level || 'Unknown'}\n\nSUMMARY\n${patents.summary || 'No insight'}\n\nACTIVE PATENTS\n${active.join('\n') || 'None'}\n\nEXPIRED / CLASS NOTES\n${expired.join('\n') || 'None'}\n\nCONFLICTS\n${conflicts.map((c) => `${c.issue} - ${c.competitor} (${c.url || 'N/A'})`).join('\n') || 'None'}\n`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patent-landscape-${drug || disease || 'analysis'}.txt`
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
          <div>
            <h1 className="text-2xl font-bold">Patent Landscape Analysis</h1>
            <p className="text-sm text-gray-600">
              {drug && disease && `${drug} → ${disease}`}
              {drug && !disease && `Drug: ${drug}`}
              {!drug && disease && `Disease: ${disease}`}
            </p>
          </div>
          <div className="ml-auto">
            <Button onClick={handleExport} disabled={!patents}>
              <Download size={16} className="mr-2" />
              Export Summary
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {patents ? (
              <p className="text-sm text-gray-700">{patents.summary}</p>
            ) : (
              <p className="text-sm text-gray-500">Run a live analysis to populate patent intelligence.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-xs uppercase text-gray-500 mb-1">Patent count</div>
              <div className="text-3xl font-bold text-blue-600">{metrics.patent_count || '—'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-xs uppercase text-gray-500 mb-1">IP risk level</div>
              <Badge className="bg-orange-100 text-orange-700">
                {metrics.ip_risk_level || 'Unknown'}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-xs uppercase text-gray-500 mb-1">Conflict signals</div>
              <div className="text-3xl font-bold text-red-600">{conflicts.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Risk Assessment</h3>
              <p className="text-sm text-gray-700">
                {patents ? `IP risk flagged as ${metrics.ip_risk_level || 'Unknown'}.` : 'Awaiting analysis.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Active claims</h4>
              {active.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {active.map((item, idx) => (
                    <li key={`active-${idx}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No active patents detected.</p>
              )}
            </section>

            <section>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Expired / class-based notes</h4>
              {expired.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {expired.map((item, idx) => (
                    <li key={`expired-${idx}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No expired coverage notes provided.</p>
              )}
            </section>

            <section>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Potential conflicts</h4>
              {conflicts.length > 0 ? (
                <div className="space-y-2">
                  {conflicts.map((conflict, idx) => (
                    <div key={`conflict-${idx}`} className="p-3 border rounded-md">
                      <div className="font-medium text-sm">{conflict.issue}</div>
                      <p className="text-xs text-gray-500">Competitor: {conflict.competitor}</p>
                      {conflict.url && (
                        <Button variant="link" size="sm" className="px-0" asChild>
                          <a href={conflict.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} className="mr-1" />
                            View reference
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No IP conflicts reported.</p>
              )}
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
