import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSubscription } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  listAssets,
  updateAsset,
  deleteAsset,
  listMounts,
  getMount,
  type ImagingAsset,
  type ImagingMount,
} from '@/api/imaging'
import {
  listMountTemplates,
  getNextEmptySlotId,
  type SystemMountTemplate,
  type ClinicMountTemplate,
} from '@/api/mounts'
import { CaptureImageDialog } from '@/components/imaging/CaptureImageDialog'
import { AssetInfoDialog } from '@/components/imaging/AssetInfoDialog'
import { useAuth } from '@/contexts/AuthContext'
import { ImageIcon, X, Layout, Calendar, Trash2, CircleHelp, Pencil, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { AuthenticatedImage } from '@/components/imaging/AuthenticatedImage'
import { InlineEditableField } from '@/components/profile/InlineEditableField'
import { InlineEditableSelect } from '@/components/profile/InlineEditableSelect'
import { MountView } from '@/components/imaging/MountView'
import { CreateMountDialog } from '@/components/imaging/CreateMountDialog'

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
    }
  }
`

type ViewMode = 'images' | 'mounts'

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
  const [viewMode, setViewMode] = useState<ViewMode>('images')
  const [patientId, setPatientId] = useState<string>(personId || '')
  const [, setMountTemplates] = useState<MountTemplateOption[]>([])
  const [captureDialogOpen, setCaptureDialogOpen] = useState(false)
  const [captureDialogMount, setCaptureDialogMount] = useState<ImagingMount | null>(null)
  const [createMountDialogOpen, setCreateMountDialogOpen] = useState(false)
  const [assetForInfoDialog, setAssetForInfoDialog] = useState<ImagingAsset | null>(null)
  const [previewFullscreen, setPreviewFullscreen] = useState(false)

  // Update patientId when personId changes
  useEffect(() => {
    if (personId) {
      setPatientId(personId)
    }
  }, [personId])

  // Fullscreen preview: Escape to close, ArrowLeft/ArrowRight for prev/next (same date group)
  const groups = groupAssetsByCaptureDate(assets)
  const fullscreenGroup = previewFullscreen && selectedAsset
    ? groups.find((g) => g.assets.some((a) => a.id === selectedAsset.id))
    : null
  const fullscreenIndex =
    fullscreenGroup && selectedAsset
      ? fullscreenGroup.assets.findIndex((a) => a.id === selectedAsset.id)
      : -1
  const fullscreenPrev =
    fullscreenGroup && fullscreenIndex > 0 ? fullscreenGroup.assets[fullscreenIndex - 1] : null
  const fullscreenNext =
    fullscreenGroup && fullscreenIndex >= 0 && fullscreenIndex < fullscreenGroup.assets.length - 1
      ? fullscreenGroup.assets[fullscreenIndex + 1]
      : null

  useEffect(() => {
    if (!previewFullscreen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewFullscreen(false)
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

  const subscriptionActive =
    viewMode === 'images' && Boolean(patientId && session?.clinicId)

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
      setMounts(data)
      // Clear selection if selected mount no longer exists
      if (selectedMount && !data.find((m) => m.id === selectedMount.id)) {
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
    if (viewMode === 'images') {
      if (!subscriptionActive) fetchAssets()
    } else {
      fetchMounts()
    }
  }, [session, patientId, viewMode, subscriptionActive])

  useEffect(() => {
    fetchMountTemplates()
  }, [session])

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

  const handleUpdateAssetName = async (name: string) => {
    if (!selectedAsset) return
    try {
      await updateAsset(selectedAsset.id, { name: name.trim() || null })
      await fetchAssets()
      // Update selected asset
      const updated = await listAssets(Number(patientId))
      const updatedAsset = updated.find((a) => a.id === selectedAsset.id)
      if (updatedAsset) {
        setSelectedAsset(updatedAsset)
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update name')
    }
  }

  const handleUpdateImageSource = async (imageSource: string) => {
    if (!selectedAsset) return
    try {
      await updateAsset(selectedAsset.id, {
        imageSource: imageSource as 'intraoral' | 'panoramic' | 'webcam' | 'scanner' | 'photo' | null,
      })
      await fetchAssets()
      // Update selected asset
      const updated = await listAssets(Number(patientId))
      const updatedAsset = updated.find((a) => a.id === selectedAsset.id)
      if (updatedAsset) {
        setSelectedAsset(updatedAsset)
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update image source')
    }
  }

  const imageSourceOptions = [
    { value: 'intraoral', label: 'Intraoral' },
    { value: 'panoramic', label: 'Panoramic' },
    { value: 'webcam', label: 'Webcam' },
    { value: 'scanner', label: 'Scanner' },
    { value: 'photo', label: 'Photo' },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'images' ? (
          /* Images view: top = preview (no scroll), bottom = gallery (only scroll) */
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Top: Preview area (~50%) – inside card, dark grey background */}
            <div className="flex-1 min-h-0 flex flex-col p-4 overflow-hidden">
              <Card className="flex-1 min-h-0 flex flex-col overflow-hidden bg-gray-900 border-border">
                <CardContent className="flex-1 min-h-0 relative p-0 overflow-hidden">
                  {selectedAsset ? (
                    <>
                      <div
                        className="absolute inset-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden cursor-pointer"
                        onDoubleClick={() => setPreviewFullscreen(true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setPreviewFullscreen(true)}
                        aria-label="Double-click to view fullscreen"
                      >
                        <AuthenticatedImage
                          assetId={selectedAsset.id}
                          variant="web"
                          alt={selectedAsset.name || `Asset ${selectedAsset.id}`}
                          className="max-h-full max-w-full object-contain pointer-events-none"
                        />
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-white/90 hover:text-white hover:bg-white/20"
                          onClick={() => setAssetForInfoDialog(selectedAsset)}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1.5" />
                          Modify
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-white/90 hover:text-white hover:bg-white/20 hover:text-red-300"
                          onClick={() => handleDelete(selectedAsset.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-gray-400 p-4">
                      <ImageIcon className="h-16 w-16 text-gray-600 mb-4" />
                      <p>Select an image</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Bottom: gallery card with fixed header and scrollable content */}
            <div className="flex-1 min-h-0 flex flex-col p-4">
              <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
                  <CardTitle className="text-base">Gallery</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit"
                      onClick={() => setCaptureDialogOpen(true)}
                      disabled={!session || !patientId}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Image
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit"
                      onClick={() => setCreateMountDialogOpen(true)}
                      disabled={!patientId || !session}
                    >
                      <Layout className="mr-2 h-4 w-4" />
                      Create a Mount
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-y-auto pt-0">
                  {(loading || (subscriptionActive && subscriptionLoading)) ? (
                    <div className="flex items-center justify-center py-12 text-gray-500">
                      Loading images...
                    </div>
                  ) : assets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No images uploaded yet</p>
                      <p className="text-sm text-gray-400 mt-2">Capture an image using the button above</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {groupAssetsByCaptureDate(assets).map(({ dateKey, dateLabel, assets: groupAssets }) => (
                        <div key={dateKey}>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">{dateLabel}</h3>
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {groupAssets.map((asset) => (
                              <div
                                key={asset.id}
                                className="relative flex aspect-square items-center justify-center rounded-lg overflow-hidden border-2 bg-gray-100 cursor-pointer transition-all group"
                                onClick={() => setSelectedAsset(asset)}
                                onDoubleClick={() => {
                                  setSelectedAsset(asset)
                                  setPreviewFullscreen(true)
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
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            {/* Left Panel - Mounts List */}
            <div className="w-2/3 border-r bg-white overflow-y-auto">
              <div className="p-4">
              <div className="mb-4">
                <Button
                  onClick={() => setCreateMountDialogOpen(true)}
                  disabled={!patientId || !session}
                >
                  <Layout className="h-4 w-4 mr-2" />
                  New Mount
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Loading mounts...</div>
                </div>
              ) : mounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Layout className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No mounts created yet</p>
                  <p className="text-sm text-gray-400 mt-2">Create your first mount using the button above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mounts.map((mount) => (
                    <div
                      key={mount.id}
                      onClick={async () => {
                        try {
                          const fullMount = await getMount(mount.id)
                          setSelectedMount(fullMount)
                        } catch (err: any) {
                          setError(err.message || 'Failed to load mount')
                        }
                      }}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedMount?.id === mount.id
                          ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {mount.name || mount.template?.name || 'Unnamed Mount'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {mount.template?.name || 'Unknown Template'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDate(mount.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/3 bg-gray-50 border-l overflow-y-auto">
              {selectedAsset ? (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Image Preview</h2>
                <div className="bg-white rounded-lg border p-4 mb-4">
                  <div className="aspect-square bg-gray-100 rounded mb-4">
                    <AuthenticatedImage
                      assetId={selectedAsset.id}
                      variant="web"
                      alt={selectedAsset.name || `Asset ${selectedAsset.id}`}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Image Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InlineEditableField
                    value={selectedAsset.name}
                    onSave={handleUpdateAssetName}
                    label="Name"
                    type="text"
                  />

                  <InlineEditableSelect
                    value={selectedAsset.image_source || ''}
                    onSave={handleUpdateImageSource}
                    label="Image Source"
                    options={imageSourceOptions}
                  />

                  <div>
                    <p className="text-sm text-gray-500">Acquisition Date</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(selectedAsset.captured_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Modality</p>
                    <p className="font-medium text-gray-900 mt-1">{selectedAsset.modality}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">File Size</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {Math.round(selectedAsset.size_bytes / 1024)} KB
                    </p>
                  </div>

                  {selectedAsset.created_at && (
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {formatDate(selectedAsset.created_at)}
                      </p>
                    </div>
                  )}

                  {selectedAsset.updated_at && selectedAsset.updated_at !== selectedAsset.created_at && (
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {formatDate(selectedAsset.updated_at)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(selectedAsset.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Image
                </Button>
              </div>
            </div>
          ) : selectedMount ? (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mount Preview</h2>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{selectedMount.name || 'Unnamed Mount'}</CardTitle>
                    <CardDescription>{selectedMount.template?.name || 'Unknown Template'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      <p>Created: {formatDate(selectedMount.created_at)}</p>
                      {selectedMount.description && (
                        <p className="mt-2">{selectedMount.description}</p>
                      )}
                    </div>
                    {getNextEmptySlotId(selectedMount, null) && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCaptureDialogMount(selectedMount)
                            setCaptureDialogOpen(true)
                          }}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Fill with captures
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Mount Layout */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mount Layout</CardTitle>
                </CardHeader>
                <CardContent>
                  <MountView
                    mount={selectedMount}
                    availableAssets={assets}
                    onMountUpdate={async () => {
                      const updated = await getMount(selectedMount.id)
                      setSelectedMount(updated)
                      await fetchMounts()
                    }}
                    onSlotClick={async (slotId, currentAssetId) => {
                      // Open dialog to select asset for this slot
                      // For now, just log - can be enhanced with a proper dialog
                      console.log('Slot clicked:', slotId, 'Current asset:', currentAssetId)
                      // TODO: Implement asset selection dialog
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Select an image or mount to view details</p>
              </div>
            </div>
          )}
            </div>
          </>
        )}
      </div>

      {/* Capture Image Dialog */}
      {patientId && (
        <CaptureImageDialog
          open={captureDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setCaptureDialogMount(null)
              if (selectedMount) {
                getMount(selectedMount.id).then(setSelectedMount).catch(() => {})
              }
            }
            setCaptureDialogOpen(open)
          }}
          patientId={Number(patientId)}
          onSuccess={handleCaptureSuccess}
          mount={captureDialogMount}
          onMountUpdated={async () => {
            if (captureDialogMount) {
              const updated = await getMount(captureDialogMount.id)
              setCaptureDialogMount(updated)
              if (selectedMount?.id === captureDialogMount.id) {
                setSelectedMount(updated)
              }
              await fetchMounts()
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
        onSave={() => {
          fetchAssets()
          setAssetForInfoDialog(null)
        }}
      />

      <CreateMountDialog
        open={createMountDialogOpen}
        onOpenChange={setCreateMountDialogOpen}
        patientId={Number(patientId)}
        clinicId={session?.clinicId ?? 0}
        onCreated={(mount) => {
          setSelectedMount(mount)
          setViewMode('mounts')
          fetchMounts()
          setCaptureDialogMount(mount)
          setCaptureDialogOpen(true)
        }}
      />

      {/* Fullscreen preview overlay */}
      {previewFullscreen && selectedAsset && (
        <div
          className="fixed inset-0 z-50 flex min-h-0 min-w-0 items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={() => setPreviewFullscreen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setPreviewFullscreen(false)
            else if (e.key === 'ArrowLeft' && fullscreenPrev) setSelectedAsset(fullscreenPrev)
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
          >
            <AuthenticatedImage
              assetId={selectedAsset.id}
              variant="web"
              alt={selectedAsset.name || `Asset ${selectedAsset.id}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
