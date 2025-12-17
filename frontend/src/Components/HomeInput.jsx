import React from 'react'
import InputForm from './InputForm'
import ResultsPanel from './ResultsPanel'
import AlertBanner from './AlertBanner'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export default function HomeInput() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🧬 PharmAI Insights</h1>
          <p className="text-sm text-gray-600 mt-1">Drug Repurposing & Trend Intelligence Platform</p>
        </div>
      </div>

      {/* Input Panel */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl">INPUT PANEL</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700">Search Parameters</div>
              <div className="h-px bg-gray-300 my-3" />
            </div>
            <AlertBanner />
            <InputForm />
          </CardContent>
        </Card>

        {/* Results Panel */}
        <ResultsPanel />
      </div>
    </div>
  )
}
