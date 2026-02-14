import { Button } from '@/components/ui/button'
import { useGetClinicHoursQuery, useGetUserClinicsQuery, useGetUserEffectiveCapabilitiesQuery } from '@/gql/generated'
import { Edit } from 'lucide-react'
import { EditClinicHoursDialog } from './EditClinicHoursDialog'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface ClinicHoursProps {
  clinicId: number
  onSuccess?: () => void
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

function formatTimeTo12Hour(time: string | null | undefined): string {
  if (!time) return '—'
  
  // Extract hours and minutes from HH:MM:SS or HH:MM format
  const timeStr = time.substring(0, 5) // Get HH:MM
  const [hours, minutes] = timeStr.split(':').map(Number)
  
  if (isNaN(hours) || isNaN(minutes)) return '—'
  
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function ClinicHours({ clinicId, onSuccess }: ClinicHoursProps) {
  const { session } = useAuth()
  const { data, loading, refetch } = useGetClinicHoursQuery({
    variables: { clinicId },
    skip: !clinicId || clinicId === 0,
    notifyOnNetworkStatusChange: false,
  })

  const { data: clinicsData } = useGetUserClinicsQuery({
    skip: !session,
  })

  const currentClinicUser = clinicsData?.clinic_user_v?.find(
    (cu) => cu.clinic_id === session?.clinicId && cu.user_id === session?.user?.id
  )

  const { data: capabilitiesData, loading: capabilitiesLoading } = useGetUserEffectiveCapabilitiesQuery({
    variables: { 
      clinicId: session?.clinicId || 0,
      userId: session?.user?.id || '',
    },
    skip: !session?.clinicId || !session?.user?.id,
  })

  const capabilities = new Set(
    capabilitiesData?.clinic_user_effective_capabilities_v
      ?.map((c) => c.capability_key)
      .filter((key): key is string => key !== null && key !== undefined) || []
  )

  const hasClinicManageCapability = !capabilitiesLoading && (capabilities.has('clinic_manage') || capabilities.has('system_admin'))

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditSuccess = () => {
    refetch()
    onSuccess?.()
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading clinic hours...</div>
  }

  const hours = data?.clinic_hours || []
  const hoursByDay = new Map(hours.map((h) => [h.day_of_week, h]))

  return (
    <div className="space-y-4">
      {hasClinicManageCapability && (
        <div className="flex justify-end">
          <Button type="button" onClick={() => setIsEditDialogOpen(true)} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Hours
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Day</th>
            <th className="text-center py-3 px-4 font-medium text-gray-700">Clinic Hours</th>
            </tr>
          </thead>
          <tbody>
            {DAYS_OF_WEEK.map((day) => {
              const dayHours = hoursByDay.get(day.value)
              const isClosed = dayHours?.is_closed ?? false
              const clinicOpen = (dayHours as any)?.open_time
              const clinicClose = (dayHours as any)?.close_time
              const appointmentStart = (dayHours as any)?.appointment_start
              const appointmentEnd = (dayHours as any)?.appointment_end

              // Check if appointment hours differ from clinic hours
              const appointmentDiffers =
                !isClosed &&
                clinicOpen &&
                clinicClose &&
                appointmentStart &&
                appointmentEnd &&
                (appointmentStart !== clinicOpen || appointmentEnd !== clinicClose)

              return (
                <tr key={day.value} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{day.name}</td>
                  <td className="py-3 px-4">
                    <div className="text-center text-gray-900">
                      {isClosed ? (
                        <span className="text-gray-500">Closed</span>
                      ) : clinicOpen && clinicClose ? (
                        <div className="space-y-1">
                          <div>
                            {formatTimeTo12Hour(clinicOpen)} - {formatTimeTo12Hour(clinicClose)}
                          </div>
                          {appointmentDiffers ? (
                            <div className="text-xs text-gray-600">
                              Appointments: {formatTimeTo12Hour(appointmentStart)} - {formatTimeTo12Hour(appointmentEnd)}
                            </div>
                          ) : !isClosed && appointmentStart && appointmentEnd ? (
                            <div className="text-xs text-gray-500 italic">
                              Same appointment hours
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {clinicId && (
        <EditClinicHoursDialog
          clinicId={clinicId}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}
