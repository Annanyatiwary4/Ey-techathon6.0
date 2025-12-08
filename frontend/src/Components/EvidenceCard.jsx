import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function EvidenceCard() {
  const navigate = useNavigate()

  const evidencePreview = [
    { term: 'Anti-inflammatory effect', summary: 'Shown in multiple preclinical studies...' },
    { term: 'Reduces insulin resistance', summary: 'Observed in cohort studies...' }
  ]

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>🧪</span>
          <span>Scientific Evidence</span>
          <Badge variant="secondary" className="ml-auto">12 Articles</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2 mb-3">
          <div className="text-sm font-medium text-gray-700">Key Findings (Preview):</div>
          {evidencePreview.map((e, i) => (
            <div key={i} className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">{e.term}</Badge>
              <span className="text-sm text-gray-600">{e.summary}</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 mb-3">
          Source: PubMed Database
        </div>

        <Button 
          className="w-full" 
          onClick={() => navigate('/evidence')}>
          <ArrowRight size={16} className="mr-2" />
          View All Evidence & Sources
        </Button>
      </CardContent>
    </Card>
  )
}
