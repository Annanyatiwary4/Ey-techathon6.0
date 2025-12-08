import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🧬</span>
              <span className="font-bold text-lg">PharmAI</span>
            </div>
            <p className="text-sm text-gray-600">
              Drug Repurposing & Trend Intelligence Platform
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-blue-600">Dashboard</a></li>
              <li><a href="/docs" className="hover:text-blue-600">Documentation</a></li>
              <li><a href="/api" className="hover:text-blue-600">API</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Data Sources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">PubMed</a></li>
              <li><a href="https://clinicaltrials.gov" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">ClinicalTrials.gov</a></li>
              <li><a href="https://patents.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Google Patents</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          <p>©2025 PharmAI | MIT License | Built with React + Vite + shadcn/ui</p>
        </div>
      </div>
    </footer>
  )
}
