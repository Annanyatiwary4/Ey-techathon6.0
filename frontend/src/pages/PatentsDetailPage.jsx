import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, ExternalLink, Download, AlertTriangle } from 'lucide-react'
import { useResultStore } from '@/states/useResultStore'

export default function PatentsDetailPage() {
  const navigate = useNavigate()
  const drug = useResultStore(s => s.drug)
  const disease = useResultStore(s => s.disease)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Extended dummy data - full list of patents
  const allPatents = [
    {
      id: 1,
      patentNumber: 'US20230123456A1',
      title: 'Novel Formulation for Enhanced Bioavailability in Diabetes Treatment',
      holder: 'Johnson & Johnson',
      inventors: 'Smith J., Williams R., Chen L.',
      filingDate: '2021-03-15',
      publicationDate: '2023-05-20',
      expiryDate: '2041-03-15',
      status: 'Active',
      jurisdiction: 'United States',
      url: 'https://patents.google.com/patent/US20230123456A1',
      abstract: 'A pharmaceutical composition comprising an improved delivery mechanism for enhanced therapeutic efficacy...',
      claims: 23,
      citations: 12,
      familySize: 8
    },
    {
      id: 2,
      patentNumber: 'EP3845678B1',
      title: 'Method of Treatment for Type 2 Diabetes Using Novel Compound',
      holder: 'Pfizer Inc.',
      inventors: 'Anderson M., Garcia A.',
      filingDate: '2020-08-10',
      publicationDate: '2022-11-15',
      expiryDate: '2040-08-10',
      status: 'Active',
      jurisdiction: 'European Union',
      url: 'https://patents.google.com/patent/EP3845678B1',
      abstract: 'A method for treating metabolic disorders through a unique mechanism of action targeting insulin resistance...',
      claims: 18,
      citations: 8,
      familySize: 12
    },
    {
      id: 3,
      patentNumber: 'WO2024012345A1',
      title: 'Combination Therapy for Diabetic Complications',
      holder: 'Novo Nordisk A/S',
      inventors: 'Thompson K., Lee H., Patel S.',
      filingDate: '2022-06-20',
      publicationDate: '2024-01-25',
      expiryDate: '2042-06-20',
      status: 'Active',
      jurisdiction: 'International (PCT)',
      url: 'https://patents.google.com/patent/WO2024012345A1',
      abstract: 'A synergistic combination of therapeutic agents for comprehensive management of diabetic complications...',
      claims: 31,
      citations: 4,
      familySize: 15
    },
    {
      id: 4,
      patentNumber: 'US11234567B2',
      title: 'Sustained Release Formulation for Improved Patient Compliance',
      holder: 'Eli Lilly and Company',
      inventors: 'Martinez C., Brown T.',
      filingDate: '2019-04-05',
      publicationDate: '2022-01-18',
      expiryDate: '2039-04-05',
      status: 'Active',
      jurisdiction: 'United States',
      url: 'https://patents.google.com/patent/US11234567B2',
      abstract: 'An extended-release pharmaceutical formulation providing once-daily dosing for diabetes management...',
      claims: 15,
      citations: 19,
      familySize: 6
    },
    {
      id: 5,
      patentNumber: 'JP2023456789A',
      title: 'Pharmaceutical Composition with Enhanced Stability',
      holder: 'Takeda Pharmaceutical',
      inventors: 'Tanaka Y., Suzuki K.',
      filingDate: '2021-09-30',
      publicationDate: '2023-04-12',
      expiryDate: '2041-09-30',
      status: 'Active',
      jurisdiction: 'Japan',
      url: 'https://patents.google.com/patent/JP2023456789A',
      abstract: 'A stabilized pharmaceutical composition with improved shelf-life and reduced storage requirements...',
      claims: 12,
      citations: 6,
      familySize: 4
    },
    {
      id: 6,
      patentNumber: 'CN114567890A',
      title: 'Method for Synthesizing Active Pharmaceutical Ingredient',
      holder: 'Shanghai Pharmaceuticals',
      inventors: 'Wang X., Liu Y., Zhang M.',
      filingDate: '2020-11-15',
      publicationDate: '2022-05-20',
      expiryDate: '2040-11-15',
      status: 'Active',
      jurisdiction: 'China',
      url: 'https://patents.google.com/patent/CN114567890A',
      abstract: 'An improved synthetic route for cost-effective production of the active pharmaceutical ingredient...',
      claims: 9,
      citations: 15,
      familySize: 3
    },
    {
      id: 7,
      patentNumber: 'US10987654B2',
      title: 'Device and Method for Subcutaneous Administration',
      holder: 'Medtronic Inc.',
      inventors: 'Johnson M., Davis R.',
      filingDate: '2018-02-20',
      publicationDate: '2021-04-27',
      expiryDate: '2038-02-20',
      status: 'Active',
      jurisdiction: 'United States',
      url: 'https://patents.google.com/patent/US10987654B2',
      abstract: 'A delivery device optimized for patient-administered subcutaneous injection with safety features...',
      claims: 27,
      citations: 22,
      familySize: 9
    },
    {
      id: 8,
      patentNumber: 'EP3654321B1',
      title: 'Biomarker-Based Patient Selection Method',
      holder: 'Roche Diagnostics',
      inventors: 'Mueller H., Schmidt W.',
      filingDate: '2019-07-10',
      publicationDate: '2021-12-08',
      expiryDate: '2039-07-10',
      status: 'Active',
      jurisdiction: 'European Union',
      url: 'https://patents.google.com/patent/EP3654321B1',
      abstract: 'A diagnostic method for identifying patients most likely to benefit from specific therapeutic interventions...',
      claims: 14,
      citations: 11,
      familySize: 7
    },
    {
      id: 9,
      patentNumber: 'US20180234567A1',
      title: 'Crystalline Form with Improved Dissolution Properties',
      holder: 'AstraZeneca PLC',
      inventors: 'Wilson D., Taylor P.',
      filingDate: '2017-01-15',
      publicationDate: '2018-08-23',
      expiryDate: '2037-01-15',
      status: 'Expired',
      jurisdiction: 'United States',
      url: 'https://patents.google.com/patent/US20180234567A1',
      abstract: 'A novel crystalline polymorph exhibiting superior dissolution characteristics for enhanced absorption...',
      claims: 11,
      citations: 28,
      familySize: 5
    },
    {
      id: 10,
      patentNumber: 'WO2023098765A1',
      title: 'Nanoparticle-Based Delivery System',
      holder: 'Amgen Inc.',
      inventors: 'Anderson K., Roberts L.',
      filingDate: '2021-11-30',
      publicationDate: '2023-06-01',
      expiryDate: '2041-11-30',
      status: 'Pending',
      jurisdiction: 'International (PCT)',
      url: 'https://patents.google.com/patent/WO2023098765A1',
      abstract: 'A nanoparticle-based drug delivery system for targeted therapeutic delivery with reduced side effects...',
      claims: 19,
      citations: 2,
      familySize: 11
    }
  ]

  const filteredPatents = allPatents.filter(p => {
    const matchesSearch = searchTerm === '' || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.holder.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleExportCSV = () => {
    const csv = [
      'Patent Number,Title,Holder,Filing Date,Expiry Date,Status,Jurisdiction,URL',
      ...filteredPatents.map(p => 
        `"${p.patentNumber}","${p.title}","${p.holder}","${p.filingDate}","${p.expiryDate}","${p.status}","${p.jurisdiction}","${p.url}"`
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patents-${drug || disease}-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700'
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-700'
    if (status === 'Expired') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  const activePatents = allPatents.filter(p => p.status === 'Active').length
  const pendingPatents = allPatents.filter(p => p.status === 'Pending').length
  const expiredPatents = allPatents.filter(p => p.status === 'Expired').length

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
              <h1 className="text-2xl font-bold">Patent Landscape Analysis</h1>
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
                placeholder="Search by patent number, title, or holder..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{allPatents.length}</div>
                <div className="text-sm text-gray-600 mt-1">Total Patents</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{activePatents}</div>
                <div className="text-sm text-gray-600 mt-1">Active Patents</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{pendingPatents}</div>
                <div className="text-sm text-gray-600 mt-1">Pending Patents</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{expiredPatents}</div>
                <div className="text-sm text-gray-600 mt-1">Expired Patents</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-2">Patent Risk Assessment: Medium</h3>
                <p className="text-sm text-gray-700">
                  {activePatents} active patents held by major pharmaceutical companies. Primary holder: Johnson & Johnson. 
                  Patent protection remains strong until 2038-2042. Consider licensing strategies or wait for key patent expirations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Found {filteredPatents.length} Patents</span>
              <Badge variant="secondary">Google Patents</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatents.map((patent) => (
                <div key={patent.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <Badge className={getStatusColor(patent.status)}>{patent.status}</Badge>
                        <code className="text-sm font-mono text-blue-600">{patent.patentNumber}</code>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{patent.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{patent.abstract}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Holder:</span>
                          <span className="ml-2 font-medium">{patent.holder}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Inventors:</span>
                          <span className="ml-2">{patent.inventors}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Jurisdiction:</span>
                          <span className="ml-2">{patent.jurisdiction}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Filing Date:</span>
                          <span className="ml-2">{patent.filingDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Expiry Date:</span>
                          <span className="ml-2 font-medium">{patent.expiryDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Claims:</span>
                          <span className="ml-2">{patent.claims}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📚 {patent.citations} citations</span>
                        <span>•</span>
                        <span>👨‍👩‍👧‍👦 Family size: {patent.familySize}</span>
                      </div>
                    </div>

                    <Button size="sm" asChild>
                      <a href={patent.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} className="mr-1" />
                        View Patent
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p>No patents found matching your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
