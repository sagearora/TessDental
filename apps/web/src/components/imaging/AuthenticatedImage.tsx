import { useState, useEffect, useRef } from 'react'
import { getAssetBlobUrl } from '@/api/imaging'
import { ImageIcon } from 'lucide-react'

interface AuthenticatedImageProps {
  assetId: number
  variant?: 'original' | 'web' | 'thumb'
  alt?: string
  className?: string
  onError?: () => void
}

export function AuthenticatedImage({ 
  assetId, 
  variant = 'thumb', 
  alt = `Asset ${assetId}`,
  className = '',
  onError
}: AuthenticatedImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true)
        setError(false)
        const blobUrl = await getAssetBlobUrl(assetId, variant)
        blobUrlRef.current = blobUrl
        setImageUrl(blobUrl)
      } catch (err) {
        console.error('Failed to load image:', err)
        setError(true)
        if (onError) onError()
      } finally {
        setLoading(false)
      }
    }

    loadImage()

    // Do not revoke the blob URL here: getAssetBlobUrl caches URLs and other
    // instances may still use them. Only invalidateAssetBlobCache() revokes.
    return () => {
      blobUrlRef.current = null
    }
  }, [assetId, variant])

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (error || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <ImageIcon className="h-12 w-12 text-gray-400" />
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => {
        setError(true)
        if (onError) onError()
      }}
    />
  )
}
