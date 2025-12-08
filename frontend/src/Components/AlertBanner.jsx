import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function AlertBanner() {
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900">Demo Mode</AlertTitle>
      <AlertDescription className="text-blue-700">
        Currently displaying dummy data. Connect to backend APIs for real-time drug repurposing analysis.
      </AlertDescription>
    </Alert>
  )
}
