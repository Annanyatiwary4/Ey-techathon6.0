import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PatentCard({ patents }) {
  const navigate = useNavigate()
  const metrics = patents?.metrics ?? {}
  const active = patents?.active_patents ?? []
  const expired = patents?.expired_patents ?? []
  const entries = patents?.detailed_entries ?? []
  const topEntries = entries.slice(0, 2)

  const getPatentUrl = (entry) => {
    if (entry?.url) return entry.url
    if (entry?.number) {
      const q = encodeURIComponent(entry.number)
      return `https://patents.google.com/?q=${q}`
    }
    if (entry?.title) {
      const q = encodeURIComponent(entry.title)
      return `https://patents.google.com/?q=${q}`
    }
    return null
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-orange-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>📑</span>
          <span>Patent Landscape</span>
          <Badge variant="secondary" className="ml-auto">
            {metrics.patent_count || active.length || '—'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-gray-600">
          {patents?.summary || 'Patent analysis will be displayed after the agent run completes.'}
        </p>

        {patents?.success_story && (
          <div className="p-3 border-l-4 border-orange-400 bg-orange-50 rounded text-xs text-orange-900">
            {patents.success_story}
          </div>
        )}

        {topEntries.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs uppercase text-gray-500">Spotlight patents</div>
            {topEntries.map((entry, index) => (
              <div key={index} className="p-3 bg-white border rounded space-y-1">
                <div className="text-sm font-semibold text-gray-900">{entry.title}</div>
                <div className="text-xs text-gray-500">
                  {entry.number}
                  {entry.date && <span> • {entry.date}</span>}
                </div>
                {entry.assignee && <p className="text-xs text-gray-500">Assignee: {entry.assignee}</p>}
                <p className="text-xs text-gray-600">{entry.focus}</p>
                {getPatentUrl(entry) && (
                  <Button variant="link" size="sm" className="px-0" asChild>
                    <a href={getPatentUrl(entry)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-orange-700">
                      <ExternalLink size={14} className="mr-1" />
                      View patent filing
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">IP risk level</span>
            <Badge className="bg-yellow-100 text-yellow-700">
              {metrics.ip_risk_level || 'Unknown'}
            </Badge>
          </div>
          {active.length > 0 && (
            <div>
              <div className="text-xs uppercase text-gray-500 mb-1">Active claims</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {active.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {expired.length > 0 && (
            <div>
              <div className="text-xs uppercase text-gray-500 mb-1">Expired / class-based</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {expired.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button className="w-full" onClick={() => navigate('/patents')}>
          <ArrowRight size={16} className="mr-2" />
          View All Patents & Analysis
        </Button>
      </CardContent>
    </Card>
  )
}
