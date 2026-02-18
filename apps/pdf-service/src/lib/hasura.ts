import { env } from '../env.js'
import type { ClinicPayload, PatientPayload } from './types.js'

const GET_ASSET_META = `
  query GetImagingAssetMeta($assetId: bigint!) {
    imaging_asset_by_pk(id: $assetId) {
      clinic_id
      patient_id
      captured_at
    }
  }
`

const GET_CLINIC = `
  query GetClinic($clinicId: bigint!) {
    clinic_v(where: { id: { _eq: $clinicId } }) {
      id
      name
      website
      phone
      fax
      email
      address_street
      address_unit
      address_city
      address_province
      address_postal
    }
  }
`

const GET_PERSON = `
  query GetPerson($personId: bigint!, $clinicId: bigint!) {
    person(where: { id: { _eq: $personId }, clinic_id: { _eq: $clinicId } }) {
      id
      first_name
      last_name
      preferred_name
      dob
    }
  }
`

const GET_MOUNT_META = `
  query GetImagingMountMeta($mountId: bigint!) {
    imaging_mount_by_pk(id: $mountId) {
      clinic_id
      patient_id
    }
  }
`

export interface AssetMeta {
  clinic_id: number
  patient_id: number
  captured_at: string | null
}

export interface MountMeta {
  clinic_id: number
  patient_id: number
}

const FETCH_TIMEOUT_MS = 15_000

async function hasuraRequest<T>(query: string, variables: Record<string, unknown>, authHeader: string | undefined): Promise<T> {
  if (!authHeader) {
    throw new Error('Missing authorization')
  }
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(env.HASURA_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    })
    if (!res.ok) {
      throw new Error(`Hasura request failed: ${res.status}`)
    }
    const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> }
    clearTimeout(timeoutId)
    if (json.errors?.length) {
      throw new Error(json.errors.map((e) => e.message).join('; '))
    }
    if (!json.data) {
      throw new Error('Hasura returned no data')
    }
    return json.data
  } catch (e) {
    clearTimeout(timeoutId)
    throw e
  }
}

export async function getAssetMeta(assetId: number, authHeader: string | undefined): Promise<AssetMeta | null> {
  const data = await hasuraRequest<{ imaging_asset_by_pk: AssetMeta | null }>(
    GET_ASSET_META,
    { assetId: String(assetId) },
    authHeader
  )
  return data.imaging_asset_by_pk
}

export async function getMountMeta(mountId: number, authHeader: string | undefined): Promise<MountMeta | null> {
  const data = await hasuraRequest<{ imaging_mount_by_pk: MountMeta | null }>(
    GET_MOUNT_META,
    { mountId: String(mountId) },
    authHeader
  )
  return data.imaging_mount_by_pk
}

export async function getClinic(clinicId: number, authHeader: string | undefined): Promise<ClinicPayload | null> {
  const data = await hasuraRequest<{ clinic_v: Array<{
    name?: string | null
    website?: string | null
    phone?: string | null
    fax?: string | null
    email?: string | null
    address_street?: string | null
    address_unit?: string | null
    address_city?: string | null
    address_province?: string | null
    address_postal?: string | null
  }> }>(GET_CLINIC, { clinicId: String(clinicId) }, authHeader)
  const row = data.clinic_v?.[0]
  if (!row) return null
  return {
    name: row.name ?? '',
    website: row.website ?? null,
    phone: row.phone ?? null,
    fax: row.fax ?? null,
    email: row.email ?? null,
    addressStreet: row.address_street ?? null,
    addressUnit: row.address_unit ?? null,
    addressCity: row.address_city ?? null,
    addressProvince: row.address_province ?? null,
    addressPostal: row.address_postal ?? null,
    country: null,
    doctorName: null,
  }
}

export async function getPatientDisplay(clinicId: number, personId: number, authHeader: string | undefined): Promise<PatientPayload | null> {
  const data = await hasuraRequest<{ person: Array<{
    first_name?: string | null
    last_name?: string | null
    preferred_name?: string | null
    dob?: string | null
  }> }>(GET_PERSON, { personId: String(personId), clinicId: String(clinicId) }, authHeader)
  const row = data.person?.[0]
  if (!row) return null
  const displayName =
    row.preferred_name?.trim() ||
    [row.first_name, row.last_name].filter(Boolean).join(' ').trim() ||
    'Patient'
  const birthdate = row.dob
    ? new Date(row.dob).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
  return { displayName, birthdate }
}
