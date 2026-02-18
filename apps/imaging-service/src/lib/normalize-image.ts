/**
 * Normalize uploaded image buffers: convert HEIC/HEIF to JPEG so storage and
 * thumbnails use a single format. Sharp (used for thumbnails) does not support
 * HEIC in its prebuilt binaries.
 */

const HEIC_MIMES = new Set(['image/heic', 'image/heif'])
const HEIC_EXTENSIONS = new Set(['heic', 'heif'])

function getExtension(filename: string | undefined): string | null {
  if (!filename) return null
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ?? null
}

function isHeic(mimeType: string | undefined, filename: string | undefined): boolean {
  if (mimeType && HEIC_MIMES.has(mimeType)) return true
  const ext = getExtension(filename)
  return ext !== null && HEIC_EXTENSIONS.has(ext)
}

export interface NormalizeImageInput {
  buffer: Buffer
  filename?: string
  mimeType?: string
}

export interface NormalizeImageResult {
  buffer: Buffer
  mimeType: string
}

/**
 * If the input is HEIC/HEIF, convert to JPEG. Otherwise return buffer and
 * mimeType unchanged. Throws on conversion failure (e.g. corrupt HEIC).
 */
export async function normalizeImageBuffer(input: NormalizeImageInput): Promise<NormalizeImageResult> {
  const { buffer, filename, mimeType } = input
  const resolvedMime = mimeType ?? 'application/octet-stream'

  if (!isHeic(resolvedMime, filename)) {
    return { buffer, mimeType: resolvedMime }
  }

  try {
    // heic-convert is CJS; dynamic import for ESM compatibility
    const heicConvert = (await import('heic-convert')).default
    const jpegBuffer = await heicConvert({
      buffer,
      format: 'JPEG',
      quality: 0.9,
    })
    return { buffer: Buffer.from(jpegBuffer), mimeType: 'image/jpeg' }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`HEIC conversion failed: ${message}`)
  }
}
