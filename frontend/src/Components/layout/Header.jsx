import React from 'react'
import { Button } from '../ui/button'

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PharmAI
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">Dashboard</a>
            <a href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600">About</a>
            <a href="/docs" className="text-sm font-medium text-gray-700 hover:text-blue-600">Documentation</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
