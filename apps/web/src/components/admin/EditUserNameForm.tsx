import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateUser, updateUserProfile } from '@/api/userManagement'

interface EditUserNameFormProps {
  userId: string
  currentFirstName?: string | null
  currentLastName?: string | null
  currentUserKind?: string | null
  currentLicenseNo?: string | null
  currentSchedulerColor?: string | null
  onSuccess: () => void
  onCancel: () => void
}

export function EditUserNameForm({
  userId,
  currentFirstName,
  currentLastName,
  currentUserKind,
  currentLicenseNo,
  currentSchedulerColor,
  onSuccess,
  onCancel,
}: EditUserNameFormProps) {
  const [firstName, setFirstName] = useState(currentFirstName || '')
  const [lastName, setLastName] = useState(currentLastName || '')
  const [userKind, setUserKind] = useState<string>(currentUserKind || 'staff')
  const [licenseNo, setLicenseNo] = useState(currentLicenseNo || '')
  const [schedulerColor, setSchedulerColor] = useState(currentSchedulerColor || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Check for user name changes
    const userUpdates: { firstName?: string; lastName?: string } = {}
    if (firstName !== (currentFirstName || '')) {
      userUpdates.firstName = firstName || undefined
    }
    if (lastName !== (currentLastName || '')) {
      userUpdates.lastName = lastName || undefined
    }

    // Check for profile changes
    const profileUpdates: {
      userKind?: 'staff' | 'dentist' | 'hygienist' | 'assistant' | 'manager'
      licenseNo?: string
      schedulerColor?: string
    } = {}
    if (userKind !== (currentUserKind || 'staff')) {
      profileUpdates.userKind = userKind as 'staff' | 'dentist' | 'hygienist' | 'assistant' | 'manager'
    }
    if (licenseNo !== (currentLicenseNo || '')) {
      profileUpdates.licenseNo = licenseNo || undefined
    }
    if (schedulerColor !== (currentSchedulerColor || '')) {
      profileUpdates.schedulerColor = schedulerColor || undefined
    }

    if (Object.keys(userUpdates).length === 0 && Object.keys(profileUpdates).length === 0) {
      setError('No changes to save')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(true)

    try {
      // Update user name if changed
      if (Object.keys(userUpdates).length > 0) {
        await updateUser(userId, userUpdates)
      }

      // Update profile if changed
      if (Object.keys(profileUpdates).length > 0) {
        await updateUserProfile(userId, profileUpdates)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to update user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasChanges =
    firstName !== (currentFirstName || '') ||
    lastName !== (currentLastName || '') ||
    userKind !== (currentUserKind || 'staff') ||
    licenseNo !== (currentLicenseNo || '') ||
    schedulerColor !== (currentSchedulerColor || '')

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="edit-firstName" className="text-sm font-medium text-gray-700">
            First Name
          </label>
          <Input
            id="edit-firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-lastName" className="text-sm font-medium text-gray-700">
            Last Name
          </label>
          <Input
            id="edit-lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="edit-userKind" className="text-sm font-medium text-gray-700">
            User Kind
          </label>
          <select
            id="edit-userKind"
            value={userKind}
            onChange={(e) => setUserKind(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="staff">Staff</option>
            <option value="dentist">Dentist</option>
            <option value="hygienist">Hygienist</option>
            <option value="assistant">Assistant</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-licenseNo" className="text-sm font-medium text-gray-700">
            License Number
          </label>
          <Input
            id="edit-licenseNo"
            value={licenseNo}
            onChange={(e) => setLicenseNo(e.target.value)}
            placeholder="e.g., RCSDO12345"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-schedulerColor" className="text-sm font-medium text-gray-700">
          Global Scheduler Color
        </label>
        <div className="flex gap-2">
          <Input
            id="edit-schedulerColor"
            type="color"
            value={schedulerColor || '#808080'}
            onChange={(e) => setSchedulerColor(e.target.value)}
            className="h-10 w-20"
          />
          <Input
            value={schedulerColor}
            onChange={(e) => setSchedulerColor(e.target.value)}
            placeholder="#808080"
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !hasChanges}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
