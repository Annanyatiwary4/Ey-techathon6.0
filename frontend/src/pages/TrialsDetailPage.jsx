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
  const { drug, disease } = useResultStore((s) => s.query)
  const analysis = useResultStore((s) => s.analysis)
  const [searchTerm, setSearchTerm] = useState('')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const clinical = analysis?.agents?.clinical_trials
  const allTrials = clinical?.successful_trials || []

  const filteredTrials = allTrials.filter(t => {
    const matchesSearch = searchTerm === '' || 
      (t.trial_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.disease || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPhase = phaseFilter === 'all' || t.phase === phaseFilter
    const matchesStatus = statusFilter === 'all' || (t.status || '').toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesPhase && matchesStatus
  })

  const handleExportCSV = () => {
    const csv = [
      'Trial,Phase,Status,Disease,Outcome,URL',
      ...filteredTrials.map(t => 
        `"${t.trial_name}","${t.phase}","${t.status || 'N/A'}","${t.disease}","${t.evidence_note}","${t.url || ''}"`
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

  const getStatusColor = (status = '') => {
    const normalized = status.toLowerCase()
    if (normalized.includes('recruit')) return 'bg-green-100 text-green-700'
    if (normalized.includes('active')) return 'bg-blue-100 text-blue-700'
    if (normalized.includes('complete')) return 'bg-gray-100 text-gray-700'
    if (normalized.includes('not')) return 'bg-yellow-100 text-yellow-700'
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
              <option value="Active">Active</option>
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
              <span>
                {clinical ? `Found ${filteredTrials.length} Clinical Trials` : 'Run an analysis to populate trials'}
              </span>
              <Badge variant="secondary">ClinicalTrials.gov</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTrials.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trial</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Disease</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrials.map((trial, idx) => (
                      <TableRow key={`${trial.trial_name}-${idx}`} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-sm">{trial.trial_name}</div>
                          <div className="text-xs text-gray-500">{trial.evidence_note}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{trial.phase}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(trial.status || '')}`}>
                            {trial.status || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{trial.disease || '—'}</TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs">
                          {trial.evidence_note}
                        </TableCell>
                        <TableCell>
                          {trial.url ? (
                            <Button size="sm" variant="outline" asChild>
                              <a href={trial.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={14} className="mr-1" />
                                View
                              </a>
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p>No trials found. Run a live analysis first or adjust your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
