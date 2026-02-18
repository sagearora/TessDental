export interface ClinicPayload {
  name: string
  website?: string | null
  phone?: string | null
  fax?: string | null
  email?: string | null
  addressStreet?: string | null
  addressUnit?: string | null
  addressCity?: string | null
  addressProvince?: string | null
  addressPostal?: string | null
  country?: string | null
  doctorName?: string | null
}

export interface PatientPayload {
  displayName: string
  birthdate?: string | null
}
