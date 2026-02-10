import sharp from 'sharp'
import { env } from '../env.js'

export interface ThumbnailOptions {
  maxWidth: number
  maxHeight?: number
  format: 'webp' | 'jpeg' | 'png'
  quality?: number
}

/**
 * Generate thumbnail from image buffer
 */
export async function generateThumbnail(
  input: Buffer,
  options: ThumbnailOptions
): Promise<Buffer> {
  const { maxWidth, maxHeight, format, quality = 85 } = options

  let pipeline = sharp(input).resize(maxWidth, maxHeight, {
    fit: 'inside',
    withoutEnlargement: true,
  })

  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality })
      break
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality })
      break
    case 'png':
      pipeline = pipeline.png({ quality })
      break
  }

  return await pipeline.toBuffer()
}

/**
 * Generate web-optimized version
 */
export async function generateWebVersion(
  input: Buffer,
  maxWidth: number = 2000
): Promise<Buffer> {
  return await sharp(input)
    .resize(maxWidth, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer()
}

/**
 * Generate thumbnail (400px wide, webp)
 */
export async function generateThumb(input: Buffer): Promise<Buffer> {
  if (!env.IMAGING_THUMBS_ENABLED) {
    throw new Error('Thumbnail generation is disabled')
  }
  return generateThumbnail(input, {
    maxWidth: 400,
    format: 'webp',
    quality: 80,
  })
}
