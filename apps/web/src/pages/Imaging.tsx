import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  listAssets,
  deleteAsset,
  listMounts,
  getMount,
  removeAssetFromMountSlot,
  getAssetBlobUrl,
  regenerateAssetDerived,
  type ImagingAsset,
  type ImagingMount,
} from '@/api/imaging'
import { fetchPrintImagePdf, fetchPrintMountPdf } from '@/api/pdf'
import {
  listMountTemplates,
  getSlotIdsInOrderFrom,
  updateMountSlotAdjustments,
  updateAssetDisplayAdjustments,
  deleteMount,
  type SystemMountTemplate,
  type ClinicMountTemplate,
} from '@/api/mounts'
import { CaptureImageDialog } from '@/components/imaging/CaptureImageDialog'
import { AssetInfoDialog } from '@/components/imaging/AssetInfoDialog'
import { useAuth } from '@/contexts/AuthContext'
import { ImageIcon, X, Layout, Trash2, CircleHelp, Pencil, ChevronLeft, ChevronRight, Camera, Download, Printer, SlidersHorizontal } from 'lucide-react'
import { AuthenticatedImage } from '@/components/imaging/AuthenticatedImage'
import { MountView } from '@/components/imaging/MountView'
import { MountCanvas } from '@/components/imaging/MountCanvas'
import { CreateMountDialog } from '@/components/imaging/CreateMountDialog'
import { MountInfoDialog } from '@/components/imaging/MountInfoDialog'
import { TransformationDialog } from '@/components/imaging/TransformationDialog'
import { getMountLayout, getMountTemplate, getEffectiveSlotOrder, MOUNT_CANVAS_WIDTH, MOUNT_CANVAS_HEIGHT } from '@/api/mounts'
import { mergeDisplayAdjustments, displayAdjustmentsToFilter, displayAdjustmentsToTransform } from '@/lib/display-adjustments'
import type { DisplayAdjustments } from '@/api/mounts'

/** Assets in this mount in slot order (capture order), for fullscreen prev/next */
function getMountAssetsInSlotOrder(mount: ImagingMount): ImagingAsset[] {
  const template = getMountTemplate(mount)
  if (!template) return []
  const order = getEffectiveSlotOrder(template, null)
  const slots = mount.mount_slots ?? mount.slots ?? []
  const result: ImagingAsset[] = []
  for (const slotId of order) {
    const slot = slots.find((s) => s.slot_id === slotId && s.asset)
    if (!slot?.asset) continue
    const a = slot.asset
    result.push({
      id: a.id,
      clinic_id: 0,
      patient_id: 0,
      study_id: null,
      modality: (a.modality as ImagingAsset['modality']) || 'PHOTO',
      mime_type: 'image/jpeg',
      size_bytes: 0,
      captured_at: a.captured_at || new Date().toISOString(),
      source_device: null,
      storage_key: '',
      thumb_key: a.thumb_key ?? null,
      web_key: a.web_key ?? null,
      name: a.name ?? null,
      image_source: (a.image_source as ImagingAsset['image_source']) ?? null,
    })
  }
  return result
}

// Mini mount preview for gallery: same canvas layout as main preview, read-only
function MountThumbnail({ mount }: { mount: ImagingMount }) {
  const template = getMountTemplate(mount)
  const layout = getMountLayout(template)
  const defaultTransforms = (template?.default_slot_transformations ?? {}) as Record<string, DisplayAdjustments>
  const slotsData = mount.mount_slots ?? mount.slots ?? []

  if (!layout || layout.slots.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Layout className="h-6 w-6 text-gray-400" />
      </div>
    )
  }

  const slotAssignments = layout.slots.map((slot) => {
    const slotData = slotsData.find((s) => s.slot_id === slot.slot_id)
    const asset = slotData?.asset
    const imagingAsset: ImagingAsset | null =
      asset && asset.id
        ? {
            id: asset.id,
            clinic_id: 0,
            patient_id: 0,
            study_id: null,
            modality: (asset.modality as ImagingAsset['modality']) || 'PHOTO',
            mime_type: 'image/jpeg',
            size_bytes: 0,
            captured_at: asset.captured_at || new Date().toISOString(),
            source_device: null,
            storage_key: '',
            thumb_key: asset.thumb_key || null,
            web_key: asset.web_key || null,
            name: asset.name || null,
            image_source: (asset.image_source as ImagingAsset['image_source']) || null,
          }
        : null
    const adjustments = mergeDisplayAdjustments(defaultTransforms[slot.slot_id], slotData?.adjustments ?? null)
    return { slot_id: slot.slot_id, asset: imagingAsset, adjustments }
  })

  return (
    <div className="w-full h-full flex items-center justify-center min-h-0 min-w-0 p-0.5">
      <div
        className="max-w-full max-h-full min-h-0 w-full"
        style={{
          aspectRatio: layout.width / layout.height,
          maxHeight: '100%',
        }}
      >
        <MountCanvas
          width={layout.width}
          height={layout.height}
          slots={layout.slots}
          slotAssignments={slotAssignments}
          showOrderLabels={false}
          interactive={false}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}

/** Unified template option for Create a Mount (system or clinic) */
type MountTemplateOption = (SystemMountTemplate & { source: 'system' }) | (ClinicMountTemplate & { source: 'clinic' })

