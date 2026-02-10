import { createHash } from 'crypto'
import { Readable } from 'stream'

/**
 * Compute SHA256 hash of a stream
 */
export async function computeSha256(stream: NodeJS.ReadableStream): Promise<string> {
  const hash = createHash('sha256')
  
  for await (const chunk of stream) {
    hash.update(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  
  return hash.digest('hex')
}

/**
 * Compute SHA256 hash of a buffer
 */
export function computeSha256FromBuffer(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex')
}
