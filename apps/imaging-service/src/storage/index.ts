import { env } from '../env.js'
import { S3StorageAdapter } from './s3-adapter.js'
import { NFSStorageAdapter } from './nfs-adapter.js'
import type { StorageAdapter } from './types.js'

let adapter: StorageAdapter | null = null

export function getStorageAdapter(): StorageAdapter {
  if (!adapter) {
    if (env.IMAGING_STORAGE_BACKEND === 's3') {
      adapter = new S3StorageAdapter()
    } else if (env.IMAGING_STORAGE_BACKEND === 'nfs') {
      adapter = new NFSStorageAdapter()
    } else {
      throw new Error(`Unknown storage backend: ${env.IMAGING_STORAGE_BACKEND}`)
    }
  }
  return adapter
}