const SUBSCRIBE_IMAGING_ASSETS = gql`
  subscription SubscribeImagingAssetsForPatient($patientId: bigint!, $clinicId: bigint!) {
    imaging_asset(
      where: {
        patient_id: { _eq: $patientId }
        clinic_id: { _eq: $clinicId }
        is_active: { _eq: true }
      }
      order_by: { captured_at: desc }
      limit: 100
    ) {
      id
      clinic_id
      patient_id
      study_id
      modality
      mime_type
      size_bytes
      captured_at
      source_device
      storage_key
      thumb_key
      web_key
      name
      image_source
      display_adjustments
    }
  }
`


export function groupAssetsByCaptureDate(assets: ImagingAsset[]): { dateLabel: string; dateKey: string; assets: ImagingAsset[] }[] {
  const byDate = new Map<string, ImagingAsset[]>()
  for (const asset of assets) {
    const d = asset.captured_at ? new Date(asset.captured_at) : new Date(0)
    const dateKey = d.toISOString().slice(0, 10)
    const list = byDate.get(dateKey) ?? []
    list.push(asset)
    byDate.set(dateKey, list)
  }
  const entries = Array.from(byDate.entries())
  entries.sort((a, b) => b[0].localeCompare(a[0]))
  return entries.map(([dateKey, list]) => {
    list.sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())
    const d = new Date(dateKey + 'T12:00:00Z')
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    return { dateKey, dateLabel, assets: list }
  })
}

type GalleryItem = { type: 'asset'; data: ImagingAsset } | { type: 'mount'; data: ImagingMount }

export function groupGalleryItemsByDate(
  assets: ImagingAsset[],
  mounts: ImagingMount[]
): { dateLabel: string; dateKey: string; items: GalleryItem[] }[] {
  const byDate = new Map<string, GalleryItem[]>()
  
  // Add assets
  for (const asset of assets) {
    const d = asset.captured_at ? new Date(asset.captured_at) : new Date(0)
    const dateKey = d.toISOString().slice(0, 10)
    const list = byDate.get(dateKey) ?? []
    list.push({ type: 'asset', data: asset })
    byDate.set(dateKey, list)
  }
  
  // Add mounts
  for (const mount of mounts) {
    const d = mount.created_at ? new Date(mount.created_at) : new Date(0)
    const dateKey = d.toISOString().slice(0, 10)
    const list = byDate.get(dateKey) ?? []
    list.push({ type: 'mount', data: mount })
    byDate.set(dateKey, list)
  }
  
  const entries = Array.from(byDate.entries())
  entries.sort((a, b) => b[0].localeCompare(a[0]))
  return entries.map(([dateKey, list]) => {
    // Sort items: assets by captured_at desc, mounts by created_at desc
    list.sort((a, b) => {
      if (a.type === 'asset' && b.type === 'asset') {
        return new Date(b.data.captured_at).getTime() - new Date(a.data.captured_at).getTime()
      }
      if (a.type === 'mount' && b.type === 'mount') {
        return new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime()
      }
      // Assets come before mounts on the same day
      if (a.type === 'asset' && b.type === 'mount') return -1
      if (a.type === 'mount' && b.type === 'asset') return 1
      return 0
    })
    const d = new Date(dateKey + 'T12:00:00Z')
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    return { dateKey, dateLabel, items: list }
  })
}

function mapSubscriptionAsset(row: {
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
  image_source: string | null
  display_adjustments?: Record<string, unknown> | null
}): ImagingAsset {
  return {
    id: row.id,
    clinic_id: row.clinic_id,
    patient_id: row.patient_id,
    study_id: row.study_id,
    modality: row.modality,
    mime_type: row.mime_type,
    size_bytes: row.size_bytes,
    captured_at: row.captured_at,
    source_device: row.source_device,
    storage_key: row.storage_key,
    thumb_key: row.thumb_key,
    web_key: row.web_key,
    name: row.name,
    image_source: row.image_source as ImagingAsset['image_source'],
    display_adjustments: row.display_adjustments as ImagingAsset['display_adjustments'],
  }
}

