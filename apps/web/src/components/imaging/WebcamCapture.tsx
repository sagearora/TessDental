import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, AlertCircle } from 'lucide-react'

interface WebcamCaptureProps {
  onCapture: (file: File) => void
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Request webcam access
    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
        setError(null)
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission denied. Please allow camera access and try again.')
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found. Please connect a camera and try again.')
        } else {
          setError('Failed to access camera: ' + err.message)
        }
      }
    }

    startWebcam()

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !stream) return

    setIsCapturing(true)
    try {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      ctx.drawImage(video, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `webcam-${Date.now()}.jpg`, {
              type: 'image/jpeg',
            })
            onCapture(file)
            setIsCapturing(false)
          } else {
            setError('Failed to capture image')
            setIsCapturing(false)
          }
        },
        'image/jpeg',
        0.95
      )
    } catch (err: any) {
      setError('Failed to capture photo: ' + err.message)
      setIsCapturing(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 text-center">{error}</p>
      </div>
    )
  }

  if (!stream) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-gray-500">Starting camera...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto max-h-96 object-contain"
        />
      </div>
      <Button onClick={capturePhoto} disabled={isCapturing} className="w-full">
        <Camera className="mr-2 h-4 w-4" />
        {isCapturing ? 'Capturing...' : 'Capture Photo'}
      </Button>
    </div>
  )
}
