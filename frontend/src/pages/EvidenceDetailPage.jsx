import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { ArrowLeft, Search, ExternalLink, Download, Filter } from 'lucide-react'
import { useResultStore } from '@/states/useResultStore'

export default function EvidenceDetailPage() {
  const navigate = useNavigate()
  const drug = useResultStore(s => s.drug)
  const disease = useResultStore(s => s.disease)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Extended dummy data - full list of evidence
  const allEvidence = [
    {
      id: 1,
      title: 'Anti-inflammatory Effects in Type 2 Diabetes',
      authors: 'Smith J., et al.',
      journal: 'Nature Medicine',
      year: 2023,
      pmid: 'PMID:37845123',
      url: 'https://pubmed.ncbi.nlm.nih.gov/37845123/',
      abstract: 'Study demonstrates significant anti-inflammatory properties when applied to diabetes treatment...',
      citations: 245,
      tags: ['Anti-inflammatory', 'Clinical Trial', 'High Impact']
    },
    {
      id: 2,
      title: 'Insulin Resistance Reduction Through Novel Pathway',
      authors: 'Johnson M., et al.',
      journal: 'The Lancet',
      year: 2023,
      pmid: 'PMID:38012456',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38012456/',
      abstract: 'Meta-analysis of 12 cohort studies showing reduction in insulin resistance markers...',
      citations: 189,
      tags: ['Insulin Resistance', 'Meta-Analysis', 'High Impact']
    },
    {
      id: 3,
      title: 'Neuroprotective Properties in Diabetic Complications',
      authors: 'Chen L., et al.',
      journal: 'Cell Metabolism',
      year: 2024,
      pmid: 'PMID:38234567',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38234567/',
      abstract: 'Emerging evidence from in-vitro and in-vivo models demonstrating neuroprotection...',
      citations: 92,
      tags: ['Neuroprotection', 'Preclinical', 'Emerging']
    },
    {
      id: 4,
      title: 'Glycemic Control Enhancement in Multi-center Study',
      authors: 'Williams R., et al.',
      journal: 'Diabetes Care',
      year: 2024,
      pmid: 'PMID:38345678',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38345678/',
      abstract: 'Randomized controlled trial across 15 centers showing improved HbA1c levels...',
      citations: 156,
      tags: ['Glycemic Control', 'RCT', 'Multi-center']
    },
    {
      id: 5,
      title: 'Cardiovascular Risk Reduction in Diabetic Patients',
      authors: 'Garcia A., et al.',
      journal: 'JAMA Cardiology',
      year: 2023,
      pmid: 'PMID:37956789',
      url: 'https://pubmed.ncbi.nlm.nih.gov/37956789/',
      abstract: 'Long-term cohort study demonstrating reduced cardiovascular events...',
      citations: 312,
      tags: ['Cardiovascular', 'Cohort Study', 'Long-term']
    },
    {
      id: 6,
      title: 'Mechanism of Action: AMPK Pathway Activation',
      authors: 'Patel S., et al.',
      journal: 'Science Translational Medicine',
      year: 2024,
      pmid: 'PMID:38456789',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38456789/',
      abstract: 'Detailed molecular mechanism study revealing AMPK pathway activation...',
      citations: 178,
      tags: ['Mechanism', 'Molecular Biology', 'AMPK']
    },
    {
      id: 7,
      title: 'Safety Profile Analysis Across 10 Years',
      authors: 'Thompson K., et al.',
      journal: 'Drug Safety',
      year: 2023,
      pmid: 'PMID:38067890',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38067890/',
      abstract: 'Comprehensive safety analysis from post-marketing surveillance data...',
      citations: 134,
      tags: ['Safety', 'Pharmacovigilance', 'Real-world Data']
    },
    {
      id: 8,
      title: 'Dose-Response Relationship in T2D Management',
      authors: 'Lee H., et al.',
      journal: 'Clinical Pharmacology & Therapeutics',
      year: 2024,
      pmid: 'PMID:38178901',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38178901/',
      abstract: 'Phase II study establishing optimal dosing regimen for diabetes management...',
      citations: 87,
      tags: ['Dosing', 'Phase II', 'Pharmacokinetics']
    },
    {
      id: 9,
      title: 'Comparative Effectiveness vs. Standard Therapy',
      authors: 'Brown T., et al.',
      journal: 'Annals of Internal Medicine',
      year: 2023,
      pmid: 'PMID:38289012',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38289012/',
      abstract: 'Head-to-head comparison showing superior efficacy compared to standard treatment...',
      citations: 267,
      tags: ['Comparative', 'Efficacy', 'Superior']
    },
    {
      id: 10,
      title: 'Patient-Reported Outcomes and Quality of Life',
      authors: 'Martinez C., et al.',
      journal: 'Health and Quality of Life Outcomes',
      year: 2024,
      pmid: 'PMID:38390123',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38390123/',
      abstract: 'Patient-centered study showing significant improvements in quality of life metrics...',
      citations: 95,
      tags: ['QoL', 'Patient-Reported', 'Outcomes']
    },
    {
      id: 11,
      title: 'Biomarker Discovery for Treatment Response',
      authors: 'Anderson M., et al.',
      journal: 'Biomarkers in Medicine',
      year: 2024,
      pmid: 'PMID:38401234',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38401234/',
      abstract: 'Identification of predictive biomarkers for treatment response...',
      citations: 62,
      tags: ['Biomarkers', 'Precision Medicine', 'Predictive']
    },
    {
      id: 12,
      title: 'Economic Analysis: Cost-Effectiveness Study',
      authors: 'Wilson D., et al.',
      journal: 'PharmacoEconomics',
      year: 2023,
      pmid: 'PMID:38512345',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38512345/',
      abstract: 'Cost-effectiveness analysis demonstrating favorable economic profile...',
      citations: 118,
      tags: ['Economics', 'Cost-Effectiveness', 'QALY']
    }
  ]

  const filteredEvidence = allEvidence.filter(e => {
    const matchesSearch = searchTerm === '' || 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'high-impact' && e.citations > 200) ||
      (filterType === 'recent' && e.year === 2024) ||
      (filterType === 'clinical' && e.tags.some(tag => tag.includes('Clinical') || tag.includes('RCT')))
    
    return matchesSearch && matchesFilter
  })

  const handleExportTXT = () => {
    const content = filteredEvidence.map(e => 
      `${e.title}\nAuthors: ${e.authors}\nJournal: ${e.journal} (${e.year})\nPubMed: ${e.url}\nAbstract: ${e.abstract}\nCitations: ${e.citations}\nTags: ${e.tags.join(', ')}\n\n`
    ).join('---\n\n')
    
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
              <option value="high-impact">High Impact (200+ citations)</option>
              <option value="recent">Recent (2024)</option>
              <option value="clinical">Clinical Studies</option>
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
              <span>Found {filteredEvidence.length} Evidence Articles</span>
              <Badge variant="secondary">PubMed Database</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvidence.map((evidence) => (
                <div key={evidence.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{evidence.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{evidence.abstract}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{evidence.authors}</span>
                        <span>•</span>
                        <span className="font-medium">{evidence.journal}</span>
                        <span>•</span>
                        <span>{evidence.year}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          📚 {evidence.citations} citations
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {evidence.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" asChild>
                        <a href={evidence.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={14} className="mr-1" />
                          PubMed
                        </a>
                      </Button>
                      <div className="text-xs text-gray-500 text-center">
                        {evidence.pmid}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredEvidence.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p>No evidence found matching your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
