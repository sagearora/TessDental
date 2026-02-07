import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createUser } from '@/api/userManagement'
import { useGetRolesQuery } from '@/gql/generated'
import { validatePassword, getPasswordRequirements } from '@/lib/password'

interface CreateUserFormProps {
  clinicId: number
  roles: Array<{ id: number; name: string }>
  onSuccess: () => void
  onCancel: () => void
}

export function CreateUserForm({ clinicId, roles, onSuccess, onCancel }: CreateUserFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
    if (newPassword) {
      // Extract username from email (part before @)
      const username = email.split('@')[0]
      const validation = validatePassword(newPassword, { username })
      setPasswordErrors(validation.errors)
    } else {
      setPasswordErrors([])
    }
  }

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail)
    // Re-validate password if it exists, since username check depends on email
    if (password) {
      const username = newEmail.split('@')[0]
      const validation = validatePassword(password, { username })
      setPasswordErrors(validation.errors)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Extract username from email for validation
    const username = email.split('@')[0]
    const validation = validatePassword(password, { username })
    
    if (!validation.isValid) {
      setPasswordErrors(validation.errors)
      setError('Please fix password validation errors')
      return
    }

    setIsSubmitting(true)

    try {
      await createUser({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        clinicId,
        roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
      })
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            placeholder="user@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password *
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
            placeholder="Enter secure password"
            className={passwordErrors.length > 0 && password ? 'border-red-500' : ''}
          />
          {password && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Your password must contain:</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {getPasswordRequirements().map((req, idx) => {
                  const isMet = !passwordErrors.includes(req)
                  return (
                    <li key={idx} className={isMet ? 'text-green-600' : 'text-red-600'}>
                      {isMet ? '✓' : '✗'} {req}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name
          </label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name
          </label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      {roles.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Assign Roles (Optional)</label>
          <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-md">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRoleIds.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{role.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !email || !password}>
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}
