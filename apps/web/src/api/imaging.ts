const IMAGING_API_URL = import.meta.env.VITE_IMAGING_API_URL || 'http://localhost:4010'

import { authFetch } from '@/lib/onUnauthorized'

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken')
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export interface CreateStudyRequest {
  patientId: number
  kind: string
  title?: string | null
  capturedAt?: string
  source?: string | null
}

export interface CreateStudyResponse {
  studyId: number
}

export interface UploadAssetRequest {
  patientId: number
  studyId?: number | null
  modality: string
  capturedAt?: string
  sourceDevice?: string | null
  name?: string | null
  imageSource?: 'intraoral' | 'panoramic' | 'webcam' | 'scanner' | 'photo' | null
  file: File
}

export interface UploadAssetResponse {
  assetId: number
}

export interface ImagingAsset {
  id: number
  clinic_id: number
  patient_id: number
  study_id: number | null
  modality: string
  mime_type: string
  size_bytes: number
  captured_at: string
  source_device: string | null
  storage_key: string
  thumb_key: string | null
  web_key: string | null
  name: string | null
  image_source: 'intraoral' | 'panoramic' | 'webcam' | 'scanner' | 'photo' | null
  created_at?: string
  created_by?: string
  updated_at?: string
  updated_by?: string
}

export interface ImagingStudy {
  id: number
  clinic_id: number
  patient_id: number
  kind: string
  title: string | null
  captured_at: string
  source: string | null
}

// Mount/template types and API are in @/api/mounts (Hasura GraphQL). Re-export for convenience.
export type {
  ImagingMount,
  ImagingMountSlot,
  MountTemplateShape,
  SystemMountTemplate,
  ClinicMountTemplate,
} from '@/api/mounts'
export {
  listSystemMountTemplates,
  listClinicMountTemplates,
  listMounts,
  getMount,
  createMount,
  updateMount,
  deleteMount,
  assignAssetToMountSlot,
  removeAssetFromMountSlot,
  getMountTemplate,
  getNextEmptySlotId,
  normalizeMount,
  copySystemTemplateToClinic,
} from '@/api/mounts'

// Health check
export async function checkHealth() {
  const response = await authFetch(`${IMAGING_API_URL}/health`)
  if (!response.ok) {
    throw new Error('Health check failed')
  }
  return response.json()
}

// Create study
export async function createStudy(data: CreateStudyRequest): Promise<CreateStudyResponse> {
  const response = await authFetch(`${IMAGING_API_URL}/imaging/studies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create study')
  }

  return response.json()
}

// Upload asset
export async function uploadAsset(data: UploadAssetRequest): Promise<UploadAssetResponse> {
  const formData = new FormData()
  formData.append('patientId', String(data.patientId))
  if (data.studyId !== undefined && data.studyId !== null) {
    formData.append('studyId', String(data.studyId))
  }
  formData.append('modality', data.modality)
  if (data.capturedAt) {
    formData.append('capturedAt', data.capturedAt)
  }
  if (data.sourceDevice) {
    formData.append('sourceDevice', data.sourceDevice)
  }
  if (data.name) {
    formData.append('name', data.name)
  }
  if (data.imageSource) {
    formData.append('imageSource', data.imageSource)
  }
  formData.append('file', data.file)

  const response = await authFetch(`${IMAGING_API_URL}/imaging/assets/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to upload asset')
  }

  return response.json()
}

// Capture bridge upload token (patient-only, no studyId)
export interface GetCaptureUploadTokenParams {
  patientId: number
  modality?: string
  imageSource?: string | null
}

export interface GetCaptureUploadTokenResponse {
  uploadToken: string
  expiresIn: number
  uploadUrl: string
}

export async function getCaptureUploadToken(
  params: GetCaptureUploadTokenParams
): Promise<GetCaptureUploadTokenResponse> {
  const response = await authFetch(`${IMAGING_API_URL}/imaging/assets/upload-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      patientId: params.patientId,
      modality: params.modality ?? 'PHOTO',
      imageSource: params.imageSource ?? null,
    }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get upload token')
  }
  return response.json()
}

// Bulk upload assets
export interface UploadMultipleAssetsRequest {
  files: File[]
  patientId: number
  studyId?: number | null
  modality: string
  imageSource?: 'intraoral' | 'panoramic' | 'webcam' | 'scanner' | 'photo' | null
  names?: (string | null)[]
  capturedAt?: (string | null)[]
}

export interface UploadMultipleAssetsResult {
  assetId?: number
  success: boolean
  error?: string
  fileName?: string
}

export interface UploadMultipleAssetsResponse {
  results: UploadMultipleAssetsResult[]
  summary: {
    total: number
    succeeded: number
    failed: number
  }
}

export async function uploadMultipleAssets(
  data: UploadMultipleAssetsRequest
): Promise<UploadMultipleAssetsResponse> {
  const formData = new FormData()
  
  // Common fields
  formData.append('patientId', String(data.patientId))
  if (data.studyId !== undefined && data.studyId !== null) {
    formData.append('studyId', String(data.studyId))
  }
  formData.append('modality', data.modality)
  if (data.imageSource) {
    formData.append('imageSource', data.imageSource)
  }
  
  // Per-file metadata
  if (data.names) {
    for (const name of data.names) {
      formData.append('names[]', name || '')
    }
  }
  
  if (data.capturedAt) {
    for (const capturedAt of data.capturedAt) {
      formData.append('capturedAt[]', capturedAt || '')
    }
  }
  
  // Files
  for (const file of data.files) {
    formData.append('file', file)
  }

  const response = await authFetch(`${IMAGING_API_URL}/imaging/assets/upload-batch`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to upload assets')
  }

  return response.json()
}

// List assets
export async function listAssets(patientId?: number, studyId?: number): Promise<ImagingAsset[]> {
  const params = new URLSearchParams()
  if (patientId) params.append('patientId', String(patientId))
  if (studyId) params.append('studyId', String(studyId))

  const response = await authFetch(`${IMAGING_API_URL}/imaging/assets?${params.toString()}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to list assets')
  }

  return response.json()
}

// Get asset URL (for viewing)
export function getAssetUrl(assetId: number, variant: 'original' | 'web' | 'thumb' = 'web'): string {
  return `${IMAGING_API_URL}/imaging/assets/${assetId}?variant=${variant}`
}

// Get asset as blob URL (for use in img tags with auth)
export async function getAssetBlobUrl(assetId: number, variant: 'original' | 'web' | 'thumb' = 'web'): Promise<string> {
  const url = getAssetUrl(assetId, variant)
  const response = await authFetch(url, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${response.statusText}`)
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

// Update asset
export interface UpdateAssetRequest {
  name?: string | null
  imageSource?: 'intraoral' | 'panoramic' | 'webcam' | 'scanner' | 'photo' | null
  capturedAt?: string | null
}

export async function updateAsset(assetId: number, data: UpdateAssetRequest): Promise<ImagingAsset> {
  const response = await authFetch(`${IMAGING_API_URL}/imaging/assets/${assetId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update asset')
  }

  return response.json()
}

// Delete asset
export async function deleteAsset(assetId: number): Promise<void> {
  const response = await authFetch(`${IMAGING_API_URL}/imaging/assets/${assetId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete asset')
  }
}

