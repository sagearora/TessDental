import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Clock, Stethoscope, Edit, Phone, Mail, Globe, MapPin, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useGetUserClinicsQuery, useGetUserEffectiveCapabilitiesQuery } from '@/gql/generated'
import { OperatoryManagement } from '@/components/admin/OperatoryManagement'
import { EditClinicDialog } from '@/components/admin/EditClinicDialog'
import { ClinicHours } from '@/components/admin/ClinicHours'
import { useGetClinicHoursQuery } from '@/gql/generated'

function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return 'Not provided'
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

function formatAddress(clinic: any): string {
  const parts: string[] = []
  if (clinic?.address_street) parts.push(clinic.address_street)
  if (clinic?.address_unit) parts.push(clinic.address_unit)
  if (clinic?.address_city || clinic?.address_province || clinic?.address_postal) {
    const cityParts: string[] = []
    if (clinic.address_city) cityParts.push(clinic.address_city)
    if (clinic.address_province) cityParts.push(clinic.address_province)
    if (clinic.address_postal) cityParts.push(clinic.address_postal)
    parts.push(cityParts.join(', '))
  }
  return parts.length > 0 ? parts.join(', ') : 'Not provided'
}



export function ClinicSettings() {
  const { session } = useAuth()
  const { data: clinicsData, refetch } = useGetUserClinicsQuery({
    skip: !session,
  })

  const { refetch: refetchHours } = useGetClinicHoursQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId,
  })

  const currentClinicUser = clinicsData?.clinic_user_v?.find(
    (cu) => cu.clinic_id === session?.clinicId && cu.user_id === session?.user?.id
  )
  const currentClinic = currentClinicUser?.clinic

  // Check for clinic_manage capability
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
    refetchHours()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clinic Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your clinic information and preferences.
        </p>
      </div>

      {/* Clinic Information Banner */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-end">
            {hasClinicManageCapability && (
              <Button onClick={() => setIsEditDialogOpen(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {currentClinic ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clinic Name</p>
                    <p className="text-base text-gray-900">{currentClinic.name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Timezone</p>
                    <p className="text-base text-gray-900">{currentClinic.timezone || 'Not provided'}</p>
                  </div>
                </div>

                {currentClinic.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base text-gray-900">{formatPhoneNumber(currentClinic.phone)}</p>
                    </div>
                  </div>
                )}

                {currentClinic.fax && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fax</p>
                      <p className="text-base text-gray-900">{formatPhoneNumber(currentClinic.fax)}</p>
                    </div>
                  </div>
                )}

                {currentClinic.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base text-gray-900">{currentClinic.email}</p>
                    </div>
                  </div>
                )}

                {currentClinic.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      <a
                        href={currentClinic.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-blue-600 hover:text-blue-800 underline"
                      >
                        {currentClinic.website}
                      </a>
                    </div>
                  </div>
                )}

                {currentClinic.billing_number && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Billing Number</p>
                      <p className="text-base text-gray-900">{currentClinic.billing_number}</p>
                    </div>
                  </div>
                )}
              </div>

              {(currentClinic.address_street || currentClinic.address_city) && (
                <div className="flex items-start gap-3 pt-2 border-t">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-base text-gray-900">{formatAddress(currentClinic)}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No clinic information available</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Clinic Dialog */}
      {session?.clinicId && (
        <EditClinicDialog
          clinicId={session.clinicId}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <CardTitle>Clinic Hours</CardTitle>
          </div>
          <CardDescription>Set your clinic's operating hours for each day of the week</CardDescription>
        </CardHeader>
        <CardContent>
          {session?.clinicId ? (
            <ClinicHours clinicId={session.clinicId} onSuccess={handleEditSuccess} />
          ) : (
            <p className="text-sm text-gray-500">No clinic selected</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <CardTitle>Operatories</CardTitle>
          </div>
          <CardDescription>Manage operatories for your clinic</CardDescription>
        </CardHeader>
        <CardContent>
          {session?.clinicId ? (
            <OperatoryManagement clinicId={session.clinicId} />
          ) : (
            <p className="text-sm text-gray-500">No clinic selected</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
