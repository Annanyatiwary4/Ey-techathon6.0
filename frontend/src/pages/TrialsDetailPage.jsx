import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { ArrowLeft, Search, ExternalLink, Download } from 'lucide-react'
import { useResultStore } from '@/states/useResultStore'

export default function TrialsDetailPage() {
  const navigate = useNavigate()
  const drug = useResultStore(s => s.drug)
  const disease = useResultStore(s => s.disease)
  const [searchTerm, setSearchTerm] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Extended dummy data - full list of clinical trials
  const allTrials = [
    {
      id: 1,
      studyId: 'NCT05234567',
      title: 'Efficacy and Safety Study in Type 2 Diabetes Patients',
      phase: 'Phase III',
      status: 'Recruiting',
      sponsor: 'Johns Hopkins University',
      location: 'Multi-center (USA)',
      enrollment: 450,
      startDate: '2024-01-15',
      completionDate: '2026-12-30',
      url: 'https://clinicaltrials.gov/study/NCT05234567',
      primaryOutcome: 'Change in HbA1c from baseline',
      conditions: ['Type 2 Diabetes Mellitus']
    },
    {
      id: 2,
      studyId: 'NCT05345678',
      title: 'Comparative Effectiveness Trial vs Standard Therapy',
      phase: 'Phase III',
      status: 'Active, not recruiting',
      sponsor: 'Mayo Clinic',
      location: 'USA, Canada',
      enrollment: 620,
      startDate: '2023-06-20',
      completionDate: '2025-11-15',
      url: 'https://clinicaltrials.gov/study/NCT05345678',
      primaryOutcome: 'Cardiovascular events reduction',
      conditions: ['Type 2 Diabetes', 'Cardiovascular Disease']
    },
    {
      id: 3,
      studyId: 'NCT05456789',
      title: 'Long-term Safety and Tolerability Study',
      phase: 'Phase IV',
      status: 'Recruiting',
      sponsor: 'Stanford University',
      location: 'International (15 countries)',
      enrollment: 1200,
      startDate: '2024-03-01',
      completionDate: '2028-02-28',
      url: 'https://clinicaltrials.gov/study/NCT05456789',
      primaryOutcome: 'Adverse event incidence',
      conditions: ['Type 2 Diabetes Mellitus']
    },
    {
      id: 4,
      studyId: 'NCT05567890',
      title: 'Dose-Finding Study in Treatment-Naive Patients',
      phase: 'Phase II',
      status: 'Recruiting',
      sponsor: 'University of California',
      location: 'USA (California, Texas, Florida)',
      enrollment: 180,
      startDate: '2024-05-10',
      completionDate: '2025-08-30',
      url: 'https://clinicaltrials.gov/study/NCT05567890',
      primaryOutcome: 'Optimal dose determination',
      conditions: ['Type 2 Diabetes']
    },
    {
      id: 5,
      studyId: 'NCT05678901',
      title: 'Pediatric Safety and Efficacy Trial',
      phase: 'Phase II',
      status: 'Active, not recruiting',
      sponsor: 'Boston Children\'s Hospital',
      location: 'USA, Europe',
      enrollment: 95,
      startDate: '2023-09-15',
      completionDate: '2025-06-30',
      url: 'https://clinicaltrials.gov/study/NCT05678901',
      primaryOutcome: 'Glycemic control in pediatric population',
      conditions: ['Type 1 Diabetes', 'Type 2 Diabetes']
    },
    {
      id: 6,
      studyId: 'NCT05789012',
      title: 'Combination Therapy Study with Insulin',
      phase: 'Phase III',
      status: 'Recruiting',
      sponsor: 'Cleveland Clinic',
      location: 'USA, UK, Germany',
      enrollment: 380,
      startDate: '2024-02-01',
      completionDate: '2026-07-31',
      url: 'https://clinicaltrials.gov/study/NCT05789012',
      primaryOutcome: 'Combined therapy efficacy assessment',
      conditions: ['Type 2 Diabetes Mellitus']
    },
    {
      id: 7,
      studyId: 'NCT05890123',
      title: 'Renal Outcomes in Diabetic Nephropathy',
      phase: 'Phase III',
      status: 'Recruiting',
      sponsor: 'NIH/NIDDK',
      location: 'Multi-center (Global)',
      enrollment: 890,
      startDate: '2023-11-01',
      completionDate: '2027-10-31',
      url: 'https://clinicaltrials.gov/study/NCT05890123',
      primaryOutcome: 'Progression to end-stage renal disease',
      conditions: ['Diabetic Nephropathy', 'Type 2 Diabetes']
    },
    {
      id: 8,
      studyId: 'NCT05901234',
      title: 'Biomarker-Guided Treatment Strategy',
      phase: 'Phase II',
      status: 'Not yet recruiting',
      sponsor: 'Duke University',
      location: 'USA (North Carolina)',
      enrollment: 150,
      startDate: '2025-01-15',
      completionDate: '2026-12-31',
      url: 'https://clinicaltrials.gov/study/NCT05901234',
      primaryOutcome: 'Treatment response based on biomarkers',
      conditions: ['Type 2 Diabetes']
    }
  ]

  const filteredTrials = allTrials.filter(t => {
    const matchesSearch = searchTerm === '' || 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.studyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sponsor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPhase = phaseFilter === 'all' || t.phase === phaseFilter
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    
    return matchesSearch && matchesPhase && matchesStatus
  })

  const handleExportCSV = () => {
    const csv = [
      'Study ID,Title,Phase,Status,Sponsor,Enrollment,Start Date,Completion Date,URL',
      ...filteredTrials.map(t => 
        `"${t.studyId}","${t.title}","${t.phase}","${t.status}","${t.sponsor}",${t.enrollment},"${t.startDate}","${t.completionDate}","${t.url}"`
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clinical-trials-${drug || disease}-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status) => {
    if (status.includes('Recruiting')) return 'bg-green-100 text-green-700'
    if (status.includes('Active')) return 'bg-blue-100 text-blue-700'
    if (status.includes('Completed')) return 'bg-gray-100 text-gray-700'
    if (status.includes('Not yet')) return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
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
              <h1 className="text-2xl font-bold">Clinical Trials</h1>
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
                placeholder="Search by study ID, title, or sponsor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white">
              <option value="all">All Phases</option>
              <option value="Phase I">Phase I</option>
              <option value="Phase II">Phase II</option>
              <option value="Phase III">Phase III</option>
              <option value="Phase IV">Phase IV</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white">
              <option value="all">All Status</option>
              <option value="Recruiting">Recruiting</option>
              <option value="Active, not recruiting">Active</option>
              <option value="Completed">Completed</option>
              <option value="Not yet recruiting">Not Yet Recruiting</option>
            </select>
            <Button onClick={handleExportCSV}>
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Found {filteredTrials.length} Clinical Trials</span>
              <Badge variant="secondary">ClinicalTrials.gov</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Study ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrials.map((trial) => (
                    <TableRow key={trial.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm font-medium text-blue-600">
                        {trial.studyId}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-sm">{trial.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{trial.location}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{trial.phase}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(trial.status)}`}>
                          {trial.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{trial.sponsor}</TableCell>
                      <TableCell className="text-center font-medium">{trial.enrollment}</TableCell>
                      <TableCell className="text-xs text-gray-600">
                        <div>Start: {trial.startDate}</div>
                        <div>End: {trial.completionDate}</div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" asChild>
                          <a href={trial.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} className="mr-1" />
                            View
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTrials.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p>No trials found matching your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
