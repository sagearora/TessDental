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

export interface MountSlotDefinition {
  slot_id: string
  label: string
  row: number
  col: number
}

export interface MountTemplate {
  id?: number
  template_key: string
  name: string
  description: string | null
  slot_definitions: MountSlotDefinition[]
  layout_config?: {
    rows?: number
    cols?: number
    aspectRatio?: string
  } | null
  is_active?: boolean
}

export interface ImagingMount {
  id: number
  clinic_id: number
  patient_id: number
  template_id: number
  name: string | null
  description: string | null
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
  is_active: boolean
  template?: MountTemplate
  slots?: ImagingMountSlot[]
}

export interface ImagingMountSlot {
  id: number
  mount_id: number
  asset_id: number | null
  slot_id: string
  created_at: string
  created_by: string | null
  asset?: ImagingAsset | null
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

  const response = await fetch(`${IMAGING_API_URL}/imaging/assets/upload-batch`, {
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

// Update asset
export interface UpdateAssetRequest {
  name?: string | null
  imageSource?: 'intraoral' | 'panoramic' | 'webcam' | 'scanner' | 'photo' | null
}

export async function updateAsset(assetId: number, data: UpdateAssetRequest): Promise<ImagingAsset> {
  const response = await fetch(`${IMAGING_API_URL}/imaging/assets/${assetId}`, {
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
  const response = await fetch(`${IMAGING_API_URL}/imaging/assets/${assetId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete asset')
  }
}

// Mount API functions
export interface CreateMountRequest {
  patientId: number
  templateId: number
  name?: string | null
  description?: string | null
}

export async function createMount(data: CreateMountRequest): Promise<ImagingMount> {
  const response = await fetch(`${IMAGING_API_URL}/imaging/mounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create mount')
  }

  return response.json()
}

export async function listMounts(patientId?: number): Promise<ImagingMount[]> {
  const params = new URLSearchParams()
  if (patientId) params.append('patientId', String(patientId))

  const response = await fetch(`${IMAGING_API_URL}/imaging/mounts?${params.toString()}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to list mounts')
  }

  return response.json()
}

export async function getMount(mountId: number): Promise<ImagingMount> {
  const response = await fetch(`${IMAGING_API_URL}/imaging/mounts/${mountId}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get mount')
  }

  return response.json()
}

export interface UpdateMountRequest {
  name?: string | null
  description?: string | null
}

export async function updateMount(mountId: number, data: UpdateMountRequest): Promise<ImagingMount> {
  const response = await fetch(`${IMAGING_API_URL}/imaging/mounts/${mountId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update mount')
  }

  return response.json()
}

export async function assignAssetToMountSlot(
  mountId: number,
  slotId: string,
  assetId: number
): Promise<ImagingMountSlot> {
  const response = await fetch(
    `${IMAGING_API_URL}/imaging/mounts/${mountId}/slots/${encodeURIComponent(slotId)}/assign`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ assetId }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to assign asset to mount slot')
  }

  return response.json()
}

export async function removeAssetFromMountSlot(mountId: number, slotId: string): Promise<void> {
  const response = await fetch(
    `${IMAGING_API_URL}/imaging/mounts/${mountId}/slots/${encodeURIComponent(slotId)}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to remove asset from mount slot')
  }
}

export async function deleteMount(mountId: number): Promise<void> {
  const response = await fetch(`${IMAGING_API_URL}/imaging/mounts/${mountId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete mount')
  }
}

export async function listMountTemplates(): Promise<MountTemplate[]> {
  const response = await fetch(`${IMAGING_API_URL}/imaging/mount-templates`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to list mount templates')
  }

  return response.json()
}
