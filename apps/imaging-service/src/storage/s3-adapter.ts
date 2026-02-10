import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../env.js'
import type { StorageAdapter } from './types.js'
import { Readable } from 'stream'

export class S3StorageAdapter implements StorageAdapter {
  private client: S3Client
  private bucket: string

  constructor() {
    this.bucket = env.IMAGING_S3_BUCKET
    this.client = new S3Client({
      endpoint: env.IMAGING_S3_ENDPOINT || undefined,
      region: env.IMAGING_S3_REGION,
      credentials: {
        accessKeyId: env.IMAGING_S3_ACCESS_KEY_ID,
        secretAccessKey: env.IMAGING_S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: env.IMAGING_S3_FORCE_PATH_STYLE,
    })
  }

  async put(key: string, stream: NodeJS.ReadableStream, contentType?: string): Promise<void> {
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    const body = Buffer.concat(chunks)

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    )
  }

  async get(key: string): Promise<NodeJS.ReadableStream> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    )

    if (!response.Body) {
      throw new Error(`Object not found: ${key}`)
    }

    // AWS SDK v3 returns a ReadableStream-like object
    // Convert to Node.js Readable stream
    if (response.Body instanceof Readable) {
      return response.Body
    }

    // For other types (like ReadableStream from fetch), convert to Node Readable
    const stream = new Readable()
    const body = response.Body as any
    
    if (body instanceof Uint8Array) {
      stream.push(body)
      stream.push(null)
    } else if (typeof body.getReader === 'function') {
      // Web ReadableStream
      const reader = body.getReader()
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              stream.push(null)
              break
            }
            stream.push(Buffer.from(value))
          }
        } catch (err: any) {
          stream.destroy(err)
        }
      }
      pump()
    } else {
      // Fallback: try to pipe if it's a stream
      if (typeof body.pipe === 'function') {
        body.pipe(stream)
      } else {
        throw new Error(`Unsupported response body type for key: ${key}`)
      }
    }

    return stream
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      )
      return true
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false
      }
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    )
  }
}
