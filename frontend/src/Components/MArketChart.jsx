import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const previewData = [
  { year: '2022', price: 14.5 },
  { year: '2023', price: 11.3 },
  { year: '2024', price: 16.7 }
]

export default function MarketChart() {
  const navigate = useNavigate()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>💰</span>
          <span>Market Trends</span>
          <Badge variant="secondary" className="ml-auto">Live Data</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-sm text-gray-600 mb-3">
          Price Trends (Last 3 Years Preview)
        </div>

        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={previewData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} name="Price ($M)" />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Region:</span>
            <span className="font-medium">Global</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-3 mb-3">
          Source: Market Data Analytics
        </div>

        <Button 
          className="w-full"
          onClick={() => navigate('/market')}>
          <ArrowRight size={16} className="mr-2" />
          View Full Market Analysis
        </Button>
      </CardContent>
    </Card>
  )
}
