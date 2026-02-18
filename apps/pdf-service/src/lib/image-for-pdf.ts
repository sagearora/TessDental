import sharp from 'sharp'

/**
 * Converts image buffer (WebP, PNG, HEIC, etc.) to JPEG for PDFKit.
 * PDFKit only supports JPEG and PNG; imaging service returns WebP for the "web" variant.
 */
export async function imageToJpegForPdf(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .jpeg({ quality: 90 })
    .toBuffer()
}
