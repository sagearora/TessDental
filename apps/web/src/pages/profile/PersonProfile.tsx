import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Phone, Mail, MapPin, User, FileText, Users, CreditCard, Check, X } from 'lucide-react'
import { Popover, PopoverContent } from '@/components/ui/popover'
import {
  useGetPersonProfileQuery,
  useUpdatePersonFirstNameMutation,
  useUpdatePersonLastNameMutation,
  useUpdatePersonMiddleNameMutation,
  useUpdatePersonPreferredNameMutation,
  useUpdatePersonDobMutation,
  useUpdatePersonPreferredLanguageMutation,
  useUpdatePatientChartNoMutation,
  useUpdatePatientStatusMutation,
  useUpdatePatientFamilyDoctorNameMutation,
  useUpdatePatientFamilyDoctorPhoneMutation,
  useUpdatePatientImagingIdMutation,
  useGetPatientStatusEnumQuery,
  useGetHouseholdMembersQuery,
  useUpdatePersonResponsiblePartyMutation,
  useUpdatePersonHouseholdHeadMutation,
  useCreatePersonContactPointMutation,
  useUpdatePersonContactPointMutation,
  useDeletePersonContactPointMutation,
  useCreateAddressMutation,
  useUpdatePersonMailingAddressMutation,
  useUpdatePersonBillingAddressMutation,
} from '@/gql/generated'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'

const UPDATE_CURRENT_PERSON = gql`
  mutation UpdateCurrentPerson($personId: bigint) {
    update_clinic_user(
      where: { 
        is_active: { _eq: true }
      }
      _set: { current_person_id: $personId }
    ) {
      affected_rows
      returning {
        id
        clinic_id
        user_id
        current_person_id
      }
    }
  }
`
import { useAuth } from '@/contexts/AuthContext'
import { InlineEditableField } from '@/components/profile/InlineEditableField'
import { InlineEditableSelect } from '@/components/profile/InlineEditableSelect'
import { getErrorMessage } from '@/utils/errorHandling'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useUnifiedPatientSearch } from '@/hooks/useUnifiedPatientSearch'
import { useGetPersonsQuery } from '@/gql/generated'

