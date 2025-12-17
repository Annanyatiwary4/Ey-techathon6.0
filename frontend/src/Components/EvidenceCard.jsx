import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function EvidenceCard({ research }) {
  const navigate = useNavigate()
  const positives = research?.positive_evidence ?? []
  const negatives = research?.negative_evidence ?? []
  const preview = positives.slice(0, 3)
  const totalArticles = research?.metrics?.total_papers ?? positives.length + negatives.length

  const getEvidenceUrl = (item) => {
    if (item?.url) return item.url
    if (item?.title) {
      return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(item.title)}`
    }
    return null
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-purple-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>🧪</span>
          <span>Scientific Evidence</span>
          <Badge variant="secondary" className="ml-auto">
            {totalArticles} Articles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-gray-600">
          {research?.summary || 'Run an analysis to view PubMed-backed evidence summaries.'}
        </p>

        {preview.length === 0 ? (
          <div className="text-sm text-gray-500">
            No positive evidence was returned for this molecule.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Key Findings (Preview):</div>
            {preview.map((item, index) => (
              <div key={index} className="border rounded-md p-3 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {item.disease || 'Indication'}
                  </Badge>
                  {item.year && (
                    <span className="text-xs text-gray-500">{item.year}</span>
                  )}
                </div>
                <div className="font-semibold text-sm">{item.title}</div>
                <p className="text-xs text-gray-500">{item.journal}</p>
                {getEvidenceUrl(item) && (
                  <Button variant="link" size="sm" className="px-0" asChild>
                    <a href={getEvidenceUrl(item)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-purple-700">
                      <ExternalLink size={14} className="mr-1" />
                      View PubMed record
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {negatives.length > 0 && (
          <div className="text-xs text-red-600">
            ⚠️ {negatives.length} study{negatives.length > 1 ? 'ies' : ''} reported negative outcomes
          </div>
        )}

        <Button className="w-full" onClick={() => navigate('/evidence')}>
          <ArrowRight size={16} className="mr-2" />
          View All Evidence & Sources
        </Button>
      </CardContent>
    </Card>
  )
}
