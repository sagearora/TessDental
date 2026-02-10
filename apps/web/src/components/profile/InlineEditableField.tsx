import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InlineEditableFieldProps {
  value: string | null | undefined
  onSave: (value: string) => Promise<void>
  label: string
  type?: 'text' | 'date' | 'email' | 'tel'
  placeholder?: string
  className?: string
}

export function InlineEditableField({
  value,
  onSave,
  label,
  type = 'text',
  placeholder,
  className,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value || '')
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Helper function to format phone number for display
  const formatPhoneForDisplay = (phone: string | null | undefined): string => {
    if (!phone) return 'N/A'
    // Extract digits only
    const digits = phone.replace(/\D/g, '')
    if (digits.length === 0) return 'N/A'
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  useEffect(() => {
    // For date inputs, format the value as YYYY-MM-DD without timezone conversion
    if (type === 'date' && value) {
      // If value is already in YYYY-MM-DD format, use it directly
      // Otherwise, parse it carefully to avoid timezone issues
      if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setEditValue(value)
      } else {
        // Parse the date string and format as YYYY-MM-DD in local timezone
        const date = new Date(value)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        setEditValue(`${year}-${month}-${day}`)
      }
    } else if (type === 'tel') {
      // For phone inputs, store just the digits
      const digits = value ? value.replace(/\D/g, '') : ''
      setEditValue(digits)
    } else {
      setEditValue(value || '')
    }
  }, [value, type])

  const handleStartEdit = () => {
    // For date inputs, format the value as YYYY-MM-DD without timezone conversion
    if (type === 'date' && value) {
      if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setEditValue(value)
      } else {
        // Parse the date string and format as YYYY-MM-DD in local timezone
        const date = new Date(value)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        setEditValue(`${year}-${month}-${day}`)
      }
    } else if (type === 'tel') {
      // For phone inputs, store just the digits
      const digits = value ? value.replace(/\D/g, '') : ''
      setEditValue(digits)
    } else {
      setEditValue(value || '')
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    // Reset to original value, handling dates properly
    if (type === 'date' && value) {
      if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setEditValue(value)
      } else {
        const date = new Date(value)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        setEditValue(`${year}-${month}-${day}`)
      }
    } else if (type === 'tel') {
      // For phone inputs, store just the digits
      const digits = value ? value.replace(/\D/g, '') : ''
      setEditValue(digits)
    } else {
      setEditValue(value || '')
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(editValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving:', error)
      // Keep editing on error
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-1">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="flex items-center gap-2">
          {type === 'tel' ? (
            <PhoneInput
              ref={inputRef}
              value={editValue}
              onChange={(digits) => setEditValue(digits)}
              onKeyDown={(e) => {
                // Handle Enter and Escape for phone input
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSave()
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  handleCancel()
                }
                // Let PhoneInput handle other keydown events (numeric validation)
              }}
              placeholder={placeholder || '(555) 123-4567'}
              className="flex-1"
              disabled={isSaving}
            />
          ) : (
            <Input
              ref={inputRef}
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1"
              disabled={isSaving}
            />
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
    )
  }

  // Always allow editing - even for null/undefined values
  const isClickable = true

  // Format display value based on type
  const getDisplayValue = () => {
    if (type === 'date' && value) {
      // Parse date string (YYYY-MM-DD) and format without timezone conversion
      if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = value.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        return date.toLocaleDateString()
      }
      // Fallback for other date formats
      const date = new Date(value)
      const year = String(date.getFullYear())
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString()
    } else if (type === 'tel') {
      return formatPhoneForDisplay(value)
    } else {
      return value || 'N/A'
    }
  }

  return (
    <div className={className}>
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`font-medium text-gray-900 ${isClickable ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
        onClick={isClickable ? handleStartEdit : undefined}
        title={isClickable ? 'Click to edit' : undefined}
      >
        {getDisplayValue()}
      </p>
    </div>
  )
}
