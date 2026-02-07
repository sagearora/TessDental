import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Key, Settings } from 'lucide-react'
import { useGetUserClinicsQuery, useGetRolesQuery, useGetAppUserQuery } from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'
import { EditUserNameForm } from '@/components/admin/EditUserNameForm'
import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm'
import { UserRoleManager } from '@/components/admin/UserRoleManager'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { session } = useAuth()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const { data: clinicsData, loading: clinicsLoading, refetch: refetchClinics } = useGetUserClinicsQuery({
    skip: !session,
  })

  const { data: rolesData } = useGetRolesQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const { data: userData, loading: userLoading, refetch: refetchUser } = useGetAppUserQuery({
    variables: { userId: userId || '' },
    skip: !userId,
  })

  const clinicUsers = clinicsData?.clinic_user_v || []
  const roles = rolesData?.role_v || []
  const user = userData?.app_user_v?.[0]

  // Find the clinic_user record for this user
  const clinicUser = clinicUsers.find((cu) => cu.user_id === userId)

  const handleUserUpdated = async () => {
    setIsEditDialogOpen(false)
    await refetchUser()
    await refetchClinics()
  }

  const handlePasswordChanged = async () => {
    setIsPasswordDialogOpen(false)
    // Password change doesn't require refetching user data
  }

  if (userLoading || clinicsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-gray-500">Loading user...</div>
      </div>
    )
  }

  if (!user || !clinicUser) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/users')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div className="text-center py-8 text-gray-500">User not found</div>
      </div>
    )
  }

  const clinicMembershipActive = clinicUser.is_active === true
  const accountActive = user.is_active !== false
  const isFullyActive = clinicMembershipActive && accountActive

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : user.email || 'User'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">User Details</p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Basic user account details</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
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
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium text-xl">
              {user.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{user.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-base text-gray-900">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Joined Clinic</p>
                  <p className="text-base text-gray-900">
                    {clinicUser.joined_at
                      ? new Date(clinicUser.joined_at).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-base text-gray-900 font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Name
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Management Card */}
      {clinicUser.user_id && clinicUser.id != null && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <CardTitle>Role Management</CardTitle>
            </div>
            <CardDescription>Manage roles assigned to this user</CardDescription>
          </CardHeader>
          <CardContent>
            <UserRoleManager
              userId={clinicUser.user_id}
              clinicUserId={clinicUser.id}
              clinicId={session?.clinicId || 0}
              roles={roles.filter(
                (r): r is { id: number; name: string; description?: string | null } =>
                  r.id != null && r.name != null
              )}
              onUpdate={async () => {
                await refetchClinics()
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit Name Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent onClose={() => setIsEditDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit User Name</DialogTitle>
            <DialogDescription>Update the user's first and last name</DialogDescription>
          </DialogHeader>
          <EditUserNameForm
            userId={user.id || ''}
            currentFirstName={user.first_name}
            currentLastName={user.last_name}
            onSuccess={handleUserUpdated}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent onClose={() => setIsPasswordDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Set a new password for this user</DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            userId={user.id || ''}
            userEmail={user.email}
            onSuccess={handlePasswordChanged}
            onCancel={() => setIsPasswordDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