export function PersonProfile() {
  const { personId } = useParams<{ personId: string }>()
  const navigate = useNavigate()
  const { session } = useAuth()
  const [isResponsiblePartyDialogOpen, setIsResponsiblePartyDialogOpen] = useState(false)
  const [isMoveFamilyDialogOpen, setIsMoveFamilyDialogOpen] = useState(false)
  const [isHouseholdHeadDialogOpen, setIsHouseholdHeadDialogOpen] = useState(false)
  
  // Responsible party dialog state
  const [responsiblePartyOption, setResponsiblePartyOption] = useState<'same' | 'other'>('same')
  const [selectedResponsiblePartyId, setSelectedResponsiblePartyId] = useState<number | null>(null)
  const [applyToAllFamily, setApplyToAllFamily] = useState(true)
  const [responsiblePartyRelationship, setResponsiblePartyRelationship] = useState<string>('child')
  
  // Move family dialog state
  const [householdSearchTerm, setHouseholdSearchTerm] = useState('')
  const [selectedTargetFamilyRootId, setSelectedTargetFamilyRootId] = useState<number | null>(null)
  const [, setMoveFamilyRelationship] = useState<string>('child')
  
  // Responsible party inline search state
  const [isEditingResponsibleParty, setIsEditingResponsibleParty] = useState(false)
  const [selectedResponsiblePartyName, setSelectedResponsiblePartyName] = useState<string>('')
  const [isResponsiblePartyPopoverOpen, setIsResponsiblePartyPopoverOpen] = useState(false)
  const responsiblePartyInputRef = useRef<HTMLInputElement>(null)
  
  // Household head inline search state
  const [isEditingHouseholdHead, setIsEditingHouseholdHead] = useState(false)
  const [selectedHouseholdHeadId, setSelectedHouseholdHeadId] = useState<number | null>(null)
  const [selectedHouseholdHeadName, setSelectedHouseholdHeadName] = useState<string>('')
  const [householdRelationship, setHouseholdRelationship] = useState<string>('self')
  const [isHouseholdHeadPopoverOpen, setIsHouseholdHeadPopoverOpen] = useState(false)
  const householdHeadInputRef = useRef<HTMLInputElement>(null)

  const personIdNum = personId ? parseInt(personId, 10) : 0

  const { data, loading, error, refetch } = useGetPersonProfileQuery({
    variables: {
      personId: personIdNum,
      clinicId: session?.clinicId || 0,
    },
    skip: !personIdNum || !session?.clinicId,
  })

  const { data: statusEnumData } = useGetPatientStatusEnumQuery()

  const [updatePersonFirstName] = useUpdatePersonFirstNameMutation()
  const [updatePersonLastName] = useUpdatePersonLastNameMutation()
  const [updatePersonMiddleName] = useUpdatePersonMiddleNameMutation()
  const [updatePersonPreferredName] = useUpdatePersonPreferredNameMutation()
  const [updatePersonDob] = useUpdatePersonDobMutation()
  const [updatePersonPreferredLanguage] = useUpdatePersonPreferredLanguageMutation()
  const [updatePatientChartNo] = useUpdatePatientChartNoMutation()
  const [updatePatientStatus] = useUpdatePatientStatusMutation()
  const [updatePatientFamilyDoctorName] = useUpdatePatientFamilyDoctorNameMutation()
  const [updatePatientFamilyDoctorPhone] = useUpdatePatientFamilyDoctorPhoneMutation()
  const [updatePatientImagingId] = useUpdatePatientImagingIdMutation()
  const [updatePersonResponsibleParty] = useUpdatePersonResponsiblePartyMutation()
  // Note: upsertPatientFinancial is available but not currently used
  // const [upsertPatientFinancial] = useUpsertPatientFinancialMutation()
  const [updatePersonHouseholdHead] = useUpdatePersonHouseholdHeadMutation()
  const [createPersonContactPoint] = useCreatePersonContactPointMutation()
  const [updatePersonContactPoint] = useUpdatePersonContactPointMutation()
  const [deletePersonContactPoint] = useDeletePersonContactPointMutation()
  const [createAddress] = useCreateAddressMutation()
  const [updatePersonMailingAddress] = useUpdatePersonMailingAddressMutation()
  const [updatePersonBillingAddress] = useUpdatePersonBillingAddressMutation()
  const [updateCurrentPerson] = useMutation(UPDATE_CURRENT_PERSON)
  
  // Address dialog state
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false)
  const [addressKind, setAddressKind] = useState<'mailing' | 'billing'>('mailing')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressRegion, setAddressRegion] = useState('')
  const [addressPostalCode, setAddressPostalCode] = useState('')
  const [addressCountry, setAddressCountry] = useState('Canada')

  const handleUseMailingForBilling = async () => {
    if (!person?.mailing_address?.id) return
    try {
      await updatePersonBillingAddress({
        variables: {
          personId: person.id,
          addressId: person.mailing_address.id,
        },
      })
      await refetch()
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'billing address'))
    }
  }
  
  // Unified search for family roots (responsible party selection)
  const {
    query: familyRootQuery,
    setQuery: setFamilyRootQuery,
    results: familyRootResults,
    hasQuery: hasFamilyRootQuery,
    loading: familyRootLoading,
  } = useUnifiedPatientSearch({ limit: 10 })

  // Search people for "move family" and responsible-party dialogs
  const { data: familyRootSearchData } = useGetPersonsQuery({
    variables: {
      limit: 20,
      offset: 0,
      orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
      where: {
        clinic_id: { _eq: session?.clinicId || 0 },
        is_active: { _eq: true },
        _or: [
          { first_name: { _ilike: `${householdSearchTerm}%` } },
          { last_name: { _ilike: `${householdSearchTerm}%` } },
          { preferred_name: { _ilike: `${householdSearchTerm}%` } },
        ],
      },
    },
    skip: !session?.clinicId || !householdSearchTerm.trim(),
    fetchPolicy: 'network-only',
  })

  // Unified search for household head selection (inline + dialog)
  const {
    query: householdHeadQuery,
    setQuery: setHouseholdHeadQuery,
    results: householdHeadResults,
    hasQuery: hasHouseholdHeadQuery,
    loading: householdHeadLoading,
  } = useUnifiedPatientSearch({ limit: 10 })

  const person = data?.person?.[0]
  
  // Initialize selected values from person data
  useEffect(() => {
    if (person) {
      // Initialize responsible party
      if (person.responsible_party_id && person.responsible_party) {
        const rpName = `${person.responsible_party.first_name} ${person.responsible_party.last_name}${person.responsible_party.preferred_name ? ` (${person.responsible_party.preferred_name})` : ''}`
        setSelectedResponsiblePartyId(person.responsible_party_id)
        setSelectedResponsiblePartyName(rpName)
      } else {
        setSelectedResponsiblePartyId(null)
        setSelectedResponsiblePartyName('')
      }
      
      // Initialize household head
      if (person.household_head_id && person.household_head) {
        const hhName = `${person.household_head.first_name} ${person.household_head.last_name}${person.household_head.preferred_name ? ` (${person.household_head.preferred_name})` : ''}`
        setSelectedHouseholdHeadId(person.household_head_id)
        setSelectedHouseholdHeadName(hhName)
        setHouseholdRelationship(person.household_relationship || 'self')
      } else {
        setSelectedHouseholdHeadId(null)
        setSelectedHouseholdHeadName('')
        setHouseholdRelationship('self')
      }
    }
  }, [person])
  
  // Set current_person_id when profile page loads
  useEffect(() => {
    if (personIdNum && session?.user.id) {
      updateCurrentPerson({
        variables: {
          personId: personIdNum,
        },
        refetchQueries: ['GetCurrentPerson'],
      }).catch((error: unknown) => {
        // Log error but don't block page load
        console.error('Failed to update current person:', error)
      })
    }
  }, [personIdNum, session?.user.id, updateCurrentPerson])
  
  // Check if person is already a household head (has household_members)
  const isHouseholdHead = person?.household_members && person.household_members.length > 0
  
  // Determine household head person ID
  // If person has household_head_id, use that; otherwise person is the head (use their own ID)
  const householdHeadPersonId = person?.household_head_id || personIdNum
  
  // Fetch household members based on household_head_id
  const { data: householdMembersData } = useGetHouseholdMembersQuery({
    variables: { 
      householdHeadPersonId: householdHeadPersonId,
      clinicId: session?.clinicId || 0,
    },
    skip: !householdHeadPersonId || !session?.clinicId,
  })
  
  const householdHeadPerson = householdMembersData?.householdHead?.[0]
  const householdMembers = householdMembersData?.householdMembers || []
  // Combine head and members, excluding duplicates
  const allHouseholdMembers = householdHeadPerson 
    ? [householdHeadPerson, ...householdMembers.filter(m => m.id !== householdHeadPerson.id)]
    : householdMembers
  
  // Determine responsible party (from responsible_party_id)
  const responsibleParty = person?.responsible_party_id 
    ? (person?.responsible_party || person) // Use the responsible_party relationship if available
    : person // Person is their own responsible party
  
  // Get household head
  const householdHead = person?.household_head
  const statusOptions =
    statusEnumData?.patient_status_enum?.map((s) => ({
      value: s.value,
      label: s.comment || s.value,
    })) || []

