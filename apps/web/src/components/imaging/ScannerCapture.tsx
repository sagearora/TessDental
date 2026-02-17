import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Loader2, Scan } from 'lucide-react'
import {
  isCaptureBridgeAvailable,
  scanDevices,
  capture,
  type CaptureBridgeDevice,
} from '@/api/captureBridge'
import { checkScannerAppAvailable, listScannerDevices, requestScan, type ScannerDevice } from '@/api/scanner'

interface ScannerCaptureProps {
  onCapture: (file: File) => void
  /** When provided and bridge is used, capture uploads directly; on success this is called instead of onCapture. */
  getCaptureUploadContext?: () => Promise<{ uploadToken: string; uploadUrl: string }>
  onDirectUploadComplete?: () => void
}

type Backend = 'bridge' | 'rest' | 'none'

export function ScannerCapture({
  onCapture,
  getCaptureUploadContext,
  onDirectUploadComplete,
}: ScannerCaptureProps) {
  const [backend, setBackend] = useState<Backend | null>(null)
  const [bridgeDevices, setBridgeDevices] = useState<CaptureBridgeDevice[]>([])
  const [restDevices, setRestDevices] = useState<ScannerDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const devices = backend === 'bridge' ? bridgeDevices : restDevices
  const deviceCount = devices.length
  const available = backend !== null && backend !== 'none'

  useEffect(() => {
    const init = async () => {
      try {
        const bridgeAvailable = await isCaptureBridgeAvailable()
        if (bridgeAvailable) {
          setBackend('bridge')
          try {
            const list = await scanDevices()
            setBridgeDevices(list)
            if (list.length === 1) setSelectedDeviceId(String(list[0].id))
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to list TWAIN devices')
          }
          return
        }
        const restAvailable = await checkScannerAppAvailable()
        if (restAvailable) {
          setBackend('rest')
          try {
            const list = await listScannerDevices()
            setRestDevices(list)
            if (list.length === 1) setSelectedDeviceId(list[0].id)
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to list scanner devices')
          }
          return
        }
        setBackend('none')
        setError(null)
      } catch (err: unknown) {
        setBackend('none')
        setError(err instanceof Error ? err.message : 'Failed to check capture app availability')
      }
    }
    init()
  }, [])

  const availableButNoDevices = available && deviceCount === 0 && !error

  const handleScan = async () => {
    if (!selectedDeviceId) {
      setError('Please select a capture device')
      return
    }
    setScanning(true)
    setError(null)
    try {
      if (backend === 'bridge') {
        const sourceProductName = selectedDeviceId
        const options =
          getCaptureUploadContext != null
            ? await getCaptureUploadContext()
            : undefined
        const files = await capture(sourceProductName, options)
        if (options != null) {
          onDirectUploadComplete?.()
        } else {
          files.forEach((file) => onCapture(file))
        }
      } else {
        const result = await requestScan(selectedDeviceId)
        const file = new File(
          [result.image],
          `scan-${Date.now()}.${result.format}`,
          { type: `image/${result.format}` }
        )
        onCapture(file)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Capture failed. Please try again.')
    } finally {
      setScanning(false)
    }
  }

  if (backend === null) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Checking capture app...</span>
      </div>
    )
  }

  if (available && deviceCount === 0 && error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-center text-gray-700 mb-2">Capture app is not responding</p>
        <p className="text-sm text-center text-gray-500">{error}</p>
      </div>
    )
  }

  if (backend === 'none') {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-center text-gray-700 mb-2">Capture app is not running</p>
        <p className="text-sm text-center text-gray-500">
          Please start TessCapture (or Windows Imaging Bridge) on your computer to use
          device capture.
        </p>
      </div>
    )
  }

  if (availableButNoDevices) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-center text-gray-700">
          No TWAIN devices found. Connect a scanner or camera and install its drivers, then try
          again.
        </p>
      </div>
    )
  }

  if (scanning) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Waiting for capture...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {deviceCount > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select capture device
          </label>
          <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => {
                const id = backend === 'bridge' ? String((device as CaptureBridgeDevice).id) : (device as ScannerDevice).id
                const name = device.name
                const type = 'type' in device ? String(device.type).toUpperCase() : 'TWAIN'
                return (
                  <SelectItem key={id} value={id}>
                    {name} ({type})
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {deviceCount === 1 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Using: <strong>{devices[0].name}</strong>
          </p>
        </div>
      )}

      <Button
        onClick={handleScan}
        disabled={scanning || !selectedDeviceId}
        className="w-full"
      >
        {scanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Capturing...
          </>
        ) : (
          <>
            <Scan className="mr-2 h-4 w-4" />
            Capture
          </>
        )}
      </Button>
    </div>
  )
}
