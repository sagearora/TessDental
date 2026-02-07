import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, UserPlus, Search, X } from 'lucide-react'
import { useGetUserClinicsQuery, useGetRolesQuery, useGetAppUsersQuery } from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'
import { CreateUserForm } from '@/components/admin/CreateUserForm'

export function UserManagement() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddingUser, setIsAddingUser] = useState(false)

  const { data: clinicsData, loading, refetch } = useGetUserClinicsQuery({
    skip: !session,
  })

  const { data: rolesData } = useGetRolesQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const { data: appUsersData, refetch: refetchUsers } = useGetAppUsersQuery({
    skip: !session,
  })

  const clinicUsers = clinicsData?.clinic_user_v || []
  const roles = rolesData?.role_v || []
  const appUsers = appUsersData?.app_user_v || []

  // Create a map of user_id to app_user data
  const userMap = new Map(appUsers.map((u) => [u.id, u]))

  // Filter users based on search query
  const filteredUsers = clinicUsers.filter((cu) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const user = userMap.get(cu.user_id || '')
    return (
      cu.user_id?.toString().toLowerCase().includes(query) ||
      user?.email?.toLowerCase().includes(query) ||
      user?.first_name?.toLowerCase().includes(query) ||
      user?.last_name?.toLowerCase().includes(query)
    )
  })

  const handleUserCreated = async () => {
    setIsAddingUser(false)
    await refetch()
    await refetchUsers()
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage users and their access to your clinic.
          </p>
        </div>
        <Button onClick={() => setIsAddingUser(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Create User Form */}
      {isAddingUser && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create New User</CardTitle>
                <CardDescription>Add a new user to your clinic</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAddingUser(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CreateUserForm
              clinicId={session?.clinicId || 0}
              roles={roles.filter((r): r is { id: number; name: string } => r.id != null && r.name != null)}
              onSuccess={handleUserCreated}
              onCancel={() => setIsAddingUser(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle>Clinic Users</CardTitle>
          </div>
          <CardDescription>View and manage users associated with your clinic</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users by email, name, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No users found matching your search.' : 'No users found.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((clinicUser) => {
                const user = userMap.get(clinicUser.user_id || '')

                return (
                  <div
                    key={clinicUser.id}
                    className="p-4 border border-gray-200 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (clinicUser.user_id) {
                        navigate(`/admin/users/${clinicUser.user_id}`)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
                          {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user?.first_name && user?.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user?.email || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                          <p className="text-xs text-gray-400">
                            Joined: {clinicUser.joined_at ? new Date(clinicUser.joined_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {(() => {
                          const clinicMembershipActive = clinicUser.is_active === true
                          const accountActive = user?.is_active !== false
                          const isFullyActive = clinicMembershipActive && accountActive
                          
                          return (
                            <>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  isFullyActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                                title={
                                  isFullyActive
                                    ? 'User is active'
                                    : !clinicMembershipActive
                                    ? 'Clinic membership is inactive'
                                    : !accountActive
                                    ? 'User account is inactive'
                                    : 'User status unknown'
                                }
                              >
                                {isFullyActive ? 'Active' : 'Inactive'}
                              </span>
                            </>
                          )
                        })()}
                      </div>
                    </div>
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