const billingSameAsMailing =
  !!person?.billing_address &&
  !!person.mailing_address &&
  person.billing_address.id === person.mailing_address.id

  const handleUpdatePerson = async (field: string, value: string) => {
    if (!person) return

    // Validate required fields
    if (field === 'first_name' && !value.trim()) {
      throw new Error('First name is required')
    }
    if (field === 'last_name' && !value.trim()) {
      throw new Error('Last name is required')
    }

    try {
      if (field === 'first_name') {
        await updatePersonFirstName({
          variables: { id: person.id, firstName: value.trim() },
        })
      } else if (field === 'last_name') {
        await updatePersonLastName({
          variables: { id: person.id, lastName: value.trim() },
        })
      } else if (field === 'middle_name') {
        await updatePersonMiddleName({
          variables: { id: person.id, middleName: value.trim() || null },
        })
      } else if (field === 'preferred_name') {
        await updatePersonPreferredName({
          variables: { id: person.id, preferredName: value.trim() || null },
        })
      } else if (field === 'dob') {
        // For dates, ensure we send YYYY-MM-DD format without timezone conversion
        let dateValue: string | null = null
        if (value && value.trim()) {
          // If it's already in YYYY-MM-DD format, use it
          if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            dateValue = value
          } else {
            // Parse and format as YYYY-MM-DD
            const date = new Date(value)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            dateValue = `${year}-${month}-${day}`
          }
        }
        await updatePersonDob({
          variables: { id: person.id, dob: dateValue },
        })
      } else if (field === 'preferred_language') {
        await updatePersonPreferredLanguage({
          variables: { id: person.id, preferredLanguage: value.trim() || null },
        })
      }
      await refetch()
    } catch (err: any) {
      throw new Error(getErrorMessage(err, field))
    }
  }

  const handleUpdatePatient = async (field: string, value: string) => {
    if (!person?.patient) return

    try {
      if (field === 'chart_no') {
        await updatePatientChartNo({
          variables: { personId: person.patient.person_id, chartNo: value.trim() || null },
        })
      } else if (field === 'status') {
        if (!value) {
          throw new Error('Status is required')
        }
        await updatePatientStatus({
          variables: { personId: person.patient.person_id, status: value as 'active' | 'archived' | 'deceased' | 'deleted' | 'inactive' },
        })
      } else if (field === 'family_doctor_name') {
        await updatePatientFamilyDoctorName({
          variables: { personId: person.patient.person_id, familyDoctorName: value.trim() || null },
        })
      } else if (field === 'family_doctor_phone') {
        await updatePatientFamilyDoctorPhone({
          variables: { personId: person.patient.person_id, familyDoctorPhone: value.trim() || null },
        })
      } else if (field === 'imaging_id') {
        await updatePatientImagingId({
          variables: { personId: person.patient.person_id, imagingId: value.trim() || null },
        })
      }
      await refetch()
    } catch (err: any) {
      throw new Error(getErrorMessage(err, field))
    }
  }

  // Helper function to get contact point by kind (enum value)
  const getContactPoint = (kind: 'email' | 'cell_phone' | 'home_phone' | 'work_phone') => {
    if (!person?.person_contact_point) return null
    // Note: person_contact_point query filters for is_active=true, so all returned contacts are active
    return person.person_contact_point.find(
      (cp) => cp.kind === kind
    ) || null
  }

  // Helper function to normalize phone number to E.164 format
  const normalizePhoneToE164 = (phone: string): string | null => {
    if (!phone) return null
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')
    if (digits.length === 0) return null
    
    // If it starts with 1 and has 11 digits, it's already a North American number with country code
    if (digits.length === 11 && digits[0] === '1') {
      return `+${digits}`
    }
    
    // If it has 10 digits, assume North American number and add +1
    if (digits.length === 10) {
      return `+1${digits}`
    }
    
    // For other lengths, try to add + if not present
    if (digits.length > 10) {
      return `+${digits}`
    }
    
    // If we can't normalize it properly, return null (will cause validation error)
    return null
  }

  // Handler for updating/creating contact points
  const handleContactPointChange = async (
    kind: 'email' | 'cell_phone' | 'home_phone' | 'work_phone',
    value: string
  ) => {
    if (!person) return

    const existingContact = getContactPoint(kind)
    const trimmedValue = value.trim()

    try {
      if (trimmedValue === '') {
        // Delete if value is empty and contact exists
        if (existingContact) {
          await deletePersonContactPoint({
            variables: { id: existingContact.id },
          })
        }
      } else if (existingContact) {
        // Update existing contact
        const phoneE164 = kind !== 'email' ? normalizePhoneToE164(trimmedValue) : null
        await updatePersonContactPoint({
          variables: {
            id: existingContact.id,
            value: trimmedValue as any, // citext type
            phoneE164: phoneE164,
          },
        })
      } else {
        // Create new contact
        const phoneE164 = kind !== 'email' ? normalizePhoneToE164(trimmedValue) : null
        if (kind !== 'email' && !phoneE164) {
          throw new Error('Invalid phone number format. Please enter a valid phone number.')
        }
        await createPersonContactPoint({
          variables: {
            personId: person.id,
            kind: kind,
            value: trimmedValue as any, // citext type
            phoneE164: phoneE164,
            isPrimary: false,
          },
        })
      }
      await refetch()
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'contact'))
    }
  }

  const handleAddAddress = async () => {
    if (!person || !addressLine1.trim() || !addressCity.trim() || !addressRegion.trim() || !addressPostalCode.trim()) return

    try {
      // First create the address
      const addressResult = await createAddress({
        variables: {
          line1: addressLine1.trim(),
          line2: addressLine2.trim() || null,
          city: addressCity.trim(),
          region: addressRegion.trim(),
          postalCode: addressPostalCode.trim(),
          country: addressCountry || 'Canada',
        },
      })

      const addressId = addressResult.data?.insert_address_one?.id
      if (!addressId) {
        throw new Error('Failed to create address')
      }

      // Then update the person's mailing or billing address reference
      if (addressKind === 'mailing') {
        await updatePersonMailingAddress({
          variables: {
            personId: person.id,
            addressId: addressId,
          },
        })
      } else if (addressKind === 'billing') {
        await updatePersonBillingAddress({
          variables: {
            personId: person.id,
            addressId: addressId,
          },
        })
      }

      await refetch()
      setIsAddAddressDialogOpen(false)
      setAddressKind('mailing')
      setAddressLine1('')
      setAddressLine2('')
      setAddressCity('')
      setAddressRegion('')
      setAddressPostalCode('')
      setAddressCountry('Canada')
    } catch (err: any) {
      throw new Error(getErrorMessage(err, 'address'))
    }
  }

  const handleUpdateResponsibleParty = async (newResponsiblePartyId: number | null) => {
    if (!person) return
    
    try {
      await updatePersonResponsibleParty({
        variables: {
          personId: person.id,
          responsiblePartyId: newResponsiblePartyId,
          householdRelationship: null, // Don't change household_relationship here
        },
      })

      // Update patient_financial if this is a patient
      if (person.patient && newResponsiblePartyId) {
        // Note: patient_financial table no longer has responsible_party field
        // Responsible party is stored on the person table, which is already updated above
      }

      await refetch()
      setIsResponsiblePartyPopoverOpen(false)
    } catch (err: any) {
      console.error('Error updating responsible party:', err)
      alert('Failed to update responsible party. Please try again.')
    }
  }

  const handleUpdateHouseholdHead = async (newHouseholdHeadId: number | null, newRelationship: string) => {
    if (!person) return
    
    try {
      // When clearing household head (null), set relationship to null as well
      // When setting household head, use the provided relationship (default to 'self' if not provided)
      // Map 'guardian' to 'other' since it's not in the enum
      const relationshipToSet: 'self' | 'child' | 'spouse' | 'parent' | 'sibling' | 'other' | null = newHouseholdHeadId 
        ? ((newRelationship === 'guardian' ? 'other' : (newRelationship || 'self')) as 'self' | 'child' | 'spouse' | 'parent' | 'sibling' | 'other')
        : null
      
      await updatePersonHouseholdHead({
        variables: {
          personId: person.id,
          householdHeadId: newHouseholdHeadId,
          householdRelationship: relationshipToSet,
        },
      })

      await refetch()
      setIsHouseholdHeadPopoverOpen(false)
    } catch (err: any) {
      console.error('Error updating household head:', err)
      alert('Failed to update household head. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 text-gray-500">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error ? `Error loading profile: ${error.message}` : 'Person not found'}
          </div>
          <Button onClick={() => navigate('/admin/patients/persons')} variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient List
          </Button>
        </div>
      </div>
    )
  }

  const displayName = person.preferred_name
    ? `${person.first_name} (${person.preferred_name}) ${person.last_name}`.trim()
    : `${person.first_name} ${person.last_name}`.trim()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button onClick={() => navigate('/admin/patients/persons')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient List
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">{displayName}</h1>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InlineEditableField
                value={person.first_name}
                onSave={(value) => handleUpdatePerson('first_name', value)}
                label="First Name"
                type="text"
              />
              <InlineEditableField
                value={person.middle_name}
                onSave={(value) => handleUpdatePerson('middle_name', value)}
                label="Middle Name"
                type="text"
              />
              <InlineEditableField
                value={person.last_name}
                onSave={(value) => handleUpdatePerson('last_name', value)}
                label="Last Name"
                type="text"
              />
              <InlineEditableField
                value={person.preferred_name}
                onSave={(value) => handleUpdatePerson('preferred_name', value)}
                label="Preferred Name"
                type="text"
              />
              <InlineEditableField
                value={person.dob}
                onSave={(value) => handleUpdatePerson('dob', value)}
                label="Date of Birth"
                type="date"
              />
              {person.gender && (
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900">
                    {person.gender.charAt(0).toUpperCase() + person.gender.slice(1)}
                  </p>
                </div>
              )}
              <InlineEditableField
                value={person.preferred_language}
                onSave={(value) => handleUpdatePerson('preferred_language', value)}
                label="Preferred Language"
                type="text"
              />
              {person.patient && statusOptions.length > 0 && (
                <InlineEditableSelect
                  value={person.patient.status}
                  onSave={(value) => handleUpdatePatient('status', value)}
                  label="Status"
                  options={statusOptions}
                />
              )}
              {/* Responsible Party */}
              <div>
                <p className="text-sm text-gray-500">Responsible Party</p>
                {isEditingResponsibleParty ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="relative flex-1">
                      <Popover
                        open={isResponsiblePartyPopoverOpen}
                        onOpenChange={setIsResponsiblePartyPopoverOpen}
                      >
                        <Input
                          ref={responsiblePartyInputRef}
                          placeholder="Search by name or phone..."
                          value={selectedResponsiblePartyId ? selectedResponsiblePartyName : familyRootQuery}
                          onChange={(e) => {
                            const v = e.target.value
                            setFamilyRootQuery(v)
                            setSelectedResponsiblePartyId(null)
                            setSelectedResponsiblePartyName('')
                            if (!isResponsiblePartyPopoverOpen && v.trim()) {
                              setIsResponsiblePartyPopoverOpen(true)
                            }
                          }}
                          onFocus={() => {
                            if (hasFamilyRootQuery) {
                              setIsResponsiblePartyPopoverOpen(true)
                            }
                          }}
                          onBlur={(e) => {
                            setTimeout(() => {
                              if (!e.currentTarget.contains(document.activeElement)) {
                                setIsResponsiblePartyPopoverOpen(false)
                              }
                            }, 200)
                          }}
                          className={selectedResponsiblePartyId ? "pr-8" : ""}
                        />
                        {selectedResponsiblePartyId && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedResponsiblePartyId(null)
                              setSelectedResponsiblePartyName('')
                              setFamilyRootQuery('')
                              responsiblePartyInputRef.current?.focus()
                            }}
                          >
                            ×
                          </Button>
                        )}
                        <PopoverContent 
                          className="p-0" 
                          align="start"
                          triggerRef={responsiblePartyInputRef}
                        >
                          {hasFamilyRootQuery && (
                            <div className="space-y-1 max-h-48 overflow-y-auto p-1">
                              {familyRootResults.map((p) => {
                                const fullName = p.displayName || 'Unknown'
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault()
                                    }}
                                    onClick={() => {
                                      setSelectedResponsiblePartyId(p.id)
                                      setSelectedResponsiblePartyName(fullName)
                                      setFamilyRootQuery('')
                                      setIsResponsiblePartyPopoverOpen(false)
                                      responsiblePartyInputRef.current?.blur()
                                    }}
                                    className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 ${
                                      selectedResponsiblePartyId === p.id ? 'bg-blue-50' : ''
                                    }`}
                                  >
                                    <p className="text-sm font-medium text-gray-900">
                                      {fullName}
                                    </p>
                                    {p.phone && (
                                      <p className="text-xs text-gray-500">
                                        {p.phone}
                                      </p>
                                    )}
                                  </button>
                                )
                              })}
                              {familyRootResults.length === 0 && !familyRootLoading && (
                                <p className="text-sm text-gray-500 text-center py-2">
                                  No responsible parties found
                                </p>
                              )}
                            </div>
                          )}
                          {!hasFamilyRootQuery && (
                            <div className="p-2">
                              <p className="text-sm text-gray-500 text-center py-2">
                                Start typing to search...
                              </p>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        // Always allow saving - null means "self" (responsible_party_id = null)
                        await handleUpdateResponsibleParty(selectedResponsiblePartyId)
                        setIsEditingResponsibleParty(false)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditingResponsibleParty(false)
                        setSelectedResponsiblePartyId(person?.responsible_party_id || null)
                        if (person?.responsible_party) {
                          const rpName = `${person.responsible_party.first_name} ${person.responsible_party.last_name}${person.responsible_party.preferred_name ? ` (${person.responsible_party.preferred_name})` : ''}`
                          setSelectedResponsiblePartyName(rpName)
                        } else {
                          setSelectedResponsiblePartyName('')
                        }
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                ) : (
                  <p
                    className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => setIsEditingResponsibleParty(true)}
                    title="Click to edit"
                  >
                    {responsibleParty ? (
                      <>
                        {responsibleParty.first_name} {responsibleParty.last_name}
                        {responsibleParty.preferred_name && ` (${responsibleParty.preferred_name})`}
                        {person.responsible_party_id === null && (
                          <span className="text-xs text-gray-500 ml-2">(Self)</span>
                        )}
                      </>
                    ) : (
                      'Not set'
                    )}
                  </p>
                )}

                {/* Inline relationship editor – now handled together with household head edit */}
              </div>
              
              {/* Household Head & Relationship */}
              <div>
                <p className="text-sm text-gray-500">
                  Household Head &amp; Relationship
                  {isHouseholdHead && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Not Editable - Head for {person.household_members?.length || 0}{' '}
                      {person.household_members?.length === 1 ? 'person' : 'people'})
                    </span>
                  )}
                </p>
                {isEditingHouseholdHead ? (
                  <div className="flex flex-col gap-2 mt-1 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Popover open={isHouseholdHeadPopoverOpen} onOpenChange={setIsHouseholdHeadPopoverOpen}>
                        <Input
                          ref={householdHeadInputRef}
                          placeholder={isHouseholdHead ? "This person is a household head" : "Search by name or phone..."}
                          value={selectedHouseholdHeadId ? selectedHouseholdHeadName : householdHeadQuery}
                          onChange={(e) => {
                            setHouseholdHeadQuery(e.target.value)
                            setSelectedHouseholdHeadId(null)
                            setSelectedHouseholdHeadName('')
                            if (!isHouseholdHeadPopoverOpen && e.target.value) {
                              setIsHouseholdHeadPopoverOpen(true)
                            }
                          }}
                          onFocus={() => {
                            if (householdHeadQuery && !isHouseholdHead) {
                              setIsHouseholdHeadPopoverOpen(true)
                            }
                          }}
                          onBlur={(e) => {
                            setTimeout(() => {
                              if (!e.currentTarget.contains(document.activeElement)) {
                                setIsHouseholdHeadPopoverOpen(false)
                              }
                            }, 200)
                          }}
                          disabled={isHouseholdHead}
                          className={selectedHouseholdHeadId ? "pr-8" : ""}
                        />
                        {selectedHouseholdHeadId && !isHouseholdHead && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedHouseholdHeadId(null)
                              setSelectedHouseholdHeadName('')
                              setHouseholdRelationship('self')
                              householdHeadInputRef.current?.focus()
                            }}
                          >
                            ×
                          </Button>
                        )}
                        {!isHouseholdHead && (
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
                                  return (
                                    <button
                                      key={p.id}
                                      type="button"
                                      disabled={isIneligible}
                                      onMouseDown={(e) => {
                                        e.preventDefault()
                                      }}
                                      onClick={() => {
                                        if (isIneligible) return
                                        setSelectedHouseholdHeadId(p.id)
                                        setSelectedHouseholdHeadName(fullName)
                                        setHouseholdHeadQuery('')
                                        setIsHouseholdHeadPopoverOpen(false)
                                        householdHeadInputRef.current?.blur()
                                        if (!householdRelationship || householdRelationship === 'self') {
                                          setHouseholdRelationship('other')
                                        }
                                      }}
                                      className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 ${
                                        selectedHouseholdHeadId === p.id ? 'bg-blue-50' : ''
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
                                          Already has a household head
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
                        )}
                      </Popover>
                    </div>
                    {/* Relationship selection, shown alongside the search input while editing */}
                    <div className="flex items-center gap-2">
                      <select
                        value={householdRelationship}
                        onChange={(e) => setHouseholdRelationship(e.target.value)}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="self">Self</option>
                        <option value="child">Child</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="guardian">Guardian</option>
                        <option value="other">Other</option>
                      </select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          // If relationship is set to self, clear household head id
                          const headIdToSave =
                            householdRelationship === 'self' ? null : selectedHouseholdHeadId

                          if (headIdToSave && (!householdRelationship || householdRelationship === 'self')) {
                            // Safety fallback, though this should be unreachable with logic above
                            return
                          }

                          await handleUpdateHouseholdHead(headIdToSave, householdRelationship)
                          setIsEditingHouseholdHead(false)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsEditingHouseholdHead(false)
                          setSelectedHouseholdHeadId(person?.household_head_id || null)
                          if (person?.household_head) {
                            const hhName = `${person.household_head.first_name} ${person.household_head.last_name}${person.household_head.preferred_name ? ` (${person.household_head.preferred_name})` : ''}`
                            setSelectedHouseholdHeadName(hhName)
                          } else {
                            setSelectedHouseholdHeadName('')
                          }
                          setHouseholdRelationship(person?.household_relationship || 'self')
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="mt-1 inline-flex flex-wrap items-center gap-1 text-left font-medium text-gray-900 hover:text-blue-600 hover:underline disabled:cursor-default disabled:text-gray-900"
                    disabled={isHouseholdHead}
                    onClick={() => {
                      if (isHouseholdHead) return
                      setIsEditingHouseholdHead(true)
                      // Ensure local state reflects current persisted relationship when entering edit
                      setHouseholdRelationship(person?.household_relationship || 'self')
                      setSelectedHouseholdHeadId(person?.household_head_id || null)
                      if (person?.household_head) {
                        const hhName = `${person.household_head.first_name} ${person.household_head.last_name}${
                          person.household_head.preferred_name ? ` (${person.household_head.preferred_name})` : ''
                        }`
                        setSelectedHouseholdHeadName(hhName)
                      } else {
                        setSelectedHouseholdHeadName('')
                      }
                    }}
                    title={
                      isHouseholdHead
                        ? undefined
                        : 'Click to edit household head and relationship'
                    }
                  >
                    {person.household_head_id === null || !householdHead ? (
                      <>
                        <span>Self</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {householdHead.first_name} {householdHead.last_name}
                          {householdHead.preferred_name && ` (${householdHead.preferred_name})`}
                        </span>
                        <span>&middot;</span>
                        <span className="capitalize">
                          {person.household_relationship || 'not set'}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Information (Medical) */}
        {person.patient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InlineEditableField
                  value={person.patient.chart_no}
                  onSave={(value) => handleUpdatePatient('chart_no', value)}
                  label="Chart Number"
                  type="text"
                />
                <InlineEditableField
                  value={person.patient.family_doctor_name}
                  onSave={(value) => handleUpdatePatient('family_doctor_name', value)}
                  label="Family Doctor Name"
                  type="text"
                />
                <InlineEditableField
                  value={person.patient.family_doctor_phone}
                  onSave={(value) => handleUpdatePatient('family_doctor_phone', value)}
                  label="Family Doctor Phone"
                  type="tel"
                />
                <InlineEditableField
                  value={person.patient.imaging_id}
                  onSave={(value) => handleUpdatePatient('imaging_id', value)}
                  label="Imaging ID"
                  type="text"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email and Phone Numbers */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Email & Phone</h3>
              <div className="space-y-3">
                {/* Cell Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <InlineEditableField
                      value={getContactPoint('cell_phone')?.value || ''}
                      onSave={(value) => handleContactPointChange('cell_phone', value)}
                      label="Cell Phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Home Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <InlineEditableField
                      value={getContactPoint('home_phone')?.value || ''}
                      onSave={(value) => handleContactPointChange('home_phone', value)}
                      label="Home Phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Work Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <InlineEditableField
                      value={getContactPoint('work_phone')?.value || ''}
                      onSave={(value) => handleContactPointChange('work_phone', value)}
                      label="Work Phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <InlineEditableField
                      value={getContactPoint('email')?.value || ''}
                      onSave={(value) => handleContactPointChange('email', value)}
                      label="Email"
                      type="email"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Mailing Address */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Mailing Address</h3>
                </div>
                {person.mailing_address ? (
                  <button
                    type="button"
                    className="w-full text-left space-y-3 group"
                    onClick={() => {
                      setAddressKind('mailing')
                      setAddressLine1(person.mailing_address?.line1 || '')
                      setAddressLine2(person.mailing_address?.line2 || '')
                      setAddressCity(person.mailing_address?.city || '')
                      setAddressRegion(person.mailing_address?.region || '')
                      setAddressPostalCode(person.mailing_address?.postal_code || '')
                      setAddressCountry(person.mailing_address?.country || 'Canada')
                      setIsAddAddressDialogOpen(true)
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 group-hover:underline">
                          {person.mailing_address.line1}
                          {person.mailing_address.line2 && <>, {person.mailing_address.line2}</>}
                          <br />
                          {person.mailing_address.city}, {person.mailing_address.region}{' '}
                          {person.mailing_address.postal_code}
                          <br />
                          {person.mailing_address.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-sm text-blue-700 hover:underline"
                    onClick={() => {
                      setAddressKind('mailing')
                      setAddressLine1('')
                      setAddressLine2('')
                      setAddressCity('')
                      setAddressRegion('')
                      setAddressPostalCode('')
                      setAddressCountry('Canada')
                      setIsAddAddressDialogOpen(true)
                    }}
                  >
                    Add mailing address
                  </button>
                )}
              </div>

              {/* Billing Address */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Billing Address</h3>
                  <div className="flex items-center gap-2">
                    {person.mailing_address && !person.billing_address && (
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 text-blue-700"
                        onClick={async () => {
                          try {
                            await handleUseMailingForBilling()
                          } catch (error: any) {
                            alert(getErrorMessage(error, 'billing address'))
                          }
                        }}
                      >
                        Mailing Address
                      </Button>
                    )}
                  </div>
                </div>
                {billingSameAsMailing ? (
                  <button
                    type="button"
                    className="w-full text-left text-sm text-blue-700 hover:underline"
                    onClick={() => {
                      // Open dialog to allow setting a different billing address,
                      // pre-filled from the current (mailing) address for convenience.
                      setAddressKind('billing')
                      const source = person.billing_address || person.mailing_address
                      setAddressLine1(source?.line1 || '')
                      setAddressLine2(source?.line2 || '')
                      setAddressCity(source?.city || '')
                      setAddressRegion(source?.region || '')
                      setAddressPostalCode(source?.postal_code || '')
                      setAddressCountry(source?.country || 'Canada')
                      setIsAddAddressDialogOpen(true)
                    }}
                  >
                    Same as mailing address (click to set a different address)
                  </button>
                ) : person.billing_address ? (
                  <button
                    type="button"
                    className="w-full text-left space-y-3 group"
                    onClick={() => {
                      setAddressKind('billing')
                      setAddressLine1(person.billing_address?.line1 || '')
                      setAddressLine2(person.billing_address?.line2 || '')
                      setAddressCity(person.billing_address?.city || '')
                      setAddressRegion(person.billing_address?.region || '')
                      setAddressPostalCode(person.billing_address?.postal_code || '')
                      setAddressCountry(person.billing_address?.country || 'Canada')
                      setIsAddAddressDialogOpen(true)
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 group-hover:underline">
                          {person.billing_address.line1}
                          {person.billing_address.line2 && <>, {person.billing_address.line2}</>}
                          <br />
                          {person.billing_address.city}, {person.billing_address.region}{' '}
                          {person.billing_address.postal_code}
                          <br />
                          {person.billing_address.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    {person.mailing_address
                      ? 'Using mailing address for billing'
                      : 'No billing address added'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Information */}
        {person.patient?.patient_referral && person.patient.patient_referral.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Referral Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {person.patient.patient_referral.map((referral, idx) => (
                  <div key={idx}>
                    {referral.referral_kind === 'source' && referral.referral_source && (
                      <p className="text-sm text-gray-900">
                        Referred by: <span className="font-medium">{referral.referral_source.name}</span>
                      </p>
                    )}
                    {referral.referral_kind === 'contact' && referral.referral_contact_person && (
                      <p className="text-sm text-gray-900">
                        Referred by:{' '}
                        <span className="font-medium">
                          {referral.referral_contact_person.first_name} {referral.referral_contact_person.last_name}
                        </span>
                      </p>
                    )}
                    {referral.referral_kind === 'other' && referral.referral_other_text && (
                      <p className="text-sm text-gray-900">
                        Referred by: <span className="font-medium">{referral.referral_other_text}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Family Section */}
        {person?.patient && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <CardTitle>Family & Billing</CardTitle>
                </div>
              </div>
              <CardDescription>
                Family relationships and responsible party for billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Move Family Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMoveFamilyDialogOpen(true)}
                >
                  Move to Different Family
                </Button>
              </div>

              {/* Household Members */}
              {allHouseholdMembers.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Household Members</p>
                  <div className="space-y-2">
                    {allHouseholdMembers
                      .sort((a, b) => {
                        // Sort: household head first, then patients, then others, then alphabetically
                        const aIsHead = a.id === householdHeadPersonId
                        const bIsHead = b.id === householdHeadPersonId
                        if (aIsHead && !bIsHead) return -1
                        if (!aIsHead && bIsHead) return 1
                        const aIsPatient = a.patient !== null
                        const bIsPatient = b.patient !== null
                        if (aIsPatient && !bIsPatient) return -1
                        if (!aIsPatient && bIsPatient) return 1
                        return (a.first_name || '').localeCompare(b.first_name || '')
                      })
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/profile/${member.id}`)}
                        >
                          <div className="flex items-center gap-2">
                            {member.patient ? (
                              <User className="h-4 w-4 text-blue-600" />
                            ) : (
                              <User className="h-4 w-4 text-gray-400" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {member.first_name} {member.last_name}
                                {member.preferred_name && ` (${member.preferred_name})`}
                                {member.id === householdHeadPersonId && (
                                  <span className="text-xs text-gray-500 ml-2">(Household Head)</span>
                                )}
                              </p>
                              <div className="flex gap-2 mt-0.5">
                                {member.patient && (
                                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                                    Patient
                                  </span>
                                )}
                                {member.household_relationship && member.id !== householdHeadPersonId && (
                                  <span className="text-xs text-gray-500 capitalize">
                                    {member.household_relationship}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Change Responsible Party Dialog */}
      {person?.patient && (
        <Dialog open={isResponsiblePartyDialogOpen} onOpenChange={setIsResponsiblePartyDialogOpen}>
          <DialogContent onClose={() => setIsResponsiblePartyDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Change Responsible Party</DialogTitle>
              <DialogDescription>
                Select who should be responsible for payments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <RadioGroup
                value={responsiblePartyOption}
                onValueChange={(value) => {
                  setResponsiblePartyOption(value as 'same' | 'other')
                  if (value === 'same') {
                    setSelectedResponsiblePartyId(person?.household_head_id || person?.responsible_party_id || null)
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="same" id="same" />
                  <Label htmlFor="same">Same as Household Head</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Someone else</Label>
                </div>
              </RadioGroup>

              {responsiblePartyOption === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="familyRootSearch">Search for responsible party</Label>
                  <Input
                    id="familyRootSearch"
                    placeholder="Search by name or phone..."
                    value={householdSearchTerm}
                    onChange={(e) => setHouseholdSearchTerm(e.target.value)}
                  />
                  {householdSearchTerm && familyRootSearchData?.person && (
                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                      {familyRootSearchData.person.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedResponsiblePartyId(p.id)}
                          className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${
                            selectedResponsiblePartyId === p.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {p.first_name} {p.last_name}
                              {p.preferred_name && ` (${p.preferred_name})`}
                            </p>
                              {/* Phone/email not available in GetPersons query here */}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {responsiblePartyOption === 'other' && (
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <select
                        id="relationship"
                        value={responsiblePartyRelationship}
                        onChange={(e) => setResponsiblePartyRelationship(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              )}

              <div className="flex items-center space-x-2 pt-2 border-t">
                <Checkbox
                  id="applyToAll"
                  checked={applyToAllFamily}
                  onCheckedChange={(checked) => setApplyToAllFamily(checked as boolean)}
                />
                <Label htmlFor="applyToAll" className="text-sm">
                  Apply to all family members
                </Label>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsResponsiblePartyDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const responsiblePartyId =
                        responsiblePartyOption === 'same'
                          ? (person?.household_head_id || person?.responsible_party_id || person?.id)
                          : selectedResponsiblePartyId

                      if (!responsiblePartyId) {
                        alert('Please select a responsible party')
                        return
                      }

                      if (responsiblePartyOption === 'other') {
                        // Update person's responsible_party_id (household_relationship is not related to responsible_party)
                        await updatePersonResponsibleParty({
                          variables: {
                            personId: person.id,
                            responsiblePartyId: responsiblePartyId,
                            householdRelationship: null, // Don't change household_relationship here
                          },
                        })
                      } else {
                        // Set to self (null responsible_party_id)
                        await updatePersonResponsibleParty({
                          variables: {
                            personId: person.id,
                            responsiblePartyId: null,
                            householdRelationship: null, // Don't change household_relationship here
                          },
                        })
                      }

                      // Update patient_financial if this is a patient
                      if (person.patient) {
                        // Note: patient_financial table no longer has responsible_party field
                        // Responsible party is stored on the person table, which is already updated above
                      }

                      // If apply to all family, update all dependents
                      if (applyToAllFamily && responsiblePartyOption === 'other') {
                        // Update all family members to point to the same responsible party
                        // This would require updating all dependents' responsible_party_id
                        // For now, we'll just update the current person
                        // TODO: Batch update all family members if needed
                      }

                      await refetch()
                      setIsResponsiblePartyDialogOpen(false)
                      // Reset state
                      setResponsiblePartyOption('same')
                      setSelectedResponsiblePartyId(null)
                      setApplyToAllFamily(true)
                      setResponsiblePartyRelationship('child')
                      setHouseholdSearchTerm('')
                    } catch (error) {
                      console.error('Error updating responsible party:', error)
                      alert('Failed to update responsible party. Please try again.')
                    }
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Move to Different Family Dialog */}
      {person?.patient && (
        <Dialog open={isMoveFamilyDialogOpen} onOpenChange={setIsMoveFamilyDialogOpen}>
          <DialogContent onClose={() => setIsMoveFamilyDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Move to Different Family</DialogTitle>
              <DialogDescription>
                Search for an existing family responsible party
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="familyRootSearch">Search for responsible party</Label>
                <Input
                  id="familyRootSearch"
                  placeholder="Search by name or phone..."
                  value={householdSearchTerm}
                  onChange={(e) => setHouseholdSearchTerm(e.target.value)}
                />
              </div>

              {householdSearchTerm && familyRootSearchData?.person && (
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                  {familyRootSearchData.person.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedTargetFamilyRootId(p.id)}
                      className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 ${
                        selectedTargetFamilyRootId === p.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {p.first_name} {p.last_name}
                        {p.preferred_name && ` (${p.preferred_name})`}
                      </p>
                      {/* Phone/email not available in GetPersons query here */}
                    </button>
                  ))}
                </div>
              )}


              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMoveFamilyDialogOpen(false)
                    setHouseholdSearchTerm('')
                    setSelectedTargetFamilyRootId(null)
                    setMoveFamilyRelationship('child')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      if (!selectedTargetFamilyRootId) {
                        alert('Please select a family responsible party')
                        return
                      }

                      await updatePersonResponsibleParty({
                        variables: {
                          personId: person.id,
                          responsiblePartyId: selectedTargetFamilyRootId,
                          householdRelationship: null, // household_relationship is now related to household_head_id, not responsible_party_id
                        },
                      })

                      await refetch()
                      setIsMoveFamilyDialogOpen(false)
                      setHouseholdSearchTerm('')
                      setSelectedTargetFamilyRootId(null)
                      setMoveFamilyRelationship('child')
                    } catch (error) {
                      console.error('Error moving patient to family:', error)
                      alert('Failed to move patient. Please try again.')
                    }
                  }}
                >
                  Move
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Change Household Head Dialog */}
      {person && (
        <Dialog open={isHouseholdHeadDialogOpen} onOpenChange={setIsHouseholdHeadDialogOpen}>
          <DialogContent onClose={() => setIsHouseholdHeadDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Change Household Head</DialogTitle>
              <DialogDescription>
                Select who should be the household head for this person. Only people who are not already household heads for others can be selected.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="householdHeadSearch">Search for household head</Label>
                <Input
                  id="householdHeadSearch"
                  placeholder="Search by name or phone..."
                  value={householdHeadQuery}
                  onChange={(e) => setHouseholdHeadQuery(e.target.value)}
                />
              </div>

              {hasHouseholdHeadQuery && (
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                  {householdHeadResults
                    .filter((p) => p.id !== person.id)
                    .map((p) => {
                      const fullName = p.displayName || 'Unknown'
                      const isIneligible = !!p.householdHeadId
                      return (
                        <button
                          key={p.id}
                          type="button"
                          disabled={isIneligible}
                          onClick={() => {
                            if (isIneligible) return
                            setSelectedHouseholdHeadId(p.id)
                            setResponsiblePartyRelationship('child')
                          }}
                          className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${
                            selectedHouseholdHeadId === p.id ? 'bg-blue-50' : ''
                          } ${isIneligible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {fullName}
                            </p>
                            {isIneligible && (
                              <p className="text-xs text-red-500">
                                Already has a household head
                              </p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  {householdHeadResults.filter((p) => p.id !== person.id).length === 0 &&
                    !householdHeadLoading && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No household heads found
                      </p>
                    )}
                </div>
              )}

              {selectedHouseholdHeadId && (
                <div className="space-y-2">
                  <Label htmlFor="householdRelationship">Relationship to household head</Label>
                  <select
                    id="householdRelationship"
                    value={responsiblePartyRelationship}
                    onChange={(e) => setResponsiblePartyRelationship(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="child">Child</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {person.household_head_id && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={async () => {
                      try {
                    await updatePersonHouseholdHead({
                      variables: {
                        personId: person.id,
                        householdHeadId: null,
                        householdRelationship: 'self',
                      },
                    })

                        await refetch()
                        setIsHouseholdHeadDialogOpen(false)
                        setSelectedHouseholdHeadId(null)
                      } catch (error) {
                        console.error('Error clearing household head:', error)
                        alert('Failed to clear household head. Please try again.')
                      }
                    }}
                  >
                    Clear Household Head
                  </Button>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsHouseholdHeadDialogOpen(false)
                    setSelectedHouseholdHeadId(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      if (selectedHouseholdHeadId === null) {
                        alert('Please select a household head or use "Clear Household Head" to remove it')
                        return
                      }

                      // If relationship is not set, default to 'other'
                      // Map 'guardian' to 'other' since it's not in the enum
                      const relationship = (responsiblePartyRelationship === 'guardian' ? 'other' : (responsiblePartyRelationship || 'other')) as 'self' | 'child' | 'spouse' | 'parent' | 'sibling' | 'other'

                      await updatePersonHouseholdHead({
                        variables: {
                          personId: person.id,
                          householdHeadId: selectedHouseholdHeadId,
                          householdRelationship: relationship,
                        },
                      })

                      await refetch()
                      setIsHouseholdHeadDialogOpen(false)
                      setSelectedHouseholdHeadId(null)
                      setResponsiblePartyRelationship('child')
                    } catch (error) {
                      console.error('Error updating household head:', error)
                      alert('Failed to update household head. Please try again.')
                    }
                  }}
                  disabled={selectedHouseholdHeadId === null}
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}


      {/* Add Address Dialog */}
      {person && (
        <Dialog open={isAddAddressDialogOpen} onOpenChange={setIsAddAddressDialogOpen}>
          <DialogContent onClose={() => setIsAddAddressDialogOpen(false)} className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {addressKind === 'mailing' ? 'Mailing Address' : 'Billing Address'}
              </DialogTitle>
              <DialogDescription>
                {addressKind === 'mailing'
                  ? 'Enter the mailing address information.'
                  : 'Enter a separate billing address, or use the mailing address instead.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addressCity">City *</Label>
                  <Input
                    id="addressCity"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div>
                  <Label htmlFor="addressRegion">Province/State *</Label>
                  <Input
                    id="addressRegion"
                    value={addressRegion}
                    onChange={(e) => setAddressRegion(e.target.value)}
                    placeholder="Province/State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="addressPostalCode">Postal Code *</Label>
                  <Input
                    id="addressPostalCode"
                    value={addressPostalCode}
                    onChange={(e) => setAddressPostalCode(e.target.value)}
                    placeholder="A1A 1A1"
                  />
                </div>

                <div>
                  <Label htmlFor="addressCountry">Country</Label>
                  <Input
                    id="addressCountry"
                    value={addressCountry}
                    onChange={(e) => setAddressCountry(e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {addressKind === 'billing' && person?.mailing_address && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start text-blue-700"
                    onClick={async () => {
                      try {
                        await handleUseMailingForBilling()
                        setIsAddAddressDialogOpen(false)
                      } catch (error: any) {
                        alert(getErrorMessage(error, 'billing address'))
                      }
                    }}
                  >
                    Use mailing address for billing
                  </Button>
                )}
                <div className="flex justify-end gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddAddressDialogOpen(false)
                      setAddressLine1('')
                      setAddressLine2('')
                      setAddressCity('')
                      setAddressRegion('')
                      setAddressPostalCode('')
                      setAddressCountry('Canada')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await handleAddAddress()
                      } catch (error: any) {
                        alert(getErrorMessage(error, 'address'))
                      }
                    }}
                    disabled={
                      !addressLine1.trim() ||
                      !addressCity.trim() ||
                      !addressRegion.trim() ||
                      !addressPostalCode.trim()
                    }
                  >
                    Save Address
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
