import { env } from '../env.js'

const FETCH_TIMEOUT_MS = 15_000

export interface MountSlot {
  id: number
  mount_id: number
  asset_id: number | null
  slot_id: string
  asset?: {
    id: number
    name?: string | null
    image_source?: string | null
    captured_at?: string | null
    thumb_key?: string | null
    web_key?: string | null
    modality?: string
  } | null
}

/** Slot definition from imaging mount template (canvas coords) */
export interface MountSlotDefinition {
  slot_id: string
  label?: string
  x?: number
  y?: number
  width?: number
  height?: number
  row?: number
  col?: number
  row_span?: number
  col_span?: number
}

export interface MountLayoutConfig {
  type?: 'canvas' | 'grid'
  width?: number
  height?: number
  rows?: number
  cols?: number
}

export interface MountTemplateShape {
  id?: number
  template_key?: string
  name?: string
  slot_definitions: MountSlotDefinition[]
  layout_config?: MountLayoutConfig | null
}

export interface MountResponse {
  id: number
  clinic_id: number
  patient_id: number
  template_id: number
  name: string | null
  description: string | null
  created_at: string
  is_active: boolean
  template: MountTemplateShape
  slots: MountSlot[]
}

export async function fetchAssetImage(assetId: number, authHeader: string | undefined, variant: 'web' | 'thumb' | 'original' = 'web'): Promise<Buffer> {
  if (!authHeader) {
    throw new Error('Missing authorization')
  }
  const url = `${env.IMAGING_API_URL}/imaging/assets/${assetId}?variant=${variant}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { Authorization: authHeader },
      signal: controller.signal,
    })
    if (res.status === 404 || res.status === 403) {
      const err = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(err?.error || `Asset not found or access denied: ${res.status}`)
    }
    if (!res.ok) {
      throw new Error(`Imaging API error: ${res.status}`)
    }
    const arrayBuffer = await res.arrayBuffer()
    clearTimeout(timeoutId)
    return Buffer.from(arrayBuffer)
  } catch (e) {
    clearTimeout(timeoutId)
    throw e
  }
}

export async function fetchMount(mountId: number, authHeader: string | undefined): Promise<MountResponse | null> {
  if (!authHeader) {
    throw new Error('Missing authorization')
  }
  const url = `${env.IMAGING_API_URL}/imaging/mounts/${mountId}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { Authorization: authHeader },
      signal: controller.signal,
    })
    if (res.status === 404 || res.status === 403) {
      return null
    }
    if (!res.ok) {
      throw new Error(`Imaging API error: ${res.status}`)
    }
    const data = (await res.json()) as MountResponse
    clearTimeout(timeoutId)
    return data
  } catch (e) {
    clearTimeout(timeoutId)
    throw e
  }
}
