const IMAGING_API_URL = import.meta.env.VITE_IMAGING_API_URL || 'http://localhost:4010'

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
  studyId: number
  modality: string
  capturedAt?: string
  sourceDevice?: string | null
  file: File
}

export interface UploadAssetResponse {
  assetId: number
}

export interface ImagingAsset {
  id: number
  clinic_id: number
  patient_id: number
  study_id: number
  modality: string
  mime_type: string
  size_bytes: number
  captured_at: string
  source_device: string | null
  storage_key: string
  thumb_key: string | null
  web_key: string | null
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

// Health check
export async function checkHealth() {
  const response = await fetch(`${IMAGING_API_URL}/health`)
  if (!response.ok) {
    throw new Error('Health check failed')
  }
  return response.json()
}

// Create study
export async function createStudy(data: CreateStudyRequest): Promise<CreateStudyResponse> {
  const response = await fetch(`${IMAGING_API_URL}/imaging/studies`, {
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
  formData.append('studyId', String(data.studyId))
  formData.append('modality', data.modality)
  if (data.capturedAt) {
    formData.append('capturedAt', data.capturedAt)
  }
  if (data.sourceDevice) {
    formData.append('sourceDevice', data.sourceDevice)
  }
  formData.append('file', data.file)

  const response = await fetch(`${IMAGING_API_URL}/imaging/assets/upload`, {
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

// List assets
export async function listAssets(patientId?: number, studyId?: number): Promise<ImagingAsset[]> {
  const params = new URLSearchParams()
  if (patientId) params.append('patientId', String(patientId))
  if (studyId) params.append('studyId', String(studyId))

  const response = await fetch(`${IMAGING_API_URL}/imaging/assets?${params.toString()}`, {
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
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${response.statusText}`)
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

// Delete asset
export async function deleteAsset(assetId: number): Promise<void> {
  const response = await fetch(`${IMAGING_API_URL}/imaging/assets/${assetId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete asset')
  }
}
