export interface MockFieldConfig {
  id: number
  clinic_id: number
  field_key: string
  field_label: string
  display_order: number
  is_displayed: boolean
  is_required: boolean
  is_active: boolean
}

export interface MockGenderEnum {
  value: string
  comment: string | null
}

export interface MockReferralKindEnum {
  value: string
  comment: string | null
}

export interface MockReferralSource {
  id: number
  name: string
  clinic_id: number
  is_active: boolean
}

export interface MockClinic {
  id: number
  name: string
  timezone: string | null
  phone: string | null
  fax: string | null
  website: string | null
  email: string | null
  address_street: string | null
  address_unit: string | null
  address_city: string | null
  address_province: string
  address_postal: string | null
  billing_number: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface MockPatientSearchResult {
  id: number
  first_name: string
  last_name: string
  preferred_name: string | null
  dob: string | null
  household_head_id: number | null
  responsible_party_id: number | null
  household_head: {
    id: number
    first_name: string
    last_name: string
    preferred_name: string | null
  } | null
  patient: {
    status: string
    chart_no: string | null
  } | null
  person_contact_point: Array<{
    value: string
  }>
}

export interface MockSession {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
  clinicId: number
}

export function createMockFieldConfig(overrides?: Partial<MockFieldConfig>): MockFieldConfig {
  return {
    id: 1,
    clinic_id: 1,
    field_key: 'first_name',
    field_label: 'First Name',
    display_order: 1,
    is_displayed: true,
    is_required: true,
    is_active: true,
    ...overrides,
  }
}

export function createMockFieldConfigs(): MockFieldConfig[] {
  return [
    createMockFieldConfig({
      id: 1,
      field_key: 'first_name',
      field_label: 'First Name',
      display_order: 1,
      is_required: true,
    }),
    createMockFieldConfig({
      id: 2,
      field_key: 'last_name',
      field_label: 'Last Name',
      display_order: 2,
      is_required: true,
    }),
    createMockFieldConfig({
      id: 3,
      field_key: 'preferred_name',
      field_label: 'Preferred Name',
      display_order: 3,
      is_required: false,
    }),
    createMockFieldConfig({
      id: 4,
      field_key: 'dob',
      field_label: 'Date of Birth',
      display_order: 4,
      is_required: false,
    }),
    createMockFieldConfig({
      id: 5,
      field_key: 'gender',
      field_label: 'Gender',
      display_order: 5,
      is_required: false,
    }),
    createMockFieldConfig({
      id: 6,
      field_key: 'email',
      field_label: 'Email',
      display_order: 6,
      is_required: true,
    }),
    createMockFieldConfig({
      id: 7,
      field_key: 'cell_phone',
      field_label: 'Cell Phone',
      display_order: 7,
      is_required: true,
    }),
    createMockFieldConfig({
      id: 8,
      field_key: 'referred_by',
      field_label: 'Referred By',
      display_order: 8,
      is_required: true,
    }),
  ]
}

export function createMockGenderEnum(): MockGenderEnum[] {
  return [
    { value: 'male', comment: 'Male' },
    { value: 'female', comment: 'Female' },
    { value: 'other', comment: 'Other' },
    { value: 'prefer_not_to_say', comment: 'Prefer not to say' },
  ]
}

export function createMockReferralKindEnum(): MockReferralKindEnum[] {
  return [
    { value: 'source', comment: 'Referral Source' },
    { value: 'contact', comment: 'Referred by Patient' },
    { value: 'other', comment: 'Other' },
  ]
}

export function createMockReferralSources(): MockReferralSource[] {
  return [
    {
      id: 1,
      name: 'Dr. Smith',
      clinic_id: 1,
      is_active: true,
    },
    {
      id: 2,
      name: 'Dr. Jones',
      clinic_id: 1,
      is_active: true,
    },
  ]
}

export function createMockClinic(overrides?: Partial<MockClinic>): MockClinic {
  return {
    id: 1,
    name: 'Test Clinic',
    timezone: 'America/Toronto',
    phone: null,
    fax: null,
    website: null,
    email: null,
    address_street: null,
    address_unit: null,
    address_city: null,
    address_province: 'ON',
    address_postal: null,
    billing_number: null,
    is_active: true,
    created_at: null,
    updated_at: null,
    ...overrides,
  }
}

export function createMockPatientSearchResult(
  overrides?: Partial<MockPatientSearchResult>
): MockPatientSearchResult {
  return {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    preferred_name: null,
    dob: '1990-01-01',
    household_head_id: null,
    responsible_party_id: null,
    household_head: null,
    patient: {
      status: 'active',
      chart_no: 'CH001',
    },
    person_contact_point: [
      {
        value: '(555) 123-4567',
      },
    ],
    ...overrides,
  }
}

export function createMockPatientSearchResults(): MockPatientSearchResult[] {
  return [
    createMockPatientSearchResult({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      household_head_id: null,
    }),
    createMockPatientSearchResult({
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      household_head_id: null,
    }),
    createMockPatientSearchResult({
      id: 3,
      first_name: 'Bob',
      last_name: 'Johnson',
      household_head_id: 1, // Has a household head, so ineligible
      household_head: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        preferred_name: null,
      },
    }),
  ]
}

export function createMockSession(overrides?: Partial<MockSession>): MockSession {
  return {
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
    clinicId: 1,
    ...overrides,
  }
}