export function Imaging() {
  const { personId } = useParams<{ personId: string }>()
  const { session } = useAuth()
  const [assets, setAssets] = useState<ImagingAsset[]>([])
  const [mounts, setMounts] = useState<ImagingMount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<ImagingAsset | null>(null)
  const [selectedMount, setSelectedMount] = useState<ImagingMount | null>(null)
  const [patientId, setPatientId] = useState<string>(personId || '')
  const [, setMountTemplates] = useState<MountTemplateOption[]>([])
  const [captureDialogOpen, setCaptureDialogOpen] = useState(false)
  const [captureDialogMount, setCaptureDialogMount] = useState<ImagingMount | null>(null)
  const [captureDialogSlotId, setCaptureDialogSlotId] = useState<string | null>(null)
  const [mountContextMenu, setMountContextMenu] = useState<{ x: number; y: number; slotId: string } | null>(null)
  const [autoAcquisitionQueue, setAutoAcquisitionQueue] = useState<string[] | null>(null)
  const [createMountDialogOpen, setCreateMountDialogOpen] = useState(false)
  const [assetForInfoDialog, setAssetForInfoDialog] = useState<ImagingAsset | null>(null)
  const [assetInfoDialogMode, setAssetInfoDialogMode] = useState<'edit' | 'inspect'>('edit')
  const [mountInfoDialogMount, setMountInfoDialogMount] = useState<ImagingMount | null>(null)
  const [mountInfoDialogMode, setMountInfoDialogMode] = useState<'edit' | 'inspect' | null>(null)
  const [transformDialogContext, setTransformDialogContext] = useState<
    | { type: 'asset'; asset: ImagingAsset }
    | { type: 'mount'; mount: ImagingMount; slotId: string }
    | null
  >(null)
  const [transformPreviewAdjustments, setTransformPreviewAdjustments] = useState<DisplayAdjustments | null>(null)
  const [previewFullscreen, setPreviewFullscreen] = useState(false)
  const [fullscreenFromMount, setFullscreenFromMount] = useState<ImagingMount | null>(null)
  const [previewMaxWidth, setPreviewMaxWidth] = useState<number | null>(null)
  const [galleryContextMenu, setGalleryContextMenu] = useState<{
    x: number
    y: number
    item: GalleryItem
  } | null>(null)

  const mountContextMenuRef = useRef<HTMLDivElement | null>(null)
  const galleryContextMenuRef = useRef<HTMLDivElement | null>(null)
  const contentWrapperRef = useRef<HTMLDivElement | null>(null)

  // Update patientId when personId changes
  useEffect(() => {
    if (personId) {
      setPatientId(personId)
    }
  }, [personId])

  useEffect(() => {
    if (!mountContextMenu) return
    const handleClickOutside = (e: MouseEvent) => {
      if (mountContextMenuRef.current && !mountContextMenuRef.current.contains(e.target as Node)) {
        setMountContextMenu(null)
      }
    }
    const t = setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mountContextMenu])

  useEffect(() => {
    if (!galleryContextMenu) return
    const handleClickOutside = (e: MouseEvent) => {
      if (galleryContextMenuRef.current && !galleryContextMenuRef.current.contains(e.target as Node)) {
        setGalleryContextMenu(null)
      }
    }
    const t = setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [galleryContextMenu])

  // Fullscreen preview: Escape to close, ArrowLeft/ArrowRight for prev/next.
  // When opened from a mount, prev/next use mount slot order; otherwise same-date group.
  const groups = groupAssetsByCaptureDate(assets)
  const fullscreenGroup = previewFullscreen && selectedAsset && !fullscreenFromMount
    ? groups.find((g) => g.assets.some((a) => a.id === selectedAsset.id))
    : null
  const fullscreenAssetList = fullscreenFromMount
    ? getMountAssetsInSlotOrder(fullscreenFromMount)
    : fullscreenGroup?.assets ?? []
  const fullscreenIndex =
    selectedAsset && fullscreenAssetList.length > 0
      ? fullscreenAssetList.findIndex((a) => a.id === selectedAsset.id)
      : -1
  const fullscreenPrev =
    fullscreenIndex > 0 ? fullscreenAssetList[fullscreenIndex - 1] ?? null : null
  const fullscreenNext =
    fullscreenIndex >= 0 && fullscreenIndex < fullscreenAssetList.length - 1
      ? fullscreenAssetList[fullscreenIndex + 1] ?? null
      : null

  useEffect(() => {
    if (!previewFullscreen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewFullscreen(false)
        setFullscreenFromMount((prev) => {
          if (prev) setSelectedAsset(null)
          return null
        })
        e.preventDefault()
      } else if (e.key === 'ArrowLeft' && fullscreenPrev) {
        setSelectedAsset(fullscreenPrev)
        e.preventDefault()
      } else if (e.key === 'ArrowRight' && fullscreenNext) {
        setSelectedAsset(fullscreenNext)
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewFullscreen, fullscreenPrev, fullscreenNext])

  const subscriptionActive = Boolean(patientId && session?.clinicId)

  interface SubscribeImagingAssetsData {
    imaging_asset: Parameters<typeof mapSubscriptionAsset>[0][]
  }

  const { data: subscriptionData, loading: subscriptionLoading } = useSubscription<SubscribeImagingAssetsData>(
    SUBSCRIBE_IMAGING_ASSETS,
    {
      variables: {
        patientId: patientId ? Number(patientId) : 0,
        clinicId: session?.clinicId ?? 0,
      },
      skip: !subscriptionActive,
    }
  )

  useEffect(() => {
    if (!subscriptionActive || !subscriptionData?.imaging_asset) return
    const mapped = subscriptionData.imaging_asset.map(mapSubscriptionAsset)
    setAssets(mapped)
    setSelectedAsset((prev) =>
      prev && !mapped.find((a: ImagingAsset) => a.id === prev.id) ? null : prev
    )
  }, [subscriptionActive, subscriptionData])

  const fetchAssets = async () => {
    if (!session || !patientId) return

    setLoading(true)
    setError(null)
    try {
      const data = await listAssets(Number(patientId))
      setAssets(data)
      // Clear selection if selected asset no longer exists
      if (selectedAsset && !data.find((a) => a.id === selectedAsset.id)) {
        setSelectedAsset(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load images')
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMounts = async () => {
    if (!session || !patientId) return

    setLoading(true)
    setError(null)
    try {
      const data = await listMounts(Number(patientId), session.clinicId)
      // If selected mount is missing from the list (e.g. stale cache), keep it in the list so gallery and preview stay correct
      const list =
        selectedMount && !data.find((m) => m.id === selectedMount.id)
          ? [selectedMount, ...data]
          : data
      setMounts(list)
      // Clear selection only if selected mount is not in the final list (e.g. was deleted)
      if (selectedMount && !list.find((m) => m.id === selectedMount.id)) {
        setSelectedMount(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load mounts')
      console.error('Error fetching mounts:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMountTemplates = async () => {
    if (!session) return
    try {
      const { system, clinic } = await listMountTemplates(session.clinicId)
      const options: MountTemplateOption[] = [
        ...system.map((t) => ({ ...t, source: 'system' as const })),
        ...clinic.map((t) => ({ ...t, source: 'clinic' as const })),
      ]
      setMountTemplates(options)
    } catch (err: any) {
      console.error('Error fetching mount templates:', err)
    }
  }

  useEffect(() => {
    if (!subscriptionActive) fetchAssets()
    fetchMounts()
  }, [session, patientId, subscriptionActive])

  useEffect(() => {
    fetchMountTemplates()
  }, [session])

  // Cap preview at 3/5 of vertical space: with aspect ratio 2:1, height = width/2, so width <= 1.2 * containerHeight
  useEffect(() => {
    const el = contentWrapperRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setPreviewMaxWidth(Math.min(width, 1.2 * height))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /** Hide the transformation panel only; do not change selected asset/mount. */
  const closeTransformPanel = () => {
    setTransformDialogContext(null)
    setTransformPreviewAdjustments(null)
  }

  useEffect(() => {
    if (!transformDialogContext) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTransformPanel()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [transformDialogContext])

  const handleCaptureSuccess = () => {
    fetchAssets()
  }

  const handleDelete = async (assetId: number) => {
    if (!session) return

    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      await deleteAsset(assetId)
      if (selectedAsset?.id === assetId) {
        setSelectedAsset(null)
      }
      await fetchAssets()
    } catch (err: any) {
      setError(err.message || 'Failed to delete image')
      console.error('Delete error:', err)
    }
  }

  const handleDownloadAsset = async (
    assetId: number,
    variant: 'original' | 'web',
    filename: string
  ) => {
    try {
      const blobUrl = await getAssetBlobUrl(assetId, variant)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename || `image-${assetId}-${variant}.jpg`
      a.click()
      URL.revokeObjectURL(blobUrl)
    } catch (err: any) {
      setError(err?.message || 'Failed to download image')
    }
  }

  const handlePrintAsset = async (asset: ImagingAsset) => {
    try {
      const pdfBlob = await fetchPrintImagePdf(asset.id)
      const url = URL.createObjectURL(pdfBlob)
      const w = window.open(url, '_blank')
      if (!w) {
        setError('Please allow popups to open the PDF')
        URL.revokeObjectURL(url)
        return
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to print image')
    }
  }

  const handlePrintMount = async (mountId: number) => {
    try {
      const pdfBlob = await fetchPrintMountPdf(mountId)
      const url = URL.createObjectURL(pdfBlob)
      const w = window.open(url, '_blank')
      if (!w) {
        setError('Please allow popups to open the PDF')
        URL.revokeObjectURL(url)
        return
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to print mount')
    }
  }

  const handleDeleteMount = async (mountId: number) => {
    if (!confirm('Are you sure you want to delete this mount?')) return
    try {
      await deleteMount(mountId)
      if (selectedMount?.id === mountId) setSelectedMount(null)
      await fetchMounts()
    } catch (err: any) {
      setError(err?.message || 'Failed to delete mount')
    }
  }

  return (
    <div className="h-full flex flex-col min-h-0 bg-gray-50">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-red-800">{error}</div>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Main Content: large max-width; preview width capped by resize so it uses at most 3/5 of vertical space */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 flex overflow-hidden justify-center min-h-0">
          <div
            ref={contentWrapperRef}
            className="flex-1 flex flex-col overflow-hidden min-h-0 w-full max-w-7xl"
          >
          {/* Top: Preview area – when transform open: two columns (preview | panel); else single card */}
          {transformDialogContext ? (
            <div className="flex-shrink-0 flex flex-row gap-0 min-h-0 px-4 pt-4 pb-4 flex-1">
              <div
                className="flex-1 min-w-0 flex justify-center cursor-pointer"
                onClick={closeTransformPanel}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && closeTransformPanel()}
                aria-label="Click to close transformation panel"
              >
                <div
                  className="flex flex-col overflow-hidden h-full"
                  style={{
                    aspectRatio: MOUNT_CANVAS_WIDTH / MOUNT_CANVAS_HEIGHT,
                    width: '100%',
                    maxWidth: previewMaxWidth ?? undefined,
                  }}
                >
                  <Card className="flex-1 min-h-0 flex flex-col overflow-hidden bg-gray-900 border-border">
                    <CardContent className="flex-1 min-h-0 relative p-0 overflow-hidden flex items-center justify-center">
                      <div className="relative w-full h-full min-h-0 flex items-center justify-center">
                        {(() => {
                          const currentAdj =
                            transformDialogContext.type === 'asset'
                              ? (transformDialogContext.asset.display_adjustments ?? {})
                              : mergeDisplayAdjustments(
                                  (transformDialogContext.mount.template?.default_slot_transformations as Record<string, DisplayAdjustments> | undefined)?.[transformDialogContext.slotId] ?? null,
                                  (transformDialogContext.mount.mount_slots ?? transformDialogContext.mount.slots ?? []).find((s) => s.slot_id === transformDialogContext.slotId)?.adjustments ?? null
                                )
                          const previewAdj = transformPreviewAdjustments ?? currentAdj
                          const filter = displayAdjustmentsToFilter(previewAdj)
                          const transformCss = displayAdjustmentsToTransform(previewAdj)
                          const slot = transformDialogContext.type === 'mount'
                            ? (transformDialogContext.mount.mount_slots ?? transformDialogContext.mount.slots ?? []).find((s) => s.slot_id === transformDialogContext.slotId)
                            : null
                          const asset = transformDialogContext.type === 'asset'
                            ? transformDialogContext.asset
                            : slot?.asset
                              ? {
                                  id: slot.asset.id,
                                  clinic_id: 0,
                                  patient_id: 0,
                                  study_id: null,
                                  modality: (slot.asset.modality as ImagingAsset['modality']) || 'PHOTO',
                                  mime_type: 'image/jpeg',
                                  size_bytes: 0,
                                  captured_at: slot.asset.captured_at || new Date().toISOString(),
                                  source_device: null,
                                  storage_key: '',
                                  thumb_key: slot.asset.thumb_key ?? null,
                                  web_key: slot.asset.web_key ?? null,
                                  name: slot.asset.name ?? null,
                                  image_source: (slot.asset.image_source as ImagingAsset['image_source']) ?? null,
                                } as ImagingAsset
                              : null
                          if (!asset) {
                            return (
                              <div className="text-gray-500 text-sm">No image in this slot</div>
                            )
                          }
                          return (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{
                                filter: filter !== 'none' ? filter : undefined,
                                transform: transformCss !== 'none' ? transformCss : undefined,
                              }}
                            >
                              <AuthenticatedImage
                                assetId={asset.id}
                                variant="original"
                                alt={asset.name || `Asset ${asset.id}`}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          )
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <TransformationDialog
                open={true}
                onOpenChange={(open) => !open && closeTransformPanel()}
                variant="panel"
                current={
                  transformDialogContext.type === 'asset'
                    ? (transformDialogContext.asset.display_adjustments ?? {})
                    : mergeDisplayAdjustments(
                        (transformDialogContext.mount.template?.default_slot_transformations as Record<string, DisplayAdjustments> | undefined)?.[transformDialogContext.slotId] ?? null,
                        (transformDialogContext.mount.mount_slots ?? transformDialogContext.mount.slots ?? []).find((s) => s.slot_id === transformDialogContext.slotId)?.adjustments ?? null
                      )
                }
                onPreviewChange={setTransformPreviewAdjustments}
                onClose={closeTransformPanel}
                onSave={async (adjustments) => {
                  if (transformDialogContext.type === 'asset') {
                    try {
                      await updateAssetDisplayAdjustments(transformDialogContext.asset.id, adjustments)
                      await regenerateAssetDerived(transformDialogContext.asset.id)
                      await fetchAssets()
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to save adjustments')
                    }
                  } else {
                    const slotRow = (transformDialogContext.mount.mount_slots ?? transformDialogContext.mount.slots ?? []).find((s) => s.slot_id === transformDialogContext.slotId)
                    if (slotRow) {
                      try {
                        await updateMountSlotAdjustments(slotRow.id, adjustments)
                        const updated = await getMount(transformDialogContext.mount.id)
                        setSelectedMount(updated)
                        await fetchMounts()
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Failed to save adjustments')
                      }
                    }
                  }
                  // Keep panel open so user can continue editing; close via X or click outside
                }}
                title={transformDialogContext.type === 'asset' ? 'Transform image' : 'Transform slot image'}
              />
            </div>
          ) : (
          <div className="flex-shrink-0 flex justify-center px-4 pt-4 pb-4">
            <div
              className="flex flex-col overflow-hidden"
              style={{
                aspectRatio: MOUNT_CANVAS_WIDTH / MOUNT_CANVAS_HEIGHT,
                width: '100%',
                maxWidth: previewMaxWidth ?? undefined,
              }}
            >
            <Card className="flex-1 min-h-0 flex flex-col overflow-hidden bg-gray-900 border-border">
                <CardContent className="flex-1 min-h-0 relative p-0 overflow-hidden flex items-center justify-center">
                  <div className="relative w-full h-full min-h-0">
                  {selectedAsset && !fullscreenFromMount ? (
                  <>
                    <div
                      className="absolute inset-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden cursor-pointer"
                      onDoubleClick={() => {
                        setFullscreenFromMount(null)
                        setPreviewFullscreen(true)
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setPreviewFullscreen(true)}
                      aria-label="Double-click to view fullscreen"
                      style={{
                        filter: displayAdjustmentsToFilter(selectedAsset.display_adjustments ?? undefined),
                        transform: displayAdjustmentsToTransform(selectedAsset.display_adjustments ?? undefined),
                      }}
                    >
                      <AuthenticatedImage
                        assetId={selectedAsset.id}
                        variant="original"
                        alt={selectedAsset.name || `Asset ${selectedAsset.id}`}
                        className="max-h-full max-w-full object-contain pointer-events-none"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-white/90 hover:text-white hover:bg-white/20 hover:text-red-300"
                        onClick={() => handleDelete(selectedAsset.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-white/90 hover:text-white hover:bg-white/20"
                        onClick={() => {
                          setAssetForInfoDialog(selectedAsset)
                          setAssetInfoDialogMode('edit')
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Modify
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-white/90 hover:text-white hover:bg-white/20"
                        onClick={() => {
                          setAssetForInfoDialog(selectedAsset)
                          setAssetInfoDialogMode('inspect')
                        }}
                      >
                        <CircleHelp className="h-3.5 w-3.5 mr-1.5" />
                        Inspect
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-white/90 hover:text-white hover:bg-white/20"
                        onClick={() => setTransformDialogContext({ type: 'asset', asset: selectedAsset })}
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                        Transform
                      </Button>
                    </div>
                  </>
                ) : selectedMount ? (
                  <div className="absolute inset-0 flex min-h-0 min-w-0 flex-col overflow-hidden p-4">
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-white/90 hover:text-white hover:bg-white/20"
                        onClick={() => {
                          setMountInfoDialogMount(selectedMount)
                          setMountInfoDialogMode('edit')
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Modify
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-white/90 hover:text-white hover:bg-white/20"
                        onClick={() => {
                          setMountInfoDialogMount(selectedMount)
                          setMountInfoDialogMode('inspect')
                        }}
                      >
                        <CircleHelp className="h-3.5 w-3.5 mr-1.5" />
                        Inspect
                      </Button>
                    </div>
                    <div className="flex-1 min-h-0 flex min-w-0 items-center justify-center overflow-hidden">
                      <div className="w-full h-full max-w-full max-h-full min-h-0">
                        <MountView
                        key={`mount-${selectedMount.id}-${selectedMount.updated_at ?? ''}-${(selectedMount.mount_slots ?? selectedMount.slots ?? []).length}`}
                        mount={selectedMount}
                        availableAssets={assets}
                        onMountUpdate={async () => {
                          const updated = await getMount(selectedMount.id)
                          setSelectedMount(updated)
                          await fetchMounts()
                        }}
                        onSlotClick={async (slotId, currentAssetId) => {
                          // Left-click: existing behavior (remove if filled, or assign first available)
                          console.log('Slot clicked:', slotId, 'Current asset:', currentAssetId)
                        }}
                        onSlotDoubleClick={(_, asset) => {
                          if (asset && selectedMount) {
                            setSelectedAsset(asset)
                            setFullscreenFromMount(selectedMount)
                            setPreviewFullscreen(true)
                          }
                        }}
                        onSlotRightClick={(slotId, e) => {
                          e.preventDefault()
                          setMountContextMenu({ x: e.clientX, y: e.clientY, slotId })
                        }}
                      />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                    Select an image or mount from the gallery
                  </div>
                )}
                  </div>
              </CardContent>
            </Card>
            </div>
          </div>
          )}
            {/* Bottom: gallery card with scrollable content */}
            <div className="flex-1 min-h-0 flex flex-col p-4">
              <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <CardContent className="flex-1 min-h-0 overflow-y-auto pt-3">
                  {(loading || (subscriptionActive && subscriptionLoading)) ? (
                    <div className="flex items-center justify-center py-12 text-gray-500">
                      Loading...
                    </div>
                  ) : assets.length === 0 && mounts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No images or mounts yet</p>
                      <p className="text-sm text-gray-400 mt-2">Capture an image or create a mount using the buttons above</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {groupGalleryItemsByDate(assets, mounts).map(({ dateKey, dateLabel, items }) => (
                        <div key={dateKey}>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">{dateLabel}</h3>
                          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-1.5">
                            {items.map((item) => {
                              if (item.type === 'asset') {
                                const asset = item.data
                                return (
                                  <div
                                    key={`asset-${asset.id}`}
                                    draggable
                                    className="relative flex aspect-square items-center justify-center rounded-lg overflow-hidden border-2 bg-gray-100 cursor-pointer transition-all group"
                                    onClick={() => {
                                      setSelectedAsset(asset)
                                      setSelectedMount(null)
                                    }}
                                    onDoubleClick={() => {
                                      setSelectedAsset(asset)
                                      setSelectedMount(null)
                                      setFullscreenFromMount(null)
                                      setPreviewFullscreen(true)
                                    }}
                                    onContextMenu={(e) => {
                                      e.preventDefault()
                                      setGalleryContextMenu({ x: e.clientX, y: e.clientY, item: { type: 'asset', data: asset } })
                                    }}
                                    onDragStart={(e) => {
                                      e.dataTransfer.setData('application/x-tess-imaging-asset', String(asset.id))
                                      e.dataTransfer.effectAllowed = 'copy'
                                    }}
                                  >
                                    {asset.thumb_key ? (
                                      <AuthenticatedImage
                                        assetId={asset.id}
                                        variant="thumb"
                                        alt={asset.name || `Asset ${asset.id}`}
                                        className="max-h-full max-w-full object-contain"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setAssetForInfoDialog(asset)
                                      }}
                                      aria-label="Image details"
                                    >
                                      <CircleHelp className="h-4 w-4" />
                                    </button>
                                    {selectedAsset?.id === asset.id && (
                                      <div className="absolute inset-0 ring-2 ring-blue-500 ring-inset pointer-events-none" />
                                    )}
                                  </div>
                                )
                              } else {
                                const mount = item.data
                                const filledSlots = (mount.mount_slots ?? mount.slots ?? []).filter(s => s.asset).length
                                const totalSlots = Array.isArray(mount.template?.slot_definitions) 
                                  ? mount.template!.slot_definitions.length 
                                  : 0
                                return (
                                  <div
                                    key={`mount-${mount.id}`}
                                    className="relative flex aspect-square items-center justify-center rounded-lg overflow-hidden border-2 bg-white cursor-pointer transition-all group border-blue-300 hover:border-blue-400 hover:shadow-md"
                                    onClick={async () => {
                                      try {
                                        const fullMount = await getMount(mount.id)
                                        setSelectedMount(fullMount)
                                        setSelectedAsset(null)
                                      } catch (err: any) {
                                        setError(err.message || 'Failed to load mount')
                                      }
                                    }}
                                    onContextMenu={(e) => {
                                      e.preventDefault()
                                      setGalleryContextMenu({ x: e.clientX, y: e.clientY, item: { type: 'mount', data: mount } })
                                    }}
                                  >
                                    <div className="w-full h-full relative">
                                      <MountThumbnail mount={mount} />
                                      {/* Overlay with mount info on hover */}
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                                        <div className="text-xs font-medium text-white text-center truncate w-full">
                                          {mount.name || mount.template?.name || 'Unnamed Mount'}
                                        </div>
                                        <div className="text-xs text-white/80 mt-0.5">
                                          {filledSlots}/{totalSlots} filled
                                        </div>
                                      </div>
                                    </div>
                                    {selectedMount?.id === mount.id && (
                                      <div className="absolute inset-0 ring-2 ring-blue-500 ring-inset pointer-events-none" />
                                    )}
                                  </div>
                                )
                              }
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Fixed footer bar – compact */}
        <footer className="flex-shrink-0 flex items-center justify-between gap-4 h-11 px-4 border-t bg-background">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setCaptureDialogOpen(true)}
              disabled={!session || !patientId}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture Image
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setCreateMountDialogOpen(true)}
              disabled={!patientId || !session}
            >
              <Layout className="mr-2 h-4 w-4" />
              Create a Mount
            </Button>
          </div>
        </footer>
      </div>

      {/* Gallery item context menu (right-click on asset or mount) */}
      {galleryContextMenu && (
        <div
          ref={galleryContextMenuRef}
          className="fixed z-50 min-w-[200px] rounded-md border bg-white py-1 shadow-lg"
          style={{ left: galleryContextMenu.x, top: galleryContextMenu.y }}
        >
          {galleryContextMenu.item.type === 'asset' ? (
            <>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  setGalleryContextMenu(null)
                  handleDownloadAsset(
                    galleryContextMenu.item.data.id,
                    'original',
                    `image-${galleryContextMenu.item.data.id}-original.jpg`
                  )
                }}
              >
                <Download className="h-4 w-4" />
                Download original
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  setGalleryContextMenu(null)
                  handleDownloadAsset(
                    galleryContextMenu.item.data.id,
                    'web',
                    `image-${galleryContextMenu.item.data.id}-modified.jpg`
                  )
                }}
              >
                <Download className="h-4 w-4" />
                Download modified
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  setGalleryContextMenu(null)
                  if (galleryContextMenu.item.type === 'asset') {
                    handlePrintAsset(galleryContextMenu.item.data)
                  }
                }}
              >
                <Printer className="h-4 w-4" />
                Print image
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                onClick={() => {
                  setGalleryContextMenu(null)
                  handleDelete(galleryContextMenu.item.data.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete image
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                title="Single images only"
                disabled
              >
                <Download className="h-4 w-4" />
                Download original
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                title="Single images only"
                disabled
              >
                <Download className="h-4 w-4" />
                Download modified
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  setGalleryContextMenu(null)
                  handlePrintMount(galleryContextMenu.item.data.id)
                }}
              >
                <Printer className="h-4 w-4" />
                Print image
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                onClick={() => {
                  setGalleryContextMenu(null)
                  handleDeleteMount(galleryContextMenu.item.data.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete image
              </button>
            </>
          )}
        </div>
      )}

      {/* Mount placeholder context menu */}
      {mountContextMenu && selectedMount && (() => {
        const slots = selectedMount.mount_slots ?? selectedMount.slots ?? []
        const slotHasImage = slots.some((s) => s.slot_id === mountContextMenu.slotId && s.asset_id != null)
        return (
          <div
            ref={mountContextMenuRef}
            className="fixed z-50 min-w-[180px] rounded-md border bg-white py-1 shadow-lg"
            style={{ left: mountContextMenu.x, top: mountContextMenu.y }}
          >
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => {
                setMountContextMenu(null)
                setCaptureDialogMount(selectedMount)
                setCaptureDialogSlotId(mountContextMenu.slotId)
                setCaptureDialogOpen(true)
              }}
            >
              Capture Image
            </button>
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => {
                setTransformDialogContext({
                  type: 'mount',
                  mount: selectedMount,
                  slotId: mountContextMenu.slotId,
                })
                setMountContextMenu(null)
              }}
            >
              Transform
            </button>
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => {
                const queue = getSlotIdsInOrderFrom(selectedMount, mountContextMenu.slotId)
                setMountContextMenu(null)
                setAutoAcquisitionQueue(queue)
                setCaptureDialogMount(selectedMount)
                setCaptureDialogSlotId(queue[0] ?? null)
                setCaptureDialogOpen(true)
              }}
            >
              Continue Auto-Acquisition
            </button>
            {slotHasImage && (
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
                onClick={async () => {
                  setMountContextMenu(null)
                  try {
                    await removeAssetFromMountSlot(selectedMount.id, mountContextMenu.slotId)
                    const updated = await getMount(selectedMount.id)
                    setSelectedMount(updated)
                    await fetchMounts()
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to remove image')
                  }
                }}
              >
                Remove image
              </button>
            )}
          </div>
        )
      })()}

      {/* Capture Image Dialog */}
      {patientId && (
        <CaptureImageDialog
          open={captureDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setCaptureDialogMount(null)
              setCaptureDialogSlotId(null)
              setAutoAcquisitionQueue(null)
              if (selectedMount) {
                getMount(selectedMount.id).then(setSelectedMount).catch(() => {})
              }
            }
            setCaptureDialogOpen(open)
          }}
          patientId={Number(patientId)}
          onSuccess={handleCaptureSuccess}
          mount={captureDialogMount}
          targetSlotId={captureDialogSlotId}
          isAutoAcquisition={autoAcquisitionQueue != null && autoAcquisitionQueue.length > 0}
          onMountUpdated={async () => {
            if (captureDialogMount) {
              const updated = await getMount(captureDialogMount.id)
              setCaptureDialogMount(updated)
              if (selectedMount?.id === captureDialogMount.id) {
                setSelectedMount(updated)
              }
              await fetchMounts()

              if (autoAcquisitionQueue != null && autoAcquisitionQueue.length > 0) {
                const nextQueue = autoAcquisitionQueue.slice(1)
                setAutoAcquisitionQueue(nextQueue.length > 0 ? nextQueue : null)
                if (nextQueue.length > 0) {
                  setCaptureDialogSlotId(nextQueue[0])
                } else {
                  setCaptureDialogSlotId(null)
                  setCaptureDialogOpen(false)
                }
              }
            }
          }}
          onMountFillComplete={() => {
            if (captureDialogMount && selectedMount?.id === captureDialogMount.id) {
              getMount(captureDialogMount.id).then(setSelectedMount).catch(() => {})
            }
            fetchMounts()
          }}
        />
      )}

      {/* Asset info / edit dialog */}
      <AssetInfoDialog
        open={!!assetForInfoDialog}
        onOpenChange={(open) => !open && setAssetForInfoDialog(null)}
        asset={assetForInfoDialog}
        mode={assetInfoDialogMode}
        onSave={() => {
          fetchAssets()
          setAssetForInfoDialog(null)
        }}
      />

      {/* Mount info / edit dialog */}
      <MountInfoDialog
        open={!!mountInfoDialogMount}
        onOpenChange={(open) => {
          if (!open) {
            setMountInfoDialogMount(null)
            setMountInfoDialogMode(null)
          }
        }}
        mount={mountInfoDialogMount}
        mode={mountInfoDialogMode ?? 'inspect'}
        onSave={async () => {
          if (mountInfoDialogMount) {
            const updated = await getMount(mountInfoDialogMount.id)
            setSelectedMount(updated)
            await fetchMounts()
          }
          setMountInfoDialogMount(null)
          setMountInfoDialogMode(null)
        }}
      />

      <CreateMountDialog
        open={createMountDialogOpen}
        onOpenChange={setCreateMountDialogOpen}
        patientId={Number(patientId)}
        clinicId={session?.clinicId ?? 0}
        onCreated={async (mount) => {
          // Add mount to gallery and select it, but don't switch view or auto-open capture
          await fetchMounts()
          const fullMount = await getMount(mount.id)
          setSelectedMount(fullMount)
          setSelectedAsset(null)
        }}
      />

      {/* Fullscreen preview overlay */}
      {previewFullscreen && selectedAsset && (
        <div
          className="fixed inset-0 z-50 flex min-h-0 min-w-0 items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={() => {
            setPreviewFullscreen(false)
            setFullscreenFromMount((prev) => {
              if (prev) setSelectedAsset(null)
              return null
            })
          }}
          role="button"
          tabIndex={0}
            onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setPreviewFullscreen(false)
              setFullscreenFromMount((prev) => {
                if (prev) setSelectedAsset(null)
                return null
              })
            } else if (e.key === 'ArrowLeft' && fullscreenPrev) setSelectedAsset(fullscreenPrev)
            else if (e.key === 'ArrowRight' && fullscreenNext) setSelectedAsset(fullscreenNext)
          }}
          aria-label="Click backdrop or press Escape to close; use arrows for previous/next"
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full text-white/90 hover:bg-white/20 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              setPreviewFullscreen(false)
              setFullscreenFromMount((prev) => {
                if (prev) setSelectedAsset(null)
                return null
              })
            }}
            aria-label="Close fullscreen"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Previous (same date group) */}
          {fullscreenPrev && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full text-white/90 hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedAsset(fullscreenPrev)
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Next (same date group) */}
          {fullscreenNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full text-white/90 hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedAsset(fullscreenNext)
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Image – constrained to viewport so it always fits entirely on screen */}
          <div
            className="flex h-full w-full min-h-0 min-w-0 items-center justify-center p-12"
            onClick={(e) => e.stopPropagation()}
            style={{
              filter: displayAdjustmentsToFilter(selectedAsset.display_adjustments ?? undefined),
              transform: displayAdjustmentsToTransform(selectedAsset.display_adjustments ?? undefined),
            }}
          >
            <AuthenticatedImage
              assetId={selectedAsset.id}
              variant="original"
              alt={selectedAsset.name || `Asset ${selectedAsset.id}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
