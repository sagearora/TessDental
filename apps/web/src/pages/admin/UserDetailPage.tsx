import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Key, Settings, Briefcase } from 'lucide-react'
import { useGetUserClinicsQuery, useGetRolesQuery, useGetAppUserQuery, useGetClinicUserWithProfileByUserIdQuery, useGetOperatoriesQuery } from '@/gql/generated'
import { useAuth } from '@/contexts/AuthContext'
import { EditUserNameForm } from '@/components/admin/EditUserNameForm'
import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm'
import { EditUserMembershipForm } from '@/components/admin/EditUserMembershipForm'
import { UserRoleManager } from '@/components/admin/UserRoleManager'
import { ProviderIdentifierManager } from '@/components/admin/ProviderIdentifierManager'
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
  const [isMembershipDialogOpen, setIsMembershipDialogOpen] = useState(false)

  const { data: clinicsData, loading: clinicsLoading, refetch: refetchClinics } = useGetUserClinicsQuery({
    skip: !session,
  })

  const { data: rolesData } = useGetRolesQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const { data: operatoriesData } = useGetOperatoriesQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const operatories = operatoriesData?.operatory_v || []

  const { data: userData, loading: userLoading, refetch: refetchUser } = useGetAppUserQuery({
    variables: { userId: userId || '' },
    skip: !userId,
  })

  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useGetClinicUserWithProfileByUserIdQuery({
    variables: { 
      clinicId: session?.clinicId || 0,
      userId: userId || '',
    },
    skip: !userId || !session?.clinicId,
  })

  const clinicUsers = clinicsData?.clinic_user_v || []
  const roles = rolesData?.role_v || []
  const user = userData?.app_user_v?.[0]
  const userWithProfile = profileData?.clinic_user_with_profile_v?.[0]

  // Find the clinic_user record for this user
  const clinicUser = clinicUsers.find((cu) => cu.user_id === userId)

  const handleUserUpdated = async () => {
    setIsEditDialogOpen(false)
    await refetchUser()
    await refetchProfile()
    await refetchClinics()
  }

  const handlePasswordChanged = async () => {
    setIsPasswordDialogOpen(false)
    // Password change doesn't require refetching user data
  }

  const handleMembershipUpdated = async () => {
    setIsMembershipDialogOpen(false)
    await refetchProfile()
    await refetchClinics()
  }

  if (userLoading || clinicsLoading || profileLoading) {
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
              <CardDescription>User account details and profile settings</CardDescription>
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
                {userWithProfile && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">User Kind</p>
                      <p className="text-base text-gray-900 capitalize">
                        {userWithProfile.user_kind || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">License Number</p>
                      <p className="text-base text-gray-900">
                        {userWithProfile.license_no || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Global Scheduler Color</p>
                      {userWithProfile.global_scheduler_color ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: userWithProfile.global_scheduler_color }}
                          />
                          <span className="text-base text-gray-900">{userWithProfile.global_scheduler_color}</span>
                        </div>
                      ) : (
                        <p className="text-base text-gray-500">Not set</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Profile Status</p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          userWithProfile.profile_active !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {userWithProfile.profile_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Information
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clinic Membership Card */}
      {userWithProfile && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <CardTitle>Clinic Membership</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsMembershipDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Membership
              </Button>
            </div>
            <CardDescription>Job details and scheduling settings for this clinic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Job Title</p>
                <p className="text-base text-gray-900">
                  {userWithProfile.job_title || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Schedulable</p>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    userWithProfile.is_schedulable
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {userWithProfile.is_schedulable ? 'Yes' : 'No'}
                </span>
              </div>
              {userWithProfile.is_schedulable && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Provider Kind</p>
                    <p className="text-base text-gray-900 capitalize">
                      {userWithProfile.provider_kind || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Default Operatory</p>
                    <p className="text-base text-gray-900">
                      {userWithProfile.default_operatory_id
                        ? operatories.find((op) => op.id === userWithProfile.default_operatory_id)?.name || 'Unknown'
                        : 'Not set'}
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Clinic Scheduler Color</p>
                {userWithProfile.clinic_scheduler_color ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: userWithProfile.clinic_scheduler_color }}
                    />
                    <span className="text-base text-gray-900">{userWithProfile.clinic_scheduler_color}</span>
                  </div>
                ) : (
                  <p className="text-base text-gray-500">Not set (uses global)</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Membership Status</p>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    userWithProfile.clinic_membership_active !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {userWithProfile.clinic_membership_active !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Provider Identifiers Card */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Provider Identifiers</CardTitle>
            <CardDescription>CDA UINs and other provider identifiers</CardDescription>
          </CardHeader>
          <CardContent>
            <ProviderIdentifierManager
              userId={user.id || ''}
              onUpdate={async () => {
                await refetchProfile()
              }}
            />
          </CardContent>
        </Card>
      )}

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

      {/* Edit User Information Dialog (Name + Profile) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent onClose={() => setIsEditDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit User Information</DialogTitle>
            <DialogDescription>Update the user's name and profile settings</DialogDescription>
          </DialogHeader>
          <EditUserNameForm
            userId={user.id || ''}
            currentFirstName={user.first_name}
            currentLastName={user.last_name}
            currentUserKind={userWithProfile?.user_kind}
            currentLicenseNo={userWithProfile?.license_no}
            currentSchedulerColor={userWithProfile?.global_scheduler_color}
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

      {/* Edit Membership Dialog */}
      <Dialog open={isMembershipDialogOpen} onOpenChange={setIsMembershipDialogOpen}>
        <DialogContent onClose={() => setIsMembershipDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit Clinic Membership</DialogTitle>
            <DialogDescription>Update job details and scheduling settings</DialogDescription>
          </DialogHeader>
          {userWithProfile && session?.clinicId && (
            <EditUserMembershipForm
              clinicId={session.clinicId}
              userId={userId || ''}
              currentJobTitle={userWithProfile.job_title}
              currentIsSchedulable={userWithProfile.is_schedulable}
              currentProviderKind={userWithProfile.provider_kind}
              currentDefaultOperatoryId={userWithProfile.default_operatory_id}
              currentSchedulerColor={userWithProfile.clinic_scheduler_color}
              currentIsActive={userWithProfile.clinic_membership_active}
              onSuccess={handleMembershipUpdated}
              onCancel={() => setIsMembershipDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
