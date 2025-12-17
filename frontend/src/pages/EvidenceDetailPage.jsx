import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, ExternalLink, Download } from 'lucide-react'
import { useResultStore } from '@/states/useResultStore'

export default function EvidenceDetailPage() {
  const navigate = useNavigate()
  const { drug, disease } = useResultStore((s) => s.query)
  const analysis = useResultStore((s) => s.analysis)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const research = analysis?.agents?.research
  const allEvidence = useMemo(() => {
    if (!research) return []
    const positive = (research.positive_evidence || []).map((item, idx) => ({
      ...item,
      id: `pos-${idx}`,
      sentiment: 'positive'
    }))
    const negative = (research.negative_evidence || []).map((item, idx) => ({
      ...item,
      id: `neg-${idx}`,
      sentiment: 'negative'
    }))
    return [...positive, ...negative]
  }, [research])

  const filteredEvidence = allEvidence.filter(e => {
    const matchesSearch = searchTerm === '' || 
      (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.disease || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'positive' && e.sentiment === 'positive') ||
      (filterType === 'negative' && e.sentiment === 'negative')
    
    return matchesSearch && matchesFilter
  })

  const handleExportTXT = () => {
    const content = filteredEvidence.map((e, idx) => (
      `${idx + 1}. ${e.title || 'Untitled study'}\n` +
      `Disease: ${e.disease || 'Unknown'}\n` +
      `Journal: ${e.journal || 'N/A'} (${e.year || 'N/A'})\n` +
      `Disposition: ${e.sentiment === 'positive' ? 'Positive signal' : 'Negative signal'}\n` +
      (e.reason ? `Notes: ${e.reason}\n` : '') +
      `URL: ${e.url || 'N/A'}\n`
    )).join('\n---\n\n') || 'No evidence available.'
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evidence-${drug || disease}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Scientific Evidence</h1>
              <p className="text-sm text-gray-600">
                {drug && disease && `${drug} → ${disease}`}
                {drug && !disease && `Drug: ${drug}`}
                {!drug && disease && `Disease: ${disease}`}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by title, authors, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white">
              <option value="all">All Evidence</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative Only</option>
            </select>
            <Button onClick={handleExportTXT}>
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {research ? `Found ${filteredEvidence.length} Evidence Articles` : 'Run an analysis to populate evidence'}
              </span>
              <Badge variant="secondary">PubMed</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvidence.length > 0 ? (
              <div className="space-y-4">
                {filteredEvidence.map((evidence) => (
                  <div key={evidence.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={evidence.sentiment === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {evidence.sentiment === 'positive' ? 'Positive' : 'Negative'}
                          </Badge>
                          <span className="text-xs text-gray-500">{evidence.disease || 'Unknown indication'}</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{evidence.title || 'Untitled study'}</h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {evidence.journal || 'Journal not provided'} {evidence.year && `• ${evidence.year}`}
                        </p>
                        {evidence.reason && (
                          <p className="text-sm text-gray-600">{evidence.reason}</p>
                        )}
                      </div>

                      {evidence.url && (
                        <Button size="sm" asChild>
                          <a href={evidence.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} className="mr-1" />
                            Source
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p>No evidence found. Run a live analysis first or adjust your search filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
