import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateUser } from '@/api/userManagement'
import { validatePassword, getPasswordRequirements } from '@/lib/password'

interface EditUserFormProps {
  userId: string
  currentFirstName?: string | null
  currentLastName?: string | null
  currentEmail?: string | null
  onSuccess: () => void
  onCancel: () => void
}

export function EditUserForm({
  userId,
  currentFirstName,
  currentLastName,
  currentEmail,
  onSuccess,
  onCancel,
}: EditUserFormProps) {
  const [firstName, setFirstName] = useState(currentFirstName || '')
  const [lastName, setLastName] = useState(currentLastName || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
    if (newPassword) {
      // Extract username from email (part before @)
      const username = currentEmail ? currentEmail.split('@')[0] : undefined
      const validation = validatePassword(newPassword, { username })
      setPasswordErrors(validation.errors)
    } else {
      setPasswordErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate password if provided
    if (password) {
      const username = currentEmail ? currentEmail.split('@')[0] : undefined
      const validation = validatePassword(password, { username })
      
      if (!validation.isValid) {
        setPasswordErrors(validation.errors)
        setError('Please fix password validation errors')
        return
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    setIsSubmitting(true)

    try {
      const updates: { firstName?: string; lastName?: string; password?: string } = {}

      if (firstName !== currentFirstName) {
        updates.firstName = firstName || undefined
      }
      if (lastName !== currentLastName) {
        updates.lastName = lastName || undefined
      }
      if (password) {
        updates.password = password
      }

      if (Object.keys(updates).length === 0) {
        setError('No changes to save')
        setIsSubmitting(false)
        return
      }

      await updateUser(userId, updates)
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
    password !== ''

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

      <div className="space-y-2">
        <label htmlFor="edit-password" className="text-sm font-medium text-gray-700">
          New Password (leave blank to keep current)
        </label>
        <Input
          id="edit-password"
          type="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder="Enter secure password"
          className={passwordErrors.length > 0 && password ? 'border-red-500' : ''}
        />
        {password && (
          <>
            <Input
              id="edit-confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="mt-2"
            />
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Your password must contain:</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {getPasswordRequirements().map((req, idx) => {
                  // Skip "Not be the same as your current password" requirement in edit form
                  // as we don't have access to the current password hash
                  if (req === 'Not be the same as your current password') {
                    return null
                  }
                  const isMet = !passwordErrors.includes(req)
                  return (
                    <li key={idx} className={isMet ? 'text-green-600' : 'text-red-600'}>
                      {isMet ? '✓' : '✗'} {req}
                    </li>
                  )
                })}
              </ul>
            </div>
          </>
        )}
        {password && confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
        )}
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
