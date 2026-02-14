import { useParams } from 'react-router-dom'
import { Pill } from 'lucide-react'

export function Prescriptions() {
  const { personId } = useParams<{ personId: string }>()

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <Pill className="h-6 w-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
      </div>
      <p className="text-gray-600">Prescriptions page for person ID: {personId}</p>
      <p className="text-sm text-gray-500 mt-2">This page will be implemented in the future.</p>
    </div>
  )
}
