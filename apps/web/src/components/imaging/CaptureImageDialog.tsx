import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Upload, X, Loader2, AlertCircle, FileImage } from 'lucide-react'
import { WebcamCapture } from './WebcamCapture'
import { ScannerCapture } from './ScannerCapture'
import { uploadMultipleAssets, getCaptureUploadToken } from '@/api/imaging'
import {
  getNextEmptySlotId,
  getEmptySlotIdsInOrderFrom,
  getMountTemplate,
  getEffectiveSlotOrder,
  assignAssetToMountSlot,
  type ImagingMount,
} from '@/api/mounts'

type UploadSource = 'hard_drive' | 'webcam' | 'capture_device'

const IMAGE_SOURCE_OPTIONS = [
  { value: 'photo', label: 'Photo' },
  { value: 'intraoral', label: 'Intraoral' },
  { value: 'panoramic', label: 'Panoramic' },
  { value: 'scanner', label: 'Scanner' },
  { value: 'webcam', label: 'Webcam' },
] as const

interface CaptureImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: number
  patientName?: string
  onSuccess?: () => void
  /** When set, dialog runs in fill mode: assign each upload to next empty slot and relaunch until all filled. */
  mount?: ImagingMount | null
  /** When set with mount, assigns captured asset to this specific slot instead of next empty slot. */
  targetSlotId?: string | null
  /** Called after assigning an asset to a slot so parent can refresh mount (e.g. getMount). */
  onMountUpdated?: () => void
  /** Called when the last slot was just filled (before closing). */
  onMountFillComplete?: () => void
  /** When true, show hint that user can click Done to stop auto-acquisition. */
  isAutoAcquisition?: boolean
}

const STORAGE_KEY_UPLOAD_SOURCE = 'capture-image-dialog-upload-source'
const STORAGE_KEY_FILE_TYPE = 'capture-image-dialog-file-type'

