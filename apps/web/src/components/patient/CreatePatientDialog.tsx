import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent } from '@/components/ui/popover'
import {
  useGetPatientFieldConfigQuery,
  useGetGenderEnumQuery,
  useGetReferralKindEnumQuery,
  useGetReferralSourcesQuery,
  useUpsertPatientReferralMutation,
  useGetClinicQuery,
  useCreatePatientWithRelationsMutation,
  useCreateAddressMutation,
  useGetPersonAddressIdsLazyQuery,
  type Referral_Kind_Enum_Enum,
} from '@/gql/generated'
import { useUnifiedPatientSearch } from '@/hooks/useUnifiedPatientSearch'
import { useAuth } from '@/contexts/AuthContext'
import { Label } from '@/components/ui/label'

interface CreatePatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreatePatientDialog({ open, onOpenChange, onSuccess }: CreatePatientDialogProps) {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: fieldConfigData, loading: fieldConfigLoading, error: fieldConfigError } = useGetPatientFieldConfigQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId || !open,
  })

  const { data: genderEnumData } = useGetGenderEnumQuery({
    skip: !open,
  })

  const { data: referralKindData } = useGetReferralKindEnumQuery({
    skip: !open,
  })

  const { data: referralSourcesData } = useGetReferralSourcesQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId || !open,
  })

  const { data: clinicData } = useGetClinicQuery({
    variables: { clinicId: session?.clinicId || 0 },
    skip: !session?.clinicId || !open,
  })

  const clinicProvince = clinicData?.clinic_v?.[0]?.address_province || ''

  // Initialize province with clinic's province when dialog opens
  useEffect(() => {
    if (open && clinicProvince && !formData.province) {
      setFormData(prev => ({ ...prev, province: clinicProvince }))
    }
  }, [open, clinicProvince])

  // Reset household-head-specific state whenever the dialog is (re)opened
  useEffect(() => {
    if (!open) return
    setSelectedHouseholdHeadId(null)
    setSelectedHouseholdHeadName('')
    setHouseholdRelationship('child')
    setUseDifferentAddress(false)
    setHeadHasMailingAddress(false)
    setHeadMailingAddressSummary(null)
    setHeadMailingAddress(null)
    setHeadHasEmail(false)
    setHeadEmail(null)
    setUseDifferentEmail(false)
    setHeadHasPhone(false)
    setHeadPhone(null)
    setUseDifferentPhone(false)
    setHouseholdHeadQuery('')
  }, [open])

  const [createPatientWithRelations] = useCreatePatientWithRelationsMutation()
  const [upsertPatientReferral] = useUpsertPatientReferralMutation()
  const [createAddress] = useCreateAddressMutation()

  // Referral state (only used when household head is NOT selected)
  const [referralKind, setReferralKind] = useState<Referral_Kind_Enum_Enum|undefined>()
  const [referralSourceId, setReferralSourceId] = useState<string>('')
  const [referralContactPersonId, setReferralContactPersonId] = useState<string>('')
  const [referralContactPersonName, setReferralContactPersonName] = useState<string>('')
  const [referralOtherText, setReferralOtherText] = useState<string>('')
  const [isReferralContactPopoverOpen, setIsReferralContactPopoverOpen] = useState(false)
  const referralContactInputRef = useRef<HTMLInputElement>(null)

  // Household head state (must be declared before fields filtering)
  const [selectedHouseholdHeadId, setSelectedHouseholdHeadId] = useState<number | null>(null)
  const [selectedHouseholdHeadName, setSelectedHouseholdHeadName] = useState<string>('')
  const [householdRelationship, setHouseholdRelationship] = useState<string>('child')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const householdHeadInputRef = useRef<HTMLInputElement>(null)
  const [useDifferentAddress, setUseDifferentAddress] = useState(false)
  const [headHasMailingAddress, setHeadHasMailingAddress] = useState(false)
  const [headMailingAddressSummary, setHeadMailingAddressSummary] = useState<string | null>(null)
  const [headMailingAddress, setHeadMailingAddress] = useState<{
    line1?: string | null
    line2?: string | null
    city?: string | null
    region?: string | null
    postal_code?: string | null
    country?: string | null
  } | null>(null)
  const [isHeadAddressLoading, setIsHeadAddressLoading] = useState(false)
  const [headHasEmail, setHeadHasEmail] = useState(false)
  const [headEmail, setHeadEmail] = useState<string | null>(null)
  const [useDifferentEmail, setUseDifferentEmail] = useState(false)
  const [headHasPhone, setHeadHasPhone] = useState(false)
  const [headPhone, setHeadPhone] = useState<string | null>(null)
  const [useDifferentPhone, setUseDifferentPhone] = useState(false)

  const formatPhone = (value: string | null | undefined) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '')
    if (digits.length === 11 && digits.startsWith('1')) {
      // Strip leading country code for formatting
      const local = digits.slice(1)
      return `+1 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    }
    return value
  }

  // Helper function to normalize phone number to E.164 format (duplicated from PersonProfile)
  const normalizePhoneToE164 = (phone: string): string | null => {
    if (!phone) return null
    const digits = phone.replace(/\D/g, '')
    if (digits.length === 0) return null

    if (digits.length === 11 && digits[0] === '1') {
      return `+${digits}`
    }

    if (digits.length === 10) {
      return `+1${digits}`
    }

    if (digits.length > 10) {
      return `+${digits}`
    }

    return null
  }

  // Get all configured fields from patient_field_config, sorted by display_order
  const configuredFields = (Array.isArray(fieldConfigData?.patient_field_config) 
    ? fieldConfigData.patient_field_config
        .filter((f) =>
          f.is_displayed &&
          f.field_config?.is_active !== false &&
          f.field_config?.key !== 'head_of_household' &&
          f.field_config?.key !== 'responsible_party' &&
          !f.field_config?.key?.toLowerCase().includes('household') &&
          // Hide referral field if household head is selected
          !(selectedHouseholdHeadId && f.field_config?.key === 'referred_by')
        )
        .map((f) => ({
          ...f,
          field_key: f.field_config?.key || '',
          field_label: f.field_config?.label || '',
        }))
        // Sort by display_order from patient_field_config
        .sort((a, b) => a.display_order - b.display_order)
    : [])

  // Make email and cell phone optional if household head is selected
  const processedFields = configuredFields.map((f) => {
    if (selectedHouseholdHeadId && (f.field_key === 'email' || f.field_key === 'cell_phone' || f.field_key === 'phone')) {
      return { ...f, is_required: false }
    }
    return f
  })
  const genderOptions = genderEnumData?.gender_enum || []
  const referralKindOptions = referralKindData?.referral_kind_enum || []
  const referralSources = referralSourcesData?.referral_source || []

  // Unified patient search for household head selection
  const {
    query: householdHeadQuery,
    setQuery: setHouseholdHeadQuery,
    results: householdHeadResults,
    hasQuery: hasHouseholdHeadQuery,
    loading: householdHeadLoading,
  } = useUnifiedPatientSearch({ limit: 10 })

  const [fetchHeadAddressIds] = useGetPersonAddressIdsLazyQuery()

  // Unified patient search for referral contact
  const {
    query: referralSearchQuery,
    setQuery: setReferralSearchQuery,
    results: referralContactResults,
    hasQuery: hasReferralQuery,
    loading: referralSearchLoading,
  } = useUnifiedPatientSearch({ limit: 10 })


  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!session?.clinicId) {
      setError('No clinic selected')
      return
    }

    // Validate required fields (using processedFields to account for optional fields when household head is selected)
    const requiredFields = processedFields.filter((f) => f.is_required)
    const missingFields: typeof processedFields = []

    for (const field of requiredFields) {
      if (field.field_key === 'referred_by') {
        // Special validation for referral field (only if household head is not selected)
        if (!selectedHouseholdHeadId) {
          if (!referralKind) {
            missingFields.push(field)
          } else if (referralKind === 'source' && !referralSourceId) {
            missingFields.push(field)
          } else if (referralKind === 'contact' && !referralContactPersonId) {
            missingFields.push(field)
          } else if (referralKind === 'other' && !referralOtherText) {
            missingFields.push(field)
          }
        }
      } else {
        const isAddressField = [
          'street_address',
          'city',
          'province',
          'postal_code',
          'address',
          'mailing_address',
          'state',
          'zip',
        ].includes(field.field_key)

        // If a household head is selected and we're inheriting their address,
        // skip enforcing required validation on address fields.
        if (isAddressField && selectedHouseholdHeadId && headHasMailingAddress && !useDifferentAddress) {
          continue
        }

        if (!formData[field.field_key]) {
          missingFields.push(field)
        }
      }
    }

    if (missingFields.length > 0) {
      setError(`Please fill in required fields: ${missingFields.map((f) => f.field_label).join(', ')}`)
      return
    }

    setIsSubmitting(true)

    try {
      // Build contact points array (only include if values are provided)
      const contactPoints: any[] = []
      if (formData.email) {
        contactPoints.push({
          kind: 'email',
          value: formData.email,
          is_primary: true,
          is_active: true,
        })
      }
      const rawPhone = formData.cell_phone || formData.phone
      if (rawPhone) {
        const phoneE164 = normalizePhoneToE164(rawPhone)
        if (!phoneE164) {
          throw new Error('Invalid phone number format. Please enter a valid phone number.')
        }
        contactPoints.push({
          kind: 'cell_phone',
          value: rawPhone,
          phone_e164: phoneE164,
          is_primary: true,
          is_active: true,
        })
      }

      // Determine mailing/billing address behavior
      // 1) If a household head is selected and we're NOT using a different address,
      //    inherit their mailing/billing address IDs.
      // 2) Otherwise, create a new address only if the user has entered any address fields.
      let mailingAddressId: number | null = null
      let billingAddressId: number | null = null

      const hasAddress =
        !!formData.street_address ||
        !!formData.city ||
        !!formData.postal_code ||
        // Treat province as signal only if user actually changed it (not just the clinic default)
        (formData.province && formData.province !== clinicProvince)

      if (selectedHouseholdHeadId && headHasMailingAddress && !useDifferentAddress) {
        const { data: headData } = await fetchHeadAddressIds({
          variables: {
            personId: selectedHouseholdHeadId,
            clinicId: session.clinicId,
          },
        })
        const head = headData?.person?.[0] as any
        mailingAddressId = (head?.mailing_address_id as number | null | undefined) ?? null
        // Default billing to head's billing address, or fall back to mailing if billing is null
        const headBilling = head?.billing_address_id as number | null | undefined
        billingAddressId = headBilling ?? mailingAddressId
      } else if (hasAddress) {
        const addressResult = await createAddress({
          variables: {
            line1: formData.street_address || '',
            line2: formData.address_unit || null,
            city: formData.city || '',
            region: formData.province || clinicProvince || '',
            postalCode: formData.postal_code || '',
            country: 'Canada',
          },
        })
        mailingAddressId = addressResult.data?.insert_address_one?.id || null
        billingAddressId = mailingAddressId
      }

      // Determine responsible_party_id: if household head is selected, use it; otherwise null
      const responsiblePartyId = selectedHouseholdHeadId ? Number(selectedHouseholdHeadId) : null

      // Create person with all related data in one mutation using nested inserts
      const result = await createPatientWithRelations({
        variables: {
          clinicId: session.clinicId,
          firstName: formData.first_name || '',
          lastName: formData.last_name || '',
          preferredName: formData.preferred_name || null,
          dob: formData.dob || null,
          gender: formData.gender || null,
          preferredLanguage: formData.preferred_language || null,
          householdHeadId: selectedHouseholdHeadId ? Number(selectedHouseholdHeadId) : null,
          householdRelationship: selectedHouseholdHeadId ? ((householdRelationship === 'guardian' ? 'other' : householdRelationship) as 'self' | 'child' | 'spouse' | 'parent' | 'sibling' | 'other') : null,
          responsiblePartyId: responsiblePartyId,
          chartNo: formData.chart_no || null,
          status: formData.status || 'active',
          familyDoctorName: formData.family_doctor_name || null,
          familyDoctorPhone: formData.family_doctor_phone || null,
          imagingId: formData.imaging_id || null,
          contactPoints: contactPoints,
          mailingAddressId: mailingAddressId,
          billingAddressId: billingAddressId,
        },
      })

      const personId = result.data?.insert_person_one?.id
      if (!personId) {
        throw new Error('Failed to create person')
      }

      // Create referral if provided (only if no household head is selected)
      if (!selectedHouseholdHeadId && referralKind) {
        await upsertPatientReferral({
          variables: {
            patientPersonId: personId,
            referralKind,
            referralSourceId: referralKind === 'source' && referralSourceId ? parseInt(referralSourceId) : null,
            referralContactPersonId: referralKind === 'contact' && referralContactPersonId ? parseInt(referralContactPersonId) : null,
            referralOtherText: referralKind === 'other' ? referralOtherText : null,
          },
        })
      }

      // Reset form
      setFormData({})
      setReferralKind(undefined)
      setReferralSourceId('')
      setReferralContactPersonId('')
      setReferralOtherText('')
      setSelectedHouseholdHeadId(null)
      setHouseholdRelationship('child')
      setUseDifferentAddress(false)
      onOpenChange(false)
      onSuccess?.()

      // Navigate to the patient profile page
      navigate(`/profile/${personId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create patient')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: typeof processedFields[0]) => {
    const value = formData[field.field_key] || ''
    const isRequired = field.is_required

    switch (field.field_key) {
      case 'first_name':
      case 'last_name':
      case 'preferred_name':
      case 'middle_name':
      case 'nickname':
        return (
          <Input
            key={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={field.field_label}
            required={isRequired}
          />
        )

      case 'dob':
        return (
          <Input
            key={field.id}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            required={isRequired}
          />
        )

      case 'gender':
        return (
          <select
            key={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required={isRequired}
          >
            <option value="">Select gender...</option>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.comment || option.value}
              </option>
            ))}
          </select>
        )

      case 'preferred_language':
      case 'language':
        return (
          <Input
            key={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={field.field_label}
            required={isRequired}
          />
        )

      case 'email':
        return (
          <Input
            key={field.id}
            type="email"
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={field.field_label}
            required={isRequired}
          />
        )

      case 'cell_phone':
      case 'home_phone':
      case 'work_phone': {
        // Format the phone number for display
        const displayValue = formatPhone(value)
        return (
          <Input
            key={field.id}
            type="tel"
            value={displayValue}
            onChange={(e) => {
              // Extract only digits from input and store raw value
              const rawValue = e.target.value.replace(/\D/g, '')
              handleFieldChange(field.field_key, rawValue)
            }}
            onBlur={(e) => {
              // Ensure value is stored as raw digits
              const rawValue = e.target.value.replace(/\D/g, '')
              handleFieldChange(field.field_key, rawValue)
            }}
            placeholder={field.field_label}
            required={isRequired}
          />
        )
      }

      case 'chart_no':
      case 'client_number':
        return (
          <Input
            key={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={field.field_label}
            required={isRequired}
          />
        )

      case 'status':
        return (
          <select
            key={field.id}
            value={value || 'active'}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required={isRequired}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        )

      case 'referred_by':
        return (
          <div key={field.id} className="space-y-2 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Referral Kind */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Referral Type</Label>
                <select
                  value={referralKind}
                  onChange={(e) => {
                    setReferralKind(e.target.value as Referral_Kind_Enum_Enum)
                    // Clear other referral fields when kind changes
                    setReferralSourceId('')
                    setReferralContactPersonId('')
                    setReferralContactPersonName('')
                    setReferralOtherText('')
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required={isRequired}
                >
                  <option value="">Select referral type...</option>
                  {referralKindOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.comment || option.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Second field based on referral kind */}
              {referralKind === 'source' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Referral Source</Label>
                  <select
                    value={referralSourceId}
                    onChange={(e) => setReferralSourceId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required={isRequired}
                  >
                    <option value="">Select referral source...</option>
                    {referralSources.map((source) => (
                      <option key={source.id} value={source.id.toString()}>
                        {source.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {referralKind === 'contact' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Referred By (Patient)</Label>
                  <Popover open={isReferralContactPopoverOpen} onOpenChange={setIsReferralContactPopoverOpen}>
                    <div className="relative">
                      <Input
                        ref={referralContactInputRef}
                        placeholder="Search by name, phone, or chart number..."
                        value={referralContactPersonId ? referralContactPersonName : referralSearchQuery}
                        onChange={(e) => {
                          const v = e.target.value
                          setReferralSearchQuery(v)
                          setReferralContactPersonId('')
                          setReferralContactPersonName('')
                          if (!isReferralContactPopoverOpen && v.trim()) {
                            setIsReferralContactPopoverOpen(true)
                          }
                        }}
                        onFocus={() => {
                          if (hasReferralQuery) {
                            setIsReferralContactPopoverOpen(true)
                          }
                        }}
                        onBlur={(e) => {
                          setTimeout(() => {
                            if (!e.currentTarget?.contains(document.activeElement)) {
                              setIsReferralContactPopoverOpen(false)
                            }
                          }, 200)
                        }}
                        className={referralContactPersonId ? "pr-8" : ""}
                        required={isRequired}
                      />
                      {referralContactPersonId && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            setReferralContactPersonId('')
                            setReferralContactPersonName('')
                            setReferralSearchQuery('')
                            referralContactInputRef.current?.focus()
                          }}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                    <PopoverContent
                      className="p-0"
                      align="start"
                      triggerRef={referralContactInputRef}
                    >
                      {hasReferralQuery && (
                        <div className="space-y-1 max-h-48 overflow-y-auto p-1">
                          {referralContactResults.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault()
                              }}
                              onClick={() => {
                                setReferralContactPersonId(p.id.toString())
                                setReferralContactPersonName(p.displayName || 'Unknown')
                                setReferralSearchQuery('')
                                setIsReferralContactPopoverOpen(false)
                                referralContactInputRef.current?.blur()
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-gray-100"
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {p.displayName || 'Unknown'}
                              </p>
                            </button>
                          ))}
                          {referralContactResults.length === 0 && !referralSearchLoading && (
                            <p className="text-sm text-gray-500 text-center py-2">
                              No patients found
                            </p>
                          )}
                        </div>
                      )}
                      {!hasReferralQuery && (
                        <div className="p-2">
                          <p className="text-sm text-gray-500 text-center py-2">
                            Start typing to search...
                          </p>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {referralKind === 'other' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Other Information</Label>
                  <Input
                    value={referralOtherText}
                    onChange={(e) => setReferralOtherText(e.target.value)}
                    placeholder="Enter referral information"
                    required={isRequired}
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 'family_doctor_name':
      case 'family_doctor_phone':
      case 'imaging_id':
      case 'contact_method':
        return (
          <Input
            key={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={field.field_label}
            required={isRequired}
          />
        )

      default:
        return (
          <Input
            key={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
            placeholder={field.field_label}
            required={isRequired}
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Create New Patient</DialogTitle>
          <DialogDescription>
            Fill in the patient information. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            {error}
          </div>
        )}

        {fieldConfigError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            Failed to load field configuration: {fieldConfigError.message}
          </div>
        )}

        {!session?.clinicId && open && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            No clinic selected. Please select a clinic to create a patient.
          </div>
        )}

        {fieldConfigLoading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            Loading form fields...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name fields - First, Middle, Last in 3 columns at the top */}
          {/* These are already sorted by display_order from processedFields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {processedFields
              .filter((f) => ['first_name', 'middle_name', 'last_name'].includes(f.field_key))
              .map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {field.field_label}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
          </div>

          {/* Render fields in display_order, handling special cases */}
          {(() => {
            // Get special fields for reference
            const emailField = processedFields.find((f) => f.field_key === 'email')
            const phoneField = processedFields.find((f) => f.field_key === 'cell_phone' || f.field_key === 'phone')
            const referredByField = processedFields.find((f) => f.field_key === 'referred_by')
            const addressFields = processedFields.filter((f) =>
              ['address', 'street_address', 'mailing_address', 'city', 'state', 'zip', 'postal_code'].includes(f.field_key)
            )
            
            // Get the display_order thresholds
            const emailOrder = emailField?.display_order ?? Infinity
            const phoneOrder = phoneField?.display_order ?? Infinity
            const referredByOrder = referredByField?.display_order ?? Infinity
            const minAddressOrder = addressFields.length > 0 ? Math.min(...addressFields.map(f => f.display_order)) : Infinity
            const contactSectionOrder = Math.min(emailOrder, phoneOrder)
            
            // Split fields into sections based on display_order
            const fieldsBeforeContact = processedFields.filter((f) => {
              const key = f.field_key
              return !['first_name', 'middle_name', 'last_name', 'email', 'cell_phone', 'phone', 'address', 'street_address', 'mailing_address', 'city', 'state', 'zip', 'postal_code', 'referred_by'].includes(key) &&
                     f.display_order < contactSectionOrder &&
                     (!referredByField || f.display_order < referredByOrder)
            })
            
            const fieldsBetweenContactAndReferredBy = processedFields.filter((f) => {
              const key = f.field_key
              return !['first_name', 'middle_name', 'last_name', 'email', 'cell_phone', 'phone', 'address', 'street_address', 'mailing_address', 'city', 'state', 'zip', 'postal_code', 'referred_by'].includes(key) &&
                     f.display_order >= contactSectionOrder &&
                     (!referredByField || f.display_order < referredByOrder)
            })
            
            const fieldsAfterReferredBy = processedFields.filter((f) => {
              const key = f.field_key
              return !['first_name', 'middle_name', 'last_name', 'email', 'cell_phone', 'phone', 'address', 'street_address', 'mailing_address', 'city', 'state', 'zip', 'postal_code', 'referred_by'].includes(key) &&
                     referredByField && f.display_order > referredByOrder
            })
            
            return (
              <>
                {/* Fields before contact section */}
                {fieldsBeforeContact.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fieldsBeforeContact.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {field.field_label}
                          {field.is_required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Referred By - if it comes before contact section */}
                {referredByField && !selectedHouseholdHeadId && referredByOrder < contactSectionOrder && (
                  <div className="space-y-2 pt-4 border-t">
                    <label className="text-sm font-medium text-gray-700">
                      {referredByField.field_label}
                      {referredByField.is_required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(referredByField)}
                  </div>
                )}
                
                {/* Fields between contact and referred_by */}
                {fieldsBetweenContactAndReferredBy.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fieldsBetweenContactAndReferredBy.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {field.field_label}
                          {field.is_required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Referred By - if it comes after contact section but before address */}
                {referredByField && !selectedHouseholdHeadId && referredByOrder >= contactSectionOrder && referredByOrder < minAddressOrder && (
                  <div className="space-y-2 pt-4 border-t">
                    <label className="text-sm font-medium text-gray-700">
                      {referredByField.field_label}
                      {referredByField.is_required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(referredByField)}
                  </div>
                )}
                
                {/* Fields after referred_by */}
                {fieldsAfterReferredBy.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fieldsAfterReferredBy.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {field.field_label}
                          {field.is_required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          })()}

          {/* Household Head Selection - Right after fields section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Household Head (Optional)</Label>
              <div className="space-y-2">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <div className="relative">
                    <Input
                      ref={householdHeadInputRef}
                      id="householdHeadSearch"
                      placeholder="Search by name or phone..."
                      value={selectedHouseholdHeadId ? selectedHouseholdHeadName : householdHeadQuery}
                      onChange={(e) => {
                        const v = e.target.value
                        setHouseholdHeadQuery(v)
                        setSelectedHouseholdHeadId(null)
                        setSelectedHouseholdHeadName('')
                        if (!isPopoverOpen && v.trim()) {
                          setIsPopoverOpen(true)
                        }
                      }}
                      onFocus={() => {
                        if (hasHouseholdHeadQuery) {
                          setIsPopoverOpen(true)
                        }
                      }}
                      onBlur={(e) => {
                        // Delay closing to allow click on popover items
                        setTimeout(() => {
                          if (!e.currentTarget?.contains(document.activeElement)) {
                            setIsPopoverOpen(false)
                          }
                        }, 200)
                      }}
                      className={selectedHouseholdHeadId ? "pr-8" : ""}
                    />
                    {selectedHouseholdHeadId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedHouseholdHeadId(null)
                          setSelectedHouseholdHeadName('')
                          setHouseholdHeadQuery('')
                          setHouseholdRelationship('child')
                          setHeadHasMailingAddress(false)
                          setHeadMailingAddressSummary(null)
                          setUseDifferentAddress(false)
                          setHeadHasEmail(false)
                          setHeadEmail(null)
                          setUseDifferentEmail(false)
                          setHeadHasPhone(false)
                          setHeadPhone(null)
                          setUseDifferentPhone(false)
                          householdHeadInputRef.current?.focus()
                        }}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <PopoverContent
                    className="p-0"
                    align="start"
                    triggerRef={householdHeadInputRef}
                  >
                    {hasHouseholdHeadQuery && (
                      <div className="space-y-1 max-h-48 overflow-y-auto p-1">
                        {householdHeadResults.map((p) => {
                          const fullName = p.displayName || 'Unknown'
                          const isIneligible = !!p.householdHeadId
                          const hohLabel = p.householdHeadName || 'Unknown'
                          return (
                            <button
                              key={p.id}
                              type="button"
                              disabled={isIneligible}
                              onMouseDown={(e) => {
                                e.preventDefault() // Prevent input blur
                              }}
                              onClick={() => {
                                if (isIneligible) return
                                setSelectedHouseholdHeadId(p.id)
                                setSelectedHouseholdHeadName(fullName)
                                setHouseholdHeadQuery('')
                                setIsPopoverOpen(false)
                                householdHeadInputRef.current?.blur()
                                // Fetch household head mailing address to determine whether to inherit it
                                if (session?.clinicId) {
                                  setIsHeadAddressLoading(true)
                                  setHeadHasMailingAddress(false)
                                  setHeadMailingAddressSummary(null)
                                  setHeadMailingAddress(null)
                                  setUseDifferentAddress(false)
                                  setHeadHasEmail(false)
                                  setHeadEmail(null)
                                  setUseDifferentEmail(false)
                                  setHeadHasPhone(false)
                                  setHeadPhone(null)
                                  setUseDifferentPhone(false)
                                  fetchHeadAddressIds({
                                    variables: {
                                      personId: p.id,
                                      clinicId: session.clinicId,
                                    },
                                  })
                                    .then(({ data }) => {
                                      const head = data?.person?.[0] as any
                                      const mailing = head?.mailing_address
                                      const hasMailing =
                                        !!head?.mailing_address_id && !!mailing
                                      setHeadHasMailingAddress(hasMailing)
                                      if (hasMailing) {
                                        setHeadMailingAddress(mailing)
                                        const line1 = mailing.line1 || ''
                                        const line2 = mailing.line2 || ''
                                        const cityRegion = [mailing.city, mailing.region]
                                          .filter(Boolean)
                                          .join(', ')
                                        const postal = mailing.postal_code || ''
                                        const country = mailing.country || ''
                                        const lineCity = [cityRegion, postal].filter(Boolean).join(' ')
                                        const parts = [line1, line2, lineCity, country].filter(Boolean)
                                        setHeadMailingAddressSummary(parts.join('\n'))
                                      }

                                      // Derive email and phone from contact points
                                      const cps: any[] = head?.person_contact_point || []
                                      const primaryEmail = cps.find(
                                        (cp) => cp.kind === 'email' && cp.is_primary,
                                      ) || cps.find((cp) => cp.kind === 'email')
                                      const primaryPhone = cps.find(
                                        (cp) => (cp.kind === 'cell_phone' || cp.kind === 'home_phone' || cp.kind === 'work_phone') && cp.is_primary,
                                      ) || cps.find((cp) => cp.kind === 'cell_phone' || cp.kind === 'home_phone' || cp.kind === 'work_phone')

                                      if (primaryEmail?.value) {
                                        setHeadHasEmail(true)
                                        setHeadEmail(primaryEmail.value as string)
                                      }
                                      if (primaryPhone?.value) {
                                        setHeadHasPhone(true)
                                        setHeadPhone(primaryPhone.value as string)
                                      }
                                    })
                                    .finally(() => {
                                      setIsHeadAddressLoading(false)
                                    })
                                }
                              }}
                              className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 ${selectedHouseholdHeadId === p.id ? 'bg-blue-50' : ''
                                } ${isIneligible ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {fullName}
                              </p>
                              {p.phone && (
                                <p className="text-xs text-gray-500">
                                  {p.phone}
                                </p>
                              )}
                              {isIneligible && (
                                <p className="text-xs text-red-500">
                                  HOH: {hohLabel}
                                </p>
                              )}
                            </button>
                          )
                        })}
                        {householdHeadResults.length === 0 && !householdHeadLoading && (
                          <p className="text-sm text-gray-500 text-center py-2">
                            No household heads found
                          </p>
                        )}
                      </div>
                    )}
                    {!hasHouseholdHeadQuery && (
                      <div className="p-2">
                        <p className="text-sm text-gray-500 text-center py-2">
                          Start typing to search...
                        </p>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              {selectedHouseholdHeadId && (
                <div className="space-y-2">
                  <Label htmlFor="householdRelationship">Relationship to household head</Label>
                  <select
                    id="householdRelationship"
                    value={householdRelationship}
                    onChange={(e) => setHouseholdRelationship(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="child">Child</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Email, Cell Phone, and Address fields - Below household head section */}
          <div className="space-y-4 pt-4 border-t">
            {/* Email and Cell Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              {processedFields.find((f) => f.field_key === 'email') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  {selectedHouseholdHeadId && headHasEmail && !useDifferentEmail && headEmail
                    ? (
                      <button
                        type="button"
                        className="block text-sm font-medium text-gray-900 text-left hover:underline"
                        onClick={() => {
                          setUseDifferentEmail(true)
                          setFormData((prev) => ({
                            ...prev,
                            email: headEmail,
                          }))
                        }}
                      >
                        {headEmail}
                      </button>
                    ) : (
                      renderField(
                        processedFields.find((f) => f.field_key === 'email') as (typeof processedFields)[0],
                      )
                    )}
                </div>
              )}

              {/* Cell / Phone */}
              {processedFields.find((f) => f.field_key === 'cell_phone' || f.field_key === 'phone') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Cell Phone
                  </label>
                  {selectedHouseholdHeadId && headHasPhone && !useDifferentPhone && headPhone
                    ? (
                      <button
                        type="button"
                        className="text-sm block font-medium text-gray-900 text-left hover:underline"
                        onClick={() => {
                          setUseDifferentPhone(true)
                          const phoneField = processedFields.find(
                            (f) => f.field_key === 'cell_phone' || f.field_key === 'phone',
                          )
                          if (phoneField) {
                            setFormData((prev) => ({
                              ...prev,
                              [phoneField.field_key]: headPhone,
                            }))
                          }
                        }}
                      >
                        {formatPhone(headPhone)}
                      </button>
                    ) : (
                      renderField(
                        (processedFields.find(
                          (f) => f.field_key === 'cell_phone' || f.field_key === 'phone',
                        ) as (typeof processedFields)[0]),
                      )
                    )}
                </div>
              )}
            </div>

            {/* Referred By - if it comes after address section */}
            {!selectedHouseholdHeadId && (() => {
              const referredByField = processedFields.find((f) => f.field_key === 'referred_by')
              const addressFields = processedFields.filter((f) =>
                ['address', 'street_address', 'mailing_address', 'city', 'state', 'zip', 'postal_code'].includes(f.field_key)
              )
              const minAddressOrder = addressFields.length > 0 ? Math.min(...addressFields.map(f => f.display_order)) : Infinity
              
              return referredByField && referredByField.display_order >= minAddressOrder && (
                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium text-gray-700">
                    {referredByField.field_label}
                    {referredByField.is_required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(referredByField)}
                </div>
              )
            })()}

            {/* Address fields: Street, Unit/Apt, City, Province, Postal Code */}
            {selectedHouseholdHeadId && !useDifferentAddress && (
              <div className="space-y-2">
                {isHeadAddressLoading ? (
                  <p className="text-sm text-gray-600">Loading household head address...</p>
                ) : headHasMailingAddress && headMailingAddressSummary ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      This patient will use the household head&apos;s mailing and billing address:
                    </p>
                    <button
                      type="button"
                      className="text-sm font-medium text-gray-900 whitespace-pre-line text-left hover:underline"
                      onClick={() => {
                        setUseDifferentAddress(true)
                        if (headMailingAddress) {
                          setFormData((prev) => ({
                            ...prev,
                            street_address: headMailingAddress.line1 || '',
                            address_unit: headMailingAddress.line2 || '',
                            city: headMailingAddress.city || '',
                            province: headMailingAddress.region || clinicProvince,
                            postal_code: headMailingAddress.postal_code || '',
                          }))
                        }
                      }}
                    >
                      {headMailingAddressSummary}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    The selected household head does not have a mailing address on file. Please enter an address
                    for this patient below.
                  </p>
                )}
              </div>
            )}

            {(!selectedHouseholdHeadId || !headHasMailingAddress || useDifferentAddress) && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Street Address - Full width */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="street_address" className="text-sm font-medium text-gray-700">
                      Street Address
                    </Label>
                    <Input
                      id="street_address"
                      value={formData.street_address || formData.address_street || ''}
                      onChange={(e) => handleFieldChange('street_address', e.target.value)}
                      placeholder="Street Address"
                    />
                  </div>

                  {/* Unit/Apt */}
                  <div className="space-y-2">
                    <Label htmlFor="address_unit" className="text-sm font-medium text-gray-700">
                      Unit / Apt
                    </Label>
                    <Input
                      id="address_unit"
                      value={formData.address_unit || formData.unit || ''}
                      onChange={(e) => handleFieldChange('address_unit', e.target.value)}
                      placeholder="Unit / Apt"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city || formData.address_city || ''}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>

                  {/* Province */}
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                      Province
                    </Label>
                    <Input
                      id="province"
                      value={formData.province || formData.address_province || clinicProvince}
                      onChange={(e) => handleFieldChange('province', e.target.value)}
                      placeholder="Province"
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">
                      Postal Code
                    </Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code || formData.address_postal || formData.zip || ''}
                      onChange={(e) => handleFieldChange('postal_code', e.target.value)}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
