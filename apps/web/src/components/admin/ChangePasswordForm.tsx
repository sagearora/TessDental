import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateUser } from '@/api/userManagement'
import { validatePassword, getPasswordRequirements } from '@/lib/password'

interface ChangePasswordFormProps {
  userId: string
  userEmail?: string | null
  onSuccess: () => void
  onCancel: () => void
}

export function ChangePasswordForm({
  userId,
  userEmail,
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
    if (newPassword) {
      // Extract username from email (part before @)
      const username = userEmail ? userEmail.split('@')[0] : undefined
      const validation = validatePassword(newPassword, { username })
      setPasswordErrors(validation.errors)
    } else {
      setPasswordErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate password
    const username = userEmail ? userEmail.split('@')[0] : undefined
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

    setIsSubmitting(true)

    try {
      await updateUser(userId, { password })
      setPassword('')
      setConfirmPassword('')
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="change-password" className="text-sm font-medium text-gray-700">
          New Password
        </label>
        <Input
          id="change-password"
          type="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder="Enter secure password"
          className={passwordErrors.length > 0 && password ? 'border-red-500' : ''}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="change-confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <Input
          id="change-confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />
      </div>

      {password && (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-700 mb-1">Your password must contain:</p>
          <ul className="text-xs text-gray-600 space-y-0.5">
            {getPasswordRequirements().map((req, idx) => {
              // Skip "Not be the same as your current password" requirement
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
      )}

      {password && confirmPassword && password !== confirmPassword && (
        <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !password || password !== confirmPassword}>
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>
      </div>
    </form>
  )
}