export function CaptureImageDialog({
  open,
  onOpenChange,
  patientId,
  patientName,
  onSuccess,
  mount,
  targetSlotId,
  onMountUpdated,
  onMountFillComplete,
  isAutoAcquisition,
}: CaptureImageDialogProps) {
  const fillMode = Boolean(mount)
  const template = mount ? getMountTemplate(mount) : null
  const slotOrder = template ? getEffectiveSlotOrder(template, null) : []
  const nextEmptySlotId = mount ? getNextEmptySlotId(mount, null) : null
  const filledCount = mount ? (mount.mount_slots ?? mount.slots ?? []).length : 0
  const allSlotsFilled = fillMode && nextEmptySlotId === null && !targetSlotId

  // Load persisted preferences from localStorage
  const getStoredUploadSource = (): UploadSource => {
    if (typeof window === 'undefined') return 'hard_drive'
    const stored = localStorage.getItem(STORAGE_KEY_UPLOAD_SOURCE)
    return (stored as UploadSource) || 'hard_drive'
  }

  const getStoredFileType = (): string => {
    if (typeof window === 'undefined') return 'photo'
    return localStorage.getItem(STORAGE_KEY_FILE_TYPE) || 'photo'
  }

  const [uploadSource, setUploadSource] = useState<UploadSource>(getStoredUploadSource())
  const [fileType, setFileType] = useState<string>(getStoredFileType())
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadResults, setUploadResults] = useState<Array<{ success: boolean; error?: string; fileName?: string }> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_UPLOAD_SOURCE, uploadSource)
    }
  }, [uploadSource])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_FILE_TYPE, fileType)
    }
  }, [fileType])

  // Load preferences from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      setUploadSource(getStoredUploadSource())
      setFileType(getStoredFileType())
      // Clear only upload-related state
      setSelectedFiles([])
      setUploadError(null)
      setUploadResults(null)
      setUploading(false)
      setIsDragging(false)
      dragCounterRef.current = 0
    }
  }, [open])

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'))
    setSelectedFiles((prev) => [...prev, ...fileArray])
    setUploadError(null)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounterRef.current = 0

    if (uploadSource === 'hard_drive') {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleWebcamCapture = (file: File) => {
    setSelectedFiles((prev) => [...prev, file])
    setUploadError(null)
  }

  const handleScannerCapture = (file: File) => {
    setSelectedFiles((prev) => [...prev, file])
    setUploadError(null)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one file')
      return
    }

    const filesToUpload = selectedFiles

    setUploading(true)
    setUploadError(null)
    setUploadResults(null)

    try {
      const result = await uploadMultipleAssets({
        files: filesToUpload,
        patientId,
        modality: 'PHOTO',
        imageSource: fileType as any,
      })

      setUploadResults(result.results)

      if (result.summary.succeeded > 0) {
        if (fillMode && mount) {
          const firstSlotId = targetSlotId || nextEmptySlotId
          if (firstSlotId) {
            const emptySlotIds = getEmptySlotIdsInOrderFrom(mount, firstSlotId)
            const successfulAssets = result.results.filter(
              (r): r is typeof r & { assetId: number } => r.success === true && r.assetId != null
            )
            const toAssign = Math.min(successfulAssets.length, emptySlotIds.length)
            for (let i = 0; i < toAssign; i++) {
              await assignAssetToMountSlot(mount.id, emptySlotIds[i], successfulAssets[i].assetId)
            }
            await onMountUpdated?.()
            setSelectedFiles([])
            setUploadResults(null)
            setUploadError(null)
            onSuccess?.()
            if (filledCount + toAssign >= slotOrder.length) {
              onMountFillComplete?.()
            }
          } else {
            setSelectedFiles([])
            setUploadResults(null)
            setUploadError(null)
            onSuccess?.()
          }
        } else if (!fillMode) {
          setSelectedFiles([])
          onSuccess?.()
        }
      } else {
        setUploadError('All files failed to upload. Please check the errors below.')
      }
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      // Only clear upload-related state, keep preferences
      setSelectedFiles([])
      setUploadError(null)
      setUploadResults(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {fillMode
              ? allSlotsFilled
                ? 'Mount complete'
                : `Upload image for ${patientName || `Patient #${patientId}`}`
              : `Upload an image for ${patientName || `Patient #${patientId}`}`}
          </DialogTitle>
        </DialogHeader>

        {fillMode && allSlotsFilled && (
          <div className="py-4 text-center space-y-4">
            <p className="text-sm text-gray-600">All placeholders filled.</p>
            <Button onClick={handleClose}>Done</Button>
          </div>
        )}

        {(!fillMode || !allSlotsFilled) && (
        <>
        <div className="space-y-6">
          {fillMode && (targetSlotId || nextEmptySlotId) && slotOrder.length > 0 && (
            <div className="space-y-1">
              <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                {targetSlotId ? (
                  <>
                    Capturing for specific slot
                    {template && Array.isArray(template.slot_definitions) && (() => {
                      const def = (template.slot_definitions as { slot_id: string; label?: string }[]).find(
                        (d) => d.slot_id === targetSlotId
                      )
                      return def?.label ? `: ${def.label}` : ''
                    })()}
                  </>
                ) : (
                  <>
                    Filling mount: slot {slotOrder.indexOf(nextEmptySlotId!) + 1} of {slotOrder.length}
                    {template && Array.isArray(template.slot_definitions) && (() => {
                      const def = (template.slot_definitions as { slot_id: string; label?: string }[]).find(
                        (d) => d.slot_id === nextEmptySlotId
                      )
                      return def?.label ? ` (${def.label})` : ''
                    })()}
                  </>
                )}
              </div>
              {isAutoAcquisition && (
                <p className="text-xs text-gray-500">Click Done to stop auto-acquisition.</p>
              )}
            </div>
          )}
          {/* Upload Source Selection */}
          <div>
            <Label className="mb-2 block">Upload files from:</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="uploadSource"
                  value="hard_drive"
                  checked={uploadSource === 'hard_drive'}
                  onChange={(e) => setUploadSource(e.target.value as UploadSource)}
                  className="mr-2"
                />
                Hard Drive
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="uploadSource"
                  value="webcam"
                  checked={uploadSource === 'webcam'}
                  onChange={(e) => setUploadSource(e.target.value as UploadSource)}
                  className="mr-2"
                />
                Webcam
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="uploadSource"
                  value="capture_device"
                  checked={uploadSource === 'capture_device'}
                  onChange={(e) => setUploadSource(e.target.value as UploadSource)}
                  className="mr-2"
                />
                Capture Device
              </label>
            </div>
          </div>

          {/* Source-Specific Content */}
          <div className="min-h-[200px]">
            {uploadSource === 'hard_drive' && (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop images here, or click to select
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </Button>
              </div>
            )}

            {uploadSource === 'webcam' && (
              <WebcamCapture onCapture={handleWebcamCapture} />
            )}

            {uploadSource === 'capture_device' && (
              <ScannerCapture
                onCapture={handleScannerCapture}
                getCaptureUploadContext={
                  fillMode
                    ? undefined
                    : async () => {
                        const r = await getCaptureUploadToken({
                          patientId,
                          modality: 'PHOTO',
                          imageSource: fileType,
                        })
                        return { uploadToken: r.uploadToken, uploadUrl: r.uploadUrl }
                      }
                }
                onDirectUploadComplete={
                  fillMode
                    ? undefined
                    : () => {
                        onSuccess?.()
                        onOpenChange(false)
                      }
                }
              />
            )}
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div>
              <Label className="mb-2 block">Selected files ({selectedFiles.length}):</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="ml-2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Type Selection */}
          <div>
            <Label htmlFor="fileType" className="mb-2 block">
              File Type:
            </Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger id="fileType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_SOURCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          )}

          {/* Upload Results */}
          {uploadResults && (
            <div className="space-y-2">
              <Label>Upload Results:</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto border rounded-lg p-2">
                {uploadResults.map((result, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      result.success
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {result.fileName}: {result.success ? '✓ Success' : `✗ ${result.error}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={uploading}>
            Done
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload ({selectedFiles.length})
              </>
            )}
          </Button>
        </DialogFooter>
        </>
        )}
      </DialogContent>
    </Dialog>
  )
}
