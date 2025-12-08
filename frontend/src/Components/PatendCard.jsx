import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PatentCard() {
  const navigate = useNavigate()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-orange-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>📑</span>
          <span>Patent Landscape</span>
          <Badge variant="secondary" className="ml-auto">32 Patents</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Patents:</span>
            <span className="font-bold text-lg">32</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active Patents:</span>
            <span className="font-bold text-lg text-green-600">28</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Primary Holder:</span>
            <span className="font-semibold text-sm">Johnson & Johnson</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Patent Risk:</span>
            <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-3">
          Source: Google Patents Database
        </div>

        <Button 
          className="w-full"
          onClick={() => navigate('/patents')}>
          <ArrowRight size={16} className="mr-2" />
          View All Patents & Analysis
        </Button>
      </CardContent>
    </Card>
  )
}
