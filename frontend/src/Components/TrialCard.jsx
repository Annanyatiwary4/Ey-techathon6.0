import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TrialCard() {
  const navigate = useNavigate()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>🧬</span>
          <span>Clinical Trials</span>
          <Badge variant="secondary" className="ml-auto">8 Trials</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-sm text-gray-600 mb-4">
          Found active clinical trials across multiple phases
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Phase II Trials</span>
            <Badge>3 Active</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Phase III Trials</span>
            <Badge>2 Active</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Recruiting Status</span>
            <Badge variant="secondary">5 Open</Badge>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-3">
          Source: ClinicalTrials.gov Database
        </div>

        <Button 
          className="w-full"
          onClick={() => navigate('/trials')}>
          <ArrowRight size={16} className="mr-2" />
          View All Trials & Details
        </Button>
      </CardContent>
    </Card>
  )
}
