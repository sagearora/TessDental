import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateUserMembership } from '@/api/userManagement'
import { useGetOperatoriesQuery } from '@/gql/generated'

interface EditUserMembershipFormProps {
  clinicId: number
  userId: string
  currentJobTitle?: string | null
  currentIsSchedulable?: boolean | null
  currentProviderKind?: string | null
  currentDefaultOperatoryId?: number | null
  currentSchedulerColor?: string | null
  currentIsActive?: boolean | null
  onSuccess: () => void
  onCancel: () => void
}

export function EditUserMembershipForm({
  clinicId,
  userId,
  currentJobTitle,
  currentIsSchedulable,
  currentProviderKind,
  currentDefaultOperatoryId,
  currentSchedulerColor,
  currentIsActive,
  onSuccess,
  onCancel,
}: EditUserMembershipFormProps) {
  const [jobTitle, setJobTitle] = useState(currentJobTitle || '')
  const [isSchedulable, setIsSchedulable] = useState(currentIsSchedulable || false)
  const [providerKind, setProviderKind] = useState<string>(currentProviderKind || '')
  const [defaultOperatoryId, setDefaultOperatoryId] = useState<number | null>(
    currentDefaultOperatoryId || null
  )
  const [schedulerColor, setSchedulerColor] = useState(currentSchedulerColor || '')
  const [isActive, setIsActive] = useState(currentIsActive !== false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: operatoriesData } = useGetOperatoriesQuery({
    variables: { clinicId },
    skip: !clinicId,
  })

  const operatories = operatoriesData?.operatory_v || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate: if schedulable, provider_kind must be set
    if (isSchedulable && !providerKind) {
      setError('Provider kind is required when user is schedulable')
      return
    }

    setIsSubmitting(true)

    try {
      await updateUserMembership(clinicId, userId, {
        jobTitle: jobTitle || undefined,
        isSchedulable,
        providerKind: providerKind ? (providerKind as 'dentist' | 'hygienist' | 'assistant') : null,
        defaultOperatoryId: defaultOperatoryId || null,
        schedulerColor: schedulerColor || undefined,
        isActive,
      })
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to update user membership')
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasChanges =
    jobTitle !== (currentJobTitle || '') ||
    isSchedulable !== (currentIsSchedulable || false) ||
    providerKind !== (currentProviderKind || '') ||
    defaultOperatoryId !== (currentDefaultOperatoryId || null) ||
    schedulerColor !== (currentSchedulerColor || '') ||
    isActive !== (currentIsActive !== false)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="job-title" className="text-sm font-medium text-gray-700">
          Job Title
        </label>
        <Input
          id="job-title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Front Desk, Office Manager"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSchedulable}
            onChange={(e) => {
              setIsSchedulable(e.target.checked)
              if (!e.target.checked) {
                setProviderKind('')
                setDefaultOperatoryId(null)
              }
            }}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">Schedulable (can appear in scheduler)</span>
        </label>
      </div>

      {isSchedulable && (
        <>
          <div className="space-y-2">
            <label htmlFor="provider-kind" className="text-sm font-medium text-gray-700">
              Provider Kind *
            </label>
            <select
              id="provider-kind"
              value={providerKind}
              onChange={(e) => setProviderKind(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select provider kind...</option>
              <option value="dentist">Dentist</option>
              <option value="hygienist">Hygienist</option>
              <option value="assistant">Assistant</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="default-operatory" className="text-sm font-medium text-gray-700">
              Default Operatory
            </label>
            <select
              id="default-operatory"
              value={defaultOperatoryId || ''}
              onChange={(e) => setDefaultOperatoryId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {operatories
                .filter((op) => op.is_active && op.is_bookable)
                .map((op) => (
                  <option key={op.id} value={op.id || ''}>
                    {op.name}
                  </option>
                ))}
            </select>
          </div>
        </>
      )}

      <div className="space-y-2">
        <label htmlFor="clinic-scheduler-color" className="text-sm font-medium text-gray-700">
          Clinic Scheduler Color (overrides global)
        </label>
        <div className="flex gap-2">
          <Input
            id="clinic-scheduler-color"
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

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Active Membership</span>
        </label>
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
