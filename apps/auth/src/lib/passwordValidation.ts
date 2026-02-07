/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validates a password against security requirements:
 * - At least eight characters
 * - At least one capital letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*+=)
 * - Not contain any variation of the username (if provided)
 * - Not be the same as the current password (if provided)
 */
export function validatePassword(
  password: string,
  options?: {
    username?: string
    currentPassword?: string
  }
): PasswordValidationResult {
  const errors: string[] = []

  // At least eight characters
  if (password.length < 8) {
    errors.push('At least eight characters')
  }

  // At least one capital letter
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one capital letter')
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter')
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    errors.push('At least one number')
  }

  // At least one special character (!@#$%^&*+=)
  if (!/[!@#$%^&*+=]/.test(password)) {
    errors.push('At least one special character (!@#$%^&*+=)')
  }

  // Not contain any variation of username (case-insensitive)
  if (options?.username) {
    const usernameLower = options.username.toLowerCase()
    const passwordLower = password.toLowerCase()
    
    // Check if password contains username or username contains password
    if (passwordLower.includes(usernameLower) || usernameLower.includes(passwordLower)) {
      errors.push('Not contain any variation of your username')
    }
  }

  // Not be the same as current password
  if (options?.currentPassword && password === options.currentPassword) {
    errors.push('Not be the same as your current password')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
