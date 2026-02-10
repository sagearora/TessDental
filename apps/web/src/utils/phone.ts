/**
 * Formats a phone number as (XXX) XXX-XXXX for North American numbers
 * @param phone - The phone number string (can contain formatting)
 * @returns Formatted phone number or null if invalid
 */
export function formatPhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 0) return null
  
  // Format as (XXX) XXX-XXXX for 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  
  // Format as (XXX) XXX-XXXX for 11 digits (with leading 1)
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  
  // Return as-is if it doesn't match expected format
  return phone
}
