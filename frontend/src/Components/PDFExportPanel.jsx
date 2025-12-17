import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Download, FileText } from 'lucide-react'
import { useResultStore } from '@/states/useResultStore'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

export default function PDFExportPanel() {
  const analysis = useResultStore((s) => s.analysis)
  const { drug, disease } = useResultStore((s) => s.query)
  const mode = useResultStore((s) => s.mode)

  const handleGenerateReport = () => {
    if (!analysis) {
      toast.info('Run a live analysis before generating a report.')
      return
    }

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const marginX = 48
      const pageHeight = doc.internal.pageSize.getHeight()
      let cursorY = 60

      const advance = (lines = 1) => {
        cursorY += lines * 18
        if (cursorY > pageHeight - 60) {
          doc.addPage()
          cursorY = 60
        }
      }

      const addHeading = (text, size = 14) => {
        doc.setFontSize(size)
        doc.text(text, marginX, cursorY)
        advance()
      }

      const addParagraph = (text) => {
        const wrapped = doc.splitTextToSize(text, 520)
        wrapped.forEach((line) => {
          doc.text(line, marginX, cursorY)
          advance()
        })
        advance()
      }

      doc.setFontSize(20)
      doc.text('PharmAI Insights — Repurposing Report', marginX, cursorY)
      advance(2)

      doc.setFontSize(12)
      const metaLines = [
        `Analysis mode: Case ${mode}`,
        `Drug: ${drug || 'N/A'}`,
        `Disease: ${disease || 'N/A'}`,
        `Generated: ${analysis.query_metadata?.generated_at || new Date().toISOString()}`
      ]
      metaLines.forEach((line) => {
        doc.text(line, marginX, cursorY)
        advance()
      })
      advance()

      const scoring = analysis.scoring_engine
      if (scoring) {
        addHeading('Repurposing Score', 16)
        addParagraph(
          `Final score: ${Math.round(scoring.final_repurposeability_score || 0)} / 100. ` +
          (scoring.explanation || 'Weighted multi-agent scoring summary.')
        )
      }

      const verdict = analysis.final_verdict
      if (verdict) {
        addHeading('Final Verdict', 16)
        addParagraph(`Decision: ${verdict.decision || 'N/A'} (confidence: ${verdict.confidence || 'Unknown'})`)
        if (verdict.primary_opportunity) {
          addParagraph(`Primary opportunity: ${verdict.primary_opportunity}`)
        }
        if (verdict.secondary_opportunity) {
          addParagraph(`Secondary opportunity: ${verdict.secondary_opportunity}`)
        }
        if (Array.isArray(verdict.recommended_next_steps) && verdict.recommended_next_steps.length) {
          addParagraph(`Next steps: ${verdict.recommended_next_steps.join(' | ')}`)
        }
      }

      const sections = [
        { title: 'Scientific Evidence', summary: analysis.agents?.research?.summary },
        { title: 'Clinical Trials', summary: analysis.agents?.clinical_trials?.summary },
        { title: 'Patent Landscape', summary: analysis.agents?.patents?.summary },
        { title: 'Market Trends', summary: analysis.agents?.market?.summary }
      ]

      sections.forEach(({ title, summary }) => {
        if (!summary) return
        addHeading(title, 15)
        addParagraph(summary)
      })

      const fileName = `repurpose-report-${drug || disease || 'analysis'}-${Date.now()}.pdf`
      doc.save(fileName)
      toast.success('PDF report downloaded!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate PDF. Please try again.')
    }
  }

  const handleDownloadSources = () => {
    if (!analysis) {
      toast.info('Run a live analysis to build a source list.')
      return
    }

    const { agents } = analysis
    const researchSection = (agents?.research?.positive_evidence || [])
      .map((item, idx) => `${idx + 1}. ${item.title} — ${item.journal} (${item.url})`) 
      .join('\n') || 'No positive studies returned.'
    const trialSection = (agents?.clinical_trials?.successful_trials || [])
      .map((item, idx) => `${idx + 1}. ${item.trial_name} (${item.phase}) — ${item.evidence_note}`)
      .join('\n') || 'No structured trials returned.'
    const patentSection = (agents?.patents?.active_patents || []).join('\n') || 'No active patent families detected.'
    const marketSection = (agents?.market?.markets || [])
      .map((item, idx) => `${idx + 1}. ${item.disease || 'Segment'} — ${item.adoption_trend || 'Unknown'} adoption`)
      .join('\n') || 'No market segments evaluated.'

    const content = `REPURPOSING ANALYSIS - DATA SOURCES
Drug: ${drug || 'N/A'}
Disease: ${disease || 'N/A'}
Analysis Mode: Case ${mode}
Generated: ${analysis.query_metadata?.generated_at || new Date().toISOString()}

=== SCIENTIFIC EVIDENCE ===
${researchSection}

=== CLINICAL TRIALS ===
${trialSection}

=== PATENT NOTES ===
${patentSection}

=== MARKET INSIGHTS ===
${marketSection}
`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sources-${drug || disease || 'analysis'}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    toast.success('Source summary downloaded!')
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
            Generate a PDF (when available) or export the full source list as text
          </div>

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleGenerateReport}
            disabled={!analysis}>
            <Download size={16} className="mr-2" />
            Generate Full PDF Report
          </Button>

          <Button variant="outline" className="w-full" onClick={handleDownloadSources}>
            <Download size={16} className="mr-2" />
            Download Source Summary (TXT)
          </Button>

          <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
            Report includes: Evidence summary, trials, patent considerations, market signals, and final verdict
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
