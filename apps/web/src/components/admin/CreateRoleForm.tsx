import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createRole } from '@/api/userManagement'
import { useGetCapabilitiesQuery } from '@/gql/generated'

interface CreateRoleFormProps {
  clinicId: number
  onSuccess: () => void
  onCancel: () => void
}

export function CreateRoleForm({ clinicId, onSuccess, onCancel }: CreateRoleFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: capabilitiesData } = useGetCapabilitiesQuery()
  const capabilities = capabilitiesData?.capability || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await createRole(clinicId, {
        name,
        description: description || undefined,
        capabilityKeys: selectedCapabilities.length > 0 ? selectedCapabilities : undefined,
      })
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to create role')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCapability = (capabilityKey: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capabilityKey)
        ? prev.filter((key) => key !== capabilityKey)
        : [...prev, capabilityKey]
    )
  }

  // Group capabilities - note: capability table only has value and comment, no module
  // For now, group all together since module field doesn't exist
  const capabilitiesByModule = { 'all': capabilities }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Role Name *
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g., Front Desk, Hygienist, Manager"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description of this role"
        />
      </div>

      {capabilities.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Capabilities (Optional)</label>
          <div className="max-h-64 overflow-y-auto p-3 border border-gray-200 rounded-md space-y-3">
            {Object.entries(capabilitiesByModule).map(([module, moduleCaps]) => (
              <div key={module}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{module}</p>
                <div className="grid grid-cols-2 gap-2">
                  {moduleCaps.map((cap) => (
                    <label key={cap.value} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCapabilities.includes(cap.value)}
                        onChange={() => toggleCapability(cap.value)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">{cap.value}</span>
                        {cap.comment && (
                          <p className="text-xs text-gray-500">{cap.comment}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !name}>
          {isSubmitting ? 'Creating...' : 'Create Role'}
        </Button>
      </div>
    </form>
  )
}
