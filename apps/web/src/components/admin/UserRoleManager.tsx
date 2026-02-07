import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { assignRoleToUser, removeRoleFromUser } from '@/api/userManagement'
import { useGetUserRolesQuery } from '@/gql/generated'

interface UserRoleManagerProps {
  userId: string
  clinicUserId: number
  clinicId: number
  roles: Array<{ id: number; name: string; description?: string | null }>
  onUpdate: () => void
}

export function UserRoleManager({
  userId,
  clinicUserId,
  clinicId,
  roles,
  onUpdate,
}: UserRoleManagerProps) {
  const { data, loading, refetch } = useGetUserRolesQuery({
    variables: { clinicUserId },
    skip: !clinicUserId,
  })

  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const assignedRoleIds = new Set(data?.clinic_user_role?.map((ur) => ur.role_id) || [])
  const availableRoles = roles.filter((r) => !assignedRoleIds.has(r.id))

  const handleAssignRole = async () => {
    if (!selectedRoleId) return

    setError(null)
    setIsAssigning(true)

    try {
      await assignRoleToUser(clinicId, userId, selectedRoleId)
      setSelectedRoleId(null)
      await refetch()
      onUpdate()
    } catch (err: any) {
      setError(err.message || 'Failed to assign role')
    } finally {
      setIsAssigning(false)
    }
  }

  const handleRemoveRole = async (roleId: number) => {
    setError(null)

    try {
      await removeRoleFromUser(clinicId, userId, roleId)
      await refetch()
      onUpdate()
    } catch (err: any) {
      setError(err.message || 'Failed to remove role')
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading roles...</div>
  }

  const assignedRoles = roles.filter((r) => assignedRoleIds.has(r.id))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">User Roles</h4>
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
          {error}
        </div>
      )}

      {/* Assigned Roles */}
      {assignedRoles.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700">Assigned Roles:</p>
          <div className="flex flex-wrap gap-2">
            {assignedRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md"
              >
                <span className="text-sm text-blue-900">{role.name}</span>
                <button
                  onClick={() => handleRemoveRole(role.id)}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No roles assigned</p>
      )}

      {/* Assign New Role */}
      {availableRoles.length > 0 && (
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs font-medium text-gray-700">Assign Role:</p>
          <div className="flex gap-2">
            <select
              value={selectedRoleId || ''}
              onChange={(e) => setSelectedRoleId(Number(e.target.value) || null)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a role...</option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={handleAssignRole}
              disabled={!selectedRoleId || isAssigning}
            >
              {isAssigning ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
