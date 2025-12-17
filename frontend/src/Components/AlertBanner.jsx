import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function AlertBanner() {
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900">Live data is enabled</AlertTitle>
      <AlertDescription className="text-blue-700">
        Case 1 and Case 3 are wired to the FastAPI backend. Case 2 and Case 4 will unlock once their agents are ready.
      </AlertDescription>
    </Alert>
  )
}
