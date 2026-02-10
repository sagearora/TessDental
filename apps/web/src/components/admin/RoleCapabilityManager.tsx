import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addCapabilityToRole, removeCapabilityFromRole } from '@/api/userManagement'
import { useGetRoleCapabilitiesQuery, useGetCapabilitiesQuery } from '@/gql/generated'

interface RoleCapabilityManagerProps {
  roleId: number
  clinicId: number
  onUpdate: () => void
}

export function RoleCapabilityManager({ roleId, clinicId, onUpdate }: RoleCapabilityManagerProps) {
  const { data: roleCapsData, loading, refetch } = useGetRoleCapabilitiesQuery({
    variables: { roleId },
  })

  const { data: allCapsData } = useGetCapabilitiesQuery()
  const [selectedCapability, setSelectedCapability] = useState<string>('')
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignedCapabilityKeys = new Set(
    roleCapsData?.role_capability?.map((rc) => rc.capability_key) || []
  )
  const allCapabilities = allCapsData?.capability || []
  const availableCapabilities = allCapabilities.filter(
    (cap) => !assignedCapabilityKeys.has(cap.value as string)
  )

  const handleAddCapability = async () => {
    if (!selectedCapability) return

    setError(null)
    setIsAdding(true)

    try {
      await addCapabilityToRole(clinicId, roleId, selectedCapability as any) // capability_enum type
      setSelectedCapability('')
      await refetch()
      onUpdate()
    } catch (err: any) {
      setError(err.message || 'Failed to add capability')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveCapability = async (capabilityKey: string) => {
    setError(null)

    try {
      await removeCapabilityFromRole(clinicId, roleId, capabilityKey as any) // capability_enum type
      await refetch()
      onUpdate()
    } catch (err: any) {
      setError(err.message || 'Failed to remove capability')
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading capabilities...</div>
  }

  const assignedCapabilities = allCapabilities.filter((cap) =>
    assignedCapabilityKeys.has(cap.value as string)
  )

  // Group all together since module field doesn't exist in capability table
  const assignedByModule = { 'all': assignedCapabilities }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Role Capabilities</h4>
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
          {error}
        </div>
      )}

      {/* Assigned Capabilities */}
      {assignedCapabilities.length > 0 ? (
        <div className="space-y-3">
          {Object.entries(assignedByModule).map(([module, moduleCaps]) => (
            <div key={module}>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{module}</p>
              <div className="flex flex-wrap gap-2">
                {moduleCaps.map((cap) => (
                  <div
                    key={cap.value}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md"
                  >
                    <span className="text-sm text-blue-900">{cap.value}</span>
                    <button
                      onClick={() => handleRemoveCapability(cap.value)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No capabilities assigned</p>
      )}

      {/* Add New Capability */}
      {availableCapabilities.length > 0 && (
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs font-medium text-gray-700">Add Capability:</p>
          <div className="flex gap-2">
            <select
              value={selectedCapability}
              onChange={(e) => setSelectedCapability(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a capability...</option>
              {availableCapabilities.map((cap) => (
                <option key={cap.value} value={cap.value}>
                  {cap.value} - {cap.comment || ''}
                </option>
              ))}
            </select>
            <Button size="sm" onClick={handleAddCapability} disabled={!selectedCapability || isAdding}>
              {isAdding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
