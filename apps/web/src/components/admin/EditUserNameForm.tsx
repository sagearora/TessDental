import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateUser } from '@/api/userManagement'

interface EditUserNameFormProps {
  userId: string
  currentFirstName?: string | null
  currentLastName?: string | null
  onSuccess: () => void
  onCancel: () => void
}

export function EditUserNameForm({
  userId,
  currentFirstName,
  currentLastName,
  onSuccess,
  onCancel,
}: EditUserNameFormProps) {
  const [firstName, setFirstName] = useState(currentFirstName || '')
  const [lastName, setLastName] = useState(currentLastName || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const updates: { firstName?: string; lastName?: string } = {}

    if (firstName !== currentFirstName) {
      updates.firstName = firstName || undefined
    }
    if (lastName !== currentLastName) {
      updates.lastName = lastName || undefined
    }

    if (Object.keys(updates).length === 0) {
      setError('No changes to save')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(true)

    try {
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
    lastName !== (currentLastName || '')

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
