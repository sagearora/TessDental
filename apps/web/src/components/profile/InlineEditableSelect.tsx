import { useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SelectOption {
  value: string
  label: string
}

interface InlineEditableSelectProps {
  value: string | null | undefined
  onSave: (value: string) => Promise<void>
  label: string
  options: SelectOption[]
  className?: string
}

export function InlineEditableSelect({
  value,
  onSave,
  label,
  options,
  className,
}: InlineEditableSelectProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value || '')
  const [isSaving, setIsSaving] = useState(false)
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value || '')
  }, [value])

  const handleStartEdit = () => {
    setEditValue(value || '')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditValue(value || '')
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(editValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
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
          <select
            ref={selectRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

  const selectedOption = options.find((opt) => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : value || 'N/A'

  return (
    <div className={className}>
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 hover:underline"
        onClick={handleStartEdit}
        title="Click to edit"
      >
        {displayValue}
      </p>
    </div>
  )
}
