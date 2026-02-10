import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Plus, X, Settings } from 'lucide-react'
import { useGetRolesQuery, useGetCapabilitiesQuery, useGetRoleCapabilitiesQuery } from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'
import { createRole, updateRole, addCapabilityToRole, removeCapabilityFromRole } from '@/api/userManagement'
import { CreateRoleForm } from '@/components/admin/CreateRoleForm'
import { RoleCapabilityManager } from '@/components/admin/RoleCapabilityManager'

export function RoleManagement() {
  const { session } = useAuth()
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)

  const { data: rolesData, loading, refetch } = useGetRolesQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const roles = rolesData?.role_v || []

  const handleRoleCreated = async () => {
    setIsCreatingRole(false)
    await refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage roles with specific capabilities for your clinic.
          </p>
        </div>
        <Button onClick={() => setIsCreatingRole(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Create Role Form */}
      {isCreatingRole && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create New Role</CardTitle>
                <CardDescription>Define a new role with specific capabilities</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCreatingRole(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CreateRoleForm
              clinicId={session?.clinicId || 0}
              onSuccess={handleRoleCreated}
              onCancel={() => setIsCreatingRole(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Roles List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Clinic Roles</CardTitle>
          </div>
          <CardDescription>Manage roles and their assigned capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No roles found. Create your first role to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {roles.map((role) => {
                const isSelected = selectedRoleId === role.id

                return (
                  <div
                    key={role.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{role.name}</h3>
                        {role.description && (
                          <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            role.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {role.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <Button
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedRoleId(isSelected ? null : (role.id || null))}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {isSelected ? 'Hide Capabilities' : 'Manage Capabilities'}
                        </Button>
                      </div>
                    </div>

                    {/* Capability Management Panel */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t">
                        <RoleCapabilityManager
                          roleId={role.id || 0}
                          clinicId={session?.clinicId || 0}
                          onUpdate={async () => {
                            await refetch()
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
