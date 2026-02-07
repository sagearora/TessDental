import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Clock } from 'lucide-react'
import { useGetClinicHoursQuery, useUpsertClinicHoursMutation } from '@/gql/generated'

interface EditClinicHoursDialogProps {
  clinicId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface DayHours {
  dayOfWeek: number
  dayName: string
  isClosed: boolean
  clinicOpen: string
  clinicClose: string
  appointmentStart: string
  appointmentEnd: string
  matchClinicHours: boolean
}

const DAYS_OF_WEEK = [
  { value: 0, name: 'Sunday', short: 'Sun' },
  { value: 1, name: 'Monday', short: 'Mon' },
  { value: 2, name: 'Tuesday', short: 'Tue' },
  { value: 3, name: 'Wednesday', short: 'Wed' },
  { value: 4, name: 'Thursday', short: 'Thu' },
  { value: 5, name: 'Friday', short: 'Fri' },
  { value: 6, name: 'Saturday', short: 'Sat' },
]

export function EditClinicHoursDialog({
  clinicId,
  open,
  onOpenChange,
  onSuccess,
}: EditClinicHoursDialogProps) {
  const { data, loading } = useGetClinicHoursQuery({
    variables: { clinicId },
    skip: !open || !clinicId || clinicId === 0,
  })

  const [upsertClinicHours, { loading: isSaving }] = useUpsertClinicHoursMutation()

  const [hours, setHours] = useState<DayHours[]>(() =>
    DAYS_OF_WEEK.map((day) => ({
      dayOfWeek: day.value,
      dayName: day.name,
      isClosed: false,
      clinicOpen: '09:00',
      clinicClose: '17:00',
      appointmentStart: '09:00',
      appointmentEnd: '17:00',
      matchClinicHours: true,
    }))
  )

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (data?.clinic_hours) {
      const existingHours = data.clinic_hours
      const updatedHours = DAYS_OF_WEEK.map((day) => {
        const existing = existingHours.find((h) => h.day_of_week === day.value)
        if (existing) {
          const clinicOpen = (existing as any).open_time || '09:00'
          const clinicClose = (existing as any).close_time || '17:00'
          const appointmentStart = (existing as any).appointment_start || clinicOpen
          const appointmentEnd = (existing as any).appointment_end || clinicClose
          // Check if appointment hours match clinic hours
          const matchClinicHours = appointmentStart === clinicOpen && appointmentEnd === clinicClose
          
          return {
            dayOfWeek: day.value,
            dayName: day.name,
            isClosed: existing.is_closed || false,
            clinicOpen,
            clinicClose,
            appointmentStart,
            appointmentEnd,
            matchClinicHours,
          }
        }
        return {
          dayOfWeek: day.value,
          dayName: day.name,
          isClosed: false,
          clinicOpen: '09:00',
          clinicClose: '17:00',
          appointmentStart: '09:00',
          appointmentEnd: '17:00',
          matchClinicHours: true,
        }
      })
      setHours(updatedHours)
      setError(null)
    }
  }, [data])

  const updateDay = (dayOfWeek: number, updates: Partial<DayHours>) => {
    setHours((prev) => {
      const updated = prev.map((day) => {
        if (day.dayOfWeek === dayOfWeek) {
          const newDay = { ...day, ...updates }
          // If matchClinicHours is checked, sync appointment hours with clinic hours
          if (newDay.matchClinicHours && !newDay.isClosed) {
            newDay.appointmentStart = newDay.clinicOpen
            newDay.appointmentEnd = newDay.clinicClose
          }
          return newDay
        }
        return day
      })
      return updated
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const hoursToSave = hours.map((day) => ({
        clinic_id: clinicId,
        day_of_week: day.dayOfWeek,
        is_closed: day.isClosed,
        open_time: day.isClosed ? null : day.clinicOpen || null,
        close_time: day.isClosed ? null : day.clinicClose || null,
        appointment_start: day.isClosed ? null : day.appointmentStart || null,
        appointment_end: day.isClosed ? null : day.appointmentEnd || null,
        is_active: true,
      }))

      await upsertClinicHours({
        variables: {
          hours: hoursToSave,
        },
      })

      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save clinic hours')
    }
  }

  const handleCancel = () => {
    if (data?.clinic_hours) {
      const existingHours = data.clinic_hours
      const updatedHours = DAYS_OF_WEEK.map((day) => {
        const existing = existingHours.find((h) => h.day_of_week === day.value)
        if (existing) {
          const clinicOpen = (existing as any).open_time || '09:00'
          const clinicClose = (existing as any).close_time || '17:00'
          const appointmentStart = (existing as any).appointment_start || clinicOpen
          const appointmentEnd = (existing as any).appointment_end || clinicClose
          const matchClinicHours = appointmentStart === clinicOpen && appointmentEnd === clinicClose
          
          return {
            dayOfWeek: day.value,
            dayName: day.name,
            isClosed: existing.is_closed || false,
            clinicOpen,
            clinicClose,
            appointmentStart,
            appointmentEnd,
            matchClinicHours,
          }
        }
        return {
          dayOfWeek: day.value,
          dayName: day.name,
          isClosed: false,
          clinicOpen: '09:00',
          clinicClose: '17:00',
          appointmentStart: '09:00',
          appointmentEnd: '17:00',
          matchClinicHours: true,
        }
      })
      setHours(updatedHours)
    }
    setError(null)
    onOpenChange(false)
  }

  const copyToAllDays = (sourceDay: DayHours) => {
    setHours((prev) =>
      prev.map((day) => ({
        ...day,
        isClosed: sourceDay.isClosed,
        clinicOpen: sourceDay.clinicOpen,
        clinicClose: sourceDay.clinicClose,
        appointmentStart: sourceDay.appointmentStart,
        appointmentEnd: sourceDay.appointmentEnd,
        matchClinicHours: sourceDay.matchClinicHours,
      }))
    )
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent onClose={handleCancel}>
          <div className="py-8 text-center text-gray-500">Loading clinic hours...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={handleCancel} className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Clinic Hours</DialogTitle>
          <DialogDescription>Set clinic hours and appointment hours for each day of the week</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {hours.map((day) => (
              <div
                key={day.dayOfWeek}
                className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white hover:bg-gray-50 transition-colors"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 min-w-[100px]">{day.dayName}</h3>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={day.isClosed}
                        onChange={(e) => updateDay(day.dayOfWeek, { isClosed: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Closed</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToAllDays(day)}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    title="Copy this day's hours to all days"
                  >
                    Copy to all
                  </button>
                </div>

                {/* Clinic Hours Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Clinic Open</label>
                    <Input
                      type="time"
                      value={day.clinicOpen}
                      onChange={(e) => updateDay(day.dayOfWeek, { clinicOpen: e.target.value })}
                      disabled={day.isClosed}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Clinic Close</label>
                    <Input
                      type="time"
                      value={day.clinicClose}
                      onChange={(e) => updateDay(day.dayOfWeek, { clinicClose: e.target.value })}
                      disabled={day.isClosed}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Appointment Hours Row */}
                <div className="pl-4 border-l-2 border-green-200 space-y-3">
                  {/* Match Checkbox */}
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={day.matchClinicHours}
                      onChange={(e) => updateDay(day.dayOfWeek, { matchClinicHours: e.target.checked })}
                      disabled={day.isClosed}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      title="Same appointment hours as clinic hours"
                    />
                    <span>Same appointment hours</span>
                  </label>

                  {/* Appointment Hours Inputs - Only show when unchecked */}
                  {!day.matchClinicHours && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Appointment Start</label>
                        <Input
                          type="time"
                          value={day.appointmentStart}
                          onChange={(e) => updateDay(day.dayOfWeek, { appointmentStart: e.target.value, matchClinicHours: false })}
                          disabled={day.isClosed}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Appointment End</label>
                        <Input
                          type="time"
                          value={day.appointmentEnd}
                          onChange={(e) => updateDay(day.dayOfWeek, { appointmentEnd: e.target.value, matchClinicHours: false })}
                          disabled={day.isClosed}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Clock className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Hours'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
