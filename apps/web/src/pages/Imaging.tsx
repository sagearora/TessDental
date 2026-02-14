import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  listAssets,
  updateAsset,
  deleteAsset,
  listMounts,
  getMount,
  createMount,
  assignAssetToMountSlot,
  type ImagingAsset,
  type ImagingMount,
} from '@/api/imaging'
import { CaptureImageDialog } from '@/components/imaging/CaptureImageDialog'
import { useAuth } from '@/contexts/AuthContext'
import { ImageIcon, Upload, X, Grid, Layout, Calendar, User, Edit3, Trash2 } from 'lucide-react'
import { AuthenticatedImage } from '@/components/imaging/AuthenticatedImage'
import { InlineEditableField } from '@/components/profile/InlineEditableField'
import { InlineEditableSelect } from '@/components/profile/InlineEditableSelect'
import { listMountTemplates, type MountTemplate } from '@/api/imaging'
import { MountView } from '@/components/imaging/MountView'

type ViewMode = 'images' | 'mounts'

export function Imaging() {
  const { personId } = useParams<{ personId: string }>()
  const { session } = useAuth()
  const [assets, setAssets] = useState<ImagingAsset[]>([])
  const [mounts, setMounts] = useState<ImagingMount[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<ImagingAsset | null>(null)
  const [selectedMount, setSelectedMount] = useState<ImagingMount | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('images')
  const [patientId, setPatientId] = useState<string>(personId || '')
  const [mountTemplates, setMountTemplates] = useState<MountTemplate[]>([])
  const [captureDialogOpen, setCaptureDialogOpen] = useState(false)

  // Update patientId when personId changes
  useEffect(() => {
    if (personId) {
      setPatientId(personId)
    }
  }, [personId])

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
      const data = await listMounts(Number(patientId))
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
      const templates = await listMountTemplates()
      setMountTemplates(templates)
    } catch (err: any) {
      console.error('Error fetching mount templates:', err)
    }
  }

  useEffect(() => {
    if (viewMode === 'images') {
      fetchAssets()
    } else {
      fetchMounts()
    }
  }, [session, patientId, viewMode])

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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Imaging</h1>
            <p className="text-sm text-gray-600 mt-1">Patient ID: {patientId || 'Not set'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'images' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setViewMode('images')
                setSelectedMount(null)
              }}
            >
              <Grid className="h-4 w-4 mr-2" />
              All Images
            </Button>
            <Button
              variant={viewMode === 'mounts' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setViewMode('mounts')
                setSelectedAsset(null)
              }}
            >
              <Layout className="h-4 w-4 mr-2" />
              Mounts
            </Button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-red-800">{error}</div>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Thumbnails/Mounts List */}
        <div className="w-2/3 border-r bg-white overflow-y-auto">
          {viewMode === 'images' ? (
            <div className="p-4">
              {/* Upload Section */}
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <Button
                    onClick={() => setCaptureDialogOpen(true)}
                    disabled={!session || !patientId}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Capture an Image
                  </Button>
                </CardContent>
              </Card>

              {/* Images Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Loading images...</div>
                </div>
              ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No images uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-2">Upload your first image using the form above</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedAsset?.id === asset.id
                          ? 'ring-2 ring-blue-500 border-blue-500'
                          : 'hover:shadow-md border-gray-200'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100 relative">
                        {asset.thumb_key ? (
                          <AuthenticatedImage
                            assetId={asset.id}
                            variant="thumb"
                            alt={asset.name || `Asset ${asset.id}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {asset.name || 'Untitled'}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {formatDate(asset.captured_at)}
                        </div>
                        {asset.image_source && (
                          <div className="text-xs text-blue-600 mt-0.5 capitalize">
                            {asset.image_source}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4">
                <Button
                  onClick={async () => {
                    if (mountTemplates.length > 0) {
                      try {
                        const newMount = await createMount({
                          patientId: Number(patientId),
                          templateId: mountTemplates[0].id, // For now, use first template
                          name: `New Mount - ${new Date().toLocaleDateString()}`,
                        })
                        await fetchMounts()
                        // Fetch full mount with slots
                        const fullMount = await getMount(newMount.id)
                        setSelectedMount(fullMount)
                      } catch (err: any) {
                        setError(err.message || 'Failed to create mount')
                      }
                    } else {
                      setError('No mount templates available')
                    }
                  }}
                  disabled={!patientId || mountTemplates.length === 0}
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
          )}
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
      </div>

      {/* Capture Image Dialog */}
      {patientId && (
        <CaptureImageDialog
          open={captureDialogOpen}
          onOpenChange={setCaptureDialogOpen}
          patientId={Number(patientId)}
          onSuccess={handleCaptureSuccess}
        />
      )}
    </div>
  )
}
