import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadAsset, createStudy, getAssetBlobUrl, type ImagingAsset } from '@/api/imaging'
import { useAuth } from '@/contexts/AuthContext'
import { ImageIcon, Upload, X } from 'lucide-react'
import { AuthenticatedImage } from '@/components/imaging/AuthenticatedImage'

export function Imaging() {
  const { session } = useAuth()
  const [assets, setAssets] = useState<ImagingAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patientId, setPatientId] = useState<string>('1')
  const [studyKind, setStudyKind] = useState<string>('PHOTO')
  const [modality, setModality] = useState<string>('PHOTO')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const IMAGING_API_URL = import.meta.env.VITE_IMAGING_API_URL || 'http://localhost:4010'

  const fetchAssets = async () => {
    if (!session) return

    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(
        `${IMAGING_API_URL}/imaging/assets${patientId ? `?patientId=${patientId}` : ''}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch assets')
      }

      const data = await response.json()
      setAssets(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load images')
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [session, patientId])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !fileInputRef.current?.files?.[0]) {
      setError('Please select a file')
      return
    }

    const file = fileInputRef.current.files[0]
    setUploading(true)
    setError(null)

    try {
      // Create a study first
      const studyResponse = await createStudy({
        patientId: Number(patientId),
        kind: studyKind,
        title: studyKind,
        source: 'manual-upload',
      })

      // Upload the asset
      await uploadAsset({
        patientId: Number(patientId),
        studyId: studyResponse.studyId,
        modality: modality,
        file: file,
      })

      // Refresh the asset list
      await fetchAssets()

      // Reset form
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (assetId: number) => {
    if (!session) return

    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`${IMAGING_API_URL}/imaging/assets/${assetId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete asset')
      }

      await fetchAssets()
    } catch (err: any) {
      setError(err.message || 'Failed to delete image')
      console.error('Delete error:', err)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Imaging Test Page</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload and view imaging assets. This is a test page for the imaging service.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Upload a new image to the imaging service</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  type="number"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="studyKind">Study Kind</Label>
                <Input
                  id="studyKind"
                  value={studyKind}
                  onChange={(e) => setStudyKind(e.target.value)}
                  placeholder="e.g., PHOTO, XRAY_BWX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="modality">Modality</Label>
                <Input
                  id="modality"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  placeholder="e.g., PHOTO, XRAY, DOC"
                  required
                />
              </div>
              <div>
                <Label htmlFor="file">Image File</Label>
                <Input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={uploading || !session}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Uploaded Images</CardTitle>
              <CardDescription>
                {assets.length} image{assets.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Button onClick={fetchAssets} variant="outline" disabled={loading}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 relative group">
                    {asset.thumb_key ? (
                      <AuthenticatedImage
                        assetId={asset.id}
                        variant="thumb"
                        alt={`Asset ${asset.id}`}
                        className="w-full h-full object-contain"
                        onError={() => {
                          // Fallback handled by component
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <div className="text-sm font-medium text-gray-900">Asset #{asset.id}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {asset.modality} • {Math.round(asset.size_bytes / 1024)} KB
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(asset.captured_at).toLocaleString()}
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const url = await getAssetBlobUrl(asset.id, 'web')
                          const newWindow = window.open()
                          if (newWindow) {
                            newWindow.location.href = url
                          }
                        } catch (err) {
                          console.error('Failed to open image:', err)
                          setError('Failed to load full size image')
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                    >
                      View Full Size →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
