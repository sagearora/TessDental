import { useParams } from 'react-router-dom'
import { CheckSquare } from 'lucide-react'

export function Forms() {
  const { personId } = useParams<{ personId: string }>()

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <CheckSquare className="h-6 w-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
      </div>
      <p className="text-gray-600">Forms page for person ID: {personId}</p>
      <p className="text-sm text-gray-500 mt-2">This page will be implemented in the future.</p>
    </div>
  )
}
