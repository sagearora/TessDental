import { promises as fs } from 'fs'
import { createReadStream, createWriteStream } from 'fs'
import { dirname } from 'path'
import { env } from '../env.js'
import type { StorageAdapter } from './types.js'
import { pipeline } from 'stream/promises'

export class NFSStorageAdapter implements StorageAdapter {
  private baseDir: string

  constructor() {
    this.baseDir = env.IMAGING_NFS_BASE_DIR
  }

  private getFullPath(key: string): string {
    return `${this.baseDir}/${key}`
  }

  async put(key: string, stream: NodeJS.ReadableStream, contentType?: string): Promise<void> {
    const fullPath = this.getFullPath(key)
    await fs.mkdir(dirname(fullPath), { recursive: true })

    const writeStream = createWriteStream(fullPath)
    await pipeline(stream, writeStream)
  }

  async get(key: string): Promise<NodeJS.ReadableStream> {
    const fullPath = this.getFullPath(key)
    return createReadStream(fullPath)
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.getFullPath(key))
      return true
    } catch {
      return false
    }
  }

  async delete(key: string): Promise<void> {
    await fs.unlink(this.getFullPath(key))
  }
}
