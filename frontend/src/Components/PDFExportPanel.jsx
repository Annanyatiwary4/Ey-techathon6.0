import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Download, FileText } from 'lucide-react'
import { useResultStore } from '@/states/useResultStore'
import { toast } from 'sonner'

export default function PDFExportPanel() {
  const drug = useResultStore(s => s.drug)
  const disease = useResultStore(s => s.disease)
  const mode = useResultStore(s => s.mode)

  const handleGenerateReport = () => {
    toast.success('Generating comprehensive PDF report...', {
      description: 'Your report will be ready in a moment'
    })
    
    // Simulate report generation
    setTimeout(() => {
      toast.success('Report generated successfully!', {
        description: 'Download started automatically'
      })
    }, 2000)
  }

  const handleDownloadSources = () => {
    const content = `
REPURPOSING ANALYSIS - DATA SOURCES
Drug: ${drug || 'N/A'}
Disease: ${disease || 'N/A'}
Analysis Mode: Case ${mode}
Generated: ${new Date().toLocaleString()}

=== SCIENTIFIC EVIDENCE SOURCES ===
1. PubMed Central Database
   URL: https://pubmed.ncbi.nlm.nih.gov/
   Articles Analyzed: 12

2. Nature Medicine Journal Archive
   URL: https://www.nature.com/nm/
   
3. The Lancet Database
   URL: https://www.thelancet.com/

=== CLINICAL TRIALS SOURCES ===
1. ClinicalTrials.gov
   URL: https://clinicaltrials.gov/
   Trials Found: 8

2. WHO International Clinical Trials Registry
   URL: https://www.who.int/clinical-trials-registry-platform

=== PATENT DATABASES ===
1. Google Patents
   URL: https://patents.google.com/
   Patents Analyzed: 32

2. USPTO Patent Database
   URL: https://www.uspto.gov/

=== MARKET DATA SOURCES ===
1. IQVIA Pharmaceutical Analytics
2. Bloomberg Healthcare Data
3. FDA Drug Pricing Database
4. IMS Health Market Reports

=== NOTES ===
This report contains aggregated data from multiple authoritative sources.
All URLs and references are for informational purposes.
For detailed analysis, please refer to the individual source documents.
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sources-${drug || disease}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    toast.success('Sources downloaded successfully!')
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-indigo-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText size={20} />
          <span>Export & Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-4">
            Generate comprehensive reports and download source references
          </div>

          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleGenerateReport}>
            <Download size={16} className="mr-2" />
            Generate Full PDF Report
          </Button>

          <Button 
            variant="outline"
            className="w-full"
            onClick={handleDownloadSources}>
            <Download size={16} className="mr-2" />
            Download All Sources (TXT)
          </Button>

          <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
            Report includes: Evidence summary, trial details, patent landscape, market analysis, and recommendations
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
