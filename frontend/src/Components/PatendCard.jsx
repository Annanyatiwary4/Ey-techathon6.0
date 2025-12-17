import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PatentCard({ patents }) {
  const navigate = useNavigate()
  const metrics = patents?.metrics ?? {}
  const active = patents?.active_patents ?? []
  const expired = patents?.expired_patents ?? []

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
