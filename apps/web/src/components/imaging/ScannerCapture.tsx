import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Loader2, Scan } from 'lucide-react'
import { checkScannerAppAvailable, listScannerDevices, requestScan, type ScannerDevice } from '@/api/scanner'

interface ScannerCaptureProps {
  onCapture: (file: File) => void
}

export function ScannerCapture({ onCapture }: ScannerCaptureProps) {
  const [available, setAvailable] = useState<boolean | null>(null)
  const [devices, setDevices] = useState<ScannerDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const isAvailable = await checkScannerAppAvailable()
        setAvailable(isAvailable)

        if (isAvailable) {
          try {
            const deviceList = await listScannerDevices()
            setDevices(deviceList)
            if (deviceList.length === 1) {
              setSelectedDeviceId(deviceList[0].id)
            }
          } catch (err: any) {
            setError(err.message || 'Failed to list scanner devices')
          }
        }
      } catch (err: any) {
        setAvailable(false)
        setError(err.message || 'Failed to check scanner app availability')
      }
    }

    checkAvailability()
  }, [])

  const handleScan = async () => {
    if (!selectedDeviceId) {
      setError('Please select a scanner device')
      return
    }

    setScanning(true)
    setError(null)

    try {
      const result = await requestScan(selectedDeviceId)
      
      // Convert blob to File
      const file = new File(
        [result.image],
        `scan-${Date.now()}.${result.format}`,
        { type: `image/${result.format}` }
      )
      
      onCapture(file)
    } catch (err: any) {
      setError(err.message || 'Scan failed. Please try again.')
    } finally {
      setScanning(false)
    }
  }

  if (available === null) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Checking scanner app...</span>
      </div>
    )
  }

  if (available === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-center text-gray-700 mb-2">
          Scanner app is not running
        </p>
        <p className="text-sm text-center text-gray-500">
          Please start the Windows Imaging Bridge application on your computer to use scanner capture.
        </p>
      </div>
    )
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-center text-gray-700">
          No scanner devices found. Please connect a scanner and try again.
        </p>
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

      {devices.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Scanner Device
          </label>
          <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a scanner" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name} ({device.type.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {devices.length === 1 && (
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
            Scanning...
          </>
        ) : (
          <>
            <Scan className="mr-2 h-4 w-4" />
            Scan
          </>
        )}
      </Button>
    </div>
  )
}
