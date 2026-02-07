import { z } from "zod";

/**
 * Validates a password against security requirements
 */
function validatePasswordRequirements(password: string, email?: string): string | undefined {
  const errors: string[] = []

  // At least eight characters
  if (password.length < 8) {
    errors.push("at least eight characters")
  }

  // At least one capital letter
  if (!/[A-Z]/.test(password)) {
    errors.push("at least one capital letter")
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("at least one lowercase letter")
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    errors.push("at least one number")
  }

  // At least one special character (!@#$%^&*+=)
  if (!/[!@#$%^&*+=]/.test(password)) {
    errors.push("at least one special character (!@#$%^&*+=)")
  }

  // Not contain any variation of username (case-insensitive)
  if (email) {
    const username = email.split('@')[0]
    const usernameLower = username.toLowerCase()
    const passwordLower = password.toLowerCase()
    
    if (passwordLower.includes(usernameLower) || usernameLower.includes(passwordLower)) {
      errors.push("not contain any variation of your username")
    }
  }

  if (errors.length > 0) {
    return `Password must contain: ${errors.join(", ")}`
  }

  return undefined
}

export const InitInputSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().refine(
    (password, ctx) => {
      const email = ctx.parent.email
      const error = validatePasswordRequirements(password, email)
      if (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error,
        })
        return false
      }
      return true
    },
    { message: "Password does not meet security requirements" }
  ),
  clinicName: z.string().min(1, "Clinic name is required"),
  timezone: z.string().min(1, "Timezone is required")
});

export type InitInput = z.infer<typeof InitInputSchema>;
